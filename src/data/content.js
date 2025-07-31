// src/data/content.js
// Zentrale Content-Datei für wiederkehrende Inhalte und Best Practices

import { appVersion } from '../utils/version.js';
import {
    emailIcon,
    fbmessengerIcon,
    kofiIcon,
    linkedinIcon,
    logo,
    paypalIcon,
    redditIcon,
    whatsappIcon,
    instagramIcon
} from '../assets/shapes.js';

/**
 * Gemeinsame Inhalte für alle Sprachen
 */
export const commonContent = {
    logo: {
        svg: logo
    },
    version: appVersion,
    socialLinks: {
        linkedin: {
            href: 'https://www.linkedin.com/in/christopher-matt-2b2b2b2b2b/',
            icon: linkedinIcon,
            alt: 'LinkedIn',
            title: 'LinkedIn Profile'
        },
        email: {
            href: 'mailto:christopher@keymoji.com',
            icon: emailIcon,
            alt: 'Email',
            title: 'Send Email'
        },
        whatsapp: {
            href: 'https://wa.me/41791234567',
            icon: whatsappIcon,
            alt: 'WhatsApp',
            title: 'WhatsApp Chat'
        },
        reddit: {
            href: 'https://www.reddit.com/user/keymoji',
            icon: redditIcon,
            alt: 'Reddit',
            title: 'Reddit Profile'
        },
        fbmessenger: {
            href: 'https://m.me/keymoji',
            icon: fbmessengerIcon,
            alt: 'Facebook Messenger',
            title: 'Facebook Messenger'
        },
        instagram: {
            href: 'https://www.instagram.com/keymoji_official/',
            icon: instagramIcon,
            alt: 'Instagram',
            title: 'Instagram Profile'
        }
    },
    donateLinks: [
        {
            id: 1,
            href: 'https://paypal.me/christophermattch/1',
            svgContent: paypalIcon,
            alt: 'icon paypal',
            title: 'Paypal.me',
            target: '_blank',
            rel: 'noreferrer'
        },
        {
            id: 12,
            href: 'https://ko-fi.com/keymoji_official',
            svgContent: kofiIcon,
            alt: 'icon ko-fi',
            title: 'Ko-fi',
            target: '_blank',
            rel: 'noreferrer'
        }
    ],
    accessibility: {
        skipToMain: 'Skip to main content',
        closeModal: 'Close modal',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        loading: 'Loading...',
        error: 'Error occurred',
        success: 'Success',
        warning: 'Warning',
        info: 'Information'
    },
    seo: {
        defaultTitle: 'Keymoji - Emoji Password Generator',
        defaultDescription:
            '🔑 Passwords reimagined. 🎯 Uncrackable emoji passwords. 🌈 Free. Secure. Innovative.',
        defaultKeywords:
            'Keymoji, emoji password, password generator, security, online security',
        defaultImage: '/images/keymoji-social-media-banner-10-2024-min.png',
        defaultUrl: 'https://keymoji.com'
    },
    api: {
        endpoints: {
            contact: '/api/contact',
            magicLink: '/api/magic-link/send',
            account: '/api/account',
            random: '/api/random',
            testEmails: '/api/test-emails'
        },
        timeouts: {
            default: 10000,
            contact: 15000,
            magicLink: 20000
        }
    },
    limits: {
        dailyRequests: 3,
        storyMinLength: 40,
        contactMinLength: 10,
        maxEmojiCount: 9,
        minEmojiCount: 4
    },
    animations: {
        duration: {
            fast: 200,
            normal: 300,
            slow: 500
        },
        easing: {
            smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
    },
    validation: {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s\-']+$/,
            message: 'Please enter a valid name (2-50 characters, letters only)'
        },
        message: {
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10 and 1000 characters'
        }
    },
    features: {
        storyMode: {
            enabled: true,
            beta: true,
            minLength: 40,
            maxLength: 500
        },
        darkMode: {
            enabled: true,
            auto: true
        },
        accessibility: {
            enabled: true,
            highContrast: false,
            reducedMotion: true
        },
        analytics: {
            enabled: true,
            privacy: true
        }
    }
};

/**
 * Content-Template für neue Sprachen
 */
