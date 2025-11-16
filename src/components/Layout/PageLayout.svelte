<!-- src/components/Layout/PageLayout.svelte -->
<!-- Wrapper-Komponente für Rückwärtskompatibilität -->
<!-- Verwendet intern AppLayout mit JSON-Konfiguration -->
<script lang="ts">
    import AppLayoutComponent from './AppLayout.svelte';
    
    import type { Snippet } from 'svelte';
    
    // Props für die Seite (bleiben gleich für Rückwärtskompatibilität)
    interface Props {
        pageTitle?: string;
        pageDescription?: string;
        titleClass?: string;
        showIntroSection?: boolean;
        introTitle?: string;
        introText?: string;
        routeSlug?: string;
        children?: Snippet;
        beforeHeader?: Snippet; // Svelte 5: camelCase für Snippet-Namen (keine Bindestriche)
        header?: Snippet;
        beforeContent?: Snippet; // Svelte 5: camelCase für Snippet-Namen (keine Bindestriche)
        footer?: Snippet;
    }
    
    let {
        pageTitle = '',
        pageDescription = '',
        titleClass = 'text-gray',
        showIntroSection = false,
        introTitle = '',
        introText = '',
        routeSlug = 'index',
        children,
        beforeHeader,
        header,
        beforeContent,
        footer
    }: Props = $props();
    
    // Bestimme Route-Slug basierend auf aktueller Route (falls nicht übergeben)
    import { onMount } from 'svelte';
    let currentRouteSlug = $state(routeSlug);
    
    // Webpack/Svelte 5: stabile Komponenten-Referenz
    const AppLayout = AppLayoutComponent;
    
    onMount(() => {
        if (!routeSlug || routeSlug === 'index') {
            // Versuche Route-Slug aus URL zu bestimmen
            const path = typeof window !== 'undefined' ? window.location.pathname : '';
            const pathParts = path.split('/').filter(Boolean);
            if (pathParts.length > 0) {
                const slug = pathParts[pathParts.length - 1];
                // Mapping von URL-Pfaden zu Route-Slugs
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

<!-- Verwende AppLayout mit allen Props -->
<AppLayout 
    routeSlug={currentRouteSlug}
    {pageTitle} 
    {pageDescription}
    {titleClass}
    {showIntroSection}
    {introTitle}
    {introText}
    {children}
    before-header={beforeHeader}
    {header}
    before-content={beforeContent}
    {footer}
/> 