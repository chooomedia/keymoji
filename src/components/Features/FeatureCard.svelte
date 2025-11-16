<!-- src/components/Features/FeatureCard.svelte -->
<script>
    // Props
    export let icon = '📝';
    export let title = 'Feature Title';
    export let description = 'Feature description';
    export let variant = 'default'; // default, coming-soon, beta, pro
    export let href = null; // Optional link
    export let onClick = null; // Optional click handler
    
    // Variant classes
    const variantClasses = {
        default: {
            container: 'bg-white dark:bg-aubergine-900',
            iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900',
            iconColor: 'text-purple-600 dark:text-purple-400',
            titleColor: 'text-black dark:text-white',
            descriptionColor: 'text-gray-600 dark:text-gray-400'
        },
        'coming-soon': {
            container: 'bg-yellow-50 dark:bg-yellow-900/20',
            iconBg: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            titleColor: 'text-yellow-800 dark:text-yellow-200',
            descriptionColor: 'text-yellow-600 dark:text-yellow-400'
        },
        beta: {
            container: 'bg-blue-50 dark:bg-blue-900/20',
            iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900',
            iconColor: 'text-blue-600 dark:text-blue-400',
            titleColor: 'text-blue-800 dark:text-blue-200',
            descriptionColor: 'text-blue-600 dark:text-blue-400'
        },
        pro: {
            container: 'bg-purple-50 dark:bg-purple-900/20',
            iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900',
            iconColor: 'text-purple-600 dark:text-purple-400',
            titleColor: 'text-purple-800 dark:text-purple-200',
            descriptionColor: 'text-purple-600 dark:text-purple-400'
        }
    };
    
    $: classes = variantClasses[variant];
    
    function handleClick() {
        if (onClick) onClick();
    }
</script>

<div class="w-full max-w-md mx-auto mb-4">
    {#if href}
        <a 
            href={href}
            class="block {classes.container} rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer"
            on:click={handleClick}
        >
            <div class="flex items-center p-4">
                <div class="flex-shrink-0 w-14 h-14 {classes.iconBg} rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                    <span class="{classes.iconColor} text-2xl">{icon}</span>
                </div>
                <div>
                    <span class="text-md font-bold {classes.titleColor} block">{title}</span>
                    <p class="{classes.descriptionColor} text-sm mt-1">{description}</p>
                </div>
            </div>
        </a>
    {:else}
        <div 
            class="{classes.container} rounded-xl transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg {onClick ? 'cursor-pointer' : ''}"
            role={onClick ? 'button' : undefined}
            tabindex={onClick ? 0 : -1}
            on:click={handleClick}
            on:keydown={(e) => onClick && e.key === 'Enter' && handleClick(e)}
        >
            <div class="flex items-center p-4">
                <div class="flex-shrink-0 w-14 h-14 {classes.iconBg} rounded-full flex items-center justify-center mr-5 transition-transform duration-300 hover:rotate-12">
                    <span class="{classes.iconColor} text-2xl">{icon}</span>
                </div>
                <div>
                    <span class="text-md font-bold {classes.titleColor} block">{title}</span>
                    <p class="{classes.descriptionColor} text-sm mt-1">{description}</p>
                </div>
            </div>
        </div>
    {/if}
</div> 