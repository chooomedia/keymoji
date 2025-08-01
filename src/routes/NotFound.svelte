<!-- src/routes/NotFound.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { navigate } from "svelte-routing";
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import { supportedLanguages } from '../utils/languages.js';
    import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';
    import { navigateToRoute, navigateToHome } from '../utils/navigation.js';
    import FooterInfo from '../widgets/FooterInfo.svelte';
    
    // Reaktive PageLayout Props
    $: pageTitle = $translations?.notFound?.pageTitle || '404 - Page Not Found';
    $: pageDescription = $translations?.notFound?.pageDescription || 'The page you are looking for does not exist.';
    
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
    
    onMount(() => {
        // Load recent emojis
        loadRecentEmojis();
    });
    
</script>

<svelte:head>
    <title>{pageTitle} - Keymoji</title>
    <meta name="description" content={pageDescription} />
</svelte:head>

<PageLayout {pageTitle} {pageDescription}>
    <!-- 404 Content -->
    <div class="min-h-screen" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center min-h-screen py-32 px-4 z-10 gap-4 scroll-smooth overflow-x-hidden w-full">
            
            <!-- 404 Content Box -->
            <div class="content-wrapper w-11/12 md:w-26r rounded-xl bg-creme-500 dark:bg-aubergine-800 p-6">
                <!-- 404 Error Display -->
                <div class="text-center mb-8">
                    <div class="text-8xl mb-4 animate-bounce">😵‍💫</div>
                    <h2 class="text-2xl font-bold dark:text-white mb-2">
                        {$translations?.notFound?.oopsTitle || 'Oops! Page not found'}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        {$translations?.notFound?.oopsDescription || 'The page you are looking for might have been moved or deleted.'}
                    </p>
                </div>

                <!-- Quick Navigation -->
                <div class="space-y-4 mb-8">
                    <h3 class="text-lg font-semibold dark:text-white text-center">
                        {$translations?.notFound?.quickNavTitle || 'Quick Navigation'}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {#each siteNavigation as nav}
                            <button
                                class="p-4 bg-white dark:bg-aubergine-900 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                                on:click={() => navigateToPage(nav.path)}
                            >
                                <div class="text-3xl mb-2 group-hover:animate-bounce">{nav.icon}</div>
                                <div class="text-sm font-medium dark:text-white">
                                    {$translations?.[nav.titleKey.split('.')[0]]?.[nav.titleKey.split('.')[1]] || nav.titleKey}
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {$translations?.[nav.descKey.split('.')[0]]?.[nav.descKey.split('.')[1]] || nav.descKey}
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Recent Emojis -->
                {#if recentEmojis.length > 0}
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold dark:text-white text-center">
                            {$translations?.notFound?.recentEmojisTitle || 'Recent Emojis'}
                        </h3>
                        <div class="flex justify-center flex-wrap gap-2">
                            {#each recentEmojis as emoji}
                                <span class="text-2xl p-2 bg-white dark:bg-aubergine-900 rounded-lg hover:scale-110 transition-transform cursor-pointer">
                                    {emoji}
                                </span>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Back to Home Button -->
                <div class="text-center mt-8">
                    <button
                        class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                        on:click={navigateToHome}
                    >
                        🏠 {$translations?.notFound?.backToHome || 'Back to Home'}
                    </button>
                </div>
            </div>
        </section>
    </div>

    <!-- Footer Information Component -->
    <FooterInfo slot="footer" />
</PageLayout>