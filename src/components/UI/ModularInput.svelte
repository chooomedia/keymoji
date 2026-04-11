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
    import { showSuccess, showError, showInfo } from '../../stores/modalStore';
    import Toggle from './Toggle.svelte';
    
    // Props
    export let config;
    export let currentLanguage = 'en';
    export let currentValue;
    export let onValueChange;
    export let onValidation;
    export let onAction;
    
    // Local state for input value - prevents focus loss during re-renders
    let localValue = currentValue;
    let isFocused = false;
    let lastUserInput = null; // Track the last value the user typed
    
    // Update local value when currentValue prop changes from outside
    // CRITICAL: Only update if:
    // 1. Value actually changed
    // 2. User is not currently focused (not typing)
    // 3. For text inputs: currentValue matches what user typed (prevents reset)
    $: if (currentValue !== localValue && !isFocused) {
        // For select/checkbox/range: always update immediately
        if (config.type === 'select' || config.type === 'checkbox' || config.type === 'range') {
            localValue = currentValue;
        } else {
            // For text inputs: only update if currentValue matches what user typed
            // OR if lastUserInput is null (initial load)
            // This prevents reset when user clicks away after typing
            if (lastUserInput === null) {
                // Initial load - update from prop
                localValue = currentValue;
            } else if (currentValue === lastUserInput) {
                // currentValue matches what user typed - keep localValue (don't reset!)
                // This is the key: if parent sends back what user typed, don't change it
            } else {
                // currentValue is different from what user typed (external change)
                // Only update if it's truly different
                localValue = currentValue;
                lastUserInput = currentValue; // Update tracking
            }
        }
    }
    
    // Track focus state to prevent updates during typing
    function handleFocus() {
        isFocused = true;
    }
    
    function handleBlur() {
        isFocused = false;
        // Remember what user typed - this prevents reset on blur
        lastUserInput = localValue;
    }
    
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
    
    // Handle value changes - Controlled Component Pattern
    function handleValueChange(event) {
        let value;
        
        // Handle custom toggle events
        if (event.detail && typeof event.detail.checked === 'boolean') {
            value = event.detail.checked;
        } else {
            // Handle regular input events
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
        }
        
        // Validate the new value
        const validation = validateInput(value);
        isValid = validation.isValid;
        validationErrors = validation.errors;
        
        // Update local value immediately for responsive UI (prevents focus loss)
        localValue = value;
        lastUserInput = value; // Remember what user typed - prevents reset on blur
        
        // IMPORTANT: Notify parent AFTER updating local state
        // This allows parent to control the value (Controlled Component Pattern)
        if (onValueChange) {
            onValueChange(value);
        }
        
        // Call validation callback
        if (onValidation) {
            onValidation(isValid, validationErrors);
        }
        
        // Dispatch events for additional listeners
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
        const value = parseFloat(event.target.value); // Use parseFloat for decimal step values
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
        const baseClasses = 'w-full bg-white dark:bg-aubergine-900 dark:text-white rounded-xl border transition-all duration-200 placeholder-gray-light dark:placeholder-gray-light p-4';
        
        if (config.disabled) {
            return `${baseClasses} opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600`;
        }
        
        if (!isValid && validationErrors.length > 0) {
            return `${baseClasses} border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 focus:ring-1 focus:ring-red-500 focus:border-red-500`;
        }
        
        if (isValid && localValue && config.validation) {
            return `${baseClasses} border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 focus:ring-1 focus:ring-green-500 focus:border-green-500`;
        }
        
        return `${baseClasses} border-gray-light dark:border-aubergine-700 focus:ring-1 focus:ring-yellow-50 focus:border-transparent`;
    }
    
    // Initialize validation on mount
    $: if (currentValue !== undefined) {
        const validation = validateInput(currentValue);
        isValid = validation.isValid;
        validationErrors = validation.errors;
    }

    // Get appropriate autocomplete value based on type and name
    function getAutocompleteValue() {
        if (config.autocomplete) return config.autocomplete;
        
        // Only add autocomplete for relevant input types
        const relevantTypes = ['text', 'email', 'password', 'tel', 'url', 'search'];
        if (!relevantTypes.includes(config.type)) return '';
        
        // Auto-detect based on type and name
        switch (config.type) {
            case 'email':
                return 'email';
            case 'password':
                return 'current-password';
            default:
                const name = config.id?.toLowerCase() || '';
                if (name.includes('email')) return 'email';
                if (name.includes('name') || name.includes('fullname')) return 'name';
                if (name.includes('given') || name.includes('first')) return 'given-name';
                if (name.includes('family') || name.includes('last')) return 'family-name';
                if (name.includes('phone') || name.includes('tel')) return 'tel';
                if (name.includes('url') || name.includes('website')) return 'url';
                if (name.includes('organization') || name.includes('company')) return 'organization';
                if (name.includes('street') || name.includes('address')) return 'street-address';
                if (name.includes('city')) return 'address-level2';
                if (name.includes('state') || name.includes('province')) return 'address-level1';
                if (name.includes('zip') || name.includes('postal')) return 'postal-code';
                if (name.includes('country')) return 'country';
                if (name.includes('username') || name.includes('user')) return 'username';
                if (name.includes('new-password')) return 'new-password';
                if (name.includes('current-password')) return 'current-password';
                if (name.includes('search')) return 'search';
                return '';
        }
    }
