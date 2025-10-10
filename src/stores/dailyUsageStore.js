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
import {
    cachedFetchAccount,
    invalidateCachePattern
} from '../utils/apiCache.js';

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

            // 🔧 MIGRATION: Auto-fix old limit values (v0.5.7+)
            // Old limits: GUEST: 3, PRO: 25
            // New limits: GUEST: 5, PRO: 35
            const OLD_LIMITS = [3, 25]; // Old incorrect values
            if (OLD_LIMITS.includes(stored.limit)) {
                console.log(
                    '🔄 MIGRATION: Detected old limit value:',
                    stored.limit
                );

                // Determine correct new limit based on user state
                // We can't access stores here, so we estimate from the old limit
                let newLimit;
                if (stored.limit === 3) {
                    // Was GUEST (3) → now GUEST (5)
                    newLimit = 5;
                } else if (stored.limit === 25) {
                    // Was PRO (25) → now PRO (35)
                    newLimit = 35;
                }

                // Update stored data
                const migratedData = {
                    ...stored,
                    limit: newLimit
                };

                // Save migrated data back to localStorage
                storageHelpers.set(STORAGE_KEYS.DAILY_USAGE, migratedData);

                console.log(
                    '✅ MIGRATION: Limit updated:',
                    stored.limit,
                    '→',
                    newLimit
                );
                console.log(
                    '✅ MIGRATION: Migrated data saved to localStorage'
                );

                return migratedData;
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

        // Priority 1: ALWAYS load from localStorage FIRST (immediate, no async delay!)
        // This prevents race conditions and gives us instant data
        usageData = getUsageFromLocalStorage();
        if (usageData) {
            console.log(
                '✅ Daily usage loaded from localStorage (priority 1):',
                usageData
            );
            // Update store IMMEDIATELY for instant UI update
            updateDailyLimitStore(usageData);
        }

        // Priority 2: Load from API (if logged in) and MERGE/UPDATE
        // This updates the localStorage data with server truth
        if (loggedIn && account?.userId) {
            const apiUsageData = await loadUsageFromAPI(account);
            if (apiUsageData) {
                console.log(
                    '✅ Daily usage loaded from API (merging with localStorage):',
                    apiUsageData
                );
                // API data overrides localStorage
                usageData = apiUsageData;
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

        // CRITICAL: Only update limit if user is actually logged in!
        // Don't change limit during initial load before login is confirmed
        if (loggedIn && account?.userId) {
            const correctLimit = getDailyLimitForUser(loggedIn, tier);
            if (usageData.limit !== correctLimit) {
                console.log(
                    `🔄 Updating limit for tier change: ${usageData.limit} → ${correctLimit} (logged in as ${tier})`
                );
                usageData.limit = correctLimit;
                saveUsageToLocalStorage(usageData);
            }
        } else {
            console.log(
                `⏸️ Skipping limit update (not logged in yet): current=${
                    usageData.limit
                }, would be=${getDailyLimitForUser(loggedIn, tier)}`
            );
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

            // Update store IMMEDIATELY
            updateDailyLimitStore(usageData);

            // Save reset to localStorage AND API (async, non-blocking)
            saveUsageToLocalStorage(usageData);
            if (loggedIn && account?.userId) {
                saveUsageToAPI(account, usageData).catch(error => {
                    console.warn('⚠️ Failed to save reset to API:', error);
                });
            }
        } else {
            // Update store with current data
            updateDailyLimitStore(usageData);
            saveUsageToLocalStorage(usageData);
        }

        console.log('🎯 FINAL daily usage state:', {
            used: usageData.used,
            limit: usageData.limit,
            remaining: usageData.limit - usageData.used,
            date: usageData.date
        });

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
        console.log(
            '📡 Loading daily usage from API (cached):',
            account.userId
        );

        // LOCALHOST FIX: Try direct n8n if Vercel not available
        const isLocalhost =
            isDevelopment() &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1');

        let result;

        if (isLocalhost) {
            console.log('💡 [LOCALHOST] Fetching from n8n directly...');
            try {
                const n8nResponse = await fetch(
                    'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'get',
                            userId: account.userId,
                            email: account.email
                        })
                    }
                );

                if (n8nResponse.ok) {
                    result = await n8nResponse.json();
                    console.log('✅ [LOCALHOST] Loaded from n8n');
                } else {
                    return null;
                }
            } catch (error) {
                console.warn('⚠️ [LOCALHOST] n8n fetch failed:', error);
                return null;
            }
        } else {
            // Use cached fetch - prevents 429 errors!
            result = await cachedFetchAccount(
                account.userId,
                account.email,
                'read'
            );
        }

        if (result.success && result.account) {
            // Extract usage from profile.dailyUsage (primary) or metadata.dailyUsage (fallback)
            const dailyUsage =
                result.account.profile?.dailyUsage ||
                result.account.metadata?.dailyUsage;

            if (dailyUsage && typeof dailyUsage === 'object') {
                console.log('✅ Daily usage from API (cached):', dailyUsage);
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
        console.log('📡 Saving daily usage to API:', usageData);

        // CRITICAL: Get FRESH metadata from localStorage (not from account store!)
        const currentPrefs = storageHelpers.get(
            STORAGE_KEYS.USER_PREFERENCES,
            {}
        );
        const freshMetadata = currentPrefs.metadata || account?.metadata || {};

        // Update account with fresh metadata
        const freshAccount = {
            ...account,
            metadata: freshMetadata
        };

        // Update usage history with FRESH data
        const updatedHistory = await saveToUsageHistory(
            freshAccount,
            usageData
        );

        // LOCALHOST FIX: Use direct n8n call if Vercel API not available
        const isLocalhost =
            isDevelopment() &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1');

        // CRITICAL: Use SAME webhook URL for consistency!
        let apiUrl = isLocalhost
            ? 'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account' // Direct n8n for localhost
            : WEBHOOKS.ACCOUNT.UPDATE; // Vercel proxy for production

        if (isLocalhost) {
            console.log(
                '💡 [LOCALHOST] Using direct n8n webhook for usage tracking'
            );
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'update', // Required for n8n
                userId: account.userId,
                email: account.email,
                profile: {
                    ...(account.profile || {}),
                    dailyUsage: usageData // ALSO save in profile for easy access
                },
                metadata: {
                    ...freshMetadata, // ← Use FRESH metadata from localStorage!
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

        // MODERN SYNC PATTERN: Sync backend response back to local stores!
        if (result.success && result.account) {
            console.log(
                '🔄 [SYNC] Syncing backend response to local stores...'
            );

            try {
                // Parse response (might be strings from n8n!)
                const parsedAccount =
                    typeof result.account === 'string'
                        ? JSON.parse(result.account)
                        : result.account;

                const parsedMetadata =
                    typeof parsedAccount.metadata === 'string'
                        ? JSON.parse(parsedAccount.metadata)
                        : parsedAccount.metadata || {};

                console.log(
                    '📊 [SYNC] Backend returned usageHistory:',
                    parsedMetadata.usageHistory?.length || 0,
                    'entries'
                );

                // Update localStorage
                const updatedPrefs = {
                    ...currentPrefs,
                    metadata: parsedMetadata,
                    lastActivity: new Date().toISOString()
                };
                storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
                console.log('✅ [SYNC] localStorage updated');

                // Update usageHistory store
                const { usageHistory: usageHistoryStore } = await import(
                    './userDataStore.js'
                );
                if (
                    parsedMetadata.usageHistory &&
                    Array.isArray(parsedMetadata.usageHistory)
                ) {
                    usageHistoryStore.update(state => ({
                        ...state,
                        data: parsedMetadata.usageHistory,
                        lastUpdate: Date.now(),
                        isCached: false
                    }));
                    console.log('✅ [SYNC] usageHistory store updated');
                }

                // Update currentAccount store
                const { syncAccountData } = await import('./accountStore.js');
                syncAccountData({
                    ...account,
                    metadata: parsedMetadata
                });
                console.log('✅ [SYNC] currentAccount store updated');
            } catch (syncError) {
                console.warn(
                    '⚠️ [SYNC] Failed to sync backend response (non-critical):',
                    syncError
                );
            }
        }

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
