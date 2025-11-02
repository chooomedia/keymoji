# Changelog

## [0.6.0] - 2025-10-11

### Added - AI Story Mode 🤖

-   ✨ **Story Mode AI Integration**: Convert text to emoji passwords using AI
    -   Support for OpenAI (GPT-3.5, GPT-4, GPT-4o)
    -   Support for Google Gemini (Pro, 1.5 Flash, 2.5 Flash)
    -   Support for Mistral AI (Tiny, Small, Medium)
    -   Support for Anthropic Claude (Haiku, Sonnet, Opus)
    -   Custom API support with flexible endpoints
-   ✨ **Multi-Provider API Key Management**: Separate encrypted keys per provider
    -   Automatic key switching based on selected provider
    -   Show/Hide API key toggle in settings
    -   Test Connection button with real-time validation
    -   Provider-specific API key creation links
    -   Success indicator after successful API test
-   ✨ **Persistent Story Input**: Text survives page reloads
    -   Auto-save to localStorage on every change
    -   Auto-load on page mount
    -   Clear button removes both text and storage
-   ✨ **Smart Caching System**: 
    -   7-day cache for story generations
    -   Text-based cache keys (different text = new AI call)
    -   Cache invalidation on settings changes
    -   Validation to prevent caching errors
-   ✨ **Static Pages**: Data-driven architecture
    -   Privacy Policy (`/privacy`)
    -   Legal Notice (`/legal`)
    -   Multi-language support (DE/EN with English fallback)
    -   10 content types (text, subtitle, list, card, warning, info, grid, contact)
-   ✨ **Auto-Generate Toggle**: User setting for automatic emoji generation on load
-   ✨ **Character Counter for Story Mode**: Min/max validation (10-400 chars)
    -   Visual feedback: red (over), orange (under), green (valid)
    -   Dynamic messages and icons
    -   Disabled generate button when invalid
-   ✨ **AI Model Chip**: Minimalist display below Story Mode textarea
    -   Click to navigate to settings
    -   Auto-open Story Mode accordion
-   ✨ **Loading Animation for Story Mode**: Fancy universe-effect overlay
    -   Spinner on generate button
    -   Disabled textarea during generation
    -   3 animated lanes with varied speeds
-   ✨ **CORS Testing & Debugging**: Mock mode and detailed error messages
    -   `?mock-custom-api=true` URL parameter
    -   Specific troubleshooting steps
    -   Documentation in `CUSTOM_API_TESTING.md`

### Changed - UI/UX Improvements 🎨

-   ♻️ **Story Mode UX**:
    -   Textarea remains visible after generation for easy editing
    -   Clear button positioned inside textarea (top-right)
    -   AI model info displayed prominently with provider badges
    -   Yellow active button styling for enabled Story Mode
    -   Muted inactive button with yellow border
-   ♻️ **Settings UI**:
    -   API key input with inline Show/Hide button
    -   Test Connection button integrated into input field
    -   Gradient fade-out for long API keys
    -   Perfect vertical centering with `inset-y-0`
    -   Success icon next to provider dropdown
    -   Consistent `p-4` spacing across all inputs (matches Contact Form)
-   ♻️ **Static Pages**:
    -   Robust "Back to Top" scrolling with multiple fallback methods
    -   Centered Back button and meta-info
    -   Consistent dark/light mode colors (WCAG 2.1 compliant)
    -   English fallback for all translations
-   ♻️ **Story Mode Loading Animation**:
    -   Fancy universe-effect with 3 animated lanes
    -   Varied speeds: fast (20s), medium (30s), ultra-slow (60s)
    -   Random giant emoji (60px) in middle lane
    -   Backdrop blur with transparent background
    -   Matches body background animation direction (RIGHT)
    -   No adjacent emojis (large gaps between them)

### Fixed - Critical Bugs 🐛

