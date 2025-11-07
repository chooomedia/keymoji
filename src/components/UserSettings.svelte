<!-- src/components/UserSettings.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { get } from 'svelte/store';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import { accountTier, currentAccount, darkMode } from '../stores/appStores.js';
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
    import { showSuccess, showError, showWarning, showModal } from '../stores/modalStore.js';
    import { testAIProvider, getProviderInfo } from '../utils/storyModeAI.js';

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

    // Check if user is pro - optimiert mit $: um zu viele Aufrufe zu vermeiden
    $: isProUser = $accountTier === 'pro';
    
    // Load verification status from settings
    function loadVerificationStatus() {
        const currentSettings = getCurrentUserSettings();
        const storyMode = currentSettings?.storyMode || {};
        const verifiedProviders = storyMode.verifiedProviders || {};
        const currentProvider = getEffectiveValue('storyMode.provider') || 'apertus';
        
        // Check if current provider is verified
        if (verifiedProviders[currentProvider]?.success) {
            const verification = verifiedProviders[currentProvider];
            apiTestSuccess = true;
            testedProvider = currentProvider;
            console.log('✅ Verification status restored for provider:', currentProvider, {
                verifiedAt: verification.verifiedAt,
                model: verification.model
            });
        } else {
            apiTestSuccess = false;
            testedProvider = null;
            console.log('ℹ️ No verification status found for provider:', currentProvider);
        }
    }
    
    // REACTIVE: Reset test status when provider or API key changes
    $: {
        const currentProvider = getEffectiveValue('storyMode.provider') || 'apertus';
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
    $: reactivityTrigger = {
        account: $currentAccount,
        settings: $userSettings,
        pending: $pendingChanges,
        language: $currentLanguage
    };

    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[$currentLanguage] || textObj?.en || fallback;
    }

    // Get effective value for a setting (includes pending changes) - ROBUST & REACTIVE
    function getCurrentValue(item) {
        const itemId = item.id;
        
        // Use getEffectiveValue from store (handles pending + userSettings + tier defaults)
        let effectiveValue = getEffectiveValue(itemId);
        
        // DEBUG: Log for critical fields
        if (['language', 'theme', 'name'].includes(itemId)) {
            console.log(`🔍 getCurrentValue(${itemId}):`, {
                effectiveValue,
                userSettings: get(userSettings)[itemId],
                pending: get(pendingChanges)[itemId],
                currentAccount: get(currentAccount)
            });
        }
        
        // Special handling for critical fields that sync with other stores
        
        // Name: REACTIVE - prefer currentAccount, then pending, then userSettings
        if (itemId === 'name') {
            // Priority 1: Pending changes (user is typing)
            const pending = get(pendingChanges)[itemId];
            if (pending) {
                console.log(`👤 getCurrentValue(name): Using pending:`, pending);
                return pending;
            }
            
            // Priority 2: currentAccount store (after successful save)
            const account = $currentAccount; // REACTIVE!
            const accountName = account?.name || account?.profile?.name;
            if (accountName) {
                console.log(`👤 getCurrentValue(name): Using currentAccount:`, accountName);
                return accountName;
            }
            
            // Priority 3: userSettings
            const settingsName = $userSettings?.name; // REACTIVE!
            if (settingsName) {
                console.log(`👤 getCurrentValue(name): Using userSettings:`, settingsName);
                return settingsName;
            }
            
            // Priority 4: Default value
            const finalName = item.defaultValue || '';
            console.log(`👤 getCurrentValue(name): Using default:`, finalName);
            return finalName;
        }
        
        // Language: Always sync from currentLanguage store (source of truth)
        if (itemId === 'language') {
            const lang = get(currentLanguage);
            const finalLang = lang || effectiveValue || item.defaultValue || 'en';
            console.log(`🌍 getCurrentValue(language): Final value:`, finalLang);
            return finalLang;
        }
        
        // Theme: Support "auto" + sync from storage
        if (itemId === 'theme') {
            // Check explicit storage first (supports "auto")
            const storedTheme = localStorage.getItem('keymoji_theme');
            if (storedTheme && ['auto', 'light', 'dark'].includes(storedTheme)) {
                console.log(`🎨 getCurrentValue(theme): Using stored theme:`, storedTheme);
                return storedTheme;
            }
            
            // Then check effectiveValue
            if (effectiveValue) {
                console.log(`🎨 getCurrentValue(theme): Using effective value:`, effectiveValue);
                return effectiveValue;
            }
            
            // Fallback: Derive from darkMode
            const isDark = get(darkMode);
            const derivedTheme = isDark ? 'dark' : 'light';
            console.log(`🎨 getCurrentValue(theme): Derived from darkMode:`, derivedTheme);
            return derivedTheme;
        }
        
        // For all other fields: Use effectiveValue (handles tier-appropriate defaults)
        const finalValue = effectiveValue !== undefined ? effectiveValue : item.defaultValue;
        
        if (effectiveValue === undefined) {
            console.log(`⚙️ getCurrentValue(${itemId}): Using fallback default:`, item.defaultValue);
        }
        
        return finalValue;
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
        console.log('🔧 handleSettingUpdate:', { key, value, type: typeof value });
        
        // Special validation for Story Mode enabled toggle
        if (key === 'storyMode.enabled') {
            const currentProvider = getEffectiveValue('storyMode.provider') || 'apertus';
            const apiKeys = getEffectiveValue('storyMode.apiKeys') || {};
            const hasApiKey = apiKeys[currentProvider] && apiKeys[currentProvider].length >= 10;
            
            console.log('✨ Story Mode toggle:', {
                newValue: value,
                currentProvider,
                hasApiKey,
                apiKeyLength: apiKeys[currentProvider]?.length || 0,
                apiTestSuccess,
                testedProvider
            });
            
            if (value === true) {
                // Check if API key exists
                if (!hasApiKey) {
                    showWarning(
                        `⚠️ Bitte gib zuerst einen API-Key ein!\n\n` +
                        `Du benötigst einen gültigen API-Key, um Story Mode zu nutzen.`,
                        5000
                    );
                    console.error('❌ Story Mode activation blocked: No API key');
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
        if (key === 'storyMode.apiKeys') {
            const currentProvider = getEffectiveValue('storyMode.provider') || 'apertus';
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
        
        // Update the setting
        updateSetting(key, value);
        console.log('✅ Setting updated in store:', { key, value });
        
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
     * Test API Connection
     * Tests if the configured API key and provider work correctly
     */
    async function testAPIConnection() {
        isTestingAPI = true;
        
        // Get current Story Mode settings (OUTSIDE try block for error handler access)
        const provider = getEffectiveValue('storyMode.provider') || 'openai';
        const apiKeys = getEffectiveValue('storyMode.apiKeys') || {};
        const apiKey = apiKeys[provider];
        const customApiUrl = getEffectiveValue('storyMode.customApiUrl');
        const customEndpoint = getEffectiveValue('storyMode.customEndpoint');
        const customFormat = getEffectiveValue('storyMode.customFormat');
        const customModel = getEffectiveValue('storyMode.customModel');
        const model = getEffectiveValue('storyMode.model');
        
        try {
            console.log('🧪 Testing API connection:', { 
                provider, 
                hasApiKey: !!apiKey,
                customApiUrl,
                customEndpoint,
                customFormat,
                customModel,
                model
            });
            
            // Validate API key exists for current provider (skip for Apertus as it uses n8n token)
            if (provider !== 'apertus' && (!apiKey || apiKey.length < 10)) {
                showWarning(`⚠️ Bitte gib zuerst einen API-Key für ${provider} ein`, 3000);
                return;
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
            
            console.log('📤 Sending test request with config:', testConfig);
            
            // Call test function
            const result = await testAIProvider(testConfig);
            
            console.log('📥 Received test result:', result);
            
            if (result.success) {
                // ✅ Mark test as successful
                apiTestSuccess = true;
                testedProvider = provider;
                console.log('✅ API test successful, provider verified:', provider);
                
                // Save verification status to settings (persistent storage)
                const currentSettings = getCurrentUserSettings();
                const storyMode = currentSettings?.storyMode || {};
                const verifiedProviders = storyMode.verifiedProviders || {};
                
                // Update verified providers with test result
                verifiedProviders[provider] = {
                    verifiedAt: new Date().toISOString(),
                    model: result.model || getEffectiveValue('storyMode.model') || '',
                    lastTest: new Date().toISOString(),
                    success: true
                };
                
                // Save to settings (will be persisted on next save)
                updateSetting('storyMode.verifiedProviders', verifiedProviders);
                console.log('💾 Verification status saved for provider:', provider, verifiedProviders[provider]);
                
                const providerInfo = getProviderInfo(provider);
                showSuccess(
                    `✅ Verbindung erfolgreich!\n\n` +
                    `Provider: ${providerInfo.name}\n` +
                    `Model: ${result.model || 'default'}\n` +
                    `Response: ${result.response.substring(0, 50)}...`,
                    5000
                );
                console.log('✅ API test successful:', result);
            } else {
                // ❌ Mark test as failed
                apiTestSuccess = false;
                testedProvider = null;
                throw new Error(result.error || 'Unknown error');
            }
            
        } catch (error) {
            // ❌ Mark test as failed
            apiTestSuccess = false;
            testedProvider = null;
            
            console.error('❌ API test failed:', error);
            
            // Enhanced error message for CORS errors
            let errorMessage = error.message || 'Unbekannter Fehler';
            let helpText = '';
            
            if (errorMessage.includes('CORS_ERROR')) {
                helpText = `\n\n💡 CORS-Lösung für lokale API:\n` +
                    `1. Füge CORS-Header in deinem API-Server hinzu:\n` +
                    `   Access-Control-Allow-Origin: http://localhost:8080\n` +
                    `   Access-Control-Allow-Methods: POST\n` +
                    `   Access-Control-Allow-Headers: Content-Type, Authorization\n\n` +
                    `2. Oder teste mit Mock-Mode: /?mock-custom-api=true`;
            } else if (errorMessage.includes('NETWORK_ERROR') && errorMessage.includes('Is your local API server running?')) {
                helpText = `\n\n💡 Lösungen:\n` +
                    `1. Starte deinen lokalen API-Server (Port 1234)\n` +
                    `2. Prüfe ob die URL korrekt ist: ${customApiUrl || 'http://127.0.0.1:1234'}\n` +
                    `3. Oder teste mit Mock-Mode: /?mock-custom-api=true`;
            }
            
            showError(
                `❌ Verbindung fehlgeschlagen\n\n` +
                `Fehler: ${errorMessage}${helpText}`,
                10000 // Show longer for CORS/network errors
            );
        } finally {
            isTestingAPI = false;
        }
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
        
        // Load and restore verification status from settings
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
                        {#each section.items as item}
                            {#key reactivityTrigger}
                            <div class="mb-4 last:mb-0">
                                <!-- Special handling for AI Provider dropdown with link -->
                                {#if item.id === 'storyMode.provider'}
                                    {@const currentProvider = getCurrentValue(item) || 'apertus'}
                                    
                                    <div>
                                        <!-- Provider Dropdown with Success Icon -->
                                        <div class="relative">
                                            <div class="relative">
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
                                        </div>
                                        
                                        <!-- API Key creation link below provider dropdown -->
                                        {#if currentProvider !== 'custom'}
                                            {@const apiKeyUrls = {
                                                openai: 'https://platform.openai.com/api-keys',
                                                gemini: 'https://makersuite.google.com/app/apikey',
                                                mistral: 'https://console.mistral.ai/api-keys',
                                                claude: 'https://console.anthropic.com/settings/keys',
                                                apertus: 'https://aimi.matt-interfaces.ch/api'
                                            }}
                                            {@const providerNames = {
                                                openai: 'OpenAI Platform',
                                                gemini: 'Google AI Studio',
                                                mistral: 'Mistral Console',
                                                claude: 'Anthropic Console',
                                                apertus: 'Apertus API'
                                            }}
                                        {/if}
                                    </div>
                                    
                                {:else if item.id === 'storyMode.apiKeys'}
                                    <!-- Special handling for API Keys field with inline buttons -->
                                    {@const currentProvider = getCurrentValue({ id: 'storyMode.provider' }) || 'apertus'}
                                    {@const apiKeys = getCurrentValue({ id: 'storyMode.apiKeys' }) || {}}
                                    {@const currentApiKey = apiKeys[currentProvider] || ''}
                                    {@const hasValidKey = currentApiKey && currentApiKey.length >= 10}
                                    {@const hasAnyKey = currentApiKey && currentApiKey.length > 0}
                                    {@const savedProviders = Object.entries(apiKeys).filter(([provider, key]) => provider !== currentProvider && key && key.length >= 10).map(([provider]) => provider)}
                                    {@const isApertus = currentProvider === 'apertus'}
                                    {@const apertusPlaceholder = 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
                                    
                                    <div class="space-y-3">
                                        <!-- Label and Icon with Provider Info -->
                                        <div class="flex items-center space-x-2">
                                            {#if item.icon}
                                                <span class="text-lg">{item.icon}</span>
                                            {/if}
                                            <label for={item.id} class="text-sm font-semibold text-gray-900 dark:text-white">
                                                {getLocalizedText(item.title)}
                                                <span class="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                                    ({currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)})
                                                </span>
                                            </label>
                                        </div>
                                        
                                        <!-- Input Container with inline Buttons -->
                                        <div class="relative">
                                            {#if isApertus}
                                                <!-- Apertus: Disabled input with placeholder -->
                                                <input
                                                    id={item.id}
                                                    type="password"
                                                    value={apertusPlaceholder}
                                                    disabled={true}
                                                    readonly={true}
                                                    placeholder={apertusPlaceholder}
                                                    class="w-full p-4 pr-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border border-gray-300 dark:border-gray-600 rounded-xl transition-all duration-200 cursor-not-allowed opacity-60"
                                                    aria-label={getLocalizedText(item.title)}
                                                />
                                            {:else}
                                                <!-- Other providers: Normal input -->
                                            <input
                                                id={item.id}
                                                type={showApiKey ? 'text' : 'password'}
                                                value={currentApiKey || ''}
                                                on:input={(e) => {
                                                    // Update the specific provider's API key
                                                    const newApiKeys = { ...apiKeys, [currentProvider]: e.target.value };
                                                    handleSettingUpdate('storyMode.apiKeys', newApiKeys);
                                                }}
                                                    on:keydown={(e) => {
                                                        // Prevent focus loss on keydown - only prevent default for specific problematic keys
                                                        // Allow normal typing, but prevent focus-stealing behaviors
                                                        if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                                                            // Allow Tab for navigation
                                                            return;
                                                        }
                                                    }}
                                                placeholder={getLocalizedText(item.placeholder)}
                                                class="w-full p-4 {hasValidKey ? 'pr-32' : hasAnyKey ? 'pr-14' : 'pr-4'} bg-white dark:bg-aubergine-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400/50 dark:focus:ring-yellow-500/50 placeholder-gray-400 dark:placeholder-gray-500"
                                                aria-label={getLocalizedText(item.title)}
                                            />
                                            {/if}
                                            
                                            <!-- Gradient Fade-out Overlay VOR Buttons (z-5, innerhalb Border) -->
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
                                            
                                            <!-- Inline Buttons Container - Perfect centering (z-10, über Gradient) -->
                                            {#if isApertus || hasAnyKey}
                                                <div class="absolute right-2 inset-y-0 flex items-center gap-1 z-10">
                                                    {#if !isApertus}
                                                        <!-- Show/Hide Button (only for non-Apertus providers) -->
                                                    <button
                                                        type="button"
                                                        on:click={() => showApiKey = !showApiKey}
                                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-yellow-500 active:bg-yellow-600 dark:hover:bg-aubergine-800 dark:active:bg-aubergine-700 focus:outline-none text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:text-black dark:active:text-white"
                                                        aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                                                        title={showApiKey ? 'Hide' : 'Show'}
                                                    >
                                                        {#if showApiKey}
                                                            <!-- Eye Slash Icon (Hide) -->
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                            </svg>
                                                        {:else}
                                                            <!-- Eye Icon (Show) -->
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        {/if}
                                                    </button>
                                                    {/if}
                                                    
                                                    <!-- Test Connection Button (always available for Apertus, or if hasValidKey for others) -->
                                                    {#if isApertus || hasValidKey}
                                                        {@const isTestSuccessful = apiTestSuccess && testedProvider === currentProvider}
                                                        <button
                                                            type="button"
                                                            disabled={isTestingAPI}
                                                            on:click={testAPIConnection}
                                                            class="inline-flex items-center justify-center gap-1 px-2.5 h-8 text-xs font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed
                                                                {isTestSuccessful
                                                                    ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 active:bg-green-700 dark:active:bg-green-800'
                                                                    : 'hover:bg-yellow-500 active:bg-yellow-600 dark:hover:bg-aubergine-800 dark:active:bg-aubergine-700 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white active:text-black dark:active:text-white'}"
                                                            aria-label={isTestingAPI ? 'Testing API connection' : isTestSuccessful ? 'API connection verified' : 'Test API connection'}
                                                            title={isTestingAPI ? 'Testing...' : isTestSuccessful ? 'API connection verified ✅' : 'Test'}
                                                        >
                                                            {#if isTestingAPI}
                                                                <svg class="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            {:else if isTestSuccessful}
                                                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                                </svg>
                                                            {:else}
                                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                </svg>
                                                            {/if}
                                                            <span class="hidden sm:inline">{isTestSuccessful ? 'Verified' : 'Test'}</span>
                                                        </button>
                                                    {/if}
                                                </div>
                                            {/if}
                                        </div>
                                        
                                        <!-- Description with saved keys indicator -->
                                        {#if item.description}
                                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                                                {#if isApertus}
                                                    <!-- Apertus-specific info -->
                                                    <p class="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                                        {$translations?.accountManager?.apertusInfo || 'Derzeit wird ein auf HuggingFace gehostetes LLM-Modell (Apertus) verwendet, das über einen n8n Workflow bereitgestellt wird.'}
                                                    </p>
                                                    <div class="flex flex-wrap items-center gap-3 mt-2">
                                                        <a 
                                                            href="https://huggingface.co/swiss-ai/Apertus-8B-Instruct-2509" 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            class="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                                        >
                                                            <span>{$translations?.accountManager?.apertusHuggingFaceLink || 'Apertus-8B auf HuggingFace'}</span>
                                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                        <a 
                                                            href="http://matt-interfaces.ch/n8n" 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            class="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                                        >
                                                            <span>n8n Workflow Tool</span>
                                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                {:else}
                                                <p>{getLocalizedText(item.description)}</p>
                                                {/if}
                                                
                                                <!-- Show saved keys for other providers -->
                                                {#if savedProviders.length > 0}
                                                    <p class="text-green-600 dark:text-green-400 inline-flex items-center gap-1">
                                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                        </svg>
                                                        Saved keys for: {savedProviders.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                                                    </p>
                                                {/if}
                                            </div>
                                        {/if}
                                    </div>
                                {:else}
                                    <!-- Normal input without special handling (skip provider as it's handled above) -->
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
                                {/if}
                            </div>
                            {/key}
                        {/each}

                        <!-- Pro Items (now functional for all users) -->
                        {#if section.proItems}
                                {#each section.proItems as item}
                                    <!-- Conditional rendering for Custom API fields -->
                                    {@const isCustomField = item.id?.startsWith('storyMode.custom')}
                                    {@const currentProvider = getCurrentValue({ id: 'storyMode.provider' })}
                                    {@const shouldShowCustomField = !isCustomField || currentProvider === 'custom'}
                                    
                                    {#if shouldShowCustomField}
                                    {#key reactivityTrigger}
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
                                    {/key}
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