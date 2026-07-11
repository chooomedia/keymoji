export type ExtensionLanguage =
    | 'en'
    | 'de'
    | 'de-CH'
    | 'es'
    | 'nl'
    | 'it'
    | 'fr'
    | 'pl'
    | 'ru'
    | 'tr'
    | 'af'
    | 'ja'
    | 'ko'
    | 'tlh'
    | 'sjn';

export interface ExtensionTranslations {
    title: string;
    generatedLabel: string;
    level: string;
    generate: string;
    copy: string;
    askOnPasswordFields: string;
    copyOnInsert: string;
    donate: string;
    openWebapp: string;
    statusCreated: (level: number) => string;
    statusCopied: string;
    statusCopyUnavailable: string;
    statusPromptEnabled: string;
    statusPromptDisabled: string;
    statusCopyEnabled: string;
    statusCopyDisabled: string;
    statusSettingError: string;
    statusPopupError: string;
    promptLabel: string;
    promptButton: string;
    promptInserted: string;
    promptAriaLabel: string;
}

const translations: Record<ExtensionLanguage, ExtensionTranslations> = {
    en: {
        title: 'Create emoji password',
        generatedLabel: 'Generated Keymoji',
        level: 'Level',
        generate: 'Generate',
        copy: 'Copy',
        askOnPasswordFields: 'Ask on password fields',
        copyOnInsert: 'Copy when inserting',
        donate: 'Buy me a coffee',
        openWebapp: 'Open web app',
        statusCreated: level => `Level ${level} created`,
        statusCopied: 'Copied',
        statusCopyUnavailable: 'Clipboard unavailable',
        statusPromptEnabled: 'Prompt enabled',
        statusPromptDisabled: 'Prompt paused',
        statusCopyEnabled: 'Insert also copies',
        statusCopyDisabled: 'Insert without clipboard',
        statusSettingError: 'Setting could not be saved',
        statusPopupError: 'Popup could not initialize',
        promptLabel: 'Create Keymoji?',
        promptButton: 'Insert',
        promptInserted: 'Inserted',
        promptAriaLabel: 'Keymoji password generator'
    },
    de: {
        title: 'Emoji-Passwort erstellen',
        generatedLabel: 'Generiertes Keymoji',
        level: 'Level',
        generate: 'Neu erstellen',
        copy: 'Kopieren',
        askOnPasswordFields: 'Bei Passwortfeldern fragen',
        copyOnInsert: 'Beim Einsetzen zusätzlich kopieren',
        donate: 'Auf Ko-fi unterstützen',
        openWebapp: 'Webapp öffnen',
        statusCreated: level => `Level ${level} erstellt`,
        statusCopied: 'Kopiert',
        statusCopyUnavailable: 'Clipboard nicht verfügbar',
        statusPromptEnabled: 'Prompt aktiv',
        statusPromptDisabled: 'Prompt pausiert',
        statusCopyEnabled: 'Einsetzen kopiert zusätzlich',
        statusCopyDisabled: 'Einsetzen ohne Clipboard',
        statusSettingError: 'Einstellung konnte nicht gespeichert werden',
        statusPopupError: 'Popup konnte nicht initialisiert werden',
        promptLabel: 'Keymoji erstellen?',
        promptButton: 'Einsetzen',
        promptInserted: 'Eingesetzt',
        promptAriaLabel: 'Keymoji Passwortgenerator'
    },
    'de-CH': {
        title: 'Emoji-Passwort erstelle',
        generatedLabel: 'Generierts Keymoji',
        level: 'Level',
        generate: 'Neu erstelle',
        copy: 'Kopiere',
        askOnPasswordFields: 'Bi Passwortfelder fröge',
        copyOnInsert: 'Bim Iisetze au kopiere',
        donate: 'Uf Ko-fi unterstütze',
        openWebapp: 'Webapp öffne',
        statusCreated: level => `Level ${level} erstellt`,
        statusCopied: 'Kopiert',
        statusCopyUnavailable: 'Clipboard nöd verfügbar',
        statusPromptEnabled: 'Prompt aktiv',
        statusPromptDisabled: 'Prompt pausiert',
        statusCopyEnabled: 'Iisetze kopiert au',
        statusCopyDisabled: 'Iisetze ohni Clipboard',
        statusSettingError: 'Iistellig het nöd chönne gspeicheret werde',
        statusPopupError: 'Popup het nöd chönne starte',
        promptLabel: 'Keymoji erstelle?',
        promptButton: 'Iisetze',
        promptInserted: 'Iigsetzt',
        promptAriaLabel: 'Keymoji Passwortgenerator'
    },
    es: {
        title: 'Crear contraseña emoji',
        generatedLabel: 'Keymoji generado',
        level: 'Nivel',
        generate: 'Generar',
        copy: 'Copiar',
        askOnPasswordFields: 'Preguntar en campos de contraseña',
        copyOnInsert: 'Copiar al insertar',
        donate: 'Apoyar en Ko-fi',
        openWebapp: 'Abrir webapp',
        statusCreated: level => `Nivel ${level} creado`,
        statusCopied: 'Copiado',
        statusCopyUnavailable: 'Portapapeles no disponible',
        statusPromptEnabled: 'Aviso activo',
        statusPromptDisabled: 'Aviso pausado',
        statusCopyEnabled: 'Insertar también copia',
        statusCopyDisabled: 'Insertar sin portapapeles',
        statusSettingError: 'No se pudo guardar la configuración',
        statusPopupError: 'No se pudo iniciar el popup',
        promptLabel: '¿Crear Keymoji?',
        promptButton: 'Insertar',
        promptInserted: 'Insertado',
        promptAriaLabel: 'Generador de contraseñas Keymoji'
    },
    nl: {
        title: 'Emoji-wachtwoord maken',
        generatedLabel: 'Gegenereerde Keymoji',
        level: 'Niveau',
        generate: 'Genereren',
        copy: 'Kopiëren',
        askOnPasswordFields: 'Vragen bij wachtwoordvelden',
        copyOnInsert: 'Kopiëren bij invoegen',
        donate: 'Steunen op Ko-fi',
        openWebapp: 'Webapp openen',
        statusCreated: level => `Niveau ${level} gemaakt`,
        statusCopied: 'Gekopieerd',
        statusCopyUnavailable: 'Klembord niet beschikbaar',
        statusPromptEnabled: 'Prompt actief',
        statusPromptDisabled: 'Prompt gepauzeerd',
        statusCopyEnabled: 'Invoegen kopieert ook',
        statusCopyDisabled: 'Invoegen zonder klembord',
        statusSettingError: 'Instelling kon niet worden opgeslagen',
        statusPopupError: 'Popup kon niet starten',
        promptLabel: 'Keymoji maken?',
        promptButton: 'Invoegen',
        promptInserted: 'Ingevoegd',
        promptAriaLabel: 'Keymoji wachtwoordgenerator'
    },
    it: {
        title: 'Crea password emoji',
        generatedLabel: 'Keymoji generato',
        level: 'Livello',
        generate: 'Genera',
        copy: 'Copia',
        askOnPasswordFields: 'Chiedi nei campi password',
        copyOnInsert: 'Copia quando inserisci',
        donate: 'Sostieni su Ko-fi',
        openWebapp: 'Apri webapp',
        statusCreated: level => `Livello ${level} creato`,
        statusCopied: 'Copiato',
        statusCopyUnavailable: 'Appunti non disponibili',
        statusPromptEnabled: 'Prompt attivo',
        statusPromptDisabled: 'Prompt in pausa',
        statusCopyEnabled: 'Inserimento copia anche',
        statusCopyDisabled: 'Inserimento senza appunti',
        statusSettingError: 'Impostazione non salvata',
        statusPopupError: 'Popup non inizializzato',
        promptLabel: 'Creare Keymoji?',
        promptButton: 'Inserisci',
        promptInserted: 'Inserito',
        promptAriaLabel: 'Generatore password Keymoji'
    },
    fr: {
        title: 'Créer un mot de passe emoji',
        generatedLabel: 'Keymoji généré',
        level: 'Niveau',
        generate: 'Générer',
        copy: 'Copier',
        askOnPasswordFields: 'Demander sur les champs mot de passe',
        copyOnInsert: "Copier lors de l'insertion",
        donate: 'Soutenir sur Ko-fi',
        openWebapp: 'Ouvrir la webapp',
        statusCreated: level => `Niveau ${level} créé`,
        statusCopied: 'Copié',
        statusCopyUnavailable: 'Presse-papiers indisponible',
        statusPromptEnabled: 'Invite active',
        statusPromptDisabled: 'Invite en pause',
        statusCopyEnabled: "L'insertion copie aussi",
        statusCopyDisabled: 'Insertion sans presse-papiers',
        statusSettingError: "Le réglage n'a pas été enregistré",
        statusPopupError: "Le popup n'a pas pu démarrer",
        promptLabel: 'Créer un Keymoji ?',
        promptButton: 'Insérer',
        promptInserted: 'Inséré',
        promptAriaLabel: 'Générateur de mot de passe Keymoji'
    },
    pl: {
        title: 'Utwórz hasło emoji',
        generatedLabel: 'Wygenerowany Keymoji',
        level: 'Poziom',
        generate: 'Generuj',
        copy: 'Kopiuj',
        askOnPasswordFields: 'Pytaj przy polach hasła',
        copyOnInsert: 'Kopiuj przy wstawianiu',
        donate: 'Wesprzyj na Ko-fi',
        openWebapp: 'Otwórz aplikację',
        statusCreated: level => `Poziom ${level} utworzony`,
        statusCopied: 'Skopiowano',
        statusCopyUnavailable: 'Schowek niedostępny',
        statusPromptEnabled: 'Podpowiedź aktywna',
        statusPromptDisabled: 'Podpowiedź wstrzymana',
        statusCopyEnabled: 'Wstawianie też kopiuje',
        statusCopyDisabled: 'Wstawianie bez schowka',
        statusSettingError: 'Nie zapisano ustawienia',
        statusPopupError: 'Nie uruchomiono popupu',
        promptLabel: 'Utworzyć Keymoji?',
        promptButton: 'Wstaw',
        promptInserted: 'Wstawiono',
        promptAriaLabel: 'Generator haseł Keymoji'
    },
    ru: {
        title: 'Создать emoji-пароль',
        generatedLabel: 'Созданный Keymoji',
        level: 'Уровень',
        generate: 'Создать',
        copy: 'Копировать',
        askOnPasswordFields: 'Спрашивать в полях пароля',
        copyOnInsert: 'Копировать при вставке',
        donate: 'Поддержать на Ko-fi',
        openWebapp: 'Открыть веб-приложение',
        statusCreated: level => `Уровень ${level} создан`,
        statusCopied: 'Скопировано',
        statusCopyUnavailable: 'Буфер недоступен',
        statusPromptEnabled: 'Подсказка активна',
        statusPromptDisabled: 'Подсказка выключена',
        statusCopyEnabled: 'Вставка также копирует',
        statusCopyDisabled: 'Вставка без буфера',
        statusSettingError: 'Настройка не сохранена',
        statusPopupError: 'Popup не запущен',
        promptLabel: 'Создать Keymoji?',
        promptButton: 'Вставить',
        promptInserted: 'Вставлено',
        promptAriaLabel: 'Генератор паролей Keymoji'
    },
    tr: {
        title: 'Emoji parola oluştur',
        generatedLabel: 'Oluşturulan Keymoji',
        level: 'Seviye',
        generate: 'Oluştur',
        copy: 'Kopyala',
        askOnPasswordFields: 'Parola alanlarında sor',
        copyOnInsert: 'Eklerken kopyala',
        donate: "Ko-fi'de destekle",
        openWebapp: 'Web uygulamasını aç',
        statusCreated: level => `Seviye ${level} oluşturuldu`,
        statusCopied: 'Kopyalandı',
        statusCopyUnavailable: 'Pano kullanılamıyor',
        statusPromptEnabled: 'İstem aktif',
        statusPromptDisabled: 'İstem duraklatıldı',
        statusCopyEnabled: 'Ekleme ayrıca kopyalar',
        statusCopyDisabled: 'Panosuz ekleme',
        statusSettingError: 'Ayar kaydedilemedi',
        statusPopupError: 'Popup başlatılamadı',
        promptLabel: 'Keymoji oluştur?',
        promptButton: 'Ekle',
        promptInserted: 'Eklendi',
        promptAriaLabel: 'Keymoji parola oluşturucu'
    },
    af: {
        title: 'Skep emoji-wagwoord',
        generatedLabel: 'Gegenereerde Keymoji',
        level: 'Vlak',
        generate: 'Genereer',
        copy: 'Kopieer',
        askOnPasswordFields: 'Vra by wagwoordvelde',
        copyOnInsert: 'Kopieer wanneer ingevoeg',
        donate: 'Ondersteun op Ko-fi',
        openWebapp: 'Maak webapp oop',
        statusCreated: level => `Vlak ${level} geskep`,
        statusCopied: 'Gekopieer',
        statusCopyUnavailable: 'Knipbord nie beskikbaar nie',
        statusPromptEnabled: 'Prompt aktief',
        statusPromptDisabled: 'Prompt gepouseer',
        statusCopyEnabled: 'Invoeg kopieer ook',
        statusCopyDisabled: 'Invoeg sonder knipbord',
        statusSettingError: 'Instelling kon nie gestoor word nie',
        statusPopupError: 'Popup kon nie begin nie',
        promptLabel: 'Skep Keymoji?',
        promptButton: 'Voeg in',
        promptInserted: 'Ingevoeg',
        promptAriaLabel: 'Keymoji wagwoordgenerator'
    },
    ja: {
        title: '絵文字パスワードを作成',
        generatedLabel: '生成されたKeymoji',
        level: 'レベル',
        generate: '生成',
        copy: 'コピー',
        askOnPasswordFields: 'パスワード欄で確認する',
        copyOnInsert: '挿入時にコピー',
        donate: 'Ko-fiで応援',
        openWebapp: 'Webアプリを開く',
        statusCreated: level => `レベル${level}を生成`,
        statusCopied: 'コピーしました',
        statusCopyUnavailable: 'クリップボード不可',
        statusPromptEnabled: '確認表示オン',
        statusPromptDisabled: '確認表示オフ',
        statusCopyEnabled: '挿入時にもコピー',
        statusCopyDisabled: 'コピーせず挿入',
        statusSettingError: '設定を保存できません',
        statusPopupError: 'ポップアップを開始できません',
        promptLabel: 'Keymojiを作成？',
        promptButton: '挿入',
        promptInserted: '挿入済み',
        promptAriaLabel: 'Keymojiパスワード生成'
    },
    ko: {
        title: '이모지 비밀번호 만들기',
        generatedLabel: '생성된 Keymoji',
        level: '레벨',
        generate: '생성',
        copy: '복사',
        askOnPasswordFields: '비밀번호 필드에서 묻기',
        copyOnInsert: '삽입할 때 복사',
        donate: 'Ko-fi에서 후원',
        openWebapp: '웹앱 열기',
        statusCreated: level => `레벨 ${level} 생성됨`,
        statusCopied: '복사됨',
        statusCopyUnavailable: '클립보드 사용 불가',
        statusPromptEnabled: '프롬프트 활성',
        statusPromptDisabled: '프롬프트 중지',
        statusCopyEnabled: '삽입 시 함께 복사',
        statusCopyDisabled: '클립보드 없이 삽입',
        statusSettingError: '설정을 저장할 수 없음',
        statusPopupError: '팝업을 시작할 수 없음',
        promptLabel: 'Keymoji 만들기?',
        promptButton: '삽입',
        promptInserted: '삽입됨',
        promptAriaLabel: 'Keymoji 비밀번호 생성기'
    },
    tlh: {
        title: 'emoji mu\' pegh chenmoH',
        generatedLabel: 'Keymoji chenmoHlu\'bogh',
        level: 'patlh',
        generate: 'chenmoH',
        copy: 'woDHa\'',
        askOnPasswordFields: 'mu\' pegh DaqDaq ghel',
        copyOnInsert: 'lanDI\' woDHa\'',
        donate: "Ko-fiDaq Qutlh",
        openWebapp: 'Webapp poSmoH',
        statusCreated: level => `patlh ${level} chenmoHlu'`,
        statusCopied: 'woDHa\'lu\'',
        statusCopyUnavailable: 'clipboard lupoQlaHbe\'',
        statusPromptEnabled: 'ghelwI\' chu\'',
        statusPromptDisabled: 'ghelwI\' mev',
        statusCopyEnabled: 'lanDI\' woDHa\' je',
        statusCopyDisabled: 'clipboard Hutlhbogh lan',
        statusSettingError: 'DuH polbe\'lu\'',
        statusPopupError: 'popup taghbe\'',
        promptLabel: 'Keymoji chenmoH?',
        promptButton: 'lan',
        promptInserted: 'lanlu\'',
        promptAriaLabel: 'Keymoji mu\' pegh chenmoHwI\''
    },
    sjn: {
        title: 'Create emoji password',
        generatedLabel: 'Generated Keymoji',
        level: 'Level',
        generate: 'Generate',
        copy: 'Copy',
        askOnPasswordFields: 'Ask on password fields',
        copyOnInsert: 'Copy when inserting',
        donate: 'Buy me a coffee',
        openWebapp: 'Open web app',
        statusCreated: level => `Level ${level} created`,
        statusCopied: 'Copied',
        statusCopyUnavailable: 'Clipboard unavailable',
        statusPromptEnabled: 'Prompt enabled',
        statusPromptDisabled: 'Prompt paused',
        statusCopyEnabled: 'Insert also copies',
        statusCopyDisabled: 'Insert without clipboard',
        statusSettingError: 'Setting could not be saved',
        statusPopupError: 'Popup could not initialize',
        promptLabel: 'Create Keymoji?',
        promptButton: 'Insert',
        promptInserted: 'Inserted',
        promptAriaLabel: 'Keymoji password generator'
    }
};

