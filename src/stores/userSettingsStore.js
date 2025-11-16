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
// Import dailyLimit store for dailyUsage preservation
// Note: dailyLimit is exported from appStores.js, not dailyUsageStore.js
import { dailyLimit } from './appStores.js';
// Import metadata cleaner to prevent duplicate fields
import {
    prepareMetadataForAPI,
    validateMetadataNoDuplicates
} from '../utils/metadataCleaner.js';
import { generateClientFingerprint } from '../utils/sharedHelpers';

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
    if (!account) {
        console.log('📊 [extractSettings] No account, returning empty');
        return {};
    }

    // Settings priority:
    // 1. account.metadata.settings (from backend/Google Sheets)
    // 2. account.profile (user profile data)
    // 3. Empty object (will use tier defaults)

    const metadata = account.metadata || {};
    const settings = metadata.settings || {};
    const profile = account.profile || {};

    const extracted = {
        // User profile
        name: account.name || profile.name || '',
        email: account.email || '',

        // Settings from metadata
        language: settings.language || 'de',
        theme: settings.theme || 'light',
        fontSize: settings.fontSize || 'medium',
        animations:
            settings.animations !== undefined ? settings.animations : true,
        soundEffects:
            settings.soundEffects !== undefined ? settings.soundEffects : false,

        // UI state
        expandedSections: settings.expandedSections || ['basic'],

        // ALL other settings from metadata.settings (including storyMode!)
        ...settings
    };

    console.log('📊 [extractSettings] Extracted:', {
        hasSettings: !!settings,
        settingsKeys: Object.keys(settings),
        hasStoryMode: !!extracted.storyMode,
        storyModeEnabled: extracted.storyMode?.enabled
    });

    return extracted;
}

/**
 * EFFECTIVE SETTINGS: Derived from currentAccount (Single Source of Truth!)
 * This replaces userSettings for READ operations.
 * Combines: backend data + tier defaults + reactive updates
 */
export const effectiveSettings = derived(
    [currentAccount, accountTier, userSettings, pendingChanges],
    ([$currentAccount, $accountTier, $userSettings, $pendingChanges]) => {
        // Get tier defaults
        const tierDefaults =
            $accountTier === 'pro'
                ? DEFAULT_PRO_SETTINGS
                : DEFAULT_FREE_SETTINGS;

        // Extract settings from currentAccount (backend)
        const accountSettings = extractSettingsFromAccount($currentAccount);

        // Merge priority: tier defaults < account settings < userSettings < pending changes
        // Use deepMerge to properly handle nested objects
        let merged = deepMerge({}, tierDefaults);
        merged = deepMerge(merged, accountSettings);
        merged = deepMerge(merged, $userSettings);
        merged = deepMerge(merged, $pendingChanges);

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

    // CRITICAL: REPLACE userSettings store completely (not merge!)
    // This ensures Story Mode and all settings are fresh
    userSettings.set(settings);
    console.log(
        '📊 [applySettingsReactive] userSettings store REPLACED with:',
        {
            hasStoryMode: !!settings.storyMode,
            storyModeEnabled: settings.storyMode?.enabled,
            provider: settings.storyMode?.provider,
            hasApiKeys: !!settings.storyMode?.apiKeys
        }
    );

    // CRITICAL: Invalidate cache immediately after updating store
    invalidateSettingsCache();

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
    // Support nested keys like "storyMode.customFormat"
    pendingChanges.update(changes => {
        if (key.includes('.')) {
            // Handle nested key
            const parts = key.split('.');
            const topLevelKey = parts[0];
            const nestedPath = parts.slice(1).join('.');

            // Preserve existing nested structure
            const existingTopLevel = changes[topLevelKey] || {};

            // Build new nested value
            let nestedValue = existingTopLevel;
            const pathParts = nestedPath.split('.');

            // Build nested object path by path
            let current = nestedValue;
            for (let i = 0; i < pathParts.length - 1; i++) {
                if (!current[pathParts[i]]) {
                    current[pathParts[i]] = {};
                }
                current = current[pathParts[i]];
            }

            // Set final value
            current[pathParts[pathParts.length - 1]] = value;

            return {
                ...changes,
                [topLevelKey]: nestedValue
            };
        } else {
            // Handle flat key (original behavior)
            return {
                ...changes,
                [key]: value
            };
        }
    });
}

// Deep merge function for nested settings
function deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
        if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key])
        ) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}

