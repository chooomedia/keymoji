// src/stores/appStores.js
import { writable, derived, get } from 'svelte/store';
// Content wird jetzt über contentStore verwaltet
import {
    supportedLanguages,
    isLanguageSupported,
    getBrowserLanguage,
    getText as getTextUtil
} from '../utils/languages.js';
import { appVersion, formatVersion } from '../utils/version';
import { WEBHOOKS } from '../config/api.js';
import {
    STORAGE_KEYS,
    storageHelpers,
    migrateAndCleanupLocalStorage
} from '../config/storage.js';
import { isDevelopment, devWarn } from '../utils/environment';
import { getDailyLimitForUser, validateUserLimits } from '../config/limits.js';

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

// === LOCAL STORAGE HELPER ===
// Verwende zentrale Storage-Helpers
const localStore = (key, initial) => {
    if (typeof window === 'undefined') return writable(initial);

    const saved = storageHelpers.get(key, initial);
    const { subscribe, set, update } = writable(saved);

    return {
        subscribe,
        set: value => {
            storageHelpers.set(key, value);
            return set(value);
        },
        update: updater => {
            return update(value => {
                const newValue = updater(value);
                storageHelpers.set(key, newValue);
                return newValue;
            });
        }
    };
};

// === USER COUNTER ===
// Cache settings - verwende zentrale Storage-Keys
const COUNTER_CACHE_KEY = STORAGE_KEYS.COUNTER_CACHE;
const COUNTER_TIMESTAMP_KEY = STORAGE_KEYS.COUNTER_TIMESTAMP;
const COUNTER_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Single user counter store
export const userCounter = writable({
    value: 0,
    isLoading: false,
    hasError: false,
    isCached: false
});

