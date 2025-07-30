// src/stores/accountStore.js
import { writable } from 'svelte/store';
import { WEBHOOKS } from '../config/api.js';
import {
    setAccountToken,
    getAccountToken,
    clearAccountToken,
    setSessionId,
    getSessionId,
    setUserPreferences,
    getUserPreferences,
    clearAllCookies
} from '../utils/cookies.js';
import {
    showMagicLinkSending,
    showMagicLinkSent,
    showMagicLinkVerifying,
    showMagicLinkVerified,
    showMagicLinkVerificationFailed,
    showAccountLoginSuccess,
    showAccountLogoutSuccess
} from './modalStore.js';

// Generate fantasy name with max 7 characters
function generateFantasyName() {
    const prefixes = [
        'Emoji',
        'Key',
        'Magic',
        'Star',
        'Moon',
        'Sun',
        'Fire',
        'Ice',
        'Wind',
        'Rain'
    ];
    const suffixes = [
        'Master',
        'Lord',
        'King',
        'Queen',
        'Wizard',
        'Knight',
        'Guard',
        'Hero',
        'Sage',
        'Mage'
    ];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    // Combine and limit to 7 characters
    let name = prefix + suffix;
    if (name.length > 7) {
        // Try shorter combinations
        const shortPrefixes = ['Key', 'Star', 'Moon', 'Sun', 'Fire', 'Ice'];
        const shortSuffixes = [
            'Lord',
            'King',
            'Queen',
            'Guard',
            'Hero',
            'Sage'
        ];

        const shortPrefix =
            shortPrefixes[Math.floor(Math.random() * shortPrefixes.length)];
        const shortSuffix =
            shortSuffixes[Math.floor(Math.random() * shortSuffixes.length)];

        name = shortPrefix + shortSuffix;

        // If still too long, truncate
        if (name.length > 7) {
            name = name.substring(0, 7);
        }
    }

    return name;
}

// Account stores
export const accountData = writable(null);
export const isLoggingIn = writable(false);
export const loginError = writable(null);

