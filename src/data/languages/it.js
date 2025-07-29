// src/data/languages/it.js
// Italian language content

import { formatVersion } from '../../utils/version.js';

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
            'Clicca "📝 Storia" per la tua favola emoji IA 📖',
            '"Casuale" è autoesplicativo 😜.',
            'Dopo la generazione, viene salvato negli appunti! 📋'
        ],
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
        clearButton: '✖️ Cancella',
        storyButton: '📝 Storia',
        storyButtonClicked: '📩 Invia storia',
        randomButton: '🎲 Casuale',
        placeholderText:
            'Raccontami una storia e genererò password emoji basate su di essa...'
    },
    donateButton: {
        text: 'Offrimi un caffè',
        openText: 'Chiudi questo menu',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Il tuo nome',
        emailLabel: '📧 La tua email',
        messageLabel: '✍🏻 Il tuo messaggio',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Invia',
        successMessage: 'Successo, messaggio inviato - Risposta: < 24 ore 🚀',
        errorMessage: 'Si è verificato un errore imprevisto 😟',
        requestErrorMessage: "Errore nell'invio del messaggio, riprova 🙁",
        smirkingFaceImageAlt: 'keymoji emoji faccia sorridente 1f60f',
        introductionTitle: 'Ciao, sono Christopher',
        introductionText:
            'Sviluppatore frontend e amo progettare e codificare siti web user-friendly con JavaScript, PHP e HTML. Non esitare e mandami un messaggio se ti piace.',
        privacyNotice:
            'Sii sicuro, i tuoi dati sono in buone mani con noi 🤲. I tuoi dettagli non saranno trasmessi a terzi 🔒.',
        newsletterLabel: 'Sì, vorrei iscrivermi alla newsletter',
        emailText: {
            greeting: 'Benvenuto',
            intro: 'Grazie per aver inviato un messaggio 📩!',
            confirmationText:
                'Per favore conferma la tua richiesta così Christopher sa che non sei un bot intelligente. Hai inviato un messaggio con i seguenti dati:'
        }
    },
    serviceWorker: {
        updateAvailable: 'È disponibile una nuova versione!',
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
        skipToMain: 'Salta al contenuto principale',
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
        required: 'Questo campo è obbligatorio',
        email: 'Inserisci un indirizzo email valido',
        minLength: 'Deve contenere almeno {min} caratteri',
        maxLength: 'Non deve superare {max} caratteri',
        invalidFormat: 'Formato non valido',
        serverError: 'Errore del server, riprova',
        networkError: 'Errore di rete, verifica la tua connessione'
    }
};
