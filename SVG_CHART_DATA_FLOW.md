# SVG Chart Data Flow - Complete Journey

## 🎨 Von Google Sheets Daten → Animiertes SVG Chart

### Complete Flow: Data → SVG Rendering

```
Google Sheets                n8n                    Frontend Stores              AccountManager.svelte        LineChart.svelte
━━━━━━━━━━━━                ━━━                    ━━━━━━━━━━━━━━━              ━━━━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━━━━
usageHistory: [             Parse JSON             $currentAccount              getUsageHistory()            SVG Calculation
  {date, used}     →        to Array      →        .metadata        →           returns Array      →         & Rendering
  ... 28 entries                                    .usageHistory                                             
]                                                                                generateChartData()          Animated Path
                                                                                 filters by period   →        + Data Points
                                                                                                              
                                                                                 usageChartData               <svg>
                                                                                 (7/14/28 points)    →        <path>
                                                                                                              <circle>s
```

---

## 📊 **STEP-BY-STEP: Data → SVG**

### **STEP 1: AccountManager.svelte - Data Import**

```svelte
<!-- src/routes/AccountManager.svelte -->
<script>
    import { currentAccount, accountTier } from '../stores/appStores.js';
    import { getUsageHistory, calculateUsageStats } from '../utils/usageHistoryHelpers.js';
    import LineChart from '../components/UI/LineChart.svelte';

    // State: Which time period is selected?
    let selectedTimePeriod = '7d'; // Options: '7d', '14d', '4w', '1y'

    // REACTIVE 1: Extract usageHistory from currentAccount
    // Triggers when $currentAccount changes (after login/API load)
    $: usageHistory = getUsageHistory($currentAccount);
    
    // What happens:
    // $currentAccount = {
    //     userId: "user_1760079091439",
    //     metadata: {
    //         usageHistory: [
    //             { date: "2025-10-10", used: 5, limit: 9, timestamp: "..." },
    //             { date: "2025-10-09", used: 7, limit: 9, timestamp: "..." },
    //             ... 26 more entries
    //         ]
    //     }
    // }
    //
    // getUsageHistory() returns:
    // usageHistory = [
    //     { date: "2025-10-10", used: 5, limit: 9, timestamp: "..." },
    //     { date: "2025-10-09", used: 7, limit: 9, timestamp: "..." },
    //     ... 26 more entries
    // ]
    // Total: 28 entries (Array)

    console.log('📊 STEP 1: usageHistory extracted:', usageHistory.length, 'entries');

    // REACTIVE 2: Generate chart data based on selected period
    // Triggers when usageHistory OR selectedTimePeriod changes
    $: usageChartData = generateChartData(selectedTimePeriod, usageHistory);
    
    console.log('📊 STEP 2: usageChartData generated for', selectedTimePeriod);

    /**
     * Generate chart data for selected time period
     * @param {string} period - '7d', '14d', '4w', '1y'
     * @param {Array} history - Full usageHistory array
     * @returns {Array} Filtered data for chart
     */
    function generateChartData(period, history) {
        const today = new Date();
        const data = [];

        // Determine number of days to show
        let days = 7;
        if (period === '14d') days = 14;
        if (period === '4w') days = 28;
        if (period === '1y') days = 365;

        console.log(`📊 Generating chart data for ${days} days`);

        // Generate data points for each day (reverse order for chart)
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0]; // "2025-10-10"

            // Find usage for this date in history
            const historyEntry = history.find(h => h.date === dateStr);
            const value = historyEntry?.used || 0;

            data.push({
                date: dateStr,
                value: value
            });
        }

        console.log('📊 Chart data generated:', data.length, 'points');
        console.log('📊 First point:', data[0]);
        console.log('📊 Last point:', data[data.length - 1]);

        return data;
    }

    // Example output for '4w':
    // usageChartData = [
    //     { date: "2025-09-13", value: 6 },  ← 27 days ago
    //     { date: "2025-09-14", value: 5 },
    //     { date: "2025-09-15", value: 7 },
    //     ...
    //     { date: "2025-10-09", value: 7 },
    //     { date: "2025-10-10", value: 5 }   ← Today
    // ]
    // Total: 28 data points
</script>

<!-- HTML: Render LineChart with reactive data -->
<div class="bg-powder-300 dark:bg-aubergine-900 rounded-xl p-4 mb-5">
    <!-- Time Period Selector -->
    <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-semibold">Daily Generations</span>
        <div class="inline-flex rounded-lg bg-white dark:bg-aubergine-800 p-0.5">
            {#each ['7d', '14d', '4w', '1y'] as period}
                <button
                    on:click={() => selectedTimePeriod = period}
                    class="px-2 py-1 text-xs font-medium rounded-md transition-all {
                        selectedTimePeriod === period
                            ? 'bg-yellow-500 text-white shadow'
                            : 'text-gray-600 dark:text-gray-400'
                    }"
                >
                    {period}
                </button>
            {/each}
        </div>
    </div>

    <!-- Chart Container (Full Width, Edge-to-Edge) -->
    <div class="mb-3 -mx-4">
        <!-- REACTIVE 3: LineChart receives new data whenever usageChartData changes -->
        <LineChart
            data={usageChartData}
            maxValue={$accountTier === 'pro' ? 25 : 9}
            height={200}
            color={$accountTier === 'pro' ? '#a855f7' : '#eab308'}
            animate={true}
        />
        <!-- 
            What happens:
            1. LineChart receives usageChartData as prop
            2. If data changes, Svelte rerenders the component
            3. SVG calculations run
            4. Path and circles are drawn
            5. Animations trigger
        -->
    </div>
</div>
```

