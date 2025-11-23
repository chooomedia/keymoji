// scripts/generate-static-routes.js
// Generiert statische HTML-Dateien für bessere SEO
const fs = require('fs');
const path = require('path');

// SEO-optimierte Routen-Konfiguration
const routes = [
    { path: '/', type: 'home' },
    { path: '/versions', type: 'versions' },
    { path: '/contact', type: 'contact' },
    { path: '/account', type: 'account' },
    { path: '/blog', type: 'blog' },
    { path: '/privacy', type: 'privacy' },
    { path: '/legal', type: 'legal' }
];

// Unterstützte Sprachen
const supportedLanguages = [
    'en',
    'de',
    'de-CH',
    'es',
    'nl',
    'it',
    'fr',
    'pl',
    'ru',
    'tr',
    'af',
    'ja',
    'ko',
    'tlh',
    'sjn'
];

// SEO-Meta-Daten für jede Route
const seoData = {
    home: {
        title: 'Keymoji - Emoji Password Generator',
        description:
            'Generate secure, AI-resistant emoji passwords. Create memorable passwords with emojis in 15+ languages.',
        keywords:
            'emoji password, password generator, secure passwords, AI resistant, keymoji, password security, online security',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    },
    versions: {
        title: 'Keymoji Version History & Updates',
        description:
            'Track the development and updates of Keymoji. See new features, improvements, and bug fixes in each version.',
        keywords:
            'keymoji updates, version history, changelog, new features, emoji password updates',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    },
    contact: {
        title: 'Contact Keymoji - Get in Touch',
        description:
            'Have questions or feedback about Keymoji? Contact us for support, suggestions, or collaboration.',
        keywords:
            'contact keymoji, support, feedback, get in touch, emoji password help',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    },
    blog: {
        title: 'Keymoji Blog - Password Security & Tips',
        description:
            'Learn about emoji passwords, security tips, and updates from Keymoji. Stay informed about the latest in password security.',
        keywords:
            'password security, emoji passwords, security blog, keymoji blog, password tips',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    },
    account: {
        title: 'Keymoji Account - Manage Your Account',
        description:
            'Manage your Keymoji account, view your password history, and access premium features. Secure emoji password management.',
        keywords:
            'keymoji account, account management, password history, premium features, user account',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    },
    privacy: {
        title: 'Keymoji Privacy Policy - Your Data Protection',
        description:
            "Read Keymoji's privacy policy to understand how we protect your data and ensure your privacy when using our emoji password generator.",
        keywords:
            'keymoji privacy, privacy policy, data protection, GDPR, user privacy',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    },
    legal: {
        title: 'Keymoji Legal Information - Terms & Conditions',
        description:
            "Read Keymoji's terms and conditions, legal information, and usage guidelines for our emoji password generator service.",
        keywords:
            'keymoji legal, terms and conditions, legal information, usage guidelines',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    }
};

