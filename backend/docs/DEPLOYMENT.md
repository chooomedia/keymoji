# Keymoji Backend Deployment Guide

## 🚀 Schnellstart

### 1. Environment Variables setzen

Kopieren Sie `env.example` zu `.env` und füllen Sie die Werte aus:

```bash
cp env.example .env
```

**Erforderliche Environment Variables:**

```bash
# Brevo Email Service
BREVO_API_KEY=your_brevo_api_key_here

# n8n Webhook für Account Management
N8N_ACCOUNT_WEBHOOK_URL=https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account
```

### 2. Lokales Testing

```bash
# Dependencies installieren
npm install

# Lokalen Server starten
npm run dev

# APIs testen
npm test
```

### 3. Vercel Deployment

```bash
# Automatisches Deployment
npm run deploy

# Oder manuell
vercel --prod
```

## 📋 Environment Variables

### Erforderlich für Production

| Variable                  | Beschreibung             | Beispiel                                                    |
| ------------------------- | ------------------------ | ----------------------------------------------------------- |
| `BREVO_API_KEY`           | Brevo API Key für Emails | `xkeysib-...`                                               |
| `N8N_ACCOUNT_WEBHOOK_URL` | n8n Webhook für Accounts | `https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account` |

### Optional

| Variable      | Beschreibung | Standard              |
| ------------- | ------------ | --------------------- |
| `VERCEL_URL`  | Vercel URL   | Automatisch gesetzt   |
| `APP_VERSION` | App Version  | `0.4.3`               |
| `NODE_ENV`    | Environment  | `development`         |
| `CORS_ORIGIN` | CORS Origin  | `https://keymoji.wtf` |

## 🧪 Testing

### Email Templates testen

```bash
# Alle Templates anzeigen
curl "http://localhost:3000/api/test-emails?template=all"

# Spezifisches Template
curl "http://localhost:3000/api/test-emails?template=welcome"
```

### Account API testen

```bash
# Account erstellen
curl -X POST http://localhost:3000/api/account \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "userId": "test123",
    "email": "test@example.com",
    "profile": {"name": "Test User"}
  }'

# Account abrufen
curl -X POST http://localhost:3000/api/account \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get",
    "userId": "test123"
  }'
```

### Magic Link API testen

```bash
# Magic Link senden
curl -X POST http://localhost:3000/api/magic-link/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "userId": "test123",
    "language": "en"
  }'
```

## 🔧 Vercel Dashboard Setup

### 1. Projekt erstellen

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Erstellen Sie ein neues Projekt
3. Verbinden Sie es mit diesem Repository

### 2. Environment Variables setzen

Im Vercel Dashboard:

1. **Settings** → **Environment Variables**
2. Fügen Sie alle erforderlichen Variables hinzu
3. **Production** und **Preview** aktivieren

### 3. Domain konfigurieren

1. **Settings** → **Domains**
2. Fügen Sie Ihre Domain hinzu (z.B. `api.keymoji.wtf`)

## 📊 API Endpoints

### Account Management

-   **POST** `/api/account` - Account CRUD
    -   `action: "create"` - Account erstellen
    -   `action: "get"` - Account abrufen
    -   `action: "update"` - Account aktualisieren

### Magic Link System

-   **POST** `/api/magic-link/send` - Magic Link senden
-   **POST** `/api/magic-link/verify` - Magic Link verifizieren

### Email System

-   **POST** `/api/contact` - Kontaktformular
-   **GET** `/api/test-emails` - Email Templates testen (Development)

### Emoji Generator

-   **GET** `/api/random` - Emoji generieren

## 🔐 Sicherheit

### CORS Configuration

```json
{
    "Access-Control-Allow-Origin": "https://keymoji.wtf",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With"
}
```

### Rate Limiting

-   **Account Creation:** 10 pro Stunde
-   **Magic Link:** 5 pro Stunde
-   **Contact Form:** 3 pro Stunde

### Input Validation

-   **Email Validation** - Mit validator.js
-   **Input Sanitization** - XSS Protection
-   **Action Validation** - Nur erlaubte Aktionen

## 🚨 Troubleshooting

### Häufige Probleme

1. **CORS Errors**

    - Prüfen Sie die CORS-Origin in vercel.json
    - Stellen Sie sicher, dass die Frontend-Domain korrekt ist

2. **Brevo API Errors**

    - Prüfen Sie den BREVO_API_KEY
    - Stellen Sie sicher, dass die Email-Templates korrekt sind

3. **n8n Webhook Errors**

    - Prüfen Sie die N8N_ACCOUNT_WEBHOOK_URL
    - Stellen Sie sicher, dass das n8n Workflow aktiv ist

4. **Environment Variables**
    - Alle erforderlichen Variables müssen gesetzt sein
    - Prüfen Sie das Vercel Dashboard

### Debugging

```bash
# Logs anzeigen
vercel logs

# Lokale Entwicklung
npm run dev

# API Tests
npm test
```

## 📞 Support

Bei Problemen:

1. **Logs prüfen** - `vercel logs`
2. **Environment Variables** - Vercel Dashboard
3. **API Tests** - `npm test`
4. **Email Templates** - `/api/test-emails`

## 🎯 Nächste Schritte

Nach erfolgreichem Deployment:

1. **Frontend API Config** - `src/config/api.js` aktualisieren
2. **n8n Integration** - Webhook URL testen
3. **Email Testing** - Welcome Emails testen
4. **Account Creation** - Frontend Integration testen
