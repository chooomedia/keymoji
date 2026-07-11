<script>
    import { onMount, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import {
        showModalWithContent,
        closeModal,
        isModalVisible
    } from '../../stores/modalStore';
    import { currentLanguage } from '../../stores/contentStore.js';
    import { STORAGE_KEYS, storageHelpers } from '../../config/storage.js';
    import { consentStore, hasConsented } from '../../stores/consentStore.js';

    const PROMO_DELAY_MS = 10000;
    const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
    const EXIT_INTENT_TOP_THRESHOLD_PX = 18;
    const OPEN_EXTENSION_PROMO_EVENT = 'keymoji:open-extension-promo';
    const SESSION_KEY = 'keymoji_extension_promo_seen_session';
    const CHROME_EXTENSION_URL = 'https://chromewebstore.google.com/';
    const EDGE_EXTENSION_URL = 'https://microsoftedge.microsoft.com/addons/';
    const FIREFOX_EXTENSION_URL = 'https://addons.mozilla.org/firefox/';
    const BRAVE_EXTENSION_URL = CHROME_EXTENSION_URL;

    const browserIcons = {
        chrome: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg',
        edge: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg',
        firefox: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg',
        brave: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Brave_lion_icon.svg'
    };

    let delayTimer = null;
    let consentUnsubscribe = null;
    let hasShown = false;
    let autoTimerStarted = false;

    const promoCopy = {
        en: {
            title: 'Create secure emoji passwords without leaving the signup field.',
            eyebrow: 'Keymoji for your browser',
            body:
                'Create an emoji password directly inside password fields. Local, fast, and only when you confirm.',
            proof: 'No account. No tracking. No generated Keymojis sent to servers.',
            primary: 'Open',
            secondary: 'Maybe later'
        },
        de: {
            title: 'Erstelle sichere Emoji-Passwörter direkt im Anmeldefeld.',
            eyebrow: 'Keymoji im Browser',
            body:
                'Erstelle ein Emoji-Passwort direkt im Passwortfeld. Lokal, schnell und nur nach deiner Bestätigung.',
            proof:
                'Kein Account. Kein Tracking. Keine generierten Keymojis auf Servern.',
            primary: 'Öffnen',
            secondary: 'Vielleicht später'
        },
        'de-CH': {
            title: 'Erstell sicheri Emoji-Passwörter direkt im Aamäldefäld.',
            eyebrow: 'Keymoji im Browser',
            body:
                'Erstell es Emoji-Passwort direkt im Passwortfeld. Lokal, schnäll und nume nach diner Bestätigung.',
            proof:
                'Kein Account. Kei Tracking. Kei generierte Keymojis uf Server.',
            primary: 'Öffne',
            secondary: 'Villicht spöter'
        },
        es: {
            title: 'Crea contraseñas emoji seguras sin salir del formulario.',
            eyebrow: 'Keymoji en tu navegador',
            body:
                'Crea una contraseña emoji directamente en campos de contraseña. Local, rápido y solo con tu confirmación.',
            proof:
                'Sin cuenta. Sin seguimiento. Sin enviar Keymojis generados a servidores.',
            primary: 'Abrir',
            secondary: 'Quizá más tarde'
        },
        nl: {
            title: 'Maak veilige emoji-wachtwoorden direct in het aanmeldveld.',
            eyebrow: 'Keymoji in je browser',
            body:
                'Maak een emoji-wachtwoord direct in wachtwoordvelden. Lokaal, snel en alleen na jouw bevestiging.',
            proof:
                'Geen account. Geen tracking. Geen gegenereerde Keymojis naar servers.',
            primary: 'Openen',
            secondary: 'Misschien later'
        },
        it: {
            title: 'Crea password emoji sicure direttamente nel campo di accesso.',
            eyebrow: 'Keymoji nel browser',
            body:
                'Crea una password emoji direttamente nei campi password. Locale, veloce e solo dopo la tua conferma.',
            proof:
                'Nessun account. Nessun tracking. Nessun Keymoji generato inviato ai server.',
            primary: 'Apri',
            secondary: 'Forse dopo'
        },
        fr: {
            title: 'Créez des mots de passe emoji sécurisés directement dans le champ.',
            eyebrow: 'Keymoji dans votre navigateur',
            body:
                'Créez un mot de passe emoji directement dans les champs de mot de passe. Local, rapide et uniquement après confirmation.',
            proof:
                'Pas de compte. Pas de suivi. Aucun Keymoji généré envoyé aux serveurs.',
            primary: 'Ouvrir',
            secondary: 'Peut-être plus tard'
        },
        pl: {
            title: 'Twórz bezpieczne hasła emoji bez opuszczania formularza.',
            eyebrow: 'Keymoji w przeglądarce',
            body:
                'Twórz hasło emoji bezpośrednio w polach hasła. Lokalnie, szybko i tylko po potwierdzeniu.',
            proof:
                'Bez konta. Bez śledzenia. Bez wysyłania wygenerowanych Keymoji na serwery.',
            primary: 'Otwórz',
            secondary: 'Może później'
        },
        ru: {
            title: 'Создавайте безопасные emoji-пароли прямо в поле входа.',
            eyebrow: 'Keymoji в браузере',
            body:
                'Создавайте emoji-пароль прямо в поле пароля. Локально, быстро и только после подтверждения.',
            proof:
                'Без аккаунта. Без трекинга. Сгенерированные Keymoji не отправляются на серверы.',
            primary: 'Открыть',
            secondary: 'Позже'
        },
        tr: {
            title: 'Güvenli emoji parolaları kayıt alanından ayrılmadan oluştur.',
            eyebrow: 'Tarayıcıda Keymoji',
            body:
                'Emoji parolayı doğrudan parola alanında oluştur. Yerel, hızlı ve yalnızca onayınla.',
            proof:
                'Hesap yok. Takip yok. Oluşturulan Keymojiler sunucuya gönderilmez.',
            primary: 'Aç',
            secondary: 'Belki sonra'
        },
        af: {
            title: 'Skep veilige emoji-wagwoorde direk in die aanmeldveld.',
            eyebrow: 'Keymoji in jou blaaier',
            body:
                'Skep ’n emoji-wagwoord direk in wagwoordvelde. Plaaslik, vinnig en net ná jou bevestiging.',
            proof:
                'Geen rekening. Geen opsporing. Geen gegenereerde Keymojis na bedieners nie.',
            primary: 'Maak oop',
            secondary: 'Miskien later'
        },
        ja: {
            title: '入力欄を離れずに安全な絵文字パスワードを作成。',
            eyebrow: 'ブラウザでKeymoji',
            body:
                'パスワード欄の中で絵文字パスワードを作成。ローカル、高速、確認後のみ挿入します。',
            proof:
                'アカウント不要。トラッキングなし。生成されたKeymojiはサーバーに送信されません。',
            primary: '開く',
            secondary: 'あとで'
        },
        ko: {
            title: '가입 입력란을 떠나지 않고 안전한 이모지 비밀번호를 만드세요.',
            eyebrow: '브라우저 속 Keymoji',
            body:
                '비밀번호 입력란 안에서 바로 이모지 비밀번호를 만드세요. 로컬, 빠름, 확인 후에만 삽입됩니다.',
            proof:
                '계정 없음. 추적 없음. 생성된 Keymoji는 서버로 전송되지 않습니다.',
            primary: '열기',
            secondary: '나중에'
        },
        tlh: {
            title: "mu' pegh DaqDaq Keymoji tIqawlaH.",
            eyebrow: 'BrowserDaq Keymoji',
            body:
                "Emoji mu' pegh DaqDaq chenmoH. DaqvamDaq, nom, SoH DIchmoHpu'DI' neH lan.",
            proof:
                "Account pagh. Tracking pagh. Keymoji chenmoHlu'pu'bogh jabwI'Daq ngeHbe'.",
            primary: 'poSmoH',
            secondary: 'ghIq'
        },
        sjn: {
            title: 'Create secure emoji passwords without leaving the signup field.',
            eyebrow: 'Keymoji for your browser',
            body:
                'Create an emoji password directly inside password fields. Local, fast, and only when you confirm.',
            proof: 'No account. No tracking. No generated Keymojis sent to servers.',
            primary: 'Open',
            secondary: 'Maybe later'
        }
    };

    function getCopy() {
        return promoCopy[$currentLanguage] || promoCopy.en;
    }

    function getBrowserTargets(copy) {
        return [
            {
                id: 'chrome',
                name: 'Chrome',
                label: 'Chrome',
                href: CHROME_EXTENSION_URL,
                iconSrc: browserIcons.chrome
            },
            {
                id: 'edge',
                name: 'Edge',
                label: 'Edge',
                href: EDGE_EXTENSION_URL,
                iconSrc: browserIcons.edge
            },
            {
                id: 'firefox',
                name: 'Firefox',
                label: 'Firefox',
                href: FIREFOX_EXTENSION_URL,
                iconSrc: browserIcons.firefox
            },
            {
                id: 'brave',
                name: 'Brave',
                label: 'Brave',
                href: BRAVE_EXTENSION_URL,
                iconSrc: browserIcons.brave
            }
        ];
    }

    function hasRecentlySeenPromo() {
        const dismissed = storageHelpers.get(
            STORAGE_KEYS.EXTENSION_PROMO_DISMISSED,
            null
        );

        if (!dismissed?.timestamp) {
            return false;
        }

        return Date.now() - dismissed.timestamp < DISMISS_COOLDOWN_MS;
    }

    function markPromoSeen(reason) {
        storageHelpers.set(STORAGE_KEYS.EXTENSION_PROMO_DISMISSED, {
            timestamp: Date.now(),
            reason
        });
        sessionStorage.setItem(SESSION_KEY, 'true');
    }

    function shouldSkipPromo() {
        if (typeof window === 'undefined') {
            return true;
        }

        const path = window.location.pathname;
        const excludedPath =
            path.includes('/account') ||
            path.includes('/contact') ||
            path.includes('/privacy') ||
            path.includes('/legal') ||
            path.includes('/impressum');

        return (
            excludedPath ||
            hasShown ||
            !hasConsented() ||
            get(isModalVisible) ||
            sessionStorage.getItem(SESSION_KEY) === 'true' ||
            hasRecentlySeenPromo()
        );
    }

    function openExtensionPage(target) {
        markPromoSeen('primary-cta');
        window.open(target?.href || CHROME_EXTENSION_URL, '_blank', 'noopener,noreferrer');
        closeModal();
    }

    function dismissPromo() {
        markPromoSeen('secondary-dismiss');
        closeModal();
    }

    function showExtensionPromo(trigger, force = false) {
        if (!force && shouldSkipPromo()) {
            return;
        }

        if (force && get(isModalVisible)) {
            closeModal();
        }

        const copy = getCopy();
        const browserTargets = getBrowserTargets(copy);
        hasShown = true;
        markPromoSeen(trigger);

        showModalWithContent(
            {
                html: `
                    <div style="display:grid;gap:12px;">
                        <p style="font-size:18px;line-height:1.25;font-weight:800;margin:0;color:inherit;">${copy.title}</p>
                        <p style="margin:0;color:inherit;opacity:.82;">${copy.body}</p>
                    </div>
                `
            },
            {
                title: copy.eyebrow,
                icon: '🔥',
                type: 'info',
                duration: null,
                browserTargets,
                selectedBrowserId: 'chrome',
                proofText: copy.proof,
                primaryButton: {
                    text: copy.primary,
                    action: openExtensionPage
                },
                secondaryButton: {
                    text: copy.secondary,
                    action: dismissPromo
                }
            }
        );
    }

    function startAutoPromoTimer() {
        if (autoTimerStarted || !hasConsented()) {
            return;
        }

        autoTimerStarted = true;
        delayTimer = setTimeout(() => {
            showExtensionPromo('10-second-delay');
        }, PROMO_DELAY_MS);
    }

    function handleOpenExtensionPromoEvent() {
        showExtensionPromo('header-announcement', true);
    }

    function handleMouseLeave(event) {
        if (
            event.clientY <= EXIT_INTENT_TOP_THRESHOLD_PX &&
            window.innerWidth >= 768 &&
            hasConsented()
        ) {
            showExtensionPromo('exit-intent');
        }
    }

    onMount(() => {
        startAutoPromoTimer();
        consentUnsubscribe = consentStore.subscribe(() => startAutoPromoTimer());
        window.addEventListener(OPEN_EXTENSION_PROMO_EVENT, handleOpenExtensionPromoEvent);
        document.addEventListener('mouseleave', handleMouseLeave);
    });

    onDestroy(() => {
        if (delayTimer) {
            clearTimeout(delayTimer);
            delayTimer = null;
        }

        if (consentUnsubscribe) {
            consentUnsubscribe();
            consentUnsubscribe = null;
        }

        window.removeEventListener(OPEN_EXTENSION_PROMO_EVENT, handleOpenExtensionPromoEvent);
        document.removeEventListener('mouseleave', handleMouseLeave);
    });
</script>
