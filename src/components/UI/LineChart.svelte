<!-- src/components/UI/LineChart.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, draw, fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    
    // Props
    export let data = []; // Array of { date: '2025-10-10', value: 5 }
    export let data2 = null; // Optional second dataset: Array of { date: '2025-10-10', value: 3 }
    export let label = 'Daily Generations';
    export let label2 = 'Story Generations'; // Label for second line
    export let maxValue = 9; // FREE tier default
    export let height = 200;
    export let color = '#eab308'; // yellow-500
    export let color2 = '#2563eb'; // blue-600
    export let gridColor = '#e5e7eb'; // gray-200
    export let darkGridColor = '#374151'; // gray-700
    export let labelColor = '#6b7280'; // gray-500 (light mode)
    export let darkLabelColor = '#9ca3af'; // gray-400 (dark mode)
    export let showGrid = true;
    export let showPoints = true;
    export let showLabels = true;
    export let animate = true;
    
    // Responsive width (100% of container)
    let containerWidth = 0;
    
    // Calculated values (responsive)
    $: svgWidth = containerWidth || 400;
    $: svgHeight = height;
    $: padding = { top: 20, right: 15, bottom: 40, left: 35 }; // Optimized: minimal side padding for maximum chart width
    $: chartWidth = svgWidth - padding.left - padding.right;
    $: chartHeight = svgHeight - padding.top - padding.bottom;
    
    // Theme awareness
    let isDarkMode = false;
    
    // Tooltip state
    let hoveredPoint = null;
    let tooltipPosition = { x: 0, y: 0, placement: 'top' }; // 'top' or 'bottom'
    let svgElement;
    let containerElement;
    let tooltipElement;
    
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
        
        // Measure container width for responsive chart
        const updateWidth = () => {
            if (containerElement) {
                containerWidth = containerElement.clientWidth;
            }
        };
        
        // Initial measurement
        updateWidth();
        
        // Update on window resize
        window.addEventListener('resize', updateWidth);
        
        // Update tooltip position on scroll/resize
        const updateTooltipOnMove = () => {
            if (hoveredPoint && svgElement && containerElement) {
                // Recalculate position if tooltip is visible
                updateTooltipPosition(hoveredPoint.index, hoveredPoint.isStoryPoint);
            }
        };
        
        window.addEventListener('scroll', updateTooltipOnMove, true);
        window.addEventListener('resize', updateTooltipOnMove);
        
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateWidth);
            window.removeEventListener('scroll', updateTooltipOnMove, true);
            window.removeEventListener('resize', updateTooltipOnMove);
        };
    });
    
    // Reactive calculations
    $: validData = Array.isArray(data) && data.length > 0 ? data : [];
    $: validData2 = data2 && Array.isArray(data2) && data2.length > 0 ? data2 : null;
    $: dataPoints = validData.length;
    $: hasData = dataPoints > 0;
    $: hasData2 = validData2 !== null && validData2.length > 0;
    
    // Scale calculations
    $: yScale = (value) => {
        const ratio = value / maxValue;
        return chartHeight - (ratio * chartHeight);
    };
    
    $: xScale = (index) => {
        if (dataPoints <= 1) return chartWidth / 2;
        return (index / (dataPoints - 1)) * chartWidth;
    };
    
    // Generate SVG path for first line
    $: linePath = (() => {
        if (!hasData) return '';
        
        return validData.map((point, i) => {
            const x = xScale(i);
            const y = yScale(point.value);
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        }).join(' ');
    })();
    
    // Generate SVG path for second line (Story Usage)
    $: linePath2 = (() => {
        if (!hasData2 || !validData2 || validData2.length === 0) {
            console.log('⚠️ [LineChart] Story line path empty - no data:', { hasData2, validData2Length: validData2?.length, data2 });
            return '';
        }
        
        const path = validData2.map((point, i) => {
            const x = xScale(i);
            const y = yScale(point.value || 0);
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        }).join(' ');
        
        // Debug: Log path generation
        if (path) {
            console.log('✅ [LineChart] Story line path generated:', {
                pathLength: path.length,
                points: validData2.length,
                firstPoint: validData2[0],
                sampleValues: validData2.slice(0, 3).map(p => p.value)
            });
        } else {
            console.warn('⚠️ [LineChart] Story line path is empty after generation:', { hasData2, validData2, data2 });
        }
        
        return path;
    })();
    
    // Generate area path (filled area under line) for first line
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
    
    // Generate area path (filled area under line) for second line (Story Usage)
    $: areaPath2 = (() => {
        if (!hasData2 || !validData2 || validData2.length === 0) return '';
        
        const line = validData2.map((point, i) => {
            const x = xScale(i);
            const y = yScale(point.value || 0);
            return `${x},${y}`;
        }).join(' ');
        
        if (!line) return '';
        
        const lastX = xScale(dataPoints - 1);
        const firstX = xScale(0);
        
        return `M ${firstX} ${chartHeight} L ${line} L ${lastX} ${chartHeight} Z`;
    })();
    
    // Debug: Log story data state
    $: if (data2 !== null && data2 !== undefined) {
        console.log('📊 [LineChart] Story data state:', {
            data2Type: typeof data2,
            data2IsArray: Array.isArray(data2),
            data2Length: data2?.length || 0,
            hasData2,
            validData2Length: validData2?.length || 0,
            linePath2Length: linePath2?.length || 0,
            areaPath2Length: areaPath2?.length || 0,
            firstPoint: validData2?.[0],
            lastPoint: validData2?.[validData2?.length - 1],
            sampleData2: data2?.slice(0, 3)
        });
    } else {
        console.log('⚠️ [LineChart] No story data (data2 is null/undefined)');
    }
    
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
    
    // Format date for tooltip (full date)
    function formatDateFull(dateStr) {
        try {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
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
    
    // Calculate tooltip position from SVG coordinates
    function updateTooltipPosition(pointIndex, isStoryPoint = false) {
        if (!svgElement || !containerElement) return;
        
        // Get point position in SVG chart coordinates (relative to chart group)
        const chartX = xScale(pointIndex);
        const chartY = (isStoryPoint && validData2 ? yScale(validData2[pointIndex]?.value || 0) : yScale(validData[pointIndex]?.value || 0));
        
        // Get container bounding box (relative positioning)
        const containerRect = containerElement.getBoundingClientRect();
        const svgRect = svgElement.getBoundingClientRect();
        
        // Calculate viewBox to screen scale
        const scaleX = svgRect.width / svgWidth;
        const scaleY = svgRect.height / svgHeight;
        
        // Convert chart coordinates to SVG coordinates (add padding)
        const svgX = chartX + padding.left;
        const svgY = chartY + padding.top;
        
        // Convert SVG coordinates to screen coordinates relative to container
        const screenX = svgRect.left - containerRect.left + (svgX * scaleX);
        const screenY = svgRect.top - containerRect.top + (svgY * scaleY);
        
        // Tooltip dimensions (approximate)
        const tooltipWidth = 180;
        const tooltipHeight = 70;
        const spacing = 10; // Space between point and tooltip
        const pointRadius = 4; // Point radius (not including glow)
        
        // Position tooltip centered horizontally on point
        let tooltipX = screenX;
        
        // Position tooltip directly above point (centered vertically above)
        let tooltipY = screenY - tooltipHeight - spacing - pointRadius;
        let placement = 'top';
        
        // Check if tooltip would go above container (show below instead)
        const minY = 5;
        if (tooltipY < minY) {
            // Position below point instead
            tooltipY = screenY + spacing + pointRadius;
            placement = 'bottom';
        }
        
        // Clamp tooltip to container bounds vertically
        const maxY = containerRect.height - tooltipHeight - 5;
        if (tooltipY > maxY) {
            // If below doesn't fit, try above (even if slightly above container)
            tooltipY = screenY - tooltipHeight - spacing - pointRadius;
            placement = 'top';
            // Clamp to bounds as fallback
            if (tooltipY < minY) {
                tooltipY = Math.max(minY, Math.min(tooltipY, maxY));
            }
        }
        
        // Keep tooltip within container horizontally (centered on point)
        const containerPadding = 10;
        const halfTooltipWidth = tooltipWidth / 2;
        tooltipX = Math.max(containerPadding + halfTooltipWidth, Math.min(tooltipX, containerRect.width - containerPadding - halfTooltipWidth));
        
        tooltipPosition = { x: tooltipX, y: tooltipY, placement };
    }
    
    // Handle point hover
    function handlePointHover(event, point, index, isStoryPoint = false) {
        hoveredPoint = { point, index, isStoryPoint };
        // Use double requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                updateTooltipPosition(index, isStoryPoint);
            });
        });
    }
    
    // Handle point leave
    function handlePointLeave() {
        hoveredPoint = null;
    }
