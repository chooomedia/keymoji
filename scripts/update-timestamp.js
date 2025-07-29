// scripts/update-timestamp.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/timestamp.js');
const timestamp = new Date().toISOString();

// Read existing content to preserve utility functions
let existingContent = '';
try {
    existingContent = fs.readFileSync(filePath, 'utf8');
} catch (error) {
    console.log('Creating new timestamp.js file');
}

// Update only the updatedTime constant, preserve other functions
const updatedContent = existingContent.replace(
    /export const updatedTime = '[^']*';/,
    `export const updatedTime = '${timestamp}';`
);

// If no existing content or no match, create new content
const content = existingContent
    ? updatedContent
    : `/**
 * Timestamp utilities for the application
 * - Centralized timestamp management
 * - Build-time timestamp generation
 * - Last update tracking
 */

export const updatedTime = '${timestamp}';

/**
 * Get the current timestamp in ISO format
 * @returns {string} Current timestamp
 */
export function getCurrentTimestamp() {
    return new Date().toISOString();
}

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp string
 * @param {string} locale - Locale for formatting (default: 'en')
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp, locale = 'en') {
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
 * @param {string} timestamp - ISO timestamp string
 * @returns {boolean} True if timestamp is recent
 */
export function isRecentTimestamp(timestamp) {
    try {
        const timestampDate = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - timestampDate) / (1000 * 60 * 60);
        return diffInHours < 24;
    } catch (error) {
        return false;
    }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time string
 */
export function getRelativeTime(timestamp) {
    try {
        const timestampDate = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - timestampDate) / 1000);
        
        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return \`\${minutes} minute\${minutes > 1 ? 's' : ''} ago\`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return \`\${hours} hour\${hours > 1 ? 's' : ''} ago\`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return \`\${days} day\${days > 1 ? 's' : ''} ago\`;
        }
    } catch (error) {
        return 'unknown time';
    }
}
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log(`timestamp.js updated with timestamp: ${timestamp}`);
