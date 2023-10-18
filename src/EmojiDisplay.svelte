<script>
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import emojis from '../public/emojisArray.json';
  import { modalMessage, successfulStoryRequests } from './stores.js';

  let storyInput = '';
  let randomEmojis = [];
  let emojiCount = 7;
  let showTextArea = false;

  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  const targetURL = 'https://n8n.chooomedia.com/webhook/generate-story';

  async function fetchEmojiStoryFromN8N(storyInput) {
    try {
      const response = await fetch(proxyURL + targetURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          emojiCount: emojiCount,
          storyInput: storyInput,
        }),
      });

      if (!response.ok) {
        modalMessage.set('Error, no answer from server 🌀');
        throw new Error('Failed to generate emoji story.');
      }

      const data = await response.json();
      const emojis = data.text.split(' '); // Trenne die Emojis von der Server-Antwort

      // Speichere die erfolgreiche Story-Anfrage in './stores.js'
      successfulStoryRequests.update((requests) => [
        ...requests,
        { text: data.text, emojis: emojis.join(' ') }, // Verwende das geteilte Emoji-Array
      ]);
      
      return emojis; // Gib die Emojis zurück
    } catch (error) {
      modalMessage.set('Error, no answer from server 🌀');
      throw error;
    }
  }

  onMount(generateRandomEmojis);

  function generateRandomEmojis() {
    randomEmojis = getRandomEmojis(emojiCount);
    copyToClipboard(randomEmojis.join(' '));
    modalMessage.set('Success, copied into your Clipboard 💾');
    showTextArea = false;
  }

  async function generateEmojis() {
    if (!storyInput.trim()) {
      showTextArea = true;
      return;
    }

    try {
      const response = await fetchEmojiStoryFromN8N(storyInput);
      if (response.length > 0) {
        // Verwende die Server-Antwort, wenn Emojis verfügbar sind
        randomEmojis = response;
        copyToClipboard(randomEmojis.join(' '));
        modalMessage.set('Success, Emoji story generated 🤖');
      } else {
        // Andernfalls verwende zufällige Emojis
        randomEmojis = getRandomEmojis(emojiCount);
        copyToClipboard(randomEmojis.join(' '));
        modalMessage.set('Success, copied into your Clipboard 💾');
      }
    } catch (error) {
      console.log (error);
      modalMessage.set('Oops, something went wrong 🤖');
    }
  }

  function getRandomEmojis(count) {
    return [...emojis.emojis].sort(() => Math.random() - 0.5).slice(0, count);
  }
  
  async function copyToClipboard(storyResult) {
    const cleanResult = storyResult.replace(/ /g, '');
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(cleanResult);
      } catch (error) {
        console.error("Failed to copy to clipboard", error);
      }
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = cleanResult;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  function clearInput() {
    storyInput = '';
  }

  function isVisible(emoji) {
    return emoji && emoji.trim() !== '';
  }

  function handleTextareaKeydown(e) {
    if (e.key === "Enter") {
      generateEmojis();
    }
  }
</script>

<div id="emoji-keyword-generator" class="neumorphic flex flex-col space-y-4 rounded-xl">
  {#if randomEmojis}
  <div id="emoji-display" class="flex flex-row justify-center items-center transform scale-125 rounded-full shadow-md transition text-white bg-black gap-2 md:px-0 px-3 mb-4 md:pt-2 pt-2 md:pb-1 pb-1 border-4 border-gray z-40">
    <div class="mt-1 md:mt-0">
      {#each randomEmojis.filter(isVisible) as emoji (emoji)}
        <span class="text-m md:text-2xl" in:slide={{ duration: 300 }}>
          {emoji}
        </span>
      {/each}
    </div>
  </div>
  {/if}

  <div class="flex flex-auto md:w-100 space-x-4 my-1 pt-1 dark:text-white">
    <label for="emojiCount" class="text-xl">Level</label>
    <input type="range" id="emojiCount" min="7" max="12" bind:value={emojiCount} class="md:w-100 w-screen mt-3 appearance-none rounded-full bg-gray h-2 transition-all" />
    <span class="text-xl">{emojiCount}</span>
  </div>

  {#if showTextArea}
    <textarea bind:value={storyInput} placeholder="🤔 Share a beautiful memory in a sentence..." class="neumorphic p-4 w-full rounded-2xl text-gray-dark border-2 border-gray-light dark:border-aubergine-dark" on:keydown={handleTextareaKeydown} minlength="40"></textarea>
    <button on:click={clearInput} class="neumorphic bg-gray-light dark:bg-aubergine-dark text-gray-dark dark:text-white transition transform hover:scale-105 py-3 pt-4 rounded-full shadow-md">
      ✖️ Clear
    </button>
  {/if}

  <div class="flex space-x-4 my-4 pb-3">
    <button on:click={() => generateEmojis(true)} class="neumorphic bg-blue hover:scale-105 transition transform hover:scale-105 w-1/2 text-white py-3 pt-4 rounded-full shadow-md">
      📕 Story
    </button>
    <button on:click={generateRandomEmojis} class="neumorphic bg-yellow hover:scale-105 transition transform hover:scale-105 w-1/2 text-black py-3 pt-4 rounded-full shadow-md">
      *️⃣ Random
    </button>
  </div>
</div>