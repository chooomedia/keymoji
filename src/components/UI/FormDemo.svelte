<!--
 * FormDemo.svelte
 * 
 * @description Demo component showcasing the iterative use of ModularForm
 * and ModularInput components with different form configurations.
 * 
 * @example
 * <FormDemo />
 -->

<script>
    import { onMount } from 'svelte';
    import ModularForm from './ModularForm.svelte';
    import { loadContent } from '../../utils/contentLoader.js';
    
    // State
    let formExamples = {};
    let currentForm = 'contactForm';
    let formData = {};
    let isSubmitting = false;
    
    // Load form examples
    async function loadFormExamples() {
        try {
            formExamples = await loadContent('formExamples.json');
        } catch (error) {
            console.error('Failed to load form examples:', error);
        }
    }
    
    // Handle form submission
    async function handleFormSubmit(data) {
        isSubmitting = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Form submitted:', data);
        alert(`Form submitted successfully!\nData: ${JSON.stringify(data, null, 2)}`);
        
        isSubmitting = false;
    }
    
    // Handle form cancellation
    function handleFormCancel() {
        formData = {};
        console.log('Form cancelled');
    }
    
    // Handle form change
    function handleFormChange(event) {
        const { formData: newFormData } = event.detail;
        formData = newFormData;
        console.log('Form data changed:', formData);
    }
    
    // Handle form validation
    function handleFormValidation(event) {
        const { allValid, errors } = event.detail;
        console.log('Form validation:', { allValid, errors });
    }
    
    // Get current form configuration
    $: currentFormConfig = formExamples[currentForm];
    $: currentFormData = formData;
    
    onMount(() => {
        loadFormExamples();
    });
</script>

<div class="max-w-4xl mx-auto p-6 space-y-8">
    <!-- Header -->
    <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Modular Form Demo
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
            Demonstrating iterative use of ModularInput and ModularForm components
        </p>
    </div>
    
    <!-- Form Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📋 Select Form Type
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
                class="p-4 border-2 rounded-lg transition-all duration-200 {currentForm === 'contactForm' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'}"
                on:click={() => currentForm = 'contactForm'}
            >
                <div class="text-center">
                    <div class="text-2xl mb-2">📞</div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Contact Form</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Get in touch with us</p>
                </div>
            </button>
            
            <button
                class="p-4 border-2 rounded-lg transition-all duration-200 {currentForm === 'settingsForm' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'}"
                on:click={() => currentForm = 'settingsForm'}
            >
                <div class="text-center">
                    <div class="text-2xl mb-2">⚙️</div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Settings Form</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Customize your preferences</p>
                </div>
            </button>
        </div>
    </div>
    
    <!-- Form Display -->
    {#if currentFormConfig}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentFormConfig.title?.en || 'Form'}
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                    {currentFormConfig.description?.en || 'Form description'}
                </p>
            </div>
            
            <ModularForm
                formConfig={currentFormConfig.config}
                currentLanguage="en"
                {formData}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                submitConfig={currentFormConfig.submitConfig}
                cancelConfig={currentFormConfig.cancelConfig}
                on:change={handleFormChange}
                on:validation={handleFormValidation}
            />
        </div>
    {/if}
    
    <!-- Form Data Display -->
    {#if Object.keys(formData).length > 0}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Form Data (Live Preview)
            </h3>
            <pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify(formData, null, 2)}
            </pre>
        </div>
    {/if}
    
    <!-- Features Showcase -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div class="text-3xl mb-4">🎯</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Modular Design
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
                Reusable components that can be configured for any input type
            </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div class="text-3xl mb-4">🌐</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Internationalization
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
                Full i18n support with localized labels, placeholders, and messages
            </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div class="text-3xl mb-4">✅</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Validation
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
                Built-in validation with custom rules and error messages
            </p>
        </div>
    </div>
    
    <!-- Input Types Showcase -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🎨 Supported Input Types
        </h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">📝</div>
                <div class="font-medium">Text</div>
                <div class="text-sm text-gray-500">Basic text input</div>
            </div>
            
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">📧</div>
                <div class="font-medium">Email</div>
                <div class="text-sm text-gray-500">Email validation</div>
            </div>
            
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">📋</div>
                <div class="font-medium">Select</div>
                <div class="text-sm text-gray-500">Dropdown options</div>
            </div>
            
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">🔘</div>
                <div class="font-medium">Toggle</div>
                <div class="text-sm text-gray-500">Switch input</div>
            </div>
            
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">📊</div>
                <div class="font-medium">Range</div>
                <div class="text-sm text-gray-500">Slider input</div>
            </div>
            
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">📄</div>
                <div class="font-medium">Textarea</div>
                <div class="text-sm text-gray-500">Multi-line text</div>
            </div>
            
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">🔢</div>
                <div class="font-medium">Number</div>
                <div class="text-sm text-gray-500">Numeric input</div>
            </div>
            
            <div class="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="text-2xl mb-2">🔒</div>
                <div class="font-medium">Password</div>
                <div class="text-sm text-gray-500">Secure input</div>
            </div>
        </div>
    </div>
</div> 