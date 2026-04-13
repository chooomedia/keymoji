// src/stores/modalStore.ts
/**
 * Enhanced Modal-System mit pausierbaren async Funktionen (Apple/Airbnb UX-Style)
 * - Einheitliche Notification-Verwaltung
 * - Pausierbare async Operations während Modal-Anzeige
 * - Smooth UX mit Context Management
 * - Event Bubbling Support
 * - Debugging und Logging
 *
 * TypeScript Migration: v0.7.7
 */

import { writable, get, type Writable } from 'svelte/store';
import { isDevelopment, devLog } from '../utils/environment';
import { translations } from './contentStore';

// Type definitions
export type ModalType =
    | 'info'
    | 'success'
    | 'error'
    | 'warning'
    | 'sending'
    | 'contact'
    | 'pro-feature';

export interface ModalData {
    icon?: string;
    title?: string;
    message?: string;
    content?: {
        title?: string;
        description?: string;
        html?: string;
    };
    buttons?: Array<{
        text: string;
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
    onClose?: () => void;
    duration?: number | null;
    email?: string;
    name?: string;
    showSpinner?: boolean;
    progress?: number;
    error?: string;
    action?: string;
    [key: string]: unknown;
}

export interface ModalOptions {
    pauseAsyncOperations?: boolean;
    smoothTransition?: boolean;
    hapticFeedback?: boolean;
    preventBodyScroll?: boolean;
    [key: string]: unknown;
}

export interface ModalEntry {
    id: number;
    message: string;
    type: ModalType;
    duration: number | null;
    data: ModalData;
    priority: number;
    options: ModalOptions;
    timestamp: string;
}

export interface ModalContent {
    title?: string;
    description?: string;
    html?: string;
}

export interface ModalStatus {
    message: string;
    isVisible: boolean;
    type: ModalType;
    data: ModalData;
    hasTimeout: boolean;
    queueLength: number;
    isProcessingQueue: boolean;
    currentModalId: number | null;
}

export interface ConfirmationOptions {
    confirmText?: string;
    cancelText?: string;
    type?: ModalType;
    icon?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface InfoModalOptions {
    icon?: string;
    buttons?: Array<{
        text: string;
        action: () => void;
    }>;
    onClose?: () => void;
}

export interface OperationInfo {
    name: string;
    startTime: number;
    status: 'running' | 'completed' | 'error';
}

// Hauptstores für die Modal-Anzeige
export const modalMessage: Writable<string> = writable('');
export const isModalVisible: Writable<boolean> = writable(false);
export const modalType: Writable<ModalType> = writable('info');
export const modalData: Writable<ModalData> = writable({});

// Enhanced Stores für async Operations
export const isAsyncOperationPaused: Writable<boolean> = writable(false);
export const pausedOperations: Writable<unknown[]> = writable([]);

// Context Manager für pausierbare Operationen
const pausedCallbacks = new Map<number, () => void>();
const activeOperations = new Map<number, OperationInfo>();
let operationIdCounter = 0;

// Timeout-Verwaltung
let modalTimeout: ReturnType<typeof setTimeout> | null = null;
let modalHistory: ModalEntry[] = [];
let isInitialized = false;

// Modal Queue System für bessere UX
let modalQueue: ModalEntry[] = [];
let isProcessingQueue = false;
let currentModalId: number | null = null;
let modalIdCounter = 0;

// Modal Prioritäten (Apple/Airbnb inspiriert)
const MODAL_PRIORITIES: Record<ModalType, number> = {
    error: 1, // Höchste Priorität - sofortige Aufmerksamkeit
    warning: 2, // Hohe Priorität - wichtige Warnungen
    sending: 3, // Mittlere Priorität - Ladezustände
    success: 4, // Normale Priorität - Bestätigungen
    info: 5, // Niedrige Priorität - Informationen
    contact: 6, // Niedrige Priorität - Kontakt
    'pro-feature': 7 // Pro-Feature Modals
};

/**
 * Debug-Logging für Modal-Aktionen
 */
function debugLog(action: string, data: Record<string, unknown> = {}): void {
    if (isDevelopment()) {
        devLog(`🔔 Modal ${action}:`, {
            timestamp: new Date().toISOString(),
            ...data
        });
    }
}

/**
 * Enhanced Async Operation Manager (Apple/Airbnb Style)
 * Pausiert async Operationen elegant während Modal-Anzeige
 */
export class AsyncOperationManager {
    static async executeWithPause<T>(
        operation: () => Promise<T>,
        operationName: string = 'unknown'
    ): Promise<T> {
        const operationId = ++operationIdCounter;

        try {
            // Registriere Operation
            activeOperations.set(operationId, {
                name: operationName,
                startTime: Date.now(),
                status: 'running'
            });

            debugLog('ASYNC_START', { operationId, operationName });

            // Warte auf Modal-freie Zeit wenn Modal aktiv ist
            await this.waitForModalClear();

            // Führe Operation aus
            const result = await operation();

            activeOperations.delete(operationId);
            debugLog('ASYNC_COMPLETE', { operationId, operationName });

            return result;
        } catch (error) {
            activeOperations.delete(operationId);
            const err = error as Error;
            debugLog('ASYNC_ERROR', {
                operationId,
                operationName,
                error: err.message
            });
            throw error;
        }
    }

