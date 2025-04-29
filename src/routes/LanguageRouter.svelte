<script>
    import { Router, Route, navigate } from 'svelte-routing';
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, setLanguage } from '../stores/appStores.js';
    import { getSupportedLanguageCodes, getBrowserLanguage } from '../utils/languages.js';
    import Index from '../index.svelte';
    import BlogGrid from '../BlogGrid.svelte';
    import BlogPost from '../BlogPost.svelte';
    import VersionHistory from './VersionHistory.svelte';
    import ContactForm from './ContactForm.svelte';
    import Layout from '../Layout.svelte';
    import NotFound from './NotFound.svelte';
    import SEO from '../components/Seo.svelte';
    
    export const url = "";
    export const currentVersion = "";
    
    // Hole die unterstützten Sprachcodes
    const supportedLanguages = getSupportedLanguageCodes();
    
    // Verfolge die aktuelle Route
    let currentPath = "";
    let currentPageType = "home";
    let pageURL = "";
    let initialRouteProcessed = false;
    
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
    
    function handleRouteChange() {
        // Extrahiere den aktuellen Pfad
        currentPath = window.location.pathname;
        pageURL = currentPath; // Set pageURL for SEO component
        
        // Determine page type for SEO
        currentPageType = determinePageType(currentPath);
        console.log('Current page type:', currentPageType, 'URL:', pageURL);
        
        // Parse URL parameters for action=random functionality
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        
        // Check if we are on the root route with action=random
        if ((currentPath === '/' || currentPath === '') && action === 'random') {
            // We'll navigate to the correct language but keep the action parameter
            navigate(`/${$currentLanguage}?action=random`, { replace: true });
            return;
        }
        
        // Check if we're on the root route without any parameters
        if ((currentPath === '/' || currentPath === '') && !action) {
            navigate(`/${$currentLanguage}`, { replace: true });
            return;
        }
        
        // Extract path segments for language detection
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        const potentialLang = pathSegments[0];
        
        // If first segment is a valid language code
        if (potentialLang && supportedLanguages.includes(potentialLang)) {
            // Set the language based on URL if it's different
            if (potentialLang !== $currentLanguage) {
                console.log('Setting language from URL:', potentialLang);
                setLanguage(potentialLang);
            }
        } else if (pathSegments.length > 0) {
            // URL has a path but no language code - add current language
            const newPath = `/${$currentLanguage}${currentPath}`;
            console.log('Adding language to path:', newPath);
            navigate(newPath, { replace: true });
        }
    }
    
    function getBrowserPreferredLanguage() {
        return getBrowserLanguage();
    }
    
    onMount(() => {
        // Initialize pageURL and currentPageType
        currentPath = window.location.pathname;
        pageURL = currentPath;
        currentPageType = determinePageType(currentPath);
        
        // Set initial language from URL, localStorage, or browser preference
        const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
        const potentialLang = pathSegments[0];
        
        if (potentialLang && supportedLanguages.includes(potentialLang)) {
            // URL has a language - use it
            if (potentialLang !== $currentLanguage) {
                setLanguage(potentialLang);
            }
        } else {
            // No language in URL - check localStorage or browser preference
            const storedLang = localStorage.getItem('language');
            const preferredLang = storedLang && supportedLanguages.includes(JSON.parse(storedLang)) 
            ? JSON.parse(storedLang) 
            : getBrowserPreferredLanguage();
            
            if (preferredLang && preferredLang !== $currentLanguage) {
                setLanguage(preferredLang);
            }
        }
        
        // Process initial route after language is set
        setTimeout(() => {
            handleRouteChange();
            initialRouteProcessed = true;
        }, 50);
        
        // Add listeners for navigation
        window.addEventListener('popstate', handleRouteChange);
        
        // Handle clicks on language-link elements
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-language-link]')) {
                setTimeout(handleRouteChange, 50);
            }
        });
    });
    
    onDestroy(() => {
        window.removeEventListener('popstate', handleRouteChange);
    });
    
    // Watch for changes to currentLanguage and update path if needed
    $: {
        if ($currentLanguage && initialRouteProcessed && currentPath && !currentPath.startsWith(`/${$currentLanguage}`)) {
            // Aktualisiere den Pfad mit der neuen Sprache
            const pathSegments = currentPath.split('/').filter(segment => segment !== '');
            if (pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0])) {
                // Ersetze den vorhandenen Sprachcode
                pathSegments[0] = $currentLanguage;
            } else {
                // Füge einen Sprachcode hinzu
                pathSegments.unshift($currentLanguage);
            }
            const newPath = `/${pathSegments.join('/')}`;
            if (newPath !== currentPath) {
                navigate(newPath, { replace: true });
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
        <Route path="/:lang/versions" component={VersionHistory} currentVersion={currentVersion} />
        
        <Route path="/contact" component={ContactForm} />
        <Route path="/:lang/contact" component={ContactForm} />
        
        <!-- Fallback Route -->
        <Route component={NotFound} />
    </Layout>
</Router>