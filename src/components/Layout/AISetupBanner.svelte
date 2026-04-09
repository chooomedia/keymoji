<!-- src/components/Layout/AISetupBanner.svelte -->
<!-- Announcement-Bar über dem Header – nur wenn KI nicht eingerichtet -->
<script>
    import { navigate } from 'svelte-routing';
    import { isLoggedIn, currentAccount } from 'stores/appStores';
    import { translations, currentLanguage } from '../../stores/contentStore.js';
    import { effectiveSettings, userSettings } from '../../stores/userSettingsStore.js';
    import { darkMode } from 'stores/appStores';
    import { onMount, onDestroy } from 'svelte';
    import { STORAGE_KEYS, storageHelpers } from '../../config/storage.js';

    const DISMISS_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 Tage

    let storyModeEnabled = false;
    let storyModeConfigured = false;

    $: {
        const settings =
            $effectiveSettings?.storyMode ||
            $userSettings?.storyMode ||
            $currentAccount?.metadata?.settings?.storyMode ||
            null;

        if (settings) {
            const provider = settings.provider || 'apertus';
            const apiKeys = settings.apiKeys || {};
            const key = apiKeys[provider] || '';
            storyModeEnabled = settings.enabled || false;
            storyModeConfigured =
                provider === 'apertus'
                    ? storyModeEnabled
                    : !!(key && key.length >= 10);
        } else {
            storyModeEnabled = false;
            storyModeConfigured = false;
        }
    }

    $: showBanner = !$isLoggedIn || !storyModeEnabled || !storyModeConfigured;

    let swissHover = false;
    let swissClick = false;

    function isDismissed() {
        const entry = storageHelpers.get(STORAGE_KEYS.BANNER_DISMISSED);
        if (!entry || !entry.until) return false;
        return Date.now() < entry.until;
    }

    let dismissed = isDismissed();

    function dismiss() {
        storageHelpers.set(STORAGE_KEYS.BANNER_DISMISSED, { until: Date.now() + DISMISS_TTL_MS });
        dismissed = true;
    }

    function updateBannerHeight() {
        const h = (showBanner && !dismissed) ? 32 : 0;
        document.documentElement.style.setProperty('--banner-height', h + 'px');
    }

    $: if (typeof document !== 'undefined') {
        updateBannerHeight();
    }

    onMount(() => updateBannerHeight());
    onDestroy(() => document.documentElement.style.setProperty('--banner-height', '0px'));

    function navigateToAISettings() {
        const lang = $currentLanguage || 'en';
        const path = lang === 'en' ? '/account' : `/${lang}/account`;
        navigate(path);
        setTimeout(() => {
            const accordion = document.querySelector('[data-accordion="story"]');
            const btn = document.querySelector('#accordion-story');
            if (accordion && !accordion.querySelector('.p-4')) btn?.click();
            setTimeout(() => accordion?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }, 400);
    }

    function handleSwissClick() {
        swissClick = true;
        setTimeout(() => (swissClick = false), 600);
        navigateToAISettings();
    }
</script>

{#if showBanner && !dismissed}
    <div
        role="banner"
        aria-label="KI-Setup"
        class="ai-setup-banner w-full flex items-center justify-center relative px-8
               bg-creme-600 dark:bg-aubergine-900
               border-b border-creme-700 dark:border-aubergine-800
               text-gray-700 dark:text-gray-300"
    >
        <!-- Zentrierter Content-Bereich -->
        <div class="flex items-center gap-2">

            <!-- Swiss AI Button — kein Border, kein Radius, smooth hover -->
            <button
                on:click={handleSwissClick}
                on:mouseenter={() => (swissHover = true)}
                on:mouseleave={() => (swissHover = false)}
                class="swiss-ai-button relative inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold
                       whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
                       cursor-pointer {swissHover ? 'swiss-hover' : ''} {swissClick ? 'swiss-click' : ''}"
                style="color: rgb(218,41,28);"
                title={$translations?.index?.setupStoryModeSwissTooltip || 'Schweizer KI (Apertus) – Datenschutz pur'}
                aria-label={$translations?.index?.setupStoryModeSwiss || 'Schweizer KI nutzen'}
            >
                <!-- Hover-Hintergrund (kein Radius) -->
                <div class="swiss-hover-bg absolute inset-0 pointer-events-none transition-opacity duration-300 {swissHover || swissClick ? 'opacity-100' : 'opacity-0'}" style="background-color: rgb(218,41,28);"></div>
                <span class="swiss-text relative z-10 transition-colors duration-300 {swissHover || swissClick ? 'text-white' : ''}" aria-hidden="true">🇨🇭</span>
                <span class="swiss-text relative z-10 transition-colors duration-300 {swissHover || swissClick ? 'text-white' : ''}">
                    {$translations?.index?.setupStoryModeSwissShort || 'Schweizer KI'}
                </span>
            </button>

            <span class="text-xs text-gray-400 dark:text-gray-600 font-light">
                {$translations?.index?.setupStoryModeOr || 'oder'}
            </span>

            <!-- Own AI Button — kein Border, kein Radius -->
            <button
                on:click={navigateToAISettings}
                class="own-ai-button relative inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold
                       whitespace-nowrap overflow-hidden transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
                       cursor-pointer text-yellow-600 dark:text-yellow-400"
                title={$translations?.index?.setupStoryModeDescription || 'Eigene KI konfigurieren'}
                aria-label={$translations?.index?.setupStoryModeShort || 'Eigene KI nutzen'}
            >
                <div class="own-hover-bg absolute inset-0 pointer-events-none transition-opacity duration-200 opacity-0" style="background-color: rgba(234,179,8,0.15);"></div>
                <span class="relative z-10" aria-hidden="true">⚙️</span>
                <span class="relative z-10">{$translations?.index?.setupStoryModeShort || 'Eigene KI nutzen'}</span>
            </button>

            <!-- CTA – nur ab sm sichtbar -->
            <span class="hidden sm:inline text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                — {$translations?.index?.setupStoryModeBannerCta || 'Erstelle deine Keymoji-Story'}
            </span>
        </div>

        <!-- Dismiss – absolut rechts -->
        <button
            on:click={dismiss}
            class="absolute right-2 p-0.5 rounded text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400
                   transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400"
            aria-label="Banner schließen"
            title="Schließen"
        >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
{/if}

<style>
    /* Swiss AI: sanftes Auto-Pulse ohne Border/Radius */
    .swiss-ai-button:not(.swiss-hover):not(.swiss-click) {
        animation: swissAutoPulse 7s ease-in-out infinite;
    }
    .swiss-ai-button:not(.swiss-hover):not(.swiss-click) .swiss-hover-bg {
        animation: swissAutoBg 7s ease-in-out infinite;
    }
    .swiss-ai-button:not(.swiss-hover):not(.swiss-click) .swiss-text {
        animation: swissAutoText 7s ease-in-out infinite;
    }
    .swiss-ai-button.swiss-hover { transform: scale(1.04); }
    .swiss-ai-button.swiss-click { animation: swissClickPulse 0.5s ease-in-out; }

    /* Own AI: hover-Hintergrund einblenden */
    .own-ai-button:hover .own-hover-bg { opacity: 1 !important; }
    .own-ai-button:active { transform: scale(0.97); }

    @keyframes swissAutoPulse {
        0%, 64.3% { transform: scale(1); }
        75%, 82%  { transform: scale(1.04); }
        100%      { transform: scale(1); }
    }
    @keyframes swissAutoBg {
        0%, 64.3% { opacity: 0; }
        75%, 82%  { opacity: 1; }
        100%      { opacity: 0; }
    }
    @keyframes swissAutoText {
        0%, 64.3% { color: rgb(218, 41, 28); }
        75%, 82%  { color: rgb(255, 255, 255); }
        100%      { color: rgb(218, 41, 28); }
    }
    @keyframes swissClickPulse {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.04); }
        100% { transform: scale(1); }
    }
</style>
