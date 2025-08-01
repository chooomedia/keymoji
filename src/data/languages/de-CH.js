// src/data/languages/de-CH.js
// Swiss German language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'de-CH',
        name: 'Swiss German',
        nativeName: 'Schweizerdeutsch',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Hauptmenü öffne',
        closeMainMenu: 'Hauptmenü schliesse'
    },
    index: {
        pageTitle: 'Emoji Passwort Generator',
        pageDescription:
            '🔑 Passwörter neu dacht. 🎯 Unknackbare Emoji-Passwörter. 🌈 Gratis. Sicher. Innovativ. 🤖 KI-resistente Technologie. 🌍 Verfügbar in 15+ Sprachen.',
        pageKeywords:
            'Keymoji, emoji passwort, passwort generator, sicherheit, online sicherheit',
        pageInstruction: [
            'Klick "📝 Gschicht" für dini KI Emoji-Gschicht 📖',
            '"Zufällig" isch selbsterklärend 😜.',
            'Nach em Generiere wirds in dini Zwischeablage kopiert! 📋'
        ],
        backToMainText: 'Klick unde 👇 zum zrugggah',
        backToMainButtonText: 'Zrugg zu Home',
        contactText: 'Hesch e Frog oder e coole Vorschlag?',
        contactButtonText: 'Schick mir e Nachricht! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Klick oder drück Enter um s generierte Emoji-Passwort in d Zwischeablage z kopiere',
        successMessage: 'Erfolg, in d Zwischeablage kopiert 💾',
        errorMessage: 'Ups, öppis isch schiefgloffe 🤖',
        dailyLimitReachedMessage:
            'Entschuldigung, tägliches Limit vo Aafrage erreicht 😔',
        successStoryMessage: 'Erfolg, Emoji Gschicht generiert 🤖',
        errorStoryMessage: 'Fehler, kei Antwort vom Server 🌀',
        emojiDisplayTitle: 'Emoji Passwort Generator',
        dataPrivacyProcessingInfo:
            '🚀 Emoji-Magie über Webhooks und KI! ✨ Date sind wie Strandsand - si bliebe nöd.',
        clearButton: '✖️ Lösche',
        storyButton: '📝 Gschicht',
        storyButtonClicked: '📩 Gschicht sende',
        randomButton: '🎲 Zufällig',
        placeholderText:
            'Verzell mir e Gschicht und ich generiere Emoji-Passwörter basierend druf...',
        clipboardError: 'Fehler bim Kopiere in d Zwischeablage'
    },
    donateButton: {
        text: 'Kauf mir e Kaffi',
        openText: 'Das Menü schliesse',
        textMobile: '☕'
    },
    // Kontaktformular (optimiert für Schweizerdeutsch)
    contactForm: {
        pageTitle: 'Hallo, ich bi Christopher',
        pageDescription:
            'Frontend-Entwickler und ich liebe es, benutzerfreundliche Websites mit JavaScript, PHP und HTML zu gestalten und zu programmieren. Zögere nicht und schick mir eine Nachricht wenn du möchtest.',
        nameLabel: '🧑🏻 Din Name',
        emailLabel: '📧 Dini E-Mail',
        messageLabel: '✍🏻 Dini Nachricht',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Sende',
        sendingButton: '📨 Sende...',
        successMessage: 'Erfolg, Nachricht gsendet - Antwort: < 24 Stunde 🚀',
        errorMessage: 'E unerwartete Fehler isch uftrete 😟',
        requestErrorMessage:
            'Fehler bim Sende vo de Nachricht, bitte versuechs nomol 🙁',
        smirkingFaceImageAlt: 'keymoji emoji schmunzelnds gsicht 1f60f',
        introductionTitle: 'Hesch e Frog oder e coole Vorschlag?',
        introductionText: 'Schick mir e Nachricht!',
        privacyNotice:
            'Si versichert, dini Date sind bi uns in guete Händ 🤲. Dini Details werde nöd a Dritti wiitergäh 🔒.',
        newsletterLabel: 'Ja, ich möcht de Newsletter abonniere',
        newsletterOptIn: 'Newsletter abonniere',
        backToMainButton: 'Zrugg zu Home',
        footerText: 'Mit Liebi entwicklet',
        validationErrorMessage:
            'Bitte beheb d Formularfehler vor em Absende 🔍',
        sendingMessage: 'Sende dini Nachricht... 📨',
        emailText: {
            greeting: 'Willkomme',
            confirmationText:
                'Bitte bestätig dini Aafrag damit Christopher weiss, dass du kei intelligente Bot bisch. Du hesch e Nachricht mit folgende Date gsendet:',
            doubleCheck: 'Mir hei dini Nachricht mit folgende Details erhalte:',
            button: 'Bestätig dini E-Mail'
        },
        validation: {
            nameRequired: 'Name erforderlich',
            nameLength: 'Mindestens 2 Zeiche',
            emailRequired: 'E-Mail erforderlich',
            emailInvalid: 'Ungültigi E-Mail',
            messageRequired: 'Nachricht erforderlich',
            messageLength: 'Mindestens {min} Zeiche'
        }
    },
    serviceWorker: {
        updateAvailable: 'E neui Version isch verfügbar!',
        manualRefreshNeeded:
            'Neui Version aktiviert. Lade jetzt neu für di neuste Features.',
        updateSuccess: 'App erfolgreich aktualisiert! 🎉'
    },
    notFound: {
        message: 'Hoppla! Site nöd gfunde 🚫',
        backButton: 'Zrugg zur Startseite',
        contactButton: 'Kontaktiere uns'
    },
    blog: {
        readMore: 'Wiiterlese',
        backToBlog: 'Zrugg zum Blog',
        publishedOn: 'Veröffentlicht am',
        author: 'Autor',
        tags: 'Tags',
        readTime: 'Min Lesezit',
        likes: 'Likes',
        share: 'Teile'
    },
    account: {
        create: 'Konto erstelle',
        manage: 'Konto verwalte',
        login: 'Aamelde',
        logout: 'Abmelde',
        profile: 'Profil',
        settings: 'Iistellige',
        guest: 'Gast',
        free: 'GRATIS',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Zum Hauptinhalt springe',
        closeModal: 'Modal schliesse',
        openMenu: 'Menü öffne',
        closeMenu: 'Menü schliesse',
        loading: 'Lädt...',
        error: 'Fehler uftrete',
        success: 'Erfolg',
        warning: 'Warnig',
        info: 'Information',
        copyToClipboard: 'In Zwischeablage kopiere',
        copiedToClipboard: 'In Zwischeablage kopiert',
        generatePassword: 'Passwort generiere',
        clearForm: 'Formular lösche',
        sendMessage: 'Nachricht sende',
        toggleDarkMode: 'Dunkelmodus umschalte',
        toggleLanguage: 'Sprach umschalte'
    },
    validation: {
        required: 'Das Feld isch erforderlich',
        email: 'Bitte gib e gültigi E-Mail-Adress i',
        minLength: 'Muss mindestens {min} Zeiche lang si',
        maxLength: 'Darf nöd meh als {max} Zeiche ha',
        invalidFormat: 'Ungültigs Format',
        serverError: 'Serverfehler, bitte versuechs nomol',
        networkError: 'Netzwerkfehler, bitte überprüf dini Verbindig'
    },

    // UserSettings Übersetzige
    userSettings: {
        // Grundlegendi Iistellige
        basicSettings: {
            title: 'Grundlegendi Iistellige',
            description: 'Sprach, Theme und Benachrichtigunge',
            language: {
                label: 'Sprach',
                description: 'Wähl dini bevorzugti Sprach',
                options: {
                    en: '🇺🇸 Englisch',
                    de: '🇩🇪 Dütsch',
                    fr: '🇫🇷 Französisch',
                    es: '🇪🇸 Spanisch',
                    dech: '🇨🇭 Schwiizerdütsch'
                }
            },
            theme: {
                label: 'Theme',
                description: 'Wähl dis visuelli Theme',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Hell',
                    dark: '🌙 Dunkel'
                }
            },
            notifications: {
                label: 'Benachrichtigunge',
                description: 'Wichtigi Updates erhalte'
            }
        },

        // Sicherheitsiistellige
        securitySettings: {
            title: 'Sicherheitsiistellige',
            description: 'Passwortstärki und Zeichentype',
            passwordLength: {
                label: 'Passwortlengi',
                description: 'Passwortstärki wähle',
                min: 'Schwach (6)',
                max: 'Stark (20)'
            },
            includeNumbers: {
                label: 'Zahle iischliesse',
                description: 'Numerischi Zeiche hinzufüge (0-9)'
            },
            includeSymbols: {
                label: 'Symbol iischliesse',
                description: 'Sonderzeiche hinzufüge (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Sonderzeiche iischliesse',
                description: 'Erweitereti Sonderzeiche hinzufüge'
            },
            excludeSimilarChars: {
                label: 'Ähnlichi Zeiche uusschliesse',
                description: 'Verwirrendi Zeiche vermiide (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Eidütigi Zeiche erforderlich',
                description: 'Kei wiederholti Zeiche im Passwort'
            }
        },

        // Emoji-Iistellige
        emojiSettings: {
            title: 'Emoji-Iistellige',
            description: 'Emoji-Aazahl, Kategorie und Muster',
            emojiCount: {
                label: 'Emoji-Aazahl',
                description: 'Aazahl vo de Emojis im Passwort',
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Emoji-Muster',
                description: 'Emoji-Aornig wähle',
                options: {
                    random: 'Zufällig',
                    sequential: 'Sequenziell',
                    alternating: 'Wächselnd'
                }
            },
            emojiTheme: {
                label: 'Emoji-Theme',
                description: 'Emoji-Stil wähle',
                options: {
                    mixed: 'Gmischt',
                    cute: 'Süss',
                    professional: 'Professionell',
                    fantasy: 'Fantasy'
                }
            }
        },

        // Generierigsiistellige
        generationSettings: {
            title: 'Generierigsiistellige',
            description: 'Auto-Generierig und Zwischeablage-Optione',
            autoGenerate: {
                label: 'Auto-Generierig',
                description: 'Passwörter automatisch generiere'
            },
            copyToClipboard: {
                label: 'In Zwischeablage kopiere',
                description: 'Generierti Passwörter automatisch kopiere'
            },
            showStrength: {
                label: 'Stärki azeige',
                description: 'Passwortstärki-Meter azeige'
            },
            strengthThreshold: {
                label: 'Stärki-Schwelle',
                description: 'Minimali erforderlichi Passwortstärki',
                options: {
                    low: 'Niedrig',
                    medium: 'Mittel',
                    high: 'Hoch'
                }
            },
            autoRefresh: {
                label: 'Auto-Aktualisierig',
                description: 'Schwachi Passwörter automatisch neu generiere'
            }
        },

        // Datenschutz-Iistellige
        privacySettings: {
            title: 'Datenschutz-Iistellige',
            description: 'Datesammlig und Sharing-Präferenze',
            saveHistory: {
                label: 'Verlauf speichere',
                description: 'Generierti Passwörter lokal speichere'
            },
            analytics: {
                label: 'Analytics',
                description: 'Anonymi Nutzigsstatistike'
            },
            shareUsage: {
                label: 'Nutzig teile',
                description: 'Nutzigsdate für Verbesserige teile'
            },
            exportHistory: {
                label: 'Verlauf exportiere',
                description: 'Passwortverlauf in Datei exportiere'
            },
            backupSettings: {
                label: 'Iistellige sichere',
                description: 'Iistellige automatisch sichere'
            }
        },

        // Pro-Features
        proFeatures: {
            title: 'Pro-Features',
            description: 'Erweitereti Iistellige und Premium-Features',
            securityAudit: {
                label: 'Sicherheits-Audit',
                description: 'Umfassendi Sicherheitsanalys',
                buttonText: 'Audit starte'
            },
            breachCheck: {
                label: 'Dateleck-Prüfig',
                description: 'Passwörter gege bekannti Datelecks prüfe'
            },
            strengthAnalytics: {
                label: 'Stärki-Analytics',
                description: 'Erweitereti Passwortstärki-Analys'
            }
        }
    },

    // Accounting und Sicherheit
    accounting: {
        // Login und Authentifizierig
        login: {
            title: 'Aamelde',
            emailPlaceholder: 'E-Mail-Adress iigäh',
            magicLinkSent: 'Magic Link gsendet!',
            magicLinkError: 'Fehler bim Sende vom Magic Link',
            verificationSuccess: 'E-Mail erfolgreich verifiziert!',
            verificationError: 'E-Mail-Verifikation fehlgschlage',
            rateLimitExceeded: 'Zu vieli Aameldeversüech. Bitte warte.',
            sessionExpired: 'Sitzig abgloffe. Bitte meld dich nomol a.'
        },

        // Account-Management
        account: {
            title: 'Account-Verwaltig',
            profile: 'Profil',
            settings: 'Iistellige',
            logout: 'Abmelde',
            logoutSuccess: 'Erfolgreich abgmeldet',
            accountCreated: 'Account erfolgreich erstellt',
            accountUpdated: 'Account erfolgreich aktualisiert',
            accountError: 'Fehler bi de Account-Verwaltig'
        },

        // Sicherheits-Events
        security: {
            loginAttempt: 'Aameldeversüech',
            loginSuccess: 'Erfolgreichi Aameldig',
            loginFailed: 'Fehlgschlagene Aameldig',
            logout: 'Abmeldig',
            sessionExpired: 'Sitzig abgloffe',
            suspiciousActivity: 'Verdächtigi Aktivität',
            verificationSuccess: 'Verifikation erfolgreich',
            verificationFailed: 'Verifikation fehlgschlage',
            accountCreated: 'Account erstellt',
            accountUpdated: 'Account aktualisiert',
            securityAudit: 'Sicherheits-Audit durchgfüehrt'
        },

        // Validierig
        validation: {
            required: 'Das Feld isch erforderlich',
            emailInvalid: 'Bitte gib e gültigi E-Mail-Adress i',
            urlInvalid: 'Bitte gib e gültigi URL i',
            phoneInvalid: 'Bitte gib e gültigi Telefonnummer i',
            passwordWeak:
                'Passwort muss mindestens 8 Zeiche mit Gross-, Chliibuechstabe und Zahl enthalte',
            minLength: 'Mindestlengi isch {min} Zeiche',
            maxLength: 'Maximallengi isch {max} Zeiche',
            minValue: 'Mindestwert isch {min}',
            maxValue: 'Maximalwert isch {max}',
            validInput: 'Gültigi Iigab'
        },

        // Context Menu
        contextMenu: {
            exportSettings: 'Iistellige exportiere',
            importSettings: 'Iistellige importiere',
            resetToDefault: 'Uf Standard zruggsetze',
            proMessage:
                '💎 Pro-Nutzer chönd ihri Iistellige exportiere und importiere'
        }
    },

    // Modals und Benachrichtigunge
    modals: {
        success: 'Erfolg',
        error: 'Fehler',
        warning: 'Warnig',
        info: 'Information',
        confirm: 'Bestätige',
        cancel: 'Abbreche',
        close: 'Schliesse',
        loading: 'Lädt...',
        saving: 'Speichere...',
        exporting: 'Exportiere...',
        importing: 'Importiere...',
        resetting: 'Zruggsetze...'
    },
    versions: {
        pageTitle: 'Versionsverlauf',
        pageDescription:
            'Überprüf d Entwickligsgschicht und de Changelog vo Keymoji, em Emoji-Passwort-Generator.'
    },

    // AccountManager Übersetzungen
    accountManager: {
        // Seitentitel und Beschreibige
        pageTitle: 'Account Verwaltig',
        pageDescription:
            'Verwalte dini Sicherheitsiistellige und Account-Präferenze',
        welcomeBack: 'Willkomme zrugg, {name}! 👋',
        welcomeDescription:
            'Bereit zum Erstelle vo tolli Emoji-Passwörter? Din Account isch sicher und bereit!',
        returnUserTitle: '👋 Willkomme zrugg!',
        returnUserDescription:
            'Mir hei dini E-Mail-Adress erkennt. Logg dich schnell ih.',
        verificationTitle: '📧 Überprüf dini E-Mail und bestätig',
        verificationDescription:
            'Überprüf dini E-Mail {email} und klick uf de Magic-Link zum Abschluss vo de Iistellig',
        verifyingTitle: '🔗 Magic-Link wird überprüft...',
        verifyingDescription: 'Bitte warte während mir din Account überprüfe.',
        verificationErrorTitle: '❌ Überprüfig fehlgschlage',
        verificationErrorDescription: 'E Fehler isch uftrete.',

        // Knöpfe und Aktione
        buttons: {
            createMagicLink: 'Magic-Link erstelle',
            loginToAccount: 'I Account ihlogge',
            checkAccountExists: 'Account wird überprüft...',
            sendingMagicLink: 'Magic-Link wird gsendet...',
            accountExists: 'Account gfunde - Logge ih...',
            accountNotFound: 'Account nöd gfunde - Erstelle...',
            sessionExpired: 'Session abgloffe - Nomol ihlogge',
            loginAgain: '🔐 Nomol ihlogge',
            createNewAccount: 'Neue Account erstelle',
            resendMagicLink: '🔄 Magic-Link nomol sende',
            backToAccountOptions: '← Zrugg zu Account-Optione',
            addProfile: 'Hinzufüge',
            hideProfile: 'Verstecke',
            profileData: 'Profil-Date',
            showFullForm: 'Vollständigs Formular zeige',
            compactView: 'Kompakti Aasicht'
        },

        // Formular-Labels
        emailLabel: 'E-Mail',
        nameLabel: 'Name',

        // Aktione
        actions: {
            saveSettings: '💾 Iistellige speichere',
            backToHome: '🏠 Zrugg zu Home',
            skipAccount: '❌ {type} überspringe',
            createAccount: '🚀 {type} Account erstelle',
            settingsSaved: 'Iistellige erfolgreich gspeichert!'
        },

        // Statistike
        statistics: {
            storiesGenerated: 'Generierti Gschichte',
            remainingGenerations: 'Verbleibendi Generierige'
        },

        // Tägligi Generierige
        dailyGenerations: 'Tägligi Generierige',

        // Aazeig vo verbleibende Generierige
        remainingDisplay: 'Verbleibend {remaining} / {limit}',

        // Vorteil
        benefits: {
            free: {
                dailyGenerations: '5 tägligi sicheri Generierige',
                dailyGenerationsDesc: 'KI-resistenti Technologie',
                decentralizedData: 'Dezentrali Dateverarbeitig',
                decentralizedDataDesc: 'Dini Date bliibe privat',
                webApp: 'Als Web-App verfüegbar',
                webAppDesc: 'Sicherer Zugriff vo überall'
            },
            pro: {
                unlimitedGenerations: 'Unbegrenzti sicheri Generierige',
                unlimitedGenerationsDesc: 'Kei tägligi Limite',
                aiThreatDetection: 'KI-gestützti Bedrohigserkennig',
                aiThreatDetectionDesc: 'Proaktivi Sicherheitsanalys',
                prioritySupport: 'Prioritäts-Support',
                prioritySupportDesc: 'Schnelli Hilf bi Froge',
                browserExtension: 'Browser-Erweiterig (Q4 2025)',
                browserExtensionDesc: 'Sicherheit überall im Web',
                wordpressPlugin: 'WordPress-Plugin (Q4 2025)',
                wordpressPluginDesc: 'Sicherheit in dini Website integriere'
            }
        },

        // Hilf-Sektion
        help: {
            title: '💡 Bruchsch Hilf?',
            spamFolder:
                '• Überprüf din Spam-Ordner falls du d E-Mail nöd gsehsch',
            magicLinkExpiry: '• Magic-Links laufe nach 15 Minute ab',
            requestNewLink: '• Du chasch jederziit e neue Link aafroge',
            noPassword: '• Kei Passwort nötig - klick eifach uf de Link'
        },

        // Footer
        footer: {
            magicLink: 'Magic-Link',
            instantSetup: 'Sofortigi Iistellig',
            noSpam: 'Kei Spam',
            text: 'Magic-Links werde per E-Mail gsendet und sin 15 Minute gültig.',
            privacy: 'Dini Date werde sicher verarbeitet.'
        },

        // Limite und Nachrichte
        canStillGenerate: 'Du chasch immerno Emojis generiere!',
        limitReached:
            'Tägligs Limit erreicht. Upgrade uf PRO für unbegrenzti Generierige.',

        // Account-Alter
        accountAge: {
            today: 'Hüt erstellt',
            yesterday: 'Gester erstellt',
            days: 'Sit {days} Täg',
            weeks: 'Sit {weeks} Wuche{plural}',
            months: 'Sit {months} Mönet{plural}',
            years: 'Sit {years} Jahr{plural}',
            accountSince: 'Account sit {days} {unit}',
            since: 'sit {days} {unit}',
            day: 'Tag',
            daysLabel: 'Täg',
            accountCreated: 'Account erstellt'
        },

        // Validierig
        validation: {
            emailInvalid: 'Bitte gib e gültigi E-Mail-Adress ih',
            nameInvalid: 'Bitte gib din Name ih (mindestens 2 Zeiche)'
        },

        // Nachrichte
        messages: {
            settingsReset: 'Iistellige uf Standard zrugggsetzt',
            exportFailed: 'Export vo Iistellige fehlgschlage',
            settingsExported: 'Iistellige erfolgreich exportiert',
            freeAccountActivated: 'Gratis-Account aktiviert!'
        },

        // Upgrade-Sektion
        upgrade: {
            upgradeToPro: 'Uf Pro upgraden',
            upgradeToProForFeatures:
                'Uf Pro upgraden für erweitereti Funktione',
            unlimitedGenerations:
                'Unbegrenzti Generierige und erweitereti Sicherheitsfunktione'
        },

        // Kontext-Menü
        contextMenu: {
            exportSettings: 'Iistellige exportiere',
            importSettings: 'Iistellige importiere',
            resetToDefault: 'Uf Standard zruggsetze',
            logout: 'Uslogge',
            settingsMenu: 'Iistellige-Menü'
        },

        // Funktione
        features: {
            proFeature: 'Pro-Funktion'
        },

        // Pro-Funktion Modal
        proFeatureModal: {
            title: 'Pro-Funktion',
            proBenefits: 'Pro-Vorteil:',
            unlimitedGenerations: 'Unbegrenzti Emoji-Generierige',
            advancedSecurity: 'Erweitereti Sicherheitsfunktione',
            prioritySupport: 'Prioritäts-Support',
            earlyAccess: 'Früeher Zugang zu neue Funktione',
            maybeLater: 'Vielleicht spöter',
            upgradeToPro: 'Uf Pro upgraden',
            // Pro-Upgrade spezifisch
            proUpgrade: 'Pro-Upgrade',
            unlockAdvancedFeatures:
                'Alli erweitereti Funktione und Iistellige freischalte',
            upgradeProNow: '💎 Jetzt uf Pro upgraden'
        },

        // Account-Stufe
        tiers: {
            free: 'GRATIS',
            pro: 'PRO',
            freeAccount: 'Gratis-Account',
            proAccount: 'Pro-Account'
        },

        // Badges
        freeBadge: '✨ GRATIS',
        proBadge: '💎 PRO',

        // Beschreibige
        freeDescription: '✨ Gratis-Sicherheit',
        proDescription: '💎 Enterprise-Sicherheit'
    },

    // Allgemeini UI-Texte
    ui: {
        save: 'Speichere',
        cancel: 'Abbreche',
        reset: 'Zruggsetze',
        export: 'Exportiere',
        import: 'Importiere',
        delete: 'Lösche',
        edit: 'Bearbeite',
        add: 'Hinzufüge',
        remove: 'Entferne',
        search: 'Suche',
        filter: 'Filtere',
        sort: 'Sortiere',
        refresh: 'Aktualisiere',
        back: 'Zrugg',
        next: 'Wiiter',
        previous: 'Zurück',
        submit: 'Absende',
        loading: 'Lädt...',
        error: 'Fehler',
        success: 'Erfolg',
        warning: 'Warnig',
        info: 'Info'
    }
};
