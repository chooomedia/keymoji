<script>
  import { fly } from 'svelte/transition';
  import { elasticIn, elasticOut } from 'svelte/easing';
  import { content } from './content.js';
  import EraseLocalstorage from './EraseLocalstorage.svelte';
  import { darkMode } from './stores.js';

  export let modalIsOpen;
  export let align;
  export let showMenu;

  let menuKeyboard = false;
  let selectedLink = undefined;

  function keyEventListener(e) {
    menuKeyboard = true;
    for (let i = 0; i < content.en.links.length; i++) {
      if (e.key == i + 1) {
        selectLink(i + 1);
        showMenu = true;
      } else {
        closeAll();
      }
    }
  }

  function toggleDarkMode() {
    darkMode.update(currentMode => !currentMode);
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function closeAll() {
    selectedLink = false;
    showMenu = false;
    modalIsOpen = false;
  }

  function selectLink(id) {
    const link = content.en.links.find((o) => o.id == id);
    console.log('selected link', link);
    if (selectedLink == link) {
      selectedLink = undefined;
    } else {
      selectedLink = link;
    }
    modalIsOpen = selectedLink?.dialogContent && selectedLink.dialogContent != '';
    console.log('modalIsOpen', modalIsOpen);
    console.log('selectedLink?.dialogContent', selectedLink?.dialogContent);
  }
</script>

{#if showMenu }
  <button class="overlay" on:click={closeAll}></button>
{/if}

{#if modalIsOpen}
  <dialog class="w-80 md:w-25r rounded-xl bg-creme dark:bg-aubergine" id="menu-dialog" open="open" in:fly="{{ y: 60, duration: 700, elasticIn }}" out:fly="{{ y: 60, duration: 700, elasticOut }}" >
    <header class="flex-box">
      <img src="{selectedLink.imgSrc}" width="24px" height="24px" alt="icon chat" />
      <h4>{selectedLink.title}</h4>
      <button class="close-button" on:click={closeAll}>
        <svg id="icon-close" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 121.31 122.876">
          <path d="{close}" />
        </svg>
      </button>
    </header>
    <slot name="modal" selectedLink={selectedLink}></slot>
  </dialog>
{/if}

<nav id="fixed-menu" class="bg-creme dark:bg-aubergine rounded-full fixed z-20 mx-auto mb-4 transition duration-300 ease-in-out transform {align}-0 flex justify-between items-center {showMenu ? 'opened' : 'closed'}" aria-label="Main" on:keydown={keyEventListener}>
  {#if showMenu }
    <div class="flex space-x-4">
      {#each content.en.links as link, index}
        <slot>
          <a in:fly="{{ y: -5, duration: 380, delay: 100, elasticIn }}" href={link.href} target={link.target} class={link.class} class:active={selectedLink == link} rel={link.rel} title={link.title} on:click={() => { selectLink(link.id)}} >
            <slot name="item" index={index} link={link}></slot>
          </a>
        </slot>
      {/each}
    </div>
  {/if}

  <div class="flex space-x-1 border-4 border-creme dark:border-aubergine rounded-full">
    <EraseLocalstorage />
    <button on:click={toggleMenu} class="{showMenu ? 'opened' : 'closed'} relative bg-blue text-white py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
      🍔
    </button>
    <button on:click={toggleDarkMode} class="relative bg-blue text-white py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
      {#if $darkMode}🌙{:else}☀️{/if}
    </button>
  </div>
</nav>
