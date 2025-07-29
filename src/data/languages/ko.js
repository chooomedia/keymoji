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
            '🔑 비밀번호를 재발명했습니다. 🎯 깨지지 않는 이모지 비밀번호. 🌈 무료. 안전. 혁신적. 🤖 AI 저항 기술. 🌍 15개 이상의 언어로 제공됩니다.',
        pageKeywords:
            'Keymoji, 이모지 비밀번호, 비밀번호 생성기, 보안, 온라인 보안',
        pageInstruction: [
            'AI 이모지 이야기를 위해 "📝 스토리" 클릭 📖',
            '"랜덤"은 자명합니다 😜.',
            '생성 후 클립보드에 저장됩니다! 📋'
        ],
        backToMainText: '아래를 클릭 👇 하여 돌아가기',
        backToMainButtonText: '메인 보기로 돌아가기 🔙',
        contactText: '질문이나 멋진 제안이 있나요?',
        contactButtonText: '메시지를 보내주세요! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            '생성된 이모지 비밀번호를 클립보드에 복사하려면 클릭하거나 Enter를 누르세요',
        successMessage: '성공, 클립보드에 복사됨 💾',
        errorMessage: '앗, 뭔가 잘못되었습니다 🤖',
        dailyLimitReachedMessage:
            '죄송합니다, 일일 요청 한도에 도달했습니다 😔',
        successStoryMessage: '성공, 이모지 스토리 생성됨 🤖',
        errorStoryMessage: '오류, 서버에서 응답 없음 🌀',
        emojiDisplayTitle: '이모지 비밀번호 생성기',
        dataPrivacyProcessingInfo:
            '🚀 웹훅과 AI를 통한 이모지 마법! ✨ 데이터는 해변의 모래처럼 - 남지 않습니다.',
        clearButton: '✖️ 지우기',
        storyButton: '📝 스토리',
        storyButtonClicked: '📩 스토리 보내기',
        randomButton: '🎲 랜덤',
        placeholderText:
            '이야기를 들려주시면 그에 기반한 이모지 비밀번호를 생성하겠습니다...'
    },
    donateButton: {
        text: '커피 한 잔 사주세요',
        openText: '이 메뉴 닫기',
        textMobile: '☕'
    },
    contactForm: {
        pageTitle: '안녕하세요, 저는 크리스토퍼입니다',
        pageDescription:
            '프론트엔드 개발자이고 JavaScript, PHP, HTML로 사용자 친화적인 웹사이트를 디자인하고 코딩하는 것을 좋아합니다. 주저하지 말고 메시지를 보내주세요.',
        nameLabel: '🧑🏻 이름',
        emailLabel: '📧 이메일',
        messageLabel: '✍🏻 메시지',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 보내기',
        sendingButton: '📨 전송 중...',
        successMessage: '성공, 메시지 전송됨 - 답변: < 24시간 🚀',
        errorMessage: '예상치 못한 오류가 발생했습니다 😟',
        requestErrorMessage:
            '메시지 전송 중 오류가 발생했습니다, 다시 시도해주세요 🙁',
        smirkingFaceImageAlt: 'keymoji 이모지 썩소 1f60f',
        introductionTitle: '질문이나 멋진 제안이 있으신가요?',
        introductionText: '메시지를 보내주세요!',
        privacyNotice:
            '안심하세요, 귀하의 데이터는 우리와 함께 안전한 손에 있습니다 🤲. 귀하의 세부사항은 제3자에게 전달되지 않습니다 🔒.',
        newsletterLabel: '네, 뉴스레터를 구독하고 싶습니다',
        backToMainButton: '홈으로 돌아가기',
        footerText: '사랑으로 개발됨',
        validationErrorMessage: '제출하기 전에 양식 오류를 수정해주세요 🔍',
        sendingMessage: '메시지를 전송하고 있습니다... 📨',
        emailText: {
            greeting: '환영합니다',
            intro: '메시지를 보내주셔서 감사합니다 📩!',
            confirmationText:
                '크리스토퍼가 당신이 지능적인 봇이 아님을 알 수 있도록 요청을 확인해주세요. 다음 데이터로 메시지를 보냈습니다:',
            doubleCheck: '다음 세부사항으로 메시지를 받았습니다:',
            button: '이메일 확인',
            subject: 'Keymoji로 보낸 메시지가 접수되었습니다',
            privacy: '귀하의 데이터는 안전하게 처리됩니다.'
        },
        validation: {
            nameRequired: '이름이 필요합니다',
            nameLength: '최소 2자 이상',
            emailRequired: '이메일이 필요합니다',
            emailInvalid: '유효하지 않은 이메일',
            messageRequired: '메시지가 필요합니다',
            messageLength: '최소 {min}자 이상'
        }
    },
    serviceWorker: {
        updateAvailable: '새 버전이 사용 가능합니다!',
        manualRefreshNeeded:
            '새 버전이 활성화되었습니다. 최신 기능을 위해 지금 새로고침하세요.',
        updateSuccess: '앱이 성공적으로 업데이트되었습니다! 🎉'
    },
    notFound: {
        pageTitle: '404 - 페이지를 찾을 수 없습니다',
        pageDescription: '찾고 계신 페이지가 존재하지 않거나 이동되었습니다.',
        message: '앗! 페이지를 찾을 수 없습니다 🚫',
        suggestion:
            '찾고 계신 페이지가 이동되었거나 삭제되었거나 존재하지 않았을 수 있습니다.',
        backButton: '홈으로 돌아가기',
        contactButton: '문의하기',
        navigationTitle: '사용 가능한 페이지',
        recentEmojis: '최근 이모지'
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
        error: '오류가 발생했습니다',
        success: '성공',
        warning: '경고',
        info: '정보',
        copyToClipboard: '클립보드에 복사',
        copiedToClipboard: '클립보드에 복사됨',
        generatePassword: '비밀번호 생성',
        clearForm: '양식 지우기',
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
    versions: {
        pageTitle: '버전 기록',
        pageDescription:
            'Keymoji, 이모지 비밀번호 생성기의 개발 기록과 변경 로그를 확인하세요.'
    }
};
