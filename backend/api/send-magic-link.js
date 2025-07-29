// backend/api/send-magic-link.js
import crypto from 'crypto';
import { createMagicLinkEmail } from './email-templates.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, name, userId, language } = req.body;

        if (!email || !name || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate magic link token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store token in database or cache (for now, we'll use a simple approach)
        // In production, use a proper database
        const magicLinkData = {
            token,
            email,
            userId,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString()
        };

        // Create magic link URL
        const baseUrl = process.env.VERCEL_URL || 'http://localhost:8080';
        const magicLinkUrl = `${baseUrl}/${
            language || 'en'
        }/magic-link?token=${token}&email=${encodeURIComponent(email)}`;

        // Send email via Brevo
        const brevoResponse = await fetch(
            'https://api.brevo.com/v3/smtp/email',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY
                },
                body: JSON.stringify({
                    sender: {
                        name: 'Keymoji',
                        email: 'noreply@its.keymoji.wtf'
                    },
                    to: [
                        {
                            email: email,
                            name: name
                        }
                    ],
                    subject: '🔗 Your Keymoji Magic Link',
                    htmlContent: createMagicLinkEmail({
                        name,
                        magicLinkUrl
                    })
                })
            }
        );

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.text();
            console.error('Brevo API error:', errorData);
            throw new Error('Failed to send email via Brevo');
        }

        console.log('✅ Magic link sent successfully to:', email);

        res.status(200).json({
            success: true,
            message: 'Magic link sent successfully',
            email: email
        });
    } catch (error) {
        console.error('❌ Magic link sending failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send magic link'
        });
    }
}
