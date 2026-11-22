/**
 * Session token storage for authenticated account API calls.
 *
 * The token is issued after OTP verification and bound to the account.
 * It expires server-side after 24 hours.
 */

const SESSION_TOKEN_KEY = 'keymoji_session_token';

export function getSessionToken(): string {
    try {
        return localStorage.getItem(SESSION_TOKEN_KEY) || '';
    } catch {
        return '';
    }
}

export function setSessionToken(token: string | null | undefined): void {
    try {
        if (token) {
            localStorage.setItem(SESSION_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(SESSION_TOKEN_KEY);
        }
    } catch {
        // Storage unavailable, requests will be rejected and the user re-logs in.
    }
}

export function clearSessionToken(): void {
    setSessionToken(null);
}

export function sessionAuthHeaders(): Record<string, string> {
    const token = getSessionToken();

    return token ? { Authorization: `Bearer ${token}` } : {};
}