// Login with magic link
export async function loginWithMagicLink(email, name = '', userId = '') {
    try {
        isLoggingIn.set(true);
        loginError.set(null);

        // Show sending modal
        showMagicLinkSending(email);

        // Echte API für alle Umgebungen
        // Generate fantasy name if none provided
        const userName =
            name && name.trim() ? name.trim() : generateFantasyName();

        const response = await fetch(WEBHOOKS.ACCOUNT.MAGIC_LINK_SEND, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                name: userName,
                userId,
                language: 'en'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send magic link');
        }

        const result = await response.json();

        if (result.success) {
            // Show success modal
            showMagicLinkSent(email);

            // Store account data
            const accountInfo = {
                email,
                name: userName,
                userId,
                magicLinkSent: true,
                sentAt: new Date().toISOString()
            };

            // Set session ID if not exists
            if (!getSessionId()) {
                setSessionId();
            }

            // Store account data in cookies with 7-day session
            setUserPreferences({
                email,
                name: userName,
                userId,
                lastLogin: new Date().toISOString(),
                profile: {},
                tier: 'free',
                usedGenerations: 0,
                sessionExpires: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString() // 7 days
            });

            accountData.set(accountInfo);
            syncAccountData(accountInfo);

            return result;
        } else {
            throw new Error(result.error || 'Failed to send magic link');
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.set(error.message);
        throw error;
    } finally {
        isLoggingIn.set(false);
    }
}

// Verify magic link
export async function verifyMagicLink(token, email) {
    try {
        // Show verifying modal
        showMagicLinkVerifying(email);

        // Echte API für alle Umgebungen
        const response = await fetch(WEBHOOKS.ACCOUNT.MAGIC_LINK_VERIFY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                email
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to verify magic link');
        }

        const result = await response.json();

        if (result.success) {
            // Show success modal
            const verifiedName = accountData.get()?.name || 'User';
            showMagicLinkVerified(email, verifiedName);

            // Update account data with verified status
            const verifiedAccountInfo = {
                email,
                name: verifiedName,
                userId: accountData.get()?.userId || `user_${Date.now()}`,
                verified: true,
                verifiedAt: new Date().toISOString(),
                isLoggedIn: true,
                profile: {},
                tier: 'free',
                usedGenerations: 0
            };

            // Update account data
            accountData.set(verifiedAccountInfo);

            // Synchronize with all stores
            syncAccountData(verifiedAccountInfo);

            // Update cookies with verified status
            setUserPreferences({
                email,
                name: verifiedAccountInfo.name,
                userId: verifiedAccountInfo.userId,
                lastLogin: new Date().toISOString(),
                verified: true,
                verifiedAt: new Date().toISOString(),
                profile: {},
                tier: 'free',
                usedGenerations: 0,
                sessionExpires: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString() // 7 days
            });

            return result;
        } else {
            throw new Error(result.error || 'Failed to verify magic link');
        }
    } catch (error) {
        console.error('Verification error:', error);
        loginError.set(error.message);
        throw error;
    }
}

// Logout
export function logout() {
    // Show logout success modal
    showAccountLogoutSuccess();

    accountData.set(null);
    loginError.set(null);
    syncAccountData(null);

    // Clear all cookies
    clearAllCookies();
}

// Get current account data
export function getCurrentAccount() {
    let data;
    accountData.subscribe(value => (data = value))();
    return data;
}

// Initialize account from cookies on app start
export function initializeAccountFromCookies() {
    try {
        const preferences = getUserPreferences();
        const sessionId = getSessionId();

        // Check if session is still valid (7 days)
        const sessionExpires = preferences.sessionExpires;
        const isSessionValid =
            sessionExpires && new Date(sessionExpires) > new Date();

        if (preferences.email && sessionId && isSessionValid) {
            const accountInfo = {
                email: preferences.email,
                name: preferences.name || 'User',
                userId: preferences.userId || `user_${Date.now()}`,
                lastLogin: preferences.lastLogin,
                isLoggedIn: true,
                profile: preferences.profile || {},
                tier: preferences.tier || 'free',
                usedGenerations: preferences.usedGenerations || 0
            };

            // Update the main accountData store
            accountData.set(accountInfo);

            // Synchronize with all other stores
            syncAccountData(accountInfo);

            console.log('✅ Account loaded from cookies:', accountInfo.email);

            // Show login success modal
            showAccountLoginSuccess(accountInfo.name);

            // Renew session expiration
            setUserPreferences({
                ...preferences,
                sessionExpires: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString() // 7 days
            });

            return true;
        } else {
            if (!preferences.email || !sessionId) {
                console.log('❌ No valid session found in cookies');
            } else if (!isSessionValid) {
                console.log('❌ Session expired, clearing cookies');
                clearAllCookies();
            }
        }
    } catch (error) {
        console.warn('Failed to load account from cookies:', error);
    }

    return false;
}

// Import account stores from appStores for synchronization
import {
    isLoggedIn,
    currentAccount,
    userProfile,
    accountTier,
    dailyLimit
} from './appStores.js';

// Synchronize account data across stores
function syncAccountData(accountData) {
    if (accountData) {
        // Update all account-related stores
        isLoggedIn.set(true);
        currentAccount.set(accountData);
        userProfile.set(accountData.profile || {});
        accountTier.set(accountData.tier || 'free');

        // Set daily limit based on tier
        if (accountData.tier === 'pro') {
            dailyLimit.set({ limit: 999999, used: 0 }); // Unlimited for pro
        } else {
            dailyLimit.set({
                limit: 5,
                used: accountData.usedGenerations || 0
            });
        }
    } else {
        // Reset all stores when no account data
        isLoggedIn.set(false);
        currentAccount.set(null);
        userProfile.set(null);
        accountTier.set('free');
        dailyLimit.set({ limit: 5, used: 0 });
    }
}

// Account Management via n8n Workflow
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'create',
                userId,
                email,
                profile,
                metadata,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create account');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Create account error:', error);
        throw error;
    }
}

export async function getAccount(userId) {
    try {
        const response = await fetch(WEBHOOKS.ACCOUNT.CRUD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'update',
                userId,
                updates,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update account');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Update account error:', error);
        throw error;
    }
}
