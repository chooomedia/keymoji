<script>
  export let type = 'text';
  export let name = '';
  export let value = '';
  export let placeholder = '';
  export let disabled = false;
  export let required = false;
  export let id = '';
  
  // Handle different input types with separate components
  const inputClass = "w-full bg-white dark:bg-aubergine-900 dark:text-white rounded-xl border border-gray-light dark:border-aubergine-800 focus:ring-1 focus:ring-yellow-50 focus:border-transparent transition-all duration-200 placeholder-gray-light dark:placeholder-gray-light p-4 disabled:opacity-70 disabled:cursor-not-allowed";
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