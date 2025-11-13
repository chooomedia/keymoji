<script>
    import { currentLanguage, showShareMenu, translations } from '../../stores/contentStore.js';
    import { onMount } from 'svelte';
    import { Link, navigate } from 'svelte-routing';
    import { updateSeo } from '../../stores/seoStore.js';
    import { fetchBlogPost, likeBlogPost, fetchBlogPosts } from '../../utils/blogApi.js';
    import { getBlogUrl, getBlogShareUrl, getHomeUrl } from '../../utils/blogNavigation.js';
    import { isLoggedIn } from '../../stores/appStores.js';
    import { get } from 'svelte/store';
    import PageLayout from '../Layout/PageLayout.svelte';
    import BlogPostImage from './BlogPostImage.svelte';
    import BlogPostMeta from './BlogPostMeta.svelte';
    import HeartAnimation from './HeartAnimation.svelte';
    import ShareButtons from './ShareButtons.svelte';
    import { generateBlogPostStructuredData, formatCanonicalUrl, injectStructuredData } from '../../utils/seo.js';
  
    export let slug;
    
    let post = null;
    let loading = true;
    let error = null;
    let shareUrl = '';
    let showHeartAnimation = false;
    let isLiking = false;
  
    // Translations for "Back to Posts" button
    $: backToPostsText = (() => {
        const lang = $currentLanguage || 'en';
        if (lang === 'de') return 'Zurück zu Posts';
        if (lang === 'en') return 'Back to Posts';
        return 'Back to Posts'; // Fallback for all other languages
    })();
  
    function navigateBack() {
        const lang = $currentLanguage || 'en';
        const blogPath = lang === 'en' ? '/blog' : `/${lang}/blog`;
        navigate(blogPath, { replace: true });
    }
  
    onMount(async () => {
      if (!slug) {
        console.error('❌ [BlogPost] No slug provided');
        error = 'Invalid post slug';
        loading = false;
        return;
      }
      
      try {
        loading = true;
        error = null;
        
        const fetchedPost = await fetchBlogPost(slug, { useCache: true });
        
        if (fetchedPost) {
          post = fetchedPost;
          shareUrl = getBlogShareUrl(post.slug || slug);
        
        // Update SEO for blog post
          const canonicalUrl = formatCanonicalUrl(window.location.pathname);
          updateSeo({
            title: post.title,
            description: post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : ''),
            url: window.location.pathname,
            pageType: 'blog',
            image: post.thumbnail || post.image,
            canonical: canonicalUrl
          });
          
          // Inject BlogPosting structured data (E-E-A-T-S optimized)
          const structuredData = generateBlogPostStructuredData(post, $currentLanguage, canonicalUrl);
          injectStructuredData(structuredData);
        } else {
          error = 'Post not found';
        }
      } catch (err) {
        console.error('❌ [BlogPost] Error fetching post:', err);
        error = err.message || 'Failed to load blog post';
      } finally {
        loading = false;
      }
    });
  
    async function handleLike() {
        if (!get(isLoggedIn)) {
            const lang = $currentLanguage || 'en';
            const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
            navigate(accountPath, { replace: false });
            return;
        }
        
        const postId = post?.id || post?.row_number;
        if (!post || !postId || isLiking) return;
        
        const originalLikes = post.likes || 0;
        const originalLiked = post.liked || false;
        const isUnlike = originalLiked;
        
        // Set loading state
        isLiking = true;
        
        // Optimistic update
        post = {
            ...post,
            likes: isUnlike ? Math.max(0, originalLikes - 1) : originalLikes + 1,
            liked: !isUnlike
        };
        
        try {
            const result = await likeBlogPost(postId, { optimistic: true, unlike: isUnlike });
            
            // Clear loading state
            isLiking = false;
            
            if (result && result.success) {
                // PRIORITÄT: Backend-Wert (result.likes) hat immer höchste Priorität
                const backendLikes = result.likes !== undefined && result.likes !== null 
                    ? parseInt(result.likes, 10) 
                    : null;
                const optimisticLikes = isUnlike 
                    ? Math.max(0, originalLikes - 1) 
                    : originalLikes + 1;
                
                // Verwende immer den höheren Wert (Backend hat Priorität)
                const finalLikes = backendLikes !== null 
                    ? Math.max(backendLikes, optimisticLikes) 
                    : optimisticLikes;
                
                post = {
                    ...post,
                    likes: finalLikes,
                    liked: !isUnlike
                };
                post = post;
                
                // Animation nur bei Like (nicht bei Unlike)
                if (!isUnlike) {
                    showHeartAnimation = true;
                    setTimeout(() => {
                        showHeartAnimation = false;
                    }, 50);
                }
                
                if (result.likes === undefined || result.likes === null) {
                    await refreshLikesFromBackend();
                }
            } else {
                // Rollback on error
                post = {
                    ...post,
                    likes: originalLikes,
                    liked: originalLiked
                };
            }
        } catch (error) {
            console.error('❌ [BlogPost] Error liking post:', error);
            isLiking = false;
            post = {
                ...post,
                likes: originalLikes,
                liked: originalLiked
            };
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

    {#if loading}
        <div class="container mx-auto py-4">
            <div class="max-w-4xl mx-auto">
                <!-- Skeleton Loading -->
                <article class="bg-white dark:bg-aubergine-900 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <!-- Meta Skeleton -->
                    <div class="p-6 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="h-3 w-20 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                            <div class="h-3 w-16 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                        </div>
                    </div>
                    
                    <!-- Image Skeleton -->
                    <div class="w-full h-64 md:h-96 bg-gray-300 dark:bg-aubergine-800"></div>
                    
                    <!-- Content Skeleton -->
                    <div class="p-6 md:p-8 space-y-4">
                        <div class="space-y-2">
                            <div class="h-8 w-3/4 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                            <div class="h-8 w-1/2 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                        </div>
                        
                        <div class="space-y-3 mt-6">
                            <div class="h-4 w-full bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                            <div class="h-4 w-full bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                            <div class="h-4 w-5/6 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                            <div class="h-4 w-full bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                            <div class="h-4 w-4/5 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    {:else if error || !post}
        <div class="flex flex-col justify-center items-center py-12">
            <p class="text-red-500 dark:text-red-400 mb-4">❌ {error || 'Post not found'}</p>
            <Link 
                to={getBlogUrl()} 
                class="px-4 py-2 bg-yellow text-black rounded-full hover:scale-105 focus:scale-105 active:scale-95 transition-all transform focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2">
                {backToPostsText}
            </Link>
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
                        thumbnail={post.thumbnail}
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
                <div class="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 mt-8">
                    <button 
                        aria-label={post.liked ? 'Unlike the blog post' : 'Like the blog post'}
                        on:click={handleLike}
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={post.liked ? 'Unlike' : 'Like'}
                        disabled={isLiking}
                    >
                        <span class="text-base">{post.liked ? '❤️' : '🤍'}</span>
                        {#if isLiking}
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
