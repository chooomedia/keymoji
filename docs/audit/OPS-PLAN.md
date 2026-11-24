# Ops-Plan Keymoji

Stand: 23. November 2026, 09:30 UTC. Angelegt nach Freigabe des Plans. Gehört zu `AUDIT-2026-11.md`, `TODO.md` und `DNS-RUNBOOK.md`.

Ziel: Sourcemaps und Deploy-Artefakte aus dem Webroot nehmen, den Deploy verschlüsseln und auf einen dedizierten Zugang umstellen, Vercel-Secrets vorbereiten, Cloudflare-DNS und Edge-Regeln setzen. Jeder schreibende Schritt wird einzeln angekündigt und erst nach ausdrücklicher Freigabe ausgeführt.

Regeln: Lesende Befehle frei. Keine Secrets ausgeben, loggen oder committen. Werte immer `<redacted>`. Kein `rm`, kein `chmod`, kein `chown`, kein `sed -i` auf dem Server. Verschieben statt löschen. Kein Push, kein Deploy, kein `git add -A`. Eigener Branch pro Aufgabe, nur eigene Dateien stagen. Die vorbestehenden uncommitteten Dateien bleiben unberührt.

## Architektur, wie sie gewachsen ist

| Teil | Befund | Beleg |
|---|---|---|
| Frontend | Svelte 3, Webpack 5, Build nach `build/`, 15 Sprachen, 60 URLs | `npm run build`, 13,90 MB am 23.11.2026 |
| CI Frontend | `build.yml` läuft bei Push und PR auf `staging`, `frontend`, `master`, `main` und baut selbst | `.github/workflows/build.yml:3-6` |
| Deploy Frontend | Deploy-Jobs liegen in `build.yml`, `deploy.yml` ist nur `workflow_dispatch` für Notfälle | `build.yml:140-314`, `deploy.yml:1-30` |
| Deploy-Transport | `SamKirkland/FTP-Deploy-Action@v4.3.4` ohne `protocol` und ohne `port`, also Klartext-FTP | `build.yml:253-258`, `deploy.yml:171-176` |
| `.htaccess` | wird in `build.yml:149-240` und `deploy.yml:60-158` erzeugt, dritte, abweichende Kopie in `scripts/create-and-deploy-files.sh:39-151` | drei Vorlagen, bereits auseinandergelaufen |
| Hosting | All-Inkl KAS, `w01f8f03.kasserver.com`, Webroot `/www/htdocs/w01f8f03/keymoji` | SSH |
| SSH | Alias `kmoji`, User `ssh-w01f8f03`, Key `~/.ssh/id_ed25519`, Login funktioniert | `~/.ssh/config`, `ssh kmoji 'echo ok'` |
| Server-Home | `HOME=/`, `~` zeigt auf `/` und ist nicht als Backup-Ziel geeignet | `ssh kmoji 'echo $HOME'` |
| Server-Tools | SFTP funktioniert, `/usr/bin/rsync` und `/usr/bin/lftp` vorhanden | `sftp`, `ssh kmoji 'command -v ...'` |
| FTPS | explizites FTPS auf Port 21, TLS 1.3, Zertifikat `*.kasserver.com` gültig | `openssl s_client -starttls ftp` |
| KAS-API | SOAP, `KasAuth.php` für Session, `KasApi.php` für Aktionen, Auth über `kas_login`, `kas_auth_type`, `kas_auth_data` | KAS-Doku, WSDL |
| Backend | eigenes Repo `chooomedia/keymoji-backend`, Vercel-Projekt `keymoji`, Domain `its.keymoji.wtf`, Node 22.x, Root `.`, 9 Functions | `.vercel/project.json`, `vercel project inspect` |
| Backend-Deploy | letztes Production-Deployment vor 185 Tagen, keine CI im Backend-Repo, `npm run deploy` verweist auf fehlendes `deploy.sh` | `vercel project ls`, `package.json` |
| Datenfluss | Browser zu All-Inkl, Browser zu `its.keymoji.wtf` für Kontakt, OTP, Account und Story, einige Account-Schritte direkt zu n8n, n8n zu Google Sheets, Brevo für Mail | `api/*`, `src/stores/accountStore.js` |
| Edge | Cloudflare proxied für `@` und `www`, `its` DNS only | `dig` |

