/**
 * TypeScript Types Index - Zentrale Export-Datei
 * Alle Types werden hier exportiert für einfachen Import
 */

export * from './Account';
export * from './API';

// Re-export commonly used types
export type {
    Account,
    UserProfile,
    AccountMetadata,
    DailyUsage,
    UsageEntry,
    UserSettings,
    StoryModeSettings
} from './Account';

export type {
    APIResponse,
    AccountAPIResponse,
    MagicLinkRequest,
    MagicLinkResponse,
    MagicLinkVerifyRequest,
    MagicLinkVerifyResponse,
    AccountCheckRequest,
    AccountCheckResponse,
    AccountUpdateRequest,
    BlogPost,
    BlogAPIResponse,
    AnalyticsEvent
} from './API';

