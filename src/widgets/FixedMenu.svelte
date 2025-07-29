<script>
  import { slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { navigate } from 'svelte-routing';

  import { darkMode, showDonateMenu } from '../stores/appStores.js';
  import { t } from '../stores/contentStore.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { 
    whatsappIcon, 
    linkedinIcon, 
    emailIcon, 
    kofiIcon, 
    paypalIcon,
    redditIcon,
    fbmessengerIcon,
    instagramIcon
  } from '../assets/shapes.js';
  import { currentLanguage } from '../stores/contentStore.js';
  import { navigateToContact } from '../utils/navigation.js';

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

  function handleContactNavigation() {
    navigateToContact(false);
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
      id: 'twitter',
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out Keymoji - Emoji Password Generator! 🔑')}&url=${encodeURIComponent(window.location.href)}`,
      target: '_blank',
      svgContent: `<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      target: '_blank',
      svgContent: `<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>`
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      target: '_blank',
      svgContent: linkedinIcon
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
      svgContent: `<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>`
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
      name: 'Buy me a coffee',
      href: 'https://ko-fi.com/chooomedia',
      target: '_blank',
      svgContent: kofiIcon
    },
    {
      id: 'github',
      name: 'GitHub',
      href: 'https://github.com/chooomedia/keymoji',
      target: '_blank',
      svgContent: `<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>`
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
      <button aria-label="toggle color schema (dark/light)" on:click={toggleDarkMode} class="btn border-4 p-4 border-gray-300 dark:border-aubergine-800 dark:text-white bg-creme-500 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl">
        {#if $darkMode}🌙{:else}🌞{/if}
      </button>
      <button aria-label="open share menu" on:click={() => toggleMenu('share')} class="{showMenu ? 'opened' : 'closed'} btn border-4 p-4 border-gray-300 dark:border-aubergine-800 dark:text-white bg-creme-500 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl">
        {#if showMenu}💔{:else}❤️{/if}
      </button>
      <button aria-label="navigate to contact form" on:click={navigateToContact} class="btn border-4 p-4 border-gray-300 dark:border-aubergine-800 dark:text-white bg-creme-500 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl">
        💌
      </button>
      <button aria-label="open donation menu" on:click={() => toggleMenu('donate')} class="btn border-4 p-4 border-gray-300 dark:border-aubergine-800 dark:text-white bg-creme-500 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl md:hidden">
        {#if $showDonateMenu}❌{:else}☕{/if}
      </button>
    </div>
  </nav>


  <div class="fixed bottom-4 right-4 z-50">
    <button 
      data-menu-type="donate"
      aria-label="open donation menu" 
      on:click={() => toggleMenu('donate')} 
      class="hidden md:flex  items-center btn border-4 p-4 border-gray-300 dark:border-aubergine-800 dark:text-white bg-creme-500 dark:bg-aubergine-900 rounded-full shadow-lg relative z-50">
      <span class="text-xl mr-2">{#if $showDonateMenu}❌{:else}☕{/if}</span>
      <span class="text-sm font-semibold">
          {$showDonateMenu ? t('donateButton.openText') : t('donateButton.text')}
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

<svelte:head>
  {#if showMenu}
    <style>
      body { overflow: hidden; }
    </style>
  {/if}
</svelte:head>