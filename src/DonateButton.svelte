<script>
    let showMenu = false;

    function openLink(url) {
        window.open(url, '_blank');
        showMenu = false;
    }
</script>

<div class="relative inline-block text-left">
    <button class="fixed bottom-4 right-4 bg-blue text-white py-3 px-4 rounded-full shadow-md transition transform hover:scale-105 focus:outline-none" on:click={() => (showMenu = !showMenu)}>
        ☕ Buy me a coffee
    </button>

    {#if showMenu}
    <div class="origin-bottom-right fixed right-4 mt-2 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                <button onClick={() => openLink('https://www.paypal.me/choooomedia/1')} class="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100" role="menuitem">
                    Via PayPal.me
                </button>
                <button onClick={() => openLink('https://www.otherdonationplatform.com/donate/YOUR_USERNAME?amount=1')} class="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100" role="menuitem">
                    Via Other Donation Platform
                </button>
            </div>
        </div>
    {/if}
</div>
