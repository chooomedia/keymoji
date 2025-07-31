<!-- src/Layout.svelte -->
<script>
    import { onMount, afterUpdate } from 'svelte';
    import { darkMode } from '../../stores/appStores.js';
    import { currentLanguage } from '../../stores/contentStore.js';
import { updatedTime } from '../../utils/timestamp.js';
    import SkipLink from '../A11y/SkipLink.svelte';
import ServiceWorkerHandler from '../ServiceWorkerHandler.svelte';
import Modal from '../UI/Modal.svelte';
import ModalDebug from '../UI/ModalDebug.svelte';
    
    // URL für Logging
    export const url = "";
    
    // Background-Optimierung: Performance-optimierte Bildquellen
    const hieroglyphicEmojisSrc = '/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg';
    const hieroglyphicEmojisWebP = '/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.webp';
    
    // Apple/Airbnb-Style Gradients mit besserer Performance
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    
    // Performance-State
    let backgroundLoaded = false;
    let supportsWebP = false;
    
    // Reactive background properties mit WebP-Support
    $: finalBgSrc = supportsWebP ? hieroglyphicEmojisWebP : hieroglyphicEmojisSrc;
    $: bgImage = `background-image: url("${finalBgSrc}"), ${$darkMode ? darkGradient : lightGradient}`;
    $: bgBlendMode = $darkMode ? 'multiply' : 'hue';
    
    let mounted = false;
    
    // WebP-Support-Detection (Apple/Airbnb-Style)
    function checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    // Background-Image preloading mit Intersection Observer
    function preloadBackgroundImage() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !backgroundLoaded) {
                        const link = document.createElement('link');
                        link.rel = 'preload';
                        link.href = finalBgSrc;
                        link.as = 'image';
                        link.onload = () => backgroundLoaded = true;
                        document.head.appendChild(link);
                        observer.disconnect();
                    }
                });
            });
            
            const bgElement = document.querySelector('.hieroglyphemojis');
            if (bgElement) observer.observe(bgElement);
        } else {
            // Fallback für ältere Browser
            const img = new Image();
            img.onload = () => backgroundLoaded = true;
            img.src = finalBgSrc;
        }
    }
    
    // Sync the document attributes with store values
    function syncDocumentWithStores() {
        // Set language attribute
        if (document.documentElement.lang !== $currentLanguage) {
            document.documentElement.lang = $currentLanguage;
        }
        
        // Set dark mode class on HTML element for CSS 
        if ($darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Handle special fonts (Elvish/Quenya)
        if ($currentLanguage === 'qya') {
            document.body.classList.add('font-elvish');
            
            // Preload font if not already done
            if (!document.querySelector('link[href*="tengwar_annatar.ttf"]')) {
                try {
                    const fontLink = document.createElement('link');
                    fontLink.rel = 'preload';
                    fontLink.href = '/fonts/tengwar_annatar.ttf';
                    fontLink.as = 'font';
                    fontLink.type = 'font/ttf';
                    fontLink.crossOrigin = 'anonymous';
                    document.head.appendChild(fontLink);
                } catch (error) {
                    console.warn('Failed to preload Elvish font:', error);
                }
            }
        } else {
            document.body.classList.remove('font-elvish');
        }
    }
    
    // Watch for store changes and update document accordingly
    afterUpdate(() => {
        if (mounted) {
            syncDocumentWithStores();
        }
    });
    
    onMount(async () => {
        mounted = true;
        
        // WebP-Support-Check
        supportsWebP = await checkWebPSupport();
        
        syncDocumentWithStores();
        
        // Background-Image intelligent preloading
        setTimeout(() => preloadBackgroundImage(), 100);
        
        // Add MutationObserver to ensure lang attribute stays correct
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'lang' && 
                    document.documentElement.lang !== $currentLanguage) {
                    document.documentElement.lang = $currentLanguage;
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
        
        // Cleanup observer on component destroy
        return () => observer.disconnect();
    });
</script>

<!-- Service Worker update handler -->
<ServiceWorkerHandler />

<!-- Modal Component - Always include it regardless of message state -->
<Modal />

<!-- Debug Component - Only in development -->
<ModalDebug />

<SkipLink target="#main-content" />
  
<div 
    class="wrapper hieroglyphemojis {$darkMode ? 'dark' : ''} {backgroundLoaded ? 'bg-loaded' : 'bg-loading'}" 
    style="{bgImage}; background-size: 16%, cover; background-blend-mode: {bgBlendMode}; will-change: background-position;"
    aria-hidden="false"
    data-url={url}
    data-lang={$currentLanguage}
>
    <main id="main-content" class="main-content">
        <!-- Direktes Einfügen aller Komponenten von Router -->
        <slot></slot>
    </main>
</div>