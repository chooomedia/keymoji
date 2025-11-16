<!-- src/routes/NotFound.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { translations } from '../stores/contentStore.js';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';
    import { navigateToRoute, navigateToHome } from '../utils/navigation';
    import FooterInfo from '../widgets/FooterInfo.svelte';
    import FeatureCard from '../components/Features/FeatureCard.svelte';
    
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
    let emojiSliderContainer;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let momentum = 0;
    let lastX = 0;
    let animationId = null;
    let autoSlideInterval = null;
    let currentIndex = 0;
    
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
        console.log('📋 404 loadRecentEmojis:', { count: stored.length, sample: stored.slice(0, 2) });
        if (!Array.isArray(stored) || stored.length === 0) {
            recentEmojis = [];
            return;
        }
        
        // CRITICAL: ALWAYS mask emojis (force migration)
        const masked = stored.map(emoji => maskEmojis(emoji)).filter(Boolean);
        console.log('🎭 Masked emojis:', { sample: masked.slice(0, 2) });
        
        // Check if migration was needed
        const needsMigration = masked.some((emoji, i) => emoji !== stored[i]);
        console.log('🔄 Migration needed:', needsMigration);
        
        if (needsMigration) {
            console.log('✅ Migrating unmasked emojis on 404 page');
            storageHelpers.set(STORAGE_KEYS.RECENT_EMOJIS, masked);
        }
        
        // Limit to 10
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
        // Load recent emojis
        loadRecentEmojis();
        
        // Start auto-sliding after a delay
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

<PageLayout {pageTitle} {pageDescription}>
    <!-- Bouncing Emoji in before-header slot (like ContactForm) -->
    <div slot="before-header" class="flex justify-center">
        <div class="text-8xl animate-bounce">😵‍💫</div>
    </div>

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
                        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-aubergine-900 via-white/80 dark:via-aubergine-900/80 to-transparent z-10 pointer-events-none gradient-overlay"></div>
                        
                        <!-- Right Gradient Overlay -->
                        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-aubergine-900 via-white/80 dark:via-aubergine-900/80 to-transparent z-10 pointer-events-none gradient-overlay"></div>
                        
                        <!-- Left Arrow -->
                        <button
                            class="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-white dark:bg-aubergine-900 rounded-full shadow-lg flex items-center justify-center hover:scale-105 focus:scale-105 active:scale-95 transition-all cursor-pointer border border-gray-200 dark:border-gray-700 arrow-button focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                            on:click={slideLeft}
                            aria-label={$translations?.notFound?.prevEmoji || 'Previous emoji'}
                            title={$translations?.notFound?.prevEmoji || 'Previous emoji'}
                        >
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        
                        <!-- Right Arrow -->
                        <button
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-white dark:bg-aubergine-900 rounded-full shadow-lg flex items-center justify-center hover:scale-105 focus:scale-105 active:scale-95 transition-all cursor-pointer border border-gray-200 dark:border-gray-700 arrow-button focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                            on:click={slideRight}
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
                            class="flex overflow-x-auto scroll-smooth gap-2 py-4 px-10 emoji-slider cursor-grab select-none border border-gray-200 dark:border-gray-700 rounded-xl"
                            style="scrollbar-width: none; -ms-overflow-style: none;"
                            on:mousedown={handleMouseDown}
                            on:mousemove={handleMouseMove}
                            on:mouseup={handleMouseUp}
                            on:mouseleave={handleMouseUp}
                            on:touchstart={(e) => {
                                e.preventDefault();
                                handleMouseDown(e.touches[0]);
                            }}
                            on:touchmove={(e) => {
                                e.preventDefault();
                                handleMouseMove(e.touches[0]);
                            }}
                            on:touchend={(e) => {
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
                    on:click={navigateToHome}
                    aria-label={$translations?.notFound?.backToHome || 'Back to Home'}
                    title={$translations?.notFound?.backToHome || 'Back to Home'}
                >
                    🏠 {$translations?.notFound?.backToHome || 'Back to Home'}
                </button>
            </div>
        </section> 
    </div>

    <!-- Footer Information Component -->
    <FooterInfo slot="footer" />
</PageLayout>

<style>
    /* Hide scrollbar for emoji slider */
    :global(.emoji-slider::-webkit-scrollbar) {
        display: none;
    }
    
    /* Smooth scrolling for emoji slider */
    .emoji-slider {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x proximity;
        overscroll-behavior-x: contain;
    }
    
    /* Individual emoji items */
    .emoji-slider > div {
        scroll-snap-align: center;
        transition: transform 0.3s ease-out;
    }
    
    /* Gradient overlay animations */
    .gradient-overlay {
        transition: opacity 0.3s ease-in-out;
    }
    
    /* Slider container hover effects */
    .emoji-slider:hover {
        cursor: grab;
    }
    
    .emoji-slider:active {
        cursor: grabbing;
    }
    
    /* Prevent text selection during drag */
    .emoji-slider {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    /* Arrow button styles */
    .arrow-button {
        transition: all 0.2s ease-out;
    }
    
    .arrow-button:hover {
        transform: translateY(-50%) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .arrow-button:focus {
        transform: translateY(-50%) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .arrow-button:active {
        transform: translateY(-50%) scale(0.95);
    }
    
    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
        .emoji-slider {
            scroll-behavior: auto;
        }
        .emoji-slider > div {
            transition: none;
        }
        .arrow-button {
            transition: none;
        }
    }
</style>