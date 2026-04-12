<!-- src/components/Layout/PageLayout.svelte -->
<script>
    import { currentLanguage, translations } from '../../stores/contentStore.js';
    import { darkMode, isLoggedIn, currentAccount } from 'stores/appStores';
    import { effectiveSettings, userSettings } from '../../stores/userSettingsStore.js';
    import { bannerDismissed } from 'stores/bannerStore';
    import Header from './Header.svelte';
    import AISetupBanner from './AISetupBanner.svelte';
    import FixedMenu from '../../widgets/FixedMenu.svelte';
    
    // Modal-Komponenten hinzufügen
    import Modal from '../UI/Modal.svelte';
    import ModalDebug from '../UI/ModalDebug.svelte';

    let isVerifyingMagicLink = false;
    let magicLinkStatus = null; // 'verifying', 'success', 'error'
    let magicLinkError = '';
    let accountCreationStep = 'benefits'; // 'benefits', 'form', 'verification'
    
    // Props für die Seite
    export let pageTitle = '';
    export let pageDescription = '';
    export let titleClass = 'text-gray';
    export let showIntroSection = false;
    export let introTitle = '';
    export let introText = '';

    // Background-Optimierung: Performance-optimierte Bildquellen
    const hieroglyphicEmojisSrc = '/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg';
    const hieroglyphicEmojisWebP = '/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.webp';
    
    // Apple/Airbnb-Style Gradients mit besserer Performance
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    
    // Banner-Sichtbarkeit (spiegelt AISetupBanner-Logik)
    let _storyEnabled = false;
    let _storyConfigured = false;
    $: {
        const settings =
            $effectiveSettings?.storyMode ||
            $userSettings?.storyMode ||
            $currentAccount?.metadata?.settings?.storyMode ||
            null;
        if (settings) {
            const provider = settings.provider || 'apertus';
            const key = (settings.apiKeys || {})[provider] || '';
            _storyEnabled = settings.enabled || false;
            _storyConfigured = provider === 'apertus' ? _storyEnabled : !!(key && key.length >= 10);
        } else {
            _storyEnabled = false;
            _storyConfigured = false;
        }
    }
    $: bannerVisible = (!$isLoggedIn || !_storyEnabled || !_storyConfigured) && !$bannerDismissed;

    // Performance-State
    let backgroundLoaded = false;
    let supportsWebP = false;

    // Reactive background properties mit WebP-Support
    $: finalBgSrc = supportsWebP ? hieroglyphicEmojisWebP : hieroglyphicEmojisSrc;
    $: bgImage = `background-image: url("${finalBgSrc}"), ${$darkMode ? darkGradient : lightGradient}`;
    $: bgBlendMode = $darkMode ? 'multiply' : 'hue';
</script>

<!-- Modal-Komponenten - Immer verfügbar -->
<Modal />
<ModalDebug />

<!-- Fixed top stack: Banner (optional 32px) + Header (≈80px) -->
<div class="fixed top-0 left-0 right-0 z-50 flex flex-col w-full gap-2 md:gap-0">
    <AISetupBanner />
    <Header />
</div>

<!-- App Container mit animiertem Background -->
<main 
    class="app-container overflow-x-hidden route-transition hieroglyphemojis {$darkMode ? 'dark' : ''} {backgroundLoaded ? 'bg-loaded' : 'bg-loading'}" 
    style="{bgImage}; background-size: 16%, cover; background-blend-mode: {bgBlendMode}; will-change: background-position;"
    data-lang={$currentLanguage}
>
    <!-- Main Content Container -->
    <div class="min-h-screen scroll-smooth overflow-x-hidden">
        <!-- Main Content: pt accounts for fixed banner + header; banner adds ~36px on mobile -->
        <section class="main-content flex flex-col justify-center items-center min-h-screen pb-24 md:pb-28 px-4 z-10 gap-4 scroll-smooth overflow-x-hidden w-full transition-[padding] duration-300 ease-in-out
            {bannerVisible ? 'pt-36 md:pt-28' : 'pt-24 md:pt-28'}">

            <!-- Content before header (e.g. images) -->
            <div class="transform translate-y-6">
                <slot name="before-header"></slot>
            </div>

            <!-- Generic Page Header - wenn pageTitle gesetzt -->
            {#if pageTitle}
                <div class="w-11/12 md:w-27 flex flex-wrap justify-center" role="banner">
                    <h1 class="md:text-3xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        {pageTitle}
                    </h1>
                    {#if pageDescription}
                        <p class="dark:text-gray-400 text-center w-full leading-relaxed {titleClass}">
                            {pageDescription}
                        </p>
                    {/if}
                </div>
            {/if}

            <!-- Custom Header Slot für spezifische Seiten -->
            <slot name="header"></slot>

            <!-- Optional Introduction Section -->
            {#if showIntroSection}
                <div class="text-center mb-6">
                    <h2 class="text-xl md:text-2xl font-semibold mb-2 dark:text-white">{introTitle}</h2>
                    <p class="text-sm text-gray">{introText}</p>
                </div>
            {/if}

            <!-- Additional content before main content (e.g. images) -->
            <slot name="before-content" />

            <!-- Main Content Box - Mit Hintergrund für Modularität -->
            <div class="content-wrapper p-4 w-full md:w-27 rounded-2xl backdrop-blur-sm bg-creme-500 dark:bg-aubergine-80 backdrop-opacity-60 shadow-xl">
                <slot />
            </div>

            <!-- Optional Footer after content -->
            <slot name="footer" />
        </section>
    </div>
</main>

<!-- Fixed Menu - AUßERHALB des main Containers für echtes fixed positioning -->
<FixedMenu align={'bottom'} />