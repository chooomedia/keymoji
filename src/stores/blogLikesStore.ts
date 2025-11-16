// src/stores/blogLikesStore.ts
// Store für Blog Post Likes - Best Practices nach Svelte Doc
// TypeScript Migration: v0.7.7
// WICHTIG: In .ts-Dateien KEINE Runes verwenden – klassische Svelte Stores nutzen

import { writable, get, derived, type Readable } from 'svelte/store';
import { fetchBlogPosts, likeBlogPost, type BlogPost } from '../utils/blogApi';
import type { LikeBlogPostResponse } from '../utils/blogApi';
export interface LikeStatus {
    liked: boolean;
    likes: number;
}

export interface BlogLikesState {
    [postId: string]: LikeStatus;
}

export interface AddLikeResult {
    success: boolean;
    likes: number;
    liked: boolean;
    error?: string;
    statusCode?: number;
}

export interface BlogLikesStore {
    initialize: () => Promise<void>;
    updateLike: (
        postId: string | number,
        liked: boolean,
        backendLikes?: number | null
    ) => void;
    addLike: (
        postId: string | number,
        optimistic?: boolean
    ) => Promise<AddLikeResult>;
    refreshFromBackend: () => Promise<void>;
    getLikeStatus: (postId: string | number) => LikeStatus;
}

// Interner State als klassischer Svelte-Store
const blogLikesState = writable<BlogLikesState>({});
let isInitialized = false;

async function initialize(): Promise<void> {
    if (isInitialized) {
        await refreshFromBackend();
        return;
    }

    try {
        const posts = await fetchBlogPosts({
            useCache: false,
            forceRefresh: true
        });

        console.log(
            '🔍 [blogLikesStore] DEBUG - Fetched posts from backend:',
            posts.length
        );
        if (posts.length > 0 && posts[0]) {
            const firstPost = posts[0];
            console.log('🔍 [blogLikesStore] DEBUG - First post:', {
                id: firstPost.id || firstPost.row_number,
                title: firstPost.title?.substring(0, 30),
                likes: firstPost.likes,
                likesType: typeof firstPost.likes,
                liked: firstPost.liked,
                likedType: typeof firstPost.liked
            });
        }

        if (Array.isArray(posts) && posts.length > 0) {
            const likesData: BlogLikesState = {};

            posts.forEach((post: BlogPost) => {
                const postId = post.id || post.row_number;
                if (postId) {
                    const backendLikesRaw = post.likes;
                    const backendLikes =
                        backendLikesRaw !== undefined &&
                        backendLikesRaw !== null
                            ? parseInt(String(backendLikesRaw), 10)
                            : 0;

                    const firstPost = posts[0];
                    if (
                        firstPost &&
                        postId === (firstPost.id || firstPost.row_number)
                    ) {
                        console.log(
                            '🔍 [blogLikesStore] DEBUG - Processing first post:',
                            {
                                postId,
                                backendLikesRaw,
                                backendLikes,
                                liked: post.liked
                            }
                        );
                    }

                    likesData[String(postId)] = {
                        liked: post.liked || false,
                        likes: Math.max(0, backendLikes) // Backend-Wert ist IMMER der initiale Wert
                    };
                }
            });

            if (posts.length > 0 && posts[0]) {
                const firstPost = posts[0];
                const firstPostId = String(
                    firstPost.id || firstPost.row_number
                );
                console.log(
                    '✅ [blogLikesStore] DEBUG - Store data for first post:',
                    {
                        postId: firstPostId,
                        storeData: likesData[firstPostId]
                    }
                );
            }

            blogLikesState.set(likesData);
            isInitialized = true;
            console.log(
                '✅ [blogLikesStore] Initialized with backend values:',
                Object.keys(likesData).length,
                'posts'
            );
        } else {
            blogLikesState.set({});
            isInitialized = true;
        }
    } catch (error) {
        console.error('❌ [blogLikesStore] Error initializing:', error);
        blogLikesState.set({});
        isInitialized = true;
    }
}