-   🐛 Fixed API key migration from old `apiKey` to new `apiKeys` structure
-   🐛 Fixed cache returning old keys after update
-   🐛 Fixed cache storing errors instead of valid results
-   🐛 Fixed inconsistent return types (Array vs Object) in `generateStoryEmojis`
-   🐛 Fixed settings cache not invalidating after save
-   🐛 Fixed Story Mode button not activating despite correct settings
-   🐛 Fixed CORS issues on localhost (proper error messages with mock mode)
-   🐛 Fixed Back to Top button not scrolling on static pages
-   🐛 Fixed gradient overlay covering input border
-   🐛 Fixed button vertical alignment issues
-   🐛 Fixed PostCSS build errors (undefined CSS string)
-   🐛 Fixed login status flickering on page reload
-   🐛 Fixed nested settings not being applied (deep merge fix)
-   🐛 Fixed custom API format selection not working
-   🐛 Fixed clipboard errors when document not focused
-   🐛 Fixed emoji animation glitches (static arrays instead of random)
-   🐛 Fixed emoji animation direction (now matches body background)

### Technical Improvements ⚡

-   ⚡ **Robust AI Fallbacks**: 
    -   OpenAI: Tries gpt-3.5-turbo → gpt-4o-mini
    -   Claude: Tries haiku → sonnet
    -   Gemini: Tries multiple API versions (v1beta/v1), auth methods, models
    -   Mistral: Tries tiny → small
-   ⚡ **API Best Practices**: 
    -   30-second timeout for all requests
    -   Provider-specific optimized prompts
    -   Proper headers for each API (anthropic-version, x-goog-api-key, etc.)
    -   Comprehensive error handling with user-friendly messages
-   ⚡ **Data Flow Optimization**:
    -   Cache invalidation after `saveAllSettings()`
    -   Cache invalidation after `applySettingsReactive()`
    -   Automatic migration from old to new API key structure
    -   100ms cache for `getCurrentUserSettings()` to prevent excessive calls
-   ⚡ **Settings Persistence**:
    -   Story Mode settings stored in `localStorage.USER_PREFERENCES.metadata.settings`
    -   Immediate `currentAccount.metadata.settings` update for reactivity
    -   `effectiveSettings` derived store includes `userSettings` and `pendingChanges`
-   ⚡ **Session Management**:
    -   Synchronous localStorage initialization for login state
    -   Prevents flickering on route changes
    -   Time-based duplicate prevention for session restore
    -   Centralized account store initialization
-   ⚡ **Deep Merge for Nested Settings**:
    -   Correct handling of `storyMode.customFormat` and other nested keys
    -   Support for dot-notation in `getEffectiveValue` and `updateSetting`
    -   Preserves existing settings when updating nested properties

### Security & Privacy 🔒

-   🔒 API keys stored encrypted in backend
-   🔒 Keys never exposed in frontend logs (masked)
-   🔒 CORS-safe API calls (localhost shows proper warnings)
-   🔒 Privacy Policy and Legal Notice pages added
-   🔒 GDPR/revDSGV compliant data handling

### Performance 🚀

-   ⚡ Reduced API calls with smart caching (7 days)
-   ⚡ Settings cache prevents 100+ calls per render
-   ⚡ Optimized gradient rendering with CSS custom properties
-   ⚡ Lazy loading for AI provider info
-   ⚡ PostCSS preprocess configuration in webpack for faster builds
-   ⚡ Static emoji arrays for loading animation (no re-render overhead)
-   ⚡ Smooth scrolling with `requestAnimationFrame` for animations

### Accessibility ♿

-   ✅ Fixed A11y warnings in FeatureCard (role, tabindex, keydown)
-   ✅ Proper ARIA labels for all buttons
-   ✅ Screen reader support for success/error states
-   ✅ Keyboard navigation for all interactive elements

## [0.5.8] - 2025-10-10

### Added

-   ✨ Bi-directional sync: Frontend ↔ Backend ↔ Google Sheets
-   ✨ Unified generation system with single source of truth
-   ✨ Language-aware navigation everywhere
-   ✨ SVG Charts optimization (200px → 240px, edge-to-edge)
-   ✨ Smart username fallback (no more "User" placeholder)
-   ✨ n8n workflow with robust smart merge
-   ✨ UsageHistory preservation guaranteed

### Changed

