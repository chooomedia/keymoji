# Complete API Flow - Chart Data from Google Sheets

## 🔄 **JA! Chart-Daten werden aus Google Sheets über Vercel → n8n gelesen!**

---

## 📊 **Complete Flow: Frontend → Database → Chart**

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: User Login (Magic Link)                                │
│  Browser: http://localhost:8080/de/account                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Frontend - verifyMagicLinkFrontend()                   │
│  File: src/stores/accountStore.js                               │
│                                                                  │
│  After token verification:                                      │
│  📡 API Call to Vercel Backend:                                 │
│                                                                  │
│  POST https://its.keymoji.wtf/api/account                       │
│                                                                  │
│  Request Body:                                                  │
│  {                                                               │
│    "action": "read",                                            │
│    "userId": "user_1753963152928",                              │
│    "email": "cm@chooo.de"                                       │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Vercel Backend                                         │
│  File: keymoji-backend/api/account.js                           │
│                                                                  │
│  const { action, userId, email } = req.body;                    │
│                                                                  │
│  if (action === 'read') {                                       │
│      // Forward to n8n webhook                                  │
│      const n8nResponse = await fetch(                           │
│          'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account',│
│          {                                                       │
│              method: 'POST',                                    │
│              body: JSON.stringify({                             │
│                  action: 'read',                                │
│                  userId: userId,                                │
│                  email: email                                   │
│              })                                                  │
│          }                                                       │
│      );                                                          │
│      return res.json(await n8nResponse.json());                 │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: n8n Workflow                                           │
│  Workflow: 02-account-management-COMPLETE-v2.json               │
│                                                                  │
│  Node 1: Webhook Trigger                                        │
│  Receives: { action: "read", userId, email }                    │
│                                                                  │
│  Node 2: IF (Check Action)                                      │
│  If action === "read" → Continue                                │
│                                                                  │
│  Node 3: Google Sheets Lookup                                   │
│  Operation: Lookup                                              │
│  Sheet: "accounts"                                              │
│  Match Column: "userId"                                         │
│  Match Value: "user_1753963152928"                              │
│                                                                  │
│  Returns from Google Sheets:                                    │
│  {                                                               │
│    "userId": "user_1753963152928",                              │
│    "email": "cm@chooo.de",                                      │
│    "tier": "free",                                              │
│    "createdAt": "2025-07-31T23:19:26.866Z",                     │
│    "lastLogin": "2025-10-10T14:00:00.000Z",                     │
│    "profile": "{\"name\":\"chooo123456\"}",  ← JSON-STRING!     │
│    "metadata": "{\"settings\":{...},\"usageHistory\":[...]}",   │
│                ↑ JSON-STRING with usageHistory!                 │
│    "status": "active"                                           │
│  }                                                               │
│                                                                  │
│  Node 4: Code Node "Parse Response" (SHOULD EXIST!)             │
│  function parseJSON(str, fallback = {}) {                       │
│      try {                                                       │
│          return typeof str === 'string'                          │
│              ? JSON.parse(str)                                  │
│              : str;                                             │
│      } catch { return fallback; }                               │
│  }                                                               │
│                                                                  │
│  const metadata = parseJSON(lookupData.metadata);               │
│  const profile = parseJSON(lookupData.profile);                 │
│                                                                  │
│  return {                                                        │
│      json: {                                                     │
│          userId: lookupData.userId,                             │
│          email: lookupData.email,                               │
│          tier: lookupData.tier,                                 │
│          createdAt: lookupData.createdAt,                       │
│          lastLogin: lookupData.lastLogin,                       │
│          profile: profile,        ← OBJECT!                     │
│          metadata: metadata,      ← OBJECT with usageHistory!   │
│          status: lookupData.status                              │
│      }                                                           │
│  };                                                              │
│                                                                  │
│  Node 5: Send Response                                          │
│  Response Body:                                                 │
│  {                                                               │
│      "success": true,                                           │
│      "account": {                                               │
│          "userId": "user_1753963152928",                        │
│          "email": "cm@chooo.de",                                │
│          "metadata": {                                          │
│              "usageHistory": [                                  │
│                  {"date": "2025-10-10", "used": 5, ...},        │
│                  {"date": "2025-10-09", "used": 7, ...},        │
│                  ... 26 more entries                            │
│              ]                                                   │
│          }                                                       │
│      }                                                           │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Vercel Backend → Frontend                              │
│  Response forwarded back to Frontend                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: Frontend - Parse Response                              │
│  File: src/stores/accountStore.js                               │
│                                                                  │
│  const fullAccountResult = await fullAccountResponse.json();    │
│                                                                  │
│  console.log('✅ [LOGIN] Full account data loaded:', {          │
│      hasUsageHistory: true,                                     │
│      usageHistoryLength: 28                                     │
│  });                                                             │
│                                                                  │
│  accountData = {                                                │
│      ...accountData,                                            │
│      ...fullAccountResult.account  ← Has usageHistory!          │
│  };                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: Frontend - syncAccountData()                           │
│  File: src/stores/accountStore.js                               │
│                                                                  │
│  // CRITICAL: Parse JSON strings from n8n                       │
│  const parsedMetadata = safeJSONParse(accountData.metadata);    │
│                                                                  │
│  console.log('✅ [ACCOUNT DEBUG] Parsed data:', {               │
│      usageHistoryLength: parsedMetadata.usageHistory.length     │
│  });                                                             │
│                                                                  │
│  // Update stores                                               │
│  currentAccount.set({                                           │
│      ...accountData,                                            │
│      metadata: parsedMetadata  ← Object with usageHistory!      │
│  });                                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 8: AccountManager.svelte (Reactive)                       │
│  File: src/routes/AccountManager.svelte                         │
│                                                                  │
│  // Triggered when $currentAccount changes                      │
│  $: if ($currentAccount && $isLoggedIn) {                       │
│      loadChartDataAsync();                                      │
│  }                                                               │
│                                                                  │
│  async function loadChartDataAsync() {                          │
│      const accountHistory = getUsageHistory($currentAccount);   │
│      // Returns: array of 28 entries from metadata.usageHistory │
│                                                                  │
│      usageHistory = accountHistory;  // 28 entries!             │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 9: Generate Chart Data (Reactive)                         │
│  File: src/routes/AccountManager.svelte                         │
│                                                                  │
│  $: usageChartData = generateChartData(                         │
│      selectedTimePeriod,  // '4w'                               │
│      usageHistory         // 28 entries                         │
│  );                                                              │
│                                                                  │
│  function generateChartData(period, history) {                  │
│      // Filters history for last 28 days                        │
│      return filteredData;  // Array of {date, value}            │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 10: LineChart.svelte (Render SVG)                         │
│  File: src/components/UI/LineChart.svelte                       │
│                                                                  │
│  <LineChart data={usageChartData} />                            │
│                                                                  │
│  // Receives: [                                                 │
│  //   {date: "2025-09-13", value: 6},                           │
│  //   {date: "2025-09-14", value: 5},                           │
│  //   ... 26 more entries                                       │
│  // ]                                                            │
│                                                                  │
│  // Calculates SVG coordinates                                  │
│  $: linePath = calculatePath(usageChartData);                   │
│                                                                  │
│  // Renders SVG                                                 │
│  <svg>                                                           │
│      <path d={linePath} />  ← Animated line                     │
│      <circle /> × 28        ← Data points                       │
│  </svg>                                                          │
│                                                                  │
│  ✅ Chart visible with 28 days!                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 **API Call Details:**

### **Request (Frontend → Vercel):**

```javascript
// src/stores/accountStore.js

fetch('https://its.keymoji.wtf/api/account', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
        action: 'read',
        userId: 'user_1753963152928',
        email: 'cm@chooo.de'
    })
});
```

### **Vercel → n8n:**

```javascript
// keymoji-backend/api/account.js

fetch('https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'read',
        userId: 'user_1753963152928',
        email: 'cm@chooo.de'
    })
});
```

### **n8n → Google Sheets:**

```
n8n Workflow Node: "Google Sheets Lookup"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Operation: Lookup
Sheet Name: "accounts"
Lookup Column: "userId"
Lookup Value: "user_1753963152928"

Query:
SELECT * FROM accounts WHERE userId = 'user_1753963152928'

Result:
{
  "userId": "user_1753963152928",
  "email": "cm@chooo.de",
  "tier": "free",
  "createdAt": "2025-07-31T23:19:26.866Z",
  "lastLogin": "2025-10-10T14:00:00.000Z",
  "profile": "{\"name\":\"chooo123456\"}",
  "metadata": "{\"settings\":{...},\"dailyUsage\":{...},\"usageHistory\":[28 entries]}"
              ↑ THIS is read from Google Sheets Column G!
}
```

### **n8n Code Node → Parse:**

```javascript
// n8n Code Node: "Parse Response"

const lookupData = $input.first().json;

// Parse JSON strings from Google Sheets
const metadata = JSON.parse(lookupData.metadata);
// Now: metadata.usageHistory is ARRAY!

return {
    json: {
        userId: lookupData.userId,
        email: lookupData.email,
        metadata: metadata // ← Object with usageHistory array!
        // ...
    }
};
```

### **n8n → Vercel → Frontend:**

```javascript
// Response arrives at Frontend

{
    "success": true,
    "account": {
        "userId": "user_1753963152928",
        "email": "cm@chooo.de",
        "metadata": {  // ← Already parsed by n8n (or will be parsed by Frontend)
            "settings": {...},
            "dailyUsage": {...},
            "usageHistory": [  // ← FROM GOOGLE SHEETS!
                {"date": "2025-10-10", "used": 5, "limit": 9},
                {"date": "2025-10-09", "used": 7, "limit": 9},
                ... 26 more entries
            ]
        }
    }
}
```

### **Frontend → Chart:**

```javascript
// src/stores/accountStore.js
syncAccountData(fullAccountData);
// → currentAccount store updated

// src/routes/AccountManager.svelte (reactive)
$: usageHistory = getUsageHistory($currentAccount);
// Returns: metadata.usageHistory (28 entries FROM GOOGLE SHEETS!)

$: usageChartData = generateChartData('4w', usageHistory);
// Returns: Filtered array for last 28 days

// src/components/UI/LineChart.svelte
<LineChart data={usageChartData} />;
// Renders: SVG with 28 data points!
```

---

## 🗄️ **Google Sheets als Datenbank:**

### **Sheet: "accounts"**

| Column | Field        | Content                                          |
| ------ | ------------ | ------------------------------------------------ |
| A      | userId       | user_1753963152928                               |
| B      | email        | cm@chooo.de                                      |
| C      | tier         | free                                             |
| D      | createdAt    | 2025-07-31T23:19:26.866Z                         |
| E      | lastLogin    | 2025-10-10T14:00:00.000Z                         |
| F      | profile      | `{"name":"chooo123456"}`                         |
| G      | **metadata** | `{"settings":{...},"usageHistory":[28 entries]}` |
| H      | status       | active                                           |

**Column G (metadata) contains:**

-   ✅ `settings` - User preferences
-   ✅ `dailyUsage` - Today's usage (for counter)
-   ✅ `usageHistory` - **28 days for chart!** ← THIS!
-   ✅ `source`, `tier`, `updatedAt`, `updatedVia`

---

## 🔄 **Data Flow Diagram:**

```
Google Sheets          n8n Workflow       Vercel Backend      Frontend            Chart
━━━━━━━━━━━━          ━━━━━━━━━━━━       ━━━━━━━━━━━━━━      ━━━━━━━━            ━━━━━
Column G:              Lookup             Forward             Parse               Render
metadata =             ↓                  ↓                   ↓                   ↓
"{\"usageHistory\":    Parse JSON         Return              safeJSONParse()     SVG Path
[28 entries]}"         ↓                  ↓                   ↓                   ↓
                       metadata = {       response.json()     currentAccount      <path>
                         usageHistory:    ↓                   .metadata           <circle>
                         [28 entries]     Forward to          .usageHistory       × 28
                       }                  Frontend            = [28 entries]
                                          ↓                   ↓
                                          ✅ DONE             getUsageHistory()
                                                              ↓
                                                              Chart Data
                                                              ✅ 28 Points!
```

---

## ✅ **Ja, die Daten kommen aus Google Sheets!**

### **Kurz:**

1. **Google Sheets** speichert `usageHistory` in Column G (metadata)
2. **n8n Workflow** liest via Google Sheets Lookup Node
3. **n8n Workflow** parsed JSON-String zu Object
4. **Vercel Backend** leitet Response weiter
5. **Frontend** empfängt geparste Daten
6. **Chart** rendert 28 Datenpunkte

### **Warum funktioniert es jetzt?**

**Vorher:**

-   Kein API Call nach Login → usageHistory nie geladen
-   Chart hatte keine Daten

**Jetzt:**

-   ✅ API Call nach Login: `POST /api/account (action: read)`
-   ✅ Vercel → n8n → Google Sheets Lookup
-   ✅ usageHistory wird geladen
-   ✅ Chart bekommt 28 Einträge

---

## 🧪 **So kannst du es überprüfen:**

### **1. Chrome DevTools (F12) → Network Tab**

Nach Login solltest du sehen:

```
POST /api/account
Status: 200 OK
Request: {"action":"read","userId":"user_1753963152928",...}
Response: {
    "success": true,
    "account": {
        "metadata": {
            "usageHistory": [28 entries]  ← FROM GOOGLE SHEETS!
        }
    }
}
```

### **2. Browser Console:**

```javascript
// Check if data arrived
const account = window.$currentAccount;
console.log('UsageHistory from database:', account.metadata?.usageHistory);
// Expected: Array(28) [{date: "2025-10-10", ...}, ...]
```

### **3. n8n Workflow Execution Log:**

In n8n, check the execution log for the workflow:

```
✅ Webhook triggered
✅ IF action === "read"
✅ Google Sheets Lookup: Found user_1753963152928
✅ Code Node: Parsed metadata
✅ Send Response: Sent 28 usageHistory entries
```

---

## 📊 **Complete Tech Stack:**

```
Database Layer:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Google Sheets (accounts sheet)
  - Column G (metadata) stores usageHistory as JSON string

Middleware Layer:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
n8n Workflow (02-account-management-COMPLETE-v2.json)
  - Node: Google Sheets Lookup (reads data)
  - Node: Code Node "Parse Response" (parses JSON)
  - Node: Send Response (returns to Vercel)

API Layer:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vercel Backend (keymoji-backend/api/account.js)
  - Forwards requests to n8n
  - Returns responses to Frontend

Frontend Layer:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Svelte App
  - accountStore.js: Loads data, parses JSON
  - AccountManager.svelte: Extracts usageHistory
  - LineChart.svelte: Renders SVG chart

Result:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User sees animated chart with 28 days of data! 🎉
```

---

## 🎯 **Summary:**

**Frage:** Werden Chart-Daten aus Vercel - n8n Webhooks (Datenbank) gelesen?

**Antwort:** ✅ **JA!**

```
Frontend
  ↓ POST /api/account (action: read)
Vercel Backend
  ↓ POST n8n webhook
n8n Workflow
  ↓ Google Sheets Lookup
Google Sheets (Column G: metadata)
  → usageHistory: [28 entries]
  ↓ Parse & Return
n8n → Vercel → Frontend
  ↓ syncAccountData()
currentAccount store
  ↓ getUsageHistory()
AccountManager
  ↓ generateChartData()
LineChart
  ✅ Chart renders 28 days!
```

**Der Chart bekommt seine Daten DIREKT aus Google Sheets über Vercel → n8n!** 🚀
