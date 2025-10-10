// src/utils/chartTestData.js
// Debug: Inject test data directly into AccountManager for chart testing

import { get } from 'svelte/store';
import { currentAccount } from '../stores/appStores.js';

/**
 * Generate PRO user mock data (high usage pattern)
 */
export function generateProMockData(days = 28) {
    const history = [];
    const today = new Date();
    const limit = 25; // PRO limit

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // PRO users: High usage (70-95% of limit)
        const used = Math.floor(limit * (0.7 + Math.random() * 0.25));

        history.push({
            date: dateStr,
            used: used,
            limit: limit,
            timestamp: date.toISOString()
        });
    }

    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Generate FREE user mock data (medium usage pattern)
 */
export function generateFreeMockData(days = 28) {
    const history = [];
    const today = new Date();
    const limit = 9; // FREE limit

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // FREE users: Medium usage (40-80% of limit)
        const used = Math.floor(limit * (0.4 + Math.random() * 0.4));

        history.push({
            date: dateStr,
            used: used,
            limit: limit,
            timestamp: date.toISOString()
        });
    }

    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Generate dramatic pattern for animation showcase
 */
export function generateDramaticPattern(days = 14, tier = 'pro') {
    const history = [];
    const today = new Date();
    const limit = tier === 'pro' ? 25 : 9;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Create wave pattern (sine wave)
        const phase = (i / days) * Math.PI * 2;
        const wave = Math.sin(phase);
        const used = Math.floor(((wave + 1) / 2) * limit); // Normalize to 0-limit

        history.push({
            date: dateStr,
            used: Math.max(0, used),
            limit: limit,
            timestamp: date.toISOString()
        });
    }

    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Inject mock data into currentAccount store (for instant testing)
 */
export function injectMockData(mockHistory) {
    try {
        const account = get(currentAccount);

        if (!account) {
            console.error('❌ No account found. Please login first.');
            return false;
        }

        // Update currentAccount with mock history
        currentAccount.update(acc => ({
            ...acc,
            metadata: {
                ...(acc.metadata || {}),
                usageHistory: mockHistory
            }
        }));

        console.log(
            '✅ Mock data injected into currentAccount:',
            mockHistory.length,
            'entries'
        );
        console.log('🔄 Chart should update immediately (reactive)');

        return true;
    } catch (error) {
        console.error('❌ Failed to inject mock data:', error);
        return false;
    }
}

// ============================================
// QUICK COMMANDS FOR DEBUG
// ============================================

/**
 * Test PRO chart with 4 weeks data
 */
export function testProChart4Weeks() {
    const mockData = generateProMockData(28);
    console.group('📊 Testing PRO Chart (4 weeks)');
    console.log('Generated:', mockData.length, 'entries');
    console.log('Limit:', 25);
    console.log('Sample:', mockData.slice(0, 3));
    console.groupEnd();

    injectMockData(mockData);
    console.log('✅ PRO chart data injected! Watch the animation!');
}

/**
 * Test FREE chart with 7 days data
 */
export function testFreeChart7Days() {
    const mockData = generateFreeMockData(7);
    console.group('📊 Testing FREE Chart (7 days)');
    console.log('Generated:', mockData.length, 'entries');
    console.log('Limit:', 9);
    console.log('Sample:', mockData);
    console.groupEnd();

    injectMockData(mockData);
    console.log('✅ FREE chart data injected! Watch the animation!');
}

/**
 * Test dramatic wave pattern
 */
export function testDramaticPattern() {
    const mockData = generateDramaticPattern(14, 'pro');
    console.log('📊 Testing Dramatic Wave Pattern');
    injectMockData(mockData);
    console.log('✅ Watch the smooth wave animation!');
}

/**
 * Test 1 year PRO data
 */
export function testProChart1Year() {
    const mockData = generateProMockData(365);
    console.log('📊 Testing PRO Chart (1 year)');
    injectMockData(mockData);
    console.log('✅ 1 year data injected! Click "1y" button to see all data');
}

/**
 * Clear mock data
 */
export function clearMockData() {
    injectMockData([]);
    console.log('✅ Mock data cleared');
}

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.keymojiChartTest = {
        // Quick tests
        pro4w: testProChart4Weeks,
        free7d: testFreeChart7Days,
        pro1y: testProChart1Year,
        wave: testDramaticPattern,

        // Generators
        generatePro: generateProMockData,
        generateFree: generateFreeMockData,
        generateWave: generateDramaticPattern,

        // Actions
        inject: injectMockData,
        clear: clearMockData
    };

    console.log('🎨 Chart Test Tools available: window.keymojiChartTest');
    console.log('');
    console.log('⚡ Quick Tests:');
    console.log('  window.keymojiChartTest.pro4w()   // PRO: 4 weeks');
    console.log('  window.keymojiChartTest.free7d()  // FREE: 7 days');
    console.log('  window.keymojiChartTest.wave()    // Dramatic pattern');
    console.log('  window.keymojiChartTest.pro1y()   // PRO: 1 year');
    console.log('  window.keymojiChartTest.clear()   // Clear data');
}
