<!-- src/components/Features/HeartAnimation.svelte -->
<!-- Animierte Herzen, die nach oben fliegen -->

<script>
    export let show = false;
    export let count = 5; // Anzahl der Herzen (erhöht für wildere Animation)
    
    let hearts = [];
    let isAnimating = false;
    let lastTriggerTime = 0;
    
    $: if (show && !isAnimating) {
        const now = Date.now();
        if (now - lastTriggerTime > 50) {
            triggerAnimation();
            lastTriggerTime = now;
        }
    }
    
    function triggerAnimation() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Erstelle mehrere Herzen mit zufälligen Positionen und Variationen
        hearts = Array.from({ length: count }, (_, i) => {
            const randomX = Math.random() - 0.5; // -0.5 bis 0.5 für zufällige X-Bewegung
            return {
                id: Date.now() + i + Math.random() * 1000,
                x: 20 + Math.random() * 60, // 20-80% horizontal (breiterer Bereich)
                delay: i * 80, // Schnellere Staggered animation (80ms zwischen jedem Herz)
                rotation: (Math.random() - 0.5) * 360, // Zufällige Startrotation
                scale: 0.8 + Math.random() * 0.6, // Zufällige Startskalierung (0.8-1.4)
                emoji: ['❤️', '💖', '💕', '💗', '💝'][Math.floor(Math.random() * 5)], // Verschiedene Herz-Emojis
                randomX: randomX
            };
        });
        
        // Reset nach Animation (schnellere Animation)
        const maxDelay = (count - 1) * 80;
        const animationDuration = 1200; // 1.2s (schneller)
        setTimeout(() => {
            hearts = [];
            isAnimating = false;
        }, animationDuration + maxDelay + 100);
    }
</script>

{#if hearts.length > 0}
    <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {#each hearts as heart (heart.id)}
            <div 
                class="absolute text-3xl animate-heart-float select-none"
                style="left: {heart.x}%; bottom: 15%; animation-delay: {heart.delay}ms; --start-rotation: {heart.rotation}deg; --start-scale: {heart.scale}; --random-x: {heart.randomX};"
            >
                {heart.emoji}
            </div>
        {/each}
    </div>
{/if}

<style>
    @keyframes heart-float {
        0% {
            transform: translateY(0) translateX(0) scale(var(--start-scale, 1)) rotate(var(--start-rotation, 0deg));
            opacity: 1;
        }
        15% {
            transform: translateY(-30px) translateX(15px) scale(1.4) rotate(calc(var(--start-rotation, 0deg) - 20deg));
            opacity: 1;
        }
        30% {
            transform: translateY(-60px) translateX(-25px) scale(1.6) rotate(calc(var(--start-rotation, 0deg) + 30deg));
            opacity: 0.95;
        }
        50% {
            transform: translateY(-100px) translateX(30px) scale(1.5) rotate(calc(var(--start-rotation, 0deg) - 35deg));
            opacity: 0.85;
        }
        70% {
            transform: translateY(-150px) translateX(-20px) scale(1.3) rotate(calc(var(--start-rotation, 0deg) + 15deg));
            opacity: 0.65;
        }
        85% {
            transform: translateY(-180px) translateX(10px) scale(1) rotate(calc(var(--start-rotation, 0deg) - 8deg));
            opacity: 0.4;
        }
        100% {
            transform: translateY(-220px) translateX(0) scale(0.5) rotate(calc(var(--start-rotation, 0deg) + 0deg));
            opacity: 0;
        }
    }
    
    .animate-heart-float {
        animation: heart-float 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        will-change: transform, opacity;
        user-select: none;
        -webkit-user-select: none;
        filter: drop-shadow(0 4px 8px rgba(255, 0, 0, 0.4)) drop-shadow(0 2px 4px rgba(255, 0, 0, 0.2));
    }
</style>

