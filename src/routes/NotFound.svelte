<!-- src/routes/NotFound.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { navigate } from "svelte-routing";
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import Header from '../components/Layout/Header.svelte';
    import FixedMenu from '../widgets/FixedMenu.svelte';
    import { supportedLanguages } from '../utils/languages.js';
    import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';
    import { navigateToRoute, navigateToHome } from '../utils/navigation.js';
    
    // Site Navigation Data
    const siteNavigation = [
        { 
            path: '', 
            icon: '🏠', 
            titleKey: 'header.pageTitle',
            descKey: 'index.pageDescription'
        },
        { 
            path: 'contact', 
            icon: '💌', 
            titleKey: 'contactForm.pageTitle',
            descKey: 'contactForm.pageDescription'
        },
        { 
            path: 'versions', 
            icon: '📝', 
            titleKey: 'versions.pageTitle',
            descKey: 'versions.pageDescription'
        }
    ];
    
    // Recent Emojis from localStorage
    let recentEmojis = [];
    
    function loadRecentEmojis() {
        const stored = storageHelpers.get(STORAGE_KEYS.RECENT_EMOJIS, []);
        recentEmojis = Array.isArray(stored) ? stored.slice(0, 6) : []; // Max 6 recent emojis
    }
    
    function navigateToPage(path) {
        navigateToRoute(path, true);
    }
    
    // Reaktive Übersetzungen
    $: pageTitle = $translations.notFound.pageTitle || '404 - Page Not Found';
    $: pageDescription = $translations.notFound.pageDescription || 'The page you are looking for does not exist.';
    
    onMount(() => {
        // Load recent emojis
        loadRecentEmojis();
    });
    

</script>

<!-- App Container -->
<main class="app-container" data-lang={$currentLanguage}>
    <!-- Header -->
    <Header />
    
    <!-- Main Content Container -->
    <div class="min-h-screen overflow-y-auto scrollbar-consistent scroll-smooth" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center min-h-screen py-8 px-4 z-10 gap-4 overflow-y-auto scrollbar-consistent scroll-smooth">

            <!-- 404 Emoji above header -->
            <div class="flex justify-center mb-3">
                <div class="text-6xl">😵</div>
            </div>

            <!-- Main Heading -->
            <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
                <h1 class="md:text-3xl text-2xl font-semibold dark:text-white mb-2 text-center w-full">
                    {pageTitle}
                </h1>
                <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                    {pageDescription}
                </p>
            </div>

            <!-- 404 Content - Parent ohne Hintergrund, Content mit Hintergrund -->
            <div class="w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-500 dark:bg-aubergine-80 backdrop-opacity-60 shadow-xl overflow-hidden">
                <div class="p-4 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scroll-smooth">
                    <!-- Site Navigation -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold dark:text-white text-center">
                            {$translations.notFound.navigationTitle || 'Available Pages'}
                        </h3>
                        
                        <div class="space-y-2">
                            {#each siteNavigation as route}
                                <button
                                    on:click={() => navigateToPage(route.path)}
                                    class="flex items-center space-x-3 p-3 rounded-lg bg-creme-50 dark:bg-aubergine-900 hover:bg-yellow-100 dark:hover:bg-yellow-800 hover:text-black dark:hover:text-white transition-all duration-200 w-full text-left group"
                                >
                                    <span class="text-xl group-hover:scale-110 transition-transform duration-200">{route.icon}</span>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium dark:text-white text-sm">
                                            {$translations[route.titleKey.split('.')[0]]?.[route.titleKey.split('.')[1]] || route.titleKey}
                                        </div>
                                        <div class="text-xs text-gray dark:text-gray-400 truncate">
                                            {($translations[route.descKey.split('.')[0]]?.[route.descKey.split('.')[1]] || route.descKey).substring(0, 45)}...
                                        </div>
                                    </div>
                                    <span class="text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 text-sm">→</span>
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Recent Emojis -->
                    {#if recentEmojis.length > 0}
                        <div class="space-y-3">
                            <h3 class="text-lg font-semibold dark:text-white text-center">
                                {$translations.notFound.recentEmojis || 'Recent Emojis'}
                            </h3>
                            
                            <div class="flex flex-wrap justify-center gap-2">
                                {#each recentEmojis as emoji}
                                    <button 
                                        class="text-xl p-2 bg-creme-500-50 dark:bg-aubergine-900 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800 hover:scale-110 transition-all duration-200"
                                        title="Click to copy: {emoji}"
                                        aria-label="Copy emoji {emoji}"
                                        on:click={() => navigator.clipboard?.writeText(emoji)}
                                        on:keydown={(e) => e.key === 'Enter' && navigator.clipboard?.writeText(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Back Button -->
                    <div class="text-center">
                        <button 
                            on:click={() => navigateToHome()}
                            class="bg-yellow-500 text-black shadow-md transition duration-300 ease-in-out transform hover:scale-105 px-6 py-3 rounded-full font-medium"
                            aria-label={$translations.index.backToMainButtonText}
                        >
                            🏠 {$translations.index.backToMainButtonText || 'Go back home'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- Fixed Menu -->
    <FixedMenu align={'bottom'} />
</main>