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
    PREFERENCES: 'keymoji_preferences'
};

// Sichere Cookie setzen
export function setSecureCookie(name, value, options = {}) {
    if (typeof document === 'undefined') return;

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
    if (cookieOptions.secure) {
        cookieString += '; secure';
    }
    if (cookieOptions.sameSite) {
        cookieString += `; samesite=${cookieOptions.sameSite}`;
    }
    if (cookieOptions.httpOnly) {
        cookieString += '; httponly';
    }

    document.cookie = cookieString;
}

// Cookie lesen
export function getCookie(name) {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

// Cookie löschen
export function deleteCookie(name) {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=; max-age=0; path=/`;
}

// Account-Token setzen
export function setAccountToken(token, userId) {
    setSecureCookie(COOKIE_KEYS.ACCOUNT_TOKEN, token);
    setSecureCookie(COOKIE_KEYS.USER_ID, userId);
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
    deleteCookie(COOKIE_KEYS.ACCOUNT_TOKEN);
    deleteCookie(COOKIE_KEYS.USER_ID);
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
    setSecureCookie(COOKIE_KEYS.SESSION_ID, sessionId);
    return sessionId;
}

// Session-ID lesen
export function getSessionId() {
    return getCookie(COOKIE_KEYS.SESSION_ID);
}

// Benutzer-Präferenzen speichern
export function setUserPreferences(preferences) {
    setSecureCookie(COOKIE_KEYS.PREFERENCES, JSON.stringify(preferences));
}

// Benutzer-Präferenzen lesen
export function getUserPreferences() {
    const prefs = getCookie(COOKIE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : {};
}

// Alle Cookies löschen (Logout)
export function clearAllCookies() {
    Object.values(COOKIE_KEYS).forEach(key => {
        deleteCookie(key);
    });
}
