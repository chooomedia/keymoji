/**
 * Content Loader Utility
 *
 * @description Efficiently loads and caches JSON content files for better performance.
 * Provides a centralized way to manage content loading with caching and error handling.
 *
 * @example
 * import { loadContent } from '../utils/contentLoader.js';
 *
 * const settingsConfig = await loadContent('userSettings.json');
 * const translations = await loadContent('translations.json');
 */

// Cache for loaded content
const contentCache = new Map();

/**
 * Load content from a JSON file with caching
 *
 * @param {string} filename - The filename to load (relative to /src/content/)
 * @param {boolean} useCache - Whether to use cached version (default: true)
 * @returns {Promise<Object>} The loaded content
 *
 * @example
 * const settings = await loadContent('userSettings.json');
 * const freshSettings = await loadContent('userSettings.json', false); // Skip cache
 */
export async function loadContent(filename, useCache = true) {
    const cacheKey = filename;

    // Return cached version if available and cache is enabled
    if (useCache && contentCache.has(cacheKey)) {
        return contentCache.get(cacheKey);
    }

    try {
        const response = await fetch(`/content/${filename}`);

        if (!response.ok) {
            throw new Error(
                `Failed to load content: ${response.status} ${response.statusText}`
            );
        }

        const content = await response.json();

        // Cache the content
        if (useCache) {
            contentCache.set(cacheKey, content);
        }

        return content;
    } catch (error) {
        console.error(`Error loading content from ${filename}:`, error);
        throw error;
    }
}

/**
 * Clear the content cache
 *
 * @param {string} filename - Optional filename to clear specific cache entry
 *
 * @example
 * clearContentCache(); // Clear all cache
 * clearContentCache('userSettings.json'); // Clear specific file cache
 */
export function clearContentCache(filename = null) {
    if (filename) {
        contentCache.delete(filename);
    } else {
        contentCache.clear();
    }
}

/**
 * Get cached content without loading from server
 *
 * @param {string} filename - The filename to get from cache
 * @returns {Object|null} The cached content or null if not cached
 *
 * @example
 * const cachedSettings = getCachedContent('userSettings.json');
 * if (cachedSettings) {
 *     // Use cached version
 * }
 */
export function getCachedContent(filename) {
    return contentCache.get(filename) || null;
}

/**
 * Preload multiple content files
 *
 * @param {string[]} filenames - Array of filenames to preload
 * @returns {Promise<Object>} Object with loaded content keyed by filename
 *
 * @example
 * const content = await preloadContent(['userSettings.json', 'translations.json']);
 * const settings = content['userSettings.json'];
 * const translations = content['translations.json'];
 */
export async function preloadContent(filenames) {
    const content = {};

    await Promise.all(
        filenames.map(async filename => {
            try {
                content[filename] = await loadContent(filename);
            } catch (error) {
                console.error(`Failed to preload ${filename}:`, error);
                content[filename] = null;
            }
        })
    );

    return content;
}

/**
 * Check if content is cached
 *
 * @param {string} filename - The filename to check
 * @returns {boolean} Whether the content is cached
 *
 * @example
 * if (isContentCached('userSettings.json')) {
 *     // Content is available immediately
 * }
 */
export function isContentCached(filename) {
    return contentCache.has(filename);
}
