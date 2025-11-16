/**
 * Slug Utilities - Generate and sanitize URL-friendly slugs
 *
 * TypeScript Migration: v0.7.7
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
        // Entferne Sonderzeichen, behalte nur Buchstaben, Zahlen, Bindestriche
        .replace(/[^\w\s-]/g, '')
        // Ersetze Leerzeichen und Unterstriche mit Bindestrichen
        .replace(/[\s_]+/g, '-')
        // Entferne mehrfache Bindestriche
        .replace(/-+/g, '-')
        // Entferne führende und abschließende Bindestriche
        .replace(/^-+|-+$/g, '')
        // Max. 100 Zeichen
        .substring(0, 100)
        .replace(/-+$/, ''); // Entferne abschließende Bindestriche nach Kürzung
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
    
    // Entferne alle nicht-URL-freundlichen Zeichen
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
    
    // Slug sollte nur Kleinbuchstaben, Zahlen und Bindestriche enthalten
    // Mindestens 1 Zeichen, max. 100 Zeichen
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
    
    // Fallback: Verwende Fallback-Wert als Slug
    if (fallback) {
        return sanitizeSlug(String(fallback));
    }
    
    return '';
}

