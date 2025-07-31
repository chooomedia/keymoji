<script>
  import { slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { navigate } from 'svelte-routing';

  import { darkMode, showDonateMenu, isLoggedIn, currentAccount } from '../stores/appStores.js';
  import { translations } from '../stores/contentStore.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import ModalDebug from '../components/UI/ModalDebug.svelte';
  import { initializeAccountFromCookies } from '../stores/accountStore.js';
  import { 
    whatsappIcon, 
    linkedinIcon, 
    emailIcon, 
    kofiIcon,
    twitterIcon,
    fbmessengerIcon,
    telegramIcon,
    paypalIcon,
    redditIcon,
    instagramIcon
  } from '../assets/shapes.js';
  import { currentLanguage } from '../stores/contentStore.js';
  import { navigateToContact } from '../utils/navigation.js';

  const dispatch = createEventDispatcher();

  export let align;

  let showMenu = false;
  let selectedLink = undefined;
  let showDebugModal = false;

  // Click-Outside Handler hinzufügen
  onMount(() => {
    // Initialize account from cookies
    initializeAccountFromCookies();
    
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

  function toggleDebugModal() {
    showDebugModal = !showDebugModal;
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

  // Reaktive Bindungen für Links - jetzt über t() verwaltet
  $: shareLinks = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      target: '_blank',
      svgContent: linkedinIcon
    },
    {
      id: 'reddit',
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Keymoji - Emoji Password Generator')}`,
      target: '_blank',
      svgContent: redditIcon
    },
    {
      id: 'twitter',
      name: 'X (twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out Keymoji - Emoji Password Generator! 🔑')}&url=${encodeURIComponent(window.location.href)}`,
      target: '_blank',
      svgContent: twitterIcon
    },
    {
      id: 'facebook',
      name: 'FB Messenger',
      href: `fb-messenger://share?link=${encodeURIComponent(window.location.href)}&app_id=[578001951341565]`,
      target: '_blank',
      svgContent: fbmessengerIcon
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent('Check out Keymoji - Emoji Password Generator! 🔑 ' + window.location.href)}`,
      target: '_blank',
      svgContent: whatsappIcon
    },
    {
      id: 'telegram',
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out Keymoji - Emoji Password Generator! 🔑')}`,
      target: '_blank',
      svgContent: telegramIcon
    },
    {
      id: 'email',
      name: 'Email',
      href: `mailto:?subject=${encodeURIComponent('Keymoji - Emoji Password Generator')}&body=${encodeURIComponent('Check out this awesome emoji password generator: ' + window.location.href)}`,
      target: '_blank',
      svgContent: emailIcon
    }
  ];
  $: donateLinks = [
    {
      id: 'ko-fi',
      name: $translations?.donateButton?.text || 'Buy me a coffee',
      href: 'https://ko-fi.com/chooomedia',
      target: '_blank',
      svgContent: kofiIcon
    },
    {
      id: 'paypal',
      name: 'PayPal',
      href: 'https://paypal.me/choooomedia/2',
      target: '_blank',
      svgContent: paypalIcon
    }
  ];
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
    class="w-34 mx-auto rounded-t-xl shadow-lg bg-creme-500 dark:bg-aubergine-900 ring-1 ring-black ring-opacity-5 z-auto pt-2" 
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
          class="flex flex-wrap text-black dark:text-white md:px-4 px-4 py-3 text-sm w-full text-left hover:bg-aubergine-50" 
          role="menuitem" 
          class:active={selectedLink === link} 
          rel={link.rel} 
          title={link.title} 
          on:click={() => selectLink(shareLinks, link.id)}
        >
          {#if link.svgContent}
            <svg class="w-5 h-5 mr-2 transition" viewBox="0 0 24 24" fill="currentColor" alt={link.alt || ''}>
              {@html link.svgContent}
            </svg>
          {/if}
          <p class="text-black dark:text-white">{link.name}</p>
        </a>
        </li>
      {/each}
      </ul>
  {/if}

  <nav id="fixed-menu-nav" class="bg-creme-500 dark:bg-aubergine-800 rounded-full transition duration-300 ease-in-out transform {align}-0 flex {showMenu ? 'opened' : 'closed'}" aria-label="Main">
    <div class="w-auto justify-center flex gap-2 rounded-full">
      <button aria-label="toggle color schema (dark/light)" on:click={toggleDarkMode} class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl">
        {#if $darkMode}🌙{:else}🌞{/if}
      </button>
      <button aria-label="open share menu" on:click={() => toggleMenu('share')} class="{showMenu ? 'opened' : 'closed'} btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl">
        {#if showMenu}💔{:else}❤️{/if}
      </button>
      <button aria-label="navigate to contact form" on:click={navigateToContact} class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl">
        💌
      </button>
      <button aria-label="open debug modal" on:click={toggleDebugModal} class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl">
        🐛
      </button>
      <button aria-label="open donation menu" on:click={() => toggleMenu('donate')} class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl md:hidden">
        {#if $showDonateMenu}❌{:else}☕{/if}
      </button>
    </div>
  </nav>


  <div class="fixed bottom-4 right-4 z-50">
    <button 
      data-menu-type="donate"
      aria-label="open donation menu" 
      on:click={() => toggleMenu('donate')} 
      class="hidden md:flex  items-center btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 rounded-full shadow-lg relative z-50">
      <span class="text-xl mr-2">{#if $showDonateMenu}❌{:else}☕{/if}</span>
      <span class="text-sm font-semibold">
          {$showDonateMenu ? $translations.donateButton.openText : $translations.donateButton.text}
      </span>
    </button>
    
    {#if $showDonateMenu && donateLinks.length > 0}
    <div class="md:absolute relative z-20 left-0 bottom-16 transform -translate-x-24 md:-translate-x-0 md:mr-0 md:ml-6 mr-4">
      <ul 
        class="w-44 rounded-t-xl shadow-lg bg-creme-500 dark:bg-aubergine-900 ring-1 ring-black ring-opacity-5 z-auto py-2"
        aria-labelledby="menu-button"
        in:slide={{ y: 5, duration: 400, easing: cubicInOut }}
        out:slide={{ y: -5, duration: 400, easing: cubicInOut }}
      >
        {#each donateLinks as dlink (dlink.id)}
        <li
            in:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
            out:slide={{ y: 5, duration: 400, easing: cubicInOut }} >
          <a 
            href={dlink.href} 
            target={dlink.target} 
            class="flex flex-wrap text-black dark:text-white md:px-4 px-4 py-3 text-sm w-full text-left hover:bg-aubergine-50" 
            role="menuitem" 
            class:active={selectedLink === dlink} 
            rel={dlink.rel} 
            title={dlink.title} 
            on:click={() => selectLink(donateLinks, dlink.id)}
          >
            {#if dlink.svgContent}
              <svg class="w-5 h-5 mr-2 transition" viewBox="0 0 32 32" fill="currentColor" alt={dlink.alt || ''}>
                {@html dlink.svgContent}
              </svg>
            {/if}
            <p class="text-black dark:text-white">{dlink.name}</p>
          </a>
        </li>
        {/each}
      </ul>
    </div>
    {/if}
  </div>
</div>

<!-- Debug Modal -->
<ModalDebug isVisible={showDebugModal} on:close={() => showDebugModal = false} />

<svelte:head>
  {#if showMenu}
    <style>
      body { overflow: hidden; }
    </style>
  {/if}
</svelte:head>