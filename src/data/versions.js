export const versions = {
    '0.7.3': {
        date: 'November 13, 2025',
        core: {
            dataIntegrity: {
                title: '🔐 Data Integrity & Single Source of Truth',
                improvements: [
                    'Metadata Cleaner: Prevents duplicate fields in metadata (createdAt, dailyUsage, profile, tier, etc.)',
                    'Single Source of Truth: Fields with own columns (userId, email, tier, createdAt, lastLogin, profile, dailyUsage, status) are NOT in metadata',
                    'dailyUsage Preservation: Explicitly preserved when updating name or settings',
                    'createdAt Preservation: Never overwritten after initial account creation',
                    'updatedHistory Order: Fixed ReferenceError by ensuring correct initialization order',
                    'Metadata cleaning in frontend and backend (metadataCleaner.js)',
                    'ES6 Module exports for Vercel compatibility'
                ]
            },
            magicLink: {
                title: '🔗 Magic-Link Settings Fix',
                improvements: [
                    'refreshUserSettings() function created in userDataStore.js (analog to refreshUsageHistory)',
                    'initializeSettingsForUser() called immediately after syncAccountData() in verifyMagicLinkFrontend',
                    'Settings priority corrected: extractSettingsFromAccount() as Priority 1 (from currentAccount.metadata.settings)',
                    'Settings now load correctly after Magic-Link login',
                    'Robust fallback chain: account.metadata.settings → API → localStorage → tier defaults',
                    'User settings displayed correctly after login'
                ]
            },
            backend: {
                title: '⚙️ Backend & n8n Workflow Improvements',
                improvements: [
                    'n8n Process Update: Enhanced dailyUsage preservation logic (checks case variations: dailyUsage/DailyUsage)',
                    'n8n Process Update: Explicit metadata cleaning to exclude column fields',
                    'Vercel API: Improved CORS handling with try-catch for robust OPTIONS requests',
                    'Vercel API: Metadata cleaning integrated in account/update.js and account.js',
                    'Timeout handling: 30-second timeout for n8n webhook requests',
                    'Error logging: Enhanced error messages with status, status text, and response preview'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Bug Fixes',
                improvements: [
                    'Fixed: dailyUsage deleted when updating name or settings',
                    'Fixed: createdAt overwritten after login or account updates',
                    'Fixed: Settings not displayed after Magic-Link login',
                    'Fixed: ReferenceError: Cannot access updatedHistory before initialization',
                    'Fixed: CORS preflight requests failing with 500 status',
                    'Fixed: SyntaxError: ES6 module exports in Vercel backend'
                ]
            },
            dataFlow: {
                title: '🔄 Data Flow Optimization',
                improvements: [
                    'updateAccountName: Loads dailyUsage from multiple sources (account → dailyLimit → API → localStorage)',
                    'saveSettingsToAPI: Preserves dailyUsage when saving settings',
                    'saveUsageToAPI: Correct initialization order for updatedHistory',
                    'syncAccountData: Parses metadata and profile correctly (handles string and object formats)',
                    'initializeSettingsForUser: Priority-based settings loading (account → API → localStorage)',
                    'refreshUserSettings: Caches settings and updates userSettings store'
                ]
            },
            codeQuality: {
                title: '⚡ Code Quality & Best Practices',
                improvements: [
                    'Centralized metadata cleaning utility (metadataCleaner.js) for frontend and backend',
                    'Consistent error handling across all account update operations',
                    'Comprehensive logging for debugging data flow issues',
                    'Robust validation for dailyUsage (checks for date field)',
                    'Improved CORS handling with proper error recovery',
                    'ES6 Module syntax for better Vercel compatibility'
                ]
            }
        }
    },
    '0.7.2': {
        date: 'November 7, 2025',
        core: {
            security: {
                title: '🔒 Security: Environment Variables & Configuration',
                improvements: [
                    'Removed n8n URLs from .env.example (security best practice)',
                    'API URLs now configurable via environment variables (VITE_N8N_URL, VITE_API_URL)',
                    'Webpack supports import.meta.env.* for VITE_ prefixed variables',
                    'Security warnings when fallback URLs are used in development',
                    'Test scripts updated to read URLs from .env.local',
                    'Documentation updated with security best practices'
                ]
            },
            environment: {
                title: '⚙️ Environment Variables Best Practices',
                improvements: [
                    'Clean .env.example with only required variables and placeholders',
                    'Priority system: .env.local > .env.{mode} > .env > .env.example',
                    'Comprehensive environment variables documentation (docs/ENVIRONMENT_VARIABLES.md)',
                    '.env.example now versioned in Git (template only)',
                    'Clear setup instructions for development and production',
                    'Security notes and troubleshooting guide added'
                ]
            },
            configuration: {
                title: '🔧 Configuration Improvements',
                improvements: [
                    'Centralized API configuration with environment variable support',
                    'Webpack environment loader with proper priority handling',
                    'Support for both process.env.* and import.meta.env.* patterns',
                    'Fallback warnings for missing environment variables',
                    'Updated test scripts to use environment variables'
                ]
            },
            documentation: {
                title: '📚 Documentation Updates',
                improvements: [
                    'Complete README rewrite in English with modern structure',
                    'Comprehensive environment variables guide created',
                    'Architecture and refactoring documentation (tests/KEYMOJI-DOCU.md)',
                    'Security best practices documented',
                    'Setup instructions improved for new developers',
                    'Test files reorganized into tests/ directory'
                ]
            }
        },
        fixes: {
            codeQuality: {
                title: '⚡ Code Quality & Organization',
                improvements: [
                    'Test files moved to tests/ directory (test-n8n-webhook.sh, test-api-chart-data.js)',
                    'Test script improvements (reads URLs from .env.local)',
                    'Removed hardcoded URLs from public repository',
                    'Improved error handling in environment variable loading',
                    'Better separation of concerns in configuration files'
                ]
            },
            security: {
                title: '🔒 Security Improvements',
                improvements: [
                    'No sensitive URLs in public repository',
                    'Environment variables required for production deployments',
                    'Clear security warnings in code comments',
                    'Best practices enforced via configuration',
                    'Documentation updated to reflect security requirements'
                ]
            }
        }
    },
    '0.7.1': {
        date: 'November 2, 2025',
        core: {
            deepMerge: {
                title: '🔧 Deep Merge Fix',
                improvements: [
                    'Fixed effectiveSettings nested merge preventing settings overwrite',
                    'Proper deep merge chain: tierDefaults < account < userSettings < pending',
                    'Eliminated Model Chip flickering when changing temperature',
                    'Preserves nested settings (storyMode.apiKeys, etc.) correctly'
                ]
            },
            temperatureSlider: {
                title: '🌡️ Temperature Slider Improvements',
                improvements: [
                    'Full width slider with proper spacing',
                    'Model Chip positioned below slider (separate div)',
                    'Smart model name truncation (max 12 chars)',
                    'Button text truncation (max 16 chars with ellipsis)',
                    'Initialization before reactive blocks prevents race conditions'
                ]
            },
            devTools: {
                title: '🛠️ Development Tools',
                improvements: [
                    'localStorage cleaner button (🧹) in dev mode',
                    'Unlimited daily limits in development (99999)',
                    'Production limits unchanged (Guest:5, Free:9, Pro:35)',
                    'Dev tools only visible on localhost:8080',
                    'Prevents accidental data loss in production'
                ]
            },
            security: {
                title: '🔒 Security: Emoji Masking',
                improvements: [
                    'Only first and last emojis saved to localStorage',
                    'Middle emojis replaced with ✨ for privacy',
                    'Prevents full emoji password leak in recent emojis',
                    '404 page correctly displays masked emojis'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Bug Fixes',
                improvements: [
                    'Fixed Model Chip showing "GPT" instead of custom model',
                    'Fixed temperature slider initialization race condition',
                    'Fixed nested settings overwrite in effectiveSettings',
                    'Fixed button text overflow in UI',
                    'Removed debug console.log statements'
                ]
            },
            codeQuality: {
                title: '⚡ Code Quality',
                improvements: [
                    'Cleaner reactivity for displayModel',
                    'Consistent data source across components',
                    'Proper deep merge implementation',
                    'Consistent storage handling across entire app'
                ]
            }
        }
    },
    '0.7.0': {
        date: 'November 2, 2025',
        core: {
            session: {
                title: '🔐 Session Management Overhaul',
                improvements: [
                    'Fixed login status flickering on page reload',
                    'Synchronous localStorage initialization for login state',
                    'Time-based duplicate prevention for session restore',
                    'Centralized account store initialization',
                    'Proper session validation across all routes'
                ]
            },
            nestedSettings: {
                title: '🔄 Nested Settings Deep Merge',
                improvements: [
                    'Correct handling of storyMode.customFormat and other nested keys',
                    'Support for dot-notation in getEffectiveValue and updateSetting',
                    'Preserves existing settings when updating nested properties',
                    'Fixed validation for custom API providers',
                    'Eliminated settings overwrite issues'
                ]
            },
            postcss: {
                title: '⚡ PostCSS Build System',
                improvements: [
                    'Fixed PostCSS build errors (undefined CSS string)',
                    'Correct svelte-preprocess configuration in webpack',
                    'Explicit PostCSS plugin inclusion (Tailwind, Autoprefixer)',
                    'Eliminated corrupted build cache issues'
                ]
            },
            localStorage: {
                title: '🧹 localStorage Migration & Cleanup',
                improvements: [
                    'Migration from deprecated keys to new structure',
                    'Cleanup of expired story cache entries',
                    'Synchronous localStorage initialization',
                    'Automatic migration of old API key structures'
                ]
            },
            animation: {
                title: '✨ Story Mode Loading Animation Finalized',
                improvements: [
                    'Fixed emoji animation glitches with static arrays',
                    'Animation direction matches body background (RIGHT)',
                    'No adjacent emojis with large gaps',
                    'Varied speeds across 3 lanes for universe effect',
                    'Random giant emoji (60px) in middle lane',
                    'Smooth infinite scrolling with seamless loops',
                    'Backdrop blur with proper z-index layering'
                ]
            },
            cors: {
                title: '🌐 CORS Testing & Debugging',
                improvements: [
                    'Mock mode for local custom API testing (?mock-custom-api=true)',
                    'Detailed error messages with troubleshooting steps',
                    'Documentation in CUSTOM_API_TESTING.md',
                    'Enhanced fetchWithTimeout error detection'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Bug Fixes',
                improvements: [
                    'Fixed PostCSS build errors preventing development',
                    'Fixed login status lost on route changes',
                    'Fixed nested settings not being applied',
                    'Fixed custom API format selection not working',
                    'Fixed clipboard errors when document not focused',
                    'Fixed emoji animation disappearing/reappearing',
                    'Fixed ReferenceError: showInfo is not defined',
                    'Fixed ReferenceError: customApiUrl is not defined'
                ]
            },
            performance: {
                title: '⚡ Performance Fixes',
                improvements: [
                    'Static emoji arrays prevent re-render overhead',
                    'Eliminated height animation stuttering',
                    'Throttled timeline height updates',
                    'Debounced resize handlers for smooth performance'
                ]
            }
        }
    },
    '0.6.0': {
        date: 'October 11, 2025',
        core: {
            storyMode: {
                title: '🤖 AI Story Mode',
                improvements: [
                    'Convert text to emoji passwords using AI',
                    'Support for OpenAI (GPT-3.5, GPT-4, GPT-4o)',
                    'Support for Google Gemini (Pro, 1.5 Flash, 2.5 Flash)',
                    'Support for Mistral AI (Tiny, Small, Medium, Large)',
                    'Support for Anthropic Claude (Haiku, Sonnet, Opus)',
                    'Custom API support with flexible endpoints',
                    'Robust fallback mechanisms for all providers',
                    '30-second timeout for all API requests',
                    'Provider-specific optimized prompts'
                ]
            },
            apiKeys: {
                title: '🔑 Multi-Provider API Key Management',
                improvements: [
                    'Separate encrypted keys per AI provider',
                    'Automatic key switching based on selected provider',
                    'Show/Hide API key toggle in settings',
                    'Test Connection button with real-time validation',
                    'Provider-specific API key creation links',
                    'Success indicator after successful API test',
                    'Migration from old apiKey to new apiKeys structure',
                    'Cache invalidation on key changes'
                ]
            },
            persistence: {
                title: '💾 Persistent Story Input',
                improvements: [
                    'Text survives page reloads (localStorage)',
                    'Auto-save on every change (reactive)',
                    'Auto-load on page mount',
                    'Clear button removes text and storage',
                    'Textarea remains visible after generation',
                    'Edit and regenerate workflow optimized'
                ]
            },
            caching: {
                title: '⚡ Smart Caching System',
                improvements: [
                    '7-day cache for story generations',
                    'Text-based cache keys (different text = new AI call)',
                    'Cache invalidation after settings save',
                    'Validation to prevent caching errors',
                    'Never cache invalid or empty results',
                    'Settings cache (100ms) prevents excessive calls'
                ]
            },
            staticPages: {
                title: '📄 Static Pages Architecture',
                improvements: [
                    'Data-driven architecture with JSON content',
                    'Privacy Policy (/privacy)',
                    'Legal Notice (/legal)',
                    'Multi-language support (DE/EN, English fallback)',
                    '10 reusable content types',
                    'Consistent styling with dark/light mode',
                    'WCAG 2.1 compliant color contrasts',
                    'Robust Back to Top button with multiple scroll methods'
                ]
            }
        },
        ui: {
            storyMode: {
                title: '🎨 Story Mode UX',
                improvements: [
                    'AI model info badges (provider + model)',
                    'Yellow active button when Story Mode enabled',
                    'Muted inactive button with yellow border',
                    'Clear button inside textarea (top-right)',
                    'Textarea keeps visibility for editing',
                    'Success/error messages with provider name',
                    'Minimum 40 characters validation'
                ]
            },
            settings: {
                title: '⚙️ Settings UI Refinement',
                improvements: [
                    'API key input with inline Show/Hide button',
                    'Test Connection button integrated into field',
                    'Gradient fade-out for long API keys (z-5)',
                    'Buttons perfectly centered (inset-y-0)',
                    'Success icon next to provider dropdown',
                    'Consistent p-4 spacing (matches Contact Form)',
                    'Conditional rendering for Custom API fields',
                    'Saved keys indicator for other providers'
                ]
            },
            layout: {
                title: '📐 Layout & Spacing',
                improvements: [
                    'Consistent input height across all forms',
                    'Perfect button vertical centering',
                    'Gradient stays inside border (inset-y-[1px])',
                    'Rounded corners on gradients (rounded-r-[11px])',
                    'Z-index layering: Input(0) → Gradient(5) → Buttons(10)',
                    'Responsive gradient width (w-32 valid, w-20 short)'
                ]
            }
        },
        technical: {
            ai: {
                title: '🧠 AI Provider Integration',
                improvements: [
                    'Timeout mechanism (fetchWithTimeout)',
                    'Model fallback chains for reliability',
                    'Gemini: Tries v1beta/v1, header/url auth, multiple models',
                    'OpenAI: Tries gpt-3.5-turbo, gpt-4o-mini',
                    'Claude: Tries haiku, sonnet with correct headers',
                    'Mistral: Tries tiny, small with safe_prompt=false',
                    'Custom API: Flexible format (openai/claude/raw)',
                    'Error messages guide users to fix issues'
                ]
            },
            dataFlow: {
                title: '🔄 Data Flow Optimization',
                improvements: [
                    'invalidateSettingsCache() after all updates',
                    'getCurrentUserSettings() with 100ms cache',
                    'effectiveSettings includes userSettings + pendingChanges',
                    'Automatic API key migration on load',
                    'localStorage.USER_PREFERENCES.metadata.settings structure',
                    'Immediate currentAccount.metadata.settings update',
                    'Prevents backend from overwriting local settings'
                ]
            },
            validation: {
                title: '✅ Enhanced Validation',
                improvements: [
                    'API key format validation per provider',
                    'Story Mode settings validation',
                    'Cache result validation (Array with emojis)',
                    'Emoji validation (filters non-emoji characters)',
                    'Settings tier validation (FREE vs PRO)',
                    'Custom API endpoint validation'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Bug Fixes',
                improvements: [
                    'Fixed API key not updating after change',
                    'Fixed old key being used instead of new key',
                    'Fixed cache returning errors',
                    'Fixed inconsistent return types (Array vs Object)',
                    'Fixed Story Mode button staying disabled',
                    'Fixed settings not persisting after reload',
                    'Fixed CORS on localhost (proper warnings)',
                    'Fixed Back to Top not scrolling'
                ]
            },
            ui: {
                title: '🎨 UI/UX Bug Fixes',
                improvements: [
                    'Fixed gradient covering input border',
                    'Fixed button vertical misalignment',
                    'Fixed icon duplications in button text',
                    'Fixed border colors for muted buttons',
                    'Fixed dark mode gradient visibility',
                    'Fixed A11y warnings (tabindex, aria-invalid)',
                    'Fixed input spacing inconsistency'
                ]
            }
        }
    },
    '0.5.9': {
        date: 'October 10, 2025',
        core: {
            dataFlow: {
                title: '🔄 Complete Data Flow Refactor',
                improvements: [
                    'Implemented bi-directional sync: Frontend ↔ Backend ↔ Google Sheets',
                    'Fixed usageHistory preservation during settings updates',
                    'Added fresh metadata loading from localStorage (never stale)',
                    'Backend response now syncs back to all stores automatically',
                    'Smart merge in n8n: preserves usageHistory (never deletes)',
                    'Multi-store sync: localStorage + currentAccount + usageHistory stores'
                ]
            },
            generation: {
                title: '🎯 Unified Generation System',
                improvements: [
                    'Removed duplicate limit checks (checkLimits, isDailyLimitReached)',
                    'Single source of truth: validateUserLimits() for all checks',
                    'Consistent flow: generateRandomEmojis() and generateEmojis() use same logic',
                    'Removed hard redirects on limit (Modal instead for better UX)',
                    'Clean success handlers with proper error handling',
                    'Optimistic updates with localStorage verification'
                ]
            },
            navigation: {
                title: '🧭 Language-Aware Navigation',
                improvements: [
                    'Fixed all account redirects to include language prefix',
                    'Header.svelte: Language-aware account navigation',
                    'modalStore.js: Dynamic language-based redirects',
                    'EmojiDisplay.svelte: Removed hard redirect on limit',
                    'Consistent routing across all components'
                ]
            }
        },
        backend: {
            n8n: {
                title: '⚡ n8n Workflow Optimization',
                improvements: [
                    'Robust Process Update node with smart merge logic',
                    'UsageHistory preservation: incoming vs existing comparison',
                    'Safe JSON parsing with fallbacks',
                    'Always outputs JSON strings for Google Sheets compatibility',
                    'Extensive logging for debugging',
                    'Handles both string and object metadata formats'
                ]
            },
            api: {
                title: '🔧 Backend API Consistency',
                improvements: [
                    'Consistent webhook URLs across all operations',
                    'Localhost support with direct n8n calls',
                    'Action field required for all n8n requests',
                    'Fresh metadata always sent to backend',
                    'Response parsing handles double-escaped JSON'
                ]
            }
        },
        technical: {
            dataIntegrity: {
                title: '🔐 Data Integrity & Consistency',
                improvements: [
                    'UsageHistory never lost during any update operation',
                    'Settings update preserves all metadata fields',
                    'Daily usage increment extends usageHistory correctly',
                    'Google Sheets: 4-week test data format provided',
                    'Verification steps after every localStorage write',
                    'Multi-layer fallbacks for all data operations'
                ]
            },
            architecture: {
                title: '🏗️ Clean Architecture',
                improvements: [
                    'Single source of truth for limits (limits.js)',
                    'Centralized daily usage (dailyUsageStore.js)',
                    'Unified user data (userDataStore.js)',
                    'Removed all redundant functions',
                    'Clear separation of concerns',
                    'Consistent patterns across all stores'
                ]
            }
        },
        documentation: {
            title: '📝 Comprehensive Documentation',
            improvements: [
                'N8N_WORKFLOW_UPDATE_GUIDE.md - Step-by-step n8n setup',
                'DEBUG_DATA_FLOW.md - Complete flow analysis',
                'GENERATION_SYSTEM_REFACTOR.md - Architecture overview',
                'CLEANUP_SUMMARY.md - All fixes documented',
                'process-update-node-FIXED.js - Production-ready n8n code'
            ]
        }
    },
    '0.5.8': {
        date: 'October 10, 2025',
        core: {
            charts: {
                title: '📊 SVG Charts & UsageHistory',
                improvements: [
                    'Larger charts (200px → 240px height)',
                    'Edge-to-edge rendering with -mx-4 negative margins',
                    'Optimized chart padding (minimal side space)',
                    'Demo overlay with strong shadows and glassmorphism',
                    'Orange color for demo charts (#f97316)',
                    'Automatic data loading from n8n on localhost',
                    'UsageHistory auto-increments with each emoji generation'
                ]
            },
            account: {
                title: '👤 Account System Improvements',
                improvements: [
                    'Smart username fallback: settings > profile > email prefix > "there"',
                    'Fixed "User" placeholder - now shows actual names',
                    'Complete logout cleanup: all stores + storage + session flags',
                    'Account creation initializes empty usageHistory array',
                    'Session restore loads full data from n8n (even on localhost)',
                    'Localhost development: direct n8n calls bypass Vercel 404s'
                ]
            }
        },
        ui: {
            components: {
                title: '🎨 UI Component Polish',
                improvements: [
                    'LineChart: Optimized padding (right: 15px)',
                    'Demo overlay: Stronger shadows with multiple layers',
                    'NotFound slider: Smooth momentum scrolling',
                    'Emoji spacing: Consistent gap-2 (8px)',
                    'Modal translations: closeModal, modalClosesIn',
                    'ContextBadge: Size affects spacing + text, width property added'
                ]
            },
            spacing: {
                title: '📐 Spacing Optimization',
                improvements: [
                    'Chart container: p-6 mb-6 (unified 8-point grid)',
                    'Demo card: px-8 py-10 (asymmetric, optimized)',
                    'Progress bar: mb-3 (better visual rhythm)',
                    'Header: mb-6 (more breathing room)',
                    'Consistent Tailwind spacing throughout'
                ]
            }
        }
    },
    '0.5.7': {
        date: 'October 10, 2025',
        core: {
            userSettings: {
                title: '🎯 Complete UserSettings System Overhaul',
                improvements: [
                    'Implemented Single Source of Truth for all settings',
                    'Added tier-aware defaults (FREE vs PRO) with automatic merging',
                    'Fixed settings not displaying for FREE users',
                    'Fixed language/theme dropdowns showing incorrect values',
                    'Implemented bidirectional sync: Buttons ↔ UserSettings',
                    'Added settings validation and sanitization',
                    'Added comprehensive debugging tools (window.keymojiDebug)',
                    'Created automated test suite for settings',
                    'Implemented controlled component pattern (removed bind:value anti-pattern)',
                    'Added optimistic updates with rollback on error'
                ]
            },
            sync: {
                title: '🔄 Synchronization & Data Flow',
                improvements: [
                    'Language buttons now sync with UserSettings dropdown',
                    'Theme toggle button syncs with UserSettings dropdown',
                    'Settings persist correctly after page reload',
                    'localStorage is now primary source, cookies as fallback',
                    'All stores synchronized: currentLanguage ↔ userSettings.language',
                    'All stores synchronized: darkMode ↔ userSettings.theme',
                    'Eliminated race conditions in session restore',
                    'Session restore no longer overwrites user settings',
                    'Reduced 4 simultaneous API calls to 1 call'
                ]
            },
            architecture: {
                title: '🏗️ Architecture & Best Practices',
                improvements: [
                    'Created new SettingsManager with idempotent functions',
                    'Implemented Controlled Components pattern (no bind: on props)',
                    'Added comprehensive logging for debugging',
                    'Separated concerns: Presentation ↔ Container ↔ Store ↔ API',
                    'Implemented proper error handling with fallbacks',
                    'Added validation before save, sanitization for tier limits'
                ]
            }
        },
        backend: {
            api: {
                title: '🔧 Backend & n8n Integration',
                improvements: [
                    'Fixed n8n workflow JSON corruption (character array bug)',
                    'Implemented smart merge: only update when data provided',
                    'Optimized CORS handling for localhost development',
                    'Improved webhook payload structure',
                    'Added proper lastLogin tracking',
                    'Enhanced logging for better debugging',
                    'Created n8n workflow v2 with empty data check'
                ]
            }
        },
        ui: {
            buttons: {
                title: '🎨 UI Consistency & Accessibility',
                improvements: [
                    'Standardized all buttons: hover scale-105, focus ring, active scale-95',
                    'Created reusable Tooltip component',
                    'Enhanced Button component with tooltip support',
                    'Improved emoji centering in icon-only buttons',
                    'Added consistent focus states for accessibility',
                    'Implemented proper aria-labels throughout'
                ]
            },
            contextBadge: {
                title: '🏷️ ContextBadge Enhancements',
                improvements: [
                    'Fixed duplicate tier text display',
                    'Added account age calculation (days since creation)',
                    'Fixed createdAt source (API/Google Sheets priority)',
                    'Improved tooltip with age information',
                    'Better conditional rendering for interactive vs static'
                ]
            }
        },
        technical: {
            performance: {
                title: '⚡ Performance Optimizations',
                improvements: [
                    'Prevented duplicate session restore calls with flags',
                    'Optimized settings initialization (cached promises)',
                    'Reduced unnecessary re-renders with reactive patterns',
                    'Improved storage access patterns',
                    'Better component lifecycle management'
                ]
            },
            testing: {
                title: '🧪 Testing & Debugging',
                improvements: [
                    'Created automated test suite (window.testUserSettings)',
                    'Added debug tools (window.keymojiDebug)',
                    'Implemented consistency checks',
                    'Added comprehensive logging throughout',
                    'Created test helpers for manual testing'
                ]
            }
        },
        documentation: {
            title: '📝 Documentation',
            improvements: [
                'Added comprehensive CHANGELOG',
                'Created n8n workflow setup guides',
                'Added UserSettings architecture documentation',
                'Created testing and debugging guides',
                'Documented all data flows and synchronization'
            ]
        }
    },
    '0.5.6': {
        date: 'October 10, 2025',
        note: 'Internal iteration - n8n workflow fixes'
    },
    '0.5.5': {
        date: 'October 10, 2025',
        note: 'Internal iteration - settings validation'
    },
    '0.5.4': {
        date: 'October 10, 2025',
        note: 'Internal iteration - controlled components'
    },
    '0.5.3': {
        date: 'October 10, 2025',
        note: 'Internal iteration - race condition fixes'
    },
    '0.5.2': {
        date: 'October 10, 2025',
        note: 'Internal iteration - localStorage priority'
    },
    '0.5.1': {
        date: 'October 10, 2025',
        note: 'Internal iteration - tier-aware defaults'
    },
    '0.5.0': {
        date: 'August 2025',
        core: {
            debug: {
                title: 'Debug System Overhaul',
                improvements: [
                    'Fixed Debug Buttons: Top-right positioning, Header-style, 64px square dimensions',
                    'Clear All Storage: Direct access next to Debug button for immediate functionality',
                    'Comprehensive Debug Panel: Modals, Stores, Debug Tools with tab navigation',
                    'EraseButton Integration: Clear & Reload directly in Debug panel',
                    'UX/UI Best Practices: Consistent colors, hover effects, smooth animations'
                ]
            },
            layout: {
                title: 'Layout & Navigation',
                improvements: [
                    'FixedMenu Buttons: Unified 64px × 64px dimensions across all platforms',
                    'Desktop Donation Button: Text display, mobile icon-only in FixedMenu',
                    'Scrollbar Optimization: Eliminated layout shifts, overflow-x-hidden implementation',
                    'Mobile Responsiveness: Prevented horizontal scrollbars on mobile devices',
                    'Header-Style Consistency: All buttons use identical color schemes'
                ]
            },
            errorHandling: {
                title: 'Error Handling & Warnings',
                improvements: [
                    'Webpack Warnings Fixed: devError → devWarn, currentVersion → const',
                    'Manifest.json Cleanup: Removed invalid URL properties',
                    'Meta Tag Updates: Added mobile-web-app-capable meta tag',
                    'Service Worker Robustness: Eliminated uncaught promises',
                    'Graceful Degradation: Proper error responses instead of exceptions'
                ]
            }
        },
        technical: {
            scrollbar: {
                title: 'Scrollbar & Layout Fixes',
                improvements: [
                    'White Stripe Elimination: Systematic overflow-x-hidden application',
                    'Mobile Overflow Prevention: No horizontal scrollbars on mobile',
                    'EmojiDisplay Protection: overflow: visible for all devices',
                    'Layout Shift Prevention: Elegant scrollbar solution with Tailwind'
                ]
            },
            environment: {
                title: 'Environment & Debug Tools',
                improvements: [
                    'Centralized Environment Utils: isDebugMode(), isDevelopment()',
                    'Debug Panel Enhancement: Tab navigation, store tests, modal tests',
                    'Storage Management: Clear All Storage + Clear & Reload',
                    'App State Logging: Comprehensive debug information'
                ]
            }
        },
        features: {
            navigation: {
                title: 'Navigation & Routing',
                improvements: [
                    'Back Button Consistency: All pages use navigateToHome()',
                    'Mobile Menu Optimization: Compact button arrangement',
                    'Visual Hierarchy: Debug buttons above panel, no overlaps',
                    'Smooth Transitions: Slide animations for debug panel'
                ]
            }
        },
        lessons: {
            git: {
                title: 'CRITICAL LESSON LEARNED',
                improvements: [
                    '12 hours of work lost: Due to ignorance towards GitHub/Git',
                    'Best Practice: Always commit before major changes',
                    'Solution: Now systematic version updates with all changes',
                    'Learning: Git is not optional - it is ESSENTIAL for development',
                    'Silver Lining: Now we have a robust debug system!'
                ]
            }
        }
    },
    '0.4.9': {
        date: 'July 2025',
        core: {
            refactoring: {
                title: 'Code Refactoring & Optimization',
                improvements: [
                    'Centralized environment utilities: Consolidated debug functions',
                    'Service worker error handling: Proper error responses instead of throws',
                    'Component structure optimization: Removed unused imports and variables',
                    'CSS class consolidation: Eliminated duplicate scrollbar styling',
                    'Performance improvements: Reduced bundle size and improved load times'
                ]
            },
            seo: {
                title: 'SEO & Meta Tag Enhancements',
                improvements: [
                    'Dynamic title generation: Language-specific page titles',
                    'Meta tag optimization: Enhanced social sharing capabilities',
                    'Structured data improvements: Better search engine indexing',
                    'Canonical URL handling: Proper language-specific URLs',
                    'Open Graph enhancements: Improved social media previews'
                ]
            }
        },
        technical: {
            build: {
                title: 'Build System & Warnings',
                improvements: [
                    'Webpack warning resolution: Fixed all compilation warnings',
                    'Manifest.json validation: Removed invalid PWA properties',
                    'Meta tag standardization: Added mobile-web-app-capable',
                    'Service worker robustness: Eliminated uncaught promise errors',
                    'Development environment cleanup: Streamlined debug utilities'
                ]
            }
        }
    },
    '0.4.8': {
        date: 'June 2025',
        core: {
            scrollbar: {
                title: 'Scrollbar System Overhaul',
                improvements: [
                    'White stripe elimination: Systematic overflow-x-hidden implementation',
                    'Mobile overflow prevention: No horizontal scrollbars on mobile',
                    'Layout shift prevention: Elegant scrollbar solution with Tailwind',
                    'EmojiDisplay protection: overflow: visible for all devices',
                    'Cross-device compatibility: Consistent behavior across platforms'
                ]
            },
            layout: {
                title: 'Layout & Component Structure',
                improvements: [
                    'FixedMenu button standardization: Unified 64px × 64px dimensions',
                    'Header-style consistency: All buttons use identical styling',
                    'Debug button positioning: Top-right fixed with proper z-index',
                    'Mobile menu optimization: Compact button arrangement',
                    'Visual hierarchy improvements: Better component organization'
                ]
            }
        },
        technical: {
            css: {
                title: 'CSS & Styling Optimization',
                improvements: [
                    'Tailwind utility consolidation: Eliminated duplicate classes',
                    'Dark mode consistency: Unified color scheme across components',
                    'Responsive design improvements: Better mobile experience',
                    'Animation optimization: Smooth transitions and hover effects',
                    'Layout shift elimination: Proper overflow handling'
                ]
            }
        }
    },
    '0.4.7': {
        date: 'May 2025',
        core: {
            debug: {
                title: 'Debug System Implementation',
                improvements: [
                    'Debug panel creation: Comprehensive tab navigation system',
                    'Storage management tools: Clear All Storage + Clear & Reload',
                    'Environment utilities: Centralized debug and development functions',
                    'Modal testing framework: Complete modal system testing',
                    'Store state debugging: Real-time store state monitoring'
                ]
            },
            navigation: {
                title: 'Navigation & Routing Improvements',
                improvements: [
                    'Back button consistency: All pages use navigateToHome()',
                    'Language router optimization: Improved route handling',
                    'URL synchronization: Proper language-specific URL management',
                    'Navigation state management: Better route state handling',
                    'Mobile navigation enhancement: Improved mobile menu experience'
                ]
            }
        },
        technical: {
            environment: {
                title: 'Environment & Development Tools',
                improvements: [
                    'isDebugMode() implementation: Centralized debug detection',
                    'isDevelopment() utility: Environment-specific functionality',
                    'Debug logging system: Comprehensive error and warning logging',
                    'Development utilities: Streamlined development workflow',
                    'Environment configuration: Better development/production handling'
                ]
            }
        }
    },
    '0.4.6': {
        date: 'April 2025',
        core: {
            errorHandling: {
                title: 'Error Handling & Warnings',
                improvements: [
                    'Webpack warning resolution: Fixed devError import issues',
                    'Service worker robustness: Eliminated uncaught promise errors',
                    'Manifest.json cleanup: Removed invalid URL properties',
                    'Meta tag standardization: Added mobile-web-app-capable',
                    'Build system optimization: Clean compilation without warnings'
                ]
            },
            seo: {
                title: 'SEO & Meta Tag Updates',
                improvements: [
                    'Dynamic title generation: Language-specific page titles',
                    'Meta tag optimization: Enhanced social sharing capabilities',
                    'Structured data improvements: Better search engine indexing',
                    'Canonical URL handling: Proper language-specific URLs',
                    'Open Graph enhancements: Improved social media previews'
                ]
            }
        },
        technical: {
            build: {
                title: 'Build System & Performance',
                improvements: [
                    'Webpack optimization: Reduced bundle size and improved load times',
                    'Service worker error handling: Proper error responses',
                    'Development environment cleanup: Streamlined debug utilities',
                    'CSS optimization: Eliminated duplicate styles and classes',
                    'Performance monitoring: Better error tracking and logging'
                ]
            }
        }
    },
    '0.4.5': {
        date: 'April 2025',
        core: {
            layout: {
                title: 'Layout & Component Structure',
                improvements: [
                    'FixedMenu button standardization: Unified 64px × 64px dimensions',
                    'Header-style consistency: All buttons use identical styling',
                    'Debug button positioning: Top-right fixed with proper z-index',
                    'Mobile menu optimization: Compact button arrangement',
                    'Visual hierarchy improvements: Better component organization'
                ]
            },
            scrollbar: {
                title: 'Scrollbar System Implementation',
                improvements: [
                    'White stripe elimination: Systematic overflow-x-hidden application',
                    'Mobile overflow prevention: No horizontal scrollbars on mobile',
                    'Layout shift prevention: Elegant scrollbar solution with Tailwind',
                    'EmojiDisplay protection: overflow: visible for all devices',
                    'Cross-device compatibility: Consistent behavior across platforms'
                ]
            }
        },
        technical: {
            css: {
                title: 'CSS & Styling Optimization',
                improvements: [
                    'Tailwind utility consolidation: Eliminated duplicate classes',
                    'Dark mode consistency: Unified color scheme across components',
                    'Responsive design improvements: Better mobile experience',
                    'Animation optimization: Smooth transitions and hover effects',
                    'Layout shift elimination: Proper overflow handling'
                ]
            }
        }
    },
    '0.4.4': {
        date: 'March 2025',
        core: {
            debug: {
                title: 'Debug System Foundation',
                improvements: [
                    'Debug panel architecture: Tab navigation system design',
                    'Storage management implementation: Clear All Storage functionality',
                    'Environment utilities: Centralized debug and development functions',
                    'Modal testing framework: Complete modal system testing',
                    'Store state debugging: Real-time store state monitoring'
                ]
            },
            navigation: {
                title: 'Navigation & Routing Foundation',
                improvements: [
                    'Back button consistency: All pages use navigateToHome()',
                    'Language router optimization: Improved route handling',
                    'URL synchronization: Proper language-specific URL management',
                    'Navigation state management: Better route state handling',
                    'Mobile navigation enhancement: Improved mobile menu experience'
                ]
            }
        },
        technical: {
            environment: {
                title: 'Environment & Development Foundation',
                improvements: [
                    'isDebugMode() implementation: Centralized debug detection',
                    'isDevelopment() utility: Environment-specific functionality',
                    'Debug logging system: Comprehensive error and warning logging',
                    'Development utilities: Streamlined development workflow',
                    'Environment configuration: Better development/production handling'
                ]
            }
        }
    },
    '0.4.3': {
        date: 'February 2025',
        core: {
            seo: {
                title: 'SEO & Favicon Optimization',
                improvements: [
                    'Complete favicon setup for all platforms',
                    'Added structured data for rich snippets',
                    'Enhanced meta tags for social sharing',
                    'Improved Open Graph implementation',
                    'Added Twitter Card support',
                    'Microsoft Tile configuration',
                    'Safari Pinned Tab support'
                ]
            },
            performance: {
                title: 'Performance Enhancements',
                improvements: [
                    'Added DNS prefetch for external domains',
                    'Preconnect optimization for API calls',
                    'Improved resource loading priorities'
                ]
            }
        },
        technical: {
            favicon: {
                title: 'Favicon Implementation',
                improvements: [
                    'Multi-size favicon.ico support',
                    'Apple Touch Icons (120px, 152px, 180px)',
                    'Android Chrome icons (192px, 512px)',
                    'Microsoft Tile images',
                    'Safari mask icon preparation'
                ]
            }
        }
    },
    '0.4.2': {
        date: 'January 2025',
        core: {
            email: {
                title: 'Email Integration',
                improvements: [
                    'Enhanced contact form email system',
                    'Added dark/light mode support for emails',
                    'Improved newsletter subscription flow',
                    'Multi-language email templates'
                ]
            },
            backend: {
                title: 'Backend Integration',
                improvements: [
                    'Optimized Vercel serverless functions',
                    'Streamlined API communications',
                    'Enhanced error handling and validation',
                    'Improved form submission process'
                ]
            }
        },
        technical: {
            security: {
                title: 'Security Enhancements',
                improvements: [
                    'Better honeypot implementation',
                    'Email sanitization improvements',
                    'Robust input validation'
                ]
            }
        },
        features: {
            feedback: {
                title: 'User Feedback',
                improvements: [
                    'Clearer form response messaging',
                    'Improved error modal integration',
                    'Context-specific error handling'
                ]
            }
        }
    },
    '0.4.0': {
        date: 'December 2024',
        core: {
            optimization: {
                title: 'Optimization & Refactoring',
                improvements: [
                    'Centralized language configuration',
                    'Fixed routing and display issues',
                    'Standardized component styling',
                    'Improved ContactForm integration'
                ]
            },
            structure: {
                title: 'Project Structure',
                improvements: [
                    'Single source of truth for configuration',
                    'Consistent component layouts',
                    'Tailwind utility classes optimization',
                    'Centralized version management'
                ]
            }
        },
        technical: {
            accessibility: {
                title: 'Accessibility Improvements',
                improvements: [
                    'Consistent focus management',
                    'Enhanced keyboard navigation',
                    'Better screen reader support'
                ]
            }
        }
    },
    '0.3.0': {
        date: 'November 2024',
        core: {
            performance: {
                title: 'Performance Optimization',
                improvements: [
                    'Streamlined import structure',
                    'Improved initial load times',
                    'Enhanced state management'
                ]
            },
            accessibility: {
                title: 'Accessibility',
                improvements: ['Added comprehensive ARIA support']
            },
            errorHandling: {
                title: 'Error Handling',
                improvements: ['Enhanced clipboard operations']
            }
        },
        features: {
            storyMode: {
                title: 'Story Mode',
                improvements: ['Prepared foundation for upcoming release']
            },
            ui: {
                title: 'UI/UX',
                improvements: [
                    'Improved visual feedback',
                    'Enhanced user messaging'
                ]
            }
        }
    },
    '0.2.0': {
        date: 'October 2024',
        core: {
            languages: {
                title: 'Multi-language Support',
                improvements: [
                    'Added 15+ language options',
                    'Implemented language switching system',
                    'Added localized content'
                ]
            },
            darkMode: {
                title: 'Dark Mode',
                improvements: [
                    'Introduced system-wide dark theme',
                    'Added theme toggle',
                    'Improved color contrast'
                ]
            }
        },
        technical: {
            pwa: {
                title: 'PWA Support',
                improvements: [
                    'Added service worker',
                    'Implemented offline functionality',
                    'Added "Add to Home Screen" capability'
                ]
            }
        }
    },
    '0.1.1': {
        date: 'September 2024',
        features: {
            emojiGeneration: {
                title: 'Emoji Generation',
                improvements: [
                    'Improved randomization algorithm',
                    'Added emoji diversity',
                    'Enhanced generation speed'
                ]
            },
            interface: {
                title: 'User Interface',
                improvements: [
                    'Added copy to clipboard functionality',
                    'Improved mobile responsiveness',
                    'Enhanced button feedback'
                ]
            }
        }
    },
    '0.1.0': {
        date: 'August 2024',
        core: {
            initial: {
                title: 'Initial Release',
                improvements: [
                    'Basic emoji password generation',
                    'Simple copy functionality',
                    'Basic mobile support',
                    'Initial UI implementation'
                ]
            }
        }
    }
};
