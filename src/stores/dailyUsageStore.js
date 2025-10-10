// src/stores/dailyUsageStore.js
// Zentrale Verwaltung der täglichen Usage Limits mit Datenbank-Persistenz

import { writable, derived, get } from 'svelte/store';
import {
    currentAccount,
    isLoggedIn,
    accountTier,
    dailyLimit
} from './appStores.js';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';
import { WEBHOOKS } from '../config/api.js';
import {
    getDailyLimitForUser,
    isLimitReached,
    getRemainingGenerations
} from '../config/limits.js';
import { isDevelopment } from '../utils/environment.js';

// === STORES ===

// Usage tracking state
export const usageStatus = writable({
    isLoading: false,
    isSaving: false,
    hasError: false,
    errorMessage: null,
    lastSync: null
});

// === HELPER FUNCTIONS ===

// Get current date in YYYY-MM-DD format (UTC)
function getTodayDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Check if usage data needs reset (new day)
function shouldResetUsage(lastResetDate) {
    const today = getTodayDateString();
    return !lastResetDate || lastResetDate !== today;
}

// Get usage from localStorage (fallback)
function getUsageFromLocalStorage() {
    try {
        const stored = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE);
        if (stored && typeof stored === 'object') {
            // Check if data is from today
            if (shouldResetUsage(stored.date)) {
                console.log('📅 Daily usage data expired, resetting...');
                return null;
            }
            console.log('📦 Loaded daily usage from localStorage:', stored);
            return stored;
        }
    } catch (error) {
        console.warn('⚠️ Failed to load usage from localStorage:', error);
    }
    return null;
}

// Save usage to localStorage (fallback)
function saveUsageToLocalStorage(usageData) {
    try {
        storageHelpers.set(STORAGE_KEYS.DAILY_USAGE, usageData);
        console.log('💾 Saved daily usage to localStorage:', usageData);
    } catch (error) {
        console.warn('⚠️ Failed to save usage to localStorage:', error);
    }
}

// === INITIALIZATION ===

/**
 * Initialize daily usage from multiple sources (Priority: API > localStorage > default)
 */
export async function initializeDailyUsage() {
    try {
        usageStatus.update(s => ({ ...s, isLoading: true }));

        const account = get(currentAccount);
        const tier = get(accountTier);
        const loggedIn = get(isLoggedIn);

        console.log('🔄 Initializing daily usage...', { loggedIn, tier });

        let usageData = null;

        // Priority 1: Load from API (if logged in)
        if (loggedIn && account?.userId) {
            usageData = await loadUsageFromAPI(account);
            if (usageData) {
                console.log('✅ Daily usage loaded from API:', usageData);
            }
        }

        // Priority 2: Load from localStorage (fallback)
        if (!usageData) {
            usageData = getUsageFromLocalStorage();
            if (usageData) {
                console.log(
                    '✅ Daily usage loaded from localStorage:',
                    usageData
                );
            }
        }

        // Priority 3: Create default usage
        if (!usageData) {
            const limit = getDailyLimitForUser(loggedIn, tier);
            usageData = {
                date: getTodayDateString(),
                used: 0,
                limit: limit,
                lastReset: getTodayDateString()
            };
            console.log('✅ Daily usage initialized with defaults:', usageData);
        }

        // Check if reset is needed (new day)
        if (shouldResetUsage(usageData.lastReset)) {
            const limit = getDailyLimitForUser(loggedIn, tier);
            usageData = {
                date: getTodayDateString(),
                used: 0,
                limit: limit,
                lastReset: getTodayDateString()
            };
            console.log('🔄 Daily usage reset for new day:', usageData);

            // Save reset to API if logged in
            if (loggedIn && account?.userId) {
                await saveUsageToAPI(account, usageData);
            }
        }

        // Update stores
        updateDailyLimitStore(usageData);
        saveUsageToLocalStorage(usageData);

        usageStatus.update(s => ({
            ...s,
            isLoading: false,
            lastSync: new Date().toISOString()
        }));

        return usageData;
    } catch (error) {
        console.error('❌ Failed to initialize daily usage:', error);
        usageStatus.update(s => ({
            ...s,
            isLoading: false,
            hasError: true,
            errorMessage: error.message
        }));
        throw error;
    }
}

/**
 * Increment usage counter (called after successful generation)
 */
