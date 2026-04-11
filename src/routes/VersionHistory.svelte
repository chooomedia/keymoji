<!-- src/routes/VersionHistory.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { fly, slide } from 'svelte/transition';
    import { versions } from '../data/versions.js';
    import { updateSeo } from '../stores/seoStore';
    import { currentLanguage, translations } from '../stores/contentStore.js';
    import { navigate } from 'svelte-routing';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import { versionInfo, appVersion } from '../utils/version';
    import FooterInfo from '../widgets/FooterInfo.svelte';

    // Reaktive PageLayout Props
    $: pageTitle = $translations?.versions?.pageTitle || 'Version History';
    $: pageDescription = $translations?.versions?.pageDescription || 'Check out the development history and changelog of Keymoji.';
   
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
        const lang = $currentLanguage || 'en';
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

<!-- Ensure content is always visible - even if translations are loading -->
{#if $translations?.versions || true}
<PageLayout {pageTitle} {pageDescription}>
    
    <!-- Back Button - Muted style like Random button -->
    <div slot="before-content" class="relative w-full flex justify-center -mb-14">
        <button
            on:click={navigateBack}
            class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 z-20"
            aria-label={$translations?.index?.backToMainButtonText || 'Back to home'}
            title={$translations?.index?.backToMainButtonText || 'Back to home'}
        >
            <span class="text-lg">←</span>
            <span class="font-semibold">{$translations?.index?.backToMainButtonText || 'Back to home'}</span>
        </button>
    </div>
    
    <!-- Content Container - Filigranes Spacing oben -->
    <div class="container mx-auto pt-8">

        <!-- Version History Content - Breiter und scrollbar -->
        <div class="w-full max-w-2xl mx-auto">
            <div class="relative">
                <div class="mx-auto relative timeline-container pb-4">
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
                            on:introend={() => {
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
                                on:click={() => toggleVersion(version)}
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
                                                    {$translations?.versions?.currentLabel || 'Current'}
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
                                                                        <li class="flex items-start {data.title === 'CRITICAL LESSON LEARNED' ? 'critical-item' : ''}">
                                                                            <span class="mr-2 text-yellow-500 text-xs mt-0.5">•</span>
                                                                            <span class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
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
        <div class="w-full text-center">
            <button
                on:click={() => {
                    const appContainer = document.querySelector('.app-container');
                    if (appContainer) {
                        appContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}
                class="flex w-full items-center justify-center gap-2 py-4 rounded-full font-medium transition-all transform hover:scale-105 focus:scale-105 active:scale-95 bg-powder-200 dark:bg-aubergine-950 text-black dark:text-powder-50 border border-transparent hover:border-yellow-300 focus:border-yellow-300 active:border-yellow-400 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 focus:outline-none"
                aria-label={$translations?.versions?.backToTop || 'Back to top'}
                title={$translations?.versions?.backToTop || 'Back to top'}
            >
                <span class="text-xl">↑</span>
                <span>{$translations?.versions?.backToTop || 'Back to top'}</span>
            </button>
        </div>
    </div>

    <!-- Footer Information Component -->
    <FooterInfo slot="footer" />
</PageLayout>
{/if}
{#if !$translations?.versions}
    <!-- Fallback: Show loading state if translations not ready -->
    <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
            <div class="w-12 h-12 border-4 border-yellow-200 dark:border-yellow-900 border-t-yellow-500 dark:border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading version history...</p>
        </div>
    </div>
{/if}

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

    .critical-item {
        background: rgba(217, 119, 6, 0.08);
        border-radius: 4px;
        padding: 4px 6px;
        margin: 2px 0;
        border-left: 2px solid #d97706;
        transition: all 0.2s ease;
    }

    .critical-item > span {
        color: #000000 !important;
    }

    :global(.dark) .critical-item > span {
        color: #ffffff !important;
    }

    .critical-item:hover {
        background: rgba(217, 119, 6, 0.12);
        transform: translateX(2px);
        border-left: 2px solid #f59e0b;
        cursor: pointer;
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