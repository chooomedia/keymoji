// src/utils/navigation.js
/**
 * Navigation Utilities für konsistente Navigation
 * Best Practices für Svelte-Routing mit Language-Support
 */

import { navigate } from 'svelte-routing';
import { get } from 'svelte/store';
import { currentLanguage } from '../stores/contentStore.js';

/**
 * Navigiert zu einer Route mit korrekter Sprachunterstützung
 * @param {string} path - Der Pfad ohne Sprachpräfix
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToRoute(path, replace = false) {
    try {
        // Mark that user has navigated away from initial load
        sessionStorage.setItem('hasNavigatedAway', 'true');
        console.log('🔄 User navigated away - hasNavigatedAway set to true');

        const lang = get(currentLanguage) || 'en';
        const fullPath = path ? `/${lang}/${path}` : `/${lang}`;
        console.log('🔄 Navigation: navigateToRoute', {
            path,
            fullPath,
            replace
        });
        navigate(fullPath, { replace });
    } catch (error) {
        console.error('❌ Navigation error:', error);
        // Fallback zur Home-Seite
        navigate('/', { replace });
    }
}

/**
 * Navigiert zur Home-Seite
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToHome(replace = false) {
    try {
        // Mark that user has navigated away from initial load
        sessionStorage.setItem('hasNavigatedAway', 'true');
        console.log('🔄 User navigated away - hasNavigatedAway set to true');

        const lang = get(currentLanguage) || 'en';
        const fullPath = lang === 'en' ? '/' : `/${lang}`;
        console.log('🔄 Navigation: navigateToHome', { fullPath, replace });
        navigate(fullPath, { replace });
    } catch (error) {
        console.error('❌ Navigation error:', error);
        navigate('/', { replace });
    }
}

/**
 * Navigiert zur Contact-Seite
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToContact(replace = false) {
    navigateToRoute('contact', replace);
}

/**
 * Navigiert zur Version-History-Seite
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToVersions(replace = false) {
    navigateToRoute('versions', replace);
}

/**
 * Navigiert zur Blog-Seite
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 * @deprecated Use blogNavigation.navigateToBlog instead
 */
export function navigateToBlog(replace = false) {
    navigateToRoute('blog', replace);
}

/**
 * Navigiert zu einem spezifischen Blog-Post
 * @param {string} slug - Der Blog-Post Slug
 * @param {boolean} replace - Ob die aktuelle Route ersetzt werden soll
 * @deprecated Use blogNavigation.navigateToBlogPost instead
 */
export function navigateToBlogPost(slug, replace = false) {
    try {
        const lang = get(currentLanguage) || 'en';
        const fullPath = `/${lang}/blog/${slug}`;
        console.log('🔄 Navigation: navigateToBlogPost', {
            slug,
            fullPath,
            replace
        });
        navigate(fullPath, { replace });
    } catch (error) {
        console.error('❌ Navigation error:', error);
        navigateToBlog(replace);
    }
}

/**
 * Prüft ob die aktuelle Route die Home-Seite ist
 * @returns {boolean}
 */
export function isHomePage() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment !== '');
    return segments.length === 0 || segments.length === 1;
}

/**
 * Prüft ob die aktuelle Route eine bestimmte Seite ist
 * @param {string} page - Der Seitenname (z.B. 'contact', 'versions')
 * @returns {boolean}
 */
export function isCurrentPage(page) {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment !== '');

    if (segments.length === 0) {
        return page === 'home';
    }

    if (segments.length === 1) {
        return page === 'home';
    }

    return segments[1] === page;
}
