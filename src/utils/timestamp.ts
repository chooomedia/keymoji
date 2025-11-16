/**
 * Timestamp utilities for the application
 * - Centralized timestamp management
 * - Build-time timestamp generation
 * - Last update tracking
 * TypeScript Migration: v0.7.7
 */

export const updatedTime: string = '2025-11-16T08:14:50.151Z';

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
        console.warn('Failed to format timestamp:', error);
        return timestamp;
    }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param timestamp - ISO timestamp string
 * @returns Relative time string
 */
export function getRelativeTime(timestamp: string): string {
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) {
            return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        }

        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } catch (error) {
        console.warn('Failed to get relative time:', error);
        return timestamp;
    }
}

/**
 * Check if timestamp is recent (within last 24 hours)
 * @param timestamp - ISO timestamp string
 * @returns True if timestamp is within last 24 hours
 */
export function isRecent(timestamp: string): boolean {
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24;
    } catch (error) {
        console.warn('Failed to check if timestamp is recent:', error);
        return false;
    }
}
