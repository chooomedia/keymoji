// src/stores/seoStore.ts
// SEO Store für dynamische SEO-Verwaltung
// TypeScript Migration: v0.7.7
// Klassische Stores verwenden (Runes funktionieren nur in .svelte Komponenten)

import { writable, derived, get, type Writable, type Readable } from 'svelte/store';
import { currentLanguage, t } from './contentStore.ts';
import { DEFAULT_SEO, formatCanonicalUrl, type SEOConfig } from '../utils/seo';

const seoSettings: Writable<Partial<SEOConfig>> = writable<Partial<SEOConfig>>(DEFAULT_SEO);

export const seo: Readable<SEOConfig> = derived(
    [seoSettings, currentLanguage],
    ([$seoSettings, $currentLanguage]) => {
        const settings: SEOConfig = { ...DEFAULT_SEO, ...$seoSettings };

        if (settings.pageType) {
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
                    t(`${settings.pageType}.pageKeywords`) || DEFAULT_SEO.keywords;
            }
        }

        if (!settings.canonical && settings.url) {
            settings.canonical = formatCanonicalUrl(settings.url);
        }

        return settings;
    }
);

export function updateSeo(newSettings: Partial<SEOConfig>): void {
    seoSettings.update(current => ({ ...current, ...newSettings }));
}

export function resetSeo(): void {
    seoSettings.set(DEFAULT_SEO);
}

export default {
    seo,
    updateSeo,
    resetSeo
};
