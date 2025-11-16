// src/utils/settingsDebug.js
// Debugging utilities for user settings

import { get } from 'svelte/store';
import { STORAGE_KEYS } from '../config/storage.js';

/**
 * Debug: Print all settings-related data
 */
export function debugSettings() {
    console.group('🔍 Settings Debug Info');

    // 1. Stores
    console.group('📦 Stores');
    import('../stores/contentStore.js').then(({ currentLanguage }) => {
        console.log('currentLanguage:', get(currentLanguage));
    });
    import from '../stores/appStores).then(({ darkMode }) => {
        console.log('darkMode:', get(darkMode));
    });
    import('../stores/userSettingsStore.js').then(({ userSettings, pendingChanges, hasUnsavedChanges }) => {
        console.log('userSettings:', get(userSettings));
        console.log('pendingChanges:', get(pendingChanges));
        console.log('hasUnsavedChanges:', get(hasUnsavedChanges));
    });
    import from '../stores/appStores).then(({ currentAccount, accountTier }) => {
        console.log('currentAccount:', get(currentAccount));
        console.log('accountTier:', get(accountTier));
    });
    console.groupEnd();

    // 2. localStorage
    console.group('💾 localStorage');
    Object.keys(STORAGE_KEYS).forEach(key => {
        const storageKey = STORAGE_KEYS[key];
        const value = localStorage.getItem(storageKey);
        console.log(`${key} (${storageKey}):`, value);
    });
    console.groupEnd();

    // 3. Cookies
    console.group('🍪 Cookies');
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key.startsWith('keymoji_')) {
            acc[key] = decodeURIComponent(value);
        }
        return acc;
    }, {});
    console.log(cookies);
    console.groupEnd();

    // 4. DOM State
    console.group('🎨 DOM State');
    console.log('document.documentElement.lang:', document.documentElement.lang);
    console.log('document.documentElement.classList:', Array.from(document.documentElement.classList));
    console.log('prefers-color-scheme:', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    console.groupEnd();

    console.groupEnd();
}

/**
 * Debug: Check data consistency
 */
export function checkSettingsConsistency() {
    console.group('✅ Settings Consistency Check');

    const issues = [];

    // Check language consistency
    import('../stores/contentStore.js').then(({ currentLanguage }) => {
        const langStore = get(currentLanguage);
        const langStorage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
        const langDOM = document.documentElement.lang;

        console.log('Language:');
        console.log('  Store:', langStore);
        console.log('  Storage:', langStorage);
        console.log('  DOM:', langDOM);

        if (langStore !== langStorage) {
            issues.push(`Language mismatch: Store="${langStore}" vs Storage="${langStorage}"`);
        }
        if (langStore !== langDOM) {
            issues.push(`Language mismatch: Store="${langStore}" vs DOM="${langDOM}"`);
        }
    });

    // Check theme consistency
    import from '../stores/appStores).then(({ darkMode }) => {
        const darkModeStore = get(darkMode);
        const darkModeStorage = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
        const themeStorage = localStorage.getItem(STORAGE_KEYS.THEME);
        const hasClassDark = document.documentElement.classList.contains('dark');

        console.log('Theme:');
        console.log('  darkMode Store:', darkModeStore);
        console.log('  darkMode Storage:', darkModeStorage);
        console.log('  theme Storage:', themeStorage);
        console.log('  DOM has .dark:', hasClassDark);

        if (darkModeStore !== darkModeStorage) {
            issues.push(`DarkMode mismatch: Store=${darkModeStore} vs Storage=${darkModeStorage}`);
        }
        if (darkModeStore !== hasClassDark) {
            issues.push(`DarkMode mismatch: Store=${darkModeStore} vs DOM=${hasClassDark}`);
        }
    });

    // Check userSettings consistency
    import('../stores/userSettingsStore.js').then(({ userSettings }) => {
        const settings = get(userSettings);
        const prefsStorage = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        
        console.log('UserSettings:');
        console.log('  Store:', settings);
        console.log('  Storage:', prefsStorage);

        if (prefsStorage) {
            try {
                const parsed = JSON.parse(prefsStorage);
                if (parsed.settings) {
                    if (JSON.stringify(settings) !== JSON.stringify(parsed.settings)) {
                        issues.push('UserSettings mismatch: Store vs Storage');
                    }
                }
            } catch (e) {
                issues.push('UserSettings: Failed to parse storage');
            }
        }
    });

    // Report issues
    if (issues.length === 0) {
        console.log('✅ All settings are consistent!');
    } else {
        console.warn(`⚠️ Found ${issues.length} consistency issues:`);
        issues.forEach(issue => console.warn('  -', issue));
    }

    console.groupEnd();

    return issues;
}

