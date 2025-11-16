// src/utils/apiCache.ts
// Intelligent API Caching Layer - Prevents 429 errors with Best Practices
//
// TypeScript Migration: v0.7.7

import { storageHelpers } from '../config/storage';

/**
 * Cache TTL Types
 */
export type CacheDataType = 
    | 'ACCOUNT_PROFILE'
    | 'DAILY_USAGE'
    | 'USAGE_HISTORY'
    | 'SESSION_CHECK'
    | 'USER_SETTINGS'
    | 'DEFAULT';

/**
 * Cache TTL (Time To Live) - Different for different data types
 */
const CACHE_TTL: Record<CacheDataType, number> = {
    ACCOUNT_PROFILE: 5 * 60 * 1000, // 5 minutes (rarely changes)
    DAILY_USAGE: 30 * 1000, // 30 seconds (changes frequently)
    USAGE_HISTORY: 60 * 60 * 1000, // 1 hour (changes once per day)
    SESSION_CHECK: 2 * 60 * 1000, // 2 minutes (session validation)
    USER_SETTINGS: 10 * 60 * 1000, // 10 minutes (changes occasionally)
    DEFAULT: 60 * 1000 // 1 minute (fallback)
};

/**
 * Request throttling - Max requests per endpoint
 */
const REQUEST_THROTTLE = {
    MIN_INTERVAL: 1000, // Min 1 second between requests
    MAX_PARALLEL: 3 // Max 3 parallel requests total
} as const;

/**
 * Cache Entry Interface
 */
export interface CacheEntry {
    data: unknown;
    cachedAt: number;
    expiresAt: number;
    ttl: number;
}

/**
 * Cache Storage Type
 */
type CacheStorage = Record<string, CacheEntry>;

/**
 * Fetch Options Interface
 */
export interface FetchOptions extends RequestInit {
    body?: string | BodyInit | null;
}

/**
 * Cache Stats Interface
 */
export interface CacheStats {
    totalEntries: number;
    fresh: number;
    stale: number;
    totalSize: number;
    oldestEntry: {
        key: string;
        age: number;
    } | null;
    newestEntry: {
        key: string;
        age: number;
    } | null;
}

/**
 * API Cache Debug Interface
 */
export interface CacheDebugResult {
    cache: CacheStorage;
    stats: CacheStats | null;
}

/**
 * Window API Cache Interface (for debugging)
 */
declare global {
    interface Window {
        apiCache?: {
            stats: () => CacheStats | null;
            debug: () => CacheDebugResult;
            clear: () => void;
            cleanup: () => void;
            invalidate: (key: string) => void;
            invalidatePattern: (pattern: string) => void;
        };
    }
}

// In-flight requests (prevent duplicate parallel calls)
const pendingRequests = new Map<string, Promise<unknown>>();

// Last request times (for throttling)
const lastRequestTimes = new Map<string, number>();

// Active requests counter
let activeRequestCount = 0;

// Storage key for cache
const CACHE_STORAGE_KEY = 'keymoji_api_cache';

// Max cache size
const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CACHE_ENTRIES = 100;

/**
 * Generate unique cache key from URL and options
 */
function getCacheKey(url: string, options: FetchOptions = {}): string {
    try {
        const body = options?.body ? JSON.parse(options.body as string) : {};
        const action = body.action || 'get';
        const userId = body.userId || body.email || 'anonymous';

        // Create deterministic key
        return `${url}:${action}:${userId}`;
    } catch (error) {
        // Fallback: use URL only
        return url;
    }
}

/**
 * Get endpoint key for throttling (without user-specific data)
 */
function getEndpointKey(url: string): string {
    if (typeof window === 'undefined') return url;
    
    try {
        const urlObj = new URL(url, window.location.origin);
        return urlObj.pathname; // e.g., '/api/account'
    } catch {
        return url;
    }
}

/**
 * Get all cached data from localStorage
 */
