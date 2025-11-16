<!--
404 not found page component displaying error message and navigation options.
Handles recent emojis display, emoji masking, and page navigation.
Manages emoji slider and auto-scroll functionality.
-->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { translations } from '../stores/contentStore';
    import { get } from 'svelte/store';
    import PageLayoutComponent from '../components/Layout/PageLayout.svelte';
    import { STORAGE_KEYS, storageHelpers } from '../config/storage';
    import { navigateToRoute, navigateToHome } from '../utils/navigation';
    import FeatureCardComponent from '../components/Features/FeatureCard.svelte';
    import { isDebugMode } from '../utils/environment';

    function debugNotFound() {
        if (!isDebugMode()) return;
        console.group('🔍 NotFound Debug');
        console.log('State:', {
            recentEmojisCount: recentEmojis.length,
            isDragging,
            currentIndex
        });
        console.groupEnd();
    }
    
    // Svelte 5 / Webpack: stabile Komponenten-Referenzen
    const PageLayout = PageLayoutComponent;
    const FeatureCard = FeatureCardComponent;

    // Reaktive PageLayout Props (Svelte 5 Runes)
    // PERFORMANCE: $derived() statt $derived.by() für einfache Store-Zugriffe
    let pageTitle = $derived(() => get(translations)?.notFound?.pageTitle || '404 - Page Not Found');
    let pageDescription = $derived(() => get(translations)?.notFound?.pageDescription || 'The page you are looking for does not exist.');
    
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
    let recentEmojis = $state<string[]>([]);
    let emojiSliderContainer: HTMLElement | undefined = $state();
    let isDragging = $state(false);
    let startX = $state(0);
    let scrollLeft = $state(0);
    let momentum = $state(0);
    let lastX = $state(0);
    let animationId = $state<number | null>(null);
    let autoSlideInterval = $state<number | null>(null);
    let currentIndex = $state(0);
    
    // Helper: Mask emojis (keep only first emoji, mask rest with *******)
    function maskEmojis(emojiString) {
        if (!emojiString || typeof emojiString !== 'string') return emojiString;
        
        // Remove spaces for processing
        const cleanString = emojiString.replace(/\s/g, '');
        
        // Extract individual emojis using regex to handle multi-byte characters
        const emojis = cleanString.match(/[\p{Emoji}\u200d]+/gu) || [];
        
        // If no emojis or only one, return as-is
        if (emojis.length <= 1) {
            return cleanString;
        }
        
        // Only keep first emoji, mask rest with *******
        const first = emojis[0];
        return `${first}*******`;
    }
    
    function loadRecentEmojis() {
        const stored = storageHelpers.get(STORAGE_KEYS.RECENT_EMOJIS, []);
        if (!Array.isArray(stored) || stored.length === 0) {
            recentEmojis = [];
            return;
        }
        const masked = stored.map(emoji => maskEmojis(emoji)).filter(Boolean);
        const needsMigration = masked.some((emoji, i) => emoji !== stored[i]);
        if (needsMigration) {
            storageHelpers.set(STORAGE_KEYS.RECENT_EMOJIS, masked);
        }
        recentEmojis = masked.slice(0, 10);
    }
    
    function navigateToPage(path) {
        navigateToRoute(path, true);
    }
    
    // Smooth slider handling
    function handleMouseDown(e) {
        if (!emojiSliderContainer) return;
        isDragging = true;
        startX = e.pageX - emojiSliderContainer.offsetLeft;
        scrollLeft = emojiSliderContainer.scrollLeft;
        lastX = e.pageX;
        emojiSliderContainer.style.cursor = 'grabbing';
        emojiSliderContainer.style.userSelect = 'none';
        
        // Stop auto-sliding when user interacts
        stopAutoSlide();
        
        // Stop any ongoing momentum animation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    function handleMouseMove(e) {
        if (!isDragging || !emojiSliderContainer) return;
        e.preventDefault();
        const x = e.pageX - emojiSliderContainer.offsetLeft;
        const walk = (x - startX) * 0.8; // Softer movement
        emojiSliderContainer.scrollLeft = scrollLeft - walk;
        
        // Calculate momentum
        momentum = (e.pageX - lastX) * 0.6; // Softer momentum
        lastX = e.pageX;
    }
    
    function handleMouseUp() {
        if (!emojiSliderContainer) return;
        isDragging = false;
        emojiSliderContainer.style.cursor = 'grab';
        emojiSliderContainer.style.userSelect = 'auto';
        
        // Apply softer momentum scrolling
        if (Math.abs(momentum) > 1) {
            applyMomentum(momentum);
        }
        
        // Resume auto-sliding after a delay
        setTimeout(() => startAutoSlide(), 3000);
    }
    
    function applyMomentum(initialMomentum) {
        if (!emojiSliderContainer) return;
        
        let currentMomentum = initialMomentum * 0.5; // Much softer momentum
        const friction = 0.85; // More friction for softer feel
        
        function animate() {
            if (Math.abs(currentMomentum) > 0.2) {
                emojiSliderContainer.scrollLeft -= currentMomentum;
                currentMomentum *= friction;
                animationId = requestAnimationFrame(animate);
            } else {
                // Snap to nearest item when momentum ends
                snapToNearest();
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    function snapToNearest() {
        if (!emojiSliderContainer) return;
        const container = emojiSliderContainer;
        const itemWidth = container.querySelector('div')?.offsetWidth || 0;
        const gap = 8; // gap-2 = 8px
        const totalItemWidth = itemWidth + gap;
        const currentScroll = container.scrollLeft;
        
        // Calculate nearest item position
        const nearestItemIndex = Math.round(currentScroll / totalItemWidth);
        const targetScroll = nearestItemIndex * totalItemWidth;
        
        if (Math.abs(currentScroll - targetScroll) > 5) {
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    }
    
    // Auto-sliding functionality
    function startAutoSlide() {
        if (!emojiSliderContainer || recentEmojis.length <= 3) return;
        
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            if (!isDragging && emojiSliderContainer) {
                const container = emojiSliderContainer;
                const itemWidth = container.querySelector('div')?.offsetWidth || 0;
                const gap = 8; // gap-2 = 8px
                const totalItemWidth = itemWidth + gap;
                const maxScroll = container.scrollWidth - container.clientWidth;
                const currentScroll = container.scrollLeft;
                
                // Calculate next item position
                const currentItemIndex = Math.round(currentScroll / totalItemWidth);
                const nextItemIndex = currentItemIndex + 1;
                const nextScrollPosition = nextItemIndex * totalItemWidth;
                
                if (nextScrollPosition >= maxScroll) {
                    // Reset to beginning
                    container.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Move to next single item
                    container.scrollTo({
                        left: nextScrollPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }, 4000); // Slide every 4 seconds for softer feel
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    // Navigation arrows
    function slideLeft() {
        if (!emojiSliderContainer) return;
        const container = emojiSliderContainer;
        const itemWidth = container.querySelector('div')?.offsetWidth || 0;
        const gap = 8; // gap-2 = 8px
        const totalItemWidth = itemWidth + gap;
        const currentScroll = container.scrollLeft;
        
        // Calculate previous item position
        const currentItemIndex = Math.round(currentScroll / totalItemWidth);
        const prevItemIndex = Math.max(0, currentItemIndex - 1);
        const prevScrollPosition = prevItemIndex * totalItemWidth;
        
        container.scrollTo({
            left: prevScrollPosition,
            behavior: 'smooth'
        });
    }
    
    function slideRight() {
        if (!emojiSliderContainer) return;
        const container = emojiSliderContainer;
        const itemWidth = container.querySelector('div')?.offsetWidth || 0;
        const gap = 8; // gap-2 = 8px
        const totalItemWidth = itemWidth + gap;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        
        // Calculate next item position
        const currentItemIndex = Math.round(currentScroll / totalItemWidth);
        const nextItemIndex = currentItemIndex + 1;
        const nextScrollPosition = nextItemIndex * totalItemWidth;
        
        container.scrollTo({
            left: Math.min(maxScroll, nextScrollPosition),
            behavior: 'smooth'
        });
    }
    
    onMount(() => {
        debugNotFound();
        loadRecentEmojis();
        setTimeout(() => startAutoSlide(), 2000);
    });
    
    // Cleanup on component destroy
    onDestroy(() => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        stopAutoSlide();
    });
    
    function startEmojiSlider() {
        // CSS animations are now handled by CSS
        // This function is kept for potential future use
    }
    
</script>

<svelte:head>
    <title>{pageTitle} - Keymoji</title>
    <meta name="description" content={pageDescription} />
</svelte:head>

<PageLayout {pageTitle} {pageDescription} routeSlug="notFound">
    {#snippet beforeHeader()}
    <!-- Bouncing Emoji in before-header slot (like ContactForm) -->
        <div class="flex justify-center">
        <div class="text-8xl animate-bounce">😵‍💫</div>
    </div>
    {/snippet}

    {#snippet children()}
    <!-- 404 Content -->
    <div class="notfound-wrapper" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="w-full">

            <!-- Recent Emojis - Slider Style -->
            {#if recentEmojis.length > 0}
                <div class="space-y-4 w-full max-w-4xl mb-8">
                    <h3 class="text-lg font-semibold dark:text-white text-center">
                        {$translations?.notFound?.recentEmojisTitle || 'Recent Keymojis'}
                    </h3>
                    
                    <!-- Slider Container with Gradient Overlays -->
                    <div class="relative w-full overflow-hidden rounded-xl">
                        <!-- Left Gradient Overlay -->
                        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-aubergine-900 via-white/80 dark:via-aubergine-900/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ease-in-out"></div>
                        
                        <!-- Right Gradient Overlay -->
                        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-aubergine-900 via-white/80 dark:via-aubergine-900/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ease-in-out"></div>
                        
                        <!-- Left Arrow -->
                        <button
                            class="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-white dark:bg-aubergine-900 rounded-full shadow-lg flex items-center justify-center hover:scale-105 focus:scale-105 active:scale-95 transition-all duration-200 ease-out cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-xl focus:shadow-xl focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                            onclick={slideLeft}
                            aria-label={$translations?.notFound?.prevEmoji || 'Previous emoji'}
                            title={$translations?.notFound?.prevEmoji || 'Previous emoji'}
                        >
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        
                        <!-- Right Arrow -->
                        <button
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-white dark:bg-aubergine-900 rounded-full shadow-lg flex items-center justify-center hover:scale-105 focus:scale-105 active:scale-95 transition-all duration-200 ease-out cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-xl focus:shadow-xl focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                            onclick={slideRight}
                            aria-label={$translations?.notFound?.nextEmoji || 'Next emoji'}
                            title={$translations?.notFound?.nextEmoji || 'Next emoji'}
                        >
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                        
                        <!-- Slider Content -->
                        <div 
                            bind:this={emojiSliderContainer}
                            class="flex overflow-x-auto scroll-smooth snap-x snap-proximity overscroll-x-contain gap-2 py-4 px-10 emoji-slider cursor-grab select-none border border-gray-200 dark:border-gray-700 rounded-xl [&>div]:snap-center [&>div]:transition-transform [&>div]:duration-300 [&>div]:ease-out"
                            style="scrollbar-width: none; -ms-overflow-style: none;"
                            role="button"
                            aria-label="Emoji slider - drag to scroll"
                            tabindex="0"
                            onmousedown={handleMouseDown}
                            onmousemove={handleMouseMove}
                            onmouseup={handleMouseUp}
                            onmouseleave={handleMouseUp}
                            ontouchstart={(e) => {
                                e.preventDefault();
                                handleMouseDown(e.touches[0]);
                            }}
                            ontouchmove={(e) => {
                                e.preventDefault();
                                handleMouseMove(e.touches[0]);
                            }}
                            ontouchend={(e) => {
                                e.preventDefault();
                                handleMouseUp();
                            }}
                        >
                            {#each recentEmojis as emoji, index}
                                <div 
                                    class="flex-shrink-0 text-2xl p-3 bg-white dark:bg-aubergine-900 rounded-lg shadow-lg hover:scale-105 focus:scale-105 transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-xl flex items-center justify-center"
                                    in:fly={{ x: 50, duration: 300, delay: index * 50 }}
                                    role="button"
                                    tabindex="0"
                                    aria-label="Recent emoji: {emoji}"
                                    title={emoji}
                                >
                                    {emoji}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Quick Navigation - FeatureCard Style -->
            <div class="space-y-4 mb-8 w-full max-w-4xl">
                <h3 class="text-lg font-semibold dark:text-white text-center">
                    {$translations?.notFound?.quickNavTitle || 'Quick Navigation'}
                </h3>
                <div class="flex flex-wrap justify-center">
                    {#each siteNavigation as nav}
                        <FeatureCard
                            icon={nav.icon}
                            title={$translations?.[nav.titleKey.split('.')[0]]?.[nav.titleKey.split('.')[1]] || nav.titleKey}
                            description={$translations?.[nav.descKey.split('.')[0]]?.[nav.descKey.split('.')[1]] || nav.descKey}
                            variant="default"
                            onClick={() => navigateToPage(nav.path)}
                        />
                    {/each}
                </div>
            </div>

            <!-- Back to Home Button -->
            <div class="text-center mt-8">
                <button
                    class="w-full bg-yellow-500 text-black shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                    onclick={navigateToHome}
                    aria-label={$translations?.notFound?.backToHome || 'Back to Home'}
                    title={$translations?.notFound?.backToHome || 'Back to Home'}
                >
                    🏠 {$translations?.notFound?.backToHome || 'Back to Home'}
                </button>
            </div>
        </section> 
    </div>
    {/snippet}

    <!-- Footer Information Component -->
</PageLayout>

<style>
    /* Hide scrollbar for emoji slider (Webkit only - Firefox/Edge use inline style) */
    :global(.emoji-slider::-webkit-scrollbar) {
        display: none;
    }
    
    /* iOS smooth scrolling */
    :global(.emoji-slider) {
        -webkit-overflow-scrolling: touch;
    }
    
    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
        :global(.emoji-slider) {
            scroll-behavior: auto;
        }
        :global(.emoji-slider > div) {
            transition: none !important;
        }
    }
</style>