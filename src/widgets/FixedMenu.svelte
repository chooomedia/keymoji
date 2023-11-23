<script>
  import { slide } from 'svelte/transition';
  import { elasticIn, elasticOut } from 'svelte/easing';
  import content from '../content.js';
  import EraseLocalstorage from '../EraseLocalstorage.svelte';
  import { darkMode, showDonateMenu, showShareMenu } from '../stores.js';

  export let align;

  let showMenu = false;
  let selectedLink = undefined;

  function toggleDarkMode() {
    darkMode.update(currentMode => !currentMode);
  }

  function toggleMenu(menuType) {
    if (menuType === 'share') {
      if ($showDonateMenu) showDonateMenu.set(false);
      showMenu = !showMenu;
    } else if (menuType === 'donate') {
      if (showMenu) showMenu = false;
      showDonateMenu.update(v => !v);
    }
  }

  function selectLink(links, id) {
    const link = links.find(o => o.id === id);
    if (selectedLink === link) {
      selectedLink = undefined;
    } else {
      selectedLink = link;
    }
  }

  function closeAll() {
    selectedLink = undefined;
    showMenu = false;
    showDonateMenu.set(false);
  }
</script>

{#if showMenu }
  <button class="overlay" on:click={closeAll}></button>
{/if}

<div class="fixed bottom-4 z-20 justify-between items-center">
  {#if showMenu }
    <div class="w-32 md:mx-7 md:ml-9 mx-auto rounded-t-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-10 pt-2" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
      {#each content.en.shareButtons.links as link, index}
        <a in:slide={{ y: -5, duration: 380, delay: 100, elasticIn }} out:slide={{ y: 5, duration: 380, delay: 100, elasticOut }} href={link.href} target={link.target} class="flex flex-wrap text-black dark:text-white block md:px-4 px-2 py-2 text-sm w-full text-left hover:bg-gray group hover:text-white" role="menuitem" class:active={selectedLink === link} rel={link.rel} title={link.title} on:click={() => { selectLink(content.en.shareButtons.links, link.id)}}>
          <svg class="w-5 h-5 mr-1 transition" viewBox="0 0 24 24" fill="currentColor" alt={link?.alt}>
            {@html link?.svgContent}
          </svg>
          <p class="text-sm text-gray dark:text-white group-hover:text-white">{link?.title}</p>
        </a>
      {/each}
    </div>
  {/if}

  {#if $showDonateMenu }
    <div class="w-32 md:mx-7 md:ml-9 mx-auto md:fixed md:right-3 md:bottom-71 rounded-t-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-10 pt-2" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
      {#each content.en.donateButton.links as dlink, index}
        <a in:slide={{ y: -5, duration: 380, delay: 100, elasticIn }} out:slide={{ y: 5, duration: 380, delay: 100, elasticOut }} href={dlink.href} target={dlink.target} class="flex flex-wrap text-black dark:text-white block md:px-4 px-2 py-2 text-sm w-full text-left hover:bg-gray group hover:text-white" role="menuitem" class:active={selectedLink === dlink} rel={dlink.rel} title={dlink.title} on:click={() => { selectLink(content.en.donateButton.links, dlink.id)}}>
          <svg class="w-5 h-5 mr-1 transition" viewBox="0 0 32 32" fill="currentColor" alt={dlink?.alt}>
            {@html dlink?.svgContent}
          </svg>
          <p class="text-sm text-gray dark:text-white group-hover:text-white">{dlink?.title}</p>
        </a>
      {/each}
    </div>
  {/if}

  <nav id="fixed-menu" class="bg-creme dark:bg-aubergine rounded-full transition duration-300 ease-in-out transform {align}-0 flex  {showMenu ? 'opened' : 'closed'}" aria-label="Main">
    <div class="flex space-x-3 border-4 border-creme dark:border-aubergine rounded-full">
      <EraseLocalstorage />
      <button on:click={toggleDarkMode} class="relative bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
        {#if $darkMode}🌙{:else}🌞{/if}
      </button>
      <button on:click={() => toggleMenu('share')} class="{showMenu ? 'opened' : 'closed'} relative bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
        {#if showMenu}💔{:else}❤️{/if}
      </button>
      <button on:click={() => toggleMenu('donate')} class="md:hidden block relative bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
        {#if $showDonateMenu}❌{:else}{content.en.donateButton.textMobile}{/if}
      </button>
    </div>
  </nav>
</div>

<button on:click={() => toggleMenu('donate')} class="md:block hidden fixed bottom-4 right-4 bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none z-20 border-4 border-creme dark:border-aubergine">
  {#if $showDonateMenu}{content.en.donateButton.openText}{:else}{content.en.donateButton.text}{/if}
</button>