// Generiere HTML für eine Route
function generateRouteHTML(route, lang = 'en', buildAssets = { css: [], js: [] }) {
    const baseUrl = 'https://keymoji.wtf';
    const url =
        route.path === '/'
            ? `${baseUrl}/${lang}`
            : `${baseUrl}/${lang}${route.path}`;
    const canonicalUrl = url.endsWith('/') ? url : `${url}/`;
    const data = seoData[route.type];
    
    // Verwende tatsächliche Asset-Pfade oder Fallbacks
    const cssFiles = buildAssets.css.length > 0 ? buildAssets.css : ['/static/css/styles.css'];
    const jsFiles = buildAssets.js.length > 0 ? buildAssets.js : ['/static/js/app.js'];
    
    // Generiere Link-Tags für CSS
    const cssLinks = cssFiles.map(css => 
        `<link rel="stylesheet" href="${css}">`
    ).join('\n    ');
    
    // Generiere Preload-Tags für kritische Assets
    const preloadTags = [
        ...cssFiles.map(css => `<link rel="preload" href="${css}" as="style">`),
        ...jsFiles.slice(0, 2).map(js => `<link rel="preload" href="${js}" as="script">`)
    ].join('\n    ');

    // Generate fallback content for specific routes
    function generateFallbackContent(routeType, lang) {
        if (routeType === 'versions') {
            const versionTitles = {
                en: 'Version History',
                de: 'Versionshistorie',
                'de-CH': 'Versionshistorie',
                es: 'Historial de Versiones',
                fr: 'Historique des Versions',
                it: 'Cronologia delle Versioni',
                nl: 'Versiegeschiedenis',
                pl: 'Historia Wersji',
                ru: 'История Версий',
                tr: 'Sürüm Geçmişi',
                af: 'Weergawe Geskiedenis',
                ja: 'バージョン履歴',
                ko: '버전 기록',
                tlh: 'Version History',
                sjn: 'Version History'
            };
            
            const title = versionTitles[lang] || versionTitles.en;
            const description = lang === 'de' || lang === 'de-CH' 
                ? 'Entwicklungshistorie und Changelog von Keymoji. Sehen Sie neue Features, Verbesserungen und Bugfixes in jeder Version.'
                : 'Track the development and updates of Keymoji. See new features, improvements, and bug fixes in each version.';
            
            return `
        <!-- Fallback Content (visible until JavaScript loads) -->
        <noscript>
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h1 style="color: #253852; font-size: 2rem; margin-bottom: 1rem;">🔑 ${title}</h1>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h2 style="color: #253852; font-size: 1.25rem; margin-bottom: 0.5rem;">v0.7.7 - November 16, 2025</h2>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Current Version</strong></p>
                    <ul style="color: #666; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Code cleanup and quality improvements</li>
                        <li>UI/UX optimizations</li>
                        <li>Routing and static HTML generation improvements</li>
                        <li>Translation updates for all 15 languages</li>
                    </ul>
                </div>
                <p style="color: #999; font-size: 0.875rem; margin-top: 2rem;">
                    ${lang === 'de' || lang === 'de-CH' 
                        ? 'Bitte aktivieren Sie JavaScript, um die vollständige Versionshistorie zu sehen.'
                        : 'Please enable JavaScript to view the complete version history.'}
                </p>
            </div>
        </noscript>
        <!-- Loading state for better UX (hidden when noscript is active or when Svelte loads) -->
        <div id="static-loading-screen" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem; font-size: 1.5rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">${lang === 'de' || lang === 'de-CH' ? 'Lade Versionshistorie...' : 'Loading Version History...'}</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>`;
        }
        
        // Contact page fallback
        if (routeType === 'contact') {
            const isGerman = lang === 'de' || lang === 'de-CH';
            const title = isGerman ? 'Kontakt' : 'Contact Us';
            const description = isGerman
                ? 'Haben Sie Fragen oder Feedback zu Keymoji? Kontaktieren Sie uns für Support, Vorschläge oder Zusammenarbeit.'
                : 'Have questions or feedback about Keymoji? Contact us for support, suggestions, or collaboration.';
            
            return `
        <!-- Fallback Content (visible until JavaScript loads) -->
        <noscript>
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h1 style="color: #253852; font-size: 2rem; margin-bottom: 1rem;">📧 ${title}</h1>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="color: #666; line-height: 1.8; margin-bottom: 1rem;">
                        <strong>📧 Email:</strong> <a href="mailto:hello@keymoji.wtf" style="color: #253852;">hello@keymoji.wtf</a>
                    </p>
                    <p style="color: #666; line-height: 1.8;">
                        ${isGerman ? 'Wir antworten normalerweise innerhalb von 24 Stunden.' : 'We typically respond within 24 hours.'}
                    </p>
                </div>
                <p style="color: #999; font-size: 0.875rem; margin-top: 2rem;">
                    ${isGerman ? 'Bitte aktivieren Sie JavaScript, um das Kontaktformular zu verwenden.' : 'Please enable JavaScript to use the contact form.'}
                </p>
            </div>
        </noscript>
        <!-- Loading state for better UX (hidden when noscript is active or when Svelte loads) -->
        <div id="static-loading-screen" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem; font-size: 1.5rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">${isGerman ? 'Lade Kontaktformular...' : 'Loading Contact Form...'}</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>`;
        }
        
        // Privacy page fallback
        if (routeType === 'privacy') {
            const isGerman = lang === 'de' || lang === 'de-CH';
            const privacyTitles = {
                en: 'Privacy Policy',
                de: 'Datenschutzerklärung',
                'de-CH': 'Datenschutzerklärung',
                es: 'Política de Privacidad',
                fr: 'Politique de Confidentialité',
                it: 'Informativa sulla Privacy',
                nl: 'Privacybeleid',
                pl: 'Polityka Prywatności',
                ru: 'Политика Конфиденциальности',
                tr: 'Gizlilik Politikası',
                af: 'Privaatheidbeleid',
                ja: 'プライバシーポリシー',
                ko: '개인정보 보호정책',
                tlh: 'Privacy Policy',
                sjn: 'Privacy Policy'
            };
            const title = privacyTitles[lang] || privacyTitles.en;
            const description = isGerman
                ? 'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten'
                : 'Information about data protection and processing of personal data';
            
            return `
        <!-- Fallback Content (visible until JavaScript loads) -->
        <noscript>
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h1 style="color: #253852; font-size: 2rem; margin-bottom: 1rem;">🔒 ${title}</h1>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h2 style="color: #253852; font-size: 1.25rem; margin-bottom: 0.5rem;">${isGerman ? '1. Einleitung' : '1. Introduction'}</h2>
                    <p style="color: #666; line-height: 1.8;">
                        ${isGerman 
                            ? 'Der Schutz Ihrer Privatsphäre ist uns sehr wichtig. Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website keymoji.wtf.'
                            : 'Protecting your privacy is very important to us. This privacy policy informs you about the nature, scope and purpose of processing personal data on our website keymoji.wtf.'}
                    </p>
                    <p style="color: #666; line-height: 1.8; margin-top: 1rem;">
                        ${isGerman
                            ? 'Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, revDSGV, TKG 2003).'
                            : 'We process your data exclusively on the basis of legal regulations (GDPR, revDSGV, TKG 2003).'}
                    </p>
                </div>
                <p style="color: #999; font-size: 0.875rem; margin-top: 2rem;">
                    ${isGerman ? 'Bitte aktivieren Sie JavaScript, um die vollständige Datenschutzerklärung zu sehen.' : 'Please enable JavaScript to view the complete privacy policy.'}
                </p>
            </div>
        </noscript>
        <!-- Loading state for better UX (hidden when noscript is active or when Svelte loads) -->
        <div id="static-loading-screen" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem; font-size: 1.5rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">${isGerman ? 'Lade Datenschutzerklärung...' : 'Loading Privacy Policy...'}</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>`;
        }
        
        // Legal page fallback
        if (routeType === 'legal') {
            const isGerman = lang === 'de' || lang === 'de-CH';
            const legalTitles = {
                en: 'Legal Notice',
                de: 'Impressum',
                'de-CH': 'Impressum',
                es: 'Aviso Legal',
                fr: 'Mentions Légales',
                it: 'Note Legali',
                nl: 'Juridische Mededeling',
                pl: 'Informacje Prawne',
                ru: 'Юридическая Информация',
                tr: 'Yasal Uyarı',
                af: 'Wettige Kennisgewing',
                ja: '法的通知',
                ko: '법적 고지',
                tlh: 'Legal Notice',
                sjn: 'Legal Notice'
            };
            const title = legalTitles[lang] || legalTitles.en;
            const description = isGerman
                ? 'Rechtliche Informationen gemäß § 5 TMG / § 25 MedienG'
                : 'Legal information according to § 5 TMG / § 25 MedienG';
            
            return `
        <!-- Fallback Content (visible until JavaScript loads) -->
        <noscript>
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h1 style="color: #253852; font-size: 2rem; margin-bottom: 1rem;">⚖️ ${title}</h1>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h2 style="color: #253852; font-size: 1.25rem; margin-bottom: 0.5rem;">${isGerman ? 'Diensteanbieter' : 'Service Provider'}</h2>
                    <ul style="color: #666; line-height: 1.8; padding-left: 1.5rem;">
                        <li><strong>${isGerman ? 'Name' : 'Name'}:</strong> Christopher Matt</li>
                        <li><strong>${isGerman ? 'Firma' : 'Company'}:</strong> Chooomedia</li>
                        <li><strong>📧 Email:</strong> <a href="mailto:hello@keymoji.wtf" style="color: #253852;">hello@keymoji.wtf</a></li>
                        <li><strong>🌐 Website:</strong> <a href="https://keymoji.wtf" style="color: #253852;">keymoji.wtf</a></li>
                    </ul>
                </div>
                <p style="color: #999; font-size: 0.875rem; margin-top: 2rem;">
                    ${isGerman ? 'Bitte aktivieren Sie JavaScript, um die vollständigen rechtlichen Informationen zu sehen.' : 'Please enable JavaScript to view the complete legal information.'}
                </p>
            </div>
        </noscript>
        <!-- Loading state for better UX (hidden when noscript is active or when Svelte loads) -->
        <div id="static-loading-screen" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem; font-size: 1.5rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">${isGerman ? 'Lade Impressum...' : 'Loading Legal Notice...'}</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>`;
        }
        
        // Account page fallback
        if (routeType === 'account') {
            const isGerman = lang === 'de' || lang === 'de-CH';
            const title = isGerman ? 'Konto-Verwaltung' : 'Account Management';
            const description = isGerman
                ? 'Verwalten Sie Ihr Keymoji-Konto, sehen Sie Ihre Passwort-Historie und greifen Sie auf Premium-Features zu.'
                : 'Manage your Keymoji account, view your password history, and access premium features.';
            
            return `
        <!-- Fallback Content (visible until JavaScript loads) -->
        <noscript>
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h1 style="color: #253852; font-size: 2rem; margin-bottom: 1rem;">👤 ${title}</h1>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="color: #666; line-height: 1.8;">
                        ${isGerman
                            ? 'Melden Sie sich an oder erstellen Sie ein Konto, um Ihre Einstellungen zu verwalten und auf erweiterte Features zuzugreifen.'
                            : 'Sign in or create an account to manage your settings and access advanced features.'}
                    </p>
                </div>
                <p style="color: #999; font-size: 0.875rem; margin-top: 2rem;">
                    ${isGerman ? 'Bitte aktivieren Sie JavaScript, um die Account-Verwaltung zu verwenden.' : 'Please enable JavaScript to use account management.'}
                </p>
            </div>
        </noscript>
        <!-- Loading state for better UX (hidden when noscript is active or when Svelte loads) -->
        <div id="static-loading-screen" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem; font-size: 1.5rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">${isGerman ? 'Lade Account-Verwaltung...' : 'Loading Account Management...'}</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>`;
        }
        
        // Blog page fallback
        if (routeType === 'blog') {
            const isGerman = lang === 'de' || lang === 'de-CH';
            const title = 'Blog';
            const description = isGerman
                ? 'Erfahren Sie mehr über Emoji-Passwörter, Sicherheitstipps und Updates von Keymoji.'
                : 'Learn about emoji passwords, security tips, and updates from Keymoji.';
            
            return `
        <!-- Fallback Content (visible until JavaScript loads) -->
        <noscript>
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h1 style="color: #253852; font-size: 2rem; margin-bottom: 1rem;">📝 ${title}</h1>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="color: #666; line-height: 1.8;">
                        ${isGerman
                            ? 'Bleiben Sie auf dem Laufenden über die neuesten Entwicklungen in der Passwort-Sicherheit und Emoji-Passwörtern.'
                            : 'Stay informed about the latest in password security and emoji passwords.'}
                    </p>
                </div>
                <p style="color: #999; font-size: 0.875rem; margin-top: 2rem;">
                    ${isGerman ? 'Bitte aktivieren Sie JavaScript, um den Blog zu sehen.' : 'Please enable JavaScript to view the blog.'}
                </p>
            </div>
        </noscript>
        <!-- Loading state for better UX (hidden when noscript is active or when Svelte loads) -->
        <div id="static-loading-screen" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem; font-size: 1.5rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">${isGerman ? 'Lade Blog...' : 'Loading Blog...'}</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>`;
        }
        
        // Default loading state for home and other routes
        const isGerman = lang === 'de' || lang === 'de-CH';
        return `
        <!-- Loading state for better UX (hidden when Svelte loads) -->
        <div id="static-loading-screen" style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem; font-size: 1.5rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">${isGerman ? 'Lade Emoji-Passwort-Generator...' : 'Loading Emoji Password Generator...'}</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    
    <!-- Primary Meta Tags -->
    <title>${data.title}</title>
    <meta name="title" content="${data.title}">
    <meta name="description" content="${data.description}">
    <meta name="keywords" content="${data.keywords}">
    <meta name="author" content="Christopher Matt">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.description}">
    <meta property="og:image" content="${baseUrl}${data.image}">
    <meta property="og:image:width" content="1640">
    <meta property="og:image:height" content="924">
    <meta property="og:image:alt" content="Keymoji - Create secure emoji passwords">
    <meta property="og:site_name" content="Keymoji">
    <meta property="og:locale" content="${getLocale(lang)}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${canonicalUrl}">
    <meta property="twitter:title" content="${data.title}">
    <meta property="twitter:description" content="${data.description}">
    <meta property="twitter:image" content="${baseUrl}${data.image}">
    
    <!-- Canonical -->
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Language Alternates (hreflang) - Required for SEO -->
    <!-- data-static="true" prevents updateMetaTags() from removing/duplicating these -->
    ${supportedLanguages
        .map(l => {
            const altPath = route.path === '/' ? '' : route.path;
            let altUrl =
                l === 'en'
                    ? `${baseUrl}${altPath}`
                    : `${baseUrl}/${l}${altPath}`;
            // Ensure trailing slash for directories (home pages)
            if (altUrl === baseUrl || altUrl.endsWith('/')) {
                // Already has trailing slash or is root
            } else if (!altUrl.includes('.')) {
                // No file extension, add trailing slash
                altUrl = `${altUrl}/`;
            }
            return `<link rel="alternate" hreflang="${l}" href="${altUrl}" data-static="true">`;
        })
        .join('\n    ')}
    <link rel="alternate" hreflang="x-default" href="${baseUrl}${
        route.path === '/' ? '/' : route.path
    }" data-static="true">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Keymoji",
        "url": "${canonicalUrl}",
        "description": "${data.description}",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "screenshot": "${baseUrl}${data.image}",
        "featureList": [
            "AI-resistant password generation",
            "15+ language support",
            "Dark mode",
            "PWA support"
        ]
    }
    </script>
    
    <!-- Preload critical resources -->
    ${preloadTags}
    
    <!-- Stylesheets -->
    ${cssLinks}
    
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    
    <!-- Manifest for PWA -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://n8n.chooomedia.com">
    <link rel="preconnect" href="https://api.keymoji.wtf">
    <link rel="dns-prefetch" href="https://n8n.chooomedia.com">
    <link rel="dns-prefetch" href="https://api.keymoji.wtf">
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
</head>
<body>
    <div id="app">
        ${generateFallbackContent(route.type, lang)}
    </div>
    
    <!-- Hide static loading screen immediately when JavaScript loads (before Svelte initializes) -->
    <script>
        // CRITICAL: Hide static loading screen BEFORE Svelte initializes
        // This ensures only ONE loading screen is visible (the Svelte LoadingScreen component)
        (function() {
            const staticLoading = document.getElementById('static-loading-screen');
            if (staticLoading) {
                staticLoading.style.display = 'none';
            }
        })();
        
        // Preload critical data
        window.__PRELOADED_STATE__ = {
            route: "${route.path}",
            language: "${lang}",
            seoData: ${JSON.stringify(data)}
        };
    </script>
    
    <!-- JavaScript bundles -->
    ${jsFiles.map(js => `<script src="${js}"></script>`).join('\n    ')}
</body>
</html>`;
}

// Get locale string from language code
function getLocale(lang) {
    const localeMap = {
        en: 'en_US',
        de: 'de_DE',
        'de-CH': 'de_CH',
        es: 'es_ES',
        nl: 'nl_NL',
        it: 'it_IT',
        fr: 'fr_FR',
        pl: 'pl_PL',
        ru: 'ru_RU',
        tr: 'tr_TR',
        af: 'af_ZA',
        ja: 'ja_JP',
        ko: 'ko_KR',
        tlh: 'tlh',
        sjn: 'sjn'
    };
    return localeMap[lang] || 'en_US';
}

// Finde die tatsächlichen Asset-Dateien im Build-Verzeichnis
function findBuildAssets(buildDir) {
    const assets = {
        css: [],
        js: []
    };
    
    try {
        const staticDir = path.join(buildDir, 'static');
        if (fs.existsSync(staticDir)) {
            // Finde CSS-Dateien
            const cssDir = path.join(staticDir, 'css');
            if (fs.existsSync(cssDir)) {
                const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
                assets.css = cssFiles.map(f => `/static/css/${f}`);
            }
            
            // Finde JS-Dateien (app.js und runtime.js)
            const jsDir = path.join(staticDir, 'js');
            if (fs.existsSync(jsDir)) {
                const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
                // Sortiere: app.js zuerst, dann runtime.js, dann chunks
                jsFiles.sort((a, b) => {
                    if (a.startsWith('app.')) return -1;
                    if (b.startsWith('app.')) return 1;
                    if (a.startsWith('runtime.')) return -1;
                    if (b.startsWith('runtime.')) return 1;
                    return a.localeCompare(b);
                });
                assets.js = jsFiles.map(f => `/static/js/${f}`);
            }
        }
    } catch (error) {
        console.warn('⚠️ Could not find build assets, using fallback paths:', error.message);
    }
    
    return assets;
}

// Hauptfunktion
function generateStaticRoutes() {
    const buildDir = path.join(__dirname, '../build');

    if (!fs.existsSync(buildDir)) {
        console.error('❌ Build directory not found. Run npm run build first.');
        return;
    }

    console.log('🚀 Generating static routes for SEO...');
    
    // Finde die tatsächlichen Asset-Dateien
    const buildAssets = findBuildAssets(buildDir);
    console.log('📦 Found build assets:', {
        css: buildAssets.css.length,
        js: buildAssets.js.length
    });

    // Generiere HTML für jede Route und Sprache
    routes.forEach(route => {
        // Generiere auch Route ohne Sprachpräfix (für /account, /contact, etc.)
        if (route.path !== '/') {
            const routePath = route.path;
            const dir = path.join(buildDir, routePath);

            // Erstelle Verzeichnis falls nicht vorhanden
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Generiere HTML für Route ohne Sprachpräfix (default: en)
            const html = generateRouteHTML(route, 'en', buildAssets);
            const filePath = path.join(dir, 'index.html');

            fs.writeFileSync(filePath, html);
            console.log(`✅ Generated: ${route.path}/index.html`);
        }

        // Generiere HTML für jede Sprache
        supportedLanguages.forEach(lang => {
            const routePath = route.path === '/' ? '' : route.path;
            const dir = path.join(buildDir, lang, routePath);

            // Erstelle Verzeichnis falls nicht vorhanden
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Generiere HTML
            const html = generateRouteHTML(route, lang, buildAssets);
            const filePath = path.join(dir, 'index.html');

            fs.writeFileSync(filePath, html);
            console.log(`✅ Generated: ${lang}${route.path}/index.html`);
        });
    });

    // Generiere robots.txt
    const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://keymoji.wtf/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block unnecessary files
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /static/js/
Disallow: /static/css/`;

    fs.writeFileSync(path.join(buildDir, 'robots.txt'), robotsContent);
    console.log('✅ Generated: robots.txt');

    console.log('🎉 Static routes generation completed!');
}

// Script ausführen
generateStaticRoutes();
