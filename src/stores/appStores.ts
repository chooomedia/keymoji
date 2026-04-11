// src/stores/appStores.ts
/**
 * Central Application Stores
 *
 * TypeScript Migration: v0.7.7
 */

import {
    writable,
    derived,
    get,
    type Writable,
    type Readable
} from 'svelte/store';
// Content wird jetzt über contentStore verwaltet
import {
    supportedLanguages,
    isLanguageSupported,
    getBrowserLanguage,
    getText as getTextUtil,
    type Language
} from '../utils/languages';
import { appVersion, formatVersion } from '../utils/version';
import { WEBHOOKS } from '../config/api.js';
import {
    STORAGE_KEYS,
    storageHelpers,
    migrateAndCleanupLocalStorage
} from '../config/storage.js';
import { isDevelopment } from '../utils/environment';
import { getDailyLimitForUser } from '../config/limits.js';
import type { Account, UserProfile } from '../types/Account';

// ============================================
// CRITICAL: Run migration IMMEDIATELY on import (synchronous!)
// This ensures all localStorage data is clean BEFORE stores initialize
// ============================================
if (typeof window !== 'undefined') {
    try {
        migrateAndCleanupLocalStorage();
    } catch (error) {
        console.warn('⚠️ [APP INIT] Failed to migrate localStorage:', error);
    }
}

// Type definitions
export interface UserCounterState {
    value: number;
    isLoading: boolean;
    hasError: boolean;
    isCached: boolean;
}

export interface DailyLimitState {
    limit: number;
    used: number;
}

export interface ClientInfo {
    userAgent: string;
    platform: string;
    language: string;
    languages: readonly string[];
    cookieEnabled: boolean;
    onLine: boolean;
    doNotTrack: string | null;
    maxTouchPoints: number;
    hardwareConcurrency: number;
    deviceMemory: number;
    displayMode?: 'standalone' | 'fullscreen' | 'browser';
    standalone?: boolean;
    hasServiceWorker?: boolean;
    hasWebAppManifest?: boolean;
}

export interface ScreenInfo {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelDepth: number;
    orientation: string;
}

export interface WindowInfo {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
    devicePixelRatio: number;
}

export interface DetailedClientInfo extends ClientInfo {
    screen: ScreenInfo;
    window: WindowInfo;
    isWebapp: boolean;
}

export interface CounterResponse {
    counter: number | string;
    [key: string]: unknown;
}

export interface AnalyticsEventData {
    [key: string]: unknown;
}

export interface InitialAccountState {
    isLoggedIn: boolean;
    currentAccount: Account | null;
    userProfile: UserProfile | null;
    accountTier: 'free' | 'pro';
}

type LanguageChangeListener = (lang: string) => void;

// === LOCAL STORAGE HELPER ===
// Verwende zentrale Storage-Helpers
function localStore<T>(key: string, initial: T): Writable<T> {
    if (typeof window === 'undefined') return writable(initial);

    // CRITICAL: storageHelpers.get returns T | null, so we need to handle null case
    const saved = (storageHelpers.get(key, null) ?? initial) as T;
    const { subscribe, set, update } = writable(saved);

    return {
        subscribe,
        set: (value: T) => {
            storageHelpers.set(key, value);
            return set(value);
        },
        update: (updater: (value: T) => T) => {
            return update((value: T) => {
                const newValue = updater(value);
                storageHelpers.set(key, newValue);
                return newValue;
            });
        }
    };
}

// === USER COUNTER ===
// Cache settings - verwende zentrale Storage-Keys
const COUNTER_CACHE_KEY = STORAGE_KEYS.COUNTER_CACHE;
const COUNTER_TIMESTAMP_KEY = STORAGE_KEYS.COUNTER_TIMESTAMP;
const COUNTER_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Single user counter store
export const userCounter: Writable<UserCounterState> = writable({
    value: 0,
    isLoading: false,
    hasError: false,
    isCached: false
});

