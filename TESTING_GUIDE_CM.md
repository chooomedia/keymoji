# Testing Guide for cm@chooo.de - Chart Data Flow

## 🎯 Complete Testing Workflow

---

## 📋 **STEP 1: Update Google Sheets**

### **Find the row for cm@chooo.de:**
- UserId: `user_1753963152928`
- Email: `cm@chooo.de`

### **Update Spalte G (metadata):**

**Copy this COMPLETE STRING (single line, no breaks):**

```
{"settings":{"name":"chooo123456","language":"en","theme":"dark","notifications":true,"passwordLength":8,"includeNumbers":true,"includeSymbols":true,"includeUppercase":true,"includeLowercase":true,"emojiCount":9,"emojiCategories":["faces","animals","food"],"excludeEmojis":[],"autoGenerate":false,"copyToClipboard":true,"showStrength":true,"saveHistory":false,"analytics":true,"shareUsage":false,"uiState":{"expandedSections":["basic"]}},"dailyUsage":{"date":"2025-10-10","used":5,"limit":9,"lastReset":"2025-10-10","lastIncrement":"2025-10-10T14:00:00.000Z"},"usageHistory":[{"date":"2025-10-10","used":5,"limit":9,"timestamp":"2025-10-10T12:00:00.000Z"},{"date":"2025-10-09","used":7,"limit":9,"timestamp":"2025-10-09T12:00:00.000Z"},{"date":"2025-10-08","used":4,"limit":9,"timestamp":"2025-10-08T12:00:00.000Z"},{"date":"2025-10-07","used":6,"limit":9,"timestamp":"2025-10-07T12:00:00.000Z"},{"date":"2025-10-06","used":3,"limit":9,"timestamp":"2025-10-06T12:00:00.000Z"},{"date":"2025-10-05","used":2,"limit":9,"timestamp":"2025-10-05T12:00:00.000Z"},{"date":"2025-10-04","used":8,"limit":9,"timestamp":"2025-10-04T12:00:00.000Z"},{"date":"2025-10-03","used":6,"limit":9,"timestamp":"2025-10-03T12:00:00.000Z"},{"date":"2025-10-02","used":7,"limit":9,"timestamp":"2025-10-02T12:00:00.000Z"},{"date":"2025-10-01","used":5,"limit":9,"timestamp":"2025-10-01T12:00:00.000Z"},{"date":"2025-09-30","used":4,"limit":9,"timestamp":"2025-09-30T12:00:00.000Z"},{"date":"2025-09-29","used":3,"limit":9,"timestamp":"2025-09-29T12:00:00.000Z"},{"date":"2025-09-28","used":2,"limit":9,"timestamp":"2025-09-28T12:00:00.000Z"},{"date":"2025-09-27","used":8,"limit":9,"timestamp":"2025-09-27T12:00:00.000Z"},{"date":"2025-09-26","used":6,"limit":9,"timestamp":"2025-09-26T12:00:00.000Z"},{"date":"2025-09-25","used":7,"limit":9,"timestamp":"2025-09-25T12:00:00.000Z"},{"date":"2025-09-24","used":5,"limit":9,"timestamp":"2025-09-24T12:00:00.000Z"},{"date":"2025-09-23","used":4,"limit":9,"timestamp":"2025-09-23T12:00:00.000Z"},{"date":"2025-09-22","used":6,"limit":9,"timestamp":"2025-09-22T12:00:00.000Z"},{"date":"2025-09-21","used":3,"limit":9,"timestamp":"2025-09-21T12:00:00.000Z"},{"date":"2025-09-20","used":7,"limit":9,"timestamp":"2025-09-20T12:00:00.000Z"},{"date":"2025-09-19","used":5,"limit":9,"timestamp":"2025-09-19T12:00:00.000Z"},{"date":"2025-10-18","used":8,"limit":9,"timestamp":"2025-09-18T12:00:00.000Z"},{"date":"2025-09-17","used":6,"limit":9,"timestamp":"2025-09-17T12:00:00.000Z"},{"date":"2025-09-16","used":4,"limit":9,"timestamp":"2025-09-16T12:00:00.000Z"},{"date":"2025-09-15","used":7,"limit":9,"timestamp":"2025-09-15T12:00:00.000Z"},{"date":"2025-09-14","used":5,"limit":9,"timestamp":"2025-09-14T12:00:00.000Z"},{"date":"2025-09-13","used":6,"limit":9,"timestamp":"2025-09-13T12:00:00.000Z"}],"source":"magic_link_verification","tier":"free","updatedAt":"2025-10-10T14:00:00.000Z","updatedVia":"manual-google-sheets-update"}
```

