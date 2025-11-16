<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Link from '../../components/Routing/Link.svelte';
    import { navigate } from '../../utils/routing.ts';
    import { 
        fetchBlogPosts, 
        likeBlogPost, 
        formatContentPreview
    } from '../../utils/blogApi';
    import { getBlogUrl, getBlogShareUrl } from '../../utils/blogNavigation';
    import { currentLanguage, translations } from '../../stores/contentStore.ts';
    import { isLoggedIn } from '../../stores/appStores';
    import PageLayout from '../Layout/PageLayout.svelte';
    import { updateSeo } from '../../stores/seoStore.ts';
    import BlogPostImage from './BlogPostImage.svelte';
    import BlogPostMeta from './BlogPostMeta.svelte';
    import HeartAnimation from './HeartAnimation.svelte';
    import BigHeartAnimation from './BigHeartAnimation.svelte';
    import ButtonHeartParticles from './ButtonHeartParticles.svelte';
    import Pagination from '../UI/Pagination.svelte';
    import BlogPostSkeleton from './BlogPostSkeleton.svelte';
    import ShareButtons from './ShareButtons.svelte';
    import { generateBlogListStructuredData, formatCanonicalUrl, injectStructuredData } from '../../utils/seo';
    import { blogLikesStore, getPostLikes } from '../../stores/blogLikesStore';
    import { slide, fade } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    
    let posts = $state<any[]>([]);
    let showHeartAnimation = $state(false);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let selectedCategory = $state('all');
    let currentPage = $state(1);
    let isLoadingMore = $state(false);
    let isTransitioning = $state(false);
    let isDropdownOpen = $state(false);
    let dropdownRef: HTMLElement | null = $state(null);
    let buttonRef: HTMLElement | null = $state(null);
    let likingPostId: number | null = $state(null);
    let animatingHearts = $state<Set<number>>(new Set());
    let showBigHeartAnimation = $state(false);
    let buttonParticles = $state<Map<number, { show: boolean; buttonElement: HTMLElement }>>(new Map());
    
    const categoriesWithCounts = $derived.by(() => {
        const categoryMap = new Map<string, number>();
        categoryMap.set('all', posts.length);
        
        posts.forEach(post => {
            if (post.category) {
                const current = categoryMap.get(post.category) || 0;
                categoryMap.set(post.category, current + 1);
            }
        });
        
        return Array.from(categoryMap.entries()).map(([category, count]) => ({
            category,
            count
        })).sort((a, b) => {
            if (a.category === 'all') return -1;
            if (b.category === 'all') return 1;
            return b.count - a.count;
        });
    });
    
    const categories = $derived(categoriesWithCounts.map(c => c.category));
    
    const filteredPosts = $derived.by(() => {
        let filtered = posts;
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        filtered = [...filtered].sort((a, b) => {
            const dateA = new Date(a.isodate || a.date || 0);
            const dateB = new Date(b.isodate || b.date || 0);
            return dateB.getTime() - dateA.getTime();
        });
        
        return filtered;
    });
    
    const POSTS_PER_PAGE = 4;
    const INITIAL_POSTS = 1;
    
    const totalPages = $derived(filteredPosts.length === 0 ? 0 : Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
    
    const displayedPosts = $derived.by(() => {
        if (filteredPosts.length === 0) return [];
        
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        return filteredPosts.slice(startIndex, endIndex);
    });
    
    const newestPosts = $derived(currentPage === 1 ? displayedPosts.slice(0, INITIAL_POSTS) : []);
    const otherPosts = $derived(currentPage === 1 ? displayedPosts.slice(INITIAL_POSTS) : displayedPosts);
    
    function truncateAuthor(author) {
        if (!author) return 'Unknown';
        const text = String(author);
        return text.length > 24 ? text.substring(0, 21) + '...' : text;
    }
    
    let likeStatusMap = new Map(); // Map für Erfolgs-/Fehler-Status: { postId: 'success' | 'error' | null }
    
    async function handleLike(postId: number): Promise<void> {
        if (!isLoggedIn) {
            const lang = currentLanguage || 'en';
            const accountPath = lang === 'en' ? '/account' : `/${lang}/account`;
            navigate(accountPath, { replace: false });
            return;
        }
        
        if (!postId || likingPostId === postId) return;
        
        const postIndex = posts.findIndex(p => (p.id === postId || p.row_number === postId));
        if (postIndex === -1) return;
        
        // Get current like status
        const currentLikeStatus = blogLikesStore.getLikeStatus(postId);
        const currentLikes = currentLikeStatus.likes || 0;
        
        // KEIN TOGGLE: Nur Like wenn likes === 0
        if (currentLikes > 0) {
            console.log('⚠️ [BlogGrid] Post already liked (likes > 0), skipping');
            return;
        }
        
        // Clear previous status
        likeStatusMap.delete(postId);
        likeStatusMap = likeStatusMap;
        
        // Button Bounce Animation
        animatingHearts.add(postId);
        setTimeout(() => {
            animatingHearts.delete(postId);
            animatingHearts = animatingHearts; // Trigger reactivity
        }, 600);
        
        // Button Particles Animation (kleine fliegende Herzen)
        const buttonElement = document.querySelector(`[data-like-button-id="${postId}"]`);
        if (buttonElement) {
            buttonParticles.set(postId, { show: true, buttonElement });
            setTimeout(() => {
                const current = buttonParticles.get(postId);
                if (current) {
                    buttonParticles.set(postId, { ...current, show: false });
                    buttonParticles = buttonParticles; // Trigger reactivity
                }
            }, 1100);
        }
        
        // Set loading state
        likingPostId = postId;
        
        try {
            // Use store to add like (no toggle)
            const result = await blogLikesStore.addLike(postId, true);
        
        // Clear loading state
        likingPostId = null;
        
        if (result && result.success) {
                // Erfolg: Grünes Häkchen
                likeStatusMap.set(postId, 'success');
                likeStatusMap = likeStatusMap;
            
                // Nach Like-Klick: Store-Wert verwenden (bereits erhöht durch addLike)
                const likeStatus = blogLikesStore.getLikeStatus(postId);
                
                // Store-Wert verwenden (bereits erhöht nach Backend-Response)
            posts[postIndex] = {
                ...posts[postIndex],
                    likes: likeStatus.likes, // Store-Wert (bereits erhöht nach Backend-Response)
                    liked: true // Immer true wenn likes > 0
            };
            posts = posts; // Trigger reactivity
            
                // Große fliegende Herzen
                showHeartAnimation = true;
                setTimeout(() => {
                    showHeartAnimation = false;
                }, 1200);
                
                // Große zentrierte Herz-Animation für Success
                showBigHeartAnimation = true;
                setTimeout(() => {
                    showBigHeartAnimation = false;
                }, 2000);
                
                // Clear success status after animation
                setTimeout(() => {
                    likeStatusMap.delete(postId);
                    likeStatusMap = likeStatusMap;
                }, 2000);
        } else {
                // Fehler: Rotes X
                likeStatusMap.set(postId, 'error');
                likeStatusMap = likeStatusMap;
                
                // Clear error status after animation
                setTimeout(() => {
                    likeStatusMap.delete(postId);
                    likeStatusMap = likeStatusMap;
                }, 2000);
            }
        } catch (error) {
            console.error('❌ [BlogGrid] Error in handleLike:', error);
            likingPostId = null;
            
            // Fehler: Rotes X
            likeStatusMap.set(postId, 'error');
            likeStatusMap = likeStatusMap;
            
            // Clear error status after animation
            setTimeout(() => {
                likeStatusMap.delete(postId);
                likeStatusMap = likeStatusMap;
            }, 2000);
        }
    }
    
    async function refreshLikesFromBackend() {
        try {
            // BACKEND FIRST: Store mit neuesten Backend-Daten aktualisieren
            // Backend-Wert ist IMMER der initiale Wert
            await blogLikesStore.refreshFromBackend();
            
            // BACKEND FIRST: Posts auch vom Backend holen (falls sich geändert haben)
            const fetchedPosts = await fetchBlogPosts({ useCache: false, forceRefresh: true });
            
            if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
                // BACKEND FIRST: Posts mit Backend-Werten synchronisieren
                // Beim Refresh: Backend-Wert DIREKT verwenden (nicht aus Store!)
                posts = fetchedPosts.map(post => {
                    const postId = post.id || post.row_number;
                    
                    // BACKEND-WERT IST IMMER DER INITIALE WERT - DIREKT VOM BACKEND
                    const backendLikes = post.likes !== undefined && post.likes !== null
                        ? parseInt(String(post.likes), 10)
                        : 0;
                    
                    // Store-Wert holen (sollte Backend-Wert sein nach refreshFromBackend)
                    const likeStatus = blogLikesStore.getLikeStatus(postId);
                    
                    // BACKEND FIRST: Backend-Wert DIREKT verwenden beim Refresh
                    // Store wird nur verwendet wenn Backend-Wert fehlt (Fallback)
                    return {
                        ...post,
                        likes: backendLikes !== null && !isNaN(backendLikes) && backendLikes >= 0 
                            ? backendLikes  // BACKEND-WERT DIREKT
                            : (likeStatus.likes || 0), // Fallback: Store-Wert
                        liked: post.liked !== undefined ? post.liked : likeStatus.liked
                    };
                });
                
                posts = posts; // Trigger reactivity - Svelte reaktives Update
            } else {
                // Fallback: Nur Store-Daten verwenden wenn keine Posts vom Backend
                posts = posts.map(post => {
                    const postId = post.id || post.row_number;
                    const likeStatus = blogLikesStore.getLikeStatus(postId);
                    return {
                        ...post,
                        likes: likeStatus.likes,
                        liked: likeStatus.liked
                    };
            });
                posts = posts; // Trigger reactivity
            }
        } catch (error) {
            console.warn('⚠️ [BlogGrid] Error refreshing likes:', error);
        }
    }
    
    async function goToPage(page) {
        if (page < 1 || page > totalPages || page === currentPage || loading || isTransitioning) return;
        
        isTransitioning = true;
        isLoadingMore = true;
        currentPage = page;
        
        // BACKEND FIRST: Likes vom Backend refreshen für aktuelle Seite
        // Backend-Wert ist IMMER der initiale Wert
        try {
            // Store mit Backend-Daten aktualisieren (Backend-Wert hat Priorität)
            await blogLikesStore.refreshFromBackend();
            
            // BACKEND FIRST: Posts auch vom Backend holen für aktuelle Seite
            // (falls sich Posts geändert haben)
            const fetchedPosts = await fetchBlogPosts({ useCache: false, forceRefresh: true });
            
            if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
                // BACKEND FIRST: Posts mit Store-Daten synchronisieren
                // Store hat Backend-Werte (Backend-Wert hat Priorität, erhöht Store wenn höher)
                posts = fetchedPosts.map(post => {
                    const postId = post.id || post.row_number;
                    
                    // BACKEND-WERT IST IMMER DER INITIALE WERT
                    const backendLikes = post.likes !== undefined && post.likes !== null
                        ? parseInt(post.likes, 10)
                        : 0;
                    
                    // Store-Wert holen (sollte Backend-Wert sein nach refreshFromBackend)
                    const likeStatus = blogLikesStore.getLikeStatus(postId);
                    
                    // BACKEND FIRST: Backend-Wert hat IMMER Priorität
                    // Store-Wert wird nur verwendet wenn Backend-Wert fehlt
                    // Math.max: Backend-Wert hat Priorität, aber Store kann höher sein (optimistic update)
                    return {
                        ...post,
                        likes: Math.max(backendLikes, likeStatus.likes), // Backend-Wert hat Priorität
                        liked: post.liked !== undefined ? post.liked : likeStatus.liked
                    };
                });
                posts = posts; // Trigger reactivity
            }
        } catch (error) {
            console.warn('⚠️ [BlogGrid] Error refreshing data on page change:', error);
        }
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset transition state after animation
        setTimeout(() => {
            isLoadingMore = false;
            isTransitioning = false;
        }, 400);
    }
    
    function handlePageChange(page) {
        goToPage(page);
    }
    
    function previousPage() {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    }
    
    function nextPage() {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    }
    
    function handleClickOutside(event) {
        if (isDropdownOpen && 
            !event.target.closest('#category-dropdown-menu') && 
            !event.target.closest('#category-toggle-button') &&
            !event.target.closest('#language-dropdown-menu') &&
            !event.target.closest('#language-toggle-button') &&
            !event.target.closest('#fixed-menu') &&
            !event.target.closest('[data-menu-type="donate"]')) {
            isDropdownOpen = false;
        }
    }
    
    function handleKeydown(event) {
        if (!isDropdownOpen) return;
        
        switch (event.key) {
            case 'Escape':
                isDropdownOpen = false;
                buttonRef?.focus();
                break;
            case 'ArrowDown':
                event.preventDefault();
                const firstMenuItem = dropdownRef?.querySelector('[role="menuitem"]');
                firstMenuItem?.focus();
                break;
        }
    }
    
    $effect(() => {
        if (selectedCategory) {
            currentPage = 1;
            isDropdownOpen = false;
        }
    });
    
    onMount(async () => {
        try {
            loading = true;
            error = null;
            
            // BACKEND FIRST: Store initialisieren mit Backend-Daten
            // Backend-Wert ist IMMER der initiale Wert beim Laden
            await blogLikesStore.initialize();
            
            // BACKEND FIRST: Immer frische Posts vom Backend holen
            const fetchedPosts = await fetchBlogPosts({ useCache: false, forceRefresh: true });
            
            // DEBUG: Log Backend-Daten
            console.log('🔍 [BlogGrid] DEBUG - Fetched posts:', fetchedPosts.length);
            if (fetchedPosts.length > 0) {
                console.log('🔍 [BlogGrid] DEBUG - First post from fetchBlogPosts:', {
                    id: fetchedPosts[0].id || fetchedPosts[0].row_number,
                    title: fetchedPosts[0].title?.substring(0, 30),
                    likes: fetchedPosts[0].likes,
                    likesType: typeof fetchedPosts[0].likes,
                    liked: fetchedPosts[0].liked,
                    likedType: typeof fetchedPosts[0].liked
                });
            }
            
            if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
                // Debug: Log nur Posts mit fehlenden/ungültigen Likes
                const postsWithIssues = fetchedPosts.filter(p => 
                    p.likes === undefined || 
                    p.likes === null || 
                    isNaN(parseInt(p.likes, 10))
                );
                if (postsWithIssues.length > 0) {
                    console.warn('⚠️ [BlogGrid] Posts with missing/invalid likes:', postsWithIssues.map(p => ({ 
                        id: p.id || p.row_number, 
                        title: p.title?.substring(0, 30), 
                        likes: p.likes
                    })));
                }
                
                // BACKEND FIRST: Posts mit Backend-Werten initialisieren
                // Beim initialen Laden: Backend-Wert SOFORT verwenden (nicht aus Store!)
                // Store wurde bereits mit Backend-Werten initialisiert, aber für Anzeige Backend-Wert verwenden
                posts = fetchedPosts.map(post => {
                    const postId = post.id || post.row_number;
                    
                    // BACKEND-WERT IST IMMER DER INITIALE WERT - DIREKT VOM BACKEND
                    const backendLikes = post.likes !== undefined && post.likes !== null
                        ? parseInt(String(post.likes), 10)
                        : 0;
                    
                    // Store-Wert holen (sollte bereits Backend-Wert sein nach initialize)
                    const likeStatus = blogLikesStore.getLikeStatus(postId);
                    
                    // DEBUG: Log für ersten Post
                    if (postId === (fetchedPosts[0]?.id || fetchedPosts[0]?.row_number)) {
                        console.log('🔍 [BlogGrid] DEBUG - Synchronizing first post:', {
                            postId,
                            backendLikes,
                            storeLikes: likeStatus.likes,
                            usingBackend: true,
                            backendLiked: post.liked,
                            storeLiked: likeStatus.liked
                        });
                    }
                    
                    // BACKEND FIRST: Beim initialen Laden Backend-Wert DIREKT verwenden
                    // Store wird nur verwendet wenn Backend-Wert fehlt (Fallback)
                    // Nach Like-Klick wird Store-Wert verwendet (bereits erhöht)
                    return {
                        ...post,
                        likes: backendLikes !== null && !isNaN(backendLikes) && backendLikes >= 0 
                            ? backendLikes  // BACKEND-WERT DIREKT - Initial
                            : (likeStatus.likes || 0), // Fallback: Store-Wert
                        liked: post.liked !== undefined ? post.liked : likeStatus.liked
                    };
                });
                
                // DEBUG: Log finales Posts-Array für ersten Post
                if (posts.length > 0) {
                    const firstPostId = posts[0].id || posts[0].row_number;
                    const firstPost = posts.find(p => (p.id || p.row_number) === firstPostId);
                    console.log('✅ [BlogGrid] DEBUG - Final first post in posts array:', {
                        postId: firstPostId,
                        likes: firstPost?.likes,
                        liked: firstPost?.liked
                    });
                }
                
                // Reaktivität: Posts-Array wird aktualisiert
                posts = posts;
            } else {
                // Demo-Daten für Entwicklung
                    const demoPosts = [
                    {
                        id: 1,
                        row_number: 1,
                        title: 'Willkommen zu Keymoji - Sichere Passwörter mit Emojis',
                        slug: 'willkommen-zu-keymoji',
                        content: '<p>Keymoji revolutioniert die Passwort-Sicherheit durch die Verwendung von Emojis. Erfahren Sie, wie Sie starke, einprägsame Passwörter erstellen können, die sowohl sicher als auch benutzerfreundlich sind.</p><p>Unsere innovative Technologie kombiniert die Stärke von alphanumerischen Zeichen mit der visuellen Einprägsamkeit von Emojis, um Passwörter zu erstellen, die schwer zu knacken, aber einfach zu merken sind.</p>',
                        excerpt: 'Erfahren Sie, wie Keymoji die Passwort-Sicherheit durch Emojis revolutioniert.',
                        image: null, // Kein Bild - Placeholder wird angezeigt
                        isodate: '2025-11-10T10:00:00Z',
                        date: '2025-11-10',
                        creator: 'Keymoji Team',
                        category: 'Security',
                        likes: 5,
                        liked: false
                    },
                    {
                        id: 2,
                        row_number: 2,
                        title: 'Die Wissenschaft hinter Emoji-Passwörtern',
                        slug: 'wissenschaft-emoji-passwoerter',
                        content: '<p>Emoji-Passwörter nutzen die kognitive Psychologie, um sowohl Sicherheit als auch Benutzerfreundlichkeit zu gewährleisten. Studien zeigen, dass visuelle Elemente wie Emojis besser im Gedächtnis bleiben als reine Textzeichen.</p><p>Durch die Kombination von Unicode-Zeichen mit traditionellen Passwort-Elementen schaffen wir eine neue Generation von Passwörtern, die sowohl sicher als auch benutzerfreundlich sind.</p>',
                        excerpt: 'Entdecken Sie die wissenschaftlichen Grundlagen von Emoji-Passwörtern und wie sie die Sicherheit verbessern.',
                        image: null, // Kein Bild - Placeholder wird angezeigt
                        isodate: '2025-11-08T14:30:00Z',
                        date: '2025-11-08',
                        creator: 'Dr. Security Expert',
                        category: 'Technology',
                        likes: 12,
                        liked: false
                    },
                    {
                        id: 3,
                        row_number: 3,
                        title: 'Best Practices für sichere Passwörter im Jahr 2025',
                        slug: 'best-practices-sichere-passwoerter-2025',
                        content: '<p>In einer Zeit zunehmender Cyber-Bedrohungen ist es wichtiger denn je, starke Passwörter zu verwenden. Dieser Artikel zeigt Ihnen die besten Praktiken für die Erstellung und Verwaltung sicherer Passwörter.</p><p>Wir behandeln Themen wie Passwort-Länge, Komplexität, Einzigartigkeit und die Verwendung von Passwort-Managern. Erfahren Sie, wie Sie Ihre Online-Sicherheit maximieren können.</p>',
                        excerpt: 'Lernen Sie die wichtigsten Best Practices für sichere Passwörter im Jahr 2025 kennen.',
                        image: null, // Kein Bild - Placeholder wird angezeigt
                        isodate: '2025-11-05T09:15:00Z',
                        date: '2025-11-05',
                        creator: 'Security Team',
                        category: 'Security',
                        likes: 8,
                        liked: false
                    }
                ];
                
                // Sync demo posts with store
                posts = demoPosts.map(post => {
                    const postId = post.id || post.row_number;
                    const likeStatus = blogLikesStore.getLikeStatus(postId);
                    return {
                        ...post,
                        likes: likeStatus.likes,
                        liked: likeStatus.liked
                    };
                });
                
                if (!Array.isArray(fetchedPosts)) {
                    error = `Failed to load blog posts. (Invalid response: ${typeof fetchedPosts})`;
                }
            }
            
            const canonicalUrl = formatCanonicalUrl(window.location.pathname);
            updateSeo({
                title: translations?.blog?.title || 'Blog',
                description: translations?.blog?.description || 'Read our latest blog posts about emoji passwords, security, and more.',
                url: window.location.pathname,
                pageType: 'blog',
                canonical: canonicalUrl
            });
            
            const structuredData = generateBlogListStructuredData(posts, currentLanguage, canonicalUrl);
            injectStructuredData(structuredData);
            
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleKeydown);
        } catch (err) {
            console.error('❌ [BlogGrid] Error loading posts:', err);
            error = err.message || 'Failed to load blog posts';
            posts = [];
        } finally {
            loading = false;
        }
    });
    
    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeydown);
    });
    
    const pageTitle = $derived(translations?.blog?.title || 'Blog');
    const pageDescription = $derived(translations?.blog?.description || 'Read our latest blog posts about emoji passwords, security, and more.');
