// src/utils/test-limits.js
// Test-Funktionen für die neue Limit-Konfiguration

import { getDailyLimitForUser, validateUserLimits } from '../config/limits.js';

export function testLimitConfiguration() {
    console.log('🧪 Testing Limit Configuration...');

    // Test Guest User
    console.log('👤 Guest User (not logged in):');
    console.log('- Limit:', getDailyLimitForUser(false, 'free'));
    console.log('- Validation:', validateUserLimits(false, 'free', 2));

    // Test Free User
    console.log('👤 Free User (logged in):');
    console.log('- Limit:', getDailyLimitForUser(true, 'free'));
    console.log('- Validation:', validateUserLimits(true, 'free', 3));

    // Test Pro User
    console.log('👤 Pro User (logged in):');
    console.log('- Limit:', getDailyLimitForUser(true, 'pro'));
    console.log('- Validation:', validateUserLimits(true, 'pro', 10));

    // Test Limit Reached
    console.log('🚫 Test Limit Reached:');
    console.log('- Guest at limit:', validateUserLimits(false, 'free', 3));
    console.log('- Free at limit:', validateUserLimits(true, 'free', 5));
    console.log('- Pro at limit:', validateUserLimits(true, 'pro', 25));

    console.log('✅ Limit Configuration Test Complete');
}

export function testLimitConsistency() {
    console.log('🔍 Testing Limit Consistency...');

    const testCases = [
        { isLoggedIn: false, tier: 'free', used: 0, expectedLimit: 3 },
        { isLoggedIn: false, tier: 'free', used: 3, expectedLimit: 3 },
        { isLoggedIn: true, tier: 'free', used: 0, expectedLimit: 5 },
        { isLoggedIn: true, tier: 'free', used: 5, expectedLimit: 5 },
        { isLoggedIn: true, tier: 'pro', used: 0, expectedLimit: 25 },
        { isLoggedIn: true, tier: 'pro', used: 25, expectedLimit: 25 }
    ];

    testCases.forEach((testCase, index) => {
        const result = validateUserLimits(
            testCase.isLoggedIn,
            testCase.tier,
            testCase.used
        );
        const passed = result.limit === testCase.expectedLimit;

        console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'}`);
        console.log(
            `  Expected: ${testCase.expectedLimit}, Got: ${result.limit}`
        );
        console.log(
            `  User: ${testCase.isLoggedIn ? 'Logged In' : 'Guest'}, Tier: ${
                testCase.tier
            }`
        );
        console.log(
            `  Used: ${testCase.used}, Remaining: ${result.remaining}, Reached: ${result.isReached}`
        );
    });

    console.log('✅ Limit Consistency Test Complete');
}
