// src/config/api.js
// Zentrale Konfiguration für alle API-Endpunkte und Webhooks

const isDevelopment = process.env.NODE_ENV === 'development';
const WEBHOOK_BASE =
    process.env.WEBHOOK_BASE || 'https://n8n.chooomedia.com/webhook';
const WEBHOOK_TEST_BASE =
    process.env.WEBHOOK_TEST_BASE || 'https://n8n.chooomedia.com/webhook-test';

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
