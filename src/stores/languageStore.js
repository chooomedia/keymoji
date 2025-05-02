// Neue Datei: src/stores/languageStore.js
import { writable, derived } from 'svelte/store';
import { localStore } from '../utils/localStore.js';
import { isLanguageSupported, getBrowserLanguage } from '../utils/languages.js';
import content from '../content.js';

// Initialisierung der Spracheinstellung
function getInitialLanguage() {
    if (typeof window === 'undefined') return 'en';

    // Prüfe localStorage
    try {
        const storedLang = localStorage.getItem('language');
        if (storedLang && isLanguageSupported(JSON.parse(storedLang))) {
            return JSON.parse(storedLang);
        }
    } catch (e) {
        console.warn('Error reading language from localStorage:', e);
    }

    // Prüfe URL-Pfad
    if (typeof window !== 'undefined') {
        const pathLang = window.location.pathname.split('/')[1];
        if (pathLang && isLanguageSupported(pathLang)) {
            return pathLang;
        }
    }

    // Fallback: Browser-Sprache
    return getBrowserLanguage();
}

// Erstelle den Store
export const currentLanguage = localStore('language', getInitialLanguage());

// Abgeleiteter Store für den aktuellen Sprachinhalt
export const languageText = derived(
    currentLanguage,
    $currentLanguage => content[$currentLanguage] || content['en']
);

// Hilfsfunktion zum Abrufen übersetzter Texte
export function getText(key, lang = null) {
    const lang = lang || get(currentLanguage);
    const keys = key.split('.');
    let text = content[lang];

    // Fallback auf Englisch
    if (!text) {
        console.warn(`Language '${lang}' not found, falling back to English`);
        text = content['en'];
    }

    for (const k of keys) {
        if (text === undefined) return key;
        text = text[k];
    }

    return text || key;
}

// Sprachänderung
export function setLanguage(lang) {
    if (isLanguageSupported(lang)) {
        currentLanguage.set(lang);

        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;

            // Spezifische Stilanpassungen
            if (lang === 'qya') {
                document.body.classList.add('font-elvish');
            } else {
                document.body.classList.remove('font-elvish');
            }
        }

        // Benachrichtige Abonnenten
        notifyLanguageChange(lang);
    } else {
        console.error(`Language '${lang}' is not supported.`);
    }
}

// Änderungsbenachrichtigungen
const languageChangeListeners = new Set();

export function onLanguageChange(listener) {
    languageChangeListeners.add(listener);
    return () => languageChangeListeners.delete(listener);
}

function notifyLanguageChange(lang) {
    languageChangeListeners.forEach(listener => listener(lang));
}
