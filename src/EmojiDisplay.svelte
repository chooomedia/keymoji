<!-- src/EmojiDisplay.svelte (updated) -->
<script>
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { 
        currentLanguage, 
        successfulStoryRequests, 
        isDisabled 
    } from './stores/appStores.js';
    import { 
        showSuccess, 
        showError, 
        showWarning,
        isModalVisible
    } from './stores/modalStore.js';
    import emojisData from '../public/emojisArray.json';
    import content from './content.js';
    import { WEBHOOKS } from './config/api.js';

    // Props
    export let showEmojiCodes = false;
  
    // State
    let storyInput = '';
    let randomEmojis = [];
    let emojiCount = 5;
    let showTextArea = false;
    let shouldAnimateEmojis = false;
    let isStoryMode = false;
    let initialRenderComplete = false;

    const emojis = emojisData.emojis;
  
    // Constants
    const DISABLE_DURATION_MS = 3000;
    const DAILY_LIMIT = 3;
    
    // Lifecycle
    onMount(() => {
      checkAndResetDailyLimit();

      if (!initialRenderComplete) {
        generateRandomEmojis(true); // count initial load towards daily limit
      }
      
      initialRenderComplete = true;
    });
  
    // Main Functions
    async function generateRandomEmojis(countTowardsLimit = true) {
      try {
        if (checkLimits()) return;
  
        randomEmojis = getRandomEmojis(emojiCount);
        // Fokussiere das Dokument vor dem Kopieren
        window.focus();
        await handleSuccessfulGeneration(countTowardsLimit);
      } catch (error) {
        handleError('Random Generation Error', error);
      }
    }
  

    async function generateEmojis() {
      try {
        if (checkLimits()) return;
        if (!storyInput.trim()) {
          showTextArea = true;
          return;
        }
  
        const response = await fetchEmojiStory();
        if (response?.length > 0) {
          await handleSuccessfulStoryGeneration(response);
        } else {
          showErrorMessage(content[$currentLanguage].emojiDisplay.errorMessage);
        }
      } catch (error) {
        handleError('Story Generation Error', error);
      }
    }
  
    // Helper Functions
    function checkLimits() {
      if ($isDisabled || isDailyLimitReached()) {
        isDisabled.set(true);
        showErrorMessage(content[$currentLanguage].emojiDisplay.dailyLimitReachedMessage);
        return true;
      }
      return false;
    }
  
    async function handleSuccessfulGeneration(countTowardsLimit = true) {
      await copyToClipboard(randomEmojis.join(' '));
      showSuccessMessage(content[$currentLanguage].emojiDisplay.successMessage);
      showTextArea = false;
      temporarilyDisableButton();
      
      // Only increment counter if this is a user-initiated action
      if (countTowardsLimit) {
        incrementDailyRequestCount();
      }
    }
  
    async function handleSuccessfulStoryGeneration(response) {
      randomEmojis = response;
      await copyToClipboard(randomEmojis.join(' '));
      showSuccessMessage(content[$currentLanguage].emojiDisplay.successStoryMessage);
      shouldAnimateEmojis = true;
      incrementDailyRequestCount();
    }
  
    async function fetchEmojiStory() {
      const response = await fetch(WEBHOOKS.STORY_GENERATOR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ emojiCount, storyInput }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch emoji story');
      }
  
      const data = await response.json();
      successfulStoryRequests.update(requests => [
        ...requests,
        { text: data.text, emojis: data.text.split(' ').join(' ') }
      ]);
  
      return data.text.split(' ');
    }
  
    // Utility Functions
    function getRandomEmojis(count) {
      if (!emojis || !Array.isArray(emojis)) {
        console.error('Emojis array is not properly loaded');
        return [];
      }
      return [...emojis].sort(() => Math.random() - 0.5).slice(0, count);
    }
  
    async function copyToClipboard(text) {
    const cleanText = text.replace(/ /g, '');
    
    try {
        // Fokussiere das Dokument zuerst
        window.focus();
        
        // Prüfe ob Clipboard API verfügbar und Dokument fokussiert ist
        if (navigator.clipboard && window.isSecureContext && document.hasFocus()) {
            await navigator.clipboard.writeText(cleanText);
            console.log('Clipboard: Success via API');
        } else {
            // Fallback Methode
            const textArea = document.createElement('textarea');
            textArea.value = cleanText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            textArea.setAttribute('readonly', '');
            
            document.body.appendChild(textArea);
            
            // Fokus und Select
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    console.log('Clipboard: Success via fallback');
                } else {
                    throw new Error('Copy command failed');
                }
            } catch (err) {
                console.error('Clipboard: Fallback failed', err);
                throw err;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    } catch (error) {
        console.error('Clipboard Error:', error);
        
        // Zeige alternative Lösung
        showWarning(
            content[$currentLanguage]?.emojiDisplay?.clipboardError || 
            'Unable to copy automatically. Click the emoji display to copy!'
        );
        
        // Speichere Text für manuelles Kopieren
        window.lastGeneratedEmojis = cleanText;
    }
}
  
    function handleError(type, error) {
      console.error(`${type}:`, error);
      showErrorMessage(content[$currentLanguage].emojiDisplay.errorMessage);
    }
  
    // State Management Functions
    function temporarilyDisableButton() {
      isDisabled.set(true);
      setTimeout(() => isDisabled.set(false), DISABLE_DURATION_MS);
    }
  
    function showErrorMessage(message) {
      showWarning(message);
    }
  
    function showSuccessMessage(message) {
      showSuccess(message);
    }
  
    // Local Storage Functions
    function getDailyRequestCount() {
      return parseInt(localStorage.getItem('dailyRequestCount') || '0', 10);
    }
  
    function setDailyRequestCount(count) {
      localStorage.setItem('dailyRequestCount', count.toString());
    }
  
    function incrementDailyRequestCount() {
      setDailyRequestCount(getDailyRequestCount() + 1);
    }
  
    function resetDailyRequestCount() {
      setDailyRequestCount(0);
    }
  
    function checkAndResetDailyLimit() {
      const storedDate = localStorage.getItem('storedDate');
      const currentDate = new Date().toDateString();
  
      if (storedDate !== currentDate) {
        resetDailyRequestCount();
        localStorage.setItem('storedDate', currentDate);
      }
    }
  
    function isDailyLimitReached() {
      return getDailyRequestCount() >= DAILY_LIMIT;
    }
  
    function handleKeyPress(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        generateRandomEmojis();
      }
    }
  
    function handleTextareaKeydown(event) {
      if (event.key === "Enter") {
        generateEmojis();
      }
    }
  
    // UI Helper Functions
    function getEmojiDisplay(emoji) {
      return showEmojiCodes ? emoji.codePointAt(0).toString(16) : emoji;
    }
  
    function isVisible(emoji) {
      return emoji && emoji.trim() !== '';
    }
  
    function clearInput() {
      storyInput = '';
    }
  
    function toggleStoryMode() {
      isStoryMode = !isStoryMode;
      if (isStoryMode) {
        showTextArea = true;
      }
    }
  
    // Reactive Statements
    $: if ($isModalVisible) {
      setTimeout(() => {
        shouldAnimateEmojis = true;
      }, 1000);
    }
