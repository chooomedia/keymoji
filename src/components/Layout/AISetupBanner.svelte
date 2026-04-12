<!-- src/components/Layout/AISetupBanner.svelte -->
<!-- Announcement-Bar über dem Header – nur wenn KI nicht eingerichtet -->
<script>
    import { navigate } from 'svelte-routing';
    import { isLoggedIn, currentAccount } from 'stores/appStores';
    import { translations, currentLanguage } from '../../stores/contentStore.js';
    import { effectiveSettings, userSettings } from '../../stores/userSettingsStore.js';
    import { darkMode } from 'stores/appStores';
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
</script>

{#if showBanner && !dismissed}
    <div
        role="note"
        aria-label="KI-Setup"
        class="w-full md:h-8 flex items-center justify-center relative pl-3 pr-8 md:px-8 shrink-0 z-40
               bg-creme-600 dark:bg-aubergine-900
               border-b border-creme-700 dark:border-aubergine-800
               text-gray-700 dark:text-gray-300"
    >
        <div class="flex items-center gap-1.5 md:gap-2.5 py-1 md:py-0 min-w-0">

            <!-- Informativer Text -->
            <span class="text-xs text-yellow-600 dark:text-yellow-400 truncate md:whitespace-nowrap">
                {$translations?.index?.setupStoryModeBannerText || '✨ Deine Story wird dein sicheres Keymoji'}
            </span>

            <!-- Chip CTA mit Regenbogen-Animation -->
            <button
                on:click={navigateToAISettings}
                class="rainbow-chip inline-flex items-center px-2.5 py-1 md:py-0.5 rounded-full text-xs
                       whitespace-nowrap
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
                       cursor-pointer text-black font-medium"
                aria-label={$translations?.index?.setupStoryModeChip || 'Story Mode aktivieren'}
            >
                {$translations?.index?.setupStoryModeChip || 'Story Mode aktivieren'}
            </button>
        </div>

        <!-- Dismiss – absolut rechts -->
        <button
            on:click={dismiss}
            class="absolute right-2 p-0.5 rounded text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400
                   transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400"
            aria-label="Close banner"
            title="Close"
        >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
{/if}

<style>
    @keyframes rainbow-shift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .rainbow-chip {
        background: linear-gradient(
            270deg,
            #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #f59e0b
        );
        background-size: 300% 300%;
        animation: rainbow-shift 7s ease infinite;
    }

    .rainbow-chip:hover {
        opacity: 1;
        filter: brightness(1.08);
    }
</style>
