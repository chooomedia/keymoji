// src/stores/userSettingsStore.js
import { writable, derived } from 'svelte/store';
import { accountTier, isLoggedIn } from './appStores.js';
import { setUserPreferences, getUserPreferences } from '../utils/cookies.js';

// Default settings for different user tiers
const DEFAULT_FREE_SETTINGS = {
    // Basic Settings
    language: 'en',
    theme: 'auto', // auto, light, dark
    notifications: true,

    // Security Settings
    passwordLength: 8,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,

    // Emoji Settings
    emojiCount: 5,
    emojiCategories: ['faces', 'animals', 'food'],
    excludeEmojis: [],

    // Generation Settings
    autoGenerate: false,
    copyToClipboard: true,
    showStrength: true,

    // Privacy Settings
    saveHistory: false,
    analytics: true,
    shareUsage: false
};

const DEFAULT_PRO_SETTINGS = {
    // Basic Settings
    language: 'en',
    theme: 'auto',
    notifications: true,

    // Advanced Security Settings
    passwordLength: 12,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
    includeSpecialChars: true,
    excludeSimilarChars: true,
    requireUniqueChars: true,

    // Advanced Emoji Settings
    emojiCount: 8,
    emojiCategories: [
        'faces',
        'animals',
        'food',
        'objects',
        'symbols',
        'flags'
    ],
    excludeEmojis: [],
    emojiPattern: 'random', // random, sequential, alternating
    emojiTheme: 'mixed', // mixed, cute, professional, fantasy

    // Advanced Generation Settings
    autoGenerate: true,
    copyToClipboard: true,
    showStrength: true,
    strengthThreshold: 'medium', // low, medium, high
    autoRefresh: false,
    refreshInterval: 30, // seconds

    // Advanced Privacy Settings
    saveHistory: true,
    analytics: true,
    shareUsage: false,
    exportHistory: true,
    backupSettings: true,

    // Pro Features
    customPatterns: [],
    favoriteEmojis: [],
    passwordHistory: [],
    strengthAnalytics: true,
    securityAudit: true,
    breachCheck: true,

    // Advanced UI Settings
    compactMode: false,
    showAdvancedOptions: true,
    customThemes: [],
    keyboardShortcuts: true,
    accessibilityMode: false
};

// Create the main settings store
export const userSettings = writable(DEFAULT_FREE_SETTINGS);

// Derived store for current tier settings
export const currentSettings = derived(
    [userSettings, accountTier],
    ([$settings, $tier]) => {
        return $tier === 'pro'
            ? { ...DEFAULT_PRO_SETTINGS, ...$settings }
            : { ...DEFAULT_FREE_SETTINGS, ...$settings };
    }
);

// Derived store for available settings based on tier
export const availableSettings = derived([accountTier], ([$tier]) => {
    if ($tier === 'pro') {
        return {
            basic: ['language', 'theme', 'notifications'],
            security: [
                'passwordLength',
                'includeNumbers',
                'includeSymbols',
                'includeUppercase',
                'includeLowercase',
                'includeSpecialChars',
                'excludeSimilarChars',
                'requireUniqueChars'
            ],
            emoji: [
                'emojiCount',
                'emojiCategories',
                'excludeEmojis',
                'emojiPattern',
                'emojiTheme'
            ],
            generation: [
                'autoGenerate',
                'copyToClipboard',
                'showStrength',
                'strengthThreshold',
                'autoRefresh',
                'refreshInterval'
            ],
            privacy: [
                'saveHistory',
                'analytics',
                'shareUsage',
                'exportHistory',
                'backupSettings'
            ],
            pro: [
                'customPatterns',
                'favoriteEmojis',
                'passwordHistory',
                'strengthAnalytics',
                'securityAudit',
                'breachCheck'
            ],
            ui: [
                'compactMode',
                'showAdvancedOptions',
                'customThemes',
                'keyboardShortcuts',
                'accessibilityMode'
            ]
        };
    } else {
        return {
            basic: ['language', 'theme', 'notifications'],
            security: [
                'passwordLength',
                'includeNumbers',
                'includeSymbols',
                'includeUppercase',
                'includeLowercase'
            ],
            emoji: ['emojiCount', 'emojiCategories', 'excludeEmojis'],
            generation: ['autoGenerate', 'copyToClipboard', 'showStrength'],
            privacy: ['saveHistory', 'analytics', 'shareUsage']
        };
    }
});

// Initialize settings from cookies
export function initializeSettings() {
    try {
        const preferences = getUserPreferences();
        if (preferences.settings) {
            let currentSettings;
            userSettings.subscribe(settings => (currentSettings = settings))();
            userSettings.set({
                ...currentSettings,
                ...preferences.settings
            });
        }
    } catch (error) {
        console.warn('Failed to load settings from cookies:', error);
    }
}

// Save settings to cookies
export function saveSettings(settings) {
    try {
        const preferences = getUserPreferences();
        preferences.settings = settings;
        setUserPreferences(preferences);
        userSettings.set(settings);
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

// Update a specific setting
export function updateSetting(key, value) {
    userSettings.update(settings => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
        return newSettings;
    });
}

// Reset settings to default for current tier
export function resetSettings() {
    const currentTier = accountTier.get();
    const defaultSettings =
        currentTier === 'pro' ? DEFAULT_PRO_SETTINGS : DEFAULT_FREE_SETTINGS;
    saveSettings(defaultSettings);
}

// Export settings
export function exportSettings() {
    let settings;
    userSettings.subscribe(value => (settings = value))();
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'keymoji-settings.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import settings
export function importSettings(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const settings = JSON.parse(e.target.result);
                saveSettings(settings);
                resolve(settings);
            } catch (error) {
                reject(new Error('Invalid settings file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// Get setting value with fallback
export function getSetting(key, fallback = null) {
    let value;
    userSettings.subscribe(settings => (value = settings[key]))();
    return value !== undefined ? value : fallback;
}

// Check if setting is available for current tier
export function isSettingAvailable(key) {
    let available;
    availableSettings.subscribe(settings => {
        available = Object.values(settings).some(category =>
            category.includes(key)
        );
    })();
    return available;
}

// Security audit function for pro users
export function runSecurityAudit() {
    let settings;
    userSettings.subscribe(value => (settings = value))();
    const audit = {
        passwordStrength: settings.passwordLength >= 12 ? 'strong' : 'weak',
        symbolUsage: settings.includeSymbols ? 'enabled' : 'disabled',
        uniqueChars: settings.requireUniqueChars ? 'enabled' : 'disabled',
        similarChars: settings.excludeSimilarChars ? 'enabled' : 'disabled',
        overallScore: 0
    };

    // Calculate security score
    let score = 0;
    if (settings.passwordLength >= 12) score += 25;
    if (settings.includeSymbols) score += 20;
    if (settings.includeUppercase) score += 15;
    if (settings.includeNumbers) score += 15;
    if (settings.requireUniqueChars) score += 15;
    if (settings.excludeSimilarChars) score += 10;

    audit.overallScore = Math.min(score, 100);
    return audit;
}

// Initialize settings when user logs in
export function initializeSettingsForUser() {
    let loggedIn = false;
    isLoggedIn.subscribe(value => (loggedIn = value))();

    if (loggedIn) {
        initializeSettings();
    }
}
