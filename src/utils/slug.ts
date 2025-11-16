/*
Slug utilities for generating and sanitizing URL-friendly slugs.
Provides functions for creating safe slugs from text, validating slugs, and normalizing slug formats.
Handles slug generation with fallback options and XSS prevention.
*/

/**
 * Generiert einen URL-freundlichen Slug aus einem String
 * @param text - Text für Slug-Generierung
 * @returns URL-freundlicher Slug
 */
export function generateSlug(text: string | null | undefined): string {
    if (!text || typeof text !== 'string') {
        return '';
    }
    
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100)
        .replace(/-+$/, '');
}

/**
 * Sanitized einen vorhandenen Slug (sichert gegen XSS)
 * @param slug - Zu sanitizierender Slug
 * @returns Sanitizierter Slug
 */
export function sanitizeSlug(slug: string | null | undefined): string {
    if (!slug || typeof slug !== 'string') {
        return '';
    }
    
    return slug
        .toLowerCase()
        .trim()
        .replace(/[^\w-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}

/**
 * Validiert einen Slug
 * @param slug - Zu validierender Slug
 * @returns Ob der Slug gültig ist
 */
export function isValidSlug(slug: string | null | undefined): boolean {
    if (!slug || typeof slug !== 'string') {
        return false;
    }
    const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return slug.length > 0 && slug.length <= 100 && slugRegex.test(slug);
}

/**
 * Normalisiert einen Slug (generiert einen, falls nicht vorhanden)
 * @param text - Text für Slug (z.B. Titel)
 * @param fallback - Fallback-Wert (z.B. id oder row_number)
 * @returns Normalisierter Slug
 */
export function normalizeSlug(text: string | null | undefined, fallback: string | number = ''): string {
    if (!text) {
        return fallback ? String(fallback) : '';
    }
    
    const generated = generateSlug(text);
    if (generated) {
        return generated;
    }
    if (fallback) {
        return sanitizeSlug(String(fallback));
    }
    
    return '';
}

