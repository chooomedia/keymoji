// src/config/storage.ts
// Zentrale Konfiguration für localStorage-Keys
// TypeScript Migration: v0.7.7

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface StorageKeys {
    // Sprache und UI-Einstellungen
    LANGUAGE: string;
    DARK_MODE: string;
    THEME: string;

    // App-spezifische Daten
    COUNTER_CACHE: string;
    COUNTER_TIMESTAMP: string;
    DAILY_REQUEST_COUNT: string; // DEPRECATED - use DAILY_USAGE
    STORED_DATE: string; // DEPRECATED - use DAILY_USAGE
    DAILY_USAGE: string; // NEW: Centralized daily usage tracking

    // Blog-Daten
    BLOG_POSTS: string;

    // User-Präferenzen
    USER_PREFERENCES: string;
    USER_SETTINGS: string;
    RECENT_EMOJIS: string;
    LOGIN_HISTORY: string;

    // Cache-Daten
    CACHE_PREFIX: string;

    // Usage History
    USAGE_HISTORY: string;
    USAGE_HISTORY_TIMESTAMP: string;

    // User Settings Timestamp
    USER_SETTINGS_TIMESTAMP: string;

    // Debug/Development
    DEBUG_MODE: string;
}

export interface StorageHelpers {
    get: <T = unknown>(key: string, defaultValue?: T | null) => T | null;
    set: (key: string, value: unknown) => boolean;
    remove: (key: string) => boolean;
    has: (key: string) => boolean;
    clearPrefix: (prefix: string) => void;
    clearAll: () => boolean;
    listAll: () => string[];
}

export interface DebugLocalStorageResult {
    keymojiKeys: string[];
    totalKeys: number;
    totalSize: number;
    totalSizeKB: string;
}

// ============================================
// CONSTANTS
// ============================================

