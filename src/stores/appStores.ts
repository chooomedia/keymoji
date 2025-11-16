// src/stores/appStores.ts
// Zentrale App-State Stores mit Svelte 5 Runes
// TypeScript Migration: v0.7.7
// Svelte 5 Runes Migration: v0.7.7
import type { Account, UserProfile } from '../types/Account';

// State Stores mit Svelte 5 Runes ($state)
// Direkte Zuweisungen funktionieren jetzt: currentAccount = accountData;
export let currentAccount = $state<Account | null>(null);
export let isLoggedIn = $state<boolean>(false);
export let userProfile = $state<UserProfile | null>(null);
export let accountTier = $state<'free' | 'pro'>('free');
export let dailyLimit = $state<{ limit: number; used: number }>({
    limit: 0,
    used: 0
});
export let accountSettings = $state<Record<string, unknown>>({});
export let successfulStoryRequests = $state<number>(0);
export let isDisabled = $state<boolean>(false);
export let currentLanguage = $state<string>('en');
export let darkMode = $state<boolean>(false);
export let showDonateMenu = $state<boolean>(false);

// User Counter Store (für Besucherzähler / Analytics-Preview)
// Hinweis: Hier ist nur ein Basis-Store implementiert. Die eigentliche
// Befüllung kann später über ein API-Call mit cachedFetch ergänzt werden.
export interface UserCounterState {
    value: number;
    isLoading: boolean;
    hasError: boolean;
    isCached: boolean;
}

export let userCounter = $state<UserCounterState | null>({
    value: 0,
    isLoading: false,
    hasError: false,
    isCached: false
});

// Derived Stores mit Svelte 5 Runes ($derived)
export let isGuestUser = $derived(!isLoggedIn);
export let isProUser = $derived(accountTier === 'pro');

export function updateDailyLimit(limit: number, used: number): void {
    // Direkte Zuweisung mit Runes
    dailyLimit = { limit, used };
}

export async function refreshUserCounter(): Promise<void> {
    // Platzhalter-Implementierung:
    // Später kann hier ein echter API-Call ergänzt werden (z.B. über cachedFetch),
    // der den aktuellen Besucherzähler vom Backend lädt.
    // Direkte Zuweisung mit Runes
    userCounter = {
        value: userCounter?.value ?? 0,
        isLoading: false,
        hasError: false,
        isCached: true
    };
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
