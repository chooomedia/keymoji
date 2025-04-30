/**
 * Sendet eine styled E-Mail an den Benutzer
 * - Verbesserte Dark/Light-Modus Implementierung nach W3C-Standards
 * - Angepasstes Layout für bessere Mobildarstellung
 * - Entfernung der Donate-Sektion und Ersetzung durch Footer-Link
 * - Bessere E-Mail-Client-Kompatibilität
 */

import validator from 'validator';

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
        langCode,
        appVersion
    } = req.body;

    // Log the request for debugging (ohne sensible Inhalte)
    console.log('Received contact form submission:', {
        hasName: !!name,
        hasEmail: !!email,
        hasMessage: !!message,
        newsletterOptIn,
        hasEmailContent: !!emailContent,
        langCode,
        appVersion
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
            newsletterOptIn,
            appVersion: appVersion || 'unknown'
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
    newsletterOptIn,
    appVersion
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

        App Version: ${appVersion}
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

    // Version info - dynamischer Ansatz ohne Hardcoding
    const currentYear = new Date().getFullYear();
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
            /* Standard CSS Reset */
            body, table, td, p, a, li, blockquote {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                mso-line-height-rule: exactly;
            }
            
            /* Client-specific resets */
            table, td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            
            img {
                -ms-interpolation-mode: bicubic;
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }
            
            /* Font-Familie für alle Clients */
            body, table, td {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            
            /* Base colors - Diese gelten immer (Light-Mode) */
            :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
            }
            
            /* Light mode - wird direkt definiert und als Fallback verwendet */
            .body-light {
                background-color: #f5f5f5;
                color: #273444;
            }
            
            .content-light {
                background-color: #ffffff;
            }
            
            .text-light {
                color: #273444;
            }
            
            .secondary-text-light {
                color: #8492a6;
            }
            
            .card-light {
                background-color: #f5f5f5;
                border-left: 4px solid #f4ab25;
            }
            
            .header-light {
                background-color: #243852;
            }
            
            .footer-light {
                color: #8492a6;
                border-top: 1px solid #e0e0e0;
            }
            
            .button-light {
                background-color: #f4ab25;
                color: #000000;
            }
            
            /* Dark mode mit @media (prefers-color-scheme) */
            @media (prefers-color-scheme: dark) {
                .body-dark {
                    background-color: #121212 !important;
                    color: #f5f5f5 !important;
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
                    background-color: #1e2c3f !important;
                    border-left: 4px solid #f4ab25 !important;
                }
                
                .header-dark {
                    background-color: #1a2538 !important;
                }
                
                .footer-dark {
                    color: #a0aec0 !important;
                    border-top: 1px solid #2d3748 !important;
                }
                
                .button-dark {
                    background-color: #f4ab25 !important;
                    color: #000000 !important;
                }
                
                /* Erzwinge Lesbarkeit für dunklen Modus */
                .forced-light {
                    color: #ffffff !important;
                }
                
                .forced-dark {
                    color: #000000 !important;
                }
            }
            
            /* MSO-spezifische Fallbacks für Dark/Light mode */
            [data-ogsc] .body-dark {
                background-color: #121212 !important;
                color: #f5f5f5 !important;
            }
            
            [data-ogsc] .content-dark {
                background-color: #253852 !important;
            }
            
            [data-ogsc] .text-dark {
                color: #f5f5f5 !important;
            }
            
            /* Outlook-spezifische Styles */
            .ExternalClass {
                width: 100%;
            }
            
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
            
            /* Mobile Optimierungen */
            @media screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                    max-width: 100% !important;
                }
                
                .fluid {
                    max-width: 100% !important;
                    height: auto !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                }
                
                .stack-column,
                .stack-column-center {
                    display: block !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    direction: ltr !important;
                }
                
                .stack-column-center {
                    text-align: center !important;
                }
                
                .center-on-narrow {
                    text-align: center !important;
                    display: block !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                    float: none !important;
                }
                
                table.center-on-narrow {
                    display: inline-block !important;
                }
                
                /* Anpassung für Mobile Spacing */
                .mobile-padding {
                    padding-left: 15px !important;
                    padding-right: 15px !important;
                }
            }
        </style>
    </head>
    <body class="body-light body-dark" style="margin: 0; padding: 0; width: 100%; height: 100%; background-color: #f5f5f5; -webkit-text-size-adjust: none; -ms-text-size-adjust: none;">
        <!-- EMAIL WRAPPER - 600px Breite mit mobilem Spacing -->
        <table role="presentation" class="mobile-padding" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto;">
            <tbody>
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <!-- EMAIL CONTAINER - 600px Breite -->
                    <table role="presentation" class="email-container content-light content-dark" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" cellspacing="0" cellpadding="0" border="0">
                        <!-- HEADER mit kompaktem Layout -->
                        <tbody>
                        <tr>
                            <td class="header-light header-dark" style="padding: 20px; border-radius: 12px 12px 0 0; background-color: #243852;">
                                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td width="60" valign="middle">
                                            <!-- LOGO -->
                                              <svg role="img" width="60" height="60" transition" viewBox="0 0 600 600" fill="currentColor"><g><path style="opacity:0.996" fill="#f4ab25" d="M 529.5,329.5 C 477.279,418.388 403.612,482.721 308.5,522.5C 220.205,523.773 151.039,488.439 101,416.5C 62.9557,353.126 56.9557,286.793 83,217.5C 114.982,145.861 169.149,100.695 245.5,82C 324.316,65.9546 394.649,83.288 456.5,134C 513.71,186.787 538.043,251.954 529.5,329.5 Z"></path></g><g><path style="opacity:1" fill="#6b490c" d="M 375.5,136.5 C 372.054,137.687 368.387,138.354 364.5,138.5C 367.845,136.783 371.511,136.116 375.5,136.5 Z"></path></g><g><path style="opacity:1" fill="#090501" d="M 375.5,136.5 C 417.075,133.625 446.575,150.958 464,188.5C 465.515,193.521 467.015,198.521 468.5,203.5C 469.773,212.836 469.773,222.169 468.5,231.5C 459.769,276.397 432.769,302.563 387.5,310C 370.69,311.309 354.69,308.309 339.5,301C 334.764,295.278 335.931,291.111 343,288.5C 384.355,305.6 418.355,296.266 445,260.5C 460.31,233.394 460.31,206.394 445,179.5C 426.518,154.999 402.018,145.166 371.5,150C 336.648,159.006 315.815,181.172 309,216.5C 307.639,228.6 308.805,240.433 312.5,252C 309.889,259.069 305.722,260.236 300,255.5C 290.438,223.104 296.105,193.771 317,167.5C 329.994,153.091 345.828,143.424 364.5,138.5C 368.387,138.354 372.054,137.687 375.5,136.5 Z"></path></g><g><path style="opacity:1" fill="#0a0501" d="M 395.5,170.5 C 415.086,169.364 427.92,178.031 434,196.5C 436.841,216.631 428.674,229.798 409.5,236C 388.269,238.81 374.769,229.977 369,209.5C 367.412,189.324 376.246,176.324 395.5,170.5 Z"></path><path style="opacity:1" fill="#010000" d="M 191.5,178.5 C 206.469,178.03 221.136,179.863 235.5,184C 244.616,191.348 247.783,200.848 245,212.5C 238.966,227.934 227.8,234.101 211.5,231C 198.45,224.759 192.116,214.259 192.5,199.5C 182.082,199.069 171.749,199.735 161.5,201.5C 152.737,198.177 151.404,193.01 157.5,186C 168.694,182.197 180.027,179.697 191.5,178.5 Z"></path></g><g><path style="opacity:1" fill="#f3aa25" d="M 398.5,183.5 C 418.904,185.731 425.404,196.398 418,215.5C 407.652,225.804 396.986,226.137 386,216.5C 377.865,200.778 382.032,189.778 398.5,183.5 Z"></path></g><g><path style="opacity:1" fill="#996a14" d="M 468.5,203.5 C 471.035,212.848 471.035,222.181 468.5,231.5C 469.773,222.169 469.773,212.836 468.5,203.5 Z"></path></g><g><path style="opacity:1" fill="#070401" d="M 292.5,367.5 C 282.833,367.5 273.167,367.5 263.5,367.5C 263.5,378.833 263.5,390.167 263.5,401.5C 262.883,403.229 261.883,404.729 260.5,406C 250.172,406.5 239.839,406.666 229.5,406.5C 229.666,415.506 229.5,424.506 229,433.5C 227.457,435.378 225.624,436.878 223.5,438C 205.5,438.667 187.5,438.667 169.5,438C 167.93,436.603 166.596,435.103 165.5,433.5C 165.193,415.453 165.527,397.453 166.5,379.5C 203.938,343.23 241.272,306.73 278.5,270C 282.302,267.965 285.469,268.798 288,272.5C 288.667,274.5 288.667,276.5 288,278.5C 251.559,314.276 215.226,349.943 179,385.5C 178.5,398.829 178.333,412.163 178.5,425.5C 191.167,425.5 203.833,425.5 216.5,425.5C 216.181,415.584 216.514,405.75 217.5,396C 228.397,394.546 239.397,394.046 250.5,394.5C 250.333,382.495 250.5,370.495 251,358.5C 252.167,357.333 253.333,356.167 254.5,355C 266.167,354.667 277.833,354.333 289.5,354C 293,350.5 296.5,347 300,343.5C 300.333,333.5 300.667,323.5 301,313.5C 302.167,312.333 303.333,311.167 304.5,310C 310.833,309.333 317.167,309.333 323.5,310C 328.371,313.178 328.704,316.845 324.5,321C 320.974,322.337 317.308,322.837 313.5,322.5C 313.666,331.173 313.5,339.84 313,348.5C 306.597,355.407 299.764,361.74 292.5,367.5 Z"></path></g><g><path style="opacity:0.971" fill="#f4a323" d="M 529.5,329.5 C 518.606,397.519 484.273,450.019 426.5,487C 390.33,509.222 350.996,521.056 308.5,522.5C 403.612,482.721 477.279,418.388 529.5,329.5 Z"></path></g><g><path style="opacity:1" fill="#bb8224" d="M 292.5,367.5 C 283.348,368.494 274.015,368.827 264.5,368.5C 264.828,379.679 264.495,390.679 263.5,401.5C 263.5,390.167 263.5,378.833 263.5,367.5C 273.167,367.5 282.833,367.5 292.5,367.5 Z"></path></g><g><path style="opacity:1" fill="#ae7917" d="M 166.5,379.5 C 165.527,397.453 165.193,415.453 165.5,433.5C 164.338,416.005 164.171,398.338 165,380.5C 165.383,379.944 165.883,379.611 166.5,379.5 Z"></path></g><g><path style="opacity:1" fill="#010000" d="M 383.5,391.5 C 390.244,390.198 394.244,392.864 395.5,399.5C 393.367,415.445 385.034,426.611 370.5,433C 351.637,439.032 332.303,441.032 312.5,439C 305.792,438.711 299.125,438.045 292.5,437C 285.964,431.287 286.63,426.454 294.5,422.5C 314.235,421.404 333.901,419.57 353.5,417C 360.937,415.382 367.603,412.216 373.5,407.5C 377.287,402.395 380.62,397.061 383.5,391.5 Z"></path></g></svg>
                                        </td>
                                        <td valign="middle" style="padding-left: 15px;">
                                            <h1 style="font-size: 22px; color: #ffffff; margin: 0; padding: 0;" class="forced-light">Keymoji</h1>
                                            <p style="font-size: 14px; color: #f4ab25; margin: 0; padding: 0;">Emoji Password Generator</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- GREETING -->
                        <tr>
                            <td align="left" class="text-light text-dark" style="padding: 24px 24px 12px 24px; color: #273444;">
                                <h2 style="font-size: 20px; margin: 0;">${emailTemplate.greeting}, ${name} 👋</h2>
                            </td>
                        </tr>
                        
                        <!-- INTRO TEXT -->
                        <tr>
                            <td align="left" class="text-light text-dark" style="padding: 12px 24px; color: #273444; font-size: 16px; line-height: 1.5;">
                                <p style="margin: 0 0 16px 0;">${emailTemplate.intro}</p>
                                <p style="margin: 0 0 16px 0;">${emailTemplate.doubleCheck}</p>
                            </td>
                        </tr>
                        
                        <!-- MESSAGE DETAILS -->
                        <tr>
                            <td align="left" style="padding: 0 24px;">
                                <table role="presentation" width="100%" class="card-light card-dark" style="margin-bottom: 24px; background-color: #f5f5f5; border-radius: 8px; border-left: 4px solid #f4ab25;" cellspacing="0" cellpadding="0" border="0">
                                    <tbody><tr>
                                        <td class="text-light text-dark" style="padding: 16px; color: #273444;">
                                            <p style="margin: 0 0 8px 0; font-weight: 600;">Message Details:</p>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tbody><tr>
                                                    <td width="80" valign="top" class="text-light text-dark" style="padding: 4px 8px 4px 0; color: #273444; font-weight: 600;">Name:</td>
                                                    <td valign="top" class="text-light text-dark" style="padding: 4px 0; color: #273444;">${name}</td>
                                                </tr>
                                                <tr>
                                                    <td width="80" valign="top" class="text-light text-dark" style="padding: 4px 8px 4px 0; color: #273444; font-weight: 600;">Email:</td>
                                                    <td valign="top" class="text-light text-dark" style="padding: 4px 0; color: #273444;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td width="80" valign="top" class="text-light text-dark" style="padding: 4px 8px 4px 0; color: #273444; font-weight: 600;">Message:</td>
                                                    <td valign="top" class="text-light text-dark" style="padding: 4px 0; color: #273444;">${message}</td>
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
                                        <td align="center" class="button-light button-dark" style="border-radius: 50px; background-color: #f4ab25;">
                                            <a href="${webhookOptin}?email=${email}&amp;name=${name}" target="_blank" style="border: none; border-radius: 50px; color: #000000; display: inline-block; font-size: 16px; font-weight: 500; padding: 14px 28px; text-decoration: none;" class="forced-dark">
                                                ${emailTemplate.button}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                        
                        <!-- FOOTER WITH VERSION, LANGUAGE FLAGS AND SUPPORT LINK -->
                        <tr>
                            <td align="center" class="footer-light footer-dark" style="padding: 24px 24px 12px 24px; border-top: 1px solid #e0e0e0;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tbody>
                                    <tr>
                                        <td align="center" class="secondary-text-light secondary-text-dark" style="color: #8492a6; font-size: 12px; padding-bottom: 10px;">
                                            <span style="display: inline-block; margin-right: 10px; font-weight: 600;">${versionInfo}</span>
                                            <span style="display: inline-block;">${flagsHtml}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" class="secondary-text-light secondary-text-dark" style="color: #8492a6; font-size: 12px;">
                                            <p style="margin: 0 0 8px 0;">© ${currentYear} Keymoji</p>
                                            <p style="margin: 0 0 12px 0;">
                                                Developed with love in 🇨🇭 Switzerland
                                            </p>
                                            <p style="margin: 0 0 16px 0;">
                                                <a href="https://keymoji.wtf" target="_blank" style="color: #f4ab25; text-decoration: none;">keymoji.wtf</a>
                                            </p>
                                            <!-- Support Link (ersetzt die Donate-Sektion) -->
                                            <p style="margin: 0 0 8px 0;">
                                                If you find this tool useful, please consider 
                                                <a href="https://ko-fi.com/keymoji_official" target="_blank" style="color: #f4ab25; text-decoration: none;">supporting the project</a>.
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
