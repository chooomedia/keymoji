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
            'AI emoji hikayeniz için "📝 Hikaye" tıklayın 📖',
            '"Rastgele" kendini açıklıyor 😜.',
            'Oluşturulduktan sonra panoya kaydedilir! 📋'
        ],
        backToMainText: 'Geri dönmek için aşağıya tıklayın 👇',
        backToMainButtonText: 'Ana görünüme geri dön 🔙',
        contactText: 'Bir sorunuz veya harika bir öneriniz var mı?',
        contactButtonText: 'Bana mesaj gönderin! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            "Oluşturulan emoji şifresini panoya kopyalamak için tıklayın veya Enter'a basın",
        successMessage: 'Başarılı, panoya kopyalandı 💾',
        errorMessage: 'Ups, bir şeyler ters gitti 🤖',
        dailyLimitReachedMessage: 'Üzgünüz, günlük istek limitine ulaşıldı 😔',
        successStoryMessage: 'Başarılı, Emoji hikayesi oluşturuldu 🤖',
        errorStoryMessage: 'Hata, sunucudan yanıt yok 🌀',
        emojiDisplayTitle: 'Emoji Şifre Üreticisi',
        dataPrivacyProcessingInfo:
            "🚀 Webhook'lar ve AI ile emoji sihri! ✨ Veriler plaj kumu gibi - kalmaz.",
        clearButton: '✖️ Temizle',
        storyButton: '📝 Hikaye',
        storyButtonClicked: '📩 Hikaye gönder',
        randomButton: '🎲 Rastgele',
        placeholderText:
            'Bana bir hikaye anlatın ve ona dayalı emoji şifreleri oluşturayım...'
    },
    donateButton: {
        text: 'Bana bir kahve al',
        openText: 'Bu menüyü kapat',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'Merhaba, ben Christopher',
        pageDescription:
            'Frontend geliştirici ve JavaScript, PHP ve HTML ile kullanıcı dostu web siteleri tasarlamayı ve kodlamayı seviyorum. Çekinmeyin ve isterseniz bana mesaj gönderin.',
        nameLabel: '🧑🏻 Adınız',
        emailLabel: '📧 E-postanız',
        messageLabel: '✍🏻 Mesajınız',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Gönder',
        sendingButton: '📨 Gönderiliyor...',
        successMessage: 'Başarılı, mesaj gönderildi - Cevap: < 24 saat 🚀',
        errorMessage: 'Beklenmeyen bir hata oluştu 😟',
        requestErrorMessage:
            'Mesaj gönderilirken hata oluştu, lütfen tekrar deneyin 🙁',
        smirkingFaceImageAlt: 'keymoji emoji sırıtan yüz 1f60f',
        introductionTitle: 'Bir sorunuz veya harika bir öneriniz mi var?',
        introductionText: 'Bana mesaj gönderin!',
        privacyNotice:
            'Emin olun, verileriniz bizimle güvenli ellerde 🤲. Detaylarınız üçüncü taraflara aktarılmayacak 🔒.',
        newsletterLabel: 'Evet, bültene abone olmak istiyorum',
        backToMainButton: 'Ana sayfaya dön',
        footerText: 'Sevgiyle geliştirildi',
        validationErrorMessage:
            'Lütfen göndermeden önce form hatalarını düzeltin 🔍',
        sendingMessage: 'Mesajınız gönderiliyor... 📨',
        emailText: {
            greeting: 'Hoş geldiniz',
            intro: 'Mesaj gönderdiğiniz için teşekkürler 📩!',
            confirmationText:
                "Lütfen Christopher'ın sizin akıllı bir bot olmadığınızı bilmesi için isteğinizi onaylayın. Aşağıdaki verilerle bir mesaj gönderdiniz:",
            doubleCheck: 'Mesajınızı aşağıdaki ayrıntılarla aldık:',
            button: 'E-postanızı onaylayın',
            subject: "Keymoji'ye gönderdiğiniz mesaj alındı",
            privacy: 'Verileriniz güvenli bir şekilde işlenir.'
        },
        validation: {
            nameRequired: 'Ad gerekli',
            nameLength: 'En az 2 karakter',
            emailRequired: 'E-posta gerekli',
            emailInvalid: 'Geçersiz e-posta',
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
        pageTitle: '404 - Sayfa bulunamadı',
        pageDescription: 'Aradığınız sayfa mevcut değil veya taşınmış.',
        message: 'Ups! Sayfa bulunamadı 🚫',
        suggestion:
            'Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.',
        backButton: 'Ana sayfaya dön',
        contactButton: 'Bizimle iletişime geçin',
        navigationTitle: 'Mevcut sayfalar',
        recentEmojis: 'Son emojiler'
    },
    blog: {
        readMore: 'Devamını oku',
        backToBlog: 'Bloga geri dön',
        publishedOn: 'Yayınlanma tarihi',
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
        closeModal: "Modal'ı kapat",
        openMenu: 'Menüyü aç',
        closeMenu: 'Menüyü kapat',
        loading: 'Yükleniyor...',
        error: 'Hata oluştu',
        success: 'Başarılı',
        warning: 'Uyarı',
        info: 'Bilgi',
        copyToClipboard: 'Panoya kopyala',
        copiedToClipboard: 'Panoya kopyalandı',
        generatePassword: 'Şifre oluştur',
        clearForm: 'Formu temizle',
        sendMessage: 'Mesaj gönder',
        toggleDarkMode: 'Karanlık modu değiştir',
        toggleLanguage: 'Dili değiştir'
    },
    validation: {
        required: 'Bu alan zorunludur',
        email: 'Lütfen geçerli bir e-posta adresi girin',
        minLength: 'En az {min} karakter içermelidir',
        maxLength: '{max} karakterden fazla olamaz',
        invalidFormat: 'Geçersiz format',
        serverError: 'Sunucu hatası, lütfen tekrar deneyin',
        networkError: 'Ağ hatası, bağlantınızı kontrol edin'
    },
    versions: {
        pageTitle: 'Sürüm Geçmişi',
        pageDescription:
            'Keymoji, emoji şifre üreticisinin geliştirme geçmişini ve değişiklik günlüğünü kontrol edin.'
    }
};
