<!-- src/routes/VersionHistory.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import { versions } from '../data/versions.js';
    import { updateSeo } from '../stores/seoStore.js';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import { navigate } from 'svelte-routing';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import { versionInfo, appVersion } from '../utils/version.js';
    import FooterInfo from '../widgets/FooterInfo.svelte';

    // Reaktive PageLayout Props
    $: pageTitle = $translations?.versions?.pageTitle || 'Version History';
    $: pageDescription = $translations?.versions?.pageDescription || 'Check out the development history and changelog of Keymoji.';
   
    // Verwende appVersion statt currentVersion Prop
    let currentVersion = appVersion;
    let timelineHeight = 0;
    let versionItems = [];
    const DOT_HEIGHT = 42; // w-4 h-4 = 16px für jeden Timeline-Punkt
   
    // Berechnet die Höhe der Timeline basierend auf den Elementen und Timeline-Punkten
    function calculateTimelineHeight() {
      if (!versionItems.length) return 0;
      
      // Gesamthöhe aller Elemente berechnen
      const totalHeight = versionItems.reduce((acc, item, index) => {
        if (!item) return acc;
        const rect = item.getBoundingClientRect();
        
        // Höhe des Elements plus Höhe des Timeline-Punkts
        const elementHeight = rect.height + DOT_HEIGHT;
        
        // Wenn es das letzte Element ist, bis zur Mitte des letzten Punktes
        if (index === versionItems.length - 1) {
          return acc + (DOT_HEIGHT / 2);
        }
        
        return acc + elementHeight;
      }, 0);
   
      return totalHeight;
    }
   
    // Timeline-Höhe aktualisieren wenn sich Elemente ändern
    function updateTimelineHeight() {
      timelineHeight = calculateTimelineHeight();
    }

    // Navigation zur Home-Seite
    function navigateBack() {
        const lang = $currentLanguage || 'en';
        const fullPath = lang === 'en' ? '/' : `/${lang}`;
        navigate(fullPath, { replace: true });
    }

    onMount(() => {
      // Update SEO settings for this page
      updateSeo({
        title: pageTitle,
        description: pageDescription,
        url: window.location.pathname,
        pageType: "versions"
      });
      
      updateTimelineHeight();
      // Listener für Größenänderungen
      window.addEventListener('resize', updateTimelineHeight);
      
      return () => {
        window.removeEventListener('resize', updateTimelineHeight);
      };
    });
</script>

<svelte:head>
    <title>{pageTitle} - Keymoji</title>
    <meta name="description" content={pageDescription} />
</svelte:head>

