import { writable, derived } from 'svelte/store';
import content from './content.js';

// Hilfsfunktion für localStorage Interaktionen
const localStore = (key, initial) => {
    if (typeof window === 'undefined') {
        return writable(initial);
    }

    const toString = (value) => JSON.stringify(value);
    const toObj = JSON.parse;

    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, toString(initial));
    }

    const saved = toObj(localStorage.getItem(key));
    const { subscribe, set, update } = writable(saved);

    return {
        subscribe,
        set: (value) => {
            localStorage.setItem(key, toString(value));
            return set(value);
        },
        update
    };
};

// Toggle Menus
export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
export const showLanguageMenu = writable(false);

// Modal Messages
export const modalMessage = writable('');
export const isModalVisible = writable(false);

// Store for successful story-requests
export const successfulStoryRequests = writable([]);

// Disable state (for buttons, actions, etc.)
export const isDisabled = writable(false);

// Dark Mode
const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
export const darkMode = localStore('darkMode', prefersDarkMode);

// Language
function getInitialLanguage() {
    if (typeof window === 'undefined') return 'en';

    const storedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    return (storedLang && content[storedLang]) ? storedLang :
           (content[browserLang] ? browserLang : 'en');
}

export const currentLanguage = localStore('language', getInitialLanguage());

export const languageText = derived(
    currentLanguage,
    $currentLanguage => content[$currentLanguage] || content['en']
);

// Set language function
export function setLanguage(lang) {
    if (content[lang]) {
        currentLanguage.set(lang);
        showLanguageMenu.set(false);  // Schließe das Menü nach der Auswahl
    }
}
