// src/utils/usageHistoryGenerator.js
// Generate test data for usage history charts

import { get } from 'svelte/store';
import { currentAccount, accountTier } from '../stores/appStores.js';
import { WEBHOOKS } from '../config/api.js';

/**
 * Generate realistic usage history data for testing
 */
export function generateTestUsageHistory(days = 28, tier = 'free') {
    const history = [];
    const today = new Date();

    // Determine limits based on tier
    const limit = tier === 'pro' ? 25 : 9;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Generate realistic usage patterns
        let used = 0;

        // Weekday vs Weekend pattern
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (isWeekend) {
            // Lower usage on weekends (30-60% of limit)
            used = Math.floor(limit * (0.3 + Math.random() * 0.3));
        } else {
            // Higher usage on weekdays (50-90% of limit)
            used = Math.floor(limit * (0.5 + Math.random() * 0.4));
        }

        // Add some randomness
        const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        used = Math.max(0, Math.min(limit, used + variance));

        history.push({
            date: dateStr,
            used: used,
            limit: limit,
            timestamp: date.toISOString()
        });
    }

    // Sort by date (newest first)
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Generate specific pattern data for demos
 */
export function generatePatternHistory(
    pattern = 'increasing',
    days = 28,
    tier = 'free'
) {
    const history = [];
    const today = new Date();
    const limit = tier === 'pro' ? 25 : 9;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        let used = 0;

        switch (pattern) {
            case 'increasing':
                // Gradually increasing usage
                used = Math.floor((i / days) * limit);
                break;

            case 'decreasing':
                // Gradually decreasing usage
                used = Math.floor(((days - i) / days) * limit);
                break;

            case 'stable':
                // Consistent usage around 70%
                used = Math.floor(limit * 0.7);
                break;

            case 'random':
            default:
                // Random usage
                used = Math.floor(Math.random() * limit);
                break;
        }

        history.push({
            date: dateStr,
            used: Math.max(0, Math.min(limit, used)),
            limit: limit,
            timestamp: date.toISOString()
        });
    }

    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Save generated history to account (API + currentAccount store)
 */
export async function saveHistoryToAccount(history) {
    try {
        const account = get(currentAccount);
        const tier = get(accountTier);

        if (!account || !account.userId) {
            throw new Error('No account found. Please login first.');
        }

        console.log('📊 Saving usage history to account:', {
            entries: history.length,
            userId: account.userId,
            tier: tier
        });

        // Update currentAccount store immediately (optimistic)
        currentAccount.update(acc => ({
            ...acc,
            metadata: {
                ...(acc.metadata || {}),
                usageHistory: history
            }
        }));

        console.log('✅ currentAccount updated with test history');

        // Save to API (if not localhost)
        if (window.location.hostname !== 'localhost') {
            const response = await fetch(WEBHOOKS.ACCOUNT.UPDATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    userId: account.userId,
                    email: account.email,
                    metadata: {
                        ...(account.metadata || {}),
                        usageHistory: history,
                        updatedAt: new Date().toISOString(),
                        updatedVia: 'test-data-generator'
                    },
                    lastLogin: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Usage history saved to API:', result);

            return result;
        } else {
            console.log(
                '⚠️ Localhost detected - API save skipped, only store updated'
            );
            return { success: true, message: 'Local only (localhost)' };
        }
    } catch (error) {
        console.error('❌ Failed to save usage history:', error);
        throw error;
    }
}

// ============================================
// QUICK COMMANDS (for browser console)
// ============================================

/**
 * Quick: Generate 4 weeks of realistic data for current account
 */
export async function generate4WeeksData() {
    try {
        const tier = get(accountTier) || 'free';
        const history = generateTestUsageHistory(28, tier);

        console.group('📊 Generating 4 Weeks Usage Data');
        console.log('Tier:', tier);
        console.log('Entries:', history.length);
        console.log('Sample:', history.slice(0, 3));
        console.groupEnd();

        await saveHistoryToAccount(history);

        console.log('✅ 4 weeks data generated successfully!');
        console.log('🔄 Reload page to see chart update');

        return history;
    } catch (error) {
        console.error('❌ Failed to generate 4 weeks data:', error);
        throw error;
    }
}

/**
 * Quick: Generate 7 days of increasing pattern
 */
export async function generate7DaysIncreasing() {
    try {
        const tier = get(accountTier) || 'free';
        const history = generatePatternHistory('increasing', 7, tier);

        await saveHistoryToAccount(history);

        console.log('✅ 7 days increasing data generated!');
        return history;
    } catch (error) {
        console.error('❌ Failed:', error);
        throw error;
    }
}

/**
 * Quick: Generate 1 year of data
 */
export async function generate1YearData() {
    try {
        const tier = get(accountTier) || 'free';
        const history = generateTestUsageHistory(365, tier);

        await saveHistoryToAccount(history);

        console.log('✅ 1 year data generated!');
        return history;
    } catch (error) {
        console.error('❌ Failed:', error);
        throw error;
    }
}

/**
 * Clear all usage history
 */
export async function clearUsageHistory() {
    try {
        await saveHistoryToAccount([]);
        console.log('✅ Usage history cleared');
    } catch (error) {
        console.error('❌ Failed to clear history:', error);
        throw error;
    }
}

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.keymojiUsageGenerator = {
        // Generators
        generate4Weeks: generate4WeeksData,
        generate7Days: generate7DaysIncreasing,
        generate1Year: generate1YearData,
        generateRealistic: (days, tier) => generateTestUsageHistory(days, tier),
        generatePattern: (pattern, days, tier) =>
            generatePatternHistory(pattern, days, tier),

        // Actions
        save: saveHistoryToAccount,
        clear: clearUsageHistory,

        // Quick Commands
        fillAccount: generate4WeeksData,
        fillYear: generate1YearData
    };

    console.log(
        '🔧 Usage History Generator available: window.keymojiUsageGenerator'
    );
    console.log('');
    console.log('📖 Quick Commands:');
    console.log(
        '  window.keymojiUsageGenerator.generate4Weeks()  // 4 weeks realistic data'
    );
    console.log(
        '  window.keymojiUsageGenerator.generate1Year()   // 1 year data'
    );
    console.log(
        '  window.keymojiUsageGenerator.clear()          // Clear history'
    );
}
