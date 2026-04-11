<!-- src/routes/LegalPage.svelte -->
<!-- Privacy & Legal pages in Blog-Detail style (prose, max-w-4xl) -->
<!-- Uses same layout as BlogPost without CTA and Share sections -->
<script>
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import StaticSection from '../components/StaticContent/StaticSection.svelte';
    import { staticPagesData } from '../data/staticPages.json.js';
    import { navigateToHome } from '../utils/navigation';
    import { appVersion } from '../utils/version';
    import FooterInfo from '../widgets/FooterInfo.svelte';

    export let slug = 'privacy'; // 'privacy' | 'legal'

    $: pageData = (() => {
        const content = staticPagesData[slug];
        if (!content) return null;
        return content[$currentLanguage] || content['en'];
    })();

    $: pageTitle = pageData?.title || '';
    $: pageDescription = pageData?.description || '';
    $: sections = pageData?.sections || [];

    $: formattedDate = pageData?.lastUpdated
        ? new Date(pageData.lastUpdated).toLocaleDateString(
              $translations?.meta?.locale || 'de-DE',
              { year: 'numeric', month: 'long', day: 'numeric' }
          )
        : '';
</script>

<PageLayout {pageTitle} {pageDescription}>
    <!-- Back Button — same as BlogPost -->
    <div slot="before-content" class="relative w-full flex justify-center -mb-14">
        <button
            on:click={navigateToHome}
            class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 z-20"
            aria-label={$translations?.index?.backToMainButtonText || 'Back to home'}
            title={$translations?.index?.backToMainButtonText || 'Back to home'}
        >
            <span class="text-lg">←</span>
            <span class="font-semibold">{$translations?.index?.backToMainButtonText || 'Go back home'}</span>
        </button>
    </div>

    <!-- Content Container — Blog-Detail-Stil -->
    <div class="container mx-auto pt-4">
        <div class="max-w-4xl mx-auto">

            <!-- Meta row: last updated + version -->
            {#if formattedDate}
                <div class="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-8">
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {$translations?.blog?.lastUpdated || 'Last updated'}: {formattedDate}
                    </span>
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Version: {appVersion}
                    </span>
                </div>
            {/if}

            <!-- Prose article — same classes as BlogPost -->
            <article class="prose prose-gray dark:prose-invert dark:text-gray-200 max-w-none mb-4">
                {#each sections as section (section.title)}
                    <StaticSection {section} />
                {/each}
            </article>

            <!-- Back to Top -->
            <div class="w-full text-center">
                <button
                    on:click={() => {
                        // .app-container ist der scrollende Container (overflow-y: auto, height: 100vh)
                        const container = document.querySelector('.app-container');
                        if (container) {
                            container.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    class="flex w-full items-center justify-center gap-2 py-4 rounded-full font-medium transition-all transform hover:scale-105 focus:scale-105 active:scale-95 bg-powder-200 dark:bg-aubergine-950 text-black dark:text-powder-50 border border-transparent hover:border-yellow-300 focus:border-yellow-300 active:border-yellow-400 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 focus:outline-none"
                    aria-label="Back to top"
                    title="Back to top"
                >
                    <span class="text-xl">↑</span>
                    <span>{$translations?.versionHistory?.backToTop || 'Back to top'}</span>
                </button>
            </div>

        </div>
    </div>

    <!-- Footer -->
    <div slot="footer" class="w-full">
        <FooterInfo />
    </div>
</PageLayout>
