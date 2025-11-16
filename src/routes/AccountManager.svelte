<!-- src/routes/AccountManager.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { navigate } from '../utils/routing';
    import { fade, fly, slide } from 'svelte/transition';
    import PageLayout from '../components/Layout/PageLayout.svelte';
    // Footer wird automatisch über Layout-Konfiguration gerendert
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
        // Sichere Accounting-Funktionen
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
    import UserSettings from '../components/UserSettings.svelte';
    import { isDevelopment } from '../utils/environment';
    // Feature Components
    import AccountHeader from '../components/Features/AccountHeader.svelte';
    import DailyLimitChart from '../components/Features/DailyLimitChart.svelte';
    import AccountStatistics from '../components/Features/AccountStatistics.svelte';
    import AccountBenefits from '../components/Features/AccountBenefits.svelte';
    import AccountCreationForm from '../components/Features/AccountCreationForm.svelte';
    import VerificationStep from '../components/Features/VerificationStep.svelte';
    import ReturnUserView from '../components/Features/ReturnUserView.svelte';
    import { validateUserLimits } from '../config/limits';
    import { sendAnalyticsEvent } from '../stores/appStores';
    import Button from '../components/UI/Button.svelte';
    import { getDaysSinceAccountCreation, formatAccountAge } from '../utils/accountHelpers';
    import { generateBenefitsStructuredData, injectStructuredData, formatCanonicalUrl } from '../utils/seo';

    // Reaktive PageLayout Props - dynamisch basierend auf Account-Status (Svelte 5 Runes)
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
            // Get user name from multiple sources with smart fallback (Priority Order!)
            const currentSettingsValue = get(currentSettings);
            const userProfileValue = get(userProfile);
            const currentAccountValue = get(currentAccount);
            const userName = 
                currentSettingsValue?.name ||        // 1. Current settings (from input, highest priority!)
                userProfileValue?.name ||            // 2. User profile store
                currentAccountValue?.name ||         // 3. Current account
                currentAccountValue?.profile?.name || // 4. Account profile
                (currentAccountValue?.email ? currentAccountValue.email.split('@')[0] : null) || // 5. Email prefix
                'there'; // 6. Friendly fallback instead of "User"
            
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

    // Toggle state (Svelte 5 Runes)
    let showBenefitsToggle = $state<'free' | 'pro'>('free');
    let email = $state('');
    let name = $state('');
    let showProfileForm = $state(false);
    let isSubmitting = $state(false);
    let accountCreationStep = $state<'benefits' | 'form' | 'verification' | null>(null);
    let selectedAccountType = $state<'free' | 'pro'>('free');

    // Session management
    let accountExists = $state(false);
    let checkingAccount = $state(false);
    let sessionExpired = $state(false);
    let hasValidSession = $state(false);
    
    // Reactive calculation for days since account creation (Svelte 5 Runes)
    // Übergebe currentAccount damit API-Daten (Google Sheets) bevorzugt werden!
    let daysSinceCreation = $derived(getDaysSinceAccountCreation(get(currentAccount)));
    
    // Generate and inject structured data for benefits (Rich Elements for SEO) (Svelte 5 Runes)
    $effect(() => {
        const t = get(translations);
        const isLoggedInValue = get(isLoggedIn);
        if (t?.accountManager?.benefits && !isLoggedInValue && accountCreationStep === 'benefits') {
        try {
            const canonicalUrl = formatCanonicalUrl(window.location.pathname);
            const benefitsStructuredData = generateBenefitsStructuredData(
                t.accountManager.benefits,
                get(currentLanguage),
                canonicalUrl
            );
            injectStructuredData(benefitsStructuredData);
        } catch (error) {
            console.warn('⚠️ Failed to inject benefits structured data:', error);
        }
        }
    });
    
    // Debug: Log when daysSinceCreation changes (Svelte 5 Runes)
    $effect(() => {
        if (daysSinceCreation !== undefined) {
            const currentAccountValue = get(currentAccount);
            const isLoggedInValue = get(isLoggedIn);
            console.log('🔄 [AccountManager] daysSinceCreation updated:', {
                daysSinceCreation,
                createdAt: currentAccountValue?.createdAt,
                createdAtType: typeof currentAccountValue?.createdAt,
                hasCurrentAccount: !!currentAccountValue,
                isLoggedIn: isLoggedInValue
            });
            const t = get(translations);
            const label = isLoggedInValue ? formatAccountAge(daysSinceCreation, t?.accountManager?.accountAge) : '';
            console.log('🔄 [AccountManager] accountAgeLabel will be:', label);
        }
    });
    
    // Return user view state (Svelte 5 Runes)
    let hasLoggedInBefore = $state(false);
    
    // State for expanded view (Svelte 5 Runes)
    let showExpandedView = $state(false);
    
    // Check if user has navigated away from initial load (stored in sessionStorage)
    let hasNavigatedAway = $state(sessionStorage.getItem('hasNavigatedAway') === 'true');
    
    // Reactive simplified view logic (Svelte 5 Runes)
    let shouldShowSimplifiedView = $derived.by(() => {
        // Check if user is not logged in but has login history
        const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
        const loggedIn = isLoggedIn;
        
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
    });
    
    // Reactive daily limit calculation (Svelte 5 Runes)
    let currentUserLimits = $derived.by(() => {
        const isLoggedInValue = get(isLoggedIn);
        const accountTierValue = get(accountTier);
        const dailyLimitValue = get(dailyLimit);
        return validateUserLimits(isLoggedInValue, accountTierValue, dailyLimitValue?.used || 0);
    });
    // Use remainingGenerations from dailyUsageStore (single source of truth)
    let remainingGenerations = $derived(get(remainingGenerationsStore));
    let dailyLimitDisplay = $derived.by(() => {
        const t = get(translations);
        return (t?.accountManager?.remainingDisplay || '{remaining} / {limit}')
            .replace('{remaining}', remainingGenerations)
            .replace('{limit}', currentUserLimits.limit);
    });
    
    // Usage Chart State (Svelte 5 Runes)
    let selectedTimePeriod = $state<'7d' | '14d' | '4w' | '3m'>('7d');
    let isDemoDataShown = $state(false); // Track if showing demo data (not real from backend)
    
    // NEW: Import userDataStore for robust chart data handling
    import { 
        usageHistory as usageHistoryStore, 
        refreshUsageHistory 
    } from '../stores/userDataStore';
    
    // Reactive: Use store data (auto-updates!) (Svelte 5 Runes)
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
    
    // Calculate total stories generated (from usage history stats or daily limit)
    // Best Practice: Use multiple sources for accuracy (Svelte 5 Runes)
    let totalStoriesGenerated = $derived.by(() => {
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
    });
    
    // ROBUST: Watch currentAccount changes and trigger load
    // This works for BOTH soft reload AND hard reload!
    function watchAccountChanges() {
        console.log('👀 [CHART] Setting up currentAccount watcher...');
        
        currentAccount.subscribe(async (account) => {
            // Only proceed if logged in and account exists
            const isLoggedInValue = get(isLoggedIn);
            if (!account || !isLoggedInValue) {
                console.log('👀 [CHART WATCH] No account or not logged in, skipping');
                return;
            }
            
            console.log('👀 [CHART WATCH] Account changed, refreshing usage history...');
            
            // Use new robust pattern (like userCounter!)
            await refreshUsageHistory();
        });
    }
    
    // CRITICAL: Setup watcher on mount, cleanup on destroy
    onMount(async () => {
        console.log('🔄 [CHART] Component mounted, setting up watchers...');
        watchAccountChanges();
        
        // Initial load (uses cache if valid!)
        const isLoggedInValue = get(isLoggedIn);
        if (isLoggedInValue) {
            console.log('🔄 [CHART] Initial data load on mount...');
            await refreshUsageHistory();
        }
    });
    
    // Reactive: Determine final usage history to display (real or demo) (Svelte 5 Runes)
    let finalUsageHistory = $derived.by(() => {
        // If we have real data, use it!
        if (chartUsageHistory.length > 0) {
            isDemoDataShown = false;
            console.log('✅ Using real usage data:', chartUsageHistory.length, 'entries');
            return chartUsageHistory;
        }
        
        // If logged in but no data AND not loading, show empty (will show "No Data" message)
        // Only show demo if explicitly enabled (for testing)
        const isLoggedInValue = get(isLoggedIn);
        if (isLoggedInValue && chartUsageHistory.length === 0 && !isLoadingChartData) {
            isDemoDataShown = false;
            console.log('📊 Logged in but no usage data available yet');
            return [];
        }
        
        // Still loading - return empty to show loading state
        if (isLoggedInValue && isLoadingChartData) {
            isDemoDataShown = false;
            console.log('⏳ Loading usage data...');
            return [];
        }
        
        // Not logged in - empty
        isDemoDataShown = false;
        console.log('📊 Not logged in, no chart data');
        return [];
    });
    
    // Reactive: Generate chart data from final history (Svelte 5 Runes)
    let finalChartData = $derived(generateChartData(selectedTimePeriod, finalUsageHistory));
    
    // Reactive: Generate story chart data (second line) (Svelte 5 Runes)
    let finalStoryChartData = $derived.by(() => {
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
    });
    
    /**
     * Calculate optimal maxValue for chart Y-axis
     * Dynamically adjusts based on actual data, with a maximum of 100
     * Rounds up to nice numbers (9, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100)
     */
    function calculateMaxValue(chartData: Array<{ value?: number; storyValue?: number }>) {
        if (!chartData || chartData.length === 0) {
            // Default fallback
            const accountTierValue = get(accountTier);
            return accountTierValue === 'pro' ? 35 : 9;
        }
        
        // Find maximum value in data (consider both random and story usage)
        const maxDataValue = Math.max(
            ...chartData.map(point => Math.max(point.value || 0, point.storyValue || 0))
        );
        
        // If no data values, use default
        if (maxDataValue === 0) {
            const accountTierValue = get(accountTier);
            return accountTierValue === 'pro' ? 35 : 9;
        }
        
        // Round up to next nice number, but cap at 100
        const niceNumbers = [9, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100];
        
        // Find the smallest nice number that's >= maxDataValue
        const optimalMax = niceNumbers.find(num => num >= maxDataValue) || 100;
        
        // Ensure we don't exceed 100
        return Math.min(optimalMax, 100);
    }
    
    // Reactive: Calculate dynamic maxValue based on chart data (Svelte 5 Runes)
    let chartMaxValue = $derived(calculateMaxValue(finalChartData));
    
    // Debug: Log final state (Svelte 5 Runes)
    $effect(() => {
        console.log('📊 [CHART STATE]', {
            isLoggedIn: get(isLoggedIn),
            chartUsageHistoryLength: chartUsageHistory.length,
            finalUsageHistoryLength: finalUsageHistory.length,
            isDemoDataShown,
            finalChartDataLength: finalChartData?.length || 0,
            chartMaxValue,
            maxDataValue: finalChartData?.length > 0 ? Math.max(...finalChartData.map(p => p.value || 0)) : 0,
            isLoadingChartData,
            chartDataError
        });
    });
    
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
                const t = get(translations);
                showSuccess(t?.accountManager?.messages?.chartDataRefreshed || 'Chart data refreshed!', 2000);
            } else {
                console.warn('⚠️ [CHART REFRESH] No new data available');
                showInfo(t?.accountManager?.messages?.noNewData || 'No new data available', 2000);
            }
        } catch (error) {
            console.error('❌ [CHART REFRESH] Failed to refresh:', error);
            const t = get(translations);
            showError(t?.accountManager?.messages?.refreshFailed || 'Failed to refresh data', 2000);
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
    function generateChartData(period: string, history: Array<{ date: string; used?: number; storyUsed?: number }>) {
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

    // Magic Link verification state (Svelte 5 Runes)
    let isVerifyingMagicLink = $state(false);
    let magicLinkStatus = $state<'verifying' | 'success' | 'error' | null>(null);
    let magicLinkError = $state('');

    // Context menu state (Svelte 5 Runes)
    let showContextMenu = $state(false);
    let fileInput: HTMLInputElement | null = $state(null);

    // Email validation
    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // Form validation (Svelte 5 Runes)
    let isEmailValid = $derived(validateEmail(email));
    let isNameValid = $derived(name.trim().length >= 2);
    let isFormValid = $derived(isEmailValid && (showProfileForm ? isNameValid : true));
    
    // Email validation for Magic Link button - konsistent mit isEmailValid (Svelte 5 Runes)
    let isEmailValidForMagicLink = $derived(isEmailValid);
    
    // Magic Link button text with emoji (Svelte 5 Runes)
    let magicLinkButtonText = $derived.by(() => {
        const t = get(translations);
        if (hasValidSession) {
            return t?.accountManager?.buttons?.loginToAccount || 'Login to Account';
        }
        return t?.accountManager?.buttons?.createMagicLink || '🔗 Create Magic Link';
    });

    // Ensure we always have a valid name for the API
    function getValidName() {
        const trimmedName = name.trim();
        if (trimmedName.length >= 2) {
            return trimmedName;
        }
        // Fallback to email username or default
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
        // Mark that user has navigated away from initial load
        hasNavigatedAway = true;
        sessionStorage.setItem('hasNavigatedAway', 'true');
        console.log('🔄 User navigated away - hasNavigatedAway set to true');
        navigate('/', { replace: true });
    }
    
    // Return user view functions
    function checkUserLoginHistory() {
        const history = storageHelpers.get(STORAGE_KEYS.LOGIN_HISTORY);
        const loggedIn = isLoggedIn;
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
    
    function markSuccessfulLogin(email: string) {
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
    
    // Account age label for tooltip - zeigt wie lange User den Account hat (NUR Zeitangabe)
    // CRITICAL: Nur für eingeloggte User - berechnet aus createdAt (Svelte 5 Runes)
    let accountAgeLabel = $derived.by(() => {
        const isLoggedInValue = get(isLoggedIn);
        const t = get(translations);
        return isLoggedInValue 
            ? formatAccountAge(
                daysSinceCreation, 
                t?.accountManager?.accountAge
            )
            : ''; // Nicht eingeloggte User verwenden freeDescription/proDescription
    });
    
    // Tier badge text - zeigt NUR den Tier-Status (Svelte 5 Runes)
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
        const t = get(translations);
        showSuccess(t?.accountManager?.messages?.settingsReset || 'Settings reset to default', 3000);
        closeContextMenu();
    }

    // Handle settings export
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

    // Handle settings import
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
        const t = get(translations);
        showSuccess(t?.accountManager?.messages?.logoutSuccess || 'Successfully logged out', 3000);
        closeContextMenu();
        
        // Route zur Startseite nach Logout
        setTimeout(() => {
            navigateToHome();
        }, 1000);
    }

    async function handleLogin(event: Event) {
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
                const t = get(translations);
                showInfo(t?.accountManager?.messages?.accountFoundSendingLink || 'Account found! Sending magic link to existing account.', 3000);
            } else {
                console.log('🆕 No existing account found, will create new account');
                // Account doesn't exist, will be created during magic link verification
                const t = get(translations);
                showInfo(t?.accountManager?.messages?.creatingNewAccount || 'Creating new account and sending magic link.', 3000);
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
            const t = get(translations);
            showSuccess(t?.accountManager?.messages?.magicLinkSent || 'Magic link sent! Check your email to complete login.', 5000);
            
            // Move to verification step
            accountCreationStep = 'verification';
        } catch (error) {
            console.error('Login error:', error);
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
                
                // Check if user is already logged in with the same email
                const currentLoggedIn = isLoggedIn;
                const currentAccountEmail = currentAccount?.email;
                const isAlreadyLoggedIn = currentLoggedIn && currentAccountEmail === magicLinkEmail;
                
                console.log('🔍 Login status check:', {
                    currentLoggedIn,
                    currentAccountEmail,
                    magicLinkEmail,
                    isAlreadyLoggedIn
                });
                
                // If already logged in with same email, just refresh session and clean URL
                if (isAlreadyLoggedIn) {
                    console.log('✅ User already logged in with same email, refreshing session...');
                    magicLinkStatus = 'success';
                    
                    // Mark successful login for return user tracking
                    markSuccessfulLogin(magicLinkEmail);
                    
                    // Clean up URL parameters but keep the account page
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                    console.log('🧹 URL parameters cleaned up:', newUrl);
                    
                    // Refresh session status
                    checkSessionStatus();
                    
                    // Show success message
                    const t = get(translations);
                    showSuccess(t?.accountManager?.messages?.magicLinkVerified || 'Magic link verified successfully!', 2000);
                    return; // Exit early, no need to verify again
                }
                
                // Check if we're on a language-prefixed route (e.g., /de/account)
                const currentPath = window.location.pathname;
                const pathSegments = currentPath.split('/').filter(segment => segment !== '');
                const hasLanguagePrefix = pathSegments.length > 1 && pathSegments[0] && pathSegments[1] === 'account';
                
                console.log('🔍 Route analysis:', {
                    currentPath: currentPath,
                    pathSegments: pathSegments,
                    hasLanguagePrefix: hasLanguagePrefix,
                    currentLanguage: currentLanguage
                });
                
                // If we're on /account (without language prefix), redirect to /de/account (or current language)
                if (currentPath === '/account') {
                    const currentLang = currentLanguage;
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
                        const t = get(translations);
                        showSuccess(t?.accountManager?.messages?.magicLinkVerified || 'Magic link verified successfully!', 3000);
                        
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
                        magicLinkError = error.message || 'Verification failed';
                        
                        // Check if error is due to already logged in or account exists
                        const errorMessage = error.message || '';
                        if (errorMessage.includes('already') || errorMessage.includes('exists') || errorMessage.includes('logged in')) {
                            // User is already logged in or account exists - treat as success
                            console.log('⚠️ Account already exists or user already logged in, treating as success');
                            magicLinkStatus = 'success';
                            magicLinkError = '';
                            
                            // Refresh session
                            checkSessionStatus();
                            const t = get(translations);
                            showSuccess(t?.accountManager?.messages?.magicLinkVerified || 'Magic link verified successfully!', 2000);
                        } else {
                            // Real error - show error message
                        const t = get(translations);
                        showError(t?.accountManager?.messages?.magicLinkVerificationFailed || 'Magic link verification failed', 5000);
                        }
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
            if (history && history.email && !isLoggedIn) {
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
                isLoggedIn: isLoggedIn,
                history: history,
                email: email,
                showExpandedView: showExpandedView,
                accountCreationStep: accountCreationStep
            });
            
            // Initialize with current account data if available
            const currentAccountValue = get(currentAccount);
            if (currentAccountValue?.email) {
                email = currentAccountValue.email;
                name = currentAccountValue.name || '';
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
    // Handle login errors (Svelte 5 Runes)
    $effect(() => {
        const error = get(loginError);
        if (error) {
            showError(error, 5000);
        }
    });
    
    // Reactive statement to update daily limits when user state changes
    // REMOVED: This reactive block was overwriting dailyLimit with old localStorage data
    // dailyLimit is now ONLY managed by dailyUsageStore.js - DO NOT SET IT HERE!
    // Old code read from STORAGE_KEYS.DAILY_REQUEST_COUNT which is deprecated
    
    // For debugging, just log when user state changes (Svelte 5 Runes)
    $effect(() => {
        const isLoggedInValue = get(isLoggedIn);
        const accountTierValue = get(accountTier);
        const dailyLimitValue = get(dailyLimit);
        if (isLoggedInValue !== undefined && accountTierValue !== undefined) {
            console.log('🔄 AccountManager: User state changed:', {
                isLoggedIn: isLoggedInValue,
                accountTier: accountTierValue,
                dailyLimit: dailyLimitValue
            });
        }
    });

    // Check if user has a valid session
    function checkSessionStatus() {
        const account = currentAccount;
        const loggedIn = isLoggedIn;
        
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

    // Reaktive SEO Meta-Tags (Svelte 5 Runes)
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
                                on:click={async () => {
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
                                on:click={navigateToHome}
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
                                    on:click={() => showExpandedView = false}
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
        on:change={handleImportSettings}
        class="hidden"
    />
</PageLayout>
