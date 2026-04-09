/**
 * Shared Utility Functions - Keymoji
 * Zentrale Sammlung von wiederverwendbaren Helper-Funktionen
 * Apple/Airbnb Style: DRY (Don't Repeat Yourself) Principle
 *
 * TypeScript Migration: v0.7.7
 */

import { isDevelopment, isProduction } from './environment';

// Globale Timeout-Tracking für Memory Leak Prevention
const globalTimeouts = new Set<ReturnType<typeof setTimeout>>();

/**
 * Safe Timeout mit automatischem Cleanup (Apple-Style Memory Management)
 * Verhindert Memory Leaks durch nicht geclearte Timeouts
 */
export function safeSetTimeout(
    callback: () => void,
    delay: number
): ReturnType<typeof setTimeout> {
    const timeoutId = setTimeout(() => {
        globalTimeouts.delete(timeoutId);
        callback();
    }, delay);
    globalTimeouts.add(timeoutId);
    return timeoutId;
}

/**
 * Cleanup aller aktiven Timeouts (für onDestroy/unmount)
 */
export function clearAllTimeouts(): void {
    globalTimeouts.forEach(timeoutId => {
        clearTimeout(timeoutId);
    });
    globalTimeouts.clear();
}

/**
 * Universelle Lokalisierungs-Helper (i18n)
 * Unterstützt verschachtelte Objekte und Fallback-Werte
 */
export function getLocalizedText(
    textObj: Record<string, string> | string | null | undefined,
    fallback: string = '',
    currentLanguage: string = 'en'
): string {
    if (!textObj) return fallback;

    if (typeof textObj === 'string') {
        return textObj;
    }

    if (typeof textObj === 'object') {
        return (
            textObj[currentLanguage] ||
            textObj['en'] ||
            textObj[Object.keys(textObj)[0]] ||
            fallback
        );
    }

    return fallback;
}

/**
 * Email-Anonymisierung für Privacy/Security (GDPR-konform)
 */
export function anonymizeEmail(email: string | null | undefined): string {
    if (!email || typeof email !== 'string') return 'unknown@example.com';

    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return 'unknown@example.com';

    const anonymizedLocal =
        localPart.length > 2
            ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
            : localPart;

    return `${anonymizedLocal}@${domain}`;
}

/**
 * Email-Validierung (Enhanced)
 */
export function validateEmail(email: unknown): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
        typeof email === 'string' &&
        emailRegex.test(email) &&
        email.length <= 254
    );
}

/**
 * Sichere Navigation mit Error-Handling (Apple-Style)
 */
export function safeNavigate(path: string, replace: boolean = false): boolean {
    try {
        if (typeof window !== 'undefined' && window.history) {
            if (replace) {
                window.history.replaceState(null, '', path);
            } else {
                window.history.pushState(null, '', path);
            }

            // Trigger popstate event für Router
            window.dispatchEvent(new PopStateEvent('popstate'));
            return true;
        }
    } catch (error) {
        console.warn('Navigation failed:', error);
        return false;
    }
    return false;
}

/**
 * Responsive Image Loading (Performance-Optimierung)
 */
export function createResponsiveImageLoader(
    imageUrl: string | null | undefined,
    callback: (success: boolean) => void
): void {
    if (!imageUrl) {
        callback(false);
        return;
    }

    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = imageUrl;
}

/**
 * Color Class Generator für konsistente UI (Apple/Airbnb Style)
 */
export function generateColorClasses(
    baseColor:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'error'
        | 'info',
    variant: string = 'default',
    darkMode: boolean = false
): string {
    const colorMap: Record<string, string> = {
        primary: darkMode
            ? 'bg-aubergine-800 text-white'
            : 'bg-creme-500 text-black',
        secondary: darkMode
            ? 'bg-powder-800 text-white'
            : 'bg-powder-300 text-black',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-black',
        error: 'bg-red-500 text-white',
        info: darkMode ? 'bg-blue-800 text-white' : 'bg-blue-500 text-white'
    };

    return colorMap[baseColor] || colorMap.primary;
}

