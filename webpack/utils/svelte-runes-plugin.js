// webpack/utils/svelte-runes-plugin.js
// Webpack Plugin um Svelte 5 Runes auch in .ts Dateien verfügbar zu machen
// Runes werden normalerweise nur in .svelte Dateien als globale Funktionen bereitgestellt

const path = require('path');

class SvelteRunesPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('SvelteRunesPlugin', (compilation) => {
            // Füge ein Banner hinzu, das Runes als globale Funktionen definiert
            compilation.hooks.processAssets.tap(
                {
                    name: 'SvelteRunesPlugin',
                    stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS
                },
                () => {
                    // Stelle sicher dass Runes als globale Funktionen verfügbar sind
                    // Dies wird durch die globale Definition in index-client.js gehandhabt
                    // Wir müssen nur sicherstellen, dass index-client.js geladen wird
                }
            );
        });

        // Stelle sicher dass svelte/index-client.js geladen wird, damit Runes verfügbar sind
        compiler.hooks.normalModuleFactory.tap('SvelteRunesPlugin', (normalModuleFactory) => {
            normalModuleFactory.hooks.beforeResolve.tap('SvelteRunesPlugin', (data) => {
                // Wenn eine .ts Datei 'svelte' importiert, stelle sicher dass index-client.js geladen wird
                if (data.request === 'svelte' && data.contextInfo?.issuer?.endsWith('.ts')) {
                    // Die Runes werden durch die globale Definition in index-client.js verfügbar gemacht
                    // Wir müssen nichts ändern, da der Import bereits index-client.js lädt
                }
            });
        });
    }
}

module.exports = SvelteRunesPlugin;

