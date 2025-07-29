// src/data/languages/ja.js
// Japanese language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'メインメニューを開く',
        closeMainMenu: 'メインメニューを閉じる'
    },
    index: {
        pageTitle: '絵文字パスワードジェネレーター',
        pageDescription:
            '🔑 パスワードを再発明。🎯 破られない絵文字パスワード。🌈 無料。安全。革新的。🤖 AI耐性技術。🌍 15以上の言語で利用可能。',
        pageKeywords:
            'Keymoji, 絵文字パスワード, パスワードジェネレーター, セキュリティ, オンラインセキュリティ',
        pageInstruction: [
            '「📝 ストーリー」をクリックしてAI絵文字物語 📖',
            '「ランダム」は自明です 😜.',
            '生成後、クリップボードに保存されます！📋'
        ],
        backToMainText: '下をクリック 👇 して戻る',
        backToMainButtonText: 'メインビューに戻る 🔙',
        contactText: '質問やクールな提案がありますか？',
        contactButtonText: 'メッセージを送ってください！💌'
    },
    emojiDisplay: {
        clickToCopy:
            'クリックまたはEnterを押して生成された絵文字パスワードをクリップボードにコピー',
        successMessage: '成功、クリップボードにコピーされました 💾',
        errorMessage: 'おっと、何かがうまくいきませんでした 🤖',
        dailyLimitReachedMessage:
            '申し訳ありません、リクエストの日次制限に達しました 😔',
        successStoryMessage: '成功、絵文字ストーリーが生成されました 🤖',
        errorStoryMessage: 'エラー、サーバーからの応答がありません 🌀',
        emojiDisplayTitle: '絵文字パスワードジェネレーター',
        dataPrivacyProcessingInfo:
            '🚀 ウェブフックとAIによる絵文字マジック！✨ データは砂浜の砂のように - 残りません。',
        clearButton: '✖️ クリア',
        storyButton: '📝 ストーリー',
        storyButtonClicked: '📩 ストーリーを送信',
        randomButton: '🎲 ランダム',
        placeholderText:
            'ストーリーを教えてください、それに基づいて絵文字パスワードを生成します...'
    },
    donateButton: {
        text: 'コーヒーを買ってください',
        openText: 'このメニューを閉じる',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'こんにちは、クリストファーです',
        pageDescription:
            'フロントエンド開発者で、JavaScript、PHP、HTMLでユーザーフレンドリーなウェブサイトをデザインしコーディングするのが大好きです。お気軽にメッセージを送ってください。',
        nameLabel: '🧑🏻 お名前',
        emailLabel: '📧 メールアドレス',
        messageLabel: '✍🏻 メッセージ',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 送信',
        sendingButton: '📨 送信中...',
        successMessage: '成功、メッセージが送信されました - 回答: < 24時間 🚀',
        errorMessage: '予期しないエラーが発生しました 😟',
        requestErrorMessage:
            'メッセージの送信中にエラーが発生しました、再試行してください 🙁',
        smirkingFaceImageAlt: 'keymoji 絵文字 にやにや顔 1f60f',
        introductionTitle: '質問や素晴らしい提案がありますか？',
        introductionText: 'メッセージを送ってください！',
        privacyNotice:
            '安心してください、あなたのデータは私たちの手で安全に保管されています 🤲。あなたの詳細は第三者に渡されることはありません 🔒。',
        newsletterLabel: 'はい、ニュースレターに登録したいです',
        backToMainButton: 'ホームに戻る',
        footerText: '愛を込めて開発',
        validationErrorMessage: '送信前にフォームエラーを修正してください 🔍',
        sendingMessage: 'メッセージを送信中... 📨',
        emailText: {
            greeting: 'ようこそ',
            intro: 'メッセージを送信していただきありがとうございます 📩！',
            confirmationText:
                'クリストファーがあなたがインテリジェントなボットではないことを知るために、リクエストを確認してください。以下のデータでメッセージを送信しました：',
            doubleCheck: '以下の詳細でメッセージを受信しました：',
            button: 'メールを確認',
            subject: 'Keymojiへのメッセージが受信されました',
            privacy: 'あなたのデータは安全に処理されます。'
        },
        validation: {
            nameRequired: '名前が必要です',
            nameLength: '最低2文字以上',
            emailRequired: 'メールアドレスが必要です',
            emailInvalid: '無効なメールアドレス',
            messageRequired: 'メッセージが必要です',
            messageLength: '最低{min}文字以上'
        }
    },
    serviceWorker: {
        updateAvailable: '新しいバージョンが利用可能です！',
        manualRefreshNeeded:
            '新しいバージョンがアクティブになりました。最新機能のために今すぐ再読み込みしてください。',
        updateSuccess: 'アプリが正常に更新されました！🎉'
    },
    notFound: {
        pageTitle: '404 - ページが見つかりません',
        pageDescription: 'お探しのページが存在しないか、移動されました。',
        message: 'おっと！ページが見つかりません 🚫',
        suggestion:
            'お探しのページが移動されたか、削除されたか、存在しなかった可能性があります。',
        backButton: 'ホームに戻る',
        contactButton: 'お問い合わせ',
        navigationTitle: '利用可能なページ',
        recentEmojis: '最近の絵文字'
    },
    blog: {
        readMore: '続きを読む',
        backToBlog: 'ブログに戻る',
        publishedOn: '公開日',
        author: '著者',
        tags: 'タグ',
        readTime: '分読み',
        likes: 'いいね',
        share: 'シェア'
    },
    account: {
        create: 'アカウント作成',
        manage: 'アカウント管理',
        login: 'ログイン',
        logout: 'ログアウト',
        profile: 'プロフィール',
        settings: '設定',
        guest: 'ゲスト',
        free: '無料',
        pro: 'プロ'
    },
    accessibility: {
        skipToMain: 'メインコンテンツにスキップ',
        closeModal: 'モーダルを閉じる',
        openMenu: 'メニューを開く',
        closeMenu: 'メニューを閉じる',
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        success: '成功',
        warning: '警告',
        info: '情報',
        copyToClipboard: 'クリップボードにコピー',
        copiedToClipboard: 'クリップボードにコピーされました',
        generatePassword: 'パスワードを生成',
        clearForm: 'フォームをクリア',
        sendMessage: 'メッセージを送信',
        toggleDarkMode: 'ダークモードを切り替え',
        toggleLanguage: '言語を切り替え'
    },
    validation: {
        required: 'このフィールドは必須です',
        email: '有効なメールアドレスを入力してください',
        minLength: '最低{min}文字含める必要があります',
        maxLength: '{max}文字を超えることはできません',
        invalidFormat: '無効な形式',
        serverError: 'サーバーエラー、再試行してください',
        networkError: 'ネットワークエラー、接続を確認してください'
    },
    versions: {
        pageTitle: 'バージョン履歴',
        pageDescription:
            'Keymoji、絵文字パスワードジェネレーターの開発履歴と変更ログをご確認ください。'
    }
};
