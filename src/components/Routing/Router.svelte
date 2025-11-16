<!-- src/components/Routing/Router.svelte -->
<!-- Router-Wrapper für Svelte 5 -->
<!-- Wrapper-Komponente für Route-Komponenten (Route-Komponenten machen das Matching selbst) -->
<script lang="ts">
    import type { Snippet } from 'svelte';
    
    interface Props {
        children?: Snippet;
    }
    
    let { children }: Props = $props();
</script>

<!-- Router ist nur ein Wrapper - Route-Komponenten machen das Matching selbst -->
{#if children}
  {@render children()}
{/if}
