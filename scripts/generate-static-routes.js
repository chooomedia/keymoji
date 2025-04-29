// scripts/generate-static-routes.js
const fs = require('fs');
const path = require('path');

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
    'da',
    'ru',
    'tr',
    'af',
    'ja',
    'ko',
    'tlh',
    'qya'
];

// Zu erstellende Routen
const routes = ['/blog', '/versions', '/contact'];

// Hole den Inhalt der index.html
const indexPath = path.join(__dirname, '../build/index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Erstelle Verzeichnisse für Sprachrouten
languages.forEach(lang => {
    const langDir = path.join(__dirname, '../build', lang);

    // Erstelle Sprachverzeichnis
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }

    // Erstelle index.html für Sprachverzeichnis
    fs.writeFileSync(path.join(langDir, 'index.html'), indexContent);

    // Erstelle Unterverzeichnisse für Routen
    routes.forEach(route => {
        const routePath = route.startsWith('/') ? route.substring(1) : route;
        const routeDir = path.join(langDir, routePath);

        // Erstelle Verzeichnis für Route
        if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
        }

        // Erstelle index.html für Route
        fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
    });
});

// Erstelle auch die Routen ohne Sprachpräfix
routes.forEach(route => {
    const routePath = route.startsWith('/') ? route.substring(1) : route;
    const routeDir = path.join(__dirname, '../build', routePath);

    // Erstelle Verzeichnis für Route
    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }

    // Erstelle index.html für Route
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
});

console.log('Static routes generated successfully!');
