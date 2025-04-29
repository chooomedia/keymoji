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
    sitemapContent += '  <url>\n';

    // Default URL (no language prefix)
    sitemapContent += `    <loc>${baseUrl}${route}</loc>\n`;

    // Add lastmod date from the updatedTime
    sitemapContent += `    <lastmod>${updatedTime.split('T')[0]}</lastmod>\n`;

    // Set change frequency
    sitemapContent += '    <changefreq>weekly</changefreq>\n';

    // Set priority (home page has highest priority)
    const priority = route === '/' ? '1.0' : '0.8';
    sitemapContent += `    <priority>${priority}</priority>\n`;

    // Add alternate language versions
    languages.forEach(lang => {
        const langUrl = `${baseUrl}/${lang}${route}`;
        sitemapContent += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}" />\n`;
    });

    // Add x-default hreflang
    sitemapContent += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${route}" />\n`;

    sitemapContent += '  </url>\n';

    // Also add language-specific URLs
    languages.forEach(lang => {
        sitemapContent += '  <url>\n';
        sitemapContent += `    <loc>${baseUrl}/${lang}${route}</loc>\n`;
        sitemapContent += `    <lastmod>${
            updatedTime.split('T')[0]
        }</lastmod>\n`;
        sitemapContent += '    <changefreq>weekly</changefreq>\n';
        sitemapContent += `    <priority>${priority}</priority>\n`;

        // Add alternate language versions
        languages.forEach(alternateLang => {
            const langUrl = `${baseUrl}/${alternateLang}${route}`;
            sitemapContent += `    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${langUrl}" />\n`;
        });

        // Add x-default hreflang
        sitemapContent += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${route}" />\n`;

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
