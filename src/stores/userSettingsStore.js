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
import { invalidateCachePattern } from '../utils/apiCache.js';
import {
    validateSettings,
    sanitizeSettings,
    getDefaultSettings,
    mergeWithDefaults
} from '../utils/settingsValidation.js';

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

// Use centralized default settings from validation utils
const DEFAULT_FREE_SETTINGS = getDefaultSettings('free');
const DEFAULT_PRO_SETTINGS = getDefaultSettings('pro');

// Legacy: Keep writable for backwards compatibility (TODO: Remove after migration)
export const userSettings = writable(DEFAULT_FREE_SETTINGS);

// Derived store for current tier settings (legacy)
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

// ============================================
// NEW: Single Source of Truth Pattern
// ============================================

/**
 * Extract settings from currentAccount (backend data)
 * This is the SINGLE SOURCE OF TRUTH for user settings!
 */
function extractSettingsFromAccount(account) {
    if (!account) return {};
    
    // Settings priority:
    // 1. account.metadata.settings (from backend/Google Sheets)
    // 2. account.profile (user profile data)
    // 3. Empty object (will use tier defaults)
    
    const metadata = account.metadata || {};
    const settings = metadata.settings || {};
    const profile = account.profile || {};
    
    return {
        // User profile
        name: account.name || profile.name || '',
        email: account.email || '',
        
        // Settings from metadata
        language: settings.language || 'de',
        theme: settings.theme || 'light',
        fontSize: settings.fontSize || 'medium',
        animations: settings.animations !== undefined ? settings.animations : true,
        soundEffects: settings.soundEffects !== undefined ? settings.soundEffects : false,
        
        // UI state
        expandedSections: settings.expandedSections || ['basic'],
        
        // Other metadata
        ...settings
    };
}

/**
 * EFFECTIVE SETTINGS: Derived from currentAccount (Single Source of Truth!)
 * This replaces userSettings for READ operations.
 * Combines: backend data + tier defaults + reactive updates
 */
export const effectiveSettings = derived(
    [currentAccount, accountTier],
    ([$currentAccount, $accountTier]) => {
        // Get tier defaults
        const tierDefaults = $accountTier === 'pro' 
            ? DEFAULT_PRO_SETTINGS 
            : DEFAULT_FREE_SETTINGS;
        
        // Extract settings from currentAccount (backend)
        const accountSettings = extractSettingsFromAccount($currentAccount);
        
        // Merge: tier defaults + account settings
        const merged = { ...tierDefaults, ...accountSettings };
        
        console.log('📊 [effectiveSettings] Computed:', {
            tier: $accountTier,
            hasAccount: !!$currentAccount,
            accountSettings: Object.keys(accountSettings).length,
            result: merged
        });
        
        return merged;
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
export async function applySettingsReactive(settings) {
    console.log('🔄 Applying settings reactively:', settings);

    // Apply theme (updates darkMode store + DOM)
    if (settings.theme) {
        await applyThemeReactive(settings.theme);
    }

    // Apply language (updates currentLanguage store + DOM)
    if (settings.language) {
        await applyLanguageReactive(settings.language);
    }

    // Apply other settings as needed
    console.log('✅ Settings applied reactively');
}

// Apply theme reactively
export async function applyThemeReactive(theme) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Import darkMode store
    const { darkMode } = await import('./appStores.js');

    let isDark = false;

    if (theme === 'dark') {
        root.classList.add('dark');
        isDark = true;
    } else if (theme === 'light') {
        root.classList.remove('dark');
        isDark = false;
    } else {
        // Auto theme - use system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
            isDark = true;
        } else {
            root.classList.remove('dark');
            isDark = false;
        }
    }

    // Update darkMode store
    darkMode.set(isDark);

    // Save to storage
    storageHelpers.set(STORAGE_KEYS.DARK_MODE, isDark);
    storageHelpers.set(STORAGE_KEYS.THEME, theme);

    console.log('🎨 Theme applied:', theme, 'isDark:', isDark);
}

