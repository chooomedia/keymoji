<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { darkMode, showDonateMenu } from '../stores/appStores';
  import { translations } from '../stores/contentStore';
  import { get } from 'svelte/store';
  import { createEventDispatcher, onMount } from 'svelte';
  import ModalDebugComponent from '../components/UI/ModalDebug.svelte';
  import { initializeAccountFromCookies } from '../stores/accountStore';
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
  } from '../assets/shapes';
  import { navigateToContact } from '../utils/navigation';
  import { storageHelpers, STORAGE_KEYS } from '../config/storage';
  import { isDevelopment } from '../utils/environment';

  const dispatch = createEventDispatcher();

  // Props (Svelte 5 Runes)
  interface Props {
    align?: string;
  }
  
  let { align }: Props = $props();

  let showMenu = $state(false);
  
  // Reactive translations for template use (Svelte 5 Runes)
  let t = $derived.by(() => get(translations));
  let donateButtonText = $derived.by(() => t?.donateButton?.text || 'Support us');
  let donateButtonOpenText = $derived.by(() => t?.donateButton?.openText || 'Close');
  let fixedMenuTooltips = $derived.by(() => t?.fixedMenu?.tooltips || {});
  
  // Reactive store values for template use (Svelte 5 Runes)
  let showDonateMenuValue = $derived(get(showDonateMenu));
  let selectedLink = $state<string | undefined>(undefined);
  let showDebugModal = $state(false);

  // Dev-Mode einmalig berechnen, damit Template eine definierte Variable hat
  const devMode = isDevelopment();

  // Webpack/Svelte 5: explizite Zuweisung für stabile Komponenten-Referenz
  const ModalDebug = ModalDebugComponent;

  // Toggle body overflow when menu opens/closes
  $effect(() => {
    if (typeof document !== 'undefined') {
      if (showMenu) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  });

  // Click-Outside Handler - consistent with LanguageSwitcher
  onMount(() => {
    // Initialize account from cookies
    initializeAccountFromCookies();
    
    // Click-outside handler - consistent with LanguageSwitcher and BlogGrid
    // Use capture phase to ensure it runs before other handlers
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      
      // Check if click is on the share menu button
      const shareMenuButton = document.getElementById('share-menu-button');
      const isInsideShareButton = shareMenuButton && (shareMenuButton.contains(target) || shareMenuButton === target);
      
      // Check if click is on a clickable menu item (link) inside the share menu
      const isInsideShareMenuItem = target.closest('#fixed-menu [role="menuitem"]');
      
      // Check if click is on the donate button
      const donateButton = document.querySelector('[data-menu-type="donate"]');
      const isInsideDonateButton = donateButton && (donateButton.contains(target) || donateButton === target);
      
      // Check if click is on a clickable menu item inside the donate menu
      const isInsideDonateMenuItem = target.closest('[data-menu-type="donate"] + div [role="menuitem"]');
      
      // Also check other menus to avoid conflicts
      const isInsideLanguageMenu = target.closest('#language-dropdown-menu [role="menuitem"]');
      const isInsideLanguageButton = target.closest('#language-toggle-button');
      const isInsideCategoryMenu = target.closest('#category-dropdown-menu [role="menuitem"]');
      const isInsideCategoryButton = target.closest('#category-toggle-button');
      
      // Close share menu if click is outside all relevant elements
      if (showMenu && 
          !isInsideShareButton && 
          !isInsideShareMenuItem && 
          !isInsideDonateButton && 
          !isInsideDonateMenuItem && 
          !isInsideLanguageMenu && 
          !isInsideLanguageButton && 
          !isInsideCategoryMenu && 
          !isInsideCategoryButton) {
        showMenu = false;
        selectedLink = undefined;
      }
      
      // Close donate menu if click is outside all relevant elements
      if (get(showDonateMenu) && 
          !isInsideDonateButton && 
          !isInsideDonateMenuItem && 
          !isInsideShareButton && 
          !isInsideShareMenuItem && 
          !isInsideLanguageMenu && 
          !isInsideLanguageButton && 
          !isInsideCategoryMenu && 
          !isInsideCategoryButton) {
        showDonateMenu.set(false);
      }
    };
    
    // Use capture phase for better reliability
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  async function toggleDarkMode() {
    const currentDarkMode = get(darkMode);
    const newDarkMode = !currentDarkMode;
    const newTheme = newDarkMode ? 'dark' : 'light';
    
    // Update darkMode store
    darkMode.set(newDarkMode);
    
    // Save to storage
    storageHelpers.set(STORAGE_KEYS.DARK_MODE, newDarkMode);
    storageHelpers.set(STORAGE_KEYS.THEME, newTheme);
    
    // Update DOM
    if (typeof document !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // CRITICAL: Sync with userSettings store
    try {
      const { updateSetting, userSettings: userSettingsStore } = await import('../stores/userSettingsStore.ts');
      
      // Update userSettings.theme to stay in sync
      const currentSettings = userSettingsStore;
      if (currentSettings.theme !== newTheme) {
        updateSetting('theme', newTheme);
        console.log('✅ userSettings.theme synced:', newTheme);
      }
    } catch (error) {
      console.warn('⚠️ Failed to sync userSettings theme:', error);
    }
  }

  function toggleMenu(menuType, event) {
    // Prevent event from bubbling to click-outside handler
    if (event) {
      event.stopPropagation();
    }
    
    if (menuType === 'donate') {
      showDonateMenu.set(!get(showDonateMenu));
      showMenu = false;
      
      // Schließe Language Dropdown, wenn Donate Dropdown geöffnet wird
      if (get(showDonateMenu)) {
        const languageButton = document.querySelector('#language-toggle-button');
        if (languageButton && languageButton.getAttribute('aria-expanded') === 'true') {
          languageButton.click(); // Toggle schließt das Dropdown
        }
      }
    } else if (menuType === 'share') {
      showMenu = !showMenu;
        showDonateMenu.set(false);
      
      // Schließe Language Dropdown, wenn Share Menu geöffnet wird
      if (showMenu) {
        const languageButton = document.querySelector('#language-toggle-button');
        if (languageButton && languageButton.getAttribute('aria-expanded') === 'true') {
          languageButton.click(); // Toggle schließt das Dropdown
        }
        
        // Schließe Category Dropdown falls geöffnet
        const categoryButton = document.querySelector('#category-toggle-button');
        if (categoryButton && categoryButton.getAttribute('aria-expanded') === 'true') {
          categoryButton.click(); // Toggle schließt das Dropdown
        }
      }
    }

    dispatch('toggleMenu', { menuType });
  }

  function toggleDebugModal() {
    showDebugModal = !showDebugModal;
  }

  function clearLocalStorage() {
    const confirmed = confirm('⚠️ Clear ALL localStorage data? This cannot be undone!');
    if (confirmed) {
      storageHelpers.clearAll();
      console.log('✅ localStorage cleared! Reloading page...');
      window.location.reload();
    }
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

  // Reaktive Bindungen für Links - jetzt über t() verwaltet (Svelte 5 Runes)
  let shareLinks = $derived([
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
  ]);
  // Reactive donate links (Svelte 5 Runes)
  let donateLinks = $derived.by(() => [
    {
      id: 'ko-fi',
      name: get(translations)?.donateButton?.text || 'Buy me a coffee',
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
  ]);
</script>

{#if showMenu}
  <button aria-label="close opened menu"
    class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-10"
    onclick={(e) => { e.preventDefault(); e.stopPropagation(); closeAll(); }}
    in:slide={{ y: 5, duration: 400, easing: cubicInOut }} 
    out:slide={{ y: -5, duration: 400, easing: cubicInOut }} 
  ></button>
{/if}

<div id="fixed-menu" class="main-footer pb-4 flex flex-col justify-center items-center w-full bg-transparent backdrop-blur-md">
  {#if showMenu && shareLinks.length > 0}
    <ul 
    id="share-menu-list"
    class="w-34 mx-auto rounded-t-xl bg-creme-500 dark:bg-aubergine-900 ring-1 ring-black ring-opacity-5 z-auto pt-2 shadow-lg" 
    role="menu" 
    aria-orientation="vertical" 
    aria-labelledby="share-menu-button">
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
          onclick={() => selectLink(shareLinks, link.id)}
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

  <nav id="fixed-menu-nav" class="bg-creme-500 dark:bg-aubergine-800 rounded-full transition duration-300 ease-in-out transform shadow-lg {align}-0 flex {showMenu ? 'opened' : 'closed'}" aria-label="Main">
    <div class="w-auto justify-center flex gap-2 rounded-full">
      <button 
        aria-label={$darkMode ? (fixedMenuTooltips?.lightMode || 'Switch to light mode') : (fixedMenuTooltips?.darkMode || 'Switch to dark mode')}
        onclick={toggleDarkMode} 
        class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
        title={$darkMode ? (fixedMenuTooltips?.lightMode || 'Switch to light mode') : (fixedMenuTooltips?.darkMode || 'Switch to dark mode')}
      >
        {#if $darkMode}🌙{:else}🌞{/if}
      </button>
      <button 
        id="share-menu-button"
        aria-label={showMenu ? (fixedMenuTooltips?.closeShare || 'Close share menu') : (fixedMenuTooltips?.openShare || 'Share Keymoji')}
        onclick={(e) => toggleMenu('share', e)} 
        class="{showMenu ? 'opened' : 'closed'} btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
        title={showMenu ? (fixedMenuTooltips?.closeShare || 'Close share menu') : (fixedMenuTooltips?.openShare || 'Share Keymoji')}
        aria-expanded={showMenu}
        aria-haspopup="true"
        aria-controls="share-menu-list"
      >
        {#if showMenu}💔{:else}❤️{/if}
      </button>
      <button 
        aria-label={fixedMenuTooltips?.contact || 'Contact us'}
        onclick={navigateToContact} 
        class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
        title={fixedMenuTooltips?.contact || 'Contact us'}
      >
        💌
      </button>
      <!-- Debug Button (DEV MODE ONLY!) -->
      {#if devMode}
      <button 
        aria-label={fixedMenuTooltips?.debug || 'Open debug info (Dev only)'}
        onclick={toggleDebugModal} 
        class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
        title={fixedMenuTooltips?.debug || 'Open debug info (Dev only)'}
      >
        🐛
      </button>
      {/if}
      {#if devMode}
      <button 
        aria-label="Clear localStorage"
        onclick={clearLocalStorage} 
        class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
        title="Clear all localStorage data (Dev only)"
      >
        🧹
      </button>
      {/if}
      <button 
        aria-label={showDonateMenuValue ? (fixedMenuTooltips?.closeDonate || 'Close donation menu') : (fixedMenuTooltips?.donate || 'Support us')}
        onclick={(e) => toggleMenu('donate', e)} 
        class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center text-xl md:hidden transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
        title={showDonateMenuValue ? (fixedMenuTooltips?.closeDonate || 'Close donation menu') : (fixedMenuTooltips?.donate || 'Support us')}
      >
        {#if showDonateMenuValue}❌{:else}☕{/if}
      </button>
    </div>
  </nav>


  <div class="fixed bottom-4 right-4 z-50">
    <button 
      data-menu-type="donate"
      aria-label={showDonateMenuValue ? (fixedMenuTooltips?.closeDonate || 'Close donation menu') : (fixedMenuTooltips?.donate || 'Support us')}
      onclick={(e) => toggleMenu('donate', e)} 
      class="hidden md:flex items-center btn border-4 p-3.5 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 rounded-full shadow-lg relative z-50 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
      title={showDonateMenuValue ? donateButtonOpenText : donateButtonText}
    >
      <span class="text-xl mr-2">{#if showDonateMenuValue}❌{:else}☕{/if}</span>
      <span class="text-sm font-semibold">
          {showDonateMenuValue ? donateButtonOpenText : donateButtonText}
      </span>
    </button>
    
    {#if showDonateMenuValue && donateLinks.length > 0}
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
            onclick={() => selectLink(donateLinks, dlink.id)}
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
