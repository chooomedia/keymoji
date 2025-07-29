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
        }
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
    }
};
