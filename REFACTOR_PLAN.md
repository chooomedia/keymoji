# 🔄 Keymoji Refactor Plan v0.7.7
## Umfassender Refactoring-Plan für Modernisierung auf Svelte 5 + TypeScript

**Version:** 0.7.7  
**Startdatum:** 2025-01-XX  
**Ziel:** Modernes, performantes, wartbares Frontend mit Svelte 5, TypeScript, und Best Practices

---

## 📊 Executive Summary

### Aktueller Stand
- **Svelte:** 3.59.2 → **Ziel:** 5.x mit Runes
- **TypeScript:** Nicht aktiv → **Ziel:** Vollständig typisiert
- **Build:** Webpack → **Ziel:** Webpack (optimiert) oder Vite
- **Stores:** Klassische Stores → **Ziel:** Svelte Runes
- **Tailwind:** 2.2.19 → **Ziel:** 3.x mit JIT

### Hauptprobleme
1. ❌ Svelte 3 statt Svelte 5
2. ❌ Keine TypeScript-Unterstützung
3. ❌ Doppelte API-Calls während Login
4. ❌ Klassische Stores statt Runes
5. ❌ Viele Code-Duplikate
6. ❌ Keine automatische Versionierung
7. ❌ Ineffiziente Reaktivität

---

## 🎯 Refactor-Phasen

### Phase 1: Vorbereitung & Setup (v0.7.5)
**Dauer:** 2-3 Tage

#### 1.1 Dependencies aktualisieren
- [ ] `package.json` analysieren
- [ ] Svelte 3 → 5 Migration vorbereiten
- [ ] TypeScript Setup (`tsconfig.json`)
- [ ] Tailwind CSS 2 → 3 Migration
- [ ] Alle Dependencies auf neueste Versionen

#### 1.2 Build-System optimieren
- [ ] Webpack Config optimieren
- [ ] Oder: Vite Migration evaluieren
- [ ] TypeScript Loader konfigurieren
- [ ] Source Maps für Production

#### 1.3 Cursor Rules & Dokumentation
- [x] `.cursorrules` erstellen
- [ ] `REFACTOR_PLAN.md` erstellen (dieses Dokument)
- [ ] `MIGRATION_GUIDE.md` erstellen
- [ ] Code-Style Dokumentation

**Deliverables:**
- ✅ `.cursorrules` Datei
- ✅ Aktualisierte `package.json`
- ✅ `tsconfig.json`
- ✅ Optimierte Build-Config

---

### Phase 2: TypeScript Migration (v0.7.6)
**Dauer:** 5-7 Tage

#### 2.1 TypeScript Schemas definieren
- [ ] `src/types/` Ordner erstellen
- [ ] `Account.ts` - Account-Interfaces
- [ ] `User.ts` - User-Interfaces
- [ ] `API.ts` - API Response Types
- [ ] `Settings.ts` - Settings Types
- [ ] `Blog.ts` - Blog Types

#### 2.2 Utils migrieren
- [ ] `utils/*.js` → `utils/*.ts`
- [ ] TypeScript Types hinzufügen
- [ ] JSDoc Comments ergänzen
- [ ] Tests anpassen

#### 2.3 Stores migrieren
- [ ] `stores/*.js` → `stores/*.ts`
- [ ] TypeScript Types für Stores
- [ ] Store-Interfaces definieren

#### 2.4 Komponenten migrieren
- [ ] `components/*.svelte` → `lang="ts"`
- [ ] Props typisieren
- [ ] Events typisieren
- [ ] Slots typisieren

**Deliverables:**
- ✅ Alle `.js` → `.ts` migriert
- ✅ Alle `.svelte` mit `lang="ts"`
- ✅ TypeScript Schemas definiert
- ✅ Keine TypeScript Errors

---

### Phase 3: Svelte 5 Migration (v0.7.7)
**Dauer:** 7-10 Tage

#### 3.1 Runes Migration - Stores
- [ ] `appStores.js` → Runes (`$state`, `$derived`)
- [ ] `accountStore.js` → Runes
- [ ] `userSettingsStore.js` → Runes
- [ ] `contentStore.js` → Runes
- [ ] `modalStore.js` → Runes
- [ ] Alle anderen Stores → Runes

#### 3.2 Runes Migration - Komponenten
- [ ] Props: `export let` → `let { prop } = $props()`
- [ ] State: `let variable` → `let variable = $state()`
- [ ] Derived: `$: derived = ...` → `let derived = $derived(...)`
- [ ] Effects: `$: { ... }` → `$effect(() => { ... })`

#### 3.3 Reaktivität optimieren
- [ ] Unnötige reaktive Statements entfernen
- [ ] `$derived` für abgeleitete Werte
- [ ] `$effect` für Side Effects
- [ ] Memoization für teure Berechnungen

**Deliverables:**
- ✅ Alle Stores auf Runes migriert
- ✅ Alle Komponenten auf Runes migriert
- ✅ Keine klassischen Stores mehr
- ✅ Optimierte Reaktivität

