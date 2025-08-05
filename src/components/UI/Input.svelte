<script>
  export let type = 'text';
  export let name = '';
  export let value = '';
  export let placeholder = '';
  export let disabled = false;
  export let required = false;
  export let id = '';
  export let invalid = false;
  export let valid = false;
  
  // Handle different input types with separate components
  const baseClasses = "w-full bg-white dark:bg-aubergine-900 dark:text-white rounded-xl border transition-all duration-200 placeholder-gray-light dark:placeholder-gray-light p-4";
  
  // State-specific classes
  const stateClasses = {
    default: "border-gray-light dark:border-aubergine-800 focus:ring-1 focus:ring-yellow-50 focus:border-transparent",
    invalid: "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 focus:ring-1 focus:ring-red-500 focus:border-red-500",
    valid: "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 focus:ring-1 focus:ring-green-500 focus:border-green-500",
    disabled: "opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
  };
  
  $: inputClass = `${baseClasses} ${disabled ? stateClasses.disabled : invalid ? stateClasses.invalid : valid ? stateClasses.valid : stateClasses.default}`;
</script>

{#if type === 'textarea'}
  <textarea 
    {id}
    {name}
    {placeholder}
    {disabled}
    {required}
    bind:value
    class={inputClass}
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
  ></textarea>
{:else if type === 'select'}
  <select 
    {id}
    {name}
    {disabled}
    {required}
    bind:value
    class="{inputClass} appearance-none bg-no-repeat pr-12"
    style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 20 20\' fill=\'none\' stroke=\'%23666\' stroke-width=\'2\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 8l4 4 4-4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E'); background-position: right 1rem center; background-size: 1.25rem;"
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
  >
    <slot />
  </select>
{:else if type === 'email'}
  <input 
    type="email"
    {id}
    {name}
    {placeholder}
    {disabled}
    {required}
    bind:value
    class={inputClass}
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
  />
{:else if type === 'password'}
  <input 
    type="password"
    {id}
    {name}
    {placeholder}
    {disabled}
    {required}
    bind:value
    class={inputClass}
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
  />
{:else}
  <input 
    type="text"
    {id}
    {name}
    {placeholder}
    {disabled}
    {required}
    bind:value
    class={inputClass}
    aria-invalid={invalid}
    aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
  />
{/if}

<style>
  /* Dark mode select arrow - scoped to this component */
  :global(.dark) select {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' stroke='%23fff' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
    background-position: right 1rem center !important;
    background-size: 1.25rem !important;
  }
</style> 