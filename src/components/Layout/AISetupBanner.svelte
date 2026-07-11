<!-- src/components/Layout/AISetupBanner.svelte -->
<!-- Announcement-Bar über dem Header – nur wenn KI nicht eingerichtet -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { navigate } from 'svelte-routing';
    import { isLoggedIn, currentAccount } from 'stores/appStores';
    import { translations, currentLanguage } from '../../stores/contentStore.js';
    import { effectiveSettings, userSettings } from '../../stores/userSettingsStore.js';
    import { bannerDismissed, dismissBanner } from 'stores/bannerStore';

    const ANNOUNCEMENT_INTERVAL_MS = 6500;
    const ANNOUNCEMENT_FLY_DISTANCE_PX = 32;
    const ANNOUNCEMENT_IN_DURATION_MS = 420;
    const ANNOUNCEMENT_OUT_DURATION_MS = 320;
    const OPEN_EXTENSION_PROMO_EVENT = 'keymoji:open-extension-promo';

    let storyModeEnabled = false;
    let storyModeConfigured = false;
    let activeAnnouncementIndex = 0;
    let announcementInterval = null;
    let motionCleanup = null;
    let prefersReducedMotion = false;

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

    $: showStorySetup = !$isLoggedIn || !storyModeEnabled || !storyModeConfigured;
    $: isGerman = String($currentLanguage || '').startsWith('de');
    $: extensionFallbackText = isGerman
        ? '🔥 Keymoji jetzt direkt im Browser nutzen'
        : '🔥 Use Keymoji directly in your browser';
    $: extensionFallbackCta = isGerman ? 'Extension ansehen' : 'See extension';
    $: announcements = [
        ...(showStorySetup
            ? [
                  {
                      id: 'story',
                      text:
                          $translations?.index?.setupStoryModeBannerText ||
                          '✨ Deine Story wird dein sicheres Keymoji',
                      cta:
                          $translations?.index?.setupStoryModeChip ||
                          'Story Mode aktivieren',
                      action: navigateToAISettings
                  }
              ]
            : []),
        {
            id: 'extension',
            text:
                $translations?.index?.extensionBannerText ||
                extensionFallbackText,
            cta:
                $translations?.index?.extensionBannerChip ||
                extensionFallbackCta,
            action: openExtensionPromo
        }
    ];
    $: activeAnnouncement =
        announcements[activeAnnouncementIndex % Math.max(announcements.length, 1)];
    $: showBanner = announcements.length > 0;

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

    function openExtensionPromo() {
        window.dispatchEvent(new CustomEvent(OPEN_EXTENSION_PROMO_EVENT));
    }

    onMount(() => {
        announcementInterval = setInterval(() => {
            if (announcements.length > 1) {
                activeAnnouncementIndex =
                    (activeAnnouncementIndex + 1) % announcements.length;
            }
        }, ANNOUNCEMENT_INTERVAL_MS);

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionPreferenceChange = event => {
            prefersReducedMotion = event.matches;
        };

        prefersReducedMotion = mediaQuery.matches;
        mediaQuery.addEventListener('change', handleMotionPreferenceChange);
        motionCleanup = () => {
            mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
        };
    });

    onDestroy(() => {
        if (announcementInterval) {
            clearInterval(announcementInterval);
            announcementInterval = null;
        }

        if (motionCleanup) {
            motionCleanup();
            motionCleanup = null;
        }
    });
</script>

{#if showBanner && !$bannerDismissed}
    <div
        role="note"
        aria-label={isGerman ? 'Ankündigung' : 'Announcement'}
        class="w-full md:h-8 flex items-center justify-center relative pl-3 pr-8 md:px-8 shrink-0 z-40
               bg-creme-600 dark:bg-aubergine-900
               border-b border-creme-700 dark:border-aubergine-800
               text-gray-700 dark:text-gray-300"
    >
        <div class="announcement-stage py-1 md:py-0 min-w-0">
            {#key activeAnnouncement.id}
                <div
                    class="announcement-item flex items-center gap-1.5 md:gap-2.5 min-w-0"
                    in:fly={{
                        y: prefersReducedMotion ? 0 : ANNOUNCEMENT_FLY_DISTANCE_PX,
                        duration: prefersReducedMotion ? 0 : ANNOUNCEMENT_IN_DURATION_MS,
                        easing: cubicInOut
                    }}
                    out:fly={{
                        y: prefersReducedMotion ? 0 : -ANNOUNCEMENT_FLY_DISTANCE_PX,
                        duration: prefersReducedMotion ? 0 : ANNOUNCEMENT_OUT_DURATION_MS,
                        easing: cubicInOut
                    }}
                >
                    <!-- Informativer Text -->
                    <span class="announcement-text text-xs text-yellow-600 dark:text-yellow-400 truncate md:whitespace-nowrap">
                        {activeAnnouncement.text}
                    </span>

                    <!-- Chip CTA mit Regenbogen-Animation -->
                    <button
                        on:click={activeAnnouncement.action}
                        class="rainbow-chip inline-flex items-center px-2.5 py-1 md:py-0.5 rounded-full text-xs
                               whitespace-nowrap
                               flex-shrink-0
                               focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
                               cursor-pointer text-black font-medium"
                        aria-label={activeAnnouncement.cta}
                    >
                        {activeAnnouncement.cta}
                    </button>
                </div>
            {/key}
        </div>

        <!-- Dismiss – absolut rechts -->
        <button
            on:click={dismissBanner}
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

    .announcement-stage {
        align-items: center;
        display: grid;
        justify-items: center;
        min-height: 1.75rem;
        overflow: hidden;
        width: min(100%, 44rem);
    }

    .announcement-item {
        grid-area: 1 / 1;
        justify-content: center;
        max-width: 100%;
        width: 100%;
    }

    .announcement-text {
        min-width: 0;
    }
</style>
