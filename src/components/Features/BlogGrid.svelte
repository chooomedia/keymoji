<script>
    import { onMount, onDestroy } from 'svelte';
    import { Link, navigate } from 'svelte-routing';
    import { 
        fetchBlogPosts, 
        likeBlogPost, 
        formatContentPreview
    } from '../../utils/blogApi.js';
    import { getBlogUrl, getBlogShareUrl } from '../../utils/blogNavigation.js';
    import { currentLanguage, translations } from '../../stores/contentStore.js';
    import { isLoggedIn } from '../../stores/appStores.js';
    import { get } from 'svelte/store';
    import PageLayout from '../Layout/PageLayout.svelte';
    import { updateSeo } from '../../stores/seoStore.js';
    import BlogPostImage from './BlogPostImage.svelte';
    import BlogPostMeta from './BlogPostMeta.svelte';
    import HeartAnimation from './HeartAnimation.svelte';
    import Pagination from '../UI/Pagination.svelte';
    import BlogPostSkeleton from './BlogPostSkeleton.svelte';
    import ShareButtons from './ShareButtons.svelte';
    import { generateBlogListStructuredData, formatCanonicalUrl, injectStructuredData } from '../../utils/seo.js';
    
    let posts = [];
    let showHeartAnimation = false;
    let loading = true;
    let error = null;
    let selectedCategory = 'all';
    let currentPage = 1;
    let isLoadingMore = false;
    let isTransitioning = false;
    let isDropdownOpen = false;
    let dropdownRef = null;
    let buttonRef = null;
    let likingPostId = null; // Track which post is being liked
    
    $: categoriesWithCounts = (() => {
        const categoryMap = new Map();
        categoryMap.set('all', posts.length);
        
        posts.forEach(post => {
            if (post.category) {
                const current = categoryMap.get(post.category) || 0;
                categoryMap.set(post.category, current + 1);
            }
        });
        
        return Array.from(categoryMap.entries()).map(([category, count]) => ({
            category,
            count
        })).sort((a, b) => {
            if (a.category === 'all') return -1;
            if (b.category === 'all') return 1;
            return b.count - a.count;
        });
    })();
    
    $: categories = categoriesWithCounts.map(c => c.category);
    
    $: filteredPosts = (() => {
        let filtered = posts;
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        filtered = [...filtered].sort((a, b) => {
            const dateA = new Date(a.isodate || a.date || 0);
            const dateB = new Date(b.isodate || b.date || 0);
            return dateB - dateA;
        });
        
        return filtered;
    })();
    
    // 1 Newest Post + 3 weitere Posts = 4 Posts pro Seite
    const POSTS_PER_PAGE = 4;
    const INITIAL_POSTS = 1; // 1 Newest Post immer prominent
    
    $: totalPages = (() => {
        if (filteredPosts.length === 0) return 0;
        return Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    })();
    
    $: displayedPosts = (() => {
        if (filteredPosts.length === 0) return [];
        
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        return filteredPosts.slice(startIndex, endIndex);
    })();
    
    // Trenne newest Post von anderen Posts für besseres Layout
    $: newestPosts = currentPage === 1 ? displayedPosts.slice(0, INITIAL_POSTS) : [];
    $: otherPosts = currentPage === 1 ? displayedPosts.slice(INITIAL_POSTS) : displayedPosts;
    
    function truncateAuthor(author) {
        if (!author) return 'Unknown';
        const text = String(author);
        return text.length > 24 ? text.substring(0, 21) + '...' : text;
    }
    
    async function handleLike(postId) {
        if (!get(isLoggedIn)) {
            const lang = $currentLanguage || 'en';
            const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
            navigate(accountPath, { replace: false });
            return;
        }
        
        if (!postId || likingPostId === postId) return;
        
        const postIndex = posts.findIndex(p => (p.id === postId || p.row_number === postId));
        if (postIndex === -1) return;
        
        const originalPost = posts[postIndex];
        const originalLikes = originalPost.likes || 0;
        const originalLiked = originalPost.liked || false;
        const isUnlike = originalLiked;
        
        // Set loading state
        likingPostId = postId;
        
        // Optimistic update
        posts[postIndex] = {
            ...originalPost,
            likes: isUnlike ? Math.max(0, originalLikes - 1) : originalLikes + 1,
            liked: !isUnlike
        };
        posts = posts;
        
        const result = await likeBlogPost(postId, { optimistic: true, unlike: isUnlike });
        
        // Clear loading state
        likingPostId = null;
        
        if (result && result.success) {
            // CRITICAL: Backend-Wert (result.likes) hat IMMER höchste Priorität
            const backendLikes = result.likes !== undefined && result.likes !== null 
                ? parseInt(result.likes, 10) 
                : null;
            
            // Verwende Backend-Wert wenn vorhanden, sonst optimistischen Wert
            const finalLikes = backendLikes !== null && !isNaN(backendLikes) && backendLikes >= 0
                ? backendLikes
                : (isUnlike ? Math.max(0, originalLikes - 1) : originalLikes + 1);
            
            posts[postIndex] = {
                ...posts[postIndex],
                likes: finalLikes,
                liked: !isUnlike
            };
            posts = posts; // Trigger reactivity
            
            // Animation nur bei Like (nicht bei Unlike)
            if (!isUnlike) {
                showHeartAnimation = true;
                setTimeout(() => {
                    showHeartAnimation = false;
                }, 1200);
            }
            
            // Refresh likes from backend after successful like
            if (result.likes === undefined || result.likes === null) {
                await refreshLikesFromBackend();
            }
        } else {
            posts[postIndex] = {
                ...originalPost,
                likes: originalLikes,
                liked: originalLiked
            };
        }
        
        posts = posts;
    }
    
    async function refreshLikesFromBackend() {
        try {
            const allPosts = await fetchBlogPosts({ useCache: false, forceRefresh: true });
            
            posts = posts.map(post => {
                const updatedPost = allPosts.find(p => 
                    (p.id === post.id || p.row_number === post.row_number) ||
                    (p.slug === post.slug)
                );
                
                if (updatedPost && updatedPost.likes !== undefined) {
                    return { ...post, likes: updatedPost.likes };
                }
                return post;
            });
            
            posts = posts;
        } catch (error) {
            console.warn('⚠️ [BlogGrid] Error refreshing likes:', error);
        }
    }
    
    function goToPage(page) {
        if (page < 1 || page > totalPages || page === currentPage || isLoading || isTransitioning) return;
        
        isTransitioning = true;
        isLoadingMore = true;
        currentPage = page;
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset transition state after animation
        setTimeout(() => {
            isLoadingMore = false;
            isTransitioning = false;
        }, 400);
    }
    
    function handlePageChange(page) {
        goToPage(page);
    }
    
    function previousPage() {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    }
    
    function nextPage() {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    }
    
    function handleClickOutside(event) {
        if (isDropdownOpen && 
            !event.target.closest('#category-dropdown-menu') && 
            !event.target.closest('#category-toggle-button') &&
            !event.target.closest('#language-dropdown-menu') &&
            !event.target.closest('#language-toggle-button') &&
            !event.target.closest('#fixed-menu') &&
            !event.target.closest('[data-menu-type="donate"]')) {
            isDropdownOpen = false;
        }
    }
    
    function handleKeydown(event) {
        if (!isDropdownOpen) return;
        
        switch (event.key) {
            case 'Escape':
                isDropdownOpen = false;
                buttonRef?.focus();
                break;
            case 'ArrowDown':
                event.preventDefault();
                const firstMenuItem = dropdownRef?.querySelector('[role="menuitem"]');
                firstMenuItem?.focus();
                break;
        }
    }
    
    $: if (selectedCategory) {
        currentPage = 1;
        isDropdownOpen = false;
        setTimeout(() => {
        }, 100);
    }
    
    onMount(async () => {
        try {
            loading = true;
            error = null;
            
            const fetchedPosts = await fetchBlogPosts({ useCache: true });
            
            if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
                // Debug: Log nur Posts mit fehlenden/ungültigen Likes
                const postsWithIssues = fetchedPosts.filter(p => 
                    p.likes === undefined || 
                    p.likes === null || 
                    isNaN(parseInt(p.likes, 10))
                );
                if (postsWithIssues.length > 0) {
                    console.warn('⚠️ [BlogGrid] Posts with missing/invalid likes:', postsWithIssues.map(p => ({ 
                        id: p.id || p.row_number, 
                        title: p.title?.substring(0, 30), 
                        likes: p.likes
                    })));
                }
                
                posts = fetchedPosts;
            } else {
                // Demo-Daten für Entwicklung
                posts = [
                    {
                        id: 1,
                        row_number: 1,
                        title: 'Willkommen zu Keymoji - Sichere Passwörter mit Emojis',
                        slug: 'willkommen-zu-keymoji',
                        content: '<p>Keymoji revolutioniert die Passwort-Sicherheit durch die Verwendung von Emojis. Erfahren Sie, wie Sie starke, einprägsame Passwörter erstellen können, die sowohl sicher als auch benutzerfreundlich sind.</p><p>Unsere innovative Technologie kombiniert die Stärke von alphanumerischen Zeichen mit der visuellen Einprägsamkeit von Emojis, um Passwörter zu erstellen, die schwer zu knacken, aber einfach zu merken sind.</p>',
                        excerpt: 'Erfahren Sie, wie Keymoji die Passwort-Sicherheit durch Emojis revolutioniert.',
                        image: '/images/blog/keymoji-intro.jpg',
                        thumbnail: '/images/blog/keymoji-intro-thumb.jpg',
                        isodate: '2025-11-10T10:00:00Z',
                        date: '2025-11-10',
                        creator: 'Keymoji Team',
                        category: 'Security',
                        likes: 5,
                        liked: false
                    },
                    {
                        id: 2,
                        row_number: 2,
                        title: 'Die Wissenschaft hinter Emoji-Passwörtern',
                        slug: 'wissenschaft-emoji-passwoerter',
                        content: '<p>Emoji-Passwörter nutzen die kognitive Psychologie, um sowohl Sicherheit als auch Benutzerfreundlichkeit zu gewährleisten. Studien zeigen, dass visuelle Elemente wie Emojis besser im Gedächtnis bleiben als reine Textzeichen.</p><p>Durch die Kombination von Unicode-Zeichen mit traditionellen Passwort-Elementen schaffen wir eine neue Generation von Passwörtern, die sowohl sicher als auch benutzerfreundlich sind.</p>',
                        excerpt: 'Entdecken Sie die wissenschaftlichen Grundlagen von Emoji-Passwörtern und wie sie die Sicherheit verbessern.',
                        image: '/images/blog/emoji-science.jpg',
                        thumbnail: '/images/blog/emoji-science-thumb.jpg',
                        isodate: '2025-11-08T14:30:00Z',
                        date: '2025-11-08',
                        creator: 'Dr. Security Expert',
                        category: 'Technology',
                        likes: 12,
                        liked: false
                    },
                    {
                        id: 3,
                        row_number: 3,
                        title: 'Best Practices für sichere Passwörter im Jahr 2025',
                        slug: 'best-practices-sichere-passwoerter-2025',
                        content: '<p>In einer Zeit zunehmender Cyber-Bedrohungen ist es wichtiger denn je, starke Passwörter zu verwenden. Dieser Artikel zeigt Ihnen die besten Praktiken für die Erstellung und Verwaltung sicherer Passwörter.</p><p>Wir behandeln Themen wie Passwort-Länge, Komplexität, Einzigartigkeit und die Verwendung von Passwort-Managern. Erfahren Sie, wie Sie Ihre Online-Sicherheit maximieren können.</p>',
                        excerpt: 'Lernen Sie die wichtigsten Best Practices für sichere Passwörter im Jahr 2025 kennen.',
                        image: '/images/blog/password-best-practices.jpg',
                        thumbnail: '/images/blog/password-best-practices-thumb.jpg',
                        isodate: '2025-11-05T09:15:00Z',
                        date: '2025-11-05',
                        creator: 'Security Team',
                        category: 'Security',
                        likes: 8,
                        liked: false
                    }
                ];
                
                if (!Array.isArray(fetchedPosts)) {
                    error = `Failed to load blog posts. (Invalid response: ${typeof fetchedPosts})`;
                }
            }
            
            const canonicalUrl = formatCanonicalUrl(window.location.pathname);
            updateSeo({
                title: $translations?.blog?.title || 'Blog',
                description: $translations?.blog?.description || 'Read our latest blog posts about emoji passwords, security, and more.',
                url: window.location.pathname,
                pageType: 'blog',
                canonical: canonicalUrl
            });
            
            const structuredData = generateBlogListStructuredData(posts, $currentLanguage, canonicalUrl);
            injectStructuredData(structuredData);
            
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleKeydown);
        } catch (err) {
            console.error('❌ [BlogGrid] Error loading posts:', err);
            error = err.message || 'Failed to load blog posts';
            posts = [];
        } finally {
            loading = false;
        }
    });
    
    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeydown);
    });
    
    $: pageTitle = $translations?.blog?.title || 'Blog';
    $: pageDescription = $translations?.blog?.description || 'Read our latest blog posts about emoji passwords, security, and more.';
