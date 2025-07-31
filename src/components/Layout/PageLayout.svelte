<!-- src/components/Layout/PageLayout.svelte -->
<script>
    import { fly, fade } from 'svelte/transition';
    import { currentLanguage, translations } from '../../stores/contentStore.js';
    import { darkMode } from '../../stores/appStores.js';
    import Header from './Header.svelte';
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
    
    // Performance-State
    let backgroundLoaded = false;
    let supportsWebP = false;
    
    // Reactive background properties mit WebP-Support
    $: finalBgSrc = supportsWebP ? hieroglyphicEmojisWebP : hieroglyphicEmojisSrc;
    $: bgImage = `background-image: url("${finalBgSrc}"), ${$darkMode ? darkGradient : lightGradient}`;
    $: bgBlendMode = $darkMode ? 'multiply' : 'hue';

    // Props werden von außen übergeben - KEINE lokale Überschreibung!
    // pageTitle und pageDescription kommen als Props von jeder Route

    // Props werden korrekt von jeder Route übergeben
</script>

<!-- Modal-Komponenten - Immer verfügbar -->
<Modal />
<ModalDebug />

<!-- App Container mit animiertem Background -->
<main 
    class="app-container overflow-x-hidden route-transition hieroglyphemojis {$darkMode ? 'dark' : ''} {backgroundLoaded ? 'bg-loaded' : 'bg-loading'}" 
    style="{bgImage}; background-size: 16%, cover; background-blend-mode: {bgBlendMode}; will-change: background-position;"
    data-lang={$currentLanguage}
>
    <!-- Header -->
    <Header />
    
    <!-- Main Content Container -->
    <div class="min-h-screen scroll-smooth overflow-x-hidden" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="main-content flex flex-col justify-center items-center min-h-screen py-8 px-4 z-10 gap-4 scroll-smooth overflow-x-hidden w-full">

            <!-- Content before header (e.g. images) -->
            <slot name="before-header"></slot>

            <!-- Generic Page Header - wenn pageTitle gesetzt -->
            {#if pageTitle}
                <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        {pageTitle}
                    </h1>
                    {#if pageDescription}
                        <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed {titleClass}">
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
            <div class="content-wrapper pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-500 dark:bg-aubergine-80 backdrop-opacity-60 shadow-xl">
                <slot />
            </div>

            <!-- Optional Footer after content -->
            <slot name="footer" />
        </section>
    </div>

    <!-- Fixed Menu -->
    <FixedMenu align={'bottom'} />
</main>

<!-- Modal-Komponenten - Immer verfügbar -->
<Modal />
<ModalDebug /> 