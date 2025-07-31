<!-- src/UserCounter.svelte -->
<script>
    import { userCounter, refreshUserCounter } from '../../stores/appStores.js';
    
    // Formatter basierend auf der Dokumentsprache
    $: formatter = new Intl.NumberFormat(
        document.documentElement.lang || 'en-US'
    );
    
    // Formatierte Zahl mit Fallback - robustere Implementierung
    $: formattedCount = $userCounter && $userCounter.value > 0 
        ? formatter.format($userCounter.value)
        : '';
    
    // Manual refresh function
    async function handleRefresh() {
        console.log('🔄 Manual counter refresh triggered');
        await refreshUserCounter();
    }
</script>

<span 
    id="usercounter"
    class="inline-flex items-center justify-center gap-1"
    aria-live="polite"
    aria-atomic="true"
>
    {#if $userCounter && $userCounter.hasError}
        <!-- Nur anzeigen wenn absolut kein Wert verfügbar ist -->
        <span class="text-gray-500 dark:text-gray-400" aria-label="Counter unavailable">
            <span class="text-xs">•••</span>
        </span>
        <button 
            on:click={handleRefresh}
            class="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label="Refresh counter"
            title="Refresh counter"
        >
            🔄
        </button>
    {:else if $userCounter && $userCounter.isLoading && !$userCounter.isCached}
        <!-- Nur Loading zeigen wenn kein Cache vorhanden -->
        <span class="animate-pulse" aria-label="Loading visitor count">
            <span class="inline-block w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></span>
        </span>
    {:else if formattedCount}
        <!-- Zeige Zahl (aus Cache oder Live) -->
        <span 
            class="font-medium transition-opacity duration-300"
            class:opacity-75={$userCounter && $userCounter.isCached}
            aria-label="Visitor count: {formattedCount}"
            title={$userCounter && $userCounter.isCached ? 'Cached value' : 'Live value'}
        >
            {formattedCount}
        </span>
        {#if $userCounter && $userCounter.isCached}
            <button 
                on:click={handleRefresh}
                class="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                aria-label="Refresh counter"
                title="Refresh counter"
            >
                🔄
            </button>
        {/if}
    {:else}
        <!-- Fallback wenn kein Store verfügbar ist -->
        <span class="text-gray-500 dark:text-gray-400" aria-label="Counter loading">
            <span class="text-xs">•••</span>
        </span>
    {/if}
</span>

<style>
    /* Smooth transitions */
    span {
        transition: opacity 0.3s ease-in-out;
    }
    
    /* Subtle indication for cached values */
    .opacity-75 {
        opacity: 0.85;
    }
</style>