/*
Helper utility for loading real account data from backend into localStorage.
Provides development tooling for loading production data during local development.
Handles account data fetching and localStorage synchronization.
*/
import { STORAGE_KEYS, storageHelpers } from '../config/storage';
import { isDebugMode } from './environment';
import type { Account } from '../types/Account';

function debugLoadRealDataHelper(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 LoadRealDataHelper Debug: ${context}`);
    if (data) debugLoadRealDataHelper(data);
    console.groupEnd();
}

export interface LoadRealDataResult {
    success: boolean;
    usageHistoryLength?: number;
    error?: string;
}

/**
 * Load real account data from n8n and update localStorage
 * @param email - Email address to load data for
 * @returns Result object with success status and usage history length
 */
export async function loadRealDataFromBackend(email: string): Promise<LoadRealDataResult> {
    try {
        debugLoadRealDataHelper('📡 Loading real data from n8n for:', email);

        // Get userId from localStorage if available
        const userPrefs = storageHelpers.get<Partial<Account>>(STORAGE_KEYS.USER_PREFERENCES, {});
        const userId = userPrefs.userId || `user_${Date.now()}`;

        debugLoadRealDataHelper('📡 Using userId:', userId);

        const response = await fetch(
            'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

        const result = await response.json() as {
            success: boolean;
            account?: Account;
        };

        if (!result.success || !result.account) {
            throw new Error('No account data in response');
        }

        debugLoadRealDataHelper('✅ Loaded account data from n8n:', {
            hasMetadata: !!result.account.metadata,
            metadataType: typeof result.account.metadata,
            hasUsageHistory: !!result.account.metadata?.usageHistory,
            usageHistoryLength:
                Array.isArray(result.account.metadata?.usageHistory)
                    ? result.account.metadata.usageHistory.length
                    : 0
        });

        // Parse metadata if it's a string
        let metadata = result.account.metadata;
        if (typeof metadata === 'string') {
            metadata = JSON.parse(metadata) as Account['metadata'];
        }

        debugLoadRealDataHelper(
            '📊 usageHistory entries:',
            Array.isArray(metadata?.usageHistory) ? metadata.usageHistory.length : 0
        );

        // Update localStorage (reuse existing userPrefs from line 15)
        const currentPrefs = storageHelpers.get<Partial<Account>>(
            STORAGE_KEYS.USER_PREFERENCES,
            {}
        );

        const updatedPrefs: Partial<Account> = {
            ...currentPrefs,
            metadata: metadata,
            profile: result.account.profile,
            createdAt: result.account.createdAt,
            tier: result.account.tier
        };

        storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);

        debugLoadRealDataHelper('✅ localStorage updated with real data!');
        debugLoadRealDataHelper(
            '📊 usageHistory in localStorage:',
            Array.isArray(updatedPrefs.metadata?.usageHistory)
                ? updatedPrefs.metadata.usageHistory.length
                : 0,
            'entries'
        );

        return {
            success: true,
            usageHistoryLength: Array.isArray(metadata?.usageHistory)
                ? metadata.usageHistory.length
                : 0
        };
    } catch (error) {
        debugLoadRealDataHelper('❌ Failed to load real data:', error);
        throw error;
    }
}

// Expose to window for easy testing
if (typeof window !== 'undefined') {
    (window as unknown as { loadRealData?: (email?: string) => Promise<LoadRealDataResult> }).loadRealData = async (
        email: string | null = null
    ): Promise<LoadRealDataResult> => {
        try {
            // Get email from localStorage if not provided
            const userPrefs = storageHelpers.get<Partial<Account>>(
                STORAGE_KEYS.USER_PREFERENCES,
                {}
            );
            const targetEmail = email || userPrefs.email || 'cm@chooo.de';

            debugLoadRealDataHelper('📡 Loading real data for:', targetEmail);
            const result = await loadRealDataFromBackend(targetEmail);
            debugLoadRealDataHelper('✅ Real data loaded! Reloading page...');
            setTimeout(() => location.reload(), 1000);
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            debugLoadRealDataHelper('❌ Error:', error);
            return { success: false, error: errorMessage };
        }
    };

    debugLoadRealDataHelper(
        '🔧 Helper loaded! Run: window.loadRealData() or window.loadRealData("your@email.com")'
    );
}

export default { loadRealDataFromBackend };

