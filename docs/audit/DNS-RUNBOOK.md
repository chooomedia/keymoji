# DNS-Runbook keymoji.wtf

Stand: 22. November 2026. Auslöser: `ERR_SSL_PROTOCOL_ERROR`, Domain zeigt auf Parklogic, Ablauf am 22.11.2026 um 23:55 UTC.

## Lage

- Registrar: NameSilo.
- Falsche Nameserver: `ns1.ns306.parklogic.com`, `ns2.ns306.parklogic.com`.
- Richtiger Ursprung: All-Inkl, `85.13.165.159` (`w01f8f03.kasserver.com`).
- Zertifikat: Let's Encrypt, gültig bis 2027-02-01.
- Webroot: `/www/htdocs/w01f8f03/keymoji`.

## Schritt 1: Domain verlängern

1. `https://www.namesilo.com` öffnen und anmelden.
2. Domain Manager öffnen, `keymoji.wtf` suchen.
3. Verlängerung für mindestens ein Jahr bestellen und bezahlen.
4. Auto-Renew einschalten.
5. Transfer-Lock nicht entfernen.
6. Ablaufdatum prüfen. Es muss nach dem 22.11.2027 liegen.

## Schritt 2: Nameserver zurückstellen

1. In NameSilo bei `keymoji.wtf` die Nameserver-Verwaltung öffnen.
2. Von Parklogic auf eigene Nameserver umstellen.
3. Werte eintragen, die KAS für die Domain anzeigt. Üblich sind:
   - `ns5.kasserver.com`
   - `ns6.kasserver.com`
   - `ns7.kasserver.com`
4. Speichern.
5. Propagierung abwarten, meist 5 bis 60 Minuten.

Falls KAS andere Nameserver nennt, gelten diese Werte. Nicht raten.

## Schritt 3: KAS prüfen

1. `https://kas.all-inkl.com` öffnen.
2. Domain `keymoji.wtf` öffnen.
3. Zuordnung zum Webspace prüfen. Zielverzeichnis muss `/www/htdocs/w01f8f03/keymoji` sein.
4. DNS-Verwaltung öffnen und diese Records prüfen oder anlegen:
   - `@` A `85.13.165.159`
   - `www` A `85.13.165.159` oder CNAME auf `@`
   - `its` CNAME auf die Vercel-Zieldomain, üblich `cname.vercel-dns.com`. Den Wert in Vercel unter Project, Settings, Domains gegenprüfen.
   - `MX` auf `mail.eye-mail.net`
   - TXT SPF `v=spf1 ip6:fdec:ae16:fda7::/48 -all`
   - CAA `0 issue "letsencrypt.org"`
5. SSL/TLS prüfen. Let's Encrypt für `keymoji.wtf` und `www.keymoji.wtf` muss aktiv sein. Das vorhandene Zertifikat ist bis 2027-02-01 gültig, also nur prüfen.

Wichtig: Die DNS-Zone erst ändern, wenn die Nameserver wieder auf KAS zeigen. Sonst sind die Records nicht wirksam.

## Schritt 4: Verifizieren

```bash
dig +short keymoji.wtf NS
dig +short keymoji.wtf A
dig +short www.keymoji.wtf A
dig +short its.keymoji.wtf
curl -sSI https://keymoji.wtf/ | head -5
curl -sSI https://www.keymoji.wtf/ | head -5
curl -sSI https://its.keymoji.wtf/api/story | head -5
openssl s_client -connect keymoji.wtf:443 -servername keymoji.wtf </dev/null | openssl x509 -noout -dates
```

Erwartet:

- NS zeigen auf All-Inkl.
- A zeigt `85.13.165.159`.
- `https://keymoji.wtf/` liefert 301 auf `/en/`.
- `its.keymoji.wtf` liefert eine HTTP-Antwort von Vercel, keinen TLS-Fehler.
- Das Zertifikat ist gültig.

## Schritt 5: Nebenwirkungen prüfen

- E-Mail: MX und SPF prüfen, Testmail an eine Adresse auf der Domain senden.
- Backend: `https://its.keymoji.wtf/api/story` mit OPTIONS oder POST testen, Antwort 200 oder 405 statt TLS-Fehler.
- Login: OTP-Mail über die Site anfordern und Zustellung prüfen.
- Suche: Nach der Umstellung in der Search Console eine erneute Crawl-Anfrage stellen.

## Wenn etwas fehlt

- Domain lässt sich nicht verlängern: NameSilo-Support kontaktieren, Ablaufzeit im Blick behalten. Bei Ablauf droht die Löschung nach der Grace-Period.
- KAS zeigt keine DNS-Zone: All-Inkl-Support kontaktieren und die Domain als externe Domain mit DNS-Verwaltung einrichten lassen.
- `its` fehlt: In Vercel die Domain `its.keymoji.wtf` dem Projekt zuordnen, danach den angezeigten CNAME in KAS eintragen.
- Zertifikat abgelaufen: In KAS neu ausstellen, DNS muss vorher korrekt zeigen.

## Nicht tun

- Keine Nameserver-Änderung ohne Verlängerung.
- Keine DNSSEC-Einträge ändern, solange die Zone nicht vollständig geprüft ist.
- Keine Live-Dateien löschen, bevor die Site wieder erreichbar ist.
