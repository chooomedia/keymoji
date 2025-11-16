# Refactoring Status

## ✅ Abgeschlossen

### Phase 1: Doppelte Dateien entfernen
- ✅ `timestamp.js` entfernt
- ✅ `dailyUsageStore.svelte.ts` entfernt

### Phase 2: accountStore.ts aufteilen (IN ARBEIT)
- ✅ `accountHelpers.ts` erstellt (Helper Functions)
- ✅ `accountSecurity.ts` erstellt (Security & Logging)
- ⏳ `accountSession.ts` - Teilweise erstellt (noch zu vervollständigen)
- ⏳ `accountOperations.ts` - Noch zu erstellen
- ⏳ `accountStore.ts` - Muss refactored werden um neue Module zu verwenden

## 📋 Nächste Schritte

1. **accountSession.ts vervollständigen**
   - validateSession hinzufügen
   - initializeAccountFromCookies hinzufügen (komplex, ~300 Zeilen)
   - logout hinzufügen
   - setupMagicLinkListener hinzufügen
   - notifyMagicLinkVerification hinzufügen

2. **accountOperations.ts erstellen**
   - createAccount
   - getAccount
   - updateAccount
   - checkAccountExists
   - loginWithMagicLink
   - verifyMagicLink
   - verifyMagicLinkFrontend

3. **accountStore.ts refactoren**
   - Alle Funktionen durch Imports aus neuen Modulen ersetzen
   - Nur noch Exports behalten
   - Types exportieren

4. **Alle Imports aktualisieren**
   - Prüfen ob alle Imports noch funktionieren
   - Tests durchführen

## ⚠️ Wichtige Hinweise

- Types bleiben in `accountStore.ts` und werden von dort exportiert
- `accountSecurity.ts` importiert Types temporär von `accountStore.ts`
- Nach Refactoring können Types in separate `accountTypes.ts` verschoben werden


