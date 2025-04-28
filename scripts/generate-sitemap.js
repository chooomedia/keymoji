// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const { updatedTime } = require('../src/updatedTime.js');

// Get content.js to extract language codes
const contentPath = path.join(__dirname, '../src/content.js');
let languages = [];

try {
    // Read content.js to extract language codes
    // This is a simple approach; in production, you might want to use AST parsing
    const contentFile = fs.readFileSync(contentPath, 'utf8');
    const languageRegex = /['"]([a-z]{2,4})['"]:\s*{/g;
    let match;

    while ((match = languageRegex.exec(contentFile)) !== null) {
        languages.push(match[1]);
    }

    if (languages.length === 0) {
        console.warn('No languages found in content.js, using default [en]');
        languages = ['en'];
    }
} catch (error) {
    console.error('Error reading content.js:', error);
    languages = ['en'];
}

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

    // Add lastmod date from the updatedTime.js file
    sitemapContent += `    <lastmod>${updatedTime}</lastmod>\n`;

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
        sitemapContent += `    <lastmod>${updatedTime}</lastmod>\n`;
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
