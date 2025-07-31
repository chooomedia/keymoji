<!-- src/components/Layout/PageLayout.svelte -->
<script>
    import { fly, fade } from 'svelte/transition';
    import { currentLanguage } from '../../stores/contentStore.js';
    import Header from './Header.svelte';
    import FixedMenu from '../../widgets/FixedMenu.svelte';
    
    // Props für die Seite
    export let pageTitle = '';
    export let pageDescription = '';
    export let titleClass = 'text-gray';
    export let showIntroSection = false;
    export let introTitle = '';
    export let introText = '';
</script>

<!-- App Container -->
<main class="app-container overflow-x-hidden route-transition" data-lang={$currentLanguage}>
    <!-- Header -->
    <Header />
    
    <!-- Main Content Container -->
    <div class="min-h-screen scroll-smooth overflow-x-hidden" in:fly={{y: 50, duration: 400, delay: 200}} out:fade={{duration: 200}}>
        <!-- Main Content -->
        <section class="flex flex-col justify-center items-center min-h-screen py-8 px-4 z-10 gap-4 scroll-smooth overflow-x-hidden w-full">

            <!-- Content before header (e.g. images) -->
            <slot name="before-header"></slot>

            <!-- Main Heading -->
            <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
                <h1 class="md:text-4xl text-xl font-semibold dark:text-white mb-2 text-center w-full">
                    {pageTitle}
                </h1>
                <p class="dark:text-gray-400 mb-3 text-center w-full leading-relaxed {titleClass}">
                    {pageDescription}
                </p>
            </div>

            <!-- Optional Introduction Section -->
            {#if showIntroSection}
                <div class="text-center mb-6">
                    <h2 class="text-xl md:text-2xl font-semibold mb-2 dark:text-white">{introTitle}</h2>
                    <p class="text-sm text-gray">{introText}</p>
                </div>
            {/if}

            <!-- Additional content before main content (e.g. images) -->
            <slot name="before-content" />

            <!-- Main Content Box - Mit Hintergrund für Modularität -->
            <div class="content-wrapper pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-500 dark:bg-aubergine-80 backdrop-opacity-60 shadow-xl">
                <slot />
            </div>

            <!-- Optional Footer after content -->
            <slot name="footer" />
        </section>
    </div>

    <!-- Fixed Menu -->
    <FixedMenu align={'bottom'} />
</main> 