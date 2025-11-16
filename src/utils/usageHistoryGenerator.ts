/**
 * Generate test data for usage history charts
 * TypeScript Migration: v0.7.7
 */

import { currentAccount, accountTier } from '../stores/appStores.ts';
import { WEBHOOKS } from '../config/api';
import type { Account } from '../types/Account';
import type { UsageHistoryEntry } from '../types/Account';

export type UsagePattern = 'increasing' | 'decreasing' | 'stable' | 'random';

export interface UsageHistoryEntryExtended extends UsageHistoryEntry {
    date: string;
    used: number;
    limit: number;
    timestamp: string;
}

/**
 * Generate realistic usage history data for testing
 * @param days - Number of days to generate (default: 28)
 * @param tier - Account tier ('free' or 'pro', default: 'free')
 * @returns Array of usage history entries
 */
export function generateTestUsageHistory(
    days: number = 28,
    tier: 'free' | 'pro' = 'free'
): UsageHistoryEntryExtended[] {
    const history: UsageHistoryEntryExtended[] = [];
    const today = new Date();

    // Determine limits based on tier
    const limit = tier === 'pro' ? 35 : 9; // PRO: 35, FREE: 9

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
            timestamp: date.toISOString(),
            type: 'generation'
        });
    }

    // Sort by date (newest first)
    return history.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/**
 * Generate specific pattern data for demos
 * @param pattern - Pattern type ('increasing', 'decreasing', 'stable', 'random')
 * @param days - Number of days to generate (default: 28)
 * @param tier - Account tier ('free' or 'pro', default: 'free')
 * @returns Array of usage history entries
 */
export function generatePatternHistory(
    pattern: UsagePattern = 'increasing',
    days: number = 28,
    tier: 'free' | 'pro' = 'free'
): UsageHistoryEntryExtended[] {
    const history: UsageHistoryEntryExtended[] = [];
    const today = new Date();
    const limit = tier === 'pro' ? 35 : 9; // PRO: 35, FREE: 9

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
            timestamp: date.toISOString(),
            type: 'generation'
        });
    }

    return history.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

/**
 * Save generated history to account (API + currentAccount store)
 * @param history - Usage history entries to save
 * @returns Result object
 */
export async function saveHistoryToAccount(
    history: UsageHistoryEntryExtended[]
): Promise<{ success: boolean; message?: string }> {
    try {
        const account = currentAccount;
        const tier = accountTier;

        if (!account || !account.userId) {
            throw new Error('No account found. Please login first.');
        }

        console.log('📊 Saving usage history to account:', {
            entries: history.length,
            userId: account.userId,
            tier: tier
        });

        // Update currentAccount store immediately (optimistic)
        currentAccount.update((acc: Account | null) => {
            if (!acc) return acc;
            return {
                ...acc,
                metadata: {
                    ...(acc.metadata || {}),
                    usageHistory: history
                }
            };
        });

        console.log('✅ currentAccount updated with test history');

        // Save to API (if not localhost)
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
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

            const result = await response.json() as { success: boolean };
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
export async function generate4WeeksData(): Promise<UsageHistoryEntryExtended[]> {
    try {
        const tier = accountTier || 'free';
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
export async function generate7DaysIncreasing(): Promise<UsageHistoryEntryExtended[]> {
    try {
        const tier = accountTier || 'free';
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
export async function generate1YearData(): Promise<UsageHistoryEntryExtended[]> {
    try {
        const tier = accountTier || 'free';
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
export async function clearUsageHistory(): Promise<void> {
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
    (window as unknown as {
        keymojiUsageGenerator?: {
            generate4Weeks: () => Promise<UsageHistoryEntryExtended[]>;
            generate7Days: () => Promise<UsageHistoryEntryExtended[]>;
            generate1Year: () => Promise<UsageHistoryEntryExtended[]>;
            generateRealistic: (
                days: number,
                tier: 'free' | 'pro'
            ) => UsageHistoryEntryExtended[];
            generatePattern: (
                pattern: UsagePattern,
                days: number,
                tier: 'free' | 'pro'
            ) => UsageHistoryEntryExtended[];
            save: (history: UsageHistoryEntryExtended[]) => Promise<{ success: boolean; message?: string }>;
            clear: () => Promise<void>;
            fillAccount: () => Promise<UsageHistoryEntryExtended[]>;
            fillYear: () => Promise<UsageHistoryEntryExtended[]>;
        };
    }).keymojiUsageGenerator = {
        // Generators
        generate4Weeks: generate4WeeksData,
        generate7Days: generate7DaysIncreasing,
        generate1Year: generate1YearData,
        generateRealistic: (days: number, tier: 'free' | 'pro') =>
            generateTestUsageHistory(days, tier),
        generatePattern: (pattern: UsagePattern, days: number, tier: 'free' | 'pro') =>
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

