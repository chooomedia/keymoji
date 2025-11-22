// src/index.ts
// TypeScript Migration: v0.7.7
import './index.css';
import LanguageRouter from './routes/LanguageRouter.svelte';
import { mount } from 'svelte';
import { isProduction } from './utils/environment';
import { closeModal, isModalVisible } from './stores/modalStore';
import { updateSEO } from './utils/seo';
import { currentLanguage } from './stores/appStores';
import type { Component } from 'svelte';

function displayKeymojiConsoleArt(): void {
    if (!isProduction()) return; // Nur im Build anzeigen

    const asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                                                                      ║
    ║    ██   ██ ███████ ██    ██ ███    ███  ██████       ██ ██           ║
    ║    ██  ██  ██       ██  ██  ████  ████ ██    ██      ██ ██           ║
    ║    █████   █████     ████   ██ ████ ██ ██    ██      ██ ██           ║
    ║    ██  ██  ██         ██    ██  ██  ██ ██    ██ ██   ██ ██           ║
    ║    ██   ██ ███████    ██    ██      ██  ██████  ████████ ██          ║
    ║                                                                      ║
    ║  🚀 Tech Stack:                                                      ║
    ║     • Frontend: Svelte + Tailwind CSS + Webpack                      ║
    ║     • Backend: Vercel Serverless + n8n Automation                    ║
    ║     • Storage: Google Sheets + Brevo Email                           ║
    ║     • Payment: Stripe Integration                                    ║
    ║                                                                      ║
    ║  ⚡ Features:                                                         ║
    ║     • 15+ Sprachen Support (inkl. Klingonisch & Elbisch)             ║
    ║     • Dark/Light Mode mit automatischer Erkennung                    ║
    ║     • PWA-Ready mit Service Worker                                   ║
    ║     • Responsive Design für alle Geräte                              ║
    ║     • Premium Features mit Stripe Payment                            ║
    ║                                                                      ║
    ║  🎨 UX/UI inspiriert von Apple & Airbnb Design Language              ║
    ║  🔐 Privacy-First mit GDPR-konformer Datenverarbeitung               ║
    ║                                                                      ║
    ║  📈 Stats: Über 1000+ Emoji-Kombinationen verfügbar                  ║
    ║  🌟 GitHub: https://github.com/chooomedia/keymoji                    ║
    ║                                                                      ║
    ╚══════════════════════════════════════════════════════════════════════╝
    Happy Emoji Shortcuts! 🔥✨
    `;

    // Style the console output
    console.log(
        '%c' + asciiArt,
        'color: #9333ea; font-family: monospace; font-size: 11px; line-height: 1.2;'
    );

    // Additional styled credits
    console.log(
        '%c🔑 KEYMOJI %c- Debug Devil',
        'color: #fbbf24; font-weight: bold; font-size: 16px;',
        'color: #ef4444; font-weight: bold; font-size: 14px;'
    );
}

/**
 * Enhanced Language Path Validation (Apple/Airbnb Style)
 */
function ensureLanguageInPath(): void {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    const supportedLanguages: string[] = [
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

// Application Initialization mit enhanced UX
function initializeApp(): Component {
    // Display console art on production build
    displayKeymojiConsoleArt();

    // Initialize API cache (cleanup expired entries, load debug tools)
    import('./utils/apiCache')
        .then(module => {
            module.initializeCache();
            console.log('✅ API cache initialized (prevents 429 errors)');
            if (!isProduction()) {
                console.log('🔧 apiCache debug: window.apiCache.stats()');
            }
        })
        .catch((error: unknown) => {
            console.warn('⚠️ Failed to initialize API cache:', error);
        });

    // Import debug tools in development
    if (!isProduction()) {
        import('./utils/loadRealDataHelper')
            .then(() => {
                console.log(
                    '🔧 Real Data Loader available: window.loadRealData()'
                );
            })
            .catch((error: unknown) => {
                console.warn('⚠️ Failed to load real data helper:', error);
            });

        import('./utils/settingsDebug.ts')
            .then(module => {
                console.log('🔧 Settings Debug Tools loaded');
                (window as { keymojiDebug?: unknown }).keymojiDebug = module;
            })
            .catch((error: unknown) => {
                console.warn('⚠️ Failed to load settings debug:', error);
            });

        import('./utils/usageHistoryGenerator')
            .then(module => {
                console.log('🔧 Usage History Generator loaded');
                console.log(
                    '📊 Quick: await window.keymojiUsageGenerator.generate4Weeks()'
                );
                (
                    window as { keymojiUsageGenerator?: unknown }
                ).keymojiUsageGenerator = module;
            })
            .catch((error: unknown) => {
                console.warn(
                    '⚠️ Failed to load usage history generator:',
                    error
                );
            });

        import('./utils/testAPIDirectly.ts')
            .then(module => {
                console.log('🧪 Direct API Test loaded');
                console.log('⚡ Quick: await window.testAPIDirectly()');
                (window as { testAPIDirectly?: unknown }).testAPIDirectly =
                    module;
            })
            .catch((error: unknown) => {
                console.warn('⚠️ Failed to load API test:', error);
            });
    }

    // Validate language path
    ensureLanguageInPath();

    // Enhanced keyboard shortcuts (Apple Style)
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        // ESC to close modal
        if (event.key === 'Escape' && isModalVisible) {
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
    document.addEventListener('click', (event: MouseEvent) => {
        const modalElement = document.querySelector('.modal-overlay');
        if (
            modalElement &&
            event.target === modalElement &&
            isModalVisible
        ) {
            closeModal();
        }
    });

    // NEW: Initialize user data stores (robust pattern like userCounter!)
    import('./stores/userDataStore.ts')
        .then(module => {
            if (module.initializeUserData) {
                module.initializeUserData();
                console.log('✅ User data stores initialized');
            }
        })
        .catch((error: unknown) => {
            console.warn('⚠️ Failed to initialize user data stores:', error);
        });

    // Initialize SEO early (Svelte 5 Best Practice - before component mount)
    function initializeSEO(): void {
        if (typeof window === 'undefined') return;
        
        const path = window.location.pathname;
        
        // CRITICAL: Extract language from URL FIRST (before store initialization)
        const pathSegments = path.split('/').filter(segment => segment !== '');
        const supportedLanguages = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko', 'nl', 'pl', 'ru', 'tr', 'af', 'tlh', 'sjn', 'de-CH'];
        const urlLang = pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0]) 
            ? pathSegments[0] 
            : null;
        
        // Use URL language if available, otherwise use store language, fallback to 'en'
        // Runes: Direkter Zugriff ohne get()
        const lang = urlLang || currentLanguage || 'en';
        
        // CRITICAL: Update HTML lang attribute IMMEDIATELY (before any rendering)
        if (document.documentElement) {
            document.documentElement.setAttribute('lang', lang);
        }
        
        // Determine page type from path
        let pageType = 'home';
        
        if (pathSegments.length > 0) {
            const firstSegment = pathSegments[0];
            
            if (supportedLanguages.includes(firstSegment)) {
                // Language prefix present
                const pageSegment = pathSegments[1];
                pageType = pageSegment || 'home';
            } else {
                // No language prefix
                pageType = firstSegment || 'home';
            }
        }
        
        // Initial SEO update
        updateSEO({
            pageType,
            url: path
        }, lang);
        
        // NOTE: SEO updates for language/path changes are handled by LanguageRouter
        // Do NOT subscribe here to avoid duplicate updates and CPU overhead
        // The initial SEO update above is sufficient for first render
    }
    
    // Initialize SEO before mounting component
    initializeSEO();

    // Initialize Svelte App
    const appTarget = document.getElementById('app') || document.body;
    const app = mount(LanguageRouter, {
        target: appTarget
    });

    return app;
}

// Initialize App with error handling
const app = initializeApp();

export default app;
