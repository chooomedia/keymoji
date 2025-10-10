# Usage History Setup Guide - Test Data Generator

## 🎯 Quick Start für cm@chooo.de Account

### Schritt 1: Login mit Account

1. Öffne App: `http://localhost:8080`
2. Navigiere zu `/account`
3. Login mit: `cm@chooo.de`
4. Magic Link verifizieren

### Schritt 2: Test-Daten generieren (Browser Console)

```javascript
// ⚡ Quick: 4 Wochen realistische Daten
await window.keymojiUsageGenerator.generate4Weeks();

// Chart sollte sofort aktualisiert werden!
// Wenn nicht: Reload page
```

### Schritt 3: Verifizieren

```javascript
// Check generated data
const account =
    window.$currentAccount || document.querySelector('[data-account]');
console.log('History entries:', account?.metadata?.usageHistory?.length);

// Should show 28 entries
```

---

## 🔧 Available Commands

### 1. **Quick Commands (Most Used)**

```javascript
// Generate 4 weeks (28 days) realistic data
await window.keymojiUsageGenerator.generate4Weeks();

// Generate 7 days with increasing pattern
await window.keymojiUsageGenerator.generate7Days();

// Generate 1 year (365 days) data
await window.keymojiUsageGenerator.generate1Year();

// Clear all history
await window.keymojiUsageGenerator.clear();
```

### 2. **Custom Data Generation**

```javascript
// Generate X days with realistic pattern
const history = window.keymojiUsageGenerator.generateRealistic(14, 'free');
// Returns: Array of 14 entries

// Generate with specific pattern
const increasing = window.keymojiUsageGenerator.generatePattern(
    'increasing',
    28,
    'free'
);
const decreasing = window.keymojiUsageGenerator.generatePattern(
    'decreasing',
    28,
    'free'
);
const stable = window.keymojiUsageGenerator.generatePattern(
    'stable',
    28,
    'free'
);
const random = window.keymojiUsageGenerator.generatePattern(
    'random',
    28,
    'free'
);

// Save custom history
await window.keymojiUsageGenerator.save(history);
```

---

## 📊 Test Scenarios

### Scenario 1: FREE User (cm@chooo.de) - 4 Wochen

```javascript
// 1. Ensure logged in as FREE user
console.log('Tier:', window.$accountTier); // Should be 'free'

// 2. Generate 28 days of realistic data
const history = window.keymojiUsageGenerator.generateRealistic(28, 'free');

console.log('Generated history:', history);
console.log('Total entries:', history.length);
console.log('First entry:', history[0]);
console.log('Last entry:', history[history.length - 1]);

// 3. Save to account
await window.keymojiUsageGenerator.save(history);

// 4. Verify in UI
// → Navigate to /account
// → Chart should show data for last 4 weeks
// → Click "4w" button to see all data
```

### Scenario 2: PRO User - 1 Jahr

```javascript
// 1. Switch to PRO tier (for testing)
window.$accountTier.set('pro');

// 2. Generate 1 year of data
const history = window.keymojiUsageGenerator.generateRealistic(365, 'pro');

// 3. Save
await window.keymojiUsageGenerator.save(history);

// 4. Test different time periods
// → Click "7d" → Should show last 7 days
// → Click "14d" → Should show last 14 days
// → Click "4w" → Should show last 28 days
// → Click "1y" → Should show all 365 days
```

### Scenario 3: Specific Patterns

```javascript
// Increasing trend (user getting more active)
const increasing = window.keymojiUsageGenerator.generatePattern(
    'increasing',
    14,
    'free'
);
await window.keymojiUsageGenerator.save(increasing);

// Decreasing trend (user getting less active)
const decreasing = window.keymojiUsageGenerator.generatePattern(
    'decreasing',
    14,
    'free'
);
await window.keymojiUsageGenerator.save(decreasing);

// Stable usage
const stable = window.keymojiUsageGenerator.generatePattern(
    'stable',
    14,
    'free'
);
await window.keymojiUsageGenerator.save(stable);
```

