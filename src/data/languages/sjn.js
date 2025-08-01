// src/data/languages/sjn.js
// Sindarin language content

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
        openMainMenu: 'Agor hen menu',
        closeMainMenu: 'Naw hen menu'
    },
    index: {
        pageTitle: 'Echad i gwedh emoji',
        pageDescription:
            "Gwedh chu'! Emoji gwedh ú-dagor. Hutlh. Thand. Chu'. Echad ú-dagor. PoSchoH 15 lammath.",
        pageKeywords:
            "Keymoji, emoji gwedh, gwedh echad, thand, De' thand, De' thand chu'",
        pageInstruction: [
            '"📝 Narn" yI\'ang, echad i narn emoji lín 📖',
            '"Random" ú-echad – Qapchu\' 😜.',
            "Echadlu'DI', De' línDaq pollu'! 📋"
        ],
        backToMainText: "bIruchqa'meH, bIngDaq yI'nga' 👇",
        backToMainButtonText: 'Ad na bar',
        contactText: "Dap yIghaj'a'? pagh QIn QaQ Daghaj'a'?",
        contactButtonText: 'Erio i peth! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            "Erio pagh Enter yI'uy, emoji gwedh echbogh De' línDaq yIlan",
        successMessage: "Qapla'! De' línDaq lanlu' 💾",
        errorMessage: "Qagh! vay' Qapbe' 🤖",
        dailyLimitReachedMessage:
            "bItlhutlhta'! jaj HochDaq poQ Qav chavlu' 😔",
        successStoryMessage: "Qapla'! emoji narn echadlu' 🤖",
        errorStoryMessage: "Qagh! QIn QaywI' jangbe' 🌀",
        emojiDisplayTitle: 'Echad i gwedh emoji',
        dataPrivacyProcessingInfo:
            "🚀 emoji 'IDnar QulwI' De' QaywI' je! ✨ De' rur puH nagh – ratlhbe'.",
        clearButton: "✖️ QIjHa'",
        storyButton: '📝 Narn',
        storyButtonClicked: '📩 Narn yIngeH',
        randomButton: "🎲 SuvwI'",
        placeholderText: "Narn yIja', vaj emoji gwedh vIechad",
        clipboardError: "Qagh! De' línDaq lanlaHbe'"
    },
    donateButton: {
        text: "HIq HIje'", // "Buy me a drink" (Elben trinken lieber Wein oder Met)
        openText: "meQwI' Qorwagh yISoQmoH", // "Schließe dieses Fenster" (wörtlich: Schließe das heiße Fenster)
        textMobile: '🍷' // Wein-Glas als Anspielung auf Elbische Getränke
    },
    // Contact form (optimized for Sindarin)
    contactForm: {
        pageTitle: 'Suilad, im Christopher', // "Hallo, ich bin Christopher"
        pageDescription:
            "Echad i De' QulwI' jIH 'ej jIQuch QIn QulwI' De' QulwI' je vIchenmoH. bIHeghbe'chugh QIn yIngeH.",
        nameLabel: '🧑🏻 i eneth lín',
        emailLabel: '📧 i epist lín',
        messageLabel: '✍🏻 i peth lín',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Erio',
        sendingButton: '📨 Erio...',
        successMessage: "Qapla'! QIn Qanglu' - jang: < 24 rep 🚀",
        errorMessage: "Qagh! vay' Qapbe' 😟",
        requestErrorMessage: "Qagh! QIn QanglaHbe', yIqaSqa' 🙁",
        smirkingFaceImageAlt: "keymoji emoji QuchHa' 1f60f",
        introductionTitle: "Dap yIghaj'a'? pagh QIn QaQ Daghaj'a'?",
        introductionText: 'Erio i peth!',
        privacyNotice:
            "yIvoqQo', De'lIj Qanlu'! De'lIj latlhpu'vaD Qangbe'lu'. 🔒",
        newsletterLabel: 'Aníron, nín gwedh i narn-lîn',
        newsletterOptIn: 'Gwedh i narn-lîn',
        newsletterText: 'No veren a tiro i narn-lîn lín. {privacyPolicy}',
        privacyPolicyLink: 'Tiro i polith naid',
        privacyPolicyUrl: '/privacy-policy',
        backToMainButton: 'Ad na bar',
        footerText: "parmaqmo' QulwI' Qun",
        validationErrorMessage: "Qagh! QIn QulwI' Qaghmey yIbachqa' 🔍",
        sendingMessage: "QInlIj Qanglu'... 📨",
        emailText: {
            greeting: "yI'el",
            confirmationText:
                "QInlIj yI'ach, vaj Christopher Sovbe' QInwI' SuvwI' SoHbe'. QInlIj De'vam DangeH:",
            doubleCheck: "QInlIj De'vam wIHevpu':",
            button: "i epist yI'ach",
            subject: "i peth lín Keymoji Hevpu'",
            privacy: "De'lIj Qanlu'."
        },
        validation: {
            nameRequired: 'i eneth hiruva',
            nameLength: "cha' DeghHomHom poQlu'",
            emailRequired: 'i epist hiruva',
            emailInvalid: 'i epist ú-valid',
            messageRequired: 'i peth hiruva',
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
        backButton: 'Ad na bar',
        contactButton: 'Erio i peth',
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
        copyToClipboard: "De' línDaq yIlan",
        copiedToClipboard: "De' línDaq lanlu'",
        generatePassword: 'gwedh yIechad',
        clearForm: "QIn QulwI' yIQIjHa'",
        sendMessage: 'Erio i peth',
        toggleDarkMode: "Qagh QulwI' yIpoSmoH",
        toggleLanguage: 'lammath yIpoSmoH'
    },
    validation: {
        required: "De' QulwI' poQlu'",
        email: "i epist vItlhutlh yI'ang",
        minLength: "{min} DeghHomHom poQlu'",
        maxLength: "{max} DeghHomHom Qaw'laHbe'",
        invalidFormat: "Qagh QulwI'",
        serverError: "QaywI' Qagh, yIqaSqa'",
        networkError: "De' Qagh, QInlIj yIlan"
    },

    // UserSettings translations
    userSettings: {
        // Basic settings
        basicSettings: {
            title: "QulwI' QulwI'",
            description: "lammath, QulwI' 'ej QIn",
            language: {
                label: 'lammath',
                description: "lammath SoHvaD QulwI' yI'ang",
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
            title: "thand QulwI'",
            description: "gwedh thand 'ej DeghHomHom QulwI'",
            passwordLength: {
                label: 'gwedh DeghHomHom',
                description: "gwedh thand yI'ang",
                min: 'Qagh (6)',
                max: 'thand (20)'
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
                description: "gwedhDaq Qagh Qagh yIlanbe'"
            }
        },

        // Emoji settings
        emojiSettings: {
            title: "emoji QulwI'",
            description: "emoji mI', QulwI' 'ej QulwI'",
            emojiCount: {
                label: "emoji mI'",
                description: "emoji mI' gwedhDaq",
                min: 'Qagh (3)',
                max: 'thand (10)'
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
            title: "echad QulwI'",
            description: "echad QulwI' 'ej De' QulwI'",
            autoGenerate: {
                label: 'echad',
                description: 'gwedh echad'
            },
            copyToClipboard: {
                label: "De' línDaq yIlan",
                description: "gwedh echbogh De' línDaq yIlan"
            },
            showStrength: {
                label: 'thand yIlan',
                description: 'gwedh thand yIlan'
            },
            strengthThreshold: {
                label: "thand QulwI'",
                description: "gwedh thand poQlu'",
                options: {
                    low: 'Qagh',
                    medium: "QulwI'",
                    high: 'thand'
                }
            },
            autoRefresh: {
                label: "QulwI'",
                description: 'gwedh Qagh echad'
            }
        },

        // Privacy settings
        privacySettings: {
            title: "thand QulwI'",
            description: "De' QulwI' 'ej Qang QulwI'",
            saveHistory: {
                label: 'lut yIlan',
                description: 'gwedh echbogh lut yIlan'
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
                description: 'gwedh echbogh lut yIlan'
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
                label: "thand QulwI'",
                description: "thand QulwI'",
                buttonText: "thand QulwI' yI'ang"
            },
            breachCheck: {
                label: "Qagh QulwI'",
                description: "gwedh Qagh QulwI'"
            },
            strengthAnalytics: {
                label: "thand De'",
                description: "gwedh thand De'"
            }
        }
    },

    // Accounting and security
    accounting: {
        // Login and authentication
        login: {
            title: "QIn yI'ang",
            emailPlaceholder: "i epist yI'ang",
            magicLinkSent: "maH 'IDnar Qanglu'!",
            magicLinkError: "maH 'IDnar QanglaHbe'",
            verificationSuccess: "i epist QulmoHlu'!",
            verificationError: "i epist QulmoHlaHbe'",
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
            securityAudit: "thand QulwI' QulmoHlu'"
        },

        // Validation
        validation: {
            required: "De' QulwI' poQlu'",
            emailInvalid: "i epist vItlhutlh yI'ang",
            urlInvalid: "URL vItlhutlh yI'ang",
            phoneInvalid: "QIn QulwI' vItlhutlh yI'ang",
            passwordWeak: "gwedh cha' DeghHomHom poQlu' mI' 'ej DeghHomHom",
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
    versions: {
        pageTitle: "De' QulwI' lut",
        pageDescription:
            "Keymoji De' QulwI' lut 'ej emoji gwedh echad De' QulwI' lut."
    },

    // AccountManager translations
    accountManager: {
        // Page titles and descriptions
        pageTitle: "Huch Qan QulwI'",
        pageDescription: "Huch Qan QulwI' 'ej QulwI' QulwI'",
        welcomeBack: "yI'elqa', {name}! 👋",
        welcomeDescription:
            "emoji gwedh chenmoHmeH DujlIj SuvwI' SoH? HuchlIj thandlu'pu', bIghoSlaH.",
        returnUserTitle: "👋 yI'elqa'!",
        returnUserDescription: "i epist lín wIlanpu'. QIn yI'ang.",
        verificationTitle: "📧 i epist lín yIlan 'ej yI'ach",
        verificationDescription:
            "i epist lín {email} yIlan 'ej maH 'IDnar yI'ang",
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
            showFullForm: "QIn QulwI' thand yIlan",
            compactView: "QIn QulwI' Qagh"
        },

        // Form labels
        emailLabel: 'i epist',
        nameLabel: 'i eneth lín',

        // Actions
        actions: {
            saveSettings: "💾 QulwI' yIlan",
            backToHome: '🏠 Ad na bar',
            skipAccount: "❌ {type} yIlanbe'",
            createAccount: '🚀 {type} Huch Qan chenmoH',
            settingsSaved: "QulwI' lanlu'!"
        },

        // Statistics
        statistics: {
            storiesGenerated: "narn chenmoHlu'",
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
                decentralizedDataDesc: "De'lIj thandlu'",
                webApp: "De' QulwI' poQlu'",
                webAppDesc: "thand QIn QulwI'"
            },
            pro: {
                unlimitedGenerations: "chenmoHlaHbe'",
                unlimitedGenerationsDesc: "jaj HochDaq Qaw'laHbe'",
                aiThreatDetection: "QIn Qaw'laHbe'bogh De'",
                aiThreatDetectionDesc: "thand QulwI'",
                prioritySupport: "QIn QulwI'",
                prioritySupportDesc: "QIn QulwI'",
                browserExtension: "De' QulwI' (Q4 2025)",
                browserExtensionDesc: "thand QIn QulwI'",
                wordpressPlugin: "WordPress QulwI' (Q4 2025)",
                wordpressPluginDesc: "thand QIn QulwI'"
            }
        },

        // Help section
        help: {
            title: "💡 QIn yIghaj'a'?",
            spamFolder: "• QIn QulwI' yIlan",
            magicLinkExpiry: "• maH 'IDnar 15 rep Qaw'laH",
            requestNewLink: "• maH 'IDnar chu' yIngeH",
            noPassword: "• gwedh poQbe' - maH 'IDnar yI'ang"
        },

        // Footer
        footer: {
            magicLink: "maH 'IDnar",
            instantSetup: "QulwI' QulwI'",
            noSpam: "QIn QulwI' Qaw'laHbe'",
            text: "maH 'IDnar i epist Qanglu' 'ej 15 rep Qaw'laH.",
            privacy: "De'lIj thandlu'."
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
            emailInvalid: "i epist vItlhutlh yI'ang",
            nameInvalid: "i eneth lín yI'ang (cha' DeghHomHom poQlu')"
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
            unlimitedGenerations: "chenmoHlaHbe' 'ej thand QulwI'"
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
            advancedSecurity: "thand QulwI'",
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
        freeDescription: '✨ Hutlh thand',
        proDescription: "💎 thand QulwI'"
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
