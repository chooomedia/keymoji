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
        pageTitle: 'Salut, je suis Christopher',
        pageDescription:
            "Développeur frontend et j'aime concevoir et coder des sites web conviviaux avec JavaScript, PHP et HTML. N'hésitez pas et envoyez-moi un message si vous voulez.",
        nameLabel: '🧑🏻 Votre nom',
        emailLabel: '📧 Votre email',
        messageLabel: '✍🏻 Votre message',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Envoyer',
        sendingButton: '📨 Envoi...',
        successMessage: 'Succès, message envoyé - Réponse : < 24 heures 🚀',
        errorMessage: "Une erreur inattendue s'est produite 😟",
        requestErrorMessage:
            "Erreur lors de l'envoi du message, veuillez réessayer 🙁",
        smirkingFaceImageAlt: 'keymoji emoji visage souriant 1f60f',
        introductionTitle: 'Une question ou une suggestion sympa ?',
        introductionText: 'Envoie-moi un message !',
        privacyNotice:
            'Soyez assuré, vos données sont entre de bonnes mains 🤲. Vos détails ne seront pas transmis à des tiers 🔒.',
        newsletterLabel: "Oui, je souhaite m'abonner à la newsletter",
        newsletterOptIn: "S'abonner à la newsletter",
        newsletterText:
            'Restez à jour et abonnez-vous à la newsletter en toute confiance. {privacyPolicy}',
        privacyPolicyLink: 'Afficher la politique de confidentialité',
        privacyPolicyUrl: '/privacy-policy',
        backToMainButton: 'Retour à la home',
        footerText: 'Développé avec amour',
        validationErrorMessage:
            'Veuillez corriger les erreurs du formulaire avant de soumettre 🔍',
        sendingMessage: 'Envoi de votre message... 📨',
        emailText: {
            greeting: 'Bienvenue',
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
    },
    versions: {
        pageTitle: 'Historique des versions',
        pageDescription:
            "Découvrez l'historique de développement et le changelog de Keymoji, le générateur de mots de passe emoji."
    },

    // Traductions UserSettings
    userSettings: {
        // Paramètres de base
        basicSettings: {
            title: 'Paramètres de base',
            description: 'Langue, thème et notifications',
            language: {
                label: 'Langue',
                description: 'Choisissez votre langue préférée',
                options: {
                    en: '🇺🇸 Anglais',
                    de: '🇩🇪 Allemand',
                    fr: '🇫🇷 Français',
                    es: '🇪🇸 Espagnol'
                }
            },
            theme: {
                label: 'Thème',
                description: 'Choisissez votre thème visuel',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Clair',
                    dark: '🌙 Sombre'
                }
            },
            notifications: {
                label: 'Notifications',
                description: 'Recevoir les mises à jour importantes'
            }
        },

        // Paramètres de sécurité
        securitySettings: {
            title: 'Paramètres de sécurité',
            description: 'Force du mot de passe et types de caractères',
            passwordLength: {
                label: 'Longueur du mot de passe',
                description: 'Choisir la force du mot de passe',
                min: 'Faible (6)',
                max: 'Fort (20)'
            },
            includeNumbers: {
                label: 'Inclure les chiffres',
                description: 'Ajouter des caractères numériques (0-9)'
            },
            includeSymbols: {
                label: 'Inclure les symboles',
                description: 'Ajouter des caractères spéciaux (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Inclure les caractères spéciaux',
                description: 'Ajouter des caractères spéciaux étendus'
            },
            excludeSimilarChars: {
                label: 'Exclure les caractères similaires',
                description: 'Éviter les caractères confus (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Caractères uniques requis',
                description: 'Aucun caractère répété dans le mot de passe'
            }
        },

        // Paramètres Emoji
        emojiSettings: {
            title: 'Paramètres Emoji',
            description: "Nombre d'emojis, catégories et motifs",
            emojiCount: {
                label: "Nombre d'emojis",
                description: "Nombre d'emojis dans le mot de passe",
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Motif Emoji',
                description: "Choisir l'arrangement des emojis",
                options: {
                    random: 'Aléatoire',
                    sequential: 'Séquentiel',
                    alternating: 'Alterné'
                }
            },
            emojiTheme: {
                label: 'Thème Emoji',
                description: 'Choisir le style des emojis',
                options: {
                    mixed: 'Mixte',
                    cute: 'Mignon',
                    professional: 'Professionnel',
                    fantasy: 'Fantaisie'
                }
            }
        },

        // Paramètres de génération
        generationSettings: {
            title: 'Paramètres de génération',
            description: 'Auto-génération et options de presse-papiers',
            autoGenerate: {
                label: 'Auto-génération',
                description: 'Générer automatiquement les mots de passe'
            },
            copyToClipboard: {
                label: 'Copier dans le presse-papiers',
                description: 'Copier automatiquement les mots de passe générés'
            },
            showStrength: {
                label: 'Afficher la force',
                description: 'Afficher le compteur de force du mot de passe'
            },
            strengthThreshold: {
                label: 'Seuil de force',
                description: 'Force minimale requise du mot de passe',
                options: {
                    low: 'Faible',
                    medium: 'Moyen',
                    high: 'Élevé'
                }
            },
            autoRefresh: {
                label: 'Auto-actualisation',
                description:
                    'Régénérer automatiquement les mots de passe faibles'
            }
        },

        // Paramètres de confidentialité
        privacySettings: {
            title: 'Paramètres de confidentialité',
            description: 'Collecte de données et préférences de partage',
            saveHistory: {
                label: "Sauvegarder l'historique",
                description: 'Sauvegarder les mots de passe générés localement'
            },
            analytics: {
                label: 'Analytics',
                description: "Statistiques d'utilisation anonymes"
            },
            shareUsage: {
                label: "Partager l'utilisation",
                description:
                    "Partager les données d'utilisation pour les améliorations"
            },
            exportHistory: {
                label: "Exporter l'historique",
                description:
                    "Exporter l'historique des mots de passe vers un fichier"
            },
            backupSettings: {
                label: 'Sauvegarder les paramètres',
                description: 'Sauvegarder automatiquement les paramètres'
            }
        },

        // Fonctionnalités Pro
        proFeatures: {
            title: 'Fonctionnalités Pro',
            description: 'Paramètres avancés et fonctionnalités premium',
            securityAudit: {
                label: 'Audit de sécurité',
                description: 'Analyse de sécurité complète',
                buttonText: "Lancer l'audit"
            },
            breachCheck: {
                label: 'Vérification des fuites',
                description:
                    'Vérifier les mots de passe contre les fuites connues'
            },
            strengthAnalytics: {
                label: 'Analytics de force',
                description: 'Analyse avancée de la force des mots de passe'
            }
        }
    },

    // Accounting et sécurité
    accounting: {
        // Connexion et authentification
        login: {
            title: 'Se connecter',
            emailPlaceholder: 'Entrez votre adresse e-mail',
            magicLinkSent: 'Lien magique envoyé !',
            magicLinkError: "Erreur lors de l'envoi du lien magique",
            verificationSuccess: 'E-mail vérifié avec succès !',
            verificationError: "Échec de la vérification de l'e-mail",
            rateLimitExceeded:
                'Trop de tentatives de connexion. Veuillez attendre.',
            sessionExpired: 'Session expirée. Veuillez vous reconnecter.'
        },

        // Gestion de compte
        account: {
            title: 'Gestion de compte',
            profile: 'Profil',
            settings: 'Paramètres',
            logout: 'Se déconnecter',
            logoutSuccess: 'Déconnexion réussie',
            accountCreated: 'Compte créé avec succès',
            accountUpdated: 'Compte mis à jour avec succès',
            accountError: 'Erreur lors de la gestion du compte'
        },

        // Événements de sécurité
        security: {
            loginAttempt: 'Tentative de connexion',
            loginSuccess: 'Connexion réussie',
            loginFailed: 'Échec de connexion',
            logout: 'Déconnexion',
            sessionExpired: 'Session expirée',
            suspiciousActivity: 'Activité suspecte',
            verificationSuccess: 'Vérification réussie',
            verificationFailed: 'Échec de vérification',
            accountCreated: 'Compte créé',
            accountUpdated: 'Compte mis à jour',
            securityAudit: 'Audit de sécurité effectué'
        },

        // Validation
        validation: {
            required: 'Ce champ est requis',
            emailInvalid: 'Veuillez entrer une adresse e-mail valide',
            urlInvalid: 'Veuillez entrer une URL valide',
            phoneInvalid: 'Veuillez entrer un numéro de téléphone valide',
            passwordWeak:
                'Le mot de passe doit contenir au moins 8 caractères avec majuscules, minuscules et chiffres',
            minLength: 'Longueur minimale est {min} caractères',
            maxLength: 'Longueur maximale est {max} caractères',
            minValue: 'Valeur minimale est {min}',
            maxValue: 'Valeur maximale est {max}',
            validInput: 'Entrée valide'
        },

        // Menu contextuel
        contextMenu: {
            exportSettings: 'Exporter les paramètres',
            importSettings: 'Importer les paramètres',
            resetToDefault: 'Réinitialiser aux valeurs par défaut',
            proMessage:
                '💎 Les utilisateurs Pro peuvent exporter et importer leurs paramètres'
        }
    },

    // Modales et notifications
    modals: {
        success: 'Succès',
        error: 'Erreur',
        warning: 'Avertissement',
        info: 'Information',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        close: 'Fermer',
        loading: 'Chargement...',
        saving: 'Sauvegarde...',
        exporting: 'Exportation...',
        importing: 'Importation...',
        resetting: 'Réinitialisation...'
    },

    // Traductions AccountManager
    accountManager: {
        // Titres et descriptions de page
        pageTitle: 'Gestionnaire de compte',
        pageDescription:
            'Gérez vos paramètres de sécurité et préférences de compte',
        welcomeBack: 'Bon retour, {name}! 👋',
        welcomeDescription:
            'Prêt à créer des mots de passe emoji incroyables ? Votre compte est sécurisé et prêt !',
        returnUserTitle: '👋 Bon retour !',
        returnUserDescription:
            'Nous avons reconnu votre adresse e-mail. Connectez-vous rapidement.',
        verificationTitle: '📧 Vérifiez votre e-mail et confirmez',
        verificationDescription:
            'Vérifiez votre e-mail {email} et cliquez sur le lien magique pour terminer la configuration',
        verifyingTitle: '🔗 Vérification du lien magique...',
        verifyingDescription:
            'Veuillez patienter pendant que nous vérifions votre compte.',
        verificationErrorTitle: '❌ Échec de la vérification',
        verificationErrorDescription: "Une erreur s'est produite.",

        // Boutons et actions
        buttons: {
            createMagicLink: 'Créer un lien magique',
            loginToAccount: 'Se connecter au compte',
            checkAccountExists: 'Vérification du compte...',
            sendingMagicLink: 'Envoi du lien magique...',
            accountExists: 'Compte trouvé - Connexion...',
            accountNotFound: 'Compte non trouvé - Création...',
            sessionExpired: 'Session expirée - Reconnexion',
            loginAgain: '🔐 Se reconnecter',
            createNewAccount: 'Créer un nouveau compte',
            resendMagicLink: '🔄 Renvoyer le lien magique',
            backToAccountOptions: '← Retour aux options de compte',
            addProfile: 'Ajouter',
            hideProfile: 'Masquer',
            profileData: 'Données de profil',
            showFullForm: 'Afficher le formulaire complet',
            compactView: 'Vue compacte'
        },

        // Labels de formulaire
        emailLabel: 'E-mail',
        nameLabel: 'Nom',

        // Actions
        actions: {
            saveSettings: '💾 Sauvegarder les paramètres',
            backToHome: "🏠 Retour à l'accueil",
            skipAccount: '❌ Passer {type}',
            createAccount: '🚀 Créer un compte {type}',
            settingsSaved: 'Paramètres sauvegardés avec succès !'
        },

        // Statistiques
        statistics: {
            storiesGenerated: 'Histoires générées',
            remainingGenerations: 'Générations restantes'
        },

        // Générations quotidiennes
        dailyGenerations: 'Générations quotidiennes',

        // Affichage des générations restantes
        remainingDisplay: '{remaining} / {limit} restant',

        // Avantages
        benefits: {
            free: {
                dailyGenerations: '5 générations sécurisées quotidiennes',
                dailyGenerationsDesc: "Technologie résistante à l'IA",
                decentralizedData: 'Traitement de données décentralisé',
                decentralizedDataDesc: 'Vos données restent privées',
                webApp: 'Disponible en application web',
                webAppDesc: 'Accès sécurisé de partout'
            },
            pro: {
                unlimitedGenerations: 'Générations sécurisées illimitées',
                unlimitedGenerationsDesc: 'Aucune limite quotidienne',
                aiThreatDetection: "Détection de menaces alimentée par l'IA",
                aiThreatDetectionDesc: 'Analyse de sécurité proactive',
                prioritySupport: 'Support prioritaire',
                prioritySupportDesc: 'Aide rapide pour les questions',
                browserExtension: 'Extension de navigateur (Q4 2025)',
                browserExtensionDesc: 'Sécurité partout sur le web',
                wordpressPlugin: 'Plugin WordPress (Q4 2025)',
                wordpressPluginDesc: 'Intégrez la sécurité dans votre site web'
            }
        },

        // Section d'aide
        help: {
            title: "💡 Besoin d'aide ?",
            spamFolder:
                "• Vérifiez votre dossier spam si vous ne voyez pas l'e-mail",
            magicLinkExpiry: '• Les liens magiques expirent après 15 minutes',
            requestNewLink:
                '• Vous pouvez demander un nouveau lien à tout moment',
            noPassword:
                '• Aucun mot de passe requis - cliquez simplement sur le lien'
        },

        // Pied de page
        footer: {
            magicLink: 'Lien magique',
            instantSetup: 'Configuration instantanée',
            noSpam: 'Pas de spam',
            text: 'Les liens magiques sont envoyés par e-mail et valides pendant 15 minutes.',
            privacy: 'Vos données sont traitées en toute sécurité.'
        },

        // Limites et messages
        canStillGenerate: 'Vous pouvez encore générer des emojis !',
        limitReached:
            'Limite quotidienne atteinte. Passez à PRO pour des générations illimitées.',

        // Account age labels
        accountAge: {
            today: "Créé aujourd'hui",
            yesterday: 'Créé hier',
            days: '{days} jours',
            weeks: '{weeks} semaine{plural}',
            months: '{months} mois{plural}',
            years: '{years} année{plural}',
            accountSince: 'Compte depuis {days} {unit}',
            since: 'depuis {days} {unit}',
            day: 'jour',
            days: 'jours',
            accountCreated: 'Compte créé'
        },

        // Validation
        validation: {
            emailInvalid: 'Veuillez entrer une adresse e-mail valide',
            nameInvalid: 'Veuillez entrer votre nom (minimum 2 caractères)'
        },

        // Messages
        messages: {
            settingsReset: 'Paramètres réinitialisés par défaut',
            exportFailed: "Échec de l'exportation des paramètres",
            settingsExported: 'Paramètres exportés avec succès',
            freeAccountActivated: 'Compte gratuit activé !'
        },

        // Section de mise à niveau
        upgrade: {
            upgradeToPro: 'Passer à Pro',
            upgradeToProForFeatures:
                'Passer à Pro pour des fonctionnalités avancées',
            unlimitedGenerations:
                'Générations illimitées et fonctionnalités de sécurité avancées'
        },

        // Menu contextuel
        contextMenu: {
            exportSettings: 'Exporter les paramètres',
            importSettings: 'Importer les paramètres',
            resetToDefault: 'Réinitialiser par défaut',
            logout: 'Se déconnecter',
            settingsMenu: 'Menu des paramètres'
        },

        // Fonctionnalités
        features: {
            proFeature: 'Fonctionnalité Pro'
        },

        // Modal Fonctionnalité Pro
        proFeatureModal: {
            title: 'Fonctionnalité Pro',
            proBenefits: 'Avantages Pro :',
            unlimitedGenerations: 'Générations emoji illimitées',
            advancedSecurity: 'Fonctionnalités de sécurité avancées',
            prioritySupport: 'Support prioritaire',
            earlyAccess: 'Accès anticipé aux nouvelles fonctionnalités',
            maybeLater: 'Peut-être plus tard',
            upgradeToPro: 'Passer à Pro',
            // Pro Upgrade spécifique
            proUpgrade: 'Mise à niveau Pro',
            unlockAdvancedFeatures:
                'Débloquer toutes les fonctionnalités et paramètres avancés',
            upgradeProNow: '💎 Passer à Pro maintenant'
        },

        // Niveaux de compte
        tiers: {
            free: 'GRATUIT',
            pro: 'PRO',
            freeAccount: 'Compte gratuit',
            proAccount: 'Compte Pro'
        },

        // Badges
        freeBadge: '✨ GRATUIT',
        proBadge: '💎 PRO',

        // Descriptions
        freeDescription: '✨ Sécurité gratuite',
        proDescription: '💎 Sécurité entreprise'
    },

    // Textes UI généraux
    ui: {
        save: 'Sauvegarder',
        cancel: 'Annuler',
        reset: 'Réinitialiser',
        export: 'Exporter',
        import: 'Importer',
        delete: 'Supprimer',
        edit: 'Modifier',
        add: 'Ajouter',
        remove: 'Retirer',
        search: 'Rechercher',
        filter: 'Filtrer',
        sort: 'Trier',
        refresh: 'Actualiser',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Soumettre',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        warning: 'Avertissement',
        info: 'Info'
    }
};
