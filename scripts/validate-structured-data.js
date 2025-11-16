// scripts/validate-structured-data.js
// Validiert die Structured Data gegen Schema.org Standards

const https = require('https');
// Dynamisch importieren von TypeScript-Modul
let generateStructuredData;
(async () => {
    const seoModule = await import('../src/utils/seo.ts');
    generateStructuredData = seoModule.generateStructuredData;
})();

// ANSI color codes for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

async function validateStructuredData() {
    // Warte auf Modul-Import
    if (!generateStructuredData) {
        const seoModule = await import('../src/utils/seo.ts');
        generateStructuredData = seoModule.generateStructuredData;
    }
    console.log(
        `${colors.blue}🔍 Validating Structured Data...${colors.reset}\n`
    );

    // Test data for validation
    const testSeoData = {
        pageType: 'home',
        title: 'Keymoji - Emoji Password Generator',
        description: 'Generate secure, AI-resistant emoji passwords.',
        canonical: 'https://keymoji.wtf/',
        image: '/images/keymoji-social-media-banner-10-2024-min.png'
    };

    const structuredData = generateStructuredData(testSeoData, 'en');

    // Check required fields for WebApplication
    if (structuredData['@type'] === 'WebApplication') {
        console.log(
            `${colors.green}✅ WebApplication Schema found${colors.reset}`
        );

        // Required fields
        const requiredFields = [
            'name',
            'url',
            'description',
            'applicationCategory'
        ];
        const missingFields = requiredFields.filter(
            field => !structuredData[field]
        );

        if (missingFields.length > 0) {
            console.log(
                `${colors.red}❌ Missing required fields: ${missingFields.join(
                    ', '
                )}${colors.reset}`
            );
        } else {
            console.log(
                `${colors.green}✅ All required fields present${colors.reset}`
            );
        }

        // Check offers
        if (structuredData.offers) {
            console.log(`${colors.green}✅ Offers present${colors.reset}`);
        }

        // Check featureList
        if (structuredData.featureList) {
            console.log(
                `${colors.green}✅ FeatureList present (${structuredData.featureList.length} features)${colors.reset}`
            );
        }
    }

    // Check FAQ Schema (nur wenn @graph vorhanden)
    if (structuredData['@graph'] && Array.isArray(structuredData['@graph'])) {
        const faq = structuredData['@graph'].find(
            item => item['@type'] === 'FAQPage'
        );
        if (faq) {
            console.log(`${colors.green}✅ FAQPage Schema found${colors.reset}`);
            if (faq.mainEntity) {
                console.log(`   - ${faq.mainEntity.length} questions configured`);
            }
        }
    }

    // Validate against Schema.org API (optional - requires internet)
    console.log(
        `\n${colors.blue}📡 Validating with Schema.org API...${colors.reset}`
    );

    const data = JSON.stringify(structuredData);

    const options = {
        hostname: 'validator.schema.org',
        path: '/v1/validate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, res => {
        let responseData = '';

        res.on('data', chunk => {
            responseData += chunk;
        });

        res.on('end', () => {
            try {
                const result = JSON.parse(responseData);

                if (result.errors && result.errors.length > 0) {
                    console.log(
                        `${colors.red}❌ Validation errors found:${colors.reset}`
                    );
                    result.errors.forEach(error => {
                        console.log(`   - ${error.message}`);
                    });
                } else {
                    console.log(
                        `${colors.green}✅ Schema.org validation passed!${colors.reset}`
                    );
                }

                if (result.warnings && result.warnings.length > 0) {
                    console.log(`${colors.yellow}⚠️  Warnings:${colors.reset}`);
                    result.warnings.forEach(warning => {
                        console.log(`   - ${warning.message}`);
                    });
                }
            } catch (error) {
                console.log(
                    `${colors.yellow}⚠️  Could not parse validation response${colors.reset}`
                );
            }
        });
    });

    req.on('error', error => {
        console.log(
            `${colors.yellow}⚠️  Could not connect to Schema.org validator (offline validation only)${colors.reset}`
        );
    });

    req.write(data);
    req.end();

    // Local validation summary
    console.log(`\n${colors.blue}📊 Local Validation Summary:${colors.reset}`);
    if (structuredData['@graph'] && Array.isArray(structuredData['@graph'])) {
        console.log(
            `- Schema types: ${structuredData['@graph']
                .map(item => item['@type'])
                .join(', ')}`
        );
        console.log(`- Total nodes: ${structuredData['@graph'].length}`);
    } else {
        console.log(`- Schema type: ${structuredData['@type']}`);
    }
    const faq = structuredData['@graph']?.find(item => item['@type'] === 'FAQPage');
    const webApp = structuredData['@type'] === 'WebApplication' ? structuredData : null;
    console.log(`- Has FAQ: ${faq ? 'Yes' : 'No'}`);
    console.log(`- Has Rating: ${webApp?.aggregateRating ? 'Yes' : 'No'}`);

    // Generate test URLs
    console.log(`\n${colors.blue}🔗 Test your structured data:${colors.reset}`);
    console.log(`1. Google: https://search.google.com/test/rich-results`);
    console.log(`2. Schema.org: https://validator.schema.org/`);
    console.log(
        `3. Structured Data Linter: http://linter.structured-data.org/`
    );
}

// Run validation
validateStructuredData();
