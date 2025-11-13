<!-- src/components/UI/ContextBadge.svelte -->
<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    
    const dispatch = createEventDispatcher();
    
    // Props
    export let text = '';
    export let position = 'top'; // top, bottom, left, right
    export let variant = 'info'; // info, warning, success, error
    export let size = 'md'; // sm, md, lg - beeinflusst sowohl Spacing als auch Text-Größe
    export let width = null; // null, 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full' - Tailwind width classes
    export let trigger = 'hover'; // hover, click, both
    export let intro = false; // Auto-show/hide animation
    export let introDelay = 2000; // Delay before showing (ms)
    export let introDuration = 3000; // How long to show (ms)
    export let disabled = false;
    export let alwaysVisible = false; // Always show the badge
    
    // Tier Badge specific props
    export let tier = null; // 'free' or 'pro'
    export let accountAgeLabel = ''; // Pre-formatted age label
    export let translations = null;
    
    // Internal state
    let isVisible = false;
    let isIntroActive = false;
    let introTimeout;
    let hideTimeout;
    let badgeElement;
    
    // Reactive visibility based on alwaysVisible prop
    $: if (alwaysVisible) {
        isVisible = true;
    }
    
    // Tier Badge specific logic
    $: isTierBadge = tier !== null;
    // Badge zeigt NUR den Tier-Status
    $: tierText = tier === 'pro' ? '💎 PRO' : '✨ FREE';
    $: tierBgClass = tier === 'pro' ? 'bg-purple-700' : 'bg-yellow-600';
    // Tooltip zeigt die Account-Age (z.B. "Seit 7 Tagen!")
    // CRITICAL: accountAgeLabel sollte bereits formatiert sein (z.B. "Seit 11 Tagen!")
    // Falls leer, verwende Fallback
    $: tierTooltipText = (() => {
        if (accountAgeLabel && accountAgeLabel.trim() !== '') {
            return accountAgeLabel;
        }
        // Fallback: Verwende accountCreated oder generischen Text
        return translations?.accountCreated || 'Account erstellt';
    })();
    
    // Debug logging
    $: if (isTierBadge) {
        console.log('🔍 [ContextBadge] Tier Badge Tooltip:', {
            accountAgeLabel,
            tierTooltipText,
            hasTranslations: !!translations,
            accountCreated: translations?.accountCreated
        });
    }
    
    // SVG Arrow color based on variant - use background color for the arrow
    $: arrowColor = variantClasses[variant].bg;
    $: arrowBorderColor = variantClasses[variant].border;
    
    // Special colors for standard variant triangle
    $: standardArrowColor = variant === 'standard' ? 'bg-creme-500 dark:bg-aubergine-950' : arrowColor;
    $: standardArrowBorderColor = variant === 'standard' ? 'border-gray-200 dark:border-gray-600' : arrowBorderColor;
    
    // Size classes - erweitert um Text-Größe und Spacing
    const sizeClasses = {
        sm: {
            spacing: 'px-2 py-1',
            text: 'text-xs'
        },
        md: {
            spacing: 'px-3 py-1.5',
            text: 'text-sm'
        },
        lg: {
            spacing: 'px-4 py-2',
            text: 'text-base'
        }
    };
    
    // Width classes
    const widthClasses = {
        xs: 'w-16',
        sm: 'w-24',
        md: 'w-32',
        lg: 'w-40',
        xl: 'w-48',
        '2xl': 'w-56',
        '3xl': 'w-64',
        '4xl': 'w-72',
        '5xl': 'w-80',
        '6xl': 'w-96',
        '7xl': 'w-[28rem]',
        full: 'w-full'
    };
    
    // Variant classes
    const variantClasses = {
        standard: {
            bg: 'bg-white dark:bg-gray-800',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-gray-200 dark:border-gray-600',
            icon: null
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/80',
            text: 'text-blue-800 dark:text-blue-200',
            border: 'border-blue-200 dark:border-blue-700',
            icon: 'ℹ️'
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/80',
            text: 'text-yellow-800 dark:text-yellow-200',
            border: 'border-yellow-200 dark:border-yellow-700',
            icon: '⚠️'
        },
        success: {
            bg: 'bg-green-50 dark:bg-green-900/80',
            text: 'text-green-800 dark:text-green-200',
            border: 'border-green-200 dark:border-green-700',
            icon: '✅'
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/80',
            text: 'text-red-800 dark:text-red-200',
            border: 'border-red-200 dark:border-red-700',
            icon: '❌'
        }
    };
    
    // Position classes
    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    
    // Arrow classes for different positions
    const arrowClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 rotate-180',
        left: 'left-full top-1/2 transform -translate-y-1/2 -rotate-90',
        right: 'right-full top-1/2 transform -translate-y-1/2 rotate-90'
    };
    
    // Event handlers
    function handleMouseEnter() {
        if (alwaysVisible) return;
        if (trigger === 'hover' || trigger === 'both') {
            showBadge();
        }
    }
    
    function handleMouseLeave() {
        if (alwaysVisible) return;
        if (trigger === 'hover' || trigger === 'both') {
            hideBadge();
        }
    }
    
    function handleClick() {
        if (alwaysVisible) return;
        if (trigger === 'click' || trigger === 'both') {
            toggleBadge();
        }
    }
    
    function showBadge() {
        if (disabled) return;
        isVisible = true;
        dispatch('show');
    }
    
    function hideBadge() {
        if (disabled) return;
        isVisible = false;
        dispatch('hide');
    }
    
    function toggleBadge() {
        if (disabled) return;
        isVisible = !isVisible;
        dispatch(isVisible ? 'show' : 'hide');
    }
    
    // Intro animation logic
    function startIntroAnimation() {
        if (!intro || disabled) return;
        
        isIntroActive = true;
        isVisible = true;
        dispatch('intro:start');
        
        // Hide after duration
        hideTimeout = setTimeout(() => {
            isVisible = false;
            isIntroActive = false;
            dispatch('intro:end');
        }, introDuration);
    }
    
    // Cleanup timeouts
    function clearTimeouts() {
        if (introTimeout) clearTimeout(introTimeout);
        if (hideTimeout) clearTimeout(hideTimeout);
    }
    
    // Lifecycle
    onMount(() => {
        if (intro) {
            introTimeout = setTimeout(startIntroAnimation, introDelay);
        }
        
        return () => {
            clearTimeouts();
        };
    });
    
    // Reactive classes
    // CRITICAL: For tier badges, use auto width (fit content), not fixed width
    $: badgeClasses = [
        'absolute z-50 rounded-xl border shadow-xl',
        sizeClasses[size].spacing,
        sizeClasses[size].text,
        variantClasses[variant].bg,
        variantClasses[variant].text,
        variantClasses[variant].border,
        positionClasses[position],
        'pointer-events-none',
        'transition-all duration-200 ease-out',
        'backdrop-blur-sm',
        // For tier badges, use auto width (fit content), otherwise use specified width or max-w-xs
        isTierBadge ? 'whitespace-nowrap' : (width ? widthClasses[width] : 'max-w-xs')
    ].filter(Boolean).join(' ');
    
    $: arrowClassesFinal = [
        'absolute',
        arrowClasses[position]
    ].filter(Boolean).join(' ');
    
    $: containerClasses = [
        'relative inline-block',
        !alwaysVisible && (trigger === 'hover' || trigger === 'both') ? 'cursor-help' : '',
        !alwaysVisible && (trigger === 'click' || trigger === 'both') ? 'cursor-pointer' : ''
    ].filter(Boolean).join(' ');
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
    bind:this={badgeElement}
    class={containerClasses}
    on:mouseenter={!alwaysVisible ? handleMouseEnter : undefined}
    on:mouseleave={!alwaysVisible ? handleMouseLeave : undefined}
    on:click={!alwaysVisible && (trigger === 'click' || trigger === 'both') ? handleClick : undefined}
    on:keydown={!alwaysVisible && (trigger === 'click' || trigger === 'both') ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } } : undefined}
