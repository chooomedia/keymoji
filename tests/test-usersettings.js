// tests/test-usersettings.js
// Comprehensive UserSettings Tests

import { get } from 'svelte/store';
import {
    initializeSettings,
    saveSettings,
    updateSetting,
    discardChanges,
    resetSettings,
    currentSettings,
    pendingChanges,
    hasUnsavedChanges,
    settingsState
} from '../src/stores/settingsManager.js';
import { STORAGE_KEYS } from '../src/config/storage.js';

/**
 * Test Suite für UserSettings
 */
export async function runUserSettingsTests() {
    console.group('🧪 UserSettings Test Suite');

    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };

    // Helper
    function test(name, fn) {
        results.total++;
        try {
            fn();
            console.log(`✅ PASS: ${name}`);
            results.passed++;
        } catch (error) {
            console.error(`❌ FAIL: ${name}`, error);
            results.failed++;
        }
    }

    async function testAsync(name, fn) {
        results.total++;
        try {
            await fn();
            console.log(`✅ PASS: ${name}`);
            results.passed++;
        } catch (error) {
            console.error(`❌ FAIL: ${name}`, error);
            results.failed++;
        }
    }

    // === Initialization Tests ===
    console.group('📦 Initialization Tests');

    await testAsync('Initialize settings (first call)', async () => {
        await initializeSettings();
        const state = get(settingsState);
        if (!state.isInitialized) throw new Error('Not initialized');
    });

    await testAsync(
        'Initialize settings (second call - idempotent)',
        async () => {
            await initializeSettings();
            await initializeSettings();
            const state = get(settingsState);
            if (!state.isInitialized) throw new Error('Not initialized');
        }
    );

    test('Settings have all required keys', () => {
        const settings = get(currentSettings);
        const required = [
            'name',
            'language',
            'theme',
            'passwordLength',
            'emojiCount'
        ];
        required.forEach(key => {
            if (settings[key] === undefined) {
                throw new Error(`Missing key: ${key}`);
            }
        });
    });

    console.groupEnd();

    // === Update Tests ===
    console.group('📝 Update Tests');

    test('Update single setting', () => {
        updateSetting('language', 'de');
        const pending = get(pendingChanges);
        if (pending.language !== 'de') {
            throw new Error('Setting not in pending changes');
        }
    });

    test('Has unsaved changes flag', () => {
        const hasChanges = get(hasUnsavedChanges);
        if (!hasChanges) {
            throw new Error('Should have unsaved changes');
        }
    });

    test('Discard changes', () => {
        discardChanges();
        const pending = get(pendingChanges);
        if (Object.keys(pending).length > 0) {
            throw new Error('Pending changes not cleared');
        }
    });

    console.groupEnd();

    // === Save Tests ===
    console.group('💾 Save Tests');

    await testAsync('Save settings with validation', async () => {
        updateSetting('language', 'de');
        updateSetting('theme', 'dark');

        await saveSettings();

        const settings = get(currentSettings);
        if (settings.language !== 'de') throw new Error('Language not saved');
        if (settings.theme !== 'dark') throw new Error('Theme not saved');
    });

    test('localStorage updated', () => {
        const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (lang !== 'de') {
            throw new Error('localStorage not updated');
        }
    });

    test('No unsaved changes after save', () => {
        const hasChanges = get(hasUnsavedChanges);
        if (hasChanges) {
            throw new Error('Should have no unsaved changes');
        }
    });

    console.groupEnd();

    // === Validation Tests ===
    console.group('✅ Validation Tests');

    await testAsync('Invalid language rejected', async () => {
        updateSetting('language', 'invalid_lang');

        try {
            await saveSettings();
            throw new Error('Should have thrown validation error');
        } catch (error) {
            if (!error.message.includes('Validation failed')) {
                throw error;
            }
            // Expected error - pass
            discardChanges();
        }
    });

    await testAsync('Invalid theme rejected', async () => {
        updateSetting('theme', 'rainbow');

        try {
            await saveSettings();
            throw new Error('Should have thrown validation error');
        } catch (error) {
            if (!error.message.includes('Validation failed')) {
                throw error;
            }
            discardChanges();
        }
    });

    console.groupEnd();

    // === Reload Tests ===
    console.group('🔄 Reload Tests');

    test('Settings persist after simulated reload', () => {
        // Simulate page reload by re-initializing
        const beforeLanguage = get(currentSettings).language;

        // Clear store (simulates page reload)
        currentSettings.set(getDefaultSettings('free'));

        // Re-initialize
        initializeSettings();

        const afterLanguage = get(currentSettings).language;
        if (beforeLanguage !== afterLanguage) {
            throw new Error('Settings not persisted');
        }
    });

    console.groupEnd();

    // === Theme & Language Sync Tests ===
    console.group('🎨 Theme & Language Sync Tests');

    test('Theme sync with darkMode store', async () => {
        const { darkMode } = await import('../src/stores/appStores.js');

        updateSetting('theme', 'dark');
        await saveSettings();

        if (!get(darkMode)) {
            throw new Error('darkMode store not synced');
        }
    });

    test('Language sync with currentLanguage store', async () => {
        const { currentLanguage } = await import(
            '../src/stores/contentStore.js'
        );

        updateSetting('language', 'en');
        await saveSettings();

        if (get(currentLanguage) !== 'en') {
            throw new Error('currentLanguage store not synced');
        }
    });

    test('DOM classList synced with theme', () => {
        const hasDarkClass =
            document.documentElement.classList.contains('dark');
        const settings = get(currentSettings);

        if (settings.theme === 'dark' && !hasDarkClass) {
            throw new Error('DOM classList not synced');
        }
    });

    test('DOM lang attribute synced with language', () => {
        const domLang = document.documentElement.lang;
        const settings = get(currentSettings);

        if (domLang !== settings.language) {
            throw new Error('DOM lang not synced');
        }
    });

    console.groupEnd();

    // === Results ===
    console.groupEnd();

    console.log('\n📊 Test Results:');
    console.log(`  Total: ${results.total}`);
    console.log(`  Passed: ${results.passed} ✅`);
    console.log(
        `  Failed: ${results.failed} ${results.failed > 0 ? '❌' : ''}`
    );

    if (results.failed === 0) {
        console.log('\n🎉 All tests passed!');
    } else {
        console.warn(`\n⚠️ ${results.failed} test(s) failed`);
    }

    return results;
}

