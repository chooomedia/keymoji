/*
Blog navigation utilities for language-aware blog routing.
Provides functions for generating blog URLs with automatic language prefix.
Handles navigation to blog overview and individual blog posts.
*/
import { get } from 'svelte/store';
import { currentLanguage } from '../stores/contentStore';
import { navigate } from './routing';
import { isDebugMode } from './environment';

function debugBlogNavigation(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 BlogNavigation Debug: ${context}`);
    if (data) console.log(data);
    console.groupEnd();
}

/**
 * Generiert eine Blog-URL mit automatischem Language-Prefix
 * @param slug - Blog-Post Slug (optional, für einzelne Posts)
 * @returns Vollständige URL mit Language-Prefix
 */
export function getBlogUrl(slug: string = ''): string {
    const lang = get(currentLanguage) || 'en';
    if (slug) {
        return `/${lang}/blog/${slug}`;
    }
    return `/${lang}/blog`;
}

/**
 * Generiert eine Home-URL mit automatischem Language-Prefix
 * @returns Vollständige Home-URL mit Language-Prefix
 */
export function getHomeUrl(): string {
    const lang = get(currentLanguage) || 'en';
    return lang === 'en' ? '/' : `/${lang}`;
}

/**
 * Navigiert zur Blog-Übersicht
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToBlog(replace: boolean = false): void {
    const url = getBlogUrl();
    navigate(url, { replace });
}

/**
 * Navigiert zu einem Blog-Post
 * @param slug - Blog-Post Slug
 * @param replace - Ob die aktuelle Route ersetzt werden soll
 */
export function navigateToBlogPost(slug: string, replace: boolean = false): void {
    if (!slug) {
        debugBlogNavigation('No slug provided, navigating to blog overview');
        navigateToBlog(replace);
        return;
    }
    
    const url = getBlogUrl(slug);
    navigate(url, { replace });
}

/**
 * Generiert eine Share-URL für einen Blog-Post
 * @param slug - Blog-Post Slug
 * @returns Vollständige Share-URL
 */
export function getBlogShareUrl(slug: string): string {
    if (typeof window === 'undefined') {
        return '';
    }
    
    const lang = get(currentLanguage) || 'en';
    return `${window.location.origin}/${lang}/blog/${slug}`;
}

