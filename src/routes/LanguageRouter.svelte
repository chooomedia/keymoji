<!-- src/routes/LanguageRouter.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    
    // Import components with explicit variable assignment (Webpack fix)
    import RouterComponent from '../components/Routing/Router.svelte';
    import RouteComponent from '../components/Routing/Route.svelte';
    
    // Assign to variables for template use (helps Webpack resolve)
    const Router = RouterComponent;
    const Route = RouteComponent;
    import { navigate } from '../utils/routing';
    import { changeLanguage, currentLanguage } from '../stores/contentStore';
    import { closeModal, isModalVisible } from '../stores/modalStore';
    import { devLog } from '../utils/environment';
    import { initializeAccountFromCookies, resetSessionFlags } from '../stores/accountStore';
    import { appVersion } from '../utils/version';
    import { getSupportedLanguageCodes } from '../utils/languages';
    
    // PERFORMANCE: Lazy Loading für Routes (Code Splitting)
    // Svelte 5 Best Practice: Verwende $state für reaktive Komponenten-Referenzen
    // SvelteKit Pattern: Verwende +page.svelte Komponenten die bereits Layout haben
    let RootPage = $state<any>(null);
    let ContactPage = $state<any>(null);
    let AccountPage = $state<any>(null);
    let VersionsPage = $state<any>(null);
    let BlogPage = $state<any>(null);
    let BlogPostPage = $state<any>(null);
    let PrivacyPage = $state<any>(null);
    let LegalPage = $state<any>(null);
    let ErrorPage = $state<any>(null);
    let routesLoaded = $state(false);
    let loadingError = $state<Error | null>(null);
    
    // Lazy Load Page Components (Svelte 5 Best Practice)
    // Gemäß Svelte Docs: Dynamische Imports mit Error Handling und Loading States
    async function loadRoutes(): Promise<void> {
        if (routesLoaded) return;
        
        try {
            devLog('🔄 LanguageRouter: Loading routes...');
            
            // Svelte 5 Best Practice: Dynamische Imports mit expliziten Pfaden
            // Webpack erkennt diese als Code-Splitting-Punkte
            const routeImports = await Promise.allSettled([
                import('./+page.svelte'),
                import('./contact/+page.svelte'),
                import('./account/+page.svelte'),
                import('./versions/+page.svelte'),
                import('./blog/+page.svelte'),
                import('./blog/[slug]/+page.svelte'),
                import('./privacy/+page.svelte'),
                import('./legal/+page.svelte'),
                import('./+error.svelte')
            ]);
            
            // Prüfe auf Fehler beim Laden
            const errors: string[] = [];
            routeImports.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const routeNames = [
                        'RootPage', 'ContactPage', 'AccountPage', 'VersionsPage',
                        'BlogPage', 'BlogPostPage', 'PrivacyPage', 'LegalPage', 'ErrorPage'
                    ];
                    errors.push(`${routeNames[index]}: ${result.reason}`);
                    console.error(`❌ Failed to load ${routeNames[index]}:`, result.reason);
                }
            });
            
            if (errors.length > 0) {
                throw new Error(`Failed to load ${errors.length} route(s): ${errors.join(', ')}`);
            }
            
            // Extrahiere Default-Exports (Svelte 5 Best Practice)
            RootPage = (routeImports[0] as PromiseFulfilledResult<any>).value.default;
            ContactPage = (routeImports[1] as PromiseFulfilledResult<any>).value.default;
            AccountPage = (routeImports[2] as PromiseFulfilledResult<any>).value.default;
            VersionsPage = (routeImports[3] as PromiseFulfilledResult<any>).value.default;
            BlogPage = (routeImports[4] as PromiseFulfilledResult<any>).value.default;
            BlogPostPage = (routeImports[5] as PromiseFulfilledResult<any>).value.default;
            PrivacyPage = (routeImports[6] as PromiseFulfilledResult<any>).value.default;
            LegalPage = (routeImports[7] as PromiseFulfilledResult<any>).value.default;
            ErrorPage = (routeImports[8] as PromiseFulfilledResult<any>).value.default;
            
            // Validiere, dass alle Komponenten geladen wurden
            const allLoaded = RootPage && ContactPage && AccountPage && VersionsPage && 
                            BlogPage && BlogPostPage && PrivacyPage && LegalPage && ErrorPage;
            
            if (!allLoaded) {
                throw new Error('Some route components failed to load (missing default export)');
            }
            
            routesLoaded = true;
            loadingError = null;
            devLog('✅ LanguageRouter: Routes loaded successfully');
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            loadingError = error;
            console.error('❌ LanguageRouter: Failed to load routes:', error);
            console.error('❌ LanguageRouter: Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            // Set routesLoaded to true anyway to show error page
            routesLoaded = true;
        }
    }
    
    export const url = "";
    export const currentVersion = appVersion;
    
    // Hole die unterstützten Sprachcodes direkt aus der utils/languages.js
    const supportedLanguages = getSupportedLanguageCodes();
    
    // Verfolge die aktuelle Route
    let currentPath = $state("");
    let initialRouteProcessed = $state(false);
    let processingRoute = $state(false); // Verhindert gleichzeitige Route-Verarbeitung
    
    
    // Verbesserte Route-Verarbeitung ohne Weiterleitung von Root zu Sprach-URL
    async function handleRouteChange() {
        console.log('🔄 LanguageRouter: handleRouteChange called');
        console.log('🔄 LanguageRouter: current path:', window.location.pathname);
        
        // Close any open modals when navigating to prevent them from appearing briefly
        if (get(isModalVisible)) {
            closeModal();
        }
        
        // Vermeide gleichzeitige Verarbeitung, was zu Race Conditions führen könnte
        if (processingRoute) {
            console.log('🔄 LanguageRouter: Route processing already in progress, skipping...');
            return;
        }
        
        processingRoute = true;
        
        try {
            // Extrahiere den aktuellen Pfad
            currentPath = window.location.pathname;
            
            // Überprüfe Login-Status bei jedem Route-Wechsel - nur wenn nötig
            if (!initialRouteProcessed) {
                console.log('🔐 LanguageRouter: Checking login status...');
                const loginResult = initializeAccountFromCookies();
                console.log('🔐 LanguageRouter: Login check result:', loginResult);
            }
            
            // Extrahiere Pfadsegmente für die Spracherkennung
            const pathSegments = currentPath.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            console.log('🔄 LanguageRouter: Path segments:', pathSegments);
            console.log('🔄 LanguageRouter: Potential language:', potentialLang);
            console.log('🔄 LanguageRouter: Supported languages:', supportedLanguages);
            
            // Wenn das erste Segment ein gültiger Sprachcode ist
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                console.log('🔄 LanguageRouter: Valid language found:', potentialLang);
                // Setze die Sprache basierend auf der URL, wenn sie anders ist
                if (potentialLang !== $currentLanguage) {
                    console.log('🔄 LanguageRouter: Language different, changing from', $currentLanguage, 'to', potentialLang);
                    await changeLanguage(potentialLang);
                } else {
                    console.log('🔄 LanguageRouter: Language already set to:', potentialLang);
                }
            } else {
                console.log('🔄 LanguageRouter: No valid language in URL, using current:', $currentLanguage);
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
            
            // NOTE: localStorage migration runs SYNCHRONOUSLY on appStores.js import
            // This ensures all data is clean BEFORE any store initialization
            
            // CRITICAL: Reset session flags on every page load (before session restore!)
            resetSessionFlags();
            console.log('✅ LanguageRouter: Session flags reset for new page load');
            
            // PERFORMANCE: Load routes immediately (blocking for first render)
            await loadRoutes();
            
            // CRITICAL: Initialize daily usage for ALL users (logged in or guest)
            try {
                const { initializeDailyUsage } = await import('../stores/dailyUsageStore');
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
                // SEO-optimierte Store-Sprach-Synchronisation
                const storeLang = $currentLanguage;
                if (storeLang && storeLang !== 'en') {
                    devLog('🔄 LanguageRouter: Store has language, updating URL');
                    const newPath = `/${storeLang}${window.location.pathname}`;
                    navigate(newPath, { replace: true });
                }
            }
            
            // SEO-optimierte Route-Verarbeitung
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
            
            // SEO-optimierte Sprachänderungen
            const unsubscribe = currentLanguage.subscribe(async (lang) => {
                if (initialRouteProcessed && lang && !processingRoute) {
                    // REMOVED: setTimeout delay - Race Condition behoben, direkt aufrufen
                    await handleRouteChange();
                }
            });
            
            // SEO-optimierte Cleanup-Funktion
            return () => {
                window.removeEventListener('popstate', handleRouteChange);
                unsubscribe();
            };
        } catch (error) {
            devLog('❌ LanguageRouter: Error in onMount:', error);
        }
    });
