<!-- src/components/UI/ModalDebug.svelte -->
<script>
    import { onMount } from 'svelte';
    import { slide, fly } from 'svelte/transition';
    import { 
        modalMessage, 
        isModalVisible, 
        modalType, 
        modalData,
        getModalHistory,
        getModalStatus,
        clearModalHistory,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showContact,
        showSending
    } from '../../stores/modalStore.js';
    import { 
        darkMode, 
        isDisabled, 
        showDonateMenu,
        userCounter
    } from '../../stores/appStores.js';
    import { 
        currentLanguage, 
        translations,
        changeLanguage
    } from '../../stores/contentStore.js';
    import { isDebugMode } from '../../utils/environment.js';

    let debugVisible = false;
    let modalHistory = [];
    let modalStatus = {};
    let currentTab = 'modals';
    let testEmojis = ['😀', '🎉', '🚀', '💡', '🔥', '⭐', '🎯', '💎'];

    // Toggle debug panel
    function toggleDebug() {
        debugVisible = !debugVisible;
        if (debugVisible) {
            updateDebugInfo();
        }
    }

    // Update debug information
    function updateDebugInfo() {
        modalHistory = getModalHistory();
        modalStatus = getModalStatus();
    }

    // Modal Test Functions
    function testSuccess() {
        showSuccess('This is a success message! 🎉', 3000);
    }

    function testError() {
        showError('This is an error message! ❌', null);
    }

    function testWarning() {
        showWarning('This is a warning message! ⚠️', 5000);
    }

    function testInfo() {
        showInfo('This is an info message! ℹ️', 4000);
    }

    function testContact() {
        showContact('This is a contact message! 💌', 6000);
    }

    function testSending() {
        showSending('Sending your message... 📨');
    }

    function testWithButton() {
        showWarning(
            'This modal has a custom button!',
            0,
            {
                buttonText: 'Custom Action',
                buttonAction: () => {
                    console.log('Custom button clicked!');
                }
            }
        );
    }

    // Store Test Functions
    function toggleDarkMode() {
        darkMode.update(value => !value);
    }

    function toggleDisabled() {
        isDisabled.update(value => !value);
    }

    function toggleDonateMenu() {
        showDonateMenu.update(value => !value);
    }

    function testLanguageChange() {
        const languages = ['en', 'de', 'fr', 'es', 'ja', 'ko', 'tlh', 'sjn'];
        const randomLang = languages[Math.floor(Math.random() * languages.length)];
        changeLanguage(randomLang);
    }

    function testUserCounter() {
        // Simulate counter update
        console.log('User counter test:', $userCounter);
    }

    // Debug Functions
    function clearAllStorage() {
        localStorage.clear();
        sessionStorage.clear();
        console.log('All storage cleared');
        showSuccess('All storage cleared! 🗑️', 2000);
    }

    function clearLocalStorage() {
        localStorage.clear();
        window.location.reload();
    }

    function logAppState() {
        console.log('=== APP DEBUG STATE ===');
        console.log('Dark Mode:', $darkMode);
        console.log('Current Language:', $currentLanguage);
        console.log('Is Disabled:', $isDisabled);
        console.log('Show Donate Menu:', $showDonateMenu);
        console.log('Modal Visible:', $isModalVisible);
        console.log('Modal Type:', $modalType);
        console.log('User Counter:', $userCounter);
        console.log('Local Storage Keys:', Object.keys(localStorage));
        console.log('Session Storage Keys:', Object.keys(sessionStorage));
        console.log('========================');
        showInfo('App state logged to console! 📋', 2000);
    }

    function testEmojiGeneration() {
        const randomEmojis = testEmojis.sort(() => Math.random() - 0.5).slice(0, 5);
        console.log('Generated Emojis:', randomEmojis);
        showSuccess(`Generated: ${randomEmojis.join(' ')}`, 3000);
    }

    // Update debug info when modal state changes
    $: if (debugVisible && $isModalVisible) {
        updateDebugInfo();
    }

    onMount(() => {
        console.log('Debug Panel mounted');
    });
</script>

