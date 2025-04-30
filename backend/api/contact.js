// /api/contact.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, message, honeypot } = req.body;

    // Simple spam protection (honeypot field should be empty)
    if (honeypot) {
        return res.status(400).json({ error: 'Bot detected.' });
    }

    // Validate input
    if (
        !name ||
        name.length < 2 ||
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !message ||
        message.length < 5
    ) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    // Build email payload for Brevo API
    const payload = {
        sender: { name: name, email: email },
        to: [{ email: process.env.CONTACT_RECEIVER_EMAIL }],
        subject: `Neue Nachricht von ${name}`,
        htmlContent: `
        <h1>Neue Kontaktanfrage</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    try {
        const brevoResponse = await fetch(
            'https://api.brevo.com/v3/smtp/email',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY
                },
                body: JSON.stringify(payload)
            }
        );

        if (!brevoResponse.ok) {
            const errorDetails = await brevoResponse.json();
            console.error('Brevo Error:', errorDetails);
            return res.status(500).json({ error: 'Failed to send email.' });
        }

        return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Server error.' });
    }
}
