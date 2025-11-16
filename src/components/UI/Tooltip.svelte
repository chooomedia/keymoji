<!-- src/components/UI/Tooltip.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  interface Props {
    text?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    delay?: number;
    disabled?: boolean;
  }
  
  let {
    text = '',
    position = 'top',
    delay = 300,
    disabled = false
  }: Props = $props();
  
  let showTooltip = $state(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = $state(null);
  let triggerElement: HTMLElement | null = $state(null);
  let tooltipElement: HTMLElement | null = $state(null);
  let tooltipPosition = $state({ x: 0, y: 0 });
  
  function calculatePosition(): void {
    if (!triggerElement || !tooltipElement) return;
    
    const triggerRect = triggerElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const spacing = 8; // Space between trigger and tooltip
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.top - tooltipRect.height - spacing;
        break;
      case 'bottom':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.bottom + spacing;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - spacing;
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        x = triggerRect.right + spacing;
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        break;
      default:
        // Auto-detect best position based on viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Try top first
        if (triggerRect.top - tooltipRect.height - spacing > 0) {
          x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          y = triggerRect.top - tooltipRect.height - spacing;
        }
        // Try bottom
        else if (triggerRect.bottom + tooltipRect.height + spacing < viewportHeight) {
          x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          y = triggerRect.bottom + spacing;
        }
        // Try right
        else if (triggerRect.right + tooltipRect.width + spacing < viewportWidth) {
          x = triggerRect.right + spacing;
          y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        }
        // Default to left
        else {
          x = triggerRect.left - tooltipRect.width - spacing;
          y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        }
    }
    
    // Keep tooltip within viewport bounds
    x = Math.max(spacing, Math.min(x, window.innerWidth - tooltipRect.width - spacing));
    y = Math.max(spacing, Math.min(y, window.innerHeight - tooltipRect.height - spacing));
    
    tooltipPosition = { x, y };
  }
  
  function handleMouseEnter() {
    if (disabled || !text) return;
    
    timeoutId = setTimeout(() => {
      showTooltip = true;
      // Calculate position after showing to get correct dimensions
      setTimeout(() => calculatePosition(), 0);
    }, delay);
  }
  
  function handleMouseLeave() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    showTooltip = false;
  }
  
  function handleFocus() {
    if (disabled || !text) return;
    showTooltip = true;
    setTimeout(() => calculatePosition(), 0);
  }
  
  function handleBlur() {
    showTooltip = false;
  }
  
  onMount(() => {
    // Get the trigger element (parent of this component)
    triggerElement = tooltipElement?.parentElement;
    
    if (triggerElement) {
      triggerElement.addEventListener('mouseenter', handleMouseEnter);
      triggerElement.addEventListener('mouseleave', handleMouseLeave);
      triggerElement.addEventListener('focus', handleFocus);
      triggerElement.addEventListener('blur', handleBlur);
    }
    
    // Recalculate position on window resize
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);
  });
  
  onDestroy(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (triggerElement) {
      triggerElement.removeEventListener('mouseenter', handleMouseEnter);
      triggerElement.removeEventListener('mouseleave', handleMouseLeave);
      triggerElement.removeEventListener('focus', handleFocus);
      triggerElement.removeEventListener('blur', handleBlur);
    }
    
    window.removeEventListener('resize', calculatePosition);
    window.removeEventListener('scroll', calculatePosition);
  });
</script>

<!-- Hidden reference element for positioning -->
<span bind:this={tooltipElement} class="absolute pointer-events-none w-0 h-0" aria-hidden="true"></span>

{#if showTooltip && text}
  <div
    class="tooltip fixed z-[9999] pointer-events-none"
    style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;"
    role="tooltip"
    in:fly={{ y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0, x: position === 'left' ? 5 : position === 'right' ? -5 : 0, duration: 200 }}
    out:fade={{ duration: 150 }}
  >
    <div class="tooltip-content bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-nowrap">
      {text}
    </div>
    
    <!-- Arrow -->
    <div class="tooltip-arrow absolute {position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : 'left-[-4px] top-1/2 -translate-y-1/2'}">
      <div class="w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
    </div>
  </div>
{/if}

<style>
  /* Tooltip fade-in animation */
  .tooltip {
    animation: tooltipFadeIn 0.2s ease-out;
  }
  
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Accessibility: Reduce motion */
  @media (prefers-reduced-motion: reduce) {
    .tooltip {
      animation: none;
    }
  }
</style>

