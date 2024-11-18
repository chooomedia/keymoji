<script>
let isDevelopment = process.env.NODE_ENV === 'development';

function clearLocalStorage() {
  localStorage.clear();
  window.location.reload();
}
</script>
  
  {#if isDevelopment}
    <button aria-label="DEV: Clear the LocalStorage" class="btn btn-default btn-md"
      on:click={clearLocalStorage}>
      🛁
    </button>
  {/if}