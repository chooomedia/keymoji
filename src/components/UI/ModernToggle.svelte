<!-- src/components/UI/ModernToggle.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let id;
    export let checked = false;
    export let disabled = false;
    export let label = '';
    export let description = '';
    
    // Event dispatcher
    const dispatch = createEventDispatcher();
    
    // Handle toggle change
    function handleToggleChange(event) {
        if (disabled) return;
        
        const newValue = event.target.checked;
        checked = newValue;
        
        dispatch('change', { checked: newValue });
    }
</script>

<div class="flex items-center justify-between">
    <div class="flex-1">
        {#if label}
            <label for={id} class="text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
        {/if}
        {#if description}
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {description}
            </p>
        {/if}
    </div>
    
    <label
        for={id}
        class="relative block h-8 w-14 rounded-full transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-yellow-500 dark:bg-aubergine-900 {checked ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-gray-300 dark:bg-aubergine-900'}"
    >
        <input 
            type="checkbox" 
            {id} 
            class="peer sr-only" 
            bind:checked 
            on:change={handleToggleChange}
            {disabled}
        />

        <span
            class="absolute inset-y-0 start-0 m-1 grid size-6 place-content-center rounded-full bg-white text-gray-500 transition-[inset-inline-start] peer-checked:start-6 peer-checked:*:first:hidden *:last:hidden peer-checked:*:last:block dark:bg-aubergine-800 dark:text-creme-500"
        >
            <!-- X Icon (unchecked) -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

            <!-- Check Icon (checked) -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
        </span>
    </label>
</div> 