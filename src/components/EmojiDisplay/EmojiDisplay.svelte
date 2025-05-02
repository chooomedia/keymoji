<!-- src/components/EmojiDisplay/EmojiDisplay.svelte -->
<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { currentLanguage, isDisabled } from '../../stores/appStores.js';
    import { showSuccess, showError, showWarning } from '../../stores/modalStore.js';
    import { generateRandomEmojis, generateEmojiStory } from '../../services/emojiService.js';
    import { localStore } from '../../utils/localStore.js';
    import EmojiDisplayUI from './EmojiDisplayUI.svelte';
    import { getText } from '../../utils/languages.js';
    
    // Props
    export let showEmojiCodes = false;
    
    // State
    const emojiCount = localStore('emojiCount', 5);
    const randomEmojis = writable([]);
    const storyInput = writable('');
    const showTextArea = writable(false);
    const shouldAnimateEmojis = writable(false);
    const isStoryMode = writable(false);
    
    // Constants
    const DISABLE_DURATION_MS = 3000;
    const DAILY_LIMIT = 3;
    
    // Lifecycle
    onMount(() => {
        checkAndResetDailyLimit();
        if (!initialRenderComplete) {
            handleGenerateRandomEmojis(true); // count towards limit
        }
        initialRenderComplete = true;
    });
    
    // Main Functions
    async function handleGenerateRandomEmojis(countTowardsLimit = true) {
        try {
            if (checkLimits()) return;
            
            const emojis = await generateRandomEmojis($emojiCount);
            randomEmojis.set(emojis);
            
            await handleSuccessfulGeneration(countTowardsLimit);
        } catch (error) {
            handleError('Random Generation Error', error);
        }
    }
    
    async function handleGenerateEmojiStory() {
        try {
            if (checkLimits()) return;
            
            if (!$storyInput.trim()) {
                showTextArea.set(true);
                return;
            }
            
            const response = await generateEmojiStory($storyInput, $emojiCount);
            
            if (response?.text?.length > 0) {
                await handleSuccessfulStoryGeneration(response);
            } else {
                showErrorMessage(getText('emojiDisplay.errorMessage', $currentLanguage));
            }
        } catch (error) {
            handleError('Story Generation Error', error);
        }
    }
    
    // Helper Functions
    function checkLimits() {
        if ($isDisabled || isDailyLimitReached()) {
            isDisabled.set(true);
            showErrorMessage(getText('emojiDisplay.dailyLimitReachedMessage', $currentLanguage));
            return true;
        }
        return false;
    }
    
    // Event Handlers
    function handleCopyToClipboard() {
        if ($randomEmojis.length > 0) {
            copyToClipboard($randomEmojis.join('')).then(() => {
            showSuccessMessage(getText('emojiDisplay.successMessage', $currentLanguage));
            }).catch(error => {
            handleError('Copy Error', error);
            });
        }
    }
    
    function handleClearInput() {
      storyInput.set('');
    }
    
    function handleToggleStoryMode() {
      isStoryMode.update(value => !value);
      if ($isStoryMode) {
        showTextArea.set(true);
      }
    }
    
    // Storage Functions
    function getDailyRequestCount() {
      try {
        return parseInt(localStorage.getItem('dailyRequestCount') || '0', 10);
      } catch (e) {
        console.warn('Error reading dailyRequestCount:', e);
        return 0;
      }
    }
    
    // ... andere Helper-Funktionen
</script>
  
<EmojiDisplayUI
{randomEmojis}
    {emojiCount}
    {storyInput}
    {showTextArea}
    {shouldAnimateEmojis}
    {isStoryMode}
    {showEmojiCodes}
    on:generateRandom={() => handleGenerateRandomEmojis(true)}
    on:generateStory={handleGenerateEmojiStory}
    on:copyToClipboard={handleCopyToClipboard}
    on:clearInput={handleClearInput}
    on:toggleStoryMode={handleToggleStoryMode}
    on:updateEmojiCount={e => emojiCount.set(e.detail)}
    on:updateStoryInput={e => storyInput.set(e.detail)}
/>