---

### **STEP 2: usageHistoryHelpers.js - Data Extraction**

```javascript
// src/utils/usageHistoryHelpers.js

/**
 * Extract usageHistory from currentAccount
 * @param {Object} account - Current account from store
 * @returns {Array} Usage history array (sorted newest first)
 */
export function getUsageHistory(account) {
    if (!account) {
        console.warn('⚠️ No account provided to getUsageHistory');
        return [];
    }

    // Extract from metadata.usageHistory
    const history = account?.metadata?.usageHistory || [];

    console.log('📊 getUsageHistory:', {
        hasAccount: !!account,
        hasMetadata: !!account?.metadata,
        hasHistory: !!account?.metadata?.usageHistory,
        historyLength: history.length,
        firstEntry: history[0],
        lastEntry: history[history.length - 1]
    });

    // Ensure it's an array
    if (!Array.isArray(history)) {
        console.error('❌ usageHistory is not an array:', typeof history);
        return [];
    }

    // Already sorted newest first from Google Sheets
    return history;
}

// Example output:
// [
//     { date: "2025-10-10", used: 5, limit: 9, timestamp: "2025-10-10T12:00:00.000Z" },
//     { date: "2025-10-09", used: 7, limit: 9, timestamp: "2025-10-09T12:00:00.000Z" },
//     { date: "2025-10-08", used: 4, limit: 9, timestamp: "2025-10-08T12:00:00.000Z" },
//     ...
//     { date: "2025-09-13", used: 6, limit: 9, timestamp: "2025-09-13T12:00:00.000Z" }
// ]
```

---

### **STEP 3: LineChart.svelte - SVG Calculation & Rendering**

