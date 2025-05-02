// Neue Datei: src/services/apiClient.js
import { API_CONFIG } from '../config/api.js';

const DEFAULT_TIMEOUT = API_CONFIG.TIMEOUTS.DEFAULT;
const DEFAULT_RETRIES = API_CONFIG.RETRIES.DEFAULT;

/**
 * Universeller API-Client für HTTP-Anfragen
 */
export async function apiRequest(url, options = {}, retries = DEFAULT_RETRIES) {
    const {
        method = 'GET',
        headers = {},
        body = null,
        timeout = DEFAULT_TIMEOUT,
        ...restOptions
    } = options;

    // Setze Standard-Headers
    const requestHeaders = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...headers
    };

    // Erstelle Request mit Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : null,
            signal: controller.signal,
            ...restOptions
        });

        clearTimeout(timeoutId);

        // Fehlerbehandlung
        if (!response.ok) {
            if (retries > 0) {
                console.warn(
                    `Request failed, retrying... (${retries} retries left)`
                );
                return apiRequest(url, options, retries - 1);
            }

            throw new Error(
                `HTTP error ${response.status}: ${response.statusText}`
            );
        }

        // Erfolgreiche Antwort
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        // Timeout-Fehler
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }

        // Retry bei Netzwerkfehlern
        if (retries > 0 && error.message.includes('network')) {
            console.warn(
                `Network error, retrying... (${retries} retries left)`
            );
            return apiRequest(url, options, retries - 1);
        }

        throw error;
    }
}

// Hilfsmethoden für häufige HTTP-Methoden
export const api = {
    get: (url, options = {}) => apiRequest(url, { ...options, method: 'GET' }),
    post: (url, data, options = {}) =>
        apiRequest(url, { ...options, method: 'POST', body: data }),
    put: (url, data, options = {}) =>
        apiRequest(url, { ...options, method: 'PUT', body: data }),
    delete: (url, options = {}) =>
        apiRequest(url, { ...options, method: 'DELETE' })
};
