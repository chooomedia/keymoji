// src/data/languages/it.js
// Italian language content

import { formatVersion } from '../../utils/version';

export default {
    _meta: {
        language: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Apri menu principale',
        closeMainMenu: 'Chiudi menu principale'
    },
    index: {
        pageTitle: 'Generatore di Password Emoji',
        pageDescription:
            "🔑 Password reinventate. 🎯 Password emoji inespugnabili. 🌈 Gratuito. Sicuro. Innovativo. 🤖 Tecnologia resistente all'IA. 🌍 Disponibile in 15+ lingue.",
        pageKeywords:
            'Keymoji, password emoji, generatore password, sicurezza, sicurezza online',
        pageInstruction: [
            'Scegli la tua IA e crea la tua storia Keymoji',
            '"Casuale" è autoesplicativo 😜.',
            'Dopo la generazione, viene salvato negli appunti! 📋'
        ],
        setupStoryMode: 'Usa la tua IA',
        setupStoryModeShort: 'Usa la tua IA',
        setupStoryModeSwiss: 'Usa IA svizzera',
        setupStoryModeSwissShort: 'IA svizzera',
        setupStoryModeOr: 'o',
        setupStoryModeDescription:
            'Connettiti con la tua IA per password emoji personalizzate.',
        setupStoryModeSwissDescription:
            'IA svizzera per utenti attenti alla privacy. I dati rimangono in Svizzera, conformi al GDPR, sicurezza enterprise. Perfetto per privati e aziende che valorizzano la sovranità dei dati.',
        setupStoryModeSwissTooltip:
            'IA svizzera (Apertus) - IA orientata alla privacy, ospitata in Svizzera. I tuoi dati rimangono in Svizzera, protetti dalle leggi svizzere sulla protezione dei dati. Conforme al GDPR, sicurezza di livello enterprise. Ideale per utenti attenti alla privacy e aziende che richiedono sovranità dei dati.',
        storyModeReady: 'Password emoji generate da IA pronte 🤖',
        backToMainText: 'Clicca sotto 👇 per tornare',
        backToMainButtonText: 'Torna alla home',
        contactText: 'Hai una domanda o un suggerimento figo?',
        contactButtonText: 'Mandami un messaggio! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Clicca o premi Invio per copiare la password emoji generata negli appunti',
        successMessage: 'Successo, copiato negli appunti 💾',
        errorMessage: 'Ops, qualcosa è andato storto 🤖',
        dailyLimitReachedMessage:
            'Scusa, limite giornaliero di richieste raggiunto 😔',
        successStoryMessage: 'Successo, storia emoji generata 🤖',
        errorStoryMessage: 'Errore, nessuna risposta dal server 🌀',
        emojiDisplayTitle: 'Generatore di Password Emoji',
        dataPrivacyProcessingInfo:
            '🚀 Magia emoji tramite webhook e IA! ✨ I dati sono come sabbia della spiaggia - non rimangono.',
        clearButton: 'Cancella',
        storyButton: '✨ Storia',
        storyButtonClicked: '✨ Invia storia',
        randomButton: '🎲 Casuale',
        placeholderText:
            'Raccontami una storia e genererò password emoji basate su di essa...',
        clipboardError: 'Errore nel copiare negli appunti'
    },
    donateButton: {
        text: 'Offrimi un caffè',
        openText: 'Chiudi questo menu',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Ciao, sono Christopher',
        pageDescription:
            'Sviluppatore frontend e adoro creare siti web intuitivi con TypeScript, JavaScript, PHP e HTML. Non esitare a scrivermi se vuoi!',
        nameLabel: '🧑🏻 Il tuo nome',
        emailLabel: 'La tua email',
        messageLabel: '✍🏻 Il tuo messaggio',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Invia',
        sendingButton: '📨 Invio...',
        successMessage: 'Successo, messaggio inviato - Risposta: < 24 ore 🚀',
        errorMessage: 'Si è verificato un errore inaspettato 😟',
        requestErrorMessage: "Errore durante l'invio del messaggio, riprova 🙁",
        smirkingFaceImageAlt: 'keymoji emoji faccina sorridente 1f60f',
        introductionTitle: 'Hai una domanda o un suggerimento?',
        introductionText: 'Scrivimi un messaggio!',
        privacyNotice:
            'I tuoi dati sono al sicuro con noi 🤲. I tuoi dettagli non saranno condivisi con terzi 🔒.',
        newsletterLabel: 'Sì, vorrei iscrivermi alla newsletter',
        newsletterOptIn: 'Iscriviti alla newsletter',
        newsletterText:
            'Rimani aggiornato e iscriviti alla newsletter con fiducia. {privacyPolicy}',
        privacyPolicyLink: 'Visualizza politica sulla privacy',
        privacyPolicyUrl: '/privacy',
        backToMainButton: 'Torna alla home',
        footerText: 'Sviluppato con amore',
        validationErrorMessage:
            'Correggi gli errori del modulo prima di inviare 🔍',
        sendingMessage: 'Invio del tuo messaggio... 📨',
        emailText: {
            greeting: 'Benvenuto',
            confirmationText:
                'Per favore conferma la tua richiesta così Christopher sa che non sei un bot intelligente. Hai inviato un messaggio con i seguenti dati:',
            doubleCheck:
                'Abbiamo ricevuto il tuo messaggio con i seguenti dettagli:',
            button: 'Conferma la tua email'
        },
        validation: {
            nameRequired: 'Nome richiesto',
            nameLength: 'Minimo 2 caratteri',
            emailRequired: 'Email richiesta',
            emailInvalid: 'Email non valida',
            messageRequired: 'Messaggio richiesto',
            messageLength: 'Minimo {min} caratteri'
        }
    },
    serviceWorker: {
        updateAvailable: 'Una nuova versione è disponibile!',
        manualRefreshNeeded:
            'Nuova versione attivata. Ricarica ora per le ultime funzionalità.',
        updateSuccess: 'App aggiornata con successo! 🎉'
    },
    notFound: {
        message: 'Ops! Pagina non trovata 🚫',
        backButton: 'Torna alla home',
        contactButton: 'Contattaci'
    },
    blog: {
        readMore: 'Leggi di più',
        backToBlog: 'Torna al blog',
        publishedOn: 'Pubblicato il',
        author: 'Autore',
        tags: 'Tag',
        readTime: 'min di lettura',
        likes: 'mi piace',
        share: 'Condividi'
    },
    account: {
        create: 'Crea account',
        manage: 'Gestisci account',
        login: 'Accedi',
        logout: 'Esci',
        profile: 'Profilo',
        settings: 'Impostazioni',
        guest: 'Ospite',
        free: 'GRATIS',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Vai al contenuto principale',
        closeModal: 'Chiudi modal',
        openMenu: 'Apri menu',
        closeMenu: 'Chiudi menu',
        loading: 'Caricamento...',
        error: 'Errore verificato',
        success: 'Successo',
        warning: 'Avviso',
        info: 'Informazione',
        copyToClipboard: 'Copia negli appunti',
        copiedToClipboard: 'Copiato negli appunti',
        generatePassword: 'Genera password',
        clearForm: 'Cancella modulo',
        sendMessage: 'Invia messaggio',
        toggleDarkMode: 'Attiva modalità scura',
        toggleLanguage: 'Cambia lingua'
    },
    validation: {
        required: 'Questo campo è richiesto',
        email: 'Per favore inserisci un indirizzo email valido',
        minLength: 'Deve contenere almeno {min} caratteri',
        maxLength: 'Non deve contenere più di {max} caratteri',
        invalidFormat: 'Formato non valido',
        serverError: 'Errore del server, riprova',
        networkError: 'Errore di rete, controlla la tua connessione'
    },

    // Traduzioni UserSettings
    userSettings: {
        // Impostazioni di base
        basicSettings: {
            title: 'Impostazioni di base',
            description: 'Lingua, tema e notifiche',
            language: {
                label: 'Lingua',
                description: 'Scegli la tua lingua preferita',
                options: {
                    en: '🇺🇸 Inglese',
                    de: '🇩🇪 Tedesco',
                    fr: '🇫🇷 Francese',
                    es: '🇪🇸 Spagnolo',
                    it: '🇮🇹 Italiano'
                }
            },
            theme: {
                label: 'Tema',
                description: 'Scegli il tuo tema visivo',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Chiaro',
                    dark: '🌙 Scuro'
                }
            },
            notifications: {
                label: 'Notifiche',
                description: 'Ricevi aggiornamenti importanti'
            }
        },

        // Impostazioni di sicurezza
        securitySettings: {
            title: 'Impostazioni di sicurezza',
            description: 'Forza password e tipi di caratteri',
            passwordLength: {
                label: 'Lunghezza password',
                description: 'Scegli la forza della password',
                min: 'Debole (6)',
                max: 'Forte (20)'
            },
            includeNumbers: {
                label: 'Includi numeri',
                description: 'Aggiungi caratteri numerici (0-9)'
            },
            includeSymbols: {
                label: 'Includi simboli',
                description: 'Aggiungi caratteri speciali (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Includi caratteri speciali',
                description: 'Aggiungi caratteri speciali estesi'
            },
            excludeSimilarChars: {
                label: 'Escludi caratteri simili',
                description: 'Evita caratteri confusi (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Caratteri unici richiesti',
                description: 'Nessun carattere ripetuto nella password'
            }
        },

        // Impostazioni Emoji
        emojiSettings: {
            title: 'Impostazioni Emoji',
            description: 'Numero emoji, categorie e pattern',
            emojiCount: {
                label: 'Numero emoji',
                description: 'Numero di emoji nella password',
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Pattern Emoji',
                description: 'Scegli la disposizione delle emoji',
                options: {
                    random: 'Casuale',
                    sequential: 'Sequenziale',
                    alternating: 'Alternato'
                }
            },
            emojiTheme: {
                label: 'Tema Emoji',
                description: 'Scegli lo stile delle emoji',
                options: {
                    mixed: 'Misto',
                    cute: 'Carino',
                    professional: 'Professionale',
                    fantasy: 'Fantasy'
                }
            }
        },

        // Impostazioni di generazione
        generationSettings: {
            title: 'Impostazioni di generazione',
            description: 'Auto-generazione e opzioni appunti',
            autoGenerate: {
                label: 'Auto-generazione',
                description: 'Genera password automaticamente'
            },
            copyToClipboard: {
                label: 'Copia negli appunti',
                description: 'Copia automaticamente le password generate'
            },
            showStrength: {
                label: 'Mostra forza',
                description: 'Mostra indicatore forza password'
            },
            strengthThreshold: {
                label: 'Soglia forza',
                description: 'Forza minima richiesta della password',
                options: {
                    low: 'Bassa',
                    medium: 'Media',
                    high: 'Alta'
                }
            },
            autoRefresh: {
                label: 'Auto-aggiornamento',
                description: 'Rigenera automaticamente password deboli'
            }
        },

        // Impostazioni privacy
        privacySettings: {
            title: 'Impostazioni privacy',
            description: 'Raccolta dati e preferenze condivisione',
            saveHistory: {
                label: 'Salva cronologia',
                description: 'Salva password generate localmente'
            },
            analytics: {
                label: 'Analytics',
                description: 'Statistiche uso anonime'
            },
            shareUsage: {
                label: 'Condividi uso',
                description: 'Condividi dati uso per miglioramenti'
            },
            exportHistory: {
                label: 'Esporta cronologia',
                description: 'Esporta cronologia password in file'
            },
            backupSettings: {
                label: 'Backup impostazioni',
                description: 'Backup automatico impostazioni'
            }
        },

        // Funzionalità Pro
        proFeatures: {
            title: 'Funzionalità Pro',
            description: 'Impostazioni avanzate e funzionalità premium',
            securityAudit: {
                label: 'Audit sicurezza',
                description: 'Analisi sicurezza completa',
                buttonText: 'Esegui audit'
            },
            breachCheck: {
                label: 'Controllo violazioni',
                description: 'Controlla password contro violazioni note'
            },
            strengthAnalytics: {
                label: 'Analytics forza',
                description: 'Analisi avanzata forza password'
            }
        }
    },

    // Accounting e sicurezza
    accounting: {
        // Login e autenticazione
        login: {
            title: 'Accedi',
            emailPlaceholder: 'Inserisci il tuo indirizzo email',
            magicLinkSent: 'Link magico inviato!',
            magicLinkError: "Errore nell'invio del link magico",
            verificationSuccess: 'Email verificata con successo!',
            verificationError: 'Fallimento verifica email',
            rateLimitExceeded: 'Troppi tentativi di accesso. Attendi.',
            sessionExpired: 'Sessione scaduta. Accedi di nuovo.'
        },

        // Gestione account
        account: {
            title: 'Gestione account',
            profile: 'Profilo',
            settings: 'Impostazioni',
            logout: 'Esci',
            logoutSuccess: 'Disconnessione riuscita',
            accountCreated: 'Account creato con successo',
            accountUpdated: 'Account aggiornato con successo',
            accountError: 'Errore nella gestione account'
        },

        // Eventi sicurezza
        security: {
            loginAttempt: 'Tentativo di accesso',
            loginSuccess: 'Accesso riuscito',
            loginFailed: 'Fallimento accesso',
            logout: 'Disconnessione',
            sessionExpired: 'Sessione scaduta',
            suspiciousActivity: 'Attività sospetta',
            verificationSuccess: 'Verifica riuscita',
            verificationFailed: 'Fallimento verifica',
            accountCreated: 'Account creato',
            accountUpdated: 'Account aggiornato',
            securityAudit: 'Audit sicurezza eseguito'
        },

        // Validazione
        validation: {
            required: 'Questo campo è richiesto',
            emailInvalid: 'Inserisci un indirizzo email valido',
            urlInvalid: 'Inserisci un URL valido',
            phoneInvalid: 'Inserisci un numero di telefono valido',
            passwordWeak:
                'La password deve contenere almeno 8 caratteri con maiuscole, minuscole e numeri',
            minLength: 'Lunghezza minima è {min} caratteri',
            maxLength: 'Lunghezza massima è {max} caratteri',
            minValue: 'Valore minimo è {min}',
            maxValue: 'Valore massimo è {max}',
            validInput: 'Input valido'
        },

        // Menu contestuale
        contextMenu: {
            exportSettings: 'Esporta impostazioni',
            importSettings: 'Importa impostazioni',
            resetToDefault: 'Ripristina valori predefiniti',
            proMessage:
                '💎 Gli utenti Pro possono esportare e importare le loro impostazioni'
        }
    },

    // Modali e notifiche
    modals: {
        success: 'Successo',
        error: 'Errore',
        warning: 'Avviso',
        info: 'Informazione',
        confirm: 'Conferma',
        cancel: 'Annulla',
        close: 'Chiudi',
        loading: 'Caricamento...',
        saving: 'Salvataggio...',
        exporting: 'Esportazione...',
        importing: 'Importazione...',
        resetting: 'Ripristino...',
        closeModal: 'Chiudi modal',
        modalClosesIn: 'Il modal si chiude in {seconds} secondi',
        modalClosesInSingular: 'Il modal si chiude in {seconds} secondo'
    },
    versions: {
        pageTitle: 'Cronologia versioni',
        pageDescription:
            'Scopri la cronologia di sviluppo e il changelog di Keymoji, il generatore di password emoji.'
    },

    // Traduzioni AccountManager
    accountManager: {
        // Titoli e descrizioni di pagina
        pageTitle: 'Gestore account',
        pageDescription:
            'Gestisci le tue impostazioni di sicurezza e preferenze account',
        welcomeBack: 'Bentornato, {name}! 👋',
        welcomeDescription:
            'Pronto a creare password emoji incredibili? Il tuo account è sicuro e pronto!',
        returnUserTitle: '👋 Bentornato!',
        returnUserDescription:
            'Abbiamo riconosciuto il tuo indirizzo email. Accedi rapidamente.',
        verificationTitle: '📧 Controlla la tua email e verifica',
        verificationDescription:
            'Controlla la tua email {email} e clicca sul link magico per completare la configurazione',
        verifyingTitle: '🔗 Verifica link magico...',
        verifyingDescription: 'Attendi mentre verifichiamo il tuo account.',
        verificationErrorTitle: '❌ Errore di verifica',
        verificationErrorDescription: 'Si è verificato un errore.',

        // Pulsanti e azioni
        buttons: {
            createMagicLink: 'Crea link magico',
            loginToAccount: "Accedi all'account",
            checkAccountExists: 'Verifica account...',
            sendingMagicLink: 'Invio link magico...',
            accountExists: 'Account trovato - Accesso...',
            accountNotFound: 'Account non trovato - Creazione...',
            sessionExpired: 'Sessione scaduta - Accedi nuovamente',
            loginAgain: '🔐 Accedi nuovamente',
            createNewAccount: 'Crea nuovo account',
            resendMagicLink: '🔄 Invia nuovo codice',
            backToAccountOptions: '← Indietro',
            addProfile: 'Aggiungi',
            hideProfile: 'Nascondi',
            profileData: 'Dati profilo',
            showFullForm: 'Mostra modulo completo',
            compactView: 'Vista compatta',
            addName: 'Aggiungi il tuo nome'
        },

        // Etichette modulo
        emailLabel: 'Email',
        nameLabel: 'Nome',

        // Azioni
        actions: {
            saveSettings: '💾 Salva impostazioni',
            backToHome: '🏠 Torna alla home',
            skipAccount: '❌ Salta {type}',
            createAccount: '🚀 Crea account {type}',
            settingsSaved: 'Impostazioni salvate con successo!'
        },

        // Statistiche
        statistics: {
            storiesGenerated: 'Storie generate',
            remainingGenerations: 'Generazioni rimanenti'
        },

        // Generazioni giornaliere
        dailyGenerations: 'Generazioni giornaliere',

        // Visualizzazione generazioni rimanenti
        remainingDisplay: '{remaining} / {limit}',

        // Vantaggi
        benefits: {
            free: {
                dailyGenerations: '10 generazioni sicure giornaliere',
                dailyGenerationsDesc:
                    "Tecnologia resistente all'IA per la massima sicurezza",
                decentralizedData: 'IA svizzera gratuita',
                decentralizedDataDesc:
                    'Usa Apertus, ChatGPT, Gemini, Claude, Mistral e altro - direttamente utilizzabile',
                webApp: 'Disponibile come app web',
                webAppDesc:
                    'Disponibile istantaneamente - nessuna installazione necessaria'
            },
            pro: {
                unlimitedGenerations: 'Generazioni sicure illimitate',
                unlimitedGenerationsDesc:
                    'Crea tutte le password che vuoi - senza limiti',
                browserExtension: 'Estensione browser (Q4 2025)',
                browserExtensionDesc:
                    'Sicurezza direttamente nel tuo browser - automaticamente e ovunque',
                apiIntegration: 'Integrazione API (Q4 2025)',
                apiIntegrationDesc:
                    'Integra la sicurezza in modo trasparente nelle tue applicazioni'
            }
        },

        // Verifica OTP
        verification: {
            titleNew: 'Codice di registrazione',
            titleReturn: 'Codice di accesso',
            sentTo: 'Codice inviato a',
            codeLabel: 'Codice di conferma a 7 cifre',
            codePlaceholder: '1234567',
            submitCode: '✅ Conferma codice',
            verifying: 'Verifica in corso...',
            codeError: 'Inserisci il codice a 7 cifre.',
            codeInvalid: 'Codice non valido o scaduto. Richiedine uno nuovo.'
        },

        // Sezione aiuto
        help: {
            title: '💡 Hai bisogno di aiuto?',
            spamFolder: "• Controlla la cartella spam se non vedi l'email",
            codeExpiry: '• Il codice è valido per 15 minuti',
            magicLinkExpiry: '• I codici scadono dopo 15 minuti',
            requestNewLink: '• Puoi richiedere un nuovo codice in qualsiasi momento',
            noLink: '• Nessun clic su link necessario — inserisci semplicemente il codice',
            noPassword: '• Nessuna password richiesta — inserisci semplicemente il codice'
        },

        // Footer
        footer: {
            magicLink: 'Link magico',
            instantSetup: 'Configurazione istantanea',
            noSpam: 'Nessuno spam',
            text: 'I link magici vengono inviati via email e sono validi per 15 minuti.',
            privacy: 'I tuoi dati vengono gestiti in modo sicuro.'
        },

        // Limiti e messaggi
        canStillGenerate: 'Puoi ancora generare emoji!',
        limitReached:
            'Limite giornaliero raggiunto. Passa a PRO per generazioni illimitate.',

        // Età account
        accountAge: {
            today: '✨ FREE: Da oggi!',
            yesterday: '🚀 FREE: Da ieri!',
            days: '🔥 FREE: Da {days} giorni!',
            weeks: '⚡ FREE: Da {weeks} settimana{plural}!',
            months: '💪 FREE: Da {months} mese{plural}!',
            years: '🏆 FREE: Da {years} anno{plural}!',
            accountSince: 'Account da {days} {unit}',
            since: 'da {days} {unit}',
            day: 'giorno',
            days: 'giorni',
            accountCreated: 'Account creato',
            createdTodayFree: '✨ Il tuo nuovo account FREE è pronto!',
            createdTodayPro: '💎 Benvenuto nel club PRO – esclusivo da oggi!',
            createdRecentlyFree: '✨ Account FREE – fresco di giornata!',
            createdRecentlyPro: '💎 Account PRO – esclusivo e nuovo!'
        },

        // Validazione
        validation: {
            emailInvalid: 'Inserisci un indirizzo email valido',
            nameInvalid: 'Inserisci il tuo nome (minimo 2 caratteri)'
        },

        // Messaggi
        messages: {
            settingsReset: 'Impostazioni ripristinate ai valori predefiniti',
            exportFailed: "Errore durante l'esportazione delle impostazioni",
            settingsExported: 'Impostazioni esportate con successo',
            freeAccountActivated: 'Account gratuito attivato!'
        },

        // Apertus Info
        apertusInfo:
            'Esclusivo su Keymoji: Apertus – il LLM svizzero. Prima volta disponibile per gli utenti. Ospitato su HuggingFace, fornito via workflow n8n.',

        // Sezione aggiornamento
        upgrade: {
            upgradeToPro: 'Passa a Pro',
            upgradeToProForFeatures: 'Passa a Pro per funzionalità avanzate',
            unlimitedGenerations:
                'Generazioni illimitate e funzionalità di sicurezza avanzate'
        },

        // Menu contestuale
        contextMenu: {
            exportSettings: 'Esporta impostazioni',
            importSettings: 'Importa impostazioni',
            resetToDefault: 'Ripristina ai valori predefiniti',
            logout: 'Disconnetti',
            settingsMenu: 'Menu impostazioni'
        },

        // Funzionalità
        features: {
            proFeature: 'Funzionalità Pro'
        },

        // Modal funzionalità Pro
        proFeatureModal: {
            title: 'Funzionalità Pro',
            proBenefits: 'Vantaggi Pro:',
            unlimitedGenerations: 'Generazioni emoji illimitate',
            advancedSecurity: 'Funzionalità di sicurezza avanzate',
            prioritySupport: 'Supporto prioritario',
            earlyAccess: 'Accesso anticipato alle nuove funzionalità',
            maybeLater: 'Forse più tardi',
            upgradeToPro: 'Passa a Pro',
            // Aggiornamento Pro specifico
            proUpgrade: 'Aggiornamento Pro',
            unlockAdvancedFeatures:
                'Sblocca tutte le funzionalità e impostazioni avanzate',
            upgradeProNow: '💎 Passa a Pro ora'
        },

        // Livelli account
        tiers: {
            free: 'GRATIS',
            pro: 'PRO',
            freeAccount: 'Account gratuito',
            proAccount: 'Account Pro'
        },

        // Badge
        freeBadge: '✨ GRATIS',
        proBadge: '💎 PRO',

        // Descrizioni
        freeDescription: '✨ Sicurezza gratuita',
        proDescription: '💎 Sicurezza aziendale'
    },

    // Testi UI generali
    ui: {
        save: 'Salva',
        cancel: 'Annulla',
        reset: 'Ripristina',
        export: 'Esporta',
        import: 'Importa',
        delete: 'Elimina',
        edit: 'Modifica',
        add: 'Aggiungi',
        remove: 'Rimuovi',
        search: 'Cerca',
        filter: 'Filtra',
        sort: 'Ordina',
        refresh: 'Aggiorna',
        back: 'Indietro',
        next: 'Avanti',
        previous: 'Precedente',
        submit: 'Invia',
        loading: 'Caricamento...',
        error: 'Errore',
        success: 'Successo',
        warning: 'Avviso',
        info: 'Info'
    }
};
