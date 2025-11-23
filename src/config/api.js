// src/config/api.js
// Central configuration for API endpoints and webhooks
//
// SECURITY: URLs can be overridden via environment variables to avoid exposing
// internal endpoints in the public repository.

// Get API URL from environment or use default
// Priority: VITE_API_URL (env) > default
// SECURITY: Always set VITE_API_URL in production via environment variables!
const getApiUrl = () => {
    const envUrl =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
        undefined;

    // Check if envUrl exists and is not empty/just quotes
    if (envUrl) {
        // Remove any quotes, whitespace, or JSON stringification artifacts
        let cleanedUrl = String(envUrl).trim();

        // Remove JSON stringification quotes (from webpack DefinePlugin)
        cleanedUrl = cleanedUrl.replace(/^["']|["']$/g, '');

        // Remove URL-encoded quotes (%22)
        cleanedUrl = cleanedUrl.replace(/%22/g, '');

        // Remove any remaining quotes
        cleanedUrl = cleanedUrl.replace(/["']/g, '');

        // Debug: Log cleaning process
        console.log('🔍 [Config] VITE_API_URL cleaning:', {
            original: envUrl,
            cleaned: cleanedUrl,
            length: cleanedUrl.length,
            isEmpty: !cleanedUrl || cleanedUrl.length === 0
        });

        // Check if URL is empty or just quotes after cleaning
        // IMPORTANT: Must check length AFTER cleaning, not before
        if (
            cleanedUrl &&
            cleanedUrl.length > 0 &&
            cleanedUrl !== '""' &&
            cleanedUrl !== "''"
        ) {
            // Validate URL format
            if (
                cleanedUrl.startsWith('http://') ||
                cleanedUrl.startsWith('https://')
            ) {
                // Valid URL - remove trailing slash if present
                const finalUrl = cleanedUrl.replace(/\/$/, '');
                console.log(
                    '✅ [Config] Using VITE_API_URL from environment:',
                    finalUrl.substring(0, 30) + '...'
                );
                return finalUrl;
            } else {
                console.warn(
                    '⚠️ [Config] Invalid VITE_API_URL format (must start with http:// or https://):',
                    cleanedUrl.substring(0, 50)
                );
            }
        } else {
            // Empty or invalid - fall through to default
            console.log(
                'ℹ️ [Config] VITE_API_URL is empty or invalid after cleaning, using fallback'
            );
        }
    }

    // Fallback for development (should be overridden via env vars)
    if (
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1')
    ) {
        console.warn(
            '⚠️ [SECURITY] VITE_API_URL not set. Using default fallback. Set VITE_API_URL in .env.local for security.'
        );
    }

    return 'https://its.keymoji.wtf/api'; // Default fallback
};

const API_URL = getApiUrl();

// Debug: Log API URL (without exposing full URL in production)
if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
) {
    console.log('🔗 [Config] API_URL:', API_URL);
}

// Get n8n URL from environment or use default
// Priority: VITE_N8N_URL (env) > default
// SECURITY: Always set VITE_N8N_URL in production via environment variables!
const getN8NUrl = () => {
    const envUrl =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_URL) ||
        undefined;

    // Check if envUrl exists and is not empty/just quotes
    if (envUrl) {
        // Remove any quotes, whitespace, or JSON stringification artifacts
        let cleanedUrl = String(envUrl).trim();

        // Remove JSON stringification quotes (from webpack DefinePlugin)
        cleanedUrl = cleanedUrl.replace(/^["']|["']$/g, '');

        // Remove URL-encoded quotes (%22)
        cleanedUrl = cleanedUrl.replace(/%22/g, '');

        // Remove any remaining quotes
        cleanedUrl = cleanedUrl.replace(/["']/g, '');

        // Debug: Log cleaning process
        console.log('🔍 [Config] VITE_N8N_URL cleaning:', {
            original: envUrl,
            cleaned: cleanedUrl,
            length: cleanedUrl.length,
            isEmpty: !cleanedUrl || cleanedUrl.length === 0
        });

        // Check if URL is empty or just quotes after cleaning
        // IMPORTANT: Must check length AFTER cleaning, not before
        if (
            cleanedUrl &&
            cleanedUrl.length > 0 &&
            cleanedUrl !== '""' &&
            cleanedUrl !== "''"
        ) {
            // Validate URL format
            if (
                cleanedUrl.startsWith('http://') ||
                cleanedUrl.startsWith('https://')
            ) {
                // Valid URL - remove trailing slash if present
                const finalUrl = cleanedUrl.replace(/\/$/, '');
                console.log(
                    '✅ [Config] Using VITE_N8N_URL from environment:',
                    finalUrl.substring(0, 30) + '...'
                );
                return finalUrl;
            } else {
                console.warn(
                    '⚠️ [Config] Invalid VITE_N8N_URL format (must start with http:// or https://):',
                    cleanedUrl.substring(0, 50)
                );
            }
        } else {
            // Empty or invalid - fall through to default
            console.log(
                'ℹ️ [Config] VITE_N8N_URL is empty or invalid after cleaning, using fallback'
            );
        }
    }

    // Fallback for development (should be overridden via env vars)
    // Only show warning once per session to avoid console spam
    if (
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1')
    ) {
        const warningKey = 'n8n_url_warning_shown';
        if (!sessionStorage.getItem(warningKey)) {
            console.warn(
                '⚠️ [SECURITY] VITE_N8N_URL not set. Using default fallback. Set VITE_N8N_URL in .env.local for security.'
            );
            sessionStorage.setItem(warningKey, 'true');
        }
    }

    return 'https://n8n.chooomedia.com/webhook'; // Default fallback
};

// Get N8N URL dynamically (not at build time to avoid empty string issues)
const getN8NUrlDynamic = () => {
    const url = getN8NUrl();
    // Validate URL before returning
    if (!url || url.length === 0 || url.includes('%22') || url.includes('""')) {
        console.error('❌ [Config] Invalid N8N_URL detected:', url);
        return 'https://n8n.chooomedia.com/webhook'; // Fallback
    }
    return url;
};

// Debug: Log N8N URL (without exposing full URL in production)
if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
) {
    const debugUrl = getN8NUrlDynamic();
    console.log('🔗 [Config] N8N_URL:', debugUrl);
}

// Helper function to build n8n webhook URLs dynamically
const buildN8NUrl = path => {
    const baseUrl = getN8NUrlDynamic();
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};

export const WEBHOOKS = {
    // Account Management
    ACCOUNT: {
        CRUD: `${API_URL}/account`,
        READ: `${API_URL}/account`, // READ account data from Google Sheets
        UPDATE: `${API_URL}/account/update`, // Vercel proxy → n8n webhook
        // Direct n8n webhook for UPDATE (used in localhost/dev mode)
        get UPDATE_DIRECT() {
            return buildN8NUrl('/xn--moji-pb73c-account-update');
        },
        MAGIC_LINK_SEND: `${API_URL}/magic-link/send`,
        MAGIC_LINK_VERIFY: `${API_URL}/magic-link/verify`,
        get CHECK_EXISTS() {
            return buildN8NUrl('/xn--moji-pb73c-account-check');
        }, // n8n workflow endpoint
        // Sichere Accounting-Endpunkte
        get SECURE_CREATE() {
            return buildN8NUrl('/xn--moji-pb73c-account');
        },
        get SECURE_UPDATE() {
            return buildN8NUrl('/xn--moji-pb73c-account');
        },
        get SECURE_GET() {
            return buildN8NUrl('/xn--moji-pb73c-account');
        },
        get AUDIT_LOG() {
            return buildN8NUrl('/xn--moji-pb73c-accounting-audit-log');
        }
    },

    // Analytics & User Counter
    get USER_COUNTER() {
        return buildN8NUrl('/xn--moji-pb73c-counter');
    },
    get ANALYTICS() {
        return buildN8NUrl('/xn--moji-pb73c-analytics');
    },

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
    get STORY_GENERATOR() {
        return buildN8NUrl('/xn--moji-pb73c-story-generator');
    },

    // Apertus (Swiss LLM) via n8n
    get APERTUS() {
        return buildN8NUrl('/apertus-test');
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
        get AUDIT_LOG() {
            return buildN8NUrl('/xn--moji-pb73c-accounting-audit-log');
        },
        get SECURITY_LOG() {
            return buildN8NUrl('/xn--moji-pb73c-accounting-security-log');
        },
        get VALIDATION() {
            return buildN8NUrl('/xn--moji-pb73c-accounting-validation');
        },
        get RATE_LIMIT() {
            return buildN8NUrl('/xn--moji-pb73c-accounting-rate-limit');
        }
    },

    // Blog Posts
    BLOG: {
        get POSTS() {
            return buildN8NUrl('/xn--moji-pb73c-blog-posts');
        },
        get POST() {
            return buildN8NUrl('/xn--moji-pb73c-blog-post');
        },
        LIKE: `${API_URL}/blog/like` // Vercel API → n8n webhook
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
    },

    // Blog Management
    BLOG: {
        LIKE: `${API_URL}/blog/like`
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
const getNodeEnv = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env?.MODE) {
        return import.meta.env.MODE === 'development'
            ? 'development'
            : 'production';
    }
    return 'production';
};
export const DEFAULT_CONFIG = API_CONFIG[getNodeEnv()];

export default {
    WEBHOOKS,
    API_ENDPOINTS,
    API_CONFIG,
    DEFAULT_CONFIG
};