// Extract counter logic into a reusable function
export async function refreshUserCounter(): Promise<void> {
    console.log('🔄 Starting user counter refresh...');

    // Set loading state
    userCounter.update((state: UserCounterState) => ({
        ...state,
        isLoading: true,
        hasError: false
    }));

    try {
        // Debug: Log URL before fetch
        const counterUrl = WEBHOOKS.USER_COUNTER;
        console.log('📡 Fetching from:', counterUrl);
        console.log(
            '🔍 [Debug] URL type:',
            typeof counterUrl,
            'Length:',
            counterUrl?.length
        );

        // Validate URL
        if (
            !counterUrl ||
            typeof counterUrl !== 'string' ||
            !counterUrl.startsWith('http')
        ) {
            console.error('❌ Invalid USER_COUNTER URL:', counterUrl);
            throw new Error('Invalid USER_COUNTER URL configuration');
        }

        if (typeof window === 'undefined' || typeof document === 'undefined') {
            throw new Error('Window or document not available');
        }

        const response = await fetch(counterUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                type: 'user_counter', // Required by n8n workflow
                path: window.location.pathname,
                client: navigator.userAgent.substring(0, 100),
                version: appVersion,
                timestamp: new Date().toISOString(),
                language: get(currentLanguage) || 'en',
                referrer: document.referrer || 'direct',
                screen: `${window.screen.width}x${window.screen.height}`
            }),
            signal: AbortSignal.timeout(10000) // 10s timeout
        });

        console.log('📥 Response status:', response.status);
        // CRITICAL: Headers.entries() exists but TypeScript types may not include it
        // Use Array.from() for better compatibility
        const headersObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headersObj[key] = value;
        });
        console.log('📥 Response headers:', headersObj);

        if (response.ok) {
            const data: CounterResponse = await response.json();
            console.log('📊 Response data:', data);

            const newValue = Number(data.counter);
            console.log('🔢 Parsed counter value:', newValue);

            if (!isNaN(newValue) && newValue > 0) {
                userCounter.update((state: UserCounterState) => ({
                    ...state,
                    value: newValue,
                    isCached: false,
                    hasError: false,
                    isLoading: false
                }));
                console.log('✅ Counter updated successfully to:', newValue);

                // Save to cache
                try {
                    storageHelpers.set(COUNTER_CACHE_KEY, newValue);
                    storageHelpers.set(COUNTER_TIMESTAMP_KEY, Date.now());
                    console.log('💾 Counter cached successfully');
                } catch (e) {
                    console.warn('⚠️ Failed to cache counter:', e);
                }
            } else {
                console.warn(
                    '⚠️ Invalid counter value received:',
                    data.counter
                );
                userCounter.update((state: UserCounterState) => ({
                    ...state,
                    hasError: true,
                    isLoading: false
                }));
            }
        } else {
            console.error(
                '❌ Counter fetch failed with status:',
                response.status
            );
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            userCounter.update((state: UserCounterState) => ({
                ...state,
                hasError: true,
                isLoading: false
            }));
        }
    } catch (error) {
        console.error('❌ Counter fetch error:', error);
        userCounter.update((state: UserCounterState) => ({
            ...state,
            hasError: true,
            isLoading: false
        }));
    } finally {
        console.log('🏁 Counter refresh completed');
    }
}

// Detect if running as webapp
function detectWebappUsage(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false;
    }

    // Check for webapp indicators
    const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
    ).matches;
    const isFullscreen = window.matchMedia(
        '(display-mode: fullscreen)'
    ).matches;

    // Check if launched from home screen
    const isFromHomeScreen =
        (window.navigator as { standalone?: boolean }).standalone === true;

    // Check for mobile webapp indicators
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    const hasWebappViewport =
        document.querySelector(
            'meta[name="viewport"][content*="user-scalable=no"]'
        ) !== null;

    return (
        isStandalone ||
        isFullscreen ||
        (isMobile && hasWebappViewport) ||
        isFromHomeScreen
    );
}

// Get appropriate referrer value
function getReferrerValue(): string {
    if (typeof document === 'undefined') {
        return 'direct';
    }

    // If running as webapp, use 'webapp' as referrer
    if (detectWebappUsage()) {
        return 'webapp';
    }

    // Otherwise use actual referrer or 'direct'
    return document.referrer || 'direct';
}

