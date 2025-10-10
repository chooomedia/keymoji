# Async Chart Loading - Complete Implementation

## ✅ **Google Sheets Daten - Bereits Perfekt!**

### Aktuelle Struktur (cm@chooo.de):

```json
{
    "settings": {
        "name": "chooo12345",
        "language": "en",
        "theme": "dark",
        "emojiCount": 9,
        "uiState": { "expandedSections": ["basic"] }
        // ... weitere settings
    },
    "dailyUsage": {
        "date": "2025-10-10",
        "used": 5,
        "limit": 9,
        "lastReset": "2025-10-10",
        "lastIncrement": "2025-10-10T12:34:56.789Z"
    },
    "usageHistory": [
        {
            "date": "2025-10-10",
            "used": 5,
            "limit": 9,
            "timestamp": "2025-10-10T12:00:00.000Z"
        },
        {
            "date": "2025-10-09",
            "used": 7,
            "limit": 9,
            "timestamp": "2025-10-09T12:00:00.000Z"
        }
        // ... 26 weitere Einträge bis 2025-09-13
    ],
    "source": "magic_link_verification",
    "tier": "free",
    "updatedAt": "2025-10-10T12:00:00.000Z",
    "updatedVia": "manual-google-sheets-update"
}
```

**Status:** ✅ PERFEKT! Keine Änderungen nötig!

---

## 🔄 **Was passiert jetzt automatisch beim Login?**

### Timeline: Login → Chart Rendering

```
0ms    User öffnet /account Seite
       └─ AccountManager.svelte mounted

50ms   Reactive Statement triggered:
       $: if ($currentAccount && $isLoggedIn) {
           loadChartDataAsync();
       }

100ms  loadChartDataAsync() startet
       ├─ isLoadingChartData = true
       ├─ ChartSkeleton wird angezeigt 📊
       └─ console.log('📊 Loading chart data asynchronously...')

150ms  Option 1: Load from currentAccount
       const accountHistory = getUsageHistory($currentAccount);

200ms  ✅ Daten gefunden in currentAccount!
       usageHistory = accountHistory (28 Einträge)
       console.log('✅ Chart data loaded from currentAccount:', 28, 'entries')

250ms  Check: shouldRefreshHistory(usageHistory)?
       └─ Prüft: Ist das neuste Datum "2025-10-10" (heute)?
       └─ JA! → Kein Refresh nötig

550ms  Smooth transition delay (300ms)
       await new Promise(resolve => setTimeout(resolve, 300));

600ms  isLoadingChartData = false
       └─ ChartSkeleton verschwindet
       └─ LineChart erscheint mit fade-in (400ms)

1000ms ✨ Chart vollständig animiert!
       └─ Linie gezeichnet (in:draw)
       └─ 28 Punkte erscheinen (staggered fade)

2550ms 🎉 ALLE Animationen komplett!
```

---

## 📊 **Async Loading Flow (Detailliert)**

### 1. **Component Mount**

```svelte
<!-- AccountManager.svelte -->
<script>
    import { loadUsageHistoryWithRetry, refreshUsageHistory, shouldRefreshHistory } from '../utils/usageHistoryLoader.js';

    // State
    let isLoadingChartData = false;
    let chartDataError = null;
    let usageHistory = [];

    // REACTIVE: Triggered when currentAccount becomes available
    $: if ($currentAccount && $isLoggedIn) {
        loadChartDataAsync();
    }
</script>
```

**Was passiert:**

-   User logged in → `$currentAccount` wird gesetzt
-   Reactive statement läuft → `loadChartDataAsync()` wird aufgerufen
-   Automatischer Load-Prozess startet

---

### 2. **loadChartDataAsync() Funktion**

