/**
 * Centralized dailyUsage Loading Utility
 * Single Source of Truth for loading dailyUsage across all stores
 * 
 * Priority Order:
 * 1. account.dailyUsage (from currentAccount store - already loaded)
 * 2. dailyLimit store (synchronous, most up-to-date)
 * 3. localStorage (STORAGE_KEYS.DAILY_USAGE)
 * 4. API (loadUsageFromAPI - async, last resort)
 * 
 * @param {Object} account - Current account object (optional)
 * @param {Object} options - Loading options
 * @param {boolean} options.includeAPI - Whether to try API if not found locally (default: true)
 * @returns {Promise<Object|null>} - Daily usage object or null
 */
export async function loadDailyUsage(account = null, options = {}) {
    const { includeAPI = true } = options;
    
    // Priority 1: account.dailyUsage (from currentAccount store - already loaded from API)
    if (account?.dailyUsage && typeof account.dailyUsage === 'object' && account.dailyUsage.date) {
        console.log('✅ [loadDailyUsage] Using account.dailyUsage (Priority 1)');
        return account.dailyUsage;
    }
    
    // Priority 2: dailyLimit store (synchronous, most up-to-date)
    try {
        const { get } = await import('svelte/store');
        const { dailyLimit } = await import('../stores/appStores');
        const dailyLimitStore = get(dailyLimit);
        
        // CRITICAL: dailyLimit store has {limit, used, storyUsed} but NOT date
        // We need to construct dailyUsage object with today's date
        if (dailyLimitStore && (dailyLimitStore.used > 0 || dailyLimitStore.storyUsed > 0 || dailyLimitStore.limit > 0)) {
            const today = new Date().toISOString().split('T')[0];
            const dailyUsage = {
                date: today,
                used: dailyLimitStore.used || 0,
                storyUsed: dailyLimitStore.storyUsed || 0,
                limit: dailyLimitStore.limit || 0,
                lastReset: today
            };
            console.log('✅ [loadDailyUsage] Using dailyLimit store (Priority 2)');
            return dailyUsage;
        }
    } catch (error) {
        console.warn('⚠️ [loadDailyUsage] Failed to load from dailyLimit store:', error);
    }
    
    // Priority 3: localStorage
    try {
        const { storageHelpers, STORAGE_KEYS } = await import('../config/storage.js');
        const stored = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE);
        if (stored && typeof stored === 'object' && stored.date) {
            console.log('✅ [loadDailyUsage] Using localStorage (Priority 3)');
            return stored;
        }
    } catch (error) {
        console.warn('⚠️ [loadDailyUsage] Failed to load from localStorage:', error);
    }
    
    // Priority 4: API (last resort, async)
    if (includeAPI && account?.userId) {
        try {
            const { loadUsageFromAPI } = await import('../stores/dailyUsageStore.js');
            if (loadUsageFromAPI) {
                const apiUsage = await loadUsageFromAPI(account).catch(() => null);
                if (apiUsage && apiUsage.date) {
                    console.log('✅ [loadDailyUsage] Using API (Priority 4)');
                    return apiUsage;
                }
            }
        } catch (error) {
            console.warn('⚠️ [loadDailyUsage] Failed to load from API:', error);
        }
    }
    
    console.warn('⚠️ [loadDailyUsage] No dailyUsage found in any source');
    return null;
}

