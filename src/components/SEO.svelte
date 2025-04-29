<script>
    import { onMount } from 'svelte';
    import { currentLanguage } from '../stores/appStores.js';
    import content from '../content.js';
    import { updatedTime } from '../updatedTime.js';
  
    export let title = '';
    export let description = '';
    export let url = '';
    export let image = '/images/keymoji-logo-11-2023-simple.png';
    export let type = 'website';
    export let noindex = false;
    export let keywords = '';
    export let canonical = '';
    export let pageType = 'home'; // home, blog, contact, versions, etc.
  
    let pageTitle = '';
    let pageDescription = '';
    let pageKeywords = '';
    let structuredData = {};
    let alternateUrls = [];
  
    // Format canonical URL if not provided
    $: if (!canonical && url) {
      canonical = `https://keymoji.wtf${url}`;
    }
  
    // Add trailing slash if needed
    $: if (canonical && !canonical.endsWith('/') && !canonical.includes('.')) {
      canonical = `${canonical}/`;
    }
  
    // Get language-specific meta content
    $: {
      // Defensive checking to avoid undefined errors
      const langContent = content[$currentLanguage] || content['en'] || {};
      const pageContent = langContent[pageType] || langContent['index'] || {};
      
      pageTitle = title || (pageContent.pageTitle ? pageContent.pageTitle : 'Keymoji');
      pageDescription = description || (pageContent.pageDescription ? pageContent.pageDescription : 'Generate secure emoji passwords');
      pageKeywords = keywords || (pageContent.pageKeywords ? pageContent.pageKeywords : 'emoji, password, security');
    }
  
    // Generate alternate URLs for each language
    $: {
      alternateUrls = Object.keys(content)
        .filter(lang => lang !== 'logo') // Skip non-language keys
        .map(lang => {
          // Create URL with language code
          const langPath = url ? `/${lang}${url}` : `/${lang}`;
          return {
            lang,
            url: `https://keymoji.wtf${langPath}`
          };
        });
    }
  
    // Generate structured data based on page type
    $: {
      if (pageType === 'home') {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": pageTitle,
          "description": pageDescription,
          "applicationCategory": "Security Tool",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": "Christopher Matt",
            "url": "https://www.linkedin.com/in/chooomedia/",
            "jobTitle": "Frontend Developer"
          },
          "url": canonical,
          "inLanguage": $currentLanguage,
          "dateModified": updatedTime
        };
      } else if (pageType === 'blog') {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": pageTitle,
          "description": pageDescription,
          "url": canonical,
          "inLanguage": $currentLanguage,
          "dateModified": updatedTime,
          "author": {
            "@type": "Person",
            "name": "Christopher Matt"
          }
        };
      }
      // Add more page types as needed
    }
  
    onMount(() => {
      // Inject JSON-LD structured data
      try {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
        
        return () => {
          // Clean up when component is destroyed
          if (script && script.parentNode) {
            document.head.removeChild(script);
          }
        };
      } catch (error) {
        console.error('Error injecting structured data:', error);
      }
    });
  
    function getLocale(lang) {
      // Default to en_US
      if (!lang) return 'en_US';
      
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
</script>
  
<svelte:head>
    <!-- Basic Meta Tags -->
    <title>{pageTitle}</title>
    <meta name="description" content={pageDescription} />
    <meta name="keywords" content={pageKeywords} />
    
    {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
    {:else}
    <meta name="robots" content="index, follow" />
    {/if}
    
    <!-- Canonical URL -->
    <link rel="canonical" href={canonical} />
    
    <!-- Language Alternates -->
    {#each alternateUrls as alt}
      <link rel="alternate" hreflang={alt.lang} href={alt.url} />
    {/each}
    <link rel="alternate" hreflang="x-default" href="https://keymoji.wtf/" />
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDescription} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content={type} />
    <meta property="og:image" content={image.startsWith('http') ? image : `https://keymoji.wtf${image}`} />
    <meta property="og:locale" content={getLocale($currentLanguage)} />
    <meta property="og:site_name" content="Keymoji" />
    <meta property="og:updated_time" content={updatedTime} />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={pageDescription} />
    <meta name="twitter:image" content={image.startsWith('http') ? image : `https://keymoji.wtf${image}`} />
    
    <!-- Additional Meta Tags -->
    <meta name="application-name" content="Keymoji" />
    <meta name="apple-mobile-web-app-title" content="Keymoji" />
    <meta name="generator" content="Svelte" />
    <meta name="author" content="Christopher Matt" />
</svelte:head>