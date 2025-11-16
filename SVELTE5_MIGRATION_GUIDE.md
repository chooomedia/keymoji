# 🚀 Svelte 5 Migration Guide

**Version:** 0.7.7  
**Ziel:** Migration von Svelte 3.59.2 → Svelte 5.x mit Runes  
**Status:** 📋 Vorbereitung

---

## 📊 Aktueller Stand

- **Svelte Version:** 3.59.2
- **Ziel Version:** 5.43.7 (latest)
- **Breaking Changes:** Ja (Runes, neue Syntax)
- **Kompatibilität:** Svelte 3 Code funktioniert weiterhin, aber Runes sind empfohlen

---

## 🔄 Hauptänderungen in Svelte 5

### 1. Runes statt Stores
**Alt (Svelte 3):**
```javascript
import { writable, readable, derived } from 'svelte/store';
const count = writable(0);
const doubled = derived(count, $count => $count * 2);
```

**Neu (Svelte 5):**
```javascript
let count = $state(0);
let doubled = $derived(count * 2);
```

### 2. Props Syntax
**Alt (Svelte 3):**
```svelte
<script>
  export let title = 'Default';
</script>
```

**Neu (Svelte 5):**
```svelte
<script>
  let { title = 'Default' } = $props();
</script>
```

### 3. Reactive Statements
**Alt (Svelte 3):**
```svelte
$: doubled = count * 2;
$: {
  console.log('Count changed:', count);
}
```

**Neu (Svelte 5):**
```svelte
let doubled = $derived(count * 2);
$effect(() => {
  console.log('Count changed:', count);
});
```

### 4. Component Events
**Alt (Svelte 3):**
```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  dispatch('click', data);
</script>
```

**Neu (Svelte 5):**
```svelte
<script>
  let { onclick } = $props();
  onclick?.(data);
</script>
```

---

## 📋 Migration Checkliste

### Phase 1: Vorbereitung ✅
- [x] Migration Guide studieren
- [x] Breaking Changes identifizieren
- [ ] Test-Umgebung vorbereiten
- [ ] Backup erstellen

### Phase 2: Dependencies
- [ ] `svelte` auf 5.x aktualisieren
- [ ] `svelte-loader` kompatibel prüfen
- [ ] `svelte-preprocess` aktualisieren (falls nötig)
- [ ] Alle Dependencies testen

### Phase 3: Stores Migration
- [ ] `appStores.js` → Runes
- [ ] `accountStore.js` → Runes
- [ ] `userSettingsStore.js` → Runes
- [ ] `contentStore.js` → Runes
- [ ] `modalStore.js` → Runes
- [ ] `dailyUsageStore.js` → Runes
- [ ] `userDataStore.js` → Runes
- [ ] `seoStore.js` → Runes

### Phase 4: Komponenten Migration
- [ ] Props Syntax (`export let` → `$props()`)
- [ ] Reactive Statements (`$:` → `$derived` / `$effect`)
- [ ] Event Dispatchers (`createEventDispatcher` → Props)
- [ ] Store Subscriptions (`$store` → `$state`)

### Phase 5: Testing
- [ ] Alle Komponenten testen
- [ ] Alle Stores testen
- [ ] E2E Tests durchführen
- [ ] Performance prüfen

---

## 🔍 Identifizierte Stores

### Stores die migriert werden müssen:

1. **appStores.js**
   - `darkMode` (writable)
   - `isLoggedIn` (writable)
   - `currentAccount` (writable)
   - `accountTier` (writable)
   - `userCounter` (writable)
   - `isModalVisible` (writable)
   - `currentLanguage` (writable)

2. **accountStore.js**
   - Komplexe Store-Logik
   - Viele Funktionen die Stores verwenden

3. **userSettingsStore.js**
   - `userSettings` (writable)
   - Komplexe Settings-Logik

4. **contentStore.js**
   - `currentLanguage` (writable)
   - `translations` (readable/derived)

5. **modalStore.js**
   - `isModalVisible` (writable)
   - Modal Queue Management

6. **dailyUsageStore.js**
   - `dailyLimit` (writable)
   - `usageStatus` (writable)

7. **userDataStore.js**
   - `usageHistory` (writable)
   - `userData` (writable)

8. **seoStore.js**
   - SEO Store-Logik

---

## 🎯 Migration Strategie

### Schritt 1: Stores zu Runes
```javascript
// Alt
import { writable } from 'svelte/store';
export const count = writable(0);

// Neu
let count = $state(0);
export { count };
```

### Schritt 2: Derived Stores
```javascript
// Alt
import { derived } from 'svelte/store';
export const doubled = derived(count, $count => $count * 2);

// Neu
let doubled = $derived(count * 2);
export { doubled };
```

### Schritt 3: Komponenten Props
```svelte
<!-- Alt -->
<script>
  export let title = 'Default';
</script>

<!-- Neu -->
<script>
  let { title = 'Default' } = $props();
</script>
```

### Schritt 4: Reactive Statements
```svelte
<!-- Alt -->
<script>
  $: doubled = count * 2;
  $: console.log('Count:', count);
</script>

<!-- Neu -->
<script>
  let doubled = $derived(count * 2);
  $effect(() => {
    console.log('Count:', count);
  });
</script>
```

---

## ⚠️ Breaking Changes

### 1. Store Subscriptions
**Alt:**
```javascript
import { get } from 'svelte/store';
const value = get(store);
```

**Neu:**
```javascript
// Direkter Zugriff (kein get() nötig)
const value = store;
```

### 2. Component Props
**Alt:**
```svelte
export let prop;
```

**Neu:**
```svelte
let { prop } = $props();
```

### 3. Reactive Statements
**Alt:**
```svelte
$: if (condition) {
  // code
}
```

**Neu:**
```svelte
$effect(() => {
  if (condition) {
    // code
  }
});
```

---

## 🚀 Migration Tools

### Offizielles Migrations-Tool
```bash
npx sv migrate svelte-5
```

### Manuelle Migration
1. Store-Dateien identifizieren
2. `writable` → `$state`
3. `derived` → `$derived`
4. `$:` → `$effect` oder `$derived`
5. `export let` → `$props()`
6. `createEventDispatcher` → Props

---

## 📚 Ressourcen

- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/runes)
- [Svelte 5 Breaking Changes](https://svelte.dev/docs/svelte/v5-migration-guide#breaking-changes)

---

## ⏱️ Geschätzter Aufwand

- **Stores Migration:** 2-3 Tage
- **Komponenten Migration:** 5-7 Tage
- **Testing & Bugfixes:** 2-3 Tage
- **Gesamt:** ~10-13 Tage

---

## 🎯 Nächste Schritte

1. ⏭️ Svelte 5 Dependencies aktualisieren
2. ⏭️ Migrations-Tool ausführen
3. ⏭️ Stores manuell migrieren (beginnend mit appStores.js)
4. ⏭️ Komponenten schrittweise migrieren
5. ⏭️ Tests durchführen

---

**Status:** 📋 Vorbereitung abgeschlossen  
**Nächster Schritt:** Dependencies aktualisieren und Migration starten