export const contentTemplate = {
    header: {
        pageTitle: 'Keymoji',
        pageVersion: appVersion,
        openMainMenu: 'Open main menu',
        closeMainMenu: 'Close main menu'
    },
    index: {
        pageTitle: 'Emoji Password Generator',
        pageDescription:
            '🔑 Passwords reimagined. 🎯 Uncrackable emoji passwords. 🌈 Free. Secure. Innovative.',
        pageKeywords:
            'Keymoji, emoji password, password generator, security, online security',
        pageInstruction: [
            'Click "📝 Story" for your AI emoji tale 📖',
            '"Random" is self-explanatory 😜.',
            "After generating, it's saved to your clipboard! 📋"
        ],
        backToMainText: 'Click on below 👇 to get back',
        backToMainButtonText: 'Back to main view 🔙',
        contactText: 'Got a question or a cool suggestion?',
        contactButtonText: 'Send me a message! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Click or press Enter to copy the generated emoji password to clipboard',
        successMessage: 'Success, copied into your Clipboard 💾',
        errorMessage: 'Oops, something went wrong 🤖',
        dailyLimitReachedMessage: 'Sorry, daily limit of requests reached 😔',
        successStoryMessage: 'Success, Emoji story generated 🤖',
        errorStoryMessage: 'Error, no answer from server 🌀',
        emojiDisplayTitle: 'Emoji Password Generator',
        dataPrivacyProcessingInfo:
            "🚀 Emoji magic via webhooks and AI! ✨ Data's like beach sand - it doesn't stay.",
        clearButton: '✖️ Clear',
        storyButton: '📝 Story',
        storyButtonClicked: '📩 Send story',
        randomButton: '🎲 Random',
        placeholderText:
            'Tell me a story and I will generate emoji passwords based on it...'
    },
    donateButton: {
        text: 'Buy me a coffee',
        openText: 'Close this menu',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Your Name',
        emailLabel: '📧 Your Email',
        messageLabel: '✍🏻 Your Message',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Send',
        successMessage: 'Success, Message sent - Answer: < 24 hours 🚀',
        errorMessage: 'An unexpected error occurred 😟',
        requestErrorMessage: 'Error sending the message, please try again 🙁',
        smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
        introductionTitle: "Hi, i'm Christopher",
        introductionText:
            "Frontend Developer and i love to design and code userfriendly Websites with JavaScript, PHP and HTML. Don't hesitate and send me a message if you like.",
        privacyNotice:
            'Rest assured, your data is in good hands with us 🤲. Your details will not be passed on to third parties 🔒.',
        newsletterLabel: 'Yes, I would like to subscribe to the newsletter',
        emailText: {
            greeting: 'Welcome',
            confirmationText:
                'Please confirm your request so Christopher knows you are not an intelligent bot. You sent a message with the following data:',
            doubleCheck: 'We received your message with the following details:',
            button: 'Confirm your email'
        }
    },
    serviceWorker: {
        updateAvailable: 'A new version is available!',
        manualRefreshNeeded:
            'New version activated. Reload now for the latest features.',
        updateSuccess: 'App updated successfully! 🎉'
    },
    notFound: {
        message: 'Oops! Page not found 🚫',
        backButton: 'Go back home',
        contactButton: 'Contact us'
    },
    blog: {
        readMore: 'Read more',
        backToBlog: 'Back to blog',
        publishedOn: 'Published on',
        author: 'Author',
        tags: 'Tags'
    },
    account: {
        create: 'Create Account',
        manage: 'Manage Account',
        login: 'Login',
        logout: 'Logout',
        profile: 'Profile',
        settings: 'Settings'
    }
};

/**
 * Hilfsfunktionen für Content-Management
 */
export const contentHelpers = {
    /**
     * Validiert Content-Struktur
     */
    validateContent(content, language) {
        const requiredKeys = ['header', 'index', 'emojiDisplay', 'contactForm'];
        const missingKeys = requiredKeys.filter(key => !content[key]);

        if (missingKeys.length > 0) {
            console.warn(
                `Missing required content keys for ${language}:`,
                missingKeys
            );
            return false;
        }

        return true;
    },

    /**
     * Erstellt Content für neue Sprache
     */
    createLanguageContent(language, customContent = {}) {
        const baseContent = JSON.parse(JSON.stringify(contentTemplate));
        return {
            ...baseContent,
            ...customContent,
            _meta: {
                language,
                created: new Date().toISOString(),
                version: appVersion
            }
        };
    },

    /**
     * Merge Content mit Fallbacks
     */
    mergeContent(baseContent, fallbackContent) {
        const merged = { ...fallbackContent };

        for (const [key, value] of Object.entries(baseContent)) {
            if (typeof value === 'object' && value !== null) {
                merged[key] = this.mergeContent(value, merged[key] || {});
            } else {
                merged[key] = value;
            }
        }

        return merged;
    },

    /**
     * Get Content mit Fallback
     */
    getContent(content, path, fallback = '') {
        const keys = path.split('.');
        let current = content;

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return fallback;
            }
        }

        return current || fallback;
    }
};
