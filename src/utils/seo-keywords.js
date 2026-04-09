/**
 * SEO Keywords Management
 * - Zentrale Keywords-Verwaltung für bessere Suchmaschinen-Optimierung
 * - Keyword-Clustering für verschiedene Seiten
 * - LSI (Latent Semantic Indexing) Keywords
 * - Long-tail Keywords für bessere Rankings
 */

// Primäre Keywords für Hauptseiten
export const PRIMARY_KEYWORDS = {
    home: [
        'emoji password',
        'password generator',
        'secure passwords',
        'AI resistant passwords',
        'keymoji',
        'password security',
        'online security',
        'emoji password generator',
        'secure password creation',
        'password strength'
    ],
    versions: [
        'keymoji updates',
        'version history',
        'changelog',
        'new features',
        'emoji password updates',
        'password generator updates',
        'security updates',
        'app updates',
        'feature releases',
        'version changelog'
    ],
    contact: [
        'contact keymoji',
        'support',
        'feedback',
        'get in touch',
        'emoji password help',
        'password generator support',
        'contact form',
        'customer support',
        'technical support',
        'help desk'
    ],
    blog: [
        'password security',
        'emoji passwords',
        'security blog',
        'keymoji blog',
        'password tips',
        'security tips',
        'password best practices',
        'cybersecurity',
        'password safety',
        'security advice'
    ]
};

// LSI (Latent Semantic Indexing) Keywords
export const LSI_KEYWORDS = {
    home: [
        'unicode passwords',
        'symbol passwords',
        'visual passwords',
        'memorable passwords',
        'strong passwords',
        'password complexity',
        'password entropy',
        'cryptographic security',
        'password strength checker',
        'password generator tool'
    ],
    versions: [
        'software updates',
        'app improvements',
        'bug fixes',
        'performance updates',
        'security patches',
        'feature additions',
        'user interface updates',
        'mobile optimization',
        'browser compatibility',
        'accessibility improvements'
    ],
    contact: [
        'customer service',
        'technical assistance',
        'user support',
        'help center',
        'contact information',
        'support ticket',
        'inquiry form',
        'feedback form',
        'bug report',
        'feature request'
    ],
    blog: [
        'password management',
        'digital security',
        'online privacy',
        'cyber threats',
        'password breaches',
        'security awareness',
        'password hygiene',
        'multi-factor authentication',
        'password managers',
        'security protocols'
    ]
};

// Long-tail Keywords für bessere Rankings
export const LONG_TAIL_KEYWORDS = {
    home: [
        'how to create secure emoji passwords',
        'best emoji password generator 2024',
        'AI resistant password creation tool',
        'free emoji password generator online',
        'secure password generator with symbols',
        'create memorable passwords with emojis',
        'password strength with emoji characters',
        'unicode password generator tool',
        'visual password creation online',
        'strong password generator with symbols'
    ],
    versions: [
        'keymoji latest version features',
        'emoji password generator updates 2024',
        'password security tool changelog',
        'keymoji app new features list',
        'password generator version history',
        'security tool update changelog',
        'emoji password app improvements',
        'password generator bug fixes',
        'keymoji performance updates',
        'password tool accessibility updates'
    ],
    contact: [
        'contact keymoji password generator',
        'emoji password generator support',
        'password tool customer service',
        'keymoji technical support contact',
        'password generator help desk',
        'emoji password app feedback',
        'keymoji bug report form',
        'password generator feature request',
        'emoji password tool assistance',
        'keymoji customer support email'
    ],
    blog: [
        'how to create secure passwords with emojis',
        'emoji password security best practices',
        'password generator security tips 2024',
        'creating strong passwords with symbols',
        'password security for online accounts',
        'emoji password generator tutorial',
        'password strength and security guide',
        'secure password creation techniques',
        'password generator tool guide',
        'emoji password security features'
    ]
};

// Technische Keywords für Entwickler
export const TECHNICAL_KEYWORDS = {
    home: [
        'unicode password generation',
        'symbol-based authentication',
        'visual password systems',
        'cryptographic password creation',
        'entropy-based password generation',
        'multi-character password systems',
        'symbolic password algorithms',
        'visual authentication methods',
        'unicode security protocols',
        'symbol-based encryption'
    ],
    versions: [
        'password generator API updates',
        'security algorithm improvements',
        'cryptographic function updates',
        'password generation optimization',
        'security protocol enhancements',
        'authentication system updates',
        'password strength algorithms',
        'encryption method improvements',
        'security framework updates',
        'password generation performance'
    ]
};

