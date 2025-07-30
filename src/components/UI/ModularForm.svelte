<!--
 * ModularForm.svelte
 * 
 * @description A modular form component that uses ModularInput iteratively
 * for dynamic form generation with validation, internationalization, and
 * modern UI patterns.
 * 
 * @param {Array} formConfig - Array of input configurations
 * @param {Object} formConfig[].config - ModularInput configuration object
 * @param {string} formConfig[].section - Section name for grouping (optional)
 * @param {string} formConfig[].sectionIcon - Section icon (optional)
 * @param {Object} formConfig[].sectionTitle - Localized section title (optional)
 * 
 * @param {string} currentLanguage - Current language code (en, de, etc.)
 * @param {Object} formData - Current form data object
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onCancel - Callback when form is cancelled (optional)
 * @param {Object} submitConfig - Submit button configuration (optional)
 * @param {Object} cancelConfig - Cancel button configuration (optional)
 * 
 * @example
 * <ModularForm 
 *   formConfig={[
 *     {
 *       section: 'personal',
 *       sectionIcon: '👤',
 *       sectionTitle: { en: 'Personal Information', de: 'Persönliche Informationen' },
 *       config: {
 *         id: 'name',
 *         type: 'text',
 *         icon: '👤',
 *         label: { en: 'Name', de: 'Name' },
 *         placeholder: { en: 'Enter your name', de: 'Name eingeben' },
 *         required: true,
 *         validation: { minLength: 2 }
 *       }
 *     },
 *     {
 *       config: {
 *         id: 'email',
 *         type: 'email',
 *         icon: '📧',
 *         label: { en: 'Email', de: 'E-Mail' },
 *         placeholder: { en: 'Enter your email', de: 'E-Mail eingeben' },
 *         required: true,
 *         validation: { pattern: 'email' }
 *       }
 *     }
 *   ]}
 *   currentLanguage="en"
 *   formData={{ name: 'John', email: 'john@example.com' }}
 *   onSubmit={(data) => handleSubmit(data)}
 *   submitConfig={{
 *     text: { en: 'Submit', de: 'Absenden' },
 *     icon: '✅'
 *   }}
 * />
 -->

<script>
    import { createEventDispatcher } from 'svelte';
    import ModularInput from './ModularInput.svelte';
    
    // Props
    export let formConfig = [];
    export let currentLanguage = 'en';
    export let formData = {};
    export let onSubmit;
    export let onCancel;
    export let submitConfig = {
        text: { en: 'Submit', de: 'Absenden' },
        icon: '✅',
        color: 'blue'
    };
    export let cancelConfig = {
        text: { en: 'Cancel', de: 'Abbrechen' },
        icon: '❌',
        color: 'gray'
    };
    
    // Event dispatcher for custom events
    const dispatch = createEventDispatcher();
    
    // Form state
    let isSubmitting = false;
    let validationErrors = {};
    let isValid = true;
    
    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[currentLanguage] || textObj?.en || fallback;
    }
    
    // Handle input value changes
    function handleInputChange(inputId, value) {
        formData = { ...formData, [inputId]: value };
        dispatch('change', { inputId, value, formData });
    }
    
    // Handle input validation
    function handleInputValidation(inputId, isValid, errors) {
        validationErrors = { ...validationErrors, [inputId]: errors };
        
        // Check if all inputs are valid
        const allValid = Object.values(validationErrors).every(errors => errors.length === 0);
        isValid = allValid;
        
        dispatch('validation', { inputId, isValid, errors, allValid });
    }
    
    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Validate all inputs
        const allErrors = Object.values(validationErrors).flat();
        if (allErrors.length > 0) {
            dispatch('error', { message: 'Please fix validation errors', errors: allErrors });
            return;
        }
        
        isSubmitting = true;
        
        try {
            await onSubmit?.(formData);
            dispatch('submit', { formData });
        } catch (error) {
            dispatch('error', { message: error.message, error });
        } finally {
            isSubmitting = false;
        }
    }
    
    // Handle form cancellation
    function handleCancel() {
        onCancel?.();
        dispatch('cancel');
    }
    
    // Group inputs by section
    $: groupedInputs = formConfig.reduce((groups, item) => {
        const section = item.section || 'default';
        if (!groups[section]) {
            groups[section] = {
                icon: item.sectionIcon,
                title: item.sectionTitle,
                inputs: []
            };
        }
        groups[section].inputs.push(item.config);
        return groups;
    }, {});
    
    // Get submit button color classes
    function getButtonColorClasses(color) {
        const colorMap = {
            blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
            green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
            red: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
            gray: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500',
            purple: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500',
            orange: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'
        };
        return colorMap[color] || colorMap.blue;
    }
</script>

<form on:submit={handleSubmit} class="space-y-6">
    <!-- Form Sections -->
    {#each Object.entries(groupedInputs) as [sectionKey, section]}
        <div class="space-y-4">
            <!-- Section Header -->
            {#if section.title && sectionKey !== 'default'}
                <div class="flex items-center space-x-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {#if section.icon}
                        <span class="text-xl">{section.icon}</span>
                    {/if}
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {getLocalizedText(section.title)}
                    </h3>
                </div>
            {/if}
            
            <!-- Section Inputs -->
            <div class="space-y-4">
                {#each section.inputs as inputConfig}
                    <ModularInput
                        config={inputConfig}
                        {currentLanguage}
                        currentValue={formData[inputConfig.id]}
                        onValueChange={(value) => handleInputChange(inputConfig.id, value)}
                        onValidation={(isValid, errors) => handleInputValidation(inputConfig.id, isValid, errors)}
                    />
                {/each}
            </div>
        </div>
    {/each}
    
    <!-- Form Actions -->
    <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <!-- Submit Button -->
        <button
            type="submit"
            disabled={isSubmitting || !isValid}
            class="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 {getButtonColorClasses(submitConfig.color)} disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {#if isSubmitting}
                <span class="animate-spin">⏳</span>
                <span>{getLocalizedText({ en: 'Submitting...', de: 'Wird gesendet...' })}</span>
            {:else}
                {#if submitConfig.icon}
                    <span>{submitConfig.icon}</span>
                {/if}
                <span>{getLocalizedText(submitConfig.text)}</span>
            {/if}
        </button>
        
        <!-- Cancel Button -->
        {#if onCancel || cancelConfig}
            <button
                type="button"
                on:click={handleCancel}
                class="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
                {#if cancelConfig.icon}
                    <span>{cancelConfig.icon}</span>
                {/if}
                <span>{getLocalizedText(cancelConfig.text)}</span>
            </button>
        {/if}
    </div>
</form> 