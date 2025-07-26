<script>
    import { localUserCounter } from './stores/appStores';
    import { onMount } from 'svelte';
  
    let error = null;
    let loading = true;
    const formatter = new Intl.NumberFormat(document.documentElement.lang || 'de-DE');
  
    onMount(() => {
        // Loading state management
        const timer = setTimeout(() => {
            if ($localUserCounter === 0) {
                error = 'Timeout';
                loading = false;
            }
        }, 5000);
  
        // Subscribe to counter changes
        const unsubscribe = localUserCounter.subscribe(value => {
            if (value > 0) {
                loading = false;
                error = null;
            }
        });

        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    });
</script>

<div id="usercounter"
    class="flex items-center justify-center"
    aria-live="polite"
>
    <span aria-label="User interaction counter">
        {#if error}
            <div class="error text-red-500">⚠️ Offline</div>
        {:else if loading}
            <div class="animate-pulse">
                <span class="inline-block w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></span>
            </div>
        {:else if $localUserCounter > 0}
            <div class="counter font-bold">{formatter.format($localUserCounter)}</div>
        {/if}
    </span>
</div>