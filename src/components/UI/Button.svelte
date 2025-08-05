<script>
  export let variant = 'default';
  export let size = 'md';
  export let disabled = false;
  export let type = 'button';
  export let href = null;
  export let fullWidth = false;
  
  const variants = {
    primary: 'bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 active:bg-yellow-700 text-black disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:active:bg-gray-400',
    secondary: 'bg-powder-200 dark:bg-aubergine-950 text-black dark:text-powder-50 border border-transparent hover:border-yellow-300 focus:border-yellow-300 active:border-yellow-400 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:border-gray-400 dark:disabled:border-gray-600 disabled:hover:border-transparent',
    default: 'bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 hover:bg-powder-100 dark:hover:bg-aubergine-800 focus:bg-powder-100 dark:focus:bg-aubergine-800 active:bg-powder-200 dark:active:bg-aubergine-700 disabled:bg-gray-300 dark:disabled:bg-gray-700',
    fixed: 'bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 border-4 border-creme-50 dark:border-aubergine-800 hover:border-yellow-300 dark:hover:border-yellow-300 focus:border-yellow-300 dark:focus:border-yellow-300 active:border-yellow-400 dark:active:border-yellow-400 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:border-gray-400 dark:disabled:border-gray-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 active:bg-yellow-700 text-black disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:active:bg-gray-400'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 h-14',
    menu: 'px-4 text-xl py-3',
    lg: 'px-6 py-4 text-3xl'
  };
  
  const baseClasses = 'transition transform hover:scale-105 focus:scale-105 active:scale-95 rounded-full font-medium focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100 disabled:focus:ring-0';
  
  $: buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`;
</script>

{#if href}
  <a {href} class={buttonClasses} class:pointer-events-none={disabled} target="_blank" rel="noopener noreferrer" aria-disabled={disabled}>
    <slot />
  </a>
{:else}
  <button {type} {disabled} class={buttonClasses} on:click aria-disabled={disabled}>
    <slot />
  </button>
{/if} 