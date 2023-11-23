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

export const isDisabled = writable(false);
// Initialer Wert aus dem Local Storage abrufen
// Prüfen, ob im Local Storage ein Wert für den Dark Mode gespeichert ist
const storedDarkMode = localStorage.getItem('darkMode');
// Falls nicht, prüfen, ob der Nutzer ein dunkles Farbschema bevorzugt
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialDarkMode = storedDarkMode === null ? prefersDarkMode : storedDarkMode === 'true';

// Store für Dark Mode erstellen
export const darkMode = writable(initialDarkMode);

// Abonnieren des Stores, um Änderungen im Local Storage zu speichern
darkMode.subscribe(value => {
    localStorage.setItem('darkMode', value.toString());
});