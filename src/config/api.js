// src/config/api.js
// Central configuration for API endpoints and webhooks

const API_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://its.keymoji.wtf/api'
        : 'https://its.keymoji.wtf/api'; // Use production API in development too

const N8N_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://n8n.chooomedia.com/webhook'
        : 'https://n8n.chooomedia.com/webhook'; // Use production n8n in development too

export const WEBHOOKS = {
    // Account Management
    ACCOUNT: {
        CRUD: `${API_URL}/account`,
        UPDATE: `${API_URL}/account/update`,
        MAGIC_LINK_SEND: `${API_URL}/magic-link/send`,
        MAGIC_LINK_VERIFY: `${API_URL}/magic-link/verify`,
        CHECK_EXISTS: `${N8N_URL}/xn--moji-pb73c-account-check`, // n8n workflow endpoint
        // Sichere Accounting-Endpunkte
        SECURE_CREATE: `${N8N_URL}/xn--moji-pb73c-account`,
        SECURE_UPDATE: `${N8N_URL}/xn--moji-pb73c-account`,
        SECURE_GET: `${N8N_URL}/xn--moji-pb73c-account`,
        AUDIT_LOG: `${N8N_URL}/xn--moji-pb73c-accounting-audit-log`
    },

    // Analytics & User Counter
    USER_COUNTER: `${N8N_URL}/xn--moji-pb73c-counter`,

    // Contact Form
    CONTACT: {
        SEND: `${API_URL}/contact`
    },

    // Payment Processing
    PAYMENT: {
        PROCESS: `${API_URL}/payment`
    },

    // Random Generation
    RANDOM: {
        GENERATE: `${API_URL}/random`
    },

    // Security & Audit
    SECURITY: {
        AUDIT_LOG: `${API_URL}/security/audit-log`
    },

    // Email Templates
    EMAIL: {
        TEST: `${API_URL}/test-emails`
    },

    // Accounting & Financial Security
    ACCOUNTING: {
        AUDIT_LOG: `${N8N_URL}/xn--moji-pb73c-accounting-audit-log`,
        SECURITY_LOG: `${N8N_URL}/xn--moji-pb73c-accounting-security-log`,
        VALIDATION: `${N8N_URL}/xn--moji-pb73c-accounting-validation`,
        RATE_LIMIT: `${N8N_URL}/xn--moji-pb73c-accounting-rate-limit`
    }
};

export const API_ENDPOINTS = {
    // Account Management
    ACCOUNT: {
        CREATE: `${API_URL}/account`,
        UPDATE: `${API_URL}/account/update`,
        GET: `${API_URL}/account`,
        DELETE: `${API_URL}/account`
    },

    // Magic Link System
    MAGIC_LINK: {
        SEND: `${API_URL}/magic-link/send`,
        VERIFY: `${API_URL}/magic-link/verify`,
        RESEND: `${API_URL}/resend-magic-link`
    },

    // Contact Form
    CONTACT: {
        SUBMIT: `${API_URL}/contact`
    },

    // Payment Processing
    PAYMENT: {
        PROCESS: `${API_URL}/payment`,
        WEBHOOK: `${API_URL}/payment/webhook`
    },

    // Random Generation
    RANDOM: {
        GENERATE: `${API_URL}/random`,
        STORY: `${API_URL}/random/story`
    },

    // Security & Monitoring
    SECURITY: {
        AUDIT_LOG: `${API_URL}/security/audit-log`,
        RATE_LIMIT: `${API_URL}/security/rate-limit`
    },

    // Email Testing
    EMAIL: {
        TEST: `${API_URL}/test-emails`
    }
};

// Environment-specific configurations
export const API_CONFIG = {
    development: {
        baseUrl: 'https://its.keymoji.wtf/api', // Use production API in development
        timeout: 5000,
        retries: 3
    },
    production: {
        baseUrl: 'https://its.keymoji.wtf/api',
        timeout: 10000,
        retries: 5
    }
};

// Default configuration
export const DEFAULT_CONFIG = API_CONFIG[process.env.NODE_ENV || 'development'];

export default {
    WEBHOOKS,
    API_ENDPOINTS,
    API_CONFIG,
    DEFAULT_CONFIG
};