{#if true}
    <!-- Debug Buttons - Fixed top right, matching header style -->
    <div class="fixed top-5 right-5 z-40 flex gap-2">
        <!-- Clear All Storage Button -->
        <button
            class="btn border-4 p-4 border-gray-300 dark:border-aubergine-800 dark:text-white bg-creme-500 dark:bg-aubergine-900"
            title="Clear All Storage"
            on:click={clearAllStorage}
        >
            🗑️ CLEAR
        </button>
        
        <!-- Debug Button -->
        <button
            class="btn border-4 p-4 border-gray-300 dark:border-aubergine-800 dark:text-white bg-creme-500 dark:bg-aubergine-900"
            title="Debug Panel"
            on:click={toggleDebug}
        >
            🐛 DEBUG
        </button>
    </div>

    <!-- Debug Panel - Slides in from right, positioned below buttons -->
    {#if debugVisible}
        <div 
            class="fixed right-0 top-20 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-30 overflow-y-auto"
            in:slide={{ duration: 300, axis: 'x' }}
            out:slide={{ duration: 300, axis: 'x' }}
        >
            <div class="p-4">
                <!-- Header -->
                <div class="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">🐛 Debug Panel</h3>
                    <button 
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        on:click={toggleDebug}
                    >
                        ✕
                    </button>
                </div>

                <!-- Tab Navigation -->
                <div class="flex space-x-1 mb-4">
                    <button 
                        class="px-3 py-2 text-sm rounded-lg transition-colors {currentTab === 'modals' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}"
                        on:click={() => currentTab = 'modals'}
                    >
                        Modals
                    </button>
                    <button 
                        class="px-3 py-2 text-sm rounded-lg transition-colors {currentTab === 'stores' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}"
                        on:click={() => currentTab = 'stores'}
                    >
                        Stores
                    </button>
                    <button 
                        class="px-3 py-2 text-sm rounded-lg transition-colors {currentTab === 'debug' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}"
                        on:click={() => currentTab = 'debug'}
                    >
                        Debug
                    </button>
                </div>

                <!-- Modal Tests Tab -->
                {#if currentTab === 'modals'}
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-800 dark:text-white">Modal Tests</h4>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testSuccess}>
                                Success
                            </button>
                            <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testError}>
                                Error
                            </button>
                            <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testWarning}>
                                Warning
                            </button>
                            <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testInfo}>
                                Info
                            </button>
                            <button class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testContact}>
                                Contact
                            </button>
                            <button class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testSending}>
                                Sending
                            </button>
                            <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition-colors col-span-2" on:click={testWithButton}>
                                With Button
                            </button>
                        </div>

                        <!-- Modal Status -->
                        <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h5 class="font-semibold mb-2 text-gray-800 dark:text-white">Status</h5>
                            <div class="text-xs space-y-1">
                                <p><strong>Visible:</strong> {$isModalVisible ? 'Yes' : 'No'}</p>
                                <p><strong>Type:</strong> {$modalType || 'None'}</p>
                                <p><strong>Message:</strong> {$modalMessage || 'None'}</p>
                            </div>
                        </div>

                        <!-- Modal History -->
                        {#if modalHistory.length > 0}
                            <div class="mt-4">
                                <h5 class="font-semibold mb-2 text-gray-800 dark:text-white">History</h5>
                                <div class="max-h-32 overflow-y-auto text-xs space-y-1">
                                    {#each modalHistory.slice(-5) as entry}
                                        <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                            <div><strong>{entry.type}:</strong> {entry.message}</div>
                                            <div class="text-gray-500">{entry.timestamp}</div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}

                <!-- Store Tests Tab -->
                {#if currentTab === 'stores'}
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-800 dark:text-white">Store Tests</h4>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={toggleDarkMode}>
                                Toggle Dark
                            </button>
                            <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={toggleDisabled}>
                                Toggle Disabled
                            </button>
                            <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={toggleDonateMenu}>
                                Toggle Donate
                            </button>
                            <button class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testLanguageChange}>
                                Random Lang
                            </button>
                            <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testUserCounter}>
                                Test Counter
                            </button>
                            <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testEmojiGeneration}>
                                Test Emojis
                            </button>
                        </div>

                        <!-- Store Status -->
                        <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h5 class="font-semibold mb-2 text-gray-800 dark:text-white">Store Status</h5>
                            <div class="text-xs space-y-1">
                                <p><strong>Dark Mode:</strong> {$darkMode ? 'On' : 'Off'}</p>
                                <p><strong>Language:</strong> {$currentLanguage}</p>
                                <p><strong>Disabled:</strong> {$isDisabled ? 'Yes' : 'No'}</p>
                                <p><strong>Donate Menu:</strong> {$showDonateMenu ? 'Open' : 'Closed'}</p>
                                <p><strong>User Counter:</strong> {$userCounter.value}</p>
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Debug Tools Tab -->
                {#if currentTab === 'debug'}
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-800 dark:text-white">Debug Tools</h4>
                        
                        <div class="grid grid-cols-1 gap-2">
                            <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={clearLocalStorage}>
                                🛁 Clear & Reload
                            </button>
                            <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={logAppState}>
                                📋 Log App State
                            </button>
                            <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors" on:click={testEmojiGeneration}>
                                🎲 Test Emoji Gen
                            </button>
                        </div>

                        <!-- Quick Info -->
                        <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <h5 class="font-semibold mb-2 text-gray-800 dark:text-white">Quick Info</h5>
                            <div class="text-xs space-y-1">
                                <p><strong>URL:</strong> {window.location.href}</p>
                                <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
                                <p><strong>Screen:</strong> {window.screen.width}x{window.screen.height}</p>
                                <p><strong>Viewport:</strong> {window.innerWidth}x{window.innerHeight}</p>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
{/if} 