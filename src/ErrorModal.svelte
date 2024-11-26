<script>
  import { fade, fly } from 'svelte/transition';
  import { modalMessage, isModalVisible } from './stores.js';

  // State management
  $: message = $modalMessage;
  let showMessage = false;
  let imageLoaded = false;
  let modalRef;

  // Constants for animation and accessibility
  const ANIMATION_DURATION = 320;
  const IMAGE_DISPLAY_DURATION = 1400;
  const MESSAGE_MIN_DURATION = 1800;
  const MESSAGE_WORD_MULTIPLIER = 200;

  // Error types for analytics and aria-labels
  const ERROR_TYPES = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
  };

  // Determine message type based on content
  function getMessageType(msg) {
    if (!msg) return ERROR_TYPES.INFO;
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes('success') || lowerMsg.includes('copied')) return ERROR_TYPES.SUCCESS;
    if (lowerMsg.includes('warning')) return ERROR_TYPES.WARNING;
    if (lowerMsg.includes('error') || lowerMsg.includes('failed')) return ERROR_TYPES.ERROR;
    return ERROR_TYPES.INFO;
  }

  // Handle modal display logic
  modalMessage.subscribe(value => {
    if (value) {
      showMessage = true;
      isModalVisible.set(true);
      imageLoaded = false;

      // Focus management for screen readers
      setTimeout(() => {
        modalRef?.focus();
      }, ANIMATION_DURATION);

      // Calculate display duration based on message complexity
      const wordCount = value.split(' ').length;
      const calculatedDuration = Math.max(
        MESSAGE_MIN_DURATION,
        wordCount * MESSAGE_WORD_MULTIPLIER
      );

      // Auto-close after appropriate duration
      const timeoutId = setTimeout(() => {
        closeMessage();
      }, calculatedDuration + IMAGE_DISPLAY_DURATION);

      // Cleanup timeout on early close
      return () => clearTimeout(timeoutId);
    }
  });

  // Close modal and restore focus
  function closeMessage() {
    showMessage = false;
    modalMessage.set('');
    isModalVisible.set(false);
    
    // Return focus to triggering element
    document.getElementById('emoji-display')?.focus();
  }

  // Handle keyboard interactions
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeMessage();
    }
  }

  function handleImageLoad() {
    imageLoaded = true;
  }

  // Handle click outside modal
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeMessage();
    }
  }
</script>

{#if showMessage}
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  bind:this={modalRef}
  tabindex="-1"
  class="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-95 pb-4" 
  on:keydown={handleKeydown}
  on:click={handleBackdropClick}
  transition:fade={{ duration: ANIMATION_DURATION }}
  data-testid="error-modal"
>
    <div 
      class="relative flex flex-col items-center justify-center mb-4 px-4"
      in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
      role="alertdialog"
      aria-describedby="modal-description"
    >
      <img
        src="./images/keymoji-animated-optimize-resize-160x160px.webp"
        alt=""
        aria-hidden="true"
        class="w-32 h-32 mb-4 {imageLoaded ? 'opacity-100' : 'opacity-0'} rounded-full pointer-events-none"
        on:load={handleImageLoad}
        style="transition: opacity 300ms ease-in-out;"
        loading="eager"
        decoding="async"
      />
      
      <div 
        class="bg-transparent text-center z-50 max-w-md"
        in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION + 200 }}
      >
        <h1 
          id="modal-title"
          class="text-white md:text-2xl text-base font-bold p-2"
          aria-live="assertive"
          role="status"
          data-message-type={getMessageType(message)}
        >
          {message}
        </h1>
        <p id="modal-description" class="sr-only">
          Press Escape to close this message
        </p>
      </div>
    </div>

    <button 
      class="w-16 btn btn-fixed btn-md top-5 right-4" 
      on:click={closeMessage}
      aria-label="Close notification"
      in:fade={{ duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
    >
      ❌
    </button>
</div>
{/if}

<style>
  /* Optimize performance with composited animations */
  img {
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

  /* Ensure modal is on top of other content */
  div[role="dialog"] {
    isolation: isolate;
  }

  /* Improve touch target sizes */
  button {
    min-height: 44px;
    min-width: 44px;
  }

  /* Enhance visual feedback */
  button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
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