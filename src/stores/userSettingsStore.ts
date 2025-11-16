// src/stores/userSettingsStore.svelte.ts
// User Settings Management mit Svelte 5 Runes
import type { UserSettings } from '../types/Account';
import { storageHelpers, STORAGE_KEYS } from '../config/storage';
import { currentAccount, accountTier } from './appStores.ts';
import { WEBHOOKS } from '../config/api';
import { cachedFetch } from '../utils/apiCache';

export interface SettingsStatus {
    isInitialized: boolean;
    isSaving: boolean;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string | null;
}

export const userSettings = writable<Record<string, unknown>>({});
export const pendingChanges = writable<Record<string, unknown>>({});
export const settingsStatus = writable<SettingsStatus>({
    isInitialized: false,
    isSaving: false,
    isLoading: false,
    hasError: false,
    errorMessage: null
});

export const hasUnsavedChanges = derived(
    pendingChanges,
    $pendingChanges => Object.keys($pendingChanges).length > 0
);
export const currentSettings = derived(
    [userSettings, pendingChanges],
    ([$userSettings, $pendingChanges]) => ({
        ...$userSettings,
        ...$pendingChanges
    })
);

export function updateSetting(key: string, value: unknown): void {
    pendingChanges[key] = value;
}

export function discardChanges(): void {
    Object.keys(pendingChanges).forEach(key => {
        delete pendingChanges[key];
    });
}

export function getEffectiveValue(key: string): unknown {
    if (key in pendingChanges) {
        return pendingChanges[key];
    }
    if (key in userSettings) {
        return userSettings[key];
    }
    return getDefaultValue(key);
}

export function getCurrentUserSettings(): Record<string, unknown> {
    return { ...userSettings, ...pendingChanges };
}

export function invalidateSettingsCache(): void {
    storageHelpers.remove(STORAGE_KEYS.USER_PREFERENCES);
}

export async function saveAllSettings(): Promise<void> {
    try {
        settingsStatus.isSaving = true;
        settingsStatus.hasError = false;
        settingsStatus.errorMessage = null;

        const account = currentAccount;
        if (!account || !account.userId) {
            throw new Error('No account found');
        }

        const settingsToSave = { ...userSettings, ...pendingChanges };

        const response = await cachedFetch(WEBHOOKS.UPDATE_ACCOUNT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                body: {
                    userId: account.userId,
                    email: account.email,
                    metadata: {
                        settings: settingsToSave
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save settings');
        }

        Object.assign(userSettings, settingsToSave);
        discardChanges();

        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, settingsToSave);

        settingsStatus.isSaving = false;
    } catch (error) {
        settingsStatus.isSaving = false;
        settingsStatus.hasError = true;
        settingsStatus.errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        throw error;
    }
}

export function resetSettings(): void {
    userSettings = {};
    discardChanges();
    invalidateSettingsCache();
}

export function exportSettings(): string {
    return JSON.stringify(userSettings, null, 2);
}

export function importSettings(json: string): void {
    try {
        const imported = JSON.parse(json);
        Object.assign(userSettings, imported);
        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, imported);
    } catch (error) {
        throw new Error('Invalid settings JSON');
    }
}

export async function initializeSettingsForUser(): Promise<
    Record<string, unknown>
> {
    try {
        settingsStatus.isLoading = true;
        settingsStatus.hasError = false;

        const account = currentAccount;
        if (!account || !account.userId) {
            const cached = storageHelpers.get<Record<string, unknown>>(
                STORAGE_KEYS.USER_PREFERENCES
            );
            if (cached) {
                userSettings = cached;
                settingsStatus.isInitialized = true;
                settingsStatus.isLoading = false;
                return cached;
            }
            const defaults = getDefaultSettings();
            userSettings = defaults;
            settingsStatus.isInitialized = true;
            settingsStatus.isLoading = false;
            return defaults;
        }

        const cached = storageHelpers.get<Record<string, unknown>>(
            STORAGE_KEYS.USER_PREFERENCES
        );
        if (cached) {
            userSettings = cached;
        }

        const response = await cachedFetch(
            `${WEBHOOKS.GET_ACCOUNT}?userId=${account.userId}`
        );
        if (response.ok) {
            const data = await response.json();
            if (data?.account?.metadata?.settings) {
                const settings =
                    typeof data.account.metadata.settings === 'string'
                        ? JSON.parse(data.account.metadata.settings)
                        : data.account.metadata.settings;
                userSettings = settings;
                storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, settings);
            }
        }

        if (Object.keys(userSettings).length === 0) {
            userSettings = getDefaultSettings();
        }

        settingsStatus.isInitialized = true;
        settingsStatus.isLoading = false;
        return userSettings;
    } catch (error) {
        settingsStatus.isLoading = false;
        settingsStatus.hasError = true;
        settingsStatus.errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        const defaults = getDefaultSettings();
        userSettings = defaults;
        return defaults;
    }
}

function getDefaultValue(key: string): unknown {
    const defaults: Record<string, unknown> = {
        name: '',
        language: 'en',
        theme: 'auto',
        passwordLength: 12,
        emojiCount: 4
    };
    return defaults[key];
}

function getDefaultSettings(): Record<string, unknown> {
    const tier = accountTier || 'free';
    return {
        name: '',
        language: 'en',
        theme: 'auto',
        passwordLength: tier === 'pro' ? 16 : 12,
        emojiCount: tier === 'pro' ? 6 : 4,
        animations: true,
        soundEffects: false
    };
}
