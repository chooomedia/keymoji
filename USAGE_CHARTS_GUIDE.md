# Usage Charts & UI State Persistence Guide

## 📊 LineChart Component

### Features

✅ **SVG-based** - Skalierbar und performant  
✅ **Animiert** - Smooth draw-in animation  
✅ **Responsive** - Passt sich an Container-Größe an  
✅ **Dark Mode** - Automatische Theme-Erkennung  
✅ **Interactive** - Tooltips auf Hover  
✅ **Customizable** - Farben, Größe, Grid, Labels

### Usage

```svelte
<LineChart
    data={usageChartData}
    maxValue={9}
    height={180}
    color="#eab308"
    animate={true}
/>
```

### Props

| Prop         | Type    | Default   | Description                      |
| ------------ | ------- | --------- | -------------------------------- |
| `data`       | Array   | `[]`      | Data points: `[{ date, value }]` |
| `maxValue`   | Number  | `9`       | Y-axis maximum (tier limit)      |
| `height`     | Number  | `200`     | Chart height in pixels           |
| `width`      | Number  | `400`     | Chart width in pixels            |
| `color`      | String  | `#eab308` | Line color (yellow/purple)       |
| `showGrid`   | Boolean | `true`    | Show grid lines                  |
| `showPoints` | Boolean | `true`    | Show data points                 |
| `showLabels` | Boolean | `true`    | Show axis labels                 |
| `animate`    | Boolean | `true`    | Enable animations                |

### Color Coding

| User Tier | Chart Color | Hex       |
| --------- | ----------- | --------- |
| **FREE**  | Yellow      | `#eab308` |
| **PRO**   | Purple      | `#a855f7` |

### Point Colors (Dynamic)

-   **Green** (`#22c55e`): High usage (≥70% of limit)
-   **Yellow** (`#eab308`): Medium usage (40-69% of limit)
-   **Red** (`#ef4444`): Low usage (<40% of limit)

---

## 📈 Usage History

### Database Structure

```json
{
    "metadata": {
        "usageHistory": [
            {
                "date": "2025-10-10",
                "used": 5,
                "limit": 9,
                "timestamp": "2025-10-10T12:34:56.789Z"
            },
            {
                "date": "2025-10-09",
                "used": 7,
                "limit": 9,
                "timestamp": "2025-10-09T18:45:12.123Z"
            }
            // ... up to 365 days
        ]
    }
}
```

### Data Management

-   **Auto-Updated**: Every generation increments today's entry
-   **Max Entries**: 365 days (1 year)
-   **Sorted**: Newest first
-   **Deduplicated**: One entry per day
-   **Persistent**: Saved to Google Sheets

### Time Periods

| Period  | Days | Use Case        |
| ------- | ---- | --------------- |
| **7d**  | 7    | Week overview   |
| **14d** | 14   | Two weeks trend |
| **4w**  | 28   | Monthly pattern |
| **1y**  | 365  | Yearly insights |

---

## 🎨 UI State Persistence

### Feature

User-Einstellungen merken sich, welche Settings-Sections geöffnet/geschlossen sind.

### Database Structure

```json
{
    "settings": {
        "uiState": {
            "expandedSections": ["basic", "emoji"]
        }
    }
}
```

### Behavior

1. **User öffnet Section** → `expandedSections.push('emoji')`
2. **User schließt Section** → `expandedSections.filter(id => id !== 'emoji')`
3. **User klickt "Save Settings"** → Speichert `uiState` in Google Sheets
4. **Page Reload** → `uiState` wird geladen → Sections auto-expand

### Available Sections

-   `basic` - Language, Theme, Notifications
-   `security` - Password Settings
-   `emoji` - Emoji Count, Categories
-   `generation` - Auto-Generate, Clipboard
-   `privacy` - Analytics, History
-   `pro` - Pro Features

### Benefits

✅ **Better UX**: User muss Sections nicht jedes Mal neu öffnen  
✅ **Persistenz**: Über Reloads und Sessions hinweg  
✅ **Tier-Aware**: FREE und PRO user haben eigene Präferenzen  
✅ **Lightweight**: Nur ein Array von Section-IDs

---

## 🔄 Integration in AccountManager

### Chart Display

```svelte
<!-- Daily Limit Status with Chart -->
<div class="bg-powder-300 dark:bg-aubergine-900 rounded-xl p-4 mb-5">
    <!-- Header with Time Period Selector -->
    <div class="flex justify-between items-center mb-3">
        <span>Daily Generations</span>
        <div class="inline-flex rounded-lg">
            {#each ['7d', '14d', '4w', '1y'] as period}
                <button
                    on:click={() => selectedTimePeriod = period}
                    class="{selectedTimePeriod === period ? 'bg-yellow-500' : ''}"
                >
                    {period}
                </button>
            {/each}
        </div>
        <span>{dailyLimitDisplay}</span>
    </div>

    <!-- Line Chart -->
    <LineChart
        data={usageChartData}
        maxValue={$accountTier === 'pro' ? 25 : 9}
        color={$accountTier === 'pro' ? '#a855f7' : '#eab308'}
    />

    <!-- Progress Bar -->
    <div class="progress-bar">...</div>
</div>
```

### Reactive Data Flow

```javascript
// 1. Load history from account (reactive)
$: usageHistory = getUsageHistory($currentAccount);

// 2. Calculate statistics
$: usageStats = calculateUsageStats(usageHistory);

// 3. Generate chart data for selected period
$: usageChartData = generateChartData(selectedTimePeriod, usageHistory);
```

