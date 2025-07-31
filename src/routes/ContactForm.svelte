<!-- src/routes/ContactForm.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import { 
        showSuccess, 
        showError,
        showModal,
        showWarning, 
        showSending, 
        closeModal,
        isModalVisible 
    } from '../stores/modalStore.js';
    import { navigate } from "svelte-routing";
    import { fade, fly, scale } from 'svelte/transition';
    import Header from '../components/Layout/Header.svelte';
    import FixedMenu from '../widgets/FixedMenu.svelte';
    import { WEBHOOKS, API_CONFIG } from '../config/api.js';
    import { appVersion } from '../utils/version.js';
    import { navigateToHome } from '../utils/navigation.js';
    import { isTestMode } from '../utils/environment.js';
    import { initializeAccountFromCookies } from '../stores/accountStore.js';
    
    // Reaktive Übersetzungen - optimiert
    $: pageTitle = $translations?.contactForm?.pageTitle || 'Contact';
    $: pageDescription = $translations?.contactForm?.pageDescription || 'Get in touch with us';

    // Debug-Logging für Reaktivität - nur in Development
    $: if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log('🔄 ContactForm: Language changed to:', $currentLanguage);
        console.log('🔄 ContactForm: Translations updated:', {
            pageTitle: $translations?.contactForm?.pageTitle,
            pageDescription: $translations?.contactForm?.pageDescription,
            nameLabel: $translations?.contactForm?.nameLabel,
            emailLabel: $translations?.contactForm?.emailLabel,
            messageLabel: $translations?.contactForm?.messageLabel
        });
    }
    
    // Form state
    let name = '';
    let email = '';
    let message = '';
    let newsletterOptIn = false;
    let honeypot = ''; // Hidden honeypot field
    let emoijSmirkingFace = '/images/keymoji-animated-optimize-resize-160x160px.webp',
        realAuthorImage = '/images/chris-matt-keymoji-creator-frontend-developer.png',
        whileLoading = "😏",
        isImageLoaded = false,
        showRealImage = false;
    let isSubmitting = false;
    let formErrors = {
        name: '',
        email: '',
        message: ''
    };

    // Redirect management
    let redirectTimeout = null;

    // Constants
    const MIN_MESSAGE_LENGTH = 10;
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const REDIRECT_DELAY = 4000; // Time in ms before redirecting after success

    function handleImageLoad() {
      isImageLoaded = true;
    }

    // Validation functions
    const validateEmail = (email) => EMAIL_REGEX.test(email);
    
    const validateForm = () => {
        formErrors = { name: '', email: '', message: '' };
        let isValid = true;

        if (!name.trim()) {
            formErrors.name = $translations.contactForm.validation.nameRequired;
            isValid = false;
        } else if (name.length < 2) {
            formErrors.name = $translations.contactForm.validation.nameLength;
            isValid = false;
        }

        if (!email.trim()) {
            formErrors.email = $translations.contactForm.validation.emailRequired;
            isValid = false;
        } else if (!validateEmail(email)) {
            formErrors.email = $translations.contactForm.validation.emailInvalid;
            isValid = false;
        }

        if (!message.trim()) {
            formErrors.message = $translations.contactForm.validation.messageRequired;
            isValid = false;
        } else if (message.length < MIN_MESSAGE_LENGTH) {
            formErrors.message = $translations.contactForm.validation.messageLength.replace('{min}', MIN_MESSAGE_LENGTH);
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        if (!validateForm()) {
            // Zeige Validierungsfehler mit dem neuen Modal-System
            showWarning($translations.contactForm.validationErrorMessage);
            return;
        }

        isSubmitting = true;

        // Clear any previous timeouts to prevent navigation issues
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
            redirectTimeout = null;
        }
        
        // Zeige "Sending"-Nachricht mit dem neuen Modal-System
        showSending($translations.contactForm.sendingMessage);
        
        // Prepare email content with translations
        const emailText = {
            greeting: $translations.contactForm.emailText.greeting,
            intro: $translations.contactForm.emailText.intro,
            confirmationText: $translations.contactForm.emailText.confirmationText,
            doubleCheck: $translations.contactForm.emailText.doubleCheck,
            button: $translations.contactForm.emailText.button
        };
        
        const emailContent = {
            greeting: emailText.greeting || 'Hello',
            intro: emailText.intro || 'Thank you for contacting us.',
            doubleCheck: emailText.doubleCheck || "We've received your message with the following details:",
            button: emailText.button || 'Confirm Your Email',
            subject: $translations.contactForm.emailText.subject || `Your message to Keymoji has been received`,
            privacy: $translations.contactForm.emailText.privacy || 'Your data is handled securely.',
            footer: $translations.contactForm.footerText,
            newsletterOptIn // Pass newsletter option to email template
        };

        try {
            const response = await fetch(WEBHOOKS.CONTACT.SEND_MAIL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim(),
                    newsletterOptIn,
                    honeypot,
                    emailContent,
                    langCode: $currentLanguage,
                    appVersion
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error');
            }

            // Success message with new modal system
            showSuccess(
                $translations.contactForm.successMessage,
                REDIRECT_DELAY // Auto-close after redirect delay
            );
            
            // Reset form
            name = email = message = honeypot = '';
            newsletterOptIn = false;

            // Set a timer for redirect to home page after success
            redirectTimeout = setTimeout(() => {
                // Navigate back to homepage with current language
                navigate(`/${$currentLanguage}`);
            }, REDIRECT_DELAY);
            
        } catch (error) {
            console.error('Submission error:', error);
            
            // Show error message with new modal system
            showError($translations.contactForm.requestErrorMessage);
        } finally {
            isSubmitting = false;
        }
    };

    // Clean up timeouts when component is destroyed
    onDestroy(() => {
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
        }
        
        // Force close modal immediately when leaving the page
        // This prevents the modal from briefly appearing during route transitions
        if ($isModalVisible) {
            closeModal();
        }
    });

    // Initialize component
    onMount(() => {
        // Clear any existing modal state from previous routes
        // This ensures no leftover modals from other pages
        if ($isModalVisible) {
            closeModal();
        }
        
        // Only in development mode: Test modal system
        if (isTestMode()) {
            console.log('Testing modal system in development mode');
            setTimeout(() => {
                showSuccess('Modal system test', 2000);
            }, 500);
        }

        // Initialize account from cookies
        initializeAccountFromCookies();
    });

    $: isFormValid = name.trim().length >= 2 && 
                     validateEmail(email) && 
                     message.trim().length >= MIN_MESSAGE_LENGTH;
