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
    let showLoader = $state(true);
    let contentReady = $state(false);
    
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
    const supportedLanguages = getSupportedLanguageCodes();
    let currentPath = "";
    let initialRouteProcessed = false;
    let processingRoute = false;
    let lastProcessedPath = "";
    let lastProcessedLang: string | null = null;
    
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
    
    onMount(() => {
        let unsubscribe: (() => void) | null = null;
        
        (async () => {
            try {
                devLog('🚀 LanguageRouter: Component mounted');
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
                const initialPath = window.location.pathname;
                currentPath = initialPath;
                const pathSegments = initialPath.split('/').filter(segment => segment !== '');
                const potentialLang = pathSegments[0];
                const storeLang = get(currentLanguage);
                
                devLog('🔍 LanguageRouter: Language check:', {
                    urlLang: potentialLang,
                    storeLang: storeLang,
                    supported: supportedLanguages.includes(potentialLang)
                });
                
                if (potentialLang && supportedLanguages.includes(potentialLang)) {
                    if (potentialLang !== storeLang) {
                        devLog('🔄 LanguageRouter: URL language differs from store, updating store');
                        await changeLanguage(potentialLang);
                        lastProcessedLang = potentialLang;
                    } else {
                        lastProcessedLang = storeLang;
                    }
                } else {
                    if (storeLang && storeLang !== 'en') {
                        devLog('🔄 LanguageRouter: Store has language, updating URL');
                        const newPath = `/${storeLang}${initialPath}`;
                        navigate(newPath, { replace: true });
                        lastProcessedLang = storeLang;
                    } else {
                        lastProcessedLang = storeLang;
                    }
                }
                
                await handleRouteChange();
                initialRouteProcessed = true;
                window.addEventListener('popstate', handleRouteChange);
                document.addEventListener('click', async (e) => {
                    const target = e.target as HTMLElement | null;
                    if (target) {
                        const langLink = target.closest('[data-language-link]');
                        if (langLink) {
                            await handleRouteChange();
                        }
                    }
                });
                
                unsubscribe = currentLanguage.subscribe((lang) => {
                    untrack(() => {
                        if (initialRouteProcessed && lang && !processingRoute && lang !== lastProcessedLang) {
                            handleRouteChange().catch(() => {});
                        }
                    });
                });
            } catch (error) {
                devLog('❌ LanguageRouter: Error in onMount:', error);
            }
        })();
        
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            if (unsubscribe) {
                unsubscribe();
            }
        };
    });
</script>
  
{#if !contentReady || showLoader || !routesLoaded || isLoading}
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
        {#if RootPage}
        <Route path="/" component={RootPage} />
        <Route path="/:lang" component={RootPage} />
        {/if}
        
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