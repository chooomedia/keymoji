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

/**
 * Safe JSON parse (handles double-escaped JSON from Google Sheets)
 */
function safeJSONParse(data, fallback = {}) {
    if (!data) return fallback;
    if (typeof data === 'object' && data !== null) return data;
    if (typeof data === 'string') {
        try {
            let parsed = JSON.parse(data);
            // Handle double-escaped JSON from Google Sheets
            if (typeof parsed === 'string') {
                try {
                parsed = JSON.parse(parsed);
                } catch {
                    return fallback;
                }
            }
            return parsed;
        } catch {
            return fallback;
        }
    }
    return fallback;
}

/**
 * Check if cache is still valid
 */
function isCacheValid(timestampKey, duration) {
    const timestamp = storageHelpers.get(timestampKey);
    if (!timestamp) return false;
    return Date.now() - timestamp < duration;
}

/**
 * Check if running on localhost
 */
function isLocalhost() {
    if (typeof window === 'undefined') return false;
    return (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    );
}

/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Merge today's dailyUsage into history (CENTRALIZED FUNCTION)
 * This ensures today's usage is always visible in charts
 * NOTE: This is async because we need to dynamically import stores
 */
async function mergeTodayIntoHistory(history) {
    if (!Array.isArray(history)) return history;
    
    const today = getTodayDateString();
    const todayIndex = history.findIndex(entry => entry.date === today);
    
    // Get current dailyUsage from multiple sources (priority order)
    let todayUsage = null;
    
    // Priority 1: Try dailyLimit store (synchronous)
    try {
        // Dynamic import to avoid circular dependencies
        const appStores = await import('./appStores.js');
        const { get } = await import('svelte/store');
        todayUsage = get(appStores.dailyLimit);
    } catch (e) {
        // Store not available yet, try localStorage
    }
    
    // Priority 2: Fallback to localStorage
    if (!todayUsage) {
        todayUsage = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE);
    }
    
    // Only merge if we have usage data and it's not all zeros
    if (todayUsage && (todayUsage.used > 0 || todayUsage.storyUsed > 0)) {
        let todayEntry;
        
        if (todayIndex >= 0) {
            // CRITICAL: Merge with existing entry to preserve both used AND storyUsed
            // This ensures that if story was created first, then random, both values are preserved
            const existingEntry = history[todayIndex];
            todayEntry = {
                date: today,
                // Keep the HIGHER value (preserves both increments)
                used: Math.max(existingEntry.used || 0, todayUsage.used || 0),
                storyUsed: Math.max(existingEntry.storyUsed || 0, todayUsage.storyUsed || 0),
                limit: todayUsage.limit || existingEntry.limit || 0,
                timestamp: new Date().toISOString()
            };
            console.log('🔄 [MERGE] Merging today into history:', {
                existing: existingEntry,
                fromStore: todayUsage,
                merged: todayEntry
            });
            history[todayIndex] = todayEntry;
        } else {
            // New entry - use todayUsage directly
            todayEntry = {
                date: today,
                used: todayUsage.used || 0,
                storyUsed: todayUsage.storyUsed || 0,
                limit: todayUsage.limit || 0,
                timestamp: new Date().toISOString()
            };
            history.push(todayEntry);
        }
        
        // Sort by date (newest first) and keep only last 365 days
        history = history
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 365);
    }
    
    return history;
}

/**
 * Calculate usage statistics from history
 */
function calculateUsageStats(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return {
            total: 0,
            storyTotal: 0,
            average: 0,
            storyAverage: 0,
            max: 0,
            storyMax: 0,
            min: 0,
            storyMin: 0,
            trend: 'stable'
        };
    }

    const values = history.map(h => h.used || 0);
    const storyValues = history.map(h => h.storyUsed || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const storyTotal = storyValues.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const storyAverage = storyTotal / storyValues.length;
    const max = Math.max(...values);
    const storyMax = Math.max(...storyValues);
    const min = Math.min(...values);
    const storyMin = Math.min(...storyValues);

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
        storyTotal: Math.round(storyTotal),
        average: Math.round(average * 10) / 10,
        storyAverage: Math.round(storyAverage * 10) / 10,
        max,
        storyMax,
        min,
        storyMin,
        trend
    };
}

/**
 * Refresh User Settings (async, cached, robust)
 * SINGLE SOURCE OF TRUTH for user settings loading
 * Similar pattern to refreshUsageHistory
 */
