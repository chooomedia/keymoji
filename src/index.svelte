<script>
    import { Router, Route, navigate } from 'svelte-routing';
    import { modalMessage, currentLanguage, darkMode } from './stores.js';
    import { linkedinIcon } from './shapes.js';
    import { fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import Header from './Header.svelte';
    import UserCounter from './UserCounter.svelte';
    import EmojiDisplay from './EmojiDisplay.svelte';
    import ContactForm from './ContactForm.svelte';
    import ErrorModal from './ErrorModal.svelte';
    import VersionHistory from './VersionHistory.svelte';
    import FixedMenu from './widgets/FixedMenu.svelte';
    import content from './content.js';
    import { getText } from './stores.js';
    import SEO from './components/SEO.svelte';
  
    export const url = "";
  
    // Debug-Flag - für die Produktion entfernen
    let showDebug = process.env.NODE_ENV === 'development' && (window.location.search.includes('debug=true'));
  
    function navigateToVersion() {
      navigate(`/${$currentLanguage}/versions`, { replace: false });
    }
  
    // Prüfen, ob die Seite gerendert wurde
    let hasRendered = false;
    
    onMount(() => {
      // Als gerendert markieren
      hasRendered = true;
      
      // Debug-Informationen
      console.log('Index.svelte mounted with language:', $currentLanguage);
      console.log('Current URL:', window.location.pathname);
    });
  </script>
  
  {#if showDebug}
  <div style="position: fixed; top: 0; left: 0; background: rgba(0,0,0,0.8); color: white; z-index: 9999; padding: 10px;">
      Current Path: {window.location.pathname} | Language: {$currentLanguage}
  </div>
  {/if}
  
  <SEO 
    pageType="index" 
    url={window.location.pathname}
    title={content[$currentLanguage]?.index?.pageTitle || "Emoji Password Generator"}
    description={content[$currentLanguage]?.index?.pageDescription || "Generate secure emoji passwords for better online security."}
  />
  
  <div class="app-container" data-lang={$currentLanguage}>
    <Header />
    
    {#if $modalMessage && $modalMessage.trim() !== ''}
      <ErrorModal />
    {/if}
    
    <div class="container mx-auto min-h-screen">
      <Route path="/">
        <div in:fly={{y: 50, duration: 400, delay: 300}} out:fade={{duration: 200}}> 
          <section class="flex flex-col justify-center items-center min-h-screen py-5 overflow-auto touch-none z-10 gap-4">
            <UserCounter />
            <!-- Main content -->
            <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
              <h1 class="md:text-3xl text-2xl font-semibold dark:text-white mb-2 text-center w-full">
                {content[$currentLanguage]?.index?.pageTitle || 'Emoji Password Generator'}
              </h1>
              <p class="dark:text-gray mb-3 text-center w-full leading-relaxed">
                {content[$currentLanguage]?.index?.pageDescription || 'Generate secure emoji passwords for better online security.'}
              </p>
            </div>
  
            <div class="content-wrapper pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60">
              <EmojiDisplay />
            </div>
  
            <footer>
              <div class="flex items-center justify-center space-x-2 text-sm text-gray dark:text-gray">
                <button class="hover:text-yellow transition-colors duration-200" 
                  on:click={navigateToVersion} 
                  type="button"
                  aria-label="View version history"
                >
                  {getText('header.pageVersion') || 'v0.2.2'}
                </button>
                <span class="w-1 h-1 rounded-full bg-gray dark:bg-gray"></span>
                <span>Created by</span>
                <a
                  href="https://www.linkedin.com/in/chooomedia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 hover:text-yellow transition-colors duration-200"
                >
                  Christopher Matt
                  <svg class="w-4 h-4 transform translate-y-[0.5px]" viewBox="0 0 24 24" fill="currentColor">
                    {@html linkedinIcon}
                  </svg>
                </a>
              </div>
            </footer>
          </section>
        </div>
      </Route>
  
      <Route path="/versions">
        <VersionHistory currentVersion={content[$currentLanguage]?.header?.pageVersion || 'v0.2.2'} />
      </Route>
  
      <Route path="/contact">
        <div in:fly={{y: 50, duration: 400, delay: 300}} out:fade={{duration: 200}}>
          <section class="flex flex-col justify-center items-center min-h-screen py-5">
            <div class="content-wrapper backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl">
              <ContactForm />
            </div>
          </section>
        </div>
      </Route>
    </div>
  
    <FixedMenu align={'bottom'} />
  </div>
  
  <style>
    .content-wrapper {
      box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
    }
    
    :global(.dark) .content-wrapper {
      box-shadow: 20px 20px 60px #0c0d22, -20px -20px 60px #1c1c1c;
    }
  
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    /* Sicherstellen der Inhalts-Sichtbarkeit während Animationen */
    :global(body) {
      overflow-x: hidden;
    }
    
    /* Barrierefreiheitsverbesserungen */
    :global(button:focus-visible),
    :global(a:focus-visible) {
      outline: 2px solid #f4ab25;
      outline-offset: 2px;
    }
    
    /* Animationen reduzieren falls gewünscht */
    @media (prefers-reduced-motion: reduce) {
      :global(div[in], div[out]) {
        transition: none !important;
        animation: none !important;
      }
    }
  </style>