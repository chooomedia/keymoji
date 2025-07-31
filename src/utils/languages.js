// src/utils/languageUtils.js
// Content wird jetzt über contentStore verwaltet
import { get } from 'svelte/store';
import { content, currentLanguage } from '../stores/contentStore.js';

// Supported languages - jetzt statisch definiert
const contentLanguages = [
    'en',
    'de',
    'de-CH',
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
    { code: 'de-CH', name: 'Schwiizerdütsch', flag: '🇨🇭', ogLocale: 'de_CH' },
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

    // Mapping für Locale-Codes mit Region zu unseren Sprachcodes
    const localeToLanguageMap = {
        'de-CH': 'de-CH', // Schweizerdeutsch
        'de-AT': 'de', // Österreichisches Deutsch (fallback zu Standard-Deutsch)
        'de-LI': 'de-CH', // Liechtenstein (fallback zu Schweizerdeutsch)
        'fr-CH': 'fr', // Schweizer Französisch (fallback zu Standard-Französisch)
        'it-CH': 'it', // Schweizer Italienisch (fallback zu Standard-Italienisch)
        'en-US': 'en', // US-Englisch
        'en-GB': 'en', // Britisches Englisch
        'en-CA': 'en', // Kanadisches Englisch
        'en-AU': 'en', // Australisches Englisch
        'es-ES': 'es', // Spanisches Spanisch
        'es-MX': 'es', // Mexikanisches Spanisch
        'es-AR': 'es', // Argentinisches Spanisch
        'pt-BR': 'en', // Brasilianisches Portugiesisch (fallback zu Englisch)
        'pt-PT': 'en', // Portugiesisches Portugiesisch (fallback zu Englisch)
        'nl-BE': 'nl', // Belgisches Niederländisch
        'fr-BE': 'fr', // Belgisches Französisch
        'fr-CA': 'fr', // Kanadisches Französisch
        'it-IT': 'it', // Italienisches Italienisch
        'pl-PL': 'pl', // Polnisches Polnisch
        'ru-RU': 'ru', // Russisches Russisch
        'tr-TR': 'tr', // Türkisches Türkisch
        'af-ZA': 'af', // Südafrikanisches Afrikaans
        'ja-JP': 'ja', // Japanisches Japanisch
        'ko-KR': 'ko' // Koreanisches Koreanisch
    };

    for (let lang of userLanguages) {
        // Prüfe zuerst den vollständigen Locale-Code (z.B. de-CH)
        if (localeToLanguageMap[lang]) {
            const mappedLang = localeToLanguageMap[lang];
            if (isLanguageSupported(mappedLang)) {
                return mappedLang;
            }
        }

        // Fallback: Prüfe nur den Sprachcode (z.B. de)
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
 * @param {Object} currentLangStore - Current language store (optional)
 * @returns {string} - Translated text or key if not found
 */
export function getText(key, lang = null, currentLangStore = null) {
    const currentContent = get(content);
    const currentLang = currentLangStore
        ? get(currentLangStore)
        : get(currentLanguage);
    const targetLang = lang || currentLang;

    // Wenn kein Content geladen ist, verwende Fallback
    if (!currentContent || Object.keys(currentContent).length === 0) {
        return key;
    }

    const keys = key.split('.');
    let value = currentContent;

    for (const k of keys) {
        if (value === undefined || value === null) {
            return key;
        }
        value = value[k];
    }

    return value || key;
}
