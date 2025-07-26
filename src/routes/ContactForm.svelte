<!-- src/routes/ContactForm.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage } from '../stores/appStores.js';
    import { 
        showSuccess, 
        showError,
        showModal,
        showWarning, 
        showSending, 
        closeModal 
    } from '../stores/modalStore.js';
    import content from '../content.js';
    import { navigate } from "svelte-routing";
    import { fade, fly, scale } from 'svelte/transition';
    import Header from '../Header.svelte';
    import FixedMenu from '../widgets/FixedMenu.svelte';
    import { WEBHOOKS, API_CONFIG } from '../config/api.js';
    import { appVersion } from '../utils/version.js';
    
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
            formErrors.name = content[$currentLanguage]?.contactForm?.validation?.nameRequired || 'Name required';
            isValid = false;
        } else if (name.length < 2) {
            formErrors.name = content[$currentLanguage]?.contactForm?.validation?.nameLength || 'Minimum 2 characters';
            isValid = false;
        }

        if (!email.trim()) {
            formErrors.email = content[$currentLanguage]?.contactForm?.validation?.emailRequired || 'Email required';
            isValid = false;
        } else if (!validateEmail(email)) {
            formErrors.email = content[$currentLanguage]?.contactForm?.validation?.emailInvalid || 'Invalid email';
            isValid = false;
        }

        if (!message.trim()) {
            formErrors.message = content[$currentLanguage]?.contactForm?.validation?.messageRequired || 'Message required';
            isValid = false;
        } else if (message.length < MIN_MESSAGE_LENGTH) {
            formErrors.message = content[$currentLanguage]?.contactForm?.validation?.messageLength || `Minimum ${MIN_MESSAGE_LENGTH} characters`;
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        if (!validateForm()) {
            // Zeige Validierungsfehler mit dem neuen Modal-System
            showWarning(content[$currentLanguage]?.contactForm?.validationErrorMessage || 'Please fix the form errors before submitting 🔍');
            return;
        }
        
        isSubmitting = true;
        
        // Clear any previous timeouts to prevent navigation issues
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
            redirectTimeout = null;
        }
        
        // Zeige "Sending"-Nachricht mit dem neuen Modal-System
        showSending(
            content[$currentLanguage]?.contactForm?.sendingMessage || 'Sending your message... 📨'
        );
        
        // Prepare email content with translations
        const emailText = content[$currentLanguage]?.contactForm?.emailText || {};
        
        const emailContent = {
            greeting: emailText.greeting || 'Hello',
            intro: emailText.intro || 'Thank you for contacting us.',
            doubleCheck: emailText.doubleCheck || "We've received your message with the following details:",
            button: emailText.button || 'Confirm Your Email',
            subject: emailText.subject || `Your message to Keymoji has been received`,
            privacy: emailText.privacy || 'Your data is handled securely.',
            footer: content[$currentLanguage]?.contactForm?.footerText || 'Developed with love',
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
                content[$currentLanguage]?.contactForm?.successMessage || 'Success! Message sent - We\'ll respond within 24 hours 🚀',
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
            showError(
                content[$currentLanguage]?.contactForm?.requestErrorMessage || 'Error sending the message. Please try again 🙁'
            );
        } finally {
            isSubmitting = false;
        }
    };

    // Clean up timeouts when component is destroyed
    onDestroy(() => {
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
        }
        
        // Ensure modal is closed when component is destroyed
        closeModal();
    });

    // Initialize component
    onMount(() => {
        // Clear any existing modal state
        closeModal();
        
        // Only in development mode: Test modal system
        if (process.env.NODE_ENV === 'development') {
            console.log('Testing modal system in development mode');
            setTimeout(() => {
                showSuccess('Modal system test', 2000);
            }, 500);
        }
    });

    $: isFormValid = name.trim().length >= 2 && 
                     validateEmail(email) && 
                     message.trim().length >= MIN_MESSAGE_LENGTH;
</script>

<Header />

