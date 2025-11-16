<script>
    import ButtonComponent from "../components/UI/Button.svelte";
    
    // Svelte 5 / Webpack: stabile Komponenten-Referenz
    const Button = ButtonComponent;
</script>

<!-- GitButton für Header Integration -->
<Button variant="default" size="md" href="https://github.com/chooomedia/keymoji">
    <span class="flex items-center text-base">
        <span class="mr-3">⭐</span>
        <span class="text-base">Star on Github</span>
    </span>
</Button>