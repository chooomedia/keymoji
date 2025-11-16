// src/stores/appStores.ts
// Zentrale App-State Stores mit klassischen Svelte-Stores
// TypeScript Migration: v0.7.7
import { writable, derived } from 'svelte/store';
import type { Account, UserProfile } from '../types/Account';

// State Stores
export const currentAccount = writable<Account | null>(null);
export const isLoggedIn = writable<boolean>(false);
export const userProfile = writable<UserProfile | null>(null);
export const accountTier = writable<'free' | 'pro'>('free');
export const dailyLimit = writable<{ limit: number; used: number }>({
    limit: 0,
    used: 0
});
export const accountSettings = writable<Record<string, unknown>>({});
export const successfulStoryRequests = writable<number>(0);
export const isDisabled = writable<boolean>(false);
export const currentLanguage = writable<string>('en');
export const darkMode = writable<boolean>(false);
export const showDonateMenu = writable<boolean>(false);

// User Counter Store (für Besucherzähler / Analytics-Preview)
// Hinweis: Hier ist nur ein Basis-Store implementiert. Die eigentliche
// Befüllung kann später über ein API-Call mit cachedFetch ergänzt werden.
export interface UserCounterState {
    value: number;
    isLoading: boolean;
    hasError: boolean;
    isCached: boolean;
}

export const userCounter = writable<UserCounterState | null>({
    value: 0,
    isLoading: false,
    hasError: false,
    isCached: false
});

// Derived Stores
export const isGuestUser = derived(isLoggedIn, ($isLoggedIn) => !$isLoggedIn);
export const isProUser = derived(accountTier, ($accountTier) => $accountTier === 'pro');

export function updateDailyLimit(limit: number, used: number): void {
    dailyLimit.set({ limit, used });
}

export async function refreshUserCounter(): Promise<void> {
    // Platzhalter-Implementierung:
    // Später kann hier ein echter API-Call ergänzt werden (z.B. über cachedFetch),
    // der den aktuellen Besucherzähler vom Backend lädt.
    userCounter.update((current) => ({
        value: (current?.value ?? 0),
        isLoading: false,
        hasError: false,
        isCached: true
    }));
}

export function sendAnalyticsEvent(
    event: string,
    data?: Record<string, unknown>
): void {
    if (typeof window !== 'undefined') {
        const win = window as unknown as {
            gtag?: (
                command: string,
                event: string,
                data?: Record<string, unknown>
            ) => void;
        };
        if (win.gtag) {
            win.gtag('event', event, data);
        }
    }
}
