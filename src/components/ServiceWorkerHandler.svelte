<!-- src/components/ServiceWorkerHandler.svelte -->
<script>
    import { onMount } from 'svelte';
    import { currentLanguage, modalMessage } from '../stores/appStores.js';
    import content from '../content.js';
  
    // State
    let updateAvailable = false;
    let registration = null;
    let newWorker = null;
  
    onMount(async () => {
      if (!('serviceWorker' in navigator)) return;
  
      try {
        // Get the registration
        registration = await navigator.serviceWorker.ready;
        
        // Listen for controller change events (indicates a new service worker taking over)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service worker controller changed - new version active');
          
          // We could reload the page here, but it's often better to let the user decide
          // If a reload hasn't happened within 5 seconds since the controllerchange,
          // show a notification with a manual reload option
          setTimeout(() => {
            const refreshPrompt = content[$currentLanguage]?.serviceWorker?.manualRefreshNeeded || 
              'New version activated. Reload now for the latest features.';
            
            modalMessage.set(refreshPrompt);
          }, 5000);
        });
        
        // Listen for update events
        registration.addEventListener('updatefound', () => {
          newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              updateAvailable = true;
              
              const updateMessage = content[$currentLanguage]?.serviceWorker?.updateAvailable || 
                'A new version is available!';
              
              // Show update notification
              modalMessage.set(updateMessage);
              
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
            
            // We could show a notification here about the successful update
          }
        });
        
        // Check for updates right away (for users who have been offline)
        registration.update();
      } catch (error) {
        console.error('Service worker registration or update failed:', error);
      }
    });
  
    // Functions to manage service worker updates
    function updateServiceWorker() {
      if (!newWorker) return;
      
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