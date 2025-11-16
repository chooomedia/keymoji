// src/stores/accountStore.ts
// Enhanced account management with security features
// TypeScript Migration: v0.7.7
import { writable, get } from 'svelte/store';
import {
    currentAccount,
    isLoggedIn,
    userProfile,
    accountTier,
    dailyLimit,
    updateDailyLimit
} from './appStores';
import { showExistingAccountFound, showNewAccountCreated } from './modalStore';
import { storageHelpers, STORAGE_KEYS } from '../config/storage';
import { WEBHOOKS } from '../config/api';
import { isDevelopment } from '../utils/environment';
import { cachedFetchAccount, clearAllCache } from '../utils/apiCache';
import { generateClientFingerprint } from '../utils/sharedHelpers';
// Import Helper Functions
import {
    generateSecureToken,
    generateFantasyName,
    getSessionId,
    getCreatedAtFromAccount,
    removeCreatedAtFromObject,
    saveCreatedAtToUserPreferences,
    getCreatedAtFromUserPreferences,
    safeJSONParse
} from './accountHelpers';
// Import Security Functions
import {
    logSecurityEvent,
    logAccountingEvent,
    checkRateLimit,
    clearLoginAttempts
} from './accountSecurity';
// Import Session Functions
import {
    validateSession,
    resetSessionFlags,
    getSessionRestoreState,
    setSessionRestoreState,
    SESSION_TIMEOUT,
    MAX_SESSIONS_PER_USER
} from './accountSession';
import type {
    Account,
    UserProfile,
    AccountMetadata,
    DailyUsage
} from '../types/Account';
import type { APIResponse } from '../types/API';

export interface AccountInfo {
    email: string;
    name?: string;
    userId?: string;
    isFirstLogin?: boolean;
    [key: string]: unknown;
}

export interface SecurityEventDetails {
    userId?: string;
    email?: string;
    attempts?: number;
    timeRemaining?: number;
    clientFingerprint?: string;
    sessionId?: string | null;
    sessionCount?: number;
    error?: string;
    token?: string;
    [key: string]: unknown;
}

export interface SecurityLog {
    event: string;
    timestamp: string;
    clientFingerprint: string;
    userAgent: string;
    details: SecurityEventDetails;
    accountingEvent: boolean;
    sessionId: string | null;
    userId?: string;
    email?: string;
}

export interface AccountingEventDetails extends SecurityEventDetails {
    event: string;
    accountingType: string;
    timestamp: string;
    action: string;
    tier?: 'free' | 'pro';
    operation?: string;
    errors?: string[];
    warnings?: string[];
    result?: { success: boolean; userId?: string };
    [key: string]: unknown;
}

export interface SessionData {
    email: string;
    userId?: string;
    sessionExpires?: string;
    [key: string]: unknown;
}

export interface AccountCheckResult {
    success: boolean;
    exists: boolean;
    account: Account | null;
    message: string;
}

export interface MagicLinkResult {
    success: boolean;
    message?: string;
    [key: string]: unknown;
}

export interface VerificationResult {
    success: boolean;
    account?: Account;
    message?: string;
    [key: string]: unknown;
}

export interface AccountingValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface AccountingOperationData {
    userId?: string;
    email?: string;
    name?: string;
    dev?: boolean;
    token?: string;
    profile?: Partial<UserProfile>;
    metadata?: Partial<AccountMetadata>;
    updates?: Partial<Account>;
    password?: string;
    tier?: 'free' | 'pro';
    [key: string]: unknown;
}

export type AccountingOperation =
    | 'CREATE_ACCOUNT'
    | 'UPDATE_ACCOUNT'
    | 'GET_ACCOUNT'
    | 'LOGIN'
    | 'VERIFY_LOGIN';

// Session and rate limit constants moved to respective modules
// SESSION_TIMEOUT, MAX_SESSIONS_PER_USER -> accountSession.ts
// MAX_LOGIN_ATTEMPTS, LOGIN_ATTEMPT_WINDOW, LOGIN_ATTEMPTS -> accountSecurity.ts

function showLoginSuccessIfFirstLogin(accountInfo: AccountInfo): void {
    if (accountInfo.isFirstLogin) {
        showExistingAccountFound();
    }
}

// validateSession, generateSecureToken, generateFantasyName moved to helper modules

export const isLoggingIn = writable<boolean>(false);
export const loginError = writable<string | null>(null);

