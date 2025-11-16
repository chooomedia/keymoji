<script lang="ts">
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { onMount, createEventDispatcher } from 'svelte';
    import { currentLanguage, changeLanguage, showLanguageMenu, translations } from '../stores/contentStore';
    import { supportedLanguages } from '../utils/languages';
    import { navigate } from '../utils/routing';
    
    const dispatch = createEventDispatcher();
    
    interface Props {
        position?: 'top' | 'bottom';
        display?: 'full' | 'compact';
        showLabels?: boolean;
    }
    
    let {
        position = 'top',
        display = 'full',
        showLabels = true
    }: Props = $props();
    
    let selectedLang = $state(currentLanguage);
    let elvishFontLoaded = false;
    let menuRef;
    let buttonRef;
    let dropdownTop = 0;
    
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
    
    function toggleLanguageMenu(event) {
        // Prevent event from bubbling to click-outside handler
        if (event) {
            event.stopPropagation();
        }
        
        $showLanguageMenu = !$showLanguageMenu;
        
        // Schließe Category Dropdown, wenn Language Dropdown geöffnet wird
        if ($showLanguageMenu) {
            // Calculate dropdown position once when opening
            // Desktop: Position directly below header (no gap)
            // Mobile: Small gap for better UX
            if (buttonRef) {
                const buttonRect = buttonRef.getBoundingClientRect();
                const isDesktop = window.innerWidth >= 768; // md breakpoint
                dropdownTop = isDesktop 
                    ? buttonRect.bottom // Directly below, no gap
                    : buttonRect.bottom + 4; // Small gap on mobile
            }
            
            // Schließe Category Dropdown falls geöffnet
            const categoryDropdown = document.querySelector('#category-dropdown-menu');
            if (categoryDropdown) {
                // Trigger close event für Category Dropdown
                const categoryButton = document.querySelector('#category-toggle-button');
                if (categoryButton && categoryButton.getAttribute('aria-expanded') === 'true') {
                    categoryButton.click(); // Toggle schließt das Dropdown
                }
            }
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
        
        // Set language in store (contentStore.js)
        await changeLanguage(langCode);
        selectedLang = langCode;
        console.log('🔄 LanguageSwitcher: Language changed to:', selectedLang);
        
        // CRITICAL: Sync with userSettings store
        try {
            const { updateSetting, userSettings: userSettingsStore } = await import('../stores/userSettingsStore.ts');
            // Update userSettings.language to stay in sync
            const currentSettings = userSettingsStore;
            if (currentSettings.language !== langCode) {
                updateSetting('language', langCode);
                console.log('✅ userSettings.language synced:', langCode);
            }
        } catch (error) {
            console.warn('⚠️ Failed to sync userSettings:', error);
        }
        
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
    
    // Keyboard navigation - consistent with BlogGrid category dropdown
    function handleKeydown(event) {
        if (!$showLanguageMenu) return;
        
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
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
        if (currentLanguage === 'sjn') {
            preloadElvishFont();
            
            // Ensure the correct class is applied
            document.body.classList.add('font-elvish');
        }
        
        // Click-outside handler - consistent with BlogGrid category dropdown
        // Use capture phase to ensure it runs before other handlers
        const handleClickOutside = (event) => {
            // Get current state from store (reactive)
            const isMenuOpen = showLanguageMenu;
            
            if (!isMenuOpen) return;
            
            const target = event.target;
            
            // Check if click is on the language toggle button
            const languageButton = document.getElementById('language-toggle-button');
            const isInsideButton = languageButton && (languageButton.contains(target) || languageButton === target);
            
            // Check if click is on a clickable menu item (button) inside the dropdown
            // NOT on the empty space of the fixed container
            const isInsideClickableMenuItem = target.closest('#language-dropdown-menu [role="menuitem"]');
            
            // Also check other menus to avoid conflicts
            const isInsideCategoryMenu = target.closest('#category-dropdown-menu [role="menuitem"]');
            const isInsideCategoryButton = target.closest('#category-toggle-button');
            const isInsideFixedMenu = target.closest('#fixed-menu');
            const isInsideDonateMenu = target.closest('[data-menu-type="donate"]');
            
            // Close dropdown if click is outside all clickable elements
            // This includes clicks on the empty space of the fixed container
            if (!isInsideButton && 
                !isInsideClickableMenuItem && 
                !isInsideCategoryMenu && 
                !isInsideCategoryButton && 
                !isInsideFixedMenu && 
                !isInsideDonateMenu) {
                showLanguageMenu = false;
            }
        };
        
        // Use capture phase for better reliability
        document.addEventListener('click', handleClickOutside, true);
        document.addEventListener('keydown', handleKeydown);
        
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
            document.removeEventListener('keydown', handleKeydown);
        };
    });
    
    $effect(() => {
        selectedLang = currentLanguage;
    });
    
    $effect(() => {
        if (currentLanguage === 'sjn') {
            preloadElvishFont();
            document.body.classList.add('font-elvish');
        } else {
            document.body.classList.remove('font-elvish');
        }
    });
