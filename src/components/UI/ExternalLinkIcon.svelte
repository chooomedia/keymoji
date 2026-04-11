<script>
    /** @type {'xs' | 'sm' | 'md'} */
    export let size = 'sm';
    /** @type {string} */
    export let extraClass = '';

    const sizeMap = {
        xs: 'w-3.5 h-3.5',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
    };
</script>

<svg
    class="{sizeMap[size] ?? sizeMap.sm} shrink-0 {extraClass}"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    stroke-width="2"
    aria-hidden="true"
    focusable="false"
>
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
</svg>