```svelte
<!-- src/components/UI/LineChart.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, draw } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    // ============================================================
    // PROPS - Data from parent (AccountManager.svelte)
    // ============================================================
    export let data = [];        // Array of { date: '2025-10-10', value: 5 }
    export let maxValue = 9;     // Max Y-axis value (9 for FREE, 25 for PRO)
    export let height = 200;     // Chart height in pixels
    export let color = '#eab308'; // Line color (yellow for FREE, purple for PRO)
    export let animate = true;   // Enable animations

    console.log('🎨 LineChart mounted with:', {
        dataPoints: data.length,
        maxValue,
        height,
        color,
        firstPoint: data[0],
        lastPoint: data[data.length - 1]
    });

    // ============================================================
    // STATE - Responsive width
    // ============================================================
    let containerWidth = 0;

    // ============================================================
    // REACTIVE CALCULATIONS - SVG dimensions
    // ============================================================
    $: svgWidth = containerWidth || 400;
    $: svgHeight = height;
    $: padding = { top: 20, right: 20, bottom: 40, left: 35 };
    $: chartWidth = svgWidth - padding.left - padding.right;
    $: chartHeight = svgHeight - padding.top - padding.bottom;

    console.log('📐 SVG Dimensions:', {
        svgWidth,
        svgHeight,
        chartWidth,
        chartHeight,
        padding
    });

    // ============================================================
    // REACTIVE CALCULATIONS - Data Validation
    // ============================================================
    $: validData = data.filter(d => d && typeof d.value === 'number');
    $: dataPoints = validData.length;
    $: hasData = dataPoints > 0;

    console.log('✅ Valid data points:', dataPoints, 'of', data.length);

    // ============================================================
    // REACTIVE CALCULATIONS - Scales (Data → Pixels)
    // ============================================================
    
    // X-axis scale: Index → Pixel position
    $: xScale = (index) => {
        // Spread data points evenly across chartWidth
        return (index / Math.max(1, dataPoints - 1)) * chartWidth;
    };
    
    // Y-axis scale: Value → Pixel position
    $: yScale = (value) => {
        // Invert: 0 is at bottom, maxValue is at top
        return chartHeight - (value / maxValue) * chartHeight;
    };

    console.log('📊 Scales created:', {
        xScale: 'index → pixels',
        yScale: 'value → pixels',
        example: {
            point0: { x: xScale(0), y: yScale(validData[0]?.value || 0) },
            pointLast: { 
                x: xScale(dataPoints - 1), 
                y: yScale(validData[dataPoints - 1]?.value || 0) 
            }
        }
    });

    // ============================================================
    // REACTIVE CALCULATIONS - SVG Path for Line
    // ============================================================
    $: linePath = hasData ? (() => {
        let path = '';
        
        validData.forEach((point, i) => {
            const x = xScale(i);
            const y = yScale(point.value);
            
            if (i === 0) {
                path += `M ${x} ${y}`; // Move to first point
            } else {
                path += ` L ${x} ${y}`; // Line to next point
            }
        });
        
        console.log('📈 Line path generated:', path.substring(0, 100) + '...');
        return path;
    })() : null;

    // Example linePath:
    // "M 0 120 L 15 100 L 30 140 L 45 110 ... L 400 130"
    //  ↑        ↑         ↑         ↑              ↑
    //  Move to  Line to   Line to   Line to        Last point
    //  (x0,y0)  (x1,y1)   (x2,y2)   (x3,y3)        (xN,yN)

    // ============================================================
    // REACTIVE CALCULATIONS - SVG Path for Filled Area
    // ============================================================
    $: areaPath = hasData && linePath ? (() => {
        // Start with line path, then close to bottom
        let path = linePath;
        
        // Close path at bottom
        path += ` L ${xScale(dataPoints - 1)} ${chartHeight}`; // Bottom right
        path += ` L ${xScale(0)} ${chartHeight}`;              // Bottom left
        path += ' Z';                                           // Close path
        
        console.log('🎨 Area path generated (with fill)');
        return path;
    })() : null;

    // Example areaPath:
    // "M 0 120 L 15 100 L 30 140 ... L 400 130 L 400 180 L 0 180 Z"
    //  ↑                               ↑         ↑         ↑       ↑
    //  Same as line                    Last      Bottom    Bottom  Close
    //  path                            point     right     left    path

    // ============================================================
    // REACTIVE CALCULATIONS - Grid Lines (Y-axis)
    // ============================================================
    $: gridLines = (() => {
        const lines = [];
        const step = Math.ceil(maxValue / 4); // 4 horizontal lines
        
        for (let value = 0; value <= maxValue; value += step) {
            lines.push({
                y: yScale(value),
                label: value.toString()
            });
        }
        
        console.log('📏 Grid lines:', lines.length, 'lines at', step, 'intervals');
        return lines;
    })();

    // Example gridLines for maxValue = 9:
    // [
    //     { y: 180, label: "0" },   ← Bottom
    //     { y: 135, label: "3" },
    //     { y: 90,  label: "6" },
    //     { y: 45,  label: "9" }    ← Top
    // ]

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================
    
    function formatDate(dateStr) {
        // "2025-10-10" → "10.10"
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month.substring(1) || month}`;
    }

    function getPointColor(value) {
        // Color based on usage (green = low, yellow = medium, red = high)
        const ratio = value / maxValue;
        if (ratio < 0.5) return '#10b981'; // green-500
        if (ratio < 0.8) return '#eab308'; // yellow-500
        return '#ef4444'; // red-500
    }

    // ============================================================
    // LIFECYCLE - Measure container width for responsiveness
    // ============================================================
    onMount(() => {
        const updateWidth = () => {
            const container = document.querySelector('.line-chart-container');
            if (container) {
                containerWidth = container.clientWidth;
                console.log('📐 Container width measured:', containerWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    });
</script>

<!-- ============================================================ -->
<!-- SVG RENDERING - Final Output                                -->
<!-- ============================================================ -->
<div class="line-chart-container w-full" in:fade={{ duration: 300 }}>
    {#if hasData}
        <svg
            width="100%"
            height={height}
            viewBox="0 0 {svgWidth} {svgHeight}"
            preserveAspectRatio="xMidYMid meet"
            class="w-full h-auto"
            role="img"
            aria-label="Daily Usage Chart"
        >
            <!-- Gradients & Filters -->
            <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:{color};stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:{color};stop-opacity:0.05" />
                </linearGradient>
                
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- Chart Group (offset by padding) -->
            <g transform="translate({padding.left}, {padding.top})">

                <!-- Grid Lines (Horizontal) -->
                {#each gridLines as line}
                    <line
                        x1="0"
                        y1={line.y}
                        x2={chartWidth}
                        y2={line.y}
                        stroke="#e5e7eb"
                        stroke-width="1"
                        stroke-dasharray="4,4"
                        opacity="0.5"
                    />
                    <text
                        x="-10"
                        y={line.y + 4}
                        text-anchor="end"
                        font-size="12"
                        fill="#6b7280"
                    >
                        {line.label}
                    </text>
                {/each}

                <!-- Filled Area Under Line -->
                {#if areaPath}
                    <path
                        d={areaPath}
                        fill="url(#areaGradient)"
                        in:fade={{ duration: 600, delay: 200 }}
                    />
                {/if}

                <!-- Line (Animated) -->
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
                    <!--
                        in:draw animation:
                        - Draws path from start to end over 1000ms
                        - Uses cubic-in-out easing for smooth acceleration/deceleration
                        - Creates "drawing" effect
                    -->
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

                <!-- Data Points (Circles) -->
                {#each validData as point, i}
                    {@const x = xScale(i)}
                    {@const y = yScale(point.value)}
                    {@const pointColor = getPointColor(point.value)}

                    <g
                        class="cursor-pointer transition-transform hover:scale-125"
                        in:fade={{ duration: 400, delay: 800 + (i * 50) }}
                    >
                        <!--
                            Staggered animation:
                            - Each point fades in with 50ms delay after previous
                            - First point: 800ms delay
                            - Last point (28th): 800 + (27 * 50) = 2150ms delay
                            - Creates wave effect
                        -->
                        
                        <!-- Point Glow -->
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

                        <!-- Tooltip -->
                        <title>{point.date}: {point.value} generations</title>
                    </g>
                {/each}

                <!-- X-axis Labels (Dates) -->
                {#each validData as point, i}
                    {@const x = xScale(i)}
                    {@const showLabel = dataPoints <= 14 || i % Math.ceil(dataPoints / 10) === 0}
                    {#if showLabel}
                        <text
                            x={x}
                            y={chartHeight + 20}
                            text-anchor="middle"
                            font-size="11"
                            fill="#6b7280"
                        >
                            {formatDate(point.date)}
                        </text>
                    {/if}
                {/each}

            </g>
        </svg>
    {:else}
        <!-- No Data State -->
        <div class="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
            <p class="text-gray-500 text-sm">📊 Keine Daten verfügbar</p>
        </div>
    {/if}
</div>
```

---

## 🎬 **Animation Timeline**

```
Time    Event
━━━━    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0ms     Component mounts
        └─ Container fades in (300ms fade)

200ms   Area gradient starts fading in

400ms   Area fully visible

0-1000ms Line draws from left to right
        └─ Smooth cubic-in-out easing
        └─ "Drawing" effect with in:draw

800ms   First data point appears
        └─ Fade in (400ms)

850ms   Second data point appears
        └─ 50ms delay after first

900ms   Third data point appears
        └─ 50ms delay after second

...     (each point +50ms delay)

2150ms  Last data point (28th) appears
        └─ 800 + (27 * 50) = 2150ms total delay

2550ms  All animations complete!
        └─ Chart fully rendered and interactive
```

---

## 📊 **Example: 28 Data Points → SVG Coordinates**

### Input Data (from Google Sheets):
```javascript
usageHistory = [
    { date: "2025-10-10", used: 5 },  // Index 0
    { date: "2025-10-09", used: 7 },  // Index 1
    { date: "2025-10-08", used: 4 },  // Index 2
    ...
    { date: "2025-09-13", used: 6 }   // Index 27
]
```

### SVG Calculations:
```javascript
// Chart dimensions
svgWidth = 800;      // From container measurement
svgHeight = 200;     // From prop
padding = { top: 20, right: 20, bottom: 40, left: 35 };
chartWidth = 800 - 35 - 20 = 745;
chartHeight = 200 - 20 - 40 = 140;

// Scales
xScale = (index) => (index / 27) * 745;
yScale = (value) => 140 - (value / 9) * 140;

// Point calculations
Point 0 (2025-10-10, used: 5):
  x = (0 / 27) * 745 = 0
  y = 140 - (5 / 9) * 140 = 140 - 77.78 = 62.22
  → SVG: <circle cx="0" cy="62.22" />

Point 1 (2025-10-09, used: 7):
  x = (1 / 27) * 745 = 27.59
  y = 140 - (7 / 9) * 140 = 140 - 108.89 = 31.11
  → SVG: <circle cx="27.59" cy="31.11" />

Point 27 (2025-09-13, used: 6):
  x = (27 / 27) * 745 = 745
  y = 140 - (6 / 9) * 140 = 140 - 93.33 = 46.67
  → SVG: <circle cx="745" cy="46.67" />

// Line path
linePath = "M 0 62.22 L 27.59 31.11 L 55.18 85.56 ... L 745 46.67"
           ↑ Move to    ↑ Line to      ↑ Line to        ↑ Last point
           first point  second point   third point      (27th index)
```

### Final SVG Output:
```svg
<svg width="100%" height="200" viewBox="0 0 800 200">
    <g transform="translate(35, 20)">
        <!-- Area -->
        <path 
            d="M 0 62.22 L 27.59 31.11 L ... L 745 46.67 L 745 140 L 0 140 Z" 
            fill="url(#areaGradient)"
        />
        
        <!-- Line -->
        <path 
            d="M 0 62.22 L 27.59 31.11 L 55.18 85.56 ... L 745 46.67" 
            stroke="#eab308" 
            stroke-width="3"
            fill="none"
        />
        
        <!-- Points -->
        <circle cx="0" cy="62.22" r="4" fill="#10b981" />      <!-- 5/9 = green -->
        <circle cx="27.59" cy="31.11" r="4" fill="#ef4444" />  <!-- 7/9 = red -->
        <circle cx="55.18" cy="85.56" r="4" fill="#10b981" />  <!-- 4/9 = green -->
        ...
        <circle cx="745" cy="46.67" r="4" fill="#eab308" />    <!-- 6/9 = yellow -->
    </g>
</svg>
```

---

## 🔄 **Reactive Flow Summary**

```javascript
// 1. User logs in → accountStore loads from API
currentAccount.set({
    metadata: {
        usageHistory: [28 entries]
    }
})

// 2. AccountManager.svelte reacts
$: usageHistory = getUsageHistory($currentAccount);
// → usageHistory = [28 entries]

// 3. AccountManager.svelte generates chart data
$: usageChartData = generateChartData('4w', usageHistory);
// → usageChartData = [28 entries with { date, value }]

// 4. LineChart.svelte receives data
<LineChart data={usageChartData} />

// 5. LineChart.svelte calculates scales
$: xScale = (index) => (index / 27) * chartWidth;
$: yScale = (value) => chartHeight - (value / maxValue) * chartHeight;

// 6. LineChart.svelte generates SVG paths
$: linePath = validData.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.value)}`
).join(' ');

// 7. Svelte renders SVG with animations
<path d={linePath} in:draw={{ duration: 1000 }} />
{#each validData as point, i}
    <circle 
        cx={xScale(i)} 
        cy={yScale(point.value)} 
        in:fade={{ delay: 800 + i * 50 }}
    />
{/each}

// 8. User sees animated chart! ✨
```

---

## 🎯 **Key Takeaways**

### 1. **Data Flow is Completely Reactive**
- Any change to `currentAccount` → triggers `getUsageHistory()`
- Any change to `usageHistory` → triggers `generateChartData()`
- Any change to `usageChartData` → triggers LineChart rerender
- Svelte handles all the updates automatically!

### 2. **SVG is Generated from Pure JavaScript**
- No libraries (Chart.js, D3, etc.)
- Just math: `xScale()` and `yScale()`
- Paths are strings: `"M x y L x y L x y"`
- Svelte's reactivity recalculates everything

### 3. **Animations are Built-in Svelte Transitions**
- `in:fade` for opacity
- `in:draw` for path drawing
- `delay` for staggered effects
- No CSS animations needed!

### 4. **Responsive by Design**
- Container width measured with `onMount()`
- All calculations based on measured width
- `viewBox` ensures scaling on any screen

---

## 🧪 **Debug in Browser Console**

```javascript
// Check data at each step:

// Step 1: Raw account data
console.log('Raw:', window.$currentAccount?.metadata?.usageHistory);

// Step 2: Extracted history
import { getUsageHistory } from './src/utils/usageHistoryHelpers.js';
const history = getUsageHistory(window.$currentAccount);
console.log('Extracted:', history.length, 'entries');

// Step 3: Inspect LineChart component (after mount)
// Find the SVG element
const svg = document.querySelector('svg[role="img"]');
console.log('SVG:', svg);

// Find the path element
const path = svg.querySelector('path[stroke]');
console.log('Path d attribute:', path.getAttribute('d'));

// Find all circles
const circles = svg.querySelectorAll('circle');
console.log('Circles:', circles.length);
circles.forEach((c, i) => {
    console.log(`Circle ${i}:`, {
        cx: c.getAttribute('cx'),
        cy: c.getAttribute('cy'),
        fill: c.getAttribute('fill')
    });
});
```

---

## ✅ **Complete Flow Verified!**

```
✅ Google Sheets → n8n → API → currentAccount store
✅ currentAccount → getUsageHistory() → usageHistory array
✅ usageHistory → generateChartData() → usageChartData array
✅ usageChartData → LineChart prop
✅ LineChart → xScale/yScale calculations
✅ Scales → SVG path & circle coordinates
✅ SVG → Animated rendering with transitions
✅ User sees beautiful chart! 🎉
```

**Alles klar erklärt vom Daten-Array bis zum finalen animierten SVG! 🚀**

