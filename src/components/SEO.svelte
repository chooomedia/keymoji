<!-- src/components/Seo.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage } from '../stores.js';
    import content from '../content.js';
    import { updatedTime } from '../updatedTime.js';
  
    // Instance tracking to prevent multiple SEO components
    const INSTANCE_ID = `seo-instance-${Math.random().toString(36).substr(2, 9)}`;
    let isActiveInstance = false;
  
    // Props with defaults
    export let title = '';
    export let description = '';
    export let url = ''; // Important: Export as let, not const to allow updating
    export let image = '/images/keymoji-logo-11-2023-simple.png';
    export let type = 'website';
    export let noindex = false;
    export let keywords = '';
    export let canonical = '';
    export let pageType = 'home'; // home, blog, contact, versions, etc.
  
    // Content state
    let pageTitle = '';
    let pageDescription = '';
    let pageKeywords = '';
    let structuredData = {};
    let alternateUrls = [];
    let jsonLdScript = null;
  
    // Make sure the URL starts with a slash if not empty and not external
    $: if (url && !url.startsWith('/') && !url.match(/^https?:\/\//)) {
      url = `/${url}`;
    }
  
    // Get the full site URL
    const siteUrl = 'https://keymoji.wtf';
  
    // Format canonical URL if not provided
    $: resolvedCanonical = canonical || (url ? `${siteUrl}${url}` : siteUrl);
  
    // Make sure canonical URL has trailing slash if it doesn't have extension
    $: {
      if (resolvedCanonical && 
          !resolvedCanonical.endsWith('/') && 
          !resolvedCanonical.includes('.') && 
          !resolvedCanonical.includes('#') && 
          !resolvedCanonical.includes('?')) {
        resolvedCanonical = `${resolvedCanonical}/`;
      }
    }
  
    // Get language-specific meta content
    $: {
      if (pageType && content[$currentLanguage]?.[pageType]) {
        pageTitle = title || content[$currentLanguage][pageType].pageTitle;
        pageDescription = description || content[$currentLanguage][pageType].pageDescription;
        pageKeywords = keywords || content[$currentLanguage][pageType].pageKeywords;
      } else {
        pageTitle = title || content[$currentLanguage]?.index?.pageTitle || 'Keymoji';
        pageDescription = description || content[$currentLanguage]?.index?.pageDescription || 'Generate secure emoji passwords';
        pageKeywords = keywords || content[$currentLanguage]?.index?.pageKeywords || 'emoji, password, security';
      }
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
            url: `${siteUrl}${langPath}`
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
          "url": resolvedCanonical,
          "inLanguage": $currentLanguage,
          "dateModified": updatedTime
        };
      } else if (pageType === 'blog') {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": pageTitle,
          "description": pageDescription,
          "url": resolvedCanonical,
          "inLanguage": $currentLanguage,
          "dateModified": updatedTime,
          "author": {
            "@type": "Person",
            "name": "Christopher Matt"
          }
        };
      } else if (pageType === 'contact') {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Christopher Matt",
          "description": pageDescription,
          "url": resolvedCanonical,
          "jobTitle": "Frontend Developer"
        };
      }
      // Add more page types as needed
    }
  
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
  
    // Fix image URL if not absolute
    $: ogImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
    // This function checks if another SEO component is already active
    function checkActiveInstance() {
      const activeInstance = window.__SEO_ACTIVE_INSTANCE;
      
      if (activeInstance && activeInstance !== INSTANCE_ID) {
        console.warn('Multiple SEO components active. Only the first one will be used.');
        return false;
      }
      
      window.__SEO_ACTIVE_INSTANCE = INSTANCE_ID;
      return true;
    }
  
    onMount(() => {
      // Check if this instance should be active
      isActiveInstance = checkActiveInstance();
      
      if (isActiveInstance) {
        // Only inject structured data if we're the active instance
        if (Object.keys(structuredData).length > 0) {
          jsonLdScript = document.createElement('script');
          jsonLdScript.type = 'application/ld+json';
          jsonLdScript.textContent = JSON.stringify(structuredData);
          document.head.appendChild(jsonLdScript);
        }
      }
      
      return () => {
        // Cleanup
        if (isActiveInstance && jsonLdScript && jsonLdScript.parentNode) {
          document.head.removeChild(jsonLdScript);
          if (window.__SEO_ACTIVE_INSTANCE === INSTANCE_ID) {
            delete window.__SEO_ACTIVE_INSTANCE;
          }
        }
      };
    });
  
    onDestroy(() => {
      // Clean up structured data when component is destroyed
      if (isActiveInstance && jsonLdScript && jsonLdScript.parentNode) {
        document.head.removeChild(jsonLdScript);
        if (window.__SEO_ACTIVE_INSTANCE === INSTANCE_ID) {
          delete window.__SEO_ACTIVE_INSTANCE;
        }
      }
    });
</script>
  
<svelte:head>
    <!-- Only render meta tags if this is the active instance -->
    {#if isActiveInstance}
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
      <link rel="canonical" href={resolvedCanonical} />
      
      <!-- Language Alternates -->
      {#each alternateUrls as alt}
        <link rel="alternate" hreflang={alt.lang} href={alt.url} />
      {/each}
      <link rel="alternate" hreflang="x-default" href={siteUrl} />
      
      <!-- Open Graph Tags -->
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={getLocale($currentLanguage)} />
      <meta property="og:site_name" content="Keymoji" />
      <meta property="og:updated_time" content={updatedTime} />
      
      <!-- Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      <!-- Additional Meta Tags -->
      <meta name="application-name" content="Keymoji" />
      <meta name="apple-mobile-web-app-title" content="Keymoji" />
      <meta name="generator" content="Svelte" />
      <meta name="author" content="Christopher Matt" />
    {/if}
</svelte:head>