    static async waitForModalClear(): Promise<void> {
        return new Promise(resolve => {
            const checkModal = () => {
                if (!get(isModalVisible)) {
                    resolve();
                } else {
                    // Pausiere für smooth UX (Apple-Style)
                    setTimeout(checkModal, 100);
                }
            };
            checkModal();
        });
    }

    static pauseAll(): void {
        isAsyncOperationPaused.set(true);
        debugLog('ASYNC_PAUSE_ALL');
    }

    static resumeAll(): void {
        isAsyncOperationPaused.set(false);
        debugLog('ASYNC_RESUME_ALL');
    }

    static getActiveOperations(): OperationInfo[] {
        return Array.from(activeOperations.values());
    }
}

/**
 * Initialisiert das Modal-System smooth
 */
function initializeModalSystem(): void {
    if (isInitialized) return;

    // Stelle sicher, dass alle Stores im korrekten Zustand sind
    modalMessage.set('');
    isModalVisible.set(false);
    modalType.set('info');
    modalData.set({});
    isAsyncOperationPaused.set(false);
    pausedOperations.set([]);

    // Lösche alle bestehenden Timeouts
    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }

    isInitialized = true;
    debugLog('INITIALIZED');
}

/**
 * Enhanced Modal Display mit pausierbaren async Operations
 * @param message - Der anzuzeigende Text
 * @param type - Typ der Nachricht
 * @param duration - Anzeigedauer in ms, null für manuelle Schließung
 * @param data - Zusätzliche Daten
 * @param options - Erweiterte Optionen für UX
 * @returns Funktion zum manuellen Schließen oder null
 */
export function showModal(
    message: string,
    type: ModalType = 'info',
    duration: number | null = 4000,
    data: ModalData = {},
    options: ModalOptions = {}
): (() => void) | null {
    // Stelle sicher, dass das System initialisiert ist
    if (!isInitialized) {
        initializeModalSystem();
    }

    // Validierung
    if (!message || typeof message !== 'string') {
        console.error('❌ showModal: Invalid message provided:', message);
        return null;
    }

    // Prevent duplicate modals with same message and type
    if (isModalInQueue(message, type)) {
        debugLog('DUPLICATE_PREVENTED', { message, type });
        return null;
    }

    // Prevent duplicate modals that are currently visible
    if (
        get(isModalVisible) &&
        get(modalMessage) === message &&
        get(modalType) === type
    ) {
        debugLog('DUPLICATE_CURRENTLY_VISIBLE_PREVENTED', { message, type });
        return null;
    }

    // Enhanced Options (Apple/Airbnb Style)
    const enhancedOptions: ModalOptions = {
        pauseAsyncOperations: true,
        smoothTransition: true,
        hapticFeedback: false, // für mobile devices
        preventBodyScroll: true,
        ...options
    };

    // Erstelle Modal-Eintrag mit ID
    const modalId = ++modalIdCounter;
    const priority = MODAL_PRIORITIES[type] || MODAL_PRIORITIES.info;

    const modalEntry: ModalEntry = {
        id: modalId,
        message,
        type,
        duration,
        data,
        priority,
        options: enhancedOptions,
        timestamp: new Date().toISOString()
    };

    // Füge Modal zur Queue hinzu
    modalQueue.push(modalEntry);

    // Sortiere Queue nach Priorität (niedrigere Zahl = höhere Priorität)
    modalQueue.sort((a, b) => a.priority - b.priority);

    // Modal-Historie für Debugging
    modalHistory.push(modalEntry);
    if (modalHistory.length > 10) {
        modalHistory = modalHistory.slice(-10);
    }

    debugLog('QUEUE_ADD', modalEntry);

    // Verarbeite Queue, wenn nicht bereits in Bearbeitung
    if (!isProcessingQueue) {
        processModalQueue();
    }

    // Returne eine Funktion zum manuellen Schließen
    return () => closeModalById(modalId);
}

/**
 * Enhanced Queue Processing mit UX-Optimierungen
 */
function processModalQueue(): void {
    if (isProcessingQueue || modalQueue.length === 0) {
        return;
    }

    isProcessingQueue = true;

    // Nimm das nächste Modal aus der Queue
    const nextModal = modalQueue.shift();
    if (!nextModal) {
        isProcessingQueue = false;
        return;
    }

    currentModalId = nextModal.id;

    // Bestehenden Timeout löschen
    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }

