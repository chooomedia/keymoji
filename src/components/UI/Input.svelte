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
  export let autocomplete = '';
  
  // Handle different input types with separate components
  const baseClasses = "w-full bg-white dark:bg-aubergine-900 dark:text-white rounded-xl border transition-all duration-200 placeholder-gray-light dark:placeholder-gray-light p-4";
  
  // State-specific classes
  const stateClasses = {
    default: "border-gray-light dark:border-aubergine-800 focus:ring-1 focus:ring-yellow-50 focus:border-transparent",
    invalid: "border-2 border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-100 placeholder-red-400 dark:placeholder-red-600 focus:ring-2 focus:ring-red-500 focus:border-red-500",
    valid: "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 focus:ring-1 focus:ring-green-500 focus:border-green-500",
    disabled: "opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
  };
  
  $: inputClass = `${baseClasses} ${disabled ? stateClasses.disabled : invalid ? stateClasses.invalid : valid ? stateClasses.valid : stateClasses.default}`;
  
  // Get appropriate autocomplete value based on type and name
  function getAutocompleteValue() {
    if (autocomplete) return autocomplete;
    
    // Only add autocomplete for relevant input types
    const relevantTypes = ['text', 'email', 'password', 'tel', 'url', 'search'];
    if (!relevantTypes.includes(type)) return '';
    
    // Auto-detect based on type and name
    switch (type) {
      case 'email':
        return 'email';
      case 'password':
        return 'current-password';
      default:
        if (name.toLowerCase().includes('email')) return 'email';
        if (name.toLowerCase().includes('name') || name.toLowerCase().includes('fullname')) return 'name';
        if (name.toLowerCase().includes('given') || name.toLowerCase().includes('first')) return 'given-name';
        if (name.toLowerCase().includes('family') || name.toLowerCase().includes('last')) return 'family-name';
        if (name.toLowerCase().includes('phone') || name.toLowerCase().includes('tel')) return 'tel';
        if (name.toLowerCase().includes('url') || name.toLowerCase().includes('website')) return 'url';
        if (name.toLowerCase().includes('organization') || name.toLowerCase().includes('company')) return 'organization';
        if (name.toLowerCase().includes('street') || name.toLowerCase().includes('address')) return 'street-address';
        if (name.toLowerCase().includes('city')) return 'address-level2';
        if (name.toLowerCase().includes('state') || name.toLowerCase().includes('province')) return 'address-level1';
        if (name.toLowerCase().includes('zip') || name.toLowerCase().includes('postal')) return 'postal-code';
        if (name.toLowerCase().includes('country')) return 'country';
        if (name.toLowerCase().includes('username') || name.toLowerCase().includes('user')) return 'username';
        if (name.toLowerCase().includes('new-password')) return 'new-password';
        if (name.toLowerCase().includes('current-password')) return 'current-password';
        if (name.toLowerCase().includes('search')) return 'search';
        return '';
    }
  }
  
  // Get emoji for input type
  function getInputEmoji() {
    switch (type) {
      case 'email':
        return '📧';
      case 'password':
        return '🔒';
      case 'tel':
      case 'phone':
        return '📞';
      case 'url':
        return '🌐';
      case 'search':
        return '🔍';
      default:
        if (name.toLowerCase().includes('name') || name.toLowerCase().includes('fullname')) return '👤';
        if (name.toLowerCase().includes('email')) return '📧';
        if (name.toLowerCase().includes('phone') || name.toLowerCase().includes('tel')) return '📞';
        if (name.toLowerCase().includes('url') || name.toLowerCase().includes('website')) return '🌐';
        if (name.toLowerCase().includes('search')) return '🔍';
        return '';
    }
  }
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
    autocomplete={getAutocompleteValue()}
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
    autocomplete={getAutocompleteValue()}
  >
    <slot />
  </select>
{:else if type === 'email'}
  <div class="relative">
    <input 
      type="email"
      {id}
      {name}
      {placeholder}
      {disabled}
      {required}
      bind:value
      class="{inputClass} pl-12"
      aria-invalid={invalid}
      aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
      autocomplete={getAutocompleteValue()}
    />
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <span class="text-gray-400 dark:text-gray-500 text-lg">{getInputEmoji()}</span>
    </div>
  </div>
{:else if type === 'password'}
  <div class="relative">
    <input 
      type="password"
      {id}
      {name}
      {placeholder}
      {disabled}
      {required}
      bind:value
      class="{inputClass} pl-12"
      aria-invalid={invalid}
      aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
      autocomplete={getAutocompleteValue()}
    />
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <span class="text-gray-400 dark:text-gray-500 text-lg">{getInputEmoji()}</span>
    </div>
  </div>
{:else}
  <div class="relative">
    <input 
      type="text"
      {id}
      {name}
      {placeholder}
      {disabled}
      {required}
      bind:value
      class="{inputClass} {getInputEmoji() ? 'pl-12' : ''}"
      aria-invalid={invalid}
      aria-describedby={invalid ? `${id}-error` : valid ? `${id}-success` : undefined}
      autocomplete={getAutocompleteValue()}
    />
    {#if getInputEmoji()}
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span class="text-gray-400 dark:text-gray-500 text-lg">{getInputEmoji()}</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  /* Dark mode select arrow - scoped to this component */
  :global(.dark) select {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' stroke='%23fff' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
    background-position: right 1rem center !important;
    background-size: 1.25rem !important;
  }
</style> 