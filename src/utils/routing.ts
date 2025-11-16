// src/utils/routing.ts
// Einfache Routing-Lösung für Svelte 5
// Ersetzt svelte-routing mit Svelte 5 kompatibler Lösung

// Reaktive Variable für currentLocation
// Wird über notifyListeners aktualisiert, damit Komponenten reagieren können
let _currentLocation = typeof window !== 'undefined' ? window.location.pathname : '/';
let routeListeners: Array<() => void> = [];

// Export als Variable für direkten Zugriff
// Komponenten sollten subscribe() verwenden, um auf Änderungen zu reagieren
export let currentLocation: string = _currentLocation;

function updateCurrentLocation(newLocation: string): void {
    _currentLocation = newLocation;
    currentLocation = _currentLocation;
}

export function navigate(path: string, options?: { replace?: boolean }): void {
    if (typeof window === 'undefined') return;
    
    if (options?.replace) {
        window.history.replaceState({}, '', path);
    } else {
        window.history.pushState({}, '', path);
    }
    
    updateCurrentLocation(window.location.pathname);
    notifyListeners();
}

export function subscribe(listener: () => void): () => void {
    routeListeners.push(listener);
    return () => {
        routeListeners = routeListeners.filter(l => l !== listener);
    };
}

function notifyListeners(): void {
    routeListeners.forEach(listener => listener());
}

if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
        updateCurrentLocation(window.location.pathname);
        notifyListeners();
    });
    
    document.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement;
        if (!target) return;
        
        const href = target.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        
        e.preventDefault();
        navigate(href);
    });
}
