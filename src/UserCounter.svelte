<script>
    import { localUserCounter } from './stores/appStores';
    import { onMount } from 'svelte';
  
    let isLoading = true;
    const formatter = new Intl.NumberFormat(
      document.documentElement.lang || 'de-DE'
    );
  
    onMount(() => {
      const unsubscribe = localUserCounter.subscribe(value => {
        isLoading = value === 0;
      });
      return unsubscribe;
    });
</script>

<div id="usercounter"
    class="flex items-center justify-center"
    aria-live="polite"
>
    <span aria-label="User interaction counter">
        {#if $localUserCounter > 0}
            {formatter.format($localUserCounter)}
        {:else}
            <div class="animate-pulse">...</div>
        {/if}
    </span>
</div>