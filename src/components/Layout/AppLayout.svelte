<!-- src/components/Layout/AppLayout.svelte -->
<!-- Globale Layout-Komponente für alle Routes -->
<!-- Verwendet JSON-Konfiguration für Header, Footer und Modals -->
<script lang="ts">
    import { fade } from 'svelte/transition';
    import { currentLanguage } from '../../stores/contentStore.ts';
    import { darkMode } from '../../stores/appStores';
    import Header from './Header.svelte';
    import FixedMenu from '../../widgets/FixedMenu.svelte';
    import Modal from '../UI/Modal.svelte';
    import ModalDebug from '../UI/ModalDebug.svelte';
    import FooterInfo from '../../widgets/FooterInfo.svelte';
    import { getLayoutConfig, type LayoutConfig } from '../../data/layoutConfig.json';
    
    // Props
    interface Props {
        routeSlug?: string;
        pageTitle?: string;
        pageDescription?: string;
        titleClass?: string;
        showIntroSection?: boolean;
        introTitle?: string;
        introText?: string;
    }
    
    let {
        routeSlug = 'index',
        pageTitle = '',
        pageDescription = '',
        titleClass = 'text-gray',
        showIntroSection = false,
        introTitle = '',
        introText = ''
    }: Props = $props();
    
    // Component mapping für dynamisches Laden
    const componentMap: Record<string, any> = {
        Header,
        FixedMenu,
        Modal,
        ModalDebug,
        FooterInfo
    };
    
    // Layout-Konfiguration basierend auf Route
    let layoutConfig = $derived(getLayoutConfig(routeSlug));
    
    // Footer Component basierend auf Konfiguration
    let footerComponent = $derived(componentMap[layoutConfig.footer.component] || FooterInfo);
    
    // Background-Optimierung: Performance-optimierte Bildquellen
    const hieroglyphicEmojisSrc = '/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg';
    const hieroglyphicEmojisWebP = '/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.webp';
    
    // Apple/Airbnb-Style Gradients mit besserer Performance
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    
    // Performance-State
    let backgroundLoaded = $state(false);
    let supportsWebP = $state(false);
    
    const finalBgSrc = $derived(supportsWebP ? hieroglyphicEmojisWebP : hieroglyphicEmojisSrc);
    const bgImage = $derived(`background-image: url("${finalBgSrc}"), ${darkMode ? darkGradient : lightGradient}`);
    const bgBlendMode = $derived(darkMode ? 'multiply' : 'hue');
    
    // WebP Support Detection
    import { onMount } from 'svelte';
    onMount(() => {
        // Check WebP support
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            supportsWebP = webP.height === 2;
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        
        // Mark background as loaded
        backgroundLoaded = true;
    });
</script>

<!-- Modal-Komponenten - Immer verfügbar -->
{#if layoutConfig.modals?.some(m => m.component === 'Modal' && m.visible)}
    <Modal />
{/if}
{#if layoutConfig.modals?.some(m => m.component === 'ModalDebug' && m.visible)}
    <ModalDebug />
{/if}

<!-- Header - AUßERHALB des main Containers für echtes fixed positioning -->
{#if layoutConfig.header.visible}
    <Header />
{/if}

<!-- App Container mit animiertem Background -->
<main 
    class="app-container overflow-x-hidden route-transition hieroglyphemojis {darkMode ? 'dark' : ''} {backgroundLoaded ? 'bg-loaded' : 'bg-loading'}" 
    style="{bgImage}; background-size: 16%, cover; background-blend-mode: {bgBlendMode}; will-change: background-position;"
    data-lang={currentLanguage}
>
    <!-- Main Content Container -->
    <div class="min-h-screen scroll-smooth overflow-x-hidden" in:fade={{duration: 300}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="main-content flex flex-col justify-center items-center min-h-screen py-8 px-4 z-10 gap-4 scroll-smooth overflow-x-hidden w-full">

            <!-- Content before header (e.g. images) -->
            <slot name="before-header"></slot>

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

            <!-- Optional Footer after content (Slot hat Priorität) -->
            {#if $$slots.footer}
                <slot name="footer" />
            {:else if layoutConfig.footer.visible}
                <!-- Footer aus Konfiguration (nur wenn kein Slot vorhanden) -->
                <div class="w-full">
                    <svelte:component this={footerComponent} {...(layoutConfig.footer.props || {})} />
                </div>
            {/if}
        </section>
    </div>
</main>

<!-- Fixed Menu - AUßERHALB des main Containers für echtes fixed positioning -->
{#if layoutConfig.fixedMenu?.visible}
    <FixedMenu align={layoutConfig.fixedMenu.props?.align || 'bottom'} />
{/if}

