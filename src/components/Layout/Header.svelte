<script>
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { hamburger, logo } from "../../assets/shapes.js";
    import { isDisabled, showDonateMenu, isLoggedIn, currentAccount, dailyLimit, accountTier } from '../../stores/appStores.js';
    import { currentLanguage, t, showLanguageMenu, changeLanguage } from '../../stores/contentStore.js';
    import GitButton from '../../widgets/GitButton.svelte';
    import { createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-routing';
    import LanguageSwitcher from '../LanguageSwitcher.svelte';
    import { supportedLanguages } from '../../utils/languages.js';
    import { translations } from '../../stores/contentStore.js';
    import { navigateToBlog } from '../../utils/navigation.js';
    import Button from '../UI/Button.svelte';
    import { showModal } from '../../stores/modalStore.js';

    const dispatch = createEventDispatcher();
    
    // Calculate remaining generations - REACTIVE
    $: remaining = $dailyLimit.limit - $dailyLimit.used;
    $: isProUser = $accountTier === 'pro';
    $: showBadge = $isLoggedIn; // Only show badge when logged in
    
    // DEBUG: Log badge state
    $: if (typeof window !== 'undefined') {
        console.log('🏷️ Header Badge State:', {
            showBadge,
            isLoggedIn: $isLoggedIn,
            remaining,
            dailyLimit: $dailyLimit,
            isProUser,
            accountTier: $accountTier
        });
    }

    // Reaktive Übersetzungen mit robuster Fehlerbehandlung
    $: headerTitle = $translations && $translations.header && $translations.header.pageTitle 
        ? $translations.header.pageTitle 
        : 'Keymoji';
    
    function handleBlogNavigation() {
        navigateToBlog(false);
    }

    function navigateToAccount() {
        navigate('/account', { replace: true });
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
                featureName: $translations?.accountManager?.proFeatureModal?.unlimitedGenerations || 'Unlimited Story Generations',
                featureDescription: $translations?.accountManager?.proFeatureModal?.unlimitedGenerationsDesc || 'Upgrade to Pro for unlimited daily story generations and access to all premium features.',
                onUpgrade: handleProUpgrade
            });
        }
    }
    
    function handleProUpgrade() {
        // Navigate to account page for upgrade
        navigate('/account', { replace: true });
    }

    async function handleLanguageChange(langCode) {
        await changeLanguage(langCode);
        showLanguageMenu.set(false);
    }

    onMount(() => {
        const handleClickOutside = (event) => {
            if ($showLanguageMenu && !event.target.closest('#language-dropdown-menu') && !event.target.closest('#language-toggle-button')) {
                showLanguageMenu.set(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<!-- Header mit Logo links, Buttons rechts -->
<div class="main-header w-full flex flex-wrap justify-center pt-5 mx-auto bg-transparent backdrop-blur-md">
    <nav class="md:w-1/3 w-full mx-3 bg-creme-500 dark:bg-aubergine-800 justify-center rounded-full p-1 relative z-30 shadow-lg">
        <div class="max-w-screen-2xl flex items-center justify-between">
            <!-- Logo und Titel links -->
            <div class="flex items-center">
                <h2 class="flex flex-wrap md:text-2xl font-semibold items-center whitespace-nowrap dark:text-white">
                    <a 
                        href="/{$currentLanguage}/" 
                        class="flex items-center hover:text-yellow transition-colors"
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
                            {@html logo}
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
                <div class="relative">
                    <button
                        type="button"
                        class="transition-all transform hover:scale-105 focus:scale-105 active:scale-95 rounded-full font-medium focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 px-4 py-3 h-14 flex items-center justify-center"
                        on:click={navigateToAccount}
                        aria-label={$isLoggedIn ? ($translations?.header?.accountTooltip || 'Account Settings') : ($translations?.header?.loginTooltip || 'Login / Create Account')}
                        title={$isLoggedIn ? ($translations?.header?.accountTooltip || 'Account Settings') : ($translations?.header?.loginTooltip || 'Login / Create Account')}
                    >
                        <span class="text-xl">{#if $isLoggedIn}👤{:else}🔐{/if}</span>
                    </button>
                    
                    <!-- Badge für verbleibende Generierungen -->
                    {#if showBadge}
                        <button
                            type="button"
                            on:click={handleBadgeClick}
                            class="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full text-[0.65rem] font-bold shadow-lg border border-white dark:border-aubergine-900 transition-all transform hover:scale-110 focus:scale-110 active:scale-95 focus:ring-2 focus:ring-offset-1 focus:outline-none {
                                remaining > 0 
                                    ? 'bg-yellow-500 dark:bg-yellow-500 text-aubergine-900 focus:ring-yellow-300' 
                                    : isProUser 
                                        ? 'bg-purple-500 dark:bg-purple-600 text-white focus:ring-purple-300'
                                        : 'bg-yellow-500 dark:bg-yellow-500 text-aubergine-900 focus:ring-yellow-300 animate-pulse'
                            }"
                            aria-label={remaining > 0 ? `${remaining} generations remaining` : isProUser ? 'Unlimited generations' : 'Upgrade to Pro for more'}
                            title={remaining > 0 ? `${remaining} Story-Generierungen verbleibend heute` : isProUser ? '∞ Unlimited Pro' : '💎 Upgrade zu Pro für mehr'}
                        >
                            {#if isProUser}
                                <span class="text-[0.7rem]">∞</span>
                            {:else if remaining > 0}
                                <span class="tabular-nums">{remaining}</span>
                            {:else}
                                <span class="text-[0.65rem]">💎</span>
                            {/if}
                        </button>
                    {/if}
                </div>
                
                <!-- GitHub Button (mobile und desktop) -->
                <a 
                    href="https://github.com/chooomedia/keymoji"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="transition-all transform hover:scale-105 focus:scale-105 active:scale-95 rounded-full font-medium focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 px-4 py-3 h-14 flex items-center justify-center"
                    aria-label={$translations?.header?.githubTooltip || 'Star us on GitHub'}
                    title={$translations?.header?.githubTooltip || 'Star us on GitHub'}
                >
                    <span class="text-xl">⭐</span>
                </a>
            </div>
        </div>
    </nav>
</div>