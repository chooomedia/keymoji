/*
Account helper functions for token generation, session management, and account data manipulation.
Provides utility functions for secure token creation, fantasy name generation, and account metadata handling.
Manages session IDs, createdAt timestamps, and account data parsing.
*/
import { storageHelpers, STORAGE_KEYS } from '../config/storage';
import { generateClientFingerprint } from '../utils/sharedHelpers';
import { isDebugMode } from '../utils/environment';
import type { Account } from '../types/Account';

function debugAccountHelpers(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 AccountHelpers Debug: ${context}`);
    if (data) debugAccountHelpers(data);
    console.groupEnd();
}

/**
 * Generate secure token for magic links
 */
export function generateSecureToken(): string {
    const timestamp = Date.now().toString(36);
    const random1 = Math.random().toString(36).substring(2);
    const random2 = Math.random().toString(36).substring(2);
    const clientFingerprint = generateClientFingerprint();

    return `${timestamp}_${random1}_${random2}_${clientFingerprint.substring(
        0,
        8
    )}`;
}

/**
 * Generate fantasy name for new users
 */
export function generateFantasyName(): string {
    const fantasyNames = [
        'Aragorn',
        'Gandalf',
        'Legolas',
        'Gimli',
        'Frodo',
        'Sam',
        'Merry',
        'Pippin',
        'Gandalf',
        'Saruman',
        'Radagast',
        'Elrond',
        'Galadriel',
        'Arwen',
        'Eowyn',
        'Theoden',
        'Denethor',
        'Boromir',
        'Faramir',
        'Gollum',
        'Smeagol'
    ];
    return fantasyNames[Math.floor(Math.random() * fantasyNames.length)];
}

/**
 * Get session ID from storage
 */
export function getSessionId(): string | null {
    return storageHelpers.get<string>('sessionId') || null;
}

/**
 * Set session ID in storage
 */
export function setSessionId(sessionId: string): boolean {
    return storageHelpers.set('sessionId', sessionId);
}

/**
 * Get active sessions for a user
 */
export function getActiveSessions(userId: string | undefined): (string | null)[] {
    return [getSessionId()].filter(Boolean);
}

/**
 * Get createdAt from account object
 */
export function getCreatedAtFromAccount(
    account: Account | Record<string, unknown> | null | undefined
): string | null {
    if (!account) {
        debugAccountHelpers('⚠️ No account provided to getCreatedAtFromAccount');
        return null;
    }

    debugAccountHelpers('🔍 DEBUG: getCreatedAtFromAccount called with:', account);

    const possibleSources = [
        account.createdAt,
        account.metadata?.createdAt,
        account.profile?.createdAt
    ];

    debugAccountHelpers('🔍 DEBUG: Possible createdAt sources:', possibleSources);

    const foundCreatedAt =
        possibleSources.find(
            date => date && date !== 'null' && date !== 'undefined'
        ) || null;

    debugAccountHelpers('🔍 DEBUG: Final createdAt:', foundCreatedAt);
    return foundCreatedAt;
}

/**
 * CRITICAL: Remove createdAt from objects before sending to API
 * Best Practice: createdAt should ONLY be set on CREATE, never in UPDATE requests
 * This ensures createdAt is preserved in the database and never overwritten
 */
export function removeCreatedAtFromObject<T extends Record<string, unknown>>(
    obj: T | null | undefined
): T {
    if (!obj || typeof obj !== 'object') return obj as T;

    const cleaned = { ...obj };

    if ('createdAt' in cleaned) {
        delete cleaned.createdAt;
    }

    if (cleaned.metadata && typeof cleaned.metadata === 'object') {
        const { createdAt, ...metadataWithoutCreatedAt } = cleaned.metadata as Record<string, unknown>;
        cleaned.metadata = metadataWithoutCreatedAt;
    }

    if (cleaned.profile && typeof cleaned.profile === 'object') {
        const { createdAt, ...profileWithoutCreatedAt } = cleaned.profile as Record<string, unknown>;
        cleaned.profile = profileWithoutCreatedAt;
    }

    return cleaned;
}

/**
 * Save createdAt to user preferences
 */
export function saveCreatedAtToUserPreferences(
    createdAt: string | null | undefined
): void {
    if (!createdAt) {
        debugAccountHelpers('⚠️ No createdAt provided to save');
        return;
    }

    if (
        createdAt === 'null' ||
        createdAt === 'undefined' ||
        (createdAt.trim && createdAt.trim() === '')
    ) {
        debugAccountHelpers('⚠️ Invalid createdAt value - not saving:', createdAt);
        return;
    }

    debugAccountHelpers('🔍 DEBUG: Saving createdAt to USER_PREFERENCES:', createdAt);

    const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    debugAccountHelpers('🔍 DEBUG: Current userPrefs createdAt:', userPrefs.createdAt);

    if (userPrefs.createdAt && userPrefs.createdAt === createdAt) {
        debugAccountHelpers(
            '✅ createdAt already exists in localStorage with same value - no update needed'
        );
        return;
    }

    if (userPrefs.createdAt && userPrefs.createdAt !== createdAt) {
        debugAccountHelpers(
            '⚠️ createdAt mismatch - localStorage has:',
            userPrefs.createdAt,
            'backend has:',
            createdAt
        );
        if (!createdAt || createdAt === 'null' || createdAt === 'undefined') {
            debugAccountHelpers(
                '🔄 Backend createdAt is invalid - preserving localStorage value:',
                userPrefs.createdAt
            );
            return;
        }
        debugAccountHelpers(
            '✅ Updating createdAt from backend (backend takes precedence):',
            createdAt
        );
    }

    const updatedPrefs = {
        ...userPrefs,
        createdAt: createdAt
    };

    debugAccountHelpers('🔍 DEBUG: Updated userPrefs:', updatedPrefs);

    const success = storageHelpers.set(
        STORAGE_KEYS.USER_PREFERENCES,
        updatedPrefs
    );

    if (success) {
        debugAccountHelpers('✅ createdAt saved to USER_PREFERENCES:', createdAt);
    } else {
        debugAccountHelpers('❌ Failed to save createdAt to USER_PREFERENCES');
    }
}

/**
 * Get createdAt from user preferences
 */
export function getCreatedAtFromUserPreferences(): string | null {
    const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    const createdAt = userPrefs.createdAt || null;
    debugAccountHelpers('🔍 Retrieved createdAt from USER_PREFERENCES:', createdAt);
    return createdAt;
}

/**
 * Safe JSON parsing helper
 * Handles both strings and already-parsed objects
 */
export function safeJSONParse<T = Record<string, unknown>>(
    data: string | T | null | undefined,
    fallback: T
): T {
    if (!data) return fallback;

    if (typeof data === 'object' && data !== null) {
        return data as T;
    }

    if (typeof data === 'string') {
        try {
            let parsed = JSON.parse(data);

            if (typeof parsed === 'string') {
                debugAccountHelpers(
                    '⚠️ Double-escaped JSON detected, parsing again...'
                );
                try {
                    parsed = JSON.parse(parsed);
                    debugAccountHelpers('✅ Successfully parsed double-escaped JSON');
                } catch (secondError) {
                    const error = secondError instanceof Error ? secondError : new Error(String(secondError));
                    debugAccountHelpers(
                        '⚠️ Failed second parse:',
                        error.message
                    );
                    return fallback;
                }
            }

            return parsed as T;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            debugAccountHelpers('⚠️ Failed to parse JSON:', err.message);
            return fallback;
        }
    }

    return fallback;
}