function updateLike(
    postId: string | number,
    liked: boolean,
    backendLikes: number | null = null
): void {
    const key = String(postId);
    const currentState = get(blogLikesState);
    const current = currentState[key] || { liked: false, likes: 0 };

    let newLikes: number;

    if (backendLikes !== null && !isNaN(backendLikes) && backendLikes >= 0) {
        newLikes = Math.max(current.likes, backendLikes);
    } else {
        newLikes = liked ? current.likes + 1 : Math.max(0, current.likes - 1);
    }

    blogLikesState.update(state => ({
        ...state,
        [key]: {
            liked: liked,
            likes: Math.max(0, newLikes)
        }
    }));
}

async function addLike(
    postId: string | number,
    optimistic: boolean = true
): Promise<AddLikeResult> {
    const current = getLikeStatus(postId);

    if (current.likes > 0) {
        console.log(
            '⚠️ [blogLikesStore] Post already liked (likes > 0), skipping'
        );
        return {
            success: false,
            error: 'Already liked',
            likes: current.likes,
            liked: true
        };
    }

    if (optimistic) {
        updateLike(postId, true, 1); // Set liked=true, likes=1
    }

    try {
        const result: LikeBlogPostResponse | null = await likeBlogPost(postId, {
            optimistic,
            unlike: false
        });

        if (result !== null && result.success) {
            const backendLikes =
                result.likes !== undefined && result.likes !== null
                    ? parseInt(String(result.likes), 10)
                    : null;

            updateLike(postId, true, backendLikes);

            return {
                success: true,
                likes: backendLikes !== null ? backendLikes : 1,
                liked: true
            };
        } else {
            const errorMsg = result?.error || 'API call failed';
            const statusCode = result?.statusCode;

            if (statusCode === 404) {
                console.warn(
                    '⚠️ [blogLikesStore] Like webhook not available (404). Workflow may not be active.'
                );
            }

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
        const err = error as Error;
        console.error('❌ [blogLikesStore] Error adding like:', error);
        if (optimistic) {
            updateLike(postId, false, 0);
        }
        return {
            success: false,
            error: err.message || 'Unknown error',
            likes: current.likes,
            liked: false
        };
    }
}

async function refreshFromBackend(): Promise<void> {
    try {
        const posts = await fetchBlogPosts({
            useCache: false,
            forceRefresh: true
        });

        if (Array.isArray(posts) && posts.length > 0) {
            blogLikesState.update(currentState => {
                const nextState: BlogLikesState = { ...currentState };

                posts.forEach((post: BlogPost) => {
                    const postId = post.id || post.row_number;
                    if (postId) {
                        const key = String(postId);
                        const current = nextState[key] || {
                            liked: false,
                            likes: 0
                        };

                        const backendLikes =
                            post.likes !== undefined && post.likes !== null
                                ? parseInt(String(post.likes), 10)
                                : 0;

                        const finalLikes = Math.max(
                            current.likes,
                            Math.max(0, backendLikes)
                        );

                        nextState[key] = {
                            liked: post.liked || false,
                            likes: finalLikes
                        };
                    }
                });

                console.log(
                    '✅ [blogLikesStore] Refreshed from backend (backend values have priority)'
                );

                return nextState;
            });
        }
    } catch (error) {
        console.error(
            '❌ [blogLikesStore] Error refreshing from backend:',
            error
        );
    }
}

function getLikeStatus(postId: string | number): LikeStatus {
    const key = String(postId);
    const state = get(blogLikesState);
    return state[key] || { liked: false, likes: 0 };
}

export const blogLikesStore: BlogLikesStore = {
    initialize,
    updateLike,
    addLike,
    refreshFromBackend,
    getLikeStatus
};

export function getPostLikes(postId: string | number): Readable<LikeStatus> {
    const key = String(postId);
    return derived(blogLikesState, state => {
        return state[key] || { liked: false, likes: 0 };
    });
}

