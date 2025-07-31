// src/stores/contentStore.js
// Zentrale Verwaltung für Content und Übersetzungen

import { writable, get, derived } from 'svelte/store';
import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';
import { appVersion, formatVersion } from '../utils/version.js';
import { isDevelopment, devLog, devWarn } from '../utils/environment.js';
import { initializeAccountFromCookies } from './accountStore.js';

// Stores für Content und Sprache
export const currentLanguage = writable(
    storageHelpers.get(STORAGE_KEYS.LANGUAGE, 'en') // Konsistenter Default: 'en'
);
export const content = writable({});
export const isLoading = writable(false);
export const error = writable(null);
export const showLanguageMenu = writable(false);

// Zusätzliche Stores für Kompatibilität
export const darkMode = writable(
    storageHelpers.get(STORAGE_KEYS.DARK_MODE, false)
);
export const showShareMenu = writable(false);

// Reaktive Stores für bessere Performance
export const currentContent = derived(
    [content, currentLanguage],
    ([$content, $currentLanguage]) => {
        if (!$content || Object.keys($content).length === 0) {
            return fallbackContent;
        }
        return $content;
    }
);

// Hilfsfunktion für Übersetzungen
export function t(key, fallback = key) {
    const currentContent = get(content);
    const currentLang = get(currentLanguage);

    // Wenn kein Content geladen ist, verwende Fallback-Content
    if (!currentContent || Object.keys(currentContent).length === 0) {
        const keys = key.split('.');
        let value = fallbackContent;

        for (const k of keys) {
            if (value === undefined || value === null) {
                return fallback;
            }
            value = value[k];
        }

        return value || fallback;
    }

    const keys = key.split('.');
    let value = currentContent;

    for (const k of keys) {
        if (value === undefined || value === null) {
            return fallback;
        }
        value = value[k];
    }

    return value || fallback;
}

// Reaktive Übersetzungsfunktion
export const tReactive = derived(
    [content, currentLanguage],
    ([$content, $currentLanguage]) => {
        return (key, fallback = key) => {
            const currentContent = $content;
            const currentLang = $currentLanguage;

            // Wenn kein Content geladen ist, verwende Fallback-Content
            if (!currentContent || Object.keys(currentContent).length === 0) {
                const keys = key.split('.');
                let value = fallbackContent;

                for (const k of keys) {
                    if (value === undefined || value === null) {
                        return fallback;
                    }
                    value = value[k];
                }

                return value || fallback;
            }

            const keys = key.split('.');
            let value = currentContent;

            for (const k of keys) {
                if (value === undefined || value === null) {
                    return fallback;
                }
                value = value[k];
            }

            return value || fallback;
        };
    }
);

// Reaktive Übersetzungen für häufige Keys
export const translations = derived(
    [content, currentLanguage],
    ([$content, $currentLanguage]) => {
        const currentContent = $content;

        if (!currentContent || Object.keys(currentContent).length === 0) {
            return {
                header: fallbackContent.header,
                index: fallbackContent.index,
                emojiDisplay: fallbackContent.emojiDisplay,
                contactForm: fallbackContent.contactForm,
                donateButton: fallbackContent.donateButton,
                notFound: fallbackContent.notFound,
                versions: fallbackContent.versions,
                accountManager: fallbackContent.accountManager
            };
        }

        return {
            header: currentContent.header || fallbackContent.header,
            index: currentContent.index || fallbackContent.index,
            emojiDisplay:
                currentContent.emojiDisplay || fallbackContent.emojiDisplay,
            contactForm:
                currentContent.contactForm || fallbackContent.contactForm,
            donateButton:
                currentContent.donateButton || fallbackContent.donateButton,
            notFound: currentContent.notFound || fallbackContent.notFound,
            versions: currentContent.versions || fallbackContent.versions,
            accountManager:
                currentContent.accountManager || fallbackContent.accountManager
        };
    }
);

