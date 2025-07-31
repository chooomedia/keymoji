<script>
import { isDebugMode } from './utils/environment.js';

function clearLocalStorage() {
  localStorage.clear();
  window.location.reload();
}

// Always show in development for now
let showEraseButton = true;
</script>
  
{#if showEraseButton}
    <Button variant="default" size="menu"
        on:click={clearLocalStorage}>
        🛁
    </Button>
{/if}