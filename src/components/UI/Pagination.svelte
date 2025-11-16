<!-- src/components/UI/Pagination.svelte -->
<!-- Klassische Pagination mit sichtbaren Seitenzahlen -->

<script lang="ts">
    interface Props {
        currentPage?: number;
        totalPages?: number;
        onPageChange?: (page: number) => void;
        isLoading?: boolean;
    }
    
    let {
        currentPage = 1,
        totalPages = 1,
        onPageChange = () => {},
        isLoading = false
    }: Props = $props();
    
    const visiblePages = $derived.by(() => {
        if (totalPages <= 7) {
            // Zeige alle Seiten wenn <= 7
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        // Klassische Pagination-Logik
        if (currentPage <= 3) {
            // Anfang: 1, 2, 3, 4, ..., last
            return [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage >= totalPages - 2) {
            // Ende: 1, ..., last-3, last-2, last-1, last
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            // Mitte: 1, ..., current-1, current, current+1, ..., last
            return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    });
    
    function handlePageClick(page: number | string): void {
        if (page === '...' || page === currentPage || isLoading) return;
        if (typeof page === 'number' && (page < 1 || page > totalPages)) return;
        if (typeof page === 'number') {
            onPageChange(page);
        }
    }
    
    function handlePrevious(): void {
        if (currentPage > 1 && !isLoading) {
            onPageChange(currentPage - 1);
        }
    }
    
    function handleNext(): void {
        if (currentPage < totalPages && !isLoading) {
            onPageChange(currentPage + 1);
        }
    }
</script>

{#if totalPages > 1}
<div class="transform -translate-y-3.5 scale-114">
    <div class="w-full max-w-screen-2xl mx-auto">
        <div class="core-button relative h-20 bg-creme-500 dark:bg-aubergine-900 border-powder-300 dark:border-aubergine-800 shadow-inner overflow-hidden mb-1">
            <nav aria-label="Page navigation" class="w-full h-full relative flex items-center justify-center gap-2">
                <!-- Previous Button -->
                <button
                    on:click={handlePrevious}
                    disabled={currentPage === 1 || isLoading}
                    class="flex items-center justify-center w-14 h-14 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                    aria-label="Previous page"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <!-- Page Numbers - Alle in einer Zeile, sauber ausgerichtet -->
                <div class="flex items-center justify-center gap-1.5">
                    {#each visiblePages as page}
                        {#if page === '...'}
                            <span class="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 font-medium text-sm">
                                ...
                            </span>
                        {:else}
                            <button
                                on:click={() => handlePageClick(page)}
                                disabled={isLoading}
                                aria-current={page === currentPage ? 'page' : undefined}
                                class="flex items-center justify-center w-10 h-10 rounded-full text-md font-bold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                                    {page === currentPage
                                        ? 'bg-yellow-500 dark:bg-yellow-600 text-aubergine-900'
                                        : 'text-gray-700 hover:text-gray-900 dark:hover:text-gray-200'}"
                                aria-label="Go to page {page}"
                                title="Page {page}"
                            >
                                {page}
                            </button>
                        {/if}
                    {/each}
                </div>
                
                <!-- Next Button -->
                <button
                    on:click={handleNext}
                    disabled={currentPage === totalPages || isLoading}
                    class="flex items-center justify-center w-14 h-14 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                    aria-label="Next page"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </nav>
        </div>
    </div>
</div>
{/if}
