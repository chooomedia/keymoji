<script>
    import { hamburger } from "./shapes.js";
    import { languageText, currentLanguage, setLanguage } from './stores.js';
    import LoginMenu from './widgets/LoginMenu.svelte';
    import content from './content.js';  // Wir importieren content wieder

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
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
</script>

<div class="w-full fixed flex flex-wrap justify-center top-5 mx-auto z-30">
    <nav class="md:w-4/12 w-full mx-3 bg-creme dark:bg-aubergine border-gray dark:bg-gray justify-center rounded-full border-4 border-creme dark:border-aubergine">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between">
            <a href="/" class="flex flex-col items-center rtl:space-x-reverse">
                <h1 class="flex flex-wrap text-2xl font-semibold items-center whitespace-nowrap dark:text-white">
                    <svg role="img" class="w-52 h-52 transition" viewBox="0 0 600 600" fill="currentColor" alt={$languageText.header.pageTitle}>
                        {@html content.logo.svg}
                    </svg>
                    {$languageText.header.pageTitle}
                    <span class="text-xs -top-1 relative">
                        {$languageText.header.pageVersion}
                    </span>
                </h1>
            </a>
            <div class="flex items-center md:order-2 rtl:space-x-reverse space-x-4">
                <button type="button" data-dropdown-toggle="language-dropdown-menu" class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3.5 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none">
                    <a href="/">
                        {$languageText.header.pageTitle}
                    </a>
                </button>
                <!-- Dropdown -->
                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray rounded-full shadow dark:bg-aubergine" id="language-dropdown-menu">
                    <ul class="py-2 font-medium" role="none">
                        {#each languages as lang}
                            <li>
                                <a href="/" on:click|preventDefault={() => setLanguage(lang.code)} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                                    {lang.flag} {lang.name}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
                <LoginMenu />

                <button data-collapse-toggle="navbar-language" type="button" class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder p-3.5 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none" aria-controls="navbar-language" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 98 98">
                        <path d="{hamburger}"></path>
                    </svg>
                </button>
            </div>
        </div>
    </nav>
</div>