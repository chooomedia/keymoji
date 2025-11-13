<!-- src/components/UI/Pagination.svelte -->
<!-- Minimalistische Pagination im Flowbite-Stil, angepasst an unser Design -->

<script>
    /**
     * Props:
     * @param {number} currentPage - Aktuelle Seite (1-indexed)
     * @param {number} totalPages - Gesamtanzahl der Seiten
     * @param {function} onPageChange - Callback-Funktion: (page: number) => void
     * @param {boolean} isLoading - Ob gerade geladen wird (disabled state)
     */
    
    export let currentPage = 1;
    export let totalPages = 1;
    export let onPageChange = () => {};
    export let isLoading = false;
    
    let goToPageInput = '';
    
    // Berechne visible pages (max 3: immer 1-3 anzeigen wenn möglich)
    $: visiblePages = (() => {
        if (totalPages <= 3) {
            // Zeige alle Seiten wenn <= 3
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        // Zeige immer max 3 Seiten basierend auf currentPage
        if (currentPage === 1) {
            return [1, 2, 3];
        } else if (currentPage === totalPages) {
            return [totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [currentPage - 1, currentPage, currentPage + 1];
        }
    })();
    
    function handlePageClick(page) {
        if (page === currentPage || isLoading || page < 1 || page > totalPages) return;
        onPageChange(page);
    }
    
    function handlePrevious() {
        if (currentPage > 1 && !isLoading) {
            onPageChange(currentPage - 1);
        }
    }
    
    function handleNext() {
        if (currentPage < totalPages && !isLoading) {
            onPageChange(currentPage + 1);
        }
    }
    
    function handleGoToPageSubmit(event) {
        event.preventDefault();
        const page = parseInt(goToPageInput, 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
            goToPageInput = '';
        }
    }
</script>

{#if totalPages > 1}
<div class="transform -translate-y-3.5 scale-114">
    <div class="core-button relative h-20 bg-creme-500 dark:bg-aubergine-900 border-powder-300 dark:border-aubergine-800 shadow-inner overflow-hidden mb-1">
        <nav aria-label="Page navigation" class="w-full h-full relative flex justify-around items-center space-x-4">
            <ul class="flex -space-x-px text-sm">
                <!-- Previous Button (Icon only) -->
                <li>
                    <button
                        on:click={handlePrevious}
                        disabled={currentPage === 1 || isLoading}
                        class="flex items-center justify-center text-gray-700 dark:text-gray-300 bg-powder-50 dark:bg-aubergine-900 hover:text-gray-900 dark:hover:text-gray-200 shadow-sm font-medium leading-5 rounded-l-lg text-sm px-3 h-9 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-powder-50 dark:disabled:hover:bg-aubergine-800 transition-all duration-200"
                        aria-label="Previous page"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </li>
                
                <!-- Page Number Buttons (max 3) -->
                {#each visiblePages as page}
                    <li>
                        <button
                            on:click={() => handlePageClick(page)}
                            disabled={isLoading}
                            aria-current={page === currentPage ? 'page' : undefined}
                            class="flex items-center justify-center text-sm w-9 h-9 font-medium leading-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200
                                {page === currentPage
                                    ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 hover:text-yellow-600 dark:hover:text-yellow-300'
                                    : 'text-gray-700 dark:text-gray-300 bg-powder-50 dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-aubergine-700 hover:text-gray-900 dark:hover:text-gray-200 shadow-sm'}"
                            aria-label="Go to page {page}"
                            title="Page {page}"
                        >
                            {page}
                        </button>
                    </li>
                {/each}
                
                <!-- Next Button (Icon only) -->
                <li>
                    <button
                        on:click={handleNext}
                        disabled={currentPage === totalPages || isLoading}
                        class="flex items-center justify-center text-gray-700 dark:text-gray-300 bg-powder-50 dark:bg-aubergine-900 hover:text-gray-900 dark:hover:text-gray-200 shadow-sm font-medium leading-5 rounded-r-lg text-sm px-3 h-9 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-powder-50 dark:disabled:hover:bg-aubergine-800 transition-all duration-200"
                        aria-label="Next page"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </li>
            </ul>
            
            <!-- Go to Page Input (Flowbite Style) -->
            <form on:submit={handleGoToPageSubmit} class="mx-auto">
                <div class="flex items-center space-x-2">
                    <label for="go-to-page-input" class="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
                        Go to
                    </label>
                    <input
                        id="go-to-page-input"
                        type="text"
                        bind:value={goToPageInput}
                        placeholder={totalPages.toString()}
                        class="bg-powder-50 dark:bg-aubergine-800 w-10 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 block px-2.5 py-2 shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200"
                        aria-label="Go to page number"
                        required
                    />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">page</span>
                </div>
            </form>
        </nav>
    </div>
</div>
{/if}