-   ♻️ Complete data flow refactor for better consistency
-   ♻️ Charts now render larger with negative margins
-   ♻️ Removed duplicate limit checks (single validateUserLimits)
-   ♻️ All navigation includes language prefix
-   ♻️ Fresh metadata loading from localStorage (never stale)

### Fixed

-   🐛 Fixed usageHistory deletion during settings update
-   🐛 Fixed language-less redirects (all navigation language-aware)
-   🐛 Fixed duplicate limit checks causing inconsistencies
-   🐛 Fixed stale metadata usage in API calls
-   🐛 Fixed charts showing "No Data" on localhost
-   🐛 Fixed username displaying as "User" placeholder

### Technical Improvements

-   ⚡ Backend response syncs back to all stores automatically
-   ⚡ Smart merge in n8n preserves usageHistory
-   ⚡ Multi-store sync: localStorage + currentAccount + usageHistory
-   ⚡ Single validation function for all limit checks
-   ⚡ Optimistic updates with localStorage verification

### Backend

-   🔧 n8n "Process Update" node with smart merge logic
-   🔧 UsageHistory preservation: incoming vs existing comparison
-   🔧 Always outputs JSON strings for Google Sheets compatibility
-   🔧 Localhost support with direct n8n calls

### Documentation

-   📝 Updated README with v0.5.8 data flow
-   📝 Added n8n workflow update guide
-   📝 Added debug data flow documentation
-   📝 Added generation system refactor overview

## [0.5.7] - 2025-10-10

### Added

-   ✨ New Tooltip component for enhanced accessibility
-   ✨ Settings validation and sanitization utilities
-   ✨ Comprehensive debugging tools for UserSettings (`window.keymojiDebug`)
-   ✨ Automated test suite for UserSettings
-   ✨ Settings Manager with idempotent initialization
-   ✨ Account age calculation and display in ContextBadge
-   🔧 n8n workflow v2 with smart merge (prevents data corruption)

### Changed

-   ♻️ Refactored UserSettings system with Single Source of Truth pattern
-   ♻️ Improved button styling consistency across all components
-   ♻️ Enhanced ModularInput with controlled component pattern (removed bind:value anti-pattern)
-   ♻️ Optimized settings initialization with tier-aware defaults (FREE vs PRO)
-   ♻️ Improved language and theme synchronization between components
-   🔄 Updated all buttons to have consistent hover/focus/active states
-   🔄 Enhanced LanguageSwitcher to sync with UserSettings
-   🔄 Enhanced FixedMenu theme toggle to sync with UserSettings

### Fixed

-   🐛 Fixed race condition in session restore (4x simultaneous calls → 1x)
-   🐛 Fixed settings overwrite issue during session restore
-   🐛 Fixed FREE user settings not displaying in inputs
-   🐛 Fixed language dropdown not showing saved value
-   🐛 Fixed theme dropdown not showing saved value (including "auto")
-   🐛 Fixed n8n workflow JSON string corruption (character array bug)
-   🐛 Fixed ContextBadge displaying duplicate tier text
-   🐛 Fixed account age calculation using correct createdAt source
-   🐛 Fixed lastLogin not updating on session restore
-   🐛 Fixed settings not persisting after page reload

### Security

-   🔒 Prevented session restore from overwriting user settings
-   🔒 Added validation to prevent PRO features on FREE tier
-   🔒 Improved CORS handling for localhost development

### Documentation

-   📝 Added comprehensive guides for n8n workflow setup
-   📝 Added UserSettings architecture documentation
-   📝 Added testing guides and debug instructions
-   📝 Added senior-level best practices documentation

### Technical Improvements

-   ⚡ Reduced duplicate API calls with session restore flags
-   ⚡ Improved performance with controlled components
-   ⚡ Better error handling and fallbacks throughout
-   ⚡ Tier-aware settings with proper FREE/PRO defaults
-   ⚡ Bidirectional sync between UI components and settings store

### Backend

-   🔧 Updated API endpoints to handle settings updates correctly
-   🔧 Improved n8n webhook payload structure
-   🔧 Added smart merge logic for settings updates

## [0.4.3] - Previous version
