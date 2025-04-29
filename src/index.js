import Root from './routes/LanguageRouter.svelte';
import './index.css';
import { appVersion } from './utils/languages.js';

// Explizit die aktuelle URL nehmen
const currentUrl = window.location.pathname;

console.log('Starte App mit URL:', currentUrl);

const app = new Root({
    target: document.body,
    props: {
        url: currentUrl,
        currentVersion: appVersion
    }
});

// Service Worker Registrierung
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');

                // Periodische Synchronisation registrieren
                if ('periodicSync' in registration) {
                    registration.periodicSync
                        .register('update-cache', {
                            minInterval: 24 * 60 * 60 * 1000 // Täglich
                        })
                        .catch(error => {
                            // Periodic Sync möglicherweise nicht unterstützt
                            console.log(
                                'Periodic Sync could not be registered:',
                                error
                            );
                        });
                }

                // Update bei neuer Version
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (
                            newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            // Neue Version verfügbar
                            if (
                                confirm(
                                    'Neue Version der App verfügbar. Jetzt laden?'
                                )
                            ) {
                                window.location.reload();
                            }
                        }
                    });
                });

                // Automatisches Update prüfen alle 60 Minuten
                setInterval(() => {
                    registration.update();
                }, 1000 * 60 * 60);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });

        // Offline/Online Status Handler
        window.addEventListener('online', () => {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('syncData');
            });
        });
    });
}

// Debug Log wenn nicht in Produktion
if (process.env.NODE_ENV !== 'production') {
    console.log('Läuft im Entwicklungsmodus - Service Worker deaktiviert');
    console.log('Startsprache:', document.documentElement.lang);
}

export default app;
