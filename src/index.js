// src/index.js - Enhanced with better service worker handling and central version management
import Root from './routes/LanguageRouter.svelte';
import './index.css';
import { appVersion, versionInfo } from './utils/version.js'; // Importiere aus zentraler Quelle
import { modalMessage, isModalVisible } from './stores/appStores.js'; // Behalte die ursprünglichen Stores
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

const environment = getEnvironment();
console.log(
    'Starting app with URL:',
    currentUrl,
    'Version:',
    appVersion,
    'Environment:',
    environment
);

const app = new Root({
    target: document.body,
    props: {
        url: currentUrl,
        currentVersion: appVersion // Verwende die zentrale Versionsdefinition
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

                        // Zeige Update-Meldung mit dem vorhandenen Modal-System
                        const defaultMessage =
                            'A new version is available. Refresh to update!';

                        // Verwende die bestehenden modalMessage und isModalVisible Stores
                        modalMessage.set(
                            content.en?.serviceWorker?.updateAvailable ||
                                defaultMessage
                        );
                        isModalVisible.set(true);

                        // Refresh button handler
                        const refreshButton = document.createElement('button');
                        refreshButton.textContent = 'Refresh Now';
                        refreshButton.className =
                            'mt-4 px-4 py-2 bg-yellow text-black rounded-full';
                        refreshButton.addEventListener('click', () => {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        });

                        // Find modal and append button
                        setTimeout(() => {
                            const modal = document.querySelector(
                                '[data-testid="error-modal"]'
                            );
                            if (modal) {
                                const container = modal.querySelector(
                                    'div[role="dialog"] > div'
                                );
                                if (container) {
                                    container.appendChild(refreshButton);
                                }
                            }
                        }, 100);
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

// Add version info to console with updated style and more details
console.info(
    `%c Keymoji ${appVersion} (${versionInfo.codename}) `,
    'background: #f4ab25; color: #000; padding: 4px; border-radius: 4px;'
);
console.log(
    `Last updated: ${versionInfo.updated}
Environment: ${environment}
Language: ${document.documentElement.lang}`
);

export default app;
