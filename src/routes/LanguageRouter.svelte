<!-- src/routes/LanguageRouter.svelte -->
<script>
    import { Router, Route, navigate } from 'svelte-routing';
    import { onMount, onDestroy } from 'svelte';
    import { changeLanguage, currentLanguage } from '../stores/contentStore.js';
    import { getBrowserLanguage, isLanguageSupported } from '../utils/languages';
    import { closeModal, isModalVisible } from '../stores/modalStore';
    import { devLog } from '../utils/environment';
    import { initializeAccountFromCookies, resetSessionFlags } from '../stores/accountStore.js';
    import { darkMode } from 'stores/appStores';
    import { appVersion } from '../utils/version';
    import LoadingScreen from '../components/UI/LoadingScreen.svelte';
    import SEO from '../components/SEO.svelte';
    // PERFORMANCE: Index bleibt synchron (Hauptseite, muss schnell laden)
    import Index from '../index.svelte';
    
    // PERFORMANCE: Lazy Loading für Routes (Code Splitting)
    // Diese Komponenten werden nur geladen, wenn die Route besucht wird
    let BlogGrid, BlogPost, VersionHistory, ContactForm, AccountManager, StaticPage, NotFound;
    let routesLoaded = false;
    let loadingTimeout = null;
    let loadingStartTime = Date.now();
    
    // Lazy Load Components on mount (Preload für bessere UX)
    // ROBUST: Load each route individually to prevent single failures from blocking all routes
    async function loadRoutes() {
        if (routesLoaded) {
            console.log('✅ LanguageRouter: Routes already loaded');
            return;
        }
        
        console.log('🔄 LanguageRouter: Loading routes...');
        const routeLoaders = [
            {
                name: 'BlogGrid',
                loader: () => import('../components/Features/BlogGrid.svelte'),
                setter: (module) => { BlogGrid = module.default; }
            },
            {
                name: 'BlogPost',
                loader: () => import('../components/Features/BlogPost.svelte'),
                setter: (module) => { BlogPost = module.default; }
            },
            {
                name: 'VersionHistory',
                loader: () => import('./VersionHistory.svelte'),
                setter: (module) => { VersionHistory = module.default; }
            },
            {
                name: 'ContactForm',
                loader: () => import('./ContactForm.svelte'),
                setter: (module) => { ContactForm = module.default; }
            },
            {
                name: 'AccountManager',
                loader: () => import('./AccountManager.svelte'),
                setter: (module) => { AccountManager = module.default; }
            },
            {
                name: 'StaticPage',
                loader: () => import('./StaticPage.svelte'),
                setter: (module) => { StaticPage = module.default; }
            },
            {
                name: 'NotFound',
                loader: () => import('./NotFound.svelte'),
                setter: (module) => { NotFound = module.default; }
            }
        ];
        
        // Load routes in parallel but handle each failure individually
        const loadPromises = routeLoaders.map(async (route) => {
            try {
                const module = await route.loader();
                route.setter(module);
                console.log(`✅ LanguageRouter: ${route.name} loaded`);
                return { success: true, name: route.name };
            } catch (err) {
                console.error(`❌ LanguageRouter: Failed to load ${route.name}:`, err);
                return { success: false, name: route.name, error: err };
            }
        });
        
        const results = await Promise.all(loadPromises);
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        
        console.log(`✅ LanguageRouter: Routes loaded - ${successCount} success, ${failureCount} failures`);
        
        // Always set routesLoaded to true to prevent infinite loading
        // Even if some routes fail, the Router can still function with available routes
        routesLoaded = true;
        
        if (failureCount > 0) {
            console.warn('⚠️ LanguageRouter: Some routes failed to load. App will continue with available routes.');
        }
    }
    
    // Hole die unterstützten Sprachcodes direkt aus der utils/languages.js
    import { getSupportedLanguageCodes } from '../utils/languages';
    const supportedLanguages = getSupportedLanguageCodes();
    
    // Verfolge die aktuelle Route
    let currentPath = "";
    let currentPageType = "home";
    let pageURL = "";
    // Initialize url for Router - use window.location.pathname if available, otherwise null
    let url = typeof window !== 'undefined' ? window.location.pathname : null;
    let initialRouteProcessed = false;
    let processingRoute = false; // Verhindert gleichzeitige Route-Verarbeitung
    let isInvalidRoute = false; // SEO: noindex für Phantom-URLs
    
    // Bestimme den Seitentyp für SEO-Komponente
    function determinePageType(path) {
        // Extract path without language prefix
        const pathSegments = path.split('/').filter(segment => segment !== '');
        
        // Handle root path
        if (pathSegments.length === 0) {
            return 'home';
        }
        
        // If first segment is a language code
        if (supportedLanguages.includes(pathSegments[0])) {
            // If only language, it's the home page
            if (pathSegments.length === 1) {
                return 'home';
            }
            
            // Get the actual page path (after language code)
            const pageSegment = pathSegments[1];
            
            // Map segment to page type
            switch (pageSegment) {
                case 'blog': return 'blog';
                case 'versions': return 'versions';
                case 'contact': return 'contact';
                case 'account': return 'account';
                case 'privacy': return 'privacy';
                case 'legal': return 'legal';
                default: return 'home';
            }
        } else {
            // No language code, direct page path
            const pageSegment = pathSegments[0];
            
            // Map segment to page type
            switch (pageSegment) {
                case 'blog': return 'blog';
                case 'versions': return 'versions';
                case 'contact': return 'contact';
                case 'account': return 'account';
                case 'privacy': return 'privacy';
                case 'legal': return 'legal';

                default: return 'home';
            }
        }
    }
    
    // Verbesserte Route-Verarbeitung ohne Weiterleitung von Root zu Sprach-URL
    async function handleRouteChange() {
        console.log('🔄 LanguageRouter: handleRouteChange called');
        console.log('🔄 LanguageRouter: current path:', window.location.pathname);
        
        // Close any open modals when navigating to prevent them from appearing briefly
        if ($isModalVisible) {
            closeModal();
        }
        
        // Vermeide gleichzeitige Verarbeitung, was zu Race Conditions führen könnte
        if (processingRoute) {
            console.log('🔄 LanguageRouter: Route processing already in progress, skipping...');
            return;
        }
        
        processingRoute = true;
        
        try {
            // Normalisiere URL: Entferne trailing slash (außer bei root)
            let normalizedPath = window.location.pathname;
            if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
                normalizedPath = normalizedPath.slice(0, -1);
                // Redirect zu URL ohne trailing slash für SEO-Konsistenz
                if (window.location.pathname !== normalizedPath) {
                    const newUrl = normalizedPath + (window.location.search || '');
                    window.history.replaceState(null, '', newUrl);
                    console.log('🔄 LanguageRouter: Normalized URL (removed trailing slash):', newUrl);
                }
            }
            
            // Extrahiere den aktuellen Pfad
            currentPath = normalizedPath;
            pageURL = normalizedPath; // Set pageURL for SEO component
            url = normalizedPath; // Update url for Router component
            
            // Determine page type for SEO
            currentPageType = determinePageType(currentPath);
            console.log('🔄 LanguageRouter: Page type:', currentPageType);
            
            // Überprüfe Login-Status bei jedem Route-Wechsel - nur wenn nötig
            if (!initialRouteProcessed) {
                console.log('🔐 LanguageRouter: Checking login status...');
                const loginResult = initializeAccountFromCookies();
                console.log('🔐 LanguageRouter: Login check result:', loginResult);
            }
            
            // Extrahiere Pfadsegmente für die Spracherkennung
            const pathSegments = currentPath.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            devLog('🔄 LanguageRouter: Path segments:', pathSegments);
            devLog('🔄 LanguageRouter: Potential language:', potentialLang);

            // SEO: Phantom-URL-Schutz
            // Ungültige Multi-Segment-URLs (z.B. /qya/fr/de) → redirect zu /
            // Ungültige Single-Segment-URLs (z.B. /qya) → noindex setzen
            if (potentialLang && !supportedLanguages.includes(potentialLang)) {
                if (pathSegments.length > 1) {
                    devLog('🚫 LanguageRouter: Invalid multi-segment URL, redirecting to /', currentPath);
                    isInvalidRoute = true;
                    navigate('/', { replace: true });
                    return;
                }
                devLog('🚫 LanguageRouter: Invalid lang segment, setting noindex:', currentPath);
                isInvalidRoute = true;
            } else {
                isInvalidRoute = false;
            }

            // Wenn das erste Segment ein gültiger Sprachcode ist
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                devLog('🔄 LanguageRouter: Valid language found:', potentialLang);
                // Setze die Sprache basierend auf der URL, wenn sie anders ist
                if (potentialLang !== $currentLanguage) {
                    devLog('🔄 LanguageRouter: Language different, changing from', $currentLanguage, 'to', potentialLang);
                    await changeLanguage(potentialLang);
                } else {
                    devLog('🔄 LanguageRouter: Language already set to:', potentialLang);
                }
            } else {
                // Kein Sprachcode in URL - verwende aktuelle Sprache
                devLog('🔄 LanguageRouter: No valid language in URL, using current:', $currentLanguage);
            }
            
            // Preserve URL parameters for magic link verification
            const urlParams = new URLSearchParams(window.location.search);
            const hasMagicLinkParams = urlParams.get('t') || urlParams.get('token') || urlParams.get('e') || urlParams.get('email');
            
            if (hasMagicLinkParams) {
                console.log('🔗 LanguageRouter: Magic link parameters detected, preserving them');
                console.log('🔗 LanguageRouter: URL params:', window.location.search);
            }
            
            // Markiere, dass anfängliche Route verarbeitet wurde
            if (!initialRouteProcessed) {
                initialRouteProcessed = true;
                console.log('🔄 LanguageRouter: Initial route processed');
            }
        } catch (error) {
            console.error('❌ LanguageRouter: Error in route handling:', error);
        } finally {
            // Freigeben nach Verarbeitung
            processingRoute = false;
            console.log('🔄 LanguageRouter: Route processing finished');
        }
    }
    
    // SEO-optimierte App-Initialisierung
    onMount(async () => {
        try {
            devLog('🚀 LanguageRouter: Component mounted');
            
            // CRITICAL: Set loading timeout FIRST - before any async operations!
            // This ensures the timeout is always set, even if loadRoutes() fails
            loadingTimeout = setTimeout(() => {
                if (!routesLoaded) {
                    console.warn('⚠️ LanguageRouter: Loading timeout - forcing routesLoaded to true');
                    routesLoaded = true;
                }
            }, 10000);
            
            // CRITICAL: Hide static loading screen NOW that Svelte is ready
            // This ensures smooth transition from static HTML to Svelte LoadingScreen
            requestAnimationFrame(() => {
                const staticLoading = document.getElementById('static-loading-screen');
                if (staticLoading) {
                    staticLoading.style.display = 'none';
                    console.log('✅ LanguageRouter: Static loading screen hidden, Svelte LoadingScreen now visible');
                }
            });
            
            // NOTE: localStorage migration runs SYNCHRONOUSLY on appStores.js import
            // This ensures all data is clean BEFORE any store initialization
            
            // CRITICAL: Reset session flags on every page load (before session restore!)
            resetSessionFlags();
            console.log('✅ LanguageRouter: Session flags reset for new page load');
            
            // CRITICAL: Load routes BEFORE router initialization to prevent routing issues
            // Routes must be available when Router component mounts
            await loadRoutes();
            console.log('✅ LanguageRouter: Routes loaded, routesLoaded:', routesLoaded);
            
            // CRITICAL: Initialize daily usage for ALL users (logged in or guest)
            try {
                const { initializeDailyUsage } = await import('../stores/dailyUsageStore.js');
                await initializeDailyUsage();
                console.log('✅ LanguageRouter: Daily usage initialized on app start');
            } catch (error) {
                console.warn('⚠️ LanguageRouter: Failed to initialize daily usage:', error);
            }
            
            // Initialize account from cookies (session restore)
            console.log('🔐 LanguageRouter: Starting session restoration...');
            const sessionRestored = await initializeAccountFromCookies();
            console.log('🔐 LanguageRouter: Session restoration result:', sessionRestored);
            
            // SEO-optimierte Initialisierung
            currentPath = window.location.pathname;
            pageURL = currentPath;
            url = currentPath; // Initialize url for Router
            currentPageType = determinePageType(currentPath);
            
            // SEO-optimierte Sprach-Erkennung
            // REMOVED: setTimeout delay - Race Condition behoben, proper async/await verwendet
            const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            
            devLog('🔍 LanguageRouter: Language check:', {
                urlLang: potentialLang,
                storeLang: $currentLanguage,
                supported: supportedLanguages.includes(potentialLang)
            });
            
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                // SEO-optimierte URL-Sprach-Synchronisation
                if (potentialLang !== $currentLanguage) {
                    devLog('🔄 LanguageRouter: URL language differs from store, updating store');
                    await changeLanguage(potentialLang);
                }
            } else {
                // Kein Sprachcode in URL - keine Aktion nötig
                // Routes ohne Sprachpräfix werden direkt gerendert
                devLog('🔄 LanguageRouter: No language in URL, routes will handle it');
            }
            
            // SEO-optimierte Route-Verarbeitung (nur einmal beim Mount)
            await handleRouteChange();
            initialRouteProcessed = true;
            
            // SEO-optimierte Browser-Navigation
            window.addEventListener('popstate', handleRouteChange);
            
            // SEO-optimierte Benutzerdefinierte Navigation
            document.addEventListener('click', async (e) => {
                const langLink = e.target.closest('[data-language-link]');
                if (langLink) {
                    // REMOVED: setTimeout delay - Race Condition behoben, direkt aufrufen
                    await handleRouteChange();
                }
            });
            
            // SEO-optimierte Cleanup-Funktion
            return () => {
                window.removeEventListener('popstate', handleRouteChange);
                // Cleanup Loading-Timeout
                if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                    loadingTimeout = null;
                }
            };
        } catch (error) {
            devLog('❌ LanguageRouter: Error in onMount:', error);
        }
    });
