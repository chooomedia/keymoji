// src/utils/chartDebugger.ts
// Comprehensive Chart Data Flow Debugger
// TypeScript Migration: v0.7.7

import {
    currentAccount,
    isLoggedIn,
    accountTier
} from '../stores/appStores';
import type { Account } from '../types/Account';

/**
 * Complete chart data flow debugger
 * Run in browser console: window.chartDebugger.fullDiagnosis()
 */
export function fullDiagnosis(): void {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 CHART DATA FLOW - COMPLETE DIAGNOSIS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    const account = currentAccount;
    const loggedIn = isLoggedIn;
    const tier = accountTier;

    // Step 1: Account State
    console.log('📊 STEP 1: Account Store State');
    console.log('─────────────────────────────────────────────────────');
    console.log('Is logged in:', loggedIn);
    console.log('Has account object:', !!account);
    console.log('User ID:', account?.userId || 'NOT FOUND');
    console.log('Email:', account?.email || 'NOT FOUND');
    console.log('Tier:', tier || 'NOT FOUND');
    console.log('');

    if (!account) {
        console.error('❌ PROBLEM: No account object in store!');
        console.log('💡 Solution: Login required or check session cookies');
        return;
    }

    // Step 2: Metadata Inspection
    console.log('📊 STEP 2: Metadata Inspection');
    console.log('─────────────────────────────────────────────────────');
    console.log('Has metadata:', !!account.metadata);
    console.log('Metadata type:', typeof account.metadata);

    if (typeof account.metadata === 'string') {
        console.error('❌ PROBLEM: Metadata is still a STRING (not parsed)!');
        console.log(
            'Raw metadata preview:',
            account.metadata.substring(0, 100) + '...'
        );
        console.log('💡 Solution: safeJSONParse() may not be working');
        console.log('💡 Try manual parse:');
        console.log(
            '   window.$currentAccount.metadata = JSON.parse(window.$currentAccount.metadata)'
        );
        return;
    }

    console.log('✅ Metadata is an object (correctly parsed)');
    console.log('');

    // Step 3: UsageHistory Inspection
    console.log('📊 STEP 3: UsageHistory Inspection');
    console.log('─────────────────────────────────────────────────────');
    console.log('Has usageHistory field:', !!account.metadata?.usageHistory);
    console.log('UsageHistory type:', typeof account.metadata?.usageHistory);
    console.log(
        'UsageHistory is array:',
        Array.isArray(account.metadata?.usageHistory)
    );
    console.log(
        'UsageHistory length:',
        account.metadata?.usageHistory?.length || 0
    );

    if (!account.metadata?.usageHistory) {
        console.error('❌ PROBLEM: No usageHistory field in metadata!');
        console.log(
            'Available metadata fields:',
            Object.keys(account.metadata || {})
        );
        console.log(
            '💡 Solution: Update Google Sheets metadata with usageHistory array'
        );
        console.log('💡 Use string from: GOOGLE_SHEETS_COMPLETE_ROW_CM.md');
        return;
    }

    if (!Array.isArray(account.metadata.usageHistory)) {
        console.error('❌ PROBLEM: usageHistory is not an array!');
        console.log('Actual type:', typeof account.metadata.usageHistory);
        console.log('💡 Solution: Check n8n workflow parsing');
        return;
    }

    if (account.metadata.usageHistory.length === 0) {
        console.error('❌ PROBLEM: usageHistory is empty array!');
        console.log(
            '💡 Solution: Add data to Google Sheets metadata.usageHistory'
        );
        return;
    }

    console.log(
        '✅ UsageHistory is a valid array with',
        account.metadata.usageHistory.length,
        'entries'
    );
    console.log('');

    // Step 4: Data Quality Check
    console.log('📊 STEP 4: Data Quality Check');
    console.log('─────────────────────────────────────────────────────');

    const history = account.metadata.usageHistory;
    const firstEntry = history[0];
    const lastEntry = history[history.length - 1];

    console.log('First entry:', firstEntry);
    console.log('Last entry:', lastEntry);
    console.log(
        'Date range:',
        `${lastEntry?.date || 'unknown'} to ${firstEntry?.date || 'unknown'}`
    );

    // Check data structure
    const hasValidStructure = history.every(
        entry =>
            entry.date &&
            typeof entry.used === 'number' &&
            typeof entry.limit === 'number'
    );

    console.log('All entries have valid structure:', hasValidStructure);

    if (!hasValidStructure) {
        console.error('❌ PROBLEM: Some entries have invalid structure!');
        const invalidEntries = history.filter(
            e =>
                !e.date ||
                typeof e.used !== 'number' ||
                typeof e.limit !== 'number'
        );
        console.log('Invalid entries:', invalidEntries);
        return;
    }

    // Check for non-zero values
    const nonZeroEntries = history.filter(e => e.used > 0);
    console.log('Entries with data (used > 0):', nonZeroEntries.length);

    if (nonZeroEntries.length === 0) {
        console.warn('⚠️ WARNING: All entries have used = 0');
        console.log('💡 This will show a flat line on chart');
    }

    console.log('✅ Data quality check passed');
    console.log('');

    // Step 5: Chart Data Generation Simulation
    console.log('📊 STEP 5: Chart Data Generation Simulation');
    console.log('─────────────────────────────────────────────────────');

    const period = '4w';
    const days = 28;
    const today = new Date();
    const chartData: Array<{ date: string; value: number; found: boolean }> = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const historyEntry = history.find(h => h.date === dateStr);
        const value = historyEntry?.used || 0;

        chartData.push({
            date: dateStr,
            value: value,
            found: !!historyEntry
        });
    }

    console.log('Generated chart data points:', chartData.length);
    console.log(
        'Points with matching history:',
        chartData.filter(d => d.found).length
    );
    console.log(
        'Points with value > 0:',
        chartData.filter(d => d.value > 0).length
    );
    console.log('');
    console.log('Sample chart data (first 5):', chartData.slice(0, 5));
    console.log('Sample chart data (last 5):', chartData.slice(-5));

    if (chartData.filter(d => d.value > 0).length === 0) {
        console.error('❌ PROBLEM: No data points match current date range!');
        console.log('💡 Possible causes:');
        console.log('   1. Date format mismatch');
        console.log('   2. Timezone issues');
        console.log('   3. History dates are in the future or too old');
        console.log('');
        console.log(
            'History date range:',
            `${lastEntry.date} to ${firstEntry.date}`
        );
        console.log(
            'Chart expecting:',
            `${chartData[0].date} to ${chartData[chartData.length - 1].date}`
        );
        return;
    }

    console.log('✅ Chart data generation successful');
    console.log('');

    // Step 6: Final Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ DIAGNOSIS COMPLETE - ALL CHECKS PASSED!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('Summary:');
    console.log('  • Account: ✅ Valid');
    console.log('  • Metadata: ✅ Parsed correctly');
    console.log('  • UsageHistory: ✅', history.length, 'entries');
    console.log(
        '  • Chart Data: ✅',
        chartData.filter(d => d.value > 0).length,
        'points'
    );
    console.log('');
    console.log('📊 Expected Chart:');
    console.log('  • Period: 4 weeks (28 days)');
    console.log(
        '  • Date range:',
        `${chartData[0].date} to ${chartData[chartData.length - 1].date}`
    );
    console.log('  • Data points:', chartData.filter(d => d.value > 0).length);
    console.log('  • Color: Yellow (FREE tier)');
    console.log('  • Max value: 9');
    console.log('');
    console.log('🎯 Next: Navigate to /account and check if chart renders');
}