/**
 * Debounce Function (Performance-Optimierung für Input-Events)
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeoutId = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeoutId;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle Function (Performance-Optimierung für Scroll/Resize Events)
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Enhanced Error Logging mit Context (Apple-Style Debugging)
 */
export interface ErrorContext {
    [key: string]: unknown;
}

export function logError(
    error: Error | unknown,
    context: ErrorContext = {},
    userAgent: string = ''
): ErrorContext & {
    message: string;
    stack?: string;
    timestamp: string;
    userAgent: string;
    url: string;
} {
    const errorInfo = {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        userAgent: userAgent.substring(0, 100),
        context,
        url:
            typeof window !== 'undefined' ? window.location.href : 'server-side'
    };

    // In Development: Console-Logging
    if (isDevelopment()) {
        console.error('🚨 Error:', errorInfo);
    }

    // In Production: Minimal Logging für Privacy
    if (isProduction()) {
        console.error('Error occurred:', errorInfo.message);
    }

    return errorInfo;
}

/**
 * Format Date Helper (Internationalisierung)
 */
export function formatDate(
    date: Date | string | number | null | undefined,
    locale: string = 'en-US',
    options: Intl.DateTimeFormatOptions = {}
): string {
    if (!date) return '';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };

    try {
        return new Intl.DateTimeFormat(locale, defaultOptions).format(
            new Date(date)
        );
    } catch (error) {
        return new Date(date).toLocaleDateString();
    }
}

/**
 * Storage Helper mit Error-Handling (Privacy-First)
 */
export const storageHelper = {
    get<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            if (typeof window === 'undefined') return defaultValue;
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Storage get failed for key: ${key}`, error);
            return defaultValue;
        }
    },

    set<T>(key: string, value: T): boolean {
        try {
            if (typeof window === 'undefined') return false;
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Storage set failed for key: ${key}`, error);
            return false;
        }
    },

    remove(key: string): boolean {
        try {
            if (typeof window === 'undefined') return false;
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Storage remove failed for key: ${key}`, error);
            return false;
        }
    }
};

/**
 * Enhanced Analytics Event Sender (Privacy-First)
 */
export interface AnalyticsProperties {
    [key: string]: unknown;
    timestamp?: string;
    page?: string;
}

export function sendAnalyticsEvent(
    eventName: string,
    properties: AnalyticsProperties = {},
    userConsent: boolean = true
): boolean {
    if (!userConsent) return false;

    const sanitizedProperties: AnalyticsProperties = {
        ...properties,
        timestamp: new Date().toISOString(),
        page:
            typeof window !== 'undefined'
                ? window.location.pathname
                : 'server-side'
    };

    // Remove any PII data
    delete sanitizedProperties.email;
    delete sanitizedProperties.userId;
    delete sanitizedProperties.personalInfo;

    // In Development: Console-Logging
    if (isDevelopment()) {
        console.log('📊 Analytics Event:', eventName, sanitizedProperties);
    }

    return true;
}

/**
 * Generate client fingerprint for security (Browser Fingerprinting)
 * Used for session validation and security logging
 */
export function generateClientFingerprint(): string {
    if (typeof document === 'undefined') {
        return 'server-side-fingerprint';
    }

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context not available');
        }
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Keymoji Security Fingerprint', 2, 2);

        return canvas.toDataURL().substring(0, 32);
    } catch (error) {
        console.warn('⚠️ Failed to generate client fingerprint:', error);
        // Fallback fingerprint
        return `fp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}

// Default Export für Kompatibilität
export default {
    safeSetTimeout,
    clearAllTimeouts,
    getLocalizedText,
    anonymizeEmail,
    validateEmail,
    safeNavigate,
    createResponsiveImageLoader,
    generateColorClasses,
    debounce,
    throttle,
    logError,
    formatDate,
    storageHelper,
    sendAnalyticsEvent,
    generateClientFingerprint
};
