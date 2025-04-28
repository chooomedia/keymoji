<script>
    import { onMount } from 'svelte';
    import { currentLanguage, darkMode } from './stores.js';
    import content from './content.js';
    import { updatedTime } from './updatedTime.js';
    import SkipLink from './components/A11y/SkipLink.svelte';
  
    // Props
    export const url = "";
    
    let mounted = false;
    
    onMount(() => {
      mounted = true;
      document.documentElement.lang = $currentLanguage;
      
      // Set dark mode class
      if ($darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Inject structured data after mount
      const schema = generateSchema();
      const scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.textContent = JSON.stringify(schema);
      document.head.appendChild(scriptElement);
    
      return () => {
        if (scriptElement.parentNode) {
          document.head.removeChild(scriptElement);
        }
      };
    });
    
    // Watch for dark mode changes
    $: if (mounted && $darkMode !== undefined) {
      if ($darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Generate structured data
    function generateSchema() {
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": content[$currentLanguage]?.index?.pageTitle,
        "description": content[$currentLanguage]?.index?.pageDescription,
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
    }
    
    // Background image properties
    const hieroglyphicEmojisSrc = './images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.svg';
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    
    $: bgImage = `background-image: url("${hieroglyphicEmojisSrc}"), ${$darkMode ? darkGradient : lightGradient}`;
    $: bgBlendMode = $darkMode ? 'multiply' : 'hue';
  </script>
  
  <SkipLink target="#main-content" />
  
  <div 
    class="wrapper hieroglyphemojis {$darkMode ? 'dark' : ''}" 
    style="{bgImage}; background-size: 16%, cover; background-blend-mode: {bgBlendMode}"
    aria-hidden="false"
  >
    <main id="main-content" tabindex="-1" class="main-content">
      <slot></slot>
    </main>
  </div>
  
  <!-- Behalt den bestehenden Style-Block bei -->
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
      outline: none;
      position: relative;
      width: 100%;
    }
    
    .main-content:focus {
      outline: none;
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