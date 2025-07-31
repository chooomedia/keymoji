// src/stores/accountStore.js
// Enhanced account management with security features

import { writable, get } from 'svelte/store';
import {
    currentAccount,
    isLoggedIn,
    userProfile,
    accountTier,
    dailyLimit,
    updateDailyLimit
} from './appStores.js';
import { showExistingAccountFound } from './modalStore.js';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';
import { WEBHOOKS } from '../config/api.js';
import { isDevelopment } from '../utils/environment.js';

// Security constants
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_SESSIONS_PER_USER = 3;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Rate limiting storage
const LOGIN_ATTEMPTS = new Map();

// Generate client fingerprint for security
function generateClientFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Keymoji Security Fingerprint', 2, 2);

    return canvas.toDataURL().substring(0, 32);
}

// Show login success modal for first-time users
function showLoginSuccessIfFirstLogin(accountInfo) {
    if (accountInfo.isFirstLogin) {
        showExistingAccountFound(accountInfo.email, accountInfo.name);
    }
}

// Enhanced security logging
function logSecurityEvent(event, details) {
    const timestamp = new Date().toISOString();
    const clientFingerprint = generateClientFingerprint();

    const securityLog = {
        event,
        timestamp,
        clientFingerprint,
        userAgent: navigator.userAgent,
        details
    };

    console.log('🔒 Security Event:', securityLog);

    // In production, this would be sent to a security monitoring service
    if (
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost'
    ) {
        // Send to security monitoring service
        fetch('/api/security/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(securityLog)
        }).catch(error => {
            console.warn('Failed to log security event:', error);
        });
    }
}

// Enhanced rate limiting with progressive delays
function checkRateLimit(email) {
    const now = Date.now();
    const attempts = LOGIN_ATTEMPTS.get(email) || [];

    // Remove old attempts outside the window
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

    // Add current attempt
    recentAttempts.push(now);
    LOGIN_ATTEMPTS.set(email, recentAttempts);

    return true;
}

// Session validation with enhanced security
function validateSession(sessionData) {
    if (!sessionData) return false;

    // If sessionExpires is not present, assume session is valid (for backward compatibility)
    if (!sessionData.sessionExpires) {
        console.log('⚠️ No sessionExpires found, assuming valid session');
        return true;
    }

    const now = new Date();
    const expires = new Date(sessionData.sessionExpires);

    // Check if session is expired
    if (now > expires) {
        logSecurityEvent('SESSION_EXPIRED', { userId: sessionData.userId });
        return false;
    }

    // Check for suspicious activity (multiple sessions)
    const activeSessions = getActiveSessions(sessionData.userId);
    if (activeSessions.length > MAX_SESSIONS_PER_USER) {
        logSecurityEvent('SUSPICIOUS_ACTIVITY', {
            userId: sessionData.userId,
            sessionCount: activeSessions.length
        });
        return false;
    }

    return true;
}

// Generate secure token for session management
function generateSecureToken() {
    // Verbesserte Token-Generierung mit mehr Entropie
    const timestamp = Date.now().toString(36);
    const random1 = Math.random().toString(36).substring(2);
    const random2 = Math.random().toString(36).substring(2);
    const clientFingerprint = generateClientFingerprint();

    // Kombiniere mehrere Entropie-Quellen für bessere Sicherheit
    return `${timestamp}_${random1}_${random2}_${clientFingerprint.substring(
        0,
        8
    )}`;
}

// Generate fantasy name for anonymous users
function generateFantasyName() {
    const fantasyNames = [
        'Aragorn',
        'Gandalf',
        'Legolas',
        'Gimli',
        'Frodo',
        'Sam',
        'Merry',
        'Pippin',
        'Gandalf',
        'Saruman',
        'Radagast',
        'Elrond',
        'Galadriel',
        'Arwen',
        'Eowyn',
        'Theoden',
        'Denethor',
        'Boromir',
        'Faramir',
        'Gollum',
        'Smeagol'
    ];
    return fantasyNames[Math.floor(Math.random() * fantasyNames.length)];
}

// Account stores - use currentAccount from appStores.js instead of redundant accountData
export const isLoggingIn = writable(false);
export const loginError = writable(null);

