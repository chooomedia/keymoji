<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { currentLanguage } from './stores/contentStore.js'; // modalMessage darkMode
    import { updateSeo } from './stores/seoStore';
    import { navigate } from 'svelte-routing';
    import { closeModal, isModalVisible } from './stores/modalStore';
    import { isLoggedIn, currentAccount } from './stores/appStores.js';
    import PageLayout from './components/Layout/PageLayout.svelte';
    import EmojiDisplay from './components/Core/EmojiDisplay.svelte';

    import { translations } from './stores/contentStore.js';
    import { isDebugMode } from './utils/environment';
    import { initializeAccountFromCookies, setupMagicLinkListener } from './stores/accountStore.js';
    import { initializeSettingsForUser } from './stores/userSettingsStore.js';
    import { testLimitConfiguration, testLimitConsistency } from './utils/test-limits.js';
    import { sendAnalyticsEvent } from './stores/appStores.js';
    import FooterInfo from './widgets/FooterInfo.svelte';
  
    // Debug-Flag - für die Produktion entfernen
    let showDebug = isDebugMode();
  
    // Prüfen, ob die Seite gerendert wurde
    let isRendered = false;
    

    
    // Bereits weiter unten definiert - entfernt doppelte Deklaration

    onMount(() => {
      // Als gerendert markieren
      isRendered = true;
      
      console.log('🏠 Index: onMount - Component initialized');
      
      // CRITICAL: Session restore is handled by LanguageRouter on app start
      // Do NOT call initializeAccountFromCookies here - it causes duplicate calls
      // The session is already restored before this component mounts
      
      // Just verify the current state
      const accountData = get(currentAccount);
      const loggedIn = get(isLoggedIn);
      console.log('🏠 Index: Current state:', {
          hasAccount: !!accountData,
          isLoggedIn: loggedIn,
          email: accountData?.email
      });
      
      // Initialize user settings (this reads from localStorage, doesn't break session)
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
      
      // Send page view analytics
      sendAnalyticsEvent('page_view', {
        page: 'home',
        language: $currentLanguage
      });
    });

    // Reaktive Übersetzungen für Home-Seite
    $: pageTitle = $translations?.index?.pageTitle || 'Emoji Passwort Generator';
    $: pageDescription = $translations?.index?.pageDescription || '🔑 Passwörter neu gedacht. 🎯 Unknackbare Emoji-Passwörter. 🌈 Kostenlos. Sicher. Innovativ.';
    
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
    
    <!-- Footer Information Component -->
    <FooterInfo slot="footer" />
</PageLayout>