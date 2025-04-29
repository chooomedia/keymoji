<script>
    import { localUserCounter } from './stores/appStores';
    import { onMount } from 'svelte';
  
    let error = null;
    const formatter = new Intl.NumberFormat(document.documentElement.lang || 'de-DE');
  
    onMount(() => {
      const timer = setTimeout(() => {
        if ($localUserCounter === 0) error = 'Timeout';
      }, 5000);
  
      return () => clearTimeout(timer);
    });
</script>

<div id="usercounter"
    class="flex items-center justify-center"
    aria-live="polite"
>
    <span aria-label="User interaction counter">
        {#if error}
            <div class="error">⚠️ Offline</div>
        {:else if $localUserCounter > 0}
            <div class="counter">{formatter.format($localUserCounter)}</div>
        {:else}
            <div class="animate-pulse">...</div>
        {/if}
    </span>
</div>