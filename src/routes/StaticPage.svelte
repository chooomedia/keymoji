<!-- src/routes/StaticPage.svelte -->
<!-- Generische Komponente für statische Seiten mit Slug-Support -->
<script>
    import { onMount } from 'svelte';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import StaticPageLayout from '../components/Layout/StaticPageLayout.svelte';
    import { privacyContent, legalContent } from '../data/staticPages.js';
    
    // Props
    export let slug = 'privacy'; // 'privacy' | 'legal'
    
    let content = null;
    let loading = true;
    
    // Get content based on slug
    $: {
        loading = true;
        switch (slug) {
            case 'privacy':
                content = privacyContent;
                break;
            case 'legal':
                content = legalContent;
                break;
            default:
                content = null;
        }
        loading = false;
    }
    
    // Get translated content
    $: pageData = content ? content[$currentLanguage] || content['en'] : null;
</script>

{#if loading}
    <div class="flex justify-center items-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
{:else if pageData}
    <StaticPageLayout
        pageType={slug}
        title={pageData.title}
        description={pageData.description}
        lastUpdated={pageData.lastUpdated}
        showVersion={true}
        showBackButton={true}
        showFooter={true}
    >
        {@html pageData.content}
    </StaticPageLayout>
{:else}
    <div class="flex flex-col justify-center items-center min-h-screen px-4">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            404 - {$translations?.common?.pageNotFound || 'Seite nicht gefunden'}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
            {$translations?.common?.pageNotFoundDescription || 'Die angeforderte Seite existiert nicht.'}
        </p>
        <a
            href="/"
            class="inline-flex items-center px-6 py-3 bg-yellow-500 text-black rounded-full font-medium hover:bg-yellow-600 transition-colors"
        >
            {$translations?.common?.backToHome || 'Zurück zur Startseite'}
        </a>
    </div>
{/if}

