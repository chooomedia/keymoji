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
} from 'stores/appStores';
import { showExistingAccountFound, showNewAccountCreated } from './modalStore';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';
import { WEBHOOKS } from '../config/api.js';
import { isDevelopment } from '../utils/environment';
import {
    cachedFetchAccount,
    invalidateCachePattern,
    initializeCache,
    clearAllCache
} from '../utils/apiCache';
import { generateClientFingerprint } from '../utils/sharedHelpers';

// Security constants
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_SESSIONS_PER_USER = 3;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Rate limiting storage
const LOGIN_ATTEMPTS = new Map();

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
    // NOTE: Backend endpoint /api/security/log doesn't exist yet, so we silently skip it
    // This is expected behavior - security events are logged to console for now
    // TODO: Create backend endpoint or use n8n webhook for security logging
    if (
        false && // Disabled until backend endpoint is created
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost'
    ) {
        // Send to security monitoring service (disabled - endpoint doesn't exist)
        fetch('/api/security/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(securityLog)
        }).catch(error => {
            // Silent - endpoint doesn't exist, this is expected
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
    console.log('🔍 [SESSION VALIDATION] Checking session...', {
        hasData: !!sessionData,
        hasEmail: !!sessionData?.email,
        hasSessionExpires: !!sessionData?.sessionExpires,
        sessionExpires: sessionData?.sessionExpires
    });

    if (!sessionData) {
        console.log('❌ [SESSION VALIDATION] No session data');
        return false;
    }

    // Require email as minimum
    if (!sessionData.email) {
        console.log('❌ [SESSION VALIDATION] No email in session data');
        return false;
    }

    // If sessionExpires is not present, assume session is valid (for backward compatibility)
    if (!sessionData.sessionExpires) {
        console.log(
            '⚠️ [SESSION VALIDATION] No sessionExpires found, assuming valid session (backward compat)'
        );
        return true;
    }

    const now = new Date();
    const expires = new Date(sessionData.sessionExpires);

    console.log('🕐 [SESSION VALIDATION] Time check:', {
        now: now.toISOString(),
        expires: expires.toISOString(),
        isExpired: now > expires,
        timeUntilExpiry: Math.floor((expires - now) / 1000 / 60) + ' minutes'
    });

    // Check if session is expired
    if (now > expires) {
        console.log('❌ [SESSION VALIDATION] Session expired');
        logSecurityEvent('SESSION_EXPIRED', { userId: sessionData.userId });
        return false;
    }

    // Check for suspicious activity (multiple sessions)
    const activeSessions = getActiveSessions(sessionData.userId);
    if (activeSessions.length > MAX_SESSIONS_PER_USER) {
        console.log(
            '❌ [SESSION VALIDATION] Too many active sessions:',
            activeSessions.length
        );
        logSecurityEvent('SUSPICIOUS_ACTIVITY', {
            userId: sessionData.userId,
            sessionCount: activeSessions.length
        });
        return false;
    }

    console.log('✅ [SESSION VALIDATION] Session is valid');
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

// Account stores - use currentAccount from './appStores' instead of redundant accountData
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

                            // Parse account data if it's a string (n8n returns double-escaped JSON!)
                            const parsedAccount = safeJSONParse(
                                result.account,
                                {}
                            );
                            console.log(
                                '🔍 DEBUG: Parsed account data:',
                                parsedAccount
                            );

                            // Parse nested JSON fields (profile and metadata might be strings!)
                            const parsedProfile = safeJSONParse(
                                parsedAccount.profile,
                                {}
                            );
                            const parsedMetadata = safeJSONParse(
                                parsedAccount.metadata,
                                {}
                            );

                            console.log('🔍 DEBUG: Parsed nested fields:', {
                                profileType: typeof parsedAccount.profile,
                                metadataType: typeof parsedAccount.metadata,
                                hasCreatedAtInAccount:
                                    !!parsedAccount.createdAt,
                                hasCreatedAtInProfile:
                                    !!parsedProfile.createdAt,
                                hasCreatedAtInMetadata:
                                    !!parsedMetadata.createdAt
                            });

                            // Extract createdAt from all possible locations
                            const createdAt =
                                parsedAccount.createdAt ||
                                parsedProfile.createdAt ||
                                parsedMetadata.createdAt ||
                                parsedAccount.created_at || // Alternative naming
                                parsedProfile.created_at ||
                                parsedMetadata.created_at ||
                                getCreatedAtFromAccount(parsedAccount) ||
                                null;

                            console.log(
                                '🔍 DEBUG: Extracted createdAt:',
                                createdAt
                            );

                            const userPrefsData = {
                                email: parsedAccount.email || email,
                                name:
                                    parsedAccount.name ||
                                    parsedProfile.name ||
                                    email.split('@')[0],
                                userId:
                                    parsedAccount.userId ||
                                    `user_${Date.now()}`,
                                tier: parsedAccount.tier || 'free',
                                lastLogin:
                                    parsedAccount.lastLogin ||
                                    new Date().toISOString(),
                                profile: parsedProfile,
                                metadata: parsedMetadata,
                                // CRITICAL: Only use createdAt from backend - no fallback on check!
                                createdAt: createdAt || null // Don't create new createdAt on account check!
                            };

                            if (!userPrefsData.createdAt) {
                                console.warn(
                                    '⚠️ [CHECK] No createdAt found in account data - will not overwrite existing value'
                                );
                            }

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

// Backend OTP code verification (calls Vercel API → n8n)
export async function verifyOTPCode(code, email) {
    try {
        console.log('🔑 Verifying OTP code on backend:', { email });

        const response = await fetch(WEBHOOKS.ACCOUNT.MAGIC_LINK_VERIFY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                code: code,
                email: email,
                clientFingerprint: generateClientFingerprint(),
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'OTP verification failed');
        }

        const result = await response.json();

        logSecurityEvent('OTP_VERIFIED', {
            email,
            success: true,
            method: 'backend_verification'
        });

        console.log('✅ OTP verified on backend:', { email, success: result.success });
        return result;
    } catch (error) {
        console.error('❌ Backend OTP verification error:', error);
        logSecurityEvent('VERIFICATION_FAILED', {
            email,
            error: error.message,
            method: 'otp_verification'
        });
        throw error;
    }
}

// Frontend OTP verification: validates code via backend, then handles account creation/login
export async function verifyMagicLinkFrontend(code, email) {
    try {
        console.log('🔑 Verifying OTP code in frontend:', { email });

        // Code-Validierung: genau 7 Ziffern
        const cleanCode = String(code || '').trim();
        if (!/^\d{7}$/.test(cleanCode)) {
            throw new Error('Bitte gib den 7-stelligen Code aus deiner E-Mail ein.');
        }

        // Email-Validierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // Rate-Limiting für Verifikation (5 Sekunden Cooldown)
        const verificationKey = `verification_${email}`;
        const lastVerification = sessionStorage.getItem(verificationKey);
        const now = Date.now();

        if (lastVerification && now - parseInt(lastVerification) < 5000) {
            throw new Error('Too many verification attempts. Please wait 5 seconds.');
        }
        sessionStorage.setItem(verificationKey, now.toString());

        // OTP gegen Backend validieren (Vercel → n8n)
        const otpResult = await verifyOTPCode(cleanCode, email);
        if (!otpResult?.success) {
            throw new Error(otpResult?.error || 'Invalid or expired code');
        }

        // Ab hier: Code ist gültig — weiter mit Account-Login/Erstellung
        // Den sessionToken als "token" weiterreichen damit der restliche Flow unverändert bleibt
        const token = otpResult.sessionToken;

        // Check if account already exists before creating
        console.log(
            '🔍 Checking if account already exists for magic link verification...'
        );
        const accountCheck = await checkAccountExists(
            email,
            email.split('@')[0]
        );

        // CRITICAL: Track if account is new or existing for correct modal display
        let isNewAccount = !accountCheck.exists;

        let verificationResult;

        if (accountCheck.exists) {
            console.log('✅ Account already exists, using existing account');
            // Parse account data if it's a string
            const parsedAccount = safeJSONParse(
                accountCheck.account,
                accountCheck.account
            );
            console.log('🔍 DEBUG: Parsed existing account:', parsedAccount);

            // Use existing account data from n8n or localStorage
            verificationResult = {
                success: true,
                account: parsedAccount,
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

                            // CRITICAL: If account already exists error, try to get existing account
                            if (
                                errorMessage.includes('already exists') ||
                                errorMessage.includes('Account already exists')
                            ) {
                                console.log(
                                    '⚠️ Account already exists, trying to fetch existing account...'
                                );
                                // CRITICAL: Account exists, so it's not a new account!
                                isNewAccount = false;

                                const existingCheck = await checkAccountExists(
                                    email,
                                    email.split('@')[0]
                                );
                                if (
                                    existingCheck.exists &&
                                    existingCheck.account
                                ) {
                                    console.log(
                                        '✅ Found existing account, using it instead'
                                    );
                                    const parsedAccount = safeJSONParse(
                                        existingCheck.account,
                                        existingCheck.account
                                    );
                                    verificationResult = {
                                        success: true,
                                        account: parsedAccount,
                                        message:
                                            'Account already exists, using existing account'
                                    };
                                    // Build accountData from existing account
                                    // CRITICAL: createdAt ONLY from backend - never create new on login!
                                    accountData = {
                                        email: parsedAccount.email || email,
                                        userId:
                                            parsedAccount.userId ||
                                            `user_${Date.now()}`,
                                        name:
                                            parsedAccount.name ||
                                            parsedAccount.profile?.name ||
                                            email.split('@')[0],
                                        tier: parsedAccount.tier || 'free',
                                        lastLogin: new Date().toISOString(),
                                        profile: parsedAccount.profile || {},
                                        metadata: parsedAccount.metadata || {},
                                        // CRITICAL: Only use createdAt from backend - no fallback!
                                        createdAt:
                                            parsedAccount.createdAt ||
                                            getCreatedAtFromAccount(
                                                parsedAccount
                                            ) ||
                                            null
                                    };

                                    if (!accountData.createdAt) {
                                        console.warn(
                                            '⚠️ [LOGIN] No createdAt found in existing account - preserving existing value'
                                        );
                                    } else {
                                        console.log(
                                            '✅ [LOGIN] Using createdAt from existing account:',
                                            accountData.createdAt
                                        );
                                    }
                                    // Skip rest of account creation - jump to account data processing
                                    // We'll handle this after the try-catch block
                                } else {
                                    throw new Error(errorMessage);
                                }
                            } else {
                                throw new Error(errorMessage);
                            }
                        } catch (parseError) {
                            console.log(
                                '❌ Failed to parse error response as JSON:',
                                parseError
                            );
                        }
                    }

                    // Only throw if we didn't handle the "already exists" case
                    if (!verificationResult) {
                        throw new Error(errorMessage);
                    }
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
        // CRITICAL: Extract createdAt FIRST from verificationResult (backend) - NEVER create new on login!
        const backendCreatedAt =
            verificationResult.account?.createdAt ||
            getCreatedAtFromAccount(verificationResult.account) ||
            null;

        console.log(
            '🔍 [LOGIN] Extracted createdAt from verificationResult:',
            backendCreatedAt
        );

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
            },
            // CRITICAL: createdAt ONLY from backend - never create new on login!
            createdAt: backendCreatedAt || null
        };

        if (!accountData.createdAt) {
            console.warn(
                '⚠️ [LOGIN] No createdAt in verificationResult - will try to get from full account data or preserve existing'
            );
        } else {
            console.log(
                '✅ [LOGIN] Using createdAt from verificationResult:',
                accountData.createdAt
            );
        }

        console.log('🔗 Setting account data:', accountData);

        // CRITICAL: Load FULL account data from Google Sheets (including usageHistory!)
        // Use cached fetch to prevent 429 errors!
        console.log(
            '📡 [LOGIN] Loading full account data from database (cached)...'
        );
        try {
            // Skip API call on localhost (Vercel functions don't run locally!)
            const isLocalhost =
                typeof window !== 'undefined' &&
                (window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1');

            if (isLocalhost) {
                console.log(
                    '⚠️ [LOGIN] Localhost detected - skipping API call, using verification data only'
                );
                throw new Error('Localhost: API not available');
            }

            const fullAccountResult = await cachedFetchAccount(
                accountData.userId,
                accountData.email,
                'get' // CRITICAL: Use 'get' not 'read' for n8n webhook!
            );

            console.log('✅ [LOGIN] Full account data loaded (cached):', {
                success: fullAccountResult.success,
                hasAccount: !!fullAccountResult.account,
                hasMetadata: !!fullAccountResult.account?.metadata,
                hasUsageHistory:
                    !!fullAccountResult.account?.metadata?.usageHistory
            });

            if (fullAccountResult.success && fullAccountResult.account) {
                // Parse the full account data from backend
                // CRITICAL: fullAccountResult.account is already an object (not a string)
                // The n8n webhook returns: { success: true, account: { createdAt: "...", ... } }
                const parsedFullAccount = safeJSONParse(
                    fullAccountResult.account,
                    fullAccountResult.account
                );
                console.log('🔍 DEBUG: Parsed full account from backend:', {
                    hasCreatedAt: !!parsedFullAccount.createdAt,
                    createdAt: parsedFullAccount.createdAt,
                    createdAtType: typeof parsedFullAccount.createdAt,
                    rawAccountCreatedAt: fullAccountResult.account?.createdAt,
                    hasDailyUsage: !!parsedFullAccount.dailyUsage,
                    hasMetadata: !!parsedFullAccount.metadata,
                    hasProfile: !!parsedFullAccount.profile
                });

                // Use FULL account data with usageHistory
                // CRITICAL: createdAt priority: 1. Backend (if exists), 2. Existing accountData, 3. localStorage (preserve!)
                const existingCreatedAt =
                    accountData.createdAt ||
                    (() => {
                        const existingPrefs = storageHelpers.get(
                            STORAGE_KEYS.USER_PREFERENCES,
                            {}
                        );
                        return existingPrefs.createdAt || null;
                    })();

                accountData = {
                    ...accountData,
                    ...parsedFullAccount,
                    // CRITICAL: Only use backend createdAt if it exists, otherwise preserve existing!
                    createdAt: parsedFullAccount.createdAt || existingCreatedAt,
                    // Preserve session data from verification
                    sessionId: accountData.sessionId,
                    sessionExpires: accountData.sessionExpires,
                    lastActivity: accountData.lastActivity
                };
                console.log(
                    '✅ [LOGIN] Account data merged with full database data'
                );
                console.log(
                    '✅ [LOGIN] UsageHistory entries:',
                    parsedFullAccount?.metadata?.usageHistory?.length || 0
                );
                console.log(
                    '✅ [LOGIN] CreatedAt from backend (FINAL):',
                    accountData.createdAt
                );
            } else {
                console.warn(
                    '⚠️ [LOGIN] Failed to load full account data, using verification data only'
                );
            }
        } catch (error) {
            // The Vercel proxy (its.keymoji.wtf) allows localhost:8080 via CORS.
            // If this fails, log and continue — don't retry via direct n8n (CORS blocked).
            console.warn('⚠️ [LOGIN] Error loading full account data, continuing with available data:', error.message);
        }

        // CRITICAL: Extract createdAt BEFORE syncAccountData to preserve it!
        // Priority: 1. accountData.createdAt (from API), 2. getCreatedAtFromAccount, 3. localStorage (PRESERVE!), 4. null
        let createdAt =
            accountData.createdAt || // First: from merged backend data (highest priority!)
            getCreatedAtFromAccount(accountData) || // Second: extract from account structure
            null; // Will check localStorage next

        // If still not found, try localStorage as last resort (PRESERVE existing!)
        if (!createdAt) {
            const userPrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES,
                {}
            );
            createdAt = userPrefs.createdAt || null;
            if (createdAt) {
                console.log(
                    '🔍 [LOGIN] Using createdAt from localStorage (preserved):',
                    createdAt
                );
                // CRITICAL: Update accountData with preserved createdAt BEFORE syncAccountData!
                accountData.createdAt = createdAt;
            } else {
                console.warn(
                    '⚠️ [LOGIN] No createdAt found anywhere - will not create new one'
                );
            }
        }

        // CRITICAL: Ensure accountData has createdAt before syncing!
        if (createdAt && !accountData.createdAt) {
            accountData.createdAt = createdAt;
        }

        // Use syncAccountData to properly update all stores (now with preserved createdAt!)
        syncAccountData(accountData);

        console.log(
            '🔍 DEBUG: Final createdAt for verifyMagicLinkFrontend:',
            createdAt ||
                'NOT FOUND - will not be set (preserves existing value)'
        );

        // CRITICAL: Initialize settings immediately after account sync
        // This ensures settings are loaded from account.metadata.settings right after login
        console.log(
            '⚙️ [LOGIN] Initializing user settings after account sync...'
        );
        try {
            const { initializeSettingsForUser } = await import(
                './userSettingsStore.js'
            );
            await initializeSettingsForUser();
            console.log('✅ [LOGIN] User settings initialized successfully');
        } catch (error) {
            console.warn(
                '⚠️ [LOGIN] Failed to initialize settings (non-critical):',
                error
            );
            // Non-critical - settings will be loaded later via refreshUserSettings
        }

        // CRITICAL: Get existing createdAt from localStorage BEFORE building userPrefsData!
        // This ensures we NEVER lose existing createdAt even if backend doesn't provide it
        const existingPrefs = storageHelpers.get(
            STORAGE_KEYS.USER_PREFERENCES,
            {}
        );
        const finalCreatedAt = createdAt || existingPrefs.createdAt || null;

        if (!finalCreatedAt) {
            console.warn(
                '⚠️ [LOGIN] No createdAt found anywhere - localStorage will not have createdAt field'
            );
        } else if (!createdAt && existingPrefs.createdAt) {
            console.log(
                '✅ [LOGIN] Preserving existing createdAt from localStorage:',
                finalCreatedAt
            );
        } else if (createdAt) {
            console.log(
                '✅ [LOGIN] Using createdAt from backend/accountData:',
                finalCreatedAt
            );
        }

        // Build userPrefsData from the MERGED accountData
        // CRITICAL: Always include createdAt if it exists (from backend OR localStorage)!
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
            // CRITICAL: Always include createdAt if we have it (from backend OR localStorage)!
            ...(finalCreatedAt ? { createdAt: finalCreatedAt } : {}) // Conditional spread - only add if exists
        };

        console.log('💾 [LOGIN] Saving userPrefsData to localStorage:', {
            hasCreatedAt: !!userPrefsData.createdAt,
            createdAt: userPrefsData.createdAt,
            hasMetadata: !!userPrefsData.metadata,
            hasProfile: !!userPrefsData.profile,
            tier: userPrefsData.tier
        });

        // Save to localStorage
        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, userPrefsData);

        // Update lastLogin in Google Sheets via API
        try {
            console.log('📡 Updating lastLogin in database...');

            // CRITICAL: Remove createdAt from accountData before sending UPDATE request!
            // createdAt should NEVER be sent in update requests - only on CREATE
            const cleanedAccountData = removeCreatedAtFromObject(accountData);

            // CRITICAL: Clean metadata to remove duplicate fields (lastLogin has own column!)
            const { prepareMetadataForAPI } = await import(
                '../utils/metadataCleaner'
            );
            const metadataToClean = {
                ...(cleanedAccountData.metadata || {}),
                lastActivity: cleanedAccountData.lastActivity,
                sessionId: cleanedAccountData.sessionId
                // NOTE: lastLogin is NOT included - it's a separate column!
            };
            const cleanedMetadata = prepareMetadataForAPI(metadataToClean, {
                source: 'updateLastLogin'
            });

            await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    userId: cleanedAccountData.userId,
                    email: cleanedAccountData.email,
                    profile: cleanedAccountData.profile,
                    lastLogin: cleanedAccountData.lastLogin, // Top-level lastLogin for Google Sheets
                    metadata: cleanedMetadata // Clean metadata without duplicates!
                })
            });
            console.log('✅ lastLogin updated in database');
        } catch (error) {
            console.warn('⚠️ Failed to update lastLogin in database:', error);
            // Non-critical error, continue with login
        }

        // Verify that userPrefsData was saved correctly
        const savedPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        console.log('✅ [LOGIN] Verified localStorage save:', {
            saved: !!savedPrefs,
            hasCreatedAt: !!savedPrefs?.createdAt,
            createdAt: savedPrefs?.createdAt,
            hasMetadata: !!savedPrefs?.metadata,
            hasProfile: !!savedPrefs?.profile
        });

        // CRITICAL: Save createdAt if we have it (from backend OR localStorage)
        // This ensures createdAt is always saved to localStorage if it exists
        if (finalCreatedAt) {
            saveCreatedAtToUserPreferences(finalCreatedAt);
            console.log(
                '✅ [LOGIN] Saved createdAt to user preferences:',
                finalCreatedAt
            );

            // CRITICAL: Ensure accountData and store have createdAt!
            if (!accountData.createdAt) {
                accountData.createdAt = finalCreatedAt;
                currentAccount.update(acc =>
                    acc ? { ...acc, createdAt: finalCreatedAt } : null
                );
            }
        } else {
            console.warn(
                '⚠️ [LOGIN] No createdAt found anywhere - cannot save to user preferences'
            );
            // Don't create new createdAt - just log warning
        }

        // Also store sessionId separately for easier access
        storageHelpers.set('sessionId', accountData.sessionId);

        console.log('🔗 localStorage updated, now notifying other tabs');

        // Notify all tabs about the verification
        notifyMagicLinkVerification(accountData);

        // Show appropriate modal based on whether account is new or existing
        // CRITICAL: Show different modals for new vs existing accounts!
        if (isNewAccount) {
            console.log(
                '🆕 New account created - showing new account created modal'
            );
            showNewAccountCreated(accountData.email, accountData.name);
        } else {
            console.log(
                '✅ Existing account found - showing account found modal'
            );
            showExistingAccountFound(accountData.email, accountData.name);
        }

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

        // OPTIMIZED: Refresh user data after successful login
        // CRITICAL: accountData already contains full data from cachedFetchAccount above
        // refreshUsageHistory will use currentAccount (which was set by syncAccountData)
        // This prevents duplicate cachedFetchAccount calls!
        console.log(
            '🔄 Refreshing user data after login (using already-loaded account data)...'
        );
        try {
            const { refreshUserSettings, refreshUsageHistory } = await import(
                './userDataStore.js'
            );
            // Force refresh after login so stats are immediately correct
            await Promise.all([
                refreshUserSettings(true),
                refreshUsageHistory(true)
            ]);
            console.log(
                '✅ User data refreshed successfully (no duplicate API calls)'
            );
        } catch (error) {
            console.warn(
                '⚠️ Failed to refresh user data (non-critical):',
                error
            );
            // Non-critical - user can still use the app
        }

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
export async function logout() {
    console.log('👋 [LOGOUT] Starting logout process...');

    logSecurityEvent('LOGOUT', {
        userId: get(currentAccount)?.userId,
        email: get(currentAccount)?.email
    });

    // Step 1: Clear ALL API cache
    clearAllCache();
    console.log('✅ [LOGOUT] API cache cleared');

    // Step 2: Reset ALL stores
    try {
        // Reset account store
        syncAccountData(null);
        isLoggedIn.set(false);
        accountTier.set('free');
        console.log('✅ [LOGOUT] Account stores reset');

        // Reset user data stores
        const { userSettings, usageHistory } = await import(
            './userDataStore.js'
        );

        userSettings.set({
            data: null,
            isLoading: false,
            hasError: false,
            isCached: false,
            lastUpdate: null,
            errorMessage: null
        });

        usageHistory.set({
            data: [],
            isLoading: false,
            hasError: false,
            isCached: false,
            lastUpdate: null,
            errorMessage: null,
            stats: { total: 0, average: 0, max: 0, min: 0, trend: 'stable' }
        });

        console.log('✅ [LOGOUT] User data stores reset');

        // Reset daily usage store (only in dev mode - security!)
        // In production, daily usage persists across logout/login
        if (isDevelopment()) {
            const { resetDailyUsage } = await import('./dailyUsageStore.js');
            try {
                resetDailyUsage();
                console.log('✅ [LOGOUT] Daily usage reset (dev mode)');
            } catch (error) {
                // Ignore if not in dev mode (expected in production)
                console.log(
                    'ℹ️ [LOGOUT] Daily usage reset skipped (production mode)'
                );
            }
        } else {
            console.log(
                'ℹ️ [LOGOUT] Daily usage persists (production mode - security)'
            );
        }
    } catch (error) {
        console.warn('⚠️ [LOGOUT] Error resetting stores:', error);
    }

    // Step 3: Clear ALL storage (session + specific localStorage items)
    try {
        // Clear sessionStorage completely
        sessionStorage.clear();

        // Clear ALL user-specific localStorage items
        const itemsToRemove = [
            'sessionId',
            'csrf_token',
            STORAGE_KEYS.USER_PREFERENCES,
            STORAGE_KEYS.USAGE_HISTORY,
            STORAGE_KEYS.USAGE_HISTORY_TIMESTAMP,
            STORAGE_KEYS.USER_SETTINGS,
            STORAGE_KEYS.USER_SETTINGS_TIMESTAMP,
            STORAGE_KEYS.DAILY_USAGE,
            'keymoji_session',
            'keymoji_lastActivity'
        ];

        itemsToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn(`⚠️ Failed to remove ${key}:`, e);
            }
        });

        console.log('✅ [LOGOUT] All storage cleared');
    } catch (error) {
        console.warn('⚠️ [LOGOUT] Failed to clear storage:', error);
    }

    // Step 4: Clear rate limiting
    if (get(currentAccount)?.email) {
        LOGIN_ATTEMPTS.delete(get(currentAccount).email);
    }

    // Step 5: Reset session flags using exported function
    resetSessionFlags();
    console.log('✅ [LOGOUT] Session flags reset');

    // Step 6: Smooth redirect to home with clean state
    console.log('🔄 [LOGOUT] Redirecting to home...');

    // Use window.location for full page reload (clears ALL state!)
    if (typeof window !== 'undefined') {
        // Small delay for smooth UX
        setTimeout(() => {
            window.location.href = '/';
        }, 100);
    }

    console.log('✅ [LOGOUT] Logout complete!');
}