const localeMap: Record<string, ExtensionLanguage> = {
    'de-CH': 'de-CH',
    'de-LI': 'de-CH',
    'de-AT': 'de',
    'en-US': 'en',
    'en-GB': 'en',
    'es-ES': 'es',
    'es-MX': 'es',
    'nl-BE': 'nl',
    'fr-BE': 'fr',
    'fr-CA': 'fr',
    'it-IT': 'it',
    'pl-PL': 'pl',
    'ru-RU': 'ru',
    'tr-TR': 'tr',
    'af-ZA': 'af',
    'ja-JP': 'ja',
    'ko-KR': 'ko'
};

function isExtensionLanguage(language: string): language is ExtensionLanguage {
    return language in translations;
}

export function getExtensionLanguage(): ExtensionLanguage {
    const browserLanguages =
        typeof navigator !== 'undefined'
            ? navigator.languages?.length
                ? navigator.languages
                : [navigator.language]
            : ['en'];

    for (const browserLanguage of browserLanguages) {
        if (!browserLanguage) {
            continue;
        }

        const mappedLanguage = localeMap[browserLanguage];
        if (mappedLanguage) {
            return mappedLanguage;
        }

        if (isExtensionLanguage(browserLanguage)) {
            return browserLanguage;
        }

        const baseLanguage = browserLanguage.split('-')[0];
        if (isExtensionLanguage(baseLanguage)) {
            return baseLanguage;
        }
    }

    return 'en';
}

export function getExtensionTranslations(): ExtensionTranslations {
    return translations[getExtensionLanguage()];
}
