#!/usr/bin/env node
/**
 * Version Bump Script
 * 
 * Automatische Versionierung basierend auf Semantic Versioning
 * 
 * Usage:
 *   node scripts/bump-version.js patch   # 0.7.7 -> 0.7.8
 *   node scripts/bump-version.js minor   # 0.7.7 -> 0.8.0
 *   node scripts/bump-version.js major    # 0.7.7 -> 1.0.0
 *   node scripts/bump-version.js 0.8.0    # Setze spezifische Version
 */

const fs = require('fs');
const path = require('path');

const VERSION_FILES = [
    { path: 'package.json', key: 'version' },
    { path: 'src/utils/version.js', pattern: /export const appVersion = ['"](.*?)['"]/ }
];

function getCurrentVersion() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
}

function bumpVersion(currentVersion, type) {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (type) {
        case 'major':
            return `${major + 1}.0.0`;
        case 'minor':
            return `${major}.${minor + 1}.0`;
        case 'patch':
            return `${major}.${minor}.${patch + 1}`;
        default:
            // Assume it's a specific version string
            if (/^\d+\.\d+\.\d+/.test(type)) {
                return type;
            }
            throw new Error(`Invalid version type: ${type}. Use 'major', 'minor', 'patch', or a version string like '1.2.3'`);
    }
}

function updatePackageJson(newVersion) {
    const packagePath = 'package.json';
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4) + '\n');
    console.log(`✅ Updated ${packagePath}: ${newVersion}`);
}

function updateVersionJs(newVersion) {
    const versionPath = 'src/utils/version.js';
    let content = fs.readFileSync(versionPath, 'utf8');
    
    // Update appVersion
    content = content.replace(
        /export const appVersion = ['"](.*?)['"]/,
        `export const appVersion = '${newVersion}'`
    );
    
    // Update versionInfo.updated date
    const today = new Date().toISOString().split('T')[0];
    content = content.replace(
        /updated: ['"](.*?)['"]/,
        `updated: '${today}'`
    );
    
    fs.writeFileSync(versionPath, content);
    console.log(`✅ Updated ${versionPath}: ${newVersion}`);
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Usage: node scripts/bump-version.js [patch|minor|major|version]');
        process.exit(1);
    }
    
    const type = args[0];
    const currentVersion = getCurrentVersion();
    const newVersion = bumpVersion(currentVersion, type);
    
    console.log(`📦 Bumping version: ${currentVersion} -> ${newVersion}`);
    
    updatePackageJson(newVersion);
    updateVersionJs(newVersion);
    
    console.log(`\n✅ Version bumped successfully to ${newVersion}`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Review changes: git diff`);
    console.log(`   2. Commit: git add package.json src/utils/version.js`);
    console.log(`   3. Commit: git commit -m "chore: bump version to ${newVersion}"`);
    console.log(`   4. Tag: git tag v${newVersion}`);
    console.log(`   5. Push: git push origin <branch> --tags`);
}

if (require.main === module) {
    main();
}

module.exports = { bumpVersion, getCurrentVersion };

