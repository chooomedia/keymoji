# Google Sheets Manuelle Update Anleitung

## 🎯 Ziel: Chart-Daten für cm@chooo.de hinzufügen

### Account Info:

-   **Email:** cm@chooo.de
-   **UserId:** user_1760079091439
-   **Tier:** free
-   **Limit:** 9 generations/day

---

## 📝 Schritt-für-Schritt Anleitung

### Schritt 1: Google Sheets öffnen

1. Öffne das Keymoji Accounts Google Sheet
2. Finde die Row für `cm@chooo.de` (userId: `user_1760079091439`)
3. Gehe zur `metadata` Spalte

---

### Schritt 2: Aktuelle metadata analysieren

**AKTUELL:**

```json
{
    "name": "chooo12345",
    "language": "en",
    "theme": "dark",
    "notifications": true,
    "passwordLength": 8,
    "includeNumbers": true,
    "includeSymbols": true,
    "includeUppercase": true,
    "includeLowercase": true,
    "emojiCount": 5,
    "emojiCategories": ["faces", "animals", "food"],
    "excludeEmojis": [],
    "autoGenerate": false,
    "copyToClipboard": true,
    "showStrength": true,
    "saveHistory": false,
    "analytics": true,
    "shareUsage": false,
    "uiState": { "expandedSections": [] }
}
```

**Problem:**

-   ❌ Alte Struktur (settings direkt im metadata)
-   ❌ `emojiCount: 5` (sollte 9 sein für FREE)
-   ❌ Kein `dailyUsage`
-   ❌ Kein `usageHistory` (Chart hat keine Daten!)

---

### Schritt 3: Neue metadata Struktur (MIT usageHistory)

**⚠️ WICHTIG:** Kopiere den KOMPLETTEN JSON-String aus `GOOGLE_SHEETS_UPDATE.json`

Die neue Struktur hat:

-   ✅ `dailyUsage` - Heutiger Stand
-   ✅ `usageHistory` - Letzte 28 Tage für Chart
-   ✅ `settings` - User-Einstellungen (nested)
-   ✅ `emojiCount: 9` - Korrigiert für FREE

---

### Schritt 4: metadata Spalte ersetzen

1. **Klicke auf metadata Zelle** für cm@chooo.de
2. **Lösche den alten Inhalt**
3. **Kopiere KOMPLETT** aus `GOOGLE_SHEETS_UPDATE.json`
4. **Füge ein**
5. **Speichern** (Enter)

**KRITISCH:** Der komplette JSON muss **einzeilig** sein (keine Zeilenumbrüche)!

---

### Schritt 5: JSON einzeilig machen (falls nötig)

Wenn Google Sheets den JSON mit Zeilenumbrüchen nicht akzeptiert:

**Tool verwenden:**

1. Öffne: https://codebeautify.org/jsonminifier
2. Paste den JSON aus `GOOGLE_SHEETS_UPDATE.json`
3. Klick "Minify/Compress"
4. Kopiere das Resultat
5. Paste in Google Sheets

**Oder manuell:**

-   Alle Zeilenumbrüche entfernen
-   Alle doppelten Leerzeichen entfernen
-   Als eine Zeile

---

## 🔍 Erwartetes Resultat in Google Sheets

### metadata Spalte (einzeilig):

