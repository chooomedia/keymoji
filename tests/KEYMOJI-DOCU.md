# Keymoji - Architecture & Refactoring Guide

> Comprehensive documentation of the current codebase architecture, implemented improvements, and refactoring roadmap.

---

## 📋 Table of Contents

- [Current Status](#current-status)
- [Architecture Overview](#architecture-overview)
- [Implemented Improvements](#implemented-improvements)
- [Refactoring Roadmap](#refactoring-roadmap)
- [Best Practices](#best-practices)
- [Code Quality Guidelines](#code-quality-guidelines)

---

## 🎯 Current Status

### Technology Stack

- **Frontend Framework:** Svelte 4 (JavaScript)
- **Styling:** Tailwind CSS
- **Build System:** Webpack with custom configurations
- **Backend:** Vercel Serverless Functions
- **Orchestration:** n8n Workflows (automation, validation, logging)
- **State Management:** Svelte Stores
- **Deployment:** Vercel + GitHub Actions

### Version

**Current:** `0.7.1` - Stability Master

---

## 🏗️ Architecture Overview

### Directory Structure

```
src/
├── assets/          # Fonts, shapes, static assets
├── components/      # Reusable UI components
│   ├── A11y/       # Accessibility components
│   ├── Core/       # Core functionality (EmojiDisplay, UserCounter)
│   ├── Features/   # Feature-specific components
│   ├── Layout/     # Layout components (Header, PageLayout)
│   ├── StaticContent/ # Static content components
│   └── UI/         # Reusable UI elements (Button, Input, Modal, etc.)
├── config/         # Centralized configuration
│   ├── api.js      # API endpoints & webhooks
│   ├── limits.js   # User limits (Guest/Free/Pro)
│   └── storage.js  # localStorage keys & helpers
├── data/           # Static data files
│   ├── languages/  # 15+ language files
│   ├── content.js  # Content management
│   ├── userSettings.json # Settings structure
│   └── versions.js # Version history
├── routes/         # Page components
│   ├── LanguageRouter.svelte
│   ├── AccountManager.svelte
│   ├── ContactForm.svelte
│   └── ...
├── stores/         # Svelte stores for state management
│   ├── appStores.js      # Primary app state
│   ├── accountStore.js   # Authentication & account
│   ├── contentStore.js   # Language & content
│   ├── dailyUsageStore.js # Usage tracking
│   ├── modalStore.js     # Modal system
│   ├── seoStore.js       # SEO metadata
│   ├── userDataStore.js  # User data sync
│   └── userSettingsStore.js # User settings
└── utils/          # Utility functions
    ├── apiCache.js           # API caching & throttling
    ├── storyModeAI.js        # AI provider integration
    ├── settingsValidation.js # Settings validation
    └── ...
```

### Data Flow

```
Frontend (Svelte)
    ↓
Stores (State Management)
    ↓
Utils (Business Logic)
    ↓
API Layer (Vercel Serverless)
    ↓
n8n Workflows (Orchestration)
    ↓
Backend Services (Google Sheets, etc.)
    ↓
Sync back to Frontend
```

---

## ✅ Implemented Improvements

### 1. Centralized Configuration ✅

**Status:** Fully implemented

- **`src/config/api.js`** - Centralized API endpoints and webhooks
- **`src/config/storage.js`** - Centralized localStorage keys and helpers
- **`src/config/limits.js`** - User limits configuration (Guest/Free/Pro)

**Benefits:**
- Single source of truth for configuration
- Easy to update endpoints
- Type-safe configuration access
- Environment-specific configs

### 2. Storage Management ✅

**Status:** Fully implemented

**File:** `src/config/storage.js`

**Features:**
- Centralized `STORAGE_KEYS` constants
- `storageHelpers` utility functions:
  - Safe get/set/remove operations
  - Error handling
  - Prefix-based cleanup
  - Migration system
- Automatic localStorage migration on app initialization
- Debug tools (`window.debugLocalStorage()`)

**Migration System:**
- Migrates old API key structure (`apiKey` → `apiKeys`)
- Cleans up deprecated keys
- Masks recent emojis for privacy
- Removes expired cache entries

### 3. API Caching & Throttling ✅

**Status:** Fully implemented

**File:** `src/utils/apiCache.js`

**Features:**
- Intelligent caching with TTL (Time To Live)
- Request throttling (prevents 429 errors)
- In-flight request deduplication
- Cache size management (5MB max)
- Endpoint-specific cache strategies

**Cache TTL:**
- Account Profile: 5 minutes
- Daily Usage: 30 seconds
- Usage History: 1 hour
- Session Check: 2 minutes
- User Settings: 10 minutes

### 4. Content Management ✅

**Status:** Fully implemented

**Files:**
- `src/stores/contentStore.js` - Centralized content/language management
- `src/utils/contentLoader.js` - Content loading with caching
- `src/data/content.js` - Content data structure

**Features:**
- 15+ language support (including Klingon & Sindarin)
- Language change listeners
- URL synchronization with language
- Browser language detection
- Content caching

### 5. Modular UI Components ✅

**Status:** Fully implemented

**Location:** `src/components/UI/`

**Components:**
- `ModularInput.svelte` - 10+ input types
- `ModularForm.svelte` - Form wrapper
- `ModularLoginForm.svelte` - Login form
- `Button.svelte` - Reusable button
- `Input.svelte` - Reusable input
- `Modal.svelte` - Modal system
- `LineChart.svelte` - Chart component
- And more...

**Features:**
- JSON-based configuration
- i18n support
- Accessibility (ARIA attributes)
- Validation
- Type safety

### 6. Store Architecture ✅

**Status:** Fully implemented

**Stores:**
- `appStores.js` - Primary app state (language, theme, UI state)
- `accountStore.js` - Authentication & account management
- `contentStore.js` - Language & content management
- `dailyUsageStore.js` - Usage tracking with limits
- `modalStore.js` - Centralized modal system
- `seoStore.js` - SEO metadata management
- `userDataStore.js` - User data synchronization
- `userSettingsStore.js` - User settings with validation

**Benefits:**
- Reactive state management
- Clear separation of concerns
- Persistence layer integration
- Debug tools

### 7. AI Story Mode Integration ✅

**Status:** Fully implemented

**File:** `src/utils/storyModeAI.js`

**Features:**
- Multi-provider support (OpenAI, Gemini, Mistral, Claude, Apertus, Custom)
- Provider-specific optimizations
- 7-day caching
- Error handling with user-friendly messages
- CORS error detection
- Network error handling
- Timeout management (30s default, 120s for n8n)

**Providers:**
- OpenAI (GPT models)
- Google Gemini (Gemini Pro)
- Mistral AI (Mistral models)
- Anthropic Claude (Claude models)
- Apertus (Swiss LLM via n8n)
- Custom API endpoints

### 8. Settings Validation ✅

**Status:** Fully implemented

**File:** `src/utils/settingsValidation.js`

**Features:**
- Tier-based validation (Free/Pro)
- Pro-only features check
- Type validation
- Range validation
- Required fields check
- Settings sanitization
- Default values merging

### 9. Account System ✅

**Status:** Fully implemented

**Files:**
- `src/stores/accountStore.js` - Account state management
- `src/utils/accountHelpers.js` - Account utilities
- `src/routes/AccountManager.svelte` - Account page

**Features:**
- Magic-link authentication
- Daily usage limits (Guest: 5, Free: 9, Pro: 35)
- Usage analytics with charts
- Account tier management
- Session management

---

## 🚧 Refactoring Roadmap

### Phase 1: Service Layer (Recommended Next Steps)

**Priority:** High

**Goal:** Extract API calls and business logic from components into dedicated services.

#### 1.1 Create Service Directory

```
src/services/
├── apiClient.js      # Centralized API client
├── emojiService.js   # Emoji generation service
└── accountService.js # Account management service
```

#### 1.2 API Client Service

**File:** `src/services/apiClient.js`

**Responsibilities:**
- Unified HTTP request handling
- Error handling & retry logic
- Request/response interceptors
- Authentication token management
- Request cancellation

**Example:**

```javascript
// src/services/apiClient.js
import { WEBHOOKS } from '../config/api.js';
import { apiCache } from '../utils/apiCache.js';

class APIClient {
    async request(url, options = {}) {
        // Unified request handling
        // Error handling
        // Retry logic
        // Caching
    }
    
    async getAccount(userId) {
        return this.request(WEBHOOKS.ACCOUNT.READ, {
            method: 'POST',
            body: { action: 'read', userId }
        });
    }
}

export const apiClient = new APIClient();
```

#### 1.3 Emoji Service

**File:** `src/services/emojiService.js`

**Responsibilities:**
- Extract emoji generation logic from `EmojiDisplay.svelte`
- Handle random emoji generation
- Handle AI story mode generation
- Cache management
- Error handling

#### 1.4 Account Service

**File:** `src/services/accountService.js`

**Responsibilities:**
- Account CRUD operations
- Magic link authentication
- Session management
- Usage tracking
- Settings synchronization

### Phase 2: Component Refactoring

**Priority:** Medium

#### 2.1 EmojiDisplay.svelte

**Current Issues:**
- Mixed UI and business logic
- Direct API calls in component
- Complex state management

**Proposed Solution:**
- Split into container and presentation components
- Use `emojiService` for business logic
- Simplify state management with stores

**Structure:**

```
src/components/EmojiDisplay/
├── EmojiDisplay.svelte       # Container (logic)
├── EmojiDisplayUI.svelte     # Presentation (UI)
└── EmojiDisplayControls.svelte # Controls
```

#### 2.2 LanguageRouter.svelte

**Current Issues:**
- Complex routing logic
- Mixed concerns (routing + language)

**Proposed Solution:**
- Simplify route processing
- Extract language logic to `contentStore`
- Improve initial loading

#### 2.3 ServiceWorkerHandler.svelte

**Current Issues:**
- Duplicate update logic
- Complex registration flow

**Proposed Solution:**
- Simplify update logic
- Clear separation: registration vs. update management
- Better error handling

### Phase 3: Store Optimization

**Priority:** Medium

#### 3.1 Store Splitting (Optional)

**Current:** `appStores.js` handles multiple concerns

**Proposed:** Split into focused stores (if needed):
- `languageStore.js` - Language management (already in `contentStore`)
- `themeStore.js` - Theme management
- `uiStore.js` - UI state

**Note:** Current structure is acceptable. Only split if stores become too large.

#### 3.2 Store Documentation

**Goal:** Add JSDoc comments to all store functions

**Benefits:**
- Better IDE autocomplete
- Type safety
- Developer experience

### Phase 4: Utility Consolidation

**Priority:** Low

#### 4.1 Remove Duplicates

**Current:** Some duplicate storage helpers

**Files:**
- `src/config/storage.js` - ✅ Primary (use this)
- `src/utils/sharedHelpers.js` - Contains `storageHelper` (deprecated)

**Action:** Migrate all code to use `src/config/storage.js`

#### 4.2 Accessibility Utilities

**Goal:** Consolidate A11y utilities

**Current:** Scattered across components

**Proposed:** Create `src/utils/accessibility.js`

### Phase 5: Build Optimization

**Priority:** Low

#### 5.1 Webpack Configuration

**Goal:** Optimize bundle size

**Actions:**
- Code splitting
- Tree shaking
- Lazy loading
- Chunk optimization

#### 5.2 Service Worker

**Goal:** Improve caching strategy

**Actions:**
- Simplified cache strategy
- Better update logic
- Reliable offline support

---

## 📚 Best Practices

### 1. Separation of Concerns

**Components:** Only UI logic
**Services:** Business logic & API calls
**Stores:** State management
**Utils:** Helper functions

### 2. Error Handling

**Pattern:**

```javascript
try {
    const result = await apiCall();
    return { success: true, data: result };
} catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
}
```

### 3. State Management

**Use Stores for:**
- Global state
- Shared state between components
- Persistent state (localStorage)

**Use Component State for:**
- Local UI state
- Form input state
- Temporary state

### 4. API Calls

**Always:**
- Use `apiCache.js` for caching
- Handle errors gracefully
- Show user-friendly error messages
- Implement retry logic for critical requests

### 5. Code Organization

**File Naming:**
- Components: `PascalCase.svelte`
- Utilities: `camelCase.js`
- Stores: `camelCaseStore.js`
- Services: `camelCaseService.js`

**Imports:**
- Relative imports for same directory
- Absolute imports for cross-directory
- Use `@/` alias if configured

---

## 🎨 Code Quality Guidelines

### 1. JavaScript/Svelte

- Use ES6+ features
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Destructure objects/arrays
- Use template literals
- Add JSDoc comments for functions

### 2. Component Structure

```svelte
<script>
    // 1. Imports
    // 2. Props
    // 3. Stores
    // 4. Local state
    // 5. Computed values
    // 6. Functions
    // 7. Lifecycle
</script>

<!-- Template -->

<style>
    /* Styles */
</style>
```

### 3. Naming Conventions

- **Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Components:** `PascalCase`
- **Functions:** `camelCase` (verbs: `get`, `set`, `create`, `update`, `delete`)
- **Files:** Match export (e.g., `Button.svelte` exports `Button`)

### 4. Comments

**Good:**

```javascript
/**
 * Generates a random emoji password
 * @param {number} length - Number of emojis
 * @returns {string} Emoji password
 */
function generateEmojiPassword(length) {
    // Implementation
}
```

**Avoid:**
- Obvious comments
- Commented-out code
- TODOs without context

### 5. Performance

- Use `$:` for reactive statements (sparingly)
- Memoize expensive computations
- Lazy load heavy components
- Use `key` blocks for list updates
- Avoid unnecessary re-renders

---

## 🔍 Testing Strategy

### Current Status

**Test Files:**
- `tests/test-n8n-webhook.sh` - n8n webhook testing
- `tests/test-api-chart-data.js` - Chart data testing
- `tests/test-usersettings.js` - User settings testing
- `tests/test-backend.js` - Backend testing
- `tests/test-accounting-security.js` - Security testing

### Recommended Additions

1. **Unit Tests:** Jest or Vitest for utilities
2. **Component Tests:** Svelte Testing Library
3. **E2E Tests:** Playwright or Cypress
4. **Integration Tests:** API endpoint testing

---

## 📝 Migration Notes

### From Old Structure

**Old:** Direct localStorage access
**New:** Use `storageHelpers` from `src/config/storage.js`

**Old:** Direct API calls in components
**New:** Use `apiCache.js` or future `apiClient.js`

**Old:** Language logic in components
**New:** Use `contentStore.js`

**Old:** Settings validation scattered
**New:** Use `settingsValidation.js`

---

## 🚀 Quick Start for New Features

1. **Check existing utilities** - Don't reinvent the wheel
2. **Use stores** - For shared state
3. **Follow naming conventions** - Consistency is key
4. **Add JSDoc comments** - Help future you
5. **Test thoroughly** - Manual testing minimum
6. **Update documentation** - Keep this doc updated

---

## 📖 Additional Resources

- **Svelte Docs:** https://svelte.dev/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **n8n Docs:** https://docs.n8n.io
- **Vercel Docs:** https://vercel.com/docs

---

## 📅 Changelog

### 2025-11-07
- Created comprehensive architecture documentation
- Documented all implemented improvements
- Created refactoring roadmap
- Added best practices and guidelines

---

**Last Updated:** 2025-11-07  
**Maintained by:** Christopher Matt  
**Version:** 1.0.0

