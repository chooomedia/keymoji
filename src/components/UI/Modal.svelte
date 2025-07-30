<!-- src/components/UI/Modal.svelte -->
<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import FocusManager from '../A11y/FocusManager.svelte';
    
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
    
    let imageLoaded = false;
    let modalRef;
    let lastActiveElement;
    let debugMode = isDebugMode();
    let isComponentMounted = false;

    // Constants for animation and accessibility
    const ANIMATION_DURATION = 300;
  
    // Icons for different message types
    const ICONS = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️',
        contact: '💌',
        sending: '📨'
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
            default: return '#2196F3';        // Blue for info
        }
    }
  
    // Choose appropriate icon
    function getIcon(type) {
        return ICONS[type] || ICONS.info;
    }
  
    // Handle manually closing the modal
    function handleCloseModal() {
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
        
        if (debugMode) {
            console.log('🔔 Modal component mounted');
        }
    });
    
    // Cleanup on component destroy
    onDestroy(() => {
        // Markiere Komponente als unmounted
        isComponentMounted = false;
        
        // Make sure we don't leave any modal state active when unmounting
        if (debugMode) {
            console.log('🔔 Modal component destroyed');
        }
    });

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
        class="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] z-50"
        on:click={handleBackdropClick}
        on:keydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        bind:this={modalRef}
        tabindex="-1"
        transition:fade={{ duration: ANIMATION_DURATION }}
    >
        <!-- Modal Content Container -->
        <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div 
                class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden pointer-events-auto"
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
                            <span class="text-2xl" style="color: {getIconColor(messageType)}">
                                {getIcon(messageType)}
                            </span>
                        {/if}
                        <h2 
                            id="modal-title"
                            class="text-lg font-semibold text-gray-900 dark:text-white"
                        >
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
                <div class="p-4">
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {message}
                    </p>
                    
                    <!-- Progress Bar for Account Actions -->
                    {#if $modalData?.progress !== undefined}
                        <div class="mt-4">
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                    class="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                                    style="width: {$modalData.progress}%"
                                ></div>
                            </div>
                        </div>
                    {/if}
                    
                    <!-- Custom Button if provided in modalData -->
                    {#if $modalData && $modalData.buttonText && $modalData.buttonAction}
                        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                on:click={$modalData.buttonAction}
                                class="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                {$modalData.buttonText}
                            </button>
                        </div>
                    {/if}
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
  
    /* Larger touch targets */
    button {
      min-height: 44px;
      min-width: 44px;
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