</script>

<PageLayout {pageTitle} {pageDescription}>
{#if loading}
    <BlogPostSkeleton count={6} />
    {:else if error}
        <div class="flex flex-col justify-center items-center py-12">
            <p class="text-red-500 dark:text-red-400 mb-4">❌ {error}</p>
            <button 
                on:click={() => window.location.reload()} 
                class="px-4 py-2 bg-yellow text-black rounded-full hover:scale-105 transition-transform">
                Retry
            </button>
        </div>
    {:else if posts.length === 0}
        <div class="flex justify-center items-center py-12">
            <p class="text-gray-500 dark:text-gray-400">No blog posts available yet.</p>
        </div>
{:else}
        {#if totalPages > 1}
            <Pagination 
                {currentPage}
                {totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoadingMore || isTransitioning}
            />
        {/if}
        
        <!-- Fixed Navigation Buttons (Left/Right) -->
        {#if totalPages > 1}
            <!-- Fixed Previous Button (Left) -->
            <button
                on:click={previousPage}
                disabled={currentPage === 1 || isLoadingMore || isTransitioning}
                class="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-creme-500 dark:bg-aubergine-800 border-4 border-powder-300 dark:border-aubergine-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-creme-400 dark:hover:bg-aubergine-700 shadow-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95"
                aria-label="Previous page"
                title="Previous page"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <!-- Fixed Next Button (Right) -->
            <button
                on:click={nextPage}
                disabled={currentPage === totalPages || isLoadingMore || isTransitioning}
                class="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-creme-500 dark:bg-aubergine-800 border-4 border-powder-300 dark:border-aubergine-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-creme-400 dark:hover:bg-aubergine-700 shadow-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95"
                aria-label="Next page"
                title="Next page"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        {/if}

        <div class="w-full mb-6 flex justify-center">
            <div class="relative inline-block w-full max-w-md">
                <button
                    id="category-toggle-button"
                    bind:this={buttonRef}
                    on:click={() => {
                        if (!isDropdownOpen) {
                            const languageMenu = document.querySelector('#language-dropdown-menu');
                            if (languageMenu) {
                                const languageButton = document.querySelector('#language-toggle-button');
                                if (languageButton && languageButton.getAttribute('aria-expanded') === 'true') {
                                    languageButton.click();
                                }
                            }
                        }
                        isDropdownOpen = !isDropdownOpen;
                    }}
                    class="w-full inline-flex items-center justify-between gap-3 px-6 py-3 h-14 bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 rounded-full font-medium transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100"
                    aria-label="Filter by category"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-controls="category-dropdown-menu"
                >
                    <span class="truncate">
                        {selectedCategory === 'all' 
                            ? `All (${categoriesWithCounts.find(c => c.category === 'all')?.count || 0})`
                            : `${selectedCategory} (${categoriesWithCounts.find(c => c.category === selectedCategory)?.count || 0})`}
                    </span>
                    <svg 
                        class="w-4 h-4 flex-shrink-0 transition-transform duration-200 {isDropdownOpen ? 'transform rotate-180' : ''}" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                {#if isDropdownOpen}
                    <div
                        id="category-dropdown-menu"
                        bind:this={dropdownRef}
                        class="absolute z-50 mt-2 w-full bg-white dark:bg-aubergine-900 rounded-xl shadow-xl overflow-hidden"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="category-toggle-button"
                        aria-label="Category selection menu"
                    >
                        <div class="max-h-96 overflow-y-auto custom-scrollbar">
                            {#each categoriesWithCounts as item}
                                <button
                                    on:click={() => {
                                        selectedCategory = item.category;
                                        isDropdownOpen = false;
                                    }}
                                    on:keydown={(e) => {
                                        switch (e.key) {
                                            case 'Enter':
                                            case ' ':
                                                e.preventDefault();
                                                selectedCategory = item.category;
                                                isDropdownOpen = false;
                                                break;
                                            case 'ArrowDown':
                                                e.preventDefault();
                                                const nextItem = e.target.parentElement?.nextElementSibling?.querySelector('[role="menuitem"]');
                                                nextItem?.focus();
                                                break;
                                            case 'ArrowUp':
                                                e.preventDefault();
                                                const prevItem = e.target.parentElement?.previousElementSibling?.querySelector('[role="menuitem"]');
                                                prevItem?.focus();
                                                break;
                                        }
                                    }}
                                    class="w-full text-left px-6 py-3 text-sm font-medium transition-colors
                                        {selectedCategory === item.category
                                            ? 'bg-yellow-500 text-black dark:bg-yellow-500 dark:text-black'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-aubergine-800'}"
                                    role="menuitem"
                                    tabindex="-1"
                                    aria-label="Filter by {item.category === 'all' ? 'all categories' : item.category}"
                                >
                                    <div class="flex items-center justify-between gap-3">
                                        <span class="truncate">{item.category === 'all' ? 'All' : item.category}</span>
                                        <span class="text-xs opacity-75 flex-shrink-0">({item.count})</span>
                                    </div>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>


        <!-- Posts Container mit Transition -->
        <div class="w-full max-w-7xl mx-auto space-y-8 relative">
            {#if isTransitioning}
                <!-- Skeleton während Transition -->
                <BlogPostSkeleton count={4} />
            {:else}
                <!-- Newest Post (prominent, nur auf Seite 1) -->
                {#if newestPosts.length > 0}
                    <div class="w-full space-y-8 mb-8">
                {#each newestPosts as post, index (post.row_number)}
                    {@const shareUrl = post.slug ? getBlogShareUrl(post.slug) : (post.link || (typeof window !== 'undefined' ? window.location.href : ''))}
                    {@const shareText = `${post.title} - ${shareUrl}`}
                    {@const isNewest = true}
                    
                    <article 
                        itemscope 
                        itemtype="https://schema.org/BlogPosting"
                        class="bg-white dark:bg-aubergine-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl group
                        w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto"
                    >
                    {#if post.slug}
                        <Link to={getBlogUrl(post.slug)} class="block">
                            <BlogPostImage
                                image={post.image}
                                thumbnail={post.thumbnail}
                                title={post.title}
                                category={post.category}
                                isFeatured={isNewest}
                                size="featured"
                                showCategory={true}
                                showFeaturedBadge={isNewest}
                            />
                            
                            <div class="p-4 md:p-4 lg:p-6">
                                <!-- Meta Information -->
                                <BlogPostMeta
                                    isodate={post.isodate}
                                    date={post.date}
                                    creator={post.creator}
                                    category={post.category}
                                    readingTime={post.readingTime}
                                    content={post.content}
                                    showCreator={true}
                                    showCategory={false}
                                    variant="grid"
                                    truncateAuthor={truncateAuthor}
                                />
                                
                                <h2 
                                    itemprop="headline"
                                    class="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                    {post.title}
                                </h2>
                                
                                <p 
                                    itemprop="description"
                                    class="text-gray-600 dark:text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed">
                                    {formatContentPreview(post.content)}
                                </p>
                            </div>
                        </Link>
                    {:else}
                        <a href={post.link || '#'} target="_blank" rel="noopener noreferrer" class="block">
                            <BlogPostImage
                                image={post.image}
                                thumbnail={post.thumbnail}
                                title={post.title}
                                category={post.category}
                                isFeatured={isFeatured}
                                size={isFeatured ? 'featured' : 'regular'}
                                showCategory={true}
                                showFeaturedBadge={false}
                            />
                            
                            <div class="p-6">
                                <!-- Meta Information -->
                                <BlogPostMeta
                                    isodate={post.isodate}
                                    date={post.date}
                                    creator={post.creator}
                                    category={post.category}
                                    readingTime={post.readingTime}
                                    content={post.content}
                                    showCreator={true}
                                    showCategory={false}
                                    variant="grid"
                                    truncateAuthor={truncateAuthor}
                                />
                                
                                <h2 class="{isFeatured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                    {post.title}
                                </h2>
                                
                                <p class="text-gray-600 dark:text-gray-300 {isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base'} leading-relaxed">
                                    {formatContentPreview(post.content)}
                                </p>
                            </div>
                        </a>
                    {/if}
                    
                    <!-- Like and Share Buttons as Chips -->
                    <div class="px-6 md:px-8 lg:px-10 pb-6 md:pb-8 lg:pb-10 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                        <button 
                            aria-label={post.liked ? 'Unlike the blog post' : 'Like the blog post'}
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            on:click|stopPropagation={() => handleLike(post.id || post.row_number)}
                            title={post.liked ? 'Unlike' : 'Like'}
                            disabled={likingPostId === (post.id || post.row_number)}
                        >
                            <span class="text-base">{post.liked ? '❤️' : '🤍'}</span>
                            {#if likingPostId === (post.id || post.row_number)}
                                <svg class="animate-spin h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            {:else}
                                <span class="text-gray-700 dark:text-gray-300">{post.likes || 0}</span>
                            {/if}
                        </button>
                
                        <ShareButtons 
                            {shareUrl}
                            {shareText}
                            title={post.title}
                        />
            </div>
        </article>
    {/each}
                    </div>
                {/if}
                
                <!-- Other Posts -->
                {#if otherPosts.length > 0}
                    <div class="w-full space-y-8">
                        {#each otherPosts as post, index (post.row_number)}
                            {@const shareUrl = post.slug ? getBlogShareUrl(post.slug) : (post.link || (typeof window !== 'undefined' ? window.location.href : ''))}
                            {@const shareText = `${post.title} - ${shareUrl}`}
                            
                            <article 
                                itemscope 
                                itemtype="https://schema.org/BlogPosting"
                                class="bg-white dark:bg-aubergine-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl group"
                            >
                                {#if post.slug}
                                    <Link to={getBlogUrl(post.slug)} class="block">
                                        <BlogPostImage
                                            image={post.image}
                                            thumbnail={post.thumbnail}
                                            title={post.title}
                                            category={post.category}
                                            isFeatured={false}
                                            size="regular"
                                            showCategory={true}
                                            showFeaturedBadge={false}
                                        />
                                        
                                        <div class="p-6">
                                            <BlogPostMeta
                                                isodate={post.isodate}
                                                date={post.date}
                                                creator={post.creator}
                                                category={post.category}
                                                readingTime={post.readingTime}
                                                content={post.content}
                                                showCreator={true}
                                                showCategory={false}
                                                variant="grid"
                                                truncateAuthor={truncateAuthor}
                                            />
                                            
                                            <h2 
                                                itemprop="headline"
                                                class="text-xl md:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                                {post.title}
                                            </h2>
                                            
                                            <p 
                                                itemprop="description"
                                                class="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                                                {formatContentPreview(post.content)}
                                            </p>
                                        </div>
                                    </Link>
                                {:else}
                                    <a href={post.link || '#'} target="_blank" rel="noopener noreferrer" class="block">
                                        <BlogPostImage
                                            image={post.image}
                                            thumbnail={post.thumbnail}
                                            title={post.title}
                                            category={post.category}
                                            isFeatured={false}
                                            size="regular"
                                            showCategory={true}
                                            showFeaturedBadge={false}
                                        />
                                        
                                        <div class="p-6">
                                            <BlogPostMeta
                                                isodate={post.isodate}
                                                date={post.date}
                                                creator={post.creator}
                                                category={post.category}
                                                readingTime={post.readingTime}
                                                content={post.content}
                                                showCreator={true}
                                                showCategory={false}
                                                variant="grid"
                                                truncateAuthor={truncateAuthor}
                                            />
                                            
                                            <h2 class="text-xl md:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                                {post.title}
                                            </h2>
                                            
                                            <p class="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                                                {formatContentPreview(post.content)}
                                            </p>
                                        </div>
                                    </a>
                                {/if}
                                
                                <div class="px-6 pb-6 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                                    <button 
                                        aria-label={post.liked ? 'Unlike the blog post' : 'Like the blog post'}
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        on:click|stopPropagation={() => handleLike(post.id || post.row_number)}
                                        title={post.liked ? 'Unlike' : 'Like'}
                                        disabled={likingPostId === (post.id || post.row_number)}
                                    >
                                        <span class="text-base">{post.liked ? '❤️' : '🤍'}</span>
                                        {#if likingPostId === (post.id || post.row_number)}
                                            <svg class="animate-spin h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        {:else}
                                            <span class="text-gray-700 dark:text-gray-300">{post.likes || 0}</span>
                                        {/if}
                                    </button>
                            
                                    <ShareButtons 
                                        {shareUrl}
                                        {shareText}
                                        title={post.title}
                                    />
                                </div>
                            </article>
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>
{/if}

<HeartAnimation show={showHeartAnimation} count={5} />
</PageLayout>
