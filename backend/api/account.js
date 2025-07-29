/**
 * Account Management API
 * - Integriert mit n8n für Google Sheets Storage
 * - Unterstützt Account Creation, Updates, Retrieval
 * - Email-Benachrichtigungen via Brevo
 */

import validator from 'validator';
import crypto from 'crypto';
import {
    createWelcomeEmail,
    createAccountUpdateEmail
} from './email-templates.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://keymoji.wtf');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Requested-With'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { action, userId, email, profile, metadata } = req.body;

        // Validate required fields
        if (!action || !userId) {
            return res.status(400).json({
                error: 'Missing required fields: action, userId'
            });
        }

        // Validate action
        const validActions = ['create', 'get', 'update'];
        if (!validActions.includes(action)) {
            return res.status(400).json({
                error: `Invalid action: ${action}. Must be one of: ${validActions.join(
                    ', '
                )}`
            });
        }

        // Sanitize inputs
        const sanitizedUserId = validator.escape(userId);
        const sanitizedEmail = email ? validator.normalizeEmail(email) : '';
        const sanitizedProfile = profile || {};
        const sanitizedMetadata = metadata || {};

        console.log('📝 Account API request:', {
            action,
            userId: sanitizedUserId,
            hasEmail: !!sanitizedEmail,
            hasProfile: !!Object.keys(sanitizedProfile).length,
            hasMetadata: !!Object.keys(sanitizedMetadata).length
        });

        let result;

        switch (action) {
            case 'create':
                result = await handleAccountCreation({
                    userId: sanitizedUserId,
                    email: sanitizedEmail,
                    profile: sanitizedProfile,
                    metadata: sanitizedMetadata
                });
                break;

            case 'get':
                result = await handleAccountRetrieval(sanitizedUserId);
                break;

            case 'update':
                result = await handleAccountUpdate({
                    userId: sanitizedUserId,
                    email: sanitizedEmail,
                    profile: sanitizedProfile,
                    metadata: sanitizedMetadata
                });
                break;

            default:
                throw new Error(`Unknown action: ${action}`);
        }

        return res.status(200).json({
            success: true,
            account: result,
            message: `Account ${action} successful`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Account API error:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
}

/**
 * Handle account creation
 */
async function handleAccountCreation({ userId, email, profile, metadata }) {
    // Validate email for creation
    if (!email || !validator.isEmail(email)) {
        throw new Error('Valid email is required for account creation');
    }

    // Create account data
    const accountData = {
        action: 'create',
        userId,
        email,
        profile,
        metadata: {
            ...metadata,
            createdAt: new Date().toISOString(),
            createdVia: 'vercel-api'
        },
        timestamp: new Date().toISOString()
    };

    // Send to n8n webhook
    const n8nWebhookUrl =
        process.env.N8N_ACCOUNT_WEBHOOK_URL ||
        'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account';

    const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
    });

    if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('❌ n8n webhook error:', errorText);
        throw new Error('Failed to create account via n8n');
    }

    const responseText = await n8nResponse.text();
    console.log('📡 n8n response text:', responseText);

    // Handle empty response (n8n might return empty response)
    if (!responseText || responseText.trim() === '') {
        console.log('⚠️ Empty response from n8n - creating local account');
        const localAccount = {
            userId,
            email,
            tier: 'FREE',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: profile || {},
            status: 'active',
            metadata: metadata || {}
        };

        // Send welcome email
        await sendWelcomeEmail({
            name: profile?.name || 'Keymoji User',
            email,
            userId
        });

        console.log(
            '✅ Account created successfully (local fallback):',
            userId
        );
        return localAccount;
    }

    let n8nResult;
    try {
        n8nResult = JSON.parse(responseText);
    } catch (error) {
        console.error('❌ Failed to parse n8n response:', error);
        throw new Error('Invalid response from n8n');
    }

    if (!n8nResult.success) {
        throw new Error(n8nResult.error || 'Account creation failed');
    }

    // Send welcome email
    await sendWelcomeEmail({
        name: profile.name || 'Keymoji User',
        email,
        userId
    });

    console.log('✅ Account created successfully:', userId);
    return n8nResult.account;
}

/**
 * Handle account retrieval
 */
async function handleAccountRetrieval(userId) {
    const accountData = {
        action: 'get',
        userId,
        timestamp: new Date().toISOString()
    };

    // Send to n8n webhook
    const n8nWebhookUrl =
        process.env.N8N_ACCOUNT_WEBHOOK_URL ||
        'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account';

    const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
    });

    if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('❌ n8n webhook error:', errorText);
        throw new Error('Failed to retrieve account via n8n');
    }

    const responseText = await n8nResponse.text();
    console.log('📡 n8n response text:', responseText);

    // Handle empty response (n8n might return empty response)
    if (!responseText || responseText.trim() === '') {
        console.log('⚠️ Empty response from n8n - returning default account');
        const defaultAccount = {
            userId,
            tier: 'FREE',
            createdAt: new Date().toISOString(),
            lastSeen: new Date().toISOString()
        };
        return defaultAccount;
    }

    let n8nResult;
    try {
        n8nResult = JSON.parse(responseText);
    } catch (error) {
        console.error('❌ Failed to parse n8n response:', error);
        throw new Error('Invalid response from n8n');
    }

    if (!n8nResult.success) {
        throw new Error(n8nResult.error || 'Account retrieval failed');
    }

    console.log('✅ Account retrieved successfully:', userId);
    return n8nResult.account;
}

/**
 * Handle account update
 */
async function handleAccountUpdate({ userId, email, profile, metadata }) {
    const accountData = {
        action: 'update',
        userId,
        email,
        profile,
        metadata: {
            ...metadata,
            updatedAt: new Date().toISOString(),
            updatedVia: 'vercel-api'
        },
        timestamp: new Date().toISOString()
    };

    // Send to n8n webhook
    const n8nWebhookUrl =
        process.env.N8N_ACCOUNT_WEBHOOK_URL ||
        'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account';

    const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
    });

    if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('❌ n8n webhook error:', errorText);
        throw new Error('Failed to update account via n8n');
    }

    const responseText = await n8nResponse.text();
    console.log('📡 n8n response text:', responseText);

    // Handle empty response (n8n might return empty response)
    if (!responseText || responseText.trim() === '') {
        console.log('⚠️ Empty response from n8n - updating local account');
        const updatedAccount = {
            userId,
            email,
            profile: profile || {},
            metadata: metadata || {},
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return updatedAccount;
    }

    let n8nResult;
    try {
        n8nResult = JSON.parse(responseText);
    } catch (error) {
        console.error('❌ Failed to parse n8n response:', error);
        throw new Error('Invalid response from n8n');
    }

    if (!n8nResult.success) {
        throw new Error(n8nResult.error || 'Account update failed');
    }

    console.log('✅ Account updated successfully:', userId);
    return n8nResult.account;
}

/**
 * Send welcome email via Brevo
 */
async function sendWelcomeEmail({ name, email, userId }) {
    try {
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
                    subject: '🎉 Welcome to Keymoji!',
                    htmlContent: createWelcomeEmail({ name, email, userId })
                })
            }
        );

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.text();
            console.error('❌ Brevo API error:', errorData);
            // Don't throw error for email failure - account creation should still succeed
        } else {
            console.log('✅ Welcome email sent successfully to:', email);
        }
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // Don't throw error for email failure
    }
}
