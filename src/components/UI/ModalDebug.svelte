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
    import { accountData, isLoggingIn, loginError, loginWithMagicLink } from '../../stores/accountStore.js';
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

    const dispatch = createEventDispatcher();

    export let isVisible = false;

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
        showSuccess('Free account activated!', 2000);
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
        accountData.set({
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
        class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        on:click={handleBackdropClick}
        on:keydown={(e) => e.key === 'Escape' && handleBackdropClick(e)}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="bg-white dark:bg-aubergine-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            transition:slide={{ duration: 300, axis: 'y' }}
        >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    🐛 Debug Panel - Test All Features
                </h2>
                <button
                    on:click={closeModal}
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <span class="text-2xl">×</span>
                </button>
            </div>

            <!-- Content -->
            <div class="p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <!-- Account Status -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Status</h3>
                        
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Logged In:</span>
                                    <span class="font-mono {$isLoggedIn ? 'text-green-600' : 'text-red-600'}">
                                        {$isLoggedIn ? 'true' : 'false'}
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Account Tier:</span>
                                    <span class="font-mono text-blue-600">{$accountTier}</span>
                                </div>
                                {#if $currentAccount}
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Email:</span>
                                    <span class="font-mono text-gray-800 dark:text-gray-200">{$currentAccount.email}</span>
                                </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Account Test Buttons -->
                        <div class="space-y-2">
                            <button on:click={testLogin} class="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                                🔐 Test Login
                            </button>
                            <button on:click={testProAccount} class="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm">
                                💎 Activate Pro
                            </button>
                            <button on:click={testFreeAccount} class="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm">
                                ✨ Activate Free
                            </button>
                            <button on:click={testGuestAccount} class="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm">
                                👤 Activate Guest
                            </button>
                        </div>
                    </div>

                    <!-- Daily Limit -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Limit</h3>
                        
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
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

                        <!-- Daily Limit Test Buttons -->
                        <div class="space-y-2">
                            <button on:click={testDailyLimit} class="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm">
                                📊 Set Daily Limit (3/5)
                            </button>
                            <button on:click={testDailyLimitExceeded} class="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
                                ⚠️ Exceed Daily Limit
                            </button>
                        </div>
                    </div>

                    <!-- Story Requests -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Story Requests</h3>
                        
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Successful:</span>
                                    <span class="font-mono text-green-600">{$successfulStoryRequests || 0}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Disabled:</span>
                                    <span class="font-mono {$isDisabled ? 'text-red-600' : 'text-green-600'}">
                                        {$isDisabled ? 'true' : 'false'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Story Test Buttons -->
                        <div class="space-y-2">
                            <button on:click={testStoryGeneration} class="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                                📝 Generate Story
                            </button>
                        </div>
                    </div>

                    <!-- System Tests -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Tests</h3>
                        
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Language:</span>
                                    <span class="font-mono text-blue-600">{$currentLanguage}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Dark Mode:</span>
                                    <span class="font-mono {$darkMode ? 'text-purple-600' : 'text-yellow-600'}">
                                        {$darkMode ? 'true' : 'false'}
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Logging In:</span>
                                    <span class="font-mono {$isLoggingIn ? 'text-yellow-600' : 'text-gray-600'}">
                                        {$isLoggingIn ? 'true' : 'false'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- System Test Buttons -->
                        <div class="space-y-2">
                            <button on:click={testDarkMode} class="w-full px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm">
                                🌙 Toggle Dark Mode
                            </button>
                            <button on:click={testLanguageChange} class="w-full px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm">
                                🌍 Random Language
                            </button>
                            <button on:click={testModalSystem} class="w-full px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded text-sm">
                                📢 Test Modals
                            </button>
                        </div>
                    </div>

                    <!-- Modal Tests -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modal Tests</h3>
                        
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Magic Link Flow:</span>
                                    <span class="font-mono text-blue-600">Complete</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Account Actions:</span>
                                    <span class="font-mono text-green-600">Available</span>
                                </div>
                            </div>
                        </div>

                        <!-- Modal Test Buttons -->
                        <div class="space-y-2">
                            <button on:click={testModalSequence} class="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm">
                                🔄 Complete Magic Link Flow
                            </button>
                            <button on:click={testMagicLinkSending} class="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                                📤 Magic Link Sending
                            </button>
                            <button on:click={testMagicLinkSent} class="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                                ✅ Magic Link Sent
                            </button>
                            <button on:click={testMagicLinkVerifying} class="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm">
                                🔍 Magic Link Verifying
                            </button>
                            <button on:click={testMagicLinkVerified} class="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                                🎉 Magic Link Verified
                            </button>
                            <button on:click={testMagicLinkVerificationFailed} class="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
                                ❌ Magic Link Failed
                            </button>
                            <button on:click={testAccountLoginSuccess} class="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                                👋 Account Login Success
                            </button>
                            <button on:click={testAccountLogoutSuccess} class="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm">
                                👋 Account Logout Success
                            </button>
                        </div>
                    </div>

                    <!-- Account Data -->
                    {#if $accountData}
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Data</h3>
                        
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Magic Link Sent:</span>
                                    <span class="font-mono {$accountData.magicLinkSent ? 'text-green-600' : 'text-red-600'}">
                                        {$accountData.magicLinkSent ? 'true' : 'false'}
                                    </span>
                                </div>
                                {#if $accountData.sentAt}
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Sent At:</span>
                                    <span class="font-mono text-gray-800 dark:text-gray-200">{$accountData.sentAt}</span>
                                </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Account Data Test Buttons -->
                        <div class="space-y-2">
                            <button on:click={testAccountData} class="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                                📧 Set Account Data
                            </button>
                        </div>
                    </div>
                    {/if}

                    <!-- Error Status -->
                    {#if $loginError}
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Error Status</h3>
                        
                        <div class="bg-gray-50 dark:bg-aubergine-700 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Has Error:</span>
                                    <span class="font-mono text-red-600">true</span>
                                </div>
                            </div>
                        </div>

                        <!-- Error Test Button -->
                        <div class="space-y-2">
                            <button on:click={() => showError($loginError, 5000)} class="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
                                🚨 Show Error Modal
                            </button>
                        </div>
                    </div>
                    {/if}
                </div>

                <!-- Global Actions -->
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Actions</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button on:click={clearAllData} class="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium">
                            🗑️ Clear All Data
                        </button>
                        <button on:click={eraseLocalStorage} class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium">
                            🧹 Erase Storage
                        </button>
                        <button on:click={eraseAndReload} class="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium">
                            🔄 Erase & Reload
                        </button>
                    </div>
                    <div class="mt-4 text-center">
                        <button on:click={closeModal} class="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium">
                            ❌ Close Debug
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if} 