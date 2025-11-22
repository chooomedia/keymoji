<!-- src/components/UserSettings.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { get } from 'svelte/store';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import { accountTier, currentAccount, darkMode } from 'stores/appStores'
    import { 
        userSettings, 
        pendingChanges, 
        hasUnsavedChanges, 
        settingsStatus,
        updateSetting, 
        saveAllSettings, 
        discardChanges,
        getEffectiveValue,
        getCurrentUserSettings,
        invalidateSettingsCache
    } from '../stores/userSettingsStore.js';
    import ModularInput from './UI/ModularInput.svelte';
    import Button from './UI/Button.svelte';
    import Modal from './UI/Modal.svelte';
    import { showSuccess, showError, showWarning, showModal } from '../stores/modalStore';
    import { testAIProvider, getProviderInfo } from '../utils/storyModeAI';

    // Load settings configuration
    let settingsConfig = {};
    let activeSection = 'basic';
    let showProModal = false;
    let proFeatureName = '';
    let proFeatureDescription = '';
    
    // UI State (which sections are expanded/collapsed)
    let uiState = {
        expandedSections: ['basic'] // Default: basic section open
    };

    // PRO Banner State (dismissable for 3 days)
    let showProBanner = true;
    const PRO_BANNER_KEY = 'keymoji_pro_banner_dismissed';
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    
    // API Test State
    let isTestingAPI = false;
    let showApiKey = false; // Toggle for showing/hiding API key
    let apiTestSuccess = false; // ✅ Test successful for current provider
    let testedProvider = null; // Track which provider was tested
    let settingsInitialized = false; // Track if settings are fully initialized
    
    // Local state for API key input to prevent reset during typing
    let localApiKeyValue = '';
    let isApiKeyFocused = false;

    // Check if user is pro - optimiert mit $: um zu viele Aufrufe zu vermeiden
    $: isProUser = $accountTier === 'pro';
    
    // Load verification status from settings (only if settings are initialized)
    function loadVerificationStatus() {
        // Guard: Don't load if settings aren't initialized yet
        if (!settingsInitialized) {
            console.log('⏸️ Skipping loadVerificationStatus - settings not yet initialized');
            return;
        }
        
        try {
            const currentSettings = getCurrentUserSettings();
            const storyMode = currentSettings?.storyMode || {};
            const verifiedProviders = storyMode.verifiedProviders || {};
            // Use currentProvider (reactive) as Single Source of Truth
            const provider = currentProvider || 'apertus';
            
            // Check if current provider is verified
            if (verifiedProviders[provider]?.success) {
                const verification = verifiedProviders[provider];
                apiTestSuccess = true;
                testedProvider = provider;
                console.log('✅ Verification status restored for provider:', provider, {
                    verifiedAt: verification.verifiedAt,
                    model: verification.model
                });
            } else {
                apiTestSuccess = false;
                testedProvider = null;
                console.log('ℹ️ No verification status found for provider:', provider);
            }
        } catch (error) {
            console.warn('⚠️ Error loading verification status:', error);
            // Don't throw - just reset to safe state
            apiTestSuccess = false;
            testedProvider = null;
        }
    }
    
    // REACTIVE: Reset test status when provider or API key changes (only after initialization)
    // Guard: Only run reactive block if settings are initialized
    // Use currentProvider (derived from activeProvider) as Single Source of Truth
    $: if (settingsInitialized) {
        const apiKeys = getEffectiveValue('storyMode.apiKeys') || {};
        const currentApiKey = apiKeys[currentProvider] || '';
        
        // Load verification status when provider changes
        if (currentProvider) {
            loadVerificationStatus();
        }
        
        // Reset if provider changed
        if (testedProvider && currentProvider !== testedProvider) {
            apiTestSuccess = false;
            testedProvider = null;
            console.log('🔄 Provider changed, resetting test status');
            // Reload verification status for new provider
            loadVerificationStatus();
        }
        
        // Reset if API key was modified after successful test
        if (apiTestSuccess && testedProvider === currentProvider) {
            // We can't easily detect if the key changed, so we assume it's still valid
            // The user must re-test if they change the key
            console.log('✅ Test status maintained for current provider:', currentProvider);
        }
    }
    
    // REACTIVE: Check if Story Mode is enabled and requires testing
    $: storyModeEnabled = getEffectiveValue('storyMode.enabled') || false;
    $: requiresAPITest = storyModeEnabled && !apiTestSuccess;
    
    // REACTIVE: Force re-evaluation when these stores change
    // BUT: Only for non-input fields to avoid focus loss during typing
    // ============================================
    // STORY MODE AI PROVIDER: Single Source of Truth
    // ============================================
    // Priority: pendingChanges > userSettings > default
    // CRITICAL: These reactive statements ensure immediate updates when stores change
    $: pendingProviderValue = $pendingChanges['storyMode.provider'];
    $: settingsProviderValue = $userSettings?.storyMode?.provider;
    $: currentStoryModeProvider = getEffectiveValue('storyMode.provider') || 'apertus';
    
    // Active provider: prioritize pendingChanges (user is changing), then saved settings, then default
    $: activeProvider = pendingProviderValue !== undefined 
        ? pendingProviderValue 
        : (settingsProviderValue !== undefined ? settingsProviderValue : currentStoryModeProvider);
    
    // Derive currentProvider for template use (always reactive, always has a value)
    $: currentProvider = activeProvider || 'apertus';
    
    // Reset UI state when provider changes
    let previousProvider = currentProvider;
    $: if (currentProvider !== previousProvider) {
        showApiKey = false;
        isApiKeyFocused = false;
        localApiKeyValue = '';
        if (testedProvider !== currentProvider) {
            apiTestSuccess = false;
            testedProvider = null;
        }
        previousProvider = currentProvider;
    }
    
    // NOTE: reactivityTrigger removed - using direct reactive statements instead
    // This prevents unnecessary re-renders that cause input resets

    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[$currentLanguage] || textObj?.en || fallback;
    }

    // Get effective value for a setting (includes pending changes) - ROBUST & REACTIVE
    function getCurrentValue(item) {
        const itemId = item.id;
        
        // CRITICAL: Always check pendingChanges FIRST - this is what user is currently typing!
        // Use get() instead of $ to avoid reactive re-renders during typing
        const pending = get(pendingChanges);
        const pendingValue = pending[itemId];
        
        // If there's a pending value, use it immediately (user is typing or just typed)
        if (pendingValue !== undefined && pendingValue !== null) {
            return pendingValue;
        }
        
        // Use getEffectiveValue from store (handles userSettings + tier defaults)
        let effectiveValue = getEffectiveValue(itemId);
        
        // Special handling for critical fields that sync with other stores
        
        // Name: Use get() instead of $ to avoid reactive re-renders during typing
        if (itemId === 'name') {
            // Priority 1: currentAccount store (after successful save) - Use get() not $!
            const account = get(currentAccount); // NOT REACTIVE - prevents re-render during typing!
            const accountName = account?.name || account?.profile?.name;
            if (accountName) {
                return accountName;
            }
            
            // Priority 2: userSettings - Use get() not $!
            const settings = get(userSettings); // NOT REACTIVE - prevents re-render during typing!
            const settingsName = settings?.name;
            if (settingsName) {
                return settingsName;
            }
            
            // Priority 3: Default value
            return item.defaultValue || '';
        }
        
        // Language: Always sync from currentLanguage store (source of truth)
        if (itemId === 'language') {
            const lang = get(currentLanguage);
            return lang || effectiveValue || item.defaultValue || 'en';
        }
        
        // Theme: Support "auto" + sync from storage
        if (itemId === 'theme') {
            // Check explicit storage first (supports "auto")
            const storedTheme = localStorage.getItem('keymoji_theme');
            if (storedTheme && ['auto', 'light', 'dark'].includes(storedTheme)) {
                return storedTheme;
            }
            
            // Then check effectiveValue
            if (effectiveValue) {
                return effectiveValue;
            }
            
            // Fallback: Derive from darkMode
            const isDark = get(darkMode);
            return isDark ? 'dark' : 'light';
        }
        
        // For all other fields: Use effectiveValue (handles tier-appropriate defaults)
        return effectiveValue !== undefined ? effectiveValue : item.defaultValue;
    }

    // Get available sections based on user tier
    $: availableSections = Object.values(settingsConfig.sections || {}).filter(section => {
        // Free users: basic, emoji, and story sections
        if (!isProUser) {
            return section.id === 'basic' || section.id === 'emoji' || section.id === 'story';
        }
        // Pro users: all sections
        return true;
    });

    // Debug logging for reactivity
    $: if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log('🔄 UserSettings: availableSections updated:', availableSections);
        console.log('🔄 UserSettings: isProUser:', isProUser);
        console.log('🔄 UserSettings: settingsConfig:', settingsConfig);
    }

    // Track if user is trying to leave the page
    let isLeavingPage = false;

    // Handle page leave attempts
    function handlePageLeaveAttempt() {
        if ($hasUnsavedChanges && !isLeavingPage) {
            isLeavingPage = true;
            handlePageLeave();
        }
    }

    async function loadSettingsConfig() {
        try {
            console.log('🔄 UserSettings: Loading settings config...');
            // Import the settings config directly instead of fetching
            const configModule = await import('../data/userSettings.json');
            settingsConfig = configModule.default;
            console.log('✅ UserSettings: Settings config loaded:', settingsConfig);
        } catch (error) {
            console.error('❌ UserSettings: Failed to load settings config:', error);
            // Fallback configuration
            settingsConfig = {
                sections: {
                    basic: {
                        id: 'basic',
                        icon: '⚙️',
                        title: { en: 'Basic Settings', de: 'Grundeinstellungen' },
                        description: { en: 'Language, theme, and notifications', de: 'Sprache, Theme und Benachrichtigungen' },
                        items: [
                            {
                                id: 'language',
                                type: 'select',
                                icon: '🌍',
                                title: { en: 'Language', de: 'Sprache' },
                                description: { en: 'Choose your preferred language', de: 'Wähle deine bevorzugte Sprache' },
                                options: [
                                    { value: 'en', label: { en: '🇺🇸 English', de: '🇺🇸 Englisch' } },
                                    { value: 'de', label: { en: '🇩🇪 German', de: '🇩🇪 Deutsch' } }
                                ],
                                defaultValue: 'en'
                            }
                        ]
                    }
                }
            };
        }
    }

    function handleSettingUpdate(key, value) {
        // CRITICAL: For provider changes, update immediately for reactivity
        if (key === 'storyMode.provider') {
            updateSetting(key, value);
            return; // Early return to avoid double update
        }
        
        // Special validation for Story Mode enabled toggle
        if (key === 'storyMode.enabled') {
            // CRITICAL: Use activeProvider (reactive) as Single Source of Truth
            const currentSettings = getCurrentUserSettings();
            const isApertus = currentProvider === 'apertus';
            
            // CRITICAL: Apertus uses VITE_N8N_APERTUS_TOKEN from environment, NOT apiKeys.apertus!
            // For other providers, check apiKeys
            let hasApiKey = false;
            if (!isApertus) {
                let apiKeys = getEffectiveValue('storyMode.apiKeys');
                if (!apiKeys || typeof apiKeys !== 'object' || Object.keys(apiKeys).length === 0) {
                    apiKeys = currentSettings?.storyMode?.apiKeys || {};
                }
                hasApiKey = apiKeys[currentProvider] && apiKeys[currentProvider].length >= 10;
            } else {
                // For Apertus: Check if VITE_N8N_APERTUS_TOKEN exists in environment
                const hasToken = typeof import.meta !== 'undefined' && 
                    import.meta.env?.VITE_N8N_APERTUS_TOKEN &&
                    import.meta.env.VITE_N8N_APERTUS_TOKEN.trim().length > 0;
                hasApiKey = hasToken; // Apertus is configured if token exists
                console.log('🔍 [Apertus] Token check:', {
                    hasToken,
                    tokenExists: !!import.meta?.env?.VITE_N8N_APERTUS_TOKEN,
                    tokenLength: import.meta?.env?.VITE_N8N_APERTUS_TOKEN?.length || 0
                });
            }
            
            console.log('✨ Story Mode toggle:', {
                newValue: value,
                currentProvider,
                isApertus,
                hasApiKey,
                apiKeyLength: !isApertus ? (currentSettings?.storyMode?.apiKeys?.[currentProvider]?.length || 0) : 'N/A (uses env token)',
                apiTestSuccess,
                testedProvider
            });
            
            if (value === true) {
                // Check if API key/token exists (skip for Apertus if token is in env)
                if (!hasApiKey) {
                    const errorMessage = isApertus
                        ? `⚠️ Bitte konfiguriere VITE_N8N_APERTUS_TOKEN in der .env Datei!\n\n` +
                          `Apertus verwendet einen n8n Token aus der Umgebungsvariable, nicht einen API-Key.`
                        : `⚠️ Bitte gib zuerst einen API-Key für ${currentProvider} ein!\n\n` +
                          `Du benötigst einen gültigen API-Key, um Story Mode zu nutzen.`;
                    showWarning(errorMessage, 5000);
                    console.error(`❌ Story Mode activation blocked: ${isApertus ? 'No n8n token' : 'No API key'}`);
                    return; // Don't update setting
                }
                
                // OPTIONAL: Warn if not tested, but allow activation
                if (!apiTestSuccess || testedProvider !== currentProvider) {
                    console.warn('⚠️ Story Mode aktiviert ohne API-Test');
                    showWarning(
                        `⚠️ Hinweis: API-Verbindung noch nicht getestet!\n\n` +
                        `Klicke auf "🧪 Test" um die Verbindung zu prüfen.\n\n` +
                        `Story Mode wird trotzdem aktiviert.`,
                        4000
                    );
                    // Continue and activate anyway
                }
                
                console.log('✅ Story Mode wird aktiviert');
            }
        }
        
        // Reset test status when API keys are modified
        // Use currentProvider (reactive) as Single Source of Truth
        if (key === 'storyMode.apiKeys') {
            const oldApiKeys = getEffectiveValue('storyMode.apiKeys') || {};
            const oldKey = oldApiKeys[currentProvider] || '';
            const newKey = (value[currentProvider] || '');
            
            // If key changed for current provider, reset test status
            if (oldKey !== newKey && apiTestSuccess && testedProvider === currentProvider) {
                apiTestSuccess = false;
                testedProvider = null;
                console.log('🔄 API Key modified, test status reset');
                
                // Show info notification
                if (newKey.length >= 10) {
                    showWarning(
                        `⚠️ API-Key geändert\n\n` +
                        `Bitte teste die neue Verbindung mit "🧪 Test".`,
                        3000
                    );
                }
            }
        }
        
        // Update the setting (skip if already updated above)
        if (key !== 'storyMode.provider') {
            updateSetting(key, value);
            console.log('✅ Setting updated in store:', { key, value });
        }
        
        // Apply some settings immediately for preview
        if (key === 'theme') {
            applyTheme(value);
        }
        if (key === 'language') {
            applyLanguage(value);
        }
        
        // Log final state for Story Mode
        if (key === 'storyMode.enabled') {
            const finalValue = getEffectiveValue('storyMode.enabled');
            console.log('✅ Story Mode final state:', { 
                requested: value, 
                stored: finalValue,
                match: value === finalValue 
            });
        }
    }

    function handleSaveSettings() {
        // Show save modal with loading state
        showModal('Do you want to save your changes?', 'info', {
            primaryButton: {
                text: 'Save Changes',
                action: async () => {
                    try {
                        // Set loading state
                        settingsStatus.update(status => ({ ...status, isSaving: true }));
                        
                        // Ensure uiState is saved before saving all settings
                        updateSetting('uiState', uiState);
                        
                        // Save settings (includes uiState)
                        await saveAllSettings();
                        
                        // Show success message
                        showSuccess('Settings saved successfully!', 3000);
                        
                        // Reset loading state
                        settingsStatus.update(status => ({ ...status, isSaving: false }));
                        
                        // Apply settings immediately after save
                        applySettingsImmediately();
                        
                        // Log saved UI state for debugging
                        console.log('💾 UI State saved:', uiState);
                        
                    } catch (error) {
                        // Show error message
                        showError('Failed to save settings: ' + error.message, 5000);
                        
                        // Reset loading state
                        settingsStatus.update(status => ({ ...status, isSaving: false }));
                    }
                }
            },
            secondaryButton: {
                text: 'Cancel',
                action: () => {
                    // Just close the modal
                }
            }
        });
    }
    
    // Apply settings immediately after save
    function applySettingsImmediately() {
        const settings = get(userSettings);
        
        // Apply theme changes
        if (settings.theme) {
            applyTheme(settings.theme);
        }
        
        // Apply language changes
        if (settings.language) {
            applyLanguage(settings.language);
        }
        
        // Apply other settings as needed
        console.log('✅ Settings applied immediately:', settings);
    }
    
    // Apply theme changes
    function applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            // Auto theme - use system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }
    
    // Apply language changes
    function applyLanguage(language) {
        // Update current language store
        currentLanguage.set(language);
        
        // Update document language
        document.documentElement.lang = language;
        
        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    }

    function handleDiscardChanges() {
        showModal('Are you sure you want to discard all changes?', 'warning', {
            primaryButton: {
                text: 'Discard Changes',
                action: () => {
                    discardChanges();
                    showWarning('Changes discarded', 2000);
                }
            },
            secondaryButton: {
                text: 'Cancel',
                action: () => {
                    // Just close the modal
                }
            }
        });
    }

    // Function for page leave confirmation
    function handlePageLeave() {
        if ($hasUnsavedChanges) {
            showModal('Do you want to save your changes?', 'info', {
                primaryButton: {
                    text: 'Save Changes',
                    action: async () => {
                        try {
                            // Set loading state
                            settingsStatus.update(status => ({ ...status, isSaving: true }));
                            
                            // Save settings
                            await saveAllSettings();
                            
                            // Show success message
                            showSuccess('Settings saved successfully!', 3000);
                            
                            // Reset loading state
                            settingsStatus.update(status => ({ ...status, isSaving: false }));
                            
                            // Allow page leave after save
                            window.history.back();
                            
                        } catch (error) {
                            // Show error message
                            showError('Failed to save settings: ' + error.message, 5000);
                            
                            // Reset loading state
                            settingsStatus.update(status => ({ ...status, isSaving: false }));
                        }
                    }
                },
                secondaryButton: {
                    text: 'Leave Without Saving',
                    action: () => {
                        // Allow page leave without saving
                        window.history.back();
                    }
                }
            });
            return false; // Prevent default navigation
        }
        return true; // Allow navigation
    }

    function handleProFeature(featureName, featureDescription) {
        proFeatureName = featureName;
        proFeatureDescription = featureDescription;
        showProModal = true;
        
        // Show pro feature modal using the enhanced Modal component
        showModal('Pro Feature', 'pro-feature', null, {
            featureName: featureName,
            featureDescription: featureDescription,
            onUpgrade: handleProModalUpgrade
        });
    }

    function handleProModalUpgrade() {
        // Handle upgrade action from modal
        showSuccess('Redirecting to Pro upgrade...', 3000);
        // Add your upgrade logic here
        showProModal = false;
    }

    // Handle upgrade action (from PRO banner button)
    function handleUpgrade() {
        // Show PRO feature modal with upgrade details
        handleProFeature(
            $translations?.accountManager?.proFeatureModal?.proUpgrade || 'Pro Upgrade',
            $translations?.accountManager?.proFeatureModal?.unlockAdvancedFeatures || 'Unlock all advanced features and settings'
        );
    }

    function toggleSection(sectionId) {
        const wasOpen = activeSection === sectionId;
        activeSection = wasOpen ? null : sectionId;
        
        // Update uiState for persistence
        if (!wasOpen) {
            // Section opened - add to expanded list
            if (!uiState.expandedSections.includes(sectionId)) {
                uiState.expandedSections = [...uiState.expandedSections, sectionId];
            }
        } else {
            // Section closed - remove from expanded list
            uiState.expandedSections = uiState.expandedSections.filter(id => id !== sectionId);
            // If we closed the active section, set activeSection to first remaining expanded section or null
            if (uiState.expandedSections.length > 0) {
                activeSection = uiState.expandedSections[0];
            } else {
                activeSection = null;
            }
        }
        
        console.log('🎨 UI State updated:', uiState, 'activeSection:', activeSection);
        
        // Mark as pending change (will be saved with "Save Settings" button)
        updateSetting('uiState', uiState);
    }

    // Check if PRO banner was dismissed recently (< 3 days)
    function checkProBannerDismissed() {
        try {
            const dismissed = localStorage.getItem(PRO_BANNER_KEY);
            if (dismissed) {
                const dismissedData = JSON.parse(dismissed);
                const now = Date.now();
                const timeSinceDismiss = now - dismissedData.dismissedAt;
                
                if (timeSinceDismiss < THREE_DAYS_MS) {
                    console.log('🚫 PRO banner dismissed:', {
                        daysAgo: Math.floor(timeSinceDismiss / (24 * 60 * 60 * 1000)),
                        remainingDays: Math.ceil((THREE_DAYS_MS - timeSinceDismiss) / (24 * 60 * 60 * 1000))
                    });
                    return true; // Still dismissed
                } else {
                    console.log('✅ PRO banner: 3 days passed, showing again');
                    localStorage.removeItem(PRO_BANNER_KEY);
                    return false; // Show again
                }
            }
            return false; // Not dismissed yet
        } catch (error) {
            console.warn('⚠️ Error checking PRO banner state:', error);
            return false; // Show by default
        }
    }

    // Dismiss PRO banner (for 3 days)
    function dismissProBanner() {
        try {
            const dismissData = {
                dismissed: true,
                dismissedAt: Date.now()
            };
            localStorage.setItem(PRO_BANNER_KEY, JSON.stringify(dismissData));
            showProBanner = false;
            console.log('✅ PRO banner dismissed for 3 days');
        } catch (error) {
            console.error('❌ Failed to dismiss PRO banner:', error);
        }
    }

    // Reset PRO banner (force show again) - called from Header badge
    export function resetProBanner() {
        try {
            localStorage.removeItem(PRO_BANNER_KEY);
            showProBanner = true;
            console.log('🔄 PRO banner reset and shown again');
        } catch (error) {
            console.error('❌ Failed to reset PRO banner:', error);
        }
    }
    
    /**
     * Test API Connection with Retry Logic
     * Tests if the configured API key and provider work correctly
     * Implements silent retry mechanism: 3 attempts per button click
     * - Silent testing: No modals during retries (only console logs for devs)
     * - User-friendly: Short error message only after all 3 attempts fail
     * - Dev-friendly: Detailed logs in console for debugging
     * 
     * Best Practices:
     * - Exponential backoff between retries
     * - Silent failures during retries (no UI disruption)
     * - Clear separation between dev logs and user messages
     */
    async function testAPIConnection() {
        isTestingAPI = true;
        
        // Get current Story Mode settings (OUTSIDE try block for error handler access)
        // CRITICAL: Use currentProvider (reactive) as Single Source of Truth
        const currentSettings = getCurrentUserSettings();
        const provider = currentProvider || 'apertus';
        
        // CRITICAL: Try multiple sources for apiKeys
        let apiKeys = getEffectiveValue('storyMode.apiKeys');
        if (!apiKeys || typeof apiKeys !== 'object' || Object.keys(apiKeys).length === 0) {
            // Fallback to currentSettings
            apiKeys = currentSettings?.storyMode?.apiKeys || {};
            console.warn('⚠️ [TEST] apiKeys not found in getEffectiveValue, using currentSettings:', {
                hasApiKeys: !!apiKeys,
                apiKeysKeys: Object.keys(apiKeys),
                provider
            });
        }
        
        const apiKey = apiKeys[provider];
        const customApiUrl = getEffectiveValue('storyMode.customApiUrl') || currentSettings?.storyMode?.customApiUrl;
        const customEndpoint = getEffectiveValue('storyMode.customEndpoint') || currentSettings?.storyMode?.customEndpoint;
        const customFormat = getEffectiveValue('storyMode.customFormat') || currentSettings?.storyMode?.customFormat;
        const customModel = getEffectiveValue('storyMode.customModel') || currentSettings?.storyMode?.customModel;
        const model = getEffectiveValue('storyMode.model') || currentSettings?.storyMode?.model;
        
        // CRITICAL: Enhanced debugging for API key detection
        console.log('🔍 [TEST] API Key Detection:', {
                provider, 
            hasApiKeys: !!apiKeys,
            apiKeysType: typeof apiKeys,
            apiKeysKeys: Object.keys(apiKeys || {}),
                hasApiKey: !!apiKey,
            apiKeyLength: apiKey?.length || 0,
            apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'none',
            currentSettingsHasStoryMode: !!currentSettings?.storyMode,
            currentSettingsHasApiKeys: !!currentSettings?.storyMode?.apiKeys
            });
            
            // Validate API key exists for current provider (skip for Apertus as it uses n8n token)
            // For other providers, require minimum length based on provider type
            if (provider !== 'apertus') {
                const providerInfo = getProviderInfo(provider);
                if (!providerInfo) {
                    console.error('❌ [TEST] Provider info not found for:', provider);
                    showWarning(`⚠️ Unbekannter Provider: ${provider}`, 3000);
                    isTestingAPI = false;
                    return;
                }
                
                const minKeyLength = providerInfo.apiKeyPrefix 
                    ? providerInfo.apiKeyPrefix.length + 10  // Prefix + minimum key length
                    : 10; // Default minimum
                
                if (!apiKey || apiKey.length < minKeyLength) {
                    console.error('❌ [TEST] API Key validation failed:', {
                        provider,
                        hasApiKey: !!apiKey,
                        apiKeyLength: apiKey?.length || 0,
                        minKeyLength,
                        apiKeyPrefix: providerInfo.apiKeyPrefix,
                        apiKeysObject: apiKeys,
                        allApiKeys: Object.keys(apiKeys || {}).map(k => ({ key: k, length: apiKeys[k]?.length || 0 }))
                    });
                    showWarning(`⚠️ Bitte gib zuerst einen gültigen API-Key für ${providerInfo.name} ein (mindestens ${minKeyLength} Zeichen)`, 3000);
                    isTestingAPI = false;
                    return;
                }
            }
            
            // For Apertus, use empty string as apiKey (n8n token is handled in callApertus)
            const effectiveApiKey = provider === 'apertus' ? '' : apiKey;
            
            // Build config for test
            const testConfig = {
                provider,
                apiKey: effectiveApiKey,
                customApiUrl,
                customEndpoint,
                customFormat,
                customModel,
                model
            };
            
        // Retry configuration
        const MAX_RETRIES = 3;
        const RETRY_DELAY_BASE = 500; // Base delay in ms (exponential backoff: 500ms, 1000ms, 2000ms)
        let lastError = null;
        let attempt = 0;
        
        // DEV: Log initial test attempt
        console.log('🧪 [TEST] Starting API connection test with retry logic:', {
            provider,
            hasApiKey: !!apiKey,
            customApiUrl,
            maxRetries: MAX_RETRIES,
            retryDelayBase: RETRY_DELAY_BASE
        });
        
        // Retry loop: Attempt up to MAX_RETRIES times
        for (attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                // DEV: Log attempt (silent for user)
                if (attempt > 1) {
                    console.log(`🔄 [TEST] Retry attempt ${attempt}/${MAX_RETRIES} (silent)`);
                } else {
                    console.log(`📤 [TEST] Attempt ${attempt}/${MAX_RETRIES}: Sending test request`, testConfig);
                }
            
            // Call test function
            const result = await testAIProvider(testConfig);
            
                // DEV: Log result (silent for user during retries)
                if (attempt > 1) {
                    console.log(`📥 [TEST] Retry ${attempt} result received (silent)`);
                } else {
                    console.log('📥 [TEST] Received test result:', result);
                }
            
            // Validate result: success must be true AND response must not be empty
            if (result.success) {
                // Additional validation: Check if response exists and is not empty
                if (!result.response || (typeof result.response === 'string' && result.response.trim().length === 0)) {
                    // Response is empty even though success is true - treat as error
                    throw new Error(
                        'API test returned success but empty response. The workflow executed successfully but the AI model returned no content. ' +
                        'Please check the n8n workflow "Format Response" node - it should extract the content from choices[0].message.content or the API response field.'
                    );
                }

                    // ✅ SUCCESS: Mark test as successful
                apiTestSuccess = true;
                testedProvider = provider;
                    
                    // DEV: Log success with attempt info
                    console.log(`✅ [TEST] API test successful on attempt ${attempt}/${MAX_RETRIES}, provider verified:`, provider);
                
                // Save verification status to settings (persistent storage)
                const currentSettings = getCurrentUserSettings();
                const storyMode = currentSettings?.storyMode || {};
                const verifiedProviders = storyMode.verifiedProviders || {};
                
                // Update verified providers with test result
                verifiedProviders[provider] = {
                    verifiedAt: new Date().toISOString(),
                    model: result.model || getEffectiveValue('storyMode.model') || '',
                    lastTest: new Date().toISOString(),
                        success: true,
                        attempts: attempt // Track how many attempts were needed
                };
                
                // Save to settings (will be persisted on next save)
                updateSetting('storyMode.verifiedProviders', verifiedProviders);
                    console.log('💾 [TEST] Verification status saved for provider:', provider, verifiedProviders[provider]);
                
                    // Show success message to user (only after successful test)
                const providerInfo = getProviderInfo(provider);
                const responsePreview = typeof result.response === 'string' 
                    ? result.response.substring(0, 50) 
                    : String(result.response || '').substring(0, 50);
                
                    // Show success message (only if not a retry, or show retry info)
                    const successMessage = attempt > 1
                        ? `✅ Verbindung erfolgreich (nach ${attempt} Versuchen)!\n\n` +
                    `Provider: ${providerInfo.name}\n` +
                    `Model: ${result.model || 'default'}\n` +
                          `Response: ${responsePreview}${responsePreview.length >= 50 ? '...' : ''}`
                        : `✅ Verbindung erfolgreich!\n\n` +
                          `Provider: ${providerInfo.name}\n` +
                          `Model: ${result.model || 'default'}\n` +
                          `Response: ${responsePreview}${responsePreview.length >= 50 ? '...' : ''}`;
                    
                    showSuccess(successMessage, 5000);
                    console.log('✅ [TEST] API test successful:', result);
                    
                    // Exit retry loop on success
                    isTestingAPI = false;
                    return;
            } else {
                    // ❌ Test returned failure
                throw new Error(result.error || 'Unknown error');
            }
            
        } catch (error) {
                // Store error for potential user message (only after all retries fail)
                lastError = error;
                
                // DEV: Log error attempt (silent for user during retries)
                console.error(`❌ [TEST] Attempt ${attempt}/${MAX_RETRIES} failed (silent):`, {
                    error: error.message,
                    errorStack: error.stack,
                    errorName: error.name,
                    provider,
                    attempt,
                    willRetry: attempt < MAX_RETRIES,
                    testConfig: {
                        provider: testConfig.provider,
                        hasApiKey: !!testConfig.apiKey,
                        apiKeyLength: testConfig.apiKey?.length || 0,
                        customApiUrl: testConfig.customApiUrl
                    }
                });
                
                // If this is not the last attempt, wait before retrying (exponential backoff)
                if (attempt < MAX_RETRIES) {
                    const retryDelay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms
                    console.log(`⏳ [TEST] Waiting ${retryDelay}ms before retry ${attempt + 1}/${MAX_RETRIES} (silent)`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
        }
        
        // ❌ ALL RETRIES FAILED: Show user-friendly error message
        // Mark test as failed
            apiTestSuccess = false;
            testedProvider = null;
            
        // DEV: Log final failure with all details
        console.error('❌ [TEST] All retry attempts failed:', {
            provider,
            totalAttempts: MAX_RETRIES,
            finalError: lastError?.message,
            errorStack: lastError?.stack,
            testConfig: {
                provider: testConfig.provider,
                hasApiKey: !!testConfig.apiKey,
                customApiUrl: testConfig.customApiUrl,
                customEndpoint: testConfig.customEndpoint
            }
        });
        
        // USER: Show short, user-friendly error message
        const errorMessage = lastError?.message || 'Unbekannter Fehler';
        
        // Create short error message for user (not as detailed as dev logs)
        let userErrorMessage = 'Verbindung fehlgeschlagen';
        let userHelpText = '';
        
        // Provide context-specific short help text
            if (errorMessage.includes('empty response') || errorMessage.includes('no content') || 
                errorMessage.includes('success but empty') || errorMessage.includes('returned empty')) {
            userErrorMessage = 'Leere Antwort vom API';
            userHelpText = '\n\n💡 Prüfe das n8n Workflow "Format Response" Node.';
            } else if (errorMessage.includes('CORS_ERROR')) {
            userErrorMessage = 'CORS-Fehler';
            userHelpText = '\n\n💡 CORS-Header in API-Server hinzufügen.';
        } else if (errorMessage.includes('NETWORK_ERROR')) {
            userErrorMessage = 'Netzwerkfehler';
            userHelpText = '\n\n💡 Prüfe API-URL und Internetverbindung.';
        } else if (errorMessage.includes('timeout')) {
            userErrorMessage = 'Zeitüberschreitung';
            userHelpText = '\n\n💡 API antwortet nicht. Prüfe Server-Status.';
        }
        
        // Show short error message to user (detailed logs are in console for devs)
            showError(
            `❌ ${userErrorMessage}${userHelpText}\n\n` +
            `(Details in Browser-Console für Entwickler)`,
            5000 // Shorter display time for user
            );
        
            isTestingAPI = false;
    }

    onMount(async () => {
        console.log('🔄 UserSettings: Component mounting...');
        await loadSettingsConfig();
        console.log('✅ UserSettings: Component mounted with config:', settingsConfig);

        // Check PRO banner dismissed state
        const isDismissed = checkProBannerDismissed();
        showProBanner = !isDismissed;

        // Initialize settings from account and API
        const { initializeSettingsForUser } = await import('../stores/userSettingsStore.js');
        await initializeSettingsForUser();
        console.log('✅ UserSettings: Settings initialized for user');
        
        // Mark settings as initialized BEFORE loading verification status
        settingsInitialized = true;
        
        // REMOVED: setTimeout delay - Race Condition behoben
        // Stores werden jetzt synchron aktualisiert, kein Delay nötig
        
        // Load and restore verification status from settings (now safe to call)
        loadVerificationStatus();
        
        // 🔄 MIGRATION: Old apiKey → new apiKeys structure
        const currentSettings = getCurrentUserSettings();
        const storyMode = currentSettings?.storyMode || {};
        const oldApiKey = storyMode.apiKey; // Old singular key
        const apiKeys = storyMode.apiKeys || {};
        const currentProvider = storyMode.provider || 'openai';
        
        // If old apiKey exists but not in new apiKeys structure, migrate it
        if (oldApiKey && oldApiKey.length > 10 && !apiKeys[currentProvider]) {
            console.log('🔄 Migrating old apiKey to new apiKeys structure...');
            const newApiKeys = {
                ...apiKeys,
                [currentProvider]: oldApiKey
            };
            
            // Update settings
            handleSettingUpdate('storyMode.apiKeys', newApiKeys);
            
            // Remove old apiKey field (no longer used)
            const updatedStoryMode = {
                ...storyMode,
                apiKeys: newApiKeys
            };
            delete updatedStoryMode.apiKey; // Remove old field
            
            // Save immediately
            await saveAllSettings();
            console.log('✅ Migration complete! Old apiKey moved to apiKeys[' + currentProvider + ']');
        }
        
        // Load UI state from userSettings
        const loadedUiState = getEffectiveValue('uiState');
        if (loadedUiState && loadedUiState.expandedSections) {
            uiState = loadedUiState;
            // Restore all expanded sections - set activeSection to first expanded section
            if (uiState.expandedSections.length > 0) {
                activeSection = uiState.expandedSections[0];
            }
            console.log('✅ UI State loaded from settings:', uiState, 'activeSection:', activeSection);
        } else {
            // Default: basic section open
            uiState = { expandedSections: ['basic'] };
            activeSection = 'basic';
            console.log('ℹ️ Using default UI state (basic section open)');
        }

        // Add beforeunload event listener for page leave confirmation
        const handleBeforeUnload = (event) => {
            if ($hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = '';
                handlePageLeaveAttempt();
                return '';
            }
        };

        // Add keyboard shortcut for saving (Ctrl+S)
        const handleKeydown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                if ($hasUnsavedChanges) {
                    handleSaveSettings();
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('keydown', handleKeydown);

        // Cleanup on component destroy
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<div class="user-settings">
    <!-- Header -->
    <p class="sr-only">
        {getLocalizedText($translations?.userSettings?.title, 'User Settings')}
    </p>

    <!-- Account Tier Info (Dismissable for FREE users) -->
    {#if !isProUser && showProBanner}
        <div 
            class="mb-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            transition:slide="{{ duration: 300 }}"
        >
            <div class="relative p-4">
                <!-- Close Button (X) -->
                <button
                    on:click={dismissProBanner}
                    class="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-all focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                    aria-label="Dismiss upgrade banner for 3 days"
                    title="Hide for 3 days"
                >
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="flex items-start flex-col justify-center space-y-3 pr-8">
                    <div class="flex items-start space-x-3">
                        <span class="text-2xl">🆓</span>
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                {$translations?.accountManager?.tiers?.freeAccount || 'Kostenloser Account'}
                            </h2>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {$translations?.accountManager?.upgrade?.upgradeToProForFeatures || 'Upgrade auf Pro für erweiterte Features'}
                            </p>
                        </div>
                    </div>
                    <button
                        on:click={handleUpgrade}
                        class="w-full inline-flex justify-center items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-800 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                        aria-label="{$translations?.accountManager?.upgrade?.upgradeProNow || '💎 Jetzt Pro upgraden'}"
                        title="{$translations?.accountManager?.upgrade?.upgradeProNow || '💎 Jetzt Pro upgraden'}"
                    >
                        {$translations?.accountManager?.upgrade?.upgradeProNow || '💎 Jetzt Pro upgraden'}
                    </button>
                </div>
            </div>
        </div>
    {:else if isProUser}
        <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-4">
                <div class="flex items-start space-x-3">
                    <span class="text-2xl">💎</span>
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Pro Account
                        </h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            You have access to all features
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Settings Sections -->
    <div class="space-y-4">
        {#each availableSections as section}
            <div 
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                data-accordion="{section.id}"
            >
                <!-- Section Header -->
                <button
                    on:click={() => toggleSection(section.id)}
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-all focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                    aria-label="{getLocalizedText(section.title)} - {activeSection === section.id ? 'Collapse' : 'Expand'}"
                    id="accordion-{section.id}"
                >
                    <div class="flex items-center space-x-3">
                        <span class="text-xl">{section.icon}</span>
                        <div class="text-left">
                            <div class="flex items-center space-x-2">
                                <h3 class="font-semibold text-gray-900 dark:text-white">
                                    {getLocalizedText(section.title)}
                                </h3>
                                {#if !isProUser && (section.id === 'security' || section.id === 'generation' || section.id === 'privacy' || section.id === 'pro')}
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        {$translations?.accountManager?.tiers?.proAccount || '💎 Pro'}
                                    </span>
                                {/if}
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {getLocalizedText(section.description)}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        {#if !isProUser && (section.id === 'security' || section.id === 'generation' || section.id === 'privacy' || section.id === 'pro')}
                            <button
                                on:click|stopPropagation={() => handleProFeature(getLocalizedText(section.title), getLocalizedText(section.description))}
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 focus:bg-purple-200 dark:focus:bg-purple-800 active:bg-purple-300 dark:active:bg-purple-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-purple-300 focus:ring-offset-1"
                                aria-label="Upgrade to unlock {getLocalizedText(section.title)}"
                                title="Upgrade to Pro"
                            >
                                Upgrade
                            </button>
                        {/if}
                        <svg 
                            class="w-5 h-5 text-gray-400 transition-transform duration-200 ease-out {activeSection === section.id ? 'transform rotate-180' : ''}" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </button>

                <!-- Section Content -->
                {#if activeSection === section.id}
                    <div class="p-4" transition:slide={{ duration: 300 }}>
                        <!-- Regular Items -->
                        {#each section.items as item (item.id)}
                            <div class="mb-4 last:mb-0">
                                <!-- Special handling for Story Mode Enabled Toggle -->
                                {#if item.id === 'storyMode.enabled'}
                                    <ModularInput
                                        config={{
                                            type: item.type,
                                            id: item.id,
                                            icon: item.icon,
                                            label: item.title,
                                            description: item.description,
                                            placeholder: item.placeholder,
                                            value: getCurrentValue(item),
                                            options: item.options?.map(opt => ({
                                                value: opt.value,
                                                label: opt.label
                                            })) || [],
                                            min: item.min,
                                            max: item.max,
                                            labels: item.labels,
                                            defaultValue: item.defaultValue,
                                            class: 'contact-input'
                                        }}
                                        currentLanguage={$currentLanguage}
                                        currentValue={getCurrentValue(item)}
                                        onValueChange={(value) => handleSettingUpdate(item.id, value)}
                                    />
                                <!-- Story Mode AI Provider: Complete Configuration -->
                                {:else if item.id === 'storyMode.provider'}
                                    <div class="space-y-4">
                                        <!-- Provider Dropdown -->
                                        <ModularInput
                                            config={{
                                                type: item.type,
                                                id: item.id,
                                                icon: item.icon,
                                                label: item.title,
                                                description: item.description,
                                                placeholder: item.placeholder,
                                                value: currentProvider,
                                                options: item.options?.map(opt => ({
                                                    value: opt.value,
                                                    label: opt.label
                                                })) || [],
                                                min: item.min,
                                                max: item.max,
                                                labels: item.labels,
                                                defaultValue: item.defaultValue,
                                                class: 'contact-input'
                                            }}
                                            currentLanguage={$currentLanguage}
                                            currentValue={currentProvider}
                                            onValueChange={(value) => handleSettingUpdate(item.id, value)}
                                        />
                                        
                                        <!-- API Key Configuration (Reactive based on Provider) -->
                                        {#key currentProvider}
                                            {#if currentProvider}
                                                {@const apiKeysItem = section.items.find(i => i.id === 'storyMode.apiKeys')}
                                                {#if apiKeysItem}
                                                    <!-- API Key Data (Reactive) -->
                                                    {@const apiKeys = getCurrentValue({ id: 'storyMode.apiKeys' }) || {}}
                                                    {@const currentApiKeyFromStore = (apiKeys && typeof apiKeys === 'object' ? apiKeys[currentProvider] : '') || ''}
                                                    {@const currentApiKey = isApiKeyFocused ? localApiKeyValue : currentApiKeyFromStore}
                                                    {@const hasValidKey = currentApiKey && currentApiKey.length >= 10}
                                                    {@const hasAnyKey = currentApiKey && currentApiKey.length > 0}
                                                    {@const savedProviders = Object.entries(apiKeys).filter(([provider, key]) => provider !== currentProvider && key && key.length >= 10).map(([provider]) => provider)}
                                                    {@const isApertus = currentProvider === 'apertus'}
                                                    {@const isCustom = currentProvider === 'custom'}
                                                    {@const providerInfo = getProviderInfo(currentProvider)}
                                                    {@const providerPlaceholders = {
                                                        apertus: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                                        openai: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                                        gemini: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                                        claude: 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                                        mistral: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                                                        custom: 'Enter your API key...'
                                                    }}
                                                    {@const currentPlaceholder = providerPlaceholders[currentProvider] || getLocalizedText(apiKeysItem.placeholder) || 'Enter your API key...'}
                                                    {@const isTestSuccessful = apiTestSuccess && testedProvider === currentProvider}
                                                        
                                                    <!-- API Key Configuration Card -->
                                                    <div class="space-y-3 bg-powder-100 dark:bg-aubergine-950 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                                        <!-- Label -->
                                                        <div class="flex items-center space-x-2">
                                                            {#if apiKeysItem.icon}
                                                                <span class="text-lg">{apiKeysItem.icon}</span>
                                                            {/if}
                                                            <label for="storyMode.apiKeys" class="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {getLocalizedText(apiKeysItem.title)}
                                                                <span class="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                                                    ({currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)})
                                                                </span>
                                                            </label>
                                                        </div>
                                                            
                                                        <!-- Input Container -->
                                                        <div class="relative">
                                                            {#if isApertus}
                                                                <!-- Apertus: Disabled (uses environment token) -->
                                                                <input
                                                                    id="storyMode.apiKeys"
                                                                    type="password"
                                                                    value={currentPlaceholder}
                                                                    disabled
                                                                    readonly
                                                                    placeholder={currentPlaceholder}
                                                                    class="w-full p-4 pr-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 cursor-not-allowed opacity-60"
                                                                    aria-label={getLocalizedText(apiKeysItem.title)}
                                                                    aria-describedby="apertus-token-info"
                                                                />
                                                            {:else}
                                                                <!-- Other Providers: Editable -->
                                                                <input
                                                                    id="storyMode.apiKeys"
                                                                    type={showApiKey ? 'text' : 'password'}
                                                                    value={currentApiKey || ''}
                                                                    on:input={(e) => {
                                                                        localApiKeyValue = e.target.value;
                                                                        const newApiKeys = { ...apiKeys, [currentProvider]: e.target.value };
                                                                        handleSettingUpdate('storyMode.apiKeys', newApiKeys);
                                                                    }}
                                                                    on:focus={() => {
                                                                        isApiKeyFocused = true;
                                                                        const apiKeys = getCurrentValue({ id: 'storyMode.apiKeys' }) || {};
                                                                        const keyFromStore = (apiKeys && typeof apiKeys === 'object' ? apiKeys[currentProvider] : '') || '';
                                                                        localApiKeyValue = keyFromStore;
                                                                    }}
                                                                    on:blur={() => {
                                                                        isApiKeyFocused = false;
                                                                        localApiKeyValue = currentApiKeyFromStore || '';
                                                                    }}
                                                                    placeholder={currentPlaceholder}
                                                                    class="w-full p-4 {hasValidKey ? 'pr-32' : hasAnyKey ? 'pr-14' : 'pr-4'} bg-white dark:bg-aubergine-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400/50 dark:focus:ring-yellow-500/50 placeholder-gray-400 dark:placeholder-gray-500"
                                                                    aria-label={getLocalizedText(apiKeysItem.title)}
                                                                />
                                                            {/if}
                                                            
                                                            <!-- Gradient Overlay (for long keys) -->
                                                            {#if !isApertus && hasAnyKey}
                                                                <div 
                                                                    class="absolute {hasValidKey ? 'right-[7.25rem]' : 'right-[3.25rem]'} inset-y-[1px] {hasValidKey ? 'w-32' : 'w-20'} z-5 pointer-events-none rounded-r-[11px]"
                                                                    style="background: linear-gradient(to right, 
                                                                        transparent 0%, 
                                                                        {$darkMode ? 'rgba(14, 30, 48, 0.6)' : 'rgba(255, 255, 255, 0.6)'} 25%,
                                                                        {$darkMode ? 'rgba(14, 30, 48, 0.95)' : 'rgba(255, 255, 255, 0.95)'} 60%,
                                                                        {$darkMode ? '#0e1e30' : '#ffffff'} 100%);"
                                                                    aria-hidden="true"
                                                                ></div>
                                                            {/if}
                                                            
                                                            <!-- Action Buttons -->
                                                            <div class="absolute right-2 inset-y-0 flex items-center gap-1 z-10">
                                                                {#if !isApertus && hasAnyKey}
                                                                    <button
                                                                        type="button"
                                                                        on:click={() => showApiKey = !showApiKey}
                                                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-yellow-500 active:bg-yellow-600 dark:hover:bg-aubergine-800 dark:active:bg-aubergine-700 focus:outline-none text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                                                                        aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                                                                        title={showApiKey ? 'Hide' : 'Show'}
                                                                    >
                                                                        {#if showApiKey}
                                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                            </svg>
                                                                        {:else}
                                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        {/if}
                                                                    </button>
                                                                {/if}
                                                                
                                                                <!-- Test Button -->
                                                                <button
                                                                    type="button"
                                                                    disabled={isTestingAPI}
                                                                    on:click={testAPIConnection}
                                                                    class="inline-flex items-center justify-center gap-1 px-2.5 h-8 text-xs font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed
                                                                        {isTestSuccessful
                                                                            ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                                                                            : 'hover:bg-yellow-500 active:bg-yellow-600 dark:hover:bg-aubergine-800 dark:active:bg-aubergine-700 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'}"
                                                                    aria-label={isTestingAPI ? 'Testing API connection' : isTestSuccessful ? 'API connection verified' : 'Test API connection'}
                                                                    title={isTestingAPI ? 'Testing...' : isTestSuccessful ? 'API connection verified ✅' : 'Test'}
                                                                >
                                                                    {#if isTestingAPI}
                                                                        <svg class="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                    {:else if isTestSuccessful}
                                                                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                                        </svg>
                                                                    {:else}
                                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                        </svg>
                                                                    {/if}
                                                                    <span class="hidden sm:inline">{isTestSuccessful ? 'Verified' : 'Test'}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        
                                                        <!-- Provider Info & Documentation -->
                                                        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                                                            {#if isApertus}
                                                                <p id="apertus-token-info" class="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                                                    {$translations?.accountManager?.apertusInfo || 'Exclusive on Keymoji: Apertus – the Swiss LLM. First time available for users. Hosted on HuggingFace, delivered via n8n workflow.'}
                                                                </p>
                                                                <div class="flex flex-wrap items-center gap-3 mt-2">
                                                                    <a href="https://huggingface.co/swiss-ai/Apertus-8B-Instruct-2509" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                                                        <span>{$translations?.accountManager?.apertusHuggingFaceLink || 'Apertus-8B auf HuggingFace'}</span>
                                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                        </svg>
                                                                    </a>
                                                                    <a href="http://matt-interfaces.ch/n8n" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                                                        <span>n8n Workflow Tool</span>
                                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            {:else if providerInfo}
                                                                <p class="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                                    {#if currentProvider === 'openai'}
                                                                        {$translations?.accountManager?.openaiHint || 'OpenAI API Key: Create an API key in your OpenAI account. Paid service, but very powerful.'}
                                                                    {:else if currentProvider === 'gemini'}
                                                                        {$translations?.accountManager?.geminiHint || 'Google Gemini API Key: Create an API key in Google AI Studio. Free for moderate usage.'}
                                                                    {:else if currentProvider === 'claude'}
                                                                        {$translations?.accountManager?.claudeHint || 'Anthropic Claude API Key: Create an API key in your Anthropic account. High-quality responses with focus on security.'}
                                                                    {:else if currentProvider === 'mistral'}
                                                                        {$translations?.accountManager?.mistralHint || 'Mistral AI API Key: Create an API key in your Mistral account. European provider with good prices.'}
                                                                    {:else if currentProvider === 'custom'}
                                                                        {$translations?.accountManager?.customHint || 'Custom API: Configure your own API endpoint. Supports OpenAI-compatible APIs.'}
                                                                    {:else}
                                                                        {getLocalizedText(apiKeysItem.description)}
                                                                    {/if}
                                                                </p>
                                                                {#if providerInfo.docsUrl}
                                                                    <p class="mt-1">
                                                                        <a href={providerInfo.docsUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                                                            <span>{providerInfo.name} Documentation</span>
                                                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                            </svg>
                                                                        </a>
                                                                    </p>
                                                                {/if}
                                                            {/if}
                                                            
                                                            {#if !isApertus && savedProviders.length > 0}
                                                                <p class="text-green-600 dark:text-green-400 inline-flex items-center gap-1 mt-1">
                                                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                                    </svg>
                                                                    Saved keys for: {savedProviders.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                                                                </p>
                                                            {/if}
                                                        </div>
                                                        
                                                        <!-- Custom API Fields (only when custom provider selected) -->
                                                        {#if isCustom && section.proItems}
                                                            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                                                {#each section.proItems as customItem (customItem.id)}
                                                                    {#if customItem.id?.startsWith('storyMode.custom')}
                                                                        <ModularInput
                                                                            config={{
                                                                                type: customItem.type,
                                                                                id: customItem.id,
                                                                                icon: customItem.icon,
                                                                                label: customItem.title,
                                                                                description: customItem.description,
                                                                                placeholder: customItem.placeholder,
                                                                                value: getCurrentValue(customItem),
                                                                                options: customItem.options?.map(opt => ({
                                                                                    value: opt.value,
                                                                                    label: opt.label
                                                                                })) || [],
                                                                                min: customItem.min,
                                                                                max: customItem.max,
                                                                                labels: customItem.labels,
                                                                                defaultValue: customItem.defaultValue,
                                                                                class: 'contact-input'
                                                                            }}
                                                                            currentLanguage={$currentLanguage}
                                                                            currentValue={getCurrentValue(customItem)}
                                                                            onValueChange={(value) => handleSettingUpdate(customItem.id, value)}
                                                                        />
                                                                    {/if}
                                                                {/each}
                                                            </div>
                                                        {/if}
                                                    </div>
                                                {/if}
                                            {/if}
                                        {/key}
                                    </div>
                                    
                                {:else if item.id === 'storyMode.apiKeys'}
                                    <!-- API Keys field is now integrated into storyMode.provider section above -->
                                    <!-- This block is intentionally left empty to skip rendering -->
                                {:else if item.id === 'storyMode.temperature'}
                                    <!-- Special handling for Temperature Slider with 0.1 steps, synced with EmojiDisplay -->
                                    {@const currentTemperatureRaw = getCurrentValue(item)}
                                    {@const currentTemperature = typeof currentTemperatureRaw === 'number' 
                                        ? currentTemperatureRaw 
                                        : (currentTemperatureRaw ? parseFloat(currentTemperatureRaw) : 0)}
                                    {@const safeTemperature = typeof currentTemperature === 'number' && !isNaN(currentTemperature) 
                                        ? Math.max(0, Math.min(1, currentTemperature)) 
                                        : 0}
                                    
                                    <div class="space-y-3">
                                        <div class="flex items-center space-x-2">
                                            {#if item.icon}
                                                <span class="text-lg">{item.icon}</span>
                                            {/if}
                                            <label for={item.id} class="text-sm font-semibold text-gray-900 dark:text-white">
                                                {getLocalizedText(item.title)}
                                            </label>
                                        </div>
                                        <p class="sr-only">{getLocalizedText(item.description)}</p>
                                        <div class="relative">
                                            <div class="flex items-center gap-2">
                                                <input
                                                    id={item.id}
                                                    type="range"
                                                    min={item.min || 0}
                                                    max={item.max || 1}
                                                    step={item.step || 0.1}
                                                    value={safeTemperature}
                                                    on:input={(e) => {
                                                        const newValue = parseFloat(e.target.value);
                                                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
                                                            console.log('🌡️ Temperature slider changed:', newValue);
                                                            handleSettingUpdate(item.id, newValue);
                                                        }
                                                    }}
                                                    class="flex-1 h-1.5 appearance-none rounded-full bg-gray-300 dark:bg-gray-600 transition-all hover:bg-yellow-400 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    style="--range-thumb-color: rgb(234, 179, 8);"
                                                    aria-label={getLocalizedText(item.title)}
                                                    aria-valuemin={item.min || 0}
                                                    aria-valuemax={item.max || 1}
                                                    aria-valuenow={safeTemperature}
                                                />
                                                <span class="text-xs font-semibold text-yellow-600 dark:text-yellow-400 w-8 text-right tabular-nums shrink-0">
                                                    {safeTemperature.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                {:else if item.id !== 'storyMode.enabled' && item.id !== 'storyMode.provider' && item.id !== 'storyMode.apiKeys'}
                                    <!-- Normal input without special handling (skip items that are handled above) -->
                                    <ModularInput
                                        config={{
                                            type: item.type,
                                            id: item.id,
                                            icon: item.icon,
                                            label: item.title,
                                            description: item.description,
                                            placeholder: item.placeholder,
                                            value: getCurrentValue(item),
                                            options: item.options?.map(opt => ({
                                                value: opt.value,
                                                label: opt.label
                                            })) || [],
                                            min: item.min,
                                            max: item.max,
                                            step: item.step, // Wichtig für Temperature Slider mit 0.1 Steps
                                            labels: item.labels,
                                            defaultValue: item.defaultValue,
                                            class: 'contact-input'
                                        }}
                                        currentLanguage={$currentLanguage}
                                        currentValue={getCurrentValue(item)}
                                        onValueChange={(value) => handleSettingUpdate(item.id, value)}
                                    />
                                {/if}
                            </div>
                        {/each}

                        <!-- Pro Items (Custom API fields are now integrated into storyMode.provider section) -->
                        {#if section.proItems}
                            {#each section.proItems as item (item.id)}
                                <!-- Skip custom API fields - they are now in the provider section -->
                                {@const isCustomField = item.id?.startsWith('storyMode.custom')}
                                {#if !isCustomField}
                                    <div class="mb-4 last:mb-0">
                                        <ModularInput
                                            config={{
                                                type: item.type,
                                                id: item.id,
                                                icon: item.icon,
                                                label: item.title,
                                                description: item.description,
                                                placeholder: item.placeholder,
                                                value: getCurrentValue(item),
                                                options: item.options?.map(opt => ({
                                                    value: opt.value,
                                                    label: opt.label
                                                })) || [],
                                                min: item.min,
                                                max: item.max,
                                                labels: item.labels,
                                                defaultValue: item.defaultValue,
                                                class: 'contact-input'
                                            }}
                                            currentLanguage={$currentLanguage}
                                            currentValue={getCurrentValue(item)}
                                            onValueChange={(value) => handleSettingUpdate(item.id, value)}
                                        />
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    <!-- Global Modal -->
    <Modal />
</div>