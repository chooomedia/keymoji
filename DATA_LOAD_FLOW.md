# Data Load Flow: Google Sheets → Frontend

## 🔄 Kompletter Lade-Prozess für cm@chooo.de

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: User Login / Page Reload                          │
│  Frontend (Browser)                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: LanguageRouter.onMount()                           │
│  File: src/routes/LanguageRouter.svelte                     │
│                                                              │
│  initializeAccountFromCookies()                             │
│  ↓                                                           │
│  Prüft Cookies für userId, email, session                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: API Request an Vercel Backend                      │
│  File: src/stores/accountStore.js                           │
│                                                              │
│  POST https://keymoji-backend.vercel.app/api/account        │
│                                                              │
│  Request Body:                                              │
│  {                                                           │
│    "action": "read",                                        │
│    "userId": "user_1760079091439",                          │
│    "email": "cm@chooo.de"                                   │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Vercel Backend empfängt Request                    │
│  File: keymoji-backend/api/account.js                       │
│                                                              │
│  const { action, userId, email } = req.body;                │
│                                                              │
│  if (action === 'read') {                                   │
│      return handleAccountRead(userId, email);               │
│  }                                                           │
│                                                              │
│  function handleAccountRead(userId, email) {                │
│      // Weiterleitung an n8n                                │
│      const response = await fetch(                          │
│          WEBHOOKS.ACCOUNT.READ,  // n8n webhook             │
│          {                                                   │
│              method: 'POST',                                │
│              body: JSON.stringify({                         │
│                  action: 'read',                            │
│                  userId,                                    │
│                  email                                      │
│              })                                             │
│          }                                                   │
│      );                                                      │
│      return response.json();                                │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: n8n Workflow empfängt Request                      │
│  Workflow: 02-account-management-COMPLETE-v2.json           │
│                                                              │
│  Webhook Node:                                              │
│  Receives: { action: "read", userId, email }                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: Google Sheets Lookup                               │
│  n8n Node: "Lookup Account"                                 │
│                                                              │
│  Operation: Lookup                                          │
│  Sheet: "accounts"                                          │
│  Match Column: "userId"                                     │
│  Match Value: "user_1760079091439"                          │
│                                                              │
│  Returns Raw Data:                                          │
│  {                                                           │
│    "userId": "user_1760079091439",                          │
│    "email": "cm@chooo.de",                                  │
│    "tier": "free",                                          │
│    "createdAt": "2025-07-31T11:59:13.043Z",                 │
│    "lastLogin": "2025-10-10T12:00:00.000Z",                 │
│    "profile": "{\"name\":\"cm\"}",  ← JSON-STRING!          │
│    "metadata": "{\"dailyUsage\":{...},\"usageHistory\":[...]}" ← JSON-STRING!                                                   │
│    "status": "active"                                       │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: Code Node "Parse Response"                         │
│  n8n Node: JavaScript Code                                  │
│                                                              │
│  const lookupData = $input.first().json;                    │
│                                                              │
│  // CRITICAL: Parse JSON strings!                           │
│  let profile = {};                                          │
│  let metadata = {};                                         │
│                                                              │
│  try {                                                       │
│      profile = JSON.parse(lookupData.profile || '{}');      │
│      metadata = JSON.parse(lookupData.metadata || '{}');    │
│  } catch (error) {                                          │
│      console.warn('Failed to parse:', error);               │
│  }                                                           │
│                                                              │
│  // Return parsed data                                      │
│  return {                                                    │
│      json: {                                                │
│          userId: lookupData.userId,                         │
│          email: lookupData.email,                           │
│          tier: lookupData.tier,                             │
│          createdAt: lookupData.createdAt,                   │
│          lastLogin: lookupData.lastLogin,                   │
│          profile: profile,  ← NOW AN OBJECT!                │
│          metadata: metadata, ← NOW AN OBJECT!               │
│          status: lookupData.status                          │
│      }                                                       │
│  };                                                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 8: Send Response Node                                 │
│  n8n Node: "Respond to Webhook"                             │
│                                                              │
│  Response Body:                                             │
│  {                                                           │
│    "success": true,                                         │
│    "account": {                                             │
│      "userId": "user_1760079091439",                        │
│      "email": "cm@chooo.de",                                │
│      "tier": "free",                                        │
│      "createdAt": "2025-07-31T11:59:13.043Z",               │
│      "lastLogin": "2025-10-10T12:00:00.000Z",               │
│      "profile": {                ← OBJECT (parsed!)         │
│        "name": "cm",                                        │
│        "dailyUsage": {...}                                  │
│      },                                                      │
│      "metadata": {               ← OBJECT (parsed!)         │
│        "dailyUsage": {...},                                 │
│        "usageHistory": [         ← CHART DATA!              │
│          { "date": "2025-10-10", "used": 5, "limit": 9 },  │
│          { "date": "2025-10-09", "used": 7, "limit": 9 },  │
│          ...                     ← 26 weitere Einträge      │
│        ],                                                    │
│        "settings": {                                        │
│          "name": "chooo12345",                              │
│          "emojiCount": 9,                                   │
│          ...                                                │
│        }                                                     │
│      },                                                      │
│      "status": "active"                                     │
│    }                                                         │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 9: Vercel Backend sendet Response zurück              │
│  File: keymoji-backend/api/account.js                       │
│                                                              │
│  return res.status(200).json(n8nResponse);                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 10: Frontend empfängt Response                        │
│  File: src/stores/accountStore.js                           │
│                                                              │
│  const result = await response.json();                      │
│                                                              │
│  if (result.success && result.account) {                    │
│      syncAccountData(result.account);                       │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 11: syncAccountData() setzt Stores                    │
│  File: src/stores/accountStore.js                           │
│                                                              │
│  function syncAccountData(accountData) {                    │
│      currentAccount.set(accountData);  ← COMPLETE ACCOUNT!  │
│      isLoggedIn.set(true);                                  │
│      accountTier.set(accountData.tier);                     │
│      userProfile.set(accountData.profile || {});            │
│                                                              │
│      // Initialize daily usage                              │
│      await initializeDailyUsage();                          │
│  }                                                           │
│                                                              │
│  Now $currentAccount contains:                              │
│  {                                                           │
│    userId: "user_1760079091439",                            │
│    metadata: {                                              │
│      usageHistory: [        ← 28 EINTRÄGE!                  │
│        { date: "2025-10-10", used: 5, limit: 9 },           │
│        { date: "2025-10-09", used: 7, limit: 9 },           │
│        ...                                                   │
│      ]                                                       │
│    }                                                         │
│  }                                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 12: AccountManager.svelte (Reactive!)                 │
│  File: src/routes/AccountManager.svelte                     │
│                                                              │
│  // REACTIVE: Triggered when $currentAccount changes        │
│  $: usageHistory = getUsageHistory($currentAccount);        │
│  ↓                                                           │
│  // getUsageHistory() extrahiert:                           │
│  return $currentAccount?.metadata?.usageHistory || [];      │
│  ↓                                                           │
│  // usageHistory = [                                        │
│  //   { date: "2025-10-10", used: 5, limit: 9 },            │
│  //   { date: "2025-10-09", used: 7, limit: 9 },            │
│  //   ... (28 Einträge)                                     │
│  // ]                                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 13: generateChartData() (Reactive!)                   │
│  File: src/routes/AccountManager.svelte                     │
│                                                              │
│  $: usageChartData = generateChartData(                     │
│      selectedTimePeriod,  // '7d', '14d', '4w', '1y'        │
│      usageHistory         // Array from step 12             │
│  );                                                          │
│                                                              │
│  function generateChartData(period, history) {              │
│      const days = period === '7d' ? 7 :                     │
│                   period === '14d' ? 14 :                   │
│                   period === '4w' ? 28 : 365;               │
│                                                              │
│      // Filter history for selected period                  │
│      const filteredData = [];                               │
│      for (let i = days - 1; i >= 0; i--) {                  │
│          const date = new Date();                           │
│          date.setDate(date.getDate() - i);                  │
│          const dateStr = date.toISOString().split('T')[0];  │
│                                                              │
│          const entry = history.find(h => h.date === dateStr);│
│          filteredData.push({                                │
│              date: dateStr,                                 │
│              value: entry?.used || 0                        │
│          });                                                 │
│      }                                                       │
│                                                              │
│      return filteredData;                                   │
│  }                                                           │
│                                                              │
│  // Result for '4w':                                        │
│  // usageChartData = [                                      │
│  //   { date: "2025-09-13", value: 6 },  ← 28 days ago      │
│  //   { date: "2025-09-14", value: 5 },                     │
│  //   ...                                                    │
│  //   { date: "2025-10-10", value: 5 }   ← Today            │
│  // ]                                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 14: LineChart.svelte rendert (Reactive!)              │
│  File: src/components/UI/LineChart.svelte                   │
│                                                              │
│  <LineChart                                                 │
│      data={usageChartData}  ← From step 13                  │
│      maxValue={9}                                           │
│      color="#eab308"                                        │
│  />                                                          │
│                                                              │
│  Component:                                                  │
│  - Empfängt usageChartData prop                             │
│  - Berechnet SVG path                                       │
│  - Rendert mit smooth animation                             │
│  - 28 Datenpunkte von 13.9 bis 10.10                        │
│                                                              │
│  ✅ Chart ist sichtbar!                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Code-Details für jeden Schritt

### STEP 2: initializeAccountFromCookies()

```javascript
// src/stores/accountStore.js

export function initializeAccountFromCookies() {
    try {
        // 1. Read cookies
        const accountInfo = getUserPreferences();

        if (!accountInfo || !accountInfo.userId) {
            console.log('No account session found');
            return false;
        }

        // 2. Validate session
        if (!hasValidUserSession()) {
            console.log('Session expired');
            return false;
        }

        // 3. Restore account from API
        console.log('📡 Loading account from API:', accountInfo.userId);

        // CRITICAL: This calls STEP 3
        fetchAccountFromAPI(accountInfo.userId, accountInfo.email);

        return true;
    } catch (error) {
        console.error('Failed to restore session:', error);
        return false;
    }
}
```

---

### STEP 3: API Request

```javascript
// src/stores/accountStore.js (implicit in verifyMagicLinkFrontend or similar)

async function fetchAccountFromAPI(userId, email) {
    const response = await fetch(
        'https://keymoji-backend.vercel.app/api/account',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'read',
                userId: userId,
                email: email
            })
        }
    );

    const result = await response.json();

    if (result.success && result.account) {
        // STEP 10: Process response
        syncAccountData(result.account);
    }
}
```

---

### STEP 4: Vercel Backend

```javascript
// keymoji-backend/api/account.js

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    const { action, userId, email } = req.body;

    if (action === 'read') {
        return handleAccountRead(userId, email, res);
    }
}

async function handleAccountRead(userId, email, res) {
    try {
        // Forward to n8n webhook
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

        // Return to frontend
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
```

---

### STEP 6: Google Sheets Lookup (n8n)

```json
// n8n Node Configuration: "Lookup Account"
{
    "name": "Lookup Account",
    "type": "n8n-nodes-base.googleSheets",
    "parameters": {
        "operation": "lookup",
        "sheetName": "accounts",
        "lookupColumn": "userId",
        "lookupValue": "={{ $json.body.userId }}"
    }
}
```

**Returns:**

```json
{
    "userId": "user_1760079091439",
    "email": "cm@chooo.de",
    "metadata": "{\"dailyUsage\":{\"date\":\"2025-10-10\",\"used\":5,\"limit\":9},\"usageHistory\":[{\"date\":\"2025-10-10\",\"used\":5,\"limit\":9},{\"date\":\"2025-10-09\",\"used\":7,\"limit\":9},...],\"settings\":{\"name\":\"chooo12345\",\"emojiCount\":9,...}}"
}
```

**WICHTIG:** `metadata` ist ein **JSON-STRING**, nicht ein Objekt!

---

### STEP 7: Parse JSON Strings (n8n Code Node)

```javascript
// n8n Code Node: "Parse Response"

const lookupData = $input.first().json;

// Helper: Safe JSON parse
function parseJSON(str, fallback = {}) {
    if (!str) return fallback;
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (error) {
        console.warn('JSON parse failed:', error);
        return fallback;
    }
}

// Parse profile and metadata (from JSON strings to objects)
const profile = parseJSON(lookupData.profile);
const metadata = parseJSON(lookupData.metadata);

// CRITICAL: Extract usageHistory from metadata
const usageHistory = metadata.usageHistory || [];
const settings = metadata.settings || {};

console.log('Parsed usageHistory:', usageHistory.length, 'entries');

// Return as JavaScript objects (not strings!)
return {
    json: {
        userId: lookupData.userId,
        email: lookupData.email,
        tier: lookupData.tier,
        createdAt: lookupData.createdAt,
        lastLogin: lookupData.lastLogin,
        profile: profile, // ← OBJECT
        metadata: {
            // ← OBJECT
            dailyUsage: metadata.dailyUsage,
            usageHistory: usageHistory, // ← ARRAY OF 28 OBJECTS!
            settings: settings
        },
        status: lookupData.status
    }
};
```

---

### STEP 11: syncAccountData() im Frontend

```javascript
// src/stores/accountStore.js

async function syncAccountData(accountData) {
    if (accountData) {
        // Set all stores
        isLoggedIn.set(true);
        currentAccount.set(accountData); // ← Hier kommt usageHistory rein!
        accountTier.set(accountData.tier || 'free');
        userProfile.set(accountData.profile || {});

        console.log('✅ Account synced:', {
            userId: accountData.userId,
            tier: accountData.tier,
            usageHistory: accountData.metadata?.usageHistory?.length || 0,
            settings: accountData.metadata?.settings
        });

        // Initialize daily usage from API data
        await initializeDailyUsage();
    }
}
```

---

### STEP 12-13: Reactive Chart Data

```javascript
// src/routes/AccountManager.svelte

// REACTIVE: Triggers when $currentAccount changes (STEP 11)
$: usageHistory = getUsageHistory($currentAccount);
// Returns: accountData.metadata.usageHistory

// REACTIVE: Triggers when usageHistory or selectedTimePeriod changes
$: usageChartData = generateChartData(selectedTimePeriod, usageHistory);
// Returns: Filtered array for selected period (7d, 14d, 4w, 1y)

// REACTIVE: Chart component receives new data
<LineChart data={usageChartData} ... />
// → Rerenders with smooth animation
```

---

## 🔍 Wichtige Parsing-Punkte

### ⚠️ JSON String vs Object

**Google Sheets speichert metadata als STRING:**

```
metadata: "{\"usageHistory\":[...]}"
         ↑ String mit escaped quotes
```

**n8n MUSS parsen:**

```javascript
const metadata = JSON.parse(lookupData.metadata);
// Now: metadata.usageHistory is an ARRAY
```

**Frontend empfängt als OBJECT:**

```javascript
result.account.metadata.usageHistory;
// Already parsed by n8n!
```

---

## 🧪 Verifizierung im Frontend

### Nach Login als cm@chooo.de:

```javascript
// 1. Check currentAccount store
const account = window.$currentAccount;
console.log('Account loaded:', account);

// 2. Check metadata
console.log('Metadata:', account?.metadata);

// 3. Check usageHistory (should be ARRAY)
console.log('UsageHistory:', account?.metadata?.usageHistory);
console.log('Type:', Array.isArray(account?.metadata?.usageHistory));
console.log('Entries:', account?.metadata?.usageHistory?.length);

// Expected:
// UsageHistory: Array(28) [...]
// Type: true
// Entries: 28

// 4. Check chart data (reactive)
// Go to /account page
// Chart should render with 28 points!
```

---

## 🔧 n8n Workflow Nodes (Reihenfolge)

```
1. Webhook Trigger
   ↓ (receives { action: "read", userId, email })

2. IF: Check Action
   ↓ (if action === "read")

3. Google Sheets: Lookup Account
   ↓ (finds row by userId)
   ↓ (returns raw data with JSON strings)

4. Code Node: Parse Response
   ↓ (JSON.parse metadata string)
   ↓ (JSON.parse profile string)
   ↓ (extracts usageHistory array)

5. Send Response
   ↓ (sends parsed objects back)

→ Frontend receives clean objects!
```

---

## ✅ Was muss im n8n Workflow sichergestellt sein?

### Code Node MUSS enthalten:

```javascript
// Parse metadata string to object
const metadata =
    typeof lookupData.metadata === 'string'
        ? JSON.parse(lookupData.metadata || '{}')
        : lookupData.metadata || {};

// Ensure usageHistory is array
const usageHistory = Array.isArray(metadata.usageHistory)
    ? metadata.usageHistory
    : [];

// Return with parsed data
return {
    json: {
        // ... other fields
        metadata: {
            dailyUsage: metadata.dailyUsage,
            usageHistory: usageHistory, // ← MUST be array!
            settings: metadata.settings
        }
    }
};
```

---

## 📊 Debugging: Check jeden Schritt

```javascript
// STEP 3: Frontend Request
console.log('Request sent to API');

// STEP 10: Frontend Response
console.log('Response received:', result);

// STEP 11: Store Update
console.log('currentAccount updated:', window.$currentAccount);

// STEP 12: Reactive usageHistory
console.log('usageHistory extracted:', usageHistory);

// STEP 13: Reactive chartData
console.log('chartData generated:', usageChartData);

// STEP 14: Chart rendered
// Inspect Element: Should see <path> and 28 <circle> elements
```

---

## 🚀 Production Checklist

-   [ ] **Google Sheets:** metadata enthält `usageHistory` array
-   [ ] **n8n Workflow:** Code Node parsed JSON strings korrekt
-   [ ] **n8n Workflow:** Response enthält `metadata.usageHistory` als array
-   [ ] **Vercel Backend:** Leitet requests korrekt weiter
-   [ ] **Frontend:** `currentAccount` store empfängt parsed data
-   [ ] **Frontend:** `getUsageHistory()` findet array
-   [ ] **Frontend:** `generateChartData()` filtered korrekt
-   [ ] **Frontend:** LineChart rendert 28 Punkte

---

**TL;DR Flow:**

```
Google Sheets (JSON-String)
    ↓
n8n Lookup (raw string)
    ↓
n8n Code Node (JSON.parse)
    ↓
n8n Response (JavaScript Object)
    ↓
Vercel Backend (forward)
    ↓
Frontend currentAccount store (Object mit usageHistory array)
    ↓
AccountManager reactive (extract usageHistory)
    ↓
LineChart component (render 28 points)
    ✅
```

**Alles klar erklärt! 🎉**