// Get detailed client information
function getDetailedClientInfo(): DetailedClientInfo {
    if (
        typeof window === 'undefined' ||
        typeof navigator === 'undefined' ||
        typeof screen === 'undefined'
    ) {
        // Return minimal info for SSR
        return {
            userAgent: '',
            platform: '',
            language: 'en',
            languages: ['en'],
            cookieEnabled: false,
            onLine: false,
            doNotTrack: null,
            maxTouchPoints: 0,
            hardwareConcurrency: 0,
            deviceMemory: 0,
            screen: {
                width: 0,
                height: 0,
                availWidth: 0,
                availHeight: 0,
                colorDepth: 0,
                pixelDepth: 0,
                orientation: 'unknown'
            },
            window: {
                innerWidth: 0,
                innerHeight: 0,
                outerWidth: 0,
                outerHeight: 0,
                devicePixelRatio: 1
            },
            isWebapp: false
        };
    }

    const isWebapp = detectWebappUsage();

    // Basic client info
    const clientInfo: ClientInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        doNotTrack: navigator.doNotTrack,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        deviceMemory: (navigator as { deviceMemory?: number }).deviceMemory || 0
    };

    // Screen info
    const screenInfo: ScreenInfo = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation?.type || 'unknown'
    };

    // Window info
    const windowInfo: WindowInfo = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio || 1
    };

    // Webapp specific info
    if (isWebapp) {
        clientInfo.displayMode = window.matchMedia('(display-mode: standalone)')
            .matches
            ? 'standalone'
            : window.matchMedia('(display-mode: fullscreen)').matches
            ? 'fullscreen'
            : 'browser';
        clientInfo.standalone =
            (window.navigator as { standalone?: boolean }).standalone || false;
        clientInfo.hasServiceWorker = 'serviceWorker' in navigator;
        clientInfo.hasWebAppManifest =
            document.querySelector('link[rel="manifest"]') !== null;
    }

    return {
        ...clientInfo,
        screen: screenInfo,
        window: windowInfo,
        isWebapp: isWebapp
    };
}

// Send analytics event to n8n
export async function sendAnalyticsEvent(
    eventType: string,
    eventData: AnalyticsEventData = {}
): Promise<unknown | null> {
    try {
        console.log('📊 Sending analytics event:', eventType, eventData);

        if (typeof window === 'undefined') {
            return null;
        }

        const detailedClientInfo = getDetailedClientInfo();

        // Debug: Log URL before fetch
        const analyticsUrl = WEBHOOKS.ANALYTICS;
        console.log('📊 [Analytics] Sending to:', analyticsUrl);
        console.log(
            '🔍 [Debug] URL type:',
            typeof analyticsUrl,
            'Length:',
            analyticsUrl?.length
        );

        // Validate URL
        if (
            !analyticsUrl ||
            typeof analyticsUrl !== 'string' ||
            !analyticsUrl.startsWith('http')
        ) {
            console.error('❌ Invalid ANALYTICS URL:', analyticsUrl);
            return null;
        }

        const response = await fetch(analyticsUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                type: eventType,
                path: window.location.pathname,
                client: detailedClientInfo.isWebapp
                    ? 'webapp'
                    : navigator.userAgent.substring(0, 100),
                version: appVersion,
                timestamp: new Date().toISOString(),
                language: get(currentLanguage) || 'en',
                referrer: getReferrerValue(),
                screen: `${window.screen.width}x${window.screen.height}`,
                userAgent: detailedClientInfo.userAgent,
                platform: detailedClientInfo.platform,
                deviceType: detailedClientInfo.isWebapp ? 'webapp' : 'browser',
                data: JSON.stringify({
                    ...eventData,
                    webapp: detailedClientInfo.isWebapp,
                    displayMode: detailedClientInfo.displayMode || 'browser',
                    clientInfo: detailedClientInfo
                })
            }),
            signal: AbortSignal.timeout(10000) // 10s timeout
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Analytics event sent successfully:', data);
            return data;
        } else {
            console.error('❌ Analytics event failed:', response.status);
            return null;
        }
    } catch (error) {
        console.error('❌ Analytics event error:', error);
        return null;
    }
}

