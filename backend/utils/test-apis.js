/**
 * API Test Script für Keymoji Backend
 * Testet alle verfügbaren APIs
 */

const BASE_URL = process.env.VERCEL_URL || 'http://localhost:3000';

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
        message: 'This is a test message from the API test script.',
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
        appVersion: process.env.APP_VERSION || '0.4.3'
    }
};

// Test-Funktionen
async function testAPI(endpoint, data, method = 'POST') {
    try {
        console.log(`🧪 Testing ${endpoint}...`);

        const response = await fetch(`${BASE_URL}${endpoint}`, {
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
            `📡 Response: ${result.substring(0, 200)}${
                result.length > 200 ? '...' : ''
            }`
        );

        if (response.ok) {
            console.log(`✅ ${endpoint} - SUCCESS`);
            return true;
        } else {
            console.log(`❌ ${endpoint} - FAILED`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${endpoint} - ERROR: ${error.message}`);
        return false;
    }
}

async function testEmailTemplates() {
    console.log('\n📧 Testing Email Templates...');

    const templates = [
        'welcome',
        'magic-link',
        'account-update',
        'password-reset',
        'all'
    ];

    for (const template of templates) {
        await testAPI('/api/test-emails', { template }, 'GET');
    }
}

async function testAccountAPI() {
    console.log('\n👤 Testing Account API...');

    // Test Account Creation
    await testAPI('/api/account', testData.account);

    // Test Account Retrieval
    await testAPI('/api/account', {
        action: 'get',
        userId: testData.account.userId
    });
}

async function testMagicLinkAPI() {
    console.log('\n🔗 Testing Magic Link API...');

    await testAPI('/api/magic-link/send', testData.magicLink);
}

async function testContactAPI() {
    console.log('\n📧 Testing Contact API...');

    await testAPI('/api/contact', testData.contact);
}

async function testRandomAPI() {
    console.log('\n🎲 Testing Random API...');

    await testAPI('/api/random', null, 'GET');
}

// Haupt-Test-Funktion
async function runAllTests() {
    console.log('🚀 Starting Keymoji Backend API Tests...');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log('=' * 50);

    let passed = 0;
    let total = 0;

    // Test Email Templates
    const emailResult = await testEmailTemplates();
    total += 5; // 5 templates
    if (emailResult) passed += 5;

    // Test Account API
    const accountResult = await testAccountAPI();
    total += 2; // create + get
    if (accountResult) passed += 2;

    // Test Magic Link API
    const magicLinkResult = await testMagicLinkAPI();
    total += 1;
    if (magicLinkResult) passed += 1;

    // Test Contact API
    const contactResult = await testContactAPI();
    total += 1;
    if (contactResult) passed += 1;

    // Test Random API
    const randomResult = await testRandomAPI();
    total += 1;
    if (randomResult) passed += 1;

    console.log('\n' + '=' * 50);
    console.log(`📊 Test Results: ${passed}/${total} tests passed`);

    if (passed === total) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('⚠️ Some tests failed. Check the logs above.');
    }
}

// Script ausführen
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testAPI,
    testEmailTemplates,
    testAccountAPI,
    testMagicLinkAPI,
    testContactAPI,
    testRandomAPI,
    runAllTests
};