Wichtig: Das Frontend und das Backend werden getrennt deployt. Ein Frontend-Deploy ändert nichts an Vercel, ein Vercel-Deploy ändert nichts am Webroot.

## Ist-Befund, am 23.11.2026 verifiziert

| Prüfung | Ergebnis |
|---|---|
| Sourcemaps | 51 Dateien, zusammen 2,9 MB, Beispiel `components-94099b64.1b7df42f.chunk.js.map`, 74.791 Bytes |
| Sync-State | `.ftp-deploy-sync-state.json`, 50.553 Bytes, 11.07.2026 |
| Exposition Edge | State 200, Map 200 |
| Exposition Origin | State 200, Map 200, `curl --resolve keymoji.wtf:443:85.13.165.159` |
| Live-`.htaccess` | 3.309 Bytes, entspricht der Vorlage aus `build.yml`, keine Sperren |
| `logs` im Webroot | nicht vorhanden |
| CAA | kein Record |
| DMARC | vorhanden: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@keymoji.wtf; ruf=mailto:dmarc-forensic@keymoji.wtf; adkim=s; aspf=s;` |
| DNSSEC | DS `2371 13 2 356424D5...D81865CD` im Parent sichtbar |
| HSTS und CSP | am Frontend nicht gesetzt |
| `X-XSS-Protection` | gesetzt |
| `www` | 301 auf `www.keymoji.wtf/en/`, kein Apex-Redirect |
| `its.keymoji.wtf/api/story` | GET 405, CORS nur `https://keymoji.wtf` |
| Vercel-Env-Namen | `N8N_APERTUS_WEBHOOK_URL`, `N8N_APERTUS_TOKEN`, `N8N_WEBHOOK_SECRET`, `N8N_ACCOUNT_WEBHOOK_URL`, `APP_VERSION`, `WEBHOOK_OPTIN`, `ADMIN_MAIL`, `MAIL_TO`, `BREVO_API_KEY`, `BREVO_LIST_ID`, `NODE_ENV`. Kein `SESSION_SECRET`, kein `TURNSTILE_SECRET_KEY`, kein `CORS_ORIGIN` |
| Rate-Limits | nur im Speicher der jeweiligen Function-Instanz, kein KV, kein Upstash. `api/story.js:21-35`, `api/magic-link/send.js:5-20`, `api/account.js:27` |

Abweichungen vom Briefing: DMARC ist bereits aktiv und strenger als `p=none`. Der DS-Record ist inzwischen im Parent sichtbar, nicht mehr nur bei NameSilo eingetragen.

## Entscheidungen

1. DMARC bleibt `p=quarantine`. Entschieden am 23.11.2026. Keine Änderung. `p=none` wäre eine Schwächung.
2. Deploy-Weg: FTPS mit dediziertem FTP-User. Entschieden am 23.11.2026. Begründung: FTPS ist heute mit TLS 1.3 verifiziert, `add_ftpuser` und `update_ftpuser` sind dokumentiert, der bestehende Workflow bleibt weitgehend gleich. Dazu kommt Least Privilege: ein SSH-Key im Runner hätte Zugriff auf den ganzen Account, ein eigener FTP-User nur auf seinen Pfad. rsync über SSH bleibt eine spätere Option.
3. Sync-State: Der FTP-User bekommt `ftp_path` so gesetzt, dass der State außerhalb des Webroots liegt. Der genaue Pfad wird vorher über `get_ftpusers` und die KAS-Doku bestimmt. Falls das Chroot `../` blockiert, bleibt der State im Webroot und wird über `.htaccess` und WAF gesperrt. Das Ergebnis wird im OPS-LOG festgehalten.
4. `.htaccess`: eine gemeinsame Vorlage `deploy/htaccess.conf` für `build.yml`, `deploy.yml` und `scripts/create-and-deploy-files.sh`. Damit verschwinden die drei Kopien.
5. Cloudflare: Änderungen nur per API, wenn `CF_API_TOKEN` gesetzt ist. Ohne Token wird eine Checkliste mit Soll-Werten und Prüfbefehlen dokumentiert, keine Änderung.

