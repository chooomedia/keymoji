<script>
  import { fade } from 'svelte/transition';
  import { modalMessage } from './stores.js';

  let showMessage = false;
  let timeoutId;

  modalMessage.subscribe(value => {
    if (value) {
      showMessage = true;
      let duration = value.split(' ').length * 250;
      duration = duration > 2800 ? 2800 : duration;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        closeMessage();
      }, duration);
    }
  });

  function closeMessage() {
    showMessage = false;
    modalMessage.set('');
    clearTimeout(timeoutId);
  }
</script>

{#if showMessage}
<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-95 pb-10" transition:fade={{ duration: 300 }}>
    <div class="relative bg-transparent text-center z-50">
      <h1 class="text-white text-2xl font-bold">
        {$modalMessage}
      </h1>
    </div>
    <button class="bg-blue transition transform hover:scale-105 fixed top-4 right-4 py-2 px-4 rounded-full text-white" on:click={closeMessage}>✖</button>
</div>
{/if}