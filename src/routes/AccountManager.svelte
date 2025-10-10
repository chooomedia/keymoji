<!-- src/routes/AccountManager.svelte -->
<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fade, fly, slide } from 'svelte/transition';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import { 
        isLoggedIn, 
        dailyLimit, 
        accountSettings, 
        isGuestUser, 
        isProUser, 
        currentAccount, 
        userProfile, 
        accountTier,
        successfulStoryRequests,
        isDisabled
    } from '../stores/appStores.js';
    import { translations, currentLanguage } from '../stores/contentStore.js';
    import { 
        loginWithMagicLink, 
        isLoggingIn, 
        loginError, 
        createAccount, 
        initializeAccountFromCookies, 
        logout,
        hasExistingUserPreferences,
        hasValidUserSession,
        getUserEmailFromPreferences,
        verifyMagicLinkFrontend,
        checkAccountExists,
        // Sichere Accounting-Funktionen
        secureCreateAccount,
        secureUpdateAccount,
        secureGetAccount,
        secureLoginWithMagicLink,
        secureVerifyMagicLink,
        logAccountingEvent
    } from '../stores/accountStore.js';
    import { showSuccess, showError, showWarning, showInfo } from '../stores/modalStore.js';
    import { 
        currentSettings, 
        resetSettings, 
        exportSettings, 
        importSettings,
        hasUnsavedChanges,
        saveAllSettings,
        settingsStatus
    } from '../stores/userSettingsStore.js';
    import { WEBHOOKS } from '../config/api.js';
    import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';
    import UserSettings from '../components/UserSettings.svelte';
    import { get } from 'svelte/store';
    import ContextMenu from '../components/UI/ContextMenu.svelte';
    import { isDevelopment } from '../utils/environment.js';
    import { validateUserLimits } from '../config/limits.js';
    import { sendAnalyticsEvent } from '../stores/appStores.js';
    import Input from '../components/UI/Input.svelte';
    import Button from '../components/UI/Button.svelte';
    import ContextBadge from '../components/UI/ContextBadge.svelte';
    import LineChart from '../components/UI/LineChart.svelte';
    import FooterInfo from '../widgets/FooterInfo.svelte';
    import FeatureCard from '../components/Features/FeatureCard.svelte';
    import { getDaysSinceAccountCreation, formatAccountAge, getTierBadgeText } from '../utils/accountHelpers.js';
    import { getUsageHistory, calculateUsageStats } from '../utils/usageHistoryHelpers.js';

    // Reaktive PageLayout Props - dynamisch basierend auf Account-Status
    $: pageTitle = (() => {
        if (isVerifyingMagicLink) {
            return $translations?.accountManager?.verifyingTitle || '🔗 Verifiziere Magic Link...';
        }
        if (magicLinkStatus === 'error') {
            return $translations?.accountManager?.verificationErrorTitle || '❌ Verifikation Fehlgeschlagen';
        }
        if ($isLoggedIn) {
            return ($translations?.accountManager?.welcomeBack || 'Welcome back, {name}! 👋').replace('{name}', $userProfile?.name || $currentAccount?.name || 'User');
        }
        if (accountCreationStep === 'verification') {
            return $translations?.accountManager?.verificationTitle || '📧 Check Your Email and Verify';
        }
        if (shouldShowSimplifiedView) {
            return $translations?.accountManager?.returnUserTitle || '👋 Willkommen zurück!';
        }
        return $translations?.accountManager?.pageTitle || 'Account Manager';
    })();

    $: pageDescription = (() => {
        if (isVerifyingMagicLink) {
            return $translations?.accountManager?.verifyingDescription || 'Bitte warte, während wir deinen Account verifizieren.';
        }
        if (magicLinkStatus === 'error') {
            return magicLinkError || ($translations?.accountManager?.verificationErrorDescription || 'Ein Fehler ist aufgetreten.');
        }
        if ($isLoggedIn) {
            return $translations?.accountManager?.welcomeDescription || 'Ready to create some amazing emoji passwords? Your account is secure and ready to go!';
        }
        if (accountCreationStep === 'verification') {
            return ($translations?.accountManager?.verificationDescription || 'Check your email {email} and click the magic link to complete setup').replace('{email}', email);
        }
        if (shouldShowSimplifiedView) {
            return $translations?.accountManager?.returnUserDescription || 'Wir haben deine E-Mail-Adresse erkannt. Logge dich schnell wieder ein.';
        }
        return $translations?.accountManager?.pageDescription || 'Manage your security settings and account preferences';
    })();

    // Toggle state
    let showBenefitsToggle = 'free';
    let email = '';
    let name = '';
    let showProfileForm = false;
    let isSubmitting = false;
    let showSettings = false;
    let showUserSettings = false;
    let accountCreationStep = null; // 'benefits', 'form', 'verification' - null for initial state
    let selectedAccountType = 'free'; // 'free', 'pro'
    let showAdvancedOptions = false;

    // Session management
    let accountExists = false;
    let checkingAccount = false;
    let sessionExpired = false;
    let hasValidSession = false;
    
    // Reactive calculation for days since account creation
    // Übergebe $currentAccount damit API-Daten (Google Sheets) bevorzugt werden!
    $: daysSinceCreation = getDaysSinceAccountCreation($currentAccount);
    
    // Debug: Log when daysSinceCreation changes
    $: if (daysSinceCreation !== undefined) {
        console.log('🔄 daysSinceCreation updated:', daysSinceCreation, 'from account:', $currentAccount?.createdAt);
    }
    
    // Return user view state
    let hasLoggedInBefore = false;
    
    // State for expanded view
    let showExpandedView = false;
    
    // Initialize shouldShowSimplifiedView with initial value
    let shouldShowSimplifiedView = false;
    
    // Check if user has navigated away from initial load (stored in sessionStorage)
    let hasNavigatedAway = sessionStorage.getItem('hasNavigatedAway') === 'true';
    
    // Reactive simplified view logic
    $: shouldShowSimplifiedView = (() => {
        // Check if user is not logged in but has login history
        const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
        const loggedIn = get(isLoggedIn);
        
        // If expanded view is active, don't show simplified view
        if (showExpandedView) {
            return false;
        }
        
        // Show simplified view only if user hasn't navigated away
        const shouldShow = !!(history && history.email && !loggedIn && !hasNavigatedAway);
        
        console.log('🔄 shouldShowSimplifiedView reactive check:', {
            history: history,
            loggedIn: loggedIn,
            hasHistory: !!(history && history.email),
            shouldShow: shouldShow,
            showExpandedView: showExpandedView,
            historyEmail: history?.email,
            isLoggedIn: loggedIn,
            hasNavigatedAway: hasNavigatedAway
        });
        
        return shouldShow;
    })();
    
    // Reactive daily limit calculation
    $: currentUserLimits = validateUserLimits($isLoggedIn, $accountTier, $dailyLimit?.used || 0);
    $: remainingGenerations = currentUserLimits.remaining;
    $: dailyLimitDisplay = ($translations?.accountManager?.remainingDisplay || '{remaining} / {limit} remaining')
        .replace('{remaining}', remainingGenerations)
        .replace('{limit}', currentUserLimits.limit);
    
    // Usage Chart State
    let selectedTimePeriod = '7d';
    
    // Load usage history from current account (reactive)
    $: usageHistory = getUsageHistory($currentAccount);
    $: usageStats = calculateUsageStats(usageHistory);
    
    // Generate chart data based on selected period (reactive)
    $: usageChartData = generateChartData(selectedTimePeriod, usageHistory);
    
    function generateChartData(period, history) {
        const today = new Date();
        const data = [];
        
        // Determine number of days to show
        let days = 7;
        if (period === '14d') days = 14;
        if (period === '4w') days = 28;
        if (period === '1y') days = 365;
        
        // Generate data points for each day (reverse order for chart)
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Find usage for this date in history
            const historyEntry = history.find(h => h.date === dateStr);
            const value = historyEntry?.used || 0;
            
            data.push({
                date: dateStr,
                value: value
            });
        }
        
        return data;
    }

    // Magic Link verification state
    let isVerifyingMagicLink = false;
    let magicLinkStatus = null; // 'verifying', 'success', 'error'
    let magicLinkError = '';

    // Context menu state
    let showContextMenu = false;
    let contextMenuPosition = { x: 0, y: 0 };
    let fileInput;

    // Email validation
    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    $: isEmailValid = validateEmail(email);
    $: isNameValid = name.trim().length >= 2;
    $: isFormValid = isEmailValid && (showProfileForm ? isNameValid : true);
    
    // Email validation for Magic Link button - konsistent mit isEmailValid
    $: isEmailValidForMagicLink = isEmailValid;
    
    // Magic Link button text with emoji
    $: magicLinkButtonText = (() => {
        if (hasValidSession) {
            return $translations?.accountManager?.buttons?.loginToAccount || 'Login to Account';
        }
        return $translations?.accountManager?.buttons?.createMagicLink || '🔗 Create Magic Link';
    })();

    // Ensure we always have a valid name for the API
    function getValidName() {
        const trimmedName = name.trim();
        if (trimmedName.length >= 2) {
            return trimmedName;
        }
        // Fallback to email username or default
        return email.split('@')[0] || 'User';
    }

    function anonymizeEmail(email) {
		const [local, domain] = email.split('@');
		if (!local || !domain) return email;

		const stars = '*'.repeat(Math.floor(Math.random() * 4) + 2); // 2–5 Sterne
		return `${local[0]}${stars}@${domain}`;
	}

    function validateEmail(email) {
        return EMAIL_REGEX.test(email);
    }

    function getRemainingGenerations() {
        const userLimits = validateUserLimits($isLoggedIn, $accountTier, $dailyLimit?.used || 0);
        return userLimits.remaining;
    }

    function navigateToHome() {
        // Mark that user has navigated away from initial load
        hasNavigatedAway = true;
        sessionStorage.setItem('hasNavigatedAway', 'true');
        console.log('🔄 User navigated away - hasNavigatedAway set to true');
        navigate('/', { replace: true });
    }
    
    // Return user view functions
    function checkUserLoginHistory() {
        const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
        const loggedIn = get(isLoggedIn);
        console.log('🔍 Login history check:', {
            history: history,
            loggedIn: loggedIn,
            hasHistory: !!(history && history.email),
            shouldShow: !!(history && history.email && !loggedIn)
        });

        if (history && history.email && !loggedIn) {
            hasLoggedInBefore = true;
            email = history.email;
            console.log('👤 Return user erkannt:', history.email);
        } else {
            hasLoggedInBefore = false;
            console.log('👤 Kein Return user');
        }
    }
    
    function markSuccessfulLogin(email) {
        if (!email) return;
        const existingHistory = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY, { count: 0 });
        const history = {
            email,
            lastLogin: new Date().toISOString(),
            count: existingHistory.count + 1
        };
        storageHelpers.set(STORAGE_KEYS.LOGIN_HISTORY, history);
        console.log('✅ Login history gesetzt:', history);
    }
    
    // Intelligent button text based on user state
    $: intelligentButtonText = (() => {
        if (isSubmitting) {
            return $translations?.accountManager?.buttons?.sendingMagicLink || 'Sending...';
        }
        if (hasLoggedInBefore) {
            return $translations?.accountManager?.buttons?.loginAgain || '🔐 Login again';
        }
        return $translations?.accountManager?.buttons?.createMagicLink || '🔗 Create Magic Link';
    })();
    
    // Account age label for tooltip - zeigt wie lange User den Account hat (NUR Zeitangabe)
    $: accountAgeLabel = formatAccountAge(
        daysSinceCreation, 
        $translations?.accountManager?.accountAge
    );
    
    // Tier badge text - zeigt NUR den Tier-Status
    $: tierBadgeText = getTierBadgeText($accountTier);
    


    function selectAccountType(type) {
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
        // For return users, show the expanded view
        showExpandedView = true;
        // shouldShowSimplifiedView will automatically become false due to reactive logic
    }

    function goBackToBenefits() {
        accountCreationStep = 'benefits';
    }

    // Context menu functions
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

    // Close context menu when clicking outside
    function handleClickOutside(event) {
        if (showContextMenu && !event.target.closest('.context-menu')) {
            closeContextMenu();
        }
    }

    // Handle settings reset
    function handleResetSettings() {
        resetSettings();
                                showSuccess($translations?.accountManager?.messages?.settingsReset || 'Settings reset to default', 3000);
        closeContextMenu();
    }

    // Handle settings export
    function handleExportSettings() {
        try {
            exportSettings();
                                    showSuccess($translations?.accountManager?.messages?.settingsExported || 'Settings exported successfully', 3000);
        } catch (error) {
                                    showError($translations?.accountManager?.messages?.exportFailed || 'Failed to export settings', 3000);
        }
        closeContextMenu();
    }

    // Handle settings import
    function handleImportSettings(event) {
        const file = event.target.files[0];
        if (file) {
            importSettings(file)
                .then(() => {
                    showSuccess('Settings imported successfully', 3000);
                })
                .catch((error) => {
                    showError(`Import failed: ${error.message}`, 3000);
                });
        }
        closeContextMenu();
    }

    // Trigger file input
    function triggerFileInput() {
        fileInput.click();
    }

    // Handle logout
    function handleLogout() {
        logout();
        sessionExpired = false;
        hasValidSession = false;
        accountExists = false;
        // Reset return user view state
        hasLoggedInBefore = false;
        
        // Keep login history for return user functionality
        console.log('🔐 Login history preserved for return user functionality');
        
        // shouldShowSimplifiedView is now reactive, no need to set it manually
        showSuccess('Successfully logged out', 3000);
        closeContextMenu();
        
        // Route zur Startseite nach Logout
        setTimeout(() => {
            navigateToHome();
        }, 1000);
    }

    async function handleLogin(event) {
        event.preventDefault();
        isSubmitting = true;
        checkingAccount = true;

        try {
            // Check if account already exists before creating
            console.log('🔍 Checking if account already exists...');
            const accountCheck = await checkAccountExists(email, name);
            
            if (accountCheck.exists) {
                console.log('✅ Account already exists, proceeding with magic link');
                // Account exists, proceed with magic link
                showInfo('Account found! Sending magic link to existing account.', 3000);
            } else {
                console.log('🆕 No existing account found, will create new account');
                // Account doesn't exist, will be created during magic link verification
                showInfo('Creating new account and sending magic link.', 3000);
            }

            // Determine if we're in development mode
            const isDevMode = isDevelopment();
            
            console.log('🔧 Development mode detected:', isDevMode);

            console.log('🔒 Starting secure magic link login...');
            const loginResult = await secureLoginWithMagicLink(email, name, isDevMode);
            
            // Log the API response
            if (loginResult?.result?.isDevMode !== undefined) {
                console.log('🔧 Backend dev mode confirmation:', loginResult.result.isDevMode);
            }
            
            // Log accounting event
            logAccountingEvent('LOGIN_ATTEMPT_SUCCESS', {
                email,
                accountType: selectedAccountType,
                dev: isDevMode,
                accountExists: accountCheck.exists
            });
            
            // Send analytics event
            sendAnalyticsEvent('account_login_attempt', {
                email: email,
                accountType: selectedAccountType,
                accountExists: accountCheck.exists,
                dev: isDevMode
            });
            
            // Show success message
            showSuccess('Magic link sent! Check your email to complete login.', 5000);
            
            // Move to verification step
            accountCreationStep = 'verification';
        } catch (error) {
            console.error('Login error:', error);
            showError('Failed to send magic link. Please try again.', 5000);
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
            // Initialize account from cookies
            console.log('🔐 AccountManager: Initializing account from cookies...');
            const accountRestored = await initializeAccountFromCookies();
            console.log('🔐 AccountManager: Account restoration result:', accountRestored);
            
            // REMOVED: Daily limit initialization (now handled centrally by dailyUsageStore.js in LanguageRouter)
            // The dailyLimit store is now managed by initializeDailyUsage() which runs on app start
            console.log('✅ AccountManager: Using centralized daily usage tracking');
            console.log('📊 Current daily limits:', $dailyLimit);
            
            // Check for magic link verification - this works for both direct URL access and new tabs
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token') || urlParams.get('t'); // Support both long and short parameter
            const magicLinkEmail = urlParams.get('email') || urlParams.get('e'); // Support both long and short parameter
            const isDevMode = urlParams.get('dev') === 'true';
            
            // Debug: Log all URL parameters
            console.log('🔍 All URL parameters:', {
                search: window.location.search,
                href: window.location.href,
                pathname: window.location.pathname,
                hash: window.location.hash
            });
            
            // Debug: Log all search params
            for (const [key, value] of urlParams.entries()) {
                console.log(`🔍 URL param: ${key} = ${value}`);
            }
            
            console.log('🔍 URL Parameters check:', {
                search: window.location.search,
                token: token,
                email: magicLinkEmail,
                isDevMode: isDevMode,
                pathname: window.location.pathname
            });
            
            // Handle magic link with language prefix redirect
            if (token && magicLinkEmail) {
                console.log('🔗 Magic link verification detected:', { token, email: magicLinkEmail, isDevMode });
                
                // Check if we're on a language-prefixed route (e.g., /de/account)
                const currentPath = window.location.pathname;
                const pathSegments = currentPath.split('/').filter(segment => segment !== '');
                const hasLanguagePrefix = pathSegments.length > 1 && pathSegments[0] && pathSegments[1] === 'account';
                
                console.log('🔍 Route analysis:', {
                    currentPath: currentPath,
                    pathSegments: pathSegments,
                    hasLanguagePrefix: hasLanguagePrefix,
                    currentLanguage: get(currentLanguage)
                });
                
                // If we're on /account (without language prefix), redirect to /de/account (or current language)
                if (currentPath === '/account') {
                    const currentLang = get(currentLanguage);
                    const redirectPath = `/${currentLang}/account?t=${token}&e=${magicLinkEmail}${isDevMode ? '&dev=true' : ''}`;
                    console.log('🔄 Redirecting magic link to language-prefixed route:', redirectPath);
                    navigate(redirectPath, { replace: true });
                    return; // Exit early, let the redirect handle the verification
                }
                
                // If we're already on a language-prefixed route, proceed with verification
                if (hasLanguagePrefix || currentPath === '/account') {
                    console.log('✅ Proceeding with magic link verification');
                    isVerifyingMagicLink = true;
                    magicLinkStatus = 'verifying';
                    
                    try {
                        console.log('🔒 Starting secure magic link verification...');
                        await secureVerifyMagicLink(token, magicLinkEmail);
                        magicLinkStatus = 'success';
                        showSuccess('Magic Link erfolgreich verifiziert!', 3000);
                        
                        // Mark successful login for return user tracking (only on successful verification)
                        markSuccessfulLogin(magicLinkEmail);
                        
                        // Clean up URL parameters but keep the account page
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
                        console.log('🧹 URL parameters cleaned up:', newUrl);
                        
                        // Update the account view to show logged-in state
                        checkSessionStatus();
                        
                    } catch (error) {
                        console.error('❌ Magic link verification failed:', error);
                        magicLinkStatus = 'error';
                        magicLinkError = error.message || 'Verifikation fehlgeschlagen';
                        showError('Magic Link Verifikation fehlgeschlagen', 5000);
                    } finally {
                        isVerifyingMagicLink = false;
                    }
                } else {
                    console.log('❌ Invalid route for magic link verification:', currentPath);
                }
            } else {
                console.log('🔍 No magic link parameters found in URL');
            }
            
            // Check session status
            checkSessionStatus();
            
            // Initialize user login history for return user view
            checkUserLoginHistory();
            
            // Pre-fill email from login history if available
            const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
            if (history && history.email && !get(isLoggedIn)) {
                email = history.email;
                console.log('👤 Pre-filled email from login history:', history.email);
            }
            
            // Force initial reactive update
            shouldShowSimplifiedView = !!(history && history.email && !get(isLoggedIn) && !hasNavigatedAway);
            
            // Initialize accountCreationStep based on user state
            if (shouldShowSimplifiedView) {
                accountCreationStep = null; // Show simplified view
            } else {
                accountCreationStep = 'benefits'; // Show benefits view
            }
            
            // hasNavigatedAway remains false on initial load
            console.log('🔄 Initial load - hasNavigatedAway remains false');
            
            // Debug: Log initial state
            console.log('🔍 Initial AccountManager state:', {
                shouldShowSimplifiedView: shouldShowSimplifiedView,
                isLoggedIn: get(isLoggedIn),
                history: history,
                email: email,
                showExpandedView: showExpandedView,
                accountCreationStep: accountCreationStep
            });
            
            // Initialize with current account data if available
            if ($currentAccount?.email) {
                email = $currentAccount.email;
                name = $currentAccount.name || '';
            }
            
            // Add global click listener for context menu
            document.addEventListener('click', handleClickOutside);
            
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
            
        } catch (error) {
            console.error('❌ AccountManager onMount error:', error);
        }
    });

    // Reactive statement to show error as modal
    $: if ($loginError) {
        showError($loginError, 5000);
    }
    
    // Reactive statement to update daily limits when user state changes
    // REMOVED: This reactive block was overwriting dailyLimit with old localStorage data
    // dailyLimit is now ONLY managed by dailyUsageStore.js - DO NOT SET IT HERE!
    // Old code read from STORAGE_KEYS.DAILY_REQUEST_COUNT which is deprecated
    
    // For debugging, just log when user state changes
    $: if ($isLoggedIn !== undefined && $accountTier !== undefined) {
        console.log('🔄 AccountManager: User state changed:', {
            isLoggedIn: $isLoggedIn,
            accountTier: $accountTier,
            dailyLimit: $dailyLimit
        });
    }

    // Check if user has a valid session
    function checkSessionStatus() {
        const account = get(currentAccount);
        const loggedIn = get(isLoggedIn);
        
        // Check localStorage-based session first
        const hasExistingPrefs = hasExistingUserPreferences();
        const localStorageValidSession = hasValidUserSession();
        const userEmailFromPrefs = getUserEmailFromPreferences();
        
        console.log('🔍 Session status check:', {
            hasExistingPrefs,
            localStorageValidSession,
            userEmailFromPrefs,
            currentAccount: account,
            isLoggedIn: loggedIn
        });
        
        if (hasExistingPrefs && localStorageValidSession && userEmailFromPrefs) {
            hasValidSession = true;
            sessionExpired = false;
            
            // Pre-fill email if available
            if (!email && userEmailFromPrefs) {
                email = userEmailFromPrefs;
            }
        } else if (hasExistingPrefs && !localStorageValidSession) {
            // User has preferences but session expired
            sessionExpired = true;
            hasValidSession = false;
            
            // Pre-fill email if available
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
    $: loginButtonText = (() => {
        if (isSubmitting) {
            return $translations?.accountManager?.buttons?.sendingMagicLink || 'Sending...';
        }
        if (checkingAccount) {
            return $translations?.accountManager?.buttons?.checkAccountExists || 'Checking...';
        }
        if (accountExists) {
            return $translations?.accountManager?.buttons?.accountExists || 'Account found...';
        }
        if (sessionExpired) {
            return $translations?.accountManager?.buttons?.sessionExpired || 'Session expired';
        }
        if (hasValidSession) {
            return $translations?.accountManager?.buttons?.loginToAccount || 'Login to Account';
        }
        return $translations?.accountManager?.buttons?.createMagicLink || '🔗 Create Magic Link';
    })();

    // Context menu actions
    function handleExport() {
        // Export functionality
        console.log('Export clicked');
    }

    function handleImport() {
        // Import functionality
        console.log('Import clicked');
    }

    function handleReset() {
        // Reset functionality
        console.log('Reset clicked');
    }

    // Reaktive SEO Meta-Tags
    $: seoTitle = $translations?.accountManager?.pageTitle || 'Account Manager';
    $: seoDescription = $translations?.accountManager?.pageDescription || 'Manage your security settings and account preferences';

</script>

<svelte:head>
    <title>{seoTitle} - Keymoji</title>
    <meta name="description" content={seoDescription} />
</svelte:head>

<PageLayout {pageTitle} {pageDescription}>

    <!-- Main Content Container -->
    <div in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center z-10 gap-4 w-full">
            <!-- Account Content -->
            <div class="w-full">
                <!-- Account Status -->
                {#if $isLoggedIn}
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <p class="text-gray-600 dark:text-gray-400">
                                {$currentAccount?.email}
                            </p>

                            <!-- PRO Badge and Context Menu -->
                            <div class="flex items-center gap-2">
                                <ContextBadge 
                                    tier={$accountTier} 
                                    accountAgeLabel={accountAgeLabel}
                                    translations={$translations?.accountManager?.accountAge}
                                    position="top"
                                    variant="standard"
                                    trigger="hover"
                                    size="sm"
                                    width="lg"
                                    intro={true}
                                    introDelay={2000}
                                    introDuration={4000}
                                />

                                <div class="relative context-menu">
                                    <button
                                        on:click={toggleContextMenu}
                                        class="p-2 rounded-full bg-powder-300 dark:bg-aubergine-950 text-gray-700 dark:text-white hover:bg-creme-600 dark:hover:bg-aubergine-900 focus:bg-creme-600 dark:focus:bg-aubergine-900 active:bg-creme-700 dark:active:bg-aubergine-800 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                                        aria-label="{$translations?.accountManager?.contextMenu?.settingsMenu || 'Settings menu'}"
                                        title="{$translations?.accountManager?.contextMenu?.settingsMenu || 'Settings menu'}"
                                    >
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                    
                                    <!-- Context Menu Dropdown -->
                                    {#if showContextMenu}
                                        <div 
                                            class="absolute right-0 mt-2 w-48 bg-white dark:bg-aubergine-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                                            style="top: 100%;"
                                            transition:slide={{ duration: 200 }}
                                        >
                                            <div class="py-1">
                                                <button
                                                    on:click={handleExportSettings}
                                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-aubergine-700 focus:bg-gray-100 dark:focus:bg-aubergine-700 active:bg-gray-200 dark:active:bg-aubergine-600 transition-all flex items-center focus:ring-2 focus:ring-yellow-50 focus:ring-offset-1"
                                                    aria-label={$translations?.accountManager?.contextMenu?.exportSettings || 'Export Settings'}
                                                >
                                                    <span class="mr-2">📤</span>
                                                    {$translations?.accountManager?.contextMenu?.exportSettings || 'Export Settings'}
                                                </button>
                                                
                                                <button
                                                    on:click={triggerFileInput}
                                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-aubergine-700 focus:bg-gray-100 dark:focus:bg-aubergine-700 active:bg-gray-200 dark:active:bg-aubergine-600 transition-all flex items-center focus:ring-2 focus:ring-yellow-50 focus:ring-offset-1"
                                                    aria-label={$translations?.accountManager?.contextMenu?.importSettings || 'Import Settings'}
                                                >
                                                    <span class="mr-2">📥</span>
                                                    {$translations?.accountManager?.contextMenu?.importSettings || 'Import Settings'}
                                                </button>
                                                
                                                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                                
                                                <button
                                                    on:click={handleResetSettings}
                                                    class="w-full text-left px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:bg-orange-50 dark:focus:bg-orange-900/20 active:bg-orange-100 dark:active:bg-orange-900/30 transition-all flex items-center focus:ring-2 focus:ring-orange-300 focus:ring-offset-1"
                                                    aria-label={$translations?.accountManager?.contextMenu?.resetToDefault || 'Reset to Default'}
                                                >
                                                    <span class="mr-2">🔄</span>
                                                    {$translations?.accountManager?.contextMenu?.resetToDefault || 'Reset to Default'}
                                                </button>
                                                
                                                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                                
                                                <button
                                                    on:click={handleLogout}
                                                    class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 transition-all flex items-center focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
                                                    aria-label={$translations?.accountManager?.contextMenu?.logout || 'Logout'}
                                                >
                                                    <span class="mr-2">🚪</span>
                                                    {$translations?.accountManager?.contextMenu?.logout || 'Logout'}
                                                </button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>

                        <!-- Daily Limit Status with Chart -->
                        <div class="bg-powder-300 dark:bg-aubergine-900 rounded-xl p-4 mb-5">
                            <!-- Header with Time Period Selector -->
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-md font-semibold text-gray-800 dark:text-gray-200">
                                    {$translations?.accountManager?.dailyGenerations || 'Daily Generations'}
                                </span>
                                <div class="flex items-center space-x-2">
                                    <!-- Time Period Buttons -->
                                    <div class="inline-flex rounded-lg bg-white dark:bg-aubergine-800 p-0.5 shadow-inner">
                                        {#each ['7d', '14d', '4w', '1y'] as period}
                                            <button
                                                on:click={() => selectedTimePeriod = period}
                                                class="px-2 py-1 text-xs font-medium rounded-md transition-all {
                                                    selectedTimePeriod === period 
                                                        ? 'bg-yellow-500 text-white shadow' 
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                                }"
                                                aria-label="Show {period === '7d' ? '7 days' : period === '14d' ? '14 days' : period === '4w' ? '4 weeks' : '1 year'}"
                                            >
                                                {period}
                                            </button>
                                        {/each}
                                    </div>
                                    <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                        {dailyLimitDisplay}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Line Chart (Full Width, Edge-to-Edge) -->
                            <div class="mb-3 -mx-4">
                                <LineChart 
                                    data={usageChartData}
                                    maxValue={$accountTier === 'pro' ? 25 : 9}
                                    height={200}
                                    color={$accountTier === 'pro' ? '#a855f7' : '#eab308'}
                                    animate={true}
                                />
                            </div>
                            
                            <!-- Progress Bar -->
                            <div class="w-full bg-gray-300 dark:bg-aubergine-600 rounded-full h-3 mb-2">
                                <div 
                                    class="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                                    style="width: {Math.min(100, (($dailyLimit?.used || 0) / currentUserLimits.limit) * 100)}%"
                                ></div>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {remainingGenerations > 0 ? ($translations?.accountManager?.canStillGenerate || 'You can still generate emojis!') : ($translations?.accountManager?.limitReached || 'Daily limit reached. Upgrade to PRO for unlimited generations.')}
                            </p>
                        </div>

                        <!-- Account Statistics -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    0
                                </div>
                                <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    {$translations?.accountManager?.statistics?.storiesGenerated || 'Stories Generated'}
                                </div>
                            </div>
                            <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {$accountTier === 'pro' ? '∞' : remainingGenerations}
                                </div>
                                <div class="text-sm font-medium text-green-800 dark:text-green-200">
                                    {$translations?.accountManager?.statistics?.remainingGenerations || 'Remaining Generations'}
                                </div>
                            </div>
                        </div>

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
                                disabled={!$hasUnsavedChanges || $settingsStatus.isSaving}
                                on:click={async () => {
                                    try {
                                        await saveAllSettings();
                                        showSuccess($translations?.accountManager?.actions?.settingsSaved || 'Settings saved successfully!', 3000);
                                    } catch (error) {
                                        showError($translations?.accountManager?.actions?.settingsSaveFailed || 'Failed to save settings', 3000);
                                    }
                                }}
                                ariaLabel={$translations?.accountManager?.actions?.saveSettings || 'Save settings'}
                                tooltip={$hasUnsavedChanges ? ($translations?.accountManager?.actions?.unsavedChanges || 'You have unsaved changes') : ($translations?.accountManager?.actions?.noChanges || 'No changes to save')}
                            >
                                {#if $settingsStatus.isSaving}
                                    <span class="flex items-center justify-center">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {$translations?.accountManager?.actions?.saving || 'Saving...'}
                                    </span>
                                {:else}
                                    {$translations?.accountManager?.actions?.saveSettings || '💾 Save Settings'}
                                {/if}
                            </Button>
                            
                            <!-- Secondary Action: Back to Home -->
                            {#if remainingGenerations > 0}
                            <Button
                                variant="secondary"
                                size="md"
                                fullWidth={true}
                                on:click={navigateToHome}
                            >
                                {$translations?.accountManager?.actions?.backToHome || '🏠 Back to Home'}
                            </Button>
                            {/if}
                        </div>
                    </div>
                {:else if accountCreationStep === 'verification'}
                    <!-- Verification Step -->
                    <div class="space-y-4">
                        <Button
                            variant="primary"
                            size="md"
                            fullWidth={true}
                            on:click={resendMagicLink}
                            disabled={isSubmitting}
                        >
                            {#if isSubmitting}
                                <span class="animate-spin mr-1">⏳</span>
                                {$translations?.accountManager?.buttons?.sendingMagicLink || 'Sending...'}
                            {:else}
                                {$translations?.accountManager?.buttons?.resendMagicLink || '🔄 Resend Magic Link'}
                            {/if}
                        </Button>
                        
                        <Button
                            variant="secondary"
                            size="md"
                            fullWidth={true}
                            on:click={goBackToBenefits}
                        >
                            {$translations?.accountManager?.buttons?.backToAccountOptions || '← Back to Account Options'}
                        </Button>
                        
                        <!-- Help Section -->
                        <div class="mt-6 p-4 bg-creme-600 dark:bg-aubergine-900 rounded-xl">
                            <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                {$translations?.accountManager?.help?.title || '💡 Need Help?'}
                            </h3>
                            <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                <li>{$translations?.accountManager?.help?.spamFolder || "• Check your spam folder if you don't see the email"}</li>
                                <li>{$translations?.accountManager?.help?.magicLinkExpiry || '• Magic links expire after 15 minutes'}</li>
                                <li>{$translations?.accountManager?.help?.requestNewLink || '• You can request a new link anytime'}</li>
                                <li>{$translations?.accountManager?.help?.noPassword || '• No password required - just click the link'}</li>
                            </ul>
                        </div>
                    </div>

                {:else if shouldShowSimplifiedView}
                    <!-- Return User Simplified Form -->
                    <!-- Pro upgrade hint -->
                    <div class="bg-creme-600 dark:bg-aubergine-900 rounded-xl p-4 mb-6 border border-purple-200 dark:border-purple-700">
                        <div class="flex items-center justify-center space-x-2 mb-2">
                            <span class="text-purple-600 dark:text-purple-400">💎</span>
                            <span class="font-semibold text-purple-800 dark:text-purple-200">
                                {$translations?.accountManager?.upgrade?.upgradeToPro || 'Upgrade to PRO'}
                            </span>
                        </div>
                        <p class="text-sm text-purple-700 dark:text-purple-300">
                            {$translations?.accountManager?.upgrade?.unlimitedGenerations || 'Unlimited generations and advanced security features'}
                        </p>
                    </div>

                    <!-- Login form -->
                    <form on:submit|preventDefault={handleLogin} class="space-y-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            fullWidth={true}
                            disabled={isSubmitting || !isEmailValid}
                        >
                            <div class="flex flex-col items-center justify-center -m-2">
                                <span>{intelligentButtonText}</span>
                                <span class="text-sm text-gray-500">
                                    ({anonymizeEmail(email)})
                                </span>
                            </div>
                        </Button>
                        
                        <!-- Alternative actions -->
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            fullWidth={true}
                            on:click={() => startAccountCreationForReturnUser()}
                        >
                            {$translations?.accountManager?.buttons?.showFullForm || 'Show full form'}
                        </Button>
                    </form>
                {:else if showExpandedView}
                    <!-- Expanded View for Return Users -->
                    <div in:fly={{y: 20, duration: 400}} out:fly={{y: -20, duration: 400}}>
                        <!-- Account Creation Flow -->
                         <div class="transform -translate-y-3.5 scale-114">
                            <div class="core-button relative h-20 bg-creme-500 dark:bg-aubergine-900 border-powder-300 dark:border-aubergine-800 shadow-inner overflow-hidden mb-1">
                                <div
                                    class="absolute inset-y-1 bg-powder-300 dark:bg-aubergine-800 rounded-full shadow-lg transition-transform duration-500 ease-in-out"
                                    style="width: calc(48% - 2px); left: 4px; transform: translateX({showBenefitsToggle === 'pro' ? 'calc(100% + 11px)' : '0'})"
                                ></div>
                            <div class="w-full h-full relative flex justify-around">
                                <button
                                    class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10 hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                                    on:click={() => selectAccountType('free')}
                                    aria-label={$translations?.accountManager?.tiers?.free || 'Select Free account'}
                                    title={$translations?.accountManager?.freeDescription || 'Free account'}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        {$translations?.accountManager?.tiers?.free || 'FREE'}
                                    </span>
                                    <span class="text-xs transition-colors duration-300 text-yellow-600">
                                        {$translations?.accountManager?.freeDescription || '✨ Kostenlose Sicherheit'}
                                    </span>
                                </button>
                                <button
                                    class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10 hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                                    on:click={() => selectAccountType('pro')}
                                    aria-label={$translations?.accountManager?.tiers?.pro || 'Select Pro account'}
                                    title={$translations?.accountManager?.proDescription || 'Pro account'}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        {$translations?.accountManager?.tiers?.pro || 'PRO'}
                                    </span>
                                    <span class="text-xs transition-colors duration-300 text-purple-600">
                                        {$translations?.accountManager?.proDescription || '💎 Enterprise Security'}
                                    </span>
                                </button>
                            </div>
                            </div>
                        </div>
                        <!-- Benefits Content -->
                        <div class="relative min-h-[400px] mb-5 z-10">
                            <!-- FREE Benefits -->
                            <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'free' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'}">
                                <div class="space-y-4">
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">✓</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.free?.dailyGenerations || '5 daily secure generations'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.free?.dailyGenerationsDesc || 'AI-resistant technology'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">🔒</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.free?.decentralizedData || 'Decentralized data processing'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.free?.decentralizedDataDesc || 'Your data stays private'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">📱</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.free?.webApp || 'Available as web app'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.free?.webAppDesc || 'Secure access from anywhere'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- PRO Benefits -->
                            <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'pro' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'}">
                                <div class="space-y-4">
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">∞</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.pro?.unlimitedGenerations || 'Unlimited secure generations'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.unlimitedGenerationsDesc || 'No daily limits'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">🧠</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.pro?.aiThreatDetection || 'AI-powered threat detection'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.aiThreatDetectionDesc || 'Proactive security analysis'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">⚡</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.pro?.prioritySupport || 'Priority support'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.prioritySupportDesc || 'Quick help with questions'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                                            <!-- Action Buttons for Expanded View -->
                    <div class="space-y-4">
                        <!-- Back to simplified view button - Only show if no login history -->
                        {#if !storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY)?.email}
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                fullWidth={true}
                                on:click={() => showExpandedView = false}
                            >
                                {$translations?.accountManager?.buttons?.compactView || 'Compact view'}
                            </Button>
                        {/if}
                    </div>
                    
                    <!-- Login Form for Return Users -->
                    <div class="bg-transparent mb-2 relative z-20">
                        <form on:submit|preventDefault={handleLogin} class="space-y-4">
                            <div>
                                <label for="email" class="sr-only">{$translations?.accountManager?.emailLabel || 'Email'}</label>
                                <Input
                                    id="email"
                                    type="email"
                                    bind:value={email}
                                    placeholder={$translations?.accountManager?.emailLabel || 'Email'}
                                    required={true}
                                    disabled={isSubmitting}
                                    invalid={!isEmailValid && email.trim()}
                                    valid={isEmailValid && email.trim()}
                                    autocomplete="email"
                                />
                            </div>

                            {#if showProfileForm}
                                <div>
                                    <label for="name-expanded" class="sr-only">{$translations?.accountManager?.nameLabel || 'Name'}</label>
                                    <Input
                                        id="name-expanded"
                                        type="text"
                                        bind:value={name}
                                        placeholder={$translations?.accountManager?.nameLabel || 'Name'}
                                        required={true}
                                        disabled={isSubmitting}
                                        invalid={!isNameValid && name.trim()}
                                        valid={isNameValid && name.trim()}
                                        autocomplete="name"
                                    />
                                </div>
                            {/if}

                            <!-- Form Validation -->
                            {#if !isFormValid && email}
                                <div class="text-sm text-red-600 dark:text-red-400 text-center mt-1">
                                    {#if !isEmailValid}
                                        <p id="email-error">⚠️ {$translations?.accountManager?.validation?.emailInvalid || 'Please enter a valid email address'}</p>
                                    {/if}
                                    {#if showProfileForm && !isNameValid}
                                        <p id="name-error">⚠️ {$translations?.accountManager?.validation?.nameInvalid || 'Please enter your name (minimum 2 characters)'}</p>
                                    {/if}
                                </div>
                            {/if}

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                fullWidth={true}
                                disabled={!isFormValid || isSubmitting}
                            >
                                {#if isSubmitting}
                                    <span class="flex items-center justify-center">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {loginButtonText}
                                    </span>
                                {:else}
                                    {magicLinkButtonText}
                                {/if}
                            </Button>
                            
                            <!-- Small buttons side by side -->
                            <div class="flex gap-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    fullWidth={true}
                                    on:click={() => showProfileForm = !showProfileForm}
                                >
                                    <span class="mr-1.5">👤</span>{showProfileForm ? ($translations?.accountManager?.buttons?.hideProfile || 'Hide') : ($translations?.accountManager?.buttons?.addProfile || 'Add')} {$translations?.accountManager?.buttons?.name || 'Name'}
                                </Button>
                                
                                <!-- Only show if no login history -->
                                {#if !storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY)?.email}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        fullWidth={true}
                                        on:click={() => showExpandedView = false}
                                    >
                                        {$translations?.accountManager?.buttons?.compactView || 'Compact view'}
                                    </Button>
                                {/if}
                            </div>
                        </form>
                    </div>
                </div> 
                {:else}
                    <!-- Account Creation Flow - Styled like EmojiDisplay -->
                    <div class="transform -translate-y-3.5 scale-114">
                        <div class="core-button relative h-20 bg-creme-500 dark:bg-aubergine-900 border-powder-300 dark:border-aubergine-800 shadow-inner overflow-hidden mb-1">
                            <div
                                class="absolute inset-y-1 bg-powder-300 dark:bg-aubergine-800 rounded-full shadow-lg transition-transform duration-500 ease-in-out"
                                style="width: calc(48% - 2px); left: 4px; transform: translateX({showBenefitsToggle === 'pro' ? 'calc(100% + 11px)' : '0'})"
                            ></div>
                            <div class="w-full h-full relative flex justify-around">
                                <button
                                    class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10"
                                    on:click={() => selectAccountType('free')}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        FREE
                                    </span>
                                    <span class="text-xs transition-colors duration-300 text-yellow-600">
                                        {accountAgeLabel}
                                    </span>
                                </button>
                                <button
                                    class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10"
                                    on:click={() => selectAccountType('pro')}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        {$translations?.accountManager?.tiers?.pro || 'PRO'}
                                    </span>
                                    <span class="text-sm transition-colors duration-300 text-purple-600">
                                        {accountAgeLabel}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Benefits Content -->
                    <div class="relative min-h-[400px] mb-5">
                        <!-- FREE Benefits -->
                        <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'free' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}">
                            <div class="space-y-4">
                                {#each Object.entries($translations?.accountManager?.benefits?.free || {}) as [key, value]}
                                    {#if !key.endsWith('Desc')}
                                        <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                            <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                                <span class="text-yellow-600 dark:text-yellow-400 text-2xl">
                                                    {key === 'dailyGenerations' ? '✓' : 
                                                     key === 'decentralizedData' ? '🔒' : 
                                                     key === 'webApp' ? '📱' : '✓'}
                                                </span>
                                            </div>
                                            <div>
                                                <span class="text-md font-bold text-black dark:text-white">{value}</span>
                                                <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.free?.[key + 'Desc'] || ''}</p>
                                            </div>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>

                        <!-- PRO Benefits -->
                        <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'pro' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}">
                            <div class="space-y-4">
                                {#each Object.entries($translations?.accountManager?.benefits?.pro || {}) as [key, value]}
                                    {#if !key.endsWith('Desc')}
                                        <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                            <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-100 to-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-200 dark:from-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-800 dark:to-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                                <span class="text-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-600 dark:text-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-400 text-2xl">
                                                    {key === 'unlimitedGenerations' ? '∞' : 
                                                     key === 'aiThreatDetection' ? '🧠' : 
                                                     key === 'prioritySupport' ? '⚡' : 
                                                     key === 'browserExtension' ? '🌐' : 
                                                     key === 'apiIntegration' ? '🔌' : 
                                                     key === 'advancedAnalytics' ? '📊' : 
                                                     key === 'wordpressPlugin' ? '📝' : '✓'}
                                                </span>
                                            </div>
                                            <div>
                                                <span class="text-md font-bold text-black dark:text-white">{value}</span>
                                                <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.[key + 'Desc'] || ''}</p>
                                            </div>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>

                    <!-- Create Account Button - ENTFERNT -->
                    <!-- Button wurde entfernt - Funktionalität wird über direkte Formular-Navigation abgedeckt -->

                    <!-- Login Form -->
                    <div class="bg-transparent mb-2 relative z-20">      
                        <form on:submit|preventDefault={handleLogin} class="space-y-4">
                            <div>
                                <label for="email" class="sr-only">{$translations?.accountManager?.emailLabel || 'Email'}</label>
                                <Input
                                    id="email"
                                    type="email"
                                    bind:value={email}
                                    placeholder={$translations?.accountManager?.emailLabel || 'Email'}
                                    required={true}
                                    disabled={isSubmitting}
                                    invalid={!isEmailValid && email.trim()}
                                    valid={isEmailValid && email.trim()}
                                />
                            </div>

                            {#if showProfileForm}
                                <div>
                                    <label for="name" class="sr-only">{$translations?.accountManager?.nameLabel || 'Name'}</label>
                                    <Input
                                        id="name"
                                        type="text"
                                        bind:value={name}
                                        placeholder={$translations?.accountManager?.nameLabel || 'Name'}
                                        required={true}
                                        disabled={isSubmitting}
                                        invalid={!isNameValid && name.trim()}
                                        valid={isNameValid && name.trim()}
                                    />
                                </div>
                            {/if}

                            <!-- Form Validation -->
                            {#if !isFormValid && email}
                                <div class="text-sm text-red-600 dark:text-red-400 text-center">
                                    {#if !isEmailValid}
                                        <p id="email-error">⚠️ {$translations?.accountManager?.validation?.emailInvalid || 'Please enter a valid email address'}</p>
                                    {/if}
                                    {#if showProfileForm && !isNameValid}
                                        <p id="name-error">⚠️ {$translations?.accountManager?.validation?.nameInvalid || 'Please enter your name (minimum 2 characters)'}</p>
                                    {/if}
                                </div>
                            {/if}

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                fullWidth={true}
                                disabled={!isFormValid || isSubmitting}
                            >
                                {#if isSubmitting}
                                    <span class="flex items-center justify-center">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {loginButtonText}
                                    </span>
                                {:else}
                                    {magicLinkButtonText}
                                {/if}
                            </Button>

                            <Button
                                variant="secondary"
                                size="md"
                                fullWidth={true}
                                on:click={() => showProfileForm = !showProfileForm}
                                >
                                <span class="mr-1.5">👤</span>{showProfileForm ? ($translations?.accountManager?.buttons?.hideProfile || 'Hide') : ($translations?.accountManager?.buttons?.addProfile || 'Add')} {$translations?.accountManager?.buttons?.name || 'Name'}
                            </Button>
                        </form>
                    </div>



                    <!-- Footer -->
                    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <span class="flex items-center">
                                🔗 {$translations?.accountManager?.footer?.magicLink || 'Magic link'}
                            </span>
                            <span class="flex items-center">
                                ⚡ {$translations?.accountManager?.footer?.instantSetup || 'Instant Setup'}
                            </span>
                            <span class="flex items-center">
                                🛡️ {$translations?.accountManager?.footer?.noSpam || 'No Spam'}
                            </span>
                        </div>
                    </div>
                {/if}
            </div>
        </section>
    </div>

    <!-- Hidden file input for settings import -->
    <input
        bind:this={fileInput}
        type="file"
        accept=".json"
        on:change={handleImportSettings}
        class="hidden"
    />

    <!-- Footer Information Component -->
    <FooterInfo slot="footer" />
</PageLayout>