import { generateKeymoji } from '../core/emojiGenerator';
import { getExtensionTranslations } from '../core/i18n';
import { getExtensionSettings } from '../core/settings';

const PROMPT_OFFSET_PX = 8;
const PROMPT_HIDE_DELAY_MS = 180;
const PROMPT_Z_INDEX = 2147483647;
const PROMPT_WIDTH_PX = 292;
const PROMPT_HEIGHT_PX = 44;
const LOGO_PATH = 'icons/keymoji-logo.svg';

interface ChromeLike {
    runtime?: {
        getURL(path: string): string;
    };
}

declare const chrome: ChromeLike | undefined;

let activePasswordInput: HTMLInputElement | null = null;
let promptHost: HTMLDivElement | null = null;
let promptRoot: ShadowRoot | null = null;
let hidePromptTimer: number | null = null;

function isPasswordInput(target: EventTarget | null): target is HTMLInputElement {
    return (
        target instanceof HTMLInputElement &&
        target.type === 'password' &&
        !target.disabled &&
        !target.readOnly
    );
}

function clearHidePromptTimer(): void {
    if (hidePromptTimer !== null) {
        window.clearTimeout(hidePromptTimer);
        hidePromptTimer = null;
    }
}

function removePrompt(): void {
    clearHidePromptTimer();
    promptHost?.remove();
    promptHost = null;
    promptRoot = null;
}

function dispatchPasswordInputEvents(input: HTMLInputElement): void {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getExtensionAssetUrl(path: string): string {
    if (typeof chrome === 'undefined') {
        return path;
    }

    return chrome.runtime?.getURL(path) ?? path;
}

async function copyGeneratedKeymoji(value: string): Promise<void> {
    if (!navigator.clipboard || !window.isSecureContext) {
        return;
    }

    await navigator.clipboard.writeText(value);
}

function getPromptPosition(input: HTMLInputElement): {
    top: number;
    left: number;
} {
    const rect = input.getBoundingClientRect();
    const topAboveInput =
        rect.top + window.scrollY - PROMPT_HEIGHT_PX - PROMPT_OFFSET_PX;
    const topBelowInput = rect.bottom + window.scrollY + PROMPT_OFFSET_PX;
    const top =
        topAboveInput >= window.scrollY + PROMPT_OFFSET_PX
            ? topAboveInput
            : topBelowInput;
    const viewportLeft = window.scrollX + PROMPT_OFFSET_PX;
    const viewportRight =
        window.scrollX + window.innerWidth - PROMPT_WIDTH_PX - PROMPT_OFFSET_PX;
    const centeredLeft =
        rect.left + window.scrollX + (rect.width - PROMPT_WIDTH_PX) / 2;
    const left = Math.max(
        viewportLeft,
        Math.min(centeredLeft, viewportRight)
    );

    return { top, left };
}

function renderPrompt(statusText = ''): void {
    if (!promptRoot) {
        return;
    }

    const translations = getExtensionTranslations();
    const safeStatusText = escapeHtml(statusText);
    const logoUrl = escapeHtml(getExtensionAssetUrl(LOGO_PATH));

    promptRoot.innerHTML = `
        <style>
            :host {
                all: initial;
            }

            .keymoji-prompt {
                align-items: center;
                background: #0e1e30;
                border: 1px solid rgba(250, 204, 21, 0.45);
                border-radius: 16px;
                box-shadow: 0 12px 32px rgba(14, 30, 48, 0.22);
                color: #fefefa;
                display: flex;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                gap: 14px;
                justify-content: space-between;
                min-height: ${PROMPT_HEIGHT_PX}px;
                padding: 6px 7px 6px 14px;
                width: ${PROMPT_WIDTH_PX}px;
            }

            .keymoji-copy {
                align-items: center;
                display: flex;
                gap: 9px;
                min-width: 0;
            }

            .keymoji-logo {
                background: transparent;
                border: 0;
                display: block;
                flex: 0 0 auto;
                height: 24px;
                object-fit: contain;
                width: 24px;
            }

            .keymoji-label {
                font-size: 12px;
                font-weight: 700;
                line-height: 1.2;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .keymoji-actions {
                align-items: center;
                display: flex;
                flex: 0 0 auto;
                gap: 8px;
            }

            .keymoji-button {
                background: #eab308;
                border: 0;
                border-radius: 999px;
                color: #0e1e30;
                cursor: pointer;
                font-size: 12px;
                font-weight: 800;
                line-height: 1;
                padding: 8px 12px;
            }

            .keymoji-button:focus-visible {
                outline: 2px solid #fefefa;
                outline-offset: 2px;
            }

            .keymoji-status {
                color: #fde047;
                font-size: 11px;
                font-weight: 700;
                max-width: 72px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        </style>
        <div class="keymoji-prompt" role="dialog" aria-label="${escapeHtml(translations.promptAriaLabel)}">
            <span class="keymoji-copy">
                <img class="keymoji-logo" src="${logoUrl}" alt="" aria-hidden="true" />
                <span class="keymoji-label">${escapeHtml(translations.promptLabel)}</span>
            </span>
            <span class="keymoji-actions">
                <button class="keymoji-button" type="button">${escapeHtml(translations.promptButton)}</button>
                <span class="keymoji-status" aria-live="polite">${safeStatusText}</span>
            </span>
        </div>
    `;

    const button = promptRoot.querySelector('.keymoji-button');
    button?.addEventListener('click', handleGenerateClick);
}

async function handleGenerateClick(): Promise<void> {
    if (!activePasswordInput) {
        removePrompt();
        return;
    }

    const settings = await getExtensionSettings();
    const result = generateKeymoji(settings.level);

    activePasswordInput.focus();
    activePasswordInput.value = result.value;
    dispatchPasswordInputEvents(activePasswordInput);

    if (settings.copyToClipboard) {
        await copyGeneratedKeymoji(result.value).catch(() => undefined);
    }

    renderPrompt(getExtensionTranslations().promptInserted);
    hidePromptTimer = window.setTimeout(removePrompt, 1200);
}

function showPrompt(input: HTMLInputElement): void {
    removePrompt();

    const position = getPromptPosition(input);
    promptHost = document.createElement('div');
    promptHost.style.position = 'absolute';
    promptHost.style.top = `${position.top}px`;
    promptHost.style.left = `${position.left}px`;
    promptHost.style.zIndex = String(PROMPT_Z_INDEX);
    promptHost.style.pointerEvents = 'auto';

    promptRoot = promptHost.attachShadow({ mode: 'closed' });
    document.documentElement.appendChild(promptHost);
    renderPrompt();
}

async function handleFocusIn(event: FocusEvent): Promise<void> {
    if (!isPasswordInput(event.target)) {
        return;
    }

    const settings = await getExtensionSettings();
    if (!settings.showPromptOnPasswordFocus) {
        return;
    }

    activePasswordInput = event.target;
    showPrompt(activePasswordInput);
}

function handleFocusOut(): void {
    clearHidePromptTimer();
    hidePromptTimer = window.setTimeout(removePrompt, PROMPT_HIDE_DELAY_MS);
}

function handleDocumentPointerDown(event: PointerEvent): void {
    if (promptHost?.contains(event.target as Node)) {
        clearHidePromptTimer();
        return;
    }

    if (event.target !== activePasswordInput) {
        removePrompt();
    }
}

function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        removePrompt();
    }
}

document.addEventListener('focusin', event => {
    handleFocusIn(event).catch(removePrompt);
});
document.addEventListener('focusout', handleFocusOut);
document.addEventListener('pointerdown', handleDocumentPointerDown, true);
document.addEventListener('keydown', handleKeyDown);
