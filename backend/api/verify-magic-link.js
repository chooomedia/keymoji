// backend/api/verify-magic-link.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { token, email } = req.body;

        if (!token || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, verify token from database
        // For now, we'll use a simple approach
        console.log('🔍 Verifying magic link:', {
            token: token.substring(0, 8) + '...',
            email
        });

        // Simulate token verification
        // In production, check against stored tokens
        const isValidToken = true; // Replace with actual verification logic

        if (!isValidToken) {
            return res
                .status(400)
                .json({ error: 'Invalid or expired magic link' });
        }

        // Update user account status
        // In production, update user record in database
        console.log('✅ Magic link verified for:', email);

        res.status(200).json({
            success: true,
            message: 'Magic link verified successfully',
            email: email
        });
    } catch (error) {
        console.error('❌ Magic link verification failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify magic link'
        });
    }
}
