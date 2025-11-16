<!-- src/routes/blog/[slug]/+page.svelte -->
<!-- Blog Post Page - SvelteKit Pattern -->
<!-- [slug] ist ein dynamischer Parameter -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from '../../+layout.svelte';
    import BlogPostComponent from '../../../components/Features/BlogPost.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const BlogPost = BlogPostComponent;
    
    interface Props {
        slug?: string;
    }
    
    let { slug = '' }: Props = $props();
</script>

<RootLayout routeSlug="blog">
    <BlogPost {slug} />
</RootLayout>

