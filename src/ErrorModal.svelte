<!-- src/ErrorModal.svelte -->
<script>
    import { fade, fly } from 'svelte/transition';
    import { modalMessage, isModalVisible } from './stores/appStores.js';
    import FocusManager from './components/A11y/FocusManager.svelte';
  
    // State management
    $: message = $modalMessage;
    $: messageType = getMessageType(message);
    let showMessage = false;
    let imageLoaded = false;
    let modalRef;
    let lastActiveElement;
    let modalCloseTimeout;
  
    // Constants for animation and accessibility
    const ANIMATION_DURATION = 300;
    const IMAGE_DISPLAY_DURATION = 1200;
    const MESSAGE_MIN_DURATION = 2500; // Increased minimum display time
    const MESSAGE_WORD_MULTIPLIER = 210;
    const DEFAULT_AUTO_CLOSE_DELAY = 3000;
  
    // Icons for different message types
    const ICONS = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
      contact: '💌',
      sending: '📨'
    };
  
    // Message type detector
    function getMessageType(msg) {
      if (!msg) return 'info';
      
      const lowerMsg = msg.toLowerCase();
      
      // Contact form specific patterns
      if (lowerMsg.includes('sent') || lowerMsg.includes('success')) return 'success';
      if (lowerMsg.includes('sending')) return 'sending';
      if (lowerMsg.includes('pending')) return 'contact';
      if (lowerMsg.includes('error') || lowerMsg.includes('failed')) return 'error';
      if (lowerMsg.includes('warning')) return 'warning';
      if (lowerMsg.includes('fix') || lowerMsg.includes('validation')) return 'warning';
      
      // Default or unrecognizable is info
      return 'info';
    }
  
    // Set color based on message type
    function getIconColor(type) {
      switch (type) {
        case 'success': return '#4CAF50'; // Green
        case 'error': return '#F44336';   // Red
        case 'warning': return '#FF9800'; // Orange
        case 'contact': return '#f4ab25'; // Keymoji yellow
        case 'sending': return '#2196F3'; // Blue
        default: return '#2196F3';        // Blue for info
      }
    }
  
    // Choose appropriate icon
    function getIcon(type) {
      return ICONS[type] || ICONS.info;
    }
  
    // Get auto-close delay based on message type and length
    function getAutoCloseDelay(message, type) {
      // Error messages require manual closing
      if (type === 'error') return null;
      
      // For sending messages, we don't auto-close as they will be replaced
      // by success or error messages
      if (type === 'sending') return null;
      
      const wordCount = message.split(' ').length;
      const calculatedDuration = Math.max(
        MESSAGE_MIN_DURATION,
        wordCount * MESSAGE_WORD_MULTIPLIER
      );
      
      // Add extra time for success messages to ensure users see them
      if (type === 'success') {
        return calculatedDuration + IMAGE_DISPLAY_DURATION + 500;
      }
      
      return calculatedDuration + IMAGE_DISPLAY_DURATION;
    }
  
    // Modal subscription handler
    modalMessage.subscribe(value => {
      // Clear any existing timeout to prevent premature closing
      if (modalCloseTimeout) {
        clearTimeout(modalCloseTimeout);
        modalCloseTimeout = null;
      }
      
      if (value) {
        showMessage = true;
        isModalVisible.set(true);
        imageLoaded = false;
        lastActiveElement = document.activeElement;
  
        // Set focus when modal becomes visible
        setTimeout(() => {
          if (modalRef) {
            modalRef.focus();
          }
        }, ANIMATION_DURATION);
  
        // Calculate auto-close delay based on type and length
        const type = getMessageType(value);
        const autoCloseDelay = getAutoCloseDelay(value, type);
        
        // Set up auto-close timeout if needed
        if (autoCloseDelay !== null) {
          modalCloseTimeout = setTimeout(() => {
            closeMessage();
          }, autoCloseDelay);
        }
      }
    });
  
    // Close the modal
    function closeMessage() {
      showMessage = false;
      modalMessage.set('');
      isModalVisible.set(false);
      
      // Return focus to previous element
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        setTimeout(() => {
          try {
            lastActiveElement.focus();
          } catch (e) {
            console.warn('Could not return focus to previous element', e);
          }
        }, 100);
      }
      
      // Clear any existing timeout
      if (modalCloseTimeout) {
        clearTimeout(modalCloseTimeout);
        modalCloseTimeout = null;
      }
    }
  
    // Keyboard handlers
    function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMessage();
      }
  
      // Trap focus inside modal
      if (event.key === 'Tab') {
        const focusableElements = modalRef.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length < 2) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
  
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  
    function handleImageLoad() {
      imageLoaded = true;
    }
  
    function handleBackdropClick(event) {
      if (event.target === event.currentTarget) {
        closeMessage();
      }
    }
    
    // Cleanup on component destroy
    import { onDestroy } from 'svelte';
    
    onDestroy(() => {
      if (modalCloseTimeout) {
        clearTimeout(modalCloseTimeout);
      }
    });
