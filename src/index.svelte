<script>
    import { onMount } from 'svelte';
    import { currentLanguage } from './stores/contentStore.js'; // modalMessage darkMode
    import { updateSeo } from './stores/seoStore.js';
    import { linkedinIcon } from './assets/shapes.js';
    import { navigate } from 'svelte-routing';
    import { closeModal, isModalVisible } from './stores/modalStore.js';
    import Modal from './components/UI/Modal.svelte';
    import PageLayout from './components/Layout/PageLayout.svelte';
    import UserCounter from './components/Core/UserCounter.svelte';
    import EmojiDisplay from './components/Core/EmojiDisplay.svelte';

    import { translations } from './stores/contentStore.js';
    import { navigateToVersions } from './utils/navigation.js';
    import { isDebugMode } from './utils/environment.js';
    import { initializeAccountFromCookies, setupMagicLinkListener } from './stores/accountStore.js';
    import { initializeSettingsForUser } from './stores/userSettingsStore.js';
    import { testLimitConfiguration, testLimitConsistency } from './utils/test-limits.js';
  
    // Debug-Flag - für die Produktion entfernen
    let showDebug = isDebugMode();
  
    // Prüfen, ob die Seite gerendert wurde
    let isRendered = false;
    
    function navigateToVersion() {
      navigateToVersions(false);
    }
    
    onMount(() => {
      // Als gerendert markieren
      isRendered = true;
      
      // Initialize account from cookies
      initializeAccountFromCookies();
      
      // Initialize user settings
      initializeSettingsForUser();
      
      // Setup cross-tab communication for magic links
      setupMagicLinkListener();
      
      // Clean up any modals when arriving at home page
      if ($isModalVisible) {
        closeModal();
      }
      
      // Bei initialem Laden, cleanup von Redirect-Flags durchführen
      if (sessionStorage.getItem('redirectInProgress')) {
        setTimeout(() => {
          sessionStorage.removeItem('redirectInProgress');
        }, 200);
      }
      
      // Test Limit Configuration (nur in Development)
      if (isDebugMode()) {
        console.log('🧪 Running Limit Tests...');
        testLimitConfiguration();
        testLimitConsistency();
      }
    });

    // Reaktive Übersetzungen
    $: pageTitle = $translations?.index?.pageTitle || 'Keymoji';
    $: pageDescription = $translations?.index?.pageDescription || 'Create unique emoji stories with AI';
    
    // Reaktive SEO-Updates bei Sprachänderungen
    $: if (isRendered) {
      updateSeo({
        title: pageTitle,
        description: pageDescription,
        url: window.location.pathname,
        pageType: "index"
      });
    }
</script>
  
{#if showDebug}
<div style="position: fixed; top: 0; left: 0; background: rgba(0,0,0,0.8); color: white; z-index: 9999; padding: 10px;">
    Current Path: {window.location.pathname} | Language: {$currentLanguage} | Rendered: {isRendered}
</div>
{/if}
  
<PageLayout {pageTitle} {pageDescription}>
    <!-- Emoji Display Component -->
    <EmojiDisplay />
    
    <!-- Footer slot content -->
    <footer slot="footer">
        <div class="flex items-center justify-center space-x-1 text-sm text-gray dark:text-gray-300">
            <button class="hover:text-yellow transition-colors duration-200" 
                on:click={navigateToVersion} 
                type="button"
                aria-label="View version history"
            >
                {$translations?.header?.pageVersion || 'v0.4.3'}
            </button>
            <span class="px-2">·</span>
            <span>Created by</span>
            <a
                href="https://www.linkedin.com/in/chooomedia/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 hover:text-yellow transition-colors duration-200 group"
                title="Christopher Matt - Frontend Developer"
            >
                <span class="group-hover:scale-105 transition-transform duration-200">Christopher Matt</span>
                <svg class="w-4 h-4 transform translate-y-[0.5px]" viewBox="0 0 24 24" fill="currentColor">
                    {@html linkedinIcon}
                </svg>
            </a>
            <span class="px-2">·</span>
            <UserCounter /><span> Visits</span>
        </div>
    </footer>
</PageLayout>

<!-- Modal Component -->
<Modal />