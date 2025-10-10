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

                            // Extract createdAt from account data
                            const createdAt = getCreatedAtFromAccount(
                                result.account
                            );

                            console.log(
                                '🔍 DEBUG: Extracted createdAt:',
                                createdAt
                            );

                            const userPrefsData = {
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
                                        : result.account.metadata || {},
                                createdAt: createdAt // Add createdAt directly to userPrefsData
                            };

                            // Save to localStorage
                            storageHelpers.set(
                                STORAGE_KEYS.USER_PREFERENCES,
                                userPrefsData
                            );

                            // Save createdAt separately if found
                            if (createdAt) {
                                saveCreatedAtToUserPreferences(createdAt);
                            } else {
                                console.log(
                                    '⚠️ No createdAt found in account data'
                                );
                            }
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

        // CRITICAL: Load FULL account data from Google Sheets (including usageHistory!)
        console.log('📡 [LOGIN] Loading full account data from database...');
        try {
            const fullAccountResponse = await fetch(WEBHOOKS.ACCOUNT.READ, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    action: 'read',
                    userId: accountData.userId,
                    email: accountData.email
                })
            });

            if (fullAccountResponse.ok) {
                const fullAccountResult = await fullAccountResponse.json();
                console.log('✅ [LOGIN] Full account data loaded:', {
                    success: fullAccountResult.success,
                    hasAccount: !!fullAccountResult.account,
                    hasMetadata: !!fullAccountResult.account?.metadata,
                    hasUsageHistory: !!fullAccountResult.account?.metadata?.usageHistory
                });

                if (fullAccountResult.success && fullAccountResult.account) {
                    // Use FULL account data with usageHistory
                    accountData = {
                        ...accountData,
                        ...fullAccountResult.account,
                        // Preserve session data from verification
                        sessionId: accountData.sessionId,
                        sessionExpires: accountData.sessionExpires
                    };
                    console.log('✅ [LOGIN] Account data merged with full database data');
                    console.log('✅ [LOGIN] UsageHistory entries:', fullAccountResult.account?.metadata?.usageHistory?.length || 0);
                }
            } else {
                console.warn('⚠️ [LOGIN] Failed to load full account data, using verification data only');
            }
        } catch (error) {
            console.error('❌ [LOGIN] Error loading full account data:', error);
            console.log('💡 [LOGIN] Continuing with verification data only');
        }

        // Use syncAccountData to properly update all stores
        syncAccountData(accountData);

        // Update localStorage preferences with session data
        const createdAt =
            getCreatedAtFromAccount(verificationResult.account) ||
            accountData.createdAt;

        console.log(
            '🔍 DEBUG: Final createdAt for verifyMagicLinkFrontend:',
            createdAt
        );

        const userPrefsData = {
            email: accountData.email,
            name: accountData.name,
            userId: accountData.userId,
            tier: accountData.tier,
            lastLogin: accountData.lastLogin,
            sessionId: accountData.sessionId,
            sessionExpires: accountData.sessionExpires,
            lastActivity: accountData.lastActivity,
            profile: accountData.profile,
            metadata: accountData.metadata,
            createdAt: createdAt // Add createdAt directly to userPrefsData
        };

        // Save to localStorage
        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, userPrefsData);

        // Update lastLogin in Google Sheets via API
        try {
            console.log('📡 Updating lastLogin in database...');
            await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    userId: accountData.userId,
                    email: accountData.email,
                    profile: accountData.profile,
                    lastLogin: accountData.lastLogin, // Top-level lastLogin for Google Sheets
                    metadata: {
                        ...accountData.metadata,
                        lastLogin: accountData.lastLogin,
                        lastActivity: accountData.lastActivity,
                        sessionId: accountData.sessionId
                    }
                })
            });
            console.log('✅ lastLogin updated in database');
        } catch (error) {
            console.warn('⚠️ Failed to update lastLogin in database:', error);
            // Non-critical error, continue with login
        }

        // Save createdAt separately if found (for backward compatibility)
        if (createdAt) {
            saveCreatedAtToUserPreferences(createdAt);
        } else {
            console.log('⚠️ No createdAt found in verifyMagicLinkFrontend');
        }

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

// Flag to prevent multiple simultaneous session restores
let isRestoringSession = false;
let sessionRestored = false;

