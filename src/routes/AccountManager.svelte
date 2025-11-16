<!--
Account manager page component for user authentication and account management.
Handles magic link login, account creation, settings management, and usage statistics.
Manages session state, chart data, and user preferences.
-->
<script lang="ts">
    import { onMount } from 'svelte';
    import { navigate } from '../utils/routing';
    import { fade, fly, slide } from 'svelte/transition';
    import PageLayoutComponent from '../components/Layout/PageLayout.svelte';
    import { 
        isLoggedIn, 
        dailyLimit, 
        currentAccount, 
        userProfile, 
        accountTier
    } from '../stores/appStores';
    import { remainingGenerations as remainingGenerationsStore } from '../stores/dailyUsageStore';
    import { translations, currentLanguage } from '../stores/contentStore';
    import { get } from 'svelte/store';
    import { 
        isLoggingIn, 
        loginError, 
        initializeAccountFromCookies, 
        logout,
        hasExistingUserPreferences,
        hasValidUserSession,
        getUserEmailFromPreferences,
        checkAccountExists,
        secureLoginWithMagicLink,
        secureVerifyMagicLink,
        logAccountingEvent
    } from '../stores/accountStore';
    import { showSuccess, showError, showInfo } from '../stores/modalStore';
    import { 
        currentSettings,
        resetSettings, 
        exportSettings, 
        importSettings,
        hasUnsavedChanges,
        saveAllSettings,
        settingsStatus
    } from '../stores/userSettingsStore';
    import { storageHelpers, STORAGE_KEYS } from '../config/storage';
    import UserSettingsComponent from '../components/UserSettings.svelte';
    import { isDevelopment, isDebugMode } from '../utils/environment';

    function debugAccountManager() {
        if (!isDebugMode()) return;
        console.group('🔍 AccountManager Debug');
        console.log('State:', {
            isLoggedIn: get(isLoggedIn),
            accountTier: get(accountTier),
            accountExists,
            hasValidSession,
            sessionExpired,
            accountCreationStep,
            shouldShowSimplifiedView
        });
        console.log('Account:', {
            email: get(currentAccount)?.email,
            tier: get(accountTier),
            dailyLimit: get(dailyLimit)
        });
        console.log('Chart:', {
            selectedTimePeriod,
            chartUsageHistoryLength: chartUsageHistory.length,
            isLoadingChartData,
            chartDataError
        });
        console.groupEnd();
    }
    import AccountHeaderComponent from '../components/Features/AccountHeader.svelte';
    import DailyLimitChartComponent from '../components/Features/DailyLimitChart.svelte';
    import AccountStatisticsComponent from '../components/Features/AccountStatistics.svelte';
    import AccountBenefitsComponent from '../components/Features/AccountBenefits.svelte';
    import AccountCreationFormComponent from '../components/Features/AccountCreationForm.svelte';
    import VerificationStepComponent from '../components/Features/VerificationStep.svelte';
    import ReturnUserViewComponent from '../components/Features/ReturnUserView.svelte';
    import { validateUserLimits } from '../config/limits';
    import { sendAnalyticsEvent } from '../stores/appStores';
    import ButtonComponent from '../components/UI/Button.svelte';
    import { getDaysSinceAccountCreation, formatAccountAge } from '../utils/accountHelpers';
    import { generateBenefitsStructuredData, injectStructuredData, formatCanonicalUrl } from '../utils/seo';

    const PageLayout = PageLayoutComponent;
    const UserSettings = UserSettingsComponent;
    const AccountHeader = AccountHeaderComponent;
    const DailyLimitChart = DailyLimitChartComponent;
    const AccountStatistics = AccountStatisticsComponent;
    const AccountBenefits = AccountBenefitsComponent;
    const AccountCreationForm = AccountCreationFormComponent;
    const VerificationStep = VerificationStepComponent;
    const ReturnUserView = ReturnUserViewComponent;
    const Button = ButtonComponent;

    let pageTitle = $derived.by(() => {
        const t = get(translations);
        if (isVerifyingMagicLink) {
            return t?.accountManager?.verifyingTitle || '🔗 Verifiziere Magic Link...';
        }
        if (magicLinkStatus === 'error') {
            return t?.accountManager?.verificationErrorTitle || '❌ Verifikation Fehlgeschlagen';
        }
        const isLoggedInValue = get(isLoggedIn);
        if (isLoggedInValue) {
            const currentSettingsValue = get(currentSettings);
            const userProfileValue = get(userProfile);
            const currentAccountValue = get(currentAccount);
            const userName = 
                currentSettingsValue?.name ||
                userProfileValue?.name ||
                currentAccountValue?.name ||
                currentAccountValue?.profile?.name ||
                (currentAccountValue?.email ? currentAccountValue.email.split('@')[0] : null) ||
                'there';
            
            return (t?.accountManager?.welcomeBack || 'Welcome back, {name}! 👋').replace('{name}', userName);
        }
        if (accountCreationStep === 'verification') {
            return t?.accountManager?.verificationTitle || '📧 Check Your Email and Verify';
        }
        if (shouldShowSimplifiedView) {
            return t?.accountManager?.returnUserTitle || '👋 Willkommen zurück!';
        }
        return t?.accountManager?.pageTitle || 'Account Manager';
    });

    let pageDescription = $derived.by(() => {
        const t = get(translations);
        const isLoggedInValue = get(isLoggedIn);
        if (isVerifyingMagicLink) {
            return t?.accountManager?.verifyingDescription || 'Bitte warte, während wir deinen Account verifizieren.';
        }
        if (magicLinkStatus === 'error') {
            return magicLinkError || (t?.accountManager?.verificationErrorDescription || 'Ein Fehler ist aufgetreten.');
        }
        if (isLoggedInValue) {
            return t?.accountManager?.welcomeDescription || 'Ready to create some amazing emoji passwords? Your account is secure and ready to go!';
        }
        if (accountCreationStep === 'verification') {
            const currentAccountValue = get(currentAccount);
            const emailValue = currentAccountValue?.email || 'your email';
            return (t?.accountManager?.verificationDescription || 'Check your email {email} and click the magic link to complete setup').replace('{email}', emailValue);
        }
        if (shouldShowSimplifiedView) {
            return t?.accountManager?.returnUserDescription || 'Wir haben deine E-Mail-Adresse erkannt. Logge dich schnell wieder ein.';
        }
        return t?.accountManager?.pageDescription || 'Manage your security settings and account preferences';
    });

    let showBenefitsToggle = $state<'free' | 'pro'>('free');
    let email = $state('');
    let name = $state('');
    let showProfileForm = $state(false);
    let isSubmitting = $state(false);
    let accountCreationStep = $state<'benefits' | 'form' | 'verification' | null>(null);
    let selectedAccountType = $state<'free' | 'pro'>('free');
    let accountExists = $state(false);
    let checkingAccount = $state(false);
    let sessionExpired = $state(false);
    let hasValidSession = $state(false);
    let daysSinceCreation = $derived(getDaysSinceAccountCreation(currentAccount));
    
    $effect(() => {
        const t = get(translations);
        const isLoggedInValue = isLoggedIn;
        if (t?.accountManager?.benefits && !isLoggedInValue && accountCreationStep === 'benefits') {
        try {
            const canonicalUrl = formatCanonicalUrl(window.location.pathname);
            const benefitsStructuredData = generateBenefitsStructuredData(
                t.accountManager.benefits,
                get(currentLanguage),
                canonicalUrl
            );
            injectStructuredData(benefitsStructuredData);
        } catch (error) {}
        }
    });
    
    let hasLoggedInBefore = $state(false);
    let showExpandedView = $state(false);
    let hasNavigatedAway = $state(sessionStorage.getItem('hasNavigatedAway') === 'true');
    
    let shouldShowSimplifiedView = $derived.by(() => {
        const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
        const loggedIn = isLoggedIn;
        if (showExpandedView) {
            return false;
        }
        
        const shouldShow = !!(history && history.email && !loggedIn && !hasNavigatedAway);
        return shouldShow;
    });
    
    let currentUserLimits = $derived.by(() => {
        const isLoggedInValue = get(isLoggedIn);
        const accountTierValue = get(accountTier);
        const dailyLimitValue = get(dailyLimit);
        return validateUserLimits(isLoggedInValue, accountTierValue, dailyLimitValue?.used || 0);
    });
    let remainingGenerations = $derived(get(remainingGenerationsStore));
    let dailyLimitDisplay = $derived.by(() => {
        const t = get(translations);
        return (t?.accountManager?.remainingDisplay || '{remaining} / {limit}')
            .replace('{remaining}', remainingGenerations)
            .replace('{limit}', currentUserLimits.limit);
    });
    
    let selectedTimePeriod = $state<'7d' | '14d' | '4w' | '3m'>('7d');
    let isDemoDataShown = $state(false);
    
    import { 
        usageHistory as usageHistoryStore, 
        refreshUsageHistory 
    } from '../stores/userDataStore';
    
    let chartUsageHistory = $derived.by(() => {
        const store = get(usageHistoryStore);
        return store?.data || [];
    });
    let isLoadingChartData = $derived.by(() => {
        const store = get(usageHistoryStore);
        return store?.isLoading || false;
    });
    let chartDataError = $derived.by(() => {
        const store = get(usageHistoryStore);
        return store?.errorMessage || null;
    });
    let usageStats = $derived.by(() => {
        const store = get(usageHistoryStore);
        return store?.stats || null;
    });
    
    let totalStoriesGenerated = $derived.by(() => {
        if (usageStats && typeof usageStats.total === 'number' && usageStats.total > 0) {
            return usageStats.total;
        }
        if (chartUsageHistory && Array.isArray(chartUsageHistory) && chartUsageHistory.length > 0) {
            const sum = chartUsageHistory.reduce((total, entry) => {
                return total + (entry.used || 0);
            }, 0);
            if (sum > 0) {
                return sum;
            }
        }
        if ($dailyLimit && typeof $dailyLimit.used === 'number') {
            return $dailyLimit.used;
        }
        return 0;
    });
    
    function watchAccountChanges() {
        currentAccount.subscribe(async (account) => {
            const isLoggedInValue = get(isLoggedIn);
            if (!account || !isLoggedInValue) {
                return;
            }
            await refreshUsageHistory();
        });
    }
    
    onMount(async () => {
        debugAccountManager();
        watchAccountChanges();
        const isLoggedInValue = get(isLoggedIn);
        if (isLoggedInValue) {
            await refreshUsageHistory();
        }
    
    let finalUsageHistory = $derived.by(() => {
        if (chartUsageHistory.length > 0) {
            isDemoDataShown = false;
            return chartUsageHistory;
        }
        const isLoggedInValue = get(isLoggedIn);
        if (isLoggedInValue && chartUsageHistory.length === 0 && !isLoadingChartData) {
            isDemoDataShown = false;
            return [];
        }
        if (isLoggedInValue && isLoadingChartData) {
            isDemoDataShown = false;
            return [];
        }
        isDemoDataShown = false;
        return [];
    });
    
    let finalChartData = $derived(generateChartData(selectedTimePeriod, finalUsageHistory));
    
    let finalStoryChartData = $derived.by(() => {
        if (!finalChartData || finalChartData.length === 0) return [];
        return finalChartData.map(point => ({
            date: point.date,
            value: point.storyValue || 0
        }));
    });
    
    function calculateMaxValue(chartData: Array<{ value?: number; storyValue?: number }>) {
        if (!chartData || chartData.length === 0) {
            const accountTierValue = get(accountTier);
            return accountTierValue === 'pro' ? 35 : 9;
        }
        const maxDataValue = Math.max(
            ...chartData.map(point => Math.max(point.value || 0, point.storyValue || 0))
        );
        if (maxDataValue === 0) {
            const accountTierValue = get(accountTier);
            return accountTierValue === 'pro' ? 35 : 9;
        }
        const niceNumbers = [9, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100];
        const optimalMax = niceNumbers.find(num => num >= maxDataValue) || 100;
        return Math.min(optimalMax, 100);
    }
    
    let chartMaxValue = $derived(calculateMaxValue(finalChartData));
    
    
    async function handleRefreshChartData() {
        try {
            await refreshUsageHistory(true);
            const t = get(translations);
            if (chartUsageHistory.length > 0) {
                showSuccess(t?.accountManager?.messages?.chartDataRefreshed || 'Chart data refreshed!', 2000);
            } else {
                showInfo(t?.accountManager?.messages?.noNewData || 'No new data available', 2000);
            }
        } catch (error) {
            const t = get(translations);
            showError(t?.accountManager?.messages?.refreshFailed || 'Failed to refresh data', 2000);
        }
    }
    
    async function retryLoadChartData() {
        await refreshUsageHistory(true);
    }
    
    function generateChartData(period: string, history: Array<{ date: string; used?: number; storyUsed?: number }>) {
        const today = new Date();
        const data = [];
        let days = 7;
        if (period === '14d') days = 14;
        if (period === '4w') days = 28;
        if (period === '3m') days = 90;
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const historyEntry = history.find(h => h.date === dateStr);
            const value = historyEntry?.used || 0;
            const storyValue = historyEntry?.storyUsed || 0;
            data.push({
                date: dateStr,
                value: value,
                storyValue: storyValue
            });
        }
        return data;
    }

    let isVerifyingMagicLink = $state(false);
    let magicLinkStatus = $state<'verifying' | 'success' | 'error' | null>(null);
    let magicLinkError = $state('');
    let showContextMenu = $state(false);
    let fileInput: HTMLInputElement | null = $state(null);
    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let isEmailValid = $derived(validateEmail(email));
    let isNameValid = $derived(name.trim().length >= 2);
    let isFormValid = $derived(isEmailValid && (showProfileForm ? isNameValid : true));
    let isEmailValidForMagicLink = $derived(isEmailValid);
    
    let magicLinkButtonText = $derived.by(() => {
        const t = get(translations);
        if (hasValidSession) {
            return t?.accountManager?.buttons?.loginToAccount || 'Login to Account';
        }
        return t?.accountManager?.buttons?.createMagicLink || '🔗 Create Magic Link';
    });

    function getValidName() {
        const trimmedName = name.trim();
        if (trimmedName.length >= 2) {
            return trimmedName;
        }
        return email.split('@')[0] || 'User';
    }

    function anonymizeEmail(email: string): string {
		const [local, domain] = email.split('@');
		if (!local || !domain) return email;

		const stars = '*'.repeat(Math.floor(Math.random() * 4) + 2); // 2–5 Sterne
		return `${local[0]}${stars}@${domain}`;
	}

    function validateEmail(email: string): boolean {
        return EMAIL_REGEX.test(email);
    }


    function navigateToHome() {
        hasNavigatedAway = true;
        sessionStorage.setItem('hasNavigatedAway', 'true');
        navigate('/', { replace: true });
    }
    
    function checkUserLoginHistory() {
        const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
        const loggedIn = isLoggedIn;
        if (history && history.email && !loggedIn) {
            hasLoggedInBefore = true;
            email = history.email;
        } else {
            hasLoggedInBefore = false;
        }
    }
    
    function markSuccessfulLogin(email: string) {
        if (!email) return;
        const existingHistory = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY, { count: 0 });
        const history = {
            email,
            lastLogin: new Date().toISOString(),
            count: existingHistory.count + 1
        };
        storageHelpers.set(STORAGE_KEYS.LOGIN_HISTORY, history);
    }
    
    // Intelligent button text based on user state (Svelte 5 Runes)
    let intelligentButtonText = $derived.by(() => {
        const t = get(translations);
        const isLoggingInValue = get(isLoggingIn);
        if (isSubmitting || isLoggingInValue) {
            return t?.accountManager?.buttons?.sendingMagicLink || 'Sending...';
        }
        if (hasLoggedInBefore) {
            return t?.accountManager?.buttons?.loginAgain || '🔐 Login again';
        }
        return t?.accountManager?.buttons?.createMagicLink || '🔗 Create Magic Link';
    });
    
    let accountAgeLabel = $derived.by(() => {
        const isLoggedInValue = get(isLoggedIn);
        const t = get(translations);
        return isLoggedInValue 
            ? formatAccountAge(
                daysSinceCreation, 
                t?.accountManager?.accountAge
            )
            : '';
    });
    
    let tierBadgeText = $derived(getTierBadgeText(get(accountTier)));
    


    function selectAccountType(type: 'free' | 'pro') {
        selectedAccountType = type;
        showBenefitsToggle = type;
    }

    function startAccountCreation() {
        if (accountCreationStep === 'benefits') {
            accountCreationStep = 'form';
        } else {
            accountCreationStep = 'benefits';
        }
    }
    
    function startAccountCreationForReturnUser() {
        showExpandedView = true;
    }

    function goBackToBenefits() {
        accountCreationStep = 'benefits';
    }

    function toggleContextMenu(event) {
        event.stopPropagation();
        showContextMenu = !showContextMenu;
        if (showContextMenu) {
            contextMenuPosition = { x: event.clientX, y: event.clientY };
        }
    }


    function closeContextMenu() {
        showContextMenu = false;
    }

    function handleClickOutside(event) {
        if (showContextMenu && !event.target.closest('.context-menu')) {
            closeContextMenu();
        }
    }

    function handleResetSettings() {
        resetSettings();
        const t = get(translations);
        showSuccess(t?.accountManager?.messages?.settingsReset || 'Settings reset to default', 3000);
        closeContextMenu();
    }

    function handleExportSettings() {
        try {
            exportSettings();
            const t = get(translations);
            showSuccess(t?.accountManager?.messages?.settingsExported || 'Settings exported successfully', 3000);
        } catch (error) {
            const t = get(translations);
            showError(t?.accountManager?.messages?.exportFailed || 'Failed to export settings', 3000);
        }
        closeContextMenu();
    }

    function handleImportSettings(event: Event) {
        const file = event.target.files[0];
        if (file) {
            const t = get(translations);
            importSettings(file)
                .then(() => {
                    showSuccess(t?.accountManager?.messages?.settingsImported || 'Settings imported successfully', 3000);
                })
                .catch((error) => {
                    showError(`${t?.accountManager?.messages?.importFailed || 'Import failed'}: ${error.message}`, 3000);
                });
        }
        closeContextMenu();
    }

    function triggerFileInput() {
        fileInput.click();
    }

    function handleLogout() {
        logout();
        sessionExpired = false;
        hasValidSession = false;
        accountExists = false;
        hasLoggedInBefore = false;
        const t = get(translations);
        showSuccess(t?.accountManager?.messages?.logoutSuccess || 'Successfully logged out', 3000);
        closeContextMenu();
        setTimeout(() => {
            navigateToHome();
        }, 1000);
    }

    async function handleLogin(event: Event) {
        event.preventDefault();
        isSubmitting = true;
        checkingAccount = true;

        try {
            const accountCheck = await checkAccountExists(email, name);
            const t = get(translations);
            if (accountCheck.exists) {
                showInfo(t?.accountManager?.messages?.accountFoundSendingLink || 'Account found! Sending magic link to existing account.', 3000);
            } else {
                showInfo(t?.accountManager?.messages?.creatingNewAccount || 'Creating new account and sending magic link.', 3000);
            }
            const isDevMode = isDevelopment();
            const loginResult = await secureLoginWithMagicLink(email, name, isDevMode);
            logAccountingEvent('LOGIN_ATTEMPT_SUCCESS', {
                email,
                accountType: selectedAccountType,
                dev: isDevMode,
                accountExists: accountCheck.exists
            });
            sendAnalyticsEvent('account_login_attempt', {
                email: email,
                accountType: selectedAccountType,
                accountExists: accountCheck.exists,
                dev: isDevMode
            });
            const t = get(translations);
            showSuccess(t?.accountManager?.messages?.magicLinkSent || 'Magic link sent! Check your email to complete login.', 5000);
            accountCreationStep = 'verification';
        } catch (error) {
            const t = get(translations);
            showError(t?.accountManager?.messages?.magicLinkSendFailed || 'Failed to send magic link. Please try again.', 5000);
        } finally {
            isSubmitting = false;
            checkingAccount = false;
        }
    }

    function resendMagicLink() {
        handleLogin(new Event('submit'));
    }

    onMount(async () => {
        try {
            const accountRestored = await initializeAccountFromCookies();
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token') || urlParams.get('t');
            const magicLinkEmail = urlParams.get('email') || urlParams.get('e');
            const isDevMode = urlParams.get('dev') === 'true';
            
            if (token && magicLinkEmail) {
                const currentLoggedIn = isLoggedIn;
                const currentAccountEmail = currentAccount?.email;
                const isAlreadyLoggedIn = currentLoggedIn && currentAccountEmail === magicLinkEmail;
                if (isAlreadyLoggedIn) {
                    magicLinkStatus = 'success';
                    markSuccessfulLogin(magicLinkEmail);
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                    checkSessionStatus();
                    const t = get(translations);
                    showSuccess(t?.accountManager?.messages?.magicLinkVerified || 'Magic link verified successfully!', 2000);
                    return;
                }
                
                const currentPath = window.location.pathname;
                const pathSegments = currentPath.split('/').filter(segment => segment !== '');
                const hasLanguagePrefix = pathSegments.length > 1 && pathSegments[0] && pathSegments[1] === 'account';
                if (currentPath === '/account') {
                    const currentLang = currentLanguage;
                    const redirectPath = `/${currentLang}/account?t=${token}&e=${magicLinkEmail}${isDevMode ? '&dev=true' : ''}`;
                    navigate(redirectPath, { replace: true });
                    return;
                }
                if (hasLanguagePrefix || currentPath === '/account') {
                    isVerifyingMagicLink = true;
                    magicLinkStatus = 'verifying';
                    try {
                        await secureVerifyMagicLink(token, magicLinkEmail);
                        magicLinkStatus = 'success';
                        const t = get(translations);
                        showSuccess(t?.accountManager?.messages?.magicLinkVerified || 'Magic link verified successfully!', 3000);
                        markSuccessfulLogin(magicLinkEmail);
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
                        checkSessionStatus();
                    } catch (error) {
                        magicLinkStatus = 'error';
                        magicLinkError = error.message || 'Verification failed';
                        const errorMessage = error.message || '';
                        if (errorMessage.includes('already') || errorMessage.includes('exists') || errorMessage.includes('logged in')) {
                            magicLinkStatus = 'success';
                            magicLinkError = '';
                            checkSessionStatus();
                            const t = get(translations);
                            showSuccess(t?.accountManager?.messages?.magicLinkVerified || 'Magic link verified successfully!', 2000);
                        } else {
                            const t = get(translations);
                            showError(t?.accountManager?.messages?.magicLinkVerificationFailed || 'Magic link verification failed', 5000);
                        }
                    } finally {
                        isVerifyingMagicLink = false;
                    }
                }
            }
            
            checkSessionStatus();
            checkUserLoginHistory();
            const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
            if (history && history.email && !isLoggedIn) {
                email = history.email;
            }
            shouldShowSimplifiedView = !!(history && history.email && !get(isLoggedIn) && !hasNavigatedAway);
            if (shouldShowSimplifiedView) {
                accountCreationStep = null;
            } else {
                accountCreationStep = 'benefits';
            }
            const currentAccountValue = get(currentAccount);
            if (currentAccountValue?.email) {
                email = currentAccountValue.email;
                name = currentAccountValue.name || '';
            }
            document.addEventListener('click', handleClickOutside);
            
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        } catch (error) {}
    });

    $effect(() => {
        const error = get(loginError);
        if (error) {
            showError(error, 5000);
        }
    });

    function checkSessionStatus() {
        const account = currentAccount;
        const loggedIn = isLoggedIn;
        const hasExistingPrefs = hasExistingUserPreferences();
        const localStorageValidSession = hasValidUserSession();
        const userEmailFromPrefs = getUserEmailFromPreferences();
        
        if (hasExistingPrefs && localStorageValidSession && userEmailFromPrefs) {
            hasValidSession = true;
            sessionExpired = false;
            if (!email && userEmailFromPrefs) {
                email = userEmailFromPrefs;
            }
        } else if (hasExistingPrefs && !localStorageValidSession) {
            sessionExpired = true;
            hasValidSession = false;
            if (!email && userEmailFromPrefs) {
                email = userEmailFromPrefs;
            }
        } else {
            // No existing preferences
            hasValidSession = false;
            sessionExpired = false;
        }
        
        // Fallback to cookie-based session if no localStorage data
        if (account && loggedIn && !hasExistingPrefs) {
            hasValidSession = true;
            // Check if session is expired (7 days)
            const lastLogin = new Date(account.lastLogin || 0);
            const now = new Date();
            const daysSinceLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);
            
            if (daysSinceLogin > 7) {
                sessionExpired = true;
                hasValidSession = false;
            }
        }
    }

    // Get dynamic button text based on state
    // Login button text (Svelte 5 Runes)
    let loginButtonText = $derived.by(() => {
        const t = get(translations);
        if (isSubmitting) {
            return t?.accountManager?.buttons?.sendingMagicLink || 'Sending...';
        }
        if (checkingAccount) {
            return t?.accountManager?.buttons?.checkAccountExists || 'Checking...';
        }
        if (accountExists) {
            return t?.accountManager?.buttons?.accountExists || 'Account found...';
        }
        if (sessionExpired) {
            return t?.accountManager?.buttons?.sessionExpired || 'Session expired';
        }
        if (hasValidSession) {
            return t?.accountManager?.buttons?.loginToAccount || 'Login to Account';
        }
        return t?.accountManager?.buttons?.createMagicLink || '🔗 Create Magic Link';
    });

    function handleExport() {}
    function handleImport() {}
    function handleReset() {}

    let seoTitle = $derived.by(() => {
        const t = get(translations);
        return t?.accountManager?.pageTitle || 'Account Manager';
    });
    let seoDescription = $derived.by(() => {
        const t = get(translations);
        return t?.accountManager?.pageDescription || 'Manage your security settings and account preferences';
    });

