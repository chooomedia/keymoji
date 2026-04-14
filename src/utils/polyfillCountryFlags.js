/**
 * Country flag emoji polyfill for Chromium on Windows.
 *
 * Microsoft's Segoe UI Emoji font omits Regional Indicator flag ligatures.
 * Chromium-based browsers (Chrome, Edge, Brave) rely on OS fonts — so flags
 * render as ISO letter pairs ("US", "CH") instead of glyphs on Windows.
 *
 * This utility detects the issue via a canvas pixel test, then injects a
 * @font-face that loads a Twemoji Country Flags WOFF2 subset (~77kB) scoped
 * to the flag unicode-range. Browsers with native support skip the download.
 *
 * Based on: https://github.com/talkjs/country-flag-emoji-polyfill (MIT)
 */

const FONT_NAME = 'Twemoji Country Flags';
const FONT_URL =
    'https://cdn.jsdelivr.net/npm/country-flag-emoji-polyfill@0.1.8/dist/TwemojiCountryFlags.woff2';

// Regional Indicator Symbols A–Z (U+1F1E6–U+1F1FF) form flag ligatures.
const UNICODE_RANGE =
    'U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067, ' +
    'U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F';

/**
 * Detects whether the current browser can render color flag emojis.
 * Draws 🇺🇸 onto a 1×1 canvas; on Windows/Chromium the fallback glyph
 * is grayscale, so we check for any non-grey pixel.
 *
 * @returns {boolean}
 */
function supportsFlagEmojis() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        ctx.font = '1px sans-serif';
        ctx.fillText('🇺🇸', -4, 4);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        // A colored flag pixel has R ≠ G or R ≠ B; the grey fallback has R≈G≈B
        return r !== g || r !== b;
    } catch {
        return true; // Assume support if canvas is unavailable (SSR/Node)
    }
}

/**
 * Injects the Twemoji Country Flags webfont if the browser needs it.
 * Safe to call multiple times — only injects once.
 */
export function polyfillCountryFlagEmojis() {
    if (typeof document === 'undefined') return;
    if (supportsFlagEmojis()) return;
    if (document.getElementById('twemoji-country-flags-font')) return;

    const style = document.createElement('style');
    style.id = 'twemoji-country-flags-font';
    style.textContent = `
        @font-face {
            font-family: "${FONT_NAME}";
            src: url("${FONT_URL}") format("woff2");
            unicode-range: ${UNICODE_RANGE};
        }
    `;
    document.head.appendChild(style);
}
