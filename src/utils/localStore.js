// Neue Datei: src/utils/localStore.js
import { writable } from 'svelte/store';

/**
 * Erstellt einen Svelte Store, der mit localStorage synchronisiert wird
 * @param {string} key - Der localStorage-Schlüssel
 * @param {any} initial - Der Initialwert
 * @returns {import('svelte/store').Writable}
 */
export function localStore(key, initial) {
    // Server-side rendering check
    if (typeof window === 'undefined') return writable(initial);

    const toString = value => JSON.stringify(value);
    const toObj = value => {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.warn(`Error parsing stored value for ${key}:`, e);
            return initial;
        }
    };

    // Lese aus localStorage mit Fallback auf initial
    let saved;
    try {
        saved = localStorage.getItem(key);
        saved = saved ? toObj(saved) : initial;
    } catch (e) {
        console.warn(`Error reading ${key} from localStorage:`, e);
        saved = initial;
    }

    // Erstelle den Store
    const store = writable(saved);

    // Subscribe auf Änderungen und aktualisiere localStorage
    store.subscribe(value => {
        try {
            localStorage.setItem(key, toString(value));
        } catch (e) {
            console.warn(`Error saving ${key} to localStorage:`, e);
        }
    });

    return store;
}
