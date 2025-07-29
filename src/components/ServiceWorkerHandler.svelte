<!-- src/components/ServiceWorkerHandler.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { showInfo } from '../stores/modalStore.js';
    import { translations } from '../stores/contentStore.js';
    import { isDebugMode } from '../utils/environment.js';

    // Timeout-Tracking für Memory Leak Prevention
    let activeTimeouts = new Set();
    
    // Helper-Funktion für sichere setTimeout mit Cleanup
    function safeSetTimeout(callback, delay) {
        const timeoutId = setTimeout(() => {
            activeTimeouts.delete(timeoutId);
            callback();
        }, delay);
        activeTimeouts.add(timeoutId);
        return timeoutId;
    }

    onDestroy(() => {
        // Bereinige alle aktiven Timeouts
        activeTimeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        activeTimeouts.clear();
    });
  
    // State
    let updateAvailable = false;
    let registration = null;
    let newWorker = null;
    let debugMode = isDebugMode();

    onMount(async () => {
        if (!('serviceWorker' in navigator)) return;
  
        try {
            // Get the registration
            registration = await navigator.serviceWorker.ready;
            
            if (debugMode) {
                console.log('🔔 ServiceWorkerHandler: Registration ready');
            }
            
            // Listen for controller change events (indicates a new service worker taking over)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service worker controller changed - new version active');
                
                // We could reload the page here, but it's often better to let the user decide
                // If a reload hasn't happened within 5 seconds since the controllerchange,
                // show a notification with a manual reload option
                safeSetTimeout(() => {
                    const refreshPrompt = $translations.serviceWorker?.manualRefreshNeeded || 'Manual refresh needed';
                    
                    showInfo(refreshPrompt, 8000);
                }, 5000);
            });
            
            // Listen for update events
            registration.addEventListener('updatefound', () => {
                newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        updateAvailable = true;
                        
                        const updateMessage = translations.serviceWorker.updateAvailable;
                        
                        // Show update notification using centralized modal system
                        // showWarning(
                        //     updateMessage,
                        //     0, // Don't auto-close
                        //     {
                        //         buttonText: 'Update Now',
                        //         buttonAction: () => {
                        //             updateServiceWorker();
                        //         }
                        //     }
                        // );
                        
                        // Dispatch a custom event so other components can react
                        window.dispatchEvent(new CustomEvent('swUpdateAvailable', {
                            detail: { registration, newWorker }
                        }));
                    }
                });
            });
            
            // Listen for messages from the service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data?.type === 'SW_UPDATED') {
                    console.log(`Service Worker updated to version ${event.data.version}`);
                    
                    // Show success notification
                    showInfo('App updated successfully! 🎉', 3000);
                }
            });
            
            // Check for updates right away (for users who have been offline)
            registration.update();
        } catch (error) {
            console.error('Service worker registration or update failed:', error);
            
            // Show error notification
            // showWarning('Service worker registration failed. Some features may not work properly.', 5000);
        }
    });
  
    // Functions to manage service worker updates
    function updateServiceWorker() {
        if (!newWorker) return;
        
        if (debugMode) {
            console.log('🔔 ServiceWorkerHandler: Updating service worker');
        }
        
        // Tell the service worker to skip waiting and activate
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        
        // Reset state
        updateAvailable = false;
        
        // The "controllerchange" event will be triggered after this
    }
</script>
  
<!-- This component only has logic, no UI -->
  
<!-- Listen for a global reload button click and trigger the update -->
<svelte:window on:swUpdateNow={updateServiceWorker} />