<script>
    import { onMount } from 'svelte';
    import { hamburger } from "./shapes.js";
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { currentLanguage, showLanguageMenu, getText, isDisabled } from './stores.js';
    import GitButton from './widgets/GitButton.svelte';
    import content from './content.js';
    import { createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-routing';
    import LanguageSwitcher from './components/LanguageSwitcher.svelte';

    const dispatch = createEventDispatcher();

    function navigateToBlog() {
        navigate(`/${$currentLanguage}/blog`, { replace: false });
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
    <nav class="md:w-1/3 w-full mx-3 bg-creme dark:bg-aubergine justify-center rounded-full p-1">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between">
            <div class="flex flex-col items-center rtl:space-x-reverse">
                <h2 class="flex flex-wrap md:text-2xl font-semibold items-center whitespace-nowrap dark:text-white">
                    <a 
                        href="/{$currentLanguage}/" 
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
                <!--<button
                    on:click={navigateToBlog}
                    class="relative btn btn-default btn-md"
                    aria-label="Navigate to the blog article overview" 
                    disabled
                >
                📝
                </button>-->
                
                <!-- Language Switcher Component -->
                <LanguageSwitcher position="top" display="full" showLabels={true} />

                <GitButton />

                <button 
                    aria-label="open the hamburger menu" 
                    data-collapse-toggle="navbar-language" 
                    type="button" 
                    class="sr-only bg-powder text-black dark:bg-aubergine-dark dark:text-powder p-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none" 
                    aria-controls="navbar-language" 
                    aria-expanded="false" 
                    disabled={$isDisabled}>
                    <span class="sr-only">{getText('header.openMainMenu')}</span>
                    <svg class="w-5 h-5" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 98 98">
                        <path d="{hamburger}"></path>
                    </svg>
                </button>
            </div>
        </div>
    </nav>
</div>