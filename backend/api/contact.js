import validator from 'validator';
import { appVersion } from '../utils/version.js';

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

    // Extract data including emailContent
    const {
        name,
        email,
        message,
        newsletterOptIn,
        honeypot,
        emailContent,
        langCode
    } = req.body;

    // Log the request for debugging
    console.log('Received contact form submission:', {
        name,
        email,
        hasMessage: !!message,
        newsletterOptIn,
        hasEmailContent: !!emailContent,
        langCode
    });

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
        // First, notify the admin with a plain email
        await sendAdminNotification({
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage,
            newsletterOptIn
        });

        // Then, send styled email to the user
        await sendUserEmail({
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage,
            emailContent: emailContent || {},
            langCode: langCode || 'en'
        });

        // Handle Newsletter Opt-In
        if (newsletterOptIn) {
            await addToBrevoNewsletter(sanitizedName, sanitizedEmail, langCode);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Sends a simple notification email to the admin
 */
async function sendAdminNotification({
    name,
    email,
    message,
    newsletterOptIn
}) {
    const toEmail = process.env.ADMIN_EMAIL || 'hi@keymoji.wtf';
    const brevoApiKey = process.env.BREVO_API_KEY;

    // Simple text-based email for admin
    const adminContent = `
New contact form submission received:

Name: ${name}
Email: ${email}
Message: ${message}
Newsletter opt-in: ${newsletterOptIn ? 'Yes' : 'No'}

Timestamp: ${new Date().toISOString()}
    `;

    const payload = {
        sender: { name: 'Keymoji Contact Form', email: 'no-reply@keymoji.wtf' },
        to: [{ email: toEmail }],
        subject: `[Keymoji] New contact from ${name}`,
        textContent: adminContent,
        tags: ['contact-form-admin'],
        headers: { 'X-Mailin-custom': 'contact-form-admin' }
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
        throw new Error(`Admin notification error: ${errorData.message}`);
    }

    return response.json();
}

/**
 * Sends a styled email to the user
 */
async function sendUserEmail({
    name,
    email,
    message,
    emailContent = {},
    langCode = 'en'
}) {
    const brevoApiKey = process.env.BREVO_API_KEY;

    // Default values for email template content
    const defaultEmailContent = {
        greeting: 'Hello',
        intro: 'Thank you for contacting us.',
        doubleCheck: "We've received your message with the following details:",
        button: 'Confirm Your Email',
        subject: 'Your message to Keymoji has been received',
        footer: 'Developed with love'
    };

    // Use provided emailContent with fallbacks to default values
    const emailTemplate = {
        greeting: emailContent.greeting || defaultEmailContent.greeting,
        intro: emailContent.intro || defaultEmailContent.intro,
        doubleCheck:
            emailContent.doubleCheck || defaultEmailContent.doubleCheck,
        button: emailContent.button || defaultEmailContent.button,
        subject: emailContent.subject || defaultEmailContent.subject,
        footer: emailContent.footer || defaultEmailContent.footer
    };

    // Define webhookOptin URL with fallback
    const webhookOptin =
        process.env.WEBHOOK_OPTIN ||
        'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-optin-keymoji';

    // Language flags - based on available languages
    const languageFlags = {
        en: '🇺🇸',
        de: '🇩🇪',
        dech: '🇨🇭',
        es: '🇪🇸',
        nl: '🇳🇱',
        it: '🇮🇹',
        fr: '🇫🇷',
        pl: '🇵🇱',
        da: '🇩🇰',
        ru: '🇷🇺',
        tr: '🇹🇷',
        af: '🇿🇦',
        ja: '🇯🇵',
        ko: '🇰🇷',
        tlh: '🖖',
        qya: '🧝‍♀️'
    };

    // Create language flags HTML
    const flagsHtml = Object.entries(languageFlags)
        .map(
            ([code, flag]) =>
                `<span style="margin-right:5px;font-size:16px;line-height:24px;" title="${code.toUpperCase()}">${flag}</span>`
        )
        .join('');

    // Version info
    const versionInfo = `v${process.env.APP_VERSION || '0.4.0'}`;

    const emailHtml = `
    <!DOCTYPE html>
    <html dir="ltr" lang="${langCode}" style="margin: 0; padding: 0;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${emailTemplate.subject}</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            /* Base styles with fallbacks */
            :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
            }
            body, table, td {
                font-family: 'Graphik', Arial, sans-serif;
            }
            /* Light mode (default) */
            .light-mode {
                background-color: #f5f5f5;
            }
            .light-content {
                background-color: #ffffff;
            }
            .light-text {
                color: #273444;
            }
            .light-secondary-text {
                color: #8492a6;
            }
            .light-card {
                background-color: #f5f5f5;
            }
            .light-footer {
                color: #8492a6;
            }
            /* Dark mode support where available */
            @media (prefers-color-scheme: dark) {
                .body-dark {
                    background-color: #070610 !important;
                }
                .content-dark {
                    background-color: #253852 !important;
                }
                .text-dark {
                    color: #f5f5f5 !important;
                }
                .secondary-text-dark {
                    color: #d3dce6 !important;
                }
                .card-dark {
                    background-color: #0e1e31 !important;
                }
                .footer-dark {
                    color: #8492a6 !important;
                }
            }
        </style>
    </head>
    <body class="body-dark light-mode" style="margin: 0;padding: 0;background-color: #f5f5f5;color: #273444;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">
        <!-- EMAIL WRAPPER -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tbody>
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <!-- EMAIL CONTAINER -->
                    <table role="presentation" class="content-dark light-content" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" cellspacing="0" cellpadding="0" border="0">
                        <!-- HEADER with compact layout -->
                        <tbody>
                        <tr>
                            <td bgcolor="#243852" style="padding: 20px; border-radius: 12px 12px 0 0;">
                                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td width="60" valign="middle">
                                            <!-- LOGO -->
                                            <svg role="img" viewBox="0 0 600 600" fill="currentColor" width="60" height="60" style="color: #f4ab25"><g><path style="opacity:0.996" fill="currentColor" d="M 529.5,329.5 C 477.279,418.388 403.612,482.721 308.5,522.5C 220.205,523.773 151.039,488.439 101,416.5C 62.9557,353.126 56.9557,286.793 83,217.5C 114.982,145.861 169.149,100.695 245.5,82C 324.316,65.9546 394.649,83.288 456.5,134C 513.71,186.787 538.043,251.954 529.5,329.5 Z"></path></g></svg>
                                        </td>
                                        <td valign="middle" style="padding-left: 15px;">
                                            <h1 style="font-size: 22px; color: #ffffff; margin: 0; padding: 0;">Keymoji</h1>
                                            <p style="font-size: 14px; color: #f4ab25; margin: 0; padding: 0;">Emoji Password Generator</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- GREETING -->
                        <tr>
                            <td align="left" class="text-dark light-text" style="padding: 24px 24px 12px 24px; color: #273444;">
                                <h2 style="font-size: 20px; margin: 0;">${
                                    emailTemplate.greeting
                                }, ${name} 👋</h2>
                            </td>
                        </tr>
                        
                        <!-- INTRO TEXT -->
                        <tr>
                            <td align="left" class="text-dark light-text" style="padding: 12px 24px; color: #273444; font-size: 16px; line-height: 1.5;">
                                <p style="margin: 0 0 16px 0;">${
                                    emailTemplate.intro
                                }</p>
                                <p style="margin: 0 0 16px 0;">${
                                    emailTemplate.doubleCheck
                                }</p>
                            </td>
                        </tr>
                        
                        <!-- MESSAGE DETAILS -->
                        <tr>
                            <td align="left" style="padding: 0 24px;">
                                <table role="presentation" width="100%" class="card-dark light-card" style="margin-bottom: 24px; background-color: #f5f5f5; border-radius: 8px; border-left: 4px solid #f4ab25;" cellspacing="0" cellpadding="0" border="0">
                                    <tbody><tr>
                                        <td class="text-dark light-text" style="padding: 16px; color: #273444;">
                                            <p style="margin: 0 0 8px 0; font-weight: 600;">Message Details:</p>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tbody><tr>
                                                    <td width="80" valign="top" class="text-dark light-text" style="padding: 4px 8px 4px 0; color: #273444; font-weight: 600;">Name:</td>
                                                    <td valign="top" class="text-dark light-text" style="padding: 4px 0; color: #273444;">${name}</td>
                                                </tr>
                                                <tr>
                                                    <td width="80" valign="top" class="text-dark light-text" style="padding: 4px 8px 4px 0; color: #273444; font-weight: 600;">Email:</td>
                                                    <td valign="top" class="text-dark light-text" style="padding: 4px 0; color: #273444;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td width="80" valign="top" class="text-dark light-text" style="padding: 4px 8px 4px 0; color: #273444; font-weight: 600;">Message:</td>
                                                    <td valign="top" class="text-dark light-text" style="padding: 4px 0; color: #273444;">${message}</td>
                                                </tr>
                                            </tbody></table>
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                        
                        <!-- CTA BUTTON -->
                        <tr>
                            <td align="center" style="padding: 12px 24px 24px 24px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                    <tbody><tr>
                                        <td align="center" style="border-radius: 50px; background-color: #f4ab25;">
                                            <a href="${webhookOptin}?email=${email}&amp;name=${name}" target="_blank" style="border: none; border-radius: 50px; color: #000000; display: inline-block; font-size: 16px; font-weight: 500; padding: 14px 28px; text-decoration: none;">
                                                ${emailTemplate.button}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                        
                        <!-- DONATION SECTION -->
                        <tr>
                            <td align="center" style="padding: 24px;">
                                <table role="presentation" width="100%" class="card-dark" style="margin-bottom: 12px; background-color: #253852; border-radius: 8px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
                                    <tbody><tr>
                                        <td style="padding: 16px;">
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tbody><tr>
                                                    <td align="center">
                                                        <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Behind Keymoji</h3>
                                                        <p style="margin: 0 0 16px 0; color: #d3dce6; font-size: 14px; line-height: 1.5; text-align: left;">
                                                            Keymoji is a passion project developed by a single developer who believes in making security accessible to everyone. If you've found it useful, consider supporting the project with a small donation to help with hosting costs and future developments.
                                                        </p>
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                            <tbody><tr>
                                                                <td align="center" style="border-radius: 50px; background-color: #f4ab25;">
                                                                    <a href="https://ko-fi.com/keymoji_official" target="_blank" style="border: none; border-radius: 50px; color: #000000; display: inline-block; font-size: 14px; font-weight: 500; padding: 10px 20px; text-decoration: none;">
                                                                        ☕ Buy me a coffee
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                        
                        <!-- FOOTER WITH VERSION AND LANGUAGE FLAGS -->
                        <tr>
                            <td align="center" style="padding: 16px 24px 24px 24px; border-top: 1px solid #e0e0e0;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tbody>
                                    <tr>
                                        <td align="center" class="footer-dark light-footer" style="color: #8492a6; font-size: 12px; padding-bottom: 10px;">
                                            <span style="display: inline-block; margin-right: 10px; font-weight: 600;">${versionInfo}</span>
                                            <span style="display: inline-block;">${flagsHtml}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" class="footer-dark light-footer" style="color: #8492a6; font-size: 12px;">
                                            <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} Keymoji</p>
                                            <p style="margin: 0 0 8px 0;">
                                                Developed with love in 🇨🇭 Switzerland
                                            </p>
                                            <p style="margin: 0;">
                                                <a href="https://keymoji.wtf" target="_blank" style="color: #f4ab25; text-decoration: none;">keymoji.wtf</a>
                                            </p>
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
        </tbody>
        </table>
    </body>
    </html>`;

    const payload = {
        sender: { name: 'Keymoji', email: 'no-reply@keymoji.wtf' },
        to: [{ email }],
        subject: emailTemplate.subject,
        htmlContent: emailHtml,
        tags: ['contact-form-user'],
        headers: { 'X-Mailin-custom': 'contact-form-user' }
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
        throw new Error(`User email error: ${errorData.message}`);
    }

    return response.json();
}

/**
 * Adds a contact to the Brevo newsletter list
 */
async function addToBrevoNewsletter(name, email, langCode = 'en') {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const listId = process.env.BREVO_LIST_ID;

    const contactData = {
        email: email,
        attributes: {
            VORNAME: name,
            PREFERRED_LANGUAGE: langCode
        },
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

    return true;
}