    // Apple/Airbnb Style: Pausiere async Operations wenn gewünscht
    if (nextModal.options?.pauseAsyncOperations) {
        AsyncOperationManager.pauseAll();
    }

    // Stores aktualisieren mit smooth transition
    modalMessage.set(nextModal.message);
    modalType.set(nextModal.type);
    isModalVisible.set(true);

    if (nextModal.data && Object.keys(nextModal.data).length > 0) {
        modalData.set(nextModal.data);
    }

    // Body scroll prevention (Apple Style)
    if (
        typeof document !== 'undefined' &&
        nextModal.options?.preventBodyScroll
    ) {
        document.body.style.overflow = 'hidden';
    }

    debugLog('SHOW', nextModal);

    // Automatisches Schließen, wenn gewünscht
    if (nextModal.duration !== null && nextModal.duration > 0) {
        modalTimeout = setTimeout(() => {
            debugLog('AUTO_CLOSE', {
                message: nextModal.message,
                type: nextModal.type,
                duration: nextModal.duration
            });
            closeModal();
        }, nextModal.duration);
    }
}

/**
 * Schließt ein spezifisches Modal anhand der ID
 */
function closeModalById(modalId: number): void {
    // Entferne Modal aus der Queue, falls es noch dort ist
    modalQueue = modalQueue.filter(modal => modal.id !== modalId);

    // Wenn es das aktuelle Modal ist, schließe es
    if (currentModalId === modalId) {
        closeModal();
    }
}

/**
 * Enhanced Modal Close mit UX-Optimierungen
 */
export function closeModal(): void {
    debugLog('CLOSE', {
        currentMessage: get(modalMessage),
        currentType: get(modalType)
    });

    modalMessage.set('');
    isModalVisible.set(false);
    modalType.set('info');
    modalData.set({});

    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }

    // Restore body scroll (Apple Style)
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
    }

    // Resume async operations
    AsyncOperationManager.resumeAll();

    // Markiere Queue-Verarbeitung als beendet
    isProcessingQueue = false;
    currentModalId = null;

    // Verarbeite das nächste Modal in der Queue mit Delay für smooth UX
    setTimeout(() => {
        if (modalQueue.length > 0) {
            processModalQueue();
        }
    }, 150); // Apple-Style delay für smooth transitions
}

/**
 * Erfolgs-Nachricht anzeigen
 */
export function showSuccess(
    message: string,
    duration: number = 5000,
    data: ModalData = {}
): (() => void) | null {
    // Vermeide Duplikate von Erfolgs-Nachrichten
    if (
        isModalInQueue(message, 'success') ||
        (get(isModalVisible) &&
            get(modalMessage) === message &&
            get(modalType) === 'success')
    ) {
        debugLog('SUCCESS_DUPLICATE_PREVENTED', { message });
        return null;
    }
    return showModal(message, 'success', duration, data);
}

/**
 * Fehler-Nachricht anzeigen
 */
export function showError(
    message: string,
    duration: number | null = 5000,
    data: ModalData = {}
): (() => void) | null {
    // Prevent duplicate error modals with same message
    if (
        isModalInQueue(message, 'error') ||
        (get(isModalVisible) &&
            get(modalMessage) === message &&
            get(modalType) === 'error')
    ) {
        debugLog('ERROR_DUPLICATE_PREVENTED', { message });
        return null;
    }
    return showModal(message, 'error', duration, data);
}

/**
 * Warn-Nachricht anzeigen
 */
export function showWarning(
    message: string,
    duration: number = 8000,
    data: ModalData = {}
): (() => void) | null {
    // Vermeide Duplikate von Warn-Nachrichten
    if (
        isModalInQueue(message, 'warning') ||
        (get(isModalVisible) &&
            get(modalMessage) === message &&
            get(modalType) === 'warning')
    ) {
        debugLog('WARNING_DUPLICATE_PREVENTED', { message });
        return null;
    }
    return showModal(message, 'warning', duration, data);
}

/**
 * "Wird gesendet"-Nachricht anzeigen
 */
