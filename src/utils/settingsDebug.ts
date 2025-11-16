// src/utils/settingsDebug.ts
// Debugging utilities for user settings
// TypeScript Migration: v0.7.7

import { STORAGE_KEYS } from '../config/storage';

/**
 * Debug: Print all settings-related data
 */
export async function debugSettings(): Promise<void> {
    console.group('🔍 Settings Debug Info');

    // 1. Stores (dynamically import to avoid circular dependencies)
    console.group('📦 Stores');
    const { currentLanguage } = await import('../stores/contentStore.ts');
    const { darkMode, currentAccount, accountTier } = await import('../stores/appStores.ts');
    const { userSettings, pendingChanges, hasUnsavedChanges } = await import('../stores/userSettingsStore.ts');
    
    console.log('currentLanguage:', currentLanguage);
    console.log('darkMode:', darkMode);
    console.log('userSettings:', userSettings);
    console.log('pendingChanges:', pendingChanges);
    console.log('hasUnsavedChanges:', hasUnsavedChanges);
    console.log('currentAccount:', currentAccount);
    console.log('accountTier:', accountTier);
    console.groupEnd();

    // 2. localStorage
    console.group('💾 localStorage');
    Object.keys(STORAGE_KEYS).forEach(key => {
        const storageKey = STORAGE_KEYS[key as keyof typeof STORAGE_KEYS];
        const value = localStorage.getItem(storageKey);
        console.log(`${key} (${storageKey}):`, value);
    });
    console.groupEnd();

    // 3. Cookies
    console.group('🍪 Cookies');
    const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie: string) => {
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
export async function checkSettingsConsistency(): Promise<string[]> {
    console.group('✅ Settings Consistency Check');

    const issues: string[] = [];

    // Dynamically import stores
    const { currentLanguage } = await import('../stores/contentStore.ts');
    const { darkMode } = await import('../stores/appStores.ts');
    const { userSettings } = await import('../stores/userSettingsStore.ts');

    // Check language consistency
    const langStore = currentLanguage;
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

    // Check theme consistency
    const darkModeStore = darkMode;
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

    // Check userSettings consistency
    const settings = userSettings;
    const prefsStorage = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    
    console.log('UserSettings:');
    console.log('  Store:', settings);
    console.log('  Storage:', prefsStorage);

    if (prefsStorage) {
        try {
            const parsedStorage = JSON.parse(prefsStorage);
            if (JSON.stringify(settings) !== JSON.stringify(parsedStorage)) {
                issues.push('UserSettings mismatch: Store vs Storage');
            }
        } catch (error) {
            issues.push('UserSettings Storage parse error');
        }
    }

    // Summary
    console.log('');
    if (issues.length === 0) {
        console.log('✅ No consistency issues found');
    } else {
        console.log(`⚠️ Found ${issues.length} issue(s):`);
        issues.forEach(issue => console.log(`  - ${issue}`));
    }

    console.groupEnd();
    return issues;
}

/**
 * Debug: Export all debug data as JSON
 */
export async function exportDebugData(): Promise<Record<string, unknown>> {
    const data: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        stores: {},
        localStorage: {},
        cookies: {},
        dom: {},
        consistency: []
    };

    // Stores (dynamically import)
    const { currentLanguage } = await import('../stores/contentStore.ts');
    const { darkMode, currentAccount, accountTier } = await import('../stores/appStores.ts');
    const { userSettings, pendingChanges } = await import('../stores/userSettingsStore.ts');

    data.stores = {
        currentLanguage: currentLanguage,
        darkMode: darkMode,
        userSettings: userSettings,
        pendingChanges: pendingChanges,
        currentAccount: currentAccount,
        accountTier: accountTier
    };

    // localStorage
    Object.keys(STORAGE_KEYS).forEach(key => {
        const storageKey = STORAGE_KEYS[key as keyof typeof STORAGE_KEYS];
        const value = localStorage.getItem(storageKey);
        data.localStorage[key] = value;
    });

    // Cookies
    data.cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie: string) => {
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
    data.consistency = await checkSettingsConsistency();

    return data;
}

/**
 * Debug: Download settings as JSON
 */
export async function downloadDebugData(): Promise<void> {
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
export async function autoFixSettings(): Promise<void> {
    console.group('🔧 Auto-fixing settings...');

    // Dynamically import stores
    const { currentLanguage } = await import('../stores/contentStore.ts');
    const { darkMode } = await import('../stores/appStores.ts');

    // Fix language consistency
    const langStore = currentLanguage;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, langStore);
    document.documentElement.lang = langStore;
    console.log('✅ Language fixed:', langStore);

    // Fix theme consistency
    const darkModeStore = darkMode;
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, darkModeStore.toString());
    if (darkModeStore) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    console.log('✅ Theme fixed:', darkModeStore ? 'dark' : 'light');

    // Save all settings
    try {
        const { saveAllSettings } = await import('../stores/userSettingsStore.ts');
        await saveAllSettings();
        console.log('✅ Settings saved');
    } catch (error) {
        console.error('❌ Failed to save settings:', error);
    }

    console.groupEnd();
}