>
    <!-- Slot for parent content -->
    <slot />
    
    <!-- Tier Badge Variant -->
    {#if isTierBadge}
        <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-creme-500 dark:text-white {tierBgClass} cursor-pointer">
            {tierText}
        </span>
    {/if}
    
    <!-- Context Badge -->
    {#if isVisible}
        <div
            id="context-badge"
            class={badgeClasses}
            role="tooltip"
            aria-live="polite"
            in:fly={{ y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, 
                     x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
                     duration: 200, easing: cubicOut }}
            out:fly={{ y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
                      x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
                      duration: 200, easing: cubicOut }}
        >
            <div class="flex items-center space-x-1 {variant === 'standard' ? '' : 'px-3 py-2'}">
                {#if variantClasses[variant].icon}
                    <span class="flex-shrink-0 {sizeClasses[size].text}">{variantClasses[variant].icon}</span>
                {/if}
                <span class="font-medium leading-relaxed {sizeClasses[size].text}">{isTierBadge ? tierTooltipText : text}</span>
            </div>
            
            <!-- Arrow pointing to parent -->
            <div class={arrowClassesFinal}>
                <!-- First element: square with border -->
                <div class="dark:bg-aubergine-800 bg-creme-500 absolute w-2.5 h-2.5 border border-gray-600 transform rotate-45" style="top: -5px; left: 50%; margin-left: -4px;"></div>
                <!-- Second element: rotated rectangle -->
                <div class="absolute transform rotate-45 {variantClasses[variant].bg}" style="width:10px; height:10px; top: -6px; left: -4px; right: 0px;"></div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Ensure proper positioning */
    :global(.context-badge-container) {
        position: relative;
    }
    
    /* Smooth transitions */
    .badge-enter {
        opacity: 0;
        transform: scale(0.9);
    }
    
    .badge-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 200ms ease-out, transform 200ms ease-out;
    }
    
    .badge-exit {
        opacity: 1;
        transform: scale(1);
    }
    
    .badge-exit-active {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 200ms ease-out, transform 200ms ease-out;
    }
</style> 