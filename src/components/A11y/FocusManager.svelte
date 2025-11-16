<!-- src/components/A11y/FocusManager.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { safeSetTimeout, clearAllTimeouts } from '../../utils/sharedHelpers';
    
    interface Props {
        active?: boolean;
        initialFocus?: HTMLElement | string | null;
        finalFocus?: HTMLElement | null;
        restoreFocus?: boolean;
        returnFocusOnEscape?: boolean;
        autoFocus?: boolean;
        loop?: boolean;
    }
    
    let {
        active = true,
        initialFocus = null,
        finalFocus = null,
        restoreFocus = true,
        returnFocusOnEscape = true,
        autoFocus = true,
        loop = true
    }: Props = $props();
    
    let trapElement: HTMLElement | null = $state(null);
    let previouslyFocused: HTMLElement | null = $state(null);
    let focusableElements: HTMLElement[] = $state([]);

    let activeTimeouts = $state(new Set<ReturnType<typeof setTimeout>>());
    
    function localSafeSetTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout> {
        const timeoutId = safeSetTimeout(() => {
            activeTimeouts.delete(timeoutId);
            callback();
        }, delay);
        activeTimeouts.add(timeoutId);
        return timeoutId;
    }
    
    // Focus the first element when trap activates
    function focusInitialElement() {
      if (!active) return;
      
      // Save the previously focused element
      if (document.activeElement && restoreFocus) {
        previouslyFocused = document.activeElement;
      }
      
      // If initialFocus is specified, focus it
      if (initialFocus) {
        let elementToFocus;
        
        if (typeof initialFocus === 'string') {
          elementToFocus = trapElement.querySelector(initialFocus);
        } else if (initialFocus instanceof HTMLElement) {
          elementToFocus = initialFocus;
        }
        
        if (elementToFocus) {
          elementToFocus.focus();
          return;
        }
      }
      
      // Otherwise, focus the first focusable element if autoFocus is true
      if (autoFocus && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
    
    // Update the list of focusable elements
    function updateFocusableElements() {
      if (!trapElement) return;
      
      // Get all focusable elements within the trap
      const selector = [
        'a[href]:not([tabindex="-1"])',
        'button:not([disabled]):not([tabindex="-1"])',
        'input:not([disabled]):not([tabindex="-1"])',
        'select:not([disabled]):not([tabindex="-1"])',
        'textarea:not([disabled]):not([tabindex="-1"])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(',');
      
      focusableElements = Array.from(trapElement.querySelectorAll(selector))
        .filter(el => window.getComputedStyle(el).display !== 'none');
    }
    
    // Handle Tab key to control focus
    function handleKeydown(event) {
      if (!active || focusableElements.length === 0) return;
      
      // Handle Escape key
      if (returnFocusOnEscape && event.key === 'Escape') {
        releaseFocus();
        return;
      }
      
      // Handle Tab key
      if (event.key === 'Tab') {
        const currentFocusIndex = focusableElements.indexOf(document.activeElement);
        
        // If focus is outside the trap or not found, reset it
        if (currentFocusIndex === -1) {
          event.preventDefault();
          focusableElements[0].focus();
          return;
        }
        
        // Calculate the next focus target
        if (event.shiftKey) {
          // Shift+Tab: Move focus backward
          if (currentFocusIndex === 0) {
            if (loop) {
              event.preventDefault();
              focusableElements[focusableElements.length - 1].focus();
            }
          } else {
            event.preventDefault();
            focusableElements[currentFocusIndex - 1].focus();
          }
        } else {
          // Tab: Move focus forward
          if (currentFocusIndex === focusableElements.length - 1) {
            if (loop) {
              event.preventDefault();
              focusableElements[0].focus();
            }
          } else {
            event.preventDefault();
            focusableElements[currentFocusIndex + 1].focus();
          }
        }
      }
    }
    
    // Release focus trap
    function releaseFocus() {
      if (restoreFocus && previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      } else if (finalFocus) {
        if (typeof finalFocus === 'string') {
          const elementToFocus = document.querySelector(finalFocus);
          if (elementToFocus) elementToFocus.focus();
        } else if (finalFocus instanceof HTMLElement) {
          finalFocus.focus();
        }
      }
    }
    
    // Initialize trap when component mounts
    onMount(() => {
      updateFocusableElements();
      
      if (active) {
        localSafeSetTimeout(() => {
          focusInitialElement();
        }, 50); // Small delay to ensure DOM is settled
      }
      
      document.addEventListener('keydown', handleKeydown);
    });
    
    // Clean up when component is destroyed
    onDestroy(() => {
      // Bereinige alle aktiven Timeouts
      activeTimeouts.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      activeTimeouts.clear();
      
      if (active && restoreFocus) {
        releaseFocus();
      }
      
      document.removeEventListener('keydown', handleKeydown);
    });
    
    // Track vorherigen Aktiv-Status ohne Reaktivität (kein $state!)
    let lastActive = active;
    
    // Watch for active state changes (Svelte 5 Runes, ohne Endlosschleife)
    $effect(() => {
      // Aktivierung: von false -> true
      if (active && !lastActive) {
        lastActive = active;
        localSafeSetTimeout(() => {
          updateFocusableElements();
          focusInitialElement();
        }, 50);
      }
      
      // Deaktivierung: von true -> false
      if (!active && lastActive) {
        lastActive = active;
        if (restoreFocus) {
          releaseFocus();
        }
      }
    });
  </script>
  
  <div bind:this={trapElement} class="focus-trap">
    <slot></slot>
  </div>