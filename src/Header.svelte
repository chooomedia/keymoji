<script>
    import { onMount } from 'svelte';
    import { hamburger } from "./shapes.js";
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { currentLanguage, setLanguage, showLanguageMenu, getText, isDisabled } from './stores.js';
    import LoginMenu from './widgets/LoginMenu.svelte';
    import content from './content.js';
    import { createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-routing';

    const dispatch = createEventDispatcher();

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
        { code: 'qya', name: 'Elvish', flag: '🦄', ogLocale: 'qya' }
    ];

    const toggleLanguageMenu = () => {
        showLanguageMenu.update(current => !current);
    };

    const handleLanguageChange = (langCode) => {
        setLanguage(langCode);
        dispatch('languageChange', langCode);
    };

    const getCurrentLanguageInfo = (code) => {
        return languages.find(lang => lang.code === code) || languages[0];
    };

    function navigateToBlog() {
        navigate("/blog", { replace: false });
    }

    onMount(() => {
        const handleClickOutside = (event) => {
            if ($showLanguageMenu && !event.target.closest('#language-dropdown-menu') && !event.target.closest('#language-toggle-button')) {
                showLanguageMenu.set(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="w-full fixed flex flex-wrap justify-center top-5 mx-auto z-30">
    <nav class="md:w-1/3 w-full mx-3 bg-creme dark:bg-aubergine justify-center rounded-full border-4 border-creme dark:border-aubergine">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between">
            <div class="flex flex-col items-center rtl:space-x-reverse">
                <h2 class="flex flex-wrap md:text-2xl font-semibold items-center whitespace-nowrap dark:text-white">
                    <a 
                        href="/" 
                        class="flex items-center hover:text-yellow transition-colors"
                        aria-label={getText('header.pageTitle')}
                    >
                        <svg role="img" class="w-52 h-52 transition" viewBox="0 0 600 600" fill="currentColor">
                            {@html content.logo.svg}
                        </svg>
                        <span>{getText('header.pageTitle')}</span>
                    </a>
                </h2>
            </div>
            <div class="flex items-center md:order-2 rtl:space-x-reverse space-x-2">
                <button
                    on:click={navigateToBlog}
                    class="relative btn btn-default btn-md hidden"
                    aria-label="Navigate to the blog article overview" 
                    disabled
                >
                📝
              </button>
                <button
                    id="language-toggle-button"
                    type="button"
                    class="btn btn-default btn-md"
                    on:click={toggleLanguageMenu}
                    aria-label="Change the language" 
                    aria-haspopup="true"
                    aria-expanded={$showLanguageMenu}
                >
                   {getCurrentLanguageInfo($currentLanguage).flag} <span class="text-base uppercase">{getCurrentLanguageInfo($currentLanguage).code}</span>
                </button>

                {#if $showLanguageMenu}
                    <div id="language-dropdown-menu" class="w-auto mx-auto fixed top-20 rounded-b-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-10 transform transition-all duration-300 ease-in-out -translate-x-28 translate-y-1 space-x-0
                    " role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                        <ul class="py-2 font-medium" role="none">
                            {#each languages as lang}
                                <li
                                in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
                                out:slide={{ y: 5, duration: 400, easing: cubicInOut }} >
                                    <button aria-label="Change the language to {lang.name}" 
                                        on:click={() => handleLanguageChange(lang.code)}
                                        class="flex flex-wrap text-black dark:text-white md:px-4 px-2 py-2 text-sm w-full text-left hover:bg-gray group hover:text-white" 
                                        role="menuitem" 
                                    >
                                        {lang.flag} {lang.name}
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                <LoginMenu />

                <button aria-label="open the hamburger menu" data-collapse-toggle="navbar-language" type="button" class="sr-only bg-powder text-black dark:bg-aubergine-dark dark:text-powder p-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none" aria-controls="navbar-language" aria-expanded="false" disabled={$isDisabled}>
                    <span class="sr-only">{getText('header.openMainMenu')}</span>
                    <svg class="w-5 h-5" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 98 98">
                        <path d="{hamburger}"></path>
                    </svg>
                </button>
            </div>
        </div>
    </nav>
</div>
