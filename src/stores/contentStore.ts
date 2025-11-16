// src/stores/contentStore.ts
// Zentrale Verwaltung für Content und Übersetzungen
// TypeScript Migration: v0.7.7
// Klassische Svelte Stores verwenden (Runes funktionieren nur in .svelte Komponenten)

import {
    writable,
    derived,
    get,
    type Writable,
    type Readable
} from 'svelte/store';
import { STORAGE_KEYS, storageHelpers } from '../config/storage';
import { formatVersion } from '../utils/version';
import { devLog, devWarn } from '../utils/environment';

export interface ContentSection {
    [key: string]: unknown;
}

export interface LanguageContent {
    _meta: {
        language: string;
        version?: string;
        [key: string]: unknown;
    };
    header?: ContentSection;
    index?: ContentSection;
    emojiDisplay?: ContentSection;
    contactForm?: ContentSection;
    donateButton?: ContentSection;
    notFound?: ContentSection;
    versions?: ContentSection;
    accountManager?: ContentSection;
    [key: string]: unknown;
}

export interface ContentStatus {
    currentLanguage: string;
    loadedLanguages: string[];
    isLoading: boolean;
    error: string | null;
    hasContent: boolean;
}

export type LanguageChangeListener = (lang: string) => void;

// Klassische Svelte Stores für reaktive State-Verwaltung
function getInitialLanguage(): string {
    if (typeof window === 'undefined') {
        return 'en';
    }
    return storageHelpers.get<string>(STORAGE_KEYS.LANGUAGE, 'en') ?? 'en';
}

function getInitialDarkMode(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return (storageHelpers.get<boolean>(STORAGE_KEYS.DARK_MODE, false) ??
        false) as boolean;
}

export const currentLanguage: Writable<string> = writable<string>(
    getInitialLanguage()
);
export const content: Writable<LanguageContent> = writable<LanguageContent>(
    {} as LanguageContent
);
export const isLoading: Writable<boolean> = writable<boolean>(false);
export const error: Writable<string | null> = writable<string | null>(null);
export const showLanguageMenu: Writable<boolean> = writable<boolean>(false);

export const darkMode: Writable<boolean> = writable<boolean>(
    getInitialDarkMode()
);
export const showShareMenu: Writable<boolean> = writable<boolean>(false);

export const currentContent: Readable<LanguageContent> = derived(
    content,
    $content => {
        if (!$content || Object.keys($content).length === 0) {
            return fallbackContent;
        }
        return $content;
    }
);

export function t(key: string, fallback: string = key): string {
    const currentContent = get(content);

    if (!currentContent || Object.keys(currentContent).length === 0) {
        const keys = key.split('.');
        let value: unknown = fallbackContent;

        for (const k of keys) {
            if (value === undefined || value === null) {
                return fallback;
            }
            value = (value as Record<string, unknown>)[k];
        }

        return (value as string) || fallback;
    }

    const keys = key.split('.');
    let value: unknown = currentContent;

    for (const k of keys) {
        if (value === undefined || value === null) {
            return fallback;
        }
        value = (value as Record<string, unknown>)[k];
    }

    return (value as string) || fallback;
}

export const tReactive: Readable<(key: string, fallback?: string) => string> =
    derived(content, $content => {
        return (key: string, fallback: string = key): string => {
            const currentContent = $content;

            if (!currentContent || Object.keys(currentContent).length === 0) {
                const keys = key.split('.');
                let value: unknown = fallbackContent;

                for (const k of keys) {
                    if (value === undefined || value === null) {
                        return fallback;
                    }
                    value = (value as Record<string, unknown>)[k];
                }

                return (value as string) || fallback;
            }

            const keys = key.split('.');
            let value: unknown = currentContent;

            for (const k of keys) {
                if (value === undefined || value === null) {
                    return fallback;
                }
                value = (value as Record<string, unknown>)[k];
            }

            return (value as string) || fallback;
        };
    });

