<!-- src/components/Features/HeartAnimation.svelte -->
<!-- Animierte Herzen, die nach oben fliegen -->

<script>
    export let show = false;
    export let count = 3; // Anzahl der Herzen
    
    let hearts = [];
    let isAnimating = false;
    let lastTriggerTime = 0;
    
    $: if (show && !isAnimating) {
        // Prevent multiple triggers in quick succession
        const now = Date.now();
        if (now - lastTriggerTime > 100) {
            triggerAnimation();
            lastTriggerTime = now;
        }
    }
    
    function triggerAnimation() {
        if (isAnimating) return; // Prevent overlapping animations
        
        isAnimating = true;
        
        // Erstelle mehrere Herzen mit zufälligen Positionen
        hearts = Array.from({ length: count }, (_, i) => ({
            id: Date.now() + i + Math.random(),
            x: 30 + Math.random() * 40, // 30-70% horizontal (nicht zu weit außen)
            delay: i * 150 // Staggered animation (150ms zwischen jedem Herz)
        }));
        
        // Reset nach Animation (1.5s Animation + max delay + buffer)
        const maxDelay = (count - 1) * 150;
        const animationDuration = 1500; // 1.5s
        setTimeout(() => {
            hearts = [];
            isAnimating = false;
        }, animationDuration + maxDelay + 200);
    }
</script>

{#if hearts.length > 0}
    <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {#each hearts as heart (heart.id)}
            <div 
                class="absolute text-2xl animate-heart-float select-none"
                style="left: {heart.x}%; bottom: 20%; animation-delay: {heart.delay}ms;"
            >
                ❤️
            </div>
        {/each}
    </div>
{/if}

<style>
    @keyframes heart-float {
        0% {
            transform: translateY(0) translateX(0) scale(1) rotate(0deg);
            opacity: 1;
        }
        25% {
            transform: translateY(-30px) translateX(10px) scale(1.1) rotate(-5deg);
            opacity: 0.9;
        }
        50% {
            transform: translateY(-60px) translateX(-5px) scale(1.2) rotate(5deg);
            opacity: 0.8;
        }
        75% {
            transform: translateY(-90px) translateX(8px) scale(1.1) rotate(-3deg);
            opacity: 0.6;
        }
        100% {
            transform: translateY(-120px) translateX(0) scale(0.8) rotate(0deg);
            opacity: 0;
        }
    }
    
    .animate-heart-float {
        animation: heart-float 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        will-change: transform, opacity;
        user-select: none;
        -webkit-user-select: none;
    }
</style>