</script>
    
<div class="language-switcher {position} {display}">
    <button
        id="language-toggle-button"
        bind:this={buttonRef}
        type="button"
        class="transition-all transform hover:scale-105 focus:scale-105 active:scale-95 rounded-full font-medium focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 px-4 py-3 h-14"
        on:click={toggleLanguageMenu}
        aria-label={$showLanguageMenu ? ($translations?.languageSwitcher?.closeMenu || 'Close language menu') : ($translations?.languageSwitcher?.changeLanguage || 'Change language')}
        aria-haspopup="true"
        aria-expanded={$showLanguageMenu}
        aria-controls="language-dropdown-menu"
        title={$translations?.languageSwitcher?.changeLanguage || 'Change language'}
    >
        <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
                <span class="flag-icon mr-3">{getCurrentLanguageInfo(selectedLang).flag}</span>
                {#if showLabels || display === 'full'}
                    <span class="lang-code uppercase">{getDisplayCode(selectedLang)}</span>
                {/if}
            </div>
            {#if display === 'full'}
                <div class="flex items-center ml-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 {$showLanguageMenu ? 'transform rotate-180' : ''}">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            {/if}
        </div>
    </button>
    
    <!-- Dropdown Menu - Desktop: Directly below header, no top/left/right border -->
    {#if $showLanguageMenu}
        <div 
            id="language-dropdown-menu"
            bind:this={menuRef}
            class="fixed w-full flex flex-wrap justify-center z-40 right-0 left-0"
            style="top: {dropdownTop}px;"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-toggle-button"
            aria-label="Language selection menu"
        >
            <div 
                class="w-48 mx-auto bg-white dark:bg-aubergine-900 
                    rounded-xl shadow-xl 
                    md:rounded-t-none md:rounded-b-xl 
                    md:border-t-0 md:border-l-0 md:border-r-0 
                    md:border-b md:border-transparent
                    md:shadow-lg
                    overflow-hidden"
                in:slide={{ y: -5, duration: 400, easing: cubicInOut }}
                out:slide={{ y: 5, duration: 400, easing: cubicInOut }}
            >
                <div class="max-h-96 overflow-y-auto custom-scrollbar">
                <ul class="py-2" role="none">
                    {#each languages as lang}
                        <li role="none" lang={lang.ogLocale}>
                            <button
                                class="flex items-center w-full px-4 py-3 hover:bg-aubergine-50 dark:hover:bg-aubergine-800 focus:bg-aubergine-50 dark:focus:bg-aubergine-800 active:bg-aubergine-100 dark:active:bg-aubergine-700 text-sm transition-all text-black dark:text-white focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                                role="menuitem"
                                on:click={() => handleLanguageChange(lang.code)}
                                on:keydown={(e) => handleMenuKeydown(e, lang.code)}
                                aria-current={currentLanguage === lang.code ? 'true' : 'false'}
                                tabindex="-1"
                                aria-label="Switch to {lang.name} language"
                                title={lang.name}
                            >
                                <span class="flag-icon text-xl mr-3" aria-hidden="true">{lang.flag}</span>
                                <span class="lang-name flex-1 text-left">{lang.name}</span>
                                {#if currentLanguage === lang.code}
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
        </div>
    {/if}
</div>