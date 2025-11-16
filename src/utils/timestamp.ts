/**
 * Timestamp utilities for the application
 * - Centralized timestamp management
 * - Build-time timestamp generation
 * - Last update tracking
 *
 * TypeScript Migration: v0.7.7
 */

export const updatedTime: string = '2025-11-16T04:06:29.828Z';

/**
 * Get the current timestamp in ISO format
 * @returns Current timestamp
 */
export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Format timestamp for display
 * @param timestamp - ISO timestamp string
 * @param locale - Locale for formatting (default: 'en')
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: string, locale: string = 'en'): string {
    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.warn('Invalid timestamp format:', timestamp);
        return timestamp;
    }
}

/**
 * Check if a timestamp is recent (within last 24 hours)
 * @param timestamp - ISO timestamp string
 * @returns True if timestamp is recent
 */
export function isRecentTimestamp(timestamp: string): boolean {
    try {
        const timestampDate = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - timestampDate.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24;
    } catch (error) {
        return false;
    }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param timestamp - ISO timestamp string
 * @returns Relative time string
 */
export function getRelativeTime(timestamp: string): string {
    try {
        const timestampDate = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - timestampDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    } catch (error) {
        return 'unknown time';
    }
}

