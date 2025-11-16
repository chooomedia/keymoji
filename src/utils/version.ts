/*
Version management utility for centralized application version tracking.
Defines version number, codename, and update date in a single location.
Provides version formatting functions for display purposes.
*/

/**
 * Versionsinformationen Interface
 */
export interface VersionInfo {
    version: string;
    updated: string;
    codename: string;
}

// Aktuelle Version der Anwendung
export const appVersion: string = '0.7.7';

// Versionsinformationen mit Datum der letzten Aktualisierung
export const versionInfo: VersionInfo = {
    version: appVersion,
    updated: '2025-11-16',
    codename: 'Performance & Code Quality'
};

/**
 * Formatiert die Versionsnummer für die Anzeige
 * @param includeV - Ob 'v' Präfix hinzugefügt werden soll
 * @returns Formatierte Versionsnummer
 */
export function formatVersion(includeV: boolean = true): string {
    return includeV ? `v${appVersion}` : appVersion;
}

export default appVersion;

