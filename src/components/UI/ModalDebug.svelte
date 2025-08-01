<!-- src/components/UI/ModalDebug.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    import { slide, fade } from 'svelte/transition';
    import { 
        isLoggedIn, 
        dailyLimit, 
        currentAccount, 
        userProfile, 
        accountTier,
        successfulStoryRequests,
        isDisabled,
        currentLanguage,
        darkMode
    } from '../../stores/appStores.js';
    import { isLoggingIn, loginError, loginWithMagicLink } from '../../stores/accountStore.js';
    import { 
        showSuccess, 
        showError, 
        showWarning, 
        showInfo,
        showMagicLinkSending,
        showMagicLinkSent,
        showMagicLinkVerifying,
        showMagicLinkVerified,
        showMagicLinkVerificationFailed,
        showAccountLoginSuccess,
        showAccountLogoutSuccess
    } from '../../stores/modalStore.js';
    
    // Import translations
    import { translations } from '../../stores/contentStore.js';

    const dispatch = createEventDispatcher();

    export let isVisible = false;

    // Active tab state
    let activeTab = 'account';

    function closeModal() {
        dispatch('close');
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    // Test Functions
    async function testLogin() {
        try {
            await loginWithMagicLink('test@example.com', 'Test User');
            showSuccess('Login test completed!', 2000);
        } catch (error) {
            showError('Login test failed: ' + error.message, 3000);
        }
    }

    function testDailyLimit() {
        dailyLimit.set({ limit: 5, used: 3 });
        showInfo('Daily limit set to 3/5', 2000);
    }

    function testProAccount() {
        accountTier.set('pro');
        isLoggedIn.set(true);
        currentAccount.set({
            email: 'pro@example.com',
            name: 'Pro User',
            verified: true
        });
        showSuccess('Pro account activated!', 2000);
    }

    function testFreeAccount() {
        accountTier.set('free');
        isLoggedIn.set(true);
        currentAccount.set({
            email: 'free@example.com',
            name: 'Free User',
            verified: true
        });
                    showSuccess($translations?.accountManager?.messages?.freeAccountActivated || 'Free account activated!', 2000);
    }

    function testGuestAccount() {
        isLoggedIn.set(false);
        currentAccount.set(null);
        accountTier.set('free');
        dailyLimit.set({ limit: 5, used: 0 });
        showInfo('Guest account activated!', 2000);
    }

    function testDailyLimitExceeded() {
        dailyLimit.set({ limit: 5, used: 5 });
        showWarning('Daily limit exceeded!', 3000);
    }

    function testStoryGeneration() {
        successfulStoryRequests.update(n => n + 1);
        showSuccess('Story generated!', 2000);
    }

    function testDarkMode() {
        darkMode.update(value => !value);
        showInfo('Dark mode toggled!', 2000);
    }

    function testLanguageChange() {
        const languages = ['en', 'de', 'fr', 'es', 'ja', 'ko', 'tlh', 'sjn'];
        const randomLang = languages[Math.floor(Math.random() * languages.length)];
        currentLanguage.set(randomLang);
        showInfo(`Language changed to ${randomLang}!`, 2000);
    }

    function testModalSystem() {
        showSuccess('Success modal test!', 2000);
        setTimeout(() => showError('Error modal test!', 2000), 500);
        setTimeout(() => showWarning('Warning modal test!', 2000), 1000);
        setTimeout(() => showInfo('Info modal test!', 2000), 1500);
    }

    // Modal Test Functions
    function testMagicLinkSending() {
        showMagicLinkSending('test@example.com');
    }

    function testMagicLinkSent() {
        showMagicLinkSent('test@example.com');
    }

    function testMagicLinkVerifying() {
        showMagicLinkVerifying('test@example.com');
    }

    function testMagicLinkVerified() {
        showMagicLinkVerified('test@example.com', 'TestUser');
    }

    function testMagicLinkVerificationFailed() {
        showMagicLinkVerificationFailed('Invalid token');
    }

    function testAccountLoginSuccess() {
        showAccountLoginSuccess('TestUser');
    }

    function testAccountLogoutSuccess() {
        showAccountLogoutSuccess();
    }

    function testModalSequence() {
        // Simulate complete magic link flow
        showMagicLinkSending('test@example.com');
        setTimeout(() => {
            showMagicLinkSent('test@example.com');
        }, 2000);
        setTimeout(() => {
            showMagicLinkVerifying('test@example.com');
        }, 4000);
        setTimeout(() => {
            showMagicLinkVerified('test@example.com', 'TestUser');
        }, 6000);
    }

    function clearAllData() {
        isLoggedIn.set(false);
        currentAccount.set(null);
        accountTier.set('free');
        dailyLimit.set({ limit: 5, used: 0 });
        successfulStoryRequests.set(0);
        loginError.set(null);
        isLoggingIn.set(false);
        showSuccess('All data cleared!', 2000);
    }

    function eraseLocalStorage() {
        try {
            localStorage.clear();
            sessionStorage.clear();
            showSuccess('Local storage cleared! 🗑️', 2000);
        } catch (error) {
            showError('Failed to clear storage: ' + error.message, 3000);
        }
    }

    function eraseAndReload() {
        try {
            localStorage.clear();
            sessionStorage.clear();
            showSuccess('Storage cleared, reloading... 🔄', 2000);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            showError('Failed to clear and reload: ' + error.message, 3000);
        }
    }

    function testAccountData() {
        currentAccount.set({
            email: 'test@example.com',
            name: 'Test User',
            magicLinkSent: true,
            sentAt: new Date().toISOString()
        });
        showInfo('Account data set!', 2000);
    }
</script>

{#if isVisible}
    <div 
        class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        on:click={handleBackdropClick}
        on:keydown={(e) => e.key === 'Escape' && handleBackdropClick(e)}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="bg-white dark:bg-aubergine-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            transition:slide={{ duration: 300, axis: 'y' }}
        >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-aubergine-900">
                <div class="flex items-center space-x-3">
                    <span class="text-2xl">🐛</span>
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Debug Panel
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Test all features and states
                        </p>
                    </div>
                </div>
                <button
                    on:click={closeModal}
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span class="text-xl">×</span>
                </button>
            </div>

            <!-- Tab Navigation -->
            <div class="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-aubergine-900">
                <button
                    class="flex-1 px-4 py-2 text-sm font-medium transition-colors {activeTab === 'account' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-aubergine-800' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
                    on:click={() => activeTab = 'account'}
                >
                    👤 Account
                </button>
                <button
                    class="flex-1 px-4 py-2 text-sm font-medium transition-colors {activeTab === 'system' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-aubergine-800' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
                    on:click={() => activeTab = 'system'}
                >
                    ⚙️ System
                </button>
                <button
                    class="flex-1 px-4 py-2 text-sm font-medium transition-colors {activeTab === 'modals' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-aubergine-800' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
                    on:click={() => activeTab = 'modals'}
                >
                    📢 Modals
                </button>
                <button
                    class="flex-1 px-4 py-2 text-sm font-medium transition-colors {activeTab === 'actions' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-aubergine-800' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
                    on:click={() => activeTab = 'actions'}
                >
                    🛠️ Actions
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-4">
                {#if activeTab === 'account'}
                    <!-- Account Tab -->
                    <div class="space-y-4">
                        <!-- Status Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Account Status -->
                            <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account Status</h3>
                                <div class="space-y-2 text-xs">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Logged In:</span>
                                        <span class="font-mono {$isLoggedIn ? 'text-green-600' : 'text-red-600'}">
                                            {$isLoggedIn ? '✓' : '✗'}
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Tier:</span>
                                        <span class="font-mono text-blue-600">{$accountTier}</span>
                                    </div>
                                    {#if $currentAccount}
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Email:</span>
                                        <span class="font-mono text-gray-800 dark:text-gray-200 truncate">{$currentAccount.email}</span>
                                    </div>
                                    {/if}
                                </div>
                            </div>

                            <!-- Daily Limit -->
                            <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Daily Limit</h3>
                                <div class="space-y-2 text-xs">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Used:</span>
                                        <span class="font-mono text-red-600">{$dailyLimit?.used || 0}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Limit:</span>
                                        <span class="font-mono text-blue-600">{$dailyLimit?.limit || 5}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Remaining:</span>
                                        <span class="font-mono text-green-600">{Math.max(0, ($dailyLimit?.limit || 5) - ($dailyLimit?.used || 0))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Account Test Buttons -->
                        <div class="grid grid-cols-2 gap-2">
                            <button on:click={testLogin} class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors">
                                🔐 Test Login
                            </button>
                            <button on:click={testProAccount} class="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-colors">
                                💎 {$translations?.accountManager?.tiers?.proAccount || 'Pro Account'}
                            </button>
                            <button on:click={testFreeAccount} class="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition-colors">
                                ✨ {$translations?.accountManager?.tiers?.freeAccount || 'Free Account'}
                            </button>
                            <button on:click={testGuestAccount} class="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors">
                                👤 Guest Account
                            </button>
                            <button on:click={testDailyLimit} class="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors">
                                📊 Set Limit (3/5)
                            </button>
                            <button on:click={testDailyLimitExceeded} class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors">
                                ⚠️ Exceed Limit
                            </button>
                        </div>
                    </div>

                {:else if activeTab === 'system'}
                    <!-- System Tab -->
                    <div class="space-y-4">
                        <!-- System Status -->
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">System Status</h3>
                            <div class="grid grid-cols-2 gap-4 text-xs">
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Language:</span>
                                        <span class="font-mono text-blue-600">{$currentLanguage}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Dark Mode:</span>
                                        <span class="font-mono {$darkMode ? 'text-purple-600' : 'text-yellow-600'}">
                                            {$darkMode ? '✓' : '✗'}
                                        </span>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Stories:</span>
                                        <span class="font-mono text-green-600">{$successfulStoryRequests || 0}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Disabled:</span>
                                        <span class="font-mono {$isDisabled ? 'text-red-600' : 'text-green-600'}">
                                            {$isDisabled ? '✓' : '✗'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- System Test Buttons -->
                        <div class="grid grid-cols-2 gap-2">
                            <button on:click={testDarkMode} class="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition-colors">
                                🌙 Toggle Dark Mode
                            </button>
                            <button on:click={testLanguageChange} class="px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs font-medium transition-colors">
                                🌍 Random Language
                            </button>
                            <button on:click={testStoryGeneration} class="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors">
                                📝 Generate Story
                            </button>
                            <button on:click={testModalSystem} class="px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-medium transition-colors">
                                📢 Test Modals
                            </button>
                        </div>
                    </div>

                {:else if activeTab === 'modals'}
                    <!-- Modals Tab -->
                    <div class="space-y-4">
                        <!-- Magic Link Flow -->
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Magic Link Flow</h3>
                            <div class="grid grid-cols-2 gap-2">
                                <button on:click={testMagicLinkSending} class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    📤 Sending
                                </button>
                                <button on:click={testMagicLinkSent} class="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    ✅ Sent
                                </button>
                                <button on:click={testMagicLinkVerifying} class="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    🔍 Verifying
                                </button>
                                <button on:click={testMagicLinkVerified} class="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    🎉 Verified
                                </button>
                                <button on:click={testMagicLinkVerificationFailed} class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    ❌ Failed
                                </button>
                                <button on:click={testModalSequence} class="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    🔄 Complete Flow
                                </button>
                            </div>
                        </div>

                        <!-- Account Actions -->
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account Actions</h3>
                            <div class="grid grid-cols-2 gap-2">
                                <button on:click={testAccountLoginSuccess} class="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    👋 Login Success
                                </button>
                                <button on:click={testAccountLogoutSuccess} class="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    👋 Logout Success
                                </button>
                            </div>
                        </div>
                    </div>

                {:else if activeTab === 'actions'}
                    <!-- Actions Tab -->
                    <div class="space-y-4">
                        <!-- Data Management -->
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Data Management</h3>
                            <div class="grid grid-cols-1 gap-2">
                                <button on:click={clearAllData} class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    🗑️ Clear All Data
                                </button>
                                <button on:click={eraseLocalStorage} class="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    🧹 Erase Storage
                                </button>
                                <button on:click={eraseAndReload} class="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-colors">
                                    🔄 Erase & Reload
                                </button>
                            </div>
                        </div>

                        <!-- Account Data -->
                        {#if $currentAccount}
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account Data</h3>
                            <div class="space-y-2 text-xs">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Magic Link Sent:</span>
                                    <span class="font-mono {$currentAccount.magicLinkSent ? 'text-green-600' : 'text-red-600'}">
                                        {$currentAccount.magicLinkSent ? '✓' : '✗'}
                                    </span>
                                </div>
                                {#if $currentAccount.sentAt}
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Sent At:</span>
                                    <span class="font-mono text-gray-800 dark:text-gray-200 text-xs">{$currentAccount.sentAt}</span>
                                </div>
                                {/if}
                            </div>
                            <button on:click={testAccountData} class="w-full mt-3 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors">
                                📧 Set Account Data
                            </button>
                        </div>
                        {/if}

                        <!-- Error Status -->
                        {#if $loginError}
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Error Status</h3>
                            <div class="space-y-2 text-xs">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Has Error:</span>
                                    <span class="font-mono text-red-600">✓</span>
                                </div>
                            </div>
                            <button on:click={() => showError($loginError, 5000)} class="w-full mt-3 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors">
                                🚨 Show Error Modal
                            </button>
                        </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-aubergine-900">
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Press ESC to close
                    </span>
                    <button
                        on:click={closeModal}
                        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if} 