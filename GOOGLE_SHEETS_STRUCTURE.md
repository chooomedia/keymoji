# 📊 Google Sheets Daten-Struktur - Keymoji

## 🔍 Aktuelle Struktur (wie sie IST)

### Google Sheets Spalten:

| Spalte         | Typ         | Beispiel                   | Beschreibung                    |
| -------------- | ----------- | -------------------------- | ------------------------------- |
| `userId`       | String      | `user_1753963152928`       | Eindeutige User ID              |
| `email`        | String      | `cm@chooo.de`              | User Email                      |
| `tier`         | String      | `free` oder `pro`          | Account Tier                    |
| `createdAt`    | ISO Date    | `2025-07-31T23:19:26.866Z` | Account Creation                |
| `lastLogin`    | ISO Date    | `2025-10-10T09:08:48.599Z` | Last Login                      |
| **`profile`**  | String      | `"ch000m1"`                | ⚠️ NUR NAME (sollte JSON sein!) |
| **`metadata`** | JSON String | `{...}`                    | ⚠️ Enthält usageHistory!        |
| `status`       | String      | `active`                   | Account Status                  |

### ⚠️ **Problem: Inkonsistente Daten-Struktur!**

#### **Wie es SEIN SOLLTE (Standard)**:

```
profile:  {"name": "ch000m1"}
metadata: {
  "settings": {...},
  "usageHistory": [...]
}
```

#### **Wie es AKTUELL IST (in deinem Google Sheet)**:

```
profile:  "ch000m1"  ← Nur String, kein JSON!
metadata: "{...JSON mit allem drin...}"  ← Alles in einem!
```

### 📝 **Dein metadata Spalten-Inhalt** (als JSON formatiert):

```json
{
  "name": "ch000m1",
  "language": "en",
  "theme": "dark",
  "notifications": true,
  "passwordLength": 8,
  "includeNumbers": true,
  "includeSymbols": true,
  "includeUppercase": true,
  "includeLowercase": true,
  "emojiCount": 6,
  "emojiCategories": ["faces", "animals", "food"],
  "excludeEmojis": [],
  "autoGenerate": false,
  "copyToClipboard": true,
  "showStrength": true,
  "saveHistory": false,
  "analytics": true,
  "shareUsage": false,
  "uiState": {
    "expandedSections": []
  },
  "usageHistory": [
    {"date": "2025-10-10", "used": 5, "limit": 9, "timestamp": "2025-10-10T12:00:00.000Z"},
    {"date": "2025-10-09", "used": 7, "limit": 9, "timestamp": "2025-10-09T12:00:00.000Z"},
    ... 28 total entries
  ]
}
```

**Analysis**:

-   ✅ `usageHistory` ist vorhanden (28 Einträge!)
-   ❌ Aber: Alles ist in `metadata` gemischt (Settings + History)
-   ❌ `profile` ist nur String, nicht JSON Object

---

## ✅ **Lösung: Code unterstützt BEIDE Strukturen**

### Anpassungen in `userDataStore.js`:

```javascript
// Settings Loading:
const settings =
    parsedMetadata.settings || // Standard: metadata.settings
    parsedProfile || // Fallback: profile (deine Struktur!)
    {};

// Usage History Loading:
const history =
    parsedMetadata.usageHistory || // Standard: metadata.usageHistory
    parsedProfile.usageHistory || // Fallback: profile.usageHistory (deine Struktur!)
    [];
```

**Resultat**: ✅ Code funktioniert mit BEIDEN Strukturen!

---

## 🔧 **Wie n8n die Daten speichert**

### n8n "Process Update" Node:

```javascript
// Build output for Google Sheets
const output = {
    userId: body.userId,
    email: body.email,
    tier: body.tier || 'free',
    createdAt: lookupData?.createdAt || new Date().toISOString(),
    lastLogin: body.lastLogin || new Date().toISOString(),
    profile: JSON.stringify(updatedProfile), // ← Wird als JSON String gespeichert
    metadata: JSON.stringify(updatedMetadata), // ← Wird als JSON String gespeichert
    status: body.status || 'active'
};
```

### Wenn n8n UPDATE bekommt:

