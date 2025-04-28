// src/utils/languageUtils.js
import content from '../content.js';
import { get } from 'svelte/store';

// Derive supported languages from content.js to ensure consistency
const contentLanguages = Object.keys(content).filter(key => key !== 'logo');

export const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸', ogLocale: 'en_US' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', ogLocale: 'de_DE' },
    { code: 'dech', name: 'Schwiizerdütsch', flag: '🇨🇭', ogLocale: 'de_CH' },
    { code: 'es', name: 'Español', flag: '🇪🇸', ogLocale: 'es_ES' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱', ogLocale: 'nl_NL' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', ogLocale: 'it_IT' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', ogLocale: 'fr_FR' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱', ogLocale: 'pl_PL' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰', ogLocale: 'da_DK' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', ogLocale: 'ru_RU' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', ogLocale: 'tr_TR' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦', ogLocale: 'af_ZA' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', ogLocale: 'ja_JP' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', ogLocale: 'ko_KO' },
    { code: 'tlh', name: 'Klingon', flag: '🖖', ogLocale: 'tlh_Qo' },
    { code: 'qya', name: 'Elvish', flag: '🧝‍♀️', ogLocale: 'qya_Qo' }
].filter(lang => contentLanguages.includes(lang.code));

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
    const translations = {};

    // If langCode is not provided and currentLanguage is available, use it
    let lang = langCode;

    // Navigate the path for each key
    for (const keyPath of keys) {
        const pathParts = keyPath.split('.');
        let value = content[lang];

        // Fallback to English if language not found
        if (!value) {
            console.warn(
                `Language '${lang}' not found, falling back to English`
            );
            value = content['en'];
        }

        // Navigate the path
        for (const part of pathParts) {
            if (!value || typeof value !== 'object') {
                value = null;
                break;
            }
            value = value[part];
        }

        // Store the value
        translations[keyPath] = value;
    }

    return translations;
}

/**
 * Gets a translated text by key path.
 * @param {string} key - Key path (e.g., 'header.title')
 * @param {string} lang - Language code (optional, uses current language if not provided)
 * @returns {string} - Translated text or key if not found
 */
export function getText(key, lang, currentLangStore) {
    const currentLang =
        lang || (currentLangStore ? get(currentLangStore) : 'en');

    const keys = key.split('.');
    let text = content[currentLang];

    // Fallback to English if language not found
    if (!text) {
        console.warn(
            `Language '${currentLang}' not found, falling back to English`
        );
        text = content['en'];
    }

    for (const k of keys) {
        if (text === undefined) return key;
        text = text[k];
    }
    return text || key;
}
