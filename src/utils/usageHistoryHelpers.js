// src/utils/usageHistoryHelpers.js
// Helper functions for usage history management

/**
 * Load usage history from account metadata
 */
export function getUsageHistory(account) {
    try {
        const history = account?.metadata?.usageHistory || [];
        
        if (!Array.isArray(history)) {
            console.warn('⚠️ Usage history is not an array:', history);
            return [];
        }
        
        return history;
    } catch (error) {
        console.warn('⚠️ Failed to get usage history:', error);
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
    if (period === '1y') days = 365;
    
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
        
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
        
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
        '1y': 'Last Year'
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
        '1y': 'Letztes Jahr'
    };
    return labels[period] || period;
}

