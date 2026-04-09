export const versions = {
    '0.7.8': {
        date: 'April 9, 2026',
        core: {
            auth: {
                title: '🔑 OTP Code Authentication',
                improvements: [
                    'Replaced Magic Link click-flow with 7-digit OTP code via email',
                    'Cryptographically secure code generation (crypto.randomInt)',
                    'Smart label: Registration Code vs. Login Code based on account existence',
                    'New OTP input UI: large centered numeric input, auto-submit on 7 digits',
                    'Removed URL-parameter auto-verify logic from onMount',
                    'New secureVerifyOTP() export in accountStore'
                ]
            },
            ui: {
                title: '🎨 AI Setup Topbar',
                improvements: [
                    'Swiss AI and Own AI buttons moved to fixed announcement topbar',
                    'Removed border and border-radius from topbar buttons for smoother look',
                    'Banner auto-dismissal with 3-day localStorage TTL',
                    'Dynamic banner height via CSS custom property --banner-height'
                ]
            },
            cleanup: {
                title: '🧹 Code Cleanup',
                improvements: [
                    'Removed unused verify-magic-link.js and send-magic-link.js stubs',
                    'Removed isVerifyingMagicLink / magicLinkStatus / magicLinkError state',
                    'Updated resend-magic-link.js to OTP logic with 15min expiry',
                    'Added createOtpEmail() template to email-templates.js'
                ]
            }
        }
    },
    '0.7.7': {
        date: 'November 16, 2025',
        core: {
            codeQuality: {
                title: '🧹 Code Cleanup & Quality Improvements',
                improvements: [
                    'Console.log Cleanup: Removed all console.log statements except dedicated debug functions',
                    'Comment Standardization: Added three-line English header comments to all files',
                    'Debug Function Consolidation: One debug function per component/utility',
                    'Code Deduplication: Removed redundant variables and unused code',
                    'Import/Export Consistency: Fixed all import/export inconsistencies',
                    'TypeScript Migration: Continued migration of utils and stores to TypeScript'
                ]
            },
            ui: {
                title: '🎨 UI/UX Optimizations',
                improvements: [
                    'Loading Screen Consolidation: Single reusable LoadingScreen component with debug info',
                    'Story Mode Buttons: Optimized Swiss AI and Custom AI buttons with animations',
                    'Button States: Story Mode button disabled when not logged in',
                    'Text Optimization: Shortened button texts for better UX (one-line only)',
                    'Emoji Consistency: Removed duplicate emojis, consistent emoji usage',
                    'Footer Layout: Optimized mobile and desktop footer layouts',
                    'Dark/Light Mode: Consistent styling across all components'
                ]
            },
            routing: {
                title: '🛣️ Routing & Static HTML Generation',
                improvements: [
                    'Static Route Generation: Improved script to use actual build assets with contenthash',
                    '.htaccess Optimization: Better handling of static assets and language-prefixed routes',
                    'Route Priority: Fixed route matching order for proper SPA routing',
                    'Trailing Slash Handling: Consistent URL normalization across all routes',
                    'Static HTML Files: Generated for all routes and languages for better SEO',
                    'Asset Path Resolution: Dynamic asset path detection in generated HTML files'
                ]
            },
            translations: {
                title: '🌍 Translation Updates',
                improvements: [
                    'Story Mode Instructions: Updated all languages with clearer AI selection guidance',
                    'Button Labels: Consistent translations for "Swiss AI" and "Use your own AI"',
                    'Short Labels: Added setupStoryModeShort and setupStoryModeSwissShort for compact buttons',
                    'Language Coverage: All 15 languages updated with new instruction texts'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Bug Fixes',
                improvements: [
                    'Fixed: runtime.lastError handling for Chrome extension compatibility',
                    'Fixed: Memory leaks in AccountManager (duplicate onMount blocks)',
                    'Fixed: Missing closing div tags in EmojiDisplay component',
                    'Fixed: TypeScript compilation errors in multiple stores and utils',
                    'Fixed: Import resolution issues with svelte/store and appStores',
                    'Fixed: Language switching reactivity issues'
                ]
            },
            errorHandling: {
                title: '🛡️ Error Handling Improvements',
                improvements: [
                    'Global Error Handler: Added window error listeners for runtime.lastError',
                    'Service Worker: Improved error handling for message port closed errors',
                    'Magic Link Listener: Added cleanup on page unload to prevent memory leaks',
                    'Event Listener Cleanup: Proper cleanup of all event listeners',
                    'Chrome Extension Compatibility: Silent handling of benign extension errors'
                ]
            },
            build: {
                title: '🔧 Build & Deployment Fixes',
                improvements: [
                    'GitHub Actions: Optimized workflows to prevent duplicate builds',
                    'Staging Branch: Enabled automatic FTP deployment for staging branch',
                    'Webpack Alias: Added svelte/store alias for modalStore.ts compatibility',
                    'Static Assets: Fixed asset path resolution in generated HTML files',
                    'Font Loading: Fixed font paths and @font-face declarations',
                    'Build Cache: Improved cache invalidation for better build reliability'
                ]
            }
        }
    },
    '0.7.6': {
        date: 'November 15, 2025',
        core: {
            routing: {
                title: '🛣️ Routing & Static Site Generation',
                improvements: [
                    'Static HTML Generation: Script generates HTML files for all routes and languages',
                    'Route Handling: Improved handling of routes without language prefix (/account, /contact)',
                    '.htaccess Rules: Enhanced rules for language-prefixed routes and static files',
                    'Trailing Slash: Consistent URL normalization with trailing slash handling',
                    'Route Matching: Fixed route priority order for proper SPA fallback',
                    'SEO Optimization: Static HTML files with proper meta tags for better indexing'
                ]
            },
            environment: {
                title: '⚙️ Environment & Build System',
                improvements: [
                    'Environment Variables: Complete migration from process.env to import.meta.env',
                    'Webpack Configuration: Fixed module resolution for TypeScript files',
                    'Build Scripts: Optimized static route generation and asset handling',
                    'TypeScript Support: Improved TypeScript compilation in build process',
                    'Asset Management: Better handling of versioned assets with contenthash'
                ]
            },
            seo: {
                title: '🔍 SEO & Meta Tags',
                improvements: [
                    'Hreflang Links: Removed duplicate hreflang tags, static tags in index.html',
                    'Meta Tag Management: Improved updateMetaTags to respect static tags',
                    'Social Preview: Updated social-preview.php to use SVG logo instead of emoji',
                    'Structured Data: Enhanced structured data generation for better SEO',
                    'Canonical URLs: Proper canonical URL handling for all routes'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Routing Fixes',
                improvements: [
                    'Fixed: Redirect loops in route handling',
                    'Fixed: Routes not loading before Router initialization',
                    'Fixed: Missing static HTML files for routes without language prefix',
                    'Fixed: Route matching order causing incorrect component rendering',
                    'Fixed: Trailing slash inconsistencies causing 404 errors'
                ]
            },
            build: {
                title: '🔧 Build System Fixes',
                improvements: [
                    'Fixed: Import resolution errors in AccountManager and FixedMenu',
                    'Fixed: TypeScript compilation errors in multiple files',
                    'Fixed: Webpack alias issues for appStores.ts',
                    'Fixed: Prerender-meta.js SEO functions inline definition',
                    'Fixed: Font path issues in CSS causing build errors'
                ]
            },
            ui: {
                title: '🎨 UI Fixes',
                improvements: [
                    'Fixed: White screen issue in AccountManager',
                    'Fixed: Font loading for Sindarin (sjn) language',
                    'Fixed: Footer layout issues on mobile and desktop',
                    'Fixed: Language switching reactivity problems',
                    'Fixed: Permissions-Policy header warnings'
                ]
            }
        }
    },
    '0.7.5': {
        date: 'November 14, 2025',
        core: {
            typescript: {
                title: '📘 TypeScript Migration Foundation',
                improvements: [
                    'TypeScript Setup: Created tsconfig.json with Svelte support',
                    'Type Definitions: Added Account, API, and Settings type interfaces',
                    'Store Migration: Migrated appStores, modalStore, blogLikesStore, seoStore to TypeScript',
                    'Utils Migration: Migrated storyModeAI, blogApi, apiCache, accountHelpers to TypeScript',
                    'Type Safety: Improved function signatures and parameter validation',
                    'Build Integration: TypeScript loader configured in Webpack'
                ]
            },
            codeQuality: {
                title: '🔧 Code Quality & Architecture',
                improvements: [
                    'Code Consolidation: Centralized safeSetTimeout and generateClientFingerprint utilities',
                    'API Call Optimization: Eliminated duplicate API calls during login flow',
                    'Race Condition Fixes: Removed setTimeout delays in async flows',
                    'Error Handling: Standardized error handling patterns across stores',
                    'Code Deduplication: Removed duplicate code across multiple files',
                    'Import Cleanup: Fixed import/export inconsistencies'
                ]
            },
            performance: {
                title: '⚡ Performance Optimizations',
                improvements: [
                    'Lazy Loading: Implemented dynamic route loading for better performance',
                    'Code Splitting: Optimized Webpack configuration with separate chunks',
                    'Cache Strategy: Improved cache invalidation and management',
                    'Bundle Size: Reduced maxSize from 244KB to 200KB for better loading',
                    'Store Synchronization: Improved cross-store data consistency',
                    'Reactive Optimization: Memoized expensive computations'
                ]
            },
            tailwind: {
                title: '🎨 Tailwind CSS Optimization',
                improvements: [
                    'PurgeCSS Configuration: Optimized with proper safelist',
                    'Custom Utilities: Added scrollbar styles and common patterns',
                    'Build Optimization: Fixed custom utilities for Tailwind 2.2.19 compatibility',
                    'CSS Minimization: Improved CSS minification in production builds',
                    'Dark Mode: Enhanced dark mode support across all components'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Bug Fixes',
                improvements: [
                    'Fixed: Race conditions from setTimeout delays in async flows',
                    'Fixed: Duplicate API calls during login (reduced by 50-70%)',
                    'Fixed: Import resolution errors in TypeScript files',
                    'Fixed: Build errors from Tailwind custom utilities',
                    'Fixed: Code duplication across multiple stores and utils'
                ]
            },
            ci: {
                title: '🔄 CI/CD Improvements',
                improvements: [
                    'GitHub Actions: Created workflows for tests, builds, and deployment',
                    'Automated Testing: Added test workflows for code quality',
                    'Build Verification: Improved build verification in CI pipeline',
                    'Deployment: Optimized FTP deployment process',
                    'Version Management: Automated version bumping with Git hooks'
                ]
            },
            documentation: {
                title: '📚 Documentation & Planning',
                improvements: [
                    'Cursor Rules: Created comprehensive .cursorrules for code standards',
                    'Refactor Plan: Documented complete refactoring strategy',
                    'Migration Guide: Created Svelte 5 migration guide',
                    'Session Summary: Comprehensive documentation of refactoring session',
                    'Code Analysis: Detailed analysis of codebase structure and improvements'
                ]
            }
        }
    },
    '0.7.4': {
        date: 'November 13, 2025',
        core: {
            performance: {
                title: '⚡ Performance & API Optimization',
                improvements: [
                    'API Call Reduction: Eliminated duplicate API calls during login flow (50-70% reduction)',
                    'Data Flow Optimization: Centralized dailyUsage loading logic (single source of truth)',
                    'Race Condition Fixes: Removed setTimeout delays, proper async/await chains',
                    'Reactive Block Optimization: Memoized getEffectiveValue calls in UserSettings',
                    'Store Synchronization: Improved cross-store data consistency',
                    'Cache Strategy: Optimized cache invalidation to prevent unnecessary API calls'
                ]
            },
            codeQuality: {
                title: '🔧 Code Quality & Architecture',
                improvements: [
                    'Centralized Utilities: Created loadDailyUsage() utility for consistent data loading',
                    'Code Deduplication: Removed ~100 lines of duplicate code across stores',
                    'Deprecated Code Removal: Cleaned up unused functions and legacy code',
                    'Error Handling: Standardized error handling patterns across all stores',
                    'Type Safety: Improved function signatures and parameter validation',
                    'Documentation: Comprehensive optimization strategy documentation'
                ]
            },
            dataIntegrity: {
                title: '🔐 Data Integrity & Consistency',
                improvements: [
                    'Single Source of Truth: Consistent priority for dailyUsage loading across all functions',
                    'Store Synchronization: Proper data flow from API → accountStore → dailyUsageStore → UI',
                    'Metadata Cleaning: Prevents duplicate fields in metadata (ongoing improvements)',
                    'createdAt Preservation: Never overwritten after initial account creation',
                    'dailyUsage Preservation: Explicitly preserved during all update operations'
                ]
            }
        },
        fixes: {
            critical: {
                title: '🐛 Critical Performance Fixes',
                improvements: [
                    'Fixed: Duplicate API calls during login (3-4 calls → 1 call)',
                    'Fixed: Race conditions from setTimeout delays in async flows',
                    'Fixed: Redundant loadUsageFromAPI calls when dailyUsage already in accountData',
                    'Fixed: Inconsistent dailyUsage loading logic across multiple functions',
                    'Fixed: Unnecessary reactive block computations in UserSettings'
                ]
            },
            optimization: {
                title: '⚡ Performance Optimizations',
                improvements: [
                    'Login Flow: Reduced API calls by 50-70% through data reuse',
                    'Reactive Updates: Optimized UserSettings reactive blocks with memoization',
                    'Data Loading: Centralized dailyUsage loading eliminates code duplication',
                    'Store Updates: Improved cross-store synchronization without redundant calls',
                    'Cache Strategy: Better cache invalidation prevents unnecessary refreshes'
                ]
            },
            codeQuality: {
                title: '🧹 Code Quality Improvements',
                improvements: [
                    'Removed deprecated resetSessionRestoreFlag() function',
                    'Consolidated dailyUsage loading into single utility function',
                    'Eliminated ~100 lines of duplicate code',
                    'Improved error handling consistency across stores',
                    'Better separation of concerns with centralized utilities'
                ]
            }
        }
    },
    '0.7.3': {
        date: 'November 13, 2025',
        core: {
            dataIntegrity: {
                title: '🔐 Data Integrity & Single Source of Truth',
                improvements: [
                    'Metadata Cleaner: Prevents duplicate fields in metadata',
                    'Single Source of Truth: Fields with own columns are NOT in metadata',
                    'dailyUsage Preservation: Explicitly preserved when updating name or settings',
                    'createdAt Preservation: Never overwritten after initial account creation',
                    'Metadata cleaning in frontend and backend',
                    'ES6 Module exports for backend compatibility'
                ]
            },
            magicLink: {
                title: '🔗 Magic-Link Settings Fix',
                improvements: [
                    'Settings loading after Magic-Link login fixed',
                    'Robust fallback chain for settings loading',
                    'User settings displayed correctly after login',
                    'Priority-based settings extraction from account data'
                ]
            },
            backend: {
                title: '⚙️ Backend & Workflow Improvements',
                improvements: [
                    'Enhanced dailyUsage preservation logic',
                    'Explicit metadata cleaning to exclude column fields',
                    'Improved CORS handling for robust requests',
                    'Timeout handling for webhook requests',
                    'Enhanced error logging and debugging'
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
                    'Fixed: ReferenceError in dailyUsage initialization',
                    'Fixed: CORS preflight requests failing',
                    'Fixed: ES6 module exports in backend'
                ]
            },
            dataFlow: {
                title: '🔄 Data Flow Optimization',
                improvements: [
                    'Priority-based dailyUsage loading from multiple sources',
                    'Settings preservation during account updates',
                    'Correct initialization order for usage history',
                    'Proper parsing of metadata and profile data',
                    'Cache management for settings and usage data'
                ]
            },
            codeQuality: {
                title: '⚡ Code Quality & Best Practices',
                improvements: [
                    'Centralized metadata cleaning utility',
                    'Consistent error handling across operations',
                    'Comprehensive logging for debugging',
                    'Robust validation for data integrity',
                    'Improved error recovery mechanisms'
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
                    'Removed sensitive URLs from .env.example (security best practice)',
                    'API URLs now configurable via environment variables',
                    'Webpack supports environment variable patterns',
                    'Security warnings when fallback URLs are used in development',
                    'Test scripts updated to read configuration from environment',
                    'Documentation updated with security best practices'
                ]
            },
            environment: {
                title: '⚙️ Environment Variables Best Practices',
                improvements: [
                    'Clean .env.example with only required variables and placeholders',
                    'Priority system for environment variable loading',
                    'Comprehensive environment variables documentation',
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
                    'Support for multiple environment variable patterns',
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
                    'Only first and last emojis saved to storage',
                    'Middle emojis replaced with placeholder for privacy',
                    'Prevents full password exposure in recent emojis',
                    'Consistent masking across all pages'
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
                    'Cleanup of expired cache entries',
                    'Synchronous localStorage initialization',
                    'Automatic migration of legacy data structures'
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
                    'Mock mode for local custom API testing',
                    'Detailed error messages with troubleshooting steps',
                    'Comprehensive testing documentation',
                    'Enhanced timeout error detection'
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
                    'Provider-specific configuration support',
                    'Success indicator after successful API test',
                    'Migration from legacy key structure',
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
                    'Gradient stays inside border',
                    'Rounded corners on gradients',
                    'Proper z-index layering for UI elements',
                    'Responsive gradient width for different states'
                ]
            }
        },
        technical: {
            ai: {
                title: '🧠 AI Provider Integration',
                improvements: [
                    'Timeout mechanism for API requests',
                    'Model fallback chains for reliability',
                    'Multiple provider support with fallback strategies',
                    'Flexible authentication methods',
                    'Custom API support with multiple formats',
                    'Error messages guide users to fix issues'
                ]
            },
            dataFlow: {
                title: '🔄 Data Flow Optimization',
                improvements: [
                    'Cache invalidation after all updates',
                    'Cached settings retrieval for performance',
                    'Effective settings includes user settings and pending changes',
                    'Automatic data migration on load',
                    'Consistent storage structure',
                    'Immediate account settings synchronization',
                    'Prevents backend from overwriting local settings'
                ]
            },
            validation: {
                title: '✅ Enhanced Validation',
                improvements: [
                    'API key format validation per provider',
                    'Story Mode settings validation',
                    'Cache result validation',
                    'Emoji validation (filters invalid characters)',
                    'Settings tier validation',
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
                title: '⚡ Workflow Optimization',
                improvements: [
                    'Robust update node with smart merge logic',
                    'UsageHistory preservation with comparison logic',
                    'Safe JSON parsing with fallbacks',
                    'Consistent output format for backend compatibility',
                    'Extensive logging for debugging',
                    'Handles both string and object metadata formats'
                ]
            },
            api: {
                title: '🔧 Backend API Consistency',
                improvements: [
                    'Consistent API endpoints across all operations',
                    'Localhost support for development',
                    'Required action field for all requests',
                    'Fresh metadata always sent to backend',
                    'Response parsing handles various JSON formats'
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
                    'Test data format support for development',
                    'Verification steps after every storage write',
                    'Multi-layer fallbacks for all data operations'
                ]
            },
            architecture: {
                title: '🏗️ Clean Architecture',
                improvements: [
                    'Single source of truth for limits',
                    'Centralized daily usage management',
                    'Unified user data management',
                    'Removed all redundant functions',
                    'Clear separation of concerns',
                    'Consistent patterns across all stores'
                ]
            }
        },
        documentation: {
            title: '📝 Comprehensive Documentation',
            improvements: [
                'Workflow update guides for backend setup',
                'Data flow analysis documentation',
                'Architecture overview documentation',
                'Cleanup summary with all fixes documented',
                'Production-ready code examples'
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
                    'Smart username fallback with multiple sources',
                    'Fixed placeholder - now shows actual names',
                    'Complete logout cleanup: all stores and storage',
                    'Account creation initializes empty usageHistory array',
                    'Session restore loads full data from backend',
                    'Localhost development: direct backend calls for testing'
                ]
            }
        },
        ui: {
            components: {
                title: '🎨 UI Component Polish',
                improvements: [
                    'LineChart: Optimized padding',
                    'Demo overlay: Enhanced shadows with multiple layers',
                    'NotFound slider: Smooth momentum scrolling',
                    'Emoji spacing: Consistent spacing throughout',
                    'Modal translations: Improved localization',
                    'ContextBadge: Enhanced sizing and spacing properties'
                ]
            },
            spacing: {
                title: '📐 Spacing Optimization',
                improvements: [
                    'Chart container: Unified spacing grid',
                    'Demo card: Optimized asymmetric spacing',
                    'Progress bar: Better visual rhythm',
                    'Header: Improved spacing',
                    'Consistent spacing system throughout'
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
                    'Standardized all buttons with consistent interactions',
                    'Created reusable Tooltip component',
                    'Enhanced Button component with tooltip support',
                    'Improved emoji centering in icon-only buttons',
                    'Added consistent focus states for accessibility',
                    'Implemented proper ARIA labels throughout'
                ]
            },
            contextBadge: {
                title: '🏷️ ContextBadge Enhancements',
                improvements: [
                    'Fixed duplicate tier text display',
                    'Added account age calculation',
                    'Fixed createdAt source with proper priority',
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
                    'Created automated test suite',
                    'Added debug tools for development',
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
                'Created workflow setup guides',
                'Added architecture documentation',
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