export const translations: Readable<Record<string, ContentSection>> = derived(
    content,
    $content => {
        const currentContent = $content;

        if (!currentContent || Object.keys(currentContent).length === 0) {
            return {
                header: fallbackContent.header || {},
                index: fallbackContent.index || {},
                emojiDisplay: fallbackContent.emojiDisplay || {},
                contactForm: fallbackContent.contactForm || {},
                donateButton: fallbackContent.donateButton || {},
                notFound: fallbackContent.notFound || {},
                versions: fallbackContent.versions || {},
                accountManager: fallbackContent.accountManager || {}
            };
        }

        return {
            header:
                (currentContent.header as ContentSection) ||
                fallbackContent.header ||
                {},
            index:
                (currentContent.index as ContentSection) ||
                fallbackContent.index ||
                {},
            emojiDisplay:
                (currentContent.emojiDisplay as ContentSection) ||
                fallbackContent.emojiDisplay ||
                {},
            contactForm:
                (currentContent.contactForm as ContentSection) ||
                fallbackContent.contactForm ||
                {},
            donateButton:
                (currentContent.donateButton as ContentSection) ||
                fallbackContent.donateButton ||
                {},
            notFound:
                (currentContent.notFound as ContentSection) ||
                fallbackContent.notFound ||
                {},
            versions:
                (currentContent.versions as ContentSection) ||
                fallbackContent.versions ||
                {},
            accountManager:
                (currentContent.accountManager as ContentSection) ||
                fallbackContent.accountManager ||
                {}
        };
    }
);

const fallbackContent: LanguageContent = {
    _meta: {
        language: 'en'
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Open main menu',
        closeMainMenu: 'Close main menu'
    },
    index: {
        pageTitle: 'Emoji Password Generator',
        pageDescription:
            'Generate secure emoji passwords for better online security.',
        pageKeywords: 'emoji password, password generator, security',
        pageInstruction: [
            'Click "📝 Story" to generate AI Emoji passwords 📖',
            'Click "Random" for random emojis 😜.',
            'Copy to clipboard when generated 📋'
        ],
        backToMainText: 'Click here 👇',
        backToMainButtonText: 'Back to main 🔙',
        contactText: 'Have questions or feedback?',
        contactButtonText: 'Contact us! 💌'
    },
    emojiDisplay: {
        clickToCopy: 'Click or press Enter to copy emoji password to clipboard',
        successMessage: 'Success! Copied to clipboard 💾',
        errorMessage: 'Error! Something went wrong 🤖',
        dailyLimitReachedMessage: 'Sorry, daily limit of requests reached 😔',
        successStoryMessage: 'Success! Emoji password generated 🤖',
        errorStoryMessage: 'Error! Could not generate password 🌀',
        emojiDisplayTitle: 'Emoji Password Generator',
        dataPrivacyProcessingInfo:
            '🚀 Emoji passwords via webhooks and AI! ✨ Data is processed – not stored.',
        clearButton: '✖️ Clear',
        storyButton: '📝 Story',
        storyButtonClicked: '📩 Story requested',
        randomButton: '🎲 Random',
        placeholderText:
            'Enter your story, emoji password will be generated...',
        clipboardError: 'Error copying to clipboard'
    },
    contactForm: {
        nameLabel: '🧑🏻 Your name',
        emailLabel: 'Your email',
        messageLabel: '✍🏻 Your message',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Send message',
        sendingButton: '📨 Sending...',
        successMessage:
            "Success! Message sent – We'll respond within 24 hours 🚀",
        errorMessage: 'Error! Message could not be sent 😟',
        requestErrorMessage:
            'Error! Could not send message, please try again 🙁',
        smirkingFaceImageAlt: 'keymoji emoji smirking face 1f60f',
        introductionTitle: "Hello, I'm Christopher",
        introductionText:
            "I'm a Frontend developer, working with JavaScript, PHP, HTML. Send me a message!",
        privacyNotice:
            'Note: Your data is not stored. Messages are processed securely.',
        newsletterLabel: 'Yes, I want to receive the newsletter',
        backToMainButton: 'Back to main page',
        footerText: 'Developed with love',
        validationErrorMessage:
            'Please fix the form errors before submitting 🔍',
        sendingMessage: 'Sending your message... 📨',
        emailText: {
            greeting: 'Hello',
            intro: 'Your message has been received 📩!',
            confirmationText:
                'Your message has been confirmed, Christopher will respond shortly. Your message:',
            doubleCheck:
                "We've received your message with the following details:",
            button: 'Confirm Your Email'
        },
        validation: {
            nameRequired: 'Name required',
            nameLength: 'Minimum 2 characters',
            emailRequired: 'Email required',
            emailInvalid: 'Invalid email',
            messageRequired: 'Message required',
            messageLength: 'Minimum {min} characters'
        }
    },
    donateButton: {
        text: 'Buy me a coffee',
        openText: 'Open menu',
        textMobile: '☕'
    },
    notFound: {
        pageTitle: 'Page not found',
        pageDescription: 'The page you are looking for does not exist.',
        message: 'Oops! Page not found 🚫',
        suggestion:
            'The page you are looking for might have been moved, deleted, or never existed.',
        backButton: 'Go back home',
        contactButton: 'Contact us'
    },
    versions: {
        currentVersion: formatVersion(),
        lastUpdated: 'Last updated: 2023-10-27'
    },
    accountManager: {
        title: 'Account Manager',
        subtitle: 'Manage your Keymoji account',
        emailLabel: 'Your email address',
        passwordLabel: 'Your password',
        loginButton: 'Login',
        registerButton: 'Register',
        forgotPasswordLink: 'Forgot password?',
        loginErrorMessage: 'Invalid email or password.',
        registerErrorMessage: 'Email already in use.',
        successMessage: 'Account created successfully!',
        logoutButton: 'Logout',
        profileTitle: 'My Profile',
        profileSubtitle: 'Update your personal information',
        nameLabel: 'Your name',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        confirmPasswordLabel: 'Confirm password',
        updateProfileButton: 'Update Profile',
        deleteAccountButton: 'Delete Account',
        deleteAccountConfirmation:
            'Are you sure you want to delete your account? This action cannot be undone.',
        deleteAccountSuccess: 'Your account has been deleted.',
        deleteAccountError: 'Failed to delete account.',
        backToMainButton: 'Back to main page'
    }
};

