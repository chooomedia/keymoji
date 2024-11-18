<script>
  import { slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { navigate } from "svelte-routing";
  import EraseLocalstorage from '../EraseLocalstorage.svelte';
  import { darkMode, showDonateMenu, languageText } from '../stores.js';
  import { createEventDispatcher, onMount } from 'svelte';

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

  function navigateToContact() {
    navigate("/contact", { replace: true });
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
  <button aria-label="close opened menu"
    class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-10"
    on:click|preventDefault|stopPropagation={closeAll}
    in:slide={{ y: 5, duration: 400, easing: cubicInOut }} 
    out:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
  ></button>
{/if}

<div id="fixed-menu" class="fixed bottom-4 flex flex-col justify-center items-center w-full z-10">
  {#if showMenu && shareLinks.length > 0}
    <ul 
    class="w-32 mx-auto rounded-t-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-auto pt-2" 
    role="menu" 
    aria-orientation="vertical" 
    aria-labelledby="menu-button">
      {#each shareLinks as link (link.id)}
      <li 
        in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
        out:slide={{ y: 5, duration: 400, easing: cubicInOut }}>
        <a 
          href={link.href} 
          target={link.target} 
          class="flex flex-wrap text-black dark:text-white md:px-4 px-2 py-2 text-sm w-full text-left hover:bg-gray group hover:text-white" 
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
        </li>
      {/each}
      </ul>
  {/if}

  {#if $showDonateMenu && donateLinks.length > 0}
  <ul 
    class="w-32 md:mx-7 md:ml-9 mx-auto md:fixed md:right-3 md:bottom-71 rounded-t-xl shadow-lg bg-creme dark:bg-aubergine-dark ring-1 ring-black ring-opacity-5 z-auto py-2" 
    role="menu" 
    aria-orientation="vertical" 
    aria-labelledby="menu-button">

      {#each donateLinks as dlink (dlink.id)}
      <li
          in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
          out:slide={{ y: 5, duration: 400, easing: cubicInOut }} >
        <a 
          href={dlink.href} 
          target={dlink.target} 
          class="flex flex-wrap text-black dark:text-white md:px-4 px-2 py-2 text-sm w-full text-left hover:bg-gray group hover:text-white" 
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
      </li>
      {/each}
  </ul>
  {/if}

  <nav id="fixed-menu-nav" class="bg-creme dark:bg-aubergine rounded-full transition duration-300 ease-in-out transform {align}-0 flex {showMenu ? 'opened' : 'closed'}" aria-label="Main">
    <div class="w-46 justify-center flex space-x-3 border-4 border-creme dark:border-aubergine rounded-full">
      <EraseLocalstorage />
      <button aria-label="toggle color schema (dark/light)" on:click={toggleDarkMode} class="btn btn-default btn-md">
        {#if $darkMode}🌙{:else}🌞{/if}
      </button>
      <button aria-label="open share menu" on:click={() => toggleMenu('share')} class="{showMenu ? 'opened' : 'closed'} btn btn-default btn-md">
        {#if showMenu}💔{:else}❤️{/if}
      </button>
      <button aria-label="navigate to contact form" on:click={navigateToContact} class="btn btn-default btn-md">
        💌
      </button>
      <button aria-label="open donation menu" on:click={() => toggleMenu('donate')} class="md:hidden block btn btn-default btn-md">
        {#if $showDonateMenu}❌{:else}{$languageText?.donateButton?.textMobile || '☕'}{/if}
      </button>
    </div>
  </nav>

  <!-- Desktop Donate Button -->
  <button 
    data-menu-type="donate"
    aria-label="open donation menu" 
    on:click={() => toggleMenu('donate')} 
    class="hidden md:flex fixed bottom-4 right-4 items-center space-x-2 btn btn-fixed btn-md">
    <span>{#if $showDonateMenu}❌{:else}☕{/if}</span>
    <span class="text-base">
      {$showDonateMenu ? $languageText?.donateButton?.openText : $languageText?.donateButton?.text}
    </span>
  </button>
</div>

<style>
  /* Optional: Verhindert Scrolling wenn Overlay aktiv ist */
  :global(body.menu-open) {
    overflow: hidden;
  }

  /* Optimierte Transitions */
  :global(.menu-transition) {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>

<svelte:head>
  {#if showMenu}
    <style>
      body { overflow: hidden; }
    </style>
  {/if}
</svelte:head>