export const STORAGE_KEYS: StorageKeys = {
    // Sprache und UI-Einstellungen
    LANGUAGE: 'keymoji_language',
    DARK_MODE: 'keymoji_darkMode',
    THEME: 'keymoji_theme',

    // App-spezifische Daten
    COUNTER_CACHE: 'keymoji_counter_cache',
    COUNTER_TIMESTAMP: 'keymoji_counter_timestamp',
    DAILY_REQUEST_COUNT: 'keymoji_daily_request_count', // DEPRECATED - use DAILY_USAGE
    STORED_DATE: 'keymoji_stored_date', // DEPRECATED - use DAILY_USAGE
    DAILY_USAGE: 'keymoji_daily_usage', // NEW: Centralized daily usage tracking

    // Blog-Daten
    BLOG_POSTS: 'keymoji_blog_posts',

    // User-Präferenzen
    USER_PREFERENCES: 'keymoji_user_preferences',
    USER_SETTINGS: 'keymoji_user_settings',
    RECENT_EMOJIS: 'keymoji_recent_emojis',
    LOGIN_HISTORY: 'keymoji_login_history',

    // Cache-Daten
    CACHE_PREFIX: 'keymoji_cache_',

    // Usage History
    USAGE_HISTORY: 'keymoji_usage_history',
    USAGE_HISTORY_TIMESTAMP: 'keymoji_usage_history_timestamp',

    // User Settings Timestamp
    USER_SETTINGS_TIMESTAMP: 'keymoji_user_settings_timestamp',

    // Debug/Development
    DEBUG_MODE: 'keymoji_debug_mode'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Helper-Funktionen für localStorage
export const storageHelpers: StorageHelpers = {
    // Sichere get-Methode mit Fallback
    get: <T = unknown>(key: string, defaultValue: T | null = null): T | null => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return defaultValue;
        }
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : defaultValue;
        } catch (error: unknown) {
            console.warn(`Error reading ${key} from localStorage:`, error);
            return defaultValue;
        }
    },

    // Sichere set-Methode
    set: (key: string, value: unknown): boolean => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return false;
        }
        try {
            // CRITICAL: Validate key length and characters to prevent localStorage errors
            // localStorage has practical limits: ~5-10MB total, but keys should be reasonable
            if (!key || typeof key !== 'string') {
                console.warn(`Invalid key type for localStorage:`, typeof key);
                return false;
            }
            
            // Warn if key is extremely long (might cause issues)
            if (key.length > 500) {
                console.warn(`⚠️ localStorage key is very long (${key.length} chars):`, key.substring(0, 100) + '...');
                // Don't fail, but log warning - some browsers might have issues
            }
            
            const serialized = JSON.stringify(value);
            
            // Check if value is too large (localStorage has ~5-10MB limit)
            if (serialized.length > 5 * 1024 * 1024) {
                console.error(`❌ Value too large for localStorage (${(serialized.length / 1024 / 1024).toFixed(2)}MB)`);
                return false;
            }
            
            localStorage.setItem(key, serialized);
            return true;
        } catch (error: unknown) {
            // Check for specific localStorage errors
            if (error instanceof Error) {
                if (error.name === 'QuotaExceededError' || (error as { code?: number }).code === 22) {
                    console.error(`❌ localStorage quota exceeded for key: ${key.substring(0, 100)}`);
                } else if (error.name === 'SecurityError' || (error as { code?: number }).code === 18) {
                    console.error(`❌ localStorage security error (private browsing?): ${key.substring(0, 100)}`);
                } else {
                    console.warn(`⚠️ Failed to save ${key.substring(0, 100)} to localStorage:`, error);
                }
            } else {
                console.warn(`⚠️ Failed to save ${key.substring(0, 100)} to localStorage:`, error);
            }
            return false;
        }
    },

    // Sichere remove-Methode
    remove: (key: string): boolean => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return false;
        }
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error: unknown) {
            console.warn(`Failed to remove ${key} from localStorage:`, error);
            return false;
        }
    },

    // Prüfen ob Key existiert
    has: (key: string): boolean => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return false;
        }
        return localStorage.getItem(key) !== null;
    },

    // Alle Keys mit Prefix löschen
    clearPrefix: (prefix: string): void => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return;
        }
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    },

    // Alle localStorage Daten löschen
    clearAll: (): boolean => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return false;
        }
        try {
            localStorage.clear();
            return true;
        } catch (error: unknown) {
            console.warn('Failed to clear localStorage:', error);
            return false;
        }
    },

    // Liste aller Keys auflisten
    listAll: (): string[] => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return [];
        }
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) keys.push(key);
        }
        return keys;
    }
};

/**
 * Migrate and cleanup old localStorage structures
 * Called once on app initialization
 */
export function migrateAndCleanupLocalStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
    }

    console.log('🔄 [MIGRATION] Starting localStorage migration & cleanup...');

    const DEPRECATED_KEYS: string[] = [
        'keymoji_daily_request_count', // Old daily usage key
        'keymoji_stored_date', // Old date tracking
        'keymoji_user_settings_timestamp', // Old timestamp
        'keymoji_usage_history_timestamp' // Old timestamp
    ];

    // 1. Remove deprecated keys
    let removedCount = 0;
    DEPRECATED_KEYS.forEach(key => {
        if (storageHelpers.has(key)) {
            console.log(`🗑️ [MIGRATION] Removing deprecated key: ${key}`);
            storageHelpers.remove(key);
            removedCount++;
        }
    });

    if (removedCount > 0) {
        console.log(`✅ [MIGRATION] Removed ${removedCount} deprecated keys`);
    }

    // 2. Migrate old API key structure (storyMode.apiKey → storyMode.apiKeys)
    const userPrefs = storageHelpers.get<Record<string, unknown>>(STORAGE_KEYS.USER_PREFERENCES);
    if (userPrefs) {
        let needsSave = false;

        // Check if metadata.settings has old apiKey structure
        const metadata: Record<string, unknown> =
            typeof userPrefs.metadata === 'string'
                ? (JSON.parse(userPrefs.metadata) as Record<string, unknown>)
                : (userPrefs.metadata as Record<string, unknown>) || {};
        const settings = (metadata.settings as Record<string, unknown>) || {};

        const storyMode = settings.storyMode as { apiKey?: string; apiKeys?: Record<string, string>; provider?: string } | undefined;
        if (storyMode?.apiKey && !storyMode.apiKeys) {
            console.log(
                '🔄 [MIGRATION] Migrating storyMode.apiKey to apiKeys...'
            );

            const oldKey = storyMode.apiKey;
            const provider = storyMode.provider || 'openai';

            storyMode.apiKeys = {
                openai: provider === 'openai' ? oldKey : '',
                gemini: provider === 'gemini' ? oldKey : '',
                mistral: provider === 'mistral' ? oldKey : '',
                claude: provider === 'claude' ? oldKey : '',
                custom: provider === 'custom' ? oldKey : ''
            };

            delete storyMode.apiKey;
            needsSave = true;

            console.log(
                `✅ [MIGRATION] Moved old apiKey to apiKeys[${provider}]`
            );
        }

        // Save if migrated
        if (needsSave) {
            metadata.settings = settings;
            storageHelpers.set(STORAGE_KEYS.USER_PREFERENCES, {
                ...userPrefs,
                metadata
            });
            console.log(
                '💾 [MIGRATION] Saved migrated settings to localStorage'
            );
        }
    }

    // 3. Clean up old story cache entries (older than 30 days)
    // CRITICAL: Also clean up old-style cache keys with extremely long names (pre-hash migration)
    const allKeys = storageHelpers.listAll();
    const storyCacheKeys = allKeys.filter(key =>
        key.startsWith('story_cache_')
    );
    let expiredCaches = 0;
    let invalidKeys = 0;

    storyCacheKeys.forEach(key => {
        try {
            // CRITICAL: Remove keys that are too long (old format before hash migration)
            // Old format: story_cache_story_<provider>_<model>_<count>_<full text> (can be 200+ chars)
            // New format: story_cache_story_<provider>_<model>_<count>_<hash> (hash is 8 hex chars)
            // New keys are typically < 100 chars, old keys can be 200+ chars
            if (key.length > 200) {
                console.log(`🧹 [MIGRATION] Removing old-style long cache key (${key.length} chars):`, key.substring(0, 100) + '...');
                storageHelpers.remove(key);
                invalidKeys++;
                return;
            }
            
            const cached = storageHelpers.get<{ timestamp?: number }>(key);
            if (cached?.timestamp) {
                const age = Date.now() - cached.timestamp;
                const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

                if (age > maxAge) {
                    storageHelpers.remove(key);
                    expiredCaches++;
                }
            } else if (!cached) {
                // Invalid cache entry (null or corrupted)
                console.log(`🧹 [MIGRATION] Removing invalid cache key:`, key.substring(0, 100));
                storageHelpers.remove(key);
                invalidKeys++;
            }
        } catch (error: unknown) {
            // If we can't read the key, try to remove it
            console.warn(`⚠️ [MIGRATION] Error processing cache key ${key.substring(0, 100)}, removing:`, error);
            try {
                storageHelpers.remove(key);
                invalidKeys++;
            } catch (removeError: unknown) {
                console.error(`❌ [MIGRATION] Failed to remove invalid key:`, removeError);
            }
        }
    });

    if (expiredCaches > 0) {
        console.log(
            `🧹 [MIGRATION] Removed ${expiredCaches} expired cache entries`
        );
    }
    
    if (invalidKeys > 0) {
        console.log(
            `🧹 [MIGRATION] Removed ${invalidKeys} invalid/old-style (long) cache keys`
        );
    }

    // 4. Migrate recent emojis (mask all except first emoji for privacy)
    const recentEmojis = storageHelpers.get<string[]>(STORAGE_KEYS.RECENT_EMOJIS, []);
    if (Array.isArray(recentEmojis) && recentEmojis.length > 0) {
        console.log('🔄 [MIGRATION] Checking recent emojis for masking...');

        // Helper function to mask emojis - Only keep first emoji, mask rest with *******
        const maskEmojis = (emojiString: string): string => {
            if (!emojiString || typeof emojiString !== 'string')
                return emojiString;
            const cleanString = emojiString.replace(/\s/g, '');
            const emojis = cleanString.match(/[\p{Emoji}\u200d]+/gu) || [];
            // If no emojis or only one, return as-is
            if (emojis.length <= 1) return cleanString;
            // Only keep first emoji, mask rest with *******
            const first = emojis[0];
            return `${first}*******`;
        };

        const needsMigration = recentEmojis.some(emoji => {
            if (!emoji || typeof emoji !== 'string') return false;
            const emojis = emoji.match(/[\p{Emoji}\u200d]+/gu) || [];
            // If has more than 1 emoji but no ******* mask, needs masking
            return emojis.length > 1 && !emoji.includes('*******');
        });

        if (needsMigration) {
            console.log('🔒 [MIGRATION] Masking recent emojis for privacy...');
            const masked = recentEmojis.map(maskEmojis).filter(Boolean) as string[];
            storageHelpers.set(STORAGE_KEYS.RECENT_EMOJIS, masked);
            console.log(`✅ [MIGRATION] Masked ${masked.length} recent emojis`);
        }
    }

    console.log('✅ [MIGRATION] Migration & cleanup complete!');

    // 5. Log final localStorage state for debugging
    const finalKeys = storageHelpers.listAll();
    const keymojiKeys = finalKeys.filter(key => key.startsWith('keymoji_'));

    console.log('📊 [MIGRATION] Final localStorage state:', {
        totalKeys: finalKeys.length,
        keymojiKeys: keymojiKeys.length,
        keys: keymojiKeys
    });
}

