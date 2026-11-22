# Keymoji TODO nach Audit November 2026

Reihenfolge von oben nach unten. Jede Aufgabe wird einzeln umgesetzt, gebaut, geprüft und mit einer englischen Conventional-Commit-Message committet. Push, Deploy und Änderungen auf dem Live-Server brauchen eine ausdrückliche Freigabe pro Schritt.

Legende: Aufwand S, M, L. Verantwortlich: CM für manuelle Schritte, Claude für Code.

## 0. Sofort, heute (manuell, CM)

- [ ] **T01 Domain verlängern und Nameserver zurückstellen**
  - NameSilo: `keymoji.wtf` verlängern, Auto-Renew aktivieren, Nameserver auf `ns5.kasserver.com`, `ns6.kasserver.com`, `ns7.kasserver.com`.
  - KAS: Webspace-Zuordnung, DNS-Zone, `its`-CNAME, MX, SPF, CAA und SSL prüfen.
  - Anleitung: `docs/audit/DNS-RUNBOOK.md`.
  - Akzeptanz: `dig +short keymoji.wtf NS` zeigt All-Inkl-Nameserver, `dig +short keymoji.wtf A` zeigt `85.13.165.159`, `https://keymoji.wtf/` liefert 301 auf `/en/`, `its.keymoji.wtf` antwortet über HTTPS.
  - Aufwand: S.

- [ ] **T02 Domain-Ablauf beobachten**
  - Nach der Verlängerung RDAP erneut prüfen.
  - Akzeptanz: Ablaufdatum liegt nach 2027-11-22, Status nicht `pending delete`.
  - Aufwand: S.

## 1. Critical (Code)

- [ ] **T03 API-Keys nicht mehr synchronisieren** (Frontend, Branch `sec/api-keys-local`)
  - `saveSettingsToAPI` entfernt `storyMode.apiKeys` vor dem Senden. Zentrale Funktion `stripSecretsForSync` in `src/utils/settingsValidation.ts`, Wiederverwendung in allen Sync-Pfaden.
  - `metadataCleaner.js` im Backend entfernt `settings.apiKeys` zusätzlich als zweite Verteidigungslinie.
  - Akzeptanz: Request-Payload enthält keine Keys, Keys funktionieren lokal weiter, Build und Typecheck grün.
  - Aufwand: S.

- [ ] **T04 Blog-HTML sanitizen** (Frontend, Branch `sec/blog-html`)
  - DOMPurify oder Allowlist vor `{@html post.content}` in `src/components/Features/BlogPost.svelte:343`.
  - Interne `{@html}`-Sinks für Icons prüfen und wo möglich durch Komponenten ersetzen.
  - Akzeptanz: Testpost mit `<img src=x onerror=alert(1)>` führt kein Skript aus.
  - Aufwand: S.

- [ ] **T05 Session-Token einführen und prüfen** (Backend, Branch `sec/session-auth`)
  - HMAC-signiertes Token mit Ablauf, alternativ serverseitige Speicherung. `verify.js` bindet Token an `userId` und `email`.
  - `account.js` und `account/update.js` verlangen ein gültiges Token. Fremde `userId` liefert 403.
  - Kein vollständiges `accountData` mehr loggen (`update.js:171,182`), keine komplette n8n-Antwort (`account.js:492`).
  - Akzeptanz: Ohne Token 401, mit Token 200, fremde ID 403.
  - Aufwand: M.

- [ ] **T06 `/api/story` absichern** (Backend, Branch `sec/story-proxy`)
  - Exakte Origins, Shared Secret oder Session, Validierung von `model`, `max_tokens` und `temperature`, strengeres Limit.
  - Akzeptanz: Fremde Origin ohne Secret wird abgelehnt, eigener Client funktioniert.
  - Aufwand: M.

- [ ] **T07 OTP-Verify begrenzen** (Backend, Branch `sec/otp-limits`)
  - Zähler pro E-Mail und IP, Sperre nach mehreren Fehlversuchen, `TEST_MODE` in Produktion hart aus.
  - Akzeptanz: Fünf Fehlversuche sperren weitere Versuche für das Zeitfenster.
  - Aufwand: S.

## 2. High

- [ ] **T08 Deploy über TLS** (Branch `chore/deploy-ftps`)
  - `protocol: ftps` und `port: 21` in `build.yml` und `deploy.yml`, FTPS vorher in KAS prüfen.
  - Fallback SFTP oder rsync dokumentieren.
  - Akzeptanz: Workflow-Log zeigt TLS, Deploy erfolgreich.
  - Aufwand: S.

- [ ] **T09 Öffentliche Dateien sperren** (Branch `sec/live-exposure`)
  - `.htaccess` in `build.yml`: `.ftp-deploy-sync-state.json`, `*.map`, `.git*`, `.env*`, `logs` mit 403.
  - Alte Maps und Sync-State im Webroot erst nach Freigabe löschen.
  - Akzeptanz: Diese Pfade liefern 403, Site und Assets weiter 200.
  - Aufwand: S.

- [ ] **T10 HSTS, CSP und Header** (Branch `sec/headers`)
  - HSTS mit `max-age`, CSP zuerst `Report-Only`, `X-XSS-Protection` entfernen.
  - Akzeptanz: Header-Scanner zeigt HSTS und CSP, Seite funktioniert ohne CSP-Verstöße im Report.
  - Aufwand: M.

