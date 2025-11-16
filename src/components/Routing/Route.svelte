<!-- src/components/Routing/Route.svelte -->
<!-- Route-Komponente für Svelte 5 -->
<script lang="ts">
    import { currentLocation, subscribe } from '../../utils/routing';
    import { matchRoute } from '../../utils/routeMatcher';
    
    import type { Snippet } from 'svelte';
    
    interface Props {
        path?: string;
        component?: any;
        exact?: boolean;
        children?: Snippet<[params: Record<string, string>]>;
    }
    
    let { path = '*', component, exact = false, children }: Props = $props();
    
    // Reaktive Location-Variable, die über subscribe aktualisiert wird
    let reactiveLocation = $state(currentLocation || (typeof window !== 'undefined' ? window.location.pathname : '/'));
    
    // Abonniere Location-Änderungen für Reaktivität
    $effect(() => {
        const unsubscribe = subscribe(() => {
            reactiveLocation = currentLocation || (typeof window !== 'undefined' ? window.location.pathname : '/');
        });
        
        // Initial setzen
        reactiveLocation = currentLocation || (typeof window !== 'undefined' ? window.location.pathname : '/');
        
        return () => {
            unsubscribe();
        };
    });
    
    const matchResult = $derived.by(() => {
        return matchRoute(path, reactiveLocation, exact);
    });
    
    const isMatch = $derived(matchResult.isMatch);
    const params = $derived(matchResult.params);
</script>

{#if isMatch}
    {#if component}
        {@const Component = component}
        <Component {...params} />
    {:else if children}
        {@render children(params)}
    {/if}
{/if}
