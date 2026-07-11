import {
    KEYMOJI_LEVEL_DEFAULT,
    clampKeymojiLevel
} from './emojiGenerator';

export interface ExtensionSettings {
    level: number;
    copyToClipboard: boolean;
    showPromptOnPasswordFocus: boolean;
}

type StoredExtensionSettings = Partial<ExtensionSettings>;

interface ChromeStorageArea {
    get(keys: string[]): Promise<Record<string, unknown>>;
    set(items: Record<string, unknown>): Promise<void>;
}

interface ChromeLike {
    storage?: {
        local?: ChromeStorageArea;
    };
}

declare const chrome: ChromeLike | undefined;

const SETTINGS_STORAGE_KEY = 'keymoji_extension_settings';

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
    level: KEYMOJI_LEVEL_DEFAULT,
    copyToClipboard: false,
    showPromptOnPasswordFocus: true
};

function getChromeStorage(): ChromeStorageArea | null {
    if (typeof chrome === 'undefined') {
        return null;
    }

    return chrome.storage?.local ?? null;
}

export function sanitizeExtensionSettings(
    settings: StoredExtensionSettings | null | undefined
): ExtensionSettings {
    return {
        ...DEFAULT_EXTENSION_SETTINGS,
        ...settings,
        level: clampKeymojiLevel(
            settings?.level ?? DEFAULT_EXTENSION_SETTINGS.level
        ),
        copyToClipboard: Boolean(
            settings?.copyToClipboard ??
                DEFAULT_EXTENSION_SETTINGS.copyToClipboard
        ),
        showPromptOnPasswordFocus: Boolean(
            settings?.showPromptOnPasswordFocus ??
                DEFAULT_EXTENSION_SETTINGS.showPromptOnPasswordFocus
        )
    };
}

export async function getExtensionSettings(): Promise<ExtensionSettings> {
    const chromeStorage = getChromeStorage();

    if (chromeStorage) {
        const result = await chromeStorage.get([SETTINGS_STORAGE_KEY]);
        return sanitizeExtensionSettings(
            result[SETTINGS_STORAGE_KEY] as StoredExtensionSettings | undefined
        );
    }

    try {
        const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return sanitizeExtensionSettings(
            rawSettings
                ? (JSON.parse(rawSettings) as StoredExtensionSettings)
                : undefined
        );
    } catch {
        return DEFAULT_EXTENSION_SETTINGS;
    }
}

export async function saveExtensionSettings(
    settings: StoredExtensionSettings
): Promise<ExtensionSettings> {
    const nextSettings = sanitizeExtensionSettings(settings);
    const chromeStorage = getChromeStorage();

    if (chromeStorage) {
        await chromeStorage.set({
            [SETTINGS_STORAGE_KEY]: nextSettings
        });
        return nextSettings;
    }

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
    return nextSettings;
}
