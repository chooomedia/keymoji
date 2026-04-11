<!-- src/components/UI/ConsentModal.svelte -->
<!-- GDPR Cookie-Consent Modal — gleiche Struktur wie Modal.svelte -->
<!-- Verwendet Toggle.svelte + Button.svelte aus UI-Kit -->
<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { translations, currentLanguage } from '../../stores/contentStore.js';
    import {
        consentStore,
        setConsent,
        declineConsent,
        hasConsented
    } from '../../stores/consentStore.js';
    import Toggle from './Toggle.svelte';
    import Button from './Button.svelte';
    import FocusManager from '../A11y/FocusManager.svelte';

    export let isOpen = false;

    const dispatch = createEventDispatcher();

    function closeModal() {
        isOpen = false;
        dispatch('close');
    }

    // Fantasiesprachen ohne vollständige Übersetzungen → EN-Fallback
    const FANTASY_LANGS = ['sjn', 'tlh'];
    $: isFantasyLang = FANTASY_LANGS.includes($currentLanguage);

    // Sprachabhängige Links
    $: lang = $currentLanguage || 'en';
    $: privacyUrl = lang === 'en' ? '/privacy' : `/${lang}/privacy`;
    $: legalUrl = lang === 'de' || lang === 'de-CH'
        ? `/${lang}/impressum`
        : lang === 'en' ? '/legal' : `/${lang}/legal`;

    function goTo(url) {
        closeModal();
        setTimeout(() => navigate(url), 50);
    }

    // Reaktiver Shortcut — wird bei jedem Sprachenwechsel neu evaluiert
    $: c = (!isFantasyLang && $translations?.consent) ? $translations.consent : {};

    // Lokale UI-Kopie (erst beim Speichern in Store schreiben)
    let analyticsChecked = false;
    let saveHistoryChecked = true;

    $: if (isOpen) {
        analyticsChecked = $consentStore.preferences.analytics;
        saveHistoryChecked = $consentStore.preferences.saveHistory;
    }

    function handleAccept() {
        setConsent({ analytics: analyticsChecked, saveHistory: saveHistoryChecked });
        closeModal();
    }

    function handleAcceptAll() {
        setConsent({ analytics: true, saveHistory: true });
        closeModal();
    }

    function handleDecline() {
        declineConsent();
        closeModal();
    }

    function handleKeydown(event) {
        if (event.key === 'Escape' && hasConsented()) closeModal();
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget && hasConsented()) closeModal();
    }

    // Body scroll-lock wie Modal.svelte
    $: if (typeof document !== 'undefined') {
        if (isOpen) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');
    }

    onDestroy(() => {
        document.body.classList.remove('modal-open');
    });
</script>

