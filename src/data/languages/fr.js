// src/data/languages/fr.js
// French language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'fr',
        name: 'French',
        nativeName: 'Français',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Ouvrir le menu principal',
        closeMainMenu: 'Fermer le menu principal'
    },
    index: {
        pageTitle: 'Générateur de mots de passe Emoji',
        pageDescription:
            "🔑 Les mots de passe réinventés. 🎯 Des mots de passe emoji incassables. 🌈 Gratuit. Sécurisé. Innovant. 🤖 Technologie résistante à l'IA. 🌍 Disponible en 15+ langues.",
        pageKeywords:
            'Keymoji, mot de passe emoji, générateur de mot de passe, sécurité, sécurité en ligne',
        pageInstruction: [
            'Cliquez "📝 Histoire" pour votre conte emoji IA 📖',
            '"Aléatoire" est auto-explicatif 😜.',
            "Après génération, c'est sauvegardé dans votre presse-papiers! 📋"
        ],
        backToMainText: 'Cliquez ci-dessous 👇 pour revenir',
        backToMainButtonText: 'Retour à la home',
        contactText: 'Vous avez une question ou une suggestion cool?',
        contactButtonText: 'Envoyez-moi un message! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Cliquez ou appuyez sur Entrée pour copier le mot de passe emoji généré dans le presse-papiers',
        successMessage: 'Succès, copié dans votre presse-papiers 💾',
        errorMessage: 'Oups, quelque chose a mal tourné 🤖',
        dailyLimitReachedMessage:
            'Désolé, limite quotidienne de demandes atteinte 😔',
        successStoryMessage: 'Succès, histoire emoji générée 🤖',
        errorStoryMessage: 'Erreur, pas de réponse du serveur 🌀',
        emojiDisplayTitle: 'Générateur de mots de passe Emoji',
        dataPrivacyProcessingInfo:
            '🚀 Magie emoji via webhooks et IA! ✨ Les données sont comme le sable de plage - elles ne restent pas.',
        clearButton: '✖️ Effacer',
        storyButton: '📝 Histoire',
        storyButtonClicked: "📩 Envoyer l'histoire",
        randomButton: '🎲 Aléatoire',
        placeholderText:
            'Racontez-moi une histoire et je générerai des mots de passe emoji basés dessus...',
        clipboardError: 'Erreur lors de la copie dans le presse-papiers'
    },
    donateButton: {
        text: 'Offrez-moi un café',
        openText: 'Fermer ce menu',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Votre nom',
        emailLabel: '📧 Votre email',
        messageLabel: '✍🏻 Votre message',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Envoyer',
        sendingButton: '📨 Envoi...',
        successMessage: 'Succès, message envoyé - Réponse: < 24 heures 🚀',
        errorMessage: "Une erreur inattendue s'est produite 😟",
        requestErrorMessage:
            "Erreur lors de l'envoi du message, veuillez réessayer 🙁",
        smirkingFaceImageAlt: 'keymoji emoji visage souriant 1f60f',
        introductionTitle: 'Salut, je suis Christopher',
        introductionText:
            "Développeur frontend et j'aime concevoir et coder des sites web conviviaux avec JavaScript, PHP et HTML. N'hésitez pas et envoyez-moi un message si vous aimez.",
        privacyNotice:
            'Soyez assuré, vos données sont entre de bonnes mains avec nous 🤲. Vos détails ne seront pas transmis à des tiers 🔒.',
        newsletterLabel: "Oui, je souhaite m'abonner à la newsletter",
        backToMainButton: 'Retour à la home',
        footerText: 'Développé avec amour',
        validationErrorMessage:
            'Veuillez corriger les erreurs du formulaire avant de soumettre 🔍',
        sendingMessage: 'Envoi de votre message... 📨',
        emailText: {
            greeting: 'Bienvenue',
            intro: "Merci d'avoir envoyé un message 📩!",
            confirmationText:
                "Veuillez confirmer votre demande pour que Christopher sache que vous n'êtes pas un bot intelligent. Vous avez envoyé un message avec les données suivantes:",
            doubleCheck:
                'Nous avons reçu votre message avec les détails suivants:',
            button: 'Confirmez votre email'
        },
        validation: {
            nameRequired: 'Nom requis',
            nameLength: 'Minimum 2 caractères',
            emailRequired: 'Email requis',
            emailInvalid: 'Email invalide',
            messageRequired: 'Message requis',
            messageLength: 'Minimum {min} caractères'
        }
    },
    serviceWorker: {
        updateAvailable: 'Une nouvelle version est disponible!',
        manualRefreshNeeded:
            'Nouvelle version activée. Rechargez maintenant pour les dernières fonctionnalités.',
        updateSuccess: 'Application mise à jour avec succès! 🎉'
    },
    notFound: {
        message: 'Oups! Page non trouvée 🚫',
        backButton: "Retour à l'accueil",
        contactButton: 'Contactez-nous'
    },
    blog: {
        readMore: 'Lire la suite',
        backToBlog: 'Retour au blog',
        publishedOn: 'Publié le',
        author: 'Auteur',
        tags: 'Tags',
        readTime: 'min de lecture',
        likes: "j'aime",
        share: 'Partager'
    },
    account: {
        create: 'Créer un compte',
        manage: 'Gérer le compte',
        login: 'Se connecter',
        logout: 'Se déconnecter',
        profile: 'Profil',
        settings: 'Paramètres',
        guest: 'Invité',
        free: 'GRATUIT',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Passer au contenu principal',
        closeModal: 'Fermer la modal',
        openMenu: 'Ouvrir le menu',
        closeMenu: 'Fermer le menu',
        loading: 'Chargement...',
        error: 'Erreur survenue',
        success: 'Succès',
        warning: 'Avertissement',
        info: 'Information',
        copyToClipboard: 'Copier dans le presse-papiers',
        copiedToClipboard: 'Copié dans le presse-papiers',
        generatePassword: 'Générer un mot de passe',
        clearForm: 'Effacer le formulaire',
        sendMessage: 'Envoyer un message',
        toggleDarkMode: 'Basculer le mode sombre',
        toggleLanguage: 'Basculer la langue'
    },
    validation: {
        required: 'Ce champ est requis',
        email: 'Veuillez entrer une adresse email valide',
        minLength: 'Doit contenir au moins {min} caractères',
        maxLength: 'Ne doit pas dépasser {max} caractères',
        invalidFormat: 'Format invalide',
        serverError: 'Erreur serveur, veuillez réessayer',
        networkError: 'Erreur réseau, veuillez vérifier votre connexion'
    }
};
