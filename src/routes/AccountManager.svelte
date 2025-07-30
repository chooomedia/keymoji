<!-- src/routes/AccountManager.svelte -->
<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fade, fly } from 'svelte/transition';
    import Header from '../components/Layout/Header.svelte';
    import FixedMenu from '../widgets/FixedMenu.svelte';
    import { 
        isLoggedIn, 
        dailyLimit, 
        accountSettings, 
        isGuestUser, 
        isProUser, 
        currentAccount, 
        userProfile, 
        accountTier,
        successfulStoryRequests,
        isDisabled,
        translations,
        currentLanguage
    } from '../stores/appStores.js';
    import { loginWithMagicLink, isLoggingIn, loginError } from '../stores/accountStore.js';
    import { WEBHOOKS } from '../config/api.js';

    // Toggle state
    let showBenefitsToggle = 'free';
    let email = '';
    let name = '';
    let showProfileForm = false;
    let isSubmitting = false;
    let showSettings = false;

    // Email validation
    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    $: isEmailValid = validateEmail(email);
    $: isNameValid = name.trim().length >= 2;
    $: isFormValid = isEmailValid && (showProfileForm ? isNameValid : true);

    function validateEmail(email) {
        return EMAIL_REGEX.test(email);
    }

    function inputClasses(isValid) {
        return `contact-input ${isValid ? 'border-green-400 focus:ring-green-500' : 'border-red-400 focus:ring-red-500'}`;
    }

    function getRemainingGenerations() {
        const limit = $dailyLimit?.limit || 5;
        const used = $dailyLimit?.used || 0;
        return Math.max(0, limit - used);
    }

    function navigateToHome() {
        navigate('/', { replace: true });
    }

    async function handleLogin(event) {
        event.preventDefault();
        isSubmitting = true;

        try {
            await loginWithMagicLink(email, name);
            // Success will be handled by the store
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            isSubmitting = false;
        }
    }

    onMount(() => {
        // Initialize with current account data if available
        if ($currentAccount?.email) {
            email = $currentAccount.email;
            name = $currentAccount.name || '';
        }
    });
</script>

<svelte:head>
    <title>Account Management - Keymoji</title>
    <meta name="description" content="Manage your Keymoji account and security settings" />
</svelte:head>

