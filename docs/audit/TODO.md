# Keymoji TODO nach Audit November 2026

Stand: 23. November 2026, 07:46 UTC.

Reihenfolge: zuerst die manuellen Dashboard-Aufgaben, die den Betrieb absichern, dann die Code-Aufgaben von oben nach unten. Jede Code-Aufgabe bekommt einen eigenen Branch, wird einzeln gebaut, geprüft und mit einer englischen Conventional-Commit-Message committet. Push, Deploy und Änderungen auf dem Live-Server brauchen eine ausdrückliche Freigabe pro Schritt.

Legende: Aufwand S, M, L. `[x]` erledigt, `[ ]` offen. Verantwortlich: CM für manuelle Schritte, Claude für Code.

Regeln für Code-Aufgaben:

- Nur die eigenen Dateien stagen, nie `git add -A`.
- Die vorbestehenden uncommitteten Änderungen bleiben unberührt.
- Vor neuem Code die Codebase nach Bestehendem durchsuchen und wiederverwenden.
- Nach jeder Aufgabe: `npm run build`, `npx tsc --noEmit`, `git diff --stat`, kurzer Bericht, auf OK warten.
- Keine Secrets lesen, loggen oder committen. Live-Server nur lesend.

## 1. Manuelle Dashboard-Aufgaben (CM)

### NameSilo

- [x] **M01 Domain verlängern und Auto-Renew aktivieren**
  - RDAP am 23.11.2026: Ablauf `2027-11-22T23:55:45Z`, Status `client transfer prohibited`, `auto renew period`.
  - Akzeptanz erfüllt: Ablauf liegt nach 2027-11-22.
- [ ] **M02 Verlängerung bezahlt oder belastet bestätigen**
  - In NameSilo die Rechnung oder Belastung für 2026/2027 prüfen.
  - Akzeptanz: Beleg sichtbar, Auto-Renew aktiv.
- [x] **M03 DNSSEC-DS veröffentlichen**
  - `dig +short DS keymoji.wtf` liefert `2371 13 2 356424D5...D81865CD`.
  - Offen bleibt, ob ein validierender Resolver das `ad`-Flag setzt.
- [ ] **M04 CAA-Record setzen**
  - In Cloudflare DNS: `keymoji.wtf CAA 0 issue "letsencrypt.org"`.
  - Danach prüfen, ob Cloudflare eigene CAs ergänzt.
  - Akzeptanz: `dig +short CAA keymoji.wtf` zeigt den Record, Zertifikatsausstellung funktioniert weiter.
- [ ] **M05 Kontoadresse und 2FA**
  - Kontaktadresse bei NameSilo auf `christopher@keymoji.com` ändern, sobald der Zugang besteht.
  - 2FA und Domain Lock bleiben aktiv.
  - Akzeptanz: Kontaktadresse geändert, 2FA aktiv, Lock aktiv.
- [ ] **M06 Nameserver-Änderung dokumentieren**
  - Festhalten, wer am 23.11.2026 um 05:20:03Z auf Cloudflare umgestellt hat.
  - Akzeptanz: Eintrag im Runbook oder in den Projektnotizen.
- [ ] **M07 Entscheidung zu 🔑moji.ws**
  - Die Domain `xn--moji-pb73c.ws` ist laut WS Support seit 22.10.2026 gelöscht und frei registrierbar.
  - Entscheiden, ob neu registriert wird. Ohne Neuregistrierung bleibt `christopher@keymoji.com` der Kontaktweg.
  - Akzeptanz: Entscheidung dokumentiert.

### Cloudflare

- [ ] **M08 DNS-Records prüfen**
  - `@` und `www` proxied auf `85.13.165.159`, `its` DNS only auf Vercel, MX, SPF, DMARC und die beiden TXT-Verifikationen vorhanden.
  - Akzeptanz: Zone vollständig, `dig` und Live-Check stimmen überein.
- [ ] **M09 SSL/TLS-Modus**
  - Full (strict), Always Use HTTPS, Minimum TLS 1.2.
  - Akzeptanz: Dashboard-Werte gesetzt, Origin-Zertifikat bleibt gültig.
