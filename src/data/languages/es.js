// src/data/languages/es.js
// Spanish language content

import { formatVersion } from '../../utils/version';

export default {
    _meta: {
        language: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Abrir menú principal',
        closeMainMenu: 'Cerrar menú principal'
    },
    index: {
        pageTitle: 'Generador de Contraseñas Emoji',
        pageDescription:
            '🔑 Contraseñas reinventadas. 🎯 Contraseñas emoji irrompibles. 🌈 Gratis. Seguro. Innovador. 🤖 Tecnología resistente a IA. 🌍 Disponible en 15+ idiomas.',
        pageKeywords:
            'Keymoji, contraseña emoji, generador de contraseñas, seguridad, seguridad en línea',
        pageInstruction: [
            'Elige tu IA y crea tu historia Keymoji',
            '"Aleatorio" es autoexplicativo 😜.',
            '¡Después de generar, se guarda en tu portapapeles! 📋'
        ],
        setupStoryMode: 'Usa tu propia IA',
        setupStoryModeShort: 'Usa tu propia IA',
        setupStoryModeSwiss: 'Usar IA suiza',
        setupStoryModeSwissShort: 'IA suiza',
        setupStoryModeOr: 'o',
        setupStoryModeBannerCta: '— Crea tu Keymoji-Story',
        setupStoryModeDescription:
            'Conéctate con tu IA para contraseñas emoji personalizadas.',
        setupStoryModeSwissDescription:
            'IA suiza para usuarios preocupados por la privacidad. Los datos permanecen en Suiza, conformes con GDPR, seguridad empresarial. Perfecto para particulares y empresas que valoran la soberanía de datos.',
        setupStoryModeSwissTooltip:
            'IA suiza (Apertus) - IA centrada en la privacidad, alojada en Suiza. Tus datos permanecen en Suiza, protegidos por las leyes suizas de protección de datos. Conforme con GDPR, seguridad de nivel empresarial. Ideal para usuarios preocupados por la privacidad y empresas que requieren soberanía de datos.',
        storyModeReady: 'Contraseñas emoji generadas por IA listas 🤖',
        backToMainText: 'Haz clic abajo 👇 para volver',
        backToMainButtonText: 'Volver al inicio',
        contactText: '¿Tienes una pregunta o una sugerencia genial?',
        contactButtonText: '¡Envíame un mensaje! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Haz clic o presiona Enter para copiar la contraseña emoji generada al portapapeles',
        successMessage: 'Éxito, copiado en tu portapapeles 💾',
        errorMessage: 'Ups, algo salió mal 🤖',
        dailyLimitReachedMessage:
            'Lo siento, límite diario de solicitudes alcanzado 😔',
        successStoryMessage: 'Éxito, historia emoji generada 🤖',
        errorStoryMessage: 'Error, no hay respuesta del servidor 🌀',
        emojiDisplayTitle: 'Generador de Contraseñas Emoji',
        dataPrivacyProcessingInfo:
            '🚀 ¡Magia emoji a través de webhooks e IA! ✨ Los datos son como arena de playa - no se quedan.',
        clearButton: 'Limpiar',
        storyButton: '✨ Historia',
        storyButtonClicked: '✨ Enviar historia',
        randomButton: '🎲 Aleatorio',
        placeholderText:
            'Cuéntame una historia y generaré contraseñas emoji basadas en ella...',
        clipboardError: 'Error al copiar al portapapeles'
    },
    donateButton: {
        text: 'Cómprame un café',
        openText: 'Cerrar este menú',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Hola, soy Christopher',
        pageDescription:
            'Desarrollador frontend y me encanta crear sitios web fáciles de usar con TypeScript, JavaScript, PHP y HTML. ¡No dudes en enviarme un mensaje si quieres!',
        nameLabel: '🧑🏻 Tu nombre',
        emailLabel: 'Tu correo electrónico',
        messageLabel: '✍🏻 Tu mensaje',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Enviar',
        sendingButton: '📨 Enviando...',
        successMessage: 'Éxito, mensaje enviado - Respuesta: < 24 horas 🚀',
        errorMessage: 'Ocurrió un error inesperado 😟',
        requestErrorMessage:
            'Error al enviar el mensaje, por favor inténtalo de nuevo 🙁',
        smirkingFaceImageAlt: 'keymoji emoji cara sonriente 1f60f',
        introductionTitle: '¿Tienes una pregunta o una sugerencia genial?',
        introductionText: '¡Envíame un mensaje!',
        privacyNotice:
            'Tus datos están en buenas manos 🤲. No compartimos tus detalles con terceros 🔒.',
        newsletterLabel: 'Sí, me gustaría suscribirme al boletín',
        newsletterOptIn: 'Suscribirse al boletín',
        newsletterText:
            'Mantente al día y suscríbete al boletín con confianza. {privacyPolicy}',
        privacyPolicyLink: 'Ver política de privacidad',
        privacyPolicyUrl: '/privacy',
        backToMainButton: 'Volver al inicio',
        footerText: 'Desarrollado con amor',
        validationErrorMessage:
            'Por favor corrige los errores del formulario antes de enviar 🔍',
        sendingMessage: 'Enviando tu mensaje... 📨',
        emailText: {
            greeting: 'Bienvenido',
            confirmationText:
                'Por favor confirma tu solicitud para que Christopher sepa que no eres un bot inteligente. Has enviado un mensaje con los siguientes datos:',
            doubleCheck:
                'Hemos recibido tu mensaje con los siguientes detalles:',
            button: 'Confirma tu email'
        },
        validation: {
            nameRequired: 'Nombre requerido',
            nameLength: 'Mínimo 2 caracteres',
            emailRequired: 'Correo electrónico requerido',
            emailInvalid: 'Correo electrónico inválido',
            messageRequired: 'Mensaje requerido',
            messageLength: 'Mínimo {min} caracteres'
        }
    },
    serviceWorker: {
        updateAvailable: '¡Una nueva versión está disponible!',
        manualRefreshNeeded:
            'Nueva versión activada. Recarga ahora para las últimas funciones.',
        updateSuccess: '¡Aplicación actualizada exitosamente! 🎉'
    },
    notFound: {
        message: '¡Ups! Página no encontrada 🚫',
        backButton: 'Volver al inicio',
        contactButton: 'Contáctanos'
    },
    blog: {
        readMore: 'Leer más',
        backToBlog: 'Volver al blog',
        publishedOn: 'Publicado el',
        author: 'Autor',
        tags: 'Etiquetas',
        readTime: 'min de lectura',
        likes: 'me gusta',
        share: 'Compartir'
    },
    account: {
        create: 'Crear cuenta',
        manage: 'Gestionar cuenta',
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        profile: 'Perfil',
        settings: 'Configuración',
        guest: 'Invitado',
        free: 'GRATIS',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Saltar al contenido principal',
        closeModal: 'Cerrar modal',
        openMenu: 'Abrir menú',
        closeMenu: 'Cerrar menú',
        loading: 'Cargando...',
        error: 'Error ocurrido',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información',
        copyToClipboard: 'Copiar al portapapeles',
        copiedToClipboard: 'Copiado al portapapeles',
        generatePassword: 'Generar contraseña',
        clearForm: 'Limpiar formulario',
        sendMessage: 'Enviar mensaje',
        toggleDarkMode: 'Alternar modo oscuro',
        toggleLanguage: 'Alternar idioma'
    },
    validation: {
        required: 'Este campo es requerido',
        email: 'Por favor ingresa una dirección de email válida',
        minLength: 'Debe tener al menos {min} caracteres',
        maxLength: 'No debe tener más de {max} caracteres',
        invalidFormat: 'Formato inválido',
        serverError: 'Error del servidor, por favor intenta de nuevo',
        networkError: 'Error de red, por favor verifica tu conexión'
    },

    // Traducciones UserSettings
    userSettings: {
        // Configuración básica
        basicSettings: {
            title: 'Configuración básica',
            description: 'Idioma, tema y notificaciones',
            language: {
                label: 'Idioma',
                description: 'Elige tu idioma preferido',
                options: {
                    en: '🇺🇸 Inglés',
                    de: '🇩🇪 Alemán',
                    fr: '🇫🇷 Francés',
                    es: '🇪🇸 Español'
                }
            },
            theme: {
                label: 'Tema',
                description: 'Elige tu tema visual',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Claro',
                    dark: '🌙 Oscuro'
                }
            },
            notifications: {
                label: 'Notificaciones',
                description: 'Recibir actualizaciones importantes'
            }
        },

        // Configuración de seguridad
        securitySettings: {
            title: 'Configuración de seguridad',
            description: 'Fuerza de contraseña y tipos de caracteres',
            passwordLength: {
                label: 'Longitud de contraseña',
                description: 'Elegir la fuerza de la contraseña',
                min: 'Débil (6)',
                max: 'Fuerte (20)'
            },
            includeNumbers: {
                label: 'Incluir números',
                description: 'Agregar caracteres numéricos (0-9)'
            },
            includeSymbols: {
                label: 'Incluir símbolos',
                description: 'Agregar caracteres especiales (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Incluir caracteres especiales',
                description: 'Agregar caracteres especiales extendidos'
            },
            excludeSimilarChars: {
                label: 'Excluir caracteres similares',
                description: 'Evitar caracteres confusos (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Caracteres únicos requeridos',
                description: 'Sin caracteres repetidos en la contraseña'
            }
        },

        // Configuración Emoji
        emojiSettings: {
            title: 'Configuración Emoji',
            description: 'Cantidad de emojis, categorías y patrones',
            emojiCount: {
                label: 'Cantidad de emojis',
                description: 'Cantidad de emojis en la contraseña',
                min: 'Mín (3)',
                max: 'Máx (10)'
            },
            emojiPattern: {
                label: 'Patrón Emoji',
                description: 'Elegir la disposición de emojis',
                options: {
                    random: 'Aleatorio',
                    sequential: 'Secuencial',
                    alternating: 'Alternado'
                }
            },
            emojiTheme: {
                label: 'Tema Emoji',
                description: 'Elegir el estilo de emojis',
                options: {
                    mixed: 'Mixto',
                    cute: 'Tierno',
                    professional: 'Profesional',
                    fantasy: 'Fantasía'
                }
            }
        },

        // Configuración de generación
        generationSettings: {
            title: 'Configuración de generación',
            description: 'Auto-generación y opciones de portapapeles',
            autoGenerate: {
                label: 'Auto-generación',
                description: 'Generar contraseñas automáticamente'
            },
            copyToClipboard: {
                label: 'Copiar al portapapeles',
                description: 'Copiar automáticamente las contraseñas generadas'
            },
            showStrength: {
                label: 'Mostrar fuerza',
                description: 'Mostrar medidor de fuerza de contraseña'
            },
            strengthThreshold: {
                label: 'Umbral de fuerza',
                description: 'Fuerza mínima requerida de la contraseña',
                options: {
                    low: 'Baja',
                    medium: 'Media',
                    high: 'Alta'
                }
            },
            autoRefresh: {
                label: 'Auto-actualización',
                description: 'Regenerar automáticamente contraseñas débiles'
            }
        },

        // Configuración de privacidad
        privacySettings: {
            title: 'Configuración de privacidad',
            description: 'Recopilación de datos y preferencias de compartir',
            saveHistory: {
                label: 'Guardar historial',
                description: 'Guardar contraseñas generadas localmente'
            },
            analytics: {
                label: 'Analytics',
                description: 'Estadísticas de uso anónimas'
            },
            shareUsage: {
                label: 'Compartir uso',
                description: 'Compartir datos de uso para mejoras'
            },
            exportHistory: {
                label: 'Exportar historial',
                description: 'Exportar historial de contraseñas a archivo'
            },
            backupSettings: {
                label: 'Respaldar configuración',
                description: 'Respaldar configuración automáticamente'
            }
        },

        // Funciones Pro
        proFeatures: {
            title: 'Funciones Pro',
            description: 'Configuración avanzada y funciones premium',
            securityAudit: {
                label: 'Auditoría de seguridad',
                description: 'Análisis de seguridad completo',
                buttonText: 'Ejecutar auditoría'
            },
            breachCheck: {
                label: 'Verificación de filtraciones',
                description:
                    'Verificar contraseñas contra filtraciones conocidas'
            },
            strengthAnalytics: {
                label: 'Analytics de fuerza',
                description: 'Análisis avanzado de fuerza de contraseñas'
            }
        }
    },

    // Accounting y seguridad
    accounting: {
        // Inicio de sesión y autenticación
        login: {
            title: 'Iniciar sesión',
            emailPlaceholder: 'Ingresa tu dirección de email',
            magicLinkSent: '¡Enlace mágico enviado!',
            magicLinkError: 'Error al enviar el enlace mágico',
            verificationSuccess: '¡Email verificado exitosamente!',
            verificationError: 'Fallo en la verificación del email',
            rateLimitExceeded:
                'Demasiados intentos de inicio de sesión. Por favor espera.',
            sessionExpired:
                'Sesión expirada. Por favor inicia sesión nuevamente.'
        },

        // Gestión de cuenta
        account: {
            title: 'Gestión de cuenta',
            profile: 'Perfil',
            settings: 'Configuración',
            logout: 'Cerrar sesión',
            logoutSuccess: 'Sesión cerrada exitosamente',
            accountCreated: 'Cuenta creada exitosamente',
            accountUpdated: 'Cuenta actualizada exitosamente',
            accountError: 'Error en la gestión de cuenta'
        },

        // Eventos de seguridad
        security: {
            loginAttempt: 'Intento de inicio de sesión',
            loginSuccess: 'Inicio de sesión exitoso',
            loginFailed: 'Fallo en inicio de sesión',
            logout: 'Cierre de sesión',
            sessionExpired: 'Sesión expirada',
            suspiciousActivity: 'Actividad sospechosa',
            verificationSuccess: 'Verificación exitosa',
            verificationFailed: 'Fallo en verificación',
            accountCreated: 'Cuenta creada',
            accountUpdated: 'Cuenta actualizada',
            securityAudit: 'Auditoría de seguridad realizada'
        },

        // Validación
        validation: {
            required: 'Este campo es requerido',
            emailInvalid: 'Por favor ingresa una dirección de email válida',
            urlInvalid: 'Por favor ingresa una URL válida',
            phoneInvalid: 'Por favor ingresa un número de teléfono válido',
            passwordWeak:
                'La contraseña debe contener al menos 8 caracteres con mayúsculas, minúsculas y números',
            minLength: 'Longitud mínima es {min} caracteres',
            maxLength: 'Longitud máxima es {max} caracteres',
            minValue: 'Valor mínimo es {min}',
            maxValue: 'Valor máximo es {max}',
            validInput: 'Entrada válida'
        },

        // Menú contextual
        contextMenu: {
            exportSettings: 'Exportar configuración',
            importSettings: 'Importar configuración',
            resetToDefault: 'Restablecer a valores predeterminados',
            proMessage:
                '💎 Los usuarios Pro pueden exportar e importar su configuración'
        }
    },

    // Modales y notificaciones
    modals: {
        success: 'Éxito',
        error: 'Error',
        warning: 'Advertencia',
        info: 'Información',
        confirm: 'Confirmar',
        cancel: 'Cancelar',
        close: 'Cerrar',
        loading: 'Cargando...',
        saving: 'Guardando...',
        exporting: 'Exportando...',
        importing: 'Importando...',
        resetting: 'Restableciendo...',
        closeModal: 'Cerrar modal',
        modalClosesIn: 'El modal se cierra en {seconds} segundos',
        modalClosesInSingular: 'El modal se cierra en {seconds} segundo'
    },
    versions: {
        pageTitle: 'Historial de versiones',
        pageDescription:
            'Consulta el historial de desarrollo y el changelog de Keymoji, el generador de contraseñas emoji.'
    },

    // Traducciones AccountManager
    accountManager: {
        // Títulos y descripciones de página
        pageTitle: 'Gestor de cuenta',
        pageDescription:
            'Gestiona tu configuración de seguridad y preferencias de cuenta',
        welcomeBack: '¡Bienvenido de vuelta, {name}! 👋',
        welcomeDescription:
            '¿Listo para crear contraseñas emoji increíbles? ¡Tu cuenta está segura y lista!',
        returnUserTitle: '👋 ¡Bienvenido de vuelta!',
        returnUserDescription:
            'Hemos reconocido tu dirección de correo electrónico. Inicia sesión rápidamente.',
        verificationTitle: '📧 Introduce tu código',
        verificationDescription:
            'Introduce el código de 7 dígitos enviado a {email}',
        verifyingTitle: '🔑 Verificando código...',
        verifyingDescription:
            'Por favor espera mientras verificamos tu código.',
        verificationErrorTitle: '❌ Error de verificación',
        verificationErrorDescription: 'Ha ocurrido un error.',

        // Botones y acciones
        buttons: {
            createMagicLink: 'Crear enlace mágico',
            loginToAccount: 'Iniciar sesión en cuenta',
            checkAccountExists: 'Verificando cuenta...',
            sendingMagicLink: 'Enviando enlace mágico...',
            accountExists: 'Cuenta encontrada - Iniciando sesión...',
            accountNotFound: 'Cuenta no encontrada - Creando...',
            sessionExpired: 'Sesión expirada - Iniciar sesión nuevamente',
            loginAgain: '🔐 Iniciar sesión nuevamente',
            createNewAccount: 'Crear nueva cuenta',
            resendMagicLink: '🔄 Enviar nuevo código',
            backToAccountOptions: '← Volver',
            addProfile: 'Agregar',
            hideProfile: 'Ocultar',
            profileData: 'Datos de perfil',
            showFullForm: 'Mostrar formulario completo',
            compactView: 'Vista compacta',
            addName: '¡Agrega tu nombre!'
        },

        // Etiquetas de formulario
        emailLabel: 'Correo electrónico',
        nameLabel: 'Nombre',

        // Acciones
        actions: {
            saveSettings: '💾 Guardar configuración',
            backToHome: '🏠 Volver al inicio',
            skipAccount: '❌ Omitir {type}',
            createAccount: '🚀 Crear cuenta {type}',
            settingsSaved: '¡Configuración guardada exitosamente!'
        },

        // Estadísticas
        statistics: {
            storiesGenerated: 'Historias generadas',
            remainingGenerations: 'Generaciones restantes'
        },

        // Generaciones diarias
        dailyGenerations: 'Generaciones diarias',

        // Visualización de generaciones restantes
        remainingDisplay: '{remaining} / {limit}',

        // Beneficios
        benefits: {
            free: {
                dailyGenerations: '10 generaciones seguras diarias',
                dailyGenerationsDesc:
                    'Tecnología resistente a IA para máxima seguridad',
                decentralizedData: 'IA suiza gratuita',
                decentralizedDataDesc:
                    'Usa Apertus, ChatGPT, Gemini, Claude, Mistral y más - directamente utilizable',
                webApp: 'Disponible como aplicación web',
                webAppDesc: 'Disponible al instante - sin instalación necesaria'
            },
            pro: {
                unlimitedGenerations: 'Generaciones seguras ilimitadas',
                unlimitedGenerationsDesc:
                    'Crea tantas contraseñas como necesites - sin límites',
                browserExtension: 'Extensión de navegador (Q4 2025)',
                browserExtensionDesc:
                    'Seguridad directamente en tu navegador - automáticamente y en todas partes',
                apiIntegration: 'Integración API (Q4 2025)',
                apiIntegrationDesc:
                    'Integra seguridad de manera transparente en tus propias aplicaciones'
            }
        },

        // Verificación OTP
        verification: {
            titleNew: 'Código de registro',
            titleReturn: 'Código de inicio de sesión',
            sentTo: 'Código enviado a',
            codeLabel: 'Código de confirmación de 7 dígitos',
            codePlaceholder: '1234567',
            submitCode: '✅ Confirmar código',
            verifying: 'Verificando...',
            codeError: 'Por favor introduce el código de 7 dígitos.',
            codeInvalid: 'Código inválido o expirado. Por favor solicita uno nuevo.',
            accountFoundSendingCode: '¡Cuenta encontrada! Te enviamos un código.',
            accountFoundSendingLink: '¡Cuenta encontrada! Te enviamos un código.',
            creatingNewAccount: 'Creando nueva cuenta — revisa tu email para el código.',
            magicLinkSent: '¡Código enviado! Introduce el código de 7 dígitos de tu email.',
            magicLinkSendFailed: 'Error al enviar el código. Por favor inténtalo de nuevo.',
            otpVerified: '¡Código confirmado — has iniciado sesión!',
            magicLinkVerified: '¡Código verificado exitosamente!',
            magicLinkVerificationFailed: 'Verificación del código fallida'
        },

        // Sección de ayuda
        help: {
            title: '💡 ¿Necesitas ayuda?',
            spamFolder:
                '• Revisa tu carpeta de spam si no ves el correo electrónico',
            codeExpiry: '• El código es válido durante 15 minutos',
            magicLinkExpiry: '• Los códigos expiran después de 15 minutos',
            requestNewLink: '• Puedes solicitar un nuevo código en cualquier momento',
            noLink: '• No necesitas hacer clic en ningún enlace — solo introduce el código',
            noPassword: '• No se requiere contraseña — solo introduce el código'
        },

        // Pie de página
        footer: {
            magicLink: 'Enlace mágico',
            instantSetup: 'Configuración instantánea',
            noSpam: 'Sin spam',
            text: 'Los enlaces mágicos se envían por correo electrónico y son válidos durante 15 minutos.',
            privacy: 'Tus datos se manejan de forma segura.'
        },

        // Límites y mensajes
        canStillGenerate: '¡Aún puedes generar emojis!',
        limitReached:
            'Límite diario alcanzado. Actualiza a PRO para generaciones ilimitadas.',

        // Account age labels
        accountAge: {
            today: '✨ FREE: ¡Desde hoy!',
            yesterday: '🚀 FREE: ¡Desde ayer!',
            days: '🔥 FREE: ¡Desde {days} días!',
            weeks: '⚡ FREE: ¡Desde {weeks} semana{plural}!',
            months: '💪 FREE: ¡Desde {months} mes{plural}!',
            years: '🏆 FREE: ¡Desde {years} año{plural}!',
            accountSince: 'Cuenta desde {days} {unit}',
            since: 'desde {days} {unit}',
            day: 'día',
            days: 'días',
            accountCreated: 'Cuenta creada',
            // Sexy salesy account creation texts
            createdTodayFree: '✨ ¡Tu cuenta FREE está lista para despegar!',
            createdTodayPro:
                '💎 ¡Bienvenido al club PRO – exclusivo desde hoy!',
            createdRecentlyFree: '✨ Cuenta FREE – recién salida del horno!',
            createdRecentlyPro: '💎 Cuenta PRO – exclusiva y nueva!',
            // Sexy salesy account creation texts
            createdTodayFree: '✨ ¡Tu cuenta FREE está lista para despegar!',
            createdTodayPro:
                '💎 ¡Bienvenido al club PRO – exclusivo desde hoy!',
            createdRecentlyFree: '✨ Cuenta FREE – recién salida del horno!',
            createdRecentlyPro: '💎 Cuenta PRO – exclusiva y nueva!'
        },

        // Validación
        validation: {
            emailInvalid:
                'Por favor ingresa una dirección de correo electrónico válida',
            nameInvalid: 'Por favor ingresa tu nombre (mínimo 2 caracteres)'
        },

        // Mensajes
        messages: {
            settingsReset: 'Configuración restablecida por defecto',
            exportFailed: 'Error al exportar configuración',
            settingsExported: 'Configuración exportada exitosamente',
            freeAccountActivated: '¡Cuenta gratuita activada!'
        },
        
        // Apertus Info
        apertusInfo: '🇨🇭 IA suiza gratuita, incluida. Apertus — LLM de código abierto de EPFL & ETH Zurich. Tus datos permanecen en Suiza. No se necesita clave API.',
        apiKeyLabel: 'Clave API',
        apiKeyLabelApertus: 'Token de Hugging Face',
        apiKeyLabelCustom: 'Clave API personalizada',
        optional: 'opcional',
        verified: 'Verificado',
        testBtn: 'Probar',
        apertusBuiltIn: 'Token integrado activo — funciona sin introducir una clave.',
        apertusOwnToken: 'Introduce tu propio token de Hugging Face (hf_…) para usar tu cuota personal.',
        apertusGetToken: 'Obtener token HF gratuito',
        openaiHint: 'Requiere una clave API de OpenAI de pago (sk-…).',
        geminiHint: 'Nivel gratuito disponible. Obtén tu clave en Google AI Studio.',
        claudeHint: 'Requiere una clave API de Anthropic (sk-ant-…).',
        mistralHint: 'IA europea. Obtén tu clave en console.mistral.ai.',
        customHint: 'Endpoint compatible con OpenAI. Introduce la URL base y la clave API abajo.',
        getApiKey: 'Obtener clave API',
        savedKeys: 'Guardado',

        // Sección de actualización
        upgrade: {
            upgradeToPro: 'Actualizar a Pro',
            upgradeToProForFeatures:
                'Actualizar a Pro para funciones avanzadas',
            unlimitedGenerations:
                'Generaciones ilimitadas y funciones de seguridad avanzadas'
        },

        // Menú contextual
        contextMenu: {
            exportSettings: 'Exportar configuración',
            importSettings: 'Importar configuración',
            resetToDefault: 'Restablecer por defecto',
            logout: 'Cerrar sesión',
            settingsMenu: 'Menú de configuración'
        },

        // Funciones
        features: {
            proFeature: 'Función Pro'
        },

        // Modal de función Pro
        proFeatureModal: {
            title: 'Función Pro',
            proBenefits: 'Beneficios Pro:',
            unlimitedGenerations: 'Generaciones emoji ilimitadas',
            advancedSecurity: 'Funciones de seguridad avanzadas',
            prioritySupport: 'Soporte prioritario',
            earlyAccess: 'Acceso temprano a nuevas funciones',
            maybeLater: 'Quizás más tarde',
            upgradeToPro: 'Actualizar a Pro',
            // Actualización Pro específica
            proUpgrade: 'Actualización Pro',
            unlockAdvancedFeatures:
                'Desbloquear todas las funciones y configuraciones avanzadas',
            upgradeProNow: '💎 Actualizar a Pro ahora'
        },

        // Niveles de cuenta
        tiers: {
            free: 'GRATIS',
            pro: 'PRO',
            freeAccount: 'Cuenta gratuita',
            proAccount: 'Cuenta Pro'
        },

        // Insignias
        freeBadge: '✨ GRATIS',
        proBadge: '💎 PRO',

        // Demo Chart (cuando no hay datos reales)
        demoChart: {
            title: 'Sin datos',
            description: 'Genera emojis para recopilar tus datos de uso reales y mostrarlos aquí.',
            cta: 'Crear Keymoji'
        },

        // Descripciones
        freeDescription: '✨ Seguridad gratuita',
        proDescription: '💎 Seguridad empresarial'
    },

    // Textos UI generales
    ui: {
        save: 'Guardar',
        cancel: 'Cancelar',
        reset: 'Restablecer',
        export: 'Exportar',
        import: 'Importar',
        delete: 'Eliminar',
        edit: 'Editar',
        add: 'Agregar',
        remove: 'Remover',
        search: 'Buscar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        refresh: 'Actualizar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        submit: 'Enviar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Info'
    }
};
