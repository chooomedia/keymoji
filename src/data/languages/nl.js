// src/data/languages/nl.js
// Dutch language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'nl',
        name: 'Dutch',
        nativeName: 'Nederlands',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Hoofdmenu openen',
        closeMainMenu: 'Hoofdmenu sluiten'
    },
    index: {
        pageTitle: 'Emoji Wachtwoord Generator',
        pageDescription:
            '🔑 Wachtwoorden heruitgevonden. 🎯 Onkraakbare emoji wachtwoorden. 🌈 Gratis. Veilig. Innovatief. 🤖 AI-resistente technologie. 🌍 Beschikbaar in 15+ talen.',
        pageKeywords:
            'Keymoji, emoji wachtwoord, wachtwoord generator, beveiliging, online beveiliging',
        pageInstruction: [
            'Klik "📝 Verhaal" voor je AI emoji verhaal 📖',
            '"Willekeurig" spreekt voor zich 😜.',
            'Na genereren wordt het gekopieerd naar je klembord! 📋'
        ],
        backToMainText: 'Klik hieronder 👇 om terug te gaan',
        backToMainButtonText: 'Terug naar home',
        contactText: 'Heb je een vraag of een cool voorstel?',
        contactButtonText: 'Stuur me een bericht! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Klik of druk op Enter om het gegenereerde emoji wachtwoord naar klembord te kopiëren',
        successMessage: 'Succes, gekopieerd naar klembord 💾',
        errorMessage: 'Oeps, er ging iets mis 🤖',
        dailyLimitReachedMessage:
            'Sorry, dagelijkse limiet van verzoeken bereikt 😔',
        successStoryMessage: 'Succes, emoji verhaal gegenereerd 🤖',
        errorStoryMessage: 'Fout, geen antwoord van server 🌀',
        emojiDisplayTitle: 'Emoji Wachtwoord Generator',
        dataPrivacyProcessingInfo:
            '🚀 Emoji magie via webhooks en AI! ✨ Data is als strandzand - het blijft niet.',
        clearButton: '✖️ Wissen',
        storyButton: '📝 Verhaal',
        storyButtonClicked: '📩 Verhaal versturen',
        randomButton: '🎲 Willekeurig',
        placeholderText:
            'Vertel me een verhaal en ik genereer emoji wachtwoorden gebaseerd daarop...',
        clipboardError: 'Fout bij kopiëren naar klembord'
    },
    donateButton: {
        text: 'Koop me een koffie',
        openText: 'Dit menu sluiten',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Hallo, ik ben Christopher',
        pageDescription:
            'Frontend-ontwikkelaar en ik hou ervan om gebruiksvriendelijke websites te bouwen met JavaScript, PHP en HTML. Stuur gerust een berichtje als je wilt!',
        nameLabel: '🧑🏻 Jouw naam',
        emailLabel: '📧 Jouw e-mail',
        messageLabel: '✍🏻 Bericht',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Verzenden',
        sendingButton: '📨 Verzenden...',
        successMessage: 'Succes, bericht verzonden - Antwoord: < 24 uur 🚀',
        errorMessage: 'Er is een onverwachte fout opgetreden 😟',
        requestErrorMessage:
            'Fout bij het verzenden van het bericht, probeer het opnieuw 🙁',
        smirkingFaceImageAlt: 'keymoji emoji glimlachend gezicht 1f60f',
        introductionTitle: 'Heb je een vraag of een leuk idee?',
        introductionText: 'Stuur gerust een berichtje!',
        privacyNotice:
            'Je gegevens zijn bij ons in goede handen 🤲. Je gegevens worden niet gedeeld met derden 🔒.',
        newsletterLabel: 'Ja, ik wil de nieuwsbrief ontvangen',
        backToMainButton: 'Terug naar home',
        footerText: 'Met liefde ontwikkeld',
        validationErrorMessage:
            'Corrigeer de fouten in het formulier voor verzending 🔍',
        sendingMessage: 'Je bericht wordt verzonden... 📨',
        emailText: {
            greeting: 'Welkom',
            confirmationText:
                'Bevestig je aanvraag zodat Christopher weet dat je geen slimme bot bent. Je hebt een bericht gestuurd met de volgende gegevens:',
            doubleCheck:
                'We hebben je bericht ontvangen met de volgende details:',
            button: 'Bevestig je e-mail'
        },
        validation: {
            nameRequired: 'Naam is verplicht',
            nameLength: 'Minimaal 2 tekens',
            emailRequired: 'E-mail is verplicht',
            emailInvalid: 'Ongeldig e-mailadres',
            messageRequired: 'Bericht is verplicht',
            messageLength: 'Minimaal {min} tekens'
        }
    },
    serviceWorker: {
        updateAvailable: 'Een nieuwe versie is beschikbaar!',
        manualRefreshNeeded:
            'Nieuwe versie geactiveerd. Herlaad nu voor de nieuwste functies.',
        updateSuccess: 'App succesvol bijgewerkt! 🎉'
    },
    notFound: {
        message: 'Oeps! Pagina niet gevonden 🚫',
        backButton: 'Terug naar home',
        contactButton: 'Neem contact op'
    },
    blog: {
        readMore: 'Lees meer',
        backToBlog: 'Terug naar blog',
        publishedOn: 'Gepubliceerd op',
        author: 'Auteur',
        tags: 'Tags',
        readTime: 'min leestijd',
        likes: 'likes',
        share: 'Delen'
    },
    account: {
        create: 'Account aanmaken',
        manage: 'Account beheren',
        login: 'Inloggen',
        logout: 'Uitloggen',
        profile: 'Profiel',
        settings: 'Instellingen',
        guest: 'Gast',
        free: 'GRATIS',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Spring naar hoofdinhoud',
        closeModal: 'Modal sluiten',
        openMenu: 'Menu openen',
        closeMenu: 'Menu sluiten',
        loading: 'Laden...',
        error: 'Fout opgetreden',
        success: 'Succes',
        warning: 'Waarschuwing',
        info: 'Informatie',
        copyToClipboard: 'Kopiëren naar klembord',
        copiedToClipboard: 'Gekopieerd naar klembord',
        generatePassword: 'Wachtwoord genereren',
        clearForm: 'Formulier wissen',
        sendMessage: 'Bericht versturen',
        toggleDarkMode: 'Donkere modus wisselen',
        toggleLanguage: 'Taal wisselen'
    },
    validation: {
        required: 'Dit veld is verplicht',
        email: 'Voer een geldig e-mailadres in',
        minLength: 'Moet minimaal {min} karakters bevatten',
        maxLength: 'Mag niet meer dan {max} karakters bevatten',
        invalidFormat: 'Ongeldig formaat',
        serverError: 'Serverfout, probeer het opnieuw',
        networkError: 'Netwerkfout, controleer je verbinding'
    },

    // UserSettings vertalingen
    userSettings: {
        // Basisinstellingen
        basicSettings: {
            title: 'Basisinstellingen',
            description: 'Taal, thema en meldingen',
            language: {
                label: 'Taal',
                description: 'Kies je voorkeurstaal',
                options: {
                    en: '🇺🇸 Engels',
                    de: '🇩🇪 Duits',
                    fr: '🇫🇷 Frans',
                    es: '🇪🇸 Spaans',
                    nl: '🇳🇱 Nederlands'
                }
            },
            theme: {
                label: 'Thema',
                description: 'Kies je visuele thema',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Licht',
                    dark: '🌙 Donker'
                }
            },
            notifications: {
                label: 'Meldingen',
                description: 'Belangrijke updates ontvangen'
            }
        },

        // Beveiligingsinstellingen
        securitySettings: {
            title: 'Beveiligingsinstellingen',
            description: 'Wachtwoordsterkte en tekentypen',
            passwordLength: {
                label: 'Wachtwoordlengte',
                description: 'Wachtwoordsterkte kiezen',
                min: 'Zwak (6)',
                max: 'Sterk (20)'
            },
            includeNumbers: {
                label: 'Cijfers opnemen',
                description: 'Numerieke tekens toevoegen (0-9)'
            },
            includeSymbols: {
                label: 'Symbolen opnemen',
                description: 'Speciale tekens toevoegen (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Speciale tekens opnemen',
                description: 'Uitgebreide speciale tekens toevoegen'
            },
            excludeSimilarChars: {
                label: 'Vergelijkbare tekens uitsluiten',
                description: 'Verwarrende tekens vermijden (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Unieke tekens vereist',
                description: 'Geen herhaalde tekens in wachtwoord'
            }
        },

        // Emoji-instellingen
        emojiSettings: {
            title: 'Emoji-instellingen',
            description: 'Emoji aantal, categorieën en patronen',
            emojiCount: {
                label: 'Emoji aantal',
                description: "Aantal emoji's in wachtwoord",
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Emoji patroon',
                description: 'Emoji rangschikking kiezen',
                options: {
                    random: 'Willekeurig',
                    sequential: 'Sequentieel',
                    alternating: 'Afwisselend'
                }
            },
            emojiTheme: {
                label: 'Emoji thema',
                description: 'Emoji stijl kiezen',
                options: {
                    mixed: 'Gemengd',
                    cute: 'Schattig',
                    professional: 'Professioneel',
                    fantasy: 'Fantasy'
                }
            }
        },

        // Generatie-instellingen
        generationSettings: {
            title: 'Generatie-instellingen',
            description: 'Auto-generatie en klembord opties',
            autoGenerate: {
                label: 'Auto-genereren',
                description: 'Wachtwoorden automatisch genereren'
            },
            copyToClipboard: {
                label: 'Kopiëren naar klembord',
                description: 'Gegenereerde wachtwoorden automatisch kopiëren'
            },
            showStrength: {
                label: 'Sterkte tonen',
                description: 'Wachtwoordsterkte meter tonen'
            },
            strengthThreshold: {
                label: 'Sterkte drempel',
                description: 'Minimale vereiste wachtwoordsterkte',
                options: {
                    low: 'Laag',
                    medium: 'Medium',
                    high: 'Hoog'
                }
            },
            autoRefresh: {
                label: 'Auto-vernieuwen',
                description: 'Zwakke wachtwoorden automatisch regenereren'
            }
        },

        // Privacy-instellingen
        privacySettings: {
            title: 'Privacy-instellingen',
            description: 'Gegevensverzameling en deelvoorkeuren',
            saveHistory: {
                label: 'Geschiedenis opslaan',
                description: 'Gegenereerde wachtwoorden lokaal opslaan'
            },
            analytics: {
                label: 'Analytics',
                description: 'Anonieme gebruiksstatistieken'
            },
            shareUsage: {
                label: 'Gebruik delen',
                description: 'Gebruiksgegevens delen voor verbeteringen'
            },
            exportHistory: {
                label: 'Geschiedenis exporteren',
                description: 'Wachtwoordgeschiedenis naar bestand exporteren'
            },
            backupSettings: {
                label: 'Instellingen backuppen',
                description: 'Instellingen automatisch backuppen'
            }
        },

        // Pro-functies
        proFeatures: {
            title: 'Pro-functies',
            description: 'Geavanceerde instellingen en premium functies',
            securityAudit: {
                label: 'Beveiligingsaudit',
                description: 'Uitgebreide beveiligingsanalyse',
                buttonText: 'Audit uitvoeren'
            },
            breachCheck: {
                label: 'Lekcontrole',
                description: 'Wachtwoorden controleren tegen bekende lekken'
            },
            strengthAnalytics: {
                label: 'Sterkte analytics',
                description: 'Geavanceerde wachtwoordsterkte analyse'
            }
        }
    },

    // Boekhouding en beveiliging
    accounting: {
        // Login en authenticatie
        login: {
            title: 'Inloggen',
            emailPlaceholder: 'Voer je e-mailadres in',
            magicLinkSent: 'Magic link verzonden!',
            magicLinkError: 'Fout bij verzenden van magic link',
            verificationSuccess: 'E-mail succesvol geverifieerd!',
            verificationError: 'E-mailverificatie mislukt',
            rateLimitExceeded: 'Te veel inlogpogingen. Wacht even.',
            sessionExpired: 'Sessie verlopen. Log opnieuw in.'
        },

        // Accountbeheer
        account: {
            title: 'Accountbeheer',
            profile: 'Profiel',
            settings: 'Instellingen',
            logout: 'Uitloggen',
            logoutSuccess: 'Succesvol uitgelogd',
            accountCreated: 'Account succesvol aangemaakt',
            accountUpdated: 'Account succesvol bijgewerkt',
            accountError: 'Fout bij accountbeheer'
        },

        // Beveiligingsgebeurtenissen
        security: {
            loginAttempt: 'Inlogpoging',
            loginSuccess: 'Succesvol ingelogd',
            loginFailed: 'Inloggen mislukt',
            logout: 'Uitloggen',
            sessionExpired: 'Sessie verlopen',
            suspiciousActivity: 'Verdachte activiteit',
            verificationSuccess: 'Verificatie succesvol',
            verificationFailed: 'Verificatie mislukt',
            accountCreated: 'Account aangemaakt',
            accountUpdated: 'Account bijgewerkt',
            securityAudit: 'Beveiligingsaudit uitgevoerd'
        },

        // Validatie
        validation: {
            required: 'Dit veld is verplicht',
            emailInvalid: 'Voer een geldig e-mailadres in',
            urlInvalid: 'Voer een geldige URL in',
            phoneInvalid: 'Voer een geldig telefoonnummer in',
            passwordWeak:
                'Wachtwoord moet minimaal 8 karakters bevatten met hoofdletters, kleine letters en cijfers',
            minLength: 'Minimale lengte is {min} karakters',
            maxLength: 'Maximale lengte is {max} karakters',
            minValue: 'Minimumwaarde is {min}',
            maxValue: 'Maximumwaarde is {max}',
            validInput: 'Geldige invoer'
        },

        // Context menu
        contextMenu: {
            exportSettings: 'Instellingen exporteren',
            importSettings: 'Instellingen importeren',
            resetToDefault: 'Terugzetten naar standaard',
            proMessage:
                '💎 Pro-gebruikers kunnen hun instellingen exporteren en importeren'
        }
    },

    // Modals en meldingen
    modals: {
        success: 'Succes',
        error: 'Fout',
        warning: 'Waarschuwing',
        info: 'Informatie',
        confirm: 'Bevestigen',
        cancel: 'Annuleren',
        close: 'Sluiten',
        loading: 'Laden...',
        saving: 'Opslaan...',
        exporting: 'Exporteren...',
        importing: 'Importeren...',
        resetting: 'Terugzetten...'
    },

    // Algemene UI-teksten
    // AccountManager vertalingen
    accountManager: {
        // Koppen en beschrijvingen
        pageTitle: 'Accountbeheer',
        pageDescription:
            'Beheer je beveiligingsinstellingen en accountvoorkeuren',
        welcomeBack: 'Welkom terug, {name}! 👋',
        welcomeDescription:
            'Klaar om geweldige emoji-wachtwoorden te maken? Je account is veilig en klaar!',
        verificationTitle: '📧 Controleer je e-mail en verifieer',
        verificationDescription:
            'Controleer je e-mail {email} en klik op de magische link om de setup te voltooien',

        // Account status
        accountStatus: 'Account status',
        emailLabel: 'E-mailadres',
        nameLabel: 'Je naam',
        profileDataLabel: 'Profielgegevens',

        // Account niveaus
        freeBadge: '✨ GRATIS',
        proBadge: '💎 PRO',
        freeDescription: '✨ Gratis beveiliging',
        proDescription: '💎 Enterprise beveiliging',

        // Voordelen
        benefits: {
            free: {
                title: 'GRATIS voordelen',
                dailyGenerations: '5 dagelijkse veilige generaties',
                dailyGenerationsDesc: 'AI-resistente technologie',
                decentralizedData: 'Gedecentraliseerde gegevensverwerking',
                decentralizedDataDesc: 'Je gegevens blijven privé',
                webApp: 'Beschikbaar als webapp',
                webAppDesc: 'Veilige toegang overal vandaan'
            },
            pro: {
                title: 'PRO voordelen',
                unlimitedGenerations: 'Onbeperkte veilige generaties',
                unlimitedGenerationsDesc: 'Geen dagelijkse limieten',
                aiThreatDetection: 'AI-aangedreven bedreigingsdetectie',
                aiThreatDetectionDesc: 'Proactieve beveiligingsanalyse',
                browserExtension: 'Browser-extensie (Q4 2025)',
                browserExtensionDesc: 'Beveiliging overal op het web',
                wordpressPlugin: 'WordPress-plugin (Q4 2025)',
                wordpressPluginDesc: 'Integreer beveiliging in je website'
            }
        },

        // Dagelijkse limiet
        dailyGenerations: 'Dagelijkse generaties',
        remainingGenerations: '{remaining} / {limit} over',
        canStillGenerate: "Je kunt nog steeds emoji's genereren!",
        limitReached:
            'Dagelijkse limiet bereikt. Upgrade naar PRO voor onbeperkte generaties.',

        // Statistieken
        statistics: {
            storiesGenerated: 'Gegenereerde verhalen',
            remainingGenerations: 'Resterende generaties'
        },

        // Acties
        actions: {
            saveSettings: '💾 Instellingen opslaan',
            backToHome: '🏠 Terug naar home',
            createAccount: '🚀 {type} account aanmaken',
            skipAccount: '{type} account overslaan',
            createMagicLink: '🔐 Magische link maken',
            sendingMagicLink: '⏳ Magische link verzenden...',
            resendMagicLink: '🔄 Magische link opnieuw verzenden',
            backToAccountOptions: '← Terug naar accountopties',
            addProfileData: '👤 Profielgegevens toevoegen',
            hideProfileData: '👤 Profielgegevens verbergen'
        },

        // Formuliervalidatie
        validation: {
            invalidEmail: '⚠️ Voer een geldig e-mailadres in',
            invalidName: '⚠️ Voer je naam in (minimaal 2 tekens)',
            requiredField: 'Dit veld is verplicht'
        },

        // Help sectie
        help: {
            title: '💡 Heb je hulp nodig?',
            checkSpam: '• Controleer je spam-map als je de e-mail niet ziet',
            linkExpires: '• Magische links verlopen na 15 minuten',
            requestNewLink: '• Je kunt altijd een nieuwe link aanvragen',
            noPassword: '• Geen wachtwoord nodig - klik gewoon op de link'
        },

        // Footer
        footer: {
            magicLink: '🔒 Magische link',
            instantSetup: '⚡ Directe setup',
            noSpam: '🎯 Geen spam'
        }
    },

    // Contactformulier
    contact: {
        intro: 'Hallo, ik ben Christopher\nFrontend-ontwikkelaar en ik hou ervan om gebruiksvriendelijke websites te bouwen met JavaScript, PHP en HTML. Stuur gerust een berichtje als je wilt!',
        headline: 'Contact',
        description: 'Stuur ons een bericht!',
        nameLabel: 'Jouw naam',
        emailLabel: 'Jouw e-mail',
        messageLabel: 'Bericht',
        sendButton: 'Verzenden',
        success: 'Bedankt voor je bericht!',
        error: 'Fout bij het verzenden. Probeer het opnieuw.'
    },

    ui: {
        save: 'Opslaan',
        cancel: 'Annuleren',
        reset: 'Terugzetten',
        export: 'Exporteren',
        import: 'Importeren',
        delete: 'Verwijderen',
        edit: 'Bewerken',
        add: 'Toevoegen',
        remove: 'Verwijderen',
        search: 'Zoeken',
        filter: 'Filteren',
        sort: 'Sorteren',
        refresh: 'Vernieuwen',
        back: 'Terug',
        next: 'Volgende',
        previous: 'Vorige',
        submit: 'Verzenden',
        loading: 'Laden...',
        error: 'Fout',
        success: 'Succes',
        warning: 'Waarschuwing',
        info: 'Info'
    }
};
