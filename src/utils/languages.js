// src/utils/languageUtils.js
// Content wird jetzt über contentStore verwaltet
import { get } from 'svelte/store';

// Supported languages - jetzt statisch definiert
const contentLanguages = [
    'en',
    'de',
    'dech',
    'es',
    'nl',
    'it',
    'fr',
    'pl',
    'ru',
    'tr',
    'af',
    'ja',
    'ko',
    'tlh',
    'sjn'
];

export const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸', ogLocale: 'en_US' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', ogLocale: 'de_DE' },
    { code: 'dech', name: 'Schwiizerdütsch', flag: '🇨🇭', ogLocale: 'de_CH' },
    { code: 'es', name: 'Español', flag: '🇪🇸', ogLocale: 'es_ES' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱', ogLocale: 'nl_NL' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', ogLocale: 'it_IT' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', ogLocale: 'fr_FR' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱', ogLocale: 'pl_PL' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', ogLocale: 'ru_RU' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', ogLocale: 'tr_TR' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦', ogLocale: 'af_ZA' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', ogLocale: 'ja_JP' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', ogLocale: 'ko_KO' },
    { code: 'tlh', name: 'Klingon', flag: '🖖', ogLocale: 'tlh_Qo' },
    { code: 'sjn', name: 'Sindarin', flag: '🧝‍♀️', ogLocale: 'sjn_Qo' }
];

// Helper functions for language operations
export function isLanguageSupported(langCode) {
    // Check if the language is in content.js and is not a special key
    if (langCode === 'logo') return false;
    return contentLanguages.includes(langCode);
}

export function getSupportedLanguageCodes() {
    return supportedLanguages.map(lang => lang.code);
}

export function getLanguageByCode(langCode) {
    return (
        supportedLanguages.find(lang => lang.code === langCode) ||
        supportedLanguages[0]
    );
}

export function getLocale(langCode) {
    const lang = getLanguageByCode(langCode);
    return lang.ogLocale || 'en_US';
}

export function getBrowserLanguage() {
    if (typeof window === 'undefined') return 'en';

    const userLanguages = navigator.languages || [
        navigator.language || navigator.userLanguage
    ];

    for (let lang of userLanguages) {
        lang = lang.split('-')[0].toLowerCase();
        if (isLanguageSupported(lang)) return lang;
    }

    return 'en';
}

/**
 * Preloads translations for common UI elements to improve performance.
 * @param {Array<string>} keys - Array of translation key paths (e.g., 'header.title')
 * @param {string} langCode - Language code to use (optional, uses current language if not provided)
 * @returns {Object} - Object with preloaded translations
 */
export function preloadTranslations(keys = [], langCode = null) {
    // Diese Funktion wird jetzt über contentStore verwaltet
    console.warn(
        'preloadTranslations is deprecated - use contentStore instead'
    );
    return {};
}

/**
 * Gets a translated text by key path.
 * @param {string} key - Key path (e.g., 'header.title')
 * @param {string} lang - Language code (optional, uses current language if not provided)
 * @returns {string} - Translated text or key if not found
 */
export function getText(key, lang, currentLangStore) {
    // Diese Funktion wird jetzt über contentStore verwaltet
    console.warn('getText is deprecated - use contentStore.t() instead');
    return key;
}
