<script>
    import { currentLanguage, getText } from '../../stores/appStores.js';
    
    // Props
    export let target = "#main-content"; // ID of the main content
    export let label = null; // Custom label
    
    // Get label from translation if not provided
    $: skipLabel = label || getText('accessibility.skipToContent') || 'Skip to content';
    
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
  
<style>
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      padding: 8px 16px;
      background-color: #f4ab25;
      color: #000;
      font-weight: bold;
      text-decoration: none;
      z-index: 9999;
      transition: top 0.2s ease;
      border-radius: 0 0 4px 0;
      display: inline-block;
    }
    
    .skip-link:focus {
      top: 0;
      outline: none;
      box-shadow: 0 0 0 2px #000;
    }
</style>