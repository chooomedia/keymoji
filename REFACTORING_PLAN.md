# Codebase Refactoring Plan
## Analyse & Schritt-für-Schritt Plan

## ✅ Bereits erledigt
1. ✅ Doppelte Dateien entfernt:
   - `timestamp.js` → gelöscht (nur `.ts` bleibt)
   - `dailyUsageStore.svelte.ts` → gelöscht (nur `.ts` bleibt)

## 🔍 Gefundene Probleme

### 1. Große Stores (müssen aufgeteilt werden)
- **accountStore.ts**: 2793 Zeilen
  - Sollte aufgeteilt werden in:
    - `accountStore.ts` - Haupt-Store mit Exports
    - `accountSecurity.ts` - Security & Logging (logSecurityEvent, logAccountingEvent, checkRateLimit)
    - `accountSession.ts` - Session Management (initializeAccountFromCookies, logout, validateSession)
    - `accountOperations.ts` - CRUD Operations (createAccount, getAccount, updateAccount)
    - `accountHelpers.ts` - Helper Functions (generateSecureToken, generateFantasyName, safeJSONParse)

- **dailyUsageStore.ts**: 950 Zeilen
  - Sollte aufgeteilt werden in:
    - `dailyUsageStore.ts` - Haupt-Store
    - `dailyUsageAPI.ts` - API Calls (loadUsageFromAPI, saveUsageToAPI)
    - `dailyUsageHelpers.ts` - Helper Functions (getTodayDateString, shouldResetUsage)

- **userDataStore.ts**: 747 Zeilen
  - Sollte aufgeteilt werden in:
    - `userDataStore.ts` - Haupt-Store
    - `usageHistoryAPI.ts` - Usage History API Calls
    - `usageHistoryHelpers.ts` - Helper Functions

### 2. Doppelte Funktionen in Utils
- `navigation.ts` und `routing.ts` - beide haben navigate Funktionen
- `seo.ts` und `seo-keywords.ts` - SEO-bezogene Funktionen könnten konsolidiert werden

### 3. Svelte 5 Runes Migration
- Alle Stores verwenden noch klassische `writable`/`derived` Stores
- Sollten auf `$state`/`$derived` migriert werden gemäß Cursor Rules

### 4. Data Loading Pattern
- Keine SvelteKit load functions (Custom Router wird verwendet)
- Aber Pattern könnte trotzdem implementiert werden für bessere Struktur

## 📋 Refactoring Schritte

### Phase 1: Doppelte Dateien entfernen ✅
- [x] timestamp.js entfernt
- [x] dailyUsageStore.svelte.ts entfernt

### Phase 2: Stores aufteilen
- [ ] accountStore.ts aufteilen
- [ ] dailyUsageStore.ts aufteilen  
- [ ] userDataStore.ts aufteilen

### Phase 3: Utils konsolidieren
- [ ] navigation.ts und routing.ts konsolidieren
- [ ] seo.ts und seo-keywords.ts konsolidieren
- [ ] Doppelte Funktionen identifizieren und entfernen

### Phase 4: Svelte 5 Runes Migration
- [ ] appStores.ts auf Runes migrieren
- [ ] dailyUsageStore.ts auf Runes migrieren
- [ ] Alle anderen Stores auf Runes migrieren

### Phase 5: Data Loading Pattern
- [ ] Load functions Pattern implementieren (auch für Custom Router)
- [ ] Single Source of Truth für alle Data Loadings

### Phase 6: Komponenten aufteilen
- [ ] Große Komponenten identifizieren (>500 Zeilen)
- [ ] In kleinere Komponenten aufteilen

## 🎯 Prioritäten

1. **Hoch**: Stores aufteilen (accountStore.ts ist zu groß)
2. **Hoch**: Utils konsolidieren (doppelte Funktionen)
3. **Mittel**: Svelte 5 Runes Migration
4. **Mittel**: Data Loading Pattern
5. **Niedrig**: Komponenten aufteilen

## 📝 Notizen

- Custom Router wird verwendet (kein SvelteKit)
- Aber SvelteKit Patterns können trotzdem verwendet werden
- Alle Stores sollten TypeScript sein
- Single Source of Truth Prinzip beachten

