<!-- src/components/ServiceWorkerHandler.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { showInfo } from '../stores/modalStore';
    import { translations } from '../stores/contentStore.js';
    import { isDebugMode } from '../utils/environment';
    import { safeSetTimeout, clearAllTimeouts } from '../utils/sharedHelpers';

    // Timeout-Tracking für Memory Leak Prevention
    let activeTimeouts = new Set();
    
    // Wrapper für safeSetTimeout mit lokalem Tracking (für onDestroy cleanup)
    function localSafeSetTimeout(callback, delay) {
        const timeoutId = safeSetTimeout(() => {
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
        
        // Cleanup: Remove all event listeners (safety net)
        if (navigator.serviceWorker) {
            try {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
                navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            } catch (error) {
                // Ignore errors during cleanup
                if (debugMode) {
                    console.warn('⚠️ ServiceWorkerHandler: Error during cleanup:', error);
                }
            }
        }
        
        if (registration) {
            try {
                registration.removeEventListener('updatefound', handleUpdateFound);
            } catch (error) {
                // Ignore errors during cleanup
            }
        }
        
        if (newWorker) {
            try {
                newWorker.removeEventListener('statechange', handleWorkerStateChange);
            } catch (error) {
                // Ignore errors during cleanup
            }
        }
    });
  
    // State
    let updateAvailable = false;
    let registration = null;
    let newWorker = null;
    let debugMode = isDebugMode();

    // Event handler functions (defined outside onMount for proper cleanup)
    function handleControllerChange() {
        console.log('Service worker controller changed - new version active');
        
        // We could reload the page here, but it's often better to let the user decide
        // If a reload hasn't happened within 5 seconds since the controllerchange,
        // show a notification with a manual reload option
        localSafeSetTimeout(() => {
            const refreshPrompt = $translations.serviceWorker?.manualRefreshNeeded || 'Manual refresh needed';
            
            showInfo(refreshPrompt, 8000);
        }, 5000);
    }
    
    function handleUpdateFound() {
        if (!registration) return;
        
        newWorker = registration.installing;
        if (!newWorker) return;
        
        newWorker.addEventListener('statechange', handleWorkerStateChange);
    }
    
    function handleWorkerStateChange() {
        if (!newWorker) return;
        
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            updateAvailable = true;
            
            const updateMessage = translations.serviceWorker.updateAvailable;
            
            // Dispatch a custom event so other components can react
            try {
                window.dispatchEvent(new CustomEvent('swUpdateAvailable', {
                    detail: { registration, newWorker }
                }));
            } catch (error) {
                if (debugMode) {
                    console.warn('⚠️ ServiceWorkerHandler: Failed to dispatch swUpdateAvailable event:', error);
                }
            }
        }
    }
    
    function handleServiceWorkerMessage(event) {
        try {
            if (event.data?.type === 'SW_UPDATED') {
                console.log(`Service Worker updated to version ${event.data.version}`);
                
                // Show success notification
                showInfo('App updated successfully! 🎉', 3000);
            }
        } catch (error) {
            if (debugMode) {
                console.warn('⚠️ ServiceWorkerHandler: Error handling message:', error);
            }
        }
    }

    onMount(async () => {
        if (!('serviceWorker' in navigator)) return;
  
        try {
            // Get the registration
            registration = await navigator.serviceWorker.ready;
            
            if (debugMode) {
                console.log('🔔 ServiceWorkerHandler: Registration ready');
            }
            
            // Listen for controller change events (indicates a new service worker taking over)
            navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
            
            // Listen for update events
            registration.addEventListener('updatefound', handleUpdateFound);
            
            // Listen for messages from the service worker
            navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
            
            // Check for updates right away (for users who have been offline)
            try {
                await registration.update();
            } catch (updateError) {
                // Silently handle update errors (common when offline)
                if (debugMode) {
                    console.warn('⚠️ ServiceWorkerHandler: Update check failed (may be offline):', updateError);
                }
            }
        } catch (error) {
            console.error('Service worker registration or update failed:', error);
            
            // Show error notification only in debug mode
            if (debugMode) {
                console.warn('⚠️ Service worker registration failed. Some features may not work properly.');
            }
        }
        
        // Return cleanup function
        return () => {
            // Remove all event listeners
            if (navigator.serviceWorker) {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
                navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
        }
            
            if (registration) {
                registration.removeEventListener('updatefound', handleUpdateFound);
            }
            
            if (newWorker) {
                newWorker.removeEventListener('statechange', handleWorkerStateChange);
            }
        };
    });
  
    // Functions to manage service worker updates
    function updateServiceWorker() {
        if (!newWorker) return;
        
        if (debugMode) {
            console.log('🔔 ServiceWorkerHandler: Updating service worker');
        }
        
        // Tell the service worker to skip waiting and activate
        // Wrap in try-catch to handle message port errors
        try {
            // CRITICAL: Check for runtime.lastError before posting
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                try {
                    if (chrome.runtime.lastError) {
                        // Silently clear the error - it's expected from browser extensions
                        void chrome.runtime.lastError;
                    }
                } catch (e) {
                    // Ignore errors when checking runtime.lastError
                }
            }
            
            // Check if worker is still valid before posting
            if (newWorker && newWorker.state !== 'redundant') {
                try {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                } catch (postError) {
                    // Silently handle message port closed errors
                    const errorMessage = postError?.message || postError?.toString() || '';
                    const errorName = postError?.name || '';
                    
                    if (
                        errorMessage.includes('port') ||
                        errorMessage.includes('closed') ||
                        errorMessage.includes('runtime.lastError') ||
                        errorMessage.includes('Extension context invalidated') ||
                        errorMessage.includes('The message port closed before a response was received') ||
                        errorName === 'InvalidStateError' ||
                        errorName === 'DOMException'
                    ) {
                        // Silent - expected during page transitions or from browser extensions
                        return;
                    } else if (debugMode) {
                        console.warn('⚠️ ServiceWorkerHandler: Failed to post message:', postError);
                    }
                }
            } else {
                if (debugMode) {
                    console.warn('⚠️ ServiceWorkerHandler: Worker is redundant, cannot send message');
                }
            }
        } catch (error) {
            // Silently handle runtime.lastError and message port errors
            const errorMessage = error?.message || error?.toString() || '';
            const errorName = error?.name || '';
            
            if (
                errorMessage.includes('runtime.lastError') ||
                errorMessage.includes('port') ||
                errorMessage.includes('closed') ||
                errorMessage.includes('Extension context invalidated') ||
                errorMessage.includes('The message port closed before a response was received') ||
                errorName === 'InvalidStateError' ||
                errorName === 'DOMException'
            ) {
                // Silent - expected from browser extensions or during page transitions
                return;
            }
            
            // Log other errors only in debug mode
            if (debugMode) {
                console.error('❌ ServiceWorkerHandler: Failed to send message to service worker:', error);
            }
        }
        
        // Reset state
        updateAvailable = false;
        
        // The "controllerchange" event will be triggered after this
    }
</script>
  
<!-- This component only has logic, no UI -->
  
<!-- Listen for a global reload button click and trigger the update -->
<svelte:window on:swUpdateNow={updateServiceWorker} />