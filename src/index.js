// src/index.js - Optimierter Haupteinstiegspunkt
import Root from './routes/LanguageRouter.svelte';
import './index.css';
import { appVersion, versionInfo } from './utils/version.js';
import { closeModal, isModalVisible } from './stores/modalStore.js';
import {
    getEnvironment,
    isDevelopment,
    isProduction,
    devLog,
    devWarn
} from './utils/environment.js';

// Get the current URL
const currentUrl = window.location.pathname;

const ensureLanguageInPath = () => {
    const pathSegments = currentUrl
        .split('/')
        .filter(segment => segment !== '');

    if (pathSegments.length === 0) {
        devWarn('⚠️ Development: Root path detected, should redirect to /en');
    }
};

// SEO-optimierte App-Initialisierung
const initializeModalSmoothly = () => {
    if (typeof document !== 'undefined') {
        const handleDOMReady = () => {
            if (isModalVisible) {
                closeModal();
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handleDOMReady);
        } else {
            handleDOMReady();
        }
    }
};

// SEO-optimierte Preload-State-Verarbeitung
const initializePreloadedState = () => {
    if (window.__PRELOADED_STATE__) {
        const { route, language, seoData } = window.__PRELOADED_STATE__;

        // SEO-optimierte State-Initialisierung
        if (route && language) {
            devLog('🔍 Preloaded state detected:', { route, language });

            // Setze initiale Route für bessere SEO
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', route);
            }
        }

        // Cleanup preloaded state
        delete window.__PRELOADED_STATE__;
    }
};

const initializeApp = () => {
    if (isDevelopment()) {
        ensureLanguageInPath();
    }

    initializeModalSmoothly();
    initializePreloadedState();

    devLog('🚀 Keymoji App Starting:', {
        version: appVersion,
        codename: versionInfo.codename,
        environment: getEnvironment(),
        url: currentUrl
    });
};

initializeApp();

const app = new Root({
    target: document.body
});

// SEO-optimierte Service Worker-Registrierung
if (isProduction() && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register(
                '/service-worker.js'
            );

            devLog(
                'Service Worker registered successfully:',
                registration.scope
            );

            // SEO-optimierte Update-Behandlung
            const messageHandler = event => {
                if (event.data && event.data.type === 'SW_UPDATED') {
                    devLog(
                        `Service Worker updated to version ${event.data.version}`
                    );
                }
            };

            navigator.serviceWorker.addEventListener('message', messageHandler);

            // SEO-optimierte Background Sync
            if ('sync' in registration) {
                try {
                    await registration.sync.register('background-sync');
                    devLog('Background sync registered successfully');
                } catch (error) {
                    devLog('Periodic Sync could not be registered:', error);
                }
            }

            // SEO-optimierte Push-Benachrichtigungen
            if ('pushManager' in registration) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        const subscription =
                            await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: 'your-vapid-public-key'
                            });
                        devLog('Push notification subscription successful');
                    }
                } catch (error) {
                    console.error(
                        'Background sync registration failed:',
                        error
                    );
                }
            }
        } catch (error) {
            devLog('Service Worker registration failed:', error);
        }
    });
} else {
    devLog(`Running in ${getEnvironment()} mode - Service Worker disabled`);
}

// SEO-optimierte Console-Info
console.info(
    `%c Keymoji ${appVersion} (${versionInfo.codename}) `,
    'background: #f4ab25; color: #000; padding: 4px; border-radius: 4px;'
);

// SEO-optimierte Performance-Monitoring
if (isProduction()) {
    // Core Web Vitals Monitoring
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver(list => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        devLog('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                        devLog('FID:', entry.processingStart - entry.startTime);
                    }
                }
            });

            observer.observe({
                entryTypes: ['largest-contentful-paint', 'first-input']
            });
        } catch (error) {
            devLog('Performance monitoring failed:', error);
        }
    }
}

export default app;
