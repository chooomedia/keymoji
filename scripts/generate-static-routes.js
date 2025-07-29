// scripts/generate-static-routes.js
// Generiert statische HTML-Dateien für bessere SEO
const fs = require('fs');
const path = require('path');

// SEO-optimierte Routen-Konfiguration
const routes = [
    { path: '/', type: 'home' },
    { path: '/versions', type: 'versions' },
    { path: '/contact', type: 'contact' },
    { path: '/blog', type: 'blog' }
];

// Unterstützte Sprachen
const languages = [
    'en',
    'de',
    'dech',
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
    }
};

// Generiere HTML für eine Route
function generateRouteHTML(route, lang = 'en') {
    const baseUrl = 'https://keymoji.wtf';
    const url =
        route.path === '/'
            ? `${baseUrl}/${lang}`
            : `${baseUrl}/${lang}${route.path}`;
    const canonicalUrl = url.endsWith('/') ? url : `${url}/`;
    const data = seoData[route.type];

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
    
    <!-- Language Alternates -->
    ${languages
        .map(l => {
            const altUrl =
                l === 'en'
                    ? `${baseUrl}${route.path}`
                    : `${baseUrl}/${l}${route.path}`;
            return `<link rel="alternate" hreflang="${l}" href="${altUrl}">`;
        })
        .join('\n    ')}
    <link rel="alternate" hreflang="x-default" href="${baseUrl}${route.path}">
    
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
    <link rel="preload" href="/static/css/styles.css" as="style">
    <link rel="preload" href="/static/js/app.js" as="script">
    
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
</head>
<body>
    <div id="app">
        <!-- Loading state for better UX -->
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #253852; margin-bottom: 1rem;">🔑 Keymoji</h1>
                <p style="color: #666; margin-bottom: 2rem;">Loading Emoji Password Generator...</p>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #253852; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </div>
    
    <!-- Svelte app will be mounted here -->
    <script>
        // Preload critical data
        window.__PRELOADED_STATE__ = {
            route: "${route.path}",
            language: "${lang}",
            seoData: ${JSON.stringify(data)}
        };
    </script>
</body>
</html>`;
}

// Get locale string from language code
function getLocale(lang) {
    const localeMap = {
        en: 'en_US',
        de: 'de_DE',
        dech: 'de_CH',
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

// Hauptfunktion
function generateStaticRoutes() {
    const buildDir = path.join(__dirname, '../build');

    if (!fs.existsSync(buildDir)) {
        console.error('❌ Build directory not found. Run npm run build first.');
        return;
    }

    console.log('🚀 Generating static routes for SEO...');

    // Generiere HTML für jede Route und Sprache
    routes.forEach(route => {
        languages.forEach(lang => {
            const routePath = route.path === '/' ? '' : route.path;
            const dir = path.join(buildDir, lang, routePath);

            // Erstelle Verzeichnis falls nicht vorhanden
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Generiere HTML
            const html = generateRouteHTML(route, lang);
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
