# Keymoji Backend API

Backend-Services für die Keymoji Emoji-Generator Anwendung.

## Überblick

Dieses Repository enthält die Backend-Services für Keymoji, die als Vercel Serverless Functions deployed werden.

## Services

-   **Magic Link Authentication**: Sichere Anmeldung ohne Passwörter
-   **Email Templates**: Brevo Integration für E-Mail-Versand
-   **Account Management**: Benutzerkonten und Limits
-   **Contact Form Processing**: Kontaktformular-Verarbeitung

## Technologie

-   **Runtime**: Node.js 18+
-   **Deployment**: Vercel Serverless Functions
-   **Email Service**: Brevo (ehemals Sendinblue)
-   **Database**: Vercel KV (Redis)

## Entwicklung

### Lokale Entwicklung

```bash
npm install
npm run dev
```

### Tests

```bash
npm test
```

### Deployment

```bash
npm run deploy
```

## Umgebung

Kopiere `env.example` zu `.env` und konfiguriere die Umgebungsvariablen:

```bash
cp env.example .env
```

### Erforderliche Umgebungsvariablen

-   `BREVO_API_KEY`: API-Schlüssel für Brevo
-   `VERCEL_URL`: Vercel-Deployment-URL
-   `JWT_SECRET`: Geheimer Schlüssel für JWT-Tokens

## API-Endpunkte

-   `POST /api/contact` - Kontaktformular
-   `POST /api/magic-link/send` - Magic Link senden
-   `POST /api/magic-link/verify` - Magic Link verifizieren
-   `POST /api/account` - Account-Management
-   `GET /api/random` - Zufällige Emoji-Generierung

## Frontend-Integration

Das Frontend-Repository ist separat und muss die korrekte Backend-URL in der Konfiguration verwenden.

## Lizenz

MIT