</script>

<svelte:head>
    <title>{seoTitle} - Keymoji</title>
    <meta name="description" content={seoDescription} />
</svelte:head>

<PageLayout {pageTitle} {pageDescription} routeSlug="account">

    <!-- Main Content Container -->
    <div in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center z-10 gap-4 w-full">
            <!-- Account Content -->
            <div class="w-full">
                <!-- Account Status -->
                {#if $isLoggedIn}
                    <div>
                        <AccountHeader
                            {accountAgeLabel}
                            onExportSettings={handleExportSettings}
                            onImportSettings={triggerFileInput}
                            onResetSettings={handleResetSettings}
                            onLogout={handleLogout}
                            onTriggerFileInput={triggerFileInput}
                        />

                        <!-- Daily Limit Status with Chart -->
                        <DailyLimitChart
                            selectedTimePeriod={selectedTimePeriod}
                            finalChartData={finalChartData}
                            finalStoryChartData={finalStoryChartData}
                            finalUsageHistory={finalUsageHistory}
                            chartMaxValue={chartMaxValue}
                            isLoadingChartData={isLoadingChartData}
                            chartDataError={chartDataError}
                            isDemoDataShown={isDemoDataShown}
                            currentUserLimits={currentUserLimits}
                            remainingGenerations={remainingGenerations}
                            dailyLimitDisplay={dailyLimitDisplay}
                            onPeriodChange={(period) => selectedTimePeriod = period}
                            onRefresh={handleRefreshChartData}
                            onRetry={retryLoadChartData}
                        />

                        <!-- Account Statistics -->
                        <AccountStatistics
                            totalStoriesGenerated={totalStoriesGenerated}
                            remainingGenerations={remainingGenerations}
                        />

                        <!-- Settings Section -->
                        <div transition:slide={{ duration: 300 }}>
                            <UserSettings />
                        </div>                      

                        <!-- Action Buttons -->
                        <div class="text-center mt-6 space-y-3">
                            <!-- Primary Action: Save Settings -->
                            <Button
                                variant="primary"
                                size="md"
                                fullWidth={true}
                                disabled={!hasUnsavedChangesValue || settingsStatusValue.isSaving}
                                onclick={async () => {
                                    try {
                                        await saveAllSettings();
                                        const t = get(translations);
                                        showSuccess(t?.accountManager?.actions?.settingsSaved || 'Settings saved successfully!', 3000);
                                    } catch (error) {
                                        const t = get(translations);
                                        showError(t?.accountManager?.actions?.settingsSaveFailed || 'Failed to save settings', 3000);
                                    }
                                }}
                                ariaLabel={$translations?.accountManager?.actions?.saveSettings || 'Save settings'}
                                tooltip={hasUnsavedChangesValue ? ($translations?.accountManager?.actions?.unsavedChanges || 'You have unsaved changes') : ($translations?.accountManager?.actions?.noChanges || 'No changes to save')}
                            >
                                {#if get(settingsStatus).isSaving}
                                    <span class="flex items-center justify-center">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {get(translations)?.accountManager?.actions?.saving || 'Saving...'}
                                    </span>
                                {:else}
                                {get(translations)?.accountManager?.actions?.saveSettings || '💾 Save Settings'}
                                {/if}
                            </Button>
                            
                            <!-- Secondary Action: Back to Home -->
                            {#if remainingGenerations > 0}
                            <Button
                                variant="secondary"
                                size="md"
                                fullWidth={true}
                                onclick={navigateToHome}
                            >
                                {get(translations)?.accountManager?.actions?.backToHome || '🏠 Back to Home'}
                            </Button>
                            {/if}
                        </div>
                    </div>
                {:else if accountCreationStep === 'verification'}
                    <!-- Verification Step -->
                    <VerificationStep
                        {isSubmitting}
                        onResendMagicLink={resendMagicLink}
                        onGoBack={goBackToBenefits}
                    />

                {:else if shouldShowSimplifiedView}
                    <!-- Return User Simplified Form -->
                    <ReturnUserView
                        {email}
                        {isSubmitting}
                        {isEmailValid}
                        {intelligentButtonText}
                        {anonymizeEmail}
                        onSubmit={handleLogin}
                        onShowExpandedView={startAccountCreationForReturnUser}
                    />

                {:else if showExpandedView}
                    <!-- Expanded View for Return Users -->
                    <div in:fly={{y: 20, duration: 400}} out:fly={{y: -20, duration: 400}}>
                        <!-- Account Creation Flow -->
                        <AccountBenefits
                            selectedTier={selectedAccountType}
                            onTierChange={(tier: 'free' | 'pro') => selectAccountType(tier)}
                            {accountAgeLabel}
                        />

                        <!-- Action Buttons for Expanded View -->
                        <div class="space-y-4">
                            <!-- Back to simplified view button - Only show if no login history -->
                            {#if !storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY)?.email}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    fullWidth={true}
                                    onclick={() => showExpandedView = false}
                                >
                                    {$translations?.accountManager?.buttons?.compactView || 'Compact view'}
                                </Button>
                            {/if}
                        </div>
                        
                        <!-- Login Form for Return Users -->
                        <AccountCreationForm
                            bind:email
                            bind:name
                            {showProfileForm}
                            {isSubmitting}
                            {isEmailValid}
                            {isNameValid}
                            {isFormValid}
                            {loginButtonText}
                            {magicLinkButtonText}
                            {intelligentButtonText}
                            onToggleProfileForm={() => showProfileForm = !showProfileForm}
                            onSubmit={handleLogin}
                            onShowExpandedView={() => showExpandedView = false}
                            showExpandedViewToggle={!storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY)?.email}
                        />
                    </div>
                {:else}
                    <!-- Account Creation Flow - Styled like EmojiDisplay -->
                    <AccountBenefits
                        selectedTier={selectedAccountType}
                        onTierChange={(tier) => selectAccountType(tier)}
                        {accountAgeLabel}
                    />

                    <!-- Login Form -->
                    <AccountCreationForm
                        bind:email
                        bind:name
                        {showProfileForm}
                        {isSubmitting}
                        {isEmailValid}
                        {isNameValid}
                        {isFormValid}
                        {loginButtonText}
                        {magicLinkButtonText}
                        {intelligentButtonText}
                        onToggleProfileForm={() => showProfileForm = !showProfileForm}
                        onSubmit={handleLogin}
                    />
                {/if}
            </div>
        </section>
    </div>

    <!-- Hidden file input for settings import -->
    <input
        bind:this={fileInput}
        type="file"
        accept=".json"
        onchange={handleImportSettings}
        class="hidden"
    />
</PageLayout>
