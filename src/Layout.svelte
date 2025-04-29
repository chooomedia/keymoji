<script>
    import { onMount, afterUpdate } from 'svelte';
    import { currentLanguage, darkMode } from './stores/appStores.js';
    import content from './content.js';
    import { updatedTime } from './updatedTime.js';
    import SkipLink from './components/A11y/SkipLink.svelte';
    import ServiceWorkerHandler from './components/ServiceWorkerHandler.svelte';
    import SEO from './components/Seo.svelte';
    
    // URL für Logging
    export let url = "";
    
    // Hintergrundbild-Eigenschaften
    const hieroglyphicEmojisSrc = '../images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg';
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    
    $: bgImage = `background-image: url("${hieroglyphicEmojisSrc}"), ${$darkMode ? darkGradient : lightGradient}`;
    $: bgBlendMode = $darkMode ? 'multiply' : 'hue';
    
    let mounted = false;
    
    // Sync the document attributes with store values
    function syncDocumentWithStores() {
        // Set language attribute
        if (document.documentElement.lang !== $currentLanguage) {
            document.documentElement.lang = $currentLanguage;
        }
        
        // Set dark mode class
        if ($darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Set special language class for Elvish
        if ($currentLanguage === 'qya') {
            document.body.classList.add('font-elvish');
        } else {
            document.body.classList.remove('font-elvish');
        }
    }
    
    onMount(() => {
        // Sync immediately when component mounts
        syncDocumentWithStores();
        mounted = true;
        
        // Debug-Information
        console.log('Layout mounted with URL:', url, 'and language:', $currentLanguage);
        
        // Schema-Daten nach dem Mount einfügen
        const schema = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content[$currentLanguage]?.index?.pageTitle || "Keymoji",
            "description": content[$currentLanguage]?.index?.pageDescription || "Emoji Password Generator",
            "applicationCategory": "SecurityTool",
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
                "jobTitle": "Frontend Developer",
                "worksFor": "CHOOOMEDIA"
            },
            "url": "https://keymoji.wtf",
            "inLanguage": $currentLanguage,
            "dateModified": updatedTime
        };
        
        const scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        scriptElement.textContent = JSON.stringify(schema);
        document.head.appendChild(scriptElement);
        
        // Check for service worker updates
        if (sessionStorage.getItem('swUpdateAvailable') === 'true') {
            // Clear the flag
            sessionStorage.removeItem('swUpdateAvailable');
            
            // Add a small delay to ensure the app is fully mounted
            setTimeout(() => {
                const refreshMessage = content[$currentLanguage]?.serviceWorker?.refreshPrompt || 
                    'Refresh to use the latest version';
                
                // Create a notification element
                const notification = document.createElement('div');
                notification.className = 
                    'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow text-black py-2 px-4 rounded-full shadow-lg';
                notification.textContent = refreshMessage;
                
                // Add a refresh button
                const refreshButton = document.createElement('button');
                refreshButton.textContent = '🔄';
                refreshButton.className = 'ml-2 font-bold';
                refreshButton.addEventListener('click', () => {
                    window.location.reload();
                });
                
                notification.appendChild(refreshButton);
                document.body.appendChild(notification);
                
                // Auto-remove after 10 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 10000);
            }, 1000);
        }
        
        return () => {
            // Clean up schema script if component unmounts
            if (scriptElement.parentNode) {
                document.head.removeChild(scriptElement);
            }
        };
    });
    
    // Watch for store changes and update document accordingly
    afterUpdate(() => {
        if (mounted) {
            syncDocumentWithStores();
        }
    });
    
    // We also use reactive statements to ensure changes are reflected
    $: if (mounted && $darkMode !== undefined) {
        if ($darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    $: if (mounted && $currentLanguage) {
        document.documentElement.lang = $currentLanguage;
        console.log('Language changed to:', $currentLanguage);
        
        // Update special language class
        if ($currentLanguage === 'qya') {
            document.body.classList.add('font-elvish');
        } else {
            document.body.classList.remove('font-elvish');
        }
    }
</script>
  
<!-- Global SEO component that will be managed by the SEO store -->
<SEO 
  url={url}
  pageType="global" 
/>

<!-- Service Worker update handler -->
<ServiceWorkerHandler />

<SkipLink target="#main-content" />
  
<div 
    class="wrapper hieroglyphemojis {$darkMode ? 'dark' : ''}" 
    style="{bgImage}; background-size: 16%, cover; background-blend-mode: {bgBlendMode}"
    aria-hidden="false"
    data-url={url}
    data-lang={$currentLanguage}
>
    <main id="main-content" class="main-content">
        <!-- Direktes Einfügen aller Komponenten von Router -->
        <slot></slot>
    </main>
</div>
  
<style>
.hieroglyphemojis {
    animation: gradient 270s ease infinite;
    background-size: 16%;
    min-height: 100vh;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

:global(html) {
    height: 100%;
    box-sizing: border-box;
    scroll-behavior: smooth;
}

:global(body) {
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

:global(.dark) {
    color-scheme: dark;
}

.main-content {
    width: 100%;
    min-height: 100vh;
    position: relative;
}

@media (prefers-reduced-motion: reduce) {
    .hieroglyphemojis {
        animation: none;
    }
    
    :global(html) {
        scroll-behavior: auto;
    }
}
</style>