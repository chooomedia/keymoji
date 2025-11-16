<!-- src/components/Features/ButtonHeartParticles.svelte -->
<!-- Kleine fliegende Herzen um den Button herum -->

<script>
    export let show = false;
    export let buttonElement = null; // Button DOM Element für Positionierung
    export let count = 6; // Anzahl der Herzen
    
    let particles = [];
    let isAnimating = false;
    let lastTriggerTime = 0;
    
    $: if (show && !isAnimating && buttonElement) {
        const now = Date.now();
        if (now - lastTriggerTime > 100) {
            triggerAnimation();
            lastTriggerTime = now;
        }
    }
    
    function triggerAnimation() {
        if (isAnimating || !buttonElement) return;
        
        isAnimating = true;
        
        // Button Position für Animation
        const rect = buttonElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Erstelle Partikel mit zufälligen Positionen
        particles = Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const randomX = Math.random() - 0.5;
            
            // Berechne Endposition für CSS Animation
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            return {
                id: Date.now() + i + Math.random() * 1000,
                startX: centerX,
                startY: centerY,
                endX: endX,
                endY: endY,
                delay: i * 50,
                rotation: (Math.random() - 0.5) * 360,
                scale: 0.6 + Math.random() * 0.4,
                emoji: ['❤️', '💖', '💕', '💗'][Math.floor(Math.random() * 4)],
                randomX: randomX
            };
        });
        
        // Reset nach Animation
        const maxDelay = (count - 1) * 50;
        const animationDuration = 1000;
        setTimeout(() => {
            particles = [];
            isAnimating = false;
        }, animationDuration + maxDelay + 100);
    }
</script>

{#if particles.length > 0}
    <div class="fixed inset-0 pointer-events-none z-[55] overflow-hidden">
        {#each particles as particle (particle.id)}
            <div 
                class="absolute text-xl animate-button-heart-float select-none"
                style="left: {particle.startX}px; top: {particle.startY}px; animation-delay: {particle.delay}ms; --end-x: {particle.endX}px; --end-y: {particle.endY}px; --start-rotation: {particle.rotation}deg; --start-scale: {particle.scale}; --random-x: {particle.randomX};"
            >
                {particle.emoji}
            </div>
        {/each}
    </div>
{/if}

<style>
    @keyframes button-heart-float {
        0% {
            transform: translate(0, 0) scale(var(--start-scale, 1)) rotate(var(--start-rotation, 0deg));
            opacity: 1;
        }
        20% {
            transform: translate(calc(var(--end-x) * 0.3 + var(--random-x) * 10px), calc(var(--end-y) * 0.3 - 15px)) scale(1.2) rotate(calc(var(--start-rotation, 0deg) - 15deg));
            opacity: 1;
        }
        50% {
            transform: translate(calc(var(--end-x) * 0.7 + var(--random-x) * 20px), calc(var(--end-y) * 0.7 - 40px)) scale(1.1) rotate(calc(var(--start-rotation, 0deg) + 20deg));
            opacity: 0.8;
        }
        80% {
            transform: translate(calc(var(--end-x) + var(--random-x) * 30px), calc(var(--end-y) - 60px)) scale(0.8) rotate(calc(var(--start-rotation, 0deg) - 10deg));
            opacity: 0.4;
        }
        100% {
            transform: translate(calc(var(--end-x) * 1.2 + var(--random-x) * 40px), calc(var(--end-y) * 1.2 - 80px)) scale(0.3) rotate(calc(var(--start-rotation, 0deg) + 5deg));
            opacity: 0;
        }
    }
    
    .animate-button-heart-float {
        animation: button-heart-float 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        will-change: transform, opacity;
        user-select: none;
        -webkit-user-select: none;
        filter: drop-shadow(0 2px 4px rgba(255, 0, 0, 0.4)) drop-shadow(0 1px 2px rgba(255, 0, 0, 0.2));
    }
</style>