---

## 🔧 Helper Functions

### usageHistoryHelpers.js

```javascript
// Get usage history from account
getUsageHistory(account);
// Returns: [{ date, used, limit, timestamp }]

// Get history for specific period
getUsageHistoryForPeriod(account, '7d');
// Returns: Filtered array for period

// Calculate statistics
calculateUsageStats(history);
// Returns: { total, average, max, min, trend }

// Format period labels
formatPeriodLabel('7d'); // → "Last 7 Days"
formatPeriodLabelDE('7d'); // → "Letzte 7 Tage"
```

---

## 🎯 Data Flow

```
User Generates Emoji
        ↓
incrementDailyUsage()
        ↓
   ┌────────────────────────────┐
   │ 1. Update dailyLimit store │
   │ 2. Save to localStorage    │
   │ 3. Verify write           │
   │ 4. Update usageHistory    │
   │ 5. Save to API (background)│
   └────────────┬───────────────┘
                ↓
    ┌───────────────────────────┐
    │ Google Sheets Updated:    │
    │                           │
    │ metadata: {               │
    │   dailyUsage: {...},      │
    │   usageHistory: [         │
    │     { date, used, ... },  │
    │     ...                   │
    │   ]                       │
    │ }                         │
    └───────────┬───────────────┘
                ↓
    ┌───────────────────────────┐
    │ Page Reload               │
    └───────────┬───────────────┘
                ↓
    ┌───────────────────────────┐
    │ initializeDailyUsage()    │
    │ → Load from API           │
    │ → currentAccount updated  │
    └───────────┬───────────────┘
                ↓
    ┌───────────────────────────┐
    │ Chart Auto-Updates:       │
    │ $: usageHistory =         │
    │    getUsageHistory(        │
    │      $currentAccount       │
    │    )                       │
    └───────────────────────────┘
```

---

## 🧪 Testing

### Browser Console

```javascript
// 1. Check current usage history
const account = window.$currentAccount;
console.log('History:', account?.metadata?.usageHistory);

// 2. Generate fake history for testing
const fakeHistory = [];
for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    fakeHistory.push({
        date: date.toISOString().split('T')[0],
        used: Math.floor(Math.random() * 9),
        limit: 9
    });
}
console.log('Fake history:', fakeHistory);

// 3. Test chart with different periods
// Click on 7d, 14d, 4w, 1y buttons and observe chart updates

// 4. Test UI state persistence
// Open/close sections → Click "Save Settings" → Reload → Sections should restore
```

---

## 🎨 UX/UI Best Practices

### 1. **Progressive Enhancement**

-   Chart gracefully falls back to "No data" state
-   Works without JavaScript (shows static values)
-   Accessible aria-labels

### 2. **Performance**

-   SVG rendering (hardware accelerated)
-   Cached calculations with reactive $:
-   Smooth 60fps animations

### 3. **Accessibility**

-   `role="img"` on SVG
-   `aria-label` on chart
-   Keyboard navigation for period selector
-   `title` tooltips on data points

### 4. **Responsive**

-   `viewBox` maintains aspect ratio
-   `width="100%"` adapts to container
-   Mobile-friendly touch targets

### 5. **Visual Hierarchy**

-   Chart above progress bar (primary info)
-   Grid lines subtle (not distracting)
-   Data points highlighted on hover
-   Clear time period selector

---

## 📦 Database Schema

### Complete Account Structure

```json
{
    "userId": "user_123",
    "email": "user@example.com",
    "tier": "free",
    "createdAt": "2025-07-31T12:00:00.000Z",
    "lastLogin": "2025-10-10T12:00:00.000Z",
    "profile": {
        "name": "John Doe",
        "dailyUsage": {
            "date": "2025-10-10",
            "used": 5,
            "limit": 9,
            "lastReset": "2025-10-10"
        }
    },
    "metadata": {
        "dailyUsage": {
            "date": "2025-10-10",
            "used": 5,
            "limit": 9,
            "lastReset": "2025-10-10"
        },
        "usageHistory": [
            { "date": "2025-10-10", "used": 5, "limit": 9 },
            { "date": "2025-10-09", "used": 7, "limit": 9 },
            { "date": "2025-10-08", "used": 3, "limit": 9 }
        ],
        "settings": {
            "name": "John Doe",
            "language": "de",
            "theme": "dark",
            "emojiCount": 9,
            "uiState": {
                "expandedSections": ["basic", "emoji"]
            }
        }
    },
    "status": "active"
}
```

---

## ✅ Implementation Checklist

-   [x] Create LineChart.svelte component
-   [x] Add SVG rendering with animations
-   [x] Add light/dark mode support
-   [x] Add interactive tooltips
-   [x] Add time period selector (7d, 14d, 4w, 1y)
-   [x] Create usageHistory data structure
-   [x] Save usageHistory to metadata on each generation
-   [x] Load usageHistory from API on init
-   [x] Create usageHistoryHelpers.js utilities
-   [x] Integrate chart in AccountManager
-   [x] Add reactive data binding
-   [x] Add UI state tracking (expanded sections)
-   [x] Save UI state to userSettings
-   [x] Persist UI state to Google Sheets
-   [x] Restore UI state on page load
-   [x] Add uiState to default settings
-   [x] Test all reactivity
-   [x] Update documentation

---

**Version:** 0.5.7  
**Feature:** Usage Charts + UI State Persistence  
**Status:** ✅ Complete & Production Ready
