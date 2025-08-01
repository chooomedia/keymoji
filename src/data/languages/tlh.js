// src/data/languages/tlh.js
// Klingon language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'tlh',
        name: 'Klingon',
        nativeName: 'tlhIngan Hol',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'QIn qun leQ yIpoSmoH',
        closeMainMenu: 'QIn qun leQ yISoQmoH'
    },
    index: {
        pageTitle: "emoji mu'ghom chenwI'",
        pageDescription:
            "mu'ghommey chu'! emoji mu'ghommey Qaw'laHbe'. Hutlh Huch. Qan. chu'. QIn Qaw'laHbe'bogh De'. poSchoH 15 HolmeyDaq.",
        pageKeywords:
            "Keymoji, emoji mu'ghom, mu'ghom chenwI', Qan, De' Qanbogh, De' Qan chu'", // Doppelte Anführungszeichen für gültige Syntax
        pageInstruction: [
            "📝 lut yI'ang, QIn SaghwI' emoji lutlIj HevmeH 📖",
            "Random QIjbe'lu' – Qapchu' 😜.",
            "DachenmoHDI', De' QInlIjDaq pollu'! 📋"
        ],
        backToMainText: "bIruchqa'meH, bIngDaq yI'nga' 👇",
        backToMainButtonText: 'juH wIchegh',
        contactText: "Dap yIghaj'a'? pagh QIn QaQ Daghaj'a'?",
        contactButtonText: 'QIn yIngeH! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            "QIn yInga' pagh Enter yI'uy, emoji mu'ghom chenbogh QInlIjDaq yIlan",
        successMessage: "Qapla'! QInlIjDaq lanlu' 💾",
        errorMessage: "Qagh! vay' Qapbe' 🤖",
        dailyLimitReachedMessage:
            "bItlhutlhta'! jaj HochDaq poQ Qav chavlu' 😔",
        successStoryMessage: "Qapla'! emoji lut chenmoHlu' 🤖",
        errorStoryMessage: "Qagh! QIn QaywI' jangbe' 🌀",
        emojiDisplayTitle: "emoji mu'ghom chenwI'",
        dataPrivacyProcessingInfo:
            "🚀 emoji 'IDnar QulwI' De' QaywI' je! ✨ De' rur puH nagh – ratlhbe'.",
        clearButton: "✖️ QIjHa'",
        storyButton: '📝 lut',
        storyButtonClicked: '📩 lut yIngeH',
        randomButton: "🎲 SuvwI'",
        placeholderText: "lut yIja', vaj emoji mu'ghommey vIchenmoH",
        clipboardError: "Qagh! QInlIjDaq lanlaHbe'"
    },
    donateButton: {
        text: "HIq HIje'", // "Buy me a drink" (Klingonen trinken lieber Blutwein oder Schnaps)
        openText: "meQwI' Qorwagh yISoQmoH", // "Schließe dieses Fenster" (wörtlich: Schließe das heiße Fenster)
        textMobile: '🍶' // Sake-Flasche als Anspielung auf Alkohol
    },
    // Contact form (optimized for Klingon)
    contactForm: {
        pageTitle: 'nuqneH, jIH Christopher', // "Hallo, ich bin Christopher"
        pageDescription:
            "De'wI' QulwI' jIH 'ej jIQuch QIn QulwI' De' QulwI' je vIchenmoH. bIHeghbe'chugh QIn yIngeH.",
        nameLabel: '🧑🏻 ponglIj',
        emailLabel: "📧 QI'yaH",
        messageLabel: '✍🏻 QInlIj',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 QIn yIngeH',
        sendingButton: "📨 QIn Qanglu'",
        successMessage: "Qapla'! QIn Qanglu' - jang: < 24 rep 🚀",
        errorMessage: "Qagh! vay' Qapbe' 😟",
        requestErrorMessage: "Qagh! QIn QanglaHbe', yIqaSqa' 🙁",
        smirkingFaceImageAlt: "keymoji emoji QuchHa' 1f60f",
        introductionTitle: "Dap yIghaj'a'? pagh QIn QaQ Daghaj'a'?",
        introductionText: 'QIn yIngeH!',
        privacyNotice:
            "yIvoqQo', De'lIj Qanlu'! De'lIj latlhpu'vaD Qangbe'lu'. 🔒",
        newsletterLabel: "HIja', jIH nuqneH newsletter yIlan",
        newsletterOptIn: 'Newsletter yIlan',
        newsletterText: "Qanglu' 'ej newsletter yIlan. {privacyPolicy}",
        privacyPolicyLink: "De' polchu'ghach yIlan",
        privacyPolicyUrl: '/privacy-policy',
        backToMainButton: 'juH wIchegh',
        footerText: "parmaqmo' QulwI' Qun",
        validationErrorMessage: "Qagh! QIn QulwI' Qaghmey yIbachqa' 🔍",
        sendingMessage: "QInlIj Qanglu'... 📨",
        emailText: {
            greeting: "yI'el",
            confirmationText:
                "QInlIj yI'ach, vaj Christopher Sovbe' QInwI' SuvwI' SoHbe'. QInlIj De'vam DangeH:",
            doubleCheck: "QInlIj De'vam wIHevpu':",
            button: "QI'yaH yI'ach",
            subject: "QInlIj Keymoji Hevpu'",
            privacy: "De'lIj Qanlu'."
        },
        validation: {
            nameRequired: "ponglIj poQlu'",
            nameLength: "cha' DeghHomHom poQlu'",
            emailRequired: "QI'yaH poQlu'",
            emailInvalid: "QI'yaH vItlhutlhbe'",
            messageRequired: "QIn poQlu'",
            messageLength: "{min} DeghHomHom poQlu'"
        },
        autoFilledLabel: "QInlIj De' QulwI'vo'"
    },
    serviceWorker: {
        updateAvailable: "chu' De' QulwI' poQlu'!",
        manualRefreshNeeded:
            "chu' De' QulwI' QulmoHlu'. chu' De' QulwI' HevmeH yI'uy.",
        updateSuccess: "QulwI' QulmoHlu'! 🎉"
    },
    notFound: {
        pageTitle: "404 - De' QulwI' Qagh",
        pageDescription: "De' QulwI' SoHvaD Qagh pagh QulwI' chu'lu'.",
        message: "Qagh! De' QulwI' Qagh 🚫",
        suggestion:
            "De' QulwI' SoHvaD QulwI' chu'lu' pagh Qaghlu' pagh Qaghbe'lu'.",
        backButton: 'juH wIchegh',
        contactButton: 'QIn yIngeH',
        navigationTitle: "De' QulwI' poQlu'",
        recentEmojis: "emoji Qaghbe'"
    },
    blog: {
        readMore: 'vaj yIlan',
        backToBlog: 'blog wIchegh',
        publishedOn: "QulmoHlu'",
        author: "QulwI'",
        tags: 'Qagh',
        readTime: 'rep lan',
        likes: 'Quch',
        share: 'Qang'
    },
    account: {
        create: 'Huch Qan chenmoH',
        manage: "Huch Qan QulwI'",
        login: "QIn yI'ang",
        logout: "QIn yIchu'",
        profile: "QulwI'",
        settings: "QulwI'",
        guest: "QInwI'",
        free: 'HUTLH',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: "QIn QulwI' wIchegh",
        closeModal: "meQwI' yISoQmoH",
        openMenu: 'QIn qun yIpoSmoH',
        closeMenu: 'QIn qun yISoQmoH',
        loading: "Qanglu'...",
        error: 'Qagh Qap',
        success: "Qapla'",
        warning: 'Qagh',
        info: "De'",
        copyToClipboard: 'QInlIjDaq yIlan',
        copiedToClipboard: "QInlIjDaq lanlu'",
        generatePassword: "mu'ghom yIchenmoH",
        clearForm: "QIn QulwI' yIQIjHa'",
        sendMessage: 'QIn yIngeH',
        toggleDarkMode: "Qagh QulwI' yIpoSmoH",
        toggleLanguage: 'Hol yIpoSmoH'
    },
    validation: {
        required: "De' QulwI' poQlu'",
        email: "QI'yaH vItlhutlh yI'ang",
        minLength: "{min} DeghHomHom poQlu'",
        maxLength: "{max} DeghHomHom Qaw'laHbe'",
        invalidFormat: "Qagh QulwI'",
        serverError: "QaywI' Qagh, yIqaSqa'",
        networkError: "De' Qagh, QInlIj yIlan"
    },
    versions: {
        pageTitle: "De' QulwI' lut",
        pageDescription:
            "Keymoji De' QulwI' lut 'ej emoji mu'ghom chenwI' De' QulwI' lut."
    },

    // UserSettings translations
    userSettings: {
        // Basic settings
        basicSettings: {
            title: "QulwI' QulwI'",
            description: "Hol, QulwI' 'ej QIn",
            language: {
                label: 'Hol',
                description: "Hol SoHvaD QulwI' yI'ang",
                options: {
                    en: '🇺🇸 English',
                    de: '🇩🇪 German',
                    fr: '🇫🇷 French',
                    es: '🇪🇸 Spanish'
                }
            },
            theme: {
                label: "QulwI'",
                description: "QulwI' SoHvaD QulwI' yI'ang",
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Light',
                    dark: '🌙 Dark'
                }
            },
            notifications: {
                label: 'QIn',
                description: "QIn poQlu' Hev"
            }
        },

        // Security settings
        securitySettings: {
            title: "Qan QulwI'",
            description: "mu'ghom Qan 'ej DeghHomHom QulwI'",
            passwordLength: {
                label: "mu'ghom DeghHomHom",
                description: "mu'ghom Qan yI'ang",
                min: 'Qagh (6)',
                max: 'Qan (20)'
            },
            includeNumbers: {
                label: "mI' yIlan",
                description: "mI' DeghHomHom yIlan (0-9)"
            },
            includeSymbols: {
                label: 'Qagh yIlan',
                description: 'Qagh DeghHomHom yIlan (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Qagh DeghHomHom yIlan',
                description: 'Qagh DeghHomHom yIlan'
            },
            excludeSimilarChars: {
                label: "Qagh Qagh yIlanbe'",
                description: "Qagh Qagh yIlanbe' (l, 1, I)"
            },
            requireUniqueChars: {
                label: 'Qagh Qagh yIlan',
                description: "mu'ghomDaq Qagh Qagh yIlanbe'"
            }
        },

        // Emoji settings
        emojiSettings: {
            title: "emoji QulwI'",
            description: "emoji mI', QulwI' 'ej QulwI'",
            emojiCount: {
                label: "emoji mI'",
                description: "emoji mI' mu'ghomDaq",
                min: 'Qagh (3)',
                max: 'Qan (10)'
            },
            emojiPattern: {
                label: "emoji QulwI'",
                description: "emoji QulwI' yI'ang",
                options: {
                    random: "SuvwI'",
                    sequential: "QulwI'",
                    alternating: "QulwI'"
                }
            },
            emojiTheme: {
                label: "emoji QulwI'",
                description: "emoji QulwI' yI'ang",
                options: {
                    mixed: 'Qagh',
                    cute: 'Quch',
                    professional: "QulwI'",
                    fantasy: "QulwI'"
                }
            }
        },

        // Generation settings
        generationSettings: {
            title: "chenmoH QulwI'",
            description: "chenmoH QulwI' 'ej QIn QulwI'",
            autoGenerate: {
                label: 'chenmoH',
                description: "mu'ghommey chenmoH"
            },
            copyToClipboard: {
                label: 'QInlIjDaq yIlan',
                description: "mu'ghommey chenbogh QInlIjDaq yIlan"
            },
            showStrength: {
                label: 'Qan yIlan',
                description: "mu'ghom Qan yIlan"
            },
            strengthThreshold: {
                label: "Qan QulwI'",
                description: "mu'ghom Qan poQlu'",
                options: {
                    low: 'Qagh',
                    medium: "QulwI'",
                    high: 'Qan'
                }
            },
            autoRefresh: {
                label: "QulwI'",
                description: "mu'ghommey Qagh chenmoH"
            }
        },

        // Privacy settings
        privacySettings: {
            title: "Qan QulwI'",
            description: "De' QulwI' 'ej Qang QulwI'",
            saveHistory: {
                label: 'lut yIlan',
                description: "mu'ghommey chenbogh lut yIlan"
            },
            analytics: {
                label: "De'",
                description: "De' QulwI'"
            },
            shareUsage: {
                label: 'Qang',
                description: "De' QulwI' Qang"
            },
            exportHistory: {
                label: 'lut yIlan',
                description: "mu'ghommey chenbogh lut yIlan"
            },
            backupSettings: {
                label: "QulwI' yIlan",
                description: "QulwI' yIlan"
            }
        },

        // Pro features
        proFeatures: {
            title: "PRO QulwI'",
            description: "QulwI' QulwI' 'ej QulwI' QulwI'",
            securityAudit: {
                label: "Qan QulwI'",
                description: "Qan QulwI'",
                buttonText: "Qan QulwI' yI'ang"
            },
            breachCheck: {
                label: "Qagh QulwI'",
                description: "mu'ghommey Qagh QulwI'"
            },
            strengthAnalytics: {
                label: "Qan De'",
                description: "mu'ghom Qan De'"
            }
        }
    },

    // Accounting and security
    accounting: {
        // Login and authentication
        login: {
            title: "QIn yI'ang",
            emailPlaceholder: "QI'yaH yI'ang",
            magicLinkSent: "maH 'IDnar Qanglu'!",
            magicLinkError: "maH 'IDnar QanglaHbe'",
            verificationSuccess: "QI'yaH QulmoHlu'!",
            verificationError: "QI'yaH QulmoHlaHbe'",
            rateLimitExceeded: "QIn QanglaHbe'. yIvoqQo'.",
            sessionExpired: "QIn Qagh. yI'ang."
        },

        // Account management
        account: {
            title: "Huch Qan QulwI'",
            profile: "QulwI'",
            settings: "QulwI'",
            logout: "QIn yIchu'",
            logoutSuccess: "QIn chu'lu'!",
            accountCreated: "Huch Qan chenmoHlu'!",
            accountUpdated: "Huch Qan QulmoHlu'!",
            accountError: 'Huch Qan Qagh'
        },

        // Security events
        security: {
            loginAttempt: "QIn yI'ang",
            loginSuccess: "QIn yI'anglu'",
            loginFailed: "QIn yI'anglaHbe'",
            logout: "QIn yIchu'",
            sessionExpired: 'QIn Qagh',
            suspiciousActivity: "Qagh QulwI'",
            verificationSuccess: "QulmoHlu'",
            verificationFailed: "QulmoHlaHbe'",
            accountCreated: "Huch Qan chenmoHlu'",
            accountUpdated: "Huch Qan QulmoHlu'",
            securityAudit: "Qan QulwI' QulmoHlu'"
        },

        // Validation
        validation: {
            required: "De' QulwI' poQlu'",
            emailInvalid: "QI'yaH vItlhutlh yI'ang",
            urlInvalid: "URL vItlhutlh yI'ang",
            phoneInvalid: "QIn QulwI' vItlhutlh yI'ang",
            passwordWeak: "mu'ghom cha' DeghHomHom poQlu' mI' 'ej DeghHomHom",
            minLength: "DeghHomHom poQlu' {min}",
            maxLength: "DeghHomHom Qaw'laHbe' {max}",
            minValue: "mI' poQlu' {min}",
            maxValue: "mI' Qaw'laHbe' {max}",
            validInput: "QulwI' QulwI'"
        },

        // Context menu
        contextMenu: {
            exportSettings: "QulwI' yIlan",
            importSettings: "QulwI' yIlan",
            resetToDefault: "QulwI' yIlan",
            proMessage: "💎 PRO QInwI' QulwI' yIlan 'ej yIlan"
        }
    },

    // Modals and notifications
    modals: {
        success: "Qapla'",
        error: 'Qagh',
        warning: 'Qagh',
        info: "De'",
        confirm: "yI'ach",
        cancel: "yIchu'",
        close: 'yISoQmoH',
        loading: "Qanglu'...",
        saving: "lanlu'...",
        exporting: "lanlu'...",
        importing: "lanlu'...",
        resetting: "lanlu'..."
    },

    // AccountManager translations
    accountManager: {
        // Page titles and descriptions
        pageTitle: "Huch Qan QulwI'",
        pageDescription: "Huch Qan QulwI' 'ej QulwI' QulwI'",
        welcomeBack: "yI'elqa', {name}! 👋",
        welcomeDescription:
            "emoji mu'ghommey chenmoHmeH DujlIj SuvwI' SoH? HuchlIj Qanlu'pu', bIghoSlaH.",
        returnUserTitle: "👋 yI'elqa'!",
        returnUserDescription: "QI'yaHlIj wIlanpu'. QIn yI'ang.",
        verificationTitle: "📧 QI'yaHlIj yIlan 'ej yI'ach",
        verificationDescription:
            "QI'yaHlIj {email} yIlan 'ej maH 'IDnar yI'ang",
        verifyingTitle: "🔗 maH 'IDnar QulmoHlu'...",
        verifyingDescription: "HuchlIj QulmoHmeH yIvoqQo'.",
        verificationErrorTitle: "❌ QulmoHlaHbe'",
        verificationErrorDescription: 'Qagh Qap.',

        // Buttons and actions
        buttons: {
            createMagicLink: "maH 'IDnar chenmoH",
            loginToAccount: "Huch Qan yI'ang",
            checkAccountExists: "Huch Qan Qanglu'...",
            sendingMagicLink: "Qanglu'...",
            accountExists: "Huch Qan lanpu' - QIn yI'anglu'...",
            accountNotFound: "Huch Qan lanbe' - chenmoHlu'...",
            sessionExpired: "QIn Qagh - yI'ang",
            loginAgain: "🔐 yI'ang",
            createNewAccount: "Huch Qan chu' chenmoH",
            resendMagicLink: "🔄 maH 'IDnar yIngeH",
            backToAccountOptions: "← Huch Qan QulwI' wIchegh",
            addProfile: 'yIlan',
            hideProfile: "yIlanbe'",
            profileData: "QulwI' De'",
            showFullForm: "QIn QulwI' Qan yIlan",
            compactView: "QIn QulwI' Qagh"
        },

        // Form labels
        emailLabel: "QI'yaH",
        nameLabel: 'ponglIj',

        // Actions
        actions: {
            saveSettings: "💾 QulwI' yIlan",
            backToHome: '🏠 juH wIchegh',
            skipAccount: "❌ {type} yIlanbe'",
            createAccount: '🚀 {type} Huch Qan chenmoH',
            settingsSaved: "QulwI' lanlu'!"
        },

        // Statistics
        statistics: {
            storiesGenerated: "lut chenmoHlu'",
            remainingGenerations: 'chenmoHlaH'
        },

        // Daily generations
        dailyGenerations: 'jaj HochDaq chenmoH',

        // Remaining generations display
        remainingDisplay: '{remaining} / {limit} chenmoHlaH',

        // Benefits
        benefits: {
            free: {
                dailyGenerations: 'jaj HochDaq 5 chenmoH',
                dailyGenerationsDesc: "QIn Qaw'laHbe'bogh De'",
                decentralizedData: "De' QulwI'",
                decentralizedDataDesc: "De'lIj Qanlu'",
                webApp: "De' QulwI' poQlu'",
                webAppDesc: "Qan QIn QulwI'"
            },
            pro: {
                unlimitedGenerations: "chenmoHlaHbe'",
                unlimitedGenerationsDesc: "jaj HochDaq Qaw'laHbe'",
                aiThreatDetection: "QIn Qaw'laHbe'bogh De'",
                aiThreatDetectionDesc: "Qan QulwI'",
                prioritySupport: "QIn QulwI'",
                prioritySupportDesc: "QIn QulwI'",
                browserExtension: "De' QulwI' (Q4 2025)",
                browserExtensionDesc: "Qan QIn QulwI'",
                wordpressPlugin: "WordPress QulwI' (Q4 2025)",
                wordpressPluginDesc: "Qan QIn QulwI'"
            }
        },

        // Help section
        help: {
            title: "💡 QIn yIghaj'a'?",
            spamFolder: "• QIn QulwI' yIlan",
            magicLinkExpiry: "• maH 'IDnar 15 rep Qaw'laH",
            requestNewLink: "• maH 'IDnar chu' yIngeH",
            noPassword: "• mu'ghom poQbe' - maH 'IDnar yI'ang"
        },

        // Footer
        footer: {
            magicLink: "maH 'IDnar",
            instantSetup: "QulwI' QulwI'",
            noSpam: "QIn QulwI' Qaw'laHbe'",
            text: "maH 'IDnar QI'yaH Qanglu' 'ej 15 rep Qaw'laH.",
            privacy: "De'lIj Qanlu'."
        },

        // Limits and messages
        canStillGenerate: 'emoji DachenmoHlaHtaH!',
        limitReached: "jaj HochDaq Qav. PRO Dalo'chugh, chenmoHlaHbe'.",

        // Account age
        accountAge: {
            today: "chenmoHlu'",
            yesterday: "chenmoHlu'",
            days: 'jaj {days}',
            weeks: 'jaj {weeks}',
            months: 'jar {months}',
            years: 'DIS {years}',
            accountSince: 'Huch Qan {days} {unit}',
            since: '{days} {unit}',
            day: 'jaj',
            daysLabel: 'jaj',
            accountCreated: "Huch Qan chenmoHlu'"
        },

        // Validation
        validation: {
            emailInvalid: "QI'yaH vItlhutlh yI'ang",
            nameInvalid: "ponglIj yI'ang (cha' DeghHomHom poQlu')"
        },

        // Messages
        messages: {
            settingsReset: "QulwI' lanlu'",
            exportFailed: "QulwI' lanlaHbe'",
            settingsExported: "QulwI' lanlu'!",
            freeAccountActivated: "Hutlh Huch Qan QulmoHlu'!"
        },

        // Upgrade section
        upgrade: {
            upgradeToPro: "PRO Dalo'",
            upgradeToProForFeatures: "PRO QulwI' HevmeH PRO Dalo'",
            unlimitedGenerations: "chenmoHlaHbe' 'ej Qan QulwI'"
        },

        // Context menu
        contextMenu: {
            exportSettings: "QulwI' yIlan",
            importSettings: "QulwI' yIlan",
            resetToDefault: "QulwI' yIlan",
            logout: "QIn yIchu'",
            settingsMenu: "QulwI' qun"
        },

        // Features
        features: {
            proFeature: "PRO QulwI'"
        },

        // Pro Feature Modal
        proFeatureModal: {
            title: "PRO QulwI'",
            proBenefits: "PRO QulwI':",
            unlimitedGenerations: "emoji chenmoHlaHbe'",
            advancedSecurity: "Qan QulwI'",
            prioritySupport: "QIn QulwI'",
            earlyAccess: "QulwI' QulwI'",
            maybeLater: 'Qagh',
            upgradeToPro: "PRO Dalo'",
            // Pro Upgrade specific
            proUpgrade: "PRO Dalo'",
            unlockAdvancedFeatures: "QulwI' QulwI' 'ej QulwI' QulwI'",
            upgradeProNow: "💎 PRO Dalo'"
        },

        // Account tiers
        tiers: {
            free: 'HUTLH',
            pro: 'PRO',
            freeAccount: 'Hutlh Huch Qan',
            proAccount: 'PRO Huch Qan'
        },

        // Badges
        freeBadge: '✨ HUTLH',
        proBadge: '💎 PRO',

        // Descriptions
        freeDescription: '✨ Hutlh Qan',
        proDescription: "💎 Qan QulwI'"
    },

    // General UI texts
    ui: {
        save: 'yIlan',
        cancel: "yIchu'",
        reset: 'yIlan',
        export: 'yIlan',
        import: 'yIlan',
        delete: "yIQIjHa'",
        edit: 'yIlan',
        add: 'yIlan',
        remove: "yIQIjHa'",
        search: 'yIlan',
        filter: 'yIlan',
        sort: 'yIlan',
        refresh: 'yIlan',
        back: 'wIchegh',
        next: 'yIlan',
        previous: 'wIchegh',
        submit: 'yIlan',
        loading: "Qanglu'...",
        error: 'Qagh',
        success: "Qapla'",
        warning: 'Qagh',
        info: "De'"
    }
};