### **Update Spalte F (profile):**

```
{"name":"chooo123456"}
```

**IMPORTANT:** Make sure there are NO line breaks! Must be single line!

✅ Save the Google Sheet (Ctrl+S or auto-save)

---

## 📋 **STEP 2: Start Development Server**

```bash
cd /Users/chooom/dev/kmoji/keymoji
npm run dev
```

Wait for: `Server running at http://localhost:8080`

---

## 📋 **STEP 3: Login**

1. Open browser: `http://localhost:8080/de/account`
2. Enter email: `cm@chooo.de`
3. Click "Send Magic Link"
4. Check email and click link
5. You should be redirected to `/de/account`

---

## 📋 **STEP 4: Open Browser Console (F12)**

**Immediately after login, check console output!**

---

## ✅ **EXPECTED Console Output (Success):**

```
═══════════════════════════════════════════════════════
🔍 FULL DIAGNOSIS - Automatic on page load
═══════════════════════════════════════════════════════

🔄 [ACCOUNT DEBUG] syncAccountData: Raw data received: {
    profileType: "string",
    metadataType: "string",
    userId: "user_1753963152928",
    email: "cm@chooo.de"
}

✅ [ACCOUNT DEBUG] Parsed data: {
    metadata: {
        hasSettings: true,
        hasDailyUsage: true,
        hasUsageHistory: true,
        usageHistoryType: "object",
        usageHistoryIsArray: true,
        usageHistoryLength: 28,
        firstEntry: {date: "2025-10-10", used: 5, ...},
        lastEntry: {date: "2025-09-13", used: 6, ...}
    }
}

✅ [ACCOUNT DEBUG] UsageHistory entries: 28

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
    firstEntry: {date: "2025-10-10", used: 5, ...},
    lastEntry: {date: "2025-09-13", used: 6, ...}
}

✅ [CHART DEBUG] Step 3: Chart data loaded from currentAccount: 28 entries
✅ [CHART DEBUG] First 3 entries: [
    {date: "2025-10-10", used: 5, ...},
    {date: "2025-10-09", used: 7, ...},
    {date: "2025-10-08", used: 4, ...}
]

✅ [CHART DEBUG] History is current (no refresh needed)

📊 [CHART DEBUG] Step 4: Final usageHistory: {
    length: 28,
    dateRange: "2025-09-13 to 2025-10-10"
}

📊 [CHART DEBUG] generateChartData() called: {
    period: "7d",
    historyLength: 28,
    historyIsArray: true
}

📊 [CHART DEBUG] Generating data for 7 days

📊 [CHART DEBUG] Generated chart data: {
    dataPoints: 7,
    firstPoint: {date: "2025-10-04", value: 8},
    lastPoint: {date: "2025-10-10", value: 5},
    nonZeroPoints: 7
}

📊 [CHART DEBUG] Step 5: Loading complete. Final state: {
    isLoading: false,
    hasError: false,
    dataLength: 28,
    chartDataPoints: 7
}
```

---

## ❌ **IF ERRORS Occur:**

### **Run Full Diagnosis:**

```javascript
window.chartDebugger.fullDiagnosis()
```

This will tell you EXACTLY what's wrong and how to fix it!

### **Common Issues:**

#### **Issue 1: Metadata is STRING**
```
❌ PROBLEM: Metadata is still a STRING (not parsed)!
```

**Fix:**
```javascript
window.chartDebugger.forceParseMetadata()
// Then reload: location.reload()
```

#### **Issue 2: No usageHistory**
```
❌ PROBLEM: No usageHistory field in metadata!
Available metadata fields: ["settings", "dailyUsage"]
```

