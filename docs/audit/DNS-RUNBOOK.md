# DNS-Runbook keymoji.wtf

Stand: 23. November 2026, 07:46 UTC.

Auslöser: Die Domain lief am 22.11.2026 um 23:55 UTC ab und die Nameserver zeigten auf Parklogic. Die Site war nicht erreichbar. Behoben durch automatische Verlängerung und Umstellung der Nameserver auf Cloudflare.

## Lage

| Punkt | Wert |
|---|---|
| Registrar | NameSilo, Domain `keymoji.wtf` |
| Ablauf | `2027-11-22T23:55:45Z` |
| RDAP-Status | `client transfer prohibited`, `auto renew period` |
| Nameserver | `anahi.ns.cloudflare.com`, `eoin.ns.cloudflare.com` |
| Edge | Cloudflare, A `104.21.19.203`, `172.67.190.45`, AAAA `2606:4700:3036::6815:13cb`, `2606:4700:3037::ac43:be2d` |
| Origin | All-Inkl KAS `85.13.165.159` (`w01f8f03.kasserver.com`) |
| Webroot | `/www/htdocs/w01f8f03/keymoji` |
| Backend | Vercel `its.keymoji.wtf`, DNS only, `a53cbcd736e6fa04.vercel-dns-017.com` |
| Mail | MX `10 w01f8f03.kasserver.com`, SPF `v=spf1 mx include:spf.brevo.com -all`, DMARC `p=quarantine` |
| DNSSEC | DS `2371 13 2 356424D57C2ABBF442F71B81E97F7AEFB0B55364FBF7A89925EA44E0D81865CD` im Parent veröffentlicht |
| Zertifikat am Edge | Let's Encrypt, CN `keymoji.wtf` |

Offene Punkte: CAA fehlt, HSTS fehlt, `www` leitet noch auf `www` und nicht auf den Apex. Ob die Verlängerung bezahlt ist und wer die Nameserver geändert hat, ist unbestätigt.

## Incident-Ablauf

| Zeitpunkt (UTC) | Ereignis | Beleg |
|---|---|---|
| 22.11.2026, 09:04:58 | RDAP letzte Änderung vor dem Ausfall | RDAP |
| 22.11.2026, 23:18 | Nameserver Parklogic, A `162.4.84.247`, TLS-Fehler | `dig`, `curl` |
| 22.11.2026, 23:56:06 | Domain automatisch verlängert | RDAP Ablauf 2027 |
| 23.11.2026, 05:20:03 | Nameserver auf Cloudflare umgestellt | RDAP letzte Änderung |
| 23.11.2026, 07:46 | HTTPS Root 301 auf `/en/`, `/en/` 200, `its` 405 auf GET | `curl` |

## Cloudflare-Konfiguration (Soll)

### DNS-Records

