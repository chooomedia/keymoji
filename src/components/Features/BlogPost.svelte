<script>
    import { currentLanguage, showShareMenu, translations } from '../../stores/contentStore.js';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { Link, navigate } from 'svelte-routing';
    import { updateSeo } from '../../stores/seoStore';
    import { fetchBlogPost, likeBlogPost, fetchBlogPosts } from '../../utils/blogApi';
    import { getBlogUrl, getBlogShareUrl, getHomeUrl } from '../../utils/blogNavigation';
    import { isLoggedIn } from '../../stores/appStores'
    import { blogLikesStore } from '../../stores/blogLikesStore';
    import { get } from 'svelte/store';
    import PageLayout from '../Layout/PageLayout.svelte';
    import BlogPostImage from './BlogPostImage.svelte';
    import BlogPostMeta from './BlogPostMeta.svelte';
    import HeartAnimation from './HeartAnimation.svelte';
    import ShareButtons from './ShareButtons.svelte';
    import { generateBlogPostStructuredData, formatCanonicalUrl, injectStructuredData } from '../../utils/seo';
    import BlogPostSkeleton from './BlogPostSkeleton.svelte';
    import { navigateToBlogPost } from '../../utils/blogNavigation';
  
    export let slug;
    
    let post = null;
    let loading = true;
    let error = null;
    let shareUrl = '';
    let showHeartAnimation = false;
    let isLiking = false;
    let allPosts = [];
    let previousPost = null;
    let nextPost = null;
    let isTransitioning = false;
    let isMounted = false;
  
    // Translations for 404 page
    $: backToPostsText = (() => {
        const lang = $currentLanguage || 'en';
        if (lang === 'de') return 'Zurück zu Posts';
        if (lang === 'en') return 'Back to Posts';
        return 'Back to Posts'; // Fallback for all other languages
    })();
    
    $: postNotFoundText = (() => {
        const lang = $currentLanguage || 'en';
        if (lang === 'de') return 'Post nicht gefunden';
        if (lang === 'en') return 'Post not found';
        return 'Post not found'; // Fallback for all other languages
    })();
  
    function navigateBack() {
        const lang = $currentLanguage || 'en';
        const blogPath = lang === 'en' ? '/blog' : `/${lang}/blog`;
        navigate(blogPath, { replace: true });
    }
  
    onMount(() => {
        isMounted = true;
        loadPost();
    });
    
    function navigateToPrevious() {
        if (!previousPost || !previousPost.slug || isTransitioning || loading) return;
        isTransitioning = true;
        loading = true; // Show skeleton during navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigateToBlogPost(previousPost.slug, false);
    }
    
    function navigateToNext() {
        if (!nextPost || !nextPost.slug || isTransitioning || loading) return;
        isTransitioning = true;
        loading = true; // Show skeleton during navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigateToBlogPost(nextPost.slug, false);
    }
    
    // Reload post when slug changes (for navigation between posts)
    $: if (slug && isMounted) {
        loadPost();
    }
    
    async function loadPost() {
      if (!slug) {
        error = 'Invalid post slug';
        loading = false;
        return;
      }
      
      try {
        loading = true;
        error = null;
            isTransitioning = false;
            
            // Lade alle Posts für Navigation
            allPosts = await fetchBlogPosts({ useCache: true });
        
        const fetchedPost = await fetchBlogPost(slug, { useCache: true });
        
        if (fetchedPost) {
          post = fetchedPost;
          shareUrl = getBlogShareUrl(post.slug || slug);
                
                // Finde Previous/Next Post im Array
                const currentIndex = allPosts.findIndex(p => 
                    (p.slug && p.slug === post.slug) || 
                    (p.id === post.id) || 
                    (p.row_number === post.row_number)
                );
                
                if (currentIndex !== -1) {
                    // Previous Post (höherer Index = neuer)
                    previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
                    // Next Post (niedrigerer Index = älter)
                    nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
                }
        
        // Update SEO for blog post
          const canonicalUrl = formatCanonicalUrl(window.location.pathname);
          updateSeo({
            title: post.title,
            description: post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : ''),
            url: window.location.pathname,
            pageType: 'blog',
            image: post.image,
            canonical: canonicalUrl
          });
          
          // Inject BlogPosting structured data (E-E-A-T-S optimized)
          const structuredData = generateBlogPostStructuredData(post, $currentLanguage, canonicalUrl);
          injectStructuredData(structuredData);
        } else {
          // Post nicht gefunden - 404
          post = null;
          error = postNotFoundText; // Verwende übersetzten Text
          console.warn('⚠️ [BlogPost] Post not found with slug:', slug);
          
          // Update SEO for 404 page
          updateSeo({
            title: postNotFoundText,
            description: postNotFoundText,
            url: window.location.pathname,
            pageType: 'blog',
            canonical: formatCanonicalUrl(window.location.pathname)
          });
        }
      } catch (err) {
        console.error('❌ [BlogPost] Error fetching post:', err);
        post = null;
        error = err.message || postNotFoundText; // Verwende übersetzten Text als Fallback
      } finally {
        loading = false;
      }
    }
  
    let likeStatus = null; // 'success' | 'error' | null
  
    async function handleLike() {
        if (!get(isLoggedIn)) {
            const lang = $currentLanguage || 'en';
            const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
            navigate(accountPath, { replace: false });
            return;
        }
        
        const postId = post?.id || post?.row_number;
        if (!post || !postId || isLiking) return;
        
        const currentLikes = post.likes || 0;
        
        // KEIN TOGGLE: Nur Like wenn likes === 0
        if (currentLikes > 0) {
            console.log('⚠️ [BlogPost] Post already liked (likes > 0), skipping');
            return;
        }
        
        // Clear previous status
        likeStatus = null;
        
        // Set loading state
        isLiking = true;
        
        try {
            // Use store to add like (no toggle)
            const result = await blogLikesStore.addLike(postId, true);
            
            // Clear loading state
            isLiking = false;
            
            if (result && result.success) {
                // Erfolg: Grünes Häkchen
                likeStatus = 'success';
                
                // PRIORITÄT: Backend-Wert (result.likes) hat immer höchste Priorität
                const backendLikes = result.likes !== undefined && result.likes !== null 
                    ? parseInt(result.likes, 10) 
                    : 1;
                
                post = {
                    ...post,
                    likes: backendLikes,
                    liked: true // Immer true wenn likes > 0
                };
                
                // Große fliegende Herzen
                    showHeartAnimation = true;
                    setTimeout(() => {
                        showHeartAnimation = false;
                }, 1200);
                
                // Clear success status after animation
                setTimeout(() => {
                    likeStatus = null;
                }, 2000);
            } else {
                // Fehler: Rotes X
                likeStatus = 'error';
                
                // Clear error status after animation
                setTimeout(() => {
                    likeStatus = null;
                }, 2000);
            }
        } catch (error) {
            console.error('❌ [BlogPost] Error liking post:', error);
            isLiking = false;
            
            // Fehler: Rotes X
            likeStatus = 'error';
            
            // Clear error status after animation
            setTimeout(() => {
                likeStatus = null;
            }, 2000);
        }
    }
    
    async function refreshLikesFromBackend() {
      // Fetch latest posts to get updated likes from backend
      try {
        const allPosts = await fetchBlogPosts({ useCache: false, forceRefresh: true }); // Force fresh fetch
        const updatedPost = allPosts.find(p => 
          (p.id === post.id || p.row_number === post.row_number) ||
          (p.slug === post.slug)
        );
        
        if (updatedPost && updatedPost.likes !== undefined) {
          post = {
            ...post,
            likes: updatedPost.likes
          };
          console.log('✅ [BlogPost] Likes refreshed from backend:', updatedPost.likes);
        }
      } catch (error) {
        console.warn('⚠️ [BlogPost] Error refreshing likes:', error);
      }
    }
