<!-- src/routes/+layout.svelte -->
<!-- Root Layout für alle Routes (SvelteKit Pattern) -->
<!-- Verwendet AppLayout für Header, Footer, Modals -->
<!-- 
    SvelteKit Pattern: +layout.svelte wird automatisch für alle Routes verwendet
    Da wir svelte-routing verwenden, wrappen wir Routes manuell mit diesem Layout
-->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import AppLayoutComponent from '../components/Layout/AppLayout.svelte';
    
    // Assign to variable for template use (helps Webpack resolve)
    const AppLayout = AppLayoutComponent;
    
    import type { Snippet } from 'svelte';
    
    // Props für Layout (SvelteKit Pattern)
    interface Props {
        routeSlug?: string;
        pageTitle?: string;
        pageDescription?: string;
        children?: Snippet;
    }
    
    let {
        routeSlug = 'index',
        pageTitle = '',
        pageDescription = '',
        children
    }: Props = $props();
    
    // Bestimme Route-Slug aus aktueller URL (falls nicht übergeben)
    import { onMount } from 'svelte';
    let currentRouteSlug = $state(routeSlug);
    
    onMount(() => {
        if (!routeSlug || routeSlug === 'index') {
            const path = typeof window !== 'undefined' ? window.location.pathname : '';
            const pathParts = path.split('/').filter(Boolean);
            if (pathParts.length > 0) {
                const slug = pathParts[pathParts.length - 1];
                const routeMap: Record<string, string> = {
                    'contact': 'contact',
                    'account': 'account',
                    'versions': 'versions',
                    'privacy': 'static',
                    'legal': 'static',
                    'blog': 'blog'
                };
                currentRouteSlug = routeMap[slug] || 'index';
            }
        }
    });
</script>

<!-- Root Layout mit AppLayout -->
<!-- Slot für Child-Routes (SvelteKit Pattern) -->
<AppLayout 
    routeSlug={currentRouteSlug}
    {pageTitle} 
    {pageDescription}
    {children}
/>

