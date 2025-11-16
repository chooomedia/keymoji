<!-- src/components/Features/HeartAnimation.svelte -->
<!-- Modulare Herz-Animation mit verschiedenen Modi -->
<!-- Modes: 'float' (nach oben fliegend), 'particles' (um Button), 'big' (zentriert groß) -->

<script lang="ts">
    interface Props {
        show?: boolean;
        mode?: 'float' | 'particles' | 'big';
        count?: number;
        buttonElement?: HTMLElement | null;
    }
    
    let { 
        show = false, 
        mode = 'float',
        count = 5,
        buttonElement = null
    }: Props = $props();
    
    // Gemeinsame State-Variablen
    let isAnimating = $state(false);
    let lastTriggerTime = $state(0);
    
    // Float-Mode: Herzen die nach oben fliegen
    let floatHearts = $state<Array<{
        id: number;
        x: number;
        delay: number;
        rotation: number;
        scale: number;
        emoji: string;
        randomX: number;
    }>>([]);
    
    // Particles-Mode: Herzen um Button
    let particles = $state<Array<{
        id: number;
        startX: number;
        startY: number;
        endX: number;
        endY: number;
        delay: number;
        rotation: number;
        scale: number;
        emoji: string;
        randomX: number;
    }>>([]);
    
    // Emoji-Pools für verschiedene Modi
    const floatEmojis = ['❤️', '💖', '💕', '💗', '💝'];
    const particleEmojis = ['❤️', '💖', '💕', '💗'];
    
    // Throttle-Zeiten für verschiedene Modi
    const throttleTimes = {
        float: 50,
        particles: 100,
        big: 100
    };
    
    $effect(() => {
        if (!show || isAnimating) return;
        
        const now = Date.now();
        const throttleTime = throttleTimes[mode];
        
        // Particles-Mode benötigt buttonElement
        if (mode === 'particles' && !buttonElement) return;
        
        if (now - lastTriggerTime > throttleTime) {
            triggerAnimation();
            lastTriggerTime = now;
        }
    });
    
    function triggerAnimation() {
        if (isAnimating) return;
        
        // Particles-Mode benötigt buttonElement
        if (mode === 'particles' && !buttonElement) return;
        
        isAnimating = true;
        
        switch (mode) {
            case 'float':
                triggerFloatAnimation();
                break;
            case 'particles':
                triggerParticlesAnimation();
                break;
            case 'big':
                triggerBigAnimation();
                break;
        }
    }
    
    function triggerFloatAnimation() {
        // Erstelle mehrere Herzen mit zufälligen Positionen und Variationen
        floatHearts = Array.from({ length: count }, (_, i) => {
            const randomX = Math.random() - 0.5;
            return {
                id: Date.now() + i + Math.random() * 1000,
                x: 20 + Math.random() * 60, // 20-80% horizontal
                delay: i * 80,
                rotation: (Math.random() - 0.5) * 360,
                scale: 0.8 + Math.random() * 0.6,
                emoji: floatEmojis[Math.floor(Math.random() * floatEmojis.length)],
                randomX: randomX
            };
        });
        
        // Reset nach Animation
        const maxDelay = (count - 1) * 80;
        const animationDuration = 1200;
        setTimeout(() => {
            floatHearts = [];
            isAnimating = false;
        }, animationDuration + maxDelay + 100);
    }
    
    function triggerParticlesAnimation() {
        if (!buttonElement) return;
        
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
                emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
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
    
    function triggerBigAnimation() {
        // Reset nach Animation
        setTimeout(() => {
            isAnimating = false;
        }, 2000);
    }
</script>

<!-- Float Mode: Herzen die nach oben fliegen -->
{#if mode === 'float' && floatHearts.length > 0}
    <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {#each floatHearts as heart (heart.id)}
            <div 
                class="absolute text-3xl animate-heart-float select-none"
                style="left: {heart.x}%; bottom: 15%; animation-delay: {heart.delay}ms; --start-rotation: {heart.rotation}deg; --start-scale: {heart.scale}; --random-x: {heart.randomX};"
            >
                {heart.emoji}
            </div>
        {/each}
    </div>
{/if}

<!-- Particles Mode: Herzen um Button -->
{#if mode === 'particles' && particles.length > 0}
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

<!-- Big Mode: Große zentrierte Herz-Animation -->
{#if mode === 'big' && show && isAnimating}
    <div class="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
        <div class="text-8xl md:text-9xl animate-big-heart-pulse select-none">
            ❤️
        </div>
    </div>
{/if}

<style>
    /* Float Animation */
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
    
    /* Particles Animation */
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
    
    /* Big Animation */
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
