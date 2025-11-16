<!-- src/routes/VersionHistory.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fly, slide } from 'svelte/transition';
    import { versions } from '../data/versions';
    import { updateSeo } from '../stores/seoStore';
    import { currentLanguage, translations } from '../stores/contentStore';
    import { get } from 'svelte/store';
    import { navigate } from '../utils/routing';
    import PageLayoutComponent from '../components/Layout/PageLayout.svelte';
    import { versionInfo, appVersion } from '../utils/version';

    // Svelte 5 / Webpack: stabile Komponenten-Referenz
    const PageLayout = PageLayoutComponent;

    // Reaktive PageLayout Props (Svelte 5 Runes)
    let pageTitle = $derived.by(() => get(translations)?.versions?.pageTitle || 'Version History');
    let pageDescription = $derived.by(() => get(translations)?.versions?.pageDescription || 'Check out the development history and changelog of Keymoji.');
   
    // Verwende appVersion statt currentVersion Prop
    let currentVersion = appVersion;
    let timelineHeight = 0;
    let versionItems = [];
    
    // Accordion State - Only one version open at a time
    // Current Version initial geöffnet
    let expandedVersion = currentVersion; // Only store the currently expanded version
   
    // Berechnet die Timeline-Höhe: Vom ersten Dot bis zum letzten Dot
    function calculateTimelineHeight() {
        if (!versionItems.length) return 0;
        
        const firstItem = versionItems[0];
        const lastItem = versionItems[versionItems.length - 1];
        
        if (!firstItem || !lastItem) return 0;
        
        const firstRect = firstItem.getBoundingClientRect();
        const lastRect = lastItem.getBoundingClientRect();
        
        // Abstand zwischen erstem und letztem Element
        // Da alle Dots bei top: 20px positioniert sind
        const distance = lastRect.top - firstRect.top;
        
        // Timeline geht von erstem Dot (20px) bis letztem Dot (20px)
        return distance; // Perfekt aligned
    }
   
    // Timeline-Höhe aktualisieren - mit Throttle für Performance
    let isUpdating = false;
    function updateTimelineHeight() {
        if (isUpdating) return;
        isUpdating = true;
        
        requestAnimationFrame(() => {
            const newHeight = calculateTimelineHeight();
            if (newHeight !== timelineHeight) {
                timelineHeight = newHeight;
            }
            isUpdating = false;
        });
    }

    // Navigation zur Home-Seite
    function navigateBack() {
        const lang = get(currentLanguage) || 'en';
        const fullPath = lang === 'en' ? '/' : `/${lang}`;
        navigate(fullPath, { replace: true });
    }
    
    // Toggle Version Expansion - Accordion behavior (only one open at a time)
    function toggleVersion(version) {
        // If clicking the same version that's already open, close it
        // Otherwise, open the clicked version and close all others
        expandedVersion = expandedVersion === version ? null : version;
        
        // Smooth timeline height update während der Animation
        requestAnimationFrame(() => {
            updateTimelineHeight();
            setTimeout(() => updateTimelineHeight(), 50);
            setTimeout(() => updateTimelineHeight(), 100);
            setTimeout(() => updateTimelineHeight(), 150);
            setTimeout(() => updateTimelineHeight(), 200);
            setTimeout(() => updateTimelineHeight(), 250);
            setTimeout(() => updateTimelineHeight(), 300);
            setTimeout(() => updateTimelineHeight(), 350);
        });
    }

    onMount(() => {
        // Update SEO settings for this page
        updateSeo({
            title: pageTitle,
            description: pageDescription,
            url: window.location.pathname,
            pageType: "versions"
        });
        
        // Initial Timeline-Höhe berechnen - mehrfach für smooth initial render
        requestAnimationFrame(() => {
            updateTimelineHeight();
            setTimeout(() => updateTimelineHeight(), 100);
            setTimeout(() => updateTimelineHeight(), 200);
            setTimeout(() => updateTimelineHeight(), 400);
            setTimeout(() => updateTimelineHeight(), 600);
        });
        
        // Timeline-Höhe bei Resize neu berechnen (debounced)
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateTimelineHeight();
            }, 150);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    });
</script>

<svelte:head>
    <title>{pageTitle} - Keymoji</title>
    <meta name="description" content={pageDescription} />
