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
    import { initializeAccountFromCookies } from '../stores/accountStore';
    import { resetSessionFlags } from '../stores/accountSession';
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
    let isLoading = $state(false);
    let loadingProgress = $state<string>('');
    
    // Lazy Load Page Components (Svelte 5 Best Practice)
    // Gemäß Svelte Docs: Dynamische Imports mit Error Handling und Loading States
    async function loadRoutes(): Promise<void> {
        if (routesLoaded) {
            console.log('✅ LanguageRouter: Routes already loaded, skipping');
            return;
        }
        if (isLoading) {
            console.log('⏳ LanguageRouter: Already loading, skipping duplicate call');
            return; // Verhindere doppelte Loads
        }
        
        isLoading = true;
        loadingProgress = 'Initializing...';
        console.log('🔄 LanguageRouter: Starting route loading...');
        
        try {
            devLog('🔄 LanguageRouter: Loading routes...');
            loadingProgress = 'Loading route components...';
            console.log('🔄 LanguageRouter: Starting dynamic imports...');
            
            // Svelte 5 Best Practice: Dynamische Imports mit expliziten Pfaden
            // Webpack erkennt diese als Code-Splitting-Punkte
            // Verwende Promise.all für bessere Performance (alle Routen parallel laden)
            console.log('🔄 LanguageRouter: Importing routes...');
            
            // Svelte 5 Best Practice: Dynamische Imports mit besserem Error-Handling
            // Verwende Promise.allSettled für robustes Error-Handling
            const importResults = await Promise.allSettled([
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
            
            // Prüfe auf Fehler und extrahiere Module
            const routeNames = [
                'RootPage', 'ContactPage', 'AccountPage', 'VersionsPage',
                'BlogPage', 'BlogPostPage', 'PrivacyPage', 'LegalPage', 'ErrorPage'
            ];
            
            const modules: any[] = [];
            const errors: string[] = [];
            
            importResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    modules.push(result.value);
                    console.log(`✅ ${routeNames[index]} loaded successfully`);
                } else {
                    console.error(`❌ Failed to load ${routeNames[index]}:`, result.reason);
                    errors.push(`${routeNames[index]}: ${result.reason?.message || String(result.reason)}`);
                    modules.push(null);
                }
            });
            
            if (errors.length > 0) {
                throw new Error(`Failed to load ${errors.length} route(s): ${errors.join(', ')}`);
            }
            
            const [
                RootPageModule,
                ContactPageModule,
                AccountPageModule,
                VersionsPageModule,
                BlogPageModule,
                BlogPostPageModule,
                PrivacyPageModule,
                LegalPageModule,
                ErrorPageModule
            ] = modules;
            
            console.log('✅ LanguageRouter: All imports completed');
            
            // Extrahiere Default-Exports (Svelte 5 Best Practice)
            // Validiere, dass default export existiert
            console.log('🔄 LanguageRouter: Validating default exports...');
            console.log('🔄 LanguageRouter: RootPageModule:', RootPageModule);
            console.log('🔄 LanguageRouter: RootPageModule.default:', RootPageModule?.default);
            
            if (!RootPageModule?.default) {
                console.error('❌ RootPageModule:', RootPageModule);
                throw new Error('RootPage missing default export');
            }
            if (!ContactPageModule?.default) {
                console.error('❌ ContactPageModule:', ContactPageModule);
                throw new Error('ContactPage missing default export');
            }
            if (!AccountPageModule?.default) {
                console.error('❌ AccountPageModule:', AccountPageModule);
                throw new Error('AccountPage missing default export');
            }
            if (!VersionsPageModule?.default) {
                console.error('❌ VersionsPageModule:', VersionsPageModule);
                throw new Error('VersionsPage missing default export');
            }
            if (!BlogPageModule?.default) {
                console.error('❌ BlogPageModule:', BlogPageModule);
                throw new Error('BlogPage missing default export');
            }
            if (!BlogPostPageModule?.default) {
                console.error('❌ BlogPostPageModule:', BlogPostPageModule);
                throw new Error('BlogPostPage missing default export');
            }
            if (!PrivacyPageModule?.default) {
                console.error('❌ PrivacyPageModule:', PrivacyPageModule);
                throw new Error('PrivacyPage missing default export');
            }
            if (!LegalPageModule?.default) {
                console.error('❌ LegalPageModule:', LegalPageModule);
                throw new Error('LegalPage missing default export');
            }
            if (!ErrorPageModule?.default) {
                console.error('❌ ErrorPageModule:', ErrorPageModule);
                throw new Error('ErrorPage missing default export');
            }
            
            console.log('✅ LanguageRouter: All default exports validated');
            
            // Zuweisen der Komponenten (Svelte 5 Best Practice: Direkte Zuweisung)
            console.log('🔄 LanguageRouter: Assigning components...');
            RootPage = RootPageModule.default;
            ContactPage = ContactPageModule.default;
            AccountPage = AccountPageModule.default;
            VersionsPage = VersionsPageModule.default;
            BlogPage = BlogPageModule.default;
            BlogPostPage = BlogPostPageModule.default;
            PrivacyPage = PrivacyPageModule.default;
            LegalPage = LegalPageModule.default;
            ErrorPage = ErrorPageModule.default;
            console.log('✅ LanguageRouter: Components assigned');
            
            // Validiere, dass alle Komponenten geladen wurden
            console.log('🔄 LanguageRouter: Final validation...');
            const allLoaded = RootPage && ContactPage && AccountPage && VersionsPage && 
                            BlogPage && BlogPostPage && PrivacyPage && LegalPage && ErrorPage;
            
            console.log('🔄 LanguageRouter: Component status:', {
                RootPage: !!RootPage,
                ContactPage: !!ContactPage,
                AccountPage: !!AccountPage,
                VersionsPage: !!VersionsPage,
                BlogPage: !!BlogPage,
                BlogPostPage: !!BlogPostPage,
                PrivacyPage: !!PrivacyPage,
                LegalPage: !!LegalPage,
                ErrorPage: !!ErrorPage,
                allLoaded
            });
            
            if (!allLoaded) {
                console.error('❌ LanguageRouter: Some components failed to load');
                throw new Error('Some route components failed to load (null or undefined)');
            }
            
            loadingProgress = 'Validating components...';
            console.log('✅ LanguageRouter: All components loaded successfully');
            
            routesLoaded = true;
            loadingError = null;
            isLoading = false;
            loadingProgress = 'Ready!';
            
            console.log('✅ LanguageRouter: routesLoaded set to true');
            console.log('✅ LanguageRouter: isLoading set to false');
            
            devLog('✅ LanguageRouter: Routes loaded successfully');
            devLog('✅ LanguageRouter: Loaded components:', {
                RootPage: !!RootPage,
                ContactPage: !!ContactPage,
                AccountPage: !!AccountPage,
                VersionsPage: !!VersionsPage,
                BlogPage: !!BlogPage,
                BlogPostPage: !!BlogPostPage,
                PrivacyPage: !!PrivacyPage,
                LegalPage: !!LegalPage,
                ErrorPage: !!ErrorPage
            });
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            loadingError = error;
            isLoading = false;
            loadingProgress = 'Error occurred';
            
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
            // Svelte 5 Best Practice: await für initiales Laden
            // Der Loading-State reagiert automatisch auf isLoading und routesLoaded
            await loadRoutes();
            
            // Validiere, dass Routen geladen wurden
            if (!routesLoaded) {
                console.warn('⚠️ LanguageRouter: Routes not loaded after await');
                loadingProgress = 'Retrying...';
                // Retry nach kurzer Verzögerung
                setTimeout(() => {
                    if (!routesLoaded && !isLoading) {
                        loadRoutes();
                    }
                }, 1000);
            }
            
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
  
{#if !routesLoaded || isLoading}
    <!-- Loading State (Svelte 5 Best Practice) -->
    <!-- Reagiert auf isLoading und routesLoaded State -->
    <div class="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900" role="status" aria-live="polite" aria-label="Loading application">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" aria-hidden="true"></div>
            <p class="text-gray-600 dark:text-gray-400 mb-2">Loading...</p>
            {#if loadingProgress}
                <p class="text-sm text-gray-500 dark:text-gray-500">{loadingProgress}</p>
            {/if}
        </div>
    </div>
{:else if loadingError}
    <!-- Error State (Svelte 5 Best Practice) -->
    <div class="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900" role="alert">
        <div class="text-center max-w-md p-6">
            <div class="text-6xl mb-4">⚠️</div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Routes</h1>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{loadingError.message}</p>
            <button 
                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                onclick={() => {
                    routesLoaded = false;
                    loadingError = null;
                    loadRoutes();
                }}
            >
                Retry
            </button>
        </div>
    </div>
{:else}
<Router>
    <!-- PERFORMANCE: Lazy Loaded Routes mit +page.svelte (SvelteKit Pattern) -->
        <!-- Root Route (Home/Index) -->
        {#if RootPage}
            <Route path="/" component={RootPage} />
            <Route path="/:lang" component={RootPage} />
        {/if}
        
        <!-- Versions Route -->
        <Route path="/versions" let:params>
            {#if VersionsPage}
                {@const Component = VersionsPage}
                <Component />
            {/if}
        </Route>
        <Route path="/:lang/versions" let:params>
            {#if VersionsPage}
                {@const Component = VersionsPage}
                <Component />
            {/if}
        </Route>
        
        <!-- Contact Route -->
        <Route path="/contact" let:params>
            {#if ContactPage}
                {@const Component = ContactPage}
                <Component />
            {/if}
        </Route>
        <Route path="/:lang/contact" let:params>
            {#if ContactPage}
                {@const Component = ContactPage}
                <Component />
            {/if}
        </Route>
        
        <!-- Account Route -->
        <Route path="/account" let:params>
            {#if AccountPage}
                {@const Component = AccountPage}
                <Component />
            {/if}
        </Route>
        <Route path="/:lang/account" let:params>
            {#if AccountPage}
                {@const Component = AccountPage}
                <Component />
            {/if}
        </Route>
        
        <!-- Blog Routes -->
        <Route path="/blog" let:params>
            {#if BlogPage}
                {@const Component = BlogPage}
                <Component />
            {/if}
        </Route>
        <Route path="/:lang/blog" let:params>
            {#if BlogPage}
                {@const Component = BlogPage}
                <Component />
            {/if}
        </Route>
        
        <!-- Blog Post Route (Dynamic Slug) -->
        <Route path="/blog/:slug" let:params>
            {#if BlogPostPage}
                {@const Component = BlogPostPage}
                <Component slug={params.slug} />
            {/if}
        </Route>
        <Route path="/:lang/blog/:slug" let:params>
            {#if BlogPostPage}
                {@const Component = BlogPostPage}
                <Component slug={params.slug} />
            {/if}
        </Route>
        
        <!-- Privacy Route -->
        <Route path="/privacy" let:params>
            {#if PrivacyPage}
                {@const Component = PrivacyPage}
                <Component />
            {/if}
        </Route>
        <Route path="/:lang/privacy" let:params>
            {#if PrivacyPage}
                {@const Component = PrivacyPage}
                <Component />
            {/if}
        </Route>
        
        <!-- Legal Route -->
        <Route path="/legal" let:params>
            {#if LegalPage}
                {@const Component = LegalPage}
                <Component />
            {/if}
        </Route>
        <Route path="/:lang/legal" let:params>
            {#if LegalPage}
                {@const Component = LegalPage}
                <Component />
            {/if}
        </Route>
        
        <!-- 404 Error Route -->
        {#if ErrorPage}
            <Route component={ErrorPage} />
        {:else}
            <Route>
                <div class="flex items-center justify-center min-h-screen">
                    <div class="text-center">
                        <h1 class="text-4xl font-bold mb-4">404</h1>
                        <p class="text-gray-600">Page not found</p>
                    </div>
                </div>
            </Route>
        {/if}
</Router>
{/if}