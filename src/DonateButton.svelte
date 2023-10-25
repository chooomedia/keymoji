<script>
    import { fly } from 'svelte/transition'; // für die Animation

    let showMenu = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }
</script>

<div class="relative inline-block text-left">
    <button class="md:block hidden fixed bottom-4 right-4 bg-blue text-white py-3 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none z-20" on:click={toggleMenu}>
        ☕ Buy me a coffee
    </button>
    <button class="md:hidden block fixed bottom-4 right-4 bg-blue text-white py-3 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none z-20" on:click={toggleMenu}>
        ☕ Donate
    </button>

    {#if showMenu}
    <div transition:fly={{ duration: 200 }} style="bottom: 64px;" class="fixed md:right-12 right-4 rounded-t-xl shadow-lg bg-creme dark:bg-aubergine ring-1 ring-black ring-opacity-5 z-10 overflow-hidden">
        <div role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            <a href="https://www.paypal.me/choooomedia/1" target="_blank" class="text-black dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-gray rounded-t-xl" role="menuitem">
                PayPal.me
            </a>
            <a href="ko-fi.com/keymoji" target="_blank" class="text-black dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-gray" role="menuitem">
                Ko-fi
            </a>
            <a href="YOUR_PRO_ACCOUNT_LINK_HERE" target="_blank" class="text-black dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-gray" role="menuitem">
                Pro Account
            </a>
        </div>
    </div>
    {/if}
</div>