export async function checkAccountExists(
    email: string,
    name: string = ''
): Promise<AccountCheckResult> {
    try {
        console.log('🔍 Checking account existence for:', email);

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

                        if (result.exists && result.account) {
                            console.log(
                                '🔄 Syncing n8n account data to localStorage'
                            );

                            const parsedAccount = safeJSONParse(
                                result.account,
                                {}
                            );
                            console.log(
                                '🔍 DEBUG: Parsed account data:',
                                parsedAccount
                            );

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
                                createdAt: createdAt || null // Don't create new createdAt on account check!
                            };

                            if (!userPrefsData.createdAt) {
                                console.warn(
                                    '⚠️ [CHECK] No createdAt found in account data - will not overwrite existing value'
                                );
                            }

                            storageHelpers.set(
                                STORAGE_KEYS.USER_PREFERENCES,
                                userPrefsData
                            );

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
        } catch (webhookError: unknown) {
            const errorMessage =
                webhookError instanceof Error
                    ? webhookError.message
                    : String(webhookError);
            console.log(
                '❌ n8n webhook failed, using localStorage fallback:',
                errorMessage
            );
        }

        console.log('🔍 Using localStorage fallback for account check');
        const existingPrefs = storageHelpers.get<
            Account | Record<string, unknown>
        >(STORAGE_KEYS.USER_PREFERENCES);

        if (
            existingPrefs &&
            typeof existingPrefs === 'object' &&
            'email' in existingPrefs &&
            typeof existingPrefs.email === 'string' &&
            existingPrefs.email.toLowerCase() === email.toLowerCase()
        ) {
            console.log('✅ Found existing account in localStorage');
            return {
                success: true,
                exists: true,
                account: existingPrefs as Account,
                message: 'Account found in localStorage'
            };
        }

        console.log('❌ No account found in localStorage');
        return {
            success: true,
            exists: false,
            account: null,
            message: 'No account found (localStorage fallback)'
        };
    } catch (error) {
        console.error('❌ Account check error:', error);
        return {
            success: true,
            exists: false,
            account: null,
            message: 'Network error, assuming new account'
        };
    }
}

export async function loginWithMagicLink(
    email: string,
    name: string = '',
    dev: boolean = false
): Promise<MagicLinkResult> {
    try {
        checkRateLimit(email);

        console.log('🔗 Sending magic link for:', email);

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

        logSecurityEvent('MAGIC_LINK_FAILED', {
            email,
            error: error.message
        });

        throw error;
    }
}

export async function verifyMagicLink(
    token: string,
    email: string
): Promise<VerificationResult> {
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

        logSecurityEvent('MAGIC_LINK_VERIFIED', {
            email,
            success: true,
            method: 'backend_verification'
        });

        console.log('✅ Magic link verified on backend:', result);
        return result;
    } catch (error) {
        console.error('❌ Backend magic link verification error:', error);

        logSecurityEvent('VERIFICATION_FAILED', {
            email,
            error: error.message,
            method: 'backend_verification'
        });

        throw error;
    }
}

