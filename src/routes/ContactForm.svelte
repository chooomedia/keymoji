<script>
    import { modalMessage, currentLanguage } from '../stores/appStores.js';
    import content from '../content.js';
    import { navigate } from "svelte-routing";
    import { fade, fly, scale } from 'svelte/transition';
    import Header from '../Header.svelte';
    import FixedMenu from '../widgets/FixedMenu.svelte';
    import { WEBHOOKS, API_CONFIG } from '../config/api.js';

    // Form state
    let name = '';
    let email = '';
    let message = '';
    let newsletterOptIn = false;
    let honeypot = ''; // Hidden honeypot field
    let emoijSmirkingFace = '../images/keymoji-animated-optimize-resize-160x160px.webp',
        realAuthorImage = '../images/chris-matt-keymoji-creator-frontend-developer.png',
        whileLoading = "😏",
        isImageLoaded = false,
        showRealImage = false;
    let isSubmitting = false;
    let formErrors = {
        name: '',
        email: '',
        message: ''
    };

    function handleImageLoad() {
      isImageLoaded = true;
    }

    // Constants
    const MIN_MESSAGE_LENGTH = 10;
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // Validation functions
    const validateEmail = (email) => EMAIL_REGEX.test(email);
    
    const validateForm = () => {
        formErrors = { name: '', email: '', message: '' };
        let isValid = true;

        if (!name.trim()) {
            formErrors.name = content[$currentLanguage].contactForm.validation?.nameRequired || 'Name required';
            isValid = false;
        } else if (name.length < 2) {
            formErrors.name = content[$currentLanguage].contactForm.validation?.nameLength || 'Minimum 2 characters';
            isValid = false;
        }

        if (!email.trim()) {
            formErrors.email = content[$currentLanguage].contactForm.validation?.emailRequired || 'Email required';
            isValid = false;
        } else if (!validateEmail(email)) {
            formErrors.email = content[$currentLanguage].contactForm.validation?.emailInvalid || 'Invalid email';
            isValid = false;
        }

        if (!message.trim()) {
            formErrors.message = content[$currentLanguage].contactForm.validation?.messageRequired || 'Message required';
            isValid = false;
        } else if (message.length < MIN_MESSAGE_LENGTH) {
            formErrors.message = content[$currentLanguage].contactForm.validation?.messageLength || `Minimum ${MIN_MESSAGE_LENGTH} characters`;
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (isSubmitting || !validateForm()) return;
        
        isSubmitting = true;

        // Sicherstellen, dass emailText existiert
        const emailText = content[$currentLanguage]?.contactForm?.emailText || {};
        
        // Email-Template-Inhalt mit Fallbacks
        const emailContent = {
            greeting: emailText.greeting || 'Hello',
            intro: emailText.intro || 'Thank you for contacting us.',
            doubleCheck: emailText.doubleCheck || "We've received your message with the following details:",
            button: emailText.button || 'Confirm Your Email',
            privacy: emailText.privacy || 'Your data is handled securely according to our privacy policy.',
            footer: content[$currentLanguage]?.contactForm?.footerText || 'Developed with love'
        };

        try {
            console.log('Sending to:', WEBHOOKS.CONTACT.SEND_MAIL);
            console.log('Email content:', emailContent);
            
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
                    emailContent
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error');
            }

            modalMessage.set(content[$currentLanguage].contactForm.successMessage || 'Message sent successfully!');
            
            // Reset form
            name = email = message = honeypot = '';
            newsletterOptIn = false;

            setTimeout(() => navigate(`/${$currentLanguage}`), 3000);
        } catch (error) {
            console.error('Submission error:', error);
            modalMessage.set(content[$currentLanguage].contactForm.errorMessage || 'There was an error sending your message. Please try again.');
        } finally {
            isSubmitting = false;
        }
    };

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
                                alt="Chris Matt - Creator of Keymoji the {content[$currentLanguage].index.pageTitle}"
                                class="w-full h-full object-cover rounded-full"
                                in:scale={{duration: 300, start: 0.95}}
                                out:fade={{duration: 200}}
                                />
                            {/if}
                            
                            <img 
                                src={emoijSmirkingFace} 
                                alt={content[$currentLanguage].contactForm.smirkingFaceImageAlt}
                                class="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
                                class:opacity-0={showRealImage}
                                while-loading={whileLoading}
                                on:load={handleImageLoad}
                            />
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-9/12 md:pl-3 md:pt-3 md:pb-2">
                        <h2 class="text-xl md:text-2xl font-semibold md:text-left mb-2 dark:text-white">{content[$currentLanguage].contactForm.introductionTitle}</h2>
                        <p class="text-sm text-left dark:text-white">{content[$currentLanguage].contactForm.introductionText}</p>
                    </div>
                </div>
                
                <!-- Updated Form -->
                <form on:submit|preventDefault={handleSubmit} class="space-y-3">
                    <!-- Honeypot Field -->
                    <div class="hidden" aria-hidden="true">
                        <input type="text" name="website" bind:value={honeypot} autocomplete="off" />
                    </div>

                    <!-- Name & Email Fields -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                bind:value={name}
                                placeholder={content[$currentLanguage].contactForm.nameLabel}
                                class="contact-input"
                                aria-invalid={!!formErrors.name}
                            />
                            {#if formErrors.name}
                                <p class="form-error">{formErrors.name}</p>
                            {/if}
                        </div>
                        
                        <div>
                            <input
                                type="email"
                                bind:value={email}
                                placeholder={content[$currentLanguage].contactForm.emailLabel}
                                class="contact-input"
                                aria-invalid={!!formErrors.email}
                            />
                            {#if formErrors.email}
                                <p class="form-error">{formErrors.email}</p>
                            {/if}
                        </div>
                    </div>

                    <!-- Message Field -->
                    <div>
                        <textarea
                            bind:value={message}
                            placeholder={content[$currentLanguage].contactForm.messageLabel}
                            rows="4"
                            class="contact-input"
                            aria-invalid={!!formErrors.message}
                        ></textarea>
                        {#if formErrors.message}
                            <p class="form-error">{formErrors.message}</p>
                        {/if}
                    </div>

                    <!-- Newsletter Opt-In -->
                    <label class="flex items-center space-x-3 text-base font-medium dark:text-gray-light pb-2">
                        <input
                          type="checkbox"
                          bind:checked={newsletterOptIn}
                          class="h-5 w-5 contact-checkbox"
                        />
                        <span>{content[$currentLanguage].contactForm.newsletterLabel}</span>
                    </label>

                    <!-- Form Actions -->
                    <div class="grid md:grid-cols-2 gap-4 mt-6">
                        <button
                            type="button"
                            on:click={() => navigate(`/${$currentLanguage}`)}
                            class="btn-secondary"
                        >
                            {content[$currentLanguage].contactForm.backToMainButton}
                        </button>
                        
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            class="btn-primary {isSubmitting ? 'opacity-75 cursor-wait' : ''}"
                        >
                            {isSubmitting 
                                ? content[$currentLanguage].contactForm.sendingButton || 'Sending ...'
                                : content[$currentLanguage].contactForm.sendButton}
                        </button>
                    </div>
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
</style>