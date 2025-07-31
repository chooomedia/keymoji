// src/config/limits.js
// Zentrale, sichere Konfiguration für alle App-Limits
// Diese Werte sind HARDCODED und können NICHT client-seitig manipuliert werden

export const DAILY_LIMITS = {
    // Guest User (nicht eingeloggt)
    GUEST: 3,

    // Free User (eingeloggt, kostenlos)
    FREE: 5,

    // Pro User (eingeloggt, bezahlt)
    PRO: 25,

    // Unlimited für Pro (theoretisch unbegrenzt, aber mit Sicherheitslimit)
    UNLIMITED: 999999
};

export const LIMIT_TYPES = {
    RANDOM_GENERATIONS: 'random_generations',
    STORY_GENERATIONS: 'story_generations',
    DAILY_REQUESTS: 'daily_requests'
};

// Sichere Limit-Validierung
export function getDailyLimitForUser(isLoggedIn, accountTier) {
    if (!isLoggedIn) {
        return DAILY_LIMITS.GUEST;
    }

    switch (accountTier) {
        case 'pro':
            return DAILY_LIMITS.PRO;
        case 'free':
        default:
            return DAILY_LIMITS.FREE;
    }
}

// Sichere Limit-Prüfung
export function isLimitReached(used, limit) {
    return used >= limit;
}

// Sichere Limit-Berechnung
export function getRemainingGenerations(used, limit) {
    return Math.max(0, limit - used);
}

// Limit-Validierung für verschiedene User-Typen
export function validateUserLimits(isLoggedIn, accountTier, usedCount) {
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
export const DEFAULT_LIMITS = {
    GUEST: DAILY_LIMITS.GUEST,
    FREE: DAILY_LIMITS.FREE,
    PRO: DAILY_LIMITS.PRO
};
