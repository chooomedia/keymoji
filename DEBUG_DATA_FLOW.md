# 🔍 Data Flow Debug - UsageHistory

## Problem

UsageHistory wird nicht korrekt zwischen Frontend ↔ Backend ↔ Google Sheets synchronisiert.

---

## 🔄 KOMPLETTER FLOW:

### 1️⃣ **User generiert Emoji**

```
EmojiDisplay.svelte
  → handleSuccessfulGeneration()
  → incrementDailyUsage()
```

### 2️⃣ **Increment Daily Usage**

```javascript
// dailyUsageStore.js
incrementDailyUsage()
  ├─ 1. Update dailyLimit store (used++)
  ├─ 2. Save to localStorage (DAILY_USAGE key)
  ├─ 3. Verify localStorage write
  └─ 4. saveUsageToAPI() ← Background, non-blocking
```

### 3️⃣ **Save to API**

```javascript
// dailyUsageStore.js → saveUsageToAPI()
saveUsageToAPI(account, usageData)
  ├─ 1. Call saveToUsageHistory()
  │     └─ Merges heute's data into existing usageHistory array
  │     └─ Returns updatedHistory (last 365 days)
  │
  ├─ 2. Send to Backend:
  │     POST /api/account/update (production)
  │     POST https://n8n.chooomedia.com/webhook/account-update (localhost)
  │
  │     Body: {
  │       action: 'update',
  │       userId: '...',
  │       email: '...',
  │       metadata: {
  │         dailyUsage: {...},
  │         usageHistory: [...] ← CRITICAL!
  │       }
  │     }
  │
  └─ 3. Backend Response wird NICHT zurück-synced! ❌
```

### 4️⃣ **Backend → n8n → Google Sheets**

```
Vercel /api/account/update
  ↓
n8n webhook: xn--moji-pb73c-account (oder account-update)
  ↓
Process Update Node (Code)
  ├─ Parse existing Google Sheets data
  ├─ Parse incoming webhook data
  ├─ SMART MERGE:
  │   finalUsageHistory = incoming.length > existing.length
  │     ? incoming
  │     : existing
  ├─ Output: JSON.stringify(mergedMetadata)
  └─ Send to "Update Google Sheets" node
  ↓
Google Sheets
  metadata column updated
```

### 5️⃣ **Settings Update**

```javascript
// userSettingsStore.js → saveSettingsToAPI()
saveSettingsToAPI(settings)
  ├─ 1. Get LATEST usageHistory:
  │     a) Check usageHistoryStore.data
  │     b) Fallback: localStorage.metadata.usageHistory
  │     c) Fallback: currentAccount.metadata.usageHistory
  │
  ├─ 2. Send to Backend:
  │     Body: {
  │       action: 'update',
  │       metadata: {
  │         ...currentMetadata,
  │         usageHistory: latestUsageHistory, ← Should preserve!
  │         settings: newSettings
  │       }
  │     }
  │
  └─ 3. Response Handler:
        ├─ Parse backend response
        ├─ Update localStorage
        ├─ Update currentAccount store
        └─ Update usageHistory store ✅
```

---

## ❌ PROBLEME IDENTIFIZIERT:

### Problem 1: `saveUsageToAPI()` Response wird nicht synced

**File:** `src/stores/dailyUsageStore.js` (Line 506-566)

**Current:**

```javascript
const result = await response.json();
console.log('✅ Daily usage saved to API:', result);
return result; // ← Wird nicht verwendet!
```

**Should be:**

```javascript
const result = await response.json();

// SYNC response back to stores!
if (result.success && result.account) {
    // Parse and update all stores
    syncBackendResponse(result.account);
}
```

### Problem 2: `account.metadata` ist veraltet

**Location:** Überall wo `account.metadata` verwendet wird

**Current:**

```javascript
const account = get(currentAccount);
metadata: {
  ...(account.metadata || {}),  // ← Könnte alt sein!
  usageHistory: updatedHistory
}
```

**Should be:**

```javascript
// Get FRESH metadata from localStorage
const currentPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
metadata: {
  ...(currentPrefs.metadata || {}),  // ← Aktuellste Daten!
  usageHistory: updatedHistory
}
```

### Problem 3: Webhook URL inkonsistenz

**Files:** `dailyUsageStore.js`, `userSettingsStore.js`

**Current:**

```javascript
// Different URLs for different operations:
WEBHOOKS.ACCOUNT.UPDATE  → '/api/account/update'
'https://n8n.chooomedia.com/webhook/account-update'  ← localhost
'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account'  ← sollte eigentlich verwendet werden!
```

---

## ✅ LÖSUNG:

### Fix 1: Konsistente Webhook URL verwenden

```javascript
// IMMER den gleichen Webhook verwenden (für alle Actions!)
const webhookUrl = 'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account';
```

### Fix 2: Response Sync in saveUsageToAPI()

```javascript
// Nach dem API-Call:
if (result.success && result.account) {
    await syncBackendToLocalStores(result.account);
}
```

### Fix 3: Immer FRISCHE metadata verwenden

```javascript
// Nicht: account.metadata
// Sondern: localStorage → metadata
const currentPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
const freshMetadata = currentPrefs.metadata || {};
```

---

## 🧪 Test Commands:

### Test Backend → Frontend Sync

```bash
# 1. Update name in Google Sheets metadata
# 2. Load in Frontend:
await window.loadRealData()

# 3. Check localStorage:
JSON.parse(localStorage.getItem('keymoji_user_preferences')).metadata.usageHistory.length
```

### Test Frontend → Backend → Frontend Round-Trip

```bash
# 1. Increment usage
# 2. Wait 2 seconds
# 3. Reload page
# 4. Check if usageHistory updated
```
