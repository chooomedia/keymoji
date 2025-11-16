/*
Cookie utility for secure cookie management in account system.
Provides functions for setting, getting, and deleting cookies with security options.
Handles account tokens, session IDs, and user preferences via cookies.
*/
import { isDebugMode } from './environment';

function debugCookies(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 Cookies Debug: ${context}`);
    if (data) console.log(data);
    console.groupEnd();
}

/**
 * Cookie-Optionen Interface
 */
export interface CookieOptions {
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
}

/**
 * Cookie-Keys Konstanten
 */
export const COOKIE_KEYS = {
    ACCOUNT_TOKEN: 'keymoji_account_token',
    USER_ID: 'keymoji_user_id',
    SESSION_ID: 'keymoji_session_id',
    PREFERENCES: 'keymoji_preferences',
    LANGUAGE: 'keymoji_language',
    THEME: 'keymoji_theme'
};

/**
 * Standard Cookie-Optionen
 */
const COOKIE_OPTIONS: CookieOptions = {
    secure: true, // Nur über HTTPS
    sameSite: 'strict', // CSRF-Schutz
    httpOnly: false, // JavaScript-Zugriff erlauben
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
    path: '/'
};

/**
 * Cookie-Status Interface
 */
export interface CookieStatus {
    exists: boolean;
    valid: boolean;
    value: string | null;
}

/**
 * Cookie-Status Map
 */
export interface CookieStatusMap {
    [key: string]: CookieStatus;
}

/**
 * Account-Token Interface
 */
export interface AccountToken {
    token: string | null;
    userId: string | null;
}

/**
 * Sichere Cookie setzen
 */
export function setSecureCookie(name: string, value: string, options: CookieOptions = {}): boolean {
    if (typeof document === 'undefined') return false;

    try {
        const cookieOptions: CookieOptions = {
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
        debugCookies('Failed to set cookie', { name, error });
        return false;
    }
}

/**
 * Cookie lesen
 */
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie
                .split('=')
                .map(c => c.trim());
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    } catch (error) {
        debugCookies('Failed to read cookie', { name, error });
        return null;
    }
}

/**
 * Cookie löschen
 */
export function deleteCookie(name: string): boolean {
    if (typeof document === 'undefined') return false;

    try {
        document.cookie = `${name}=; max-age=0; path=/`;
        return true;
    } catch (error) {
        debugCookies('Failed to delete cookie', { name, error });
        return false;
    }
}

/**
 * Account-Token setzen
 */
export function setAccountToken(token: string, userId: string): boolean {
    const success1 = setSecureCookie(COOKIE_KEYS.ACCOUNT_TOKEN, token);
    const success2 = setSecureCookie(COOKIE_KEYS.USER_ID, userId);
    return success1 && success2;
}

/**
 * Account-Token lesen
 */
export function getAccountToken(): AccountToken {
    return {
        token: getCookie(COOKIE_KEYS.ACCOUNT_TOKEN),
        userId: getCookie(COOKIE_KEYS.USER_ID)
    };
}

/**
 * Account-Token löschen
 */
export function clearAccountToken(): boolean {
    const success1 = deleteCookie(COOKIE_KEYS.ACCOUNT_TOKEN);
    const success2 = deleteCookie(COOKIE_KEYS.USER_ID);
    return success1 && success2;
}

/**
 * Session-ID generieren
 */
export function generateSessionId(): string {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

/**
 * Session-ID setzen
 */
export function setSessionId(): boolean {
    const sessionId = generateSessionId();
    return setSecureCookie(COOKIE_KEYS.SESSION_ID, sessionId);
}

/**
 * Session-ID lesen
 */
export function getSessionId(): string | null {
    return getCookie(COOKIE_KEYS.SESSION_ID);
}

/**
 * User-Präferenzen Interface
 */
export interface UserPreferences {
    [key: string]: unknown;
}

/**
 * User-Präferenzen setzen
 */
export function setUserPreferences(preferences: UserPreferences): boolean {
    return setSecureCookie(
        COOKIE_KEYS.PREFERENCES,
        JSON.stringify(preferences)
    );
}

/**
 * User-Präferenzen lesen
 */
export function getUserPreferences(): UserPreferences | null {
    const prefs = getCookie(COOKIE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) as UserPreferences : null;
}

/**
 * Alle Cookies löschen
 */
export function clearAllCookies(): boolean {
    const keys = Object.values(COOKIE_KEYS);
    let success = true;

    for (const key of keys) {
        if (!deleteCookie(key)) {
            success = false;
        }
    }

    return success;
}

/**
 * Cookie-Validierung
 */
export function validateCookie(name: string, value: string | null): boolean {
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

/**
 * Cookie-Status prüfen
 */
export function getCookieStatus(): CookieStatusMap {
    const status: CookieStatusMap = {};

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

