import { createMagicLinkEmail } from '../email-templates.js';

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
        const { email, name, userId, language } = req.body;

        // Validate required fields
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                error: 'Email and name are required'
            });
        }

        // Generate magic link token
        const token =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Construct magic link URL
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';
        const magicLink = `${baseUrl}/magic-link?token=${token}&email=${encodeURIComponent(
            email
        )}`;

        // Send email via Brevo
        const brevoApiKey = process.env.BREVO_API_KEY;
        if (!brevoApiKey) {
            console.error('❌ BREVO_API_KEY not configured');
            return res.status(500).json({
                success: false,
                error: 'Email service not configured'
            });
        }

        const htmlContent = createMagicLinkEmail({
            name,
            email,
            magicLink
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
            subject: 'Ihr Magic Link für Keymoji 🔐',
            htmlContent: htmlContent,
            tags: ['magic-link']
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
            console.error('❌ Brevo API error:', response.status, errorData);
            return res.status(500).json({
                success: false,
                error: 'Failed to send magic link'
            });
        }

        console.log('✅ Magic link email sent successfully to:', email);

        // Send data to n8n webhook for analytics
        try {
            const n8nWebhookUrl = process.env.N8N_ACCOUNT_WEBHOOK_URL;
            if (n8nWebhookUrl) {
                await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'magic_link_sent',
                        email: email,
                        name: name,
                        userId: userId,
                        language: language || 'en',
                        timestamp: new Date().toISOString(),
                        appVersion: process.env.APP_VERSION || '0.4.3'
                    })
                });
            }
        } catch (webhookError) {
            console.warn(
                '⚠️ Failed to send to n8n webhook:',
                webhookError.message
            );
        }

        return res.status(200).json({
            success: true,
            message: 'Magic link sent successfully',
            expiresAt: expiresAt.toISOString()
        });
    } catch (error) {
        console.error('❌ Magic link error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send magic link'
        });
    }
}