- [ ] **M10 HSTS**
  - `max-age=31536000; includeSubDomains`.
  - Preload nur nach ausdrücklicher Entscheidung.
  - Akzeptanz: `curl -sSI https://keymoji.wtf/en/` zeigt `strict-transport-security`.
- [ ] **M11 WAF-Regel**
  - Blockt `.map`, `.git*`, `.env*`, `.ftp-deploy-sync-state.json` und `logs` am Edge.
  - Ausdruck so fassen, dass normale Assets nicht blockiert werden.
  - Akzeptanz: `curl` liefert 403 für diese Pfade, Site und Assets weiter 200.
- [ ] **M12 Turnstile**
  - Site-Key und Secret erzeugen, Hostnames `keymoji.wtf` und `www.keymoji.wtf` eintragen.
  - Akzeptanz: Keys liegen bereit, Secret nur in Vercel.
- [ ] **M13 Cache-Regeln**
  - HTML nicht lange cachen, Assets mit Hash lange cachen.
  - Akzeptanz: `cf-cache-status` passt zur Dateiart.
- [ ] **M14 `www` auf Apex**
  - Redirect Rule von `www.keymoji.wtf` auf `keymoji.wtf`.
  - Akzeptanz: `https://www.keymoji.wtf/` landet auf `https://keymoji.wtf/`.

### KAS

- [ ] **M15 Webspace-Zuordnung**
  - `/www/htdocs/w01f8f03/keymoji` ist die Domainwurzel.
  - Akzeptanz: Pfad bestätigt.
- [ ] **M16 Origin-Zertifikat**
  - Let's Encrypt für `keymoji.wtf` und `www.keymoji.wtf`, Ablauf überwacht.
  - Akzeptanz: Zertifikat gültig, Ablauf dokumentiert.
- [ ] **M17 Direkt-IP-Test nach Deploy**
  - `curl --resolve keymoji.wtf:443:85.13.165.159` liefert die Site, gesperrte Pfade liefern 403.
  - Akzeptanz: Test protokolliert.

### Vercel

- [ ] **M18 `SESSION_SECRET`**
  - Mindestens 32 Byte, nicht im Repo. Ohne Secret antwortet der Login mit 503, also fail-closed.
  - Akzeptanz: Variable gesetzt, Login funktioniert.
- [ ] **M19 `TURNSTILE_SECRET_KEY`**
  - Nur serverseitig.
  - Akzeptanz: Variable gesetzt, Prüfung greift.
- [ ] **M20 `VITE_TURNSTILE_SITE_KEY`**
  - Als öffentliche Build-Variable im Frontend-Build.
  - Akzeptanz: Widget lädt im Build.
- [ ] **M21 `its.keymoji.wtf` und CORS**
  - Projekt-Domain zugeordnet, CORS exakt auf `https://keymoji.wtf` und `https://www.keymoji.wtf`.
  - Akzeptanz: Preflight erlaubt nur diese Origins.

### Betrieb

- [ ] **M22 Domain beobachten**
  - Nach der Grace Period RDAP erneut prüfen, dass der Status nicht `pending delete` ist.
  - Akzeptanz: Status `ok` oder `client transfer prohibited`, Ablauf 2027.

## 2. Code-Aufgaben (Claude)

### Erledigt

- [x] **T03 API-Keys nicht mehr synchronisieren** (Frontend `fca8914`, Backend `cc542c6`)
  - `stripSecretsForSync` in `src/utils/settingsValidation.ts:275`, Aufruf in `src/stores/userSettingsStore.js:1350`.
  - `stripSecretsFromMetadata` in `keymoji-backend/utils/metadataCleaner.js:107`.
  - Offen: alte Keys in bestehenden Sheet-Zeilen rotieren.
- [x] **T04 Blog-HTML sanitizen** (Frontend `9fb44b4`)
  - DOMPurify in `src/components/Features/BlogPost.svelte`, Ausgabe über `{@html sanitizedContent}`.
  - Offen: Testpost mit `<img src=x onerror=alert(1)>` verifizieren.
