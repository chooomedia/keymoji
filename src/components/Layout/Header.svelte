<script>
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { hamburger, logo } from "../../assets/shapes.js";
    import { isDisabled, showDonateMenu, isLoggedIn, currentAccount } from '../../stores/appStores.js';
    import { currentLanguage, t, showLanguageMenu, changeLanguage } from '../../stores/contentStore.js';
    import GitButton from '../../widgets/GitButton.svelte';
    import { createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-routing';
    import LanguageSwitcher from '../LanguageSwitcher.svelte';
    import { supportedLanguages } from '../../utils/languages.js';
    import { translations } from '../../stores/contentStore.js';
    import { navigateToBlog } from '../../utils/navigation.js';

    const dispatch = createEventDispatcher();

    // Reaktive Übersetzungen mit robuster Fehlerbehandlung
    $: headerTitle = $translations && $translations.header && $translations.header.pageTitle 
        ? $translations.header.pageTitle 
        : 'Keymoji';
    
    function handleBlogNavigation() {
        navigateToBlog(false);
    }

    function navigateToAccount() {
        navigate('/account', { replace: true });
    }

    async function handleLanguageChange(langCode) {
        await changeLanguage(langCode);
        showLanguageMenu.set(false);
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

<!-- Header mit Logo links, Buttons rechts -->
<div class="w-full fixed flex flex-wrap justify-center top-5 mx-auto z-30 overflow-x-hidden">
    <nav class="md:w-1/3 w-full mx-3 bg-creme-500 dark:bg-aubergine-800 justify-center rounded-full p-1 relative z-30 overflow-x-hidden">
        <div class="max-w-screen-2xl flex items-center justify-between">
            <!-- Logo und Titel links -->
            <div class="flex items-center">
                <h2 class="flex flex-wrap md:text-2xl font-semibold items-center whitespace-nowrap dark:text-white">
                    <a 
                        href="/{$currentLanguage}/" 
                        class="flex items-center hover:text-yellow transition-colors"
                        aria-label={headerTitle}
                    >
                        <!-- Keymoji Logo SVG from shapes.js -->
                        <svg 
                            class="w-14 h-14 transition-transform hover:scale-110" 
                            aria-label="Keymoji Logo"
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 600 600"
                            style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                        >
                            {@html logo}
                        </svg>
                        <span class="ml-2">{headerTitle}</span>
                    </a>
                </h2>
            </div>
            
            <!-- Buttons rechts: Language-Switcher und GitHub Button (flex side-by-side) -->
            <div class="flex items-center space-x-2">
                <!-- Language Switcher -->
                <div class="relative">
                    <LanguageSwitcher position="bottom" display="full" showLabels={true} />
                </div>
                
                <!-- Account Button -->
                <div class="flex">
                    <button 
                        on:click={navigateToAccount}
                        class="btn btn-default btn-md"
                        aria-label="navigate to account"
                    >
                        {#if $isLoggedIn}👤{:else}🔐{/if}
                    </button>
                </div>
                
                <!-- GitHub Button (mobile und desktop) -->
                <div class="flex">
                    <button class="btn btn-default btn-md">
                        <a href="https://github.com/chooomedia/keymoji" target="_blank" aria-label="Star chooomedia/keymoji on GitHub">
                            ⭐
                        </a>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</div>