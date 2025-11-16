/**
 * Centralized environment utilities
 * - Consistent environment detection across the application
 * - Development mode helpers
 * - Production mode helpers
 * - Environment-specific configurations
 *
 * TypeScript Migration: v0.7.7
 */

/**
 * Environment type
 */
export type Environment = 'development' | 'production' | 'test';

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
    debugEnabled: boolean;
    verboseLogging: boolean;
    serviceWorkerEnabled: boolean;
    analyticsEnabled: boolean;
}

/**
 * Environment-specific configuration map
 */
export interface EnvironmentConfigMap {
    development: EnvironmentConfig;
    production: EnvironmentConfig;
    test: EnvironmentConfig;
}

/**
 * Get the current environment
 * @returns 'development' | 'production' | 'test'
 */
export function getEnvironment(): Environment {
    try {
        const env = typeof process !== 'undefined' &&
            process.env &&
            process.env.NODE_ENV
            ? process.env.NODE_ENV
            : 'production';
        
        // Type guard to ensure valid environment
        if (env === 'development' || env === 'production' || env === 'test') {
            return env;
        }
        
        return 'production';
    } catch (e) {
        console.warn(
            'Could not access environment variables, defaulting to production'
        );
        return 'production';
    }
}

/**
 * Check if running in development mode
 * @returns True if in development mode
 */
export function isDevelopment(): boolean {
    // Check NODE_ENV first
    if (getEnvironment() === 'development') {
        return true;
    }

    // Check if running on localhost:8080 (for frontend development)
    if (typeof window !== 'undefined') {
        const isLocalhost =
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
        const isPort8080 = window.location.port === '8080';

        if (isLocalhost && isPort8080) {
            return true;
        }
    }

    return false;
}

/**
 * Check if running in production mode
 * @returns True if in production mode
 */
export function isProduction(): boolean {
    return getEnvironment() === 'production';
}

/**
 * Check if running in test mode
 * @returns True if in test mode
 */
export function isTest(): boolean {
    return getEnvironment() === 'test';
}

/**
 * Get debug mode status
 * @returns True if debug mode is enabled
 */
export function isDebugMode(): boolean {
    return (
        isDevelopment() &&
        typeof window !== 'undefined' &&
        window.location.search.includes('debug=true')
    );
}

/**
 * Get test mode status
 * @returns True if test mode is enabled
 */
export function isTestMode(): boolean {
    return (
        isDevelopment() &&
        typeof window !== 'undefined' &&
        window.location.search.includes('test=modal')
    );
}

/**
 * Environment-specific configuration
 */
export const ENV_CONFIG: EnvironmentConfigMap = {
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
 * @returns Configuration for current environment
 */
export function getEnvironmentConfig(): EnvironmentConfig {
    const env = getEnvironment();
    return ENV_CONFIG[env] || ENV_CONFIG.production;
}

/**
 * Console log level type
 */
export type LogLevel = 'log' | 'warn' | 'error' | 'info';

/**
 * Safe console logging that respects environment settings
 * @param level - 'log' | 'warn' | 'error' | 'info'
 * @param args - Arguments to log
 */
export function safeLog(level: LogLevel = 'log', ...args: unknown[]): void {
    const config = getEnvironmentConfig();

    if (config.verboseLogging || level === 'error') {
        // eslint-disable-next-line no-console
        console[level](...args);
    }
}

/**
 * Development-only logging
 * @param args - Arguments to log
 */
export function devLog(...args: unknown[]): void {
    if (isDevelopment()) {
        // eslint-disable-next-line no-console
        console.log(...args);
    }
}

/**
 * Development-only warning
 * @param args - Arguments to log
 */
export function devWarn(...args: unknown[]): void {
    if (isDevelopment()) {
        // eslint-disable-next-line no-console
        console.warn(...args);
    }
}

