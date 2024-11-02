const fs = require('fs');
const path = require('path');

function getBuildSize(directory) {
    let totalSize = 0;
    try {
        const files = fs.readdirSync(directory, { withFileTypes: true });
        
        files.forEach(file => {
            const filePath = path.join(directory, file.name);
            if (file.isDirectory()) {
                totalSize += getBuildSize(filePath);
            } else {
                totalSize += fs.statSync(filePath).size;
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error.message);
    }
    
    return totalSize;
}

function formatSize(bytes) {
    const units = ['B', 'KB', 'MB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// Farbige Konsolenausgaben ohne chalk
const colors = {
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`
};

try {
    const buildDir = path.join(__dirname, '../build');
    const totalSize = getBuildSize(buildDir);
    const formattedSize = formatSize(totalSize);

    console.log(colors.green(`\n✨ Build optimized successfully!`));
    console.log(colors.blue(`📦 Total build size: ${formattedSize}\n`));

    if (totalSize > 1024 * 1024) {
        console.log(colors.yellow(`⚠️  Warning: Build size is over 1MB. Consider additional optimizations.`));
    }

    // Detaillierte Aufschlüsselung
    console.log('\nDetailed build analysis:');
    const cssSize = getBuildSize(path.join(buildDir, 'static/css'));
    const jsSize = getBuildSize(path.join(buildDir, 'static/js'));
    
    console.log(colors.blue(`CSS size: ${formatSize(cssSize)}`));
    console.log(colors.blue(`JS size: ${formatSize(jsSize)}`));
} catch (error) {
    console.error('Error during build analysis:', error.message);
    process.exit(1);
}