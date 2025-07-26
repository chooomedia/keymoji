// scripts/validate-structured-data.js
// Validiert die Structured Data gegen Schema.org Standards

const https = require('https');
const { SEO_ENHANCEMENTS } = require('../src/utils/seo-enhancements.js');

// ANSI color codes for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

async function validateStructuredData() {
    console.log(
        `${colors.blue}🔍 Validating Structured Data...${colors.reset}\n`
    );

    const structuredData = SEO_ENHANCEMENTS.getStructuredData();

    // Check required fields for WebApplication
    const webApp = structuredData['@graph'].find(
        item => item['@type'] === 'WebApplication'
    );
    if (webApp) {
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
        const missingFields = requiredFields.filter(field => !webApp[field]);

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

        // Check aggregateRating
        if (webApp.aggregateRating) {
            console.log(
                `${colors.yellow}⚠️  AggregateRating present (ensure you have actual reviews)${colors.reset}`
            );
        }
    }

    // Check FAQ Schema
    const faq = structuredData['@graph'].find(
        item => item['@type'] === 'FAQPage'
    );
    if (faq) {
        console.log(`${colors.green}✅ FAQPage Schema found${colors.reset}`);
        console.log(`   - ${faq.mainEntity.length} questions configured`);
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
    console.log(
        `- Schema types: ${structuredData['@graph']
            .map(item => item['@type'])
            .join(', ')}`
    );
    console.log(`- Total nodes: ${structuredData['@graph'].length}`);
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
