<!--
 * SettingsItem.svelte
 * 
 * @description A modular component for rendering different types of settings items
 * with support for internationalization, accessibility, and various input types.
 * 
 * @param {Object} item - The settings item configuration object
 * @param {string} item.id - Unique identifier for the setting
 * @param {string} item.type - Type of input: 'toggle', 'select', 'range', 'button'
 * @param {string} item.icon - Icon emoji for the setting
 * @param {Object} item.title - Localized title object {en: string, de: string}
 * @param {Object} item.description - Localized description object {en: string, de: string}
 * @param {any} item.defaultValue - Default value for the setting
 * @param {string} item.color - Color theme for toggle switches (optional)
 * @param {Array} item.options - Options for select inputs (optional)
 * @param {Object} item.labels - Min/max labels for range inputs (optional)
 * @param {number} item.min - Minimum value for range inputs (optional)
 * @param {number} item.max - Maximum value for range inputs (optional)
 * @param {string} item.buttonText - Text for button inputs (optional)
 * @param {string} item.action - Action identifier for button inputs (optional)
 * 
 * @param {string} currentLanguage - Current language code (en, de, etc.)
 * @param {any} currentValue - Current value of the setting
 * @param {Function} onValueChange - Callback function when value changes
 * @param {Function} onAction - Callback function for button actions (optional)
 * 
 * @example
 * <SettingsItem 
 *   item={settingConfig}
 *   currentLanguage="en"
 *   currentValue={true}
 *   onValueChange={(value) => updateSetting(settingConfig.id, value)}
 *   onAction={(action) => handleAction(action)}
 * />
 -->

<script>
    import { createEventDispatcher } from 'svelte';
    import ModularInput from './ModularInput.svelte';
    
    // Props
    export let item;
    export let currentLanguage = 'en';
    export let currentValue;
    export let onValueChange;
    export let onAction;
    
    // Event dispatcher for custom events
    const dispatch = createEventDispatcher();
    
    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[$currentLanguage] || textObj?.en || fallback;
    }
    

</script>

<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
    <ModularInput
        config={{
            id: item.id,
            type: item.type === 'toggle' ? 'toggle' : item.type === 'select' ? 'select' : item.type === 'range' ? 'range' : 'text',
            icon: item.icon,
            label: item.title,
            description: item.description,
            defaultValue: item.defaultValue,
            color: item.color,
            options: item.options,
            min: item.min,
            max: item.max,
            validation: item.validation,
            buttonText: item.buttonText
        }}
        {currentLanguage}
        {currentValue}
        onValueChange={onValueChange}
        onAction={onAction}
    />
</div>

 