</svelte:head>

<PageLayout {pageTitle} {pageDescription} routeSlug="versions">
    
    <!-- Back Button - Liegt ZUR HÄLFTE auf content-wrapper Rand -->
    <div slot="before-content" class="relative w-full flex justify-center -mb-14">
        <button 
            onclick={navigateBack}
            class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 z-20"
            aria-label={$translations?.index?.backToMainButtonText || 'Back to home'}
            title={$translations?.index?.backToMainButtonText || 'Back to home'}
        >
            <span class="text-lg">←</span>
            <span class="font-semibold">{$translations?.index?.backToMainButtonText || 'Go back home'}</span>
        </button>
    </div>
    
    <!-- Content Container - Filigranes Spacing oben -->
    <div class="container mx-auto pt-8 pb-4">

        <!-- Version History Content - Breiter und scrollbar -->
        <div class="w-full max-w-2xl mx-auto">
            <div class="relative">
                <div class="mx-auto relative timeline-container pb-8">
                    <!-- Timeline-Linie: Perfekt von erstem bis letztem Dot -->
                    <div 
                        style="left: 5px; top: 20px; height: {timelineHeight}px; transition: height 350ms cubic-bezier(0.4, 0, 0.2, 1); will-change: height;" 
                        class="absolute w-0.5 bg-gradient-to-b from-yellow-500 via-aubergine-200 to-yellow-500 dark:from-yellow-500 dark:via-secondary dark:to-yellow-500 opacity-30 transform-gpu"
                    />

                    {#each Object.entries(versions).sort((a, b) => b[0].localeCompare(a[0])) as [version, details], i (version)}
                        {@const isExpanded = expandedVersion === version}
                        
                        <div 
                            bind:this={versionItems[i]}
                            class="relative mb-6 pl-8"
                            in:fly={{ y: 20, duration: 400, delay: i * 80 }}
                            onintroend={() => {
                                updateTimelineHeight();
                            }}
                        >
                            <!-- Timeline Dot: Perfekt zentriert auf Button-Höhe -->
                            <div 
                                style="left: 0; top: 20px;"
                                class="absolute w-3 h-3 rounded-full bg-yellow-500 shadow-md transition-all duration-200"
                            ></div>
                            
                            <!-- Collapsible Version Header - Elegant & Filigran -->
                            <button
                                onclick={() => toggleVersion(version)}
                                class="w-full text-left bg-creme-200 dark:bg-aubergine-900 rounded-xl p-3.5 hover:bg-creme-300 dark:hover:bg-aubergine-800 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                                aria-expanded={isExpanded}
                                aria-controls={`version-${version}-content`}
                            >
                                <div class="flex items-center justify-between gap-3">
                                    <!-- Version & Date - Gleiche Höhe, elegante Ausrichtung -->
                                    <div class="flex items-baseline gap-3 flex-1">
                                        <h2 class="text-lg font-semibold text-black dark:text-white inline-flex items-center gap-2">
                                            v{version}
                                            {#if version === currentVersion}
                                                <span class="px-2 py-0.5 font-semibold text-xs bg-yellow-500 text-black rounded-full">
                                                    Current
                                                </span>
                                            {/if}
                                        </h2>
                                        <time class="text-xs font-normal text-gray-500 dark:text-gray-400">
                                            {details.date}
                                        </time>
                                    </div>
                                    
                                    <!-- Chevron Icon - Rotates on toggle -->
                                    <svg 
                                        class="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-300 ease-in-out transform {isExpanded ? 'rotate-180' : 'rotate-0'}" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                        stroke-width="2.5"
                                        aria-hidden="true"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            <!-- Collapsible Version Content - Elegant & Kompakt -->
                            {#if isExpanded}
                                <div 
                                    id={`version-${version}-content`}
                                    class="mt-3 space-y-3"
                                    transition:slide={{ duration: 350, easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }}
                                >
                                    {#if details.note}
                                        <!-- Simple note version (for minor iterations) -->
                                        <div class="bg-white/50 dark:bg-aubergine-800/50 rounded-lg p-3 border border-gray-200 dark:border-aubergine-700">
                                            <p class="text-sm text-gray-600 dark:text-gray-300 italic">
                                                {details.note}
                                            </p>
                                        </div>
                                    {:else}
                                        <!-- Full changelog version -->
                                        {#each Object.entries(details) as [category, content]}
                                            {#if category !== 'date' && category !== 'note'}
                                                {#each Object.entries(content) as [subcategory, data]}
                                                    {#if data && data.title}
                                                        <div class="bg-white/50 dark:bg-aubergine-800/50 rounded-lg p-3 border border-gray-200 dark:border-aubergine-700 {data.title === 'CRITICAL LESSON LEARNED' ? 'critical-lesson' : ''}">
                                                            <h3 class="text-sm font-semibold text-black dark:text-white mb-2 {data.title === 'CRITICAL LESSON LEARNED' ? 'critical-title' : ''}">
                                                                {data.title}
                                                            </h3>
                                                            {#if data.improvements && data.improvements.length > 0}
                                                                <ul class="space-y-1.5">
                                                                    {#each data.improvements as improvement}
                                                                        <li class="flex items-start {data.title === 'CRITICAL LESSON LEARNED' ? 'critical-item bg-orange-500/8 dark:bg-orange-500/8 rounded px-1.5 py-1 my-0.5 border-l-2 border-orange-600 transition-all duration-200 hover:bg-orange-500/12 dark:hover:bg-orange-500/12 hover:translate-x-0.5 hover:border-orange-400 cursor-pointer' : ''}">
                                                                            <span class="mr-2 text-yellow-500 text-xs mt-0.5">•</span>
                                                                            <span class="text-xs text-black dark:text-white leading-relaxed">
                                                                                {improvement}
                                                                            </span>
                                                                        </li>
                                                                    {/each}
                                                                </ul>
                                                            {/if}
                                                        </div>
                                                    {/if}
                                                {/each}
                                            {/if}
                                        {/each}
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        
        <!-- Back to Top Button (konsistent mit Static Pages) -->
        <div class="w-full mt-12 text-center">
            <button
                onclick={() => {
                    console.log('🔝 Scrolling to top...');
                    
                    // ROBUST SCROLL - Try ALL methods immediately
                    try {
                        // Method 1: window.scrollTo (most reliable)
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        
                        // Method 2: document elements (immediate)
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                        
                        // Method 3: All scrollable containers
                        const scrollableElements = [
                            document.querySelector('.app-container'),
                            document.querySelector('.main-content'),
                            document.querySelector('main'),
                            document.querySelector('.wrapper'),
                            document.querySelector('[class*="scroll"]')
                        ];
                        
                        scrollableElements.forEach(el => {
                            if (el) {
                                el.scrollTop = 0;
                                el.scrollTo?.({ top: 0, behavior: 'smooth' });
                            }
                        });
                        
                        console.log('✅ Scroll to top triggered');
                    } catch (error) {
                        console.error('❌ Scroll error:', error);
                    }
                }}
                class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 text-black dark:bg-aubergine-900 dark:text-white rounded-full font-medium shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                aria-label="Back to top"
                title="Back to top"
            >
                <span class="text-xl">↑</span>
                <span>Back to top</span>
            </button>
        </div>
    </div>

    <!-- Footer Information Component -->
</PageLayout>

<style>
    /* Critical Lesson Learned - Elegant & Filigran */
    .critical-lesson {
        background: linear-gradient(135deg, #fef3c720 0%, #fde68a30 30%, #f59f0b25 70%, #d9770630 100%) !important;
        border: 1px solid #d9770650 !important;
        box-shadow: 0 0 12px rgba(217, 119, 6, 0.15);
        animation: criticalPulse 4s ease-in-out infinite;
    }

    .critical-title {
        text-shadow: 0 0 6px rgba(217, 119, 6, 0.3);
        animation: criticalGlow 3s ease-in-out infinite alternate;
    }

    @keyframes criticalPulse {
        0%, 100% {
            box-shadow: 0 0 12px rgba(217, 119, 6, 0.15);
        }
        50% {
            box-shadow: 0 0 18px rgba(217, 119, 6, 0.25);
        }
    }

    @keyframes criticalGlow {
        0% {
            text-shadow: 0 0 6px rgba(217, 119, 6, 0.3);
        }
        100% {
            text-shadow: 0 0 12px rgba(217, 119, 6, 0.5);
        }
    }
</style>