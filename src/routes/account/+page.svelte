<!-- src/routes/account/+page.svelte -->
<!-- Account Page - SvelteKit Pattern -->
<script lang="ts">
    // Import components with explicit variable assignment (Webpack fix)
    import RootLayoutComponent from '../+layout.svelte';
    import AccountManagerComponent from '../AccountManager.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const RootLayout = RootLayoutComponent;
    const AccountManager = AccountManagerComponent;
</script>

<RootLayout routeSlug="account">
    <AccountManager />
</RootLayout>

