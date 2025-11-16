<!-- src/components/Features/ShareButtons.svelte -->
<!-- Wiederverwendbare Share-Buttons Komponente -->

<script>
    import { linkedinIcon, whatsappIcon, emailIcon, redditIcon } from '../../assets/shapes';
    import { showShareMenu } from '../../stores/contentStore';
    
    export let shareUrl = '';
    export let shareText = '';
    export let title = '';
    export let showNativeShare = false;
</script>

<div class="flex gap-2">
    {#if showNativeShare && typeof navigator !== 'undefined' && navigator.share}
        <button 
            aria-label="Share the blog post" 
            onclick={() => {
                if (shareUrl) {
                    navigator.share({
                        title: title,
                        text: shareText || '',
                        url: shareUrl
                    }).catch(err => {
                        if (err.name !== 'AbortError') {
                            showShareMenu.set(true);
                        }
                    });
                } else {
                    showShareMenu.set(true);
                }
            }}
            class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
            title="Share this post"
        >
            <span class="text-base">🔗</span>
        </button>
    {/if}
    
    <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
    >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {@html linkedinIcon}
        </svg>
    </a>
    
    <a 
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
    >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {@html whatsappIcon}
        </svg>
    </a>
    
    <a 
        href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
        title="Share on Reddit"
        aria-label="Share on Reddit"
    >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {@html redditIcon}
        </svg>
    </a>
    
    <a 
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`}
        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-110 focus:scale-110 active:scale-95"
        title="Share via Email"
        aria-label="Share via Email"
    >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {@html emailIcon}
        </svg>
    </a>
</div>

