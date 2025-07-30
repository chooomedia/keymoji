// src/stores/accountStore.js
import { writable } from 'svelte/store';
import { WEBHOOKS } from '../config/api.js';

// Account stores
export const accountData = writable(null);
export const isLoggingIn = writable(false);
export const loginError = writable(null);

// Login with magic link
export async function loginWithMagicLink(email, name = '', userId = '') {
    try {
        isLoggingIn.set(true);
        loginError.set(null);

        const response = await fetch(WEBHOOKS.ACCOUNT.MAGIC_LINK_SEND, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                name,
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
            // Store account data
            accountData.set({
                email,
                name,
                userId,
                magicLinkSent: true,
                sentAt: new Date().toISOString()
            });

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
            // Update account data with verified status
            accountData.update(data => ({
                ...data,
                verified: true,
                verifiedAt: new Date().toISOString()
            }));

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
    accountData.set(null);
    loginError.set(null);
}

// Get current account data
export function getCurrentAccount() {
    let data;
    accountData.subscribe(value => (data = value))();
    return data;
}
