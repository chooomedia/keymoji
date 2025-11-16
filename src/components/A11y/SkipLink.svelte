<script lang="ts">
  import { onDestroy } from 'svelte';
  import { safeSetTimeout, clearAllTimeouts } from '../../utils/sharedHelpers';
  
  interface Props {
    targetId?: string;
    label?: string;
  }
  
  let {
    targetId = 'main-content',
    label = 'Skip to main content'
  }: Props = $props();
  
  let activeTimeouts = $state(new Set<ReturnType<typeof setTimeout>>());
  
  function localSafeSetTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout> {
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

  function handleSkip(): void {
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