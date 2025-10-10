// src/utils/usageHistoryLoader.js

import { get } from 'svelte/store';
import { currentAccount, isLoggedIn } from '../stores/appStores.js';
import { WEBHOOKS } from '../config/api.js';
import { isDevelopment } from './environment.js';
import { cachedFetchUsageHistory } from './apiCache.js';

/**
 * Safe JSON parse helper (supports double-escaped JSON from Google Sheets)
 * CRITICAL: Same logic as in usageHistoryHelpers.js and accountStore.js
 */
function safeJSONParse(data, fallback = {}) {
    if (!data) return fallback;
    if (typeof data === 'object' && data !== null) return data;
    if (typeof data === 'string') {
        try {
            let parsed = JSON.parse(data);
            // Handle double-escaped JSON from Google Sheets
            if (typeof parsed === 'string') {
                console.log('⚠️ [USAGE LOADER] Double-escaped JSON detected, parsing again...');
                try {
                    parsed = JSON.parse(parsed);
                    console.log('✅ [USAGE LOADER] Successfully parsed double-escaped JSON');
                } catch (secondError) {
                    console.warn('⚠️ [USAGE LOADER] Failed second parse:', secondError.message);
                    return fallback;
                }
            }
            return parsed;
        } catch (error) {
            console.warn('⚠️ [USAGE LOADER] Failed to parse JSON:', error.message);
            return fallback;
        }
    }
    return fallback;
}

/**
 * Async loader for usage history data
 * Implements UX best practices: Loading states, error handling, retries
 */

/**
 * Load usage history from API
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {Promise<Array>} Usage history array
 */
export async function loadUsageHistory(userId = null, email = null) {
    try {
        console.log('📊 Loading usage history from API...');

        // Get user data from store if not provided
        const account = get(currentAccount);
        const loggedIn = get(isLoggedIn);

        if (!loggedIn) {
            console.warn('⚠️ User not logged in, no usage history available');
            return [];
        }

        const targetUserId = userId || account?.userId;
        const targetEmail = email || account?.email;

        if (!targetUserId || !targetEmail) {
            console.error(
                '❌ Missing userId or email for loading usage history'
            );
            return [];
        }

        // Skip API calls on localhost (CORS)
        if (isDevelopment() && window.location.hostname === 'localhost') {
            console.warn(
                '⚠️ Skipping API call on localhost (CORS), using currentAccount data'
            );
            
            // CRITICAL: Parse metadata if it's a JSON string!
            const parsedMetadata = safeJSONParse(account?.metadata, {});
            const history = parsedMetadata.usageHistory || [];
            
            console.log('📊 [LOCALHOST] Parsed metadata:', {
                hadMetadata: !!account?.metadata,
                wasString: typeof account?.metadata === 'string',
                hasUsageHistory: !!parsedMetadata.usageHistory,
                historyLength: history.length
            });
            
            return history;
        }

        console.log('📡 Fetching usage history (cached):', targetUserId);

        // Use cached fetch - prevents 429 errors, 1 hour TTL!
        const result = await cachedFetchUsageHistory(targetUserId, targetEmail);

        console.log('✅ API Response received:', {
            success: result.success,
            hasAccount: !!result.account,
            hasMetadata: !!result.account?.metadata,
            hasHistory: !!result.account?.metadata?.usageHistory
        });

        if (!result.success || !result.account) {
            throw new Error('Invalid API response structure');
        }

        // CRITICAL: Parse metadata from API response (could be JSON string!)
        const parsedMetadata = safeJSONParse(result.account?.metadata, {});
        const history = parsedMetadata.usageHistory || [];

        console.log('📊 Usage history loaded from API:', {
            hadMetadata: !!result.account?.metadata,
            wasString: typeof result.account?.metadata === 'string',
            entries: history.length,
            firstEntry: history[0],
            lastEntry: history[history.length - 1]
        });

        // Validate it's an array
        if (!Array.isArray(history)) {
            console.error('❌ Usage history is not an array:', typeof history);
            return [];
        }

        return history;
    } catch (error) {
        console.error('❌ Failed to load usage history:', error);
        throw error;
    }
}

/**
 * Load usage history with retry logic
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {number} maxRetries - Max retry attempts
 * @returns {Promise<Array>} Usage history array
 */
export async function loadUsageHistoryWithRetry(
    userId = null,
    email = null,
    maxRetries = 3
) {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(
                `📊 Loading usage history (Attempt ${attempt}/${maxRetries})...`
            );

            const history = await loadUsageHistory(userId, email);

            console.log(
                `✅ Usage history loaded successfully on attempt ${attempt}`
            );
            return history;
        } catch (error) {
            lastError = error;
            console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // All retries failed
    console.error(`❌ All ${maxRetries} attempts failed:`, lastError);
    throw lastError;
}

/**
 * Refresh usage history (force reload from API)
 * @returns {Promise<Array>} Updated usage history
 */
export async function refreshUsageHistory() {
    try {
        console.log('🔄 Refreshing usage history...');

        const account = get(currentAccount);

        if (!account?.userId) {
            console.warn('⚠️ No account to refresh');
            return [];
        }

        const history = await loadUsageHistoryWithRetry(
            account.userId,
            account.email
        );

        console.log('✅ Usage history refreshed:', history.length, 'entries');

        return history;
    } catch (error) {
        console.error('❌ Failed to refresh usage history:', error);
        throw error;
    }
}

/**
 * Check if usage history needs refresh
 * @param {Array} currentHistory - Current usage history
 * @returns {boolean} True if refresh needed
 */
export function shouldRefreshHistory(currentHistory) {
    if (!currentHistory || !Array.isArray(currentHistory)) {
        return true; // No history, need to load
    }

    if (currentHistory.length === 0) {
        return true; // Empty history, need to load
    }

    // Check if most recent entry is today
    const today = new Date().toISOString().split('T')[0];
    const mostRecent = currentHistory[0]; // Assuming sorted newest first

    if (mostRecent.date !== today) {
        console.log('📊 Most recent entry is not today, refresh recommended');
        return true;
    }

    return false;
}

/**
 * Preload usage history (non-blocking, for prefetching)
 * @param {string} userId - User ID
 * @param {string} email - User email
 */
export function preloadUsageHistory(userId = null, email = null) {
    // Fire and forget - don't wait for result
    loadUsageHistory(userId, email)
        .then(history => {
            console.log(
                '✅ Usage history preloaded:',
                history.length,
                'entries'
            );
        })
        .catch(error => {
            console.warn(
                '⚠️ Usage history preload failed (non-critical):',
                error
            );
        });
}
