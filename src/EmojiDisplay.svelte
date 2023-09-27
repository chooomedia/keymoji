<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import emojis from '../public/emojisArray.json';
  import axios from 'axios';

  let storyInput = '';
  let randomEmojis = [];
  let showRandomEmojis = true;
  let emojiCount = 7;
  let isLoading = false;
  let temporaryMessage = '';
  let showTextArea = false;
  let randomButtonText = '✨ Random';

  const api = axios.create({
    baseURL: 'https://api.openai.com',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    }
  });

  async function generateEmojis(fromStory = false) {
    isLoading = true;
    temporaryMessage = '🤖 Generating...';

    if (fromStory && storyInput.trim() === '') {
        showTextArea = true;
        isLoading = false;
        return;
    }

    if (!fromStory) {
        showTextArea = false;
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (fromStory) {
            const response = await api.post('/v1/engines/davinci/completions', {
                prompt: "Using only emojis, represent the following story in " + emojiCount + " emojis: " + storyInput + ". Ensure no text is used."
            });

            if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].text) {
                // Überprüfen, ob die Antwort Emojis enthält und kein alphanumerischer Text
                if (/^[^\w\s]+$/.test(response.data.choices[0].text)) {
                    randomEmojis = response.data.choices[0].text.split(' ').slice(0, emojiCount);
                } else {
                    console.error('Returned text is not an emoji sequence.');
                    temporaryMessage = '🤖 Error - Invalid response. Please try again.';
                    isLoading = false;
                    return;
                }
            } else {
                console.error('Error - Please try again or write us a Message 🤖');
                temporaryMessage = '🤖 Error - Please try again or write us a Message 🤖';
                isLoading = false;
                return;
            }

        } else {
            randomEmojis = getRandomEmojis(emojiCount);
            randomButtonText = '💾 Copied!';
            await new Promise(resolve => setTimeout(resolve, 1000));
            randomButtonText = '✨ Random';
        }

        copyToClipboard(randomEmojis.join(' '));
    } catch (error) {
        console.error('😔 Error:', error);
    }
    isLoading = false;
  }

  // Diese Funktion generiert zufällige Emojis
  function getRandomEmojis(count) {
    const randomIndices = Array.from({ length: emojis.emojis.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    return randomIndices.map((index) => emojis.emojis[index]);
  }

  function copyToClipboard(text) {
    // Leerzeichen zwischen Emojis entfernen
    text = text.replace(/ /g, '');

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
  }

  function clearInput() {
    storyInput = '';
  }

  // Initialisiere das Captcha bei Komponentenmontage
  onMount(() => {
    generateEmojis(false);
  });
</script>

<div id="emoji-keyword-generator" class="neumorphic flex flex-col space-y-4 rounded-xl">
  {#if showRandomEmojis}
  <div id="emoji-display" class="transform scale-125 rounded-full shadow-md transition text-white bg-black gap-2 p-3 md:px-0 px-3 mb-4 border-4 border-gray" style="grid-template-columns: repeat({emojiCount}, 1fr);">
    {#if isLoading}
      <div class="md:w-80 md:ml-8">{temporaryMessage}</div>
    {:else}
      {#each randomEmojis as emoji (emoji)}
        <span class="text-m md:text-2xl" in:fade>
          {emoji}
        </span>
      {/each}
    {/if}
  </div>
  {/if}

  <div class="flex flex-auto md:w-100 space-x-4 my-1 pt-1 dark:text-white">
    <label for="emojiCount" class="text-xl">Level</label>
    <input type="range" id="emojiCount" min="7" max="12" bind:value={emojiCount} class="md:w-80 w-screen mt-3 appearance-none rounded-full bg-gray h-2 transition-all" />
    <span class="text-xl">{emojiCount}</span>
  </div>

  {#if showTextArea}
    <textarea bind:value={storyInput} placeholder="🤔 Share a beautiful memory in a sentence..." class="neumorphic p-4 w-full rounded-2xl text-gray-dark border-2 border-gray-light dark:border-aubergine-dark"></textarea>
    <button on:click={clearInput} class="neumorphic bg-gray-light dark:bg-aubergine-dark text-gray-dark dark:text-white transition transform hover:scale-105 py-3 px-4 rounded-full shadow-md">
      ✖️ Clear
    </button>
  {/if}

  <div class="flex space-x-4 my-4 pb-3">
    <button on:click={() => generateEmojis(true)} class="neumorphic bg-blue hover:scale-105 transition transform hover:scale-105 w-1/2 text-white py-3 px-4 rounded-full shadow-md">
      📕 Story
    </button>
    <button on:click={() => generateEmojis(false)} class="neumorphic bg-blue hover:scale-105 transition transform hover:scale-105 w-1/2 text-white py-3 px-4 rounded-full shadow-md">
      {randomButtonText}
    </button>
  </div>
</div>

<style>
  #emoji-display {
    height: 4rem; 
    display: grid; 
    justify-items: center; 
    align-items: center;
  }

  @media screen and (max-width:672px) {
    #emoji-display {
      height: auto;
      display: block;
      text-align: center;
    }
  }
</style>