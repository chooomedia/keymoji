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
    import { getCurrentUserSettings, userSettings, effectiveSettings } from '../../stores/userSettingsStore.js';
    import { STORAGE_KEYS, storageHelpers } from '../../config/storage.js';
    import emojisData from '../../../public/emojisArray.json';
    import { WEBHOOKS } from '../../../src/config/api.js';
    import { getDailyLimitForUser, validateUserLimits } from '../../config/limits.js';
    import { incrementDailyUsage, initializeDailyUsage } from '../../stores/dailyUsageStore.js';
    import { generateStoryEmojis } from '../../utils/storyModeAI.js';

    // Props
    export let showEmojiCodes = false;
  
    // State
    let storyInput = '';
    let randomEmojis = [];
    let emojiCount = 9; // Updated: Default 9 emojis for FREE users
    let showTextArea = false;
    
    // Story Mode - Persistent text input
    const STORY_INPUT_KEY = 'keymoji_story_input';
    
    // Load last story input from localStorage
    if (typeof window !== 'undefined') {
      const savedInput = localStorage.getItem(STORY_INPUT_KEY);
      if (savedInput) {
        storyInput = savedInput;
        console.log('📝 Loaded saved story input:', storyInput.substring(0, 50) + '...');
      }
    }
    
    // Save story input to localStorage on every change (reactive)
    $: if (typeof window !== 'undefined') {
      if (storyInput && storyInput.trim()) {
        localStorage.setItem(STORY_INPUT_KEY, storyInput);
      } else if (storyInput === '') {
        localStorage.removeItem(STORY_INPUT_KEY);
      }
    }
    let shouldAnimateEmojis = false;
    let isStoryMode = false;
    let initialRenderComplete = false;
    
    // Story Mode Settings (reactive)
    let storyModeEnabled = false;
    let storyModeConfigured = false; // Has API key
    
    // REACTIVE: Update Story Mode status when ANY store changes
    // Priority: effectiveSettings > userSettings > currentAccount
    $: {
        let storyModeSettings = null;
        
        // Try effectiveSettings first (most up-to-date)
        if ($effectiveSettings?.storyMode) {
            storyModeSettings = $effectiveSettings.storyMode;
            console.log('📊 Using effectiveSettings for Story Mode');
        }
        // Fallback to userSettings
        else if ($userSettings?.storyMode) {
            storyModeSettings = $userSettings.storyMode;
            console.log('📦 Using userSettings for Story Mode');
        }
        // Fallback to currentAccount
        else if ($currentAccount?.metadata?.settings?.storyMode) {
            storyModeSettings = $currentAccount.metadata.settings.storyMode;
            console.log('👤 Using currentAccount for Story Mode');
        }
        
        if (storyModeSettings) {
            const enabled = storyModeSettings.enabled ?? false;
            const currentProvider = storyModeSettings.provider || 'openai';
            const apiKeys = storyModeSettings.apiKeys || {};
            const currentApiKey = apiKeys[currentProvider] || '';
            const configured = !!(currentApiKey && currentApiKey.length >= 10);
            
            // Always update (let Svelte handle change detection)
            storyModeEnabled = enabled;
            storyModeConfigured = configured;
            
            console.log('🔄 Story Mode settings updated:', { 
                enabled: storyModeEnabled, 
                configured: storyModeConfigured,
                provider: currentProvider,
                hasApiKey: !!currentApiKey,
                keyLength: currentApiKey?.length || 0,
                source: $effectiveSettings?.storyMode ? 'effectiveSettings' : 
                        $userSettings?.storyMode ? 'userSettings' : 'currentAccount'
            });
        } else {
            console.warn('⚠️ No storyMode settings found in ANY store:', { 
                hasEffectiveSettings: !!$effectiveSettings,
                hasUserSettings: !!$userSettings, 
                hasCurrentAccount: !!$currentAccount,
                effectiveSettingsKeys: $effectiveSettings ? Object.keys($effectiveSettings) : [],
                userSettingsKeys: $userSettings ? Object.keys($userSettings) : []
            });
        }
    }

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
    onMount(async () => {
      // REMOVED: initializeDailyUsage() is now called centrally in LanguageRouter
      // This prevents duplicate initialization and ensures single source of truth
      console.log('✅ EmojiDisplay: Using centralized daily usage tracking');
      console.log('📊 Current daily limits on mount:', $dailyLimit);
      
      // CRITICAL: Wait for dailyLimit to be initialized before first generation
      // This prevents generating with default limit (3) before actual limit loads
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('📊 Daily limits after wait:', $dailyLimit);

      // Check user settings for Story Mode and Auto-Generate
      const userSettings = getCurrentUserSettings();
      const autoGenerateEnabled = userSettings?.autoGenerate ?? false;
      
      // Story Mode Configuration - set immediately from getCurrentUserSettings
      if (userSettings?.storyMode) {
        storyModeEnabled = userSettings.storyMode.enabled ?? false;
        const currentProvider = userSettings.storyMode.provider || 'openai';
        const apiKeys = userSettings.storyMode.apiKeys || {};
        const currentApiKey = apiKeys[currentProvider] || '';
        storyModeConfigured = !!(currentApiKey && currentApiKey.length >= 10);
        
        console.log('🎯 Auto-generate setting:', autoGenerateEnabled);
        console.log('🤖 Story Mode initialized:', {
          enabled: storyModeEnabled,
          configured: storyModeConfigured,
          provider: currentProvider,
          hasApiKey: !!currentApiKey,
          keyLength: currentApiKey?.length || 0
        });
      } else {
        console.warn('⚠️ No Story Mode settings found in userSettings');
      }

      if (!initialRenderComplete && autoGenerateEnabled) {
        console.log('🤖 Auto-generating emojis on page load');
        generateRandomEmojis(true); // count initial load towards daily limit
      } else if (!initialRenderComplete && !autoGenerateEnabled) {
        console.log('⏸️ Auto-generate disabled, waiting for user action');
        // Generate placeholders without counting towards limit
        randomEmojis = getRandomEmojis(emojiCount);
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
        // UNIFIED Limit Check (single source of truth!)
        const limitCheck = validateUserLimits($isLoggedIn, $accountTier, $dailyLimit?.used || 0);
        
        if (limitCheck.isReached) {
            console.log('⚠️ Daily limit reached:', limitCheck);
            isDisabled.set(true);
            showDailyLimitModal($translations?.emojiDisplay?.dailyLimitReachedMessage || 'Daily limit reached');
            return;
        }

        if ($isDisabled) {
            console.log('⚠️ Button is disabled, skipping generation');
            return;
        }
  
        randomEmojis = getRandomEmojis(emojiCount);
        window.focus();
        await handleSuccessfulGeneration(countTowardsLimit);
      } catch (error) {
        handleError('Random Generation Error', error);
      }
    }
  

    async function generateEmojis() {
      try {
        // UNIFIED Limit Check (same as generateRandomEmojis!)
        const limitCheck = validateUserLimits($isLoggedIn, $accountTier, $dailyLimit?.used || 0);
        
        if (limitCheck.isReached) {
            console.log('⚠️ Daily limit reached:', limitCheck);
            isDisabled.set(true);
            showDailyLimitModal($translations?.emojiDisplay?.dailyLimitReachedMessage || 'Daily limit reached');
            return;
        }

        if ($isDisabled) {
            console.log('⚠️ Button is disabled, skipping generation');
            return;
        }

        if (!storyInput.trim()) {
          showTextArea = true;
          return;
        }
  
        const response = await fetchEmojiStory();
        if (response?.length > 0) {
          await handleSuccessfulStoryGeneration(response);
        } else {
          showErrorMessage($translations?.emojiDisplay?.errorMessage || 'Generation failed');
        }
      } catch (error) {
        console.error('❌ Story generation failed:', error);
        
        // Better error messages based on error type
        let errorMessage = $translations?.emojiDisplay?.errorMessage || 'Story generation failed';
        
        if (error.message?.includes('API key')) {
          errorMessage = '🔑 API Key Error\n\nPlease check your API key in Settings.';
        } else if (error.message?.includes('quota') || error.message?.includes('429')) {
          errorMessage = '⚠️ API Quota Exceeded\n\nPlease wait a moment or check your billing.';
        } else if (error.message?.includes('timeout')) {
          errorMessage = '⏱️ Timeout\n\nThe AI took too long to respond. Please try again.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMessage = '🌐 Network Error\n\nPlease check your internet connection.';
        } else {
          errorMessage = `🤖 AI Error\n\n${error.message || 'Unknown error'}`;
        }
        
        showError(errorMessage, 5000);
      }
    }
  
    // Helper Functions
    async function handleSuccessfulGeneration(countTowardsLimit = true) {
      await copyToClipboard(randomEmojis.join(' '));
      showSuccessMessage($translations.emojiDisplay.successMessage);
      showTextArea = false;
      temporarilyDisableButton();
      
      // Only increment counter if this is a user-initiated action
      if (countTowardsLimit) {
        console.log('➕ Incrementing usage after successful generation');
        // Use new centralized daily usage tracking (API + localStorage)
        await incrementDailyUsage().catch(error => {
          console.error('❌ CRITICAL: Failed to increment daily usage:', error);
          // Still show error to user but don't block UX
        });
        console.log('📊 New daily limits after increment:', $dailyLimit);
      }
    }
  
    async function handleSuccessfulStoryGeneration(response) {
      randomEmojis = response;
      await copyToClipboard(randomEmojis.join(' '));
      
      // Get AI Model info for success message
      const userSettings = getCurrentUserSettings();
      const provider = userSettings?.storyMode?.provider || 'openai';
      const providerNames = {
        openai: 'OpenAI',
        gemini: 'Gemini',
        mistral: 'Mistral',
        claude: 'Claude',
        custom: 'Custom API'
      };
      
      const successMsg = `✅ ${$translations.emojiDisplay.successStoryMessage}\n\n🤖 Generated with ${providerNames[provider]}`;
      showSuccess(successMsg, 3000);
      
      shouldAnimateEmojis = true;
      // Keep textarea visible - user can edit and regenerate
      // showTextArea stays true for better UX
      
      // Use new centralized daily usage tracking (API + localStorage)
      await incrementDailyUsage().catch(error => {
        console.warn('⚠️ Failed to increment daily usage:', error);
      });
      
      console.log('✅ Story generation complete:', {
        emojis: response.join(' '),
        provider,
        count: response.length
      });
    }
  
    async function fetchEmojiStory() {
      try {
        // Get user settings for Story Mode
        const userSettings = getCurrentUserSettings();
        const storyMode = userSettings?.storyMode || {};
        
        const provider = storyMode.provider || 'openai';
        const apiKeys = storyMode.apiKeys || {};
        const apiKey = apiKeys[provider];
        
        // Validate API key
        if (!apiKey || apiKey.length < 10) {
          throw new Error('No valid API key configured. Please add one in settings.');
        }
        
        console.log('🤖 Generating story emojis:', { 
          provider, 
          hasKey: !!apiKey, 
          text: storyInput.substring(0, 30),
          count: emojiCount 
        });
        
        // Generate emojis using AI
        const config = {
          provider,
          apiKey,
          customApiUrl: storyMode.customApiUrl,
          customEndpoint: storyMode.customEndpoint,
          customFormat: storyMode.customFormat,
          customModel: storyMode.customModel,
          model: storyMode.model,
          maxTokens: storyMode.maxTokens,
          temperature: storyMode.temperature
        };
        
        const result = await generateStoryEmojis(
          storyInput, 
          emojiCount,
          config
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to generate story emojis');
        }
        
        console.log('✅ Story emojis generated:', result.emojis);
        
        // Track successful request
        successfulStoryRequests.update(requests => [
          ...requests,
          {
            emojiCount,
            text: storyInput,
            result: result.emojis,
            provider,
            timestamp: Date.now()
          }
        ]);
        
        return result.emojis;
        
      } catch (error) {
        console.error('❌ Story generation failed:', error);
        throw new Error(`Story generation failed: ${error.message}`);
      }
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
  
    // DEPRECATED: Old localStorage functions (kept for migration/fallback)
    // These are now handled by dailyUsageStore.js
    // TODO: Remove these functions in next release after migration period
    
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
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORY_INPUT_KEY);
        console.log('🧹 Story input cleared from localStorage');
      }
    }
  
    function toggleStoryMode() {
      // Only allow toggle if Story Mode is properly configured
      if (!storyModeEnabled || !storyModeConfigured) {
        console.warn('⚠️ Story Mode not available:', { enabled: storyModeEnabled, configured: storyModeConfigured });
        showWarning(
          $translations?.emojiDisplay?.storyModeConfigureWarning || 
          'Please configure Story Mode API key in settings first', 
          3000
        );
        return;
      }
      
      // Check daily usage limit
      const remaining = $dailyLimit.limit - $dailyLimit.used;
      if (remaining <= 0) {
        console.warn('⚠️ Daily limit reached');
        showDailyLimitModal(
          $translations?.emojiDisplay?.dailyLimitReachedMessage || 
          'Daily limit reached'
        );
        return;
      }
      
      isStoryMode = !isStoryMode;
      if (isStoryMode) {
        showTextArea = true;
        console.log('✨ Story Mode activated');
      } else {
        console.log('🎲 Story Mode deactivated');
      }
    }
