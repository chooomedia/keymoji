<!-- src/routes/LanguageRouter.svelte -->
<script>
    import { Router, Route, navigate } from 'svelte-routing';
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, setLanguage } from '../stores/appStores.js';
    import { getBrowserLanguage, isLanguageSupported } from '../utils/languages.js';
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
    
    // Verbesserte Route-Verarbeitung ohne Weiterleitung von Root zu Sprach-URL
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
            
            // Determine page type for SEO
            currentPageType = determinePageType(currentPath);
            
            // Parse URL parameters for action=random functionality
            const urlParams = new URLSearchParams(window.location.search);
            const action = urlParams.get('action');
            
            // Extrahiere Pfadsegmente für die Spracherkennung
            const pathSegments = currentPath.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            
            // Wenn das erste Segment ein gültiger Sprachcode ist
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                // Setze die Sprache basierend auf der URL, wenn sie anders ist
                if (potentialLang !== $currentLanguage) {
                    await setLanguage(potentialLang);
                }
            }
            
            // Markiere, dass anfängliche Route verarbeitet wurde
            if (!initialRouteProcessed) {
                initialRouteProcessed = true;
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
            
            // Set initial language from URL or localStorage
            const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
            const potentialLang = pathSegments[0];
            
            if (potentialLang && supportedLanguages.includes(potentialLang)) {
                // URL has a language - use it
                if (potentialLang !== $currentLanguage) {
                    await setLanguage(potentialLang);
                }
            } else {
                // Für den unwahrscheinlichen Fall, dass keine Sprache in der URL ist
                // (sollte durch server-side Redirect vermieden werden)
                const defaultLang = 'en';
                if (defaultLang !== $currentLanguage) {
                    await setLanguage(defaultLang);
                }
            }
            
            // Process initial route after language is set
            await new Promise(resolve => setTimeout(resolve, 50));
            await handleRouteChange();
            initialRouteProcessed = true;
            
            // Browser-Navigation-Ereignisse
            window.addEventListener('popstate', handleRouteChange);
            
            // Benutzerdefinierte Navigationsereignisse verarbeiten
            document.addEventListener('click', (e) => {
                const langLink = e.target.closest('[data-language-link]');
                if (langLink) {
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