export async function incrementDailyUsage() {
    try {
        usageStatus.update(s => ({ ...s, isSaving: true }));

        const account = get(currentAccount);
        const tier = get(accountTier);
        const loggedIn = get(isLoggedIn);
        const currentLimit = get(dailyLimit);

        // Calculate new usage
        const newUsed = currentLimit.used + 1;
        const limit = getDailyLimitForUser(loggedIn, tier);

        const usageData = {
            date: getTodayDateString(),
            used: newUsed,
            limit: limit,
            lastReset: getTodayDateString(),
            lastIncrement: new Date().toISOString()
        };

        console.log('➕ Incrementing daily usage:', usageData);

        // Update stores immediately (optimistic update)
        updateDailyLimitStore(usageData);
        saveUsageToLocalStorage(usageData);

        // Save to API if logged in (background)
        if (loggedIn && account?.userId) {
            // Don't await - fire and forget
            saveUsageToAPI(account, usageData).catch(error => {
                console.warn(
                    '⚠️ Failed to save usage to API (background):',
                    error
                );
                // Rollback on error?
            });
        }

        usageStatus.update(s => ({
            ...s,
            isSaving: false,
            lastSync: new Date().toISOString()
        }));

        return usageData;
    } catch (error) {
        console.error('❌ Failed to increment daily usage:', error);
        usageStatus.update(s => ({
            ...s,
            isSaving: false,
            hasError: true,
            errorMessage: error.message
        }));
        throw error;
    }
}

/**
 * Load usage from API
 */
async function loadUsageFromAPI(account) {
    try {
        // Skip API calls on localhost for now (CORS)
        if (isDevelopment() && window.location.hostname === 'localhost') {
            console.log('⚠️ Skipping API call on localhost (CORS)');
            return null;
        }

        console.log('📡 Loading daily usage from API for:', account.userId);

        const response = await fetch(WEBHOOKS.ACCOUNT.READ, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'read',
                userId: account.userId,
                email: account.email
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.account) {
            // Extract usage from profile.dailyUsage (primary) or metadata.dailyUsage (fallback)
            const dailyUsage =
                result.account.profile?.dailyUsage ||
                result.account.metadata?.dailyUsage;

            if (dailyUsage && typeof dailyUsage === 'object') {
                console.log('✅ Daily usage from API:', dailyUsage);
                return dailyUsage;
            }
        }

        return null;
    } catch (error) {
        console.warn('⚠️ Failed to load usage from API:', error);
        return null;
    }
}

/**
 * Save usage to API
 */
async function saveUsageToAPI(account, usageData) {
    try {
        // Skip API calls on localhost for now (CORS)
        if (isDevelopment() && window.location.hostname === 'localhost') {
            console.log('⚠️ Skipping API call on localhost (CORS)');
            return;
        }

        console.log('📡 Saving daily usage to API:', usageData);

        const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                userId: account.userId,
                email: account.email,
                profile: {
                    ...(account.profile || {}),
                    dailyUsage: usageData // ALSO save in profile for easy access
                },
                metadata: {
                    ...(account.metadata || {}),
                    dailyUsage: usageData, // Keep in metadata for backward compatibility
                    lastActivity: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    updatedVia: 'daily-usage-tracking'
                },
                lastLogin: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Daily usage saved to API:', result);

        return result;
    } catch (error) {
        console.error('❌ Failed to save usage to API:', error);
        throw error;
    }
}

/**
 * Update the dailyLimit store (from appStores.js)
 */
function updateDailyLimitStore(usageData) {
    dailyLimit.set({
        limit: usageData.limit,
        used: usageData.used
    });
    console.log('✅ dailyLimit store updated:', usageData);
}

/**
 * Reset usage (for testing or admin)
 */
export async function resetDailyUsage() {
    const account = get(currentAccount);
    const tier = get(accountTier);
    const loggedIn = get(isLoggedIn);
    const limit = getDailyLimitForUser(loggedIn, tier);

    const usageData = {
        date: getTodayDateString(),
        used: 0,
        limit: limit,
        lastReset: getTodayDateString()
    };

    updateDailyLimitStore(usageData);
    saveUsageToLocalStorage(usageData);

    if (loggedIn && account?.userId) {
        await saveUsageToAPI(account, usageData);
    }

    console.log('🔄 Daily usage reset:', usageData);
    return usageData;
}

// === DERIVED STORES ===

// Check if limit is reached
export const isLimitReachedStore = derived(dailyLimit, $dailyLimit =>
    isLimitReached($dailyLimit.used, $dailyLimit.limit)
);

// Get remaining generations
export const remainingGenerations = derived(dailyLimit, $dailyLimit =>
    getRemainingGenerations($dailyLimit.used, $dailyLimit.limit)
);