function getCache(): CacheStorage {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return {};
    }
    
    try {
        const cached = localStorage.getItem(CACHE_STORAGE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch (error) {
        console.warn('⚠️ Failed to read cache:', error);
        return {};
    }
}

/**
 * Save cache to localStorage
 */
function saveCache(cache: CacheStorage): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
    }
    
    try {
        const cacheString = JSON.stringify(cache);

        // Check size limit
        if (cacheString.length > MAX_CACHE_SIZE) {
            console.warn('⚠️ Cache size limit exceeded, cleaning up...');
            cleanupCache(cache);
            return;
        }

        localStorage.setItem(CACHE_STORAGE_KEY, cacheString);
    } catch (error) {
        console.warn('⚠️ Failed to save cache:', error);
        // QuotaExceededError? Clean up!
        if (error instanceof Error && error.name === 'QuotaExceededError') {
            cleanupCache();
        }
    }
}

/**
 * Get cached entry
 */
function getFromCache(key: string): CacheEntry | null {
    try {
        const cache = getCache();
        const entry = cache[key];

        if (!entry) {
            return null;
        }

        // Check if expired
        if (isExpired(entry)) {
            console.log('⏰ Cache entry expired:', key);
            return null;
        }

        const age = Date.now() - entry.cachedAt;
        console.log(`✅ Cache HIT: ${key} (age: ${Math.round(age / 1000)}s)`);

        return entry;
    } catch (error) {
        console.warn('⚠️ Failed to get from cache:', error);
        return null;
    }
}

/**
 * Save entry to cache
 */
function saveToCache(key: string, data: unknown, ttl: number = CACHE_TTL.DEFAULT): void {
    try {
        const cache = getCache();

        const entry: CacheEntry = {
            data: data,
            cachedAt: Date.now(),
            expiresAt: Date.now() + ttl,
            ttl: ttl
        };

        cache[key] = entry;

        // Cleanup if needed
        const entries = Object.keys(cache);
        if (entries.length > MAX_CACHE_ENTRIES) {
            cleanupCache(cache);
        } else {
            saveCache(cache);
        }

        console.log(`💾 Cached: ${key} (TTL: ${ttl / 1000}s)`);
    } catch (error) {
        console.warn('⚠️ Failed to save to cache:', error);
    }
}

/**
 * Check if cache entry is expired
 */
function isExpired(entry: CacheEntry | null | undefined): boolean {
    if (!entry || !entry.expiresAt) {
        return true;
    }
    return Date.now() > entry.expiresAt;
}

/**
 * Get cache entry age in milliseconds
 */
function getAge(entry: CacheEntry | null | undefined): number {
    if (!entry || !entry.cachedAt) {
        return Infinity;
    }
    return Date.now() - entry.cachedAt;
}

/**
 * Cleanup old/expired cache entries
 */
function cleanupCache(cacheData: CacheStorage | null = null): void {
    try {
        const cache = cacheData || getCache();
        const entries = Object.entries(cache);

        console.log(`🧹 Cleaning up cache (${entries.length} entries)...`);

        // Remove expired entries
        const activeEntries = entries.filter(
            ([key, value]) => !isExpired(value)
        );

        console.log(
            `🧹 Removed ${
                entries.length - activeEntries.length
            } expired entries`
        );

        // Sort by age, keep newest
        if (activeEntries.length > MAX_CACHE_ENTRIES) {
            activeEntries.sort((a, b) => b[1].cachedAt - a[1].cachedAt);
            const kept = activeEntries.slice(0, MAX_CACHE_ENTRIES);

            console.log(`🧹 Kept ${kept.length} newest entries`);

            saveCache(Object.fromEntries(kept));
        } else {
            saveCache(Object.fromEntries(activeEntries));
        }

        console.log(`✅ Cache cleanup complete`);
    } catch (error) {
        console.error('❌ Cache cleanup failed:', error);
    }
}

/**
 * Invalidate specific cache entry
 */
