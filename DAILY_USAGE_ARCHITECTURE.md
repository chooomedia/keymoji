# Daily Usage Tracking Architecture

## 🎯 Überblick

Das Daily Usage Tracking System verwaltet tägliche Generierungslimits mit **Datenbank-Persistenz** (Google Sheets via n8n) und localStorage als Fallback.

---

## 📊 Datenfluss

```
┌─────────────────────────────────────────────────────────────┐
│                     USER ACTION                              │
│           (Login / Story Generation / Page Load)            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              dailyUsageStore.js                              │
│  Priority: API > localStorage > Default                     │
└─────────────┬─────────────────────┬─────────────────────────┘
              │                     │
              ▼                     ▼
  ┌─────────────────────┐   ┌─────────────────────┐
  │   Google Sheets      │   │   localStorage      │
  │   (Primary Source)   │   │   (Fallback Cache)  │
  │                      │   │                      │
  │  metadata.dailyUsage │   │  keymoji_daily_usage│
  │  {                   │   │  {                   │
  │    date,             │   │    date,             │
  │    used,             │   │    used,             │
  │    limit,            │   │    limit,            │
  │    lastReset,        │   │    lastReset,        │
  │    lastIncrement     │   │    lastIncrement     │
  │  }                   │   │  }                   │
  └─────────────────────┘   └─────────────────────┘
              │                     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Svelte Stores      │
              │                      │
              │  dailyLimit: {       │
              │    limit: 5,         │
              │    used: 2           │
              │  }                   │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    UI Components     │
              │                      │
              │  - Header Badge      │
              │  - EmojiDisplay      │
              │  - AccountManager    │
              └─────────────────────┘
```

---

## 🗄️ Datenstruktur

### Google Sheets (metadata.dailyUsage)

```json
{
  "date": "2025-10-10",
  "used": 3,
  "limit": 5,
  "lastReset": "2025-10-10",
  "lastIncrement": "2025-10-10T12:34:56.789Z"
}
```

### localStorage (keymoji_daily_usage)

```json
{
  "date": "2025-10-10",
  "used": 3,
  "limit": 5,
  "lastReset": "2025-10-10"
}
```

---

## 🔄 Funktionsweise

### 1. **Initialisierung (Priority: API > localStorage > Default)**

```javascript
// Login / Page Load
await initializeDailyUsage();

// Priority 1: Load from API (if logged in)
const usageData = await loadUsageFromAPI(account);

// Priority 2: Load from localStorage (fallback)
if (!usageData) {
  usageData = getUsageFromLocalStorage();
}

// Priority 3: Create default
if (!usageData) {
  usageData = {
    date: getTodayDateString(),
    used: 0,
    limit: getDailyLimitForUser(loggedIn, tier)
  };
}

// Check if new day → Auto-reset
if (shouldResetUsage(usageData.lastReset)) {
  usageData = resetUsageData();
  await saveUsageToAPI(account, usageData);
}

// Update stores
updateDailyLimitStore(usageData);
saveUsageToLocalStorage(usageData);
```

### 2. **Inkrement (Optimistic Update + Background Sync)**

```javascript
// After successful story generation
await incrementDailyUsage();

// 1. Increment counter
const newUsed = currentLimit.used + 1;

// 2. Optimistic update (immediate UI feedback)
updateDailyLimitStore({ used: newUsed, limit });
saveUsageToLocalStorage({ used: newUsed, limit });

// 3. Background sync to API (fire-and-forget)
saveUsageToAPI(account, usageData).catch(error => {
  console.warn('⚠️ API save failed, localStorage is up-to-date');
  // Rollback could be implemented here
});
```

### 3. **Tägliches Reset (Automatisch)**

```javascript
// Bei jedem Load
if (shouldResetUsage(usageData.lastReset)) {
  // New day detected
  usageData = {
    date: getTodayDateString(),
    used: 0,
    limit: getDailyLimitForUser(loggedIn, tier),
    lastReset: getTodayDateString()
  };
  
  // Save to API + localStorage
  await saveUsageToAPI(account, usageData);
  saveUsageToLocalStorage(usageData);
}
```

---

## 📂 File Structure

```
src/
├── stores/
│   ├── dailyUsageStore.js     ← NEW: Centralized usage tracking
│   ├── accountStore.js         ← Updated: Calls initializeDailyUsage()
│   └── appStores.js            ← Existing: dailyLimit store
├── components/
│   ├── Core/
│   │   └── EmojiDisplay.svelte ← Updated: Uses incrementDailyUsage()
│   └── Layout/
│       └── Header.svelte       ← Uses $dailyLimit for badge
└── config/
    ├── storage.js              ← Updated: Added DAILY_USAGE key
    └── limits.js               ← Existing: Limit constants
```

---

## 🔧 API Integration

### Account Update (n8n Webhook)

```javascript
// POST /webhook/xn--moji-pb73c-account
{
  "userId": "user_123",
  "email": "user@example.com",
  "metadata": {
    "dailyUsage": {
      "date": "2025-10-10",
      "used": 3,
      "limit": 5,
      "lastReset": "2025-10-10",
      "lastIncrement": "2025-10-10T12:34:56.789Z"
    },
    "lastActivity": "2025-10-10T12:34:56.789Z",
    "updatedAt": "2025-10-10T12:34:56.789Z",
    "updatedVia": "daily-usage-tracking"
  },
  "lastLogin": "2025-10-10T12:34:56.789Z"
}
```

