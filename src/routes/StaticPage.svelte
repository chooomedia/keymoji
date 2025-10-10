<!-- src/routes/StaticPage.svelte -->
<!-- Generische Komponente für statische Seiten mit Slug-Support -->
<!-- Data-Driven Architecture: Content (JSON) + Presentation (Component) -->
<script>
    import { onMount } from 'svelte';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import StaticSection from '../components/StaticContent/StaticSection.svelte';
    import { staticPagesData } from '../data/staticPages.json.js';
    import { navigateToHome } from '../utils/navigation.js';
    import { appVersion } from '../utils/version.js';
    import FooterInfo from '../widgets/FooterInfo.svelte';
    
    // Props
    export let slug = 'privacy'; // 'privacy' | 'legal'
    
    let loading = true;
    
    // Get content based on slug and language (reactive)
    $: pageData = (() => {
        loading = true;
        const content = staticPagesData[slug];
        if (!content) return null;
        
        // Language fallback: current → en
        const data = content[$currentLanguage] || content['en'];
        loading = false;
        return data;
    })();
    
    // Reactive Props für PageLayout
    $: pageTitle = pageData?.title || '';
    $: pageDescription = pageData?.description || '';
    $: sections = pageData?.sections || [];
    
    // Format last updated date
    $: formattedDate = pageData?.lastUpdated 
        ? new Date(pageData.lastUpdated).toLocaleDateString($translations?.meta?.locale || 'de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : '';
</script>

{#if loading}
    <PageLayout pageTitle="" pageDescription="">
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
    </PageLayout>
{:else if pageData}
    <PageLayout {pageTitle} {pageDescription}>
        <!-- Back Button (zentriert wie VersionHistory) -->
        <div slot="before-content" class="w-full text-center">
            <button 
                on:click={navigateToHome}
                class="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg px-3 py-2"
                aria-label={$translations?.common?.backToHome || 'Zurück zur Startseite'}
            >
                <span class="text-lg">←</span>
                {$translations?.common?.backToHome || 'Zurück zur Startseite'}
            </button>
        </div>

        <!-- Meta Info (zentriert) -->
        {#if formattedDate}
            <div class="w-full text-center mb-6">
                <div class="inline-flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Last updated: {formattedDate}
                    </span>
                    
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Version: {appVersion}
                    </span>
                </div>
            </div>
        {/if}

        <!-- Main Content: Sections -->
        <div class="w-full space-y-8">
            {#each sections as section (section.title)}
                <StaticSection {section} />
            {/each}
        </div>

        <!-- Back to Top Button -->
        <div class="w-full mt-12 text-center">
            <button
                on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                class="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg px-3 py-2"
                aria-label="Back to top"
                title="Back to top"
            >
                <span class="text-lg">↑</span>
                Back to top
            </button>
        </div>

        <!-- Footer -->
        <div slot="footer" class="w-full">
            <FooterInfo />
        </div>
    </PageLayout>
{:else}
    <PageLayout pageTitle="404" pageDescription="Page not found">
        <div class="flex flex-col justify-center items-center py-12 px-4 text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                404 - Page not found
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mb-8">
                The requested page does not exist.
            </p>
            <button
                on:click={navigateToHome}
                class="inline-flex items-center px-6 py-3 bg-yellow-500 text-black rounded-full font-medium hover:bg-yellow-600 transition-colors transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
                Go back home
            </button>
        </div>
    </PageLayout>
{/if}


