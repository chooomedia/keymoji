// stores.js
import { writable } from 'svelte/store';

// Toggle Menu
export const showDonateMenu = writable(false);
export const showShareMenu = writable(false);
// ModalMessages
export const modalMessage = writable('');
export const isModalVisible = writable(false);
// Store for successfull story-requests
export const successfulStoryRequests = writable([]);
// Initialer Wert aus dem Local Storage abrufen
const initialDarkMode = localStorage.getItem('darkMode') === 'true';
// Store für Dark Mode erstellen
export const darkMode = writable(initialDarkMode);
// Store für Dark-mode option
darkMode.subscribe(value => {
    localStorage.setItem('darkMode', value.toString());
});