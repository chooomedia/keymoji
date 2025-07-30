<!--
 * SettingsSection.svelte
 * 
 * @description A modular component for rendering collapsible settings sections
 * with support for internationalization, accordion behavior, and tier-based features.
 * 
 * @param {Object} section - The section configuration object
 * @param {string} section.id - Unique identifier for the section
 * @param {string} section.icon - Icon emoji for the section
 * @param {Object} section.title - Localized title object {en: string, de: string}
 * @param {Object} section.description - Localized description object {en: string, de: string}
 * @param {Array} section.items - Array of settings items for free users
 * @param {Array} section.proItems - Array of settings items for pro users (optional)
 * 
 * @param {string} currentLanguage - Current language code (en, de, etc.)
 * @param {string} activeSection - Currently active section ID
 * @param {Object} currentSettings - Current settings values
 * @param {string} userTier - User tier ('free' or 'pro')
 * @param {Function} onSectionToggle - Callback when section is toggled
 * @param {Function} onSettingChange - Callback when setting value changes
 * @param {Function} onAction - Callback for button actions (optional)
 * 
 * @example
 * <SettingsSection 
 *   section={sectionConfig}
 *   currentLanguage="en"
 *   activeSection="basic"
 *   currentSettings={settings}
 *   userTier="pro"
 *   onSectionToggle={(sectionId) => setActiveSection(sectionId)}
 *   onSettingChange={(key, value) => updateSetting(key, value)}
 *   onAction={(action) => handleAction(action)}
 * />
 -->

<script>
    import { slide } from 'svelte/transition';
    import SettingsItem from './SettingsItem.svelte';
    
    // Props
    export let section;
    export let currentLanguage = 'en';
    export let activeSection;
    export let currentSettings;
    export let userTier = 'free';
    export let onSectionToggle;
    export let onSettingChange;
    export let onAction;
    
    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[currentLanguage] || textObj?.en || fallback;
    }
    
    // Check if section is active
    $: isActive = activeSection === section.id;
    
    // Get all items for current tier
    $: allItems = [
        ...(section.items || []),
        ...(userTier === 'pro' && section.proItems ? section.proItems : [])
    ];
    
    // Handle section toggle
    function handleSectionToggle() {
        onSectionToggle?.(isActive ? null : section.id);
    }
    
    // Handle setting value change
    function handleSettingChange(itemId, value) {
        onSettingChange?.(itemId, value);
    }
    
    // Handle action button click
    function handleAction(action) {
        onAction?.(action);
    }
</script>

<div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
    <button 
        class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
        on:click={handleSectionToggle}
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
            <svg 
                class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {isActive ? 'rotate-180' : 'rotate-0'}" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
    </button>
    
    {#if isActive}
        <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
            {#each allItems as item}
                <SettingsItem
                    {item}
                    {currentLanguage}
                    currentValue={currentSettings[item.id]}
                    onValueChange={(value) => handleSettingChange(item.id, value)}
                    onAction={handleAction}
                />
            {/each}
        </div>
    {/if}
</div> 