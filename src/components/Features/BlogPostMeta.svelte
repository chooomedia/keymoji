<!-- src/components/Features/BlogPostMeta.svelte -->
<!-- Wiederverwendbare Komponente für Blog-Post-Meta-Informationen -->

<script>
    import { formatDate, calculateReadTime } from '../../utils/blogApi.js';
    import { currentLanguage } from '../../stores/contentStore.js';
    
    /**
     * Props:
     * @param {string} isodate - ISO-Datum des Posts
     * @param {string} date - Alternative Datumsformat
     * @param {string} creator - Autor/Ersteller des Posts
     * @param {string} category - Kategorie des Posts
     * @param {number} readingTime - Lesezeit in Minuten
     * @param {string} content - Post-Content (für Lesezeit-Berechnung)
     * @param {boolean} showCreator - Ob Creator angezeigt werden soll (default: true)
     * @param {string} variant - Variante: 'grid' oder 'detail' (default: 'grid')
     * @param {function} truncateAuthor - Funktion zum Kürzen des Autor-Namens (optional)
     */
    
    export let isodate = null;
    export let date = null;
    export let creator = '';
    export let category = '';
    export let readingTime = null;
    export let content = '';
    export let showCreator = true;
    export let variant = 'grid'; // 'grid' oder 'detail'
    export let truncateAuthor = null;
    
    // Berechne Lesezeit falls nicht vorhanden
    $: finalReadingTime = readingTime || (content ? calculateReadTime(content) : null);
    
    // Formatiere Datum
    $: formattedDate = formatDate(isodate || date, $currentLanguage);
    
    // Standard-Truncation-Funktion (max. 24 Zeichen)
    function defaultTruncateAuthor(author) {
        if (!author) return 'Unknown';
        const text = String(author);
        // If text is longer than 24 chars, show first 21 chars + "..." = 24 total
        return text.length > 24 ? text.substring(0, 21) + '...' : text;
    }
    
    // Kürze Autor-Name: verwende übergebene Funktion oder Standard
    $: displayCreator = truncateAuthor && creator 
        ? truncateAuthor(creator) 
        : (creator ? defaultTruncateAuthor(creator) : 'Unknown');
    
    // Bestimme Text-Größe und -Farbe basierend auf Variante
    $: textSizeClass = 'text-xs'; // Beide Varianten verwenden text-xs
    $: textColorClass = variant === 'detail' ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400';
    // Padding für Detail-Variante: oben und unten jeweils 0.75rem (py-3)
    $: paddingClass = variant === 'detail' ? 'py-3' : '';
</script>

<div class="flex flex-wrap items-center justify-center gap-2 {textSizeClass} {textColorClass} {paddingClass}">
    {#if formattedDate}
        <time datetime={isodate || date} class="flex items-center whitespace-nowrap">
            📅 {formattedDate}
        </time>
        {#if (showCreator && creator) || category || finalReadingTime}
            <span class="text-gray-400 dark:text-gray-500">·</span>
        {/if}
    {/if}
    
    {#if showCreator && creator}
        <span class="flex items-center whitespace-nowrap" title={creator || 'Unknown'}>
            👤 {displayCreator}
        </span>
        {#if category || finalReadingTime}
            <span class="text-gray-400 dark:text-gray-500">·</span>
        {/if}
    {/if}
    
    {#if category}
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

