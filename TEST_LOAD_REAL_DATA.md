# 🧪 Test: Lade echte Daten vom Backend

## ✅ n8n gibt Daten zurück!

```bash
curl https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -d '{"action":"get","email":"cm@chooo.de"}' | jq '.account.metadata.usageHistory'

# Result: 7 Einträge! ✅
```

---

## 🔧 Wie Frontend die Daten laden kann

### Option 1: Logout → Login (simuliert Backend Load)

```
1. Gehe zu /en/account
2. Logout
3. Login mit Magic Link
4. → verifyMagicLinkFrontend() lädt Daten von n8n
5. → usageHistory wird in localStorage gespeichert
6. → Charts zeigen Daten!
```

### Option 2: Browser Console (Force Load)

```javascript
// In Browser Console auf localhost:8080

// 1. Lade Daten direkt von n8n
const response = await fetch(
    'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'get',
            userId: 'user_1753963152928',
            email: 'cm@chooo.de'
        })
    }
);

const data = await response.json();
console.log('📊 usageHistory:', data.account.metadata.usageHistory);

// 2. Speichere in localStorage
const prefs = JSON.parse(localStorage.getItem('keymoji_user_preferences'));
prefs.metadata = data.account.metadata;
localStorage.setItem('keymoji_user_preferences', JSON.stringify(prefs));

// 3. Reload Page
location.reload();

// → Charts zeigen Daten! ✅
```

### Option 3: Force Refresh Button

Im AccountManager gibt es einen **Refresh Button**:

```
1. Gehe zu /en/account
2. Klicke "🔄 Refresh" bei den Charts
3. → refreshUsageHistory(true) wird aufgerufen
4. → Lädt von currentAccount
5. → ABER: Wenn currentAccount.metadata leer ist, wird Demo gezeigt
```

---

## 🎯 Das eigentliche Problem

**Localhost**:

```
initializeAccountFromCookies()
  ↓
Load from localStorage
  ↓
localStorage.metadata: {} (leer!)  ← PROBLEM!
  ↓
currentAccount.metadata: {}
  ↓
refreshUsageHistory()
  ↓
metadata.usageHistory: undefined ❌
  ↓
Charts: Demo-Daten
```

**Warum ist localStorage leer?**
→ Du hast dich **NUR lokal** eingeloggt (ohne Backend API call!)
→ localStorage wurde mit leeren metadata gespeichert
→ usageHistory ist nur in Google Sheets, nicht in localStorage!

---

## ✅ Sofort-Lösung

### Variante A: Magic Link Login (empfohlen!)

```
1. Gehe zu localhost:8080
2. Logout
3. Login mit echtem Magic Link
   → Triggert: verifyMagicLinkFrontend()
   → Lädt: Daten von n8n
   → Speichert: In localStorage mit usageHistory!
4. Charts zeigen echte Daten! ✅
```

### Variante B: localStorage manuell fixen (quick hack!)

```javascript
// In Browser Console:

// 1. Lade aktuelle Prefs
const prefs = JSON.parse(localStorage.getItem('keymoji_user_preferences'));

// 2. Setze metadata mit usageHistory
prefs.metadata = {
    name: 'ch000m1p',
    language: 'en',
    theme: 'dark',
    usageHistory: [
        { date: '2025-10-10', used: 5, limit: 9 },
        { date: '2025-10-09', used: 7, limit: 9 },
        { date: '2025-10-08', used: 4, limit: 9 },
        { date: '2025-10-07', used: 6, limit: 9 },
        { date: '2025-10-06', used: 3, limit: 9 },
        { date: '2025-10-05', used: 2, limit: 9 },
        { date: '2025-10-04', used: 8, limit: 9 }
    ]
};

// 3. Speichern
localStorage.setItem('keymoji_user_preferences', JSON.stringify(prefs));

// 4. Reload
location.reload();
```

**Dann zeigen Charts SOFORT die Daten!** ✅

---

## 🚀 Nach dem Fix erwartete Logs:

```
📊 Starting usage history refresh...
🔍 [USAGE HISTORY] Checking data locations: {
  metadataHasHistory: true,  ✅
  profileHasHistory: false,
  finalHistoryLength: 7      ✅
}
✅ Usage history loaded from currentAccount: 7 entries
✅ Using real usage data: 7 entries
📊 [CHART STATE] {
  finalUsageHistoryLength: 7,
  isDemoDataShown: false,
  finalChartDataLength: 7
}
```

**Und Charts zeigen GELBE Balken mit echten Daten!** 📊✨

---

**Empfehlung**: Mache **Variante A (Logout → Login)** - das ist der saubere Weg und testet den kompletten Flow! 🚀
