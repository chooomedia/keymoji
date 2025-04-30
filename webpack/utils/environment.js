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

    // Lade die env-Datei
    const envConfig = dotenv.config({ path: envPath }).parsed || {};

    // Konvertiere zu korrektem Format für webpack
    const envVars = {};
    for (const key in envConfig) {
        envVars[key] = JSON.stringify(envConfig[key]);
    }

    return envVars;
}

// utils
const packageJSON = JSON.parse(fs.readFileSync('./package.json'));
const stringify = data => JSON.stringify(data);

// Common variables
const common = {
    APP_VERSION: stringify(packageJSON.version),
    APP_NAME: stringify(packageJSON.name)
};

// Lade die Umgebungsvariablen
const developmentEnv = loadEnv('development');
const productionEnv = loadEnv('production');

module.exports = {
    development: {
        ...common,
        NODE_ENV: stringify('development'),
        // Füge alle env-Variablen hinzu
        ...developmentEnv
    },
    production: {
        ...common,
        NODE_ENV: stringify('production'),
        // Füge alle env-Variablen hinzu
        ...productionEnv
    }
};