```
{"dailyUsage":{"date":"2025-10-10","used":5,"limit":9,"lastReset":"2025-10-10","lastIncrement":"2025-10-10T12:34:56.789Z"},"usageHistory":[{"date":"2025-10-10","used":5,"limit":9,"timestamp":"2025-10-10T12:00:00.000Z"},{"date":"2025-10-09","used":7,"limit":9,"timestamp":"2025-10-09T12:00:00.000Z"},{"date":"2025-10-08","used":4,"limit":9,"timestamp":"2025-10-08T12:00:00.000Z"},{"date":"2025-10-07","used":6,"limit":9,"timestamp":"2025-10-07T12:00:00.000Z"},{"date":"2025-10-06","used":3,"limit":9,"timestamp":"2025-10-06T12:00:00.000Z"},{"date":"2025-10-05","used":2,"limit":9,"timestamp":"2025-10-05T12:00:00.000Z"},{"date":"2025-10-04","used":8,"limit":9,"timestamp":"2025-10-04T12:00:00.000Z"},{"date":"2025-10-03","used":6,"limit":9,"timestamp":"2025-10-03T12:00:00.000Z"},{"date":"2025-10-02","used":7,"limit":9,"timestamp":"2025-10-02T12:00:00.000Z"},{"date":"2025-10-01","used":5,"limit":9,"timestamp":"2025-10-01T12:00:00.000Z"},{"date":"2025-09-30","used":4,"limit":9,"timestamp":"2025-09-30T12:00:00.000Z"},{"date":"2025-09-29","used":3,"limit":9,"timestamp":"2025-09-29T12:00:00.000Z"},{"date":"2025-09-28","used":2,"limit":9,"timestamp":"2025-09-28T12:00:00.000Z"},{"date":"2025-09-27","used":8,"limit":9,"timestamp":"2025-09-27T12:00:00.000Z"},{"date":"2025-09-26","used":6,"limit":9,"timestamp":"2025-09-26T12:00:00.000Z"},{"date":"2025-09-25","used":7,"limit":9,"timestamp":"2025-09-25T12:00:00.000Z"},{"date":"2025-09-24","used":5,"limit":9,"timestamp":"2025-09-24T12:00:00.000Z"},{"date":"2025-09-23","used":4,"limit":9,"timestamp":"2025-09-23T12:00:00.000Z"},{"date":"2025-09-22","used":6,"limit":9,"timestamp":"2025-09-22T12:00:00.000Z"},{"date":"2025-09-21","used":3,"limit":9,"timestamp":"2025-09-21T12:00:00.000Z"},{"date":"2025-09-20","used":7,"limit":9,"timestamp":"2025-09-20T12:00:00.000Z"},{"date":"2025-09-19","used":5,"limit":9,"timestamp":"2025-09-19T12:00:00.000Z"},{"date":"2025-09-18","used":8,"limit":9,"timestamp":"2025-09-18T12:00:00.000Z"},{"date":"2025-09-17","used":6,"limit":9,"timestamp":"2025-09-17T12:00:00.000Z"},{"date":"2025-09-16","used":4,"limit":9,"timestamp":"2025-09-16T12:00:00.000Z"},{"date":"2025-09-15","used":7,"limit":9,"timestamp":"2025-09-15T12:00:00.000Z"},{"date":"2025-09-14","used":5,"limit":9,"timestamp":"2025-09-14T12:00:00.000Z"},{"date":"2025-09-13","used":6,"limit":9,"timestamp":"2025-09-13T12:00:00.000Z"}],"settings":{"name":"chooo12345","language":"en","theme":"dark","notifications":true,"passwordLength":8,"includeNumbers":true,"includeSymbols":true,"includeUppercase":true,"includeLowercase":true,"emojiCount":9,"emojiCategories":["faces","animals","food"],"excludeEmojis":[],"autoGenerate":false,"copyToClipboard":true,"showStrength":true,"saveHistory":false,"analytics":true,"shareUsage":false,"uiState":{"expandedSections":["basic"]}},"source":"magic_link_verification","tier":"free","updatedAt":"2025-10-10T12:00:00.000Z","updatedVia":"manual-google-sheets-update"}
```

---

## ✅ Schritt 6: Frontend testen

### 1. Logout (falls eingeloggt)

```javascript
// Browser Console:
await window.logout();
// oder manuell logout
```

### 2. Login neu als cm@chooo.de

-   Magic Link anfordern
-   Verifizieren
-   Account wird geladen

### 3. Zu /account navigieren

```
http://localhost:8080/account
oder
https://keymoji.wtf/account
```

### 4. Chart sollte jetzt Daten zeigen!

**Erwartung:**

-   ✅ Chart zeigt 28 Datenpunkte
-   ✅ Gelbe Linie (FREE tier)
-   ✅ Y-Achse: 0-9
-   ✅ X-Achse: 13.9 bis 10.10
-   ✅ Smooth Animation beim Laden
-   ✅ Klick auf "4w" Button zeigt alle Daten

---

## 🔍 Verifizierung

### Console Check:

```javascript
// 1. Check currentAccount:
const account = window.$currentAccount;
console.log('Usage History:', account?.metadata?.usageHistory);

// Sollte zeigen:
// Array(28) [
//   { date: "2025-10-10", used: 5, limit: 9 },
//   { date: "2025-10-09", used: 7, limit: 9 },
//   ...
// ]

// 2. Check chart data:
// Inspect Element auf LineChart
// Sollte 28 <circle> elements haben (data points)

// 3. Check reactive binding:
console.log(
    'Chart gets data from:',
    'currentAccount.metadata.usageHistory →',
    'getUsageHistory() →',
    'generateChartData() →',
    'LineChart component'
);
```

---

## 🎨 Erwartete Chart-Darstellung