/**
 * Quick check - returns true if everything is OK
 */
export function quickCheck(): boolean {
    const account = currentAccount;

    const checks = {
        hasAccount: !!account,
        hasMetadata: !!account?.metadata,
        metadataIsObject: typeof account?.metadata === 'object',
        hasUsageHistory: !!account?.metadata?.usageHistory,
        usageHistoryIsArray: Array.isArray(account?.metadata?.usageHistory),
        usageHistoryLength: account?.metadata?.usageHistory?.length || 0
    };

    console.log('🔍 Quick Check:', checks);

    const allGood = Object.values(checks).every(v => v === true || (typeof v === 'number' && v > 0));

    if (allGood) {
        console.log('✅ All checks passed!');
    } else {
        console.error('❌ Some checks failed!');
        Object.entries(checks).forEach(([key, value]) => {
            const icon = value ? '✅' : '❌';
            console.log(`${icon} ${key}:`, value);
        });
    }

    return allGood;
}

/**
 * Force parse metadata if it's still a string
 */
export function forceParseMetadata(): boolean {
    const account = currentAccount;

    if (!account) {
        console.error('❌ No account in store');
        return false;
    }

    if (typeof account.metadata === 'string') {
        console.log('🔧 Metadata is string, parsing...');
        try {
            account.metadata = JSON.parse(account.metadata) as Account['metadata'];
            console.log('✅ Metadata parsed successfully!');
            console.log(
                'UsageHistory length:',
                (account.metadata as Record<string, unknown>)?.usageHistory ? 
                    (account.metadata as { usageHistory: unknown[] }).usageHistory.length : 0
            );
            return true;
        } catch (error) {
            console.error('❌ Failed to parse metadata:', error);
            return false;
        }
    } else {
        console.log('✅ Metadata is already an object');
        return true;
    }
}

/**
 * Inject test data for immediate testing
 */
export function injectTestData(): boolean {
    const account = currentAccount;

    if (!account) {
        console.error('❌ No account in store');
        return false;
    }

    console.log('💉 Injecting test data...');

    // Generate 28 days of test data
    const today = new Date();
    const usageHistory: Array<{ date: string; used: number; limit: number; timestamp: string }> = [];

    for (let i = 0; i < 28; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        usageHistory.push({
            date: dateStr,
            used: Math.floor(Math.random() * 8) + 2, // 2-9
            limit: 9,
            timestamp: new Date(date).toISOString()
        });
    }

    // Update account (Svelte 5 Runes - direkte Zuweisung)
    if (account.metadata && typeof account.metadata === 'object') {
        (account.metadata as Record<string, unknown>).usageHistory = usageHistory;
    } else {
        account.metadata = { usageHistory } as Account['metadata'];
    }

    console.log('✅ Test data injected:', usageHistory.length, 'entries');
    console.log('🔄 Reload page or navigate to /account to see chart');

    return true;
}

/**
 * Export for debugging in console
 */
if (typeof window !== 'undefined') {
    (window as { chartDebugger?: typeof chartDebugger }).chartDebugger = {
        fullDiagnosis,
        quickCheck,
        forceParseMetadata,
        injectTestData
    };

    console.log('🔧 Chart Debugger loaded!');
    console.log('   Run: window.chartDebugger.fullDiagnosis()');
    console.log('   Run: window.chartDebugger.quickCheck()');
    console.log('   Run: window.chartDebugger.forceParseMetadata()');
    console.log('   Run: window.chartDebugger.injectTestData()');
}

const chartDebugger = {
    fullDiagnosis,
    quickCheck,
    forceParseMetadata,
    injectTestData
};

export default chartDebugger;

