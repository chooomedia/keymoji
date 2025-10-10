# Navigation Storage Issues Debug Guide

## 🔍 **Problem:**

"Irgendwas stimmt immer noch nicht wenn von /account auf / gewechselt wird - storage issues?"

---

## 🔬 **Systematische Debug-Schritte:**

### **Test 1: Stores Before & After Navigation**

**Browser Console (F12):**

```javascript
// BEFORE Navigation (auf /account)
console.log('=== BEFORE NAVIGATION (/account) ===');
console.log('currentAccount:', window.$currentAccount);
console.log('isLoggedIn:', window.$isLoggedIn);
console.log('userSettings:', window.$userSettings);
console.log('dailyLimit:', window.$dailyLimit);

// -> Navigate to / (Home)

// AFTER Navigation (auf /)
console.log('=== AFTER NAVIGATION (/) ===');
console.log('currentAccount:', window.$currentAccount);
console.log('isLoggedIn:', window.$isLoggedIn);
console.log('userSettings:', window.$userSettings);
console.log('dailyLimit:', window.$dailyLimit);
```

**Was du sehen solltest:**
- ✅ **Stores sollten GLEICH bleiben!**
- ❌ Wenn `null` oder `undefined` → PROBLEM GEFUNDEN!

---

### **Test 2: localStorage Persistence**

```javascript
console.log('=== LOCALSTORAGE ===');
console.log('Session:', localStorage.getItem('keymoji_user_session'));
console.log('Preferences:', localStorage.getItem('keymoji_user_preferences'));
console.log('Daily Usage:', localStorage.getItem('keymoji_daily_usage'));
```

**Was du sehen solltest:**
- ✅ **localStorage sollte IMMER da sein!**
- ❌ Wenn `null` → Wurde gelöscht! PROBLEM!

---

### **Test 3: Component Lifecycle**

**Console sollte zeigen:**

```
✅ AccountManager: Component mounted
→ Navigate to /
❌ AccountManager: Component unmounted (NORMAL!)
→ Index: Component mounted

Stores: Should persist! (nicht reset!)
```

---

## 🔍 **Mögliche Probleme:**

### **Problem 1: Stores werden auf null gesetzt**

**Checke in Code:**
```javascript
// src/stores/accountStore.js
currentAccount.set(null);  // ← Wird das irgendwo aufgerufen?
isLoggedIn.set(false);     // ← Wird das irgendwo aufgerufen?
```

**Sollte NUR beim Logout passieren!**
**NICHT beim Navigieren!**

---

### **Problem 2: localStorage wird gelöscht**

**Checke in Code:**
```javascript
localStorage.removeItem('keymoji_user_preferences');  // ← Wird das aufgerufen?
localStorage.clear();                                  // ← Wird das aufgerufen?
```

**Sollte NUR beim Logout passieren!**
**NICHT beim Navigieren!**

---

### **Problem 3: Component remount triggert Reset**

**Checke:**
- `onMount()` in Index.svelte
- `onMount()` in LanguageRouter.svelte
- Reactive blocks die Stores updaten

**Sollte:**
- Stores lesen ✓
- Stores NICHT resetten! ❌

---

## 🧪 **Debug Commands:**

### **Check 1: What resets currentAccount?**

```javascript
// Find all places that set currentAccount to null:
// Already done - found in accountStore.js:
// Line 1266: currentAccount.set(null);
// Line 837: localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);

// These should ONLY run on logout!
```

### **Check 2: What triggers on navigation?**

```javascript
// Watch for resets:
const originalSet = window.$currentAccount.set;
window.$currentAccount.set = function(value) {
    console.trace('🔍 currentAccount.set() called with:', value);
    return originalSet.call(this, value);
};

// Then navigate and see stack trace!
```

---

## ✅ **Expected Behavior:**

### **Normal Navigation (SHOULD happen):**

```
/account (logged in, data loaded)
  ↓
Navigate to /
  ↓
Index component mounts
AccountManager component unmounts (NORMAL!)
  ↓
Stores: Still populated ✓
localStorage: Still there ✓
User: Still logged in ✓
Data: Still available ✓
```

### **Wenn Stores reset werden (SHOULD NOT happen):**

```
/account (logged in, data loaded)
  ↓
Navigate to /
  ↓
??? Something calls currentAccount.set(null) ???
  ↓
Stores: Reset to null/undefined ❌
localStorage: Deleted ❌
User: Logged out ❌
Data: Lost ❌
```

---

## 🎯 **Next Steps:**

1. **Run Test 1** (stores before/after)
2. **Run Test 2** (localStorage)
3. **Post results here**
4. **I'll identify exact problem**
5. **I'll fix it**

---

## 💡 **Potential Fixes:**

### **If onMount() in Index.svelte resets:**

```javascript
// BAD:
onMount(() => {
    initializeAccountFromCookies();  // Might reset if API fails!
});

// GOOD:
onMount(() => {
    // Only init if not already logged in
    if (!get(isLoggedIn)) {
        initializeAccountFromCookies();
    }
});
```

### **If reactive block resets:**

```javascript
// BAD:
$: if (!$currentAccount) {
    // Reset everything!
    isLoggedIn.set(false);
}

// GOOD:
$: if (!$currentAccount && !hasValidSession()) {
    // Only reset if truly no session
    isLoggedIn.set(false);
}
```

---

**Created:** 2025-10-10  
**Priority:** HIGH  
**Status:** Need debug info from browser