const loadedLanguages = new Set<string>();

const languageModuleCache = new Map<string, { default: LanguageContent }>();

/**
 * Lädt Content für eine Sprache
 */
export async function loadLanguage(lang: string): Promise<void> {
    devLog('🔄 contentStore: loadLanguage called with:', lang);

    devLog('🔄 contentStore: Setting loading state...');
    isLoading.set(true);
    error.set(null);

    try {
        devLog('🔄 contentStore: Importing language module...');
        devLog(
            '🔄 contentStore: Trying to import: ../data/languages/${lang}.js'
        );

        let module: { default: LanguageContent };
        if (languageModuleCache.has(lang)) {
            devLog('✅ contentStore: Using cached module for:', lang);
            module = languageModuleCache.get(lang)!;
        } else {
            try {
                module = (await import(`../data/languages/${lang}.js`)) as {
                    default: LanguageContent;
                };
                devLog('✅ contentStore: Module imported successfully');

                languageModuleCache.set(lang, module);
                devLog('✅ contentStore: Module cached for:', lang);
            } catch (importError: unknown) {
                devWarn(
                    `❌ contentStore: Failed to import ${lang}.js:`,
                    importError
                );
                devWarn(`⚠️ contentStore: Trying fallback to English`);

                if (lang !== 'en') {
                    try {
                        if (languageModuleCache.has('en')) {
                            module = languageModuleCache.get('en')!;
                            devLog(
                                '✅ contentStore: Using cached English fallback'
                            );
                        } else {
                            module = (await import(
                                `../data/languages/en.js`
                            )) as { default: LanguageContent };
                            languageModuleCache.set('en', module);
                            devLog(
                                '✅ contentStore: English fallback loaded and cached'
                            );
                        }
                    } catch (fallbackError: unknown) {
                        devWarn(
                            '❌ contentStore: Even English fallback failed:',
                            fallbackError
                        );
                        throw fallbackError;
                    }
                } else {
                    throw importError;
                }
            }
        }

        const languageContent = module.default;
        devLog('✅ contentStore: Module imported:', languageContent);
        devLog('✅ contentStore: Content keys:', Object.keys(languageContent));

        if (!languageContent || !languageContent._meta) {
            throw new Error(`Invalid content structure for ${lang}`);
        }

        content.set(languageContent);
        currentLanguage.set(lang);
        loadedLanguages.add(lang);

        storageHelpers.set(STORAGE_KEYS.LANGUAGE, lang);

        devLog(`✅ contentStore: Language ${lang} loaded successfully`);
        devLog(
            '📊 contentStore: Current content keys:',
            Object.keys(languageContent)
        );

        devLog('🔍 contentStore: Sample translations:');
        devLog('- header.pageTitle:', languageContent.header?.pageTitle);
        devLog('- index.pageTitle:', languageContent.index?.pageTitle);
        devLog(
            '- contactForm.pageTitle:',
            languageContent.contactForm?.pageTitle
        );
        devLog(
            '- contactForm.pageDescription:',
            languageContent.contactForm?.pageDescription
        );
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        devWarn(`❌ contentStore: Failed to load language ${lang}:`, err);
        error.set(errorMessage);

        if (lang !== 'en') {
            devLog('🔄 contentStore: Falling back to English...');
            await loadLanguage('en');
        }
    } finally {
        isLoading.set(false);
        devLog('🔄 contentStore: Loading state cleared');
    }
}

