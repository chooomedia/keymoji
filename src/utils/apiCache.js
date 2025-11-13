// src/utils/apiCache.js
// Intelligent API Caching Layer - Prevents 429 errors with Best Practices

import { storageHelpers } from '../config/storage.js';

// Cache TTL (Time To Live) - Different for different data types
const CACHE_TTL = {
    ACCOUNT_PROFILE: 5 * 60 * 1000, // 5 minutes (rarely changes)
    DAILY_USAGE: 30 * 1000, // 30 seconds (changes frequently)
    USAGE_HISTORY: 60 * 60 * 1000, // 1 hour (changes once per day)
    SESSION_CHECK: 2 * 60 * 1000, // 2 minutes (session validation)
    USER_SETTINGS: 10 * 60 * 1000, // 10 minutes (changes occasionally)
    DEFAULT: 60 * 1000 // 1 minute (fallback)
};

// Request throttling - Max requests per endpoint
const REQUEST_THROTTLE = {
    MIN_INTERVAL: 1000, // Min 1 second between requests
    MAX_PARALLEL: 3 // Max 3 parallel requests total
};

// In-flight requests (prevent duplicate parallel calls)
const pendingRequests = new Map();

// Last request times (for throttling)
const lastRequestTimes = new Map();

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
function getCacheKey(url, options = {}) {
    try {
        const body = options?.body ? JSON.parse(options.body) : {};
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
function getEndpointKey(url) {
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
function getCache() {
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
function saveCache(cache) {
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
        if (error.name === 'QuotaExceededError') {
            cleanupCache();
        }
    }
}

/**
 * Get cached entry
 */
function getFromCache(key) {
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
function saveToCache(key, data, ttl = CACHE_TTL.DEFAULT) {
    try {
        const cache = getCache();

        const entry = {
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
function isExpired(entry) {
    if (!entry || !entry.expiresAt) {
        return true;
    }
    return Date.now() > entry.expiresAt;
}

/**
 * Get cache entry age in milliseconds
 */
function getAge(entry) {
    if (!entry || !entry.cachedAt) {
        return Infinity;
    }
    return Date.now() - entry.cachedAt;
}

/**
 * Cleanup old/expired cache entries
 */
function cleanupCache(cacheData = null) {
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
export function invalidateCache(key) {
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
export function invalidateCachePattern(pattern) {
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
export function clearAllCache() {
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
function shouldThrottle(url) {
    const key = getEndpointKey(url);
    const lastTime = lastRequestTimes.get(key) || 0;
    const now = Date.now();
    const timeSinceLast = now - lastTime;

    return timeSinceLast < REQUEST_THROTTLE.MIN_INTERVAL;
}

/**
 * Wait for throttle interval
 */
function waitForThrottle(url) {
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
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @param {number} ttl - Cache TTL in milliseconds
 * @param {boolean} useStaleWhileRevalidate - Return stale data immediately, refresh in background
 */
export async function cachedFetch(
    url,
    options = {},
    ttl = CACHE_TTL.DEFAULT,
    useStaleWhileRevalidate = false
) {
    const cacheKey = getCacheKey(url, options);

    try {
        // === PHASE 1: Check for in-flight request (deduplication) ===
        if (pendingRequests.has(cacheKey)) {
            console.log('🔄 Reusing in-flight request:', cacheKey);
            return await pendingRequests.get(cacheKey);
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
async function executeFetch(url, options, cacheKey, ttl) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(
                `API returned ${response.status}: ${response.statusText}`
            );
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        let text;
        
        try {
            text = await response.text();
        } catch (textError) {
            console.error('❌ [apiCache] Failed to read response text:', textError);
            throw new Error(`Failed to read response: ${textError.message}`);
        }
        
        // Handle empty responses
        if (!text || text.trim().length === 0) {
            console.warn('⚠️ [apiCache] Empty response from:', url);
            return null;
        }
        
        // Try to parse JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('❌ [apiCache] Failed to parse JSON response:', {
                url,
                status: response.status,
                contentType,
                textPreview: text.substring(0, 200),
                textLength: text.length,
                error: parseError.message
            });
            throw new Error(`Invalid JSON response: ${parseError.message}`);
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
async function performBackgroundRefresh(url, options, cacheKey, ttl) {
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
function waitForParallelSlot() {
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
export function getTTLForDataType(dataType) {
    return CACHE_TTL[dataType] || CACHE_TTL.DEFAULT;
}

/**
 * Specialized fetch for account data
 */
export async function cachedFetchAccount(userId, email, action = 'get') {
    const url = '/api/account';
    const options = {
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
export async function cachedFetchDailyUsage(userId, email) {
    const url = '/api/account';
    const options = {
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
export async function cachedFetchUsageHistory(userId, email) {
    // Delegate to cachedFetchAccount for consistency
    return cachedFetchAccount(userId, email, 'get');
}

/**
 * Debug: Show cache stats
 */
export function getCacheStats() {
    try {
        const cache = getCache();
        const entries = Object.entries(cache);

        const stats = {
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
export function debugCache() {
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

// cleanupCache already defined above at line 185

/**
 * Auto-cleanup on app start (remove expired entries)
 */
export function initializeCache() {
    try {
        console.log('🔄 Initializing API cache...');
        cleanupCache();

        const stats = getCacheStats();
        console.log('✅ API cache initialized:', stats);
    } catch (error) {
        console.error('❌ Cache initialization failed:', error);
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