// Initialize counter on page load — cache-first, no unnecessary webhook calls
function initializeUserCounter(): void {
    const isDev = isDevelopment();

    try {
        const cachedValue = storageHelpers.get(COUNTER_CACHE_KEY) as number | null;
        const cachedTimestamp = storageHelpers.get(COUNTER_TIMESTAMP_KEY) as number | null;
        const cacheAge = Date.now() - (cachedTimestamp || 0);
        const cacheValid = !!cachedValue && cacheAge < COUNTER_CACHE_DURATION;

        if (cacheValid) {
            // Cache still valid: show cached value, no network request
            userCounter.update((state: UserCounterState) => ({
                ...state,
                value: cachedValue as number,
                isCached: true,
                isLoading: false,
                hasError: false
            }));
            if (isDev) console.log('📦 Counter loaded from cache, no webhook request:', cachedValue);
            return; // Skip webhook entirely
        }

        // Cache expired or missing: fetch once, do NOT fire on every reload
        if (isDev) console.log('📦 Counter cache expired, scheduling background fetch');
    } catch (error) {
        if (isDev) console.warn('⚠️ Failed to load counter from cache:', error);
    }

    // Only fire the webhook when there is no valid cache
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            if (isDevelopment()) console.log('🌐 Counter cache miss — fetching from webhook');
            refreshUserCounter();
        }, { once: true });
    }
}

// === VERSION STORES ===
export const version: Writable<string> = writable(appVersion);
export const formattedVersion: Readable<string> = derived(
    version,
    () => formatVersion(true) // Always include 'v' prefix
);

// === UI STATE STORES ===
export const showDonateMenu: Writable<boolean> = writable(false);
export const showShareMenu: Writable<boolean> = writable(false);
export const showLanguageMenu: Writable<boolean> = writable(false);
// Moved to contentStore.js for better organization
export const successfulStoryRequests: Writable<unknown[]> = writable([]);
export const isDisabled: Writable<boolean> = writable(false);

// === DARK MODE ===
// Initialize dark mode from system preference or localStorage
function initializeDarkMode(): boolean {
    const systemPrefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    let storedPreference: boolean | null = null;
    try {
        const stored = storageHelpers.get(STORAGE_KEYS.DARK_MODE) as
            | boolean
            | null;
        if (stored !== null) {
            storedPreference = stored;
        }
    } catch (e) {
        console.warn('Error reading dark mode preference:', e);
    }

    return storedPreference !== null ? storedPreference : systemPrefersDark;
}

export const darkMode: Writable<boolean> = localStore(
    STORAGE_KEYS.DARK_MODE,
    initializeDarkMode()
);

// Setup dark mode media query listener
if (typeof window !== 'undefined') {
    const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
        try {
            if (storageHelpers.get(STORAGE_KEYS.DARK_MODE) === null) {
                darkMode.set(e.matches);
            }
        } catch (err) {
            console.warn('Error in media query handler:', err);
        }
    };

    if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleMediaQueryChange);
    } else {
        // Fallback for older browsers (Safari < 14)
        const legacyMediaQuery = darkModeMediaQuery as unknown as {
            addListener?: (callback: (e: MediaQueryListEvent) => void) => void;
        };
        if (legacyMediaQuery.addListener) {
            legacyMediaQuery.addListener(handleMediaQueryChange);
        }
    }
}

// Setup dark mode DOM handler
darkMode.subscribe((isDarkMode: boolean) => {
    if (typeof document !== 'undefined') {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Sync browser chrome color with dark/light mode toggle
        const themeColorLight = '#f5f0e8';
        const themeColorDark = '#0a141f';
        const targetColor = isDarkMode ? themeColorDark : themeColorLight;
        document
            .querySelectorAll('meta[name="theme-color"]')
            .forEach((el) => el.setAttribute('content', targetColor));
    }
});