</script>
  
{#if !routesLoaded}
    <!-- Loading State -->
    <div class="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
    </div>
{:else}
<Router>
    <!-- PERFORMANCE: Lazy Loaded Routes mit +page.svelte (SvelteKit Pattern) -->
        <!-- Root Route (Home/Index) -->
        <Route path="/" component={RootPage} />
        <Route path="/:lang" component={RootPage} />
        
        <!-- Versions Route -->
        <Route path="/versions" let:params>
            <svelte:component this={VersionsPage} />
        </Route>
        <Route path="/:lang/versions" let:params>
            <svelte:component this={VersionsPage} />
        </Route>
        
        <!-- Contact Route -->
        <Route path="/contact" let:params>
            <svelte:component this={ContactPage} />
        </Route>
        <Route path="/:lang/contact" let:params>
            <svelte:component this={ContactPage} />
        </Route>
        
        <!-- Account Route -->
        <Route path="/account" let:params>
            <svelte:component this={AccountPage} />
        </Route>
        <Route path="/:lang/account" let:params>
            <svelte:component this={AccountPage} />
        </Route>
        
        <!-- Blog Routes -->
        <Route path="/blog" let:params>
            <svelte:component this={BlogPage} />
        </Route>
        <Route path="/:lang/blog" let:params>
            <svelte:component this={BlogPage} />
        </Route>
        
        <!-- Blog Post Route (Dynamic Slug) -->
        <Route path="/blog/:slug" let:params>
            <svelte:component this={BlogPostPage} slug={params.slug} />
        </Route>
        <Route path="/:lang/blog/:slug" let:params>
            <svelte:component this={BlogPostPage} slug={params.slug} />
        </Route>
        
        <!-- Privacy Route -->
        <Route path="/privacy" let:params>
            <svelte:component this={PrivacyPage} />
        </Route>
        <Route path="/:lang/privacy" let:params>
            <svelte:component this={PrivacyPage} />
        </Route>
        
        <!-- Legal Route -->
        <Route path="/legal" let:params>
            <svelte:component this={LegalPage} />
        </Route>
        <Route path="/:lang/legal" let:params>
            <svelte:component this={LegalPage} />
        </Route>
        
        <!-- 404 Error Route -->
        <Route component={ErrorPage} />
</Router>
{/if}