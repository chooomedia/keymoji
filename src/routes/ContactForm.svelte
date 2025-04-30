<script>
    import { onMount } from 'svelte';
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
    let honeypot = ''; // Hidden field to catch bots
    let emoijSmirkingFace = '../images/keymoji-animated-optimize-resize-160x160px.webp';
    let realAuthorImage = '../images/chris-matt-keymoji-creator-frontend-developer.png';
    let isImageLoaded = false;
    let isSubmitting = false;
    let showRealImage = false;
    let formStartTime = Date.now(); // Track when form was loaded
    
    // Form validation state
    let formErrors = {
      name: '',
      email: '',
      message: ''
    };
  
    // Constants for validation
    const MIN_MESSAGE_LENGTH = 10;
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Get rate limiting settings from API config
    const MAX_SUBMISSIONS = API_CONFIG.RATE_LIMITING.MAX_SUBMISSIONS_PER_EMAIL || 3;
    const SUBMISSION_WINDOW_HOURS = API_CONFIG.RATE_LIMITING.SUBMISSION_WINDOW_HOURS || 24;
  
    function validateEmail(email) {
      return EMAIL_REGEX.test(String(email).toLowerCase());
    }
  
    function navigateToHome() {
      navigate(`/${$currentLanguage}`, { replace: true });
    }
  
    function validateForm() {
      // Reset previous errors
      formErrors = {
        name: '',
        email: '',
        message: ''
      };
  
      let isValid = true;
  
      // Name validation
      if (!name.trim()) {
        formErrors.name = content[$currentLanguage].contactForm.validation?.nameRequired || 'Name is required';
        isValid = false;
      } else if (name.trim().length < 2) {
        formErrors.name = content[$currentLanguage].contactForm.validation?.nameLength || 'Name must be at least 2 characters';
        isValid = false;
      }
  
      // Email validation
      if (!email.trim()) {
        formErrors.email = content[$currentLanguage].contactForm.validation?.emailRequired || 'Email is required';
        isValid = false;
      } else if (!validateEmail(email)) {
        formErrors.email = content[$currentLanguage].contactForm.validation?.emailInvalid || 'Please enter a valid email address';
        isValid = false;
      }
  
      // Message validation
      if (!message.trim()) {
        formErrors.message = content[$currentLanguage].contactForm.validation?.messageRequired || 'Message is required';
        isValid = false;
      } else if (message.trim().length < MIN_MESSAGE_LENGTH) {
        formErrors.message = content[$currentLanguage].contactForm.validation?.messageLength || 
          `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
        isValid = false;
      }
  
      return isValid;
    }
  
    function handleImageLoad() {
      isImageLoaded = true;
    }
    
    // Check submission history for rate limiting
    function checkSubmissionAllowed(email) {
      try {
        const submissionHistory = JSON.parse(localStorage.getItem('emailSubmissionHistory')) || {};
        const userSubmissions = submissionHistory[email] || [];
        const now = Date.now();
        
        // Only count submissions within the time window
        const recentSubmissions = userSubmissions.filter(timestamp => {
          return (now - timestamp) < (SUBMISSION_WINDOW_HOURS * 60 * 60 * 1000);
        });
        
        // Check if over the limit
        if (recentSubmissions.length >= MAX_SUBMISSIONS) {
          const oldestSubmission = Math.min(...recentSubmissions);
          const timeRemaining = SUBMISSION_WINDOW_HOURS * 60 * 60 * 1000 - (now - oldestSubmission);
          const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));
          
          return {
            allowed: false,
            hoursRemaining
          };
        }
        
        return { allowed: true };
      } catch (error) {
        console.warn('Error checking submission history:', error);
        // Allow submission if there's a localStorage error
        return { allowed: true };
      }
    }
    
    // Record successful submission for rate limiting
    function recordSubmission(email) {
      try {
        const submissionHistory = JSON.parse(localStorage.getItem('emailSubmissionHistory')) || {};
        const userSubmissions = submissionHistory[email] || [];
        
        // Add current timestamp
        userSubmissions.push(Date.now());
        
        // Clean up old entries to prevent localStorage bloat
        const now = Date.now();
        const prunedSubmissions = userSubmissions.filter(timestamp => {
          return (now - timestamp) < (7 * 24 * 60 * 60 * 1000); // Keep 7 days of history
        });
        
        // Update localStorage
        submissionHistory[email] = prunedSubmissions;
        localStorage.setItem('emailSubmissionHistory', JSON.stringify(submissionHistory));
      } catch (error) {
        console.warn('Error recording submission:', error);
        // Non-critical error
      }
    }
  
    // Submit the form
    async function handleSubmit() {
  // Prevent multiple submissions
  if (isSubmitting) return;
  
  // Client-side validation
  if (!validateForm()) {
    return;
  }
  
  // Check rate limiting
  const submissionCheck = checkSubmissionAllowed(email);
  if (!submissionCheck.allowed) {
    modalMessage.set(content[$currentLanguage].contactForm.timeoutMessage?.replace('{hours}', submissionCheck.hoursRemaining) || 
      `Please wait ${submissionCheck.hoursRemaining} hours before sending another message.`);
    return;
  }
  
  // Set submitting state
  isSubmitting = true;
  
  try {
    // Calculate how long the form has been filled
    const formTime = Date.now() - formStartTime;
    
    // Debug-Ausgabe des API-Endpunkts
    console.log("Sende Formular an:", WEBHOOKS.CONTACT.SEND_MAIL);
    
    // Send the form data to the API
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
        formTime,
        honeypot,
        locale: $currentLanguage
      })
    }).catch(error => {
      console.error("Netzwerkfehler beim Absenden des Formulars:", error);
      throw new Error(`Netzwerkfehler: ${error.message}. Bitte stellen Sie sicher, dass der Server läuft und erreichbar ist.`);
    });
    
    if (!response) {
      throw new Error("Keine Antwort vom Server erhalten");
    }
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      // Success with no JSON
      data = { success: true };
    } else {
      // Parse JSON response
      data = await response.json().catch(e => {
        console.error("Fehler beim Parsen der JSON-Antwort:", e);
        return { success: false, error: "Ungültiges Antwortformat vom Server" };
      });
    }
    
    if (data.success) {
      // Record successful submission
      recordSubmission(email);
      
      // Show success message
      modalMessage.set(content[$currentLanguage].contactForm.successMessage);
      
      // Reset form
      resetForm();
      
      // Redirect after success
      setTimeout(() => {
        navigate(`/${$currentLanguage}`, { replace: true });
      }, 3000);
    } else {
      // Handle API error
      throw new Error(data.error || 'Unknown server error');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    
    let errorMessage = content[$currentLanguage].contactForm.errorMessage;
    
    // Zeige detailliertere Fehlermeldung im Entwicklungsmodus
    if (process.env.NODE_ENV === 'development') {
      errorMessage += ` (${error.message})`;
    }
    
    modalMessage.set(errorMessage);
  } finally {
    isSubmitting = false;
  }
}
    
    // Reset form fields
    function resetForm() {
      name = '';
      email = '';
      message = '';
      honeypot = '';
      formStartTime = Date.now();
    }
  
    // Track form validity for submit button state
    $: isFormValid = name.trim().length >= 2 && 
                     validateEmail(email) && 
                     message.trim().length >= MIN_MESSAGE_LENGTH;
    
    // Reset form timer when component mounts
    onMount(() => {
      formStartTime = Date.now();
    });
</script>
  
<!-- Header Component -->
<Header />
  
<!-- Main Content Wrapper -->
<div class="min-h-screen" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
    <section class="flex flex-col justify-center items-center min-h-screen py-5 overflow-auto touch-none z-10 gap-4">
      
      <!-- Main container -->
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
          
          <form on:submit|preventDefault={handleSubmit} aria-live="polite">
            <!-- Honeypot field - hidden from real users but bots will fill it -->
            <div class="hidden" aria-hidden="true">
              <input 
                type="text" 
                name="website" 
                tabindex="-1"
                bind:value={honeypot} 
                autocomplete="off"
              />
            </div>
            
            <div class="flex flex-wrap -mx-3 my-2">
              <div class="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                <label for="name" class="sr-only">{content[$currentLanguage].contactForm.nameLabel}</label>
                <input 
                  class="appearance-none block w-full dark:text-white text-gray-dark rounded-2xl pt-4 pb-3 px-4 md:mb-3 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow {formErrors.name ? 'border-red-500 ring-1 ring-red-500' : ''}" 
                  id="name" 
                  type="text" 
                  bind:value={name} 
                  placeholder={content[$currentLanguage].contactForm.nameLabel}
                  required
                  minlength="2"
                  maxlength="50"
                  autocomplete="name"
                />
                {#if formErrors.name}
                  <p class="text-red-500 text-xs mt-1" id="name-error" aria-live="assertive">{formErrors.name}</p>
                {/if}
              </div>
              <div class="w-full md:w-1/2 px-3">
                <label for="email" class="sr-only">{content[$currentLanguage].contactForm.emailLabel}</label>
                <input 
                  class="appearance-none block w-full dark:text-white text-gray-dark rounded-2xl pt-4 pb-3 px-4 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow {formErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''}" 
                  id="email" 
                  type="email" 
                  bind:value={email} 
                  placeholder={content[$currentLanguage].contactForm.emailLabel}
                  required
                  autocomplete="email"
                />
                {#if formErrors.email}
                  <p class="text-red-500 text-xs mt-1" id="email-error" aria-live="assertive">{formErrors.email}</p>
                {/if}
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 my-2">
              <div class="w-full px-3">
                <label for="message" class="sr-only">{content[$currentLanguage].contactForm.messageLabel}</label>
                <textarea 
                  class="appearance-none block w-full dark:text-white text-gray-dark rounded-2xl pt-4 pb-3 px-4 md:mb-3 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow {formErrors.message ? 'border-red-500 ring-1 ring-red-500' : ''}" 
                  id="message" 
                  bind:value={message} 
                  placeholder={content[$currentLanguage].contactForm.messageLabel}
                  required
                  minlength={MIN_MESSAGE_LENGTH}
                  rows="4"
                />
                {#if formErrors.message}
                  <p class="text-red-500 text-xs mt-1" id="message-error" aria-live="assertive">{formErrors.message}</p>
                {/if}
              </div>
            </div>
            <div class="flex space-x-4 mb-4 md:mb-0">
              <button
                type="button"
                aria-label={content[$currentLanguage].contactForm.backToMainButton}
                on:click={navigateToHome}
                class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-powder"
              >
                {content[$currentLanguage].contactForm.backToMainButton}
              </button>
            
              <button
                type="submit"
                aria-label={isSubmitting ? content[$currentLanguage].contactForm.sendingButton || 'Sending...' : content[$currentLanguage].contactForm.sendButton}
                disabled={!isFormValid || isSubmitting}
                class="bg-yellow text-black shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow {!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}"
              >
                {isSubmitting ? 
                  content[$currentLanguage].contactForm.sendingButton || 'Sending...' : 
                  content[$currentLanguage].contactForm.sendButton}
              </button>
            </div>
            <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>{content[$currentLanguage].contactForm.privacyNote || 'Your data will be processed according to our privacy policy.'}</p>
            </div>
          </form>
        </div>
      </div>
      
    </section>
</div>
  
<!-- Fixed Menu -->
<FixedMenu align={'bottom'} />
  
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
  
  /* Accessibility improvements */
  :global(button:focus-visible),
  :global(input:focus-visible),
  :global(textarea:focus-visible) {
    outline: 2px solid #f4ab25;
    outline-offset: 2px;
  }
  
  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .transition-opacity,
    .transform {
      transition: none !important;
    }
  }
</style>