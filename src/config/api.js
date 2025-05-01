// src/config/api.js
// Zentrale Konfiguration für API-Endpoints und Webhooks

// Erkennen, ob wir in der Entwicklungsumgebung sind
const isLocalDevelopment =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

console.log(
    'Umgebung erkannt:',
    isLocalDevelopment ? 'Lokale Entwicklung' : 'Produktion'
);

// Basis-URL für die API
const API_BASE = isLocalDevelopment
    ? 'http://localhost:3000/api' // Lokaler Test-Server
    : 'https://its.keymoji.wtf/api'; // Produktionsserver

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
        OPTIN: `${getBaseUrl()}/xn--moji-pb73c-optin-keymoji`,
        NEWSLETTER: `${getBaseUrl()}/xn--moji-pb73c-newsletter`
    },

    // Emoji Generator API
    EMOJI_API: {
        // Neuer Server-basierter API-Endpunkt
        RANDOM: `${API_BASE}/random`,

        // Funktion zum Generieren der API-URL für random Emojis
        getRandomUrl: count => {
            return `${API_BASE}/random?count=${count}`;
        }
    }
};

// Debug-Ausgabe zur Überprüfung
console.log('Emoji API Endpunkt:', WEBHOOKS.EMOJI_API.RANDOM);

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
    },

    // Emoji API Einstellungen
    EMOJI_API: {
        MIN_COUNT: 5,
        MAX_COUNT: 9,
        DEFAULT_COUNT: 5,
        PARAM_NAME: 'count'
    }
};

// Hilfsfunktionen für die API
export const ApiUtils = {
    // Einen API-Request für zufällige Emojis durchführen
    async fetchRandomEmojis(count = API_CONFIG.EMOJI_API.DEFAULT_COUNT) {
        try {
            const validCount = Math.min(
                Math.max(count, API_CONFIG.EMOJI_API.MIN_COUNT),
                API_CONFIG.EMOJI_API.MAX_COUNT
            );

            const response = await fetch(
                WEBHOOKS.EMOJI_API.getRandomUrl(validCount)
            );

            if (!response.ok) {
                throw new Error(
                    `API Error: ${response.status} ${response.statusText}`
                );
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching random emojis:', error);
            throw error;
        }
    }
};

export default WEBHOOKS;
