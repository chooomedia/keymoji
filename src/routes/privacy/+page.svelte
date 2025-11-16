<!-- src/routes/privacy/+page.svelte -->
<!-- Privacy Page - SvelteKit Pattern -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from '../+layout.svelte';
    import StaticPageComponent from '../StaticPage.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const StaticPage = StaticPageComponent;
</script>

<RootLayout routeSlug="static">
    <StaticPage slug="privacy" />
</RootLayout>

