// src/data/languages/de.js
// German language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Hauptmenü öffnen',
        closeMainMenu: 'Hauptmenü schließen'
    },
    index: {
        pageTitle: 'Emoji Passwort Generator',
        pageDescription:
            '🔑 Passwörter neu gedacht. 🎯 Unknackbare Emoji-Passwörter. 🌈 Kostenlos. Sicher. Innovativ. 🤖 KI-resistente Technologie. 🌍 Verfügbar in 15+ Sprachen.',
        pageKeywords:
            'Keymoji, emoji passwort, passwort generator, sicherheit, online sicherheit',
        pageInstruction: [
            'Klicke "📝 Story" für deine KI Emoji-Geschichte 📖',
            '"Random" ist selbsterklärend 😜.',
            'Nach dem Generieren wird es in deine Zwischenablage kopiert! 📋'
        ],
        backToMainText: 'Klicke unten 👇 um zurückzukehren',
        backToMainButtonText: 'Zurück zu Home',
        contactText: 'Hast du eine Frage oder einen coolen Vorschlag?',
        contactButtonText: 'Schick mir eine Nachricht! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Klicke oder drücke Enter um das generierte Emoji-Passwort in die Zwischenablage zu kopieren',
        successMessage: 'Erfolg, in die Zwischenablage kopiert 💾',
        errorMessage: 'Ups, etwas ist schiefgelaufen 🤖',
        dailyLimitReachedMessage:
            'Entschuldigung, tägliches Limit an Anfragen erreicht 😔',
        successStoryMessage: 'Erfolg, Emoji Geschichte generiert 🤖',
        errorStoryMessage: 'Fehler, keine Antwort vom Server 🌀',
        emojiDisplayTitle: 'Emoji Passwort Generator',
        dataPrivacyProcessingInfo:
            '🚀 Emoji-Magie über Webhooks und KI! ✨ Daten sind wie Strandsand - sie bleiben nicht.',
        clearButton: '✖️ Löschen',
        storyButton: '📝 Geschichte',
        storyButtonClicked: '📩 Geschichte senden',
        randomButton: '🎲 Zufällig',
        placeholderText:
            'Erzähl mir eine Geschichte und ich generiere Emoji-Passwörter basierend darauf...',
        clipboardError: 'Fehler beim Kopieren in die Zwischenablage'
    },
    donateButton: {
        text: 'Kauf mir einen Kaffee',
        openText: 'Dieses Menü schließen',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Hallo, ich bin Christopher',
        pageDescription:
            'Frontend-Entwickler und ich liebe es, benutzerfreundliche Websites mit JavaScript, PHP und HTML zu gestalten und zu programmieren. Zögere nicht und schick mir eine Nachricht wenn du möchtest.',
        nameLabel: '🧑🏻 Dein Name',
        emailLabel: '📧 Deine E-Mail',
        messageLabel: '✍🏻 Deine Nachricht',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Senden',
        sendingButton: '📨 Sende...',
        successMessage: 'Erfolg, Nachricht gesendet - Antwort: < 24 Stunden 🚀',
        errorMessage: 'Ein unerwarteter Fehler ist aufgetreten 😟',
        requestErrorMessage:
            'Fehler beim Senden der Nachricht, bitte versuche es erneut 🙁',
        smirkingFaceImageAlt: 'keymoji emoji schmunzelndes gesicht 1f60f',
        introductionTitle: 'Hast du eine Frage oder einen coolen Vorschlag?',
        introductionText: 'Schick mir eine Nachricht!',
        privacyNotice:
            'Sei versichert, deine Daten sind bei uns in guten Händen 🤲. Deine Details werden nicht an Dritte weitergegeben 🔒.',
        newsletterLabel: 'Ja, ich möchte den Newsletter abonnieren',
        newsletterOptIn: 'Newsletter abonnieren',
        newsletterText:
            'Auf dem Laufenden bleiben und mit Sicherheit den Newsletter abonnieren. {privacyPolicy}',
        privacyPolicyLink: 'Datenschutz anzeigen',
        privacyPolicyUrl: '/privacy-policy',
        backToMainButton: 'Zurück zu Home',
        footerText: 'Mit Liebe entwickelt',
        validationErrorMessage:
            'Bitte behebe die Formularfehler vor dem Absenden 🔍',
        sendingMessage: 'Sende deine Nachricht... 📨',
        emailText: {
            greeting: 'Willkommen',
            intro: 'Danke für das Senden einer Nachricht 📩!',
            confirmationText:
                'Bitte bestätige deine Anfrage damit Christopher weiß, dass du kein intelligenter Bot bist. Du hast eine Nachricht mit folgenden Daten gesendet:',
            doubleCheck:
                'Wir haben deine Nachricht mit folgenden Details erhalten:',
            button: 'Bestätige deine E-Mail',
            subject: 'Deine Nachricht an Keymoji wurde empfangen',
            privacy: 'Deine Daten werden sicher behandelt.'
        },
        validation: {
            nameRequired: 'Name erforderlich',
            nameLength: 'Mindestens 2 Zeichen',
            emailRequired: 'E-Mail erforderlich',
            emailInvalid: 'Ungültige E-Mail',
            messageRequired: 'Nachricht erforderlich',
            messageLength: 'Mindestens {min} Zeichen'
        },
        autoFilledLabel: 'Automatisch aus deinem Konto ausgefüllt'
    },
    serviceWorker: {
        updateAvailable: 'Eine neue Version ist verfügbar!',
        manualRefreshNeeded:
            'Neue Version aktiviert. Lade jetzt neu für die neuesten Features.',
        updateSuccess: 'App erfolgreich aktualisiert! 🎉'
    },
    notFound: {
        pageTitle: '404 - Seite nicht gefunden',
        pageDescription:
            'Die gesuchte Seite existiert nicht oder wurde verschoben.',
        message: 'Hoppla! Seite nicht gefunden 🚫',
        suggestion:
            'Die Seite, die du suchst, wurde möglicherweise verschoben, gelöscht oder hat nie existiert.',
        backButton: 'Zurück zu Home',
        contactButton: 'Kontaktiere uns',
        navigationTitle: 'Verfügbare Seiten',
        recentEmojis: 'Letzte Emojis'
    },
    blog: {
        readMore: 'Weiterlesen',
        backToBlog: 'Zurück zum Blog',
        publishedOn: 'Veröffentlicht am',
        author: 'Autor',
        tags: 'Tags',
        readTime: 'Min Lesezeit',
        likes: 'Likes',
        share: 'Teilen'
    },
    account: {
        create: 'Konto erstellen',
        manage: 'Konto verwalten',
        login: 'Anmelden',
        logout: 'Abmelden',
        profile: 'Profil',
        settings: 'Einstellungen',
        guest: 'Gast',
        free: 'KOSTENLOS',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Zum Hauptinhalt springen',
        closeModal: 'Modal schließen',
        openMenu: 'Menü öffnen',
        closeMenu: 'Menü schließen',
        loading: 'Lädt...',
        error: 'Fehler aufgetreten',
        success: 'Erfolg',
        warning: 'Warnung',
        info: 'Information',
        copyToClipboard: 'In Zwischenablage kopieren',
        copiedToClipboard: 'In Zwischenablage kopiert',
        generatePassword: 'Passwort generieren',
        clearForm: 'Formular löschen',
        sendMessage: 'Nachricht senden',
        toggleDarkMode: 'Dunkelmodus umschalten',
        toggleLanguage: 'Sprache umschalten'
    },
    validation: {
        required: 'Dieses Feld ist erforderlich',
        email: 'Bitte gib eine gültige E-Mail-Adresse ein',
        minLength: 'Muss mindestens {min} Zeichen lang sein',
        maxLength: 'Darf nicht mehr als {max} Zeichen haben',
        invalidFormat: 'Ungültiges Format',
        serverError: 'Serverfehler, bitte versuche es erneut',
        networkError: 'Netzwerkfehler, bitte überprüfe deine Verbindung'
    },
    versions: {
        pageTitle: 'Versionsverlauf',
        pageDescription:
            'Entwicklungshistorie und Changelog von Keymoji, dem Emoji-Passwort-Generator.'
    },

    // UserSettings Übersetzungen
    userSettings: {
        // Grundlegende Einstellungen
        basicSettings: {
            title: 'Grundeinstellungen',
            description: 'Sprache, Theme und Benachrichtigungen',
            language: {
                label: 'Sprache',
                description: 'Wähle deine bevorzugte Sprache',
                options: {
                    en: '🇺🇸 Englisch',
                    de: '🇩🇪 Deutsch',
                    fr: '🇫🇷 Französisch',
                    es: '🇪🇸 Spanisch'
                }
            },
            theme: {
                label: 'Theme',
                description: 'Wähle dein visuelles Theme',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Hell',
                    dark: '🌙 Dunkel'
                }
            },
            notifications: {
                label: 'Benachrichtigungen',
                description: 'Wichtige Updates erhalten'
            }
        },

        // Sicherheitseinstellungen
        securitySettings: {
            title: 'Sicherheitseinstellungen',
            description: 'Passwortstärke und Zeichentypen',
            passwordLength: {
                label: 'Passwortlänge',
                description: 'Passwortstärke wählen',
                min: 'Schwach (6)',
                max: 'Stark (20)'
            },
            includeNumbers: {
                label: 'Zahlen einschließen',
                description: 'Numerische Zeichen hinzufügen (0-9)'
            },
            includeSymbols: {
                label: 'Symbole einschließen',
                description: 'Sonderzeichen hinzufügen (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Sonderzeichen einschließen',
                description: 'Erweiterte Sonderzeichen hinzufügen'
            },
            excludeSimilarChars: {
                label: 'Ähnliche Zeichen ausschließen',
                description: 'Verwirrende Zeichen vermeiden (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Eindeutige Zeichen erforderlich',
                description: 'Keine wiederholten Zeichen im Passwort'
            }
        },

        // Emoji-Einstellungen
        emojiSettings: {
            title: 'Emoji-Einstellungen',
            description: 'Emoji-Anzahl, Kategorien und Muster',
            emojiCount: {
                label: 'Emoji-Anzahl',
                description: 'Anzahl der Emojis im Passwort',
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Emoji-Muster',
                description: 'Emoji-Anordnung wählen',
                options: {
                    random: 'Zufällig',
                    sequential: 'Sequenziell',
                    alternating: 'Wechselnd'
                }
            },
            emojiTheme: {
                label: 'Emoji-Theme',
                description: 'Emoji-Stil wählen',
                options: {
                    mixed: 'Gemischt',
                    cute: 'Süß',
                    professional: 'Professionell',
                    fantasy: 'Fantasy'
                }
            }
        },

        // Generierungseinstellungen
        generationSettings: {
            title: 'Generierungseinstellungen',
            description: 'Auto-Generierung und Zwischenablage-Optionen',
            autoGenerate: {
                label: 'Auto-Generierung',
                description: 'Passwörter automatisch generieren'
            },
            copyToClipboard: {
                label: 'In Zwischenablage kopieren',
                description: 'Generierte Passwörter automatisch kopieren'
            },
            showStrength: {
                label: 'Stärke anzeigen',
                description: 'Passwortstärke-Meter anzeigen'
            },
            strengthThreshold: {
                label: 'Stärke-Schwelle',
                description: 'Minimale erforderliche Passwortstärke',
                options: {
                    low: 'Niedrig',
                    medium: 'Mittel',
                    high: 'Hoch'
                }
            },
            autoRefresh: {
                label: 'Auto-Aktualisierung',
                description: 'Schwache Passwörter automatisch neu generieren'
            }
        },

        // Datenschutz-Einstellungen
        privacySettings: {
            title: 'Datenschutz-Einstellungen',
            description: 'Datensammlung und Sharing-Präferenzen',
            saveHistory: {
                label: 'Verlauf speichern',
                description: 'Generierte Passwörter lokal speichern'
            },
            analytics: {
                label: 'Analytics',
                description: 'Anonyme Nutzungsstatistiken'
            },
            shareUsage: {
                label: 'Nutzung teilen',
                description: 'Nutzungsdaten für Verbesserungen teilen'
            },
            exportHistory: {
                label: 'Verlauf exportieren',
                description: 'Passwortverlauf in Datei exportieren'
            },
            backupSettings: {
                label: 'Einstellungen sichern',
                description: 'Einstellungen automatisch sichern'
            }
        },

        // Pro-Features
        proFeatures: {
            title: 'Pro-Features',
            description: 'Erweiterte Einstellungen und Premium-Features',
            securityAudit: {
                label: 'Sicherheits-Audit',
                description: 'Umfassende Sicherheitsanalyse',
                buttonText: 'Audit starten'
            },
            breachCheck: {
                label: 'Datenleck-Prüfung',
                description: 'Passwörter gegen bekannte Datenlecks prüfen'
            },
            strengthAnalytics: {
                label: 'Stärke-Analytics',
                description: 'Erweiterte Passwortstärke-Analyse'
            }
        }
    },

    // Accounting und Sicherheit
    accounting: {
        // Login und Authentifizierung
        login: {
            title: 'Anmelden',
            emailPlaceholder: 'E-Mail-Adresse eingeben',
            magicLinkSent: 'Magic Link gesendet!',
            magicLinkError: 'Fehler beim Senden des Magic Links',
            verificationSuccess: 'E-Mail erfolgreich verifiziert!',
            verificationError: 'E-Mail-Verifikation fehlgeschlagen',
            rateLimitExceeded: 'Zu viele Anmeldeversuche. Bitte warten Sie.',
            sessionExpired:
                'Sitzung abgelaufen. Bitte melden Sie sich erneut an.'
        },

        // Account-Management
        account: {
            title: 'Account-Verwaltung',
            profile: 'Profil',
            settings: 'Einstellungen',
            logout: 'Abmelden',
            logoutSuccess: 'Erfolgreich abgemeldet',
            accountCreated: 'Account erfolgreich erstellt',
            accountUpdated: 'Account erfolgreich aktualisiert',
            accountError: 'Fehler bei der Account-Verwaltung'
        },

        // Sicherheits-Events
        security: {
            loginAttempt: 'Anmeldeversuch',
            loginSuccess: 'Erfolgreiche Anmeldung',
            loginFailed: 'Fehlgeschlagene Anmeldung',
            logout: 'Abmeldung',
            sessionExpired: 'Sitzung abgelaufen',
            suspiciousActivity: 'Verdächtige Aktivität',
            verificationSuccess: 'Verifikation erfolgreich',
            verificationFailed: 'Verifikation fehlgeschlagen',
            accountCreated: 'Account erstellt',
            accountUpdated: 'Account aktualisiert',
            securityAudit: 'Sicherheits-Audit durchgeführt'
        },

        // Validierung
        validation: {
            required: 'Dieses Feld ist erforderlich',
            emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            urlInvalid: 'Bitte geben Sie eine gültige URL ein',
            phoneInvalid: 'Bitte geben Sie eine gültige Telefonnummer ein',
            passwordWeak:
                'Passwort muss mindestens 8 Zeichen mit Groß-, Kleinbuchstaben und Zahl enthalten',
            minLength: 'Mindestlänge ist {min} Zeichen',
            maxLength: 'Maximallänge ist {max} Zeichen',
            minValue: 'Mindestwert ist {min}',
            maxValue: 'Maximalwert ist {max}',
            validInput: 'Gültige Eingabe'
        },

        // Context Menu
        contextMenu: {
            exportSettings: 'Einstellungen exportieren',
            importSettings: 'Einstellungen importieren',
            resetToDefault: 'Auf Standard zurücksetzen',
            proMessage:
                '💎 Pro-Nutzer können ihre Einstellungen exportieren und importieren'
        }
    },

    // Modals und Benachrichtigungen
    modals: {
        success: 'Erfolg',
        error: 'Fehler',
        warning: 'Warnung',
        info: 'Information',
        confirm: 'Bestätigen',
        cancel: 'Abbrechen',
        close: 'Schließen',
        loading: 'Lädt...',
        saving: 'Speichern...',
        exporting: 'Exportieren...',
        importing: 'Importieren...',
        resetting: 'Zurücksetzen...'
    },

    // AccountManager Übersetzungen
    accountManager: {
        // Überschriften und Beschreibungen
        pageTitle: 'Account Manager',
        pageDescription:
            'Verwalte deine Sicherheitseinstellungen und Account-Präferenzen',
        welcomeBack: 'Willkommen zurück, {name}! 👋',
        welcomeDescription:
            'Bereit für starke Emoji-Passwörter? Dein Account ist sicher und startklar!',
        returnUserTitle: '👋 Willkommen zurück!',
        returnUserDescription:
            'Wir haben deine E-Mail erkannt. Melde dich schnell wieder an.',
        verificationTitle: '📧 E-Mail prüfen und verifizieren',
        verificationDescription:
            'Prüfe deine E-Mail {email} und klicke auf den Magic Link, um die Einrichtung abzuschließen',
        verifyingTitle: '🔗 Magic Link wird verifiziert...',
        verifyingDescription:
            'Bitte warte, während wir deinen Account verifizieren.',
        verificationErrorTitle: '❌ Verifikation fehlgeschlagen',
        verificationErrorDescription: 'Ein Fehler ist aufgetreten.',

        // Buttons und Aktionen
        buttons: {
            createMagicLink: 'Magic Link erstellen',
            loginToAccount: 'Im Account einloggen',
            checkAccountExists: 'Konto wird geprüft...',
            sendingMagicLink: 'Magic Link wird gesendet...',
            accountExists: 'Konto gefunden – Einloggen...',
            accountNotFound: 'Konto nicht gefunden – wird erstellt...',
            sessionExpired: 'Session abgelaufen – bitte neu anmelden',
            loginAgain: '🔐 Erneut einloggen',
            createNewAccount: 'Neues Konto erstellen',
            resendMagicLink: '🔄 Magic Link erneut senden',
            backToAccountOptions: '← Zurück zu den Account-Optionen',
            addProfile: 'Profil hinzufügen',
            hideProfile: 'Profil ausblenden',
            profileData: 'Profildaten',
            showFullForm: 'Vollständiges Formular anzeigen',
            compactView: 'Kompakte Ansicht'
        },

        // Formular-Labels
        emailLabel: 'E-Mail',
        nameLabel: 'Name',

        // Aktionen
        actions: {
            saveSettings: '💾 Einstellungen speichern',
            backToHome: '🏠 Zurück zu Home',
            skipAccount: '❌ {type} überspringen',
            createAccount: '🚀 {type} Account anlegen',
            settingsSaved: 'Einstellungen erfolgreich gespeichert!'
        },

        // Statistiken
        statistics: {
            storiesGenerated: 'Generierte Stories',
            remainingGenerations: 'Verbleibende Generierungen'
        },

        // Daily generations
        dailyGenerations: 'Tägliche Generierungen',

        // Remaining generations display
        remainingDisplay: '{remaining} / {limit} verbleibend',

        // Vorteile
        benefits: {
            free: {
                dailyGenerations: '5 tägliche sichere Generierungen',
                dailyGenerationsDesc: 'KI-resistente Technologie',
                decentralizedData: 'Dezentrale Datenverarbeitung',
                decentralizedDataDesc: 'Deine Daten bleiben privat',
                webApp: 'Als Webapp nutzbar',
                webAppDesc: 'Sicherer Zugriff von überall'
            },
            pro: {
                unlimitedGenerations: 'Unbegrenzte sichere Generierungen',
                unlimitedGenerationsDesc: 'Keine täglichen Limits',
                aiThreatDetection: 'KI-gestützte Bedrohungserkennung',
                aiThreatDetectionDesc: 'Proaktive Sicherheitsanalyse',
                prioritySupport: 'Prioritäts-Support',
                prioritySupportDesc: 'Schnelle Hilfe bei Fragen',
                browserExtension: 'Browser-Erweiterung (Q4 2025)',
                browserExtensionDesc: 'Sicherheit überall im Web',
                wordpressPlugin: 'WordPress-Plugin (Q4 2025)',
                wordpressPluginDesc: 'Sicherheit in deine Website integrieren'
            }
        },

        // Hilfe-Bereich
        help: {
            title: '💡 Hilfe benötigt?',
            spamFolder:
                '• Prüfe deinen Spam-Ordner, falls du keine E-Mail siehst',
            magicLinkExpiry: '• Magic Links verfallen nach 15 Minuten',
            requestNewLink: '• Du kannst jederzeit einen neuen Link anfordern',
            noPassword: '• Kein Passwort nötig – einfach Link klicken'
        },

        // Footer
        footer: {
            magicLink: 'Magic Link',
            instantSetup: 'Sofort-Setup',
            noSpam: 'Kein Spam',
            text: 'Magic Links werden per E-Mail gesendet und sind 15 Minuten gültig.',
            privacy: 'Deine Daten werden sicher behandelt.'
        },

        // Limits und Hinweise
        canStillGenerate: 'Du kannst weiterhin Emojis generieren!',
        limitReached:
            'Tageslimit erreicht. Upgrade auf PRO für unbegrenzte Generierungen.',

        // Account-Alter
        accountAge: {
            today: 'Heute erstellt',
            yesterday: 'Gestern erstellt',
            days: '{days} Tage',
            weeks: '{weeks} Woche{plural}',
            months: '{months} Monat{plural}',
            years: '{years} Jahr{plural}',
            accountSince: 'Account seit {days} {unit}',
            since: 'seit {days} {unit}',
            day: 'Tag',
            days: 'Tagen',
            accountCreated: 'Account erstellt'
        },

        // Validierung
        validation: {
            emailInvalid: 'Bitte gib eine gültige E-Mail-Adresse ein',
            nameInvalid: 'Bitte gib deinen Namen ein (mindestens 2 Zeichen)'
        },

        // Nachrichten
        messages: {
            settingsReset: 'Einstellungen auf Standard zurückgesetzt',
            exportFailed: 'Export der Einstellungen fehlgeschlagen',
            settingsExported: 'Einstellungen erfolgreich exportiert',
            freeAccountActivated: 'Kostenloser Account aktiviert!'
        },

        // Upgrade-Bereich
        upgrade: {
            upgradeToPro: 'Upgrade auf Pro',
            upgradeToProForFeatures: 'Upgrade auf Pro für erweiterte Features',
            unlimitedGenerations:
                'Unbegrenzte Generierungen und erweiterte Sicherheitsfeatures'
        },

        // Kontextmenü
        contextMenu: {
            exportSettings: 'Einstellungen exportieren',
            importSettings: 'Einstellungen importieren',
            resetToDefault: 'Auf Standard zurücksetzen',
            logout: 'Abmelden',
            settingsMenu: 'Einstellungsmenü'
        },

        // Features
        features: {
            proFeature: 'Pro-Feature'
        },

        // Pro Feature Modal
        proFeatureModal: {
            title: 'Pro-Feature',
            proBenefits: 'Pro-Vorteile:',
            unlimitedGenerations: 'Unbegrenzte Emoji-Generierungen',
            advancedSecurity: 'Erweiterte Sicherheitsfeatures',
            prioritySupport: 'Prioritäts-Support',
            earlyAccess: 'Früher Zugang zu neuen Features',
            maybeLater: 'Vielleicht später',
            upgradeToPro: 'Upgrade auf Pro',
            // Pro Upgrade specific
            proUpgrade: 'Pro Upgrade',
            unlockAdvancedFeatures:
                'Alle erweiterten Features und Einstellungen freischalten',
            upgradeProNow: '💎 Jetzt Pro upgraden'
        },

        // Account-Tiers
        tiers: {
            free: 'KOSTENLOS',
            pro: 'PRO',
            freeAccount: 'Kostenloser Account',
            proAccount: 'Pro Account'
        },

        // Badges
        freeBadge: '✨ KOSTENLOS',
        proBadge: '💎 PRO',

        // Beschreibungen
        freeDescription: '✨ Kostenlose Sicherheit',
        proDescription: '💎 Enterprise-Sicherheit'
    },

    // Allgemeine UI-Texte
    ui: {
        save: 'Speichern',
        cancel: 'Abbrechen',
        reset: 'Zurücksetzen',
        export: 'Exportieren',
        import: 'Importieren',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        add: 'Hinzufügen',
        remove: 'Entfernen',
        search: 'Suchen',
        filter: 'Filtern',
        sort: 'Sortieren',
        refresh: 'Aktualisieren',
        back: 'Zurück',
        next: 'Weiter',
        previous: 'Zurück',
        submit: 'Absenden',
        loading: 'Lädt...',
        error: 'Fehler',
        success: 'Erfolg',
        warning: 'Warnung',
        info: 'Info'
    }
};
