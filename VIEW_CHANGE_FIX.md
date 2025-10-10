# View Change Bug Fix - Chart verschwindet beim Navigieren

## 🔴 **Problem:**

```
User navigiert: / → /account → / → /account
                      ↓            ↓
              Chart lädt    Chart lädt WIEDER
                            ↓
                      Flickering, Data Loss, Mehrfache API Calls
```

**Symptom:** Chart (und möglicherweise andere Daten) verschwinden beim View-Wechsel.

---

## 🔍 **Root Cause:**

### **File:** `src/routes/AccountManager.svelte`
### **Lines:** 189-192

```javascript
// ❌ PROBLEM: Reactive Block ohne Guard
$: if ($currentAccount && $isLoggedIn) {
    loadChartDataAsync();  // Triggert bei JEDEM View-Wechsel!
}
```

**Was passiert:**
1. User öffnet `/account` → Component mounted → Reactive block runs
2. `loadChartDataAsync()` starts → `isLoadingChartData = true` → Chart skeleton shown
3. Data loads → `isLoadingChartData = false` → Chart visible ✓
4. User navigiert zu `/` → Component unmounted
5. User navigiert zu `/account` → Component mounted WIEDER → Reactive block runs WIEDER
6. `loadChartDataAsync()` starts WIEDER → `isLoadingChartData = true` → Chart verschwindet!
7. Loop: Step 3-6 wiederholen → Flickering!

---

## ✅ **Lösung:**

### **Guard Flags hinzugefügt:**

```javascript
let chartDataLoaded = false;      // Guard: Prevent multiple loads
let lastLoadedUserId = null;      // Track: Which user's data is loaded
```

### **Reactive Block verbessert:**

```diff
- $: if ($currentAccount && $isLoggedIn) {
-     loadChartDataAsync();
- }

+ $: if ($currentAccount && $isLoggedIn && !chartDataLoaded) {
+     const currentUserId = $currentAccount.userId;
+     
+     // Only load if we haven't loaded for this user yet, or if user changed
+     if (currentUserId && currentUserId !== lastLoadedUserId) {
+         console.log('📊 [CHART] Triggering load for user:', currentUserId);
+         lastLoadedUserId = currentUserId;
+         chartDataLoaded = false; // Reset for this user
+         loadChartDataAsync();
+     }
+ }
```

### **Loaded-Flag setzen:**

```javascript
// In loadChartDataAsync() finally block:
finally {
    await new Promise(resolve => setTimeout(resolve, 300));
    isLoadingChartData = false;
+   chartDataLoaded = true; // ← Mark as loaded!
    
    console.log('📊 [CHART DEBUG] Step 5: Loading complete. Final state:', {
        isLoading: false,
        hasError: !!chartDataError,
        dataLength: usageHistory.length,
        chartDataPoints: usageChartData.length,
+       chartDataLoaded: true
    });
}
```

### **Reset on Logout:**

```javascript
function handleLogout() {
    logout();
    sessionExpired = false;
    hasValidSession = false;
    accountExists = false;
    hasLoggedInBefore = false;
    
+   // Reset chart state on logout
+   chartDataLoaded = false;
+   lastLoadedUserId = null;
+   usageHistory = [];
    
    // ... rest of logout logic
}
```

---

## 📊 **Improved Flow:**

### **Scenario 1: First Visit**

```
1. User opens /account
   ↓
2. chartDataLoaded = false → reactive block runs
   ↓
3. loadChartDataAsync() → load data
   ↓
4. chartDataLoaded = true
   ↓
5. Chart visible ✓
```

### **Scenario 2: Navigation (Same User)**

```
1. User navigates: /account → / → /account
   ↓
2. Component remounts
   ↓
3. Reactive block checks: chartDataLoaded === true → SKIP!
   ↓
4. No re-load! Chart data persists in store ✓
```

### **Scenario 3: User Change**

```
1. User A logged in → Chart loaded
   ↓
2. User A logs out
   ↓
3. handleLogout() → chartDataLoaded = false, lastLoadedUserId = null
   ↓
4. User B logs in
   ↓
5. currentUserId !== lastLoadedUserId → Load new data ✓
```

---

## 🧪 **Testing:**

### **Test 1: Navigation Persistence**

```bash
1. npm run dev
2. Login with cm@chooo.de
3. Navigate to /account → Chart loads
4. F12 Console: 
   "📊 [CHART] Triggering load for user: user_1760100551768"
5. Navigate to / (home)
6. Navigate back to /account
7. F12 Console: 
   NO "Triggering load" message! ✓
8. Chart: Still visible! ✓
```

**Expected:**
- Chart loads ONCE
- Chart stays visible during navigation
- No flickering
- No unnecessary API calls

### **Test 2: User Change**

```bash
1. Login as User A
2. Chart loads
3. Logout
4. Login as User B
5. F12 Console:
   "📊 [CHART] Triggering load for user: user_XXXXXXX"
6. New chart data loads ✓
```

**Expected:**
- Chart re-loads for new user
- Old data cleared
- New data shown

### **Test 3: Console Logs**

```javascript
// Open F12 Console and look for these logs:

// First visit to /account:
✓ "📊 [CHART] Triggering load for user: user_1760100551768"
✓ "📊 [CHART DEBUG] Step 1: Starting chart data load..."
✓ "📊 [CHART DEBUG] Step 5: Loading complete. Final state: { chartDataLoaded: true }"

// Navigate away and back:
✓ NO "Triggering load" message
✓ Chart still visible
✓ usageHistory still populated
```

---

## 📦 **Files Changed:**

- `src/routes/AccountManager.svelte`
  - Added `chartDataLoaded` flag
  - Added `lastLoadedUserId` tracker
  - Updated reactive block with guard
  - Set `chartDataLoaded = true` in finally
  - Reset flags on logout

---

## 🎯 **Benefits:**

1. **Performance:** 
   - No unnecessary API calls
   - No re-rendering of chart component
   - Faster navigation

2. **UX:**
   - No flickering
   - Chart stays visible
   - Smooth transitions

3. **Data Persistence:**
   - Data survives route changes
   - Only re-loads on user change
   - Consistent state

4. **Resource Savings:**
   - Fewer n8n webhook calls
   - Fewer Google Sheets reads
   - Lower Vercel costs

---

## 🔧 **Additional Improvements (Optional):**

If other data also disappears on route change, we can apply the same pattern:

```javascript
// For any component that loads data:

let dataLoaded = false;
let lastLoadedId = null;

$: if ($someStore && !dataLoaded) {
    if (someId !== lastLoadedId) {
        lastLoadedId = someId;
        dataLoaded = false;
        loadData();
    }
}

// In loadData() finally:
dataLoaded = true;

// On reset:
dataLoaded = false;
lastLoadedId = null;
```

---

## ✅ **Status:**

- [x] Problem identified (reactive block ohne guard)
- [x] Solution implemented (guard flags)
- [x] Code committed
- [ ] Frontend rebuilt (npm run build)
- [ ] Deployed to production
- [ ] Tested in production

---

**Created:** 2025-10-10  
**Fixed in:** Commit dd76b72  
**Status:** Ready for Testing 🧪

