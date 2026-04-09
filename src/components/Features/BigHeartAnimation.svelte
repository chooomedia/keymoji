<!-- src/components/Features/BigHeartAnimation.svelte -->
<!-- Große zentrierte Herz-Animation für Success-State -->

<script>
    export let show = false;
    
    let isAnimating = false;
    let lastTriggerTime = 0;
    
    $: if (show && !isAnimating) {
        const now = Date.now();
        if (now - lastTriggerTime > 100) {
            triggerAnimation();
            lastTriggerTime = now;
        }
    }
    
    function triggerAnimation() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Reset nach Animation
        setTimeout(() => {
            isAnimating = false;
        }, 2000);
    }
</script>

{#if show && isAnimating}
    <div class="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
        <div class="text-8xl md:text-9xl animate-big-heart-pulse select-none">
            ❤️
        </div>
    </div>
{/if}

<style>
    @keyframes big-heart-pulse {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        20% {
            transform: scale(1.2) rotate(10deg);
            opacity: 1;
        }
        40% {
            transform: scale(1) rotate(-5deg);
            opacity: 1;
        }
        60% {
            transform: scale(1.1) rotate(3deg);
            opacity: 0.95;
        }
        80% {
            transform: scale(0.9) rotate(-2deg);
            opacity: 0.7;
        }
        100% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0;
        }
    }
    
    .animate-big-heart-pulse {
        animation: big-heart-pulse 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        will-change: transform, opacity;
        user-select: none;
        -webkit-user-select: none;
        filter: drop-shadow(0 8px 16px rgba(255, 0, 0, 0.5)) drop-shadow(0 4px 8px rgba(255, 0, 0, 0.3));
    }
</style>

