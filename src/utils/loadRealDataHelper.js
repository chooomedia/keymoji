// src/utils/loadRealDataHelper.js
// Helper to load real data from n8n into localStorage

import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';

/**
 * Load real account data from n8n and update localStorage
 * Use this on localhost to get real data from Google Sheets!
 */
export async function loadRealDataFromBackend(email) {
    try {
        console.log('📡 Loading real data from n8n for:', email);

        // Get userId from localStorage if available
        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
        const userId = userPrefs.userId || `user_${Date.now()}`;

        console.log('📡 Using userId:', userId);

        const response = await fetch(
            'https://its.keymoji.wtf/api/account',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get',
                    userId: userId,
                    email: email
                })
            }
        );

        if (!response.ok) {
            throw new Error(`n8n returned ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.account) {
            throw new Error('No account data in response');
        }

        console.log('✅ Loaded account data from n8n:', {
            hasMetadata: !!result.account.metadata,
            metadataType: typeof result.account.metadata,
            hasUsageHistory: !!result.account.metadata?.usageHistory,
            usageHistoryLength:
                result.account.metadata?.usageHistory?.length || 0
        });

        // Parse metadata if it's a string
        let metadata = result.account.metadata;
        if (typeof metadata === 'string') {
            metadata = JSON.parse(metadata);
        }

        console.log(
            '📊 usageHistory entries:',
            metadata.usageHistory?.length || 0
        );

        // Update localStorage (reuse existing userPrefs from line 15)
        const currentPrefs = storageHelpers.get(
            STORAGE_KEYS.USER_PREFERENCES,
            {}
        );

        const updatedPrefs = {
            ...currentPrefs,
            metadata: metadata,
            profile: result.account.profile,
            createdAt: result.account.createdAt,
            tier: result.account.tier
        };

        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);

        console.log('✅ localStorage updated with real data!');
        console.log(
            '📊 usageHistory in localStorage:',
            updatedPrefs.metadata?.usageHistory?.length || 0,
            'entries'
        );

        return {
            success: true,
            usageHistoryLength: metadata.usageHistory?.length || 0
        };
    } catch (error) {
        console.error('❌ Failed to load real data:', error);
        throw error;
    }
}

// Expose to window for easy testing
if (typeof window !== 'undefined') {
    window.loadRealData = async (email = null) => {
        try {
            // Get email from localStorage if not provided
            const userPrefs = storageHelpers.get(
                STORAGE_KEYS.USER_PREFERENCES,
                {}
            );
            const targetEmail = email || userPrefs.email || 'cm@chooo.de';

            console.log('📡 Loading real data for:', targetEmail);
            const result = await loadRealDataFromBackend(targetEmail);
            console.log('✅ Real data loaded! Reloading page...');
            setTimeout(() => location.reload(), 1000);
            return result;
        } catch (error) {
            console.error('❌ Error:', error);
            return { success: false, error: error.message };
        }
    };

    console.log(
        '🔧 Helper loaded! Run: window.loadRealData() or window.loadRealData("your@email.com")'
    );
}

export default { loadRealDataFromBackend };