### Account Read (n8n Webhook)

```javascript
// POST /webhook/xn--moji-pb73c-account
{
  "action": "read",
  "userId": "user_123",
  "email": "user@example.com"
}

// Response
{
  "success": true,
  "account": {
    "userId": "user_123",
    "email": "user@example.com",
    "tier": "free",
    "metadata": {
      "dailyUsage": {
        "date": "2025-10-10",
        "used": 3,
        "limit": 5,
        "lastReset": "2025-10-10"
      }
    }
  }
}
```

---

## 🎨 UI Components

### Header Badge

```svelte
<!-- src/components/Layout/Header.svelte -->
{#if showBadge}
  <button
    class="absolute -top-1 -right-1 w-4 h-4"
    on:click={handleBadgeClick}
  >
    {#if isProUser}
      ∞
    {:else if remaining > 0}
      {remaining}
    {:else}
      💎
    {/if}
  </button>
{/if}

<script>
  $: remaining = $dailyLimit.limit - $dailyLimit.used;
  $: isProUser = $accountTier === 'pro';
</script>
```

### EmojiDisplay

```svelte
<!-- src/components/Core/EmojiDisplay.svelte -->
<script>
  import { incrementDailyUsage, initializeDailyUsage } from '../../stores/dailyUsageStore.js';
  
  onMount(async () => {
    await initializeDailyUsage();
  });
  
  async function handleSuccessfulStoryGeneration(response) {
    randomEmojis = response;
    await incrementDailyUsage();
  }
</script>
```

---

## 🔒 Security & Best Practices

### 1. **Idempotency**
- `initializeDailyUsage()` kann mehrfach aufgerufen werden ohne Nebenwirkungen
- Race Conditions verhindert durch `isLoading` Status

### 2. **Error Handling**
- API-Fehler werden geloggt, aber nicht blockierend
- localStorage als robuster Fallback
- Optimistic Updates für bessere UX

### 3. **Data Validation**
- Date-String-Validierung (YYYY-MM-DD)
- Reset nur bei gültigem Datum
- Limit nie negativ

### 4. **Performance**
- Background-Sync (non-blocking)
- Cached Promises für initializeDailyUsage
- Debouncing bei häufigen Aufrufen

---

## 🧪 Testing

```javascript
// Manual Testing
import { resetDailyUsage, incrementDailyUsage, initializeDailyUsage } from './stores/dailyUsageStore.js';

// Reset to 0
await resetDailyUsage();

// Increment
await incrementDailyUsage();

// Re-initialize
await initializeDailyUsage();
```

---

## 📈 Limits

| User Type | Daily Limit | Badge Display |
|-----------|-------------|---------------|
| **Guest** | 3           | 3, 2, 1 (green) → 💎 (red, pulse) |
| **FREE**  | 5           | 5, 4, 3, 2, 1 (yellow) → 💎 (yellow, pulse) |
| **PRO**   | 25          | ∞ (purple) |

---

## 🚀 Migration von Old System

### Before (EmojiDisplay.svelte)

```javascript
// OLD: localStorage only
function incrementDailyRequestCount() {
  const count = getDailyRequestCount() + 1;
  storageHelpers.set(STORAGE_KEYS.DAILY_REQUEST_COUNT, count);
}

function checkAndResetDailyLimit() {
  const storedDate = storageHelpers.get(STORAGE_KEYS.STORED_DATE);
  const currentDate = new Date().toDateString();
  if (storedDate !== currentDate) {
    resetDailyRequestCount();
  }
}
```

### After (dailyUsageStore.js)

```javascript
// NEW: API + localStorage
export async function incrementDailyUsage() {
  // 1. Update stores (optimistic)
  updateDailyLimitStore({ used: newUsed, limit });
  saveUsageToLocalStorage(usageData);
  
  // 2. Sync to API (background)
  if (loggedIn) {
    await saveUsageToAPI(account, usageData);
  }
}

export async function initializeDailyUsage() {
  // Priority: API > localStorage > default
  let usageData = await loadUsageFromAPI(account);
  if (!usageData) usageData = getUsageFromLocalStorage();
  if (!usageData) usageData = getDefaults();
  
  // Auto-reset for new day
  if (shouldResetUsage(usageData.lastReset)) {
    usageData = resetUsageData();
  }
}
```

---

## ✅ Vorteile

1. **Single Source of Truth**: API (Google Sheets) ist primäre Datenquelle
2. **Offline-Fähig**: localStorage als Fallback funktioniert ohne API
3. **Konsistente Architektur**: Gleicher Ansatz wie userSettings
4. **Senior Web Dev Best Practices**: Separation of Concerns, Error Handling, Performance
5. **User Experience**: Optimistic Updates, keine Blocking-Calls
6. **Skalierbar**: Einfach erweiterbar für weitere Usage-Metriken

---

## 🔮 Roadmap

- [ ] Analytics Dashboard (Usage pro User)
- [ ] Admin Panel (Reset User Limits)
- [ ] Weekly/Monthly Limits
- [ ] Feature-spezifische Limits (Random vs Story)
- [ ] Rate Limiting (Spam-Prevention)

---

**Version:** 0.5.7  
**Last Updated:** 2025-10-10  
**Author:** Chris Matt (C. Matt)

