<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { currentLanguage } from './stores/contentStore';
    import { updateSeo } from './stores/seoStore';
    import { navigate } from './utils/routing';
    import { closeModal, isModalVisible } from './stores/modalStore';
    import { isLoggedIn, currentAccount } from './stores/appStores';
    // PageLayout wird jetzt von +page.svelte bereitgestellt (SvelteKit Pattern)
    import EmojiDisplay from './components/Core/EmojiDisplay.svelte';

    import { translations } from './stores/contentStore';
    import { isDebugMode } from './utils/environment';
    import { initializeAccountFromCookies, setupMagicLinkListener } from './stores/accountStore';
    import { initializeSettingsForUser } from './stores/userSettingsStore';
    import { testLimitConfiguration, testLimitConsistency } from './utils/test-limits';
    import { sendAnalyticsEvent } from './stores/appStores';
  
    // Debug-Flag - für die Produktion entfernen
    let showDebug = isDebugMode();
  
    // Prüfen, ob die Seite gerendert wurde
    let isRendered = $state(false);
    

    
    // Bereits weiter unten definiert - entfernt doppelte Deklaration

    onMount(() => {
      // Als gerendert markieren
      isRendered = true;
      
      console.log('🏠 Index: onMount - Component initialized');
      
      // CRITICAL: Session restore is handled by LanguageRouter on app start
      // Do NOT call initializeAccountFromCookies here - it causes duplicate calls
      // The session is already restored before this component mounts
      
      // Just verify the current state
      const accountData = currentAccount;
      const loggedIn = isLoggedIn;
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
      if (get(isModalVisible)) {
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

    // Reaktive Übersetzungen für Home-Seite (Svelte 5 Runes)
    let pageTitle = $derived.by(() => {
        const t = get(translations);
        return t?.index?.pageTitle || 'Emoji Passwort Generator';
    });
    let pageDescription = $derived.by(() => {
        const t = get(translations);
        return t?.index?.pageDescription || '🔑 Passwörter neu gedacht. 🎯 Unknackbare Emoji-Passwörter. 🌈 Kostenlos. Sicher. Innovativ.';
    });
    
    // Reaktive SEO-Updates bei Sprachänderungen (Svelte 5 Runes)
    $effect(() => {
      if (isRendered) {
        updateSeo({
          title: pageTitle,
          description: pageDescription,
          url: window.location.pathname,
          pageType: "index"
        });
      }
    });
</script>
  
{#if showDebug}
<div style="position: fixed; top: 0; left: 0; background: rgba(0,0,0,0.8); color: white; z-index: 9999; padding: 10px;">
    Current Path: {window.location.pathname} | Language: {get(currentLanguage)} | Rendered: {isRendered}
</div>
{/if}
  
<!-- 
    SvelteKit Pattern: Diese Komponente rendert nur den Content
    Das Layout wird von +page.svelte bereitgestellt
-->
<div class="w-full">
    <!-- Emoji Display Component -->
    <EmojiDisplay />
</div>