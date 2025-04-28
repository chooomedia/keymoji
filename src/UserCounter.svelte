<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    export let counter = writable(0);

    const numberFormatter = new Intl.NumberFormat('de-DE');

    // Fetch initial counter value from the store and database
    async function fetchCounter() {
        try {
        const response = await fetch('https://n8n.chooomedia.com/webhook/userCounter');
        if (response.ok) {
            const data = await response.json();
            counter.set(data.counter);
        } else {
            console.error('Error fetching counter:', response.statusText);
        }
        } catch (error) {
        console.error('Error:', error);
        }
    }
  
    // Listen for updates from the server
    function setupRealtimeUpdates() {
        const eventSource = new EventSource('https://n8n.chooomedia.com/webhook/userCounter');
        eventSource.onmessage = (event) => {
        const updatedCounter = JSON.parse(event.data).counter;
        counter.set(updatedCounter);
        };

        eventSource.onerror = (error) => {
        console.error('Realtime update error:', error);
        eventSource.close();
        };
    }

    onMount(() => {
        fetchCounter();
        setupRealtimeUpdates();
    });
  </script>

<div id="usercounter"
    class="flex items-center justify-center p-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg cursor-pointer shadow-lg hover:scale-105 transform transition duration-200 ease-in-out"
    aria-live="polite"
>
    <span class="text-3xl font-bold text-white" aria-label="User interaction counter">
        {#if $counter > 0}
            {numberFormatter.format($counter)}
        {/if}
    </span>
</div>
