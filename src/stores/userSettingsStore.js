// src/stores/userSettingsStore.js
import { writable, derived, get } from 'svelte/store';
import { accountTier, isLoggedIn, currentAccount } from './appStores.js';
import { WEBHOOKS } from '../config/api.js';
import {
    setUserPreferences,
    getUserPreferences,
    getCookieStatus
} from '../utils/cookies.js';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';

// Helper function to generate client fingerprint
function generateClientFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Keymoji fingerprint', 2, 2);
    return canvas.toDataURL();
}

// Store für ungespeicherte Änderungen
export const pendingChanges = writable({});
export const hasUnsavedChanges = derived(pendingChanges, $pendingChanges => {
    return Object.keys($pendingChanges).length > 0;
});

// Store für Settings-Status
export const settingsStatus = writable({
    isSaving: false,
    lastSaved: null,
    hasError: false,
    errorMessage: null
});

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
    ([$userSettings, $accountTier]) => {
        const baseSettings =
            $accountTier === 'pro'
                ? DEFAULT_PRO_SETTINGS
                : DEFAULT_FREE_SETTINGS;
        return { ...baseSettings, ...$userSettings };
    }
);

// Initialize settings from storage
export function initializeSettings() {
    try {
        // Try to load from localStorage first
        const storedSettings = storageHelpers.get(
            STORAGE_KEYS.USER_PREFERENCES
        );
        if (storedSettings) {
            userSettings.set({ ...DEFAULT_FREE_SETTINGS, ...storedSettings });
        }

        // Try to load from cookies
        const cookiePrefs = getUserPreferences();
        if (cookiePrefs) {
            userSettings.update(settings => ({ ...settings, ...cookiePrefs }));
        }
    } catch (error) {
        console.warn('Failed to initialize settings:', error);
    }
}

// Save settings to storage
export function saveSettings(settings) {
    try {
        // Save to localStorage
        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, settings);

        // Save to cookies
        setUserPreferences(settings);

        // Update store
        userSettings.set(settings);

        // Apply settings immediately
        applySettingsReactive(settings);

        return true;
    } catch (error) {
        console.error('Failed to save settings:', error);
        return false;
    }
}

// Apply settings reactively
export function applySettingsReactive(settings) {
    // Apply theme
    if (settings.theme) {
        applyThemeReactive(settings.theme);
    }

    // Apply language
    if (settings.language) {
        applyLanguageReactive(settings.language);
    }

    // Apply other settings as needed
    console.log('🔄 Settings applied reactively:', settings);
}

// Apply theme reactively
export function applyThemeReactive(theme) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    if (theme === 'dark') {
        root.classList.add('dark');
    } else if (theme === 'light') {
        root.classList.remove('dark');
    } else {
        // Auto theme - use system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
}

// Apply language reactively
export function applyLanguageReactive(language) {
    if (typeof document === 'undefined') return;

    // Update document language
    document.documentElement.lang = language;

    // Trigger language change event
    window.dispatchEvent(
        new CustomEvent('languageChanged', {
            detail: { language }
        })
    );
}

// Neue Funktionen für Settings-Management
export function updateSetting(key, value) {
    // Füge zur pendingChanges hinzu, anstatt sofort zu speichern
    pendingChanges.update(changes => ({
        ...changes,
        [key]: value
    }));
}

