/**
 * Account Types - TypeScript Schemas für Account Management
 * Single Source of Truth für Account-Datenstrukturen
 */

export interface UserProfile {
    name: string;
    avatar?: string;
    [key: string]: unknown;
}

export interface DailyUsage {
    date: string; // ISO Date String (YYYY-MM-DD)
    used: number;
    limit: number;
}

export interface UsageEntry {
    timestamp: string; // ISO Date String
    type: 'generation' | 'story' | 'other';
    count?: number;
    [key: string]: unknown;
}

export interface AccountMetadata {
    settings?: UserSettings;
    usageHistory?: UsageEntry[];
    updatedAt?: string;
    updatedVia?: string;
    lastSettingsSave?: string;
    [key: string]: unknown;
}

export interface Account {
    userId: string;
    email: string;
    tier: 'free' | 'pro';
    profile: UserProfile;
    metadata: AccountMetadata;
    dailyUsage?: DailyUsage;
    createdAt: string;
    lastLogin: string;
    sessionId?: string;
    sessionExpires?: string;
}

export interface AccountCreateData {
    userId: string;
    email: string;
    name?: string;
    tier?: 'free' | 'pro';
    profile?: Partial<UserProfile>;
    metadata?: Partial<AccountMetadata>;
}

export interface AccountUpdateData {
    userId: string;
    email?: string;
    profile?: Partial<UserProfile>;
    metadata?: Partial<AccountMetadata>;
    dailyUsage?: DailyUsage;
    lastLogin?: string;
}

// UserSettings Types (wird in Settings.ts definiert, hier importiert)
export interface UserSettings {
    name?: string;
    email?: string;
    language?: string;
    theme?: 'light' | 'dark' | 'auto';
    fontSize?: 'small' | 'medium' | 'large';
    animations?: boolean;
    soundEffects?: boolean;
    expandedSections?: string[];
    storyMode?: StoryModeSettings;
    [key: string]: unknown;
}

export interface StoryModeSettings {
    enabled: boolean;
    provider?: 'openai' | 'gemini' | 'mistral' | 'claude' | 'custom' | 'apertus';
    apiKeys?: {
        openai?: string;
        gemini?: string;
        mistral?: string;
        claude?: string;
        custom?: string;
        apertus?: string;
    };
    customFormat?: string;
    [key: string]: unknown;
}

// Usage History Types - Single Source of Truth
export interface UsageHistoryEntry {
    date: string;
    used: number;
    storyUsed?: number;
    limit?: number;
    timestamp?: string;
    [key: string]: unknown;
}

// Daily Limit State - Single Source of Truth
export interface DailyLimitState {
    limit: number;
    used: number;
    storyUsed?: number;
}