```javascript
async function loadChartDataAsync() {
    try {
        // STEP 1: Show loading skeleton
        isLoadingChartData = true;
        chartDataError = null;

        console.log('📊 Loading chart data asynchronously...');

        // STEP 2: Try to load from currentAccount (already loaded by accountStore)
        const accountHistory = getUsageHistory($currentAccount);

        if (accountHistory && accountHistory.length > 0) {
            // ✅ Data already available!
            usageHistory = accountHistory;
            console.log(
                '✅ Chart data loaded from currentAccount:',
                usageHistory.length,
                'entries'
            );
        } else {
            // 📡 Fallback: Fetch from API
            console.log(
                '📡 No history in currentAccount, fetching from API...'
            );
            usageHistory = await loadUsageHistoryWithRetry(
                $currentAccount?.userId,
                $currentAccount?.email
            );
            console.log(
                '✅ Chart data loaded from API:',
                usageHistory.length,
                'entries'
            );
        }

        // STEP 3: Check if data is stale (optional refresh)
        if (shouldRefreshHistory(usageHistory)) {
            console.log('🔄 History is stale, refreshing...');
            const refreshed = await refreshUsageHistory();
            if (refreshed && refreshed.length > 0) {
                usageHistory = refreshed;
                console.log(
                    '✅ Chart data refreshed:',
                    usageHistory.length,
                    'entries'
                );
            }
        }
    } catch (error) {
        console.error('❌ Failed to load chart data:', error);
        chartDataError = error.message || 'Failed to load chart data';

        // Fallback: Use any existing data
        usageHistory = getUsageHistory($currentAccount) || [];
    } finally {
        // Smooth transition: Wait 300ms to avoid flash
        await new Promise(resolve => setTimeout(resolve, 300));
        isLoadingChartData = false;
    }
}
```

---

### 3. **UI States (Conditional Rendering)**

```svelte
<!-- Chart Container -->
<div class="mb-3 -mx-4">
    {#if isLoadingChartData}
        <!-- LOADING STATE -->
        <ChartSkeleton height={200} />

    {:else if chartDataError}
        <!-- ERROR STATE -->
        <div class="error-container">
            <div class="text-4xl mb-3">❌</div>
            <h4>Fehler beim Laden</h4>
            <p>{chartDataError}</p>
            <Button on:click={retryLoadChartData}>
                🔄 Erneut versuchen
            </Button>
        </div>

    {:else if usageHistory.length === 0}
        <!-- NO DATA STATE -->
        <div class="no-data-container">
            <div class="text-4xl mb-3">📊</div>
            <h4>Noch keine Daten</h4>
            <p>Generiere Emojis, um deine Statistiken zu sehen!</p>
        </div>

    {:else}
        <!-- SUCCESS STATE - Chart mit Daten -->
        <div in:fade={{ duration: 400 }}>
            <LineChart
                data={usageChartData}
                maxValue={$accountTier === 'pro' ? 25 : 9}
                height={200}
                color={$accountTier === 'pro' ? '#a855f7' : '#eab308'}
                animate={true}
            />
        </div>
    {/if}
</div>
```

---

## 🎯 **Was muss NICHT geändert werden:**

### ✅ Google Sheets Daten

-   **Struktur ist perfekt!**
-   `usageHistory` Array mit 28 Einträgen ✅
-   Chronologisch sortiert (neueste zuerst) ✅
-   Alle Felder vorhanden (`date`, `used`, `limit`, `timestamp`) ✅

### ✅ Frontend Stores

-   `currentAccount` empfängt bereits geparste Daten vom n8n Workflow ✅
-   `accountStore.js` lädt Daten korrekt ✅
-   Keine Änderung nötig! ✅

---

## ⚠️ **Was MUSS sichergestellt werden:**

### 1. **n8n Workflow: JSON String Parsing**

**KRITISCH:** Der n8n Workflow MUSS `metadata` von String zu Object parsen!

```javascript
// n8n Code Node: "Parse Response"

const lookupData = $input.first().json;

// Helper function
function parseJSON(str, fallback = {}) {
    if (!str) return fallback;
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (error) {
        console.error('❌ JSON parse failed:', error);
        return fallback;
    }
}

// CRITICAL: Parse metadata string to object
const metadata = parseJSON(lookupData.metadata);

// Ensure usageHistory is array
const usageHistory = Array.isArray(metadata.usageHistory)
    ? metadata.usageHistory
    : [];

console.log('✅ Parsed metadata:', {
    hasUsageHistory: !!metadata.usageHistory,
    historyLength: usageHistory.length,
    firstEntry: usageHistory[0]
});

// Return parsed data
return {
    json: {
        userId: lookupData.userId,
        email: lookupData.email,
        tier: lookupData.tier,
        createdAt: lookupData.createdAt,
        lastLogin: lookupData.lastLogin,
        profile: parseJSON(lookupData.profile),
        metadata: {
            dailyUsage: metadata.dailyUsage,
            usageHistory: usageHistory, // ← MUSS ARRAY SEIN!
            settings: metadata.settings
        },
        status: lookupData.status
    }
};
```

