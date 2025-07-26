// src/utils/version.js
/**
 * Zentrale Definition der Anwendungsversion
 *
 * Diese Datei definiert die Versionsnummer an einer zentralen Stelle,
 * damit sie im gesamten Projekt konsistent verwendet werden kann.
 *
 * WICHTIG: Diese Datei sollte nur aktualisiert werden, wenn eine neue
 * Version veröffentlicht wird.
 */

// Aktuelle Version der Anwendung
export const appVersion = '0.4.3';

// Versionsinformationen mit Datum der letzten Aktualisierung
export const versionInfo = {
    version: appVersion,
    updated: '2025-07-27',
    codename: 'Favicon Fox'
};

// Diese Funktion formatiert die Versionsnummer für die Anzeige
export function formatVersion(includeV = true) {
    return includeV ? `v${appVersion}` : appVersion;
}

// Exportiert die standardmäßige Versionsnummer
export default appVersion;
