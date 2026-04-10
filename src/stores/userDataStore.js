// src/stores/userDataStore.js
// Usage History basiert ausschließlich auf dailyUsage (kein metadata.usageHistory mehr)

import { writable, get } from 'svelte/store';
import { currentAccount, isLoggedIn, dailyLimit } from 'stores/appStores';
import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';

const CACHE_KEYS = {
    SETTINGS: 'keymoji_settings_cache',
    SETTINGS_TIMESTAMP: 'keymoji_settings_timestamp',
    PROFILE: 'keymoji_profile_cache',
    PROFILE_TIMESTAMP: 'keymoji_profile_timestamp'
};

const CACHE_DURATION = {
    SETTINGS: 5 * 60 * 1000,
    PROFILE: 10 * 60 * 1000
};

// === STORES ===

export const userSettings = writable({
    data: null,
    isLoading: false,
    hasError: false,
    isCached: false,
    lastUpdate: null,
    errorMessage: null
});

/**
 * Usage History Store — Quelle: localStorage DAILY_USAGE_HISTORY
 * Einträge: { date: 'YYYY-MM-DD', used: number, storyUsed: number, limit: number }
 */
export const usageHistory = writable({
    data: [],
    isLoading: false,
    hasError: false,
    isCached: false,
    lastUpdate: null,
    errorMessage: null,
    stats: {
        total: 0,
        storyTotal: 0,
        average: 0,
        storyAverage: 0,
        max: 0,
        storyMax: 0,
        min: 0,
        storyMin: 0,
        trend: 'stable'
    }
});

// === HELPER FUNCTIONS ===

function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

function isCacheValid(timestampKey, duration) {
    const timestamp = storageHelpers.get(timestampKey);
    if (!timestamp) return false;
    return Date.now() - timestamp < duration;
}

/**
 * Berechne Statistiken aus History-Array
 */
export function calculateUsageStats(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return { total: 0, storyTotal: 0, average: 0, storyAverage: 0, max: 0, storyMax: 0, min: 0, storyMin: 0, trend: 'stable' };
    }
    const values = history.map(h => h.used || 0);
    const storyValues = history.map(h => h.storyUsed || 0);
    const total = values.reduce((sum, v) => sum + v, 0);
    const storyTotal = storyValues.reduce((sum, v) => sum + v, 0);
    const max = Math.max(...values);
    const storyMax = Math.max(...storyValues);
    const min = Math.min(...values);
    const storyMin = Math.min(...storyValues);

    let trend = 'stable';
    if (history.length >= 6) {
        const recent = history.slice(-3).map(h => h.used || 0);
        const previous = history.slice(-6, -3).map(h => h.used || 0);
        const recentAvg = recent.reduce((s, v) => s + v, 0) / recent.length;
        const previousAvg = previous.reduce((s, v) => s + v, 0) / previous.length;
        if (recentAvg > previousAvg * 1.2) trend = 'up';
        if (recentAvg < previousAvg * 0.8) trend = 'down';
    }

    return {
        total: Math.round(total),
        storyTotal: Math.round(storyTotal),
        average: Math.round((total / values.length) * 10) / 10,
        storyAverage: Math.round((storyTotal / storyValues.length) * 10) / 10,
        max, storyMax, min, storyMin, trend
    };
}

/**
 * Heute's dailyUsage in die lokale History einfügen/aktualisieren.
 * Gibt die sortierte, auf 90 Tage begrenzte History zurück.
 */
function upsertTodayIntoHistory(history, todayUsage) {
    if (!todayUsage) return history;
    const today = getTodayDateString();
    const todayEntry = {
        date: today,
        used: todayUsage.used || 0,
        storyUsed: todayUsage.storyUsed || 0,
        limit: todayUsage.limit || 0,
        timestamp: new Date().toISOString()
    };

    const existing = history.findIndex(e => e.date === today);
    let updated = [...history];
    if (existing >= 0) {
        // Höchsten Wert behalten (idempotent bei mehrfachem Aufruf)
        updated[existing] = {
            ...todayEntry,
            used: Math.max(updated[existing].used || 0, todayEntry.used),
            storyUsed: Math.max(updated[existing].storyUsed || 0, todayEntry.storyUsed)
        };
    } else {
        updated.push(todayEntry);
    }

    return updated
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 90);
}

/**
 * Aktuellen dailyUsage-Wert aus Store oder localStorage lesen
 */
function getCurrentDailyUsage() {
    try {
        const fromStore = get(dailyLimit);
        if (fromStore && fromStore.used !== undefined) return fromStore;
    } catch {}
    return storageHelpers.get(STORAGE_KEYS.DAILY_USAGE, null);
}

/**
 * History aus localStorage laden und heute einfügen
 */
