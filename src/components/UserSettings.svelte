<!-- src/components/UserSettings.svelte -->
<script>
    import { slide } from 'svelte/transition';
    import { 
        currentSettings, 
        availableSettings, 
        updateSetting, 
        resetSettings,
        exportSettings,
        importSettings,
        runSecurityAudit,
        isSettingAvailable
    } from '../stores/userSettingsStore.js';
    import { accountTier, isLoggedIn } from '../stores/appStores.js';
    import { showSuccess, showError, showInfo } from '../stores/modalStore.js';

    // Accordion state - only one section open at a time
    let activeSection = 'basic';

    // File input for import
    let fileInput;

    // Toggle section visibility (accordion style)
    function toggleSection(section) {
        activeSection = activeSection === section ? null : section;
    }

    // Handle setting update
    function handleSettingUpdate(key, value) {
        updateSetting(key, value);
        showSuccess(`Setting updated: ${key}`, 2000);
    }

    // Handle settings reset
    function handleResetSettings() {
        resetSettings();
        showSuccess('Settings reset to default', 3000);
    }

    // Handle settings export
    function handleExportSettings() {
        try {
            exportSettings();
            showSuccess('Settings exported successfully', 3000);
        } catch (error) {
            showError('Failed to export settings', 3000);
        }
    }

    // Handle settings import
    function handleImportSettings(event) {
        const file = event.target.files[0];
        if (file) {
            importSettings(file)
                .then(() => {
                    showSuccess('Settings imported successfully', 3000);
                })
                .catch((error) => {
                    showError(`Import failed: ${error.message}`, 3000);
                });
        }
    }

    // Handle security audit
    function handleSecurityAudit() {
        try {
            const audit = runSecurityAudit();
            showInfo(`Security Score: ${audit.overallScore}/100`, 4000);
        } catch (error) {
            showError('Security audit failed', 3000);
        }
    }

    // Trigger file input
    function triggerFileInput() {
        fileInput.click();
    }

    // Check if user is pro
    $: isProUser = $accountTier === 'pro';
</script>