</script>

<!-- App Container -->
<main class="app-container" data-lang={$currentLanguage}>
    <!-- Header -->
    <Header />
    
    <!-- Main Content Container -->
    <div class="min-h-screen overflow-y-auto scrollbar-consistent scroll-smooth" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center min-h-screen py-8 px-4 z-10 gap-4 overflow-y-auto scrollbar-consistent scroll-smooth">

            <!-- GIF Image above header -->
            <div class="flex justify-center mb-4">
                <div 
                    class="relative w-32 h-32 cursor-pointer rounded-full overflow-hidden border-4 border-yellow-200 dark:border-yellow-600 shadow-lg transform-gpu"
                    on:mouseenter={() => {showRealImage = true; console.log('Mouse enter - showing real image');}}
                    on:mouseleave={() => {showRealImage = false; console.log('Mouse leave - showing GIF');}}
                >
                    <!-- Animated GIF (default layer) -->
                    <img 
                        src={emoijSmirkingFace} 
                        alt={$translations.contactForm.smirkingFaceImageAlt}
                        class="w-full h-full object-cover rounded-full absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
                        class:opacity-0={showRealImage}
                        on:load={() => {handleImageLoad(); console.log('GIF loaded successfully');}}
                        on:error={() => console.log('Error loading GIF')}
                    />
                    
                    <!-- Real Image (hover layer) -->
                    <img 
                        src={realAuthorImage} 
                        alt="Chris Matt - Creator of Keymoji the {$translations.index.pageTitle}"
                        class="w-full h-full object-cover rounded-full absolute inset-0 z-10 transition-all duration-500 ease-in-out"
                        class:opacity-0={!showRealImage}
                        class:scale-105={showRealImage}
                        on:error={() => console.log('Error loading real author image')}
                    />
                </div>
            </div>

            <!-- Main Heading -->
            <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
                <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                    {pageTitle}
                </h1>
                <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                    {pageDescription}
                </p>
            </div>

            <!-- Contact Form Component -->
            <div class="content-wrapper pb-4 px-4 w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-500 dark:bg-aubergine-80 backdrop-opacity-60">
                <!-- Contact Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                    <!-- Honeypot Field -->
                    <div class="hidden" aria-hidden="true">
                        <input type="text" name="website" bind:value={honeypot} autocomplete="off" tabindex="-1" />
                    </div>

                    <!-- Name & Email Fields -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label for="name" class="sr-only">{$translations.contactForm.nameLabel}</label>
                            <input
                                id="name"
                                type="text"
                                bind:value={name}
                                placeholder={$translations.contactForm.nameLabel}
                                class="contact-input"
                                aria-invalid={!!formErrors.name}
                                aria-describedby={formErrors.name ? "name-error" : undefined}
                                disabled={isSubmitting}
                            />
                            {#if formErrors.name}
                                <p id="name-error" class="form-error">{formErrors.name}</p>
                            {/if}
                        </div>

                        <div>
                            <label for="email" class="sr-only">{$translations.contactForm.emailLabel}</label>
                            <input
                                id="email"
                                type="email"
                                bind:value={email}
                                placeholder={$translations.contactForm.emailLabel}
                                class="contact-input"
                                aria-invalid={!!formErrors.email}
                                aria-describedby={formErrors.email ? "email-error" : undefined}
                                disabled={isSubmitting}
                            />
                            {#if formErrors.email}
                                <p id="email-error" class="form-error">{formErrors.email}</p>
                            {/if}
                        </div>
                    </div>

                    <!-- Message Field -->
                    <div>
                    <label for="message" class="sr-only">{$translations.contactForm.messageLabel}</label>
                    <textarea
                        id="message"
                        bind:value={message}
                        placeholder={$translations.contactForm.messageLabel}
                        rows="2"
                        class="contact-input"
                        aria-invalid={!!formErrors.message}
                        aria-describedby={formErrors.message ? "message-error" : undefined}
                        disabled={isSubmitting}
                    />
                    {#if formErrors.message}
                        <p id="message-error" class="form-error">{formErrors.message}</p>
                    {/if}
                </div>

                    <!-- Newsletter Opt-in -->
                    <div class="flex items-center space-x-2">
                        <input
                            id="newsletter"
                            type="checkbox"
                            bind:checked={newsletterOptIn}
                            class="rounded"
                            disabled={isSubmitting}
                        />
                        <label class="dark:text-gray-400" for="newsletter">{$translations.contactForm.newsletterLabel}</label>
                    </div>

                    <!-- Privacy Notice -->
                    <p class="sr-only">
                        {$translations.contactForm.privacyNotice}
                    </p>

                    <!-- Form Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            on:click={() => navigateToHome()}
                            class="btn-secondary btn-md"
                            disabled={isSubmitting}
                            aria-label={$translations.contactForm.backToMainButton}
                        >
                        🏠 {$translations.contactForm.backToMainButton}
                        </button>
                        
                        <button
                            type="submit"
                            class="btn-primary btn-md {isSubmitting ? 'opacity-75 cursor-wait' : ''}"
                            aria-label={isSubmitting 
                                ? $translations.contactForm.sendingButton
                                : $translations.contactForm.sendButton}
                            aria-busy={isSubmitting}
                        >
                            {#if isSubmitting}
                            <span class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {$translations.contactForm.sendingButton}
                            </span>
                            {:else}
                            {$translations.contactForm.sendButton}
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    </div>

    <!-- Fixed Menu -->
    <FixedMenu align={'bottom'} />
</main>

<style>
    /* Improve form field styles for disabled state */
    .contact-input:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  
    /* Improve button styles for disabled state */
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: scale(1) !important;
    }
    
    /* Form error styles */
    .form-error {
      color: #ef4444; /* Red for error */
      font-size: 0.875rem; /* Smaller font size */
      margin-top: 0.25rem; /* Smaller top margin */
    }
</style>