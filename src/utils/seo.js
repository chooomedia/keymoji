/**
 * Centralized SEO utilities
 * - Consistent meta tag management
 * - Structured data generation
 * - Canonical URL handling
 * - Social media optimization
 */

import { updatedTime } from './timestamp.js';
import { appVersion } from './version.js';

/**
 * Default SEO configuration
 */
export const DEFAULT_SEO = {
    title: 'Keymoji - Emoji Password Generator',
    description:
        'Generate secure, AI-resistant emoji passwords. Create memorable passwords with emojis in 15+ languages.',
    keywords:
        'emoji password, password generator, secure passwords, AI resistant, keymoji',
    image: '/images/keymoji-social-media-banner-10-2024-min.png',
    type: 'website',
    noindex: false,
    canonical: '',
    pageType: 'home'
};

/**
 * Format canonical URL
 * @param {string} url - URL to format
 * @returns {string} Formatted canonical URL
 */
export function formatCanonicalUrl(url) {
    if (!url) return '';

    let canonical = url.startsWith('http') ? url : `https://keymoji.wtf${url}`;

    // Add trailing slash for directories
    if (
        canonical &&
        !canonical.endsWith('/') &&
        !canonical.includes('.') &&
        !canonical.includes('?')
    ) {
        canonical = `${canonical}/`;
    }

    return canonical;
}

/**
 * Get full image URL for social sharing
 * @param {string} image - Image path
 * @returns {string} Full image URL
 */
export function getFullImageUrl(image) {
    return image.startsWith('http') ? image : `https://keymoji.wtf${image}`;
}

/**
 * Generate structured data based on page type
 * @param {object} seoData - SEO data
 * @param {string} currentLanguage - Current language
 * @returns {object} Structured data
 */
export function generateStructuredData(seoData, currentLanguage) {
    const { pageType, title, description, canonical, image } = seoData;

    const baseStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Keymoji',
        url: canonical,
        inLanguage: currentLanguage,
        dateModified: updatedTime,
        author: {
            '@type': 'Person',
            name: 'Christopher Matt',
            url: 'https://www.linkedin.com/in/chooomedia/'
        }
    };

    if (pageType === 'home' || pageType === 'index') {
        return {
            ...baseStructuredData,
            description: description,
            applicationCategory: 'SecurityApplication',
            operatingSystem: 'Web Browser',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
            },
            screenshot: getFullImageUrl(image),
            featureList: [
                'AI-resistant password generation',
                '15+ language support',
                'Dark mode',
                'PWA support'
            ],
            softwareVersion: appVersion
        };
    } else if (pageType === 'blog') {
        return {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: title,
            description: description,
            url: canonical,
            inLanguage: currentLanguage,
            dateModified: updatedTime,
            author: baseStructuredData.author
        };
    } else if (pageType === 'versions') {
        return {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Keymoji',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
            },
            softwareVersion: appVersion
        };
    }

    return baseStructuredData;
}

/**
 * Generate alternate URLs for each language
 * @param {string} url - Current URL
 * @returns {Array} Array of alternate URLs
 */
export function generateAlternateUrls(url) {
    const supportedLanguages = [
        'en',
        'de',
        'dech',
        'es',
        'nl',
        'it',
        'fr',
        'pl',
        'ru',
        'tr',
        'af',
        'ja',
        'ko',
        'tlh',
        'sjn'
    ];

    return supportedLanguages.map(lang => {
        // Remove any existing language codes from URL
        let cleanUrl = url;
        const pathSegments = url.split('/').filter(segment => segment !== '');
        const nonLanguageSegments = pathSegments.filter(
            segment => !supportedLanguages.includes(segment)
        );
        cleanUrl =
            nonLanguageSegments.length > 0
                ? '/' + nonLanguageSegments.join('/')
                : '';

        const langPath = `/${lang}${cleanUrl}`;
        return {
            lang,
            url: `https://keymoji.wtf${langPath}`
        };
    });
}

/**
 * Get locale string from language code
 * @param {string} lang - Language code
 * @returns {string} Locale string
 */
