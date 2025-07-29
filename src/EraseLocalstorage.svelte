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
    <button aria-label="DEV: Clear the LocalStorage" class="btn btn-default btn-menu"
        on:click={clearLocalStorage}>
        🛁
    </button>
{/if}