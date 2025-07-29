/**
 * Email Templates für Keymoji
 * - Wiederverwendbare Templates für alle Account-Emails
 * - Dark/Light Mode Support
 * - Responsive Design
 * - Brevo Integration
 */

// Base Email Template mit Keymoji Branding
export function createBaseEmailTemplate({
    subject,
    greeting,
    content,
    buttonText,
    buttonUrl,
    footerText = 'Developed with ❤️ in Switzerland',
    langCode = 'en'
}) {
    const currentYear = new Date().getFullYear();
    const versionInfo = `v${process.env.APP_VERSION || '0.4.0'}`;

    return `
    <!DOCTYPE html>
    <html dir="ltr" lang="${langCode}" style="margin: 0; padding: 0;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${subject}</title>
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
            
            /* Base colors */
            :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
            }
            
            /* Light mode */
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
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
            }
            
            .footer-light {
                color: #8492a6;
                border-top: 1px solid #e0e0e0;
            }
            
            .button-light {
                background-color: #f4ab25;
                color: #000000;
            }
            
            /* Dark mode */
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
                    background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
                }
                
                .footer-dark {
                    color: #a0aec0 !important;
                    border-top: 1px solid #2d3748 !important;
                }
                
                .button-dark {
                    background-color: #f4ab25 !important;
                    color: #000000 !important;
                }
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
                
                .table-holder {
                    display: table !important;
                    width: 100% !important;
                }
                
                .mobile-full {
                    width: 100% !important;
                    max-width: 100% !important;
                    height: auto !important;
                }
            }
        </style>
    </head>
    <body class="body-light body-dark" style="margin: 0; padding: 0; background-color: #f5f5f5;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto;" class="email-container">
            <!-- Header -->
            <tr>
                <td class="header-light header-dark" style="padding: 20px; text-align: center;">
                    <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">${subject}</h1>
                </td>
            </tr>
            
            <!-- Content -->
            <tr>
                <td class="content-light content-dark" style="padding: 30px;">
                    <h2 class="text-light text-dark" style="margin-bottom: 20px;">${greeting}</h2>
                    
                    <div class="secondary-text-light secondary-text-dark" style="line-height: 1.6; margin-bottom: 25px;">
                        ${content}
                    </div>
                    
                    ${
                        buttonText && buttonUrl
                            ? `
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${buttonUrl}" 
                           class="button-light button-dark"
                           style="background-color: #f4ab25; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            ${buttonText}
                        </a>
                    </div>
                    `
                            : ''
                    }
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <p class="footer-light footer-dark" style="font-size: 12px; text-align: center; margin: 0;">
                        ${footerText} | ${versionInfo} | ${currentYear}
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

// Welcome Email Template
export function createWelcomeEmail({ name, email, userId, tier = 'FREE' }) {
    const subject = '🎉 Welcome to Keymoji!';
    const greeting = `Hello ${name}!`;

    const content = `
        <p style="margin-bottom: 20px;">
            Welcome to Keymoji! Your account has been created successfully. You can now enjoy unlimited emoji password generation and access to all our features.
        </p>
        
        <div class="card-light card-dark" style="padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 class="text-light text-dark" style="margin-bottom: 10px;">Your Account Details:</h3>
            <p class="secondary-text-light secondary-dark" style="margin: 5px 0;"><strong>User ID:</strong> ${userId}</p>
            <p class="secondary-text-light secondary-dark" style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p class="secondary-text-light secondary-dark" style="margin: 5px 0;"><strong>Plan:</strong> ${tier}</p>
        </div>
        
        <p style="margin-bottom: 20px;">
            Start creating secure, AI-resistant emoji passwords today! Your account is ready to use.
        </p>
    `;

    const buttonText = '🚀 Start Using Keymoji';
    const buttonUrl = 'https://keymoji.wtf';

    return createBaseEmailTemplate({
        subject,
        greeting,
        content,
        buttonText,
        buttonUrl
    });
}

// Magic Link Email Template
export function createMagicLinkEmail({
    name,
    magicLinkUrl,
    expiresIn = '24 hours'
}) {
    const subject = '🔗 Your Keymoji Magic Link';
    const greeting = `Hello ${name}!`;

    const content = `
        <p style="margin-bottom: 20px;">
            Welcome to Keymoji! Click the button below to sign in to your account. No password needed!
        </p>
        
        <p class="secondary-text-light secondary-dark" style="font-size: 14px; margin-top: 25px;">
            This magic link will expire in ${expiresIn}. If you didn't request this, you can safely ignore this email.
        </p>
    `;

    const buttonText = '🚀 Sign In to Keymoji';
    const buttonUrl = magicLinkUrl;

    return createBaseEmailTemplate({
        subject,
        greeting,
        content,
        buttonText,
        buttonUrl
    });
}

// Account Update Email Template
export function createAccountUpdateEmail({ name, updateType, details }) {
    const subject = '📝 Your Keymoji Account Has Been Updated';
    const greeting = `Hello ${name}!`;

    const content = `
        <p style="margin-bottom: 20px;">
            Your Keymoji account has been updated successfully.
        </p>
        
        <div class="card-light card-dark" style="padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 class="text-light text-dark" style="margin-bottom: 10px;">Update Details:</h3>
            <p class="secondary-text-light secondary-dark" style="margin: 5px 0;"><strong>Type:</strong> ${updateType}</p>
            ${
                details
                    ? `<p class="secondary-text-light secondary-dark" style="margin: 5px 0;"><strong>Details:</strong> ${details}</p>`
                    : ''
            }
        </div>
        
        <p style="margin-bottom: 20px;">
            If you didn't make this change, please contact us immediately.
        </p>
    `;

    const buttonText = '🔒 Review Account Settings';
    const buttonUrl = 'https://keymoji.wtf';

    return createBaseEmailTemplate({
        subject,
        greeting,
        content,
        buttonText,
        buttonUrl
    });
}

// Password Reset Email Template
export function createPasswordResetEmail({
    name,
    resetUrl,
    expiresIn = '1 hour'
}) {
    const subject = '🔐 Reset Your Keymoji Password';
    const greeting = `Hello ${name}!`;

    const content = `
        <p style="margin-bottom: 20px;">
            You requested a password reset for your Keymoji account. Click the button below to create a new password.
        </p>
        
        <p class="secondary-text-light secondary-dark" style="font-size: 14px; margin-top: 25px;">
            This reset link will expire in ${expiresIn}. If you didn't request this, you can safely ignore this email.
        </p>
    `;

    const buttonText = '🔐 Reset Password';
    const buttonUrl = resetUrl;

    return createBaseEmailTemplate({
        subject,
        greeting,
        content,
        buttonText,
        buttonUrl
    });
}
