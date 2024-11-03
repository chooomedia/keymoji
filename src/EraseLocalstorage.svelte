<script>
let isDevelopment = process.env.NODE_ENV === 'development';

function clearLocalStorage() {
  localStorage.clear();
  window.location.reload();
}
</script>
  
  {#if isDevelopment}
    <button aria-label="DEV: Clear the LocalStorage" class="relative bg-powder text-black dark:bg-aubergine-dark dark:text-powderpy-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none"
      on:click={clearLocalStorage}>
      🛁
    </button>
  {/if}