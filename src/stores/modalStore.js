// src/stores/modalStore.js
import { writable, get } from 'svelte/store';
import { isDevelopment, devLog } from '../utils/environment.js';

/**
 * Enhanced Modal-System mit pausierbaren async Funktionen (Apple/Airbnb UX-Style)
 * - Einheitliche Notification-Verwaltung
 * - Pausierbare async Operations während Modal-Anzeige
 * - Smooth UX mit Context Management
 * - Event Bubbling Support
 * - Debugging und Logging
 */

// Hauptstores für die Modal-Anzeige
export const modalMessage = writable('');
export const isModalVisible = writable(false);
export const modalType = writable('info'); // 'info', 'success', 'error', 'warning', 'sending', 'contact'
export const modalData = writable({});

// Enhanced Stores für async Operations
export const isAsyncOperationPaused = writable(false);
export const pausedOperations = writable([]);

// Context Manager für pausierbare Operationen
let pausedCallbacks = new Map();
let activeOperations = new Map();
let operationIdCounter = 0;

// Timeout-Verwaltung
let modalTimeout = null;
let modalHistory = [];
let isInitialized = false;

// Modal Queue System für bessere UX
let modalQueue = [];
let isProcessingQueue = false;
let currentModalId = null;
let modalIdCounter = 0;

