<!-- src/routes/ContactForm.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, translations } from '../stores/contentStore';
    import { 
        showSuccess, 
        showError,
        showModal,
        showWarning, 
        closeModal,
        isModalVisible,
        showInfo
    } from '../stores/modalStore';
    import { navigate } from '../utils/routing';
    import { fade, fly, scale } from 'svelte/transition';
    import PageLayoutComponent from '../components/Layout/PageLayout.svelte';
    import { WEBHOOKS, API_CONFIG } from '../config/api';
    import { appVersion } from '../utils/version';
    import { navigateToHome } from '../utils/navigation';
    import InputComponent from '../components/UI/Input.svelte';
    import ButtonComponent from '../components/UI/Button.svelte';
    import CheckboxComponent from '../components/UI/Checkbox.svelte';
    import { isTestMode } from '../utils/environment';
    import { initializeAccountFromCookies } from '../stores/accountStore';
    import { get } from 'svelte/store';
    
    // Svelte 5 / Webpack: stabile Komponenten-Referenzen
    const PageLayout = PageLayoutComponent;
    const Input = InputComponent;
    const Button = ButtonComponent;
    const Checkbox = CheckboxComponent;
    
    // Reaktive Übersetzungen - optimiert (Svelte 5 Runes)
    let pageTitle = $derived.by(() => get(translations)?.contactForm?.pageTitle || 'Contact');
    let pageDescription = $derived.by(() => get(translations)?.contactForm?.pageDescription || 'Get in touch with us');

    // Debug-Logging für Reaktivität - nur in Development (Svelte 5 Runes)
    $effect(() => {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            const lang = get(currentLanguage);
            const t = get(translations);
            console.log('🔄 ContactForm: Language changed to:', lang);
            console.log('🔄 ContactForm: Translations updated:', {
                pageTitle: t?.contactForm?.pageTitle,
                pageDescription: t?.contactForm?.pageDescription,
                nameLabel: t?.contactForm?.nameLabel,
                emailLabel: t?.contactForm?.emailLabel,
                messageLabel: t?.contactForm?.messageLabel
            });
        }
    });
    
    // Form state (Svelte 5 Runes)
    let name = $state('');
    let email = $state('');
    let message = $state('');
    let newsletterOptIn = $state(false);
    let honeypot = $state(''); // Hidden honeypot field
    let emoijSmirkingFace = '/images/keymoji-animated-optimize-resize-160x160px.webp',
        realAuthorImage = '/images/chris-matt-keymoji-creator-frontend-developer.png',
        whileLoading = '😏',
        isImageLoaded = $state(false),
        showRealImage = $state(false);
    let isSubmitting = $state(false);
    let formErrors = $state({
        name: '',
        email: '',
        message: ''
    });

    // Redirect management
    let redirectTimeout: ReturnType<typeof setTimeout> | null = $state(null);

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

    const handleSubmit = async (event: SubmitEvent) => {
        // Prevent default form submission to handle via JS
        event?.preventDefault();
        if (isSubmitting) return;
        
        const t = get(translations);
        if (!validateForm()) {
            // Zeige Validierungsfehler mit dem neuen Modal-System
            showWarning(t.contactForm.validationErrorMessage);
            return;
        }

        isSubmitting = true;

        // Clear any previous timeouts to prevent navigation issues
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
            redirectTimeout = null;
        }
        
        // Zeige "Sending"-Nachricht mit dem neuen Modal-System
        showInfo(t.contactForm.sendingMessage);
        
        // Prepare email content with translations
        const emailText = {
            greeting: t.contactForm.emailText.greeting,
            intro: t.contactForm.emailText.intro,
            confirmationText: t.contactForm.emailText.confirmationText,
            doubleCheck: t.contactForm.emailText.doubleCheck,
            button: t.contactForm.emailText.button
        };
        
        const emailContent = {
            greeting: emailText.greeting || 'Hello',
            intro: emailText.intro || 'Thank you for contacting us.',
            doubleCheck: emailText.doubleCheck || "We've received your message with the following details:",
            button: emailText.button || 'Confirm Your Email',
            subject: t.contactForm.emailText.subject || `Your message to Keymoji has been received`,
            privacy: t.contactForm.emailText.privacy || 'Your data is handled securely.',
            footer: t.contactForm.footerText,
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
                    langCode: get(currentLanguage),
                    appVersion
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error');
            }

            // Success message with new modal system
            showSuccess(
                t.contactForm.successMessage,
                REDIRECT_DELAY // Auto-close after redirect delay
            );
            
            // Reset form
            name = email = message = honeypot = '';
            newsletterOptIn = false;

            // Set a timer for redirect to home page after success
            redirectTimeout = setTimeout(() => {
                // Navigate back to homepage with current language
                navigate(`/${get(currentLanguage)}`);
            }, REDIRECT_DELAY);
            
        } catch (error) {
            console.error('Submission error:', error);
            
            // Show error message with new modal system
            showError(t.contactForm.requestErrorMessage);
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
        if (get(isModalVisible)) {
            closeModal();
        }
    });

    // Initialize component
    onMount(() => {
        // Clear any existing modal state from previous routes
        // This ensures no leftover modals from other pages
        if (get(isModalVisible)) {
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

    // Test dynamic modal content - moved outside onMount
    function testDynamicModal() {
        // Vereinfachter Test für das Modal-System ohne zusätzliche API-Funktionen
        showInfo('Dynamisches Modal – Test des Modal-Systems.', 2000);
    }

    // Form validation (Svelte 5 Runes)
    let isFormValid = $derived(name.trim().length >= 2 && 
                     validateEmail(email) && 
                     message.trim().length >= MIN_MESSAGE_LENGTH);


</script>

<PageLayout {pageTitle} {pageDescription} routeSlug="contact">
    {#snippet beforeHeader()}
    <!-- GIF Image in before-header slot -->
        <div class="flex justify-center">
        <div 
            class="relative w-32 h-32 cursor-pointer rounded-full overflow-hidden border-4 border-yellow-200 dark:border-yellow-600 shadow-lg transform-gpu"
            role="img"
            aria-label="Contact form image"
            onmouseenter={() => {showRealImage = true; console.log('Mouse enter - showing real image');}}
            onmouseleave={() => {showRealImage = false; console.log('Mouse leave - showing GIF');}}
        >
            <!-- Animated GIF (default layer) -->
            <img 
                src={emoijSmirkingFace} 
                alt={$translations.contactForm.smirkingFaceImageAlt}
                class="w-full h-full object-cover rounded-full absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
                class:opacity-0={showRealImage}
                onload={() => {handleImageLoad(); console.log('GIF loaded successfully');}}
                onerror={() => console.log('Error loading GIF')}
            />
            
            <!-- Real Image (hover layer) -->
            <img 
                src={realAuthorImage} 
                alt="Chris Matt - Creator of Keymoji the {$translations.index.pageTitle}"
                class="w-full h-full object-cover rounded-full absolute inset-0 z-10 transition-all duration-500 ease-in-out"
                class:opacity-0={!showRealImage}
                class:scale-105={showRealImage}
                onerror={() => console.log('Error loading real author image')}
            />
        </div>
    </div>
    {/snippet}

    {#snippet children()}
    <!-- Contact Form Content -->
    <form onsubmit={handleSubmit}>
        <!-- Honeypot Field -->
        <div class="hidden" aria-hidden="true">
            <input type="text" name="website" bind:value={honeypot} autocomplete="off" tabindex="-1" />
        </div>

        <!-- Name & Email Fields -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label for="name" class="sr-only">{$translations.contactForm.nameLabel}</label>
                <Input
                    id="name"
                    type="text"
                    bind:value={name}
                    placeholder={$translations.contactForm.nameLabel}
                    disabled={isSubmitting}
                    invalid={!!formErrors.name}
                    valid={!formErrors.name && name.trim().length >= 2}
                    autocomplete="name"
                />
                {#if formErrors.name}
                    <p id="name-error" class="text-sm text-red-600 dark:text-red-400 mt-1">{formErrors.name}</p>
                {/if}
            </div>

            <div>
                <label for="email" class="sr-only">{$translations.contactForm.emailLabel}</label> 
                <Input
                    id="email"
                    type="email"
                    bind:value={email}
                    placeholder={$translations.contactForm.emailLabel}
                    disabled={isSubmitting}
                    invalid={!!formErrors.email}
                    valid={!formErrors.email && email.trim() && EMAIL_REGEX.test(email)}
                    autocomplete="email"
                />
                {#if formErrors.email}
                    <p id="email-error" class="text-sm text-red-600 dark:text-red-400 mt-1">{formErrors.email}</p>
                {/if}
            </div>
        </div>

        <!-- Message Field -->
        <div>
            <label for="message" class="sr-only">{$translations.contactForm.messageLabel}</label>
            <Input
                id="message"
                type="textarea"
                bind:value={message}
                placeholder={$translations.contactForm.messageLabel}
                disabled={isSubmitting}
                invalid={!!formErrors.message}
                valid={!formErrors.message && message.trim().length >= MIN_MESSAGE_LENGTH}
                autocomplete="off"
            />
            {#if formErrors.message}
                <p id="message-error" class="text-sm text-red-600 dark:text-red-400 mt-1">{formErrors.message}</p>
            {/if}
        </div>

        <!-- Newsletter Opt-in -->
        <div class="flex items-start mt-3 mb-4">
            <Checkbox
                id="newsletter"
                bind:checked={newsletterOptIn}
                disabled={isSubmitting}
                variant="primary"
                size="lg"
                iconSize="lg"
                labelHtml={$translations?.contactForm?.newsletterText ? 
                    $translations.contactForm.newsletterText.replace('{privacyPolicy}', 
                        `<a href="${$translations.contactForm.privacyPolicyUrl}" 
                            class="text-yellow-500 dark:text-yellow-700 hover:text-yellow-600 dark:hover:text-yellow-600 underline transition-colors duration-200"
                            aria-label="${$translations.contactForm.privacyPolicyLink}"
                            itemscope itemtype="http://schema.org/WebPage"
                            itemprop="url">
                            ${$translations.contactForm.privacyPolicyLink}
                        </a>`
                    ) : 
                    $translations?.contactForm?.newsletterOptIn || 'Subscribe to newsletter'
                }
                labelClass="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
            />
        </div>

        <!-- Test Buttons for Dynamic Modals (Development Only) -->
        {#if isTestMode()}
            <div class="flex gap-2 mt-4">
                <Button
                    variant="secondary"
                    size="sm"
                    onclick={testDynamicModal}
                >
                    Test Dynamic Modal
                </Button>
            </div>
        {/if}

        <!-- Form Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
            <Button
                type="button"
                variant="secondary" 
                size="md"
                fullWidth={true}
                onclick={() => navigateToHome()}
                disabled={isSubmitting}
            >
                🏠 {$translations.contactForm.backToMainButton}
            </Button>
            
            <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth={true}
                disabled={!isFormValid || isSubmitting}
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
            </Button>
        </div>
    </form>
    {/snippet}

    <!-- Footer Information Component -->
</PageLayout>