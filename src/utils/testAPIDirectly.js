// src/utils/testAPIDirectly.js
// Browser-based API test (works in dev console)

import { WEBHOOKS } from '../config/api.js';

/**
 * Test API call to load chart data for cm@chooo.de
 * Run in browser console: window.testAPIDirectly()
 */
export async function testAPIDirectly() {
    console.clear();
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧪 DIRECT API TEST FOR CHART DATA');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    const userId = 'user_1753963152928';
    const email = 'cm@chooo.de';

    console.log('Target User:', email);
    console.log('User ID:', userId);
    console.log('API Endpoint:', WEBHOOKS.ACCOUNT.READ);
    console.log('');

    try {
        console.log('📡 Step 1: Making API request...');
        console.log('Request payload:', {
            action: 'read',
            userId,
            email
        });
        console.log('');

        const response = await fetch(WEBHOOKS.ACCOUNT.READ, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'read',
                userId: userId,
                email: email
            })
        });

        console.log('📥 Step 2: Response received');
        console.log('  Status:', response.status, response.statusText);
        console.log('  OK:', response.ok);
        console.log('  Headers:', Object.fromEntries(response.headers.entries()));
        console.log('');

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error!');
            console.error('  Status:', response.status);
            console.error('  Error:', errorText);
            console.log('');
            console.log('💡 Possible causes:');
            console.log('  1. CORS issue (check backend ALLOWED_ORIGINS)');
            console.log('  2. n8n workflow not running');
            console.log('  3. Google Sheets permissions');
            console.log('  4. Invalid userId or email');
            return null;
        }

        const data = await response.json();

        console.log('✅ Step 3: Response parsed');
        console.log('─────────────────────────────────────────────────────');
        console.log('Success:', data.success);
        console.log('Has account:', !!data.account);
        console.log('');

        if (!data.success || !data.account) {
            console.error('❌ No account data in response!');
            console.log('Full response:', data);
            return null;
        }

        const account = data.account;

        console.log('📊 Step 4: Account Data Analysis');
        console.log('─────────────────────────────────────────────────────');
        console.log('Basic Info:');
        console.log('  User ID:', account.userId);
        console.log('  Email:', account.email);
        console.log('  Tier:', account.tier);
        console.log('  Created:', account.createdAt);
        console.log('  Last Login:', account.lastLogin);
        console.log('');

        console.log('Profile:');
        console.log('  Type:', typeof account.profile);
        console.log('  Value:', account.profile);
        console.log('');

        console.log('Metadata:');
        console.log('  Type:', typeof account.metadata);
        
        // Parse metadata if it's a string
        let metadata = account.metadata;
        if (typeof metadata === 'string') {
            console.log('  ⚠️ Metadata is STRING, parsing...');
            try {
                metadata = JSON.parse(metadata);
                console.log('  ✅ Parsed successfully!');
            } catch (e) {
                console.error('  ❌ Failed to parse:', e);
                return null;
            }
        } else {
            console.log('  ✅ Metadata is already OBJECT');
        }
        console.log('');

        console.log('📈 Step 5: UsageHistory Validation');
        console.log('─────────────────────────────────────────────────────');
        console.log('Has usageHistory:', !!metadata.usageHistory);
        console.log('Type:', typeof metadata.usageHistory);
        console.log('Is Array:', Array.isArray(metadata.usageHistory));
        console.log('Length:', metadata.usageHistory?.length || 0);
        console.log('');

        if (!metadata.usageHistory) {
            console.error('❌ PROBLEM: No usageHistory in metadata!');
            console.log('Available metadata fields:', Object.keys(metadata));
            console.log('');
            console.log('💡 Solution: Update Google Sheets Column G with complete metadata');
            console.log('   File: COMPLETE_METADATA_STRING.txt');
            return null;
        }

        if (!Array.isArray(metadata.usageHistory)) {
            console.error('❌ PROBLEM: usageHistory is not an array!');
            console.log('Type:', typeof metadata.usageHistory);
            console.log('Value:', metadata.usageHistory);
            return null;
        }

        if (metadata.usageHistory.length === 0) {
            console.warn('⚠️ WARNING: usageHistory is empty array!');
            console.log('Chart will show "No data"');
            return null;
        }

        console.log('✅ UsageHistory is valid!');
        console.log('  Entries:', metadata.usageHistory.length);
        console.log('  First entry:', metadata.usageHistory[0]);
        console.log('  Last entry:', metadata.usageHistory[metadata.usageHistory.length - 1]);
        console.log('');

        const firstDate = metadata.usageHistory[0]?.date;
        const lastDate = metadata.usageHistory[metadata.usageHistory.length - 1]?.date;
        console.log('  Date range:', lastDate, 'to', firstDate);
        
        const nonZero = metadata.usageHistory.filter(e => e.used > 0);
        console.log('  Non-zero entries:', nonZero.length);
        
        const totalUsed = metadata.usageHistory.reduce((sum, e) => sum + e.used, 0);
        const avgUsed = totalUsed / metadata.usageHistory.length;
        console.log('  Average used per day:', Math.round(avgUsed * 10) / 10);
        console.log('');

        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ API TEST SUCCESSFUL!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('');
        console.log('📊 Chart Data Summary:');
        console.log('  ✅ usageHistory loaded from Google Sheets');
        console.log('  ✅', metadata.usageHistory.length, 'entries available');
        console.log('  ✅ Date range:', lastDate, 'to', firstDate);
        console.log('  ✅ Chart should display', nonZero.length, 'data points');
        console.log('');
        console.log('🎯 Next Steps:');
        console.log('  1. Login to app as cm@chooo.de');
        console.log('  2. Navigate to /account');
        console.log('  3. Chart should show', metadata.usageHistory.length, 'days');
        console.log('  4. Run: window.instantChartTest()');
        console.log('');

        // Return data for further inspection
        return {
            success: true,
            account: {
                ...account,
                metadata: metadata,
                profile: typeof account.profile === 'string' 
                    ? JSON.parse(account.profile) 
                    : account.profile
            }
        };

    } catch (error) {
        console.error('❌ API Test Failed!');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.log('');
        console.log('💡 Troubleshooting:');
        console.log('  1. Check if backend is deployed');
        console.log('  2. Check n8n workflow is active');
        console.log('  3. Check Google Sheets permissions');
        console.log('  4. Try in browser console (not Node.js)');
        return null;
    }
}

// Auto-export to window
if (typeof window !== 'undefined') {
    window.testAPIDirectly = testAPIDirectly;
    console.log('🧪 Direct API Test loaded!');
    console.log('   Run: await window.testAPIDirectly()');
}

export default testAPIDirectly;

