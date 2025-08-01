// src/data/languages/tr.js
// Turkish language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Ana menüyü aç',
        closeMainMenu: 'Ana menüyü kapat'
    },
    index: {
        pageTitle: 'Emoji Şifre Üreticisi',
        pageDescription:
            '🔑 Şifreler yeniden icat edildi. 🎯 Kırılamaz emoji şifreleri. 🌈 Ücretsiz. Güvenli. Yenilikçi. 🤖 AI dirençli teknoloji. 🌍 15+ dilde mevcut.',
        pageKeywords:
            'Keymoji, emoji şifre, şifre üreticisi, güvenlik, çevrimiçi güvenlik',
        pageInstruction: [
            'AI emoji hikayeniz için "📝 Hikaye"ye tıklayın 📖',
            '"Rastgele" kendini açıklıyor 😜.',
            'Üretildikten sonra panoya kopyalanır! 📋'
        ],
        backToMainText: 'Geri dönmek için aşağıya tıklayın 👇',
        backToMainButtonText: 'Ana sayfaya dön',
        contactText: 'Bir sorunuz veya harika bir öneriniz var mı?',
        contactButtonText: 'Bana mesaj gönderin! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            "Üretilen emoji şifresini panoya kopyalamak için tıklayın veya Enter'a basın",
        successMessage: 'Başarılı, panoya kopyalandı 💾',
        errorMessage: 'Ups, bir şeyler ters gitti 🤖',
        dailyLimitReachedMessage: 'Üzgünüz, günlük istek limitine ulaşıldı 😔',
        successStoryMessage: 'Başarılı, emoji hikayesi üretildi 🤖',
        errorStoryMessage: 'Hata, sunucudan yanıt yok 🌀',
        emojiDisplayTitle: 'Emoji Şifre Üreticisi',
        dataPrivacyProcessingInfo:
            '🚀 Webhook ve AI ile emoji sihri! ✨ Veriler plaj kumu gibi - kalmaz.',
        clearButton: '✖️ Temizle',
        storyButton: '📝 Hikaye',
        storyButtonClicked: '📩 Hikaye gönder',
        randomButton: '🎲 Rastgele',
        placeholderText:
            'Bana bir hikaye anlatın ve ona göre emoji şifreleri üreteyim...',
        clipboardError: 'Panoya kopyalama hatası'
    },
    donateButton: {
        text: 'Bana bir kahve al',
        openText: 'Bu menüyü kapat',
        textMobile: '☕'
    },
    // İletişim formu (optimize edildi)
    contactForm: {
        pageTitle: 'Merhaba, ben Christopher',
        pageDescription:
            'Frontend geliştiriciyim ve JavaScript, PHP, HTML ile kullanıcı dostu siteler yapmayı seviyorum. İstersen bana mesaj göndermekten çekinme!',
        nameLabel: '🧑🏻 Adınız',
        emailLabel: '📧 E-posta adresiniz',
        messageLabel: '✍🏻 Mesaj',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Gönder',
        sendingButton: '📨 Gönderiliyor...',
        successMessage: 'Başarılı, mesaj gönderildi - Yanıt: < 24 saat 🚀',
        errorMessage: 'Beklenmeyen bir hata oluştu 😟',
        requestErrorMessage: 'Mesaj gönderme hatası. Lütfen tekrar deneyin 🙁',
        smirkingFaceImageAlt: 'keymoji emoji gülümseyen yüz 1f60f',
        introductionTitle: 'Bir sorunuz veya harika bir öneriniz mi var?',
        introductionText: 'Bana mesaj göndermekten çekinmeyin!',
        privacyNotice:
            'Verileriniz bizde güvende 🤲. Bilgileriniz üçüncü kişilerle paylaşılmaz 🔒.',
        newsletterLabel: 'Evet, bültene abone olmak istiyorum',
        newsletterOptIn: 'Bültene abone ol',
        backToMainButton: 'Ana sayfaya dön',
        footerText: 'Sevgiyle geliştirildi',
        validationErrorMessage:
            'Lütfen göndermeden önce form hatalarını düzeltin 🔍',
        sendingMessage: 'Mesajınız gönderiliyor... 📨',
        emailText: {
            greeting: 'Hoş geldiniz',
            confirmationText:
                'Christopher, akıllı bir bot olmadığınızı bilsin diye lütfen isteğinizi onaylayın. Aşağıdaki bilgilerle bir mesaj gönderdiniz:',
            doubleCheck: 'Mesajınızı aşağıdaki detaylarla aldık:',
            button: 'E-postanızı onaylayın'
        },
        validation: {
            nameRequired: 'Ad gerekli',
            nameLength: 'En az 2 karakter',
            emailRequired: 'E-posta gerekli',
            emailInvalid: 'Geçersiz e-posta adresi',
            messageRequired: 'Mesaj gerekli',
            messageLength: 'En az {min} karakter'
        }
    },
    serviceWorker: {
        updateAvailable: 'Yeni bir sürüm mevcut!',
        manualRefreshNeeded:
            'Yeni sürüm etkinleştirildi. En son özellikler için şimdi yenileyin.',
        updateSuccess: 'Uygulama başarıyla güncellendi! 🎉'
    },
    notFound: {
        message: 'Ups! Sayfa bulunamadı 🚫',
        backButton: 'Ana sayfaya dön',
        contactButton: 'Bizimle iletişime geçin'
    },
    blog: {
        readMore: 'Devamını oku',
        backToBlog: 'Bloga geri dön',
        publishedOn: 'Yayınlandı',
        author: 'Yazar',
        tags: 'Etiketler',
        readTime: 'dakika okuma',
        likes: 'beğeni',
        share: 'Paylaş'
    },
    account: {
        create: 'Hesap oluştur',
        manage: 'Hesabı yönet',
        login: 'Giriş yap',
        logout: 'Çıkış yap',
        profile: 'Profil',
        settings: 'Ayarlar',
        guest: 'Misafir',
        free: 'ÜCRETSİZ',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Ana içeriğe geç',
        closeModal: 'Modalı kapat',
        openMenu: 'Menüyü aç',
        closeMenu: 'Menüyü kapat',
        loading: 'Yükleniyor...',
        error: 'Hata oluştu',
        success: 'Başarılı',
        warning: 'Uyarı',
        info: 'Bilgi',
        copyToClipboard: 'Panoya kopyala',
        copiedToClipboard: 'Panoya kopyalandı',
        generatePassword: 'Şifre üret',
        clearForm: 'Formu temizle',
        sendMessage: 'Mesaj gönder',
        toggleDarkMode: 'Karanlık modu değiştir',
        toggleLanguage: 'Dili değiştir'
    },
    validation: {
        required: 'Bu alan gerekli',
        email: 'Lütfen geçerli bir e-posta adresi girin',
        minLength: 'En az {min} karakter içermeli',
        maxLength: '{max} karakterden fazla olamaz',
        invalidFormat: 'Geçersiz format',
        serverError: 'Sunucu hatası, lütfen tekrar deneyin',
        networkError: 'Ağ hatası, bağlantınızı kontrol edin'
    },

    // UserSettings çevirileri
    userSettings: {
        // Temel ayarlar
        basicSettings: {
            title: 'Temel ayarlar',
            description: 'Dil, tema ve bildirimler',
            language: {
                label: 'Dil',
                description: 'Tercih ettiğiniz dili seçin',
                options: {
                    en: '🇺🇸 İngilizce',
                    de: '🇩🇪 Almanca',
                    fr: '🇫🇷 Fransızca',
                    es: '🇪🇸 İspanyolca',
                    tr: '🇹🇷 Türkçe'
                }
            },
            theme: {
                label: 'Tema',
                description: 'Görsel temanızı seçin',
                options: {
                    auto: '🔄 Otomatik',
                    light: '☀️ Açık',
                    dark: '🌙 Koyu'
                }
            },
            notifications: {
                label: 'Bildirimler',
                description: 'Önemli güncellemeleri alın'
            }
        },

        // Güvenlik ayarları
        securitySettings: {
            title: 'Güvenlik ayarları',
            description: 'Şifre gücü ve karakter türleri',
            passwordLength: {
                label: 'Şifre uzunluğu',
                description: 'Şifre gücünü seçin',
                min: 'Zayıf (6)',
                max: 'Güçlü (20)'
            },
            includeNumbers: {
                label: 'Sayıları dahil et',
                description: 'Sayısal karakterler ekle (0-9)'
            },
            includeSymbols: {
                label: 'Sembolleri dahil et',
                description: 'Özel karakterler ekle (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Özel karakterleri dahil et',
                description: 'Genişletilmiş özel karakterler ekle'
            },
            excludeSimilarChars: {
                label: 'Benzer karakterleri hariç tut',
                description: 'Karıştırıcı karakterlerden kaçın (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Benzersiz karakterler gerekli',
                description: 'Şifrede tekrarlanan karakter yok'
            }
        },

        // Emoji ayarları
        emojiSettings: {
            title: 'Emoji ayarları',
            description: 'Emoji sayısı, kategoriler ve desenler',
            emojiCount: {
                label: 'Emoji sayısı',
                description: 'Şifredeki emoji sayısı',
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Emoji deseni',
                description: 'Emoji düzenini seçin',
                options: {
                    random: 'Rastgele',
                    sequential: 'Sıralı',
                    alternating: 'Değişken'
                }
            },
            emojiTheme: {
                label: 'Emoji teması',
                description: 'Emoji stilini seçin',
                options: {
                    mixed: 'Karışık',
                    cute: 'Sevimli',
                    professional: 'Profesyonel',
                    fantasy: 'Fantezi'
                }
            }
        },

        // Üretim ayarları
        generationSettings: {
            title: 'Üretim ayarları',
            description: 'Otomatik üretim ve pano seçenekleri',
            autoGenerate: {
                label: 'Otomatik üretim',
                description: 'Şifreleri otomatik olarak üret'
            },
            copyToClipboard: {
                label: 'Panoya kopyala',
                description: 'Üretilen şifreleri otomatik kopyala'
            },
            showStrength: {
                label: 'Gücü göster',
                description: 'Şifre gücü göstergesini göster'
            },
            strengthThreshold: {
                label: 'Güç eşiği',
                description: 'Gerekli minimum şifre gücü',
                options: {
                    low: 'Düşük',
                    medium: 'Orta',
                    high: 'Yüksek'
                }
            },
            autoRefresh: {
                label: 'Otomatik yenileme',
                description: 'Zayıf şifreleri otomatik yeniden üret'
            }
        },

        // Gizlilik ayarları
        privacySettings: {
            title: 'Gizlilik ayarları',
            description: 'Veri toplama ve paylaşım tercihleri',
            saveHistory: {
                label: 'Geçmişi kaydet',
                description: 'Üretilen şifreleri yerel olarak kaydet'
            },
            analytics: {
                label: 'Analitik',
                description: 'Anonim kullanım istatistikleri'
            },
            shareUsage: {
                label: 'Kullanımı paylaş',
                description: 'İyileştirmeler için kullanım verilerini paylaş'
            },
            exportHistory: {
                label: 'Geçmişi dışa aktar',
                description: 'Şifre geçmişini dosyaya dışa aktar'
            },
            backupSettings: {
                label: 'Ayarları yedekle',
                description: 'Ayarları otomatik yedekle'
            }
        },

        // Pro özellikler
        proFeatures: {
            title: 'Pro özellikler',
            description: 'Gelişmiş ayarlar ve premium özellikler',
            securityAudit: {
                label: 'Güvenlik denetimi',
                description: 'Kapsamlı güvenlik analizi',
                buttonText: 'Denetim yap'
            },
            breachCheck: {
                label: 'Veri sızıntısı kontrolü',
                description: 'Şifreleri bilinen sızıntılara karşı kontrol et'
            },
            strengthAnalytics: {
                label: 'Güç analitiği',
                description: 'Gelişmiş şifre gücü analizi'
            }
        }
    },

    // Muhasebe ve güvenlik
    accounting: {
        // Giriş ve kimlik doğrulama
        login: {
            title: 'Giriş yap',
            emailPlaceholder: 'E-posta adresinizi girin',
            magicLinkSent: 'Sihirli bağlantı gönderildi!',
            magicLinkError: 'Sihirli bağlantı gönderme hatası',
            verificationSuccess: 'E-posta başarıyla doğrulandı!',
            verificationError: 'E-posta doğrulaması başarısız',
            rateLimitExceeded: 'Çok fazla giriş denemesi. Bekleyin.',
            sessionExpired: 'Oturum süresi doldu. Tekrar giriş yapın.'
        },

        // Hesap yönetimi
        account: {
            title: 'Hesap yönetimi',
            profile: 'Profil',
            settings: 'Ayarlar',
            logout: 'Çıkış yap',
            logoutSuccess: 'Başarıyla çıkış yapıldı',
            accountCreated: 'Hesap başarıyla oluşturuldu',
            accountUpdated: 'Hesap başarıyla güncellendi',
            accountError: 'Hesap yönetimi hatası'
        },

        // Güvenlik olayları
        security: {
            loginAttempt: 'Giriş denemesi',
            loginSuccess: 'Başarılı giriş',
            loginFailed: 'Giriş başarısız',
            logout: 'Çıkış',
            sessionExpired: 'Oturum süresi doldu',
            suspiciousActivity: 'Şüpheli aktivite',
            verificationSuccess: 'Doğrulama başarılı',
            verificationFailed: 'Doğrulama başarısız',
            accountCreated: 'Hesap oluşturuldu',
            accountUpdated: 'Hesap güncellendi',
            securityAudit: 'Güvenlik denetimi yapıldı'
        },

        // Doğrulama
        validation: {
            required: 'Bu alan gerekli',
            emailInvalid: 'Geçerli bir e-posta adresi girin',
            urlInvalid: 'Geçerli bir URL girin',
            phoneInvalid: 'Geçerli bir telefon numarası girin',
            passwordWeak:
                'Şifre en az 8 karakter olmalı ve büyük, küçük harf ve rakam içermeli',
            minLength: 'Minimum uzunluk {min} karakter',
            maxLength: 'Maksimum uzunluk {max} karakter',
            minValue: 'Minimum değer {min}',
            maxValue: 'Maksimum değer {max}',
            validInput: 'Geçerli giriş'
        },

        // Bağlam menüsü
        contextMenu: {
            exportSettings: 'Ayarları dışa aktar',
            importSettings: 'Ayarları içe aktar',
            resetToDefault: 'Varsayılana sıfırla',
            proMessage:
                '💎 Pro kullanıcılar ayarlarını dışa aktarabilir ve içe aktarabilir'
        }
    },

    // Modaller ve bildirimler
    modals: {
        success: 'Başarılı',
        error: 'Hata',
        warning: 'Uyarı',
        info: 'Bilgi',
        confirm: 'Onayla',
        cancel: 'İptal',
        close: 'Kapat',
        loading: 'Yükleniyor...',
        saving: 'Kaydediliyor...',
        exporting: 'Dışa aktarılıyor...',
        importing: 'İçe aktarılıyor...',
        resetting: 'Sıfırlanıyor...'
    },

    versions: {
        pageTitle: 'Sürüm Geçmişi',
        pageDescription:
            'Keymoji, emoji şifre üreticisinin geliştirme geçmişini ve değişiklik kayıtlarını inceleyin.'
    },

    // AccountManager çevirileri
    accountManager: {
        // Sayfa başlıkları ve açıklamaları
        pageTitle: 'Hesap Yöneticisi',
        pageDescription:
            'Güvenlik ayarlarınızı ve hesap tercihlerinizi yönetin',
        welcomeBack: 'Tekrar hoş geldiniz, {name}! 👋',
        welcomeDescription:
            'Harika emoji şifreleri oluşturmaya hazır mısınız? Hesabınız güvenli ve hazır!',
        returnUserTitle: '👋 Tekrar hoş geldiniz!',
        returnUserDescription:
            'E-posta adresinizi tanıdık. Hızlıca giriş yapın.',
        verificationTitle: '📧 E-postanızı kontrol edin ve doğrulayın',
        verificationDescription:
            'E-postanızı {email} kontrol edin ve kurulumu tamamlamak için sihirli bağlantıya tıklayın',
        verifyingTitle: '🔗 Sihirli Bağlantı Doğrulanıyor...',
        verifyingDescription: 'Hesabınızı doğrularken lütfen bekleyin.',
        verificationErrorTitle: '❌ Doğrulama Başarısız',
        verificationErrorDescription: 'Bir hata oluştu.',

        // Düğmeler ve eylemler
        buttons: {
            createMagicLink: 'Sihirli Bağlantı Oluştur',
            loginToAccount: 'Hesaba Giriş Yap',
            checkAccountExists: 'Hesap kontrol ediliyor...',
            sendingMagicLink: 'Gönderiliyor...',
            accountExists: 'Hesap bulundu - Giriş yapılıyor...',
            accountNotFound: 'Hesap bulunamadı - Oluşturuluyor...',
            sessionExpired: 'Oturum süresi doldu - Tekrar giriş yapın',
            loginAgain: '🔐 Tekrar giriş yapın',
            createNewAccount: 'Yeni hesap oluştur',
            resendMagicLink: '🔄 Sihirli Bağlantıyı Tekrar Gönder',
            backToAccountOptions: '← Hesap Seçeneklerine Geri Dön',
            addProfile: 'Ekle',
            hideProfile: 'Gizle',
            profileData: 'Profil Verileri',
            showFullForm: 'Tam formu göster',
            compactView: 'Kompakt görünüm'
        },

        // Form etiketleri
        emailLabel: 'E-posta',
        nameLabel: 'Ad',

        // Eylemler
        actions: {
            saveSettings: '💾 Ayarları Kaydet',
            backToHome: '🏠 Ana Sayfaya Dön',
            skipAccount: '❌ {type} Atla',
            createAccount: '🚀 {type} Hesabı Oluştur',
            settingsSaved: 'Ayarlar başarıyla kaydedildi!'
        },

        // İstatistikler
        statistics: {
            storiesGenerated: 'Oluşturulan Hikayeler',
            remainingGenerations: 'Kalan Üretimler'
        },

        // Günlük üretimler
        dailyGenerations: 'Günlük Üretimler',

        // Kalan üretim görüntüleme
        remainingDisplay: 'Kalan {remaining} / {limit}',

        // Faydalar
        benefits: {
            free: {
                dailyGenerations: '5 günlük güvenli üretim',
                dailyGenerationsDesc: 'AI dirençli teknoloji',
                decentralizedData: 'Merkezi olmayan veri işleme',
                decentralizedDataDesc: 'Verileriniz gizli kalır',
                webApp: 'Web uygulaması olarak mevcut',
                webAppDesc: 'Her yerden güvenli erişim'
            },
            pro: {
                unlimitedGenerations: 'Sınırsız güvenli üretim',
                unlimitedGenerationsDesc: 'Günlük limit yok',
                aiThreatDetection: 'AI destekli tehdit algılama',
                aiThreatDetectionDesc: 'Proaktif güvenlik analizi',
                prioritySupport: 'Öncelikli destek',
                prioritySupportDesc: 'Sorulara hızlı yardım',
                browserExtension: 'Tarayıcı uzantısı (Q4 2025)',
                browserExtensionDesc: 'Webde her yerde güvenlik',
                wordpressPlugin: 'WordPress eklentisi (Q4 2025)',
                wordpressPluginDesc: 'Güvenliği web sitenize entegre edin'
            }
        },

        // Yardım bölümü
        help: {
            title: '💡 Yardıma mı ihtiyacınız var?',
            spamFolder: '• E-postayı görmüyorsanız spam klasörünü kontrol edin',
            magicLinkExpiry: '• Sihirli bağlantılar 15 dakika sonra sona erer',
            requestNewLink:
                '• İstediğiniz zaman yeni bir bağlantı isteyebilirsiniz',
            noPassword: '• Şifre gerekmez - sadece bağlantıya tıklayın'
        },

        // Alt bilgi
        footer: {
            magicLink: 'Sihirli bağlantı',
            instantSetup: 'Anında Kurulum',
            noSpam: 'Spam Yok',
            text: 'Sihirli bağlantılar e-posta ile gönderilir ve 15 dakika geçerlidir.',
            privacy: 'Verileriniz güvenli bir şekilde işlenir.'
        },

        // Limitler ve mesajlar
        canStillGenerate: 'Hala emoji üretebilirsiniz!',
        limitReached:
            "Günlük limite ulaşıldı. Sınırsız üretim için PRO'ya yükseltin.",

        // Hesap yaşı
        accountAge: {
            today: 'Bugün oluşturuldu',
            yesterday: 'Dün oluşturuldu',
            days: '{days} gün öncesinden',
            weeks: '{weeks} hafta{plural} öncesinden',
            months: '{months} ay{plural} öncesinden',
            years: '{years} yıl{plural} öncesinden',
            accountSince: '{days} {unit} öncesinden hesap',
            since: '{days} {unit} öncesinden',
            day: 'gün',
            daysLabel: 'gün',
            accountCreated: 'Hesap oluşturuldu'
        },

        // Doğrulama
        validation: {
            emailInvalid: 'Geçerli bir e-posta adresi girin',
            nameInvalid: 'Adınızı girin (en az 2 karakter)'
        },

        // Mesajlar
        messages: {
            settingsReset: 'Ayarlar varsayılana sıfırlandı',
            exportFailed: 'Ayarları dışa aktarma başarısız',
            settingsExported: 'Ayarlar başarıyla dışa aktarıldı',
            freeAccountActivated: 'Ücretsiz hesap etkinleştirildi!'
        },

        // Yükseltme bölümü
        upgrade: {
            upgradeToPro: "Pro'ya Yükselt",
            upgradeToProForFeatures:
                "Gelişmiş özellikler için Pro'ya yükseltin",
            unlimitedGenerations:
                'Sınırsız üretim ve gelişmiş güvenlik özellikleri'
        },

        // Bağlam menüsü
        contextMenu: {
            exportSettings: 'Ayarları Dışa Aktar',
            importSettings: 'Ayarları İçe Aktar',
            resetToDefault: 'Varsayılana Sıfırla',
            logout: 'Çıkış Yap',
            settingsMenu: 'Ayarlar menüsü'
        },

        // Özellikler
        features: {
            proFeature: 'Pro Özelliği'
        },

        // Pro Özelliği Modal
        proFeatureModal: {
            title: 'Pro Özelliği',
            proBenefits: 'Pro Faydaları:',
            unlimitedGenerations: 'Sınırsız emoji üretimi',
            advancedSecurity: 'Gelişmiş güvenlik özellikleri',
            prioritySupport: 'Öncelikli destek',
            earlyAccess: 'Yeni özelliklere erken erişim',
            maybeLater: 'Belki Daha Sonra',
            upgradeToPro: "Pro'ya Yükselt",
            // Pro Yükseltme özel
            proUpgrade: 'Pro Yükseltme',
            unlockAdvancedFeatures: 'Tüm gelişmiş özellikleri ve ayarları açın',
            upgradeProNow: "💎 Şimdi Pro'ya Yükselt"
        },

        // Hesap seviyeleri
        tiers: {
            free: 'ÜCRETSİZ',
            pro: 'PRO',
            freeAccount: 'Ücretsiz Hesap',
            proAccount: 'Pro Hesap'
        },

        // Rozetler
        freeBadge: '✨ ÜCRETSİZ',
        proBadge: '💎 PRO',

        // Açıklamalar
        freeDescription: '✨ Ücretsiz Güvenlik',
        proDescription: '💎 Kurumsal Güvenlik'
    },

    // Genel UI metinleri
    ui: {
        save: 'Kaydet',
        cancel: 'İptal',
        reset: 'Sıfırla',
        export: 'Dışa aktar',
        import: 'İçe aktar',
        delete: 'Sil',
        edit: 'Düzenle',
        add: 'Ekle',
        remove: 'Kaldır',
        search: 'Ara',
        filter: 'Filtrele',
        sort: 'Sırala',
        refresh: 'Yenile',
        back: 'Geri',
        next: 'İleri',
        previous: 'Önceki',
        submit: 'Gönder',
        loading: 'Yükleniyor...',
        error: 'Hata',
        success: 'Başarılı',
        warning: 'Uyarı',
        info: 'Bilgi'
    }
};
