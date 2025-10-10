// src/stores/userDataStore.js
// 🚀 SENIOR WEB DEV PRO: Robust, Async, Flexible User Data Management
// Pattern inspired by userCounter - Same sexy architecture!

import { writable, derived, get } from 'svelte/store';
import { currentAccount, isLoggedIn, accountTier } from './appStores.js';
import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';
import { WEBHOOKS } from '../config/api.js';
import { cachedFetchAccount } from '../utils/apiCache.js';

// === CACHE CONFIGURATION ===
const CACHE_DURATION = {
    SETTINGS: 5 * 60 * 1000, // 5 minutes
    USAGE_HISTORY: 15 * 60 * 1000, // 15 minutes
    PROFILE: 10 * 60 * 1000 // 10 minutes
};

const CACHE_KEYS = {
    SETTINGS: 'keymoji_settings_cache',
    SETTINGS_TIMESTAMP: 'keymoji_settings_timestamp',
    USAGE_HISTORY: 'keymoji_usage_history_cache',
    USAGE_HISTORY_TIMESTAMP: 'keymoji_usage_history_timestamp',
    PROFILE: 'keymoji_profile_cache',
    PROFILE_TIMESTAMP: 'keymoji_profile_timestamp'
};

// === STORES ===

/**
 * User Settings Store
 * Similar to userCounter - async, cached, robust
 */
export const userSettings = writable({
    data: null,
    isLoading: false,
    hasError: false,
    isCached: false,
    lastUpdate: null,
    errorMessage: null
});

/**
 * Usage History Store
 * For SVG Charts - async, cached, robust
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
        average: 0,
        max: 0,
        min: 0,
        trend: 'stable'
    }
});

/**
 * User Profile Store
 * Separate from settings - lightweight, fast
 */
export const userProfile = writable({
    data: null,
    isLoading: false,
    hasError: false,
    isCached: false,
    lastUpdate: null
});

// === DERIVED STORES ===

/**
 * Chart Data (derived from usageHistory)
 * Automatically updates when usageHistory changes
 */
export const chartData = derived(usageHistory, $usageHistory => {
    if (!$usageHistory.data || $usageHistory.data.length === 0) {
        return {
            labels: [],
            datasets: [],
            isEmpty: true
        };
    }

    return {
        labels: $usageHistory.data.map(entry => entry.date),
        datasets: [
            {
                label: 'Daily Usage',
                data: $usageHistory.data.map(entry => entry.used || 0),
                borderColor: $usageHistory.isCached ? '#9ca3af' : '#fbbf24',
                backgroundColor: $usageHistory.isCached ? '#e5e7eb' : '#fef3c7'
            }
        ],
        isEmpty: false
    };
});

/**
 * Settings Status (derived)
 * Quick check if settings are loaded and valid
 */
export const settingsStatus = derived(userSettings, $settings => ({
    isReady: !$settings.isLoading && !$settings.hasError && !!$settings.data,
    needsRefresh:
        $settings.isCached &&
        $settings.lastUpdate &&
        Date.now() - $settings.lastUpdate > CACHE_DURATION.SETTINGS,
    hasData: !!$settings.data
}));

// === HELPER FUNCTIONS ===

/**
 * Safe JSON Parse (handles double-escaped JSON from Google Sheets)
 */
function safeJSONParse(data, fallback = {}) {
    if (!data) return fallback;
    if (typeof data === 'object' && data !== null) return data;
    if (typeof data === 'string') {
        try {
            let parsed = JSON.parse(data);
            // Double-escaped JSON? Parse again!
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }
            return parsed;
        } catch (error) {
            console.warn('⚠️ JSON parse error:', error.message);
            return fallback;
        }
    }
    return fallback;
}

/**
 * Check if localhost (API not available)
 */
function isLocalhost() {
    return (
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1')
    );
}

/**
 * Check if cache is valid
 */
function isCacheValid(timestampKey, duration) {
    try {
        const timestamp = storageHelpers.get(timestampKey);
        if (!timestamp) return false;
        const age = Date.now() - timestamp;
        return age < duration;
    } catch (error) {
        return false;
    }
}

// === USER SETTINGS ===

/**
 * Refresh User Settings (async, cached, robust)
 * Pattern: Same as refreshUserCounter!
 */