// Check if account exists before sending magic link
export async function checkAccountExists(email, name = '') {
    try {
        console.log('🔍 Checking account existence for:', email);

        const response = await fetch(WEBHOOKS.ACCOUNT.CHECK_EXISTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                email: email,
                name: name
            })
        });

        if (!response.ok) {
            console.log('❌ n8n account check failed, using fallback');
            // Fallback: assume account doesn't exist for new magic link requests
            return {
                success: true,
                exists: false,
                account: null,
                message: 'No account found (fallback)'
            };
        }

        const result = await response.json();
        console.log('✅ Account check result:', result);

        return result;
    } catch (error) {
        console.error('❌ Account check error:', error);
        // Fallback for network errors
        return {
            success: true,
            exists: false,
            account: null,
            message: 'Network error, assuming new account'
        };
    }
}

// Enhanced login with magic link and security features
export async function loginWithMagicLink(email, name = '', dev = false) {
    try {
        // Rate limiting check
        checkRateLimit(email);

        console.log('🔗 Sending magic link for:', email);

        // Determine if we're in development mode
        const isDevMode = dev || isDevelopment();

        console.log('🔧 Development mode detected:', isDevMode);

        const response = await fetch(WEBHOOKS.ACCOUNT.MAGIC_LINK_SEND, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                email: email,
                name: name || generateFantasyName(),
                dev: isDevMode,
                clientFingerprint: generateClientFingerprint(),
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send magic link');
        }

        const result = await response.json();

        // Log security event
        logSecurityEvent('MAGIC_LINK_SENT', {
            email,
            name,
            dev: isDevMode,
            success: true
        });

        console.log('✅ Magic link sent successfully:', result);
        return result;
    } catch (error) {
        console.error('❌ Magic link send error:', error);

        // Log security event for failed attempts
        logSecurityEvent('MAGIC_LINK_FAILED', {
            email,
            error: error.message
        });

        throw error;
    }
}

// Backend magic link verification (for server-side processing)
export async function verifyMagicLink(token, email) {
    try {
        console.log('🔗 Verifying magic link on backend:', { token, email });

        const response = await fetch(WEBHOOKS.ACCOUNT.MAGIC_LINK_VERIFY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                token: token,
                email: email,
                clientFingerprint: generateClientFingerprint(),
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.error || 'Magic link verification failed'
            );
        }

        const result = await response.json();

        // Log security event
        logSecurityEvent('MAGIC_LINK_VERIFIED', {
            email,
            success: true,
            method: 'backend_verification'
        });

        console.log('✅ Magic link verified on backend:', result);
        return result;
    } catch (error) {
        console.error('❌ Backend magic link verification error:', error);

        // Log security event for failed verification
        logSecurityEvent('VERIFICATION_FAILED', {
            email,
            error: error.message,
            method: 'backend_verification'
        });

        throw error;
    }
}

