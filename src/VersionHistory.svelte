<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { navigate } from "svelte-routing";
  import { versions } from './versions.js';
  import SEO from './components/SEO.svelte';

  export let currentVersion;
  let timelineHeight = 0;
  let versionItems = [];
  const DOT_HEIGHT = 42; // w-4 h-4 = 16px für jeden Timeline-Punkt

  // Berechnet die Höhe der Timeline basierend auf den Elementen und Timeline-Punkten
  function calculateTimelineHeight() {
    if (!versionItems.length) return 0;
    
    // Gesamthöhe aller Elemente berechnen
    const totalHeight = versionItems.reduce((acc, item, index) => {
      if (!item) return acc;
      const rect = item.getBoundingClientRect();
      
      // Höhe des Elements plus Höhe des Timeline-Punkts
      const elementHeight = rect.height + DOT_HEIGHT;
      
      // Wenn es das letzte Element ist, bis zur Mitte des letzten Punktes
      if (index === versionItems.length - 1) {
        return acc + (DOT_HEIGHT / 2);
      }
      
      return acc + elementHeight;
    }, 0);

    return totalHeight;
  }

  // Timeline-Höhe aktualisieren wenn sich Elemente ändern
  function updateTimelineHeight() {
    timelineHeight = calculateTimelineHeight();
  }

  onMount(() => {
    updateTimelineHeight();
    // Listener für Größenänderungen
    window.addEventListener('resize', updateTimelineHeight);
    
    // Schema injection
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Keymoji",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "softwareVersion": currentVersion,
      "releaseNotes": Object.entries(versions).map(([version, details]) => ({
        "@type": "SoftwareApplication",
        "version": version,
        "datePublished": details.date,
        "description": Object.entries(details)
          .filter(([category]) => category !== 'date')
          .map(([_, content]) => 
            Object.values(content)
              .map(data => `${data.title}: ${data.improvements.join(', ')}`)
              .join('. ')
          ).join('. ')
      }))
    });
    document.head.appendChild(script);

    return () => {
      window.removeEventListener('resize', updateTimelineHeight);
      document.head.removeChild(script);
    };
  });

  function navigateBack() {
    navigate("/", { replace: true });
  }

  // MutationObserver für dynamische Inhaltsänderungen
  let observer;
  onMount(() => {
    observer = new MutationObserver(updateTimelineHeight);
    versionItems.forEach(item => {
      if (item) {
        observer.observe(item, { 
          childList: true, 
          subtree: true, 
          attributes: true 
        });
      }
    });

    return () => observer.disconnect();
  });
</script>

<SEO 
  pageType="versions" 
  url={window.location.pathname}
  title="Version History - Keymoji"
  description="Check out the development history and changelog of Keymoji, the emoji password generator."
/>

<div class="container mx-auto px-4 py-8 mt-16">
  <div class="my-8 text-center">
    <h1 class="text-3xl font-bold text-black dark:text-white">
      Version History
    </h1>
    <button 
    on:click={navigateBack}
    class="mb-6 inline-flex items-center text-gray-600 dark:text-gray hover:text-yellow transition-all duration-300"
  >
    <span class="mr-2">←</span> Back to App
  </button>
</div>

  <div class="max-w-3xl mx-auto relative">
    <!-- Dynamische Timeline-Linie -->
    <div 
      style="left:23px; height: {timelineHeight}px;" 
      class="absolute top-2 w-0.5 bg-creme dark:bg-aubergine transition-height duration-300"
    />

    {#each Object.entries(versions).sort((a, b) => b[0].localeCompare(a[0])) as [version, details], i (version)}
      <div 
        bind:this={versionItems[i]}
        class="relative mb-12 pl-12 lg:pl-16"
        in:fly={{ y: 20, duration: 300, delay: i * 100 }}
        on:animationend={updateTimelineHeight}
      >
        <!-- Timeline dot -->
        <div class="absolute left-6 top-2 w-4 h-4 rounded-full bg-yellow border-4 border-creme dark:border-aubergine transform -translate-x-1/2"></div>
        
        <!-- Version content -->
        <div class="flex items-center gap-4 mb-4">
          
          <time class="text-sm font-normal dark:text-gray">
            {details.date}
          </time>
          <h2 class="text-xl font-semibold text-black dark:text-white inline-flex items-center">
            v{version}
            {#if version === currentVersion}
              <span class="ml-3 px-3 py-1 text-xs bg-yellow text-black rounded-full">
                Current
              </span>
            {/if}
          </h2>
        </div>

        <!-- Version details -->
        {#each Object.entries(details) as [category, content]}
          {#if category !== 'date'}
            {#each Object.entries(content) as [subcategory, data]}
              <div class="mb-6 bg-creme-50 dark:bg-aubergine-50 rounded-xl p-4">
                <h3 class="text-lg font-semibold text-black dark:text-white mb-3">
                  {data.title}
                </h3>
                <ul class="space-y-2">
                  {#each data.improvements as improvement}
                    <li class="flex items-start">
                      <span class="mr-2">•</span>
                      <span class="text-gray">
                        {improvement}
                      </span>
                    </li>
                  {/each}
                </ul>
              </div>
            {/each}
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .transition-height {
    transition: height 0.3s ease-in-out;
  }
</style>