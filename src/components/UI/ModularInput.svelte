<!--
 * ModularInput.svelte
 * 
 * @description A generic, reusable input component that supports multiple input types
 * with internationalization, accessibility, and modern UI patterns. Can be used
 * iteratively for forms, settings, and any data input scenarios.
 * 
 * @param {Object} config - Input configuration object
 * @param {string} config.id - Unique identifier for the input
 * @param {string} config.type - Input type: 'text', 'email', 'password', 'number', 'select', 'textarea', 'checkbox', 'radio', 'range', 'toggle', 'button'
 * @param {string} config.icon - Icon emoji for the input (optional)
 * @param {Object} config.label - Localized label object {en: string, de: string, etc.}
 * @param {Object} config.placeholder - Localized placeholder object (optional)
 * @param {Object} config.description - Localized description object (optional)
 * @param {any} config.defaultValue - Default value for the input
 * @param {boolean} config.required - Whether the input is required (default: false)
 * @param {boolean} config.disabled - Whether the input is disabled (default: false)
 * @param {string} config.color - Color theme for toggle/radio inputs (optional)
 * @param {Array} config.options - Options for select/radio inputs (optional)
 * @param {Object} config.validation - Validation rules (optional)
 * @param {number} config.min - Minimum value for number/range inputs (optional)
 * @param {number} config.max - Maximum value for number/range inputs (optional)
 * @param {number} config.step - Step value for number/range inputs (optional)
 * @param {number} config.rows - Number of rows for textarea (optional)
 * @param {number} config.cols - Number of columns for textarea (optional)
 * @param {number} config.maxLength - Maximum length for text inputs (optional)
 * @param {Object} config.buttonText - Localized button text for button type (optional)
 * @param {string} config.action - Action identifier for button type (optional)
 * 
 * @param {string} currentLanguage - Current language code (en, de, etc.)
 * @param {any} currentValue - Current value of the input
 * @param {Function} onValueChange - Callback when value changes
 * @param {Function} onValidation - Callback for validation events (optional)
 * @param {Function} onAction - Callback for button actions (optional)
 * 
 * @example
 * <ModularInput 
 *   config={{
 *     id: 'email',
 *     type: 'email',
 *     icon: '📧',
 *     label: { en: 'Email', de: 'E-Mail' },
 *     placeholder: { en: 'Enter your email', de: 'E-Mail eingeben' },
 *     required: true,
 *     validation: { pattern: 'email' }
 *   }}
 *   currentLanguage="en"
 *   currentValue="user@example.com"
 *   onValueChange={(value) => updateEmail(value)}
 *   onValidation={(isValid, errors) => handleValidation(isValid, errors)}
 * />
 -->