// Extract counter logic into a reusable function
export async function refreshUserCounter() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.log('🔄 Starting user counter refresh...');

    // Set loading state
    userCounter.update(state => ({
        ...state,
        isLoading: true,
        hasError: false
    }));

    try {
        // Debug: Log URL before fetch
        const counterUrl = WEBHOOKS.USER_COUNTER;
        console.log('📡 Fetching from:', counterUrl);
        console.log('🔍 [Debug] URL type:', typeof counterUrl, 'Length:', counterUrl?.length);
        
        // Validate URL
        if (!counterUrl || typeof counterUrl !== 'string' || !counterUrl.startsWith('http')) {
            console.error('❌ Invalid USER_COUNTER URL:', counterUrl);
            throw new Error('Invalid USER_COUNTER URL configuration');
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
        console.log(
            '📥 Response headers:',
            Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
            const data = await response.json();
            console.log('📊 Response data:', data);

            const newValue = Number(data.counter);
            console.log('🔢 Parsed counter value:', newValue);

            if (!isNaN(newValue) && newValue > 0) {
                userCounter.update(state => ({
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
                userCounter.update(state => ({
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
            userCounter.update(state => ({
                ...state,
                hasError: true,
                isLoading: false
            }));
        }
    } catch (error) {
        console.error('❌ Counter fetch error:', error);
        userCounter.update(state => ({
            ...state,
            hasError: true,
            isLoading: false
        }));
    } finally {
        console.log('🏁 Counter refresh completed');
    }
}

// Detect if running as webapp
function detectWebappUsage() {
    // Check for webapp indicators
    const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
    ).matches;
    const isFullscreen = window.matchMedia(
        '(display-mode: fullscreen)'
    ).matches;
    const hasWebappManifest =
        document.querySelector('link[rel="manifest"]') !== null;
    const isPWA = 'serviceWorker' in navigator;

    // Check if launched from home screen
    const isFromHomeScreen = window.navigator.standalone === true;

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
function getReferrerValue() {
    // If running as webapp, use 'webapp' as referrer
    if (detectWebappUsage()) {
        return 'webapp';
    }

    // Otherwise use actual referrer or 'direct'
    return document.referrer || 'direct';
}

// Get detailed client information
function getDetailedClientInfo() {
    const isWebapp = detectWebappUsage();

    // Basic client info
    const clientInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        doNotTrack: navigator.doNotTrack,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        deviceMemory: navigator.deviceMemory || 0
    };

    // Screen info
    const screenInfo = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation?.type || 'unknown'
    };

    // Window info
    const windowInfo = {
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
        clientInfo.standalone = window.navigator.standalone || false;
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
export async function sendAnalyticsEvent(eventType, eventData = {}) {
    try {
        console.log('📊 Sending analytics event:', eventType, eventData);

        const detailedClientInfo = getDetailedClientInfo();

        // Debug: Log URL before fetch
        const analyticsUrl = WEBHOOKS.ANALYTICS;
        console.log('📊 [Analytics] Sending to:', analyticsUrl);
        console.log('🔍 [Debug] URL type:', typeof analyticsUrl, 'Length:', analyticsUrl?.length);
        
        // Validate URL
        if (!analyticsUrl || typeof analyticsUrl !== 'string' || !analyticsUrl.startsWith('http')) {
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

// Initialize counter on page load
function initializeUserCounter() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Try to load from cache first
    try {
        const cachedValue = storageHelpers.get(COUNTER_CACHE_KEY);
        const cachedTimestamp = storageHelpers.get(COUNTER_TIMESTAMP_KEY);
        const now = Date.now();
        const cacheAge = now - (cachedTimestamp || 0);
        const cacheValid = cacheAge < COUNTER_CACHE_DURATION;

        if (cachedValue && cacheValid) {
            userCounter.update(state => ({
                ...state,
                value: cachedValue,
                isCached: true,
                hasError: false
            }));
            if (isDevelopment)
                console.log('📦 Loaded counter from cache:', cachedValue);
        } else {
            if (isDevelopment)
                console.log('📦 No valid cache found, will fetch fresh data');
        }
    } catch (error) {
        if (isDevelopment)
            console.warn('⚠️ Failed to load counter from cache:', error);
    }

    // Fetch fresh data on page load
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            console.log('🌐 Page loaded, refreshing counter...');
            refreshUserCounter();
        });
    }
}

// === VERSION STORES ===
export const version = writable(appVersion);
export const formattedVersion = derived(version, $version =>
    formatVersion($version)
);

// === UI STATE STORES ===
export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
export const showLanguageMenu = writable(false);
// Moved to contentStore.js for better organization
export const successfulStoryRequests = writable([]);
export const isDisabled = writable(false);

// === DARK MODE ===
// Initialize dark mode from system preference or localStorage
function initializeDarkMode() {
    const systemPrefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    let storedPreference;
    try {
        const stored = storageHelpers.get(STORAGE_KEYS.DARK_MODE);
        if (stored !== null) {
            storedPreference = stored;
        }
    } catch (e) {
        console.warn('Error reading dark mode preference:', e);
    }

    return storedPreference !== undefined
        ? storedPreference
        : systemPrefersDark;
}

export const darkMode = localStore(
    STORAGE_KEYS.DARK_MODE,
    initializeDarkMode()
);

// Setup dark mode media query listener
if (typeof window !== 'undefined') {
    const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    const handleMediaQueryChange = e => {
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
    } else if (darkModeMediaQuery.addListener) {
        darkModeMediaQuery.addListener(handleMediaQueryChange);
    }
}

// Setup dark mode DOM handler
darkMode.subscribe(isDarkMode => {
    if (typeof document !== 'undefined') {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
});

function getInitialLanguage() {
    if (typeof window === 'undefined') return 'en';

    try {
        const storedLang = storageHelpers.get(STORAGE_KEYS.LANGUAGE);
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

export const currentLanguage = localStore(
    STORAGE_KEYS.LANGUAGE,
    getInitialLanguage()
);

// languageText wird jetzt über contentStore verwaltet

// Wrapper for the getText function
export function getText(key, lang = null) {
    return getTextUtil(key, lang, currentLanguage);
}

// Export supportedLanguages for backward compatibility
export function getSupportedLanguages() {
    return supportedLanguages;
}

// Language change listeners
const languageChangeListeners = new Set();

export function onLanguageChange(listener) {
    languageChangeListeners.add(listener);
    return () => languageChangeListeners.delete(listener);
}

function notifyLanguageChange(lang) {
    languageChangeListeners.forEach(listener => listener(lang));
}

export function setLanguage(lang) {
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
function initializeAccountStores() {
    if (typeof window === 'undefined') {
        return {
            isLoggedIn: false,
            currentAccount: null,
            userProfile: null,
            accountTier: 'free'
        };
    }

    try {
        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);

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
                        email: userPrefs.email,
                        name: userPrefs.name || 'User',
                        userId: userPrefs.userId,
                        tier: userPrefs.tier || 'free',
                        profile: userPrefs.profile || {},
                        metadata: userPrefs.metadata || {},
                        lastLogin: userPrefs.lastLogin,
                        createdAt: userPrefs.createdAt,
                        sessionId: userPrefs.sessionId
                    },
                    userProfile: userPrefs.profile || {},
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
export const isLoggedIn = writable(initialAccountState.isLoggedIn);
export const currentAccount = writable(initialAccountState.currentAccount);
export const userProfile = writable(initialAccountState.userProfile);
export const accountTier = writable(initialAccountState.accountTier);

// Derived guest/pro flags (reactive)
export const isGuestUser = derived(currentAccount, $account => !$account);
export const isProUser = derived(accountTier, $tier => $tier === 'pro');

// IMPORTANT: dailyLimit is managed by dailyUsageStore.js (v0.5.7+)
// This store is updated by initializeDailyUsage() on app start
// Initial values: GUEST: 3, FREE: 9, PRO: 25
export const dailyLimit = writable({
    limit: 5, // Default for guest (GUEST: 5 generations) - updated by initializeDailyUsage
    used: 0
});

// LEGACY: Kept for backward compatibility and fallback
// Primary limit management is now in dailyUsageStore.js
export function updateDailyLimit(isLoggedIn, accountTier, usedCount = 0) {
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
