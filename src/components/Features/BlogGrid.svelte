<script>
    import { onMount, onDestroy } from 'svelte';
    import { Link, navigate } from 'svelte-routing';
    import { linkedinIcon, whatsappIcon, emailIcon, redditIcon } from '../../assets/shapes.js';
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
    
    let posts = [];
    let showHeartAnimation = false;
    let heartAnimationPostId = null;
    let loading = true;
    let error = null;
    let selectedCategory = 'all';
    let displayedPosts = [];
    let postsPerPage = 4; // 1 featured + 3 regular
    let currentPage = 1;
    let isLoadingMore = false;
    let observer = null;
    let loadMoreTrigger = null;
    let isDropdownOpen = false;
    let dropdownRef = null;
    let buttonRef = null;
    
    // Get unique categories from posts with counts
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
            // 'all' always first
            if (a.category === 'all') return -1;
            if (b.category === 'all') return 1;
            // Then by count (descending)
            return b.count - a.count;
        });
    })();
    
    // Get unique categories from posts (for backwards compatibility)
    $: categories = categoriesWithCounts.map(c => c.category);
    
    // Filter and sort posts
    $: filteredPosts = (() => {
        let filtered = posts;
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        // Sort by date (newest first) - assuming posts have isodate or date
        filtered = [...filtered].sort((a, b) => {
            const dateA = new Date(a.isodate || a.date || 0);
            const dateB = new Date(b.isodate || b.date || 0);
            return dateB - dateA;
        });
        
        return filtered;
    })();
    
    // Calculate total pages
    // Page 1: Featured post (1)
    // Page 2+: 3 regular posts per page
    $: totalPages = (() => {
        if (filteredPosts.length === 0) return 0;
        if (filteredPosts.length === 1) return 1; // Only featured
        const regularPosts = filteredPosts.length - 1; // Exclude featured
        return Math.ceil(regularPosts / 3) + 1; // +1 for featured page
    })();
    
    // Get displayed posts (featured + paginated)
    $: displayedPosts = (() => {
        if (filteredPosts.length === 0) {
            return [];
        }
        
        const featured = filteredPosts[0];
        const regular = filteredPosts.slice(1);
        
        // Page 1: Featured post only
        if (currentPage === 1) {
            return [featured];
        }
        
        // Page 2+: Featured + paginated regular posts
        // Page 2: featured + posts 0-2 (3 posts)
        // Page 3: featured + posts 0-5 (6 posts)
        // Page 4: featured + posts 0-8 (9 posts)
        // etc.
        const regularToShow = (currentPage - 1) * 3;
        const paginatedRegular = regular.slice(0, regularToShow);
        return [featured, ...paginatedRegular];
    })();
    
    // Check if there are more posts to load
    $: hasMore = filteredPosts.length > displayedPosts.length;
    
    // Helper function to truncate author text to max 24 characters
    function truncateAuthor(author) {
        if (!author) return 'Unknown';
        const text = String(author);
        // If text is longer than 24 chars, show first 21 chars + "..." = 24 total
        return text.length > 24 ? text.substring(0, 21) + '...' : text;
    }
    
    async function handleLike(postId) {
        // Check if user is logged in
        if (!get(isLoggedIn)) {
            console.log('🔒 [BlogGrid] User not logged in, redirecting to account page');
            const lang = $currentLanguage || 'en';
            const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
            navigate(accountPath, { replace: false });
            return;
        }
        
        if (!postId) {
            console.warn('⚠️ [BlogGrid] No postId provided for like');
            return;
        }
        
        // Find post
        const postIndex = posts.findIndex(p => (p.id === postId || p.row_number === postId));
        if (postIndex === -1) {
            console.warn('⚠️ [BlogGrid] Post not found for like:', postId);
            return;
        }
        
        const originalPost = posts[postIndex];
        
        // Prevent double-liking
        if (originalPost.liked) {
            console.log('ℹ️ [BlogGrid] Post already liked');
            return;
    }
        
        const originalLikes = originalPost.likes || 0;
        
        // Update UI immediately (optimistic update)
        posts[postIndex] = {
            ...originalPost,
            likes: originalLikes + 1,
            liked: true
        };
        posts = posts; // Trigger reactivity
        
        // Call API
        const result = await likeBlogPost(postId, { optimistic: true });
        
        if (result && result.success) {
            // Update with server response
            posts[postIndex] = {
                ...posts[postIndex],
                likes: result.likes !== undefined ? result.likes : (originalLikes + 1),
                liked: true
            };
            
            // Trigger heart animation
            heartAnimationPostId = postId;
            showHeartAnimation = true;
            
            // Reset animation flag after a short delay to allow re-triggering
            setTimeout(() => {
                showHeartAnimation = false;
            }, 100);
            
            // Refresh likes from backend to ensure we have the latest value
            await refreshLikesFromBackend();
        } else {
            // Rollback on error
            posts[postIndex] = {
                ...originalPost,
                likes: originalLikes,
                liked: false
            };
            console.warn('⚠️ [BlogGrid] Like failed, rolled back');
            }
        
        posts = posts; // Trigger reactivity
    }
    
    async function refreshLikesFromBackend() {
        // Fetch latest posts to get updated likes from backend
        try {
            const allPosts = await fetchBlogPosts({ useCache: false, forceRefresh: true }); // Force fresh fetch
            
            // Update likes for all posts
            posts = posts.map(post => {
                const updatedPost = allPosts.find(p => 
                    (p.id === post.id || p.row_number === post.row_number) ||
                    (p.slug === post.slug)
                );
                
                if (updatedPost && updatedPost.likes !== undefined) {
                    return {
                        ...post,
                        likes: updatedPost.likes
                    };
                }
                return post;
            });
            
            posts = posts; // Trigger reactivity
            console.log('✅ [BlogGrid] Likes refreshed from backend');
        } catch (error) {
            console.warn('⚠️ [BlogGrid] Error refreshing likes:', error);
        }
    }
    
    function loadMore() {
        if (isLoadingMore || !hasMore) return;
        
        isLoadingMore = true;
        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
            currentPage++;
            isLoadingMore = false;
            // Scroll to top of new content smoothly
            if (loadMoreTrigger) {
                loadMoreTrigger.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    function goToPage(page) {
        if (page < 1 || page > totalPages || page === currentPage) return;
        
        currentPage = page;
        isLoadingMore = true;
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset loading state after a short delay
        setTimeout(() => {
            isLoadingMore = false;
            // Re-setup infinite scroll after page change
            setTimeout(() => {
                setupInfiniteScroll();
            }, 100);
        }, 300);
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
    
    function setupInfiniteScroll() {
        if (typeof IntersectionObserver === 'undefined') return;
        
        // Disconnect existing observer
        if (observer) {
            observer.disconnect();
        }
        
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && hasMore && !isLoadingMore) {
                        // Prevent duplicate loads
                        isLoadingMore = true;
                        loadMore();
                    }
                });
            },
            {
                rootMargin: '200px' // Start loading 200px before reaching the trigger
            }
        );
        
        if (loadMoreTrigger) {
            observer.observe(loadMoreTrigger);
        }
    }
    
    // Handle click outside dropdown
    function handleClickOutside(event) {
        // Prüfen ob der Click außerhalb des Category Dropdowns war
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
    
    // Handle keyboard navigation
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
    
    // Reset pagination when category changes
    $: if (selectedCategory) {
        currentPage = 1;
        isDropdownOpen = false;
        setTimeout(() => {
            setupInfiniteScroll();
        }, 100);
    }
    
    onMount(async () => {
        try {
            loading = true;
            error = null;
            
            const fetchedPosts = await fetchBlogPosts({ useCache: true });
            
            if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
                posts = fetchedPosts;
                // Debug: Log likes from backend for first post
                if (posts.length > 0) {
                    console.log('📡 [BlogGrid] Loaded posts with likes from backend:', {
                        totalPosts: posts.length,
                        firstPost: {
                            title: posts[0].title,
                            likes: posts[0].likes,
                            liked: posts[0].liked,
                            likesSource: posts[0].likes !== undefined ? 'backend' : 'cache'
                        }
                    });
                }
            } else {
                posts = [];
                console.warn('⚠️ [BlogGrid] No posts received');
            }
            
            // Update SEO
            updateSeo({
                title: $translations?.blog?.title || 'Blog',
                description: $translations?.blog?.description || 'Read our latest blog posts about emoji passwords, security, and more.',
                url: window.location.pathname,
                pageType: 'blog'
            });
            
            // Setup infinite scroll after posts are loaded
            setTimeout(() => {
                setupInfiniteScroll();
            }, 100);
            
            // Setup click outside and keyboard handlers
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
        if (observer) {
            observer.disconnect();
        }
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeydown);
    });
    
    $: pageTitle = $translations?.blog?.title || 'Blog';
    $: pageDescription = $translations?.blog?.description || 'Read our latest blog posts about emoji passwords, security, and more.';
