// src/utils/blogNavigation.js
// Blog Navigation Utilities - Automatisches Language-Handling für Blog-Routen

import { get } from 'svelte/store';
import { currentLanguage } from '../stores/contentStore.js';
import { navigate } from 'svelte-routing';

/**
 * Generiert eine Blog-URL mit automatischem Language-Prefix
 * @param {string} slug - Blog-Post Slug (optional, für einzelne Posts)
 * @returns {string} Vollständige URL mit Language-Prefix
 */
export function getBlogUrl(slug = '') {
    const lang = get(currentLanguage) || 'en';
    if (slug) {
        return `/${lang}/blog/${slug}`;
    }
    return `/${lang}/blog`;
}

/**
 * Generiert eine Home-URL mit automatischem Language-Prefix
 * @returns {string} Vollständige Home-URL mit Language-Prefix
 */
export function getHomeUrl() {
    const lang = get(currentLanguage) || 'en';
    return lang === 'en' ? '/' : `/${lang}`;
}

/**
 * Navigiert zur Blog-Übersicht
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToBlog(replace = false) {
    const url = getBlogUrl();
    navigate(url, { replace });
}

/**
 * Navigiert zu einem Blog-Post
 * @param {string} slug - Blog-Post Slug
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToBlogPost(slug, replace = false) {
    if (!slug) {
        console.warn('⚠️ [blogNavigation] No slug provided, navigating to blog overview');
        navigateToBlog(replace);
        return;
    }
    
    const url = getBlogUrl(slug);
    navigate(url, { replace });
}

/**
 * Generiert eine Share-URL für einen Blog-Post
 * @param {string} slug - Blog-Post Slug
 * @returns {string} Vollständige Share-URL
 */
export function getBlogShareUrl(slug) {
    if (typeof window === 'undefined') {
        return '';
    }
    
    const lang = get(currentLanguage) || 'en';
    return `${window.location.origin}/${lang}/blog/${slug}`;
}

