<script>
  import { onDestroy } from 'svelte';
  import { safeSetTimeout, clearAllTimeouts } from '../../utils/sharedHelpers.js';
  
  export let targetId = 'main-content';
  export let label = 'Skip to main content';
  
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
  });

  function handleSkip() {
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Make sure the element can receive focus
      if (!targetElement.getAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');
      }
      
      // Focus the element
      targetElement.focus();
      
      // Remove tabindex after focus (if it wasn't there originally)
      if (targetElement.getAttribute('tabindex') === '-1') {
        // Use a timeout to prevent immediate blur
        localSafeSetTimeout(() => {
          targetElement.removeAttribute('tabindex');
        }, 100);
      }
    }
  }
</script>

<a
  href={`#${targetId}`}
  class="skip-link"
  on:click={handleSkip}
  aria-label={label}
>
  {label}
</a>