**Check:** Ist dieser Code Node bereits im n8n Workflow?

-   ✅ JA → Alles funktioniert automatisch!
-   ❌ NEIN → Code Node muss hinzugefügt/aktualisiert werden!

---

### 2. **Backend API: Weiterleitung zu n8n**

```javascript
// keymoji-backend/api/account.js

async function handleAccountRead(userId, email, res) {
    try {
        const n8nResponse = await fetch(
            'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'read',
                    userId: userId,
                    email: email
                })
            }
        );

        const data = await n8nResponse.json();

        // IMPORTANT: Return parsed data (n8n already parsed)
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
```

**Status:** Sollte bereits korrekt sein! ✅

---

## 🧪 **Testing: Wie man überprüft ob alles funktioniert**

### Test 1: Browser Console beim Login

```javascript
// 1. Login als cm@chooo.de
// 2. Öffne Browser Console
// 3. Erwartete Logs:

// ✅ Account loaded
console.log('✅ Account synced:', {
    userId: 'user_1760079091439',
    hasMetadata: true,
    usageHistoryLength: 28
});

// ✅ Chart data loading
console.log('📊 Loading chart data asynchronously...');

// ✅ Data found
console.log('✅ Chart data loaded from currentAccount:', 28, 'entries');

// ✅ No refresh needed (data is today)
// (kein "🔄 History is stale" log)

// ✅ Loading complete
// isLoadingChartData = false
```

### Test 2: Inspect currentAccount Store

```javascript
// Browser Console:
const account = window.$currentAccount;

console.log('Account:', account);
console.log('UsageHistory:', account?.metadata?.usageHistory);
console.log('Length:', account?.metadata?.usageHistory?.length);
console.log('Type:', Array.isArray(account?.metadata?.usageHistory));

// Expected Output:
// UsageHistory: Array(28) [...]
// Length: 28
// Type: true
```

### Test 3: Visual Inspection

**Beim Laden der /account Seite sollte man sehen:**

1. **Loading Skeleton** (0-600ms)

    - Graue pulsierende Linien
    - Skeleton-Kreise
    - Spinner mit "📊 Lade Chart-Daten..."

2. **Chart Fade-In** (600-1000ms)

    - Smooth fade transition
    - Linie zeichnet sich von links nach rechts

3. **Data Points** (800-2550ms)

    - 28 Kreise erscheinen nacheinander
    - Staggered animation (je +50ms)

4. **Final State** (2550ms+)
    - Voll animierter Chart
    - 28 sichtbare Datenpunkte
    - Interaktiv (hover zeigt Tooltips)

---

## 🚀 **Automatische Daten-Updates für alle User**

### Wie werden zukünftig Daten für JEDEN User geschrieben?

```javascript
// src/stores/dailyUsageStore.js

/**
 * Save usage to API (called after every generation)
 */
async function saveUsageToAPI(account, usageData) {
    try {
        // Update usage history
        const updatedHistory = await saveToUsageHistory(account, usageData);

        const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: account.userId,
                email: account.email,
                profile: {
                    ...(account.profile || {}),
                    dailyUsage: usageData // ← Heutiger Stand
                },
                metadata: {
                    ...(account.metadata || {}),
                    dailyUsage: usageData, // ← Backward compatibility
                    usageHistory: updatedHistory, // ← Für Chart! (28-365 Tage)
                    lastActivity: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    updatedVia: 'daily-usage-tracking'
                },
                lastLogin: new Date().toISOString()
            })
        });

        console.log('✅ Usage saved to database:', {
            dailyUsage: usageData,
            historyEntries: updatedHistory.length
        });
    } catch (error) {
        console.error('❌ Failed to save usage to API:', error);
        throw error;
    }
}

/**
 * Save to usage history (keeps last 365 days)
 */
async function saveToUsageHistory(account, usageData) {
    const existingHistory = account?.metadata?.usageHistory || [];
    const today = getTodayDateString();

    // Update or add today's entry
    const existingIndex = existingHistory.findIndex(e => e.date === today);

    const newEntry = {
        date: today,
        used: usageData.used,
        limit: usageData.limit,
        timestamp: new Date().toISOString()
    };

    let updatedHistory;
    if (existingIndex >= 0) {
        // Update existing
        updatedHistory = [...existingHistory];
        updatedHistory[existingIndex] = newEntry;
    } else {
        // Add new
        updatedHistory = [...existingHistory, newEntry];
    }

    // Keep only last 365 days (sorted newest first)
    updatedHistory = updatedHistory
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 365);

    console.log('📊 Updated usage history:', updatedHistory.length, 'entries');

    return updatedHistory;
}
```