{#if isOpen}
    <!-- Overlay — identische Klassen zu Modal.svelte -->
    <div
        class="modal-overlay modal-force-top"
        on:click={handleBackdropClick}
        on:keydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-modal-title"
        tabindex="-1"
        transition:fade={{ duration: 250 }}
    >
        <div class="modal-container">
            <div
                class="modal-content w-full max-w-md"
                transition:fly={{ y: 20, duration: 300 }}
                role="document"
            >
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl modal-icon" aria-hidden="true">🍪</span>
                        <div>
                            <h2 id="consent-modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">
                                {c.title || 'Privacy Settings'}
                            </h2>
                            <p class="text-xs text-gray-400 dark:text-gray-500">GDPR · revDSG · Art. 13 DSGVO</p>
                        </div>
                    </div>

                    <!-- X nur wenn bereits entschieden -->
                    {#if hasConsented()}
                        <button
                            on:click={closeModal}
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                            aria-label={$translations?.modals?.closeModal || 'Close'}
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    {/if}
                </div>

                <!-- Body -->
                <div class="p-4 space-y-3 max-h-[65vh] overflow-y-auto">

                    <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {c.description || 'We use minimal data to improve your experience. Adjust your preferences below.'}
                    </p>

                    <!-- 1. Technisch notwendig (immer aktiv) -->
                    <div class="rounded-xl border border-gray-200 dark:border-aubergine-700 overflow-hidden">
                        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-aubergine-800">
                            <div class="flex items-center gap-2 min-w-0 pr-2">
                                <span class="text-base shrink-0" aria-hidden="true">🔒</span>
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                        {c.necessaryTitle || 'Strictly necessary'}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                        {c.necessaryHint || 'Required for the app to function — always active'}
                                    </p>
                                </div>
                            </div>
                            <Toggle id="consent-necessary" checked={true} disabled={true} color="yellow" />
                        </div>
                        <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 space-y-0.5 bg-white dark:bg-aubergine-900">
                            <p>• {c.necessaryStorage || 'Settings & theme preference (localStorage)'}</p>
                            <p>• {c.necessarySession || 'Login session (browser memory only)'}</p>
                            <p>• {c.necessaryOtp || 'OTP code for authentication (sent once via email)'}</p>
                        </div>
                    </div>

                    <!-- 2. Lokale Nutzungshistorie -->
                    <div class="rounded-xl border border-gray-200 dark:border-aubergine-700 overflow-hidden">
                        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-aubergine-800">
                            <div class="flex items-center gap-2 min-w-0 pr-2">
                                <span class="text-base shrink-0" aria-hidden="true">📊</span>
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                        {c.saveHistory || 'Local usage history'}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                        {c.saveHistoryHint || 'Stored only in your browser, never uploaded'}
                                    </p>
                                </div>
                            </div>
                            <Toggle
                                id="consent-history"
                                bind:checked={saveHistoryChecked}
                                color="yellow"
                                on:change={e => { saveHistoryChecked = e.detail.checked; }}
                            />
                        </div>
                        <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 space-y-0.5 bg-white dark:bg-aubergine-900">
                            <p>• {c.historyDetail || 'Usage chart data (emoji generations per day)'}</p>
                            <p>• {c.historyScope || 'Never sent to any server — only in your browser'}</p>
                        </div>
                    </div>

                    <!-- 3. Anonyme Analytik -->
                    <div class="rounded-xl border border-gray-200 dark:border-aubergine-700 overflow-hidden">
                        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-aubergine-800">
                            <div class="flex items-center gap-2 min-w-0 pr-2">
                                <span class="text-base shrink-0" aria-hidden="true">📈</span>
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                        {c.analytics || 'Anonymous usage analytics'}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                        {c.analyticsHint || 'Helps us improve the app — no personal data stored'}
                                    </p>
                                </div>
                            </div>
                            <Toggle
                                id="consent-analytics"
                                bind:checked={analyticsChecked}
                                color="yellow"
                                on:change={e => { analyticsChecked = e.detail.checked; }}
                            />
                        </div>
                        <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 space-y-0.5 bg-white dark:bg-aubergine-900">
                            <p>• {c.analyticsDetail || 'Anonymised page view counts (IP anonymised to x.x.x.0)'}</p>
                            <p>• {c.analyticsProcessor || 'Processed via our own n8n instance on DigitalOcean (EU server)'}</p>
                        </div>
                    </div>

                </div>

                <!-- Footer Buttons — wie Modal.svelte -->
                <div class="modal-footer mt-2 pt-3">
                    <div class="flex flex-col gap-2 mb-2 px-4">
                        <Button variant="primary" size="sm" fullWidth={true} on:click={handleAccept}>
                            {c.accept || 'Save my choices'}
                        </Button>
                        <div class="flex gap-2">
                            <Button variant="secondary" size="sm" fullWidth={true} on:click={handleAcceptAll}>
                                {c.acceptAll || 'Accept all'}
                            </Button>
                            <Button variant="secondary" size="sm" fullWidth={true} on:click={handleDecline}>
                                {c.decline || 'Decline optional'}
                            </Button>
                        </div>
                    </div>
                    <!-- Links zentriert unter den Buttons -->
                    <p class="text-xs text-gray-400 dark:text-gray-500 flex justify-center items-center gap-3 pb-3 pt-1">
                        <button
                            type="button"
                            class="text-yellow-500 hover:underline bg-transparent border-0 p-0 cursor-pointer text-xs"
                            on:click={() => goTo(privacyUrl)}
                        >
                            {c.moreInfo || 'Privacy Policy'}
                        </button>
                        <span aria-hidden="true">·</span>
                        <button
                            type="button"
                            class="text-yellow-500 hover:underline bg-transparent border-0 p-0 cursor-pointer text-xs"
                            on:click={() => goTo(legalUrl)}
                        >
                            {c.legalInfo || 'Legal Notice'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <FocusManager on:close={() => hasConsented() && closeModal()} />
{/if}
