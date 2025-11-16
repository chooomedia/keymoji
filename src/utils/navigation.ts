/**
 * Navigation Utilities für konsistente Navigation
 * Best Practices für Svelte-Routing mit Language-Support
 *
 * TypeScript Migration: v0.7.7
 */

import { get } from 'svelte/store';
import { navigate } from './routing.ts';
import { currentLanguage } from '../stores/contentStore.ts';

/**
 * Markiert dass der User von der initialen Seite navigiert ist
 * DRY: Wiederverwendbare Funktion für hasNavigatedAway Flag
 */
function markNavigatedAway(): void {
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('hasNavigatedAway', 'true');
        console.log('🔄 User navigated away - hasNavigatedAway set to true');
    }
}

/**
 * Navigiert zu einer Route mit korrekter Sprachunterstützung
 * @param path - Der Pfad ohne Sprachpräfix
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToRoute(path: string, replace: boolean = false): void {
    try {
        markNavigatedAway();

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
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToHome(replace: boolean = false): void {
    try {
        markNavigatedAway();

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
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToContact(replace: boolean = false): void {
    navigateToRoute('contact', replace);
}

/**
 * Navigiert zur Version-History-Seite
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToVersions(replace: boolean = false): void {
    navigateToRoute('versions', replace);
}

/**
 * Navigiert zur Blog-Seite
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 * @deprecated Use blogNavigation.navigateToBlog instead
 */
export function navigateToBlog(replace: boolean = false): void {
    navigateToRoute('blog', replace);
}

/**
 * Navigiert zu einem spezifischen Blog-Post
 * @param slug - Der Blog-Post Slug
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 * @deprecated Use blogNavigation.navigateToBlogPost instead
 */
export function navigateToBlogPost(slug: string, replace: boolean = false): void {
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
 * @returns true wenn Home-Seite
 */
export function isHomePage(): boolean {
    if (typeof window === 'undefined') return false;
    
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment !== '');
    return segments.length === 0 || segments.length === 1;
}

/**
 * Prüft ob die aktuelle Route eine bestimmte Seite ist
 * @param page - Der Seitenname (z.B. 'contact', 'versions')
 * @returns true wenn aktuelle Seite
 */
export function isCurrentPage(page: string): boolean {
    if (typeof window === 'undefined') return false;
    
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