## Zurückgestellt: KAS-API

Entschieden am 24.11.2026. Diese Schritte sind bis auf Weiteres zurückgestellt und werden nicht ausgeführt:

- Schritt 0: KAS-Auth-Test und `KasFloodDelay`-Prüfung.
- Schritt 1, Teilschritt 2: `get_domains` und `get_subdomains` zur Domain-Zuordnung.
- Schritt 2, Teilschritt 2: `add_ftpuser` für einen dedizierten Deploy-User.
- Schritt 2, Teilschritt 6: `update_ftpuser` und Rotation des alten Zugangs.

Der Deploy läuft bis auf Weiteres mit dem bestehenden FTP-Zugang, aber über FTPS. Der Least-Privilege-Vorteil eines eigenen Users bleibt als Ziel notiert.

## Schritt 0: Preflight, nur lesend

| Prüfung | Befehl | Erwartet |
|---|---|---|
| SSH | `ssh -o BatchMode=yes kmoji 'echo ok'` | `ok` |
| SFTP | `printf 'pwd\n' \| sftp -b - kmoji` | Remote-Verzeichnis |
| Vercel | `vercel whoami`, `vercel project inspect keymoji` | eingeloggt, Projekt `keymoji`, `its.keymoji.wtf` |
| GitHub | `gh auth status` | eingeloggt |
| KAS-Auth (zurückgestellt) | `php -r` mit `KasApi` und `get_ftpusers`, Auth über `KAS_LOGIN` und `KAS_AUTH_DATA` | Array mit FTP-Usern, keine Ausgabe der Zugangsdaten |
| KAS-Flood (zurückgestellt) | Antwort auf `KasFloodDelay` prüfen | Feld in der Doku nicht beschrieben. Falls vorhanden, Pause übernehmen, sonst 1 Sekunde zwischen Aufrufen |
| Cloudflare | `GET https://api.cloudflare.com/client/v4/zones?name=keymoji.wtf` mit `CF_API_TOKEN`, nur Status und Zonen-ID ausgeben | Zone gefunden oder Token fehlt |

KAS-Auth: zuerst `kas_auth_type=plain` mit `KAS_AUTH_DATA`. Schlägt das mit einem Auth-Fehler fehl, wird nicht geraten, sondern nachgefragt, ob Session-Auth mit 2FA-PIN nötig ist. Ein kleiner Helfer `scripts/kas-api.php` liest die Werte nur aus der Umgebung, gibt nie Tokens aus und wartet `KasFloodDelay` ab. Er wird vor der Nutzung mit `php -l` geprüft.

Ergebnis des Preflights kommt als Tabelle, danach Stopp und Freigabe für Schritt 1.

## Schritt 1: Live-Exposition

Branch `sec/live-exposure`. Reihenfolge:

1. Inventar wiederholen: `find` über `*.map`, `.ftp-deploy-sync-state.json`, `logs`, `*.log`, `.env*`, `.git*`, jeweils Größe und Datum. Keine Änderung.
2. Zurückgestellt (KAS-API): per `get_domains` und `get_subdomains` prüfen, welche Domains auf `/www/htdocs/w01f8f03/` oder Unterordner zeigen. Ergebnis im OPS-LOG festhalten. Grund: der Backup-Ordner liegt außerhalb des Webroots `keymoji`, aber innerhalb von `htdocs` und kann über eine andere Domain erreichbar sein. Solange zurückgestellt, schützt die `.htaccess` mit `Require all denied` den Ordner.
3. Auf Freigabe: Backup-Ordner `/www/htdocs/w01f8f03/backup-keymoji-20261123/` anlegen. `~` zeigt auf `/`, deshalb nicht `~/backup...`. Im Ordner eine `.htaccess` mit `Require all denied` anlegen. Die aktuelle `.htaccess` hineinkopieren, dazu `sha256sum` von `.htaccess` und allen zu verschiebenden Dateien. Zusätzlich per `scp` eine Kopie nach lokal außerhalb des Repos legen, damit der Rollback nicht vom Server abhängt.
4. Auf Freigabe: die 51 Maps und den Sync-State mit `mv` in den Backup-Ordner verschieben. Kein `rm`.
5. Repo: `deploy/htaccess.conf` anlegen, mit dem bestehenden Block aus `build.yml` und diesen Sperren vor den Rewrite-Regeln:

