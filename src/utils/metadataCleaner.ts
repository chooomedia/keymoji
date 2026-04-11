/**
 * Metadata Cleaner Utility
 * 
 * Best Practice: Single Source of Truth
 * - Fields with their own columns in Google Sheets should NOT be in metadata
 * - This prevents duplication, inconsistencies, and data loss
 * 
 * Google Sheets Columns:
 * - userId (UserID)
 * - email (Email)
 * - tier (Tier)
 * - createdAt (CreatedAt)
 * - lastLogin (LastLogin)
 * - profile (Profile) - JSON column
 * - dailyUsage (DailyUsage) - JSON column (NEW!)
 * - metadata (Metadata) - JSON column
 * - status (Status)
 * 
 * What SHOULD be in metadata:
 * - settings (UserSettings)
 * - updatedAt, updatedVia, lastActivity, lastSettingsSave (tracking fields)
 * - Other app-specific metadata
 * NOTE: usageHistory wurde entfernt — Chart-Daten werden lokal in DAILY_USAGE_HISTORY geführt
 * 
 * What should NOT be in metadata (have own columns):
 * - createdAt, dailyUsage, profile, tier, email, userId, lastLogin, status
 *
 * TypeScript Migration: v0.7.7
 */

/**
 * List of fields that have their own columns in Google Sheets
 * These should NEVER be in metadata to avoid duplication
 */
const COLUMN_FIELDS: readonly string[] = [
    'userId',
    'email',
    'tier',
    'createdAt',
    'lastLogin',
    'profile',
    'dailyUsage',
    'status',
    // usageHistory wurde aus metadata entfernt — wird lokal in DAILY_USAGE_HISTORY geführt
    'usageHistory',
    // Also check for capitalized versions (from Google Sheets)
    'UserID',
    'Email',
    'Tier',
    'CreatedAt',
    'LastLogin',
    'Profile',
    'DailyUsage',
    'Status'
] as const;

/**
 * Options for cleaning metadata
 */
export interface CleanMetadataOptions {
    strict?: boolean;
    additionalFields?: string[];
}

/**
 * Context information for logging
 */
export interface CleanMetadataContext {
    source?: string;
    [key: string]: unknown;
}

/**
 * Clean metadata object by removing fields that have their own columns
 * 
 * @param metadata - The metadata object to clean
 * @param options - Options for cleaning
 * @returns Cleaned metadata object
 */
export function cleanMetadataForUpdate(
    metadata: Record<string, unknown> | null | undefined,
    options: CleanMetadataOptions = {}
): Record<string, unknown> {
    if (!metadata || typeof metadata !== 'object') {
        return {};
    }

    const { strict = true, additionalFields = [] } = options;
    const fieldsToRemove = [...COLUMN_FIELDS, ...additionalFields];

    // Create a copy to avoid mutating the original
    const cleaned = { ...metadata };

    // Remove top-level duplicates
    fieldsToRemove.forEach(field => {
        if (field in cleaned) {
            delete cleaned[field];
        }
    });

    // Also check nested objects if strict mode is enabled
    if (strict) {
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
                // Recursively clean nested objects (but not too deep to avoid performance issues)
                const nested = cleaned[key] as Record<string, unknown>;
                fieldsToRemove.forEach(field => {
                    if (field in nested) {
                        delete nested[field];
                    }
                });
            }
        });
    }

    return cleaned;
}

/**
 * Clean metadata before sending to API
 * This is the main function to use before any UPDATE/CREATE request
 * 
 * @param metadata - The metadata object to clean
 * @param context - Context information (for logging)
 * @returns Cleaned metadata object
 */
export function prepareMetadataForAPI(
    metadata: Record<string, unknown> | null | undefined,
    context: CleanMetadataContext = {}
): Record<string, unknown> {
    const cleaned = cleanMetadataForUpdate(metadata, { strict: true });

    // Log what was removed (only in development)
    if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
        const removed = Object.keys(metadata || {}).filter(key => 
            COLUMN_FIELDS.includes(key) || COLUMN_FIELDS.includes(key.charAt(0).toUpperCase() + key.slice(1))
        );
        if (removed.length > 0) {
            console.log(`🧹 [METADATA CLEANER] Removed ${removed.length} duplicate field(s) from metadata:`, removed);
            if (context.source) {
                console.log(`   Source: ${context.source}`);
            }
        }
    }

    return cleaned;
}

/**
 * Validate that metadata doesn't contain duplicate fields
 * Throws error in development, warns in production
 * 
 * @param metadata - The metadata object to validate
 * @param source - Source of the metadata (for error messages)
 */
export function validateMetadataNoDuplicates(
    metadata: Record<string, unknown> | null | undefined,
    source: string = 'unknown'
): void {
    if (!metadata || typeof metadata !== 'object') {
        return;
    }

    const duplicates = Object.keys(metadata).filter(key => 
        COLUMN_FIELDS.includes(key) || COLUMN_FIELDS.includes(key.charAt(0).toUpperCase() + key.slice(1))
    );

    if (duplicates.length > 0) {
        const message = `⚠️ [METADATA VALIDATION] Found ${duplicates.length} duplicate field(s) in metadata from ${source}: ${duplicates.join(', ')}`;
        
        if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
            console.error(message);
            console.error('   This should be cleaned before sending to API!');
        } else {
            console.warn(message);
        }
    }
}

