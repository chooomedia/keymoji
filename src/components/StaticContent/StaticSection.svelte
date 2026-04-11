<!-- src/components/StaticContent/StaticSection.svelte -->
<!-- Wiederverwendbare Komponente für Sections in statischen Seiten -->
<script>
    import { navigate } from 'svelte-routing';
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
                            {#if listItem.navigate}
                                <button
                                    type="button"
                                    class="text-yellow-500 hover:text-yellow-400 underline transition-colors bg-transparent border-0 p-0 cursor-pointer"
                                    on:click={() => navigate(listItem.navigate)}
                                >
                                    {listItem.text}
                                </button>
                            {:else if listItem.link}
                                <a
                                    href={listItem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-yellow-500 hover:text-yellow-400 underline transition-colors inline-flex items-center gap-1"
                                >
                                    {listItem.text}
                                    {#if listItem.external}
                                        <svg class="w-3 h-3 inline-block flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                    {/if}
                                </a>
                            {:else}
                                {listItem.text}
                            {/if}
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
                                    {#if cardItem.navigate}
                                        <button
                                            type="button"
                                            class="text-yellow-500 hover:text-yellow-400 underline transition-colors bg-transparent border-0 p-0 cursor-pointer"
                                            on:click={() => navigate(cardItem.navigate)}
                                        >{cardItem.text}</button>
                                    {:else if cardItem.link}
                                        <a 
                                            href={cardItem.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            class="text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 underline transition-colors inline-flex items-center gap-1"
                                        >
                                            {cardItem.text}
                                            {#if cardItem.external}
                                                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                            {/if}
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
                                    class="inline-flex items-center gap-1 mt-3 text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 text-sm underline transition-colors"
                                >
                                    {gridItem.linkText || 'Mehr erfahren →'}
                                    {#if gridItem.external}
                                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                    {/if}
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
                                {#if contactItem.navigate}
                                    <button
                                        type="button"
                                        class="text-yellow-500 hover:text-yellow-400 underline transition-colors bg-transparent border-0 p-0 cursor-pointer ml-2"
                                        on:click={() => navigate(contactItem.navigate)}
                                    >
                                        {contactItem.text}
                                    </button>
                                {:else if contactItem.link}
                                    <a 
                                        href={contactItem.link}
                                        target={contactItem.external ? '_blank' : '_self'}
                                        rel={contactItem.external ? 'noopener noreferrer' : undefined}
                                        class="text-yellow-500 hover:text-yellow-400 dark:text-yellow-500 dark:hover:text-yellow-400 underline transition-colors ml-2 inline-flex items-center gap-1"
                                    >
                                        {contactItem.text}
                                        {#if contactItem.external}
                                            <svg class="w-3 h-3 inline-block flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                        {/if}
                                    </a>
                                {:else}
                                    <span class="text-gray-900 dark:text-white ml-2">{contactItem.text}</span>
                                {/if}
                            </p>
                        {/each}
                    </div>
                </div>

            {:else if item.type === 'image'}
                <!-- Obfuscated image block: contact/company data as image to prevent bot scraping -->
                <div class="flex justify-center my-4">
                    <img
                        src={item.src}
                        alt={item.alt || ''}
                        width={item.width || 480}
                        height={item.height || 'auto'}
                        loading="lazy"
                        decoding="async"
                        class="rounded-xl shadow-md max-w-full h-auto border border-gray-200 dark:border-aubergine-700"
                        draggable="false"
                    />
                </div>
            {/if}
        {/each}
    </div>
</section>

