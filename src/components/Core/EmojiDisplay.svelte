<!-- src/EmojiDisplay.svelte (updated) -->
<script>
    import { fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import { 
        successfulStoryRequests, 
        isDisabled,
        dailyLimit,
        isLoggedIn,
        currentAccount,
        accountTier
    } from '../../stores/appStores.js';
    import { 
        showSuccess, 
        showError, 
        showWarning,
        showModal,
        isModalVisible
    } from '../../stores/modalStore.js';
    import { translations } from '../../stores/contentStore.js';
import { STORAGE_KEYS, storageHelpers } from '../../config/storage.js';
    import emojisData from '../../../public/emojisArray.json';
    import { WEBHOOKS } from '../../../src/config/api.js';
import { getDailyLimitForUser, validateUserLimits } from '../../config/limits.js';

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

    // Timeout-Tracking für Memory Leak Prevention
    let activeTimeouts = new Set();
    let modalVisibilityUnsubscribe;

    const emojis = emojisData.emojis;
  
    // Constants
    const DISABLE_DURATION_MS = 3000;
    
    // Helper-Funktion für sichere setTimeout mit Cleanup
    function safeSetTimeout(callback, delay) {
        const timeoutId = setTimeout(() => {
            activeTimeouts.delete(timeoutId);
            callback();
        }, delay);
        activeTimeouts.add(timeoutId);
        return timeoutId;
    }
    
    // Lifecycle
    onMount(() => {
      checkAndResetDailyLimit();

      if (!initialRenderComplete) {
        generateRandomEmojis(true); // count initial load towards daily limit
      }
      
      initialRenderComplete = true;
      
      // Subscribe to modal visibility with cleanup tracking
      modalVisibilityUnsubscribe = isModalVisible.subscribe((visible) => {
        if (visible) {
          safeSetTimeout(() => {
            shouldAnimateEmojis = true;
          }, 1000);
        }
      });
    });
    
    onDestroy(() => {
      // Bereinige alle aktiven Timeouts
      activeTimeouts.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      activeTimeouts.clear();
      
      // Bereinige Store-Subscriptions
      if (modalVisibilityUnsubscribe) {
        modalVisibilityUnsubscribe();
      }
    });
  
    // Main Functions
    async function generateRandomEmojis(countTowardsLimit = true) {
      try {
        if (checkLimits()) return;

        // Check daily limit using central configuration
        const userLimits = validateUserLimits($isLoggedIn, $accountTier, $dailyLimit?.used || 0);
        if (userLimits.isReached) {
            // Redirect to account page for upsell
            window.location.href = '/account';
            return;
        }
  
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
          showErrorMessage($translations.emojiDisplay.errorMessage);
        }
      } catch (error) {
        handleError('Story Generation Error', error);
      }
    }
  
    // Helper Functions
    function checkLimits() {
      if ($isDisabled || isDailyLimitReached()) {
        isDisabled.set(true);
        showDailyLimitModal($translations.emojiDisplay.dailyLimitReachedMessage);
        return true;
      }
      return false;
    }
  
    async function handleSuccessfulGeneration(countTowardsLimit = true) {
      await copyToClipboard(randomEmojis.join(' '));
      showSuccessMessage($translations.emojiDisplay.successMessage);
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
              showSuccessMessage($translations.emojiDisplay.successStoryMessage);
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
    
    // Save to recent emojis
    saveToRecentEmojis(cleanText);
    
    try {
        // Fokussiere das Dokument zuerst
        window.focus();
        
        // Moderne Clipboard API verwenden
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(cleanText);
            console.log('Clipboard: Success via API');
            return;
        }
        
        // Fallback für nicht-secure Contexts
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
        
        // Versuche modernen Ansatz
        try {
            await navigator.clipboard.writeText(cleanText);
            console.log('Clipboard: Success via fallback API');
        } catch (clipboardError) {
            // Letzter Fallback - zeige manuelle Kopier-Option
            console.log('Clipboard: Manual copy required');
            showInfo(
                $translations.emojiDisplay.clipboardManual || 
                'Click the emoji display to copy manually!'
            );
            
            // Speichere Text für manuelles Kopieren
            window.lastGeneratedEmojis = cleanText;
        } finally {
            document.body.removeChild(textArea);
        }
    } catch (error) {
        console.error('Clipboard Error:', error);
        
        // Zeige alternative Lösung
        showInfo(
            $translations.emojiDisplay.clipboardError || 
            'Click the emoji display to copy manually!'
        );
        
        // Speichere Text für manuelles Kopieren
        window.lastGeneratedEmojis = cleanText;
    }
}
  
    function handleError(type, error) {
      console.error(`${type}:`, error);
              showErrorMessage($translations.emojiDisplay.errorMessage);
    }
  
    // State Management Functions
    function temporarilyDisableButton() {
      isDisabled.set(true);
      safeSetTimeout(() => isDisabled.set(false), DISABLE_DURATION_MS);
    }
  
    function showDailyLimitModal(message) {
      console.log('🔴 DEBUG: Daily Limit Modal triggered!', { message });
      // Dedicated function for Daily Limit Modal
      showModal(message, 'warning', null, {
        showSpinner: false,
        isDailyLimitModal: true
      });
      console.log('🔴 DEBUG: Daily Limit Modal showModal called!');
    }

    function showErrorMessage(message) {
      showWarning(message);
    }
  
    function showSuccessMessage(message) {
      showSuccess(message);
    }
  
    // Local Storage Functions
    function getDailyRequestCount() {
      return parseInt(storageHelpers.get(STORAGE_KEYS.DAILY_REQUEST_COUNT, '0'), 10);
    }
  
    function setDailyRequestCount(count) {
      storageHelpers.set(STORAGE_KEYS.DAILY_REQUEST_COUNT, count);
    }
  
    function incrementDailyRequestCount() {
      setDailyRequestCount(getDailyRequestCount() + 1);
    }
  
    function resetDailyRequestCount() {
      setDailyRequestCount(0);
    }
  
    function checkAndResetDailyLimit() {
      const storedDate = storageHelpers.get(STORAGE_KEYS.STORED_DATE);
      const currentDate = new Date().toDateString();
  
      if (storedDate !== currentDate) {
        resetDailyRequestCount();
        storageHelpers.set(STORAGE_KEYS.STORED_DATE, currentDate);
      }
    }
    
    // Recent Emojis Management
    function saveToRecentEmojis(emojiString) {
      try {
        const recent = storageHelpers.get(STORAGE_KEYS.RECENT_EMOJIS, []);
        
        // Remove if already exists (to move to front)
        const filtered = recent.filter(emoji => emoji !== emojiString);
        
        // Add to front, limit to 10 items
        const updated = [emojiString, ...filtered].slice(0, 10);
        
        storageHelpers.set(STORAGE_KEYS.RECENT_EMOJIS, updated);
      } catch (error) {
        console.warn('Failed to save recent emoji:', error);
      }
    }
  
    function isDailyLimitReached() {
      const userLimits = validateUserLimits($isLoggedIn, $accountTier, getDailyRequestCount());
      return userLimits.isReached;
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
</script>
  
<div id="emoji-password-generator" class="flex flex-col space-t-6 rounded-xl relative w-full">
    <!-- Emoji Display Section -->
    <button 
      id="emoji-display" 
      tabindex="0" 
      class="core-button text-white bg-black border-gray-400 px-3 mb-2 md:pt-1 md:pb-1 pb-1 transform -translate-y-2.5" 
      on:click={generateRandomEmojis} 
      on:keydown={e => e.key === 'Enter' && generateRandomEmojis()} 
              aria-label={$translations.emojiDisplay.clickToCopy} 
      aria-live="polite"
      aria-pressed="false"
    >
      <div class="mt-1 md:mt-0 flex gap-2 overflow-visible">
        {#if randomEmojis && randomEmojis.length > 0}
          {#each randomEmojis.filter(isVisible) as emoji, index (emoji)}
            <span class="text-2xl md:text-3xl" in:fly={{y: 50, duration: 300, delay: index * 100}}>
              {getEmojiDisplay(emoji)}
            </span>
          {/each}
        {:else}
          <div class="text-xs">
            {$translations.emojiDisplay.dailyLimitReachedMessage}
          </div>
        {/if}
      </div>
    </button>
  
    <!-- Instructions Section -->
    <div class="flex flex-wrap justify-center items-center">
      <h2 class="mt-1 text-xs text-center dark:text-white z-10">
        {#each $translations.index.pageInstruction as instruction, i}
          {#if i === 0}
            <p><u>Story Mode coming soon</u></p>
          {:else}
            <p>{instruction}</p>
          {/if}
        {/each}
      </h2>  
    </div>
  
    <!-- Emoji Count Slider -->
    <div class="flex flex-auto items-baseline md:w-100 space-x-4 my-1 pt-1 dark:text-white w-full">
      <label for="emojiCount">Level</label>
      <input 
        type="range" 
        id="emojiCount" 
        min="4" 
        max="9" 
        bind:value={emojiCount} 
        class="md:w-100 w-full mt-3 appearance-none rounded-full bg-gray-600 h-2 transition-all" 
      />
      <span>{emojiCount}</span>
    </div>
  
    <!-- Story Input Section -->
    {#if showTextArea}
      <textarea 
        bind:value={storyInput} 
        placeholder={$translations.emojiDisplay.placeholderText} 
        class="appearance-none block w-full text-gray rounded-2xl py-3 px-4 md:mb-3 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-900 dark:text-white  focus:bg-white" 
        on:keydown={handleTextareaKeydown} 
        minlength="40"
      />
      <p class="text-sm text-gray text-left py-3" aria-label="information">
        {$translations.emojiDisplay.dataPrivacyProcessingInfo}
      </p>
      <button aria-label="Clear the form inputs" 
        on:click={clearInput} 
        class="bg-white dark:bg-aubergine-900 text-gray transition duration-300 ease-in-out transform hover:scale-105 px-3 py-3 rounded-full"
      >
        {$translations.emojiDisplay.clearButton}
      </button>
    {/if}
  
    <!-- Action Buttons -->
    <div 
      role="main"
              aria-label={$translations.emojiDisplay.emojiDisplayTitle} 
      class="flex space-x-4 mt-3 mb-2"
    >
      {#if isStoryMode}
        <button aria-label="Generate your writte Story into fitting emojis" 
          on:click={generateEmojis} 
          class="bg-powder-500 text-black dark:bg-aubergine-900 dark:text-powder-500 shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-4 rounded-full"
        >
          {$translations.emojiDisplay.storyButtonClicked}
        </button>
      {:else}
        <button aria-label="Toggle Story Form" 
          on:click={toggleStoryMode} 
          class="bg-powder-500 text-black dark:bg-aubergine-900 dark:text-powder-500 shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-4 rounded-full opacity-50 cursor-not-allowed" 
          disabled
        >
          🔜 {$translations.emojiDisplay.storyButton}
        </button>
      {/if}
  
      <button
        aria-label={$translations.emojiDisplay.randomButton}
        on:click={() => generateRandomEmojis(true)} 
        on:keydown={handleKeyPress} 
        class="bg-yellow-500 text-black shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full"
        class:opacity-50={$isDisabled}
        class:cursor-not-allowed={$isDisabled}
        disabled={$isDisabled}
      >
        {$translations.emojiDisplay.randomButton}
      </button>
    </div>
</div>