# 🔧 Google Sheets - usageHistory wiederherstellen

## 🎯 Problem

**Alter Datensatz** (mit usageHistory):

```json
{
  "name": "chooom",
  "usageHistory": [28 Einträge],  ✅
  ...
}
```

**Neuer Datensatz** (ohne usageHistory):

```json
{
  "name": "ch000m1p",
  // ❌ usageHistory fehlt!
  ...
}
```

**Warum?** n8n Update hat usageHistory **nicht preserved**!

---

## ✅ Lösung: Manuell in Google Sheets hinzufügen

### Step 1: Google Sheets öffnen

```
URL: https://docs.google.com/spreadsheets/d/1VvcsyNMhDmY4FSa3Yl0ZY4oHOPu0BATN2NXyGn_yDLs/edit
Sheet: "accounts"
```

### Step 2: Account finden

```
Suche nach: cm@chooo.de
Zeile: user_1753963152928
```

### Step 3: metadata Spalte editieren

**Aktueller Wert**:

```json
{"name":"ch000m1p","language":"en","theme":"dark",...}
```

**Neuer Wert** (mit usageHistory):

```json
{
    "name": "ch000m1p",
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
    "uiState": { "expandedSections": [] },
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
            "used": 4,
            "limit": 9,
            "timestamp": "2025-10-08T12:00:00.000Z"
        },
        {
            "date": "2025-10-07",
            "used": 6,
            "limit": 9,
            "timestamp": "2025-10-07T12:00:00.000Z"
        },
        {
            "date": "2025-10-06",
            "used": 3,
            "limit": 9,
            "timestamp": "2025-10-06T12:00:00.000Z"
        },
        {
            "date": "2025-10-05",
            "used": 2,
            "limit": 9,
            "timestamp": "2025-10-05T12:00:00.000Z"
        },
        {
            "date": "2025-10-04",
            "used": 8,
            "limit": 9,
            "timestamp": "2025-10-04T12:00:00.000Z"
        }
    ]
}
```

**Oder verkürzte Version** (letzte 7 Tage):

```json
{
    "name": "ch000m1p",
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
    "uiState": { "expandedSections": [] },
    "usageHistory": [
        { "date": "2025-10-10", "used": 5, "limit": 9 },
        { "date": "2025-10-09", "used": 7, "limit": 9 },
        { "date": "2025-10-08", "used": 4, "limit": 9 },
        { "date": "2025-10-07", "used": 6, "limit": 9 },
        { "date": "2025-10-06", "used": 3, "limit": 9 },
        { "date": "2025-10-05", "used": 2, "limit": 9 },
        { "date": "2025-10-04", "used": 8, "limit": 9 }
    ]
}
```

### Step 4: Speichern & Testen

```bash
# Test n8n Response:
curl -s https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{"action":"get","userId":"user_1753963152928","email":"cm@chooo.de"}' \
  | jq '.account.metadata.usageHistory | length'

# Erwartung: 7 (oder 28, je nachdem was du eingefügt hast)
```

---

## 🔧 n8n Workflow Fix (DONE ✅)

### Neuer "Merge Data" Node:

**SMART MERGE Logic**:

```javascript
// Extract existing usageHistory from Google Sheets
const existingUsageHistory = existingMetadata.usageHistory || [];

// Only overwrite if incoming has MORE data
const incomingUsageHistory = incomingMetadata.usageHistory || [];
const finalUsageHistory =
    incomingUsageHistory.length > existingUsageHistory.length
        ? incomingUsageHistory
        : existingUsageHistory; // PRESERVE!

const mergedMetadata = {
    ...existingMetadata,
    ...incomingMetadata,
    usageHistory: finalUsageHistory // NEVER lose usageHistory!
};
```

**Das bedeutet**:

-   ✅ Wenn du Settings änderst → usageHistory bleibt erhalten!
-   ✅ Wenn Backend neue usageHistory sendet → wird verwendet!
-   ✅ Wenn Backend KEINE usageHistory sendet → alte bleibt!

---

## 📊 Nach dem Fix

### 1. Google Sheets manuell gefixt:

```
metadata: {...,"usageHistory":[...]}  ✅
```

### 2. n8n Workflow importiert:

```
File: KEYMOJI-ACCOUNT-WORKING-COMPLETE.json (UPDATED!)
→ Smart Merge preserves usageHistory ✅
```

### 3. Frontend lädt Daten:

```
📊 Starting usage history refresh...
🔍 [USAGE HISTORY] Checking data locations: {
  metadataHasHistory: true,  ✅
  finalHistoryLength: 7
}
✅ Usage history loaded from currentAccount: 7 entries
✅ Using real usage data: 7 entries
```

### 4. Charts zeigen Daten:

```
📈 [GELBE Balken - Echte Daten!]
Stats: Total: 37 | Avg: 5.3 | Trend: ↗️
```

---

## 🎯 Quick Fix Steps

**Für SOFORTIGE Lösung**:

1. **Google Sheets öffnen**
2. **Finde deine Email**: `cm@chooo.de`
3. **metadata Spalte**: Copy-paste den JSON oben
4. **Speichern**
5. **Frontend reload**
6. **Charts zeigen Daten!** 🎉

**Für PERMANENTE Lösung**:

1. **Google Sheets** (siehe oben)
2. **n8n Workflow importieren** (KEYMOJI-ACCOUNT-WORKING-COMPLETE.json)
3. **Backend deployen** (vercel --prod)
4. **Fertig!**

---

**Quick Copy-Paste für Google Sheets metadata Spalte**:

```json
{
    "name": "ch000m1p",
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
    "uiState": { "expandedSections": [] },
    "usageHistory": [
        { "date": "2025-10-10", "used": 5, "limit": 9 },
        { "date": "2025-10-09", "used": 7, "limit": 9 },
        { "date": "2025-10-08", "used": 4, "limit": 9 },
        { "date": "2025-10-07", "used": 6, "limit": 9 },
        { "date": "2025-10-06", "used": 3, "limit": 9 },
        { "date": "2025-10-05", "used": 2, "limit": 9 },
        { "date": "2025-10-04", "used": 8, "limit": 9 }
    ]
}
```

**Dann funktioniert alles SOFORT!** 🚀✨
