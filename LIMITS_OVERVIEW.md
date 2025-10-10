# Keymoji Daily Limits Overview

## 📊 Current Limits (v0.5.7)

| User Type | Daily Generations | Emoji Count (Default) | Emoji Count (Max) |
|-----------|-------------------|----------------------|-------------------|
| **GUEST** | 3/day             | 5                    | 5                 |
| **FREE**  | 9/day             | 9                    | 9                 |
| **PRO**   | 25/day            | 10                   | 10                |

---

## 🎯 Where Limits are Defined

### 1. Daily Generation Limits

```javascript
// src/config/limits.js
export const DAILY_LIMITS = {
    GUEST: 3,   // Not logged in
    FREE: 9,    // Logged in, free tier
    PRO: 25,    // Logged in, pro tier
    UNLIMITED: 999999
};
```

### 2. Emoji Count Defaults

```javascript
// src/utils/settingsValidation.js - getDefaultSettings()
const baseSettings = {
    emojiCount: 9  // FREE users
};

if (tier === 'pro') {
    return {
        ...baseSettings,
        emojiCount: 10  // PRO users get max
    };
}
```

### 3. Component Defaults

```javascript
// src/components/Core/EmojiDisplay.svelte
let emojiCount = 9;  // Default for all users

// src/data/userSettings.json
{
    "id": "emojiCount",
    "min": 3,
    "max": 10,
    "defaultValue": 9
}
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────┐
│         App Start (LanguageRouter.svelte)       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ initializeDailyUsage()│
        └──────────┬─────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌────────┐          ┌──────────────┐
   │  API   │          │ localStorage │
   │ (if    │          │ (fallback)   │
   │ logged │          └──────┬───────┘
   │ in)    │                 │
   └────┬───┘                 │
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ getDailyLimitForUser()│
        │ Returns:              │
        │ - GUEST: 3            │
        │ - FREE: 9             │
        │ - PRO: 25             │
        └──────────┬─────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ dailyLimit.set()     │
        │ { limit, used }      │
        └──────────┬─────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ UI Updates:          │
        │ - Header Badge       │
        │ - EmojiDisplay       │
        │ - AccountManager     │
        └──────────────────────┘
```

---

## 🏷️ Header Badge Display

```javascript
// src/components/Layout/Header.svelte
$: remaining = $dailyLimit.limit - $dailyLimit.used;

{#if showBadge}
    <button class="badge">
        {#if isProUser}
            ∞                    // PRO: Unlimited (∞)
        {:else if remaining > 0}
            {remaining}          // FREE: 9, 8, 7... 1 (yellow)
        {:else}
            💎                   // FREE: 0 (yellow, pulsing)
        {/if}
    </button>
{/if}
```

**Badge Colors:**
- **Yellow** (`bg-yellow-500`): FREE users (9 → 0)
- **Purple** (`bg-purple-500`): PRO users (∞)
- **Pulsing**: When limit reached (0 remaining)

---

## 📦 Database Storage

### Google Sheets Structure

```json
{
    "profile": {
        "name": "John Doe",
        "dailyUsage": {
            "date": "2025-10-10",
            "used": 3,
            "limit": 9,
            "lastReset": "2025-10-10",
            "lastIncrement": "2025-10-10T12:34:56.789Z"
        }
    },
    "metadata": {
        "dailyUsage": {
            "date": "2025-10-10",
            "used": 3,
            "limit": 9,
            "lastReset": "2025-10-10",
            "lastIncrement": "2025-10-10T12:34:56.789Z"
        }
    }
}
```

**Why Both?**
- `profile.dailyUsage`: Primary, easy n8n workflow access
- `metadata.dailyUsage`: Backward compatibility

---

## ⚙️ Validation & Sanitization

```javascript
// src/utils/settingsValidation.js

// Validation (FREE)
if (tier === 'free' && settings.emojiCount > 9) {
    errors.push('emojiCount limited to 9 for free tier');
}

// Sanitization (FREE)
if (tier === 'free') {
    if (sanitized.emojiCount && sanitized.emojiCount > 9) {
        sanitized.emojiCount = 9;  // Auto-cap at 9
    }
}

// Defaults
FREE: { emojiCount: 9 }
PRO:  { emojiCount: 10 }
```

---

## 🧪 Testing

```javascript
// Browser Console (Development only)

// Display current state
window.keymojiDailyUsageDebug.debug();

// Test increment
await window.keymojiDailyUsageDebug.testIncrement();

// Test reset
await window.keymojiDailyUsageDebug.testReset();

// Check consistency
window.keymojiDailyUsageDebug.checkConsistency();

// Run all tests
await window.keymojiDailyUsageDebug.runAll();
```

---

## 🔍 Common Issues & Solutions

### Issue: Badge not showing
**Solution:** Check `$isLoggedIn` store - badge only shows when logged in

### Issue: Wrong limit displayed (shows 5 instead of 9)
**Solution:** 
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Check `getDailyLimitForUser()` return value

### Issue: Limit not persisting after reload
**Solution:**
1. Check API call in Network tab
2. Verify Google Sheets has `dailyUsage` in profile
3. Check localStorage has `keymoji_daily_usage`

### Issue: Guest shows wrong limit
**Solution:** Guest should always show 3, regardless of localStorage

---

## 📈 Migration from Old System

### Before (v0.5.6)
```javascript
// Hardcoded in multiple places
const GUEST_LIMIT = 3;
const FREE_LIMIT = 5;  // OLD
const PRO_LIMIT = 25;

// Only in localStorage
localStorage.setItem('keymoji_daily_request_count', count);
```

### After (v0.5.7)
```javascript
// Single source in limits.js
export const DAILY_LIMITS = {
    GUEST: 3,
    FREE: 9,   // NEW
    PRO: 25
};

// Centralized store + API + localStorage
await initializeDailyUsage();  // Priority: API > localStorage > defaults
await incrementDailyUsage();   // Updates: store → localStorage → API
```

---

## ✅ Implementation Checklist

- [x] Update DAILY_LIMITS.FREE to 9
- [x] Update DEFAULT_FREE_SETTINGS.emojiCount to 9
- [x] Update DEFAULT_PRO_SETTINGS.emojiCount to 10
- [x] Update EmojiDisplay default emojiCount to 9
- [x] Update userSettings.json defaultValue to 9
- [x] Update settingsValidation.js (max 9 for FREE)
- [x] Update test-limits.js test cases
- [x] Create dailyUsageStore.js with API sync
- [x] Integrate in LanguageRouter.svelte on mount
- [x] Remove duplicate calls in EmojiDisplay
- [x] Remove duplicate calls in AccountManager
- [x] Add Header badge with reactive display
- [x] Add debug tools (dailyUsageDebug.js)
- [x] Update documentation (DAILY_USAGE_ARCHITECTURE.md)
- [x] Test with different user tiers

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

1. **Frontend:**
   - ✅ Limits updated in all files
   - ✅ Default values consistent
   - ✅ Badge displays correctly
   - ✅ Debug tools available in dev

2. **Backend:**
   - ⚠️ Verify n8n workflow handles `profile.dailyUsage`
   - ⚠️ Verify n8n workflow handles `metadata.dailyUsage`
   - ⚠️ Test API endpoints return correct data

3. **Database:**
   - ⚠️ Google Sheets: Add `dailyUsage` to profile column (if not exists)
   - ⚠️ Verify existing accounts have correct limits

---

**Version:** 0.5.7  
**Last Updated:** 2025-10-10  
**Author:** Chris Matt (C. Matt)

