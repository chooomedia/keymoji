<script>
  import { slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import EraseLocalstorage from '../EraseLocalstorage.svelte';
  import { darkMode, showDonateMenu, languageText } from '../stores.js';
  import { createEventDispatcher, onMount } from 'svelte'; // onMount hinzugefügt

  const dispatch = createEventDispatcher();

  export let align;

  let showMenu = false;
  let selectedLink = undefined;

  // Click-Outside Handler hinzufügen
  onMount(() => {
    const handleClickOutside = (event) => {
      const fixedMenu = document.getElementById('fixed-menu');
      const donateButton = document.querySelector('[data-menu-type="donate"]');
      
      // Prüfen ob der Click außerhalb der Menüs war
      if (!event.target.closest('#fixed-menu') && 
          !event.target.closest('[data-menu-type="donate"]')) {
        showMenu = false;
        showDonateMenu.set(false);
        selectedLink = undefined;
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function toggleDarkMode() {
    darkMode.update(value => !value);
  }

  function toggleMenu(menuType) {
    if (menuType === 'donate') {
      showDonateMenu.update(value => !value);
      showMenu = false;
    } else if (menuType === 'share') {
      showMenu = !showMenu;
      showDonateMenu.set(false);
    }

    dispatch('toggleMenu', { menuType });
  }

  function selectLink(links, id) {
    if (links && Array.isArray(links)) {
      const link = links.find(o => o.id === id);
      selectedLink = selectedLink === link ? undefined : link;
    }
  }

  function closeAll() {
    selectedLink = undefined;
    showMenu = false;
    showDonateMenu.set(false);
  }

  // Reaktive Bindungen für Links
  $: shareLinks = $languageText?.shareButtons?.links || [];
  $: donateLinks = $languageText?.donateButton?.links || [];
</script>

{#if showMenu}
  <button class="overlay" on:click={closeAll}></button>
{/if}

<div id="fixed-menu" class="fixed bottom-4 z-20 justify-between items-center">
  {#if showMenu && shareLinks.length > 0}
    <div class="w-32 md:mx-7 md:ml-8 mx-auto rounded-t-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-10 pt-2" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
      {#each shareLinks as link (link.id)}
        <a 
          in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
          out:slide={{ y: 5, duration: 400, easing: cubicInOut }} 
          href={link.href} 
          target={link.target} 
          class="flex flex-wrap text-black dark:text-white block md:px-4 px-2 py-2 text-sm w-full text-left hover:bg-gray group hover:text-white" 
          role="menuitem" 
          class:active={selectedLink === link} 
          rel={link.rel} 
          title={link.title} 
          on:click={() => selectLink(shareLinks, link.id)}
        >
          {#if link.svgContent}
            <svg class="w-5 h-5 mr-1 transition" viewBox="0 0 24 24" fill="currentColor" alt={link.alt || ''}>
              {@html link.svgContent}
            </svg>
          {/if}
          <p class="text-sm text-gray dark:text-white group-hover:text-white">{link.title || ''}</p>
        </a>
      {/each}
    </div>
  {/if}

  {#if $showDonateMenu && donateLinks.length > 0}
    <div class="w-32 md:mx-7 md:ml-9 mx-auto md:fixed md:right-3 md:bottom-71 rounded-t-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-10 pt-2" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
      {#each donateLinks as dlink (dlink.id)}
        <a 
          in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
          out:slide={{ y: 5, duration: 400, easing: cubicInOut }} 
          href={dlink.href} 
          target={dlink.target} 
          class="flex flex-wrap text-black dark:text-white block md:px-4 px-2 py-2 text-sm w-full text-left hover:bg-gray group hover:text-white" 
          role="menuitem" 
          class:active={selectedLink === dlink} 
          rel={dlink.rel} 
          title={dlink.title} 
          on:click={() => selectLink(donateLinks, dlink.id)}
        >
          {#if dlink.svgContent}
            <svg class="w-5 h-5 mr-1 transition" viewBox="0 0 32 32" fill="currentColor" alt={dlink.alt || ''}>
              {@html dlink.svgContent}
            </svg>
          {/if}
          <p class="text-sm text-gray dark:text-white group-hover:text-white">{dlink.title || ''}</p>
        </a>
      {/each}
    </div>
  {/if}

  <nav id="fixed-menu-nav" class="bg-creme dark:bg-aubergine rounded-full transition duration-300 ease-in-out transform {align}-0 flex {showMenu ? 'opened' : 'closed'}" aria-label="Main">
    <div class="w-48 justify-center flex space-x-3 border-4 border-creme dark:border-aubergine rounded-full">
      <EraseLocalstorage />
      <button on:click={toggleDarkMode} class="relative bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
        {#if $darkMode}🌙{:else}🌞{/if}
      </button>
      <button on:click={() => toggleMenu('share')} class="{showMenu ? 'opened' : 'closed'} relative bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
        {#if showMenu}💔{:else}❤️{/if}
      </button>
      <button on:click={() => toggleMenu('donate')} class="md:hidden block relative bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none">
        {#if $showDonateMenu}❌{:else}{$languageText?.donateButton?.textMobile || '☕'}{/if}
      </button>
    </div>
  </nav>
</div>

<button 
  data-menu-type="donate"
  on:click={() => toggleMenu('donate')} 
  class="md:block hidden fixed bottom-4 right-4 bg-powder text-black dark:bg-aubergine-dark dark:text-powder py-3 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none z-20 border-4 border-creme dark:border-aubergine"
>
  {#if $showDonateMenu}
    {$languageText?.donateButton?.openText || 'Close'}
  {:else}
    {$languageText?.donateButton?.text || 'Donate'}
  {/if}
</button>