function getInitialLanguage(): string {
    if (typeof window === 'undefined') return 'en';

    try {
        const storedLang = storageHelpers.get(STORAGE_KEYS.LANGUAGE) as
            | string
            | null;
        if (storedLang && isLanguageSupported(storedLang)) {
            return storedLang;
        }
    } catch (e) {
        console.warn('Error reading language from localStorage:', e);
    }

    if (typeof window !== 'undefined') {
        const pathLang = window.location.pathname.split('/')[1];
        if (pathLang && isLanguageSupported(pathLang)) {
            return pathLang;
        }
    }

    return getBrowserLanguage();
}

export const currentLanguage: Writable<string> = localStore(
    STORAGE_KEYS.LANGUAGE,
    getInitialLanguage()
);

// languageText wird jetzt über contentStore verwaltet

// Wrapper for the getText function
export function getText(key: string, lang: string | null = null): string {
    return getTextUtil(key, lang, currentLanguage);
}

// Export supportedLanguages for backward compatibility
export function getSupportedLanguages(): readonly Language[] {
    return supportedLanguages;
}

// Language change listeners
const languageChangeListeners = new Set<LanguageChangeListener>();

export function onLanguageChange(listener: LanguageChangeListener): () => void {
    languageChangeListeners.add(listener);
    return () => languageChangeListeners.delete(listener);
}

function notifyLanguageChange(lang: string): void {
    languageChangeListeners.forEach(listener => listener(lang));
}

export function setLanguage(lang: string): void {
    if (isLanguageSupported(lang)) {
        currentLanguage.set(lang);

        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;

            if (lang === 'sjn') {
                document.body.classList.add('font-elvish');
            } else {
                document.body.classList.remove('font-elvish');
            }
        }

        notifyLanguageChange(lang);
    } else {
        console.error(`Language '${lang}' is not supported.`);
    }
}

// === ACCOUNT STORES ===
// =======================================
// ACCOUNT STORES - PERSISTENT & SYNCHRONIZED
// =======================================
// CRITICAL: These stores MUST be initialized from localStorage IMMEDIATELY
// to prevent login-status "flicker" on route changes
// Single source of truth: localStorage.USER_PREFERENCES

// Initialize account stores from localStorage (synchronous!)
function initializeAccountStores(): InitialAccountState {
    if (typeof window === 'undefined') {
        return {
            isLoggedIn: false,
            currentAccount: null,
            userProfile: null,
            accountTier: 'free'
        };
    }

    try {
        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES) as {
            email?: string;
            sessionExpires?: string;
            name?: string;
            userId?: string;
            tier?: 'free' | 'pro';
            profile?: UserProfile;
            metadata?: Record<string, unknown>;
            lastLogin?: string;
            createdAt?: string;
            sessionId?: string;
        } | null;

        if (userPrefs && userPrefs.email && userPrefs.sessionExpires) {
            // Check if session is still valid
            const now = new Date();
            const expires = new Date(userPrefs.sessionExpires);
            const isSessionValid = now < expires;

            if (isSessionValid) {
                console.log(
                    '✅ [STORE INIT] Restoring logged-in state from localStorage:',
                    {
                        email: userPrefs.email,
                        hasProfile: !!userPrefs.profile,
                        tier: userPrefs.tier || 'free'
                    }
                );

                return {
                    isLoggedIn: true,
                    currentAccount: {
                        userId: userPrefs.userId || '',
                        email: userPrefs.email,
                        tier: userPrefs.tier || 'free',
                        profile: userPrefs.profile || {
                            name: userPrefs.name || 'User'
                        },
                        metadata: userPrefs.metadata || {},
                        lastLogin:
                            userPrefs.lastLogin || new Date().toISOString(),
                        createdAt:
                            userPrefs.createdAt || new Date().toISOString(),
                        sessionId: userPrefs.sessionId
                    },
                    userProfile: userPrefs.profile || {
                        name: userPrefs.name || 'User'
                    },
                    accountTier: userPrefs.tier || 'free'
                };
            } else {
                console.log('⚠️ [STORE INIT] Session expired, clearing...');
                // Session expired, clear it
                localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
            }
        }
    } catch (error) {
        console.warn(
            '⚠️ [STORE INIT] Failed to load account from localStorage:',
            error
        );
    }

    console.log('🔓 [STORE INIT] No valid session, starting as guest');
    return {
        isLoggedIn: false,
        currentAccount: null,
        userProfile: null,
        accountTier: 'free'
    };
}

