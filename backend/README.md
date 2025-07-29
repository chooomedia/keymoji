# Keymoji Backend - Vercel Deployment

## 🚀 Neue API-Endpoints

### Account Management

-   **`/api/account`** - CRUD für Benutzerkonten
    -   `POST` mit `action: 'create'` - Account erstellen
    -   `POST` mit `action: 'get'` - Account abrufen
    -   `POST` mit `action: 'update'` - Account aktualisieren

### Magic Link System

-   **`/api/magic-link/send`** - Magic Link senden
-   **`/api/magic-link/verify`** - Magic Link verifizieren

### Bestehende Endpoints

-   **`/api/contact`** - Kontaktformular (Brevo Email)
-   **`/api/random`** - Emoji-Generator

## 🔧 Environment Variables

Fügen Sie diese Environment Variables in Vercel hinzu:

```bash
# Brevo Email Service
BREVO_API_KEY=your_brevo_api_key

# n8n Webhook für Account Management
N8N_ACCOUNT_WEBHOOK_URL=https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account

# Vercel URL (wird automatisch gesetzt)
VERCEL_URL=https://your-vercel-app.vercel.app
```

## 📧 Email Templates

### Email Template System

-   **`email-templates.js`** - Wiederverwendbare Templates
-   **Dark/Light Mode Support** - Automatische Anpassung
-   **Responsive Design** - Mobile-optimiert
-   **Keymoji Branding** - Konsistentes Design

### Available Templates

#### Welcome Email

-   **Subject:** `🎉 Welcome to Keymoji!`
-   **Trigger:** Nach erfolgreicher Account-Erstellung
-   **Features:** Account-Details, Call-to-Action Button
-   **Template:** `createWelcomeEmail({ name, email, userId, tier })`

#### Magic Link Email

-   **Subject:** `🔗 Your Keymoji Magic Link`
-   **Trigger:** Bei Magic Link Request
-   **Features:** Login-Button, Expiry-Info
-   **Template:** `createMagicLinkEmail({ name, magicLinkUrl, expiresIn })`

#### Account Update Email

-   **Subject:** `📝 Your Keymoji Account Has Been Updated`
-   **Trigger:** Bei Account-Änderungen
-   **Features:** Update-Details, Security-Info
-   **Template:** `createAccountUpdateEmail({ name, updateType, details })`

#### Password Reset Email

-   **Subject:** `🔐 Reset Your Keymoji Password`
-   **Trigger:** Bei Password-Reset-Request
-   **Features:** Reset-Button, Security-Info
-   **Template:** `createPasswordResetEmail({ name, resetUrl, expiresIn })`

### Email Testing

#### Test API (Development Only)

```bash
# Alle Templates anzeigen
GET /api/test-emails?template=all

# Spezifisches Template testen
GET /api/test-emails?template=welcome

# Mit benutzerdefinierten Daten
POST /api/test-emails
{
  "template": "welcome",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "userId": "user_123"
  }
}
```

#### Verfügbare Templates:

-   `welcome` - Welcome Email
-   `magic-link` - Magic Link Email
-   `account-update` - Account Update Email
-   `password-reset` - Password Reset Email
-   `all` - Alle Templates

## 🔐 Sicherheit

### Input Validation

-   ✅ **Email Validation** - Mit validator.js
-   ✅ **Input Sanitization** - XSS Protection
-   ✅ **CORS Headers** - Cross-Origin Security
-   ✅ **Rate Limiting** - Anti-Spam Protection

### API Security

-   ✅ **CORS Configuration** - Nur keymoji.wtf
-   ✅ **Method Validation** - Nur POST/OPTIONS
-   ✅ **Error Handling** - Keine sensiblen Daten in Logs

## 🚀 Deployment

1. **Vercel CLI:**

```bash
vercel --prod
```

2. **GitHub Integration:**

-   Automatisches Deployment bei Push
-   Environment Variables in Vercel Dashboard setzen

3. **Testing:**

```bash
# Test Account Creation
curl -X POST https://your-vercel-app.vercel.app/api/account \
  -H "Content-Type: application/json" \
  -d '{"action":"create","userId":"test123","email":"test@example.com"}'
```

## 📊 Integration

### n8n Workflow

-   **Webhook URL:** `https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account`
-   **Actions:** `create`, `get`, `update`
-   **Storage:** Google Sheets

### Frontend Integration

-   **Account Store:** `src/stores/accountStore.js`
-   **API Config:** `src/config/api.js`
-   **Endpoints:** `WEBHOOKS.ACCOUNT`

## 🔄 Workflow

1. **Account Creation:**

    - Frontend → Vercel API → n8n → Google Sheets
    - Vercel API → Brevo → Welcome Email

2. **Account Retrieval:**

    - Frontend → Vercel API → n8n → Google Sheets

3. **Magic Link:**
    - Frontend → Vercel API → Brevo → Magic Link Email
    - User → Vercel API → Account Update

## 🎯 Nächste Schritte

-   [ ] **Vercel Deployment** - Environment Variables setzen
-   [ ] **n8n Integration** - Webhook URL konfigurieren
-   [ ] **Email Testing** - Brevo Templates testen
-   [ ] **Frontend Testing** - Account Creation testen
