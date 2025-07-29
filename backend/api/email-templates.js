import validator from 'validator';

export function createBaseEmailTemplate({
    subject,
    greeting,
    content,
    buttonText,
    buttonUrl,
    footer = 'Developed with ❤️ in Switzerland'
}) {
    const sanitizedGreeting = validator.escape(greeting || '');
    const sanitizedContent = validator.escape(content || '');
    const sanitizedButtonText = validator.escape(buttonText || '');
    const sanitizedFooter = validator.escape(footer || '');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1a2538;
                color: #f5f5f5;
            }
            .email-container {
                background-color: #243852 !important;
                color: #f5f5f5 !important;
            }
            .header {
                background-color: #1a2538 !important;
                color: #f5f5f5 !important;
            }
            .content {
                background-color: #243852 !important;
                color: #f5f5f5 !important;
            }
            .footer {
                background-color: #1a2538 !important;
                color: #f5f5f5 !important;
            }
            .button {
                background-color: #f4ab25 !important;
                color: #000 !important;
            }
        }
        
        /* MSO fallbacks for Outlook */
        <!--[if mso]>
        <style>
        body {
            background-color: #f5f5f5 !important;
        }
        .email-container {
            background-color: #ffffff !important;
        }
        .header {
            background-color: #f4ab25 !important;
        }
        .content {
            background-color: #ffffff !important;
        }
        .footer {
            background-color: #f5f5f5 !important;
        }
        </style>
        <![endif]-->
        
        /* Container styles */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #f4ab25 0%, #f59e0b 100%);
            padding: 30px 20px;
            text-align: center;
            color: #000;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: block;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000;
        }
        
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        
        .main-content {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #333;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #f4ab25 0%, #f59e0b 100%);
            color: #000;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(244, 171, 37, 0.3);
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(244, 171, 37, 0.4);
        }
        
        .footer {
            background-color: #f5f5f5;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        
        /* Responsive design */
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header {
                padding: 20px 15px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .footer {
                padding: 15px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 16px;
            }
            
            .main-content {
                font-size: 14px;
            }
            
            .button {
                padding: 12px 25px;
                font-size: 14px;
            }
        }
        
        /* Accessibility improvements */
        .button:focus {
            outline: 2px solid #f4ab25;
            outline-offset: 2px;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .button {
                border: 2px solid #000;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#000"/>
                <text x="50" y="60" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#f4ab25">🔑</text>
            </svg>
            <h1>Keymoji</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                ${sanitizedGreeting}
            </div>
            
            <div class="main-content">
                ${sanitizedContent}
            </div>
            
            ${
                buttonText && buttonUrl
                    ? `
            <div class="button-container">
                <a href="${buttonUrl}" class="button">
                    ${sanitizedButtonText}
                </a>
            </div>
            `
                    : ''
            }
        </div>
        
        <div class="footer">
            ${sanitizedFooter}
        </div>
    </div>
</body>
</html>`;
}

export function createWelcomeEmail({ name, email, userId, tier }) {
    const sanitizedName = validator.escape(name || '');
    const sanitizedEmail = validator.escape(email || '');
    const sanitizedUserId = validator.escape(userId || '');
    const sanitizedTier = validator.escape(tier || 'FREE');

    const greeting = `Willkommen bei Keymoji, ${sanitizedName}! 🎉`;
    const content = `
        <p>Vielen Dank, dass Sie sich für Keymoji entschieden haben! Ihr Account wurde erfolgreich erstellt.</p>
        
        <p><strong>Account Details:</strong></p>
        <ul>
            <li>Email: ${sanitizedEmail}</li>
            <li>User ID: ${sanitizedUserId}</li>
            <li>Plan: ${sanitizedTier}</li>
        </ul>
        
        <p>Sie können jetzt sichere Emoji-Passwörter generieren und Ihre Passwort-Sicherheit verbessern.</p>
        
        <p>Falls Sie Fragen haben, zögern Sie nicht, uns zu kontaktieren.</p>
    `;

    return createBaseEmailTemplate({
        subject: 'Willkommen bei Keymoji! 🎉',
        greeting,
        content,
        buttonText: 'Jetzt starten',
        buttonUrl: 'https://its.keymoji.wtf',
        footer: 'Developed with ❤️ in Switzerland | Keymoji Team'
    });
}

export function createMagicLinkEmail({ name, email, magicLink }) {
    const sanitizedName = validator.escape(name || '');
    const sanitizedEmail = validator.escape(email || '');
    const sanitizedMagicLink = validator.escape(magicLink || '');

    const greeting = `Hallo ${sanitizedName}! 🔐`;
    const content = `
        <p>Sie haben einen Magic Link für Ihren Keymoji Account angefordert.</p>
        
        <p><strong>Wichtige Sicherheitshinweise:</strong></p>
        <ul>
            <li>Dieser Link ist nur 15 Minuten gültig</li>
            <li>Teilen Sie diesen Link nicht mit anderen</li>
            <li>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese Email</li>
        </ul>
        
        <p>Klicken Sie auf den Button unten, um sich sicher anzumelden:</p>
    `;

    return createBaseEmailTemplate({
        subject: 'Ihr Magic Link für Keymoji 🔐',
        greeting,
        content,
        buttonText: 'Sicher anmelden',
        buttonUrl: sanitizedMagicLink,
        footer: 'Developed with ❤️ in Switzerland | Keymoji Security'
    });
}

export function createContactEmail({
    name,
    email,
    message,
    emailContent = {}
}) {
    const sanitizedName = validator.escape(name || '');
    const sanitizedEmail = validator.escape(email || '');
    const sanitizedMessage = validator.escape(message || '');

    const greeting = `Vielen Dank für Ihre Nachricht, ${sanitizedName}! 📧`;
    const content = `
        <p>Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
        
        <p><strong>Ihre Nachricht:</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 0; font-style: italic;">"${sanitizedMessage}"</p>
        </div>
        
        <p><strong>Ihre Kontaktdaten:</strong></p>
        <ul>
            <li>Name: ${sanitizedName}</li>
            <li>Email: ${sanitizedEmail}</li>
        </ul>
        
        <p>Wir antworten normalerweise innerhalb von 24 Stunden.</p>
    `;

    return createBaseEmailTemplate({
        subject: 'Bestätigung Ihrer Nachricht - Keymoji 📧',
        greeting,
        content,
        buttonText: 'Zurück zu Keymoji',
        buttonUrl: 'https://its.keymoji.wtf',
        footer: 'Developed with ❤️ in Switzerland | Keymoji Support'
    });
}

export function createAccountUpdateEmail({ name, email, updates }) {
    const sanitizedName = validator.escape(name || '');
    const sanitizedEmail = validator.escape(email || '');
    const sanitizedUpdates = validator.escape(updates || '');

    const greeting = `Account Update für ${sanitizedName}! ⚙️`;
    const content = `
        <p>Ihr Keymoji Account wurde erfolgreich aktualisiert.</p>
        
        <p><strong>Geänderte Details:</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 0;">${sanitizedUpdates}</p>
        </div>
        
        <p>Falls Sie diese Änderungen nicht vorgenommen haben, kontaktieren Sie uns bitte sofort.</p>
    `;

    return createBaseEmailTemplate({
        subject: 'Account Update - Keymoji ⚙️',
        greeting,
        content,
        buttonText: 'Account anzeigen',
        buttonUrl: 'https://its.keymoji.wtf/account-manage',
        footer: 'Developed with ❤️ in Switzerland | Keymoji Account Management'
    });
}

export function createPasswordResetEmail({ name, email, resetLink }) {
    const sanitizedName = validator.escape(name || '');
    const sanitizedEmail = validator.escape(email || '');
    const sanitizedResetLink = validator.escape(resetLink || '');

    const greeting = `Passwort zurücksetzen für ${sanitizedName}! 🔒`;
    const content = `
        <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
        
        <p><strong>Sicherheitshinweise:</strong></p>
        <ul>
            <li>Dieser Link ist nur 1 Stunde gültig</li>
            <li>Teilen Sie diesen Link nicht mit anderen</li>
            <li>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese Email</li>
        </ul>
        
        <p>Klicken Sie auf den Button unten, um Ihr Passwort zurückzusetzen:</p>
    `;

    return createBaseEmailTemplate({
        subject: 'Passwort zurücksetzen - Keymoji 🔒',
        greeting,
        content,
        buttonText: 'Passwort zurücksetzen',
        buttonUrl: sanitizedResetLink,
        footer: 'Developed with ❤️ in Switzerland | Keymoji Security'
    });
}
