# Chart Data Flow - Wie Daten zwischen Frontend und Datenbank fließen

## 🎯 Überblick: Datenfluss für cm@chooo.de

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Browser)                                     │
│  ↓                                                       │
│  window.keymojiUsageGenerator.generate4Weeks()          │
│  ↓                                                       │
│  Generiert 28 Tage Mock-Daten                           │
│  ↓                                                       │
│  Sendet an: WEBHOOKS.ACCOUNT.UPDATE                     │
│  ↓                                                       │
│  POST /webhook/xn--moji-pb73c-account                   │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  n8n Workflow (02-account-management-COMPLETE-v2.json)  │
│  ↓                                                       │
│  Code Node: Process Update                              │
│  ↓                                                       │
│  Merged metadata.usageHistory                           │
│  ↓                                                       │
│  Google Sheets Node: Update                             │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  Google Sheets (Datenbank)                              │
│                                                          │
│  Row für cm@chooo.de:                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ userId: user_1760079091439                         │ │
│  │ email: cm@chooo.de                                 │ │
│  │ metadata: {                                        │ │
│  │   "usageHistory": [                                │ │
│  │     { "date": "2025-10-10", "used": 5, "limit": 9 }│ │
│  │     { "date": "2025-10-09", "used": 7, "limit": 9 }│ │
│  │     ...                                            │ │
│  │   ]                                                │ │
│  │ }                                                  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  Page Reload                                            │
│  ↓                                                       │
│  LanguageRouter.onMount()                               │
│  ↓                                                       │
│  initializeAccountFromCookies()                         │
│  ↓                                                       │
│  Lädt Account von API/Google Sheets                     │
│  ↓                                                       │
│  currentAccount.set({ ..., metadata: { usageHistory }}) │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  AccountManager.svelte (Reactive!)                      │
│                                                          │
│  $: usageHistory = getUsageHistory($currentAccount)     │
│  $: usageChartData = generateChartData(...)             │
│  ↓                                                       │
│  <LineChart data={usageChartData} />                    │
│  ↓                                                       │
│  ✅ Chart rendert mit Daten aus Google Sheets!          │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Schritt-für-Schritt: Chart-Daten für cm@chooo.de einrichten

### Methode 1: INSTANT Test (Nur im Browser, nicht persistent)

**Vorteil:** Sofort sichtbar, keine API calls, perfekt zum Testen der Animation  
**Nachteil:** Nach Page Reload weg

```javascript
// 1. Login als cm@chooo.de
// 2. Browser Console öffnen (F12)

// 3. Test PRO Chart mit 4 Wochen:
window.keymojiChartTest.pro4w();

// Resultat:
// ✅ Chart zeigt sofort 28 Datenpunkte
// ✅ Smooth Animation
// ✅ Lila Farbe (PRO)
// ✅ Alle 4 Wochen sichtbar

// 4. Verschiedene Patterns testen:
window.keymojiChartTest.wave();      // Dramatische Welle
window.keymojiChartTest.free7d();    // FREE 7 Tage
window.keymojiChartTest.clear();     // Leeren

// 5. Zeit-Perioden testen:
// - Klick "7d" → Zeigt letzte 7 Tage
// - Klick "14d" → Zeigt letzte 14 Tage
// - Klick "4w" → Zeigt alle 28 Tage
```

---

### Methode 2: PERSISTENT in Datenbank (Bleibt nach Reload)

**Vorteil:** Daten bleiben in Google Sheets gespeichert  
**Nachteil:** Benötigt API call (funktioniert nicht auf localhost)

```javascript
// 1. Login als cm@chooo.de
// 2. Browser Console öffnen

// 3. Generiere 4 Wochen Daten UND speichere in Datenbank:
await window.keymojiUsageGenerator.generate4Weeks();

// Console Output:
// 📊 Generating 4 Weeks Usage Data
//   Tier: free
//   Entries: 28
//   Sample: [...]
// ✅ currentAccount updated with test history
// 📡 Saving usage history to API: {...}
// ✅ Usage history saved to API
// ✅ 4 weeks data generated successfully!
// 🔄 Reload page to see chart update

// 4. Page reloaden:
location.reload();

// 5. Chart sollte jetzt persistent 28 Tage zeigen!
```

---

## 🗄️ Wie wird es in Google Sheets gespeichert?

### Aktuelle Struktur (Google Sheets Row für cm@chooo.de):

```
userId              | user_1760079091439
email               | cm@chooo.de
tier                | free
createdAt           | 2025-07-31T11:59:13.043Z
lastLogin           | 2025-10-10T12:00:00.000Z
profile             | {"name":"cm","dailyUsage":{...}}
metadata            | {"usageHistory":[...]}  ← HIER!
status              | active
```

