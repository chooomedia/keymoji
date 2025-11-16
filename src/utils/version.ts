/**
 * Zentrale Definition der Anwendungsversion
 *
 * Diese Datei definiert die Versionsnummer an einer zentralen Stelle,
 * damit sie im gesamten Projekt konsistent verwendet werden kann.
 *
 * WICHTIG: Diese Datei sollte nur aktualisiert werden, wenn eine neue
 * Version veröffentlicht wird.
 *
 * TypeScript Migration: v0.7.7
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

// Exportiert die standardmäßige Versionsnummer
export default appVersion;