// Initialize immediately (synchronous!)
const initialAccountState = initializeAccountStores();

// Create persistent account stores
export const isLoggedIn: Writable<boolean> = writable(
    initialAccountState.isLoggedIn
);
export const currentAccount: Writable<Account | null> = writable(
    initialAccountState.currentAccount
);
export const userProfile: Writable<UserProfile | null> = writable(
    initialAccountState.userProfile
);
export const accountTier: Writable<'free' | 'pro'> = writable(
    initialAccountState.accountTier
);

// Derived guest/pro flags (reactive)
export const isGuestUser: Readable<boolean> = derived(
    currentAccount,
    ($account: Account | null) => !$account
);
export const isProUser: Readable<boolean> = derived(
    accountTier,
    ($tier: 'free' | 'pro') => $tier === 'pro'
);

// IMPORTANT: dailyLimit is managed by dailyUsageStore.js (v0.5.7+)
// This store is updated by initializeDailyUsage() on app start
// Initial values: GUEST: 3, FREE: 9, PRO: 25
export const dailyLimit: Writable<DailyLimitState> = writable({
    limit: 5, // Default for guest (GUEST: 5 generations) - updated by initializeDailyUsage
    used: 0
});

// LEGACY: Kept for backward compatibility and fallback
// Primary limit management is now in dailyUsageStore.js
export function updateDailyLimit(
    isLoggedIn: boolean,
    accountTier: 'free' | 'pro',
    usedCount: number = 0
): DailyLimitState {
    const limit = getDailyLimitForUser(isLoggedIn, accountTier);
    dailyLimit.set({ limit, used: usedCount });
    console.log(
        `📊 updateDailyLimit (legacy): ${
            isLoggedIn ? accountTier.toUpperCase() : 'GUEST'
        } → limit: ${limit}, used: ${usedCount}`
    );
    return { limit, used: usedCount };
}

// Initialize stores
if (typeof window !== 'undefined') {
    initializeUserCounter();
}

// ============================================
// SESSION GENERATION COUNTER
// Counts emoji generations per page load — resets on every refresh.
// Uses a page-load ID (set once via performance.now / Date.now) to
// distinguish a fresh page load from a still-open tab.
// ============================================

const SESSION_GEN_KEY = 'keymoji_session_generations';
const SESSION_PAGE_ID_KEY = 'keymoji_session_page_id';

function getOrCreatePageId(): string {
    // Each page load generates a unique ID stored in memory only.
    // We store it in sessionStorage to detect reloads:
    // if the stored page ID doesn't match the one we just created → it's a reload.
    return String(Date.now()) + '_' + Math.floor(Math.random() * 1e9);
}

function readSessionCount(): number {
    if (typeof window === 'undefined') return 0;
    try {
        // Generate a fresh page-load ID every time this module initialises.
        // On first load the stored ID is absent → write it and start at 0.
        // On reload the stored ID is present but different → reset to 0.
        const freshPageId = getOrCreatePageId();
        const storedPageId = sessionStorage.getItem(SESSION_PAGE_ID_KEY);

        if (!storedPageId || storedPageId !== freshPageId) {
            // New page load or reload: reset counter
            sessionStorage.setItem(SESSION_PAGE_ID_KEY, freshPageId);
            sessionStorage.setItem(SESSION_GEN_KEY, '0');
            return 0;
        }
        return parseInt(sessionStorage.getItem(SESSION_GEN_KEY) || '0', 10) || 0;
    } catch {
        return 0;
    }
}

// Initialise once per module load (i.e. once per page load/reload)
const _initialCount = readSessionCount();

export const sessionGenerationCount: Writable<number> = writable(_initialCount);

export function incrementSessionCount(): void {
    sessionGenerationCount.update(n => {
        const next = n + 1;
        try { sessionStorage.setItem(SESSION_GEN_KEY, String(next)); } catch { /* quota */ }
        return next;
    });
}