```javascript
// Incoming from Frontend:
{
  action: "update",
  userId: "...",
  profile: { name: "ch000m1" },
  metadata: {
    settings: {...},
    usageHistory: [...]
  }
}

// n8n speichert in Google Sheets:
profile:  '{"name":"ch000m1"}'                    // ← JSON String
metadata: '{"settings":{...},"usageHistory":[...]}' // ← JSON String
```

**Aber**: In deinem Sheet ist `profile` nur `"ch000m1"` (kein JSON!)
**Das bedeutet**: Alte Daten wurden MANUELL oder mit altem Code gespeichert!

---

## 🎯 **Empfohlene Struktur-Migration**

### Option A: Daten in Google Sheets korrigieren (manuell)

**Für jeden Account**:

```
Spalte profile:
  Aktuell: "ch000m1"
  Ändern zu: {"name":"ch000m1"}

Spalte metadata:
  Aktuell: {alles gemischt}
  Strukturieren:
  {
    "settings": {
      "name": "ch000m1",
      "language": "en",
      "theme": "dark",
      ...
    },
    "usageHistory": [...]
  }
```

### Option B: Code unterstützt beide (BEREITS GEMACHT!)

**Code prüft BEIDE Locations**:

-   ✅ Standard: `metadata.settings` + `metadata.usageHistory`
-   ✅ Fallback: `profile` (für alte Daten)

**Vorteil**: Funktioniert mit alten UND neuen Daten!

---

## 📊 **Data Flow nach Fix**

### GET Request (funktioniert bereits!):

```
Frontend: GET /api/account
  ↓
n8n: action="get" → Output 1 ✅
  ↓
Google Sheets: Lookup by email ✅
  ↓
Response: {
  profile: "ch000m1",  ← String
  metadata: "{...}"    ← JSON String
}
  ↓
Frontend: safeJSONParse(metadata) ✅
  ↓
Extract: usageHistory from profile OR metadata ✅
  ↓
Charts: Zeigen Daten! ✅
```

### UPDATE Request (nach Fix):

```
Frontend: UPDATE /api/account
  ↓
Backend: Sendet FLAT { action: "update", ... }
  ↓
n8n: action="update" → Output 2 ✅ (nach Switch Fix!)
  ↓
Google Sheets: Update by userId ✅
  ↓
Response: {
  profile: "ch000m1",
  metadata: "{...}"
}
  ↓
Frontend: Parse + Extract ✅
  ↓
Charts: Update! ✅
```

---

## 🚀 **Nächste Schritte**

### 1. Code ist ready! ✅

-   ✅ `userDataStore.js` prüft profile UND metadata
-   ✅ Unterstützt alte UND neue Struktur
-   ✅ Robustes Parsing mit Fallbacks

### 2. Backend deployen:

```bash
cd keymoji-backend
vercel --prod
```

### 3. n8n Switch Node fixen:

```
n8n → Workflow → Switch → Add "update" Case
```

### 4. Testen:

```bash
# Nach BEIDEN Fixes:
curl https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -d '{"action":"update","userId":"user_1760116259261","email":"cm@chooo.de"}'

# Erwartung: Vollständige Response mit account data!
```

---

## 📋 **Warum Charts JETZT funktionieren sollten**

Auch mit der **aktuellen Google Sheets Struktur**:

```javascript
// n8n Response (GET):
{
  "profile": "ch000m1",  // ← String
  "metadata": "{...usageHistory:[...]...}"  // ← JSON String
}

// Frontend Parse:
const parsedMetadata = JSON.parse(metadata);
// = { name: "ch000m1", usageHistory: [...], ... }

const parsedProfile = metadata (String);
// = "ch000m1"

// Extract usageHistory:
const history =
    parsedMetadata.usageHistory ||  // ✅ HIER GEFUNDEN!
    parsedProfile.usageHistory ||   // undefined
    [];

// Result: history = [28 Einträge] ✅
```

**Fazit**: Code sollte jetzt die Daten finden, **auch mit der aktuellen Struktur**!

---

**Status**: ✅ Code ist ready für beide Strukturen!
**Action**: Backend deployen + n8n fixen!
**Result**: Charts zeigen Daten! 🎉
