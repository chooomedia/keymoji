<!-- src/ErrorModal.svelte -->
<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import FocusManager from './components/A11y/FocusManager.svelte';
    
    // Import from the modal store
    import { 
      modalMessage, 
      isModalVisible, 
      modalType, 
      modalData, 
      closeModal 
    } from './stores/modalStore.js';
  
    // State management
    $: message = $modalMessage;
    $: messageType = $modalType || getMessageType(message);
    $: showMessage = $isModalVisible && $modalMessage && $modalMessage.trim() !== '';
    
    let imageLoaded = false;
    let modalRef;
    let lastActiveElement;
  
    // Constants for animation and accessibility
    const ANIMATION_DURATION = 300;
  
    // Icons for different message types
    const ICONS = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
      contact: '💌',
      sending: '📨'
    };
  
    // Message type detector als Fallback
    function getMessageType(msg) {
      if (!msg) return 'info';
      
      const lowerMsg = msg.toLowerCase();
      
      if (lowerMsg.includes('success') || lowerMsg.includes('sent') || lowerMsg.includes('received')) return 'success';
      if (lowerMsg.includes('sending') || lowerMsg.includes('processing')) return 'sending';
      if (lowerMsg.includes('error') || lowerMsg.includes('failed') || lowerMsg.includes('could not')) return 'error';
      if (lowerMsg.includes('warning') || lowerMsg.includes('invalid') || lowerMsg.includes('check')) return 'warning';
      if (lowerMsg.includes('fix') || lowerMsg.includes('validation')) return 'warning';
      if (lowerMsg.includes('contact') || lowerMsg.includes('message')) return 'contact';
      
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
  
    // Handle manually closing the modal
    function handleCloseModal() {
      closeModal();
    }
  
    // Keyboard handlers
    function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseModal();
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
        handleCloseModal();
      }
    }
    
    // Component lifecycle
    onMount(() => {
      // Save current focused element
      lastActiveElement = document.activeElement;
    });
    
    // Cleanup on component destroy
    onDestroy(() => {
      // Make sure we don't leave any modal state active when unmounting
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        try {
          lastActiveElement.focus();
        } catch (e) {
          console.warn('Could not restore focus:', e);
        }
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
          in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION/2 }}
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
            in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
          >
            <h2 
              id="modal-title"
              class="text-white md:text-xl text-base font-bold p-2"
              aria-live="assertive"
            >
              {message}
            </h2>
            <p id="modal-description" class="sr-only">
              {messageType === 'error' || messageType === 'warning' 
                ? 'Press Escape or click the close button to dismiss this message' 
                : 'This message will close automatically'}
            </p>
            
            <!-- Show action button for certain message types -->
            {#if messageType === 'error' || messageType === 'warning'}
              <button 
                class="mt-4 px-6 py-3 bg-yellow text-black rounded-full hover:bg-yellow hover:opacity-90 transition-colors duration-200 min-h-11 min-w-28"
                on:click={handleCloseModal}
                aria-label="Close message"
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
            
            <!-- Show custom button content if provided via modalData -->
            {#if $modalData && $modalData.buttonText}
              <button 
                class="mt-4 px-6 py-3 bg-yellow text-black rounded-full hover:bg-yellow hover:opacity-90 transition-colors duration-200 min-h-11 min-w-28"
                on:click={$modalData.buttonAction || handleCloseModal}
                aria-label={$modalData.buttonText}
              >
                {$modalData.buttonText}
              </button>
            {/if}
          </div>
        </div>
        
        <!-- Close button - always visible except for 'sending' state -->
        {#if messageType !== 'sending'}
          <button 
            class="btn btn-fixed absolute top-5 right-4 py-3 px-4" 
            on:click={handleCloseModal}
            aria-label="Close notification"
            in:fade={{ duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
          >
            ❌
          </button>
        {/if}
      </div>
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
    
    .min-w-28 {
      min-width: 7rem;
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