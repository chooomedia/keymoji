# 🔄 Migration zu userDataStore - Senior Web Dev Pro

## 🎯 Goal

Ersetze **alle manuellen data fetching calls** durch das **neue robuste, async, cached System**!

## 📋 Migration Checklist

### Phase 1: Setup (5 min)

-   [ ] Import userDataStore in `index.js`
-   [ ] Initialize on app start
-   [ ] Test localhost + production

### Phase 2: Replace Usage (15 min)

-   [ ] AccountManager.svelte (Chart Data)
-   [ ] UserSettings.svelte (Settings Load/Save)
-   [ ] Account Store (Login/Logout integration)

### Phase 3: Cleanup (10 min)

-   [ ] Remove old fetch code
-   [ ] Remove duplicate caching logic
-   [ ] Update documentation

## 🚀 Step-by-Step Migration

### Step 1: Initialize in index.js

```javascript
// src/index.js
import {
    initializeUserData,
    setupAutoRefresh
} from './stores/userDataStore.js';

// After other initializations...
async function initializeApp() {
    // ... existing code ...

    // NEW: Initialize user data stores
    initializeUserData();

    // Optional: Auto-refresh every 5 min
    setupAutoRefresh();
}
```

### Step 2: Integrate in accountStore.js

#### A) On Login:

```javascript
// src/stores/accountStore.js
import { refreshUserSettings, refreshUsageHistory } from './userDataStore.js';

export async function verifyMagicLinkFrontend(token, email) {
    // ... existing login logic ...

    // After successful login, refresh user data
    console.log('🔄 Refreshing user data after login...');
    await Promise.all([
        refreshUserSettings(true), // Force refresh
        refreshUsageHistory(true) // Force refresh
    ]);

    console.log('✅ User data refreshed');
}
```

#### B) On Logout:

```javascript
// src/stores/accountStore.js
import { userSettings, usageHistory } from './userDataStore.js';

export function logout() {
    // ... existing logout logic ...

    // Reset user data stores
    userSettings.set({
        data: null,
        isLoading: false,
        hasError: false,
        isCached: false,
        lastUpdate: null,
        errorMessage: null
    });

    usageHistory.set({
        data: [],
        isLoading: false,
        hasError: false,
        isCached: false,
        lastUpdate: null,
        errorMessage: null,
        stats: { total: 0, average: 0, max: 0, min: 0, trend: 'stable' }
    });

    console.log('✅ User data stores reset');
}
```

### Step 3: Replace AccountManager.svelte

#### BEFORE (Old Pattern):

```javascript
// src/routes/AccountManager.svelte
let usageHistory = [];
let isLoadingChartData = false;

async function loadChartDataAsync() {
    isLoadingChartData = true;
    try {
        const accountHistory = getUsageHistory($currentAccount);
        if (accountHistory && accountHistory.length > 0) {
            usageHistory = accountHistory;
        } else {
            usageHistory = await loadUsageHistoryWithRetry(
                $currentAccount?.userId,
                $currentAccount?.email
            );
        }
    } catch (error) {
        console.error('Failed to load chart data:', error);
        usageHistory = [];
    } finally {
        isLoadingChartData = false;
    }
}
```

#### AFTER (New Pattern):

```javascript
// src/routes/AccountManager.svelte
import {
    usageHistory,
    chartData,
    refreshUsageHistory
} from '../stores/userDataStore.js';

// Reactive (auto-updates!)
$: history = $usageHistory.data || [];
$: stats = $usageHistory.stats;
$: isLoading = $usageHistory.isLoading;
$: isCached = $usageHistory.isCached;

onMount(async () => {
    // Load chart data (uses cache if valid!)
    await refreshUsageHistory();
});

function handleRefresh() {
    // Force refresh on user request
    refreshUsageHistory(true);
}
```

### Step 4: Replace UserSettings.svelte

#### BEFORE (Old Pattern):

```javascript
// src/components/UserSettings.svelte
let settings = null;
let isLoading = false;

async function loadSettings() {
    isLoading = true;
    try {
        const response = await fetch('/api/account');
        const data = await response.json();
        settings = data.account.metadata.settings;
    } catch (error) {
        console.error('Failed to load settings:', error);
    } finally {
        isLoading = false;
    }
}
```

#### AFTER (New Pattern):

```javascript
// src/components/UserSettings.svelte
import { userSettings, refreshUserSettings } from '../stores/userDataStore.js';

// Reactive (auto-updates!)
$: settings = $userSettings.data;
$: isLoading = $userSettings.isLoading;
$: hasError = $userSettings.hasError;
$: isCached = $userSettings.isCached;

onMount(async () => {
    // Load settings (uses cache if valid!)
    await refreshUserSettings();
});

async function handleSave() {
    // Save to backend...
    await saveSettingsToAPI(settings);

    // Force refresh to get updated data
    await refreshUserSettings(true);
}
```

