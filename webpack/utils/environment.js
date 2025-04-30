// libs
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Lade die richtige .env-Datei basierend auf der Umgebung
function loadEnv(mode) {
    const basePath = path.resolve(process.cwd());
    const envFile = mode === 'production' ? '.env.production' : '.env';

    // Versuche zuerst die umgebungsspezifische Datei zu laden
    let envPath = path.resolve(basePath, envFile);

    // Fallback zur .env-Datei, wenn die spezifische nicht existiert
    if (!fs.existsSync(envPath)) {
        envPath = path.resolve(basePath, '.env');

        // Wenn auch die normale .env nicht existiert, nutze die Beispieldatei als Fallback
        if (!fs.existsSync(envPath)) {
            envPath = path.resolve(basePath, '.env.example');
            console.warn(
                `Weder .env noch ${envFile} gefunden. Verwende .env.example als Fallback.`
            );
        }
    }

    // Lade die env-Datei, aber fange Fehler ab
    try {
        const config = dotenv.config({ path: envPath });
        return config.parsed || {};
    } catch (error) {
        console.warn(
            `Fehler beim Laden der Umgebungsvariablen aus ${envPath}:`,
            error
        );
        return {};
    }
}

// utils
const packageJSON = JSON.parse(fs.readFileSync('./package.json'));

// Sichere Methode um Werte zu stringifizieren
const stringify = data => {
    try {
        return JSON.stringify(data);
    } catch (e) {
        console.warn('Fehler beim Stringifizieren:', e);
        return JSON.stringify(String(data));
    }
};

// Common variables
const common = {
    APP_VERSION: stringify(packageJSON.version),
    APP_NAME: stringify(packageJSON.name)
};

// Lade die Umgebungsvariablen
const developmentEnv = loadEnv('development');
const productionEnv = loadEnv('production');

// Konvertiere Umgebungsvariablen in das richtige Format
function convertEnvValues(env) {
    const result = {};

    for (const key in env) {
        // Schlüssel in Großbuchstaben zu process.env-Schlüsseln umwandeln
        result[key.toUpperCase()] = stringify(env[key]);
    }

    return result;
}

module.exports = {
    development: {
        ...common,
        NODE_ENV: stringify('development'),
        // Füge alle env-Variablen hinzu
        ...convertEnvValues(developmentEnv),
        // Stelle sicher, dass kritische Variablen immer verfügbar sind
        WEBHOOK_BASE: stringify(
            developmentEnv.WEBHOOK_BASE ||
                'https://n8n.chooomedia.com/webhook-test'
        ),
        WEBHOOK_TEST_BASE: stringify(
            developmentEnv.WEBHOOK_TEST_BASE ||
                'https://n8n.chooomedia.com/webhook-test'
        )
    },
    production: {
        ...common,
        NODE_ENV: stringify('production'),
        // Füge alle env-Variablen hinzu
        ...convertEnvValues(productionEnv),
        // Stelle sicher, dass kritische Variablen immer verfügbar sind
        WEBHOOK_BASE: stringify(
            productionEnv.WEBHOOK_BASE || 'https://n8n.chooomedia.com/webhook'
        ),
        WEBHOOK_TEST_BASE: stringify(
            productionEnv.WEBHOOK_TEST_BASE ||
                'https://n8n.chooomedia.com/webhook-test'
        )
    }
};