export async function refreshUserSettings(force = false) {
    const account = get(currentAccount);
    const loggedIn = get(isLoggedIn);

    console.log('⚙️ [USER SETTINGS] Starting refresh...', {
        loggedIn,
        force,
        hasAccount: !!account
    });

    try {
        // Priority 1: Use initializeSettingsForUser (handles all sources: API, localStorage, defaults)
        // This is the most robust way to load settings after login
        const { initializeSettingsForUser } = await import('./userSettingsStore.js');
        
        if (account && account.userId) {
            console.log('🔄 [USER SETTINGS] Initializing settings for user...');
            const loadedSettings = await initializeSettingsForUser();
            
            if (loadedSettings && Object.keys(loadedSettings).length > 0) {
                console.log('✅ [USER SETTINGS] Settings initialized successfully:', {
                    hasName: !!loadedSettings.name,
                    hasLanguage: !!loadedSettings.language,
                    hasTheme: !!loadedSettings.theme,
                    hasStoryMode: !!loadedSettings.storyMode
                });
                
                // Update cache
                storageHelpers.set(CACHE_KEYS.SETTINGS, loadedSettings);
                storageHelpers.set(CACHE_KEYS.SETTINGS_TIMESTAMP, Date.now());
                
                // Update userSettings store (for compatibility with old code)
                userSettings.update(state => ({
                    ...state,
                    data: loadedSettings,
                    isCached: false,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: Date.now()
                }));
                
                return loadedSettings;
            }
        }
        
        // Fallback: If no account or initialization failed, try to load from cache
        if (!force && isCacheValid(CACHE_KEYS.SETTINGS_TIMESTAMP, CACHE_DURATION.SETTINGS)) {
            const cachedSettings = storageHelpers.get(CACHE_KEYS.SETTINGS);
            if (cachedSettings) {
                console.log('📦 [USER SETTINGS] Using cached settings');
                userSettings.update(state => ({
                    ...state,
                    data: cachedSettings,
                    isCached: true,
                    isLoading: false,
                    hasError: false,
                    lastUpdate: storageHelpers.get(CACHE_KEYS.SETTINGS_TIMESTAMP)
                }));
                return cachedSettings;
            }
        }
        
        console.log('💡 [USER SETTINGS] No settings available');
        return null;
    } catch (error) {
        console.error('❌ [USER SETTINGS] Refresh error:', error);
        
        userSettings.update(state => ({
            ...state,
            hasError: true,
            isLoading: false,
            errorMessage: error.message
        }));
        
        // Try to return cached data even on error
        const cachedSettings = storageHelpers.get(CACHE_KEYS.SETTINGS);
        if (cachedSettings) {
            console.log('💡 [USER SETTINGS] Returning stale cache due to error');
            return cachedSettings;
        }
        
        return null;
    }
}

/**
 * Refresh Usage History (async, cached, robust)
 * SINGLE SOURCE OF TRUTH for usage history loading
 */
/**
 * Refresh usage history - OPTIMIZED: Accepts accountData to prevent duplicate API calls
 * @param {boolean} force - Force refresh even if cache is valid
 * @param {Object} accountData - Optional account data from verifyMagicLinkFrontend (prevents duplicate API calls)
 */
