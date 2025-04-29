// webpack/utils/setup-fonts.js
const fs = require('fs');
const path = require('path');

/**
 * Checks if font files exist in the public/fonts directory
 * If not, creates the directory and adds a notice file
 * Handles errors gracefully to avoid build failures
 */
function setupFonts() {
    try {
        const publicDir = path.resolve(process.cwd(), 'public');
        const fontsDir = path.join(publicDir, 'fonts');

        // Create fonts directory if it doesn't exist
        if (!fs.existsSync(fontsDir)) {
            try {
                fs.mkdirSync(fontsDir, { recursive: true });
                console.log('Created fonts directory at:', fontsDir);
            } catch (error) {
                console.warn(
                    'Warning: Could not create fonts directory:',
                    error.message
                );
                // Continue execution - we'll still try to work with what we have
            }

            // Create a notice file to remind about required fonts
            try {
                const noticeContent = `
# Font Requirements

This directory should contain the following font files:

- tengwar_annatar.ttf (Elvish font for the Quenya language option)

Please add the required font files to this directory before building the project.
        `;

                fs.writeFileSync(
                    path.join(fontsDir, 'README.md'),
                    noticeContent.trim(),
                    'utf8'
                );

                console.log('Created font notice README.md');
            } catch (error) {
                console.warn(
                    'Warning: Could not create font notice:',
                    error.message
                );
            }
        }

        // Create a simple empty placeholder font file to prevent build errors
        const placeholderFontPath = path.join(fontsDir, 'tengwar_annatar.ttf');
        if (!fs.existsSync(placeholderFontPath)) {
            try {
                // Write an empty file as placeholder (1 byte)
                fs.writeFileSync(
                    placeholderFontPath,
                    Buffer.from([0]),
                    'binary'
                );
                console.log(
                    'Created placeholder font file (needs to be replaced with the real font)'
                );
            } catch (error) {
                console.warn(
                    'Warning: Could not create placeholder font file:',
                    error.message
                );
                console.log(
                    'Please create an empty file at:',
                    placeholderFontPath
                );
            }
        }

        // Skip copying from src to avoid permission issues
        // No need to copy existing font files for initial development
    } catch (error) {
        // Log the error but don't throw to prevent build failure
        console.warn('Warning: Font setup encountered issues:', error.message);
        console.log(
            'You may need to create public/fonts/tengwar_annatar.ttf manually'
        );
    }
}

module.exports = setupFonts;
