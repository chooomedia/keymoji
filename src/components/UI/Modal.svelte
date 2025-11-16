<!--
Modal component for displaying messages, notifications, and dialogs.
Handles different message types, auto-dismiss timers, and accessibility features.
Manages focus trapping and keyboard navigation.
-->
<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import FocusManagerComponent from '../A11y/FocusManager.svelte';
    import ButtonComponent from './Button.svelte';
    import { 
        modalMessage, 
        isModalVisible, 
        modalType, 
        modalData, 
        closeModal
    } from '../../stores/modalStore';
    import { get } from 'svelte/store';
    import { isDebugMode } from '../../utils/environment';
    import { translations } from '../../stores/contentStore';
    import type { ButtonVariant } from '../../types/ComponentProps';

    function debugModal() {
        if (!isDebugMode()) return;
        console.group('🔍 Modal Debug');
        console.log('State:', {
            isVisible: get(isModalVisible),
            message: get(modalMessage),
            messageType: get(modalType),
            modalData: get(modalData)
        });
        console.groupEnd();
    }

    const FocusManager = FocusManagerComponent;
    const Button = ButtonComponent;

    // Werte aus Stores als Runes-Values ableiten
    // PERFORMANCE: $derived() statt $derived.by() für einfache Store-Zugriffe
    // $derived.by() nur für komplexe Berechnungen mit mehreren Schritten
    const message = $derived(get(modalMessage));
    const isVisible = $derived(get(isModalVisible));
    const modalState = $derived(get(modalData));
    // messageType benötigt .by() weil es eine Funktion aufruft
    const messageType = $derived.by(
        () => get(modalType) || getMessageType(message)
    );
    const showMessage = $derived(
        isVisible && !!message && message.trim() !== ''
    );
    
    let modalRef: HTMLElement | null = $state(null);
    let isComponentMounted = $state(false);
    let progressBar = $state(100);
    let progressInterval: ReturnType<typeof setInterval> | null = null;
    

    // Constants for animation and accessibility
    const ANIMATION_DURATION = 300;
    const MODAL_TIMEOUT = 5000; // 5 seconds
  
    // Icons for different message types
    const ICONS: Record<string, string> = {
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
  
    function getMessageType(msg: string): string {
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
  
    function getIconColor(type: string): string {
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
  
    function getIcon(type: string): string {
        return ICONS[type] || ICONS.info || 'ℹ️';
    }
  
    function handleCloseModal() {
        stopProgressBar();
        debugModal();
        closeModal();
    }
  
    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            event.preventDefault();
            handleCloseModal();
        }
    }
  
    function handleBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            handleCloseModal();
        }
    }
    
    onMount(() => {
        isComponentMounted = true;
        document.body.classList.add('modal-open');
        debugModal();
    });
    
    onDestroy(() => {
        isComponentMounted = false;
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        document.body.classList.remove('modal-open');
    });

    // Start progress bar when modal becomes visible
    // FIX: Track if progress bar was started to prevent multiple starts
    let progressBarStarted = $state(false);
    $effect(() => {
        if (showMessage && isComponentMounted && !progressBarStarted) {
            progressBarStarted = true;
            startProgressBar();
        } else if (!showMessage) {
            // Reset flag when modal closes
            progressBarStarted = false;
            stopProgressBar();
        }
    });

    function startProgressBar(): void {
        const duration = (typeof modalState?.duration === 'number' ? modalState.duration : MODAL_TIMEOUT);
        
        // Only start progress bar if duration is set and > 0
        if (!duration || duration <= 0) {
            progressBar = 0;
            return;
        }
        
        // Reset progress bar
        progressBar = 100;
        
        // Clear existing interval
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        // Calculate update interval based on duration
        const updateInterval = Math.max(50, duration / 100); // At least 50ms, max 100 updates
        
        // Start progress bar countdown
        progressInterval = setInterval(() => {
            const decrement = (100 * updateInterval) / duration;
            progressBar -= decrement;
            
            if (progressBar <= 0) {
                progressBar = 0;
                if (progressInterval) {
                    clearInterval(progressInterval);
                    progressInterval = null;
                }
                // Auto-close modal when progress reaches 0
                setTimeout(() => {
                    if (showMessage) {
                        handleCloseModal();
                    }
                }, 100);
            }
        }, updateInterval);
    }

    function stopProgressBar(): void {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    const remainingSeconds = $derived.by(() => {
        const duration = (typeof modalState?.duration === 'number' ? modalState.duration : MODAL_TIMEOUT);
        if (!duration || duration <= 0) return 0;
        return Math.round((progressBar / 100) * (duration / 1000));
    });

</script>

{#if showMessage && isComponentMounted}
    <!-- Modal Overlay -->
    <div 
        class="modal-overlay modal-force-top"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
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
                        {#if modalState?.showSpinner}
                            <div class="text-2xl">
                                {@html Spinner()}
                            </div>
                        {:else if modalState?.icon}
                            <span class="text-2xl modal-icon">
                                {modalState.icon}
                            </span>
                        {:else}
                            <span class="text-2xl modal-icon" style="color: {getIconColor(messageType)}">
                                {getIcon(messageType)}
                            </span>
                        {/if}
                        <h2 
                            id="modal-title"
                            class="text-lg font-semibold text-gray-900 dark:text-white">
                            {modalState?.title || messageType.charAt(0).toUpperCase() + messageType.slice(1)}
                        </h2>
                    </div>
                    
                    <!-- Close Button -->
                    <button
                        onclick={handleCloseModal}
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                        aria-label={(get(translations) as Record<string, any>)?.modals?.closeModal || 'Close modal'}
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-4" class:pb-0="{true}">
                    <!-- Pro Feature Content -->
                    {#if messageType === 'pro-feature'}
                        {@const t = get(translations) as Record<string, any>}
                        {@const accountManager = t?.accountManager as Record<string, any> | undefined}
                        {@const proFeatureModal = accountManager?.proFeatureModal as Record<string, any> | undefined}
                        <div class="mb-6">
                            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {modalState?.featureName || proFeatureModal?.title || 'Pro Feature'}
                            </h4>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">
                                {modalState?.featureDescription || message}
                            </p>
                            
                            <!-- Pro Benefits -->
                            <div class="bg-powder-500 dark:bg-aubergine-900 rounded-lg border border-purple-700 p-4 mb-4">
                                <h5 class="font-semibold text-purple-700 dark:text-purple-100 mb-2">
                                    {proFeatureModal?.proBenefits || 'Pro Benefits:'}
                                </h5>
                                <ul class="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        {proFeatureModal?.unlimitedGenerations || 'Unlimited emoji generations'}
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        {proFeatureModal?.advancedSecurity || 'Advanced security features'}
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        {proFeatureModal?.prioritySupport || 'Priority support'}
                                    </li>
                                    <li class="flex items-center">
                                        <span class="mr-2">✓</span>
                                        {proFeatureModal?.earlyAccess || 'Early access to new features'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    {:else if modalState?.content}
                        <!-- Custom Content -->
                        {@const content = modalState.content as { title?: string; description?: string; html?: string } | undefined}
                        {#if content}
                            <div class="mb-6">
                                {#if content.title}
                                    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        {content.title}
                                    </h4>
                                {/if}
                                {#if content.description}
                                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                                        {content.description}
                                    </p>
                                {/if}
                                {#if content.html}
                                    <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {@html content.html}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    {:else}
                        <!-- Default Modal Message -->
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {modalMessage}
                        </p>
                    {/if}
                </div>

                <!-- Modal Footer with Buttons - Outside of if/else for all modal types -->
                <div class="modal-footer mt-4 pt-3">
                    <!-- Buttons Section with same padding as content -->
                    {#if messageType === 'pro-feature'}
                        <!-- Pro Feature Buttons -->
                        {@const t = get(translations) as Record<string, any>}
                        {@const accountManager = t?.accountManager as Record<string, any> | undefined}
                        {@const proFeatureModal = accountManager?.proFeatureModal as Record<string, any> | undefined}
                        {#if proFeatureModal}
                            <div class="flex gap-3 mb-4 px-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                fullWidth={true}
                                onclick={handleCloseModal}
                            >
                                {proFeatureModal?.maybeLater || 'Maybe Later'}
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                fullWidth={true}
                                onclick={() => {
                                    const onUpgrade = modalState?.onUpgrade;
                                    if (typeof onUpgrade === 'function') {
                                        onUpgrade();
                                    }
                                    handleCloseModal();
                                }}
                            >
                                {proFeatureModal?.upgradeToPro || 'Upgrade to Pro'}
                            </Button>
                            </div>
                        {/if}
                    {:else if modalState?.primaryButton || modalState?.secondaryButton}
                        <!-- Custom Buttons -->
                        {@const primaryButton = modalState.primaryButton as { text: string; action: () => void } | undefined}
                        {@const secondaryButton = modalState.secondaryButton as { text: string; action: () => void } | undefined}
                        {#if primaryButton || secondaryButton}
                            <div class="flex gap-3 mb-4 px-4">
                            {#if secondaryButton}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    fullWidth={true}
                                    onclick={secondaryButton.action}
                                >
                                    {secondaryButton.text}
                                </Button>
                            {/if}
                            {#if primaryButton}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    fullWidth={true}
                                    onclick={primaryButton.action}
                                >
                                    {primaryButton.text}
                                </Button>
                            {/if}
                            </div>
                        {/if}
                    {:else if modalState?.buttons}
                        <!-- Dynamic Button Array -->
                        {@const buttons = modalState.buttons as Array<{ text: string; variant?: string; action: () => void }> | undefined}
                        {#if buttons && Array.isArray(buttons)}
                            <div class="flex gap-3 mb-4 px-4">
                                {#each buttons as button}
                                    <Button
                                        variant={(button.variant || 'secondary') as ButtonVariant}
                                        size="sm"
                                        fullWidth={true}
                                        onclick={button.action}
                                    >
                                        {button.text}
                                    </Button>
                                {/each}
                            </div>
                        {/if}
                    {/if}
                    
                    <!-- Auto-Close Progress Bar - Show for all modals with duration -->
                    {#if showMessage && progressBar > 0 && remainingSeconds > 0}
                        {@const t = get(translations) as Record<string, any>}
                        {@const modals = t?.modals as Record<string, any> | undefined}
                        <div class="w-full h-1">
                            <div 
                                class="h-1 transition-all duration-500 ease-out z-10"
                                style="width: {progressBar}%; background-color: {getIconColor(messageType)}"
                            ></div>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 text-center p-4">
                            {remainingSeconds === 1 
                                ? (modals?.modalClosesInSingular || 'Modal closes in {seconds} second').replace('{seconds}', String(remainingSeconds))
                                : (modals?.modalClosesIn || 'Modal closes in {seconds} seconds').replace('{seconds}', String(remainingSeconds))
                            }
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Focus Management -->
{#if showMessage && isComponentMounted && modalRef}
    <FocusManager 
        active={true}
        initialFocus={modalRef}
        restoreFocus={true}
        returnFocusOnEscape={true}
        autoFocus={true}
        loop={true}
    />
{/if}