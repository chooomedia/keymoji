<!-- AccountStatistics.svelte - Zeigt Account Statistics Grid -->
<script lang="ts">
    import { get } from 'svelte/store';
    import { accountTier } from '../../stores/appStores';
    import { translations } from '../../stores/contentStore';

    interface Props {
        totalStoriesGenerated: number;
        remainingGenerations: number;
    }

    let {
        totalStoriesGenerated,
        remainingGenerations
    }: Props = $props();
</script>

<div class="grid grid-cols-2 gap-4 mb-6">
    <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 tabular-nums">
            {totalStoriesGenerated}
        </div>
        <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
            {get(translations)?.accountManager?.statistics?.storiesGenerated || 'Stories Generated'}
        </div>
    </div>
    <div class="text-center p-4 bg-powder-300 dark:bg-aubergine-900 rounded-xl">
        <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 tabular-nums">
            {get(accountTier) === 'pro' ? '∞' : remainingGenerations}
        </div>
        <div class="text-sm font-medium text-green-800 dark:text-green-200">
            {get(translations)?.accountManager?.statistics?.remainingGenerations || 'Remaining Generations'}
        </div>
    </div>
</div>

