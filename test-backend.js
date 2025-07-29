/**
 * Backend Test Script für Keymoji
 * Testet alle Vercel APIs und n8n Webhooks
 */

const VERCEL_BASE = 'https://its.keymoji.wtf';
const N8N_BASE = 'https://n8n.chooomedia.com/webhook';

// Test-Daten
const testData = {
    account: {
        action: 'create',
        userId: 'test_user_' + Date.now(),
        email: 'test@example.com',
        profile: {
            name: 'Test User'
        },
        metadata: {
            test: true,
            timestamp: new Date().toISOString()
        }
    },
    magicLink: {
        email: 'test@example.com',
        name: 'Test User',
        userId: 'test_user_' + Date.now(),
        language: 'en'
    },
    contact: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from the backend test script.',
        newsletterOptIn: false,
        honeypot: '',
        emailContent: {
            greeting: 'Hello',
            intro: 'Thank you for contacting us.',
            doubleCheck:
                "We've received your message with the following details:",
            button: 'Confirm Your Email',
            subject: 'Your message to Keymoji has been received',
            footer: 'Developed with love'
        },
        langCode: 'en',
        appVersion: '0.4.0'
    }
};

// Test-Funktionen
async function testAPI(endpoint, data, method = 'POST', baseUrl = VERCEL_BASE) {
    try {
        console.log(`🧪 Testing ${baseUrl}${endpoint}...`);

        const response = await fetch(`${baseUrl}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: method === 'POST' ? JSON.stringify(data) : undefined
        });

        const result = await response.text();

        console.log(`📡 Status: ${response.status}`);
        console.log(
            `📡 Response: ${result.substring(0, 300)}${
                result.length > 300 ? '...' : ''
            }`
        );

        if (response.ok) {
            console.log(`✅ ${endpoint} - SUCCESS`);
            return true;
        } else {
            console.log(`❌ ${endpoint} - FAILED (${response.status})`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${endpoint} - ERROR: ${error.message}`);
        return false;
    }
}

// Vercel API Tests
async function testVercelAPIs() {
    console.log('\n🚀 Testing Vercel APIs...');
    console.log('=' * 50);

    let passed = 0;
    let total = 0;

    // Test Email Templates
    console.log('\n📧 Testing Email Templates...');
    const emailResult = await testAPI(
        '/api/test-emails',
        { template: 'welcome' },
        'GET'
    );
    total += 1;
    if (emailResult) passed += 1;

    // Test Account API
    console.log('\n👤 Testing Account API...');
    const accountResult = await testAPI('/api/account', testData.account);
    total += 1;
    if (accountResult) passed += 1;

    // Test Magic Link API
    console.log('\n🔗 Testing Magic Link API...');
    const magicLinkResult = await testAPI(
        '/api/magic-link/send',
        testData.magicLink
    );
    total += 1;
    if (magicLinkResult) passed += 1;

    // Test Contact API
    console.log('\n📧 Testing Contact API...');
    const contactResult = await testAPI('/api/contact', testData.contact);
    total += 1;
    if (contactResult) passed += 1;

    // Test Random API
    console.log('\n🎲 Testing Random API...');
    const randomResult = await testAPI('/api/random?count=5', null, 'GET');
    total += 1;
    if (randomResult) passed += 1;

    return { passed, total, type: 'Vercel' };
}

// n8n Webhook Tests
async function testN8nWebhooks() {
    console.log('\n🔄 Testing n8n Webhooks...');
    console.log('=' * 50);

    let passed = 0;
    let total = 0;

    // Test Account Webhook
    console.log('\n👤 Testing Account Webhook...');
    const accountWebhookResult = await testAPI(
        '/xn--moji-pb73c-account',
        testData.account,
        'POST',
        N8N_BASE
    );
    total += 1;
    if (accountWebhookResult) passed += 1;

    // Test Analytics Webhook
    console.log('\n📊 Testing Analytics Webhook...');
    const analyticsData = {
        action: 'track',
        userId: testData.account.userId,
        event: 'test_event',
        timestamp: new Date().toISOString()
    };
    const analyticsResult = await testAPI(
        '/xn--moji-pb73c-analytics',
        analyticsData,
        'POST',
        N8N_BASE
    );
    total += 1;
    if (analyticsResult) passed += 1;

    return { passed, total, type: 'n8n' };
}

// Haupt-Test-Funktion
async function runAllTests() {
    console.log('🚀 Starting Keymoji Backend Tests...');
    console.log(`📍 Vercel Base: ${VERCEL_BASE}`);
    console.log(`📍 n8n Base: ${N8N_BASE}`);
    console.log('=' * 60);

    // Test Vercel APIs
    const vercelResults = await testVercelAPIs();

    // Test n8n Webhooks
    const n8nResults = await testN8nWebhooks();

    // Gesamtergebnis
    const totalPassed = vercelResults.passed + n8nResults.passed;
    const totalTests = vercelResults.total + n8nResults.total;

    console.log('\n' + '=' * 60);
    console.log('📊 FINAL TEST RESULTS');
    console.log('=' * 60);
    console.log(
        `Vercel APIs: ${vercelResults.passed}/${vercelResults.total} passed`
    );
    console.log(
        `n8n Webhooks: ${n8nResults.passed}/${n8nResults.total} passed`
    );
    console.log(`TOTAL: ${totalPassed}/${totalTests} tests passed`);

    if (totalPassed === totalTests) {
        console.log('🎉 ALL TESTS PASSED! Backend is ready for production!');
    } else {
        console.log('⚠️ Some tests failed. Check the logs above for details.');
    }

    return {
        vercel: vercelResults,
        n8n: n8nResults,
        total: { passed: totalPassed, total: totalTests }
    };
}

// Script ausführen
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testAPI,
    testVercelAPIs,
    testN8nWebhooks,
    runAllTests
};
