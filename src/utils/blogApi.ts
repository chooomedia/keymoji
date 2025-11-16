/*
Blog API utilities for fetching blog posts with caching and error handling.
Provides centralized blog data fetching, slug normalization, and like management.
Handles blog post retrieval, caching, and interaction with backend webhooks.
*/
import { WEBHOOKS } from '../config/api';
import { isDebugMode } from './environment';

function debugBlogApi(context: string, data?: unknown) {
    if (!isDebugMode()) return;
    console.group(`🔍 BlogApi Debug: ${context}`);
    if (data) debugBlogApi(data);
    console.groupEnd();
}
import { cachedFetch } from './apiCache';
import { storageHelpers, STORAGE_KEYS } from '../config/storage';
import { normalizeSlug, sanitizeSlug } from './slug';

/**
 * Blog Post Interface
 */
export interface BlogPost {
    id?: string | number;
    row_number?: string | number;
    slug: string;
    title: string;
    content: string;
    excerpt?: string;
    author?: string;
    creator?: string;
    isodate?: string;
    date?: string;
    publishedAt?: string;
    updatedAt?: string;
    tags?: string[];
    language?: string;
    image?: string;
    likes?: number | string;
    liked?: boolean;
    readingTime?: number;
    category?: string;
    [key: string]: unknown;
}

/**
 * Blog Post Options Interface
 */
export interface BlogPostOptions {
    useCache?: boolean;
    forceRefresh?: boolean;
}

/**
 * Like Blog Post Options Interface
 */
export interface LikeBlogPostOptions {
    optimistic?: boolean;
    unlike?: boolean;
}

/**
 * Like Blog Post Response Interface
 */
export interface LikeBlogPostResponse {
    success: boolean;
    likes?: number | null;
    postId?: string | number;
    error?: string;
    statusCode?: number;
    parseError?: string;
}

/**
 * Cached Like Interface
 */
interface CachedLike {
    liked: boolean;
    likes: number;
}

/**
 * Cached Likes Storage Type
 */
type CachedLikesStorage = Record<string, CachedLike>;

// Cache TTL für Blog-Daten
const CACHE_TTL = {
    POSTS_LIST: 10 * 60 * 1000, // 10 Minuten (Posts ändern sich selten)
    POST_DETAIL: 30 * 60 * 1000, // 30 Minuten (noch seltener)
    LIKES: 0 // Kein Cache für Likes (immer aktuell)
} as const;

// Storage Keys
const STORAGE_KEYS_BLOG = {
    POSTS: 'keymoji_blog_posts',
    LIKES: 'keymoji_blog_likes'
} as const;

/**
 * Berechnet Lesezeit basierend auf Content
 * @param content - HTML oder Text-Content
 * @returns Geschätzte Lesezeit in Minuten
 */
