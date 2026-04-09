/**
 * Validation utilities for user settings
 *
 * TypeScript Migration: v0.7.7
 */

import { supportedLanguages, isLanguageSupported } from './languages';
import type { UserSettings } from '../types/Account';

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Story Mode Settings Interface
 */
export interface StoryModeSettings {
    enabled?: boolean;
    provider?: 'openai' | 'gemini' | 'mistral' | 'claude' | 'apertus' | 'custom';
    apiKeys?: {
        openai?: string;
        gemini?: string;
        mistral?: string;
        claude?: string;
        apertus?: string;
        custom?: string;
    };
    verifiedProviders?: Record<string, {
        verifiedAt?: string;
        model?: string;
        lastTest?: string;
    }>;
    customApiUrl?: string;
    customEndpoint?: string;
    customFormat?: 'openai' | 'claude' | 'raw';
    customModel?: string;
    model?: string;
    cacheResults?: boolean;
    maxTokens?: number;
    temperature?: number;
}

/**
 * User Settings Partial (for validation)
 */
export type PartialUserSettings = Partial<UserSettings> & {
    storyMode?: StoryModeSettings;
    [key: string]: unknown;
};

/**
 * Tier type
 */
export type Tier = 'free' | 'pro';

/**
 * Validate user settings based on tier
 */
