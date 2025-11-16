// src/index.js
import './index.css'; // Essential: Import Tailwind CSS
import LanguageRouter from './routes/LanguageRouter.svelte';
import { isProduction } from './utils/environment';
import { closeModal, isModalVisible } from './stores/modalStore';

/**
 * ASCII Art Logo Generator für Keymoji (Apple/Airbnb Style)
 * Debug Devil - Interner Code-Name für diese Version
 */
function displayKeymojiConsoleArt() {
    if (!isProduction()) return; // Nur im Build anzeigen

    const asciiArt = `
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                                                                      ║
    ║    ██   ██ ███████ ██    ██ ███    ███  ██████       ██ ██           ║
    ║    ██  ██  ██       ██  ██  ████  ████ ██    ██      ██ ██           ║
    ║    █████   █████     ████   ██ ████ ██ ██    ██      ██ ██           ║
    ║    ██  ██  ██         ██    ██  ██  ██ ██    ██ ██   ██ ██           ║
    ║    ██   ██ ███████    ██    ██      ██  ██████  ████████ ██           ║
    ║                                                                      ║
    ║                        🔑 KEYMOJI - Debug Devil 😈                   ║
    ║                                                                      ║
    ║              Emoji Shortcuts für Profis & Enthusiasten              ║
    ║                                                                      ║
    ╠══════════════════════════════════════════════════════════════════════╣
    ║                                                                      ║
    ║  💻 Entwickelt von: Chris Matt (C. Matt)                            ║
    ║  🌐 Web: https://keymoji.wtf                                        ║
    ║  📧 Kontakt: hello@keymoji.wtf                                      ║
    ║  🎯 Version: Debug Devil - Brown to Greenfield Migration            ║
    ║                                                                      ║
    ║  🚀 Tech Stack:                                                      ║
    ║     • Frontend: Svelte + Tailwind CSS + Webpack                     ║
    ║     • Backend: Vercel Serverless + n8n Automation                   ║
    ║     • Storage: Google Sheets + Brevo Email                          ║
    ║     • Payment: Stripe Integration                                    ║
    ║                                                                      ║
    ║  ⚡ Features:                                                         ║
    ║     • 15+ Sprachen Support (inkl. Klingonisch & Elbisch)           ║
    ║     • Dark/Light Mode mit automatischer Erkennung                   ║
    ║     • PWA-Ready mit Service Worker                                   ║
    ║     • Responsive Design für alle Geräte                             ║
    ║     • Premium Features mit Stripe Payment                           ║
    ║                                                                      ║
    ║  🎨 UX/UI inspiriert von Apple & Airbnb Design Language             ║
    ║  🔐 Privacy-First mit GDPR-konformer Datenverarbeitung             ║
    ║                                                                      ║
    ║  📈 Stats: Über 1000+ Emoji-Kombinationen verfügbar                ║
    ║  🌟 GitHub: https://github.com/chooomedia/keymoji                   ║
    ║                                                                      ║
    ╚══════════════════════════════════════════════════════════════════════╝
    
    🎉 Welcome to Keymoji - Debug Devil Edition! 
    
    Dieses Release fokussiert sich auf:
    • 🧹 Code-Cleanup & Best Practices
    • ⚡ Performance-Optimierungen  
    • 🎨 Enhanced UX mit Apple/Airbnb Style
    • 🔐 Security-Verbesserungen
    • 📱 Mobile-First Responsive Design
    
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

    console.log(
        '%cEntwickelt mit ❤️ von Chris Matt (C. Matt) in Deutschland 🇩🇪',
        'color: #10b981; font-style: italic; font-size: 12px;'
    );

    console.log(
        '%cTech-Stack: Svelte ⚡ Tailwind 🎨 Vercel 🚀 n8n 🤖',
        'color: #6366f1; font-size: 11px;'
    );

    // Internal development info (only in production build)
    console.log(
        '%c[Debug Devil] - Internal Code Name für Brown-to-Greenfield Migration',
        'color: #6b7280; font-size: 10px; font-style: italic;'
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

// Application Initialization mit enhanced UX
function initializeApp() {
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

export default app;
