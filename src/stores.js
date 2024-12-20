import { writable, derived, get } from 'svelte/store';
import content from './content.js';

const localStore = (key, initial) => {
    if (typeof window === 'undefined') return writable(initial);

    const toString = (value) => JSON.stringify(value);
    const toObj = (value) => {
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
        set: (value) => {
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

export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
export const showLanguageMenu = writable(false);

export const modalMessage = writable('');
export const isModalVisible = writable(false);

export const successfulStoryRequests = writable([]);

export const isDisabled = writable(false);

const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
export const darkMode = localStore('darkMode', prefersDarkMode);

function getInitialLanguage() {
    if (typeof window === 'undefined') return 'en';

    const storedLang = localStorage.getItem('language');
    if (storedLang && content[storedLang]) return storedLang;

    const userLanguages = navigator.languages || [navigator.language || navigator.userLanguage];

    for (let lang of userLanguages) {
        lang = lang.toLowerCase();
        
        if (content[lang]) return lang;

        const mainLang = lang.split('-')[0];
        const specificDialect = Object.keys(content).find(l => l.startsWith(mainLang + '-'));
        if (specificDialect) return specificDialect;

        if (content[mainLang]) return mainLang;
    }

    return 'en';
}

export const currentLanguage = localStore('language', getInitialLanguage());

export const languageText = derived(
    currentLanguage,
    $currentLanguage => content[$currentLanguage] || content['en']
);

export function getText(key, lang = null) {
    const currentLang = lang || get(currentLanguage);
    
    const keys = key.split('.');
    let text = content[currentLang];
    for (const k of keys) {
        if (text === undefined) return key;
        text = text[k];
    }
    return text || key;
}

export function isLanguageSupported(lang) {
    return !!content[lang];
}

export function getSupportedLanguages() {
    return Object.keys(content);
}

const languageChangeListeners = new Set();

export function onLanguageChange(listener) {
    languageChangeListeners.add(listener);
    return () => languageChangeListeners.delete(listener);
}

function notifyLanguageChange(newLang) {
    languageChangeListeners.forEach(listener => listener(newLang));
}

export function setLanguage(lang) {
    if (content[lang]) {
        currentLanguage.set(lang);
        document.documentElement.lang = lang;
        notifyLanguageChange(lang);
    } else {
        console.error(`Language '${lang}' is not supported.`);
    }
}

setLanguage(get(currentLanguage));