// Fallback-Content für den Fall, dass noch nichts geladen ist
const fallbackContent = {
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
        emailLabel: '📧 Your email',
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

// Cache für geladene Sprachen
const loadedLanguages = new Set();

// Cache für geladene Sprachmodule
const languageModuleCache = new Map();

/**
 * Lädt Content für eine Sprache
 */
export async function loadLanguage(lang) {
    devLog('🔄 contentStore: loadLanguage called with:', lang);

    devLog('🔄 contentStore: Setting loading state...');
    isLoading.set(true);
    error.set(null);

    try {
        devLog('🔄 contentStore: Importing language module...');
        devLog(
            '🔄 contentStore: Trying to import: ../data/languages/${lang}.js'
        );

        // Prüfe Cache zuerst
        let module;
        if (languageModuleCache.has(lang)) {
            devLog('✅ contentStore: Using cached module for:', lang);
            module = languageModuleCache.get(lang);
        } else {
            // Dynamischer Import der Sprachdatei mit Error-Handling
            try {
                module = await import(`../data/languages/${lang}.js`);
                devLog('✅ contentStore: Module imported successfully');

                // Cache das Modul
                languageModuleCache.set(lang, module);
                devLog('✅ contentStore: Module cached for:', lang);
            } catch (importError) {
                devWarn(
                    `❌ contentStore: Failed to import ${lang}.js:`,
                    importError
                );
                devWarn(`⚠️ contentStore: Trying fallback to English`);

                // Fallback auf Englisch wenn Import fehlschlägt
                if (lang !== 'en') {
                    try {
                        if (languageModuleCache.has('en')) {
                            module = languageModuleCache.get('en');
                            devLog(
                                '✅ contentStore: Using cached English fallback'
                            );
                        } else {
                            module = await import(`../data/languages/en.js`);
                            languageModuleCache.set('en', module);
                            devLog(
                                '✅ contentStore: English fallback loaded and cached'
                            );
                        }
                    } catch (fallbackError) {
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

        // Validiere Content
        if (!languageContent || !languageContent._meta) {
            throw new Error(`Invalid content structure for ${lang}`);
        }

        // Content setzen
        content.set(languageContent);
        currentLanguage.set(lang);
        loadedLanguages.add(lang);

        // In localStorage speichern
        storageHelpers.set(STORAGE_KEYS.LANGUAGE, lang);

        devLog(`✅ contentStore: Language ${lang} loaded successfully`);
        devLog(
            '📊 contentStore: Current content keys:',
            Object.keys(get(content))
        );

        // Debug: Zeige einige Übersetzungen
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
    } catch (err) {
        devWarn(`❌ contentStore: Failed to load language ${lang}:`, err);
        error.set(err.message);

        // Fallback auf Englisch
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
export function isLanguageSupported(lang) {
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
export async function initializeLanguage() {
    devLog('🔄 initializeLanguage: Starting...');

    const storedLang = storageHelpers.get(STORAGE_KEYS.LANGUAGE);
    const browserLang = navigator.language?.split('-')[0] || 'en';

    // Prüfe URL-Pfad für Sprachcode
    let urlLang = null;
    if (typeof window !== 'undefined') {
        const pathSegments = window.location.pathname
            .split('/')
            .filter(segment => segment !== '');
        if (pathSegments.length > 0 && isLanguageSupported(pathSegments[0])) {
            urlLang = pathSegments[0];
        }
    }

    devLog('🔍 initializeLanguage: Language detection:', {
        stored: storedLang,
        browser: browserLang,
        url: urlLang,
        supported: isLanguageSupported(browserLang)
    });

    // Priorität: URL > stored > browser > default
    let langToLoad = 'en'; // Konsistenter Default

    if (urlLang && isLanguageSupported(urlLang)) {
        langToLoad = urlLang;
        devLog('�� initializeLanguage: Using URL language:', urlLang);
    } else if (storedLang && isLanguageSupported(storedLang)) {
        langToLoad = storedLang;
        devLog('🔍 initializeLanguage: Using stored language:', storedLang);
    } else if (isLanguageSupported(browserLang)) {
        langToLoad = browserLang;
        devLog('🔍 initializeLanguage: Using browser language:', browserLang);
    } else {
        devLog('🔍 initializeLanguage: Using default language: en');
    }

    // Sofort die Sprache setzen für UI-Reaktivität
    currentLanguage.set(langToLoad);
    storageHelpers.set(STORAGE_KEYS.LANGUAGE, langToLoad);

    devLog('🔄 initializeLanguage: Loading language:', langToLoad);
    await loadLanguage(langToLoad);
    devLog('✅ initializeLanguage: Language loaded:', langToLoad);

    // URL synchronisieren nach erfolgreichem Laden
    syncUrlWithLanguage();
}

/**
 * Wechselt die Sprache
 */
export async function changeLanguage(lang) {
    devLog('🔄 contentStore: changeLanguage called with:', lang);

    if (!isLanguageSupported(lang)) {
        devWarn(`❌ contentStore: Language ${lang} not supported`);
        return;
    }

    try {
        // Immer neu laden, auch wenn bereits geladen
        await loadLanguage(lang);

        // Zusätzliche Validierung der Reaktivität
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

        // URL synchronisieren
        syncUrlWithLanguage();

        devLog(`✅ contentStore: Language changed to ${lang} successfully`);
    } catch (error) {
        devWarn('❌ contentStore: Error changing language:', error);
        error.set(error.message);
    }
}

/**
 * Debug-Funktion: Zeigt alle geladenen Sprachen
 */
export function getLoadedLanguages() {
    return Array.from(loadedLanguages);
}

/**
 * Debug-Funktion: Zeigt aktuellen Content-Status
 */
export function getContentStatus() {
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
export function syncUrlWithLanguage() {
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

    // Remove ALL language codes from the path
    const nonLanguageSegments = pathSegments.filter(
        segment => !languageCodes.includes(segment)
    );

    // Wenn URL-Sprache nicht mit Store-Sprache übereinstimmt
    if (pathSegments[0] !== currentLang) {
        if (currentLang && currentLang !== 'en') {
            // Store hat eine Sprache - URL anpassen
            const newPath = `/${currentLang}${
                nonLanguageSegments.length > 0
                    ? '/' + nonLanguageSegments.join('/')
                    : ''
            }`;
            // Preserve query parameters for magic link verification
            const queryString = window.location.search;
            const fullPath = queryString ? `${newPath}${queryString}` : newPath;
            if (window.location.pathname !== newPath) {
                window.history.replaceState(null, '', fullPath);
                devLog('🔄 contentStore: URL synchronized to:', fullPath);
            }
        } else if (currentLang === 'en') {
            // Store hat 'en' - URL ohne Sprachpräfix
            const newPath =
                nonLanguageSegments.length > 0
                    ? '/' + nonLanguageSegments.join('/')
                    : '/';
            // Preserve query parameters for magic link verification
            const queryString = window.location.search;
            const fullPath = queryString ? `${newPath}${queryString}` : newPath;
            if (window.location.pathname !== newPath) {
                window.history.replaceState(null, '', fullPath);
                devLog('🔄 contentStore: URL synchronized to root:', fullPath);
            }
        } else if (pathSegments[0] && languageCodes.includes(pathSegments[0])) {
            // URL hat eine gültige Sprache - Store anpassen (nur wenn nicht bereits gesetzt)
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

// Initialisiere beim Import und setze Fallback-Content
if (typeof window !== 'undefined') {
    // Warte auf DOM-Load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeStore);
    } else {
        initializeStore();
    }
}

function initializeStore() {
    devLog('🚀 contentStore: Initializing...');

    // Sofort die gespeicherte Sprache setzen für UI-Reaktivität
    const storedLang = storageHelpers.get(STORAGE_KEYS.LANGUAGE);
    const browserLang = navigator.language?.split('-')[0] || 'en';

    // Prüfe URL-Pfad für Sprachcode
    let urlLang = null;
    const pathSegments = window.location.pathname
        .split('/')
        .filter(segment => segment !== '');
    if (pathSegments.length > 0 && isLanguageSupported(pathSegments[0])) {
        urlLang = pathSegments[0];
    }

    // Priorität: URL > stored > browser > default
    let initialLang = 'en'; // Konsistenter Default
    if (urlLang && isLanguageSupported(urlLang)) {
        initialLang = urlLang;
        devLog('🚀 contentStore: Using URL language:', urlLang);
    } else if (storedLang && isLanguageSupported(storedLang)) {
        initialLang = storedLang;
        devLog('🚀 contentStore: Using stored language:', storedLang);
    } else if (isLanguageSupported(browserLang)) {
        initialLang = browserLang;
        devLog('🚀 contentStore: Using browser language:', browserLang);
    } else {
        devLog('🚀 contentStore: Using default language: en');
    }

    // Sofort die Sprache setzen
    currentLanguage.set(initialLang);
    storageHelpers.set(STORAGE_KEYS.LANGUAGE, initialLang);

    // URL synchronisieren
    syncUrlWithLanguage();

    // Asynchron Content laden
    loadLanguage(initialLang).catch(error => {
        devWarn('❌ contentStore: Failed to load language:', error);
    });

    devLog('✅ contentStore: Store initialized with language:', initialLang);
}