export async function saveAllSettings() {
    try {
        settingsStatus.update(status => ({ ...status, isSaving: true }));

        const currentSettings = get(userSettings);
        const pendingSettings = get(pendingChanges);
        const tier = get(accountTier);

        // Merge current settings with pending changes (deep merge for nested objects!)
        let updatedSettings = deepMerge(currentSettings, pendingSettings);

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
            // CRITICAL: saveSettingsToAPI already updates profile.name (line 1397)
            // No need to call updateAccountName separately - this was causing duplicate n8n calls!
            // The name is included in updatedSettings and will be sent via saveSettingsToAPI

            await saveSettingsToAPI(updatedSettings);

            // Invalidate cache (force fresh account data on next load)
            invalidateCachePattern(`/api/account:read:${account.userId}`);
            console.log('🗑️ Cache invalidated after settings save');

            // CRITICAL: Update currentAccount.metadata.settings immediately
            // This ensures effectiveSettings derived store recomputes!
            currentAccount.update(acc => {
                if (acc && acc.metadata) {
                    return {
                        ...acc,
                        metadata: {
                            ...acc.metadata,
                            settings: updatedSettings
                        }
                    };
                }
                return acc;
            });
            console.log(
                '✅ currentAccount.metadata.settings updated for reactivity'
            );

            // CRITICAL: Update USER_PREFERENCES in localStorage with ALL settings!
            // This ensures Story Mode and other settings persist correctly
            const currentPrefs =
                storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES) || {};

            // Parse existing metadata (might be string from n8n)
            const existingMetadata =
                typeof currentPrefs.metadata === 'string'
                    ? JSON.parse(currentPrefs.metadata)
                    : currentPrefs.metadata || {};

            // Update metadata.settings with new settings
            const updatedMetadata = {
                ...existingMetadata,
                settings: updatedSettings // ← COMPLETE settings object!
            };

            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                ...currentPrefs,
                name: updatedSettings.name,
                profile: {
                    ...(currentPrefs.profile || {}),
                    name: updatedSettings.name
                },
                metadata: updatedMetadata, // ← Updated with ALL settings!
                lastSettingsUpdate: new Date().toISOString()
            });
            console.log(
                '✅ USER_PREFERENCES updated in localStorage with ALL settings:',
                {
                    name: updatedSettings.name,
                    hasStoryMode: !!updatedSettings.storyMode,
                    storyModeEnabled: updatedSettings.storyMode?.enabled,
                    provider: updatedSettings.storyMode?.provider
                }
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

        // NOTE: userSettings.set() is already called in applySettingsReactive()
        // No need to call it again here (prevents double-update)
        console.log(
            '✅ userSettings store already updated via applySettingsReactive'
        );

        // Clear pending changes
        pendingChanges.set({});
        console.log('🧹 Pending changes cleared');

        // CRITICAL: Invalidate getCurrentUserSettings cache
        // This forces the next call to reload from stores/localStorage
        invalidateSettingsCache();

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
// CRITICAL: Must preserve dailyUsage when updating name!
async function updateAccountName(userId, name) {
    try {
        const account = get(currentAccount);

        // CRITICAL: Load current dailyUsage to preserve it during name update!
        // dailyUsage is in its own column and must be explicitly sent to preserve it
        // IMPORTANT: We MUST load dailyUsage from API if not available locally to ensure we have the latest data!
        let currentDailyUsage = null;
        try {
            // Priority 1: Try to get from account.dailyUsage (if already loaded)
            if (
                account?.dailyUsage &&
                typeof account.dailyUsage === 'object' &&
                account.dailyUsage.date
            ) {
                currentDailyUsage = account.dailyUsage;
                console.log(
                    '✅ [NAME UPDATE] Using dailyUsage from account store:',
                    {
                        date: currentDailyUsage.date,
                        used: currentDailyUsage.used,
                        limit: currentDailyUsage.limit
                    }
                );
            } else {
                // Use centralized loadDailyUsage utility (single source of truth)
                const { loadDailyUsage } = await import(
                    '../utils/dailyUsageLoader.js'
                );
                currentDailyUsage = await loadDailyUsage(account, {
                    includeAPI: true
                });
                if (currentDailyUsage) {
                    console.log(
                        '✅ [NAME UPDATE] Loaded dailyUsage using centralized loader:',
                        {
                            date: currentDailyUsage.date,
                            used: currentDailyUsage.used,
                            limit: currentDailyUsage.limit
                        }
                    );
                }
            }

            // CRITICAL: Validate that dailyUsage has required fields
            if (
                currentDailyUsage &&
                (!currentDailyUsage.date || currentDailyUsage.date === '')
            ) {
                console.warn(
                    '⚠️ [NAME UPDATE] dailyUsage missing date field - treating as invalid'
                );
                currentDailyUsage = null;
            }
        } catch (error) {
            console.error('❌ [NAME UPDATE] Error loading dailyUsage:', error);
            currentDailyUsage = null;
        }

        if (!currentDailyUsage) {
            console.warn(
                '⚠️ [NAME UPDATE] No valid dailyUsage found - n8n MUST preserve from Google Sheets!'
            );
        }

        // CRITICAL: Build clean metadata without duplicate fields (fields with own columns!)
        // Single Source of Truth: Fields with own columns should NOT be in metadata
        const metadataToSend = {
            ...(account?.metadata || {}),
            updatedAt: new Date().toISOString(),
            updatedVia: 'settings-ui-name-change'
        };

        // CRITICAL: Clean metadata to remove duplicate fields (createdAt, dailyUsage, profile, tier, etc.)
        // These fields have their own columns and should NOT be in metadata!
        const cleanedMetadata = prepareMetadataForAPI(metadataToSend, {
            source: 'updateAccountName'
        });

        // Validate (warns in dev if duplicates found)
        validateMetadataNoDuplicates(cleanedMetadata, 'updateAccountName');

        // CRITICAL: Build request body with dailyUsage if available
        // If dailyUsage is not available, n8n MUST preserve it from lookupData!
        const requestBody = {
            action: 'update', // Required for n8n
            userId: userId,
            email: account?.email || '',
            profile: {
                ...(account?.profile || {}),
                name: name
            },
            lastLogin: new Date().toISOString(), // Update lastLogin
            metadata: cleanedMetadata // Clean metadata without duplicates!
        };

        // CRITICAL: Include dailyUsage ONLY if we have valid data!
        // If not included, n8n will preserve from lookupData (Google Sheets)
        if (currentDailyUsage && currentDailyUsage.date) {
            requestBody.dailyUsage = currentDailyUsage;
            console.log('✅ [NAME UPDATE] Including dailyUsage in request:', {
                date: currentDailyUsage.date,
                used: currentDailyUsage.used,
                limit: currentDailyUsage.limit
            });
        } else {
            console.warn(
                '⚠️ [NAME UPDATE] NOT including dailyUsage in request - n8n MUST preserve from Google Sheets!'
            );
        }

        const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(requestBody)
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

    // Support nested keys like "storyMode.customFormat"
    if (!key.includes('.')) {
        return pending[key];
    }

    const getNestedValue = (obj, path) => {
        if (!obj || typeof obj !== 'object') return undefined;
        const parts = path.split('.');
        let result = obj;
        for (const part of parts) {
            if (result === undefined || result === null) return undefined;
            result = result[part];
        }
        return result;
    };

    return getNestedValue(pending, key);
}

export function getEffectiveValue(key) {
    const pending = get(pendingChanges);
    const settings = get(userSettings);
    const tier = get(accountTier);
    // CRITICAL: Also check effectiveSettings (Single Source of Truth from currentAccount!)
    const effective = get(effectiveSettings);

    // Support nested keys like "storyMode.customFormat"
    const getNestedValue = (obj, path) => {
        if (!obj || typeof obj !== 'object') return undefined;
        const parts = path.split('.');
        let result = obj;
        for (const part of parts) {
            if (result === undefined || result === null) return undefined;
            result = result[part];
        }
        return result;
    };

    // Priority 1: Pending changes (unsaved)
    const pendingValue = getNestedValue(pending, key);
    if (pendingValue !== undefined) {
        console.log(
            `📝 getEffectiveValue(${key}): Using pending value:`,
            pendingValue
        );
        return pendingValue;
    }

    // Priority 2: User settings (saved)
    const settingsValue = getNestedValue(settings, key);
    if (settingsValue !== undefined) {
        console.log(
            `📦 getEffectiveValue(${key}): Using userSettings value:`,
            settingsValue
        );
        return settingsValue;
    }

    // Priority 3: Effective settings (from currentAccount.metadata.settings - Single Source of Truth!)
    const effectiveValue = getNestedValue(effective, key);
    if (effectiveValue !== undefined) {
        console.log(
            `🔗 getEffectiveValue(${key}): Using effectiveSettings value (from account.metadata.settings):`,
            effectiveValue
        );
        return effectiveValue;
    }

    // Priority 4: Tier defaults (FREE vs PRO)
    const defaults =
        tier === 'pro' ? DEFAULT_PRO_SETTINGS : DEFAULT_FREE_SETTINGS;
    const defaultValue = getNestedValue(defaults, key);

    if (defaultValue !== undefined) {
        console.log(
            `⚙️ getEffectiveValue(${key}): Using ${tier} default:`,
            defaultValue
        );
        return defaultValue;
    }

    console.warn(`⚠️ getEffectiveValue(${key}): No value found!`, {
        hasPending: !!pending && Object.keys(pending).length > 0,
        hasSettings: !!settings && Object.keys(settings).length > 0,
        hasEffective: !!effective && Object.keys(effective).length > 0,
        effectiveKeys: effective ? Object.keys(effective).slice(0, 10) : []
    });
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

/**
 * Get current user settings with all tier defaults applied
 * This is a helper function for components that need the complete settings object
 * @returns {Object} Complete settings object with tier defaults
 */
// Cache for getCurrentUserSettings to prevent excessive calls
let lastSettingsCache = null;
let lastSettingsCacheTime = 0;
const SETTINGS_CACHE_DURATION = 100; // 100ms cache

/**
 * Invalidate the settings cache
 * Call this after saving settings to force reload
 */
export function invalidateSettingsCache() {
    console.log('🔄 Settings cache invalidated');
    lastSettingsCache = null;
    lastSettingsCacheTime = 0;
}

export function getCurrentUserSettings() {
    // Use cache if recent (prevents 100+ calls per render!)
    const now = Date.now();
    if (
        lastSettingsCache &&
        now - lastSettingsCacheTime < SETTINGS_CACHE_DURATION
    ) {
        return lastSettingsCache;
    }

    // Try effectiveSettings first
    const effective = get(effectiveSettings);
    if (effective && Object.keys(effective).length > 0) {
        lastSettingsCache = effective;
        lastSettingsCacheTime = now;
        return effective;
    }

    // Fallback to userSettings
    const user = get(userSettings);
    if (user && Object.keys(user).length > 0) {
        lastSettingsCache = user;
        lastSettingsCacheTime = now;
        return user;
    }

    // Fallback to currentAccount.metadata.settings
    const account = get(currentAccount);
    if (account?.metadata?.settings) {
        lastSettingsCache = account.metadata.settings;
        lastSettingsCacheTime = now;
        return account.metadata.settings;
    }

    // Last resort: tier defaults
    const tier = get(accountTier);
    const defaults =
        tier === 'pro' ? DEFAULT_PRO_SETTINGS : DEFAULT_FREE_SETTINGS;
    lastSettingsCache = defaults;
    lastSettingsCacheTime = now;
    return defaults;
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
            // CRITICAL: Priority 1: Extract settings from currentAccount (backend data)
            // This is the SINGLE SOURCE OF TRUTH after login!
            // account.metadata.settings contains the latest settings from Google Sheets
            const accountSettings = extractSettingsFromAccount(account);
            if (accountSettings && Object.keys(accountSettings).length > 0) {
                console.log('✅ Settings extracted from currentAccount:', {
                    hasName: !!accountSettings.name,
                    hasLanguage: !!accountSettings.language,
                    hasTheme: !!accountSettings.theme,
                    hasStoryMode: !!accountSettings.storyMode,
                    settingsKeys: Object.keys(accountSettings)
                });
                loadedSettings = accountSettings;
            }

            // Priority 2: Try to load settings from API (if not already loaded from account)
            // This is useful for force refresh, but account.metadata.settings should be primary
            if (!loadedSettings || Object.keys(loadedSettings).length === 0) {
                try {
                    const apiSettings = await loadSettingsFromAPI();
                    if (apiSettings) {
                        console.log(
                            '✅ Settings loaded from API:',
                            apiSettings
                        );
                        loadedSettings = apiSettings;
                    }
                } catch (error) {
                    // CORS error is expected in localhost - use localStorage instead
                    // Only log if NOT localhost CORS (which is expected)
                    if (error.message === 'CORS: Localhost development mode') {
                        // Silent - expected behavior on localhost
                    } else if (
                        error.message.includes('CORS') ||
                        error.message.includes('Failed to fetch')
                    ) {
                        console.log(
                            'ℹ️ API not available (CORS), using local settings'
                        );
                    } else {
                        console.warn('⚠️ API error:', error.message);
                    }
                }
            }
        }

        // Priority 3: Fallback to local settings (localStorage)
        if (!loadedSettings || Object.keys(loadedSettings).length === 0) {
            // Priority 1: Check localStorage.USER_PREFERENCES.metadata.settings
            const localStoragePrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES
            );

            if (localStoragePrefs) {
                // Parse metadata (might be string from n8n)
                const parsedMetadata =
                    typeof localStoragePrefs.metadata === 'string'
                        ? JSON.parse(localStoragePrefs.metadata)
                        : localStoragePrefs.metadata || {};

                // Try metadata.settings first (correct structure)
                if (parsedMetadata.settings) {
                    console.log(
                        '✅ Settings loaded from localStorage.USER_PREFERENCES.metadata.settings:',
                        parsedMetadata.settings
                    );
                    loadedSettings = parsedMetadata.settings;
                }
                // Fallback to direct .settings (old structure)
                else if (localStoragePrefs.settings) {
                    console.log(
                        '✅ Settings loaded from localStorage.USER_PREFERENCES.settings (old structure):',
                        localStoragePrefs.settings
                    );
                    loadedSettings = localStoragePrefs.settings;
                }

                // 🔄 MIGRATION: Old storyMode.apiKey → new storyMode.apiKeys
                if (
                    loadedSettings?.storyMode?.apiKey &&
                    !loadedSettings.storyMode.apiKeys
                ) {
                    console.log(
                        '🔄 Migrating old storyMode.apiKey to new apiKeys structure...'
                    );
                    const oldKey = loadedSettings.storyMode.apiKey;
                    const provider =
                        loadedSettings.storyMode.provider || 'openai';

                    loadedSettings.storyMode.apiKeys = {
                        openai: '',
                        gemini: '',
                        mistral: '',
                        claude: '',
                        custom: '',
                        [provider]: oldKey // Move old key to current provider
                    };

                    delete loadedSettings.storyMode.apiKey; // Remove old field

                    // Save migrated settings back to localStorage
                    const updatedMetadata = {
                        ...parsedMetadata,
                        settings: loadedSettings
                    };
                    storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                        ...localStoragePrefs,
                        metadata: updatedMetadata
                    });

                    console.log(
                        '✅ Migration complete! Old apiKey moved to apiKeys[' +
                            provider +
                            ']'
                    );
                }
            }

            // Priority 2: Check cookies
            if (!loadedSettings) {
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

        // Apply settings (updates userSettings store + language/theme stores + UI)
        // NOTE: applySettingsReactive() handles userSettings.set() internally
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

        // CRITICAL: Ensure email is always present (required for n8n workflow)
        // For updates, email can be empty string, but n8n will use existing email from Google Sheets
        // However, it's better to always send a valid email if available
        if (!account.email || account.email.trim() === '') {
            console.warn(
                '⚠️ Account email is missing, trying to get from localStorage...'
            );
            const prefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
            const storedEmail = prefs.email || account.email || '';
            if (storedEmail && storedEmail.trim() !== '') {
                // Update account with email from localStorage
                account.email = storedEmail;
            } else {
                console.warn(
                    '⚠️ No email found - n8n will use existing email from Google Sheets'
                );
            }
        }

        // CRITICAL: Get LATEST usageHistory from localStorage/store
        const currentPrefs = storageHelpers.get(
            STORAGE_KEYS.USER_PREFERENCES,
            {}
        );
        const currentMetadata =
            currentPrefs.metadata || account?.metadata || {};

        // Also check usageHistory store (might be more recent!)
        let latestUsageHistory = currentMetadata.usageHistory || [];
        try {
            const { usageHistory: usageHistoryStore } = await import(
                './userDataStore.js'
            );
            const storeData = get(usageHistoryStore);
            if (
                storeData?.data &&
                Array.isArray(storeData.data) &&
                storeData.data.length > 0
            ) {
                // Use store data if it has more entries
                if (storeData.data.length > latestUsageHistory.length) {
                    latestUsageHistory = storeData.data;
                    console.log(
                        '📊 Using usageHistory from store:',
                        latestUsageHistory.length,
                        'entries'
                    );
                }
            }
        } catch (error) {
            console.warn(
                '⚠️ Could not load usageHistory from store, using localStorage:',
                error
            );
        }

        console.log(
            '💾 [SETTINGS SAVE] Preserving usageHistory:',
            latestUsageHistory.length,
            'entries'
        );

        // CRITICAL: Load current dailyUsage to preserve it during settings save!
        // Use centralized loadDailyUsage utility (single source of truth)
        let currentDailyUsage = null;
        try {
            const { loadDailyUsage } = await import(
                '../utils/dailyUsageLoader.js'
            );
            currentDailyUsage = await loadDailyUsage(account, {
                includeAPI: true
            });
            if (currentDailyUsage) {
                console.log(
                    '✅ [SETTINGS SAVE] Loaded dailyUsage using centralized loader:',
                    {
                        date: currentDailyUsage.date,
                        used: currentDailyUsage.used,
                        limit: currentDailyUsage.limit
                    }
                );
            }
        } catch (error) {
            console.warn(
                '⚠️ [SETTINGS SAVE] Could not load dailyUsage, n8n will preserve from Google Sheets:',
                error
            );
        }

        if (!currentDailyUsage) {
            console.warn(
                '⚠️ [SETTINGS SAVE] No dailyUsage found - n8n will preserve existing value from Google Sheets'
            );
        } else {
            console.log('✅ [SETTINGS SAVE] Preserving dailyUsage:', {
                date: currentDailyUsage.date,
                used: currentDailyUsage.used,
                limit: currentDailyUsage.limit
            });
        }

        // CRITICAL: Build clean metadata without duplicate fields (fields with own columns!)
        // Single Source of Truth: Fields with own columns should NOT be in metadata
        const metadataToSend = {
            ...currentMetadata,
            usageHistory: latestUsageHistory, // CRITICAL: Include latest usageHistory!
            settings: settings, // UserSettings → Google Sheets metadata column
            updatedAt: new Date().toISOString(),
            updatedVia: 'settings-ui',
            lastSettingsSave: new Date().toISOString()
        };

        // CRITICAL: Clean metadata to remove duplicate fields (createdAt, dailyUsage, profile, tier, etc.)
        // These fields have their own columns and should NOT be in metadata!
        const cleanedMetadata = prepareMetadataForAPI(metadataToSend, {
            source: 'saveSettingsToAPI'
        });

        // Validate (warns in dev if duplicates found)
        validateMetadataNoDuplicates(cleanedMetadata, 'saveSettingsToAPI');

        const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'update', // Required for n8n
                userId: account.userId,
                email: account.email || '',
                // CRITICAL: Include dailyUsage to preserve it during settings save!
                ...(currentDailyUsage ? { dailyUsage: currentDailyUsage } : {}),
                profile: {
                    ...(account?.profile || {}),
                    name: settings.name || account.name || ''
                },
                lastLogin: new Date().toISOString(), // Update lastLogin on settings save
                metadata: cleanedMetadata // Clean metadata without duplicates!
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

        // MODERN BEST PRACTICE: Sync response data back to stores & localStorage!
        if (result.success && result.account) {
            console.log(
                '🔄 [SYNC] Syncing backend response to local stores...'
            );

            // Parse response data (might be strings from n8n!)
            const parsedAccount =
                typeof result.account === 'string'
                    ? JSON.parse(result.account)
                    : result.account;

            const parsedMetadata =
                typeof parsedAccount.metadata === 'string'
                    ? JSON.parse(parsedAccount.metadata)
                    : parsedAccount.metadata || {};

            const parsedProfile =
                typeof parsedAccount.profile === 'string'
                    ? JSON.parse(parsedAccount.profile)
                    : parsedAccount.profile || {};

            // CRITICAL: Parse dailyUsage from response (separate column!)
            let parsedDailyUsage = null;
            if (parsedAccount.dailyUsage) {
                if (typeof parsedAccount.dailyUsage === 'string') {
                    try {
                        parsedDailyUsage = JSON.parse(parsedAccount.dailyUsage);
                    } catch (e) {
                        console.warn(
                            '⚠️ [SETTINGS SAVE] Failed to parse dailyUsage from response:',
                            e
                        );
                    }
                } else if (typeof parsedAccount.dailyUsage === 'object') {
                    parsedDailyUsage = parsedAccount.dailyUsage;
                }
            }

            console.log(
                '📊 [SYNC] Backend returned usageHistory:',
                parsedMetadata.usageHistory?.length || 0,
                'entries'
            );
            if (parsedDailyUsage) {
                console.log('✅ [SETTINGS SAVE] Backend returned dailyUsage:', {
                    date: parsedDailyUsage.date,
                    used: parsedDailyUsage.used,
                    limit: parsedDailyUsage.limit
                });
            }

            // Update localStorage with backend truth
            const updatedPrefs = {
                ...currentPrefs,
                metadata: parsedMetadata,
                profile: parsedProfile,
                tier: parsedAccount.tier || currentPrefs.tier,
                lastLogin: parsedAccount.lastLogin || currentPrefs.lastLogin
            };

            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
            console.log('✅ [SYNC] localStorage updated with backend data');

            // Update currentAccount store with dailyUsage
            try {
                const { syncAccountData } = await import('./accountStore.js');
                syncAccountData({
                    ...account,
                    metadata: parsedMetadata,
                    profile: parsedProfile,
                    tier: parsedAccount.tier || account.tier,
                    // CRITICAL: Include dailyUsage from response!
                    dailyUsage: parsedDailyUsage || account.dailyUsage || null
                });
                console.log(
                    '✅ [SYNC] currentAccount store updated with dailyUsage'
                );
            } catch (error) {
                console.warn(
                    '⚠️ [SYNC] Failed to update currentAccount store:',
                    error
                );
            }

            // Update userDataStore (usageHistory)
            try {
                const { usageHistory: usageHistoryStore } = await import(
                    './userDataStore.js'
                );
                if (
                    parsedMetadata.usageHistory &&
                    Array.isArray(parsedMetadata.usageHistory)
                ) {
                    usageHistoryStore.update(state => ({
                        ...state,
                        data: parsedMetadata.usageHistory,
                        lastUpdate: Date.now(),
                        isCached: false
                    }));
                    console.log(
                        '✅ [SYNC] usageHistory store updated with',
                        parsedMetadata.usageHistory.length,
                        'entries'
                    );
                }
            } catch (error) {
                console.warn(
                    '⚠️ [SYNC] Failed to update usageHistory store:',
                    error
                );
            }
        }

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
            // Silent skip - expected behavior on localhost
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
        console.log('🔍 [LOAD] API response:', result);

        if (result.success && result.account) {
            console.log('🔄 [SYNC] Syncing backend data to local stores...');

            // Parse response data (might be strings from n8n!)
            const parsedAccount =
                typeof result.account === 'string'
                    ? JSON.parse(result.account)
                    : result.account;

            const parsedMetadata =
                typeof parsedAccount.metadata === 'string'
                    ? JSON.parse(parsedAccount.metadata)
                    : parsedAccount.metadata || {};

            const parsedProfile =
                typeof parsedAccount.profile === 'string'
                    ? JSON.parse(parsedAccount.profile)
                    : parsedAccount.profile || {};

            console.log('📊 [SYNC] Backend data:', {
                hasSettings: !!parsedMetadata.settings,
                hasUsageHistory: !!parsedMetadata.usageHistory,
                usageHistoryLength: parsedMetadata.usageHistory?.length || 0,
                profileName: parsedProfile.name
            });

            // Extract settings from backend
            const backendSettings = parsedMetadata.settings || {};
            const accountName =
                parsedProfile.name || parsedAccount.name || account.name;

            // CRITICAL: Check if backend has settings
            // If backend is empty, prefer localStorage to prevent overwriting!
            const hasBackendSettings =
                backendSettings && Object.keys(backendSettings).length > 0;

            let finalSettings;

            if (!hasBackendSettings) {
                // Backend empty - use localStorage settings
                console.warn(
                    '⚠️ [SYNC] Backend has no settings, preserving localStorage'
                );
                const localPrefs = storageHelpers.get(
                    STORAGE_KEYS.USER_PREFERENCES,
                    {}
                );
                const localMetadata =
                    typeof localPrefs.metadata === 'string'
                        ? JSON.parse(localPrefs.metadata)
                        : localPrefs.metadata || {};
                const localSettings = localMetadata.settings || {};

                finalSettings = {
                    ...DEFAULT_FREE_SETTINGS,
                    ...localSettings, // ← Preserve localStorage!
                    name: accountName
                };

                console.log('✅ [SYNC] Preserved localStorage settings:', {
                    hasStoryMode: !!localSettings.storyMode,
                    storyModeEnabled: localSettings.storyMode?.enabled
                });
            } else {
                // Backend has settings - use them (they are newer)
                finalSettings = {
                    ...DEFAULT_FREE_SETTINGS,
                    ...backendSettings,
                    name: accountName
                };

                console.log('✅ [SYNC] Using backend settings:', {
                    hasStoryMode: !!backendSettings.storyMode,
                    storyModeEnabled: backendSettings.storyMode?.enabled
                });
            }

            // MODERN SYNC PATTERN: Update ALL stores & storage

            // 1. Update localStorage (single source of truth)
            const currentPrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES,
                {}
            );

            // 2. Update userSettings store IMMEDIATELY for reactivity
            userSettings.update(state => {
                console.log(
                    '📊 [SYNC] Updating userSettings store with loaded settings'
                );
                return {
                    ...state,
                    ...finalSettings
                };
            });

            const updatedPrefs = {
                ...currentPrefs,
                metadata: parsedMetadata, // ← Complete metadata (incl. usageHistory!)
                profile: parsedProfile, // ← Complete profile
                tier: parsedAccount.tier || currentPrefs.tier,
                lastLogin: parsedAccount.lastLogin || currentPrefs.lastLogin,
                lastSettingsLoad: new Date().toISOString()
            };

            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
            console.log('✅ [SYNC] localStorage updated');

            // 2. Update userSettings store
            userSettings.set(finalSettings);
            console.log('✅ [SYNC] userSettings store updated');

            // 3. Update currentAccount store
            try {
                const { syncAccountData } = await import('./accountStore.js');
                syncAccountData({
                    ...account,
                    metadata: parsedMetadata,
                    profile: parsedProfile,
                    tier: parsedAccount.tier || account.tier
                });
                console.log('✅ [SYNC] currentAccount store updated');
            } catch (error) {
                console.warn(
                    '⚠️ [SYNC] Failed to update currentAccount:',
                    error
                );
            }

            // 4. Update usageHistory store
            try {
                const { usageHistory: usageHistoryStore } = await import(
                    './userDataStore.js'
                );
                if (
                    parsedMetadata.usageHistory &&
                    Array.isArray(parsedMetadata.usageHistory)
                ) {
                    usageHistoryStore.update(state => ({
                        ...state,
                        data: parsedMetadata.usageHistory,
                        lastUpdate: Date.now(),
                        isCached: false
                    }));
                    console.log(
                        '✅ [SYNC] usageHistory store updated with',
                        parsedMetadata.usageHistory.length,
                        'entries'
                    );
                }
            } catch (error) {
                console.warn(
                    '⚠️ [SYNC] Failed to update usageHistory store:',
                    error
                );
            }

            console.log('✅ [LOAD] Settings loaded and synced successfully');
            return finalSettings;
        }

        return null;
    } catch (error) {
        // Silent skip for expected localhost CORS error
        if (error.message === 'CORS: Localhost development mode') {
            console.log(
                'ℹ️ [Settings] Skipping API load on localhost (expected CORS behavior)'
            );
            return null; // Return null instead of throwing
        }
        console.error('❌ Load settings from API error:', error);
        throw error;
    }
}