```
Daily Generations        [7d|14d|4w|1y]    0 / 9 remaining
┌────────────────────────────────────────────────────┐
│ 9 ┤                                                │
│   │        ●                       ●               │
│ 7 ┤    ●       ●               ●       ●           │
│   │                ●                       ●       │
│ 5 ┤                        ●   ●               ●   │
│   │            ●                                   │
│ 3 ┤    ●               ●                   ●       │
│   │                                ●               │
│ 0 └────────────────────────────────────────────────│
│   13.9  15.9  17.9  ...  01.10  03.10  ...  10.10 │
└────────────────────────────────────────────────────┘

Legende:
- Linie: Gelb (#eab308)
- Punkte: Grün (hoch), Gelb (mittel), Rot (niedrig)
- Fill: Gradient (gelb fade)
```

---

## 🔧 Troubleshooting

### Problem: Chart zeigt "Keine Daten verfügbar"

**Check 1: Ist metadata korrekt?**

```javascript
const account = window.$currentAccount;
console.log('Account:', account);
console.log('Metadata:', account?.metadata);
console.log('UsageHistory:', account?.metadata?.usageHistory);

// Wenn undefined → metadata nicht geladen
```

**Check 2: Google Sheets Syntax korrekt?**

-   JSON muss **valid** sein
-   Keine Syntax-Fehler
-   Einzeilig ohne Zeilenumbrüche
-   Alle Kommas, Klammern korrekt

**Check 3: Page reloaded?**

```javascript
location.reload();
// Daten werden nur beim Login/Reload geladen
```

---

### Problem: Chart zeigt alte Struktur

**Lösung: Cache clearen**

```javascript
// 1. Logout
await window.logout();

// 2. Clear localStorage
localStorage.clear();

// 3. Clear sessionStorage
sessionStorage.clear();

// 4. Reload
location.reload();

// 5. Login neu als cm@chooo.de
```

---

## 📊 Wichtige Änderungen in der neuen Struktur

| Alt                         | Neu                           | Grund                       |
| --------------------------- | ----------------------------- | --------------------------- |
| `emojiCount: 5`             | `emojiCount: 9`               | FREE users haben jetzt 9    |
| Settings direkt in metadata | `settings: {...}`             | Bessere Struktur            |
| Kein `dailyUsage`           | `dailyUsage: {...}`           | Aktueller Stand heute       |
| Kein `usageHistory`         | `usageHistory: [...]`         | Für Chart (28 Tage)         |
| `expandedSections: []`      | `expandedSections: ["basic"]` | Basic section default offen |

---

## ✅ Nach dem Update sollte cm@chooo.de haben:

-   ✅ **Chart mit 28 Tagen Daten**
-   ✅ **emojiCount: 9** (korrekt für FREE)
-   ✅ **dailyUsage** aktuell (heute)
-   ✅ **usageHistory** (Chart-Daten)
-   ✅ **settings** nested (neue Architektur)
-   ✅ **uiState** mit basic section offen

---

## 🚀 Alternative: Automatisch via Frontend

**Einfacher Weg (empfohlen):**

```javascript
// 1. Login als cm@chooo.de auf DEPLOYED App
// 2. Console:

await window.keymojiUsageGenerator.generate4Weeks();

// 3. Das Tool:
// ✅ Generiert 28 Tage Daten
// ✅ Sendet an API
// ✅ API speichert in Google Sheets
// ✅ Automatisch korrekte Struktur
// ✅ Keine manuelle JSON-Bearbeitung nötig!

// 4. Reload:
location.reload();

// 5. Chart zeigt Daten! ✅
```

**Dieser Weg ist SICHERER und EINFACHER!**

---

## 📦 Files zum Kopieren:

1. **GOOGLE_SHEETS_UPDATE.json** - Komplette neue metadata
2. **Einzeilige Version** (siehe unten)

### Einzeilige Version (Ready to Paste):

