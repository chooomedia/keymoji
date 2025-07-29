/**
 * Centralized environment utilities
 * - Consistent environment detection across the application
 * - Development mode helpers
 * - Production mode helpers
 * - Environment-specific configurations
 */

/**
 * Get the current environment
 * @returns {string} 'development' | 'production' | 'test'
 */
export function getEnvironment() {
    try {
        return typeof process !== 'undefined' &&
            process.env &&
            process.env.NODE_ENV
            ? process.env.NODE_ENV
            : 'production';
    } catch (e) {
        console.warn(
            'Could not access environment variables, defaulting to production'
        );
        return 'production';
    }
}

/**
 * Check if running in development mode
 * @returns {boolean} True if in development mode
 */
export function isDevelopment() {
    return getEnvironment() === 'development';
}

/**
 * Check if running in production mode
 * @returns {boolean} True if in production mode
 */
export function isProduction() {
    return getEnvironment() === 'production';
}

/**
 * Check if running in test mode
 * @returns {boolean} True if in test mode
 */
export function isTest() {
    return getEnvironment() === 'test';
}

/**
 * Get debug mode status
 * @returns {boolean} True if debug mode is enabled
 */
export function isDebugMode() {
    return (
        isDevelopment() &&
        typeof window !== 'undefined' &&
        window.location.search.includes('debug=true')
    );
}

/**
 * Get test mode status
 * @returns {boolean} True if test mode is enabled
 */
export function isTestMode() {
    return (
        isDevelopment() &&
        typeof window !== 'undefined' &&
        window.location.search.includes('test=modal')
    );
}

/**
 * Environment-specific configuration
 */
export const ENV_CONFIG = {
    development: {
        debugEnabled: true,
        verboseLogging: true,
        serviceWorkerEnabled: false,
        analyticsEnabled: false
    },
    production: {
        debugEnabled: false,
        verboseLogging: false,
        serviceWorkerEnabled: true,
        analyticsEnabled: true
    },
    test: {
        debugEnabled: true,
        verboseLogging: true,
        serviceWorkerEnabled: false,
        analyticsEnabled: false
    }
};

/**
 * Get environment-specific configuration
 * @returns {object} Configuration for current environment
 */
export function getEnvironmentConfig() {
    const env = getEnvironment();
    return ENV_CONFIG[env] || ENV_CONFIG.production;
}

/**
 * Safe console logging that respects environment settings
 * @param {string} level - 'log' | 'warn' | 'error' | 'info'
 * @param {...any} args - Arguments to log
 */
export function safeLog(level = 'log', ...args) {
    const config = getEnvironmentConfig();

    if (config.verboseLogging || level === 'error') {
        console[level](...args);
    }
}

/**
 * Development-only logging
 * @param {...any} args - Arguments to log
 */
export function devLog(...args) {
    if (isDevelopment()) {
        console.log(...args);
    }
}

/**
 * Development-only warning
 * @param {...any} args - Arguments to log
 */
export function devWarn(...args) {
    if (isDevelopment()) {
        console.warn(...args);
    }
}
