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
        details,
        // Accounting-spezifische Felder
        accountingEvent:
            event.startsWith('ACCOUNT_') || event.startsWith('PAYMENT_'),
        sessionId: getSessionId(),
        userId: details?.userId || get(currentAccount)?.userId,
        email: details?.email || get(currentAccount)?.email
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

// Accounting-spezifische Sicherheitsprotokollierung
function logAccountingEvent(event, details) {
    const accountingDetails = {
        ...details,
        event: event, // Add event field for n8n compatibility
        accountingType: 'account_management',
        timestamp: new Date().toISOString(),
        clientFingerprint: generateClientFingerprint(),
        sessionId: getSessionId(),
        userId: details?.userId || get(currentAccount)?.userId,
        email: details?.email || get(currentAccount)?.email,
        tier: details?.tier || get(currentAccount)?.tier || 'free',
        action: event
    };

    console.log('💰 Accounting Event:', accountingDetails);

    // Log to n8n accounting audit log webhook (auch in Development für Testing)
    if (typeof window !== 'undefined') {
        fetch(WEBHOOKS.ACCOUNTING.AUDIT_LOG, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accountingDetails)
        }).catch(error => {
            console.warn('Failed to log accounting event to n8n:', error);
        });
    }

    // Also log as security event
    logSecurityEvent(`ACCOUNTING_${event}`, accountingDetails);
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

        // First try n8n webhook
        try {
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

            if (response.ok) {
                const responseText = await response.text();
                console.log('🔍 Raw n8n response:', responseText);

                if (responseText && responseText.trim()) {
                    try {
                        const result = JSON.parse(responseText);
                        console.log('✅ n8n account check result:', result);

                        // If account exists in n8n, also update localStorage
                        if (result.exists && result.account) {
                            console.log(
                                '🔄 Syncing n8n account data to localStorage'
                            );
                            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                                email: result.account.email,
                                name:
                                    result.account.name || email.split('@')[0],
                                userId:
                                    result.account.userId ||
                                    `user_${Date.now()}`,
                                tier: result.account.tier || 'free',
                                lastLogin:
                                    result.account.lastLogin ||
                                    new Date().toISOString(),
                                profile:
                                    typeof result.account.profile === 'string'
                                        ? JSON.parse(result.account.profile)
                                        : result.account.profile || {},
                                metadata:
                                    typeof result.account.metadata === 'string'
                                        ? JSON.parse(result.account.metadata)
                                        : result.account.metadata || {}
                            });
                        }

                        return result;
                    } catch (parseError) {
                        console.log(
                            '❌ Failed to parse n8n response as JSON:',
                            parseError
                        );
                        throw new Error('Invalid JSON response from n8n');
                    }
                } else {
                    console.log('❌ Empty response from n8n webhook');
                    throw new Error('Empty response from n8n webhook');
                }
            } else {
                console.log('❌ n8n webhook returned status:', response.status);
                throw new Error(
                    `n8n webhook returned status: ${response.status}`
                );
            }
        } catch (webhookError) {
            console.log(
                '❌ n8n webhook failed, using localStorage fallback:',
                webhookError.message
            );
        }

        // Fallback: Check localStorage for existing accounts
        console.log('🔍 Using localStorage fallback for account check');
        const existingPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);

        if (
            existingPrefs &&
            existingPrefs.email &&
            existingPrefs.email.toLowerCase() === email.toLowerCase()
        ) {
            console.log('✅ Found existing account in localStorage');
            return {
                success: true,
                exists: true,
                account: existingPrefs,
                message: 'Account found in localStorage'
            };
        }

        // No account found
        console.log('❌ No account found in localStorage');
        return {
            success: true,
            exists: false,
            account: null,
            message: 'No account found (localStorage fallback)'
        };
    } catch (error) {
        console.error('❌ Account check error:', error);
        // Final fallback for any errors
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

        // Check if account already exists before creating
        console.log(
            '🔍 Checking if account already exists for magic link verification...'
        );
        const accountCheck = await checkAccountExists(
            email,
            email.split('@')[0]
        );

        let verificationResult;

        if (accountCheck.exists) {
            console.log('✅ Account already exists, using existing account');
            // Use existing account data from n8n or localStorage
            verificationResult = {
                success: true,
                account: accountCheck.account,
                message: 'Account already exists'
            };
        } else {
            // Create new account only if it doesn't exist
            console.log(
                '🔒 Creating new account via n8n secure accounting workflow...'
            );

            try {
                const response = await fetch(WEBHOOKS.ACCOUNT.SECURE_CREATE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        action: 'create',
                        userId: `user_${Date.now()}`,
                        email: email,
                        profile: {
                            name: email.split('@')[0]
                        },
                        metadata: {
                            source: 'magic_link_verification',
                            tier: 'free',
                            token: token.substring(0, 10) + '...' // Log partial token for security
                        },
                        timestamp: new Date().toISOString(),
                        clientFingerprint: generateClientFingerprint()
                    })
                });

                if (!response.ok) {
                    const responseText = await response.text();
                    console.log('🔍 Raw n8n error response:', responseText);

                    let errorMessage = 'Failed to verify magic link via n8n';
                    if (responseText && responseText.trim()) {
                        try {
                            const errorData = JSON.parse(responseText);
                            errorMessage = errorData.error || errorMessage;
                        } catch (parseError) {
                            console.log(
                                '❌ Failed to parse error response as JSON:',
                                parseError
                            );
                        }
                    }
                    throw new Error(errorMessage);
                }

                const responseText = await response.text();
                console.log('🔍 Raw n8n verification response:', responseText);

                if (responseText && responseText.trim()) {
                    try {
                        verificationResult = JSON.parse(responseText);
                    } catch (parseError) {
                        console.log(
                            '❌ Failed to parse verification response as JSON:',
                            parseError
                        );
                        throw new Error(
                            'Invalid JSON response from n8n verification'
                        );
                    }
                } else {
                    console.log(
                        '❌ Empty response from n8n verification webhook'
                    );
                    throw new Error(
                        'Empty response from n8n verification webhook'
                    );
                }
            } catch (n8nError) {
                console.log(
                    '❌ n8n account creation failed, using localStorage fallback:',
                    n8nError.message
                );

                // Fallback: Create account in localStorage
                const fallbackAccount = {
                    email: email,
                    name: email.split('@')[0],
                    userId: `user_${Date.now()}`,
                    tier: 'free',
                    lastLogin: new Date().toISOString(),
                    profile: { name: email.split('@')[0] },
                    metadata: {
                        source: 'magic_link_verification_fallback',
                        tier: 'free'
                    }
                };

                verificationResult = {
                    success: true,
                    account: fallbackAccount,
                    message: 'Account created in localStorage (n8n fallback)'
                };
            }
        }

        console.log('🔒 n8n verification result:', verificationResult);

        console.log('🔗 Verification result:', verificationResult);

        // Extract account data from n8n response or localStorage fallback
        const accountData = {
            email: email,
            name: verificationResult.account?.name || email.split('@')[0],
            userId: verificationResult.account?.userId || `user_${Date.now()}`,
            tier: verificationResult.account?.tier || 'free',
            lastLogin: new Date().toISOString(),
            sessionId: generateSecureToken(),
            sessionExpires: new Date(
                Date.now() + SESSION_TIMEOUT
            ).toISOString(),
            lastActivity: new Date().toISOString(),
            profile: verificationResult.account?.profile || {
                name: email.split('@')[0]
            },
            metadata: verificationResult.account?.metadata || {
                source: 'magic_link_verification',
                tier: 'free'
            }
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
            lastActivity: accountData.lastActivity,
            profile: accountData.profile,
            metadata: accountData.metadata
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

// Sichere Accounting-Validierung
function validateAccountingOperation(operation, data) {
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };

    // 1. Grundlegende Validierung
    if (!operation || typeof operation !== 'string') {
        validation.isValid = false;
        validation.errors.push('Invalid operation type');
    }

    if (!data || typeof data !== 'object') {
        validation.isValid = false;
        validation.errors.push('Invalid data format');
    }

    // 2. Session-Validierung (nur für Operationen, die eine Session benötigen)
    const sessionId = getSessionId();
    const operationsRequiringSession = ['UPDATE_ACCOUNT', 'GET_ACCOUNT'];

    if (operationsRequiringSession.includes(operation) && !sessionId) {
        validation.isValid = false;
        validation.errors.push('No valid session found');
    }

    // 3. Client-Fingerprint Validierung
    const clientFingerprint = generateClientFingerprint();
    if (!clientFingerprint) {
        validation.warnings.push('Client fingerprint generation failed');
    }

    // 4. Rate Limiting für Accounting-Operationen
    const accountingKey = `accounting_${operation}_${
        get(currentAccount)?.email || 'anonymous'
    }`;
    const lastOperation = sessionStorage.getItem(accountingKey);
    const now = Date.now();

    if (lastOperation && now - parseInt(lastOperation) < 1000) {
        validation.isValid = false;
        validation.errors.push('Accounting operation rate limit exceeded');
    }

    // 5. Daten-Integrität prüfen
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        validation.isValid = false;
        validation.errors.push('Invalid email format');
    }

    if (data.userId && typeof data.userId !== 'string') {
        validation.isValid = false;
        validation.errors.push('Invalid user ID format');
    }

    // 6. Tier-Validierung
    const validTiers = ['free', 'pro', 'guest'];
    if (data.tier && !validTiers.includes(data.tier)) {
        validation.isValid = false;
        validation.errors.push('Invalid account tier');
    }

    // Log validation result
    console.log('🔍 Accounting Validation:', {
        operation,
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings,
        timestamp: new Date().toISOString()
    });

    // Set rate limit if validation passes
    if (validation.isValid) {
        sessionStorage.setItem(accountingKey, now.toString());
    }

    return validation;
}

