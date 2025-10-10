# Google Sheets - Complete Row for cm@chooo.de

## 📊 Komplette Datenbank-Zeile mit 4 Wochen Chart-Daten

---

## 🔢 **Spalten-Struktur:**

| Spalte | Wert | Typ | Beschreibung |
|--------|------|-----|--------------|
| userId | user_1753963152928 | String | Eindeutige User-ID |
| email | cm@chooo.de | String | Email-Adresse |
| tier | free | String | Account-Typ |
| createdAt | 2025-07-31T23:19:26.866Z | ISO DateTime | Account-Erstellung |
| lastLogin | 2025-10-10T14:00:00.000Z | ISO DateTime | Letzter Login |
| profile | JSON String | String | User-Profil (siehe unten) |
| metadata | JSON String | String | Alle Metadaten (siehe unten) |
| status | active | String | Account-Status |

---

## 📝 **profile Spalte (JSON-String):**

```json
{"name":"chooo123456"}
```

**Als einzeiliger String für Google Sheets:**
```
{"name":"chooo123456"}
```

---

## 📊 **metadata Spalte (JSON-String):**

### **Formatiert (zum Lesen):**

```json
{
    "settings": {
        "name": "chooo123456",
        "language": "en",
        "theme": "dark",
        "notifications": true,
        "passwordLength": 8,
        "includeNumbers": true,
        "includeSymbols": true,
        "includeUppercase": true,
        "includeLowercase": true,
        "emojiCount": 9,
        "emojiCategories": ["faces", "animals", "food"],
        "excludeEmojis": [],
        "autoGenerate": false,
        "copyToClipboard": true,
        "showStrength": true,
        "saveHistory": false,
        "analytics": true,
        "shareUsage": false,
        "uiState": {
            "expandedSections": ["basic"]
        }
    },
    "dailyUsage": {
        "date": "2025-10-10",
        "used": 5,
        "limit": 9,
        "lastReset": "2025-10-10",
        "lastIncrement": "2025-10-10T14:00:00.000Z"
    },
    "usageHistory": [
        {"date": "2025-10-10", "used": 5, "limit": 9, "timestamp": "2025-10-10T12:00:00.000Z"},
        {"date": "2025-10-09", "used": 7, "limit": 9, "timestamp": "2025-10-09T12:00:00.000Z"},
        {"date": "2025-10-08", "used": 4, "limit": 9, "timestamp": "2025-10-08T12:00:00.000Z"},
        {"date": "2025-10-07", "used": 6, "limit": 9, "timestamp": "2025-10-07T12:00:00.000Z"},
        {"date": "2025-10-06", "used": 3, "limit": 9, "timestamp": "2025-10-06T12:00:00.000Z"},
        {"date": "2025-10-05", "used": 2, "limit": 9, "timestamp": "2025-10-05T12:00:00.000Z"},
        {"date": "2025-10-04", "used": 8, "limit": 9, "timestamp": "2025-10-04T12:00:00.000Z"},
        {"date": "2025-10-03", "used": 6, "limit": 9, "timestamp": "2025-10-03T12:00:00.000Z"},
        {"date": "2025-10-02", "used": 7, "limit": 9, "timestamp": "2025-10-02T12:00:00.000Z"},
        {"date": "2025-10-01", "used": 5, "limit": 9, "timestamp": "2025-10-01T12:00:00.000Z"},
        {"date": "2025-09-30", "used": 4, "limit": 9, "timestamp": "2025-09-30T12:00:00.000Z"},
        {"date": "2025-09-29", "used": 3, "limit": 9, "timestamp": "2025-09-29T12:00:00.000Z"},
        {"date": "2025-09-28", "used": 2, "limit": 9, "timestamp": "2025-09-28T12:00:00.000Z"},
        {"date": "2025-09-27", "used": 8, "limit": 9, "timestamp": "2025-09-27T12:00:00.000Z"},
        {"date": "2025-09-26", "used": 6, "limit": 9, "timestamp": "2025-09-26T12:00:00.000Z"},
        {"date": "2025-09-25", "used": 7, "limit": 9, "timestamp": "2025-09-25T12:00:00.000Z"},
        {"date": "2025-09-24", "used": 5, "limit": 9, "timestamp": "2025-09-24T12:00:00.000Z"},
        {"date": "2025-09-23", "used": 4, "limit": 9, "timestamp": "2025-09-23T12:00:00.000Z"},
        {"date": "2025-09-22", "used": 6, "limit": 9, "timestamp": "2025-09-22T12:00:00.000Z"},
        {"date": "2025-09-21", "used": 3, "limit": 9, "timestamp": "2025-09-21T12:00:00.000Z"},
        {"date": "2025-09-20", "used": 7, "limit": 9, "timestamp": "2025-09-20T12:00:00.000Z"},
        {"date": "2025-09-19", "used": 5, "limit": 9, "timestamp": "2025-09-19T12:00:00.000Z"},
        {"date": "2025-09-18", "used": 8, "limit": 9, "timestamp": "2025-09-18T12:00:00.000Z"},
        {"date": "2025-09-17", "used": 6, "limit": 9, "timestamp": "2025-09-17T12:00:00.000Z"},
        {"date": "2025-09-16", "used": 4, "limit": 9, "timestamp": "2025-09-16T12:00:00.000Z"},
        {"date": "2025-09-15", "used": 7, "limit": 9, "timestamp": "2025-09-15T12:00:00.000Z"},
        {"date": "2025-09-14", "used": 5, "limit": 9, "timestamp": "2025-09-14T12:00:00.000Z"},
        {"date": "2025-09-13", "used": 6, "limit": 9, "timestamp": "2025-09-13T12:00:00.000Z"}
    ],
    "source": "magic_link_verification",
    "tier": "free",
    "updatedAt": "2025-10-10T14:00:00.000Z",
    "updatedVia": "manual-google-sheets-update"
}
```