export function invalidateCache(key: string): void {
    try {
        const cache = getCache();
        if (cache[key]) {
            delete cache[key];
            saveCache(cache);
            console.log(`🗑️ Invalidated cache: ${key}`);
        }
    } catch (error) {
        console.warn('⚠️ Failed to invalidate cache:', error);
    }
}

/**
 * Invalidate all cache entries matching pattern
 */
export function invalidateCachePattern(pattern: string): void {
    try {
        const cache = getCache();
        const keys = Object.keys(cache);
        const matching = keys.filter(key => key.includes(pattern));

        matching.forEach(key => delete cache[key]);
        saveCache(cache);

        console.log(
            `🗑️ Invalidated ${matching.length} cache entries matching: ${pattern}`
        );
    } catch (error) {
        console.warn('⚠️ Failed to invalidate cache pattern:', error);
    }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
    }
    
    try {
        localStorage.removeItem(CACHE_STORAGE_KEY);
        console.log('🗑️ All cache cleared');
    } catch (error) {
        console.warn('⚠️ Failed to clear cache:', error);
    }
}

/**
 * Check if request should be throttled
 */
function shouldThrottle(url: string): boolean {
    const key = getEndpointKey(url);
    const lastTime = lastRequestTimes.get(key) || 0;
    const now = Date.now();
    const timeSinceLast = now - lastTime;

    return timeSinceLast < REQUEST_THROTTLE.MIN_INTERVAL;
}

/**
 * Wait for throttle interval
 */
function waitForThrottle(url: string): Promise<void> {
    const key = getEndpointKey(url);
    const lastTime = lastRequestTimes.get(key) || 0;
    const now = Date.now();
    const timeSinceLast = now - lastTime;
    const waitTime = Math.max(0, REQUEST_THROTTLE.MIN_INTERVAL - timeSinceLast);

    if (waitTime > 0) {
        console.log(
            `⏸️ Throttling request to ${getEndpointKey(
                url
            )} (wait ${waitTime}ms)`
        );
        return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    return Promise.resolve();
}

/**
 * Main cached fetch function
 * @param url - API endpoint
 * @param options - Fetch options
 * @param ttl - Cache TTL in milliseconds
 * @param useStaleWhileRevalidate - Return stale data immediately, refresh in background
 */
export async function cachedFetch(
    url: string,
    options: FetchOptions = {},
    ttl: number = CACHE_TTL.DEFAULT,
    useStaleWhileRevalidate: boolean = false
): Promise<unknown> {
    const cacheKey = getCacheKey(url, options);

    try {
        // === PHASE 1: Check for in-flight request (deduplication) ===
        if (pendingRequests.has(cacheKey)) {
            console.log('🔄 Reusing in-flight request:', cacheKey);
            return await pendingRequests.get(cacheKey)!;
        }

        // === PHASE 2: Check cache ===
        const cached = getFromCache(cacheKey);

        if (cached) {
            if (!isExpired(cached)) {
                // Fresh cache hit!
                return cached.data;
            } else if (useStaleWhileRevalidate) {
                // Stale data: return immediately, refresh in background
                console.log(
                    `📦 Returning STALE data (age: ${Math.round(
                        getAge(cached) / 1000
                    )}s), refreshing...`
                );

                // Background refresh (non-blocking!)
                performBackgroundRefresh(url, options, cacheKey, ttl).catch(
                    err => {
                        console.warn('⚠️ Background refresh failed:', err);
                    }
                );

                return cached.data;
            }
        }

        // === PHASE 3: Cache miss - fetch from API ===
        console.log('⚠️ Cache MISS:', cacheKey);

        // Check parallel request limit
        if (activeRequestCount >= REQUEST_THROTTLE.MAX_PARALLEL) {
            console.warn(
                `⚠️ Too many parallel requests (${activeRequestCount}), queuing...`
            );
            await waitForParallelSlot();
        }

        // Check throttling
        await waitForThrottle(url);

        // Mark request time
        lastRequestTimes.set(getEndpointKey(url), Date.now());

        // Execute fetch
        activeRequestCount++;
        const promise = executeFetch(url, options, cacheKey, ttl);
        pendingRequests.set(cacheKey, promise);

        const result = await promise;

        return result;
    } catch (error) {
        console.error('❌ cachedFetch error:', error);

        // Try to return stale cache as fallback
        const cache = getCache();
        const staleEntry = cache[cacheKey];
        if (staleEntry) {
            console.warn('⚠️ Returning STALE cache due to error');
            return staleEntry.data;
        }

        throw error;
    }
}

/**
 * Execute actual fetch and handle caching
 */
async function executeFetch(
    url: string,
    options: FetchOptions,
    cacheKey: string,
    ttl: number
): Promise<unknown> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(
                `API returned ${response.status}: ${response.statusText}`
            );
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        let text: string;
        
        try {
            text = await response.text();
        } catch (textError) {
            const error = textError instanceof Error ? textError : new Error(String(textError));
            console.error('❌ [apiCache] Failed to read response text:', error);
            throw new Error(`Failed to read response: ${error.message}`);
        }
        
        // Handle empty responses
        if (!text || text.trim().length === 0) {
            console.warn('⚠️ [apiCache] Empty response from:', url);
            return null;
        }
        
        // Try to parse JSON
        let data: unknown;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            const error = parseError instanceof Error ? parseError : new Error(String(parseError));
            console.error('❌ [apiCache] Failed to parse JSON response:', {
                url,
                status: response.status,
                contentType,
                textPreview: text.substring(0, 200),
                textLength: text.length,
                error: error.message
            });
            throw new Error(`Invalid JSON response: ${error.message}`);
        }

        // Save to cache
        saveToCache(cacheKey, data, ttl);

        return data;
    } finally {
        activeRequestCount--;
        pendingRequests.delete(cacheKey);
    }
}

