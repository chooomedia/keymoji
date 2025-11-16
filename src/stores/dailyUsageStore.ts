// src/stores/dailyUsageStore.ts
// Zentrale Verwaltung der täglichen Usage Limits mit Datenbank-Persistenz
// TypeScript Migration: v0.7.7
import { writable, derived, get } from 'svelte/store';
import {
    currentAccount,
    isLoggedIn,
    accountTier,
    dailyLimit
} from './appStores.ts';
import { storageHelpers, STORAGE_KEYS } from '../config/storage';
import { WEBHOOKS } from '../config/api';
import {
    getDailyLimitForUser,
    isLimitReached,
    getRemainingGenerations
} from '../config/limits';
import { isDevelopment } from '../utils/environment';
import { cachedFetchAccount, invalidateCachePattern } from '../utils/apiCache';
import type { Account } from '../types/Account';

export interface UsageStatus {
    isLoading: boolean;
    isSaving: boolean;
    hasError: boolean;
    errorMessage: string | null;
    lastSync: string | null;
}

export interface DailyUsageData {
    date: string;
    used: number;
    storyUsed?: number;
    limit: number;
    lastReset: string;
    lastIncrement?: string;
    [key: string]: unknown;
}

export interface UsageHistoryEntry {
    date: string;
    used: number;
    storyUsed?: number;
    limit?: number;
    timestamp?: string;
    [key: string]: unknown;
}

export interface DailyLimitState {
    limit: number;
    used: number;
    storyUsed?: number;
}

export const usageStatus = writable<UsageStatus>({
    isLoading: false,
    isSaving: false,
    hasError: false,
    errorMessage: null,
    lastSync: null
});

function getTodayDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

function shouldResetUsage(lastResetDate: string | null | undefined): boolean {
    const today = getTodayDateString();
    return !lastResetDate || lastResetDate !== today;
}