**Fix:** Google Sheets metadata doesn't have `usageHistory`. Update it with the complete string above!

#### **Issue 3: Empty array**
```
❌ PROBLEM: usageHistory is empty array!
```

**Quick Test Fix:**
```javascript
window.chartDebugger.injectTestData()
location.reload()
```

**Permanent Fix:** Update Google Sheets

---

## 📊 **EXPECTED Chart Visual:**

After successful load, you should see:

```
┌─────────────────────────────────────────────────────┐
│  Daily Generations        [7d][14d][4w][1y]   4/9  │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 9 ─────────────────────────────────────────── │ │
│  │                                                │ │
│  │     *     *       *                           │ │
│  │   *   * *   *   *   *   *       *             │ │
│  │ *       *   * *   *   *   * * *   * *         │ │
│  │   *       *     *       *           *         │ │
│  │ 0 ─────────────────────────────────────────── │ │
│  │   13.9        1.10           10.10            │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ███████████████████████████░░░░░  (55%)            │
│  You can still generate emojis!                     │
└─────────────────────────────────────────────────────┘
```

**Features:**
- ✅ 28 data points visible (when "4w" selected)
- ✅ Yellow line (FREE tier)
- ✅ Smooth animation on load
- ✅ Interactive tooltips on hover
- ✅ Time period selector works

---

## 🧪 **Manual Verification Commands:**

### **After login, run these in console:**

```javascript
// 1. Quick validation
window.chartDebugger.quickCheck()
// Expected: "✅ All checks passed!"

// 2. Check account data
const account = window.$currentAccount;
console.log('Metadata type:', typeof account?.metadata);
console.log('UsageHistory length:', account?.metadata?.usageHistory?.length);
// Expected: "object" and 28

// 3. Full diagnosis
window.chartDebugger.fullDiagnosis()
// Expected: Complete flow analysis with all ✅
```

---

## 🔧 **Troubleshooting Workflow:**

```
1. Run: window.chartDebugger.fullDiagnosis()
   ↓
2. Read the diagnosis output
   ↓
3. Follow suggested solution
   ↓
4. If "metadata is string":
   → Run: window.chartDebugger.forceParseMetadata()
   → Reload page
   ↓
5. If "no usageHistory":
   → Update Google Sheets with complete metadata
   → Logout and login again
   ↓
6. If nothing works:
   → Run: window.chartDebugger.injectTestData()
   → Reload page
   → Chart should show test data
   ↓
7. Share console output for further help
```

---

## 📊 **What Each Debug Tool Does:**

### **1. fullDiagnosis()**
- Checks account store
- Validates metadata parsing
- Inspects usageHistory structure
- Simulates chart data generation
- Identifies exact problem location
- Suggests specific solutions

### **2. quickCheck()**
- Fast yes/no validation
- Returns true if everything OK
- Shows which checks failed

### **3. forceParseMetadata()**
- Manually parses metadata if it's a string
- Updates currentAccount store
- Fixes most common parsing issues

### **4. injectTestData()**
- Creates 28 days of realistic test data
- Injects into currentAccount store
- Useful for immediate chart testing
- Does NOT save to database (temporary)

---

## ✅ **Success Indicators:**

### **Console Logs (all ✅):**
```
✅ [ACCOUNT DEBUG] Parsed data
✅ [ACCOUNT DEBUG] UsageHistory entries: 28
✅ [CHART DEBUG] Chart data loaded from currentAccount: 28 entries
✅ [CHART DEBUG] Generated chart data: {nonZeroPoints: 28}
```

### **Visual (all ✅):**
- ✅ Loading skeleton appears briefly (300-600ms)
- ✅ Chart fades in smoothly
- ✅ Yellow line visible
- ✅ 28 data points (circles) visible
- ✅ X-axis shows dates (13.9 - 10.10)
- ✅ Y-axis shows values (0 - 9)
- ✅ Hover shows tooltips
- ✅ Time period buttons work

### **Store Data (all ✅):**
```javascript
window.$currentAccount.metadata.usageHistory.length === 28
Array.isArray(window.$currentAccount.metadata.usageHistory) === true
typeof window.$currentAccount.metadata === "object"
```

