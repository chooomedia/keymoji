// src/index.js
import './index.css'; // Essential: Import Tailwind CSS
import LanguageRouter from './routes/LanguageRouter.svelte';
import { isProduction } from './utils/environment';
import { closeModal, isModalVisible } from './stores/modalStore';

function displayKeymojiConsoleArt() {
    if (!isProduction()) return; // Nur im Build anzeigen

    const asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                                                                      ║
    ║       ██   ██ ███████ ██    ██ ███    ███  ██████       ██  ██       ║
    ║       ██  ██  ██       ██  ██  ████  ████ ██    ██      ██  ██       ║
    ║       █████   █████     ████   ██ ████ ██ ██    ██      ██  ██       ║
    ║       ██  ██  ██         ██    ██  ██  ██ ██    ██ ██   ██  ██       ║
    ║       ██   ██ ███████    ██    ██      ██  ██████  ████████ ██       ║
    ║                                                                      ║
    ║                           Emoji Security                             ║
    ║                                                                      ║
    ╠══════════════════════════════════════════════════════════════════════╣
    ║                                                                      ║
    ║  Developed by: Christopher E. Matt                                   ║
    ║  Web: https://keymoji.wtf                                            ║
    ║  Kontakt: hello@keymoji.wtf                                          ║
    ║                                                                      ║
    ║  Tech Stack:                                                         ║
    ║     • Frontend: Svelte + Tailwind CSS + Webpack                      ║
    ║     • Backend: Vercel Serverless + Automations                       ║
    ║                                                                      ║
    ║  Features:                                                           ║
    ║     • 15+ Languages Support (incl. klingon & elvish)                 ║
    ║     • PWA-Ready with Service Worker                                  ║
    ║     • Premium Features with Stripe Payment (so                       ║
    ║                                                                      ║
    ║  Stats: over 10.000+ Emoji-Combinations avaiable                     ║
    ║  GitHub: https://github.com/chooomedia/keymoji                       ║
    ║                                                                      ║
    ╚══════════════════════════════════════════════════════════════════════╝
    `;

    // Style the console output
    console.log(
        '%c' + asciiArt,
        'color: #9333ea; font-family: monospace; font-size: 11px; line-height: 1.2;'
    );

    // Additional styled credits
    console.log(
        '%c🔑 KEYMOJI %c v0.7.7',
        'color: #fbbf24; font-weight: bold; font-size: 16px;',
        'color: #ef4444; font-weight: bold; font-size: 14px;'
    );

    console.log(
        '%cTech-Stack: Svelte ⚡ Tailwind 🎨 Vercel 🚀 n8n 🤖',
        'color: #6366f1; font-size: 11px;'
    );
}

/**
 * Enhanced Language Path Validation (Apple/Airbnb Style)
 */
function ensureLanguageInPath() {
    const path = window.location.pathname;
    const supportedLanguages = [
        'en',
        'de',
        'fr',
        'es',
        'it',
        'ja',
        'ko',
        'nl',
        'pl',
        'ru',
        'tr',
        'af',
        'tlh',
        'sjn'
    ];

    // Check if path starts with a supported language
    const pathParts = path.split('/').filter(part => part.length > 0);
    const firstPart = pathParts[0];

    if (!supportedLanguages.includes(firstPart)) {
        console.warn(
            '🌐 Language code missing in URL path. Server-side redirects should handle this.'
        );
    }
}

// Cleanup function for magic link listener
function cleanupOnUnload() {
    if (typeof window !== 'undefined') {
        // Import cleanup function dynamically
        import('./stores/accountStore.js')
            .then(module => {
                if (module.cleanupMagicLinkListener) {
                    module.cleanupMagicLinkListener();
                }
            })
            .catch(error => {
                // Silently handle import errors during cleanup
                console.warn(
                    '⚠️ Failed to cleanup magic link listener:',
                    error
                );
            });
    }
}

// Global Error Handler for Browser Extension runtime.lastError
// This prevents "Unchecked runtime.lastError" errors from appearing in console
// Based on Chrome Extension best practices: https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError
function setupGlobalErrorHandlers() {
    // Handle Chrome/Browser Extension runtime.lastError
    if (typeof window !== 'undefined') {
        // CRITICAL: Catch all window errors (including runtime.lastError from extensions)
        window.addEventListener(
            'error',
            event => {
                const errorMessage =
                    event.message || event.error?.message || '';
                const errorName = event.error?.name || '';

                // Filter out benign browser extension errors
                if (
                    errorMessage.includes('runtime.lastError') ||
                    errorMessage.includes('message port closed') ||
                    errorMessage.includes('Extension context invalidated') ||
                    errorMessage.includes(
                        'The message port closed before a response was received'
                    ) ||
                    errorName === 'InvalidStateError' ||
                    errorName === 'DOMException'
                ) {
                    // Prevent these errors from appearing in console
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
            },
            true
        ); // Use capture phase to catch errors early

        // Override console.error to silently catch runtime.lastError
        const originalError = console.error;
        console.error = function (...args) {
            // Filter out runtime.lastError messages
            const message = args[0]?.toString() || '';
            if (
                message.includes('runtime.lastError') ||
                message.includes('message port closed') ||
                message.includes('Extension context invalidated') ||
                message.includes(
                    'The message port closed before a response was received'
                )
            ) {
                // Silently ignore - these are expected from browser extensions
                return;
            }
            // Call original console.error for other errors
            originalError.apply(console, args);
        };

        // Global error handler for unhandled promise rejections
        window.addEventListener('unhandledrejection', event => {
            const error = event.reason;
            const errorMessage = error?.message || error?.toString() || '';
            const errorName = error?.name || '';

            if (
                errorMessage.includes('runtime.lastError') ||
                errorMessage.includes('message port closed') ||
                errorMessage.includes('Extension context invalidated') ||
                errorMessage.includes(
                    'The message port closed before a response was received'
                ) ||
                errorName === 'InvalidStateError' ||
                errorName === 'DOMException'
            ) {
                // Prevent these errors from appearing in console
                event.preventDefault();
                return;
            }
        });

        // Handle Chrome extension context errors
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            // Periodically clear runtime.lastError to prevent accumulation
            // This is a Chrome Extension best practice
            setInterval(() => {
                try {
                    if (chrome.runtime.lastError) {
                        // Access lastError to clear it (prevents "Unchecked" warnings)
                        void chrome.runtime.lastError;
                    }
                } catch (e) {
                    // Ignore errors when clearing
                }
            }, 1000);
        }
    }
}

// Application Initialization mit enhanced UX
function initializeApp() {
    // Setup global error handlers FIRST to catch all errors
    setupGlobalErrorHandlers();

    // Display console art on production build
    displayKeymojiConsoleArt();

    // Initialize API cache (cleanup expired entries, load debug tools)
    import('./utils/apiCache').then(module => {
        module.initializeCache();
        console.log('✅ API cache initialized (prevents 429 errors)');
        if (!isProduction()) {
            console.log('🔧 apiCache debug: window.apiCache.stats()');
        }
    });

    // Import debug tools in development
    if (!isProduction()) {
        import('./utils/loadRealDataHelper.js').then(module => {
            console.log('🔧 Real Data Loader available: window.loadRealData()');
        });

        import('./utils/settingsDebug.js').then(module => {
            console.log('🔧 Settings Debug Tools loaded');
            window.keymojiDebug = module;
        });

        import('./utils/dailyUsageDebug.js').then(module => {
            console.log('🔧 Daily Usage Debug Tools loaded');
        });

        import('./utils/usageHistoryGenerator.js').then(module => {
            console.log('🔧 Usage History Generator loaded');
            console.log(
                '📊 Quick: await window.keymojiUsageGenerator.generate4Weeks()'
            );
        });

        import('./utils/chartTestData.js').then(module => {
            console.log('🎨 Chart Test Tools loaded');
            console.log(
                '⚡ Quick: window.keymojiChartTest.pro4w() for instant animation'
            );
        });

        import('./utils/chartDebugger.js').then(module => {
            console.log('🔧 Chart Debugger loaded');
            console.log('⚡ Quick: window.chartDebugger.fullDiagnosis()');
        });

        import('./utils/instantChartTest.js').then(module => {
            console.log('⚡ Instant Chart Test loaded');
            console.log('⚡ Quick: window.instantChartTest()');
        });

        import('./utils/testAPIDirectly.js').then(module => {
            console.log('🧪 Direct API Test loaded');
            console.log('⚡ Quick: await window.testAPIDirectly()');
        });
    }

    // Validate language path
    ensureLanguageInPath();

    // Enhanced keyboard shortcuts (Apple Style)
    document.addEventListener('keydown', event => {
        // ESC to close modal
        if (event.key === 'Escape' && isModalVisible.get()) {
            event.preventDefault();
            closeModal();
        }

        // CMD/CTRL + K für Quick Actions (Apple/Airbnb Style)
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            // Future: Quick Action Modal
            console.log('🔥 Quick Actions - Coming Soon!');
        }
    });

    // Enhanced click outside modal handler
    document.addEventListener('click', event => {
        const modalElement = document.querySelector('.modal-overlay');
        if (
            modalElement &&
            event.target === modalElement &&
            isModalVisible.get()
        ) {
            closeModal();
        }
    });

    // NEW: Initialize user data stores (robust pattern like userCounter!)
    import('./stores/userDataStore.js')
        .then(module => {
            module.initializeUserData();
            console.log('✅ User data stores initialized');
        })
        .catch(error => {
            console.warn('⚠️ Failed to initialize user data stores:', error);
        });

    // Initialize Svelte App
    const app = new LanguageRouter({
        target: document.getElementById('app') || document.body
    });

    return app;
}

// Initialize App with error handling
const app = initializeApp();

// Setup cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupOnUnload);
    window.addEventListener('unload', cleanupOnUnload);
}

export default app;