export async function saveAllSettings() {
    try {
        settingsStatus.update(status => ({ ...status, isSaving: true }));

        const currentSettings = get(userSettings);
        const pendingSettings = get(pendingChanges);

        // Merge current settings with pending changes
        const updatedSettings = {
            ...currentSettings,
            ...pendingSettings
        };

        // Save to API if user is logged in
        const account = get(currentAccount);
        if (account && account.userId) {
            await saveSettingsToAPI(updatedSettings);
        } else {
            // Save to localStorage for guest users
            storageHelpers.set(STORAGE_KEYS.USER_SETTINGS, updatedSettings);
        }

        // Save to local storage
        setUserPreferences({
            ...getUserPreferences(),
            settings: updatedSettings,
            lastSettingsUpdate: new Date().toISOString()
        });

        // Update user settings store
        userSettings.set(updatedSettings);

        // Apply settings immediately
        applySettingsReactive(updatedSettings);

        // Clear pending changes
        pendingChanges.set({});

        // Update settings status
        settingsStatus.update(status => ({
            ...status,
            isSaving: false,
            lastSaved: new Date().toISOString(),
            hasError: false,
            errorMessage: null
        }));

        return updatedSettings;
    } catch (error) {
        console.error('Save all settings error:', error);

        // Update settings status with error
        settingsStatus.update(status => ({
            ...status,
            isSaving: false,
            hasError: true,
            errorMessage: error.message
        }));

        throw error;
    }
}

export function discardChanges() {
    pendingChanges.set({});
    settingsStatus.set({
        isSaving: false,
        hasError: false,
        errorMessage: null
    });
}

export function getPendingValue(key) {
    const pending = get(pendingChanges);
    return pending[key];
}

export function getEffectiveValue(key) {
    const current = get(userSettings);
    const pending = get(pendingChanges);

    // Pending value hat Vorrang
    if (pending[key] !== undefined) {
        return pending[key];
    }

    return current[key];
}

// Reset settings to default
export function resetSettings() {
    const tier = get(accountTier);
    const defaultSettings =
        tier === 'pro' ? DEFAULT_PRO_SETTINGS : DEFAULT_FREE_SETTINGS;
    saveSettings(defaultSettings);
}

// Export settings to file
export function exportSettings() {
    try {
        const settings = get(userSettings);
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `keymoji-settings-${
            new Date().toISOString().split('T')[0]
        }.json`;
        link.click();

        return true;
    } catch (error) {
        console.error('Failed to export settings:', error);
        return false;
    }
}

