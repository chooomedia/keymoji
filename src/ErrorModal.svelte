<script>
  import { fade } from 'svelte/transition';
  import { modalMessage } from './stores.js';

  let showMessage = false;
  let timeoutId;

  $: message = $modalMessage; // Hier den Store-Wert in einer Variable speichern

  modalMessage.subscribe(value => {
    if (value) {
      showMessage = true;
      let duration = value.split(' ').length * 240;
      duration = duration > 2400 ? 2400 : duration;

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
<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-95 pb-4" transition:fade={{ duration: 300 }}>
    <div class="relative bg-transparent text-center z-50">
      <h1 class="text-white md:text-2xl text-xl font-bold">
        {message} <!-- Hier die Variable verwenden -->
      </h1>
    </div>
    <button class="bg-blue transition transform hover:scale-105 fixed top-4 right-4 py-3 px-5 rounded-full text-white border-4 border-aubergine" on:click={closeMessage}>✖</button>
</div>
{/if}
