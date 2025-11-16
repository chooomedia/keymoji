// src/stores/accountSecurity.ts
// Security & Logging Functions für Account Management
// TypeScript Migration: v0.7.7
import { get } from 'svelte/store';
import { currentAccount } from './appStores';
import { WEBHOOKS } from '../config/api';
import { generateClientFingerprint } from '../utils/sharedHelpers';
import { getSessionId } from './accountHelpers';
// Types werden von accountStore.ts exportiert
// Import hier temporär, bis accountStore.ts refactored ist
import type {
    SecurityEventDetails,
    SecurityLog,
    AccountingEventDetails
} from './accountStore';

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

const LOGIN_ATTEMPTS = new Map<string, number[]>();

/**
 * Log security event
 */
export function logSecurityEvent(
    event: string,
    details: SecurityEventDetails = {}
): void {
    const timestamp = new Date().toISOString();
    const clientFingerprint = generateClientFingerprint();
    const account = get(currentAccount);

    const securityLog: SecurityLog = {
        event,
        timestamp,
        clientFingerprint,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        details,
        accountingEvent:
            event.startsWith('ACCOUNT_') || event.startsWith('PAYMENT_'),
        sessionId: getSessionId(),
        userId: details?.userId || account?.userId,
        email: details?.email || account?.email
    };

    console.log('🔒 Security Event:', securityLog);

    if (
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost'
    ) {
        fetch('/api/security/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(securityLog)
        }).catch((error: unknown) => {
            console.warn('Failed to log security event:', error);
        });
    }
}

/**
 * Log accounting event
 */
export function logAccountingEvent(
    event: string,
    details: SecurityEventDetails = {}
): void {
    const account = get(currentAccount);
    const accountingDetails: AccountingEventDetails = {
        ...details,
        event: event, // Add event field for n8n compatibility
        accountingType: 'account_management',
        timestamp: new Date().toISOString(),
        clientFingerprint: generateClientFingerprint(),
        sessionId: getSessionId(),
        userId: details?.userId || account?.userId,
        email: details?.email || account?.email,
        tier: (details?.tier || account?.tier || 'free') as 'free' | 'pro',
        action: event
    };

    console.log('💰 Accounting Event:', accountingDetails);

    if (typeof window !== 'undefined') {
        fetch(WEBHOOKS.ACCOUNTING.AUDIT_LOG, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accountingDetails)
        }).catch((error: unknown) => {
            console.warn('Failed to log accounting event to n8n:', error);
        });
    }

    logSecurityEvent(`ACCOUNTING_${event}`, accountingDetails);
}

/**
 * Check rate limit for login attempts
 */
export function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const attempts = LOGIN_ATTEMPTS.get(email) || [];

    const recentAttempts = attempts.filter(
        timestamp => now - timestamp < LOGIN_ATTEMPT_WINDOW
    );

    if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
        const oldestAttempt = Math.min(...recentAttempts);
        const timeRemaining = LOGIN_ATTEMPT_WINDOW - (now - oldestAttempt);

        logSecurityEvent('RATE_LIMIT_EXCEEDED', {
            email,
            attempts: recentAttempts.length,
            timeRemaining,
            clientFingerprint: generateClientFingerprint()
        });

        throw new Error(
            `Too many login attempts. Please wait ${Math.ceil(
                timeRemaining / 60000
            )} minutes.`
        );
    }

    recentAttempts.push(now);
    LOGIN_ATTEMPTS.set(email, recentAttempts);

    return true;
}

/**
 * Clear login attempts for an email (used on logout)
 */
export function clearLoginAttempts(email: string): void {
    LOGIN_ATTEMPTS.delete(email);
}
