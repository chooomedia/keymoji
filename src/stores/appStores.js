// src/stores/appStores.js
import { writable, derived, get } from 'svelte/store';
// Content wird jetzt über contentStore verwaltet
import {
    supportedLanguages,
    isLanguageSupported,
    getBrowserLanguage,
    getText as getTextUtil
} from '../utils/languages.js';
import { appVersion, formatVersion } from '../utils/version.js';
import { WEBHOOKS } from '../../src/config/api.js';
import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';
import { isDevelopment, devWarn } from '../utils/environment.js';

// === LOCAL STORAGE HELPER ===
// Verwende zentrale Storage-Helpers
const localStore = (key, initial) => {
    if (typeof window === 'undefined') return writable(initial);

    const saved = storageHelpers.get(key, initial);
    const { subscribe, set, update } = writable(saved);

    return {
        subscribe,
        set: value => {
            storageHelpers.set(key, value);
            return set(value);
        },
        update: updater => {
            return update(value => {
                const newValue = updater(value);
                storageHelpers.set(key, newValue);
                return newValue;
            });
        }
    };
};

// === USER COUNTER STORE ===
// Cache settings - verwende zentrale Storage-Keys
const COUNTER_CACHE_KEY = STORAGE_KEYS.COUNTER_CACHE;
const COUNTER_TIMESTAMP_KEY = STORAGE_KEYS.COUNTER_TIMESTAMP;
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
        const cached = storageHelpers.get(COUNTER_CACHE_KEY);
        const timestamp = storageHelpers.get(COUNTER_TIMESTAMP_KEY);

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
        if (isDevelopment) devWarn('Failed to load counter from cache:', error);
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
                        storageHelpers.set(COUNTER_CACHE_KEY, newValue);
                        storageHelpers.set(COUNTER_TIMESTAMP_KEY, Date.now());
                    } catch (e) {
                        if (isDevelopment)
                            devWarn('Failed to cache counter:', e);
                    }
                }
            }
        } catch (error) {
            // Only show error if no cached value exists
            if (get(counterValue) === 0) {
                counterError.set(true);
            }
            if (isDevelopment) devWarn('Counter fetch failed:', error);
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
// Moved to contentStore.js for better organization
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
        const stored = storageHelpers.get(STORAGE_KEYS.DARK_MODE);
        if (stored !== null) {
            storedPreference = stored;
        }
    } catch (e) {
        console.warn('Error reading dark mode preference:', e);
    }

    return storedPreference !== undefined
        ? storedPreference
        : systemPrefersDark;
}

export const darkMode = localStore(
    STORAGE_KEYS.DARK_MODE,
    initializeDarkMode()
);

// Setup dark mode media query listener
if (typeof window !== 'undefined') {
    const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    const handleMediaQueryChange = e => {
        try {
            if (storageHelpers.get(STORAGE_KEYS.DARK_MODE) === null) {
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
        const storedLang = storageHelpers.get(STORAGE_KEYS.LANGUAGE);
        if (storedLang && isLanguageSupported(storedLang)) {
            return storedLang;
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

export const currentLanguage = localStore(
    STORAGE_KEYS.LANGUAGE,
    getInitialLanguage()
);

// languageText wird jetzt über contentStore verwaltet

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

// === ACCOUNT STORES ===
export const isLoggedIn = writable(false);
export const dailyLimit = writable({ limit: 5, used: 0 });
export const accountSettings = writable({});
export const currentSettings = writable({}); // Alias for accountSettings for modular components
export const isGuestUser = writable(true);
export const isProUser = writable(false);
export const currentAccount = writable(null);
export const userProfile = writable(null);
export const accountTier = writable('free');
export const translations = writable({});
