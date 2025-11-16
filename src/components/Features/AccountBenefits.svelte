<!-- AccountBenefits.svelte - Zeigt FREE/PRO Benefits -->
<script lang="ts">
    import { get } from 'svelte/store';
    import { fade } from 'svelte/transition';
    import { translations } from '../../stores/contentStore';

    interface Props {
        selectedTier: 'free' | 'pro';
        onTierChange: (tier: 'free' | 'pro') => void;
        accountAgeLabel?: string;
    }

    let {
        selectedTier,
        onTierChange,
        accountAgeLabel = ''
    }: Props = $props();
</script>

<div class="transform -translate-y-3.5 scale-114">
    <div class="core-button relative h-20 bg-creme-500 dark:bg-aubergine-900 border-powder-300 dark:border-aubergine-800 shadow-inner overflow-hidden mb-1">
        <div
            class="absolute inset-y-1 bg-powder-300 dark:bg-aubergine-800 rounded-full shadow-lg transition-transform duration-500 ease-in-out"
            style="width: calc(48% - 2px); left: 4px; transform: translateX({selectedTier === 'pro' ? 'calc(100% + 11px)' : '0'})"
        ></div>
        <div class="w-full h-full relative flex justify-around">
            <button
                class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10 hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2"
                onclick={() => onTierChange('free')}
                aria-label={get(translations)?.accountManager?.tiers?.free || 'Select Free account'}
                title={get(translations)?.accountManager?.freeDescription || 'Free account'}
            >
                <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                    {get(translations)?.accountManager?.tiers?.free || 'FREE'}
                </span>
                <span class="text-xs transition-colors duration-300 text-yellow-600">
                    {accountAgeLabel || (get(translations)?.accountManager?.freeDescription || '✨ Kostenlose Sicherheit')}
                </span>
            </button>
            <button
                class="flex flex-col items-center justify-center rounded-full transition-all duration-300 z-10 hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                onclick={() => onTierChange('pro')}
                aria-label={get(translations)?.accountManager?.tiers?.pro || 'Select Pro account'}
                title={get(translations)?.accountManager?.proDescription || 'Pro account'}
            >
                <span class="text-xl font-bold transition-colors duration-300 text-black dark:text-white">
                    {get(translations)?.accountManager?.tiers?.pro || 'PRO'}
                </span>
                <span class="text-xs transition-colors duration-300 text-purple-600">
                    {accountAgeLabel || (get(translations)?.accountManager?.proDescription || '💎 Enterprise Security')}
                </span>
            </button>
        </div>
    </div>
</div>

<!-- Benefits Content -->
<div class="relative mb-5 z-10 grid" role="tabpanel" aria-live="polite">
    <!-- FREE Benefits -->
    {#if selectedTier === 'free'}
        <div 
            class="space-y-4 col-start-1 row-start-1"
            in:fade={{ duration: 350, easing: (t) => t * (2 - t) }}
            out:fade={{ duration: 250, easing: (t) => t * t }}
            role="region"
            aria-label="Free tier benefits"
        >
            {#each Object.entries(get(translations)?.accountManager?.benefits?.free || {}) as [key, value]}
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
                                    {@const desc = get(translations)?.accountManager?.benefits?.free?.[key + 'Desc'] || ''}
                                    {@const parts = desc.split('Apertus')}
                                    {#if parts.length > 1}
                                        {parts[0]}
                                        <a 
                                            href="https://publicai.co/apertus" 
                                            target="_blank" 
                                            rel="noopener noreferrer external"
                                            class="inline-flex items-center gap-1 text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-500 underline transition-colors duration-200"
                                            aria-label="Apertus LLM Documentation (opens in new tab)"
                                            title="Apertus LLM - Official Documentation">
                                            <span>Apertus</span>
                                            <svg 
                                                class="w-3 h-3 inline" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24" 
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true">
                                                <path 
                                                    stroke-linecap="round" 
                                                    stroke-linejoin="round" 
                                                    stroke-width="2" 
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14">
                                                </path>
                                            </svg>
                                        </a>
                                        {parts[1]}
                                    {:else}
                                        {desc}
                                    {/if}
                                {:else}
                                    {get(translations)?.accountManager?.benefits?.free?.[key + 'Desc'] || ''}
                                {/if}
                            </p>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}

    <!-- PRO Benefits -->
    {#if selectedTier === 'pro'}
        <div 
            class="space-y-4 col-start-1 row-start-1"
            in:fade={{ duration: 350, easing: (t) => t * (2 - t) }}
            out:fade={{ duration: 250, easing: (t) => t * t }}
            role="region"
            aria-label="Pro tier benefits"
        >
            {#each Object.entries(get(translations)?.accountManager?.benefits?.pro || {}) as [key, value]}
                {#if !key.endsWith('Desc')}
                    {@const colorClass = key === 'unlimitedGenerations' || key === 'aiThreatDetection' || key === 'prioritySupport' ? 'purple' : key === 'browserExtension' ? 'blue' : key === 'apiIntegration' ? 'green' : key === 'advancedAnalytics' ? 'orange' : 'purple'}
                    <div class="flex items-center p-4 bg-white dark:bg-aubergine-900 rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
                        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-{colorClass}-100 to-{colorClass}-200 dark:from-{colorClass}-800 dark:to-{colorClass}-900 rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                            <span class="text-{colorClass}-600 dark:text-{colorClass}-400 text-2xl">
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
                            <p class="text-gray-600 dark:text-gray-400">{get(translations)?.accountManager?.benefits?.pro?.[key + 'Desc'] || ''}</p>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

