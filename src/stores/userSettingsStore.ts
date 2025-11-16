// src/stores/userSettingsStore.svelte.ts
// User Settings Management mit Svelte 5 Runes
import { writable, derived, get } from 'svelte/store';
import { storageHelpers, STORAGE_KEYS } from '../config/storage';
import { currentAccount, accountTier } from './appStores';
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
    pendingChanges.update(changes => {
        return { ...changes, [key]: value };
    });
}

export function discardChanges(): void {
    pendingChanges.set({});
}

export function getEffectiveValue(key: string): unknown {
    const pending = get(pendingChanges);
    const settings = get(userSettings);
    if (key in pending) {
        return pending[key];
    }
    if (key in settings) {
        return settings[key];
    }
    return getDefaultValue(key);
}

export function getCurrentUserSettings(): Record<string, unknown> {
    return { ...get(userSettings), ...get(pendingChanges) };
}

export function invalidateSettingsCache(): void {
    storageHelpers.remove(STORAGE_KEYS.USER_PREFERENCES);
}

export async function saveAllSettings(): Promise<void> {
    try {
        settingsStatus.update(s => ({
            ...s,
            isSaving: true,
            hasError: false,
            errorMessage: null
        }));

        const account = get(currentAccount);
        if (!account || !account.userId) {
            throw new Error('No account found');
        }

        const settingsToSave = { ...get(userSettings), ...get(pendingChanges) };

        const response = (await cachedFetch(WEBHOOKS.ACCOUNT.SECURE_UPDATE, {
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
        })) as Response | null;

        if (!response || !response.ok) {
            throw new Error('Failed to save settings');
        }

        userSettings.set(settingsToSave);
        discardChanges();

        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, settingsToSave);

        settingsStatus.update(s => ({ ...s, isSaving: false }));
    } catch (error) {
        settingsStatus.update(s => ({
            ...s,
            isSaving: false,
            hasError: true,
            errorMessage:
                error instanceof Error ? error.message : 'Unknown error'
        }));
        throw error;
    }
}

export function resetSettings(): void {
    userSettings.set({});
    discardChanges();
    invalidateSettingsCache();
}

export function exportSettings(): string {
    return JSON.stringify(get(userSettings), null, 2);
}

export function importSettings(json: string): void {
    try {
        const imported = JSON.parse(json);
        userSettings.set(imported);
        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, imported);
    } catch (error) {
        throw new Error('Invalid settings JSON');
    }
}

export async function initializeSettingsForUser(): Promise<
    Record<string, unknown>
> {
    try {
        settingsStatus.update(s => ({
            ...s,
            isLoading: true,
            hasError: false
        }));

        const account = get(currentAccount);
        if (!account || !account.userId) {
            const cached = storageHelpers.get<Record<string, unknown>>(
                STORAGE_KEYS.USER_PREFERENCES
            );
            if (cached) {
                userSettings.set(cached);
                settingsStatus.update(s => ({
                    ...s,
                    isInitialized: true,
                    isLoading: false
                }));
                return cached;
            }
            const defaults = getDefaultSettings();
            userSettings.set(defaults);
            settingsStatus.update(s => ({
                ...s,
                isInitialized: true,
                isLoading: false
            }));
            return defaults;
        }

        const cached = storageHelpers.get<Record<string, unknown>>(
            STORAGE_KEYS.USER_PREFERENCES
        );
        if (cached) {
            userSettings.set(cached);
        }

        const response = (await cachedFetch(
            `${WEBHOOKS.ACCOUNT.SECURE_GET}?userId=${account.userId}`
        )) as Response | null;
        if (response && response.ok) {
            const data = (await response.json()) as {
                account?: { metadata?: { settings?: unknown } };
            };
            if (data?.account?.metadata?.settings) {
                const settings =
                    typeof data.account.metadata.settings === 'string'
                        ? JSON.parse(data.account.metadata.settings)
                        : data.account.metadata.settings;
                userSettings.set(settings as Record<string, unknown>);
                storageHelpers.set(
                    STORAGE_KEYS.USER_PREFERENCES,
                    settings as Record<string, unknown>
                );
            }
        }

        const currentSettings = get(userSettings);
        if (Object.keys(currentSettings).length === 0) {
            const defaults = getDefaultSettings();
            userSettings.set(defaults);
        }

        settingsStatus.update(s => ({
            ...s,
            isInitialized: true,
            isLoading: false
        }));
        return get(userSettings);
    } catch (error) {
        settingsStatus.update(s => ({
            ...s,
            isLoading: false,
            hasError: true,
            errorMessage:
                error instanceof Error ? error.message : 'Unknown error'
        }));
        const defaults = getDefaultSettings();
        userSettings.set(defaults);
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
    const tier = get(accountTier) || 'free';
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
