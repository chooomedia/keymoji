#!/usr/bin/env node
/**
 * Check if Apertus n8n Token is properly configured
 * 
 * Usage:
 *   node scripts/check-apertus-token.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🔍 Apertus Token Configuration Check');
console.log('════════════════════════════════════════════════════════════════\n');

// Check .env.local
const envLocalPath = path.join(PROJECT_ROOT, '.env.local');
let tokenFound = false;
let tokenValue = null;

if (fs.existsSync(envLocalPath)) {
    console.log('✅ .env.local exists');
    
    // Load .env.local
    const envLocal = dotenv.config({ path: envLocalPath });
    
    if (envLocal.parsed && envLocal.parsed.VITE_N8N_APERTUS_TOKEN) {
        tokenFound = true;
        tokenValue = envLocal.parsed.VITE_N8N_APERTUS_TOKEN;
        console.log(`✅ Token found in .env.local`);
        console.log(`   Length: ${tokenValue.length} characters`);
        console.log(`   Preview: ${tokenValue.substring(0, 10)}...${tokenValue.substring(tokenValue.length - 4)}`);
    } else {
        console.log('❌ VITE_N8N_APERTUS_TOKEN not found in .env.local');
    }
} else {
    console.log('❌ .env.local does not exist');
}

console.log('\n════════════════════════════════════════════════════════════════\n');

if (!tokenFound) {
    console.log('📝 Next Steps:');
    console.log('   1. Generate token: npm run generate:token:dev');
    console.log('   2. Add to .env.local: VITE_N8N_APERTUS_TOKEN=<your-token>');
    console.log('   3. Restart dev server: npm run dev');
    console.log('   4. Configure n8n workflow with the same token\n');
    process.exit(1);
} else {
    console.log('✅ Token is configured correctly!');
    console.log('\n📝 Don\'t forget to:');
    console.log('   1. Set the same token in your n8n workflow');
    console.log('   2. Restart dev server if you just added the token');
    console.log('   3. Test the connection in Settings → Story Mode → Test Button\n');
    process.exit(0);
}

