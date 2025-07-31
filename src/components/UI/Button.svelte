<script>
  export let variant = 'default';
  export let size = 'md';
  export let disabled = false;
  export let type = 'button';
  export let href = null;
  export let fullWidth = false;
  
  const variants = {
    primary: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    secondary: 'bg-powder-200 dark:bg-aubergine-950 text-black dark:text-powder-50 border border-transparent hover:border-yellow-300',
    default: 'bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50',
    fixed: 'bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 border-4 border-creme-50 dark:border-aubergine-800',
    yellow: 'bg-yellow-500 text-black'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 h-14',
    menu: 'px-4 text-xl py-3',
    lg: 'px-6 py-4 text-3xl'
  };
  
  const baseClasses = 'transition transform hover:scale-105 rounded-full font-medium focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  $: buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`;
</script>

{#if href}
  <a {href} class={buttonClasses} class:pointer-events-none={disabled} target="_blank" rel="noopener noreferrer">
    <slot />
  </a>
{:else}
  <button {type} {disabled} class={buttonClasses} on:click>
    <slot />
  </button>
{/if} 