export function showSending(
    message: string = 'Sending...',
    data: ModalData = {}
): (() => void) | null {
    // Sending-Nachrichten können dupliziert werden (für verschiedene Prozesse)
    return showModal(message, 'sending', null, data);
}

/**
 * Magic Link wird gesendet
 */
export function showMagicLinkSending(email: string): (() => void) | null {
    return showModal(`Sending magic link to ${email}...`, 'sending', null, {
        email,
        showSpinner: true,
        progress: 0
    });
}

/**
 * Magic Link wurde gesendet
 */
export function showMagicLinkSent(email: string): (() => void) | null {
    return showModal(
        `Magic link sent to ${email}! Check your inbox and click the link to verify your account.`,
        'success',
        8000,
        {
            email,
            showSpinner: false,
            progress: 100
        }
    );
}

/**
 * Magic Link Verifikation läuft
 */
export function showMagicLinkVerifying(email: string): (() => void) | null {
    return showModal(`Verifying your magic link...`, 'sending', null, {
        email,
        showSpinner: true,
        progress: 50
    });
}

/**
 * Magic Link Verifikation erfolgreich
 */
export function showMagicLinkVerified(
    email: string,
    name?: string
): (() => void) | null {
    // Smart name fallback
    const displayName = name || (email ? email.split('@')[0] : 'there');

    return showModal(
        `Welcome back, ${displayName}! Your account has been verified successfully.`,
        'success',
        5000,
        {
            email,
            name: displayName,
            showSpinner: false,
            progress: 100
        }
    );
}

/**
 * Magic Link Verifikation fehlgeschlagen
 */
export function showMagicLinkVerificationFailed(
    error: string
): (() => void) | null {
    return showModal(
        `Verification failed: ${error}. Please try again.`,
        'error',
        null,
        {
            error,
            showSpinner: false,
            progress: 0
        }
    );
}

/**
 * Account Login erfolgreich
 */
export function showAccountLoginSuccess(
    name?: string,
    email: string | null = null
): (() => void) | null {
    // Smart name fallback
    const displayName = name || (email ? email.split('@')[0] : 'there');

    return showModal(
        `Welcome back, ${displayName}! You're now logged in.`,
        'success',
        4000,
        {
            name: displayName,
            showSpinner: false,
            progress: 100
        }
    );
}

/**
 * Account Logout erfolgreich
 */
export function showAccountLogoutSuccess(): void {
    showModal('Successfully logged out! 👋', 'success', 3000, {
        icon: '🚪',
        action: 'logout'
    });
}

// Show existing account found modal — translated
export function showExistingAccountFound(email: string, name?: string): void {
    const displayName = name || email?.split('@')[0] || 'User';
    const t = get(translations);
    const welcomeTemplate = t?.accountManager?.welcomeBack || 'Welcome back, {name}! 👋';
    const message = welcomeTemplate.replace('{name}', displayName);
    const title = t?.accountManager?.messages?.accountFound || 'Account found';
    showModal(message, 'success', 5000, { icon: '✅', title });
}

// Show new account created modal — translated
export function showNewAccountCreated(email: string, name?: string): void {
    const displayName = name || email?.split('@')[0] || 'User';
    const t = get(translations);
    const createdTemplate = t?.accountManager?.messages?.newAccountCreated || 'Account created! Welcome, {name}! 🎉';
    const message = createdTemplate.replace('{name}', displayName);
    const title = t?.accountManager?.accountCreationInfo?.accountCreated || 'Account created';
    showModal(message, 'success', 5000, { icon: '🎉', title });
}

/**
 * Info-Nachricht anzeigen
 */
export function showInfo(
    message: string,
    duration: number = 4000,
    data: ModalData = {}
): (() => void) | null {
    return showModal(message, 'info', duration, data);
}

/**
 * Kontakt-Nachricht anzeigen
 */
export function showContact(
    message: string,
    duration: number = 6000,
    data: ModalData = {}
): (() => void) | null {
    return showModal(message, 'contact', duration, data);
}

/**
 * Erweiterte Modal-Funktionen für dynamische Inhalte
 */

/**
 * Zeigt ein Modal mit Header, Body und Footer an
 */
