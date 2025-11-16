<!-- DailyLimitChart.svelte - Zeigt Chart und Daily Limit Status -->
<script lang="ts">
    import { get } from 'svelte/store';
    import { fade } from 'svelte/transition';
    import { accountTier } from '../../stores/appStores';
    import { translations } from '../../stores/contentStore';
    import { navigate } from '../../utils/routing';
    import LineChart from '../UI/LineChart.svelte';
    import ChartSkeleton from '../UI/ChartSkeleton.svelte';
    import Button from '../UI/Button.svelte';

    interface Props {
        selectedTimePeriod: string;
        finalChartData: Array<{ date: string; value: number; storyValue?: number }>;
        finalStoryChartData: Array<{ date: string; value: number }>;
        finalUsageHistory: Array<any>;
        chartMaxValue: number;
        isLoadingChartData: boolean;
        chartDataError: string | null;
        isDemoDataShown: boolean;
        currentUserLimits: { limit: number; used: number };
        remainingGenerations: number;
        dailyLimitDisplay: string;
        onPeriodChange: (period: string) => void;
        onRefresh: () => void;
        onRetry: () => void;
    }

    let {
        selectedTimePeriod,
        finalChartData,
        finalStoryChartData,
        finalUsageHistory,
        chartMaxValue,
        isLoadingChartData,
        chartDataError,
        isDemoDataShown,
        currentUserLimits,
        remainingGenerations,
        dailyLimitDisplay,
        onPeriodChange,
        onRefresh,
        onRetry
    }: Props = $props();
</script>

<div class="bg-powder-300 dark:bg-aubergine-900 rounded-xl p-4 mb-6">
    <!-- Header with Time Period Selector & Refresh Button -->
    <div class="flex justify-between items-center mb-6 z-10">
        <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {get(translations)?.accountManager?.dailyGenerations || 'Daily Generations'}
        </span>
        <div class="flex items-center gap-2">
            <!-- Time Period Buttons -->
            <div class="inline-flex gap-1">
                {#each ['7d', '14d', '4w', '3m'] as period}
                    <button
                        on:click={() => onPeriodChange(period)}
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
            
            <!-- Refresh Button -->
            <button
                on:click={onRefresh}
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
                    on:click={onRetry}
                    variant="primary"
                    size="sm"
                >
                    🔄 Erneut versuchen
                </Button>
            </div>
        {:else if finalUsageHistory.length === 0 && !isLoadingChartData && get(accountTier) !== undefined}
            <!-- No Data State -->
            <div 
                class="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-aubergine-900 rounded-lg border border-gray-200 dark:border-aubergine-700 p-8"
                in:fade={{ duration: 300 }}
            >
                <div class="text-6xl mb-4">📊</div>
                <h4 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {get(translations)?.accountManager?.statistics?.noDataTitle || 'No Data'}
                </h4>
                <p class="text-base text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                    {get(translations)?.accountManager?.statistics?.noDataMessage || 'Generate emojis to collect your real usage data and display it here.'}
                </p>
                <!-- Refresh Button -->
                <button
                    on:click={onRefresh}
                    disabled={chartDataError !== null || isLoadingChartData}
                    class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-medium rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 shadow-md"
                    title="Refresh usage data"
                    aria-label="Refresh usage data"
                >
                    {#if isLoadingChartData}
                        <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{get(translations)?.accountManager?.statistics?.loading || 'Loading...'}</span>
                    {:else}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{get(translations)?.accountManager?.statistics?.refreshButton || 'Refresh'}</span>
                    {/if}
                </button>
            </div>
        {:else}
            <!-- Chart Container -->
            <div class="relative min-h-[280px] flex items-center justify-center -mx-4" in:fade={{ duration: 400 }}>
                <!-- Background Chart -->
                <LineChart 
                    data={finalChartData}
                    data2={finalStoryChartData}
                    maxValue={chartMaxValue}
                    height={240}
                    color={isDemoDataShown ? '#f97316' : (get(accountTier) === 'pro' ? '#a855f7' : '#eab308')}
                    color2="#2563eb"
                    label="Random Emoji"
                    label2="Story Generations"
                    animate={true}
                />
                
                {#if isDemoDataShown}
                    <!-- Demo Data Overlay -->
                    <div 
                        class="absolute w-96 h-48 mx-auto inset-0 flex items-center justify-center backdrop-blur-2xl rounded-lg bg-white/70 dark:bg-aubergine-900/70"
                        transition:fade={{ duration: 300 }}
                    >
                        <div class="bg-creme-80 dark:bg-aubergine-80 backdrop-filter backdrop-blur-md rounded-lg text-center px-8 py-9 mt-9 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_8px_24px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.95),0_10px_30px_rgba(0,0,0,0.65),0_4px_15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
                            <div class="text-6xl mb-5">📊</div>
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {get(translations)?.accountManager?.demoChart?.title || 'Demo Vorschau'}
                            </h3>
                            <p class="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-sm mx-auto">
                                {get(translations)?.accountManager?.demoChart?.description || 'Dies ist eine Beispiel-Ansicht. Generiere Emojis um deine echten Nutzungsdaten zu sammeln und hier anzuzeigen.'}
                            </p>
                            <button
                                on:click={() => navigate('/')}
                                class="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:from-yellow-600 focus:to-orange-600 active:from-yellow-700 active:to-orange-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 dark:focus:ring-yellow-500/50 shadow-lg hover:shadow-xl"
                                aria-label={get(translations)?.accountManager?.demoChart?.cta || 'Jetzt Emojis generieren'}
                            >
                                <span class="mr-2">🎲</span>
                                {get(translations)?.accountManager?.demoChart?.cta || 'Jetzt Emojis generieren'}
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
    
    <!-- Progress Bar with Inline Counter -->
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
        {remainingGenerations > 0 ? (get(translations)?.accountManager?.canStillGenerate || 'You can still generate emojis!') : (get(translations)?.accountManager?.limitReached || 'Daily limit reached. Upgrade to PRO for unlimited generations.')}
    </p>
</div>

