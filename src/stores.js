// stores.js
import { writable } from 'svelte/store';

export const modalMessage = writable('');
// Store für erfolgreiche Story-Anfragen
export const successfulStoryRequests = writable([]);