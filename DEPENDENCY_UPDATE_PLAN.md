# 📦 Dependency Update Plan
## Schrittweise Aktualisierung der Dependencies für v0.7.7

**Datum:** 2025-01-XX  
**Status:** In Planung

---

## 🎯 Strategie

**Vorsichtige, schrittweise Migration:**
1. ✅ TypeScript Setup (ohne Breaking Changes)
2. ⏭️ Minor/Patch Updates (sicher)
3. ⏭️ Svelte 5 Migration (Major - separate Phase)
4. ⏭️ Tailwind CSS 3 Migration (Major - separate Phase)

---

## ✅ Phase 1: TypeScript Setup (JETZT)

### Neue Dependencies hinzufügen:
```json
"devDependencies": {
  "typescript": "^5.7.3",
  "ts-loader": "^9.5.1",
  "@types/node": "^22.10.5"
}
```

**Status:** ✅ Bereit zum Installieren

---

## ⏭️ Phase 2: Minor/Patch Updates (Sicher)

### Sicher zu updaten (Minor/Patch):
- `@babel/cli`: ^7.12.1 → ^7.28.3
- `@babel/core`: ^7.14.3 → ^7.28.5
- `@babel/preset-env`: ^7.14.2 → ^7.28.5
- `autoprefixer`: ^10.4.20 → ^10.4.22
- `html-webpack-plugin`: ^5.3.1 → ^5.6.4
- `webpack`: ^5.88.2 → ^5.102.1
- `dotenv`: ^16.3.1 → ^16.6.1

**Status:** ⏭️ Nach TypeScript Setup

---

## ⚠️ Phase 3: Major Updates (Separate Migration)

### Svelte 3 → 5 Migration
- `svelte`: ^3.59.2 → ^5.43.7
- `svelte-preprocess`: ^4.7.3 → ^6.0.3
- `svelte-loader`: ^3.2.4 → ^5.x (kompatibel mit Svelte 5)

**Breaking Changes:**
- Runes statt Stores
- Props Syntax ändert sich
- Reactive Statements ändern sich

**Status:** ⏭️ Separate Migration Phase (Phase 3 im Refactor Plan)

---

### Tailwind CSS 2 → 3 Migration
- `tailwindcss`: ^2.2.19 → ^4.1.17

**Breaking Changes:**
- JIT Mode ist jetzt Standard
- Config Format ändert sich leicht
- PurgeCSS ist jetzt integriert

**Status:** ⏭️ Separate Migration Phase (Phase 1 im Refactor Plan)

---

## 📋 Aktionsplan

### Schritt 1: TypeScript installieren (JETZT)
```bash
npm install --save-dev typescript@^5.7.3 ts-loader@^9.5.1 @types/node@^22.10.5
```

### Schritt 2: Minor Updates (Nach TypeScript)
```bash
npm update @babel/cli @babel/core @babel/preset-env autoprefixer html-webpack-plugin webpack dotenv
```

### Schritt 3: Svelte 5 Migration (Später)
- Separate Phase im Refactor Plan
- Umfangreiche Tests erforderlich

### Schritt 4: Tailwind CSS 3 Migration (Später)
- Separate Phase im Refactor Plan
- Config anpassen erforderlich

---

## ⚠️ WICHTIG: Nicht updaten (noch nicht)

### Major Updates - Später:
- ❌ `svelte`: 3.59.2 → 5.43.7 (Major Breaking Changes!)
- ❌ `tailwindcss`: 2.2.19 → 4.1.17 (Major Breaking Changes!)
- ❌ `babel-loader`: 8.4.1 → 10.0.0 (Major - könnte Probleme machen)
- ❌ `copy-webpack-plugin`: 6.4.1 → 13.0.1 (Major - Breaking Changes)
- ❌ `css-loader`: 5.2.7 → 7.1.2 (Major - Breaking Changes)
- ❌ `css-minimizer-webpack-plugin`: 3.4.1 → 7.0.2 (Major)
- ❌ `cssnano`: 5.1.15 → 7.1.2 (Major)
- ❌ `mini-css-extract-plugin`: 1.6.2 → 2.9.4 (Major)
- ❌ `postcss-loader`: 5.3.0 → 8.2.0 (Major)
- ❌ `style-loader`: 2.0.0 → 4.0.0 (Major)
- ❌ `webpack-cli`: 5.1.4 → 6.0.1 (Major)
- ❌ `webpack-merge`: 5.10.0 → 6.0.1 (Major)
- ❌ `web-vitals`: 3.5.0 → 5.1.0 (Major)

**Grund:** Diese Updates erfordern umfangreiche Tests und Anpassungen. Werden separat behandelt.

---

## ✅ Checkliste

- [x] TypeScript Setup vorbereitet (tsconfig.json, webpack config)
- [ ] TypeScript Dependencies installieren
- [ ] Minor Updates durchführen
- [ ] Tests nach Updates
- [ ] Svelte 5 Migration planen
- [ ] Tailwind CSS 3 Migration planen

---

**Nächster Schritt:** TypeScript Dependencies installieren