// Import settings from file
export function importSettings(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            try {
                const settings = JSON.parse(event.target.result);

                // Validate settings structure
                if (typeof settings !== 'object' || settings === null) {
                    throw new Error('Invalid settings format');
                }

                // Merge with current settings
                const currentSettings = get(userSettings);
                const mergedSettings = { ...currentSettings, ...settings };

                saveSettings(mergedSettings);
                resolve(true);
            } catch (error) {
                console.error('Failed to import settings:', error);
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// Get a specific setting
export function getSetting(key, fallback = null) {
    const settings = get(userSettings);
    return settings[key] !== undefined ? settings[key] : fallback;
}

// Check if a setting is available for current tier
export function isSettingAvailable(key) {
    const tier = get(accountTier);

    // Pro-only settings
    const proOnlySettings = [
        'includeSpecialChars',
        'excludeSimilarChars',
        'requireUniqueChars',
        'emojiPattern',
        'emojiTheme',
        'strengthThreshold',
        'autoRefresh',
        'exportHistory',
        'backupSettings',
        'customPatterns',
        'favoriteEmojis',
        'passwordHistory',
        'strengthAnalytics',
        'securityAudit',
        'breachCheck',
        'compactMode',
        'showAdvancedOptions',
        'customThemes',
        'keyboardShortcuts',
        'accessibilityMode'
    ];

    if (proOnlySettings.includes(key)) {
        return tier === 'pro';
    }

    return true;
}

// Run security audit
export function runSecurityAudit() {
    return new Promise(resolve => {
        setTimeout(() => {
            const settings = get(userSettings);
            const audit = {
                passwordLength: settings.passwordLength >= 8 ? 'good' : 'weak',
                includeNumbers: settings.includeNumbers ? 'good' : 'weak',
                includeSymbols: settings.includeSymbols ? 'good' : 'weak',
                includeUppercase: settings.includeUppercase ? 'good' : 'weak',
                includeLowercase: settings.includeLowercase ? 'good' : 'weak',
                overall: 'good'
            };

            // Calculate overall score
            const scores = Object.values(audit).filter(
                score => score !== 'overall'
            );
            const weakCount = scores.filter(score => score === 'weak').length;

            if (weakCount > 2) {
                audit.overall = 'weak';
            } else if (weakCount > 0) {
                audit.overall = 'medium';
            }

            resolve(audit);
        }, 1000); // Simulate API call
    });
}

// Initialize settings for user
export async function initializeSettingsForUser() {
    try {
        const account = get(currentAccount);

        if (account && account.userId) {
            // Try to load settings from API first
            try {
                const apiSettings = await loadSettingsFromAPI();
                if (apiSettings) {
                    console.log('✅ Settings loaded from API');
                    return apiSettings;
                }
            } catch (error) {
                console.warn(
                    '⚠️ Failed to load settings from API, using local settings:',
                    error.message
                );
            }
        }

        // Fallback to local settings
        const localSettings = getUserPreferences()?.settings;
        if (localSettings) {
            userSettings.set(localSettings);
            console.log('✅ Settings loaded from local storage');
            return localSettings;
        }

        // Initialize with default settings
        const defaultSettings =
            get(accountTier) === 'pro'
                ? DEFAULT_PRO_SETTINGS
                : DEFAULT_FREE_SETTINGS;
        userSettings.set(defaultSettings);
        console.log('✅ Settings initialized with defaults');
        return defaultSettings;
    } catch (error) {
        console.error('❌ Failed to initialize settings:', error);

        // Fallback to free settings
        userSettings.set(DEFAULT_FREE_SETTINGS);
        return DEFAULT_FREE_SETTINGS;
    }
}

// Sync settings with cookies
export function syncSettingsWithCookies() {
    const cookieStatus = getCookieStatus();
    const settings = get(userSettings);

    // Sync language
    if (cookieStatus.LANGUAGE?.exists && cookieStatus.LANGUAGE?.valid) {
        const cookieLang = cookieStatus.LANGUAGE.value;
        if (cookieLang !== settings.language) {
            updateSetting('language', cookieLang);
        }
    }

    // Sync theme
    if (cookieStatus.THEME?.exists && cookieStatus.THEME?.valid) {
        const cookieTheme = cookieStatus.THEME.value;
        if (cookieTheme !== settings.theme) {
            updateSetting('theme', cookieTheme);
        }
    }
}

// Validate settings
export function validateSettings(settings) {
    const errors = [];

    // Validate password length
    if (settings.passwordLength < 6 || settings.passwordLength > 50) {
        errors.push('Password length must be between 6 and 50');
    }

    // Validate emoji count
    if (settings.emojiCount < 3 || settings.emojiCount > 20) {
        errors.push('Emoji count must be between 3 and 20');
    }

    // Validate refresh interval
    if (
        settings.refreshInterval &&
        (settings.refreshInterval < 5 || settings.refreshInterval > 300)
    ) {
        errors.push('Refresh interval must be between 5 and 300 seconds');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// On-demand settings saving via API
export async function saveSettingsToAPI(settings) {
    try {
        const account = get(currentAccount);
        if (!account || !account.userId) {
            throw new Error('No user account found');
        }

        const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                userId: account.userId,
                updates: {
                    settings: settings
                },
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save settings to API');
        }

        const result = await response.json();
        console.log('✅ Settings saved to API:', result);
        return result;
    } catch (error) {
        console.error('❌ Failed to save settings to API:', error);
        throw error;
    }
}

export async function loadSettingsFromAPI() {
    try {
        const account = get(currentAccount);
        if (!account || !account.userId) {
            throw new Error('No user account found');
        }

        const response = await fetch(WEBHOOKS.ACCOUNT.CRUD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'get',
                userId: account.userId,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.error || 'Failed to load settings from API'
            );
        }

        const result = await response.json();

        if (result.success && result.account && result.account.settings) {
            // Update local storage with API settings
            setUserPreferences({
                ...getUserPreferences(),
                settings: result.account.settings,
                lastSettingsLoad: new Date().toISOString()
            });

            // Update user settings store
            userSettings.set(result.account.settings);

            return result.account.settings;
        }

        return null;
    } catch (error) {
        console.error('Load settings from API error:', error);
        throw error;
    }
}