export function showModalWithContent(
    content: ModalContent,
    options: {
        title?: string;
        icon?: string;
        type?: ModalType;
        duration?: number | null;
        buttons?: Array<{ text: string; action: () => void }>;
        primaryButton?: { text: string; action: () => void };
        secondaryButton?: { text: string; action: () => void };
        onClose?: () => void;
    } = {}
): (() => void) | null {
    const {
        title = 'Information',
        icon = 'ℹ️',
        type = 'info',
        duration = null,
        buttons = [],
        primaryButton = null,
        secondaryButton = null,
        onClose = null
    } = options;

    const modalData: ModalData = {
        title,
        icon,
        content: {
            title: content.title,
            description: content.description,
            html: content.html
        },
        buttons,
        primaryButton: primaryButton || undefined,
        secondaryButton: secondaryButton || undefined,
        onClose,
        duration
    };

    // Ensure we have a valid message
    const message =
        content.description || content.html || content.title || 'Information';

    return showModal(message, type, duration, modalData);
}

/**
 * Zeigt ein Bestätigungs-Modal an
 */
export function showConfirmation(
    title: string,
    message: string,
    options: ConfirmationOptions = {}
): (() => void) | null {
    const {
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        type = 'warning',
        icon = '⚠️',
        onConfirm = null,
        onCancel = null
    } = options;

    const modalData: ModalData = {
        title,
        icon,
        content: {
            description: message
        },
        primaryButton: {
            text: confirmText,
            action: () => {
                if (onConfirm) onConfirm();
                closeModal();
            }
        },
        secondaryButton: {
            text: cancelText,
            action: () => {
                if (onCancel) onCancel();
                closeModal();
            }
        }
    };

    return showModal(message, type, null, modalData);
}

/**
 * Zeigt ein Informations-Modal an
 */
export function showInfoModal(
    title: string,
    message: string,
    options: InfoModalOptions = {}
): (() => void) | null {
    const { icon = 'ℹ️', buttons = [], onClose = null } = options;

    const modalData: ModalData = {
        title,
        icon,
        content: {
            description: message
        },
        buttons,
        onClose
    };

    return showModal(message, 'info', null, modalData);
}

/**
 * Zeigt ein Erfolgs-Modal an
 */
export function showSuccessModal(
    title: string,
    message: string,
    options: InfoModalOptions = {}
): (() => void) | null {
    const { icon = '✅', buttons = [], onClose = null } = options;

    const modalData: ModalData = {
        title,
        icon,
        content: {
            description: message
        },
        buttons,
        onClose
    };

    return showModal(message, 'success', null, modalData);
}

/**
 * Zeigt ein Fehler-Modal an
 */
export function showErrorModal(
    title: string,
    message: string,
    options: InfoModalOptions = {}
): (() => void) | null {
    const { icon = '❌', buttons = [], onClose = null } = options;

    const modalData: ModalData = {
        title,
        icon,
        content: {
            description: message
        },
        buttons,
        onClose
    };

    return showModal(message, 'error', null, modalData);
}

/**
 * Debug-Funktion: Zeigt Modal-Historie an
 */
export function getModalHistory(): ModalEntry[] {
    if (isDevelopment()) {
        console.log('📋 Modal History:', modalHistory);
        return modalHistory;
    }
    return [];
}

/**
 * Debug-Funktion: Zeigt aktuellen Modal-Status an
 */
export function getModalStatus(): ModalStatus {
    return {
        message: get(modalMessage),
        isVisible: get(isModalVisible),
        type: get(modalType),
        data: get(modalData),
        hasTimeout: modalTimeout !== null,
        queueLength: modalQueue.length,
        isProcessingQueue: isProcessingQueue,
        currentModalId: currentModalId
    };
}

/**
 * Löscht alle Modals aus der Queue
 */
export function clearModalQueue(): void {
    modalQueue = [];
    debugLog('CLEAR_QUEUE');
}

/**
 * Zeigt die aktuelle Modal-Queue an
 */
export function getModalQueue(): Array<{
    id: number;
    message: string;
    type: ModalType;
    priority: number;
    timestamp: string;
}> {
    return modalQueue.map(modal => ({
        id: modal.id,
        message: modal.message,
        type: modal.type,
        priority: modal.priority,
        timestamp: modal.timestamp
    }));
}

/**
 * Prüft, ob ein Modal mit bestimmter Nachricht bereits in der Queue ist
 */
export function isModalInQueue(
    message: string,
    type: ModalType | null = null
): boolean {
    return modalQueue.some(
        modal =>
            modal.message === message && (type === null || modal.type === type)
    );
}

/**
 * Debug-Funktion: Löscht Modal-Historie
 */
export function clearModalHistory(): void {
    modalHistory = [];
    debugLog('CLEAR_HISTORY');
}

// Exportiere ein Objekt mit allen Funktionen
export default {
    modalMessage,
    isModalVisible,
    modalType,
    modalData,
    showModal,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showSending,
    showInfo,
    showContact,
    getModalHistory,
    getModalStatus,
    clearModalHistory
};
