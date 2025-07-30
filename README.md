# Keymoji - Emoji Generator

Ein KI-gestützter Emoji-Generator mit sicherer Account-Verwaltung.

## Projektstruktur

Dieses Repository enthält nur das **Frontend** der Keymoji-Anwendung. Das Backend ist in einem separaten Repository organisiert.

### Frontend (dieses Repository)

-   **Technologie**: Svelte/SvelteKit
-   **Styling**: Tailwind CSS
-   **Deployment**: Statisches Hosting (z.B. Netlify, Vercel)

### Backend (separates Repository)

-   **Technologie**: Node.js mit Vercel Serverless Functions
-   **Services**:
    -   Magic Link Authentication
    -   Email Templates (Brevo)
    -   Account Management
    -   Contact Form Processing
-   **Deployment**: Vercel

## Entwicklung

### Frontend starten

```bash
npm install
npm run dev
```

### Backend (separates Repository)

Das Backend-Repository muss separat geklont und konfiguriert werden.

## Umgebung

Stelle sicher, dass die Backend-API-URL in der Frontend-Konfiguration korrekt gesetzt ist.

## Lizenz

MIT
