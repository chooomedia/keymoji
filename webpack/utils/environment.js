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

    // Load files in priority order (earlier files have higher priority)
    // IMPORTANT: .env.example should NOT override values from .env.local
    for (const envFile of envFiles) {
        const envPath = path.resolve(basePath, envFile);

        if (fs.existsSync(envPath)) {
            try {
                const config = dotenv.config({ path: envPath });
                if (config.parsed) {
                    // For .env.example: only add variables that don't already exist
                    // This prevents .env.example from overriding .env.local values
                    if (envFile === '.env.example') {
                        const existingKeys = Object.keys(loadedEnv);
                        const newKeys = Object.keys(config.parsed).filter(
                            key => !existingKeys.includes(key)
                        );
                        
                        if (newKeys.length > 0) {
            console.warn(
                                `⚠️ Using .env.example as fallback for: ${newKeys.join(', ')}. Please create .env.local for local development.`
            );
                            // Only add missing keys from .env.example
                            for (const key of newKeys) {
                                loadedEnv[key] = config.parsed[key];
                            }
                        }
                    } else {
                        // For all other files: merge normally (later files override earlier ones)
                        loadedEnv = { ...loadedEnv, ...config.parsed };
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
        VITE_N8N_URL: (() => {
            const url = developmentEnv.VITE_N8N_URL || developmentEnv.N8N_URL;
            // Only stringify if URL exists and is not empty
            if (url && url.trim() && url.trim() !== '""' && url.trim() !== "''") {
                return stringify(url.trim());
            }
            // Return empty string (will be handled by getN8NUrl fallback)
            return stringify('');
        })(),
        // Apertus n8n token (explicitly handled for security)
        VITE_N8N_APERTUS_TOKEN: (() => {
            const token = developmentEnv.VITE_N8N_APERTUS_TOKEN;
            // Only stringify if token exists and is not empty/placeholder
            if (token && token.trim() && 
                token.trim() !== '""' && token.trim() !== "''" &&
                !token.includes('your_apertus_n8n_token_here')) {
                return stringify(token.trim());
            }
            // Return empty string if not set (will be handled by callApertus)
            return stringify('');
        })()
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
        VITE_N8N_URL: (() => {
            const url = productionEnv.VITE_N8N_URL || productionEnv.N8N_URL;
            // Only stringify if URL exists and is not empty
            if (url && url.trim() && url.trim() !== '""' && url.trim() !== "''") {
                return stringify(url.trim());
            }
            // Return empty string (will be handled by getN8NUrl fallback)
            return stringify('');
        })(),
        // Apertus n8n token (explicitly handled for security)
        VITE_N8N_APERTUS_TOKEN: (() => {
            const token = productionEnv.VITE_N8N_APERTUS_TOKEN;
            // Only stringify if token exists and is not empty/placeholder
            if (token && token.trim() && 
                token.trim() !== '""' && token.trim() !== "''" &&
                !token.includes('your_apertus_n8n_token_here')) {
                return stringify(token.trim());
            }
            // Return empty string if not set (will be handled by callApertus)
            return stringify('');
        })()
    }
};
