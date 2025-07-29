<script>
  import { onDestroy } from 'svelte';
  
  export let targetId = 'main-content';
  export let label = 'Skip to main content';
  
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
        safeSetTimeout(() => {
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