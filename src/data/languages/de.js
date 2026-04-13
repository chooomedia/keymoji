// src/data/languages/de.js
// German language content

import { formatVersion } from '../../utils/version';

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
            '🔑 Einprägsame Passwörter, kein Aufwand. 🎯 Unknackbare Emoji-Sequenzen. 🌍 15+ Sprachen. 🔒 DSGVO-konform.',
        pageKeywords:
            'Keymoji, emoji passwort, passwort generator, sicherheit, online sicherheit',
        pageInstruction: [
            'Wähle deine KI und erstelle deine Keymoji-Story',
            '"Random" ist selbsterklärend 😜.',
            'Nach dem Generieren wird es in deine Zwischenablage kopiert! 📋'
        ],
        levelHint: 'Level bestimmt die Anzahl der Emojis im Passwort — mehr Emojis bedeuten mehr Sicherheit.',
        setupStoryMode: 'Eigene KI nutzen',
        setupStoryModeShort: 'Eigene KI nutzen',
        setupStoryModeSwiss: 'Schweizer KI nutzen',
        setupStoryModeSwissShort: 'Schweizer KI',
        setupStoryModeOr: 'oder',
        setupStoryModeBannerCta: '— Erstelle deine Keymoji-Story',
        setupStoryModeBannerText: '😊 Deine Story: Smile ist dein Schlüssel',
        setupStoryModeChip: 'Story Mode aktivieren',
        setupStoryModeDescription:
            'Verbinde dich mit deiner KI für personalisierte Emoji-Passwörter.',
        setupStoryModeSwissDescription:
            'Schweizer KI für datenschutzbewusste Nutzer. Daten bleiben in der Schweiz, DSGVO-konform, Enterprise-Sicherheit. Perfekt für Privatpersonen und Unternehmen, die Datensouveränität schätzen.',
        setupStoryModeSwissTooltip:
            'Schweizer KI (Apertus) - Datenschutzorientierte KI, gehostet in der Schweiz. Deine Daten bleiben in der Schweiz, geschützt durch Schweizer Datenschutzgesetze. DSGVO-konform, Enterprise-Sicherheit. Ideal für datenschutzbewusste Nutzer und Unternehmen, die Datensouveränität benötigen.',
        storyModeReady: 'KI-generierte Emoji-Passwörter bereit 🤖',
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
        clearButton: 'Löschen',
        storyButton: '✨ Geschichte',
        storyButtonClicked: '✨ Geschichte generieren',
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
            'Frontend-Entwickler und ich liebe es, benutzerfreundliche Websites mit TypeScript, JavaScript, PHP und HTML zu gestalten und zu programmieren. Zögere nicht und schick mir eine Nachricht wenn du möchtest.',
        nameLabel: '🧑🏻 Dein Name',
        emailLabel: 'Deine E-Mail',
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
        privacyPolicyUrl: '/privacy',
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
        autoFilledLabel: 'Automatisch aus deinem Konto ausgefüllt',
        emailVerified: 'Verifiziert',
        emailLockedHint: 'Aus deinem Profil'
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
        oopsTitle: 'Hoppla! Seite nicht gefunden',
        oopsDescription:
            'Die Seite, die du suchst, wurde möglicherweise verschoben, gelöscht oder hat nie existiert.',
        quickNavTitle: 'Schnelle Navigation',
        recentEmojisTitle: 'Letzte Keymojis',
        backToHome: 'Zurück zur Startseite',
        prevEmoji: 'Vorheriges Emoji',
        nextEmoji: 'Nächstes Emoji',
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
            'Entwicklungshistorie und Changelog von Keymoji, dem Emoji-Passwort-Generator.',
        currentLabel: 'Aktuell',
        backToTop: 'Nach oben'
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
        resetting: 'Zurücksetzen...',
        closeModal: 'Modal schließen',
        modalClosesIn: 'Modal schließt in {seconds} Sekunden',
        modalClosesInSingular: 'Modal schließt in {seconds} Sekunde'
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
        verificationTitle: '📧 Code eingeben',
        verificationDescription:
            'Gib den 7-stelligen Code ein, den wir an {email} gesendet haben',
        verifyingTitle: '🔑 Code wird geprüft...',
        verifyingDescription:
            'Bitte warte, während wir deinen Code verifizieren.',
        verificationErrorTitle: '❌ Verifikation fehlgeschlagen',
        verificationErrorDescription: 'Ein Fehler ist aufgetreten.',

        // Buttons und Aktionen
        buttons: {
            createMagicLink: 'Code per E-Mail senden',
            loginToAccount: 'Im Account einloggen',
            checkAccountExists: 'Konto wird geprüft...',
            sendingMagicLink: 'Code wird gesendet...',
            accountExists: 'Konto gefunden – Einloggen...',
            accountNotFound: 'Konto nicht gefunden – wird erstellt...',
            sessionExpired: 'Session abgelaufen – bitte neu anmelden',
            loginAgain: '🔐 Erneut einloggen',
            createNewAccount: 'Neues Konto erstellen',
            resendMagicLink: '🔄 Neuen Code senden',
            backToAccountOptions: '← Zurück',
            addProfile: 'Profil hinzufügen',
            hideProfile: 'Profil ausblenden',
            profileData: 'Profildaten',
            showFullForm: 'Vollständiges Formular anzeigen',
            compactView: 'Kompakte Ansicht',
            addName: 'Name hinzufügen'
        },

        // Formular-Labels
        emailLabel: 'E-Mail',
        nameLabel: 'Name',

        // Aktionen
        actions: {
            saveSettings: '💾 Einstellungen speichern',
            backToHome: '← Zurück zu Home',
            skipAccount: '❌ {type} überspringen',
            createAccount: '🚀 {type} Account anlegen',
            settingsSaved: 'Einstellungen erfolgreich gespeichert!'
        },

        // Statistiken
        statistics: {
            storiesGenerated: 'Generierte Stories',
            remainingGenerations: 'Verbleibende Generierungen',
            noDataTitle: 'Keine Daten',
            noDataMessage:
                'Generiere Emojis um deine echten Nutzungsdaten zu sammeln und hier anzuzeigen.',
            refreshButton: 'Neu laden',
            loading: 'Lade...'
        },

        // Daily generations
        dailyGenerations: 'Tägliche Generierungen',

        // Remaining generations display
        remainingDisplay: '{remaining} / {limit}',

        // Demo Chart (when no real data)
        demoChart: {
            title: 'Keine Daten',
            description:
                'Generiere Emojis um deine echten Nutzungsdaten zu sammeln und hier anzuzeigen.',
            cta: 'Erstelle Keymoji'
        },

        // Vorteile
        benefits: {
            free: {
                dailyGenerations: '10 tägliche sichere Generierungen',
                dailyGenerationsDesc:
                    'KI-resistente Technologie für maximale Sicherheit',
                decentralizedData: 'Kostenlose Schweizer KI',
                decentralizedDataDesc:
                    'Apertus, ChatGPT, Gemini, Claude, Mistral & mehr - direkt verwendbar',
                webApp: 'Als Webapp nutzbar',
                webAppDesc: 'Sofort verfügbar - keine Installation nötig'
            },
            pro: {
                unlimitedGenerations: 'Unbegrenzte sichere Generierungen',
                unlimitedGenerationsDesc:
                    'Erstelle so viele Passwörter wie du brauchst - ohne Limits',
                browserExtension: 'Browser-Erweiterung (Q3 2026)',
                browserExtensionDesc:
                    'Sicherheit direkt in deinem Browser - automatisch und überall',
                apiIntegration: 'API-Integration (Q3 2026)',
                apiIntegrationDesc:
                    'Integriere Sicherheit nahtlos in deine eigenen Anwendungen'
            }
        },

        // Verifikations-Bereich
        verification: {
            titleNew: 'Code zur Registrierung',
            titleReturn: 'Code zum Einloggen',
            sentTo: 'Code gesendet an',
            codeLabel: '7-stelliger Bestätigungscode',
            codePlaceholder: '1234567',
            submitCode: '✅ Code bestätigen',
            verifying: 'Wird geprüft...',
            codeError: 'Bitte gib den 7-stelligen Code ein.',
            codeInvalid: 'Ungültiger Code. Bitte prüfe deine E-Mail und versuche es erneut.',
            codeExpired: 'Dieser Code ist abgelaufen. Bitte fordere einen neuen an.',
            serviceUnavailable: 'Verifizierungsdienst nicht verfügbar. Bitte versuche es später erneut.'
        },

        // Login-Fehlermeldungen (basierend auf Server-ErrorCode)
        login: {
            rateLimitExceeded: 'Zu viele Versuche. Bitte warte 10 Minuten.',
            invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
            emailServiceError: 'E-Mail-Dienst ist derzeit nicht verfügbar. Bitte versuche es später erneut.'
        },

        // Datenschutz-Link im Account-Footer
        privacyLink: 'Datenschutz & Datenrechte',

        // Hilfe-Bereich
        help: {
            title: '💡 Hilfe benötigt?',
            spamFolder:
                '• Prüfe deinen Spam-Ordner, falls du keine E-Mail siehst',
            codeExpiry: '• Der Code ist 15 Minuten gültig',
            magicLinkExpiry: '• Codes verfallen nach 15 Minuten',
            requestNewLink: '• Du kannst jederzeit einen neuen Code anfordern',
            noLink: '• Kein Link-Klick nötig – einfach Code eingeben',
            noPassword: '• Kein Passwort nötig – einfach Code eingeben'
        },

        // Footer
        footer: {
            magicLink: 'Easy Login',
            instantSetup: 'Sofort-Setup',
            noSpam: 'Kein Spam',
            text: 'Magic Links werden per E-Mail gesendet und sind 15 Minuten gültig.',
            privacy: 'Datenschutz',
            legal: 'Impressum',
            versionHistory: 'Versionshistorie'
        },

        // Limits und Hinweise
        canStillGenerate: 'Du kannst weiterhin Emojis generieren!',
        limitReached:
            'Tageslimit erreicht. Upgrade auf PRO für unbegrenzte Generierungen.',

        // Account-Alter
        accountAge: {
            today: '✨ FREE: Seit heute!',
            yesterday: '🚀 FREE: Seit gestern!',
            days: '🔥 FREE: Seit {days} Tagen!',
            weeks: '⚡ FREE: Seit {weeks} Woche{plural}!',
            months: '💪 FREE: Seit {months} Monat{plural}!',
            years: '🏆 FREE: Seit {years} Jahr{plural}!',
            accountSince: 'Account seit {days} {unit}',
            since: 'seit {days} {unit}',
            day: 'Tag',
            daysWord: 'Tage', // Word "days" (plural) - renamed from "days" to avoid conflict with format template
            accountCreated: 'Account erstellt',
            createdTodayFree: '✨ Dein brandneuer FREE Account ist startklar!',
            createdTodayPro: '💎 Willkommen im PRO Club – exklusiv seit heute!',
            createdRecentlyFree: '✨ FREE Account – frisch am Start!',
            createdRecentlyPro: '💎 PRO Account – exklusiv und neu!'
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
            settingsImported: 'Einstellungen erfolgreich importiert',
            importFailed: 'Import fehlgeschlagen',
            freeAccountActivated: 'Kostenloser Account aktiviert!',
            chartLoadFailed: 'Chart-Daten konnten nicht geladen werden',
            logoutSuccess: 'Erfolgreich abgemeldet',
            accountFoundSendingCode:
                'Account gefunden! Wir senden dir einen Code.',
            accountFoundSendingLink:
                'Account gefunden! Wir senden dir einen Code.',
            creatingNewAccount:
                'Neues Konto wird erstellt – Code kommt per E-Mail.',
            magicLinkSent:
                'Code gesendet! Gib den 7-stelligen Code aus deiner E-Mail ein.',
            magicLinkSendFailed:
                'Code konnte nicht gesendet werden. Bitte versuche es erneut.',
            otpVerified: 'Code bestätigt – du bist eingeloggt!',
            magicLinkVerified: 'Code erfolgreich bestätigt!',
            magicLinkVerificationFailed: 'Code-Überprüfung fehlgeschlagen',
            chartDataRefreshed: 'Chart-Daten erfolgreich aktualisiert!',
            refreshFailed: 'Aktualisierung fehlgeschlagen',
            noNewData: 'Keine neuen Daten verfügbar'
        },

        // API-Key-Bereich (dynamisch je LLM-Provider)
        apiKeyLabel: 'API-Key',
        apiKeyLabelApertus: 'Hugging Face Token',
        apiKeyLabelCustom: 'Eigener API-Key',
        optional: 'optional',
        verified: 'Verifiziert',
        testBtn: 'Testen',
        apertusBuiltIn:
            'Integrierter Token aktiv — funktioniert ohne eigenen Key.',
        apertusOwnToken:
            'Optional: Eigenen Hugging-Face-Token (hf_…) eingeben, um das persönliche Kontingent zu nutzen.',
        apertusGetToken: 'Kostenlosen HF-Token holen',
        openaiHint: 'Benötigt einen kostenpflichtigen OpenAI API-Key (sk-…).',
        geminiHint:
            'Kostenloses Kontingent verfügbar. Key im Google AI Studio erstellen.',
        claudeHint: 'Benötigt einen Anthropic API-Key (sk-ant-…).',
        mistralHint: 'Europäische KI. Key auf console.mistral.ai erstellen.',
        customHint:
            'OpenAI-kompatibler Endpunkt. Basis-URL und API-Key unten eingeben.',
        getApiKey: 'API-Key holen',
        savedKeys: 'Gespeichert',

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

    consent: {
        title: 'Datenschutz-Einstellungen',
        description: 'Wir verwenden minimale Daten zur Verbesserung Ihrer Erfahrung. Passen Sie Ihre Einstellungen an.',
        analytics: 'Anonyme Nutzungsanalyse',
        analyticsHint: 'Hilft uns die App zu verbessern — keine personenbezogenen Daten',
        saveHistory: 'Lokale Nutzungshistorie speichern',
        saveHistoryHint: 'Nur in Ihrem Browser gespeichert, nie hochgeladen',
        accept: 'Auswahl speichern',
        acceptAll: 'Alle akzeptieren',
        decline: 'Optionale ablehnen',
        moreInfo: 'Datenschutzerklärung',
        legalInfo: 'Impressum',
        privacy: 'Datenschutz & Impressum',
        necessaryTitle: 'Technisch notwendig',
        necessaryHint: 'Für den Betrieb der App erforderlich — immer aktiv',
        necessaryStorage: 'Einstellungen & Design-Präferenz (localStorage)',
        necessarySession: 'Login-Session (nur im Browser-Speicher)',
        necessaryOtp: 'OTP-Code zur Authentifizierung (einmalig per E-Mail)',
        historyDetail: 'Nutzungsdiagramm-Daten (Generierungen pro Tag)',
        historyScope: 'Niemals an Server gesendet — nur in Ihrem Browser',
        analyticsDetail: 'Anonymisierte Seitenaufruf-Zähler (IP auf x.x.x.0 anonymisiert)',
        analyticsProcessor: 'Verarbeitet über unsere eigene n8n-Instanz auf DigitalOcean (EU)'
    },

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
