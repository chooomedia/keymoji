<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    export let counter = writable(0);

    const numberFormatter = new Intl.NumberFormat('de-DE');
    let isConnected = false;
    let eventSource = null;

    // Zähler initial vom Store und der Datenbank holen
    async function fetchCounter() {
        // Im Entwicklungsmodus CORS-Probleme vermeiden
        if (process.env.NODE_ENV === 'development') {
            // Einen Mock-Wert in der Entwicklung verwenden
            counter.set(Math.floor(Math.random() * 10000) + 5000);
            return;
        }
        
        try {
            const response = await fetch('https://n8n.chooomedia.com/webhook/userCounter', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                counter.set(data.counter);
                isConnected = true;
            } else {
                console.error('Fehler beim Abrufen des Zählers:', response.statusText);
                // Fallback zu einer zufälligen Zahl
                counter.set(Math.floor(Math.random() * 10000) + 5000);
            }
        } catch (error) {
            console.error('Fehler:', error);
            // Fallback zu einer zufälligen Zahl wenn Abruf fehlschlägt
            counter.set(Math.floor(Math.random() * 10000) + 5000);
        }
    }
  
    // Auf Echtzeit-Updates vom Server hören
    function setupRealtimeUpdates() {
        // Im Entwicklungsmodus überspringen
        if (process.env.NODE_ENV === 'development') {
            // Mock-Update-Mechanismus einrichten
            const intervalId = setInterval(() => {
                counter.update(c => c + Math.floor(Math.random() * 5) + 1);
            }, 30000);
            
            return () => clearInterval(intervalId);
        }
        
        try {
            eventSource = new EventSource('https://n8n.chooomedia.com/webhook/userCounter');
            
            eventSource.onmessage = (event) => {
                try {
                    const updatedCounter = JSON.parse(event.data).counter;
                    counter.set(updatedCounter);
                    isConnected = true;
                } catch (err) {
                    console.error('Fehler beim Parsen der Zählerdaten:', err);
                }
            };
    
            eventSource.onerror = (error) => {
                console.error('Echtzeit-Update-Fehler:', error);
                isConnected = false;
                
                // Automatisch nach einer Verzögerung neu verbinden
                setTimeout(() => {
                    if (eventSource) {
                        eventSource.close();
                        setupRealtimeUpdates();
                    }
                }, 5000);
            };
            
            return () => {
                if (eventSource) {
                    eventSource.close();
                    eventSource = null;
                }
            };
        } catch (error) {
            console.error('Fehler beim Einrichten der EventSource:', error);
            return () => {};
        }
    }

    onMount(() => {
        fetchCounter();
        const cleanup = setupRealtimeUpdates();
        
        return cleanup;
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

<style>
    /* Unterstützung für reduzierte Bewegung hinzufügen */
    @media (prefers-reduced-motion: reduce) {
        div {
            transition: none !important;
            transform: none !important;
        }
    }
</style>