```
{"dailyUsage":{"date":"2025-10-10","used":5,"limit":9,"lastReset":"2025-10-10","lastIncrement":"2025-10-10T12:34:56.789Z"},"usageHistory":[{"date":"2025-10-10","used":5,"limit":9,"timestamp":"2025-10-10T12:00:00.000Z"},{"date":"2025-10-09","used":7,"limit":9,"timestamp":"2025-10-09T12:00:00.000Z"},{"date":"2025-10-08","used":4,"limit":9,"timestamp":"2025-10-08T12:00:00.000Z"},{"date":"2025-10-07","used":6,"limit":9,"timestamp":"2025-10-07T12:00:00.000Z"},{"date":"2025-10-06","used":3,"limit":9,"timestamp":"2025-10-06T12:00:00.000Z"},{"date":"2025-10-05","used":2,"limit":9,"timestamp":"2025-10-05T12:00:00.000Z"},{"date":"2025-10-04","used":8,"limit":9,"timestamp":"2025-10-04T12:00:00.000Z"},{"date":"2025-10-03","used":6,"limit":9,"timestamp":"2025-10-03T12:00:00.000Z"},{"date":"2025-10-02","used":7,"limit":9,"timestamp":"2025-10-02T12:00:00.000Z"},{"date":"2025-10-01","used":5,"limit":9,"timestamp":"2025-10-01T12:00:00.000Z"},{"date":"2025-09-30","used":4,"limit":9,"timestamp":"2025-09-30T12:00:00.000Z"},{"date":"2025-09-29","used":3,"limit":9,"timestamp":"2025-09-29T12:00:00.000Z"},{"date":"2025-09-28","used":2,"limit":9,"timestamp":"2025-09-28T12:00:00.000Z"},{"date":"2025-09-27","used":8,"limit":9,"timestamp":"2025-09-27T12:00:00.000Z"},{"date":"2025-09-26","used":6,"limit":9,"timestamp":"2025-09-26T12:00:00.000Z"},{"date":"2025-09-25","used":7,"limit":9,"timestamp":"2025-09-25T12:00:00.000Z"},{"date":"2025-09-24","used":5,"limit":9,"timestamp":"2025-09-24T12:00:00.000Z"},{"date":"2025-09-23","used":4,"limit":9,"timestamp":"2025-09-23T12:00:00.000Z"},{"date":"2025-09-22","used":6,"limit":9,"timestamp":"2025-09-22T12:00:00.000Z"},{"date":"2025-09-21","used":3,"limit":9,"timestamp":"2025-09-21T12:00:00.000Z"},{"date":"2025-09-20","used":7,"limit":9,"timestamp":"2025-09-20T12:00:00.000Z"},{"date":"2025-09-19","used":5,"limit":9,"timestamp":"2025-09-19T12:00:00.000Z"},{"date":"2025-09-18","used":8,"limit":9,"timestamp":"2025-09-18T12:00:00.000Z"},{"date":"2025-09-17","used":6,"limit":9,"timestamp":"2025-09-17T12:00:00.000Z"},{"date":"2025-09-16","used":4,"limit":9,"timestamp":"2025-09-16T12:00:00.000Z"},{"date":"2025-09-15","used":7,"limit":9,"timestamp":"2025-09-15T12:00:00.000Z"},{"date":"2025-09-14","used":5,"limit":9,"timestamp":"2025-09-14T12:00:00.000Z"},{"date":"2025-09-13","used":6,"limit":9,"timestamp":"2025-09-13T12:00:00.000Z"}],"settings":{"name":"chooo12345","language":"en","theme":"dark","notifications":true,"passwordLength":8,"includeNumbers":true,"includeSymbols":true,"includeUppercase":true,"includeLowercase":true,"emojiCount":9,"emojiCategories":["faces","animals","food"],"excludeEmojis":[],"autoGenerate":false,"copyToClipboard":true,"showStrength":true,"saveHistory":false,"analytics":true,"shareUsage":false,"uiState":{"expandedSections":["basic"]}},"source":"magic_link_verification","tier":"free","updatedAt":"2025-10-10T12:00:00.000Z","updatedVia":"manual-google-sheets-update"}
```

**☝️ Diesen String direkt in die metadata Spalte kopieren!**

---

## 🎯 Empfehlung

### ✅ BESTE Methode (Automatisch):

```javascript
// 1. App deployed öffnen: https://keymoji.wtf
// 2. Login: cm@chooo.de
// 3. Console:

await window.keymojiUsageGenerator.generate4Weeks();

// 4. Warten (1-2 Sekunden)
// 5. Reload

// ✅ Fertig! Alles automatisch korrekt in Google Sheets!
```

### ⚠️ Manuelle Methode nur wenn:

-   API nicht verfügbar
-   Spezifische Daten gewünscht
-   Backend-Probleme

---

**TL;DR:**

1. **Einzeiligen JSON** aus diesem Guide kopieren
2. **In Google Sheets** metadata Spalte pasten
3. **Save**
4. **Frontend reloaden**
5. **Chart sollte 28 Tage zeigen!**

Oder einfach: `await window.keymojiUsageGenerator.generate4Weeks()` ✨
