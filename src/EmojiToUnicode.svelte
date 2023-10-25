<script>
    let showEmojiCodes = false; // Gemeinsame Variable

    function toggleEmojiCodes() {
        showEmojiCodes = !showEmojiCodes; // Ändern Sie die gemeinsame Variable
    }
</script>

<!-- Button, um zwischen Emojis und ihren Codes zu wechseln -->
<button on:click={toggleEmojiCodes} class="w-52 h-52 right-m41 top-m3 absolute transition duration-300 ease-in-out transform hover:scale-105 dark:bg-gray-800 dark:text-white bg-gray text-black p-2 rounded-full z-40">
    {showEmojiCodes ? '🙂' : '🤓'}
</button>