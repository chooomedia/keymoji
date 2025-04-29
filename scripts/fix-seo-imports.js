// scripts/fix-seo-imports.js
const fs = require('fs');
const path = require('path');

/**
 * This script fixes SEO component imports across the project
 * It addresses inconsistent imports of SEO and Seo component paths
 */

// Define the files that need fixing
const filesToFix = [
    { path: 'src/BlogPost.svelte', importPath: './components/Seo.svelte' },
    { path: 'src/EmojiDisplay.svelte', importPath: './components/Seo.svelte' },
    { path: 'src/index.svelte', importPath: './components/Seo.svelte' },
    {
        path: 'src/routes/ContactForm.svelte',
        importPath: '../components/Seo.svelte'
    },
    {
        path: 'src/routes/NotFound.svelte',
        importPath: '../components/Seo.svelte'
    },
    {
        path: 'src/routes/VersionHistory.svelte',
        importPath: '../components/Seo.svelte'
    }
];

// Function to fix an individual file
function fixFile(filePath, correctImportPath) {
    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        return false;
    }

    try {
        let content = fs.readFileSync(fullPath, 'utf8');

        // Find any import statements for SEO components with incorrect paths
        const importRegex = /import\s+(?:SEO|Seo).*?from\s+['"](.+?)['"];?/g;
        const match = importRegex.exec(content);

        if (match) {
            // Replace the old import path with the correct one
            content = content.replace(
                importRegex,
                `import SEO from '${correctImportPath}';`
            );

            // Also fix any usage of Seo to SEO for consistency
            content = content.replace(/<Seo/g, '<SEO');
            content = content.replace(/<\/Seo>/g, '</SEO>');

            // Write the fixed content back to the file
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Fixed SEO import in ${filePath}`);
            return true;
        } else {
            console.log(`No SEO import found in ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error);
        return false;
    }
}

// Main function to fix all files
function fixAllFiles() {
    console.log('Fixing SEO component imports...');

    // Ensure the components directory exists
    const componentsDir = path.resolve(process.cwd(), 'src/components');
    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
        console.log('Created components directory');
    }

    // Check if both Seo.svelte and SEO.svelte exist, and standardize to Seo.svelte
    const seoPath = path.join(componentsDir, 'Seo.svelte');
    const seoLowerPath = path.join(componentsDir, 'Seo.svelte');

    if (fs.existsSync(seoPath) && !fs.existsSync(seoLowerPath)) {
        // If only SEO.svelte exists, copy it to Seo.svelte for consistency
        fs.copyFileSync(seoPath, seoLowerPath);
        console.log('Copied Seo.svelte to Seo.svelte for consistency');
    }

    // Fix imports in all specified files
    const results = filesToFix.map(file => fixFile(file.path, file.importPath));

    // Report summary
    const fixedCount = results.filter(result => result).length;
    console.log(`Fixed ${fixedCount} of ${filesToFix.length} files`);
}

// Run the fix
fixAllFiles();
