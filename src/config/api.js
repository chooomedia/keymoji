// src/config/api.js
// Zentrale Konfiguration für alle API-Endpunkte und Webhooks

// Sichere Methode, um process.env zu prüfen und Standardwerte zu verwenden
const getEnv = (key, defaultValue) => {
    try {
        // Prüfe ob process existiert (für Browsersicherheit)
        return typeof process !== 'undefined' && process.env && process.env[key]
            ? process.env[key]
            : defaultValue;
    } catch (e) {
        console.warn(
            `Umgebungsvariable ${key} nicht verfügbar, verwende Standard`
        );
        return defaultValue;
    }
};

// Bestimme Umgebung sicher
const isDevelopment = getEnv('NODE_ENV', 'production') === 'development';

// Basis-URLs mit Fallbacks
const WEBHOOK_BASE = getEnv(
    'WEBHOOK_BASE',
    'https://n8n.chooomedia.com/webhook'
);
const WEBHOOK_TEST_BASE = getEnv(
    'WEBHOOK_TEST_BASE',
    'https://n8n.chooomedia.com/webhook-test'
);

// Nutze je nach Umgebung die passende Basis-URL
const getBaseUrl = () => (isDevelopment ? WEBHOOK_TEST_BASE : WEBHOOK_BASE);

// Zentrale Webhook-Definitionen
export const WEBHOOKS = {
    // Benutzer-Zähler
    USER_COUNTER: `${getBaseUrl()}/xn--moji-pb73c-userCounter`,

    // Story-Generator
    STORY_GENERATOR: `${getBaseUrl()}/xn--moji-pb73c-generate-story`,

    // Blog-bezogene Webhooks
    BLOG: {
        POSTS: `${getBaseUrl()}/xn--moji-pb73c-blog-posts`,
        POST: slug => `${getBaseUrl()}/xn--moji-pb73c-blog-post/${slug}`,
        LIKE: id => `${getBaseUrl()}/xn--moji-pb73c-blog-like/${id}`
    },

    // Kontaktformular
    CONTACT: {
        SEND_MAIL: `${getBaseUrl()}/xn--moji-pb73c-mail`,
        OPTIN: `${getBaseUrl()}/xn--moji-pb73c-optin-keymoji`
    }
};

export default WEBHOOKS;
