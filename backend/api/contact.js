import validator from 'validator';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, message, newsletterOptIn, honeypot } = req.body;

    // Honeypot Check
    if (honeypot) {
        console.log('Honeypot triggered:', honeypot);
        return res.status(200).json({ success: true });
    }

    // Validation
    if (
        !validator.isLength(name, { min: 2, max: 50 }) ||
        !validator.isEmail(email) ||
        !validator.isLength(message, { min: 10, max: 1000 })
    ) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    // Sanitize Inputs
    const sanitizedName = validator.escape(name);
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedMessage = validator.escape(message);

    try {
        // Send Contact Email
        const emailResult = await sendBrevoEmail({
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage
        });

        // Handle Newsletter Opt-In
        if (newsletterOptIn) {
            await addToBrevoNewsletter(sanitizedName, sanitizedEmail);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function sendBrevoEmail({ name, email, message }) {
    const toEmail = process.env.MAIL_TO;
    const brevoApiKey = process.env.BREVO_API_KEY;

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Contact from ${name}</title>
    </head>
    <body style="margin: 0; padding: 20px; background: #F3F4F6;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="https://keymoji.wtf/images/keymoji-logo.webp" 
                     alt="Keymoji Logo" 
                     style="height: 60px;">
            </div>
            
            <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 16px;">
                Neue Nachricht von ${name}
            </h2>
            
            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; color: #4B5563;">
                    <strong>Email:</strong> ${email}
                </p>
                <p style="margin: 0; color: #4B5563; white-space: pre-wrap;">
                    ${message}
                </p>
            </div>
            
            <div style="margin-top: 24px; text-align: center;">
                <a href="https://keymoji.wtf" 
                   style="display: inline-block; padding: 12px 24px; 
                          background: #F59E0B; color: white; 
                          text-decoration: none; border-radius: 50px;
                          font-weight: 500;">
                    Zur Website
                </a>
            </div>
        </div>
    </body>
    </html>`;

    const payload = {
        sender: { name: 'Keymoji Website', email: 'no-reply@keymoji.wtf' },
        to: [{ email: toEmail }],
        subject: `Neue Kontaktanfrage von ${name}`,
        htmlContent: emailHtml,
        tags: ['contact-form'],
        headers: { 'X-Mailin-custom': 'contact-form' }
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': brevoApiKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Brevo API Error: ${errorData.message}`);
    }

    return response.json();
}

async function addToBrevoNewsletter(name, email) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const listId = process.env.BREVO_LIST_ID;

    const contactData = {
        email: email,
        attributes: { VORNAME: name },
        listIds: [Number(listId)],
        updateEnabled: true
    };

    const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
            'api-key': brevoApiKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify(contactData)
    });

    if (!response.ok && response.status !== 400) {
        const errorData = await response.json();
        throw new Error(`Brevo Newsletter Error: ${errorData.message}`);
    }
}
