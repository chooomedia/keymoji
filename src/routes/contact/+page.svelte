<!-- src/routes/contact/+page.svelte -->
<!-- Contact Page - SvelteKit Pattern -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from '../+layout.svelte';
    import ContactFormComponent from '../ContactForm.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const ContactForm = ContactFormComponent;
</script>

<RootLayout routeSlug="contact">
    <ContactForm />
</RootLayout>

