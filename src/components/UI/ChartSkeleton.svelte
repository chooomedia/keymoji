<!-- src/components/UI/ChartSkeleton.svelte -->
<script>
    import { fade } from 'svelte/transition';

    export let height = 200;
</script>

<div 
    class="chart-skeleton w-full bg-gray-100 dark:bg-aubergine-900 rounded-lg p-4"
    style="height: {height}px"
    in:fade={{ duration: 200 }}
    role="status"
    aria-label="Loading chart data..."
>
    <!-- Skeleton Grid Lines -->
    <div class="space-y-4 h-full flex flex-col justify-between">
        {#each [0, 1, 2, 3] as i}
            <div class="flex items-center space-x-2">
                <!-- Y-axis label placeholder -->
                <div class="w-6 h-3 bg-gray-300 dark:bg-aubergine-700 rounded animate-pulse"></div>
                
                <!-- Grid line -->
                <div class="flex-1 h-px bg-gray-300 dark:bg-aubergine-700 animate-pulse" 
                     style="animation-delay: {i * 100}ms"></div>
            </div>
        {/each}
    </div>

    <!-- Skeleton Data Points (Circles) -->
    <div class="absolute bottom-8 left-0 right-0 flex justify-around px-8">
        {#each Array(7) as _, i}
            <div 
                class="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-pulse"
                style="animation-delay: {i * 80}ms; margin-bottom: {Math.random() * 60}px"
            ></div>
        {/each}
    </div>

    <!-- Loading indicator -->
    <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
            <div class="inline-block w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                📊 Lade Chart-Daten...
            </p>
        </div>
    </div>
</div>

<style>
    .chart-skeleton {
        position: relative;
        overflow: hidden;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>

