// src/data/languages/sjn.js
// Sindarin language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'sjn',
        name: 'Sindarin',
        nativeName: 'Sindarin',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Agor hen menu',
        closeMainMenu: 'Naw hen menu'
    },
    index: {
        pageTitle: 'Emoji Password Generator',
        pageDescription:
            '🔑 Passwords reimagined. 🎯 Unbreakable emoji passwords. 🌈 Free. Secure. Innovative. 🤖 AI-resistant technology. 🌍 Available in 15+ languages.',
        pageKeywords:
            'Keymoji, emoji password, password generator, security, online security',
        pageInstruction: [
            'Click "📝 Story" for your AI emoji story 📖',
            '"Random" speaks for itself 😜.',
            'After generation it will be copied to your clipboard! 📋'
        ],
        backToMainText: 'Click below 👇 to return',
        backToMainButtonText: 'Back to home',
        contactText: 'Do you have a question or cool suggestion?',
        contactButtonText: 'Send me a message! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Click or press Enter to copy the generated emoji password to clipboard',
        successMessage: 'Success, copied to clipboard 💾',
        errorMessage: 'Oops, something went wrong 🤖',
        dailyLimitReachedMessage: 'Sorry, daily request limit reached 😔',
        successStoryMessage: 'Success, emoji story generated 🤖',
        errorStoryMessage: 'Error, no response from server 🌀',
        emojiDisplayTitle: 'Emoji Password Generator',
        dataPrivacyProcessingInfo:
            "🚀 Emoji magic via webhooks and AI! ✨ Data is like beach sand - it doesn't stay.",
        clearButton: '✖️ Clear',
        storyButton: '📝 Story',
        storyButtonClicked: '📩 Send story',
        randomButton: '🎲 Random',
        placeholderText:
            'Tell me a story and I will generate emoji passwords based on it...',
        clipboardError: 'Error copying to clipboard'
    },
    donateButton: {
        text: 'Buy me a coffee',
        openText: 'Close this menu',
        textMobile: '☕'
    },
    // Contact form (optimized for Sindarin)
    contactForm: {
        pageTitle: 'Suilad, im Christopher',
        pageDescription:
            'Frontend developer and I love designing and coding user-friendly websites with JavaScript, PHP and HTML. Do not hesitate and send me a message if you want.',
        nameLabel: '🧑🏻 i eneth lín',
        emailLabel: '📧 i epist lín',
        messageLabel: '✍🏻 i peth lín',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Erio',
        sendingButton: '📨 Erio...',
        successMessage: 'Success, message sent - Response: < 24 hours 🚀',
        errorMessage: 'An unexpected error occurred 😟',
        requestErrorMessage: 'Error sending message, please try again 🙁',
        smirkingFaceImageAlt: 'keymoji emoji smirking face 1f60f',
        introductionTitle: 'Do you have a question or cool suggestion?',
        introductionText: 'Send me a message!',
        privacyNotice:
            'Be assured, your data is in good hands with us 🤲. Your details will not be passed on to third parties 🔒.',
        newsletterLabel: 'Yes, I want to subscribe to the newsletter',
        backToMainButton: 'Back to home',
        footerText: 'Developed with love',
        validationErrorMessage: 'Please fix the form errors before sending 🔍',
        sendingMessage: 'Sending your message... 📨',
        emailText: {
            greeting: 'Welcome',
            confirmationText:
                'Please confirm your request so Christopher knows you are not an intelligent bot. You sent a message with the following data:',
            doubleCheck: 'We received your message with the following details:',
            button: 'Confirm your email'
        },
        validation: {
            nameRequired: 'i eneth hiruva',
            nameLength: 'Minimum 2 characters',
            emailRequired: 'i epist hiruva',
            emailInvalid: 'i epist ú-valid',
            messageRequired: 'i peth hiruva',
            messageLength: 'Minimum {min} characters'
        }
    },
    serviceWorker: {
        updateAvailable: 'A new version is available!',
        manualRefreshNeeded:
            'New version activated. Reload now for the latest features.',
        updateSuccess: 'App successfully updated! 🎉'
    },
    notFound: {
        message: 'Oops! Page not found 🚫',
        backButton: 'Back to home',
        contactButton: 'Contact us'
    },
    blog: {
        readMore: 'Read more',
        backToBlog: 'Back to blog',
        publishedOn: 'Published on',
        author: 'Author',
        tags: 'Tags',
        readTime: 'min read time',
        likes: 'likes',
        share: 'Share'
    },
    account: {
        create: 'Create account',
        manage: 'Manage account',
        login: 'Login',
        logout: 'Logout',
        profile: 'Profile',
        settings: 'Settings',
        guest: 'Guest',
        free: 'FREE',
        pro: 'PRO'
    },
    accessibility: {
        skipToMain: 'Skip to main content',
        closeModal: 'Close modal',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        loading: 'Loading...',
        error: 'Error occurred',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        copyToClipboard: 'Copy to clipboard',
        copiedToClipboard: 'Copied to clipboard',
        generatePassword: 'Generate password',
        clearForm: 'Clear form',
        sendMessage: 'Send message',
        toggleDarkMode: 'Toggle dark mode',
        toggleLanguage: 'Toggle language'
    },
    validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: 'Must contain at least {min} characters',
        maxLength: 'Cannot contain more than {max} characters',
        invalidFormat: 'Invalid format',
        serverError: 'Server error, please try again',
        networkError: 'Network error, check your connection'
    },

    // UserSettings translations
    userSettings: {
        // Basic settings
        basicSettings: {
            title: 'Basic settings',
            description: 'Language, theme and notifications',
            language: {
                label: 'Language',
                description: 'Choose your preferred language',
                options: {
                    en: '🇺🇸 English',
                    de: '🇩🇪 German',
                    fr: '🇫🇷 French',
                    es: '🇪🇸 Spanish',
                    sjn: '🌿 Sindarin'
                }
            },
            theme: {
                label: 'Theme',
                description: 'Choose your visual theme',
                options: {
                    auto: '🔄 Auto',
                    light: '☀️ Light',
                    dark: '🌙 Dark'
                }
            },
            notifications: {
                label: 'Notifications',
                description: 'Receive important updates'
            }
        },

        // Security settings
        securitySettings: {
            title: 'Security settings',
            description: 'Password strength and character types',
            passwordLength: {
                label: 'Password length',
                description: 'Choose password strength',
                min: 'Weak (6)',
                max: 'Strong (20)'
            },
            includeNumbers: {
                label: 'Include numbers',
                description: 'Add numeric characters (0-9)'
            },
            includeSymbols: {
                label: 'Include symbols',
                description: 'Add special characters (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Include special characters',
                description: 'Add extended special characters'
            },
            excludeSimilarChars: {
                label: 'Exclude similar characters',
                description: 'Avoid confusing characters (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Require unique characters',
                description: 'No repeated characters in password'
            }
        },

        // Emoji settings
        emojiSettings: {
            title: 'Emoji settings',
            description: 'Emoji count, categories and patterns',
            emojiCount: {
                label: 'Emoji count',
                description: 'Number of emojis in password',
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Emoji pattern',
                description: 'Choose emoji arrangement',
                options: {
                    random: 'Random',
                    sequential: 'Sequential',
                    alternating: 'Alternating'
                }
            },
            emojiTheme: {
                label: 'Emoji theme',
                description: 'Choose emoji style',
                options: {
                    mixed: 'Mixed',
                    cute: 'Cute',
                    professional: 'Professional',
                    fantasy: 'Fantasy'
                }
            }
        },

        // Generation settings
        generationSettings: {
            title: 'Generation settings',
            description: 'Auto-generation and clipboard options',
            autoGenerate: {
                label: 'Auto-generation',
                description: 'Automatically generate passwords'
            },
            copyToClipboard: {
                label: 'Copy to clipboard',
                description: 'Automatically copy generated passwords'
            },
            showStrength: {
                label: 'Show strength',
                description: 'Show password strength meter'
            },
            strengthThreshold: {
                label: 'Strength threshold',
                description: 'Minimum required password strength',
                options: {
                    low: 'Low',
                    medium: 'Medium',
                    high: 'High'
                }
            },
            autoRefresh: {
                label: 'Auto-refresh',
                description: 'Automatically regenerate weak passwords'
            }
        },

        // Privacy settings
        privacySettings: {
            title: 'Privacy settings',
            description: 'Data collection and sharing preferences',
            saveHistory: {
                label: 'Save history',
                description: 'Save generated passwords locally'
            },
            analytics: {
                label: 'Analytics',
                description: 'Anonymous usage statistics'
            },
            shareUsage: {
                label: 'Share usage',
                description: 'Share usage data for improvements'
            },
            exportHistory: {
                label: 'Export history',
                description: 'Export password history to file'
            },
            backupSettings: {
                label: 'Backup settings',
                description: 'Automatically backup settings'
            }
        },

        // Pro features
        proFeatures: {
            title: 'Pro features',
            description: 'Advanced settings and premium features',
            securityAudit: {
                label: 'Security audit',
                description: 'Comprehensive security analysis',
                buttonText: 'Run audit'
            },
            breachCheck: {
                label: 'Breach check',
                description: 'Check passwords against known breaches'
            },
            strengthAnalytics: {
                label: 'Strength analytics',
                description: 'Advanced password strength analysis'
            }
        }
    },

    // Accounting and security
    accounting: {
        // Login and authentication
        login: {
            title: 'Login',
            emailPlaceholder: 'Enter your email address',
            magicLinkSent: 'Magic link sent!',
            magicLinkError: 'Error sending magic link',
            verificationSuccess: 'Email successfully verified!',
            verificationError: 'Email verification failed',
            rateLimitExceeded: 'Too many login attempts. Please wait.',
            sessionExpired: 'Session expired. Please login again.'
        },

        // Account management
        account: {
            title: 'Account management',
            profile: 'Profile',
            settings: 'Settings',
            logout: 'Logout',
            logoutSuccess: 'Successfully logged out',
            accountCreated: 'Account successfully created',
            accountUpdated: 'Account successfully updated',
            accountError: 'Account management error'
        },

        // Security events
        security: {
            loginAttempt: 'Login attempt',
            loginSuccess: 'Successful login',
            loginFailed: 'Login failed',
            logout: 'Logout',
            sessionExpired: 'Session expired',
            suspiciousActivity: 'Suspicious activity',
            verificationSuccess: 'Verification successful',
            verificationFailed: 'Verification failed',
            accountCreated: 'Account created',
            accountUpdated: 'Account updated',
            securityAudit: 'Security audit performed'
        },

        // Validation
        validation: {
            required: 'This field is required',
            emailInvalid: 'Please enter a valid email address',
            urlInvalid: 'Please enter a valid URL',
            phoneInvalid: 'Please enter a valid phone number',
            passwordWeak:
                'Password must contain at least 8 characters with uppercase, lowercase letters and numbers',
            minLength: 'Minimum length is {min} characters',
            maxLength: 'Maximum length is {max} characters',
            minValue: 'Minimum value is {min}',
            maxValue: 'Maximum value is {max}',
            validInput: 'Valid input'
        },

        // Context menu
        contextMenu: {
            exportSettings: 'Export settings',
            importSettings: 'Import settings',
            resetToDefault: 'Reset to default',
            proMessage: '💎 Pro users can export and import their settings'
        }
    },

    // Modals and notifications
    modals: {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',
        confirm: 'Confirm',
        cancel: 'Cancel',
        close: 'Close',
        loading: 'Loading...',
        saving: 'Saving...',
        exporting: 'Exporting...',
        importing: 'Importing...',
        resetting: 'Resetting...'
    },

    // AccountManager translations
    accountManager: {
        // Headers and descriptions
        pageTitle: 'Account Management',
        pageDescription:
            'Manage your security settings and account preferences',
        welcomeBack: 'Welcome back, {name}! 👋',
        welcomeDescription:
            'Ready to create some amazing emoji passwords? Your account is secure and ready to go!',
        verificationTitle: '📧 Check Your Email and Verify',
        verificationDescription:
            'Check your email {email} and click the magic link to complete setup',

        // Account Status
        accountStatus: 'Account Status',
        emailLabel: 'Email Address',
        nameLabel: 'Your Name',
        profileDataLabel: 'Profile Data',

        // Account Tiers
        freeBadge: '✨ FREE',
        proBadge: '💎 PRO',
        freeDescription: '✨ Free Security',
        proDescription: '💎 Enterprise Security',

        // Benefits
        benefits: {
            free: {
                title: 'FREE Benefits',
                dailyGenerations: '5 daily secure generations',
                dailyGenerationsDesc: 'AI-resistant technology',
                decentralizedData: 'Decentralized data processing',
                decentralizedDataDesc: 'Your data stays private',
                webApp: 'Available as web app',
                webAppDesc: 'Secure access from anywhere'
            },
            pro: {
                title: 'PRO Benefits',
                unlimitedGenerations: 'Unlimited secure generations',
                unlimitedGenerationsDesc: 'No daily limits',
                aiThreatDetection: 'AI-powered threat detection',
                aiThreatDetectionDesc: 'Proactive security analysis',
                browserExtension: 'Browser Extension (Q4 2025)',
                browserExtensionDesc: 'Security everywhere on the web',
                wordpressPlugin: 'WordPress Plugin (Q4 2025)',
                wordpressPluginDesc: 'Integrate security into your website'
            }
        },

        // Daily Limit
        dailyGenerations: 'Daily Generations',
        remainingGenerations: '{remaining} / {limit} remaining',
        canStillGenerate: 'You can still generate emojis!',
        limitReached:
            'Daily limit reached. Upgrade to PRO for unlimited generations.',

        // Statistics
        statistics: {
            storiesGenerated: 'Stories Generated',
            remainingGenerations: 'Remaining Generations'
        },

        // Actions
        actions: {
            saveSettings: '💾 Save Settings',
            backToHome: '🏠 Back to Home',
            createAccount: '🚀 Create {type} Account',
            skipAccount: 'Skip {type} Account',
            createMagicLink: '🔐 Create Magic-Link',
            sendingMagicLink: '⏳ Sending Magic-Link...',
            resendMagicLink: '🔄 Resend Magic Link',
            backToAccountOptions: '← Back to Account Options',
            addProfileData: '�� Add Profile Data',
            hideProfileData: '👤 Hide Profile Data'
        },

        // Form Validation
        validation: {
            invalidEmail: '⚠️ Please enter a valid email address',
            invalidName: '⚠️ Please enter your name (minimum 2 characters)',
            requiredField: 'This field is required'
        },

        // Help Section
        help: {
            title: '💡 Need Help?',
            checkSpam: "• Check your spam folder if you don't see the email",
            linkExpires: '• Magic links expire after 15 minutes',
            requestNewLink: '• You can request a new link anytime',
            noPassword: '• No password required - just click the link'
        },

        // Footer
        footer: {
            magicLink: '🔒 Magic link',
            instantSetup: '⚡ Instant Setup',
            noSpam: '🎯 No Spam'
        }
    },

    // General UI texts
    ui: {
        save: 'Save',
        cancel: 'Cancel',
        reset: 'Reset',
        export: 'Export',
        import: 'Import',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        remove: 'Remove',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Info'
    }
};
