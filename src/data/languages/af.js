// src/data/languages/af.js
// Afrikaans language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'af',
        name: 'Afrikaans',
        nativeName: 'Afrikaans',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Open hoofmenu',
        closeMainMenu: 'Sluit hoofmenu'
    },
    index: {
        pageTitle: 'Emoji Wagwoord Generator',
        pageDescription:
            '🔑 Wagwoorde heruitgevind. 🎯 Onkraakbare emoji wagwoorde. 🌈 Gratis. Veilig. Innoverend. 🤖 AI-weerstandige tegnologie. 🌍 Beskikbaar in 15+ tale.',
        pageKeywords:
            'Keymoji, emoji wagwoord, wagwoord generator, sekuriteit, aanlyn sekuriteit',
        pageInstruction: [
            'Klik "📝 Storie" vir jou AI emoji storie 📖',
            '"Lukraak" spreek vanself 😜.',
            'Na generering word dit na jou knipbord gekopieer! 📋'
        ],
        backToMainText: 'Klik hieronder 👇 om terug te gaan',
        backToMainButtonText: 'Terug na tuisblad',
        contactText: "Het jy 'n vraag of 'n cool voorstel?",
        contactButtonText: "Stuur my 'n boodskap! 💌"
    },
    emojiDisplay: {
        clickToCopy:
            'Klik of druk Enter om die gegenereerde emoji wagwoord na knipbord te kopieer',
        successMessage: 'Sukses, na knipbord gekopieer 💾',
        errorMessage: 'Oeps, iets het verkeerd geloop 🤖',
        dailyLimitReachedMessage:
            'Jammer, daaglikse limiet van versoeke bereik 😔',
        successStoryMessage: 'Sukses, emoji storie gegenereer 🤖',
        errorStoryMessage: 'Fout, geen antwoord van bediener 🌀',
        emojiDisplayTitle: 'Emoji Wagwoord Generator',
        dataPrivacyProcessingInfo:
            '🚀 Emoji magie via webhooks en AI! ✨ Data is soos strand sand - dit bly nie.',
        clearButton: '✖️ Maak skoon',
        storyButton: '📝 Storie',
        storyButtonClicked: '📩 Stuur storie',
        randomButton: '🎲 Lukraak',
        placeholderText:
            "Vertel my 'n storie en ek sal emoji wagwoorde genereer gebaseer daarop...",
        clipboardError: 'Fout by kopiëring na knipbord'
    },
    donateButton: {
        text: "Koop my 'n koffie",
        openText: 'Sluit hierdie spyskaart',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Hallo, ek is Christopher',
        pageDescription:
            "Frontend ontwikkelaar en ek hou daarvan om gebruikersvriendelike webwerwe te ontwerp en te kodeer met JavaScript, PHP en HTML. Moenie huiwer nie en stuur my 'n boodskap as jy wil.",
        nameLabel: '🧑🏻 Jou naam',
        emailLabel: '📧 Jou e-pos',
        messageLabel: '✍🏻 Jou boodskap',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Stuur',
        sendingButton: '📨 Stuur...',
        successMessage: 'Sukses, boodskap gestuur - Antwoord: < 24 uur 🚀',
        errorMessage: "'n Onverwagte fout het voorgekom 😟",
        requestErrorMessage:
            'Fout by die stuur van boodskap, probeer asseblief weer 🙁',
        smirkingFaceImageAlt: 'keymoji emoji grynslag gesig 1f60f',
        introductionTitle: "Het jy 'n vraag of 'n cool voorstel?",
        introductionText: "Stuur my 'n boodskap!",
        privacyNotice:
            'Wees verseker, jou data is in goeie hande by ons 🤲. Jou besonderhede sal nie aan derdes oorgedra word nie 🔒.',
        newsletterLabel: 'Ja, ek wil op die nuusbrief inteken',
        newsletterOptIn: 'Teken in op nuusbrief',
        newsletterText:
            'Bly op datum en teken met vertroue in op die nuusbrief. {privacyPolicy}',
        privacyPolicyLink: 'Bekyk privaatheidsbeleid',
        privacyPolicyUrl: '/privacy-policy',
        backToMainButton: 'Terug na tuisblad',
        footerText: 'Ontwikkel met liefde',
        validationErrorMessage:
            'Los asseblief die vorm foute op voor die stuur 🔍',
        sendingMessage: 'Stuur jou boodskap... 📨',
        emailText: {
            greeting: 'Welkom',
            confirmationText:
                "Bevestig asseblief jou versoek sodat Christopher weet dat jy nie 'n slim bot is nie. Jy het 'n boodskap gestuur met die volgende data:",
            doubleCheck:
                'Ons het jou boodskap ontvang met die volgende besonderhede:',
            button: 'Bevestig jou e-pos'
        },
        validation: {
            nameRequired: 'Naam benodig',
            nameLength: 'Minimum 2 karakters',
            emailRequired: 'E-pos benodig',
            emailInvalid: 'Ongeldige e-pos',
            messageRequired: 'Boodskap benodig',
            messageLength: 'Minimum {min} karakters'
        }
    },
    serviceWorker: {
        updateAvailable: "'n Nuwe weergawe is beskikbaar!",
        manualRefreshNeeded:
            'Nuwe weergawe geaktiveer. Herlaai nou vir die nuutste funksies.',
        updateSuccess: 'App suksesvol opgedateer! 🎉'
    },
    notFound: {
        message: 'Oeps! Bladsy nie gevind nie 🚫',
        backButton: 'Terug na tuisblad',
        contactButton: 'Kontak ons'
    },
    blog: {
        readMore: 'Lees meer',
        backToBlog: 'Terug na blog',
        publishedOn: 'Gepubliseer op',
        author: 'Outeur',
        tags: 'Merkers',
        readTime: 'min leestyd',
        likes: 'hou van',
        share: 'Deel'
    },
    account: {
        create: 'Skep rekening',
        manage: 'Bestuur rekening',
        login: 'Teken in',
        logout: 'Teken uit',
        profile: 'Profiel',
        settings: 'Instellings',
        guest: 'Gas',
        free: 'GRATIS',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Spring na hoofinhoud',
        closeModal: 'Sluit modal',
        openMenu: 'Open spyskaart',
        closeMenu: 'Sluit spyskaart',
        loading: 'Laai...',
        error: 'Fout voorgekom',
        success: 'Sukses',
        warning: 'Waarskuwing',
        info: 'Inligting',
        copyToClipboard: 'Kopieer na knipbord',
        copiedToClipboard: 'Na knipbord gekopieer',
        generatePassword: 'Genereer wagwoord',
        clearForm: 'Maak vorm skoon',
        sendMessage: 'Stuur boodskap',
        toggleDarkMode: 'Wissel donker modus',
        toggleLanguage: 'Wissel taal'
    },
    validation: {
        required: 'Hierdie veld is benodig',
        email: "Voer asseblief 'n geldige e-pos adres in",
        minLength: 'Moet ten minste {min} karakters bevat',
        maxLength: 'Mag nie meer as {max} karakters hê nie',
        invalidFormat: 'Ongeldige formaat',
        serverError: 'Bediener fout, probeer asseblief weer',
        networkError: 'Netwerk fout, kontroleer jou verbinding'
    },

    // UserSettings vertalings
    userSettings: {
        // Basiese instellings
        basicSettings: {
            title: 'Basiese instellings',
            description: 'Taal, tema en kennisgewings',
            language: {
                label: 'Taal',
                description: 'Kies jou voorkeur taal',
                options: {
                    en: '🇺🇸 Engels',
                    de: '🇩🇪 Duits',
                    fr: '🇫🇷 Frans',
                    es: '🇪🇸 Spaans',
                    af: '🇿🇦 Afrikaans'
                }
            },
            theme: {
                label: 'Tema',
                description: 'Kies jou visuele tema',
                options: {
                    auto: '🔄 Outomaties',
                    light: '☀️ Lig',
                    dark: '🌙 Donker'
                }
            },
            notifications: {
                label: 'Kennisgewings',
                description: 'Ontvang belangrike opdaterings'
            }
        },

        // Sekuriteit instellings
        securitySettings: {
            title: 'Sekuriteit instellings',
            description: 'Wagwoord sterkte en karakter tipes',
            passwordLength: {
                label: 'Wagwoord lengte',
                description: 'Kies wagwoord sterkte',
                min: 'Swak (6)',
                max: 'Sterk (20)'
            },
            includeNumbers: {
                label: 'Sluit nommers in',
                description: 'Voeg numeriese karakters by (0-9)'
            },
            includeSymbols: {
                label: 'Sluit simbole in',
                description: 'Voeg spesiale karakters by (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Sluit spesiale karakters in',
                description: 'Voeg uitgebreide spesiale karakters by'
            },
            excludeSimilarChars: {
                label: 'Sluit soortgelyke karakters uit',
                description: 'Vermy verwarrende karakters (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Unieke karakters benodig',
                description: 'Geen herhaalde karakters in wagwoord nie'
            }
        },

        // Emoji instellings
        emojiSettings: {
            title: 'Emoji instellings',
            description: 'Emoji aantal, kategorieë en patrone',
            emojiCount: {
                label: 'Emoji aantal',
                description: "Aantal emoji's in wagwoord",
                min: 'Min (3)',
                max: 'Maks (10)'
            },
            emojiPattern: {
                label: 'Emoji patroon',
                description: 'Kies emoji rangskikking',
                options: {
                    random: 'Lukraak',
                    sequential: 'Opeenvolgend',
                    alternating: 'Afwisselend'
                }
            },
            emojiTheme: {
                label: 'Emoji tema',
                description: 'Kies emoji styl',
                options: {
                    mixed: 'Gemeng',
                    cute: 'Oulik',
                    professional: 'Professioneel',
                    fantasy: 'Fantasie'
                }
            }
        },

        // Generering instellings
        generationSettings: {
            title: 'Generering instellings',
            description: 'Outomatiese generering en knipbord opsies',
            autoGenerate: {
                label: 'Outomatiese generering',
                description: 'Genereer wagwoorde outomaties'
            },
            copyToClipboard: {
                label: 'Kopieer na knipbord',
                description: 'Kopieer gegenereerde wagwoorde outomaties'
            },
            showStrength: {
                label: 'Wys sterkte',
                description: 'Wys wagwoord sterkte meter'
            },
            strengthThreshold: {
                label: 'Sterkte drempel',
                description: 'Minimum benodigde wagwoord sterkte',
                options: {
                    low: 'Laag',
                    medium: 'Medium',
                    high: 'Hoog'
                }
            },
            autoRefresh: {
                label: 'Outomatiese verfris',
                description: 'Genereer swak wagwoorde outomaties weer'
            }
        },

        // Privaatheid instellings
        privacySettings: {
            title: 'Privaatheid instellings',
            description: 'Data versameling en deel voorkeure',
            saveHistory: {
                label: 'Stoor geskiedenis',
                description: 'Stoor gegenereerde wagwoorde plaaslik'
            },
            analytics: {
                label: 'Analitika',
                description: 'Anonieme gebruik statistieke'
            },
            shareUsage: {
                label: 'Deel gebruik',
                description: 'Deel gebruik data vir verbeterings'
            },
            exportHistory: {
                label: 'Eksporteer geskiedenis',
                description: 'Eksporteer wagwoord geskiedenis na lêer'
            },
            backupSettings: {
                label: 'Backup instellings',
                description: 'Backup instellings outomaties'
            }
        },

        // Pro funksies
        proFeatures: {
            title: 'Pro funksies',
            description: 'Gevorderde instellings en premium funksies',
            securityAudit: {
                label: 'Sekuriteit oudit',
                description: 'Omvattende sekuriteit analise',
                buttonText: 'Voer oudit uit'
            },
            breachCheck: {
                label: 'Oortreding kontrole',
                description: 'Kontroleer wagwoorde teen bekende oortredings'
            },
            strengthAnalytics: {
                label: 'Sterkte analitika',
                description: 'Gevorderde wagwoord sterkte analise'
            }
        }
    },

    // Rekeningkunde en sekuriteit
    accounting: {
        // Intekening en verifikasie
        login: {
            title: 'Teken in',
            emailPlaceholder: 'Voer jou e-pos adres in',
            magicLinkSent: 'Magic skakel gestuur!',
            magicLinkError: 'Fout by die stuur van magic skakel',
            verificationSuccess: 'E-pos suksesvol geverifieer!',
            verificationError: 'E-pos verifikasie het misluk',
            rateLimitExceeded: 'Te veel inteken pogings. Wag asseblief.',
            sessionExpired: 'Sessie verval. Teken asseblief weer in.'
        },

        // Rekening bestuur
        account: {
            title: 'Rekening bestuur',
            profile: 'Profiel',
            settings: 'Instellings',
            logout: 'Teken uit',
            logoutSuccess: 'Suksesvol uitgeken',
            accountCreated: 'Rekening suksesvol geskep',
            accountUpdated: 'Rekening suksesvol opgedateer',
            accountError: 'Fout by rekening bestuur'
        },

        // Sekuriteit gebeure
        security: {
            loginAttempt: 'Inteken poging',
            loginSuccess: 'Suksesvolle intekening',
            loginFailed: 'Intekening het misluk',
            logout: 'Uitkening',
            sessionExpired: 'Sessie verval',
            suspiciousActivity: 'Verdagte aktiwiteit',
            verificationSuccess: 'Verifikasie suksesvol',
            verificationFailed: 'Verifikasie het misluk',
            accountCreated: 'Rekening geskep',
            accountUpdated: 'Rekening opgedateer',
            securityAudit: 'Sekuriteit oudit uitgevoer'
        },

        // Validasie
        validation: {
            required: 'Hierdie veld is benodig',
            emailInvalid: "Voer asseblief 'n geldige e-pos adres in",
            urlInvalid: "Voer asseblief 'n geldige URL in",
            phoneInvalid: "Voer asseblief 'n geldige telefoon nommer in",
            passwordWeak:
                'Wagwoord moet ten minste 8 karakters bevat met hoofletters, kleinletters en nommers',
            minLength: 'Minimum lengte is {min} karakters',
            maxLength: 'Maksimum lengte is {max} karakters',
            minValue: 'Minimum waarde is {min}',
            maxValue: 'Maksimum waarde is {max}',
            validInput: 'Geldige inset'
        },

        // Konteks spyskaart
        contextMenu: {
            exportSettings: 'Eksporteer instellings',
            importSettings: 'Importeer instellings',
            resetToDefault: 'Herstel na verstek',
            proMessage:
                '💎 Pro gebruikers kan hul instellings eksporteer en importeer'
        }
    },

    // Modals en kennisgewings
    modals: {
        success: 'Sukses',
        error: 'Fout',
        warning: 'Waarskuwing',
        info: 'Inligting',
        confirm: 'Bevestig',
        cancel: 'Kanselleer',
        close: 'Sluit',
        loading: 'Laai...',
        saving: 'Stoor...',
        exporting: 'Eksporteer...',
        importing: 'Importeer...',
        resetting: 'Herstel...'
    },

    versions: {
        pageTitle: 'Weergawe Geskiedenis',
        pageDescription:
            'Kyk na die ontwikkelingsgeskiedenis en verandering log van Keymoji, die emoji wagwoord generator.'
    },

    // AccountManager vertalings
    accountManager: {
        // Bladsy titels en beskrywings
        pageTitle: 'Rekening Bestuurder',
        pageDescription:
            'Bestuur jou sekuriteit instellings en rekening voorkeure',
        welcomeBack: 'Welkom terug, {name}! 👋',
        welcomeDescription:
            'Gereed om wonderlike emoji wagwoorde te skep? Jou rekening is veilig en gereed!',
        returnUserTitle: '👋 Welkom terug!',
        returnUserDescription:
            'Ons het jou e-pos adres herken. Teken vinnig in.',
        verificationTitle: '📧 Kontroleer jou e-pos en verifieer',
        verificationDescription:
            'Kontroleer jou e-pos {email} en klik die magic skakel om opstelling te voltooi',
        verifyingTitle: '🔗 Magic Skakel Verifiseer...',
        verifyingDescription:
            'Wag asseblief terwyl ons jou rekening verifieer.',
        verificationErrorTitle: '❌ Verifikasie het misluk',
        verificationErrorDescription: "'n Fout het voorgekom.",

        // Knoppies en aksies
        buttons: {
            createMagicLink: 'Skep Magic Skakel',
            loginToAccount: 'Teken in by Rekening',
            checkAccountExists: 'Kontroleer rekening...',
            sendingMagicLink: 'Stuur Magic Skakel...',
            accountExists: 'Rekening gevind - Teken in...',
            accountNotFound: 'Rekening nie gevind nie - Skep...',
            sessionExpired: 'Sessie verval - Teken weer in',
            loginAgain: '🔐 Teken weer in',
            createNewAccount: 'Skep nuwe rekening',
            resendMagicLink: '🔄 Stuur Magic Skakel weer',
            backToAccountOptions: '← Terug na Rekening Opsies',
            addProfile: 'Voeg by',
            hideProfile: 'Versteek',
            profileData: 'Profiel Data',
            showFullForm: 'Wys volledige vorm',
            compactView: 'Kompakte aansig'
        },

        // Vorm etikette
        emailLabel: 'E-pos',
        nameLabel: 'Naam',

        // Aksies
        actions: {
            saveSettings: '💾 Stoor Instellings',
            backToHome: '🏠 Terug na Tuisblad',
            skipAccount: '❌ Slaan {type} oor',
            createAccount: '🚀 Skep {type} Rekening',
            settingsSaved: 'Instellings suksesvol gestoor!'
        },

        // Statistieke
        statistics: {
            storiesGenerated: 'Gegenereerde Stories',
            remainingGenerations: 'Oorblywende Generasies'
        },

        // Daaglikse generasies
        dailyGenerations: 'Daaglikse Generasies',

        // Vertoon oorblywende generasies
        remainingDisplay: 'Oorblywend {remaining} / {limit}',

        // Voordele
        benefits: {
            free: {
                dailyGenerations: '5 daaglikse veilige generasies',
                dailyGenerationsDesc: 'AI-weerstandige tegnologie',
                decentralizedData: 'Gedesentraliseerde data verwerking',
                decentralizedDataDesc: 'Jou data bly privaat',
                webApp: 'Beskikbaar as web app',
                webAppDesc: 'Veilige toegang van oral'
            },
            pro: {
                unlimitedGenerations: 'Onbeperkte veilige generasies',
                unlimitedGenerationsDesc: 'Geen daaglikse limiete',
                aiThreatDetection: 'AI-aangedrewe bedreiging opsporing',
                aiThreatDetectionDesc: 'Proaktiewe sekuriteit analise',
                prioritySupport: 'Prioriteit ondersteuning',
                prioritySupportDesc: 'Vinnige hulp met vrae',
                browserExtension: 'Blaaier uitbreiding (Q4 2025)',
                browserExtensionDesc: 'Sekuriteit oral op die web',
                wordpressPlugin: 'WordPress plugin (Q4 2025)',
                wordpressPluginDesc: 'Integreer sekuriteit in jou webwerf'
            }
        },

        // Hulp afdeling
        help: {
            title: '💡 Benodig jy hulp?',
            spamFolder:
                '• Kontroleer jou spam gids as jy nie die e-pos sien nie',
            magicLinkExpiry: '• Magic skakels verval na 15 minute',
            requestNewLink: "• Jy kan enige tyd 'n nuwe skakel aanvra",
            noPassword: '• Geen wagwoord benodig nie - klik net die skakel'
        },

        // Voetstuk
        footer: {
            magicLink: 'Magic skakel',
            instantSetup: 'Oombliklike opstelling',
            noSpam: 'Geen spam',
            text: 'Magic skakels word per e-pos gestuur en is 15 minute geldig.',
            privacy: 'Jou data word veilig verwerk.'
        },

        // Limiete en boodskappe
        canStillGenerate: 'Jy kan steeds emojis genereer!',
        limitReached:
            'Daaglikse limiet bereik. Gradeer op na PRO vir onbeperkte generasies.',

        // Rekening ouderdom
        accountAge: {
            today: 'Vandag geskep',
            yesterday: 'Gister geskep',
            days: 'Sedert {days} dae',
            weeks: 'Sedert {weeks} weke{plural}',
            months: 'Sedert {months} maande{plural}',
            years: 'Sedert {years} jare{plural}',
            accountSince: 'Rekening sedert {days} {unit}',
            since: 'sedert {days} {unit}',
            day: 'dag',
            daysLabel: 'dae',
            accountCreated: 'Rekening geskep'
        },

        // Validasie
        validation: {
            emailInvalid: "Voer asseblief 'n geldige e-pos adres in",
            nameInvalid: 'Voer jou naam in (minimum 2 karakters)'
        },

        // Boodskappe
        messages: {
            settingsReset: 'Instellings herstel na verstek',
            exportFailed: 'Eksport van instellings het misluk',
            settingsExported: 'Instellings suksesvol geëksporteer',
            freeAccountActivated: 'Gratis rekening geaktiveer!'
        },

        // Opgradering afdeling
        upgrade: {
            upgradeToPro: 'Gradeer op na Pro',
            upgradeToProForFeatures:
                'Gradeer op na Pro vir gevorderde funksies',
            unlimitedGenerations:
                'Onbeperkte generasies en gevorderde sekuriteit funksies'
        },

        // Konteks spyskaart
        contextMenu: {
            exportSettings: 'Eksporteer Instellings',
            importSettings: 'Importeer Instellings',
            resetToDefault: 'Herstel na Verstek',
            logout: 'Teken uit',
            settingsMenu: 'Instellings spyskaart'
        },

        // Funksies
        features: {
            proFeature: 'Pro Funksie'
        },

        // Pro Funksie Modal
        proFeatureModal: {
            title: 'Pro Funksie',
            proBenefits: 'Pro Voordele:',
            unlimitedGenerations: 'Onbeperkte emoji generasies',
            advancedSecurity: 'Gevorderde sekuriteit funksies',
            prioritySupport: 'Prioriteit ondersteuning',
            earlyAccess: 'Vroeë toegang tot nuwe funksies',
            maybeLater: 'Miskien later',
            upgradeToPro: 'Gradeer op na Pro',
            // Pro Opgradering spesifiek
            proUpgrade: 'Pro Opgradering',
            unlockAdvancedFeatures:
                'Ontsluit alle gevorderde funksies en instellings',
            upgradeProNow: '💎 Gradeer nou op na Pro'
        },

        // Rekening vlakke
        tiers: {
            free: 'GRATIS',
            pro: 'PRO',
            freeAccount: 'Gratis Rekening',
            proAccount: 'Pro Rekening'
        },

        // Kentekens
        freeBadge: '✨ GRATIS',
        proBadge: '💎 PRO',

        // Beskrywings
        freeDescription: '✨ Gratis Sekuriteit',
        proDescription: '💎 Besigheid Sekuriteit'
    },

    // Algemene UI tekste
    ui: {
        save: 'Stoor',
        cancel: 'Kanselleer',
        reset: 'Herstel',
        export: 'Eksporteer',
        import: 'Importeer',
        delete: 'Verwyder',
        edit: 'Redigeer',
        add: 'Voeg by',
        remove: 'Verwyder',
        search: 'Soek',
        filter: 'Filtreer',
        sort: 'Sorteer',
        refresh: 'Verfris',
        back: 'Terug',
        next: 'Volgende',
        previous: 'Vorige',
        submit: 'Dien in',
        loading: 'Laai...',
        error: 'Fout',
        success: 'Sukses',
        warning: 'Waarskuwing',
        info: 'Inligting'
    }
};
