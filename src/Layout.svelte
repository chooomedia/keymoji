<script>
    import { onMount } from 'svelte';
    import { currentLanguage, darkMode } from './stores.js';
    import SkipLink from './components/A11y/SkipLink.svelte';
    
    // URL für Logging
    export const url = "";
    
    // Hintergrundbild-Eigenschaften
    const hieroglyphicEmojisSrc = '../images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg';
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    
    $: bgImage = `background-image: url("${hieroglyphicEmojisSrc}"), ${$darkMode ? darkGradient : lightGradient}`;
    $: bgBlendMode = $darkMode ? 'multiply' : 'hue';
    
    // Dynamic font loading for Elvish
    function loadElvishFont() {
      if ($currentLanguage === 'qya') {
        // Add a style tag with font-face declaration
        const styleId = 'elvish-font-style';
        
        // Skip if already added
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            @font-face {
              font-family: 'Tengwar Annatar';
              src: url('./fonts/tengwar_annatar.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            
            .font-elvish {
              font-family: 'Tengwar Annatar', 'Graphik', Arial, sans-serif;
            }
          `;
          
          document.head.appendChild(style);
          console.log('Added elvish font style');
        }
        
        // Add class to body
        document.body.classList.add('font-elvish');
      } else {
        document.body.classList.remove('font-elvish');
      }
    }
    
    onMount(() => {
      // Sprache setzen
      document.documentElement.lang = $currentLanguage;
      
      // Dark Mode Klasse setzen
      if ($darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Check if we need to load Elvish font
      loadElvishFont();
      
      // Debug-Information
      console.log('Layout mounted with URL:', url, 'and language:', $currentLanguage);
      
      // REMOVED: No longer adding structured data here to avoid duplication with SEO component
    });
    
    // Auf Dark Mode Änderungen achten
    $: if ($darkMode !== undefined) {
      if ($darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Auf Sprachänderungen achten
    $: if ($currentLanguage) {
      document.documentElement.lang = $currentLanguage;
      if (typeof document !== 'undefined') {
        loadElvishFont();
      }
      console.log('Language changed to:', $currentLanguage);
    }
</script>
  
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