---

## 📋 **COPY-PASTE READY: Einzeilige Strings für Google Sheets**

### **profile Spalte (direkt kopieren):**

```
{"name":"chooo123456"}
```

### **metadata Spalte (direkt kopieren):**

```
{"settings":{"name":"chooo123456","language":"en","theme":"dark","notifications":true,"passwordLength":8,"includeNumbers":true,"includeSymbols":true,"includeUppercase":true,"includeLowercase":true,"emojiCount":9,"emojiCategories":["faces","animals","food"],"excludeEmojis":[],"autoGenerate":false,"copyToClipboard":true,"showStrength":true,"saveHistory":false,"analytics":true,"shareUsage":false,"uiState":{"expandedSections":["basic"]}},"dailyUsage":{"date":"2025-10-10","used":5,"limit":9,"lastReset":"2025-10-10","lastIncrement":"2025-10-10T14:00:00.000Z"},"usageHistory":[{"date":"2025-10-10","used":5,"limit":9,"timestamp":"2025-10-10T12:00:00.000Z"},{"date":"2025-10-09","used":7,"limit":9,"timestamp":"2025-10-09T12:00:00.000Z"},{"date":"2025-10-08","used":4,"limit":9,"timestamp":"2025-10-08T12:00:00.000Z"},{"date":"2025-10-07","used":6,"limit":9,"timestamp":"2025-10-07T12:00:00.000Z"},{"date":"2025-10-06","used":3,"limit":9,"timestamp":"2025-10-06T12:00:00.000Z"},{"date":"2025-10-05","used":2,"limit":9,"timestamp":"2025-10-05T12:00:00.000Z"},{"date":"2025-10-04","used":8,"limit":9,"timestamp":"2025-10-04T12:00:00.000Z"},{"date":"2025-10-03","used":6,"limit":9,"timestamp":"2025-10-03T12:00:00.000Z"},{"date":"2025-10-02","used":7,"limit":9,"timestamp":"2025-10-02T12:00:00.000Z"},{"date":"2025-10-01","used":5,"limit":9,"timestamp":"2025-10-01T12:00:00.000Z"},{"date":"2025-09-30","used":4,"limit":9,"timestamp":"2025-09-30T12:00:00.000Z"},{"date":"2025-09-29","used":3,"limit":9,"timestamp":"2025-09-29T12:00:00.000Z"},{"date":"2025-09-28","used":2,"limit":9,"timestamp":"2025-09-28T12:00:00.000Z"},{"date":"2025-09-27","used":8,"limit":9,"timestamp":"2025-09-27T12:00:00.000Z"},{"date":"2025-09-26","used":6,"limit":9,"timestamp":"2025-09-26T12:00:00.000Z"},{"date":"2025-09-25","used":7,"limit":9,"timestamp":"2025-09-25T12:00:00.000Z"},{"date":"2025-09-24","used":5,"limit":9,"timestamp":"2025-09-24T12:00:00.000Z"},{"date":"2025-09-23","used":4,"limit":9,"timestamp":"2025-09-23T12:00:00.000Z"},{"date":"2025-09-22","used":6,"limit":9,"timestamp":"2025-09-22T12:00:00.000Z"},{"date":"2025-09-21","used":3,"limit":9,"timestamp":"2025-09-21T12:00:00.000Z"},{"date":"2025-09-20","used":7,"limit":9,"timestamp":"2025-09-20T12:00:00.000Z"},{"date":"2025-09-19","used":5,"limit":9,"timestamp":"2025-09-19T12:00:00.000Z"},{"date":"2025-09-18","used":8,"limit":9,"timestamp":"2025-09-18T12:00:00.000Z"},{"date":"2025-09-17","used":6,"limit":9,"timestamp":"2025-09-17T12:00:00.000Z"},{"date":"2025-09-16","used":4,"limit":9,"timestamp":"2025-09-16T12:00:00.000Z"},{"date":"2025-09-15","used":7,"limit":9,"timestamp":"2025-09-15T12:00:00.000Z"},{"date":"2025-09-14","used":5,"limit":9,"timestamp":"2025-09-14T12:00:00.000Z"},{"date":"2025-09-13","used":6,"limit":9,"timestamp":"2025-09-13T12:00:00.000Z"}],"source":"magic_link_verification","tier":"free","updatedAt":"2025-10-10T14:00:00.000Z","updatedVia":"manual-google-sheets-update"}
```