- [ ] **T11 Sourcemaps aus Produktion** (Branch `sec/headers`)
  - `devtool: false` oder `hidden-source-map`, Maps aus Deploy ausschließen.
  - Akzeptanz: Keine `.map` mit 200 auf der Live-Domain.
  - Aufwand: S.

- [ ] **T12 VITE-Token aus Frontend und Doku entfernen** (Branch `docs/env-cleanup`)
  - `webpack/build.js:242` entfernen, `.env.example`, `README.md`, `docs/ENVIRONMENT_VARIABLES.md` korrigieren.
  - Feste Vercel-Preview-URL in `storyModeAI.ts:549` durch `VITE_API_URL` ersetzen.
  - Akzeptanz: Kein Token mehr im Bundle, Doku beschreibt nur den Server-Proxy.
  - Aufwand: S.

- [ ] **T13 `.gitmodules` anlegen** (Branch `chore/submodule`)
  - URL und Pfad für `keymoji-backend`, Commit `46b758f` prüfen.
  - Akzeptanz: `git submodule status` funktioniert in frischem Klon.
  - Aufwand: S.

## 3. Medium und Low

- [ ] **T14 CI blockierend machen** (Branch `ci/quality-gates`)
  - `main` in `tests.yml` aufnehmen, `continue-on-error` entfernen, Lint-Script ergänzen, `npm audit --omit=dev` als Gate, `gitleaks` einbinden.
  - Akzeptanz: Fehlerhafter PR wird rot.
  - Aufwand: M.

- [ ] **T15 Dependencies aktualisieren** (Branch `chore/deps`)
  - `npm audit fix` für Dev-Abhängigkeiten, Svelte 5 separat als `chore/svelte5`.
  - Akzeptanz: Produktions-Audit ohne High und Critical, Build und Tests grün.
  - Aufwand: M bis L.

- [ ] **T16 Extension-Rechte einschränken** (Branch `sec/extension-permissions`)
  - `matches` auf konkrete Login-Domains oder `activeTab` mit Nutzer-Geste, `web_accessible_resources` einschränken.
  - Akzeptanz: Extension funktioniert auf den Zielseiten, Store-Review-Kommentar dokumentiert.
  - Aufwand: M.

- [ ] **T17 Logs reduzieren** (Branch `chore/log-hygiene`)
  - Env-URLs nur in Development (`src/config/api.js`), Prompt- und Antworttexte entfernen (`storyModeAI.ts`).
  - Akzeptanz: Produktionskonsole enthält keine Endpunkte oder Inhalte.
  - Aufwand: S.

- [ ] **T18 Kontaktformular begrenzen** (Backend, Branch `sec/contact-rate-limit`)
  - Rate-Limit pro IP ergänzen, Fehlermeldung ohne interne Details.
  - Akzeptanz: Mehr als fünf Anfragen pro Minute liefern 429.
  - Aufwand: S.

- [ ] **T19 `www` auf Apex umleiten und `.nvmrc`** (Branch `chore/site-config`)
  - `www` per 301 auf Apex, Node-Version im Repo pinnen.
  - Akzeptanz: `https://www.keymoji.wtf/` landet auf `https://keymoji.wtf/`, CI und lokal nutzen dieselbe Node-Version.
  - Aufwand: S.

## 4. Setup und Abschluss

- [ ] **T20 Ponytail und Graphify einrichten** (Branch `chore/claude-setup`)
  - Ponytail durch CM installieren, Graphify-Projektinstallation, `graphify-out/` in `.gitignore`.
  - `CLAUDE.md`, `.claude/settings.json`, `.claude/hooks/guard-bash.mjs` und `.claude/commands/security-review.md` anlegen.
  - Akzeptanz: `/graphify .` erzeugt einen Graphen, Settings blockieren `.env`-Reads und gefährliche SSH-Befehle.
  - Aufwand: S.

- [ ] **T21 Security Review und Abschluss** (Branch `docs/audit-final`)
  - `/security-review` erneut ausführen, Ergebnis in `AUDIT-2026-11.md` nachtragen, offene Punkte aktualisieren.
  - Akzeptanz: Review-Lauf dokumentiert, TODO vollständig abgehakt oder begründet offen.
  - Aufwand: S.

## Freigaben, die vorher einzuholen sind

- Push eines Branches oder PR.
- Jeder Deploy und jede GitHub-Action-Ausführung.
- Jede schreibende Aktion auf dem Live-Server, insbesondere `rm` für alte Maps und Sync-State.
- Rotation von FTP-Zugangsdaten und n8n-Tokens.

## Bekannte Abhängigkeiten

- T03, T04 und T05 greifen ineinander: Solange Keys im Frontend gespeichert sind, bleibt XSS gefährlich. Trotzdem zuerst T03 und T04 umsetzen, weil sie klein und unabhängig sind.
- T05 und T06 teilen sich die Token-Infrastruktur im Backend. T05 zuerst, T06 baut darauf auf.
- T09 und T11 hängen an T08, weil beide den Deploy-Weg betreffen.
