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
        backButton: 'Zurück zur Startseite',
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
            'Manage your security settings and account preferences',
        welcomeBack: 'Welcome back, {name}! 👋',
        welcomeDescription:
            'Ready to create some amazing emoji passwords? Your account is secure and ready to go!',
        verificationTitle: '📧 Check Your Email and Verify',
        verificationDescription:
            'Check your email {email} and click the magic link to complete setup',

        // Account Status
        accountStatus: 'Account Status',
        emailLabel: 'Email Address',
        nameLabel: 'Your Name',
        profileDataLabel: 'Profile Data',

        // Account Tiers
        freeBadge: '✨ FREE',
        proBadge: '💎 PRO',
        freeDescription: '✨ Kostenlose Sicherheit',
        proDescription: '💎 Enterprise Security',

        // Button Texts
        buttons: {
            createMagicLink: '✨ Magic Link erstellen',
            loginToAccount: '👤 In Konto einloggen',
            checkAccountExists: '🔄 Konto prüfen...',
            sendingMagicLink: '🔄 Magic Link wird gesendet...',
            accountExists: '✅ Konto gefunden - Einloggen...',
            accountNotFound: '🚫 Konto nicht gefunden - Erstellen...',
            sessionExpired: '🔄 Erneut anmelden',
            loginAgain: '🔄 Erneut anmelden',
            createNewAccount: '👤 Neues Konto erstellen'
        },

        // Benefits
        benefits: {
            free: {
                title: 'FREE Benefits',
                dailyGenerations: '5 tägliche sichere Generierungen',
                dailyGenerationsDesc: 'KI-resistente Technologie',
                decentralizedData: 'Denzentrale Datenverabeitung',
                decentralizedDataDesc: 'Deine Daten bleiben privat',
                webApp: 'Als Webapp nutzbar',
                webAppDesc: 'Sicherer Zugriff von überall'
            },
            pro: {
                title: 'PRO Benefits',
                unlimitedGenerations: 'Unbegrenzte sichere Generierungen',
                unlimitedGenerationsDesc: 'Keine täglichen Limits',
                aiThreatDetection: 'KI-gestützte Bedrohungserkennung',
                aiThreatDetectionDesc: 'Proaktive Sicherheitsanalyse',
                browserExtension: 'Browser-Erweiterung (Q4 2025)',
                browserExtensionDesc: 'Sicherheit überall im Web',
                wordpressPlugin: 'WordPress-Plugin (Q4 2025)',
                wordpressPluginDesc: 'Sicherheit in deine Website integrieren'
            }
        },

        // Daily Limit
        dailyGenerations: 'Daily Generations',
        remainingGenerations: '{remaining} / {limit} remaining',
        canStillGenerate: 'You can still generate emojis!',
        limitReached:
            'Daily limit reached. Upgrade to PRO for unlimited generations.',

        // Statistics
        statistics: {
            storiesGenerated: 'Stories Generated',
            remainingGenerations: 'Remaining Generations'
        },

        // Actions
        actions: {
            saveSettings: '💾 Save Settings',
            backToHome: '🏠 Back to Home',
            createAccount: '🚀 {type} Account anlegen',
            skipAccount: '❌ Auf {type} verzichten',
            createMagicLink: '🔐 Create Magic-Link',
            sendingMagicLink: '⏳ Sending Magic-Link...',
            resendMagicLink: '🔄 Resend Magic Link',
            backToAccountOptions: '← Back to Account Options',
            addProfileData: '👤 Add Profile Data',
            hideProfileData: '👤 Hide Profile Data'
        },

        // Form Validation
        validation: {
            invalidEmail: '⚠️ Please enter a valid email address',
            invalidName: '⚠️ Please enter your name (minimum 2 characters)',
            requiredField: 'This field is required'
        },

        // Help Section
        help: {
            title: '💡 Need Help?',
            checkSpam: "• Check your spam folder if you don't see the email",
            linkExpires: '• Magic links expire after 15 minutes',
            requestNewLink: '• You can request a new link anytime',
            noPassword: '• No password required - just click the link'
        },

        // Footer
        footer: {
            magicLink: '🔒 Magic link',
            instantSetup: '⚡ Instant Setup',
            noSpam: '🎯 No Spam'
        }
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