/**
 * Prüft ob eine Sprache unterstützt wird
 */
export function isLanguageSupported(lang: string): boolean {
    return [
        'en',
        'de',
        'de-CH',
        'es',
        'nl',
        'it',
        'fr',
        'pl',
        'ru',
        'ja',
        'ko',
        'tr',
        'af',
        'tlh',
        'sjn'
    ].includes(lang);
}

/**
 * Lädt die Standardsprache beim Start
 */
export async function initializeLanguage(): Promise<void> {
    devLog('🔄 initializeLanguage: Starting...');

    const storedLang = storageHelpers.get<string>(STORAGE_KEYS.LANGUAGE);
    const browserLang =
        typeof navigator !== 'undefined'
            ? navigator.language?.split('-')[0] || 'en'
            : 'en';

    let urlLang: string | null = null;
    if (typeof window !== 'undefined') {
        const pathSegments = window.location.pathname
            .split('/')
            .filter(segment => segment !== '');
        const firstSegment = pathSegments[0];
        if (firstSegment && isLanguageSupported(firstSegment)) {
            urlLang = firstSegment;
        }
    }

    devLog('🔍 initializeLanguage: Language detection:', {
        stored: storedLang,
        browser: browserLang,
        url: urlLang,
        supported: isLanguageSupported(browserLang)
    });

    let langToLoad = 'en'; // Konsistenter Default

    if (urlLang && isLanguageSupported(urlLang)) {
        langToLoad = urlLang;
        devLog('🚀 initializeLanguage: Using URL language:', urlLang);
    } else if (
        storedLang &&
        typeof storedLang === 'string' &&
        isLanguageSupported(storedLang)
    ) {
        langToLoad = storedLang;
        devLog('🔍 initializeLanguage: Using stored language:', storedLang);
    } else if (isLanguageSupported(browserLang)) {
        langToLoad = browserLang;
        devLog('🔍 initializeLanguage: Using browser language:', browserLang);
    } else {
        devLog('🔍 initializeLanguage: Using default language: en');
    }

    currentLanguage.set(langToLoad);
    storageHelpers.set(STORAGE_KEYS.LANGUAGE, langToLoad);

    devLog('🔄 initializeLanguage: Loading language:', langToLoad);
    await loadLanguage(langToLoad);
    devLog('✅ initializeLanguage: Language loaded:', langToLoad);

    syncUrlWithLanguage();
}

/**
 * Wechselt die Sprache
 */
export async function changeLanguage(lang: string): Promise<void> {
    devLog('🔄 contentStore: changeLanguage called with:', lang);

    if (!isLanguageSupported(lang)) {
        devWarn(`❌ contentStore: Language ${lang} not supported`);
        return;
    }

    try {
        await loadLanguage(lang);

        const currentContent = get(content);
        devLog('🔄 contentStore: Content after language change:', {
            language: lang,
            contentKeys: currentContent
                ? Object.keys(currentContent)
                : 'no content',
            hasContactForm: currentContent?.contactForm ? 'yes' : 'no',
            hasAccountManager: currentContent?.accountManager ? 'yes' : 'no',
            contactFormKeys: currentContent?.contactForm
                ? Object.keys(currentContent.contactForm)
                : 'no contactForm'
        });

        syncUrlWithLanguage();

        devLog(`✅ contentStore: Language changed to ${lang} successfully`);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        devWarn('❌ contentStore: Error changing language:', err);
        error.set(errorMessage);
    }
}

