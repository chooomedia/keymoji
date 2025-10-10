# Quick Debug Steps - Chart Not Showing Data

## 🚨 Problem: Fallback triggered, no data displayed

---

## ⚡ QUICK FIX - 3 Steps

### **Step 1: Open Browser Console (F12)**

### **Step 2: Run Full Diagnosis**

```javascript
window.chartDebugger.fullDiagnosis();
```

This will show you EXACTLY where the problem is!

### **Step 3: Follow the Solution**

The diagnosis will tell you what to do.

---

## 🔍 Common Problems & Instant Solutions

### **Problem A: Metadata is still a STRING**

**Console shows:**

```
❌ PROBLEM: Metadata is still a STRING (not parsed)!
Raw metadata preview: {"settings":{...
```

**Instant Fix:**

```javascript
window.chartDebugger.forceParseMetadata();
```

Then reload page (F5).

---

### **Problem B: No usageHistory field**

**Console shows:**

```
❌ PROBLEM: No usageHistory field in metadata!
Available metadata fields: ["settings", "dailyUsage"]
```

**Fix:** Update Google Sheets metadata column with complete string from `GOOGLE_SHEETS_COMPLETE_ROW_CM.md`

---

### **Problem C: usageHistory is empty**

**Console shows:**

```
❌ PROBLEM: usageHistory is empty array!
```

**Instant Fix (for testing):**

```javascript
window.chartDebugger.injectTestData();
```

Then reload page (F5).

**Permanent Fix:** Update Google Sheets with complete data.

---

### **Problem D: Date mismatch**

**Console shows:**

```
❌ PROBLEM: No data points match current date range!
History date range: 2025-09-13 to 2025-10-10
Chart expecting: 2025-10-12 to 2025-11-08
```

**Fix:** Your system clock might be wrong, or history dates are old. Update `usageHistory` with current dates.

---

## 🧪 Test If Fix Worked

After applying any fix, run:

```javascript
window.chartDebugger.quickCheck();
```

**Expected:**

```
✅ All checks passed!
✅ hasAccount: true
✅ hasMetadata: true
✅ metadataIsObject: true
✅ hasUsageHistory: true
✅ usageHistoryIsArray: true
✅ usageHistoryLength: 28
```

---

## 📊 Manual Data Inspection

```javascript
// Check raw currentAccount
const account = window.$currentAccount;

// 1. Check metadata type
console.log('Metadata type:', typeof account?.metadata);

// 2. If STRING - parse it manually
if (typeof account?.metadata === 'string') {
    try {
        const parsed = JSON.parse(account.metadata);
        console.log('Parsed metadata:', parsed);
        console.log('UsageHistory:', parsed.usageHistory?.length);
    } catch (e) {
        console.error('Parse failed:', e);
    }
}

// 3. If OBJECT - check usageHistory
if (typeof account?.metadata === 'object') {
    console.log('UsageHistory:', account.metadata.usageHistory);
    console.log('Length:', account.metadata.usageHistory?.length);
}
```

---

## 🔧 Nuclear Option - Inject Data Directly

If nothing works, inject data directly for testing:

```javascript
// This injects 28 days of test data
window.chartDebugger.injectTestData();

// Then reload page
location.reload();

// Chart should now show data!
```

---

## 📝 Debug Report Template

If issues persist, copy console output and share:

```javascript
// Run this and copy the output:
console.log('=== DEBUG REPORT ===');
console.log('User:', window.$currentAccount?.email);
console.log('Metadata type:', typeof window.$currentAccount?.metadata);
console.log(
    'UsageHistory type:',
    typeof window.$currentAccount?.metadata?.usageHistory
);
console.log(
    'UsageHistory length:',
    window.$currentAccount?.metadata?.usageHistory?.length
);
console.log('Has data:', !!window.$currentAccount?.metadata?.usageHistory);
console.log('=== RUN FULL DIAGNOSIS ===');
window.chartDebugger.fullDiagnosis();
```

---

## ✅ Expected Working State

After all fixes, console should show:

```
✅ [ACCOUNT DEBUG] Parsed data: {
    metadata: {
        usageHistoryIsArray: true,
        usageHistoryLength: 28
    }
}

✅ [CHART DEBUG] Chart data loaded from currentAccount: 28 entries
✅ [CHART DEBUG] Generated chart data: {
    dataPoints: 28,
    nonZeroPoints: 28
}
```

And chart should display 28 data points with animation!

---

**TL;DR:**

1. Open Console (F12)
2. Run: `window.chartDebugger.fullDiagnosis()`
3. Follow the solution it provides
4. If desperate: `window.chartDebugger.injectTestData()` + reload
