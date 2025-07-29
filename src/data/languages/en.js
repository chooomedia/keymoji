// src/data/languages/en.js
// English language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        created: new Date().toISOString()
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
            '🔑 Passwords reimagined. 🎯 Uncrackable emoji passwords. 🌈 Free. Secure. Innovative. 🤖 AI-resistant technology. 🌍 Available in 15+ languages.',
        pageKeywords:
            'Keymoji, emoji password, password generator, security, online security',
        pageInstruction: [
            'Click "📝 Story" for your AI emoji tale 📖',
            '"Random" is self-explanatory 😜.',
            "After generating, it's saved to your clipboard! 📋"
        ],
        backToMainText: 'Click on below 👇 to get back',
        backToMainButtonText: 'Back to home',
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
            'Tell me a story and I will generate emoji passwords based on it...',
        clipboardError: 'Error copying to clipboard'
    },
    donateButton: {
        text: 'Buy me a coffee',
        openText: 'Close this menu',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: "Hi, i'm Christopher",
        pageDescription:
            "Frontend Developer and i love to design and code userfriendly Websites with JavaScript, PHP and HTML. Don't hesitate and send me a message if you like.",
        nameLabel: '🧑🏻 Your Name',
        emailLabel: '📧 Your Email',
        messageLabel: '✍🏻 Your Message',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Send',
        sendingButton: '📨 Sending...',
        successMessage: 'Success, Message sent - Answer: < 24 hours 🚀',
        errorMessage: 'An unexpected error occurred 😟',
        requestErrorMessage: 'Error sending the message, please try again 🙁',
        smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
        introductionTitle: 'Have a question or a cool suggestion?',
        introductionText: 'Send me a message!',
        privacyNotice:
            'Rest assured, your data is in good hands with us 🤲. Your details will not be passed on to third parties 🔒.',
        newsletterLabel: 'Yes, I would like to subscribe to the newsletter',
        backToMainButton: 'Back to home',
        footerText: 'Developed with love',
        validationErrorMessage:
            'Please fix the form errors before submitting 🔍',
        sendingMessage: 'Sending your message... 📨',
        emailText: {
            greeting: 'Welcome',
            intro: 'Thank you for sending a message 📩!',
            confirmationText:
                'Please confirm your request so that Christopher knows that you are not a smart bot. You sent a message with the following Data:',
            doubleCheck:
                "We've received your message with the following details:",
            button: 'Confirm Your Email',
            subject: 'Your message to Keymoji has been received',
            privacy: 'Your data is handled securely.'
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
    serviceWorker: {
        updateAvailable: 'A new version is available!',
        manualRefreshNeeded:
            'New version activated. Reload now for the latest features.',
        updateSuccess: 'App updated successfully! 🎉'
    },
    notFound: {
        pageTitle: '404 - Page Not Found',
        pageDescription:
            'The page you are looking for does not exist or has been moved.',
        message: 'Oops! Page not found 🚫',
        suggestion:
            'The page you are looking for might have been moved, deleted, or never existed.',
        backButton: 'Go back home',
        contactButton: 'Contact us',
        navigationTitle: 'Available Pages',
        recentEmojis: 'Recent Emojis'
    },
    blog: {
        readMore: 'Read more',
        backToBlog: 'Back to blog',
        publishedOn: 'Published on',
        author: 'Author',
        tags: 'Tags',
        readTime: 'min read',
        likes: 'likes',
        share: 'Share'
    },
    account: {
        create: 'Create Account',
        manage: 'Manage Account',
        login: 'Login',
        logout: 'Logout',
        profile: 'Profile',
        settings: 'Settings',
        guest: 'Guest',
        free: 'FREE',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Skip to main content',
        closeModal: 'Close modal',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        loading: 'Loading...',
        error: 'Error occurred',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        copyToClipboard: 'Copy to clipboard',
        copiedToClipboard: 'Copied to clipboard',
        generatePassword: 'Generate password',
        clearForm: 'Clear form',
        sendMessage: 'Send message',
        toggleDarkMode: 'Toggle dark mode',
        toggleLanguage: 'Toggle language'
    },
    validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: 'Must be at least {min} characters',
        maxLength: 'Must be no more than {max} characters',
        invalidFormat: 'Invalid format',
        serverError: 'Server error, please try again',
        networkError: 'Network error, please check your connection'
    },
    versions: {
        pageTitle: 'Version History',
        pageDescription:
            'Check out the development history and changelog of Keymoji, the emoji password generator.'
    }
};