export function calculateReadTime(content: string | null | undefined): number {
    if (!content) return 1;
    
    // Entferne HTML-Tags für Wortzählung
    const textContent = typeof content === 'string' 
        ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        : '';
    
    const wordsPerMinute = 200;
    const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Formatiert Content für Preview (kürzt auf max. 270 Zeichen)
 * @param content - Vollständiger Content
 * @returns Formatierter Preview-Text
 */
export function formatContentPreview(content: string | null | undefined): string {
    if (!content) return '';
    
    // Entferne HTML-Tags
    let formatted = content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\[&#8230;\]/g, '...')
        .replace(/\n/g, ' ')
        .replace(/\[empty\]/g, '')
        .replace(/The post .* appeared first on .*/, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    if (formatted.length > 270) {
        formatted = formatted.substring(0, 270);
        const lastSpace = formatted.lastIndexOf(' ');
        if (lastSpace > 0) {
            formatted = formatted.substring(0, lastSpace) + '...';
        } else {
            formatted = formatted.substring(0, 267) + '...';
        }
    }
    
    return formatted;
}

/**
 * Formatiert Datum für Anzeige
 * @param isodate - ISO 8601 Datum
 * @param locale - Locale für Formatierung
 * @returns Formatiertes Datum
 */
export function formatDate(isodate: string | null | undefined, locale: string = 'en'): string {
    if (!isodate) return '';
    
    try {
        const date = new Date(isodate);
        if (isNaN(date.getTime())) return '';
        
        // Use short month format (e.g., "Nov." instead of "November")
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short', // Short format: Nov., Dez., Jan., etc.
            day: 'numeric'
        });
    } catch (error) {
        debugBlogApi('⚠️ [blogApi] Error formatting date:', error);
        return '';
    }
}

/**
 * Lädt alle Blog-Posts
 * @param options - Optionen
 * @param options.useCache - Ob Cache verwendet werden soll (default: true)
 * @returns Promise mit Array von Blog-Posts
 */
export async function fetchBlogPosts(options: BlogPostOptions = {}): Promise<BlogPost[]> {
    const { useCache = true, forceRefresh = false } = options;
    
    try {
        // Lade aus localStorage als Fallback (immer, auch bei forceRefresh, für Fallback)
        let cachedPosts: BlogPost[] = [];
        try {
            const stored = storageHelpers.get(STORAGE_KEYS_BLOG.POSTS, []) as BlogPost[] | unknown;
            cachedPosts = Array.isArray(stored) ? stored : [];
            debugBlogApi('📦 [blogApi] Cached posts in localStorage:', cachedPosts.length);
        } catch (error) {
            debugBlogApi('⚠️ [blogApi] Error reading cached posts:', error);
        }
        
        // Fetch von API mit Caching (oder ohne Cache wenn forceRefresh)
        const url = WEBHOOKS.BLOG.POSTS;
        debugBlogApi('🔗 [blogApi] Fetching blog posts from:', url);
        let posts: unknown;
        
        if (forceRefresh) {
            // Force fresh fetch from API (bypass cache)
            debugBlogApi('🔄 [blogApi] Force refreshing posts from backend...');
            const response = await fetch(url, { method: 'GET' });
            
            // Handle HTTP errors
            if (!response.ok) {
                debugBlogApi(`❌ [blogApi] HTTP error! status: ${response.status}`);
                if (cachedPosts.length > 0) {
                    debugBlogApi('⚠️ [blogApi] Using cached data due to HTTP error');
                    return cachedPosts;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Read response as text first to handle empty responses (HTTP 200 but 0 bytes)
            const responseText = await response.text();
            const responseLength = responseText ? responseText.trim().length : 0;
            
            debugBlogApi(`📊 [blogApi] Response status: ${response.status}, size: ${responseLength} bytes`);
            
            if (!responseText || responseLength === 0) {
                debugBlogApi('⚠️ [blogApi] Empty response from API (HTTP 200 but 0 bytes), using cached data');
                if (cachedPosts.length > 0) {
                    return cachedPosts;
                }
                // Return empty array if no cache available
                debugBlogApi('⚠️ [blogApi] No cached data available, returning empty array');
                return [];
            }
            
            // Parse JSON
            try {
                posts = JSON.parse(responseText);
            } catch (parseError) {
                const error = parseError instanceof Error ? parseError : new Error(String(parseError));
                debugBlogApi('❌ [blogApi] Failed to parse JSON response:', error);
                debugBlogApi('❌ [blogApi] Response text (first 200 chars):', responseText.substring(0, 200));
                if (cachedPosts.length > 0) {
                    debugBlogApi('⚠️ [blogApi] Using cached data due to parse error');
                    return cachedPosts;
                }
                throw new Error(`Invalid JSON response: ${error.message}`);
            }
        } else {
            // Use cached fetch
            try {
            posts = await cachedFetch(
                url,
                { method: 'GET' },
                CACHE_TTL.POSTS_LIST,
                true // stale-while-revalidate
            );
            } catch (fetchError) {
                debugBlogApi('❌ [blogApi] Error fetching posts:', fetchError);
                if (cachedPosts.length > 0) {
                    debugBlogApi('⚠️ [blogApi] Using cached data due to fetch error');
                    return cachedPosts;
                }
                throw fetchError;
            }
        }
        
        // Handle empty or invalid responses
        if (!posts) {
            debugBlogApi('⚠️ [blogApi] Empty response from API, using cached data');
            return cachedPosts.length > 0 ? cachedPosts : [];
        }
        
        if (!Array.isArray(posts)) {
            debugBlogApi('⚠️ [blogApi] Invalid posts response (not an array):', typeof posts, posts);
            if (cachedPosts.length > 0) {
                debugBlogApi('⚠️ [blogApi] Using cached data due to invalid response type');
                return cachedPosts;
            }
            return [];
        }
        
        // Handle empty array (API returned [] but HTTP 200)
        if (posts.length === 0) {
            debugBlogApi('ℹ️ [blogApi] API returned empty array, using cached data if available');
            return cachedPosts.length > 0 ? cachedPosts : [];
        }
        
        // Merge mit cached likes und stelle sicher, dass jeder Post einen Slug hat
        const cachedLikes = getCachedLikes();
        
        // DEBUG: Log Backend-Daten für ersten Post
        if (posts.length > 0 && forceRefresh) {
            const firstPost = posts[0] as BlogPost;
            debugBlogApi('🔍 [blogApi] DEBUG - First post from backend:', {
                id: firstPost.id || firstPost.row_number,
                title: firstPost.title?.substring(0, 30),
                likes: firstPost.likes,
                likesType: typeof firstPost.likes,
                liked: firstPost.liked,
                likedType: typeof firstPost.liked,
                fullPost: firstPost
            });
        }
        
        const mergedPosts: BlogPost[] = posts.map((post: unknown) => {
            const blogPost = post as BlogPost;
            const postId = blogPost.id || blogPost.row_number;
            const cachedLike = postId ? cachedLikes[String(postId)] : undefined;
            
            // Stelle sicher, dass jeder Post einen Slug hat
            let slug = blogPost.slug;
            if (!slug || !slug.trim()) {
                // Generiere Slug aus Titel oder verwende Fallback
                slug = normalizeSlug(blogPost.title, String(postId || 'post'));
            } else {
                // Sanitize vorhandenen Slug
                slug = sanitizeSlug(slug);
            }
            
            // BACKEND FIRST: Backend-Wert ist IMMER der initiale Wert
            // Priority für likes: Backend (post.likes) > cachedLike.likes > 0
            // Backend liefert likes aus der "likes" Spalte im Google Sheet (via n8n)
            // post.likes sollte bereits vom Backend kommen
            // CRITICAL: post.likes ist die korrekte Quelle
            // post.liked ist ein Boolean (User-spezifisch), NICHT die Anzahl!
            const backendLikesRaw = blogPost.likes;
            
            // DEBUG: Log für ersten Post
            if (postId === (posts[0] as BlogPost)?.id || postId === (posts[0] as BlogPost)?.row_number) {
                if (forceRefresh) {
                    debugBlogApi('🔍 [blogApi] DEBUG - Processing likes for first post:', {
                        postId,
                        backendLikesRaw,
                        backendLikesRawType: typeof backendLikesRaw,
                        cachedLike,
                        cachedLikesValue: cachedLike?.likes
                    });
                }
            }
            
            // BACKEND FIRST: Parse Backend-Wert (auch 0 ist gültig!)
            const backendLikes = backendLikesRaw !== undefined && backendLikesRaw !== null 
                ? parseInt(String(backendLikesRaw), 10) 
                : null;
            
            const cachedLikesValue = cachedLike?.likes !== undefined && cachedLike.likes !== null 
                ? parseInt(String(cachedLike.likes), 10) 
                : null;
            
            // BACKEND FIRST: Backend hat IMMER Priorität, auch wenn 0
            // Nur wenn Backend null/undefined ist, verwende Cache oder 0
            const finalLikes = backendLikes !== null && !isNaN(backendLikes) && backendLikes >= 0 
                ? backendLikes 
                : (cachedLikesValue !== null && !isNaN(cachedLikesValue) ? cachedLikesValue : 0);
            
            // DEBUG: Log wenn Backend-Wert fehlt oder unerwartet ist
            if (backendLikes === null || backendLikes === undefined || isNaN(backendLikes)) {
                debugBlogApi('⚠️ [blogApi] Missing/invalid likes from backend for post:', {
                    id: postId,
                    title: blogPost.title?.substring(0, 30),
                    postLikes: blogPost.likes,
                    backendLikesRaw,
                    backendLikes,
                    cachedLikesValue,
                    finalLikes
                });
            }
            
            // DEBUG: Log für ersten Post (immer bei forceRefresh)
            if (postId === ((posts[0] as BlogPost)?.id || (posts[0] as BlogPost)?.row_number) && forceRefresh) {
                debugBlogApi('✅ [blogApi] DEBUG - Final likes for first post:', {
                    postId,
                    backendLikes,
                    cachedLikesValue,
                    finalLikes,
                    usedSource: backendLikes !== null && !isNaN(backendLikes) ? 'BACKEND' : 'CACHE'
                });
            }
            
            return {
                ...blogPost,
                slug, // Stelle sicher, dass slug immer gesetzt ist
                likes: finalLikes, // Verwende Backend-Likes als Priorität
                liked: cachedLike?.liked || false, // liked-Status kommt nur aus Cache (User-spezifisch)
                // Berechne readingTime falls nicht vorhanden
                readingTime: blogPost.readingTime || calculateReadTime(blogPost.content)
            };
        });
        
        // Speichere in localStorage
        try {
            storageHelpers.set(STORAGE_KEYS_BLOG.POSTS, mergedPosts);
        } catch (error) {
            debugBlogApi('⚠️ [blogApi] Error saving posts to cache:', error);
        }
        
        return mergedPosts;
    } catch (error) {
        debugBlogApi('❌ [blogApi] Error fetching blog posts:', error);
        
        // Fallback: Return cached posts
        try {
            const stored = storageHelpers.get(STORAGE_KEYS_BLOG.POSTS, []) as BlogPost[] | unknown;
            if (Array.isArray(stored) && stored.length > 0) {
                debugBlogApi('✅ [blogApi] Using cached posts as fallback:', stored.length, 'posts');
                return stored;
            }
        } catch (cacheError) {
            debugBlogApi('❌ [blogApi] Error reading cached posts:', cacheError);
        }
        
        // Return empty array if no cached data available
        debugBlogApi('⚠️ [blogApi] No cached posts available, returning empty array');
        return [];
    }
}

/**
 * Lädt einen einzelnen Blog-Post per Slug
 * Da der n8n Workflow nur eine Posts-Liste liefert, suchen wir in dieser Liste
 * @param slug - Post-Slug
 * @param options - Optionen
 * @param options.useCache - Ob Cache verwendet werden soll (default: true)
 * @returns Promise mit Blog-Post oder null
 */
export async function fetchBlogPost(
    slug: string,
    options: BlogPostOptions = {}
): Promise<BlogPost | null> {
    const { useCache = true } = options;
    
    if (!slug) {
        debugBlogApi('❌ [blogApi] No slug provided');
        return null;
    }
    
    // Sanitize slug für sichere Suche
    const sanitizedSlug = sanitizeSlug(slug);
    if (!sanitizedSlug) {
        debugBlogApi('❌ [blogApi] Invalid slug format:', slug);
        return null;
    }
    
    try {
        // Lade alle Posts (mit Cache)
        const allPosts = await fetchBlogPosts({ useCache });
        
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            debugBlogApi('⚠️ [blogApi] No posts available to search');
            return null;
        }
        
        // Suche Post per Slug (case-insensitive)
        const post = allPosts.find(p => {
            const postSlug = p.slug ? sanitizeSlug(p.slug) : '';
            return postSlug === sanitizedSlug || 
                   postSlug.toLowerCase() === sanitizedSlug.toLowerCase();
        });
        
        if (!post) {
            debugBlogApi('⚠️ [blogApi] Post not found with slug:', sanitizedSlug);
            return null;
        }
        
        // Berechne readingTime falls nicht vorhanden
        if (!post.readingTime) {
            post.readingTime = calculateReadTime(post.content);
        }
        
        // Stelle sicher, dass slug gesetzt ist
        if (!post.slug) {
            post.slug = sanitizedSlug;
        }
        
        return post;
    } catch (error) {
        debugBlogApi('❌ [blogApi] Error fetching blog post:', error);
        return null;
    }
}

/**
 * Like einen Blog-Post
 * @param postId - Post-ID oder row_number
 * @param options - Optionen
 * @param options.optimistic - Optimistic update (default: true)
 * @returns Promise mit Updated post data oder null
 */
export async function likeBlogPost(
    postId: string | number,
    options: LikeBlogPostOptions = {}
): Promise<LikeBlogPostResponse | null> {
    const { optimistic = true, unlike = false } = options;
    
    if (!postId) {
        debugBlogApi('❌ [blogApi] No postId provided');
        return null;
    }
    
    try {
        const url = WEBHOOKS.BLOG.LIKE;
        
        // Optimistic update: Speichere Like/Unlike sofort lokal
        if (optimistic) {
            updateCachedLike(postId, !unlike);
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postId: postId,
                rowNumber: postId,
                unlike: unlike
            })
        });
        
        if (!response.ok) {
            let errorMessage = response.statusText;
            const statusCode = response.status;
            
            // Handle 404 specifically (webhook not registered)
            if (statusCode === 404) {
                debugBlogApi('⚠️ [blogApi] Like webhook not registered (404). Workflow may not be active in n8n.');
                errorMessage = 'Like webhook not available. Please activate the workflow in n8n.';
            }
            
            try {
                const errorData = await response.json() as { message?: string; error?: string; hint?: string };
                errorMessage = errorData.message || errorData.error || errorMessage;
                if (errorData.hint) {
                    debugBlogApi('💡 [blogApi] Hint:', errorData.hint);
                }
            } catch (parseError) {
                const errorText = await response.text().catch(() => 'Unknown error');
                debugBlogApi(`❌ [blogApi] Like request failed (${statusCode}):`, errorText.substring(0, 200));
            }
            
            if (optimistic) {
                updateCachedLike(postId, unlike);
            }
            
            // Return error info for better error handling
            return {
                success: false,
                error: errorMessage,
                statusCode: statusCode
            };
        }
        
        let result: { success?: boolean; likes?: number | string | null } | null = null;
        try {
            const responseText = await response.text();
            
            if (!responseText || responseText.trim().length === 0) {
                debugBlogApi('⚠️ [blogApi] Empty response from API, assuming success');
                updateCachedLike(postId, !unlike);
                return {
                    success: true,
                    likes: null
                };
            }
            
            result = JSON.parse(responseText) as { success?: boolean; likes?: number | string | null };
        } catch (parseError) {
            const error = parseError instanceof Error ? parseError : new Error(String(parseError));
            debugBlogApi('❌ [blogApi] Failed to parse response as JSON:', error);
            if (optimistic) {
                updateCachedLike(postId, unlike);
            }
            return {
                success: false,
                error: 'Failed to parse response',
                parseError: error.message
            };
        }
        
        if (result && (result.success !== false)) {
            // PRIORITÄT: Backend-Wert hat immer höchste Priorität
            const backendLikes = result.likes !== undefined && result.likes !== null 
                ? parseInt(String(result.likes), 10) 
                : null;
            updateCachedLike(postId, !unlike, backendLikes);
            return {
                success: true,
                likes: backendLikes,
                postId: postId
            };
        } else {
            if (optimistic) {
                updateCachedLike(postId, unlike);
            }
            return null;
        }
    } catch (error) {
        debugBlogApi('❌ [blogApi] Error liking blog post:', error);
        if (optimistic) {
            updateCachedLike(postId, unlike);
        }
        return null;
    }
}

