<script>
let isDevelopment = process.env.NODE_ENV === 'development';

function clearLocalStorage() {
  localStorage.clear();
  window.location.reload();
}
</script>
  
  {#if isDevelopment}
    <button class="fixed bottom-4 left-4 bg-blue text-white py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none z-20"
      on:click={clearLocalStorage}>
      🛁 Clear LS
    </button>
  {/if}