```apache
# Sperren für Deploy-Artefakte und sensible Dateien
RewriteRule (^|/)\.env(\.[^/]*)?$ - [F,L,NC]
RewriteRule (^|/)\.git(/|$) - [F,L,NC]
RewriteRule (^|/)\.ftp-deploy-sync-state\.json$ - [F,L,NC]
RewriteRule \.map$ - [F,L,NC]
RewriteRule (^|/)logs(/|$) - [F,L,NC]
```

`build.yml` und `deploy.yml` erzeugen die Datei danach mit `cat deploy/htaccess.conf > build/.htaccess`, `scripts/create-and-deploy-files.sh` kopiert sie mit `cp`. Die Kommentare mit Gedankenstrich in der alten Vorlage werden auf einfachen Bindestrich umgestellt.

6. Auf Freigabe: neue `.htaccess` per `scp` in den Webroot legen, vorher Backup vorhanden.
7. Auf Freigabe: Cloudflare-Cache für die Map-URLs und die State-URL purgen. Mit `CF_API_TOKEN` per API, ohne Token als Checkliste im OPS-LOG.
8. Prüfen: State, eine Map, `.env`, `.git/config` und `logs/` über Cloudflare und direkt am Origin mit `?cb=ZUFALL` gegen den Cache. `/en/`, eine JS- und eine CSS-Datei müssen weiter 200 liefern.

Akzeptanz: gesperrte Pfade liefern 403 oder 404 an Edge und Origin, Startseite und Assets 200, Backup vollständig, Repo-Commit nur mit den eigenen Dateien.

Rollback: `.htaccess` aus dem Backup zurückschreiben, Dateien zurückverschieben.

## Schritt 2: Deploy-Härtung

Branch `chore/deploy-ftps`.

1. Vergleich dokumentieren: FTPS heute TLS 1.3 bestätigt, Action unterstützt `protocol: ftps` und `port: 21`. rsync über SSH wäre ohne State-Datei sauberer, setzt aber einen Deploy-Key voraus, den die KAS-API nicht verwaltet. Empfehlung bleibt FTPS.
2. Zurückgestellt (KAS-API): per `add_ftpuser` einen User nur für den Deploy anlegen. Parameter: `ftp_password` (lokal mit `openssl rand` erzeugt, nie angezeigt), `ftp_path` nach `get_ftpusers`-Konvention, `ftp_comment` `github-actions-deploy`, Rechte lesen, schreiben, listen `Y`. Wert nur per Pipe an `gh secret set` geben.
3. Workflows umstellen:
   - `protocol: ftps`, `port: 21`.
   - `state-name` so setzen, dass die Datei außerhalb des Webroots liegt, falls das Chroot es erlaubt. Sonst bleibt sie im Webroot und ist durch Schritt 1 gesperrt.
   - `exclude` um `**/*.map` und `**/.ftp-deploy-sync-state.json` ergänzen.
   - `log-level: standard`.
4. Neue GitHub-Secrets per `gh secret set NAME` aus stdin: Host, User, Passwort, Server-Dir. Die alten Secrets bleiben, bis der neue Deploy einmal erfolgreich war.
5. Auf Freigabe: Deploy über den Workflow auslösen. Log auf `TLS`, `FTPS` und erfolgreichen Abschluss prüfen.
6. Zurückgestellt (KAS-API): alte Secrets entfernen und den alten FTP-Zugang per `update_ftpuser` mit neuem `ftp_new_password` rotieren, danach den alten Zugang testen. Der Haupt-Account-FTP-User lässt sich laut Doku über `update_account` nicht mit einem FTP-Passwort ändern, nur über `account_kas_password`. Ob es dafür einen undokumentierten Parameter gibt, ist offen und wird nicht geraten.