### metadata Feld (JSON-String in Google Sheets):

```json
{
    "dailyUsage": {
        "date": "2025-10-10",
        "used": 5,
        "limit": 9,
        "lastReset": "2025-10-10"
    },
    "usageHistory": [
        {
            "date": "2025-10-10",
            "used": 5,
            "limit": 9,
            "timestamp": "2025-10-10T12:34:56.789Z"
        },
        {
            "date": "2025-10-09",
            "used": 7,
            "limit": 9,
            "timestamp": "2025-10-09T18:45:12.123Z"
        },
        {
            "date": "2025-10-08",
            "used": 3,
            "limit": 9,
            "timestamp": "2025-10-08T09:12:34.567Z"
        }
        // ... weitere 25 Einträge (total 28 für 4 Wochen)
    ],
    "settings": {
        "name": "cm",
        "language": "de",
        "theme": "dark",
        "uiState": {
            "expandedSections": ["basic"]
        }
    }
}
```

---

## 🔄 API Request Flow

### 1. Frontend sendet Update:

```javascript
// POST https://keymoji-backend.vercel.app/api/account/update
{
    "userId": "user_1760079091439",
    "email": "cm@chooo.de",
    "metadata": {
        "usageHistory": [
            { "date": "2025-10-10", "used": 5, "limit": 9 },
            { "date": "2025-10-09", "used": 7, "limit": 9 },
            // ... 26 more entries
        ],
        "updatedAt": "2025-10-10T12:34:56.789Z",
        "updatedVia": "test-data-generator"
    },
    "lastLogin": "2025-10-10T12:34:56.789Z"
}
```

### 2. Vercel API weiterleiten an n8n:

```javascript
// POST https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account
{
    "action": "update",
    "userId": "user_1760079091439",
    "email": "cm@chooo.de",
    "metadata": {
        "usageHistory": [...],
        "updatedAt": "2025-10-10T12:34:56.789Z",
        "updatedVia": "test-data-generator"
    }
}
```

### 3. n8n Code Node mergt Daten:

```javascript
// Process Update Node
const webhook = $input.first().json;
const lookupData = items[1].json; // Existing data from Google Sheets

// Parse existing metadata
let existingMetadata = {};
try {
    existingMetadata = JSON.parse(lookupData.metadata || '{}');
} catch (error) {
    console.warn('Failed to parse existing metadata');
}

// Merge incoming usageHistory
const incomingHistory = webhook.body.metadata?.usageHistory || [];
const updatedMetadata = {
    ...existingMetadata,
    usageHistory: incomingHistory, // Replace (not merge) for usageHistory
    updatedAt: webhook.body.metadata?.updatedAt,
    updatedVia: webhook.body.metadata?.updatedVia
};

// Return for Google Sheets
return {
    json: {
        userId: webhook.body.userId,
        email: webhook.body.email,
        // ... other fields
        Metadata: JSON.stringify(updatedMetadata) // ← Back to JSON string!
    }
};
```

### 4. Google Sheets Update Node:

```
Update Google Sheets:
- Sheet: "accounts"
- Matching Column: userId
- Update Row:
  - Metadata: "{\"usageHistory\":[...],\"updatedAt\":\"...\"}"
```

### 5. Response zurück an Frontend:

```javascript
{
    "success": true,
    "account": {
        "userId": "user_1760079091439",
        "email": "cm@chooo.de",
        "metadata": {
            "usageHistory": [
                { "date": "2025-10-10", "used": 5, "limit": 9 },
                // ... 27 more
            ]
        }
    }
}
```

---

## 🧪 Komplette Test-Anleitung für cm@chooo.de

### Variante A: Quick Test (Instant, nicht persistent)

**Ideal für:** Animation testen, verschiedene Patterns ausprobieren

```javascript
// 1. Login als cm@chooo.de

// 2. Console öffnen:
window.keymojiChartTest.pro4w();

// Was passiert:
// ✅ Injiziert 28 Tage in currentAccount.metadata.usageHistory
// ✅ Chart updated sofort (reaktiv!)
// ✅ KEINE API call, NICHT in Google Sheets gespeichert
// ❌ Nach Reload: Daten weg

// 3. Verschiedene Patterns testen:
window.keymojiChartTest.free7d();  // 7 Tage FREE
window.keymojiChartTest.wave();    // Wave Pattern
window.keymojiChartTest.pro1y();   // 1 Jahr PRO
window.keymojiChartTest.clear();   // Leeren
```