<div class="w-full max-w-4xl mx-auto">
    <!-- Settings Accordion -->
    <div class="space-y-3">
        
        <!-- Basic Settings -->
        <div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
            <button
                class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
                on:click={() => toggleSection('basic')}
            >
                <div class="flex items-center space-x-4">
                    <span class="text-xl">⚙️</span>
                    <div class="justify-start text-left">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-md">Basic Settings</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Language, theme, and notifications</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === 'basic' ? 'rotate-180' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            
                {#if activeSection === 'basic'}
                <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
                    <!-- Language -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <label for="language-select" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🌍 Language
                            </label>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose your preferred language</p>
                        </div>
                        <select
                            id="language-select"
                            value={$currentSettings.language}
                            on:change={(e) => handleSettingUpdate('language', e.target.value)}
                            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="en">🇺🇸 English</option>
                            <option value="de">🇩🇪 Deutsch</option>
                            <option value="fr">🇫🇷 Français</option>
                            <option value="es">🇪🇸 Español</option>
                        </select>
                    </div>

                    <!-- Theme -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🎨 Theme
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose your visual theme</p>
                        </div>
                        <select
                            value={$currentSettings.theme}
                            on:change={(e) => handleSettingUpdate('theme', e.target.value)}
                            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="auto">🔄 Auto</option>
                            <option value="light">☀️ Light</option>
                            <option value="dark">🌙 Dark</option>
                        </select>
                    </div>

                    <!-- Notifications -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                        <div>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🔔 Notifications
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive important updates</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={$currentSettings.notifications}
                                on:change={(e) => handleSettingUpdate('notifications', e.target.checked)}
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 dark:peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Security Settings -->
        <div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
            <button
                class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
                on:click={() => toggleSection('security')}
            >
                <div class="flex items-center space-x-4">
                    <span class="text-xl">🔒</span>
                    <div class="justify-start text-left">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-md">Security Settings</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Password strength and character types</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === 'security' ? 'rotate-180' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            
            {#if activeSection === 'security'}
                <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
                    <!-- Password Length -->
                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    📏 Password Length
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose password strength</p>
                            </div>
                            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {$currentSettings.passwordLength}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="6"
                            max="20"
                            value={$currentSettings.passwordLength}
                            on:input={(e) => handleSettingUpdate('passwordLength', parseInt(e.target.value))}
                            class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                        />
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>Weak (6)</span>
                            <span>Strong (20)</span>
                        </div>
                    </div>

                    <!-- Include Numbers -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                        <div>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🔢 Include Numbers
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Add numeric characters (0-9)</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={$currentSettings.includeNumbers}
                                on:change={(e) => handleSettingUpdate('includeNumbers', e.target.checked)}
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <!-- Include Symbols -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                        <div>
                            <label for="includeSymbols" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🔣 Include Symbols
                            </label>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Add special characters (!@#$%^&*)</p>
                        </div>
                        <label for="includeSymbols" class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="includeSymbols"
                                checked={$currentSettings.includeSymbols}
                                on:change={(e) => handleSettingUpdate('includeSymbols', e.target.checked)}
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500 dark:peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <!-- Pro-only settings -->
                    {#if isProUser}
                        <!-- Include Special Characters -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="includeSpecialChars" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    🔤 Include Special Characters
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Add extended special characters</p>
                            </div>
                            <label for="includeSpecialChars" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="includeSpecialChars"
                                    checked={$currentSettings.includeSpecialChars}
                                    on:change={(e) => handleSettingUpdate('includeSpecialChars', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500 dark:peer-checked:bg-orange-600"></div>
                            </label>
                        </div>

                        <!-- Exclude Similar Characters -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="excludeSimilarChars" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    🚫 Exclude Similar Characters
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Avoid confusing characters (l, 1, I)</p>
                            </div>
                            <label for="excludeSimilarChars" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    id="excludeSimilarChars"
                                    type="checkbox"
                                    checked={$currentSettings.excludeSimilarChars}
                                    on:change={(e) => handleSettingUpdate('excludeSimilarChars', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500 dark:peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        <!-- Require Unique Characters -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="requireUniqueChars" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    ✨ Require Unique Characters
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">No repeated characters in password</p>
                            </div>
                            <label for="requireUniqueChars" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="requireUniqueChars"
                                    checked={$currentSettings.requireUniqueChars}
                                    on:change={(e) => handleSettingUpdate('requireUniqueChars', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-500 dark:peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Emoji Settings -->
        <div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
            <button
                class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
                on:click={() => toggleSection('emoji')}
            >
                <div class="flex items-center space-x-4">
                    <span class="text-xl">😊</span>
                    <div class="justify-start text-left">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-md">Emoji Settings</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Emoji count, categories, and patterns</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === 'emoji' ? 'rotate-180' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            
            {#if activeSection === 'emoji'}
                <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
                    <!-- Emoji Count -->
                    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    📊 Emoji Count
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Number of emojis in password</p>
                            </div>
                            <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                {$currentSettings.emojiCount}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="3"
                            max="10"
                            value={$currentSettings.emojiCount}
                            on:input={(e) => handleSettingUpdate('emojiCount', parseInt(e.target.value))}
                            class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                        />
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>Min (3)</span>
                            <span>Max (10)</span>
                        </div>
                    </div>

                    <!-- Pro-only emoji settings -->
                    {#if isProUser}
                        <!-- Emoji Pattern -->
                        <div class="flex items-center justify-between">
                            <label for="emojiPattern"class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Emoji Pattern
                            </label>
                            <select
                                value={$currentSettings.emojiPattern}
                                id="emojiPattern"
                                on:change={(e) => handleSettingUpdate('emojiPattern', e.target.value)}
                                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="random">Random</option>
                                <option value="sequential">Sequential</option>
                                <option value="alternating">Alternating</option>
                            </select>
                        </div>

                        <!-- Emoji Theme -->
                        <div class="flex items-center justify-between">
                            <label for="emojiTheme"class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Emoji Theme
                            </label>
                            <select
                                value={$currentSettings.emojiTheme}
                                id="emojiTheme"
                                on:change={(e) => handleSettingUpdate('emojiTheme', e.target.value)}
                                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="mixed">Mixed</option>
                                <option value="cute">Cute</option>
                                <option value="professional">Professional</option>
                                <option value="fantasy">Fantasy</option>
                            </select>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Generation Settings -->
        <div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
            <button
                class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
                on:click={() => toggleSection('generation')}
            >
                <div class="flex items-center space-x-4">
                    <span class="text-xl">⚡</span>
                    <div class="justify-start text-left">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-md">Generation Settings</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Auto-generate and clipboard options</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === 'generation' ? 'rotate-180' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            
            {#if activeSection === 'generation'}
                <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
                        <!-- Auto Generate -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="autoGenerate" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    ⚡ Auto Generate
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Automatically generate passwords</p>
                            </div>
                            <label for="autoGenerate" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="autoGenerate"
                                    checked={$currentSettings.autoGenerate}
                                    on:change={(e) => handleSettingUpdate('autoGenerate', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-yellow-600"></div>
                            </label>
                        </div>

                        <!-- Copy to Clipboard -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="copyToClipboard" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    📋 Copy to Clipboard
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-copy generated passwords</p>
                            </div>
                            <label for="copyToClipboard" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="copyToClipboard"
                                    checked={$currentSettings.copyToClipboard}
                                    on:change={(e) => handleSettingUpdate('copyToClipboard', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500 dark:peer-checked:bg-teal-600"></div>
                            </label>
                        </div>

                        <!-- Show Strength -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="showStrength" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    💪 Show Strength
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Display password strength meter</p>
                            </div>
                            <label for="showStrength" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="showStrength"
                                    checked={$currentSettings.showStrength}
                                    on:change={(e) => handleSettingUpdate('showStrength', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500 dark:peer-checked:bg-pink-600"></div>
                            </label>
                        </div>

                        <!-- Pro-only generation settings -->
                        {#if isProUser}
                            <!-- Strength Threshold -->
                            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                                <div>
                                    <label for="strengthThreshold" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        🎯 Strength Threshold
                                    </label>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum password strength required</p>
                                </div>
                                <select
                                    id="strengthThreshold"
                                    value={$currentSettings.strengthThreshold}
                                    on:change={(e) => handleSettingUpdate('strengthThreshold', e.target.value)}
                                    class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <!-- Auto Refresh -->
                            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                                <div>
                                    <label for="autoRefresh" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        🔄 Auto Refresh
                                    </label>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-regenerate weak passwords</p>
                                </div>
                                <label for="autoRefresh" class="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="autoRefresh"
                                        checked={$currentSettings.autoRefresh}
                                        on:change={(e) => handleSettingUpdate('autoRefresh', e.target.checked)}
                                        class="sr-only peer"
                                    />
                                    <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-500 dark:peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>
                        {/if}
                    </div>
            {/if}
        </div>

        <!-- Privacy Settings -->
        <div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
            <button
                class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
                on:click={() => toggleSection('privacy')}
            >
                <div class="flex items-center space-x-4">
                    <span class="text-xl">🔒</span>
                    <div class="justify-start text-left">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-md">Privacy Settings</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Data collection and sharing preferences</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === 'privacy' ? 'rotate-180' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            
            {#if activeSection === 'privacy'}
                <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
                    <!-- Save History -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                        <div>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📚 Save History
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Store generated passwords locally</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={$currentSettings.saveHistory}
                                on:change={(e) => handleSettingUpdate('saveHistory', e.target.checked)}
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 dark:peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <!-- Analytics -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                        <div>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📊 Analytics
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Anonymous usage statistics</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={$currentSettings.analytics}
                                on:change={(e) => handleSettingUpdate('analytics', e.target.checked)}
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-500 dark:peer-checked:bg-violet-600"></div>
                        </label>
                    </div>

                    <!-- Share Usage -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                        <div>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🤝 Share Usage
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Share usage data for improvements</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={$currentSettings.shareUsage}
                                on:change={(e) => handleSettingUpdate('shareUsage', e.target.checked)}
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-500 dark:peer-checked:bg-rose-600"></div>
                        </label>
                    </div>

                    <!-- Pro-only privacy settings -->
                    {#if isProUser}
                        <!-- Export History -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="exportHistory" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    📤 Export History
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Export password history to file</p>
                            </div>
                            <label for="exportHistory" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="exportHistory"
                                    checked={$currentSettings.exportHistory}
                                    on:change={(e) => handleSettingUpdate('exportHistory', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-500 dark:peer-checked:bg-sky-600"></div>
                            </label>
                        </div>

                        <!-- Backup Settings -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="backupSettings" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    💾 Backup Settings
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Automatically backup settings</p>
                            </div>
                            <label for="backupSettings" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="backupSettings"
                                    checked={$currentSettings.backupSettings}
                                    on:change={(e) => handleSettingUpdate('backupSettings', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-500 dark:peer-checked:bg-slate-600"></div>
                            </label>
                        </div>
                    {/if}
                </div>

            {/if}
        </div>

        <!-- Pro Features (Pro Users Only) -->
        {#if isProUser}
            <div class="w-full text-left px-4 rounded-lg bg-gray-200 dark:bg-aubergine-950 transition-colors">
                <button
                    class="w-full flex py-4 items-center justify-between transition-all duration-300 ease-out group hover:bg-gray-100 dark:hover:bg-gray-800"
                    on:click={() => toggleSection('pro')}
                >
                    <div class="flex items-center space-x-4">
                        <span class="text-xl">💎</span>
                        <div class="justify-start text-left">
                            <h3 class="font-semibold text-gray-900 dark:text-white text-md">Pro Features</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Advanced settings and premium features</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-gray-400 transition-all duration-300 ease-out {activeSection === 'pro' ? 'rotate-180' : 'rotate-0'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </button>
            
                        {#if activeSection === 'pro'}
                <div class="space-y-6 pb-4" transition:slide={{ duration: 400 }}>
                        <!-- Security Audit -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="auditinput" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    🔒 Security Audit
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Comprehensive security analysis</p>
                            </div>
                            <button
                                id="auditinput"
                                on:click={handleSecurityAudit}
                                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Run Audit
                            </button>
                        </div>

                        <!-- Breach Check -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="breachCheck" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    🔍 Breach Check
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Check passwords against known breaches</p>
                            </div>
                            <label for="breachCheck" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="breachCheck"
                                    checked={$currentSettings.breachCheck}
                                    on:change={(e) => handleSettingUpdate('breachCheck', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500 dark:peer-checked:bg-amber-600"></div>
                            </label>
                        </div>

                        <!-- Strength Analytics -->
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                            <div>
                                <label for="strengthAnalytics" class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    📈 Strength Analytics
                                </label>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Advanced password strength analysis</p>
                            </div>
                            <label for="strengthAnalytics" class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="strengthAnalytics"
                                    checked={$currentSettings.strengthAnalytics}
                                    on:change={(e) => handleSettingUpdate('strengthAnalytics', e.target.checked)}
                                    class="sr-only peer"
                                />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 dark:peer-focus:ring-lime-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-500 dark:peer-checked:bg-lime-600"></div>
                            </label>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-4 justify-center">
            <button
                on:click={handleResetSettings}
                class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
                🔄 Reset to Default
            </button>
            
            {#if isProUser}
                <button
                    on:click={handleExportSettings}
                    class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    📤 Export Settings
                </button>
                
                <button
                    on:click={triggerFileInput}
                    class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    📥 Import Settings
                </button>
            {/if}
        </div>
        
        {#if isProUser}
            <div class="mt-4 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    💎 Pro users can export and import their settings
                </p>
            </div>
        {/if}
    </div>

    <!-- Hidden file input -->
    <input
        bind:this={fileInput}
        type="file"
        accept=".json"
        on:change={handleImportSettings}
        class="hidden"
    />
</div>

<style>
    /* Custom slider styling */
    .slider {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
    }

    .slider::-webkit-slider-track {
        background: #e5e7eb;
        height: 8px;
        border-radius: 4px;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        background: #3b82f6;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider::-moz-range-track {
        background: #e5e7eb;
        height: 8px;
        border-radius: 4px;
        border: none;
    }

    .slider::-moz-range-thumb {
        background: #3b82f6;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }



    /* Smooth transitions */
    * {
        transition: all 0.2s ease-in-out;
    }

    /* Focus styles */
    button:focus, select:focus, input:focus {
        outline: none;
        ring: 2px;
        ring-color: #3b82f6;
    }
</style> 