export function validateSettings(settings: PartialUserSettings, tier: Tier = 'free'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

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
    const validThemes: readonly string[] = ['auto', 'light', 'dark'] as const;
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
        } else if (tier === 'free' && settings.emojiCount > 9) {
            errors.push(
                'emojiCount limited to 9 for free tier (upgrade to Pro)'
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

    const proOnlySettings: readonly string[] = [
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
    ] as const;

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

    // === Story Mode Settings (FREE & PRO) ===

    if (settings.storyMode) {
        const storyModeValidation = validateStoryModeSettings(
            settings.storyMode
        );
        errors.push(...storyModeValidation.errors);
        warnings.push(...storyModeValidation.warnings);
    }

    // === Auto Generate Setting (FREE & PRO) ===

    if (
        settings.autoGenerate !== undefined &&
        typeof settings.autoGenerate !== 'boolean'
    ) {
        errors.push('autoGenerate must be a boolean');
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
export function sanitizeSettings(settings: PartialUserSettings, tier: Tier = 'free'): PartialUserSettings {
    const sanitized = { ...settings };

    // Remove pro-only settings for free users
    if (tier === 'free') {
        const proOnlySettings: readonly string[] = [
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
        ] as const;

        proOnlySettings.forEach(setting => {
            delete sanitized[setting];
        });

        // Enforce limits for free tier
        if (sanitized.passwordLength && sanitized.passwordLength > 12) {
            sanitized.passwordLength = 12;
        }
        if (sanitized.emojiCount && sanitized.emojiCount > 9) {
            sanitized.emojiCount = 9;
        }
    }

    return sanitized;
}

/**
 * Get default settings based on tier
 */
export function getDefaultSettings(tier: Tier = 'free'): UserSettings {
    const baseSettings: UserSettings = {
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
        emojiCount: 9,
        emojiCategories: ['faces', 'animals', 'food'],
        excludeEmojis: [],

        // Generation
        autoGenerate: false, // Auto-generate on home reload/click (FREE & PRO)
        copyToClipboard: true,
        showStrength: true,

        // Story Mode AI Configuration (FREE & PRO)
        storyMode: {
            enabled: false, // Story mode available when API key configured
            provider: 'apertus', // 'openai' | 'gemini' | 'mistral' | 'claude' | 'apertus' | 'custom' (default: apertus for Swiss LLM)
            apiKeys: {
                // Separate API keys for each provider
                openai: '',
                gemini: '',
                mistral: '',
                claude: '',
                apertus: '',
                custom: ''
            },
            verifiedProviders: {}, // Track verified providers: { provider: { verifiedAt, model, lastTest } }
            customApiUrl: '', // For custom provider (e.g., https://aimi.matt-interfaces.ch)
            customEndpoint: '/v1/chat/completions', // Custom API endpoint path
            customFormat: 'openai', // 'openai' | 'claude' | 'raw'
            customModel: '', // Custom model name
            model: '', // Auto-selected if empty (Best Practice)
            cacheResults: true, // Cache story generations (7 days)
            maxTokens: 150, // Max tokens per request
            temperature: 0 // Creativity level (0.0 - 1.0)
        },

        // Privacy
        saveHistory: false,
        analytics: true,
        shareUsage: false,

        // UI State (which sections are expanded)
        expandedSections: ['basic']
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
            emojiCount: 10, // PRO users get max emojiCount (range: 3-10)
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

            // Enhanced Story Mode (PRO can use premium models)
            storyMode: {
                ...baseSettings.storyMode,
                enabled: false,
                model: '', // Auto-selected based on provider (Best Practice)
                maxTokens: 300, // PRO: more tokens
                cacheResults: true
            },

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
 * Validate Story Mode settings
 */
export function validateStoryModeSettings(storyMode: StoryModeSettings | null | undefined): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!storyMode) return { isValid: true, errors, warnings };

    // Provider validation
    const validProviders: readonly string[] = ['openai', 'gemini', 'mistral', 'claude', 'apertus', 'custom'] as const;
    if (storyMode.provider && !validProviders.includes(storyMode.provider)) {
        errors.push(`provider must be one of: ${validProviders.join(', ')}`);
    }

    // API Key validation (basic format check)
    // NOTE: Apertus doesn't require an API key - it uses VITE_N8N_APERTUS_TOKEN from environment
    if (storyMode.enabled) {
        const currentProvider = storyMode.provider || 'openai';
        
        // Skip API key validation for Apertus (uses environment token)
        if (currentProvider !== 'apertus') {
            const currentApiKey = storyMode.apiKeys?.[currentProvider as keyof StoryModeSettings['apiKeys']];

            if (!currentApiKey) {
                errors.push(
                    `API key is required for ${currentProvider} when story mode is enabled`
                );
            } else if (currentApiKey.length < 10) {
                errors.push(
                    `API key for ${currentProvider} seems too short (minimum 10 characters)`
                );
            }
        }
        // For Apertus: API key is optional (token is loaded from environment)
        // No validation needed - callApertus will handle token loading
    }

    // Custom URL validation
    if (storyMode.provider === 'custom' && !storyMode.customApiUrl) {
        errors.push('Custom API URL is required for custom provider');
    }

    if (storyMode.customApiUrl) {
        try {
            new URL(storyMode.customApiUrl);
        } catch (e) {
            errors.push('Invalid custom API URL format');
        }
    }

    // Model validation per provider
    const validModels: Record<string, readonly string[]> = {
        openai: [
            'gpt-3.5-turbo',
            'gpt-4',
            'gpt-4-turbo',
            'gpt-4o',
            'gpt-4o-mini'
        ] as const,
        gemini: [
            'gemini-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.0-pro'
        ] as const,
        mistral: [
            'mistral-tiny',
            'mistral-small',
            'mistral-medium',
            'mistral-large'
        ] as const,
        claude: [
            'claude-3-haiku-20240307',
            'claude-3-sonnet-20240229',
            'claude-3-opus-20240229',
            'claude-3-5-sonnet-20241022'
        ] as const,
        custom: [] // No validation for custom
    };

    if (
        storyMode.provider !== 'custom' &&
        storyMode.model &&
        !validModels[storyMode.provider]?.includes(storyMode.model)
    ) {
        warnings.push(
            `Model "${storyMode.model}" may not be valid for ${storyMode.provider}`
        );
    }

    // maxTokens validation
    if (storyMode.maxTokens !== undefined) {
        if (typeof storyMode.maxTokens !== 'number') {
            errors.push('maxTokens must be a number');
        } else if (storyMode.maxTokens < 50) {
            errors.push('maxTokens must be at least 50');
        } else if (storyMode.maxTokens > 1000) {
            errors.push('maxTokens must be less than 1000');
        }
    }

    // temperature validation (0.0 - 1.0 range for all AI providers)
    if (storyMode.temperature !== undefined) {
        if (typeof storyMode.temperature !== 'number') {
            errors.push('temperature must be a number');
        } else if (storyMode.temperature < 0 || storyMode.temperature > 1) {
            errors.push('temperature must be between 0.0 and 1.0');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Check if a setting is available for the current tier
 */
export function isSettingAvailableForTier(settingKey: string, tier: Tier = 'free'): boolean {
    const proOnlySettings: readonly string[] = [
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
    ] as const;

    if (tier === 'free' && proOnlySettings.includes(settingKey)) {
        return false;
    }

    return true;
}

/**
 * Merge settings with defaults (ensures all required keys exist)
 */
export function mergeWithDefaults(settings: PartialUserSettings, tier: Tier = 'free'): UserSettings {
    const defaults = getDefaultSettings(tier);
    return {
        ...defaults,
        ...settings
    } as UserSettings;
}

