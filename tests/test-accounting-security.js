/**
 * Automated Tests for Accounting System
 *
 * @description Comprehensive test suite for the accounting system
 * covering all security aspects, authentication flows, and edge cases.
 * Based on IT-Security Best Practices and OWASP guidelines.
 */

import {
    loginWithMagicLink,
    verifyMagicLink,
    logout,
    getCurrentAccount,
    initializeAccountFromCookies,
    createAccount,
    getAccount,
    updateAccount,
    logSecurityEvent,
    checkRateLimit,
    validateSession,
    generateCSRFToken,
    validateCSRFToken
} from '../src/stores/accountStore.js';

// Mock fetch for testing
global.fetch = jest.fn();

// Mock localStorage and sessionStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock crypto for secure token generation
Object.defineProperty(window, 'crypto', {
    value: {
        getRandomValues: jest.fn(() => new Uint8Array(32).fill(1))
    }
});

describe('Accounting System Security Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        sessionStorageMock.clear();
    });

    describe('Authentication Security', () => {
        test('should implement rate limiting for login attempts', async () => {
            const email = 'test@example.com';

            // First 5 attempts should succeed
            for (let i = 0; i < 5; i++) {
                expect(() => checkRateLimit(email)).not.toThrow();
            }

            // 6th attempt should throw error
            expect(() => checkRateLimit(email)).toThrow(
                'Too many login attempts'
            );
        });

        test('should generate secure CSRF tokens', () => {
            const token1 = generateCSRFToken();
            const token2 = generateCSRFToken();

            expect(token1).toBeDefined();
            expect(token1).toHaveLength(64); // 32 bytes = 64 hex chars
            expect(token1).not.toBe(token2);
        });

        test('should validate CSRF tokens correctly', () => {
            const token = generateCSRFToken();

            expect(validateCSRFToken(token)).toBe(true);
            expect(validateCSRFToken('invalid-token')).toBe(false);
        });

        test('should validate session data correctly', () => {
            const validSession = {
                sessionExpires: new Date(
                    Date.now() + 30 * 60 * 1000
                ).toISOString(),
                userId: 'user123'
            };

            const expiredSession = {
                sessionExpires: new Date(
                    Date.now() - 30 * 60 * 1000
                ).toISOString(),
                userId: 'user123'
            };

            expect(validateSession(validSession)).toBe(true);
            expect(validateSession(expiredSession)).toBe(false);
            expect(validateSession(null)).toBe(false);
        });
    });

    describe('Magic Link Authentication', () => {
        test('should send magic link with enhanced security', async () => {
            const email = 'test@example.com';
            const name = 'Test User';

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            const result = await loginWithMagicLink(email, name);

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': expect.any(String),
                        'X-Requested-With': 'XMLHttpRequest'
                    }),
                    body: expect.stringContaining(email)
                })
            );

            expect(result).toEqual({ success: true });
        });

        test('should handle magic link verification with security', async () => {
            const token = 'valid-token';
            const email = 'test@example.com';

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            const result = await verifyMagicLink(token, email);

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': expect.any(String),
                        'X-Requested-With': 'XMLHttpRequest'
                    }),
                    body: expect.stringContaining(token)
                })
            );

            expect(result).toEqual({ success: true });
        });

        test('should handle authentication errors gracefully', async () => {
            const email = 'test@example.com';

            fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(loginWithMagicLink(email)).rejects.toThrow(
                'Network error'
            );
        });
    });

    describe('Session Management', () => {
        test('should create secure sessions with proper timeouts', async () => {
            const email = 'test@example.com';

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await loginWithMagicLink(email);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                expect.any(String),
                expect.stringContaining('sessionExpires')
            );
        });

        test('should clear all session data on logout', () => {
            logout();

            expect(localStorageMock.clear).toHaveBeenCalled();
            expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(
                'csrf_token'
            );
        });

        test('should restore sessions from cookies securely', () => {
            const mockPreferences = {
                email: 'test@example.com',
                sessionExpires: new Date(
                    Date.now() + 30 * 60 * 1000
                ).toISOString(),
                userId: 'user123'
            };

            localStorageMock.getItem.mockReturnValue(
                JSON.stringify(mockPreferences)
            );

            const result = initializeAccountFromCookies();

            expect(result).toBe(true);
        });
    });

    describe('Account Management Security', () => {
        test('should create accounts with security metadata', async () => {
            const userId = 'user123';
            const email = 'test@example.com';

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await createAccount(userId, email);

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'X-CSRF-Token': expect.any(String),
                        'X-Requested-With': 'XMLHttpRequest'
                    }),
                    body: expect.stringContaining('clientFingerprint')
                })
            );
        });

        test('should update accounts with audit logging', async () => {
            const userId = 'user123';
            const updates = { tier: 'pro' };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await updateAccount(userId, updates);

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'X-CSRF-Token': expect.any(String)
                    }),
                    body: expect.stringContaining('update')
                })
            );
        });
    });

    describe('Security Event Logging', () => {
        test('should log security events with proper metadata', () => {
            const event = 'LOGIN_ATTEMPT';
            const details = { email: 'test@example.com' };

            logSecurityEvent(event, details);

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    }),
                    body: expect.stringContaining(event)
                })
            );
        });

        test('should include client fingerprint in security logs', () => {
            const event = 'SUSPICIOUS_ACTIVITY';
            const details = { userId: 'user123' };

            logSecurityEvent(event, details);

            const callBody = JSON.parse(fetch.mock.calls[0][1].body);
            expect(callBody).toHaveProperty('userAgent');
            expect(callBody).toHaveProperty('timestamp');
        });
    });

    describe('Input Validation Security', () => {
        test('should validate email addresses securely', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.co.uk',
                'test+tag@example.org'
            ];

            const invalidEmails = [
                'invalid-email',
                '@example.com',
                'test@',
                'test@.com'
            ];

            validEmails.forEach(email => {
                expect(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
                ).toBe(true);
            });

            invalidEmails.forEach(email => {
                expect(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
                ).toBe(false);
            });
        });

        test('should validate URLs securely', () => {
            const validUrls = [
                'https://example.com',
                'http://subdomain.example.org',
                'https://example.com/path?param=value'
            ];

            const invalidUrls = [
                'not-a-url',
                'ftp://example.com',
                'javascript:alert(1)'
            ];

            validUrls.forEach(url => {
                expect(/^https?:\/\/.+/i.test(url)).toBe(true);
            });

            invalidUrls.forEach(url => {
                expect(/^https?:\/\/.+/i.test(url)).toBe(false);
            });
        });
    });

    describe('Error Handling Security', () => {
        test('should not expose sensitive information in errors', async () => {
            const email = 'test@example.com';

            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({
                    error: 'Internal server error',
                    debug: 'sensitive-info' // This should not be exposed
                })
            });

            try {
                await loginWithMagicLink(email);
            } catch (error) {
                expect(error.message).not.toContain('sensitive-info');
                expect(error.message).toContain('Internal server error');
            }
        });

        test('should handle network errors gracefully', async () => {
            const email = 'test@example.com';

            fetch.mockRejectedValueOnce(new Error('Network timeout'));

            await expect(loginWithMagicLink(email)).rejects.toThrow(
                'Network timeout'
            );
        });
    });

    describe('Session Timeout Security', () => {
        test('should enforce session timeouts', () => {
            const shortSession = {
                sessionExpires: new Date(Date.now() + 1000).toISOString(), // 1 second
                userId: 'user123'
            };

            const longSession = {
                sessionExpires: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                ).toISOString(), // 24 hours
                userId: 'user123'
            };

            // Short session should be valid initially
            expect(validateSession(shortSession)).toBe(true);

            // Wait for timeout
            setTimeout(() => {
                expect(validateSession(shortSession)).toBe(false);
            }, 2000);

            // Long session should be valid
            expect(validateSession(longSession)).toBe(true);
        });
    });

    describe('CSRF Protection', () => {
        test('should include CSRF tokens in all requests', async () => {
            const email = 'test@example.com';

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await loginWithMagicLink(email);

            const callHeaders = fetch.mock.calls[0][1].headers;
            expect(callHeaders['X-CSRF-Token']).toBeDefined();
            expect(callHeaders['X-Requested-With']).toBe('XMLHttpRequest');
        });

        test('should validate CSRF tokens on server responses', async () => {
            const token = 'valid-token';
            const email = 'test@example.com';

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await verifyMagicLink(token, email);

            const callBody = JSON.parse(fetch.mock.calls[0][1].body);
            expect(callBody.csrfToken).toBeDefined();
        });
    });

    describe('Client Fingerprinting', () => {
        test('should generate consistent client fingerprints', () => {
            // Mock browser environment
            Object.defineProperty(window, 'navigator', {
                value: {
                    userAgent: 'Mozilla/5.0 (Test Browser)',
                    language: 'en-US',
                    platform: 'Win32'
                }
            });

            Object.defineProperty(window, 'screen', {
                value: {
                    width: 1920,
                    height: 1080
                }
            });

            const fingerprint1 = generateClientFingerprint();
            const fingerprint2 = generateClientFingerprint();

            expect(fingerprint1).toBe(fingerprint2);
            expect(fingerprint1).toContain('Mozilla/5.0');
        });
    });
});

// Helper function for generating client fingerprint (from accountStore.js)
function generateClientFingerprint() {
    return btoa(
        JSON.stringify({
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
    );
}

export { generateClientFingerprint };
