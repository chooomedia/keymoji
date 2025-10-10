# ⚡ Lade echte Chart-Daten - Browser Console

## 🎯 Copy-Paste in Browser Console

**Öffne Console** auf `localhost:8080/en/account` und paste:

```javascript
// LOAD REAL DATA FROM n8n
(async () => {
    try {
        console.log('📡 Loading real data from n8n...');

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

        const result = await response.json();
        console.log('✅ n8n Response:', result);

        // Parse metadata
        let metadata = result.account.metadata;
        if (typeof metadata === 'string') {
            metadata = JSON.parse(metadata);
        }

        console.log(
            '📊 usageHistory:',
            metadata.usageHistory?.length || 0,
            'entries'
        );

        // Update localStorage
        const prefs = JSON.parse(
            localStorage.getItem('keymoji_user_preferences')
        );
        prefs.metadata = metadata;
        prefs.createdAt = result.account.createdAt;
        localStorage.setItem('keymoji_user_preferences', JSON.stringify(prefs));

        console.log('✅ localStorage updated!');
        console.log('🔄 Reloading in 1 second...');

        setTimeout(() => location.reload(), 1000);
    } catch (error) {
        console.error('❌ Error:', error);
    }
})();
```

**Das war's!** Nach dem Reload zeigen Charts echte Daten! 🎉

---

## 📊 Erwartete Ausgabe:

```
📡 Loading real data from n8n...
✅ n8n Response: {success: true, account: {...}}
📊 usageHistory: 7 entries
✅ localStorage updated!
🔄 Reloading in 1 second...

[Nach Reload:]
✅ [ACCOUNT DEBUG] syncAccountData: UsageHistory entries: 7
🔍 [USAGE HISTORY] Checking data locations: {
  metadataHasHistory: true,  ✅
  finalHistoryLength: 7
}
✅ Usage history loaded from currentAccount: 7 entries
✅ Using real usage data: 7 entries
📊 [CHART STATE] {
  finalUsageHistoryLength: 7,
  isDemoDataShown: false,
  finalChartDataLength: 7
}
```

---

## 🎨 Was du dann siehst:

**Charts**:

```
📈 Daily Usage (Last 7 Days)
   [GELBE Balken - Echte Daten!]

   Stats:
   Total: 37
   Average: 5.3
   Trend: ↗️
```

**Account Info**:

```
Free seit 71 Tagen  ← Korrektes Datum!
```

---

## ✅ Verification

**Nach Reload, check in Console**:

```javascript
// 1. Check localStorage
const prefs = JSON.parse(localStorage.getItem('keymoji_user_preferences'));
console.log('usageHistory:', prefs.metadata.usageHistory);
// Sollte: Array mit 7 Einträgen

// 2. Check Chart State
// Schaue in Console Logs nach:
// "✅ Usage history loaded: 7 entries"
// "✅ Using real usage data"

// 3. Check UI
// Charts sollten GELBE Balken haben!
```

---

**QUICK FIX**: Copy-paste den JavaScript Code oben in Console!
**RESULT**: Charts zeigen echte Daten in 30 Sekunden! 🚀✨
