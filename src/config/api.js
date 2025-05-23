// src/config/api.js
// Zentrale Konfiguration für API-Endpoints und Webhooks

// DIREKTE LÖSUNG: Im Entwicklungsmodus immer localhost:3000 verwenden
// Da wir im Browser sind, können wir window.location überprüfen, um zu entscheiden

// Erkennen, ob wir in der Entwicklungsumgebung sind
const isLocalDevelopment =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

console.log(
    'Umgebung erkannt:',
    isLocalDevelopment ? 'Lokale Entwicklung' : 'Produktion'
);

// Lokale API-URL oder Produktions-URL basierend auf der Umgebung
const API_URL = isLocalDevelopment
    ? 'http://localhost:3000/api' // Lokaler Test-Server
    : 'https://api.keymoji.wtf/api'; // Produktionsserver

// Legacy n8n Basis-URLs
const WEBHOOK_BASE = 'https://n8n.chooomedia.com/webhook';
const WEBHOOK_TEST_BASE = 'https://n8n.chooomedia.com/webhook-test';
const getBaseUrl = () =>
    isLocalDevelopment ? WEBHOOK_TEST_BASE : WEBHOOK_BASE;

// Zentrale Endpunkt-Definitionen
export const WEBHOOKS = {
    // Benutzer-Zähler (weiterhin über n8n)
    USER_COUNTER: `${getBaseUrl()}/xn--moji-pb73c-userCounter`,

    // Story-Generator (weiterhin über n8n)
    STORY_GENERATOR: `${getBaseUrl()}/xn--moji-pb73c-generate-story`,

    // Blog-bezogene Webhooks (weiterhin über n8n)
    BLOG: {
        POSTS: `${getBaseUrl()}/xn--moji-pb73c-blog-posts`,
        POST: slug => `${getBaseUrl()}/xn--moji-pb73c-blog-post/${slug}`,
        LIKE: id => `${getBaseUrl()}/xn--moji-pb73c-blog-like/${id}`
    },

    // Kontaktformular - Brevo Integration
    CONTACT: {
        SEND_MAIL: 'https://its.keymoji.wtf/api/contact',

        // Legacy-Endpunkte
        OPTIN: `${getBaseUrl()}/xn--moji-pb73c-optin-keymoji`,
        NEWSLETTER: `${getBaseUrl()}/xn--moji-pb73c-newsletter`
    }
};

// Debug-Ausgabe zur Überprüfung
console.log('Kontaktformular-Endpunkt:', WEBHOOKS.CONTACT.SEND_MAIL);

// API-Konfiguration
export const API_CONFIG = {
    // Timeout-Werte in Millisekunden
    TIMEOUTS: {
        DEFAULT: 5000,
        CONTACT_FORM: 10000,
        STORY_GENERATOR: 15000
    },

    // Wiederholungsversuche bei Netzwerkfehlern
    RETRIES: {
        DEFAULT: 1,
        CONTACT_FORM: 2
    },

    // Anti-Spam-Einstellungen
    RATE_LIMITING: {
        MAX_SUBMISSIONS_PER_EMAIL: 3,
        SUBMISSION_WINDOW_HOURS: 24
    }
};

export default WEBHOOKS;