export async function refreshUsageHistory(force = false, accountData = null) {
    const account = accountData || get(currentAccount);
    const loggedIn = !!accountData || get(isLoggedIn);

    console.log('📊 [USAGE HISTORY] Starting refresh...', {
        loggedIn,
        force,
        hasAccount: !!account,
        hasAccountData: !!accountData,
        hasUsageHistoryInAccountData: !!accountData?.metadata?.usageHistory
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
            let cachedData = storageHelpers.get(CACHE_KEYS.USAGE_HISTORY);
            if (cachedData && Array.isArray(cachedData)) {
                // CRITICAL: Merge today's dailyUsage into cached history
                cachedData = await mergeTodayIntoHistory(cachedData);
                
                // Update cache with merged data
                if (cachedData !== storageHelpers.get(CACHE_KEYS.USAGE_HISTORY)) {
                    storageHelpers.set(CACHE_KEYS.USAGE_HISTORY, cachedData);
                }
                
                console.log('📦 [USAGE HISTORY] Using cached data:', cachedData.length, 'entries');
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
            // Handle both string and object formats
            let parsedMetadata = {};
            let parsedProfile = {};
            
            if (typeof account.metadata === 'string') {
                parsedMetadata = safeJSONParse(account.metadata, {});
            } else if (account.metadata && typeof account.metadata === 'object') {
                parsedMetadata = account.metadata;
            }
            
            if (typeof account.profile === 'string') {
                parsedProfile = safeJSONParse(account.profile, {});
            } else if (account.profile && typeof account.profile === 'object') {
                parsedProfile = account.profile;
            }

            // Check BOTH locations for usageHistory
            let history =
                parsedMetadata.usageHistory ||
                parsedProfile.usageHistory ||
                [];
            
            // Ensure all history entries have storyUsed field (migration support)
            if (Array.isArray(history)) {
                history = history.map(entry => ({
                    ...entry,
                    storyUsed: entry.storyUsed || 0
                }));
            }

            if (Array.isArray(history) && history.length > 0) {
                // CRITICAL: Merge today's dailyUsage into history
                history = await mergeTodayIntoHistory(history);
                
                console.log('✅ [USAGE HISTORY] Loaded from currentAccount:', history.length, 'entries');
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

        // Priority 3: Use usageHistory from accountData if available (prevents duplicate API call!)
        if (accountData?.metadata?.usageHistory && Array.isArray(accountData.metadata.usageHistory)) {
            let history = accountData.metadata.usageHistory;
            
            // Ensure all history entries have storyUsed field
            history = history.map(entry => ({
                ...entry,
                storyUsed: entry.storyUsed || 0
            }));

            // CRITICAL: Merge today's dailyUsage into history
            history = await mergeTodayIntoHistory(history);
            
            console.log('✅ [USAGE HISTORY] Loaded from accountData (prevents duplicate API call!):', history.length, 'entries');
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

        // Priority 4: Fetch from API ONLY if not already loaded from accountData (prevents duplicate API call!)
        if (loggedIn && account?.userId && !isLocalhost() && !accountData?.metadata?.usageHistory) {
            console.log('📡 [USAGE HISTORY] Fetching from API (accountData had no usageHistory)...');

            const result = await cachedFetchAccount(
                account.userId,
                account.email,
                'get' // CRITICAL: Must be 'get' not 'read' for n8n webhook!
            );

            if (result.success && result.account) {
                // Parse both metadata AND profile
                const parsedMetadata = safeJSONParse(
                    result.account.metadata,
                    {}
                );
                const parsedProfile = safeJSONParse(result.account.profile, {});

                // Check BOTH locations for usageHistory
                let history =
                    parsedMetadata.usageHistory ||
                    parsedProfile.usageHistory ||
                    [];
                
                // Ensure all history entries have storyUsed field
                if (Array.isArray(history)) {
                    history = history.map(entry => ({
                        ...entry,
                        storyUsed: entry.storyUsed || 0
                    }));
                }

                // CRITICAL: Merge today's dailyUsage into history
                history = await mergeTodayIntoHistory(history);
                
                console.log('✅ [USAGE HISTORY] Loaded from API:', history.length, 'entries');
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

        // Priority 4: Empty array (no data available)
        console.log('💡 [USAGE HISTORY] No data available - using empty array');

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
        console.error('❌ [USAGE HISTORY] Refresh error:', error);

        usageHistory.update(state => ({
            ...state,
            hasError: true,
            isLoading: false,
            errorMessage: error.message
        }));

        // Try to return cached data even on error
        const cachedData = storageHelpers.get(CACHE_KEYS.USAGE_HISTORY);
        if (cachedData && Array.isArray(cachedData)) {
            console.log('💡 [USAGE HISTORY] Returning stale cache due to error');
            return cachedData;
        }

        return [];
    }
}

// === INITIALIZATION ===

/**
 * Initialize all user data on app start
 */
export function initializeUserData() {
    console.log('🚀 [USER DATA] Initializing stores...');

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
            console.log('📦 [USER DATA] Settings loaded from cache');
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
            // CRITICAL: Merge today's dailyUsage into cached history
            // Note: This is synchronous during init, so we use a simpler approach
            const localStorageUsage = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE);
            let mergedHistory = cachedHistory;
            
            if (localStorageUsage && (localStorageUsage.used > 0 || localStorageUsage.storyUsed > 0)) {
                const today = getTodayDateString();
                const todayIndex = mergedHistory.findIndex(entry => entry.date === today);
                const todayEntry = {
                    date: today,
                    used: localStorageUsage.used || 0,
                    storyUsed: localStorageUsage.storyUsed || 0,
                    limit: localStorageUsage.limit || 0,
                    timestamp: new Date().toISOString()
                };
                
                if (todayIndex >= 0) {
                    mergedHistory[todayIndex] = todayEntry;
                } else {
                    mergedHistory.push(todayEntry);
                }
                
                mergedHistory = mergedHistory
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 365);
            }
            const stats = calculateUsageStats(mergedHistory);
            
            usageHistory.update(state => ({
                ...state,
                data: mergedHistory,
                stats,
                isCached: true,
                lastUpdate: historyTimestamp
            }));
            console.log('📦 [USER DATA] Usage history loaded from cache');
        }
    } catch (error) {
        console.warn('⚠️ [USER DATA] Failed to load from cache:', error);
    }

    // Fetch fresh data on page load (async, non-blocking)
    if (get(isLoggedIn)) {
        refreshUsageHistory(false).catch(error => {
            console.warn('⚠️ [USER DATA] Failed to refresh on init:', error);
        });
    }
}

// Export calculateUsageStats for external use (if needed)
export { calculateUsageStats };
