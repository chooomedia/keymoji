/**
 * Email System Test für Keymoji
 * Testet alle Email-Funktionen: Contact, Account Creation, Magic Link
 */

const VERCEL_BASE = 'https://its.keymoji.wtf';

// Test-Daten
const testData = {
    contact: {
        name: 'Email Test User',
        email: 'email.test@example.com',
        message: 'This is a test message to verify email functionality.',
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
    },
    accountCreation: {
        action: 'create',
        userId: 'email_test_' + Date.now(),
        email: 'account.test@example.com',
        profile: {
            name: 'Account Email Test User'
        },
        metadata: {
            test: true,
            timestamp: new Date().toISOString()
        }
    },
    magicLink: {
        email: 'magiclink.test@example.com',
        name: 'Magic Link Test User',
        userId: 'magiclink_test_' + Date.now(),
        language: 'en'
    }
};

// Test-Funktionen
async function testAPI(endpoint, data, method = 'POST', baseUrl = VERCEL_BASE) {
    try {
        console.log(`🧪 Testing Email API: ${baseUrl}${endpoint}`);

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

// Email System Tests
async function testEmailSystem() {
    console.log('🚀 Starting Email System Tests...');
    console.log(`📍 Backend Base: ${VERCEL_BASE}`);
    console.log('=' * 60);

    let passed = 0;
    let total = 0;

    // Test Contact Email
    console.log('\n📧 Testing Contact Email...');
    const contactResult = await testAPI('/api/contact', testData.contact);
    total += 1;
    if (contactResult) passed += 1;

    // Test Account Creation Email (Welcome Email)
    console.log('\n👤 Testing Account Creation Email...');
    const accountResult = await testAPI(
        '/api/account',
        testData.accountCreation
    );
    total += 1;
    if (accountResult) passed += 1;

    // Test Magic Link Email
    console.log('\n🔗 Testing Magic Link Email...');
    const magicLinkResult = await testAPI(
        '/api/magic-link/send',
        testData.magicLink
    );
    total += 1;
    if (magicLinkResult) passed += 1;

    // Test Email Templates (Development Only)
    console.log('\n📄 Testing Email Templates...');
    const templateResult = await testAPI(
        '/api/test-emails?template=all',
        null,
        'GET'
    );
    total += 1;
    if (templateResult) passed += 1;

    return { passed, total, type: 'Email System' };
}

// Brevo API Test
async function testBrevoAPI() {
    console.log('\n🔧 Testing Brevo API Configuration...');
    console.log('=' * 50);

    let passed = 0;
    let total = 0;

    // Test if Brevo API Key is configured
    console.log('\n🔑 Testing Brevo API Key...');
    const contactTest = await testAPI('/api/contact', {
        ...testData.contact,
        email: 'brevo.test@example.com'
    });
    total += 1;
    if (contactTest) passed += 1;

    // Test Newsletter Integration
    console.log('\n📬 Testing Newsletter Integration...');
    const newsletterTest = await testAPI('/api/contact', {
        ...testData.contact,
        email: 'newsletter.test@example.com',
        newsletterOptIn: true
    });
    total += 1;
    if (newsletterTest) passed += 1;

    return { passed, total, type: 'Brevo API' };
}

// Haupt-Test-Funktion
async function runEmailTests() {
    console.log('🚀 Starting Complete Email System Tests...');
    console.log('=' * 60);

    // Test Email System
    const emailResults = await testEmailSystem();

    // Test Brevo API
    const brevoResults = await testBrevoAPI();

    // Gesamtergebnis
    const totalPassed = emailResults.passed + brevoResults.passed;
    const totalTests = emailResults.total + brevoResults.total;

    console.log('\n' + '=' * 60);
    console.log('📊 EMAIL SYSTEM TEST RESULTS');
    console.log('=' * 60);
    console.log(
        `Email System: ${emailResults.passed}/${emailResults.total} passed`
    );
    console.log(
        `Brevo API: ${brevoResults.passed}/${brevoResults.total} passed`
    );
    console.log(`TOTAL: ${totalPassed}/${totalTests} tests passed`);

    if (totalPassed === totalTests) {
        console.log('🎉 ALL EMAIL TESTS PASSED! Email system is working!');
    } else {
        console.log(
            '⚠️ Some email tests failed. Check the logs above for details.'
        );
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if BREVO_API_KEY is set in Vercel environment');
        console.log('2. Verify Brevo account is active');
        console.log('3. Check email templates are properly configured');
    }

    return {
        email: emailResults,
        brevo: brevoResults,
        total: { passed: totalPassed, total: totalTests }
    };
}

// Script ausführen
if (require.main === module) {
    runEmailTests().catch(console.error);
}

module.exports = {
    testAPI,
    testEmailSystem,
    testBrevoAPI,
    runEmailTests
};
