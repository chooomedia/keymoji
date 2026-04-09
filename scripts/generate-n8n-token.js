#!/usr/bin/env node
/**
 * Generate secure token for n8n Apertus Webhook
 *
 * Usage:
 *   node scripts/generate-n8n-token.js
 *   node scripts/generate-n8n-token.js --length 64
 *   node scripts/generate-n8n-token.js --env dev
 *   node scripts/generate-n8n-token.js --env prod
 */

const crypto = require('crypto');

// Parse command line arguments
const args = process.argv.slice(2);
const lengthArg = args.find(arg => arg.startsWith('--length='));
const envArg = args.find(arg => arg.startsWith('--env='));

const tokenLength = lengthArg ? parseInt(lengthArg.split('=')[1]) : 64;
const environment = envArg ? envArg.split('=')[1] : 'dev';

// Generate secure random token
function generateToken(length = 64) {
    // Use crypto.randomBytes for cryptographically secure random generation
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').substring(0, length);
}

// Generate token
const token = generateToken(tokenLength);

console.log('\n🔐 Secure Token Generated\n');
console.log('═'.repeat(80));
console.log(`Environment: ${environment.toUpperCase()}`);
console.log(`Length: ${tokenLength} characters`);
console.log('═'.repeat(80));
console.log('\n📋 Token:');
console.log(token);
console.log('\n' + '═'.repeat(80));

// Instructions
console.log('\n📝 Next Steps:\n');

if (environment === 'dev') {
    console.log('1. Add to .env.local (Development):');
    console.log(`   VITE_N8N_APERTUS_TOKEN=${token}\n`);
    console.log('2. Add to n8n Environment Variables:');
    console.log(`   Name: N8N_APERTUS_TOKEN`);
    console.log(`   Value: ${token}\n`);
} else if (environment === 'prod') {
    console.log('1. Add to Vercel Environment Variables (Production):');
    console.log(`   Name: VITE_N8N_APERTUS_TOKEN`);
    console.log(`   Value: ${token}`);
    console.log(`   Environment: Production, Preview, Development\n`);
    console.log('2. Add to n8n Environment Variables:');
    console.log(`   Name: N8N_APERTUS_TOKEN`);
    console.log(`   Value: ${token}\n`);
} else {
    console.log('1. Add to .env.local (Development):');
    console.log(`   VITE_N8N_APERTUS_TOKEN=${token}\n`);
    console.log('2. Add to Vercel Environment Variables (Production):');
    console.log(`   Name: VITE_N8N_APERTUS_TOKEN`);
    console.log(`   Value: ${token}\n`);
    console.log('3. Add to n8n Environment Variables:');
    console.log(`   Name: N8N_APERTUS_TOKEN`);
    console.log(`   Value: ${token}\n`);
}

console.log('⚠️  Security Notes:');
console.log('   - Never commit tokens to Git');
console.log('   - Use different tokens for dev and production');
console.log('   - Store tokens securely');
console.log('   - Rotate tokens regularly (every 90 days recommended)');
console.log('   - Keep .env.local in .gitignore\n');

// Copy to clipboard hint (if available)
if (process.platform === 'darwin') {
    console.log('💡 Tip: Copy token with:');
    console.log(`   echo "${token}" | pbcopy\n`);
} else if (process.platform === 'linux') {
    console.log('💡 Tip: Copy token with:');
    console.log(`   echo "${token}" | xclip -selection clipboard\n`);
} else if (process.platform === 'win32') {
    console.log('💡 Tip: Copy token with:');
    console.log(`   echo "${token}" | clip\n`);
}

console.log('═'.repeat(80) + '\n');