export async function refreshUserSettings(force = false) {
    const account = get(currentAccount);
    const loggedIn = get(isLoggedIn);

    console.log('🔄 Starting user settings refresh...', {
        loggedIn,
        force,
        hasAccount: !!account
    });

    // Set loading state
    userSettings.update(state => ({
        ...state,
        isLoading: true,
        hasError: false,
        errorMessage: null
    }));

    try {
        // Priority 1: Check cache (if not force refresh)
        if (
            !force &&
            isCacheValid(CACHE_KEYS.SETTINGS_TIMESTAMP, CACHE_DURATION.SETTINGS)
        ) {
            const cachedData = storageHelpers.get(CACHE_KEYS.SETTINGS);
            if (cachedData) {
                console.log('📦 Using cached settings (still valid)');
                userSettings.update(state => ({
                    ...state,
                    data: cachedData,
                    isCached: true,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: storageHelpers.get(
                        CACHE_KEYS.SETTINGS_TIMESTAMP
                    )
                }));
                return cachedData;
            }
        }

        // Priority 2: Load from localStorage (immediate)
        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        if (userPrefs) {
            // CRITICAL: Settings können in 2 Strukturen sein:
            // 1. metadata.settings (korrekt)
            // 2. profile (alte Google Sheets Struktur!)

            const parsedMetadata = safeJSONParse(userPrefs.metadata, {});
            const parsedProfile = safeJSONParse(userPrefs.profile, {});

            const settings =
                parsedMetadata.settings || // Korrekte Location
                parsedProfile || // Google Sheets Location (profile enthält alle settings!)
                null;

            if (settings && typeof settings === 'object') {
                console.log('✅ Settings loaded from localStorage:', settings);
                console.log(
                    '🔍 [SETTINGS] Source:',
                    parsedMetadata.settings ? 'metadata.settings' : 'profile'
                );

                userSettings.update(state => ({
                    ...state,
                    data: settings,
                    isCached: true,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: Date.now()
                }));

                // Cache for quick access
                storageHelpers.set(CACHE_KEYS.SETTINGS, settings);
                storageHelpers.set(CACHE_KEYS.SETTINGS_TIMESTAMP, Date.now());

                return settings;
            }
        }

        // Priority 3: Fetch from API (if logged in and not localhost)
        if (loggedIn && account?.userId && !isLocalhost()) {
            console.log('📡 Fetching settings from API...');

            const result = await cachedFetchAccount(
                account.userId,
                account.email,
                'read'
            );

            if (result.success && result.account) {
                // Parse both metadata AND profile (Google Sheets structure!)
                const parsedMetadata = safeJSONParse(
                    result.account.metadata,
                    {}
                );
                const parsedProfile = safeJSONParse(result.account.profile, {});

                // Check BOTH locations for settings
                const settings =
                    parsedMetadata.settings || // Korrekte Location
                    parsedProfile || // Google Sheets Location!
                    {};

                console.log('✅ Settings loaded from API:', settings);
                console.log(
                    '🔍 [API SETTINGS] Source:',
                    parsedMetadata.settings ? 'metadata.settings' : 'profile'
                );

                userSettings.update(state => ({
                    ...state,
                    data: settings,
                    isCached: false,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: Date.now()
                }));

                // Update cache
                storageHelpers.set(CACHE_KEYS.SETTINGS, settings);
                storageHelpers.set(CACHE_KEYS.SETTINGS_TIMESTAMP, Date.now());

                return settings;
            }
        }

        // Priority 4: Use defaults (fallback)
        console.log('💡 Using default settings (no data available)');
        const defaultSettings = {
            theme: 'auto',
            language: 'en',
            notifications: true
        };

        userSettings.update(state => ({
            ...state,
            data: defaultSettings,
            isCached: false,
            isLoading: false,
            hasError: false,
            lastUpdate: Date.now()
        }));

        return defaultSettings;
    } catch (error) {
        console.error('❌ Settings refresh error:', error);

        userSettings.update(state => ({
            ...state,
            hasError: true,
            isLoading: false,
            errorMessage: error.message
        }));

        // Try to return cached data even on error
        const cachedData = storageHelpers.get(CACHE_KEYS.SETTINGS);
        if (cachedData) {
            console.log('💡 Returning stale cache due to error');
            return cachedData;
        }

        throw error;
    }
}

// === USAGE HISTORY ===

