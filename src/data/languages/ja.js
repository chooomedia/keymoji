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
            '🔑 パスワードを再発明。🎯 解読不可能な絵文字パスワード。🌈 無料。安全。革新的。🤖 AI耐性技術。🌍 15以上の言語で利用可能。',
        pageKeywords:
            'Keymoji, 絵文字パスワード, パスワードジェネレーター, セキュリティ, オンラインセキュリティ',
        pageInstruction: [
            '"📝 ストーリー"をクリックしてAI絵文字物語を取得 📖',
            '"ランダム"は自明です 😜。',
            '生成後、クリップボードに保存されます！📋'
        ],
        backToMainText: '下をクリック 👇 して戻る',
        backToMainButtonText: 'ホームに戻る',
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
            '🚀 WebhookとAIによる絵文字マジック！✨ データは砂浜の砂のようなもの - 残りません。',
        clearButton: '✖️ クリア',
        storyButton: '📝 ストーリー',
        storyButtonClicked: '📩 ストーリーを送信',
        randomButton: '🎲 ランダム',
        placeholderText:
            'ストーリーを教えてください。それに基づいて絵文字パスワードを生成します...',
        clipboardError: 'クリップボードへのコピーエラー'
    },
    donateButton: {
        text: 'コーヒーを買ってください',
        openText: 'このメニューを閉じる',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: 'こんにちは、Christopherです',
        pageDescription:
            'フロントエンド開発者で、JavaScript、PHP、HTMLを使った使いやすいウェブサイトを作るのが大好きです。お気軽にメッセージしてください！',
        nameLabel: '🧑🏻 お名前',
        emailLabel: '📧 メールアドレス',
        messageLabel: '✍🏻 メッセージ',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 送信',
        sendingButton: '📨 送信中...',
        successMessage:
            '成功、メッセージが送信されました - 返信: 24時間以内 🚀',
        errorMessage: '予期しないエラーが発生しました 😟',
        requestErrorMessage: 'メッセージ送信エラー。もう一度お試しください 🙁',
        smirkingFaceImageAlt: 'keymoji emoji 微笑み顔 1f60f',
        introductionTitle: 'ご質問やご提案はありますか？',
        introductionText: 'お気軽にメッセージしてください！',
        privacyNotice:
            'あなたのデータは大切に扱われます 🤲。第三者に提供されることはありません 🔒。',
        newsletterLabel: 'はい、ニュースレターを購読したいです',
        backToMainButton: 'ホームに戻る',
        footerText: '愛を込めて開発',
        validationErrorMessage: '送信前にフォームのエラーを修正してください 🔍',
        sendingMessage: 'メッセージ送信中... 📨',
        emailText: {
            greeting: 'ようこそ',
            confirmationText:
                'Christopherがあなたがインテリジェントボットではないことを知るために、リクエストを確認してください。以下のデータでメッセージを送信しました：',
            doubleCheck: '以下の詳細でメッセージを受信しました：',
            button: 'メールを確認'
        },
        validation: {
            nameRequired: '名前は必須です',
            nameLength: '2文字以上で入力してください',
            emailRequired: 'メールアドレスは必須です',
            emailInvalid: '有効なメールアドレスを入力してください',
            messageRequired: 'メッセージは必須です',
            messageLength: '{min}文字以上で入力してください'
        }
    },
    serviceWorker: {
        updateAvailable: '新しいバージョンが利用可能です！',
        manualRefreshNeeded:
            '新しいバージョンがアクティブになりました。最新機能のために今すぐリロードしてください。',
        updateSuccess: 'アプリが正常に更新されました！🎉'
    },
    notFound: {
        message: 'おっと！ページが見つかりません 🚫',
        backButton: 'ホームに戻る',
        contactButton: 'お問い合わせ'
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
        minLength: '最低{min}文字である必要があります',
        maxLength: '{max}文字を超えてはいけません',
        invalidFormat: '無効な形式',
        serverError: 'サーバーエラー、もう一度お試しください',
        networkError: 'ネットワークエラー、接続を確認してください'
    },

    // UserSettings翻訳
    userSettings: {
        // 基本設定
        basicSettings: {
            title: '基本設定',
            description: '言語、テーマ、通知',
            language: {
                label: '言語',
                description: 'お好みの言語を選択',
                options: {
                    en: '🇺🇸 英語',
                    de: '🇩🇪 ドイツ語',
                    fr: '🇫🇷 フランス語',
                    es: '🇪🇸 スペイン語',
                    ja: '🇯🇵 日本語'
                }
            },
            theme: {
                label: 'テーマ',
                description: '視覚的テーマを選択',
                options: {
                    auto: '🔄 自動',
                    light: '☀️ ライト',
                    dark: '🌙 ダーク'
                }
            },
            notifications: {
                label: '通知',
                description: '重要な更新を受け取る'
            }
        },

        // セキュリティ設定
        securitySettings: {
            title: 'セキュリティ設定',
            description: 'パスワード強度と文字タイプ',
            passwordLength: {
                label: 'パスワード長',
                description: 'パスワード強度を選択',
                min: '弱い (6)',
                max: '強い (20)'
            },
            includeNumbers: {
                label: '数字を含める',
                description: '数字文字を追加 (0-9)'
            },
            includeSymbols: {
                label: '記号を含める',
                description: '特殊文字を追加 (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: '特殊文字を含める',
                description: '拡張特殊文字を追加'
            },
            excludeSimilarChars: {
                label: '類似文字を除外',
                description: '混乱する文字を避ける (l, 1, I)'
            },
            requireUniqueChars: {
                label: '一意の文字を要求',
                description: 'パスワードに重複文字なし'
            }
        },

        // 絵文字設定
        emojiSettings: {
            title: '絵文字設定',
            description: '絵文字数、カテゴリ、パターン',
            emojiCount: {
                label: '絵文字数',
                description: 'パスワード内の絵文字数',
                min: '最小 (3)',
                max: '最大 (10)'
            },
            emojiPattern: {
                label: '絵文字パターン',
                description: '絵文字の配置を選択',
                options: {
                    random: 'ランダム',
                    sequential: '順次',
                    alternating: '交互'
                }
            },
            emojiTheme: {
                label: '絵文字テーマ',
                description: '絵文字スタイルを選択',
                options: {
                    mixed: 'ミックス',
                    cute: 'かわいい',
                    professional: 'プロフェッショナル',
                    fantasy: 'ファンタジー'
                }
            }
        },

        // 生成設定
        generationSettings: {
            title: '生成設定',
            description: '自動生成とクリップボードオプション',
            autoGenerate: {
                label: '自動生成',
                description: 'パスワードを自動生成'
            },
            copyToClipboard: {
                label: 'クリップボードにコピー',
                description: '生成されたパスワードを自動コピー'
            },
            showStrength: {
                label: '強度を表示',
                description: 'パスワード強度メーターを表示'
            },
            strengthThreshold: {
                label: '強度しきい値',
                description: '必要な最小パスワード強度',
                options: {
                    low: '低',
                    medium: '中',
                    high: '高'
                }
            },
            autoRefresh: {
                label: '自動更新',
                description: '弱いパスワードを自動再生成'
            }
        },

        // プライバシー設定
        privacySettings: {
            title: 'プライバシー設定',
            description: 'データ収集と共有設定',
            saveHistory: {
                label: '履歴を保存',
                description: '生成されたパスワードをローカルに保存'
            },
            analytics: {
                label: 'アナリティクス',
                description: '匿名使用統計'
            },
            shareUsage: {
                label: '使用状況を共有',
                description: '改善のための使用データを共有'
            },
            exportHistory: {
                label: '履歴をエクスポート',
                description: 'パスワード履歴をファイルにエクスポート'
            },
            backupSettings: {
                label: '設定をバックアップ',
                description: '設定を自動バックアップ'
            }
        },

        // Pro機能
        proFeatures: {
            title: 'Pro機能',
            description: '高度な設定とプレミアム機能',
            securityAudit: {
                label: 'セキュリティ監査',
                description: '包括的セキュリティ分析',
                buttonText: '監査を実行'
            },
            breachCheck: {
                label: '漏洩チェック',
                description: '既知の漏洩に対してパスワードをチェック'
            },
            strengthAnalytics: {
                label: '強度アナリティクス',
                description: '高度なパスワード強度分析'
            }
        }
    },

    // 会計とセキュリティ
    accounting: {
        // ログインと認証
        login: {
            title: 'ログイン',
            emailPlaceholder: 'メールアドレスを入力',
            magicLinkSent: 'マジックリンクが送信されました！',
            magicLinkError: 'マジックリンクの送信エラー',
            verificationSuccess: 'メールが正常に確認されました！',
            verificationError: 'メール確認に失敗',
            rateLimitExceeded: 'ログイン試行が多すぎます。お待ちください。',
            sessionExpired: 'セッションが期限切れです。再ログインしてください。'
        },

        // アカウント管理
        account: {
            title: 'アカウント管理',
            profile: 'プロフィール',
            settings: '設定',
            logout: 'ログアウト',
            logoutSuccess: '正常にログアウトしました',
            accountCreated: 'アカウントが正常に作成されました',
            accountUpdated: 'アカウントが正常に更新されました',
            accountError: 'アカウント管理エラー'
        },

        // セキュリティイベント
        security: {
            loginAttempt: 'ログイン試行',
            loginSuccess: 'ログイン成功',
            loginFailed: 'ログイン失敗',
            logout: 'ログアウト',
            sessionExpired: 'セッション期限切れ',
            suspiciousActivity: '不審な活動',
            verificationSuccess: '確認成功',
            verificationFailed: '確認失敗',
            accountCreated: 'アカウント作成',
            accountUpdated: 'アカウント更新',
            securityAudit: 'セキュリティ監査実行'
        },

        // 検証
        validation: {
            required: 'このフィールドは必須です',
            emailInvalid: '有効なメールアドレスを入力してください',
            urlInvalid: '有効なURLを入力してください',
            phoneInvalid: '有効な電話番号を入力してください',
            passwordWeak:
                'パスワードは大文字、小文字、数字を含む最低8文字である必要があります',
            minLength: '最小長は{min}文字です',
            maxLength: '最大長は{max}文字です',
            minValue: '最小値は{min}です',
            maxValue: '最大値は{max}です',
            validInput: '有効な入力'
        },

        // コンテキストメニュー
        contextMenu: {
            exportSettings: '設定をエクスポート',
            importSettings: '設定をインポート',
            resetToDefault: 'デフォルトにリセット',
            proMessage: '💎 Proユーザーは設定をエクスポート・インポートできます'
        }
    },

    // モーダルと通知
    modals: {
        success: '成功',
        error: 'エラー',
        warning: '警告',
        info: '情報',
        confirm: '確認',
        cancel: 'キャンセル',
        close: '閉じる',
        loading: '読み込み中...',
        saving: '保存中...',
        exporting: 'エクスポート中...',
        importing: 'インポート中...',
        resetting: 'リセット中...'
    },

    // 一般的なUIテキスト
    // AccountManager 翻訳
    accountManager: {
        // ヘッダーと説明
        pageTitle: 'アカウント管理',
        pageDescription: 'セキュリティ設定とアカウント設定を管理',
        welcomeBack: 'おかえりなさい、{name}さん！👋',
        welcomeDescription:
            '素晴らしい絵文字パスワードを作成する準備はできましたか？あなたのアカウントは安全で準備完了です！',
        verificationTitle: '📧 メールを確認して認証',
        verificationDescription:
            'メール {email} を確認し、マジックリンクをクリックしてセットアップを完了',

        // アカウント状態
        accountStatus: 'アカウント状態',
        emailLabel: 'メールアドレス',
        nameLabel: 'お名前',
        profileDataLabel: 'プロフィールデータ',

        // アカウントレベル
        freeBadge: '✨ 無料',
        proBadge: '💎 PRO',
        freeDescription: '✨ 無料セキュリティ',
        proDescription: '💎 エンタープライズセキュリティ',

        // 特典
        benefits: {
            free: {
                title: '無料特典',
                dailyGenerations: '1日5回の安全な生成',
                dailyGenerationsDesc: 'AI耐性技術',
                decentralizedData: '分散データ処理',
                decentralizedDataDesc:
                    'あなたのデータはプライベートに保たれます',
                webApp: 'Webアプリとして利用可能',
                webAppDesc: 'どこからでも安全にアクセス'
            },
            pro: {
                title: 'PRO特典',
                unlimitedGenerations: '無制限の安全な生成',
                unlimitedGenerationsDesc: '1日の制限なし',
                aiThreatDetection: 'AI駆動脅威検出',
                aiThreatDetectionDesc: 'プロアクティブセキュリティ分析',
                browserExtension: 'ブラウザ拡張機能（2025年Q4）',
                browserExtensionDesc: 'Webのどこでもセキュリティ',
                wordpressPlugin: 'WordPressプラグイン（2025年Q4）',
                wordpressPluginDesc: 'あなたのウェブサイトにセキュリティを統合'
            }
        },

        // 1日の制限
        dailyGenerations: '1日の生成',
        remainingGenerations: '残り {remaining} / {limit}',
        canStillGenerate: 'まだ絵文字を生成できます！',
        limitReached:
            '1日の制限に達しました。PROにアップグレードして無制限の生成を。',

        // 統計
        statistics: {
            storiesGenerated: '生成されたストーリー',
            remainingGenerations: '残りの生成'
        },

        // アクション
        actions: {
            saveSettings: '💾 設定を保存',
            backToHome: '🏠 ホームに戻る',
            createAccount: '🚀 {type}アカウントを作成',
            skipAccount: '{type}アカウントをスキップ',
            createMagicLink: '🔐 マジックリンクを作成',
            sendingMagicLink: '⏳ マジックリンク送信中...',
            resendMagicLink: '🔄 マジックリンクを再送信',
            backToAccountOptions: '← アカウントオプションに戻る',
            addProfileData: '👤 プロフィールデータを追加',
            hideProfileData: '👤 プロフィールデータを非表示'
        },

        // フォーム検証
        validation: {
            invalidEmail: '⚠️ 有効なメールアドレスを入力してください',
            invalidName: '⚠️ お名前を入力してください（最低2文字）',
            requiredField: 'このフィールドは必須です'
        },

        // ヘルプセクション
        help: {
            title: '💡 ヘルプが必要ですか？',
            checkSpam:
                '• メールが見えない場合はスパムフォルダを確認してください',
            linkExpires: '• マジックリンクは15分後に期限切れになります',
            requestNewLink: '• いつでも新しいリンクをリクエストできます',
            noPassword: '• パスワード不要 - リンクをクリックするだけ'
        },

        // フッター
        footer: {
            magicLink: '🔒 マジックリンク',
            instantSetup: '⚡ 即座セットアップ',
            noSpam: '🎯 スパムなし'
        }
    },

    ui: {
        save: '保存',
        cancel: 'キャンセル',
        reset: 'リセット',
        export: 'エクスポート',
        import: 'インポート',
        delete: '削除',
        edit: '編集',
        add: '追加',
        remove: '削除',
        search: '検索',
        filter: 'フィルター',
        sort: '並び替え',
        refresh: '更新',
        back: '戻る',
        next: '次へ',
        previous: '前へ',
        submit: '送信',
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        warning: '警告',
        info: '情報'
    }
};
