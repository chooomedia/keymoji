# Chart Data Loading - Debug Guide

## 🐛 Debug Flow: Step-by-Step Verification

### **Expected Console Output (Successful Load):**

```
Step 1: Account Store (accountStore.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 [ACCOUNT DEBUG] syncAccountData: Raw data received: {
    profileType: "string",
    metadataType: "string",
    hasUserId: true,
    userId: "user_1753963152928",
    email: "cm@chooo.de"
}

✅ [ACCOUNT DEBUG] Parsed data: {
    profile: {},
    metadata: {
        hasSettings: true,
        hasDailyUsage: true,
        hasUsageHistory: true,
        usageHistoryType: "object",
        usageHistoryIsArray: true,
        usageHistoryLength: 28,
        firstEntry: { date: "2025-10-10", used: 5, ... },
        lastEntry: { date: "2025-09-13", used: 6, ... }
    }
}

✅ [ACCOUNT DEBUG] syncAccountData: Account synced with createdAt: "2025-07-31T23:19:26.866Z"
✅ [ACCOUNT DEBUG] syncAccountData: UsageHistory entries: 28
✅ [ACCOUNT DEBUG] syncAccountData: Complete metadata structure: {
    settings: true,
    dailyUsage: true,
    usageHistory: true,
    usageHistoryLength: 28
}

Step 2: Account Manager (AccountManager.svelte)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 [CHART DEBUG] Step 1: Starting chart data load...
📊 [CHART DEBUG] Current account state: {
    hasAccount: true,
    userId: "user_1753963152928",
    hasMetadata: true,
    metadataType: "object",
    hasUsageHistory: true,
    usageHistoryType: "object",
    usageHistoryLength: 28
}

📊 [CHART DEBUG] Step 2: getUsageHistory() returned: {
    isArray: true,
    length: 28,
    firstEntry: { date: "2025-10-10", used: 5, ... },
    lastEntry: { date: "2025-09-13", used: 6, ... }
}

✅ [CHART DEBUG] Step 3: Chart data loaded from currentAccount: 28 entries
✅ [CHART DEBUG] First 3 entries: [
    { date: "2025-10-10", used: 5, ... },
    { date: "2025-10-09", used: 7, ... },
    { date: "2025-10-08", used: 4, ... }
]

✅ [CHART DEBUG] History is current (no refresh needed)

📊 [CHART DEBUG] Step 4: Final usageHistory: {
    length: 28,
    dateRange: "2025-09-13 to 2025-10-10"
}

Step 3: Generate Chart Data (AccountManager.svelte)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 [CHART DEBUG] generateChartData() called: {
    period: "4w",
    historyLength: 28,
    historyIsArray: true
}

📊 [CHART DEBUG] Generating data for 28 days

📊 [CHART DEBUG] Generated chart data: {
    dataPoints: 28,
    firstPoint: { date: "2025-09-13", value: 6 },
    lastPoint: { date: "2025-10-10", value: 5 },
    nonZeroPoints: 28
}

📊 [CHART DEBUG] Step 5: Loading complete. Final state: {
    isLoading: false,
    hasError: false,
    dataLength: 28,
    chartDataPoints: 28
}
```

---

## ❌ Common Issues & Solutions

### **Issue 1: usageHistory is undefined**

```
❌ [ACCOUNT DEBUG] Parsed data: {
    metadata: {
        hasUsageHistory: false,
        usageHistoryType: "undefined",
        usageHistoryLength: 0
    }
}
```

**Cause:** Google Sheets `metadata` column doesn't contain `usageHistory`

**Solution:**
1. Check Google Sheets `metadata` column
2. Ensure it contains the complete JSON string
3. Verify `usageHistory` array is present

---

### **Issue 2: usageHistory is a string (not parsed)**

```
❌ [ACCOUNT DEBUG] Parsed data: {
    metadata: {
        hasUsageHistory: true,
        usageHistoryType: "string",  ← WRONG! Should be "object"
        usageHistoryIsArray: false   ← WRONG! Should be true
    }
}
```

**Cause:** Double-encoded JSON or n8n workflow not parsing

**Solution:**
1. Check `safeJSONParse()` in `accountStore.js`
2. Verify n8n workflow has "Parse Response" Code Node
3. Check if metadata is being parsed twice

---

### **Issue 3: usageHistory is empty array**

```
✅ [ACCOUNT DEBUG] Parsed data: {
    metadata: {
        hasUsageHistory: true,
        usageHistoryIsArray: true,
        usageHistoryLength: 0  ← WRONG! Should be 28
    }
}
```

**Cause:** Data not saved to Google Sheets

**Solution:**
1. Manually update Google Sheets with complete metadata
2. Use the string from `GOOGLE_SHEETS_COMPLETE_ROW_CM.md`
3. Verify save was successful

---

### **Issue 4: Chart shows "No Data" even with 28 entries**

```
✅ [CHART DEBUG] Step 3: Chart data loaded from currentAccount: 28 entries
✅ [CHART DEBUG] Generated chart data: {
    dataPoints: 28,
    nonZeroPoints: 0  ← WRONG! All values are 0
}
```

**Cause:** Date mismatch between history and generated data

**Solution:**
1. Check date format in `usageHistory` (should be "YYYY-MM-DD")
2. Verify dates are in correct range
3. Check timezone issues

---

## 🧪 Manual Testing Commands

### **Test 1: Check currentAccount Store**