---

## 📊 **Komplette Google Sheets Zeile (TAB-getrennt):**

```
user_1753963152928	cm@chooo.de	free	2025-07-31T23:19:26.866Z	2025-10-10T14:00:00.000Z	{"name":"chooo123456"}	{"settings":{"name":"chooo123456","language":"en","theme":"dark","notifications":true,"passwordLength":8,"includeNumbers":true,"includeSymbols":true,"includeUppercase":true,"includeLowercase":true,"emojiCount":9,"emojiCategories":["faces","animals","food"],"excludeEmojis":[],"autoGenerate":false,"copyToClipboard":true,"showStrength":true,"saveHistory":false,"analytics":true,"shareUsage":false,"uiState":{"expandedSections":["basic"]}},"dailyUsage":{"date":"2025-10-10","used":5,"limit":9,"lastReset":"2025-10-10","lastIncrement":"2025-10-10T14:00:00.000Z"},"usageHistory":[{"date":"2025-10-10","used":5,"limit":9,"timestamp":"2025-10-10T12:00:00.000Z"},{"date":"2025-10-09","used":7,"limit":9,"timestamp":"2025-10-09T12:00:00.000Z"},{"date":"2025-10-08","used":4,"limit":9,"timestamp":"2025-10-08T12:00:00.000Z"},{"date":"2025-10-07","used":6,"limit":9,"timestamp":"2025-10-07T12:00:00.000Z"},{"date":"2025-10-06","used":3,"limit":9,"timestamp":"2025-10-06T12:00:00.000Z"},{"date":"2025-10-05","used":2,"limit":9,"timestamp":"2025-10-05T12:00:00.000Z"},{"date":"2025-10-04","used":8,"limit":9,"timestamp":"2025-10-04T12:00:00.000Z"},{"date":"2025-10-03","used":6,"limit":9,"timestamp":"2025-10-03T12:00:00.000Z"},{"date":"2025-10-02","used":7,"limit":9,"timestamp":"2025-10-02T12:00:00.000Z"},{"date":"2025-10-01","used":5,"limit":9,"timestamp":"2025-10-01T12:00:00.000Z"},{"date":"2025-09-30","used":4,"limit":9,"timestamp":"2025-09-30T12:00:00.000Z"},{"date":"2025-09-29","used":3,"limit":9,"timestamp":"2025-09-29T12:00:00.000Z"},{"date":"2025-09-28","used":2,"limit":9,"timestamp":"2025-09-28T12:00:00.000Z"},{"date":"2025-09-27","used":8,"limit":9,"timestamp":"2025-09-27T12:00:00.000Z"},{"date":"2025-09-26","used":6,"limit":9,"timestamp":"2025-09-26T12:00:00.000Z"},{"date":"2025-09-25","used":7,"limit":9,"timestamp":"2025-09-25T12:00:00.000Z"},{"date":"2025-09-24","used":5,"limit":9,"timestamp":"2025-09-24T12:00:00.000Z"},{"date":"2025-09-23","used":4,"limit":9,"timestamp":"2025-09-23T12:00:00.000Z"},{"date":"2025-09-22","used":6,"limit":9,"timestamp":"2025-09-22T12:00:00.000Z"},{"date":"2025-09-21","used":3,"limit":9,"timestamp":"2025-09-21T12:00:00.000Z"},{"date":"2025-09-20","used":7,"limit":9,"timestamp":"2025-09-20T12:00:00.000Z"},{"date":"2025-09-19","used":5,"limit":9,"timestamp":"2025-09-19T12:00:00.000Z"},{"date":"2025-09-18","used":8,"limit":9,"timestamp":"2025-09-18T12:00:00.000Z"},{"date":"2025-09-17","used":6,"limit":9,"timestamp":"2025-09-17T12:00:00.000Z"},{"date":"2025-09-16","used":4,"limit":9,"timestamp":"2025-09-16T12:00:00.000Z"},{"date":"2025-09-15","used":7,"limit":9,"timestamp":"2025-09-15T12:00:00.000Z"},{"date":"2025-09-14","used":5,"limit":9,"timestamp":"2025-09-14T12:00:00.000Z"},{"date":"2025-09-13","used":6,"limit":9,"timestamp":"2025-09-13T12:00:00.000Z"}],"source":"magic_link_verification","tier":"free","updatedAt":"2025-10-10T14:00:00.000Z","updatedVia":"manual-google-sheets-update"}	active
```

