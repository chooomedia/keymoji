# Store-Bereinigung Zusammenfassung

## ✅ Durchgeführt

### 1. Backup-Dateien entfernt
- ✅ `accountStore.ts.backup` gelöscht

### 2. Duplikate entfernt (.svelte.ts)
- ✅ `accountStore.svelte.ts` gelöscht
- ✅ `contentStore.svelte.ts` gelöscht
- ✅ `dailyUsageStore.svelte.ts` gelöscht
- ✅ `userDataStore.svelte.ts` gelöscht
- ✅ `blogLikesStore.svelte.ts` gelöscht
- ✅ `seoStore.svelte.ts` gelöscht
- ✅ `appStores.svelte.ts` gelöscht

### 3. Bridge-Dateien aktualisiert
- ✅ `appStores.js` → zeigt jetzt auf `appStores.ts`
- ✅ `accountStore.js` → zeigt jetzt auf `accountStore.ts`
- ✅ `contentStore.js` → zeigt bereits auf `contentStore.ts`
- ✅ `dailyUsageStore.js` → zeigt bereits auf `dailyUsageStore.ts`
- ✅ `userDataStore.js` → zeigt bereits auf `userDataStore.ts`
- ✅ `modalStore.js` → zeigt jetzt auf `modalStore.ts` (FEHLT NOCH!)
- ✅ `userSettingsStore.js` → zeigt jetzt auf `userSettingsStore.ts` (FEHLT NOCH!)

## ⚠️ Noch zu erledigen

### 1. Fehlende .ts Stores erstellen
- ❌ `modalStore.ts` muss erstellt werden (existiert nur als .svelte.ts, wurde gelöscht)
- ❌ `userSettingsStore.ts` muss erstellt werden (existiert nur als .svelte.ts, wurde gelöscht)

### 2. Alle Imports aktualisieren
- ❌ Alle `.svelte.ts` Imports → `.ts` ändern
- ❌ Alle `.js` Imports → `.ts` ändern (oder Bridge-Dateien behalten)

### 3. Webpack-Config prüfen
- ⚠️ Sicherstellen dass `.ts` Dateien korrekt aufgelöst werden

## 📋 Nächste Schritte

1. **modalStore.ts und userSettingsStore.ts erstellen**
   - Aus den Imports analysieren welche Funktionen exportiert werden müssen
   - Svelte 5 Runes verwenden ($state, $derived)
   - TypeScript-Typen definieren

2. **Alle Imports systematisch aktualisieren**
   - Script erstellen oder manuell alle `.svelte.ts` → `.ts` ändern
   - Alle `.js` Imports prüfen ob Bridge-Dateien benötigt werden

3. **Tests durchführen**
   - Build testen
   - Alle Routes testen
   - Store-Funktionalität testen

