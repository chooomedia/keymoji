<!-- src/components/UI/LineChart.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, draw } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    
    // Props
    export let data = []; // Array of { date: '2025-10-10', value: 5 }
    export let label = 'Daily Generations';
    export let maxValue = 9; // FREE tier default
    export let height = 200;
    export let width = 400;
    export let color = '#eab308'; // yellow-500
    export let gridColor = '#e5e7eb'; // gray-200
    export let darkGridColor = '#374151'; // gray-700
    export let showGrid = true;
    export let showPoints = true;
    export let showLabels = true;
    export let animate = true;
    
    // Calculated values
    let svgWidth = width;
    let svgHeight = height;
    let padding = { top: 20, right: 20, bottom: 40, left: 40 };
    let chartWidth = svgWidth - padding.left - padding.right;
    let chartHeight = svgHeight - padding.top - padding.bottom;
    
    // Theme awareness
    let isDarkMode = false;
    
    onMount(() => {
        // Check initial theme
        isDarkMode = document.documentElement.classList.contains('dark');
        
        // Watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    isDarkMode = document.documentElement.classList.contains('dark');
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        return () => observer.disconnect();
    });
    
    // Reactive calculations
    $: validData = Array.isArray(data) && data.length > 0 ? data : [];
    $: dataPoints = validData.length;
    $: hasData = dataPoints > 0;
    
    // Scale calculations
    $: yScale = (value) => {
        const ratio = value / maxValue;
        return chartHeight - (ratio * chartHeight);
    };
    
    $: xScale = (index) => {
        if (dataPoints <= 1) return chartWidth / 2;
        return (index / (dataPoints - 1)) * chartWidth;
    };
    
    // Generate SVG path
    $: linePath = (() => {
        if (!hasData) return '';
        
        return validData.map((point, i) => {
            const x = xScale(i);
            const y = yScale(point.value);
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        }).join(' ');
    })();
    
    // Generate area path (filled area under line)
    $: areaPath = (() => {
        if (!hasData) return '';
        
        const line = validData.map((point, i) => {
            const x = xScale(i);
            const y = yScale(point.value);
            return `${x},${y}`;
        }).join(' ');
        
        const lastX = xScale(dataPoints - 1);
        const firstX = xScale(0);
        
        return `M ${firstX} ${chartHeight} L ${line} L ${lastX} ${chartHeight} Z`;
    })();
    
    // Grid lines (horizontal)
    $: gridLines = (() => {
        const lines = [];
        const steps = 5;
        for (let i = 0; i <= steps; i++) {
            const value = (maxValue / steps) * i;
            const y = yScale(value);
            lines.push({ y, label: Math.round(value) });
        }
        return lines;
    })();
    
    // Format date label
    function formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${day}.${month}`;
        } catch {
            return dateStr;
        }
    }
    
    // Get point color based on value
    function getPointColor(value) {
        if (value >= maxValue * 0.7) return '#22c55e'; // green-500
        if (value >= maxValue * 0.4) return color; // yellow-500
        return '#ef4444'; // red-500
    }
</script>

<div class="line-chart-container w-full" in:fade={{ duration: 300 }}>
    {#if hasData}
        <svg 
            {width} 
            {height} 
            viewBox="0 0 {svgWidth} {svgHeight}"
            class="w-full h-auto"
            role="img"
            aria-label={label}
        >
            <defs>
                <!-- Gradient for area fill -->
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:{color};stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:{color};stop-opacity:0.05" />
                </linearGradient>
                
                <!-- Glow effect for line -->
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Chart group (with padding offset) -->
            <g transform="translate({padding.left}, {padding.top})">
                
                <!-- Grid lines -->
                {#if showGrid}
                    {#each gridLines as line}
                        <line
                            x1="0"
                            y1={line.y}
                            x2={chartWidth}
                            y2={line.y}
                            stroke={isDarkMode ? darkGridColor : gridColor}
                            stroke-width="1"
                            stroke-dasharray="4,4"
                            opacity="0.5"
                        />
                        {#if showLabels}
                            <text
                                x="-10"
                                y={line.y + 4}
                                text-anchor="end"
                                class="text-xs fill-gray-500 dark:fill-gray-400"
                                font-family="system-ui"
                            >
                                {line.label}
                            </text>
                        {/if}
                    {/each}
                {/if}
                
                <!-- Area (filled) -->
                {#if areaPath}
                    <path
                        d={areaPath}
                        fill="url(#areaGradient)"
                        in:fade={{ duration: 600, delay: 200 }}
                    />
                {/if}
                
                <!-- Line -->
                {#if linePath && animate}
                    <path
                        d={linePath}
                        fill="none"
                        stroke={color}
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        filter="url(#glow)"
                        in:draw={{ duration: 1000, easing: cubicInOut }}
                    />
                {:else if linePath}
                    <path
                        d={linePath}
                        fill="none"
                        stroke={color}
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        filter="url(#glow)"
                    />
                {/if}
                
                <!-- Data points -->
                {#if showPoints}
                    {#each validData as point, i}
                        {@const x = xScale(i)}
                        {@const y = yScale(point.value)}
                        {@const pointColor = getPointColor(point.value)}
                        
                        <g 
                            class="cursor-pointer transition-transform hover:scale-125"
                            in:fade={{ duration: 400, delay: 800 + (i * 50) }}
                        >
                            <!-- Point glow -->
                            <circle
                                cx={x}
                                cy={y}
                                r="6"
                                fill={pointColor}
                                opacity="0.3"
                            />
                            <!-- Point -->
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill={pointColor}
                                stroke="white"
                                stroke-width="2"
                            />
                            
                            <!-- Tooltip on hover -->
                            <title>{point.date}: {point.value} generations</title>
                        </g>
                    {/each}
                {/if}
                
                <!-- X-axis labels -->
                {#if showLabels}
                    {#each validData as point, i}
                        {@const x = xScale(i)}
                        <text
                            x={x}
                            y={chartHeight + 20}
                            text-anchor="middle"
                            class="text-xs fill-gray-600 dark:fill-gray-400"
                            font-family="system-ui"
                        >
                            {formatDate(point.date)}
                        </text>
                    {/each}
                {/if}
                
            </g>
        </svg>
    {:else}
        <!-- No data state -->
        <div class="flex items-center justify-center h-48 bg-gray-100 dark:bg-aubergine-900 rounded-lg" in:fade>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
                📊 Keine Daten verfügbar
            </p>
        </div>
    {/if}
</div>

<style>
    .line-chart-container {
        user-select: none;
        -webkit-user-select: none;
    }
</style>

