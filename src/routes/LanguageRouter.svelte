<!--
Language router component for handling multi-language routing and route loading.
Manages dynamic route imports, language detection, and initial app setup.
Handles route changes, language switching, and session initialization.
-->
<script lang="ts">
    import { onMount, untrack } from 'svelte';
    import { fade } from 'svelte/transition';
    import { get } from 'svelte/store';
    import RouterComponent from '../components/Routing/Router.svelte';
    import RouteComponent from '../components/Routing/Route.svelte';
    const Router = RouterComponent;
    const Route = RouteComponent;
    import { navigate } from '../utils/routing';
    import { changeLanguage, currentLanguage } from '../stores/contentStore';
    import { closeModal, isModalVisible } from '../stores/modalStore';
    import { devLog, isDebugMode } from '../utils/environment';
    import { initializeAccountFromCookies } from '../stores/accountStore';
    import { resetSessionFlags } from '../stores/accountSession';
    import { appVersion } from '../utils/version';
    import { getSupportedLanguageCodes } from '../utils/languages';

    function debugLanguageRouter() {
        if (!isDebugMode()) return;
        console.group('🔍 LanguageRouter Debug');
        console.log('Routes:', {
            routesLoaded,
            isLoading,
            loadingError: loadingError?.message,
            contentReady,
            showLoader
        });
        console.log('Language:', {
            currentLanguage: get(currentLanguage),
            supportedLanguages: getSupportedLanguageCodes()
        });
        console.log('Pages:', {
            hasRootPage: !!RootPage,
            hasContactPage: !!ContactPage,
            hasAccountPage: !!AccountPage
        });
        console.groupEnd();
    }
    
    // PERFORMANCE: Lazy Loading für Routes (Code Splitting)
    // Svelte 5 Best Practice: Komponenten-Referenzen die sich ändern (null -> Component) müssen $state() sein
    // Svelte erkennt Änderungen nur bei reaktiven Variablen - normale Variablen triggern kein Re-Render
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
    let showLoader = $state(true); // Separate State für Loader-Anzeige (für Fade-Out)
    let contentReady = $state(false); // State für Content-Bereitschaft
    
    // PERFORMANCE: Priorisiertes Laden für schnelles initiales Rendering
    // Strategie: RootPage zuerst (kritisch), dann ErrorPage, dann andere Routen parallel
    async function loadRoutes(): Promise<void> {
        if (routesLoaded) {
            return;
        }
        if (isLoading) {
            return;
        }
        isLoading = true;
        loadingProgress = 'Loading...';
        debugLanguageRouter();
        try {
            loadingProgress = 'Loading critical routes...';
            const [RootPageModule, ErrorPageModule] = await Promise.all([
                import('./+page.svelte'),
                import('./+error.svelte')
            ]);
            RootPage = RootPageModule.default;
            ErrorPage = ErrorPageModule.default;
            routesLoaded = true;
            showLoader = false;
            contentReady = true;
            loadingProgress = 'Loading additional routes...';
            
            const importResults = await Promise.allSettled([
                import('./contact/+page.svelte'),
                import('./account/+page.svelte'),
                import('./versions/+page.svelte'),
                import('./blog/+page.svelte'),
                import('./blog/[slug]/+page.svelte'),
                import('./privacy/+page.svelte'),
                import('./legal/+page.svelte')
            ]);
            
            // Prüfe auf Fehler und extrahiere Module
            const routeNames = [
                'ContactPage', 'AccountPage', 'VersionsPage',
                'BlogPage', 'BlogPostPage', 'PrivacyPage', 'LegalPage'
            ];
            
            const modules: any[] = [];
            const errors: string[] = [];
            
            importResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    modules.push(result.value);
                } else {
                    errors.push(`${routeNames[index]}: ${result.reason?.message || String(result.reason)}`);
                    modules.push(null);
                }
            });
            
            const [
                ContactPageModule,
                AccountPageModule,
                VersionsPageModule,
                BlogPageModule,
                BlogPostPageModule,
                PrivacyPageModule,
                LegalPageModule
            ] = modules;
            if (!RootPage) {
                throw new Error('RootPage missing - critical route failed');
            }
            if (!ErrorPage) {
                throw new Error('ErrorPage missing - critical route failed');
            }
            
            // Zuweisen der zusätzlichen Komponenten (non-critical)
            // Verwende optional chaining für robustes Error-Handling
            if (ContactPageModule?.default) ContactPage = ContactPageModule.default;
            if (AccountPageModule?.default) AccountPage = AccountPageModule.default;
            if (VersionsPageModule?.default) VersionsPage = VersionsPageModule.default;
            if (BlogPageModule?.default) BlogPage = BlogPageModule.default;
            if (BlogPostPageModule?.default) BlogPostPage = BlogPostPageModule.default;
            if (PrivacyPageModule?.default) PrivacyPage = PrivacyPageModule.default;
            if (LegalPageModule?.default) LegalPage = LegalPageModule.default;
            if (!RootPage || !ErrorPage) {
                throw new Error('Critical routes failed to load');
            }
            loadingError = null;
            isLoading = false;
            loadingProgress = 'Ready!';
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            loadingError = error;
            isLoading = false;
            loadingProgress = 'Error occurred';
            routesLoaded = true;
            showLoader = false;
            contentReady = true;
        }
    }
    
    export const url = "";
    export const currentVersion = appVersion;
    
    // Hole die unterstützten Sprachcodes direkt aus der utils/languages.js
    const supportedLanguages = getSupportedLanguageCodes();
    
    // Verfolge die aktuelle Route
    // Svelte 5 Best Practice: Variablen die nur intern verwendet werden (nicht im Template) 
    // müssen NICHT reaktiv sein - normale let Variablen sind ausreichend
    let currentPath = "";
    let initialRouteProcessed = false;
    let processingRoute = false; // Verhindert gleichzeitige Route-Verarbeitung
    
    // Svelte 5 Best Practice: Store direkt verwenden, nicht über $derived
    // Vermeidet zirkuläre Abhängigkeiten und infinite loops
    // Verwende get() direkt in Funktionen statt reaktiver Rune
    // Diese Variablen werden nur intern verwendet, nicht im Template → normale let
    let lastProcessedPath = "";
    let lastProcessedLang: string | null = null;
    
    // Verbesserte Route-Verarbeitung ohne Weiterleitung von Root zu Sprach-URL
    // CRITICAL: Diese Funktion darf NICHT State lesen und schreiben, der sie wieder triggert
    async function handleRouteChange() {
        if (get(isModalVisible)) {
            closeModal();
        }
        if (processingRoute) {
            return;
        }
        const newPath = window.location.pathname;
        const currentLangValue = get(currentLanguage);
        if (newPath === lastProcessedPath && currentLangValue === lastProcessedLang) {
            return;
        }
        processingRoute = true;
        try {
            const pathToProcess = newPath;
            if (!initialRouteProcessed) {
                initializeAccountFromCookies();
            }
            const pathSegments = pathToProcess.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            const supportedLanguages = getSupportedLanguageCodes();
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                if (potentialLang !== currentLangValue) {
                    await changeLanguage(potentialLang);
                    lastProcessedLang = potentialLang;
                } else {
                    lastProcessedLang = currentLangValue;
                }
            } else {
                lastProcessedLang = currentLangValue;
            }
            currentPath = pathToProcess;
            lastProcessedPath = pathToProcess;
            if (!initialRouteProcessed) {
                initialRouteProcessed = true;
            }
        } catch (error) {
        } finally {
            processingRoute = false;
        }
    }
    
    // SEO-optimierte App-Initialisierung
    onMount(async () => {
        try {
            devLog('🚀 LanguageRouter: Component mounted');
            
            // NOTE: Cache initialization is handled in src/index.ts to prevent duplicate calls
            // Do NOT call initializeCache here - it's already called in initializeApp()
            
            // NOTE: localStorage migration runs SYNCHRONOUSLY on appStores.js import
            // This ensures all data is clean BEFORE any store initialization
            
            resetSessionFlags();
            await loadRoutes();
            if (!routesLoaded) {
                loadingProgress = 'Retrying...';
                setTimeout(() => {
                    if (!routesLoaded && !isLoading) {
                        loadRoutes().catch(() => {
                            showLoader = false;
                            contentReady = true;
                        });
                    }
                }, 1000);
            }
            setTimeout(() => {
                if (!contentReady) {
                    showLoader = false;
                    contentReady = true;
                }
            }, 10000);
            try {
                const { initializeDailyUsage } = await import('../stores/dailyUsageStore');
                await initializeDailyUsage();
            } catch (error) {}
            const sessionRestored = await initializeAccountFromCookies();
            
            // SEO-optimierte Initialisierung
            const initialPath = window.location.pathname;
            currentPath = initialPath;
            
            // SEO-optimierte Sprach-Erkennung
            // REMOVED: setTimeout delay - Race Condition behoben, proper async/await verwendet
            const pathSegments = initialPath.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            const storeLang = get(currentLanguage);
            
            devLog('🔍 LanguageRouter: Language check:', {
                urlLang: potentialLang,
                storeLang: storeLang,
                supported: supportedLanguages.includes(potentialLang)
            });
            
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                // SEO-optimierte URL-Sprach-Synchronisation
                if (potentialLang !== storeLang) {
                    devLog('🔄 LanguageRouter: URL language differs from store, updating store');
                    await changeLanguage(potentialLang);
                    lastProcessedLang = potentialLang;
                } else {
                    lastProcessedLang = storeLang;
                }
            } else {
                // SEO-optimierte Store-Sprach-Synchronisation
                if (storeLang && storeLang !== 'en') {
                    devLog('🔄 LanguageRouter: Store has language, updating URL');
                    const newPath = `/${storeLang}${initialPath}`;
                    navigate(newPath, { replace: true });
                    lastProcessedLang = storeLang;
                } else {
                    lastProcessedLang = storeLang;
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
            // Svelte 5 Best Practice: Store direkt subscriben statt $effect mit $derived
            // CRITICAL: Verhindert infinite loops durch untrack() und direkten Store-Zugriff
            const unsubscribe = currentLanguage.subscribe((lang) => {
                untrack(() => {
                    if (initialRouteProcessed && lang && !processingRoute && lang !== lastProcessedLang) {
                        handleRouteChange().catch(() => {});
                    }
                });
            });
            
            // SEO-optimierte Cleanup-Funktion
            return () => {
                window.removeEventListener('popstate', handleRouteChange);
                // Store-Subscription cleanup
                unsubscribe();
            };
        } catch (error) {
            devLog('❌ LanguageRouter: Error in onMount:', error);
        }
    });
</script>
  
{#if !contentReady || showLoader || !routesLoaded || isLoading}
    <!-- Loading State (Svelte 5 Best Practice) -->
    <!-- Reagiert auf isLoading und routesLoaded State -->
    <!-- Fade-Out-Animation für sauberes Ausblenden -->
    <div 
        class="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 fixed inset-0 z-50 transition-opacity duration-300" 
        class:opacity-0={contentReady && !showLoader && routesLoaded && !isLoading}
        class:opacity-100={!contentReady || showLoader || !routesLoaded || isLoading}
        role="status" 
        aria-live="polite" 
        aria-label="Loading application"
    >
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4" aria-hidden="true"></div>
            <p class="text-gray-600 dark:text-gray-400 mb-2">Loading...</p>
            {#if loadingProgress}
                <p class="text-sm text-gray-500 dark:text-gray-500">{loadingProgress}</p>
            {/if}
        </div>
    </div>
{/if}

{#if contentReady && loadingError}
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
{/if}

{#if contentReady && !loadingError}
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