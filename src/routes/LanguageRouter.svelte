<script>
    import { Router, Route, navigate, link } from "svelte-routing";
    import { onMount, onDestroy } from 'svelte';
    import { currentLanguage, setLanguage } from '../stores.js';
    import { getSupportedLanguageCodes } from '../utils/languages.js';
    import Index from '../index.svelte';
    import BlogGrid from '../BlogGrid.svelte';
    import BlogPost from '../BlogPost.svelte';
    import VersionHistory from '../VersionHistory.svelte';
    import ContactForm from "./ContactForm.svelte";
    import Layout from '../Layout.svelte';
    import NotFound from './NotFound.svelte';
    
    // Wichtig: Verwende nur die URL für den initialen Render
    export let url = "";
    export let currentVersion = "";
    
    // Hole die unterstützten Sprachcodes
    const supportedLanguages = getSupportedLanguageCodes();
    
    // Verfolge die aktuelle Route
    let currentPath = "";
    let needsRedirect = false;
    
    function handleRouteChange() {
      // Extrahiere den aktuellen Pfad
      currentPath = window.location.pathname;
      
      // Überprüfe, ob wir auf der Root-Route sind
      if (currentPath === '/' || currentPath === '') {
        navigate(`/${$currentLanguage}`, { replace: true });
        return;
      }
      
      // Überprüfe, ob die URL einen Sprachcode enthält
      const pathSegments = currentPath.split('/').filter(segment => segment !== '');
      const potentialLang = pathSegments[0];
      
      if (potentialLang && supportedLanguages.includes(potentialLang)) {
        // Setze die Sprache basierend auf der URL
        if (potentialLang !== $currentLanguage) {
          console.log('Setze Sprache von URL:', potentialLang);
          setLanguage(potentialLang);
        }
      } else if (pathSegments.length > 0) {
        // Füge Sprachcode zur URL hinzu, wenn nicht vorhanden
        navigate(`/${$currentLanguage}${currentPath}`, { replace: true });
      }
    }
    
    onMount(() => {
      // Initial Route-Change verarbeiten
      handleRouteChange();
      
      // Event-Listener für Navigation hinzufügen
      window.addEventListener('popstate', handleRouteChange);
      
      // Handler für Klicks auf Links mit Daten-Attributen hinzufügen
      document.addEventListener('click', (e) => {
        // Wenn auf einen Link mit dem Attribut "data-language-link" geklickt wurde
        if (e.target.closest('[data-language-link]')) {
          // Route-Change nach einem kurzen Timeout verarbeiten
          setTimeout(handleRouteChange, 50);
        }
      });
    });
    
    onDestroy(() => {
      window.removeEventListener('popstate', handleRouteChange);
    });
    
    // Beobachte Änderungen an currentLanguage
    $: {
      if ($currentLanguage && currentPath && !currentPath.startsWith(`/${$currentLanguage}`)) {
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