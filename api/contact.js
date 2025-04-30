// api/contact.js
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Brevo-Konfiguration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hi@keymoji.wtf';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'contact@keymoji.wtf';
const SENDER_NAME = process.env.SENDER_NAME || 'Keymoji Team';
const ADMIN_TEMPLATE_ID = parseInt(process.env.ADMIN_TEMPLATE_ID || '1', 10);
const USER_TEMPLATE_ID = parseInt(process.env.USER_TEMPLATE_ID || '2', 10);

// Konfigurieren Sie CORS-Domains
const ALLOWED_ORIGINS = (
    process.env.ALLOWED_ORIGINS || 'https://keymoji.wtf'
).split(',');

export default async function handler(req, res) {
    // CORS-Einstellungen
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Requested-With'
    );

    // OPTIONS-Anfragen für CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Nur POST-Anfragen verarbeiten
    if (req.method !== 'POST') {
        return res
            .status(405)
            .json({ success: false, error: 'Method not allowed' });
    }

    try {
        // Formulardaten extrahieren
        const { name, email, message, formTime, honeypot } = req.body;

        // Grundlegende Validierung
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: ['All fields are required']
            });
        }

        // Spam-Prüfung
        if (honeypot || formTime < 3000) {
            // Stille Ablehnung - Erfolg melden aber keine E-Mail senden
            return res.status(200).json({ success: true });
        }

        // Brevo-API-Client initialisieren
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = BREVO_API_KEY;
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        // Admin-E-Mail senden
        const adminEmail = new SibApiV3Sdk.SendSmtpEmail();
        adminEmail.to = [{ email: ADMIN_EMAIL, name: 'Admin' }];
        adminEmail.templateId = ADMIN_TEMPLATE_ID;
        adminEmail.params = {
            NAME: name,
            EMAIL: email,
            MESSAGE: message,
            SUBMISSION_TIME: new Date().toISOString()
        };
        adminEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
        adminEmail.replyTo = { name, email };

        await apiInstance.sendTransacEmail(adminEmail);

        // Benutzer-E-Mail senden
        const userEmail = new SibApiV3Sdk.SendSmtpEmail();
        userEmail.to = [{ email, name }];
        userEmail.templateId = USER_TEMPLATE_ID;
        userEmail.params = { NAME: name };
        userEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };

        await apiInstance.sendTransacEmail(userEmail);

        // Erfolgreiche Antwort
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send email'
        });
    }
}
