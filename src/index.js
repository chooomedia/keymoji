// src/index.js - Optimierter Haupteinstiegspunkt
import Root from './routes/LanguageRouter.svelte';
import './index.css';
import { appVersion, versionInfo } from './utils/version.js';
import { showSuccess, showWarning } from './stores/modalStore.js';
import content from './content.js';

// Get the current URL
const currentUrl = window.location.pathname;

// Umgebungsvariablen sicher abfragen
const getEnvironment = () => {
    try {
        return typeof process !== 'undefined' &&
            process.env &&
            process.env.NODE_ENV
            ? process.env.NODE_ENV
            : 'production';
    } catch (e) {
        console.warn(
            'Could not access environment variables, defaulting to production'
        );
        return 'production';
    }
};

// Überprüfe, ob die aktuelle URL den Sprachcode enthält
// Falls nicht, sollte der Server-Redirect bereits stattgefunden haben
const ensureLanguageInPath = () => {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');

    // Wenn die Pfadsegmente leer sind (Wurzel-URL) oder das erste Segment
    // nicht wie ein Sprachcode aussieht, logge eine Warnung
    if (pathSegments.length === 0 || pathSegments[0].length !== 2) {
        console.warn(
            'URL does not contain language code, server-side redirect may have failed:',
            path
        );
    }
};

const environment = getEnvironment();
console.log(
    'Starting app with URL:',
    currentUrl,
    'Version:',
    appVersion,
    'Environment:',
    environment
);

// Sprachcode-Prüfung im Development-Modus
if (environment === 'development') {
    ensureLanguageInPath();
}

const app = new Root({
    target: document.body,
    props: {
        url: currentUrl,
        currentVersion: appVersion
    }
});

// Enhanced Service Worker Registration with update handling
if ('serviceWorker' in navigator && environment === 'production') {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register(
                '/service-worker.js'
            );
            console.log(
                'ServiceWorker registration successful with scope:',
                registration.scope
            );

            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;

                // Track state changes of the new service worker
                newWorker.addEventListener('statechange', () => {
                    if (
                        newWorker.state === 'installed' &&
                        navigator.serviceWorker.controller
                    ) {
                        // New version installed but waiting to activate
                        console.log(
                            'New version available! Ready when you are...'
                        );

                        // Store update availability in session storage
                        sessionStorage.setItem('swUpdateAvailable', 'true');

                        // Zeige Update-Meldung mit dem einheitlichen Modal-System
                        const defaultMessage =
                            'A new version is available. Refresh to update!';

                        // Use the unified modal system
                        showWarning(
                            content.en?.serviceWorker?.updateAvailable ||
                                defaultMessage,
                            0, // Don't auto-close
                            {
                                buttonText: 'Refresh Now',
                                buttonAction: () => {
                                    newWorker.postMessage({
                                        type: 'SKIP_WAITING'
                                    });
                                    window.location.reload();
                                }
                            }
                        );
                    }
                });
            });

            // Handle messages from service worker
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'SW_UPDATED') {
                    console.log(
                        `Service Worker updated to version ${event.data.version}`
                    );
                }
            });

            // Check for updates periodically (every 60 minutes)
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000);

            // Set up periodic sync if supported
            if ('periodicSync' in registration) {
                try {
                    await registration.periodicSync.register('update-cache', {
                        minInterval: 24 * 60 * 60 * 1000 // Once a day
                    });
                } catch (error) {
                    console.log(
                        'Periodic Sync could not be registered:',
                        error
                    );
                }
            }

            // Handle offline/online status changes
            window.addEventListener('online', async () => {
                try {
                    const reg = await navigator.serviceWorker.ready;
                    if ('sync' in reg) {
                        await reg.sync.register('syncData');
                    }
                } catch (error) {
                    console.error(
                        'Background sync registration failed:',
                        error
                    );
                }
            });
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
        }
    });
} else {
    console.log(`Running in ${environment} mode - Service Worker disabled`);
}

// Add version info to console
console.info(
    `%c Keymoji ${appVersion} (${versionInfo.codename}) `,
    'background: #f4ab25; color: #000; padding: 4px; border-radius: 4px;'
);

export default app;
