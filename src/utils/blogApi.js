// src/utils/blogApi.js
// Blog API Utilities - Centralized blog data fetching with caching and error handling

import { WEBHOOKS } from '../config/api.js';
import { cachedFetch } from './apiCache.js';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';
import { normalizeSlug, sanitizeSlug } from './slug.js';

// Cache TTL für Blog-Daten
const CACHE_TTL = {
    POSTS_LIST: 10 * 60 * 1000, // 10 Minuten (Posts ändern sich selten)
    POST_DETAIL: 30 * 60 * 1000, // 30 Minuten (noch seltener)
    LIKES: 0 // Kein Cache für Likes (immer aktuell)
};

// Storage Keys
const STORAGE_KEYS_BLOG = {
    POSTS: 'keymoji_blog_posts',
    LIKES: 'keymoji_blog_likes'
};

/**
 * Berechnet Lesezeit basierend auf Content
 * @param {string} content - HTML oder Text-Content
 * @returns {number} Geschätzte Lesezeit in Minuten
 */
export function calculateReadTime(content) {
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
 * @param {string} content - Vollständiger Content
 * @returns {string} Formatierter Preview-Text
 */
export function formatContentPreview(content) {
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
 * @param {string} isodate - ISO 8601 Datum
 * @param {string} locale - Locale für Formatierung
 * @returns {string} Formatiertes Datum
 */
export function formatDate(isodate, locale = 'en') {
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
        console.warn('⚠️ [blogApi] Error formatting date:', error);
        return '';
    }
}

/**
 * Lädt alle Blog-Posts
 * @param {object} options - Optionen
 * @param {boolean} options.useCache - Ob Cache verwendet werden soll (default: true)
 * @returns {Promise<Array>} Array von Blog-Posts
 */
export async function fetchBlogPosts(options = {}) {
    const { useCache = true, forceRefresh = false } = options;
    
    try {
        // Lade aus localStorage als Fallback (immer, auch bei forceRefresh, für Fallback)
        let cachedPosts = [];
        try {
            const stored = storageHelpers.get(STORAGE_KEYS_BLOG.POSTS, []);
            cachedPosts = Array.isArray(stored) ? stored : [];
            console.log('📦 [blogApi] Cached posts in localStorage:', cachedPosts.length);
        } catch (error) {
            console.warn('⚠️ [blogApi] Error reading cached posts:', error);
        }
        
        // Fetch von API mit Caching (oder ohne Cache wenn forceRefresh)
        const url = WEBHOOKS.BLOG.POSTS;
        console.log('🔗 [blogApi] Fetching blog posts from:', url);
        let posts;
        
        if (forceRefresh) {
            // Force fresh fetch from API (bypass cache)
            console.log('🔄 [blogApi] Force refreshing posts from backend...');
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Read response as text first to handle empty responses
            const responseText = await response.text();
            if (!responseText || responseText.trim().length === 0) {
                console.warn('⚠️ [blogApi] Empty response from API, using cached data');
                return cachedPosts.length > 0 ? cachedPosts : [];
            }
            
            // Parse JSON
            try {
                posts = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ [blogApi] Failed to parse JSON response:', parseError);
                throw new Error(`Invalid JSON response: ${parseError.message}`);
            }
        } else {
            // Use cached fetch
            posts = await cachedFetch(
                url,
                { method: 'GET' },
                CACHE_TTL.POSTS_LIST,
                true // stale-while-revalidate
            );
        }
        
        // Handle empty or invalid responses
        if (!posts) {
            console.warn('⚠️ [blogApi] Empty response from API, using cached data');
            return cachedPosts.length > 0 ? cachedPosts : [];
        }
        
        if (!Array.isArray(posts)) {
            console.warn('⚠️ [blogApi] Invalid posts response (not an array):', typeof posts, posts);
            return cachedPosts.length > 0 ? cachedPosts : [];
        }
        
        // Handle empty array
        if (posts.length === 0) {
            console.log('ℹ️ [blogApi] API returned empty array, using cached data if available');
            return cachedPosts.length > 0 ? cachedPosts : [];
        }
        
        // Merge mit cached likes und stelle sicher, dass jeder Post einen Slug hat
        const cachedLikes = getCachedLikes();
        const mergedPosts = posts.map(post => {
            const cachedLike = cachedLikes[post.id || post.row_number];
            
            // Stelle sicher, dass jeder Post einen Slug hat
            let slug = post.slug;
            if (!slug || !slug.trim()) {
                // Generiere Slug aus Titel oder verwende Fallback
                slug = normalizeSlug(post.title, post.id || post.row_number || 'post');
            } else {
                // Sanitize vorhandenen Slug
                slug = sanitizeSlug(slug);
            }
            
            // Priority für likes: Backend (post.likes) > cachedLike.likes > 0
            // Backend liefert likes aus der "liked" Spalte im Google Sheet (via n8n Merge With Likes)
            // post.likes sollte bereits vom Backend kommen (nach Merge With Likes)
            // CRITICAL: post.likes ist die korrekte Quelle (wird im n8n "Clean Post Data" Node gesetzt)
            // post.liked ist ein Boolean (User-spezifisch), NICHT die Anzahl!
            const backendLikesRaw = post.likes;
            const backendLikes = backendLikesRaw !== undefined && backendLikesRaw !== null 
                ? parseInt(String(backendLikesRaw), 10) 
                : null;
            const cachedLikesValue = cachedLike?.likes !== undefined && cachedLike.likes !== null ? parseInt(cachedLike.likes, 10) : null;
            
            // CRITICAL: Backend hat IMMER Priorität, auch wenn 0 (aber nicht wenn null/undefined)
            // Nur wenn Backend null/undefined ist, verwende Cache oder 0
            const finalLikes = backendLikes !== null && !isNaN(backendLikes) && backendLikes >= 0 
                ? backendLikes 
                : (cachedLikesValue !== null && !isNaN(cachedLikesValue) ? cachedLikesValue : 0);
            
            // Debug: Log nur wenn likes fehlen oder unerwartet sind
            if (backendLikes === null || backendLikes === undefined) {
                console.warn('⚠️ [blogApi] Missing likes from backend for post:', {
                    id: post.id || post.row_number,
                    title: post.title?.substring(0, 30),
                    postLikes: post.likes,
                    backendLikes,
                    cachedLikesValue,
                    finalLikes
                });
            }
            
            return {
                ...post,
                slug, // Stelle sicher, dass slug immer gesetzt ist
                likes: finalLikes, // Verwende Backend-Likes als Priorität
                liked: cachedLike?.liked || false, // liked-Status kommt nur aus Cache (User-spezifisch)
                // Berechne readingTime falls nicht vorhanden
                readingTime: post.readingTime || calculateReadTime(post.content)
            };
        });
        
        // Speichere in localStorage
        try {
            storageHelpers.set(STORAGE_KEYS_BLOG.POSTS, mergedPosts);
        } catch (error) {
            console.warn('⚠️ [blogApi] Error saving posts to cache:', error);
        }
        
        return mergedPosts;
    } catch (error) {
        console.error('❌ [blogApi] Error fetching blog posts:', error);
        
        // Fallback: Return cached posts
        try {
            const stored = storageHelpers.get(STORAGE_KEYS_BLOG.POSTS, []);
            if (Array.isArray(stored) && stored.length > 0) {
                console.log('✅ [blogApi] Using cached posts as fallback:', stored.length, 'posts');
                return stored;
            }
        } catch (cacheError) {
            console.error('❌ [blogApi] Error reading cached posts:', cacheError);
        }
        
        // Return empty array if no cached data available
        console.warn('⚠️ [blogApi] No cached posts available, returning empty array');
        return [];
    }
}

/**
 * Lädt einen einzelnen Blog-Post per Slug
 * Da der n8n Workflow nur eine Posts-Liste liefert, suchen wir in dieser Liste
 * @param {string} slug - Post-Slug
 * @param {object} options - Optionen
 * @param {boolean} options.useCache - Ob Cache verwendet werden soll (default: true)
 * @returns {Promise<object|null>} Blog-Post oder null
 */
export async function fetchBlogPost(slug, options = {}) {
    const { useCache = true } = options;
    
    if (!slug) {
        console.error('❌ [blogApi] No slug provided');
        return null;
    }
    
    // Sanitize slug für sichere Suche
    const sanitizedSlug = sanitizeSlug(slug);
    if (!sanitizedSlug) {
        console.error('❌ [blogApi] Invalid slug format:', slug);
        return null;
    }
    
    try {
        // Lade alle Posts (mit Cache)
        const allPosts = await fetchBlogPosts({ useCache });
        
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            console.warn('⚠️ [blogApi] No posts available to search');
            return null;
        }
        
        // Suche Post per Slug (case-insensitive)
        const post = allPosts.find(p => {
            const postSlug = p.slug ? sanitizeSlug(p.slug) : '';
            return postSlug === sanitizedSlug || 
                   postSlug.toLowerCase() === sanitizedSlug.toLowerCase();
        });
        
        if (!post) {
            console.warn('⚠️ [blogApi] Post not found with slug:', sanitizedSlug);
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
        console.error('❌ [blogApi] Error fetching blog post:', error);
        return null;
    }
}

/**
 * Like einen Blog-Post
 * @param {string|number} postId - Post-ID oder row_number
 * @param {object} options - Optionen
 * @param {boolean} options.optimistic - Optimistic update (default: true)
 * @returns {Promise<object|null>} Updated post data oder null
 */
export async function likeBlogPost(postId, options = {}) {
    const { optimistic = true, unlike = false } = options;
    
    if (!postId) {
        console.error('❌ [blogApi] No postId provided');
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
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (parseError) {
                const errorText = await response.text().catch(() => 'Unknown error');
                console.error('❌ [blogApi] Like request failed:', errorText.substring(0, 200));
            }
            
            if (optimistic) {
                updateCachedLike(postId, unlike);
            }
            return null;
        }
        
        let result;
        try {
            const responseText = await response.text();
            
            if (!responseText || responseText.trim().length === 0) {
                console.warn('⚠️ [blogApi] Empty response from API, assuming success');
                updateCachedLike(postId, !unlike);
                return {
                    success: true,
                    likes: null
                };
            }
            
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ [blogApi] Failed to parse response as JSON:', parseError);
            if (optimistic) {
                updateCachedLike(postId, unlike);
            }
            return null;
        }
        
        if (result && (result.success !== false)) {
            // PRIORITÄT: Backend-Wert hat immer höchste Priorität
            const backendLikes = result.likes !== undefined && result.likes !== null 
                ? parseInt(result.likes, 10) 
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
        console.error('❌ [blogApi] Error liking blog post:', error);
        if (optimistic) {
            updateCachedLike(postId, unlike);
        }
        return null;
    }
}

/**
 * Holt gecachte Likes aus localStorage
 * @returns {object} Object mit postId -> { liked, likes }
 */
function getCachedLikes() {
    try {
        const stored = storageHelpers.get(STORAGE_KEYS_BLOG.LIKES, {});
        return typeof stored === 'object' && stored !== null ? stored : {};
    } catch (error) {
        console.warn('⚠️ [blogApi] Error reading cached likes:', error);
        return {};
    }
}

/**
 * Aktualisiert gecachte Like-Information
 * @param {string|number} postId - Post-ID
 * @param {boolean} liked - Ob geliked
 * @param {number} likes - Anzahl Likes (optional)
 */
function updateCachedLike(postId, liked, likes = null) {
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
        console.log('💾 [blogApi] Updated cached like:', {
            postId,
            liked,
            likes: newLikes,
            source: likes !== null ? 'backend' : 'optimistic'
        });
    } catch (error) {
        console.warn('⚠️ [blogApi] Error updating cached like:', error);
    }
}

/**
 * Findet den Featured Post (Post mit meisten Likes)
 * @param {Array} posts - Array von Posts
 * @returns {object|null} Featured Post oder null
 */
export function getFeaturedPost(posts) {
    if (!Array.isArray(posts) || posts.length === 0) return null;
    
    return posts.reduce((max, post) => {
        const maxLikes = max?.likes || 0;
        const postLikes = post?.likes || 0;
        return postLikes > maxLikes ? post : max;
    }, posts[0] || null);
}

