// src/utils/translationLoader.js
import content from '../content.js';
import { currentLanguage } from '../stores.js';
import { get } from 'svelte/store';

/**
 * Preloads translations for common UI elements to improve performance.
 * @param {Array<string>} keys - Array of translation key paths (e.g., 'header.title')
 * @returns {Object} - Object with preloaded translations
 */
export function preloadTranslations(keys = []) {
    const translations = {};
    const lang = get(currentLanguage);

    // Preload specified keys
    for (const keyPath of keys) {
        const pathParts = keyPath.split('.');
        let value = content[lang];

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
 * Gets all supported languages with their data
 * @returns {Array} - Array of language objects with code, name, etc.
 */
export function getLanguageData() {
    return [
        { code: 'en', name: 'English', flag: '🇺🇸', ogLocale: 'en_US' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', ogLocale: 'de_DE' },
        {
            code: 'dech',
            name: 'Schwiizerdütsch',
            flag: '🇨🇭',
            ogLocale: 'de_CH'
        },
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
    ].filter(lang => lang.code in content);
}

/**
 * Gets the locale format for a given language code
 * @param {string} lang - Language code
 * @returns {string} - Locale string (e.g., 'en_US')
 */
export function getLocale(lang) {
    const localeMap = {
        de: 'de_DE',
        dech: 'de_CH',
        es: 'es_ES',
        nl: 'nl_NL',
        it: 'it_IT',
        fr: 'fr_FR',
        pl: 'pl_PL',
        da: 'da_DK',
        ru: 'ru_RU',
        tr: 'tr_TR',
        af: 'af_ZA',
        ja: 'ja_JP',
        ko: 'ko_KO',
        tlh: 'tlh_Qo',
        qya: 'qya_Qo'
    };
    return localeMap[lang] || 'en_US';
}
