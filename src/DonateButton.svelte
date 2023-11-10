<script>
    import { fly } from 'svelte/transition'; // für die Animation
    import content from './content.js';

    let showMenu = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }
</script>

<div class="relative inline-block text-left">
    <button class="md:block hidden fixed bottom-4 right-4 bg-blue text-white py-3 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none z-20 border-4 border-creme dark:border-aubergine" on:click={toggleMenu}>
        {content.en.donateButton.text}
    </button>
    <button class="md:hidden block fixed bottom-4 right-4 bg-blue text-white py-3 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none z-20 border-4 border-creme dark:border-aubergine" on:click={toggleMenu}>
        {content.en.donateButton.textMobile}
    </button>

    {#if showMenu}
    <div transition:fly={{ duration: 200 }} style="bottom: 70px;" class="fixed md:right-14 right-5 rounded-t-xl shadow-lg bg-creme dark:bg-aubergine ring-1 ring-black ring-opacity-5 z-10 overflow-hidden">
        <div role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            <a href="https://paypal.me/keymoji/1" target="_blank" class="text-black dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-gray rounded-t-xl" role="menuitem">
                {content.en.donateButton.menuTextPaypal}
            </a>
            <a href="https://ko-fi.com/keymoji" target="_blank" class="text-black dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-gray" role="menuitem">
                {content.en.donateButton.menuTextKofi}
            </a>
            <!--<a href="YOUR_PRO_ACCOUNT_LINK_HERE" target="_blank" class="text-black dark:text-white none px-4 py-2 text-sm w-full text-left hover:bg-gray" role="menuitem">
                {content.en.donateButton.menuTextPro}
            </a>-->
        </div>
    </div>
    {/if}
</div>