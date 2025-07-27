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
    
    // Funktion zum Vorladen der Elvish-Schriftart
    function preloadElvishFont() {
        // Prüfen ob die Schriftart bereits vorgeladen wurde
        if (document.querySelector('link[href*="tengwar_annatar.ttf"]')) {
            elvishFontLoaded = true;
            return;
        }
        
        try {
            // Schriftart vorladen
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.href = '/fonts/tengwar_annatar.ttf';
            fontLink.as = 'font';
            fontLink.type = 'font/ttf';
            fontLink.crossOrigin = 'anonymous';
            document.head.appendChild(fontLink);
            
            elvishFontLoaded = true;
            console.log('Elvish font preloaded');
        } catch (error) {
            console.warn('Failed to preload Elvish font:', error);
        }
    }
    
    function toggleLanguageMenu() {
        $showLanguageMenu = !$showLanguageMenu;
        
        // Font vorladen, wenn das Menü geöffnet wird (für schnelleres Umschalten)
        if ($showLanguageMenu) {
            preloadElvishFont();
        }
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
    
    function handleLanguageChange(langCode) {
        // Do nothing if it's the same language
        if (langCode === selectedLang) {
            $showLanguageMenu = false;
            return;
        }
        
        // Vorladen der Elvish Schriftart, wenn auf Elvish gewechselt wird
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
    
    onMount(() => {
        // Schriftart vorladen, wenn die aktuelle Sprache Elvish ist
        if ($currentLanguage === 'qya') {
            preloadElvishFont();
            
            // Ensure the correct class is applied
            document.body.classList.add('font-elvish');
        }
        
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
    <!-- Mobile backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
      on:click={toggleLanguageMenu}
      aria-hidden="true"
    ></div>
    
    <div 
      id="language-dropdown-menu" 
      class="language-dropdown {position === 'top' ? 'top-full mt-2' : 'bottom-full mb-2'} 
             w-48 sm:w-36 
             max-h-[60vh] sm:max-h-96 
             mx-auto rounded-xl shadow-lg bg-creme dark:bg-aubergine-dark 
             ring-1 ring-black ring-opacity-5 z-50 
             transform transition-all duration-300 ease-in-out
             overflow-hidden"
      role="menu" 
      aria-orientation="vertical" 
      aria-labelledby="language-toggle-button"
    >
      <div class="py-2 overflow-y-auto max-h-[calc(60vh-1rem)] sm:max-h-[calc(24rem-1rem)] overscroll-contain">
        <ul>
          {#each languages as lang}
            <li
              in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
              out:slide={{ y: 5, duration: 400, easing: cubicInOut }}
            >
              <button
                class="flex items-center w-full 
                       px-4 py-4 sm:py-3 
                       hover:bg-aubergine-50 
                       text-sm transition-colors 
                       active:bg-aubergine-50
                       focus:bg-aubergine-50 focus:outline-none
                       {selectedLang === lang.code ? 'font-bold bg-gray-50 dark:bg-aubergine-50' : ''} 
                       {lang.code === 'qya' ? 'elvish-language-option' : ''}"
                role="menuitem"
                on:click={() => handleLanguageChange(lang.code)}
                aria-current={selectedLang === lang.code ? 'true' : 'false'}
              >
                <span class="flag-icon text-xl mr-3" aria-hidden="true">{lang.flag}</span>
                <span class="lang-name text-black dark:text-white flex-1 text-left">{lang.name}</span>
                {#if selectedLang === lang.code}
                  <span class="ml-auto text-yellow shrink-0" aria-label="Selected">
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