// Apply language reactively
export async function applyLanguageReactive(language) {
    if (typeof document === 'undefined') return;

    // Import currentLanguage store
    const { currentLanguage } = await import('./contentStore.js');

    // Update document language
    document.documentElement.lang = language;

    // Update currentLanguage store
    currentLanguage.set(language);

    // Save to storage
    storageHelpers.set(STORAGE_KEYS.LANGUAGE, language);

    // Trigger language change event
    window.dispatchEvent(
        new CustomEvent('languageChanged', {
            detail: { language }
        })
    );

    console.log('🌍 Language applied:', language);
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
        const tier = get(accountTier);

        // Merge current settings with pending changes
        let updatedSettings = {
            ...currentSettings,
            ...pendingSettings
        };

        console.log('💾 Saving settings (before validation):', updatedSettings);

        // Validate settings
        const validation = validateSettings(updatedSettings, tier);
        if (!validation.isValid) {
            console.error('❌ Settings validation failed:', validation.errors);
            throw new Error(
                `Settings validation failed: ${validation.errors.join(', ')}`
            );
        }

        // Log warnings (e.g., Pro features used on free tier)
        if (validation.warnings.length > 0) {
            console.warn('⚠️ Settings warnings:', validation.warnings);
        }

        // Sanitize settings (remove pro-only features for free users)
        updatedSettings = sanitizeSettings(updatedSettings, tier);

        console.log('💾 Saving settings (after validation):', updatedSettings);

        // Apply settings immediately (updates stores + UI)
        await applySettingsReactive(updatedSettings);

        // Save to API if user is logged in
        const account = get(currentAccount);
        if (account && account.userId) {
            // If name changed, also update account
            if (pendingSettings.name && pendingSettings.name !== account.name) {
                await updateAccountName(account.userId, pendingSettings.name);
            }

            await saveSettingsToAPI(updatedSettings);

            // Invalidate cache (force fresh account data on next load)
            invalidateCachePattern(`/api/account:read:${account.userId}`);
            console.log('🗑️ Cache invalidated after settings save');

            // CRITICAL: Update USER_PREFERENCES in localStorage with new name!
            // This prevents session restore from overwriting the new settings
            const currentPrefs =
                storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES) || {};
            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                ...currentPrefs,
                name: updatedSettings.name,
                profile: {
                    ...(currentPrefs.profile || {}),
                    name: updatedSettings.name
                },
                lastSettingsUpdate: new Date().toISOString()
            });
            console.log(
                '✅ USER_PREFERENCES updated in localStorage with new name:',
                updatedSettings.name
            );
        } else {
            // Save to localStorage for guest users
            storageHelpers.set(STORAGE_KEYS.USER_SETTINGS, updatedSettings);
        }

        // Save to local storage (cookies + localStorage)
        setUserPreferences({
            ...getUserPreferences(),
            settings: updatedSettings,
            name: updatedSettings.name,
            language: updatedSettings.language, // Explicit save
            theme: updatedSettings.theme, // Explicit save
            lastSettingsUpdate: new Date().toISOString()
        });

        // Also save language and theme to their dedicated storage keys
        storageHelpers.set(STORAGE_KEYS.LANGUAGE, updatedSettings.language);
        storageHelpers.set(STORAGE_KEYS.THEME, updatedSettings.theme || 'auto');

        // Update user settings store
        userSettings.set(updatedSettings);

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

        console.log('✅ Settings saved successfully:', updatedSettings);

        return updatedSettings;
    } catch (error) {
        console.error('❌ Save all settings error:', error);

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

// Update account name via API
async function updateAccountName(userId, name) {
    try {
        const account = get(currentAccount);

        const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                userId: userId,
                email: account?.email || '',
                profile: {
                    ...(account?.profile || {}),
                    name: name
                },
                lastLogin: new Date().toISOString(), // Update lastLogin
                metadata: {
                    ...(account?.metadata || {}),
                    updatedAt: new Date().toISOString(),
                    updatedVia: 'settings-ui-name-change'
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to update account name');
        }

        const result = await response.json();
        console.log('✅ Account name updated:', result);

        // Update currentAccount store
        currentAccount.update(acc => ({
            ...acc,
            name: name,
            lastLogin: new Date().toISOString(),
            profile: {
                ...(acc?.profile || {}),
                name: name
            }
        }));

        return result;
    } catch (error) {
        console.error('❌ Failed to update account name:', error);
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
    const pending = get(pendingChanges);
    const settings = get(userSettings);
    const tier = get(accountTier);

    // Priority 1: Pending changes (unsaved)
    if (pending[key] !== undefined) {
        console.log(
            `📝 getEffectiveValue(${key}): Using pending value:`,
            pending[key]
        );
        return pending[key];
    }

    // Priority 2: User settings (saved)
    if (settings[key] !== undefined) {
        console.log(
            `📦 getEffectiveValue(${key}): Using userSettings value:`,
            settings[key]
        );
        return settings[key];
    }

    // Priority 3: Tier defaults (FREE vs PRO)
    const defaults =
        tier === 'pro' ? DEFAULT_PRO_SETTINGS : DEFAULT_FREE_SETTINGS;
    const defaultValue = defaults[key];

    if (defaultValue !== undefined) {
        console.log(
            `⚙️ getEffectiveValue(${key}): Using ${tier} default:`,
            defaultValue
        );
        return defaultValue;
    }

    console.warn(`⚠️ getEffectiveValue(${key}): No value found!`);
    return undefined;
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
        console.log('🔄 Initializing settings for user...');

        const account = get(currentAccount);

        // Import current language and darkMode stores
        const { currentLanguage } = await import('./contentStore.js');
        const { darkMode } = await import('./appStores.js');

        let loadedSettings = null;

        if (account && account.userId) {
            // Try to load settings from API first
            try {
                const apiSettings = await loadSettingsFromAPI();
                if (apiSettings) {
                    console.log('✅ Settings loaded from API:', apiSettings);
                    loadedSettings = apiSettings;
                }
            } catch (error) {
                // CORS error is expected in localhost - use localStorage instead
                if (
                    error.message.includes('CORS') ||
                    error.message.includes('Failed to fetch')
                ) {
                    console.log(
                        'ℹ️ API not available (CORS/localhost), using local settings'
                    );
                } else {
                    console.warn('⚠️ API error:', error.message);
                }
            }
        }

        // Fallback to local settings
        if (!loadedSettings) {
            // Priority 1: Check localStorage.USER_PREFERENCES.settings
            const localStoragePrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES
            );
            if (localStoragePrefs?.settings) {
                console.log(
                    '✅ Settings loaded from localStorage.USER_PREFERENCES:',
                    localStoragePrefs.settings
                );
                loadedSettings = localStoragePrefs.settings;
            } else {
                // Priority 2: Check cookies
                const cookiePrefs = getUserPreferences();
                if (cookiePrefs?.settings) {
                    console.log(
                        '✅ Settings loaded from cookies:',
                        cookiePrefs.settings
                    );
                    loadedSettings = cookiePrefs.settings;
                } else {
                    console.log(
                        'ℹ️ No settings found in localStorage or cookies'
                    );
                }
            }
        }

        // If still no settings, use defaults based on tier
        const tier = get(accountTier);
        if (!loadedSettings) {
            loadedSettings = {
                ...(tier === 'pro'
                    ? DEFAULT_PRO_SETTINGS
                    : DEFAULT_FREE_SETTINGS)
            };
            console.log(`✅ Using default ${tier} settings:`, loadedSettings);
        } else {
            // CRITICAL: Merge loaded settings with tier-appropriate defaults
            // This ensures FREE users get FREE defaults, PRO users get PRO defaults
            const defaults =
                tier === 'pro' ? DEFAULT_PRO_SETTINGS : DEFAULT_FREE_SETTINGS;
            loadedSettings = {
                ...defaults,
                ...loadedSettings
            };
            console.log(
                `✅ Settings merged with ${tier} defaults:`,
                loadedSettings
            );
        }

        // Ensure name is set from account
        if (!loadedSettings.name && account?.name) {
            loadedSettings.name = account.name;
        }

        // CRITICAL: ALWAYS sync language and theme from active stores
        // This ensures UI dropdowns show the correct current values

        // Language: Use currentLanguage store as source of truth
        const activeLanguage = get(currentLanguage);
        if (activeLanguage) {
            loadedSettings.language = activeLanguage;
            console.log(
                '🌍 Language synced from currentLanguage store:',
                activeLanguage
            );
        } else if (!loadedSettings.language) {
            loadedSettings.language =
                storageHelpers.get(STORAGE_KEYS.LANGUAGE) || 'en';
            console.log(
                '🌍 Language loaded from storage fallback:',
                loadedSettings.language
            );
        }

        // Theme: Check storage for explicit 'auto' value, otherwise derive from darkMode
        const storedTheme = storageHelpers.get(STORAGE_KEYS.THEME);
        if (storedTheme && ['auto', 'light', 'dark'].includes(storedTheme)) {
            loadedSettings.theme = storedTheme;
            console.log('🎨 Theme loaded from storage:', storedTheme);
        } else if (!loadedSettings.theme) {
            const isDark = get(darkMode);
            loadedSettings.theme = isDark ? 'dark' : 'light';
            console.log(
                '🎨 Theme derived from darkMode store:',
                loadedSettings.theme
            );
        }

        console.log('📋 Final settings to apply:', loadedSettings);

        // Update store
        userSettings.set(loadedSettings);

        // Apply settings (updates language/theme stores + UI)
        await applySettingsReactive(loadedSettings);

        console.log('✅ Settings initialized and applied successfully');
        return loadedSettings;
    } catch (error) {
        console.error('❌ Failed to initialize settings:', error);

        // Fallback to free settings
        const fallbackSettings = { ...DEFAULT_FREE_SETTINGS };
        const account = get(currentAccount);
        if (account?.name) {
            fallbackSettings.name = account.name;
        }

        // CRITICAL: Sync language and theme from active stores
        try {
            const { currentLanguage } = await import('./contentStore.js');
            const { darkMode } = await import('./appStores.js');

            // Language: Always use currentLanguage store
            fallbackSettings.language = get(currentLanguage) || 'en';

            // Theme: Check for explicit 'auto' in storage
            const storedTheme = storageHelpers.get(STORAGE_KEYS.THEME);
            if (
                storedTheme &&
                ['auto', 'light', 'dark'].includes(storedTheme)
            ) {
                fallbackSettings.theme = storedTheme;
            } else {
                const isDark = get(darkMode);
                fallbackSettings.theme = isDark ? 'dark' : 'light';
            }

            console.log('🔄 Fallback settings synced:', {
                language: fallbackSettings.language,
                theme: fallbackSettings.theme
            });
        } catch (e) {
            console.warn('Could not load current language/theme:', e);
        }

        userSettings.set(fallbackSettings);
        await applySettingsReactive(fallbackSettings);

        console.log('✅ Settings fallback initialized:', fallbackSettings);
        return fallbackSettings;
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
                email: account.email || '',
                profile: {
                    ...(account?.profile || {}),
                    name: settings.name || account.name || ''
                },
                lastLogin: new Date().toISOString(), // Update lastLogin on settings save
                metadata: {
                    settings: settings, // UserSettings → Google Sheets metadata column
                    updatedAt: new Date().toISOString(),
                    updatedVia: 'settings-ui',
                    lastSettingsSave: new Date().toISOString()
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error || 'Failed to save settings to API'
            );
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

        // Skip API call in localhost development (CORS issue until backend deployed)
        if (
            typeof window !== 'undefined' &&
            window.location.hostname === 'localhost'
        ) {
            console.log(
                'ℹ️ Skipping API call on localhost (CORS), using local settings'
            );
            throw new Error('CORS: Localhost development mode');
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
                email: account.email,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error || 'Failed to load settings from API'
            );
        }

        const result = await response.json();
        console.log('🔍 API response:', result);

        // Extract settings from metadata or directly from account
        let loadedSettings = null;

        if (result.success && result.account) {
            // Settings might be in metadata.settings or directly in account
            loadedSettings =
                result.account.metadata?.settings || result.account.settings;

            // Also load name from profile or account
            const accountName =
                result.account.profile?.name ||
                result.account.name ||
                account.name;

            if (loadedSettings) {
                loadedSettings.name = accountName;
            } else {
                // Create settings object with at least the name
                loadedSettings = {
                    ...DEFAULT_FREE_SETTINGS,
                    name: accountName
                };
            }

            // Update local storage with API settings
            setUserPreferences({
                ...getUserPreferences(),
                settings: loadedSettings,
                name: accountName,
                lastSettingsLoad: new Date().toISOString()
            });

            // Update user settings store
            userSettings.set(loadedSettings);

            console.log('✅ Settings loaded from API:', loadedSettings);

            return loadedSettings;
        }

        return null;
    } catch (error) {
        console.error('❌ Load settings from API error:', error);
        throw error;
    }
}
