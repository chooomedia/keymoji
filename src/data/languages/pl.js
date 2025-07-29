// src/data/languages/pl.js
// Polish language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'pl',
        name: 'Polish',
        nativeName: 'Polski',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Otwórz menu główne',
        closeMainMenu: 'Zamknij menu główne'
    },
    index: {
        pageTitle: 'Generator Haseł Emoji',
        pageDescription:
            '🔑 Hasła na nowo wymyślone. 🎯 Niezniszczalne hasła emoji. 🌈 Darmowe. Bezpieczne. Innowacyjne. 🤖 Technologia odporna na AI. 🌍 Dostępne w 15+ językach.',
        pageKeywords:
            'Keymoji, hasło emoji, generator haseł, bezpieczeństwo, bezpieczeństwo online',
        pageInstruction: [
            'Kliknij "📝 Historia" dla swojej opowieści emoji AI 📖',
            '"Losowe" jest samooczywiste 😜.',
            'Po wygenerowaniu jest zapisane w schowku! 📋'
        ],
        backToMainText: 'Kliknij poniżej 👇 aby wrócić',
        backToMainButtonText: 'Powrót do widoku głównego 🔙',
        contactText: 'Masz pytanie lub fajną sugestię?',
        contactButtonText: 'Wyślij mi wiadomość! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Kliknij lub naciśnij Enter aby skopiować wygenerowane hasło emoji do schowka',
        successMessage: 'Sukces, skopiowane do schowka 💾',
        errorMessage: 'Ups, coś poszło nie tak 🤖',
        dailyLimitReachedMessage:
            'Przepraszamy, dzienny limit żądań osiągnięty 😔',
        successStoryMessage: 'Sukces, historia emoji wygenerowana 🤖',
        errorStoryMessage: 'Błąd, brak odpowiedzi z serwera 🌀',
        emojiDisplayTitle: 'Generator Haseł Emoji',
        dataPrivacyProcessingInfo:
            '🚀 Magia emoji przez webhooki i AI! ✨ Dane są jak piasek na plaży - nie zostają.',
        clearButton: '✖️ Wyczyść',
        storyButton: '📝 Historia',
        storyButtonClicked: '📩 Wyślij historię',
        randomButton: '🎲 Losowe',
        placeholderText:
            'Opowiedz mi historię a wygeneruję hasła emoji na jej podstawie...'
    },
    donateButton: {
        text: 'Kup mi kawę',
        openText: 'Zamknij to menu',
        textMobile: '☕'
    },
    contactForm: {
        nameLabel: '🧑🏻 Twoje imię',
        emailLabel: '📧 Twój email',
        messageLabel: '✍🏻 Twoja wiadomość',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Wyślij',
        successMessage:
            'Sukces, wiadomość wysłana - Odpowiedź: < 24 godziny 🚀',
        errorMessage: 'Wystąpił nieoczekiwany błąd 😟',
        requestErrorMessage:
            'Błąd podczas wysyłania wiadomości, spróbuj ponownie 🙁',
        smirkingFaceImageAlt: 'keymoji emoji uśmiechnięta twarz 1f60f',
        introductionTitle: 'Cześć, jestem Christopher',
        introductionText:
            'Deweloper frontend i uwielbiam projektować i kodować przyjazne użytkownikowi strony internetowe z JavaScript, PHP i HTML. Nie wahaj się i wyślij mi wiadomość jeśli chcesz.',
        privacyNotice:
            'Bądź pewien, twoje dane są w dobrych rękach z nami 🤲. Twoje szczegóły nie będą przekazane osobom trzecim 🔒.',
        newsletterLabel: 'Tak, chciałbym zasubskrybować newsletter',
        emailText: {
            greeting: 'Witamy',
            intro: 'Dziękujemy za wysłanie wiadomości 📩!',
            confirmationText:
                'Proszę potwierdź swoje żądanie żeby Christopher wiedział że nie jesteś inteligentnym botem. Wysłałeś wiadomość z następującymi danymi:'
        }
    },
    serviceWorker: {
        updateAvailable: 'Dostępna jest nowa wersja!',
        manualRefreshNeeded:
            'Nowa wersja aktywowana. Przeładuj teraz dla najnowszych funkcji.',
        updateSuccess: 'Aplikacja pomyślnie zaktualizowana! 🎉'
    },
    notFound: {
        message: 'Ups! Strona nie znaleziona 🚫',
        backButton: 'Wróć do strony głównej',
        contactButton: 'Skontaktuj się z nami'
    },
    blog: {
        readMore: 'Czytaj więcej',
        backToBlog: 'Wróć do bloga',
        publishedOn: 'Opublikowano',
        author: 'Autor',
        tags: 'Tagi',
        readTime: 'min czytania',
        likes: 'polubienia',
        share: 'Udostępnij'
    },
    account: {
        create: 'Utwórz konto',
        manage: 'Zarządzaj kontem',
        login: 'Zaloguj się',
        logout: 'Wyloguj się',
        profile: 'Profil',
        settings: 'Ustawienia',
        guest: 'Gość',
        free: 'DARMOWE',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Przejdź do głównej zawartości',
        closeModal: 'Zamknij modal',
        openMenu: 'Otwórz menu',
        closeMenu: 'Zamknij menu',
        loading: 'Ładowanie...',
        error: 'Wystąpił błąd',
        success: 'Sukces',
        warning: 'Ostrzeżenie',
        info: 'Informacja',
        copyToClipboard: 'Kopiuj do schowka',
        copiedToClipboard: 'Skopiowane do schowka',
        generatePassword: 'Generuj hasło',
        clearForm: 'Wyczyść formularz',
        sendMessage: 'Wyślij wiadomość',
        toggleDarkMode: 'Przełącz tryb ciemny',
        toggleLanguage: 'Przełącz język'
    },
    validation: {
        required: 'To pole jest wymagane',
        email: 'Wprowadź prawidłowy adres email',
        minLength: 'Musi zawierać co najmniej {min} znaków',
        maxLength: 'Nie może zawierać więcej niż {max} znaków',
        invalidFormat: 'Nieprawidłowy format',
        serverError: 'Błąd serwera, spróbuj ponownie',
        networkError: 'Błąd sieci, sprawdź połączenie'
    }
};
