<!-- src/components/LanguageSwitcher.svelte -->
<script>
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { onMount, createEventDispatcher } from 'svelte';
    import { currentLanguage, setLanguage, showLanguageMenu, getSupportedLanguages } from '../stores.js';
    import { navigate } from "svelte-routing";
    
    const dispatch = createEventDispatcher();
    
    export let position = 'top'; // top, bottom
    export let display = 'full'; // full, compact
    export let showLabels = true;
    
    let selectedLang = $currentLanguage;
    
    // Unterstützte Sprachen ohne nicht-Sprachschlüssel
    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸', ogLocale: 'en_US' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', ogLocale: 'de_DE' },
        { code: 'dech', name: 'Schwiizerdütsch', flag: '🇨🇭', ogLocale: 'de_CH' },
        { code: 'es', name: 'Español', flag: '🇪🇸', ogLocale: 'es_ES' },
        { code: 'nl', name: 'Nederlands', flag: '🇳🇱', ogLocale: 'nl_NL' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹', ogLocale: 'it_IT' },
        { code: 'fr', name: 'Français', flag: '🇫🇷', ogLocale: 'fr_FR' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱', ogLocale: 'pl_PL' },
        { code: 'da', name: 'Dansk', flag: '🇩🇰', ogLocale: 'da_DK' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺', ogLocale: 'ru_RU' },
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷', ogLocale: 'tr_TR' },
        { code: 'af', name: 'Afrikaans', flag: '🇿🇦', ogLocale: 'af_ZA' },
        { code: 'ja', name: '日本語', flag: '🇯🇵', ogLocale: 'ja_JP' },
        { code: 'ko', name: '한국어', flag: '🇰🇷', ogLocale: 'ko_KO' },
        { code: 'tlh', name: 'Klingon', flag: '🖖', ogLocale: 'tlh_Qo' },
        { code: 'qya', name: 'Elvish', flag: '🧝‍♀️', ogLocale: 'qya_Qo' }
    ].filter(lang => getSupportedLanguages().includes(lang.code));
    
    function toggleLanguageMenu() {
        $showLanguageMenu = !$showLanguageMenu;
    }
    
    function updateCurrentPath(langCode) {
        // Aktuellen Pfad holen
        const path = window.location.pathname;
        
        // Aktuellen Pfad zerlegen, um den Nicht-Sprachteil zu extrahieren
        const pathSegments = path.split('/').filter(segment => segment !== '');
        
        // Prüfen, ob das erste Segment ein Sprachcode ist
        if (pathSegments.length > 0 && languages.some(lang => lang.code === pathSegments[0])) {
            // Sprachcode entfernen
            pathSegments.shift();
        }
        
        // Neue URL mit neuem Sprachcode konstruieren
        return `/${langCode}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`;
    }
    
    function handleLanguageChange(langCode) {
        // Nichts tun, wenn es dieselbe Sprache ist
        if (langCode === selectedLang) {
            $showLanguageMenu = false;
            return;
        }
        
        // Sprache im Store setzen
        setLanguage(langCode);
        selectedLang = langCode;
        
        // Neuen Pfad mit aktualisierter Sprache holen
        const newPath = updateCurrentPath(langCode);
        
        // Debug-Ausgabe
        console.log('Navigating to new path with language change:', newPath);
        
        // URL ohne Reload aktualisieren
        navigate(newPath, { replace: true });
        
        // Menü schließen
        $showLanguageMenu = false;
        
        // Event für übergeordnete Komponenten auslösen
        dispatch('languageChange', langCode);
    }
    
    function getCurrentLanguageInfo(code) {
        return languages.find(lang => lang.code === code) || languages[0];
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
    
    // selectedLang aktualisieren, wenn sich currentLanguage ändert
    $: selectedLang = $currentLanguage;
    </script>
      
    <div class="language-switcher {position} {display}">
        <button
            id="language-toggle-button"
            type="button"
            class="btn btn-default btn-md flex items-center space-x-2"
            on:click={toggleLanguageMenu}
            aria-label="Change language"
            aria-haspopup="true"
            aria-expanded={$showLanguageMenu}
            aria-controls="language-dropdown-menu"
        >
            <span class="flag-icon">{getCurrentLanguageInfo(selectedLang).flag}</span>
            {#if showLabels || display === 'full'}
            <span class="lang-code uppercase">{getCurrentLanguageInfo(selectedLang).code}</span>
            {#if display === 'full'}
                <span class="lang-name hidden md:inline-block">{getCurrentLanguageInfo(selectedLang).name}</span>
                <span class="dropdown-arrow">
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
        class="language-dropdown {position === 'top' ? 'top-full mt-2' : 'bottom-full mb-2'} rounded-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-300 ease-in-out"
        role="menu" 
        aria-orientation="vertical" 
        aria-labelledby="language-toggle-button"
        >
        <div class="py-2 max-h-80 overflow-y-auto">
            <ul class="divide-y divide-gray-100 dark:divide-gray-700">
            {#each languages as lang}
                <li
                in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
                out:slide={{ y: 5, duration: 400, easing: cubicInOut }}
                >
                <button
                    class="flex items-center w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-aubergine-50 transition-colors {selectedLang === lang.code ? 'font-bold bg-gray-50 dark:bg-aubergine-50' : ''}"
                    role="menuitem"
                    on:click={() => handleLanguageChange(lang.code)}
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
      
    <style>
    .language-switcher {
        position: relative;
        z-index: 50;
    }
    
    .language-dropdown {
        position: absolute;
        width: max-content;
        min-width: 12rem;
        left: 0;
    }
    
    .top .language-dropdown {
        top: 100%;
    }
    
    .bottom .language-dropdown {
        bottom: 100%;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .dropdown-arrow {
        transition: none !important;
        }
    }
    
    /* Focus styles for accessibility */
    button:focus-visible {
        outline: 2px solid #f4ab25;
        outline-offset: 2px;
    }
    </style>