export async function verifyMagicLinkFrontend(
    token: string,
    email: string
): Promise<VerificationResult> {
    try {
        console.log('🔗 Verifying magic link in frontend:', { token, email });

        if (!token || typeof token !== 'string' || token.length < 10) {
            throw new Error('Invalid token format');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        const verificationKey = `verification_${email}`;
        const lastVerification = sessionStorage.getItem(verificationKey);
        const now = Date.now();

        if (lastVerification && now - parseInt(lastVerification) < 5000) {
            throw new Error(
                'Too many verification attempts. Please wait 5 seconds.'
            );
        }
        sessionStorage.setItem(verificationKey, now.toString());

        console.log(
            '🔍 Checking if account already exists for magic link verification...'
        );
        const accountCheck = await checkAccountExists(
            email,
            email.split('@')[0]
        );

        let isNewAccount = !accountCheck.exists;

        let verificationResult;

        if (accountCheck.exists) {
            console.log('✅ Account already exists, using existing account');
            const parsedAccount = safeJSONParse(
                accountCheck.account,
                accountCheck.account
            );
            console.log('🔍 DEBUG: Parsed existing account:', parsedAccount);

            verificationResult = {
                success: true,
                account: parsedAccount,
                message: 'Account already exists'
            };
        } else {
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

                            if (
                                errorMessage.includes('already exists') ||
                                errorMessage.includes('Account already exists')
                            ) {
                                console.log(
                                    '⚠️ Account already exists, trying to fetch existing account...'
                                );
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
                                    const existingAccountData: Partial<Account> =
                                        {
                                            email:
                                                (parsedAccount as Account)
                                                    .email || email,
                                            userId:
                                                (parsedAccount as Account)
                                                    .userId ||
                                                `user_${Date.now()}`,
                                            tier: ((parsedAccount as Account)
                                                .tier || 'free') as
                                                | 'free'
                                                | 'pro',
                                            lastLogin: new Date().toISOString(),
                                            profile: (parsedAccount as Account)
                                                .profile || {
                                                name: email.split('@')[0]
                                            },
                                            metadata:
                                                (parsedAccount as Account)
                                                    .metadata || {},
                                            createdAt:
                                                (parsedAccount as Account)
                                                    .createdAt ||
                                                getCreatedAtFromAccount(
                                                    parsedAccount
                                                ) ||
                                                new Date().toISOString()
                                        };
                                    accountData =
                                        existingAccountData as Account;

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

        const backendCreatedAt =
            verificationResult.account?.createdAt ||
            getCreatedAtFromAccount(verificationResult.account) ||
            null;

        console.log(
            '🔍 [LOGIN] Extracted createdAt from verificationResult:',
            backendCreatedAt
        );

        let accountData: Partial<Account> & {
            name?: string;
            sessionId?: string;
            sessionExpires?: string;
            lastActivity?: string;
        } = {
            email: email,
            name: verificationResult.account?.name || email.split('@')[0],
            userId: verificationResult.account?.userId || `user_${Date.now()}`,
            tier: (verificationResult.account?.tier || 'free') as
                | 'free'
                | 'pro',
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
            createdAt: backendCreatedAt || undefined
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

        console.log(
            '📡 [LOGIN] Loading full account data from database (cached)...'
        );
        try {
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

                const existingPrefsFullAccount = storageHelpers.get<
                    Account | Record<string, unknown>
                >(STORAGE_KEYS.USER_PREFERENCES, {});
                const existingCreatedAt =
                    accountData.createdAt ||
                    (() => {
                        if (
                            existingPrefsFullAccount &&
                            typeof existingPrefsFullAccount === 'object' &&
                            'createdAt' in existingPrefsFullAccount
                        ) {
                            return typeof existingPrefsFullAccount.createdAt ===
                                'string'
                                ? existingPrefsFullAccount.createdAt
                                : null;
                        }
                        return null;
                    })();

                accountData = {
                    ...accountData,
                    ...parsedFullAccount,
                    createdAt:
                        parsedFullAccount.createdAt ||
                        existingCreatedAt ||
                        new Date().toISOString(),
                    sessionId: accountData.sessionId,
                    sessionExpires: accountData.sessionExpires,
                    lastActivity: accountData.lastActivity
                } as Account;
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
            const isLocalhost =
                typeof window !== 'undefined' &&
                (window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1');

            if (isLocalhost) {
                console.log(
                    '💡 [LOGIN - LOCALHOST] Vercel API not available, trying direct n8n connection...'
                );

                try {
                    console.log(
                        '📡 [LOCALHOST] Fetching data directly from n8n...'
                    );
                    const n8nResponse = await fetch(
                        'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                action: 'get',
                                userId: accountData.userId,
                                email: accountData.email
                            })
                        }
                    );

                    if (n8nResponse.ok) {
                        const n8nResult = await n8nResponse.json();
                        console.log('✅ [LOCALHOST] n8n response:', {
                            success: n8nResult.success,
                            hasAccount: !!n8nResult.account,
                            hasMetadata: !!n8nResult.account?.metadata,
                            hasUsageHistory:
                                !!n8nResult.account?.metadata?.usageHistory
                        });

                        if (n8nResult.success && n8nResult.account) {
                            let metadata = n8nResult.account.metadata;
                            if (typeof metadata === 'string') {
                                try {
                                    metadata = JSON.parse(metadata);
                                } catch (e) {
                                    console.warn(
                                        '⚠️ Failed to parse metadata:',
                                        e
                                    );
                                }
                            }

                            const existingPrefsLocalhost = storageHelpers.get<
                                Account | Record<string, unknown>
                            >(STORAGE_KEYS.USER_PREFERENCES, {});
                            const existingCreatedAt =
                                accountData.createdAt ||
                                (() => {
                                    if (
                                        existingPrefsLocalhost &&
                                        typeof existingPrefsLocalhost ===
                                            'object' &&
                                        'createdAt' in existingPrefsLocalhost
                                    ) {
                                        return typeof existingPrefsLocalhost.createdAt ===
                                            'string'
                                            ? existingPrefsLocalhost.createdAt
                                            : null;
                                    }
                                    return null;
                                })();

                            accountData = {
                                ...accountData,
                                metadata: metadata as AccountMetadata,
                                profile: n8nResult.account
                                    .profile as UserProfile,
                                createdAt:
                                    n8nResult.account.createdAt ||
                                    existingCreatedAt ||
                                    new Date().toISOString(),
                                tier: (n8nResult.account.tier ||
                                    accountData.tier ||
                                    'free') as 'free' | 'pro'
                            } as Account;

                            console.log(
                                '✅ [LOCALHOST] Account data merged with n8n data!'
                            );
                            console.log(
                                '✅ [LOCALHOST] UsageHistory entries:',
                                metadata?.usageHistory?.length || 0
                            );
                        }
                    } else {
                        console.warn(
                            '⚠️ [LOCALHOST] n8n returned error:',
                            n8nResponse.status
                        );
                    }
                } catch (n8nError) {
                    console.warn(
                        '⚠️ [LOCALHOST] Direct n8n call failed:',
                        n8nError.message
                    );
                }
            } else {
                console.error(
                    '❌ [LOGIN] Error loading full account data:',
                    error.message
                );
            }
            console.log('💡 [LOGIN] Continuing with available data');
        }

        let createdAt =
            accountData.createdAt || // First: from merged backend data (highest priority!)
            getCreatedAtFromAccount(accountData) || // Second: extract from account structure
            null; // Will check localStorage next

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
                accountData.createdAt = createdAt;
            } else {
                console.warn(
                    '⚠️ [LOGIN] No createdAt found anywhere - will not create new one'
                );
            }
        }

        if (createdAt && !accountData.createdAt) {
            accountData.createdAt = createdAt;
        }

        syncAccountData(accountData);

        console.log(
            '🔍 DEBUG: Final createdAt for verifyMagicLinkFrontend:',
            createdAt ||
                'NOT FOUND - will not be set (preserves existing value)'
        );

        console.log(
            '⚙️ [LOGIN] Initializing user settings after account sync...'
        );
        try {
            const { initializeSettingsForUser } = await import(
                './userSettingsStore'
            );
            await initializeSettingsForUser();
            console.log('✅ [LOGIN] User settings initialized successfully');
        } catch (error) {
            console.warn(
                '⚠️ [LOGIN] Failed to initialize settings (non-critical):',
                error
            );
        }

        const existingPrefs = storageHelpers.get<
            Account | Record<string, unknown>
        >(STORAGE_KEYS.USER_PREFERENCES, {});
        let finalCreatedAt: string | null = createdAt || null;
        if (
            !finalCreatedAt &&
            existingPrefs &&
            typeof existingPrefs === 'object' &&
            'createdAt' in existingPrefs
        ) {
            finalCreatedAt =
                typeof existingPrefs.createdAt === 'string'
                    ? existingPrefs.createdAt
                    : null;
        }

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
            ...(finalCreatedAt ? { createdAt: finalCreatedAt } : {}) // Conditional spread - only add if exists
        };

        console.log('💾 [LOGIN] Saving userPrefsData to localStorage:', {
            hasCreatedAt: !!userPrefsData.createdAt,
            createdAt: userPrefsData.createdAt,
            hasMetadata: !!userPrefsData.metadata,
            hasProfile: !!userPrefsData.profile,
            tier: userPrefsData.tier
        });

        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, userPrefsData);

        try {
            console.log('📡 Updating lastLogin in database...');

            const cleanedAccountData = removeCreatedAtFromObject(accountData);

            const { prepareMetadataForAPI } = await import(
                '../utils/metadataCleaner'
            );
            const metadataToClean = {
                ...(cleanedAccountData.metadata || {}),
                lastActivity: cleanedAccountData.lastActivity,
                sessionId: cleanedAccountData.sessionId
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
        }

        const savedPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        console.log('✅ [LOGIN] Verified localStorage save:', {
            saved: !!savedPrefs,
            hasCreatedAt: !!savedPrefs?.createdAt,
            createdAt: savedPrefs?.createdAt,
            hasMetadata: !!savedPrefs?.metadata,
            hasProfile: !!savedPrefs?.profile
        });

        if (finalCreatedAt) {
            saveCreatedAtToUserPreferences(finalCreatedAt);
            console.log(
                '✅ [LOGIN] Saved createdAt to user preferences:',
                finalCreatedAt
            );

            if (!accountData.createdAt) {
                accountData.createdAt = finalCreatedAt;
                if (currentAccount) {
                    currentAccount = {
                        ...currentAccount,
                        createdAt: finalCreatedAt
                    };
                }
            }
        } else {
            console.warn(
                '⚠️ [LOGIN] No createdAt found anywhere - cannot save to user preferences'
            );
        }

        storageHelpers.set('sessionId', accountData.sessionId);

        console.log('🔗 localStorage updated, now notifying other tabs');

        notifyMagicLinkVerification(accountData);

        if (isNewAccount) {
            console.log(
                '🆕 New account created - showing new account created modal'
            );
            showNewAccountCreated();
        } else {
            console.log(
                '✅ Existing account found - showing account found modal'
            );
            showExistingAccountFound();
        }

        logSecurityEvent('LOGIN_SUCCESS', {
            userId: accountData.userId,
            email: accountData.email,
            method: 'frontend_magic_link_verification',
            sessionId: accountData.sessionId
        });

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

        console.log(
            '🔄 Refreshing user data after login (using already-loaded account data)...'
        );
        try {
            const { refreshUserSettings, refreshUsageHistory } = await import(
                './userDataStore'
            );
            await Promise.all([
                refreshUserSettings(true), // Force refresh (may call API, but settings are separate)
                refreshUsageHistory(false) // Use currentAccount data (already loaded!) - NO force to avoid duplicate API call
            ]);
            console.log(
                '✅ User data refreshed successfully (no duplicate API calls)'
            );
        } catch (error) {
            console.warn(
                '⚠️ Failed to refresh user data (non-critical):',
                error
            );
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

export async function logout(): Promise<void> {
    console.log('👋 [LOGOUT] Starting logout process...');

    logSecurityEvent('LOGOUT', {
        userId: currentAccount?.userId,
        email: currentAccount?.email
    });

    clearAllCache();
    console.log('✅ [LOGOUT] API cache cleared');

    try {
        syncAccountData(null);
        isLoggedIn = false;
        accountTier = 'free';
        console.log('✅ [LOGOUT] Account stores reset');

        const { userSettings, usageHistory } = await import('./userDataStore');

        userSettings.data = null;
        userSettings.isLoading = false;
        userSettings.hasError = false;
        userSettings.isCached = false;
        userSettings.lastUpdate = null;
        userSettings.errorMessage = null;

        usageHistory.data = [];
        usageHistory.isLoading = false;
        usageHistory.hasError = false;
        usageHistory.isCached = false;
        usageHistory.lastUpdate = null;
        usageHistory.errorMessage = null;
        usageHistory.stats = {
            total: 0,
            average: 0,
            max: 0,
            min: 0,
            trend: 'stable'
        };

        console.log('✅ [LOGOUT] User data stores reset');

        if (isDevelopment()) {
            const { resetDailyUsage } = await import('./dailyUsageStore');
            try {
                resetDailyUsage();
                console.log('✅ [LOGOUT] Daily usage reset (dev mode)');
            } catch (error) {
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

    try {
        sessionStorage.clear();

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

    if (currentAccount?.email) {
        clearLoginAttempts(currentAccount.email);
    }

    resetSessionFlags();
    console.log('✅ [LOGOUT] Session flags reset');

    console.log('🔄 [LOGOUT] Redirecting to home...');

    if (typeof window !== 'undefined') {
        setTimeout(() => {
            window.location.href = '/';
        }, 100);
    }

    console.log('✅ [LOGOUT] Logout complete!');
}

export function getCurrentAccount(): Account | null {
    return get(currentAccount);
}

// Session state flags moved to accountSession.ts

export async function initializeAccountFromCookies(
    forceRestore: boolean = false
): Promise<boolean> {
    try {
        const restoreState = getSessionRestoreState();
        const timeSinceLastRestore = Date.now() - restoreState.timestamp;

        if (restoreState.isRestoring && timeSinceLastRestore < 5000) {
            console.log('⏳ Session restore already in progress, skipping...');
            return restoreState.restored;
        }

        if (
            restoreState.restored &&
            !forceRestore &&
            timeSinceLastRestore < 5000
        ) {
            console.log('✅ Session already restored (recent), skipping...');
            return true;
        }

        console.log('🔐 [SESSION RESTORE] Starting session restoration...', {
            forceRestore,
            timeSinceLastRestore,
            previouslyRestored: restoreState.restored,
            currentStoreState: {
                isLoggedIn: isLoggedIn,
                hasAccount: !!currentAccount,
                email: currentAccount?.email
            }
        });

        setSessionRestoreState(true, false);

        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        const sessionId = getSessionId(); // Use local function, not storageHelpers.getSessionId

        if (!validateSession(userPrefs)) {
            console.log(
                '❌ [SESSION RESTORE] Invalid session, clearing session data'
            );
            try {
                localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
                localStorage.removeItem('sessionId');
                sessionStorage.clear();

                isLoggedIn = false;
                currentAccount = null;
                userProfile = null;
                accountTier = 'free';
            } catch (error) {
                console.warn(
                    '⚠️ [SESSION RESTORE] Failed to clear invalid session data:',
                    error
                );
            }
            setSessionRestoreState(false, false);
            return false;
        }

        const currentlyLoggedIn = isLoggedIn;
        const hasAccountData = !!currentAccount;

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
                    storeEmail: currentAccount?.email
                }
            );
            setSessionRestoreState(false, true);
            return true;
        }

        if (userPrefs.email && sessionId) {
            const createdAt = getCreatedAtFromUserPreferences();

            console.log(
                '📡 [SESSION RESTORE] Loading full account data from database...'
            );
            let accountInfo = null;
            let fullAccountResult = null;

            try {
                const isLocalhost =
                    typeof window !== 'undefined' &&
                    (window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1');

                if (isLocalhost) {
                    console.log(
                        '⚠️ [SESSION RESTORE] Localhost detected - Vercel API not available, trying direct n8n...'
                    );

                    try {
                        console.log(
                            '📡 [SESSION RESTORE - LOCALHOST] Fetching from n8n...'
                        );
                        const n8nResponse = await fetch(
                            'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    action: 'get',
                                    userId: userPrefs.userId,
                                    email: userPrefs.email
                                })
                            }
                        );

                        if (n8nResponse.ok) {
                            const n8nResult = await n8nResponse.json();
                            console.log(
                                '✅ [SESSION RESTORE - LOCALHOST] n8n data loaded:',
                                {
                                    success: n8nResult.success,
                                    hasMetadata: !!n8nResult.account?.metadata,
                                    hasUsageHistory:
                                        !!n8nResult.account?.metadata
                                            ?.usageHistory,
                                    usageHistoryLength:
                                        n8nResult.account?.metadata
                                            ?.usageHistory?.length || 0
                                }
                            );

                            if (n8nResult.success && n8nResult.account) {
                                let metadata = n8nResult.account.metadata;
                                if (typeof metadata === 'string') {
                                    try {
                                        metadata = JSON.parse(metadata);
                                    } catch (e) {
                                        console.warn(
                                            '⚠️ Failed to parse metadata:',
                                            e
                                        );
                                    }
                                }

                                fullAccountResult = {
                                    success: true,
                                    account: {
                                        ...n8nResult.account,
                                        metadata: metadata
                                    }
                                };

                                console.log(
                                    '✅ [SESSION RESTORE - LOCALHOST] Using n8n data!'
                                );
                            } else {
                                throw new Error('n8n returned no account data');
                            }
                        } else {
                            throw new Error(
                                `n8n returned ${n8nResponse.status}`
                            );
                        }
                    } catch (n8nError) {
                        console.warn(
                            '⚠️ [SESSION RESTORE - LOCALHOST] n8n failed:',
                            n8nError.message
                        );
                        throw new Error('Localhost: API not available');
                    }
                }

                if (!isLocalhost) {
                    fullAccountResult = await cachedFetchAccount(
                        userPrefs.userId,
                        userPrefs.email,
                        'get' // CRITICAL: Use 'get' not 'read' for n8n webhook!
                    );
                }

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
                    accountInfo = {
                        ...fullAccountResult.account,
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
                const isLocalhost =
                    typeof window !== 'undefined' &&
                    (window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1');

                if (isLocalhost) {
                    console.log(
                        '💡 [SESSION RESTORE - LOCALHOST] Using localStorage data (API not available locally)'
                    );
                } else {
                    console.warn(
                        '⚠️ [SESSION RESTORE] Failed to load from database, using cookies fallback:',
                        error.message
                    );
                }

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

            syncAccountData(accountInfo);

            console.log('✅ Account loaded from cookies:', accountInfo.email);

            const updatedLastLogin = new Date().toISOString();
            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                ...userPrefs,
                sessionExpires: new Date(
                    Date.now() + SESSION_TIMEOUT
                ).toISOString(),
                lastActivity: updatedLastLogin
            });

            console.log('✅ Session restored (READ-ONLY, no database write):', {
                userId: accountInfo.userId,
                email: accountInfo.email,
                action: 'READ_ONLY'
            });

            logSecurityEvent('SESSION_RESTORED', {
                email: accountInfo.email,
                userId: accountInfo.userId
            });

            setSessionRestoreState(false, true);
            return true;
        } else {
            console.log('❌ No valid session found in cookies');
            setSessionRestoreState(false, false);
        }
    } catch (error) {
        console.warn('Failed to load account from cookies:', error);
        logSecurityEvent('SESSION_LOAD_ERROR', {
            error: error instanceof Error ? error.message : String(error)
        });
        setSessionRestoreState(false, false);
    }

    return false;
}

// All helper functions moved to accountHelpers.ts

async function syncAccountData(
    accountData: Account | Partial<Account> | null
): Promise<void> {
    if (accountData) {
        console.log('🔄 [ACCOUNT DEBUG] syncAccountData: Raw data received:', {
            profileType: typeof accountData.profile,
            metadataType: typeof accountData.metadata,
            hasUserId: !!accountData.userId,
            userId: accountData.userId,
            email: accountData.email
        });

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
                lastEntry:
                    parsedMetadata.usageHistory?.[
                        parsedMetadata.usageHistory?.length - 1
                    ]
            }
        });

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

        const cleanAccountData = {
            ...accountData,
            profile: parsedProfile,
            metadata: parsedMetadata,
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

        const hasValidBackendCreatedAt =
            cleanAccountData.createdAt &&
            cleanAccountData.createdAt !== 'null' &&
            cleanAccountData.createdAt !== 'undefined' &&
            cleanAccountData.createdAt.trim &&
            cleanAccountData.createdAt.trim() !== '';

        if (!hasValidBackendCreatedAt) {
            const userPrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES,
                {}
            );
            if (userPrefs.createdAt) {
                cleanAccountData.createdAt = userPrefs.createdAt;
                console.log(
                    '🔄 syncAccountData: Backend has no valid createdAt - preserving existing from localStorage:',
                    cleanAccountData.createdAt
                );
            } else {
                console.warn(
                    '⚠️ syncAccountData: No createdAt found in accountData or localStorage - will not create new one'
                );
            }
        } else {
            console.log(
                '✅ syncAccountData: Using valid createdAt from accountData (API/Backend):',
                cleanAccountData.createdAt
            );
            saveCreatedAtToUserPreferences(cleanAccountData.createdAt);
        }

        isLoggedIn = true;
        currentAccount = cleanAccountData;
        userProfile = parsedProfile;
        accountTier = cleanAccountData.tier || 'free';

        console.log('✅ [ACCOUNT] Stores updated:', {
            isLoggedIn: true,
            tier: cleanAccountData.tier || 'free',
            hasProfile: !!parsedProfile,
            hasMetadata: !!parsedMetadata,
            hasSettings: !!parsedMetadata?.settings
        });

        try {
            let finalDailyUsage = parsedDailyUsage; // Use dailyUsage from accountData if available

            if (!finalDailyUsage) {
                console.log(
                    'ℹ️ [ACCOUNT DEBUG] No dailyUsage in accountData - loading from API/localStorage...'
                );
                const { initializeDailyUsage } = await import(
                    './dailyUsageStore'
                );
                finalDailyUsage = await initializeDailyUsage(cleanAccountData);
                console.log('✅ Daily usage initialized from API/localStorage');
            } else {
                console.log(
                    '✅ [ACCOUNT DEBUG] Using dailyUsage from accountData, syncing to dailyUsageStore...'
                );
                const { updateDailyLimitStore } = await import(
                    './dailyUsageStore'
                );
                if (updateDailyLimitStore) {
                    updateDailyLimitStore(finalDailyUsage);
                    console.log(
                        '✅ [ACCOUNT DEBUG] dailyUsage synced to dailyLimit store'
                    );
                }
            }

            if (finalDailyUsage) {
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

            try {
                const { refreshUsageHistory } = await import('./userDataStore');
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
            updateDailyLimit(
                true,
                cleanAccountData.tier,
                parsedMetadata?.dailyUsage?.used ||
                    cleanAccountData.usedGenerations ||
                    0
            );

            try {
                const { refreshUsageHistory } = await import('./userDataStore');
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
                dailyUsage: !!parsedMetadata?.dailyUsage,
                usageHistory: !!parsedMetadata?.usageHistory,
                usageHistoryLength: parsedMetadata?.usageHistory?.length
            }
        );
    } else {
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

        if (!hasSession && !hasPrefs) {
            console.log(
                '🔄 [ACCOUNT DEBUG] No valid session, resetting stores'
            );
            isLoggedIn = false;
            currentAccount = null;
            userProfile = null;
            accountTier = 'free';
            updateDailyLimit(false, 'free', 0); // Reset to guest limits
        } else {
            console.log(
                '✅ [ACCOUNT DEBUG] Valid session exists, keeping stores intact'
            );
        }
    }
}

export async function createAccount(
    userId: string,
    email: string,
    profile: Partial<UserProfile> = {},
    metadata: Partial<AccountMetadata> = {}
): Promise<APIResponse> {
    try {
        const { prepareMetadataForAPI, validateMetadataNoDuplicates } =
            await import('../utils/metadataCleaner');

        const metadataToSend = {
            ...metadata,
            usageHistory: metadata?.usageHistory || [] // Empty array for new accounts
        };

        const cleanedMetadata = prepareMetadataForAPI(metadataToSend, {
            source: 'createAccount'
        });

        validateMetadataNoDuplicates(cleanedMetadata, 'createAccount');

        console.log('🆕 Creating account with cleaned metadata:', {
            hasUsageHistory: !!cleanedMetadata.usageHistory,
            usageHistoryLength: cleanedMetadata.usageHistory?.length || 0,
            tier: metadata?.tier || 'free' // tier is separate column, not in metadata!
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

export async function getAccount(
    userId: string
): Promise<APIResponse & { account?: Account }> {
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

export async function updateAccount(
    userId: string,
    updates: Partial<Account> = {}
): Promise<APIResponse> {
    try {
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

export function hasExistingUserPreferences(): boolean {
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

export function getUserEmailFromPreferences(): string | null {
    try {
        const prefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        return prefs?.email || null;
    } catch (error) {
        console.warn('Error getting user email from preferences:', error);
        return null;
    }
}

export function hasValidUserSession(): boolean {
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

export function setupMagicLinkListener(): void {
    if (typeof window === 'undefined') return;

    console.log(
        '🔗 Setting up magic link listener for cross-tab communication'
    );

    window.addEventListener('message', event => {
        console.log('🔗 Received message:', event.data);

        if (
            event.source !== window ||
            event.data?.target === 'metamask-inpage'
        ) {
            console.log('🔗 Ignoring non-app message:', event.data?.target);
            return;
        }

        if (event.data && event.data.type === 'MAGIC_LINK_VERIFIED') {
            console.log('🔗 Magic link verified in another tab:', event.data);

            if (event.data.success && event.data.email) {
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
                    ...(createdAt ? { createdAt } : {})
                };

                console.log(
                    '🔗 Updating account state from cross-tab message:',
                    accountData
                );

                currentAccount = accountData;
                isLoggedIn = true;

                const userPrefsUpdate = {
                    email: accountData.email,
                    name: accountData.name,
                    userId: accountData.userId,
                    tier: accountData.tier,
                    lastLogin: accountData.lastLogin,
                    ...(createdAt ? { createdAt } : {}) // Only add if exists
                };

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

                showExistingAccountFound();

                logSecurityEvent('LOGIN_SUCCESS', {
                    userId: accountData.userId,
                    email: accountData.email,
                    method: 'magic_link_verification'
                });
            }
        }
    });

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

                    currentAccount = accountData;
                    isLoggedIn = true;

                    showExistingAccountFound();
                }
            } catch (error) {
                console.warn('Error parsing storage update:', error);
            }
        }
    });

    console.log('🔗 Magic link listener setup complete');
}

export function notifyMagicLinkVerification(
    accountData: Account | Partial<Account>
): void {
    if (typeof window === 'undefined') return;

    console.log(
        '🔗 Notifying all tabs about magic link verification:',
        accountData
    );

    if (!accountData || !accountData.email || !accountData.userId) {
        console.error('❌ Invalid account data for notification');
        return;
    }

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
        securityHash: btoa(
            `${accountData.email}_${accountData.userId}_${Date.now()}`
        ).substring(0, 16)
    };

    try {
        window.postMessage(message, window.location.origin);
        console.log('🔗 postMessage sent to all tabs:', message);
    } catch (error) {
        console.error('❌ Failed to send postMessage:', error);
    }

    const existingPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
    const preservedCreatedAt =
        accountData.createdAt || existingPrefs.createdAt || null;

    storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
        email: accountData.email,
        name: accountData.name,
        userId: accountData.userId,
        tier: accountData.tier,
        lastLogin: accountData.lastLogin,
        sessionId: accountData.sessionId,
        sessionExpires: accountData.sessionExpires,
        lastActivity: accountData.lastActivity,
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

function validateAccountingOperation(
    operation: AccountingOperation,
    data: AccountingOperationData
): AccountingValidation {
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };

    if (!operation || typeof operation !== 'string') {
        validation.isValid = false;
        validation.errors.push('Invalid operation type');
    }

    if (!data || typeof data !== 'object') {
        validation.isValid = false;
        validation.errors.push('Invalid data format');
    }

    const sessionId = getSessionId();
    const operationsRequiringSession = ['UPDATE_ACCOUNT', 'GET_ACCOUNT'];

    if (operationsRequiringSession.includes(operation) && !sessionId) {
        validation.isValid = false;
        validation.errors.push('No valid session found');
    }

    const clientFingerprint = generateClientFingerprint();
    if (!clientFingerprint) {
        validation.warnings.push('Client fingerprint generation failed');
    }

    const accountingKey = `accounting_${operation}_${
        currentAccount?.email || 'anonymous'
    }`;
    const lastOperation = sessionStorage.getItem(accountingKey);
    const now = Date.now();

    if (lastOperation && now - parseInt(lastOperation) < 1000) {
        validation.isValid = false;
        validation.errors.push('Accounting operation rate limit exceeded');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        validation.isValid = false;
        validation.errors.push('Invalid email format');
    }

    if (data.userId && typeof data.userId !== 'string') {
        validation.isValid = false;
        validation.errors.push('Invalid user ID format');
    }

    const validTiers = ['free', 'pro', 'guest'];
    if (data.tier && !validTiers.includes(data.tier)) {
        validation.isValid = false;
        validation.errors.push('Invalid account tier');
    }

    console.log('🔍 Accounting Validation:', {
        operation,
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings,
        timestamp: new Date().toISOString()
    });

    if (validation.isValid) {
        sessionStorage.setItem(accountingKey, now.toString());
    }

    return validation;
}

async function secureAccountingOperation(
    operation: AccountingOperation,
    data: AccountingOperationData
): Promise<unknown> {
    console.log('🔒 Starting secure accounting operation:', operation);

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

    logAccountingEvent('OPERATION_STARTED', {
        operation,
        data: { ...data, password: '[REDACTED]' } // Never log passwords
    });

    try {
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

        logAccountingEvent('OPERATION_SUCCESS', {
            operation,
            result: { success: true, userId: result?.userId || data.userId }
        });

        return result;
    } catch (error) {
        logAccountingEvent('OPERATION_FAILED', {
            operation,
            error: error.message,
            userId: data.userId
        });
        throw error;
    }
}

export {
    secureAccountingOperation,
    logAccountingEvent,
    validateAccountingOperation
};

export async function secureCreateAccount(
    userId: string,
    email: string,
    profile: Partial<UserProfile> = {},
    metadata: Partial<AccountMetadata> = {}
): Promise<unknown> {
    return secureAccountingOperation('CREATE_ACCOUNT', {
        userId,
        email,
        profile,
        metadata
    });
}

export async function secureUpdateAccount(
    userId: string,
    updates: Partial<Account> = {}
): Promise<unknown> {
    return secureAccountingOperation('UPDATE_ACCOUNT', {
        userId,
        updates
    });
}

export async function secureGetAccount(userId: string): Promise<unknown> {
    return secureAccountingOperation('GET_ACCOUNT', {
        userId
    });
}

export async function secureLoginWithMagicLink(
    email: string,
    name: string = '',
    dev: boolean = false
): Promise<unknown> {
    return secureAccountingOperation('LOGIN', {
        email,
        name,
        dev
    });
}

export async function secureVerifyMagicLink(
    token: string,
    email: string
): Promise<unknown> {
    return secureAccountingOperation('VERIFY_LOGIN', {
        token,
        email
    });
}
