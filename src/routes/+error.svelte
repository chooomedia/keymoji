<!-- src/routes/+error.svelte -->
<!-- Error Page (404) - SvelteKit Pattern -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from './+layout.svelte';
    import NotFoundComponent from './NotFound.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const NotFound = NotFoundComponent;
</script>

<RootLayout routeSlug="notFound">
    <NotFound />
</RootLayout>

