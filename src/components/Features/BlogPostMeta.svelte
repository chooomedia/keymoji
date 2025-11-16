<!-- src/components/Features/BlogPostMeta.svelte -->
<!-- Wiederverwendbare Komponente für Blog-Post-Meta-Informationen -->

<script lang="ts">
    import { formatDate, calculateReadTime } from '../../utils/blogApi';
    import { currentLanguage } from '../../stores/contentStore';
    
    interface Props {
        isodate?: string | null;
        date?: string | null;
        creator?: string;
        category?: string;
        readingTime?: number | null;
        content?: string;
        showCreator?: boolean;
        variant?: 'grid' | 'detail';
        truncateAuthor?: ((author: string) => string) | null;
        showCategory?: boolean;
    }
    
    let {
        isodate = null,
        date = null,
        creator = '',
        category = '',
        readingTime = null,
        content = '',
        showCreator = true,
        variant = 'grid',
        truncateAuthor = null,
        showCategory = true
    }: Props = $props();
    
    function defaultTruncateAuthor(author: string | null | undefined): string {
        if (!author) return 'Unknown';
        const text = String(author);
        return text.length > 20 ? text.substring(0, 17) + '...' : text;
    }
    
    const finalReadingTime = $derived(readingTime || (content ? calculateReadTime(content) : null));
    
    const formattedDate = $derived(formatDate(isodate || date, currentLanguage));
    
    const displayCreator = $derived(
        truncateAuthor && creator 
            ? truncateAuthor(creator) 
            : (creator ? defaultTruncateAuthor(creator) : 'Unknown')
    );
    
    const textSizeClass = $derived('text-xs');
    const textColorClass = $derived(variant === 'detail' ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400');
    const paddingClass = $derived(variant === 'detail' ? 'py-3' : '');
</script>

<div class="pb-3 px-2 flex items-center justify-center gap-2 {textSizeClass} {textColorClass} {paddingClass} whitespace-nowrap">
    {#if formattedDate}
        <time datetime={isodate || date} class="flex items-center whitespace-nowrap">
            📅 {formattedDate}
        </time>
        {#if (showCreator && creator) || (showCategory && category) || finalReadingTime}
            <span class="text-gray-400 dark:text-gray-500">·</span>
        {/if}
    {/if}
    
    {#if showCreator && creator}
        <span class="flex items-center whitespace-nowrap" title={creator || 'Unknown'}>
            👤 {displayCreator}
        </span>
        {#if (showCategory && category) || finalReadingTime}
            <span class="text-gray-400 dark:text-gray-500">·</span>
        {/if}
    {/if}
    
    {#if showCategory && category}
        <span class="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
            {category || 'uncategorized'}
        </span>
        {#if finalReadingTime}
            <span class="text-gray-400 dark:text-gray-500">·</span>
        {/if}
    {/if}
    
    {#if finalReadingTime}
        <span class="flex items-center whitespace-nowrap">
            ⏱️ {finalReadingTime} {variant === 'detail' ? 'min' : 'min read'}
        </span>
    {/if}
</div>

