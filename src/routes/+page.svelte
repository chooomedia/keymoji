<!-- src/routes/+page.svelte -->
<!-- Root Page (Home/Index) - SvelteKit Pattern -->
<!-- Diese Datei wird für die Root-Route "/" verwendet -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from './+layout.svelte';
    import IndexComponent from '../index.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const Index = IndexComponent;
</script>

<RootLayout routeSlug="index">
    <Index />
</RootLayout>
