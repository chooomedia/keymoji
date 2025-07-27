// scripts/prerender-meta.js
const fs = require('fs');
const path = require('path');

// Language configurations
const languages = [
    'en',
    'de',
    'dech',
    'es',
    'nl',
    'it',
    'fr',
    'pl',
    'da',
    'ru',
    'tr',
    'af',
    'ja',
    'ko',
    'tlh',
    'qya'
];

// Routes that need meta tags
const routes = ['/', '/blog', '/versions', '/contact'];

// Meta tag templates for each route
const metaTemplates = {
    '/': {
        title: 'Keymoji - Emoji Password Generator',
        description:
            'Generate secure, AI-resistant emoji passwords. Create memorable passwords with emojis in 15+ languages. Free, open-source, and privacy-focused.',
        keywords:
            'emoji password, password generator, secure passwords, AI resistant, keymoji'
    },
    '/blog': {
        title: 'Keymoji Blog - Password Security & Tips',
        description:
            'Learn about emoji passwords, security tips, and updates from Keymoji. Stay informed about the latest in password security.',
        keywords:
            'password security, emoji passwords, security blog, keymoji blog'
    },
    '/versions': {
        title: 'Keymoji Version History & Updates',
        description:
            'Track the development and updates of Keymoji. See new features, improvements, and bug fixes in each version.',
        keywords: 'keymoji updates, version history, changelog, new features'
    },
    '/contact': {
        title: 'Contact Keymoji - Get in Touch',
        description:
            'Have questions or feedback about Keymoji? Contact us for support, suggestions, or collaboration.',
        keywords: 'contact keymoji, support, feedback, get in touch'
    }
};

// Generate meta tags HTML
function generateMetaTags(route, lang = 'en') {
    const meta = metaTemplates[route] || metaTemplates['/'];
    const baseUrl = 'https://keymoji.wtf';
    const url =
        route === '/' ? `${baseUrl}/${lang}` : `${baseUrl}/${lang}${route}`;
    const imageUrl = `${baseUrl}/images/keymoji-social-media-banner-10-2024-min.png`;

    return `
    <!-- Primary Meta Tags -->
    <title>${meta.title}</title>
    <meta name="title" content="${meta.title}">
    <meta name="description" content="${meta.description}">
    <meta name="keywords" content="${meta.keywords}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1640">
    <meta property="og:image:height" content="924">
    <meta property="og:site_name" content="Keymoji">
    <meta property="og:locale" content="${getLocale(lang)}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${meta.title}">
    <meta property="twitter:description" content="${meta.description}">
    <meta property="twitter:image" content="${imageUrl}">
    
    <!-- Canonical -->
    <link rel="canonical" href="${url}">`;
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
        da: 'da_DK',
        ru: 'ru_RU',
        tr: 'tr_TR',
        af: 'af_ZA',
        ja: 'ja_JP',
        ko: 'ko_KR',
        tlh: 'tlh',
        qya: 'qya'
    };
    return localeMap[lang] || 'en_US';
}

// Update index.html with proper meta tags
function updateIndexHtml() {
    const indexPath = path.join(__dirname, '../build/index.html');

    if (!fs.existsSync(indexPath)) {
        console.error('build/index.html not found. Run build first.');
        return;
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    // Default meta tags for root
    const defaultMeta = generateMetaTags('/', 'en');

    // Replace or insert meta tags
    if (html.includes('</head>')) {
        html = html.replace('</head>', `${defaultMeta}\n</head>`);
        fs.writeFileSync(indexPath, html);
        console.log('✅ Updated index.html with meta tags');
    }
}

// Create route-specific HTML files with proper meta tags
function createRouteFiles() {
    const buildDir = path.join(__dirname, '../build');

    languages.forEach(lang => {
        routes.forEach(route => {
            const routePath = route === '/' ? '' : route;
            const dir = path.join(buildDir, lang, routePath);

            // Ensure directory exists
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Read base HTML
            const baseHtml = fs.readFileSync(
                path.join(buildDir, 'index.html'),
                'utf8'
            );

            // Generate meta tags for this route
            const metaTags = generateMetaTags(route, lang);

            // Replace meta tags
            let html = baseHtml;

            // Remove existing meta tags to avoid duplicates
            html = html.replace(/<meta name="title"[^>]*>/g, '');
            html = html.replace(/<meta name="description"[^>]*>/g, '');
            html = html.replace(/<meta property="og:[^"]*"[^>]*>/g, '');
            html = html.replace(/<meta property="twitter:[^"]*"[^>]*>/g, '');
            html = html.replace(/<link rel="canonical"[^>]*>/g, '');

            // Insert new meta tags
            html = html.replace('</head>', `${metaTags}\n</head>`);

            // Write file
            fs.writeFileSync(path.join(dir, 'index.html'), html);
        });
    });

    console.log('✅ Created route-specific HTML files with meta tags');
}

// Run the script
updateIndexHtml();
createRouteFiles();

console.log('✅ Meta tags pre-rendering complete!');
