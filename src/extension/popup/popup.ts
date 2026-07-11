import {
    KEYMOJI_LEVEL_MAX,
    KEYMOJI_LEVEL_MIN,
    generateKeymoji
} from '../core/emojiGenerator';
import {
    ExtensionSettings,
    getExtensionSettings,
    saveExtensionSettings
} from '../core/settings';
import {
    ExtensionTranslations,
    getExtensionLanguage,
    getExtensionTranslations
} from '../core/i18n';

const DONATION_URL = 'https://ko-fi.com/keymoji';
const WEBAPP_URL = 'https://keymoji.wtf/';

let currentSettings: ExtensionSettings;
let currentKeymoji = '';
let translations: ExtensionTranslations;

function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing popup element: ${id}`);
    }

    return element as T;
}

function setStatus(message: string): void {
    getElement<HTMLDivElement>('status').textContent = message;
}

function applyTranslations(): void {
    const language = getExtensionLanguage();
    translations = getExtensionTranslations();
    document.documentElement.lang = language;
    document.title = 'Keymoji';

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n as keyof ExtensionTranslations;
        const value = translations[key];

        if (typeof value === 'string') {
            element.textContent = value;
        }
    });

    getElement<HTMLElement>('keymojiCard').setAttribute(
        'aria-label',
        translations.generatedLabel
    );
}

function renderLevel(): void {
    getElement<HTMLSpanElement>('levelValue').textContent = String(
        currentSettings.level
    );
    getElement<HTMLInputElement>('levelRange').value = String(
        currentSettings.level
    );
}

function renderKeymoji(value: string): void {
    currentKeymoji = value;
    getElement<HTMLDivElement>('keymojiOutput').textContent =
        value || 'Keymoji';
}

function generateAndRenderKeymoji(): void {
    const result = generateKeymoji(currentSettings.level);
    renderKeymoji(result.value);
    setStatus(translations.statusCreated(result.level));
}

async function copyCurrentKeymoji(): Promise<void> {
    if (!currentKeymoji) {
        generateAndRenderKeymoji();
    }

    await navigator.clipboard.writeText(currentKeymoji);
    setStatus(translations.statusCopied);
}

async function handleLevelChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    currentSettings = await saveExtensionSettings({
        ...currentSettings,
        level: Number(input.value)
    });
    renderLevel();
    generateAndRenderKeymoji();
}

async function handleCopyToggle(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    currentSettings = await saveExtensionSettings({
        ...currentSettings,
        copyToClipboard: input.checked
    });
    setStatus(
        currentSettings.copyToClipboard
            ? translations.statusCopyEnabled
            : translations.statusCopyDisabled
    );
}

async function handlePromptToggle(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    currentSettings = await saveExtensionSettings({
        ...currentSettings,
        showPromptOnPasswordFocus: input.checked
    });
    setStatus(
        currentSettings.showPromptOnPasswordFocus
            ? translations.statusPromptEnabled
            : translations.statusPromptDisabled
    );
}

function openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
}

async function initializePopup(): Promise<void> {
    applyTranslations();
    currentSettings = await getExtensionSettings();

    const levelRange = getElement<HTMLInputElement>('levelRange');
    levelRange.min = String(KEYMOJI_LEVEL_MIN);
    levelRange.max = String(KEYMOJI_LEVEL_MAX);
    levelRange.addEventListener('input', event => {
        handleLevelChange(event).catch(() => {
            setStatus(translations.statusSettingError);
        });
    });

    const copyToggle = getElement<HTMLInputElement>('copyToggle');
    copyToggle.checked = currentSettings.copyToClipboard;
    copyToggle.addEventListener('change', event => {
        handleCopyToggle(event).catch(() => {
            setStatus(translations.statusSettingError);
        });
    });

    const promptToggle = getElement<HTMLInputElement>('promptToggle');
    promptToggle.checked = currentSettings.showPromptOnPasswordFocus;
    promptToggle.addEventListener('change', event => {
        handlePromptToggle(event).catch(() => {
            setStatus(translations.statusSettingError);
        });
    });

    getElement<HTMLButtonElement>('generateButton').addEventListener(
        'click',
        generateAndRenderKeymoji
    );
    getElement<HTMLButtonElement>('copyButton').addEventListener('click', () => {
        copyCurrentKeymoji().catch(() => {
            setStatus(translations.statusCopyUnavailable);
        });
    });
    getElement<HTMLButtonElement>('donateButton').addEventListener(
        'click',
        () => openUrl(DONATION_URL)
    );
    getElement<HTMLAnchorElement>('webappLink').addEventListener(
        'click',
        event => {
            event.preventDefault();
            openUrl(WEBAPP_URL);
        }
    );

    renderLevel();
    generateAndRenderKeymoji();
}

initializePopup().catch(() => {
    translations = getExtensionTranslations();
    setStatus(translations.statusPopupError);
});