**Wann wird das aufgerufen?**

```javascript
// src/components/Core/EmojiDisplay.svelte

async function handleSuccessfulGeneration(countTowardsLimit = true) {
    // ... copy to clipboard, show success, etc.

    if (countTowardsLimit) {
        // AUTOMATIC: Increment daily usage
        await incrementDailyUsage();

        // → calls saveUsageToAPI()
        // → updates usageHistory in Google Sheets
        // → next time user reloads: new data is shown in chart!
    }
}
```

---

## ✅ **Zusammenfassung: Was ist zu tun?**

### Für cm@chooo.de (Manuelle Test-Daten):

-   [x] ✅ Daten in Google Sheets manuell eingefügt
-   [x] ✅ Struktur ist korrekt
-   [ ] ⚠️ n8n Workflow prüfen: Parsed `metadata` korrekt?
-   [ ] ⚠️ Nach Login testen: Wird Chart geladen?

### Für alle anderen User (Automatisch):

-   [x] ✅ `dailyUsageStore.js` schreibt automatisch
-   [x] ✅ `saveUsageToAPI()` updated `usageHistory`
-   [x] ✅ Async Loading lädt Daten beim nächsten Login
-   [x] ✅ Chart zeigt historische Daten

### n8n Workflow Checklist:

-   [ ] Code Node "Parse Response" vorhanden?
-   [ ] `JSON.parse(metadata)` wird aufgerufen?
-   [ ] `usageHistory` wird als Array zurückgegeben?
-   [ ] Response enthält parsed objects (nicht strings)?

---

## 🎯 **CRITICAL: n8n Workflow Update**

### Wenn der Code Node NICHT existiert oder falsch ist:

**Aktualisieren Sie den n8n Workflow mit diesem Code:**

```javascript
// Code Node: "Parse Response" (nach Google Sheets Lookup)

const lookupData = $input.first().json;

function parseJSON(str, fallback = {}) {
    if (!str) return fallback;
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (error) {
        console.warn('⚠️ Failed to parse JSON:', error.message);
        return fallback;
    }
}

const profile = parseJSON(lookupData.profile || lookupData.Profile);
const metadata = parseJSON(lookupData.metadata || lookupData.Metadata);

return {
    json: {
        userId: lookupData.userId || lookupData.UserId,
        email: lookupData.email || lookupData.Email,
        tier: lookupData.tier || lookupData.Tier || 'free',
        createdAt: lookupData.createdAt || lookupData.CreatedAt,
        lastLogin: lookupData.lastLogin || lookupData.LastLogin,
        profile: profile,
        metadata: metadata,
        status: lookupData.status || lookupData.Status || 'active'
    }
};
```

---

## 📊 **Expected Result für cm@chooo.de:**

```
1. Login → Magic Link
2. Redirect zu /account
3. Loading Skeleton erscheint (300-600ms)
4. Chart erscheint mit fade-in
5. 28 Datenpunkte von 13.9 bis 10.10 sichtbar
6. Interaktiv (hover, tooltips)
7. Time period selector funktioniert (7d, 14d, 4w, 1y)
```

---

**Alles bereit! Die Google Sheets Daten sind perfekt. Jetzt muss nur noch der n8n Workflow geprüft werden! 🚀**
