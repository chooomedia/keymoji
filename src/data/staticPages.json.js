// src/data/staticPages.json.js
// Pure JSON data structure for static pages
// Separation of Content and Presentation (Best Practice)

export const staticPagesData = {
    privacy: {
        de: {
            title: 'Datenschutzerklärung',
            description:
                'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten',
            lastUpdated: '2025-10-10',
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
                            type: 'card',
                            items: [
                                { label: 'Name', text: 'Christopher Matt' },
                                { label: 'Firma', text: 'Chooomedia' },
                                {
                                    label: 'Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: 'Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
                                }
                            ]
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
                                    text: 'Für Magic Link Login'
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
                                'Mistral AI: mistral.ai/terms'
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
                                    linkText: 'Datenschutz →'
                                },
                                {
                                    title: '4.2 Google Sheets (Datenbank)',
                                    text: 'Kontodaten werden in Google Sheets gespeichert',
                                    link: 'https://policies.google.com/privacy',
                                    linkText: 'Datenschutz →'
                                },
                                {
                                    title: '4.3 Brevo (E-Mail-Versand)',
                                    text: 'Magic Links und Benachrichtigungen',
                                    link: 'https://www.brevo.com/legal/privacypolicy/',
                                    linkText: 'Datenschutz →'
                                },
                                {
                                    title: '4.4 n8n (Automation)',
                                    text: 'Backend-Workflows (selbst gehostet)',
                                    link: 'https://n8n.io/legal/privacy',
                                    linkText: 'Datenschutz →'
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
                                    text: 'Session-Management (Magic Link Login)'
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
                            type: 'text',
                            value: 'Für Anfragen kontaktieren Sie uns unter: hello@keymoji.wtf'
                        }
                    ]
                },
                {
                    title: '7. Kontakt',
                    content: [
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: 'Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: 'Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
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
            lastUpdated: '2025-10-10',
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
                            type: 'card',
                            items: [
                                { label: 'Name', text: 'Christopher Matt' },
                                { label: 'Company', text: 'Chooomedia' },
                                {
                                    label: 'Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: 'Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
                                }
                            ]
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
                                'Mistral AI: mistral.ai/terms'
                            ]
                        },
                        {
                            type: 'text',
                            value: 'Legal basis: Consent (Art. 6 para. 1 lit. a GDPR)'
                        }
                    ]
                },
                {
                    title: '4. Your Rights (GDPR)',
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
                            type: 'text',
                            value: 'Contact us at: hello@keymoji.wtf'
                        }
                    ]
                },
                {
                    title: '5. Contact',
                    content: [
                        {
                            type: 'contact',
                            items: [
                                {
                                    label: 'Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: 'Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
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
            lastUpdated: '2025-10-10',
            sections: [
                {
                    title: '1. Dienstanbieter',
                    content: [
                        {
                            type: 'card',
                            items: [
                                { label: 'Name', text: 'Christopher Matt' },
                                { label: 'Firma', text: 'Chooomedia' },
                                {
                                    label: 'Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: 'Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '2. Kontakt',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: '📧 Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: '🌐 Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
                                },
                                {
                                    label: '🐛 GitHub',
                                    text: 'github.com/chooomedia/keymoji/issues',
                                    link: 'https://github.com/chooomedia/keymoji/issues'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '3. Haftungsausschluss',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Haftung für Inhalte'
                        },
                        {
                            type: 'text',
                            value: 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.'
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Haftung für Passwort-Sicherheit'
                        },
                        {
                            type: 'warning',
                            title: 'Wichtig',
                            text: 'Keymoji ist ein Passwort-Generator Tool. Wir übernehmen keine Haftung für Schäden, die durch unsachgemäße Verwendung generierter Passwörter entstehen.'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 Haftung für AI-Generierung (Story Mode)'
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
                    title: '4. Urheberrecht',
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
                    title: '5. Technical Credits',
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
                                    text: 'Vercel Serverless, n8n Automation'
                                },
                                { label: 'Database', text: 'Google Sheets' },
                                { label: 'Email', text: 'Brevo' },
                                {
                                    label: 'AI',
                                    text: 'OpenAI, Google Gemini, Mistral AI'
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
            lastUpdated: '2025-10-10',
            sections: [
                {
                    title: '1. Service Provider',
                    content: [
                        {
                            type: 'card',
                            items: [
                                { label: 'Name', text: 'Christopher Matt' },
                                { label: 'Company', text: 'Chooomedia' },
                                {
                                    label: 'Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: 'Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '2. Contact',
                    content: [
                        {
                            type: 'list',
                            items: [
                                {
                                    label: '📧 Email',
                                    text: 'hello@keymoji.wtf',
                                    link: 'mailto:hello@keymoji.wtf'
                                },
                                {
                                    label: '🌐 Website',
                                    text: 'keymoji.wtf',
                                    link: 'https://keymoji.wtf'
                                },
                                {
                                    label: '🐛 GitHub',
                                    text: 'github.com/chooomedia/keymoji/issues',
                                    link: 'https://github.com/chooomedia/keymoji/issues'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '3. Disclaimer',
                    content: [
                        {
                            type: 'subtitle',
                            value: '3.1 Liability for Content'
                        },
                        {
                            type: 'text',
                            value: 'As a service provider, we are responsible for our own content on these pages according to general laws.'
                        },
                        {
                            type: 'subtitle',
                            value: '3.2 Password Security Liability'
                        },
                        {
                            type: 'warning',
                            title: 'Important',
                            text: 'Keymoji is a password generator tool. We assume no liability for damages resulting from improper use of generated passwords.'
                        },
                        {
                            type: 'subtitle',
                            value: '3.3 AI Generation Liability (Story Mode)'
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
                    title: '4. Copyright',
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
                    title: '5. Technical Credits',
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
                                    text: 'Vercel Serverless, n8n Automation'
                                },
                                { label: 'Database', text: 'Google Sheets' },
                                { label: 'Email', text: 'Brevo' },
                                {
                                    label: 'AI',
                                    text: 'OpenAI, Google Gemini, Mistral AI'
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