<!-- App Container -->
<main class="app-container" data-lang={$currentLanguage}>
    <!-- Header -->
    <Header />
    
    <!-- Main Content Container -->
    <div class="min-h-screen scroll-smooth overflow-x-hidden" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center min-h-screen py-32 px-4 z-10 gap-4 scroll-smooth overflow-x-hidden w-full">

            <!-- Main Heading -->
            <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
                <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                    Account Management
                </h1>
                <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                    Manage your security settings and account preferences
                </p>
            </div>

            <!-- Account Content -->
            <div class="content-wrapper pb-4 w-11/12 md:w-26r rounded-xl bg-creme-500 dark:bg-aubergine-800">
                <!-- Account Status -->
                {#if $isLoggedIn}
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-black dark:text-white mb-2">
                                    Welcome back, {$userProfile?.name || 'User'}! 👋
                                </h2>
                                <p class="text-gray-600 dark:text-gray-400">
                                    {$currentAccount?.email}
                                </p>
                            </div>
                            <div class="text-right">
                                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold {$accountTier === 'pro' ? 'dark:text-white bg-purple-700' : 'dark:text-white bg-yellow-700'}" >
                                    {$accountTier === 'pro' ? '💎 PRO' : '✨ FREE'}
                                </span>
                            </div>
                        </div>

                        <!-- Daily Limit Status -->
                        <div class="bg-creme-500 dark:bg-aubergine-900 rounded-xl p-4 mb-5">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    Daily Generations
                                </span>
                                <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                    {getRemainingGenerations()} / {$dailyLimit?.limit || 5} remaining
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-aubergine-600 rounded-full h-3 mb-2">
                                <div 
                                    class="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                                    style="width: {Math.min(100, (($dailyLimit?.used || 0) / ($dailyLimit?.limit || 5)) * 100)}%"
                                ></div>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {getRemainingGenerations() > 0 ? 'You can still generate emojis!' : 'Daily limit reached. Upgrade to PRO for unlimited generations.'}
                            </p>
                        </div>

                        <!-- Account Statistics -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="text-center p-4 bg-gray-200 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {$successfulStoryRequests || 0}
                                </div>
                                <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Stories Generated
                                </div>
                            </div>
                            <div class="text-center p-4 bg-gray-200 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {$accountTier === 'pro' ? '∞' : getRemainingGenerations()}
                                </div>
                                <div class="text-sm font-medium text-green-800 dark:text-green-200">
                                    Remaining Generations
                                </div>
                            </div>
                        </div>

                        <!-- Settings Section -->
                        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Account Settings</h3>
                            <div class="space-y-3">
                                <button class="w-full text-left p-4 rounded-lg bg-gray-300 dark:bg-aubergine-950 transition-colors">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <span class="text-xl mr-3">🔐</span>
                                            <span class="font-medium text-black dark:text-white">Security Settings</span>
                                        </div>
                                        <span class="text-gray-400">→</span>
                                    </div>
                                </button>
                                <button class="w-full text-left p-4 rounded-lg bg-gray-300 dark:bg-aubergine-950 transition-colors">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <span class="text-xl mr-3">📧</span>
                                            <span class="font-medium text-black dark:text-white">Email Preferences</span>
                                        </div>
                                        <span class="text-gray-400">→</span>
                                    </div>
                                </button>
                                <button class="w-full text-left p-4 rounded-lg bg-gray-300 dark:bg-aubergine-950 transition-colors">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <span class="text-xl mr-3">🗑️</span>
                                            <span class="font-medium text-black dark:text-white">Delete Account</span>
                                        </div>
                                        <span class="text-gray-400">→</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Home Button -->
                        {#if getRemainingGenerations() > 0}
                        <div class="text-center mt-6">
                            <button
                                on:click={navigateToHome}
                                class="btn btn-primary btn-md rounded-full"
                                aria-label="Back to home"
                            >
                                <span class="text-xl">🏠</span>
                                Back to Home
                            </button>
                        </div>
                        {/if}
                    </div>
                {:else}
                    <!-- Benefits Toggle -->
                    <div class="p-4">
                        <div class="relative h-20 bg-gray-200 dark:bg-aubergine-900 rounded-full shadow-inner p-2 overflow-hidden mb-4">
                            <div
                                class="absolute inset-y-2 left-2 bg-white dark:bg-aubergine-800 rounded-full shadow-lg transition-transform duration-500 ease-in-out"
                                style="width: calc(50% - 4px); transform: translateX({showBenefitsToggle === 'pro' ? 'calc(100% - 6px)' : '0'})"
                            ></div>
                            <div class="relative flex h-full">
                                <button
                                    class="flex-1 flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10"
                                    on:click={() => showBenefitsToggle = 'free'}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        FREE
                                    </span>
                                    <span class="text-sm transition-colors duration-300 text-gray-700 dark:text-gray-200">
                                        ✨ Kostenlose Sicherheit
                                    </span>
                                </button>
                                <button
                                    class="flex-1 flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10"
                                    on:click={() => showBenefitsToggle = 'pro'}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        PRO
                                    </span>
                                    <span class="text-sm transition-colors duration-300 text-gray-500 dark:text-gray-500">
                                        💎 Enterprise Security
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Benefits Content -->
                        <div class="relative min-h-[400px] mb-5">
                            <!-- FREE Benefits -->
                            <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'free' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}">
                                <div class="space-y-4">
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">✓</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">Unbegrenzte sichere Generierungen</span>
                                            <p class="text-gray-600 dark:text-gray-400">KI-resistente Technologie</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">🔒</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">Erweiterte Datenschutz-Kontrollen</span>
                                            <p class="text-gray-600 dark:text-gray-400">Deine Daten bleiben privat</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">📱</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">Geräteübergreifende Synchronisation</span>
                                            <p class="text-gray-600 dark:text-gray-400">Sicherer Zugriff von überall</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- PRO Benefits -->
                            <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'pro' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}">
                                <div class="space-y-4">
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">🧠</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">KI-gestützte Bedrohungserkennung</span>
                                            <p class="text-gray-600 dark:text-gray-400">Proaktive Sicherheitsanalyse</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">🌐</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">Browser-Erweiterung (Q4 2025)</span>
                                            <p class="text-gray-600 dark:text-gray-400">Sicherheit überall im Web</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">📝</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">WordPress-Plugin (Q4 2025)</span>
                                            <p class="text-gray-600 dark:text-gray-400">Sicherheit in deine Website integrieren</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Login Form -->
                        <div class="bg-transparent mb-8">      
                            <form on:submit={handleLogin} class="space-y-4">
                                <div>
                                    <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        bind:value={email}
                                        class={inputClasses(isEmailValid)}
                                        placeholder="📧 your@email.com"
                                        required
                                    />
                                </div>

                                {#if showProfileForm}
                                <div>
                                    <label for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        bind:value={name}
                                        class={inputClasses(isNameValid)}
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                {/if}

                            <div class="flex flex-col gap-4 justify-center">
                                <button
                                    type="submit"
                                    class="btn btn-primary py-4 {(!isFormValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}"
                                    disabled={isSubmitting || !isFormValid}
                                >
                                    {#if isSubmitting}
                                        <span class="animate-spin mr-1">⏳</span>
                                        Sending Magic Link...
                                    {:else}
                                        <span class="mr-1">🔐</span>
                                        Send Magic Link
                                    {/if}
                                </button>
                                <button
                                on:click={() => showProfileForm = !showProfileForm}
                                class="btn btn-secondary btn-md rounded-full"
                            >
                            <span class="mr-1.5">👤</span>{showProfileForm ? 'Hide' : 'Add'} Data
                            </button>
                            </div>
                            </form>

                            {#if $loginError}
                            <div class="mt-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                {$loginError}
                            </div>
                            {/if}
                        </div>

                        <!-- Footer -->
                        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                <span class="flex items-center">
                                    <span class="text-green-500 mr-2">🔒</span>
                                    Secure & Private
                                </span>
                                <span class="flex items-center">
                                    <span class="text-blue-500 mr-2">⚡</span>
                                    Instant Setup
                                </span>
                                <span class="flex items-center">
                                    <span class="text-purple-500 mr-2">🎯</span>
                                    No Spam
                                </span>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </section>
    </div>

    <!-- Fixed Menu -->
    <FixedMenu align={'bottom'} />
</main> 