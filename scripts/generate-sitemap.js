// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

// Prüfe ob updatedTime.js importiert werden kann
let updatedTime;
try {
    const updatedTimePath = path.join(__dirname, '../src/updatedTime.js');
    const updatedTimeContent = fs.readFileSync(updatedTimePath, 'utf8');

    // Extrahiere das Datum mit Regex (robuster als Import)
    const dateMatch = updatedTimeContent.match(
        /['"](\d{4}-\d{2}-\d{2}T[^'"]+)['"]/
    );
    if (dateMatch && dateMatch[1]) {
        updatedTime = dateMatch[1];
    } else {
        updatedTime = new Date().toISOString();
        console.warn(
            'Could not extract date from updatedTime.js, using current date'
        );
    }
} catch (error) {
    console.warn('Error reading updatedTime.js:', error);
    updatedTime = new Date().toISOString();
}

// Definiere die unterstützten Sprachen manuell, um Probleme beim Parsen von content.js zu vermeiden
const languages = [
    'en', // Englisch ist die Standardsprache
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

// Define the base URL
const baseUrl = 'https://keymoji.wtf';

// Define all routes (without language prefix)
const routes = ['/', '/blog', '/versions', '/contact'];

// Generate the sitemap XML content
let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemapContent +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
sitemapContent += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

// Add entries for each route in each language
routes.forEach(route => {
    // Haupteintrag - immer mit /en (Standardsprache)
    const canonicalUrl =
        route === '/' ? `${baseUrl}/en` : `${baseUrl}/en${route}`;

    sitemapContent += '  <url>\n';
    sitemapContent += `    <loc>${canonicalUrl}</loc>\n`;
    sitemapContent += `    <lastmod>${updatedTime.split('T')[0]}</lastmod>\n`;
    sitemapContent += '    <changefreq>weekly</changefreq>\n';

    // Set priority (home page has highest priority)
    const priority = route === '/' ? '1.0' : '0.8';
    sitemapContent += `    <priority>${priority}</priority>\n`;

    // Add alternate language versions
    languages.forEach(lang => {
        const langUrl =
            route === '/' ? `${baseUrl}/${lang}` : `${baseUrl}/${lang}${route}`;

        sitemapContent += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />\n`;
    });

    // Add x-default hreflang (pointing to English version)
    sitemapContent += `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />\n`;

    sitemapContent += '  </url>\n';

    // Add language-specific URLs (except for English which is already added as canonical)
    languages
        .filter(lang => lang !== 'en')
        .forEach(lang => {
            const langUrl =
                route === '/'
                    ? `${baseUrl}/${lang}`
                    : `${baseUrl}/${lang}${route}`;

            sitemapContent += '  <url>\n';
            sitemapContent += `    <loc>${langUrl}</loc>\n`;
            sitemapContent += `    <lastmod>${
                updatedTime.split('T')[0]
            }</lastmod>\n`;
            sitemapContent += '    <changefreq>weekly</changefreq>\n';
            sitemapContent += `    <priority>${priority}</priority>\n`;

            // Add canonical link to English version
            sitemapContent += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />\n`;
            sitemapContent += `    <xhtml:link rel="alternate" hreflang="en" href="${canonicalUrl}" />\n`;
            sitemapContent += `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />\n`;

            sitemapContent += '  </url>\n';
        });
});

sitemapContent += '</urlset>';

// Write the sitemap XML file
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapContent);

console.log('Sitemap generated successfully at', sitemapPath);

// Create robots.txt
const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

const robotsPath = path.join(__dirname, '../public/robots.txt');
fs.writeFileSync(robotsPath, robotsContent);

console.log('robots.txt generated successfully at', robotsPath);
