// src/stores/modalStore.ts
import { writable, get, type Writable } from 'svelte/store';
import { navigate } from '../utils/routing';
import { currentLanguage } from './contentStore';

export interface ModalData {
    title?: string;
    icon?: string;
    showSpinner?: boolean;
    isDailyLimitModal?: boolean;
    duration?: number;
    featureName?: string;
    featureDescription?: string;
    onUpgrade?: () => void;
    content?: {
        title?: string;
        description?: string;
        html?: string;
    };
    buttons?: Array<{
        text: string;
        variant?: string;
        action: () => void;
    }>;
    primaryButton?: {
        text: string;
        action: () => void;
    };
    secondaryButton?: {
        text: string;
        action: () => void;
    };
    [key: string]: unknown;
}

export const modalMessage: Writable<string> = writable<string>('');
export const isModalVisible: Writable<boolean> = writable<boolean>(false);
export const modalType: Writable<string> = writable<string>('info');
export const modalData: Writable<ModalData> = writable<ModalData>({});
export const isAsyncOperationPaused: Writable<boolean> =
    writable<boolean>(false);
export const pausedOperations: Writable<Array<() => void>> = writable<
    Array<() => void>
>([]);

export function closeModal(): void {
    isModalVisible.set(false);
    modalMessage.set('');
    modalData.set({});
}

export function showModal(
    message: string,
    type: string = 'info',
    data?: ModalData | null,
    extraData?: Partial<ModalData>
): void {
    modalMessage.set(message);
    modalType.set(type);
    modalData.set({ ...(data || {}), ...(extraData || {}) });
    isModalVisible.set(true);
}

export function showSuccess(message: string, duration?: number): void {
    showModal(message, 'success', null, { icon: '✅' });
    if (duration) {
        setTimeout(() => closeModal(), duration);
    }
}

export function showError(message: string, duration?: number): void {
    showModal(message, 'error', null, { icon: '❌' });
    if (duration) {
        setTimeout(() => closeModal(), duration);
    }
}

export function showWarning(message: string, duration?: number): void {
    showModal(message, 'warning', null, { icon: '⚠️' });
    if (duration) {
        setTimeout(() => closeModal(), duration);
    }
}

export function showInfo(message: string, duration?: number): void {
    showModal(message, 'info', null, { icon: 'ℹ️' });
    if (duration) {
        setTimeout(() => closeModal(), duration);
    }
}

export function showMagicLinkSending(): void {
    showModal('Sending magic link...', 'info', null, { showSpinner: true });
}

export function showMagicLinkSent(): void {
    showSuccess('Magic link sent! Check your email.', 3000);
}

export function showMagicLinkVerifying(): void {
    showModal('Verifying magic link...', 'info', null, { showSpinner: true });
}

export function showMagicLinkVerified(): void {
    showSuccess('Magic link verified!', 2000);
}

export function showMagicLinkVerificationFailed(): void {
    showError('Magic link verification failed. Please try again.', 5000);
}

export function showAccountLoginSuccess(): void {
    showSuccess('Login successful!', 2000);
}

export function showAccountLogoutSuccess(): void {
    showSuccess('Logout successful!', 2000);
}

export function showExistingAccountFound(): void {
    const lang = get(currentLanguage) || 'en';
    const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;

    showModal('Existing account found!', 'info', {
        primaryButton: {
            text: 'Zum Account',
            action: () => {
                closeModal();
                setTimeout(() => {
                    navigate(accountPath, { replace: true });
                }, 100);
            }
        },
        secondaryButton: {
            text: 'Schließen',
            action: () => closeModal()
        }
    });
}

export function showNewAccountCreated(): void {
    const lang = get(currentLanguage) || 'en';
    const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;

    showModal('Account created successfully!', 'success', {
        primaryButton: {
            text: 'Zum Account',
            action: () => {
                closeModal();
                setTimeout(() => {
                    navigate(accountPath, { replace: true });
                }, 100);
            }
        },
        secondaryButton: {
            text: 'Schließen',
            action: () => closeModal()
        }
    });
}