export function getLocale(lang) {
    const localeMap = {
        en: 'en_US',
        de: 'de_DE',
        dech: 'de_CH',
        es: 'es_ES',
        nl: 'nl_NL',
        it: 'it_IT',
        fr: 'fr_FR',
        pl: 'pl_PL',
        ru: 'ru_RU',
        tr: 'tr_TR',
        af: 'af_ZA',
        ja: 'ja_JP',
        ko: 'ko_KR',
        tlh: 'tlh',
        sjn: 'sjn'
    };
    return localeMap[lang] || 'en_US';
}

/**
 * Get page title based on page type and language
 * @param {string} pageType - Type of page
 * @param {string} currentLanguage - Current language
 * @returns {string} Page title
 */
export function getPageTitle(pageType, currentLanguage = 'en') {
    const titles = {
        home: {
            en: 'Keymoji - Emoji Password Generator',
            de: 'Keymoji - Emoji Passwort Generator',
            dech: 'Keymoji - Emoji Passwort Generator',
            es: 'Keymoji - Generador de Contraseñas con Emojis',
            nl: 'Keymoji - Emoji Wachtwoord Generator',
            it: 'Keymoji - Generatore di Password Emoji',
            fr: 'Keymoji - Générateur de Mots de Passe Emoji',
            pl: 'Keymoji - Generator Haseł Emoji',
            ru: 'Keymoji - Генератор Паролей с Эмодзи',
            tr: 'Keymoji - Emoji Şifre Oluşturucu',
            af: 'Keymoji - Emoji Wagwoord Generator',
            ja: 'Keymoji - 絵文字パスワードジェネレーター',
            ko: 'Keymoji - 이모지 비밀번호 생성기',
            tlh: 'Keymoji - Emoji Password Generator',
            sjn: 'Keymoji - Emoji Password Generator'
        },
        contact: {
            en: 'Contact - Keymoji',
            de: 'Kontakt - Keymoji',
            dech: 'Kontakt - Keymoji',
            es: 'Contacto - Keymoji',
            nl: 'Contact - Keymoji',
            it: 'Contatto - Keymoji',
            fr: 'Contact - Keymoji',
            pl: 'Kontakt - Keymoji',
            ru: 'Контакты - Keymoji',
            tr: 'İletişim - Keymoji',
            af: 'Kontak - Keymoji',
            ja: 'お問い合わせ - Keymoji',
            ko: '연락처 - Keymoji',
            tlh: 'Contact - Keymoji',
            sjn: 'Contact - Keymoji'
        },
        versions: {
            en: 'Version History - Keymoji',
            de: 'Versionsverlauf - Keymoji',
            dech: 'Versionsverlauf - Keymoji',
            es: 'Historial de Versiones - Keymoji',
            nl: 'Versiegeschiedenis - Keymoji',
            it: 'Cronologia Versioni - Keymoji',
            fr: 'Historique des Versions - Keymoji',
            pl: 'Historia Wersji - Keymoji',
            ru: 'История Версий - Keymoji',
            tr: 'Sürüm Geçmişi - Keymoji',
            af: 'Weergawe Geskiedenis - Keymoji',
            ja: 'バージョン履歴 - Keymoji',
            ko: '버전 기록 - Keymoji',
            tlh: 'Version History - Keymoji',
            sjn: 'Version History - Keymoji'
        },
        blog: {
            en: 'Blog - Keymoji',
            de: 'Blog - Keymoji',
            dech: 'Blog - Keymoji',
            es: 'Blog - Keymoji',
            nl: 'Blog - Keymoji',
            it: 'Blog - Keymoji',
            fr: 'Blog - Keymoji',
            pl: 'Blog - Keymoji',
            ru: 'Блог - Keymoji',
            tr: 'Blog - Keymoji',
            af: 'Blog - Keymoji',
            ja: 'ブログ - Keymoji',
            ko: '블로그 - Keymoji',
            tlh: 'Blog - Keymoji',
            sjn: 'Blog - Keymoji'
        },
        notFound: {
            en: 'Page Not Found - Keymoji',
            de: 'Seite Nicht Gefunden - Keymoji',
            dech: 'Seite Nicht Gefunden - Keymoji',
            es: 'Página No Encontrada - Keymoji',
            nl: 'Pagina Niet Gevonden - Keymoji',
            it: 'Pagina Non Trovata - Keymoji',
            fr: 'Page Non Trouvée - Keymoji',
            pl: 'Strona Nie Znaleziona - Keymoji',
            ru: 'Страница Не Найдена - Keymoji',
            tr: 'Sayfa Bulunamadı - Keymoji',
            af: 'Bladsy Nie Gevind - Keymoji',
            ja: 'ページが見つかりません - Keymoji',
            ko: '페이지를 찾을 수 없습니다 - Keymoji',
            tlh: 'Page Not Found - Keymoji',
            sjn: 'Page Not Found - Keymoji'
        }
    };

    const pageTitles = titles[pageType] || titles.home;
    return pageTitles[currentLanguage] || pageTitles.en;
}

