// src/utils/settingsValidation.js
// Validation utilities for user settings

import { supportedLanguages, isLanguageSupported } from './languages.js';

/**
 * Validate user settings based on tier
 */
export function validateSettings(settings, tier = 'free') {
    const errors = [];
    const warnings = [];

    // === Basic Validation ===

    // Name
    if (settings.name !== undefined) {
        if (typeof settings.name !== 'string') {
            errors.push('name must be a string');
        } else if (settings.name.length > 100) {
            errors.push('name must be less than 100 characters');
        }
    }

    // Language
    if (settings.language) {
        if (!isLanguageSupported(settings.language)) {
            const supportedCodes = supportedLanguages.map(lang => lang.code);
            errors.push(
                `language must be one of: ${supportedCodes.join(', ')}`
            );
        }
    } else {
        warnings.push('language not set, defaulting to "en"');
    }

    // Theme
    const validThemes = ['auto', 'light', 'dark'];
    if (settings.theme) {
        if (!validThemes.includes(settings.theme)) {
            errors.push(`theme must be one of: ${validThemes.join(', ')}`);
        }
    } else {
        warnings.push('theme not set, defaulting to "auto"');
    }

    // Notifications
    if (
        settings.notifications !== undefined &&
        typeof settings.notifications !== 'boolean'
    ) {
        errors.push('notifications must be a boolean');
    }

    // === Password Settings ===

    if (settings.passwordLength !== undefined) {
        if (typeof settings.passwordLength !== 'number') {
            errors.push('passwordLength must be a number');
        } else if (settings.passwordLength < 6) {
            errors.push('passwordLength must be at least 6');
        } else if (settings.passwordLength > 50) {
            errors.push('passwordLength must be less than 50');
        } else if (tier === 'free' && settings.passwordLength > 12) {
            errors.push(
                'passwordLength limited to 12 for free tier (upgrade to Pro)'
            );
        }
    }

    // === Emoji Settings ===

    if (settings.emojiCount !== undefined) {
        if (typeof settings.emojiCount !== 'number') {
            errors.push('emojiCount must be a number');
        } else if (settings.emojiCount < 3) {
            errors.push('emojiCount must be at least 3');
        } else if (settings.emojiCount > 20) {
            errors.push('emojiCount must be less than 20');
        } else if (tier === 'free' && settings.emojiCount > 5) {
            errors.push(
                'emojiCount limited to 5 for free tier (upgrade to Pro)'
            );
        }
    }

    if (settings.emojiCategories !== undefined) {
        if (!Array.isArray(settings.emojiCategories)) {
            errors.push('emojiCategories must be an array');
        } else if (settings.emojiCategories.length === 0) {
            errors.push('emojiCategories must not be empty');
        }
    }

    // === Pro-Only Features ===

    const proOnlySettings = [
        'includeSpecialChars',
        'excludeSimilarChars',
        'requireUniqueChars',
        'emojiPattern',
        'emojiTheme',
        'strengthThreshold',
        'autoRefresh',
        'refreshInterval',
        'exportHistory',
        'backupSettings',
        'customPatterns',
        'favoriteEmojis',
        'passwordHistory',
        'strengthAnalytics',
        'securityAudit',
        'breachCheck',
        'compactMode',
        'showAdvancedOptions',
        'customThemes',
        'keyboardShortcuts',
        'accessibilityMode'
    ];

    if (tier === 'free') {
        proOnlySettings.forEach(setting => {
            if (settings[setting] !== undefined) {
                warnings.push(`${setting} is a Pro feature (upgrade to Pro)`);
            }
        });
    }

    // === Refresh Interval (Pro only) ===

    if (settings.refreshInterval !== undefined) {
        if (typeof settings.refreshInterval !== 'number') {
            errors.push('refreshInterval must be a number');
        } else if (settings.refreshInterval < 5) {
            errors.push('refreshInterval must be at least 5 seconds');
        } else if (settings.refreshInterval > 300) {
            errors.push('refreshInterval must be less than 300 seconds');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Sanitize settings (remove invalid/pro settings for free users)
 */
export function sanitizeSettings(settings, tier = 'free') {
    const sanitized = { ...settings };

    // Remove pro-only settings for free users
    if (tier === 'free') {
        const proOnlySettings = [
            'includeSpecialChars',
            'excludeSimilarChars',
            'requireUniqueChars',
            'emojiPattern',
            'emojiTheme',
            'strengthThreshold',
            'autoRefresh',
            'refreshInterval',
            'exportHistory',
            'backupSettings',
            'customPatterns',
            'favoriteEmojis',
            'passwordHistory',
            'strengthAnalytics',
            'securityAudit',
            'breachCheck',
            'compactMode',
            'showAdvancedOptions',
            'customThemes',
            'keyboardShortcuts',
            'accessibilityMode'
        ];

        proOnlySettings.forEach(setting => {
            delete sanitized[setting];
        });

        // Enforce limits for free tier
        if (sanitized.passwordLength && sanitized.passwordLength > 12) {
            sanitized.passwordLength = 12;
        }
        if (sanitized.emojiCount && sanitized.emojiCount > 5) {
            sanitized.emojiCount = 5;
        }
    }

    return sanitized;
}

/**
 * Get default settings based on tier
 */
export function getDefaultSettings(tier = 'free') {
    const baseSettings = {
        name: '',
        language: 'en',
        theme: 'auto',
        notifications: true,

        // Password
        passwordLength: 8,
        includeNumbers: true,
        includeSymbols: true,
        includeUppercase: true,
        includeLowercase: true,

        // Emoji
        emojiCount: 5,
        emojiCategories: ['faces', 'animals', 'food'],
        excludeEmojis: [],

        // Generation
        autoGenerate: false,
        copyToClipboard: true,
        showStrength: true,

        // Privacy
        saveHistory: false,
        analytics: true,
        shareUsage: false
    };

    if (tier === 'pro') {
        return {
            ...baseSettings,

            // Enhanced Password
            passwordLength: 12,
            includeSpecialChars: true,
            excludeSimilarChars: true,
            requireUniqueChars: true,

            // Enhanced Emoji
            emojiCount: 8,
            emojiCategories: [
                'faces',
                'animals',
                'food',
                'objects',
                'symbols',
                'flags'
            ],
            emojiPattern: 'random',
            emojiTheme: 'mixed',

            // Enhanced Generation
            autoGenerate: true,
            strengthThreshold: 'medium',
            autoRefresh: false,
            refreshInterval: 30,

            // Enhanced Privacy
            saveHistory: true,
            exportHistory: true,
            backupSettings: true,

            // Pro Features
            customPatterns: [],
            favoriteEmojis: [],
            passwordHistory: [],
            strengthAnalytics: true,
            securityAudit: true,
            breachCheck: true,

            // Advanced UI
            compactMode: false,
            showAdvancedOptions: true,
            customThemes: [],
            keyboardShortcuts: true,
            accessibilityMode: false
        };
    }

    return baseSettings;
}

/**
 * Check if a setting is available for the current tier
 */
export function isSettingAvailableForTier(settingKey, tier = 'free') {
    const proOnlySettings = [
        'includeSpecialChars',
        'excludeSimilarChars',
        'requireUniqueChars',
        'emojiPattern',
        'emojiTheme',
        'strengthThreshold',
        'autoRefresh',
        'refreshInterval',
        'exportHistory',
        'backupSettings',
        'customPatterns',
        'favoriteEmojis',
        'passwordHistory',
        'strengthAnalytics',
        'securityAudit',
        'breachCheck',
        'compactMode',
        'showAdvancedOptions',
        'customThemes',
        'keyboardShortcuts',
        'accessibilityMode'
    ];

    if (tier === 'free' && proOnlySettings.includes(settingKey)) {
        return false;
    }

    return true;
}

/**
 * Merge settings with defaults (ensures all required keys exist)
 */
export function mergeWithDefaults(settings, tier = 'free') {
    const defaults = getDefaultSettings(tier);
    return {
        ...defaults,
        ...settings
    };
}
