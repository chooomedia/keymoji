<!-- src/components/UserSettings.svelte -->
<script>
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import ModularInput from './UI/ModularInput.svelte';
    import { loadContent } from '../utils/contentLoader.js';
    import { 
        currentSettings, 
        updateSetting, 
        resetSettings,
        exportSettings,
        importSettings,
        runSecurityAudit
    } from '../stores/userSettingsStore.js';
    import { accountTier, isLoggedIn } from '../stores/appStores.js';
    import { showSuccess, showError, showInfo } from '../stores/modalStore.js';

    // Accordion state - only one section open at a time
    let activeSection = 'basic';

    // File input for import
    let fileInput;

    // Context menu state
    let showContextMenu = false;
    let contextMenuPosition = { x: 0, y: 0 };

    // Settings configuration
    let settingsConfig = {};

    // Load settings configuration
    async function loadSettingsConfig() {
        try {
            settingsConfig = await loadContent('userSettings.json');
        } catch (error) {
            console.error('Failed to load settings configuration:', error);
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

    // Toggle section visibility (accordion style)
    function toggleSection(section) {
        activeSection = activeSection === section ? null : section;
    }

    // Handle setting update
    function handleSettingUpdate(key, value) {
        updateSetting(key, value);
        showSuccess(`Setting updated: ${key}`, 2000);
    }

    // Handle settings reset
    function handleResetSettings() {
        resetSettings();
        showSuccess('Settings reset to default', 3000);
        closeContextMenu();
    }

    // Handle settings export
    function handleExportSettings() {
        try {
            exportSettings();
            showSuccess('Settings exported successfully', 3000);
        } catch (error) {
            showError('Failed to export settings', 3000);
        }
        closeContextMenu();
    }

    // Handle settings import
    function handleImportSettings(event) {
        const file = event.target.files[0];
        if (file) {
            importSettings(file)
                .then(() => {
                    showSuccess('Settings imported successfully', 3000);
                })
                .catch((error) => {
                    showError(`Import failed: ${error.message}`, 3000);
                });
        }
        closeContextMenu();
    }

    // Handle security audit
    function handleSecurityAudit() {
        try {
            const audit = runSecurityAudit();
            showInfo(`Security Score: ${audit.overallScore}/100`, 4000);
        } catch (error) {
            showError('Security audit failed', 3000);
        }
        closeContextMenu();
    }

    // Trigger file input
    function triggerFileInput() {
        fileInput.click();
    }

    // Context menu functions
    function toggleContextMenu(event) {
        event.stopPropagation();
        showContextMenu = !showContextMenu;
        if (showContextMenu) {
            const rect = event.currentTarget.getBoundingClientRect();
            contextMenuPosition = {
                x: rect.left,
                y: rect.bottom + 8
            };
        }
    }

    function closeContextMenu() {
        showContextMenu = false;
    }

    // Close context menu when clicking outside
    function handleClickOutside(event) {
        if (showContextMenu && !event.target.closest('.context-menu')) {
            closeContextMenu();
        }
    }

    // Check if user is pro
    $: isProUser = $accountTier === 'pro';

    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.en || fallback;
    }

    // Get current value for a setting with fallback to default
    function getCurrentValue(item) {
        const currentValue = $currentSettings[item.id];
        if (currentValue !== undefined && currentValue !== null) {
            return currentValue;
        }
        return item.defaultValue;
    }

    // Get available sections based on user tier
    $: availableSections = Object.values(settingsConfig.sections || {}).filter(section => {
        // Show all sections for pro users
        if (isProUser) return true;
        
        // For free users, only show sections without proItems or with empty proItems
        return !section.proItems || section.proItems.length === 0;
    });

    onMount(() => {
        loadSettingsConfig();
        // Add global click listener
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="w-full max-w-4xl mx-auto">
    <!-- Settings Accordion -->
    <div class="space-y-3">
        {#each availableSections as section}
            <div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
                <button
                    class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out"
                    on:click={() => toggleSection(section.id)}
                >
                    <div class="flex items-center space-x-4">
                        <span class="text-xl">{section.icon}</span>
                        <div class="justify-start text-left">
                            <h3 class="font-semibold text-gray-900 dark:text-white text-md">
                                {getLocalizedText(section.title)}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {getLocalizedText(section.description)}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === section.id ? 'rotate-180' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </button>
                
                {#if activeSection === section.id}
                    <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
                        <!-- Regular items -->
                        {#each section.items || [] as item}
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <ModularInput
                                    config={{
                                        id: item.id,
                                        type: item.type,
                                        icon: item.icon,
                                        label: item.title,
                                        description: item.description,
                                        defaultValue: item.defaultValue,
                                        color: item.color,
                                        options: item.options,
                                        min: item.min,
                                        max: item.max,
                                        validation: item.validation,
                                        buttonText: item.buttonText,
                                        action: item.action
                                    }}
                                    currentLanguage="en"
                                    currentValue={getCurrentValue(item)}
                                    onValueChange={(value) => handleSettingUpdate(item.id, value)}
                                    onAction={(action) => {
                                        if (action === 'securityAudit') {
                                            handleSecurityAudit();
                                        }
                                    }}
                                />
                            </div>
                        {/each}

                        <!-- Pro-only items -->
                        {#if isProUser && section.proItems}
                            {#each section.proItems as item}
                                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500">
                                    <ModularInput
                                        config={{
                                            id: item.id,
                                            type: item.type,
                                            icon: item.icon,
                                            label: item.title,
                                            description: item.description,
                                            defaultValue: item.defaultValue,
                                            color: item.color,
                                            options: item.options,
                                            min: item.min,
                                            max: item.max,
                                            validation: item.validation,
                                            buttonText: item.buttonText,
                                            action: item.action
                                        }}
                                        currentLanguage="en"
                                        currentValue={getCurrentValue(item)}
                                        onValueChange={(value) => handleSettingUpdate(item.id, value)}
                                        onAction={(action) => {
                                            if (action === 'securityAudit') {
                                                handleSecurityAudit();
                                            }
                                        }}
                                    />
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    <!-- Hidden file input -->
    <input
        bind:this={fileInput}
        type="file"
        accept=".json"
        on:change={handleImportSettings}
        class="hidden"
    />
</div>

<style>
    /* Custom slider styling */
    .slider {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
    }

    .slider::-webkit-slider-track {
        background: #e5e7eb;
        height: 8px;
        border-radius: 4px;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        background: #3b82f6;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider::-moz-range-track {
        background: #e5e7eb;
        height: 8px;
        border-radius: 4px;
        border: none;
    }

    .slider::-moz-range-thumb {
        background: #3b82f6;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    /* Smooth transitions */
    * {
        transition: all 0.2s ease-in-out;
    }

    /* Focus styles */
    button:focus, select:focus, input:focus {
        outline: none;
        ring: 2px;
        ring-color: #3b82f6;
    }
</style> 