// Modal Prioritäten (Apple/Airbnb inspiriert)
const MODAL_PRIORITIES = {
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
function debugLog(action, data = {}) {
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
    static async executeWithPause(operation, operationName = 'unknown') {
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
            debugLog('ASYNC_ERROR', {
                operationId,
                operationName,
                error: error.message
            });
            throw error;
        }
    }

    static async waitForModalClear() {
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

    static pauseAll() {
        isAsyncOperationPaused.set(true);
        debugLog('ASYNC_PAUSE_ALL');
    }

    static resumeAll() {
        isAsyncOperationPaused.set(false);
        debugLog('ASYNC_RESUME_ALL');
    }

    static getActiveOperations() {
        return Array.from(activeOperations.values());
    }
}

/**
 * Initialisiert das Modal-System smooth
 */
function initializeModalSystem() {
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
 * @param {string} message - Der anzuzeigende Text
 * @param {string} type - Typ der Nachricht
 * @param {number} duration - Anzeigedauer in ms, null für manuelle Schließung
 * @param {object} data - Zusätzliche Daten
 * @param {object} options - Erweiterte Optionen für UX
 */
export function showModal(
    message,
    type = 'info',
    duration = 4000,
    data = {},
    options = {}
) {
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
    const enhancedOptions = {
        pauseAsyncOperations: true,
        smoothTransition: true,
        hapticFeedback: false, // für mobile devices
        preventBodyScroll: true,
        ...options
    };

    // Erstelle Modal-Eintrag mit ID
    const modalId = ++modalIdCounter;
    const priority = MODAL_PRIORITIES[type] || MODAL_PRIORITIES.info;

    const modalEntry = {
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
function processModalQueue() {
    if (isProcessingQueue || modalQueue.length === 0) {
        return;
    }

    isProcessingQueue = true;

    // Nimm das nächste Modal aus der Queue
    const nextModal = modalQueue.shift();
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
    if (nextModal.options?.preventBodyScroll) {
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
function closeModalById(modalId) {
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
export function closeModal() {
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
    document.body.style.overflow = '';

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
export function showSuccess(message, duration = 5000, data = {}) {
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
export function showError(message, duration = null, data = {}) {
    // Fehler-Nachrichten haben höchste Priorität, keine Duplikat-Prüfung
    return showModal(message, 'error', duration, data);
}

/**
 * Warn-Nachricht anzeigen
 */
export function showWarning(message, duration = 8000, data = {}) {
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
export function showSending(message = 'Sending...', data = {}) {
    // Sending-Nachrichten können dupliziert werden (für verschiedene Prozesse)
    return showModal(message, 'sending', null, data);
}

/**
 * Magic Link wird gesendet
 */
export function showMagicLinkSending(email) {
    return showModal(`Sending magic link to ${email}...`, 'sending', null, {
        email,
        showSpinner: true,
        progress: 0
    });
}

/**
 * Magic Link wurde gesendet
 */
export function showMagicLinkSent(email) {
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
export function showMagicLinkVerifying(email) {
    return showModal(`Verifying your magic link...`, 'sending', null, {
        email,
        showSpinner: true,
        progress: 50
    });
}

/**
 * Magic Link Verifikation erfolgreich
 */
export function showMagicLinkVerified(email, name) {
    return showModal(
        `Welcome back, ${name}! Your account has been verified successfully.`,
        'success',
        5000,
        {
            email,
            name,
            showSpinner: false,
            progress: 100
        }
    );
}

/**
 * Magic Link Verifikation fehlgeschlagen
 */
export function showMagicLinkVerificationFailed(error) {
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
export function showAccountLoginSuccess(name) {
    return showModal(
        `Welcome back, ${name}! You're now logged in.`,
        'success',
        4000,
        {
            name,
            showSpinner: false,
            progress: 100
        }
    );
}

/**
 * Account Logout erfolgreich
 */
export function showAccountLogoutSuccess() {
    showModal('Successfully logged out! 👋', 'success', 3000, {
        icon: '🚪',
        action: 'logout'
    });
}

// Show existing account found modal
export function showExistingAccountFound(email, name) {
    // Use email username as fallback if name is undefined
    const displayName = name || email?.split('@')[0] || 'User';

    modalMessage.set(`Account gefunden! Willkommen zurück, ${displayName}! 🎉`);
    modalType.set('success');
    modalData.set({
        icon: '✅',
        title: 'Account gefunden',
        message: `Ein Account mit der E-Mail ${email} existiert bereits. Sie wurden automatisch angemeldet.`,
        primaryButton: {
            text: 'Zum Account',
            action: () => {
                // Navigate to account page using Svelte routing
                import('svelte-routing').then(({ navigate }) => {
                    closeModal();
                    // Small delay to ensure modal is closed before navigation
                    setTimeout(() => {
                        navigate('/account', { replace: true });
                    }, 100);
                });
            }
        },
        secondaryButton: {
            text: 'Schließen',
            action: () => {
                closeModal();
            }
        }
    });
    isModalVisible.set(true);
}

/**
 * Info-Nachricht anzeigen
 */
export function showInfo(message, duration = 4000, data = {}) {
    return showModal(message, 'info', duration, data);
}

/**
 * Kontakt-Nachricht anzeigen
 */
export function showContact(message, duration = 6000, data = {}) {
    return showModal(message, 'contact', duration, data);
}

/**
 * Erweiterte Modal-Funktionen für dynamische Inhalte
 */

/**
 * Zeigt ein Modal mit Header, Body und Footer an
 */
export function showModalWithContent(content, options = {}) {
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

    const modalData = {
        title,
        icon,
        content: {
            title: content.title,
            description: content.description,
            html: content.html
        },
        buttons,
        primaryButton,
        secondaryButton,
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
export function showConfirmation(title, message, options = {}) {
    const {
        confirmText = 'Bestätigen',
        cancelText = 'Abbrechen',
        type = 'warning',
        icon = '⚠️',
        onConfirm = null,
        onCancel = null
    } = options;

    const modalData = {
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
export function showInfoModal(title, message, options = {}) {
    const { icon = 'ℹ️', buttons = [], onClose = null } = options;

    const modalData = {
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
export function showSuccessModal(title, message, options = {}) {
    const { icon = '✅', buttons = [], onClose = null } = options;

    const modalData = {
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
export function showErrorModal(title, message, options = {}) {
    const { icon = '❌', buttons = [], onClose = null } = options;

    const modalData = {
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
export function getModalHistory() {
    if (isDevelopment()) {
        console.log('📋 Modal History:', modalHistory);
        return modalHistory;
    }
    return [];
}

/**
 * Debug-Funktion: Zeigt aktuellen Modal-Status an
 */
export function getModalStatus() {
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
export function clearModalQueue() {
    modalQueue = [];
    debugLog('CLEAR_QUEUE');
}

/**
 * Zeigt die aktuelle Modal-Queue an
 */
export function getModalQueue() {
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
export function isModalInQueue(message, type = null) {
    return modalQueue.some(
        modal =>
            modal.message === message && (type === null || modal.type === type)
    );
}

/**
 * Debug-Funktion: Löscht Modal-Historie
 */
export function clearModalHistory() {
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
