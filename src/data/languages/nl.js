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
        setupStoryMode: 'Stel je AI in',
        setupStoryModeSwiss: 'Gebruik Zwitserse AI',
        setupStoryModeDescription:
            'Verbind met je AI voor gepersonaliseerde emoji-wachtwoorden.',
        setupStoryModeSwissDescription:
            'Zwitserse AI voor privacybewuste gebruikers. Data blijft in Zwitserland, GDPR-conform, enterprise beveiliging. Perfect voor particulieren en bedrijven die data-soevereiniteit waarderen.',
        setupStoryModeSwissTooltip:
            'Zwitserse AI (Apertus) - Privacy-gerichte AI, gehost in Zwitserland. Je data blijft in Zwitserland, beschermd door Zwitserse gegevensbeschermingswetten. GDPR-conform, enterprise-grade beveiliging. Ideaal voor privacybewuste gebruikers en bedrijven die data-soevereiniteit vereisen.',
        storyModeReady: 'Door AI gegenereerde emoji-wachtwoorden gereed 🤖',
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
        clearButton: 'Wissen',
        storyButton: '✨ Verhaal',
        storyButtonClicked: '✨ Verhaal versturen',
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
            'Frontend-ontwikkelaar en ik hou ervan om gebruiksvriendelijke websites te bouwen met TypeScript, JavaScript, PHP en HTML. Stuur gerust een berichtje als je wilt!',
        nameLabel: '🧑🏻 Jouw naam',
        emailLabel: 'Jouw e-mail',
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
        newsletterLabel: 'Ja, ik wil me abonneren op de nieuwsbrief',
        newsletterOptIn: 'Abonneren op nieuwsbrief',
        newsletterText:
            'Blijf op de hoogte en abonneer je met vertrouwen op de nieuwsbrief. {privacyPolicy}',
        privacyPolicyLink: 'Privacybeleid bekijken',
        privacyPolicyUrl: '/privacy',
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
        resetting: 'Terugzetten...',
        closeModal: 'Modal sluiten',
        modalClosesIn: 'Modal sluit in {seconds} seconden',
        modalClosesInSingular: 'Modal sluit in {seconds} seconde'
    },
    versions: {
        pageTitle: 'Versiegeschiedenis',
        pageDescription:
            'Bekijk de ontwikkelingsgeschiedenis en changelog van Keymoji, de emoji wachtwoord generator.'
    },

    // Algemene UI-teksten
    // AccountManager vertalingen
    accountManager: {
        // Paginatitels en beschrijvingen
        pageTitle: 'Accountbeheer',
        pageDescription:
            'Beheer je beveiligingsinstellingen en accountvoorkeuren',
        welcomeBack: 'Welkom terug, {name}! 👋',
        welcomeDescription:
            'Klaar om geweldige emoji-wachtwoorden te maken? Je account is veilig en klaar!',
        returnUserTitle: '👋 Welkom terug!',
        returnUserDescription: 'We hebben je e-mailadres herkend. Log snel in.',
        verificationTitle: '📧 Controleer je e-mail en verifieer',
        verificationDescription:
            'Controleer je e-mail {email} en klik op de magische link om de setup te voltooien',
        verifyingTitle: '🔗 Magische link verifiëren...',
        verifyingDescription: 'Even geduld terwijl we je account verifiëren.',
        verificationErrorTitle: '❌ Verificatie mislukt',
        verificationErrorDescription: 'Er is een fout opgetreden.',

        // Knoppen en acties
        buttons: {
            createMagicLink: 'Magische link maken',
            loginToAccount: 'Inloggen op account',
            checkAccountExists: 'Account controleren...',
            sendingMagicLink: 'Magische link verzenden...',
            accountExists: 'Account gevonden - Inloggen...',
            accountNotFound: 'Account niet gevonden - Aanmaken...',
            sessionExpired: 'Sessie verlopen - Opnieuw inloggen',
            loginAgain: '🔐 Opnieuw inloggen',
            createNewAccount: 'Nieuw account aanmaken',
            resendMagicLink: '🔄 Magische link opnieuw verzenden',
            backToAccountOptions: '← Terug naar accountopties',
            addProfile: 'Toevoegen',
            hideProfile: 'Verbergen',
            profileData: 'Profielgegevens',
            showFullForm: 'Volledig formulier tonen',
            compactView: 'Compacte weergave'
        },

        // Formulierlabels
        emailLabel: 'E-mail',
        nameLabel: 'Naam',

        // Acties
        actions: {
            saveSettings: '💾 Instellingen opslaan',
            backToHome: '🏠 Terug naar home',
            skipAccount: '❌ {type} overslaan',
            createAccount: '🚀 {type} account aanmaken',
            settingsSaved: 'Instellingen succesvol opgeslagen!'
        },

        // Statistieken
        statistics: {
            storiesGenerated: 'Gegenereerde verhalen',
            remainingGenerations: 'Resterende generaties'
        },

        // Dagelijkse generaties
        dailyGenerations: 'Dagelijkse generaties',

        // Weergave resterende generaties
        remainingDisplay: '{remaining} / {limit}',

        // Voordelen
        benefits: {
            free: {
                dailyGenerations: '9 dagelijkse veilige generaties',
                dailyGenerationsDesc:
                    'AI-resistente technologie voor maximale veiligheid',
                decentralizedData: 'Gedecentraliseerde gegevensverwerking',
                decentralizedDataDesc:
                    'Je gegevens blijven altijd bij jou - nooit op vreemde servers',
                webApp: 'Beschikbaar als webapp',
                webAppDesc: 'Direct beschikbaar - geen installatie nodig'
            },
            pro: {
                unlimitedGenerations: 'Onbeperkte veilige generaties',
                unlimitedGenerationsDesc:
                    'Maak zoveel wachtwoorden als je nodig hebt - zonder limieten',
                browserExtension: 'Browser-extensie (Q4 2025)',
                browserExtensionDesc:
                    'Veiligheid direct in je browser - automatisch en overal',
                apiIntegration: 'API-integratie (Q4 2025)',
                apiIntegrationDesc:
                    'Integreer veiligheid naadloos in je eigen applicaties'
            }
        },

        // Help sectie
        help: {
            title: '💡 Heb je hulp nodig?',
            spamFolder: '• Controleer je spam-map als je de e-mail niet ziet',
            magicLinkExpiry: '• Magische links verlopen na 15 minuten',
            requestNewLink: '• Je kunt altijd een nieuwe link aanvragen',
            noPassword: '• Geen wachtwoord nodig - klik gewoon op de link'
        },

        // Footer
        footer: {
            magicLink: 'Magische link',
            instantSetup: 'Directe setup',
            noSpam: 'Geen spam',
            text: 'Magische links worden per e-mail verzonden en zijn 15 minuten geldig.',
            privacy: 'Je gegevens worden veilig verwerkt.'
        },

        // Limieten en berichten
        canStillGenerate: "Je kunt nog steeds emoji's genereren!",
        limitReached:
            'Dagelijkse limiet bereikt. Upgrade naar PRO voor onbeperkte generaties.',

        // Account leeftijd
        accountAge: {
            today: '✨ FREE: Sinds vandaag!',
            yesterday: '🚀 FREE: Sinds gisteren!',
            days: '🔥 FREE: Sinds {days} dagen!',
            weeks: '⚡ FREE: Sinds {weeks} week{plural}!',
            months: '💪 FREE: Sinds {months} maand{plural}!',
            years: '🏆 FREE: Sinds {years} jaar{plural}!',
            accountSince: 'Account sinds {days} {unit}',
            since: 'sinds {days} {unit}',
            day: 'dag',
            daysLabel: 'dagen',
            accountCreated: 'Account aangemaakt',
            // Sexy salesy account creation texts
            createdTodayFree: '✨ Verse FREE account - net aangemaakt!',
            createdTodayPro: '💎 Verse PRO account - net aangemaakt!',
            createdRecentlyFree: '✨ FREE account {time} geleden aangemaakt',
            createdRecentlyPro: '💎 PRO account {time} geleden aangemaakt'
        },

        // Validatie
        validation: {
            emailInvalid: 'Voer een geldig e-mailadres in',
            nameInvalid: 'Voer je naam in (minimaal 2 tekens)'
        },

        // Berichten
        messages: {
            settingsReset: 'Instellingen teruggezet naar standaard',
            exportFailed: 'Exporteren van instellingen mislukt',
            settingsExported: 'Instellingen succesvol geëxporteerd',
            freeAccountActivated: 'Gratis account geactiveerd!'
        },

        // Apertus Info
        apertusInfo:
            'Exclusief op Keymoji: Apertus – de Zwitserse LLM. Voor het eerst beschikbaar voor gebruikers. Gehost op HuggingFace, geleverd via n8n workflow.',

        // Upgrade sectie
        upgrade: {
            upgradeToPro: 'Upgrade naar Pro',
            upgradeToProForFeatures:
                'Upgrade naar Pro voor geavanceerde functies',
            unlimitedGenerations:
                'Onbeperkte generaties en geavanceerde beveiligingsfuncties'
        },

        // Context menu
        contextMenu: {
            exportSettings: 'Instellingen exporteren',
            importSettings: 'Instellingen importeren',
            resetToDefault: 'Terugzetten naar standaard',
            logout: 'Uitloggen',
            settingsMenu: 'Instellingenmenu'
        },

        // Functies
        features: {
            proFeature: 'Pro functie'
        },

        // Pro functie modal
        proFeatureModal: {
            title: 'Pro functie',
            proBenefits: 'Pro voordelen:',
            unlimitedGenerations: 'Onbeperkte emoji generaties',
            advancedSecurity: 'Geavanceerde beveiligingsfuncties',
            prioritySupport: 'Prioriteit ondersteuning',
            earlyAccess: 'Vroege toegang tot nieuwe functies',
            maybeLater: 'Misschien later',
            upgradeToPro: 'Upgrade naar Pro',
            // Pro upgrade specifiek
            proUpgrade: 'Pro upgrade',
            unlockAdvancedFeatures:
                'Ontgrendel alle geavanceerde functies en instellingen',
            upgradeProNow: '💎 Nu upgraden naar Pro'
        },

        // Account niveaus
        tiers: {
            free: 'GRATIS',
            pro: 'PRO',
            freeAccount: 'Gratis account',
            proAccount: 'Pro account'
        },

        // Badges
        freeBadge: '✨ GRATIS',
        proBadge: '💎 PRO',

        // Beschrijvingen
        freeDescription: '✨ Gratis beveiliging',
        proDescription: '💎 Enterprise beveiliging'
    },

    // Contactformulier
    contact: {
        intro: 'Hallo, ik ben Christopher\nFrontend-ontwikkelaar en ik hou ervan om gebruiksvriendelijke websites te bouwen met TypeScript, JavaScript, PHP en HTML. Stuur gerust een berichtje als je wilt!',
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
