<script>
    import { onMount } from 'svelte';
    import { currentLanguage } from './stores/appStores.js';
    import { linkedinIcon, fbmessengerIcon, whatsappIcon, emailIcon, redditIcon, instagramIcon } from './shapes.js';
    
    let posts = [];
    let loading = true;
    // LocalStorage Funktionen
    function getStoredPosts() {
        try {
            const stored = localStorage.getItem('keymoji_blog_posts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }
    function storePosts(postsData) {
        try {
            localStorage.setItem('keymoji_blog_posts', JSON.stringify(postsData));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }
    // Berechnet Lesezeit
    function calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content?.split(/\s+/)?.length || 0;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    }
    
    function formatContent(content) {
        if (!content) return '';
        let formatted = content
            .replace(/\[&#8230;\]/g, '...')
            .replace(/\n/g, ' ')
            .replace(/\[empty\]/g, '')
            .replace(/The post .* appeared first on .*/, '');
        
        if (formatted.length > 270) {
            formatted = formatted.substr(0, 270);
            formatted = formatted.substr(0, Math.min(formatted.length, formatted.lastIndexOf(' '))) + '...';
        }
        return formatted;
    }
    async function handleLike(rowNumber) {
        // Update local state first
        posts = posts.map(post => {
            if (post.row_number === rowNumber) {
                const newLikes = (post.likes || 0) + 1;
                return { ...post, likes: newLikes, liked: true };
            }
            return post;
        });
        // Update localStorage
        storePosts(posts);
        // Try to update server if online
        try {
            const response = await fetch(`https://n8n.chooomedia.com/webhook/xn--moji-pb73c-blog-like/${rowNumber}`, {
                method: 'POST'
            });
            if (!response.ok) {
                console.warn('Server update failed, but local state is preserved');
            }
        } catch (error) {
            console.warn('Network error, but local state is preserved:', error);
        }
    }
    onMount(async () => {
        // Load from localStorage first
        const storedPosts = getStoredPosts();
        if (storedPosts.length > 0) {
            posts = storedPosts;
            loading = false;
        }
        // Then try to fetch fresh data
        try {
            const response = await fetch('https://n8n.chooomedia.com/webhook/xn--moji-pb73c-blog-posts');
            const data = await response.json();
            
            // Merge with existing likes
            posts = data.map(newPost => {
                const existingPost = storedPosts.find(p => p.row_number === newPost.row_number);
                return {
                    ...newPost,
                    likes: existingPost?.likes || 0,
                    liked: existingPost?.liked || false
                };
            });
            
            storePosts(posts);
            loading = false;
        } catch (error) {
            console.error('Error fetching posts:', error);
            loading = false;
        }
    });
    function formatDate(isodate) {
        try {
            return new Date(isodate).toLocaleDateString($currentLanguage, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return '';
        }
    }
    $: featuredPost = posts.reduce((max, post) => 
        (post.likes || 0) > (max.likes || 0) ? post : max, 
        posts[0] || null
    );
</script>
{#if loading}
    <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow"></div>
    </div>
{:else}
<main class="columns">
    {#each posts as post (post.row_number)}
        <article class="masonry-item bg-creme dark:bg-aubergine-80 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 mb-6 group
            {post.row_number === featuredPost?.row_number ? 'md:col-span-2 md:max-w-none' : ''}"
        >
            <a href={post.link} target="_blank" rel="noopener noreferrer" class="block">
                <div class="relative">
                    {#if post.image && post.image !== '[empty]'}
                        <img 
                            src={post.image} 
                            alt={post.title}
                            class="w-full {post.row_number === featuredPost?.row_number ? 'h-64 md:h-96' : 'h-48'} object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    {:else}
                        <div class="w-full {post.row_number === featuredPost?.row_number ? 'h-64 md:h-96' : 'h-48'} bg-gray-200 dark:bg-aubergine-dark bg-gray-light flex items-center justify-center">
                            <span class="text-8xl opacity-30 transition-transform duration-300 group-hover:scale-110">🔑</span>
                        </div>
                    {/if}
                    <div class="absolute top-4 right-4 bg-yellow text-black px-2 py-1 rounded-full text-xs font-medium">
                        {post.category}
                    </div>
                    {#if post.row_number === featuredPost?.row_number}
                        <div class="absolute top-4 left-4 bg-yellow text-black px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ Featured
                        </div>
                    {/if}
                </div>
                
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-light justify-center">
                        <time class="flex items-center">
                            📅 {formatDate(post.isodate)}
                        </time>
                        <span class="flex items-center">
                            👤 {post.creator}
                        </span>
                        <span class="flex items-center">
                            ⏱️ {calculateReadTime(post.content)} min read
                        </span>
                    </div>
                    
                    <h2 class="text-xl {post.row_number === featuredPost?.row_number ? 'md:text-2xl' : ''} font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                        {post.title}
                    </h2>
                    
                    <p class="text-gray-600 dark:text-gray text-sm leading-relaxed {post.row_number === featuredPost?.row_number ? 'md:text-base' : ''}">
                        {formatContent(post.content)}
                    </p>
                </div>
            </a>
            <div class="px-6 pb-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 mt-2 pt-4">
                <button aria-label="Like the blog post" 
                    class="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    on:click={() => handleLike(post.row_number)}>
                    <span class="transform transition-transform hover:scale-110">
                        {post.liked ? '❤️' : '🤍'}
                    </span>
                    <span class="text-sm font-medium dark:text-white">{post.likes || 0}</span>
                </button>
                
                <div class="flex gap-4">
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.link)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       class="text-gray-500 dark:text-gray-400 hover:text-blue-700 transition-colors"
                       title="Share on LinkedIn">
                       <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            {@html linkedinIcon}
                       </svg>
                    </a>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + post.link)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       class="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors"
                       title="Share on WhatsApp">
                       <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            {@html whatsappIcon}
                       </svg>
                    </a>
                    <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(post.link)}&title=${encodeURIComponent(post.title)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       class="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                       title="Share on Reddit">
                       <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            {@html redditIcon}
                       </svg>
                    </a>
                    <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.link)}`}
                       class="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                       title="Share via Email">
                       <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            {@html emailIcon}
                       </svg>
                    </a>
                </div>
            </div>
        </article>
    {/each}
</main>
{/if}