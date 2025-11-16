<!-- src/routes/blog/+page.svelte -->
<!-- Blog Grid Page - SvelteKit Pattern -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from '../+layout.svelte';
    import BlogGridComponent from '../../components/Features/BlogGrid.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const BlogGrid = BlogGridComponent;
</script>

<RootLayout routeSlug="blog">
    <BlogGrid />
</RootLayout>