Akzeptanz: Workflow-Log zeigt verschlüsselte Verbindung, Deploy erfolgreich, Maps nicht erneut hochgeladen, State nicht im Webroot, alter Zugang ungültig.

Rollback: alte Workflow-Version, alte Secrets, alten FTP-User weiterverwenden. Neuen User erst nach erfolgreichem Test löschen, mit Freigabe.

## Schritt 3: Vercel

Branch `docs/ops-vercel`, nur Doku und Env-Namen.

1. Lesend: `vercel env ls` (nur Namen), `vercel project inspect keymoji`, `vercel domains ls`, `vercel project protection keymoji`, `vercel logs --environment production --json --limit 200` und darin nach `/api/story` filtern. Vercel Hobby speichert Runtime-Logs nur kurz, wie weit die letzten Tage reichen, ist unbestätigt. Ergebnis mit Zeitraum im OPS-LOG.
2. Deploy-Weg des Backends klären und dokumentieren, bevor eine Env-Variable gesetzt wird: Git-Integration oder `vercel deploy`. Das letzte Production-Deployment ist 185 Tage alt, das aktuelle Backend-Repo ist also nicht deployt. Der Weg wird im OPS-LOG festgehalten.
3. Namensentscheidung: `SESSION_SECRET` bleibt der Name. Der Fallback auf `N8N_WEBHOOK_SECRET` in `keymoji-backend/utils/sessionToken.js` wird entfernt, ohne Secret fail closed. Die Änderung gehört in den Auth-Branch, nicht in diesen Doku-Schritt.
4. Auf Freigabe: `openssl rand -base64 32` erzeugen und ohne Anzeige in `vercel env add SESSION_SECRET production` pipen. `--sensitive` verwenden, falls die CLI-Version es unterstützt.
5. `TURNSTILE_SECRET_KEY` legt CM selbst an. Der Befehl wird gestellt, der Wert wird von CM eingegeben, nicht von Claude gelesen.
6. Persistenter Store: Empfehlung Upstash Redis über den Vercel Marketplace oder Zähler über n8n und Google Sheets, weil dort die Kontodaten schon liegen. Kein Anlegen in diesem Schritt.

Akzeptanz: Env-Liste zeigt die neuen Namen, keine Werte, Backend-Deploy separat freigegeben, Rate-Limit-Empfehlung dokumentiert.

Rollback: `vercel env rm NAME production` mit Freigabe.

## Schritt 4: Cloudflare

Nur mit `CF_API_TOKEN`. Jede Änderung zuerst als Diff vorher/nachher, dann Stopp und Freigabe. Ohne Token wird dieser Abschnitt als Checkliste in `OPS-PLAN.md` und `OPS-LOG.md` übernommen.

| Änderung | Zielwert | Endpoint |
|---|---|---|
| SSL-Modus | `strict` (Full strict) | `PATCH /zones/{id}/settings/ssl` |
| Always Use HTTPS | `on` | `PATCH /zones/{id}/settings/always_use_https` |
| Minimum TLS | `1.2` | `PATCH /zones/{id}/settings/min_tls_version` |
| TLS 1.3 | aktiviert | `PATCH /zones/{id}/settings/tls_1_3` |
| Automatic HTTPS Rewrites | `on` | `PATCH /zones/{id}/settings/automatic_https_rewrites` |
| CAA | `0 issue "letsencrypt.org"` | `POST /zones/{id}/dns_records` |
| Redirect Rule `www` | `https://www.keymoji.wtf/*` auf `https://keymoji.wtf/$1` mit 301, Pfad und Query bleiben erhalten | Rulesets-API (Redirect Rules) oder Dashboard |
| WAF Custom Rule | Block für `.env`, `.git`, `.ftp-deploy-sync-state.json`, `*.map`, `logs` | Rulesets-API oder Dashboard |

DMARC bleibt unverändert. SPF und MX werden nicht angefasst. Bot Fight Mode und HSTS werden nicht per API geändert, beides macht CM manuell. HSTS erst nach dem Header-Branch.

