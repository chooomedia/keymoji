// src/data/languages/dech.js
// Swiss German language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'dech',
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
            '🔑 Passwörter neu dacht. 🎯 Unknackbare Emoji-Passwörter. 🌈 Gratis. Sicher. Innovativ. 🤖 KI-resistente Technologie. 🌍 Verfügbar in 15+ Sprache.',
        pageKeywords:
            'Keymoji, emoji passwort, passwort generator, sicherheit, online sicherheit',
        pageInstruction: [
            'Klick "📝 Story" für dini KI Emoji-Gschicht 📖',
            '"Random" isch selbsterklärend 😜.',
            'Nach em Generiere wirds in dini Zwischeablag kopiert! 📋'
        ],
        backToMainText: 'Klick unde 👇 zum zruggchehre',
        backToMainButtonText: 'Zrugg zur Home',
        contactText: 'Hesch e Frog oder e coole Vorschlag?',
        contactButtonText: 'Schick mer e Nachricht! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Klick oder drück Enter zum generierte Emoji-Passwort in d Zwischeablag kopiere',
        successMessage: 'Erfolg, kopiert is Clipboard 💾',
        errorMessage: 'Huch, öppis isch schiefgloffe 🤖',
        dailyLimitReachedMessage: 'Sorry, limit a aafroge erreicht 😔',
        successStoryMessage: 'Erfolg, Emoji Gschicht generiert 🤖',
        errorStoryMessage: 'Fehler, kei Antwort vom Server 🌀',
        emojiDisplayTitle: 'Emoji Passwort Generator',
        dataPrivacyProcessingInfo:
            '🚀 Emoji-Magie über Webhooks und KI! ✨ Date sind wie Strandsand - si bliebe nid.',
        clearButton: '✖️ Lösche',
        storyButton: '📝 Gschicht',
        storyButtonClicked: '📩 Gschicht sende',
        randomButton: '🎲 Zuefällig',
        placeholderText:
            'Verzähl mer e Gschicht und ich generiere Emoji-Passwörter basierend druf...'
    },
    donateButton: {
        text: 'Kauf mer en Kaffee',
        openText: 'Des Menü schliesse',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Din Name',
        emailLabel: '📧 Dini E-Mail',
        messageLabel: '✍🏻 Dini Nachricht',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Sende',
        successMessage: 'Erfolg, Nachricht gsendet - Antwort: < 24 Stunde 🚀',
        errorMessage: 'Es isch en unerwartete Fehler passiert 😟',
        requestErrorMessage:
            'Fehler bim Sende vo de Nachricht, bitte versuechs nomol 🙁',
        smirkingFaceImageAlt: 'keymoji emoji schmunzelnds gsicht 1f60f',
        introductionTitle: 'Hallo, ich bi Christopher',
        introductionText:
            'Frontend-Entwickler und ich liebe es, benutzerfreundlichi Website mit JavaScript, PHP und HTML z gstalte und z programmiere. Zögere nid und schick mer e Nachricht wenn du wotsch.',
        privacyNotice:
            'Si versichert, dini Date sind bi üs in guete Händ 🤲. Dini Detail werde nid a Dritti wytergee 🔒.',
        newsletterLabel: 'Ja, ich möcht de Newsletter abonniere',
        emailText: {
            greeting: 'Willkomme',
            intro: 'Danke fürs Sende vo ere Nachricht 📩!',
            confirmationText:
                'Bitte bestätig dini Aafrag damit Christopher weiss, dass du kei intelligente Bot bisch. Du hesch e Nachricht mit folgende Date gsendet:'
        }
    },
    serviceWorker: {
        updateAvailable: 'E neui Version isch verfüegbar!',
        manualRefreshNeeded:
            'Neui Version aktiviert. Lade jetzt neu für di neuste Features.',
        updateSuccess: 'App erfolgreich aktualisiert! 🎉'
    },
    notFound: {
        message: 'Hoppla! Siite nid gfunde 🚫',
        backButton: 'Zrugg zur Startsiite',
        contactButton: 'Kontaktiere üs'
    },
    blog: {
        readMore: 'Wiiterläse',
        backToBlog: 'Zrugg zum Blog',
        publishedOn: 'Veröffentlicht am',
        author: 'Autor',
        tags: 'Tags',
        readTime: 'Min Läsezyt',
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
        error: 'Fehler passiert',
        success: 'Erfolg',
        warning: 'Warnig',
        info: 'Information',
        copyToClipboard: 'In Zwischeablag kopiere',
        copiedToClipboard: 'In Zwischeablag kopiert',
        generatePassword: 'Passwort generiere',
        clearForm: 'Formular lösche',
        sendMessage: 'Nachricht sende',
        toggleDarkMode: 'Dunkelmodus umschalte',
        toggleLanguage: 'Sproch umschalte'
    },
    validation: {
        required: 'Des Feld isch erforderlich',
        email: 'Bitte gib e gültigi E-Mail-Adräss i',
        minLength: 'Muesch mindestens {min} Zeiche lang si',
        maxLength: 'Darf nid meh als {max} Zeiche ha',
        invalidFormat: 'Ungültigs Format',
        serverError: 'Serverfehler, bitte versuechs nomol',
        networkError: 'Netzwerkfehler, bitte überprüf dini Verbindig'
    }
};