function getUsageFromLocalStorage(): DailyUsageData | null {
    try {
        const stored = storageHelpers.get<DailyUsageData>(
            STORAGE_KEYS.DAILY_USAGE
        );
        if (stored && typeof stored === 'object') {
            const resetDate = stored.lastReset || stored.date;
            if (shouldResetUsage(resetDate)) {
                console.log(
                    '📅 Daily usage data expired (new day detected), returning null to trigger reset...'
                );
                return null;
            }

            const OLD_LIMITS = [3, 25]; // Old incorrect values
            if (stored.limit && OLD_LIMITS.includes(stored.limit)) {
                console.log(
                    '🔄 MIGRATION: Detected old limit value:',
                    stored.limit
                );

                let newLimit: number;
                if (stored.limit === 3) {
                    newLimit = 5;
                } else if (stored.limit === 25) {
                    newLimit = 35;
                } else {
                    newLimit = stored.limit;
                }

                const migratedData: DailyUsageData = {
                    ...stored,
                    limit: newLimit
                };

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
    } catch (error: unknown) {
        console.warn('⚠️ Failed to load usage from localStorage:', error);
    }
    return null;
}

function saveUsageToLocalStorage(usageData: DailyUsageData): void {
    try {
        storageHelpers.set(STORAGE_KEYS.DAILY_USAGE, usageData);
        console.log('💾 Saved daily usage to localStorage:', usageData);
    } catch (error: unknown) {
        console.warn('⚠️ Failed to save usage to localStorage:', error);
    }
}

/**
 * Initialize daily usage from multiple sources (Priority: API > localStorage > default)
 * IMPORTANT: This runs for ALL users (logged in AND guests)
 */
/**
 * Initialize daily usage - OPTIMIZED: Accepts accountData to prevent duplicate API calls
 * @param accountData - Optional account data from verifyMagicLinkFrontend (prevents duplicate API calls)
 */
export async function initializeDailyUsage(
    accountData: Account | null = null
): Promise<DailyUsageData> {
    try {
        usageStatus.isLoading = true;

        const account = accountData || currentAccount;
        const tier = accountData?.tier || accountTier || 'free';
        const loggedIn = !!accountData || isLoggedIn || false;

        console.log('🔄 Initializing daily usage for ALL users...', {
            loggedIn,
            tier,
            hasAccount: !!account,
            hasAccountData: !!accountData,
            hasDailyUsageInAccountData: !!accountData?.dailyUsage,
            userId: account?.userId
        });

        let usageData: DailyUsageData | null = null;

        if (accountData?.dailyUsage) {
            const accountDailyUsage = accountData.dailyUsage;
            if (typeof accountDailyUsage === 'string') {
                try {
                    usageData = JSON.parse(accountDailyUsage) as DailyUsageData;
                } catch (e) {
                    console.warn(
                        '⚠️ Failed to parse dailyUsage from accountData:',
                        e
                    );
                }
            } else if (
                typeof accountDailyUsage === 'object' &&
                accountDailyUsage !== null &&
                'date' in accountDailyUsage
            ) {
                usageData = accountDailyUsage as DailyUsageData;
            }

            if (usageData) {
                console.log(
                    '✅ Daily usage loaded from accountData (priority 1 - prevents duplicate API call!):',
                    usageData
                );
                updateDailyLimitStore(usageData);
                saveUsageToLocalStorage(usageData);
            }
        }

        if (!usageData) {
            usageData = getUsageFromLocalStorage();
            if (usageData) {
                console.log(
                    '✅ Daily usage loaded from localStorage (priority 2):',
                    usageData
                );
                updateDailyLimitStore(usageData);
            }
        }

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
                usageData = apiUsageData;
            }
        } else if (usageData && accountData?.dailyUsage) {
            console.log(
                '⏭️ Skipping API call - dailyUsage already loaded from accountData (prevents duplicate!)'
            );
        }

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

            saveUsageToLocalStorage(usageData);

            if (loggedIn && account?.userId) {
                await saveUsageToAPI(account, usageData).catch(
                    (error: unknown) => {
                        console.warn(
                            '⚠️ Failed to save initial usage to API:',
                            error
                        );
                    }
                );
            }
        }

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

            updateDailyLimitStore(usageData);

            saveUsageToLocalStorage(usageData);
            if (loggedIn && account?.userId) {
                saveUsageToAPI(account, usageData).catch((error: unknown) => {
                    console.warn('⚠️ Failed to save reset to API:', error);
                });
            }
        } else {
            updateDailyLimitStore(usageData);
            saveUsageToLocalStorage(usageData);
        }

        console.log('🎯 FINAL daily usage state:', {
            used: usageData.used,
            limit: usageData.limit,
            remaining: usageData.limit - usageData.used,
            date: usageData.date
        });

        usageStatus.isLoading = false;
        usageStatus.lastSync = new Date().toISOString();

        return usageData;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error('❌ Failed to initialize daily usage:', error);
        usageStatus.isLoading = false;
        usageStatus.hasError = true;
        usageStatus.errorMessage = errorMessage;
        throw error;
    }
}

/**
 * Save usage to history (for charts)
 * Keeps last 365 days in metadata.usageHistory
 */
async function saveToUsageHistory(
    account: Account,
    usageData: DailyUsageData
): Promise<UsageHistoryEntry[]> {
    try {
        const metadata =
            account.metadata && typeof account.metadata === 'object'
                ? (account.metadata as Record<string, unknown>)
                : {};
        const existingHistory =
            (metadata.usageHistory as UsageHistoryEntry[]) || [];

        const today = getTodayDateString();
        const existingIndex = existingHistory.findIndex(
            entry => entry.date === today
        );

        const currentLimit = get(dailyLimit) as DailyLimitState;
        const latestUsageData = {
            used: currentLimit.used || usageData.used || 0,
            storyUsed: currentLimit.storyUsed || usageData.storyUsed || 0,
            limit: usageData.limit || currentLimit.limit || 0
        };

        let mergedEntry: UsageHistoryEntry;
        if (existingIndex >= 0) {
            const existingEntry = existingHistory[existingIndex];
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
            mergedEntry = {
                date: today,
                used: latestUsageData.used,
                storyUsed: latestUsageData.storyUsed,
                limit: latestUsageData.limit,
                timestamp: new Date().toISOString()
            };
        }

        let updatedHistory: UsageHistoryEntry[];
        if (existingIndex >= 0) {
            updatedHistory = [...existingHistory];
            updatedHistory[existingIndex] = mergedEntry;
        } else {
            updatedHistory = [...existingHistory, mergedEntry];
        }

        updatedHistory = updatedHistory
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 365);

        console.log(
            '📊 Updated usage history:',
            updatedHistory.length,
            'entries'
        );

        return updatedHistory;
    } catch (error: unknown) {
        console.warn('⚠️ Failed to update usage history:', error);
        const metadata =
            account.metadata && typeof account.metadata === 'object'
                ? (account.metadata as Record<string, unknown>)
                : {};
        return (metadata.usageHistory as UsageHistoryEntry[]) || [];
    }
}

