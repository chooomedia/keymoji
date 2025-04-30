export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, message, honeypot } = req.body;

    if (honeypot) {
        return res.status(400).json({ error: 'Spam detected' });
    }

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const toEmail = process.env.MAIL_TO;

    if (!toEmail) {
        return res
            .status(500)
            .json({ error: 'Server configuration error (missing MAIL_TO)' });
    }

    const payload = {
        sender: { name, email },
        to: [{ email: toEmail }],
        subject: `Neue Nachricht von ${name}`,
        htmlContent: `<p><strong>Von:</strong> ${name} (${email})</p><p><strong>Nachricht:</strong></p><p>${message}</p>`
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Brevo Error:', data);
            return res
                .status(500)
                .json({ error: 'Brevo API Error', brevo: data });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
