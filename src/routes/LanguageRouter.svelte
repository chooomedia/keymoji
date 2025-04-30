<!-- src/routes/LanguageRouter.svelte -->
<script>
    import { Router, Route, navigate } from 'svelte-routing';
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, setLanguage } from '../stores/appStores.js';
    import { isLanguageSupported, getBrowserLanguage } from '../utils/languages.js';
    import Index from '../index.svelte';
    import BlogGrid from '../BlogGrid.svelte';
    import BlogPost from '../BlogPost.svelte';
    import VersionHistory from './VersionHistory.svelte';
    import ContactForm from './ContactForm.svelte';
    import Layout from '../Layout.svelte';
    import NotFound from './NotFound.svelte';
    import SEO from '../components/SEO.svelte';
    import { appVersion } from '../utils/version.js';
    
    export const url = "";
    export let currentVersion = appVersion;
    
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
                default: return 'home';
            }
        }
    }
    
    // Verbesserte Route-Verarbeitung mit Debug-Logging
    async function handleRouteChange() {
        // Vermeide gleichzeitige Verarbeitung, was zu Race Conditions führen könnte
        if (processingRoute) {
            console.log('Route processing already in progress, skipping...');
            return;
        }
        
        processingRoute = true;
        
        try {
            // Extrahiere den aktuellen Pfad
            currentPath = window.location.pathname;
            pageURL = currentPath; // Set pageURL for SEO component
            
            // Debug-Logging
            console.log(`Route change detected: ${currentPath}`);
            
            // Determine page type for SEO
            currentPageType = determinePageType(currentPath);
            console.log('Current page type:', currentPageType, 'URL:', pageURL);
            
            // Parse URL parameters for action=random functionality
            const urlParams = new URLSearchParams(window.location.search);
            const action = urlParams.get('action');
            
            // Extrahiere Pfadsegmente für die Spracherkennung
            const pathSegments = currentPath.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            
            // Sonderfall: Root-Route mit action=random
            if ((currentPath === '/' || currentPath === '') && action === 'random') {
                // Wir werden zur richtigen Sprache navigieren, aber den Action-Parameter beibehalten
                const navigatePath = `/${$currentLanguage}?action=random`;
                console.log(`Redirecting to: ${navigatePath} (root with action=random)`);
                
                processingRoute = false; // Freigeben vor Navigation
                navigate(navigatePath, { replace: true });
                return;
            }
            
            // Sonderfall: Root-Route ohne Parameter
            if ((currentPath === '/' || currentPath === '')) {
                const navigatePath = `/${$currentLanguage}`;
                console.log(`Redirecting to: ${navigatePath} (root without params)`);
                
                processingRoute = false; // Freigeben vor Navigation
                navigate(navigatePath, { replace: true });
                return;
            }
            
            // Wenn das erste Segment ein gültiger Sprachcode ist
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                // Setze die Sprache basierend auf der URL, wenn sie anders ist
                if (potentialLang !== $currentLanguage) {
                    console.log('Setting language from URL:', potentialLang);
                    await setLanguage(potentialLang);
                }
            } else if (pathSegments.length > 0) {
                // URL hat einen Pfad, aber keinen Sprachcode - aktuelle Sprache hinzufügen
                const newPath = `/${$currentLanguage}${currentPath}`;
                console.log('Adding language to path:', newPath);
                
                processingRoute = false; // Freigeben vor Navigation
                navigate(newPath, { replace: true });
                return;
            }
        } catch (error) {
            console.error('Error in route handling:', error);
        } finally {
            // Freigeben nach Verarbeitung
            processingRoute = false;
        }
    }
    
    // Initialize when component mounts
    onMount(async () => {
        try {
            // Initialize pageURL and currentPageType
            currentPath = window.location.pathname;
            pageURL = currentPath;
            currentPageType = determinePageType(currentPath);
            
            console.log('LanguageRouter mounted, initializing with path:', currentPath);
            
            // Set initial language from URL, localStorage, or browser preference
            const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                // URL has a language - use it
                if (potentialLang !== $currentLanguage) {
                    console.log('Setting initial language from URL:', potentialLang);
                    await setLanguage(potentialLang);
                }
            } else {
                // No language in URL - check localStorage or browser preference
                const storedLang = localStorage.getItem('language');
                let preferredLang;
                
                try {
                    // Sicherer Parse von localStorage
                    preferredLang = storedLang ? JSON.parse(storedLang) : null;
                    if (preferredLang && !supportedLanguages.includes(preferredLang)) {
                        console.log('Stored language not supported:', preferredLang);
                        preferredLang = null;
                    }
                } catch (e) {
                    preferredLang = null;
                    console.warn('Error parsing stored language', e);
                }
                
                // Fallback auf Browser-Präferenz
                if (!preferredLang) {
                    preferredLang = getBrowserLanguage();
                    console.log('Using browser preferred language:', preferredLang);
                }
                
                if (preferredLang && preferredLang !== $currentLanguage) {
                    console.log('Setting language from preference:', preferredLang);
                    await setLanguage(preferredLang);
                }
            }
            
            // Process initial route after language is set
            // Wichtig: Verzögerung, um sicherzustellen, dass die Sprache gesetzt wurde
            await new Promise(resolve => setTimeout(resolve, 50));
            await handleRouteChange();
            initialRouteProcessed = true;
            
            // Browser-Navigation-Ereignisse
            window.addEventListener('popstate', handleRouteChange);
            
            // Benutzerdefinierte Navigationsereignisse verarbeiten
            document.addEventListener('click', (e) => {
                const langLink = e.target.closest('[data-language-link]');
                if (langLink) {
                    console.log('Language link clicked');
                    // Verzögerung für die Sprachaktualisierung
                    setTimeout(handleRouteChange, 50);
                }
            });
            
            // Sprachänderungen überwachen und URL aktualisieren
            const unsubscribe = currentLanguage.subscribe(async (lang) => {
                if (initialRouteProcessed && lang && !processingRoute) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                    handleRouteChange();
                }
            });
            
            // Cleanup-Funktion
            return () => {
                window.removeEventListener('popstate', handleRouteChange);
                unsubscribe();
            };
        } catch (error) {
            console.error('Error in LanguageRouter onMount:', error);
        }
    });
    
    // Watch for URL changes that require language updates
    $: {
        if (initialRouteProcessed && currentPath && $currentLanguage && !processingRoute) {
            // URL has changed but doesn't start with current language
            if (!currentPath.startsWith(`/${$currentLanguage}`)) {
                console.log('URL changed but doesn\'t have current language prefix, updating...');
                
                // Get current path segments
                const pathSegments = currentPath.split('/').filter(segment => segment !== '');
                
                // Create new path with current language
                let newPath;
                if (pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0])) {
                    // Replace existing language code
                    pathSegments[0] = $currentLanguage;
                    newPath = `/${pathSegments.join('/')}`;
                } else {
                    // Add language code
                    newPath = `/${$currentLanguage}${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`;
                }
                
                // Only navigate if the path actually changed
                if (newPath !== currentPath) {
                    console.log('Updating path to include language:', newPath);
                    navigate(newPath, { replace: true });
                }
            }
        }
    }
</script>

<!-- Zentralisierte SEO-Komponente für die gesamte App -->
<SEO 
  pageType={currentPageType} 
  url={pageURL}
/>
  
<Router {url}>
    <Layout>
        <!-- Flachere Struktur für Routen -->
        <Route path="/" component={Index} />
        <Route path="/:lang" component={Index} />
        
        <Route path="/blog" component={BlogGrid} />
        <Route path="/:lang/blog" component={BlogGrid} />
        
        <Route path="/blog/:slug" let:params>
            <BlogPost slug={params.slug} />
        </Route>
        <Route path="/:lang/blog/:slug" let:params>
            <BlogPost slug={params.slug} />
        </Route>
        
        <Route path="/versions" component={VersionHistory} />
        <Route path="/:lang/versions" component={VersionHistory} {currentVersion} />
        
        <Route path="/contact" component={ContactForm} />
        <Route path="/:lang/contact" component={ContactForm} />
        
        <!-- Fallback Route -->
        <Route component={NotFound} />
    </Layout>
</Router>