/**
 * Calculate usage statistics
 */
function calculateUsageStats(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return {
            total: 0,
            average: 0,
            max: 0,
            min: 0,
            trend: 'stable'
        };
    }

    const values = history.map(h => h.used || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calculate trend (last 3 vs previous 3)
    let trend = 'stable';
    if (history.length >= 6) {
        const recent = history.slice(-3).map(h => h.used || 0);
        const previous = history.slice(-6, -3).map(h => h.used || 0);
        const recentAvg =
            recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const previousAvg =
            previous.reduce((sum, val) => sum + val, 0) / previous.length;

        if (recentAvg > previousAvg * 1.2) trend = 'up';
        if (recentAvg < previousAvg * 0.8) trend = 'down';
    }

    return {
        total: Math.round(total),
        average: Math.round(average * 10) / 10,
        max,
        min,
        trend
    };
}

/**
 * Refresh Usage History (async, cached, robust)
 * For SVG Charts - Same pattern as refreshUserCounter!
 */
export async function refreshUsageHistory(force = false) {
    const account = get(currentAccount);
    const loggedIn = get(isLoggedIn);

    console.log('📊 Starting usage history refresh...', {
        loggedIn,
        force,
        hasAccount: !!account
    });

    // Set loading state
    usageHistory.update(state => ({
        ...state,
        isLoading: true,
        hasError: false,
        errorMessage: null
    }));

    try {
        // Priority 1: Check cache (if not force refresh)
        if (
            !force &&
            isCacheValid(
                CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                CACHE_DURATION.USAGE_HISTORY
            )
        ) {
            const cachedData = storageHelpers.get(CACHE_KEYS.USAGE_HISTORY);
            if (cachedData && Array.isArray(cachedData)) {
                console.log(
                    '📦 Using cached usage history (still valid):',
                    cachedData.length,
                    'entries'
                );
                const stats = calculateUsageStats(cachedData);

                usageHistory.update(state => ({
                    ...state,
                    data: cachedData,
                    stats,
                    isCached: true,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: storageHelpers.get(
                        CACHE_KEYS.USAGE_HISTORY_TIMESTAMP
                    )
                }));
                return cachedData;
            }
        }

        // Priority 2: Load from currentAccount (immediate)
        if (account) {
            // CRITICAL: usageHistory kann in 2 Orten sein:
            // 1. metadata.usageHistory (korrekt)
            // 2. profile.usageHistory (alte/falsche Struktur in Google Sheets!)

            const parsedMetadata = safeJSONParse(account.metadata, {});
            const parsedProfile = safeJSONParse(account.profile, {});

            // Versuche BEIDE Locations
            const history =
                parsedMetadata.usageHistory || // Korrekte Location
                parsedProfile.usageHistory || // Fallback (Google Sheets!)
                [];

            console.log('🔍 [USAGE HISTORY] Checking data locations:', {
                hasMetadata: !!account.metadata,
                hasProfile: !!account.profile,
                metadataHasHistory: !!parsedMetadata.usageHistory,
                profileHasHistory: !!parsedProfile.usageHistory,
                finalHistoryLength: history.length
            });

            if (Array.isArray(history) && history.length > 0) {
                console.log(
                    '✅ Usage history loaded from currentAccount:',
                    history.length,
                    'entries'
                );
                const stats = calculateUsageStats(history);

                usageHistory.update(state => ({
                    ...state,
                    data: history,
                    stats,
                    isCached: false,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: Date.now()
                }));

                // Update cache
                storageHelpers.set(CACHE_KEYS.USAGE_HISTORY, history);
                storageHelpers.set(
                    CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                    Date.now()
                );

                return history;
            }
        }

        // Priority 3: Fetch from API (if logged in and not localhost)
        if (loggedIn && account?.userId && !isLocalhost()) {
            console.log('📡 Fetching usage history from API...');

            const result = await cachedFetchAccount(
                account.userId,
                account.email,
                'read'
            );

            if (result.success && result.account) {
                // Parse both metadata AND profile (Google Sheets structure!)
                const parsedMetadata = safeJSONParse(
                    result.account.metadata,
                    {}
                );
                const parsedProfile = safeJSONParse(result.account.profile, {});

                // Check BOTH locations for usageHistory
                const history =
                    parsedMetadata.usageHistory || // Korrekte Location
                    parsedProfile.usageHistory || // Google Sheets Location!
                    [];

                console.log('🔍 [API] Usage history locations:', {
                    metadataHasHistory: !!parsedMetadata.usageHistory,
                    profileHasHistory: !!parsedProfile.usageHistory,
                    foundHistoryLength: history.length
                });

                console.log(
                    '✅ Usage history loaded from API:',
                    history.length,
                    'entries'
                );
                const stats = calculateUsageStats(history);

                usageHistory.update(state => ({
                    ...state,
                    data: history,
                    stats,
                    isCached: false,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: Date.now()
                }));

                // Update cache
                storageHelpers.set(CACHE_KEYS.USAGE_HISTORY, history);
                storageHelpers.set(
                    CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                    Date.now()
                );

                return history;
            }
        }

        // Priority 4: Use demo data (fallback for localhost/no data)
        console.log('💡 No usage history available - using empty array');

        usageHistory.update(state => ({
            ...state,
            data: [],
            stats: calculateUsageStats([]),
            isCached: false,
            isLoading: false,
            hasError: false,
            lastUpdate: Date.now()
        }));

        return [];
    } catch (error) {
        console.error('❌ Usage history refresh error:', error);

        usageHistory.update(state => ({
            ...state,
            hasError: true,
            isLoading: false,
            errorMessage: error.message
        }));

        // Try to return cached data even on error
        const cachedData = storageHelpers.get(CACHE_KEYS.USAGE_HISTORY);
        if (cachedData && Array.isArray(cachedData)) {
            console.log('💡 Returning stale cache due to error');
            return cachedData;
        }

        return [];
    }
}