// Initialize account from cookies on app start - Enhanced Security
export async function initializeAccountFromCookies() {
    try {
        // Prevent multiple simultaneous calls
        if (isRestoringSession) {
            console.log('⏳ Session restore already in progress, skipping...');
            return sessionRestored;
        }

        if (sessionRestored) {
            console.log('✅ Session already restored, skipping...');
            return true;
        }

        isRestoringSession = true;

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
            isRestoringSession = false;
            return false;
        }

        if (userPrefs.email && sessionId) {
            // Get createdAt from user preferences ONLY
            const createdAt = getCreatedAtFromUserPreferences();

            // CRITICAL: Load FULL account data from database (not just from cookies!)
            console.log('📡 [SESSION RESTORE] Loading full account data from database...');
            let accountInfo = null;
            
            try {
                const fullAccountResponse = await fetch(WEBHOOKS.ACCOUNT.READ, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        action: 'read',
                        userId: userPrefs.userId,
                        email: userPrefs.email
                    })
                });

                if (fullAccountResponse.ok) {
                    const fullAccountResult = await fullAccountResponse.json();
                    console.log('✅ [SESSION RESTORE] Full account data loaded from database:', {
                        success: fullAccountResult.success,
                        hasAccount: !!fullAccountResult.account,
                        hasMetadata: !!fullAccountResult.account?.metadata,
                        hasUsageHistory: !!fullAccountResult.account?.metadata?.usageHistory,
                        usageHistoryLength: fullAccountResult.account?.metadata?.usageHistory?.length || 0
                    });

                    if (fullAccountResult.success && fullAccountResult.account) {
                        // Use FULL account data from database
                        accountInfo = {
                            ...fullAccountResult.account,
                            // Preserve session data from cookies
                            sessionId: userPrefs.sessionId,
                            sessionExpires: userPrefs.sessionExpires,
                            lastActivity: new Date().toISOString(),
                            isFirstLogin: false
                        };
                        console.log('✅ [SESSION RESTORE] Using full database data with usageHistory');
                    } else {
                        throw new Error('No account data in response');
                    }
                } else {
                    throw new Error(`API returned ${fullAccountResponse.status}`);
                }
            } catch (error) {
                console.warn('⚠️ [SESSION RESTORE] Failed to load from database, using cookies fallback:', error);
                // Fallback: Use data from cookies (without usageHistory)
                accountInfo = {
                    email: userPrefs.email,
                    name: userPrefs.name || 'User',
                    userId: userPrefs.userId || `user_${Date.now()}`,
                    lastLogin: userPrefs.lastLogin,
                    createdAt: createdAt,
                    isLoggedIn: true,
                    profile: userPrefs.profile || {},
                    metadata: userPrefs.metadata || {},
                    tier: userPrefs.tier || 'free',
                    usedGenerations: userPrefs.usedGenerations || 0,
                    sessionId: userPrefs.sessionId,
                    lastActivity: new Date().toISOString(),
                    isFirstLogin: false // Session restoration, not first login
                };
                console.log('💡 [SESSION RESTORE] Using cookies fallback (usageHistory may be missing)');
            }

            // Update the main accountData store
            syncAccountData(accountInfo);

            console.log('✅ Account loaded from cookies:', accountInfo.email);

            // Renew session expiration (localStorage only, DO NOT update database!)
            const updatedLastLogin = new Date().toISOString();
            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                ...userPrefs,
                sessionExpires: new Date(
                    Date.now() + SESSION_TIMEOUT
                ).toISOString(),
                lastActivity: updatedLastLogin
                // DO NOT update lastLogin here - session restore should NOT write to DB!
            });

            // CRITICAL FIX: Session restore should ONLY READ from database, NEVER WRITE!
            // This prevents overwriting user settings/metadata on page refresh
            console.log(
                '✅ Session restored (READ-ONLY, no database write):',
                {
                    userId: accountInfo.userId,
                    email: accountInfo.email,
                    action: 'READ_ONLY'
                }
            );

            // DO NOT send any updates to database on session restore!
            // User settings, dailyUsage, usageHistory must stay intact!
            // Only explicit user actions (like login, save settings) should write to DB.

            logSecurityEvent('SESSION_RESTORED', {
                email: accountInfo.email,
                userId: accountInfo.userId
            });

            sessionRestored = true;
            isRestoringSession = false;
            return true;
        } else {
            console.log('❌ No valid session found in cookies');
            isRestoringSession = false;
        }
    } catch (error) {
        console.warn('Failed to load account from cookies:', error);
        logSecurityEvent('SESSION_LOAD_ERROR', { error: error.message });
        isRestoringSession = false;
    }

    return false;
}

