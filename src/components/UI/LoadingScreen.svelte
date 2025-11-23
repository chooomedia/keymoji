<!-- src/components/UI/LoadingScreen.svelte -->
<!-- Reusable loading screen component with debug info and copy-to-clipboard functionality -->
<!-- Supports dark/light mode, customizable messages, and Keymoji logo integration -->
<script>
    import { onMount } from 'svelte';
    
    export let message = 'Loading Keymoji...';
    export let subMessage = 'Preparing your secure emoji password generator';
    export let showDebugInfo = true;
    export let loadingStartTime = Date.now();
    
    let copySuccess = false;
    let errorLog = [];
    let isMounted = false; // Track if component is mounted and ready
    
    // Collect errors from console and window events
    onMount(() => {
        isMounted = true; // Mark as mounted - debug button is now functional
        if (typeof window === 'undefined') return;
        
        // Store original console methods
        const originalError = console.error;
        const originalWarn = console.warn;
        
        // Override console.error to collect errors
        console.error = function(...args) {
            const errorText = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            
            errorLog.push({
                type: 'error',
                message: errorText,
                timestamp: new Date().toISOString()
            });
            
            // Keep original behavior
            originalError.apply(console, args);
        };
        
        // Override console.warn to collect warnings
        console.warn = function(...args) {
            const warnText = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            
            errorLog.push({
                type: 'warning',
                message: warnText,
                timestamp: new Date().toISOString()
            });
            
            // Keep original behavior
            originalWarn.apply(console, args);
        };
        
        // Collect window errors
        window.addEventListener('error', (event) => {
            errorLog.push({
                type: 'error',
                message: event.message || 'Unknown error',
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString()
            });
        });
        
        // Collect unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            errorLog.push({
                type: 'unhandledRejection',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });
        });
        
        // Cleanup on destroy
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    });
    
    async function copyDebugInfo() {
        const loadTime = Date.now() - loadingStartTime;
        const url = typeof window !== 'undefined' ? window.location.href : 'Unknown';
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'Unknown';
        const language = typeof navigator !== 'undefined' ? navigator.language : 'Unknown';
        const timestamp = new Date().toISOString();
        const darkModeState = typeof window !== 'undefined' ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light') : 'Unknown';
        
        // Format errors
        const errorsText = errorLog.length > 0
            ? `\n\n=== ERRORS & WARNINGS (${errorLog.length}) ===\n${errorLog.map((err, idx) => 
                `[${idx + 1}] ${err.type.toUpperCase()} - ${err.timestamp}\n${err.message}${err.stack ? '\nStack: ' + err.stack : ''}${err.source ? `\nSource: ${err.source}:${err.line}:${err.column}` : ''}`
            ).join('\n\n')}`
            : '\n\n=== NO ERRORS DETECTED ===';
        
        const debugText = `Keymoji Debug Info
Load Time: ${loadTime}ms
URL: ${url}
User Agent: ${userAgent}
Language: ${language}
Timestamp: ${timestamp}
Dark Mode: ${darkModeState}
Version: 0.7.7${errorsText}`;

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
        
        <!-- Modern Simple Spinner -->
        <div class="flex justify-center mb-4">
            <div class="w-12 h-12 border-4 border-yellow-200 dark:border-yellow-900 border-t-yellow-500 dark:border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
        
        <!-- Loading Text -->
        <p class="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            {message}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {subMessage}
        </p>
        
        <!-- Debug Button (wie Story Button) - Only show if mounted and functional -->
        {#if showDebugInfo && isMounted}
            <button
                on:click={copyDebugInfo}
                class="w-full py-4 rounded-full bg-yellow-500 text-black border-2 border-yellow-500 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 cursor-pointer"
                aria-label="Copy debug information and errors to clipboard"
                title="Copy debug info and errors to clipboard"
            >
                {#if copySuccess}
                    <span class="flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Copied!
                    </span>
                {:else}
                    <span>🐛 Debug Info {errorLog.length > 0 ? `(${errorLog.length} errors)` : ''}</span>
                {/if}
            </button>
        {/if}
    </div>
</div>

