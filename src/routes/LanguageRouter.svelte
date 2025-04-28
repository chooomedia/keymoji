<script>
    import { Router, Route, navigate } from "svelte-routing";
    import { onMount } from 'svelte';
    import { currentLanguage, setLanguage } from '../stores.js';
    import Index from '../index.svelte';
    import BlogGrid from '../BlogGrid.svelte';
    import BlogPost from '../BlogPost.svelte';
    import VersionHistory from '../VersionHistory.svelte';
    import ContactForm from "./ContactForm.svelte";
    import Layout from '../Layout.svelte';
    import NotFound from './NotFound.svelte';
    
    // Wichtig: Verwende die tatsächliche URL, nicht die übergebene
    export const url = "/"
    export const currentVersion = "";
    
    // Debug-Informationen
    console.log('LanguageRouter initialisiert mit URL:', url);
    console.log('Aktuelle Sprache:', $currentLanguage);
    
    // Liste der unterstützten Sprachen - hart kodiert für Zuverlässigkeit
    const supportedLanguages = ['en', 'de', 'dech', 'es', 'nl', 'it', 'fr', 'pl', 'da', 'ru', 'tr', 'af', 'ja', 'ko', 'tlh', 'qya'];
    
    onMount(() => {
      // Extrahiere potentiellen Sprachcode aus URL
      const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
      const potentialLang = pathSegments[0];
      
      console.log('URL Segmente:', pathSegments);
      console.log('Potentieller Sprachcode:', potentialLang);
      
      // Wenn wir auf der Root-Route sind, leite zur Sprachversion weiter
      if (window.location.pathname === '/' || window.location.pathname === '') {
        const targetUrl = `/${$currentLanguage}`;
        console.log('Weiterleitung von Root zu:', targetUrl);
        navigate(targetUrl, { replace: true });
        return;
      }
      
      // Wenn die URL bereits einen Sprachcode enthält
      if (potentialLang && supportedLanguages.includes(potentialLang)) {
        // Setze die aktuelle Sprache auf die in der URL
        if (potentialLang !== $currentLanguage) {
          console.log('Setze Sprache von URL:', potentialLang);
          setLanguage(potentialLang);
        }
      } 
      // Wenn kein Sprachcode in der URL
      else if (pathSegments.length > 0) {
        // Füge Sprachcode zur URL hinzu
        const targetUrl = `/${$currentLanguage}${window.location.pathname}`;
        console.log('Füge Sprachcode zur URL hinzu:', targetUrl);
        navigate(targetUrl, { replace: true });
      }
    });
</script>
  
<Router {url}>
    <Layout>
        <!-- Einfache Routen -->
        <Route path="/" component={Index} />
        <Route path="/blog/:slug" let:params>
            <BlogPost slug={params.slug} />
        </Route>
        <Route path="/blog" component={BlogGrid} />
        <Route path="/versions" component={VersionHistory} currentVersion={currentVersion} />
        <Route path="/contact" component={ContactForm} />
        
        <!-- Sprachspezifische Routen -->
        <Route path="/:lang" let:params>
            <Route path="/" component={Index} />
            <Route path="/blog/:slug" let:params>
            <BlogPost slug={params.slug} />
            </Route>
            <Route path="/blog" component={BlogGrid} />
            <Route path="/versions" component={VersionHistory} currentVersion={currentVersion} />
            <Route path="/contact" component={ContactForm} />
        </Route>
        
        <!-- Fallback Route -->
        <Route component={NotFound} />
    </Layout>
</Router>