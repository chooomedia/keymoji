/**
 * Email Template Test API
 * - Für Entwicklung und Testing der Email-Templates
 * - Zeigt alle verfügbaren Templates
 * - Nur in Development verfügbar
 */

import {
    createWelcomeEmail,
    createMagicLinkEmail,
    createAccountUpdateEmail,
    createPasswordResetEmail
} from './email-templates.js';

export default async function handler(req, res) {
    // Nur in Development verfügbar
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ error: 'Not found' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { template, data } = req.method === 'POST' ? req.body : req.query;

        // Test-Daten
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            userId: 'user_test_123',
            tier: 'FREE',
            magicLinkUrl:
                'https://keymoji.wtf/en/magic-link?token=test123&email=test@example.com',
            updateType: 'Profile Update',
            details: 'Email address updated',
            resetUrl: 'https://keymoji.wtf/en/reset-password?token=reset123'
        };

        // Verwende bereitgestellte Daten oder Test-Daten
        const emailData = { ...testData, ...data };

        let htmlContent;
        let subject;

        switch (template) {
            case 'welcome':
                htmlContent = createWelcomeEmail(emailData);
                subject = '🎉 Welcome to Keymoji!';
                break;

            case 'magic-link':
                htmlContent = createMagicLinkEmail(emailData);
                subject = '🔗 Your Keymoji Magic Link';
                break;

            case 'account-update':
                htmlContent = createAccountUpdateEmail(emailData);
                subject = '📝 Your Keymoji Account Has Been Updated';
                break;

            case 'password-reset':
                htmlContent = createPasswordResetEmail(emailData);
                subject = '🔐 Reset Your Keymoji Password';
                break;

            case 'all':
                // Zeige alle Templates
                const templates = {
                    welcome: {
                        subject: '🎉 Welcome to Keymoji!',
                        html: createWelcomeEmail(emailData)
                    },
                    magicLink: {
                        subject: '🔗 Your Keymoji Magic Link',
                        html: createMagicLinkEmail(emailData)
                    },
                    accountUpdate: {
                        subject: '📝 Your Keymoji Account Has Been Updated',
                        html: createAccountUpdateEmail(emailData)
                    },
                    passwordReset: {
                        subject: '🔐 Reset Your Keymoji Password',
                        html: createPasswordResetEmail(emailData)
                    }
                };

                return res.status(200).json({
                    success: true,
                    templates,
                    testData: emailData
                });

            default:
                return res.status(400).json({
                    error: 'Invalid template. Available: welcome, magic-link, account-update, password-reset, all'
                });
        }

        return res.status(200).json({
            success: true,
            template,
            subject,
            htmlContent,
            testData: emailData
        });
    } catch (error) {
        console.error('❌ Email test error:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
}
