// src/data/languages/sjn.js
// Teilweise authentische Sindarin-Übersetzung

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'sjn',
        name: 'Sindarin',
        nativeName: 'Sindarin',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Eda i meneg',
        closeMainMenu: 'Drego i meneg'
    },
    index: {
        pageTitle: 'Genedol Lammath Emoji',
        pageDescription:
            '🔑 Lammath gened. 🎯 Lammath emoji ú-thaured. 🌈 Aníron. Dír. Edraith. 🤖 Gûr ú-thaured. 🌍 15+ lamath.',
        pageKeywords: 'Keymoji, emoji lammath, lammath genedol, dír, dír lín',
        pageInstruction: [
            '“📝 Story” teitha, AI Emoji narn lín cenithach 📖',
            '“Random” edregol 😜.',
            'Genedol, i clipboard lín padatha! 📋'
        ],
        backToMainText: 'Teitha dad 👇 an achadad',
        backToMainButtonText: 'Ad dad na home',
        contactText: 'Gerich nathad, egor narn bain?',
        contactButtonText: 'Sen narn lín! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Teitha egor Enter, lammath emoji na clipboard lín padatha',
        successMessage: 'Mae! Na clipboard padannen 💾',
        errorMessage: 'Ú-moe! Gwathren na-den 🤖',
        dailyLimitReachedMessage: 'Goheno, i lim na aníron padannen 😔',
        successStoryMessage: 'Mae! Narn emoji genedol 🤖',
        errorStoryMessage: 'Ú-moe! Ú-anto narn o i server 🌀',
        emojiDisplayTitle: 'Genedol Lammath Emoji',
        dataPrivacyProcessingInfo:
            '🚀 Lammath emoji via webhooks ar AI! ✨ I data boe ú-darthar.',
        clearButton: '✖️ Clir',
        storyButton: '📝 Narn',
        storyButtonClicked: '📩 Narn padannen',
        randomButton: '🎲 Randir',
        placeholderText: 'Narn lín teitha, lammath emoji genithon...',
        clipboardError: 'Ú-moe! Na clipboard padad ú-cheniath'
    },
    donateButton: {
        text: 'Anna nîn bass',
        openText: 'Meneg hebed',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Eneth lín',
        emailLabel: '📧 Lest lín',
        messageLabel: '✍🏻 Narn lín',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Narn padad',
        sendingButton: '📨 Narn padannen...',
        successMessage: 'Mae! Narn padannen – Dangadad: < 24 lûg 🚀',
        errorMessage: 'Ú-moe! Narn ú-padannen 😟',
        requestErrorMessage:
            'Ú-moe! Narn padad ú-cheniath, aníron padad an-uir 🙁',
        smirkingFaceImageAlt: 'keymoji emoji narn lín 1f60f',
        introductionTitle: 'Suilad, Christopher nîn',
        introductionText:
            'Nin eston Frontend genedol, JavaScript, PHP, HTML istathon. Narn lín padad!',
        privacyNotice:
            'Estelio, i data lín ú-darthar. Narn lín ú-aníron padad.',
        newsletterLabel: 'Nae, aníron i narn-lest',
        backToMainButton: 'Ad dad home',
        footerText: 'Na mellyn a meleth',
        validationErrorMessage: 'Ú-moe! Narn lín ú-chebin 🔍',
        sendingMessage: 'Narn padannen... 📨',
        emailText: {
            greeting: 'Suilad',
            intro: 'Narn lín padannen 📩!',
            confirmationText:
                'Narn lín tangadad, Christopher ú-bot nîn. I narn lín:',
            doubleCheck: 'I narn lín henia:',
            button: 'Tangadad narn lín'
        },
        validation: {
            nameRequired: 'Eneth boe',
            nameLength: 'Boe tâd tengwath',
            emailRequired: 'Lest boe',
            emailInvalid: 'Lest ú-chebin',
            messageRequired: 'Narn boe',
            messageLength: '{min} tengwath boe'
        }
    },
    serviceWorker: {
        updateAvailable: 'Narn nîn eden!',
        manualRefreshNeeded: 'Narn nîn eden. Ad dad!',
        updateSuccess: 'Mae! Narn nîn eden 🎉'
    },
    notFound: {
        pageTitle: '404 - Dolen ú-cenath',
        pageDescription: 'I dolen lín ú-cenath egor ú-padannen.',
        message: 'Ú-moe! Dolen ú-cenath 🚫',
        suggestion: 'I dolen lín ú-padannen egor ú-cenath egor ú-istannen.',
        backButton: 'Ad dad na i hened',
        contactButton: 'Narn padad',
        navigationTitle: 'I dolin i cenath',
        recentEmojis: 'I emoji i nîd'
    },
    blog: {
        readMore: 'Cen aníron',
        backToBlog: 'Ad dad na i blog',
        publishedOn: 'Padannen',
        author: 'Genedol',
        tags: 'I tengwath',
        readTime: 'lûg cenad',
        likes: 'I mellyn',
        share: 'Aníron'
    },
    account: {
        create: 'Account genedol',
        manage: 'Account istad',
        login: 'Suilad',
        logout: 'Namárië',
        profile: 'I narn',
        settings: 'I istad',
        guest: 'I hebed',
        free: 'ANÍRON',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Ad dad na i narn',
        closeModal: 'Modal hebed',
        openMenu: 'Meneg eda',
        closeMenu: 'Meneg drego',
        loading: 'Padannen...',
        error: 'Ú-moe istannen',
        success: 'Mae',
        warning: 'Ú-moe',
        info: 'I narn',
        copyToClipboard: 'Na clipboard padad',
        copiedToClipboard: 'Na clipboard padannen',
        generatePassword: 'Lammath genedol',
        clearForm: 'Form clir',
        sendMessage: 'Narn padad',
        toggleDarkMode: 'Môr istad',
        toggleLanguage: 'Lamath istad'
    },
    validation: {
        required: 'I narn boe',
        email: 'Lest chebin boe',
        minLength: '{min} tengwath boe',
        maxLength: '{max} tengwath ú-cheniath',
        invalidFormat: 'Ú-chebin',
        serverError: 'Ú-moe! An-uir',
        networkError: 'Ú-moe! I narn cenad'
    },
    versions: {
        pageTitle: 'I narn genedol',
        pageDescription: 'Keymoji, genedol lammath emoji i narn genedol.'
    }
};