---

## 🎨 Expected Chart Appearance

### 4 Weeks Data (FREE User)

```
Chart Display:
┌─────────────────────────────────────────┐
│  Daily Generations    [7d|14d|4w|1y]    │
│                       0 / 9 remaining   │
├─────────────────────────────────────────┤
│  9 ┤                                    │
│    │    ●                               │
│  7 ┤  ●   ●   ●                         │
│    │          ●   ●                     │
│  5 ┤                  ●   ●             │
│    │                          ●   ●     │
│  3 ┤                                  ● │
│    │                                    │
│  0 └────────────────────────────────────│
│    Mon Tue Wed Thu Fri Sat Sun Mon...  │
└─────────────────────────────────────────┘

Colors:
- Line: Yellow (#eab308)
- Points: Green (high), Yellow (medium), Red (low)
- Fill: Gradient (yellow fade)
```

### 1 Year Data (PRO User)

```
Chart Display:
┌─────────────────────────────────────────┐
│  Daily Generations    [7d|14d|4w|1y]    │
│                       ∞ Pro             │
├─────────────────────────────────────────┤
│ 25 ┤         ●                          │
│    │    ●        ●      ●               │
│ 20 ┤                        ●           │
│    │                            ●       │
│ 15 ┤  ●                              ●  │
│    │                                    │
│ 10 ┤                                    │
│    │                                    │
│  0 └────────────────────────────────────│
│    Jan Feb Mar Apr May Jun Jul Aug...  │
└─────────────────────────────────────────┘

Colors:
- Line: Purple (#a855f7)
- Points: Green (high), Purple (medium), Red (low)
- Fill: Gradient (purple fade)
```

---

## 🔍 Data Structure in Google Sheets

### After Running `generate4Weeks()`

```json
{
    "userId": "user_1760079091439",
    "email": "cm@chooo.de",
    "tier": "free",
    "metadata": {
        "usageHistory": [
            {
                "date": "2025-10-10",
                "used": 6,
                "limit": 9,
                "timestamp": "2025-10-10T12:00:00.000Z"
            },
            {
                "date": "2025-10-09",
                "used": 8,
                "limit": 9,
                "timestamp": "2025-10-09T12:00:00.000Z"
            },
            {
                "date": "2025-10-08",
                "used": 4,
                "limit": 9,
                "timestamp": "2025-10-08T12:00:00.000Z"
            }
            // ... 25 more entries (28 total)
        ]
    }
}
```

---

## 📝 Anleitung für cm@chooo.de

### Methode 1: Browser Console (Einfachste)

```javascript
// 1. Öffne Browser Console (F12 oder Cmd+Option+I)

// 2. Führe aus:
await window.keymojiUsageGenerator.generate4Weeks();

// 3. Warte auf Bestätigung:
// ✅ currentAccount updated with test history
// ✅ Usage history saved to API
// ✅ 4 weeks data generated successfully!

// 4. Reload Page:
location.reload();

// 5. Chart sollte jetzt 28 Tage anzeigen!
```

### Methode 2: Schritt für Schritt

```javascript
// 1. Generate data (without saving)
const testData = window.keymojiUsageGenerator.generateRealistic(28, 'free');

// 2. Inspect data
console.log('Generated:', testData);
console.table(testData.slice(0, 7)); // Show first week

// 3. If looks good, save it
await window.keymojiUsageGenerator.save(testData);

// 4. Verify
const account = window.$currentAccount;
console.log('Saved history:', account?.metadata?.usageHistory);
```

### Methode 3: Custom Pattern

```javascript
// Create custom data
const customHistory = [];
for (let i = 0; i < 28; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    customHistory.push({
        date: date.toISOString().split('T')[0],
        used: Math.floor(Math.random() * 9), // Random 0-9
        limit: 9,
        timestamp: date.toISOString()
    });
}

// Save
await window.keymojiUsageGenerator.save(customHistory);
```

