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

// Only log in development
const isDev = process.env.NODE_ENV === 'development';

// === LOCAL STORAGE HELPER ===
const localStore = (key, initial) => {
    if (typeof window === 'undefined') return writable(initial);

    const toString = value => JSON.stringify(value);
    const toObj = value => {
        try {
            return JSON.parse(value);
        } catch {
            return initial;
        }
    };

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

// === USER COUNTER STORE ===
// Cache settings
const COUNTER_CACHE_KEY = 'keymoji_user_counter';
const COUNTER_TIMESTAMP_KEY = 'keymoji_user_counter_timestamp';
const COUNTER_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Counter stores
const counterValue = writable(0);
const counterLoading = writable(true);
const counterError = writable(false);
const counterCached = writable(false);

// Combined counter store for components
export const userCounter = derived(
    [counterValue, counterLoading, counterError, counterCached],
    ([$value, $loading, $error, $cached]) => ({
        value: $value,
        isLoading: $loading,
        hasError: $error,
        isCached: $cached
    })
);

// Initialize counter on app load
if (typeof window !== 'undefined') {
    // Try to load from cache first
    try {
        const cached = localStorage.getItem(COUNTER_CACHE_KEY);
        const timestamp = localStorage.getItem(COUNTER_TIMESTAMP_KEY);

        if (cached && timestamp) {
            const age = Date.now() - parseInt(timestamp);
            if (age < COUNTER_CACHE_DURATION) {
                const value = parseInt(cached);
                if (!isNaN(value) && value > 0) {
                    counterValue.set(value);
                    counterCached.set(true);
                    counterLoading.set(false);
                }
            }
        }
    } catch (error) {
        if (isDev) console.warn('Failed to load counter from cache:', error);
    }

    // Fetch fresh data
    window.addEventListener('load', async () => {
        try {
            const response = await fetch(WEBHOOKS.USER_COUNTER, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    path: window.location.pathname,
                    client: navigator.userAgent.substring(0, 100),
                    version: appVersion,
                    timestamp: new Date().toISOString(),
                    language: get(currentLanguage) || 'en',
                    referrer: document.referrer || 'direct',
                    screen: `${window.screen.width}x${window.screen.height}`
                }),
                signal: AbortSignal.timeout(10000) // 10s timeout
            });

            if (response.ok) {
                const data = await response.json();
                const newValue = Number(data.counter);

                if (!isNaN(newValue) && newValue > 0) {
                    counterValue.set(newValue);
                    counterCached.set(false);
                    counterError.set(false);

                    // Save to cache
                    try {
                        localStorage.setItem(
                            COUNTER_CACHE_KEY,
                            newValue.toString()
                        );
                        localStorage.setItem(
                            COUNTER_TIMESTAMP_KEY,
                            Date.now().toString()
                        );
                    } catch (e) {
                        if (isDev) console.warn('Failed to cache counter:', e);
                    }
                }
            }
        } catch (error) {
            // Only show error if no cached value exists
            if (get(counterValue) === 0) {
                counterError.set(true);
            }
            if (isDev) console.error('Counter fetch failed:', error);
        } finally {
            counterLoading.set(false);
        }
    });
}

// === VERSION STORES ===
export const version = writable(appVersion);
export const formattedVersion = derived(version, $version =>
    formatVersion($version)
);

// === UI STATE STORES ===
export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
export const showLanguageMenu = writable(false);
export const successfulStoryRequests = writable([]);
export const isDisabled = writable(false);

// === DARK MODE ===
// Initialize dark mode from system preference or localStorage
function initializeDarkMode() {
    const systemPrefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    let storedPreference;
    try {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            storedPreference = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error reading dark mode preference:', e);
    }

    return storedPreference !== undefined
        ? storedPreference
        : systemPrefersDark;
}

export const darkMode = localStore('darkMode', initializeDarkMode());

// Setup dark mode media query listener
if (typeof window !== 'undefined') {
    const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    const handleMediaQueryChange = e => {
        try {
            if (localStorage.getItem('darkMode') === null) {
                darkMode.set(e.matches);
            }
        } catch (err) {
            console.warn('Error in media query handler:', err);
        }
    };

    if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleMediaQueryChange);
    } else if (darkModeMediaQuery.addListener) {
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

function getInitialLanguage() {
    if (typeof window === 'undefined') return 'en';

    try {
        const storedLang = localStorage.getItem('language');
        if (storedLang && isLanguageSupported(JSON.parse(storedLang))) {
            return JSON.parse(storedLang);
        }
    } catch (e) {
        console.warn('Error reading language from localStorage:', e);
    }

    if (typeof window !== 'undefined') {
        const pathLang = window.location.pathname.split('/')[1];
        if (pathLang && isLanguageSupported(pathLang)) {
            return pathLang;
        }
    }

    return getBrowserLanguage();
}

export const currentLanguage = localStore('language', getInitialLanguage());

export const languageText = derived(
    currentLanguage,
    $currentLanguage => content[$currentLanguage] || content['en']
);

// Wrapper for the getText function
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

            if (lang === 'qya') {
                document.body.classList.add('font-elvish');
            } else {
                document.body.classList.remove('font-elvish');
            }
        }

        notifyLanguageChange(lang);
    } else {
        console.error(`Language '${lang}' is not supported.`);
    }
}
