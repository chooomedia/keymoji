<!-- src/components/UI/LoadingScreen.svelte -->
<!-- Reusable loading screen component with debug info and copy-to-clipboard functionality -->
<!-- Supports dark/light mode, customizable messages, and Keymoji logo integration -->
<script>
    export let message = 'Loading Keymoji...';
    export let subMessage = 'Preparing your secure emoji password generator';
    export let showDebugInfo = true;
    export let loadingStartTime = Date.now();
    
    let copySuccess = false;
    
    function isDebugMode() {
        if (typeof window === 'undefined') return false;
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const hasDebug = window.location.search.includes('debug=true');
        return isDev && hasDebug;
    }
    
    async function copyDebugInfo() {
        const loadTime = Date.now() - loadingStartTime;
        const url = typeof window !== 'undefined' ? window.location.href : 'Unknown';
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'Unknown';
        const language = typeof navigator !== 'undefined' ? navigator.language : 'Unknown';
        const timestamp = new Date().toISOString();
        const darkModeState = typeof window !== 'undefined' ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light') : 'Unknown';
        
        const debugText = `Keymoji Debug Info
Load Time: ${loadTime}ms
URL: ${url}
User Agent: ${userAgent}
Language: ${language}
Timestamp: ${timestamp}
Dark Mode: ${darkModeState}
Version: 0.7.7`;

        try {
            await navigator.clipboard.writeText(debugText);
            copySuccess = true;
            setTimeout(() => (copySuccess = false), 2000);
        } catch (err) {
            console.error('Failed to copy debug info:', err);
            alert('Failed to copy debug info. Please try again or copy manually.');
        }
    }
</script>

<div 
    class="flex items-center justify-center min-h-screen bg-creme-50 dark:bg-aubergine-950 transition-colors duration-300"
    role="status"
    aria-live="polite"
    aria-label="Loading application..."
>
    <div class="text-center px-4 max-w-md">
        <!-- Keymoji Logo -->
        <div class="mb-6 flex justify-center">
            <img 
                src="/images/keymoji-logo-11-2023-simple.png" 
                alt="Keymoji Logo" 
                class="w-24 h-24 md:w-32 md:h-32 animate-pulse opacity-90 dark:opacity-80"
                loading="eager"
            />
        </div>
        
        <!-- Spinner -->
        <div class="flex justify-center mb-4">
            <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-yellow-400 dark:border-yellow-500 border-t-transparent rounded-full animate-spin opacity-75"></div>
                <div class="absolute inset-2 border-4 border-yellow-500 dark:border-yellow-400 border-t-transparent rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 0.8s;"></div>
            </div>
        </div>
        
        <!-- Loading Text -->
        <p class="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            {message}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {subMessage}
        </p>
        
        <!-- Loading Dots Animation -->
        <div class="flex justify-center gap-1 mb-6">
            <div class="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full animate-pulse" style="animation-delay: 0s;"></div>
            <div class="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
            <div class="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
        </div>
        
        <!-- Debug Info (Click to Copy) -->
        {#if showDebugInfo && isDebugMode()}
            <button
                onclick={copyDebugInfo}
                class="mt-4 text-xs text-gray-500 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-pointer underline-offset-2 hover:underline"
                aria-label="Copy debug information to clipboard"
            >
                {#if copySuccess}
                    <span class="text-green-600 dark:text-green-400">✓ Copied!</span>
                {:else}
                    <span>Click for debug info (copies to clipboard)</span>
                {/if}
            </button>
        {/if}
    </div>
</div>