// Reset session restore flag (e.g., after logout)
export function resetSessionRestoreFlag() {
    isRestoringSession = false;
    sessionRestored = false;
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

// Centralized createdAt management
function getCreatedAtFromAccount(account) {
    if (!account) {
        console.log('⚠️ No account provided to getCreatedAtFromAccount');
        return null;
    }

    console.log('🔍 DEBUG: getCreatedAtFromAccount called with:', account);

    // Priority order for createdAt - ONLY use real createdAt from backend
    const possibleSources = [
        account.createdAt,
        account.metadata?.createdAt,
        account.profile?.createdAt
    ];

    console.log('🔍 DEBUG: Possible createdAt sources:', possibleSources);

    const foundCreatedAt =
        possibleSources.find(
            date => date && date !== 'null' && date !== 'undefined'
        ) || null;

    console.log('🔍 DEBUG: Final createdAt:', foundCreatedAt);
    return foundCreatedAt;
}

// Centralized function to save createdAt to user preferences
function saveCreatedAtToUserPreferences(createdAt) {
    if (!createdAt) {
        console.log('⚠️ No createdAt provided to save');
        return;
    }

    console.log('🔍 DEBUG: Saving createdAt to USER_PREFERENCES:', createdAt);

    const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    console.log('🔍 DEBUG: Current userPrefs:', userPrefs);

    const updatedPrefs = {
        ...userPrefs,
        createdAt: createdAt
    };

    console.log('🔍 DEBUG: Updated userPrefs:', updatedPrefs);

    const success = storageHelpers.set(
        STORAGE_KEYS.USER_PREFERENCES,
        updatedPrefs
    );

    if (success) {
        console.log('✅ createdAt saved to USER_PREFERENCES:', createdAt);
    } else {
        console.error('❌ Failed to save createdAt to USER_PREFERENCES');
    }
}

// Centralized function to get createdAt from user preferences
function getCreatedAtFromUserPreferences() {
    const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    const createdAt = userPrefs.createdAt || null;
    console.log('🔍 Retrieved createdAt from USER_PREFERENCES:', createdAt);
    return createdAt;
}

/**
 * Safe JSON parsing helper
 * Handles both strings and already-parsed objects
 */
function safeJSONParse(data, fallback = {}) {
    if (!data) return fallback;
    
    // Already an object? Return as-is
    if (typeof data === 'object' && data !== null) {
        return data;
    }
    
    // String? Try to parse
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.warn('⚠️ Failed to parse JSON:', error.message);
            return fallback;
        }
    }
    
    return fallback;
}

// Synchronize account data across stores
async function syncAccountData(accountData) {
    if (accountData) {
        console.log('🔄 [ACCOUNT DEBUG] syncAccountData: Raw data received:', {
            profileType: typeof accountData.profile,
            metadataType: typeof accountData.metadata,
            hasUserId: !!accountData.userId,
            userId: accountData.userId,
            email: accountData.email
        });

        // CRITICAL: Parse JSON strings from n8n/Google Sheets
        const parsedProfile = safeJSONParse(accountData.profile, {});
        const parsedMetadata = safeJSONParse(accountData.metadata, {});
        
        console.log('✅ [ACCOUNT DEBUG] Parsed data:', {
            profile: parsedProfile,
            metadata: {
                hasSettings: !!parsedMetadata.settings,
                hasDailyUsage: !!parsedMetadata.dailyUsage,
                hasUsageHistory: !!parsedMetadata.usageHistory,
                usageHistoryType: typeof parsedMetadata.usageHistory,
                usageHistoryIsArray: Array.isArray(parsedMetadata.usageHistory),
                usageHistoryLength: parsedMetadata.usageHistory?.length || 0,
                firstEntry: parsedMetadata.usageHistory?.[0],
                lastEntry: parsedMetadata.usageHistory?.[parsedMetadata.usageHistory?.length - 1]
            }
        });

        // Create clean account object with parsed data
        const cleanAccountData = {
            ...accountData,
            profile: parsedProfile,
            metadata: parsedMetadata
        };

        // Ensure createdAt is present - get from localStorage if not in accountData
        if (!cleanAccountData.createdAt) {
            const userPrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES,
                {}
            );
            if (userPrefs.createdAt) {
                cleanAccountData.createdAt = userPrefs.createdAt;
                console.log(
                    '🔄 syncAccountData: Added createdAt from localStorage:',
                    cleanAccountData.createdAt
                );
            }
        }

        // Update all account-related stores with PARSED data
        isLoggedIn.set(true);
        currentAccount.set(cleanAccountData);
        userProfile.set(parsedProfile);
        accountTier.set(cleanAccountData.tier || 'free');

        // Initialize daily usage from API + localStorage
        try {
            const { initializeDailyUsage } = await import('./dailyUsageStore.js');
            await initializeDailyUsage();
            console.log('✅ Daily usage initialized from API/localStorage');
        } catch (error) {
            console.warn('⚠️ Failed to initialize daily usage, using fallback:', error);
            // Fallback to old method (use parsedMetadata)
            updateDailyLimit(
                true,
                cleanAccountData.tier,
                parsedMetadata?.dailyUsage?.used || cleanAccountData.usedGenerations || 0
            );
        }

        console.log(
            '✅ [ACCOUNT DEBUG] syncAccountData: Account synced with createdAt:',
            cleanAccountData.createdAt
        );
        console.log(
            '✅ [ACCOUNT DEBUG] syncAccountData: UsageHistory entries:',
            parsedMetadata?.usageHistory?.length || 0
        );
        console.log(
            '✅ [ACCOUNT DEBUG] syncAccountData: Complete metadata structure:',
            {
                settings: !!parsedMetadata?.settings,
                dailyUsage: !!parsedMetadata?.dailyUsage,
                usageHistory: !!parsedMetadata?.usageHistory,
                usageHistoryLength: parsedMetadata?.usageHistory?.length
            }
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
