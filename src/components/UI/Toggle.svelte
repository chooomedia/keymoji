<!-- src/components/UI/Toggle.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let id = '';
    export let checked = false;
    export let disabled = false;
    export let color = 'yellow'; // yellow, green, blue, purple, red, etc.

    function handleChange(event) {
        if (!disabled) {
            checked = event.target.checked;
            dispatch('change', { checked, id });
        }
    }

    // Get color classes based on color prop
    function getColorClasses() {
        const colorMap = {
            yellow: 'bg-yellow-500',
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            purple: 'bg-purple-500',
            red: 'bg-red-500',
            pink: 'bg-pink-500',
            indigo: 'bg-indigo-500',
            teal: 'bg-teal-500',
            orange: 'bg-orange-500',
            emerald: 'bg-emerald-500',
            cyan: 'bg-cyan-500',
            lime: 'bg-lime-500',
            amber: 'bg-amber-500',
            rose: 'bg-rose-500',
            violet: 'bg-violet-500',
            sky: 'bg-sky-500',
            slate: 'bg-slate-500'
        };
        
        return colorMap[color] || 'bg-yellow-500';
    }
</script>

<div class="ml-6 mr-2">
    <label
        for={id}
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out {checked ? getColorClasses() : 'bg-gray-200 dark:bg-gray-700'} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
        aria-checked={checked}
        aria-labelledby="{id}-label"
    >
        <input 
            type="checkbox" 
            {id}
            class="sr-only" 
            bind:checked
            on:change={handleChange}
            {disabled}
            role="switch"
            aria-checked={checked}
        />

        <!-- Toggle Track -->
        <div class="absolute inset-0 rounded-full border border-gray-light dark:border-aubergine-800 transition-colors duration-300 ease-in-out {checked ? getColorClasses() : 'bg-gray-200 dark:bg-gray-700'}"></div>
        
        <!-- Toggle Thumb -->
        <div
            class="relative h-5 w-5 rounded-full bg-white dark:bg-aubergine-900 shadow-sm transition-all duration-300 ease-in-out transform {checked ? 'translate-x-5' : 'translate-x-0'}"
            style="left: 0.125rem;"
        >
            <!-- Check Icon (checked) -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="absolute inset-0 w-4 h-4 m-auto text-gray-400 dark:text-creme-500 transition-opacity duration-300 {checked ? 'opacity-100' : 'opacity-0'}"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>

            <!-- X Icon (unchecked) -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="absolute inset-0 w-4 h-4 m-auto text-gray-400 dark:text-creme-500 transition-opacity duration-300 {checked ? 'opacity-0' : 'opacity-100'}"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </div>
    </label>
</div> 