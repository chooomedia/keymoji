import { appVersion } from '../../src/utils/version';
import {
    emailIcon,
    fbmessengerIcon,
    kofiIcon,
    linkedinIcon,
    logo,
    paypalIcon,
    redditIcon,
    whatsappIcon,
    instagramIcon
} from './shapes';

export const content = {
    logo: {
        svg: logo
    },
    en: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emoji Password Generator',
            pageDescription:
                '🔑 Passwords reimagined. 🎯 Uncrackable emoji passwords. 🌈 Free. Secure. Innovative. 🤖 AI-resistant technology. 🌍 Available in 15+ languages.',
            pageKeywords:
                'Keymoji, emoji password, password generator, security, online security',
            pageInstruction: [
                'Click "📝 Story" for your AI emoji tale 📖',
                '"Random" is self-explanatory 😜.',
                "After generating, it's saved to your clipboard! 📋"
            ],
            backToMainText: 'Click on below 👇 to get back',
            backToMainButtonText: 'Back to main view 🔙',
            contactText: 'Got a question or a cool suggestion?',
            contactButtonText: 'Send me a message! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Click or press Enter to copy the generated emoji password to clipboard',
            successMessage: 'Success, copied into your Clipboard 💾',
            errorMessage: 'Oops, something went wrong 🤖',
            dailyLimitReachedMessage:
                'Sorry, daily limit of requests reached 😔',
            successStoryMessage: 'Success, Emoji story generated 🤖',
            errorStoryMessage: 'Error, no answer from server 🌀',
            emojiDisplayTitle: 'Emoji Password Generator',
            dataPrivacyProcessingInfo:
                "🚀 Emoji magic via webhooks and AI! ✨ Data's like beach sand - it doesn't stay.",
            clearButton: '✖️ Clear',
            storyButton: '📝 Story',
            storyButtonClicked: '📩 Send story',
            randomButton: '*️⃣ Random'
        },
        donateButton: {
            text: 'Buy me a coffee',
            openText: 'Close this menu',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Your Name',
            emailLabel: '📧 Your Email',
            messageLabel: '✍🏻 Your Message',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Send',
            successMessage: 'Success, Message sent - Answer: < 24 hours 🚀',
            errorMessage: 'An unexpected error occurred 😟',
            requestErrorMessage:
                'Error sending the message, please try again 🙁',
            smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
            introductionTitle: "Hi, i'm Christopher",
            introductionText:
                "Frontend Developer and i love to design and code userfriendly Websites with JavaScript, PHP and HTML. Don't hesitate and send me a message if you like.",
            privacyNotice:
                'Rest assured, your data is in good hands with us 🤲. Your details will not be passed on to third parties 🔒.',
            newsletterLabel: 'Yes, I would like to subscribe to the newsletter',
            emailText: {
                greeting: 'Welcome',
                intro: 'Thank you for sending a message 📩!',
                doubleCheck:
                    'Please confirm your request so that Christopher knows that you are not a smart bot. You sent a message with the following Data:',
                button: '✅ Confirm request',
                privacy:
                    'Rest assured, your data is in good hands with us 🤲.<br>Your details will not be passed on to third parties 🔒.'
            },
            backToMainButton: '🔙 Back',
            footerText: 'Developed with ❤️ in Switzerland'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Discover%20Keymoji%2C%20the%20innovative%20Emoji%20Password%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'share on whatsapp',
                    title: 'Whatsapp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Discover%20Keymoji%2C%20the%20Emoji%20Password%20Generator',
                    svgContent: redditIcon,
                    alt: 'share on reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https://keymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'share on linkedin',
                    title: 'Linkedin',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'share via facebook messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Discover%20Keymoji&body=Try%20out%20Keymoji%2C%20the%20innovative%20Emoji%20Password%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'share via e-mail',
                    title: 'E-Mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Discover Keymoji, the innovative Emoji Password Generator!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'share on Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Oops! Page not found 🚫',
            suggestion:
                "Maybe the page moved or you mistyped the URL. Let's get you back on track! 🛤️",
            returnButton: 'Back to Home 🏠'
        }
    },
    de: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emoji Passwort Generator',
            pageDescription:
                '🔑 Passwörter neu gedacht. 🎯 Unknackbare Emoji-Passwörter. 🌈 Kostenlos. Sicher. Innovativ. 🤖 KI-resistente Technologie. 🌍 In 15+ Sprachen verfügbar.',
            pageKeywords:
                'Keymoji, Emoji Passwort, Passwort Generator, Sicherheit, Online Sicherheit',
            pageInstruction: [
                'Klicke auf "📝 Geschichte" für deine KI Emoji Erzählung 📖',
                '"Zufällig" ist selbsterklärend 😜.',
                'Nach dem Generieren wird es in deine Zwischenablage kopiert! 📋'
            ],
            backToMainText: 'Klicke unten 👇 um zurückzukehren',
            backToMainButtonText: 'Zurück zur Hauptansicht 🔙',
            contactText: 'Hast du eine Frage oder einen coolen Vorschlag?',
            contactButtonText: 'Schick mir eine Nachricht! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Klicken oder Enter drücken um das generierte Emoji-Passwort in die Zwischenablage zu kopieren',
            successMessage: 'Erfolg, in die Zwischenablage kopiert 💾',
            errorMessage: 'Ups, etwas ist schiefgelaufen 🤖',
            dailyLimitReachedMessage:
                'Sorry, tägliches Limit an Anfragen erreicht 😔',
            successStoryMessage: 'Erfolg, Emoji Geschichte generiert 🤖',
            errorStoryMessage: 'Fehler, keine Antwort vom Server 🌀',
            emojiDisplayTitle: 'Emoji Passwort Generator',
            dataPrivacyProcessingInfo:
                '🚀 Emoji Magie via Webhooks und KI! ✨ Deine Daten sind wie Sand am Strand - sie bleiben nicht.',
            clearButton: '✖️ Löschen',
            storyButton: '📝 Geschichte',
            storyButtonClicked: '📩 Geschichte senden',
            randomButton: '*️⃣ Zufällig'
        },
        donateButton: {
            text: 'Kauf mir einen Kaffee',
            openText: 'Menü schließen',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Dein Name',
            emailLabel: '📧 Deine E-Mail',
            messageLabel: '✍🏻 Deine Nachricht',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Senden',
            successMessage:
                'Erfolg, Nachricht gesendet - Antwort: < 24 Stunden 🚀',
            errorMessage: 'Ein unerwarteter Fehler ist aufgetreten 😟',
            requestErrorMessage:
                'Fehler beim Senden der Nachricht, bitte versuche es erneut 🙁',
            smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
            introductionTitle: 'Hallo, ich bin Christopher',
            introductionText:
                'Frontend Entwickler und ich liebe es, benutzerfreundliche Webseiten mit JavaScript, PHP und HTML zu gestalten und zu programmieren. Zögere nicht und schick mir eine Nachricht, wenn es dir gefällt.',
            privacyNotice:
                'Keine Sorge, deine Daten sind bei uns in guten Händen 🤲. Deine Details werden nicht an Dritte weitergegeben 🔒.',
            newsletterLabel: 'Ja ich möchte den Newsletter abonnieren',
            emailText: {
                greeting: 'Willkommen',
                intro: 'Danke für das Senden einer Nachricht 📩!',
                doubleCheck:
                    'Bitte bestätige deine Anfrage, damit Christopher weiß, dass du kein cleverer Bot bist. Du hast folgende Daten gesendet:',
                button: '✅ Anfrage bestätigen',
                privacy:
                    'Keine Sorge, deine Daten sind bei uns in guten Händen 🤲.<br>Deine Details werden nicht an Dritte weitergegeben 🔒.'
            },
            backToMainButton: '🔙 Zurück',
            footerText: 'Mit ❤️ in der Schweiz entwickelt'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Entdecke%20Keymoji%2C%20den%20innovativen%20Emoji%20Passwort%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'Teilen auf WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Entdecke%20Keymoji%2C%20den%20Emoji%20Passwort%20Generator',
                    svgContent: redditIcon,
                    alt: 'Teilen auf Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Teilen auf LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Teilen via Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Entdecke%20Keymoji&body=Probiere%20Keymoji%20aus%2C%20den%20innovativen%20Emoji%20Passwort%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Teilen via E-Mail',
                    title: 'E-Mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Entdecke Keymoji, den innovativen Emoji-Passwort-Generator!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Teilen via Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Hoppla! Seite nicht gefunden 🚫',
            suggestion:
                'Vielleicht wurde die Seite verschoben oder du hast die URL falsch eingegeben. Lass uns dich zurückbringen! 🛤️',
            description:
                'Die Seite, die du suchst, existiert nicht oder wurde entfernt.',
            returnButton: 'Zurück zum Start 🏠'
        }
    },
    dech: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emoji Passwort Generator',
            pageDescription:
                '🔑 Keymoji, dr innovativ Emoji Passwort Generator, überdacht dini Passwortsicherheit. 🎯 Unknackbar Emoji-Passwörter. 🌈 Komplett gratis. 🤖 KI-resistent. 🌍 Über 15 Sprach verfügbar.',
            pageKeywords:
                'Keymoji, emoji Passwort, Passwort Generator, Sicherheit, Online Sicherheit',
            pageInstruction: [
                'Klick "📝 Gschicht" für dini AI Emoji Erzählung 📖',
                '"Zuefällig" isch sälberklärend 😜.',
                "Nachem Generiere isch's gspicheret uf dim Clipboard! 📋"
            ],
            backToMainText: 'Klick unterhalb 👇 zum zrugg gah',
            backToMainButtonText: 'Zrugg zur Hauptsiite 🔙',
            contactText: 'Hesch e Frog oder e coole Vorschlag?',
            contactButtonText: 'Schick mer e Nachricht! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                "Klick oder drück Enter zum Kopiere vom generierte Emoji-Passwort in d'Zwüscheablag",
            successMessage: 'Erfolg, kopiert is Clipboard 💾',
            errorMessage: 'Huch, öppis isch schiefgloffe 🤖',
            dailyLimitReachedMessage:
                'Sorry, täglichs Limit a Aafroge erreiched 😔',
            successStoryMessage: 'Erfolg, Emoji Gschicht generiert 🤖',
            errorStoryMessage: 'Fehler, kei Antwort vom Server 🌀',
            emojiDisplayTitle: 'Emoji Passwort Generator',
            dataPrivacyProcessingInfo:
                '🚀 Emoji Magie via Webhooks und AI! ✨ Dini Date sind wie Sand am Strand - si blibe nid.',
            clearButton: '✖️ Lösche',
            storyButton: '📝 Gschicht',
            storyButtonClicked: '📩 Gschicht schicke',
            randomButton: '*️⃣ Zuefällig'
        },
        donateButton: {
            text: 'Kauf mer en Kafi',
            openText: 'Menü schliesse',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Dis Name',
            emailLabel: '📧 Disi E-Mail',
            messageLabel: '✍🏻 Disi Nachricht',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Schicke',
            successMessage:
                'Erfolg, Nachricht gschickt - Antwort: < 24 Stunde 🚀',
            errorMessage: 'Es isch en unerwartete Fehler passiert 😟',
            requestErrorMessage:
                "Fehler bim Schicke vo der Nachricht, bitte probier's nomal 🙁",
            smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
            introductionTitle: 'Hallo, ich bi de Christopher',
            introductionText:
                "Frontend Entwickler und ich liebe es, benutzerfreundlichi Webseiten mit JavaScript, PHP und HTML z'gestalte und z'programmiere. Zöger nid und schick mer e Nachricht, wenn's Dir gfallt.",
            privacyNotice:
                'Kei Sorge, mit dine Date wird guet umgange bi üs 🤲. Dini Detail werde nid an Drüttparteie wiitergäh 🔒.',
            emailText: {
                greeting: 'Willkomme',
                intro: 'Danke fürs Schicke vo ere Nachricht 📩!',
                doubleCheck:
                    'Bitte bestätig disi Aafrog, damit Christopher weiss, dass Du kei gschickte Bot bisch. Du hesch folgendi Date gschickt:',
                button: '✅ Aafrog bestätige',
                privacy:
                    'Kei Sorge, mit dine Date wird guet umgange bi üs 🤲.<br>Dini Detail werde nid an Drüttparteie wiitergäh 🔒.'
            },
            backToMainButton: '🔙 Zrugg',
            footerText: 'Mit ❤️ i de Schwiiz entwickelt'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Entdecke%20Keymoji%2C%20de%20innovativ%20Emoji%20Passwort%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'Teile uf WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Entdecke%20Keymoji%2C%20de%20Emoji%20Passwort%20Generator',
                    svgContent: redditIcon,
                    alt: 'Teile uf Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Teile uf LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Teile via Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Entdecke%20Keymoji&body=Probiere%20Keymoji%20us%2C%20de%20innovativ%20Emoji%20Passwort%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Teile via E-Mail',
                    title: 'E-Mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Luagsch a moi Keymoji, dr innovative Emoji-Passwort-Generator!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Teile uf Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Hoppla! Siite nid gfunde 🚫',
            suggestion:
                'Vilicht isch d Siite verschobe worde oder du hesch d URL falsch iitippt. Mir helfe der zrugg z cho! 🛤️',
            returnButton: 'Zrugg zum Start 🏠'
        }
    },
    es: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Generador de Contraseñas Emoji',
            pageDescription:
                '🔑 Contraseñas reinventadas. 🎯 Contraseñas emoji irrompibles. 🌈 Gratis. Seguro. Innovador. 🤖 Tecnología resistente a IA. 🌍 En más de 15 idiomas.',
            pageKeywords:
                'Keymoji, contraseña emoji, generador de contraseñas, seguridad, seguridad en línea',
            pageInstruction: [
                'Haz clic en "📝 Historia" para tu cuento emoji de IA 📖',
                '"Aleatorio" es autoexplicativo 😜.',
                'Después de generar, ¡se guarda en tu portapapeles! 📋'
            ],
            backToMainText: 'Haz clic abajo 👇 para volver',
            backToMainButtonText: 'Volver a la vista principal 🔙',
            contactText: '¿Tienes una pregunta o una sugerencia genial?',
            contactButtonText: '¡Envíame un mensaje! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Haga clic o presione Enter para copiar la contraseña emoji generada al portapapeles',
            successMessage: 'Éxito, copiado en tu portapapeles 💾',
            errorMessage: 'Ups, algo salió mal 🤖',
            dailyLimitReachedMessage:
                'Lo siento, límite diario de solicitudes 😔',
            successStoryMessage: 'Éxito, historia de emoji generada 🤖',
            errorStoryMessage: 'Error, sin respuesta del servidor 🌀',
            emojiDisplayTitle: 'Generador de Contraseñas Emoji',
            dataPrivacyProcessingInfo:
                '🚀 Magia emoji a través de webhooks y IA! ✨ Los datos son como la arena de la playa, no se quedan.',
            clearButton: '✖️ Limpiar',
            storyButton: '📝 Historia',
            storyButtonClicked: '📩 Enviar historia',
            randomButton: '*️⃣ Aleatorio'
        },
        donateButton: {
            text: 'Cómprame un café',
            openText: 'Cerrar este menú',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Tu nombre',
            emailLabel: '📧 Tu correo electrónico',
            messageLabel: '✍🏻 Tu mensaje',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Enviar',
            successMessage: 'Éxito, mensaje enviado - Respuesta: < 24 horas 🚀',
            errorMessage: 'Ocurrió un error inesperado 😟',
            requestErrorMessage:
                'Error al enviar el mensaje, por favor intenta de nuevo 🙁',
            smirkingFaceImageAlt: 'emoji keymoji smirkingface 1f60f',
            introductionTitle: 'Hola, soy Christopher',
            introductionText:
                'Desarrollador Frontend y me encanta diseñar y programar sitios web amigables con JavaScript, PHP y HTML. No dudes en enviarme un mensaje si te gusta.',
            privacyNotice:
                'Descuida, tus datos están en buenas manos con nosotros 🤲. Tus detalles no serán compartidos con terceros 🔒.',
            emailText: {
                greeting: 'Bienvenido',
                intro: 'Gracias por enviar un mensaje 📩!',
                doubleCheck:
                    'Por favor confirma tu solicitud para que Christopher sepa que no eres un bot inteligente. Enviaste un mensaje con los siguientes datos:',
                button: '✅ Confirmar solicitud',
                privacy:
                    'Descuida, tus datos están en buenas manos con nosotros 🤲.<br>Tus detalles no serán compartidos con terceros 🔒.'
            },
            backToMainButton: '🔙 Volver',
            footerText: 'Desarrollado con ❤️ en Suiza'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Descubre%20Keymoji%2C%20el%20innovador%20Generador%20de%20Contraseñas%20Emoji!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'Compartir en WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Descubre%20Keymoji%2C%20el%20Generador%20de%20Contraseñas%20Emoji',
                    svgContent: redditIcon,
                    alt: 'Compartir en Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Compartir en LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Compartir vía Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Descubre%20Keymoji&body=Prueba%20Keymoji%2C%20el%20innovador%20Generador%20de%20Contraseñas%20Emoji!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Compartir vía correo electrónico',
                    title: 'Correo electrónico',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Descubre Keymoji, el innovador generador de contraseñas Emoji!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'compartir en Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: '¡Ups! Página no encontrada 🚫',
            suggestion:
                'Tal vez la página se movió o escribiste mal la URL. ¡Vamos a llevarte de vuelta! 🛤️',
            returnButton: 'Volver al inicio 🏠'
        }
    },
    nl: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emoji Wachtwoordgenerator',
            pageDescription:
                '🔑 Wachtwoorden opnieuw bedacht. 🎯 Onkraakbare emoji-wachtwoorden. 🌈 Gratis. Veilig. Innovatief. 🤖 AI-resistente technologie. 🌍 In 15+ talen.',
            pageKeywords:
                'Keymoji, emoji wachtwoord, wachtwoordgenerator, beveiliging, online beveiliging',
            pageInstruction: [
                'Klik op "📝 Verhaal" voor je AI emoji verhaal 📖',
                '"Willekeurig" spreekt voor zich 😜.',
                'Na het genereren wordt het opgeslagen op je klembord! 📋'
            ],
            backToMainText: 'Klik hieronder 👇 om terug te gaan',
            backToMainButtonText: 'Terug naar hoofdscherm 🔙',
            contactText: 'Heb je een vraag of een geweldig idee?',
            contactButtonText: 'Stuur mij een bericht! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Klik of druk op Enter om het gegenereerde emoji-wachtwoord naar het klembord te kopiëren',
            successMessage: 'Succes, gekopieerd naar je klembord 💾',
            errorMessage: 'Oeps, er ging iets fout 🤖',
            dailyLimitReachedMessage: 'Sorry, limiet aan verzoeken bereikt 😔',
            successStoryMessage: 'Succes, emoji verhaal gegenereerd 🤖',
            errorStoryMessage: 'Fout, geen antwoord van server 🌀',
            emojiDisplayTitle: 'Emoji Wachtwoordgenerator',
            dataPrivacyProcessingInfo:
                '🚀 Emoji magie via webhooks en AI! ✨ Gegevens zijn als strandzand - ze blijven niet hangen.',
            clearButton: '✖️ Wissen',
            storyButton: '📝 Verhaal',
            storyButtonClicked: '📩 Verhaal verzenden',
            randomButton: '*️⃣ Willekeurige'
        },
        donateButton: {
            text: 'Koop mij een koffie',
            openText: 'Dit menu sluiten',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Jouw naam',
            emailLabel: '📧 Jouw e-mail',
            messageLabel: '✍🏻 Jouw bericht',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Verzenden',
            successMessage: 'Succes, bericht verzonden - Antwoord: < 24 uur 🚀',
            errorMessage: 'Er is een onverwachte fout opgetreden 😟',
            requestErrorMessage:
                'Fout bij het verzenden van het bericht, probeer het opnieuw 🙁',
            smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
            introductionTitle: 'Hallo, ik ben Christopher',
            introductionText:
                'Frontend ontwikkelaar en ik houd ervan om gebruiksvriendelijke websites te ontwerpen en te coderen met JavaScript, PHP en HTML. Aarzel niet om mij een bericht te sturen als je het leuk vindt.',
            privacyNotice:
                'Wees gerust, jouw gegevens zijn in goede handen bij ons 🤲. Jouw details worden niet aan derden doorgegeven 🔒.',
            emailText: {
                greeting: 'Welkom',
                intro: 'Bedankt voor het versturen van een bericht 📩!',
                doubleCheck:
                    'Bevestig alsjeblieft jouw verzoek zodat Christopher weet dat je geen slimme bot bent. Je hebt een bericht gestuurd met de volgende gegevens:',
                button: '✅ Verzoek bevestigen',
                privacy:
                    'Wees gerust, jouw gegevens zijn in goede handen bij ons 🤲.<br>Jouw details worden niet aan derden doorgegeven 🔒.'
            },
            backToMainButton: '🔙 Terug',
            footerText: 'Ontwikkeld met ❤️ in Zwitserland'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Ontdek%20Keymoji%2C%20de%20innovatieve%20Emoji%20Wachtwoordgenerator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'Delen op WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Ontdek%20Keymoji%2C%20de%20Emoji%20Wachtwoordgenerator',
                    svgContent: redditIcon,
                    alt: 'Delen op Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Delen op LinkeIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Delen via Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Ontdek%20Keymoji&body=Probeer%20Keymoji%2C%20de%20innovatieve%20Emoji%20Wachtwoordgenerator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Delen via e-mail',
                    title: 'E-mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Ontdek Keymoji, de innovatieve Emoji-wachtwoordgenerator!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Delen via Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Oeps! Pagina niet gevonden 🚫',
            suggestion:
                'Misschien is de pagina verplaatst of heb je de URL verkeerd ingetypt. Laten we je terugbrengen! 🛤️',
            returnButton: 'Terug naar Home 🏠'
        }
    },
    it: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Generatore di Password Emoji',
            pageDescription:
                "🔑 Password reinventati. 🎯 Password emoji infrangibili. 🌈 Gratuiti. Sicuri. Innovativi. 🤖 Tecnologia resistente all'IA. 🌍 Disponibile in 15+ lingue.",
            pageKeywords:
                'Keymoji, password emoji, generatore di password, sicurezza, sicurezza online',
            pageInstruction: [
                'Clicca su "📝 Storia" per la tua storia emoji IA 📖',
                '"Casuale" è autoesplicativo 😜.',
                'Dopo la generazione, è salvato nella tua clipboard! 📋'
            ],
            backToMainText: 'Clicca qui sotto 👇 per tornare',
            backToMainButtonText: 'Torna alla vista principale 🔙',
            contactText: "Hai una domanda o un'ottima idea?",
            contactButtonText: 'Inviami un messaggio! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Clicca o premi Invio per copiare la password emoji generata negli appunti',
            successMessage: 'Successo, copiato nella tua clipboard 💾',
            errorMessage: 'Ops, qualcosa è andato storto 🤖',
            dailyLimitReachedMessage:
                'Spiacente, limite giornaliero di richieste 😔',
            successStoryMessage: 'Successo, storia emoji generata 🤖',
            errorStoryMessage: 'Errore, nessuna risposta dal server 🌀',
            emojiDisplayTitle: 'Generatore di Password Emoji',
            dataPrivacyProcessingInfo:
                '🚀 Magia emoji tramite webhooks e IA! ✨ I dati sono come la sabbia della spiaggia - non rimangono.',
            clearButton: '✖️ Pulisci',
            storyButton: '📝 Storia',
            storyButtonClicked: '📩 Invia storia',
            randomButton: '*️⃣ Casuale'
        },
        donateButton: {
            text: 'Offrimi un caffè',
            openText: 'Chiudi questo menu',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Il tuo nome',
            emailLabel: '📧 La tua email',
            messageLabel: '✍🏻 Il tuo messaggio',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Invia',
            successMessage:
                'Successo, messaggio inviato - Risposta: < 24 ore 🚀',
            errorMessage: 'Si è verificato un errore imprevisto 😟',
            requestErrorMessage: "Errore nell'invio del messaggio, riprova 🙁",
            smirkingFaceImageAlt: 'emoji keymoji smirkingface 1f60f',
            introductionTitle: 'Ciao, sono Christopher',
            introductionText:
                'Sviluppatore frontend e amo progettare e codificare siti web user-friendly con JavaScript, PHP e HTML. Non esitare a inviarmi un messaggio se ti piace.',
            privacyNotice:
                'Stai tranquillo, i tuoi dati sono in buone mani con noi 🤲. I tuoi dettagli non saranno condivisi con terzi 🔒.',
            emailText: {
                greeting: 'Benvenuto',
                intro: 'Grazie per aver inviato un messaggio 📩!',
                doubleCheck:
                    'Conferma la tua richiesta per far sapere a Christopher che non sei un bot intelligente. Hai inviato un messaggio con i seguenti dati:',
                button: '✅ Conferma richiesta',
                privacy:
                    'Stai tranquillo, i tuoi dati sono in buone mani con noi 🤲.<br>I tuoi dettagli non saranno condivisi con terzi 🔒.'
            },
            backToMainButton: '🔙 Torna',
            footerText: 'Sviluppato con ❤️ in Svizzera'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: "https://api.whatsapp.com/send?text=Scopri%20Keymoji%2C%20l'innovativo%20Generatore%20di%20Password%20Emoji!%20https%3A%2F%2Fkeymoji.wtf",
                    svgContent: whatsappIcon,
                    alt: 'Condividi su WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Scopri%20Keymoji%2C%20il%20Generatore%20di%20Password%20Emoji',
                    svgContent: redditIcon,
                    alt: 'Condividi su Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Condividi su LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Condividi tramite Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: "mailto:?subject=Scopri%20Keymoji&body=Prova%20Keymoji%2C%20l'innovativo%20Generatore%20di%20Password%20Emoji!%20https%3A%2F%2Fkeymoji.wtf",
                    svgContent: emailIcon,
                    alt: 'Condividi tramite e-mail',
                    title: 'E-mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Scopri Keymoji, il generatore di password Emoji innovativo!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Condividi tramite Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Ops! Pagina non trovata 🚫',
            suggestion:
                "Forse la pagina è stata spostata o hai digitato l'URL in modo errato. Ti aiutiamo a tornare in carreggiata! 🛤️",
            returnButton: 'Torna alla Home 🏠'
        }
    },
    fr: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Générateur de Mot de Passe Emoji',
            pageDescription:
                "🔑 Mots de passe réinventés. 🎯 Mots de passe emoji incassables. 🌈 Gratuit. Sûr. Innovant. 🤖 Technologie résistante à l'IA. 🌍 En plus de 15 langues.",
            pageKeywords:
                'Keymoji, mot de passe emoji, générateur de mot de passe, sécurité, sécurité en ligne',
            pageInstruction: [
                'Cliquez sur "📝 Histoire" pour votre conte emoji IA 📖',
                '"Aléatoire" est explicite 😜.',
                'Après la génération, il est enregistré dans votre presse-papiers ! 📋'
            ],
            backToMainText: 'Cliquez ci-dessous 👇 pour revenir',
            backToMainButtonText: 'Retour à la vue principale 🔙',
            contactText: 'Vous avez une question ou une excellente idée ?',
            contactButtonText: 'Envoyez-moi un message ! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Cliquez ou appuyez sur Entrée pour copier le mot de passe emoji généré dans le presse-papiers',
            successMessage: 'Succès, copié dans votre presse-papiers 💾',
            errorMessage: 'Oups, quelque chose a mal tourné 🤖',
            dailyLimitReachedMessage:
                'Désolé, limite quotidienne de demandes 😔',
            successStoryMessage: 'Succès, histoire emoji générée 🤖',
            errorStoryMessage: 'Erreur, pas de réponse du serveur 🌀',
            emojiDisplayTitle: 'Générateur de Mot de Passe Emoji',
            dataPrivacyProcessingInfo:
                "🚀 Magie emoji via les webhooks et l'IA ! ✨ Les données sont comme le sable de la plage - elles ne restent pas.",
            clearButton: '✖️ Effacer',
            storyButton: '📝 Histoire',
            storyButtonClicked: "📩 Envoyer l'histoire",
            randomButton: '*️⃣ Aléatoire'
        },
        donateButton: {
            text: 'Offrez-moi un café',
            openText: 'Fermer ce menu',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Votre nom',
            emailLabel: '📧 Votre email',
            messageLabel: '✍🏻 Votre message',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Envoyer',
            successMessage: 'Succès, message envoyé - Réponse : < 24 heures 🚀',
            errorMessage: "Une erreur inattendue s'est produite 😟",
            requestErrorMessage:
                "Erreur lors de l'envoi du message, veuillez réessayer 🙁",
            smirkingFaceImageAlt: 'emoji keymoji visage narquois 1f60f',
            introductionTitle: 'Salut, je suis Christopher',
            introductionText:
                "Développeur Frontend et j'adore concevoir et coder des sites web conviviaux avec JavaScript, PHP et HTML. N'hésitez pas à m'envoyer un message si cela vous plaît.",
            privacyNotice:
                'Soyez rassuré, vos données sont entre de bonnes mains avec nous 🤲. Vos détails ne seront pas partagés avec des tiers 🔒.',
            emailText: {
                greeting: 'Bienvenue',
                intro: "Merci d'avoir envoyé un message 📩!",
                doubleCheck:
                    "Veuillez confirmer votre demande pour que Christopher sache que vous n'êtes pas un robot intelligent. Vous avez envoyé un message avec les données suivantes :",
                button: '✅ Confirmer la demande',
                privacy:
                    'Soyez rassuré, vos données sont entre de bonnes mains avec nous 🤲.<br>Vos détails ne seront pas partagés avec des tiers 🔒.'
            },
            backToMainButton: '🔙 Retour',
            footerText: 'Développé avec ❤️ en Suisse'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Découvrez%20Keymoji%2C%20le%20générateur%20de%20mot%20de%20passe%20emoji%20innovant%20!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'Partager sur WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Découvrez%20Keymoji%2C%20le%20générateur%20de%20mot%20de%20passe%20emoji',
                    svgContent: redditIcon,
                    alt: 'Partager sur Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Partager sur LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Partager via Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Découvrez%20Keymoji&body=Essayez%20Keymoji%2C%20le%20générateur%20de%20mot%20de%20passe%20emoji%20innovant%20!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Partager par e-mail',
                    title: 'E-mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Découvrez Keymoji, le générateur de mots de passe Emoji innovant !'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Partager par Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Oups ! Page non trouvée 🚫',
            suggestion:
                "Peut-être que la page a été déplacée ou que vous avez mal tapé l'URL. Nous allons vous ramener sur le droit chemin ! 🛤️",
            returnButton: "Retour à l'accueil 🏠"
        }
    },
    pl: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Generator Hasła Emoji',
            pageDescription:
                '🔑 Hasła na nowo pomyślane. 🎯 Niezłomne hasła emoji. 🌈 Darmowe. Bezpieczne. Innowacyjne. 🤖 Technologia odporna na AI. 🌍 W ponad 15 językach.',
            pageKeywords:
                'Keymoji, hasło emoji, generator haseł, bezpieczeństwo, bezpieczeństwo online',
            pageInstruction: [
                'Kliknij "📝 Opowieść" by uzyskać swoją emoji historię od AI 📖',
                '"Losowy" mówi sam za siebie 😜.',
                'Po wygenerowaniu, zostanie zapisane w schowku! 📋'
            ],
            backToMainText: 'Kliknij poniżej 👇 aby wrócić',
            backToMainButtonText: 'Powrót do głównego widoku 🔙',
            contactText: 'Masz pytanie lub świetny pomysł?',
            contactButtonText: 'Wyślij do mnie wiadomość! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Kliknij lub naciśnij Enter, aby skopiować wygenerowane hasło emoji do schowka',
            successMessage: 'Sukces, skopiowano do schowka 💾',
            errorMessage: 'Ups, coś poszło nie tak 🤖',
            dailyLimitReachedMessage: 'Przykro nam, dzienny limit zapytań 😔',
            successStoryMessage: 'Sukces, wygenerowano historię emoji 🤖',
            errorStoryMessage: 'Błąd, brak odpowiedzi z serwera 🌀',
            emojiDisplayTitle: 'Generator Hasła Emoji',
            dataPrivacyProcessingInfo:
                '🚀 Magia emoji poprzez webhooks i AI! ✨ Dane są jak piasek na plaży - nie zostają na długo.',
            clearButton: '✖️ Wyczyść',
            storyButton: '📝 Opowieść',
            storyButtonClicked: '📩 Wyślij opowieść',
            randomButton: '*️⃣ Losowy'
        },
        donateButton: {
            text: 'Postaw mi kawę',
            openText: 'Zamknij to menu',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Twoje imię',
            emailLabel: '📧 Twój email',
            messageLabel: '✍🏻 Twoja wiadomość',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Wyślij',
            successMessage:
                'Sukces, wiadomość wysłana - Odpowiedź: < 24 godziny 🚀',
            errorMessage: 'Wystąpił nieoczekiwany błąd 😟',
            requestErrorMessage:
                'Błąd wysyłania wiadomości, spróbuj ponownie 🙁',
            smirkingFaceImageAlt: 'emoji keymoji z uśmieszkiem 1f60f',
            introductionTitle: 'Cześć, jestem Christopher',
            introductionText:
                'Frontend Developer i uwielbiam projektować i kodować przyjazne użytkownikowi strony internetowe z użyciem JavaScript, PHP i HTML. Nie wahaj się wysłać do mnie wiadomości, jeśli ci się podoba.',
            privacyNotice:
                'Bądź spokojny, twoje dane są w dobrych rękach 🤲. Twoje szczegóły nie zostaną przekazane osobom trzecim 🔒.',
            emailText: {
                greeting: 'Witamy',
                intro: 'Dziękujemy za wysłanie wiadomości 📩!',
                doubleCheck:
                    'Proszę potwierdzić swoją prośbę, aby Christopher wiedział, że nie jesteś inteligentnym botem. Wysłałeś wiadomość z następującymi danymi:',
                button: '✅ Potwierdź prośbę',
                privacy:
                    'Bądź spokojny, twoje dane są w dobrych rękach 🤲.<br>Twoje szczegóły nie zostaną przekazane osobom trzecim 🔒.'
            },
            backToMainButton: '🔙 Powrót',
            footerText: 'Desenvolvido com ❤️ na Suíça'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Odkryj%20Keymoji%2C%20innowacyjny%20Generator%20Hasła%20Emoji!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'Udostępnij na WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Odkryj%20Keymoji%2C%20Generator%20Hasła%20Emoji',
                    svgContent: redditIcon,
                    alt: 'Udostępnij na Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Udostępnij na LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Udostępnij przez Messenger Facebooka',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Odkryj%20Keymoji&body=Wypróbuj%20Keymoji%2C%20innowacyjny%20Generator%20Hasła%20Emoji!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Udostępnij przez e-mail',
                    title: 'E-mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Odkryj Keymoji, innowacyjny generator haseł Emoji!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Udostępnij na Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Ups! Strona nie znaleziona 🚫',
            suggestion:
                'Być może strona została przeniesiona lub wpisałeś nieprawidłowy adres URL. Wróćmy na właściwą ścieżkę! 🛤️',
            returnButton: 'Powrót do strony głównej 🏠'
        }
    },
    da: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emoji-adgangskodegenerator',
            pageDescription:
                '🔑 Adgangskoder genovervejet. 🎯 Uknuselige emoji-adgangskoder. 🌈 Gratis. Sikkert. Innovativt. 🤖 AI-modstandsdygtig teknologi. 🌍 På 15+ sprog.',
            pageKeywords:
                'Keymoji, emoji adgangskode, adgangskodegenerator, sikkerhed, online sikkerhed',
            pageInstruction: [
                'Klik på "📝 Historie" for din AI emoji-fortælling 📖',
                '"Tilfældig" er selvforklarende 😜.',
                'Efter generering gemmes det i dit udklipsholder! 📋'
            ],
            backToMainText: 'Klik nedenfor 👇 for at gå tilbage',
            backToMainButtonText: 'Tilbage til hovedvisning 🔙',
            contactText: 'Har du et spørgsmål eller en god idé?',
            contactButtonText: 'Send mig en besked! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Klik eller tryk på Enter for at kopiere det genererede emoji-kodeord til udklipsholderen',
            successMessage: 'Succes, kopieret til din udklipsholder 💾',
            errorMessage: 'Ups, noget gik galt 🤖',
            dailyLimitReachedMessage:
                'Beklager, daglige grænse for anmodninger 😔',
            successStoryMessage: 'Succes, emoji-historie genereret 🤖',
            errorStoryMessage: 'Fejl, intet svar fra serveren 🌀',
            emojiDisplayTitle: 'Emoji-adgangskodegenerator',
            dataPrivacyProcessingInfo:
                '🚀 Emoji magi via webhooks og AI! ✨ Data er som strandsand - de bliver ikke hængende.',
            clearButton: '✖️ Ryd',
            storyButton: '📝 Historie',
            storyButtonClicked: '📩 Send historie',
            randomButton: '*️⃣ Tilfældig'
        },
        donateButton: {
            text: 'Køb mig en kaffe',
            openText: 'Luk denne menu',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Dit navn',
            emailLabel: '📧 Din e-mail',
            messageLabel: '✍🏻 Din besked',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Send',
            successMessage: 'Succes, besked sendt - Svar: < 24 timer 🚀',
            errorMessage: 'Der opstod en uventet fejl 😟',
            requestErrorMessage: 'Fejl ved afsendelse af besked, prøv igen 🙁',
            smirkingFaceImageAlt: 'keymoji emoji smirkeansigt 1f60f',
            introductionTitle: 'Hej, jeg er Christopher',
            introductionText:
                'Frontend-udvikler, og jeg elsker at designe og kode brugervenlige websteder med JavaScript, PHP og HTML. Tøv ikke med at sende mig en besked, hvis du kan lide det.',
            privacyNotice:
                'Vær rolig, dine data er i gode hænder hos os 🤲. Dine oplysninger vil ikke blive delt med tredjeparter 🔒.',
            emailText: {
                greeting: 'Velkommen',
                intro: 'Tak fordi du sendte en besked 📩!',
                doubleCheck:
                    'Bekræft venligst din anmodning, så Christopher ved, at du ikke er en intelligent bot. Du har sendt en besked med følgende oplysninger:',
                button: '✅ Bekræft anmodning',
                privacy:
                    'Vær rolig, dine data er i gode hænder hos os 🤲.<br>Dine oplysninger vil ikke blive delt med tredjeparter 🔒.'
            },
            backToMainButton: '🔙 Tilbage',
            footerText: 'Udviklet med ❤️ i Schweiz'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Opdag%20Keymoji%2C%20den%20innovative%20Emoji-adgangskodegenerator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'Del på WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Opdag%20Keymoji%2C%20Emoji-adgangskodegeneratoren',
                    svgContent: redditIcon,
                    alt: 'Del på Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'Del på LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Del på Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Opdag%20Keymoji&body=Prøv%20Keymoji%2C%20den%20innovative%20Emoji-adgangskodegenerator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Del via e-mail',
                    title: 'E-mail',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Opdag Keymoji, den innovative Emoji-adgangskodegenerator!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Del på Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Ups! Side ikke fundet 🚫',
            suggestion:
                "Måske er siden flyttet, eller du har indtastet URL'en forkert. Lad os få dig tilbage på sporet! 🛤️",
            returnButton: 'Tilbage til start 🏠'
        }
    },
    ru: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Генератор паролей с использованием эмодзи',
            pageDescription:
                '🔑 Пароли переосмыслены. 🎯 Непроходимые эмодзи-пароли. 🌈 Бесплатно. Безопасно. Инновационно. 🤖 Технология, устойчивая к ИИ. 🌍 На 15+ языках.',
            pageKeywords:
                'Keymoji, эмодзи-пароль, генератор паролей, безопасность, онлайн-безопасность',
            pageInstruction: [
                'Нажмите "📝 История" для вашей истории с эмодзи 📖',
                '"Случайно" - это понятно 😜.',
                'После генерации он сохраняется в ваш буфер обмена! 📋'
            ],
            backToMainText: 'Нажмите ниже 👇, чтобы вернуться',
            backToMainButtonText: 'Вернуться к основному виду 🔙',
            contactText: 'У вас есть вопрос или классное предложение?',
            contactButtonText: 'Отправьте мне сообщение! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Нажмите или нажмите Enter, чтобы скопировать сгенерированный пароль эмодзи в буфер обмена',
            successMessage: 'Успешно, скопировано в буфер обмена 💾',
            errorMessage: 'Упс, что-то пошло не так 🤖',
            dailyLimitReachedMessage:
                'Извините, ежедневного лимита запросов 😔',
            successStoryMessage: 'Успех, создана история с эмодзи 🤖',
            errorStoryMessage: 'Ошибка, нет ответа от сервера 🌀',
            emojiDisplayTitle: 'Генератор паролей с использованием эмодзи',
            dataPrivacyProcessingInfo:
                '🚀 Волшебство с эмодзи через веб-хуки и искусственный интеллект! ✨ Данные как песчинки на пляже - они не остаются.',
            clearButton: '✖️ Очистить',
            storyButton: '📝 История',
            storyButtonClicked: '📩 Отправить историю',
            randomButton: '*️⃣ Случайно'
        },
        donateButton: {
            text: 'Купите мне кофе',
            openText: 'Закрыть это меню',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'икона paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 2,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'икона ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Ваше имя',
            emailLabel: '📧 Ваш адрес электронной почты',
            messageLabel: '✍🏻 Ваше сообщение',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Отправить',
            successMessage: 'Успех, сообщение отправлено - Ответ: < 24 часа 🚀',
            errorMessage: 'Произошла неожиданная ошибка 😟',
            requestErrorMessage:
                'Ошибка отправки сообщения, пожалуйста, попробуйте снова 🙁',
            smirkingFaceImageAlt: 'эмодзи Keymoji smirkingface 1f60f',
            introductionTitle: 'Привет, я Крис',
            introductionText:
                'Фронтенд-разработчик и я люблю проектировать и кодировать удобные веб-сайты с использованием JavaScript, PHP и HTML. Не стесняйтесь отправить мне сообщение, если вам нравится.',
            privacyNotice:
                'Не волнуйтесь, ваши данные у нас в надежных руках 🤲. Ваши данные не будут переданы третьим лицам 🔒.',
            emailText: {
                greeting: 'Добро пожаловать',
                intro: 'Спасибо за отправку сообщения 📩!',
                doubleCheck:
                    'Пожалуйста, подтвердите ваш запрос, чтобы Крис знал, что вы не умный бот. Вы отправили сообщение с следующими данными:',
                button: '✅ Подтвердить запрос',
                privacy:
                    'Не волнуйтесь, ваши данные у нас в надежных руках 🤲.<br>Ваши данные не будут переданы третьим лицам 🔒.'
            },
            backToMainButton: '🔙 Вернуться',
            footerText: 'Разработано с ❤️ в Швейцарии'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Откройте Keymoji, инновационный Генератор паролей с использованием эмодзи! %20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'поделиться в WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Откройте Keymoji, Генератор паролей с использованием эмодзи',
                    svgContent: redditIcon,
                    alt: 'поделиться на Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'поделиться на LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[Ваш_ID_Facebook]',
                    svgContent: fbmessengerIcon,
                    alt: 'поделиться через Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Откройте Keymoji&body=Попробуйте Keymoji, инновационный Генератор паролей с использованием эмодзи! %20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'поделиться по электронной почте',
                    title: 'Электронная почта',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Откройте для себя Keymoji, инновационный генератор паролей Emoji!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'поделиться в Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Упс! Страница не найдена 🚫',
            suggestion:
                'Возможно, страница была перемещена или вы неправильно ввели URL. Давайте вернем вас на правильный путь! 🛤️',
            returnButton: 'Вернуться на главную 🏠'
        }
    },
    tr: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emoji Parola Oluşturucu',
            pageDescription:
                "🔑 Şifreler yeniden düşünülüyor. 🎯 Kırılamayan emoji şifreleri. 🌈 Ücretsiz. Güvenli. Yenilikçi. 🤖 AI'ya dirençli teknoloji. 🌍 15+ dilde mevcut.",
            pageKeywords:
                'Keymoji, emoji parola, parola oluşturucu, güvenlik, çevrimiçi güvenlik',
            pageInstruction: [
                'AI emoji hikayeniz için "📝 Hikaye" yi tıklayın 📖',
                '"Rastgele" açıklayıcıdır 😜.',
                'Oluşturduktan sonra panonuza kaydedilir! 📋'
            ],
            backToMainText: "Aşağıdaki 👇'ye tıklayarak geri dönün",
            backToMainButtonText: 'Ana görünüme geri dön 🔙',
            contactText: 'Sorunuz veya harika bir öneriniz mi var?',
            contactButtonText: 'Bana bir mesaj gönder! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'Oluşturulan emoji şifresini panoya kopyalamak için tıklayın veya Enter tuşuna basın',
            successMessage: 'Başarılı, panonuza kopyalandı 💾',
            errorMessage: 'Üzgünüz, bir şeyler ters gitti 🤖',
            dailyLimitReachedMessage: 'Üzgünüz, sınırınıza ulaştınız 😔',
            successStoryMessage: 'Başarılı, Emoji hikayesi oluşturuldu 🤖',
            errorStoryMessage: 'Hata, sunucudan yanıt yok 🌀',
            emojiDisplayTitle: 'Emoji Parola Oluşturucu',
            dataPrivacyProcessingInfo:
                '🚀 Emoji sihir web kancaları ve yapay zeka ile! ✨ Veriler kumsal kumu gibidir - orada kalmaz.',
            clearButton: '✖️ Temizle',
            storyButton: '📝 Hikaye',
            storyButtonClicked: '📩 Hikaye gönder',
            randomButton: '*️⃣ Rastgele'
        },
        donateButton: {
            text: 'Bana kahve ısmarla',
            openText: 'Bu menüyü kapat',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'ikon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 2,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'ikon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Adınız',
            emailLabel: '📧 E-posta adresiniz',
            messageLabel: '✍🏻 Mesajınız',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Gönder',
            successMessage: 'Başarılı, Mesaj gönderildi - Yanıt: < 24 saat 🚀',
            errorMessage: 'Beklenmeyen bir hata oluştu 😟',
            requestErrorMessage:
                'Mesaj gönderme hatası, lütfen tekrar deneyin 🙁',
            smirkingFaceImageAlt: 'keymoji emoji sırıtma yüzü 1f60f',
            introductionTitle: 'Merhaba, ben Christopher',
            introductionText:
                'Frontend Geliştiriciyim ve JavaScript, PHP ve HTML kullanarak kullanıcı dostu web siteleri tasarlamayı ve kodlamayı seviyorum. Beğenirseniz bana bir mesaj göndermekten çekinmeyin.',
            privacyNotice:
                'Verileriniz bizimle güvende 🤲. Detaylarınız üçüncü taraflara iletilmeyecektir 🔒.',
            emailText: {
                greeting: 'Hoş geldiniz',
                intro: 'Mesaj gönderdiğiniz için teşekkür ederiz 📩!',
                doubleCheck:
                    "Lütfen isteğinizi Christopher'in akıllı bir bot olmadığınızı bilmesi için onaylayın. Aşağıdaki verilerle bir mesaj gönderdiniz:",
                button: '✅ İsteği Onayla',
                privacy:
                    'Verileriniz bizimle güvende 🤲.<br>Detaylarınız üçüncü taraflara iletilmeyecektir 🔒.'
            },
            backToMainButton: '🔙 geri dön',
            footerText: "İsviçre'de ❤️ ile geliştirildi"
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: "https://api.whatsapp.com/send?text=Keymoji'yi keşfedin, yenilikçi Emoji Parola Oluşturucu! %20https%3A%2F%2Fkeymoji.wtf",
                    svgContent: whatsappIcon,
                    alt: 'WhatsApp üzerinde paylaş',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: "https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Keymoji'yi keşfedin, Emoji Parola Oluşturucu",
                    svgContent: redditIcon,
                    alt: 'Reddit üzerinde paylaş',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'LinkedIn üzerinde paylaş',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[Facebook_Uygulama_Kimliğiniz]',
                    svgContent: fbmessengerIcon,
                    alt: 'Facebook Messenger üzerinden paylaş',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: "mailto:?subject=Keymoji'yi Keşfedin&body=Keymoji'yi deneyin, yenilikçi Emoji Parola Oluşturucu! %20https%3A%2F%2Fkeymoji.wtf",
                    svgContent: emailIcon,
                    alt: 'E-posta ile paylaş',
                    title: 'E-Posta',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        "Keymoji'yi keşfedin, yenilikçi Emoji Şifre Üreticisi!"
                    )}`,
                    svgContent: instagramIcon,
                    alt: "Instagram'da paylaş",
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Hata! Sayfa bulunamadı 🚫',
            suggestion:
                "Belki sayfa taşınmış ya da URL'yi yanlış yazdınız. Sizi doğru yola geri getirelim! 🛤️",
            returnButton: 'Ana sayfaya dön 🏠'
        }
    },
    af: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emoji Wagwoord Skepper',
            pageDescription:
                '🔑 Wagwoorde nuut bedink. 🎯 Onkrakbare emoji-wagwoorde. 🌈 Gratis. Veilig. Innovatief. 🤖 KI-bestande tegnologie. 🌍 Verkieslik in 15+ tale.',
            pageKeywords:
                'Keymoji, emoji-wagwoord, wagwoord skepper, sekuriteit, aanlyn sekuriteit',
            pageInstruction: [
                'Klik op "📝 Storie" vir jou KI emoji-verhaal 📖',
                '"Willekeurig" is vanselfsprekend 😜.',
                'Na generering word dit na jou knipbord gestuur! 📋'
            ],
            backToMainText: 'Klik hieronder 👇 om terug te gaan',
            backToMainButtonText: 'Terug na hoofaansig 🔙',
            contactText: "Het 'n vraag of 'n koel voorstel?",
            contactButtonText: "Stuur my 'n boodskap! 💌"
        },
        emojiDisplay: {
            clickToCopy:
                'Klik of druk Enter om die gegenereerde emoji-wagwoord na die knipbord te kopieer',
            successMessage: 'Sukses, gekopieer na jou Knipbord 💾',
            errorMessage: 'Oeps, iets het verkeerd gegaan 🤖',
            dailyLimitReachedMessage:
                'Jammer, jy het jou daaglikse limiet van versoek bereik 😔',
            successStoryMessage: 'Sukses, Emoji-verhaal gegenereer 🤖',
            errorStoryMessage: 'Fout, geen antwoord van die bediener 🌀',
            emojiDisplayTitle: 'Emoji Wagwoord Skepper',
            dataPrivacyProcessingInfo:
                '🚀 Emoji-magie via webhooks en KI! ✨ Data is soos strandsand - dit bly nie.',
            clearButton: '✖️ Wis',
            storyButton: '📝 Storie',
            storyButtonClicked: '📩 Storie stuur',
            randomButton: '*️⃣ Willekeurig'
        },
        donateButton: {
            text: "Koop vir my 'n koffie",
            openText: 'Sluit hierdie kieslys',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'ikoon PayPal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 2,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'ikoon Ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Jou Naam',
            emailLabel: '📧 Jou E-posadres',
            messageLabel: '✍🏻 Jou Boodskap',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Stuur',
            successMessage: 'Sukses, Boodskap gestuur - Antwoord: < 24 uur 🚀',
            errorMessage: 'Onverwagse fout opgetree 😟',
            requestErrorMessage:
                'Fout met die stuur van die boodskap, probeer asseblief weer 🙁',
            smirkingFaceImageAlt: 'keymoji emoji gryns gesig 1f60f',
            introductionTitle: 'Hi, ek is Christopher',
            introductionText:
                "Frontend-ontwikkelaar en ek hou daarvan om gebruiksvriendelike webwerwe te ontwerp en kodeer met JavaScript, PHP en HTML. Moet nie huiwer om my 'n boodskap te stuur as jy wil nie.",
            privacyNotice:
                'Wees verseker, jou data is in goeie hande by ons 🤲. Jou besonderhede sal nie aan derde partye oorgedra word nie 🔒.',
            emailText: {
                greeting: 'Welkom',
                intro: "Dankie dat jy 'n boodskap gestuur het 📩!",
                doubleCheck:
                    "Bevestig asseblief jou versoek sodat Christopher weet jy is nie 'n slim robot nie. Jy het 'n boodskap gestuur met die volgende data:",
                button: '✅ Bevestig versoek',
                privacy:
                    'Wees verseker, jou data is in goeie hande by ons 🤲.<br>Jou besonderhede sal nie aan derde partye oorgedra word nie 🔒.'
            },
            backToMainButton: '🔙 Terug',
            footerText: 'Met ❤️ in Switserland ontwikkel'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Ontdek%20Keymoji%2C%20die innoverende%20Emoji%20Wagwoord%20Skepper!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'deel op WhatsApp',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Ontdek%20Keymoji%2C%20die%20Emoji%20Wagwoord%20Skepper',
                    svgContent: redditIcon,
                    alt: 'deel op Reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'deel op LinkedIn',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[Jou_Facebook_App_ID]',
                    svgContent: fbmessengerIcon,
                    alt: 'deel via Facebook Messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Ontdek%20Keymoji&body=Probeer%20Keymoji%2C%20die innoverende%20Emoji%20Wagwoord%20Skepper!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'deel via e-pos',
                    title: 'E-pos',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Ontdek Keymoji, die innoverende Emoji-wagwoordgenerator!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'deel op Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'Oeps! Blad nie gevind nie 🚫',
            suggestion:
                'Miskien het die blad geskuif of jy het die URL verkeerd ingetik. Kom ons bring jou terug! 🛤️',
            returnButton: 'Terug na Tuis 🏠'
        }
    },
    ja: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: '絵文字パスワードジェネレーター',
            pageDescription:
                '🔑 パスワードの新しい考え方。🎯 破られない絵文字パスワード。🌈 無料。安全。革新。🤖 AI抵抗技術。🌍 15か国語以上で利用可能。',
            pageKeywords:
                'Keymoji、絵文字パスワード、パスワードジェネレーター、セキュリティ、オンラインセキュリティ',
            pageInstruction: [
                'AI絵文字物語をご覧いただくには「📝 ストーリー」をクリックしてください 📖',
                '"ランダム"は説明不要です 😜。',
                '生成後、クリップボードに保存されます！ 📋'
            ],
            backToMainText: '下記をクリックして戻る',
            backToMainButtonText: 'メインビューに戻る 🔙',
            contactText: '質問やクールな提案はありますか？',
            contactButtonText: 'メッセージを送信！ 💌'
        },
        emojiDisplay: {
            clickToCopy:
                'クリックまたはEnterキーを押して、生成された絵文字パスワードをクリップボードにコピーします',
            successMessage: '成功し、クリップボードにコピーされました 💾',
            errorMessage: 'おっと、何かがうまくいかなかったようです 🤖',
            dailyLimitReachedMessage:
                '申し訳ありませんが、リクエストの日次制限に達しました 😔',
            successStoryMessage: '成功、絵文字ストーリーが生成されました 🤖',
            errorStoryMessage: 'エラー、サーバーからの応答がありません 🌀',
            emojiDisplayTitle: '絵文字パスワードジェネレーター',
            dataPrivacyProcessingInfo:
                '🚀 ウェブフックとAIを使用した絵文字の魔法！ ✨ データは砂浜のようです - 残りません。',
            clearButton: '✖️ クリア',
            storyButton: '📝 ストーリー',
            storyButtonClicked: '📩 ストーリーを送信',
            randomButton: '*️⃣ ランダム'
        },
        donateButton: {
            text: 'コーヒーをおごってください',
            openText: 'このメニューを閉じる',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'アイコン PayPal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 2,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'アイコン Ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 あなたの名前',
            emailLabel: '📧 あなたのメールアドレス',
            messageLabel: '✍🏻 あなたのメッセージ',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 送信',
            successMessage:
                '成功、メッセージが送信されました - 回答：< 24時間 🚀',
            errorMessage: '予期しないエラーが発生しました 😟',
            requestErrorMessage:
                'メッセージの送信中にエラーが発生しました。もう一度お試しください 🙁',
            smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
            introductionTitle: 'こんにちは、クリストファーです',
            introductionText:
                'フロントエンドデベロッパーで、JavaScript、PHP、HTMLで使いやすいウェブサイトをデザインしコード化するのが好きです。何か質問があるか、気軽にメッセージを送ってください。',
            privacyNotice:
                '安心してください、お客様のデータは安全に保管されています 🤲。お客様の詳細情報は第三者に提供されることはありません 🔒。',
            emailText: {
                greeting: 'ようこそ',
                intro: 'メッセージを送信いただき、ありがとうございます 📩！',
                doubleCheck:
                    'クリスが賢いボットではないことを知るために、お願いですが、お問い合わせ内容をご確認ください。以下のデータでメッセージを送信しました：',
                button: '✅ リクエストを確認',
                privacy:
                    '安心してください、お客様のデータは安全に保管されています 🤲。<br>お客様の詳細情報は第三者に提供されることはありません 🔒。'
            },
            backToMainButton: '🔙 メインビューに戻る',
            footerText: 'スイスで ❤️ を込めて開発'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Keymoji、革新的な絵文字パスワードジェネレーターを発見！%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'WhatsAppで共有',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Keymoji、絵文字パスワードジェネレーターを発見',
                    svgContent: redditIcon,
                    alt: 'Redditで共有',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'LinkedInで共有',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Facebook Messengerで共有',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Keymojiを発見&body=Keymoji、革新的な絵文字パスワードジェネレーターを試してみてください！%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'Eメールで共有',
                    title: 'Eメール',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Keymojiを発見しよう、革新的な絵文字パスワードジェネレーター！'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'Instagramで共有',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: 'ページが見つかりません 🚫',
            suggestion:
                'ページが移動したか、URLを間違えた可能性があります。元のページに戻りましょう！ 🛤️',
            returnButton: 'ホームに戻る 🏠'
        }
    },
    ko: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: '이모지 패스워드 생성기',
            pageDescription:
                '🔑 비밀번호를 새롭게 생각하다. 🎯 깨지지 않는 이모지 비밀번호. 🌈 무료. 안전. 혁신적. 🤖 AI 저항 기술. 🌍 15개 이상의 언어로 제공됩니다.',
            pageKeywords:
                'Keymoji, 이모지 패스워드, 패스워드 생성기, 보안, 온라인 보안',
            pageInstruction: [
                'AI 이모지 이야기를 보려면 "📝 스토리"를 클릭하세요 📖',
                '"랜덤"은 자명한 것입니다 😜.',
                '생성 후 클립 보드에 저장됩니다! 📋'
            ],
            backToMainText: '아래를 클릭하여 돌아가기',
            backToMainButtonText: '메인 뷰로 돌아가기 🔙',
            contactText: '질문이나 멋진 제안이 있으신가요?',
            contactButtonText: '메시지 보내기! 💌'
        },
        emojiDisplay: {
            clickToCopy:
                '생성된 이모지 비밀번호를 클립보드에 복사하려면 클릭하거나 Enter 키를 누르세요',
            successMessage: '성공, 클립보드에 복사되었습니다 💾',
            errorMessage: '오류가 발생했습니다. 🤖',
            dailyLimitReachedMessage:
                '죄송합니다. 요청 일일 한도에 도달하셨습니다. 😔',
            successStoryMessage: '성공, 이모지 이야기가 생성되었습니다. 🤖',
            errorStoryMessage: '오류, 서버에서 응답 없음. 🌀',
            emojiDisplayTitle: '이모지 패스워드 생성기',
            dataPrivacyProcessingInfo:
                '🚀 웹훅과 AI를 통한 이모지 매직! ✨ 데이터는 모래와 같습니다 - 남지 않습니다.',
            clearButton: '✖️ 지우기',
            storyButton: '📝 스토리',
            storyButtonClicked: '📩 스토리 보내기',
            randomButton: '*️⃣ 랜덤'
        },
        donateButton: {
            text: '커피 한 잔 사주기',
            openText: '이 메뉴 닫기',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: '아이콘 PayPal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 2,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: '아이콘 Ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 이름',
            emailLabel: '📧 이메일',
            messageLabel: '✍🏻 메시지',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 보내기',
            successMessage:
                '성공, 메시지가 전송되었습니다 - 답변: 24시간 이내 🚀',
            errorMessage: '예기치 않은 오류가 발생했습니다. 😟',
            requestErrorMessage:
                '메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요. 🙁',
            smirkingFaceImageAlt: 'keymoji 이모지 껄끄러운 얼굴 1f60f',
            introductionTitle: '안녕하세요, 저는 크리스토퍼입니다',
            introductionText:
                '프론트엔드 개발자이며 JavaScript, PHP 및 HTML을 사용하여 사용자 친화적인 웹 사이트를 디자인하고 코드로 작성하는 것을 좋아합니다. 궁금한 점이나 메시지를 보내고 싶은 내용이 있다면 언제든지 메시지를 보내 주세요.',
            privacyNotice:
                '걱정 마세요. 귀하의 데이터는 안전하게 보호됩니다 🤲. 귀하의 세부 정보는 제3자에게 전달되지 않습니다 🔒.',
            emailText: {
                greeting: '환영합니다',
                intro: '메시지를 보내 주셔서 감사합니다 📩!',
                doubleCheck:
                    '크리스가 스마트한 봇이 아님을 확인하기 위해 요청을 확인해 주십시오. 다음 데이터로 메시지를 보냈습니다:',
                button: '✅ 요청 확인',
                privacy:
                    '걱정 마세요. 귀하의 데이터는 안전하게 보호됩니다 🤲.<br>귀하의 세부 정보는 제3자에게 전달되지 않습니다 🔒.'
            },
            backToMainButton: '🔙 메인 뷰로 돌아가기',
            footerText: '스위스에서 ❤️ 으로 개발됨'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Keymoji, 혁신적인 이모지 패스워드 생성기를 발견하십시오!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'WhatsApp으로 공유',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Keymoji、이모지 패스워드 생성기를 발견',
                    svgContent: redditIcon,
                    alt: 'Reddit으로 공유',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'LinkedIn으로 공유',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Facebook Messenger로 공유',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Keymoji를 발견&body=Keymoji, 혁신적인 이모지 패스워드 생성기를 시도해보세요!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: '이메일로 공유',
                    title: '이메일',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Keymoji를 발견하세요, 혁신적인 이모지 비밀번호 생성기!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: '인스타그램에 공유',
                    title: '인스타그램',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: '페이지를 찾을 수 없습니다 🚫',
            suggestion:
                '페이지가 이동되었거나 URL을 잘못 입력하셨을 수 있습니다. 원래 페이지로 돌아가 볼까요? 🛤️',
            returnButton: '홈으로 돌아가기 🏠'
        }
    },
    tlh: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: "Emoji vItlhutlh yIngu'",
            pageDescription:
                "🔑 'ughIjwI' vIparHa'. 🎯 'ughIjwI' vIparHa'. 🌈 Suq. vIDoH. vIq. 🤖 yISeH yIpoH. 🌍 15+ pong vIjegh.",
            pageKeywords:
                "Keymoji, emoji vItlhutlh, yIngu' yIngu'wI', bIQew, yIngu' bIQew",
            pageInstruction: [
                'ghItlh "📝 Daq" ghaj AI emoji qIjtaH 📖',
                '"vItlhutlh" Hoch Daq DaH jImej 😜.',
                "ghItlh DaH yIngu'wI' je chu' chu'! 📋"
            ],
            backToMainText: 'je bIngan ghItlh 👇',
            backToMainButtonText: "Daq HeghDI' bIngan puS 🔙",
            contactText: 'SoHvaD qoQ qIm?',
            contactButtonText: "SoHvaD ra'! 💌"
        },
        emojiDisplay: {
            clickToCopy:
                "HIDjolev emoji mu'mey ngoq Day'a' beQ click pagh enter",
            successMessage: "Qap, tImej nIvbogh wa'DIch 💾",
            errorMessage: 'Qatlh, chenmoH! 🤖',
            dailyLimitReachedMessage:
                "Qapla', tIn vItlhutlh DujmeH rur tu'lu' 😔",
            successStoryMessage: "Qap, Emoji QIj qorDu'! 🤖",
            errorStoryMessage: 'Qatlh, Dubotlh jatlhnIS! 🌀',
            emojiDisplayTitle: "Emoji vItlhutlh yIngu'",
            dataPrivacyProcessingInfo:
                "🚀 webhooks 'ej AI raQta'! ✨ retlh DaH Do'Ha'lu'.",
            clearButton: '✖️ qIb',
            storyButton: '📝 Daq',
            storyButtonClicked: "📩 Daq bIqaw'a'!",
            randomButton: '*️⃣ QIn'
        },
        donateButton: {
            text: "wo' QeH",
            openText: "tlha' vItlhutlh",
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'Paypal icon',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 2,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'Ko-fi icon',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 nuqneH loD?',
            emailLabel: '📧 nuqneH Doq?',
            messageLabel: "✍🏻 nuq 'oH?",
            regenerateCaptchaButton: '🔄',
            sendButton: "🚀 bIqaw'a'",
            successMessage: "Qap, bIqaw'a' tImej - qaStaHvIS pa'logh 🚀",
            errorMessage: "ngan 'oH naDev. 😟",
            requestErrorMessage: "bIqaw'a' logh vImej - chenmoH QaQ! 🙁",
            smirkingFaceImageAlt: 'keymoji emoji tlhutlh Dach 1f60f',
            introductionTitle: "nuqneH, jIqaH Christopher 'oH",
            introductionText:
                "loD qaDevwI' je 'ach javascript, php 'ej HTML Daq cha'logh 'oH 'ej pa'logh. DaH HeghmoH 'ej bIqaw'a' 'ach vaj.",
            privacyNotice:
                "cholna'be' ghaH ngan chenmoH qeq 'oH 🤲. ngan 'oHbogh ghItlh. lujon chenmoH cha'logh tu'lu'. 🔒.",
            emailText: {
                greeting: 'nuqneH',
                intro: "bIqaw'a' yIngu'wI' - pIn'a' Ha'neH! 📩",
                doubleCheck:
                    "chenmoH, Dubotlh DujmeH Daqvetlh 'oHghach chenmoH nIvbogh bot tlhIngan 'oH. 'oHnIS DujmeH Daqvetlh DujmeH chenmoH vImej:",
                button: "✅ Qapla'",
                privacy:
                    "cholna'be' ghaH ngan chenmoH qeq 'oH 🤲.<br>ngan 'oHbogh ghItlh. lujon chenmoH cha'logh tu'lu'. 🔒."
            },
            backToMainButton: "🔙 Daq HeghDI'",
            footerText: 'wIvtaH ❤️ e Switzerland-Daq'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: "https://api.whatsapp.com/send?text=Keymoji, Emoji vItlhutlh yIngu' ghojmoHwI'!%20https%3A%2F%2Fkeymoji.wtf",
                    svgContent: whatsappIcon,
                    alt: 'WhatsApp ghaj moj',
                    title: 'WhatsApp',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 2,
                    href: "https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Keymoji, Emoji vItlhutlh yIngu' ghojmoHwI'",
                    svgContent: redditIcon,
                    alt: 'Reddit ghaj moj',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fkeymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'LinkedIn ghaj moj',
                    title: 'LinkedIn',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'Messenger ghaj moj',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 5,
                    href: "mailto:?subject=Keymoji, Emoji vItlhutlh yIngu' ghojmoHwI'&body=Keymoji, Emoji vItlhutlh yIngu' ghojmoHwI' ghojmoH!%20https%3A%2F%2Fkeymoji.wtf",
                    svgContent: emailIcon,
                    alt: 'Email ghaj moj',
                    title: 'Email',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        "yIHbej Keymoji, nuqneH emoji 'ejwI' qaw' vIghro'!"
                    )}`,
                    svgContent: instagramIcon,
                    alt: "Instagram-da 'oH",
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer',
                    dialogContent: ''
                }
            ]
        },
        notFound: {
            message: "Qo'! pagh tu'lu' 🚫",
            suggestion: "paghmey muvlu'pu' qaSpu' URL lIjlaH. yIchegh! 🛤️",
            returnButton: 'juH qachDaq yIchegh 🏠'
        }
    },
    qya: {
        header: {
            pageTitle: 'Keymoji',
            pageVersion: appVersion
        },
        index: {
            pageTitle: 'Emojëa Cennas',
            pageDescription:
                '🔑 Cennas úvëa. 🎯 Nai nári emojëa cennas. 🌈 Alassëa. Hrestale. Yéni. 🤖 AI-naírë hlarë. 🌍 Lainë ar quildë.',
            pageKeywords:
                'Keymoji, emojëa cennas, cennas úvëa, hrestale, quildë hrestale',
            pageInstruction: [
                'Lirna "📝 Melme" ar melme emojëa tale 📖',
                '"Random" is nai auta 😜.',
                'Ailin, hlarë quildë! 📋'
            ],
            backToMainText: 'Lirna yassë 👇 ar hlarë melme',
            backToMainButtonText: 'Hlarë na nórë 🔙',
            contactText: 'Nai melme or ailin hlarë?',
            contactButtonText: 'Lirna melme! 💌'
        },
        emojiDisplay: {
            clickToCopy: 'Lirna ar hlarë Enter nai elenath!',
            successMessage: 'Ailin, hlarë quildë! 💾',
            errorMessage: 'Lá, melme auta 🤖',
            dailyLimitReachedMessage: 'Alassëa, emmë quildë limba 🍂',
            successStoryMessage: 'Ailin, melme emojëa tale 🤖',
            errorStoryMessage: 'Lá, nai auta melme 🌀',
            emojiDisplayTitle: 'Emojea Cennas',
            dataPrivacyProcessingInfo:
                '🚀 Emequëa cennas nái ar AI! ✨ Cendë elenath - nai ala elenwë.',
            clearButton: '✖️ Laive',
            storyButton: '📝 Melme',
            storyButtonClicked: '📩 Send melme',
            randomButton: '*️⃣ Random'
        },
        donateButton: {
            text: 'Nai elenë ailin',
            openText: 'Laive i melme',
            textMobile: '☕',
            links: [
                {
                    id: 1,
                    href: 'https://paypal.me/christophermattch/1',
                    svgContent: paypalIcon,
                    alt: 'icon paypal',
                    title: 'Paypal.me',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 12,
                    href: 'https://ko-fi.com/keymoji_official',
                    svgContent: kofiIcon,
                    alt: 'icon ko-fi',
                    title: 'Ko-fi',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        contactForm: {
            nameLabel: '🧑🏻 Ilya nána',
            emailLabel: '📧 Ilya ëarë',
            messageLabel: '✍🏻 Melme ná',
            regenerateCaptchaButton: '🔄',
            sendButton: '🚀 Hlarë',
            successMessage: 'Ailin, Melme hlarë - Ailin: < 24 elenwë 🚀',
            errorMessage: 'Lá, nai auta melme 😟',
            requestErrorMessage: 'Error melme hlarë, nai lirna arauta 🙁',
            smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
            introductionTitle: 'Alassëa, im Christopher',
            introductionText:
                'Frontend Naírë ar melme ëa hlarë ar cennas userfriendly websitetë. Nai lirna melme arauta.',
            privacyNotice:
                'Nai melme, ar ëarë ná hrestale hlarë 🤲. Ilya ëarë nai quildë ëarë ai melme 🛡️.',
            emailText: {
                greeting: 'Hantale',
                intro: 'Hantale na melme 📩!',
                doubleCheck:
                    'Nai malca elenath, ilya hlarë melme. Nai hlarë melme i réna sinome:',
                button: '✅ Hlarë melme',
                privacy:
                    'Nai melme, ar ëarë ná hrestale hlarë 🤲. Ilya ëarë nai quildë ëarë ai melme 🛡️.'
            },
            backToMainButton: '🔙 Hlarë',
            footerText: 'Nórienna ❤️ mi Suíza'
        },
        shareButtons: {
            links: [
                {
                    id: 1,
                    href: 'https://api.whatsapp.com/send?text=Discover%20Keymoji%2C%20the%20innovative%20Emoji%20Password%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: whatsappIcon,
                    alt: 'share on whatsapp',
                    title: 'Whatsapp',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 2,
                    href: 'https://www.reddit.com/submit?url=https%3A%2F%2Fkeymoji.wtf&title=Discover%20Keymoji%2C%20the%20Emoji%20Password%20Generator',
                    svgContent: redditIcon,
                    alt: 'share on reddit',
                    title: 'Reddit',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 3,
                    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https://keymoji.wtf',
                    svgContent: linkedinIcon,
                    alt: 'share on linkedin',
                    title: 'Linkedin',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 4,
                    href: 'fb-messenger://share?link=https%3A%2F%2Fkeymoji.wtf&app_id=[578001951341565]',
                    svgContent: fbmessengerIcon,
                    alt: 'share via facebook messenger',
                    title: 'Messenger',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 5,
                    href: 'mailto:?subject=Discover%20Keymoji&body=Try%20out%20Keymoji%2C%20the%20innovative%20Emoji%20Password%20Generator!%20https%3A%2F%2Fkeymoji.wtf',
                    svgContent: emailIcon,
                    alt: 'share via e-mail',
                    title: 'E-Mail',
                    target: '_blank',
                    rel: 'noreferrer'
                },
                {
                    id: 6,
                    href: `https://www.instagram.com/keymoji.wtf/?url=${encodeURIComponent(
                        'https://keymoji.wtf'
                    )}&text=${encodeURIComponent(
                        'Discover Keymoji, the innovative Emoji Password Generator!'
                    )}`,
                    svgContent: instagramIcon,
                    alt: 'share on Instagram',
                    title: 'Instagram',
                    target: '_blank',
                    rel: 'noreferrer'
                }
            ]
        },
        notFound: {
            message: 'Ú-! Tencë úvanë 🚫',
            suggestion: 'Cé tencë menë, mal úcarë. Túla sí ar harya! 🛤️',
            returnButton: 'Nórë ar auta 🏠'
        }
    }
};

export default content;
