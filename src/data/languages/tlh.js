// src/data/languages/tlh.js
// Teilweise authentische Klingonisch-Übersetzung

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'tlh',
        name: 'tlhIngan Hol',
        nativeName: 'tlhIngan Hol',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Hoch menu yIpoSmoH',
        closeMainMenu: 'Hoch menu yISoQmoH'
    },
    index: {
        pageTitle: "Emoji muvwI' chenmoHwI'",
        pageDescription:
            "🔑 muvwI'mey chu'moHlu'. 🎯 Qaw'laHbe'bogh emoji muvwI'mey. 🌈 tlhab. Qaw. chu'. 🤖 QInwI' Qaw'laHbe'. 🌍 15+ HolDaq lutu'lu'.",
        pageKeywords: "Keymoji, emoji muvwI', muvwI' chenmoHwI', Qaw, De' Qaw",
        pageInstruction: [
            '"📝 Story" yIclick, AI Emoji lutlIj DalaH 📖',
            '"Random" Qapchu\' 😜.',
            "chenmoHlu'DI', clipboardlIjDaq lanlu'. 📋"
        ],
        backToMainText: "bIrI' yIclick 👇",
        backToMainButtonText: 'HochDaq chegh',
        contactText: "Su'wI' Daghaj, ghap nab QaQ?",
        contactButtonText: 'QIn yIngeH! 💌'
    },
    emojiDisplay: {
        clickToCopy: "yIclick, Enter yInga', emoji muvwI' clipboardDaq lan",
        successMessage: "Qapla'! clipboardDaq lanlu' 💾",
        errorMessage: "Qagh! vay' QIHlu' 🤖",
        dailyLimitReachedMessage: "bup! jaj Hoch QInmey taghpu' 😔",
        successStoryMessage: "Qapla'! emoji lut chenmoHlu' 🤖",
        errorStoryMessage: "Qagh! QIn Hevbe' 🌀",
        emojiDisplayTitle: "Emoji muvwI' chenmoHwI'",
        dataPrivacyProcessingInfo:
            "🚀 Emoji QeD webhooks je AI! ✨ De' rur nanwI' – ratlhbe'.",
        clearButton: '✖️ QIj',
        storyButton: '📝 lut',
        storyButtonClicked: '📩 lut ngeH',
        randomButton: "🎲 SuvwI'",
        placeholderText: "lut yIja', emoji muvwI' vIchenmoH…",
        clipboardError: "Qagh! clipboardDaq lanlaHbe'"
    },
    donateButton: {
        text: "qa'vIn vIneH",
        openText: 'menu yISoQmoH',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'nuqneH, Christopher jIH',
        pageDescription:
            "Frontend chenmoHwI' jIH, JavaScript, PHP, HTML vIlo'. QIn yIngeH!",
        nameLabel: '🧑🏻 ponglIj',
        emailLabel: '📧 QInlIj',
        messageLabel: '✍🏻 QIn',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 QIn yIngeH',
        sendingButton: '📨 QIn lIn',
        successMessage: "Qapla'! QIn ngeHlu' – jang: < 24 rep 🚀",
        errorMessage: "Qagh! QIn QIHlu' 😟",
        requestErrorMessage: "Qagh! QIn ngeHlaHbe', yIretry 🙁",
        smirkingFaceImageAlt: "keymoji emoji QuchHa' 1f60f",
        introductionTitle: "Su'wI' Daghaj, ghap nab QaQ?",
        introductionText: 'QIn yIngeH!',
        privacyNotice: "yIvoq, De'lIj Qaw'lu'be'. QInmeylIj vIpolbe'.",
        newsletterLabel: "HIja', newsletter vIHev vIneH",
        backToMainButton: 'HochDaq chegh',
        footerText: "parmaqmo' Qun",
        validationErrorMessage: 'Qagh! QIn Qaghmey yIbuS 🔍',
        sendingMessage: "QIn lInlu'… 📨",
        emailText: {
            greeting: "yI'el",
            intro: "QInlIj vIHevta' 📩!",
            confirmationText:
                "QInlIj yI'olta', Christopher Qaw'laHbe'bot bIjatlhbe'bogh. QInlIj De':",
            doubleCheck: "QInlIj De'vam wIHevta':",
            button: "QInlIj yI'olta'",
            subject: "QInlIj KeymojiDaq Hevlu'pu'",
            privacy: "De'lIj Qaw'lu'be'."
        },
        validation: {
            nameRequired: "pong poQlu'",
            nameLength: "cha' mu' poQlu'",
            emailRequired: "QIn poQlu'",
            emailInvalid: "QIn Qaw'Ha'",
            messageRequired: "QIn poQlu'",
            messageLength: "{min} mu' poQlu'"
        }
    },
    serviceWorker: {
        updateAvailable: "chu' De' lutu'lu'!",
        manualRefreshNeeded: "chu' De' lutu'lu'. yIlo'qa'!",
        updateSuccess: "Qapla'! chu' De' lutu'lu' 🎉"
    },
    notFound: {
        pageTitle: "404 - Daq tu'lu'be'",
        pageDescription: "DaqlIj DaSopbogh tu'lu'be' ghap cheghlu'pu'.",
        message: "Qagh! Daq tu'lu'be' 🚫",
        suggestion:
            "DaqlIj DaSopbogh cheghlu'pu' ghap Qaw'lu'pu' ghap tu'lu'be'.",
        backButton: 'HochDaq chegh',
        contactButton: 'QIn yIngeH',
        navigationTitle: "lutu'lu'bogh Daqmey",
        recentEmojis: "nI' emojimey"
    },
    blog: {
        readMore: "Qay'be' yIlaD",
        backToBlog: 'blogDaq chegh',
        publishedOn: "lutlu'pu'",
        author: "chenmoHwI'",
        tags: 'pIrmey',
        readTime: 'tam yIlaD',
        likes: 'QaQmey',
        share: 'yIlan'
    },
    account: {
        create: 'Account chen',
        manage: 'Account yIlan',
        login: "yI'el",
        logout: 'yIchegh',
        profile: "De'",
        settings: 'lanmey',
        guest: 'QaH',
        free: 'TLHAB',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: "Hoch De'Daq yI'el",
        closeModal: 'modal yISoQmoH',
        openMenu: 'menu yIpoSmoH',
        closeMenu: 'menu yISoQmoH',
        loading: "lInlu'...",
        error: "Qagh QIHlu'",
        success: "Qapla'",
        warning: 'Qagh',
        info: "De'",
        copyToClipboard: 'clipboardDaq yIlan',
        copiedToClipboard: "clipboardDaq lanlu'",
        generatePassword: "muvwI' yIchenmoH",
        clearForm: 'form yIQIj',
        sendMessage: 'QIn yIngeH',
        toggleDarkMode: "QIHmo' yIlan",
        toggleLanguage: 'Hol yIlan'
    },
    validation: {
        required: "De'vam poQlu'",
        email: "QIn Qaw' yIlaD",
        minLength: "{min} mu' poQlu'",
        maxLength: "{max} mu' law'laHbe'",
        invalidFormat: "Qaw'Ha'",
        serverError: 'Qagh! yIretry',
        networkError: 'Qagh! QIn yIlaD'
    },
    versions: {
        pageTitle: "De' chenmoH",
        pageDescription: "Keymoji, emoji muvwI' chenmoHwI' De' chenmoH."
    }
};
