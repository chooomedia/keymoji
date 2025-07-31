<script>
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { onMount, createEventDispatcher } from 'svelte';
    import { currentLanguage, changeLanguage, showLanguageMenu } from '../stores/contentStore.js';
    import { supportedLanguages } from '../utils/languages.js';
    import { navigate } from "svelte-routing";
    
    const dispatch = createEventDispatcher();
    
    export let position = 'top'; // top, bottom
    export let display = 'full'; // full, compact
    export let showLabels = true;
    
    let selectedLang = $currentLanguage;
    let elvishFontLoaded = false;
    let menuRef;
    let buttonRef;
    
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
            
            // Font-Face definieren falls nicht vorhanden
            if (!document.querySelector('style[data-elvish-font]')) {
                const fontFaceStyle = document.createElement('style');
                fontFaceStyle.setAttribute('data-elvish-font', 'true');
                fontFaceStyle.textContent = `
                    @font-face {
                        font-family: 'Tengwar Annatar';
                        src: url('/fonts/tengwar_annatar.ttf') format('truetype');
                        font-weight: normal;
                        font-style: normal;
                        font-display: swap;
                    }
                `;
                document.head.appendChild(fontFaceStyle);
            }
            
            elvishFontLoaded = true;
            console.log('Elvish font preloaded and ready');
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
        
        // Remove ALL language codes from the path
        const languageCodes = languages.map(lang => lang.code);
        const nonLanguageSegments = pathSegments.filter(segment => !languageCodes.includes(segment));
        
        // Construct new URL with new language code
        const newPath = `/${langCode}${nonLanguageSegments.length > 0 ? '/' + nonLanguageSegments.join('/') : ''}`;
        
        console.log('🔄 updateCurrentPath:', {
            originalPath: path,
            pathSegments,
            languageCodes,
            nonLanguageSegments,
            newPath
        });
        
        return newPath;
    }
    
    async function handleLanguageChange(langCode) {
        console.log('🔄 LanguageSwitcher: handleLanguageChange called with:', langCode);
        console.log('🔄 LanguageSwitcher: current selectedLang:', selectedLang);
        
        // Do nothing if it's the same language
        if (langCode === selectedLang) {
            console.log('🔄 LanguageSwitcher: Same language, closing menu');
            $showLanguageMenu = false;
            return;
        }
        
        // Vorladen der Elvish Schriftart, wenn auf Elvish gewechselt wird
        if (langCode === 'sjn') {
            preloadElvishFont();
        }
        
        console.log('🔄 LanguageSwitcher: Calling changeLanguage...');
        // Set language in store
        await changeLanguage(langCode);
        selectedLang = langCode;
        console.log('🔄 LanguageSwitcher: Language changed to:', selectedLang);
        
        // Get new path with updated language
        const newPath = updateCurrentPath(langCode);
        
        // Debug output
        console.log('🔄 LanguageSwitcher: Navigating to new path:', newPath);
        
        // Update URL without reload
        navigate(newPath, { replace: true });
        
        // Close menu
        $showLanguageMenu = false;
        console.log('🔄 LanguageSwitcher: Menu closed');
        
        // Trigger event for parent components
        dispatch('languageChange', langCode);
    }
    
    function getCurrentLanguageInfo(code) {
        return languages.find(lang => lang.code === code) || languages[0];
    }

    // Funktion für die korrekte Anzeige des Sprachcodes
    function getDisplayCode(code) {
        // Spezielle Anzeige für Schweizerdeutsch
        if (code === 'de-CH') {
            return 'CH';
        }
        return code.toUpperCase();
    }
    
    // Keyboard navigation
    function handleKeydown(event) {
        if (!$showLanguageMenu) return;
        
        switch (event.key) {
            case 'Escape':
                $showLanguageMenu = false;
                buttonRef?.focus();
                break;
            case 'ArrowDown':
                event.preventDefault();
                const firstMenuItem = menuRef?.querySelector('[role="menuitem"]');
                firstMenuItem?.focus();
                break;
        }
    }
    
    function handleMenuKeydown(event, langCode) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                handleLanguageChange(langCode);
                break;
            case 'ArrowDown':
                event.preventDefault();
                const nextItem = event.target.parentElement?.nextElementSibling?.querySelector('[role="menuitem"]');
                nextItem?.focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                const prevItem = event.target.parentElement?.previousElementSibling?.querySelector('[role="menuitem"]');
                prevItem?.focus();
                break;
        }
    }
    
    onMount(() => {
        // Schriftart vorladen, wenn die aktuelle Sprache Elvish ist
        if ($currentLanguage === 'sjn') {
            preloadElvishFont();
            
            // Ensure the correct class is applied
            document.body.classList.add('font-elvish');
        }
        
        const handleClickOutside = (event) => {
            if ($showLanguageMenu && 
                !event.target.closest('#language-dropdown-menu') && 
                !event.target.closest('#language-toggle-button')) {
                $showLanguageMenu = false;
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
        };
    });
    
    // Update selectedLang when currentLanguage changes
    $: selectedLang = $currentLanguage;
    
    // Reaktive Schriftart-Anwendung
    $: if ($currentLanguage === 'sjn') {
        preloadElvishFont();
        document.body.classList.add('font-elvish');
    } else {
        document.body.classList.remove('font-elvish');
    }
</script>
    
<div class="language-switcher {position} {display}">
    <button
        id="language-toggle-button"
        bind:this={buttonRef}
        type="button"
        class="btn btn-default btn-md flex items-center text-base h-[56px]"
        on:click={toggleLanguageMenu}
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={$showLanguageMenu}
        aria-controls="language-dropdown-menu"
    >
        <span class="flag-icon mr-3">{getCurrentLanguageInfo(selectedLang).flag}</span>
        {#if showLabels || display === 'full'}
            <span class="lang-code uppercase">{getDisplayCode(selectedLang)}</span>
            {#if display === 'full'}
                <span class="dropdown-arrow ml-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="{$showLanguageMenu ? 'transform rotate-180' : ''}">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            {/if}
        {/if}
    </button>
    
    <!-- Dropdown Menu -->
    {#if $showLanguageMenu}
        <div 
            id="language-dropdown-menu"
            bind:this={menuRef}
            class="fixed w-full flex flex-wrap justify-center z-50 right-0 left-0"
            style="top: {buttonRef?.getBoundingClientRect().bottom + 5}px;"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-toggle-button"
            aria-label="Language selection menu"
        >
            <div 
                class="w-48 mx-auto max-h-96 overflow-y-auto scrollbar-consistent scroll-smooth rounded-b-xl shadow-lg bg-creme-500 dark:bg-aubergine-900 ring-1 ring-black ring-opacity-5 z-50 transform pb-2"
                in:slide={{ y: -5, duration: 400, easing: cubicInOut }}
                out:slide={{ y: 5, duration: 400, easing: cubicInOut }}
            >
                <ul class="py-2" role="none">
                    {#each languages as lang}
                        <li role="none">
                            <button
                                class="flex items-center w-full px-4 py-3 hover:bg-aubergine-50 text-sm transition-colors text-black dark:text-white  focus:ring-2 focus:ring-yellow focus:ring-offset-2"
                                role="menuitem"
                                on:click={() => handleLanguageChange(lang.code)}
                                on:keydown={(e) => handleMenuKeydown(e, lang.code)}
                                aria-current={$currentLanguage === lang.code ? 'true' : 'false'}
                                tabindex="-1"
                                aria-label="Switch to {lang.name} language"
                            >
                                <span class="flag-icon text-xl mr-3" aria-hidden="true">{lang.flag}</span>
                                <span class="lang-name flex-1 text-left">{lang.name}</span>
                                {#if $currentLanguage === lang.code}
                                    <span class="ml-auto text-yellow shrink-0" aria-label="Currently selected language">
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