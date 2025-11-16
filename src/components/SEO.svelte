<!-- src/components/SEO.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, t } from '../stores/contentStore.ts';
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
    } from '../utils/seo';
  
    interface Props {
        title?: string;
        description?: string;
        url?: string;
        image?: string;
        type?: string;
        noindex?: boolean;
        keywords?: string;
        canonical?: string;
        pageType?: string;
    }
    
    let {
        title = '',
        description = '',
        url = '',
        image = DEFAULT_SEO.image,
        type = DEFAULT_SEO.type,
        noindex = DEFAULT_SEO.noindex,
        keywords = '',
        canonical = '',
        pageType = DEFAULT_SEO.pageType
    }: Props = $props();
  
    let pageTitle = $state('');
    let pageDescription = $state('');
    let pageKeywords = $state('');
    let structuredData = $state<Record<string, unknown>>({});
    let alternateUrls = $state<Array<{ lang: string; url: string }>>([]);
    let cleanup: (() => void) | null = $state(null);
    
    $effect(() => {
        pageTitle = title || getPageTitle(pageType, currentLanguage) || DEFAULT_SEO.title;
        pageDescription = description || getPageDescription(pageType, currentLanguage) || DEFAULT_SEO.description;
        pageKeywords = keywords || getPageKeywords(pageType, currentLanguage) || DEFAULT_SEO.keywords;
    });
  
    $effect(() => {
        alternateUrls = generateAlternateUrls(url);
    });
  
    $effect(() => {
        const seoData = {
            pageType,
            title: pageTitle,
            description: pageDescription,
            canonical: canonical || formatCanonicalUrl(url),
            image
        };
        structuredData = generateStructuredData(seoData, currentLanguage);
    });
  
    onMount(() => {
        const seoData = {
            title: pageTitle,
            description: pageDescription,
            keywords: pageKeywords,
            canonical: canonical || formatCanonicalUrl(url),
            image,
            type,
            noindex
        };
        
        updateMetaTags(seoData, currentLanguage);
        injectStructuredData(structuredData);
        
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
    
    $effect(() => {
        if (typeof document !== 'undefined') {
            const seoData = {
                title: pageTitle,
                description: pageDescription,
                keywords: pageKeywords,
                canonical: canonical || formatCanonicalUrl(url),
                image,
                type,
                noindex
            };
            
            updateMetaTags(seoData, currentLanguage);
            injectStructuredData(structuredData);
        }
    });
</script>
  
<svelte:head>
    <!-- Language alternates are static and can be here -->
    {#each alternateUrls as alt}
        <link rel="alternate" hreflang={alt.lang} href={alt.url} />
    {/each}
    <link rel="alternate" hreflang="x-default" href="https://keymoji.wtf/en/" />
</svelte:head>