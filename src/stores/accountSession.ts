// src/stores/accountSession.ts
// Session Management Functions für Account Management
// TypeScript Migration: v0.7.7
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
import type { SessionData } from './accountStore';

export const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
export const MAX_SESSIONS_PER_USER = 3;

// Session state flags
let isRestoringSession: boolean = false;
let sessionRestored: boolean = false;
let sessionRestoreTimestamp: number = 0;

/**
 * Validate session data
 */
export function validateSession(
    sessionData: SessionData | null | undefined
): boolean {
    console.log('🔍 [SESSION VALIDATION] Checking session...', {
        hasData: !!sessionData,
        hasEmail: !!sessionData?.email,
        hasSessionExpires: !!sessionData?.sessionExpires,
        sessionExpires: sessionData?.sessionExpires
    });

    if (!sessionData) {
        console.log('❌ [SESSION VALIDATION] No session data');
        return false;
    }

    if (!sessionData.email) {
        console.log('❌ [SESSION VALIDATION] No email in session data');
        return false;
    }

    if (!sessionData.sessionExpires) {
        console.log(
            '⚠️ [SESSION VALIDATION] No sessionExpires found, assuming valid session (backward compat)'
        );
        return true;
    }

    const now = new Date();
    const expires = new Date(sessionData.sessionExpires!); // Non-null assertion: we checked above

    console.log('🕐 [SESSION VALIDATION] Time check:', {
        now: now.toISOString(),
        expires: expires.toISOString(),
        isExpired: now > expires,
        timeUntilExpiry:
            Math.floor((expires.getTime() - now.getTime()) / 1000 / 60) +
            ' minutes'
    });

    if (now > expires) {
        console.log('❌ [SESSION VALIDATION] Session expired');
        logSecurityEvent('SESSION_EXPIRED', { userId: sessionData.userId });
        return false;
    }

    const activeSessions = getActiveSessions(sessionData.userId);
    if (activeSessions.length > MAX_SESSIONS_PER_USER) {
        console.log(
            '❌ [SESSION VALIDATION] Too many active sessions:',
            activeSessions.length
        );
        logSecurityEvent('SUSPICIOUS_ACTIVITY', {
            userId: sessionData.userId,
            sessionCount: activeSessions.length
        });
        return false;
    }

    console.log('✅ [SESSION VALIDATION] Session is valid');
    return true;
}

/**
 * Reset session flags
 */
export function resetSessionFlags(): void {
    console.log('🔄 [SESSION] Resetting session flags for new page load');
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
