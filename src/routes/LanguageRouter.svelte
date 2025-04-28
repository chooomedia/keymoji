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
    
    let initialized = false;
    const supportedLanguages = getSupportedLanguages();
    
    // Debug logs
    console.log('LanguageRouter initialized with URL:', url);
    console.log('Current language:', $currentLanguage);
    console.log('Supported languages:', supportedLanguages);
    
    // Simple direct routing approach
    onMount(() => {
        // If we're at the root, redirect to the language-specific route
        if (url === '/' || url === '') {
            navigate(`/${$currentLanguage}`, { replace: true });
        }
        // If we're at a path without language, insert language
        else if (!url.match(new RegExp(`^/(${supportedLanguages.join('|')})`))) {
            navigate(`/${$currentLanguage}${url}`, { replace: true });
        }
    });
</script>
  
<Router {url}>
    <Layout>
        <!-- Basic route structure without nesting -->
        <Route path="/" component={Index} />
        <Route path="/blog/:slug" let:params>
            <BlogPost slug={params.slug} />
        </Route>
        <Route path="/blog" component={Index} />
        <Route path="/versions" component={VersionHistory} />
        <Route path="/contact" component={ContactForm} />
        
        <!-- Language-specific routes -->
        <Route path="/:lang">
            <Route path="/" component={Index} />
            <Route path="/blog/:slug" let:params>
                <BlogPost slug={params.slug} />
            </Route>
            <Route path="/blog" component={Index} />
            <Route path="/versions" component={VersionHistory} />
            <Route path="/contact" component={ContactForm} />
        </Route>
        
        <!-- Catch-all route -->
        <Route path="*" component={NotFound} />
    </Layout>
</Router>