---

## 🧪 Testing Checklist

### After Data Generation

-   [ ] **Chart Visible**: LineChart rendert ohne Fehler
-   [ ] **Data Points**: Alle Tage haben Datenpunkte
-   [ ] **Colors Correct**: Yellow für FREE, Purple für PRO
-   [ ] **Animations Work**: Line zeichnet sich smooth ein
-   [ ] **Tooltips Work**: Hover über Punkte zeigt Datum + Wert
-   [ ] **Period Selector**: Alle Buttons (7d, 14d, 4w, 1y) funktionieren
-   [ ] **Responsive**: Chart passt sich an Breite an
-   [ ] **Dark Mode**: Chart ändert Farben korrekt
-   [ ] **Empty State**: "Keine Daten verfügbar" bei leerem Array

### Test Different Time Periods

```javascript
// Generate full year
await window.keymojiUsageGenerator.generate1Year();

// Then click each period button:
// - 7d: Should show last 7 days
// - 14d: Should show last 14 days
// - 4w: Should show last 28 days
// - 1y: Should show all 365 days
```

---

## ⚠️ Wichtige Hinweise

### 1. **Nur in Development**

Die Generator-Tools sind **nur in Development Mode** verfügbar:

```javascript
if (process.env.NODE_ENV === 'development') {
    // Tools available
}
```

In Production wird `window.keymojiUsageGenerator` **nicht** verfügbar sein.

### 2. **API Calls bei Localhost**

Bei `localhost` werden API-Calls **übersprungen** (CORS):

```javascript
// localhost → Only updates currentAccount store
// production → Updates store AND Google Sheets
```

### 3. **Limit auf 365 Tage**

Die History wird automatisch auf **365 Einträge begrenzt**:

```javascript
updatedHistory = updatedHistory
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 365); // Keep only last year
```

### 4. **Deduplizierung**

Nur **ein Eintrag pro Tag** - bei mehreren Updates wird der neueste behalten.

---

## 📊 Beispiel Output

```javascript
await window.keymojiUsageGenerator.generate4Weeks();

// Console Output:
// 📊 Generating 4 Weeks Usage Data
//   Tier: free
//   Entries: 28
//   Sample: [
//     { date: '2025-10-10', used: 6, limit: 9 },
//     { date: '2025-10-09', used: 8, limit: 9 },
//     { date: '2025-10-08', used: 4, limit: 9 }
//   ]
// ✅ currentAccount updated with test history
// 📡 Saving usage history to API: {...}
// ✅ Usage history saved to API
// ✅ 4 weeks data generated successfully!
// 🔄 Reload page to see chart update
```

---

## 🚀 Production Deployment

### n8n Workflow

Stelle sicher dass der n8n Workflow `metadata.usageHistory` korrekt handled:

```javascript
// Code Node: Process Update
const webhook = $input.first().json;
const lookupData = items[1].json;

// Parse existing history
let existingHistory = [];
try {
    if (lookupData.metadata) {
        const metadata = JSON.parse(lookupData.metadata || '{}');
        existingHistory = metadata.usageHistory || [];
    }
} catch (error) {
    console.warn('Failed to parse existing history');
}

// Merge with incoming history
const incomingHistory = webhook.body.metadata?.usageHistory || [];
const mergedHistory = [...incomingHistory]; // Use incoming if provided

// Keep only last 365 days
const sortedHistory = mergedHistory
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 365);

// Return
return {
    json: {
        ...output,
        Metadata: JSON.stringify({
            ...metadata,
            usageHistory: sortedHistory
        })
    }
};
```

---

**Version:** 0.5.7  
**Feature:** Usage History Test Data Generator  
**Status:** ✅ Ready for Testing  
**Account:** cm@chooo.de  
**Command:** `await window.keymojiUsageGenerator.generate4Weeks()`