</script>

<!-- Zentralisierte SEO-Komponente für die gesamte App -->
<SEO 
  pageType={currentPageType} 
  url={pageURL}
  noindex={isInvalidRoute}
/>
  
{#if routesLoaded}
<Router {url}>
    <Route path="/" component={Index} />
    
    <!-- PERFORMANCE: Lazy Loaded Routes mit svelte:component -->
        <!-- CRITICAL: Spezifische Routes MÜSSEN vor /:lang kommen! -->
        <!-- Sonst matched /:lang vor /:lang/contact und zeigt Index statt ContactForm -->
        <Route path="/versions" let:params>
            {#if VersionHistory}
                <svelte:component this={VersionHistory} />
            {:else}
                <LoadingScreen message="Loading version history..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/versions/" let:params>
            {#if VersionHistory}
                <svelte:component this={VersionHistory} />
            {:else}
                <LoadingScreen message="Loading version history..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/versions" let:params>
            {#if VersionHistory}
                <svelte:component this={VersionHistory} />
            {:else}
                <LoadingScreen message="Loading version history..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/versions/" let:params>
            {#if VersionHistory}
                <svelte:component this={VersionHistory} />
            {:else}
                <LoadingScreen message="Loading version history..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        
        <Route path="/contact" let:params>
            {#if ContactForm}
                <svelte:component this={ContactForm} />
            {:else}
                <LoadingScreen message="Loading contact form..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/contact/" let:params>
            {#if ContactForm}
                <svelte:component this={ContactForm} />
            {:else}
                <LoadingScreen message="Loading contact form..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/contact" let:params>
            {#if ContactForm}
                <svelte:component this={ContactForm} />
            {:else}
                <LoadingScreen message="Loading contact form..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/contact/" let:params>
            {#if ContactForm}
                <svelte:component this={ContactForm} />
            {:else}
                <LoadingScreen message="Loading contact form..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        
        <Route path="/account" let:params>
            {#if AccountManager}
                <svelte:component this={AccountManager} />
            {:else}
                <LoadingScreen message="Loading account..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/account/" let:params>
            {#if AccountManager}
            <svelte:component this={AccountManager} />
            {:else}
                <LoadingScreen message="Loading account..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/account" let:params>
            {#if AccountManager}
                <svelte:component this={AccountManager} />
            {:else}
                <LoadingScreen message="Loading account..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/account/" let:params>
            {#if AccountManager}
            <svelte:component this={AccountManager} />
            {:else}
                <LoadingScreen message="Loading account..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        
        <Route path="/blog" let:params>
            {#if BlogGrid}
                <svelte:component this={BlogGrid} />
            {:else}
                <LoadingScreen message="Loading blog..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/blog/" let:params>
            {#if BlogGrid}
                <svelte:component this={BlogGrid} />
            {:else}
                <LoadingScreen message="Loading blog..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/blog" let:params>
            {#if BlogGrid}
                <svelte:component this={BlogGrid} />
            {:else}
                <LoadingScreen message="Loading blog..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/blog/" let:params>
            {#if BlogGrid}
                <svelte:component this={BlogGrid} />
            {:else}
                <LoadingScreen message="Loading blog..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        
        <Route path="/blog/:slug" let:params>
            {#if BlogPost}
                <svelte:component this={BlogPost} slug={params.slug} />
            {:else}
                <LoadingScreen message="Loading blog post..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/blog/:slug" let:params>
            {#if BlogPost}
                <svelte:component this={BlogPost} slug={params.slug} />
            {:else}
                <LoadingScreen message="Loading blog post..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        
        <Route path="/privacy" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="privacy" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/privacy/" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="privacy" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/privacy" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="privacy" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/privacy/" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="privacy" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        
        <Route path="/legal" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="legal" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/legal/" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="legal" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/legal" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="legal" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        <Route path="/:lang/legal/" let:params>
            {#if StaticPage}
                <svelte:component this={StaticPage} slug="legal" />
            {:else}
                <LoadingScreen message="Loading page..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
        
        <!-- CRITICAL: /:lang Route MUSS als letzte kommen, nach allen spezifischen Routes! -->
        <Route path="/:lang" let:params>
            <Index />
        </Route>
        
        <Route>
            {#if NotFound}
                <svelte:component this={NotFound} />
            {:else}
                <LoadingScreen message="Loading..." showDebugInfo={false} loadingStartTime={loadingStartTime} />
            {/if}
        </Route>
    </Router>
{:else}
    <!-- Show LoadingScreen immediately when LanguageRouter mounts (before routes are loaded) -->
    <!-- This ensures smooth transition from static HTML loading screen -->
    <LoadingScreen 
        message="Initializing Keymoji..." 
        subMessage="Loading application..."
        loadingStartTime={loadingStartTime} 
        showDebugInfo={true} 
    />
{/if}