/**
 * Debug-Funktion: Zeigt alle geladenen Sprachen
 */
export function getLoadedLanguages(): string[] {
    return Array.from(loadedLanguages);
}

/**
 * Debug-Funktion: Zeigt aktuellen Content-Status
 */
export function getContentStatus(): ContentStatus {
    return {
        currentLanguage: get(currentLanguage),
        loadedLanguages: getLoadedLanguages(),
        isLoading: get(isLoading),
        error: get(error),
        hasContent: Object.keys(get(content)).length > 0
    };
}

/**
 * Synchronisiert URL mit aktueller Sprache
 */
export function syncUrlWithLanguage(): void {
    if (typeof window === 'undefined') return;

    const currentLang = get(currentLanguage);
    const pathSegments = window.location.pathname
        .split('/')
        .filter(segment => segment !== '');

    const languageCodes = [
        'en',
        'de',
        'de-CH',
        'es',
        'nl',
        'it',
        'fr',
        'pl',
        'ru',
        'tr',
        'af',
        'ja',
        'ko',
        'tlh',
        'sjn'
    ];

    const nonLanguageSegments = pathSegments.filter(
        segment => !languageCodes.includes(segment)
    );

    if (pathSegments[0] !== currentLang) {
        if (currentLang && currentLang !== 'en') {
            const newPath = `/${currentLang}${
                nonLanguageSegments.length > 0
                    ? '/' + nonLanguageSegments.join('/')
                    : ''
            }`;
            const queryString = window.location.search;
            const fullPath = queryString ? `${newPath}${queryString}` : newPath;
            if (window.location.pathname !== newPath) {
                window.history.replaceState(null, '', fullPath);
                devLog('🔄 contentStore: URL synchronized to:', fullPath);
            }
        } else if (currentLang === 'en') {
            const newPath =
                nonLanguageSegments.length > 0
                    ? '/' + nonLanguageSegments.join('/')
                    : '/';
            const queryString = window.location.search;
            const fullPath = queryString ? `${newPath}${queryString}` : newPath;
            if (window.location.pathname !== newPath) {
                window.history.replaceState(null, '', fullPath);
                devLog('🔄 contentStore: URL synchronized to root:', fullPath);
            }
        } else if (pathSegments[0] && languageCodes.includes(pathSegments[0])) {
            if (currentLang !== pathSegments[0]) {
                currentLanguage.set(pathSegments[0]);
                storageHelpers.set(STORAGE_KEYS.LANGUAGE, pathSegments[0]);
                devLog(
                    '🔄 contentStore: Store synchronized to URL language:',
                    pathSegments[0]
                );
            }
        }
    }
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeStore);
    } else {
        initializeStore();
    }
}

function initializeStore(): void {
    devLog('🚀 contentStore: Initializing...');

    const storedLang = storageHelpers.get<string>(STORAGE_KEYS.LANGUAGE);
    const browserLang =
        typeof navigator !== 'undefined'
            ? navigator.language?.split('-')[0] || 'en'
            : 'en';

    let urlLang: string | null = null;
    const pathSegments = window.location.pathname
        .split('/')
        .filter(segment => segment !== '');
    const firstSegment = pathSegments[0];
    if (firstSegment && isLanguageSupported(firstSegment)) {
        urlLang = firstSegment;
    }

    let initialLang = 'en'; // Konsistenter Default
    if (urlLang && isLanguageSupported(urlLang)) {
        initialLang = urlLang;
        devLog('🚀 contentStore: Using URL language:', urlLang);
    } else if (
        storedLang &&
        typeof storedLang === 'string' &&
        isLanguageSupported(storedLang)
    ) {
        initialLang = storedLang;
        devLog('🚀 contentStore: Using stored language:', storedLang);
    } else if (isLanguageSupported(browserLang)) {
        initialLang = browserLang;
        devLog('🚀 contentStore: Using browser language:', browserLang);
    } else {
        devLog('🚀 contentStore: Using default language: en');
    }

    currentLanguage.set(initialLang);
    storageHelpers.set(STORAGE_KEYS.LANGUAGE, initialLang);

    syncUrlWithLanguage();

    loadLanguage(initialLang).catch((err: unknown) => {
        devWarn('❌ contentStore: Failed to load language:', err);
    });

    devLog('✅ contentStore: Store initialized with language:', initialLang);
}
