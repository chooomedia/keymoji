<!-- src/components/SEO.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, t } from '../stores/contentStore.js';
    import { 
        DEFAULT_SEO,
        formatCanonicalUrl,
        getFullImageUrl,
        generateStructuredData,
        generateAlternateUrls,
        updateMetaTags,
        injectStructuredData,
        getPageTitle,
        getPageDescription,
        getPageKeywords
    } from '../utils/seo.js';
  
    export let title = '';
    export let description = '';
    export let url = '';
    export let image = DEFAULT_SEO.image;
    export let type = DEFAULT_SEO.type;
    export let noindex = DEFAULT_SEO.noindex;
    export let keywords = '';
    export let canonical = '';
    export let pageType = DEFAULT_SEO.pageType;
  
    let pageTitle = '';
    let pageDescription = '';
    let pageKeywords = '';
    let structuredData = {};
    let alternateUrls = [];
    let cleanup = null;
    
    // Get language-specific meta content with fallbacks
    $: {
        // SEO-optimierte Titel mit Fallbacks - jetzt mit Sprachunterstützung
        pageTitle = title || getPageTitle(pageType, $currentLanguage) || DEFAULT_SEO.title;
        pageDescription = description || getPageDescription(pageType, $currentLanguage) || DEFAULT_SEO.description;
        pageKeywords = keywords || getPageKeywords(pageType, $currentLanguage) || DEFAULT_SEO.keywords;
    }
  
    // Generate alternate URLs for each language
    $: {
        alternateUrls = generateAlternateUrls(url);
    }
  
    // Generate structured data based on page type
    $: {
        const seoData = {
            pageType,
            title: pageTitle,
            description: pageDescription,
            canonical: canonical || formatCanonicalUrl(url),
            image
        };
        structuredData = generateStructuredData(seoData, $currentLanguage);
    }
  
    onMount(() => {
        // Update meta tags with dynamic title based on page type and language
        const seoData = {
            title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
            canonical: canonical || formatCanonicalUrl(url),
            image,
            type,
            noindex
        };
        
        updateMetaTags(seoData, $currentLanguage);
        
        // Inject structured data
        injectStructuredData(structuredData);
        
        // Cleanup function
        cleanup = () => {
            const oldScript = document.querySelector('script[data-seo-structured="true"]');
            if (oldScript && oldScript.parentNode) {
                oldScript.parentNode.removeChild(oldScript);
            }
        };
    });
    
    onDestroy(() => {
        if (cleanup) cleanup();
    });
    
    // React to language changes
    $: if (typeof document !== 'undefined') {
        const seoData = {
            title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
            canonical: canonical || formatCanonicalUrl(url),
            image,
            type,
            noindex
        };
        
        updateMetaTags(seoData, $currentLanguage);
        injectStructuredData(structuredData);
    }
</script>
  
<svelte:head>
    <!-- Language alternates are static and can be here -->
    {#each alternateUrls as alt}
        <link rel="alternate" hreflang={alt.lang} href={alt.url} />
    {/each}
    <link rel="alternate" hreflang="x-default" href="https://keymoji.wtf/en/" />
</svelte:head>