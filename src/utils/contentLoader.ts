/*
Content loader utility for efficiently loading and caching JSON content files.
Provides centralized content management with caching and error handling.
Manages content cache and preloading functionality for improved performance.
*/
import { isDebugMode } from './environment';

function debugContentLoader(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 ContentLoader Debug: ${context}`);
    if (data) console.log(data);
    console.groupEnd();
}

const contentCache = new Map<string, unknown>();

/**
 * Load content from a JSON file with caching
 *
 * @param filename - The filename to load (relative to /src/content/)
 * @param useCache - Whether to use cached version (default: true)
 * @returns Promise with the loaded content
 *
 * @example
 * const settings = await loadContent('userSettings.json');
 * const freshSettings = await loadContent('userSettings.json', false); // Skip cache
 */
export async function loadContent(filename: string, useCache: boolean = true): Promise<unknown> {
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
        debugContentLoader(`Error loading content from ${filename}`, error);
        throw error;
    }
}

/**
 * Clear the content cache
 *
 * @param filename - Optional filename to clear specific cache entry
 *
 * @example
 * clearContentCache(); // Clear all cache
 * clearContentCache('userSettings.json'); // Clear specific file cache
 */
export function clearContentCache(filename: string | null = null): void {
    if (filename) {
        contentCache.delete(filename);
    } else {
        contentCache.clear();
    }
}

/**
 * Get cached content without loading from server
 *
 * @param filename - The filename to get from cache
 * @returns The cached content or null if not cached
 *
 * @example
 * const cachedSettings = getCachedContent('userSettings.json');
 * if (cachedSettings) {
 *     // Use cached version
 * }
 */
export function getCachedContent(filename: string): unknown | null {
    return contentCache.get(filename) || null;
}

/**
 * Preload multiple content files
 *
 * @param filenames - Array of filenames to preload
 * @returns Promise with object containing loaded content keyed by filename
 *
 * @example
 * const content = await preloadContent(['userSettings.json', 'translations.json']);
 * const settings = content['userSettings.json'];
 */
export async function preloadContent(filenames: string[]): Promise<Record<string, unknown>> {
    const content: Record<string, unknown> = {};

    await Promise.all(
        filenames.map(async filename => {
            try {
                const data = await loadContent(filename);
                content[filename] = data;
            } catch (error) {
                debugContentLoader(`Failed to preload ${filename}`, error);
                content[filename] = null;
            }
        })
    );

    return content;
}

/**
 * Check if content is cached
 *
 * @param filename - The filename to check
 * @returns Whether the content is cached
 *
 * @example
 * if (isContentCached('userSettings.json')) {
 *     // Content is available immediately
 * }
 */
export function isContentCached(filename: string): boolean {
    return contentCache.has(filename);
}

