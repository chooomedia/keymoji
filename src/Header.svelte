<script>
    import content from "./content.js";
</script>

<nav>
    <h1 class="text-4xl font-semibold text-center dark:text-white">
        <a class="flex flex-wrap items-center justify-center" href="/">
            <svg role="img" class="w-52 h-52 transition" viewBox="0 0 600 600" fill="currentColor" alt={content.en.header.pageTitle}>
                {@html content.logo.svg}
            </svg>
            {content.en.header.pageTitle}

            <span class="text-xs -mt-6">
                {content.en.header.pageVersion}
            </span>
        </a>
    </h1>
    <h2 class="w-80 text-sm text-center md:mb-8 mb-3 dark:text-white z-20">
        {content.en.header.pageDescription}
    </h2>
</nav>
