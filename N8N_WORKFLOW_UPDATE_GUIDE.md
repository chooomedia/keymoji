# 🔧 n8n Workflow Update Guide - UsageHistory Fix

## Problem

Der aktuelle n8n Workflow **löscht `usageHistory`** beim Settings-Update!

## Lösung

Der **"Process Update" Node** muss mit robustem Code ersetzt werden.

---

## 📋 Schritt-für-Schritt Anleitung:

### 1. n8n öffnen

-   Gehe zu: `https://n8n.chooomedia.com`
-   Login mit deinen Credentials

### 2. Workflow finden

-   Suche nach: **"Keymoji Account Management"**
-   Oder öffne den Workflow mit der Webhook-URL: `xn--moji-pb73c-account`

### 3. "Process Update" Node finden

-   Suche nach dem **Code Node** mit dem Namen **"Process Update"**
-   Position sollte zwischen "Read Accounts" und "Update Google Sheets" sein

### 4. Node Code ersetzen

1. **Doppelklick** auf "Process Update" Node
2. **Lösche** den kompletten JavaScript-Code
3. **Kopiere** den Code aus: `n8n-workflows/process-update-node-FIXED.js`
4. **Füge ein** in den Code-Editor
5. **Klick** auf "Execute Node" zum Testen (optional)
6. **Save** klicken

### 5. Workflow aktivieren

-   **Toggle** auf "Active" setzen (oben rechts)
-   **Save** klicken

---

## ✅ Was der neue Code macht:

### **ROBUST usageHistory Handling:**

```javascript
// 1. Parse existing data from Google Sheets
const existingUsageHistory = existingMetadata.usageHistory || [];

// 2. Parse incoming data from webhook
const incomingUsageHistory = incomingMetadata.usageHistory || [];

// 3. SMART DECISION:
const finalUsageHistory =
    incomingUsageHistory.length > existingUsageHistory.length
        ? incomingUsageHistory // Use incoming if MORE entries
        : existingUsageHistory; // Otherwise KEEP existing!

// 4. Merge metadata
const mergedMetadata = {
    ...existingMetadata,
    ...incomingMetadata,
    usageHistory: finalUsageHistory // ALWAYS preserve!
};
```

### **Key Features:**

✅ **Preserves usageHistory** - Nie gelöscht!
✅ **Smart comparison** - Nutzt die längere Liste
✅ **Deep merge** - Alle Felder werden korrekt gemerged
✅ **JSON String output** - Kompatibel mit Google Sheets
✅ **Extensive logging** - Debug-freundlich

---

## 🧪 Testing nach Update:

### Test 1: Settings Update (sollte usageHistory behalten)

```bash
curl -s 'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "update",
    "userId": "user_1753963152928",
    "email": "cm@chooo.de",
    "profile": {"name": "NewName"},
    "metadata": {
      "settings": {"name": "NewName", "theme": "dark"}
    }
  }' | jq '.account.metadata.usageHistory | length'
```

**Erwartetes Ergebnis:** `7` (oder mehr) - **NICHT 0!**

### Test 2: Usage Increment (sollte History erweitern)

```bash
curl -s 'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "update",
    "userId": "user_1753963152928",
    "email": "cm@chooo.de",
    "metadata": {
      "usageHistory": [
        {"date": "2025-10-11", "used": 3, "limit": 9},
        {"date": "2025-10-10", "used": 5, "limit": 9},
        {"date": "2025-10-09", "used": 7, "limit": 9}
      ]
    }
  }' | jq '.account.metadata.usageHistory | length'
```

**Erwartetes Ergebnis:** Mindestens die längere Liste!

---

## 📊 Google Sheets Test-Daten

Kopiere diesen String in die **metadata** Spalte deines Test-Accounts:

```json
{
    "name": "ch000",
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
        { "date": "2025-09-13", "used": 1, "limit": 9 },
        { "date": "2025-09-14", "used": 4, "limit": 9 },
        { "date": "2025-09-15", "used": 4, "limit": 9 },
        { "date": "2025-09-16", "used": 7, "limit": 9 },
        { "date": "2025-09-17", "used": 9, "limit": 9 },
        { "date": "2025-09-18", "used": 7, "limit": 9 },
        { "date": "2025-09-19", "used": 1, "limit": 9 },
        { "date": "2025-09-20", "used": 2, "limit": 9 },
        { "date": "2025-09-21", "used": 4, "limit": 9 },
        { "date": "2025-09-22", "used": 1, "limit": 9 },
        { "date": "2025-09-23", "used": 5, "limit": 9 },
        { "date": "2025-09-24", "used": 7, "limit": 9 },
        { "date": "2025-09-25", "used": 8, "limit": 9 },
        { "date": "2025-09-26", "used": 8, "limit": 9 },
        { "date": "2025-09-27", "used": 1, "limit": 9 },
        { "date": "2025-09-28", "used": 2, "limit": 9 },
        { "date": "2025-09-29", "used": 7, "limit": 9 },
        { "date": "2025-09-30", "used": 9, "limit": 9 },
        { "date": "2025-10-01", "used": 9, "limit": 9 },
        { "date": "2025-10-02", "used": 3, "limit": 9 },
        { "date": "2025-10-03", "used": 4, "limit": 9 },
        { "date": "2025-10-04", "used": 2, "limit": 9 },
        { "date": "2025-10-05", "used": 8, "limit": 9 },
        { "date": "2025-10-06", "used": 9, "limit": 9 },
        { "date": "2025-10-07", "used": 3, "limit": 9 },
        { "date": "2025-10-08", "used": 8, "limit": 9 },
        { "date": "2025-10-09", "used": 2, "limit": 9 },
        { "date": "2025-10-10", "used": 9, "limit": 9 }
    ]
}
```

Das gibt dir **28 Tage (4 Wochen)** realistische Test-Daten!

---

## ⚠️ WICHTIG:

Nach dem n8n Update **MUSS** der Workflow **neu aktiviert** werden, damit die Änderungen wirksam werden!

**Status Check:**

-   Workflow ist "Active" ✅
-   Webhook URL: `https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account`
-   Alle Nodes sind verbunden ✅
