// src/data/staticPages.json.js
// Pure JSON data structure for static pages
// Separation of Content and Presentation (Best Practice)

export const staticPagesData = {
    privacy: {
        de: {
            title: 'Datenschutzerklärung',
            description:
                'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Einleitung',
                    content: [
                        {
                            type: 'text',
                            value: 'Der Schutz Ihrer Privatsphäre ist uns sehr wichtig. Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website keymoji.wtf.'
                        },
                        {
                            type: 'text',
                            value: 'Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Verantwortlicher',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Verantwortlicher: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Datenverarbeitung',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Client-Side Verarbeitung (Privacy-First)'
                        },
                        {
                            type: 'text',
                            value: 'Keymoji ist primär eine Client-Side Anwendung. Das bedeutet:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'Alle Passwort- und Emoji-Generierungen erfolgen lokal in Ihrem Browser'
                                },
                                {
                                    text: 'Wir sehen Ihre generierten Passwörter niemals (Zero-Knowledge)'
                                },
                                {
                                    text: 'Keine Übertragung von Passwörtern an unsere Server'
                                },
                                {
                                    text: 'Keine Speicherung von Passwörtern in unserer Datenbank'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Kontoerstellung (optional)'
                        },
                        {
                            type: 'text',
                            value: 'Wenn Sie ein Konto erstellen, verarbeiten wir:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'E-Mail-Adresse',
                                    text: 'Für OTP code login (code sent via email)'
                                },
                                {
                                    label: 'Name (optional)',
                                    text: 'Zur Personalisierung'
                                },
                                {
                                    label: 'Nutzungsstatistiken',
                                    text: 'Anzahl täglicher Generierungen'
                                },
                                {
                                    label: 'Einstellungen',
                                    text: 'Sprache, Theme, Präferenzen'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Story Mode & AI Integration'
                        },
                        {
                            type: 'text',
                            value: 'Wenn Sie den Story Mode nutzen:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'API Keys',
                                    text: 'Werden verschlüsselt gespeichert'
                                },
                                {
                                    label: 'AI Provider',
                                    text: 'OpenAI, Google Gemini, Mistral, oder Custom'
                                },
                                {
                                    label: 'Story-Texte',
                                    text: 'Werden an gewählten AI Provider übermittelt'
                                },
                                {
                                    label: 'Generierte Emojis',
                                    text: 'Werden lokal gecacht (7 Tage)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Wichtig: Sie nutzen Ihren eigenen API Key. Bitte beachten Sie die Datenschutzerklärungen Ihres AI Providers.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Rechtsgrundlage: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)'
                        }
                    ]
                },
                {
                    title: '4. Externe Dienste & APIs',
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Hosting)',
                                    text: 'Website-Hosting (Vercel Inc., USA)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Datenschutz'
                                },
                                {
                                    title: '4.2 Brevo (E-Mail-Versand)',
                                    text: 'OTP-Codes und Benachrichtigungen',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Datenschutz'
                                },
                                {
                                    title: '4.3 n8n (Automation)',
                                    text: 'Backend-Workflows (selbst gehostet – kein externer Auftragsverarbeiter)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    linkText: 'n8n-Instanz',
                                    external: true
                                },
                                {
                                    title: '4.4 HuggingFace (Apertus AI)',
                                    text: 'Nur bei Nutzung des Story Mode: Ihr Eingabetext wird an HuggingFace (USA) übertragen. Keine personenbezogenen Daten werden gesendet.',
                                    link: 'https://huggingface.co/privacy',
                                    linkText: 'Datenschutz'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Cookies & Lokale Speicherung',
                    content: [
                        {
                            type: 'text',
                            value: 'Wir verwenden keine Tracking-Cookies. Folgende lokale Speicherungen:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Einstellungen, Sprache, Theme'
                                },
                                {
                                    label: 'Service Worker Cache',
                                    text: 'Offline-Funktionalität (PWA)'
                                },
                                {
                                    label: 'Cookies',
                                    text: 'Session-Management (OTP code login (code sent via email))'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Ihre Rechte (DSGVO)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Auskunftsrecht (Art. 15 DSGVO)',
                                    text: 'Sie können Auskunft über Ihre gespeicherten Daten verlangen'
                                },
                                {
                                    label: 'Berichtigungsrecht (Art. 16 DSGVO)',
                                    text: 'Sie können die Korrektur falscher Daten verlangen'
                                },
                                {
                                    label: 'Löschungsrecht (Art. 17 DSGVO)',
                                    text: 'Sie können die Löschung Ihrer Daten verlangen'
                                },
                                {
                                    label: 'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
                                    text: 'Sie können die Verarbeitung einschränken lassen'
                                },
                                {
                                    label: 'Datenübertragbarkeit (Art. 20 DSGVO)',
                                    text: 'Sie können Ihre Daten in strukturiertem Format erhalten'
                                },
                                {
                                    label: 'Widerspruchsrecht (Art. 21 DSGVO)',
                                    text: 'Sie können der Verarbeitung widersprechen'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Kontaktformular',
                                    text: 'Anfrage senden',
                                    navigate: '/de/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        en: {
            title: 'Privacy Policy',
            description:
                'Information about data protection and processing of personal data',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Introduction',
                    content: [
                        {
                            type: 'text',
                            value: 'Protecting your privacy is very important to us. This privacy policy informs you about the nature, scope and purpose of processing personal data on our website keymoji.wtf.'
                        },
                        {
                            type: 'text',
                            value: 'We process your data exclusively on the basis of legal regulations (GDPR, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Responsible Party',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Data Processing',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Client-Side Processing (Privacy-First)'
                        },
                        {
                            type: 'text',
                            value: 'Keymoji is primarily a client-side application. This means:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'All password and emoji generations happen locally in your browser'
                                },
                                {
                                    text: 'We never see your generated passwords (Zero-Knowledge)'
                                },
                                {
                                    text: 'No transmission of passwords to our servers'
                                },
                                {
                                    text: 'No storage of passwords in our database'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Account Creation (optional)'
                        },
                        {
                            type: 'text',
                            value: 'When you create an account, we process:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Email address',
                                    text: 'For Magic Link login'
                                },
                                {
                                    label: 'Name (optional)',
                                    text: 'For personalization'
                                },
                                {
                                    label: 'Usage statistics',
                                    text: 'Number of daily generations'
                                },
                                {
                                    label: 'Settings',
                                    text: 'Language, theme, preferences'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Legal basis: Contract fulfillment (Art. 6 para. 1 lit. b GDPR)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Story Mode & AI Integration'
                        },
                        {
                            type: 'text',
                            value: 'When you use Story Mode:'
                        },
                        {
                            type: 'list',
                            items: [
                                { label: 'API Keys', text: 'Stored encrypted' },
                                {
                                    label: 'AI Provider',
                                    text: 'OpenAI, Google Gemini, Mistral, or Custom'
                                },
                                {
                                    label: 'Story texts',
                                    text: 'Transmitted to selected AI provider'
                                },
                                {
                                    label: 'Generated emojis',
                                    text: 'Cached locally (7 days)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: "Important: You use your own API key. Please review your provider's privacy policies.",
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Legal basis: Consent (Art. 6 para. 1 lit. a GDPR)'
                        }
                    ]
                },
                {
                    title: '4. External Services & APIs',
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Hosting)',
                                    text: 'Website hosting (Vercel Inc., USA)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Privacy'
                                },
                                {
                                    title: '4.2 Brevo (Email Service)',
                                    text: 'Magic links and notifications',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Privacy'
                                },
                                {
                                    title: '4.3 n8n (Automation)',
                                    text: 'Backend workflows (self-hosted — no external data processor)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    linkText: 'n8n instance',
                                    external: true
                                },
                                {
                                    title: '4.4 HuggingFace (Apertus AI)',
                                    text: 'Only when using Story Mode: your input text is sent to HuggingFace (USA). No personal data is transmitted.',
                                    link: 'https://huggingface.co/privacy',
                                    linkText: 'Privacy'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Cookies & Local Storage',
                    content: [
                        {
                            type: 'text',
                            value: 'We do not use tracking cookies. The following local storage:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Settings, language, theme'
                                },
                                {
                                    label: 'Service Worker Cache',
                                    text: 'Offline functionality (PWA)'
                                },
                                {
                                    label: 'Cookies',
                                    text: 'Session management (Magic Link login)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Your Rights (GDPR)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Right to access (Art. 15 GDPR)',
                                    text: 'You can request information about your stored data'
                                },
                                {
                                    label: 'Right to rectification (Art. 16 GDPR)',
                                    text: 'You can request correction of incorrect data'
                                },
                                {
                                    label: 'Right to erasure (Art. 17 GDPR)',
                                    text: 'You can request deletion of your data'
                                },
                                {
                                    label: 'Right to restriction (Art. 18 GDPR)',
                                    text: 'You can request restriction of processing'
                                },
                                {
                                    label: 'Right to data portability (Art. 20 GDPR)',
                                    text: 'You can receive your data in structured format'
                                },
                                {
                                    label: 'Right to object (Art. 21 GDPR)',
                                    text: 'You can object to processing'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Contact form',
                                    text: 'Send a request',
                                    navigate: '/en/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        fr: {
            title: 'Politique de confidentialité',
            description:
                'Informations sur la protection des données et le traitement des données personnelles',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Introduction',
                    content: [
                        {
                            type: 'text',
                            value: "La protection de votre vie privée est très importante pour nous. Cette politique de confidentialité vous informe sur la nature, la portée et l'objet du traitement des données personnelles sur notre site web keymoji.wtf."
                        },
                        {
                            type: 'text',
                            value: 'Nous traitons vos données exclusivement sur la base des réglementations légales (RGPD, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Responsable',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Traitement des données',
                    content: [
                        {
                            type: 'subtitle',
                            value: "3.1 Traitement côté client (Confidentialité d'abord)"
                        },
                        {
                            type: 'text',
                            value: 'Keymoji est principalement une application côté client. Cela signifie:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: "Toutes les générations de mots de passe et d'emojis se font localement dans votre navigateur"
                                },
                                {
                                    text: 'Nous ne voyons jamais vos mots de passe générés (Zero-Knowledge)'
                                },
                                {
                                    text: 'Aucune transmission de mots de passe à nos serveurs'
                                },
                                {
                                    text: 'Aucun stockage de mots de passe dans notre base de données'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Création de compte (optionnel)'
                        },
                        {
                            type: 'text',
                            value: 'Lorsque vous créez un compte, nous traitons:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Adresse e-mail',
                                    text: 'Pour la connexion Magic Link'
                                },
                                {
                                    label: 'Nom (optionnel)',
                                    text: 'Pour la personnalisation'
                                },
                                {
                                    label: "Statistiques d'utilisation",
                                    text: 'Nombre de générations quotidiennes'
                                },
                                {
                                    label: 'Paramètres',
                                    text: 'Langue, thème, préférences'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Base légale: Exécution du contrat (Art. 6 par. 1 lit. b RGPD)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Mode Histoire et intégration IA'
                        },
                        {
                            type: 'text',
                            value: 'Lorsque vous utilisez le Mode Histoire:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Clés API',
                                    text: 'Stockées de manière cryptée'
                                },
                                {
                                    label: 'Fournisseur IA',
                                    text: 'OpenAI, Google Gemini, Mistral ou Personnalisé'
                                },
                                {
                                    label: "Textes d'histoire",
                                    text: 'Transmis au fournisseur IA sélectionné'
                                },
                                {
                                    label: 'Emojis générés',
                                    text: 'Mis en cache localement (7 jours)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Important: Vous utilisez votre propre clé API. Veuillez consulter les politiques de confidentialité de votre fournisseur.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Base légale: Consentement (Art. 6 par. 1 lit. a RGPD)'
                        }
                    ]
                },
                {
                    title: '4. Services externes et API',
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Hébergement)',
                                    text: 'Hébergement de site web (Vercel Inc., USA)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Confidentialité'
                                },
                                {
                                    title: '4.2 Brevo (Service e-mail)',
                                    text: 'Liens magiques et notifications',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Confidentialité'
                                },
                                {
                                    title: '4.3 n8n (Automatisation)',
                                    text: 'Workflows backend (auto-hébergé – aucun sous-traitant externe)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    linkText: 'Instance n8n',
                                    external: true
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Cookies et stockage local',
                    content: [
                        {
                            type: 'text',
                            value: "Nous n'utilisons pas de cookies de suivi. Stockage local suivant:"
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Paramètres, langue, thème'
                                },
                                {
                                    label: 'Cache Service Worker',
                                    text: 'Fonctionnalité hors ligne (PWA)'
                                },
                                {
                                    label: 'Cookies',
                                    text: 'Gestion de session (connexion Magic Link)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Vos droits (RGPD)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: "Droit d'accès (Art. 15 RGPD)",
                                    text: 'Vous pouvez demander des informations sur vos données stockées'
                                },
                                {
                                    label: 'Droit de rectification (Art. 16 RGPD)',
                                    text: 'Vous pouvez demander la correction de données incorrectes'
                                },
                                {
                                    label: "Droit à l'effacement (Art. 17 RGPD)",
                                    text: 'Vous pouvez demander la suppression de vos données'
                                },
                                {
                                    label: 'Droit à la limitation (Art. 18 RGPD)',
                                    text: 'Vous pouvez demander la limitation du traitement'
                                },
                                {
                                    label: 'Droit à la portabilité (Art. 20 RGPD)',
                                    text: 'Vous pouvez recevoir vos données dans un format structuré'
                                },
                                {
                                    label: "Droit d'opposition (Art. 21 RGPD)",
                                    text: 'Vous pouvez vous opposer au traitement'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Formulaire de contact',
                                    text: 'Envoyer une demande',
                                    navigate: '/fr/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        es: {
            title: 'Política de privacidad',
            description:
                'Información sobre la protección de datos y el procesamiento de datos personales',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Introducción',
                    content: [
                        {
                            type: 'text',
                            value: 'La protección de su privacidad es muy importante para nosotros. Esta política de privacidad le informa sobre la naturaleza, el alcance y el propósito del procesamiento de datos personales en nuestro sitio web keymoji.wtf.'
                        },
                        {
                            type: 'text',
                            value: 'Procesamos sus datos exclusivamente sobre la base de las regulaciones legales (RGPD, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Responsable',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Procesamiento de datos',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Procesamiento del lado del cliente (Privacidad primero)'
                        },
                        {
                            type: 'text',
                            value: 'Keymoji es principalmente una aplicación del lado del cliente. Esto significa:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'Todas las generaciones de contraseñas y emojis ocurren localmente en su navegador'
                                },
                                {
                                    text: 'Nunca vemos sus contraseñas generadas (Zero-Knowledge)'
                                },
                                {
                                    text: 'Sin transmisión de contraseñas a nuestros servidores'
                                },
                                {
                                    text: 'Sin almacenamiento de contraseñas en nuestra base de datos'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Creación de cuenta (opcional)'
                        },
                        {
                            type: 'text',
                            value: 'Cuando crea una cuenta, procesamos:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Dirección de correo electrónico',
                                    text: 'Para inicio de sesión con Magic Link'
                                },
                                {
                                    label: 'Nombre (opcional)',
                                    text: 'Para personalización'
                                },
                                {
                                    label: 'Estadísticas de uso',
                                    text: 'Número de generaciones diarias'
                                },
                                {
                                    label: 'Configuración',
                                    text: 'Idioma, tema, preferencias'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Base legal: Cumplimiento del contrato (Art. 6 párr. 1 lit. b RGPD)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Modo Historia e integración IA'
                        },
                        {
                            type: 'text',
                            value: 'Cuando utiliza el Modo Historia:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Claves API',
                                    text: 'Almacenadas cifradas'
                                },
                                {
                                    label: 'Proveedor IA',
                                    text: 'OpenAI, Google Gemini, Mistral o Personalizado'
                                },
                                {
                                    label: 'Textos de historia',
                                    text: 'Transmitidos al proveedor IA seleccionado'
                                },
                                {
                                    label: 'Emojis generados',
                                    text: 'Almacenados en caché localmente (7 días)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Importante: Utiliza su propia clave API. Por favor, revise las políticas de privacidad de su proveedor.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Base legal: Consentimiento (Art. 6 párr. 1 lit. a RGPD)'
                        }
                    ]
                },
                {
                    title: '4. Servicios externos y API',
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Alojamiento)',
                                    text: 'Alojamiento de sitio web (Vercel Inc., EE.UU.)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Privacidad'
                                },
                                {
                                    title: '4.2 Brevo (Servicio de correo)',
                                    text: 'Enlaces mágicos y notificaciones',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Privacidad'
                                },
                                {
                                    title: '4.4 n8n (Automatización)',
                                    text: 'Flujos de trabajo backend (autoalojados)',
                                    link: 'https://n8n.io/legal/privacy',
                                    linkText: 'Privacidad'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Cookies y almacenamiento local',
                    content: [
                        {
                            type: 'text',
                            value: 'No utilizamos cookies de seguimiento. Almacenamiento local siguiente:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Configuración, idioma, tema'
                                },
                                {
                                    label: 'Caché de Service Worker',
                                    text: 'Funcionalidad sin conexión (PWA)'
                                },
                                {
                                    label: 'Cookies',
                                    text: 'Gestión de sesión (inicio de sesión Magic Link)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Sus derechos (RGPD)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Derecho de acceso (Art. 15 RGPD)',
                                    text: 'Puede solicitar información sobre sus datos almacenados'
                                },
                                {
                                    label: 'Derecho de rectificación (Art. 16 RGPD)',
                                    text: 'Puede solicitar la corrección de datos incorrectos'
                                },
                                {
                                    label: 'Derecho al olvido (Art. 17 RGPD)',
                                    text: 'Puede solicitar la eliminación de sus datos'
                                },
                                {
                                    label: 'Derecho a la limitación (Art. 18 RGPD)',
                                    text: 'Puede solicitar la limitación del procesamiento'
                                },
                                {
                                    label: 'Derecho a la portabilidad (Art. 20 RGPD)',
                                    text: 'Puede recibir sus datos en formato estructurado'
                                },
                                {
                                    label: 'Derecho de oposición (Art. 21 RGPD)',
                                    text: 'Puede oponerse al procesamiento'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Formulario de contacto',
                                    text: 'Enviar una solicitud',
                                    navigate: '/es/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        it: {
            title: 'Informativa sulla privacy',
            description:
                'Informazioni sulla protezione dei dati e sul trattamento dei dati personali',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Introduzione',
                    content: [
                        {
                            type: 'text',
                            value: "La protezione della vostra privacy è molto importante per noi. Questa informativa sulla privacy vi informa sulla natura, l'ambito e lo scopo del trattamento dei dati personali sul nostro sito web keymoji.wtf."
                        },
                        {
                            type: 'text',
                            value: 'Elaboriamo i vostri dati esclusivamente sulla base delle normative legali (GDPR, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Titolare',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Trattamento dei dati',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Elaborazione lato client (Privacy prima di tutto)'
                        },
                        {
                            type: 'text',
                            value: "Keymoji è principalmente un'applicazione lato client. Ciò significa:"
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'Tutte le generazioni di password ed emoji avvengono localmente nel tuo browser'
                                },
                                {
                                    text: 'Non vediamo mai le tue password generate (Zero-Knowledge)'
                                },
                                {
                                    text: 'Nessuna trasmissione di password ai nostri server'
                                },
                                {
                                    text: 'Nessun archivio di password nel nostro database'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Creazione account (opzionale)'
                        },
                        {
                            type: 'text',
                            value: 'Quando crei un account, elaboriamo:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Indirizzo email',
                                    text: 'Per il login Magic Link'
                                },
                                {
                                    label: 'Nome (opzionale)',
                                    text: 'Per la personalizzazione'
                                },
                                {
                                    label: 'Statistiche di utilizzo',
                                    text: 'Numero di generazioni giornaliere'
                                },
                                {
                                    label: 'Impostazioni',
                                    text: 'Lingua, tema, preferenze'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Base legale: Adempimento del contratto (Art. 6 par. 1 lett. b GDPR)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Modalità Storia e integrazione IA'
                        },
                        {
                            type: 'text',
                            value: 'Quando usi la Modalità Storia:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Chiavi API',
                                    text: 'Memorizzate crittografate'
                                },
                                {
                                    label: 'Provider IA',
                                    text: 'OpenAI, Google Gemini, Mistral o Personalizzato'
                                },
                                {
                                    label: 'Testi delle storie',
                                    text: 'Trasmessi al provider IA selezionato'
                                },
                                {
                                    label: 'Emoji generate',
                                    text: 'Memorizzate nella cache localmente (7 giorni)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Importante: Utilizzi la tua chiave API. Consulta le informative sulla privacy del tuo provider.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Base legale: Consenso (Art. 6 par. 1 lett. a GDPR)'
                        }
                    ]
                },
                {
                    title: '4. Servizi esterni e API',
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Hosting)',
                                    text: 'Hosting del sito web (Vercel Inc., USA)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Privacy'
                                },
                                {
                                    title: '4.2 Brevo (Servizio email)',
                                    text: 'Link magici e notifiche',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Privacy'
                                },
                                {
                                    title: '4.3 n8n (Automazione)',
                                    text: 'Workflow backend (self-hosted – nessun responsabile esterno)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    linkText: 'Istanza n8n',
                                    external: true
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Cookie e archiviazione locale',
                    content: [
                        {
                            type: 'text',
                            value: 'Non utilizziamo cookie di tracciamento. Archiviazione locale seguente:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Impostazioni, lingua, tema'
                                },
                                {
                                    label: 'Cache Service Worker',
                                    text: 'Funzionalità offline (PWA)'
                                },
                                {
                                    label: 'Cookie',
                                    text: 'Gestione sessione (login Magic Link)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. I tuoi diritti (GDPR)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Diritto di accesso (Art. 15 GDPR)',
                                    text: 'Puoi richiedere informazioni sui tuoi dati memorizzati'
                                },
                                {
                                    label: 'Diritto di rettifica (Art. 16 GDPR)',
                                    text: 'Puoi richiedere la correzione di dati errati'
                                },
                                {
                                    label: 'Diritto alla cancellazione (Art. 17 GDPR)',
                                    text: 'Puoi richiedere la cancellazione dei tuoi dati'
                                },
                                {
                                    label: 'Diritto alla limitazione (Art. 18 GDPR)',
                                    text: 'Puoi richiedere la limitazione del trattamento'
                                },
                                {
                                    label: 'Diritto alla portabilità (Art. 20 GDPR)',
                                    text: 'Puoi ricevere i tuoi dati in formato strutturato'
                                },
                                {
                                    label: 'Diritto di opposizione (Art. 21 GDPR)',
                                    text: 'Puoi opporti al trattamento'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Modulo di contatto',
                                    text: 'Invia una richiesta',
                                    navigate: '/it/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        nl: {
            title: 'Privacybeleid',
            description:
                'Informatie over gegevensbescherming en verwerking van persoonsgegevens',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Inleiding',
                    content: [
                        {
                            type: 'text',
                            value: 'De bescherming van uw privacy is zeer belangrijk voor ons. Dit privacybeleid informeert u over de aard, omvang en het doel van de verwerking van persoonsgegevens op onze website keymoji.wtf.'
                        },
                        {
                            type: 'text',
                            value: 'Wij verwerken uw gegevens uitsluitend op basis van wettelijke voorschriften (AVG, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Verantwoordelijke',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Gegevensverwerking',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Client-side verwerking (Privacy eerst)'
                        },
                        {
                            type: 'text',
                            value: 'Keymoji is voornamelijk een client-side applicatie. Dit betekent:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'Alle wachtwoord- en emoji-generaties gebeuren lokaal in uw browser'
                                },
                                {
                                    text: 'Wij zien uw gegenereerde wachtwoorden nooit (Zero-Knowledge)'
                                },
                                {
                                    text: 'Geen overdracht van wachtwoorden naar onze servers'
                                },
                                {
                                    text: 'Geen opslag van wachtwoorden in onze database'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Account aanmaken (optioneel)'
                        },
                        {
                            type: 'text',
                            value: 'Wanneer u een account aanmaakt, verwerken wij:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'E-mailadres',
                                    text: 'Voor Magic Link login'
                                },
                                {
                                    label: 'Naam (optioneel)',
                                    text: 'Voor personalisatie'
                                },
                                {
                                    label: 'Gebruiksstatistieken',
                                    text: 'Aantal dagelijkse generaties'
                                },
                                {
                                    label: 'Instellingen',
                                    text: 'Taal, thema, voorkeuren'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Wettelijke basis: Contractuitvoering (Art. 6 lid 1 sub b AVG)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Story Mode en AI-integratie'
                        },
                        {
                            type: 'text',
                            value: 'Wanneer u Story Mode gebruikt:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'API-sleutels',
                                    text: 'Versleuteld opgeslagen'
                                },
                                {
                                    label: 'AI-provider',
                                    text: 'OpenAI, Google Gemini, Mistral of Aangepast'
                                },
                                {
                                    label: 'Verhaalteksten',
                                    text: 'Verzonden naar geselecteerde AI-provider'
                                },
                                {
                                    label: "Gegenereerde emoji's",
                                    text: 'Lokaal gecached (7 dagen)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Belangrijk: U gebruikt uw eigen API-sleutel. Lees de privacybeleidsregels van uw provider.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Wettelijke basis: Toestemming (Art. 6 lid 1 sub a AVG)'
                        }
                    ]
                },
                {
                    title: "4. Externe diensten en API's",
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Hosting)',
                                    text: 'Website hosting (Vercel Inc., VS)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Privacy'
                                },
                                {
                                    title: '4.2 Brevo (E-mailservice)',
                                    text: 'Magic links en notificaties',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Privacy'
                                },
                                {
                                    title: '4.3 n8n (Automatisering)',
                                    text: 'Backend workflows (zelf gehost – geen externe verwerker)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    linkText: 'n8n-instantie',
                                    external: true
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Cookies en lokale opslag',
                    content: [
                        {
                            type: 'text',
                            value: 'Wij gebruiken geen tracking cookies. Volgende lokale opslag:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Instellingen, taal, thema'
                                },
                                {
                                    label: 'Service Worker Cache',
                                    text: 'Offline functionaliteit (PWA)'
                                },
                                {
                                    label: 'Cookies',
                                    text: 'Sessiebeheer (Magic Link login)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Uw rechten (AVG)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Recht op inzage (Art. 15 AVG)',
                                    text: 'U kunt informatie opvragen over uw opgeslagen gegevens'
                                },
                                {
                                    label: 'Recht op rectificatie (Art. 16 AVG)',
                                    text: 'U kunt correctie van onjuiste gegevens verzoeken'
                                },
                                {
                                    label: 'Recht op verwijdering (Art. 17 AVG)',
                                    text: 'U kunt verwijdering van uw gegevens verzoeken'
                                },
                                {
                                    label: 'Recht op beperking (Art. 18 AVG)',
                                    text: 'U kunt beperking van de verwerking verzoeken'
                                },
                                {
                                    label: 'Recht op gegevensoverdraagbaarheid (Art. 20 AVG)',
                                    text: 'U kunt uw gegevens in gestructureerd formaat ontvangen'
                                },
                                {
                                    label: 'Recht van bezwaar (Art. 21 AVG)',
                                    text: 'U kunt bezwaar maken tegen de verwerking'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Contactformulier',
                                    text: 'Stuur een verzoek',
                                    navigate: '/nl/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        pl: {
            title: 'Polityka prywatności',
            description:
                'Informacje o ochronie danych i przetwarzaniu danych osobowych',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Wprowadzenie',
                    content: [
                        {
                            type: 'text',
                            value: 'Ochrona Twojej prywatności jest dla nas bardzo ważna. Niniejsza polityka prywatności informuje Cię o charakterze, zakresie i celu przetwarzania danych osobowych na naszej stronie keymoji.wtf.'
                        },
                        {
                            type: 'text',
                            value: 'Przetwarzamy Twoje dane wyłącznie na podstawie przepisów prawnych (RODO, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Administrator',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Przetwarzanie danych',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Przetwarzanie po stronie klienta (Prywatność przede wszystkim)'
                        },
                        {
                            type: 'text',
                            value: 'Keymoji jest głównie aplikacją po stronie klienta. Oznacza to:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'Wszystkie generowania haseł i emoji odbywają się lokalnie w Twojej przeglądarce'
                                },
                                {
                                    text: 'Nigdy nie widzimy Twoich wygenerowanych haseł (Zero-Knowledge)'
                                },
                                {
                                    text: 'Brak przekazywania haseł do naszych serwerów'
                                },
                                {
                                    text: 'Brak przechowywania haseł w naszej bazie danych'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Tworzenie konta (opcjonalne)'
                        },
                        {
                            type: 'text',
                            value: 'Gdy tworzysz konto, przetwarzamy:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Adres e-mail',
                                    text: 'Do logowania Magic Link'
                                },
                                {
                                    label: 'Imię (opcjonalne)',
                                    text: 'Do personalizacji'
                                },
                                {
                                    label: 'Statystyki użytkowania',
                                    text: 'Liczba dziennych generowań'
                                },
                                {
                                    label: 'Ustawienia',
                                    text: 'Język, motyw, preferencje'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Podstawa prawna: Wykonanie umowy (Art. 6 ust. 1 lit. b RODO)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Tryb Historia i integracja AI'
                        },
                        {
                            type: 'text',
                            value: 'Gdy używasz Trybu Historia:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Klucze API',
                                    text: 'Przechowywane zaszyfrowane'
                                },
                                {
                                    label: 'Dostawca AI',
                                    text: 'OpenAI, Google Gemini, Mistral lub Niestandardowy'
                                },
                                {
                                    label: 'Teksty historii',
                                    text: 'Przesyłane do wybranego dostawcy AI'
                                },
                                {
                                    label: 'Wygenerowane emoji',
                                    text: 'Buforowane lokalnie (7 dni)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Ważne: Używasz własnego klucza API. Proszę zapoznać się z politykami prywatności Twojego dostawcy.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Podstawa prawna: Zgoda (Art. 6 ust. 1 lit. a RODO)'
                        }
                    ]
                },
                {
                    title: '4. Usługi zewnętrzne i API',
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Hosting)',
                                    text: 'Hosting strony internetowej (Vercel Inc., USA)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Prywatność'
                                },
                                {
                                    title: '4.2 Brevo (Serwis e-mail)',
                                    text: 'Magic links i powiadomienia',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Prywatność'
                                },
                                {
                                    title: '4.3 n8n (Automatyzacja)',
                                    text: 'Workflow backend (self-hosted – brak zewnętrznego procesora)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    linkText: 'Instancja n8n',
                                    external: true
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Pliki cookie i przechowywanie lokalne',
                    content: [
                        {
                            type: 'text',
                            value: 'Nie używamy plików cookie śledzących. Następujące przechowywanie lokalne:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Ustawienia, język, motyw'
                                },
                                {
                                    label: 'Cache Service Worker',
                                    text: 'Funkcjonalność offline (PWA)'
                                },
                                {
                                    label: 'Pliki cookie',
                                    text: 'Zarządzanie sesją (logowanie Magic Link)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Twoje prawa (RODO)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Prawo dostępu (Art. 15 RODO)',
                                    text: 'Możesz żądać informacji o przechowywanych danych'
                                },
                                {
                                    label: 'Prawo do sprostowania (Art. 16 RODO)',
                                    text: 'Możesz żądać korekty nieprawidłowych danych'
                                },
                                {
                                    label: 'Prawo do usunięcia (Art. 17 RODO)',
                                    text: 'Możesz żądać usunięcia swoich danych'
                                },
                                {
                                    label: 'Prawo do ograniczenia (Art. 18 RODO)',
                                    text: 'Możesz żądać ograniczenia przetwarzania'
                                },
                                {
                                    label: 'Prawo do przenoszenia danych (Art. 20 RODO)',
                                    text: 'Możesz otrzymać swoje dane w formacie strukturalnym'
                                },
                                {
                                    label: 'Prawo sprzeciwu (Art. 21 RODO)',
                                    text: 'Możesz sprzeciwić się przetwarzaniu'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Formularz kontaktowy',
                                    text: 'Wyślij zapytanie',
                                    navigate: '/pl/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        ru: {
            title: 'Политика конфиденциальности',
            description:
                'Информация о защите данных и обработке персональных данных',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Введение',
                    content: [
                        {
                            type: 'text',
                            value: 'Защита вашей конфиденциальности очень важна для нас. Эта политика конфиденциальности информирует вас о характере, объеме и цели обработки персональных данных на нашем веб-сайте keymoji.wtf.'
                        },
                        {
                            type: 'text',
                            value: 'Мы обрабатываем ваши данные исключительно на основе правовых норм (GDPR, revDSGV, TKG 2003).'
                        }
                    ]
                },
                {
                    title: '2. Ответственное лицо',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Обработка данных',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Обработка на стороне клиента (Конфиденциальность прежде всего)'
                        },
                        {
                            type: 'text',
                            value: 'Keymoji - это в основном клиентское приложение. Это означает:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'Все генерации паролей и эмодзи происходят локально в вашем браузере'
                                },
                                {
                                    text: 'Мы никогда не видим ваши сгенерированные пароли (Zero-Knowledge)'
                                },
                                {
                                    text: 'Нет передачи паролей на наши серверы'
                                },
                                {
                                    text: 'Нет хранения паролей в нашей базе данных'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Создание аккаунта (опционально)'
                        },
                        {
                            type: 'text',
                            value: 'Когда вы создаете аккаунт, мы обрабатываем:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Адрес электронной почты',
                                    text: 'Для входа через Magic Link'
                                },
                                {
                                    label: 'Имя (опционально)',
                                    text: 'Для персонализации'
                                },
                                {
                                    label: 'Статистика использования',
                                    text: 'Количество ежедневных генераций'
                                },
                                {
                                    label: 'Настройки',
                                    text: 'Язык, тема, предпочтения'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Правовая основа: Выполнение договора (ст. 6 п. 1 лит. b GDPR)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Режим Истории и интеграция ИИ'
                        },
                        {
                            type: 'text',
                            value: 'Когда вы используете Режим Истории:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'API ключи',
                                    text: 'Хранятся в зашифрованном виде'
                                },
                                {
                                    label: 'Провайдер ИИ',
                                    text: 'OpenAI, Google Gemini, Mistral или Пользовательский'
                                },
                                {
                                    label: 'Тексты историй',
                                    text: 'Передаются выбранному провайдеру ИИ'
                                },
                                {
                                    label: 'Сгенерированные эмодзи',
                                    text: 'Кэшируются локально (7 дней)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Важно: Вы используете свой собственный API ключ. Пожалуйста, ознакомьтесь с политиками конфиденциальности вашего провайдера.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Правовая основа: Согласие (ст. 6 п. 1 лит. a GDPR)'
                        }
                    ]
                },
                {
                    title: '4. Внешние сервисы и API',
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Хостинг)',
                                    text: 'Хостинг веб-сайта (Vercel Inc., США)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Конфиденциальность'
                                },
                                {
                                    title: '4.2 Brevo (Сервис электронной почты)',
                                    text: 'Magic links и уведомления',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Конфиденциальность'
                                },
                                {
                                    title: '4.3 n8n (Автоматизация)',
                                    text: 'Backend workflows (self-hosted – без внешнего обработчика)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    linkText: 'Инстанция n8n',
                                    external: true
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Куки и локальное хранилище',
                    content: [
                        {
                            type: 'text',
                            value: 'Мы не используем отслеживающие куки. Следующее локальное хранилище:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Настройки, язык, тема'
                                },
                                {
                                    label: 'Кэш Service Worker',
                                    text: 'Офлайн функциональность (PWA)'
                                },
                                {
                                    label: 'Куки',
                                    text: 'Управление сессией (вход через Magic Link)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Ваши права (GDPR)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Право на доступ (ст. 15 GDPR)',
                                    text: 'Вы можете запросить информацию о хранимых данных'
                                },
                                {
                                    label: 'Право на исправление (ст. 16 GDPR)',
                                    text: 'Вы можете запросить исправление неверных данных'
                                },
                                {
                                    label: 'Право на удаление (ст. 17 GDPR)',
                                    text: 'Вы можете запросить удаление ваших данных'
                                },
                                {
                                    label: 'Право на ограничение (ст. 18 GDPR)',
                                    text: 'Вы можете запросить ограничение обработки'
                                },
                                {
                                    label: 'Право на переносимость данных (ст. 20 GDPR)',
                                    text: 'Вы можете получить свои данные в структурированном формате'
                                },
                                {
                                    label: 'Право на возражение (ст. 21 GDPR)',
                                    text: 'Вы можете возразить против обработки'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 Форма обратной связи',
                                    text: 'Отправить запрос',
                                    navigate: '/ru/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        tr: {
            title: 'Gizlilik Politikası',
            description:
                'Veri koruma ve kişisel verilerin işlenmesi hakkında bilgiler',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Giriş',
                    content: [
                        {
                            type: 'text',
                            value: "Gizliliğinizin korunması bizim için çok önemlidir. Bu gizlilik politikası, web sitemiz keymoji.wtf'de kişisel verilerin işlenmesinin niteliği, kapsamı ve amacı hakkında sizi bilgilendirir."
                        },
                        {
                            type: 'text',
                            value: 'Verilerinizi yalnızca yasal düzenlemelere (GDPR, revDSGV, TKG 2003) dayanarak işliyoruz.'
                        }
                    ]
                },
                {
                    title: '2. Sorumlu Taraf',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Responsible Party: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        }
                    ]
                },
                {
                    title: '3. Veri İşleme',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 İstemci Tarafı İşleme (Gizlilik Öncelikli)'
                        },
                        {
                            type: 'text',
                            value: 'Keymoji öncelikle bir istemci tarafı uygulamasıdır. Bu şu anlama gelir:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    text: 'Tüm şifre ve emoji üretimleri tarayıcınızda yerel olarak gerçekleşir'
                                },
                                {
                                    text: 'Ürettiğiniz şifreleri asla görmüyoruz (Zero-Knowledge)'
                                },
                                {
                                    text: 'Şifrelerin sunucularımıza iletilmesi yok'
                                },
                                {
                                    text: 'Veritabanımızda şifre depolanması yok'
                                }
                            ]
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Hesap Oluşturma (isteğe bağlı)'
                        },
                        {
                            type: 'text',
                            value: 'Bir hesap oluşturduğunuzda şunları işliyoruz:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'E-posta adresi',
                                    text: 'Magic Link girişi için'
                                },
                                {
                                    label: 'İsim (isteğe bağlı)',
                                    text: 'Kişiselleştirme için'
                                },
                                {
                                    label: 'Kullanım istatistikleri',
                                    text: 'Günlük üretim sayısı'
                                },
                                {
                                    label: 'Ayarlar',
                                    text: 'Dil, tema, tercihler'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Yasal dayanak: Sözleşmenin yerine getirilmesi (Madde 6 fık. 1 lit. b GDPR)'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Hikaye Modu ve AI Entegrasyonu'
                        },
                        {
                            type: 'text',
                            value: 'Hikaye Modunu kullandığınızda:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'API Anahtarları',
                                    text: 'Şifrelenmiş olarak saklanır'
                                },
                                {
                                    label: 'AI Sağlayıcı',
                                    text: 'OpenAI, Google Gemini, Mistral veya Özel'
                                },
                                {
                                    label: 'Hikaye metinleri',
                                    text: 'Seçilen AI sağlayıcıya iletilir'
                                },
                                {
                                    label: 'Üretilen emojiler',
                                    text: 'Yerel olarak önbelleğe alınır (7 gün)'
                                }
                            ]
                        },
                        {
                            type: 'warning',
                            text: 'Önemli: Kendi API anahtarınızı kullanıyorsunuz. Lütfen sağlayıcınızın gizlilik politikalarını gözden geçirin.',
                            items: [
                                'OpenAI: openai.com/policies/privacy-policy',
                                'Google Gemini: policies.google.com/privacy',
                                'Mistral AI: mistral.ai/terms',
                                'Anthropic Claude: anthropic.com/legal/privacy'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Yasal dayanak: Onay (Madde 6 fık. 1 lit. a GDPR)'
                        }
                    ]
                },
                {
                    title: "4. Harici Hizmetler ve API'ler",
                    content: [
                        {
                            type: 'grid',
                            columns: 2,
                            items: [
                                {
                                    title: '4.1 Vercel (Barındırma)',
                                    text: 'Web sitesi barındırma (Vercel Inc., ABD)',
                                    link: 'https://vercel.com/legal/privacy-policy',
                                    linkText: 'Gizlilik'
                                },
                                {
                                    title: '4.2 Brevo (E-posta Servisi)',
                                    text: 'Magic linkler ve bildirimler',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Gizlilik'
                                },
                                {
                                    title: '4.4 n8n (Otomasyon)',
                                    text: 'Backend iş akışları (kendi barındırılan)',
                                    link: 'https://n8n.io/legal/privacy',
                                    linkText: 'Gizlilik'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '5. Çerezler ve Yerel Depolama',
                    content: [
                        {
                            type: 'text',
                            value: 'Takip çerezleri kullanmıyoruz. Aşağıdaki yerel depolama:'
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'localStorage',
                                    text: 'Ayarlar, dil, tema'
                                },
                                {
                                    label: 'Service Worker Önbelleği',
                                    text: 'Çevrimdışı işlevsellik (PWA)'
                                },
                                {
                                    label: 'Çerezler',
                                    text: 'Oturum yönetimi (Magic Link girişi)'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '6. Haklarınız (GDPR)',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: 'Erişim hakkı (Madde 15 GDPR)',
                                    text: 'Saklanan verileriniz hakkında bilgi talep edebilirsiniz'
                                },
                                {
                                    label: 'Düzeltme hakkı (Madde 16 GDPR)',
                                    text: 'Yanlış verilerin düzeltilmesini talep edebilirsiniz'
                                },
                                {
                                    label: 'Silme hakkı (Madde 17 GDPR)',
                                    text: 'Verilerinizin silinmesini talep edebilirsiniz'
                                },
                                {
                                    label: 'Kısıtlama hakkı (Madde 18 GDPR)',
                                    text: 'İşlemenin kısıtlanmasını talep edebilirsiniz'
                                },
                                {
                                    label: 'Veri taşınabilirliği hakkı (Madde 20 GDPR)',
                                    text: 'Verilerinizi yapılandırılmış formatta alabilirsiniz'
                                },
                                {
                                    label: 'İtiraz hakkı (Madde 21 GDPR)',
                                    text: 'İşlemeye itiraz edebilirsiniz'
                                }
                            ]
                        },
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: '💌 İletişim formu',
                                    text: 'Talep gönderin',
                                    navigate: '/tr/contact'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    legal: {
        de: {
            title: 'Impressum',
            description: 'Angaben gemäß § 5 TMG / § 25 MedienG',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Dienstanbieter & Kontakt',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Dienstanbieter: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: '🍴 GitHub Issues',
                                    text: 'github.com/chooomedia/keymoji/issues',
                                    link: 'https://github.com/chooomedia/keymoji/issues',
                                    external: true
                                },
                                {
                                    label: '💌 Kontaktformular',
                                    text: 'Nachricht senden',
                                    navigate: '/de/contact'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '2. Haftungsausschluss',
                    content: [
                        {
                            type: 'subtitle',
                            value: '2.1 Haftung für Inhalte'
                        },
                        {
                            type: 'text',
                            value: 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.'
                        },
                        {
                            type: 'subtitle',
                            value: '2.2 Haftung für Passwort-Sicherheit'
                        },
                        {
                            type: 'warning',
                            title: 'Wichtig',
                            text: 'Keymoji ist ein Passwort-Generator Tool. Wir übernehmen keine Haftung für Schäden, die durch unsachgemäße Verwendung generierter Passwörter entstehen.'
                        },
                        {
                            type: 'subtitle',
                            value: '2.3 Haftung für AI-Generierung (Story Mode)'
                        },
                        {
                            type: 'warning',
                            text: 'Bei Nutzung des Story Modes:',
                            items: [
                                'Sie verwenden Ihre eigenen API Keys',
                                'Wir haben keine Kontrolle über AI-generierte Inhalte',
                                'Sie sind für die Einhaltung der Provider-Nutzungsbedingungen verantwortlich',
                                'Kosten für AI API Calls gehen zu Ihren Lasten'
                            ]
                        }
                    ]
                },
                {
                    title: '3. Urheberrecht',
                    content: [
                        {
                            type: 'text',
                            value: 'Die Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.'
                        },
                        {
                            type: 'info',
                            title: 'Open Source',
                            items: [
                                { label: 'Lizenz', text: 'MIT License' },
                                {
                                    label: 'Source Code',
                                    text: 'github.com/chooomedia/keymoji',
                                    link: 'https://github.com/chooomedia/keymoji'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '4. Technical Credits',
                    content: [
                        {
                            type: 'card',
                            text: 'Keymoji wird mit folgenden Technologien betrieben:',
                            items: [
                                {
                                    label: 'Frontend',
                                    text: 'Svelte, Tailwind CSS, Webpack'
                                },
                                {
                                    label: 'Backend',
                                    text: 'Vercel Serverless'
                                },
                                {
                                    label: 'Automation',
                                    text: 'n8n (selbst gehostet)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    external: true
                                },
                                { label: 'Email', text: 'Brevo' },
                                {
                                    label: 'AI',
                                    text: 'OpenAI, Google Gemini, Mistral AI, Anthropic Claude'
                                },
                                { label: 'Hosting', text: 'Vercel' }
                            ]
                        }
                    ]
                }
            ]
        },
        en: {
            title: 'Legal Notice',
            description:
                'Legal information according to § 5 TMG / § 25 MedienG',
            lastUpdated: 'April 10, 2026',
            sections: [
                {
                    title: '1. Service Provider & Contact',
                    content: [
                        {
                            type: 'image',
                            src: '/images/keymoji-impressum-contact.png',
                            alt: 'Service Provider: Christopher Matt, CHOOOMEDIA, Switzerland',
                            width: 960,
                            height: 536
                        },
                        {
                            type: 'list',
                            items: [
                                {
                                    label: '🍴 GitHub Issues',
                                    text: 'github.com/chooomedia/keymoji/issues',
                                    link: 'https://github.com/chooomedia/keymoji/issues',
                                    external: true
                                },
                                {
                                    label: '💌 Contact form',
                                    text: 'Send a message',
                                    navigate: '/en/contact'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '2. Disclaimer',
                    content: [
                        {
                            type: 'subtitle',
                            value: '2.1 Liability for Content'
                        },
                        {
                            type: 'text',
                            value: 'As a service provider, we are responsible for our own content on these pages according to general laws.'
                        },
                        {
                            type: 'subtitle',
                            value: '2.2 Password Security Liability'
                        },
                        {
                            type: 'warning',
                            title: 'Important',
                            text: 'Keymoji is a password generator tool. We assume no liability for damages resulting from improper use of generated passwords.'
                        },
                        {
                            type: 'subtitle',
                            value: '2.3 AI Generation Liability (Story Mode)'
                        },
                        {
                            type: 'warning',
                            text: 'When using Story Mode:',
                            items: [
                                'You use your own API keys',
                                'We have no control over AI-generated content',
                                'You are responsible for compliance with provider terms',
                                'AI API costs are your responsibility'
                            ]
                        }
                    ]
                },
                {
                    title: '3. Copyright',
                    content: [
                        {
                            type: 'text',
                            value: 'The content and works on these pages are subject to German copyright law.'
                        },
                        {
                            type: 'info',
                            title: 'Open Source',
                            items: [
                                { label: 'License', text: 'MIT License' },
                                {
                                    label: 'Source Code',
                                    text: 'github.com/chooomedia/keymoji',
                                    link: 'https://github.com/chooomedia/keymoji'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '4. Technical Credits',
                    content: [
                        {
                            type: 'card',
                            text: 'Keymoji is powered by the following technologies:',
                            items: [
                                {
                                    label: 'Frontend',
                                    text: 'Svelte, Tailwind CSS, Webpack'
                                },
                                {
                                    label: 'Backend',
                                    text: 'Vercel Serverless'
                                },
                                {
                                    label: 'Automation',
                                    text: 'n8n (self-hosted)',
                                    link: 'https://matt-interfaces.ch/n8n',
                                    external: true
                                },
                                { label: 'Email', text: 'Brevo' },
                                {
                                    label: 'AI',
                                    text: 'OpenAI, Google Gemini, Mistral AI, Anthropic Claude'
                                },
                                { label: 'Hosting', text: 'Vercel' }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};

// Legacy compatibility: Export in old format
export const privacyContent = staticPagesData.privacy;
export const legalContent = staticPagesData.legal;

export default staticPagesData;
