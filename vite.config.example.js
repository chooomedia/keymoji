// vite.config.js - Beispiel-Konfiguration für Keymoji
// Diese Datei zeigt, wie die Webpack-Konfiguration nach Vite migriert werden würde

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        svelte({
            compilerOptions: {
                runes: true,
                generate: 'client',
                dev: process.env.NODE_ENV !== 'production',
                immutable: false,
                accessors: false,
                css: 'injected'
            },
            preprocess: [
                // svelte-preprocess wird automatisch erkannt
                // TypeScript, PostCSS, etc. werden automatisch verarbeitet
            ]
        })
    ],

    // Resolve-Konfiguration (entspricht Webpack resolve.alias)
    resolve: {
        alias: {
            svelte: path.resolve(__dirname, 'node_modules/svelte'),
            'svelte/store': path.resolve(__dirname, 'node_modules/svelte/src/store/index-client.js'),
            'svelte/internal': path.resolve(__dirname, 'node_modules/svelte/src/internal'),
            'svelte/internal/disclose-version': path.resolve(__dirname, 'node_modules/svelte/src/internal/disclose-version.js'),
            'svelte/internal/client': path.resolve(__dirname, 'node_modules/svelte/src/internal/client/index.js')
        },
        extensions: ['.ts', '.mjs', '.js', '.svelte', '.jsx'],
        conditions: ['svelte', 'browser', 'import', 'module', 'main']
    },

    // Dev Server Konfiguration
    server: {
        port: process.env.PORT || 8080,
        host: process.env.HOST || 'localhost',
        open: true,
        cors: true,
        // History API Fallback für SPA Routing
        // Vite macht das automatisch, aber wir können es explizit konfigurieren
        // Alle Routen (inkl. /de, /de/account, etc.) werden auf index.html umgeleitet
    },

    // Build-Konfiguration
    build: {
        outDir: 'build',
        assetsDir: 'static',
        sourcemap: true, // Source Maps für Production
        minify: 'terser', // Oder 'esbuild' für schnellere Builds
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.warn']
            }
        },
        // Output in Unterordnern (wie Webpack)
        rollupOptions: {
            output: {
                // JavaScript in static/js/
                entryFileNames: 'static/js/[name].[hash].js',
                chunkFileNames: 'static/js/[name].[hash].chunk.js',
                // Assets in static/
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return 'static/css/[name].[hash].css';
                    }
                    if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
                        return 'static/fonts/[name].[hash][extname]';
                    }
                    if (/\.(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name)) {
                        return 'static/images/[name].[hash][extname]';
                    }
                    return 'static/[name].[hash][extname]';
                },
                // Code Splitting (wie Webpack splitChunks)
                manualChunks: {
                    // Svelte Framework separat
                    'svelte': ['svelte'],
                    // Vendor Chunks
                    'vendor': ['svelte-routing']
                }
            }
        },
        // CSS Code Splitting
        cssCodeSplit: true,
        // Chunk Size Warnings
        chunkSizeWarningLimit: 512
    },

    // Environment Variables
    // Vite verwendet automatisch .env Files
    // process.env → import.meta.env
    define: {
        'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        __SEO_ENABLED__: JSON.stringify(true),
        __PRELOAD_ENABLED__: JSON.stringify(true)
    },

    // CSS Konfiguration
    css: {
        postcss: {
            // PostCSS wird automatisch erkannt (postcss.config.js)
            // Tailwind CSS funktioniert out-of-the-box
        }
    },

    // Optimierungen
    optimizeDeps: {
        include: ['svelte', 'svelte-routing']
    }
});

