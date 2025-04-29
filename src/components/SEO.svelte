<!-- src/components/Seo.svelte -->
<script>
    import { onDestroy } from 'svelte';
    import { currentLanguage } from '../stores/appStores.js';
    import { seo, updateSeo, resetSeo } from '../stores/seoStore.js';
    import content from '../content.js';
    import { updatedTime } from '../updatedTime.js';
  
    // Props - these will update the SEO store
    export let title = '';
    export let description = '';
    export let url = '';
    export let image = '';
    export let type = '';
    export let noindex = false;
    export let keywords = '';
    export let canonical = '';
    export let pageType = '';
    
    // Update the SEO store when props change
    $: {
        const updates = {};
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (url) updates.url = url;
        if (image) updates.image = image;
        if (type) updates.type = type;
        if (noindex !== undefined) updates.noindex = noindex;
        if (keywords) updates.keywords = keywords;
        if (canonical) updates.canonical = canonical;
        if (pageType) updates.pageType = pageType;
        
        if (Object.keys(updates).length > 0) {
            updateSeo(updates);
        }
    }
    
    // Clean up on component destruction
    onDestroy(() => {
        resetSeo();
    });
    
    // Helper function to get locale for OpenGraph tags
    function getLocale(lang) {
        const localeMap = {
            'de': 'de_DE',
            'dech': 'de_CH',
            'es': 'es_ES',
            'nl': 'nl_NL',
            'it': 'it_IT',
            'fr': 'fr_FR',
            'pl': 'pl_PL',
            'da': 'da_DK',
            'ru': 'ru_RU',
            'tr': 'tr_TR',
            'af': 'af_ZA',
            'ja': 'ja_JP',
            'ko': 'ko_KO',
            'tlh': 'tlh_Qo',
            'qya': 'qya_Qo',
        };
        return localeMap[lang] || 'en_US';
    }
    
    // Compute alternate language URLs
    $: alternateUrls = Object.keys(content)
        .map(lang => {
            const langPath = $seo.url ? `/${lang}` : `/${lang}`;
            return {
                lang,
                url: `https://keymoji.wtf${langPath}`
            };
        });
</script>
  
<svelte:head>
    <!-- Basic Meta Tags -->
    <title>{$seo.title}</title>
    <meta name="description" content={$seo.description} />
    {#if $seo.keywords}
    <meta name="keywords" content={$seo.keywords} />
    {/if}
    
    {#if $seo.noindex}
    <meta name="robots" content="noindex, nofollow" />
    {:else}
    <meta name="robots" content="index, follow" />
    {/if}
    
    <!-- Canonical URL -->
    {#if $seo.canonical}
    <link rel="canonical" href={$seo.canonical} />
    {/if}
    
    <!-- Language Alternates -->
    {#each alternateUrls as alt}
      <link rel="alternate" hreflang={alt.lang} href={alt.url} />
    {/each}
    <link rel="alternate" hreflang="x-default" href="https://keymoji.wtf/" />
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content={$seo.title} />
    <meta property="og:description" content={$seo.description} />
    {#if $seo.canonical}
    <meta property="og:url" content={$seo.canonical} />
    {/if}
    <meta property="og:type" content={$seo.type || 'website'} />
    <meta property="og:image" content={$seo.image?.startsWith('http') ? $seo.image : `https://keymoji.wtf${$seo.image || '/images/keymoji-logo-11-2023-simple.png'}`} />
    <meta property="og:locale" content={getLocale($currentLanguage)} />
    <meta property="og:site_name" content="Keymoji" />
    <meta property="og:updated_time" content={updatedTime} />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={$seo.title} />
    <meta name="twitter:description" content={$seo.description} />
    <meta name="twitter:image" content={$seo.image?.startsWith('http') ? $seo.image : `https://keymoji.wtf${$seo.image || '/images/keymoji-logo-11-2023-simple.png'}`} />
    
    <!-- Additional Meta Tags -->
    <meta name="application-name" content="Keymoji" />
    <meta name="apple-mobile-web-app-title" content="Keymoji" />
    <meta name="generator" content="Svelte" />
    <meta name="author" content="Christopher Matt" />
</svelte:head>