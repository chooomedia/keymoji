<script>
    import { currentLanguage, getText } from '../../stores/appStores.js';
    
    // Props
    export const target = "#main-content"; // ID of the main content
    export const label = null; // Custom label
    
    // Get label from translation if not provided
    $: skipLabel = 'Skip to content';
    
    // Define the missing handleClick function
    function handleClick(event) {
      event.preventDefault();
      
      // Find the target element
      const targetElement = document.querySelector(target);
      
      if (targetElement) {
        // Make sure the element is focusable
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        
        // Focus and scroll to the element
        targetElement.focus();
        
        // Remove tabindex after focus (if it wasn't there originally)
        if (targetElement.getAttribute('tabindex') === '-1') {
          // Use a timeout to prevent immediate blur
          setTimeout(() => {
            targetElement.removeAttribute('tabindex');
          }, 100);
        }
      }
    }
</script>

<a
  href={target}
  class="skip-link"
  on:click={handleClick}
  aria-label={skipLabel}
>
  {skipLabel}
</a>