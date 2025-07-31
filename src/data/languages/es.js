// src/data/languages/es.js
// Spanish language content

import { formatVersion } from '../../utils/version.js';

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
            'Haz clic en "📝 Historia" para tu cuento emoji de IA 📖',
            '"Aleatorio" es autoexplicativo 😜.',
            '¡Después de generar, se guarda en tu portapapeles! 📋'
        ],
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
        clearButton: '✖️ Limpiar',
        storyButton: '📝 Historia',
        storyButtonClicked: '📩 Enviar historia',
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
            'Desarrollador frontend y me encanta crear sitios web fáciles de usar con JavaScript, PHP y HTML. ¡No dudes en enviarme un mensaje si quieres!',
        nameLabel: '🧑🏻 Tu nombre',
        emailLabel: '📧 Tu correo electrónico',
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
        newsletterLabel: 'Sí, quiero suscribirme al boletín',
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
        resetting: 'Restableciendo...'
    },

    // Traducciones AccountManager
    accountManager: {
        // Encabezados y descripciones
        pageTitle: 'Gestión de cuenta',
        pageDescription:
            'Gestiona tu configuración de seguridad y preferencias de cuenta',
        welcomeBack: '¡Bienvenido de vuelta, {name}! 👋',
        welcomeDescription:
            '¿Listo para crear contraseñas emoji increíbles? ¡Tu cuenta está segura y lista!',
        verificationTitle: '📧 Verifica tu correo electrónico y confirma',
        verificationDescription:
            'Verifica tu correo electrónico {email} y haz clic en el enlace mágico para completar la configuración',

        // Estado de la cuenta
        accountStatus: 'Estado de la cuenta',
        emailLabel: 'Dirección de correo electrónico',
        nameLabel: 'Tu nombre',
        profileDataLabel: 'Datos del perfil',

        // Niveles de cuenta
        freeBadge: '✨ GRATIS',
        proBadge: '💎 PRO',
        freeDescription: '✨ Seguridad gratuita',
        proDescription: '💎 Seguridad empresarial',

        // Beneficios
        benefits: {
            free: {
                title: 'Beneficios GRATIS',
                dailyGenerations: '5 generaciones seguras diarias',
                dailyGenerationsDesc: 'Tecnología resistente a IA',
                decentralizedData: 'Procesamiento de datos descentralizado',
                decentralizedDataDesc: 'Tus datos permanecen privados',
                webApp: 'Disponible como aplicación web',
                webAppDesc: 'Acceso seguro desde cualquier lugar'
            },
            pro: {
                title: 'Beneficios PRO',
                unlimitedGenerations: 'Generaciones seguras ilimitadas',
                unlimitedGenerationsDesc: 'Sin límites diarios',
                aiThreatDetection: 'Detección de amenazas impulsada por IA',
                aiThreatDetectionDesc: 'Análisis de seguridad proactivo',
                browserExtension: 'Extensión de navegador (Q4 2025)',
                browserExtensionDesc: 'Seguridad en todas partes en la web',
                wordpressPlugin: 'Plugin de WordPress (Q4 2025)',
                wordpressPluginDesc: 'Integra seguridad en tu sitio web'
            }
        },

        // Límite diario
        dailyGenerations: 'Generaciones diarias',
        remainingGenerations: '{remaining} / {limit} restantes',
        canStillGenerate: '¡Aún puedes generar emojis!',
        limitReached:
            'Límite diario alcanzado. Actualiza a PRO para generaciones ilimitadas.',

        // Estadísticas
        statistics: {
            storiesGenerated: 'Historias generadas',
            remainingGenerations: 'Generaciones restantes'
        },

        // Acciones
        actions: {
            saveSettings: '💾 Guardar configuración',
            backToHome: '🏠 Volver al inicio',
            createAccount: '🚀 Crear cuenta {type}',
            skipAccount: 'Omitir cuenta {type}',
            createMagicLink: '🔐 Crear enlace mágico',
            sendingMagicLink: '⏳ Enviando enlace mágico...',
            resendMagicLink: '🔄 Reenviar enlace mágico',
            backToAccountOptions: '← Volver a opciones de cuenta',
            addProfileData: '👤 Agregar datos de perfil',
            hideProfileData: '👤 Ocultar datos de perfil'
        },

        // Validación de formulario
        validation: {
            invalidEmail:
                '⚠️ Por favor ingresa una dirección de correo electrónico válida',
            invalidName: '⚠️ Por favor ingresa tu nombre (mínimo 2 caracteres)',
            requiredField: 'Este campo es requerido'
        },

        // Sección de ayuda
        help: {
            title: '💡 ¿Necesitas ayuda?',
            checkSpam:
                '• Revisa tu carpeta de spam si no ves el correo electrónico',
            linkExpires: '• Los enlaces mágicos expiran después de 15 minutos',
            requestNewLink:
                '• Puedes solicitar un nuevo enlace en cualquier momento',
            noPassword:
                '• No se requiere contraseña - solo haz clic en el enlace'
        },

        // Pie de página
        footer: {
            magicLink: '🔒 Enlace mágico',
            instantSetup: '⚡ Configuración instantánea',
            noSpam: '🎯 Sin spam'
        }
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
