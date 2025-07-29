// src/config/storage.js
// Zentrale Konfiguration für localStorage-Keys

export const STORAGE_KEYS = {
    // Sprache und UI-Einstellungen
    LANGUAGE: 'keymoji_language',
    DARK_MODE: 'keymoji_darkMode',
    THEME: 'keymoji_theme',

    // App-spezifische Daten
    COUNTER_CACHE: 'keymoji_counter_cache',
    COUNTER_TIMESTAMP: 'keymoji_counter_timestamp',
    DAILY_REQUEST_COUNT: 'keymoji_daily_request_count',
    STORED_DATE: 'keymoji_stored_date',

    // Blog-Daten
    BLOG_POSTS: 'keymoji_blog_posts',

    // User-Präferenzen
    USER_PREFERENCES: 'keymoji_user_preferences',
    RECENT_EMOJIS: 'keymoji_recent_emojis',

    // Cache-Daten
    CACHE_PREFIX: 'keymoji_cache_',

    // Debug/Development
    DEBUG_MODE: 'keymoji_debug_mode'
};

// Helper-Funktionen für localStorage
export const storageHelpers = {
    // Sichere get-Methode mit Fallback
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading ${key} from localStorage:`, error);
            return defaultValue;
        }
    },

    // Sichere set-Methode
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Failed to save ${key} to localStorage:`, error);
            return false;
        }
    },

    // Sichere remove-Methode
    remove: key => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Failed to remove ${key} from localStorage:`, error);
            return false;
        }
    },

    // Prüfen ob Key existiert
    has: key => {
        return localStorage.getItem(key) !== null;
    },

    // Alle Keys mit Prefix löschen
    clearPrefix: prefix => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
};

export default STORAGE_KEYS;
