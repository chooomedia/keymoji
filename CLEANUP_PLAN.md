# Complete System Cleanup Plan - Von Außen nach Innen

## 🎯 **Ziel:**

Systematische Optimierung und Aufräumen des gesamten Data Flows von außen (LanguageRouter) nach innen (Components).

---

## 📋 **PROBLEMS IDENTIFIED:**

1. ❌ **SVG Chart wird nicht angezeigt** (trotz onMount fix)
2. ❌ **Language parts in modals nicht konsistent**
3. ⚠️ **Data Flow möglicherweise inkonsistent**
4. ⚠️ **Imports/Exports könnten optimiert werden**

---

## 🔄 **CLEANUP LAYERS (Von Außen nach Innen):**

### **Layer 1: LanguageRouter (Äußerste Schicht) 🌐**

**Files:**

-   `src/routes/LanguageRouter.svelte`
-   `src/stores/contentStore.js`

**Checks:**

-   ✅ Language initialization
-   ✅ Route handling
-   ✅ Store initialization order
-   ✅ Component mounting lifecycle
-   ⚠️ Multiple initializeAccountFromCookies() calls?

**Potential Issues:**

-   Language store might not be ready when modals render
-   Account initialization might run multiple times
-   Race conditions on app start

---

### **Layer 2: Stores (Data Layer) 📦**

**Files:**

-   `src/stores/accountStore.js`
-   `src/stores/userSettingsStore.js`
-   `src/stores/dailyUsageStore.js`
-   `src/stores/contentStore.js`
-   `src/stores/modalStore.js`

**Checks:**

-   ✅ Store initialization order
-   ✅ Data persistence (localStorage vs API)
-   ✅ Race conditions
-   ✅ Circular dependencies
-   ✅ Consistent data structure

**Potential Issues:**

-   accountStore might be loading before contentStore
-   userSettings might not sync with language changes
-   dailyUsage might reset incorrectly
-   Modal translations might use wrong language

---

### **Layer 3: AccountManager (Main Component) 🏠**

**Files:**

-   `src/routes/AccountManager.svelte`

**Checks:**

-   ✅ Component lifecycle (onMount, onDestroy)
-   ✅ Reactive statements order
-   ✅ Data loading sequence
-   ✅ Chart initialization
-   ✅ Settings initialization
-   ✅ Translation usage

**Potential Issues:**

-   onMount might run before stores are ready
-   Reactive blocks might have wrong dependencies
-   Chart data might not be available when component renders
-   Settings might load in wrong order

---

### **Layer 4: Chart Data Flow 📊**

**Files:**

-   `src/components/UI/LineChart.svelte`
-   `src/utils/usageHistoryHelpers.js`
-   `src/utils/usageHistoryLoader.js`

**Checks:**

-   ✅ Data extraction from currentAccount
-   ✅ Data transformation for chart
-   ✅ SVG rendering
-   ✅ Responsive behavior
-   ✅ Dark mode compatibility

**Potential Issues:**

-   usageHistory might be undefined
-   Data format might be incorrect
-   SVG might not render if data is empty array
-   Chart component might mount before data is ready

---

### **Layer 5: Modal System 💬**

**Files:**

-   `src/stores/modalStore.js`
-   Components using modals

**Checks:**

-   ✅ Modal content structure
-   ✅ Translation loading
-   ✅ Language switching
-   ✅ Content reactivity

**Potential Issues:**

-   Modal content might use static text instead of translations
-   Translations might not update when language changes
-   Modal might cache old translations

---

## 🔧 **SYSTEMATIC FIXES:**

### **Priority 1: SVG Chart (CRITICAL)**

1. **Check Data Availability:**

    ```javascript
    // In browser console:
    console.log('usageHistory:', window.usageHistory);
    console.log('usageChartData:', window.usageChartData);
    console.log('currentAccount.metadata:', window.$currentAccount?.metadata);
    ```

2. **Check Component Rendering:**

    ```javascript
    // In browser console:
    console.log('SVG in DOM:', document.querySelectorAll('svg').length);
    console.log('Chart container:', document.querySelector('[class*="chart"]'));
    ```

