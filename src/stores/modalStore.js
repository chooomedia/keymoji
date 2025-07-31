// src/stores/modalStore.js
import { writable, get } from 'svelte/store';
import { isDevelopment, devLog } from '../utils/environment.js';

/**
 * Zentralisierter Store für das Modal-System
 * - Einheitliche Notification-Verwaltung
 * - Debugging und Logging
 * - Fehlerbehandlung
 * - Smooth Initialisierung ohne Flackern
 */

// Hauptstores für die Modal-Anzeige
export const modalMessage = writable('');
export const isModalVisible = writable(false);
export const modalType = writable('info'); // 'info', 'success', 'error', 'warning', 'sending', 'contact'
export const modalData = writable({});

// Timeout-Verwaltung
let modalTimeout = null;
let modalHistory = [];
let isInitialized = false;

// Modal Queue System für bessere UX
let modalQueue = [];
let isProcessingQueue = false;
let currentModalId = null;
let modalIdCounter = 0;

// Modal Prioritäten
const MODAL_PRIORITIES = {
    error: 1, // Höchste Priorität
    warning: 2, // Hohe Priorität
    sending: 3, // Mittlere Priorität
    success: 4, // Normale Priorität
    info: 5, // Niedrige Priorität
    contact: 6, // Niedrige Priorität
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
 * Initialisiert das Modal-System smooth
 */
function initializeModalSystem() {
    if (isInitialized) return;

    // Stelle sicher, dass alle Stores im korrekten Zustand sind
    modalMessage.set('');
    isModalVisible.set(false);
    modalType.set('info');
    modalData.set({});

    // Lösche alle bestehenden Timeouts
    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }

    isInitialized = true;
    debugLog('INITIALIZED');
}

/**
 * Zeigt eine Modal-Nachricht mit optionalen Parametern an
 * @param {string} message - Der anzuzeigende Text
 * @param {string} type - Typ der Nachricht ('info', 'success', 'error', 'warning', 'sending', 'contact')
 * @param {number} duration - Anzeigedauer in ms, null für manuelle Schließung
 * @param {object} data - Zusätzliche Daten, die im Modal verwendet werden können
 */
export function showModal(message, type = 'info', duration = 4000, data = {}) {
    // Stelle sicher, dass das System initialisiert ist
    if (!isInitialized) {
        initializeModalSystem();
    }

    // Validierung
    if (!message || typeof message !== 'string') {
        console.error('❌ showModal: Invalid message provided:', message);
        return null;
    }

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
 * Verarbeitet die Modal-Queue
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

    // Stores aktualisieren
    modalMessage.set(nextModal.message);
    modalType.set(nextModal.type);
    isModalVisible.set(true);

    if (nextModal.data && Object.keys(nextModal.data).length > 0) {
        modalData.set(nextModal.data);
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
 * Schließt das Modal und setzt alle Werte zurück
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

    // Markiere Queue-Verarbeitung als beendet
    isProcessingQueue = false;
    currentModalId = null;

    // Verarbeite das nächste Modal in der Queue
    setTimeout(() => {
        if (modalQueue.length > 0) {
            processModalQueue();
        }
    }, 100); // Kleine Verzögerung für bessere UX
}

/**
 * Erfolgs-Nachricht anzeigen
 */
export function showSuccess(message, duration = 5000, data = {}) {
    // Vermeide Duplikate von Erfolgs-Nachrichten
    if (isModalInQueue(message, 'success')) {
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
    if (isModalInQueue(message, 'warning')) {
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