- [x] **T05 Session-Token auf den Vercel-Pfaden** (Frontend `7ac5283`, Backend `c389917`)
  - `src/utils/sessionToken.ts`, `keymoji-backend/utils/sessionToken.js`, 401/403 in `account.js` und `account/update.js`.
  - Offen: Tests, Neuen-Konto-Flow (T22), Token-Hygiene (T23).

### Critical

- [ ] **T22 Neuen-Konto-Flow absichern** (Branch `sec/session-auth` in beiden Repos)
  - `src/stores/accountStore.js:264` (`CHECK_EXISTS`) und `:629` (`SECURE_CREATE`) laufen nicht mehr direkt aus dem Browser zu n8n.
  - `:645` schreibt kein Tokenmaterial mehr nach `metadata.token`.
  - `:638` legt keine `userId` mehr an, die vom Token abweicht. Der Token wird erst nach dem Anlegen mit der finalen `userId` ausgestellt.
  - `:2159` `getAccount` funktioniert mit gültigem Token auch ohne mitgesendete E-Mail.
  - Akzeptanz: keine direkten n8n-Aufrufe für diese Schritte, kein Token in Sheets oder Logs, Kontoanlage und Login funktionieren end-to-end.
  - Aufwand: M.
- [ ] **T23 Auth-Tests und Token-Hygiene** (Branch `sec/session-auth`)
  - Tests für: kein Token 401, falsche `userId` 403, falsche E-Mail 403, abgelaufenes Token 401, manipuliertes Token 401, gültiges Token 200.
  - Zusätzlich prüfen, dass keine Tokens oder E-Mails geloggt werden.
  - Akzeptanz: Tests laufen lokal und in CI, alle Fälle grün.
  - Aufwand: M.
- [ ] **T06 `/api/story` absichern** (Backend, Branch `sec/story-proxy`)
  - CORS auf exakte Origins (`keymoji-backend/api/story.js:40-44`), das `localhost`-Wildcard entfällt.
  - Turnstile-Prüfung vor dem n8n-Aufruf, `model`, `max_tokens` und `temperature` in `:64` validieren.
  - Rate-Limit strenger, persistent oder pro Instanz plus Turnstile.
  - Akzeptanz: fremde Origin ohne gültiges Turnstile wird abgelehnt, eigener Client funktioniert, kein n8n-Aufruf vor erfolgreicher Prüfung.
  - Aufwand: M.
- [ ] **T07 OTP-Verify begrenzen** (Backend, Branch `sec/otp-limits`)
  - Zähler pro E-Mail und IP, Sperre nach mehreren Fehlversuchen, `TEST_MODE` in Produktion hart aus.
  - Akzeptanz: Fünf Fehlversuche sperren weitere Versuche für das Zeitfenster.
  - Aufwand: S.

### High

- [ ] **T08 Deploy über TLS** (Branch `chore/deploy-ftps`)
  - `protocol: ftps` und `port: 21` in `build.yml` und `deploy.yml`, FTPS vorher in KAS prüfen.
  - Fallback SFTP oder rsync dokumentieren.
  - Akzeptanz: Workflow-Log zeigt TLS, Deploy erfolgreich.
  - Aufwand: S.
- [ ] **T09 Öffentliche Dateien sperren** (Branch `sec/live-exposure`)
  - `.htaccess` sperrt `.ftp-deploy-sync-state.json`, `*.map`, `.git*`, `.env*` und `logs` mit 403.
  - Cloudflare-WAF-Regel M11 als zweite Schicht.
  - Alte Maps und Sync-State im Webroot erst nach Freigabe löschen.
  - Akzeptanz: diese Pfade liefern 403 am Edge und am Origin, Site und Assets weiter 200.
  - Aufwand: S.
- [ ] **T10 HSTS, CSP und Header** (Branch `sec/headers`)
  - HSTS in Cloudflare (M10), CSP zuerst `Report-Only` in der `.htaccess`, dann erzwingen.
  - `X-XSS-Protection` entfernen.
  - CSP braucht `challenges.cloudflare.com` für Turnstile.
  - Akzeptanz: Header-Scanner zeigt HSTS und CSP, keine CSP-Verstöße im Report, Turnstile funktioniert.
  - Aufwand: M.