---

### Variante B: Persistent Test (In Datenbank speichern)

**Ideal für:** Echte Daten, bleibt nach Reload

**⚠️ WICHTIG:** Funktioniert NUR wenn deployed (nicht auf localhost wegen CORS)

```javascript
// 1. Login als cm@chooo.de

// 2. Console öffnen:
await window.keymojiUsageGenerator.generate4Weeks();

// Was passiert:
// ✅ Generiert 28 Tage Daten
// ✅ Speichert in currentAccount store
// ✅ Sendet API Request an Vercel Backend
// ✅ Vercel leitet weiter an n8n Webhook
// ✅ n8n mergt Daten und speichert in Google Sheets
// ✅ Response zurück an Frontend

// Console Output:
// 📊 Generating 4 Weeks Usage Data
//   Tier: free
//   Entries: 28
// ✅ currentAccount updated with test history
// 📡 Saving usage history to API: {...}
// ✅ Usage history saved to API: {success: true, ...}
// ✅ 4 weeks data generated successfully!
// 🔄 Reload page to see chart update

// 3. Page reloaden:
location.reload();

// 4. Beim Reload:
// → LanguageRouter.onMount()
// → initializeAccountFromCookies()
// → Lädt Account von API
// → API fetcht von Google Sheets
// → metadata.usageHistory wird geladen
// → Chart zeigt 28 Tage! ✅
```

---

## 🗄️ Manuelle Datenbank-Anpassung (Google Sheets)

### Option 1: Via n8n Workflow (Empfohlen)

**Verwende die Frontend Tools** - n8n handled alles automatisch.

### Option 2: Direkt in Google Sheets (Für Experten)

**⚠️ VORSICHT:** JSON muss exakt korrekt sein!

1. **Öffne Google Sheets**
2. **Finde Row für cm@chooo.de** (userId: user_1760079091439)
3. **Bearbeite metadata Spalte:**

```json
{
    "dailyUsage": {
        "date": "2025-10-10",
        "used": 5,
        "limit": 9,
        "lastReset": "2025-10-10"
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
        },
        {
            "date": "2025-10-08",
            "used": 3,
            "limit": 9,
            "timestamp": "2025-10-08T12:00:00.000Z"
        },
        {
            "date": "2025-10-07",
            "used": 6,
            "limit": 9,
            "timestamp": "2025-10-07T12:00:00.000Z"
        }
        // ... weitere 24 Einträge für 4 Wochen (total 28)
    ],
    "settings": {
        "name": "cm",
        "language": "de",
        "theme": "dark"
    }
}
```

4. **Speichern**
5. **Frontend reloaden** → Chart sollte Daten zeigen

---

## 🔍 Wie prüfe ich ob Daten in Google Sheets sind?

### Via n8n Workflow Test:

```javascript
// 1. Öffne n8n: https://n8n.chooomedia.com
// 2. Workflow: 02-account-management-COMPLETE-v2
// 3. Test mit Webhook:

// POST https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account
{
    "action": "read",
    "userId": "user_1760079091439",
    "email": "cm@chooo.de"
}

// Response sollte enthalten:
{
    "success": true,
    "account": {
        "metadata": {
            "usageHistory": [
                { "date": "2025-10-10", "used": 5, "limit": 9 },
                // ...
            ]
        }
    }
}
```

### Via Frontend Console:

```javascript
// Nach Login:
const account = window.$currentAccount;
console.log('Usage History:', account?.metadata?.usageHistory);

// Sollte zeigen:
// [
//   { date: "2025-10-10", used: 5, limit: 9 },
//   { date: "2025-10-09", used: 7, limit: 9 },
//   ...
// ]
```

---

## 🎯 Komplettes Beispiel: 4 Wochen für cm@chooo.de

### Schritt 1: Daten generieren (Development)

```javascript
// Localhost (Development):
// → Nur Store Update, KEIN API call

window.keymojiChartTest.pro4w();
// ✅ Chart zeigt sofort Daten
// ❌ Nicht in Google Sheets
```

### Schritt 2: Daten persistent machen (Production/Deployed)

```javascript
// Deployed App (z.B. Vercel):
// → Store Update + API call + Google Sheets

await window.keymojiUsageGenerator.generate4Weeks();
// ✅ Chart zeigt sofort Daten
// ✅ Gespeichert in Google Sheets
// ✅ Bleibt nach Reload
```

### Schritt 3: Verifizieren