---

### Phase 4: Code-Konsolidierung (v0.7.7)
**Dauer:** 5-7 Tage

#### 4.1 Duplikate entfernen
- [ ] `safeSetTimeout` - bereits in `sharedHelpers.js`
- [ ] `generateClientFingerprint` - konsolidieren
- [ ] `loadDailyUsage` - zentralisieren
- [ ] API-Call-Logik - konsolidieren
- [ ] Settings-Logik - konsolidieren

#### 4.2 Wiederverwendbare Komponenten
- [ ] Gemeinsame Button-Komponenten
- [ ] Gemeinsame Input-Komponenten
- [ ] Gemeinsame Modal-Komponenten
- [ ] Gemeinsame Form-Komponenten

#### 4.3 API-Call-Optimierung
- [ ] Doppelte API-Calls entfernen
- [ ] `cachedFetch` überall verwenden
- [ ] Daten zwischen Komponenten weitergeben
- [ ] Batch-Requests wo möglich

**Deliverables:**
- ✅ Keine Code-Duplikate mehr
- ✅ Wiederverwendbare Komponenten
- ✅ Optimierte API-Calls
- ✅ Saubere Code-Struktur

---

### Phase 5: Performance & A11y (v0.7.7)
**Dauer:** 3-5 Tage

#### 5.1 Performance-Optimierung
- [ ] Lazy Loading für Routes
- [ ] Code Splitting optimieren
- [ ] Image Optimization
- [ ] CSS Purge optimieren
- [ ] Bundle Size reduzieren

#### 5.2 A11y Verbesserungen
- [ ] ARIA-Labels überall
- [ ] Keyboard Navigation
- [ ] Focus Management
- [ ] Screen Reader Support
- [ ] Skip Links

#### 5.3 Tailwind CSS Optimierung
- [ ] Gemeinsame Patterns als Utilities
- [ ] PurgeCSS konfigurieren
- [ ] JIT Mode aktivieren
- [ ] Custom Utilities definieren

**Deliverables:**
- ✅ Optimierte Performance
- ✅ Vollständige A11y-Unterstützung
- ✅ Optimiertes Tailwind CSS
- ✅ Kleinere Bundle-Größe

---

### Phase 6: Automatisierung & CI/CD (v0.7.7)
**Dauer:** 2-3 Tage

#### 6.1 Automatische Versionierung
- [ ] Git Hooks für Version-Bump
- [ ] Pre-Commit Hook für Version-Check
- [ ] Post-Commit Hook für Git Tag
- [ ] GitHub Actions für Versioning

#### 6.2 GitHub Actions
- [ ] Automated Testing
- [ ] Automated Builds
- [ ] Automated Deployment
- [ ] Version Tagging

#### 6.3 Build-Optimierung
- [ ] Production Builds optimieren
- [ ] Development Builds beschleunigen
- [ ] Source Maps konfigurieren
- [ ] Error Reporting

**Deliverables:**
- ✅ Automatische Versionierung
- ✅ GitHub Actions Workflows
- ✅ Optimierte Builds
- ✅ CI/CD Pipeline

---

## 📋 Detaillierte Aufgabenliste

### Kritische Aufgaben (P0)

#### API-Call-Optimierung
- [ ] `verifyMagicLinkFrontend` - Account-Daten weitergeben statt neu laden
- [ ] `syncAccountData` - Keine doppelten `cachedFetchAccount` Calls
- [ ] `initializeDailyUsage` - Account-Daten verwenden statt neu laden
- [ ] `refreshUsageHistory` - Account-Daten verwenden statt neu laden
- [ ] `refreshUserSettings` - Account-Daten verwenden statt neu laden

#### Race Conditions
- [ ] Alle `setTimeout` Delays entfernen
- [ ] Proper `async/await` Chains verwenden
- [ ] `Promise.all()` für parallele Operations
- [ ] Error Handling ohne Delays

#### Code-Duplikate
- [ ] `safeSetTimeout` - Nur in `sharedHelpers.js`
- [ ] `generateClientFingerprint` - Zentralisieren
- [ ] `loadDailyUsage` - Zentralisieren in `dailyUsageLoader.js`
- [ ] Settings-Logik - Konsolidieren

### Wichtige Aufgaben (P1)

#### TypeScript Migration
- [ ] Alle `.js` → `.ts` migrieren
- [ ] TypeScript Schemas definieren
- [ ] JSDoc Comments ergänzen
- [ ] Type Safety überall

#### Svelte 5 Migration
- [ ] Stores → Runes
- [ ] Komponenten → Runes
- [ ] Reaktivität optimieren
- [ ] Performance verbessern

#### Performance
- [ ] API-Caching optimieren
- [ ] Lazy Loading implementieren
- [ ] Code Splitting optimieren
- [ ] Bundle Size reduzieren

