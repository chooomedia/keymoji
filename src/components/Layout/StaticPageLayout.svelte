<!-- src/components/Layout/StaticPageLayout.svelte -->
<!-- Konsistentes Layout für statische Seiten (Privacy, Legal, etc.) -->
<script>
    import { onMount } from 'svelte';
    import { currentLanguage, translations } from '../../stores/contentStore.js';
    import { navigate } from 'svelte-routing';
    import { updateSeo } from '../../stores/seoStore.js';
    import { appVersion } from '../../utils/version.js';
    import FooterInfo from '../../widgets/FooterInfo.svelte';
    
    // Props
    export let pageType = 'page'; // 'privacy', 'legal', 'contact', etc.
    export let title = '';
    export let description = '';
    export let showBackButton = true;
    export let showFooter = true;
    export let showVersion = false;
    export let lastUpdated = null;
    
    // Navigation
    function navigateBack() {
        const lang = $currentLanguage || 'en';
        const fullPath = lang === 'en' ? '/' : `/${lang}`;
        navigate(fullPath);
    }
    
    // SEO Update
    onMount(() => {
        if (title && description) {
            updateSeo({
                title,
                description,
                url: window.location.pathname,
                pageType
            });
        }
    });
    
    // Format last updated date
    $: formattedDate = lastUpdated 
        ? new Date(lastUpdated).toLocaleDateString($translations?.meta?.locale || 'de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : new Date().toLocaleDateString($translations?.meta?.locale || 'de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
</script>

<div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Content Container -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <!-- Back Button -->
        {#if showBackButton}
            <button
                on:click={navigateBack}
                class="mb-8 inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg px-3 py-2"
                aria-label={$translations?.common?.backToHome || 'Zurück zur Startseite'}
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {$translations?.common?.backToHome || 'Zurück zur Startseite'}
            </button>
        {/if}

        <!-- Page Header -->
        <header class="mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
            </h1>
            
            {#if description}
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {description}
                </p>
            {/if}
            
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {#if lastUpdated || showVersion}
                    <div class="flex items-center gap-4">
                        {#if lastUpdated}
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {$translations?.common?.lastUpdated || 'Letzte Aktualisierung'}: {formattedDate}
                            </span>
                        {/if}
                        
                        {#if showVersion}
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Version: {appVersion}
                            </span>
                        {/if}
                    </div>
                {/if}
            </div>
        </header>

        <!-- Main Content Slot -->
        <main class="prose prose-lg dark:prose-invert max-w-none">
            <slot />
        </main>

        <!-- Back to Top Button -->
        <div class="mt-16 text-center">
            <button
                on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                class="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-3 py-2"
                aria-label={$translations?.common?.backToTop || 'Nach oben'}
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {$translations?.common?.backToTop || 'Nach oben'}
            </button>
        </div>
    </div>

    <!-- Footer -->
    {#if showFooter}
        <div class="mt-16">
            <FooterInfo />
        </div>
    {/if}
</div>

<style>
    /* Prose styling für bessere Lesbarkeit */
    :global(.prose h2) {
        border-bottom: 2px solid currentColor;
        padding-bottom: 0.5rem;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
    }
    
    :global(.prose h3) {
        margin-top: 2rem;
        margin-bottom: 0.75rem;
    }
    
    :global(.prose a) {
        word-break: break-word;
        text-decoration: underline;
        text-decoration-color: rgba(59, 130, 246, 0.3);
        text-underline-offset: 2px;
        transition: all 0.2s;
    }
    
    :global(.prose a:hover) {
        text-decoration-color: rgba(59, 130, 246, 1);
    }
    
    :global(.prose ul) {
        list-style-type: disc;
        padding-left: 1.5rem;
    }
    
    :global(.prose ol) {
        list-style-type: decimal;
        padding-left: 1.5rem;
    }
    
    :global(.prose li) {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    :global(.prose code) {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
    }
    
    :global(.dark .prose code) {
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    :global(.prose pre) {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 0.5rem;
        padding: 1rem;
        overflow-x: auto;
    }
    
    :global(.dark .prose pre) {
        background-color: rgba(255, 255, 255, 0.05);
    }
</style>

