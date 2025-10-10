# 🎯 FINAL DEPLOYMENT GUIDE - SVG Charts Finalisierung

## ✅ Status: Code ist KOMPLETT fertig!

### Frontend:

-   ✅ `userDataStore.js` - Robust data loading (profile + metadata support)
-   ✅ `AccountManager.svelte` - Verwendet neuen Store
-   ✅ `accountStore.js` - Login/Logout integration
-   ✅ `index.js` - Initialize on app start
-   ✅ Unterstützt **Google Sheets Struktur** (profile String + metadata JSON)

### Backend:

-   ✅ `api/account/update.js` - FLAT structure
-   ✅ `api/account.js` - FLAT structure
-   ✅ Ready to deploy

### n8n:

-   ✅ `KEYMOJI-ACCOUNT-WORKING-COMPLETE.json` - Fertiger Workflow
-   ✅ Alle Nodes verbunden
-   ✅ Garantiert Response

---

## 🚀 DEPLOYMENT (jetzt machen!)

### Step 1: n8n Workflow importieren (5 min)

```
1. Öffne: https://n8n.chooomedia.com

2. Deaktiviere alten Workflow:
   - Finde Workflow mit "xn--moji-pb73c-account"
   - Toggle auf INACTIVE
   - Umbenennen zu "OLD - Account Management"

3. Importiere neuen Workflow:
   - Menü (⋮) → "Import from File"
   - Wähle: n8n-workflows/KEYMOJI-ACCOUNT-WORKING-COMPLETE.json
   - Import

4. Set Credentials:
   - "Lookup Account" Node → Google Sheets OAuth2
   - "Update Sheets" Node → Google Sheets OAuth2
   - Wähle jeweils: "Google Sheets account"

5. Aktiviere:
   - Toggle auf ACTIVE
   - Überprüfe Webhook URL:
     https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account
```

### Step 2: Workflow testen (2 min)

```bash
# Test 1: GET action
curl https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{"action":"get","userId":"user_1760116259261","email":"cm@chooo.de"}'

# Erwartung: {"success":true,"account":{...}}

# Test 2: UPDATE action
curl https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{"action":"update","userId":"user_1760116259261","email":"cm@chooo.de","tier":"free","profile":{"name":"cm"},"metadata":{}}'

# Erwartung: {"success":true,"account":{...}}  (NICHT LEER!)
```

**Wenn UPDATE LEER ist**: Workflow noch nicht korrekt importiert/verbunden!

### Step 3: Backend deployen (2 min)

```bash
cd /Users/chooom/dev/kmoji/keymoji/keymoji-backend
vercel --prod
```

**Erwartung**:

```
✅  Production: https://keymoji.wtf
```

### Step 4: Vercel Logs überprüfen (1 min)

Nach Backend Deployment, teste nochmal auf Production:

```
1. Gehe zu: https://keymoji.wtf/en/account
2. Ändere Settings → Save
3. Vercel Logs ansehen:
   - Sollte zeigen: "n8n response text: {...}"
   - NICHT: "Empty response from n8n"
```

### Step 5: Frontend Production testen (3 min)

```
1. https://keymoji.wtf
2. Logout
3. Login mit Magic Link
4. Gehe zu /en/account
5. Überprüfe Console:
   ✅ "Usage history loaded: 28 entries"
   ✅ "Using real usage data"
6. Überprüfe Charts:
   ✅ Farbige Balken (nicht grau!)
```

---

## 📊 Erwartete Logs nach Deployment

### Frontend Console (Production):

```
🚀 Initializing user data stores...
✅ User data stores initialized
🔄 [CHART] Component mounted
👀 [CHART WATCH] Account changed, refreshing usage history...
📊 Starting usage history refresh...
🔍 [USAGE HISTORY] Checking data locations: {
  metadataHasHistory: true,
  profileHasHistory: false,
  finalHistoryLength: 28
}
✅ Usage history loaded from currentAccount: 28 entries
✅ Using real usage data: 28 entries
```

### Vercel Logs:

```
📡 Sending to n8n webhook: https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account
📡 n8n response status: 200 OK
📡 n8n response text: {"success":true,"account":{...}}
✅ Account updated successfully
```

### n8n Execution Log:

```
📥 Webhook received: { action: "update", ... }
📊 Existing data from Google Sheets
✅ Merged metadata: {...}
📤 Output: {...}
Response sent: {"success":true,...}
```

---

## 🎨 UI-Status nach Finalisierung

### Charts (AccountManager):

```
┌────────────────────────────────────┐
│  Daily Usage (Last 7 Days)         │
│                                    │
│  📈 [GELBE Balken - echte Daten!]  │
│                                    │
│  Total: 35 | Avg: 5 | Trend: ↗️    │
│                                    │
│  [7d] [14d] [4w] [3m]              │
│  🔄 Refresh                        │
└────────────────────────────────────┘
```

### Account Info:

```
Free seit 71 Tagen  ← Korrektes Datum! (2025-07-31)
```

---

## ✅ Success Criteria

### MUSS funktionieren:

-   [ ] n8n UPDATE gibt Response (nicht leer!)
-   [ ] Vercel Logs zeigen "200 OK" von n8n
-   [ ] Frontend Console zeigt "28 entries"
-   [ ] Charts sind FARBIG (nicht grau)
-   [ ] "Free seit 71 Tagen" (nicht "seit 0 Tagen")

### Optional (nice to have):

-   [ ] Settings speichern funktioniert
-   [ ] Refresh Button funktioniert
-   [ ] Stats werden korrekt angezeigt

---

## 🔧 Troubleshooting

### Wenn Charts immer noch grau:

**Check 1**: n8n Response

```bash
curl https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -d '{"action":"get","email":"cm@chooo.de"}'

# MUSS enthalten: "usageHistory": [...]
```

**Check 2**: Frontend Console

```
# Suche nach:
"Usage history loaded from currentAccount"
"metadataHasHistory: true" oder "profileHasHistory: true"
```

**Check 3**: localStorage

```javascript
// In Browser Console:
const prefs = JSON.parse(localStorage.getItem('keymoji_user_preferences'));
console.log('Profile:', prefs.profile);
console.log('Metadata:', prefs.metadata);
// Einer davon MUSS usageHistory haben!
```

---

## 🎯 Timeline

### Jetzt (vor Deployment):

-   ❌ n8n: Workflow kaputt (keine Connections)
-   ❌ Backend: Alte Version auf Vercel
-   ❌ Charts: Demo-Daten (grau)

### In 10 Minuten (nach Deployment):

-   ✅ n8n: Neuer Workflow (alle verbunden!)
-   ✅ Backend: Neue Version (FLAT structure)
-   ✅ Charts: Echte Daten (farbig!)

---

## 📝 Quick Checklist

```
□ n8n Workflow importieren
  └─ File: KEYMOJI-ACCOUNT-WORKING-COMPLETE.json
  └─ Credentials setzen
  └─ Aktivieren
  └─ Testen mit curl

□ Backend deployen
  └─ cd keymoji-backend
  └─ vercel --prod
  └─ Logs überprüfen

□ Frontend testen
  └─ Login auf Production
  └─ Console Logs überprüfen
  └─ Charts überprüfen (farbig?)

□ Success!
  └─ Charts zeigen echte Daten
  └─ "Free seit 71 Tagen"
  └─ Keine "Empty response" Fehler
```

---

**Action Required**:

1. Import n8n Workflow (`KEYMOJI-ACCOUNT-WORKING-COMPLETE.json`)
2. Deploy Backend (`vercel --prod`)
3. Test auf Production
4. **Charts funktionieren!** 🎉