<div class="min-h-screen" in:fly={{ y: 50, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
    <section class="flex flex-col justify-center items-center min-h-screen py-5 overflow-auto touch-none z-10 gap-4">
        <div class="content-wrapper pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60">
            <!-- Contact Form Content -->
            <div class="w-full md:pt-4 pt-2">
                <div class="flex md:flex-row flex-col md:mt-0 md:mb-4 my-3 md:pt-1 items-center bg-creme-80 dark:bg-aubergine-80 transition rounded-xl pb-2 px-4">
                    <div class="w-28 flex justify-center px-0 py-2">
                        <!-- Image container with hover effect -->
                        <div 
                            class="relative aspect-square w-28 cursor-pointer rounded-full overflow-hidden"
                            on:mouseenter={() => showRealImage = true}
                            on:mouseleave={() => showRealImage = false}
                        >
                            <div class="absolute inset-0 w-full h-full">
                            {#if showRealImage}
                                <img 
                                src={realAuthorImage} 
                                alt="Chris Matt - Creator of Keymoji the {content[$currentLanguage]?.index?.pageTitle}"
                                class="w-full h-full object-cover rounded-full"
                                in:scale={{duration: 300, start: 0.95}}
                                out:fade={{duration: 200}}
                                />
                            {/if}
                            
                            <img 
                                src={emoijSmirkingFace} 
                                alt={content[$currentLanguage]?.contactForm?.smirkingFaceImageAlt || "Keymoji creator smirking emoji"}
                                class="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
                                class:opacity-0={showRealImage}
                                while-loading={whileLoading}
                                on:load={handleImageLoad}
                            />
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-9/12 md:pl-3 md:pt-3 md:pb-2">
                        <h2 class="text-xl md:text-2xl font-semibold md:text-left mb-2 dark:text-white">{content[$currentLanguage]?.contactForm?.introductionTitle || "Contact Me"}</h2>
                        <p class="text-sm text-left dark:text-white">{content[$currentLanguage]?.contactForm?.introductionText || "I'd love to hear from you! Fill out the form below to get in touch."}</p>
                    </div>
                </div>
                
                <!-- Updated Form -->
                <form on:submit|preventDefault={handleSubmit} class="space-y-3">
                    <!-- Honeypot Field -->
                    <div class="hidden" aria-hidden="true">
                        <input type="text" name="website" bind:value={honeypot} autocomplete="off" tabindex="-1" />
                    </div>

                    <!-- Name & Email Fields -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label for="name" class="sr-only">{content[$currentLanguage]?.contactForm?.nameLabel || "Name"}</label>
                            <input
                                id="name"
                                type="text"
                                bind:value={name}
                                placeholder={content[$currentLanguage]?.contactForm?.nameLabel || "Name"}
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
                            <label for="email" class="sr-only">{content[$currentLanguage]?.contactForm?.emailLabel || "Email"}</label>
                            <input
                                id="email"
                                type="email"
                                bind:value={email}
                                placeholder={content[$currentLanguage]?.contactForm?.emailLabel || "Email"}
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
                        <label for="message" class="sr-only">{content[$currentLanguage]?.contactForm?.messageLabel || "Message"}</label>
                        <textarea
                            id="message"
                            bind:value={message}
                            placeholder={content[$currentLanguage]?.contactForm?.messageLabel || "Message"}
                            rows="3"
                            class="contact-input"
                            aria-invalid={!!formErrors.message}
                            aria-describedby={formErrors.message ? "message-error" : undefined}
                            disabled={isSubmitting}
                        ></textarea>
                        {#if formErrors.message}
                            <p id="message-error" class="form-error">{formErrors.message}</p>
                        {/if}
                    </div>

                    <!-- Newsletter Opt-In -->
                    <div class="flex items-center space-x-3 text-base font-medium dark:text-gray-light pb-2">
                        <input
                          id="newsletter"
                          type="checkbox"
                          bind:checked={newsletterOptIn}
                          class="h-5 w-5 contact-checkbox"
                          disabled={isSubmitting}
                        />
                        <label for="newsletter">{content[$currentLanguage]?.contactForm?.newsletterLabel || "Subscribe to newsletter"}</label>
                    </div>

                    <!-- Form Actions -->
                    <div class="grid md:grid-cols-2 gap-4 mt-6">
                        <button
                            type="button"
                            on:click={() => navigate(`/${$currentLanguage}`)}
                            class="btn-secondary"
                            disabled={isSubmitting}
                            aria-label={content[$currentLanguage]?.contactForm?.backToMainButton || "Back to main page"}
                        >
                            {content[$currentLanguage]?.contactForm?.backToMainButton || "Back to Main"}
                        </button>
                        
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            class="btn-primary {isSubmitting ? 'opacity-75 cursor-wait' : ''}"
                            aria-label={isSubmitting 
                                ? content[$currentLanguage]?.contactForm?.sendingButton || "Sending message"
                                : content[$currentLanguage]?.contactForm?.sendButton || "Send message"}
                            aria-busy={isSubmitting}
                        >
                            {#if isSubmitting}
                                <span class="flex items-center justify-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {content[$currentLanguage]?.contactForm?.sendingButton || "Sending..."}
                                </span>
                            {:else}
                                {content[$currentLanguage]?.contactForm?.sendButton || "Send Message"}
                            {/if}
                        </button>
                    </div>
                    
                    <!-- Debug button for development only -->
                    {#if process.env.NODE_ENV === 'development'}
                        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                            <button 
                                type="button" 
                                class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                                on:click={() => showModal('Test modal message', 'info', 5000)}
                            >
                                Test Modal (Dev Only)
                            </button>
                        </div>
                    {/if}
                </form>
            </div>
        </div>
    </section>
</div>

<FixedMenu align="bottom" />

<style>
    /* Ensure smooth transitions */
    .transition-opacity {
      will-change: opacity;
    }
  
    /* Prevent flickering during transition */
    img {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
  
    /* Force aspect ratio and prevent layout shift */
    .aspect-square {
      aspect-ratio: 1;
    }
  
    /* Optimize image rendering */
    .object-cover {
      object-fit: cover;
      font-family: 'object-fit: cover'; /* IE polyfill */
    }
  
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
    
    /* Focus styles for better accessibility */
    .contact-input:focus,
    .contact-checkbox:focus {
      outline: 2px solid #f4ab25;
      outline-offset: 2px;
    }
</style>