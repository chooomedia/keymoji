<script>
    import { onMount, afterUpdate } from 'svelte';
    import { currentLanguage, darkMode } from './stores/appStores.js';
    import content from './content.js';
    import { updatedTime } from './updatedTime.js';
    import SkipLink from './components/A11y/SkipLink.svelte';
    import ServiceWorkerHandler from './components/ServiceWorkerHandler.svelte';
    
    // URL für Logging
    export const url = "";
    
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