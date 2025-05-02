<!-- src/components/EmojiDisplay/EmojiDisplayUI.svelte -->
<script>
    import { fade, fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import { currentLanguage, isDisabled } from '../../stores/appStores.js';
    import { getText } from '../../utils/languages.js';
    
    const dispatch = createEventDispatcher();
    
    // Props
    export let randomEmojis = [];
    export let emojiCount = 5;
    export let storyInput = '';
    export let showTextArea = false;
    export let shouldAnimateEmojis = false;
    export let isStoryMode = false;
    export let showEmojiCodes = false;
    
    // Event Handlers
    function handleEmojiDisplayClick() {
        dispatch('copyToClipboard');
    }
    
    function handleKeyPress(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            dispatch('generateRandom');
        }
    }
    
    function handleTextareaKeydown(event) {
        if (event.key === "Enter") {
            dispatch('generateStory');
        }
    }
    
    function handleStoryInputChange(event) {
        dispatch('updateStoryInput', event.target.value);
    }
    
    function handleEmojiCountChange(event) {
        dispatch('updateEmojiCount', parseInt(event.target.value, 10));
    }
    
    // Helper Functions
    function getEmojiDisplay(emoji) {
        return showEmojiCodes ? emoji.codePointAt(0).toString(16) : emoji;
    }
    
    function isVisible(emoji) {
        return emoji && emoji.trim() !== '';
    }
  </script>
  
  <div id="emoji-password-generator" class="flex flex-col space-t-6 rounded-xl relative">
    <!-- Emoji Display Section -->
    <button 
      id="emoji-display" 
      tabindex="0" 
      class="max-w-72 flex flex-row h-14 justify-center items-center transform scale-114 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-117 focus:outline-none text-white bg-black gap-2 md:px-0 px-3 mb-4 md:pt-1 md:pb-1 pb-1 border-4 border-gray z-10" 
      on:click={handleEmojiDisplayClick} 
      on:keydown={e => e.key === 'Enter' && handleEmojiDisplayClick()} 
      aria-label={getText('emojiDisplay.clickToCopy', $currentLanguage)} 
      aria-live="polite"
      aria-pressed="false"
    >
      <div class="mt-1 md:mt-0 flex gap-2">
        {#if randomEmojis && randomEmojis.length > 0}
          {#each randomEmojis.filter(isVisible) as emoji, index (emoji)}
            <span class="text-2xl md:text-3xl" in:fly={{y: 100, duration: 300, delay: index * 300}}>
              {getEmojiDisplay(emoji)}
            </span>
          {/each}
        {:else}
          <div class="text-xs">
            {getText('emojiDisplay.dailyLimitReachedMessage', $currentLanguage) || "Sorry, daily limit of requests reached 😔"}
          </div>
        {/if}
      </div>
</button>
  
    <!-- Weitere UI-Elemente -->
    <!-- ... -->
    
    <!-- Action Buttons -->
<div 
      role="main"
      aria-label={getText('emojiDisplay.emojiDisplayTitle', $currentLanguage)} 
      class="flex space-x-4 mt-3 mb-2"
    >
      {#if isStoryMode}
        <button aria-label="Generate your written Story into fitting emojis" 
          on:click={() => dispatch('generateStory')} 
          class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full"
        >
          {getText('emojiDisplay.storyButtonClicked', $currentLanguage)}
        </button>
      {:else}
        <button aria-label="Toggle Story Form" 
          on:click={() => dispatch('toggleStoryMode')} 
          class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full opacity-50 cursor-not-allowed" 
          disabled
        >
          🔜 {getText('emojiDisplay.storyButton', $currentLanguage)}
        </button>
      {/if}
  
      <button
        aria-label={getText('emojiDisplay.randomButton', $currentLanguage)}
        on:click={() => dispatch('generateRandom')} 
        on:keydown={handleKeyPress} 
        class="bg-yellow text-black shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full"
        class:opacity-50={$isDisabled}
        class:cursor-not-allowed={$isDisabled}
        disabled={$isDisabled}
      >
        {getText('emojiDisplay.randomButton', $currentLanguage)}
      </button>
    </div>
</div>