- [ ] **T11 Sourcemaps aus Produktion** (Branch `sec/headers`)
  - `devtool: false` oder `hidden-source-map`, Maps aus Deploy ausschließen.
  - Akzeptanz: Keine `.map` mit 200 auf der Live-Domain.
  - Aufwand: S.
- [ ] **T12 VITE-Token und Env-Doku bereinigen** (Branch `docs/env-cleanup`)
  - `VITE_N8N_APERTUS_TOKEN` aus `webpack/build.js`, `.env.example`, `README.md` und `docs/ENVIRONMENT_VARIABLES.md` entfernen.
  - Feste Vercel-Preview-URL in `storyModeAI.ts:549` durch `VITE_API_URL` ersetzen.
  - Akzeptanz: Kein Token im Bundle, Doku beschreibt nur den Server-Proxy.
  - Aufwand: S.
- [ ] **T13 `.gitmodules` anlegen** (Branch `chore/submodule`)
  - URL und Pfad für `keymoji-backend`, aktuellen Commit prüfen.
  - Akzeptanz: `git submodule status` funktioniert in frischem Klon.
  - Aufwand: S.

### Medium und Low

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
- [ ] **T18 Kontaktformular begrenzen** (Backend und Frontend, Branch `sec/contact-rate-limit`)
  - Rate-Limit pro IP, Turnstile in `src/routes/ContactForm.svelte:170` und `keymoji-backend/api/contact.js:119`.
  - Fehlermeldung ohne interne Details. Der vorhandene Honeypot bleibt.
  - Akzeptanz: Mehr als fünf Anfragen pro Minute liefern 429, fehlendes Turnstile 403.
  - Aufwand: S.
- [ ] **T19 `www` auf Apex und `.nvmrc`** (Branch `chore/site-config`)
  - `www` per 301 auf Apex (M14, Code nur als Fallback), Node-Version im Repo pinnen.
  - Akzeptanz: `https://www.keymoji.wtf/` landet auf `https://keymoji.wtf/`, CI und lokal nutzen dieselbe Node-Version.
  - Aufwand: S.

### Setup und Abschluss

- [ ] **T20 Tooling** (Branch `chore/claude-setup`)
  - Ponytail ist installiert. Graphify-Projektinstallation, Graph bauen, `graphify-out/` in `.gitignore`.
  - `CLAUDE.md`, `.claude/settings.json`, `.claude/hooks/guard-bash.mjs` und `.claude/commands/security-review.md` prüfen.
  - Akzeptanz: `/graphify .` erzeugt einen Graphen, Settings blockieren `.env`-Reads und gefährliche SSH-Befehle.
  - Aufwand: S.
- [ ] **T21 Abschluss-Review** (Branch `docs/audit-final`)
  - `/security-review` erneut ausführen, Ergebnis in `AUDIT-2026-11.md` nachtragen, TODO aktualisieren.
  - Akzeptanz: Review-Lauf dokumentiert, offene Punkte begründet.
  - Aufwand: S.

## Freigaben, die vorher einzuholen sind

- Push eines Branches oder PR.
- Jeder Deploy und jede GitHub-Action-Ausführung.
- Jede schreibende Aktion auf dem Live-Server, insbesondere `rm` für alte Maps und Sync-State.
- Jede Änderung an DNS, Registrar, Cloudflare-Zone oder Mail.
- Rotation von FTP-Zugangsdaten und n8n-Tokens.

## Bekannte Abhängigkeiten

- T22 und T23 hängen an T05. Erst den Neuen-Konto-Flow reparieren und testen, dann deployen.
- T06 und T07 teilen sich die Turnstile-Infrastruktur mit T18. `keymoji-backend/utils/turnstile.js` einmal bauen und dreimal nutzen.
- T09 und T11 hängen an T08, weil beide den Deploy-Weg betreffen.
- T10 braucht M10 und M12, weil HSTS am Edge liegt und die CSP Turnstile erlauben muss.
- M14 kann T19 ersetzen. Dann bleibt in T19 nur `.nvmrc`.
