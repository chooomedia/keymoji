// src/stores/seoStore.js
import { writable, derived } from 'svelte/store';
import { currentLanguage } from './appStores.js';
import content from '../content.js';

// Default SEO settings
const defaultSeo = {
    title: '',
    description: '',
    url: '',
    image: './images/keymoji-logo-11-2023-simple.png',
    type: 'website',
    noindex: false,
    keywords: '',
    canonical: '',
    pageType: 'home'
};

// Create the SEO store
const seoSettings = writable(defaultSeo);

// Derived store to include language-specific content
export const seo = derived(
    [seoSettings, currentLanguage],
    ([$seoSettings, $currentLanguage]) => {
        // Start with the current settings
        const settings = { ...$seoSettings };

        // If pageType is set, try to get language-specific content
        if (
            settings.pageType &&
            content[$currentLanguage]?.[settings.pageType]
        ) {
            // Only set these values if they weren't explicitly provided
            if (!settings.title) {
                settings.title =
                    content[$currentLanguage][settings.pageType].pageTitle ||
                    'Keymoji - Emoji Password Generator';
            }

            if (!settings.description) {
                settings.description =
                    content[$currentLanguage][settings.pageType]
                        .pageDescription ||
                    'Generate secure emoji passwords for better online security.';
            }

            if (!settings.keywords) {
                settings.keywords =
                    content[$currentLanguage][settings.pageType].pageKeywords ||
                    'Keymoji, emoji password, password generator, security';
            }
        }

        // Format canonical URL if not provided
        if (!settings.canonical && settings.url) {
            settings.canonical = `https://keymoji.wtf${settings.url}`;
        }

        // Add trailing slash if needed
        if (
            settings.canonical &&
            !settings.canonical.endsWith('/') &&
            !settings.canonical.includes('.')
        ) {
            settings.canonical = `${settings.canonical}/`;
        }

        return settings;
    }
);

// Function to update SEO settings
export function updateSeo(newSettings) {
    seoSettings.update(currentSettings => {
        return { ...currentSettings, ...newSettings };
    });
}

// Function to reset SEO settings to default
export function resetSeo() {
    seoSettings.set(defaultSeo);
}

// Export the store and functions
export default {
    seo,
    updateSeo,
    resetSeo
};
