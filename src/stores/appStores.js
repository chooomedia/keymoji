// src/stores/appStores.js
import { writable, derived, get } from 'svelte/store';
import content from '../content.js';
import {
    supportedLanguages,
    isLanguageSupported,
    getBrowserLanguage,
    getText as getTextUtil
} from '../utils/languages.js';
import { appVersion, formatVersion } from '../utils/version.js';
import { WEBHOOKS } from '../config/api.js';

console.log('[Counter] appStores.js loaded');
console.log('[Counter] WEBHOOKS:', WEBHOOKS);
console.log('[Counter] Environment:', process.env.NODE_ENV);

// Enhancement: Exportiere die Version als Teil der App-Stores
export const version = writable(appVersion);
export const formattedVersion = derived(version, $version =>
    formatVersion($version)
);

// Enhanced local storage store with error handling and fallbacks
const localStore = (key, initial) => {
    // Server-side rendering check
    if (typeof window === 'undefined') return writable(initial);

    const toString = value => JSON.stringify(value);
    const toObj = value => {
        try {
            return JSON.parse(value);
        } catch {
            return initial;
        }
    };

    // Try to get from localStorage with fallback to initial
    let saved;
    try {
        saved = toObj(localStorage.getItem(key));
    } catch (e) {
        console.warn(`Error reading ${key} from localStorage:`, e);
        saved = initial;
    }

    const { subscribe, set, update } = writable(saved ?? initial);

    return {
        subscribe,
        set: value => {
            try {
                localStorage.setItem(key, toString(value));
            } catch (error) {
                console.warn(`Failed to save ${key} to localStorage:`, error);
            }
            return set(value);
        },
        update: updater => {
            return update(value => {
                try {
                    const newValue = updater(value);
                    localStorage.setItem(key, toString(newValue));
                    return newValue;
                } catch (error) {
                    console.warn(
                        `Failed to update ${key} in localStorage:`,
                        error
                    );
                    return value;
                }
            });
        }
    };
};

export const localUserCounter = writable(0);
const ALLOWED_ORIGINS = new Set([
    'https://keymoji.wtf',
    'http://localhost:8080'
]);

async function fetchCounter() {
    try {
        const origin = window.location.origin;
        const counterUrl = WEBHOOKS.USER_COUNTER;

        // Debug URL
        console.log('[Counter] URL:', counterUrl);
        console.log('[Counter] Origin:', origin);

        const requestBody = {
            path: window.location.pathname,
            client: navigator.userAgent.substring(0, 100),
            version: appVersion,
            env: process.env.NODE_ENV || 'production',
            timestamp: new Date().toISOString(),
            language: get(currentLanguage) || 'en',
            referrer: document.referrer || 'direct',
            screen: `${window.screen.width}x${window.screen.height}`
        };

        console.log('[Counter] Sending data:', requestBody);

        const response = await fetch(counterUrl, {
            method: 'POST',
            mode: 'cors', // ← Explizit CORS Mode
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
                // Origin wird automatisch gesetzt
            },
            body: JSON.stringify(requestBody)
        });

        // Detailliertes Error Handling
        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Counter] Response error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('[Counter] Success:', data);

        localUserCounter.set(Number(data.counter));
    } catch (error) {
        console.error('[Counter] Detailed error:', {
            message: error.message,
            stack: error.stack,
            type: error.name
        });

        // Fallback nur im Development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Counter] Using development fallback');
            localUserCounter.set(12345); // Erkennbarer Test-Wert
        }
    }
}

if (typeof window !== 'undefined') {
    console.log('[Counter] Window check passed');

    window.addEventListener('load', () => {
        console.log('[Counter] Window loaded');
        console.log(
            '[Counter] Session storage check:',
            window.sessionStorage.getItem('counterTracked')
        );

        // Entferne temporär die Development-Skip
        /*
        if (process.env.NODE_ENV === 'development') {
            console.log('[Counter] Skipped in development');
            localUserCounter.set(12345);
            return;
        }
        */

        if (!window.sessionStorage.getItem('counterTracked')) {
            console.log('[Counter] Calling fetchCounter...');
            setTimeout(() => {
                fetchCounter();
                window.sessionStorage.setItem('counterTracked', 'true');
            }, 100);
        } else {
            console.log('[Counter] Already tracked in this session');
        }
    });
}

// UI state stores
export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
export const showLanguageMenu = writable(false);

// Modal System
export const modalMessage = writable('');
export const isModalVisible = writable(false);

export const successfulStoryRequests = writable([]);

export const isDisabled = writable(false);

// Initialize dark mode from system preference or localStorage
function initializeDarkMode() {
    // Default to system preference
    const systemPrefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Try to get stored preference
    let storedPreference;
    try {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            storedPreference = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error reading dark mode preference:', e);
    }

    // Return stored preference if it exists, otherwise system preference
    return storedPreference !== undefined
        ? storedPreference
        : systemPrefersDark;
}

// Create dark mode store
export const darkMode = localStore('darkMode', initializeDarkMode());

// Setup dark mode media query listener
if (typeof window !== 'undefined') {
    const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    // Update dark mode when system preference changes (if user hasn't set a preference)
    const handleMediaQueryChange = e => {
        try {
            // Only update if user hasn't explicitly set a preference
            if (localStorage.getItem('darkMode') === null) {
                darkMode.set(e.matches);
            }
        } catch (err) {
            console.warn('Error in media query handler:', err);
        }
    };

    // Add event listener with browser compatibility
    if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleMediaQueryChange);
    } else if (darkModeMediaQuery.addListener) {
        // Older browsers
        darkModeMediaQuery.addListener(handleMediaQueryChange);
    }
}

// Setup dark mode DOM handler
darkMode.subscribe(isDarkMode => {
    if (typeof document !== 'undefined') {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
});

// Language handling
function getInitialLanguage() {
    if (typeof window === 'undefined') return 'en';

    // First check localStorage
    try {
        const storedLang = localStorage.getItem('language');
        if (storedLang && isLanguageSupported(JSON.parse(storedLang))) {
            return JSON.parse(storedLang);
        }
    } catch (e) {
        console.warn('Error reading language from localStorage:', e);
    }

    // Next check URL path for language
    if (typeof window !== 'undefined') {
        const pathLang = window.location.pathname.split('/')[1];
        if (pathLang && isLanguageSupported(pathLang)) {
            return pathLang;
        }
    }

    // Finally check browser languages
    return getBrowserLanguage();
}

export const currentLanguage = localStore('language', getInitialLanguage());

export const languageText = derived(
    currentLanguage,
    $currentLanguage => content[$currentLanguage] || content['en']
);

// Wrapper for the getText function from languageUtils, to use the currentLanguage store
export function getText(key, lang = null) {
    return getTextUtil(key, lang, currentLanguage);
}

// Export supportedLanguages for backward compatibility
export function getSupportedLanguages() {
    return supportedLanguages;
}

// Language change listeners
const languageChangeListeners = new Set();

export function onLanguageChange(listener) {
    languageChangeListeners.add(listener);
    return () => languageChangeListeners.delete(listener);
}

function notifyLanguageChange(lang) {
    languageChangeListeners.forEach(listener => listener(lang));
}

export function setLanguage(lang) {
    if (isLanguageSupported(lang)) {
        currentLanguage.set(lang);

        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;

            // Explicitly update language-specific styles
            if (lang === 'qya') {
                document.body.classList.add('font-elvish');
            } else {
                document.body.classList.remove('font-elvish');
            }
        }

        // Notify any listeners
        notifyLanguageChange(lang);
    } else {
        console.error(`Language '${lang}' is not supported.`);
    }
}