</script>
  
<div id="emoji-password-generator" class="flex flex-col space-t-6 rounded-xl relative">
    <!-- Emoji Display Section -->
    <button 
      id="emoji-display" 
      tabindex="0" 
      class="max-w-72 flex flex-row h-14 justify-center items-center transform scale-114 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-117 focus:outline-none text-white bg-black gap-2 md:px-0 px-3 mb-4 md:pt-1 md:pb-1 pb-1 border-4 border-gray z-10" 
      on:click={generateRandomEmojis} 
      on:keydown={e => e.key === 'Enter' && generateRandomEmojis()} 
      aria-label={content[$currentLanguage].emojiDisplay.clickToCopy} 
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
            {content[$currentLanguage].emojiDisplay.dailyLimitReachedMessage || "Sorry, daily limit of requests reached 😔"}
          </div>
        {/if}
      </div>
    </button>
  
    <!-- Instructions Section -->
    <div class="flex flex-wrap justify-center items-center">
      <h2 class="mt-1 text-xs text-center dark:text-white z-10">
        {#each content[$currentLanguage].index.pageInstruction as instruction, i}
          {#if i === 0}
            <p><u>Story Mode coming soon</u></p>
          {:else}
            <p>{instruction}</p>
          {/if}
        {/each}
      </h2>  
    </div>
  
    <!-- Emoji Count Slider -->
    <div class="flex flex-auto items-baseline md:w-100 space-x-4 my-1 pt-1 dark:text-white">
      <label for="emojiCount">Level</label>
      <input 
        type="range" 
        id="emojiCount" 
        min="4" 
        max="9" 
        bind:value={emojiCount} 
        class="md:w-100 w-screen mt-3 appearance-none rounded-full bg-gray h-2 transition-all" 
      />
      <span>{emojiCount}</span>
    </div>
  
    <!-- Story Input Section -->
    {#if showTextArea}
      <textarea 
        bind:value={storyInput} 
        placeholder={content[$currentLanguage].emojiDisplay.placeholderText} 
        class="appearance-none block w-full text-gray-dark rounded-2xl py-3 px-4 md:mb-3 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark dark:text-white focus:outline-none focus:bg-white" 
        on:keydown={handleTextareaKeydown} 
        minlength="40"
      />
      <p class="text-sm text-gray text-left py-3" aria-label="information">
        {content[$currentLanguage].emojiDisplay.dataPrivacyProcessingInfo}
      </p>
      <button aria-label="Clear the form inputs" 
        on:click={clearInput} 
        class="bg-white dark:bg-aubergine-dark text-gray-dark dark:text-white transition duration-300 ease-in-out transform hover:scale-105 px-3 py-3 rounded-full"
      >
        {content[$currentLanguage].emojiDisplay.clearButton}
      </button>
    {/if}
  
    <!-- Action Buttons -->
    <div 
      role="main"
      aria-label={content[$currentLanguage].emojiDisplay.emojiDisplayTitle} 
      class="flex space-x-4 mt-3 mb-2"
    >
      {#if isStoryMode}
        <button aria-label="Generate your writte Story into fitting emojis" 
          on:click={generateEmojis} 
          class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full"
        >
          {content[$currentLanguage].emojiDisplay.storyButtonClicked}
        </button>
      {:else}
        <button aria-label="Toggle Story Form" 
          on:click={toggleStoryMode} 
          class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full opacity-50 cursor-not-allowed" 
          disabled
        >
          🔜 {content[$currentLanguage].emojiDisplay.storyButton}
        </button>
      {/if}
  
      <button
        aria-label={content[$currentLanguage].emojiDisplay.randomButton}
        on:click={() => generateRandomEmojis(true)} 
        on:keydown={handleKeyPress} 
        class="bg-yellow text-black shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full"
        class:opacity-50={$isDisabled}
        class:cursor-not-allowed={$isDisabled}
        disabled={$isDisabled}
      >
        {content[$currentLanguage].emojiDisplay.randomButton}
      </button>
    </div>
</div>