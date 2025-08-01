<!-- src/components/UI/Checkbox.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    export let checked = false;
    export let disabled = false;
    export let id = '';
    export let name = '';
    export let label = '';
    export let labelHtml = '';
    export let labelClass = 'text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none';
    export let size = 'md'; // sm, md, lg
    export let variant = 'default'; // default, primary, success, warning, error
    
    // Size classes
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5', 
        lg: 'h-6 w-6'
    };
    
    // Variant classes
    const variantClasses = {
        default: {
            unchecked: 'bg-creme-500 dark:bg-aubergine-900 border-gray-light dark:border-aubergine-700',
            checked: 'bg-blue-600 border-blue-600', 
            focus: 'focus:ring-blue-500 dark:focus:ring-blue-400'
        },
        primary: {
            unchecked: 'bg-creme-500 dark:bg-aubergine-900 border-gray-light dark:border-aubergine-700',
            checked: 'bg-yellow-500 border-yellow-500',
            focus: 'focus:ring-yellow-500 dark:focus:ring-yellow-400'
        },
        success: {
            unchecked: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
            checked: 'bg-green-600 border-green-600',
            focus: 'focus:ring-green-500 dark:focus:ring-green-400'
        },
        warning: {
            unchecked: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
            checked: 'bg-orange-500 border-orange-500',
            focus: 'focus:ring-orange-500 dark:focus:ring-orange-400'
        },
        error: {
            unchecked: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
            checked: 'bg-red-600 border-red-600',
            focus: 'focus:ring-red-500 dark:focus:ring-red-400'
        }
    };
    
    function handleChange(event) {
        checked = event.target.checked;
        dispatch('change', { checked, event });
    }
    
    $: checkboxClasses = [
        sizeClasses[size],
        'rounded border transition-colors duration-200 appearance-none cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        checked ? variantClasses[variant].checked : variantClasses[variant].unchecked,
        variantClasses[variant].focus
    ].filter(Boolean).join(' ');
    
    $: iconSize = {
        sm: 'h-2.5 w-2.5',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    }[size];
</script>

<div class="flex items-start space-x-3">
    <div class="relative flex items-center">
        <input
            {id}
            {name}
            type="checkbox"
            bind:checked
            {disabled}
            on:change={handleChange}
            class={checkboxClasses}
            aria-describedby="{id}-description"
        />
        
        <!-- Custom checkmark icon -->
        {#if checked}
            <svg 
                class="absolute inset-0 m-auto {iconSize} text-aubergine-800 pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="3" 
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        {/if}
    </div>
    
    {#if label || labelHtml}
        <label 
            for={id} 
            class={labelClass}
            class:opacity-50={disabled}
        >
            {#if labelHtml}
                {@html labelHtml}
            {:else}
                {label}
            {/if}
        </label>
    {/if}
</div> 