</script>

<div class="space-y-3">
    <!-- Label and Icon — für toggle nicht nötig, da Toggle-Body Label+Description selbst rendert -->
    {#if config.type !== 'toggle'}
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

        <!-- Description (sr-only für alle nicht-toggle Typen) -->
        {#if config.description}
            <p class="sr-only">
                {getLocalizedText(config.description)}
            </p>
        {/if}
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
                value={localValue}
                on:change={handleValueChange}
                on:focus={handleFocus}
                on:blur={handleBlur}
                disabled={config.disabled}
                class={`${getInputClasses()} ${config.class} appearance-none bg-no-repeat pr-12`}
                style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 20 20\' fill=\'none\' stroke=\'%23666\' stroke-width=\'2\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 8l4 4 4-4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E'); background-position: right 1rem center; background-size: 1.25rem;"
                aria-invalid={!isValid && validationErrors.length > 0}
                aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                autocomplete={getAutocompleteValue()}
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
                value={localValue}
                on:input={handleValueChange}
                on:focus={handleFocus}
                on:blur={handleBlur}
                placeholder={getLocalizedText(config.placeholder)}
                disabled={config.disabled}
                rows={config.rows || 4}
                cols={config.cols}
                maxlength={config.maxLength}
                class={`${getInputClasses()} ${config.class}`}
                aria-invalid={!isValid && validationErrors.length > 0}
                aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                autocomplete={getAutocompleteValue()}
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
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-invalid={!isValid && validationErrors.length > 0}
                    aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
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
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                        />
                        <label for="{config.id}_{option.value}" class="text-sm text-gray-900 dark:text-white">
                            {getLocalizedText(option.label)}
                        </label>
                    </div>
                {/each}
            </div>
        {:else if config.type === 'range'}
            <!-- Range Input mit Primary-Color Fill + Thumb -->
            {@const rMin = config.min ?? 0}
            {@const rMax = config.max ?? 100}
            {@const rVal = typeof localValue === 'number' ? localValue : parseFloat(localValue) || rMin}
            {@const rPct = Math.round(((rVal - rMin) / (rMax - rMin)) * 100)}
            <div class="flex items-center gap-3">
                <input
                    id={config.id}
                    type="range"
                    bind:value={localValue}
                    on:input={handleRangeChange}
                    min={rMin}
                    max={rMax}
                    step={config.step || 1}
                    disabled={config.disabled}
                    class="modular-range flex-1 h-2 appearance-none rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style="background: linear-gradient(to right, #eab308 0%, #eab308 {rPct}%, #d1d5db {rPct}%, #d1d5db 100%);"
                    aria-invalid={!isValid && validationErrors.length > 0}
                    aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                />
                <span class="text-sm font-bold text-yellow-500 dark:text-yellow-400 w-8 text-right tabular-nums shrink-0">
                    {typeof rVal === 'number' && config.step && config.step < 1 ? rVal.toFixed(1) : Math.round(rVal)}
                </span>
            </div>
        {:else if config.type === 'toggle'}
            <!-- Modern Toggle Input — Label + Description hier, kein doppelter Header -->
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <label
                        for={config.id}
                        id="{config.id}-label"
                        class="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white {config.comingSoon ? 'cursor-default' : 'cursor-pointer'}"
                    >
                        {#if config.icon}
                            <span class="text-lg leading-none">{config.icon}</span>
                        {/if}
                        {getLocalizedText(config.label)}
                    </label>
                    {#if config.description}
                        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 {config.icon ? 'pl-7' : ''}">
                            {getLocalizedText(config.description)}
                        </p>
                    {/if}
                </div>

                {#if config.comingSoon}
                    <!-- Badge statt Toggle wenn Feature noch nicht verfügbar -->
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 shrink-0 ml-4">
                        {getLocalizedText(config.comingSoonLabel) || 'Coming soon'}
                    </span>
                {:else}
                    <Toggle
                        id={config.id}
                        bind:checked={currentValue}
                        disabled={config.disabled}
                        color={config.color || 'yellow'}
                        on:change={handleValueChange}
                    />
                {/if}
            </div>
        {:else}
            <!-- Standard Input (text, email, password, number, url, phone) -->
            {#if config.type === 'email'}
                <input
                    id={config.id}
                    type="email"
                    value={localValue}
                    on:input={handleValueChange}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    maxlength={config.maxLength}
                    class={`${getInputClasses()} ${config.class}`}
                    aria-invalid={!isValid && validationErrors.length > 0}
                    aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                    autocomplete={getAutocompleteValue()}
                />
            {:else if config.type === 'password'}
                <input
                    id={config.id}
                    type="password"
                    value={localValue}
                    on:input={handleValueChange}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    maxlength={config.maxLength}
                    class={`${getInputClasses()} ${config.class}`}
                    aria-invalid={!isValid && validationErrors.length > 0}
                    aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                    autocomplete={getAutocompleteValue()}
                />
            {:else if config.type === 'number'}
                <input
                    id={config.id}
                    type="number"
                    value={localValue}
                    on:input={handleValueChange}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    class={`${getInputClasses()} ${config.class}`}
                    aria-invalid={!isValid && validationErrors.length > 0}
                    aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                    autocomplete={getAutocompleteValue()}
                />
            {:else}
                <input
                    id={config.id}
                    type="text"
                    value={localValue}
                    on:input={handleValueChange}
                    on:focus={handleFocus}
                    on:blur={handleBlur}
                    placeholder={getLocalizedText(config.placeholder)}
                    disabled={config.disabled}
                    required={config.required}
                    maxlength={config.maxLength}
                    class={`${getInputClasses()} ${config.class}`}
                    aria-invalid={!isValid && validationErrors.length > 0}
                    aria-describedby={!isValid && validationErrors.length > 0 ? `${config.id}-error` : isValid && localValue && config.validation ? `${config.id}-success` : undefined}
                    autocomplete={getAutocompleteValue()}
                />
            {/if}
        {/if}
    </div>

    <!-- Validation Errors -->
    {#if !isValid && validationErrors.length > 0}
        <div id={`${config.id}-error`} class="text-sm text-red-600 dark:text-red-400">
            {#each validationErrors as error}
                <p>{error}</p>
            {/each}
        </div>
    {/if}

    <!-- Validation Success -->
    {#if isValid && localValue && config.validation}
        <div id={`${config.id}-success`} class="text-sm text-green-600 dark:text-green-400">
            ✓ {getLocalizedText({ en: 'Valid input', de: 'Gültige Eingabe' })}
        </div>
    {/if}
</div>

<style>
    /* Range Thumb — Primary Yellow */
    .modular-range::-webkit-slider-thumb {
        appearance: none;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: #eab308;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .modular-range::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 2px 8px rgba(234, 179, 8, 0.5);
    }
    .modular-range::-moz-range-thumb {
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: #eab308;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    }
    /* Firefox: active track color via range-progress */
    .modular-range::-moz-range-progress {
        background: #eab308;
        border-radius: 999px;
        height: 8px;
    }
    .modular-range::-moz-range-track {
        background: #d1d5db;
        border-radius: 999px;
        height: 8px;
    }
    
    /* Dark mode select arrow for ModularInput */
    :global(.dark) select {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' stroke='%23fff' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
        background-position: right 1rem center !important;
        background-size: 1.25rem !important;
    }
</style> 