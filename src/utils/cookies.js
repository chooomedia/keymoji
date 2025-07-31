// src/utils/cookies.js
// Sichere Cookie-Behandlung für Account-Management

const COOKIE_OPTIONS = {
    secure: true, // Nur über HTTPS
    sameSite: 'strict', // CSRF-Schutz
    httpOnly: false, // JavaScript-Zugriff erlauben
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
    path: '/'
};

// Cookie-Namen
export const COOKIE_KEYS = {
    ACCOUNT_TOKEN: 'keymoji_account_token',
    USER_ID: 'keymoji_user_id',
    SESSION_ID: 'keymoji_session_id',
    PREFERENCES: 'keymoji_preferences',
    LANGUAGE: 'keymoji_language',
    THEME: 'keymoji_theme'
};

// Sichere Cookie setzen
export function setSecureCookie(name, value, options = {}) {
    if (typeof document === 'undefined') return false;

    try {
        const cookieOptions = {
            ...COOKIE_OPTIONS,
            ...options
        };

        let cookieString = `${name}=${encodeURIComponent(value)}`;

        if (cookieOptions.maxAge) {
            cookieString += `; max-age=${cookieOptions.maxAge}`;
        }
        if (cookieOptions.path) {
            cookieString += `; path=${cookieOptions.path}`;
        }
        if (cookieOptions.secure && window.location.protocol === 'https:') {
            cookieString += '; secure';
        }
        if (cookieOptions.sameSite) {
            cookieString += `; samesite=${cookieOptions.sameSite}`;
        }
        if (cookieOptions.httpOnly) {
            cookieString += '; httponly';
        }

        document.cookie = cookieString;
        return true;
    } catch (error) {
        console.warn('Failed to set cookie:', name, error);
        return false;
    }
}

// Cookie lesen
export function getCookie(name) {
    if (typeof document === 'undefined') return null;

    try {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie
                .split('=')
                .map(c => c.trim());
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    } catch (error) {
        console.warn('Failed to read cookie:', name, error);
        return null;
    }
}

// Cookie löschen
export function deleteCookie(name) {
    if (typeof document === 'undefined') return false;

    try {
        document.cookie = `${name}=; max-age=0; path=/`;
        return true;
    } catch (error) {
        console.warn('Failed to delete cookie:', name, error);
        return false;
    }
}

// Account-Token setzen
export function setAccountToken(token, userId) {
    const success1 = setSecureCookie(COOKIE_KEYS.ACCOUNT_TOKEN, token);
    const success2 = setSecureCookie(COOKIE_KEYS.USER_ID, userId);
    return success1 && success2;
}

// Account-Token lesen
export function getAccountToken() {
    return {
        token: getCookie(COOKIE_KEYS.ACCOUNT_TOKEN),
        userId: getCookie(COOKIE_KEYS.USER_ID)
    };
}

// Account-Token löschen
export function clearAccountToken() {
    const success1 = deleteCookie(COOKIE_KEYS.ACCOUNT_TOKEN);
    const success2 = deleteCookie(COOKIE_KEYS.USER_ID);
    return success1 && success2;
}

// Session-ID generieren
export function generateSessionId() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

// Session-ID setzen
export function setSessionId() {
    const sessionId = generateSessionId();
    return setSecureCookie(COOKIE_KEYS.SESSION_ID, sessionId);
}

// Session-ID lesen
export function getSessionId() {
    return getCookie(COOKIE_KEYS.SESSION_ID);
}

// User-Präferenzen setzen
export function setUserPreferences(preferences) {
    return setSecureCookie(
        COOKIE_KEYS.PREFERENCES,
        JSON.stringify(preferences)
    );
}

// User-Präferenzen lesen
export function getUserPreferences() {
    const prefs = getCookie(COOKIE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : null;
}

// Alle Cookies löschen
export function clearAllCookies() {
    const keys = Object.values(COOKIE_KEYS);
    let success = true;

    for (const key of keys) {
        if (!deleteCookie(key)) {
            success = false;
        }
    }

    return success;
}

// Cookie-Validierung
export function validateCookie(name, value) {
    if (!name || !value) return false;

    // Spezifische Validierungen je nach Cookie-Typ
    switch (name) {
        case COOKIE_KEYS.ACCOUNT_TOKEN:
            return value.length >= 32; // Mindestlänge für Token
        case COOKIE_KEYS.USER_ID:
            return /^[a-zA-Z0-9-_]+$/.test(value); // Alphanumerisch + Bindestriche
        case COOKIE_KEYS.SESSION_ID:
            return value.length >= 20; // Mindestlänge für Session-ID
        default:
            return true;
    }
}

// Cookie-Status prüfen
export function getCookieStatus() {
    const status = {};

    for (const [key, value] of Object.entries(COOKIE_KEYS)) {
        const cookieValue = getCookie(value);
        status[key] = {
            exists: cookieValue !== null,
            valid: cookieValue ? validateCookie(value, cookieValue) : false,
            value: cookieValue
        };
    }

    return status;
}