// === INITIALIZATION ===

/**
 * Initialize all user data on app start
 * Pattern: Same as initializeUserCounter!
 */
export function initializeUserData() {
    console.log('🚀 Initializing user data stores...');

    // Load from cache immediately (no async delay!)
    try {
        // Settings
        const cachedSettings = storageHelpers.get(CACHE_KEYS.SETTINGS);
        const settingsTimestamp = storageHelpers.get(
            CACHE_KEYS.SETTINGS_TIMESTAMP
        );
        if (
            cachedSettings &&
            isCacheValid(CACHE_KEYS.SETTINGS_TIMESTAMP, CACHE_DURATION.SETTINGS)
        ) {
            userSettings.update(state => ({
                ...state,
                data: cachedSettings,
                isCached: true,
                lastUpdate: settingsTimestamp
            }));
            console.log('📦 Settings loaded from cache');
        }

        // Usage History
        const cachedHistory = storageHelpers.get(CACHE_KEYS.USAGE_HISTORY);
        const historyTimestamp = storageHelpers.get(
            CACHE_KEYS.USAGE_HISTORY_TIMESTAMP
        );
        if (
            cachedHistory &&
            isCacheValid(
                CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                CACHE_DURATION.USAGE_HISTORY
            )
        ) {
            const stats = calculateUsageStats(cachedHistory);
            usageHistory.update(state => ({
                ...state,
                data: cachedHistory,
                stats,
                isCached: true,
                lastUpdate: historyTimestamp
            }));
            console.log('📦 Usage history loaded from cache');
        }
    } catch (error) {
        console.warn('⚠️ Failed to load from cache:', error);
    }

    // Fetch fresh data on page load
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            console.log('🌐 Page loaded, refreshing user data...');
            const loggedIn = get(isLoggedIn);

            if (loggedIn) {
                refreshUserSettings();
                refreshUsageHistory();
            }
        });
    }
}

// === AUTO-REFRESH ===

/**
 * Setup auto-refresh intervals (optional)
 * Keeps data fresh in background
 */
export function setupAutoRefresh() {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

    setInterval(() => {
        const loggedIn = get(isLoggedIn);
        if (loggedIn && !isLocalhost()) {
            console.log('🔄 Auto-refreshing user data...');
            refreshUserSettings();
            refreshUsageHistory();
        }
    }, REFRESH_INTERVAL);
}

// === EXPORTS ===

export default {
    // Stores
    userSettings,
    usageHistory,
    userProfile,
    chartData,
    settingsStatus,

    // Functions
    refreshUserSettings,
    refreshUsageHistory,
    initializeUserData,
    setupAutoRefresh,

    // Utils
    isCacheValid,
    calculateUsageStats
};