/**
 * Background refresh (non-blocking)
 */
async function performBackgroundRefresh(
    url: string,
    options: FetchOptions,
    cacheKey: string,
    ttl: number
): Promise<void> {
    try {
        console.log('🔄 Background refresh starting:', cacheKey);

        await waitForThrottle(url);
        lastRequestTimes.set(getEndpointKey(url), Date.now());

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            saveToCache(cacheKey, data, ttl);
            console.log('✅ Background refresh complete:', cacheKey);
        }
    } catch (error) {
        console.warn('⚠️ Background refresh failed:', error);
    }
}

/**
 * Wait for parallel slot to free up
 */
function waitForParallelSlot(): Promise<void> {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            if (activeRequestCount < REQUEST_THROTTLE.MAX_PARALLEL) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}

/**
 * Get appropriate TTL for data type
 */
export function getTTLForDataType(dataType: CacheDataType): number {
    return CACHE_TTL[dataType] || CACHE_TTL.DEFAULT;
}

/**
 * Specialized fetch for account data
 */
export async function cachedFetchAccount(
    userId: string,
    email: string,
    action: string = 'get'
): Promise<unknown> {
    const url = '/api/account';
    const options: FetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            action,
            userId,
            email
        })
    };

    return cachedFetch(url, options, CACHE_TTL.ACCOUNT_PROFILE, true); // Use stale-while-revalidate
}

/**
 * Specialized fetch for daily usage
 */
export async function cachedFetchDailyUsage(
    userId: string,
    email: string
): Promise<unknown> {
    const url = '/api/account';
    const options: FetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            action: 'read',
            userId,
            email
        })
    };

    return cachedFetch(url, options, CACHE_TTL.DAILY_USAGE, false); // Fresh data preferred
}

/**
 * Specialized fetch for usage history
 * @deprecated Use cachedFetchAccount() instead - same functionality, better naming
 */
export async function cachedFetchUsageHistory(
    userId: string,
    email: string
): Promise<unknown> {
    // Delegate to cachedFetchAccount for consistency
    return cachedFetchAccount(userId, email, 'get');
}

