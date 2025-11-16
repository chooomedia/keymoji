// src/utils/instantChartTest.js
// Instant Chart Data Verification & Testing

import { get } from 'svelte/store';
import { currentAccount } from '../stores/appStores'

/**
 * INSTANT TEST - Run immediately after login
 * Browser console: window.instantChartTest()
 */
export function instantChartTest() {
    console.clear();
    console.log('═══════════════════════════════════════════════════════');
    console.log('⚡ INSTANT CHART DATA TEST');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    const account = get(currentAccount);

    // TEST 1: Account exists
    console.log('TEST 1: Account Store');
    console.log('─────────────────────────');
    if (!account) {
        console.error('❌ FAIL: No account in store');
        console.log('💡 Solution: Login required');
        return false;
    }
    console.log('✅ PASS: Account exists');
    console.log('   User:', account.email);
    console.log('   UserId:', account.userId);
    console.log('');

    // TEST 2: Metadata is object
    console.log('TEST 2: Metadata Type');
    console.log('─────────────────────────');
    console.log('   Type:', typeof account.metadata);
    if (typeof account.metadata !== 'object' || account.metadata === null) {
        console.error('❌ FAIL: Metadata is not an object!');
        console.log('   Current type:', typeof account.metadata);
        if (typeof account.metadata === 'string') {
            console.log(
                '💡 Solution: Run window.chartDebugger.forceParseMetadata()'
            );
        }
        return false;
    }
    console.log('✅ PASS: Metadata is object');
    console.log('');

    // TEST 3: UsageHistory exists
    console.log('TEST 3: UsageHistory Field');
    console.log('─────────────────────────');
    console.log('   Metadata keys:', Object.keys(account.metadata));
    console.log('   Has usageHistory:', !!account.metadata.usageHistory);
    if (!account.metadata.usageHistory) {
        console.error('❌ FAIL: No usageHistory field in metadata!');
        console.log('💡 Solution: Update Google Sheets with complete metadata');
        console.log('💡 See: GOOGLE_SHEETS_COMPLETE_ROW_CM.md');
        return false;
    }
    console.log('✅ PASS: UsageHistory field exists');
    console.log('');

    // TEST 4: UsageHistory is array
    console.log('TEST 4: UsageHistory Type');
    console.log('─────────────────────────');
    console.log('   Type:', typeof account.metadata.usageHistory);
    console.log('   Is Array:', Array.isArray(account.metadata.usageHistory));
    if (!Array.isArray(account.metadata.usageHistory)) {
        console.error('❌ FAIL: UsageHistory is not an array!');
        console.log('   Current type:', typeof account.metadata.usageHistory);
        console.log('💡 Solution: Check n8n workflow parsing');
        return false;
    }
    console.log('✅ PASS: UsageHistory is array');
    console.log('');

    // TEST 5: UsageHistory has data
    console.log('TEST 5: UsageHistory Length');
    console.log('─────────────────────────');
    const history = account.metadata.usageHistory;
    console.log('   Length:', history.length);
    if (history.length === 0) {
        console.error('❌ FAIL: UsageHistory is empty!');
        console.log('💡 Quick Fix: window.chartDebugger.injectTestData()');
        console.log('💡 Permanent Fix: Update Google Sheets');
        return false;
    }
    console.log('✅ PASS: UsageHistory has', history.length, 'entries');
    console.log('');

    // TEST 6: Data structure validation
    console.log('TEST 6: Data Structure');
    console.log('─────────────────────────');
    console.log('   First entry:', history[0]);
    console.log('   Last entry:', history[history.length - 1]);

    const hasValidStructure = history.every(
        e => e.date && typeof e.used === 'number' && typeof e.limit === 'number'
    );

    if (!hasValidStructure) {
        console.error('❌ FAIL: Some entries have invalid structure!');
        return false;
    }
    console.log('✅ PASS: All entries have valid structure');
    console.log('');

    // TEST 7: Date range check
    console.log('TEST 7: Date Range');
    console.log('─────────────────────────');
    const firstDate = history[0]?.date;
    const lastDate = history[history.length - 1]?.date;
    console.log('   Range:', lastDate, 'to', firstDate);

    const today = new Date().toISOString().split('T')[0];
    const isToday = history.some(e => e.date === today);

    if (!isToday) {
        console.warn('⚠️ WARNING: No entry for today!');
        console.log('   Today:', today);
        console.log('   Latest entry:', firstDate);
    } else {
        console.log('✅ PASS: History includes today');
    }
    console.log('');

    // TEST 8: Non-zero values
    console.log('TEST 8: Data Values');
    console.log('─────────────────────────');
    const nonZeroEntries = history.filter(e => e.used > 0);
    console.log('   Entries with used > 0:', nonZeroEntries.length);
    console.log('   Total entries:', history.length);

    if (nonZeroEntries.length === 0) {
        console.warn('⚠️ WARNING: All values are 0 (chart will be flat)');
    } else {
        console.log('✅ PASS:', nonZeroEntries.length, 'entries with data');
    }
    console.log('');

    // FINAL SUMMARY
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Chart Data Summary:');
    console.log('   • Total entries:', history.length);
    console.log('   • Date range:', lastDate, 'to', firstDate);
    console.log('   • Non-zero values:', nonZeroEntries.length);
    console.log(
        '   • Average used:',
        Math.round(
            (history.reduce((sum, e) => sum + e.used, 0) / history.length) * 10
        ) / 10
    );
    console.log('');
    console.log('🎯 Expected Chart:');
    console.log('   • Should show', history.length, 'data points');
    console.log('   • Yellow line (FREE tier)');
    console.log('   • Y-axis: 0-9');
    console.log('   • Animated on first load');
    console.log('');
    console.log('✅ If chart is not visible:');
    console.log('   1. Navigate to /account page');
    console.log('   2. Click "4w" time period button');
    console.log('   3. Check browser console for [CHART DEBUG] logs');
    console.log('');

    return true;
}

/**
 * Show current chart data state
 */
export function showChartData() {
    const account = get(currentAccount);
    const history = account?.metadata?.usageHistory || [];

    console.log('📊 Current Chart Data:');
    console.table(history);

    return history;
}

/**
 * Verify data can generate chart
 */
export function verifyChartGeneration() {
    const account = get(currentAccount);
    const history = account?.metadata?.usageHistory || [];

    if (history.length === 0) {
        console.error('❌ No data to generate chart');
        return [];
    }

    // Simulate chart data generation for 4w
    const today = new Date();
    const chartData = [];

    for (let i = 27; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const entry = history.find(h => h.date === dateStr);
        chartData.push({
            date: dateStr,
            value: entry?.used || 0,
            found: !!entry,
            source: entry ? 'history' : 'generated'
        });
    }

    console.log('📊 Chart Generation Test (4w):');
    console.log('   Total points:', chartData.length);
    console.log(
        '   Points from history:',
        chartData.filter(d => d.found).length
    );
    console.log(
        '   Points with value > 0:',
        chartData.filter(d => d.value > 0).length
    );
    console.log('');
    console.table(chartData);

    return chartData;
}

// Auto-export to window for easy access
if (typeof window !== 'undefined') {
    window.instantChartTest = instantChartTest;
    window.showChartData = showChartData;
    window.verifyChartGeneration = verifyChartGeneration;

    console.log('⚡ Instant Chart Test loaded!');
    console.log('   Quick test: window.instantChartTest()');
    console.log('   Show data: window.showChartData()');
    console.log('   Verify gen: window.verifyChartGeneration()');
}