/**
 * Holt gecachte Likes aus localStorage
 * @returns Object mit postId -> { liked, likes }
 */
function getCachedLikes(): CachedLikesStorage {
    try {
        const stored = storageHelpers.get(STORAGE_KEYS_BLOG.LIKES, {}) as CachedLikesStorage | unknown;
        return typeof stored === 'object' && stored !== null ? stored as CachedLikesStorage : {};
    } catch (error) {
        debugBlogApi('⚠️ [blogApi] Error reading cached likes:', error);
        return {};
    }
}

/**
 * Aktualisiert gecachte Like-Information
 * @param postId - Post-ID
 * @param liked - Ob geliked
 * @param likes - Anzahl Likes (optional)
 */
function updateCachedLike(postId: string | number, liked: boolean, likes: number | null = null): void {
    try {
        const cachedLikes = getCachedLikes();
        const key = String(postId);
        
        // CRITICAL: Backend likes haben IMMER Priorität
        // Nur wenn keine Backend-Likes vorhanden, berechne optimistisch
        const newLikes = likes !== null && !isNaN(likes) && likes >= 0
            ? likes
            : (cachedLikes[key]?.likes || 0) + (liked ? 1 : -1);
        
        cachedLikes[key] = {
            liked: liked,
            likes: Math.max(0, newLikes) // Stelle sicher, dass likes >= 0
        };
        
        storageHelpers.set(STORAGE_KEYS_BLOG.LIKES, cachedLikes);
        
        // Debug: Log update
        debugBlogApi('💾 [blogApi] Updated cached like:', {
            postId,
            liked,
            likes: newLikes,
            source: likes !== null ? 'backend' : 'optimistic'
        });
    } catch (error) {
        debugBlogApi('⚠️ [blogApi] Error updating cached like:', error);
    }
}

/**
 * Findet den Featured Post (Post mit meisten Likes)
 * @param posts - Array von Posts
 * @returns Featured Post oder null
 */
export function getFeaturedPost(posts: BlogPost[] | null | undefined): BlogPost | null {
    if (!Array.isArray(posts) || posts.length === 0) return null;
    
    return posts.reduce((max, post) => {
        const maxLikes = max?.likes || 0;
        const postLikes = typeof post?.likes === 'number' ? post.likes : 0;
        return postLikes > maxLikes ? post : max;
    }, posts[0] || null);
}

