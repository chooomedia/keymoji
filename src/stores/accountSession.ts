/*
Account session store for managing user session validation and state.
Handles session expiration checks, active session tracking, and session restore state.
Provides session validation functions and session flag management.
*/
import { get } from 'svelte/store';
import {
    currentAccount,
    isLoggedIn,
    userProfile,
    accountTier
} from './appStores';
import { storageHelpers, STORAGE_KEYS } from '../config/storage';
import { getActiveSessions, getSessionId } from './accountHelpers';
import { logSecurityEvent } from './accountSecurity';
import { isDebugMode } from '../utils/environment';
import type { SessionData } from './accountStore';

export const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
export const MAX_SESSIONS_PER_USER = 3;
let isRestoringSession: boolean = false;
let sessionRestored: boolean = false;
let sessionRestoreTimestamp: number = 0;

function debugAccountSession(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 AccountSession Debug: ${context}`);
    if (data) console.log(data);
    console.groupEnd();
}

export function validateSession(
    sessionData: SessionData | null | undefined
): boolean {
    debugAccountSession('🔍 [SESSION VALIDATION] Checking session...', {
        hasData: !!sessionData,
        hasEmail: !!sessionData?.email,
        hasSessionExpires: !!sessionData?.sessionExpires,
        sessionExpires: sessionData?.sessionExpires
    });

    if (!sessionData) {
        debugAccountSession('❌ [SESSION VALIDATION] No session data');
        return false;
    }

    if (!sessionData.email) {
        debugAccountSession('❌ [SESSION VALIDATION] No email in session data');
        return false;
    }

    if (!sessionData.sessionExpires) {
        debugAccountSession(
            '⚠️ [SESSION VALIDATION] No sessionExpires found, assuming valid session (backward compat)'
        );
        return true;
    }

    const now = new Date();
    const expires = new Date(sessionData.sessionExpires!); // Non-null assertion: we checked above

    debugAccountSession('🕐 [SESSION VALIDATION] Time check:', {
        now: now.toISOString(),
        expires: expires.toISOString(),
        isExpired: now > expires,
        timeUntilExpiry:
            Math.floor((expires.getTime() - now.getTime()) / 1000 / 60) +
            ' minutes'
    });

    if (now > expires) {
        debugAccountSession('❌ [SESSION VALIDATION] Session expired');
        logSecurityEvent('SESSION_EXPIRED', { userId: sessionData.userId });
        return false;
    }

    const activeSessions = getActiveSessions(sessionData.userId);
    if (activeSessions.length > MAX_SESSIONS_PER_USER) {
        debugAccountSession(
            '❌ [SESSION VALIDATION] Too many active sessions:',
            activeSessions.length
        );
        logSecurityEvent('SUSPICIOUS_ACTIVITY', {
            userId: sessionData.userId,
            sessionCount: activeSessions.length
        });
        return false;
    }

    debugAccountSession('✅ [SESSION VALIDATION] Session is valid');
    return true;
}

/**
 * Reset session flags
 */
export function resetSessionFlags(): void {
    debugAccountSession('🔄 [SESSION] Resetting session flags for new page load');
    isRestoringSession = false;
    sessionRestored = false;
    sessionRestoreTimestamp = 0;
}

/**
 * Get session restore state
 */
export function getSessionRestoreState(): {
    isRestoring: boolean;
    restored: boolean;
    timestamp: number;
} {
    return {
        isRestoring: isRestoringSession,
        restored: sessionRestored,
        timestamp: sessionRestoreTimestamp
    };
}

/**
 * Set session restore state
 */
export function setSessionRestoreState(
    isRestoring: boolean,
    restored: boolean
): void {
    isRestoringSession = isRestoring;
    sessionRestored = restored;
    sessionRestoreTimestamp = Date.now();
}
