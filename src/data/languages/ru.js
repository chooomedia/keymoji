// src/data/languages/ru.js
// Russian language content

import { formatVersion } from '../../utils/version';

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
        pageTitle: 'Генератор Паролей Эмодзи',
        pageDescription:
            '🔑 Запоминающиеся пароли, без усилий. 🎯 Невзламываемые последовательности эмодзи. 🌍 15+ языков. 🔒 Соответствует GDPR.',
        pageKeywords:
            'Keymoji, пароль эмодзи, генератор паролей, безопасность, онлайн безопасность',
        pageInstruction: [
            'Выберите свой ИИ и создайте свою историю Keymoji',
            '"Случайный" говорит сам за себя 😜.',
            'После генерации копируется в буфер обмена! 📋'
        ],
        levelHint: 'Уровень определяет количество эмодзи в пароле — больше эмодзи означает большую безопасность.',
        setupStoryMode: 'Используйте свой ИИ',
        setupStoryModeShort: 'Используйте свой ИИ',
        setupStoryModeSwiss: 'Использовать швейцарский ИИ',
        setupStoryModeSwissShort: 'Швейцарский ИИ',
        setupStoryModeOr: 'или',
        setupStoryModeBannerCta: '— Создай свою историю Keymoji',
        setupStoryModeBannerText: '😊 Твоя история: улыбка — твой ключ',
        setupStoryModeChip: 'Активировать Story Mode',
        setupStoryModeDescription:
            'Подключитесь к вашему ИИ для персонализированных паролей эмодзи.',
        setupStoryModeSwissDescription:
            'Швейцарский ИИ для пользователей, заботящихся о конфиденциальности. Данные остаются в Швейцарии, соответствуют GDPR, корпоративная безопасность. Идеально для частных лиц и компаний, ценящих суверенитет данных.',
        setupStoryModeSwissTooltip:
            'Швейцарский ИИ (Apertus) - ИИ, ориентированный на конфиденциальность, размещенный в Швейцарии. Ваши данные остаются в Швейцарии, защищенные швейцарскими законами о защите данных. Соответствует GDPR, корпоративная безопасность. Идеально для пользователей, заботящихся о конфиденциальности, и компаний, требующих суверенитета данных.',
        storyModeReady: 'Пароли эмодзи, созданные ИИ, готовы 🤖',
        backToMainText: 'Нажмите ниже 👇 чтобы вернуться',
        backToMainButtonText: 'Вернуться на главную',
        contactText: 'Есть вопрос или крутое предложение?',
        contactButtonText: 'Отправьте мне сообщение! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Нажмите или нажмите Enter чтобы скопировать сгенерированный пароль эмодзи в буфер обмена',
        successMessage: 'Успех, скопировано в буфер обмена 💾',
        errorMessage: 'Упс, что-то пошло не так 🤖',
        dailyLimitReachedMessage:
            'Извините, достигнут дневной лимит запросов 😔',
        successStoryMessage: 'Успех, история эмодзи сгенерирована 🤖',
        errorStoryMessage: 'Ошибка, нет ответа от сервера 🌀',
        emojiDisplayTitle: 'Генератор Паролей Эмодзи',
        dataPrivacyProcessingInfo:
            '🚀 Магия эмодзи через вебхуки и ИИ! ✨ Данные как песок на пляже - не остаются.',
        clearButton: 'Очистить',
        storyButton: '✨ История',
        storyButtonClicked: '✨ Отправить историю',
        randomButton: '🎲 Случайный',
        placeholderText:
            'Расскажите мне историю и я сгенерирую пароли эмодзи на её основе...',
        clipboardError: 'Ошибка при копировании в буфер обмена'
    },
    donateButton: {
        text: 'Купите мне кофе',
        openText: 'Закрыть это меню',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Привет, я Кристофер',
        pageDescription:
            'Фронтенд-разработчик, люблю создавать удобные сайты на TypeScript, JavaScript, PHP и HTML. Не стесняйтесь написать мне сообщение!',
        nameLabel: '🧑🏻 Ваше имя',
        emailLabel: 'Ваш e-mail',
        messageLabel: '✍🏻 Сообщение',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Отправить',
        sendingButton: '📨 Отправка...',
        successMessage: 'Успех, сообщение отправлено - Ответ: < 24ч 🚀',
        errorMessage: 'Произошла непредвиденная ошибка 😟',
        requestErrorMessage:
            'Ошибка при отправке сообщения, попробуйте еще раз 🙁',
        smirkingFaceImageAlt: 'keymoji emoji улыбающееся лицо 1f60f',
        introductionTitle: 'Есть вопрос или интересное предложение?',
        introductionText: 'Не стесняйтесь написать мне!',
        privacyNotice:
            'Ваши данные в надежных руках 🤲. Мы не передаем ваши данные третьим лицам 🔒.',
        newsletterLabel: 'Да, я хочу подписаться на рассылку',
        emailVerified: 'Подтверждён',
        emailLockedHint: 'Из твоего профиля',
        newsletterOptIn: 'Подписаться на рассылку',
        newsletterText:
            'Будьте в курсе и подпишитесь на рассылку с уверенностью. {privacyPolicy}',
        privacyPolicyLink: 'Посмотреть политику конфиденциальности',
        privacyPolicyUrl: '/privacy',
        backToMainButton: 'Назад на главную',
        footerText: 'Сделано с любовью',
        validationErrorMessage:
            'Пожалуйста, исправьте ошибки в форме перед отправкой 🔍',
        sendingMessage: 'Отправка сообщения... 📨',
        emailText: {
            greeting: 'Добро пожаловать',
            confirmationText:
                'Пожалуйста, подтвердите свой запрос, чтобы Кристофер знал, что вы не бот. Вы отправили сообщение со следующими данными:',
            doubleCheck: 'Мы получили ваше сообщение со следующими деталями:',
            button: 'Подтвердить e-mail',
            subject: 'Ваше сообщение в Keymoji получено',
            privacy: 'Ваши данные обрабатываются безопасно.'
        },
        validation: {
            nameRequired: 'Имя обязательно',
            nameLength: 'Минимум 2 символа',
            emailRequired: 'E-mail обязателен',
            emailInvalid: 'Неверный e-mail',
            messageRequired: 'Сообщение обязательно',
            messageLength: 'Минимум {min} символов'
        },
        autoFilledLabel: 'Автозаполнено из вашего аккаунта'
    },
    serviceWorker: {
        updateAvailable: 'Доступна новая версия!',
        manualRefreshNeeded:
            'Новая версия активирована. Перезагрузите сейчас для последних функций.',
        updateSuccess: 'Приложение успешно обновлено! 🎉'
    },
    notFound: {
        pageTitle: '404 - Страница не найдена',
        pageDescription: 'Страница, которую вы ищете, не существует или была перемещена.',
        oopsTitle: 'Упс! Страница не найдена',
        oopsDescription: 'Страница, которую вы ищете, могла быть перемещена, удалена или никогда не существовала.',
        quickNavTitle: 'Быстрая навигация',
        recentEmojisTitle: 'Последние Keymoji',
        backToHome: 'Вернуться на главную',
        prevEmoji: 'Предыдущий эмодзи',
        nextEmoji: 'Следующий эмодзи',
        message: 'Упс! Страница не найдена 🚫',
        suggestion: 'Страница, которую вы ищете, могла быть перемещена, удалена или никогда не существовала.',
        backButton: 'Вернуться на главную',
        contactButton: 'Связаться с нами',
        navigationTitle: 'Доступные страницы',
        recentEmojis: 'Последние эмодзи'
    },
    blog: {
        readMore: 'Читать далее',
        backToBlog: 'Вернуться к блогу',
        publishedOn: 'Опубликовано',
        author: 'Автор',
        tags: 'Теги',
        readTime: 'мин чтения',
        likes: 'лайки',
        share: 'Поделиться'
    },
    account: {
        create: 'Создать аккаунт',
        manage: 'Управление аккаунтом',
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
        maxLength: 'Не может содержать более {max} символов',
        invalidFormat: 'Неверный формат',
        serverError: 'Ошибка сервера, попробуйте снова',
        networkError: 'Ошибка сети, проверьте соединение'
    },

    // Переводы UserSettings
    userSettings: {
        // Основные настройки
        basicSettings: {
            title: 'Основные настройки',
            description: 'Язык, тема и уведомления',
            language: {
                label: 'Язык',
                description: 'Выберите предпочитаемый язык',
                options: {
                    en: '🇺🇸 Английский',
                    de: '🇩🇪 Немецкий',
                    fr: '🇫🇷 Французский',
                    es: '🇪🇸 Испанский',
                    ru: '🇷🇺 Русский'
                }
            },
            theme: {
                label: 'Тема',
                description: 'Выберите визуальную тему',
                options: {
                    auto: '🔄 Авто',
                    light: '☀️ Светлая',
                    dark: '🌙 Темная'
                }
            },
            notifications: {
                label: 'Уведомления',
                description: 'Получать важные обновления'
            }
        },

        // Настройки безопасности
        securitySettings: {
            title: 'Настройки безопасности',
            description: 'Сила пароля и типы символов',
            passwordLength: {
                label: 'Длина пароля',
                description: 'Выберите силу пароля',
                min: 'Слабый (6)',
                max: 'Сильный (20)'
            },
            includeNumbers: {
                label: 'Включить цифры',
                description: 'Добавить числовые символы (0-9)'
            },
            includeSymbols: {
                label: 'Включить символы',
                description: 'Добавить специальные символы (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Включить специальные символы',
                description: 'Добавить расширенные специальные символы'
            },
            excludeSimilarChars: {
                label: 'Исключить похожие символы',
                description: 'Избегать путающих символов (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Требовать уникальные символы',
                description: 'Без повторяющихся символов в пароле'
            }
        },

        // Настройки эмодзи
        emojiSettings: {
            title: 'Настройки эмодзи',
            description: 'Количество эмодзи, категории и паттерны',
            emojiCount: {
                label: 'Количество эмодзи',
                description: 'Количество эмодзи в пароле',
                min: 'Мин (3)',
                max: 'Макс (10)'
            },
            emojiPattern: {
                label: 'Паттерн эмодзи',
                description: 'Выберите расположение эмодзи',
                options: {
                    random: 'Случайный',
                    sequential: 'Последовательный',
                    alternating: 'Чередующийся'
                }
            },
            emojiTheme: {
                label: 'Тема эмодзи',
                description: 'Выберите стиль эмодзи',
                options: {
                    mixed: 'Смешанный',
                    cute: 'Милый',
                    professional: 'Профессиональный',
                    fantasy: 'Фантазия'
                }
            }
        },

        // Настройки генерации
        generationSettings: {
            title: 'Настройки генерации',
            description: 'Авто-генерация и опции буфера обмена',
            autoGenerate: {
                label: 'Авто-генерация',
                description: 'Автоматически генерировать пароли'
            },
            copyToClipboard: {
                label: 'Копировать в буфер обмена',
                description: 'Автоматически копировать сгенерированные пароли'
            },
            showStrength: {
                label: 'Показать силу',
                description: 'Показать индикатор силы пароля'
            },
            strengthThreshold: {
                label: 'Порог силы',
                description: 'Минимальная требуемая сила пароля',
                options: {
                    low: 'Низкая',
                    medium: 'Средняя',
                    high: 'Высокая'
                }
            },
            autoRefresh: {
                label: 'Авто-обновление',
                description: 'Автоматически регенерировать слабые пароли'
            }
        },

        // Настройки конфиденциальности
        privacySettings: {
            title: 'Настройки конфиденциальности',
            description: 'Сбор данных и предпочтения обмена',
            saveHistory: {
                label: 'Сохранить историю',
                description: 'Сохранять сгенерированные пароли локально'
            },
            analytics: {
                label: 'Аналитика',
                description: 'Анонимная статистика использования'
            },
            shareUsage: {
                label: 'Поделиться использованием',
                description: 'Делиться данными использования для улучшений'
            },
            exportHistory: {
                label: 'Экспорт истории',
                description: 'Экспорт истории паролей в файл'
            },
            backupSettings: {
                label: 'Резервное копирование настроек',
                description: 'Автоматическое резервное копирование настроек'
            }
        },

        // Pro функции
        proFeatures: {
            title: 'Pro функции',
            description: 'Расширенные настройки и премиум функции',
            securityAudit: {
                label: 'Аудит безопасности',
                description: 'Комплексный анализ безопасности',
                buttonText: 'Выполнить аудит'
            },
            breachCheck: {
                label: 'Проверка утечек',
                description: 'Проверить пароли против известных утечек'
            },
            strengthAnalytics: {
                label: 'Аналитика силы',
                description: 'Расширенный анализ силы пароля'
            }
        }
    },

    // Бухгалтерия и безопасность
    accounting: {
        // Вход и аутентификация
        login: {
            title: 'Войти',
            emailPlaceholder: 'Введите ваш email адрес',
            magicLinkSent: 'Magic ссылка отправлена!',
            magicLinkError: 'Ошибка при отправке magic ссылки',
            verificationSuccess: 'Email успешно подтвержден!',
            verificationError: 'Подверждение email не удалось',
            rateLimitExceeded: 'Слишком много попыток входа. Подождите.',
            sessionExpired: 'Сессия истекла. Войдите снова.'
        },

        // Управление аккаунтом
        account: {
            title: 'Управление аккаунтом',
            profile: 'Профиль',
            settings: 'Настройки',
            logout: 'Выйти',
            logoutSuccess: 'Успешно вышли',
            accountCreated: 'Аккаунт успешно создан',
            accountUpdated: 'Аккаунт успешно обновлен',
            accountError: 'Ошибка управления аккаунтом'
        },

        // События безопасности
        security: {
            loginAttempt: 'Попытка входа',
            loginSuccess: 'Успешный вход',
            loginFailed: 'Вход не удался',
            logout: 'Выход',
            sessionExpired: 'Сессия истекла',
            suspiciousActivity: 'Подозрительная активность',
            verificationSuccess: 'Подтверждение успешно',
            verificationFailed: 'Подтверждение не удалось',
            accountCreated: 'Аккаунт создан',
            accountUpdated: 'Аккаунт обновлен',
            securityAudit: 'Аудит безопасности выполнен'
        },

        // Валидация
        validation: {
            required: 'Это поле обязательно',
            emailInvalid: 'Введите действительный email адрес',
            urlInvalid: 'Введите действительный URL',
            phoneInvalid: 'Введите действительный номер телефона',
            passwordWeak:
                'Пароль должен содержать минимум 8 символов с заглавными, строчными буквами и цифрами',
            minLength: 'Минимальная длина {min} символов',
            maxLength: 'Максимальная длина {max} символов',
            minValue: 'Минимальное значение {min}',
            maxValue: 'Максимальное значение {max}',
            validInput: 'Действительный ввод'
        },

        // Контекстное меню
        contextMenu: {
            exportSettings: 'Экспорт настроек',
            importSettings: 'Импорт настроек',
            resetToDefault: 'Сбросить к умолчанию',
            proMessage:
                '💎 Pro пользователи могут экспортировать и импортировать свои настройки'
        }
    },

    // Модальные окна и уведомления
    modals: {
        success: 'Успех',
        error: 'Ошибка',
        warning: 'Предупреждение',
        info: 'Информация',
        confirm: 'Подтвердить',
        cancel: 'Отмена',
        close: 'Закрыть',
        loading: 'Загрузка...',
        saving: 'Сохранение...',
        exporting: 'Экспорт...',
        importing: 'Импорт...',
        resetting: 'Сброс...',
        closeModal: 'Закрыть модальное окно',
        modalClosesIn: 'Модальное окно закроется через {seconds} секунд',
        modalClosesInSingular:
            'Модальное окно закроется через {seconds} секунду'
    },
    versions: {
        pageTitle: 'История версий',
        pageDescription:
            'Просмотрите историю разработки и changelog Keymoji, генератора паролей эмодзи.',
        currentLabel: 'Текущая',
        backToTop: 'Наверх'
    },

    // Переводы AccountManager
    accountManager: {
        // Заголовки страниц и описания
        pageTitle: 'Управление аккаунтом',
        pageDescription:
            'Управляйте настройками безопасности и предпочтениями аккаунта',
        welcomeBack: 'Добро пожаловать обратно, {name}! 👋',
        welcomeDescription:
            'Готовы создавать потрясающие эмодзи-пароли? Ваш аккаунт безопасен и готов!',
        returnUserTitle: '👋 Добро пожаловать обратно!',
        returnUserDescription:
            'Мы распознали ваш адрес электронной почты. Быстро войдите в систему.',
        verificationTitle: '📧 Проверьте свою электронную почту и подтвердите',
        verificationDescription:
            'Проверьте свою электронную почту {email} и нажмите на волшебную ссылку для завершения настройки',
        verifyingTitle: '🔗 Проверка волшебной ссылки...',
        verifyingDescription: 'Ждем проверки вашего аккаунта.',
        verificationErrorTitle: '❌ Проверка не удалась',
        verificationErrorDescription: 'Произошла ошибка.',

        // Кнопки и действия
        buttons: {
            createMagicLink: 'Отправить код на e-mail',
            loginToAccount: 'Войти в аккаунт',
            checkAccountExists: 'Проверка аккаунта...',
            sendingMagicLink: 'Код отправляется...',
            accountExists: 'Аккаунт найден - Вход...',
            accountNotFound: 'Аккаунт не найден - Создание...',
            sessionExpired: 'Сессия истекла - Повторный вход',
            loginAgain: '🔐 Войти снова',
            createNewAccount: 'Создать новый аккаунт',
            resendMagicLink: '🔄 Отправить новый код',
            backToAccountOptions: '← Назад',
            addProfile: 'Добавить',
            hideProfile: 'Скрыть',
            profileData: 'Данные профиля',
            showFullForm: 'Показать полную форму',
            compactView: 'Компактный вид',
            addName: 'Добавьте своё имя'
        },

        // Метки формы
        emailLabel: 'Электронная почта',
        nameLabel: 'Имя',

        // Действия
        actions: {
            saveSettings: '💾 Сохранить настройки',
            backToHome: '← Вернуться на главную',
            skipAccount: '❌ Пропустить {type}',
            createAccount: '🚀 Создать {type} аккаунт',
            settingsSaved: 'Настройки сохранены!'
        },

        // Статистика
        statistics: {
            storiesGenerated: 'Сгенерированные истории',
            remainingGenerations: 'Оставшиеся генерации',
            noDataTitle: 'Нет данных',
            noDataMessage: 'Создавайте эмодзи, чтобы собирать реальные данные об использовании и отображать их здесь.',
            refreshButton: 'Обновить',
            loading: 'Загрузка...'
        },

        // Ежедневные генерации
        dailyGenerations: 'Ежедневные генерации',

        // Отображение оставшихся генераций
        remainingDisplay: '{remaining} / {limit}',

        // Преимущества
        benefits: {
            free: {
                dailyGenerations: '10 ежедневных безопасных генераций',
                dailyGenerationsDesc:
                    'Технология, устойчивая к ИИ для максимальной безопасности',
                decentralizedData: 'Бесплатный швейцарский ИИ',
                decentralizedDataDesc:
                    'Используйте Apertus, ChatGPT, Gemini, Claude, Mistral и другие - напрямую доступны',
                webApp: 'Доступно как веб-приложение',
                webAppDesc: 'Доступно мгновенно - установка не требуется'
            },
            pro: {
                unlimitedGenerations: 'Неограниченные безопасные генерации',
                unlimitedGenerationsDesc:
                    'Создавайте столько паролей, сколько нужно - без ограничений',
                browserExtension: 'Расширение браузера (Q3 2026)',
                browserExtensionDesc:
                    'Безопасность прямо в вашем браузере - автоматически и везде',
                apiIntegration: 'Интеграция API (Q3 2026)',
                apiIntegrationDesc:
                    'Интегрируйте безопасность бесшовно в ваши приложения'
            }
        },

        // Верификация OTP
        verification: {
            titleNew: 'Код регистрации',
            titleReturn: 'Код для входа',
            sentTo: 'Код отправлен на',
            codeLabel: '7-значный код подтверждения',
            codePlaceholder: '1234567',
            submitCode: '✅ Подтвердить код',
            verifying: 'Проверка...',
            codeError: 'Пожалуйста, введите 7-значный код.',
            codeInvalid: 'Неверный или просроченный код. Запросите новый.'
        },

        // Секция помощи
        help: {
            title: '💡 Нужна помощь?',
            spamFolder: '• Проверьте папку спам, если не видите письмо',
            codeExpiry: '• Код действителен 15 минут',
            magicLinkExpiry: '• Коды истекают через 15 минут',
            requestNewLink: '• Вы можете запросить новый код в любое время',
            noLink: '• Не нужно кликать по ссылке — просто введите код',
            noPassword: '• Пароль не требуется — просто введите код'
        },

        // Подвал
        footer: {
            magicLink: 'Easy Login',
            instantSetup: 'Мгновенная настройка',
            noSpam: 'Без спама',
            text: 'Волшебные ссылки отправляются по электронной почте и действительны 15 минут.',
            privacy: 'Ваши данные обрабатываются безопасно.',
            legal: 'Правовая информация',
            versionHistory: 'История версий'
        },

        // Лимиты и сообщения
        canStillGenerate: 'Вы все еще можете генерировать эмодзи!',
        limitReached:
            'Достигнут дневной лимит. Перейдите на PRO для неограниченных генераций.',

        // Возраст аккаунта
        accountAge: {
            today: '✨ FREE: С сегодня!',
            yesterday: '🚀 FREE: С вчера!',
            days: '🔥 FREE: С {days} дней!',
            weeks: '⚡ FREE: С {weeks} недель{plural}!',
            months: '💪 FREE: С {months} месяцев{plural}!',
            years: '🏆 FREE: С {years} лет{plural}!',
            accountSince: 'Аккаунт с {days} {unit}',
            since: 'с {days} {unit}',
            day: 'день',
            daysLabel: 'дней',
            accountCreated: 'Аккаунт создан',
            createdTodayFree: '✨ Ваш новый FREE аккаунт готов!',
            createdTodayPro: '💎 Добро пожаловать в клуб PRO — эксклюзивно с сегодняшнего дня!',
            createdRecentlyFree: '✨ FREE аккаунт — свежий и готовый!',
            createdRecentlyPro: '💎 PRO аккаунт — эксклюзивный и новый!'
        },

        // Валидация
        validation: {
            emailInvalid: 'Введите действительный адрес электронной почты',
            nameInvalid: 'Введите ваше имя (минимум 2 символа)'
        },

        // Сообщения
        messages: {
            settingsReset: 'Настройки сброшены на значения по умолчанию',
            exportFailed: 'Экспорт настроек не удался',
            settingsExported: 'Настройки экспортированы',
            settingsImported: 'Настройки успешно импортированы',
            importFailed: 'Ошибка импорта',
            freeAccountActivated: 'Бесплатный аккаунт активирован!',
            chartLoadFailed: 'Не удалось загрузить данные графика',
            accountFoundSendingCode: 'Аккаунт найден! Отправляю код.',
            accountFoundSendingLink: 'Аккаунт найден! Отправляю код.',
            creatingNewAccount: 'Создание нового аккаунта — проверьте email для получения кода.',
            magicLinkSendFailed: 'Не удалось отправить код. Попробуйте снова.',
            otpVerified: 'Код подтверждён — вы вошли в систему!',
            magicLinkVerified: 'Код успешно проверен!',
            magicLinkVerificationFailed: 'Проверка кода не удалась',
            chartDataRefreshed: 'Данные графика обновлены!',
            refreshFailed: 'Не удалось обновить данные',
            noNewData: 'Новых данных нет'
        },

        // Apertus Info
        apertusInfo: '🇨🇭 Бесплатный швейцарский ИИ, встроен. Apertus — open-source LLM от EPFL & ETH Zurich. Ваши данные остаются в Швейцарии. API-ключ не нужен.',
        apiKeyLabel: 'API-ключ',
        apiKeyLabelApertus: 'Токен Hugging Face',
        apiKeyLabelCustom: 'Пользовательский API-ключ',
        optional: 'необязательно',
        verified: 'Подтверждено',
        testBtn: 'Тест',
        apertusBuiltIn: 'Встроенный токен активен — работает без ключа.',
        apertusOwnToken: 'Необязательно: введите собственный токен Hugging Face (hf_…) для использования личной квоты.',
        apertusGetToken: 'Получить бесплатный токен HF',
        openaiHint: 'Требуется платный API-ключ OpenAI (sk-…).',
        geminiHint: 'Доступен бесплатный уровень. Получите ключ в Google AI Studio.',
        claudeHint: 'Требуется API-ключ Anthropic (sk-ant-…).',
        mistralHint: 'Европейский AI. Получите ключ на console.mistral.ai.',
        customHint: 'OpenAI-совместимый endpoint. Введите базовый URL и API-ключ ниже.',
        getApiKey: 'Получить API-ключ',
        savedKeys: 'Сохранено',

        // Секция обновления
        upgrade: {
            upgradeToPro: 'Перейти на Pro',
            upgradeToProForFeatures: 'Перейдите на Pro для расширенных функций',
            unlimitedGenerations:
                'Неограниченные генерации и расширенные функции безопасности'
        },

        // Контекстное меню
        contextMenu: {
            exportSettings: 'Экспорт настроек',
            importSettings: 'Импорт настроек',
            resetToDefault: 'Сбросить на значения по умолчанию',
            logout: 'Выйти',
            settingsMenu: 'Меню настроек'
        },

        // Функции
        features: {
            proFeature: 'Функция Pro'
        },

        // Модальное окно функции Pro
        proFeatureModal: {
            title: 'Функция Pro',
            proBenefits: 'Преимущества Pro:',
            unlimitedGenerations: 'Неограниченные генерации эмодзи',
            advancedSecurity: 'Расширенные функции безопасности',
            prioritySupport: 'Приоритетная поддержка',
            earlyAccess: 'Ранний доступ к новым функциям',
            maybeLater: 'Может быть позже',
            upgradeToPro: 'Перейти на Pro',
            // Специфично для обновления Pro
            proUpgrade: 'Обновление Pro',
            unlockAdvancedFeatures:
                'Разблокируйте все расширенные функции и настройки',
            upgradeProNow: '💎 Перейти на Pro сейчас'
        },

        // Уровни аккаунта
        tiers: {
            free: 'БЕСПЛАТНО',
            pro: 'PRO',
            freeAccount: 'Бесплатный аккаунт',
            proAccount: 'Аккаунт Pro'
        },

        // Значки
        freeBadge: '✨ БЕСПЛАТНО',
        proBadge: '💎 PRO',

        // Демо-график (при отсутствии данных)
        demoChart: {
            title: 'Нет данных',
            description: 'Генерируй emoji, чтобы собирать свои реальные данные об использовании и отображать их здесь.',
            cta: 'Создать Keymoji'
        },

        // Описания
        freeDescription: '✨ Бесплатная безопасность',
        proDescription: '💎 Корпоративная безопасность'
    },


    consent: {
        title: 'Настройки конфиденциальности',
        description: 'Мы используем минимальные данные для улучшения вашего опыта.',
        analytics: 'Анонимная аналитика использования',
        analyticsHint: 'Помогает улучшить приложение — без личных данных',
        saveHistory: 'Сохранять локальную историю',
        saveHistoryHint: 'Хранится только в вашем браузере',
        accept: 'Сохранить мой выбор',
        acceptAll: 'Принять всё',
        decline: 'Отклонить необязательные',
        moreInfo: 'Политика конфиденциальности',
        legalInfo: 'Правовая информация',
        privacy: 'Конфиденциальность',
        necessaryTitle: 'Строго необходимо',
        necessaryHint: 'Требуется для работы — всегда активно',
        necessaryStorage: 'Настройки и предпочтения темы (localStorage)',
        necessarySession: 'Сессия входа (только память браузера)',
        necessaryOtp: 'OTP-код для аутентификации (отправляется однократно по email)',
        historyDetail: 'Данные диаграммы использования (генерации в день)',
        historyScope: 'Никогда не отправляется на сервер — только в вашем браузере',
        analyticsDetail: 'Анонимные счётчики страниц (IP анонимизирован до x.x.x.0)',
        analyticsProcessor: 'Обрабатывается через нашу n8n-инстанцию на DigitalOcean (EU)'
    },

    ui: {
        save: 'Сохранить',
        cancel: 'Отмена',
        reset: 'Сбросить',
        export: 'Экспорт',
        import: 'Импорт',
        delete: 'Удалить',
        edit: 'Редактировать',
        add: 'Добавить',
        remove: 'Удалить',
        search: 'Поиск',
        filter: 'Фильтр',
        sort: 'Сортировка',
        refresh: 'Обновить',
        back: 'Назад',
        next: 'Далее',
        previous: 'Предыдущий',
        submit: 'Отправить',
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успех',
        warning: 'Предупреждение',
        info: 'Информация'
    },

    // Форма обратной связи (оптимизировано)
    contactForm: {
        pageTitle: 'Привет, я Кристофер',
        pageDescription:
            'Фронтенд-разработчик, люблю создавать удобные сайты на TypeScript, JavaScript, PHP и HTML. Не стесняйтесь написать мне сообщение!',
        nameLabel: '🧑🏻 Ваше имя',
        emailLabel: 'Ваш e-mail',
        messageLabel: '✍🏻 Сообщение',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Отправить',
        sendingButton: '📨 Отправка...',
        successMessage: 'Успех, сообщение отправлено - Ответ: < 24ч 🚀',
        errorMessage: 'Произошла непредвиденная ошибка 😟',
        requestErrorMessage:
            'Ошибка при отправке сообщения, попробуйте еще раз 🙁',
        smirkingFaceImageAlt: 'keymoji emoji улыбающееся лицо 1f60f',
        introductionTitle: 'Есть вопрос или интересное предложение?',
        introductionText: 'Не стесняйтесь написать мне!',
        privacyNotice:
            'Ваши данные в надежных руках 🤲. Мы не передаем ваши данные третьим лицам 🔒.',
        newsletterLabel: 'Да, я хочу подписаться на рассылку',
        backToMainButton: 'Назад на главную',
        footerText: 'Сделано с любовью',
        validationErrorMessage:
            'Пожалуйста, исправьте ошибки в форме перед отправкой 🔍',
        sendingMessage: 'Отправка сообщения... 📨',
        emailText: {
            greeting: 'Добро пожаловать',
            confirmationText:
                'Пожалуйста, подтвердите свой запрос, чтобы Кристофер знал, что вы не бот. Вы отправили сообщение со следующими данными:',
            doubleCheck: 'Мы получили ваше сообщение со следующими деталями:',
            button: 'Подтвердить e-mail'
        },
        validation: {
            nameRequired: 'Имя обязательно',
            nameLength: 'Минимум 2 символа',
            emailRequired: 'E-mail обязателен',
            emailInvalid: 'Неверный e-mail',
            messageRequired: 'Сообщение обязательно',
            messageLength: 'Минимум {min} символов'
        }
    }
};
