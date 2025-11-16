<!--
Static page component for rendering privacy and legal pages.
Handles dynamic content loading based on slug and language.
Manages page sections and formatting.
-->
<script lang="ts">
    import { onMount } from 'svelte';
    import { currentLanguage, translations } from '../stores/contentStore';
    import PageLayoutComponent from '../components/Layout/PageLayout.svelte';
    import StaticSectionComponent from '../components/StaticContent/StaticSection.svelte';
    import { staticPagesData } from '../data/staticPages.json.js';
    import { navigateToHome } from '../utils/navigation';
    import { appVersion } from '../utils/version';
    import { get } from 'svelte/store';
    import { isDebugMode } from '../utils/environment';

    function debugStaticPage() {
        if (!isDebugMode()) return;
        console.group('🔍 StaticPage Debug');
        console.log('State:', {
            slug,
            loading,
            hasPageData: !!pageData,
            language: get(currentLanguage)
        });
        console.groupEnd();
    }
    
    // Props (Svelte 5 Runes)
    interface Props {
        slug?: 'privacy' | 'legal';
    }
    
    let { slug = 'privacy' }: Props = $props();
    
    let loading = $state(true);
    
    // Get content based on slug and language (reactive) - Svelte 5 Runes
    // PERFORMANCE: $derived.by() hier korrekt, da mehrere Schritte und Side Effects (loading = true/false)
    let pageData = $derived.by(() => {
        loading = true;
        const content = staticPagesData[slug];
        if (!content) {
            loading = false;
            return null;
        }
        
        // Language fallback: current → en (use get() for stores in $derived.by)
        const lang = get(currentLanguage);
        const data = content[lang] || content['en'];
        loading = false;
        return data;
    });
    
    // Reactive Props für PageLayout (Svelte 5 Runes)
    // PERFORMANCE: $derived() für einfache Property-Zugriffe
    let pageTitle = $derived(pageData?.title || '');
    let pageDescription = $derived(pageData?.description || '');
    let sections = $derived(pageData?.sections || []);

    // Svelte 5 / Webpack: stabile Komponenten-Referenzen
    const PageLayout = PageLayoutComponent;
    const StaticSection = StaticSectionComponent;
    
    // Format last updated date (Svelte 5 Runes)
    let formattedDate = $derived.by(() => {
        const t = get(translations);
        return pageData?.lastUpdated 
            ? new Date(pageData.lastUpdated).toLocaleDateString(t?.meta?.locale || 'de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '';
    });
</script>

{#if loading}
    <PageLayout pageTitle="" pageDescription="">
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
    </PageLayout>
{:else if pageData}
    <PageLayout {pageTitle} {pageDescription} routeSlug="static">
        {#snippet beforeContent()}
            <!-- Back Button - Liegt ZUR HÄLFTE auf content-wrapper Rand -->
            <div class="relative w-full flex justify-center -mb-14">
            <button 
                onclick={navigateToHome}
                class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 z-20"
                aria-label={$translations?.index?.backToMainButtonText || 'Back to home'}
                title={$translations?.index?.backToMainButtonText || 'Back to home'}
            >
                <span class="text-lg">←</span>
                <span class="font-semibold">{$translations?.index?.backToMainButtonText || 'Go back home'}</span>
            </button>
        </div>
        
        <!-- Content Container - Filigranes Spacing oben -->
        <div class="container mx-auto pt-8 pb-4">

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
                onclick={() => {
                    try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                        const scrollableElements = [
                            document.querySelector('.app-container'),
                            document.querySelector('.main-content'),
                            document.querySelector('main'),
                            document.querySelector('.wrapper'),
                            document.querySelector('[class*="scroll"]')
                        ];
                        scrollableElements.forEach(el => {
                            if (el) {
                                el.scrollTop = 0;
                                el.scrollTo?.({ top: 0, behavior: 'smooth' });
                            }
                        });
                    } catch (error) {}
                }}
                class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 text-black dark:bg-aubergine-900 dark:text-white rounded-full font-medium shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                aria-label="Back to top"
                title="Back to top"
            >
                <span class="text-xl">↑</span>
                <span>Back to top</span>
            </button>
        </div>
        </div>
        {/snippet}
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
                onclick={navigateToHome}
                class="inline-flex items-center px-6 py-3 bg-yellow-500 text-black rounded-full font-medium hover:bg-yellow-600 transition-colors transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
                Go back home
            </button>
        </div>
    </PageLayout>
{/if}


