/**
 * Sendet eine styled E-Mail an den Benutzer
 * - Verbesserte Dark/Light-Modus Implementierung nach W3C-Standards
 * - Angepasstes Layout für bessere Mobildarstellung
 * - Entfernung der Donate-Sektion und Ersetzung durch Footer-Link
 * - Bessere E-Mail-Client-Kompatibilität
 */

import validator from 'validator';
import { createContactEmail } from './email-templates.js';

async function sendUserEmail({ name, email, message, emailContent = {} }) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
        console.error('❌ BREVO_API_KEY not configured for contact email');
        throw new Error('Email service not configured');
    }

    const htmlContent = createContactEmail({
        name,
        email,
        message,
        emailContent
    });

    const payload = {
        sender: {
            name: 'Keymoji',
            email: process.env.MAIL_TO || 'noreply@keymoji.wtf'
        },
        to: [
            {
                email: email,
                name: name
            }
        ],
        subject: 'Bestätigung Ihrer Nachricht - Keymoji 📧',
        htmlContent: htmlContent,
        tags: ['contact-confirmation']
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error(
            '❌ Brevo API error for contact email:',
            response.status,
            errorData
        );
        throw new Error('Failed to send contact confirmation email');
    }

    console.log('✅ Contact confirmation email sent successfully to:', email);
    return response.json();
}

async function sendToN8nWebhook({
    name,
    email,
    message,
    newsletterOptIn,
    langCode,
    appVersion
}) {
    const n8nWebhookUrl = process.env.N8N_ACCOUNT_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
        console.warn('⚠️ N8N_ACCOUNT_WEBHOOK_URL not configured');
        return;
    }

    try {
        await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'contact_form_submitted',
                name: name,
                email: email,
                message: message,
                newsletterOptIn: newsletterOptIn || false,
                language: langCode || 'en',
                timestamp: new Date().toISOString(),
                appVersion: appVersion || process.env.APP_VERSION || '0.4.3'
            })
        });
        console.log('✅ Contact form data sent to n8n webhook');
    } catch (error) {
        console.warn(
            '⚠️ Failed to send contact form data to n8n:',
            error.message
        );
    }
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message, newsletterOptIn, langCode, appVersion } =
            req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Name, email, and message are required'
            });
        }

        // Sanitize inputs
        const sanitizedName = validator.escape(name.trim());
        const sanitizedEmail = validator.normalizeEmail(email.trim());
        const sanitizedMessage = validator.escape(message.trim());

        // Validate email format
        if (!validator.isEmail(sanitizedEmail)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Validate message length
        if (sanitizedMessage.length < 10) {
            return res.status(400).json({
                error: 'Message must be at least 10 characters long'
            });
        }

        if (sanitizedMessage.length > 1000) {
            return res.status(400).json({
                error: 'Message must be less than 1000 characters'
            });
        }

        // Send confirmation email to user
        try {
            await sendUserEmail({
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMessage,
                emailContent: {
                    newsletterOptIn: newsletterOptIn || false,
                    language: langCode || 'en'
                }
            });
        } catch (emailError) {
            console.error('❌ Failed to send user email:', emailError.message);
            return res.status(500).json({
                error: 'Failed to send confirmation email'
            });
        }

        // Send data to n8n webhook for analytics
        await sendToN8nWebhook({
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage,
            newsletterOptIn: newsletterOptIn || false,
            langCode: langCode || 'en',
            appVersion: appVersion || process.env.APP_VERSION || '0.4.3'
        });

        return res.status(200).json({
            success: true,
            message: 'Contact form submitted successfully'
        });
    } catch (error) {
        console.error('❌ Contact form error:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