Rollback: alte Werte vorher auslesen und im OPS-LOG notieren, danach zurücksetzen.

## Schritt 5: Kontrollen und Doku

Branch `docs/ops-log`.

1. `dig +short DS`, `dig +short CAA`, `dig +short TXT _dmarc`, Header mit `curl -sSI`, Exposition über Cloudflare und Origin, Status von `its.keymoji.wtf`.
2. `docs/audit/OPS-LOG.md` anlegen: Datum, Befehl ohne Secrets, Ergebnis, Rollback-Weg, offene Punkte.
3. `docs/audit/TODO.md`: M04 CAA, M08 bis M11 Cloudflare, M15 bis M17 KAS, M18 bis M20 Vercel und T09 abhaken, soweit erledigt. T08 bleibt offen, bis der neue Deploy erfolgreich war.
4. Kurzer Abschlussbericht mit Zahlen, keine Behauptungen ohne Beleg.

## Dateien und Branches

| Aufgabe | Branch | Dateien |
|---|---|---|
| OPS-PLAN | `docs/ops-plan` | `docs/audit/OPS-PLAN.md` (neu) |
| Live-Exposition | `sec/live-exposure` | `deploy/htaccess.conf` (neu), `.github/workflows/build.yml`, `.github/workflows/deploy.yml`, `scripts/create-and-deploy-files.sh` |
| Deploy | `chore/deploy-ftps` | beide Workflows, ggf. `scripts/kas-api.php` |
| Vercel | `docs/ops-vercel` | `docs/audit/OPS-LOG.md`, `docs/ENVIRONMENT_VARIABLES.md` |
| Cloudflare | `docs/ops-cloudflare` | `docs/audit/OPS-PLAN.md`, `docs/audit/DNS-RUNBOOK.md` |
| Abschluss | `docs/ops-log` | `docs/audit/OPS-LOG.md`, `docs/audit/TODO.md` |

Commits Englisch, Conventional Commits. Doku Deutsch mit echten Umlauten. Nach jeder Aufgabe `npm run build`, `npx tsc --noEmit`, `git diff --stat`, kurzer Bericht, Stopp.

## Freigaben, die einzeln einzuholen sind

- Anlegen des Backup-Ordners und Verschieben der Maps und des Sync-State.
- Schreiben der neuen `.htaccess` auf den Server.
- Jeder KAS-API-Schreibaufruf: `add_ftpuser`, `update_ftpuser`, `delete_ftpuser`. Derzeit zurückgestellt.
- Jede Änderung an GitHub-Secrets.
- Jeder Workflow-Lauf mit Deploy.
- Jedes Setzen oder Entfernen einer Vercel-Env-Variable.
- Jede Cloudflare-Änderung.
- Push und Deploy.

## Offene und unbestätigte Punkte

- Ob `KAS_AUTH_DATA` ein Passwort oder ein Session-Token ist, zeigt der Preflight. 2FA bei KAS ist unbestätigt.
- `KasFloodDelay` ist in der offiziellen Doku nicht beschrieben. Verhalten wird aus der Antwort abgeleitet, nicht geraten.
- Das genaue `ftp_path`-Format zeigt `get_ftpusers`.
- Ob das FTP-Chroot `../` erlaubt, zeigt der erste Deploy. Fallback ist die Sperre im Webroot.
- Ob All-Inkl SSH-Keys für GitHub-Runner erlaubt, ist unbestätigt. Deshalb ist rsync nicht der erste Weg.
- Ob das Vercel-Projekt mit dem Backend-Repo verbunden ist, ist über die CLI nicht sichtbar. Letztes Production-Deployment vor 185 Tagen, das aktuelle Backend-Repo ist also nicht deployt.
- `SESSION_SECRET` bleibt der Name. Der Fallback auf `N8N_WEBHOOK_SECRET` entfällt, ohne Secret fail closed. Umsetzung im Auth-Branch.
- Vercel-Log-Aufbewahrung für mehrere Tage ist unbestätigt.
- Ob das Entfernen des alten FTP-Zugangs andere Automatismen bricht, ist unbestätigt.
