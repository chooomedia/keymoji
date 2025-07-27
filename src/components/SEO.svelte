<!-- src/components/SEO.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage } from '../stores/appStores.js';
    import content from '../content.js';
    import { updatedTime } from '../updatedTime.js';
  
    export let title = '';
    export let description = '';
    export let url = '';
    export let image = '/images/keymoji-social-media-banner-10-2024-min.png'; // Korrektes Social Media Bild
    export let type = 'website';
    export let noindex = false;
    export let keywords = '';
    export let canonical = '';
    export let pageType = 'home';
  
    let pageTitle = '';
    let pageDescription = '';
    let pageKeywords = '';
    let structuredData = {};
    let alternateUrls = [];
    let cleanup = null;
    
    // Full image URL for social sharing
    $: fullImageUrl = image.startsWith('http') 
        ? image 
        : `https://keymoji.wtf${image}`;
  
    // Format canonical URL
    $: {
        if (!canonical && url) {
            canonical = `https://keymoji.wtf${url}`;
        }
        // Add trailing slash for directories
        if (canonical && !canonical.endsWith('/') && !canonical.includes('.') && !canonical.includes('?')) {
            canonical = `${canonical}/`;
        }
    }
  
    // Get language-specific meta content
    $: {
        const langContent = content[$currentLanguage] || content['en'] || {};
        const pageContent = langContent[pageType] || langContent['index'] || {};
        
        pageTitle = title || pageContent.pageTitle || 'Keymoji - Emoji Password Generator';
        pageDescription = description || pageContent.pageDescription || 'Generate secure emoji passwords with AI resistance';
        pageKeywords = keywords || pageContent.pageKeywords || 'emoji password, password generator, security';
    }
  
    // Generate alternate URLs for each language
    $: {
        alternateUrls = Object.keys(content)
            .filter(lang => lang !== 'logo')
            .map(lang => {
                const langPath = url ? `/${lang}${url}` : `/${lang}`;
                return {
                    lang,
                    url: `https://keymoji.wtf${langPath}`
                };
            });
    }
  
    // Generate structured data based on page type
    $: {
        const baseStructuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Keymoji",
            "url": canonical,
            "inLanguage": $currentLanguage,
            "dateModified": updatedTime,
            "author": {
                "@type": "Person",
                "name": "Christopher Matt",
                "url": "https://www.linkedin.com/in/chooomedia/"
            }
        };

        if (pageType === 'home' || pageType === 'index') {
            structuredData = {
                ...baseStructuredData,
                "description": pageDescription,
                "applicationCategory": "SecurityApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "screenshot": fullImageUrl,
                "featureList": [
                    "AI-resistant password generation",
                    "15+ language support", 
                    "Dark mode",
                    "PWA support"
                ]
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
                "author": baseStructuredData.author
            };
        } else {
            structuredData = baseStructuredData;
        }
    }
  
    // Helper function to update meta tags
    function updateMetaTag(selector, attribute, value) {
        let element = document.querySelector(selector);
        
        if (!element && attribute === 'content') {
            // Create meta tag if it doesn't exist
            const isProperty = selector.includes('property=');
            element = document.createElement('meta');
            
            if (isProperty) {
                const propertyMatch = selector.match(/property="([^"]+)"/);
                if (propertyMatch) {
                    element.setAttribute('property', propertyMatch[1]);
                }
            } else {
                const nameMatch = selector.match(/name="([^"]+)"/);
                if (nameMatch) {
                    element.setAttribute('name', nameMatch[1]);
                }
            }
            
            document.head.appendChild(element);
        }
        
        if (element) {
            element.setAttribute(attribute, value);
        }
    }

    // Update all meta tags
    function updateAllMetaTags() {
        // Title
        document.title = pageTitle;
        
        // Primary Meta Tags
        updateMetaTag('meta[name="title"]', 'content', pageTitle);
        updateMetaTag('meta[name="description"]', 'content', pageDescription);
        updateMetaTag('meta[name="keywords"]', 'content', pageKeywords);
        
        // Open Graph
        updateMetaTag('meta[property="og:title"]', 'content', pageTitle);
        updateMetaTag('meta[property="og:description"]', 'content', pageDescription);
        updateMetaTag('meta[property="og:url"]', 'content', canonical);
        updateMetaTag('meta[property="og:type"]', 'content', type);
        updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
        updateMetaTag('meta[property="og:locale"]', 'content', getLocale($currentLanguage));
        updateMetaTag('meta[property="og:site_name"]', 'content', 'Keymoji');
        updateMetaTag('meta[property="og:updated_time"]', 'content', updatedTime);
        
        // Twitter
        updateMetaTag('meta[property="twitter:card"]', 'content', 'summary_large_image');
        updateMetaTag('meta[property="twitter:title"]', 'content', pageTitle);
        updateMetaTag('meta[property="twitter:description"]', 'content', pageDescription);
        updateMetaTag('meta[property="twitter:image"]', 'content', fullImageUrl);
        updateMetaTag('meta[property="twitter:url"]', 'content', canonical);
        
        // Robots
        if (noindex) {
            updateMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
        } else {
            updateMetaTag('meta[name="robots"]', 'content', 'index, follow');
        }
        
        // Canonical
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonical);
    }
  
    onMount(() => {
        // Update meta tags
        updateAllMetaTags();
        
        // Inject structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        script.setAttribute('data-seo-structured', 'true');
        document.head.appendChild(script);
        
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
        updateAllMetaTags();
    }
  
    function getLocale(lang) {
        const localeMap = {
            'en': 'en_US',
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
            'ko': 'ko_KR',
            'tlh': 'tlh',
            'qya': 'qya'
        };
        return localeMap[lang] || 'en_US';
    }
</script>
  
<svelte:head>
    <!-- Minimal tags in svelte:head since we update via JavaScript -->
    <!-- Language alternates are static and can be here -->
    {#each alternateUrls as alt}
        <link rel="alternate" hreflang={alt.lang} href={alt.url} />
    {/each}
    <link rel="alternate" hreflang="x-default" href="https://keymoji.wtf/en/" />
</svelte:head>