// src/stores/userDataStore.ts
// User Data Management mit klassischen Svelte-Stores
// TypeScript Migration: v0.7.7
import { writable, get } from 'svelte/store';
import { currentAccount, isLoggedIn, accountTier } from './appStores.ts';
import { STORAGE_KEYS, storageHelpers } from '../config/storage';
import { WEBHOOKS } from '../config/api';
import { cachedFetchAccount } from '../utils/apiCache';
import type { Account } from '../types/Account';

export interface UsageHistoryEntry {
    date: string;
    used: number;
    storyUsed?: number;
    limit?: number;
    timestamp?: string;
    [key: string]: unknown;
}

export interface UsageStats {
    total: number;
    storyTotal: number;
    average: number;
    storyAverage: number;
    max: number;
    storyMax: number;
    min: number;
    storyMin: number;
    trend: 'up' | 'down' | 'stable';
}

export interface UserSettingsState {
    data: Record<string, unknown> | null;
    isLoading: boolean;
    hasError: boolean;
    isCached: boolean;
    lastUpdate: number | null;
    errorMessage: string | null;
}

export interface UsageHistoryState {
    data: UsageHistoryEntry[];
    isLoading: boolean;
    hasError: boolean;
    isCached: boolean;
    lastUpdate: number | null;
    errorMessage: string | null;
    stats: UsageStats;
}

export interface DailyLimitState {
    limit: number;
    used: number;
    storyUsed?: number;
}

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

export const userSettings = writable<UserSettingsState>({
    data: null,
    isLoading: false,
    hasError: false,
    isCached: false,
    lastUpdate: null,
    errorMessage: null
});