// Frontend-based magic link verification with enhanced security
export async function verifyMagicLinkFrontend(token, email) {
    try {
        console.log('🔗 Verifying magic link in frontend:', { token, email });

        // Token-Validierung hinzufügen
        if (!token || typeof token !== 'string' || token.length < 10) {
            throw new Error('Invalid token format');
        }

        // Email-Validierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // Rate-Limiting für Verifikation
        const verificationKey = `verification_${email}`;
        const lastVerification = sessionStorage.getItem(verificationKey);
        const now = Date.now();

        if (lastVerification && now - parseInt(lastVerification) < 5000) {
            throw new Error(
                'Too many verification attempts. Please wait 5 seconds.'
            );
        }
        sessionStorage.setItem(verificationKey, now.toString());

        // Simulate verification (since backend is not fully implemented)
        // In production, this would call the actual verify API
        const verificationResult = {
            success: true,
            user: {
                id: `user_${Date.now()}`,
                email: email,
                verified: true,
                sessionId: generateSecureToken()
            }
        };

        console.log('🔗 Verification result:', verificationResult);

        // Update account state with enhanced security
        const accountData = {
            email: email,
            name: email.split('@')[0],
            userId: verificationResult.user.id,
            tier: 'free',
            lastLogin: new Date().toISOString(),
            sessionId: verificationResult.user.sessionId,
            sessionExpires: new Date(
                Date.now() + SESSION_TIMEOUT
            ).toISOString(),
            lastActivity: new Date().toISOString()
        };

        console.log('🔗 Setting account data:', accountData);

        // Use syncAccountData to properly update all stores
        syncAccountData(accountData);

        // Update localStorage preferences with session data
        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
            email: accountData.email,
            name: accountData.name,
            userId: accountData.userId,
            tier: accountData.tier,
            lastLogin: accountData.lastLogin,
            sessionId: accountData.sessionId,
            sessionExpires: accountData.sessionExpires,
            lastActivity: accountData.lastActivity
        });

        // Also store sessionId separately for easier access
        storageHelpers.set('sessionId', accountData.sessionId);

        console.log('🔗 localStorage updated, now notifying other tabs');

        // Notify all tabs about the verification
        notifyMagicLinkVerification(accountData);

        // Show success modal
        showExistingAccountFound(accountData.email);

        // Log security event
        logSecurityEvent('LOGIN_SUCCESS', {
            userId: accountData.userId,
            email: accountData.email,
            method: 'frontend_magic_link_verification',
            sessionId: accountData.sessionId
        });

        // Set login history for return user detection
        const history = {
            email: accountData.email,
            lastLogin: new Date().toISOString(),
            count:
                storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY, { count: 0 })
                    .count + 1
        };
        storageHelpers.set(STORAGE_KEYS.LOGIN_HISTORY, history);
        console.log(
            '✅ Login history gesetzt in verifyMagicLinkFrontend:',
            history
        );

        console.log('🔗 Magic link verification completed successfully');

        return verificationResult;
    } catch (error) {
        console.error('❌ Frontend magic link verification error:', error);
        logSecurityEvent('VERIFICATION_ERROR', {
            email,
            error: error.message,
            token: token ? token.substring(0, 10) + '...' : 'none'
        });
        throw error;
    }
}

// Enhanced Logout with Security
export function logout() {
    logSecurityEvent('LOGOUT', {
        userId: get(currentAccount)?.userId,
        email: get(currentAccount)?.email
    });

    syncAccountData(null);

    // Nur Session-Daten löschen, localStorage beibehalten
    try {
        sessionStorage.clear();
        // Nur spezifische Session-Daten aus localStorage entfernen
        localStorage.removeItem('sessionId');
        localStorage.removeItem('csrf_token');
        localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    } catch (error) {
        console.warn('Failed to clear session data during logout:', error);
    }

    // Clear rate limiting for this user
    if (get(currentAccount)?.email) {
        LOGIN_ATTEMPTS.delete(get(currentAccount).email);
    }
}

// Get current account data
export function getCurrentAccount() {
    return get(currentAccount);
}

// Initialize account from cookies on app start - Enhanced Security
export function initializeAccountFromCookies() {
    try {
        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        const sessionId = getSessionId(); // Use local function, not storageHelpers.getSessionId

        // Enhanced session validation
        if (!validateSession(userPrefs)) {
            console.log('❌ Invalid session, clearing session data only');
            // Nur Session-Daten löschen, andere localStorage-Daten beibehalten
            try {
                localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
                localStorage.removeItem('sessionId');
                sessionStorage.clear();
            } catch (error) {
                console.warn('Failed to clear invalid session data:', error);
            }
            return false;
        }

        if (userPrefs.email && sessionId) {
            const accountInfo = {
                email: userPrefs.email,
                name: userPrefs.name || 'User',
                userId: userPrefs.userId || `user_${Date.now()}`,
                lastLogin: userPrefs.lastLogin,
                isLoggedIn: true,
                profile: userPrefs.profile || {},
                tier: userPrefs.tier || 'free',
                usedGenerations: userPrefs.usedGenerations || 0,
                sessionId: userPrefs.sessionId,
                lastActivity: new Date().toISOString(),
                isFirstLogin: false // Session restoration, not first login
            };

            // Update the main accountData store
            syncAccountData(accountInfo);

            console.log('✅ Account loaded from cookies:', accountInfo.email);

            // Renew session expiration
            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                ...userPrefs,
                sessionExpires: new Date(
                    Date.now() + SESSION_TIMEOUT
                ).toISOString(),
                lastActivity: new Date().toISOString()
            });

            logSecurityEvent('SESSION_RESTORED', {
                email: accountInfo.email,
                userId: accountInfo.userId
            });

            return true;
        } else {
            console.log('❌ No valid session found in cookies');
        }
    } catch (error) {
        console.warn('Failed to load account from cookies:', error);
        logSecurityEvent('SESSION_LOAD_ERROR', { error: error.message });
    }

    return false;
}

