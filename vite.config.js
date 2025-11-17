// vite.config.js - Keymoji Vite Konfiguration
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';
import svelteResolvePlugin from './vite-plugin-svelte-resolve.js';
import sveltePreprocess from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';

    return {
        plugins: [
            // TEST: Plugin-Reihenfolge angepasst - svelte Plugin ZUERST, dann resolve Plugin
            svelte({
                compilerOptions: {
                    runes: true,
                    dev: !isProduction,
                    css: 'injected',
                    // HMR ist in Svelte 5 integriert
                    hmr: !isProduction
                },
                preprocess: sveltePreprocess({
                    typescript: {
                        tsconfigFile: './tsconfig.json',
                        compilerOptions: {
                            module: 'ESNext',
                            moduleResolution: 'bundler',
                            skipLibCheck: true,
                            transpileOnly: true,
                            noEmit: true,
                            strict: false,
                            noImplicitAny: false
                            // NOTE: verbatimModuleSyntax entfernt - verursacht 500-Fehler
                            // Stattdessen: Explizite type-Imports in Store-Dateien verwenden
                        }
                    },
                    postcss: {
                        plugins: [tailwindcss, autoprefixer]
                    }
                })
            }),
            // TEST: Svelte 5 Module Resolution Plugin NACH svelte Plugin (Reihenfolge geändert)
            ...svelteResolvePlugin(),
            // Bundle Analyzer (nur wenn ANALYZE=true)
            ...(process.env.ANALYZE === 'true'
                ? [
                      visualizer({
                          open: true,
                          filename: 'bundle-report.html',
                          gzipSize: true,
                          brotliSize: true
                      })
                  ]
                : [])
        ],

        // Resolve-Konfiguration
        resolve: {
            alias: {
                svelte: path.resolve(__dirname, 'node_modules/svelte'),
                'svelte/store': path.resolve(
                    __dirname,
                    'node_modules/svelte/src/store/index-client.js'
                ),
                'svelte/internal/disclose-version': path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/disclose-version.js'
                ),
                'svelte/internal/client': path.resolve(
                    __dirname,
                    'node_modules/svelte/src/internal/client/index.js'
                )
            },
            extensions: ['.ts', '.mjs', '.js', '.svelte', '.jsx'],
            // Reihenfolge aus vite.config.example.js: 'svelte' VOR 'browser'
            conditions: ['svelte', 'browser', 'import', 'module', 'main'],
            // mainFields: Standard von Vite verwenden (nicht überschreiben)
            dedupe: ['svelte']
        },

        // Dev Server Konfiguration
        server: {
            port: parseInt(process.env.PORT || '8080', 10),
            host: process.env.HOST || 'localhost',
            open: true,
            cors: true
            // History API Fallback für SPA Routing
            // Vite macht das automatisch, aber wir können es explizit konfigurieren
            // Alle Routen (inkl. /de, /de/account, etc.) werden auf index.html umgeleitet
        },

        // Build-Konfiguration
        build: {
            outDir: 'build',
            assetsDir: 'static',
            sourcemap: isProduction ? 'source-map' : false,
            minify: isProduction ? 'terser' : false,
            terserOptions: isProduction
                ? {
                      compress: {
                          drop_console: true,
                          drop_debugger: true,
                          pure_funcs: ['console.log', 'console.warn']
                      }
                  }
                : undefined,
            rollupOptions: {
                input: path.resolve(__dirname, 'index.html'),
                output: {
                    // JavaScript in static/js/
                    entryFileNames: 'static/js/[name].[hash].js',
                    chunkFileNames: 'static/js/[name].[hash].chunk.js',
                    // Assets in static/
                    assetFileNames: assetInfo => {
                        if (assetInfo.name.endsWith('.css')) {
                            return 'static/css/[name].[hash].css';
                        }
                        if (
                            /\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)
                        ) {
                            return 'static/fonts/[name].[hash][extname]';
                        }
                        if (
                            /\.(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name)
                        ) {
                            return 'static/images/[name].[hash][extname]';
                        }
                        return 'static/[name].[hash][extname]';
                    },
                    // Code Splitting (wie Webpack splitChunks)
                    // TEMPORÄR ENTFERNT: manualChunks könnte Module-Auflösung beeinflussen
                    // manualChunks: {
                    //     // Svelte Framework separat
                    //     svelte: ['svelte'],
                    //     // Vendor Chunks
                    //     vendor: ['svelte-routing']
                    // }
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
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || mode
            ),
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
            include: ['svelte', 'svelte-routing', 'svelte/store'],
            // Svelte interne Module ausschließen (nicht über package.json exports verfügbar)
            // WICHTIG: svelte/store NICHT ausschließen - wird benötigt!
            exclude: [
                'svelte/internal/client',
                'svelte/internal/disclose-version'
            ],
            esbuildOptions: {
                // Reihenfolge aus vite.config.example.js: 'svelte' VOR 'browser'
                conditions: ['svelte', 'browser', 'import', 'module', 'main']
            },
            // Force re-optimization wenn sich Dependencies ändern
            force: false
        }
    };
});
