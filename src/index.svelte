<script>
    import { Router, Link, Route } from "svelte-routing";
    import { modalMessage, currentLanguage, darkMode } from './stores.js';
    import { fade, fly } from 'svelte/transition';
    import EmojiDisplay from './EmojiDisplay.svelte';
    import ContactForm from './ContactForm.svelte';
    import ErrorModal from './ErrorModal.svelte';
    import Header from './Header.svelte';
    import FixedMenu from './widgets/FixedMenu.svelte';
    import BlogGrid from './BlogGrid.svelte';
    import content from './content.js';
    import { updatedTime } from './updatedTime.js';
  
    let url = "";

    const hieroglyphicEmojisSrc = './images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.png';
    // Definiere die Gradienten
    const darkGradient = 'linear-gradient(-45deg, #050413, #040320f5, #080715, #040310)';
    const lightGradient = 'linear-gradient(-45deg, #e0e0e0f7, #f8f8f8f0, #ecececf0, #e0e0e0f2)';
    const darkBlendMode = 'multiply';
    const lightBlendMode = 'hue';

    // Reaktive Berechnung des Hintergrundbilds
    $: bgImage = `background-image: url("${hieroglyphicEmojisSrc}"), ${$darkMode ? darkGradient : lightGradient}; background-size: 16%, cover; background-blend-mode: ${$darkMode ? darkBlendMode : lightBlendMode}`;
  </script>
  
  <svelte:head>
    <meta name="description" content="{content[$currentLanguage]?.index?.pageDescription}">
    <meta name="keywords" content="{content[$currentLanguage]?.index?.pageKeywords}">
    <meta name="author" content="Christopher Matt">
  
    <!-- Open Graph / Facebook -->
    <meta property="og:locale" content="{ 
      $currentLanguage === 'de' ? 'de_DE' :
      $currentLanguage === 'dech' ? 'de_CH' :
      $currentLanguage === 'es' ? 'es_ES' :
      $currentLanguage === 'nl' ? 'nl_NL' :
      $currentLanguage === 'it' ? 'it_IT' :
      $currentLanguage === 'fr' ? 'fr_FR' :
      $currentLanguage === 'pl' ? 'pl_PL' :
      $currentLanguage === 'da' ? 'da_DK' :
      $currentLanguage === 'ru' ? 'ru_RU' :
      $currentLanguage === 'tr' ? 'tr_TR' :
      $currentLanguage === 'af' ? 'af_ZA' :
      $currentLanguage === 'ja' ? 'ja_JP' :
      $currentLanguage === 'ko' ? 'ko_KO' :
      $currentLanguage === 'tlh' ? 'tlh_Qo' : 'en_US'
    }">
  
    <meta property="og:type" content="website">
    <meta property="og:title" content="{content[$currentLanguage]?.index?.pageTitle}">
    <meta property="og:url" content="https://keymoji.wtf">
    <meta property="og:site_name" content="{content[$currentLanguage]?.index?.pageTitle}">
    <meta property="og:updated_time" content={updatedTime}>
    <meta property="og:image:alt" content="{content[$currentLanguage]?.index?.pageDescription}">
    <meta property="og:image:type" content="image/png">
  
    <!-- Favicons -->
    <link rel="icon" type="image/png" href="./images/keymoji-logo-11-2023-simple.png">
    <link rel="apple-touch-icon" href="./images/keymoji-logo-11-2023-simple.png">
    <link rel="shortcut icon" type="image/png" href="./images/keymoji-logo-11-2023-simple.png">
  </svelte:head>

  
  <Router {url}>
    <div class="wrapper hieroglyphemojis" style="{bgImage}" class:dark={$darkMode}>
      {#if $modalMessage && $modalMessage.trim() !== ''}
        <ErrorModal />
      {/if}
      <main class="scroll-container">
        <Header />
        
        <div class="container mx-auto min-h-screen">
          <Route path="/">
            <div in:fly={{y: 50, duration: 400, delay: 400}} out:fade>
              <section class="flex flex-col justify-center items-center min-h-screen py-5 overflow-auto touch-none z-10 gap-4">
                <h1 class="flex flex-wrap md:text-3xl font-semibold dark:text-white mb-4">{content[$currentLanguage]?.index?.pageTitle}</h1>
                <div class="content-wrapper pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 transition duration-300 ease-in-out transform">
                  <EmojiDisplay />
                </div>
              </section>
            </div>
          </Route>
    
          <Route path="/blog">
            <div in:fly={{y: 50, duration: 400, delay: 400}} out:fade>
              <section class="container mx-auto py-5 px-4 min-h-screen z-10">
                <div class="max-w-6xl mx-auto mt-24">
                  <BlogGrid />
                </div>
              </section>
            </div>
          </Route>
    
          <Route path="/contact">
            <div in:fly={{y: 50, duration: 400, delay: 400}} out:fade>
              <section class="flex flex-col justify-center items-center min-h-screen py-5">
                <div class="content-wrapper backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl">
                  <ContactForm />
                </div>
              </section>
            </div>
          </Route>
        </div>
    
        <FixedMenu align={'bottom'} />
      </main>
    </div>
  </Router>
  
  <style>
    .hieroglyphemojis {
      animation: gradient 270s ease infinite;
      background-size: 16%;
    }
  
    @keyframes gradient {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  
    .content-wrapper {
      box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
    }
    
    :global(.dark) .content-wrapper {
      box-shadow: 20px 20px 60px #0c0d22, -20px -20px 60px #1c1c1c;
    }
  </style>