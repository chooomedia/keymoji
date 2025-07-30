<!--
 * AdvancedDemo.svelte
 * 
 * @description Advanced demo component showcasing all modular input features
 * with live examples, code snippets, and interactive demonstrations.
 -->

<script>
    import { onMount } from 'svelte';
    import ModularInput from './ModularInput.svelte';
    import ModularForm from './ModularForm.svelte';
    import { loadContent } from '../../utils/contentLoader.js';
    
    // State
    let formExamples = {};
    let currentDemo = 'inputTypes';
    let demoData = {};
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Demo form submitted:', data);
        alert(`Demo form submitted!\nData: ${JSON.stringify(data, null, 2)}`);
        isSubmitting = false;
    }
    
    // Handle individual input changes
    function handleInputChange(inputId, value) {
        demoData = { ...demoData, [inputId]: value };
        console.log('Input changed:', inputId, value);
    }
    
    // Handle validation
    function handleValidation(inputId, isValid, errors) {
        console.log('Validation:', inputId, isValid, errors);
    }
    
    onMount(() => {
        loadFormExamples();
    });
</script>

<div class="max-w-6xl mx-auto p-6 space-y-8">
    <!-- Header -->
    <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Advanced Modular Input Demo
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Showcasing the complete modular input system with live examples
        </p>
    </div>
    
    <!-- Demo Navigation -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Select Demo Type
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
                class="p-4 border-2 rounded-lg transition-all duration-200 {currentDemo === 'inputTypes' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'}"
                on:click={() => currentDemo = 'inputTypes'}
            >
                <div class="text-center">
                    <div class="text-2xl mb-2">🎨</div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Input Types</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">All supported input types</p>
                </div>
            </button>
            
            <button
                class="p-4 border-2 rounded-lg transition-all duration-200 {currentDemo === 'validation' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'}"
                on:click={() => currentDemo = 'validation'}
            >
                <div class="text-center">
                    <div class="text-2xl mb-2">✅</div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Validation</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Built-in validation examples</p>
                </div>
            </button>
            
            <button
                class="p-4 border-2 rounded-lg transition-all duration-200 {currentDemo === 'forms' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'}"
                on:click={() => currentDemo = 'forms'}
            >
                <div class="text-center">
                    <div class="text-2xl mb-2">📋</div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Forms</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Complete form examples</p>
                </div>
            </button>
        </div>
    </div>
    
    <!-- Input Types Demo -->
    {#if currentDemo === 'inputTypes'}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🎨 All Input Types
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Text Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Text Input</h3>
                    <ModularInput
                        config={{
                            id: 'textDemo',
                            type: 'text',
                            icon: '📝',
                            label: { en: 'Text Input', de: 'Text-Eingabe' },
                            placeholder: { en: 'Enter some text...', de: 'Text eingeben...' },
                            description: { en: 'Basic text input with validation', de: 'Einfache Text-Eingabe mit Validierung' },
                            required: true,
                            validation: { minLength: 3, maxLength: 50 }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.textDemo || ''}
                        onValueChange={(value) => handleInputChange('textDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('textDemo', isValid, errors)}
                    />
                </div>
                
                <!-- Email Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Email Input</h3>
                    <ModularInput
                        config={{
                            id: 'emailDemo',
                            type: 'email',
                            icon: '📧',
                            label: { en: 'Email Address', de: 'E-Mail-Adresse' },
                            placeholder: { en: 'your@email.com', de: 'ihre@email.com' },
                            description: { en: 'Email with pattern validation', de: 'E-Mail mit Muster-Validierung' },
                            required: true,
                            validation: { pattern: 'email' }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.emailDemo || ''}
                        onValueChange={(value) => handleInputChange('emailDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('emailDemo', isValid, errors)}
                    />
                </div>
                
                <!-- Password Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Password Input</h3>
                    <ModularInput
                        config={{
                            id: 'passwordDemo',
                            type: 'password',
                            icon: '🔒',
                            label: { en: 'Password', de: 'Passwort' },
                            placeholder: { en: 'Enter your password', de: 'Passwort eingeben' },
                            description: { en: 'Secure password input', de: 'Sichere Passwort-Eingabe' },
                            required: true,
                            validation: { pattern: 'password' }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.passwordDemo || ''}
                        onValueChange={(value) => handleInputChange('passwordDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('passwordDemo', isValid, errors)}
                    />
                </div>
                
                <!-- Number Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Number Input</h3>
                    <ModularInput
                        config={{
                            id: 'numberDemo',
                            type: 'number',
                            icon: '🔢',
                            label: { en: 'Age', de: 'Alter' },
                            placeholder: { en: 'Enter your age', de: 'Alter eingeben' },
                            description: { en: 'Numeric input with range', de: 'Numerische Eingabe mit Bereich' },
                            min: 0,
                            max: 120,
                            validation: { min: 0, max: 120 }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.numberDemo || ''}
                        onValueChange={(value) => handleInputChange('numberDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('numberDemo', isValid, errors)}
                    />
                </div>
                
                <!-- Select Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Select Input</h3>
                    <ModularInput
                        config={{
                            id: 'selectDemo',
                            type: 'select',
                            icon: '📋',
                            label: { en: 'Country', de: 'Land' },
                            description: { en: 'Dropdown selection', de: 'Dropdown-Auswahl' },
                            options: [
                                { value: 'us', label: { en: '🇺🇸 United States', de: '🇺🇸 Vereinigte Staaten' } },
                                { value: 'de', label: { en: '🇩🇪 Germany', de: '🇩🇪 Deutschland' } },
                                { value: 'fr', label: { en: '🇫🇷 France', de: '🇫🇷 Frankreich' } },
                                { value: 'es', label: { en: '🇪🇸 Spain', de: '🇪🇸 Spanien' } }
                            ]
                        }}
                        currentLanguage="en"
                        currentValue={demoData.selectDemo || ''}
                        onValueChange={(value) => handleInputChange('selectDemo', value)}
                    />
                </div>
                
                <!-- Toggle Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Toggle Input</h3>
                    <ModularInput
                        config={{
                            id: 'toggleDemo',
                            type: 'toggle',
                            icon: '🔘',
                            label: { en: 'Notifications', de: 'Benachrichtigungen' },
                            description: { en: 'Toggle switch with color', de: 'Toggle-Schalter mit Farbe' },
                            color: 'green'
                        }}
                        currentLanguage="en"
                        currentValue={demoData.toggleDemo || false}
                        onValueChange={(value) => handleInputChange('toggleDemo', value)}
                    />
                </div>
                
                <!-- Range Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Range Input</h3>
                    <ModularInput
                        config={{
                            id: 'rangeDemo',
                            type: 'range',
                            icon: '📊',
                            label: { en: 'Volume', de: 'Lautstärke' },
                            description: { en: 'Slider with custom styling', de: 'Slider mit benutzerdefiniertem Styling' },
                            min: 0,
                            max: 100,
                            validation: { min: 0, max: 100 }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.rangeDemo || 50}
                        onValueChange={(value) => handleInputChange('rangeDemo', value)}
                    />
                </div>
                
                <!-- Textarea Input -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Textarea Input</h3>
                    <ModularInput
                        config={{
                            id: 'textareaDemo',
                            type: 'textarea',
                            icon: '📄',
                            label: { en: 'Bio', de: 'Biografie' },
                            placeholder: { en: 'Tell us about yourself...', de: 'Erzählen Sie uns von sich...' },
                            description: { en: 'Multi-line text input', de: 'Mehrzeilige Text-Eingabe' },
                            rows: 4,
                            validation: { maxLength: 200 }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.textareaDemo || ''}
                        onValueChange={(value) => handleInputChange('textareaDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('textareaDemo', isValid, errors)}
                    />
                </div>
            </div>
        </div>
    {/if}
    
    <!-- Validation Demo -->
    {#if currentDemo === 'validation'}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                ✅ Validation Examples
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Required Field -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Required Field</h3>
                    <ModularInput
                        config={{
                            id: 'requiredDemo',
                            type: 'text',
                            icon: '⚠️',
                            label: { en: 'Required Field', de: 'Pflichtfeld' },
                            placeholder: { en: 'This field is required', de: 'Dieses Feld ist erforderlich' },
                            description: { en: 'Cannot be empty', de: 'Darf nicht leer sein' },
                            required: true
                        }}
                        currentLanguage="en"
                        currentValue={demoData.requiredDemo || ''}
                        onValueChange={(value) => handleInputChange('requiredDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('requiredDemo', isValid, errors)}
                    />
                </div>
                
                <!-- Email Validation -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Email Validation</h3>
                    <ModularInput
                        config={{
                            id: 'emailValidationDemo',
                            type: 'email',
                            icon: '📧',
                            label: { en: 'Valid Email', de: 'Gültige E-Mail' },
                            placeholder: { en: 'Enter a valid email', de: 'Gültige E-Mail eingeben' },
                            description: { en: 'Must be a valid email format', de: 'Muss gültiges E-Mail-Format haben' },
                            required: true,
                            validation: { pattern: 'email' }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.emailValidationDemo || ''}
                        onValueChange={(value) => handleInputChange('emailValidationDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('emailValidationDemo', isValid, errors)}
                    />
                </div>
                
                <!-- Length Validation -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Length Validation</h3>
                    <ModularInput
                        config={{
                            id: 'lengthDemo',
                            type: 'text',
                            icon: '📏',
                            label: { en: 'Username', de: 'Benutzername' },
                            placeholder: { en: '3-20 characters', de: '3-20 Zeichen' },
                            description: { en: 'Between 3 and 20 characters', de: 'Zwischen 3 und 20 Zeichen' },
                            required: true,
                            validation: { minLength: 3, maxLength: 20 }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.lengthDemo || ''}
                        onValueChange={(value) => handleInputChange('lengthDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('lengthDemo', isValid, errors)}
                    />
                </div>
                
                <!-- Range Validation -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Range Validation</h3>
                    <ModularInput
                        config={{
                            id: 'rangeValidationDemo',
                            type: 'number',
                            icon: '🎯',
                            label: { en: 'Score', de: 'Punktzahl' },
                            placeholder: { en: '0-100', de: '0-100' },
                            description: { en: 'Must be between 0 and 100', de: 'Muss zwischen 0 und 100 liegen' },
                            min: 0,
                            max: 100,
                            validation: { min: 0, max: 100 }
                        }}
                        currentLanguage="en"
                        currentValue={demoData.rangeValidationDemo || ''}
                        onValueChange={(value) => handleInputChange('rangeValidationDemo', value)}
                        onValidation={(isValid, errors) => handleValidation('rangeValidationDemo', isValid, errors)}
                    />
                </div>
            </div>
        </div>
    {/if}
    
    <!-- Forms Demo -->
    {#if currentDemo === 'forms'}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📋 Complete Form Examples
            </h2>
            
            {#if formExamples.contactForm}
                <div class="mb-8">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        📞 Contact Form
                    </h3>
                    <ModularForm
                        formConfig={formExamples.contactForm.config}
                        currentLanguage="en"
                        formData={demoData}
                        onSubmit={handleFormSubmit}
                        submitConfig={formExamples.contactForm.submitConfig}
                        cancelConfig={formExamples.contactForm.cancelConfig}
                    />
                </div>
            {/if}
            
            {#if formExamples.settingsForm}
                <div class="mb-8">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        ⚙️ Settings Form
                    </h3>
                    <ModularForm
                        formConfig={formExamples.settingsForm.config}
                        currentLanguage="en"
                        formData={demoData}
                        onSubmit={handleFormSubmit}
                        submitConfig={formExamples.settingsForm.submitConfig}
                        cancelConfig={formExamples.settingsForm.cancelConfig}
                    />
                </div>
            {/if}
        </div>
    {/if}
    
    <!-- Live Data Display -->
    {#if Object.keys(demoData).length > 0}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Live Demo Data
            </h3>
            <pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify(demoData, null, 2)}
            </pre>
        </div>
    {/if}
    
    <!-- Features Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl mb-4">🎯</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Modular</h3>
            <p class="text-gray-600 dark:text-gray-400">Reusable components</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl mb-4">🌐</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">i18n Ready</h3>
            <p class="text-gray-600 dark:text-gray-400">Multi-language support</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl mb-4">✅</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Validated</h3>
            <p class="text-gray-600 dark:text-gray-400">Built-in validation</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl mb-4">⚡</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast</h3>
            <p class="text-gray-600 dark:text-gray-400">Optimized performance</p>
        </div>
    </div>
</div> 