| Name | Typ | Wert | Proxy |
|---|---|---|---|
| `keymoji.wtf` | A | `85.13.165.159` | proxied |
| `www` | A oder CNAME | `85.13.165.159` oder `keymoji.wtf` | proxied |
| `its` | CNAME | `a53cbcd736e6fa04.vercel-dns-017.com` | DNS only |
| `keymoji.wtf` | MX | `10 w01f8f03.kasserver.com` | nicht proxied |
| `keymoji.wtf` | TXT | `v=spf1 mx include:spf.brevo.com -all` | nicht proxied |
| `keymoji.wtf` | TXT | `brevo-code:...` | nicht proxied |
| `keymoji.wtf` | TXT | `google-site-verification=...` | nicht proxied |
| `_dmarc.keymoji.wtf` | TXT | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@keymoji.wtf; ruf=mailto:dmarc-forensic@keymoji.wtf; adkim=s; aspf=s;` | nicht proxied |
| `keymoji.wtf` | CAA | `0 issue "letsencrypt.org"` (offen) | nicht proxied |

`its` muss auf DNS only bleiben, weil Vercel hinter dem Cloudflare-Proxy nicht zuverlässig erreichbar ist und das Backend eigene TLS-Terminierung macht.

### Einstellungen

| Bereich | Wert |
|---|---|
| SSL/TLS-Modus | Full (strict) |
| Always Use HTTPS | an |
| Minimum TLS | 1.2 |
| HSTS | `max-age=31536000; includeSubDomains`, Preload nur nach Entscheidung |
| DNSSEC | aktiv, DS im Parent veröffentlicht |
| CAA | `0 issue "letsencrypt.org"` |
| Cache | HTML kurz, Assets mit Hash lange |

### WAF-Regel

Ziel: `.map`, `.git*`, `.env*`, `.ftp-deploy-sync-state.json` und `logs` am Edge blocken. Ausdruck so fassen, dass normale Assets nicht betroffen sind.

```text
(http.request.uri.path contains "/.env") or
(http.request.uri.path contains "/.git") or
(http.request.uri.path contains "/.ftp-deploy-sync-state.json") or
(lower(http.request.uri.path) matches "^.*\\.map$") or
(http.request.uri.path contains "/logs/")
```

Aktion: Block. Nach dem Setzen prüfen, dass `index.html`, `static/js/*.js`, `static/css/*.css` und Bilder weiter 200 liefern. Die `.htaccess` bleibt als zweite Schicht, weil der Origin über `85.13.165.159` direkt erreichbar ist.

## NameSilo

1. Anmelden und Domain Manager öffnen.
2. Ablauf und Auto-Renew prüfen. Erwartet: Ablauf 22.11.2027, Auto-Renew an.
3. Rechnung oder Belastung für 2026/2027 prüfen und dokumentieren.
4. Kontaktadresse auf `christopher@keymoji.com` ändern, sobald der Zugang besteht. 2FA und Domain Lock bleiben aktiv.
5. Nameserver nicht zurück auf All-Inkl stellen. Cloudflare bleibt die DNS-Schicht.
6. DNSSEC-Eintrag prüfen. Der DS ist im Parent sichtbar, also nicht mehr ändern, solange die Zone stabil ist.

## KAS

1. `https://kas.all-inkl.com` öffnen und Domain `keymoji.wtf` prüfen.
2. Zuordnung zum Webspace bestätigen. Zielverzeichnis `/www/htdocs/w01f8f03/keymoji`.
3. Zertifikat für `keymoji.wtf` und `www.keymoji.wtf` prüfen.
4. `.htaccess` wird aus dem Build erzeugt und nach Freigabe deployt. Sie enthält Header, CSP und die Sperren für `.map`, `.git*`, `.env*`, `.ftp-deploy-sync-state.json` und `logs`.

## Vercel

1. Projekt-Domain `its.keymoji.wtf` zuordnen und den angezeigten CNAME in Cloudflare als DNS only eintragen.
2. `SESSION_SECRET` setzen, mindestens 32 Byte.
3. `TURNSTILE_SECRET_KEY` setzen, nur serverseitig.
4. CORS im Code auf `https://keymoji.wtf` und `https://www.keymoji.wtf` begrenzen.

## Verifizieren

```bash
dig +short keymoji.wtf NS
dig +short keymoji.wtf A
dig +short keymoji.wtf AAAA
dig +short DS keymoji.wtf
dig +short CAA keymoji.wtf
dig +short www.keymoji.wtf
dig +short its.keymoji.wtf
dig +short MX keymoji.wtf
dig +short TXT keymoji.wtf
dig +short TXT _dmarc.keymoji.wtf
curl -sSI https://keymoji.wtf/ | sed -n '1,8p'
curl -sSI https://keymoji.wtf/en/ | grep -iE 'strict-transport|content-security|x-xss'
curl -sSI https://www.keymoji.wtf/ | sed -n '1,8p'
curl -sS -o /dev/null -D - https://its.keymoji.wtf/api/story | sed -n '1,10p'
openssl s_client -connect keymoji.wtf:443 -servername keymoji.wtf </dev/null | openssl x509 -noout -dates
```

Erwartet:

- NS zeigen auf Cloudflare.
- A und AAAA zeigen Cloudflare-IPs.
- DS ist vorhanden.
- CAA zeigt `letsencrypt.org`.
- `https://keymoji.wtf/` liefert 301 auf `/en/`.
- `/en/` liefert 200 mit HSTS und CSP.
- `www` landet auf dem Apex.
- `its.keymoji.wtf` liefert eine HTTP-Antwort von Vercel, keinen TLS-Fehler.

### WAF und Origin

```bash
for p in /.ftp-deploy-sync-state.json /.env /.git/config /static/js/test.map; do
  curl -s -o /dev/null -w "%{http_code} edge $p\n" "https://keymoji.wtf$p"
  curl -s -o /dev/null -w "%{http_code} origin $p\n" --resolve keymoji.wtf:443:85.13.165.159 "https://keymoji.wtf$p"
done
```

Erwartet: 403 für die gesperrten Pfade an Edge und Origin, 200 für `index.html` und echte Assets.

## Wenn etwas fehlt

- Domain läuft ab: NameSilo-Support kontaktieren, Ablauf im Blick behalten. Bei Ablauf droht die Löschung nach der Grace Period.
- Zone in Cloudflare unvollständig: fehlende Records aus der Tabelle oben ergänzen, MX und TXT nicht proxien.
- `its` nicht erreichbar: In Vercel die Domain zuordnen und den CNAME in Cloudflare als DNS only eintragen.
- Zertifikat am Origin abgelaufen: In KAS neu ausstellen, Cloudflare-Modus bleibt Full (strict).
- HSTS verursacht Probleme: Wert zuerst klein setzen, etwa `max-age=300`, dann erhöhen. Nicht sofort Preload beantragen.

## Nicht tun

- Keine Nameserver-Änderung ohne geprüfte Zone.
- Keine DNSSEC-Einträge ändern, solange Zone und DS nicht zusammenpassen. Ein falscher DS macht die Domain unauflösbar.
- Keine Live-Dateien löschen, bevor die Site wieder erreichbar ist.
- Kein HSTS-Preload ohne ausdrückliche Entscheidung.
- Keine `its`-Record über den Proxy leiten.
