# Keymoji

Emoji-Passwort-Generator mit AI Story Mode, OTP-Login und Account-Verwaltung über n8n und Google Sheets. Svelte 3, Webpack 5, TypeScript. Frontend auf All-Inkl (KAS), Backend auf Vercel, Domain keymoji.wtf bei NameSilo.

## Struktur

- Frontend: `src/`, Svelte 3, Webpack in `webpack/`, Tailwind 2
- Extension: `src/extension/`, Manifest V3
- Backend: `keymoji-backend/`, eigenes Repository, im Frontend-Repo als Gitlink ohne `.gitmodules`
- Build: `build/`, Deploy per FTP aus GitHub Actions
- Audit: `docs/audit/AUDIT-2026-11.md`, offene Aufgaben in `docs/audit/TODO.md`

## Befehle

| Zweck | Befehl |
|---|---|
| Dev-Server | `npm run dev` |
| Produktions-Build | `npm run build` |
| Extension paketieren | `npm run package:extension` |
| Typecheck | `npx tsc --noEmit` |
| Dependency-Audit | `npm audit` |
| Live-Check lesend | `ssh kmoji 'ls -la /www/htdocs/w01f8f03/keymoji'` |

## Regeln

- Keine Secrets lesen, loggen oder committen. `.env*` nur auf Variablennamen prüfen. Werte immer als `<redacted>` darstellen.
- Live-Server ausschließlich lesend. Kein `rm`, `mv`, `chmod`, Schreiben oder Neustarten ohne ausdrückliche Freigabe pro Schritt.
- Kein Push und kein Deploy ohne ausdrückliche Freigabe pro Schritt.
- Vor neuem Code die Codebase prüfen und Bestehendes wiederverwenden.
- Commit-Messages Englisch, Conventional Commits. Texte für Menschen Deutsch mit echten Umlauten.
- Nutzer-API-Keys bleiben lokal im Browser und werden nicht an das Backend gesendet.
- Neue Dateien in TypeScript. Bestehende Svelte-3-Muster beibehalten, Svelte 5 nur als eigenes Migrationsprojekt.
- Validierung, Fehlerbehandlung, Security und Accessibility nie kürzen.
- Keine erfundenen Fakten oder Zahlen. Bei unsicheren Aussagen `unbestätigt` vermerken.

## Imports

@.cursor/rules/core.mdc
@.cursor/rules/security.mdc
@.cursor/rules/api-backend.mdc
@.cursor/rules/svelte-typescript.mdc
@.cursor/rules/git-workflow.mdc
@.agents/product-marketing-context.md
