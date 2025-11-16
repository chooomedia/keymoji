// src/config/limits.ts
// Zentrale, sichere Konfiguration für alle App-Limits
// TypeScript Migration: v0.7.7
// Diese Werte sind HARDCODED und können NICHT client-seitig manipuliert werden

import { isDevelopment } from '../utils/environment';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface DailyLimits {
    // Guest User (nicht eingeloggt)
    GUEST: number; // 5 generations per day for guests

    // Free User (eingeloggt, kostenlos)
    FREE: number; // 10 random executions per day for FREE users
    FREE_STORIES: number; // 5 story generations per day for FREE users

    // Pro User (eingeloggt, bezahlt)
    PRO: number; // Unlimited random executions for PRO users
    PRO_STORIES: number; // Unlimited story generations for PRO users

    // Unlimited für Pro (theoretisch unbegrenzt, aber mit Sicherheitslimit)
    UNLIMITED: number;
    
    // Dev environment - unlimited for testing
    DEV: number;
    DEV_STORIES: number;
}

export interface LimitTypes {
    RANDOM_GENERATIONS: string;
    STORY_GENERATIONS: string;
    DAILY_REQUESTS: string;
    DAILY_EXECUTIONS: string; // NEW: Separate tracking for executions
}

export interface UserLimitValidation {
    limit: number;
    used: number;
    remaining: number;
    isReached: boolean;
    userType: 'guest' | 'free' | 'pro';
}

export interface DefaultLimits {
    GUEST: number;
    FREE: number;
    PRO: number;
}

export type AccountTier = 'free' | 'pro';

// ============================================
// CONSTANTS
// ============================================

export const DAILY_LIMITS: DailyLimits = {
    // Guest User (nicht eingeloggt)
    GUEST: 5, // 5 generations per day for guests

    // Free User (eingeloggt, kostenlos)
    // NEW: 10 random executions + 5 story generations per day
    FREE: 10, // 10 random executions per day for FREE users
    FREE_STORIES: 5, // 5 story generations per day for FREE users

    // Pro User (eingeloggt, bezahlt)
    // NEW: Unlimited executions and stories
    PRO: 999999, // Unlimited random executions for PRO users
    PRO_STORIES: 999999, // Unlimited story generations for PRO users

    // Unlimited für Pro (theoretisch unbegrenzt, aber mit Sicherheitslimit)
    UNLIMITED: 999999,
    
    // Dev environment - unlimited for testing
    DEV: 99999,
    DEV_STORIES: 99999
};

export const LIMIT_TYPES: LimitTypes = {
    RANDOM_GENERATIONS: 'random_generations',
    STORY_GENERATIONS: 'story_generations',
    DAILY_REQUESTS: 'daily_requests',
    DAILY_EXECUTIONS: 'daily_executions' // NEW: Separate tracking for executions
};

// ============================================
// FUNCTIONS
// ============================================

// Sichere Limit-Validierung
export function getDailyLimitForUser(isLoggedIn: boolean, accountTier: AccountTier = 'free'): number {
    // Dev environment: unlimited for testing
    if (isDevelopment()) {
        return DAILY_LIMITS.DEV;
    }
    
    if (!isLoggedIn) {
        return DAILY_LIMITS.GUEST;
    }

    switch (accountTier) {
        case 'pro':
            return DAILY_LIMITS.PRO; // Unlimited for Pro
        case 'free':
        default:
            return DAILY_LIMITS.FREE; // 10 random executions for Free
    }
}

/**
 * Get daily story generation limit for user
 * NEW: Separate limit for story generations
 */
export function getDailyStoryLimitForUser(isLoggedIn: boolean, accountTier: AccountTier = 'free'): number {
    // Dev environment: unlimited for testing
    if (isDevelopment()) {
        return DAILY_LIMITS.DEV_STORIES;
    }
    
    if (!isLoggedIn) {
        return 0; // Guests cannot generate stories
    }

    switch (accountTier) {
        case 'pro':
            return DAILY_LIMITS.PRO_STORIES; // Unlimited for Pro
        case 'free':
        default:
            return DAILY_LIMITS.FREE_STORIES; // 5 stories per day for Free
    }
}

// Sichere Limit-Prüfung
export function isLimitReached(used: number, limit: number): boolean {
    return used >= limit;
}

// Sichere Limit-Berechnung
export function getRemainingGenerations(used: number, limit: number): number {
    return Math.max(0, limit - used);
}

// Limit-Validierung für verschiedene User-Typen
export function validateUserLimits(
    isLoggedIn: boolean,
    accountTier: AccountTier,
    usedCount: number
): UserLimitValidation {
    const limit = getDailyLimitForUser(isLoggedIn, accountTier);
    const remaining = getRemainingGenerations(usedCount, limit);

    return {
        limit,
        used: usedCount,
        remaining,
        isReached: isLimitReached(usedCount, limit),
        userType: isLoggedIn
            ? accountTier === 'pro'
                ? 'pro'
                : 'free'
            : 'guest'
    };
}

// Export für Backward Compatibility
export const DEFAULT_LIMITS: DefaultLimits = {
    GUEST: DAILY_LIMITS.GUEST,
    FREE: DAILY_LIMITS.FREE,
    PRO: DAILY_LIMITS.PRO
};

