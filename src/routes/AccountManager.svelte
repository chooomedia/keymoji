<!-- src/routes/AccountManager.svelte -->
<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fade, fly, slide } from 'svelte/transition';
    import Header from '../components/Layout/Header.svelte';
    import FixedMenu from '../widgets/FixedMenu.svelte';
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
    import { currentSettings, resetSettings, exportSettings, importSettings } from '../stores/userSettingsStore.js';
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

    // Toggle state
    let showBenefitsToggle = 'free';
    let email = '';
    let name = '';
    let showProfileForm = false;
    let isSubmitting = false;
    let showSettings = false;
    let showUserSettings = false;
    let accountCreationStep = 'benefits'; // 'benefits', 'form', 'verification'
    let selectedAccountType = 'free'; // 'free', 'pro'
    let showAdvancedOptions = false;

    // Session management
    let accountExists = false;
    let checkingAccount = false;
    let sessionExpired = false;
    let hasValidSession = false;

    // Calculate days since account creation
    function getDaysSinceAccountCreation() {
        // Debug: Log the current account structure
        console.log('🔍 DEBUG: Current account structure:', $currentAccount);
        console.log('🔍 DEBUG: metadata:', $currentAccount?.metadata);
        console.log('🔍 DEBUG: createdAt paths:', {
            'metadata.createdAt': $currentAccount?.metadata?.createdAt,
            'createdAt': $currentAccount?.createdAt,
            'profile.createdAt': $currentAccount?.profile?.createdAt,
            'lastLogin': $currentAccount?.lastLogin,
            'timestamp': $currentAccount?.timestamp
        });
        
        // Try different possible paths for creation date
        const possibleDates = [
            $currentAccount?.metadata?.createdAt,
            $currentAccount?.createdAt,
            $currentAccount?.profile?.createdAt,
            $currentAccount?.timestamp,
            $currentAccount?.lastLogin
        ];
        
        // Also try localStorage as fallback
        const userPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES);
        if (userPrefs?.metadata?.createdAt) {
            possibleDates.push(userPrefs.metadata.createdAt);
        }
        if (userPrefs?.lastLogin) {
            possibleDates.push(userPrefs.lastLogin);
        }
        
        const createdAtValue = possibleDates.find(date => date);
        
        if (!createdAtValue) {
            console.warn('⚠️ No creation date found in account data');
            return 0;
        }
        
        try {
            const createdAt = new Date(createdAtValue);
            const now = new Date();
            const diffTime = Math.abs(now - createdAt);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            console.log('✅ Days since creation calculated:', {
                createdAtValue,
                createdAt,
                diffDays
            });
            
            return diffDays;
        } catch (error) {
            console.warn('Error calculating days since account creation:', error);
            return 0;
        }
    }
    
    // Reactive calculation for days since account creation
    $: daysSinceCreation = getDaysSinceAccountCreation();
    
    // TEMPORARY TEST: Force a value to test UI
    $: daysSinceCreation = 42; // Uncomment this line to test with 42 days
    
    // Debug: Log when daysSinceCreation changes
    $: if (daysSinceCreation !== undefined) {
        console.log('🔄 daysSinceCreation updated:', daysSinceCreation);
    }
    
    // Return user view state
    let hasLoggedInBefore = false;
    let shouldShowSimplifiedView = false;
    
    // Reactive daily limit calculation
    $: currentUserLimits = validateUserLimits($isLoggedIn, $accountTier, $dailyLimit?.used || 0);
    $: remainingGenerations = currentUserLimits.remaining;
    $: dailyLimitDisplay = `${remainingGenerations} / ${currentUserLimits.limit} remaining`;

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
            shouldShowSimplifiedView = true;
            email = history.email;
            console.log('👤 Return user erkannt:', history.email);
            console.log('👤 shouldShowSimplifiedView:', shouldShowSimplifiedView);
        } else {
            hasLoggedInBefore = false;
            shouldShowSimplifiedView = false;
            console.log('👤 Kein Return user');
            console.log('👤 shouldShowSimplifiedView:', shouldShowSimplifiedView);
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
            return $translations?.accountManager?.buttons?.loginAgain || '🔐 Erneut einloggen';
        }
        return $translations?.accountManager?.buttons?.createMagicLink || 'Create Magic Link';
    })();

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
        // For return users, skip benefits and go directly to form
        accountCreationStep = 'form';
        shouldShowSimplifiedView = false;
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

    // Debug-Logging für Reaktivität - nur in Development
    $: if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log('🔄 AccountManager: Language changed to:', $currentLanguage);
        console.log('🔄 AccountManager: Translations updated:', {
            pageTitle: $translations?.accountManager?.pageTitle,
            pageDescription: $translations?.accountManager?.pageDescription,
            welcomeBack: $translations?.accountManager?.welcomeBack,
            freeDescription: $translations?.accountManager?.freeDescription,
            proDescription: $translations?.accountManager?.proDescription
        });
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
        showSuccess('Settings reset to default', 3000);
        closeContextMenu();
    }

    // Handle settings export
    function handleExportSettings() {
        try {
            exportSettings();
            showSuccess('Settings exported successfully', 3000);
        } catch (error) {
            showError('Failed to export settings', 3000);
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
        shouldShowSimplifiedView = false;
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
            
            // Mark successful login for return user tracking
            markSuccessfulLogin(email);
            
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
            
            // Update daily limits based on current user state
            let currentUsed = storageHelpers.get(STORAGE_KEYS.DAILY_REQUEST_COUNT, 0);
            const userLimits = validateUserLimits($isLoggedIn, $accountTier, currentUsed);
            
            // Fix inconsistent localStorage values
            if (currentUsed > userLimits.limit) {
                console.log('⚠️ Fixing inconsistent localStorage: User has', currentUsed, 'generations but limit is', userLimits.limit);
                console.log('🔧 Resetting to limit:', userLimits.limit);
                storageHelpers.set(STORAGE_KEYS.DAILY_REQUEST_COUNT, userLimits.limit);
                currentUsed = userLimits.limit; // Update for this session
            }
            
            // Debug: Log current state
            console.log('🔍 Current state:', {
                isLoggedIn: $isLoggedIn,
                accountTier: $accountTier,
                localStorageCount: currentUsed,
                calculatedLimit: userLimits.limit,
                remaining: userLimits.remaining
            });
            
            dailyLimit.set({ limit: userLimits.limit, used: Math.min(currentUsed, userLimits.limit) });
            console.log('🔢 Updated daily limits:', userLimits);
            
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
            
            // Check user login history for return user view
            checkUserLoginHistory();
            
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
    $: if ($isLoggedIn !== undefined && $accountTier !== undefined) {
        const currentUsed = storageHelpers.get(STORAGE_KEYS.DAILY_REQUEST_COUNT, 0);
        const userLimits = validateUserLimits($isLoggedIn, $accountTier, currentUsed);
        dailyLimit.set({ limit: userLimits.limit, used: currentUsed });
        console.log('🔄 Daily limits updated due to user state change:', userLimits);
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
        return $translations?.accountManager?.buttons?.createMagicLink || 'Create Magic Link';
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

</script>

<svelte:head>
    <title>Account Management - Keymoji</title>
    <meta name="description" content="Manage your Keymoji account and security settings" />
</svelte:head>

<!-- App Container -->
<main class="app-container" data-lang={$currentLanguage}>
    <!-- Header -->
    <Header />
    
    <!-- Main Content Container -->
    <div class="min-h-screen scroll-smooth overflow-x-hidden" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center min-h-screen py-32 px-4 z-10 gap-4 scroll-smooth overflow-x-hidden w-full">

            <!-- Main Heading -->
            <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
                {#if isVerifyingMagicLink}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        🔗 Verifiziere Magic Link...
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        Bitte warte, während wir deinen Account verifizieren.
                    </p>
                {:else if magicLinkStatus === 'error'}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        ❌ Verifikation Fehlgeschlagen
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        {magicLinkError}
                    </p>
                {:else if $isLoggedIn}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        {$translations?.accountManager?.welcomeBack?.replace('{name}', $userProfile?.name || $currentAccount?.name || 'User') || 'Welcome back, User! 👋'}
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        {$translations?.accountManager?.welcomeDescription || 'Ready to create some amazing emoji passwords? Your account is secure and ready to go!'}
                    </p>
                {:else if accountCreationStep === 'verification'}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        {$translations?.accountManager?.verificationTitle || '📧 Check Your Email and Verify'}
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        {@html ($translations?.accountManager?.verificationDescription || 'Check your email {email} and click the magic link to complete setup').replace('{email}', email)}
                    </p>
                {:else if shouldShowSimplifiedView}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        👋 Willkommen zurück!
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        Wir haben deine E-Mail-Adresse erkannt. Logge dich schnell wieder ein.
                    </p>
                {:else}
                    <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                        {$translations?.accountManager?.pageTitle || 'Account Management'}
                    </h1>
                    <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed text-gray">
                        {$translations?.accountManager?.pageDescription || 'Manage your security settings and account preferences'}
                    </p>
                {/if}
            </div>

            <!-- Account Content -->
            <div class="content-wrapper w-11/12 md:w-26r rounded-xl bg-creme-500 dark:bg-aubergine-800">
                <!-- Account Status -->
                {#if $isLoggedIn}
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-6">
                            <p class="text-gray-600 dark:text-gray-400">
                                {$currentAccount?.email}
                            </p>

                            <!-- PRO Badge and Context Menu -->
                            <div class="flex items-center gap-2">
                                <!-- PRO Badge with Hover Info -->
                                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-creme-500 dark:text-white {$accountTier === 'pro' ? 'bg-purple-700' : 'bg-yellow-600'} cursor-pointer group relative" 
                                      title="{daysSinceCreation > 0 ? `Account seit ${daysSinceCreation} ${daysSinceCreation === 1 ? 'Tag' : 'Tagen'}` : 'Account erstellt'}"
                                      aria-label="Account Tier: {$accountTier === 'pro' ? 'PRO' : 'FREE'}, {daysSinceCreation > 0 ? `seit ${daysSinceCreation} ${daysSinceCreation === 1 ? 'Tag' : 'Tagen'}` : 'Account erstellt'}">
                                    {$accountTier === 'pro' ? ($translations?.accountManager?.proBadge || '💎 PRO') : ($translations?.accountManager?.freeBadge || '✨ FREE')}
                                    <span class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                                        {daysSinceCreation > 0 ? `seit ${daysSinceCreation} ${daysSinceCreation === 1 ? 'Tag' : 'Tagen'}` : 'Account erstellt'}
                                    </span>
                                </span>

                                <div class="relative context-menu">
                                    <button
                                        on:click={toggleContextMenu}
                                        class="p-2 rounded-full bg-powder-300 dark:bg-aubergine-950 text-gray-700 dark:text-white hover:bg-creme-600 dark:hover:bg-aubergine-900 transition-colors"
                                        aria-label="Settings menu"
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
                                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-aubergine-700 transition-colors flex items-center"
                                                >
                                                    <span class="mr-2">📤</span>
                                                    Export Settings
                                                </button>
                                                
                                                <button
                                                    on:click={triggerFileInput}
                                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-aubergine-700 transition-colors flex items-center"
                                                >
                                                    <span class="mr-2">📥</span>
                                                    Import Settings
                                                </button>
                                                
                                                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                                
                                                <button
                                                    on:click={handleResetSettings}
                                                    class="w-full text-left px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center"
                                                >
                                                    <span class="mr-2">🔄</span>
                                                    Reset to Default
                                                </button>
                                                
                                                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                                
                                                <button
                                                    on:click={handleLogout}
                                                    class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center"
                                                >
                                                    <span class="mr-2">🚪</span>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>

                        <!-- Daily Limit Status -->
                        <div class="bg-powder-300 dark:bg-aubergine-900 rounded-xl p-4 mb-5">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    {$translations?.accountManager?.dailyGenerations || 'Daily Generations'}
                                </span>
                                <span class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                    {dailyLimitDisplay}
                                </span>
                            </div>
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
                                on:click={() => showSuccess('Settings saved successfully!', 3000)}
                            >
                                {$translations?.accountManager?.actions?.saveSettings || '💾 Save Settings'}
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
                    <div class="p-4 text-center">
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
                                    Sending...
                                {:else}
                                    <span class="mr-1">🔄</span>
                                    Resend Magic Link
                                {/if}
                            </Button>
                            
                            <Button
                                variant="secondary"
                                size="md"
                                fullWidth={true}
                                on:click={goBackToBenefits}
                            >
                                <span class="mr-1">←</span>
                                Back to Account Options
                            </Button>
                            
                            <!-- Help Section -->
                            <div class="mt-6 p-4 bg-creme-600 dark:bg-aubergine-900 rounded-xl">
                                <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                    💡 Need Help?
                                </h3>
                                <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>• Check your spam folder if you don't see the email</li>
                                    <li>• Magic links expire after 15 minutes</li>
                                    <li>• You can request a new link anytime</li>
                                    <li>• No password required - just click the link</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                {:else if shouldShowSimplifiedView}
                    <!-- Return User Simplified Form -->
                    <div class="p-4">
                        <!-- Pro upgrade hint -->
                        <div class="bg-creme-600 dark:bg-aubergine-900 rounded-xl p-4 mb-6 border border-purple-200 dark:border-purple-700">
                            <div class="flex items-center justify-center space-x-2 mb-2">
                                <span class="text-purple-600 dark:text-purple-400">💎</span>
                                <span class="font-semibold text-purple-800 dark:text-purple-200">
                                    Upgrade auf PRO
                                </span>
                            </div>
                            <p class="text-sm text-purple-700 dark:text-purple-300">
                                Unbegrenzte Generierungen und erweiterte Sicherheitsfeatures
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
                                <div class="flex flex-col items-center justify-center">
                                    <span>{intelligentButtonText}</span>
                                    <span class="text-sm">
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
                                on:click={() => shouldShowSimplifiedView = false}
                            >
                                Vollständiges Formular anzeigen
                            </Button>
                        </form>
                    </div>
                {:else}
                    <!-- Account Creation Flow -->
                    <div class="p-4">
                        <div class="relative h-20 bg-powder-300 dark:bg-aubergine-900 rounded-full shadow-inner p-2 overflow-hidden mb-4">
                            <div
                                class="absolute inset-y-2 left-2 bg-creme-500 dark:bg-aubergine-800 rounded-full shadow-lg transition-transform duration-500 ease-in-out"
                                style="width: calc(50% - 4px); transform: translateX({showBenefitsToggle === 'pro' ? 'calc(100% - 6px)' : '0'})"
                            ></div>
                            <div class="relative flex h-full">
                                <button
                                    class="flex-1 flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10"
                                    on:click={() => selectAccountType('free')}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        FREE
                                    </span>
                                    <span class="text-sm transition-colors duration-300 text-gray-700 dark:text-gray-200">
                                        {$translations?.accountManager?.freeDescription || '✨ Kostenlose Sicherheit'}
                                    </span>
                                </button>
                                <button
                                    class="flex-1 flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10"
                                    on:click={() => selectAccountType('pro')}
                                >
                                    <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                        PRO
                                    </span>
                                    <span class="text-sm transition-colors duration-300 text-gray-500 dark:text-gray-500">
                                        {$translations?.accountManager?.proDescription || '💎 Enterprise Security'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Benefits Content -->
                        <div class="relative min-h-[400px] mb-5">
                            <!-- FREE Benefits -->
                            <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'free' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}">
                                <div class="space-y-4">
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">✓</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.free?.dailyGenerations || '5 tägliche sichere Generierungen'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.free?.dailyGenerationsDesc || 'KI-resistente Technologie'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">🔒</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.free?.decentralizedData || 'Denzentrale Datenverabeitung'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.free?.decentralizedDataDesc || 'Deine Daten bleiben privat'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">📱</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.free?.webApp || 'Als Webapp nutzbar'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.free?.webAppDesc || 'Sicherer Zugriff von überall'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- PRO Benefits -->
                            <div class="transition-all duration-700 ease-in-out {showBenefitsToggle === 'pro' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'}">
                                <div class="space-y-4">
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">∞</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.pro?.unlimitedGenerations || 'Unbegrenzte sichere Generierungen'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.unlimitedGenerationsDesc || 'Keine täglichen Limits'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">🧠</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.pro?.aiThreatDetection || 'KI-gestützte Bedrohungserkennung'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.aiThreatDetectionDesc || 'Proaktive Sicherheitsanalyse'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">🌐</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.pro?.browserExtension || 'Browser-Erweiterung (Q4 2025)'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.browserExtensionDesc || 'Sicherheit überall im Web'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-purple-600 dark:text-purple-400 text-2xl">📝</span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{$translations?.accountManager?.benefits?.pro?.wordpressPlugin || 'WordPress-Plugin (Q4 2025)'}</span>
                                            <p class="text-gray-600 dark:text-gray-400">{$translations?.accountManager?.benefits?.pro?.wordpressPluginDesc || 'Sicherheit in deine Website integrieren'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Create Account Button -->
                        <div class="text-center mb-6">
                            <Button
                                variant="primary"
                                size="md"
                                fullWidth={true}
                                on:click={startAccountCreation}
                            >
                                {#if accountCreationStep === 'form'}
                                   {($translations?.accountManager?.actions?.skipAccount || 'Auf {type} verzichten').replace('{type}', selectedAccountType === 'pro' ? 'PRO' : 'FREE')}
                                {:else}
                                    {($translations?.accountManager?.actions?.createAccount || '🚀 {type} Account anlegen').replace('{type}', selectedAccountType === 'pro' ? 'PRO' : 'FREE')}
                                {/if}
                            </Button>
                        </div>

                        <!-- Login Form -->
                        <div class="bg-transparent mb-2">      
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
                                        />
                                    </div>
                                {/if}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    fullWidth={true}
                                    disabled={isSubmitting || !isFormValid}
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
                                        {loginButtonText}
                                    {/if}
                                </Button>
                                
                                <!-- Form Validation -->
                                {#if !isFormValid && email}
                                    <div class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                        {#if !isEmailValid}
                                            <p>⚠️ Please enter a valid email address</p>
                                        {/if}
                                        {#if showProfileForm && !isNameValid}
                                            <p>⚠️ Please enter your name (minimum 2 characters)</p>
                                        {/if}
                                    </div>
                                {/if}
                                
                                <Button
                                    variant="secondary"
                                    size="md"
                                    fullWidth={true}
                                    on:click={() => showProfileForm = !showProfileForm}
                                    >
                                    <span class="mr-1.5">👤</span>{showProfileForm ? 'Hide' : 'Add'} Profile Data
                                </Button>
                            </form>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <span class="flex items-center">
                                {$translations?.accountManager?.footer?.magicLink || 'Magic link'}
                            </span>
                            <span class="flex items-center">
                                {$translations?.accountManager?.footer?.instantSetup || 'Instant Setup'}
                            </span>
                            <span class="flex items-center">
                                {$translations?.accountManager?.footer?.noSpam || 'No Spam'}
                            </span>
                        </div>
                    </div>
                {/if}
            </div>
        </section>
    </div>

    <!-- Fixed Menu -->
    <FixedMenu align={'bottom'} />
    
    <!-- Hidden file input for settings import -->
    <input
        bind:this={fileInput}
        type="file"
        accept=".json"
        on:change={handleImportSettings}
        class="hidden"
    />
</main> 