// src/stores/consentStore.js
// Privacy Consent Management — GDPR/DSGVO/revDSG compliant
// Stores user consent preferences in localStorage under keymoji_consent

import { writable, derived, get } from 'svelte/store';
import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';

const CONSENT_VERSION = '1.0';

/** @typedef {{ accepted: boolean, timestamp: string, version: string, preferences: { analytics: boolean, saveHistory: boolean } }} ConsentData */

/** @returns {ConsentData} */
function defaultConsent() {
    return {
        accepted: false,
        timestamp: null,
        version: CONSENT_VERSION,
        preferences: {
            analytics: false,
            saveHistory: true
        }
    };
}

function loadConsent() {
    const stored = storageHelpers.get(STORAGE_KEYS.CONSENT);
    if (!stored || stored.version !== CONSENT_VERSION) return defaultConsent();
    return stored;
}

const _consent = writable(loadConsent());

/** Reactive store — subscribe to get current consent state */
export const consentStore = _consent;

/** Derived: whether analytics are allowed */
export const isAnalyticsAllowed = derived(_consent, $c => $c.accepted && $c.preferences.analytics);

/** Derived: whether local usage history saving is allowed */
export const isSaveHistoryAllowed = derived(_consent, $c => $c.preferences.saveHistory);

/** Returns true if user has already made a consent decision */
export function hasConsented() {
    const data = get(_consent);
    return data.accepted === true || (data.timestamp !== null);
}

/**
 * Save consent with given preferences
 * @param {{ analytics?: boolean, saveHistory?: boolean }} prefs
 */
export function setConsent(prefs = {}) {
    const current = get(_consent);
    const updated = {
        accepted: true,
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
        preferences: {
            analytics: prefs.analytics ?? current.preferences.analytics,
            saveHistory: prefs.saveHistory ?? current.preferences.saveHistory
        }
    };
    _consent.set(updated);
    storageHelpers.set(STORAGE_KEYS.CONSENT, updated);
}

/**
 * Decline all optional data collection (only strictly necessary kept)
 */
export function declineConsent() {
    const declined = {
        accepted: true,
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION,
        preferences: {
            analytics: false,
            saveHistory: true
        }
    };
    _consent.set(declined);
    storageHelpers.set(STORAGE_KEYS.CONSENT, declined);
}

/**
 * Reset consent — will trigger modal on next visit/reload
 */
export function resetConsent() {
    const reset = defaultConsent();
    _consent.set(reset);
    storageHelpers.remove(STORAGE_KEYS.CONSENT);
}

/**
 * Update a single preference without re-opening modal
 * @param {'analytics'|'saveHistory'} key
 * @param {boolean} value
 */
export function updateConsentPreference(key, value) {
    const current = get(_consent);
    const updated = {
        ...current,
        preferences: { ...current.preferences, [key]: value }
    };
    _consent.set(updated);
    storageHelpers.set(STORAGE_KEYS.CONSENT, updated);
}
