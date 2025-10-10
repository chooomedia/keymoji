// src/utils/accountHelpers.js
// Zentrale Hilfsfunktionen für Account-Management

import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';

/**
 * Berechnet die Anzahl der Tage seit Account-Erstellung
 * Nutzt ZUERST die API-Daten (currentAccount.createdAt), dann localStorage als Fallback
 * @param {object} currentAccount - Optional: Current account object from store
 * @returns {number} Anzahl der Tage
 */
export function getDaysSinceAccountCreation(currentAccount = null) {
    let createdAtValue = null;

    // PRIORITÄT 1: API-Daten vom currentAccount (aus Google Sheets!)
    if (currentAccount && currentAccount.createdAt) {
        createdAtValue = currentAccount.createdAt;
        console.log(
            '🔍 Using createdAt from currentAccount (API/Google Sheets):',
            createdAtValue
        );
    }

    // PRIORITÄT 2: localStorage USER_PREFERENCES.createdAt (Fallback)
    if (!createdAtValue) {
        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        console.log('🔍 DEBUG: User preferences from localStorage:', userPrefs);
        createdAtValue = userPrefs?.createdAt;

        if (createdAtValue) {
            console.log(
                '🔍 Using createdAt from localStorage:',
                createdAtValue
            );
        }
    }

    // PRIORITÄT 3: Wenn immer noch nichts gefunden - setze auf heute (nur als letzter Fallback)
    if (!createdAtValue) {
        console.log('⚠️ No creation date found - setting to current date');
        createdAtValue = new Date().toISOString();

        // Speichere es sofort im localStorage
        const userPrefs =
            storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES) || {};
        const updatedPrefs = {
            ...userPrefs,
            createdAt: createdAtValue
        };
        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
        console.log(
            '✅ CreatedAt set to current date and saved:',
            createdAtValue
        );
    }

    try {
        const createdAt = new Date(createdAtValue);
        const now = new Date();

        // Check if the date is valid
        if (isNaN(createdAt.getTime())) {
            console.warn('⚠️ Invalid date format:', createdAtValue);
            return 0;
        }

        // Check if the date is in the future (which would be invalid)
        if (createdAt > now) {
            console.warn('⚠️ CreatedAt date is in the future:', createdAtValue);
            // Use a reasonable fallback date (e.g., 1 day ago)
            const fallbackDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
            const diffTime = Math.abs(now - fallbackDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            console.log('🔧 Using fallback date (1 day ago):', diffDays);
            return diffDays;
        }

        const diffTime = Math.abs(now - createdAt);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log('✅ Days since creation calculated:', {
            createdAtValue,
            createdAt,
            diffDays,
            source: 'localStorage'
        });

        return diffDays;
    } catch (error) {
        console.warn('Error calculating days since account creation:', error);
        return 0;
    }
}

/**
 * Formatiert die Account-Age in einen benutzerfreundlichen String (NUR Text, OHNE Prefix)
 * @param {number} days - Anzahl der Tage
 * @param {object} translations - Übersetzungsobjekt
 * @returns {string} Formatierter String (z.B. "Seit heute!", "Seit 7 Tagen!")
 */
export function formatAccountAge(days, translations = {}) {
    if (days === 0) {
        return translations?.today || 'Seit heute!';
    } else if (days === 1) {
        return translations?.yesterday || 'Seit gestern!';
    } else if (days < 7) {
        const baseText = translations?.days || 'Seit {days} Tagen!';
        return baseText.replace('{days}', days);
    } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        const baseText = translations?.weeks || 'Seit {weeks} Woche{plural}!';
        return baseText
            .replace('{weeks}', weeks)
            .replace('{plural}', weeks > 1 ? 'n' : '');
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        const baseText = translations?.months || 'Seit {months} Monat{plural}!';
        return baseText
            .replace('{months}', months)
            .replace('{plural}', months > 1 ? 'en' : '');
    } else {
        const years = Math.floor(days / 365);
        const baseText = translations?.years || 'Seit {years} Jahr{plural}!';
        return baseText
            .replace('{years}', years)
            .replace('{plural}', years > 1 ? 'en' : '');
    }
}

/**
 * Gibt den Tier-Badge-Text zurück (NUR Prefix)
 * @param {string} tier - 'free' oder 'pro'
 * @returns {string} Badge-Text (z.B. "✨ FREE", "💎 PRO")
 */
export function getTierBadgeText(tier = 'free') {
    return tier === 'pro' ? '💎 PRO' : '✨ FREE';
}

/**
 * Test-Funktion zum manuellen Setzen des createdAt (nur für Development)
 * @param {number} daysAgo - Wie viele Tage in der Vergangenheit
 */
export function testSetCreatedAt(daysAgo = 0) {
    const testDate = new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();
    const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    const updatedPrefs = {
        ...userPrefs,
        createdAt: testDate
    };
    storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
    console.log(`🔧 Test createdAt set to ${daysAgo} days ago:`, testDate);
    console.log('🔧 Updated userPrefs:', updatedPrefs);
    return getDaysSinceAccountCreation();
}

/**
 * Prüft localStorage und gibt User-Preferences zurück
 * @returns {object|null} User preferences oder null
 */
export function checkLocalStorageForAccount() {
    const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
    console.log('🔍 Current userPrefs in localStorage:', userPrefs);
    return userPrefs;
}
