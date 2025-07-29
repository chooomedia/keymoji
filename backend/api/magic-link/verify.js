/**
 * Magic Link Verification API
 * Verifiziert Magic Links und loggt Benutzer ein
 */

import validator from 'validator';
import crypto from 'crypto';

export default async function handler(req, res) {
    // Set CORS headers - Allow both production and development
    const allowedOrigins = [
        'https://keymoji.wtf',
        'http://localhost:8080',
        'http://127.0.0.1:8080'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

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
        const { token, userId } = req.body;

        // Validate required fields
        if (!token || !userId) {
            return res.status(400).json({
                error: `Missing required fields: ${!token ? 'token' : ''}${
                    !token && !userId ? ', ' : ''
                }${!userId ? 'userId' : ''}`
            });
        }

        // Sanitize inputs
        const sanitizedToken = validator.escape(token);
        const sanitizedUserId = validator.escape(userId);

        console.log('🔗 Magic Link verification request:', {
            userId: sanitizedUserId,
            hasToken: !!sanitizedToken
        });

        // TODO: Implement actual token verification logic
        // For now, we'll simulate a successful verification

        // Verify token (placeholder logic)
        const isValidToken = await verifyMagicLinkToken(
            sanitizedToken,
            sanitizedUserId
        );

        if (!isValidToken) {
            return res.status(400).json({
                error: 'Invalid or expired magic link token'
            });
        }

        // Get account details
        const accountData = {
            action: 'get',
            userId: sanitizedUserId,
            timestamp: new Date().toISOString()
        };

        // Send to n8n webhook to get account
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
            throw new Error('Failed to retrieve account');
        }

        const responseText = await n8nResponse.text();
        let account;

        if (!responseText || responseText.trim() === '') {
            // Create default account if not found
            account = {
                userId: sanitizedUserId,
                tier: 'FREE',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
        } else {
            const n8nResult = JSON.parse(responseText);
            if (!n8nResult.success) {
                throw new Error('Account retrieval failed');
            }
            account = n8nResult.account;
        }

        // Update last login
        account.lastLogin = new Date().toISOString();

        console.log('✅ Magic link verified successfully:', sanitizedUserId);

        return res.status(200).json({
            success: true,
            account,
            message: 'Magic link verified successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Magic link verification error:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
}

/**
 * Verify magic link token
 * TODO: Implement actual token verification logic
 */
async function verifyMagicLinkToken(token, userId) {
    // Placeholder implementation
    // In a real implementation, you would:
    // 1. Decode the token
    // 2. Check if it's expired
    // 3. Verify it matches the user
    // 4. Check if it's been used before

    // For now, we'll accept any token that looks valid
    return token && token.length > 10 && userId;
}
