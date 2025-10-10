# UserSettings Data-Handling Refactoring Plan

## 🎯 **ZIEL**

Sauberes, robustes, sicheres und konsistentes Data-Handling für UserSettings.

---

## ❌ **AKTUELLE PROBLEME**

### 1. **Data-Redundanz (Doubletten)**

```javascript
// PROBLEM: Gleiche Daten in 4+ Stores!
userSettings store          → settings
currentAccount store        → settings
accountSettings store       → settings
currentSettings store       → Alias! (doppelt!)
pendingChanges store        → temporary changes
```

### 2. **Inkonsistente Single Source of Truth**

```javascript
// PROBLEM: Name kommt von 4 Stellen!
getCurrentValue('name'):
  1. pendingChanges.name         (typing)
  2. currentAccount.name         (after save)
  3. currentAccount.profile.name (nested!)
  4. userSettings.name           (local)
→ WELCHE IST RICHTIG?!
```

### 3. **Problematische Data Flows**

```
localStorage ← → userSettings ← → pendingChanges
     ↓                ↓                  ↓
  Cookies    ← → currentAccount ← → Backend API
     ↓                ↓                  ↓
   DOM           accountSettings    Google Sheets

→ KEINE KLARE SYNC-STRATEGIE!
→ RACE CONDITIONS!
→ DATA INCONSISTENCIES!
```

### 4. **Direct Storage Access (Bypassing Stores)**

```javascript
// PROBLEM: 5x localStorage direct access in UserSettings.svelte!
localStorage.getItem(...)
localStorage.setItem(...)
→ Umgeht Store-System!
→ Keine Reactivity!
```

### 5. **Aliasing (currentSettings = accountSettings)**

```javascript
// appStores.js:
export const accountSettings = writable({});
export const currentSettings = writable({}); // Alias!

// PROBLEM: Zwei Stores für gleiche Daten!
→ Welche updaten?
→ Sync zwischen beiden?
```

---

## ✅ **CLEAN ARCHITECTURE LÖSUNG**

### **Single Source of Truth Pattern:**

```
┌─────────────────────────────────────────┐
│  Backend (Google Sheets via n8n)       │
│  - currentAccount.metadata.settings     │
│  - currentAccount.profile               │
└─────────────────┬───────────────────────┘
                  │ READ on login/session restore
                  ↓
┌─────────────────────────────────────────┐
│  PRIMARY STORE: currentAccount          │
│  ✓ Single Source of Truth               │
│  ✓ Parsed JSON from backend             │
│  ✓ Contains ALL user data               │
└─────────────────┬───────────────────────┘
                  │ SYNC (one-way!)
                  ↓
┌─────────────────────────────────────────┐
│  DERIVED STORE: userSettings            │
│  ✓ Computed from currentAccount         │
│  ✓ Tier-aware defaults                  │
│  ✓ Reactive to account changes          │
└─────────────────┬───────────────────────┘
                  │ CACHE (performance!)
                  ↓
┌─────────────────────────────────────────┐
│  localStorage                           │
│  ✓ Cache for offline/fast load          │
│  ✓ Read-only for UI                     │
│  ✓ Updated via stores only!             │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  TEMPORARY: pendingChanges              │
│  ✓ Only for unsaved edits               │
│  ✓ Cleared after save                   │
│  ✓ Never persisted                      │
└─────────────────────────────────────────┘
```

---

## 🔧 **REFACTORING STEPS**

### **Step 1: Remove Duplicate Stores**

```javascript
// ❌ REMOVE:
export const accountSettings = writable({});
export const currentSettings = writable({}); // Alias!

// ✅ KEEP ONLY:
export const userSettings = derived(currentAccount, $currentAccount => {
    // Derive settings from currentAccount!
    return extractSettings($currentAccount);
});
```

### **Step 2: Centralize Data Access**

```javascript
// ❌ BEFORE: 4 sources for name
getCurrentValue('name'):
  pendingChanges.name ||
  currentAccount.name ||
  currentAccount.profile.name ||
  userSettings.name

// ✅ AFTER: 1 source + 1 override
getCurrentValue('name'):
  pendingChanges.name ||           // Typing (temporary)
  currentAccount.profile.name      // Single source!
```

### **Step 3: One-Way Data Flow**

```javascript
// READ:
Backend → currentAccount → userSettings → UI

// WRITE:
UI → pendingChanges → SAVE → Backend → currentAccount → userSettings → UI
                              (sync back!)
```

### **Step 4: Remove Direct localStorage Access**

```javascript
// ❌ BEFORE:
localStorage.setItem('key', value);

// ✅ AFTER:
storageHelpers.set(STORAGE_KEYS.KEY, value);
// OR better: Let store handle it!
userSettings.set(value); // Store syncs to localStorage
```

### **Step 5: Consistent Save Flow**

```javascript
async function saveSettings() {
    // 1. Get pending changes
    const changes = get(pendingChanges);

    // 2. Merge with current account
    const updated = {
        ...get(currentAccount),
        profile: {
            ...get(currentAccount).profile,
            ...changes
        }
    };

    // 3. Save to backend
    await updateAccountAPI(updated);

    // 4. Update currentAccount (triggers userSettings!)
    currentAccount.set(updated);

    // 5. Clear pending
    pendingChanges.set({});

    // 6. localStorage auto-syncs via store subscription!
}
```

---

## 📊 **BENEFITS**

### **Before (Messy):**

```
userSettings ← → localStorage
     ↓               ↓
currentAccount ← → Cookies
     ↓               ↓
accountSettings → Backend
     ↓
currentSettings (alias!)

→ 5 data sources!
→ Race conditions!
→ Inconsistencies!
```

### **After (Clean):**

```
Backend
   ↓
currentAccount (Single Source!)
   ↓
userSettings (Derived!)
   ↓
localStorage (Cache!)
   ↓
UI (Read-only!)

→ 1 source of truth!
→ No race conditions!
→ Consistent!
```

---

## 🚀 **IMPLEMENTATION**

### **Phase 1: Cleanup Stores**

-   [ ] Remove `accountSettings` store
-   [ ] Remove `currentSettings` alias
-   [ ] Make `userSettings` derived from `currentAccount`
-   [ ] Remove direct localStorage access

### **Phase 2: Centralize Data Access**

-   [ ] Simplify `getCurrentValue()` to 1 source + 1 override
-   [ ] Remove redundant data checks
-   [ ] Consistent field access (e.g., always `profile.name`)

### **Phase 3: One-Way Data Flow**

-   [ ] Read: Backend → currentAccount → UI
-   [ ] Write: UI → pendingChanges → Backend → currentAccount → UI
-   [ ] localStorage as cache ONLY (via store subscription)

### **Phase 4: Testing**

-   [ ] Settings load correctly on login
-   [ ] Settings save correctly to backend
-   [ ] localStorage syncs automatically
-   [ ] No race conditions on page reload
-   [ ] Pending changes work correctly

---

## ✅ **VERIFICATION**

After refactoring, should have:

```javascript
// Simple, clean data access:
$: userName = $currentAccount?.profile?.name || '';
$: userTheme = $currentAccount?.metadata?.settings?.theme || 'light';
$: userLanguage = $currentAccount?.metadata?.settings?.language || 'de';

// With pending changes override:
$: displayName = $pendingChanges.name || userName;
```

**Single source of truth!**  
**No doubletten!**  
**No inconsistencies!**  
**Clean & Robust!** ✓

---

**Status:** Plan created, ready for implementation  
**Complexity:** High (touches many files)  
**Impact:** Major improvement in data consistency  
**Risk:** Medium (careful testing needed)
