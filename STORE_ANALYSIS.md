# Store-Analyse und Bereinigungsplan

## Gefundene Duplikate

### 1. Bridge-Dateien (.js) - NUR Re-Exports
- `accountStore.js` → re-exportiert `accountStore.svelte.ts`
- `appStores.js` → re-exportiert `appStores.svelte.ts`
- `contentStore.js` → re-exportiert `contentStore.ts`
- `dailyUsageStore.js` → re-exportiert `dailyUsageStore.svelte.ts`
- `modalStore.js` → re-exportiert `modalStore.svelte.ts`
- `userDataStore.js` → re-exportiert `userDataStore.svelte.ts`
- `userSettingsStore.js` → re-exportiert `userSettingsStore.svelte.ts`

### 2. Duplikate (.ts vs .svelte.ts)
- `accountStore.ts` = `accountStore.svelte.ts` (IDENTISCH)
- `contentStore.ts` = `contentStore.svelte.ts` (IDENTISCH)
- `dailyUsageStore.ts` = `dailyUsageStore.svelte.ts` (IDENTISCH)
- `userDataStore.ts` = `userDataStore.svelte.ts` (IDENTISCH)
- `blogLikesStore.ts` = `blogLikesStore.svelte.ts` (IDENTISCH)
- `seoStore.ts` = `seoStore.svelte.ts` (IDENTISCH)

### 3. Backup-Dateien
- `accountStore.ts.backup` → LÖSCHEN

### 4. Inkonsistente Imports
- Manche verwenden `.js`
- Manche verwenden `.ts`
- Manche verwenden `.svelte.ts`

## Bereinigungsplan

### Schritt 1: Backup-Dateien entfernen
- `accountStore.ts.backup` löschen

### Schritt 2: .svelte.ts Dateien entfernen (Duplikate)
- Alle `.svelte.ts` Dateien sind identisch zu `.ts` Versionen
- Entfernen und alle Imports auf `.ts` umstellen

### Schritt 3: Bridge-Dateien (.js) vereinheitlichen
- Option A: Alle `.js` Bridge-Dateien entfernen, Webpack-Config anpassen
- Option B: Einheitliches Bridge-System erstellen

### Schritt 4: Alle Imports aktualisieren
- Alle Imports auf `.ts` umstellen
- Keine `.js` oder `.svelte.ts` Imports mehr

### Schritt 5: Webpack-Config prüfen
- Sicherstellen dass `.ts` Dateien korrekt aufgelöst werden