### Optionale Aufgaben (P2)

#### Dokumentation
- [ ] API-Dokumentation
- [ ] Component-Dokumentation
- [ ] Migration Guide
- [ ] Best Practices Guide

#### Testing
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] Performance Tests

---

## 🔧 Technische Details

### Svelte 5 Migration Pattern

#### Stores
```typescript
// ❌ ALT (Svelte 3)
import { writable, derived } from 'svelte/store';
export const count = writable(0);
export const doubled = derived(count, $count => $count * 2);

// ✅ NEU (Svelte 5)
let count = $state(0);
export const doubled = $derived(count * 2);
```

#### Komponenten
```svelte
<!-- ❌ ALT (Svelte 3) -->
<script>
  export let title = 'Default';
  let count = 0;
  $: doubled = count * 2;
  $: console.log(count);
</script>

<!-- ✅ NEU (Svelte 5) -->
<script lang="ts">
  interface Props {
    title?: string;
  }
  
  let { title = 'Default' }: Props = $props();
  let count = $state(0);
  let doubled = $derived(count * 2);
  $effect(() => console.log(count));
</script>
```

### TypeScript Schema Pattern

```typescript
// src/types/Account.ts
export interface Account {
  userId: string;
  email: string;
  tier: 'free' | 'pro';
  profile: UserProfile;
  metadata: AccountMetadata;
  dailyUsage?: DailyUsage;
  createdAt: string;
  lastLogin: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
}

export interface AccountMetadata {
  settings?: UserSettings;
  usageHistory?: UsageEntry[];
  [key: string]: unknown;
}
```

### API-Call-Optimization Pattern

```typescript
// ❌ SCHLECHT: Doppelte API-Calls
async function login() {
  const account = await verifyMagicLink();
  await syncAccountData(); // Lädt Account neu!
  await initializeDailyUsage(); // Lädt Account neu!
}

// ✅ GUT: Daten weitergeben
async function login() {
  const account = await verifyMagicLink();
  await syncAccountData(account); // Verwendet vorhandene Daten
  await initializeDailyUsage(account); // Verwendet vorhandene Daten
}
```

---

## 📈 Erfolgs-Metriken

### Performance
- [ ] Bundle Size: < 500KB (aktuell: ~800KB)
- [ ] First Contentful Paint: < 1s
- [ ] Time to Interactive: < 2s
- [ ] Lighthouse Score: > 90

### Code-Qualität
- [ ] TypeScript Coverage: 100%
- [ ] Code Duplikation: < 5%
- [ ] API-Call-Duplikate: 0
- [ ] Linter Errors: 0

### Features
- [ ] Alle Features funktionieren
- [ ] Keine Breaking Changes
- [ ] Backward Compatibility
- [ ] Migration Guide vorhanden

---

## 🚨 Risiken & Mitigation

### Risiko 1: Breaking Changes
**Mitigation:** Schrittweise Migration, Tests nach jedem Schritt

### Risiko 2: Performance-Regression
**Mitigation:** Performance-Tests vor/nach Migration

### Risiko 3: TypeScript Errors
**Mitigation:** Schrittweise Migration, Type Safety Checks

### Risiko 4: Svelte 5 Kompatibilität
**Mitigation:** Svelte Migration Guide befolgen, Tests

---

## 📅 Timeline

| Phase | Dauer | Start | Ende |
|-------|-------|-------|------|
| Phase 1: Setup | 2-3 Tage | Woche 1 | Woche 1 |
| Phase 2: TypeScript | 5-7 Tage | Woche 2 | Woche 3 |
| Phase 3: Svelte 5 | 7-10 Tage | Woche 3 | Woche 5 |
| Phase 4: Konsolidierung | 5-7 Tage | Woche 5 | Woche 6 |
| Phase 5: Performance | 3-5 Tage | Woche 6 | Woche 7 |
| Phase 6: Automatisierung | 2-3 Tage | Woche 7 | Woche 7 |

**Gesamt:** ~4-5 Wochen

---

## ✅ Checkliste für v0.7.7 Release

### Vor Release
- [ ] Alle Tests bestehen
- [ ] TypeScript Errors: 0
- [ ] Linter Errors: 0
- [ ] Performance-Tests bestehen
- [ ] A11y-Tests bestehen
- [ ] Dokumentation aktualisiert
- [ ] Changelog erstellt
- [ ] Version aktualisiert

### Nach Release
- [ ] Monitoring aktiviert
- [ ] Error Tracking aktiviert
- [ ] Performance Monitoring
- [ ] User Feedback sammeln
- [ ] Hotfixes vorbereiten

---

## 📚 Ressourcen

### Dokumentation
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/migration-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [A11y Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- TypeScript Compiler
- Svelte Compiler
- ESLint
- Prettier
- Lighthouse

---

**Status:** 🟡 In Planung  
**Nächster Schritt:** Phase 1 starten  
**Verantwortlich:** Development Team