/**
 * Debug: Show cache stats
 */
export function getCacheStats(): CacheStats | null {
    try {
        const cache = getCache();
        const entries = Object.entries(cache);

        const stats: CacheStats = {
            totalEntries: entries.length,
            fresh: 0,
            stale: 0,
            totalSize: JSON.stringify(cache).length,
            oldestEntry: null,
            newestEntry: null
        };

        entries.forEach(([key, value]) => {
            if (isExpired(value)) {
                stats.stale++;
            } else {
                stats.fresh++;
            }
        });

        if (entries.length > 0) {
            const sorted = entries.sort(
                (a, b) => a[1].cachedAt - b[1].cachedAt
            );
            stats.oldestEntry = {
                key: sorted[0][0],
                age: Math.round(getAge(sorted[0][1]) / 1000)
            };
            stats.newestEntry = {
                key: sorted[sorted.length - 1][0],
                age: Math.round(getAge(sorted[sorted.length - 1][1]) / 1000)
            };
        }

        return stats;
    } catch (error) {
        console.error('❌ Failed to get cache stats:', error);
        return null;
    }
}

/**
 * Debug: Show all cache entries
 */
export function debugCache(): CacheDebugResult {
    const cache = getCache();
    const stats = getCacheStats();

    console.log('═══════════════════════════════════════════');
    console.log('📊 API CACHE DEBUG');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('Stats:', stats);
    console.log('');
    console.log('Entries:');
    Object.entries(cache).forEach(([key, value]) => {
        console.log(`  ${isExpired(value) ? '⏰ STALE' : '✅ FRESH'}: ${key}`);
        console.log(
            `     Age: ${Math.round(getAge(value) / 1000)}s, TTL: ${
                value.ttl / 1000
            }s`
        );
    });
    console.log('');
    console.log('Active Requests:', activeRequestCount);
    console.log('Pending Requests:', pendingRequests.size);
    console.log('');
    console.log('═══════════════════════════════════════════');

    return { cache, stats };
}

// Flag to prevent duplicate initialization
let cacheInitialized = false;

/**
 * Auto-cleanup on app start (remove expired entries)
 * CRITICAL: This should only be called ONCE per page load (in src/index.ts)
 */
export function initializeCache(): void {
    // Prevent duplicate initialization (saves CPU cycles)
    if (cacheInitialized) {
        console.log('⚠️ Cache already initialized, skipping duplicate call');
        return;
    }
    
    try {
        console.log('🔄 Initializing API cache...');
        cacheInitialized = true;
        
        // CRITICAL: Aggressive cleanup on startup
        const cache = getCache();
        const entries = Object.entries(cache);
        
        console.log(`🧹 Found ${entries.length} cache entries on startup`);
        
        // Remove ALL expired entries immediately
        cleanupCache();
        
        // If still too large, clear everything (safety measure)
        const stats = getCacheStats();
        if (stats && (stats.totalSize > MAX_CACHE_SIZE || stats.totalEntries > MAX_CACHE_ENTRIES * 2)) {
            console.warn('⚠️ Cache still too large after cleanup, clearing all...');
            clearAllCache();
        }
        
        const finalStats = getCacheStats();
        console.log('✅ API cache initialized:', finalStats);
    } catch (error) {
        console.error('❌ Cache initialization failed:', error);
        // Last resort: clear everything
        try {
            clearAllCache();
            console.log('✅ Cache cleared as fallback');
        } catch (clearError) {
            console.error('❌ Failed to clear cache:', clearError);
        } finally {
            // Reset flag on error so it can be retried
            cacheInitialized = false;
        }
    }
}

// Export for window debug access
if (typeof window !== 'undefined') {
    window.apiCache = {
        stats: getCacheStats,
        debug: debugCache,
        clear: clearAllCache,
        cleanup: cleanupCache,
        invalidate: invalidateCache,
        invalidatePattern: invalidateCachePattern
    };
}

