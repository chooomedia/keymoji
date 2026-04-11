# Email System Setup für Keymoji

## 🔧 Problem

Das Email-System funktioniert nicht, weil die **Brevo API Key** nicht in der Vercel-Umgebung konfiguriert ist.

## 📧 Email-Funktionen die konfiguriert werden müssen:

### 1. Contact Form Emails

-   ✅ **Admin Notification** - Benachrichtigung an Admin über neue Kontaktanfragen
-   ✅ **User Confirmation** - Bestätigungsemail an Benutzer

### 2. Account Creation Emails

-   ✅ **Welcome Email** - Willkommensemail bei Account-Erstellung
-   ✅ **Account Confirmation** - Bestätigung der Account-Erstellung

### 3. Magic Link Emails

-   ✅ **Magic Link Email** - Login-Link per Email
-   ✅ **Verification Email** - Bestätigung der Magic Link Nutzung

### 4. Newsletter Integration

-   ✅ **Newsletter Opt-In** - Automatische Anmeldung zum Newsletter
-   ✅ **Newsletter Management** - Verwaltung der Newsletter-Liste

## 🚀 Setup-Schritte:

### 1. Brevo Account Setup

1. Gehen Sie zu [Brevo.com](https://brevo.com)
2. Erstellen Sie ein kostenloses Konto
3. Gehen Sie zu **Settings > API Keys**
4. Erstellen Sie einen neuen API Key

### 2. Vercel Environment Variables

Fügen Sie diese Variablen in Ihrer Vercel-Umgebung hinzu:

```bash
# Brevo Email Service
BREVO_API_KEY=xkeysib-your-api-key-here

# Optional: Newsletter List ID
BREVO_LIST_ID=2

# Optional: Admin Email
ADMIN_EMAIL=hi@keymoji.wtf

# Optional: Sender Email
SENDER_EMAIL=no-reply@keymoji.wtf
```

### 3. Vercel Dashboard Setup

1. Gehen Sie zu [Vercel Dashboard](https://vercel.com/dashboard)
2. Wählen Sie das Keymoji-Projekt
3. Gehen Sie zu **Settings > Environment Variables**
4. Fügen Sie die oben genannten Variablen hinzu
5. Deployen Sie das Projekt neu

### 4. Test der Email-Funktionen

```bash
# Test Contact Email
curl -X POST "https://its.keymoji.wtf/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "newsletterOptIn": false,
    "honeypot": "",
    "emailContent": {
      "greeting": "Hello",
      "intro": "Thank you for contacting us.",
      "doubleCheck": "We have received your message.",
      "button": "Confirm Your Email",
      "subject": "Your message to Keymoji",
      "footer": "Developed with love"
    },
    "langCode": "en",
    "appVersion": "0.4.0"
  }'

# Test Account Creation Email
curl -X POST "https://its.keymoji.wtf/api/account" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "userId": "test_user_123",
    "email": "test@example.com",
    "profile": {
      "name": "Test User"
    },
    "metadata": {
      "test": true,
      "timestamp": "2025-07-29T07:00:00.000Z"
    }
  }'

# Test Magic Link Email
curl -X POST "https://its.keymoji.wtf/api/magic-link/send" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "userId": "test_user_123",
    "language": "en"
  }'
```

## 🔍 Troubleshooting

### Problem: "Email service not configured"

**Lösung:** `BREVO_API_KEY` ist nicht in Vercel gesetzt

### Problem: "Brevo API error"

**Lösung:**

1. Überprüfen Sie den API Key
2. Stellen Sie sicher, dass das Brevo-Konto aktiv ist
3. Überprüfen Sie die API-Limits

### Problem: "Newsletter error"

**Lösung:**

1. Erstellen Sie eine Newsletter-Liste in Brevo
2. Setzen Sie die `BREVO_LIST_ID` in Vercel

## 📊 Email-Templates

Alle Email-Templates sind in `backend/api/email-templates.js` definiert:

-   ✅ **Welcome Email** - Für neue Accounts
-   ✅ **Magic Link Email** - Für Login-Links
-   ✅ **Contact Email** - Für Kontaktformular
-   ✅ **Account Update Email** - Für Account-Änderungen

## 🎯 Status

**Aktueller Status:** Email-System bereit, aber Brevo API Key fehlt
**Nächster Schritt:** Brevo API Key in Vercel konfigurieren
