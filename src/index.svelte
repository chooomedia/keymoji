<!--
Main index page component for Keymoji application.
Renders the emoji password generator interface and handles page initialization.
Manages SEO updates, user settings, and analytics tracking.
-->
<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { currentLanguage } from './stores/contentStore';
    import { updateSeo } from './stores/seoStore';
    import { closeModal, isModalVisible } from './stores/modalStore';
    import { isLoggedIn, currentAccount } from './stores/appStores';
    import EmojiDisplay from './components/Core/EmojiDisplay.svelte';
    import { translations } from './stores/contentStore';
    import { isDebugMode } from './utils/environment';
    import { setupMagicLinkListener } from './stores/accountStore';
    import { initializeSettingsForUser } from './stores/userSettingsStore';
    import { testLimitConfiguration, testLimitConsistency } from './utils/test-limits';
    import { sendAnalyticsEvent } from './stores/appStores';

    function debugIndex() {
        if (!isDebugMode()) return;
        console.group('🔍 Index Debug');
        console.log('Rendered:', isRendered);
        console.log('Current Path:', window.location.pathname);
        console.log('Language:', get(currentLanguage));
        console.log('Account:', {
            hasAccount: !!currentAccount,
            isLoggedIn: isLoggedIn,
            email: currentAccount?.email
        });
        console.groupEnd();
    }

    const showDebug = isDebugMode();
    let isRendered = $state(false);

    onMount(() => {
        isRendered = true;
        debugIndex();
        initializeSettingsForUser();
        setupMagicLinkListener();
        if (get(isModalVisible)) {
            closeModal();
        }
        if (sessionStorage.getItem('redirectInProgress')) {
            setTimeout(() => {
                sessionStorage.removeItem('redirectInProgress');
            }, 200);
        }
        if (isDebugMode()) {
            testLimitConfiguration();
            testLimitConsistency();
        }
        sendAnalyticsEvent('page_view', {
            page: 'home',
            language: $currentLanguage
        });
    });

    let pageTitle = $derived(() => {
        const t = get(translations);
        return t?.index?.pageTitle || 'Emoji Passwort Generator';
    });
    let pageDescription = $derived(() => {
        const t = get(translations);
        return t?.index?.pageDescription || '🔑 Passwörter neu gedacht. 🎯 Unknackbare Emoji-Passwörter. 🌈 Kostenlos. Sicher. Innovativ.';
    });
    
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
  
<div class="w-full">
    <EmojiDisplay />
</div>