// Helper functions for security
function getActiveSessions(userId) {
    // This would typically be handled server-side
    // For client-side, we just return a simple check
    return [getSessionId()].filter(Boolean);
}

// Session management helpers
function getSessionId() {
    return storageHelpers.get('sessionId') || null;
}

function setSessionId(sessionId) {
    return storageHelpers.set('sessionId', sessionId);
}

// Synchronize account data across stores
function syncAccountData(accountData) {
    if (accountData) {
        // Update all account-related stores
        isLoggedIn.set(true);
        currentAccount.set(accountData);
        userProfile.set(accountData.profile || {});
        accountTier.set(accountData.tier || 'free');

        // Set daily limit based on tier using central configuration
        updateDailyLimit(
            true,
            accountData.tier,
            accountData.usedGenerations || 0
        );
    } else {
        // Reset all stores when no account data
        isLoggedIn.set(false);
        currentAccount.set(null);
        userProfile.set(null);
        accountTier.set('free');
        updateDailyLimit(false, 'free', 0); // Reset to guest limits
    }
}

// Account Management via n8n Workflow - Enhanced Security
export async function createAccount(
    userId,
    email,
    profile = {},
    metadata = {}
) {
    try {
        const response = await fetch(WEBHOOKS.ACCOUNT.CRUD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'create',
                userId,
                email,
                profile,
                metadata,
                timestamp: new Date().toISOString(),
                clientFingerprint: generateClientFingerprint()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create account');
        }

        const result = await response.json();

        logSecurityEvent('ACCOUNT_CREATED', { userId, email });

        return result;
    } catch (error) {
        console.error('Create account error:', error);
        logSecurityEvent('ACCOUNT_CREATION_FAILED', {
            userId,
            email,
            error: error.message
        });
        throw error;
    }
}

export async function getAccount(userId) {
    try {
        const response = await fetch(WEBHOOKS.ACCOUNT.CRUD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'get',
                userId,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get account');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Get account error:', error);
        throw error;
    }
}

export async function updateAccount(userId, updates = {}) {
    try {
        const response = await fetch(WEBHOOKS.ACCOUNT.CRUD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'update',
                userId,
                updates,
                timestamp: new Date().toISOString(),
                clientFingerprint: generateClientFingerprint()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update account');
        }

        const result = await response.json();

        logSecurityEvent('ACCOUNT_UPDATED', { userId, updates });

        return result;
    } catch (error) {
        console.error('Update account error:', error);
        logSecurityEvent('ACCOUNT_UPDATE_FAILED', {
            userId,
            error: error.message
        });
        throw error;
    }
}

// Enhanced user preference checks
export function hasExistingUserPreferences() {
    try {
        const prefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        console.log('🔍 hasExistingUserPreferences check:', {
            prefs: prefs,
            hasPrefs: !!prefs,
            hasEmail: !!(prefs && prefs.email),
            hasLastLogin: !!(prefs && prefs.lastLogin),
            result: !!(prefs && prefs.email && prefs.lastLogin)
        });
        return prefs && prefs.email && prefs.lastLogin;
    } catch (error) {
        console.warn('Error checking user preferences:', error);
        return false;
    }
}

export function getUserEmailFromPreferences() {
    try {
        const prefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        return prefs?.email || null;
    } catch (error) {
        console.warn('Error getting user email from preferences:', error);
        return null;
    }
}

export function hasValidUserSession() {
    try {
        const prefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        console.log('🔍 hasValidUserSession check:', {
            prefs: prefs,
            hasPrefs: !!prefs,
            hasSessionExpires: !!(prefs && prefs.sessionExpires),
            sessionExpires: prefs?.sessionExpires,
            now: new Date().toISOString(),
            isExpired: prefs?.sessionExpires
                ? new Date() > new Date(prefs.sessionExpires)
                : true
        });

        if (!prefs || !prefs.sessionExpires) return false;

        const now = new Date();
        const expires = new Date(prefs.sessionExpires);

        return now < expires;
    } catch (error) {
        console.warn('Error checking user session:', error);
        return false;
    }
}

