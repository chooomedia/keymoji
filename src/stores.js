import { writable, derived } from 'svelte/store';
import content from './content.js';

// Hilfsfunktion für localStorage Interaktionen
const localStore = (key, initial) => {
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

// Toggle Menu
export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);

// ModalMessages
export const modalMessage = writable('');
export const isModalVisible = writable(false);

// Store for successful story-requests
export const successfulStoryRequests = writable([]);

export const isDisabled = writable(false);

// Dark Mode
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
export const darkMode = localStore('darkMode', prefersDarkMode);

// Language
function getInitialLanguage() {
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

export function setLanguage(lang) {
    if (content[lang]) {
        currentLanguage.set(lang);
    }
}