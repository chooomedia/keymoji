<!-- src/routes/LanguageRouter.svelte -->
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
    import content from '../content.js';
  
    export let url = "";
    export let currentVersion = "";
    
    let initialized = false;
    const supportedLanguages = getSupportedLanguages();
    
    // Parse URL to extract language and actual path
    function parseUrl(url) {
      // Default path parts
      let lang = null;
      let path = url;
      
      // Split URL into segments
      const segments = url.split('/').filter(segment => segment !== '');
      
      // Check if the first segment is a language code
      if (segments.length > 0 && supportedLanguages.includes(segments[0])) {
        lang = segments[0];
        // Remove language from path
        path = '/' + segments.slice(1).join('/');
      }
      
      // If path is empty, set it to root
      if (path === '') path = '/';
      
      return { lang, path };
    }
    
    // Handle language detection and URL management
    function initializeLanguageRouting() {
      const { lang, path } = parseUrl(url);
      
      // If language is in URL, use it
      if (lang) {
        setLanguage(lang);
      } else {
        // If no language in URL, redirect to language-prefixed URL
        const currentLang = $currentLanguage;
        
        // Only redirect if we're not already handling this
        if (!initialized) {
          initialized = true;
          
          // Construct new URL with language prefix
          const newUrl = `/${currentLang}${path === '/' ? '' : path}`;
          
          // Use replace state to avoid breaking back button
          window.history.replaceState(null, '', newUrl);
          
          // Force Svelte router to recognize the new URL
          navigate(newUrl, { replace: true });
        }
      }
    }
    
    // Listen for language changes to update URL
    $: if (initialized && $currentLanguage) {
      const { lang, path } = parseUrl(url);
      
      // Only update URL if language changed
      if (lang && lang !== $currentLanguage) {
        const newUrl = `/${$currentLanguage}${path === '/' ? '' : path}`;
        window.history.replaceState(null, '', newUrl);
      }
    }
    
    // Statt navigate.subscribe, verwenden wir den window-Event-Listener für popstate
    onMount(() => {
      // Initialize language routing
      initializeLanguageRouting();
      
      // Listen for navigation events
      const handleNavigation = () => {
        initializeLanguageRouting();
      };
      
      // Füge einen Listener für URL-Änderungen hinzu
      window.addEventListener('popstate', handleNavigation);
      
      return () => {
        // Cleanup beim Unmount
        window.removeEventListener('popstate', handleNavigation);
      };
    });
  </script>
  
  <Router {url}>
    <Layout>
      <Route path="/:lang" let:params>
        <Route path="/" component={Index} />
        <Route path="blog/:slug" let:params>
          <BlogPost slug={params.slug} />
        </Route>
        <Route path="blog" component={Index} />
        <Route path="versions" component={VersionHistory} currentVersion={currentVersion} />
        <Route path="contact" component={ContactForm} />
        <Route path="*" component={NotFound} />
      </Route>
      <Route path="*" component={NotFound} />
    </Layout>
  </Router>