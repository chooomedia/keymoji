<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import emojis from '../public/emojisArray.json';
  import { modalMessage, successfulStoryRequests, isModalVisible, isDisabled } from './stores.js';
  import content from './content.js';
  //import EmojiToUnicode from './EmojiToUnicode.svelte';

  export let showEmojiCodes;

  let storyInput = '';
  let randomEmojis = [];
  let emojiCount = 5;
  let showTextArea = false;
  let shouldAnimateEmojis;
  let isStoryMode = false;

  const disableDurationMs = 3000;
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseTargetURL = 'https://n8n.chooomedia.com/webhook/generate-story';
  //const targetURL = isDevelopment ? proxyURL + baseTargetURL : baseTargetURL;
  const targetURL = 'https://n8n.chooomedia.com/webhook/generate-story';
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';

  async function fetchEmojiStoryFromN8N(storyInput) {
    try {
      const response = await fetch(targetURL, {
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
        showErrorMessage(content.en.emojiDisplay.errorMessage);
        throw new Error(content.en.emojiDisplay.errorMessage);
      }

      const data = await response.json();
      const emojis = data.text.split(' ');

      successfulStoryRequests.update((requests) => [
        ...requests,
        { text: data.text, emojis: emojis.join(' ') },
      ]);
      return emojis;
    } catch (error) {
      console.log(error);
      showErrorMessage(content.en.emojiDisplay.errorStoryMessage);
      throw error;
    }
  }

  onMount(() => {
    checkAndResetDailyLimit();
    generateRandomEmojis();
  });

  function generateRandomEmojis() {
    if ($isDisabled || isDailyLimitReached()) {
      if ('vibrate' in navigator) {
          navigator.vibrate(200);
      }
      isDisabled.set(true);
      showErrorMessage(content.en.emojiDisplay.dailyLimitReachedMessage);
      return;
    }

    randomEmojis = getRandomEmojis(emojiCount);
    temporarilyDisableButton();

    copyToClipboard(randomEmojis.join(' '));
    showSuccessMessage(content.en.emojiDisplay.successMessage);
    showTextArea = false;

    incrementDailyRequestCount();
  }

  function temporarilyDisableButton() {
    isDisabled.set(true);
    setTimeout(() => isDisabled.set(false), disableDurationMs);
  }

  async function generateEmojis() {
    if (isDailyLimitReached()) {
      showErrorMessage(content.en.emojiDisplay.dailyLimitReachedMessage);
      return;
    }
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
        showSuccessMessage(content.en.emojiDisplay.successStoryMessage);
        isModalVisible.set(true);
        shouldAnimateEmojis = true;
      } else {
        // Andernfalls verwende zufällige Emojis
        randomEmojis = getRandomEmojis(emojiCount);
        copyToClipboard(randomEmojis.join(' '));
        showErrorMessage(content.en.emojiDisplay.dailyLimitReachedMessage);
      }
    } catch (error) {
      console.log(error);
      showErrorMessage(content.en.emojiDisplay.errorMessage);
    }

    incrementDailyRequestCount();
  }

  function showErrorMessage(message) {
    modalMessage.set(message);
  }

  function showSuccessMessage(message) {
    modalMessage.set(message);
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
        console.error(content.en.emojiDisplay.errorMessage, error);
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

  function setDailyRequestCount(count) {
    localStorage.setItem('dailyRequestCount', count.toString()); // Konvertieren Sie count in einen String, bevor Sie ihn speichern
  }

  function getDailyRequestCount() {
    return parseInt(localStorage.getItem('dailyRequestCount') || '0', 10); // Holen Sie sich den Wert aus dem localStorage und konvertieren Sie ihn in eine Zahl
  }

  function resetDailyRequestCount() {
    setDailyRequestCount(0);
  }

  function incrementDailyRequestCount() {
    const currentCount = getDailyRequestCount();
    setDailyRequestCount(currentCount + 1);
  }

  function checkAndResetDailyLimit() {
    const storedDate = localStorage.getItem('storedDate');
    const currentDate = new Date().toDateString();

    if (storedDate !== currentDate) {
        resetDailyRequestCount();
        localStorage.setItem('storedDate', currentDate);
    }
  }

  function isDailyLimitReached() {
    const currentCount = getDailyRequestCount(); // Da getDailyRequestCount jetzt eine Zahl zurückgibt, ist keine zusätzliche Konvertierung erforderlich
    return currentCount >= 4;
  }

  function getEmojiDisplay(emoji) {
    return showEmojiCodes ? emoji.codePointAt(0).toString(16) : emoji;
  }

  function toggleStoryMode() {
    isStoryMode = !isStoryMode;
    if (isStoryMode) {
      showTextArea = true; // Zeige das Formular, wenn der Story-Modus aktiviert wird
    }
  }

  $: if ($isModalVisible) {
    // Trigger die Animationen, nachdem das Modal angezeigt wurde
    setTimeout(() => {
      shouldAnimateEmojis = true;
    }, 1000); // Verzögern Sie die Animation um eine Sekunde (oder gewünschte Zeit)
  }
</script>

<div id="emoji-keyword-generator" class="neumorphic flex flex-col space-t-6 rounded-xl relative">
  <div id="emoji-display" class="flex flex-row h-14 justify-center items-center transform scale-125 rounded-full shadow-md transition text-white bg-black gap-2 md:px-0 px-3 mb-4 md:pt-1 md:pb-1 pb-1 border-4 border-gray z-30">
    <div class="mt-1 md:mt-0">
      {#if randomEmojis && shouldAnimateEmojis}
      {#each randomEmojis.filter(isVisible) as emoji, index (emoji)}
        <span class="text-m md:text-2xl" in:fly={{y: 100, duration: 300, delay: index * 300}}>
          {getEmojiDisplay(emoji, index)}
        </span>
      {/each}
      {/if}
    </div>
  </div>

  <div class="flex flex-wrap justify-center items-center">
    <h2 class="mt-1 text-xs text-center dark:text-white z-10">
      {#each content.en.index.pageInstruction as instruction}
        <p>{instruction}</p>
      {/each}
    </h2>  
  </div>

  <div class="flex flex-auto items-baseline md:w-100 space-x-4 my-1 pt-1 dark:text-white">
    <label for="emojiCount">Level</label>
    <input type="range" id="emojiCount" min="4" max="9" bind:value={emojiCount} class="md:w-100 w-screen mt-3 appearance-none rounded-full bg-gray h-2 transition-all" />
    <span>{emojiCount}</span>
  </div>

  {#if showTextArea}
    <textarea bind:value={storyInput} placeholder="🤔 Share a beautiful memory in a sentence..." class="appearance-none block w-full text-gray-dark rounded-2xl py-3 px-4 md:mb-3 leading-tight transition duration-300 ease-in-out transform dark:bg-aubergine-dark dark:text-white focus:outline-none focus:bg-white" on:keydown={handleTextareaKeydown} minlength="40"></textarea>
    <p class="text-sm text-gray text-left py-3" aria-label="information">{content.en.emojiDisplay.dataPrivacyProcessingInfo}</p>
    <button on:click={clearInput} class="bg-white dark:bg-aubergine-dark text-gray-dark dark:text-white transition duration-300 ease-in-out transform hover:scale-105 px-3 py-3 rounded-full">
      {content.en.emojiDisplay.clearButton}
    </button>
  {/if}

  <div class="flex space-x-4 mt-3 mb-2">
    {#if isStoryMode}
      <button on:click={() => generateEmojis(true)} class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full">
        {content.en.emojiDisplay.storyButtonClicked}
      </button>
    {:else}
      <button on:click={toggleStoryMode} class="bg-powder text-black dark:bg-aubergine-dark dark:text-powder shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full">
        {content.en.emojiDisplay.storyButton}
      </button>
    {/if}
    
    <button
      on:click={generateRandomEmojis}   
      class="bg-yellow text-black shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-1/2 py-3 rounded-full"
      class:opacity-50={$isDisabled}
      class:cursor-not-allowed={$isDisabled}
      disabled={$isDisabled}>
      {content.en.emojiDisplay.randomButton}
    </button>

  </div>
</div>