// Get current account data
export function getCurrentAccount() {
    return get(currentAccount);
}

// Flag to prevent multiple simultaneous session restores
// CRITICAL: These must be reset on every page load!
let isRestoringSession = false;
let sessionRestored = false;
let sessionRestoreTimestamp = 0;

// Reset session restore flags (called on app init)
export function resetSessionFlags() {
    console.log('🔄 [SESSION] Resetting session flags for new page load');
    isRestoringSession = false;
    sessionRestored = false;
    sessionRestoreTimestamp = 0;
}

// Initialize account from cookies on app start - Enhanced Security
export async function initializeAccountFromCookies(forceRestore = false) {
    try {
        // On page reload, always try to restore (but prevent multiple simultaneous calls)
        const timeSinceLastRestore = Date.now() - sessionRestoreTimestamp;

        if (isRestoringSession && timeSinceLastRestore < 5000) {
            console.log('⏳ Session restore already in progress, skipping...');
            return sessionRestored;
        }

        if (sessionRestored && !forceRestore && timeSinceLastRestore < 5000) {
            console.log('✅ Session already restored (recent), skipping...');
            return true;
        }

        console.log('🔐 [SESSION RESTORE] Starting session restoration...', {
            forceRestore,
            timeSinceLastRestore,
            previouslyRestored: sessionRestored,
            currentStoreState: {
                isLoggedIn: get(isLoggedIn),
                hasAccount: !!get(currentAccount),
                email: get(currentAccount)?.email
            }
        });

        isRestoringSession = true;
        sessionRestoreTimestamp = Date.now();

        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        const sessionId = getSessionId(); // Use local function, not storageHelpers.getSessionId

        // Enhanced session validation
        if (!validateSession(userPrefs)) {
            console.log(
                '❌ [SESSION RESTORE] Invalid session, clearing session data'
            );
            // Nur Session-Daten löschen, andere localStorage-Daten beibehalten
            try {
                localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
                localStorage.removeItem('sessionId');
                sessionStorage.clear();

                // Also reset stores
                isLoggedIn.set(false);
                currentAccount.set(null);
                userProfile.set(null);
                accountTier.set('free');
            } catch (error) {
                console.warn(
                    '⚠️ [SESSION RESTORE] Failed to clear invalid session data:',
                    error
                );
            }
            isRestoringSession = false;
            return false;
        }

        // CRITICAL: If stores are already set correctly, don't do full API restore
        // This prevents unnecessary API calls and potential race conditions
        const currentlyLoggedIn = get(isLoggedIn);
        const hasAccountData = !!get(currentAccount);

        if (
            currentlyLoggedIn &&
            hasAccountData &&
            userPrefs.email &&
            !forceRestore
        ) {
            console.log(
                '✅ [SESSION RESTORE] Stores already initialized, skipping API call',
                {
                    email: userPrefs.email,
                    storeEmail: get(currentAccount)?.email
                }
            );
            isRestoringSession = false;
            sessionRestored = true;
            return true;
        }

        if (userPrefs.email && sessionId) {
            // Get createdAt from user preferences ONLY
            const createdAt = getCreatedAtFromUserPreferences();

            // CRITICAL: Load FULL account data from database (not just from cookies!)
            console.log(
                '📡 [SESSION RESTORE] Loading full account data from database...'
            );
            let accountInfo = null;
            let fullAccountResult = null;

            try {
                // Always use Vercel proxy — CORS allows localhost:8080.
                // Never call n8n directly from the browser.
                fullAccountResult = await cachedFetchAccount(
                    userPrefs.userId,
                    userPrefs.email,
                    'get'
                );

                if (fullAccountResult) {
                    console.log(
                        '✅ [SESSION RESTORE] Full account data loaded from database (cached):',
                        {
                            success: fullAccountResult.success,
                            hasAccount: !!fullAccountResult.account,
                            hasMetadata: !!fullAccountResult.account?.metadata,
                            hasUsageHistory:
                                !!fullAccountResult.account?.metadata
                                    ?.usageHistory,
                            usageHistoryLength:
                                fullAccountResult.account?.metadata
                                    ?.usageHistory?.length || 0
                        }
                    );
                }

                if (fullAccountResult?.success && fullAccountResult.account) {
                    // Use FULL account data from database
                    accountInfo = {
                        ...fullAccountResult.account,
                        // Preserve session data from cookies
                        sessionId: userPrefs.sessionId,
                        sessionExpires: userPrefs.sessionExpires,
                        lastActivity: new Date().toISOString(),
                        isFirstLogin: false
                    };
                    console.log(
                        '✅ [SESSION RESTORE] Using full database data with usageHistory'
                    );
                } else {
                    throw new Error('No account data in response');
                }
            } catch (error) {
                console.warn(
                    '⚠️ [SESSION RESTORE] Failed to load from database, using localStorage fallback:',
                    error.message
                );

                // Fallback: Use data from cookies/localStorage (without usageHistory)
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
                console.log(
                    '💡 [SESSION RESTORE] Using cookies/localStorage fallback (usageHistory may be missing)'
                );
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
            console.log('✅ Session restored (READ-ONLY, no database write):', {
                userId: accountInfo.userId,
                email: accountInfo.email,
                action: 'READ_ONLY'
            });

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

// DEPRECATED: Use resetSessionFlags() instead
// REMOVED: This function is no longer used anywhere in the codebase (verified with grep)
// Migration: Replace all calls to resetSessionRestoreFlag() with resetSessionFlags()
// @deprecated - Removed in v0.7.4+ (use resetSessionFlags() instead)
// export function resetSessionRestoreFlag() {
//     console.warn(
//         '⚠️ resetSessionRestoreFlag() is deprecated, use resetSessionFlags() instead'
//     );
//     resetSessionFlags();
// }

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

/**
 * CRITICAL: Remove createdAt from objects before sending to API
 * Best Practice: createdAt should ONLY be set on CREATE, never in UPDATE requests
 * This ensures createdAt is preserved in the database and never overwritten
 */
function removeCreatedAtFromObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    // Create a copy to avoid mutating the original
    const cleaned = { ...obj };

    // Remove createdAt from top level
    if ('createdAt' in cleaned) {
        delete cleaned.createdAt;
    }

    // Remove createdAt from nested metadata if it exists
    if (cleaned.metadata && typeof cleaned.metadata === 'object') {
        const { createdAt, ...metadataWithoutCreatedAt } = cleaned.metadata;
        cleaned.metadata = metadataWithoutCreatedAt;
    }

    // Remove createdAt from nested profile if it exists
    if (cleaned.profile && typeof cleaned.profile === 'object') {
        const { createdAt, ...profileWithoutCreatedAt } = cleaned.profile;
        cleaned.profile = profileWithoutCreatedAt;
    }

    return cleaned;
}

// Centralized function to save createdAt to user preferences
// CRITICAL: Only save if createdAt is valid AND different from existing (or doesn't exist)
function saveCreatedAtToUserPreferences(createdAt) {
    if (!createdAt) {
        console.log('⚠️ No createdAt provided to save');
        return;
    }

    // Validate createdAt is a valid date string
    if (
        createdAt === 'null' ||
        createdAt === 'undefined' ||
        (createdAt.trim && createdAt.trim() === '')
    ) {
        console.warn('⚠️ Invalid createdAt value - not saving:', createdAt);
        return;
    }

    console.log('🔍 DEBUG: Saving createdAt to USER_PREFERENCES:', createdAt);

    const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    console.log('🔍 DEBUG: Current userPrefs createdAt:', userPrefs.createdAt);

    // CRITICAL: Only update if createdAt is different from existing OR doesn't exist
    // This prevents overwriting with the same value or invalid values
    if (userPrefs.createdAt && userPrefs.createdAt === createdAt) {
        console.log(
            '✅ createdAt already exists in localStorage with same value - no update needed'
        );
        return;
    }

    // CRITICAL: If localStorage has a createdAt but backend doesn't, preserve localStorage!
    // Only update if backend has a valid createdAt and localStorage doesn't, OR if they're different
    if (userPrefs.createdAt && userPrefs.createdAt !== createdAt) {
        console.warn(
            '⚠️ createdAt mismatch - localStorage has:',
            userPrefs.createdAt,
            'backend has:',
            createdAt
        );
        // CRITICAL: Preserve existing localStorage createdAt if backend value seems invalid
        // Only update if backend value is clearly newer/valid
        if (!createdAt || createdAt === 'null' || createdAt === 'undefined') {
            console.log(
                '🔄 Backend createdAt is invalid - preserving localStorage value:',
                userPrefs.createdAt
            );
            return;
        }
        console.log(
            '✅ Updating createdAt from backend (backend takes precedence):',
            createdAt
        );
    }

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

    // String? Try to parse (supports double-escaped JSON!)
    if (typeof data === 'string') {
        try {
            let parsed = JSON.parse(data);

            // Check if result is STILL a string (double-escaped JSON from Google Sheets!)
            // Example: "{""settings"":{...}}" → needs second parse!
            if (typeof parsed === 'string') {
                console.log(
                    '⚠️ Double-escaped JSON detected, parsing again...'
                );
                try {
                    parsed = JSON.parse(parsed);
                    console.log('✅ Successfully parsed double-escaped JSON');
                } catch (secondError) {
                    console.warn(
                        '⚠️ Failed second parse:',
                        secondError.message
                    );
                    return fallback;
                }
            }

            return parsed;
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
                hasSettings: !!parsedMetadata.settings
            }
        });

        // CRITICAL: Parse dailyUsage from accountData (if present)
        // dailyUsage is in its own column in Google Sheets, not in metadata!
        let parsedDailyUsage = null;
        if (accountData.dailyUsage) {
            if (typeof accountData.dailyUsage === 'string') {
                try {
                    parsedDailyUsage = JSON.parse(accountData.dailyUsage);
                } catch (e) {
                    console.warn(
                        '⚠️ Failed to parse dailyUsage from accountData:',
                        e
                    );
                }
            } else if (typeof accountData.dailyUsage === 'object') {
                parsedDailyUsage = accountData.dailyUsage;
            }
        }

        // Create clean account object with parsed data
        const cleanAccountData = {
            ...accountData,
            profile: parsedProfile,
            metadata: parsedMetadata,
            // CRITICAL: Include dailyUsage in account object for easy access!
            ...(parsedDailyUsage ? { dailyUsage: parsedDailyUsage } : {})
        };

        if (parsedDailyUsage) {
            console.log(
                '✅ [ACCOUNT DEBUG] dailyUsage loaded from accountData:',
                {
                    date: parsedDailyUsage.date,
                    used: parsedDailyUsage.used,
                    limit: parsedDailyUsage.limit
                }
            );
        } else {
            console.log(
                'ℹ️ [ACCOUNT DEBUG] No dailyUsage in accountData - will be loaded by initializeDailyUsage()'
            );
        }

        // CRITICAL: Ensure createdAt is present - prioritize accountData.createdAt from API
        // The n8n webhook returns createdAt directly in account.createdAt
        // NEVER create new createdAt - only use from backend or preserve existing!
        // CRITICAL: Only use backend createdAt if it's a valid value (not null, not undefined, not empty string)!
        const hasValidBackendCreatedAt =
            cleanAccountData.createdAt &&
            cleanAccountData.createdAt !== 'null' &&
            cleanAccountData.createdAt !== 'undefined' &&
            cleanAccountData.createdAt.trim &&
            cleanAccountData.createdAt.trim() !== '';

        if (!hasValidBackendCreatedAt) {
            // Backend doesn't have valid createdAt - preserve from localStorage!
            const userPrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES,
                {}
            );
            if (userPrefs.createdAt) {
                // Use existing createdAt from localStorage (preserve it!)
                cleanAccountData.createdAt = userPrefs.createdAt;
                console.log(
                    '🔄 syncAccountData: Backend has no valid createdAt - preserving existing from localStorage:',
                    cleanAccountData.createdAt
                );
            } else {
                console.warn(
                    '⚠️ syncAccountData: No createdAt found in accountData or localStorage - will not create new one'
                );
                // CRITICAL: Don't set createdAt to current date - preserve null/undefined
                // Only create createdAt when actually creating a NEW account!
            }
        } else {
            // Backend has valid createdAt - use it and save to localStorage!
            console.log(
                '✅ syncAccountData: Using valid createdAt from accountData (API/Backend):',
                cleanAccountData.createdAt
            );
            // CRITICAL: Save to localStorage to preserve it for future logins
            saveCreatedAtToUserPreferences(cleanAccountData.createdAt);
        }

        // Update all account-related stores with PARSED data
        isLoggedIn.set(true);
        currentAccount.set(cleanAccountData);
        userProfile.set(parsedProfile);
        accountTier.set(cleanAccountData.tier || 'free');

        console.log('✅ [ACCOUNT] Stores updated:', {
            isLoggedIn: true,
            tier: cleanAccountData.tier || 'free',
            hasProfile: !!parsedProfile,
            hasMetadata: !!parsedMetadata,
            hasSettings: !!parsedMetadata?.settings
        });

        // CRITICAL: Initialize daily usage - PRIORITY: accountData.dailyUsage > initializeDailyUsage()
        // This prevents duplicate API calls and race conditions
        try {
            let finalDailyUsage = parsedDailyUsage; // Use dailyUsage from accountData if available

            if (!finalDailyUsage) {
                // Only load from API/localStorage if not already in accountData
                console.log(
                    'ℹ️ [ACCOUNT DEBUG] No dailyUsage in accountData - loading from API/localStorage...'
                );
                const { initializeDailyUsage } = await import(
                    './dailyUsageStore.js'
                );
                // CRITICAL: Pass accountData to prevent duplicate API calls!
                finalDailyUsage = await initializeDailyUsage(cleanAccountData);
                console.log('✅ Daily usage initialized from API/localStorage');
            } else {
                // dailyUsage already in accountData - sync to dailyUsageStore
                console.log(
                    '✅ [ACCOUNT DEBUG] Using dailyUsage from accountData, syncing to dailyUsageStore...'
                );
                const { updateDailyLimitStore } = await import(
                    './dailyUsageStore.js'
                );
                // Update dailyLimit store with accountData.dailyUsage
                if (updateDailyLimitStore) {
                    updateDailyLimitStore(finalDailyUsage);
                    console.log(
                        '✅ [ACCOUNT DEBUG] dailyUsage synced to dailyLimit store'
                    );
                }
            }

            // CRITICAL: Always update currentAccount with finalDailyUsage (from accountData OR initializeDailyUsage)
            // This ensures dailyUsage is available in account store for updates
            if (finalDailyUsage) {
                // Update cleanAccountData with final dailyUsage
                cleanAccountData.dailyUsage = finalDailyUsage;
                console.log(
                    '✅ [ACCOUNT DEBUG] dailyUsage synced to currentAccount store:',
                    {
                        date: finalDailyUsage.date,
                        used: finalDailyUsage.used,
                        limit: finalDailyUsage.limit
                    }
                );
            }

            // CRITICAL: Refresh usage history AFTER dailyUsage is synced (NO setTimeout - use await!)
            // This ensures today's usage is merged into history
            // OPTIMIZED: Pass cleanAccountData to prevent duplicate API calls!
            try {
                const { refreshUsageHistory } = await import(
                    './userDataStore.js'
                );
                // NO setTimeout - await directly after dailyUsage is synced!
                // CRITICAL: Pass cleanAccountData to prevent duplicate API calls!
                await refreshUsageHistory(true, cleanAccountData); // Force refresh but use accountData if available
                console.log(
                    '✅ Usage history refreshed after account sync (with today merge, using accountData to prevent duplicate API call)'
                );
            } catch (error) {
                console.warn(
                    '⚠️ Failed to refresh usage history after sync:',
                    error
                );
            }
        } catch (error) {
            console.warn(
                '⚠️ Failed to initialize daily usage, using fallback:',
                error
            );
            // Fallback to old method (use parsedMetadata)
            updateDailyLimit(
                true,
                cleanAccountData.tier,
                parsedMetadata?.dailyUsage?.used ||
                    cleanAccountData.usedGenerations ||
                    0
            );

            // Still try to refresh history even if dailyUsage init failed
            // CRITICAL: Use await directly - NO setTimeout delays!
            // OPTIMIZED: Pass cleanAccountData to prevent duplicate API calls!
            try {
                const { refreshUsageHistory } = await import(
                    './userDataStore.js'
                );
                await refreshUsageHistory(true, cleanAccountData); // Use accountData to prevent duplicate API calls
                console.log(
                    '✅ Usage history refreshed after account sync (fallback, using accountData to prevent duplicate API call)'
                );
            } catch (err) {
                console.warn('⚠️ Failed to refresh usage history:', err);
            }
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
                dailyUsage: !!parsedMetadata?.dailyUsage
            }
        );
    } else {
        // Only reset stores if we're truly not logged in (check cookies first!)
        const hasSession = hasValidUserSession();
        const hasPrefs = hasExistingUserPreferences();

        console.log(
            '⚠️ [ACCOUNT DEBUG] No account data received, checking session validity:',
            {
                hasSession,
                hasPrefs,
                shouldReset: !hasSession && !hasPrefs
            }
        );

        // Only reset if there's truly no valid session
        if (!hasSession && !hasPrefs) {
            console.log(
                '🔄 [ACCOUNT DEBUG] No valid session, resetting stores'
            );
            isLoggedIn.set(false);
            currentAccount.set(null);
            userProfile.set(null);
            accountTier.set('free');
            updateDailyLimit(false, 'free', 0); // Reset to guest limits
        } else {
            console.log(
                '✅ [ACCOUNT DEBUG] Valid session exists, keeping stores intact'
            );
            // Keep current state, don't reset!
        }
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
        // CRITICAL: Clean metadata to remove duplicate fields (fields with own columns!)
        // Single Source of Truth: Fields with own columns should NOT be in metadata
        const { prepareMetadataForAPI, validateMetadataNoDuplicates } =
            await import('../utils/metadataCleaner');

        // Build metadata to send — kein usageHistory (wird lokal in DAILY_USAGE_HISTORY geführt)
        const metadataToSend = {
            ...metadata
            // NOTE: tier is NOT in metadata - it's a separate column!
        };

        // CRITICAL: Clean metadata to remove duplicate fields (createdAt, dailyUsage, profile, tier, etc.)
        // These fields have their own columns and should NOT be in metadata!
        const cleanedMetadata = prepareMetadataForAPI(metadataToSend, {
            source: 'createAccount'
        });

        // Validate (warns in dev if duplicates found)
        validateMetadataNoDuplicates(cleanedMetadata, 'createAccount');

        console.log('🆕 Creating account with cleaned metadata:', {
            tier: metadata?.tier || 'free'
        });

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
                tier: metadata?.tier || 'free', // tier as separate field!
                profile,
                metadata: cleanedMetadata, // Clean metadata without duplicates!
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
        // CRITICAL: Remove createdAt from updates before sending UPDATE request!
        // createdAt should NEVER be sent in update requests - only on CREATE
        const cleanedUpdates = removeCreatedAtFromObject(updates);

        const response = await fetch(WEBHOOKS.ACCOUNT.CRUD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'update',
                userId,
                updates: cleanedUpdates,
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

// Event handler functions (defined outside for proper cleanup)
let magicLinkMessageHandler = null;
let magicLinkStorageHandler = null;
let magicLinkListenerSetup = false;

function handleMagicLinkMessage(event) {
    try {
        // CRITICAL: Filter out browser extension messages early to prevent errors
        // Brave Browser and other extensions inject messages that can cause issues
        
        // Check for common extension message patterns
        const data = event.data || {};
        const isExtensionMessage = 
            data.target === 'metamask-inpage' ||
            data.target === 'brave-extension' ||
            data.target === 'chrome-extension' ||
            data.extensionId ||
            data.__isExtensionMessage ||
            event.source !== window ||
            typeof data.type === 'undefined' ||
            (event.origin && !event.origin.includes(window.location.hostname));
        
        if (isExtensionMessage) {
            // Silent ignore - these are from browser extensions (Brave, Metamask, etc.)
            return;
        }

        console.log('🔗 Received message:', data);

        // Additional validation: Only process our own messages
        if (!data.type || !data.type.startsWith('MAGIC_LINK')) {
            return;
        }

        if (event.data && event.data.type === 'MAGIC_LINK_VERIFIED') {
            console.log('🔗 Magic link verified in another tab:', event.data);

            // Update account state
            if (event.data.success && event.data.email) {
                // CRITICAL: Preserve createdAt from existing localStorage or event.data
                const existingPrefs = storageHelpers.get(
                    STORAGE_KEYS.USER_PREFERENCES,
                    {}
                );
                const createdAt =
                    event.data.createdAt || existingPrefs.createdAt || null;

                const accountData = {
                    email: event.data.email,
                    name: event.data.name || '',
                    userId: event.data.userId || `user_${Date.now()}`,
                    tier: event.data.tier || 'free',
                    lastLogin: new Date().toISOString(),
                    // CRITICAL: Only use createdAt from event or existing localStorage - never create new!
                    ...(createdAt ? { createdAt } : {})
                };

                console.log(
                    '🔗 Updating account state from cross-tab message:',
                    accountData
                );

                currentAccount.set(accountData);
                isLoggedIn.set(true);

                // Update localStorage preferences - preserve createdAt!
                const userPrefsUpdate = {
                    email: accountData.email,
                    name: accountData.name,
                    userId: accountData.userId,
                    tier: accountData.tier,
                    lastLogin: accountData.lastLogin,
                    ...(createdAt ? { createdAt } : {}) // Only add if exists
                };

                // Preserve existing createdAt if not in update
                if (!userPrefsUpdate.createdAt && existingPrefs.createdAt) {
                    userPrefsUpdate.createdAt = existingPrefs.createdAt;
                    console.log(
                        '✅ [CROSS-TAB] Preserved existing createdAt:',
                        existingPrefs.createdAt
                    );
                }

                storageHelpers.set(
                    STORAGE_KEYS.USER_PREFERENCES,
                    userPrefsUpdate
                );

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
    } catch (error) {
        console.warn('⚠️ Error handling magic link message:', error);
    }
}

function handleMagicLinkStorage(event) {
    try {
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
    } catch (error) {
        console.warn('⚠️ Error handling storage event:', error);
    }
}

// Setup magic link listener for cross-tab communication
export function setupMagicLinkListener() {
    if (typeof window === 'undefined') return;

    // Prevent duplicate setup
    if (magicLinkListenerSetup) {
        console.log('🔗 Magic link listener already setup, skipping');
        return;
    }

    console.log(
        '🔗 Setting up magic link listener for cross-tab communication'
    );

    // Store handler references for cleanup
    magicLinkMessageHandler = handleMagicLinkMessage;
    magicLinkStorageHandler = handleMagicLinkStorage;

    // Listen for magic link verification messages
    window.addEventListener('message', magicLinkMessageHandler);

    // Also listen for storage changes (for cross-tab synchronization)
    window.addEventListener('storage', magicLinkStorageHandler);

    magicLinkListenerSetup = true;
    console.log('🔗 Magic link listener setup complete');
}

// Cleanup magic link listener
export function cleanupMagicLinkListener() {
    if (typeof window === 'undefined') return;

    if (magicLinkMessageHandler) {
        try {
            window.removeEventListener('message', magicLinkMessageHandler);
            magicLinkMessageHandler = null;
        } catch (error) {
            console.warn('⚠️ Error removing message listener:', error);
        }
    }

    if (magicLinkStorageHandler) {
        try {
            window.removeEventListener('storage', magicLinkStorageHandler);
            magicLinkStorageHandler = null;
        } catch (error) {
            console.warn('⚠️ Error removing storage listener:', error);
        }
    }

    magicLinkListenerSetup = false;
    console.log('🔗 Magic link listener cleaned up');
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
    // CRITICAL: Check for runtime.lastError before posting
    try {
        // Check if Chrome extension context is available and clear errors
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            try {
                if (chrome.runtime.lastError) {
                    // Clear the error silently (it's just a warning from browser extensions)
                    void chrome.runtime.lastError;
                }
            } catch (e) {
                // Ignore errors when checking runtime.lastError
            }
        }

        // CRITICAL: Check if window is still available and not closing
        if (typeof window === 'undefined' || document.readyState === 'unloading') {
            console.warn('⚠️ Window unavailable or unloading, skipping postMessage');
            return;
        }

        // Use setTimeout to ensure message is sent asynchronously
        // This prevents "message port closed" errors during page transitions
        setTimeout(() => {
            try {
                window.postMessage(message, window.location.origin);
                if (isDevelopment()) {
                    console.log('🔗 postMessage sent to all tabs:', message);
                }
            } catch (postError) {
                // Silently handle message port closed errors (common during navigation)
                const errorMessage = postError?.message || postError?.toString() || '';
                const errorName = postError?.name || '';
                
                if (
                    errorMessage.includes('port') ||
                    errorMessage.includes('closed') ||
                    errorMessage.includes('runtime.lastError') ||
                    errorMessage.includes('Extension context invalidated') ||
                    errorMessage.includes('The message port closed before a response was received') ||
                    errorName === 'InvalidStateError' ||
                    errorName === 'DOMException'
                ) {
                    // Silent - this is expected during page transitions or from browser extensions
                    return;
                } else {
                    console.error('❌ Failed to send postMessage:', postError);
                }
            }
        }, 0);
    } catch (error) {
        // Handle message port closed errors gracefully
        const errorMessage = error?.message || error?.toString() || '';
        const errorName = error?.name || '';
        
        if (
            errorMessage.includes('port') ||
            errorMessage.includes('closed') ||
            errorMessage.includes('runtime.lastError') ||
            errorMessage.includes('Extension context invalidated') ||
            errorMessage.includes('The message port closed before a response was received') ||
            errorName === 'InvalidStateError' ||
            errorName === 'DOMException'
        ) {
            // Silent - this is expected during page transitions or from browser extensions
            return;
        } else {
            console.error('❌ Failed to send postMessage:', error);
        }
    }

    // CRITICAL: Preserve createdAt when updating localStorage for cross-tab communication!
    const existingPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    const preservedCreatedAt =
        accountData.createdAt || existingPrefs.createdAt || null;

    // Also update localStorage to trigger storage event with session data
    storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
        email: accountData.email,
        name: accountData.name,
        userId: accountData.userId,
        tier: accountData.tier,
        lastLogin: accountData.lastLogin,
        sessionId: accountData.sessionId,
        sessionExpires: accountData.sessionExpires,
        lastActivity: accountData.lastActivity,
        // CRITICAL: Always preserve createdAt if it exists!
        ...(preservedCreatedAt ? { createdAt: preservedCreatedAt } : {})
    });

    if (preservedCreatedAt) {
        console.log(
            '✅ [CROSS-TAB] Preserved createdAt in localStorage update:',
            preservedCreatedAt
        );
    }

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
                result = await verifyMagicLinkFrontend(data.code, data.email);
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

// New OTP-based verification (replaces magic link click)
export async function secureVerifyOTP(code, email) {
    return secureAccountingOperation('VERIFY_LOGIN', {
        code,
        email
    });
}
