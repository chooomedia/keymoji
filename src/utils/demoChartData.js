// src/utils/demoChartData.js
// Static Demo Dataset for SVG Chart (when no real data available)
// This is FIXED data (not random!) for consistent UX

/**
 * Static demo dataset - shows what the chart looks like with data
 * This is ALWAYS the same (not random!) for predictable UX
 */
export const DEMO_USAGE_HISTORY = [
    // Last 7 days - moderate usage pattern
    { date: '2025-10-10', used: 6, limit: 9 },
    { date: '2025-10-09', used: 7, limit: 9 },
    { date: '2025-10-08', used: 5, limit: 9 },
    { date: '2025-10-07', used: 8, limit: 9 },
    { date: '2025-10-06', used: 6, limit: 9 },
    { date: '2025-10-05', used: 4, limit: 9 },
    { date: '2025-10-04', used: 7, limit: 9 }
];

/**
 * Extended demo dataset (4 weeks) - for time period selector
 */
export const DEMO_USAGE_HISTORY_4W = [
    ...DEMO_USAGE_HISTORY,
    { date: '2025-10-03', used: 6, limit: 9 },
    { date: '2025-10-02', used: 5, limit: 9 },
    { date: '2025-10-01', used: 7, limit: 9 },
    { date: '2025-09-30', used: 8, limit: 9 },
    { date: '2025-09-29', used: 6, limit: 9 },
    { date: '2025-09-28', used: 5, limit: 9 },
    { date: '2025-09-27', used: 7, limit: 9 },
    { date: '2025-09-26', used: 6, limit: 9 },
    { date: '2025-09-25', used: 8, limit: 9 },
    { date: '2025-09-24', used: 5, limit: 9 },
    { date: '2025-09-23', used: 7, limit: 9 },
    { date: '2025-09-22', used: 6, limit: 9 },
    { date: '2025-09-21', used: 8, limit: 9 },
    { date: '2025-09-20', used: 5, limit: 9 },
    { date: '2025-09-19', used: 7, limit: 9 },
    { date: '2025-09-18', used: 6, limit: 9 },
    { date: '2025-09-17', used: 5, limit: 9 },
    { date: '2025-09-16', used: 8, limit: 9 },
    { date: '2025-09-15', used: 6, limit: 9 },
    { date: '2025-09-14', used: 7, limit: 9 },
    { date: '2025-09-13', used: 5, limit: 9 }
];

/**
 * Check if usage history is demo data (not real from backend)
 */
export function isDemoData(history) {
    if (!history || !Array.isArray(history) || history.length === 0) {
        return false;
    }

    // Check if first entry matches demo data
    const firstEntry = history[0];
    const firstDemo = DEMO_USAGE_HISTORY[0];

    return (
        firstEntry.date === firstDemo.date &&
        firstEntry.used === firstDemo.used &&
        firstEntry.limit === firstDemo.limit
    );
}

/**
 * Get appropriate demo dataset based on selected period
 */
export function getDemoDataForPeriod(period = '7d') {
    switch (period) {
        case '7d':
            return DEMO_USAGE_HISTORY.slice(0, 7);
        case '14d':
            return DEMO_USAGE_HISTORY_4W.slice(0, 14);
        case '4w':
        case '3m':
            return DEMO_USAGE_HISTORY_4W;
        default:
            return DEMO_USAGE_HISTORY;
    }
}
