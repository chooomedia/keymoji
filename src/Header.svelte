<script>
    /* TODO correct routing to index.svelte */
    import { Link } from 'svelte-routing';
    import content from './content.js';

</script>

<h1 class="text-4xl font-semibold text-center mb-2 dark:text-white">
    <a href="/">{content.en.header.pageTitle}</a><span class="text-xs absolute">{content.en.header.pageVersion}</span>
</h1>
<h2 class="md:w-1/3 w-80 text-sm text-center md:mb-8 mb-3 dark:text-white z-20">
    {content.en.header.pageDescription}
</h2>