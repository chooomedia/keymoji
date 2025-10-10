// Force Load Data from Google Sheets
// Run this in Browser Console (F12) to manually load data from backend

async function forceLoadFromSheets() {
    console.log('🔄 FORCE LOADING FROM GOOGLE SHEETS...');
    console.log('');

    // Step 1: Get current account info
    const currentAccount = window.$currentAccount;
    console.log('📊 Step 1: Current Account:', {
        userId: currentAccount?.userId,
        email: currentAccount?.email,
        hasMetadata: !!currentAccount?.metadata,
        hasUsageHistory: !!currentAccount?.metadata?.usageHistory
    });

    if (!currentAccount?.userId) {
        console.error('❌ No user logged in!');
        return;
    }

    // Step 2: Force API call to backend
    console.log('📡 Step 2: Calling backend API...');

    try {
        const response = await fetch('https://its.keymoji.wtf/api/account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'read',
                userId: currentAccount.userId,
                email: currentAccount.email
            })
        });

        console.log('📡 API Response:', {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            return;
        }

        const data = await response.json();
        console.log('✅ Step 3: API Data received:', data);

        // Step 3: Check metadata structure
        console.log('📦 Step 4: Metadata structure:', {
            hasMetadata: !!data.account?.metadata,
            metadataType: typeof data.account?.metadata,
            metadataKeys: data.account?.metadata
                ? Object.keys(data.account.metadata)
                : [],
            hasUsageHistory: !!data.account?.metadata?.usageHistory,
            usageHistoryLength: data.account?.metadata?.usageHistory?.length
        });

        // Step 4: Parse metadata if it's a string
        let metadata = data.account?.metadata;
        if (typeof metadata === 'string') {
            console.log('⚠️ Metadata is STRING, parsing...');
            try {
                metadata = JSON.parse(metadata);
                console.log('✅ Metadata parsed successfully');
            } catch (e) {
                console.error('❌ Failed to parse metadata:', e);
                return;
            }
        }

        // Step 5: Extract usageHistory
        const usageHistory = metadata?.usageHistory || [];
        console.log('📊 Step 5: UsageHistory:', {
            isArray: Array.isArray(usageHistory),
            length: usageHistory.length,
            first3: usageHistory.slice(0, 3),
            last3: usageHistory.slice(-3)
        });

        if (usageHistory.length === 0) {
            console.error('❌ UsageHistory is EMPTY!');
            console.error(
                'Google Sheets metadata Column G does NOT contain usageHistory!'
            );
            console.error('');
            console.error(
                'FIX: Update Google Sheets with PASTE_IN_GOOGLE_SHEETS.txt content!'
            );
            return;
        }

        // Step 6: Update currentAccount store
        console.log('💾 Step 6: Updating currentAccount store...');

        const { currentAccount: accountStore } = await import(
            './src/stores/accountStore.js'
        );
        accountStore.update(acc => ({
            ...acc,
            metadata: {
                ...acc.metadata,
                ...metadata
            }
        }));

        console.log('✅ Step 7: Store updated! Reload page to see chart!');
        console.log('');
        console.log('🎯 Run: location.reload()');

        return usageHistory;
    } catch (error) {
        console.error('❌ Error loading from sheets:', error);
        console.error('Stack:', error.stack);
    }
}

// Run it!
console.log('');
console.log('═══════════════════════════════════════════');
console.log('🔄 FORCE LOAD FROM GOOGLE SHEETS');
console.log('═══════════════════════════════════════════');
console.log('');
console.log('Run: forceLoadFromSheets()');
console.log('');
console.log('This will:');
console.log('1. Call backend API');
console.log('2. Get data from Google Sheets via n8n');
console.log('3. Parse metadata');
console.log('4. Extract usageHistory');
console.log('5. Update currentAccount store');
console.log('6. Tell you to reload page');
console.log('');
console.log('═══════════════════════════════════════════');
console.log('');

window.forceLoadFromSheets = forceLoadFromSheets;
