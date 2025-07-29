// src/data/languages/af.js
// Afrikaans language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'af',
        name: 'Afrikaans',
        nativeName: 'Afrikaans',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Open hoofmenu',
        closeMainMenu: 'Sluit hoofmenu'
    },
    index: {
        pageTitle: 'Emoji Wagwoord Generator',
        pageDescription:
            '🔑 Wagwoorde heruitgevind. 🎯 Onkraakbare emoji wagwoorde. 🌈 Gratis. Veilig. Innovatief. 🤖 AI-weerstandige tegnologie. 🌍 Beskikbaar in 15+ tale.',
        pageKeywords:
            'Keymoji, emoji wagwoord, wagwoord generator, sekuriteit, aanlyn sekuriteit',
        pageInstruction: [
            'Klik "📝 Storie" vir jou AI emoji storie 📖',
            '"Ewekansig" spreek vir homself 😜.',
            'Na generering word dit in jou knipbord gestoor! 📋'
        ],
        backToMainText: 'Klik hieronder 👇 om terug te gaan',
        backToMainButtonText: 'Terug na home',
        contactText: "Het jy 'n vraag of 'n cool voorstel?",
        contactButtonText: "Stuur my 'n boodskap! 💌"
    },
    emojiDisplay: {
        clickToCopy:
            'Klik of druk Enter om die gegenereerde emoji wagwoord na knipbord te kopieer',
        successMessage: 'Sukses, gekopieer na knipbord 💾',
        errorMessage: 'Oeps, iets het verkeerd gegaan 🤖',
        dailyLimitReachedMessage:
            'Jammer, daaglikse limiet van versoeke bereik 😔',
        successStoryMessage: 'Sukses, emoji storie gegenereer 🤖',
        errorStoryMessage: 'Fout, geen antwoord van bediener 🌀',
        emojiDisplayTitle: 'Emoji Wagwoord Generator',
        dataPrivacyProcessingInfo:
            '🚀 Emoji magie via webhooks en AI! ✨ Data is soos strand sand - dit bly nie.',
        clearButton: '✖️ Maak skoon',
        storyButton: '📝 Storie',
        storyButtonClicked: '📩 Stuur storie',
        randomButton: '🎲 Ewekansig',
        placeholderText:
            "Vertel my 'n storie en ek sal emoji wagwoorde genereer gebaseer daarop...",
        clipboardError: 'Fout met kopieer na knipbord'
    },
    donateButton: {
        text: "Koop vir my 'n koffie",
        openText: 'Sluit hierdie spyskaart',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Hallo, ek is Christopher',
        pageDescription:
            "Voorkant ontwikkelaar en ek hou daarvan om gebruikersvriendelike webwerwe te ontwerp en te kodeer met JavaScript, PHP en HTML. Moenie huiwer nie en stuur my 'n boodskap as jy wil.",
        nameLabel: '🧑🏻 Jou naam',
        emailLabel: '📧 Jou e-pos',
        messageLabel: '✍🏻 Jou boodskap',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Stuur',
        sendingButton: '📨 Stuur...',
        successMessage: 'Sukses, boodskap gestuur - Antwoord: < 24 uur 🚀',
        errorMessage: "'n Onverwagte fout het voorgekom 😟",
        requestErrorMessage:
            'Fout met die stuur van die boodskap, probeer asseblief weer 🙁',
        smirkingFaceImageAlt: 'keymoji emoji grynslag gesig 1f60f',
        introductionTitle: "Het jy 'n vraag of 'n cool voorstel?",
        introductionText: "Stuur my 'n boodskap!",
        privacyNotice:
            'Wees verseker, jou data is in goeie hande by ons 🤲. Jou besonderhede sal nie aan derdes oorgedra word nie 🔒.',
        newsletterLabel: 'Ja, ek wil inskryf vir die nuusbrief',
        backToMainButton: 'Terug na home',
        footerText: 'Ontwikkel met liefde',
        validationErrorMessage:
            'Los asseblief die vormfoute op voor die indiening 🔍',
        sendingMessage: 'Stuur jou boodskap... 📨',
        emailText: {
            greeting: 'Welkom',
            intro: "Dankie vir die stuur van 'n boodskap 📩!",
            confirmationText:
                "Bevestig asseblief jou versoek sodat Christopher weet dat jy nie 'n intelligente bot is nie. Jy het 'n boodskap gestuur met die volgende data:",
            doubleCheck:
                'Ons het jou boodskap ontvang met die volgende besonderhede:',
            button: 'Bevestig jou e-pos',
            subject: 'Jou boodskap aan Keymoji is ontvang',
            privacy: 'Jou data word veilig hanteer.'
        },
        validation: {
            nameRequired: 'Naam benodig',
            nameLength: 'Minimum 2 karakters',
            emailRequired: 'E-pos benodig',
            emailInvalid: 'Ongeldige e-pos',
            messageRequired: 'Boodskap benodig',
            messageLength: 'Minimum {min} karakters'
        }
    },
    serviceWorker: {
        updateAvailable: "Daar is 'n nuwe weergawe beskikbaar!",
        manualRefreshNeeded:
            'Nuwe weergawe geaktiveer. Herlaai nou vir die nuutste funksies.',
        updateSuccess: 'App suksesvol opgedateer! 🎉'
    },
    notFound: {
        pageTitle: '404 - Bladsy nie gevind nie',
        pageDescription: 'Die bladsy wat jy soek bestaan nie of is verskuif.',
        message: 'Oeps! Bladsy nie gevind nie 🚫',
        suggestion:
            'Die bladsy wat jy soek is moontlik verskuif, verwyder of het nooit bestaan nie.',
        backButton: 'Terug na tuis',
        contactButton: 'Kontak ons',
        navigationTitle: 'Beskikbare bladsye',
        recentEmojis: "Onlangse emoji's"
    },
    blog: {
        readMore: 'Lees meer',
        backToBlog: 'Terug na blog',
        publishedOn: 'Gepubliseer op',
        author: 'Outeur',
        tags: 'Merkers',
        readTime: 'min leestyd',
        likes: 'hou van',
        share: 'Deel'
    },
    account: {
        create: 'Skep rekening',
        manage: 'Bestuur rekening',
        login: 'Teken in',
        logout: 'Teken uit',
        profile: 'Profiel',
        settings: 'Instellings',
        guest: 'Gas',
        free: 'GRATIS',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Slaan oor na hoofinhoud',
        closeModal: 'Sluit modal',
        openMenu: 'Open spyskaart',
        closeMenu: 'Sluit spyskaart',
        loading: 'Laai...',
        error: 'Fout voorgekom',
        success: 'Sukses',
        warning: 'Waarskuwing',
        info: 'Inligting',
        copyToClipboard: 'Kopieer na knipbord',
        copiedToClipboard: 'Gekopieer na knipbord',
        generatePassword: 'Genereer wagwoord',
        clearForm: 'Maak vorm skoon',
        sendMessage: 'Stuur boodskap',
        toggleDarkMode: 'Wissel donker modus',
        toggleLanguage: 'Wissel taal'
    },
    validation: {
        required: 'Hierdie veld is verpligtend',
        email: "Voer asseblief 'n geldige e-posadres in",
        minLength: 'Moet ten minste {min} karakters bevat',
        maxLength: 'Mag nie meer as {max} karakters bevat nie',
        invalidFormat: 'Ongeldige formaat',
        serverError: 'Bediener fout, probeer weer',
        networkError: 'Netwerk fout, kontroleer jou verbinding'
    },
    versions: {
        pageTitle: 'Weergawe Geskiedenis',
        pageDescription:
            'Kyk na die ontwikkelingsgeskiedenis en veranderingslog van Keymoji, die emoji wagwoord generator.'
    }
};