### Step 5: Update Chart Rendering

#### BEFORE:

```javascript
// Manual chart data preparation
const chartLabels = usageHistory.map(e => e.date);
const chartData = usageHistory.map(e => e.used);

// Create chart...
```

#### AFTER:

```javascript
// Use derived chartData store (auto-updates!)
import { chartData } from '../stores/userDataStore.js';

$: if ($chartData && !$chartData.isEmpty) {
    updateChart($chartData);
}

function updateChart(data) {
    new Chart(canvas, {
        type: 'line',
        data: data // Already formatted!
    });
}
```

## 🧹 Cleanup Old Code

### Files to Update:

1. **accountStore.js**:

    - ❌ Remove: `loadUsageHistoryWithRetry`
    - ❌ Remove: Manual fetch in `verifyMagicLinkFrontend`
    - ✅ Add: Import and use `refreshUserSettings`, `refreshUsageHistory`

2. **AccountManager.svelte**:

    - ❌ Remove: `loadChartDataAsync`
    - ❌ Remove: `usageHistory` local variable
    - ❌ Remove: Manual `getUsageHistory` calls
    - ✅ Add: Import `usageHistory`, `chartData` stores
    - ✅ Add: `refreshUsageHistory()` in onMount

3. **UserSettings.svelte**:

    - ❌ Remove: Manual settings loading
    - ❌ Remove: `loadSettingsFromAPI`
    - ✅ Add: Import `userSettings` store
    - ✅ Add: `refreshUserSettings()` in onMount

4. **usageHistoryHelpers.js**:
    - ⚠️ Keep: Helper functions (calculateUsageStats, etc.)
    - ❌ Remove: Direct fetch logic
    - ✅ Update: Import these helpers in userDataStore.js

## 🧪 Testing

### Test Checklist:

#### Localhost:

-   [ ] App starts without errors
-   [ ] Settings load from localStorage
-   [ ] Charts show demo data (expected!)
-   [ ] Console shows "Localhost detected" (good!)
-   [ ] No 404 errors (cached/localStorage fallback works!)

#### Production:

-   [ ] Login works
-   [ ] Settings load from API after login
-   [ ] Settings save to backend
-   [ ] Charts show real data from backend
-   [ ] Cache works (second load is instant!)
-   [ ] Force refresh updates data

### Console Logs (Expected):

#### On App Start (Localhost):

```
🚀 Initializing user data stores...
📦 Settings loaded from cache
📦 Usage history loaded from cache
🌐 Page loaded, refreshing user data...
⚠️ Localhost detected - skipping API call
💡 Using localStorage data
```

#### On Login (Production):

```
🔄 Refreshing user data after login...
🔄 Starting user settings refresh...
📡 Fetching settings from API...
✅ Settings loaded from API
🔄 Starting usage history refresh...
📡 Fetching usage history from API...
✅ Usage history loaded from API: 28 entries
✅ User data refreshed
```

#### On Component Mount (with valid cache):

```
📦 Using cached settings (still valid)
📦 Using cached usage history (still valid)
```

## 📊 Performance Comparison

### Before:

-   **First Load**: 500-1000ms (API call every time)
-   **Refresh**: 500-1000ms (no cache)
-   **Error Handling**: Manual, inconsistent
-   **Localhost**: 404 errors, broken

### After:

-   **First Load**: <10ms (cache) or 100-500ms (API if no cache)
-   **Refresh**: <10ms (cache valid) or 100-500ms (cache expired)
-   **Error Handling**: Automatic fallback to cache
-   **Localhost**: Works perfectly with localStorage fallback

## 🎯 Success Criteria

### Must Have:

-   ✅ No manual fetch() calls for settings/history
-   ✅ All data loads from cache first
-   ✅ Background API refresh works
-   ✅ Localhost works without errors
-   ✅ Production loads from API

### Nice to Have:

-   ✅ Auto-refresh every 5 minutes
-   ✅ Derived chartData store
-   ✅ Loading states in UI
-   ✅ Cache indicators ("Showing cached data")

## 🚨 Common Pitfalls

### ❌ DON'T:

1. Call `refreshX(true)` on every mount (kills cache!)
2. Ignore `isLoading` state (causes flicker)
3. Mix old and new patterns (confusing!)
4. Forget to reset stores on logout (stale data!)

### ✅ DO:

1. Use `refreshX()` without force (respects cache)
2. Show loading indicators
3. Migrate completely (no half-measures!)
4. Test localhost AND production

## 📚 Resources

-   **Main Store**: `src/stores/userDataStore.js`
-   **Documentation**: `src/stores/README_USER_DATA_STORE.md`
-   **Pattern Reference**: `src/stores/appStores.js` (userCounter)

---

**Migration Time**: ~30 minutes
**Effort**: Low (copy-paste patterns!)
**Benefit**: Huge (robust, fast, sexy!)
**Pattern**: Senior Web Dev Pro 🚀
