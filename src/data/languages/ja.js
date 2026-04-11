// src/data/languages/ja.js
// Japanese language content

import { formatVersion } from '../../utils/version';

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
            '🔑 覚えやすいパスワード、手間ゼロ。🎯 解読不可能な絵文字シーケンス。🌍 15以上の言語。🔒 GDPR準拠。',
        pageKeywords:
            'Keymoji, 絵文字パスワード, パスワードジェネレーター, セキュリティ, オンラインセキュリティ',
        pageInstruction: [
            'AIを選択してKeymojiストーリーを作成',
            '"ランダム"は自明です 😜。',
            '生成後、クリップボードに保存されます！📋'
        ],
        levelHint: 'レベルはパスワードの絵文字の数を決めます — 絵文字が多いほど安全性が高まります。',
        setupStoryMode: '自分のAIを使用',
        setupStoryModeShort: '自分のAIを使用',
        setupStoryModeSwiss: 'スイスAIを使用',
        setupStoryModeSwissShort: 'スイスAI',
        setupStoryModeOr: 'または',
        setupStoryModeBannerCta: '— あなたのKeymoji Storyを作ろう',
        setupStoryModeBannerText: '✨ あなたの物語がKeymoji になる',
        setupStoryModeChip: 'Story Modeを有効にする',
        setupStoryModeDescription:
            'AIに接続してパーソナライズされた絵文字パスワードを取得。',
        setupStoryModeSwissDescription:
            'プライバシー重視のユーザー向けスイス製AI。データはスイスに留まり、GDPR準拠、エンタープライズセキュリティ。データ主権を重視する個人や企業に最適。',
        setupStoryModeSwissTooltip:
            'スイスAI（Apertus）- スイスでホストされるプライバシー重視のAI。データはスイスに留まり、スイスのデータ保護法により保護されます。GDPR準拠、エンタープライズグレードのセキュリティ。プライバシー意識の高いユーザーやデータ主権を必要とする企業に最適。',
        storyModeReady: 'AI生成の絵文字パスワード準備完了 🤖',
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
        clearButton: 'クリア',
        storyButton: '✨ ストーリー',
        storyButtonClicked: '✨ ストーリーを送信',
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
            'フロントエンド開発者で、TypeScript、JavaScript、PHP、HTMLを使った使いやすいウェブサイトを作るのが大好きです。お気軽にメッセージしてください！',
        nameLabel: '🧑🏻 お名前',
        emailLabel: 'メールアドレス',
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
        newsletterLabel: 'はい、ニュースレターを購読したい',
        newsletterOptIn: 'ニュースレターを購読',
        newsletterText:
            '最新情報を入手し、安心してニュースレターを購読してください。{privacyPolicy}',
        privacyPolicyLink: 'プライバシーポリシーを表示',
        privacyPolicyUrl: '/privacy',
        backToMainButton: 'ホームに戻る',
        footerText: '愛を込めて開発',
        validationErrorMessage: '送信前にフォームのエラーを修正してください 🔍',
        sendingMessage: 'メッセージ送信中... 📨',
        emailText: {
            greeting: 'ようこそ',
            confirmationText:
                'Christopherがあなたがインテリジェントボットではないことを知るために、リクエストを確認してください。以下のデータでメッセージを送信しました：',
            doubleCheck: '以下の詳細でメッセージを受信しました：',
            button: 'メールを確認',
            subject: 'Keymojiへのメッセージを受け取りました',
            privacy: 'あなたのデータは安全に処理されます。'
        },
        validation: {
            nameRequired: '名前は必須です',
            nameLength: '2文字以上で入力してください',
            emailRequired: 'メールアドレスは必須です',
            emailInvalid: '有効なメールアドレスを入力してください',
            messageRequired: 'メッセージは必須です',
            messageLength: '{min}文字以上で入力してください'
        },
        autoFilledLabel: 'アカウントから自動入力'
    },
    serviceWorker: {
        updateAvailable: '新しいバージョンが利用可能です！',
        manualRefreshNeeded:
            '新しいバージョンがアクティブになりました。最新機能のために今すぐリロードしてください。',
        updateSuccess: 'アプリが正常に更新されました！🎉'
    },
    notFound: {
        pageTitle: '404 - ページが見つかりません',
        pageDescription: 'お探しのページは存在しないか、移動されました。',
        oopsTitle: 'おっと！ページが見つかりません',
        oopsDescription: 'お探しのページは移動、削除、または存在しなかった可能性があります。',
        quickNavTitle: 'クイックナビゲーション',
        recentEmojisTitle: '最近のKeymoji',
        backToHome: 'ホームに戻る',
        prevEmoji: '前の絵文字',
        nextEmoji: '次の絵文字',
        message: 'おっと！ページが見つかりません 🚫',
        suggestion: 'お探しのページは移動、削除、または存在しなかった可能性があります。',
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
        resetting: 'リセット中...',
        closeModal: 'モーダルを閉じる',
        modalClosesIn: 'モーダルは{seconds}秒後に閉じます',
        modalClosesInSingular: 'モーダルは{seconds}秒後に閉じます'
    },
    versions: {
        pageTitle: 'バージョン履歴',
        pageDescription:
            'Keymoji、絵文字パスワードジェネレーターの開発履歴と変更履歴をご確認ください。',
        currentLabel: '現在',
        backToTop: 'トップへ'
    },

    // 一般的なUIテキスト
    // AccountManager 翻訳
    accountManager: {
        // ページタイトルと説明
        pageTitle: 'アカウント管理',
        pageDescription: 'セキュリティ設定とアカウント設定を管理',
        welcomeBack: 'おかえりなさい、{name}さん！👋',
        welcomeDescription:
            '素晴らしい絵文字パスワードを作成する準備はできましたか？あなたのアカウントは安全で準備完了です！',
        returnUserTitle: '👋 おかえりなさい！',
        returnUserDescription:
            'あなたのメールアドレスを認識しました。素早くログインしてください。',
        verificationTitle: '📧 メールを確認して認証',
        verificationDescription:
            'メール {email} を確認し、マジックリンクをクリックしてセットアップを完了',
        verifyingTitle: '🔗 マジックリンク認証中...',
        verifyingDescription: 'アカウントの認証をお待ちしています。',
        verificationErrorTitle: '❌ 認証に失敗しました',
        verificationErrorDescription: 'エラーが発生しました。',

        // ボタンとアクション
        buttons: {
            createMagicLink: 'コードをメールで送信',
            loginToAccount: 'アカウントにログイン',
            checkAccountExists: 'アカウント確認中...',
            sendingMagicLink: 'コード送信中...',
            accountExists: 'アカウントが見つかりました - ログイン中...',
            accountNotFound: 'アカウントが見つかりません - 作成中...',
            sessionExpired: 'セッションが期限切れ - 再ログイン',
            loginAgain: '🔐 再ログイン',
            createNewAccount: '新しいアカウントを作成',
            resendMagicLink: '🔄 新しいコードを送る',
            backToAccountOptions: '← 戻る',
            addProfile: '追加',
            hideProfile: '非表示',
            profileData: 'プロフィールデータ',
            showFullForm: '完全なフォームを表示',
            compactView: 'コンパクト表示',
            addName: 'お名前を追加'
        },

        // フォームラベル
        emailLabel: 'メールアドレス',
        nameLabel: 'お名前',

        // アクション
        actions: {
            saveSettings: '💾 設定を保存',
            backToHome: '← ホームに戻る',
            skipAccount: '❌ {type}をスキップ',
            createAccount: '🚀 {type}アカウントを作成',
            settingsSaved: '設定が保存されました！'
        },

        // 統計
        statistics: {
            storiesGenerated: '生成されたストーリー',
            remainingGenerations: '残りの生成',
            noDataTitle: 'データなし',
            noDataMessage: '絵文字を生成して実際の使用データを収集し、ここに表示してください。',
            refreshButton: '更新',
            loading: '読み込み中...'
        },

        // 1日の生成
        dailyGenerations: '1日の生成',

        // 残り生成数の表示
        remainingDisplay: '{remaining} / {limit}',

        // 特典
        benefits: {
            free: {
                dailyGenerations: '1日10回の安全な生成',
                dailyGenerationsDesc: '最大限のセキュリティのためのAI耐性技術',
                decentralizedData: '無料のスイスAI',
                decentralizedDataDesc:
                    'Apertus、ChatGPT、Gemini、Claude、Mistralなどを使用 - 直接利用可能',
                webApp: 'Webアプリとして利用可能',
                webAppDesc: '即座に利用可能 - インストール不要'
            },
            pro: {
                unlimitedGenerations: '無制限の安全な生成',
                unlimitedGenerationsDesc:
                    '必要なだけパスワードを作成 - 制限なし',
                browserExtension: 'ブラウザ拡張機能（2025年Q4）',
                browserExtensionDesc:
                    'ブラウザで直接セキュリティ - 自動的かつどこでも',
                apiIntegration: 'API統合（2025年Q4）',
                apiIntegrationDesc:
                    'セキュリティをあなたのアプリケーションにシームレスに統合'
            }
        },

        // ヘルプセクション
        verification: {
            titleNew: '登録コード',
            titleReturn: 'ログインコード',
            sentTo: 'コードを送信先:',
            codeLabel: '7桁の確認コード',
            codePlaceholder: '1234567',
            submitCode: '✅ コードを確認',
            verifying: '確認中...',
            codeError: '7桁のコードを入力してください。',
            codeInvalid: '無効または期限切れのコードです。新しいコードをリクエストしてください。'
        },

        help: {
            title: '💡 ヘルプが必要ですか？',
            spamFolder: '• メールが見えない場合はスパムフォルダを確認してください',
            codeExpiry: '• コードは15分間有効です',
            magicLinkExpiry: '• コードは15分後に期限切れになります',
            requestNewLink: '• いつでも新しいコードをリクエストできます',
            noLink: '• リンクをクリックする必要はありません — コードを入力するだけ',
            noPassword: '• パスワード不要 — コードを入力するだけ'
        },

        // フッター
        footer: {
            magicLink: 'Easy Login',
            instantSetup: '即座セットアップ',
            noSpam: 'スパムなし',
            text: 'マジックリンクはメールで送信され、15分間有効です。',
            privacy: 'あなたのデータは安全に処理されます。',
            legal: '法的情報',
            versionHistory: 'バージョン履歴'
        },

        // 制限とメッセージ
        canStillGenerate: 'まだ絵文字を生成できます！',
        limitReached:
            '1日の制限に達しました。PROにアップグレードして無制限の生成を。',

        // アカウント年齢
        accountAge: {
            today: '✨ FREE: 今日から！',
            yesterday: '🚀 FREE: 昨日から！',
            days: '🔥 FREE: {days}日前から！',
            weeks: '⚡ FREE: {weeks}週間{plural}前から！',
            months: '💪 FREE: {months}ヶ月{plural}前から！',
            years: '🏆 FREE: {years}年{plural}前から！',
            accountSince: '{days} {unit}前のアカウント',
            since: '{days} {unit}前から',
            day: '日',
            daysLabel: '日',
            accountCreated: 'アカウント作成',
            createdTodayFree: '✨ 新しいFREEアカウントの準備が完了しました！',
            createdTodayPro: '💎 PROクラブへようこそ — 今日から特別会員！',
            createdRecentlyFree: '✨ FREEアカウント — 新鮮で準備完了！',
            createdRecentlyPro: '💎 PROアカウント — 独占的で新しい！'
        },

        // 検証
        validation: {
            emailInvalid: '有効なメールアドレスを入力してください',
            nameInvalid: 'お名前を入力してください（最低2文字）'
        },

        // メッセージ
        messages: {
            settingsReset: '設定がデフォルトにリセットされました',
            exportFailed: '設定のエクスポートに失敗しました',
            settingsExported: '設定が正常にエクスポートされました',
            settingsImported: '設定が正常にインポートされました',
            importFailed: 'インポートに失敗しました',
            freeAccountActivated: '無料アカウントがアクティブ化されました！',
            chartLoadFailed: 'チャートデータの読み込みに失敗しました',
            accountFoundSendingCode: 'アカウントが見つかりました！コードを送信中。',
            accountFoundSendingLink: 'アカウントが見つかりました！コードを送信中。',
            creatingNewAccount: '新しいアカウントを作成中 — コードのメールをご確認ください。',
            magicLinkSendFailed: 'コードの送信に失敗しました。もう一度お試しください。',
            otpVerified: 'コードが確認されました — ログインしました！',
            magicLinkVerified: 'コードが正常に確認されました！',
            magicLinkVerificationFailed: 'コードの確認に失敗しました',
            chartDataRefreshed: 'チャートデータが更新されました！',
            refreshFailed: 'データの更新に失敗しました',
            noNewData: '新しいデータはありません'
        },

        // Apertus Info
        apertusInfo: '🇨🇭 無料のスイスAI、内蔵済み。Apertus — EPFL & ETH チューリッヒ製オープンソースLLM。データはスイス国内に保管。APIキー不要。',
        apiKeyLabel: 'APIキー',
        apiKeyLabelApertus: 'Hugging Faceトークン',
        apiKeyLabelCustom: 'カスタムAPIキー',
        optional: 'オプション',
        verified: '確認済み',
        testBtn: 'テスト',
        apertusBuiltIn: '内蔵トークンが有効 — キーなしで動作します。',
        apertusOwnToken: 'オプション: 個人のHugging Faceトークン (hf_…) を入力して個人クォータを使用できます。',
        apertusGetToken: '無料HFトークンを取得',
        openaiHint: '有料OpenAI APIキー (sk-…) が必要です。',
        geminiHint: '無料プランあり。Google AI StudioでAPIキーを取得。',
        claudeHint: 'Anthropic APIキー (sk-ant-…) が必要です。',
        mistralHint: 'ヨーロッパのAI。console.mistral.aiでキーを取得。',
        customHint: 'OpenAI互換エンドポイント。以下にベースURLとAPIキーを入力。',
        getApiKey: 'APIキーを取得',
        savedKeys: '保存済み',

        // アップグレードセクション
        upgrade: {
            upgradeToPro: 'Proにアップグレード',
            upgradeToProForFeatures: '高度な機能のためにProにアップグレード',
            unlimitedGenerations: '無制限の生成と高度なセキュリティ機能'
        },

        // コンテキストメニュー
        contextMenu: {
            exportSettings: '設定をエクスポート',
            importSettings: '設定をインポート',
            resetToDefault: 'デフォルトにリセット',
            logout: 'ログアウト',
            settingsMenu: '設定メニュー'
        },

        // 機能
        features: {
            proFeature: 'Pro機能'
        },

        // Pro機能モーダル
        proFeatureModal: {
            title: 'Pro機能',
            proBenefits: 'Pro特典:',
            unlimitedGenerations: '無制限の絵文字生成',
            advancedSecurity: '高度なセキュリティ機能',
            prioritySupport: '優先サポート',
            earlyAccess: '新機能への早期アクセス',
            maybeLater: 'また後で',
            upgradeToPro: 'Proにアップグレード',
            // Proアップグレード専用
            proUpgrade: 'Proアップグレード',
            unlockAdvancedFeatures: 'すべての高度な機能と設定をアンロック',
            upgradeProNow: '💎 今すぐProにアップグレード'
        },

        // アカウントレベル
        tiers: {
            free: '無料',
            pro: 'PRO',
            freeAccount: '無料アカウント',
            proAccount: 'Proアカウント'
        },

        // バッジ
        freeBadge: '✨ 無料',
        proBadge: '💎 PRO',

        // デモグラフ（実データがない場合）
        demoChart: {
            title: 'データなし',
            description: '絵文字を生成して実際の使用データを収集し、ここに表示しよう。',
            cta: 'Keymojiを始める'
        },

        // 説明
        freeDescription: '✨ 無料セキュリティ',
        proDescription: '💎 エンタープライズセキュリティ'
    },


    consent: {
        title: 'プライバシー設定',
        description: '最小限のデータを使用して体験を向上させます。',
        analytics: '匿名の使用状況分析',
        analyticsHint: 'アプリの改善に役立てます — 個人データなし',
        saveHistory: 'ローカル使用履歴を保存',
        saveHistoryHint: 'ブラウザにのみ保存されます',
        accept: '選択を保存',
        acceptAll: 'すべて同意',
        decline: 'オプション拒否',
        moreInfo: 'プライバシーポリシー',
        legalInfo: '法的通知',
        privacy: 'プライバシーと法律',
        necessaryTitle: '必須',
        necessaryHint: 'アプリの動作に必要 — 常に有効',
        necessaryStorage: '設定とテーマ設定（localStorage）',
        necessarySession: 'ログインセッション（ブラウザメモリのみ）',
        necessaryOtp: '認証用OTPコード（メールで1回送信）',
        historyDetail: '使用グラフデータ（1日あたりの生成数）',
        historyScope: 'サーバーに送信されません — ブラウザ内のみ',
        analyticsDetail: '匿名ページビュー数（IPはx.x.x.0に匿名化）',
        analyticsProcessor: 'DigitalOcean（EU）の独自n8nインスタンスで処理'
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
