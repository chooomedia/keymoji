# 🏠 Localhost Development Setup

## ⚠️ Wichtig: Vercel Functions laufen NICHT lokal!

### Problem:

```
POST http://localhost:8080/api/account 404 (Not Found)
❌ cachedFetch error: API returned 404: Not Found
```

### Warum?

**Vercel Serverless Functions** (`/api/*`) sind **deployment-only** und laufen NICHT auf `localhost:8080`!

## ✅ Lösung: Graceful Fallback

Der Code verwendet jetzt **automatische localhost Detection**:

### A) Session Restore (`initializeAccountFromCookies`):

```javascript
// Skip API call on localhost
const isLocalhost = window.location.hostname === 'localhost';

if (isLocalhost) {
    console.log(
        '⚠️ [SESSION RESTORE] Localhost detected - using localStorage data'
    );
    throw new Error('Localhost: API not available');
}

// ... API call only on production
```

### B) Login (`verifyMagicLinkFrontend`):

```javascript
// Skip API call on localhost
const isLocalhost = window.location.hostname === 'localhost';

if (isLocalhost) {
    console.log('⚠️ [LOGIN] Localhost detected - using verification data only');
    throw new Error('Localhost: API not available');
}

// ... API call only on production
```

## 📊 Was funktioniert auf localhost:

### ✅ Funktioniert:

-   Frontend komplett (Svelte, Tailwind, Webpack)
-   n8n Webhooks (direkt zu `n8n.chooomedia.com`)
-   Magic Link Login (über n8n)
-   LocalStorage (alle User Preferences)
-   Settings (werden in localStorage gespeichert)
-   UI/UX komplett

### ⚠️ Eingeschränkt:

-   **Account API** (`/api/account`): 404 → Fallback zu localStorage
-   **Charts**: Zeigen Demo-Daten (keine echten usageHistory vom Backend)
-   **createdAt**: Wird von localStorage geladen (oder current date als fallback)

### ❌ Funktioniert NICHT:

-   Vercel Serverless Functions (`/api/*`)
-   Payment Processing (Stripe)
-   Email Sending (Brevo)

## 🎯 Empfohlener Workflow:

### Localhost Development:

```bash
# Frontend Development
cd /Users/chooom/dev/kmoji/keymoji
npm run dev
# → http://localhost:8080

# Features:
# - UI/UX Development ✅
# - Component Testing ✅
# - Layout Changes ✅
# - Styling (Tailwind) ✅
# - Magic Link Login (via n8n) ✅
# - Settings (localStorage) ✅
```

### Production Testing:

```bash
# Deploy Backend
cd keymoji-backend
vercel --prod

# Deploy Frontend
cd ..
# (deploy via Vercel GitHub integration)

# Features:
# - Alle Backend APIs ✅
# - Charts mit echten Daten ✅
# - Account Management ✅
# - Payment Processing ✅
# - Email Sending ✅
```

## 🔧 Console Logs auf localhost:

### Erwartete Logs (KEIN Fehler!):

```
⚠️ [SESSION RESTORE] Localhost detected - skipping API call, using localStorage data
💡 [SESSION RESTORE - LOCALHOST] Using localStorage data (API not available locally)
✅ Account loaded from cookies: cm@chooo.de

⚠️ [LOGIN] Localhost detected - skipping API call, using verification data only
💡 [LOGIN - LOCALHOST] Using verification data only (API not available locally)
✅ [LOGIN] Account data merged with full database data

📊 No backend data available, using static demo dataset...
✅ Static demo dataset loaded: 28 entries
🎨 Chart will show in GRAY (demo mode)
```

### Diese Logs sind NORMAL:

-   ✅ "Localhost detected" → Gut! API-Calls werden übersprungen
-   ✅ "Using localStorage data" → Fallback funktioniert
-   ✅ "Using demo dataset" → Charts zeigen Placeholder-Daten

## 🧪 Testen auf localhost:

### 1. Login testen:

```
1. Öffne: http://localhost:8080
2. Gehe zu: Account Page
3. Login mit Magic Link
4. → n8n wird aufgerufen (funktioniert!)
5. → localStorage wird aktualisiert (funktioniert!)
6. → Charts zeigen Demo-Daten (expected!)
```

### 2. Settings testen:

```
1. Login (siehe oben)
2. Settings Page öffnen
3. Name ändern → Speichern
4. → Wird in localStorage gespeichert ✅
5. → n8n wird aufgerufen (funktioniert!)
6. → Google Sheets wird aktualisiert ✅
```

### 3. Logout testen:

```
1. Logout klicken
2. → localStorage wird gelöscht ✅
3. → Session wird beendet ✅
4. → Redirect zu Home ✅
```

## 🚀 Deployment Checklist:

### Vor dem Deployment:

-   [ ] **Frontend**: Alle Änderungen committed
-   [ ] **Backend**: `keymoji-backend/` Code ist aktuell
-   [ ] **n8n**: Workflow ist aktiviert und korrekt
-   [ ] **Tests**: Login/Logout/Settings funktionieren lokal

### Backend Deployment:

```bash
cd keymoji-backend
vercel --prod
```

### Frontend Deployment:

```bash
# Push to GitHub → Vercel auto-deploys
git add .
git commit -m "fix: Backend webhook structure + localhost handling"
git push origin frontend
```

### Nach dem Deployment:

-   [ ] **Login testen** auf Production
-   [ ] **Settings speichern** testen
-   [ ] **Charts** zeigen echte Daten (nicht Demo!)
-   [ ] **Console Logs** überprüfen (keine 404 Fehler!)

## 📝 Wichtige Hinweise:

### 1. localhost vs Production:

-   **localhost**: n8n Webhooks funktionieren, Vercel Functions NICHT
-   **Production**: Alles funktioniert

### 2. Demo-Daten:

-   Charts zeigen Demo-Daten auf localhost (expected!)
-   Charts zeigen echte Daten auf Production (nach Login)

### 3. LocalStorage:

-   Alle User Preferences werden in localStorage gespeichert
-   Funktioniert auf localhost UND Production
-   Bei Logout wird localStorage gelöscht

### 4. Debugging:

-   Console Logs sind dein Freund!
-   "Localhost detected" ist KEIN Fehler
-   404 auf `/api/account` ist EXPECTED auf localhost

## 🎨 UI/UX Development Tips:

### Hot Reload funktioniert!

```bash
npm run dev
# → Änderungen in .svelte, .js, .css werden automatisch neu geladen
```

### Tailwind CSS:

```bash
# Tailwind classes werden automatisch generiert
# Keine build steps nötig!
```

### Svelte Components:

```bash
# HMR (Hot Module Replacement) funktioniert
# Component State bleibt erhalten während Development
```

---

**Erstellt**: 2025-10-10
**Thema**: Localhost Development ohne Vercel Functions
**Lösung**: Graceful Fallback zu localStorage + n8n Webhooks
