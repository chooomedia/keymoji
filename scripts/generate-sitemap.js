// scripts/generate-sitemap.js
// Generiert eine vollständige XML-Sitemap für bessere SEO
const fs = require('fs');
const path = require('path');

// SEO-optimierte Routen-Konfiguration
const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/versions', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' }
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

// Generiere XML-Sitemap
function generateSitemap() {
    const baseUrl = 'https://keymoji.wtf';
    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Generiere URLs für jede Route und Sprache
    routes.forEach(route => {
        languages.forEach(lang => {
            const url =
                route.path === '/'
                    ? `${baseUrl}/${lang}`
                    : `${baseUrl}/${lang}${route.path}`;

            const lastmod = currentDate;

            sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>`;

            // Füge hreflang-Links hinzu
            languages.forEach(altLang => {
                const altUrl =
                    route.path === '/'
                        ? `${baseUrl}/${altLang}`
                        : `${baseUrl}/${altLang}${route.path}`;

                sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`;
            });

            // Füge x-default hinzu
            const defaultUrl = `${baseUrl}${route.path}`;
            sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`;

            sitemap += `
  </url>
`;
        });
    });

    sitemap += `</urlset>`;

    return sitemap;
}

// Generiere robots.txt
function generateRobotsTxt() {
    return `User-agent: *
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
Disallow: /static/css/

# Allow important files
Allow: /manifest.json
Allow: /service-worker.js
Allow: /favicon.ico
Allow: /images/
Allow: /fonts/

# Social Media Bot Optimization
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: Discordbot
Allow: /

User-agent: Signal
Allow: /

User-agent: embedly
Allow: /

User-agent: quora
Allow: /

User-agent: outbrain
Allow: /

User-agent: pinterest
Allow: /

User-agent: vkShare
Allow: /

User-agent: W3C_Validator
Allow: /`;
}

// Hauptfunktion
function generateSitemapAndRobots() {
    const buildDir = path.join(__dirname, '../build');

    if (!fs.existsSync(buildDir)) {
        console.error('❌ Build directory not found. Run npm run build first.');
        return;
    }

    console.log('🚀 Generating sitemap.xml and robots.txt...');

    // Generiere sitemap.xml
    const sitemap = generateSitemap();
    const sitemapPath = path.join(buildDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('✅ Generated: sitemap.xml');

    // Generiere robots.txt
    const robots = generateRobotsTxt();
    const robotsPath = path.join(buildDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robots);
    console.log('✅ Generated: robots.txt');

    // Generiere sitemap-index.xml für bessere Organisation
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://keymoji.wtf/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    const sitemapIndexPath = path.join(buildDir, 'sitemap-index.xml');
    fs.writeFileSync(sitemapIndexPath, sitemapIndex);
    console.log('✅ Generated: sitemap-index.xml');

    console.log('🎉 Sitemap and robots.txt generation completed!');
    console.log(
        `📊 Generated ${routes.length * languages.length} URLs for ${
            languages.length
        } languages`
    );
}

// Script ausführen
generateSitemapAndRobots();