```javascript
// Open Browser Console (F12)
const account = window.$currentAccount;

console.log('=== ACCOUNT DEBUG ===');
console.log('Has account:', !!account);
console.log('User ID:', account?.userId);
console.log('Has metadata:', !!account?.metadata);
console.log('Metadata type:', typeof account?.metadata);
console.log('Has usageHistory:', !!account?.metadata?.usageHistory);
console.log('UsageHistory type:', typeof account?.metadata?.usageHistory);
console.log('UsageHistory is array:', Array.isArray(account?.metadata?.usageHistory));
console.log('UsageHistory length:', account?.metadata?.usageHistory?.length);
console.log('First entry:', account?.metadata?.usageHistory?.[0]);
console.log('Last entry:', account?.metadata?.usageHistory?.[account?.metadata?.usageHistory?.length - 1]);
```

**Expected Output:**
```
=== ACCOUNT DEBUG ===
Has account: true
User ID: "user_1753963152928"
Has metadata: true
Metadata type: "object"
Has usageHistory: true
UsageHistory type: "object"
UsageHistory is array: true
UsageHistory length: 28
First entry: {date: "2025-10-10", used: 5, limit: 9, ...}
Last entry: {date: "2025-09-13", used: 6, limit: 9, ...}
```

---

### **Test 2: Force Reload Chart Data**

```javascript
// In Browser Console
// Trigger chart reload manually
window.location.reload();

// OR force re-render
// Navigate away and back
window.location.href = '/de/';
// Then navigate back to /de/account
```

---

### **Test 3: Check API Response**

```javascript
// Intercept API call
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('API CALL:', args[0]);
    return originalFetch.apply(this, args).then(response => {
        return response.clone().json().then(data => {
            console.log('API RESPONSE:', data);
            return response;
        });
    });
};
```

---

## 🔧 Quick Fixes

### **Fix 1: Force Parse Metadata**

If metadata is coming as a string, add this to Browser Console:

```javascript
// Get current account
const account = window.$currentAccount;

// Force parse metadata if it's a string
if (typeof account.metadata === 'string') {
    account.metadata = JSON.parse(account.metadata);
    console.log('✅ Metadata parsed manually');
    console.log('UsageHistory length:', account.metadata.usageHistory.length);
}
```

---

### **Fix 2: Manually Set usageHistory**

For testing, you can manually inject data:

```javascript
// Inject test data
window.$currentAccount.metadata.usageHistory = [
    {date: "2025-10-10", used: 5, limit: 9},
    {date: "2025-10-09", used: 7, limit: 9},
    {date: "2025-10-08", used: 4, limit: 9},
    // ... add all 28 entries
];

console.log('✅ Test data injected');
// Reload page to see chart
```

---

## 📊 Expected Chart Behavior

### **After Successful Load:**

1. **Loading Skeleton (0-600ms)**
   - Gray pulsing lines
   - Loading spinner
   - Text: "📊 Loading chart data..."

2. **Chart Appears (600-1000ms)**
   - Smooth fade-in transition
   - Yellow line (FREE tier) or Purple line (PRO tier)
   - 28 data points visible

3. **Animation (800-2550ms)**
   - Line draws from left to right
   - Data points appear one by one (staggered)
   - Each point +50ms delay

4. **Interactive (2550ms+)**
   - Hover shows tooltips
   - Time period selector works (7d, 14d, 4w, 1y)
   - Chart responds to clicks

---

## 🚨 Red Flags

### **Console shows these? Something is wrong:**

```
❌ usageHistoryType: "string"
❌ usageHistoryIsArray: false
❌ usageHistoryLength: 0
❌ nonZeroPoints: 0
❌ Failed to load chart data
❌ No history in currentAccount, fetching from API...
```

### **Console should show these:**

```
✅ usageHistoryType: "object"
✅ usageHistoryIsArray: true
✅ usageHistoryLength: 28
✅ nonZeroPoints: 28
✅ Chart data loaded from currentAccount: 28 entries
✅ History is current (no refresh needed)
```

---

## 🔍 Checklist for Debugging

- [ ] **Google Sheets:** metadata column contains complete JSON string
- [ ] **Google Sheets:** usageHistory has 28 entries
- [ ] **n8n Workflow:** "Parse Response" Code Node exists
- [ ] **n8n Workflow:** Returns parsed objects (not strings)
- [ ] **accountStore.js:** safeJSONParse() is working
- [ ] **accountStore.js:** Logs show "usageHistoryLength: 28"
- [ ] **AccountManager:** Logs show "Chart data loaded: 28 entries"
- [ ] **AccountManager:** Logs show "Generated chart data: 28 points"
- [ ] **LineChart:** Component receives data prop with 28 items
- [ ] **Browser:** No console errors
- [ ] **Network Tab:** API request succeeded (200 OK)
- [ ] **Network Tab:** Response contains usageHistory array

---

## 📝 Debug Log Template

Copy this and share when reporting issues:

```
=== CHART DEBUG REPORT ===
Date: [YYYY-MM-DD HH:MM]
User: cm@chooo.de
Browser: [Chrome/Firefox/Safari]
Environment: [localhost/production]

1. Account Store:
   - Has account: [true/false]
   - Has metadata: [true/false]
   - Metadata type: [string/object]
   - UsageHistory is array: [true/false]
   - UsageHistory length: [number]

2. Chart Loading:
   - Loading started: [true/false]
   - Data source: [currentAccount/API]
   - Final data length: [number]
   - Chart rendered: [true/false]

3. Console Errors:
   [paste any error messages]

4. Network Request:
   - Status: [200/400/500]
   - Response size: [bytes]
   - usageHistory in response: [true/false]
```

---

**Use this guide to systematically debug chart data loading issues! 🔍**

