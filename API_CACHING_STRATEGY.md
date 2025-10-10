# API Caching Strategy - 429 Error Prevention (Best Practices)

## 🔴 **PROBLEM:**

```
POST https://its.keymoji.wtf/api/account 429 (Too Many Requests)
```

**Ursache:**
- Page reload → Mehrere API calls gleichzeitig
- `initializeAccountFromCookies()` → `/api/account` (read)
- `initializeDailyUsage()` → `/api/account` (read)
- `loadUsageHistory()` → `/api/account` (read)
- **Result:** 3-4 calls in 100ms → Rate limit! ❌

---

## 🎯 **BEST PRACTICES LÖSUNG:**

### **1. REQUEST DEDUPLICATION (Gleiche Requests zusammenführen)**
### **2. CACHING LAYER (Intelligentes localStorage)**
### **3. REQUEST THROTTLING (Max 1 call pro Sekunde)**
### **4. STALE-WHILE-REVALIDATE (Alte Daten zeigen während refresh)**

---

## 📋 **IMPLEMENTATION PLAN:**

### **NEW FILE:** `src/utils/apiCache.js`

**Features:**
- ✅ Request deduplication (prevent parallel duplicate calls)
- ✅ Response caching (localStorage with TTL)
- ✅ Request throttling (max rate)
- ✅ Stale-while-revalidate pattern
- ✅ Automatic retry with exponential backoff
- ✅ Cache invalidation strategies

---

## 🔧 **CACHING STRATEGY:**

### **Data Types & TTL (Time To Live):**

```javascript
CACHE_TTL = {
    // Static/rarely changing data:
    ACCOUNT_PROFILE: 5 * 60 * 1000,      // 5 minutes
    
    // Dynamic/frequently changing:
    DAILY_USAGE: 30 * 1000,              // 30 seconds
    
    // Historical data (changes once per day):
    USAGE_HISTORY: 60 * 60 * 1000,       // 1 hour
    
    // Session data:
    SESSION_CHECK: 2 * 60 * 1000,        // 2 minutes
    
    // Settings:
    USER_SETTINGS: 10 * 60 * 1000,       // 10 minutes
}
```

### **Cache Storage Structure:**

```javascript
localStorage.setItem('keymoji_api_cache', JSON.stringify({
    '/api/account:read:user_123': {
        data: {...},
        cachedAt: 1728569999999,
        expiresAt: 1728570299999,  // cachedAt + TTL
        etag: 'abc123'              // For conditional requests
    }
}));
```

---

## 🚀 **CORE FEATURES:**

### **1. Request Deduplication:**

```javascript
// Problem: Parallel requests for same data
initializeAccountFromCookies() → /api/account (userId: 123)
initializeDailyUsage() → /api/account (userId: 123)
loadUsageHistory() → /api/account (userId: 123)
// 3 requests in 50ms! ❌

// Solution: Share single in-flight request
const pendingRequests = new Map();

function fetch(url, options) {
    const key = getCacheKey(url, options);
    
    // Already requesting? Return same promise!
    if (pendingRequests.has(key)) {
        console.log('🔄 Reusing in-flight request:', key);
        return pendingRequests.get(key);
    }
    
    // New request
    const promise = originalFetch(url, options)
        .finally(() => pendingRequests.delete(key));
    
    pendingRequests.set(key, promise);
    return promise;
}

// Result: 1 request instead of 3! ✓
```

### **2. Response Caching:**

```javascript
// Check cache before fetching
function cachedFetch(url, options, ttl = 60000) {
    const key = getCacheKey(url, options);
    const cached = getFromCache(key);
    
    // Cache hit + fresh?
    if (cached && !isExpired(cached)) {
        console.log('✅ Cache HIT:', key, 'age:', getAge(cached));
        return Promise.resolve(cached.data);
    }
    
    // Cache miss or expired → fetch
    console.log('⚠️ Cache MISS:', key);
    return fetch(url, options)
        .then(data => {
            saveToCache(key, data, ttl);
            return data;
        });
}
```

### **3. Stale-While-Revalidate:**

```javascript
// Return stale data immediately, fetch fresh in background
function fetchWithStale(url, options, ttl) {
    const key = getCacheKey(url, options);
    const cached = getFromCache(key);
    
    // Has stale data? Return it immediately!
    if (cached) {
        console.log('✅ Returning STALE data (age:', getAge(cached), ')');
        
        // Fetch fresh in background (non-blocking!)
        if (isExpired(cached)) {
            console.log('🔄 Refreshing in background...');
            fetch(url, options)
                .then(data => saveToCache(key, data, ttl))
                .catch(err => console.warn('Background refresh failed:', err));
        }
        
        return Promise.resolve(cached.data);
    }
    
    // No cache? Fetch normally
    return fetch(url, options);
}
```

### **4. Request Throttling:**

