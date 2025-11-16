/*
Daily usage loader utility for loading daily usage data from multiple sources.
Provides priority-based loading from account data, store, localStorage, and API.
Ensures single source of truth for daily usage across all stores.
*/
import { isDebugMode } from './environment';
import type { Account, DailyUsage, DailyLimitState } from '../types/Account';

function debugDailyUsageLoader(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 DailyUsageLoader Debug: ${context}`);
    if (data) debugDailyUsageLoader(data);
    console.groupEnd();
}

export interface LoadDailyUsageOptions {
    includeAPI?: boolean;
}

// DailyLimitState is now imported from '../types/Account'

/**
 * Load daily usage with priority order
 * @param account - Current account object (optional)
 * @param options - Loading options
 * @param options.includeAPI - Whether to try API if not found locally (default: true)
 * @returns Daily usage object or null
 */
export async function loadDailyUsage(
    account: Account | null = null,
    options: LoadDailyUsageOptions = {}
): Promise<DailyUsage | null> {
    const { includeAPI = true } = options;
    
    // Priority 1: account.dailyUsage (from currentAccount store - already loaded from API)
    if (account?.dailyUsage && typeof account.dailyUsage === 'object' && account.dailyUsage.date) {
        debugDailyUsageLoader('✅ [loadDailyUsage] Using account.dailyUsage (Priority 1)');
        return account.dailyUsage as DailyUsage;
    }
    
    // Priority 2: dailyLimit store (synchronous, most up-to-date)
    try {
        const { get } = await import('svelte/store');
        const { dailyLimit } = await import('../stores/appStores');
        const dailyLimitStore = get(dailyLimit) as DailyLimitState | null;
        
        // CRITICAL: dailyLimit store has {limit, used, storyUsed} but NOT date
        // We need to construct dailyUsage object with today's date
        if (dailyLimitStore && (dailyLimitStore.used > 0 || (dailyLimitStore.storyUsed ?? 0) > 0 || dailyLimitStore.limit > 0)) {
            const today = new Date().toISOString().split('T')[0];
            const dailyUsage: DailyUsage = {
                date: today,
                used: dailyLimitStore.used || 0,
                storyUsed: dailyLimitStore.storyUsed || 0,
                limit: dailyLimitStore.limit || 0,
                lastReset: today
            };
            debugDailyUsageLoader('✅ [loadDailyUsage] Using dailyLimit store (Priority 2)');
            return dailyUsage;
        }
    } catch (error) {
        debugDailyUsageLoader('⚠️ [loadDailyUsage] Failed to load from dailyLimit store:', error);
    }
    
    // Priority 3: localStorage
    try {
        const { storageHelpers, STORAGE_KEYS } = await import('../config/storage');
        const stored = storageHelpers.get<DailyUsage | null>(STORAGE_KEYS.DAILY_USAGE);
        if (stored && typeof stored === 'object' && stored.date) {
            debugDailyUsageLoader('✅ [loadDailyUsage] Using localStorage (Priority 3)');
            return stored;
        }
    } catch (error) {
        debugDailyUsageLoader('⚠️ [loadDailyUsage] Failed to load from localStorage:', error);
    }
    
    // Priority 4: API (last resort, async)
    if (includeAPI && account?.userId) {
        try {
            const { loadUsageFromAPI } = await import('../stores/dailyUsageStore');
            if (loadUsageFromAPI) {
                const apiUsage = await loadUsageFromAPI(account).catch(() => null);
                if (apiUsage && apiUsage.date) {
                    debugDailyUsageLoader('✅ [loadDailyUsage] Using API (Priority 4)');
                    return apiUsage as DailyUsage;
                }
            }
        } catch (error) {
            debugDailyUsageLoader('⚠️ [loadDailyUsage] Failed to load from API:', error);
        }
    }
    
    debugDailyUsageLoader('⚠️ [loadDailyUsage] No dailyUsage found in any source');
    return null;
}

