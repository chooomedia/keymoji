import { writable, derived, get } from 'svelte/store';
import content from './content.js';
import {
    supportedLanguages,
    isLanguageSupported,
    getSupportedLanguageCodes,
    getBrowserLanguage,
    getText as getTextUtil
} from './utils/languages.js';

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

    const saved = toObj(localStorage.getItem(key));
    const { subscribe, set, update } = writable(saved ?? initial);

    return {
        subscribe,
        set: value => {
            try {
                localStorage.setItem(key, toString(value));
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
            return set(value);
        },
        update
    };
};

// Persistent counter store
export const localUserCounter = localStore('userCounter', 0);

localUserCounter.subscribe(async value => {
    // CORS-Problem in der Entwicklung vermeiden
    if (process.env.NODE_ENV !== 'development') {
        try {
            await fetch('https://n8n.chooomedia.com/webhook/userCounter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    client: 'GlobalStore',
                    counter: value
                })
            });
        } catch (error) {
            console.error('Webhook subscription error:', error);
        }
    }
});

export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
export const showLanguageMenu = writable(false);

export const modalMessage = writable('');
export const isModalVisible = writable(false);

export const successfulStoryRequests = writable([]);

export const isDisabled = writable(false);

const prefersDarkMode =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
export const darkMode = localStore('darkMode', prefersDarkMode);

// Setup dark mode handler - this replaces the reactive statement that was causing issues
// Note: We need to call this function whenever darkMode changes
darkMode.subscribe(isDarkMode => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
});

function getInitialLanguage() {
    if (typeof window === 'undefined') return 'en';

    // First check localStorage
    const storedLang = localStorage.getItem('language');
    if (storedLang && isLanguageSupported(storedLang)) return storedLang;

    // Next check URL path for language
    if (typeof window !== 'undefined') {
        const pathLang = window.location.pathname.split('/')[1];
        if (pathLang && isLanguageSupported(pathLang)) return pathLang;
    }

    // Finally check browser languages
    return getBrowserLanguage();
}

export const currentLanguage = localStore('language', getInitialLanguage());

export const languageText = derived(
    currentLanguage,
    $currentLanguage => content[$currentLanguage] || content['en']
);

// Wrapper für die getText Funktion aus languageUtils, um den currentLanguage store zu nutzen
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
        document.documentElement.lang = lang;

        // Explicitly update language-specific styles
        if (lang === 'qya') {
            document.body.classList.add('font-elvish');
        } else {
            document.body.classList.remove('font-elvish');
        }

        // Notify any listeners
        notifyLanguageChange(lang);
    } else {
        console.error(`Language '${lang}' is not supported.`);
    }
}

// Initialize language on import
const initialLang = get(currentLanguage);
setLanguage(initialLang);
