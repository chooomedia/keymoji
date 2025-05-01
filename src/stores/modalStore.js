// src/stores/modalStore.js
import { writable } from 'svelte/store';

/**
 * Zentralisierter Store für das Modal-System
 */

// Hauptstores für die Modal-Anzeige
export const modalMessage = writable('');
export const isModalVisible = writable(false);
export const modalType = writable('info'); // 'info', 'success', 'error', 'warning', 'sending'
export const modalData = writable({});

// Timeout-Verwaltung
let modalTimeout = null;

/**
 * Zeigt eine Modal-Nachricht mit optionalen Parametern an
 * @param {string} message - Der anzuzeigende Text
 * @param {string} type - Typ der Nachricht ('info', 'success', 'error', 'warning', 'sending')
 * @param {number} duration - Anzeigedauer in ms, null für manuelle Schließung
 * @param {object} data - Zusätzliche Daten, die im Modal verwendet werden können
 */
export function showModal(message, type = 'info', duration = 4000, data = {}) {
    // Bestehenden Timeout löschen
    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }

    // Stores aktualisieren
    modalMessage.set(message);
    modalType.set(type);
    isModalVisible.set(true);

    if (data && Object.keys(data).length > 0) {
        modalData.set(data);
    }

    // Automatisches Schließen, wenn gewünscht
    if (duration !== null) {
        modalTimeout = setTimeout(() => {
            closeModal();
        }, duration);
    }

    // Returne eine Funktion zum manuellen Schließen
    return closeModal;
}

/**
 * Schließt das Modal und setzt alle Werte zurück
 */
export function closeModal() {
    modalMessage.set('');
    isModalVisible.set(false);
    modalType.set('info');
    modalData.set({});

    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }
}

/**
 * Erfolgs-Nachricht anzeigen
 */
export function showSuccess(message, duration = 5000, data = {}) {
    return showModal(message, 'success', duration, data);
}

/**
 * Fehler-Nachricht anzeigen
 */
export function showError(message, duration = null, data = {}) {
    return showModal(message, 'error', duration, data);
}

/**
 * Warn-Nachricht anzeigen
 */
export function showWarning(message, duration = 8000, data = {}) {
    return showModal(message, 'warning', duration, data);
}

/**
 * "Wird gesendet"-Nachricht anzeigen
 */
export function showSending(message = 'Sending...', data = {}) {
    return showModal(message, 'sending', null, data);
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
    showSending
};
