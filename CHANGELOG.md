# Changelog

## [0.5.7] - 2025-10-10

### Added
- ✨ New Tooltip component for enhanced accessibility
- ✨ Settings validation and sanitization utilities
- ✨ Comprehensive debugging tools for UserSettings (`window.keymojiDebug`)
- ✨ Automated test suite for UserSettings
- ✨ Settings Manager with idempotent initialization
- ✨ Account age calculation and display in ContextBadge
- 🔧 n8n workflow v2 with smart merge (prevents data corruption)

### Changed
- ♻️ Refactored UserSettings system with Single Source of Truth pattern
- ♻️ Improved button styling consistency across all components
- ♻️ Enhanced ModularInput with controlled component pattern (removed bind:value anti-pattern)
- ♻️ Optimized settings initialization with tier-aware defaults (FREE vs PRO)
- ♻️ Improved language and theme synchronization between components
- 🔄 Updated all buttons to have consistent hover/focus/active states
- 🔄 Enhanced LanguageSwitcher to sync with UserSettings
- 🔄 Enhanced FixedMenu theme toggle to sync with UserSettings

### Fixed
- 🐛 Fixed race condition in session restore (4x simultaneous calls → 1x)
- 🐛 Fixed settings overwrite issue during session restore
- 🐛 Fixed FREE user settings not displaying in inputs
- 🐛 Fixed language dropdown not showing saved value
- 🐛 Fixed theme dropdown not showing saved value (including "auto")
- 🐛 Fixed n8n workflow JSON string corruption (character array bug)
- 🐛 Fixed ContextBadge displaying duplicate tier text
- 🐛 Fixed account age calculation using correct createdAt source
- 🐛 Fixed lastLogin not updating on session restore
- 🐛 Fixed settings not persisting after page reload

### Security
- 🔒 Prevented session restore from overwriting user settings
- 🔒 Added validation to prevent PRO features on FREE tier
- 🔒 Improved CORS handling for localhost development

### Documentation
- 📝 Added comprehensive guides for n8n workflow setup
- 📝 Added UserSettings architecture documentation
- 📝 Added testing guides and debug instructions
- 📝 Added senior-level best practices documentation

### Technical Improvements
- ⚡ Reduced duplicate API calls with session restore flags
- ⚡ Improved performance with controlled components
- ⚡ Better error handling and fallbacks throughout
- ⚡ Tier-aware settings with proper FREE/PRO defaults
- ⚡ Bidirectional sync between UI components and settings store

### Backend
- 🔧 Updated API endpoints to handle settings updates correctly
- 🔧 Improved n8n webhook payload structure
- 🔧 Added smart merge logic for settings updates

## [0.4.3] - Previous version