function loadHistoryFromStorage() {
    const stored = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE_HISTORY, []);
    const history = Array.isArray(stored) ? stored : [];
    const todayUsage = getCurrentDailyUsage();
    return upsertTodayIntoHistory(history, todayUsage);
}

// === PUBLIC API ===

/**
 * Heute's dailyUsage in lokale History persistieren.
 * Wird von dailyUsageStore nach jedem Increment aufgerufen.
 */
export function persistDailyUsageToHistory(usageData) {
    if (!usageData) return;
    const stored = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE_HISTORY, []);
    const history = Array.isArray(stored) ? stored : [];
    const updated = upsertTodayIntoHistory(history, usageData);
    storageHelpers.set(STORAGE_KEYS.DAILY_USAGE_HISTORY, updated);

    const stats = calculateUsageStats(updated);
    usageHistory.set({
        data: updated,
        isLoading: false,
        hasError: false,
        isCached: false,
        lastUpdate: Date.now(),
        errorMessage: null,
        stats
    });

    console.log('✅ [USAGE HISTORY] persistDailyUsageToHistory:', updated.length, 'entries, today used:', usageData.used);
}

/**
 * History refreshen — liest aus localStorage (DAILY_USAGE_HISTORY) + heutigem dailyUsage.
 * Kein API-Call nötig.
 */
export async function refreshUsageHistory(force = false, _accountData = null) {
    usageHistory.update(s => ({ ...s, isLoading: true, hasError: false, errorMessage: null }));

    try {
        const history = loadHistoryFromStorage();
        const stats = calculateUsageStats(history);

        usageHistory.set({
            data: history,
            isLoading: false,
            hasError: false,
            isCached: false,
            lastUpdate: Date.now(),
            errorMessage: null,
            stats
        });

        console.log('✅ [USAGE HISTORY] refreshUsageHistory:', history.length, 'entries');
        return history;
    } catch (error) {
        console.error('❌ [USAGE HISTORY] Refresh error:', error);
        usageHistory.update(s => ({ ...s, isLoading: false, hasError: true, errorMessage: error.message }));
        return [];
    }
}

/**
 * User Settings refreshen (unverändert)
 */
export async function refreshUserSettings(force = false) {
    const account = get(currentAccount);
    const loggedIn = get(isLoggedIn);

    try {
        const { initializeSettingsForUser } = await import('./userSettingsStore.js');
        if (account && account.userId) {
            const loadedSettings = await initializeSettingsForUser();
            if (loadedSettings && Object.keys(loadedSettings).length > 0) {
                storageHelpers.set(CACHE_KEYS.SETTINGS, loadedSettings);
                storageHelpers.set(CACHE_KEYS.SETTINGS_TIMESTAMP, Date.now());
                userSettings.update(s => ({
                    ...s,
                    data: loadedSettings,
                    isCached: false,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: Date.now()
                }));
                return loadedSettings;
            }
        }

        if (!force && isCacheValid(CACHE_KEYS.SETTINGS_TIMESTAMP, CACHE_DURATION.SETTINGS)) {
            const cached = storageHelpers.get(CACHE_KEYS.SETTINGS);
            if (cached) {
                userSettings.update(s => ({
                    ...s,
                    data: cached,
                    isCached: true,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: storageHelpers.get(CACHE_KEYS.SETTINGS_TIMESTAMP)
                }));
                return cached;
            }
        }

        return null;
    } catch (error) {
        console.error('❌ [USER SETTINGS] Refresh error:', error);
        userSettings.update(s => ({ ...s, hasError: true, isLoading: false, errorMessage: error.message }));
        const cached = storageHelpers.get(CACHE_KEYS.SETTINGS);
        return cached || null;
    }
}

/**
 * App-Start: Stores aus localStorage befüllen
 */
export function initializeUserData() {
    console.log('🚀 [USER DATA] Initializing stores...');

    try {
        // Settings aus Cache
        if (isCacheValid(CACHE_KEYS.SETTINGS_TIMESTAMP, CACHE_DURATION.SETTINGS)) {
            const cached = storageHelpers.get(CACHE_KEYS.SETTINGS);
            if (cached) {
                userSettings.update(s => ({ ...s, data: cached, isCached: true, lastUpdate: storageHelpers.get(CACHE_KEYS.SETTINGS_TIMESTAMP) }));
                console.log('📦 [USER DATA] Settings loaded from cache');
            }
        }

        // Usage History aus localStorage aufbauen
        const history = loadHistoryFromStorage();
        if (history.length > 0) {
            const stats = calculateUsageStats(history);
            usageHistory.set({
                data: history,
                isLoading: false,
                hasError: false,
                isCached: true,
                lastUpdate: Date.now(),
                errorMessage: null,
                stats
            });
            console.log('📦 [USER DATA] Usage history loaded from localStorage:', history.length, 'entries');
        }
    } catch (error) {
        console.warn('⚠️ [USER DATA] Failed to load from storage:', error);
    }
}