<script>
    import { createEventDispatcher } from 'svelte';
    import { showSuccess, showError, showInfo } from '../../stores/modalStore.js';
    
    // Props
    export let config;
    export let currentLanguage = 'en';
    export let currentValue;
    export let onValueChange;
    export let onValidation;
    export let onAction;
    
    // Event dispatcher for custom events
    const dispatch = createEventDispatcher();
    
    // Validation state
    let isValid = true;
    let validationErrors = [];
    
    // Helper function to get localized text
    function getLocalizedText(textObj, fallback = '') {
        return textObj?.[currentLanguage] || textObj?.en || fallback;
    }
    
    // Validation patterns
    const VALIDATION_PATTERNS = {
        email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        url: /^https?:\/\/.+/i,
        phone: /^[\+]?[1-9][\d]{0,15}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    };
    
    // Validation functions
    function validateInput(value) {
        if (!config.validation) return { isValid: true, errors: [] };
        
        const errors = [];
        
        // Required validation
        if (config.required && (!value || value.toString().trim() === '')) {
            errors.push(getLocalizedText({ en: 'This field is required', de: 'Dieses Feld ist erforderlich' }));
        }
        
        // Pattern validation
        if (value && config.validation.pattern && VALIDATION_PATTERNS[config.validation.pattern]) {
            if (!VALIDATION_PATTERNS[config.validation.pattern].test(value)) {
                const patternMessages = {
                    email: { en: 'Please enter a valid email address', de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' },
                    url: { en: 'Please enter a valid URL', de: 'Bitte geben Sie eine gültige URL ein' },
                    phone: { en: 'Please enter a valid phone number', de: 'Bitte geben Sie eine gültige Telefonnummer ein' },
                    password: { en: 'Password must be at least 8 characters with uppercase, lowercase, and number', de: 'Passwort muss mindestens 8 Zeichen mit Groß-, Kleinbuchstaben und Zahl enthalten' }
                };
                errors.push(getLocalizedText(patternMessages[config.validation.pattern]));
            }
        }
        
        // Min/Max validation
        if (value && config.validation.min && value < config.validation.min) {
            errors.push(getLocalizedText({ en: `Minimum value is ${config.validation.min}`, de: `Mindestwert ist ${config.validation.min}` }));
        }
        
        if (value && config.validation.max && value > config.validation.max) {
            errors.push(getLocalizedText({ en: `Maximum value is ${config.validation.max}`, de: `Maximalwert ist ${config.validation.max}` }));
        }
        
        // Length validation
        if (value && config.validation.minLength && value.toString().length < config.validation.minLength) {
            errors.push(getLocalizedText({ en: `Minimum length is ${config.validation.minLength} characters`, de: `Mindestlänge ist ${config.validation.minLength} Zeichen` }));
        }
        
        if (value && config.validation.maxLength && value.toString().length > config.validation.maxLength) {
            errors.push(getLocalizedText({ en: `Maximum length is ${config.validation.maxLength} characters`, de: `Maximallänge ist ${config.validation.maxLength} Zeichen` }));
        }
        
        const isValid = errors.length === 0;
        return { isValid, errors };
    }
    
    // Handle value changes
    function handleValueChange(event) {
        let value;
        
        switch (config.type) {
            case 'checkbox':
                value = event.target.checked;
                break;
            case 'number':
            case 'range':
                value = parseFloat(event.target.value);
                break;
            default:
                value = event.target.value;
        }
        
        // Validate the new value
        const validation = validateInput(value);
        isValid = validation.isValid;
        validationErrors = validation.errors;
        
        // Call callbacks
        onValueChange?.(value);
        onValidation?.(isValid, validationErrors);
        
        // Dispatch events
        dispatch('change', { value, isValid, errors: validationErrors });
        dispatch('validation', { isValid, errors: validationErrors });
    }
    
    // Handle button actions
    function handleButtonAction() {
        if (config.action) {
            onAction?.(config.action);
            dispatch('action', { action: config.action });
        }
    }
    
    // Handle range input changes
    function handleRangeChange(event) {
        const value = parseInt(event.target.value);
        handleValueChange({ target: { value } });
    }
    
    // Get toggle switch color classes
    function getToggleColorClasses(color) {
        const colorMap = {
            green: 'peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:bg-green-500 dark:peer-checked:bg-green-600',
            blue: 'peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600',
            purple: 'peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:bg-purple-500 dark:peer-checked:bg-purple-600',
            orange: 'peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:bg-orange-500 dark:peer-checked:bg-orange-600',
            red: 'peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:bg-red-500 dark:peer-checked:bg-red-600',
            indigo: 'peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:bg-indigo-500 dark:peer-checked:bg-indigo-600',
            yellow: 'peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:bg-yellow-500 dark:peer-checked:bg-yellow-600',
            teal: 'peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:bg-teal-500 dark:peer-checked:bg-teal-600',
            pink: 'peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 peer-checked:bg-pink-500 dark:peer-checked:bg-pink-600',
            cyan: 'peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 peer-checked:bg-cyan-500 dark:peer-checked:bg-cyan-600',
            emerald: 'peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 peer-checked:bg-emerald-500 dark:peer-checked:bg-emerald-600',
            violet: 'peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 peer-checked:bg-violet-500 dark:peer-checked:bg-violet-600',
            rose: 'peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 peer-checked:bg-rose-500 dark:peer-checked:bg-rose-600',
            sky: 'peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 peer-checked:bg-sky-500 dark:peer-checked:bg-sky-600',
            slate: 'peer-focus:ring-slate-300 dark:peer-focus:ring-slate-800 peer-checked:bg-slate-500 dark:peer-checked:bg-slate-600',
            amber: 'peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 peer-checked:bg-amber-500 dark:peer-checked:bg-amber-600',
            lime: 'peer-focus:ring-lime-300 dark:peer-focus:ring-lime-800 peer-checked:bg-lime-500 dark:peer-checked:bg-lime-600'
        };
        return colorMap[color] || colorMap.blue;
    }
    
    // Get input classes based on validation state
    function getInputClasses() {
        const baseClasses = 'contact-input';
        const stateClasses = isValid 
            ? '' 
            : 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100';
        return `${baseClasses} ${stateClasses}`;
    }
    
    // Initialize validation on mount
    $: if (currentValue !== undefined) {
        const validation = validateInput(currentValue);
        isValid = validation.isValid;
        validationErrors = validation.errors;
    }
</script>

<div class="space-y-3">
    <!-- Label and Icon -->
    <div class="flex items-center space-x-2">
        {#if config.icon}
            <span class="text-lg">{config.icon}</span>
        {/if}
        <label for={config.id} class="text-sm font-semibold text-gray-900 dark:text-white">
            {getLocalizedText(config.label)}
            {#if config.required}
                <span class="text-red-500 ml-1">*</span>
            {/if}
        </label>
    </div>

    <!-- Description -->
    {#if config.description}
        <p class="sr-only">
            {getLocalizedText(config.description)}
        </p>
    {/if}

    <!-- Input Field -->
    <div class="relative">
        {#if config.type === 'button'}
            <!-- Button Input -->
            <button
                id={config.id}
                type="button"
                on:click={handleButtonAction}
                disabled={config.disabled}
                class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {getLocalizedText(config.buttonText || config.label)}
            </button>
        {:else if config.type === 'select'}
            <!-- Select Input -->
            <select
                id={config.id}
                bind:value={currentValue}
                on:change={handleValueChange}
                disabled={config.disabled}
                class={`${getInputClasses()} ${config.class}`}
            >
                {#each config.options || [] as option}
                    <option value={option.value}>
                        {getLocalizedText(option.label)}
                    </option>
                {/each}
            </select>
        {:else if config.type === 'textarea'}
            <!-- Textarea Input -->
            <textarea
                id={config.id}
                bind:value={currentValue}
                on:input={handleValueChange}
                placeholder={getLocalizedText(config.placeholder)}
                disabled={config.disabled}
                rows={config.rows || 4}
                cols={config.cols}
                maxlength={config.maxLength}
                class={`${getInputClasses()} ${config.class}`}
            ></textarea>
        {:else if config.type === 'checkbox'}
            <!-- Checkbox Input -->
            <div class="flex items-center space-x-3">
                <input
                    id={config.id}
                    type="checkbox"
                    bind:checked={currentValue}
                    on:change={handleValueChange}
                    disabled={config.disabled}
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label for={config.id} class="text-sm text-gray-900 dark:text-white">
                    {getLocalizedText(config.label)}
                </label>
            </div>
        {:else if config.type === 'radio'}
            <!-- Radio Input -->
            <div class="space-y-2">
                {#each config.options || [] as option}
                    <div class="flex items-center space-x-3">
                        <input
                            id="{config.id}_{option.value}"
                            type="radio"
                            name={config.id}
                            value={option.value}
                            bind:group={currentValue}
                            on:change={handleValueChange}
                            disabled={config.disabled}
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label for="{config.id}_{option.value}" class="text-sm text-gray-900 dark:text-white">
                            {getLocalizedText(option.label)}
                        </label>
                    </div>
                {/each}
            </div>
        {:else if config.type === 'range'}
            <!-- Range Input -->
            <div class="space-y-2">
                <input
                    id={config.id}
                    type="range"
                    bind:value={currentValue}
                    on:input={handleRangeChange}
                    min={config.min || 0}
                    max={config.max || 100}
                    step={config.step || 1}
                    disabled={config.disabled}
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{config.min || 0}</span>
                    <span class="font-medium">{currentValue}</span>
                    <span>{config.max || 100}</span>
                </div>
            </div>
        {:else if config.type === 'toggle'}
            <!-- Modern Toggle Input -->
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {getLocalizedText(config.label)}
                    </span>
                    {#if config.description}
                        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {getLocalizedText(config.description)}
                        </p>
                    {/if}
                </div>
                
                <label
                    for={config.id}
                    class="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-300 {currentValue ? 'bg-yellow-500' : 'bg-gray-light dark:bg-aubergine-900'}"
                >
                    <input 
                        type="checkbox" 
                        id={config.id}
                        class="sr-only" 
                        bind:checked={currentValue}
                        on:change={handleValueChange}
                        disabled={config.disabled}
                    />

                    <span
                        class="absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-500 transition-all duration-300 ease-in-out dark:bg-aubergine-800 dark:text-creme-500 transform {currentValue ? 'translate-x-5' : 'translate-x-0'}"
                    >
                        <!-- X Icon (unchecked) -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-4 h-4 transition-opacity duration-300 {currentValue ? 'opacity-0' : 'opacity-100'}"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                        <!-- Check Icon (checked) -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            style="top:2px;"
                            class="w-4 h-4 mx-auto absolute inset-0 transition-opacity duration-300 {currentValue ? 'opacity-100' : 'opacity-0'}"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </span>
                </label>
            </div>
        {:else}
            <!-- Standard Input (text, email, password, number, url, phone) -->
            {#if config.type === 'email'}
                <input
                    id={config.id}
                    type="email"
                    bind:value={currentValue}
                    on:input={handleValueChange}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    maxlength={config.maxLength}
                    class={`${getInputClasses()} ${config.class}`}
                />
            {:else if config.type === 'password'}
                <input
                    id={config.id}
                    type="password"
                    bind:value={currentValue}
                    on:input={handleValueChange}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    maxlength={config.maxLength}
                    class={`${getInputClasses()} ${config.class}`}
                />
            {:else if config.type === 'number'}
                <input
                    id={config.id}
                    type="number"
                    bind:value={currentValue}
                    on:input={handleValueChange}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    class={`${getInputClasses()} ${config.class}`}
                />
            {:else}
                <input
                    id={config.id}
                    type="text"
                    bind:value={currentValue}
                    on:input={handleValueChange}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    maxlength={config.maxLength}
                    class={`${getInputClasses()} ${config.class}`}
                />
            {/if}
        {/if}
    </div>

    <!-- Validation Errors -->
    {#if !isValid && validationErrors.length > 0}
        <div class="space-y-1">
            {#each validationErrors as error}
                <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
            {/each}
        </div>
    {/if}

    <!-- Validation Success -->
    {#if isValid && currentValue && config.validation}
        <p class="text-sm text-green-600 dark:text-green-400">
            ✓ {getLocalizedText({ en: 'Valid input', de: 'Gültige Eingabe' })}
        </p>
    {/if}
</div>

<style>
    /* Custom slider styling */
    .slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
</style> 