</script>

<PageLayout {pageTitle} {pageDescription}>
{#if loading}
    <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow"></div>
    </div>
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
        <!-- Pagination (Reusable Component) -->
        {#if filteredPosts.length > 4 && totalPages > 1}
            <Pagination 
                {currentPage}
                {totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoadingMore}
            />
        {/if}

        <!-- Category Filter Dropdown -->
        <div class="w-full mb-6 flex justify-center">
            <div class="relative inline-block w-full max-w-md">
                <button
                    id="category-toggle-button"
                    bind:this={buttonRef}
                    on:click={() => {
                        // Schließe Language Dropdown, wenn Category Dropdown geöffnet wird
                        if (!isDropdownOpen) {
                            const languageMenu = document.querySelector('#language-dropdown-menu');
                            if (languageMenu) {
                                const languageButton = document.querySelector('#language-toggle-button');
                                if (languageButton && languageButton.getAttribute('aria-expanded') === 'true') {
                                    languageButton.click(); // Toggle schließt das Dropdown
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

        <!-- Infinite Scroll Trigger (Hidden) -->
        {#if hasMore}
            <div 
                bind:this={loadMoreTrigger}
                class="w-full h-1 opacity-0 pointer-events-none"
                aria-hidden="true"
            >
                {#if isLoadingMore}
                    <div class="flex justify-center py-4">
                        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow"></div>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Blog Posts Grid -->
        <div class="w-full space-y-8">
            {#each displayedPosts as post, index (post.row_number)}
                {@const shareUrl = post.slug ? getBlogShareUrl(post.slug) : (post.link || (typeof window !== 'undefined' ? window.location.href : ''))}
                {@const shareText = `${post.title} - ${shareUrl}`}
                {@const isFeatured = index === 0}
                
                <article class="bg-white dark:bg-aubergine-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl group
                    {isFeatured ? 'md:col-span-full' : ''}"
                >
                    {#if post.slug}
                        <Link to={getBlogUrl(post.slug)} class="block">
                            <BlogPostImage
                                image={post.image}
                                thumbnail={post.thumbnail}
                                title={post.title}
                                category={post.category}
                                isFeatured={isFeatured}
                                size={isFeatured ? 'featured' : 'regular'}
                                showCategory={true}
                                showFeaturedBadge={isFeatured}
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
                    <div class="px-6 pb-6 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                        <button 
                            aria-label="Like the blog post" 
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
                            on:click|stopPropagation={() => handleLike(post.id || post.row_number)}>
                            <span class="text-base">{post.liked ? '❤️' : '🤍'}</span>
                            <span class="text-gray-700 dark:text-gray-300">{post.likes || 0}</span>
                </button>
                
                        <div class="flex gap-2">
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                               class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
                               title="Share on LinkedIn"
                               aria-label="Share on LinkedIn">
                               <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            {@html linkedinIcon}
                       </svg>
                    </a>
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                               class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
                               title="Share on WhatsApp"
                               aria-label="Share on WhatsApp">
                               <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            {@html whatsappIcon}
                       </svg>
                    </a>
                            <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                               class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
                               title="Share on Reddit"
                               aria-label="Share on Reddit">
                               <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            {@html redditIcon}
                       </svg>
                    </a>
                            <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`}
                               class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
                               title="Share via Email"
                               aria-label="Share via Email">
                               <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            {@html emailIcon}
                       </svg>
                    </a>
                </div>
            </div>
        </article>
    {/each}
        </div>
{/if}

<!-- Heart Animation -->
<HeartAnimation show={showHeartAnimation} count={3} />
</PageLayout>
