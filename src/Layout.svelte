<!-- Layout.svelte -->
<script>
    import { onMount } from 'svelte';
    import { currentLanguage, darkMode } from './stores.js';
    import content from './content.js';
    import { updatedTime } from './updatedTime.js';

    let mounted = false;
    
    onMount(() => {
      mounted = true;
      document.documentElement.lang = $currentLanguage;
  
      // Inject structured data after mount
      const schema = generateSchema();
      const scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.textContent = JSON.stringify(schema);
      document.head.appendChild(scriptElement);
  
      return () => {
        document.head.removeChild(scriptElement);
      };
    });
  
    function generateSchema() {
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": content[$currentLanguage]?.index?.pageTitle,
        "description": content[$currentLanguage]?.index?.pageDescription,
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
          "jobTitle": "Frontend Developer",
          "worksFor": "Keymoji"
        },
        "url": "https://keymoji.wtf",
        "inLanguage": $currentLanguage,
        "dateModified": updatedTime
      };
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
        'tlh': 'tlh_Qo'
      };
      return localeMap[lang] || 'en_US';
    }
  
    const hieroglyphicEmojisSrc = './images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.webp';
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    
    $: bgImage = `background-image: url("${hieroglyphicEmojisSrc}"), ${$darkMode ? darkGradient : lightGradient}`;
    $: bgBlendMode = $darkMode ? 'multiply' : 'hue';
  </script>
  
  <svelte:head>
    <title>{content[$currentLanguage]?.index?.pageTitle}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="{content[$currentLanguage]?.index?.pageDescription}">
    <meta name="keywords" content="{content[$currentLanguage]?.index?.pageKeywords}">
    <meta name="author" content="Christopher Matt">
  
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://keymoji.wtf">
    <meta property="og:title" content="{content[$currentLanguage]?.index?.pageTitle}">
    <meta property="og:description" content="{content[$currentLanguage]?.index?.pageDescription}">
    <meta property="og:locale" content={getLocale($currentLanguage)}>
    <meta property="og:site_name" content="{content[$currentLanguage]?.index?.pageTitle}">
    <meta property="og:updated_time" content={updatedTime}>
    <meta property="og:image" content="./images/keymoji-logo-11-2023-simple.png">
    <meta property="og:image:alt" content="{content[$currentLanguage]?.index?.pageDescription}">
    <meta property="og:image:type" content="image/png">
  
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content={$darkMode ? '#253852' : '#f4ab25'}>
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
  
    <!-- Icons -->
    <link rel="icon" type="image/png" href="./images/keymoji-logo-11-2023-simple.png">
    <link rel="apple-touch-icon" href="./images/keymoji-logo-11-2023-simple.png">
    <link rel="shortcut icon" type="image/png" href="./images/keymoji-logo-11-2023-simple.png">
  </svelte:head>
  
  <div 
    class="wrapper hieroglyphemojis" 
    style="{bgImage}; background-size: 16%, cover; background-blend-mode: {bgBlendMode}" 
    class:dark={$darkMode}
  >
    <slot></slot>
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
    }
  
    :global(body) {
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }
  
    :global(.dark) {
      color-scheme: dark;
    }
  </style>