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
            'Haz clic "📝 Historia" para tu cuento emoji de IA 📖',
            '"Aleatorio" es autoexplicativo 😜.',
            '¡Después de generar, se guarda en tu portapapeles! 📋'
        ],
        backToMainText: 'Haz clic abajo 👇 para volver',
        backToMainButtonText: 'Volver a la home',
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
        errorStoryMessage: 'Error, sin respuesta del servidor 🌀',
        emojiDisplayTitle: 'Generador de Contraseñas Emoji',
        dataPrivacyProcessingInfo:
            '🚀 ¡Magia emoji a través de webhooks e IA! ✨ Los datos son como arena de playa - no se quedan.',
        clearButton: '✖️ Limpiar',
        storyButton: '📝 Historia',
        storyButtonClicked: '📩 Enviar historia',
        randomButton: '🎲 Aleatorio',
        placeholderText:
            'Cuéntame una historia y generaré contraseñas emoji basadas en ella...'
    },
    donateButton: {
        text: 'Cómprame un café',
        openText: 'Cerrar este menú',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Tu nombre',
        emailLabel: '📧 Tu email',
        messageLabel: '✍🏻 Tu mensaje',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Enviar',
        successMessage: 'Éxito, mensaje enviado - Respuesta: < 24 horas 🚀',
        errorMessage: 'Ocurrió un error inesperado 😟',
        requestErrorMessage:
            'Error al enviar el mensaje, por favor inténtalo de nuevo 🙁',
        smirkingFaceImageAlt: 'keymoji emoji cara sonriente 1f60f',
        introductionTitle: 'Hola, soy Christopher',
        introductionText:
            'Desarrollador frontend y me encanta diseñar y codificar sitios web amigables con JavaScript, PHP y HTML. No dudes y envíame un mensaje si te gusta.',
        privacyNotice:
            'Ten la seguridad de que tus datos están en buenas manos con nosotros 🤲. Tus detalles no serán transmitidos a terceros 🔒.',
        newsletterLabel: 'Sí, me gustaría suscribirme al boletín',
        emailText: {
            greeting: 'Bienvenido',
            intro: '¡Gracias por enviar un mensaje 📩!',
            confirmationText:
                'Por favor confirma tu solicitud para que Christopher sepa que no eres un bot inteligente. Enviaste un mensaje con los siguientes datos:'
        }
    },
    serviceWorker: {
        updateAvailable: '¡Hay una nueva versión disponible!',
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
        serverError: 'Error del servidor, por favor inténtalo de nuevo',
        networkError: 'Error de red, por favor verifica tu conexión'
    }
};
