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

// Sicherstellen, dass der Basis-Build-Ordner existiert
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Stelle sicher, dass die "en" Route als Standard existiert
// WICHTIG: Die Root-Route wird nun durch den Server auf /en umgeleitet
const enDir = path.join(buildDir, 'en');
if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
}

// Erstelle index.html für die Englische Version (Standard)
fs.writeFileSync(path.join(enDir, 'index.html'), indexContent);

// Erstelle Verzeichnisse für die übrigen Sprachrouten
languages.forEach(lang => {
    // Überspringe "en", da wir es bereits erstellt haben
    if (lang === 'en') return;

    const langDir = path.join(buildDir, lang);

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

// Erstelle auch die englischen Routen ohne Sprachpräfix für Fallback
// (falls Server-Redirect nicht funktioniert)
routes.forEach(route => {
    const routePath = route.startsWith('/') ? route.substring(1) : route;
    const routeDir = path.join(buildDir, routePath);

    // Erstelle Verzeichnis für Route
    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }

    // Erstelle index.html für Route
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
});

console.log(
    'Static routes generated successfully with /en as default language!'
);