/**
 * Manual test helper functions
 */
export const testHelpers = {
    // Test settings save
    async testSave() {
        console.group('🧪 Testing Settings Save');

        updateSetting('language', 'de');
        updateSetting('theme', 'dark');
        updateSetting('name', 'Test User');

        console.log('Pending changes:', get(pendingChanges));
        console.log('Has unsaved:', get(hasUnsavedChanges));

        await saveSettings();

        console.log('After save:', get(currentSettings));
        console.log(
            'localStorage:',
            localStorage.getItem(STORAGE_KEYS.LANGUAGE)
        );
        console.log('DOM lang:', document.documentElement.lang);
        console.log(
            'DOM dark:',
            document.documentElement.classList.contains('dark')
        );

        console.groupEnd();
    },

    // Test settings reload
    async testReload() {
        console.group('🧪 Testing Settings Reload');

        console.log('Before reload:', get(currentSettings));

        // Clear store
        currentSettings.set(getDefaultSettings('free'));
        console.log('After clear:', get(currentSettings));

        // Re-initialize
        await initializeSettings();
        console.log('After re-init:', get(currentSettings));

        console.groupEnd();
    },

    // Test validation
    async testValidation() {
        console.group('🧪 Testing Validation');

        // Try invalid language
        updateSetting('language', 'invalid');

        try {
            await saveSettings();
            console.error('❌ Should have failed validation');
        } catch (error) {
            console.log('✅ Validation works:', error.message);
        }

        discardChanges();

        console.groupEnd();
    }
};

// Make available in console
if (typeof window !== 'undefined') {
    window.testUserSettings = {
        run: runUserSettingsTests,
        helpers: testHelpers
    };

    console.log(
        '🧪 UserSettings Tests loaded. Run: window.testUserSettings.run()'
    );
}
