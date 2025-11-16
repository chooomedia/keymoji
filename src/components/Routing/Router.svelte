<!-- src/components/Routing/Router.svelte -->
<!-- Router-Wrapper für Svelte 5 -->
<!-- Wrapper-Komponente für Route-Komponenten (Route-Komponenten machen das Matching selbst) -->
<script lang="ts">
    // Keine Props benötigt - Router ist nur ein Wrapper
    // Svelte 5: Komponente wird automatisch als Default exportiert
</script>

<!-- Router ist nur ein Wrapper - Route-Komponenten machen das Matching selbst -->
<slot />
