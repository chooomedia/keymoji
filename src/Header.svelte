<script>
    import { onMount } from 'svelte';
    import { hamburger } from "./shapes.js";
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { currentLanguage, setLanguage, showLanguageMenu, getText, isDisabled } from './stores.js';
    import LoginMenu from './widgets/LoginMenu.svelte';
    import content from './content.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'dech', name: 'Schwiizerdütsch', flag: '🇨🇭' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱' },
        { code: 'da', name: 'Dansk', flag: '🇩🇰' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'tlh', name: 'Klingon', flag: '🖖' },
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
    <nav class="md:w-3/12 w-full mx-3 bg-creme dark:bg-aubergine border-gray dark:bg-gray justify-center rounded-full border-4 border-creme dark:border-aubergine">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between">
            <a href="/" class="flex flex-col items-center rtl:space-x-reverse">
                <h1 class="flex flex-wrap md:text-2xl font-semibold items-center whitespace-nowrap dark:text-white">
                    <svg role="img" class="w-52 h-52 transition" viewBox="0 0 600 600" fill="currentColor" aria-label={getText('header.pageTitle')}>
                        {@html content.logo.svg}
                    </svg>
                    {getText('header.pageTitle')}
                    <span class="text-xs -top-1 relative">
                        {getText('header.pageVersion')}
                    </span>
                </h1>
            </a>
            <div class="flex items-center md:order-2 rtl:space-x-reverse space-x-2">
                <button
                    id="language-toggle-button"
                    type="button"
                    class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder uppercase py-3.5 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                    on:click={toggleLanguageMenu}
                    aria-haspopup="true"
                    aria-expanded={$showLanguageMenu}
                >
                    {getCurrentLanguageInfo($currentLanguage).flag} {getCurrentLanguageInfo($currentLanguage).code}
                </button>

                {#if $showLanguageMenu}
                    <div id="language-dropdown-menu" class="w-auto mx-auto fixed top-20 rounded-b-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-10 transform transition-all duration-300 ease-in-out -translate-x-28 space-x-0
                    " role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                        <ul class="py-2 font-medium" role="none">
                            {#each languages as lang}
                                <li
                                in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
                                out:slide={{ y: 5, duration: 400, easing: cubicInOut }} >
                                    <button 
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

                <button data-collapse-toggle="navbar-language" type="button" class="sr-only bg-powder text-black dark:bg-aubergine-dark dark:text-powder p-3.5 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none" aria-controls="navbar-language" aria-expanded="false" disabled={$isDisabled}>
                    <span class="sr-only">{getText('header.openMainMenu')}</span>
                    <svg class="w-5 h-5" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 98 98">
                        <path d="{hamburger}"></path>
                    </svg>
                </button>
            </div>
        </div>
    </nav>
</div>