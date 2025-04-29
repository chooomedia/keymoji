# Font Requirements

This directory should contain the following font files:

- tengwar_annatar.ttf (Elvish font for the Quenya language option)

Please add the required font files to this directory before building the project.

## Temporarily Missing Fonts

If you're seeing build errors related to missing font files, you can:

1. Download the required font (tengwar_annatar.ttf) from an appropriate source
2. Place it in this directory
3. Rebuild the project

## Alternative Approach

If you can't obtain the font, you can modify the CSS to not require it:

1. Open src/index.css
2. Remove or comment out the @font-face declaration for Tengwar Annatar
3. Replace references to this font with standard fonts