/**
 * Increment usage counter (called after successful generation)
 * CRITICAL: This MUST persist the increment to survive page reloads
 * @param isStoryMode - If true, increments story usage instead of random usage
 */
export async function incrementDailyUsage(
    isStoryMode: boolean = false
): Promise<DailyUsageData> {
    try {
        usageStatus.isSaving = true;

        const account = currentAccount;
        const tier = accountTier || 'free';
        const loggedIn = isLoggedIn || false;
        const currentLimit = dailyLimit as DailyLimitState;

        if (!isStoryMode && currentLimit.used >= currentLimit.limit) {
            console.error(
                '❌ Cannot increment: Daily limit already reached!',
                currentLimit
            );
            usageStatus.isSaving = false;
            throw new Error('Daily limit reached');
        }

        let newUsed = currentLimit.used;
        let newStoryUsed = currentLimit.storyUsed || 0;

        if (isStoryMode) {
            newStoryUsed = newStoryUsed + 1;
        } else {
            newUsed = newUsed + 1;
        }

        const limit = getDailyLimitForUser(loggedIn, tier);

        const usageData: DailyUsageData = {
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

        updateDailyLimitStore(usageData);

        saveUsageToLocalStorage(usageData);

        const verification = storageHelpers.get<DailyUsageData>(
            STORAGE_KEYS.DAILY_USAGE
        );
        if (!verification || verification.used !== newUsed) {
            console.error(
                '❌ CRITICAL: localStorage write failed! Attempting retry...'
            );
            saveUsageToLocalStorage(usageData);

            const retryVerification = storageHelpers.get<DailyUsageData>(
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

        if (loggedIn && account?.userId) {
            saveUsageToAPI(account, usageData).catch((error: unknown) => {
                console.warn(
                    '⚠️ API save failed (non-critical, localStorage is up-to-date):',
                    error
                );
            });
        }

        usageStatus.isSaving = false;
        usageStatus.lastSync = new Date().toISOString();

        console.log(
            '✅ Daily usage incremented and persisted successfully:',
            usageData
        );
        return usageData;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error('❌ Failed to increment daily usage:', error);
        usageStatus.isSaving = false;
        usageStatus.hasError = true;
        usageStatus.errorMessage = errorMessage;
        throw error;
    }
}

/**
 * Load usage from API
 */
async function loadUsageFromAPI(
    account: Account
): Promise<DailyUsageData | null> {
    try {
        console.log(
            '📡 Loading daily usage from API (cached):',
            account.userId
        );

        const isLocalhost =
            isDevelopment() &&
            typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1');

        let result: { success: boolean; account?: Account } | null = null;

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
                    result = (await n8nResponse.json()) as {
                        success: boolean;
                        account?: Account;
                    };
                    console.log('✅ [LOCALHOST] Loaded from n8n');
                } else {
                    return null;
                }
            } catch (error: unknown) {
                console.warn('⚠️ [LOCALHOST] n8n fetch failed:', error);
                return null;
            }
        } else {
            result = await cachedFetchAccount(
                account.userId,
                account.email,
                'read'
            );
        }

        if (result?.success && result.account) {
            let dailyUsage: DailyUsageData | null = result.account
                .dailyUsage as DailyUsageData | null;

            if (dailyUsage) {
                console.log(
                    '✅ [NEW STRUCTURE] Loading dailyUsage from separate column'
                );
            } else {
                const profile =
                    result.account.profile &&
                    typeof result.account.profile === 'object'
                        ? (result.account.profile as Record<string, unknown>)
                        : {};
                if (profile.dailyUsage) {
                    dailyUsage = profile.dailyUsage as DailyUsageData;
                    console.warn(
                        '⚠️ [DEPRECATED] Loading dailyUsage from profile (should be in own column)'
                    );
                }

                if (!dailyUsage) {
                    const metadata =
                        result.account.metadata &&
                        typeof result.account.metadata === 'object'
                            ? (result.account.metadata as Record<
                                  string,
                                  unknown
                              >)
                            : {};
                    if (metadata.dailyUsage) {
                        dailyUsage = metadata.dailyUsage as DailyUsageData;
                        console.warn(
                            '⚠️ [DEPRECATED] Loading dailyUsage from metadata (should be migrated to own column)'
                        );
                    }
                }
            }

            if (dailyUsage && typeof dailyUsage === 'string') {
                try {
                    dailyUsage = JSON.parse(dailyUsage) as DailyUsageData;
                } catch (e) {
                    console.warn('⚠️ Failed to parse dailyUsage:', e);
                    dailyUsage = null;
                }
            }

            if (
                dailyUsage &&
                typeof dailyUsage === 'object' &&
                dailyUsage !== null
            ) {
                console.log('✅ Daily usage from API (cached):', dailyUsage);
                return dailyUsage as DailyUsageData;
            }
        }

        return null;
    } catch (error: unknown) {
        console.warn('⚠️ Failed to load usage from API:', error);
        return null;
    }
}

