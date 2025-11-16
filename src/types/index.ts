/**
 * TypeScript Types Index - Zentrale Export-Datei
 * Alle Types werden hier exportiert für einfachen Import
 */

export * from './Account';
export * from './API';
export * from './ComponentProps';

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

// Re-export Component Props for easy access
export type {
    BaseUIProps,
    ButtonProps,
    InputProps,
    CheckboxProps,
    ToggleProps,
    TooltipProps,
    ContextBadgeProps,
    FormProps,
    LayoutProps,
    SEOProps,
    RouteProps,
    NavigationProps,
    ChartProps,
    ModalProps,
    PaginationProps,
    SettingsItemProps,
    AccountFormProps,
    BlogPostProps,
    FeatureCardProps,
    ButtonVariant,
    BadgeVariant,
    CheckboxVariant,
    ToggleColor,
    ComponentSize,
    ButtonSize,
    Position
} from './ComponentProps';

