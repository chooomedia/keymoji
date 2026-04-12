// src/stores/bannerStore.ts
// Single source of truth for AISetupBanner dismissed state
import { writable, type Writable } from 'svelte/store';
import { STORAGE_KEYS, storageHelpers } from '../config/storage.js';

const DISMISS_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

function readDismissed(): boolean {
    if (typeof window === 'undefined') return false;
    const entry = storageHelpers.get(STORAGE_KEYS.BANNER_DISMISSED) as { until?: number } | null;
    return !!(entry?.until && Date.now() < entry.until);
}

export const bannerDismissed: Writable<boolean> = writable(readDismissed());

export function dismissBanner(): void {
    storageHelpers.set(STORAGE_KEYS.BANNER_DISMISSED, { until: Date.now() + DISMISS_TTL_MS });
    bannerDismissed.set(true);
}
