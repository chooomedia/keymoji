<script>
  import { fade } from 'svelte/transition';
  import { modalMessage, isModalVisible } from './stores.js';

  $: message = $modalMessage;
  let showMessage = false;

  modalMessage.subscribe(value => {
    if (value) {
      showMessage = true;
      isModalVisible.set(true);
      let duration = value.split(' ').length * 1800;
      duration = duration > 1800 ? 1800 : duration;

      setTimeout(() => {
        showMessage = false;
        isModalVisible.set(false);
      }, duration);
    }
  });

  function closeMessage() {
    showMessage = false;
    modalMessage.set('');
    isModalVisible.set(false);
  }
</script>

{#if showMessage}
<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-95 pb-4" transition:fade={{ duration: 320 }}>
    <div class="relative bg-transparent text-center z-50">
      <h1 class="text-white md:text-2xl text-xl font-bold p-2">
        {message}
      </h1>
    </div>
    <button class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder transition transform hover:scale-105 fixed top-4 right-4 py-3 px-5 rounded-full border-4 border-aubergine" on:click={closeMessage}>✖</button>
</div>
{/if}
