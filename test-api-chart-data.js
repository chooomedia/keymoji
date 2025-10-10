// test-api-chart-data.js
// Test API call to verify chart data is returned from Google Sheets

const API_URL = 'https://its.keymoji.wtf/api/account';
const USER_ID = 'user_1753963152928';
const EMAIL = 'cm@chooo.de';

console.log('═══════════════════════════════════════════════════════');
console.log('🧪 Testing API Call for Chart Data');
console.log('═══════════════════════════════════════════════════════');
console.log('');
console.log('Target User:', EMAIL);
console.log('User ID:', USER_ID);
console.log('API URL:', API_URL);
console.log('');

async function testAPICall() {
    try {
        console.log('📡 Making API request...');
        console.log('Request:', {
            method: 'POST',
            url: API_URL,
            body: {
                action: 'read',
                userId: USER_ID,
                email: EMAIL
            }
        });
        console.log('');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'read',
                userId: USER_ID,
                email: EMAIL
            })
        });

        console.log('📥 Response received:');
        console.log('  Status:', response.status, response.statusText);
        console.log('  OK:', response.ok);
        console.log('');

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            return;
        }

        const data = await response.json();

        console.log('✅ Response Data:');
        console.log('─────────────────────────────────────────────────────');
        console.log('Success:', data.success);
        console.log('Has Account:', !!data.account);
        console.log('');

        if (!data.account) {
            console.error('❌ No account data in response!');
            console.log('Full response:', JSON.stringify(data, null, 2));
            return;
        }

        const account = data.account;

        console.log('📊 Account Data Structure:');
        console.log('─────────────────────────────────────────────────────');
        console.log('User ID:', account.userId);
        console.log('Email:', account.email);
        console.log('Tier:', account.tier);
        console.log('Created At:', account.createdAt);
        console.log('Last Login:', account.lastLogin);
        console.log('Status:', account.status);
        console.log('');

        console.log('📝 Profile:');
        console.log('─────────────────────────────────────────────────────');
        console.log('Type:', typeof account.profile);
        if (typeof account.profile === 'string') {
            console.log('⚠️ Profile is STRING (needs parsing):', account.profile);
            try {
                const parsed = JSON.parse(account.profile);
                console.log('Parsed:', parsed);
            } catch (e) {
                console.error('❌ Failed to parse profile:', e);
            }
        } else {
            console.log('✅ Profile is OBJECT:', account.profile);
        }
        console.log('');

        console.log('📦 Metadata:');
        console.log('─────────────────────────────────────────────────────');
        console.log('Type:', typeof account.metadata);
        
        if (typeof account.metadata === 'string') {
            console.log('⚠️ Metadata is STRING (needs parsing)');
            console.log('Length:', account.metadata.length, 'characters');
            console.log('Preview:', account.metadata.substring(0, 200) + '...');
            console.log('');
            
            try {
                const parsed = JSON.parse(account.metadata);
                console.log('✅ Metadata parsed successfully!');
                console.log('');
                
                console.log('📊 Parsed Metadata Structure:');
                console.log('  Has settings:', !!parsed.settings);
                console.log('  Has dailyUsage:', !!parsed.dailyUsage);
                console.log('  Has usageHistory:', !!parsed.usageHistory);
                console.log('');
                
                if (parsed.usageHistory) {
                    console.log('📈 UsageHistory Details:');
                    console.log('  Type:', typeof parsed.usageHistory);
                    console.log('  Is Array:', Array.isArray(parsed.usageHistory));
                    console.log('  Length:', parsed.usageHistory.length);
                    console.log('  First Entry:', parsed.usageHistory[0]);
                    console.log('  Last Entry:', parsed.usageHistory[parsed.usageHistory.length - 1]);
                    console.log('');
                    
                    if (parsed.usageHistory.length > 0) {
                        const firstDate = parsed.usageHistory[0]?.date;
                        const lastDate = parsed.usageHistory[parsed.usageHistory.length - 1]?.date;
                        console.log('  Date Range:', lastDate, 'to', firstDate);
                        
                        const nonZero = parsed.usageHistory.filter(e => e.used > 0);
                        console.log('  Non-zero entries:', nonZero.length);
                        
                        const totalUsed = parsed.usageHistory.reduce((sum, e) => sum + e.used, 0);
                        const avgUsed = totalUsed / parsed.usageHistory.length;
                        console.log('  Total used:', totalUsed);
                        console.log('  Average used:', Math.round(avgUsed * 10) / 10);
                    }
                    console.log('');
                    
                    console.log('═══════════════════════════════════════════════════════');
                    console.log('✅ SUCCESS! Chart data is available!');
                    console.log('═══════════════════════════════════════════════════════');
                    console.log('');
                    console.log('📊 Chart should display:');
                    console.log('  • Data points:', parsed.usageHistory.length);
                    console.log('  • Date range:', lastDate || 'unknown', 'to', firstDate || 'unknown');
                    console.log('  • Color: Yellow (FREE tier)');
                    console.log('  • Max value: 9');
                    console.log('');
                } else {
                    console.error('❌ No usageHistory in metadata!');
                    console.log('Available metadata fields:', Object.keys(parsed));
                }
            } catch (error) {
                console.error('❌ Failed to parse metadata:', error);
                console.log('Raw metadata:', account.metadata);
            }
        } else if (typeof account.metadata === 'object') {
            console.log('✅ Metadata is already OBJECT!');
            console.log('');
            
            console.log('📊 Metadata Structure:');
            console.log('  Has settings:', !!account.metadata.settings);
            console.log('  Has dailyUsage:', !!account.metadata.dailyUsage);
            console.log('  Has usageHistory:', !!account.metadata.usageHistory);
            console.log('');
            
            if (account.metadata.usageHistory) {
                console.log('📈 UsageHistory Details:');
                console.log('  Is Array:', Array.isArray(account.metadata.usageHistory));
                console.log('  Length:', account.metadata.usageHistory.length);
                console.log('  First Entry:', account.metadata.usageHistory[0]);
                console.log('  Last Entry:', account.metadata.usageHistory[account.metadata.usageHistory.length - 1]);
                console.log('');
                
                console.log('═══════════════════════════════════════════════════════');
                console.log('✅ SUCCESS! Chart data is available!');
                console.log('═══════════════════════════════════════════════════════');
            } else {
                console.error('❌ No usageHistory in metadata!');
                console.log('Available metadata fields:', Object.keys(account.metadata));
            }
        }

    } catch (error) {
        console.error('❌ API Call Failed:', error);
        console.error('Error details:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
testAPICall();

