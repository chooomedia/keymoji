<!-- src/routes/AccountManager.svelte -->
<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fade, fly, slide } from 'svelte/transition';
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
    import { loginWithMagicLink, isLoggingIn, loginError, createAccount } from '../stores/accountStore.js';
    import { showSuccess, showError, showWarning, showInfo } from '../stores/modalStore.js';
    import { WEBHOOKS } from '../config/api.js';
    import UserSettings from '../components/UserSettings.svelte';

    // Toggle state
    let showBenefitsToggle = 'free';
    let email = '';
    let name = '';
    let showProfileForm = false;
    let isSubmitting = false;
    let showSettings = false;
    let showUserSettings = false;
    let accountCreationStep = 'benefits'; // 'benefits', 'form', 'verification'
    let selectedAccountType = 'free'; // 'free', 'pro'
    let showAdvancedOptions = false;

    // Email validation
    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    $: isEmailValid = validateEmail(email);
    $: isNameValid = name.trim().length >= 2;
    $: isFormValid = isEmailValid && (showProfileForm ? isNameValid : true);
    
    // Ensure we always have a valid name for the API
    function getValidName() {
        const trimmedName = name.trim();
        if (trimmedName.length >= 2) {
            return trimmedName;
        }
        // Fallback to email username or default
        return email.split('@')[0] || 'User';
    }

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

    function selectAccountType(type) {
        selectedAccountType = type;
        showBenefitsToggle = type;
    }

    function startAccountCreation() {
        if (accountCreationStep === 'benefits') {
            accountCreationStep = 'form';
        } else {
            accountCreationStep = 'benefits';
        }
    }

    function goBackToBenefits() {
        accountCreationStep = 'benefits';
    }



    async function handleLogin(event) {
        event.preventDefault();
        isSubmitting = true;

        try {
            // Create account first if it's a new user
            if (selectedAccountType === 'pro') {
                await createAccount(
                    `user_${Date.now()}`,
                    email,
                    { name, accountType: 'pro' },
                    { source: 'account_manager', tier: 'pro' }
                );
            }

            await loginWithMagicLink(email, name);
            
            // Show success message
            showSuccess('Magic link sent! Check your email to complete account creation.', 5000);
            
            // Move to verification step
            accountCreationStep = 'verification';
        } catch (error) {
            console.error('Login error:', error);
            showError('Failed to send magic link. Please try again.', 5000);
        } finally {
            isSubmitting = false;
        }
    }

    function resendMagicLink() {
        handleLogin(new Event('submit'));
    }

    onMount(() => {
        // Initialize with current account data if available
        if ($currentAccount?.email) {
            email = $currentAccount.email;
            name = $currentAccount.name || '';
        }
    });

    // Reactive statement to show error as modal
    $: if ($loginError) {
        showError($loginError, 5000);
    }
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
                {#if $isLoggedIn}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        Welcome back, {$userProfile?.name || $currentAccount?.name || 'User'}! 👋
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        Ready to create some amazing emoji passwords? Your account is secure and ready to go!
                    </p>
                {:else if accountCreationStep === 'verification'}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        📧 Check Your Email and Verify
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        {@html `Check your email <strong>${email}</strong> and click the magic link to complete setup`}
                    </p>
                {:else}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        Account Management
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        Manage your security settings and account preferences
                    </p>
                {/if}
            </div>

            <!-- Account Content -->
            <div class="content-wrapper w-11/12 md:w-26r rounded-xl bg-creme-500 dark:bg-aubergine-800">
                <!-- Account Status -->
                {#if $isLoggedIn}
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-6">
                            <div>
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
                        <div class="bg-powder-300 dark:bg-aubergine-900 rounded-xl p-4 mb-5">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    Daily Generations
                                </span>
                                <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                    {getRemainingGenerations()} / {$dailyLimit?.limit || 5} remaining
                                </span>
                            </div>
                            <div class="w-full bg-gray-300 dark:bg-aubergine-600 rounded-full h-3 mb-2">
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
                            <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {$successfulStoryRequests || 0}
                                </div>
                                <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Stories Generated
                                </div>
                            </div>
                            <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {$accountTier === 'pro' ? '∞' : getRemainingGenerations()}
                                </div>
                                <div class="text-sm font-medium text-green-800 dark:text-green-200">
                                    Remaining Generations
                                </div>
                            </div>
                        </div>

                        <!-- Settings Section -->
                        <div class="bg-creme-600 dark:bg-aubergine-800 rounded-lg" transition:slide={{ duration: 300 }}>
                            <UserSettings />
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
                {:else if accountCreationStep === 'verification'}
                    <!-- Verification Step -->
                    <div class="p-4 text-center">
                        <div class="space-y-4">
                            <button
                                on:click={resendMagicLink}
                                disabled={isSubmitting}
                                class="btn btn-primary btn-md rounded-full w-full"
                            >
                                {#if isSubmitting}
                                    <span class="animate-spin mr-1">⏳</span>
                                    Sending...
                                {:else}
                                    <span class="mr-1">🔄</span>
                                    Resend Magic Link
                                {/if}
                            </button>
                            
                            <button
                                on:click={goBackToBenefits}
                                class="btn btn-secondary btn-md rounded-full w-full"
                            >
                                <span class="mr-1">←</span>
                                Back to Account Options
                            </button>
                            
                            <!-- Help Section -->
                            <div class="mt-6 p-4 bg-creme-600 dark:bg-aubergine-900 rounded-xl">
                                <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                    💡 Need Help?
                                </h3>
                                <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>• Check your spam folder if you don't see the email</li>
                                    <li>• Magic links expire after 15 minutes</li>
                                    <li>• You can request a new link anytime</li>
                                    <li>• No password required - just click the link</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                {:else}
                    <!-- Benefits Toggle -->
                    <div class="p-4">
                        <div class="relative h-20 bg-powder-300 dark:bg-aubergine-900 rounded-full shadow-inner p-2 overflow-hidden mb-4">
                            <div
                                class="absolute inset-y-2 left-2 bg-creme-600 dark:bg-aubergine-800 rounded-full shadow-lg transition-transform duration-500 ease-in-out"
                                style="width: calc(50% - 4px); transform: translateX({showBenefitsToggle === 'pro' ? 'calc(100% - 6px)' : '0'})"
                            ></div>
                            <div class="relative flex h-full">
                                <button
                                    class="flex-1 flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10"
                                    on:click={() => selectAccountType('free')}
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
                                    on:click={() => selectAccountType('pro')}
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
                                            <span class="text-md font-bold text-black dark:text-white">5 tägliche sichere Generierungen</span>
                                            <p class="text-gray-600 dark:text-gray-400">KI-resistente Technologie</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">🔒</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">Denzentrale Datenverabeitung</span>
                                            <p class="text-gray-600 dark:text-gray-400">Deine Daten bleiben privat</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">📱</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">Als Webapp nutzbar</span>
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
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">∞</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">Unbegrenzte sichere Generierungen</span>
                                            <p class="text-gray-600 dark:text-gray-400">Keine täglichen Limits</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">🧠</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">KI-gestützte Bedrohungserkennung</span>
                                            <p class="text-gray-600 dark:text-gray-400">Proaktive Sicherheitsanalyse</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
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

                        <!-- Create Account Button -->
                        <div class="text-center mb-6">
                            <button
                                on:click={startAccountCreation}
                                class="btn btn-primary btn-md rounded-full"
                            >
                                <span class="mr-2">🚀</span>
                                {#if accountCreationStep === 'form'}
                                   Auf {selectedAccountType === 'pro' ? 'PRO' : 'FREE'} verzichten
                                {:else}
                                    {selectedAccountType === 'pro' ? 'PRO' : 'FREE'} Account anlegen
                                {/if}
                            </button>
                        </div>

                        <!-- Login Form -->
                        {#if accountCreationStep === 'form'}
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
                                        Sending Magic-Link...
                                    {:else}
                                        <span class="mr-1">🔐</span>
                                        Create Magic-Link
                                    {/if}
                                </button>
                                
                                <!-- Form Validation -->
                                {#if !isFormValid && email}
                                    <div class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                        {#if !isEmailValid}
                                            <p>⚠️ Please enter a valid email address</p>
                                        {/if}
                                        {#if showProfileForm && !isNameValid}
                                            <p>⚠️ Please enter your name (minimum 2 characters)</p>
                                        {/if}
                                    </div>
                                {/if}
                                
                                <button
                                    on:click={() => showProfileForm = !showProfileForm}
                                    class="btn btn-secondary btn-md rounded-full"
                                    >
                                    <span class="mr-1.5">👤</span>{showProfileForm ? 'Hide' : 'Add'} Profile Data
                                </button>
                            </div>
                            </form>

                            {#if $loginError}
                            <!-- Error will be shown as modal via reactive statement -->
                            {/if}
                        </div>
                        {/if}

                        <!-- Footer -->
                        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                <span class="flex items-center">
                                    <span class="text-green-500 mr-2">🔒</span>
                                    Magic link
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