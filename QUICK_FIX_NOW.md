# QUICK FIX - Chart Sofort Testen

## 🚨 Problem: CORS + Rate Limit (429)

```
❌ Status 429 (Too Many Requests)
❌ CORS blockiert localhost
✅ UsageHistory entries: 0  ← LEER!
```

---

## ⚡ INSTANT FIX - Ohne Backend/Google Sheets

### Im Browser Console (F12) ausführen:

```javascript
// 1. Inject 28 days test data
window.chartDebugger.injectTestData()

// 2. Reload page
location.reload()
```

**Chart sollte SOFORT sichtbar sein mit 28 Tagen!** ✅

---

## 📊 Was passiert:

```javascript
injectTestData() erstellt:
{
  metadata: {
    usageHistory: [
      {date: "2025-10-10", used: 5, limit: 9},
      {date: "2025-10-09", used: 7, limit: 9},
      ... 26 weitere Einträge
    ]
  }
}

→ Direkt in currentAccount store injiziert
→ Kein API Call nötig
→ Chart bekommt Daten sofort
→ Rendert 28 Datenpunkte!
```

---

## 🎯 Nach Reload solltest du sehen:

✅ Loading skeleton (kurz)
✅ Yellow line chart
✅ 28 data points (circles)
✅ Date range: aktuelles Datum - 28 Tage zurück
✅ Smooth animation
✅ Interactive tooltips

---

## 🔍 Verify in Console:

```javascript
// Check if data was injected
window.$currentAccount.metadata.usageHistory.length
// Expected: 28

// Run test
window.instantChartTest()
// Expected: ✅ ALL TESTS PASSED!
```

---

## ⚠️ Note:

**Test-Daten sind nur temporär!**
- Verschwinden beim nächsten Logout
- Nicht in Google Sheets gespeichert
- Nur für Testing/Demo

**Für Production:**
- Google Sheets muss updated werden
- Oder teste auf https://keymoji.wtf (keine CORS)

---

## 🚀 DO THIS NOW:

```javascript
window.chartDebugger.injectTestData()
location.reload()
```

**Chart sollte sichtbar sein in 2 Sekunden!** 🎉
