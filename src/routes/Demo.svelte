<!--
 * Demo.svelte
 * 
 * @description Demo route showcasing the new modular input system
 * with iterative usage examples and live demonstrations.
 -->

<script>
    import ModularInput from '../components/UI/ModularInput.svelte';
    
    // Form values
    let email = '';
    let name = '';
    let password = '';
    let age = 25;
    let country = '';
    let bio = '';
    let newsletter = false;
    let gender = '';
    let volume = 50;
    let notifications = false;
    let website = '';
    let phone = '';
    let rating = 3;
    
    // Event handlers
    function handleEmailChange(value) {
        email = value;
        console.log('Email changed:', value);
    }
    
    function handleNameChange(value) {
        name = value;
        console.log('Name changed:', value);
    }
    
    function handlePasswordChange(value) {
        password = value;
        console.log('Password changed:', value);
    }
    
    function handleAgeChange(value) {
        age = value;
        console.log('Age changed:', value);
    }
    
    function handleCountryChange(value) {
        country = value;
        console.log('Country changed:', value);
    }
    
    function handleBioChange(value) {
        bio = value;
        console.log('Bio changed:', value);
    }
    
    function handleNewsletterChange(value) {
        newsletter = value;
        console.log('Newsletter changed:', value);
    }
    
    function handleGenderChange(value) {
        gender = value;
        console.log('Gender changed:', value);
    }
    
    function handleVolumeChange(value) {
        volume = value;
        console.log('Volume changed:', value);
    }
    
    function handleNotificationsChange(value) {
        notifications = value;
        console.log('Notifications changed:', value);
    }
    
    function handleWebsiteChange(value) {
        website = value;
        console.log('Website changed:', value);
    }
    
    function handlePhoneChange(value) {
        phone = value;
        console.log('Phone changed:', value);
    }
    
    function handleRatingChange(value) {
        rating = value;
        console.log('Rating changed:', value);
    }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Modular Input Demo
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
                Alle verfügbaren Input-Typen der ModularInput-Komponente
            </p>
        </div>
        
        <!-- Demo Inputs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Text Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    📝 Text Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoName',
                        type: 'text',
                        icon: '👤',
                        label: { en: 'Full Name', de: 'Vollständiger Name' },
                        placeholder: { en: 'Enter your name', de: 'Name eingeben' },
                        description: { en: 'Your display name', de: 'Ihr Anzeigename' },
                        validation: { minLength: 2, maxLength: 50 }
                    }}
                    currentLanguage="en"
                    currentValue={name}
                    onValueChange={handleNameChange}
                />
            </div>
            
            <!-- Email Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    📧 Email Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoEmail',
                        type: 'email',
                        icon: '📧',
                        label: { en: 'Email Address', de: 'E-Mail-Adresse' },
                        placeholder: { en: 'Enter your email', de: 'E-Mail eingeben' },
                        description: { en: 'We\'ll send you a magic link', de: 'Wir senden Ihnen einen Magic Link' },
                        required: true,
                        validation: { pattern: 'email' }
                    }}
                    currentLanguage="en"
                    currentValue={email}
                    onValueChange={handleEmailChange}
                />
            </div>
            
            <!-- Password Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🔒 Password Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoPassword',
                        type: 'password',
                        icon: '🔒',
                        label: { en: 'Password', de: 'Passwort' },
                        placeholder: { en: 'Enter your password', de: 'Passwort eingeben' },
                        description: { en: 'Minimum 8 characters with uppercase, lowercase, and number', de: 'Mindestens 8 Zeichen mit Groß-, Kleinbuchstaben und Zahl' },
                        required: true,
                        validation: { pattern: 'password' }
                    }}
                    currentLanguage="en"
                    currentValue={password}
                    onValueChange={handlePasswordChange}
                />
            </div>
            
            <!-- Number Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🔢 Number Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoAge',
                        type: 'number',
                        icon: '🎂',
                        label: { en: 'Age', de: 'Alter' },
                        placeholder: { en: 'Enter your age', de: 'Alter eingeben' },
                        description: { en: 'Your current age', de: 'Ihr aktuelles Alter' },
                        min: 13,
                        max: 120,
                        validation: { min: 13, max: 120 }
                    }}
                    currentLanguage="en"
                    currentValue={age}
                    onValueChange={handleAgeChange}
                />
            </div>
            
            <!-- Select Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🌍 Select Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoCountry',
                        type: 'select',
                        icon: '🌍',
                        label: { en: 'Country', de: 'Land' },
                        description: { en: 'Select your country', de: 'Wählen Sie Ihr Land' },
                        options: [
                            { value: '', label: { en: 'Select a country', de: 'Land auswählen' } },
                            { value: 'de', label: { en: 'Germany', de: 'Deutschland' } },
                            { value: 'us', label: { en: 'United States', de: 'Vereinigte Staaten' } },
                            { value: 'uk', label: { en: 'United Kingdom', de: 'Vereinigtes Königreich' } },
                            { value: 'fr', label: { en: 'France', de: 'Frankreich' } },
                            { value: 'es', label: { en: 'Spain', de: 'Spanien' } },
                            { value: 'it', label: { en: 'Italy', de: 'Italien' } }
                        ]
                    }}
                    currentLanguage="en"
                    currentValue={country}
                    onValueChange={handleCountryChange}
                />
            </div>
            
            <!-- Textarea Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    📄 Textarea Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoBio',
                        type: 'textarea',
                        icon: '📄',
                        label: { en: 'Bio', de: 'Biografie' },
                        placeholder: { en: 'Tell us about yourself...', de: 'Erzählen Sie uns von sich...' },
                        description: { en: 'A short description about yourself', de: 'Eine kurze Beschreibung über sich' },
                        rows: 4,
                        maxLength: 500,
                        validation: { maxLength: 500 }
                    }}
                    currentLanguage="en"
                    currentValue={bio}
                    onValueChange={handleBioChange}
                />
            </div>
            
            <!-- Checkbox Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    ✅ Checkbox Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoNewsletter',
                        type: 'checkbox',
                        icon: '📧',
                        label: { en: 'Newsletter Subscription', de: 'Newsletter-Abonnement' },
                        description: { en: 'Receive updates and news', de: 'Updates und Neuigkeiten erhalten' }
                    }}
                    currentLanguage="en"
                    currentValue={newsletter}
                    onValueChange={handleNewsletterChange}
                />
            </div>
            
            <!-- Radio Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🔘 Radio Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoGender',
                        type: 'radio',
                        icon: '👤',
                        label: { en: 'Gender', de: 'Geschlecht' },
                        description: { en: 'Select your gender', de: 'Wählen Sie Ihr Geschlecht' },
                        options: [
                            { value: 'male', label: { en: 'Male', de: 'Männlich' } },
                            { value: 'female', label: { en: 'Female', de: 'Weiblich' } },
                            { value: 'other', label: { en: 'Other', de: 'Andere' } },
                            { value: 'prefer-not', label: { en: 'Prefer not to say', de: 'Möchte nicht angeben' } }
                        ]
                    }}
                    currentLanguage="en"
                    currentValue={gender}
                    onValueChange={handleGenderChange}
                />
            </div>
            
            <!-- Range Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🔊 Range Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoVolume',
                        type: 'range',
                        icon: '🔊',
                        label: { en: 'Volume', de: 'Lautstärke' },
                        description: { en: 'Adjust the volume level', de: 'Lautstärke einstellen' },
                        min: 0,
                        max: 100,
                        step: 5,
                        validation: { min: 0, max: 100 }
                    }}
                    currentLanguage="en"
                    currentValue={volume}
                    onValueChange={handleVolumeChange}
                />
            </div>
            
            <!-- Toggle Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🔄 Toggle Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoNotifications',
                        type: 'toggle',
                        icon: '🔔',
                        label: { en: 'Notifications', de: 'Benachrichtigungen' },
                        description: { en: 'Enable push notifications', de: 'Push-Benachrichtigungen aktivieren' },
                        color: 'green'
                    }}
                    currentLanguage="en"
                    currentValue={notifications}
                    onValueChange={handleNotificationsChange}
                />
            </div>
            
            <!-- URL Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    🌐 URL Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoWebsite',
                        type: 'text',
                        icon: '🌐',
                        label: { en: 'Website', de: 'Webseite' },
                        placeholder: { en: 'https://example.com', de: 'https://beispiel.de' },
                        description: { en: 'Your personal website', de: 'Ihre persönliche Webseite' },
                        validation: { pattern: 'url' }
                    }}
                    currentLanguage="en"
                    currentValue={website}
                    onValueChange={handleWebsiteChange}
                />
            </div>
            
            <!-- Phone Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    📞 Phone Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoPhone',
                        type: 'text',
                        icon: '📞',
                        label: { en: 'Phone Number', de: 'Telefonnummer' },
                        placeholder: { en: '+1 234 567 8900', de: '+49 123 456 789' },
                        description: { en: 'Your contact number', de: 'Ihre Kontaktnummer' },
                        validation: { pattern: 'phone' }
                    }}
                    currentLanguage="en"
                    currentValue={phone}
                    onValueChange={handlePhoneChange}
                />
            </div>
            
            <!-- Rating Range Input -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    ⭐ Rating Input
                </h2>
                <ModularInput
                    config={{
                        id: 'demoRating',
                        type: 'range',
                        icon: '⭐',
                        label: { en: 'Rating', de: 'Bewertung' },
                        description: { en: 'Rate your experience (1-5 stars)', de: 'Bewerten Sie Ihre Erfahrung (1-5 Sterne)' },
                        min: 1,
                        max: 5,
                        step: 1,
                        validation: { min: 1, max: 5 }
                    }}
                    currentLanguage="en"
                    currentValue={rating}
                    onValueChange={handleRatingChange}
                />
            </div>
        </div>
        
        <!-- Live Data Display -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Live Demo Data
            </h3>
            <pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify({ 
    email, 
    name, 
    password: password ? '***' : '', 
    age, 
    country, 
    bio, 
    newsletter, 
    gender, 
    volume, 
    notifications, 
    website, 
    phone, 
    rating 
}, null, 2)}
            </pre>
        </div>
        
        <!-- Features Summary -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div class="text-3xl mb-4">🎯</div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Modular</h3>
                <p class="text-gray-600 dark:text-gray-400">Wiederverwendbare Komponenten</p>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div class="text-3xl mb-4">🌐</div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">i18n Ready</h3>
                <p class="text-gray-600 dark:text-gray-400">Mehrsprachige Unterstützung</p>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div class="text-3xl mb-4">✅</div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Validated</h3>
                <p class="text-gray-600 dark:text-gray-400">Integrierte Validierung</p>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div class="text-3xl mb-4">🎨</div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Styled</h3>
                <p class="text-gray-600 dark:text-gray-400">Moderne UI mit Tailwind</p>
            </div>
        </div>
    </div>
</div> 