/**
 * Debug: Export all settings data
 */
export async function exportDebugData() {
    const data = {
        timestamp: new Date().toISOString(),
        
        stores: {},
        localStorage: {},
        cookies: {},
        dom: {},
        
        consistency: []
    };

    // Stores
    const { currentLanguage } = await import('../stores/contentStore.js');
    const { darkMode } = await import from '../stores/appStores);
    const { userSettings, pendingChanges } = await import('../stores/userSettingsStore.js');
    const { currentAccount, accountTier } = await import from '../stores/appStores);

    data.stores = {
        currentLanguage: get(currentLanguage),
        darkMode: get(darkMode),
        userSettings: get(userSettings),
        pendingChanges: get(pendingChanges),
        currentAccount: get(currentAccount),
        accountTier: get(accountTier)
    };

    // localStorage
    Object.keys(STORAGE_KEYS).forEach(key => {
        const storageKey = STORAGE_KEYS[key];
        const value = localStorage.getItem(storageKey);
        data.localStorage[key] = value;
    });

    // Cookies
    data.cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key.startsWith('keymoji_')) {
            acc[key] = decodeURIComponent(value);
        }
        return acc;
    }, {});

    // DOM
    data.dom = {
        lang: document.documentElement.lang,
        classList: Array.from(document.documentElement.classList),
        prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    };

    // Consistency check
    data.consistency = checkSettingsConsistency();

    return data;
}

/**
 * Debug: Download settings as JSON
 */
export async function downloadDebugData() {
    const data = await exportDebugData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `keymoji-debug-${Date.now()}.json`;
    link.click();

    console.log('✅ Debug data downloaded');
}

/**
 * Debug: Fix common issues
 */
export async function autoFixSettings() {
    console.group('🔧 Auto-fixing settings...');

    const { currentLanguage } = await import('../stores/contentStore.js');
    const { darkMode } = await import from '../stores/appStores);
    const { userSettings, saveAllSettings } = await import('../stores/userSettingsStore.js');

    // Fix language consistency
    const langStore = get(currentLanguage);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, langStore);
    document.documentElement.lang = langStore;
    console.log('✅ Language fixed:', langStore);

    // Fix theme consistency
    const darkModeStore = get(darkMode);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, darkModeStore.toString());
    if (darkModeStore) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    console.log('✅ Theme fixed:', darkModeStore ? 'dark' : 'light');

    // Save all settings
    try {
        await saveAllSettings();
        console.log('✅ Settings saved');
    } catch (error) {
        console.error('❌ Failed to save settings:', error);
    }

    console.groupEnd();
}

// Make functions available in console
if (typeof window !== 'undefined') {
    window.keymojiDebug = {
        debugSettings,
        checkSettingsConsistency,
        exportDebugData,
        downloadDebugData,
        autoFixSettings
    };
    
    console.log('🔧 Keymoji Debug Tools loaded. Use window.keymojiDebug to access:');
    console.log('  - debugSettings()');
    console.log('  - checkSettingsConsistency()');
    console.log('  - exportDebugData()');
    console.log('  - downloadDebugData()');
    console.log('  - autoFixSettings()');
}

