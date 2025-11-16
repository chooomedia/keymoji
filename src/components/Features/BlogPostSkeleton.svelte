<!-- src/components/Features/BlogPostSkeleton.svelte -->
<!-- Moderne Skeleton Loading für Blog-Posts (genau wie Post-Element) -->

<script>
    export let count = 3; // Anzahl der Skeleton-Posts
</script>

<div class="w-full space-y-8">
    {#each Array(count) as _, i}
        <article class="bg-white dark:bg-aubergine-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 animate-pulse">
            <!-- Image Skeleton -->
            <div class="w-full h-48 md:h-64 bg-gray-300 dark:bg-aubergine-800"></div>
            
            <!-- Content Skeleton -->
            <div class="p-6 space-y-4">
                <!-- Meta Skeleton -->
                <div class="flex items-center gap-3">
                    <div class="h-3 w-20 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                    <div class="h-3 w-16 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                </div>
                
                <!-- Title Skeleton -->
                <div class="space-y-2">
                    <div class="h-6 w-full bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                    <div class="h-6 w-3/4 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                </div>
                
                <!-- Excerpt Skeleton -->
                <div class="space-y-2">
                    <div class="h-4 w-full bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                    <div class="h-4 w-full bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                    <div class="h-4 w-5/6 bg-gray-300 dark:bg-aubergine-800 rounded"></div>
                </div>
                
                <!-- Footer Skeleton -->
                <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-aubergine-800 mt-4">
                    <div class="h-8 w-20 bg-gray-300 dark:bg-aubergine-800 rounded-full"></div>
                    <div class="flex gap-2">
                        <div class="h-8 w-8 bg-gray-300 dark:bg-aubergine-800 rounded-full"></div>
                        <div class="h-8 w-8 bg-gray-300 dark:bg-aubergine-800 rounded-full"></div>
                        <div class="h-8 w-8 bg-gray-300 dark:bg-aubergine-800 rounded-full"></div>
                    </div>
                </div>
            </div>
        </article>
    {/each}
</div>