---

## 🎯 **Wichtige Änderungen zur alten Zeile:**

### **❌ ALT:**
```
profile: chooo123456  (NUR String, KEIN JSON!)
metadata: {...nur settings, KEINE usageHistory...}
```

### **✅ NEU:**
```
profile: {"name":"chooo123456"}  (JSON-String!)
metadata: {
  settings: {...},
  dailyUsage: {...},        ← NEU!
  usageHistory: [28 entries] ← NEU! Für Chart!
}
```

### **Konkrete Verbesserungen:**
1. ✅ **profile** ist jetzt korrekter JSON-String
2. ✅ **emojiCount** von 5 → 9 (neue FREE limits)
3. ✅ **dailyUsage** hinzugefügt (heutiger Stand: 5/9)
4. ✅ **usageHistory** hinzugefügt (28 Tage für 4-Wochen-Chart)
5. ✅ **uiState.expandedSections** von `[]` → `["basic"]`
6. ✅ **lastLogin** aktualisiert auf heute

---

## 📊 **UsageHistory Details (28 Tage):**

```
Zeitraum: 2025-09-13 bis 2025-10-10 (28 Tage = 4 Wochen)

Datenmuster (realistisch):
- Schwankend zwischen 2-8 Generierungen pro Tag
- Durchschnitt: ~5.5 Generierungen/Tag
- Limit: 9/Tag (FREE tier)
- Nie überschritten (Werte 2-8)

Chart-Ansicht:
┌─ 9 ─────────────────────────────────────┐
│     *     *       *                     │
│   *   * *   *   *   *   *       *       │
│ *       *   * *   *   *   * * *   * *   │
│   *       *     *       *           *   │
└─ 0 ─────────────────────────────────────┘
  13.9           1.10            10.10
```

