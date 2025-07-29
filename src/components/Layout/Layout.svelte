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
    
    // Hintergrundbild-Eigenschaften
    const hieroglyphicEmojisSrc = '/images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg';
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
    
    onMount(() => {
        mounted = true;
        syncDocumentWithStores();
        
        // Add MutationObserver to ensure lang attribute stays correct
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'lang' && 
                    document.documentElement.lang !== $currentLanguage) {
                    document.documentElement.lang = $currentLanguage;
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
        
        return () => {
            observer.disconnect();
        };
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
        
        // Update special language class
        if ($currentLanguage === 'sjn') {
            document.body.classList.add('font-elvish');
        } else {
            document.body.classList.remove('font-elvish');
        }
    }
</script>

<!-- Service Worker update handler -->
<ServiceWorkerHandler />

<!-- Modal Component - Always include it regardless of message state -->
<Modal />

<!-- Debug Component - Only in development -->
<ModalDebug />

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