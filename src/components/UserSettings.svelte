<!-- src/components/UserSettings.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { get } from 'svelte/store';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import { accountTier } from '../stores/appStores.js';
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

    // Check if user is pro - optimiert mit $: um zu viele Aufrufe zu vermeiden
    $: isProUser = $accountTier === 'pro';

    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[$currentLanguage] || textObj?.en || fallback;
    }

    // Get effective value for a setting (includes pending changes) - optimiert
    function getCurrentValue(item) {
        return getEffectiveValue(item.id) ?? item.defaultValue;
    }

    // Get available sections based on user tier
    $: availableSections = Object.values(settingsConfig.sections || {}).filter(section => {
        // Free users: only basic and emoji sections
        if (!isProUser) {
            return section.id === 'basic' || section.id === 'emoji';
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
        // Handle upgrade action
        showSuccess('Redirecting to Pro upgrade...', 3000);
        // Add your upgrade logic here
        showProModal = false;
    }

    function toggleSection(sectionId) {
        activeSection = activeSection === sectionId ? null : sectionId;
    }

    onMount(async () => {
        console.log('🔄 UserSettings: Component mounting...');
        await loadSettingsConfig();
        console.log('✅ UserSettings: Component mounted with config:', settingsConfig);

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

    <!-- Account Tier Info -->
    <div class="mb-6 p-4 bg-powder-300 dark:bg-aubergine-700 rounded-lg border border-purple-700">
        <div class="flex items-start flex-col justify-center space-y-3">
            <div class="flex items-start space-x-3">
                <span class="text-2xl">
                    {#if isProUser}
                        💎
                    {:else}
                        🆓
                    {/if}
                </span>
                <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {#if isProUser}
                            Pro Account
                        {:else}
                            {$translations?.accountManager?.tiers?.freeAccount || 'Free Account'}
                        {/if}
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {#if isProUser}
                            You have access to all features
                        {:else}
                            {$translations?.accountManager?.upgrade?.upgradeToProForFeatures || 'Upgrade to Pro for advanced features'}
                        {/if}
                    </p>
                </div>
            </div>
            {#if !isProUser}
                <button
                    on:click={() => handleProFeature($translations?.accountManager?.proFeatureModal?.proUpgrade || 'Pro Upgrade', $translations?.accountManager?.proFeatureModal?.unlockAdvancedFeatures || 'Unlock all advanced features and settings')}
                    class="w-full inline-flex justify-center items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                {$translations?.accountManager?.proFeatureModal?.upgradeProNow || '💎 Upgrade Pro now'}
                </button>
            {/if}
        </div>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-4">
        {#each availableSections as section}
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- Section Header -->
                <button
                    on:click={() => toggleSection(section.id)}
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                            >
                                Upgrade
                            </button>
                        {/if}
                        <svg 
                            class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === section.id ? 'rotate-180' : 'rotate-0'}" 
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
                        {/each}

                        <!-- Pro Items (now functional for all users) -->
                        {#if section.proItems}
                                {#each section.proItems as item}
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