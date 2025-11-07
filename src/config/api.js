// src/config/api.js
// Central configuration for API endpoints and webhooks
// 
// SECURITY: URLs can be overridden via environment variables to avoid exposing
// internal endpoints in the public repository.

// Get API URL from environment or use default
// Priority: VITE_API_URL (env) > default
const API_URL =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    process.env.VITE_API_URL ||
    'https://its.keymoji.wtf/api';

// Get n8n URL from environment or use default
// Priority: VITE_N8N_URL (env) > default
// SECURITY: Always set VITE_N8N_URL in production via environment variables!
const getN8NUrl = () => {
    const envUrl = 
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_URL) ||
        process.env.VITE_N8N_URL;
    
    if (envUrl) {
        return envUrl;
    }
    
    // Fallback for development (should be overridden via env vars)
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.warn('⚠️ [SECURITY] VITE_N8N_URL not set. Using default fallback. Set VITE_N8N_URL in .env.local for security.');
    }
    
    return 'https://n8n.chooomedia.com/webhook'; // Default fallback
};

const N8N_URL = getN8NUrl();

export const WEBHOOKS = {
    // Account Management
    ACCOUNT: {
        CRUD: `${API_URL}/account`,
        READ: `${API_URL}/account`, // READ account data from Google Sheets
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
    ANALYTICS: `${N8N_URL}/xn--moji-pb73c-analytics`,

    // Contact Form
    CONTACT: {
        SEND: `${API_URL}/contact`,
        SEND_MAIL: `${API_URL}/contact` // Alias for backwards compatibility
    },

    // Payment Processing
    PAYMENT: {
        PROCESS: `${API_URL}/payment`
    },

    // Random Generation
    RANDOM: {
        GENERATE: `${API_URL}/random`
    },

    // Story Generator (AI)
    STORY_GENERATOR: `${N8N_URL}/xn--moji-pb73c-story-generator`,

    // Apertus (Swiss LLM) via n8n
    APERTUS: `${N8N_URL}/apertus-test`,

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