---

## 🚨 **Red Flags (Something Wrong):**

### **Console Logs (any ❌):**
```
❌ usageHistoryType: "string"
❌ usageHistoryIsArray: false
❌ usageHistoryLength: 0
❌ Failed to load chart data
⚠️ [CHART DEBUG] No history in currentAccount, fetching from API...
```

### **Visual (any ❌):**
- ❌ Chart shows "No data available"
- ❌ Error message with retry button
- ❌ Loading skeleton stuck
- ❌ No animation
- ❌ Flat line at 0

---

## 💡 **Quick Fixes for Common Issues:**

### **Fix 1: Metadata Not Parsed**
```javascript
// Check
typeof window.$currentAccount?.metadata
// If returns "string":

// Fix
window.chartDebugger.forceParseMetadata()
location.reload()
```

### **Fix 2: No Data in Google Sheets**
```javascript
// Quick test with fake data
window.chartDebugger.injectTestData()
location.reload()

// If chart shows up: Google Sheets needs updating
// If chart still empty: Different problem
```

### **Fix 3: API Not Returning Data**
```javascript
// Check network tab (F12 → Network)
// Look for: POST /api/account or n8n webhook
// Check response: Should contain metadata.usageHistory
```

---

## 📞 **Debugging Support:**

### **If still not working, run and share:**

```javascript
// Copy this COMPLETE output:
console.log('=== DEBUG REPORT FOR SUPPORT ===');
console.log('User:', window.$currentAccount?.email);
console.log('Date:', new Date().toISOString());
console.log('Browser:', navigator.userAgent);
console.log('');

console.log('Account State:');
console.log('  Has account:', !!window.$currentAccount);
console.log('  Metadata type:', typeof window.$currentAccount?.metadata);
console.log('  UsageHistory type:', typeof window.$currentAccount?.metadata?.usageHistory);
console.log('  UsageHistory length:', window.$currentAccount?.metadata?.usageHistory?.length);
console.log('');

console.log('Full Diagnosis:');
window.chartDebugger.fullDiagnosis();
```

---

## 🎯 **Testing Checklist:**

- [ ] Google Sheets updated with complete metadata
- [ ] Metadata is single line (no line breaks)
- [ ] Dev server running (`npm run dev`)
- [ ] Logged in as cm@chooo.de
- [ ] Browser console open (F12)
- [ ] Run `window.chartDebugger.fullDiagnosis()`
- [ ] All diagnosis steps show ✅
- [ ] Chart visible on /account page
- [ ] Chart shows 28 data points
- [ ] Chart animates smoothly
- [ ] Time period selector works
- [ ] No console errors

---

## 🚀 **Expected Timeline:**

```
0ms     Open /de/account page
100ms   Account loaded from cookies/API
200ms   syncAccountData() parses metadata
300ms   Chart loading starts
400ms   getUsageHistory() extracts 28 entries
500ms   generateChartData() creates chart data
600ms   Loading skeleton visible
900ms   Chart fades in
1000ms  Line starts drawing
1800ms  First data points appear
2550ms  All 28 points visible
3000ms  ✅ Chart fully interactive!
```

---

## 📦 **Files to Check:**

### **Frontend:**
- `src/stores/accountStore.js` - safeJSONParse()
- `src/routes/AccountManager.svelte` - loadChartDataAsync()
- `src/utils/chartDebugger.js` - Debug tools
- `src/utils/usageHistoryHelpers.js` - getUsageHistory()

### **Backend:**
- `keymoji-backend/api/account.js` - API endpoint
- `n8n-workflows/02-account-management-COMPLETE-v2.json` - Workflow

### **Database:**
- Google Sheets: "accounts" sheet
- Row for user_1753963152928
- Column G (metadata)

---

**TL;DR:**
1. Update Google Sheets metadata (copy string above)
2. Start dev server (`npm run dev`)
3. Login as cm@chooo.de
4. Open Console (F12)
5. Run: `window.chartDebugger.fullDiagnosis()`
6. Follow any suggestions if errors
7. Chart should show 28 days! 🎉