</script>

<div class="line-chart-container relative w-full" bind:this={containerElement} in:fade={{ duration: 300 }}>
    {#if hasData}
        <svg 
            bind:this={svgElement}
            width="100%"
            {height} 
            viewBox="0 0 {svgWidth} {svgHeight}"
            preserveAspectRatio="xMidYMid meet"
            class="w-full h-auto"
            role="img"
            aria-label={label}
        >
            <defs>
                <!-- Gradient for area fill (first line) -->
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:{color};stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:{color};stop-opacity:0.05" />
                </linearGradient>
                
                <!-- Gradient for area fill (second line - Story Usage) -->
                <linearGradient id="areaGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:{color2};stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:{color2};stop-opacity:0.05" />
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
                                font-family="system-ui"
                                font-size="12"
                                fill={isDarkMode ? darkLabelColor : labelColor}
                            >
                                {line.label}
                            </text>
                        {/if}
                    {/each}
                {/if}
                
                <!-- Area (filled) for first line (Random) - Rendered FIRST (background) -->
                {#if areaPath}
                    <path
                        d={areaPath}
                        fill="url(#areaGradient)"
                        in:fade={{ duration: 600, delay: 200 }}
                    />
                {/if}
                
                <!-- First Line (Random Emoji) - Rendered FIRST (background) -->
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
                
                <!-- Data points for first line - Rendered BEFORE story line (background) -->
                {#if showPoints}
                    {#each validData as point, i}
                        {@const x = xScale(i)}
                        {@const y = yScale(point.value)}
                        {@const pointColor = getPointColor(point.value)}
                        
                        <g 
                            class="cursor-pointer transition-transform hover:scale-125"
                            in:fade={{ duration: 400, delay: 800 + (i * 50) }}
                            on:mouseenter={(e) => handlePointHover(e, point, i, false)}
                            on:mouseleave={handlePointLeave}
                            on:focus={(e) => handlePointHover(e, point, i, false)}
                            on:blur={handlePointLeave}
                            tabindex="0"
                            role="button"
                            aria-label="{formatDateFull(point.date)}: {point.value} random generations"
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
                            
                            <!-- Fallback tooltip for accessibility -->
                            <title>{point.date}: {point.value} generations</title>
                        </g>
                    {/each}
                {/if}
                
                <!-- Area (filled) for second line (Story Usage) - Rendered AFTER random (foreground) -->
                {#if areaPath2 && hasData2}
                    <path
                        d={areaPath2}
                        fill="url(#areaGradient2)"
                        in:fade={{ duration: 600, delay: 400 }}
                    />
                {/if}
                
                <!-- Second Line (Story Usage) - Rendered AFTER random line (foreground) -->
                {#if linePath2 && hasData2}
                    {#if animate}
                        <path
                            d={linePath2}
                            fill="none"
                            stroke={color2}
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            filter="url(#glow)"
                            in:draw={{ duration: 1000, delay: 200, easing: cubicInOut }}
                        />
                    {:else}
                        <path
                            d={linePath2}
                            fill="none"
                            stroke={color2}
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            filter="url(#glow)"
                        />
                    {/if}
                {/if}
                
                <!-- Data points for second line (Story Usage) - Rendered AFTER story line (foreground) -->
                {#if showPoints && hasData2}
                    {#each validData2 as point, i}
                        {@const x = xScale(i)}
                        {@const y = yScale(point.value || 0)}
                        
                        <g 
                            class="cursor-pointer transition-transform hover:scale-125"
                            in:fade={{ duration: 400, delay: 1000 + (i * 50) }}
                            on:mouseenter={(e) => handlePointHover(e, point, i, true)}
                            on:mouseleave={handlePointLeave}
                            on:focus={(e) => handlePointHover(e, point, i, true)}
                            on:blur={handlePointLeave}
                            tabindex="0"
                            role="button"
                            aria-label="{formatDateFull(point.date)}: {point.value || 0} story generations"
                        >
                            <!-- Point glow -->
                            <circle
                                cx={x}
                                cy={y}
                                r="6"
                                fill={color2}
                                opacity="0.3"
                            />
                            <!-- Point -->
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill={color2}
                                stroke="white"
                                stroke-width="2"
                            />
                            
                            <!-- Fallback tooltip for accessibility -->
                            <title>{point.date}: {point.value || 0} stories</title>
                        </g>
                    {/each}
                {/if}
                
                <!-- X-axis labels (show every Nth label to avoid crowding) -->
                {#if showLabels}
                    {#each validData as point, i}
                        {@const x = xScale(i)}
                        {@const showLabel = dataPoints <= 14 || i % Math.ceil(dataPoints / 10) === 0}
                        {#if showLabel}
                            <text
                                x={x}
                                y={chartHeight + 20}
                                text-anchor="middle"
                                font-family="system-ui"
                                font-size="11"
                                fill={isDarkMode ? darkLabelColor : labelColor}
                            >
                                {formatDate(point.date)}
                            </text>
                        {/if}
                    {/each}
                {/if}
                
            </g>
        </svg>
        
        <!-- Tooltip (rendered absolutely within container, directly above/below point) -->
        {#if hoveredPoint}
            <div
                bind:this={tooltipElement}
                class="absolute z-50 pointer-events-none"
                style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px; transform: translateX(-50%);"
                role="tooltip"
                in:fly={{ y: tooltipPosition.placement === 'top' ? 8 : -8, duration: 200 }}
                out:fade={{ duration: 150 }}
            >
                <!-- Tooltip Container with Arrow -->
                <div class="relative">
                    <!-- Tooltip Box -->
                    <div class="relative bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-sm px-3 py-2.5 rounded-xl shadow-2xl border border-gray-700 dark:border-gray-600 min-w-[160px] max-w-[200px] backdrop-blur-sm">
                        <!-- Tooltip Content -->
                        <div class="relative z-10">
                            <!-- Date -->
                            <div class="font-semibold mb-1.5 text-xs text-gray-300 dark:text-gray-400 tabular-nums">
                                {formatDateFull(hoveredPoint.point.date)}
                            </div>
                            
                            <!-- Value -->
                            <div class="flex items-center gap-2">
                                {#if hoveredPoint.isStoryPoint}
                                    <span class="text-blue-400 text-base leading-none" aria-hidden="true">📝</span>
                                    <span class="font-medium text-sm">
                                        {hoveredPoint.point.value || 0} {hoveredPoint.point.value === 1 ? 'story' : 'stories'}
                                    </span>
                                {:else}
                                    <span class="text-yellow-400 text-base leading-none" aria-hidden="true">➕</span>
                                    <span class="font-medium text-sm">
                                        {hoveredPoint.point.value} {hoveredPoint.point.value === 1 ? 'generation' : 'generations'}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        {/if}
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

