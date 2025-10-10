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
            // CRITICAL: Check if data is from today using lastReset (not date)
            // date might be formatted differently than lastReset
            const resetDate = stored.lastReset || stored.date;
            if (shouldResetUsage(resetDate)) {
                console.log(
                    '📅 Daily usage data expired (new day detected), returning null to trigger reset...'
                );
                return null;
            }
            console.log(
                '📦 Loaded daily usage from localStorage (same day):',
                stored
            );
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
 * IMPORTANT: This runs for ALL users (logged in AND guests)
 */
export async function initializeDailyUsage() {
    try {
        usageStatus.update(s => ({ ...s, isLoading: true }));

        const account = get(currentAccount);
        const tier = get(accountTier) || 'free'; // Default to 'free' if not set
        const loggedIn = get(isLoggedIn) || false; // Default to false if not set

        console.log('🔄 Initializing daily usage for ALL users...', {
            loggedIn,
            tier,
            hasAccount: !!account,
            userId: account?.userId
        });

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

        // Priority 3: Create default usage (first time or expired)
        if (!usageData) {
            const limit = getDailyLimitForUser(loggedIn, tier);
            usageData = {
                date: getTodayDateString(),
                used: 0,
                limit: limit,
                lastReset: getTodayDateString()
            };
            console.log(
                '✅ Daily usage initialized with defaults (first time):',
                usageData
            );

            // Save to localStorage immediately
            saveUsageToLocalStorage(usageData);

            // Save to API if logged in
            if (loggedIn && account?.userId) {
                await saveUsageToAPI(account, usageData).catch(error => {
                    console.warn(
                        '⚠️ Failed to save initial usage to API:',
                        error
                    );
                });
            }
        }

        // CRITICAL: Always check if limit needs updating based on current tier
        // This handles tier changes (guest → free → pro)
        const correctLimit = getDailyLimitForUser(loggedIn, tier);
        if (usageData.limit !== correctLimit) {
            console.log(
                `🔄 Updating limit for tier change: ${usageData.limit} → ${correctLimit}`
            );
            usageData.limit = correctLimit;
            saveUsageToLocalStorage(usageData);
        }

        // Check if reset is needed (new day detected)
        if (shouldResetUsage(usageData.lastReset || usageData.date)) {
            const limit = getDailyLimitForUser(loggedIn, tier);
            usageData = {
                date: getTodayDateString(),
                used: 0,
                limit: limit,
                lastReset: getTodayDateString()
            };
            console.log('🔄 Daily usage reset for new day:', usageData);

            // Save reset to localStorage AND API
            saveUsageToLocalStorage(usageData);
            if (loggedIn && account?.userId) {
                await saveUsageToAPI(account, usageData).catch(error => {
                    console.warn('⚠️ Failed to save reset to API:', error);
                });
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
 * Save usage to history (for charts)
 * Keeps last 365 days in metadata.usageHistory
 */
async function saveToUsageHistory(account, usageData) {
    try {
        // Get existing history from account
        const existingHistory = account?.metadata?.usageHistory || [];

        // Add or update today's entry
        const today = getTodayDateString();
        const existingIndex = existingHistory.findIndex(
            entry => entry.date === today
        );

        const newEntry = {
            date: today,
            used: usageData.used,
            limit: usageData.limit,
            timestamp: new Date().toISOString()
        };

        let updatedHistory;
        if (existingIndex >= 0) {
            // Update existing entry
            updatedHistory = [...existingHistory];
            updatedHistory[existingIndex] = newEntry;
        } else {
            // Add new entry
            updatedHistory = [...existingHistory, newEntry];
        }

        // Keep only last 365 days
        updatedHistory = updatedHistory
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 365);

        console.log(
            '📊 Updated usage history:',
            updatedHistory.length,
            'entries'
        );

        return updatedHistory;
    } catch (error) {
        console.warn('⚠️ Failed to update usage history:', error);
        return account?.metadata?.usageHistory || [];
    }
}

/**
 * Increment usage counter (called after successful generation)
 * CRITICAL: This MUST persist the increment to survive page reloads
 */
export async function incrementDailyUsage() {
    try {
        usageStatus.update(s => ({ ...s, isSaving: true }));

        const account = get(currentAccount);
        const tier = get(accountTier) || 'free';
        const loggedIn = get(isLoggedIn) || false;
        const currentLimit = get(dailyLimit);

        // CRITICAL: Validate we're not exceeding limit
        if (currentLimit.used >= currentLimit.limit) {
            console.error(
                '❌ Cannot increment: Daily limit already reached!',
                currentLimit
            );
            usageStatus.update(s => ({ ...s, isSaving: false }));
            throw new Error('Daily limit reached');
        }

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

        console.log('➕ Incrementing daily usage:', {
            before: currentLimit,
            after: usageData
        });

        // CRITICAL: Update in THIS order for data integrity:
        // 1. Update store immediately (optimistic update for UX)
        updateDailyLimitStore(usageData);

        // 2. Save to localStorage (MUST succeed for persistence)
        saveUsageToLocalStorage(usageData);

        // 3. Verify localStorage write succeeded
        const verification = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE);
        if (!verification || verification.used !== newUsed) {
            console.error(
                '❌ CRITICAL: localStorage write failed! Attempting retry...'
            );
            saveUsageToLocalStorage(usageData);

            // Verify retry
            const retryVerification = storageHelpers.get(
                STORAGE_KEYS.DAILY_USAGE
            );
            if (!retryVerification || retryVerification.used !== newUsed) {
                console.error('❌ CRITICAL: localStorage retry also failed!');
                throw new Error(
                    'Failed to persist usage increment to localStorage'
                );
            }
        } else {
            console.log('✅ localStorage write verified:', verification);
        }

        // 4. Save to API if logged in (background, non-blocking)
        if (loggedIn && account?.userId) {
            // Fire and forget - API is secondary to localStorage
            saveUsageToAPI(account, usageData).catch(error => {
                console.warn(
                    '⚠️ API save failed (non-critical, localStorage is up-to-date):',
                    error
                );
            });
        }

        usageStatus.update(s => ({
            ...s,
            isSaving: false,
            lastSync: new Date().toISOString()
        }));

        console.log(
            '✅ Daily usage incremented and persisted successfully:',
            usageData
        );
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

        // Update usage history
        const updatedHistory = await saveToUsageHistory(account, usageData);

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
                    usageHistory: updatedHistory, // History for charts (last 365 days)
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
