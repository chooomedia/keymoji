<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { slide, fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { hamburger, logo } from '../../assets/shapes';
    import { isDisabled, showDonateMenu, isLoggedIn, currentAccount, dailyLimit, accountTier } from '../../stores/appStores'
    import { currentLanguage, t, showLanguageMenu, changeLanguage } from '../../stores/contentStore';
    import { get } from 'svelte/store';
    import GitButton from '../../widgets/GitButton.svelte';
    import { createEventDispatcher } from 'svelte';
    import { navigate } from '../../utils/routing';
    import LanguageSwitcherComponent from '../LanguageSwitcher.svelte';
    import { supportedLanguages } from '../../utils/languages';
    import { translations } from '../../stores/contentStore';
    import { navigateToBlog } from '../../utils/blogNavigation';
    import Button from '../UI/Button.svelte';
    import { showModal } from '../../stores/modalStore';

    const dispatch = createEventDispatcher();

    // Webpack/Svelte 5: explizite Zuweisung für stabile Komponenten-Referenz
    const LanguageSwitcher = LanguageSwitcherComponent;
    
    const remaining = $derived(Math.max(0, (dailyLimit?.limit || 0) - (dailyLimit?.used || 0)));
    const isProUser = $derived(accountTier === 'pro');
    
    const displayValue = $derived(remaining > 99 ? '99+' : remaining);
    const displayText = $derived(typeof displayValue === 'number' ? String(displayValue) : displayValue);
    
    const showBadge = $derived(isLoggedIn && dailyLimit && typeof dailyLimit.limit === 'number');
    
    let stableBadgeState = $state(false);
    let badgeTimeout: ReturnType<typeof setTimeout> | null = $state(null);
    let previousRemaining = $state(0);
    let isCountingDown = $state(true);
    
    $effect(() => {
        if (badgeTimeout) clearTimeout(badgeTimeout);
        badgeTimeout = setTimeout(() => {
            stableBadgeState = showBadge;
        }, 100);
        
        return () => {
            if (badgeTimeout) clearTimeout(badgeTimeout);
        };
    });
    
    $effect(() => {
        if (remaining !== previousRemaining) {
            isCountingDown = remaining < previousRemaining;
            previousRemaining = remaining;
        }
    });
    
    let lastLoggedState = $state<string | null>(null);
    
    $effect(() => {
        if (typeof window !== 'undefined') {
            const currentState = JSON.stringify({
                showBadge,
                isLoggedIn,
                remaining,
                isProUser
            });
            
            if (currentState !== lastLoggedState) {
                lastLoggedState = currentState;
                console.log('🏷️ Header Badge State:', {
                    showBadge,
                    stableBadgeState,
                    isLoggedIn,
                    remaining,
                    dailyLimit,
                    isProUser,
                    accountTier
                });
            }
        }
    });

    // Ensure logo import is treated as value (not tree-shaken by TS)
    const logoMarkup: string = logo;

    const headerTitle = $derived(translations?.header?.pageTitle || 'Keymoji');
    
    function handleBlogNavigation() {
        navigateToBlog(false);
    }

    function navigateToAccount() {
        // Use language-aware navigation
        const lang = currentLanguage || 'en';
        const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
        navigate(accountPath, { replace: true });
    }
    
    function handleBadgeClick(event) {
        event.stopPropagation(); // Prevent navigating to account page
        
        if (!isProUser && remaining <= 0) {
            // Reset PRO banner in UserSettings (force show again)
            try {
                localStorage.removeItem('keymoji_pro_banner_dismissed');
                console.log('🔄 PRO banner reset (from header badge)');
            } catch (error) {
                console.warn('⚠️ Failed to reset PRO banner:', error);
            }
            
            // Show PRO upgrade modal
            showModal('Pro Feature', 'pro-feature', null, {
                featureName: translations?.accountManager?.proFeatureModal?.unlimitedGenerations || 'Unlimited Story Generations',
                featureDescription: translations?.accountManager?.proFeatureModal?.unlimitedGenerationsDesc || 'Upgrade to Pro for unlimited daily story generations and access to all premium features.',
                onUpgrade: handleProUpgrade
            });
        }
    }
    
    function handleProUpgrade(): void {
        const lang = currentLanguage || 'en';
        const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
        navigate(accountPath, { replace: true });
    }

    async function handleLanguageChange(langCode) {
        await changeLanguage(langCode);
        showLanguageMenu.set(false);
    }

    onMount(() => {
        // Badge timeout cleanup only - LanguageSwitcher handles its own click-outside
        return () => {
            if (badgeTimeout) clearTimeout(badgeTimeout);
        };
    });
</script>

<!-- Header mit Logo links, Buttons rechts -->
<div class="main-header w-full flex flex-wrap justify-center pt-5 mx-auto bg-transparent backdrop-blur-md" style="z-index: 50;">
    <nav class="md:w-1/3 w-full mx-3 bg-creme-500 dark:bg-aubergine-800 justify-center rounded-full p-1 relative z-30 shadow-lg">
        <div class="max-w-screen-2xl flex items-center justify-between">
            <!-- Logo und Titel links -->
            <div class="flex items-center">
                <h2 class="flex flex-wrap md:text-2xl font-semibold items-center whitespace-nowrap dark:text-white">
                    <a 
                        href={currentLanguage === 'en' ? '/' : `/${currentLanguage}`}
                        onclick={(event) => {
                            event.preventDefault();
                            const lang = currentLanguage || 'en';
                            const homePath = lang === 'en' ? '/' : `/${lang}`;
                            navigate(homePath, { replace: true });
                        }}
                        class="flex items-center hover:text-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-aubergine-800 rounded-lg"
                        aria-label={headerTitle}
                        >
                        <!-- Keymoji Logo SVG from shapes.js -->
                        <svg 
                            class="w-14 h-14 transition-transform hover:scale-110" 
                            aria-label="Keymoji Logo"
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 600 600"
                            style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
                        >
                            {@html logoMarkup}
                        </svg>
                        <span class="ml-2">{headerTitle}</span>
                    </a>
                </h2>
            </div>
            
            <!-- Buttons rechts: Language-Switcher und GitHub Button (flex side-by-side) -->
            <div class="flex items-center space-x-2">
                <!-- Language Switcher -->
                <div class="relative">
                    <LanguageSwitcher position="bottom" display="full" showLabels={true} />
                </div>
                
                <!-- Account Button with Badge -->
                <div class="relative z-[70]">
                    <button
                        type="button"
                        class="transition-all transform hover:scale-105 focus:scale-105 active:scale-95 rounded-full font-medium focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 px-4 py-3 h-14 flex items-center justify-center relative"
                        onclick={navigateToAccount}
                        aria-label={isLoggedIn ? (translations?.header?.accountTooltip || 'Account Settings') : (translations?.header?.loginTooltip || 'Login / Create Account')}
                        title={isLoggedIn ? (translations?.header?.accountTooltip || 'Account Settings') : (translations?.header?.loginTooltip || 'Login / Create Account')}
                    >
                        <span class="text-xl">{#if isLoggedIn}👤{:else}🔐{/if}</span>
                    </button>
                    
                    <!-- Badge für verbleibende Generierungen - Sauberer Wrapper ohne Flicker, immer über Header -->
                    {#if stableBadgeState}
                        {#key displayValue}
                            <button
                                type="button"
                                onclick={handleBadgeClick}
                                in:fly={{y: isCountingDown ? 10 : -10, duration: 300, easing: cubicInOut}}
                                out:fly={{y: isCountingDown ? -10 : 10, duration: 300, easing: cubicInOut}}
                                class="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full text-[0.65rem] font-bold shadow-lg border border-white dark:border-aubergine-900 transition-all transform hover:scale-110 focus:scale-110 active:scale-95 focus:ring-2 focus:ring-offset-1 focus:outline-none z-[80] {
                                    remaining > 0 
                                        ? 'bg-yellow-500 dark:bg-yellow-500 text-aubergine-900 focus:ring-yellow-300' 
                                        : isProUser 
                                            ? 'bg-purple-500 dark:bg-purple-600 text-white focus:ring-purple-300'
                                            : 'bg-yellow-500 dark:bg-yellow-500 text-aubergine-900 focus:ring-yellow-300 animate-pulse'
                                }"
                                style="position: absolute; will-change: transform;"
                                aria-label={remaining > 0 ? `${remaining} generations remaining` : isProUser ? 'Unlimited generations' : 'Upgrade to Pro for more'}
                                title={remaining > 0 ? `${remaining} Story-Generierungen verbleibend heute` : isProUser ? '∞ Unlimited Pro' : '💎 Upgrade zu Pro für mehr'}
                            >
                                {#if isProUser}
                                    <span class="text-[0.7rem]">∞</span>
                                {:else if remaining > 0}
                                    <span class="tabular-nums">{displayText}</span>
                                {:else}
                                    <span class="text-[0.65rem]">💎</span>
                                {/if}
                            </button>
                        {/key}
                    {/if}
                </div>
                
                <!-- GitHub Button (mobile und desktop) -->
                <a 
                    href="https://github.com/chooomedia/keymoji"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="transition-all transform hover:scale-105 focus:scale-105 active:scale-95 rounded-full font-medium focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 px-4 py-3 h-14 flex items-center justify-center"
                    aria-label={translations?.header?.githubTooltip || 'Star us on GitHub'}
                    title={translations?.header?.githubTooltip || 'Star us on GitHub'}
                >
                    <span class="text-xl">⭐</span>
                </a>
            </div>
        </div>
    </nav>
</div>