/**
 * Get page description based on page type and language
 * @param {string} pageType - Type of page
 * @param {string} currentLanguage - Current language
 * @returns {string} Page description
 */
export function getPageDescription(pageType, currentLanguage = 'en') {
    const descriptions = {
        home: {
            en: 'Generate secure, AI-resistant emoji passwords. Create memorable passwords with emojis in 15+ languages.',
            de: 'Generiere sichere, KI-resistente Emoji-Passwörter. Erstelle merkbare Passwörter mit Emojis in 15+ Sprachen.',
            dech: 'Generiere sichere, KI-resistente Emoji-Passwörter. Erstelle merkbare Passwörter mit Emojis in 15+ Sprachen.',
            es: 'Genera contraseñas seguras con emojis resistentes a IA. Crea contraseñas memorables con emojis en 15+ idiomas.',
            nl: "Genereer veilige, AI-resistente emoji-wachtwoorden. Maak memorabele wachtwoorden met emoji's in 15+ talen.",
            it: "Genera password sicure con emoji resistenti all'IA. Crea password memorabili con emoji in 15+ lingue.",
            fr: "Générez des mots de passe sécurisés avec des emojis résistants à l'IA. Créez des mots de passe mémorables avec des emojis en 15+ langues.",
            pl: 'Generuj bezpieczne hasła z emoji odporne na AI. Twórz zapamiętywalne hasła z emoji w 15+ językach.',
            ru: 'Генерируйте безопасные пароли с эмодзи, устойчивые к ИИ. Создавайте запоминающиеся пароли с эмодзи на 15+ языках.',
            tr: 'Güvenli, yapay zeka dirençli emoji şifreleri oluşturun. 15+ dilde emoji ile akılda kalıcı şifreler oluşturun.',
            af: "Genereer veilige, AI-weerstandige emoji-wagwoorde. Skep memorabele wagwoorde met emoji's in 15+ tale.",
            ja: '安全でAIに耐性のある絵文字パスワードを生成します。15以上の言語で絵文字を使った覚えやすいパスワードを作成します。',
            ko: '안전하고 AI에 저항하는 이모지 비밀번호를 생성합니다. 15개 이상의 언어로 이모지를 사용한 기억하기 쉬운 비밀번호를 만듭니다.',
            tlh: 'Generate secure, AI-resistant emoji passwords. Create memorable passwords with emojis in 15+ languages.',
            sjn: 'Generate secure, AI-resistant emoji passwords. Create memorable passwords with emojis in 15+ languages.'
        },
        contact: {
            en: 'Get in touch with Christopher Matt, Frontend Developer. Send a message for questions or suggestions about Keymoji.',
            de: 'Kontaktiere Christopher Matt, Frontend Developer. Sende eine Nachricht für Fragen oder Vorschläge zu Keymoji.',
            dech: 'Kontaktiere Christopher Matt, Frontend Developer. Sende eine Nachricht für Fragen oder Vorschläge zu Keymoji.',
            es: 'Ponte en contacto con Christopher Matt, Desarrollador Frontend. Envía un mensaje para preguntas o sugerencias sobre Keymoji.',
            nl: 'Neem contact op met Christopher Matt, Frontend Developer. Stuur een bericht voor vragen of suggesties over Keymoji.',
            it: 'Metti in contatto con Christopher Matt, Sviluppatore Frontend. Invia un messaggio per domande o suggerimenti su Keymoji.',
            fr: 'Contactez Christopher Matt, Développeur Frontend. Envoyez un message pour des questions ou suggestions sur Keymoji.',
            pl: 'Skontaktuj się z Christopher Matt, Frontend Developer. Wyślij wiadomość z pytaniami lub sugestiami dotyczącymi Keymoji.',
            ru: 'Свяжитесь с Christopher Matt, Frontend Developer. Отправьте сообщение с вопросами или предложениями о Keymoji.',
            tr: 'Christopher Matt, Frontend Developer ile iletişime geçin. Keymoji hakkında sorular veya öneriler için mesaj gönderin.',
            af: "Kontak Christopher Matt, Frontend Developer. Stuur 'n boodskap vir vrae of voorstelle oor Keymoji.",
            ja: 'フロントエンド開発者Christopher Mattにお問い合わせください。Keymojiについての質問や提案のメッセージをお送りください。',
            ko: '프론트엔드 개발자 Christopher Matt에게 연락하세요. Keymoji에 대한 질문이나 제안을 위한 메시지를 보내주세요.',
            tlh: 'Get in touch with Christopher Matt, Frontend Developer. Send a message for questions or suggestions about Keymoji.',
            sjn: 'Get in touch with Christopher Matt, Frontend Developer. Send a message for questions or suggestions about Keymoji.'
        },
        versions: {
            en: 'Check out the development history and changelog of Keymoji. See all versions and improvements.',
            de: 'Schau dir die Entwicklungsgeschichte und das Changelog von Keymoji an. Sieh alle Versionen und Verbesserungen.',
            dech: 'Schau dir die Entwicklungsgeschichte und das Changelog von Keymoji an. Sieh alle Versionen und Verbesserungen.',
            es: 'Consulta el historial de desarrollo y changelog de Keymoji. Ve todas las versiones y mejoras.',
            nl: 'Bekijk de ontwikkelingsgeschiedenis en changelog van Keymoji. Zie alle versies en verbeteringen.',
            it: 'Controlla la cronologia di sviluppo e il changelog di Keymoji. Vedi tutte le versioni e i miglioramenti.',
            fr: "Consultez l'historique de développement et le changelog de Keymoji. Voir toutes les versions et améliorations.",
            pl: 'Sprawdź historię rozwoju i changelog Keymoji. Zobacz wszystkie wersje i ulepszenia.',
            ru: 'Ознакомьтесь с историей разработки и changelog Keymoji. Посмотрите все версии и улучшения.',
            tr: "Keymoji'nin geliştirme geçmişini ve changelog'unu inceleyin. Tüm sürümleri ve iyileştirmeleri görün.",
            af: 'Kyk na die ontwikkelingsgeskiedenis en changelog van Keymoji. Sien alle weergawes en verbeterings.',
            ja: 'Keymojiの開発履歴とchangelogをご確認ください。すべてのバージョンと改善点をご覧ください。',
            ko: 'Keymoji의 개발 역사와 changelog를 확인하세요. 모든 버전과 개선사항을 보세요.',
            tlh: 'Check out the development history and changelog of Keymoji. See all versions and improvements.',
            sjn: 'Check out the development history and changelog of Keymoji. See all versions and improvements.'
        },
        blog: {
            en: 'Read the latest blog posts and articles about Keymoji, password security, and emoji technology.',
            de: 'Lies die neuesten Blog-Posts und Artikel über Keymoji, Passwort-Sicherheit und Emoji-Technologie.',
            dech: 'Lies die neuesten Blog-Posts und Artikel über Keymoji, Passwort-Sicherheit und Emoji-Technologie.',
            es: 'Lee las últimas publicaciones del blog y artículos sobre Keymoji, seguridad de contraseñas y tecnología de emojis.',
            nl: 'Lees de nieuwste blogposts en artikelen over Keymoji, wachtwoordbeveiliging en emoji-technologie.',
            it: 'Leggi gli ultimi post del blog e articoli su Keymoji, sicurezza delle password e tecnologia emoji.',
            fr: 'Lisez les derniers articles de blog sur Keymoji, la sécurité des mots de passe et la technologie emoji.',
            pl: 'Przeczytaj najnowsze posty na blogu i artykuły o Keymoji, bezpieczeństwie haseł i technologii emoji.',
            ru: 'Читайте последние посты в блоге и статьи о Keymoji, безопасности паролей и технологии эмодзи.',
            tr: 'Keymoji, şifre güvenliği ve emoji teknolojisi hakkındaki en son blog yazılarını ve makaleleri okuyun.',
            af: 'Lees die nuutste blogplase en artikels oor Keymoji, wagwoord sekuriteit en emoji tegnologie.',
            ja: 'Keymoji、パスワードセキュリティ、絵文字技術に関する最新のブログ投稿と記事をお読みください。',
            ko: 'Keymoji, 비밀번호 보안, 이모지 기술에 대한 최신 블로그 포스트와 기사를 읽어보세요.',
            tlh: 'Read the latest blog posts and articles about Keymoji, password security, and emoji technology.',
            sjn: 'Read the latest blog posts and articles about Keymoji, password security, and emoji technology.'
        },
        notFound: {
            en: 'The page you are looking for does not exist. Return to the Keymoji homepage.',
            de: 'Die gesuchte Seite existiert nicht. Kehre zur Keymoji-Startseite zurück.',
            dech: 'Die gesuchte Seite existiert nicht. Kehre zur Keymoji-Startseite zurück.',
            es: 'La página que buscas no existe. Regresa a la página principal de Keymoji.',
            nl: 'De pagina die je zoekt bestaat niet. Ga terug naar de Keymoji homepage.',
            it: 'La pagina che stai cercando non esiste. Torna alla homepage di Keymoji.',
            fr: "La page que vous recherchez n'existe pas. Retournez à la page d'accueil de Keymoji.",
            pl: 'Strona, której szukasz, nie istnieje. Wróć do strony głównej Keymoji.',
            ru: 'Страница, которую вы ищете, не существует. Вернитесь на главную страницу Keymoji.',
            tr: 'Aradığınız sayfa mevcut değil. Keymoji ana sayfasına dönün.',
            af: 'Die bladsy wat jy soek bestaan nie. Gaan terug na die Keymoji tuisblad.',
            ja: 'お探しのページは存在しません。Keymojiのホームページに戻ってください。',
            ko: '찾고 계신 페이지가 존재하지 않습니다. Keymoji 홈페이지로 돌아가세요.',
            tlh: 'The page you are looking for does not exist. Return to the Keymoji homepage.',
            sjn: 'The page you are looking for does not exist. Return to the Keymoji homepage.'
        }
    };

    const pageDescriptions = descriptions[pageType] || descriptions.home;
    return pageDescriptions[currentLanguage] || pageDescriptions.en;
}

