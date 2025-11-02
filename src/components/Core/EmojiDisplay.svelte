<!-- src/EmojiDisplay.svelte (updated) -->
<script>
    import { fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import { navigate } from 'svelte-routing';
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
        showInfo,
        isModalVisible
    } from '../../stores/modalStore.js';
    import { translations, currentLanguage } from '../../stores/contentStore.js';
    import { getCurrentUserSettings, userSettings, effectiveSettings, updateSetting } from '../../stores/userSettingsStore.js';
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
  
    // Story Mode Loading State
    let isGeneratingStory = false;
  
    // Character Validation Constants (for Story Mode)
    const MAX_CHARS = 400;
    const MIN_CHARS = 10;
  
    // Reactive Character Validation
    $: currentLength = storyInput?.length || 0;
    $: remaining = MAX_CHARS - currentLength;
    $: isOverLimit = currentLength > MAX_CHARS;
    $: isUnderLimit = currentLength > 0 && currentLength < MIN_CHARS;
    $: isValidLength = currentLength >= MIN_CHARS && currentLength <= MAX_CHARS;
    $: canGenerate = isValidLength && storyInput.trim().length >= MIN_CHARS;
  
    // Temperature for Story Mode (0.0-2.0 range)
    let storyTemperature = 0.7; // Default
    let temperatureInitialized = false; // Prevent override after user adjustment
  
    // REACTIVE: Update Story Mode status when ANY store changes
    // Priority: effectiveSettings > userSettings > currentAccount
    $: {
        let storyModeSettings = null;
        
        // Try effectiveSettings first (most up-to-date)
        if ($effectiveSettings?.storyMode) {
            storyModeSettings = $effectiveSettings.storyMode;
        }
        // Fallback to userSettings
        else if ($userSettings?.storyMode) {
            storyModeSettings = $userSettings.storyMode;
        }
        // Fallback to currentAccount
        else if ($currentAccount?.metadata?.settings?.storyMode) {
            storyModeSettings = $currentAccount.metadata.settings.storyMode;
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
            
            // Update temperature from settings ONLY on first load
            if (!temperatureInitialized) {
                storyTemperature = storyModeSettings.temperature ?? 0.7;
                temperatureInitialized = true;
            }
        }
    }

    // REACTIVE: Display model for AI Model Chip
    $: {
        const settings = getCurrentUserSettings();
        const provider = settings?.storyMode?.provider || 'openai';
        const model = settings?.storyMode?.model || '';
        const customModel = settings?.storyMode?.customModel || '';
        const defaultModels = {
            openai: 'GPT-3.5',
            gemini: 'Gemini Pro',
            mistral: 'Tiny',
            claude: 'Haiku'
        };
        
        // For custom provider, use customModel; for others, use model or default
        if (provider === 'custom') {
            displayModel = customModel || 'Custom';
        } else {
            displayModel = model || defaultModels[provider] || 'Model';
        }
    }
    let displayModel = 'Model'; // Initialize with default

    // Timeout-Tracking für Memory Leak Prevention
    let activeTimeouts = new Set();
    let modalVisibilityUnsubscribe;

    const emojis = emojisData.emojis;
  
    // Constants
    const DISABLE_DURATION_MS = 3000;
    
    // Generate static emoji arrays for loading animation (no re-render glitches)
    function generateEmojiConfig(count) {
        return Array.from({ length: count }, () => {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const randomSize = Math.floor(Math.random() * 8) + 16;
            const randomOpacity = Math.random() * 0.2 + 0.4;
            const randomMargin = Math.floor(Math.random() * 80) + 150;
            return { emoji: randomEmoji, size: randomSize, opacity: randomOpacity, margin: randomMargin };
        });
    }
    
    function generateMiddleLaneEmojis(count) {
        // Choose random position for giant emoji (not always same position)
        const giantEmojiPosition = Math.floor(Math.random() * count);
        return Array.from({ length: count }, (_, i) => {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const isGiantEmoji = i === giantEmojiPosition;
            const randomSize = isGiantEmoji ? 60 : Math.floor(Math.random() * 12) + 20;
            const randomOpacity = isGiantEmoji ? 0.7 : Math.random() * 0.25 + 0.5;
            const randomMargin = isGiantEmoji ? 180 : Math.floor(Math.random() * 70) + 140;
            return { emoji: randomEmoji, size: randomSize, opacity: randomOpacity, margin: randomMargin };
        });
    }
    
    function generateSlowLaneEmojis(count) {
        return Array.from({ length: count }, () => {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const randomSize = Math.floor(Math.random() * 10) + 12;
            const randomOpacity = Math.random() * 0.15 + 0.35;
            const randomMargin = Math.floor(Math.random() * 70) + 120;
            return { emoji: randomEmoji, size: randomSize, opacity: randomOpacity, margin: randomMargin };
        });
    }
    
    // Generate static emoji configurations ONCE with more emojis for variety
    const loadingLane1 = generateEmojiConfig(4);
    const loadingLane2 = generateMiddleLaneEmojis(8); // More emojis for variety
    const loadingLane3 = generateSlowLaneEmojis(5);
    
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

      // If logged in and Story Mode is configured, default to Story Mode view
      if (!initialRenderComplete && $isLoggedIn && storyModeEnabled && storyModeConfigured) {
        console.log('🚀 Logged in user with Story Mode configured - defaulting to Story Mode');
        isStoryMode = true;
        showTextArea = true;
      } else if (!initialRenderComplete && autoGenerateEnabled) {
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
  

    async function generateEmojis(forceRegenerate = true) {
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
        
        // Validate character length
        if (!canGenerate) {
          console.warn('⚠️ Invalid text length:', { currentLength, MIN_CHARS, MAX_CHARS });
          showWarning(`Text must be between ${MIN_CHARS} and ${MAX_CHARS} characters`, 3000);
          return;
        }
  
        // Set loading state
        isGeneratingStory = true;
        console.log('🚀 [STORY MODE] Starting generation...', { forceRegenerate });
        
        const response = await fetchEmojiStory(forceRegenerate);
        
        if (response?.length > 0) {
          await handleSuccessfulStoryGeneration(response);
        } else {
          showErrorMessage($translations?.emojiDisplay?.errorMessage || 'Generation failed');
        }
      } catch (error) {
        console.error('❌ [STORY MODE] Generation failed:', error);
        
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
      } finally {
        // Always clear loading state
        isGeneratingStory = false;
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
      
      // CRITICAL: Respect User Settings (same as Random Mode!)
      const userSettings = getCurrentUserSettings();
      const copyToClipboardEnabled = userSettings?.copyToClipboard ?? true; // Default true
      const showSuccessMessages = userSettings?.showSuccessMessages ?? true; // Default true
      const provider = userSettings?.storyMode?.provider || 'openai';
      
      console.log('📋 [STORY MODE] User Settings applied:', {
        copyToClipboard: copyToClipboardEnabled,
        showSuccessMessages,
        provider,
        emojiCount: response.length
      });
      
      // Copy to clipboard if enabled
      if (copyToClipboardEnabled) {
        try {
          await copyToClipboard(randomEmojis.join(' '));
          console.log('📋 Story emojis copied to clipboard');
        } catch (clipboardError) {
          // Clipboard error already handled in copyToClipboard() - just log
          console.log('⏸️ Copy-to-clipboard failed:', clipboardError.message);
        }
      } else {
        console.log('⏸️ Copy-to-clipboard disabled in settings');
      }
      
      // Show success message if enabled
      if (showSuccessMessages) {
        const providerNames = {
          openai: 'OpenAI',
          gemini: 'Gemini',
          mistral: 'Mistral',
          claude: 'Claude',
          custom: 'Custom API'
        };
        
        const successMsg = `✅ ${$translations.emojiDisplay.successStoryMessage}\n\n🤖 Generated with ${providerNames[provider]}`;
        showSuccess(successMsg, 3000);
      }
      
      shouldAnimateEmojis = true;
      // Keep textarea visible - user can edit and regenerate
      // showTextArea stays true for better UX
      
      // Use new centralized daily usage tracking (API + localStorage)
      console.log('➕ [STORY MODE] Incrementing usage after successful generation');
      await incrementDailyUsage().catch(error => {
        console.warn('⚠️ Failed to increment daily usage:', error);
      });
      
      console.log('✅ [STORY MODE] Story generation complete:', {
        emojis: response.join(' '),
        provider,
        count: response.length,
        dailyUsed: $dailyLimit?.used,
        dailyLimit: $dailyLimit?.limit
      });
    }
  
    async function fetchEmojiStory(forceRegenerate = false) {
      try {
        // CRITICAL: Get FRESH user settings (no cache!)
        const userSettings = getCurrentUserSettings();
        
        console.log('🔍 [STORY MODE] Loading settings...', {
          hasSettings: !!userSettings,
          hasStoryMode: !!userSettings?.storyMode,
          settingsSource: 'getCurrentUserSettings()'
        });
        
        const storyMode = userSettings?.storyMode || {};
        
        const provider = storyMode.provider || 'openai';
        const apiKeys = storyMode.apiKeys || {};
        const apiKey = apiKeys[provider];
        
        console.log('🔑 [STORY MODE] API Key check:', {
          provider,
          hasApiKeys: !!apiKeys,
          apiKeysKeys: Object.keys(apiKeys),
          hasCurrentKey: !!apiKey,
          keyLength: apiKey?.length || 0,
          keyPreview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'NONE'
        });
        
        // Validate API key
        if (!apiKey || apiKey.length < 10) {
          throw new Error('No valid API key configured. Please add one in settings.');
        }
        
        console.log('🤖 [STORY MODE] Generating story emojis:', { 
          provider, 
          hasKey: true,
          keyLength: apiKey.length,
          text: storyInput.substring(0, 30),
          count: emojiCount,
          forceRegenerate
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
          temperature: storyTemperature, // Use UI slider value, not saved setting
          forceRegenerate // Pass force flag to bypass cache
        };
        
        const result = await generateStoryEmojis(
          storyInput, 
          emojiCount,
          config
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to generate story emojis');
        }
        
        console.log('✅ [STORY MODE] Story emojis generated:', {
          count: result.emojis.length,
          cached: result.cached,
          provider: result.provider
        });
        
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
    
    // Recent Emojis Management - Security: Mask middle emojis
    function saveToRecentEmojis(emojiString) {
      try {
        // Security: Mask middle emojis, only keep first and last
        // Format: first ✨✨✨ last (no spaces between)
        // Extract individual emojis using regex to handle multi-byte characters
        const emojis = emojiString.match(/[\p{Emoji}\u200d]+/gu) || [];
        let maskedString = emojiString;
        
        if (emojis.length >= 2) {
          const first = emojis[0];
          const last = emojis[emojis.length - 1];
          const middleCount = emojis.length - 2;
          const masked = '✨'.repeat(Math.max(0, middleCount));
          maskedString = `${first}${masked}${last}`;
        }
        
        const recent = storageHelpers.get(STORAGE_KEYS.RECENT_EMOJIS, []);
        
        // Remove if already exists (to move to front)
        const filtered = recent.filter(emoji => emoji !== maskedString);
        
        // Add to front, limit to 10 items
        const updated = [maskedString, ...filtered].slice(0, 10);
        
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
      if (event.key === "Enter" && canGenerate) {
        event.preventDefault(); // Prevent default newline
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
      }
    }
  
    // Temperature handler
    function handleTemperatureChange(event) {
      const newTemp = parseFloat(event.target.value);
      storyTemperature = newTemp;
      // Save to settings
      updateSetting('storyMode.temperature', newTemp);
    }
  
    // Get temperature label based on value
    function getTemperatureLabel(value) {
      if (value <= 0.5) return 'Precise';
      if (value <= 1.0) return 'Balanced';
      if (value <= 1.5) return 'Creative';
      return 'Chaotic';
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
        id="story-input"
          bind:value={storyInput} 
          placeholder={$translations.emojiDisplay.placeholderText} 
          class="appearance-none block w-full pr-12 pb-8 text-gray-900 dark:text-white rounded-2xl py-3 px-4 leading-tight transition duration-300 ease-in-out bg-white dark:bg-aubergine-900 border-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400 dark:placeholder-gray-500 resize-none
            {isOverLimit 
              ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400/50' 
              : isUnderLimit 
                ? 'border-orange-400 dark:border-orange-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50'
                : isValidLength
                  ? 'border-green-400 dark:border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/50'
                  : 'border-gray-200 dark:border-gray-700 focus:border-yellow-400 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400/50 dark:focus:ring-yellow-500/50'}" 
          on:keydown={handleTextareaKeydown}
          on:input={(e) => {
            // Enforce max length
            if (e.target.value.length > MAX_CHARS) {
              storyInput = e.target.value.slice(0, MAX_CHARS);
            }
          }}
          minlength={MIN_CHARS}
          maxlength={MAX_CHARS}
          disabled={$isDisabled || isGeneratingStory}
          autocomplete="off"
          rows="5"
          aria-describedby="char-counter"
          aria-busy={isGeneratingStory}
        />
        
        <!-- Loading Overlay für Story Generation (Fancy UX) -->
        {#if isGeneratingStory}
          <div class="absolute inset-0 rounded-2xl bg-creme-700 dark:bg-aubergine-900 backdrop-blur-2xl flex flex-col items-center justify-center z-20 pointer-events-none overflow-hidden">
            <!-- Colored background with backdrop blur -->
            <div class="absolute inset-0 rounded-2xl"></div>
            
            <!-- Animated Emoji lanes - Universe effect moving RIGHT to match body background -->
            <div class="absolute inset-0 flex flex-col justify-around z-10 py-6">
              <!-- Lane 1: Top - Fast, small emojis -->
              <div class="flex items-center relative h-8 overflow-hidden">
                <div class="flex animate-scroll-right-fast whitespace-nowrap">
                  {#each loadingLane1 as config}
                    <span 
                      class="inline-block" 
                      style="font-size: {config.size}px; opacity: {config.opacity}; margin-left: {config.margin}px;"
                    >{config.emoji}</span>
                  {/each}
                </div>
                <!-- Duplicate for seamless loop -->
                <div class="flex animate-scroll-right-fast whitespace-nowrap absolute right-full" style="animation-delay: -10s;">
                  {#each loadingLane1 as config}
                    <span 
                      class="inline-block" 
                      style="font-size: {config.size}px; opacity: {config.opacity}; margin-left: {config.margin}px;"
                    >{config.emoji}</span>
                  {/each}
                </div>
              </div>
              
              <!-- Lane 2: Middle - Medium, mix sizes with ONE huge emoji -->
              <div class="flex items-center relative h-8 overflow-hidden">
                <div class="flex animate-scroll-right whitespace-nowrap" style="animation-delay: -8s;">
                  {#each loadingLane2 as config}
                    <span 
                      class="inline-block" 
                      style="font-size: {config.size}px; opacity: {config.opacity}; margin-left: {config.margin}px;"
                    >{config.emoji}</span>
                  {/each}
                </div>
                <!-- Duplicate for seamless loop -->
                <div class="flex animate-scroll-right whitespace-nowrap absolute right-full" style="animation-delay: -23s;">
                  {#each loadingLane2 as config}
                    <span 
                      class="inline-block" 
                      style="font-size: {config.size}px; opacity: {config.opacity}; margin-left: {config.margin}px;"
                    >{config.emoji}</span>
                  {/each}
                </div>
              </div>
              
              <!-- Lane 3: Bottom - Slow, small emojis -->
              <div class="flex items-center relative h-8 overflow-hidden">
                <div class="flex animate-scroll-right-ultra-slow whitespace-nowrap" style="animation-delay: -15s;">
                  {#each loadingLane3 as config}
                    <span 
                      class="inline-block" 
                      style="font-size: {config.size}px; opacity: {config.opacity}; margin-left: {config.margin}px;"
                    >{config.emoji}</span>
                  {/each}
                </div>
                <!-- Duplicate for seamless loop -->
                <div class="flex animate-scroll-right-ultra-slow whitespace-nowrap absolute right-full" style="animation-delay: -45s;">
                  {#each loadingLane3 as config}
                    <span 
                      class="inline-block" 
                      style="font-size: {config.size}px; opacity: {config.opacity}; margin-left: {config.margin}px;"
                    >{config.emoji}</span>
                  {/each}
                </div>
              </div>
            </div>
            
            <!-- Loading Text - Above emojis -->
            <p class="relative text-lg font-medium text-gray-700 dark:text-gray-300 z-20">
              🤖 Creating your story emojis...
            </p>
          </div>
        {/if}
        
        <!-- Character Counter (inside textarea, bottom-left) -->
        <div 
          id="char-counter"
          class="absolute bottom-2 left-3 inline-flex items-center gap-1.5 py-1 rounded-md text-xs font-medium pointer-events-none transition-all duration-200
            {isOverLimit 
              ? ' text-red-700 dark:text-red-400' 
              : isUnderLimit 
                ? ' text-orange-700 dark:text-orange-400'
                : isValidLength
                  ? ' text-green-700 dark:text-green-400'
                  : ' text-gray-600 dark:text-gray-400'}"
          aria-live="polite"
        >
          {#if isOverLimit}
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{Math.abs(remaining)} over limit</span>
          {:else if isUnderLimit}
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{MIN_CHARS - currentLength} more needed</span>
          {:else if isValidLength}
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{remaining} / {MAX_CHARS}</span>
          {:else}
            <span>{currentLength} / {MAX_CHARS}</span>
          {/if}
        </div>
        
        <!-- Clear Button (inside textarea, top-right) -->
        {#if storyInput && storyInput.length > 0}
          <button 
            type="button"
            aria-label={$translations.emojiDisplay.clearButton || 'Clear input'}
            on:click={clearInput} 
            class="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-yellow-500 active:bg-yellow-600 dark:hover:bg-aubergine-800 dark:active:bg-aubergine-700 focus:outline-none text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:text-black dark:active:text-white z-10"
            disabled={$isDisabled}
            title={$translations.emojiDisplay.clearButton || 'Clear'}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
      
      <!-- Temperature Slider - Vor AI Model Chip -->
      <div class="flex items-center mt-3 mb-1 gap-2">
        <label for="storyTemperature" class="text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap w-20 shrink-0">
          {getTemperatureLabel(storyTemperature)}
        </label>
        <input 
          type="range" 
          id="storyTemperature" 
          min="0" 
          max="2" 
          step="0.1"
          bind:value={storyTemperature}
          on:input={handleTemperatureChange}
          class="flex-1 h-1.5 appearance-none rounded-full bg-gray-300 dark:bg-gray-600 transition-all hover:bg-yellow-400 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shrink" 
          style="--range-thumb-color: rgb(234, 179, 8);"
          disabled={isGeneratingStory}
          aria-label="Temperature: {getTemperatureLabel(storyTemperature)}"
          title="AI creativity level: {getTemperatureLabel(storyTemperature)}"
        />
        <span class="text-xs font-semibold text-yellow-600 dark:text-yellow-400 w-8 text-right tabular-nums shrink-0">
          {storyTemperature.toFixed(1)}
        </span>
      </div>
      
      <!-- AI Model Chip - Minimalistisch unter Text-Input rechts -->
      <div class="flex justify-end mt-2">
        <button
          on:click={() => {
            // Navigate to account page
            const lang = $currentLanguage || 'en';
            const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
            navigate(accountPath);
            
            // Open AI Settings Accordion and scroll to it
            setTimeout(() => {
              // Try to find the AI Settings accordion
              const aiAccordion = document.querySelector('[data-accordion="story"]');
              const accordionButton = document.querySelector('#accordion-story');
              
              if (aiAccordion) {
                // Check if accordion is closed, then click to open
                if (!aiAccordion.querySelector('.p-4')) {
                  accordionButton?.click();
                }
                
                // Scroll to accordion after opening
                setTimeout(() => {
                  aiAccordion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }
            }, 400);
          }}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 cursor-pointer"
          style="background-color: rgba(234, 179, 8, 0.15); color: rgb(234, 179, 8);"
          title="Click to change AI model in settings"
          aria-label="Current AI model: {displayModel}. Click to change in settings."
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{displayModel}</span>
        </button>
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
          aria-busy={isGeneratingStory}
          on:click={generateEmojis} 
          class="w-1/2 py-4 rounded-full bg-yellow-500 text-black border-2 border-yellow-500 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
          disabled={$isDisabled || !canGenerate || isGeneratingStory}
          title={!canGenerate 
            ? (isOverLimit 
              ? `Text too long (max ${MAX_CHARS} characters)` 
              : isUnderLimit 
                ? `Text too short (min ${MIN_CHARS} characters)` 
                : `Enter at least ${MIN_CHARS} characters`)
            : isGeneratingStory
              ? 'Generating...'
              : $translations.emojiDisplay.storyButtonClicked}
        >
          {#if isGeneratingStory}
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating...</span>
            </span>
          {:else}
            {$translations.emojiDisplay.storyButtonClicked}
          {/if}
        </button>
        
        <!-- Back to Random Button: gedämpft mit gelbem Border -->
        <button
          aria-label={$translations.emojiDisplay.randomButton || 'Switch to random mode'}
          on:click={() => { isStoryMode = false; showTextArea = false; }} 
          class="w-1/2 py-4 rounded-full bg-gray-200 text-yellow-600 dark:bg-gray-800 dark:text-yellow-500 border-2 border-yellow-500 shadow-sm transition-all duration-300 ease-in-out transform hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-102 focus:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          disabled={$isDisabled || isGeneratingStory}
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