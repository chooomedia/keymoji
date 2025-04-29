<script>
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { onMount, createEventDispatcher } from 'svelte';
    import { currentLanguage, setLanguage, showLanguageMenu } from '../stores/appStores.js';
    import { supportedLanguages } from '../utils/languages.js';
    import { navigate } from "svelte-routing";
    
    const dispatch = createEventDispatcher();
    
    export let position = 'top'; // top, bottom
    export let display = 'full'; // full, compact
    export let showLabels = true;
    
    let selectedLang = $currentLanguage;
    let elvishFontLoaded = false;
    
    // Direkter Zugriff auf die supportedLanguages aus languageUtils
    const languages = supportedLanguages;
    
    function toggleLanguageMenu() {
      $showLanguageMenu = !$showLanguageMenu;
    }
    
    function updateCurrentPath(langCode) {
      // Get current path
      const path = window.location.pathname;
      
      // Split path to extract non-language part
      const pathSegments = path.split('/').filter(segment => segment !== '');
      
      // Check if first segment is a language code
      if (pathSegments.length > 0 && languages.some(lang => lang.code === pathSegments[0])) {
        // Remove language code
        pathSegments.shift();
      }
      
      // Construct new URL with new language code
      return `/${langCode}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`;
    }
    
    // Preload the Elvish font 
    function preloadElvishFont() {
      if (elvishFontLoaded) return;
      
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = '/fonts/tengwar_annatar.ttf';
      fontLink.as = 'font';
      fontLink.type = 'font/ttf';
      fontLink.crossOrigin = 'anonymous';
      
      document.head.appendChild(fontLink);
      elvishFontLoaded = true;
    }
    
    function handleLanguageChange(langCode) {
      // Do nothing if it's the same language
      if (langCode === selectedLang) {
        $showLanguageMenu = false;
        return;
      }
      
      // If elvish language is selected, ensure font is loaded
      if (langCode === 'qya') {
        preloadElvishFont();
      }
      
      // Set language in store
      setLanguage(langCode);
      selectedLang = langCode;
      
      // Get new path with updated language
      const newPath = updateCurrentPath(langCode);
      
      // Debug output
      console.log('Navigating to new path with language change:', newPath);
      
      // Update URL without reload
      navigate(newPath, { replace: true });
      
      // Close menu
      $showLanguageMenu = false;
      
      // Trigger event for parent components
      dispatch('languageChange', langCode);
    }
    
    function getCurrentLanguageInfo(code) {
      return languages.find(lang => lang.code === code) || languages[0];
    }
    
    // Preload the elvish font when hovering over the elvish option
    function handleMouseOver(lang) {
      if (lang.code === 'qya' && !elvishFontLoaded) {
        preloadElvishFont();
      }
    }
    
    onMount(() => {
      const handleClickOutside = (event) => {
        if ($showLanguageMenu && !event.target.closest('#language-dropdown-menu') && !event.target.closest('#language-toggle-button')) {
          $showLanguageMenu = false;
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    });
    
    // Update selectedLang when currentLanguage changes
    $: selectedLang = $currentLanguage;
</script>
    
<div class="language-switcher {position} {display}">
    <button
      id="language-toggle-button"
      type="button"
      class="btn btn-default btn-md flex items-center text-base"
      on:click={toggleLanguageMenu}
      aria-label="Change language"
      aria-haspopup="true"
      aria-expanded={$showLanguageMenu}
      aria-controls="language-dropdown-menu"
    >
      <span class="flag-icon mr-3">{getCurrentLanguageInfo(selectedLang).flag}</span>
      {#if showLabels || display === 'full'}
        <span class="lang-code uppercase">{getCurrentLanguageInfo(selectedLang).code}</span>
        {#if display === 'full'}
            <span class="dropdown-arrow ml-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="{$showLanguageMenu ? 'transform rotate-180' : ''}">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            </span>
        {/if}
      {/if}
    </button>
  
    {#if $showLanguageMenu}
    <div 
      id="language-dropdown-menu" 
      class="language-dropdown {position === 'top' ? 'top-full mt-2' : 'bottom-full mb-2'} w-36 mx-auto rounded-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-300 ease-in-out"
      role="menu" 
      aria-orientation="vertical" 
      aria-labelledby="language-toggle-button"
    >
      <div class="py-2 overflow-y-auto">
        <ul>
          {#each languages as lang}
            <li
              in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
              out:slide={{ y: 5, duration: 400, easing: cubicInOut }}
            >
              <button
                class="flex items-center w-full px-4 py-3 hover:bg-aubergine-50 text-sm transition-colors {selectedLang === lang.code ? 'font-bold bg-gray-50 dark:bg-aubergine-50' : ''} {lang.code === 'qya' ? 'elvish-language-option' : ''}"
                role="menuitem"
                on:click={() => handleLanguageChange(lang.code)}
                on:focus={() => handleMouseOver(lang)}
                aria-current={selectedLang === lang.code ? 'true' : 'false'}
              >
                <span class="flag-icon text-xl mr-3">{lang.flag}</span>
                <span class="lang-name text-black dark:text-white">{lang.name}</span>
                {#if selectedLang === lang.code}
                  <span class="ml-auto text-yellow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
    {/if}
</div>