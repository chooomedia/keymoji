// libs
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Lade die richtige .env-Datei basierend auf der Umgebung
// Priority: .env.local > .env.{mode} > .env > .env.example
function loadEnv(mode) {
    const basePath = path.resolve(process.cwd());

    // Priority order (highest first):
    // 1. .env.local (highest priority, never committed)
    // 2. .env.{mode} (.env.development or .env.production)
    // 3. .env (shared defaults)
    // 4. .env.example (fallback template)

    const envFiles = [
        '.env.local',
        mode === 'production' ? '.env.production' : '.env.development',
        '.env',
        '.env.example'
    ];

    let loadedEnv = {};

    // Load files in priority order (later files override earlier ones)
    for (const envFile of envFiles) {
        const envPath = path.resolve(basePath, envFile);

        if (fs.existsSync(envPath)) {
            try {
                const config = dotenv.config({ path: envPath });
                if (config.parsed) {
                    loadedEnv = { ...loadedEnv, ...config.parsed };
                    if (envFile === '.env.example') {
                        console.warn(
                            `⚠️ Using .env.example as fallback. Please create .env.local for local development.`
                        );
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error loading ${envFile}:`, error.message);
            }
        }
    }

    return loadedEnv;
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

// WICHTIG: Wir entfernen NODE_ENV aus dem result Objekt, da es durch Webpack selbst gesetzt wird
module.exports = {
    development: {
        ...common,
        // NODE_ENV wird nicht hier definiert, sondern durch mode: 'development' in webpack/start.js
        ...convertEnvValues(developmentEnv),
        // VITE_ variables werden für import.meta.env verfügbar gemacht
        // SECURITY: URLs should be set via environment variables, not hardcoded
        VITE_API_URL: stringify(
            developmentEnv.VITE_API_URL || developmentEnv.API_URL || ''
        ),
        VITE_N8N_URL: stringify(
            developmentEnv.VITE_N8N_URL || developmentEnv.N8N_URL || ''
        )
    },
    production: {
        ...common,
        // NODE_ENV wird nicht hier definiert, sondern durch mode: 'production' in webpack/build.js
        ...convertEnvValues(productionEnv),
        // VITE_ variables werden für import.meta.env verfügbar gemacht
        // SECURITY: URLs should be set via environment variables, not hardcoded
        VITE_API_URL: stringify(
            productionEnv.VITE_API_URL || productionEnv.API_URL || ''
        ),
        VITE_N8N_URL: stringify(
            productionEnv.VITE_N8N_URL || productionEnv.N8N_URL || ''
        )
    }
};
