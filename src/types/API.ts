/**
 * API Types - TypeScript Schemas für API Requests/Responses
 * Single Source of Truth für API-Datenstrukturen
 */

export interface APIResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface AccountAPIResponse extends APIResponse {
    account?: Account;
    userId?: string;
    email?: string;
}

export interface MagicLinkRequest {
    email: string;
    name?: string;
    dev?: boolean;
}

export interface MagicLinkResponse extends APIResponse {
    token?: string;
    email?: string;
    expiresAt?: string;
    isDevMode?: boolean;
}

export interface MagicLinkVerifyRequest {
    token: string;
    email: string;
    clientFingerprint?: string;
    timestamp?: string;
}

export interface MagicLinkVerifyResponse extends APIResponse {
    account?: Account;
    isFirstLogin?: boolean;
    sessionId?: string;
    sessionExpires?: string;
}

export interface AccountCheckRequest {
    email: string;
    name?: string;
}

export interface AccountCheckResponse extends APIResponse {
    exists: boolean;
    account?: Account;
}

export interface AccountUpdateRequest {
    action: 'create' | 'update' | 'get' | 'delete';
    userId: string;
    email?: string;
    profile?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    dailyUsage?: {
        date: string;
        used: number;
        limit: number;
    };
    lastLogin?: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt?: string;
    author?: string;
    publishedAt: string;
    updatedAt?: string;
    tags?: string[];
    language?: string;
    image?: string;
    likes?: number;
    [key: string]: unknown;
}

export interface BlogAPIResponse extends APIResponse {
    posts?: BlogPost[];
    post?: BlogPost;
    total?: number;
    page?: number;
    limit?: number;
}

export interface AnalyticsEvent {
    type: string;
    path: string;
    client: string;
    version: string;
    timestamp: string;
    language: string;
    referrer: string;
    screen: string;
    data?: Record<string, unknown>;
}

// Import Account types
import type { Account } from './Account.js';

