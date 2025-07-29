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
        openMainMenu: 'Open hoofdmenu',
        closeMainMenu: 'Sluit hoofdmenu'
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
            'Na genereren wordt het opgeslagen in je klembord! 📋'
        ],
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
        clearButton: '✖️ Wissen',
        storyButton: '📝 Verhaal',
        storyButtonClicked: '📩 Verhaal versturen',
        randomButton: '🎲 Willekeurig',
        placeholderText:
            'Vertel me een verhaal en ik genereer emoji wachtwoorden gebaseerd daarop...'
    },
    donateButton: {
        text: 'Koop me een koffie',
        openText: 'Sluit dit menu',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Je naam',
        emailLabel: '📧 Je email',
        messageLabel: '✍🏻 Je bericht',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Versturen',
        successMessage: 'Succes, bericht verzonden - Antwoord: < 24 uur 🚀',
        errorMessage: 'Er is een onverwachte fout opgetreden 😟',
        requestErrorMessage:
            'Fout bij het verzenden van het bericht, probeer het opnieuw 🙁',
        smirkingFaceImageAlt: 'keymoji emoji grijnzend gezicht 1f60f',
        introductionTitle: 'Hallo, ik ben Christopher',
        introductionText:
            'Frontend ontwikkelaar en ik hou ervan om gebruiksvriendelijke websites te ontwerpen en coderen met JavaScript, PHP en HTML. Aarzel niet en stuur me een bericht als je wilt.',
        privacyNotice:
            'Wees gerust, je gegevens zijn in goede handen bij ons 🤲. Je details worden niet doorgegeven aan derden 🔒.',
        newsletterLabel: 'Ja, ik wil me abonneren op de nieuwsbrief',
        emailText: {
            greeting: 'Welkom',
            intro: 'Bedankt voor het verzenden van een bericht 📩!',
            confirmationText:
                'Bevestig je verzoek zodat Christopher weet dat je geen intelligente bot bent. Je hebt een bericht verzonden met de volgende gegevens:'
        }
    },
    serviceWorker: {
        updateAvailable: 'Er is een nieuwe versie beschikbaar!',
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
        skipToMain: 'Ga naar hoofdinhoud',
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
        email: 'Voer een geldig emailadres in',
        minLength: 'Moet minimaal {min} tekens bevatten',
        maxLength: 'Mag niet meer dan {max} tekens bevatten',
        invalidFormat: 'Ongeldig formaat',
        serverError: 'Serverfout, probeer het opnieuw',
        networkError: 'Netwerkfout, controleer je verbinding'
    }
};
