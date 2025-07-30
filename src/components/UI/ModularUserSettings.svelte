<!--
 * ModularUserSettings.svelte
 * 
 * @description A modular, performant user settings component that uses JSON configuration
 * and reusable components for better maintainability and internationalization support.
 * 
 * @param {string} currentLanguage - Current language code (en, de, etc.)
 * @param {Object} currentSettings - Current settings values
 * @param {string} userTier - User tier ('free' or 'pro')
 * @param {Function} onSettingChange - Callback when setting value changes
 * @param {Function} onAction - Callback for button actions (optional)
 * @param {Function} onReset - Callback for reset action (optional)
 * @param {Function} onExport - Callback for export action (optional)
 * @param {Function} onImport - Callback for import action (optional)
 * 
 * @example
 * <ModularUserSettings 
 *   currentLanguage="en"
 *   currentSettings={settings}
 *   userTier="pro"
 *   onSettingChange={(key, value) => updateSetting(key, value)}
 *   onAction={(action) => handleAction(action)}
 *   onReset={() => resetSettings()}
 *   onExport={() => exportSettings()}
 *   onImport={(file) => importSettings(file)}
 * />
 -->

<script>
    import { onMount } from 'svelte';
    import SettingsSection from './SettingsSection.svelte';
    import { loadContent } from '../../utils/contentLoader.js';
    
    // Props
    export let currentLanguage = 'en';
    export let currentSettings = {};
    export let userTier = 'free';
    export let onSettingChange;
    export let onAction;
    export let onReset;
    export let onExport;
    export let onImport;
    
    // State
    let settingsConfig = {};
    let activeSection = null;
    let fileInput;
    
    // Load settings configuration
    async function loadSettingsConfig() {
        try {
            settingsConfig = await loadContent('userSettings.json');
        } catch (error) {
            console.error('Failed to load settings configuration:', error);
            // Fallback to basic settings structure
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
                },
                actions: {
                    reset: {
                        icon: '🔄',
                        title: { en: 'Reset to Default', de: 'Auf Standard zurücksetzen' },
                        color: 'red'
                    }
                }
            };
        }
    }
    
    // Handle section toggle (accordion behavior)
    function handleSectionToggle(sectionId) {
        activeSection = sectionId;
    }
    
    // Handle setting value change
    function handleSettingChange(key, value) {
        onSettingChange?.(key, value);
    }
    
    // Handle action button click
    function handleAction(action) {
        onAction?.(action);
    }
    
    // Handle reset action
    function handleReset() {
        onReset?.();
    }
    
    // Handle export action
    function handleExport() {
        onExport?.();
    }
    
    // Handle import action
    function handleImport() {
        fileInput?.click();
    }
    
    // Handle file selection for import
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            onImport?.(file);
            // Reset file input
            event.target.value = '';
        }
    }
    
    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[currentLanguage] || textObj?.en || fallback;
    }
    
    // Get available sections based on user tier
    $: availableSections = Object.values(settingsConfig.sections || {}).filter(section => {
        // Show all sections for pro users
        if (userTier === 'pro') return true;
        
        // For free users, only show sections without proItems or with empty proItems
        return !section.proItems || section.proItems.length === 0;
    });
    
    // Get available actions based on user tier
    $: availableActions = userTier === 'pro' 
        ? Object.values(settingsConfig.actions || {})
        : Object.values(settingsConfig.actions || {}).filter(action => 
            action.title?.en !== 'Export Settings' && action.title?.en !== 'Import Settings'
        );
    
    onMount(() => {
        loadSettingsConfig();
    });
</script>

<div class="space-y-6">
    <!-- Settings Sections -->
    {#each availableSections as section}
        <SettingsSection
            {section}
            {currentLanguage}
            {activeSection}
            {currentSettings}
            {userTier}
            onSectionToggle={handleSectionToggle}
            onSettingChange={handleSettingChange}
            onAction={handleAction}
        />
    {/each}
    
    <!-- Action Buttons -->
    {#if availableActions.length > 0}
        <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            {#each availableActions as action}
                <button
                    class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 {action.color === 'red' ? 'bg-red-500 hover:bg-red-600 text-white' : action.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' : action.color === 'green' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}"
                    on:click={() => {
                        if (action.title?.en === 'Reset to Default') handleReset();
                        else if (action.title?.en === 'Export Settings') handleExport();
                        else if (action.title?.en === 'Import Settings') handleImport();
                    }}
                >
                    <span>{action.icon}</span>
                    <span>{getLocalizedText(action.title)}</span>
                </button>
            {/each}
        </div>
    {/if}
    
    <!-- Pro Message -->
    {#if userTier === 'free' && settingsConfig.proMessage}
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 italic">
            {getLocalizedText(settingsConfig.proMessage)}
        </div>
    {/if}
    
    <!-- Hidden file input for import -->
    <input
        type="file"
        accept=".json"
        bind:this={fileInput}
        on:change={handleFileSelect}
        class="hidden"
    />
</div> 