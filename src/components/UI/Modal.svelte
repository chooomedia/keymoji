<!-- src/components/UI/Modal.svelte -->
<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import FocusManager from '../A11y/FocusManager.svelte';
    import Button from './Button.svelte';
    
    // Import from the modal store
    import { 
        modalMessage, 
        isModalVisible, 
        modalType, 
        modalData, 
        closeModal 
    } from '../../../src/stores/modalStore.js';
  
    // Import for isDebugMode
    import { isDebugMode } from '../../../src/utils/environment.js';
  
    // State management
    $: message = $modalMessage;
    $: messageType = $modalType || getMessageType(message);
    $: showMessage = $isModalVisible && $modalMessage && $modalMessage.trim() !== '';
    
    // Debug: Log messageType changes
    $: if (debugMode && messageType) {
        console.log('🔔 Modal messageType:', messageType, 'isProFeature:', messageType === 'pro-feature');
    }
    
    let imageLoaded = false;
    let modalRef;
    let lastActiveElement;
    let debugMode = isDebugMode();
    let isComponentMounted = false;
    let progressBar = 100; // Start at 100%
    let progressInterval;

    // Constants for animation and accessibility
    const ANIMATION_DURATION = 300;
    const MODAL_TIMEOUT = 5000; // 5 seconds
    const PROGRESS_UPDATE_INTERVAL = 50; // Update every 50ms
  
    // Icons for different message types
    const ICONS = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️',
        contact: '💌',
        sending: '📨',
        'pro-feature': '💎'
    };

    // Loading spinner component
    function Spinner() {
        return `
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
    }
  
    // Message type detector als Fallback
    function getMessageType(msg) {
        if (!msg) return 'info';
        
        const lowerMsg = msg.toLowerCase();
        
        if (lowerMsg.includes('success') || lowerMsg.includes('sent') || lowerMsg.includes('received')) return 'success';
        if (lowerMsg.includes('sending') || lowerMsg.includes('processing')) return 'sending';
        if (lowerMsg.includes('error') || lowerMsg.includes('failed') || lowerMsg.includes('could not')) return 'error';
        if (lowerMsg.includes('warning') || lowerMsg.includes('invalid') || lowerMsg.includes('check')) return 'warning';
        if (lowerMsg.includes('fix') || lowerMsg.includes('validation')) return 'warning';
        if (lowerMsg.includes('contact') || lowerMsg.includes('message')) return 'contact';
        if (lowerMsg.includes('pro') || lowerMsg.includes('upgrade') || lowerMsg.includes('premium')) return 'pro-feature';
        
        return 'info';
    }
  
    // Set color based on message type
    function getIconColor(type) {
        switch (type) {
            case 'success': return '#4CAF50'; // Green
            case 'error': return '#F44336';   // Red
            case 'warning': return '#FF9800'; // Orange
            case 'contact': return '#f4ab25'; // Keymoji yellow
            case 'sending': return '#2196F3'; // Blue
            case 'pro-feature': return '#9333EA'; // Purple
            default: return '#2196F3';        // Blue for info
        }
    }
  
    // Choose appropriate icon
    function getIcon(type) {
        return ICONS[type] || ICONS.info;
    }
  
    // Handle manually closing the modal
    function handleCloseModal() {
        // Stop progress bar
        stopProgressBar();
        
        if (debugMode) {
            console.log('🔔 Modal manually closed:', { message, type: messageType });
        }
        closeModal();
    }
  
    // Keyboard handlers
    function handleKeydown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            handleCloseModal();
        }
    }
  
    function handleImageLoad() {
        imageLoaded = true;
    }
  
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            handleCloseModal();
        }
    }
    
    // Component lifecycle
    onMount(() => {
        // Markiere Komponente als gemountet
        isComponentMounted = true;
        
        // Save current focused element
        lastActiveElement = document.activeElement;
        
        // Verhindert Scrollbar-Hüpfen bei Modal-Öffnung
        document.body.classList.add('modal-open');
        
        if (debugMode) {
            console.log('🔔 Modal component mounted');
        }
    });
    
    // Cleanup on component destroy
    onDestroy(() => {
        // Markiere Komponente als unmounted
        isComponentMounted = false;
        
        // Clear progress interval
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        // Entferne Modal-Open Klasse
        document.body.classList.remove('modal-open');
        
        // Make sure we don't leave any modal state active when unmounting
        if (debugMode) {
            console.log('🔔 Modal component destroyed');
        }
    });

    // Start progress bar when modal becomes visible
    $: if (showMessage && isComponentMounted) {
        startProgressBar();
    }

    // Progress bar management
    function startProgressBar() {
        // Reset progress bar
        progressBar = 100;
        
        // Clear existing interval
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        // Start progress bar countdown
        progressInterval = setInterval(() => {
            progressBar -= (100 / (MODAL_TIMEOUT / PROGRESS_UPDATE_INTERVAL));
            
            if (progressBar <= 0) {
                progressBar = 0;
                clearInterval(progressInterval);
                // Auto-close modal when progress reaches 0
                setTimeout(() => {
                    if (showMessage) {
                        handleCloseModal();
                    }
                }, 100);
            }
        }, PROGRESS_UPDATE_INTERVAL);
    }

    function stopProgressBar() {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
    }

    // Calculate remaining time in seconds
    $: remainingSeconds = Math.round(progressBar / 20); // 100% = 5 seconds

    // Debug reactive statement
    $: if (debugMode && showMessage && isComponentMounted) {
        console.log('🔔 Modal state changed:', {
            message,
            type: messageType,
            isVisible: $isModalVisible,
            hasData: Object.keys($modalData).length > 0
        });
    }
</script>

{#if showMessage && isComponentMounted}
    <!-- Modal Overlay -->
    <div 
        class="modal-overlay modal-force-top"
        on:click={handleBackdropClick}
        on:keydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        bind:this={modalRef}
        tabindex="-1"
        data-modal="true"
        transition:fade={{ duration: ANIMATION_DURATION }}
    >
        <!-- Modal Content Container -->
        <div class="modal-container">
            <div 
                class="modal-content"
                transition:fly={{ y: 20, duration: ANIMATION_DURATION }}
                role="document"
            >
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center space-x-3">
                        {#if $modalData?.showSpinner}
                            <div class="text-2xl">
                                {@html Spinner()}
                            </div>
                        {:else}
                            <span class="text-2xl modal-icon" style="color: {getIconColor(messageType)}">
                                {getIcon(messageType)}
                            </span>
                        {/if}
                        <h2 
                            id="modal-title"
                            class="text-lg font-semibold text-gray-900 dark:text-white">
                            {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
                        </h2>
                    </div>
                    
                    <!-- Close Button -->
                    <button
                        on:click={handleCloseModal}
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="pt-4 px-4">
                    <!-- Pro Feature Content -->
                    {#if messageType === 'pro-feature'}
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {$modalData?.featureName || 'Pro Feature'}
                            </h4>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">
                                {$modalData?.featureDescription || message}
                            </p>
                            
                            <!-- Pro Benefits -->
                            <div class="bg-powder-500 dark:bg-aubergine-900 rounded-lg border border-purple-700 p-4 mb-4">
                                <h5 class="font-semibold text-purple-700 dark:text-purple-100 mb-2">
                                    Pro Benefits:
                                </h5>
                                <ul class="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        Unlimited emoji generations
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        Advanced security features
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        Priority support
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        Early access to new features
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Pro Feature Actions moved to footer -->
                    {:else}
                        <!-- Modal Message -->
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {$modalMessage}
                        </p>
                        
                        <!-- Custom Buttons moved to footer -->
                    {/if}
                </div>

                <!-- Modal Footer with Buttons - Outside of if/else for all modal types -->
                <div class="mt-4 pt-3">
                    <!-- Buttons Section with same padding as content -->
                    {#if messageType === 'pro-feature'}
                        <!-- Pro Feature Buttons -->
                        <div class="flex gap-3 mb-4 px-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                fullWidth={true}
                                on:click={handleCloseModal}
                            >
                                Maybe Later
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                fullWidth={true}
                                on:click={() => {
                                    if ($modalData?.onUpgrade) {
                                        $modalData.onUpgrade();
                                    }
                                    handleCloseModal();
                                }}
                            >
                                Upgrade to Pro
                            </Button>
                        </div>
                    {:else if $modalData?.primaryButton || $modalData?.secondaryButton}
                        <!-- Custom Buttons -->
                        <div class="flex gap-3 mb-4 px-4 rounded-b-xl">
                            {#if $modalData.secondaryButton}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    fullWidth={true}
                                    on:click={$modalData.secondaryButton.action}
                                >
                                    {$modalData.secondaryButton.text}
                                </Button>
                            {/if}
                            {#if $modalData.primaryButton}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    fullWidth={true}
                                    on:click={$modalData.primaryButton.action}
                                >
                                    {$modalData.primaryButton.text}
                                </Button>
                            {/if}
                        </div>
                    {/if}
                    
                    <!-- Auto-Close Progress Bar -->
                    <div class="w-full bg-gray-200 dark:bg-gray-700 h-1">
                        <div 
                            class="h-1 transition-all duration-500 ease-out"
                            style="width: {progressBar}%; background-color: {getIconColor(messageType)}"
                        ></div>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-center p-4">
                        Modal schließt in {remainingSeconds} Sekunden
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Focus Management -->
{#if showMessage && isComponentMounted}
    <FocusManager 
        bind:this={modalRef}
        on:close={handleCloseModal}
    />
{/if}
  
<style>
    /* Optimize performance with composited animations */
    div {
      will-change: opacity, transform;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
  
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
</style>