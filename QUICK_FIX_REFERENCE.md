# ⚡ Quick Fix Reference - SVG Charts Daten vom Backend

## 🎯 Das Hauptproblem

**Charts zeigen Demo-Daten, weil**:

1. ❌ n8n Workflow antwortet NICHT auf `action: "update"`
2. ❌ Backend bekommt KEINE Response von n8n
3. ❌ Frontend bekommt KEINE usageHistory Daten
4. ❌ Charts fallback zu Demo-Daten

## ⚡ Quick Fix (5 Minuten)

### 1. n8n Switch Node fixen:

```bash
# Öffne n8n
open https://n8n.chooomedia.com

# Workflow: "CREATE Account" oder "xn--moji-pb73c-account"
# 1. Switch Node klicken
# 2. "+ Add Rule" klicken
# 3. Konfigurieren:
#    - Condition: {{ $json.action }}
#    - Operation: equals
#    - Value: update
# 4. Output 2 zu "Read Accounts" verbinden
# 5. Save & Activate
```

### 2. Testen:

```bash
curl -X POST https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{"action":"update","userId":"test","email":"test@test.com","tier":"free","profile":{},"metadata":{}}'
```

**Erwartete Response** (nicht leer!):

```json
{"success":true,"account":{...}}
```

### 3. Backend deployen:

```bash
cd keymoji-backend
vercel --prod
```

### 4. Frontend testen:

```
1. Gehe zu: https://keymoji.wtf
2. Login
3. Gehe zu: /en/account
4. Console: "✅ Usage history loaded: 28 entries"
5. Charts: Zeigen echte Daten! ✅
```

## 🔍 Schnell-Diagnose

### Zeichen dass es NICHT funktioniert:

```
❌ n8n response text: (leer)
❌ UsageHistory is empty array
❌ No backend data, using demo dataset
❌ Charts sind GRAU (Demo-Modus)
```

### Zeichen dass es FUNKTIONIERT:

```
✅ n8n response text: {"success":true,...}
✅ Usage history loaded: 28 entries
✅ Using real usage data
✅ Charts sind FARBIG (echte Daten!)
```

## 📊 Relevante Logs

### Frontend (Production):

```javascript
// BAD (Demo-Daten):
📊 No backend data, using demo dataset
🎨 Chart will show in GRAY

// GOOD (Echte Daten):
✅ Usage history loaded from currentAccount: 28 entries
✅ Using real usage data: 28 entries
```

### Vercel Backend:

```javascript
// BAD:
📡 n8n response text:
⚠️ Empty response from n8n

// GOOD:
📡 n8n response status: 200 OK
📡 n8n response text: {"success":true,...}
✅ Account updated successfully
```

### n8n Execution:

```javascript
// BAD:
Error: Missing required field: action
(oder Workflow stoppt nach Switch)

// GOOD:
✅ Data validation passed
✅ Metadata updated
📤 Output for Google Sheets: {...}
```

## 🎯 Die 3 kritischen Punkte:

### 1️⃣ n8n Switch Node

```
MUSS haben: Rule 3 für "update"
MUSS haben: Output 2 → Read Accounts
```

### 2️⃣ Backend FLAT structure

```
MUSS senden: { action: "update", userId: "...", ... }
NICHT: { body: { action: "update", ... } }
```

### 3️⃣ Google Sheets metadata

```
MUSS haben: JSON string mit usageHistory array
Format: {"usageHistory": [{"date": "...", "used": 5}]}
```

## 🚀 Nach dem Fix

### Frontend Console:

```
✅ [LOGIN] Full account data loaded
✅ [LOGIN] CreatedAt from backend: 2024-11-15T...
✅ [LOGIN] UsageHistory entries: 28
🔄 Refreshing user data after login...
📊 Starting usage history refresh...
✅ Usage history loaded from currentAccount: 28 entries
✅ Using real usage data: 28 entries
```

### Charts UI:

```
┌────────────────────────────────────┐
│  Daily Usage (Last 7 Days)         │
│                                    │
│  📈 [Colorful Chart with data!]    │
│                                    │
│  Total: 35 | Avg: 5 | Trend: ↗️    │
│                                    │
│  [7d] [14d] [4w] [3m]              │
│  🔄 Refresh                        │
└────────────────────────────────────┘
```

### Demo vs Real Data:

**Demo** (localhost oder kein Backend):

```
📊 Chart: GRAU
💭 Overlay: "Start generating to see your real data"
📈 Daten: Statisch, immer gleich
```

**Real** (production mit Backend):

```
📊 Chart: FARBIG (gelb/lila)
💭 Overlay: Keine (echte Daten!)
📈 Daten: Dynamisch, vom Backend
```

## 🔧 Files zum Referenzieren

### n8n:

-   `n8n-workflows/02-account-management-ACTIVE-FIXED.json` - Fertiger Workflow
-   `N8N_VISUAL_FIX_GUIDE.md` - Dieser Guide
-   `FIX_N8N_WORKFLOW.md` - Detaillierte Anleitung

### Backend:

-   `keymoji-backend/api/account/update.js` - Updated (FLAT structure)
-   `keymoji-backend/api/account.js` - Updated (FLAT structure)
-   `FIX_N8N_WEBHOOK_STRUCTURE.md` - Backend Structure Fix

### Frontend:

-   `src/stores/userDataStore.js` - Robust data loading
-   `src/routes/AccountManager.svelte` - Verwendet neuen Store
-   `MIGRATION_TO_USER_DATA_STORE.md` - How it works

### Testing:

-   `test-n8n-webhook.sh` - Webhook Test Script
-   `BACKEND_DEPLOYMENT_CHECKLIST.md` - Deployment Guide

## 🎯 One-Liner Checks

```bash
# Check n8n Response (sollte JSON zurückgeben, nicht leer!)
curl -X POST https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{"action":"update","userId":"test","email":"test@test.com","tier":"free","profile":{},"metadata":{}}'

# Check Vercel Deployment Status
vercel ls

# Check Frontend (Production Console)
# Öffne: https://keymoji.wtf/en/account
# Console: Suche nach "Usage history loaded"
```

---

**Time to Fix**: 5-10 Minuten
**Difficulty**: Easy (Point & Click in n8n!)
**Impact**: HUGE! (Charts zeigen endlich Backend-Daten!)
**Priority**: HIGH! 🔥