</script>
  
{#if showMessage}
  <FocusManager active={showMessage} restoreFocus={true}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        bind:this={modalRef}
        tabindex="-1"
        class="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-95 backdrop-blur-md pb-4" 
        on:keydown={handleKeydown}
        on:click={handleBackdropClick}
        in:fade={{ duration: ANIMATION_DURATION }}
        out:fade={{ duration: ANIMATION_DURATION }}
        data-testid="error-modal"
        data-message-type={messageType}
      >
        <div 
          class="relative flex flex-col items-center justify-center mb-4 px-4 md:px-0"
          in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
        >
          <!-- Show animated image for contact/success/sending states -->
          {#if messageType === 'contact' || messageType === 'success' || messageType === 'sending'}
            <img
              src="../images/keymoji-animated-optimize-resize-160x160px.webp"
              alt=""
              aria-hidden="true"
              class="w-32 h-32 mb-4 {imageLoaded ? 'opacity-100' : 'opacity-0'} rounded-full pointer-events-none"
              on:load={handleImageLoad}
              style="transition: opacity 300ms ease-in-out;"
              loading="eager"
              decoding="async"
            />
          {:else}
            <!-- For errors and other message types, show an icon -->
            <div 
              class="w-32 h-32 mb-4 rounded-full flex items-center justify-center text-5xl"
              style="background-color: rgba(0,0,0,0.2); color: {getIconColor(messageType)}; border: 3px solid {getIconColor(messageType)};"
            >
              {getIcon(messageType)}
            </div>
          {/if}
          
          <div 
            class="bg-transparent text-center z-50 max-w-md"
            in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION + 200 }}
          >
            <h2 
              id="modal-title"
              class="text-white md:text-xl text-base font-bold p-2"
              aria-live="assertive"
            >
              {message}
            </h2>
            <p id="modal-description" class="sr-only">
              Press Escape to close this message
            </p>
            
            <!-- Show action button for certain message types -->
            {#if messageType === 'error' || messageType === 'warning'}
              <button 
                class="mt-4 px-4 py-2 bg-yellow text-black rounded-full hover:bg-yellow hover:opacity-90 transition-colors duration-200 min-h-11 min-w-20"
                on:click={closeMessage}
              >
                OK
              </button>
            {/if}
            
            <!-- For sending state, show a spinner -->
            {#if messageType === 'sending'}
              <div class="flex justify-center mt-3">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Close button - always visible except for 'sending' state -->
        {#if messageType !== 'sending'}
          <button 
            class="btn btn-fixed absolute top-5 right-4 py-3 px-4" 
            on:click={closeMessage}
            aria-label="Close notification"
            in:fade={{ duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
          >
            ❌
          </button>
        {/if}
    </FocusManager>
{/if}
  
<style>
    div[role="dialog"] {
      &::backdrop {
        background: rgba(0, 0, 0, 0.95);
      }
    }
  
    /* Optimize performance with composited animations */
    img, div {
      will-change: opacity, transform;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
    
    /* Prevent unwanted image interactions */
    img {
      user-drag: none;
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
  
    /* Larger touch targets */
    button {
      min-height: 44px;
      min-width: 44px;
    }
    
    /* Minimum size classes for buttons */
    .min-h-11 {
      min-height: 2.75rem;
    }
    
    .min-w-20 {
      min-width: 5rem;
    }
  
    /* Improved visual feedback */
    button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      box-shadow: 0 0 0 2px rgb(255, 255, 255);
    }
  
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
</style>