</script>

<PageLayout {pageTitle} {pageDescription} routeSlug="blog">
{#if loading || isTransitioning}
    <div in:fade={{duration: 200, easing: cubicInOut}} out:fade={{duration: 150, easing: cubicInOut}}>
    <BlogPostSkeleton count={6} />
    </div>
    {:else if error}
        <div class="flex flex-col justify-center items-center py-12">
            <p class="text-red-500 dark:text-red-400 mb-4">❌ {error}</p>
            <button 
                on:click={() => window.location.reload()} 
                class="px-4 py-2 bg-yellow text-black rounded-full hover:scale-105 transition-transform">
                Retry
            </button>
        </div>
    {:else if posts.length === 0}
        <div class="flex justify-center items-center py-12">
            <p class="text-gray-500 dark:text-gray-400">No blog posts available yet.</p>
        </div>
{:else}
        {#if totalPages > 1}
            <Pagination 
                {currentPage}
                {totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoadingMore || isTransitioning}
            />
        {/if}
        

        <div class="w-full mb-6 flex justify-center">
            <div class="relative inline-block w-full max-w-md">
                <button
                    id="category-toggle-button"
                    bind:this={buttonRef}
                    on:click={() => {
                        if (!isDropdownOpen) {
                            const languageMenu = document.querySelector('#language-dropdown-menu');
                            if (languageMenu) {
                                const languageButton = document.querySelector('#language-toggle-button');
                                if (languageButton && languageButton.getAttribute('aria-expanded') === 'true') {
                                    languageButton.click();
                                }
                            }
                        }
                        isDropdownOpen = !isDropdownOpen;
                    }}
                    class="w-full inline-flex items-center justify-between gap-3 px-6 py-3 h-14 bg-powder-50 text-black dark:bg-aubergine-900 dark:text-powder-50 rounded-full font-medium transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100"
                    aria-label="Filter by category"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-controls="category-dropdown-menu"
                >
                    <span class="truncate">
                        {selectedCategory === 'all' 
                            ? `All (${categoriesWithCounts.find(c => c.category === 'all')?.count || 0})`
                            : `${selectedCategory} (${categoriesWithCounts.find(c => c.category === selectedCategory)?.count || 0})`}
                    </span>
                    <svg 
                        class="w-4 h-4 flex-shrink-0 transition-transform duration-200 {isDropdownOpen ? 'transform rotate-180' : ''}" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                {#if isDropdownOpen}
                    <div
                        id="category-dropdown-menu"
                        bind:this={dropdownRef}
                        class="absolute z-50 mt-2 w-full bg-white dark:bg-aubergine-900 rounded-xl shadow-xl overflow-hidden"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="category-toggle-button"
                        aria-label="Category selection menu"
                    >
                        <div class="max-h-96 overflow-y-auto custom-scrollbar">
                            {#each categoriesWithCounts as item}
                                <button
                                    on:click={() => {
                                        selectedCategory = item.category;
                                        isDropdownOpen = false;
                                    }}
                                    on:keydown={(e) => {
                                        switch (e.key) {
                                            case 'Enter':
                                            case ' ':
                                                e.preventDefault();
                                                selectedCategory = item.category;
                                                isDropdownOpen = false;
                                                break;
                                            case 'ArrowDown':
                                                e.preventDefault();
                                                const nextItem = e.target.parentElement?.nextElementSibling?.querySelector('[role="menuitem"]');
                                                nextItem?.focus();
                                                break;
                                            case 'ArrowUp':
                                                e.preventDefault();
                                                const prevItem = e.target.parentElement?.previousElementSibling?.querySelector('[role="menuitem"]');
                                                prevItem?.focus();
                                                break;
                                        }
                                    }}
                                    class="w-full text-left px-6 py-3 text-sm font-medium transition-colors
                                        {selectedCategory === item.category
                                            ? 'bg-yellow-500 text-black dark:bg-yellow-500 dark:text-black'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-aubergine-800'}"
                                    role="menuitem"
                                    tabindex="-1"
                                    aria-label="Filter by {item.category === 'all' ? 'all categories' : item.category}"
                                >
                                    <div class="flex items-center justify-between gap-3">
                                        <span class="truncate">{item.category === 'all' ? 'All' : item.category}</span>
                                        <span class="text-xs opacity-75 flex-shrink-0">({item.count})</span>
                                    </div>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>


        <!-- Posts Container mit Transition -->
        <div class="w-full max-w-7xl mx-auto space-y-8 relative">
            {#key currentPage}
                {#if isTransitioning && isLoadingMore}
                    <!-- Skeleton während Transition -->
                    <div in:fade={{ duration: 200, easing: cubicInOut }} out:fade={{ duration: 150, easing: cubicInOut }}>
                        <BlogPostSkeleton count={4} />
                    </div>
                {:else}
                    <!-- Newest Post (prominent, nur auf Seite 1) -->
        {#if newestPosts.length > 0}
                        <div class="w-full space-y-8 mb-8" in:slide={{ duration: 400, easing: cubicInOut }} out:slide={{ duration: 300, easing: cubicInOut }}>
                {#each newestPosts as post, index (post.row_number)}
                    {@const shareUrl = post.slug ? getBlogShareUrl(post.slug) : (post.link || (typeof window !== 'undefined' ? window.location.href : ''))}
                    {@const shareText = `${post.title} - ${shareUrl}`}
                    {@const isNewest = true}
                    
                    <article 
                        itemscope 
                        itemtype="https://schema.org/BlogPosting"
                        class="bg-white dark:bg-aubergine-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl group
                        w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto"
                    >
                    {#if post.slug}
                        <Link to={getBlogUrl(post.slug)} class="block">
                            <BlogPostImage
                                image={post.image}
                                title={post.title}
                                category={post.category}
                                isFeatured={isNewest}
                                size="featured"
                                showCategory={true}
                                showFeaturedBadge={isNewest}
                            />
                            
                            <div class="p-4 md:p-4 lg:p-6">
                                <!-- Meta Information -->
                                <BlogPostMeta
                                    isodate={post.isodate}
                                    date={post.date}
                                    creator={post.creator}
                                    category={post.category}
                                    readingTime={post.readingTime}
                                    content={post.content}
                                    showCreator={true}
                                    showCategory={false}
                                    variant="grid"
                                    truncateAuthor={truncateAuthor}
                                />
                                
                                <h2 
                                    itemprop="headline"
                                    class="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                    {post.title}
                                </h2>
                                
                                <p 
                                    itemprop="description"
                                    class="text-gray-600 dark:text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed">
                                    {formatContentPreview(post.content)}
                                </p>
                            </div>
                        </Link>
                    {:else}
                        <a href={post.link || '#'} target="_blank" rel="noopener noreferrer" class="block">
                            <BlogPostImage
                                image={post.image}
                                title={post.title}
                                category={post.category}
                                isFeatured={false}
                                size="regular"
                                showCategory={true}
                                showFeaturedBadge={false}
                            />
                            
                            <div class="p-6">
                                <!-- Meta Information -->
                                <BlogPostMeta
                                    isodate={post.isodate}
                                    date={post.date}
                                    creator={post.creator}
                                    category={post.category}
                                    readingTime={post.readingTime}
                                    content={post.content}
                                    showCreator={true}
                                    showCategory={false}
                                    variant="grid"
                                    truncateAuthor={truncateAuthor}
                                />
                                
                                <h2 class="text-xl md:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                    {post.title}
                                </h2>
                                
                                <p class="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                                    {formatContentPreview(post.content)}
                                </p>
                            </div>
                        </a>
                    {/if}
                    
                    <!-- Like and Share Buttons as Chips - Same style as Detail View -->
                    <div class="px-4 md:px-4 lg:px-5 pb-2 md:pb-6 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 mt-8">
                        {#if post}
                            {@const likeStatus = blogLikesStore.getLikeStatus(post.id || post.row_number)}
                            {@const displayLikes = post.likes !== undefined && post.likes !== null ? parseInt(String(post.likes), 10) : likeStatus.likes}
                            {@const hasLikes = displayLikes > 0}
                            {@const postId = post.id || post.row_number}
                            {@const status = likeStatusMap.get(postId)}
                        <button 
                            data-like-button-id={postId}
                            aria-label={hasLikes ? 'Post already liked' : 'Like the blog post'}
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-visible"
                            on:click|stopPropagation={() => handleLike(postId)}
                            title={hasLikes ? 'Already liked' : 'Like'}
                            disabled={likingPostId === postId || hasLikes}
                        >
                            <span class="text-base relative inline-block {animatingHearts.has(postId) ? 'animate-heart-bounce' : ''}">{hasLikes ? '❤️' : '🤍'}</span>
                            {#if likingPostId === postId}
                                <!-- Loading Spinner -->
                                <svg class="animate-spin h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            {:else if status === 'success'}
                                <!-- Success Checkmark -->
                                <svg class="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            {:else if status === 'error'}
                                <!-- Error X -->
                                <svg class="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            {:else}
                                <span class="text-gray-700 dark:text-gray-300">{displayLikes || 0}</span>
                            {/if}
                        </button>
                
                        <ShareButtons 
                            {shareUrl}
                            {shareText}
                            title={post.title}
                            showNativeShare={true}
                        />
                        {/if}
            </div>
        </article>
    {/each}
            </div>
        {/if}
        
                    <!-- Other Posts -->
                    {#if otherPosts.length > 0}
                        <div class="w-full space-y-8" in:slide={{ duration: 400, easing: cubicInOut }} out:slide={{ duration: 300, easing: cubicInOut }}>
            {#each otherPosts as post, index (post.row_number)}
                    {@const shareUrl = post.slug ? getBlogShareUrl(post.slug) : (post.link || (typeof window !== 'undefined' ? window.location.href : ''))}
                    {@const shareText = `${post.title} - ${shareUrl}`}
                    
                    <article 
                        itemscope 
                        itemtype="https://schema.org/BlogPosting"
                        class="bg-white dark:bg-aubergine-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl group"
                    >
                        {#if post.slug}
                            <Link to={getBlogUrl(post.slug)} class="block">
                                <BlogPostImage
                                    image={post.image}
                                    title={post.title}
                                    category={post.category}
                                    isFeatured={false}
                                    size="regular"
                                    showCategory={true}
                                    showFeaturedBadge={false}
                                />
                                
                                <div class="p-6">
                                    <BlogPostMeta
                                        isodate={post.isodate}
                                        date={post.date}
                                        creator={post.creator}
                                        category={post.category}
                                        readingTime={post.readingTime}
                                        content={post.content}
                                        showCreator={true}
                                        showCategory={false}
                                        variant="grid"
                                        truncateAuthor={truncateAuthor}
                                    />
                                    
                                    <h2 
                                        itemprop="headline"
                                        class="text-xl md:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                        {post.title}
                                    </h2>
                                    
                                    <p 
                                        itemprop="description"
                                        class="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                                        {formatContentPreview(post.content)}
                                    </p>
                                </div>
                            </Link>
                        {:else}
                            <a href={post.link || '#'} target="_blank" rel="noopener noreferrer" class="block">
                                <BlogPostImage
                                    image={post.image}
                                    title={post.title}
                                    category={post.category}
                                    isFeatured={false}
                                    size="regular"
                                    showCategory={true}
                                    showFeaturedBadge={false}
                                />
                                
                                <div class="p-6">
                                    <BlogPostMeta
                                        isodate={post.isodate}
                                        date={post.date}
                                        creator={post.creator}
                                        category={post.category}
                                        readingTime={post.readingTime}
                                        content={post.content}
                                        showCreator={true}
                                        showCategory={false}
                                        variant="grid"
                                        truncateAuthor={truncateAuthor}
                                    />
                                    
                                    <h2 class="text-xl md:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-yellow transition-colors">
                                        {post.title}
                                    </h2>
                                    
                                    <p class="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                                        {formatContentPreview(post.content)}
                                    </p>
                                </div>
                            </a>
                        {/if}
                        
                                <div class="px-6 pb-6 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                                    {#if post}
                                        {@const likeStatus = blogLikesStore.getLikeStatus(post.id || post.row_number)}
                                        {@const displayLikes = post.likes !== undefined && post.likes !== null ? parseInt(String(post.likes), 10) : likeStatus.likes}
                                        {@const displayLiked = post.liked !== undefined ? post.liked : likeStatus.liked}
                            <button 
                                        data-like-button-id={post.id || post.row_number}
                                        aria-label={displayLiked ? 'Unlike the blog post' : 'Like the blog post'}
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 bg-white dark:bg-aubergine-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-aubergine-700 transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-visible"
                                on:click|stopPropagation={() => handleLike(post.id || post.row_number)}
                                        title={displayLiked ? 'Unlike' : 'Like'}
                                disabled={likingPostId === (post.id || post.row_number)}
                            >
                                        <span class="text-base relative inline-block {animatingHearts.has(post.id || post.row_number) ? 'animate-heart-bounce' : ''}">{displayLiked ? '❤️' : '🤍'}</span>
                                {#if likingPostId === (post.id || post.row_number)}
                                    <svg class="animate-spin h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                {:else}
                                            <span class="text-gray-700 dark:text-gray-300">{displayLikes || 0}</span>
                                {/if}
                            </button>
                    
                                    <ShareButtons 
                                        {shareUrl}
                                        {shareText}
                                        title={post.title}
                                        showNativeShare={true}
                                    />
                                    {/if}
                        </div>
                    </article>
            {/each}
                        </div>
            {/if}
                {/if}
            {/key}
        </div>
{/if}

<HeartAnimation show={showHeartAnimation} count={5} />
</PageLayout>

<!-- Fixed Navigation Buttons (Left/Right) - Outside PageLayout like FixedMenu -->
{#if totalPages > 1 && !loading && !error}
<nav 
    itemscope 
    itemtype="https://schema.org/SiteNavigationElement"
    aria-label="Blog pagination navigation"
    class="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
>
    <span itemprop="name" class="sr-only">Previous page navigation</span>
    <button
        on:click={previousPage}
        disabled={currentPage === 1 || isLoadingMore || isTransitioning}
        class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100"
        aria-label="Go to previous page, page {currentPage - 1} of {totalPages}"
        aria-disabled={currentPage === 1 || isLoadingMore || isTransitioning}
        title="Previous page (Page {currentPage - 1} of {totalPages})"
        type="button"
    >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
    </button>
</nav>

<nav 
    itemscope 
    itemtype="https://schema.org/SiteNavigationElement"
    aria-label="Blog pagination navigation"
    class="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
>
    <span itemprop="name" class="sr-only">Next page navigation</span>
    <button
        on:click={nextPage}
        disabled={currentPage === totalPages || isLoadingMore || isTransitioning}
        class="btn border-4 p-4 border-creme-500 dark:border-aubergine-800 dark:text-white bg-powder-300 dark:bg-aubergine-900 w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 focus:scale-105 active:scale-95 focus:ring-2 focus:ring-yellow-50 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:focus:scale-100 disabled:active:scale-100"
        aria-label="Go to next page, page {currentPage + 1} of {totalPages}"
        aria-disabled={currentPage === totalPages || isLoadingMore || isTransitioning}
        title="Next page (Page {currentPage + 1} of {totalPages})"
        type="button"
    >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    </button>
</nav>
{/if}

<!-- Heart Animations -->
<!-- Große fliegende Herzen (wie in BlogPost) -->
<HeartAnimation show={showHeartAnimation} count={5} />

<!-- Große zentrierte Herz-Animation für Success -->
<BigHeartAnimation show={showBigHeartAnimation} />

<!-- Button Heart Particles - Kleine fliegende Herzen um jeden Button -->
{#each Array.from(buttonParticles.entries()) as [postId, particleData]}
    {#if particleData.show && particleData.buttonElement}
        <ButtonHeartParticles 
            show={particleData.show} 
            buttonElement={particleData.buttonElement}
            count={6}
        />
    {/if}
{/each}
