<!-- src/components/Features/BlogPostImage.svelte -->
<!-- Wiederverwendbare Komponente für Blog-Post-Bilder mit SEO-Best-Practices -->

<script>
    /**
     * Props:
     * @param {string} image - Bild-URL (kann post.image oder post.thumbnail sein)
     * @param {string} thumbnail - Alternative Bild-URL (post.thumbnail)
     * @param {string} title - Post-Titel für alt-Text
     * @param {string} category - Post-Kategorie (optional, für Fallback)
     * @param {boolean} isFeatured - Ob Featured Post (für Größe)
     * @param {string} size - Größe: 'featured', 'regular', 'detail' (default: 'regular')
     * @param {boolean} showCategory - Ob Kategorie-Badge angezeigt werden soll
     * @param {boolean} showFeaturedBadge - Ob "Newest" Badge angezeigt werden soll
     */
    
    export let image = null;
    export let thumbnail = null;
    export let title = '';
    export let category = '';
    export let isFeatured = false;
    export let size = 'regular'; // 'featured', 'regular', 'detail'
    export let showCategory = true;
    export let showFeaturedBadge = false;
    
    // Bestimme Bild-URL: thumbnail > image > null
    // Unterstützt beide Felder vom Backend (image und thumbnail)
    $: imageUrl = thumbnail || image || null;
    $: hasImage = imageUrl && imageUrl !== '[empty]' && imageUrl !== '' && imageUrl.trim() !== '';
    
    // Bestimme Höhe basierend auf size
    $: heightClass = (() => {
        if (size === 'detail') return 'h-96';
        if (size === 'featured' || isFeatured) return 'h-64 md:h-96';
        return 'h-48';
    })();
    
    // Alt-Text für SEO und Accessibility
    $: altText = title || 'Blog post image';
    
    // Title-Attribut für Tooltip
    $: titleAttr = title || 'Blog post';
</script>

<div class="relative">
    {#if hasImage}
        <img 
            src={imageUrl} 
            alt={altText}
            title={titleAttr}
            class="w-full {heightClass} object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
            loading="lazy"
            decoding="async"
            fetchpriority={isFeatured ? 'high' : 'auto'}
        />
    {:else}
        <!-- Fallback: Placeholder mit Emoji -->
        <div class="w-full {heightClass} bg-gray-200 dark:bg-aubergine-900 flex items-center justify-center rounded-xl">
            <span class="text-8xl opacity-30 transition-transform duration-300 group-hover:scale-110" aria-hidden="true">🔑</span>
        </div>
    {/if}
    
    <!-- Category Badge -->
    {#if showCategory && category}
        <div class="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium z-10">
            {category}
        </div>
    {/if}
    
    <!-- Featured Badge -->
    {#if showFeaturedBadge && isFeatured}
        <div class="absolute top-4 left-4 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium z-10">
            ⭐ Newest
        </div>
    {/if}
</div>

