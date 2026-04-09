// src/stores/seoStore.ts
/**
 * SEO Store für dynamische SEO-Verwaltung
 * 
 * TypeScript Migration: v0.7.7
 */

import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { currentLanguage, t } from './contentStore.js';
import { DEFAULT_SEO, formatCanonicalUrl, type SEOConfig } from '../utils/seo';

// Create the SEO store
const seoSettings: Writable<Partial<SEOConfig>> = writable(DEFAULT_SEO);

// Derived store to include language-specific content
export const seo: Readable<SEOConfig> = derived(
    [seoSettings, currentLanguage],
    ([$seoSettings, $currentLanguage]) => {
        // Start with the current settings
        const settings: SEOConfig = { ...DEFAULT_SEO, ...$seoSettings };

        // If pageType is set, try to get language-specific content
        if (settings.pageType) {
            // Only set these values if they weren't explicitly provided
            if (!settings.title) {
                settings.title =
                    t(`${settings.pageType}.pageTitle`) || DEFAULT_SEO.title;
            }

            if (!settings.description) {
                settings.description =
                    t(`${settings.pageType}.pageDescription`) ||
                    DEFAULT_SEO.description;
            }

            if (!settings.keywords) {
                settings.keywords =
                    t(`${settings.pageType}.pageKeywords`) ||
                    DEFAULT_SEO.keywords;
            }
        }

        // Format canonical URL if not provided
        if (!settings.canonical && settings.url) {
            settings.canonical = formatCanonicalUrl(settings.url);
        }

        return settings;
    }
);

// Function to update SEO settings
export function updateSeo(newSettings: Partial<SEOConfig>): void {
    seoSettings.update(currentSettings => {
        return { ...currentSettings, ...newSettings };
    });
}

// Function to reset SEO settings to default
export function resetSeo(): void {
    seoSettings.set(DEFAULT_SEO);
}

// Export the store and functions
export default {
    seo,
    updateSeo,
    resetSeo
};

