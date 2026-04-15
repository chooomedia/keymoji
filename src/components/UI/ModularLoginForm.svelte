<!--
 * ModularLoginForm.svelte
 * 
 * @description A modular login form component using the new ModularInput system
 * with OTP authentication, validation, and modern UI patterns.
 * 
 * @param {string} currentLanguage - Current language code (en, de, etc.)
 * @param {boolean} isSubmitting - Whether the form is currently submitting
 * @param {Function} onLogin - Callback when login is attempted
 * @param {Function} onCancel - Callback when login is cancelled (optional)
 * 
 * @example
 * <ModularLoginForm 
 *   currentLanguage="en"
 *   isSubmitting={false}
 *   onLogin={(data) => handleLogin(data)}
 *   onCancel={() => navigateBack()}
 * />
 -->

<script>
    import { createEventDispatcher } from 'svelte';
    import ModularInput from './ModularInput.svelte';
    import ModularForm from './ModularForm.svelte';
    
    // Props
    export let currentLanguage = 'en';
    export let isSubmitting = false;
    export let onLogin;
    export let onCancel;
    
    // Event dispatcher for custom events
    const dispatch = createEventDispatcher();
    
    // Form data
    let formData = {
        email: '',
        name: ''
    };
    
    // Form configuration
    const loginFormConfig = [
        {
            config: {
                id: 'email',
                type: 'email',
                icon: '📧',
                label: { 
                    en: 'Email Address', 
                    de: 'E-Mail-Adresse' 
                },
                placeholder: { 
                    en: 'Enter your email address', 
                    de: 'E-Mail-Adresse eingeben' 
                },
                description: { 
                    en: 'We\'ll send you a OTP to sign in', 
                    de: 'Wir senden Ihnen einen OTP zum Anmelden' 
                },
                required: true,
                validation: { pattern: 'email' }
            }
        },
        {
            config: {
                id: 'name',
                type: 'text',
                icon: '👤',
                label: { 
                    en: 'Name (Optional)', 
                    de: 'Name (Optional)' 
                },
                placeholder: { 
                    en: 'Enter your name or leave empty', 
                    de: 'Name eingeben oder leer lassen' 
                },
                description: { 
                    en: 'Your display name (will generate one if empty)', 
                    de: 'Ihr Anzeigename (wird generiert wenn leer)' 
                },
                validation: { minLength: 2, maxLength: 50 }
            }
        }
    ];
    
    // Submit configuration
    const submitConfig = {
        text: { 
            en: 'Send OTP', 
            de: 'OTP senden' 
        },
        icon: '🔗',
        color: 'blue'
    };
    
    // Cancel configuration
    const cancelConfig = {
        text: { 
            en: 'Cancel', 
            de: 'Abbrechen' 
        },
        icon: '❌',
        color: 'gray'
    };
    
    // Handle form submission
    async function handleSubmit(data) {
        try {
            await onLogin?.(data);
            dispatch('submit', { data });
        } catch (error) {
            dispatch('error', { error });
        }
    }
    
    // Handle form cancellation
    function handleCancel() {
        onCancel?.();
        dispatch('cancel');
    }
    
    // Handle form data changes
    function handleFormChange(event) {
        const { formData: newFormData } = event.detail;
        formData = newFormData;
        dispatch('change', { formData });
    }
    
    // Handle validation
    function handleValidation(event) {
        const { allValid, errors } = event.detail;
        dispatch('validation', { allValid, errors });
    }
</script>

<div class="max-w-md mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <!-- Header -->
        <div class="text-center mb-6">
            <div class="text-4xl mb-4">🔐</div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLanguage === 'de' ? 'Anmelden' : 'Sign In'}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
                {currentLanguage === 'de' 
                    ? 'Erhalten Sie einen OTP per E-Mail' 
                    : 'Get a OTP sent to your email'
                }
            </p>
        </div>
        
        <!-- Login Form -->
        <ModularForm
            formConfig={loginFormConfig}
            {currentLanguage}
            {formData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            {submitConfig}
            {cancelConfig}
            on:change={handleFormChange}
            on:validation={handleValidation}
        />
        
        <!-- Additional Info -->
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">
                {currentLanguage === 'de' 
                    ? '🔒 Ihre Daten sind sicher und werden nicht gespeichert' 
                    : '🔒 Your data is secure and will not be stored'
                }
            </p>
        </div>
    </div>
</div> 