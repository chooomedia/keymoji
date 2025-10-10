<!-- src/components/StaticContent/StaticSection.svelte -->
<!-- Wiederverwendbare Komponente für Sections in statischen Seiten -->
<script>
    export let section = {};
    
    // Section Props
    $: title = section.title || '';
    $: content = section.content || [];
    $: type = section.type || 'default'; // 'default', 'card', 'warning', 'info', 'success'
    $: columns = section.columns || 1;
</script>

<section class="mb-12">
    <!-- Section Title -->
    {#if title}
        <h2 class="text-2xl font-bold text-black dark:text-white mb-6 border-b-2 border-gray-200 dark:border-aubergine-700 pb-3">
            {title}
        </h2>
    {/if}
    
    <!-- Section Content -->
    <div class="space-y-6">
        {#each content as item}
            {#if item.type === 'text'}
                <p class="text-gray-900 dark:text-white leading-relaxed">
                    {item.value}
                </p>
                
            {:else if item.type === 'subtitle'}
                <h3 class="text-xl font-semibold text-black dark:text-white mt-8 mb-4">
                    {item.value}
                </h3>
                
            {:else if item.type === 'list'}
                <ul class="space-y-3 list-disc pl-6">
                    {#each item.items as listItem}
                        <li class="text-gray-900 dark:text-white">
                            {#if listItem.label}
                                <strong class="text-black dark:text-white">{listItem.label}:</strong>
                            {/if}
                            {listItem.text}
                        </li>
                    {/each}
                </ul>
                
            {:else if item.type === 'card'}
                <div class="bg-gray-50 dark:bg-aubergine-900 p-6 rounded-lg border border-gray-200 dark:border-aubergine-700">
                    {#if item.title}
                        <h4 class="text-lg font-semibold text-black dark:text-white mb-3">
                            {item.title}
                        </h4>
                    {/if}
                    {#if item.text}
                        <p class="text-gray-900 dark:text-white leading-relaxed">
                            {item.text}
                        </p>
                    {/if}
                    {#if item.items}
                        <ul class="mt-4 space-y-2">
                            {#each item.items as cardItem}
                                <li class="text-gray-900 dark:text-white">
                                    {#if cardItem.label}
                                        <strong class="text-black dark:text-white">{cardItem.label}:</strong>
                                    {/if}
                                    {#if cardItem.link}
                                        <a 
                                            href={cardItem.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            class="text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 underline transition-colors"
                                        >
                                            {cardItem.text}
                                        </a>
                                    {:else}
                                        {cardItem.text}
                                    {/if}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
                
            {:else if item.type === 'warning'}
                <div class="bg-yellow-50 dark:bg-aubergine-900 border-2 border-yellow-500 dark:border-yellow-600/40 p-6 rounded-lg">
                    {#if item.title}
                        <h4 class="text-lg font-semibold text-black dark:text-white mb-3">
                            {item.title}
                        </h4>
                    {/if}
                    {#if item.text}
                        <p class="text-gray-900 dark:text-white leading-relaxed mb-3">
                            {item.text}
                        </p>
                    {/if}
                    {#if item.items}
                        <ul class="space-y-2 list-disc pl-6">
                            {#each item.items as warningItem}
                                <li class="text-gray-900 dark:text-white">
                                    {warningItem}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
                
            {:else if item.type === 'info'}
                <div class="bg-blue-50 dark:bg-aubergine-900 border-2 border-blue-500 dark:border-blue-600/40 p-6 rounded-lg">
                    {#if item.title}
                        <h4 class="text-lg font-semibold text-black dark:text-white mb-3">
                            {item.title}
                        </h4>
                    {/if}
                    {#if item.text}
                        <p class="text-gray-900 dark:text-white leading-relaxed">
                            {item.text}
                        </p>
                    {/if}
                    {#if item.items}
                        <ul class="mt-3 space-y-2 list-disc pl-6">
                            {#each item.items as infoItem}
                                <li class="text-gray-900 dark:text-white">
                                    {#if infoItem.label}
                                        <strong class="text-black dark:text-white">{infoItem.label}:</strong>
                                    {/if}
                                    {#if infoItem.link}
                                        <a 
                                            href={infoItem.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            class="text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 underline transition-colors"
                                        >
                                            {infoItem.text}
                                        </a>
                                    {:else}
                                        {infoItem.text}
                                    {/if}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
                
            {:else if item.type === 'grid'}
                <div class="grid grid-cols-1 md:grid-cols-{columns} gap-6">
                    {#each item.items as gridItem}
                        <div class="bg-gray-50 dark:bg-aubergine-900 p-6 rounded-lg border border-gray-200 dark:border-aubergine-700">
                            {#if gridItem.title}
                                <h4 class="text-lg font-semibold text-black dark:text-white mb-3">
                                    {gridItem.title}
                                </h4>
                            {/if}
                            {#if gridItem.text}
                                <p class="text-gray-900 dark:text-white text-sm leading-relaxed">
                                    {gridItem.text}
                                </p>
                            {/if}
                            {#if gridItem.link}
                                <a 
                                    href={gridItem.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="inline-block mt-3 text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 text-sm underline transition-colors"
                                >
                                    {gridItem.linkText || 'Mehr erfahren →'}
                                </a>
                            {/if}
                        </div>
                    {/each}
                </div>
                
            {:else if item.type === 'contact'}
                <div class="bg-blue-50 dark:bg-aubergine-900 border-2 border-blue-500 dark:border-blue-600/40 p-6 rounded-lg">
                    <div class="space-y-3">
                        {#each item.items as contactItem}
                            <p class="text-gray-900 dark:text-white">
                                <strong class="text-black dark:text-white">{contactItem.label}:</strong>
                                {#if contactItem.link}
                                    <a 
                                        href={contactItem.link}
                                        class="text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 underline transition-colors ml-2"
                                    >
                                        {contactItem.text}
                                    </a>
                                {:else}
                                    <span class="text-gray-900 dark:text-white ml-2">{contactItem.text}</span>
                                {/if}
                            </p>
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</section>

