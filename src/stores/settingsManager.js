// src/stores/settingsManager.js
// Centralized Settings Manager - Single Source of Truth

import { writable, derived, get } from 'svelte/store';
import { currentAccount, accountTier } from './appStores.js';
import { WEBHOOKS } from '../config/api.js';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';
import { setUserPreferences, getUserPreferences } from '../utils/cookies.js';
import {
    validateSettings,
    sanitizeSettings,
    getDefaultSettings
} from '../utils/settingsValidation.js';

// ============================================
// STORES
// ============================================

export const settingsState = writable({
    isInitialized: false,
    isLoading: false,
    isSaving: false,
    lastSaved: null,
    hasError: false,
    errorMessage: null
});

export const currentSettings = writable(getDefaultSettings('free'));
export const pendingChanges = writable({});

export const hasUnsavedChanges = derived(
    pendingChanges,
    $pending => Object.keys($pending).length > 0
);

// ============================================
// INITIALIZATION
// ============================================

let initializationPromise = null;

/**
 * Initialize settings (idempotent - can be called multiple times safely)
 */
export async function initializeSettings() {
    // Return existing promise if already initializing
    if (initializationPromise) {
        console.log('⏳ Settings initialization already in progress...');
        return initializationPromise;
    }

    // Check if already initialized
    const state = get(settingsState);
    if (state.isInitialized) {
        console.log('✅ Settings already initialized');
        return get(currentSettings);
    }

    console.log('🔄 Initializing settings...');

    initializationPromise = _initializeSettings();
    const result = await initializationPromise;
    initializationPromise = null;

    return result;
}

async function _initializeSettings() {
    try {
        settingsState.update(s => ({ ...s, isLoading: true }));

        const account = get(currentAccount);
        const tier = get(accountTier);

        let settings = null;

        // Priority 1: API (if logged in and not localhost)
        if (
            account?.userId &&
            typeof window !== 'undefined' &&
            window.location.hostname !== 'localhost'
        ) {
            try {
                settings = await loadFromAPI(account.userId);
                if (settings) {
                    console.log('✅ Settings loaded from API');
                }
            } catch (error) {
                console.warn('⚠️ API load failed:', error.message);
            }
        }

        // Priority 2: localStorage
        if (!settings) {
            settings = loadFromLocalStorage();
            if (settings) {
                console.log('✅ Settings loaded from localStorage');
            }
        }

        // Priority 3: Cookies
        if (!settings) {
            settings = loadFromCookies();
            if (settings) {
                console.log('✅ Settings loaded from cookies');
            }
        }

        // Priority 4: Defaults
        if (!settings) {
            settings = getDefaultSettings(tier);
            console.log('✅ Using default settings');
        }

        // Ensure critical fields
        if (!settings.name && account?.name) {
            settings.name = account.name;
        }
        if (!settings.language) {
            settings.language =
                storageHelpers.get(STORAGE_KEYS.LANGUAGE) || 'en';
        }
        if (!settings.theme) {
            const isDark = storageHelpers.get(STORAGE_KEYS.DARK_MODE);
            settings.theme =
                storageHelpers.get(STORAGE_KEYS.THEME) ||
                (isDark ? 'dark' : 'light');
        }

        // Merge with defaults to ensure all keys exist
        const mergedSettings = {
            ...getDefaultSettings(tier),
            ...settings
        };

        // Apply to store
        currentSettings.set(mergedSettings);

        // Apply to UI
        await applySettings(mergedSettings);

        settingsState.update(s => ({
            ...s,
            isInitialized: true,
            isLoading: false
        }));

        console.log('✅ Settings initialized:', mergedSettings);
        return mergedSettings;
    } catch (error) {
        console.error('❌ Settings initialization failed:', error);

        settingsState.update(s => ({
            ...s,
            isLoading: false,
            hasError: true,
            errorMessage: error.message
        }));

        // Fallback to defaults
        const fallback = getDefaultSettings('free');
        currentSettings.set(fallback);
        return fallback;
    }
}

// ============================================
// LOADING FUNCTIONS
// ============================================

function loadFromLocalStorage() {
    try {
        const prefs = getUserPreferences();
        return prefs?.settings || null;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return null;
    }
}

function loadFromCookies() {
    try {
        const prefs = getUserPreferences();
        return prefs?.settings || null;
    } catch (error) {
        console.warn('Failed to load from cookies:', error);
        return null;
    }
}