</script>
  
<div id="emoji-password-generator" class="flex flex-col space-t-6 rounded-xl relative w-full">
    <!-- Emoji Display Section -->
    <button 
      id="emoji-display" 
      tabindex="0" 
      class="core-button text-white bg-black border-gray-400 px-3 mb-2 md:pt-1 md:pb-1 pb-1 transform -translate-y-2.5 transition-all hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2" 
      on:click={generateRandomEmojis} 
      on:keydown={e => e.key === 'Enter' && generateRandomEmojis()} 
      aria-label={$translations.emojiDisplay.clickToCopy} 
      aria-live="polite"
      aria-pressed="false"
      title={$translations.emojiDisplay.clickToCopy}
    >
      <div class="mt-1 md:mt-0 flex gap-2 overflow-visible justify-center items-center">
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
          {#if i === 0 && !storyModeEnabled}
            <!-- Show "Coming soon" only if Story Mode is NOT enabled -->
            <p><u>Story Mode coming soon</u></p>
          {:else if i === 0 && storyModeEnabled && !storyModeConfigured}
            <!-- Show "Configure API" if enabled but no API key -->
            <p><u>Story Mode: Configure API Key in Settings</u></p>
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
        class="md:w-100 w-full mt-3 appearance-none rounded-full bg-gray-600 h-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={$isDisabled}
      />
      <span>{emojiCount}</span>
    </div>
  
    <!-- Story Input Section -->
    {#if showTextArea}
      <div class="relative w-full">
        <textarea 
          bind:value={storyInput} 
          placeholder={$translations.emojiDisplay.placeholderText} 
          class="appearance-none block w-full pr-12 text-gray-900 dark:text-white rounded-2xl py-3 px-4 leading-tight transition duration-300 ease-in-out bg-white dark:bg-aubergine-900 border border-gray-200 dark:border-gray-700 focus:border-yellow-400 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400/50 dark:focus:ring-yellow-500/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400 dark:placeholder-gray-500 resize-none" 
          on:keydown={handleTextareaKeydown} 
          minlength="40"
          disabled={$isDisabled}
          autocomplete="off"
          rows="4"
        />
        
        <!-- Clear Button (inside textarea, top-right) -->
        {#if storyInput && storyInput.length > 0}
          <button 
            type="button"
            aria-label={$translations.emojiDisplay.clearButton || 'Clear input'}
            on:click={clearInput} 
            class="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-yellow-500 active:bg-yellow-600 dark:hover:bg-aubergine-800 dark:active:bg-aubergine-700 focus:outline-none text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:text-black dark:active:text-white"
            disabled={$isDisabled}
            title={$translations.emojiDisplay.clearButton || 'Clear'}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
      
      <!-- AI Model Info Badge -->
      {@const userSettings = getCurrentUserSettings()}
      {@const currentProvider = userSettings?.storyMode?.provider || 'openai'}
      {@const currentModel = userSettings?.storyMode?.model || ''}
      {@const providerNames = {
        openai: 'OpenAI',
        gemini: 'Gemini',
        mistral: 'Mistral',
        claude: 'Claude',
        custom: 'Custom'
      }}
      {@const defaultModels = {
        openai: 'GPT-3.5',
        gemini: 'Gemini Pro',
        mistral: 'Tiny',
        claude: 'Haiku',
        custom: currentModel || 'Model'
      }}
      
      <div class="flex items-center justify-between py-3 px-4 bg-white dark:bg-aubergine-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-3 shadow-sm">
        <!-- Text links -->
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-700 dark:text-gray-300 font-semibold">AI Model</span>
        </div>
        
        <!-- LLM Info rechts -->
        <div class="flex items-center gap-1.5">
          <span class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-bold bg-yellow-500 text-black shadow-sm">
            🤖 {providerNames[currentProvider]}
          </span>
          <span class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-powder-500 text-black dark:bg-yellow-600 shadow-sm">
            {currentModel || defaultModels[currentProvider]}
          </span>
        </div>
      </div>
    {/if}
  
    <!-- Action Buttons -->
    <div 
      role="main"
      aria-label={$translations.emojiDisplay.emojiDisplayTitle} 
      class="flex space-x-4 mt-3 mb-2"
    >
      {#if isStoryMode}
        <!-- Story Mode Generate Button (gelb, aktiv) -->
        <button 
          aria-label={$translations.emojiDisplay.storyButtonClicked || 'Generate story emojis'}
          on:click={generateEmojis} 
          class="w-1/2 py-4 rounded-full bg-yellow-500 text-black border-2 border-yellow-500 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
          disabled={$isDisabled}
          title={$translations.emojiDisplay.storyButtonClicked}
        >
          {$translations.emojiDisplay.storyButtonClicked}
        </button>
        
        <!-- Back to Random Button: gedämpft mit gelbem Border -->
        <button
          aria-label={$translations.emojiDisplay.randomButton || 'Switch to random mode'}
          on:click={() => { isStoryMode = false; showTextArea = false; }} 
          class="w-1/2 py-4 rounded-full bg-gray-200 text-yellow-600 dark:bg-gray-800 dark:text-yellow-500 border-2 border-yellow-500 shadow-sm transition-all duration-300 ease-in-out transform hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-102 focus:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          disabled={$isDisabled}
          title={$translations.emojiDisplay.randomButton}
        >
          {$translations.emojiDisplay.randomButton}
        </button>
      {:else}
        <!-- Story Mode Toggle Button: gelb wenn in Settings aktiviert -->
        <button 
          aria-label={storyModeEnabled && storyModeConfigured 
            ? ($translations.emojiDisplay.storyButton || 'Story mode')
            : (!storyModeEnabled 
              ? 'Story mode - Enable in settings'
              : 'Story mode - Configure API key in settings')}
          on:click={storyModeEnabled && storyModeConfigured ? toggleStoryMode : null} 
          class="w-1/2 py-4 rounded-full transition-all duration-300 ease-in-out transform focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
            {storyModeEnabled && storyModeConfigured 
              ? 'bg-yellow-500 text-black border-2 border-yellow-500 shadow-md hover:scale-105 focus:scale-105 active:scale-95 cursor-pointer focus:ring-yellow-50' 
              : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-700 opacity-60 cursor-not-allowed focus:ring-gray-200'}"
          disabled={!storyModeEnabled || !storyModeConfigured || $isDisabled}
          title={storyModeEnabled && storyModeConfigured 
            ? ($translations.emojiDisplay.storyButton || 'Story mode')
            : (!storyModeEnabled 
              ? 'Enable Story Mode in settings'
              : 'Configure API key in settings')}
        >
          {#if storyModeEnabled && storyModeConfigured}
            {$translations.emojiDisplay.storyButton}
          {:else if !storyModeEnabled}
            🔒 Story Mode
          {:else}
            🔑 Story Mode
          {/if}
        </button>
        
        <!-- Random Button: gedämpft mit gelbem Border wenn Story aktiviert -->
        <button
          aria-label={$translations.emojiDisplay.randomButton || 'Generate random emojis'}
          on:click={() => generateRandomEmojis(true)} 
          on:keydown={handleKeyPress} 
          class="w-1/2 py-4 rounded-full transition-all duration-300 ease-in-out transform focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100
            {storyModeEnabled && storyModeConfigured
              ? 'bg-gray-200 text-yellow-600 dark:bg-gray-800 dark:text-yellow-500 border-2 border-yellow-500 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-102 focus:scale-102 active:scale-98 focus:ring-yellow-400'
              : 'bg-yellow-500 text-black border-2 border-yellow-500 shadow-md hover:scale-105 focus:scale-105 active:scale-95 focus:ring-yellow-50'}"
          disabled={$isDisabled}
          title={$translations.emojiDisplay.randomButton}
        >
          {$translations.emojiDisplay.randomButton}
        </button>
      {/if}
    </div>
</div>