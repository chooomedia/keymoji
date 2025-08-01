// src/data/languages/ko.js
// Korean language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: '메인 메뉴 열기',
        closeMainMenu: '메인 메뉴 닫기'
    },
    index: {
        pageTitle: '이모지 비밀번호 생성기',
        pageDescription:
            '�� 비밀번호를 재발명했습니다. 🎯 해독 불가능한 이모지 비밀번호. 🌈 무료. 안전. 혁신적. 🤖 AI 저항 기술. 🌍 15개 이상의 언어로 제공.',
        pageKeywords:
            'Keymoji, 이모지 비밀번호, 비밀번호 생성기, 보안, 온라인 보안',
        pageInstruction: [
            '"📝 스토리"를 클릭하여 AI 이모지 이야기를 받으세요 📖',
            '"랜덤"은 자명합니다 😜.',
            '생성 후 클립보드에 저장됩니다! 📋'
        ],
        backToMainText: '아래를 클릭 👇 하여 돌아가기',
        backToMainButtonText: '홈으로 돌아가기',
        contactText: '질문이나 멋진 제안이 있나요?',
        contactButtonText: '메시지를 보내주세요! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            '클릭하거나 Enter를 눌러 생성된 이모지 비밀번호를 클립보드에 복사',
        successMessage: '성공, 클립보드에 복사됨 💾',
        errorMessage: '앗, 뭔가 잘못되었습니다 🤖',
        dailyLimitReachedMessage:
            '죄송합니다, 요청의 일일 한도에 도달했습니다 😔',
        successStoryMessage: '성공, 이모지 스토리가 생성되었습니다 🤖',
        errorStoryMessage: '오류, 서버에서 응답이 없습니다 🌀',
        emojiDisplayTitle: '이모지 비밀번호 생성기',
        dataPrivacyProcessingInfo:
            '🚀 웹훅과 AI를 통한 이모지 마법! ✨ 데이터는 해변의 모래와 같습니다 - 남지 않습니다.',
        clearButton: '✖️ 지우기',
        storyButton: '📝 스토리',
        storyButtonClicked: '📩 스토리 보내기',
        randomButton: '🎲 랜덤',
        placeholderText:
            '이야기를 들려주세요. 그것을 기반으로 이모지 비밀번호를 생성하겠습니다...',
        clipboardError: '클립보드에 복사하는 중 오류'
    },
    donateButton: {
        text: '커피 한 잔 사주세요',
        openText: '이 메뉴 닫기',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: '안녕하세요, 저는 Christopher입니다',
        pageDescription:
            '프론트엔드 개발자이며 JavaScript, PHP, HTML로 사용자 친화적인 웹사이트를 만드는 것을 좋아합니다. 언제든지 메시지 보내주세요!',
        nameLabel: '🧑🏻 이름',
        emailLabel: '📧 이메일',
        messageLabel: '✍🏻 메시지',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 보내기',
        sendingButton: '📨 보내는 중...',
        successMessage: '성공, 메시지가 전송되었습니다 - 답변: 24시간 이내 🚀',
        errorMessage: '예상치 못한 오류가 발생했습니다 😟',
        requestErrorMessage: '메시지 전송 오류. 다시 시도해 주세요 🙁',
        smirkingFaceImageAlt: 'keymoji emoji 미소 짓는 얼굴 1f60f',
        introductionTitle: '질문이나 제안이 있으신가요?',
        introductionText: '언제든지 메시지 보내주세요!',
        privacyNotice:
            '귀하의 데이터는 안전하게 처리됩니다 🤲. 제3자에게 제공되지 않습니다 🔒.',
        newsletterLabel: '네, 뉴스레터를 구독하고 싶어요',
        newsletterOptIn: '뉴스레터 구독',
        backToMainButton: '홈으로 돌아가기',
        footerText: '사랑을 담아 개발',
        validationErrorMessage: '제출 전에 양식 오류를 수정하세요 🔍',
        sendingMessage: '메시지 보내는 중... 📨',
        emailText: {
            greeting: '환영합니다',
            confirmationText:
                'Christopher가 당신이 인텔리전트 봇이 아님을 알 수 있도록 요청을 확인해주세요. 다음 정보로 메시지를 보냈습니다:',
            doubleCheck: '다음 세부 정보로 메시지를 받았습니다:',
            button: '이메일 확인'
        },
        validation: {
            nameRequired: '이름은 필수입니다',
            nameLength: '2자 이상 입력하세요',
            emailRequired: '이메일은 필수입니다',
            emailInvalid: '유효한 이메일을 입력하세요',
            messageRequired: '메시지는 필수입니다',
            messageLength: '{min}자 이상 입력하세요'
        }
    },
    serviceWorker: {
        updateAvailable: '새 버전이 사용 가능합니다!',
        manualRefreshNeeded:
            '새 버전이 활성화되었습니다. 최신 기능을 위해 지금 새로고침하세요.',
        updateSuccess: '앱이 성공적으로 업데이트되었습니다! 🎉'
    },
    notFound: {
        message: '앗! 페이지를 찾을 수 없습니다 🚫',
        backButton: '홈으로 돌아가기',
        contactButton: '문의하기'
    },
    blog: {
        readMore: '더 읽기',
        backToBlog: '블로그로 돌아가기',
        publishedOn: '게시일',
        author: '작성자',
        tags: '태그',
        readTime: '분 읽기',
        likes: '좋아요',
        share: '공유'
    },
    account: {
        create: '계정 만들기',
        manage: '계정 관리',
        login: '로그인',
        logout: '로그아웃',
        profile: '프로필',
        settings: '설정',
        guest: '게스트',
        free: '무료',
        pro: '프로'
    },
    accessibility: {
        skipToMain: '메인 콘텐츠로 건너뛰기',
        closeModal: '모달 닫기',
        openMenu: '메뉴 열기',
        closeMenu: '메뉴 닫기',
        loading: '로딩 중...',
        error: '오류 발생',
        success: '성공',
        warning: '경고',
        info: '정보',
        copyToClipboard: '클립보드에 복사',
        copiedToClipboard: '클립보드에 복사됨',
        generatePassword: '비밀번호 생성',
        clearForm: '폼 지우기',
        sendMessage: '메시지 보내기',
        toggleDarkMode: '다크 모드 전환',
        toggleLanguage: '언어 전환'
    },
    validation: {
        required: '이 필드는 필수입니다',
        email: '유효한 이메일 주소를 입력해주세요',
        minLength: '최소 {min}자 이상이어야 합니다',
        maxLength: '{max}자를 초과할 수 없습니다',
        invalidFormat: '잘못된 형식',
        serverError: '서버 오류, 다시 시도해주세요',
        networkError: '네트워크 오류, 연결을 확인해주세요'
    },

    // UserSettings 번역
    userSettings: {
        // 기본 설정
        basicSettings: {
            title: '기본 설정',
            description: '언어, 테마, 알림',
            language: {
                label: '언어',
                description: '선호하는 언어를 선택하세요',
                options: {
                    en: '🇺🇸 영어',
                    de: '🇩🇪 독일어',
                    fr: '🇫🇷 프랑스어',
                    es: '🇪🇸 스페인어',
                    ko: '🇰🇷 한국어'
                }
            },
            theme: {
                label: '테마',
                description: '시각적 테마를 선택하세요',
                options: {
                    auto: '🔄 자동',
                    light: '☀️ 라이트',
                    dark: '🌙 다크'
                }
            },
            notifications: {
                label: '알림',
                description: '중요한 업데이트 받기'
            }
        },

        // 보안 설정
        securitySettings: {
            title: '보안 설정',
            description: '비밀번호 강도 및 문자 유형',
            passwordLength: {
                label: '비밀번호 길이',
                description: '비밀번호 강도 선택',
                min: '약함 (6)',
                max: '강함 (20)'
            },
            includeNumbers: {
                label: '숫자 포함',
                description: '숫자 문자 추가 (0-9)'
            },
            includeSymbols: {
                label: '기호 포함',
                description: '특수 문자 추가 (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: '특수 문자 포함',
                description: '확장 특수 문자 추가'
            },
            excludeSimilarChars: {
                label: '유사한 문자 제외',
                description: '혼동하는 문자 피하기 (l, 1, I)'
            },
            requireUniqueChars: {
                label: '고유 문자 요구',
                description: '비밀번호에 중복 문자 없음'
            }
        },

        // 이모지 설정
        emojiSettings: {
            title: '이모지 설정',
            description: '이모지 수, 카테고리, 패턴',
            emojiCount: {
                label: '이모지 수',
                description: '비밀번호의 이모지 수',
                min: '최소 (3)',
                max: '최대 (10)'
            },
            emojiPattern: {
                label: '이모지 패턴',
                description: '이모지 배치 선택',
                options: {
                    random: '랜덤',
                    sequential: '순차',
                    alternating: '교대'
                }
            },
            emojiTheme: {
                label: '이모지 테마',
                description: '이모지 스타일 선택',
                options: {
                    mixed: '혼합',
                    cute: '귀여운',
                    professional: '전문적',
                    fantasy: '판타지'
                }
            }
        },

        // 생성 설정
        generationSettings: {
            title: '생성 설정',
            description: '자동 생성 및 클립보드 옵션',
            autoGenerate: {
                label: '자동 생성',
                description: '비밀번호 자동 생성'
            },
            copyToClipboard: {
                label: '클립보드에 복사',
                description: '생성된 비밀번호 자동 복사'
            },
            showStrength: {
                label: '강도 표시',
                description: '비밀번호 강도 미터 표시'
            },
            strengthThreshold: {
                label: '강도 임계값',
                description: '필요한 최소 비밀번호 강도',
                options: {
                    low: '낮음',
                    medium: '중간',
                    high: '높음'
                }
            },
            autoRefresh: {
                label: '자동 새로고침',
                description: '약한 비밀번호 자동 재생성'
            }
        },

        // 개인정보 설정
        privacySettings: {
            title: '개인정보 설정',
            description: '데이터 수집 및 공유 설정',
            saveHistory: {
                label: '기록 저장',
                description: '생성된 비밀번호를 로컬에 저장'
            },
            analytics: {
                label: '분석',
                description: '익명 사용 통계'
            },
            shareUsage: {
                label: '사용량 공유',
                description: '개선을 위한 사용 데이터 공유'
            },
            exportHistory: {
                label: '기록 내보내기',
                description: '비밀번호 기록을 파일로 내보내기'
            },
            backupSettings: {
                label: '설정 백업',
                description: '설정 자동 백업'
            }
        },

        // Pro 기능
        proFeatures: {
            title: 'Pro 기능',
            description: '고급 설정 및 프리미엄 기능',
            securityAudit: {
                label: '보안 감사',
                description: '포괄적인 보안 분석',
                buttonText: '감사 실행'
            },
            breachCheck: {
                label: '유출 확인',
                description: '알려진 유출에 대해 비밀번호 확인'
            },
            strengthAnalytics: {
                label: '강도 분석',
                description: '고급 비밀번호 강도 분석'
            }
        }
    },

    // 회계 및 보안
    accounting: {
        // 로그인 및 인증
        login: {
            title: '로그인',
            emailPlaceholder: '이메일 주소 입력',
            magicLinkSent: '매직 링크가 전송되었습니다!',
            magicLinkError: '매직 링크 전송 오류',
            verificationSuccess: '이메일이 성공적으로 확인되었습니다!',
            verificationError: '이메일 확인 실패',
            rateLimitExceeded: '로그인 시도가 너무 많습니다. 기다려주세요.',
            sessionExpired: '세션이 만료되었습니다. 다시 로그인하세요.'
        },

        // 계정 관리
        account: {
            title: '계정 관리',
            profile: '프로필',
            settings: '설정',
            logout: '로그아웃',
            logoutSuccess: '성공적으로 로그아웃됨',
            accountCreated: '계정이 성공적으로 생성됨',
            accountUpdated: '계정이 성공적으로 업데이트됨',
            accountError: '계정 관리 오류'
        },

        // 보안 이벤트
        security: {
            loginAttempt: '로그인 시도',
            loginSuccess: '로그인 성공',
            loginFailed: '로그인 실패',
            logout: '로그아웃',
            sessionExpired: '세션 만료',
            suspiciousActivity: '의심스러운 활동',
            verificationSuccess: '확인 성공',
            verificationFailed: '확인 실패',
            accountCreated: '계정 생성',
            accountUpdated: '계정 업데이트',
            securityAudit: '보안 감사 실행'
        },

        // 검증
        validation: {
            required: '이 필드는 필수입니다',
            emailInvalid: '유효한 이메일 주소를 입력하세요',
            urlInvalid: '유효한 URL을 입력하세요',
            phoneInvalid: '유효한 전화번호를 입력하세요',
            passwordWeak:
                '비밀번호는 대문자, 소문자, 숫자를 포함한 최소 8자여야 합니다',
            minLength: '최소 길이는 {min}자입니다',
            maxLength: '최대 길이는 {max}자입니다',
            minValue: '최소값은 {min}입니다',
            maxValue: '최대값은 {max}입니다',
            validInput: '유효한 입력'
        },

        // 컨텍스트 메뉴
        contextMenu: {
            exportSettings: '설정 내보내기',
            importSettings: '설정 가져오기',
            resetToDefault: '기본값으로 재설정',
            proMessage: '💎 Pro 사용자는 설정을 내보내고 가져올 수 있습니다'
        }
    },

    // 모달 및 알림
    modals: {
        success: '성공',
        error: '오류',
        warning: '경고',
        info: '정보',
        confirm: '확인',
        cancel: '취소',
        close: '닫기',
        loading: '로딩 중...',
        saving: '저장 중...',
        exporting: '내보내는 중...',
        importing: '가져오는 중...',
        resetting: '재설정 중...'
    },
    versions: {
        pageTitle: '버전 기록',
        pageDescription:
            'Keymoji, 이모지 비밀번호 생성기의 개발 기록과 변경 기록을 확인하세요.'
    },

    // 일반 UI 텍스트
    // AccountManager 번역
    accountManager: {
        // 페이지 제목 및 설명
        pageTitle: '계정 관리',
        pageDescription: '보안 설정 및 계정 환경설정 관리',
        welcomeBack: '다시 오신 것을 환영합니다, {name}님! 👋',
        welcomeDescription:
            '놀라운 이모지 비밀번호를 만들 준비가 되셨나요? 귀하의 계정은 안전하고 준비되었습니다!',
        returnUserTitle: '👋 다시 오신 것을 환영합니다!',
        returnUserDescription:
            '귀하의 이메일 주소를 인식했습니다. 빠르게 로그인하세요.',
        verificationTitle: '📧 이메일을 확인하고 인증하세요',
        verificationDescription:
            '이메일 {email}을 확인하고 매직 링크를 클릭하여 설정을 완료하세요',
        verifyingTitle: '🔗 매직 링크 인증 중...',
        verifyingDescription: '계정을 인증하는 동안 기다려주세요.',
        verificationErrorTitle: '❌ 인증 실패',
        verificationErrorDescription: '오류가 발생했습니다.',

        // 버튼 및 작업
        buttons: {
            createMagicLink: '매직 링크 만들기',
            loginToAccount: '계정에 로그인',
            checkAccountExists: '계정 확인 중...',
            sendingMagicLink: '매직 링크 전송 중...',
            accountExists: '계정 발견 - 로그인 중...',
            accountNotFound: '계정을 찾을 수 없음 - 생성 중...',
            sessionExpired: '세션 만료 - 다시 로그인',
            loginAgain: '🔐 다시 로그인',
            createNewAccount: '새 계정 만들기',
            resendMagicLink: '🔄 매직 링크 재전송',
            backToAccountOptions: '← 계정 옵션으로 돌아가기',
            addProfile: '추가',
            hideProfile: '숨기기',
            profileData: '프로필 데이터',
            showFullForm: '전체 양식 표시',
            compactView: '간소화된 보기'
        },

        // 폼 라벨
        emailLabel: '이메일',
        nameLabel: '이름',

        // 작업
        actions: {
            saveSettings: '💾 설정 저장',
            backToHome: '🏠 홈으로 돌아가기',
            skipAccount: '❌ {type} 건너뛰기',
            createAccount: '🚀 {type} 계정 만들기',
            settingsSaved: '설정이 저장되었습니다!'
        },

        // 통계
        statistics: {
            storiesGenerated: '생성된 스토리',
            remainingGenerations: '남은 생성'
        },

        // 일일 생성
        dailyGenerations: '일일 생성',

        // 남은 생성 표시
        remainingDisplay: '남은 {remaining} / {limit}',

        // 혜택
        benefits: {
            free: {
                dailyGenerations: '하루 5회 안전한 생성',
                dailyGenerationsDesc: 'AI 저항 기술',
                decentralizedData: '분산 데이터 처리',
                decentralizedDataDesc: '귀하의 데이터는 비공개로 유지됩니다',
                webApp: '웹 앱으로 사용 가능',
                webAppDesc: '어디서든 안전하게 접근'
            },
            pro: {
                unlimitedGenerations: '무제한 안전한 생성',
                unlimitedGenerationsDesc: '일일 제한 없음',
                aiThreatDetection: 'AI 기반 위협 탐지',
                aiThreatDetectionDesc: '사전 보안 분석',
                prioritySupport: '우선 지원',
                prioritySupportDesc: '질문에 대한 빠른 도움',
                browserExtension: '브라우저 확장 프로그램 (2025년 Q4)',
                browserExtensionDesc: '웹 어디서든 보안',
                wordpressPlugin: 'WordPress 플러그인 (2025년 Q4)',
                wordpressPluginDesc: '웹사이트에 보안 통합'
            }
        },

        // 도움말 섹션
        help: {
            title: '💡 도움이 필요하신가요?',
            spamFolder: '• 이메일이 보이지 않으면 스팸 폴더를 확인하세요',
            magicLinkExpiry: '• 매직 링크는 15분 후 만료됩니다',
            requestNewLink: '• 언제든지 새 링크를 요청할 수 있습니다',
            noPassword: '• 비밀번호 불필요 - 링크만 클릭하세요'
        },

        // 푸터
        footer: {
            magicLink: '매직 링크',
            instantSetup: '즉시 설정',
            noSpam: '스팸 없음',
            text: '매직 링크는 이메일로 전송되며 15분간 유효합니다.',
            privacy: '귀하의 데이터는 안전하게 처리됩니다.'
        },

        // 제한 및 메시지
        canStillGenerate: '아직 이모지를 생성할 수 있습니다!',
        limitReached:
            '일일 제한에 도달했습니다. 무제한 생성을 위해 PRO로 업그레이드하세요.',

        // 계정 연령
        accountAge: {
            today: '오늘 생성됨',
            yesterday: '어제 생성됨',
            days: '{days}일 전부터',
            weeks: '{weeks}주{plural} 전부터',
            months: '{months}개월{plural} 전부터',
            years: '{years}년{plural} 전부터',
            accountSince: '{days} {unit} 전 계정',
            since: '{days} {unit} 전부터',
            day: '일',
            daysLabel: '일',
            accountCreated: '계정 생성됨'
        },

        // 검증
        validation: {
            emailInvalid: '유효한 이메일 주소를 입력하세요',
            nameInvalid: '이름을 입력하세요 (최소 2자)'
        },

        // 메시지
        messages: {
            settingsReset: '설정이 기본값으로 재설정되었습니다',
            exportFailed: '설정 내보내기 실패',
            settingsExported: '설정이 성공적으로 내보내졌습니다',
            freeAccountActivated: '무료 계정이 활성화되었습니다!'
        },

        // 업그레이드 섹션
        upgrade: {
            upgradeToPro: 'Pro로 업그레이드',
            upgradeToProForFeatures: '고급 기능을 위해 Pro로 업그레이드',
            unlimitedGenerations: '무제한 생성 및 고급 보안 기능'
        },

        // 컨텍스트 메뉴
        contextMenu: {
            exportSettings: '설정 내보내기',
            importSettings: '설정 가져오기',
            resetToDefault: '기본값으로 재설정',
            logout: '로그아웃',
            settingsMenu: '설정 메뉴'
        },

        // 기능
        features: {
            proFeature: 'Pro 기능'
        },

        // Pro 기능 모달
        proFeatureModal: {
            title: 'Pro 기능',
            proBenefits: 'Pro 혜택:',
            unlimitedGenerations: '무제한 이모지 생성',
            advancedSecurity: '고급 보안 기능',
            prioritySupport: '우선 지원',
            earlyAccess: '새 기능에 대한 조기 액세스',
            maybeLater: '나중에',
            upgradeToPro: 'Pro로 업그레이드',
            // Pro 업그레이드 전용
            proUpgrade: 'Pro 업그레이드',
            unlockAdvancedFeatures: '모든 고급 기능 및 설정 잠금 해제',
            upgradeProNow: '💎 지금 Pro로 업그레이드'
        },

        // 계정 레벨
        tiers: {
            free: '무료',
            pro: 'PRO',
            freeAccount: '무료 계정',
            proAccount: 'Pro 계정'
        },

        // 배지
        freeBadge: '✨ 무료',
        proBadge: '💎 PRO',

        // 설명
        freeDescription: '✨ 무료 보안',
        proDescription: '�� 엔터프라이즈 보안'
    },

    ui: {
        save: '저장',
        cancel: '취소',
        reset: '재설정',
        export: '내보내기',
        import: '가져오기',
        delete: '삭제',
        edit: '편집',
        add: '추가',
        remove: '제거',
        search: '검색',
        filter: '필터',
        sort: '정렬',
        refresh: '새로고침',
        back: '뒤로',
        next: '다음',
        previous: '이전',
        submit: '제출',
        loading: '로딩 중...',
        error: '오류',
        success: '성공',
        warning: '경고',
        info: '정보'
    }
};