async function loadFromAPI(userId) {
    try {
        const account = get(currentAccount);

        const response = await fetch(WEBHOOKS.ACCOUNT.CRUD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'get',
                userId: userId,
                email: account?.email,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const result = await response.json();

        if (result.success && result.account) {
            return result.account.metadata?.settings || null;
        }

        return null;
    } catch (error) {
        console.warn('API load error:', error.message);
        throw error;
    }
}

// ============================================
// SAVING FUNCTIONS
// ============================================

/**
 * Save all pending changes
 */
export async function saveSettings() {
    try {
        console.log('💾 Saving settings...');

        settingsState.update(s => ({ ...s, isSaving: true }));

        const account = get(currentAccount);
        const tier = get(accountTier);
        const current = get(currentSettings);
        const pending = get(pendingChanges);

        // Merge current + pending
        let updated = { ...current, ...pending };

        // Validate
        const validation = validateSettings(updated, tier);
        if (!validation.isValid) {
            throw new Error(
                `Validation failed: ${validation.errors.join(', ')}`
            );
        }

        if (validation.warnings.length > 0) {
            console.warn('⚠️ Warnings:', validation.warnings);
        }

        // Sanitize (remove pro-only for free users)
        updated = sanitizeSettings(updated, tier);

        console.log('💾 Validated settings:', updated);

        // Apply to UI immediately
        await applySettings(updated);

        // Save to all storage layers
        await saveToAllLayers(updated, account);

        // Update store
        currentSettings.set(updated);
        pendingChanges.set({});

        settingsState.update(s => ({
            ...s,
            isSaving: false,
            lastSaved: new Date().toISOString(),
            hasError: false,
            errorMessage: null
        }));

        console.log('✅ Settings saved successfully');
        return updated;
    } catch (error) {
        console.error('❌ Save settings error:', error);

        settingsState.update(s => ({
            ...s,
            isSaving: false,
            hasError: true,
            errorMessage: error.message
        }));

        throw error;
    }
}

/**
 * Save to all storage layers (localStorage, cookies, API)
 */
async function saveToAllLayers(settings, account) {
    const promises = [];

    // 1. Save to localStorage
    promises.push(
        Promise.resolve().then(() => {
            storageHelpers.set(STORAGE_KEYS.LANGUAGE, settings.language);
            storageHelpers.set(STORAGE_KEYS.THEME, settings.theme);

            // Update USER_PREFERENCES with new settings
            if (account?.userId) {
                const currentPrefs =
                    storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES) || {};
                storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                    ...currentPrefs,
                    name: settings.name,
                    profile: {
                        ...(currentPrefs.profile || {}),
                        name: settings.name
                    },
                    settings: settings,
                    lastSettingsUpdate: new Date().toISOString()
                });
                console.log('✅ localStorage updated');
            }
        })
    );

    // 2. Save to cookies
    promises.push(
        Promise.resolve().then(() => {
            setUserPreferences({
                ...getUserPreferences(),
                settings: settings,
                name: settings.name,
                language: settings.language,
                theme: settings.theme,
                lastSettingsUpdate: new Date().toISOString()
            });
            console.log('✅ Cookies updated');
        })
    );

    // 3. Save to API (if logged in)
    if (account?.userId) {
        promises.push(
            saveToAPI(settings, account).catch(error => {
                console.warn(
                    '⚠️ API save failed (non-critical):',
                    error.message
                );
                // Don't throw - localStorage/cookies save is enough
            })
        );
    }

    await Promise.all(promises);
}

/**
 * Save to API (Google Sheets)
 */
async function saveToAPI(settings, account) {
    const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            userId: account.userId,
            email: account.email,
            profile: {
                ...(account.profile || {}),
                name: settings.name
            },
            metadata: {
                settings: settings,
                updatedAt: new Date().toISOString(),
                updatedVia: 'settings-manager'
            },
            lastLogin: new Date().toISOString()
        })
    });

    if (!response.ok) {
        throw new Error('API save failed');
    }

    const result = await response.json();
    console.log('✅ API updated:', result);
    return result;
}

// ============================================
// APPLYING SETTINGS
// ============================================

/**
 * Apply settings to UI and stores
 */
async function applySettings(settings) {
    const promises = [];

    // Apply theme
    if (settings.theme) {
        promises.push(applyTheme(settings.theme));
    }

    // Apply language
    if (settings.language) {
        promises.push(applyLanguage(settings.language));
    }

    await Promise.all(promises);
}

async function applyTheme(theme) {
    if (typeof document === 'undefined') return;

    const { darkMode } = await import('./appStores.js');
    const root = document.documentElement;

    let isDark = false;

    if (theme === 'dark') {
        root.classList.add('dark');
        isDark = true;
    } else if (theme === 'light') {
        root.classList.remove('dark');
        isDark = false;
    } else {
        // auto
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }

    darkMode.set(isDark);
    console.log('🎨 Theme applied:', theme);
}

async function applyLanguage(language) {
    if (typeof document === 'undefined') return;

    const { currentLanguage } = await import('./contentStore.js');

    currentLanguage.set(language);
    document.documentElement.lang = language;

    window.dispatchEvent(
        new CustomEvent('languageChanged', {
            detail: { language }
        })
    );

    console.log('🌍 Language applied:', language);
}

// ============================================
// UPDATE FUNCTIONS
// ============================================

/**
 * Update a single setting (adds to pending changes)
 */
export function updateSetting(key, value) {
    pendingChanges.update(changes => ({
        ...changes,
        [key]: value
    }));
    console.log(`📝 Setting "${key}" updated (pending):`, value);
}

/**
 * Discard all pending changes
 */
export function discardChanges() {
    pendingChanges.set({});
    settingsState.update(s => ({
        ...s,
        hasError: false,
        errorMessage: null
    }));
    console.log('🗑️ Pending changes discarded');
}

/**
 * Reset settings to defaults
 */
export async function resetSettings() {
    const tier = get(accountTier);
    const defaults = getDefaultSettings(tier);

    currentSettings.set(defaults);
    pendingChanges.set({});

    await saveSettings();
    console.log('🔄 Settings reset to defaults');
}

// ============================================
// EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================

export {
    currentSettings as userSettings,
    settingsState as settingsStatus,
    saveSettings as saveAllSettings,
    initializeSettings as initializeSettingsForUser
};
