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
            '🔑 Пароли переосмыслены. 🎯 Неподдающиеся взлому пароли эмодзи. 🌈 Бесплатно. Безопасно. Инновационно. 🤖 Технология, устойчивая к ИИ. 🌍 Доступно на 15+ языках.',
        pageKeywords:
            'Keymoji, пароль эмодзи, генератор паролей, безопасность, онлайн безопасность',
        pageInstruction: [
            'Выберите свой ИИ и создайте свою историю Keymoji',
            '"Случайный" говорит сам за себя 😜.',
            'После генерации копируется в буфер обмена! 📋'
        ],
        setupStoryMode: 'Используйте свой ИИ',
        setupStoryModeShort: 'Используйте свой ИИ',
        setupStoryModeSwiss: 'Использовать швейцарский ИИ',
        setupStoryModeSwissShort: 'Швейцарский ИИ',
        setupStoryModeOr: 'или',
        setupStoryModeBannerCta: '— Создай свою историю Keymoji',
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
        contactButton: 'Связаться с нами'
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
            'Просмотрите историю разработки и changelog Keymoji, генератора паролей эмодзи.'
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
            createMagicLink: 'Создать волшебную ссылку',
            loginToAccount: 'Войти в аккаунт',
            checkAccountExists: 'Проверка аккаунта...',
            sendingMagicLink: 'Отправка волшебной ссылки...',
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
            compactView: 'Компактный вид'
        },

        // Метки формы
        emailLabel: 'Электронная почта',
        nameLabel: 'Имя',

        // Действия
        actions: {
            saveSettings: '💾 Сохранить настройки',
            backToHome: '🏠 Вернуться на главную',
            skipAccount: '❌ Пропустить {type}',
            createAccount: '🚀 Создать {type} аккаунт',
            settingsSaved: 'Настройки сохранены!'
        },

        // Статистика
        statistics: {
            storiesGenerated: 'Сгенерированные истории',
            remainingGenerations: 'Оставшиеся генерации'
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
                browserExtension: 'Расширение браузера (Q4 2025)',
                browserExtensionDesc:
                    'Безопасность прямо в вашем браузере - автоматически и везде',
                apiIntegration: 'Интеграция API (Q4 2025)',
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
            magicLink: 'Волшебная ссылка',
            instantSetup: 'Мгновенная настройка',
            noSpam: 'Без спама',
            text: 'Волшебные ссылки отправляются по электронной почте и действительны 15 минут.',
            privacy: 'Ваши данные обрабатываются безопасно.'
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
            accountCreated: 'Аккаунт создан'
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
            freeAccountActivated: 'Бесплатный аккаунт активирован!'
        },

        // Apertus Info
        apertusInfo:
            'Эксклюзивно на Keymoji: Apertus – швейцарский LLM. Впервые доступен для пользователей. Размещен на HuggingFace, доставляется через workflow n8n.',

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

        // Описания
        freeDescription: '✨ Бесплатная безопасность',
        proDescription: '💎 Корпоративная безопасность'
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