</script>
  
    <PageLayout pageTitle={post?.title || ''} pageDescription={post?.excerpt || ''}>
    <!-- Back Button - Liegt ZUR HÄLFTE auf content-wrapper Rand -->
    <div slot="before-content" class="relative w-full flex justify-center -mb-14">
        {#if !loading && !error && post}
            <button 
                on:click={navigateBack}
                class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 z-20"
                aria-label={backToPostsText}
                title={backToPostsText}
            >
                <span class="text-lg">←</span>
                <span class="font-semibold">{backToPostsText}</span>
            </button>
        {/if}
    </div>

    {#if loading || isTransitioning}
        <div in:fade={{duration: 200, easing: cubicInOut}} out:fade={{duration: 150, easing: cubicInOut}}>
            <BlogPostSkeleton count={1} />
        </div>
    {:else if error || !post}
        <!-- 404 Error Page - Übersetzt -->
        <div class="flex flex-col justify-center items-center py-12 min-h-[60vh]">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <p class="text-red-500 dark:text-red-400 mb-6 text-lg">❌ {error || postNotFoundText}</p>
            <Link 
                to={getBlogUrl()} 
                    class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                    aria-label={backToPostsText}
                    title={backToPostsText}>
                    <span class="text-lg">←</span>
                    <span>{backToPostsText}</span>
            </Link>
            </div>
        </div>
    {:else}
        <!-- Content Container - Filigranes Spacing oben -->
        <div class="container mx-auto py-4">
            <div class="max-w-4xl mx-auto">
                <!-- Post Meta Information (Date, Creator, Reading Time) - In Content Area with proper spacing -->
                <BlogPostMeta
                    isodate={post.isodate}
                    date={post.date}
                    creator={post.creator}
                    category=""
                    readingTime={post.readingTime}
                    content={post.content}
                    showCreator={true}
                    variant="detail"
                />
                
                <!-- Post Image -->
                <div class="mb-8">
                    <BlogPostImage
                        image={post.image}
                        title={post.title}
                        category={post.category}
                        size="detail"
                        showCategory={true}
                        showFeaturedBadge={false}
                    />
                </div>
  
            <!-- Post Content -->
            <article 
                itemscope 
                itemtype="https://schema.org/BlogPosting"
                class="prose prose-gray dark:prose-invert dark:text-gray-200 max-w-none mb-16">
                <h1 itemprop="headline" class="sr-only">{post.title}</h1>
                <div itemprop="articleBody">
                    {@html post.content}
                </div>
            </article>
  
            <!-- CTA Section -->
            <section class="bg-white dark:bg-aubergine-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                <h2 class="text-2xl font-bold mb-4 text-black dark:text-white">Want to create your own secure emoji passwords?</h2>
                <p class="mb-6 text-gray-700 dark:text-gray-300">Try Keymoji now and enhance your online security with unique emoji combinations.</p>
                <Link 
                    to={getHomeUrl()}
                    class="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full font-medium hover:scale-105 focus:scale-105 active:scale-95 transition-all transform focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          aria-label="Try Keymoji now"
          title="Try Keymoji - Emoji Password Generator"
        >
          Try Keymoji Now
                </Link>
      </section>
            
            <!-- Like and Share Buttons as Chips - Same Style as BlogGrid -->
            {#if !loading && !error && post}
                {@const shareText = `${post.title} - ${shareUrl}`}
                {@const hasLikes = (post.likes || 0) > 0}
                <div class="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 mt-8">
                    <button 
                        aria-label={hasLikes ? 'Post already liked' : 'Like the blog post'}
                        on:click={handleLike}
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={hasLikes ? 'Already liked' : 'Like'}
                        disabled={isLiking || hasLikes}
                    >
                        <span class="text-base">{hasLikes ? '❤️' : '🤍'}</span>
                        {#if isLiking}
                            <!-- Loading Spinner -->
                            <svg class="animate-spin h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        {:else if likeStatus === 'success'}
                            <!-- Success Checkmark -->
                            <svg class="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        {:else if likeStatus === 'error'}
                            <!-- Error X -->
                            <svg class="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        {:else}
                            <span class="text-gray-700 dark:text-gray-300">{post.likes || 0}</span>
                        {/if}
                    </button>
                    
                    <ShareButtons 
                        {shareUrl}
                        {shareText}
                        title={post.title}
                        showNativeShare={true}
                    />
                </div>
            {/if}
            </div>
        </div>
    {/if}
    
    <!-- Heart Animation -->
    <HeartAnimation show={showHeartAnimation} count={5} />
</PageLayout>

<!-- Fixed Navigation Buttons (Previous/Next Post) - Outside PageLayout -->
{#if !loading && !error && post && (previousPost || nextPost)}
<nav 
    itemscope 
    itemtype="https://schema.org/SiteNavigationElement"
    aria-label="Blog post navigation"
    class="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
>
    {#if previousPost}
        <span itemprop="name" class="sr-only">Previous blog post navigation</span>
        <button
            on:click={navigateToPrevious}
            disabled={isTransitioning}
            class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100"
            aria-label="Go to previous blog post: {previousPost.title}"
            aria-disabled={isTransitioning}
            title="Previous post: {previousPost.title}"
            type="button"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    {/if}
</nav>

<nav 
    itemscope 
    itemtype="https://schema.org/SiteNavigationElement"
    aria-label="Blog post navigation"
    class="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
>
    {#if nextPost}
        <span itemprop="name" class="sr-only">Next blog post navigation</span>
        <button
            on:click={navigateToNext}
            disabled={isTransitioning}
            class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100"
            aria-label="Go to next blog post: {nextPost.title}"
            aria-disabled={isTransitioning}
            title="Next post: {nextPost.title}"
            type="button"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    {/if}
</nav>
{/if}
