<!-- src/routes/NotFound.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { navigate } from "svelte-routing";
    import { currentLanguage, getText } from '../stores.js';
    import SEO from '../components/Seo.svelte';
    
    // Set 404 status code for proper SEO
    onMount(() => {
      // Only set status in SSR context
      if (typeof document === 'undefined') {
        return { status: 404 };
      }
      
      // For client-side, use the meta tag approach
      document.title = `404 - ${getText('notFound.message')}`;
    });
    
    function goHome() {
      navigate(`/${$currentLanguage}`, { replace: true });
    }
  </script>
  
  <SEO 
    title={`404 - ${getText('notFound.message')}`}
    description={getText('notFound.description') || "Page not found"}
    noindex={true}
    pageType="notFound"
  />
  
  <div class="flex flex-col justify-center items-center min-h-screen py-5 text-center" 
       in:fly={{ y: 50, duration: 400, delay: 400 }} 
       out:fly={{ y: -50, duration: 300 }}>
    
    <div class="w-11/12 md:w-26r bg-creme-80 dark:bg-aubergine-80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
      <h1 class="text-4xl font-bold mb-4 dark:text-white">
        <span class="text-6xl block mb-4">😵</span>
        404
      </h1>
      
      <p class="text-xl mb-6 dark:text-white">
        {getText('notFound.message')}
      </p>
      
      <p class="text-md mb-8 text-gray dark:text-gray-light">
        {getText('notFound.suggestion')}
      </p>
      
      <button 
        on:click={goHome}
        class="bg-yellow text-black shadow-md transition duration-300 ease-in-out transform hover:scale-105 px-6 py-3 rounded-full font-medium"
        aria-label={getText('notFound.returnButton')}
      >
        {getText('notFound.returnButton')}
      </button>
    </div>
  </div>