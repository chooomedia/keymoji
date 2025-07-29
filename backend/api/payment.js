// backend/api/payment.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, currency = 'eur', description } = req.body;

        // Validate amount
        if (!amount || amount < 100) {
            // Minimum 1 EUR (100 cents)
            return res.status(400).json({
                error: 'Invalid amount. Minimum donation is 1 EUR.'
            });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Amount in cents
            currency: currency.toLowerCase(),
            description: description || 'Keymoji donation',
            metadata: {
                source: 'keymoji_donation',
                user_agent: req.headers['user-agent'] || '',
                ip:
                    req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress
            },
            automatic_payment_methods: {
                enabled: true
            }
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Payment intent creation failed:', error);

        res.status(500).json({
            error: 'Failed to create payment intent',
            details:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined
        });
    }
};