/**
 * Get page keywords based on page type and language
 * @param {string} pageType - Type of page
 * @param {string} currentLanguage - Current language
 * @returns {string} Page keywords
 */
export function getPageKeywords(pageType, currentLanguage = 'en') {
    const keywords = {
        home: {
            en: 'emoji password, password generator, secure passwords, AI resistant, keymoji, emoji security',
            de: 'emoji passwort, passwort generator, sichere passwörter, KI resistent, keymoji, emoji sicherheit',
            dech: 'emoji passwort, passwort generator, sichere passwörter, KI resistent, keymoji, emoji sicherheit',
            es: 'contraseña emoji, generador de contraseñas, contraseñas seguras, resistente a IA, keymoji, seguridad emoji',
            nl: 'emoji wachtwoord, wachtwoord generator, veilige wachtwoorden, AI resistent, keymoji, emoji beveiliging',
            it: "password emoji, generatore password, password sicure, resistente all'IA, keymoji, sicurezza emoji",
            fr: "mot de passe emoji, générateur de mots de passe, mots de passe sécurisés, résistant à l'IA, keymoji, sécurité emoji",
            pl: 'hasło emoji, generator haseł, bezpieczne hasła, odporne na AI, keymoji, bezpieczeństwo emoji',
            ru: 'пароль эмодзи, генератор паролей, безопасные пароли, устойчивые к ИИ, keymoji, безопасность эмодзи',
            tr: 'emoji şifre, şifre oluşturucu, güvenli şifreler, yapay zeka dirençli, keymoji, emoji güvenliği',
            af: 'emoji wagwoord, wagwoord generator, veilige wagwoorde, AI weerstandig, keymoji, emoji sekuriteit',
            ja: '絵文字パスワード、パスワードジェネレーター、安全なパスワード、AI耐性、keymoji、絵文字セキュリティ',
            ko: '이모지 비밀번호, 비밀번호 생성기, 안전한 비밀번호, AI 저항, keymoji, 이모지 보안',
            tlh: 'emoji password, password generator, secure passwords, AI resistant, keymoji, emoji security',
            sjn: 'emoji password, password generator, secure passwords, AI resistant, keymoji, emoji security'
        },
        contact: {
            en: 'contact, keymoji, christopher matt, frontend developer, message, support',
            de: 'kontakt, keymoji, christopher matt, frontend entwickler, nachricht, support',
            dech: 'kontakt, keymoji, christopher matt, frontend entwickler, nachricht, support',
            es: 'contacto, keymoji, christopher matt, desarrollador frontend, mensaje, soporte',
            nl: 'contact, keymoji, christopher matt, frontend developer, bericht, ondersteuning',
            it: 'contatto, keymoji, christopher matt, sviluppatore frontend, messaggio, supporto',
            fr: 'contact, keymoji, christopher matt, développeur frontend, message, support',
            pl: 'kontakt, keymoji, christopher matt, programista frontend, wiadomość, wsparcie',
            ru: 'контакты, keymoji, christopher matt, фронтенд разработчик, сообщение, поддержка',
            tr: 'iletişim, keymoji, christopher matt, frontend geliştirici, mesaj, destek',
            af: 'kontak, keymoji, christopher matt, frontend ontwikkelaar, boodskap, ondersteuning',
            ja: 'お問い合わせ、keymoji、christopher matt、フロントエンド開発者、メッセージ、サポート',
            ko: '연락처, keymoji, christopher matt, 프론트엔드 개발자, 메시지, 지원',
            tlh: 'contact, keymoji, christopher matt, frontend developer, message, support',
            sjn: 'contact, keymoji, christopher matt, frontend developer, message, support'
        },
        versions: {
            en: 'version history, changelog, keymoji versions, development history, updates',
            de: 'versionsverlauf, changelog, keymoji versionen, entwicklungsgeschichte, updates',
            dech: 'versionsverlauf, changelog, keymoji versionen, entwicklungsgeschichte, updates',
            es: 'historial de versiones, changelog, versiones keymoji, historial de desarrollo, actualizaciones',
            nl: 'versiegeschiedenis, changelog, keymoji versies, ontwikkelingsgeschiedenis, updates',
            it: 'cronologia versioni, changelog, versioni keymoji, cronologia sviluppo, aggiornamenti',
            fr: 'historique des versions, changelog, versions keymoji, historique de développement, mises à jour',
            pl: 'historia wersji, changelog, wersje keymoji, historia rozwoju, aktualizacje',
            ru: 'история версий, changelog, версии keymoji, история разработки, обновления',
            tr: 'sürüm geçmişi, changelog, keymoji sürümleri, geliştirme geçmişi, güncellemeler',
            af: 'weergawe geskiedenis, changelog, keymoji weergawes, ontwikkelingsgeskiedenis, opdaterings',
            ja: 'バージョン履歴、changelog、keymojiバージョン、開発履歴、アップデート',
            ko: '버전 기록, changelog, keymoji 버전, 개발 역사, 업데이트',
            tlh: 'version history, changelog, keymoji versions, development history, updates',
            sjn: 'version history, changelog, keymoji versions, development history, updates'
        },
        blog: {
            en: 'blog, articles, keymoji blog, password security, emoji technology, development',
            de: 'blog, artikel, keymoji blog, passwort sicherheit, emoji technologie, entwicklung',
            dech: 'blog, artikel, keymoji blog, passwort sicherheit, emoji technologie, entwicklung',
            es: 'blog, artículos, blog keymoji, seguridad de contraseñas, tecnología de emojis, desarrollo',
            nl: 'blog, artikelen, keymoji blog, wachtwoordbeveiliging, emoji technologie, ontwikkeling',
            it: 'blog, articoli, blog keymoji, sicurezza password, tecnologia emoji, sviluppo',
            fr: 'blog, articles, blog keymoji, sécurité des mots de passe, technologie emoji, développement',
            pl: 'blog, artykuły, blog keymoji, bezpieczeństwo haseł, technologia emoji, rozwój',
            ru: 'блог, статьи, блог keymoji, безопасность паролей, технология эмодзи, разработка',
            tr: 'blog, makaleler, keymoji blog, şifre güvenliği, emoji teknolojisi, geliştirme',
            af: 'blog, artikels, keymoji blog, wagwoord sekuriteit, emoji tegnologie, ontwikkeling',
            ja: 'ブログ、記事、keymojiブログ、パスワードセキュリティ、絵文字技術、開発',
            ko: '블로그, 기사, keymoji 블로그, 비밀번호 보안, 이모지 기술, 개발',
            tlh: 'blog, articles, keymoji blog, password security, emoji technology, development',
            sjn: 'blog, articles, keymoji blog, password security, emoji technology, development'
        },
        notFound: {
            en: 'page not found, 404, keymoji, error page',
            de: 'seite nicht gefunden, 404, keymoji, fehlerseite',
            dech: 'seite nicht gefunden, 404, keymoji, fehlerseite',
            es: 'página no encontrada, 404, keymoji, página de error',
            nl: 'pagina niet gevonden, 404, keymoji, foutpagina',
            it: 'pagina non trovata, 404, keymoji, pagina di errore',
            fr: "page non trouvée, 404, keymoji, page d'erreur",
            pl: 'strona nie znaleziona, 404, keymoji, strona błędu',
            ru: 'страница не найдена, 404, keymoji, страница ошибки',
            tr: 'sayfa bulunamadı, 404, keymoji, hata sayfası',
            af: 'bladsy nie gevind, 404, keymoji, fout bladsy',
            ja: 'ページが見つかりません、404、keymoji、エラーページ',
            ko: '페이지를 찾을 수 없습니다, 404, keymoji, 오류 페이지',
            tlh: 'page not found, 404, keymoji, error page',
            sjn: 'page not found, 404, keymoji, error page'
        }
    };

    const pageKeywords = keywords[pageType] || keywords.home;
    return pageKeywords[currentLanguage] || pageKeywords.en;
}