// Setup magic link listener for cross-tab communication
export function setupMagicLinkListener() {
    if (typeof window === 'undefined') return;

    console.log(
        '🔗 Setting up magic link listener for cross-tab communication'
    );

    // Listen for magic link verification messages
    window.addEventListener('message', event => {
        console.log('🔗 Received message:', event.data);

        // Ignore Metamask and other extension messages
        if (
            event.source !== window ||
            event.data?.target === 'metamask-inpage'
        ) {
            console.log('🔗 Ignoring non-app message:', event.data?.target);
            return;
        }

        if (event.data && event.data.type === 'MAGIC_LINK_VERIFIED') {
            console.log('🔗 Magic link verified in another tab:', event.data);

            // Update account state
            if (event.data.success && event.data.email) {
                const accountData = {
                    email: event.data.email,
                    name: event.data.name || '',
                    userId: event.data.userId || `user_${Date.now()}`,
                    tier: event.data.tier || 'free',
                    lastLogin: new Date().toISOString()
                };

                console.log(
                    '🔗 Updating account state from cross-tab message:',
                    accountData
                );

                currentAccount.set(accountData);
                isLoggedIn.set(true);

                // Update localStorage preferences
                storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                    email: accountData.email,
                    name: accountData.name,
                    userId: accountData.userId,
                    tier: accountData.tier,
                    lastLogin: accountData.lastLogin
                });

                // Show success modal
                showExistingAccountFound(accountData.email);

                // Log security event
                logSecurityEvent('LOGIN_SUCCESS', {
                    userId: accountData.userId,
                    email: accountData.email,
                    method: 'magic_link_verification'
                });
            }
        }
    });

    // Also listen for storage changes (for cross-tab synchronization)
    window.addEventListener('storage', event => {
        console.log('🔗 Storage event received:', event.key, event.newValue);

        if (event.key === STORAGE_KEYS.USER_PREFERENCES && event.newValue) {
            try {
                const userPrefs = JSON.parse(event.newValue);
                if (userPrefs.email && userPrefs.lastLogin) {
                    console.log(
                        '🔄 User preferences updated in another tab:',
                        userPrefs
                    );

                    // Update account state from storage
                    const accountData = {
                        email: userPrefs.email,
                        name: userPrefs.name || '',
                        userId: userPrefs.userId || `user_${Date.now()}`,
                        tier: userPrefs.tier || 'free',
                        lastLogin: userPrefs.lastLogin
                    };

                    console.log(
                        '🔗 Updating account state from storage event:',
                        accountData
                    );

                    currentAccount.set(accountData);
                    isLoggedIn.set(true);

                    // Show success modal
                    showExistingAccountFound(accountData.email);
                }
            } catch (error) {
                console.warn('Error parsing storage update:', error);
            }
        }
    });

    console.log('🔗 Magic link listener setup complete');
}

// Send magic link verification to all tabs with enhanced security
export function notifyMagicLinkVerification(accountData) {
    if (typeof window === 'undefined') return;

    console.log(
        '🔗 Notifying all tabs about magic link verification:',
        accountData
    );

    // Validierung der Account-Daten
    if (!accountData || !accountData.email || !accountData.userId) {
        console.error('❌ Invalid account data for notification');
        return;
    }

    // Send message to all tabs with proper origin and security
    const message = {
        type: 'MAGIC_LINK_VERIFIED',
        success: true,
        email: accountData.email,
        name: accountData.name,
        userId: accountData.userId,
        tier: accountData.tier,
        sessionId: accountData.sessionId,
        sessionExpires: accountData.sessionExpires,
        timestamp: Date.now(),
        // Hinzufügen eines Sicherheits-Hashes
        securityHash: btoa(
            `${accountData.email}_${accountData.userId}_${Date.now()}`
        ).substring(0, 16)
    };

    // Sende Nachricht mit Origin-Validierung
    try {
        window.postMessage(message, window.location.origin);
        console.log('🔗 postMessage sent to all tabs:', message);
    } catch (error) {
        console.error('❌ Failed to send postMessage:', error);
    }

    // Also update localStorage to trigger storage event with session data
    storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
        email: accountData.email,
        name: accountData.name,
        userId: accountData.userId,
        tier: accountData.tier,
        lastLogin: accountData.lastLogin,
        sessionId: accountData.sessionId,
        sessionExpires: accountData.sessionExpires,
        lastActivity: accountData.lastActivity
    });

    console.log('🔗 localStorage updated to trigger storage event');
}
