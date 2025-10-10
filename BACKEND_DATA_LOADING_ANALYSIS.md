# Backend Data Loading - Systematic Analysis

## 🎯 GOAL
Find out why usage history data is not loading from backend for users.

---

## ✅ FIXES DEPLOYED (Commit 133)

### Fix 1: usageHistoryLoader.js - JSON Parsing
**Problem:**
- `loadUsageHistory()` returned `metadata.usageHistory` DIRECTLY
- No JSON parsing for `metadata` (could be string from Google Sheets!)

**Solution:**
- Added `safeJSONParse()` function
- Parse metadata BEFORE extracting usageHistory
- Handles double-escaped JSON from Google Sheets
- Applied to BOTH localhost skip AND API response

**Files Changed:**
- `src/utils/usageHistoryLoader.js`

---

## 📊 DATA FLOW ANALYSIS

### 1. Account Initialization (Session Restore)
**File:** `src/stores/accountStore.js` → `initializeAccountFromCookies()`

**Flow:**
```
1. Check localStorage for userPrefs
2. Call cachedFetchAccount(userId, email, 'read')
3. Get full account data from database (Google Sheets via n8n)
4. Parse profile + metadata with safeJSONParse()
5. Set currentAccount with parsed data
```

**Key Code (Line 904-924):**
```javascript
const fullAccountResult = await cachedFetchAccount(
    userPrefs.userId,
    userPrefs.email,
    'read'
);
```

**Success Path:**
```javascript
accountInfo = {
    ...fullAccountResult.account,
    ...sessionData
};
// Contains metadata.usageHistory from database! ✓
```

**Fallback Path (if API fails):**
```javascript
accountInfo = {
    email: userPrefs.email,
    ...
    metadata: userPrefs.metadata || {},  // ❌ May be empty!
};
console.log('💡 Using cookies fallback (usageHistory may be missing)');
```

---

### 2. Chart Data Loading
**File:** `src/routes/AccountManager.svelte` → `loadChartDataAsync()`

**Flow:**
```
1. Check if currentAccount.metadata.usageHistory exists
2. If yes: Use it
3. If no: Call loadUsageHistoryWithRetry() → API
4. If still empty: Use demo dataset
```

**Key Code (Line 241-255):**
```javascript
const accountHistory = getUsageHistory($currentAccount);

if (accountHistory && accountHistory.length > 0) {
    usageHistory = accountHistory;  // From currentAccount ✓
} else {
    usageHistory = await loadUsageHistoryWithRetry();  // From API
}
```

---

### 3. Data Sources
**Priority Order:**

1. **currentAccount (in-memory store)**
   - Loaded at app start via `initializeAccountFromCookies()`
   - Contains full account data from database
   - If API succeeds: Has usageHistory ✓
   - If API fails: Falls back to cookies (no usageHistory) ❌

2. **API Call (on-demand)**
   - Called if currentAccount has no usageHistory
   - Uses `cachedFetchAccount()` with 1-hour cache
   - On localhost: Skipped (CORS), returns currentAccount data
   - On production: Calls n8n webhook → Google Sheets

3. **Demo Dataset (fallback)**
   - Static data from `demoChartData.js`
   - Used if both above sources are empty
   - Shows overlay explaining it's demo data

---

## 🔍 POTENTIAL ISSUES

### Issue 1: Google Sheets Data ❓
**Question:** Does Google Sheets have usageHistory data?

**Check:**
- Column: `metadata`
- Format: JSON string
- Expected: `{"usageHistory": [{date, used, limit}, ...]}`

**If missing:**
- usageHistory will be empty []
- Chart will show demo data

---

### Issue 2: API Response ❓
**Question:** Does API return usageHistory correctly?

**Check:**
- n8n workflow: `02-account-management.json`
- Action: `read`
- Should return full account with metadata

**Potential Problems:**
- Workflow not returning usageHistory
- metadata not parsed in workflow
- Double-escaped JSON not handled

---

### Issue 3: Localhost CORS Skip ❓
**Question:** On localhost, does currentAccount have usageHistory?

**Check:**
- `usageHistoryLoader.js` line 74-91
- Skips API call on localhost
- Returns: `safeJSONParse(account.metadata).usageHistory`

**Potential Problems:**
- account.metadata is empty object
- Session restore failed (used fallback)
- No data in localStorage

---

## 🧪 DEBUGGING STEPS

### Step 1: Check Browser Console
**Look for:**
```
📊 [CHART DEBUG] Current account state:
  hasUsageHistory: false ← Should be true!
  usageHistoryLength: 0  ← Should be > 0!
```

**If false:**
→ Go to Step 2

---

### Step 2: Check Session Restore
**Look for:**
```
✅ [SESSION RESTORE] Full account data loaded from database (cached):
  hasUsageHistory: false ← Check this!
  usageHistoryLength: 0
```

**If false:**
- API call failed
- Using cookies fallback
→ Go to Step 3

---

### Step 3: Check Google Sheets
**Manually check:**
1. Open Google Sheets
2. Find user row (cm@chooo.de)
3. Check `metadata` column
4. Should contain: `{"usageHistory": [...]}`

**If missing:**
- Add usageHistory data manually
- Or trigger generation to create history

---

### Step 4: Check n8n Workflow
**Test workflow:**
1. Send test request with action: 'read'
2. Check response
3. Verify usageHistory is included

**If missing:**
- Update workflow to include usageHistory
- Check Google Sheets node mapping

---

## ✅ VERIFICATION

After fixes, should see:
```
📊 [CHART DEBUG] Current account state:
  hasUsageHistory: true ✓
  usageHistoryLength: 28 ✓

📊 [CHART DEBUG] Step 3: Chart data loaded from currentAccount: 28 entries
✅ Real usage data from backend: 28 entries
```

---

## 🚀 NEXT ACTIONS

1. ✅ Fixed: JSON parsing in usageHistoryLoader.js
2. 🔍 TODO: Verify Google Sheets has usageHistory
3. 🔍 TODO: Test n8n workflow returns usageHistory
4. 🔍 TODO: Check localhost session restore
5. 🧪 TODO: F5 reload and check console logs

---

**Current Commit:** 133  
**Status:** Analysis complete, fix 1 deployed, verification needed