// Lokalisierte Keywords für verschiedene Sprachen
export const LOCALIZED_KEYWORDS = {
    de: {
        home: [
            'emoji passwort',
            'passwort generator',
            'sichere passwörter',
            'KI-resistente passwörter',
            'passwort sicherheit',
            'online sicherheit',
            'emoji passwort generator',
            'sichere passwort erstellung',
            'passwort stärke',
            'symbol passwörter'
        ]
    },
    es: {
        home: [
            'contraseña emoji',
            'generador de contraseñas',
            'contraseñas seguras',
            'contraseñas resistentes a IA',
            'seguridad de contraseñas',
            'seguridad en línea',
            'generador de contraseñas emoji',
            'creación de contraseñas seguras',
            'fortaleza de contraseñas',
            'contraseñas con símbolos'
        ]
    },
    fr: {
        home: [
            'mot de passe emoji',
            'générateur de mots de passe',
            'mots de passe sécurisés',
            "mots de passe résistants à l'IA",
            'sécurité des mots de passe',
            'sécurité en ligne',
            'générateur de mots de passe emoji',
            'création de mots de passe sécurisés',
            'force des mots de passe',
            'mots de passe avec symboles'
        ]
    }
};

// Meta-Keywords für verschiedene Seiten
export const META_KEYWORDS = {
    home: 'emoji password, password generator, secure passwords, AI resistant, keymoji, password security, online security, unicode passwords, symbol passwords, visual passwords',
    versions:
        'keymoji updates, version history, changelog, new features, emoji password updates, password generator updates, security updates, app updates, feature releases',
    contact:
        'contact keymoji, support, feedback, get in touch, emoji password help, password generator support, contact form, customer support, technical support',
    blog: 'password security, emoji passwords, security blog, keymoji blog, password tips, security tips, password best practices, cybersecurity, password safety'
};

// Funktionen für Keyword-Management
export function getKeywordsForPage(pageType, language = 'en') {
    const primary = PRIMARY_KEYWORDS[pageType] || [];
    const lsi = LSI_KEYWORDS[pageType] || [];
    const longTail = LONG_TAIL_KEYWORDS[pageType] || [];
    const technical = TECHNICAL_KEYWORDS[pageType] || [];
    const localized = LOCALIZED_KEYWORDS[language]?.[pageType] || [];

    return {
        primary,
        lsi,
        longTail,
        technical,
        localized,
        all: [...primary, ...lsi, ...longTail, ...technical, ...localized]
    };
}

export function getMetaKeywords(pageType) {
    return META_KEYWORDS[pageType] || META_KEYWORDS.home;
}

export function generateKeywordString(pageType, language = 'en') {
    const keywords = getKeywordsForPage(pageType, language);
    return keywords.all.join(', ');
}

// Keyword-Dichte-Analyse
export function analyzeKeywordDensity(text, keywords) {
    const wordCount = text.toLowerCase().split(/\s+/).length;
    const density = {};

    keywords.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = text.toLowerCase().match(regex);
        const count = matches ? matches.length : 0;
        density[keyword] = {
            count,
            density: (count / wordCount) * 100
        };
    });

    return density;
}

// SEO-Score basierend auf Keywords
export function calculateSEOScore(pageType, content, language = 'en') {
    const keywords = getKeywordsForPage(pageType, language);
    const density = analyzeKeywordDensity(content, keywords.all);

    let score = 0;
    let totalDensity = 0;

    Object.values(density).forEach(({ density: keywordDensity }) => {
        totalDensity += keywordDensity;
        if (keywordDensity > 0.5 && keywordDensity < 2.5) {
            score += 10; // Optimal density
        } else if (keywordDensity > 0.1 && keywordDensity < 5) {
            score += 5; // Acceptable density
        }
    });

    const averageDensity = totalDensity / keywords.all.length;

    return {
        score: Math.min(score, 100),
        averageDensity,
        keywordDensity: density
    };
}
