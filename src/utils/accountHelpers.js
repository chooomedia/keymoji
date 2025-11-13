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

    // PRIORITÄT 3: Wenn immer noch nichts gefunden - NUR als letzter Fallback
    // WICHTIG: createdAt sollte NUR beim Erstellen eines neuen Accounts gesetzt werden!
    // Wenn kein createdAt gefunden wird, bedeutet das, dass der Account noch nicht vollständig erstellt wurde
    // oder dass die Daten noch nicht synchronisiert wurden
    if (!createdAtValue) {
        console.warn('⚠️ No creation date found - this should only happen for new accounts');
        // DON'T set createdAt to current date here - it should come from the backend/API!
        // Only return current date for calculation purposes, but don't save it
        createdAtValue = new Date().toISOString();
        console.log('⚠️ Using current date as fallback for calculation only (not saved)');
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

        // Calculate difference in days
        // Use UTC dates to avoid timezone issues
        const createdAtUTC = new Date(Date.UTC(
            createdAt.getUTCFullYear(),
            createdAt.getUTCMonth(),
            createdAt.getUTCDate()
        ));
        const nowUTC = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        ));
        
        const diffTime = nowUTC - createdAtUTC;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log('✅ Days since creation calculated:', {
            createdAtValue,
            createdAt,
            createdAtUTC: createdAtUTC.toISOString(),
            nowUTC: nowUTC.toISOString(),
            diffTime,
            diffDays,
            source: currentAccount ? 'currentAccount' : 'localStorage'
        });

        return diffDays;
    } catch (error) {
        console.warn('Error calculating days since account creation:', error);
        return 0;
    }
}

/**
 * Formatiert die Account-Age in einen benutzerfreundlichen String
 * @param {number} days - Anzahl der Tage seit Account-Erstellung
 * @param {object} translations - Übersetzungsobjekt aus accountManager.accountAge
 * @returns {string} Formatierter String (z.B. "Seit heute!", "Seit 7 Tagen!", "Seit 2 Monaten!")
 * NOTE: Entfernt "FREE:" Prefix aus Übersetzungen für eingeloggte User
 */
export function formatAccountAge(days, translations = {}) {
    // Ensure days is a valid number
    if (typeof days !== 'number' || isNaN(days) || days < 0) {
        console.warn('⚠️ formatAccountAge: Invalid days value, defaulting to 0:', days);
        days = 0;
    }
    
    // Helper function to remove "FREE:" or "PRO:" prefix from translations
    const cleanTranslation = (text) => {
        if (!text) return text;
        // Remove common prefixes: "✨ FREE:", "🔥 FREE:", "💎 PRO:", etc.
        return text.replace(/^[✨🔥⚡💪🏆🚀]*\s*(FREE|PRO):\s*/i, '').trim();
    };
    
    let result;
    
    if (days === 0) {
        result = translations?.today || 'Seit heute!';
    } else if (days === 1) {
        result = translations?.yesterday || 'Seit gestern!';
    } else if (days < 7) {
        // CRITICAL: Check if translations.days contains the format template (has {days})
        // In some language files, there might be two "days" entries - the second overwrites the first
        // We need the format template, not the word "Tage"
        let baseText = translations?.days;
        if (!baseText || !baseText.includes('{days}')) {
            // translations.days is the word "Tage" (plural), not the format template
            // Use fallback format
            baseText = 'Seit {days} Tagen!';
        }
        result = baseText.replace('{days}', days);
    } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        const baseText = translations?.weeks || 'Seit {weeks} Woche{plural}!';
        result = baseText
            .replace('{weeks}', weeks)
            .replace('{plural}', weeks > 1 ? 'n' : '');
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        const baseText = translations?.months || 'Seit {months} Monat{plural}!';
        result = baseText
            .replace('{months}', months)
            .replace('{plural}', months > 1 ? 'en' : '');
    } else {
        const years = Math.floor(days / 365);
        const baseText = translations?.years || 'Seit {years} Jahr{plural}!';
        result = baseText
            .replace('{years}', years)
            .replace('{plural}', years > 1 ? 'en' : '');
    }
    
    // Remove "FREE:" or "PRO:" prefix for logged-in users
    return cleanTranslation(result);
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
