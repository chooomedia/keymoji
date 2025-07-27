// scripts/check-social-images.js
const fs = require('fs');
const path = require('path');

// Required images for optimal social sharing
const requiredImages = [
    {
        path: '/images/keymoji-social-media-banner-10-2024-min.png',
        minWidth: 1200,
        minHeight: 630,
        maxSize: 5 * 1024 * 1024, // 5MB
        purpose: 'Open Graph main image'
    },
    {
        path: '/images/keymoji-logo-11-2023-simple.png',
        minWidth: 512,
        minHeight: 512,
        purpose: 'Square logo for various uses'
    },
    {
        path: '/apple-touch-icon.png',
        exactWidth: 180,
        exactHeight: 180,
        purpose: 'Apple touch icon'
    },
    {
        path: '/favicon-32x32.png',
        exactWidth: 32,
        exactHeight: 32,
        purpose: 'Favicon 32x32'
    },
    {
        path: '/favicon-16x16.png',
        exactWidth: 16,
        exactHeight: 16,
        purpose: 'Favicon 16x16'
    }
];

// Check if images exist and meet requirements
function checkImages() {
    console.log('🖼️  Checking social media images...\n');

    const publicDir = path.join(__dirname, '../../public');
    let allGood = true;

    requiredImages.forEach(img => {
        const fullPath = path.join(publicDir, img.path);

        console.log(`Checking: ${img.path}`);
        console.log(`Purpose: ${img.purpose}`);

        if (!fs.existsSync(fullPath)) {
            console.log(`❌ Missing: ${img.path}`);
            allGood = false;
        } else {
            const stats = fs.statSync(fullPath);
            console.log(`✅ Found (${(stats.size / 1024).toFixed(2)} KB)`);

            if (img.maxSize && stats.size > img.maxSize) {
                console.log(
                    `⚠️  File too large! Max: ${(
                        img.maxSize /
                        1024 /
                        1024
                    ).toFixed(2)} MB`
                );
                allGood = false;
            }
        }

        console.log('');
    });

    if (!allGood) {
        console.log('⚠️  Some images are missing or need optimization!');
        console.log('\nRecommendations:');
        console.log('1. Open Graph image should be 1200x630px or 1640x924px');
        console.log('2. Keep file sizes under 5MB for faster loading');
        console.log('3. Use PNG for logos, JPG for photos');
        console.log('4. Consider using WebP with PNG fallback');
    } else {
        console.log('✅ All social media images are present!');
    }

    // Generate missing favicon sizes if base exists
    generateFavicons();
}

function generateFavicons() {
    console.log('\n🎨 Favicon recommendations:');
    console.log('- favicon.ico (multi-size: 16x16, 32x32, 48x48)');
    console.log('- apple-touch-icon.png (180x180)');
    console.log('- android-chrome-192x192.png');
    console.log('- android-chrome-512x512.png');
    console.log('- mstile-150x150.png (Windows)');
}

// Run the check
checkImages();
