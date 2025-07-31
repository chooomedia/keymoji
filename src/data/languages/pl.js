// src/data/languages/pl.js
// Polish language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'pl',
        name: 'Polish',
        nativeName: 'Polski',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Otwórz menu główne',
        closeMainMenu: 'Zamknij menu główne'
    },
    index: {
        pageTitle: 'Generator Haseł Emoji',
        pageDescription:
            '🔑 Hasła na nowo wymyślone. 🎯 Niezłamalne hasła emoji. 🌈 Darmowe. Bezpieczne. Innowacyjne. 🤖 Technologia odporna na AI. 🌍 Dostępne w 15+ językach.',
        pageKeywords:
            'Keymoji, hasło emoji, generator haseł, bezpieczeństwo, bezpieczeństwo online',
        pageInstruction: [
            'Kliknij "📝 Historia" dla swojej historii emoji AI 📖',
            '"Losowe" mówi samo za siebie 😜.',
            'Po wygenerowaniu zostanie skopiowane do schowka! 📋'
        ],
        backToMainText: 'Kliknij poniżej 👇 aby wrócić',
        backToMainButtonText: 'Wróć do strony głównej',
        contactText: 'Masz pytanie lub fajną sugestię?',
        contactButtonText: 'Wyślij mi wiadomość! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Kliknij lub naciśnij Enter aby skopiować wygenerowane hasło emoji do schowka',
        successMessage: 'Sukces, skopiowane do schowka 💾',
        errorMessage: 'Ups, coś poszło nie tak 🤖',
        dailyLimitReachedMessage:
            'Przepraszamy, osiągnięto dzienny limit żądań 😔',
        successStoryMessage: 'Sukces, historia emoji wygenerowana 🤖',
        errorStoryMessage: 'Błąd, brak odpowiedzi z serwera 🌀',
        emojiDisplayTitle: 'Generator Haseł Emoji',
        dataPrivacyProcessingInfo:
            '🚀 Magia emoji przez webhooki i AI! ✨ Dane są jak piasek na plaży - nie zostają.',
        clearButton: '✖️ Wyczyść',
        storyButton: '📝 Historia',
        storyButtonClicked: '📩 Wyślij historię',
        randomButton: '🎲 Losowe',
        placeholderText:
            'Opowiedz mi historię a wygeneruję hasła emoji na jej podstawie...',
        clipboardError: 'Błąd podczas kopiowania do schowka'
    },
    donateButton: {
        text: 'Kup mi kawę',
        openText: 'Zamknij to menu',
        textMobile: '☕'
    },
    // Formularz kontaktowy (optymalizowany)
    contactForm: {
        pageTitle: 'Cześć, jestem Christopher',
        pageDescription:
            'Frontend developer i uwielbiam tworzyć przyjazne użytkownikom strony internetowe w JavaScript, PHP i HTML. Nie wahaj się napisać, jeśli chcesz!',
        nameLabel: '🧑🏻 Twoje imię',
        emailLabel: '📧 Twój e-mail',
        messageLabel: '✍🏻 Wiadomość',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Wyślij',
        sendingButton: '📨 Wysyłanie...',
        successMessage: 'Sukces, wiadomość wysłana - Odpowiedź: < 24h 🚀',
        errorMessage: 'Wystąpił nieoczekiwany błąd 😟',
        requestErrorMessage:
            'Błąd podczas wysyłania wiadomości, spróbuj ponownie 🙁',
        smirkingFaceImageAlt: 'keymoji emoji uśmiechnięta twarz 1f60f',
        introductionTitle: 'Masz pytanie lub ciekawą sugestię?',
        introductionText: 'Napisz do mnie!',
        privacyNotice:
            'Twoje dane są u nas bezpieczne 🤲. Nie udostępniamy ich osobom trzecim 🔒.',
        newsletterLabel: 'Tak, chcę otrzymywać newsletter',
        backToMainButton: 'Powrót do strony głównej',
        footerText: 'Stworzone z miłością',
        validationErrorMessage: 'Popraw błędy w formularzu przed wysłaniem 🔍',
        sendingMessage: 'Wysyłanie wiadomości... 📨',
        emailText: {
            greeting: 'Witamy',
            confirmationText:
                'Proszę potwierdź swoją prośbę, aby Christopher wiedział, że nie jesteś botem. Wysłałeś wiadomość z następującymi danymi:',
            doubleCheck:
                'Otrzymaliśmy Twoją wiadomość z następującymi szczegółami:',
            button: 'Potwierdź swój e-mail'
        },
        validation: {
            nameRequired: 'Imię jest wymagane',
            nameLength: 'Minimum 2 znaki',
            emailRequired: 'E-mail jest wymagany',
            emailInvalid: 'Nieprawidłowy adres e-mail',
            messageRequired: 'Wiadomość jest wymagana',
            messageLength: 'Minimum {min} znaków'
        }
    },
    serviceWorker: {
        updateAvailable: 'Dostępna jest nowa wersja!',
        manualRefreshNeeded:
            'Nowa wersja aktywowana. Odśwież teraz dla najnowszych funkcji.',
        updateSuccess: 'Aplikacja pomyślnie zaktualizowana! 🎉'
    },
    notFound: {
        message: 'Ups! Strona nie znaleziona 🚫',
        backButton: 'Wróć do strony głównej',
        contactButton: 'Skontaktuj się z nami'
    },
    blog: {
        readMore: 'Czytaj więcej',
        backToBlog: 'Wróć do bloga',
        publishedOn: 'Opublikowano',
        author: 'Autor',
        tags: 'Tagi',
        readTime: 'min czytania',
        likes: 'polubienia',
        share: 'Udostępnij'
    },
    account: {
        create: 'Utwórz konto',
        manage: 'Zarządzaj kontem',
        login: 'Zaloguj się',
        logout: 'Wyloguj się',
        profile: 'Profil',
        settings: 'Ustawienia',
        guest: 'Gość',
        free: 'DARMOWE',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Przejdź do głównej treści',
        closeModal: 'Zamknij modal',
        openMenu: 'Otwórz menu',
        closeMenu: 'Zamknij menu',
        loading: 'Ładowanie...',
        error: 'Wystąpił błąd',
        success: 'Sukces',
        warning: 'Ostrzeżenie',
        info: 'Informacja',
        copyToClipboard: 'Kopiuj do schowka',
        copiedToClipboard: 'Skopiowane do schowka',
        generatePassword: 'Generuj hasło',
        clearForm: 'Wyczyść formularz',
        sendMessage: 'Wyślij wiadomość',
        toggleDarkMode: 'Przełącz tryb ciemny',
        toggleLanguage: 'Przełącz język'
    },
    validation: {
        required: 'To pole jest wymagane',
        email: 'Proszę wprowadź prawidłowy adres email',
        minLength: 'Musi zawierać co najmniej {min} znaków',
        maxLength: 'Nie może zawierać więcej niż {max} znaków',
        invalidFormat: 'Nieprawidłowy format',
        serverError: 'Błąd serwera, spróbuj ponownie',
        networkError: 'Błąd sieci, sprawdź połączenie'
    },

    // Tłumaczenia UserSettings
    userSettings: {
        // Podstawowe ustawienia
        basicSettings: {
            title: 'Podstawowe ustawienia',
            description: 'Język, motyw i powiadomienia',
            language: {
                label: 'Język',
                description: 'Wybierz preferowany język',
                options: {
                    en: '🇺🇸 Angielski',
                    de: '🇩🇪 Niemiecki',
                    fr: '🇫🇷 Francuski',
                    es: '🇪🇸 Hiszpański',
                    pl: '🇵🇱 Polski'
                }
            },
            theme: {
                label: 'Motyw',
                description: 'Wybierz wizualny motyw',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Jasny',
                    dark: '🌙 Ciemny'
                }
            },
            notifications: {
                label: 'Powiadomienia',
                description: 'Otrzymuj ważne aktualizacje'
            }
        },

        // Ustawienia bezpieczeństwa
        securitySettings: {
            title: 'Ustawienia bezpieczeństwa',
            description: 'Siła hasła i typy znaków',
            passwordLength: {
                label: 'Długość hasła',
                description: 'Wybierz siłę hasła',
                min: 'Słabe (6)',
                max: 'Silne (20)'
            },
            includeNumbers: {
                label: 'Dołącz liczby',
                description: 'Dodaj znaki numeryczne (0-9)'
            },
            includeSymbols: {
                label: 'Dołącz symbole',
                description: 'Dodaj znaki specjalne (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Dołącz znaki specjalne',
                description: 'Dodaj rozszerzone znaki specjalne'
            },
            excludeSimilarChars: {
                label: 'Wyklucz podobne znaki',
                description: 'Unikaj mylących znaków (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Wymagaj unikalnych znaków',
                description: 'Brak powtarzających się znaków w haśle'
            }
        },

        // Ustawienia emoji
        emojiSettings: {
            title: 'Ustawienia emoji',
            description: 'Liczba emoji, kategorie i wzorce',
            emojiCount: {
                label: 'Liczba emoji',
                description: 'Liczba emoji w haśle',
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Wzorzec emoji',
                description: 'Wybierz układ emoji',
                options: {
                    random: 'Losowy',
                    sequential: 'Sekwencyjny',
                    alternating: 'Naprzemienny'
                }
            },
            emojiTheme: {
                label: 'Motyw emoji',
                description: 'Wybierz styl emoji',
                options: {
                    mixed: 'Mieszany',
                    cute: 'Słodki',
                    professional: 'Profesjonalny',
                    fantasy: 'Fantazja'
                }
            }
        },

        // Ustawienia generowania
        generationSettings: {
            title: 'Ustawienia generowania',
            description: 'Auto-generowanie i opcje schowka',
            autoGenerate: {
                label: 'Auto-generowanie',
                description: 'Automatycznie generuj hasła'
            },
            copyToClipboard: {
                label: 'Kopiuj do schowka',
                description: 'Automatycznie kopiuj wygenerowane hasła'
            },
            showStrength: {
                label: 'Pokaż siłę',
                description: 'Pokaż miernik siły hasła'
            },
            strengthThreshold: {
                label: 'Próg siły',
                description: 'Minimalna wymagana siła hasła',
                options: {
                    low: 'Niska',
                    medium: 'Średnia',
                    high: 'Wysoka'
                }
            },
            autoRefresh: {
                label: 'Auto-odświeżanie',
                description: 'Automatycznie regeneruj słabe hasła'
            }
        },

        // Ustawienia prywatności
        privacySettings: {
            title: 'Ustawienia prywatności',
            description: 'Zbieranie danych i preferencje udostępniania',
            saveHistory: {
                label: 'Zapisz historię',
                description: 'Zapisz wygenerowane hasła lokalnie'
            },
            analytics: {
                label: 'Analityka',
                description: 'Anonimowe statystyki użytkowania'
            },
            shareUsage: {
                label: 'Udostępnij użycie',
                description: 'Udostępnij dane użytkowania dla ulepszeń'
            },
            exportHistory: {
                label: 'Eksportuj historię',
                description: 'Eksportuj historię haseł do pliku'
            },
            backupSettings: {
                label: 'Backup ustawień',
                description: 'Automatycznie backup ustawień'
            }
        },

        // Funkcje Pro
        proFeatures: {
            title: 'Funkcje Pro',
            description: 'Zaawansowane ustawienia i funkcje premium',
            securityAudit: {
                label: 'Audyt bezpieczeństwa',
                description: 'Kompleksowa analiza bezpieczeństwa',
                buttonText: 'Wykonaj audyt'
            },
            breachCheck: {
                label: 'Sprawdzenie wycieków',
                description: 'Sprawdź hasła przeciwko znanym wyciekom'
            },
            strengthAnalytics: {
                label: 'Analityka siły',
                description: 'Zaawansowana analiza siły hasła'
            }
        }
    },

    // Księgowość i bezpieczeństwo
    accounting: {
        // Logowanie i uwierzytelnianie
        login: {
            title: 'Zaloguj się',
            emailPlaceholder: 'Wprowadź swój adres email',
            magicLinkSent: 'Magic link wysłany!',
            magicLinkError: 'Błąd podczas wysyłania magic link',
            verificationSuccess: 'Email pomyślnie zweryfikowany!',
            verificationError: 'Weryfikacja email nie powiodła się',
            rateLimitExceeded: 'Za dużo prób logowania. Poczekaj.',
            sessionExpired: 'Sesja wygasła. Zaloguj się ponownie.'
        },

        // Zarządzanie kontem
        account: {
            title: 'Zarządzanie kontem',
            profile: 'Profil',
            settings: 'Ustawienia',
            logout: 'Wyloguj się',
            logoutSuccess: 'Pomyślnie wylogowano',
            accountCreated: 'Konto pomyślnie utworzone',
            accountUpdated: 'Konto pomyślnie zaktualizowane',
            accountError: 'Błąd zarządzania kontem'
        },

        // Zdarzenia bezpieczeństwa
        security: {
            loginAttempt: 'Próba logowania',
            loginSuccess: 'Pomyślne logowanie',
            loginFailed: 'Logowanie nie powiodło się',
            logout: 'Wylogowanie',
            sessionExpired: 'Sesja wygasła',
            suspiciousActivity: 'Podejrzana aktywność',
            verificationSuccess: 'Weryfikacja pomyślna',
            verificationFailed: 'Weryfikacja nie powiodła się',
            accountCreated: 'Konto utworzone',
            accountUpdated: 'Konto zaktualizowane',
            securityAudit: 'Audyt bezpieczeństwa wykonany'
        },

        // Walidacja
        validation: {
            required: 'To pole jest wymagane',
            emailInvalid: 'Wprowadź prawidłowy adres email',
            urlInvalid: 'Wprowadź prawidłowy URL',
            phoneInvalid: 'Wprowadź prawidłowy numer telefonu',
            passwordWeak:
                'Hasło musi zawierać co najmniej 8 znaków z wielkimi, małymi literami i cyframi',
            minLength: 'Minimalna długość to {min} znaków',
            maxLength: 'Maksymalna długość to {max} znaków',
            minValue: 'Minimalna wartość to {min}',
            maxValue: 'Maksymalna wartość to {max}',
            validInput: 'Prawidłowe wprowadzenie'
        },

        // Menu kontekstowe
        contextMenu: {
            exportSettings: 'Eksportuj ustawienia',
            importSettings: 'Importuj ustawienia',
            resetToDefault: 'Przywróć domyślne',
            proMessage:
                '💎 Użytkownicy Pro mogą eksportować i importować swoje ustawienia'
        }
    },

    // Modale i powiadomienia
    modals: {
        success: 'Sukces',
        error: 'Błąd',
        warning: 'Ostrzeżenie',
        info: 'Informacja',
        confirm: 'Potwierdź',
        cancel: 'Anuluj',
        close: 'Zamknij',
        loading: 'Ładowanie...',
        saving: 'Zapisywanie...',
        exporting: 'Eksportowanie...',
        importing: 'Importowanie...',
        resetting: 'Przywracanie...'
    },

    // Ogólne teksty UI
    // Tłumaczenia AccountManager
    accountManager: {
        // Nagłówki i opisy
        pageTitle: 'Zarządzanie kontem',
        pageDescription:
            'Zarządzaj ustawieniami bezpieczeństwa i preferencjami konta',
        welcomeBack: 'Witaj ponownie, {name}! 👋',
        welcomeDescription:
            'Gotowy do tworzenia niesamowitych haseł emoji? Twoje konto jest bezpieczne i gotowe!',
        verificationTitle: '📧 Sprawdź swój email i zweryfikuj',
        verificationDescription:
            'Sprawdź swój email {email} i kliknij magiczny link, aby zakończyć konfigurację',

        // Status konta
        accountStatus: 'Status konta',
        emailLabel: 'Adres email',
        nameLabel: 'Twoje imię',
        profileDataLabel: 'Dane profilu',

        // Poziomy konta
        freeBadge: '✨ DARMOWE',
        proBadge: '💎 PRO',
        freeDescription: '✨ Darmowe bezpieczeństwo',
        proDescription: '💎 Bezpieczeństwo korporacyjne',

        // Korzyści
        benefits: {
            free: {
                title: 'DARMOWE korzyści',
                dailyGenerations: '5 dziennych bezpiecznych generacji',
                dailyGenerationsDesc: 'Technologia odporna na AI',
                decentralizedData: 'Zdecentralizowane przetwarzanie danych',
                decentralizedDataDesc: 'Twoje dane pozostają prywatne',
                webApp: 'Dostępne jako aplikacja web',
                webAppDesc: 'Bezpieczny dostęp zewsząd'
            },
            pro: {
                title: 'PRO korzyści',
                unlimitedGenerations: 'Nieograniczone bezpieczne generacje',
                unlimitedGenerationsDesc: 'Brak dziennych limitów',
                aiThreatDetection: 'Wykrywanie zagrożeń napędzane AI',
                aiThreatDetectionDesc: 'Proaktywna analiza bezpieczeństwa',
                browserExtension: 'Rozszerzenie przeglądarki (Q4 2025)',
                browserExtensionDesc: 'Bezpieczeństwo wszędzie w sieci',
                wordpressPlugin: 'Plugin WordPress (Q4 2025)',
                wordpressPluginDesc: 'Zintegruj bezpieczeństwo w swojej stronie'
            }
        },

        // Dzienny limit
        dailyGenerations: 'Dzienne generacje',
        remainingGenerations: '{remaining} / {limit} pozostało',
        canStillGenerate: 'Nadal możesz generować emoji!',
        limitReached:
            'Dzienny limit osiągnięty. Przejdź na PRO dla nieograniczonych generacji.',

        // Statystyki
        statistics: {
            storiesGenerated: 'Wygenerowane historie',
            remainingGenerations: 'Pozostałe generacje'
        },

        // Akcje
        actions: {
            saveSettings: '💾 Zapisz ustawienia',
            backToHome: '🏠 Wróć do strony głównej',
            createAccount: '🚀 Utwórz konto {type}',
            skipAccount: 'Pomiń konto {type}',
            createMagicLink: '🔐 Utwórz magiczny link',
            sendingMagicLink: '⏳ Wysyłanie magicznego linku...',
            resendMagicLink: '🔄 Wyślij ponownie magiczny link',
            backToAccountOptions: '← Wróć do opcji konta',
            addProfileData: '👤 Dodaj dane profilu',
            hideProfileData: '👤 Ukryj dane profilu'
        },

        // Walidacja formularza
        validation: {
            invalidEmail: '⚠️ Wprowadź prawidłowy adres email',
            invalidName: '⚠️ Wprowadź swoje imię (minimum 2 znaki)',
            requiredField: 'To pole jest wymagane'
        },

        // Sekcja pomocy
        help: {
            title: '💡 Potrzebujesz pomocy?',
            checkSpam: '• Sprawdź folder spam, jeśli nie widzisz emaila',
            linkExpires: '• Magiczne linki wygasają po 15 minutach',
            requestNewLink: '• Możesz poprosić o nowy link w dowolnym momencie',
            noPassword: '• Brak hasła wymagane - po prostu kliknij link'
        },

        // Stopka
        footer: {
            magicLink: '🔒 Magiczny link',
            instantSetup: '⚡ Natychmiastowa konfiguracja',
            noSpam: '🎯 Brak spamu'
        }
    },

    ui: {
        save: 'Zapisz',
        cancel: 'Anuluj',
        reset: 'Przywróć',
        export: 'Eksportuj',
        import: 'Importuj',
        delete: 'Usuń',
        edit: 'Edytuj',
        add: 'Dodaj',
        remove: 'Usuń',
        search: 'Szukaj',
        filter: 'Filtruj',
        sort: 'Sortuj',
        refresh: 'Odśwież',
        back: 'Wstecz',
        next: 'Dalej',
        previous: 'Poprzedni',
        submit: 'Wyślij',
        loading: 'Ładowanie...',
        error: 'Błąd',
        success: 'Sukces',
        warning: 'Ostrzeżenie',
        info: 'Info'
    }
};