```javascript
// Max 1 request per second per endpoint
const lastRequestTimes = new Map();
const MIN_REQUEST_INTERVAL = 1000; // 1 second

function throttledFetch(url, options) {
    const key = getEndpointKey(url);
    const lastTime = lastRequestTimes.get(key) || 0;
    const now = Date.now();
    const timeSinceLast = now - lastTime;
    
    // Too soon? Wait!
    if (timeSinceLast < MIN_REQUEST_INTERVAL) {
        const waitTime = MIN_REQUEST_INTERVAL - timeSinceLast;
        console.log(`⏸️ Throttling request to ${url} (wait ${waitTime}ms)`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                lastRequestTimes.set(key, Date.now());
                resolve(fetch(url, options));
            }, waitTime);
        });
    }
    
    // OK to proceed
    lastRequestTimes.set(key, now);
    return fetch(url, options);
}
```

---

## 📊 **CACHE INVALIDATION:**

### **When to invalidate:**

```javascript
// User actions that change data:
onSettingsSave() → invalidateCache('account_settings');
onDailyUsageIncrement() → invalidateCache('daily_usage');
onLogin() → invalidateCache('session');
onLogout() → clearAllCache();

// Automatic invalidation:
onNewDay() → invalidateCache('daily_usage');
onTierChange() → invalidateCache('account_profile');
```

### **Cache Keys:**

```javascript
function getCacheKey(url, options) {
    const body = options?.body ? JSON.parse(options.body) : {};
    const action = body.action || 'get';
    const userId = body.userId || 'anonymous';
    
    return `${url}:${action}:${userId}`;
}

// Examples:
'/api/account:read:user_123'
'/api/account:update:user_123'
'/api/account/update::user_123'
```

---

## 🔒 **SECURITY BEST PRACTICES:**

### **1. Sensitive Data:**
```javascript
// DON'T cache sensitive data in localStorage:
❌ Magic link tokens
❌ Session secrets
❌ CSRF tokens
❌ Payment info

// OK to cache:
✅ Account profile (name, email)
✅ User settings (theme, language)
✅ Usage history (stats)
✅ Daily usage (counts)
```

### **2. Cache Size Limits:**
```javascript
const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CACHE_ENTRIES = 50;

function cleanupCache() {
    const cache = getCache();
    const entries = Object.entries(cache);
    
    // Remove expired entries first
    const active = entries.filter(([key, value]) => !isExpired(value));
    
    // Still too big? Remove oldest
    if (active.length > MAX_CACHE_ENTRIES) {
        active.sort((a, b) => a[1].cachedAt - b[1].cachedAt);
        active = active.slice(-MAX_CACHE_ENTRIES);
    }
    
    saveCache(Object.fromEntries(active));
}
```

---

## 📊 **EXPECTED IMPROVEMENT:**

### **Before (Current):**
```
Page Load:
├─ initializeAccountFromCookies() → /api/account (50ms)
├─ initializeDailyUsage() → /api/account (80ms)
├─ loadUsageHistory() → /api/account (120ms)
└─ Total: 3 requests in 120ms → 429 Error! ❌

Chart Load:
└─ No data (API blocked) ❌
```

### **After (Optimized):**
```
Page Load:
├─ Check cache → HIT! (0ms) ✓
├─ Return cached account data
├─ Return cached daily usage
├─ Return cached usage history
└─ Total: 0 requests! ✓

Background (5min later):
└─ Refresh cache (1 request) ✓

Chart Load:
└─ Uses cached data → Shows immediately! ✓
```

---

## 🎯 **IMPLEMENTATION FILES:**

### **1. NEW:** `src/utils/apiCache.js`
- Request deduplication
- Response caching with TTL
- Cache key generation
- Cleanup strategies

### **2. NEW:** `src/utils/apiThrottle.js`
- Request throttling
- Rate limiting
- Queue management

### **3. MODIFY:** `src/stores/accountStore.js`
- Use cachedFetch instead of fetch
- Implement stale-while-revalidate
- Add cache invalidation hooks

### **4. MODIFY:** `src/stores/dailyUsageStore.js`
- Use cached API calls
- Shorter TTL for usage data
- Invalidate on increment

### **5. MODIFY:** `src/utils/usageHistoryLoader.js`
- Use cached API calls
- Longer TTL (1 hour)
- Background refresh

---

## ✅ **BENEFITS:**

### **Performance:**
- ⚡ 0ms load time (cache hit)
- ⚡ No API delays
- ⚡ Instant UI updates
- ⚡ Background refresh (non-blocking)

### **Reliability:**
- ✅ No 429 errors
- ✅ Works offline (stale cache)
- ✅ Graceful degradation
- ✅ Automatic retry

### **User Experience:**
- ✅ Instant page loads
- ✅ No loading spinners
- ✅ Always responsive
- ✅ Seamless navigation

### **Backend:**
- ✅ Reduced API load
- ✅ Lower costs
- ✅ Better performance
- ✅ Scalability

---

## 📋 **ROLLOUT PLAN:**

### **Phase 1: Core Caching (Priority)**
1. Create `apiCache.js`
2. Implement deduplication
3. Implement caching with TTL
4. Add to accountStore.js

### **Phase 2: Throttling**
5. Create `apiThrottle.js`
6. Add rate limiting
7. Add queue management

### **Phase 3: Optimization**
8. Stale-while-revalidate
9. Background refresh
10. Cache invalidation hooks

### **Phase 4: Testing**
11. Test with multiple tabs
12. Test with rapid navigation
13. Test with slow network
14. Verify no 429 errors

---

**Soll ich jetzt implementieren? 🚀**

