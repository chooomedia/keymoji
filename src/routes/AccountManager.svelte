<!-- src/routes/AccountManager.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fade, fly, slide, crossfade } from 'svelte/transition';
    import { tick } from 'svelte';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    import { 
        isLoggedIn, 
        dailyLimit, 
        isGuestUser, 
        isProUser, 
        currentAccount, 
        userProfile, 
        accountTier,
        isDisabled
    } from 'stores/appStores';
    import { remainingGenerations as remainingGenerationsStore } from '../stores/dailyUsageStore.js';
    import { translations, currentLanguage } from '../stores/contentStore.js';
    import { 
        isLoggingIn, 
        loginError, 
        initializeAccountFromCookies, 
        logout,
        hasExistingUserPreferences,
        hasValidUserSession,
        getUserEmailFromPreferences,
        verifyMagicLinkFrontend,
        checkAccountExists,
        secureLoginWithMagicLink,
        secureVerifyOTP,
        logAccountingEvent
    } from '../stores/accountStore.js';
    import { showSuccess, showError, showWarning, showInfo } from '../stores/modalStore';
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
    import { isDevelopment } from '../utils/environment';
    import { validateUserLimits } from '../config/limits.js';
    import { sendAnalyticsEvent } from 'stores/appStores';
    import Input from '../components/UI/Input.svelte';
    import Button from '../components/UI/Button.svelte';
    import ContextBadge from '../components/UI/ContextBadge.svelte';
    import LineChart from '../components/UI/LineChart.svelte';
    import ChartSkeleton from '../components/UI/ChartSkeleton.svelte';
    import FooterInfo from '../widgets/FooterInfo.svelte';
    import FeatureCard from '../components/Features/FeatureCard.svelte';
    import ExternalLinkIcon from '../components/UI/ExternalLinkIcon.svelte';
    import { getDaysSinceAccountCreation, formatAccountAge, getTierBadgeText } from '../utils/accountHelpers';
    // REMOVED: getUsageHistory, calculateUsageStats - now using usageHistory store from userDataStore.js
    import { DEMO_USAGE_HISTORY_4W, getDemoDataForPeriod, isDemoData } from '../utils/demoChartData';
    import { generateBenefitsStructuredData, injectStructuredData, formatCanonicalUrl } from '../utils/seo';

    // Reaktive PageLayout Props - dynamisch basierend auf Account-Status
    $: pageTitle = (() => {
        if (isVerifyingOTP) {
            return $translations?.accountManager?.verifyingTitle || '🔑 Verifying code...';
        }
        if ($isLoggedIn) {
            // Get user name from multiple sources with smart fallback (Priority Order!)
            const userName = 
                $currentSettings?.name ||        // 1. Current settings (from input, highest priority!)
                $userProfile?.name ||            // 2. User profile store
                $currentAccount?.name ||         // 3. Current account
                $currentAccount?.profile?.name || // 4. Account profile
                ($currentAccount?.email ? $currentAccount.email.split('@')[0] : null) || // 5. Email prefix
                'there'; // 6. Friendly fallback instead of "User"
            
            return ($translations?.accountManager?.welcomeBack || 'Welcome back, {name}! 👋').replace('{name}', userName);
        }
        if (accountCreationStep === 'verification') {
            return $translations?.accountManager?.verificationTitle || '📧 Check Your Email and Verify';
        }
        if (shouldShowSimplifiedView) {
            return $translations?.accountManager?.returnUserTitle || '👋 Welcome back!';
        }
        return $translations?.accountManager?.pageTitle || 'Account Manager';
    })();

    $: pageDescription = (() => {
        if (isVerifyingOTP) {
            return $translations?.accountManager?.verifyingDescription || 'Please wait while we verify your code.';
        }
        if ($isLoggedIn) {
            return $translations?.accountManager?.welcomeDescription || 'Ready to create some amazing emoji passwords? Your account is secure and ready to go!';
        }
        if (accountCreationStep === 'verification') {
            return ($translations?.accountManager?.verificationDescription || 'Check your email {email} and click the magic link to complete setup').replace('{email}', email);
        }
        if (shouldShowSimplifiedView) {
            return $translations?.accountManager?.returnUserDescription || 'We recognised your email. Log back in quickly.';
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

    // OTP verification
    let otpCode = '';
    let isVerifyingOTP = false;
    let otpError = '';
    let isNewUser = false; // true = Registrierung, false = Login

    // 7 separate digit fields for OTP input
    let otpDigits = ['', '', '', '', '', '', ''];
    let otpInputRefs = [];

    // Sync otpDigits → otpCode
    $: otpCode = otpDigits.join('');

    function handleOTPDigitInput(index, event) {
        otpError = '';
        const val = event.target.value.replace(/\D/g, '');
        // Paste: fill all fields from first input
        if (val.length > 1) {
            const digits = val.slice(0, 7).split('');
            digits.forEach((d, i) => { otpDigits[i] = d; });
            otpDigits = [...otpDigits];
            const filled = otpDigits.join('');
            const focusIdx = Math.min(digits.length, 6);
            otpInputRefs[focusIdx]?.focus();
            if (filled.length === 7) {
                setTimeout(() => handleOTPSubmit(null), 50);
            }
            return;
        }
        otpDigits[index] = val.slice(-1);
        otpDigits = [...otpDigits];
        if (val && index < 6) {
            otpInputRefs[index + 1]?.focus();
        }
        // Auto-submit when all 7 fields are filled
        const filled = otpDigits.join('');
        if (filled.length === 7 && !otpDigits.includes('')) {
            setTimeout(() => handleOTPSubmit(null), 50);
        }
    }

    function handleOTPDigitKeydown(index, event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const filled = otpDigits.join('');
            if (filled.length === 7) handleOTPSubmit(null);
            return;
        }
        if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpDigits[index - 1] = '';
            otpDigits = [...otpDigits];
            otpInputRefs[index - 1]?.focus();
        }
        if (event.key === 'ArrowLeft' && index > 0) otpInputRefs[index - 1]?.focus();
        if (event.key === 'ArrowRight' && index < 6) otpInputRefs[index + 1]?.focus();
    }

    function focusFirstOTPInput() {
        otpInputRefs[0]?.focus();
    }

    function focusFirstOTPInputAction(node) {
        // Svelte action: focus first digit when step becomes visible
        const t = setTimeout(() => otpInputRefs[0]?.focus(), 80);
        return { destroy() { clearTimeout(t); } };
    }
    
    // Reactive calculation for days since account creation
    // Übergebe $currentAccount damit API-Daten (Google Sheets) bevorzugt werden!
    $: daysSinceCreation = getDaysSinceAccountCreation($currentAccount);
    
    // Generate and inject structured data for benefits (Rich Elements for SEO)
    $: if ($translations?.accountManager?.benefits && !$isLoggedIn && accountCreationStep === 'benefits') {
        try {
            const canonicalUrl = formatCanonicalUrl(window.location.pathname);
            const benefitsStructuredData = generateBenefitsStructuredData(
                $translations.accountManager.benefits,
                $currentLanguage,
                canonicalUrl
            );
            injectStructuredData(benefitsStructuredData);
        } catch (error) {
            console.warn('⚠️ Failed to inject benefits structured data:', error);
        }
    }
    
    // Debug: Log when daysSinceCreation changes
    $: if (daysSinceCreation !== undefined) {
        try {
            console.log('🔄 [AccountManager] daysSinceCreation updated:', {
                daysSinceCreation,
                createdAt: $currentAccount?.createdAt,
                createdAtType: typeof $currentAccount?.createdAt,
                hasCurrentAccount: !!$currentAccount,
                isLoggedIn: $isLoggedIn
            });
            const label = $isLoggedIn ? formatAccountAge(daysSinceCreation, $translations?.accountManager?.accountAge || {}) : '';
            console.log('🔄 [AccountManager] accountAgeLabel will be:', label);
        } catch (error) {
            console.error('❌ [AccountManager] Error in daysSinceCreation reactive statement:', error);
        }
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
    // Use remainingGenerations from dailyUsageStore (single source of truth)
    $: remainingGenerations = $remainingGenerationsStore;
    $: dailyLimitDisplay = ($translations?.accountManager?.remainingDisplay || '{remaining} / {limit}')
        .replace('{remaining}', remainingGenerations)
        .replace('{limit}', currentUserLimits.limit);
    
    // Usage Chart State
    let selectedTimePeriod = '7d';
    let isDemoDataShown = false; // Track if showing demo data (not real from backend)
    
    // NEW: Import userDataStore for robust chart data handling
    import { 
        usageHistory as usageHistoryStore, 
        refreshUsageHistory 
    } from '../stores/userDataStore.js';
    
    // Reactive: Use store data (auto-updates!)
    $: chartUsageHistory = $usageHistoryStore.data || [];
    $: isLoadingChartData = $usageHistoryStore.isLoading;
    $: chartDataError = $usageHistoryStore.errorMessage;
    $: usageStats = $usageHistoryStore.stats;
    
    // Calculate total stories generated (from usage history stats or daily limit)
    // Best Practice: Use multiple sources for accuracy
    $: totalStoriesGenerated = (() => {
        // Priority 1: Use usageStats.total if available (sum of all history entries)
        // This gives the total across all days in history
        if (usageStats && typeof usageStats.total === 'number' && usageStats.total > 0) {
            return usageStats.total;
        }
        
        // Priority 2: Sum all entries in usage history if available
        if (chartUsageHistory && Array.isArray(chartUsageHistory) && chartUsageHistory.length > 0) {
            const sum = chartUsageHistory.reduce((total, entry) => {
                return total + (entry.used || 0);
            }, 0);
            if (sum > 0) {
                return sum;
            }
        }
        
        // Priority 3: Use current dailyLimit.used (today's count as fallback)
        if ($dailyLimit && typeof $dailyLimit.used === 'number') {
            return $dailyLimit.used;
        }
        
        // Fallback: 0
        return 0;
    })();
    
    // ROBUST: Watch currentAccount changes and trigger load
    // This works for BOTH soft reload AND hard reload!
    let accountUnsubscribe = null;
    
    function watchAccountChanges() {
        console.log('👀 [CHART] Setting up currentAccount watcher...');
        
        // Cleanup existing subscription if any
        if (accountUnsubscribe) {
            accountUnsubscribe();
        }
        
        accountUnsubscribe = currentAccount.subscribe(async (account) => {
            // Only proceed if logged in and account exists
            if (!account || !$isLoggedIn) {
                console.log('👀 [CHART WATCH] No account or not logged in, skipping');
                return;
            }
            
            console.log('👀 [CHART WATCH] Account changed, refreshing usage history...');
            
            // Use new robust pattern (like userCounter!)
            await refreshUsageHistory();
        });
    }
    
    // Reactive: Determine final usage history to display (real or demo)
    $: finalUsageHistory = (() => {
        // If we have real data, use it!
        if (chartUsageHistory.length > 0) {
            isDemoDataShown = false;
            console.log('✅ Using real usage data:', chartUsageHistory.length, 'entries');
            return chartUsageHistory;
        }
        
        // If logged in but no data AND not loading, show empty (will show "No Data" message)
        // Only show demo if explicitly enabled (for testing)
        if ($isLoggedIn && chartUsageHistory.length === 0 && !isLoadingChartData) {
            isDemoDataShown = false;
            console.log('📊 Logged in but no usage data available yet');
            return [];
        }
        
        // Still loading - return empty to show loading state
        if ($isLoggedIn && isLoadingChartData) {
            isDemoDataShown = false;
            console.log('⏳ Loading usage data...');
            return [];
        }
        
        // Not logged in - empty
        isDemoDataShown = false;
        console.log('📊 Not logged in, no chart data');
        return [];
    })();
    
    // Reactive: Generate chart data from final history
    $: finalChartData = generateChartData(selectedTimePeriod, finalUsageHistory);
    
    // Reactive: Generate story chart data (second line)
    $: finalStoryChartData = (() => {
        if (!finalChartData || finalChartData.length === 0) return [];
        
        const storyData = finalChartData.map(point => ({
            date: point.date,
            value: point.storyValue || 0
        }));
        
        console.log('📊 [CHART] Generated story chart data:', {
            length: storyData.length,
            firstPoint: storyData[0],
            lastPoint: storyData[storyData.length - 1],
            nonZeroValues: storyData.filter(p => p.value > 0).length,
            allValues: storyData.map(p => p.value)
        });
        
        return storyData;
    })();
    
    /**
     * Calculate optimal maxValue for chart Y-axis
     * Dynamically adjusts based on actual data, with a maximum of 100
     * Rounds up to nice numbers (9, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100)
     */
    function calculateMaxValue(chartData) {
        if (!chartData || chartData.length === 0) {
            // Default fallback
            return $accountTier === 'pro' ? 35 : 9;
        }
        
        // Find maximum value in data (consider both random and story usage)
        const maxDataValue = Math.max(
            ...chartData.map(point => Math.max(point.value || 0, point.storyValue || 0))
        );
        
        // If no data values, use default
        if (maxDataValue === 0) {
            return $accountTier === 'pro' ? 35 : 9;
        }
        
        // Round up to next nice number, but cap at 100
        const niceNumbers = [9, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100];
        
        // Find the smallest nice number that's >= maxDataValue
        const optimalMax = niceNumbers.find(num => num >= maxDataValue) || 100;
        
        // Ensure we don't exceed 100
        return Math.min(optimalMax, 100);
    }
    
    // Reactive: Calculate dynamic maxValue based on chart data
    $: chartMaxValue = calculateMaxValue(finalChartData);
    
    // Debug: Log final state
    $: {
        console.log('📊 [CHART STATE]', {
            isLoggedIn: $isLoggedIn,
            chartUsageHistoryLength: chartUsageHistory.length,
            finalUsageHistoryLength: finalUsageHistory.length,
            isDemoDataShown,
            finalChartDataLength: finalChartData?.length || 0,
            chartMaxValue,
            maxDataValue: finalChartData?.length > 0 ? Math.max(...finalChartData.map(p => p.value || 0)) : 0,
            isLoadingChartData,
            chartDataError
        });
    }
    
    /**
     * Handle manual refresh of chart data from backend
     * NEW: Uses robust userDataStore pattern (like userCounter!)
     */
    async function handleRefreshChartData() {
        console.log('🔄 [CHART REFRESH] Manual refresh triggered by user');
        
        try {
            // Force refresh (bypass cache!)
            await refreshUsageHistory(true);
            
            if (chartUsageHistory.length > 0) {
                console.log('✅ [CHART REFRESH] Loaded fresh data:', chartUsageHistory.length, 'entries');
                showSuccess($translations?.accountManager?.messages?.chartDataRefreshed || 'Chart data refreshed!', 2000);
            } else {
                console.warn('⚠️ [CHART REFRESH] No new data available');
                showInfo($translations?.accountManager?.messages?.noNewData || 'No new data available', 2000);
            }
        } catch (error) {
            console.error('❌ [CHART REFRESH] Failed to refresh:', error);
            showError($translations?.accountManager?.messages?.refreshFailed || 'Failed to refresh data', 2000);
        }
    }
    
    /**
     * Retry loading chart data
     */
    async function retryLoadChartData() {
        console.log('🔄 Retrying chart data load...');
        await refreshUsageHistory(true);
    }
    
    /**
     * Generate chart data for selected time period
     * @param {string} period - '7d', '14d', '4w', '3m'
     * @param {Array} history - Usage history array
     * @returns {Array} Filtered data for chart
     */
    function generateChartData(period, history) {
        console.log('📊 [CHART DEBUG] generateChartData() called:', {
            period,
            historyLength: history?.length,
            historyIsArray: Array.isArray(history)
        });
        
        const today = new Date();
        const data = [];

    // Determine number of days to show
    let days = 7;
    if (period === '14d') days = 14;
    if (period === '4w') days = 28;
    if (period === '3m') days = 90; // 3 months (~90 days)

        console.log('📊 [CHART DEBUG] Generating data for', days, 'days');

        // Generate data points for each day (reverse order for chart)
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Find usage for this date in history
            const historyEntry = history.find(h => h.date === dateStr);
            const value = historyEntry?.used || 0;
            const storyValue = historyEntry?.storyUsed || 0;

            data.push({
                date: dateStr,
                value: value,
                storyValue: storyValue
            });
        }

        console.log('📊 [CHART DEBUG] Generated chart data:', {
            dataPoints: data.length,
            firstPoint: data[0],
            lastPoint: data[data.length - 1],
            nonZeroPoints: data.filter(d => d.value > 0).length,
            nonZeroStoryPoints: data.filter(d => (d.storyValue || 0) > 0).length,
            storyValues: data.map(d => ({ date: d.date, storyValue: d.storyValue || 0 }))
        });

        return data;
    }

    // Magic Link verification state

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
        return $translations?.accountManager?.buttons?.createMagicLink || 'Send Code via Email';
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
        return $translations?.accountManager?.buttons?.createMagicLink || 'Send Code via Email';
    })();
    
    // Account age label for tooltip - zeigt wie lange User den Account hat (NUR Zeitangabe)
    // CRITICAL: Nur für eingeloggte User - berechnet aus createdAt
    $: accountAgeLabel = (() => {
        try {
            return $isLoggedIn 
                ? formatAccountAge(
                    daysSinceCreation, 
                    $translations?.accountManager?.accountAge || {}
                )
                : ''; // Nicht eingeloggte User verwenden freeDescription/proDescription
        } catch (error) {
            console.error('❌ [AccountManager] Error calculating accountAgeLabel:', error);
            return ''; // Fallback to empty string on error
        }
    })();
    
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
                    showSuccess($translations?.accountManager?.messages?.settingsImported || 'Settings imported successfully', 3000);
                })
                .catch((error) => {
                    showError(`${$translations?.accountManager?.messages?.importFailed || 'Import failed'}: ${error.message}`, 3000);
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
        
        // Chart state is handled by userDataStore (no manual reset needed)
        
        // Keep login history for return user functionality
        console.log('🔐 Login history preserved for return user functionality');
        
        // shouldShowSimplifiedView is now reactive, no need to set it manually
        showSuccess($translations?.accountManager?.messages?.logoutSuccess || 'Successfully logged out', 3000);
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
                console.log('✅ Account already exists, sending OTP code');
                isNewUser = false;
                showInfo($translations?.accountManager?.messages?.accountFoundSendingCode || 'Account found! Sending you a code.', 3000);
            } else {
                console.log('🆕 No existing account found, will create new account');
                isNewUser = true;
                showInfo($translations?.accountManager?.messages?.creatingNewAccount || 'Creating new account — check your email for the code.', 3000);
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
            showSuccess($translations?.accountManager?.messages?.magicLinkSent || 'Magic link sent! Check your email to complete login.', 5000);
            
            // Move to verification step + focus first digit
            accountCreationStep = 'verification';
            setTimeout(() => otpInputRefs[0]?.focus(), 120);
        } catch (error) {
            console.error('Login error:', error);
            const errorCode = error?.errorCode || '';
            const retryMin = error?.retryAfterMinutes;
            if (errorCode === 'RATE_LIMIT_EXCEEDED' || errorCode === '429') {
                const waitMsg = retryMin
                    ? `Too many attempts. Please wait ${retryMin} minutes.`
                    : 'Too many attempts. Please wait 10 minutes.';
                showError($translations?.accountManager?.login?.rateLimitExceeded || waitMsg, 10000);
            } else if (errorCode === 'INVALID_EMAIL') {
                showError($translations?.accountManager?.login?.invalidEmail || 'Please enter a valid email address.', 5000);
            } else if (errorCode === 'EMAIL_SERVICE_UNAVAILABLE' || errorCode === 'EMAIL_SEND_FAILED') {
                showError($translations?.accountManager?.login?.emailServiceError || 'Email service is currently unavailable. Please try again later.', 8000);
            } else {
                showError($translations?.accountManager?.messages?.magicLinkSendFailed || 'Failed to send code. Please try again.', 5000);
            }
        } finally {
            isSubmitting = false;
            checkingAccount = false;
        }
    }

    function resendMagicLink() {
        otpCode = '';
        otpDigits = ['', '', '', '', '', '', ''];
        otpError = '';
        handleLogin(new Event('submit'));
    }

    async function handleOTPSubmit(event) {
        if (event) event.preventDefault();
        if (isVerifyingOTP) return;

        const clean = String(otpCode || '').replace(/\s/g, '');
        if (!/^\d{7}$/.test(clean)) {
            otpError = $translations?.accountManager?.verification?.codeError || 'Please enter the 7-digit code.';
            return;
        }

        otpError = '';
        isVerifyingOTP = true;

        try {
            await secureVerifyOTP(clean, email);
            markSuccessfulLogin(email);
            checkSessionStatus();
        } catch (error) {
            console.error('❌ OTP verification failed:', error);
            const errorCode = error?.errorCode || '';
            const msg = error.message || '';
            if (msg.includes('already') || msg.includes('exists') || msg.includes('logged in')) {
                checkSessionStatus();
            } else if (errorCode === 'CODE_EXPIRED') {
                otpError = $translations?.accountManager?.verification?.codeExpired || 'This code has expired. Please request a new one.';
                showError(otpError, 6000);
                otpDigits = ['', '', '', '', '', '', ''];
                setTimeout(() => otpInputRefs[0]?.focus(), 50);
            } else if (errorCode === 'CODE_INVALID' || errorCode === 'INVALID_CODE_FORMAT') {
                otpError = $translations?.accountManager?.verification?.codeInvalid || 'Invalid code. Please check and try again.';
                showError(otpError, 5000);
                otpDigits = ['', '', '', '', '', '', ''];
                setTimeout(() => otpInputRefs[0]?.focus(), 50);
            } else if (errorCode === 'SERVICE_UNAVAILABLE') {
                otpError = $translations?.accountManager?.verification?.serviceUnavailable || 'Verification service unavailable. Please try again later.';
                showError(otpError, 8000);
            } else {
                otpError = $translations?.accountManager?.verification?.codeInvalid || 'Invalid or expired code. Please request a new one.';
                showError(otpError, 5000);
                otpDigits = ['', '', '', '', '', '', ''];
                setTimeout(() => otpInputRefs[0]?.focus(), 50);
            }
        } finally {
            isVerifyingOTP = false;
        }
    }

    onMount(async () => {
        try {
            console.log('🔄 AccountManager: Component mounted');
            
            // Initialize account from cookies
            console.log('🔐 AccountManager: Initializing account from cookies...');
            const accountRestored = await initializeAccountFromCookies();
            console.log('🔐 AccountManager: Account restoration result:', accountRestored);
            
            // REMOVED: Daily limit initialization (now handled centrally by dailyUsageStore.js in LanguageRouter)
            // The dailyLimit store is now managed by initializeDailyUsage() which runs on app start
            console.log('✅ AccountManager: Using centralized daily usage tracking');
            console.log('📊 Current daily limits:', $dailyLimit);
            
            // Chart loading is handled by watchAccountChanges() and onMount refreshUsageHistory()
            // No manual forcing needed with new robust pattern!
            
            // OTP flow: no URL-parameter verification needed — user enters code manually
            console.log('🔑 OTP auth flow active — awaiting manual code entry');
            
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
            // name-Priorität: metadata.name > metadata.settings.name > profile.name > account.name
            if ($currentAccount?.email) {
                email = $currentAccount.email;
                const meta = $currentAccount.metadata || {};
                const metaSettings = meta.settings || {};
                const prof = $currentAccount.profile || {};
                name = meta.name || metaSettings.name || prof.name || $currentAccount.name || '';
            }
            
            // Setup chart watcher
            console.log('🔄 [CHART] Setting up watchers...');
            watchAccountChanges();
            
            // Initial chart load (uses cache if valid!)
            if ($isLoggedIn) {
                console.log('🔄 [CHART] Initial data load on mount...');
                await refreshUsageHistory();
            }
            
            // Add global click listener for context menu
            document.addEventListener('click', handleClickOutside);
            
            return () => {
                // Cleanup: Remove event listener
                document.removeEventListener('click', handleClickOutside);
                
                // Cleanup: Unsubscribe from account store
                if (accountUnsubscribe) {
                    accountUnsubscribe();
                    accountUnsubscribe = null;
                }
            };
            
        } catch (error) {
            console.error('❌ AccountManager onMount error:', error);
            // Ensure cleanup even on error
            if (accountUnsubscribe) {
                accountUnsubscribe();
                accountUnsubscribe = null;
            }
        }
    });
    
    // Cleanup on component destroy (safety net)
    onDestroy(() => {
        if (accountUnsubscribe) {
            accountUnsubscribe();
            accountUnsubscribe = null;
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
                                    width={null}
                                    intro={true}
                                    introDelay={2000}
                                    introDuration={4000}
                                />

                                <div class="relative context-menu">
                                    <button
                                        on:click={toggleContextMenu}
                                        class="p-2 rounded-full bg-powder-300 dark:bg-aubergine-950 text-gray-700 dark:text-white hover:bg-creme-600 dark:hover:bg-aubergine-900 focus:bg-creme-600 dark:focus:bg-aubergine-900 active:bg-creme-700 dark:active:bg-aubergine-800 transition-all transform hover:scale-105 focus:scale-105 active:scale-95"
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
                        <div class="bg-powder-300 dark:bg-aubergine-900 rounded-xl p-4 mb-6">
                            <!-- Header with Time Period Selector & Refresh Button -->
                            <div class="flex justify-between items-center mb-6 z-10">
                                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {$translations?.accountManager?.dailyGenerations || 'Daily Generations'}
                                </span>
                                <div class="flex items-center gap-2">
                                    <!-- Time Period Buttons (rounded-full, optimized colors) -->
                                    <div class="inline-flex gap-1">
                                        {#each ['7d', '14d', '4w', '3m'] as period}
                                            <button
                                                on:click={() => selectedTimePeriod = period}
                                                class="px-3 py-1 text-xs font-semibold rounded-full transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-aubergine-900 {
                                                    selectedTimePeriod === period 
                                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-aubergine-900 shadow-md' 
                                                        : 'bg-white/50 dark:bg-aubergine-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-aubergine-800/80 shadow-sm'
                                                }"
                                                aria-label="Show {period === '7d' ? '7 days' : period === '14d' ? '14 days' : period === '4w' ? '4 weeks' : '3 months'}"
                                                title="{period === '7d' ? 'Last 7 Days' : period === '14d' ? 'Last 14 Days' : period === '4w' ? 'Last 4 Weeks' : 'Last 3 Months'}"
                                            >
                                                {period === '3m' ? '3M' : period.toUpperCase()}
                                            </button>
                                        {/each}
                                    </div>
                                    
                                    <!-- Refresh Button (like FREE badge, small, semi-transparent) -->
                                    <button
                                        on:click={handleRefreshChartData}
                                        disabled={isLoadingChartData}
                                        class="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-600/20 dark:bg-yellow-600/30 text-yellow-700 dark:text-yellow-400 border border-yellow-600/30 dark:border-yellow-600/40 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-aubergine-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                        aria-label="Refresh chart data from backend"
                                        title="Refresh chart data"
                                    >
                                        <span class="{isLoadingChartData ? 'animate-spin' : ''}" style="display: inline-block;">
                                            🔄
                                </span>
                                    </button>
                            </div>
                            </div>
                            
                            <!-- Line Chart Container -->
                            <div class="w-full">
                                {#if isLoadingChartData}
                                    <!-- Loading Skeleton -->
                                    <ChartSkeleton height={200} />
                                {:else if chartDataError}
                                    <!-- Error State -->
                                    <div 
                                        class="flex flex-col items-center justify-center h-48 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6"
                                        in:fade={{ duration: 300 }}
                                    >
                                        <div class="text-4xl mb-3">❌</div>
                                        <h4 class="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                                            Fehler beim Laden
                                        </h4>
                                        <p class="text-sm text-red-600 dark:text-red-400 mb-4 text-center">
                                            {chartDataError}
                                        </p>
                                        <Button
                                            on:click={retryLoadChartData}
                                            variant="primary"
                                            size="sm"
                                        >
                                            🔄 Erneut versuchen
                                        </Button>
                                    </div>
                                {:else if finalUsageHistory.length === 0 && !isLoadingChartData && $isLoggedIn}
                                    <!-- No Data State (nur wenn wirklich KEINE Daten UND eingeloggt UND nicht am Laden!) -->
                                    <div 
                                        class="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-aubergine-900 rounded-lg border border-gray-200 dark:border-aubergine-700 p-4"
                                        in:fade={{ duration: 300 }}
                                    >
                                        <div class="text-5xl mb-3">📊</div>
                                        <h4 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                            {$translations?.accountManager?.statistics?.noDataTitle || 'No Data'}
                                        </h4>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                                            {$translations?.accountManager?.statistics?.noDataMessage || 'Generate emojis to collect your real usage data and display it here.'}
                                        </p>
                                        <!-- Refresh Button -->
                                        <button
                                            on:click={() => refreshUsageHistory(true)}
                                            disabled={chartDataError || isLoadingChartData}
                                            class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-black text-sm font-medium rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 shadow-md"
                                            title="Refresh usage data"
                                            aria-label="Refresh usage data"
                                        >
                                            {#if isLoadingChartData}
                                                <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>{$translations?.accountManager?.statistics?.loading || 'Loading...'}</span>
                                            {:else}
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span>{$translations?.accountManager?.statistics?.refreshButton || 'Refresh'}</span>
                                            {/if}
                                        </button>
                                    </div>
                                {:else}
                                    <!-- Chart Container (Relative positioning for overlay) -->
                                    <div class="relative min-h-[280px] flex items-center justify-center -mx-4" in:fade={{ duration: 400 }}>
                                        <!-- Background Chart -->
                                        <LineChart 
                                            data={finalChartData}
                                            data2={finalStoryChartData}
                                            maxValue={chartMaxValue}
                                            height={240}
                                            color={isDemoDataShown ? '#f97316' : ($accountTier === 'pro' ? '#a855f7' : '#eab308')}
                                            color2="#2563eb"
                                            label="Random Emoji"
                                            label2="Story Generations"
                                            animate={true}
                                        />
                                        
                                        {#if isDemoDataShown}
                                            <!-- Demo Data Overlay - Full Height Centered -->
                                            <div 
                                                class="absolute w-96 h-48 mx-auto inset-0 flex items-center justify-center backdrop-blur-2xl rounded-lg bg-white/70 dark:bg-aubergine-900/70"
                                                transition:fade={{ duration: 300 }}
                                            >
                                                <!-- Centered Content Card with Strong Shadows -->
                                                <div class="bg-creme-80 dark:bg-aubergine-80 backdrop-filter backdrop-blur-md rounded-lg text-center px-8 py-9 mt-9 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_8px_24px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.95),0_10px_30px_rgba(0,0,0,0.65),0_4px_15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
                                                    <!-- Icon -->
                                                    <div class="text-6xl mb-5">📊</div>
                                                    
                                                    <!-- Title -->
                                                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                        {$translations?.accountManager?.demoChart?.title || 'Demo Preview'}
                                                    </h3>
                                                    
                                                    <!-- Description -->
                                                    <p class="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-sm mx-auto">
                                                        {$translations?.accountManager?.demoChart?.description || 'This is a demo preview. Generate emojis to collect your real usage data and display it here.'}
                                                    </p>
                                                    
                                                    <!-- CTA Button -->
                                                    <button
                                                        on:click={() => navigate('/')}
                                                        class="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:from-yellow-600 focus:to-orange-600 active:from-yellow-700 active:to-orange-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 dark:focus:ring-yellow-500/50 shadow-lg hover:shadow-xl"
                                                        aria-label={$translations?.accountManager?.demoChart?.cta || 'Jetzt Emojis generieren'}
                                                    >
                                                        <span class="mr-2">🎲</span>
                                                        {$translations?.accountManager?.demoChart?.cta || 'Jetzt Emojis generieren'}
                                                    </button>
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                            
                            <!-- Progress Bar with Inline Counter (UX Best Practice) -->
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex-1 mr-3">
                                    <div class="w-full bg-gray-300 dark:bg-aubergine-600 rounded-full h-3">
                                <div 
                                    class="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                                    style="width: {currentUserLimits.limit > 0 ? Math.min(100, (remainingGenerations / currentUserLimits.limit) * 100) : 0}%"
                                ></div>
                                    </div>
                                </div>
                                <span class="text-sm font-bold text-yellow-600 dark:text-yellow-400 tabular-nums">
                                    {dailyLimitDisplay}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {remainingGenerations > 0 ? ($translations?.accountManager?.canStillGenerate || 'You can still generate emojis!') : ($translations?.accountManager?.limitReached || 'Daily limit reached. Upgrade to PRO for unlimited generations.')}
                            </p>
                        </div>

                        <!-- Account Statistics -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 tabular-nums">
                                    {totalStoriesGenerated}
                                </div>
                                <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    {$translations?.accountManager?.statistics?.storiesGenerated || 'Stories Generated'}
                                </div>
                            </div>
                            <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
                                <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 tabular-nums">
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
                        <div class="text-center mt-6 space-y-3 pb-1">
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
                                {$translations?.accountManager?.actions?.backToHome || '← Back to Home'}
                            </Button>
                            {/if}

                            <!-- Privacy link -->
                            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-aubergine-700">
                                <p class="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                                    <a
                                        href="/{$currentLanguage || 'en'}/privacy"
                                        class="text-yellow-500 hover:text-yellow-400 underline transition-colors"
                                    >
                                        {$translations?.accountManager?.privacyLink || 'Privacy Policy & Data Rights'}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                {:else if accountCreationStep === 'verification'}
                    <!-- OTP Verification Step -->
                    <div class="space-y-5">

                        <!-- Smart Label -->
                        <div class="text-center space-y-1">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isNewUser
                                    ? ($translations?.accountManager?.verification?.titleNew || 'Registration Code')
                                    : ($translations?.accountManager?.verification?.titleReturn || 'Login Code')}
                            </p>
                            <p class="text-xs text-gray-400 dark:text-gray-500">
                                {$translations?.accountManager?.verification?.sentTo || 'Code sent to'}
                                <strong class="text-gray-600 dark:text-gray-300">{email}</strong>
                            </p>
                        </div>

                        <!-- 7-Digit OTP Boxes -->
                        <form on:submit|preventDefault={handleOTPSubmit}>
                            <fieldset disabled={isVerifyingOTP} class="border-0 p-0 m-0">
                                <legend class="sr-only">{$translations?.accountManager?.verification?.codeLabel || '7-digit confirmation code'}</legend>

                                <!-- Digit boxes -->
                                <div class="flex items-center justify-center gap-2 mb-4">
                                    {#each otpDigits as digit, i}
                                        <input
                                            id="otp-digit-{i}"
                                            bind:this={otpInputRefs[i]}
                                            type="text"
                                            inputmode="numeric"
                                            autocomplete="off"
                                            autocorrect="off"
                                            autocapitalize="off"
                                            spellcheck="false"
                                            data-form-type="other"
                                            maxlength="1"
                                            value={digit}
                                            on:input={(e) => handleOTPDigitInput(i, e)}
                                            on:keydown={(e) => handleOTPDigitKeydown(i, e)}
                                            on:focus={(e) => e.target.select()}
                                            aria-label="Ziffer {i + 1} von 7"
                                            class="otp-digit w-10 h-12 text-center text-xl font-bold
                                                   rounded-xl border-2 transition-all duration-200
                                                   focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                                                   disabled:opacity-50 disabled:cursor-not-allowed
                                                   {otpError
                                                     ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/60 text-gray-900 dark:text-red-200 focus:ring-red-400'
                                                     : digit
                                                       ? 'border-yellow-400 dark:border-yellow-400 bg-white dark:bg-aubergine-800 text-gray-900 dark:text-white'
                                                       : 'border-gray-300 dark:border-aubergine-600 bg-white dark:bg-aubergine-900 text-gray-900 dark:text-white'}"
                                        />
                                    {/each}
                                </div>

                                <!-- Inline Error -->
                                {#if otpError}
                                    <div class="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                                        <svg class="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                        <p class="text-xs font-medium text-red-600 dark:text-red-400">{otpError}</p>
                                    </div>
                                {/if}

                                <!-- Submit Button -->
                                <Button
                                    variant="primary"
                                    size="md"
                                    fullWidth={true}
                                    disabled={isVerifyingOTP || otpCode.length !== 7}
                                    type="submit"
                                >
                                    {#if isVerifyingOTP}
                                        <span class="animate-spin mr-2">⏳</span>
                                        {$translations?.accountManager?.verification?.verifying || 'Verifying...'}
                                    {:else}
                                        {$translations?.accountManager?.verification?.submitCode || '✅ Confirm code'}
                                    {/if}
                                </Button>
                            </fieldset>
                        </form>

                        <!-- Hinweis-Box (passend zur Help Section im Rest der App) -->
                        <div class="flex gap-3 p-3 bg-creme-600 dark:bg-aubergine-900 rounded-xl border border-creme-700 dark:border-aubergine-800">
                            <span class="text-base shrink-0 mt-0.5" aria-hidden="true">📬</span>
                            <div class="space-y-1 min-w-0">
                                <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {$translations?.accountManager?.help?.spamFolder || 'Check your spam folder if the email does not arrive'}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-500">
                                    {$translations?.accountManager?.help?.codeExpiry || 'The code is valid for 15 minutes'}
                                    ·
                                    {$translations?.accountManager?.help?.noLink || 'No link click needed'}
                                </p>
                            </div>
                        </div>

                        <!-- Resend + Back -->
                        <div class="flex flex-col gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                fullWidth={true}
                                on:click={resendMagicLink}
                                disabled={isSubmitting || isVerifyingOTP}
                            >
                                {#if isSubmitting}
                                    <span class="animate-spin mr-1">⏳</span>
                                    {$translations?.accountManager?.buttons?.sendingMagicLink || 'Wird gesendet...'}
                                {:else}
                                    {$translations?.accountManager?.buttons?.resendMagicLink || '🔄 Resend code'}
                                {/if}
                            </Button>

                            <Button
                                variant="secondary"
                                size="sm"
                                fullWidth={true}
                                on:click={goBackToBenefits}
                            >
                                {$translations?.accountManager?.buttons?.backToAccountOptions || '← Back'}
                            </Button>
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
                                    class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10 hover:scale-105 focus:scale-105 active:scale-95"
                                        on:click={() => selectAccountType('free')}
                                    aria-label={$translations?.accountManager?.tiers?.free || 'Select Free account'}
                                    title={$translations?.accountManager?.freeDescription || 'Free account'}
                                    >
                                        <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                                            {$translations?.accountManager?.tiers?.free || 'FREE'}
                                        </span>
                                                                            <span class="text-xs transition-colors duration-300 text-yellow-600">
                                        {$translations?.accountManager?.freeDescription || '✨ Free Security'}
                                    </span>
                                </button>
                                <button
                                    class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10 hover:scale-105 focus:scale-105 active:scale-95"
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
                        <div class="relative mb-5 z-10 grid" role="tabpanel" aria-live="polite">
                            <!-- FREE Benefits -->
                            {#if showBenefitsToggle === 'free'}
                                <div 
                                    class="space-y-4 col-start-1 row-start-1"
                                    in:fade={{ duration: 350, easing: (t) => t * (2 - t) }}
                                    out:fade={{ duration: 250, easing: (t) => t * t }}
                                    role="region"
                                    aria-label="Free tier benefits"
                                >
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
                            {/if}

                            <!-- PRO Benefits -->
                            {#if showBenefitsToggle === 'pro'}
                                <div 
                                    class="space-y-4 col-start-1 row-start-1"
                                    in:fade={{ duration: 350, easing: (t) => t * (2 - t) }}
                                    out:fade={{ duration: 250, easing: (t) => t * t }}
                                    role="region"
                                    aria-label="Pro tier benefits"
                                >
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
                            {/if}
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
                                    <span class="mr-1.5">🔐</span>{magicLinkButtonText}
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
                                        {$isLoggedIn ? accountAgeLabel : ($translations?.accountManager?.freeDescription || '✨ Free Security')}
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
                                        {$isLoggedIn ? accountAgeLabel : ($translations?.accountManager?.proDescription || '💎 Enterprise Security')}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Benefits Content -->
                    <div class="relative mb-5 grid" role="tabpanel" aria-live="polite">
                        <!-- FREE Benefits -->
                        {#if showBenefitsToggle === 'free'}
                            <div 
                                class="space-y-4 col-start-1 row-start-1"
                                in:fade={{ duration: 350, easing: (t) => t * (2 - t) }}
                                out:fade={{ duration: 250, easing: (t) => t * t }}
                                role="region"
                                aria-label="Free tier benefits"
                            >
                                {#each Object.entries($translations?.accountManager?.benefits?.free || {}) as [key, value]}
                                    {#if !key.endsWith('Desc')}
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-yellow-600 dark:text-yellow-400 text-2xl">
                                                {key === 'dailyGenerations' ? '✓' : 
                                                 key === 'decentralizedData' ? '🤖' : 
                                                 key === 'webApp' ? '📱' : '✓'}
                                            </span>
                                        </div>
                                        <div>
                                            <span class="text-md font-bold text-black dark:text-white">{value}</span>
                                            <p class="text-gray-600 dark:text-gray-400">
                                                {#if key === 'decentralizedData'}
                                                    {@const desc = $translations?.accountManager?.benefits?.free?.[key + 'Desc'] || ''}
                                                    {@const parts = desc.split('Apertus')}
                                                    {#if parts.length > 1}
                                                        {parts[0]}
                                                        <a 
                                                            href="https://publicai.co/apertus" 
                                                            target="_blank" 
                                                            rel="noopener noreferrer nofollow"
                                                            class="inline-flex items-center gap-1 text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-500 underline transition-colors duration-200"
                                                            aria-label="Apertus LLM Documentation (opens in new tab)"
                                                            title="Apertus LLM - Official Documentation">
                                                            <span>Apertus</span>
                                                            <ExternalLinkIcon />
                                                        </a>
                                                        {parts[1]}
                                                    {:else}
                                                        {desc}
                                                    {/if}
                                                {:else}
                                                    {$translations?.accountManager?.benefits?.free?.[key + 'Desc'] || ''}
                                                {/if}
                                            </p>
                                        </div>
                                    </div>
                                    {/if}
                                {/each}
                            </div>
                        {/if}

                        <!-- PRO Benefits -->
                        {#if showBenefitsToggle === 'pro'}
                            <div 
                                class="space-y-4 col-start-1 row-start-1"
                                in:fade={{ duration: 350, easing: (t) => t * (2 - t) }}
                                out:fade={{ duration: 250, easing: (t) => t * t }}
                                role="region"
                                aria-label="Pro tier benefits"
                            >
                                {#each Object.entries($translations?.accountManager?.benefits?.pro || {}) as [key, value]}
                                    {#if !key.endsWith('Desc')}
                                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-100 to-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-200 dark:from-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-800 dark:to-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                                            <span class="text-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-600 dark:text-{key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}-400 text-2xl">
                                                {key === 'unlimitedGenerations' ? '∞' : 
                                                 key === 'aiThreatDetection' ? '🧠' : 
                                                 key === 'prioritySupport' ? '⚡' : 
                                                 key === 'browserExtension' ? '🤖' : 
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
                        {/if}
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
                                    <span class="mr-1.5">🔐</span>{magicLinkButtonText}
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
                        <div class="flex items-center justify-center space-x-6 text-[12px] md:text-sm text-gray-500 dark:text-gray-400">
                            <span class="flex items-center">
                                🔐 {$translations?.accountManager?.footer?.magicLink || 'Easy Login'}
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