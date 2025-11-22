// src/utils/dailyUsageDebug.js
// Debug und Testing Tools für Daily Usage Tracking

import { get } from 'svelte/store';
import {
    dailyLimit,
    isLoggedIn,
    accountTier,
    currentAccount
} from 'stores/appStores';
import {
    initializeDailyUsage,
    incrementDailyUsage,
    resetDailyUsage,
    usageStatus,
    isLimitReachedStore,
    remainingGenerations
} from '../stores/dailyUsageStore.js';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';
import { getDailyLimitForUser } from '../config/limits.js';

/**
 * Debug: Display current daily usage state
 */
export function debugDailyUsage() {
    const limit = get(dailyLimit);
    const logged = get(isLoggedIn);
    const tier = get(accountTier);
    const account = get(currentAccount);
    const status = get(usageStatus);
    const isReached = get(isLimitReachedStore);
    const remaining = get(remainingGenerations);

    console.group('🔍 Daily Usage Debug Info');
    console.log('📊 Store State:', {
        dailyLimit: limit,
        isLoggedIn: logged,
        accountTier: tier,
        isLimitReached: isReached,
        remaining: remaining
    });
    console.log('👤 Account:', {
        userId: account?.userId,
        email: account?.email,
        profileDailyUsage: account?.profile?.dailyUsage,
        metadataDailyUsage: account?.metadata?.dailyUsage
    });
    console.log('📦 localStorage:', {
        dailyUsage: storageHelpers.get(STORAGE_KEYS.DAILY_USAGE),
        oldDailyCount: storageHelpers.get(STORAGE_KEYS.DAILY_REQUEST_COUNT),
        oldStoredDate: storageHelpers.get(STORAGE_KEYS.STORED_DATE)
    });
    console.log('⚙️ Status:', status);
    console.log('📏 Expected Limit:', getDailyLimitForUser(logged, tier));
    console.groupEnd();

    return {
        dailyLimit: limit,
        isLoggedIn: logged,
        accountTier: tier,
        isLimitReached: isReached,
        remaining: remaining,
        status: status,
        account: {
            userId: account?.userId,
            email: account?.email,
            // NEW STRUCTURE: dailyUsage from separate column (preferred!)
            dailyUsage:
                account?.dailyUsage ||
                account?.profile?.dailyUsage ||
                account?.metadata?.dailyUsage
        }
    };
}

/**
 * Test: Increment usage and check if it syncs
 */
export async function testIncrementUsage() {
    console.group('🧪 Testing Usage Increment');

    const before = get(dailyLimit);
    console.log('Before increment:', before);

    try {
        await incrementDailyUsage();
        const after = get(dailyLimit);
        console.log('After increment:', after);

        if (after.used === before.used + 1) {
            console.log('✅ Test PASSED: Usage incremented correctly');
        } else {
            console.error('❌ Test FAILED: Usage not incremented');
        }
    } catch (error) {
        console.error('❌ Test ERROR:', error);
    }

    console.groupEnd();
}

/**
 * Test: Reset usage and check if it syncs
 */
export async function testResetUsage() {
    console.group('🧪 Testing Usage Reset');

    const before = get(dailyLimit);
    console.log('Before reset:', before);

    try {
        await resetDailyUsage();
        const after = get(dailyLimit);
        console.log('After reset:', after);

        if (after.used === 0) {
            console.log('✅ Test PASSED: Usage reset correctly');
        } else {
            console.error('❌ Test FAILED: Usage not reset');
        }
    } catch (error) {
        console.error('❌ Test ERROR:', error);
    }

    console.groupEnd();
}

/**
 * Test: Re-initialize and check consistency
 */
export async function testReInitialize() {
    console.group('🧪 Testing Re-Initialization');

    const before = get(dailyLimit);
    console.log('Before re-init:', before);

    try {
        await initializeDailyUsage();
        const after = get(dailyLimit);
        console.log('After re-init:', after);

        console.log('✅ Test PASSED: Re-initialization completed');
    } catch (error) {
        console.error('❌ Test ERROR:', error);
    }

    console.groupEnd();
}

/**
 * Test: Simulate reaching daily limit
 */
export async function testReachLimit() {
    console.group('🧪 Testing Limit Reached');

    const limit = get(dailyLimit);
    console.log('Current limit:', limit);

    // Simulate increments until limit
    const increments = limit.limit - limit.used;
    console.log(`Simulating ${increments} increments...`);

    for (let i = 0; i < increments; i++) {
        try {
            await incrementDailyUsage();
            console.log(`Increment ${i + 1}/${increments}:`, get(dailyLimit));
        } catch (error) {
            console.error(`Error on increment ${i + 1}:`, error);
            break;
        }
    }

    const final = get(dailyLimit);
    const isReached = get(isLimitReachedStore);

    if (final.used >= final.limit && isReached) {
        console.log('✅ Test PASSED: Limit reached correctly');
    } else {
        console.error('❌ Test FAILED: Limit not reached');
    }

    console.groupEnd();
}

/**
 * Compare localStorage with store state
 */
export function checkConsistency() {
    console.group('🔍 Checking Data Consistency');

    const storeData = get(dailyLimit);
    const localData = storageHelpers.get(STORAGE_KEYS.DAILY_USAGE);
    const accountData = get(currentAccount);

    console.log('Store (dailyLimit):', storeData);
    console.log('localStorage (DAILY_USAGE):', localData);
    // NEW STRUCTURE: dailyUsage from separate column (preferred!)
    console.log(
        'Account (dailyUsage - separate column):',
        accountData?.dailyUsage
    );
    // DEPRECATED: Fallbacks for backward compatibility
    console.log(
        'Account (profile.dailyUsage - deprecated):',
        accountData?.profile?.dailyUsage
    );
    console.log(
        'Account (metadata.dailyUsage - deprecated):',
        accountData?.metadata?.dailyUsage
    );

    // Check consistency
    const issues = [];

    if (localData && localData.used !== storeData.used) {
        issues.push('⚠️ localStorage.used !== store.used');
    }
    if (localData && localData.limit !== storeData.limit) {
        issues.push('⚠️ localStorage.limit !== store.limit');
    }

    if (issues.length > 0) {
        console.warn('⚠️ Inconsistencies found:', issues);
    } else {
        console.log('✅ All data sources are consistent');
    }

    console.groupEnd();

    return issues;
}

/**
 * Run all tests
 */
export async function runAllTests() {
    console.group('🧪 Running All Daily Usage Tests');

    debugDailyUsage();
    await testResetUsage();
    await testIncrementUsage();
    await testReInitialize();
    checkConsistency();
    // await testReachLimit(); // Commented: This modifies user data

    console.log('✅ All tests completed');
    console.groupEnd();
}

// Make available globally in development
if (
    typeof window !== 'undefined' &&
    typeof import.meta !== 'undefined' &&
    import.meta.env?.MODE === 'development'
) {
    window.keymojiDailyUsageDebug = {
        debug: debugDailyUsage,
        testIncrement: testIncrementUsage,
        testReset: testResetUsage,
        testReInit: testReInitialize,
        testReachLimit: testReachLimit,
        checkConsistency: checkConsistency,
        runAll: runAllTests
    };
    console.log(
        '🔧 Daily Usage Debug Tools available: window.keymojiDailyUsageDebug'
    );
}
