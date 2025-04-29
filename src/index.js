// src/index.js - Enhanced with better service worker handling
import Root from './routes/LanguageRouter.svelte';
import './index.css';
import { appVersion } from './utils/version.js';
import { modalMessage } from './stores/appStores.js';
import content from './content.js';

// Get the current URL
const currentUrl = window.location.pathname;

console.log('Starting app with URL:', currentUrl, 'Version:', appVersion);

const app = new Root({
    target: document.body,
    props: {
        url: currentUrl,
        currentVersion: appVersion
    }
});

// Enhanced Service Worker Registration with update handling
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
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

                        // Show update notification to user
                        const defaultMessage =
                            'A new version is available. Refresh to update!';
                        modalMessage.set(
                            content.en?.serviceWorker?.updateAvailable ||
                                defaultMessage
                        );

                        // Add refresh button handler
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

                    // Optional: Show a notification or trigger a refresh
                    // if user was waiting for this specific update
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
    console.log('Running in development mode - Service Worker disabled');
}

// Add version info to console
console.info(
    `%c Keymoji v${appVersion} `,
    'background: #f4ab25; color: #000; padding: 4px;'
);
console.log('Current language:', document.documentElement.lang);

export default app;
