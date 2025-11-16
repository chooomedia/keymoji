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
/**
 * Initialize daily usage - OPTIMIZED: Accepts accountData to prevent duplicate API calls
 * @param {Object} accountData - Optional account data from verifyMagicLinkFrontend (prevents duplicate API calls)
 */
export async function initializeDailyUsage(accountData = null) {
    try {
        usageStatus.update(s => ({ ...s, isLoading: true }));

        const account = accountData || get(currentAccount);
        const tier = accountData?.tier || get(accountTier) || 'free'; // Default to 'free' if not set
        const loggedIn = !!accountData || get(isLoggedIn) || false; // Default to false if not set

        console.log('🔄 Initializing daily usage for ALL users...', {
            loggedIn,
            tier,
            hasAccount: !!account,
            hasAccountData: !!accountData,
            hasDailyUsageInAccountData: !!accountData?.dailyUsage,
            userId: account?.userId
        });

        let usageData = null;

        // Priority 1: Use dailyUsage from accountData if available (prevents duplicate API call!)
        // This is the MOST IMPORTANT optimization - accountData comes from verifyMagicLinkFrontend
        if (accountData?.dailyUsage) {
            const accountDailyUsage = accountData.dailyUsage;
            // Parse if string (from n8n/Google Sheets)
            if (typeof accountDailyUsage === 'string') {
                try {
                    usageData = JSON.parse(accountDailyUsage);
                } catch (e) {
                    console.warn(
                        '⚠️ Failed to parse dailyUsage from accountData:',
                        e
                    );
                }
            } else if (
                typeof accountDailyUsage === 'object' &&
                accountDailyUsage.date
            ) {
                usageData = accountDailyUsage;
            }

            if (usageData) {
                console.log(
                    '✅ Daily usage loaded from accountData (priority 1 - prevents duplicate API call!):',
                    usageData
                );
                // Update store IMMEDIATELY for instant UI update
                updateDailyLimitStore(usageData);
                // Save to localStorage for future use
                saveUsageToLocalStorage(usageData);
            }
        }

        // Priority 2: ALWAYS load from localStorage SECOND (immediate, no async delay!)
        // This prevents race conditions and gives us instant data
        if (!usageData) {
            usageData = getUsageFromLocalStorage();
            if (usageData) {
                console.log(
                    '✅ Daily usage loaded from localStorage (priority 2):',
                    usageData
                );
                // Update store IMMEDIATELY for instant UI update
                updateDailyLimitStore(usageData);
            }
        }

        // Priority 3: Load from API ONLY if not already loaded from accountData (prevents duplicate API call!)
        // This updates the localStorage data with server truth
        if (!usageData && loggedIn && account?.userId) {
            console.log(
                '📡 Loading daily usage from API (accountData had no dailyUsage)...'
            );
            const apiUsageData = await loadUsageFromAPI(account);
            if (apiUsageData) {
                console.log(
                    '✅ Daily usage loaded from API (merging with localStorage):',
                    apiUsageData
                );
                // API data overrides localStorage
                usageData = apiUsageData;
            }
        } else if (usageData && accountData?.dailyUsage) {
            console.log(
                '⏭️ Skipping API call - dailyUsage already loaded from accountData (prevents duplicate!)'
            );
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
                storyUsed: 0, // Reset story usage too
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

        // CRITICAL: Always use the LATEST values from dailyLimit store to ensure both used AND storyUsed are preserved
        // This ensures that if story was created first, then random, both values are preserved
        const currentLimit = get(dailyLimit);
        const latestUsageData = {
            used: currentLimit.used || usageData.used || 0,
            storyUsed: currentLimit.storyUsed || usageData.storyUsed || 0,
            limit: usageData.limit || currentLimit.limit || 0
        };

        let mergedEntry;
        if (existingIndex >= 0) {
            const existingEntry = existingHistory[existingIndex];
            // Merge: Keep the HIGHER value for each field (preserves both increments)
            // This handles edge cases where API might have stale data
            mergedEntry = {
                date: today,
                used: Math.max(existingEntry.used || 0, latestUsageData.used),
                storyUsed: Math.max(
                    existingEntry.storyUsed || 0,
                    latestUsageData.storyUsed
                ),
                limit: latestUsageData.limit || existingEntry.limit || 0,
                timestamp: new Date().toISOString()
            };
            console.log('🔄 [HISTORY] Merging existing entry:', {
                existing: existingEntry,
                fromStore: currentLimit,
                fromUsageData: usageData,
                merged: mergedEntry
            });
        } else {
            // New entry - use latest values from store
            mergedEntry = {
                date: today,
                used: latestUsageData.used,
                storyUsed: latestUsageData.storyUsed,
                limit: latestUsageData.limit,
                timestamp: new Date().toISOString()
            };
        }

        let updatedHistory;
        if (existingIndex >= 0) {
            // Update existing entry with merged values
            updatedHistory = [...existingHistory];
            updatedHistory[existingIndex] = mergedEntry;
        } else {
            // Add new entry
            updatedHistory = [...existingHistory, mergedEntry];
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
 * @param {boolean} isStoryMode - If true, increments story usage instead of random usage
 */
export async function incrementDailyUsage(isStoryMode = false) {
    try {
        usageStatus.update(s => ({ ...s, isSaving: true }));

        const account = get(currentAccount);
        const tier = get(accountTier) || 'free';
        const loggedIn = get(isLoggedIn) || false;
        const currentLimit = get(dailyLimit);

        // CRITICAL: Validate we're not exceeding limit (only for random emoji, story has separate tracking)
        if (!isStoryMode && currentLimit.used >= currentLimit.limit) {
            console.error(
                '❌ Cannot increment: Daily limit already reached!',
                currentLimit
            );
            usageStatus.update(s => ({ ...s, isSaving: false }));
            throw new Error('Daily limit reached');
        }

        // Calculate new usage (separate tracking for random vs story)
        let newUsed = currentLimit.used;
        let newStoryUsed = currentLimit.storyUsed || 0;

        if (isStoryMode) {
            newStoryUsed = newStoryUsed + 1;
        } else {
            newUsed = newUsed + 1;
        }

        const limit = getDailyLimitForUser(loggedIn, tier);

        const usageData = {
            date: getTodayDateString(),
            used: newUsed,
            storyUsed: newStoryUsed,
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
            // NEW STRUCTURE: Priority order for loading dailyUsage
            // Priority 1: Own column dailyUsage (NEW structure - preferred!)
            let dailyUsage = result.account.dailyUsage;

            if (dailyUsage) {
                console.log(
                    '✅ [NEW STRUCTURE] Loading dailyUsage from separate column'
                );
            } else {
                // Priority 2: Fallback to profile.dailyUsage (backward compatibility - deprecated)
                if (result.account.profile?.dailyUsage) {
                    dailyUsage = result.account.profile.dailyUsage;
                    console.warn(
                        '⚠️ [DEPRECATED] Loading dailyUsage from profile (should be in own column)'
                    );
                }

                // Priority 3: Fallback to metadata.dailyUsage (migration support - deprecated)
                if (!dailyUsage && result.account.metadata?.dailyUsage) {
                    dailyUsage = result.account.metadata.dailyUsage;
                    console.warn(
                        '⚠️ [DEPRECATED] Loading dailyUsage from metadata (should be migrated to own column)'
                    );
                }
            }

            // Parse if string (from Google Sheets JSON column)
            if (typeof dailyUsage === 'string') {
                try {
                    dailyUsage = JSON.parse(dailyUsage);
                } catch (e) {
                    console.warn('⚠️ Failed to parse dailyUsage:', e);
                    dailyUsage = null;
                }
            }

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

        // CRITICAL: Update usage history FIRST (before building metadata!)
        // This ensures updatedHistory is available when building metadataToSend
        const freshAccount = {
            ...account,
            metadata: freshMetadata
        };

        // Update usage history with FRESH data
        const updatedHistory = await saveToUsageHistory(
            freshAccount,
            usageData
        );

        // CRITICAL: Clean metadata to remove duplicate fields (fields with own columns!)
        // Single Source of Truth: Fields with own columns should NOT be in metadata
        // Import metadata cleaner
        const { prepareMetadataForAPI, validateMetadataNoDuplicates } =
            await import('../utils/metadataCleaner.js');

        // Build metadata to send (will be cleaned)
        const metadataToSend = {
            ...freshMetadata,
            usageHistory: updatedHistory, // History for charts (last 365 days)
            lastActivity: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            updatedVia: 'daily-usage-tracking'
        };

        // CRITICAL: Clean metadata to remove duplicate fields (dailyUsage, createdAt, profile, tier, etc.)
        // These fields have their own columns and should NOT be in metadata!
        const cleanedMetadata = prepareMetadataForAPI(metadataToSend, {
            source: 'saveUsageToAPI'
        });

        // Validate (warns in dev if duplicates found)
        validateMetadataNoDuplicates(cleanedMetadata, 'saveUsageToAPI');

        // LOCALHOST FIX: Use direct n8n call if Vercel API not available
        const isLocalhost =
            isDevelopment() &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1');

        // CRITICAL: Use SAME webhook URL for consistency!
        let apiUrl = isLocalhost
            ? WEBHOOKS.ACCOUNT.UPDATE_DIRECT ||
              'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account-update' // Direct n8n for localhost
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
                // NEW: dailyUsage in eigene Spalte (vor metadata!)
                dailyUsage: usageData, // ← NEU: Eigene Spalte in Google Sheets
                // TODO: dailyExecutions wird später hinzugefügt
                // dailyExecutions: {
                //     date: getTodayDateString(),
                //     randomExecutions: 0,
                //     storyExecutions: 0,
                //     lastReset: getTodayDateString()
                // },
                profile: {
                    ...(account.profile || {})
                    // REMOVED: dailyUsage from profile (now in own column)
                },
                metadata: cleanedMetadata, // Clean metadata without duplicates!
                lastLogin: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorText = await response
                .text()
                .catch(() => 'Unknown error');
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        // Handle empty response (n8n might return empty response)
        const responseText = await response.text();
        let result;

        if (!responseText || responseText.trim().length === 0) {
            console.log(
                '⚠️ [API] Empty response from n8n (non-critical, usage saved)'
            );
            // Return success object even if response is empty
            // The important part is that the request succeeded (status 200)
            result = {
                success: true,
                message: 'Usage saved successfully (empty response)'
            };
        } else {
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.warn(
                    '⚠️ [API] Failed to parse JSON response:',
                    parseError
                );
                console.warn(
                    '⚠️ [API] Response text:',
                    responseText.substring(0, 200)
                );
                // Return success object even if JSON parsing fails
                // The important part is that the request succeeded (status 200)
                result = {
                    success: true,
                    message: 'Usage saved successfully (invalid JSON response)',
                    rawResponse: responseText.substring(0, 200)
                };
            }
        }

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

                // CRITICAL: Parse dailyUsage from response (separate column!)
                let parsedDailyUsage = null;
                if (parsedAccount.dailyUsage) {
                    if (typeof parsedAccount.dailyUsage === 'string') {
                        try {
                            parsedDailyUsage = JSON.parse(
                                parsedAccount.dailyUsage
                            );
                        } catch (e) {
                            console.warn(
                                '⚠️ Failed to parse dailyUsage from response:',
                                e
                            );
                        }
                    } else if (typeof parsedAccount.dailyUsage === 'object') {
                        parsedDailyUsage = parsedAccount.dailyUsage;
                    }
                }

                console.log(
                    '📊 [SYNC] Backend returned usageHistory:',
                    parsedMetadata.usageHistory?.length || 0,
                    'entries'
                );
                if (parsedDailyUsage) {
                    console.log('✅ [SYNC] Backend returned dailyUsage:', {
                        date: parsedDailyUsage.date,
                        used: parsedDailyUsage.used,
                        limit: parsedDailyUsage.limit
                    });
                }

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

                // Update currentAccount store with dailyUsage
                const { syncAccountData } = await import('./accountStore.js');
                syncAccountData({
                    ...account,
                    metadata: parsedMetadata,
                    // CRITICAL: Include dailyUsage in account object!
                    dailyUsage: parsedDailyUsage || account.dailyUsage || null
                });
                console.log(
                    '✅ [SYNC] currentAccount store updated with dailyUsage'
                );
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
 * EXPORTED: Can be called from other stores to sync dailyUsage
 */
export function updateDailyLimitStore(usageData) {
    if (!usageData) {
        console.warn('⚠️ updateDailyLimitStore: No usageData provided');
        return;
    }

    dailyLimit.set({
        limit: usageData.limit || 0,
        used: usageData.used || 0,
        storyUsed: usageData.storyUsed || 0
    });
    console.log('✅ dailyLimit store updated:', {
        limit: usageData.limit,
        used: usageData.used,
        storyUsed: usageData.storyUsed || 0
    });
}

/**
 * Reset usage (for testing or admin)
 */
/**
 * Reset daily usage (DEV MODE ONLY!)
 * SECURITY: This function can ONLY be called in development mode.
 * Production users CANNOT reset their daily usage.
 */
export async function resetDailyUsage() {
    // SECURITY: Only allow in development mode
    if (!isDevelopment()) {
        console.error(
            '❌ [SECURITY] resetDailyUsage() is only available in development mode!'
        );
        throw new Error(
            'resetDailyUsage() is only available in development mode. Production users cannot reset their daily usage.'
        );
    }

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

    console.log('🔄 [DEV] Daily usage reset:', usageData);
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
