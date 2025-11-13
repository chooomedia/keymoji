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
    import { linkedinIcon, whatsappIcon, emailIcon, redditIcon } from '../../assets/shapes.js';
    import BlogPostImage from './BlogPostImage.svelte';
    import BlogPostMeta from './BlogPostMeta.svelte';
    import HeartAnimation from './HeartAnimation.svelte';
  
    export let slug;
    
    let post = null;
    let loading = true;
    let error = null;
    let shareUrl = '';
    let showHeartAnimation = false;
  
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
          
          // Debug: Log post data to verify structure and likes from backend
          console.log('📡 [BlogPost] Loaded post:', {
            id: post.id,
            row_number: post.row_number,
            slug: post.slug,
            title: post.title,
            image: post.image,
            thumbnail: post.thumbnail,
            likes: post.likes, // Should come from backend (n8n Merge With Likes)
            liked: post.liked, // User-specific (from cache)
            likesSource: post.likes !== undefined ? 'backend' : 'cache'
          });
          
          // Generiere Share-URL
          shareUrl = getBlogShareUrl(post.slug || slug);
        
        // Update SEO for blog post
          updateSeo({
            title: post.title,
            description: post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : ''),
            url: window.location.pathname,
            pageType: 'blog',
            image: post.thumbnail || post.image
          });
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
      // Check if user is logged in
      if (!get(isLoggedIn)) {
        console.log('🔒 [BlogPost] User not logged in, redirecting to account page');
        const lang = $currentLanguage || 'en';
        const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
        navigate(accountPath, { replace: false });
        return;
      }
      
      // Get post identifier (id or row_number)
      const postId = post?.id || post?.row_number;
      if (!post || !postId) {
        console.warn('⚠️ [BlogPost] No post ID for like:', { post, postId });
        return;
      }
      
      // Prevent double-liking
      if (post.liked) {
        console.log('ℹ️ [BlogPost] Post already liked');
        return;
      }
      
      const originalLikes = post.likes || 0;
      const originalLiked = post.liked || false;
      
      console.log('📡 [BlogPost] Liking post:', { postId, originalLikes, originalLiked });
      
      // Optimistic update
      post = {
        ...post,
        likes: originalLikes + 1,
        liked: true
      };
      
      try {
        // Call API
        const result = await likeBlogPost(postId, { optimistic: true });
        
        console.log('📡 [BlogPost] Like API result:', result);
        
        if (result && result.success) {
          // Update with server response
          post = {
            ...post,
            likes: result.likes !== undefined ? result.likes : (originalLikes + 1),
            liked: true
          };
          console.log('✅ [BlogPost] Like saved successfully:', { likes: post.likes });
          
          // Trigger heart animation
          showHeartAnimation = true;
          
          // Reset animation flag after a short delay to allow re-triggering
          setTimeout(() => {
            showHeartAnimation = false;
          }, 100);
          
          // Refresh likes from backend to ensure we have the latest value
          await refreshLikesFromBackend();
        } else {
          // Rollback on error
          post = {
            ...post,
            likes: originalLikes,
            liked: originalLiked
          };
          console.warn('⚠️ [BlogPost] Like failed, rolled back:', result);
        }
      } catch (error) {
        console.error('❌ [BlogPost] Error liking post:', error);
        // Rollback on error
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
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow"></div>
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
            <article class="prose prose-gray dark:prose-invert dark:text-gray-200 max-w-none mb-16">
        {@html post.content}
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
                        disabled={post.liked}
                    >
                        <span class="text-base">{post.liked ? '❤️' : '🤍'}</span>
                        <span class="text-gray-700 dark:text-gray-300">{post.likes || 0}</span>
                    </button>
                    
                    <div class="flex gap-2">
                        <!-- Native Share Button (if available) -->
                        {#if typeof navigator !== 'undefined' && navigator.share}
                            <button 
                                aria-label="Share the blog post" 
                                on:click={() => {
                                    if (shareUrl) {
                                        navigator.share({
                                            title: post.title,
                                            text: post.excerpt || '',
                                            url: shareUrl
                                        }).catch(err => {
                                            if (err.name !== 'AbortError') {
                                                showShareMenu.set(true);
                                            }
                                        });
                                    } else {
                                        showShareMenu.set(true);
                                    }
                                }}
                                class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
                                title="Share this post"
                            >
                                <span class="text-base">🔗</span>
                            </button>
                        {/if}
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
            {/if}
            </div>
        </div>
    {/if}
    
    <!-- Heart Animation -->
    <HeartAnimation show={showHeartAnimation} count={3} />
</PageLayout>
