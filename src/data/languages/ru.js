// src/data/languages/ru.js
// Russian language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Открыть главное меню',
        closeMainMenu: 'Закрыть главное меню'
    },
    index: {
        pageTitle: 'Генератор паролей Emoji',
        pageDescription:
            '🔑 Пароли заново изобретены. 🎯 Неразрушимые пароли emoji. 🌈 Бесплатно. Безопасно. Инновационно. 🤖 Технология, устойчивая к ИИ. 🌍 Доступно на 15+ языках.',
        pageKeywords:
            'Keymoji, пароль emoji, генератор паролей, безопасность, онлайн безопасность',
        pageInstruction: [
            'Нажмите "📝 История" для вашей ИИ emoji сказки 📖',
            '"Случайный" самоочевиден 😜.',
            'После генерации сохраняется в буфер обмена! 📋'
        ],
        backToMainText: 'Нажмите ниже 👇 чтобы вернуться',
        backToMainButtonText: 'Вернуться к HOME',
        contactText: 'Есть вопрос или крутое предложение?',
        contactButtonText: 'Отправьте мне сообщение! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Нажмите или нажмите Enter чтобы скопировать сгенерированный пароль emoji в буфер обмена',
        successMessage: 'Успех, скопировано в буфер обмена 💾',
        errorMessage: 'Упс, что-то пошло не так 🤖',
        dailyLimitReachedMessage:
            'Извините, достигнут дневной лимит запросов 😔',
        successStoryMessage: 'Успех, история emoji сгенерирована 🤖',
        errorStoryMessage: 'Ошибка, нет ответа от сервера 🌀',
        emojiDisplayTitle: 'Генератор паролей Emoji',
        dataPrivacyProcessingInfo:
            '🚀 Магия emoji через вебхуки и ИИ! ✨ Данные как песок на пляже - не остаются.',
        clearButton: '✖️ Очистить',
        storyButton: '📝 История',
        storyButtonClicked: '📩 Отправить историю',
        randomButton: '🎲 Случайный',
        placeholderText:
            'Расскажите мне историю и я сгенерирую пароли emoji на её основе...'
    },
    donateButton: {
        text: 'Купите мне кофе',
        openText: 'Закрыть это меню',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Ваше имя',
        emailLabel: '📧 Ваш email',
        messageLabel: '✍🏻 Ваше сообщение',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Отправить',
        successMessage: 'Успех, сообщение отправлено - Ответ: < 24 часа 🚀',
        errorMessage: 'Произошла неожиданная ошибка 😟',
        requestErrorMessage: 'Ошибка отправки сообщения, попробуйте снова 🙁',
        smirkingFaceImageAlt: 'keymoji emoji ухмыляющееся лицо 1f60f',
        introductionTitle: 'Привет, я Кристофер',
        introductionText:
            'Фронтенд разработчик и я люблю проектировать и кодировать удобные веб-сайты с JavaScript, PHP и HTML. Не стесняйтесь и отправьте мне сообщение если хотите.',
        privacyNotice:
            'Будьте уверены, ваши данные в надежных руках с нами 🤲. Ваши детали не будут переданы третьим лицам 🔒.',
        newsletterLabel: 'Да, я хочу подписаться на рассылку',
        emailText: {
            greeting: 'Добро пожаловать',
            intro: 'Спасибо за отправку сообщения 📩!',
            confirmationText:
                'Пожалуйста подтвердите ваш запрос чтобы Кристофер знал что вы не умный бот. Вы отправили сообщение со следующими данными:'
        }
    },
    serviceWorker: {
        updateAvailable: 'Доступна новая версия!',
        manualRefreshNeeded:
            'Новая версия активирована. Перезагрузите сейчас для последних функций.',
        updateSuccess: 'Приложение успешно обновлено! 🎉'
    },
    notFound: {
        message: 'Упс! Страница не найдена 🚫',
        backButton: 'Вернуться на главную',
        contactButton: 'Свяжитесь с нами'
    },
    blog: {
        readMore: 'Читать далее',
        backToBlog: 'Вернуться к блогу',
        publishedOn: 'Опубликовано',
        author: 'Автор',
        tags: 'Теги',
        readTime: 'мин чтения',
        likes: 'лайков',
        share: 'Поделиться'
    },
    account: {
        create: 'Создать аккаунт',
        manage: 'Управлять аккаунтом',
        login: 'Войти',
        logout: 'Выйти',
        profile: 'Профиль',
        settings: 'Настройки',
        guest: 'Гость',
        free: 'БЕСПЛАТНО',
        pro: 'ПРО'
    },
    accessibility: {
        skipToMain: 'Перейти к основному содержимому',
        closeModal: 'Закрыть модальное окно',
        openMenu: 'Открыть меню',
        closeMenu: 'Закрыть меню',
        loading: 'Загрузка...',
        error: 'Произошла ошибка',
        success: 'Успех',
        warning: 'Предупреждение',
        info: 'Информация',
        copyToClipboard: 'Копировать в буфер обмена',
        copiedToClipboard: 'Скопировано в буфер обмена',
        generatePassword: 'Генерировать пароль',
        clearForm: 'Очистить форму',
        sendMessage: 'Отправить сообщение',
        toggleDarkMode: 'Переключить темный режим',
        toggleLanguage: 'Переключить язык'
    },
    validation: {
        required: 'Это поле обязательно',
        email: 'Пожалуйста введите действительный email адрес',
        minLength: 'Должно содержать минимум {min} символов',
        maxLength: 'Не должно содержать больше {max} символов',
        invalidFormat: 'Неверный формат',
        serverError: 'Ошибка сервера, попробуйте снова',
        networkError: 'Ошибка сети, проверьте соединение'
    }
};