/**
 * Save usage to API
 */
async function saveUsageToAPI(
    account: Account,
    usageData: DailyUsageData
): Promise<{
    success: boolean;
    account?: Account;
    message?: string;
    rawResponse?: string;
}> {
    try {
        console.log('📡 Saving daily usage to API:', usageData);

        const currentPrefs = storageHelpers.get<Account>(
            STORAGE_KEYS.USER_PREFERENCES,
            {} as Account
        );
        const freshMetadata =
            currentPrefs.metadata && typeof currentPrefs.metadata === 'object'
                ? (currentPrefs.metadata as Record<string, unknown>)
                : account.metadata && typeof account.metadata === 'object'
                ? (account.metadata as Record<string, unknown>)
                : {};

        const freshAccount: Account = {
            ...account,
            metadata: freshMetadata
        };

        const updatedHistory = await saveToUsageHistory(
            freshAccount,
            usageData
        );

        const { prepareMetadataForAPI, validateMetadataNoDuplicates } =
            await import('../utils/metadataCleaner');

        const metadataToSend: Record<string, unknown> = {
            ...freshMetadata,
            usageHistory: updatedHistory, // History for charts (last 365 days)
            lastActivity: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            updatedVia: 'daily-usage-tracking'
        };

        const cleanedMetadata = prepareMetadataForAPI(metadataToSend, {
            source: 'saveUsageToAPI'
        });

        validateMetadataNoDuplicates(cleanedMetadata, 'saveUsageToAPI');

        const isLocalhost =
            isDevelopment() &&
            typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1');

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
                dailyUsage: usageData, // ← NEU: Eigene Spalte in Google Sheets
                profile: {
                    ...(account.profile && typeof account.profile === 'object'
                        ? (account.profile as Record<string, unknown>)
                        : {})
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

        const responseText = await response.text();
        let result: {
            success: boolean;
            account?: Account;
            message?: string;
            rawResponse?: string;
        };

        if (!responseText || responseText.trim().length === 0) {
            console.log(
                '⚠️ [API] Empty response from n8n (non-critical, usage saved)'
            );
            result = {
                success: true,
                message: 'Usage saved successfully (empty response)'
            };
        } else {
            try {
                result = JSON.parse(responseText) as {
                    success: boolean;
                    account?: Account;
                    message?: string;
                    rawResponse?: string;
                };
            } catch (parseError: unknown) {
                console.warn(
                    '⚠️ [API] Failed to parse JSON response:',
                    parseError
                );
                console.warn(
                    '⚠️ [API] Response text:',
                    responseText.substring(0, 200)
                );
                result = {
                    success: true,
                    message: 'Usage saved successfully (invalid JSON response)',
                    rawResponse: responseText.substring(0, 200)
                };
            }
        }

        console.log('✅ Daily usage saved to API:', result);

        if (result.success && result.account) {
            console.log(
                '🔄 [SYNC] Syncing backend response to local stores...'
            );

            try {
                const parsedAccount: Account =
                    typeof result.account === 'string'
                        ? (JSON.parse(result.account) as Account)
                        : result.account;

                const parsedMetadata: Record<string, unknown> =
                    typeof parsedAccount.metadata === 'string'
                        ? (JSON.parse(parsedAccount.metadata) as Record<
                              string,
                              unknown
                          >)
                        : parsedAccount.metadata &&
                          typeof parsedAccount.metadata === 'object'
                        ? (parsedAccount.metadata as Record<string, unknown>)
                        : {};

                let parsedDailyUsage: DailyUsageData | null = null;
                if (parsedAccount.dailyUsage) {
                    if (typeof parsedAccount.dailyUsage === 'string') {
                        try {
                            parsedDailyUsage = JSON.parse(
                                parsedAccount.dailyUsage
                            ) as DailyUsageData;
                        } catch (e) {
                            console.warn(
                                '⚠️ Failed to parse dailyUsage from response:',
                                e
                            );
                        }
                    } else if (
                        typeof parsedAccount.dailyUsage === 'object' &&
                        parsedAccount.dailyUsage !== null
                    ) {
                        parsedDailyUsage =
                            parsedAccount.dailyUsage as DailyUsageData;
                    }
                }

                console.log(
                    '📊 [SYNC] Backend returned usageHistory:',
                    (parsedMetadata.usageHistory as UsageHistoryEntry[])
                        ?.length || 0,
                    'entries'
                );
                if (parsedDailyUsage) {
                    console.log('✅ [SYNC] Backend returned dailyUsage:', {
                        date: parsedDailyUsage.date,
                        used: parsedDailyUsage.used,
                        limit: parsedDailyUsage.limit
                    });
                }

                const updatedPrefs: Account = {
                    ...currentPrefs,
                    metadata: parsedMetadata,
                    lastLogin: new Date().toISOString()
                };
                storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
                console.log('✅ [SYNC] localStorage updated');

                const { usageHistory: usageHistoryStore } = await import(
                    './userDataStore.ts'
                );
                if (
                    parsedMetadata.usageHistory &&
                    Array.isArray(parsedMetadata.usageHistory)
                ) {
                    usageHistoryStore.update(state => ({
                        ...state,
                        data: parsedMetadata.usageHistory as UsageHistoryEntry[],
                        lastUpdate: Date.now(),
                        isCached: false
                    }));
                    console.log('✅ [SYNC] usageHistory store updated');
                }

                const { syncAccountData } = await import('./accountStore');
                syncAccountData({
                    ...account,
                    metadata: parsedMetadata,
                    dailyUsage: parsedDailyUsage || account.dailyUsage || null
                });
                console.log(
                    '✅ [SYNC] currentAccount store updated with dailyUsage'
                );
            } catch (syncError: unknown) {
                console.warn(
                    '⚠️ [SYNC] Failed to sync backend response (non-critical):',
                    syncError
                );
            }
        }

        return result;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error('❌ Failed to save usage to API:', error);
        throw error;
    }
}

/**
 * Update the dailyLimit store (from './appStores')
 * EXPORTED: Can be called from other stores to sync dailyUsage
 */
export function updateDailyLimitStore(usageData: DailyUsageData | null): void {
    if (!usageData) {
        console.warn('⚠️ updateDailyLimitStore: No usageData provided');
        return;
    }

    dailyLimit.limit = usageData.limit || 0;
    dailyLimit.used = usageData.used || 0;
    dailyLimit.storyUsed = usageData.storyUsed || 0;
    console.log('✅ dailyLimit store updated:', {
        limit: usageData.limit,
        used: usageData.used,
        storyUsed: usageData.storyUsed || 0
    });
}

/**
 * Reset daily usage (DEV MODE ONLY!)
 * SECURITY: This function can ONLY be called in development mode.
 * Production users CANNOT reset their daily usage.
 */
export async function resetDailyUsage(): Promise<DailyUsageData> {
    if (!isDevelopment()) {
        console.error(
            '❌ [SECURITY] resetDailyUsage() is only available in development mode!'
        );
        throw new Error(
            'resetDailyUsage() is only available in development mode. Production users cannot reset their daily usage.'
        );
    }

    const account = currentAccount;
    const tier = accountTier || 'free';
    const loggedIn = isLoggedIn || false;
    const limit = getDailyLimitForUser(loggedIn, tier);

    const usageData: DailyUsageData = {
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

export const isLimitReachedStore = derived(dailyLimit, $dailyLimit =>
    isLimitReached($dailyLimit.used, $dailyLimit.limit)
);

export const remainingGenerations = derived(dailyLimit, $dailyLimit =>
    getRemainingGenerations($dailyLimit.used, $dailyLimit.limit)
);