export const usageHistory = writable<UsageHistoryState>({
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

/**
 * Safe JSON parse (handles double-escaped JSON from Google Sheets)
 */
function safeJSONParse<T = Record<string, unknown>>(
    data: unknown,
    fallback: T = {} as T
): T {
    if (!data) return fallback;
    if (typeof data === 'object' && data !== null) return data as T;
    if (typeof data === 'string') {
        try {
            let parsed: unknown = JSON.parse(data);
            if (typeof parsed === 'string') {
                try {
                    parsed = JSON.parse(parsed);
                } catch {
                    return fallback;
                }
            }
            return parsed as T;
        } catch {
            return fallback;
        }
    }
    return fallback;
}

/**
 * Check if cache is still valid
 */
function isCacheValid(timestampKey: string, duration: number): boolean {
    const timestamp = storageHelpers.get<number>(timestampKey);
    if (!timestamp) return false;
    return Date.now() - timestamp < duration;
}

/**
 * Check if running on localhost
 */
function isLocalhost(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    );
}

/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Merge today's dailyUsage into history (CENTRALIZED FUNCTION)
 * This ensures today's usage is always visible in charts
 * NOTE: This is async because we need to dynamically import stores
 */
async function mergeTodayIntoHistory(
    history: UsageHistoryEntry[]
): Promise<UsageHistoryEntry[]> {
    if (!Array.isArray(history)) return history;

    const today = getTodayDateString();
    const todayIndex = history.findIndex(entry => entry.date === today);

    let todayUsage: DailyLimitState | null = null;

    try {
        const appStores = await import('./appStores');
        todayUsage = appStores.dailyLimit as DailyLimitState;
    } catch (e) {}

    if (!todayUsage) {
        todayUsage = storageHelpers.get<DailyLimitState>(
            STORAGE_KEYS.DAILY_USAGE
        );
    }

    if (
        todayUsage &&
        (todayUsage.used > 0 || (todayUsage.storyUsed || 0) > 0)
    ) {
        let todayEntry: UsageHistoryEntry;

        if (todayIndex >= 0) {
            const existingEntry = history[todayIndex];
            todayEntry = {
                date: today,
                used: Math.max(existingEntry.used || 0, todayUsage.used || 0),
                storyUsed: Math.max(
                    existingEntry.storyUsed || 0,
                    todayUsage.storyUsed || 0
                ),
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
            todayEntry = {
                date: today,
                used: todayUsage.used || 0,
                storyUsed: todayUsage.storyUsed || 0,
                limit: todayUsage.limit || 0,
                timestamp: new Date().toISOString()
            };
            history.push(todayEntry);
        }

        history = history
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 365);
    }

    return history;
}

/**
 * Calculate usage statistics from history
 */
export function calculateUsageStats(history: UsageHistoryEntry[]): UsageStats {
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

    let trend: 'up' | 'down' | 'stable' = 'stable';
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
export async function refreshUserSettings(
    force: boolean = false
): Promise<Record<string, unknown> | null> {
    const account = currentAccount;
    const loggedIn = isLoggedIn;

    console.log('⚙️ [USER SETTINGS] Starting refresh...', {
        loggedIn,
        force,
        hasAccount: !!account
    });

    try {
        const { initializeSettingsForUser } = await import(
            './userSettingsStore.ts'
        );

        if (account && account.userId) {
            console.log('🔄 [USER SETTINGS] Initializing settings for user...');
            const loadedSettings = await initializeSettingsForUser();

            if (loadedSettings && Object.keys(loadedSettings).length > 0) {
                console.log(
                    '✅ [USER SETTINGS] Settings initialized successfully:',
                    {
                        hasName: !!loadedSettings.name,
                        hasLanguage: !!loadedSettings.language,
                        hasTheme: !!loadedSettings.theme,
                        hasStoryMode: !!loadedSettings.storyMode
                    }
                );

                storageHelpers.set(CACHE_KEYS.SETTINGS, loadedSettings);
                storageHelpers.set(CACHE_KEYS.SETTINGS_TIMESTAMP, Date.now());

                userSettings.data = loadedSettings;
                userSettings.isCached = false;
                userSettings.isLoading = false;
                userSettings.hasError = false;
                userSettings.lastUpdate = Date.now();

                return loadedSettings;
            }
        }

        if (
            !force &&
            isCacheValid(CACHE_KEYS.SETTINGS_TIMESTAMP, CACHE_DURATION.SETTINGS)
        ) {
            const cachedSettings = storageHelpers.get<Record<string, unknown>>(
                CACHE_KEYS.SETTINGS
            );
            if (cachedSettings) {
                console.log('📦 [USER SETTINGS] Using cached settings');
                userSettings.data = cachedSettings;
                userSettings.isCached = true;
                userSettings.isLoading = false;
                userSettings.hasError = false;
                userSettings.lastUpdate =
                    storageHelpers.get<number>(CACHE_KEYS.SETTINGS_TIMESTAMP) ||
                    null;
                return cachedSettings;
            }
        }

        console.log('💡 [USER SETTINGS] No settings available');
        return null;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error('❌ [USER SETTINGS] Refresh error:', error);

        userSettings.hasError = true;
        userSettings.isLoading = false;
        userSettings.errorMessage = errorMessage;

        const cachedSettings = storageHelpers.get<Record<string, unknown>>(
            CACHE_KEYS.SETTINGS
        );
        if (cachedSettings) {
            console.log(
                '💡 [USER SETTINGS] Returning stale cache due to error'
            );
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
 * @param force - Force refresh even if cache is valid
 * @param accountData - Optional account data from verifyMagicLinkFrontend (prevents duplicate API calls)
 */
export async function refreshUsageHistory(
    force: boolean = false,
    accountData: Account | null = null
): Promise<UsageHistoryEntry[]> {
    const account = accountData || currentAccount;
    const loggedIn = !!accountData || isLoggedIn;

    console.log('📊 [USAGE HISTORY] Starting refresh...', {
        loggedIn,
        force,
        hasAccount: !!account,
        hasAccountData: !!accountData,
        hasUsageHistoryInAccountData: !!(
            accountData?.metadata &&
            typeof accountData.metadata === 'object' &&
            'usageHistory' in accountData.metadata
        )
    });

    usageHistory.isLoading = true;
    usageHistory.hasError = false;
    usageHistory.errorMessage = null;

    try {
        if (
            !force &&
            isCacheValid(
                CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                CACHE_DURATION.USAGE_HISTORY
            )
        ) {
            let cachedData = storageHelpers.get<UsageHistoryEntry[]>(
                CACHE_KEYS.USAGE_HISTORY
            );
            if (cachedData && Array.isArray(cachedData)) {
                cachedData = await mergeTodayIntoHistory(cachedData);

                if (
                    cachedData !==
                    storageHelpers.get<UsageHistoryEntry[]>(
                        CACHE_KEYS.USAGE_HISTORY
                    )
                ) {
                    storageHelpers.set(CACHE_KEYS.USAGE_HISTORY, cachedData);
                }

                console.log(
                    '📦 [USAGE HISTORY] Using cached data:',
                    cachedData.length,
                    'entries'
                );
                const stats = calculateUsageStats(cachedData);

                usageHistory.data = cachedData;
                usageHistory.stats = stats;
                usageHistory.isCached = true;
                usageHistory.isLoading = false;
                usageHistory.hasError = false;
                usageHistory.lastUpdate =
                    storageHelpers.get<number>(
                        CACHE_KEYS.USAGE_HISTORY_TIMESTAMP
                    ) || null;
                return cachedData;
            }
        }

        if (account) {
            let parsedMetadata: Record<string, unknown> = {};
            let parsedProfile: Record<string, unknown> = {};

            if (typeof account.metadata === 'string') {
                parsedMetadata = safeJSONParse(account.metadata, {});
            } else if (
                account.metadata &&
                typeof account.metadata === 'object'
            ) {
                parsedMetadata = account.metadata as Record<string, unknown>;
            }

            if (typeof account.profile === 'string') {
                parsedProfile = safeJSONParse(account.profile, {});
            } else if (account.profile && typeof account.profile === 'object') {
                parsedProfile = account.profile as Record<string, unknown>;
            }

            let history: UsageHistoryEntry[] =
                (parsedMetadata.usageHistory as UsageHistoryEntry[]) ||
                (parsedProfile.usageHistory as UsageHistoryEntry[]) ||
                [];

            if (Array.isArray(history)) {
                history = history.map(entry => ({
                    ...entry,
                    storyUsed: entry.storyUsed || 0
                }));
            }

            if (Array.isArray(history) && history.length > 0) {
                history = await mergeTodayIntoHistory(history);

                console.log(
                    '✅ [USAGE HISTORY] Loaded from currentAccount:',
                    history.length,
                    'entries'
                );
                const stats = calculateUsageStats(history);

                usageHistory.data = history;
                usageHistory.stats = stats;
                usageHistory.isCached = false;
                usageHistory.isLoading = false;
                usageHistory.hasError = false;
                usageHistory.lastUpdate = Date.now();

                storageHelpers.set(CACHE_KEYS.USAGE_HISTORY, history);
                storageHelpers.set(
                    CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                    Date.now()
                );

                return history;
            }
        }

        if (
            accountData?.metadata &&
            typeof accountData.metadata === 'object' &&
            'usageHistory' in accountData.metadata
        ) {
            const usageHistoryData = accountData.metadata.usageHistory;
            if (Array.isArray(usageHistoryData)) {
                let history: UsageHistoryEntry[] = usageHistoryData;

                history = history.map(entry => ({
                    ...entry,
                    storyUsed: entry.storyUsed || 0
                }));

                history = await mergeTodayIntoHistory(history);

                console.log(
                    '✅ [USAGE HISTORY] Loaded from accountData (prevents duplicate API call!):',
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

                storageHelpers.set(CACHE_KEYS.USAGE_HISTORY, history);
                storageHelpers.set(
                    CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                    Date.now()
                );

                return history;
            }
        }

        if (
            loggedIn &&
            account?.userId &&
            !isLocalhost() &&
            !(
                accountData?.metadata &&
                typeof accountData.metadata === 'object' &&
                'usageHistory' in accountData.metadata
            )
        ) {
            console.log(
                '📡 [USAGE HISTORY] Fetching from API (accountData had no usageHistory)...'
            );

            const result = await cachedFetchAccount(
                account.userId,
                account.email,
                'get' // CRITICAL: Must be 'get' not 'read' for n8n webhook!
            );

            if (result.success && result.account) {
                const parsedMetadata = safeJSONParse<Record<string, unknown>>(
                    result.account.metadata,
                    {}
                );
                const parsedProfile = safeJSONParse<Record<string, unknown>>(
                    result.account.profile,
                    {}
                );

                let history: UsageHistoryEntry[] =
                    (parsedMetadata.usageHistory as UsageHistoryEntry[]) ||
                    (parsedProfile.usageHistory as UsageHistoryEntry[]) ||
                    [];

                if (Array.isArray(history)) {
                    history = history.map(entry => ({
                        ...entry,
                        storyUsed: entry.storyUsed || 0
                    }));
                }

                history = await mergeTodayIntoHistory(history);

                console.log(
                    '✅ [USAGE HISTORY] Loaded from API:',
                    history.length,
                    'entries'
                );
                const stats = calculateUsageStats(history);

                usageHistory.data = history;
                usageHistory.stats = stats;
                usageHistory.isCached = false;
                usageHistory.isLoading = false;
                usageHistory.hasError = false;
                usageHistory.lastUpdate = Date.now();

                storageHelpers.set(CACHE_KEYS.USAGE_HISTORY, history);
                storageHelpers.set(
                    CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                    Date.now()
                );

                return history;
            }
        }

        console.log('💡 [USAGE HISTORY] No data available - using empty array');

        usageHistory.data = [];
        usageHistory.stats = calculateUsageStats([]);
        usageHistory.isCached = false;
        usageHistory.isLoading = false;
        usageHistory.hasError = false;
        usageHistory.lastUpdate = Date.now();

        return [];
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error('❌ [USAGE HISTORY] Refresh error:', error);

        usageHistory.hasError = true;
        usageHistory.isLoading = false;
        usageHistory.errorMessage = errorMessage;

        const cachedData = storageHelpers.get<UsageHistoryEntry[]>(
            CACHE_KEYS.USAGE_HISTORY
        );
        if (cachedData && Array.isArray(cachedData)) {
            console.log(
                '💡 [USAGE HISTORY] Returning stale cache due to error'
            );
            return cachedData;
        }

        return [];
    }
}

/**
 * Initialize all user data on app start
 */
export function initializeUserData(): void {
    console.log('🚀 [USER DATA] Initializing stores...');

    try {
        const cachedSettings = storageHelpers.get<Record<string, unknown>>(
            CACHE_KEYS.SETTINGS
        );
        const settingsTimestamp = storageHelpers.get<number>(
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

        const cachedHistory = storageHelpers.get<UsageHistoryEntry[]>(
            CACHE_KEYS.USAGE_HISTORY
        );
        const historyTimestamp = storageHelpers.get<number>(
            CACHE_KEYS.USAGE_HISTORY_TIMESTAMP
        );
        if (
            cachedHistory &&
            isCacheValid(
                CACHE_KEYS.USAGE_HISTORY_TIMESTAMP,
                CACHE_DURATION.USAGE_HISTORY
            )
        ) {
            const localStorageUsage = storageHelpers.get<DailyLimitState>(
                STORAGE_KEYS.DAILY_USAGE
            );
            let mergedHistory = cachedHistory;

            if (
                localStorageUsage &&
                (localStorageUsage.used > 0 ||
                    (localStorageUsage.storyUsed || 0) > 0)
            ) {
                const today = getTodayDateString();
                const todayIndex = mergedHistory.findIndex(
                    entry => entry.date === today
                );
                const todayEntry: UsageHistoryEntry = {
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
                    .sort(
                        (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                    )
                    .slice(0, 365);
            }
            const stats = calculateUsageStats(mergedHistory);

            usageHistory.data = mergedHistory;
            usageHistory.stats = stats;
            usageHistory.isCached = true;
            usageHistory.lastUpdate = historyTimestamp;
            console.log('📦 [USER DATA] Usage history loaded from cache');
        }
    } catch (error: unknown) {
        console.warn('⚠️ [USER DATA] Failed to load from cache:', error);
    }

    if (isLoggedIn) {
        refreshUsageHistory(false).catch((error: unknown) => {
            console.warn('⚠️ [USER DATA] Failed to refresh on init:', error);
        });
    }
}