3. **Force Data Injection:**

    ```javascript
    window.chartDebugger.injectTestData();
    location.reload();
    ```

4. **Potential Fixes:**
    - Ensure usageHistory is loaded BEFORE chart component renders
    - Add loading state to prevent rendering empty chart
    - Add fallback data if usageHistory is empty
    - Ensure SVG has minimum height/width

---

### **Priority 2: Language Consistency (HIGH)**

1. **Check Translation Loading:**

    ```javascript
    // In browser console:
    console.log('Current language:', window.$currentLanguage);
    console.log('Translations:', window.$translations);
    console.log('Modal content:', window.$translations?.modals);
    ```

2. **Check Modal Content:**

    - Ensure modals use `$translations` reactive store
    - Ensure modals re-render on language change
    - Check if modal content is hardcoded

3. **Potential Fixes:**
    - Replace hardcoded strings with `$translations`
    - Ensure modal store subscribes to language changes
    - Force modal re-render on language change

---

### **Priority 3: Data Flow Optimization (MEDIUM)**

1. **Initialization Order:**

    ```
    1. LanguageRouter mounts
    2. contentStore initializes (language)
    3. accountStore initializes (user data)
    4. dailyUsageStore initializes (usage data)
    5. userSettingsStore initializes (settings)
    6. Components mount
    7. Data loads
    8. UI renders
    ```

2. **Ensure Sequential Loading:**

    - Add loading flags
    - Use async/await properly
    - Prevent race conditions
    - Add retry mechanisms

3. **Potential Fixes:**
    - Add global loading state
    - Ensure stores load in correct order
    - Add dependencies between stores
    - Use onMount correctly in all components

---

## 📝 **STEP-BY-STEP EXECUTION:**

### **Step 1: Diagnose Chart Issue**

-   Run debug commands
-   Check console logs
-   Identify root cause
-   Document findings

### **Step 2: Fix Chart Data Flow**

-   Ensure usageHistory is available
-   Fix data loading sequence
-   Add loading states
-   Test chart rendering

### **Step 3: Fix Language Consistency**

-   Audit all modal content
-   Replace hardcoded strings
-   Ensure reactive translations
-   Test language switching

### **Step 4: Optimize Store Initialization**

-   Review initialization order
-   Add sequential loading
-   Fix race conditions
-   Test on fresh page load

### **Step 5: Clean Up Imports/Exports**

-   Remove unused imports
-   Organize imports by category
-   Use named exports consistently
-   Add JSDoc comments

---

## 🧪 **TESTING CHECKLIST:**

### **Chart Testing:**

-   [ ] Chart renders on first visit to /account
-   [ ] Chart persists on navigation (Home → Account → Home → Account)
-   [ ] Chart updates on time period change (7d, 14d, 4w, 3M)
-   [ ] Chart shows correct data
-   [ ] Chart responsive (light/dark mode)
-   [ ] Chart shows skeleton while loading
-   [ ] Chart shows error state if data fails

### **Language Testing:**

-   [ ] Language switches correctly (DE ↔ EN)
-   [ ] Modals show correct language
-   [ ] Modal content updates on language change
-   [ ] All UI elements use correct language
-   [ ] No hardcoded strings visible
-   [ ] Language persists on reload

### **Navigation Testing:**

-   [ ] Data persists on route change
-   [ ] Stores don't reset on navigation
-   [ ] User settings remain visible
-   [ ] Account data remains visible
-   [ ] No flash of empty content

---

## 📦 **EXPECTED OUTCOME:**

After cleanup:

-   ✅ SVG Chart always visible (if data available)
-   ✅ Consistent language in all UI elements
-   ✅ Smooth data flow without race conditions
-   ✅ Optimized imports/exports
-   ✅ Clean, maintainable code
-   ✅ Robust error handling
-   ✅ Comprehensive debug logging

---

**Created:** 2025-10-10  
**Status:** In Progress 🚧  
**Next:** Run diagnostics and identify root causes
