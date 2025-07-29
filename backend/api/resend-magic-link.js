// backend/api/resend-magic-link.js
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        // Generate new magic link token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create magic link URL
        const baseUrl = process.env.VERCEL_URL || 'http://localhost:8080';
        const magicLinkUrl = `${baseUrl}/en/magic-link?token=${token}&email=${encodeURIComponent(
            email
        )}`;

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
                            email: email
                        }
                    ],
                    subject: '🔗 Your Keymoji Magic Link (Resent)',
                    htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 20px; text-align: center;">
                            <h1 style="color: #1f2937; margin: 0; font-size: 28px;">🔗 Keymoji Magic Link</h1>
                        </div>
                        
                        <div style="padding: 30px; background: #ffffff;">
                            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello!</h2>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 25px;">
                                Here's your magic link to sign in to Keymoji. No password needed!
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${magicLinkUrl}" 
                                   style="background: #fbbf24; color: #1f2937; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    🚀 Sign In to Keymoji
                                </a>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                                This magic link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            
                            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                                Developed with ❤️ in Switzerland
                            </p>
                        </div>
                    </div>
                `
                })
            }
        );

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.text();
            console.error('Brevo API error:', errorData);
            throw new Error('Failed to send email via Brevo');
        }

        console.log('✅ Magic link resent successfully to:', email);

        res.status(200).json({
            success: true,
            message: 'Magic link resent successfully',
            email: email
        });
    } catch (error) {
        console.error('❌ Magic link resend failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to resend magic link'
        });
    }
}
