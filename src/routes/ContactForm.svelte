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
        isModalVisible,
        showModalWithContent,
        showConfirmation,
        showInfo
    } from '../stores/modalStore';
    import { navigate } from "svelte-routing";
    import { fade, fly, scale } from 'svelte/transition';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import { WEBHOOKS, API_CONFIG } from '../config/api.js';
    import { appVersion } from '../utils/version';
    import { navigateToHome } from '../utils/navigation';
    import Input from '../components/UI/Input.svelte';
    import Button from '../components/UI/Button.svelte';
    import Checkbox from '../components/UI/Checkbox.svelte';
    import { isTestMode } from '../utils/environment';
    import { initializeAccountFromCookies } from '../stores/accountStore.js';
    import { currentAccount, isLoggedIn } from 'stores/appStores';
    import FooterInfo from '../widgets/FooterInfo.svelte';
    
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
    
    // Form state — pre-fill from account if logged in
    let name = '';
    let email = '';
    let message = '';
    let newsletterOptIn = false;

    // Pre-fill email + name from account — only once, never overwrite user edits
    let prefilled = false;
    $: if ($isLoggedIn && $currentAccount && !prefilled) {
        if ($currentAccount.email) email = $currentAccount.email;
        if ($currentAccount.profile?.name || $currentAccount.name) {
            name = $currentAccount.profile?.name || $currentAccount.name || '';
        }
        prefilled = true;
    }

    // Email is locked when user is logged in (verified address)
    $: isEmailLocked = $isLoggedIn && !!$currentAccount?.email;
    let lockBadgeHovered = false;
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
        
        // Use fallbacks if translations not loaded yet
        const validation = $translations?.contactForm?.validation || {};

        if (!name.trim()) {
            formErrors.name = validation.nameRequired || 'Name is required';
            isValid = false;
        } else if (name.length < 2) {
            formErrors.name = validation.nameLength || 'Name must be at least 2 characters';
            isValid = false;
        }

        if (!email.trim()) {
            formErrors.email = validation.emailRequired || 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            formErrors.email = validation.emailInvalid || 'Please enter a valid email address';
            isValid = false;
        }

        if (!message.trim()) {
            formErrors.message = validation.messageRequired || 'Message is required';
            isValid = false;
        } else if (message.length < MIN_MESSAGE_LENGTH) {
            formErrors.message = (validation.messageLength || 'Message must be at least {min} characters').replace('{min}', MIN_MESSAGE_LENGTH);
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        if (!validateForm()) {
            // Zeige Validierungsfehler mit dem neuen Modal-System
            showWarning($translations?.contactForm?.validationErrorMessage || 'Please check your form and try again');
            return;
        }

        isSubmitting = true;

        // Clear any previous timeouts to prevent navigation issues
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
            redirectTimeout = null;
        }
        
        // Zeige "Sending"-Nachricht mit dem neuen Modal-System
        showSending($translations?.contactForm?.sendingMessage || 'Sending your message...');
        
        // Prepare email content with translations (with fallbacks)
        const emailText = $translations?.contactForm?.emailText || {};
        const emailTextData = {
            greeting: emailText.greeting || 'Hello',
            intro: emailText.intro || 'Thank you for contacting us.',
            confirmationText: emailText.confirmationText || 'Please confirm your request.',
            doubleCheck: emailText.doubleCheck || "We've received your message with the following details:",
            button: emailText.button || 'Confirm Your Email'
        };
        
        const emailContent = {
            greeting: emailTextData.greeting,
            intro: emailTextData.intro,
            doubleCheck: emailTextData.doubleCheck,
            button: emailTextData.button,
            subject: emailText.subject || `Your message to Keymoji has been received`,
            privacy: emailText.privacy || 'Your data is handled securely.',
            footer: $translations?.contactForm?.footerText || '',
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
                $translations?.contactForm?.successMessage || 'Message sent successfully!',
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
            showError($translations?.contactForm?.requestErrorMessage || 'Failed to send message. Please try again.');
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

    // Test dynamic modal content - moved outside onMount
    function testDynamicModal() {
        showModalWithContent({
            title: 'Dynamic Modal',
            description: 'This is an example of a dynamic modal with header, body and footer.',
            html: '<div class="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg mb-4"><strong>HTML Content:</strong> Arbitrary HTML content can be displayed here!</div>'
        }, {
            title: 'Test Modal',
            icon: '🧪',
            type: 'info',
            buttons: [
                {
                    text: 'Cancel',
                    variant: 'secondary',
                    action: () => closeModal()
                },
                {
                    text: 'Confirm',
                    variant: 'primary',
                    action: () => {
                        showSuccess('Action confirmed!', 2000);
                        closeModal();
                    }
                }
            ]
        });
    }

    $: isFormValid = name.trim().length >= 2 && 
                     validateEmail(email) && 
                     message.trim().length >= MIN_MESSAGE_LENGTH;


</script>

<!-- Ensure content is always visible - even if translations are loading -->
{#if $translations?.contactForm || true}
<PageLayout {pageTitle} {pageDescription}>
    <!-- GIF Image in before-header slot -->
    <div slot="before-header" class="flex justify-center">
        <div 
            class="relative w-32 h-32 cursor-pointer rounded-full overflow-hidden border-4 border-yellow-200 dark:border-yellow-600 shadow-lg transform-gpu"
            on:mouseenter={() => {showRealImage = true; console.log('Mouse enter - showing real image');}}
            on:mouseleave={() => {showRealImage = false; console.log('Mouse leave - showing GIF');}}
        >
            <!-- Animated GIF (default layer) -->
            <img 
                src={emoijSmirkingFace} 
                alt={$translations?.contactForm?.smirkingFaceImageAlt || 'Keymoji emoji smirkingface'}
                class="w-full h-full object-cover rounded-full absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
                class:opacity-0={showRealImage}
                on:load={() => {handleImageLoad(); console.log('GIF loaded successfully');}}
                on:error={() => console.log('Error loading GIF')}
            />
            
            <!-- Real Image (hover layer) -->
            <img 
                src={realAuthorImage} 
                alt="Chris Matt - Creator of Keymoji the {$translations?.index?.pageTitle || 'Emoji Password Generator'}"
                class="w-full h-full object-cover rounded-full absolute inset-0 z-10 transition-all duration-500 ease-in-out"
                class:opacity-0={!showRealImage}
                class:scale-105={showRealImage}
                on:error={() => console.log('Error loading real author image')}
            />
        </div>
    </div>

    <!-- Contact Form Content -->
    <form on:submit|preventDefault={handleSubmit}>
        <!-- Honeypot Field -->
        <div class="hidden" aria-hidden="true">
            <input type="text" name="website" bind:value={honeypot} autocomplete="off" tabindex="-1" />
        </div>

        <!-- Name & Email Fields -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label for="name" class="sr-only">{$translations?.contactForm?.nameLabel || 'Your Name'}</label>
                <Input
                    id="name"
                    type="text"
                    bind:value={name}
                    placeholder={$translations?.contactForm?.nameLabel || 'Your Name'}
                    disabled={isSubmitting}
                    invalid={!!formErrors.name}
                    valid={!formErrors.name && name.trim().length >= 2}
                    autocomplete="given-name"
                />
                {#if formErrors.name}
                    <p id="name-error" class="text-sm text-red-600 dark:text-red-400 mt-1">{formErrors.name}</p>
                {/if}
            </div>

            <div>
                <label for="email" class="sr-only">{$translations?.contactForm?.emailLabel || 'Your Email'}</label>
                <div class="relative">
                    <Input
                        id="email"
                        type="email"
                        bind:value={email}
                        placeholder={$translations?.contactForm?.emailLabel || 'Your Email'}
                        disabled={isSubmitting || isEmailLocked}
                        invalid={!!formErrors.email}
                        valid={!formErrors.email && email.trim() && EMAIL_REGEX.test(email)}
                        autocomplete="email"
                        extraClass=""
                    />
                    {#if isEmailLocked}
                        <!-- Lock badge: pill shape, centered vertically, expands on hover -->
                        <div class="absolute right-2 inset-y-0 flex items-center">
                            <span
                                aria-label={$translations?.contactForm?.emailLockedHint || 'From your profile'}
                                on:mouseenter={() => lockBadgeHovered = true}
                                on:mouseleave={() => lockBadgeHovered = false}
                                on:focusin={() => lockBadgeHovered = true}
                                on:focusout={() => lockBadgeHovered = false}
                                class="inline-flex items-center overflow-hidden rounded-full border backdrop-blur-sm cursor-default"
                                class:border-gray-200={!lockBadgeHovered}
                                class:dark:border-gray-700={!lockBadgeHovered}
                                class:border-yellow-400={lockBadgeHovered}
                                class:dark:border-yellow-500={lockBadgeHovered}
                                class:bg-white={!lockBadgeHovered}
                                class:dark:bg-aubergine-900={!lockBadgeHovered}
                                class:bg-yellow-50={lockBadgeHovered}
                                class:dark:bg-aubergine-800={lockBadgeHovered}
                                class:text-gray-400={!lockBadgeHovered}
                                class:dark:text-gray-500={!lockBadgeHovered}
                                class:text-yellow-600={lockBadgeHovered}
                                class:dark:text-yellow-400={lockBadgeHovered}
                                style="height: 1.75rem; max-width: {lockBadgeHovered ? '14rem' : '1.75rem'}; padding: 0 0.4375rem; transition: max-width 350ms ease-in-out, background-color 200ms, border-color 200ms, color 200ms;"
                            >
                                <svg
                                    style="width: 0.875rem; height: 0.875rem; min-width: 0.875rem; flex-shrink: 0;"
                                    fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"
                                >
                                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                                </svg>
                                <span
                                    class="text-xs font-medium whitespace-nowrap overflow-hidden"
                                    style="transition: max-width 350ms ease-in-out, opacity 250ms ease-in-out, margin-left 300ms ease-in-out; max-width: {lockBadgeHovered ? '12rem' : '0'}; opacity: {lockBadgeHovered ? '1' : '0'}; margin-left: {lockBadgeHovered ? '0.35rem' : '0'};"
                                >
                                    {$translations?.contactForm?.emailLockedHint || 'From your profile'}
                                </span>
                            </span>
                        </div>
                    {/if}
                </div>
                {#if !isEmailLocked && formErrors.email}
                    <p id="email-error" class="text-sm text-red-600 dark:text-red-400 mt-1">{formErrors.email}</p>
                {/if}
            </div>
        </div>

        <!-- Message Field -->
        <div>
            <label for="message" class="sr-only">{$translations?.contactForm?.messageLabel || 'Your Message'}</label>
            <Input
                id="message"
                type="textarea"
                bind:value={message}
                placeholder={$translations?.contactForm?.messageLabel || 'Your Message'}
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
                        `<a href="${$translations?.contactForm?.privacyPolicyUrl || '/privacy'}" 
                            class="text-yellow-500 dark:text-yellow-700 hover:text-yellow-600 dark:hover:text-yellow-600 underline transition-colors duration-200"
                            aria-label="${$translations?.contactForm?.privacyPolicyLink || 'Privacy Policy'}"
                            itemscope itemtype="http://schema.org/WebPage"
                            itemprop="url">
                            ${$translations?.contactForm?.privacyPolicyLink || 'Privacy Policy'}
                        </a>`
                    ) : 
                    ($translations?.contactForm?.newsletterOptIn || 'Subscribe to newsletter')
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
                    on:click={testDynamicModal}
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
                on:click={() => navigateToHome()}
                disabled={isSubmitting}
            >
                ← {$translations?.contactForm?.backToMainButton || 'Back to home'}
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
                        {$translations?.contactForm?.sendingButton || 'Sending...'}
                    </span>
                {:else}
                    {$translations?.contactForm?.sendButton || 'Send'}
                {/if}
            </Button>
        </div>
    </form>

    <!-- Footer Information Component -->
    <FooterInfo slot="footer" />
</PageLayout>
{/if}
{#if !$translations?.contactForm}
    <!-- Fallback: Show loading state if translations not ready -->
    <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
            <div class="w-12 h-12 border-4 border-yellow-200 dark:border-yellow-900 border-t-yellow-500 dark:border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading contact form...</p>
        </div>
    </div>
{/if}