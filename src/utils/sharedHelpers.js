/**
 * Shared Utility Functions - Keymoji
 * Zentrale Sammlung von wiederverwendbaren Helper-Funktionen
 * Apple/Airbnb Style: DRY (Don't Repeat Yourself) Principle
 */

// Globale Timeout-Tracking für Memory Leak Prevention
let globalTimeouts = new Set();

/**
 * Safe Timeout mit automatischem Cleanup (Apple-Style Memory Management)
 * Verhindert Memory Leaks durch nicht geclearte Timeouts
 */
export function safeSetTimeout(callback, delay) {
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
export function clearAllTimeouts() {
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
    textObj,
    fallback = '',
    currentLanguage = 'en'
) {
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
export function anonymizeEmail(email) {
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
export function validateEmail(email) {
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
export function safeNavigate(path, replace = false) {
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
export function createResponsiveImageLoader(imageUrl, callback) {
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
    baseColor,
    variant = 'default',
    darkMode = false
) {
    const colorMap = {
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
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle Function (Performance-Optimierung für Scroll/Resize Events)
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
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
export function logError(error, context = {}, userAgent = '') {
    const errorInfo = {
        message: error.message || 'Unknown error',
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: userAgent.substring(0, 100),
        context,
        url:
            typeof window !== 'undefined' ? window.location.href : 'server-side'
    };

    // In Development: Console-Logging
    if (process.env.NODE_ENV === 'development') {
        console.error('🚨 Error:', errorInfo);
    }

    // In Production: Minimal Logging für Privacy
    if (process.env.NODE_ENV === 'production') {
        console.error('Error occurred:', errorInfo.message);
    }

    return errorInfo;
}

/**
 * Format Date Helper (Internationalisierung)
 */
export function formatDate(date, locale = 'en-US', options = {}) {
    if (!date) return '';

    const defaultOptions = {
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
    get(key, defaultValue = null) {
        try {
            if (typeof window === 'undefined') return defaultValue;
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Storage get failed for key: ${key}`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            if (typeof window === 'undefined') return false;
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Storage set failed for key: ${key}`, error);
            return false;
        }
    },

    remove(key) {
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
export function sendAnalyticsEvent(
    eventName,
    properties = {},
    userConsent = true
) {
    if (!userConsent) return false;

    const sanitizedProperties = {
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
    if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', eventName, sanitizedProperties);
    }

    return true;
}

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
    sendAnalyticsEvent
};
