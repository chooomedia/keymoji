<script>
    import { onMount } from 'svelte';
    import { currentLanguage, darkMode, showShareMenu } from './stores/appStores.js';
  
    export let slug;
    
    let post = null;
    let loading = true;
  
    onMount(async () => {
      try {
        const response = await fetch(`https://n8n.chooomedia.com/webhook/blog-post/${slug}`);
        const data = await response.json();
        post = data;
        loading = false;
        
        // Manually add JSON-LD after component mount
        if (post) {
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.text = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.title,
            'datePublished': post.date,
            'author': {
              '@type': 'Person',
              'name': 'Chris Matt'
            }
          });
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        loading = false;
      }
    });
  
    async function handleLike() {
      try {
        const response = await fetch(`https://n8n.chooomedia.com/webhook/blog-like/${post.id}`, {
          method: 'POST'
        });
        if (response.ok) {
          post.likes = (post.likes || 0) + 1;
          post.liked = true;
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
</script>
  
  <!-- SEO component is now managed by the LanguageRouter -->
  
{#if loading || !post}
    <div class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow"></div>
    </div>
{:else}
    <header class="max-w-4xl mx-auto px-4 py-8">
      <nav class="text-sm mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li><a href="/" class="text-gray-500 hover:text-yellow">Home</a></li>
          <li class="text-gray-400">/</li>
          <li><a href="/blog" class="text-gray-500 hover:text-yellow">Blog</a></li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-600 dark:text-gray-300">{post.title}</li>
        </ol>
      </nav>
  
      <h1 class="text-4xl font-bold text-black dark:text-white mb-4">
        {post.title}
      </h1>
  
      <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
        <time datetime={post.date}>
          {new Date(post.date).toLocaleDateString($currentLanguage)}
        </time>
        
        <span class="bg-yellow text-black px-2 py-1 rounded-full">
          {post.category}
        </span>
        
        <div class="flex items-center">
          ⏱️ {post.readingTime} min
        </div>
        
        <button aria-label="Share the blog post" 
          on:click={() => showShareMenu.set(true)} 
          class="flex items-center hover:text-yellow transition-colors"
        >
          🔗 Share
        </button>
        
        <button aria-label="Like the blog post" 
          on:click={handleLike}
          class="flex items-center hover:text-red-500 transition-colors"
        >
          {#if post.liked}
            ❤️
          {:else}
            🤍
          {/if}
          <span class="ml-1">{post.likes || 0}</span>
        </button>
      </div>
    </header>
  
    <main class="max-w-4xl mx-auto px-4">
      {#if post.thumbnail}
        <img 
          src={post.thumbnail} 
          alt={post.title}
          class="w-full h-96 object-cover rounded-xl mb-8"
        />
      {/if}
  
      <article class="prose dark:prose-invert max-w-none mb-16">
        {@html post.content}
      </article>
  
      <section class="my-16 bg-yellow dark:bg-aubergine rounded-xl p-8 text-center">
        <h2 class="text-2xl font-bold mb-4">Want to create your own secure emoji passwords?</h2>
        <p class="mb-6">Try Keymoji now and enhance your online security with unique emoji combinations.</p>
        <a 
          href="/"
          class="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-medium hover:scale-105 transition-all"
        >
          Try Keymoji Now
        </a>
      </section>
    </main>
{/if}°