// src/data/contentLoader.js
// Dynamischer Content-Loader mit Fallback und Caching

import { commonContent, contentTemplate, contentHelpers } from './content.js';

/**
 * Content-Loader mit Caching und Fallback
 */
class ContentLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
        this.fallbackLanguage = 'en';
        this.supportedLanguages = [
            'en',
            'de',
            'dech',
            'fr',
            'es',
            'it',
            'nl',
            'pl',
            'ru',
            'ja',
            'ko',
            'tr',
            'af',
            'tlh',
            'sjn'
        ];
    }

    /**
     * Lädt Content für eine Sprache
     */
    async loadContent(language) {
        // Prüfe Cache
        if (this.cache.has(language)) {
            return this.cache.get(language);
        }

        // Prüfe ob bereits geladen wird
        if (this.loading.has(language)) {
            return this.loading.get(language);
        }

        // Starte Loading
        const loadPromise = this._loadLanguageContent(language);
        this.loading.set(language, loadPromise);

        try {
            const content = await loadPromise;
            this.cache.set(language, content);
            this.loading.delete(language);
            return content;
        } catch (error) {
            this.loading.delete(language);
            console.error(`Failed to load content for ${language}:`, error);

            // Fallback auf Englisch
            if (language !== this.fallbackLanguage) {
                return this.loadContent(this.fallbackLanguage);
            }

            // Letzter Fallback: Template
            return this._createFallbackContent(language);
        }
    }

    /**
     * Lädt Sprachdatei dynamisch
     */
    async _loadLanguageContent(language) {
        try {
            // Dynamischer Import der Sprachdatei
            const module = await import(`./languages/${language}.js`);
            const languageContent = module.default || module;

            // Validiere Content
            if (!contentHelpers.validateContent(languageContent, language)) {
                throw new Error(`Invalid content structure for ${language}`);
            }

            // Merge mit Template und Common Content
            const mergedContent = this._mergeContent(languageContent);

            return mergedContent;
        } catch (error) {
            console.warn(
                `Could not load language file for ${language}:`,
                error
            );
            throw error;
        }
    }

    /**
     * Merge Content mit Template und Common
     */
    _mergeContent(languageContent) {
        // Merge mit Template
        let merged = contentHelpers.mergeContent(
            languageContent,
            contentTemplate
        );

        // Füge Common Content hinzu
        merged = {
            ...merged,
            _common: commonContent,
            _meta: {
                language: languageContent._meta?.language || 'unknown',
                version: commonContent.version,
                lastUpdated: new Date().toISOString()
            }
        };

        return merged;
    }

    /**
     * Erstellt Fallback-Content
     */
    _createFallbackContent(language) {
        console.warn(`Creating fallback content for ${language}`);

        const fallbackContent = contentHelpers.createLanguageContent(language, {
            _meta: {
                language,
                isFallback: true,
                created: new Date().toISOString()
            }
        });

        return this._mergeContent(fallbackContent);
    }

    /**
     * Lädt mehrere Sprachen parallel
     */
    async loadMultipleLanguages(languages) {
        const promises = languages.map(lang => this.loadContent(lang));
        const results = await Promise.allSettled(promises);

        const loaded = {};
        results.forEach((result, index) => {
            const language = languages[index];
            if (result.status === 'fulfilled') {
                loaded[language] = result.value;
            } else {
                console.error(`Failed to load ${language}:`, result.reason);
            }
        });

        return loaded;
    }

    /**
     * Lädt alle unterstützten Sprachen
     */
    async loadAllLanguages() {
        return this.loadMultipleLanguages(this.supportedLanguages);
    }

    /**
     * Cache leeren
     */
    clearCache(language = null) {
        if (language) {
            this.cache.delete(language);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Cache-Status abrufen
     */
    getCacheStatus() {
        return {
            cached: Array.from(this.cache.keys()),
            loading: Array.from(this.loading.keys()),
            supported: this.supportedLanguages
        };
    }

    /**
     * Prüft ob Sprache unterstützt wird
     */
    isLanguageSupported(language) {
        return this.supportedLanguages.includes(language);
    }

    /**
     * Get Content mit Fallback
     */
    getContent(content, path, fallback = '') {
        return contentHelpers.getContent(content, path, fallback);
    }

    /**
     * Validiert Content-Struktur
     */
    validateContent(content, language) {
        return contentHelpers.validateContent(content, language);
    }
}

// Singleton-Instanz
export const contentLoader = new ContentLoader();

// Export für direkten Zugriff
export default contentLoader;
