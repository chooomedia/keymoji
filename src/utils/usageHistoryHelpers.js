// src/utils/usageHistoryHelpers.js
// Helper functions for usage history management

/**
 * Safe JSON parse helper (supports double-escaped JSON from Google Sheets)
 */
function safeJSONParse(data, fallback = {}) {
    if (!data) return fallback;
    if (typeof data === 'object' && data !== null) return data;
    if (typeof data === 'string') {
        try {
            let parsed = JSON.parse(data);
            if (typeof parsed === 'string') {
                console.log('⚠️ [USAGE HISTORY] Double-escaped JSON detected, parsing again...');
                try {
                    parsed = JSON.parse(parsed);
                    console.log('✅ [USAGE HISTORY] Successfully parsed double-escaped JSON');
                } catch (secondError) {
                    console.warn('⚠️ [USAGE HISTORY] Failed second parse:', secondError.message);
                    return fallback;
                }
            }
            return parsed;
        } catch (error) {
            console.warn('⚠️ [USAGE HISTORY] Failed to parse JSON:', error.message);
            return fallback;
        }
    }
    return fallback;
}

/**
 * Load usage history from account metadata
 * CRITICAL: Now PARSES JSON strings automatically!
 */
export function getUsageHistory(account) {
    try {
        console.log('📊 [USAGE HISTORY] getUsageHistory() called');
        console.log('📊 [USAGE HISTORY] Account input:', {
            hasAccount: !!account,
            hasMetadata: !!account?.metadata,
            metadataType: typeof account?.metadata,
            metadataKeys: account?.metadata ? Object.keys(account.metadata) : []
        });

        // Check if account exists
        if (!account || !account.metadata) {
            console.warn('⚠️ [USAGE HISTORY] No account or metadata');
            return [];
        }

        // CRITICAL: Parse metadata if it's a JSON string!
        const parsedMetadata = safeJSONParse(account.metadata, {});
        
        console.log('📊 [USAGE HISTORY] Parsed metadata:', {
            wasString: typeof account.metadata === 'string',
            hasUsageHistory: !!parsedMetadata.usageHistory,
            usageHistoryType: typeof parsedMetadata.usageHistory,
            isArray: Array.isArray(parsedMetadata.usageHistory)
        });

        // Get usageHistory from PARSED metadata
        const history = parsedMetadata.usageHistory || [];

        console.log('📊 [USAGE HISTORY] UsageHistory extracted:', {
            hasUsageHistory: !!parsedMetadata.usageHistory,
            type: typeof parsedMetadata.usageHistory,
            isArray: Array.isArray(history),
            length: history.length,
            firstEntry: history[0],
            lastEntry: history[history.length - 1]
        });

        if (!Array.isArray(history)) {
            console.error('❌ [USAGE HISTORY] UsageHistory is not an array!', {
                type: typeof history,
                value: history
            });
            return [];
        }

        if (history.length === 0) {
            console.warn('⚠️ [USAGE HISTORY] UsageHistory is empty array');
            console.log(
                '💡 [USAGE HISTORY] Check Google Sheets metadata column'
            );
        } else {
            console.log(
                '✅ [USAGE HISTORY] Returning',
                history.length,
                'entries'
            );
        }

        return history;
    } catch (error) {
        console.error('❌ [USAGE HISTORY] Failed to get usage history:', error);
        console.error('❌ [USAGE HISTORY] Error stack:', error.stack);
        return [];
    }
}

/**
 * Get usage history for specific time period
 */
export function getUsageHistoryForPeriod(account, period = '7d') {
    const history = getUsageHistory(account);
    const today = new Date();

    let days = 7;
    if (period === '14d') days = 14;
    if (period === '4w') days = 28;
    if (period === '3m') days = 90; // 3 months (~90 days)

    // Filter history for the period
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return history.filter(entry => {
        try {
            const entryDate = new Date(entry.date);
            return entryDate >= cutoffDate;
        } catch {
            return false;
        }
    });
}

/**
 * Calculate statistics from usage history
 */
export function calculateUsageStats(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return {
            total: 0,
            average: 0,
            max: 0,
            min: 0,
            trend: 'stable'
        };
    }

    const values = history.map(h => h.used || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calculate trend (last 3 days vs previous 3 days)
    let trend = 'stable';
    if (history.length >= 6) {
        const recent = history.slice(-3).map(h => h.used || 0);
        const previous = history.slice(-6, -3).map(h => h.used || 0);

        const recentAvg =
            recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const previousAvg =
            previous.reduce((sum, val) => sum + val, 0) / previous.length;

        if (recentAvg > previousAvg * 1.2) trend = 'up';
        if (recentAvg < previousAvg * 0.8) trend = 'down';
    }

    return {
        total,
        average: Math.round(average * 10) / 10,
        max,
        min,
        trend
    };
}

/**
 * Format period label
 */
export function formatPeriodLabel(period) {
    const labels = {
        '7d': 'Last 7 Days',
        '14d': 'Last 14 Days',
        '4w': 'Last 4 Weeks',
        '3m': 'Last 3 Months'
    };
    return labels[period] || period;
}

/**
 * Get period label in German
 */
export function formatPeriodLabelDE(period) {
    const labels = {
        '7d': 'Letzte 7 Tage',
        '14d': 'Letzte 14 Tage',
        '4w': 'Letzte 4 Wochen',
        '3m': 'Letzte 3 Monate'
    };
    return labels[period] || period;
}