<PageLayout {pageTitle} {pageDescription}>
    
    <!-- Content Container -->
    <div class="container mx-auto py-4">

        <!-- Back Link nach der Beschreibung -->
        <div class="text-center mb-6">
            <button 
                on:click={navigateBack}
                class="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors duration-200"
                aria-label={$translations?.index?.backToMainButtonText || 'Back to home'}
            >
                <span class="text-lg">←</span>
                {$translations?.index?.backToMainButtonText || 'Go back home'}
            </button>
        </div>

        <!-- Version History Content - Breiter und ohne Parent-Hintergrund -->
        <div class="w-full max-w-xl mx-auto">
            <div class="max-h-[60vh]">
                <div class="mx-auto relative timeline-container">
                    <!-- Dynamische Timeline-Linie -->
                    <div 
                        style="left:23px; height: {timelineHeight}px;" 
                        class="absolute top-2 w-0.5 bg-aubergine-200 dark:bg-secondary opacity-50 duration-300"
                    />

                    {#each Object.entries(versions).sort((a, b) => b[0].localeCompare(a[0])) as [version, details], i (version)}
                        <div 
                            bind:this={versionItems[i]}
                            class="relative mb-12 pl-10 lg:pl-14"
                            in:fly={{ y: 20, duration: 300, delay: i * 100 }}
                            on:animationend={updateTimelineHeight}
                        >
                            <!-- Timeline dot -->
                            <div class="absolute left-6 top-2 w-4 h-4 rounded-full bg-yellow-500 border-4 border-creme-500 dark:border-aubergine-800 transform -translate-x-1/2"></div>
                            
                            <!-- Version content -->
                            <div class="flex items-center gap-4 mb-4">
                                <time class="text-sm font-normal text-gray dark:text-gray-400">
                                    {details.date}
                                </time>
                                <h2 class="text-xl font-semibold text-black dark:text-white inline-flex items-center">
                                    v{version}
                                    {#if version === currentVersion}
                                        <span class="ml-3 px-3 py-1 text-xs bg-yellow-500 text-black rounded-full group cursor-pointer relative"
                                              title="Version Codename: {versionInfo.codename}"
                                              aria-label="Current version codename: {versionInfo.codename}">
                                            Current
                                            <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-100">
                                                {versionInfo.codename}
                                            </span>
                                        </span>
                                    {/if}
                                </h2>
                            </div>

                            <!-- Version details -->
                            {#each Object.entries(details) as [category, content]}
                                {#if category !== 'date'}
                                    {#each Object.entries(content) as [subcategory, data]}
                                        <div class="mb-6 bg-creme-200 dark:bg-aubergine-900 rounded-xl p-4 {data.title === 'CRITICAL LESSON LEARNED' ? 'critical-lesson' : ''}">
                                            <h3 class="text-lg font-semibold text-black dark:text-white mb-3 {data.title === 'CRITICAL LESSON LEARNED' ? 'critical-title' : ''}">
                                                {data.title}
                                            </h3>
                                            <ul class="space-y-2">
                                                {#each data.improvements as improvement}
                                                    <li class="flex items-start {data.title === 'CRITICAL LESSON LEARNED' ? 'critical-item' : ''}">
                                                        <span class="mr-2 dark:text-creme-500">•</span>
                                                        <span class="text-gray dark:text-gray-400">
                                                            {improvement}
                                                        </span>
                                                    </li>
                                                {/each}
                                            </ul>
                                        </div>
                                    {/each}
                                {/if}
                            {/each}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Footer Information Component -->
    <FooterInfo slot="footer" />
</PageLayout>

<style>
    /* Critical Lesson Learned Animation - Subtle but Contrasting */
    .critical-lesson {
        background: linear-gradient(135deg, #fef3c733 0%, #fde68a3d 30%, #f59f0b39 70%, #d9770643 100%) !important;
        border: 2px solid #d9770643;
        box-shadow: 0 0 15px rgba(217, 119, 6, 0.2);
        animation: criticalPulse 4s ease-in-out infinite;
    }

    .critical-title {
        text-shadow: 0 0 8px rgba(217, 119, 6, 0.4);
        animation: criticalGlow 3s ease-in-out infinite alternate;
    }

    .critical-item {
        background: rgba(217, 119, 6, 0.4);

        border-radius: 6px;
        padding: 6px;
        margin: 3px 0;
        border-left: 2px solid #d97706;
        transition: all 0.3s ease;
    }

    .critical-item > span {
        color: #000000!important;
    }

    .critical-item:hover {
        background: rgba(217, 119, 6, 0.15);
        transform: translateX(3px);
        border-left: 2px solid #f59e0b;
        cursor: pointer;
    }

    @keyframes criticalPulse {
        0%, 100% {
            box-shadow: 0 0 15px rgba(217, 119, 6, 0.2);
        }
        50% {
            box-shadow: 0 0 25px rgba(217, 119, 6, 0.4);
        }
    }

    @keyframes criticalGlow {
        0% {
            text-shadow: 0 0 8px rgba(217, 119, 6, 0.7);
        }
        100% {
            text-shadow: 0 0 40px rgba(217, 119, 6, 0.9);
        }
    }
</style>