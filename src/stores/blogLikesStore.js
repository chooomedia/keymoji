// src/stores/blogLikesStore.js
// Store für Blog Post Likes - Best Practices nach Svelte Doc
// Initiales Laden vom Backend, Store Update bei Like mit logischem Fallback

import { writable, derived, get } from 'svelte/store';
import { fetchBlogPosts, likeBlogPost } from '../utils/blogApi.js';

/**
 * Store für Blog Post Likes
 * Struktur: { [postId]: { liked: boolean, likes: number } }
 */
function createBlogLikesStore() {
    const { subscribe, set, update } = writable({});
    let isInitialized = false;
    
    /**
     * Initialisiert den Store mit Daten vom Backend
     * BACKEND FIRST: Backend-Wert ist IMMER der initiale Wert beim Laden
     * Überschreibt ALLE vorhandenen Store-Werte mit Backend-Werten
     * Sollte beim ersten Laden der Blog-Seite aufgerufen werden
     */
    async function initialize() {
        if (isInitialized) {
            // Bereits initialisiert, aber Backend-Werte haben IMMER Priorität
            // Refresh vom Backend um sicherzustellen, dass Backend-Werte verwendet werden
            await refreshFromBackend();
            return;
        }
        
        try {
            // BACKEND FIRST: Immer frische Daten vom Backend, kein Cache
            const posts = await fetchBlogPosts({ useCache: false, forceRefresh: true });
            
            // DEBUG: Log Backend-Daten
            console.log('🔍 [blogLikesStore] DEBUG - Fetched posts from backend:', posts.length);
            if (posts.length > 0) {
                console.log('🔍 [blogLikesStore] DEBUG - First post:', {
                    id: posts[0].id || posts[0].row_number,
                    title: posts[0].title?.substring(0, 30),
                    likes: posts[0].likes,
                    likesType: typeof posts[0].likes,
                    liked: posts[0].liked,
                    likedType: typeof posts[0].liked
                });
            }
            
            if (Array.isArray(posts) && posts.length > 0) {
                const likesData = {};
                
                posts.forEach(post => {
                    const postId = post.id || post.row_number;
                    if (postId) {
                        // BACKEND-WERT IST IMMER DER INITIALE WERT
                        const backendLikesRaw = post.likes;
                        const backendLikes = backendLikesRaw !== undefined && backendLikesRaw !== null 
                            ? parseInt(String(backendLikesRaw), 10) 
                            : 0;
                        
                        // DEBUG: Log für ersten Post
                        if (postId === (posts[0]?.id || posts[0]?.row_number)) {
                            console.log('🔍 [blogLikesStore] DEBUG - Processing first post:', {
                                postId,
                                backendLikesRaw,
                                backendLikes,
                                liked: post.liked
                            });
                        }
                        
                        likesData[String(postId)] = {
                            liked: post.liked || false,
                            likes: Math.max(0, backendLikes) // Backend-Wert ist IMMER der initiale Wert
                        };
                    }
                });
                
                // DEBUG: Log Store-Daten für ersten Post
                if (posts.length > 0) {
                    const firstPostId = String(posts[0].id || posts[0].row_number);
                    console.log('✅ [blogLikesStore] DEBUG - Store data for first post:', {
                        postId: firstPostId,
                        storeData: likesData[firstPostId]
                    });
                }
                
                // BACKEND FIRST: Setze Store komplett mit Backend-Werten
                set(likesData);
                isInitialized = true;
                console.log('✅ [blogLikesStore] Initialized with backend values:', Object.keys(likesData).length, 'posts');
            } else {
                // Keine Posts: Leerer Store
                set({});
                isInitialized = true;
            }
        } catch (error) {
            console.error('❌ [blogLikesStore] Error initializing:', error);
            // Fallback: Leerer Store
            set({});
            isInitialized = true;
        }
    }
    
    /**
     * Aktualisiert Like-Status für einen Post
     * BACKEND FIRST: Wenn Backend-Wert vorhanden, hat dieser IMMER Priorität
     * Wenn Backend-Wert höher als Store-Wert → Store erhöhen auf Backend-Wert
     * Wenn Backend-Wert niedriger als Store-Wert → Store behalten (nicht verringern)
     * @param {string|number} postId - Post ID
     * @param {boolean} liked - Ob geliked
     * @param {number|null} backendLikes - Anzahl Likes vom Backend (optional, hat IMMER Priorität)
     */
    function updateLike(postId, liked, backendLikes = null) {
        const key = String(postId);
        
        update(state => {
            const current = state[key] || { liked: false, likes: 0 };
            
            let newLikes;
            
            // BACKEND FIRST: Backend-Wert hat IMMER Priorität wenn vorhanden
            if (backendLikes !== null && !isNaN(backendLikes) && backendLikes >= 0) {
                // BACKEND-WERT IST IMMER DER INITIALE WERT
                // Wenn Backend-Wert höher als Store → Store erhöhen auf Backend-Wert
                // Wenn Backend-Wert niedriger als Store → Store behalten (nicht verringern)
                newLikes = Math.max(current.likes, backendLikes);
            } else {
                // Kein Backend-Wert: Optimistic Update (nur für UI-Feedback)
                newLikes = liked 
                    ? current.likes + 1 
                    : Math.max(0, current.likes - 1);
            }
            
            return {
                ...state,
                [key]: {
                    liked: liked,
                    likes: Math.max(0, newLikes)
                }
            };
        });
    }
    
    /**
     * Like einen Post mit API-Call (KEIN Toggle - nur Like wenn likes === 0)
     * @param {string|number} postId - Post ID
     * @param {boolean} optimistic - Optimistic update (default: true)
     * @returns {Promise<object|null>} Result oder null
     */
    async function addLike(postId, optimistic = true) {
        const key = String(postId);
        const current = getLikeStatus(postId);
        
        // KEIN TOGGLE: Nur Like wenn likes === 0
        if (current.likes > 0) {
            console.log('⚠️ [blogLikesStore] Post already liked (likes > 0), skipping');
            return {
                success: false,
                error: 'Already liked',
                likes: current.likes,
                liked: true
            };
        }
        
        // Optimistic update
        if (optimistic) {
            updateLike(postId, true, 1); // Set liked=true, likes=1
        }
        
        try {
            const result = await likeBlogPost(postId, { optimistic, unlike: false });
            
            if (result && result.success) {
                // BACKEND FIRST: Backend-Wert hat IMMER Priorität
                const backendLikes = result.likes !== undefined && result.likes !== null
                    ? parseInt(result.likes, 10)
                    : null;
                
                // Update mit Backend-Wert (hat Priorität, erhöht Store wenn höher)
                updateLike(postId, true, backendLikes);
                
                return {
                    success: true,
                    likes: backendLikes !== null ? backendLikes : 1,
                    liked: true
                };
            } else {
                // Handle error response (404, etc.)
                const errorMsg = result?.error || 'API call failed';
                const statusCode = result?.statusCode;
                
                if (statusCode === 404) {
                    console.warn('⚠️ [blogLikesStore] Like webhook not available (404). Workflow may not be active.');
                }
                
                // Rollback bei Fehler
                if (optimistic) {
                    updateLike(postId, false, 0);
                }
                return {
                    success: false,
                    error: errorMsg,
                    statusCode: statusCode,
                    likes: current.likes,
                    liked: false
                };
            }
        } catch (error) {
            console.error('❌ [blogLikesStore] Error adding like:', error);
            // Rollback bei Fehler
            if (optimistic) {
                updateLike(postId, false, 0);
            }
            return {
                success: false,
                error: error.message || 'Unknown error',
                likes: current.likes,
                liked: false
            };
        }
    }
    
    /**
     * Aktualisiert Likes für alle Posts vom Backend
     * BACKEND FIRST: Backend-Wert ist IMMER der initiale Wert
     * Wenn Backend-Wert höher als Store-Wert → Store erhöhen auf Backend-Wert
     * Wenn Backend-Wert niedriger als Store-Wert → Store behalten (nicht verringern)
     * Nützlich nach Like-Operationen oder periodisch
     */
    async function refreshFromBackend() {
        try {
            // BACKEND FIRST: Immer frische Daten vom Backend, kein Cache
            const posts = await fetchBlogPosts({ useCache: false, forceRefresh: true });
            
            if (Array.isArray(posts) && posts.length > 0) {
                update(state => {
                    const newState = { ...state };
                    
                    posts.forEach(post => {
                        const postId = post.id || post.row_number;
                        if (postId) {
                            const key = String(postId);
                            const current = newState[key] || { liked: false, likes: 0 };
                            
                            // BACKEND-WERT IST IMMER DER INITIALE WERT
                            const backendLikes = post.likes !== undefined && post.likes !== null
                                ? parseInt(post.likes, 10)
                                : 0;
                            
                            // BACKEND FIRST: Backend-Wert hat Priorität
                            // Wenn Backend-Wert höher → Store erhöhen
                            // Wenn Backend-Wert niedriger → Store behalten (nicht verringern)
                            const finalLikes = Math.max(current.likes, Math.max(0, backendLikes));
                            
                            newState[key] = {
                                liked: post.liked || false,
                                likes: finalLikes
                            };
                        }
                    });
                    
                    return newState;
                });
                
                console.log('✅ [blogLikesStore] Refreshed from backend (backend values have priority)');
            }
        } catch (error) {
            console.error('❌ [blogLikesStore] Error refreshing from backend:', error);
        }
    }
    
    /**
     * Holt Like-Status für einen Post
     * @param {string|number} postId - Post ID
     * @returns {object} { liked: boolean, likes: number }
     */
    function getLikeStatus(postId) {
        let currentState = {};
        const unsubscribe = subscribe(state => {
            currentState = state;
        });
        unsubscribe();
        const key = String(postId);
        return currentState[key] || { liked: false, likes: 0 };
    }
    
    return {
        subscribe,
        initialize,
        updateLike,
        addLike,
        refreshFromBackend,
        getLikeStatus
    };
}

export const blogLikesStore = createBlogLikesStore();

/**
 * Derived Store für einzelne Post Likes
 * @param {string|number} postId - Post ID
 * @returns {object} { liked: boolean, likes: number }
 */
export function getPostLikes(postId) {
    return derived(blogLikesStore, $store => {
        const key = String(postId);
        return $store[key] || { liked: false, likes: 0 };
    });
}

