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
        getEffectiveValue
    } from '../stores/userSettingsStore.js';
    import ModularInput from './UI/ModularInput.svelte';
    import Modal from './UI/Modal.svelte';
    import { showSuccess, showError, showWarning, showModal } from '../stores/modalStore.js';

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

    // Check if user is pro - optimiert mit $: um zu viele Aufrufe zu vermeiden
    $: isProUser = $accountTier === 'pro';
    
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
        updateSetting(key, value);
        
        // Apply some settings immediately for preview
        if (key === 'theme') {
            applyTheme(value);
        }
        if (key === 'language') {
            applyLanguage(value);
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
                        
                        // Save settings
                        await saveAllSettings();
                        
                        // Show success message
                        showSuccess('Settings saved successfully!', 3000);
                        
                        // Reset loading state
                        settingsStatus.update(status => ({ ...status, isSaving: false }));
                        
                        // Apply settings immediately after save
                        applySettingsImmediately();
                        
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
        activeSection = activeSection === sectionId ? null : sectionId;
        
        // Update uiState for persistence
        if (activeSection === sectionId) {
            // Section opened - add to expanded list
            if (!uiState.expandedSections.includes(sectionId)) {
                uiState.expandedSections = [...uiState.expandedSections, sectionId];
            }
        } else {
            // Section closed - remove from expanded list
            uiState.expandedSections = uiState.expandedSections.filter(id => id !== sectionId);
        }
        
        console.log('🎨 UI State updated:', uiState);
        
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
        
        // Load UI state from userSettings
        const loadedUiState = getEffectiveValue('uiState');
        if (loadedUiState && loadedUiState.expandedSections) {
            uiState = loadedUiState;
            // Set activeSection to first expanded section
            if (uiState.expandedSections.length > 0) {
                activeSection = uiState.expandedSections[0];
            }
            console.log('✅ UI State loaded from settings:', uiState);
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
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- Section Header -->
                <button
                    on:click={() => toggleSection(section.id)}
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-all focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                    aria-label="{getLocalizedText(section.title)} - {activeSection === section.id ? 'Collapse' : 'Expand'}"
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
                        {/each}

                        <!-- Pro Items (now functional for all users) -->
                        {#if section.proItems}
                                {#each section.proItems as item}
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