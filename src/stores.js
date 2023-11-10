// stores.js
import { writable } from 'svelte/store';

export const modalMessage = writable('');
// Store for successfull story-requests
export const successfulStoryRequests = writable([]);
// Initialer Wert aus dem Local Storage abrufen
const initialDarkMode = localStorage.getItem('darkMode') === 'true';
// Store für Dark Mode erstellen
export const darkMode = writable(initialDarkMode);
// Store for Dark-mode option
// Dark Mode im Local Storage aktualisieren, wenn sich der Wert ändert
darkMode.subscribe(value => {
    localStorage.setItem('darkMode', value.toString());
});