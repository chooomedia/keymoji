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

    const PROMO_DELAY_MS = 10000;
    const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
    const EXIT_INTENT_TOP_THRESHOLD_PX = 18;
    const SESSION_KEY = 'keymoji_extension_promo_seen_session';
    const EXTENSION_URL = 'https://keymoji.wtf/extension-privacy.html';

    let delayTimer = null;
    let hasShown = false;

    const promoCopy = {
        en: {
            title: 'Keymoji now works where passwords happen.',
            eyebrow: 'New browser extension',
            body:
                'Create an emoji password directly inside password fields. Local, fast, and only when you confirm.',
            proof: 'No account. No tracking. No generated Keymojis sent to servers.',
            primary: 'See the extension',
            secondary: 'Maybe later'
        },
        de: {
            title: 'Keymoji funktioniert jetzt dort, wo Passwörter entstehen.',
            eyebrow: 'Neue Browser Extension',
            body:
                'Erstelle ein Emoji-Passwort direkt im Passwortfeld. Lokal, schnell und nur nach deiner Bestätigung.',
            proof:
                'Kein Account. Kein Tracking. Keine generierten Keymojis auf Servern.',
            primary: 'Extension ansehen',
            secondary: 'Vielleicht später'
        },
        'de-CH': {
            title: 'Keymoji funktioniert jetzt genau det, wo Passwörter entstönd.',
            eyebrow: 'Neui Browser-Erwiiterig',
            body:
                'Erstell es Emoji-Passwort direkt im Passwortfeld. Lokal, schnäll und nume nach diner Bestätigung.',
            proof:
                'Kein Account. Kei Tracking. Kei generierte Keymojis uf Server.',
            primary: 'Erwiiterig aluege',
            secondary: 'Villicht spöter'
        },
        es: {
            title: 'Keymoji ahora funciona donde nacen las contraseñas.',
            eyebrow: 'Nueva extensión del navegador',
            body:
                'Crea una contraseña emoji directamente en campos de contraseña. Local, rápido y solo con tu confirmación.',
            proof:
                'Sin cuenta. Sin seguimiento. Sin enviar Keymojis generados a servidores.',
            primary: 'Ver la extensión',
            secondary: 'Quizá más tarde'
        },
        nl: {
            title: 'Keymoji werkt nu waar wachtwoorden ontstaan.',
            eyebrow: 'Nieuwe browserextensie',
            body:
                'Maak een emoji-wachtwoord direct in wachtwoordvelden. Lokaal, snel en alleen na jouw bevestiging.',
            proof:
                'Geen account. Geen tracking. Geen gegenereerde Keymojis naar servers.',
            primary: 'Bekijk de extensie',
            secondary: 'Misschien later'
        },
        it: {
            title: 'Keymoji ora funziona dove nascono le password.',
            eyebrow: 'Nuova estensione browser',
            body:
                'Crea una password emoji direttamente nei campi password. Locale, veloce e solo dopo la tua conferma.',
            proof:
                'Nessun account. Nessun tracking. Nessun Keymoji generato inviato ai server.',
            primary: "Vedi l'estensione",
            secondary: 'Forse dopo'
        },
        fr: {
            title: 'Keymoji fonctionne maintenant là où naissent les mots de passe.',
            eyebrow: 'Nouvelle extension navigateur',
            body:
                'Créez un mot de passe emoji directement dans les champs de mot de passe. Local, rapide et uniquement après confirmation.',
            proof:
                'Pas de compte. Pas de suivi. Aucun Keymoji généré envoyé aux serveurs.',
            primary: "Voir l'extension",
            secondary: 'Peut-être plus tard'
        },
        pl: {
            title: 'Keymoji działa teraz tam, gdzie powstają hasła.',
            eyebrow: 'Nowe rozszerzenie przeglądarki',
            body:
                'Twórz hasło emoji bezpośrednio w polach hasła. Lokalnie, szybko i tylko po potwierdzeniu.',
            proof:
                'Bez konta. Bez śledzenia. Bez wysyłania wygenerowanych Keymoji na serwery.',
            primary: 'Zobacz rozszerzenie',
            secondary: 'Może później'
        },
        ru: {
            title: 'Keymoji теперь работает там, где создаются пароли.',
            eyebrow: 'Новое расширение браузера',
            body:
                'Создавайте emoji-пароль прямо в поле пароля. Локально, быстро и только после подтверждения.',
            proof:
                'Без аккаунта. Без трекинга. Сгенерированные Keymoji не отправляются на серверы.',
            primary: 'Посмотреть расширение',
            secondary: 'Позже'
        },
        tr: {
            title: 'Keymoji artık parolaların oluşturulduğu yerde çalışır.',
            eyebrow: 'Yeni tarayıcı uzantısı',
            body:
                'Emoji parolayı doğrudan parola alanında oluştur. Yerel, hızlı ve yalnızca onayınla.',
            proof:
                'Hesap yok. Takip yok. Oluşturulan Keymojiler sunucuya gönderilmez.',
            primary: 'Uzantıyı gör',
            secondary: 'Belki sonra'
        },
        af: {
            title: 'Keymoji werk nou waar wagwoorde begin.',
            eyebrow: 'Nuwe blaaieruitbreiding',
            body:
                'Skep ’n emoji-wagwoord direk in wagwoordvelde. Plaaslik, vinnig en net ná jou bevestiging.',
            proof:
                'Geen rekening. Geen opsporing. Geen gegenereerde Keymojis na bedieners nie.',
            primary: 'Sien die uitbreiding',
            secondary: 'Miskien later'
        },
        ja: {
            title: 'Keymojiがパスワード入力欄で使えるようになりました。',
            eyebrow: '新しいブラウザ拡張',
            body:
                'パスワード欄の中で絵文字パスワードを作成。ローカル、高速、確認後のみ挿入します。',
            proof:
                'アカウント不要。トラッキングなし。生成されたKeymojiはサーバーに送信されません。',
            primary: '拡張機能を見る',
            secondary: 'あとで'
        },
        ko: {
            title: 'Keymoji가 이제 비밀번호가 만들어지는 곳에서 작동합니다.',
            eyebrow: '새 브라우저 확장',
            body:
                '비밀번호 입력란 안에서 바로 이모지 비밀번호를 만드세요. 로컬, 빠름, 확인 후에만 삽입됩니다.',
            proof:
                '계정 없음. 추적 없음. 생성된 Keymoji는 서버로 전송되지 않습니다.',
            primary: '확장 보기',
            secondary: '나중에'
        },
        tlh: {
            title: "DaH mu' pegh DaqDaq Keymoji Qap.",
            eyebrow: "Browser QulwI' chu'",
            body:
                "Emoji mu' pegh DaqDaq chenmoH. DaqvamDaq, nom, SoH DIchmoHpu'DI' neH lan.",
            proof:
                "Account pagh. Tracking pagh. Keymoji chenmoHlu'pu'bogh jabwI'Daq ngeHbe'.",
            primary: "QulwI' legh",
            secondary: 'ghIq'
        },
        sjn: {
            title: 'Keymoji now works where passwords happen.',
            eyebrow: 'New browser extension',
            body:
                'Create an emoji password directly inside password fields. Local, fast, and only when you confirm.',
            proof: 'No account. No tracking. No generated Keymojis sent to servers.',
            primary: 'See the extension',
            secondary: 'Maybe later'
        }
    };

    function getCopy() {
        return promoCopy[$currentLanguage] || promoCopy.en;
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
            path.includes('/impressum') ||
            path.includes('/extension-privacy');

        return (
            excludedPath ||
            hasShown ||
            get(isModalVisible) ||
            sessionStorage.getItem(SESSION_KEY) === 'true' ||
            hasRecentlySeenPromo()
        );
    }

    function openExtensionPage() {
        markPromoSeen('primary-cta');
        window.open(EXTENSION_URL, '_blank', 'noopener,noreferrer');
        closeModal();
    }

    function dismissPromo() {
        markPromoSeen('secondary-dismiss');
        closeModal();
    }

    function showExtensionPromo(trigger) {
        if (shouldSkipPromo()) {
            return;
        }

        const copy = getCopy();
        hasShown = true;
        markPromoSeen(trigger);

        showModalWithContent(
            {
                html: `
                    <div style="display:grid;gap:12px;">
                        <p style="font-size:18px;line-height:1.25;font-weight:800;margin:0;color:inherit;">${copy.title}</p>
                        <p style="margin:0;color:inherit;opacity:.82;">${copy.body}</p>
                        <div style="border-radius:18px;border:1px solid rgba(234,179,8,.35);background:rgba(234,179,8,.12);padding:12px;font-weight:700;">
                            ${copy.proof}
                        </div>
                    </div>
                `
            },
            {
                title: copy.eyebrow,
                icon: '🔑',
                type: 'info',
                duration: null,
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

    function handleMouseLeave(event) {
        if (
            event.clientY <= EXIT_INTENT_TOP_THRESHOLD_PX &&
            window.innerWidth >= 768
        ) {
            showExtensionPromo('exit-intent');
        }
    }

    onMount(() => {
        delayTimer = setTimeout(() => {
            showExtensionPromo('10-second-delay');
        }, PROMO_DELAY_MS);

        document.addEventListener('mouseleave', handleMouseLeave);
    });

    onDestroy(() => {
        if (delayTimer) {
            clearTimeout(delayTimer);
            delayTimer = null;
        }

        document.removeEventListener('mouseleave', handleMouseLeave);
    });
</script>