---

## 🔧 **Anleitung: In Google Sheets eintragen**

### **Methode 1: Spaltenweise (empfohlen)**

1. **Öffne** das Google Sheet
2. **Finde** die Zeile für `cm@chooo.de` (user_1753963152928)
3. **Update** folgende Spalten:

   **Spalte: profile**
   ```
   {"name":"chooo123456"}
   ```

   **Spalte: metadata** (kompletter String oben kopieren)
   ```
   {"settings":{...},"dailyUsage":{...},"usageHistory":[...]}
   ```

   **Spalte: lastLogin**
   ```
   2025-10-10T14:00:00.000Z
   ```

4. **Speichern**

### **Methode 2: Komplette Zeile (TAB-getrennt)**

1. **Kopiere** die komplette Zeile oben
2. **Paste** in Google Sheets
3. **Ersetze** die alte Zeile

---

## ✅ **Verification Checklist:**

Nach dem Update in Google Sheets:

- [ ] **profile** enthält JSON: `{"name":"chooo123456"}`
- [ ] **metadata** ist einzeiliger String (keine Zeilenumbrüche)
- [ ] **metadata** enthält `dailyUsage` Objekt
- [ ] **metadata** enthält `usageHistory` Array
- [ ] **usageHistory** hat 28 Einträge
- [ ] **emojiCount** ist 9 (nicht 5)
- [ ] **lastLogin** ist aktualisiert

---

## 🧪 **Testing nach Update:**

### **1. Login als cm@chooo.de**

```bash
# Navigate to
https://keymoji.wtf/de/account

# OR localhost:
http://localhost:8080/de/account
```

### **2. Browser Console:**

```javascript
// Check parsed data
const account = window.$currentAccount;

console.log('UsageHistory Length:', account.metadata?.usageHistory?.length);
// Expected: 28

console.log('First Entry:', account.metadata?.usageHistory?.[0]);
// Expected: { date: "2025-10-10", used: 5, limit: 9, ... }

console.log('Last Entry:', account.metadata?.usageHistory?.[27]);
// Expected: { date: "2025-09-13", used: 6, limit: 9, ... }
```

### **3. Visual Check:**

**Expected Chart:**
- ✅ 28 Datenpunkte sichtbar
- ✅ Zeitraum: 13.9 bis 10.10
- ✅ Gelbe Linie (FREE tier)
- ✅ Y-Achse: 0-9
- ✅ Werte schwanken zwischen 2-8
- ✅ Smooth Animation
- ✅ Interaktiv (hover, tooltips)

**Time Period Selector:**
- ✅ "7d" zeigt letzte 7 Tage
- ✅ "14d" zeigt letzte 14 Tage
- ✅ "4w" zeigt alle 28 Tage ← **STANDARD!**
- ✅ "1y" zeigt 365 Tage (nur 28 vorhanden)

---

## 📝 **Zusammenfassung:**

**Was wurde geändert:**
- ✅ `profile` korrigiert (JSON-String)
- ✅ `emojiCount` 5 → 9
- ✅ `dailyUsage` hinzugefügt
- ✅ `usageHistory` hinzugefügt (28 Tage)
- ✅ `uiState.expandedSections` angepasst
- ✅ `lastLogin` aktualisiert

**Ergebnis:**
- ✅ Chart zeigt 4 Wochen Daten
- ✅ Settings sind korrekt
- ✅ User kann Chart nutzen
- ✅ Alle Features funktionieren

---

**READY TO PASTE! 🚀**

