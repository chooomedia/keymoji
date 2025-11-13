// src/utils/slug.js
// Slug Utilities - Generate and sanitize URL-friendly slugs

/**
 * Generiert einen URL-freundlichen Slug aus einem String
 * @param {string} text - Text für Slug-Generierung
 * @returns {string} URL-freundlicher Slug
 */
export function generateSlug(text) {
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
 * @param {string} slug - Zu sanitizierender Slug
 * @returns {string} Sanitizierter Slug
 */
export function sanitizeSlug(slug) {
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
 * @param {string} slug - Zu validierender Slug
 * @returns {boolean} Ob der Slug gültig ist
 */
export function isValidSlug(slug) {
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
 * @param {string} text - Text für Slug (z.B. Titel)
 * @param {string} fallback - Fallback-Wert (z.B. id oder row_number)
 * @returns {string} Normalisierter Slug
 */
export function normalizeSlug(text, fallback = '') {
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

