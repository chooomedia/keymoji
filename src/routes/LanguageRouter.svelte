<script>
    import { Router, Route, navigate } from "svelte-routing";
    import { onMount } from 'svelte';
    import { currentLanguage, setLanguage, getSupportedLanguages } from '../stores.js';
    import Index from '../index.svelte';
    import BlogPost from '../BlogPost.svelte';
    import VersionHistory from '../VersionHistory.svelte';
    import ContactForm from '../ContactForm.svelte';
    import Layout from '../Layout.svelte';
    import NotFound from './NotFound.svelte';
    
    export const url = "";
    export const currentVersion = "";
    
    const supportedLanguages = getSupportedLanguages();
    
    // Debug logs
    console.log('LanguageRouter initialized with URL:', url);
    console.log('Current language:', $currentLanguage);
    console.log('Supported languages:', supportedLanguages);
    
    // Einfache direkte Weiterleitung
    onMount(() => {
        // Überprüfen, ob wir uns im Root befinden
        if (url === '/' || url === '') {
            // Zum sprachspezifischen Pfad weiterleiten
            navigate(`/${$currentLanguage}`, { replace: true });
            return;
        }
        
        // Extrahieren des potenziellen Sprachcodes aus der URL
        const pathSegments = url.split('/').filter(segment => segment !== '');
        const potentialLang = pathSegments[0];
        
        // Überprüfen, ob die URL mit einem gültigen Sprachcode beginnt
        if (!potentialLang || !supportedLanguages.includes(potentialLang)) {
            // Zum gleichen Pfad mit Sprachpräfix weiterleiten
            navigate(`/${$currentLanguage}${url}`, { replace: true });
            return;
        }
        
        // Wenn die URL bereits einen Sprachpräfix hat, der nicht der aktuellen Sprache entspricht
        if (potentialLang && supportedLanguages.includes(potentialLang) && potentialLang !== $currentLanguage) {
            // Aktualisieren der aktuellen Sprache, um mit der URL übereinzustimmen
            setLanguage(potentialLang);
        }
    });
</script>
  
<Router {url}>
    <Layout url={url}>
        <!-- Einfache Routen ohne Verschachtelung -->
        <Route path="/" component={Index} />
        <Route path="/blog/:slug" let:params>
            <BlogPost slug={params.slug} />
        </Route>
        <Route path="/blog" component={Index} />
        <Route path="/versions">
            <VersionHistory {currentVersion} />
        </Route>
        <Route path="/contact" component={ContactForm} />
        
        <!-- Sprachspezifische Routen -->
        <Route path="/:lang" let:params>
            {#if supportedLanguages.includes(params.lang)}
                <Route path="/" component={Index} />
                <Route path="/blog/:slug" let:params>
                    <BlogPost slug={params.slug} />
                </Route>
                <Route path="/blog" component={Index} />
                <Route path="/versions">
                    <VersionHistory {currentVersion} />
                </Route>
                <Route path="/contact" component={ContactForm} />
            {:else}
                <NotFound />
            {/if}
        </Route>
        
        <!-- Auffangroute -->
        <Route path="*" component={NotFound} />
    </Layout>
</Router>