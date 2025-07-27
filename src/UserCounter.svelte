<!-- src/UserCounter.svelte -->
<script>
    import { userCounter } from './stores/appStores.js';
    
    // Formatter basierend auf der Dokumentsprache
    $: formatter = new Intl.NumberFormat(
        document.documentElement.lang || 'en-US'
    );
    
    // Formatierte Zahl mit Fallback
    $: formattedCount = $userCounter.value > 0 
        ? formatter.format($userCounter.value)
        : '';
</script>

<span 
    id="usercounter"
    class="inline-flex items-center justify-center"
    aria-live="polite"
    aria-atomic="true"
>
    {#if $userCounter.hasError}
        <!-- Nur anzeigen wenn absolut kein Wert verfügbar ist -->
        <span class="text-gray-500 dark:text-gray-400" aria-label="Counter unavailable">
            <span class="text-xs">•••</span>
        </span>
    {:else if $userCounter.isLoading && !$userCounter.isCached}
        <!-- Nur Loading zeigen wenn kein Cache vorhanden -->
        <span class="animate-pulse" aria-label="Loading visitor count">
            <span class="inline-block w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></span>
        </span>
    {:else if formattedCount}
        <!-- Zeige Zahl (aus Cache oder Live) -->
        <span 
            class="font-medium transition-opacity duration-300"
            class:opacity-75={$userCounter.isCached}
            aria-label="Visitor count: {formattedCount}"
            title={$userCounter.isCached ? 'Cached value' : 'Live value'}
        >
            {formattedCount}
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