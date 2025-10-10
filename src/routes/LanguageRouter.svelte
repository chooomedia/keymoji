<!-- src/routes/LanguageRouter.svelte -->
<script>
    import { Router, Route, navigate } from 'svelte-routing';
    import { onMount, onDestroy } from 'svelte';
    import { changeLanguage, currentLanguage } from '../stores/contentStore.js';
    import { getBrowserLanguage, isLanguageSupported } from '../utils/languages.js';
    import { closeModal, isModalVisible } from '../stores/modalStore.js';
    import { devLog } from '../utils/environment.js';
    import { initializeAccountFromCookies } from '../stores/accountStore.js';
    import Index from '../index.svelte';
    import BlogGrid from '../components/Features/BlogGrid.svelte';
import BlogPost from '../components/Features/BlogPost.svelte';
    import VersionHistory from './VersionHistory.svelte';
    import ContactForm from './ContactForm.svelte';
    import AccountManager from './AccountManager.svelte';
    import StaticPage from './StaticPage.svelte';

    import NotFound from './NotFound.svelte';
    import SEO from '../components/SEO.svelte';
    import { appVersion } from '../utils/version.js';
    
    export const url = "";
    export const currentVersion = appVersion;
    
    // Hole die unterstützten Sprachcodes direkt aus der utils/languages.js
    import { getSupportedLanguageCodes } from '../utils/languages.js';
    const supportedLanguages = getSupportedLanguageCodes();
    
    // Verfolge die aktuelle Route
    let currentPath = "";
    let currentPageType = "home";
    let pageURL = "";
    let initialRouteProcessed = false;
    let processingRoute = false; // Verhindert gleichzeitige Route-Verarbeitung
    
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
            // Extrahiere den aktuellen Pfad
            currentPath = window.location.pathname;
            pageURL = currentPath; // Set pageURL for SEO component
            
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
            
            // CRITICAL: Initialize daily usage for ALL users (logged in or guest)
            try {
                const { initializeDailyUsage } = await import('../stores/dailyUsageStore.js');
                await initializeDailyUsage();
                console.log('✅ LanguageRouter: Daily usage initialized on app start');
            } catch (error) {
                console.warn('⚠️ LanguageRouter: Failed to initialize daily usage:', error);
            }
            
            // Initialize account from cookies
            initializeAccountFromCookies();
            
            // SEO-optimierte Initialisierung
            currentPath = window.location.pathname;
            pageURL = currentPath;
            currentPageType = determinePageType(currentPath);
            
            // SEO-optimierte Store-Initialisierung
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // SEO-optimierte Sprach-Erkennung
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
            document.addEventListener('click', (e) => {
                const langLink = e.target.closest('[data-language-link]');
                if (langLink) {
                    setTimeout(handleRouteChange, 50);
                }
            });
            
            // SEO-optimierte Sprachänderungen
            const unsubscribe = currentLanguage.subscribe(async (lang) => {
                if (initialRouteProcessed && lang && !processingRoute) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                    handleRouteChange();
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

<!-- Zentralisierte SEO-Komponente für die gesamte App -->
<SEO 
  pageType={currentPageType} 
  url={pageURL}
/>
  
<Router {url}>
    <Route path="/" component={Index} />
    <Route path="/:lang" component={Index} />
    
    <Route path="/versions" let:params>
        <VersionHistory />
    </Route>
    <Route path="/:lang/versions" let:params>
        <VersionHistory />
    </Route>
    
    <Route path="/contact" let:params>
        <ContactForm />
    </Route>
    <Route path="/:lang/contact" let:params>
        <ContactForm />
    </Route>
    
    <Route path="/account" let:params>
        <AccountManager />
    </Route>
    <Route path="/:lang/account" let:params>
        <AccountManager />
    </Route>
    
    <Route path="/blog" let:params>
        <BlogGrid />
    </Route>
    <Route path="/:lang/blog" let:params>
        <BlogGrid />
    </Route>
    
    <Route path="/blog/:slug" let:params>
        <BlogPost slug={params.slug} />
    </Route>
    <Route path="/:lang/blog/:slug" let:params>
        <BlogPost slug={params.slug} />
    </Route>
    
    <Route path="/privacy" let:params>
        <StaticPage slug="privacy" />
    </Route>
    <Route path="/:lang/privacy" let:params>
        <StaticPage slug="privacy" />
    </Route>
    
    <Route path="/legal" let:params>
        <StaticPage slug="legal" />
    </Route>
    <Route path="/:lang/legal" let:params>
        <StaticPage slug="legal" />
    </Route>
    
    <Route component={NotFound} />
</Router>