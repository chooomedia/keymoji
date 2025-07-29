/**
 * Account Update API
 * Aktualisiert Account-Informationen
 */

import validator from 'validator';

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
        const { userId, email, profile, metadata } = req.body;

        // Validate required fields
        if (!userId) {
            return res.status(400).json({
                error: 'Missing required field: userId'
            });
        }

        // Sanitize inputs
        const sanitizedUserId = validator.escape(userId);
        const sanitizedEmail = email ? validator.normalizeEmail(email) : '';
        const sanitizedProfile = profile || {};
        const sanitizedMetadata = metadata || {};

        console.log('📝 Account Update request:', {
            userId: sanitizedUserId,
            hasEmail: !!sanitizedEmail,
            hasProfile: !!Object.keys(sanitizedProfile).length,
            hasMetadata: !!Object.keys(sanitizedMetadata).length
        });

        // Update account
        const result = await handleAccountUpdate({
            userId: sanitizedUserId,
            email: sanitizedEmail,
            profile: sanitizedProfile,
            metadata: sanitizedMetadata
        });

        return res.status(200).json({
            success: true,
            account: result,
            message: 'Account updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Account update error:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
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
