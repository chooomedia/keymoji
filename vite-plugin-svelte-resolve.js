// vite-plugin-svelte-resolve.js
// Vite Plugin um Svelte 5 Module korrekt aufzulösen
// Basierend auf vite.config.example.js und Webpack common.js Einstellungen
// ALTERNATIVE IMPLEMENTATION: resolveId + load + transform für maximale Kompatibilität
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';

// Webpack common.js Einstellungen (aus webpack/common.js):
// - resolve.alias: svelte, svelte/store, svelte/internal, svelte/internal/disclose-version, svelte/internal/client
// - resolve.conditionNames: ['svelte', 'browser', 'import', 'module', 'main']
// - resolve.mainFields: ['svelte', 'browser', 'module', 'main']
// - resolve.extensions: ['.ts', '.mjs', '.js', '.svelte', '.jsx']
// - resolve.fullySpecified: false
// - resolve.modules: ['node_modules', 'src', '.']
// - resolve.symlinks: false

// Cache für aufgelöste Module
const resolvedModules = new Map();

// Plugin 1: resolveId + load (mit enforce: 'pre')
function svelteResolvePrePlugin() {
    return {
        name: 'svelte-resolve-pre',
        // CRITICAL: enforce: 'pre' für resolveId (muss VOR vite:import-analysis laufen)
        // ABER: transform muss NACH dem Svelte-Plugin laufen (kein enforce für transform)
        // Lösung: resolveId mit 'pre', transform ohne 'pre' (läuft nach Svelte-Plugin)
        enforce: 'pre',
        buildStart() {
            console.log(
                '[svelte-resolve] ✅ Plugin geladen (svelte/internal Resolution aktiv)'
            );
            resolvedModules.clear();
        },
        // resolveId: Wird VOR vite:import-analysis aufgerufen
        // CRITICAL: Muss für ALLE Imports greifen, auch aus transformierten .svelte Dateien
        resolveId(id, importer) {
            // Normalisiere ID (Windows/Unix Pfad-Unterschiede)
            const normalizedId = id.replace(/\\/g, '/');

            // DEBUG: Logge ALLE resolveId Aufrufe für svelte/* Module (NICHT svelte/store - wird von Vite normal aufgelöst)
            if (
                normalizedId === 'svelte/internal/client' ||
                normalizedId === 'svelte/internal/disclose-version' ||
                normalizedId.startsWith('svelte/internal/')
            ) {
                console.log(
                    `[svelte-resolve] 🔍 resolveId: ${normalizedId} from ${
                        importer ? importer.split('/').pop() : 'unknown'
                    }`
                );
            }

            // Verwende normalizedId für alle Prüfungen
            id = normalizedId;
            
            // FALLBACK: svelte/store Resolution (nur wenn Vite es nicht auflösen kann)
            // Normalerweise sollte Vite das über resolve.alias machen, aber als Fallback hier
            if (id === 'svelte/store' || id.startsWith('svelte/store/')) {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/store/index-client.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve] ✅ resolveId (fallback): ${id} → ${resolved
                            .split('/')
                            .pop()} from ${
                            importer ? importer.split('/').pop() : 'unknown'
                        }`
                    );
                    resolvedModules.set(id, resolved);
                    return resolved;
                }
            }
            
            // Svelte 5 interne Module
            if (id === 'svelte/internal/disclose-version') {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/disclose-version.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve] ✅ resolveId: ${id} → ${resolved
                            .split('/')
                            .pop()} from ${
                            importer ? importer.split('/').pop() : 'unknown'
                        }`
                    );
                    resolvedModules.set(id, resolved);
                    return resolved;
                }
                console.log(
                    `[svelte-resolve] ❌ resolveId: ${id} → Datei nicht gefunden: ${resolved}`
                );
                return undefined;
            }
            if (id === 'svelte/internal/client') {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/client/index.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve] ✅ resolveId: ${id} → ${resolved
                            .split('/')
                            .pop()} from ${
                            importer ? importer.split('/').pop() : 'unknown'
                        }`
                    );
                    resolvedModules.set(id, resolved);
                    return resolved;
                }
                console.log(
                    `[svelte-resolve] ❌ resolveId: ${id} → Datei nicht gefunden: ${resolved}`
                );
                return undefined;
            }
            // Svelte 5: internal als Verzeichnis
            // Webpack common.js: 'svelte/internal': path.resolve('node_modules', 'svelte', 'src', 'internal')
            // vite.config.example.js: 'svelte/internal': path.resolve(__dirname, 'node_modules/svelte/src/internal')
            if (id.startsWith('svelte/internal/')) {
                const subPath = id.replace('svelte/internal/', '');
                let resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal',
                    subPath
                );
                if (fs.existsSync(resolved)) {
                    resolvedModules.set(id, resolved);
                    return resolved;
                }
                if (fs.existsSync(resolved + '.js')) {
                    resolvedModules.set(id, resolved + '.js');
                    return resolved + '.js';
                }
                if (fs.existsSync(path.join(resolved, 'index.js'))) {
                    const indexPath = path.join(resolved, 'index.js');
                    resolvedModules.set(id, indexPath);
                    return indexPath;
                }
                return undefined;
            }
            return undefined;
        },
        // load: Wird aufgerufen, wenn ein Modul geladen wird
        // CRITICAL: load läuft VOR vite:import-analysis, daher können wir hier Code modifizieren
        load(id) {
            // Prüfe ob es ein aufgelöstes Modul ist
            if (resolvedModules.has(id)) {
                const resolvedPath = resolvedModules.get(id);
                if (fs.existsSync(resolvedPath)) {
                    console.log(
                        `[svelte-resolve] ✅ load: ${id} → ${resolvedPath
                            .split('/')
                            .pop()}`
                    );
                    return fs.readFileSync(resolvedPath, 'utf-8');
                }
            }
            // FALLBACK: svelte/store Loading (nur wenn Vite es nicht auflösen kann)
            if (id === 'svelte/store' || id.includes('svelte/store')) {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/store/index-client.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve] ✅ load (fallback): ${id} → ${resolved
                            .split('/')
                            .pop()}`
                    );
                    return fs.readFileSync(resolved, 'utf-8');
                }
            }
            // Prüfe ob es ein svelte/internal/client Import ist (Fallback)
            if (id === 'svelte/internal/client') {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/client/index.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve] ✅ load (fallback): ${id} → ${resolved
                            .split('/')
                            .pop()}`
                    );
                    return fs.readFileSync(resolved, 'utf-8');
                }
            }
            // Prüfe ob es ein svelte/internal/disclose-version Import ist (Fallback)
            if (id === 'svelte/internal/disclose-version') {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/disclose-version.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve] ✅ load (fallback): ${id} → ${resolved
                            .split('/')
                            .pop()}`
                    );
                    return fs.readFileSync(resolved, 'utf-8');
                }
            }
            // CRITICAL: Für .ts und .svelte Dateien: Ersetze svelte/* Imports VOR vite:import-analysis
            if (
                (id.endsWith('.ts') || id.endsWith('.svelte')) &&
                fs.existsSync(id)
            ) {
                let code = fs.readFileSync(id, 'utf-8');
                let hasChanges = false;
                let newCode = code;

                // DEBUG: Logge wenn wir eine .svelte Datei mit svelte/* Imports finden (NICHT svelte/store)
                if (
                    id.endsWith('.svelte') &&
                    (code.includes('svelte/internal/disclose-version') ||
                        code.includes('svelte/internal/client'))
                ) {
                    console.log(
                        `[svelte-resolve] 🔍 load: ${id
                            .split('/')
                            .pop()} enthält svelte/internal/* Imports`
                    );
                }

                // HINWEIS: svelte/store wird NICHT hier ersetzt - Vite macht das automatisch korrekt

                // Ersetze svelte/internal/client
                if (
                    code.includes("from 'svelte/internal/client'") ||
                    code.includes('from "svelte/internal/client"') ||
                    code.includes("import 'svelte/internal/client'") ||
                    code.includes('import "svelte/internal/client"')
                ) {
                    const resolved = path.resolve(
                        __dirname,
                        'node_modules/svelte/src/internal/client/index.js'
                    );
                    if (fs.existsSync(resolved)) {
                        const relativePath = path.relative(
                            path.dirname(id),
                            resolved
                        );
                        const normalizedPath = relativePath.startsWith('.')
                            ? relativePath
                            : './' + relativePath;
                        newCode = newCode.replace(
                            /(?:from|import) ['"]svelte\/internal\/client['"]/g,
                            match => {
                                const quote = match.includes("'") ? "'" : '"';
                                const prefix = match.startsWith('import')
                                    ? 'import'
                                    : 'from';
                                return `${prefix} ${quote}${normalizedPath}${quote}`;
                            }
                        );
                        hasChanges = true;
                    }
                }

                // Ersetze svelte/internal/disclose-version
                if (
                    code.includes("from 'svelte/internal/disclose-version'") ||
                    code.includes('from "svelte/internal/disclose-version"') ||
                    code.includes(
                        "import 'svelte/internal/disclose-version'"
                    ) ||
                    code.includes('import "svelte/internal/disclose-version"')
                ) {
                    const resolved = path.resolve(
                        __dirname,
                        'node_modules/svelte/src/internal/disclose-version.js'
                    );
                    if (fs.existsSync(resolved)) {
                        const relativePath = path.relative(
                            path.dirname(id),
                            resolved
                        );
                        const normalizedPath = relativePath.startsWith('.')
                            ? relativePath
                            : './' + relativePath;
                        newCode = newCode.replace(
                            /(?:from|import) ['"]svelte\/internal\/disclose-version['"]/g,
                            match => {
                                const quote = match.includes("'") ? "'" : '"';
                                const prefix = match.startsWith('import')
                                    ? 'import'
                                    : 'from';
                                return `${prefix} ${quote}${normalizedPath}${quote}`;
                            }
                        );
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    console.log(
                        `[svelte-resolve] ✅ load (transform): ${id
                            .split('/')
                            .pop()} → Imports ersetzt VOR vite:import-analysis`
                    );
                    return newCode;
                }
            }
            return undefined;
        },
        // transform: Wird aufgerufen, wenn ein Modul transformiert wird
        // CRITICAL: Muss auch für optimierte Dependencies, Svelte-Quelldateien UND transformierte .svelte Dateien funktionieren
        // WICHTIG: transform läuft NACH dem Svelte-Plugin, daher müssen wir die transformierten Imports ersetzen
        transform(code, id) {
            // DEBUG: Logge wenn wir eine .svelte Datei transformieren
            if (
                id.endsWith('.svelte') ||
                id.includes('LanguageRouter') ||
                id.includes('Router.svelte') ||
                id.includes('Route.svelte')
            ) {
                if (
                    code.includes(
                        "import 'svelte/internal/disclose-version'"
                    ) ||
                    code.includes('import "svelte/internal/disclose-version"')
                ) {
                    console.log(
                        `[svelte-resolve] 🔍 transform: ${id
                            .split('/')
                            .pop()} enthält disclose-version Import`
                    );
                }
            }

            // CRITICAL: Transformierte .svelte Dateien - prüfe nur interne Module (NICHT svelte/store)
            // Das Svelte-Plugin fügt automatisch Imports hinzu, daher müssen wir ALLE Dateien prüfen
            const hasSvelteInternalImports =
                code.includes("from 'svelte/internal/client'") ||
                code.includes('from "svelte/internal/client"') ||
                code.includes("from 'svelte/internal/disclose-version'") ||
                code.includes('from "svelte/internal/disclose-version"') ||
                code.includes("import 'svelte/internal/disclose-version'") ||
                code.includes('import "svelte/internal/disclose-version"');

            // CRITICAL: Prüfe nur interne Module (NICHT svelte/store - wird von Vite normal aufgelöst)
            // Das Svelte-Plugin fügt automatisch Imports hinzu, daher müssen wir ALLE Dateien prüfen
            if (hasSvelteInternalImports) {
                let newCode = code;
                let hasChanges = false;

                // HINWEIS: svelte/store wird NICHT hier ersetzt - Vite macht das automatisch korrekt

                // Ersetze svelte/internal/client
                if (
                    code.includes("from 'svelte/internal/client'") ||
                    code.includes('from "svelte/internal/client"')
                ) {
                    const resolved = path.resolve(
                        __dirname,
                        'node_modules/svelte/src/internal/client/index.js'
                    );
                    if (fs.existsSync(resolved)) {
                        const relativePath = path.relative(
                            path.dirname(id),
                            resolved
                        );
                        const normalizedPath = relativePath.startsWith('.')
                            ? relativePath
                            : './' + relativePath;
                        newCode = newCode.replace(
                            /from ['"]svelte\/internal\/client['"]/g,
                            match => {
                                const quote = match.includes("'") ? "'" : '"';
                                return `from ${quote}${normalizedPath}${quote}`;
                            }
                        );
                        hasChanges = true;
                    }
                }

                // Ersetze svelte/internal/disclose-version
                if (
                    code.includes("from 'svelte/internal/disclose-version'") ||
                    code.includes('from "svelte/internal/disclose-version"') ||
                    code.includes(
                        "import 'svelte/internal/disclose-version'"
                    ) ||
                    code.includes('import "svelte/internal/disclose-version"')
                ) {
                    const resolved = path.resolve(
                        __dirname,
                        'node_modules/svelte/src/internal/disclose-version.js'
                    );
                    if (fs.existsSync(resolved)) {
                        const relativePath = path.relative(
                            path.dirname(id),
                            resolved
                        );
                        const normalizedPath = relativePath.startsWith('.')
                            ? relativePath
                            : './' + relativePath;
                        newCode = newCode.replace(
                            /(?:from|import) ['"]svelte\/internal\/disclose-version['"]/g,
                            match => {
                                const quote = match.includes("'") ? "'" : '"';
                                const prefix = match.startsWith('import')
                                    ? 'import'
                                    : 'from';
                                return `${prefix} ${quote}${normalizedPath}${quote}`;
                            }
                        );
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    console.log(
                        `[svelte-resolve] ✅ transform: ${id
                            .split('/')
                            .pop()} → Imports ersetzt`
                    );
                    return {
                        code: newCode,
                        map: null
                    };
                }
            }
            return undefined;
        }
    };
}

// Plugin 2: transform (OHNE enforce: 'pre' - läuft NACH dem Svelte-Plugin)
// CRITICAL: Muss NACH dem Svelte-Plugin laufen, um die hinzugefügten Imports zu ersetzen
// ABER: vite:import-analysis läuft auch nach dem Svelte-Plugin, daher müssen wir resolveId verwenden
function svelteResolveTransformPlugin() {
    return {
        name: 'svelte-resolve-transform',
        // KEIN enforce: 'pre' - läuft NACH dem Svelte-Plugin
        // resolveId wird für alle Imports aufgerufen, auch die vom Svelte-Plugin hinzugefügten
        resolveId(id, importer) {
            // Normalisiere ID (Windows/Unix Pfad-Unterschiede)
            const normalizedId = id.replace(/\\/g, '/');

            // CRITICAL: Auch nach dem Svelte-Plugin müssen wir resolveId implementieren
            // für die Imports, die das Svelte-Plugin hinzugefügt hat
            if (normalizedId === 'svelte/internal/disclose-version') {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/disclose-version.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve-transform] ✅ resolveId: ${normalizedId} → ${resolved
                            .split('/')
                            .pop()} from ${
                            importer ? importer.split('/').pop() : 'unknown'
                        }`
                    );
                    return resolved;
                }
            }
            if (normalizedId === 'svelte/internal/client') {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/client/index.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve-transform] ✅ resolveId: ${normalizedId} → ${resolved
                            .split('/')
                            .pop()} from ${
                            importer ? importer.split('/').pop() : 'unknown'
                        }`
                    );
                    return resolved;
                }
            }
            // FALLBACK: svelte/store Resolution (nur wenn Vite es nicht auflösen kann)
            if (
                normalizedId === 'svelte/store' ||
                normalizedId.startsWith('svelte/store/')
            ) {
                const resolved = path.resolve(
                    __dirname,
                    'node_modules/svelte/src/store/index-client.js'
                );
                if (fs.existsSync(resolved)) {
                    console.log(
                        `[svelte-resolve-transform] ✅ resolveId (fallback): ${normalizedId} → ${resolved
                            .split('/')
                            .pop()} from ${
                            importer ? importer.split('/').pop() : 'unknown'
                        }`
                    );
                    return resolved;
                }
            }
            return undefined;
        },
        transform(code, id) {
            // DEBUG: Logge wenn wir eine .svelte Datei transformieren
            if (
                id.endsWith('.svelte') ||
                id.includes('LanguageRouter') ||
                id.includes('Router.svelte') ||
                id.includes('Route.svelte')
            ) {
                if (
                    code.includes(
                        "import 'svelte/internal/disclose-version'"
                    ) ||
                    code.includes('import "svelte/internal/disclose-version"')
                ) {
                    console.log(
                        `[svelte-resolve-transform] 🔍 transform: ${id
                            .split('/')
                            .pop()} enthält disclose-version Import`
                    );
                }
            }

            // CRITICAL: Transformierte .svelte Dateien - prüfe nur interne Module (NICHT svelte/store)
            // Das Svelte-Plugin fügt automatisch Imports hinzu, daher müssen wir ALLE Dateien prüfen
            const hasSvelteInternalImports =
                code.includes("from 'svelte/internal/client'") ||
                code.includes('from "svelte/internal/client"') ||
                code.includes("from 'svelte/internal/disclose-version'") ||
                code.includes('from "svelte/internal/disclose-version"') ||
                code.includes("import 'svelte/internal/disclose-version'") ||
                code.includes('import "svelte/internal/disclose-version"');

            // CRITICAL: Prüfe nur interne Module (NICHT svelte/store - wird von Vite normal aufgelöst)
            // Das Svelte-Plugin fügt automatisch Imports hinzu, daher müssen wir ALLE Dateien prüfen
            if (hasSvelteInternalImports) {
                let newCode = code;
                let hasChanges = false;

                // HINWEIS: svelte/store wird NICHT hier ersetzt - Vite macht das automatisch korrekt

                // Ersetze svelte/internal/client
                if (
                    code.includes("from 'svelte/internal/client'") ||
                    code.includes('from "svelte/internal/client"')
                ) {
                    const resolved = path.resolve(
                        __dirname,
                        'node_modules/svelte/src/internal/client/index.js'
                    );
                    if (fs.existsSync(resolved)) {
                        const relativePath = path.relative(
                            path.dirname(id),
                            resolved
                        );
                        const normalizedPath = relativePath.startsWith('.')
                            ? relativePath
                            : './' + relativePath;
                        newCode = newCode.replace(
                            /from ['"]svelte\/internal\/client['"]/g,
                            match => {
                                const quote = match.includes("'") ? "'" : '"';
                                return `from ${quote}${normalizedPath}${quote}`;
                            }
                        );
                        hasChanges = true;
                    }
                }

                // Ersetze svelte/internal/disclose-version
                if (
                    code.includes("from 'svelte/internal/disclose-version'") ||
                    code.includes('from "svelte/internal/disclose-version"') ||
                    code.includes(
                        "import 'svelte/internal/disclose-version'"
                    ) ||
                    code.includes('import "svelte/internal/disclose-version"')
                ) {
                    const resolved = path.resolve(
                        __dirname,
                        'node_modules/svelte/src/internal/disclose-version.js'
                    );
                    if (fs.existsSync(resolved)) {
                        const relativePath = path.relative(
                            path.dirname(id),
                            resolved
                        );
                        const normalizedPath = relativePath.startsWith('.')
                            ? relativePath
                            : './' + relativePath;
                        newCode = newCode.replace(
                            /(?:from|import) ['"]svelte\/internal\/disclose-version['"]/g,
                            match => {
                                const quote = match.includes("'") ? "'" : '"';
                                const prefix = match.startsWith('import')
                                    ? 'import'
                                    : 'from';
                                return `${prefix} ${quote}${normalizedPath}${quote}`;
                            }
                        );
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    console.log(
                        `[svelte-resolve-transform] ✅ transform: ${id
                            .split('/')
                            .pop()} → Imports ersetzt`
                    );
                    return {
                        code: newCode,
                        map: null
                    };
                }
            }
            return undefined;
        }
    };
}

// Haupt-Export: Gibt beide Plugins zurück
export default function svelteResolvePlugin() {
    return [svelteResolvePrePlugin(), svelteResolveTransformPlugin()];
}