// Sichere Accounting-Operation mit Validierung
async function secureAccountingOperation(operation, data) {
    console.log('🔒 Starting secure accounting operation:', operation);

    // 1. Validierung
    const validation = validateAccountingOperation(operation, data);
    if (!validation.isValid) {
        const error = new Error(
            `Accounting validation failed: ${validation.errors.join(', ')}`
        );
        logAccountingEvent('VALIDATION_FAILED', {
            operation,
            errors: validation.errors,
            warnings: validation.warnings
        });
        throw error;
    }

    // 2. Log start of operation
    logAccountingEvent('OPERATION_STARTED', {
        operation,
        data: { ...data, password: '[REDACTED]' } // Never log passwords
    });

    try {
        // 3. Execute operation based on type
        let result;
        switch (operation) {
            case 'CREATE_ACCOUNT':
                result = await createAccount(
                    data.userId,
                    data.email,
                    data.profile,
                    data.metadata
                );
                break;
            case 'UPDATE_ACCOUNT':
                result = await updateAccount(data.userId, data.updates);
                break;
            case 'GET_ACCOUNT':
                result = await getAccount(data.userId);
                break;
            case 'LOGIN':
                result = await loginWithMagicLink(
                    data.email,
                    data.name,
                    data.dev
                );
                break;
            case 'VERIFY_LOGIN':
                result = await verifyMagicLinkFrontend(data.token, data.email);
                break;
            default:
                throw new Error(`Unknown accounting operation: ${operation}`);
        }

        // 4. Log successful operation
        logAccountingEvent('OPERATION_SUCCESS', {
            operation,
            result: { success: true, userId: result?.userId || data.userId }
        });

        return result;
    } catch (error) {
        // 5. Log failed operation
        logAccountingEvent('OPERATION_FAILED', {
            operation,
            error: error.message,
            userId: data.userId
        });
        throw error;
    }
}

// Export secure accounting functions
export {
    secureAccountingOperation,
    logAccountingEvent,
    validateAccountingOperation
};

// Secure wrapper functions for existing API
export async function secureCreateAccount(
    userId,
    email,
    profile = {},
    metadata = {}
) {
    return secureAccountingOperation('CREATE_ACCOUNT', {
        userId,
        email,
        profile,
        metadata
    });
}

export async function secureUpdateAccount(userId, updates = {}) {
    return secureAccountingOperation('UPDATE_ACCOUNT', {
        userId,
        updates
    });
}

export async function secureGetAccount(userId) {
    return secureAccountingOperation('GET_ACCOUNT', {
        userId
    });
}

export async function secureLoginWithMagicLink(email, name = '', dev = false) {
    return secureAccountingOperation('LOGIN', {
        email,
        name,
        dev
    });
}

export async function secureVerifyMagicLink(token, email) {
    return secureAccountingOperation('VERIFY_LOGIN', {
        token,
        email
    });
}
