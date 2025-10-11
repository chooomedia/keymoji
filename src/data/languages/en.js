// src/data/languages/en.js
// English language content

import { formatVersion } from '../../utils/version.js';

export default {
    _meta: {
        language: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        created: new Date().toISOString()
    },
    header: {
        pageTitle: 'Keymoji',
        pageVersion: formatVersion(),
        openMainMenu: 'Open main menu',
        closeMainMenu: 'Close main menu'
    },
    index: {
        pageTitle: 'Emoji Password Generator',
        pageDescription:
            '🔑 Passwords reimagined. 🎯 Uncrackable emoji passwords. 🌈 Free. Secure. Innovative. 🤖 AI-resistant technology. 🌍 Available in 15+ languages.',
        pageKeywords:
            'Keymoji, emoji password, password generator, security, online security',
        pageInstruction: [
            'Click "📝 Story" for your AI emoji tale 📖',
            '"Random" is self-explanatory 😜.',
            "After generating, it's saved to your clipboard! 📋"
        ],
        backToMainText: 'Click on below 👇 to get back',
        backToMainButtonText: 'Back to home',
        contactText: 'Got a question or a cool suggestion?',
        contactButtonText: 'Send me a message! 💌'
    },
    emojiDisplay: {
        clickToCopy:
            'Click or press Enter to copy the generated emoji password to clipboard',
        successMessage: 'Success, copied into your Clipboard 💾',
        errorMessage: 'Oops, something went wrong 🤖',
        dailyLimitReachedMessage: 'Sorry, daily limit of requests reached 😔',
        successStoryMessage: 'Success, Emoji story generated 🤖',
        errorStoryMessage: 'Error, no answer from server 🌀',
        emojiDisplayTitle: 'Emoji Password Generator',
        dataPrivacyProcessingInfo:
            "🚀 Emoji magic via webhooks and AI! ✨ Data's like beach sand - it doesn't stay.",
        clearButton: 'Clear',
        storyButton: '✨ Story',
        storyButtonClicked: '✨ Generate Story',
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
    contactForm: {
        pageTitle: "Hi, i'm Christopher",
        pageDescription:
            "Frontend Developer and i love to design and code userfriendly Websites with JavaScript, PHP and HTML. Don't hesitate and send me a message if you like.",
        nameLabel: '🧑🏻 Your Name',
        emailLabel: 'Your Email',
        messageLabel: '✍🏻 Your Message',
        regenerateCaptchaButton: '🔄',
        sendButton: '🚀 Send',
        sendingButton: '📨 Sending...',
        successMessage: 'Success, Message sent - Answer: < 24 hours 🚀',
        errorMessage: 'An unexpected error occurred 😟',
        requestErrorMessage: 'Error sending the message, please try again 🙁',
        smirkingFaceImageAlt: 'keymoji emoji smirkingface 1f60f',
        introductionTitle: 'Have a question or a cool suggestion?',
        introductionText: 'Send me a message!',
        privacyNotice:
            'Rest assured, your data is in good hands with us 🤲. Your details will not be passed on to third parties 🔒.',
        newsletterLabel: 'Yes, I would like to subscribe to the newsletter',
        newsletterOptIn: 'Subscribe to newsletter',
        newsletterText:
            'Stay up to date and subscribe to the newsletter with confidence. {privacyPolicy}',
        privacyPolicyLink: 'View privacy policy',
        privacyPolicyUrl: '/privacy',
        backToMainButton: 'Back to home',
        footerText: 'Developed with love',
        validationErrorMessage:
            'Please fix the form errors before submitting 🔍',
        sendingMessage: 'Sending your message... 📨',
        emailText: {
            greeting: 'Welcome',
            confirmationText:
                'Please confirm your request so Christopher knows you are not an intelligent bot. You sent a message with the following data:',
            doubleCheck: 'We received your message with the following details:',
            button: 'Confirm your email',
            subject: 'Your message to Keymoji has been received',
            privacy: 'Your data is handled securely.'
        },
        validation: {
            nameRequired: 'Name required',
            nameLength: 'Minimum 2 characters',
            emailRequired: 'Email required',
            emailInvalid: 'Invalid email',
            messageRequired: 'Message required',
            messageLength: 'Minimum {min} characters'
        },
        autoFilledLabel: 'Auto-filled from your account'
    },
    serviceWorker: {
        updateAvailable: 'A new version is available!',
        manualRefreshNeeded:
            'New version activated. Reload now for the latest features.',
        updateSuccess: 'App updated successfully! 🎉'
    },
    notFound: {
        pageTitle: '404 - Page Not Found',
        pageDescription:
            'The page you are looking for does not exist or has been moved.',
        oopsTitle: 'Oops! Page not found',
        oopsDescription:
            'The page you are looking for might have been moved, deleted, or never existed.',
        quickNavTitle: 'Quick Navigation',
        recentEmojisTitle: 'Recent Keymojis',
        backToHome: 'Back to Home',
        prevEmoji: 'Previous emoji',
        nextEmoji: 'Next emoji',
        message: 'Oops! Page not found 🚫',
        suggestion:
            'The page you are looking for might have been moved, deleted, or never existed.',
        backButton: 'Go back home',
        contactButton: 'Contact us',
        navigationTitle: 'Available Pages',
        recentEmojis: 'Recent Emojis'
    },
    blog: {
        readMore: 'Read more',
        backToBlog: 'Back to blog',
        publishedOn: 'Published on',
        author: 'Author',
        tags: 'Tags',
        readTime: 'min read',
        likes: 'likes',
        share: 'Share'
    },
    account: {
        create: 'Create Account',
        manage: 'Manage Account',
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
        minLength: 'Must be at least {min} characters',
        maxLength: 'Must be no more than {max} characters',
        invalidFormat: 'Invalid format',
        serverError: 'Server error, please try again',
        networkError: 'Network error, please check your connection'
    },
    versions: {
        pageTitle: 'Version History',
        pageDescription:
            'Check out the development history and changelog of Keymoji, the emoji password generator.'
    },

    // UserSettings translations
    userSettings: {
        // Basic settings
        basicSettings: {
            title: 'Basic Settings',
            description: 'Language, theme and notifications',
            language: {
                label: 'Language',
                description: 'Choose your preferred language',
                options: {
                    en: '🇺🇸 English',
                    de: '🇩🇪 German',
                    fr: '🇫🇷 French',
                    es: '🇪🇸 Spanish'
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
            title: 'Security Settings',
            description: 'Password strength and character types',
            passwordLength: {
                label: 'Password Length',
                description: 'Choose password strength',
                min: 'Weak (6)',
                max: 'Strong (20)'
            },
            includeNumbers: {
                label: 'Include Numbers',
                description: 'Add numeric characters (0-9)'
            },
            includeSymbols: {
                label: 'Include Symbols',
                description: 'Add special characters (!@#$%^&*)'
            },
            includeSpecialChars: {
                label: 'Include Special Characters',
                description: 'Add extended special characters'
            },
            excludeSimilarChars: {
                label: 'Exclude Similar Characters',
                description: 'Avoid confusing characters (l, 1, I)'
            },
            requireUniqueChars: {
                label: 'Require Unique Characters',
                description: 'No repeated characters in password'
            }
        },

        // Emoji settings
        emojiSettings: {
            title: 'Emoji Settings',
            description: 'Emoji count, categories and patterns',
            emojiCount: {
                label: 'Emoji Count',
                description: 'Number of emojis in password',
                min: 'Min (3)',
                max: 'Max (10)'
            },
            emojiPattern: {
                label: 'Emoji Pattern',
                description: 'Choose emoji arrangement',
                options: {
                    random: 'Random',
                    sequential: 'Sequential',
                    alternating: 'Alternating'
                }
            },
            emojiTheme: {
                label: 'Emoji Theme',
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
            title: 'Generation Settings',
            description: 'Auto-generation and clipboard options',
            autoGenerate: {
                label: 'Auto Generate',
                description: 'Automatically generate passwords'
            },
            copyToClipboard: {
                label: 'Copy to Clipboard',
                description: 'Automatically copy generated passwords'
            },
            showStrength: {
                label: 'Show Strength',
                description: 'Display password strength meter'
            },
            strengthThreshold: {
                label: 'Strength Threshold',
                description: 'Minimum required password strength',
                options: {
                    low: 'Low',
                    medium: 'Medium',
                    high: 'High'
                }
            },
            autoRefresh: {
                label: 'Auto Refresh',
                description: 'Automatically regenerate weak passwords'
            }
        },

        // Privacy settings
        privacySettings: {
            title: 'Privacy Settings',
            description: 'Data collection and sharing preferences',
            saveHistory: {
                label: 'Save History',
                description: 'Save generated passwords locally'
            },
            analytics: {
                label: 'Analytics',
                description: 'Anonymous usage statistics'
            },
            shareUsage: {
                label: 'Share Usage',
                description: 'Share usage data for improvements'
            },
            exportHistory: {
                label: 'Export History',
                description: 'Export password history to file'
            },
            backupSettings: {
                label: 'Backup Settings',
                description: 'Automatically backup settings'
            }
        },

        // Pro features
        proFeatures: {
            title: 'Pro Features',
            description: 'Advanced settings and premium features',
            securityAudit: {
                label: 'Security Audit',
                description: 'Comprehensive security analysis',
                buttonText: 'Start Audit'
            },
            breachCheck: {
                label: 'Breach Check',
                description: 'Check passwords against known breaches'
            },
            strengthAnalytics: {
                label: 'Strength Analytics',
                description: 'Advanced password strength analysis'
            }
        }
    },

    // Accounting and security
    accounting: {
        // Login and authentication
        login: {
            title: 'Login',
            emailPlaceholder: 'Enter email address',
            magicLinkSent: 'Magic link sent!',
            magicLinkError: 'Error sending magic link',
            verificationSuccess: 'Email verified successfully!',
            verificationError: 'Email verification failed',
            rateLimitExceeded: 'Too many login attempts. Please wait.',
            sessionExpired: 'Session expired. Please login again.'
        },

        // Account management
        account: {
            title: 'Account Management',
            profile: 'Profile',
            settings: 'Settings',
            logout: 'Logout',
            logoutSuccess: 'Successfully logged out',
            accountCreated: 'Account created successfully',
            accountUpdated: 'Account updated successfully',
            accountError: 'Account management error'
        },

        // Security events
        security: {
            loginAttempt: 'Login attempt',
            loginSuccess: 'Successful login',
            loginFailed: 'Failed login',
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
                'Password must be at least 8 characters with uppercase, lowercase and number',
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
        resetting: 'Resetting...',
        closeModal: 'Close modal',
        modalClosesIn: 'Modal closes in {seconds} seconds',
        modalClosesInSingular: 'Modal closes in {seconds} second'
    },

    // AccountManager translations
    accountManager: {
        // Page titles and descriptions
        pageTitle: 'Account Manager',
        pageDescription:
            'Manage your security settings and account preferences',
        welcomeBack: 'Welcome back, {name}! 👋',
        welcomeDescription:
            'Ready to create some amazing emoji passwords? Your account is secure and ready to go!',
        returnUserTitle: '👋 Welcome back!',
        returnUserDescription:
            'We recognized your email address. Log in quickly.',
        verificationTitle: '📧 Check Your Email and Verify',
        verificationDescription:
            'Check your email {email} and click the magic link to complete setup',
        verifyingTitle: '🔗 Verifying Magic Link...',
        verifyingDescription: 'Please wait while we verify your account.',
        verificationErrorTitle: '❌ Verification Failed',
        verificationErrorDescription: 'An error occurred.',

        // Buttons and actions
        buttons: {
            createMagicLink: 'Create Magic Link',
            loginToAccount: 'Login to Account',
            checkAccountExists: 'Checking account...',
            sendingMagicLink: 'Sending...',
            accountExists: 'Account found - Logging in...',
            accountNotFound: 'Account not found - Creating...',
            sessionExpired: 'Session expired - Login again',
            loginAgain: '🔐 Login again',
            createNewAccount: 'Create new account',
            resendMagicLink: '🔄 Resend Magic Link',
            backToAccountOptions: '← Back to Account Options',
            addProfile: 'Add',
            hideProfile: 'Hide',
            profileData: 'Profile Data',
            showFullForm: 'Show full form',
            compactView: 'Compact view',
            addName: 'Add your name'
        },

        // Form labels
        emailLabel: 'Email',
        nameLabel: 'Name',

        // Actions
        actions: {
            saveSettings: '💾 Save Settings',
            backToHome: '🏠 Back to Home',
            skipAccount: '❌ Skip {type}',
            createAccount: '🚀 Create {type} Account',
            settingsSaved: 'Settings saved successfully!'
        },

        // Statistics
        statistics: {
            storiesGenerated: 'Stories Generated',
            remainingGenerations: 'Remaining Generations'
        },

        // Daily generations
        dailyGenerations: 'Daily Generations',

        // Remaining generations display
        remainingDisplay: '{remaining} / {limit}',

        // Demo Chart (when no real data)
        demoChart: {
            title: 'No Data',
            description:
                'Generate emojis to collect your real usage data and display it here.',
            cta: 'Get Keymoji now'
        },

        // Benefits
        benefits: {
            free: {
                dailyGenerations: '9 daily secure generations',
                dailyGenerationsDesc:
                    'AI-resistant technology for maximum security',
                decentralizedData: 'Decentralized data processing',
                decentralizedDataDesc:
                    'Your data stays with you - never on foreign servers',
                webApp: 'Available as web app',
                webAppDesc: 'Instantly available - no installation needed'
            },
            pro: {
                unlimitedGenerations: 'Unlimited secure generations',
                unlimitedGenerationsDesc:
                    'Create as many passwords as you need - without limits',
                browserExtension: 'Browser Extension (Q4 2025)',
                browserExtensionDesc:
                    'Security directly in your browser - automatically and everywhere',
                apiIntegration: 'API Integration (Q4 2025)',
                apiIntegrationDesc:
                    'Integrate security seamlessly into your own applications'
            }
        },

        // Help section
        help: {
            title: '💡 Need Help?',
            spamFolder: "• Check your spam folder if you don't see the email",
            magicLinkExpiry: '• Magic links expire after 15 minutes',
            requestNewLink: '• You can request a new link anytime',
            noPassword: '• No password required - just click the link'
        },

        // Footer
        footer: {
            magicLink: 'Magic link',
            instantSetup: 'Instant Setup',
            noSpam: 'No Spam',
            text: 'Magic links are sent via email and valid for 15 minutes.',
            privacy: 'Privacy',
            legal: 'Legal',
            versionHistory: 'Version History'
        },

        // Limits and messages
        canStillGenerate: 'You can still generate emojis!',
        limitReached:
            'Daily limit reached. Upgrade to PRO for unlimited generations.',

        // Validation
        validation: {
            emailInvalid: 'Please enter a valid email address',
            nameInvalid: 'Please enter your name (minimum 2 characters)'
        },

        // Messages
        messages: {
            settingsReset: 'Settings reset to default',
            exportFailed: 'Failed to export settings',
            settingsExported: 'Settings exported successfully',
            settingsImported: 'Settings imported successfully',
            importFailed: 'Import failed',
            freeAccountActivated: 'Free account activated!',
            chartLoadFailed: 'Failed to load chart data',
            logoutSuccess: 'Successfully logged out',
            accountFoundSendingLink:
                'Account found! Sending magic link to existing account.',
            creatingNewAccount: 'Creating new account and sending magic link.',
            magicLinkSent:
                'Magic link sent! Check your email to complete login.',
            magicLinkSendFailed: 'Failed to send magic link. Please try again.',
            magicLinkVerified: 'Magic link verified successfully!',
            magicLinkVerificationFailed: 'Magic link verification failed',
            chartDataRefreshed: 'Chart data refreshed successfully!',
            refreshFailed: 'Failed to refresh data',
            noNewData: 'No new data available'
        },

        // Upgrade section
        upgrade: {
            upgradeToPro: 'Upgrade to Pro',
            upgradeToProForFeatures: 'Upgrade to Pro for advanced features',
            unlimitedGenerations:
                'Unlimited generations and advanced security features'
        },

        // Context menu
        contextMenu: {
            exportSettings: 'Export Settings',
            importSettings: 'Import Settings',
            resetToDefault: 'Reset to Default',
            logout: 'Logout',
            settingsMenu: 'Settings menu'
        },

        // Account age labels
        accountAge: {
            today: '✨ FREE: Since today!',
            yesterday: '🚀 FREE: Since yesterday!',
            days: '🔥 FREE: Since {days} days!',
            weeks: '⚡ FREE: Since {weeks} week{plural}!',
            months: '💪 FREE: Since {months} months!',
            years: '🏆 FREE: Since {years} years!',
            accountSince: 'Account since {days} {unit}',
            since: 'since {days} {unit}',
            day: 'day',
            days: 'days',
            accountCreated: 'Account created',
            // Sexy salesy account creation texts
            createdTodayFree: '✨ Your brand new FREE account is ready!',
            createdTodayPro:
                '💎 Welcome to the PRO club – exclusive since today!',
            createdRecentlyFree: '✨ FREE account – fresh and ready!',
            createdRecentlyPro: '💎 PRO account – exclusive and new!'
        },

        // Features
        features: {
            proFeature: 'Pro Feature'
        },

        // Pro Feature Modal
        proFeatureModal: {
            title: 'Pro Feature',
            proBenefits: 'Pro Benefits:',
            unlimitedGenerations: 'Unlimited emoji generations',
            advancedSecurity: 'Advanced security features',
            prioritySupport: 'Priority support',
            earlyAccess: 'Early access to new features',
            maybeLater: 'Maybe Later',
            upgradeToPro: 'Upgrade to Pro',
            // Pro Upgrade specific
            proUpgrade: 'Pro Upgrade',
            unlockAdvancedFeatures: 'Unlock all advanced features and settings',
            upgradeProNow: '💎 Upgrade Pro now'
        },

        // Account tiers
        tiers: {
            free: 'FREE',
            pro: 'PRO',
            freeAccount: 'Free Account',
            proAccount: 'Pro Account'
        },

        // Badges
        freeBadge: '✨ FREE',
        proBadge: '💎 PRO',

        // Descriptions
        freeDescription: '✨ Free Security',
        proDescription: '💎 Enterprise Security'
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
