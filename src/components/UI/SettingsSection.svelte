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

<script lang="ts">
    import { slide } from 'svelte/transition';
    import SettingsItem from './SettingsItem.svelte';
    
    interface SettingsItemConfig {
        id: string;
        type: 'toggle' | 'select' | 'range' | 'button';
        icon?: string;
        title?: Record<string, string>;
        description?: Record<string, string>;
        defaultValue?: unknown;
        color?: string;
        options?: Array<{ value: string; label: Record<string, string> }>;
        labels?: { min?: string; max?: string };
        min?: number;
        max?: number;
        validation?: unknown;
        buttonText?: string;
    }
    
    interface SectionConfig {
        id: string;
        icon?: string;
        title?: Record<string, string>;
        description?: Record<string, string>;
        items?: SettingsItemConfig[];
        proItems?: SettingsItemConfig[];
    }
    
    interface Props {
        section: SectionConfig;
        currentLanguage?: string;
        activeSection?: string | null;
        currentSettings?: Record<string, unknown>;
        userTier?: 'free' | 'pro';
        onSectionToggle?: (sectionId: string | null) => void;
        onSettingChange?: (itemId: string, value: unknown) => void;
        onAction?: (action: string) => void;
    }
    
    let {
        section,
        currentLanguage = 'en',
        activeSection,
        currentSettings = {},
        userTier = 'free',
        onSectionToggle,
        onSettingChange,
        onAction
    }: Props = $props();
    
    function getLocalizedText(textObj: Record<string, string> | undefined, fallback = ''): string {
        return textObj?.[currentLanguage] || textObj?.en || fallback;
    }
    
    const isActive = $derived(activeSection === section.id);
    
    const allItems = $derived([
        ...(section.items || []),
        ...(userTier === 'pro' && section.proItems ? section.proItems : [])
    ]);
    
    function handleSectionToggle(): void {
        onSectionToggle?.(isActive ? null : section.id);
    }
    
    function handleSettingChange(itemId: string, value: unknown): void {
        onSettingChange?.(itemId, value);
    }
    
    function handleAction(action: string): void {
        onAction?.(action);
    }
</script>

<div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
    <button 
        class="w-full flex py-4 items-center justify-between transition-colors duration-200 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
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
                class="w-5 h-5 text-gray-400 transition-transform duration-200 ease-out {isActive ? 'transform rotate-180' : ''}" 
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