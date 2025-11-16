<!-- src/routes/versions/+page.svelte -->
<!-- Versions Page - SvelteKit Pattern -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from '../+layout.svelte';
    import VersionHistoryComponent from '../VersionHistory.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const VersionHistory = VersionHistoryComponent;
</script>

<RootLayout routeSlug="versions">
    <VersionHistory />
</RootLayout>

