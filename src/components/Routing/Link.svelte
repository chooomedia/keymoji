<!-- src/components/Routing/Link.svelte -->
<!-- Link-Komponente für Svelte 5 -->
<script lang="ts">
    import { navigate } from '../../utils/routing.ts';
    
    interface Props {
        to: string;
        replace?: boolean;
        class?: string;
        [key: string]: unknown;
    }
    
    let { to, replace = false, class: className = '', ...restProps }: Props = $props();
    
    function handleClick(e: MouseEvent): void {
        e.preventDefault();
        navigate(to, { replace });
    }
</script>

<a href={to} class={className} onclick={handleClick} {...restProps}>
    <slot />
</a>