```javascript
// 1. Check Store:
console.log(window.$currentAccount?.metadata?.usageHistory);

// 2. Reload Page:
location.reload();

// 3. Nach Reload checken:
setTimeout(() => {
    const account = window.$currentAccount;
    console.log('History after reload:', account?.metadata?.usageHistory);
    // Sollte 28 Einträge haben wenn persistent gespeichert
}, 2000);
```

---

## 🔧 Troubleshooting

### Problem: Chart zeigt keine Daten nach Reload

**Lösung:**

```javascript
// 1. Check ob Daten in currentAccount sind:
console.log('Account:', window.$currentAccount?.metadata?.usageHistory);
// → Wenn leer: Daten nicht aus API geladen

// 2. Check localStorage:
console.log('Local:', localStorage.getItem('keymoji_user_preferences'));
// → Sollte account info enthalten

// 3. Manuell API laden testen:
const account = window.$currentAccount;
const response = await fetch('https://keymoji-backend.vercel.app/api/account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'read',
        userId: account.userId,
        email: account.email
    })
});
const data = await response.json();
console.log('API Response:', data.account?.metadata?.usageHistory);
```

---

### Problem: Auf localhost funktioniert API save nicht

**Grund:** CORS Policy

**Lösung 1: Instant Test verwenden**

```javascript
// Nutze chartTestData für instant preview:
window.keymojiChartTest.pro4w();
// → Keine API calls, sofort sichtbar
```

**Lösung 2: Deployed App nutzen**

```javascript
// Öffne deployed App (Vercel):
// https://keymoji.wtf/account

// Dann:
await window.keymojiUsageGenerator.generate4Weeks();
// → API call funktioniert
```

---

## 📊 Beispiel: Verschiedene Nutzungsmuster für cm@chooo.de

### Pattern 1: Konstant hohe Nutzung (Aktiver User)

```javascript
const history = [];
for (let i = 0; i < 28; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
        date: date.toISOString().split('T')[0],
        used: Math.floor(9 * 0.8), // 80% = 7/9
        limit: 9
    });
}

window.keymojiChartTest.inject(history);
// → Flache Linie bei ~7
```

### Pattern 2: Wochenende-Muster

```javascript
const history = [];
for (let i = 0; i < 28; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    history.push({
        date: date.toISOString().split('T')[0],
        used: isWeekend ? 2 : 8, // Wenig am Wochenende, viel unter der Woche
        limit: 9
    });
}

window.keymojiChartTest.inject(history);
// → Zickzack-Muster (hoch-runter-hoch-runter)
```

### Pattern 3: Steigende Aktivität

```javascript
const history = [];
for (let i = 0; i < 28; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const progress = i / 28; // 0 bis 1
    
    history.push({
        date: date.toISOString().split('T')[0],
        used: Math.floor(9 * progress), // 0 → 9
        limit: 9
    });
}

window.keymojiChartTest.inject(history);
// → Ansteigende Linie von 0 bis 9
```

---

## ✅ Empfohlener Workflow für cm@chooo.de

### Development (localhost):

```bash
# 1. App starten
npm start

# 2. Login als cm@chooo.de
# 3. Browser Console:
window.keymojiChartTest.pro4w();

# 4. Verschiedene Patterns testen:
window.keymojiChartTest.wave();
window.keymojiChartTest.free7d();

# 5. Zeit-Perioden durchklicken (7d, 14d, 4w, 1y)
```

### Production (deployed):

```javascript
// 1. Öffne https://keymoji.wtf/account
// 2. Login als cm@chooo.de
// 3. Console:

await window.keymojiUsageGenerator.generate4Weeks();
// → Speichert in Google Sheets

// 4. Reload:
location.reload();

// 5. Chart sollte persistent sein!
```

---

## 🎨 Was Du sehen solltest:

### FREE Account (cm@chooo.de):

```
Chart Appearance:
- Farbe: Gelb (#eab308)
- Y-Achse: 0-9
- Datenpunkte: Grün/Gelb/Rot
- Pattern: Medium usage (3-7 pro Tag)
- Smooth animation beim Laden
```

### PRO Account (zum Testen):

```
Chart Appearance:
- Farbe: Lila (#a855f7)
- Y-Achse: 0-25
- Datenpunkte: Grün/Lila/Rot
- Pattern: Hohe usage (17-24 pro Tag)
- Smooth animation beim Laden
```

---

**Zusammenfassung:**

- **Schnelles Testen:** `keymojiChartTest` (instant, nicht persistent)
- **Echte Daten:** `keymojiUsageGenerator` (async, persistent)
- **Localhost:** Nur instant test möglich (CORS)
- **Deployed:** Beide Methoden funktionieren

**32 Commits ready to push! 🚀**

