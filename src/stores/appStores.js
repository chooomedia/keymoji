// src/stores.js - Update for proper dark mode handling
import { writable, derived, get } from 'svelte/store';
import content from '../content.js';
import {
    supportedLanguages,
    isLanguageSupported,
    getSupportedLanguageCodes,
    getBrowserLanguage,
    getText as getTextUtil
} from '../utils/languages.js';

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
        if (!ALLOWED_ORIGINS.has(origin)) return;

        const response = await fetch(
            'https://n8n.chooomedia.com/webhook-test/xn--moji-pb73c-userCounter',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Origin: origin
                },
                body: JSON.stringify({
                    client: navigator.userAgent.substring(0, 80),
                    path: window.location.pathname.replace(/\/$/, '')
                })
            }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const { counter } = await response.json();
        localUserCounter.set(Number(counter));
    } catch (error) {
        console.error('Counter error:', error);
        localUserCounter.update(
            c => c || Math.floor(Math.random() * 4000 + 1000)
        );
    }
}

if (
    typeof window !== 'undefined' &&
    ['/', '/en', '/de'].includes(window.location.pathname)
) {
    window.addEventListener('load', () => {
        if (!window.sessionStorage.getItem('counterTracked')) {
            fetchCounter();
            window.sessionStorage.setItem('counterTracked', 'true');
        }
    });
}

// UI state stores
export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
export const showLanguageMenu = writable(false);

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
