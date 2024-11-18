<script>
  import { fade } from 'svelte/transition';
  import { modalMessage, isModalVisible } from './stores.js';

  $: message = $modalMessage;
  let showMessage = false;

  modalMessage.subscribe(value => {
    if (value) {
      showMessage = true;
      isModalVisible.set(true);
      let duration = value.split(' ').length * 2000;
      duration = duration > 2000 ? 2000 : duration;

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
    <button aria-label="Close the message popup" class="w-16 btn btn-fixed btn-md top-5 right-4" on:click={closeMessage}>❌</button>
</div>
{/if}