/**
 * Debug function: Print all localStorage contents
 * Call from console: window.debugLocalStorage()
 */
export function debugLocalStorage(): DebugLocalStorageResult {
    console.log('🔍 [DEBUG] localStorage contents:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const allKeys = storageHelpers.listAll();
    const keymojiKeys = allKeys.filter(
        key => key.startsWith('keymoji_') || key.startsWith('story_cache_')
    );

    keymojiKeys.forEach(key => {
        const value = storageHelpers.get(key);
        const size = JSON.stringify(value).length;

        console.log(`\n📦 ${key}:`, {
            type: typeof value,
            size: `${size} bytes`,
            value: size > 500 ? `[Large object: ${size} bytes]` : value
        });
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total keymoji keys: ${keymojiKeys.length}`);
    console.log(`📊 Total localStorage keys: ${allKeys.length}`);

    // Calculate total size
    const totalSize = keymojiKeys.reduce((acc, key) => {
        return acc + JSON.stringify(storageHelpers.get(key)).length;
    }, 0);

    console.log(`📊 Total size: ${(totalSize / 1024).toFixed(2)} KB`);

    return {
        keymojiKeys,
        totalKeys: allKeys.length,
        totalSize,
        totalSizeKB: (totalSize / 1024).toFixed(2)
    };
}

// Export to window for console access (development only)
if (typeof window !== 'undefined') {
    // Use import.meta.env.MODE (Vite) instead of process.env.NODE_ENV
    const nodeEnv = (typeof import.meta !== 'undefined' && (import.meta.env as { MODE?: string })?.MODE === 'production') 
        ? 'production' 
        : 'development';
    if (nodeEnv === 'development') {
        (window as { debugLocalStorage?: () => DebugLocalStorageResult }).debugLocalStorage = debugLocalStorage;
        (window as { clearLocalStorage?: () => void }).clearLocalStorage = () => {
            const confirmed = confirm(
                '⚠️ Clear ALL localStorage data? This cannot be undone!'
            );
            if (confirmed) {
                storageHelpers.clearAll();
                console.log('✅ localStorage cleared! Reloading page...');
                window.location.reload();
            }
        };
        console.log('🛠️ Debug tools available:');
        console.log('  • window.debugLocalStorage() - Show all keys');
        console.log('  • window.clearLocalStorage() - Clear everything');
    }
}

export default STORAGE_KEYS;