/**
 * Update meta tags in document head
 * @param {object} seoData - SEO data
 * @param {string} currentLanguage - Current language
 */
export function updateMetaTags(seoData, currentLanguage) {
    const { title, description, keywords, canonical, image, type, noindex } =
        seoData;
    const fullImageUrl = getFullImageUrl(image);
    const locale = getLocale(currentLanguage);

    // Helper function to update meta tags
    function updateMetaTag(selector, attribute, value) {
        let element = document.querySelector(selector);

        if (!element && attribute === 'content') {
            // Create meta tag if it doesn't exist
            const isProperty = selector.includes('property=');
            element = document.createElement('meta');

            if (isProperty) {
                const propertyMatch = selector.match(/property="([^"]+)"/);
                if (propertyMatch) {
                    element.setAttribute('property', propertyMatch[1]);
                }
            } else {
                const nameMatch = selector.match(/name="([^"]+)"/);
                if (nameMatch) {
                    element.setAttribute('name', nameMatch[1]);
                }
            }

            document.head.appendChild(element);
        }

        if (element) {
            element.setAttribute(attribute, value);
        }
    }

    // Title
    document.title = title;

    // Primary Meta Tags
    updateMetaTag('meta[name="title"]', 'content', title);
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);

    // Open Graph
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:url"]', 'content', canonical);
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
    updateMetaTag('meta[property="og:locale"]', 'content', locale);
    updateMetaTag('meta[property="og:site_name"]', 'content', 'Keymoji');
    updateMetaTag('meta[property="og:updated_time"]', 'content', updatedTime);

    // Twitter
    updateMetaTag(
        'meta[property="twitter:card"]',
        'content',
        'summary_large_image'
    );
    updateMetaTag('meta[property="twitter:title"]', 'content', title);
    updateMetaTag(
        'meta[property="twitter:description"]',
        'content',
        description
    );
    updateMetaTag('meta[property="twitter:image"]', 'content', fullImageUrl);
    updateMetaTag('meta[property="twitter:url"]', 'content', canonical);

    // Robots
    if (noindex) {
        updateMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
    } else {
        updateMetaTag('meta[name="robots"]', 'content', 'index, follow');
    }

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
}

/**
 * Inject structured data into document head
 * @param {object} structuredData - Structured data object
 */
export function injectStructuredData(structuredData) {
    // Remove existing structured data
    const existingScript = document.querySelector(
        'script[data-seo-structured="true"]'
    );
    if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
    }

    // Inject new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    script.setAttribute('data-seo-structured', 'true');
    document.head.appendChild(script);
}
