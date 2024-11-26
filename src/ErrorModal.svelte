<script>
  import { fade, fly } from 'svelte/transition';
  import { modalMessage, isModalVisible } from './stores.js';

  $: message = $modalMessage;
  let showMessage = false;
  let imageLoaded = false;

  // Constants for animation timing
  const ANIMATION_DURATION = 320;
  const IMAGE_DISPLAY_DURATION = 1400; // Duration for one play of the WebP
  const MESSAGE_MIN_DURATION = 1600;
  const MESSAGE_WORD_MULTIPLIER = 200; // ms per word

  modalMessage.subscribe(value => {
    if (value) {
      showMessage = true;
      isModalVisible.set(true);
      imageLoaded = false;

      // Calculate display duration based on message length
      const wordCount = value.split(' ').length;
      const calculatedDuration = Math.max(
        MESSAGE_MIN_DURATION,
        wordCount * MESSAGE_WORD_MULTIPLIER
      );

      // Reset after animation completes
      setTimeout(() => {
        showMessage = false;
        isModalVisible.set(false);
      }, calculatedDuration + IMAGE_DISPLAY_DURATION);
    }
  });

  function closeMessage() {
    showMessage = false;
    modalMessage.set('');
    isModalVisible.set(false);
  }

  function handleImageLoad() {
    imageLoaded = true;
  }
</script>

{#if showMessage}
<div 
  class="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-95 pb-4" 
  transition:fade={{ duration: ANIMATION_DURATION }}
>
    <div 
      class="relative flex flex-col items-center justify-center mb-4"
      in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
    >
      <img
        src="/images/keymoji-animated-optimize-resize-160x160px.webp"
        alt="Animated notification"
        class="w-32 h-32 mb-4 {imageLoaded ? 'opacity-100' : 'opacity-0'} rounded-full"
        on:load={handleImageLoad}
        style="transition: opacity 300ms ease-in-out;"
      />
      
      <div 
        class="bg-transparent text-center z-50"
        in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: ANIMATION_DURATION + 200 }}
      >
        <h1 class="text-white md:text-2xl text-xl font-bold p-2">
          {message}
        </h1>
      </div>
    </div>

    <button 
      aria-label="Close the message popup" 
      class="w-16 btn btn-fixed btn-md top-5 right-4" 
      on:click={closeMessage}
      in:fade={{ duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }}
    >
      ❌
    </button>
</div>
{/if}

<style>
  /* Ensure smooth animation transitions */
  img {
    will-change: opacity;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  
  /* Prevent image drag */
  img {
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
</style>