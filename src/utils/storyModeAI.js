// src/utils/storyModeAI.js
/**
 * Story Mode AI Integration
 * Supports multiple AI providers: OpenAI, Google Gemini, Mistral, Custom
 * 
 * Security: User provides their own API keys
 * Privacy: API keys stored encrypted in backend
 * Intelligence: AI generates emojis ONLY from emojisArray.json
 */

import emojisData from '../../public/emojisArray.json';
import { storageHelpers, STORAGE_KEYS } from '../config/storage.js';

const emojis = emojisData.emojis;

/**
 * Get available emoji list as a formatted string for AI prompt
 */
function getAvailableEmojisForPrompt() {
    // Sample first 100 emojis to keep prompt manageable
    const emojiSample = emojis.slice(0, 100);
    return emojiSample.join(' ');
}

/**
 * Build AI prompt for emoji generation
 */
function buildPrompt(text, emojiCount, provider) {
    const emojiList = getAvailableEmojisForPrompt();
    
    const basePrompt = `You are an emoji password generator. Convert the following text into EXACTLY ${emojiCount} emojis.

Rules:
1. Output EXACTLY ${emojiCount} emojis, no more, no less
2. Use ONLY emojis from this list: ${emojiList}...
3. Choose emojis that semantically match the words/meaning in the text
4. Separate emojis with single spaces
5. NO text, NO explanations, ONLY emojis
6. Order matters - follow the text flow
7. Each emoji should be unique (no duplicates)

Text to convert: "${text}"

Output format: emoji emoji emoji (exactly ${emojiCount} emojis separated by spaces)`;

    // Provider-specific prompt adjustments
    if (provider === 'gemini') {
        return basePrompt + '\n\nRespond with only the emojis, nothing else.';
    }
    
    return basePrompt;
}

/**
 * Validate generated emojis
 */
function validateGeneratedEmojis(response, emojiCount) {
    // Extract emojis from response
    const emojiRegex = /[\p{Emoji}]/gu;
    const matches = response.match(emojiRegex) || [];
    
    // Filter to only valid emojis from our list
    const validEmojis = matches.filter(emoji => emojis.includes(emoji));
    
    // Ensure exact count
    if (validEmojis.length < emojiCount) {
        // Pad with random emojis if needed
        while (validEmojis.length < emojiCount) {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            if (!validEmojis.includes(randomEmoji)) {
                validEmojis.push(randomEmoji);
            }
        }
    }
    
    // Remove duplicates and ensure exact count
    const uniqueEmojis = [...new Set(validEmojis)];
    return uniqueEmojis.slice(0, emojiCount);
}

/**
 * Get default model for provider (Best Practice: Auto-Selection)
 */
function getDefaultModel(provider, tier = 'free') {
    const models = {
        openai: tier === 'pro' ? 'gpt-4o-mini' : 'gpt-3.5-turbo',
        gemini: tier === 'pro' ? 'gemini-1.5-flash' : 'gemini-1.5-flash',
        mistral: tier === 'pro' ? 'mistral-small' : 'mistral-tiny',
        claude: tier === 'pro' ? 'claude-3-haiku-20240307' : 'claude-3-haiku-20240307',
        custom: '' // No default for custom
    };
    return models[provider] || 'gpt-3.5-turbo';
}

/**
 * Call OpenAI API
 */
async function callOpenAI(apiKey, prompt, model, maxTokens, temperature) {
    const finalModel = model || 'gpt-3.5-turbo';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: finalModel,
            messages: [
                { role: 'system', content: 'You are an emoji generator. Respond ONLY with emojis, no text.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: maxTokens || 150,
            temperature: temperature || 0.7
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

/**
 * Call Claude API (Anthropic)
 */
async function callClaude(apiKey, prompt, model, maxTokens, temperature) {
    const finalModel = model || 'claude-3-haiku-20240307';
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: finalModel,
            max_tokens: maxTokens || 150,
            temperature: temperature || 0.7,
            messages: [
                { 
                    role: 'user', 
                    content: `You are an emoji generator. ${prompt}\n\nRespond ONLY with emojis, no explanations.` 
                }
            ]
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude API error');
    }
    
    const data = await response.json();
    return data.content[0]?.text || '';
}

/**
 * Call Google Gemini API
 */
async function callGemini(apiKey, prompt, model, maxTokens, temperature) {
    const modelName = model || 'gemini-1.5-flash';
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: temperature || 0.7,
                    maxOutputTokens: maxTokens || 150
                }
            })
        }
    );
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API error');
    }
    
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
}

/**
 * Call Mistral API
 */
async function callMistral(apiKey, prompt, model, maxTokens, temperature) {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model || 'mistral-tiny',
            messages: [
                { role: 'system', content: 'You are an emoji generator. Respond ONLY with emojis.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: maxTokens || 150,
            temperature: temperature || 0.7
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Mistral API error');
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

/**
 * Call Custom API
 * Supports different endpoint formats and response structures
 */
async function callCustomAPI(config) {
    const { 
        apiUrl, 
        apiKey, 
        prompt, 
        model, 
        maxTokens, 
        temperature,
        endpoint = '/v1/chat/completions', // Default endpoint
        format = 'openai' // 'openai', 'claude', 'raw'
    } = config;
    
    // Build full URL
    const fullUrl = apiUrl.endsWith('/') ? apiUrl + endpoint.replace(/^\//, '') : apiUrl + endpoint;
    
    // Build request body based on format
    let body = {};
    
    switch (format) {
        case 'openai':
            body = {
                model: model || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are an emoji generator. Respond ONLY with emojis.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: maxTokens || 150,
                temperature: temperature || 0.7
            };
            break;
        
        case 'claude':
            body = {
                model: model || 'claude-3-haiku-20240307',
                max_tokens: maxTokens || 150,
                temperature: temperature || 0.7,
                messages: [
                    { role: 'user', content: `You are an emoji generator. ${prompt}\n\nRespond ONLY with emojis.` }
                ]
            };
            break;
        
        case 'raw':
        default:
            body = {
                prompt,
                model,
                max_tokens: maxTokens,
                temperature
            };
    }
    
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Custom API error');
    }
    
    const data = await response.json();
    
    // Try common response formats
    return data.choices?.[0]?.message?.content || // OpenAI format
           data.content?.[0]?.text ||              // Claude format
           data.response || 
           data.text || 
           data.content || 
           data.emojis || 
           '';
}

/**
 * Get cache key for story generation
 */
function getCacheKey(text, emojiCount, provider, model) {
    const normalized = text.toLowerCase().trim();
    return `story_${provider}_${model}_${emojiCount}_${normalized}`;
}

/**
 * Get cached story result
 */
function getCachedStory(text, emojiCount, provider, model) {
    try {
        const cacheKey = getCacheKey(text, emojiCount, provider, model);
        const cached = storageHelpers.get(`story_cache_${cacheKey}`);
        
        if (cached && cached.emojis && cached.timestamp) {
            // Cache valid for 7 days
            const cacheAge = Date.now() - cached.timestamp;
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
            
            if (cacheAge < maxAge) {
                console.log('✅ Story cache hit:', cacheKey);
                return cached.emojis;
            }
        }
    } catch (error) {
        console.warn('⚠️ Cache read error:', error);
    }
    
    return null;
}

/**
 * Cache story result
 */
function cacheStoryResult(text, emojiCount, provider, model, emojis) {
    try {
        const cacheKey = getCacheKey(text, emojiCount, provider, model);
        storageHelpers.set(`story_cache_${cacheKey}`, {
            emojis,
            timestamp: Date.now(),
            text,
            emojiCount,
            provider,
            model
        });
        console.log('💾 Story cached:', cacheKey);
    } catch (error) {
        console.warn('⚠️ Cache write error:', error);
    }
}

/**
 * Main function: Generate story emojis using AI
 * 
 * @param {string} text - Input text to convert to emojis
 * @param {number} emojiCount - Number of emojis to generate
 * @param {object} storyModeConfig - Story mode configuration from settings
 * @returns {Promise<string[]>} - Array of generated emojis
 */
export async function generateStoryEmojis(text, emojiCount, storyModeConfig) {
    if (!text || !text.trim()) {
        throw new Error('Text is required for story generation');
    }
    
    if (!storyModeConfig || !storyModeConfig.enabled) {
        throw new Error('Story mode is not enabled');
    }
    
    if (!storyModeConfig.apiKey) {
        throw new Error('API key is required for story mode');
    }
    
    const {
        provider,
        apiKey,
        customApiUrl,
        customEndpoint,
        customFormat,
        customModel,
        model,
        maxTokens,
        temperature,
        cacheResults,
        tier
    } = storyModeConfig;
    
    // Check cache first
    if (cacheResults !== false) {
        const cached = getCachedStory(text, emojiCount, provider, model);
        if (cached) {
            return cached;
        }
    }
    
    try {
        console.log(`🤖 Generating story emojis with ${provider}...`);
        
        const prompt = buildPrompt(text, emojiCount, provider);
        let aiResponse = '';
        
        // Auto-select model if not provided (Best Practice)
        // Priority: customModel (for custom API) > model > auto-default
        let finalModel = model;
        
        if (provider === 'custom' && customModel) {
            finalModel = customModel;
            console.log(`🎯 Using custom model: ${finalModel}`);
        } else if (!finalModel) {
            finalModel = getDefaultModel(provider, tier);
            console.log(`🤖 Auto-selected model: ${finalModel}`);
        } else {
            console.log(`🎯 Using configured model: ${finalModel}`);
        }
        
        // Call appropriate AI provider
        switch (provider) {
            case 'openai':
                aiResponse = await callOpenAI(apiKey, prompt, finalModel, maxTokens, temperature);
                break;
            
            case 'gemini':
                aiResponse = await callGemini(apiKey, prompt, finalModel, maxTokens, temperature);
                break;
            
            case 'mistral':
                aiResponse = await callMistral(apiKey, prompt, finalModel, maxTokens, temperature);
                break;
            
            case 'claude':
                aiResponse = await callClaude(apiKey, prompt, finalModel, maxTokens, temperature);
                break;
            
            case 'custom':
                if (!customApiUrl) {
                    throw new Error('Custom API URL is required');
                }
                aiResponse = await callCustomAPI({
                    apiUrl: customApiUrl,
                    apiKey,
                    prompt,
                    model: finalModel,
                    maxTokens,
                    temperature,
                    endpoint: customEndpoint || '/v1/chat/completions',
                    format: customFormat || 'openai'
                });
                break;
            
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
        
        // Validate and filter emojis
        const generatedEmojis = validateGeneratedEmojis(aiResponse, emojiCount);
        
        console.log(`✅ Generated ${generatedEmojis.length} valid emojis`);
        
        // Cache result
        if (cacheResults !== false) {
            cacheStoryResult(text, emojiCount, provider, model, generatedEmojis);
        }
        
        return generatedEmojis;
        
    } catch (error) {
        console.error('❌ Story generation error:', error);
        throw error;
    }
}

/**
 * Clear story mode cache
 */
export function clearStoryCache() {
    try {
        const keys = Object.keys(localStorage);
        const storyCacheKeys = keys.filter(key => key.startsWith('story_cache_'));
        
        storyCacheKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log(`🧹 Cleared ${storyCacheKeys.length} story cache entries`);
        return storyCacheKeys.length;
    } catch (error) {
        console.warn('⚠️ Failed to clear story cache:', error);
        return 0;
    }
}

/**
 * Get cache statistics
 */
export function getStoryCacheStats() {
    try {
        const keys = Object.keys(localStorage);
        const storyCacheKeys = keys.filter(key => key.startsWith('story_cache_'));
        
        let totalSize = 0;
        const stats = {
            count: storyCacheKeys.length,
            providers: {},
            oldestEntry: null,
            newestEntry: null
        };
        
        storyCacheKeys.forEach(key => {
            const cached = JSON.parse(localStorage.getItem(key));
            if (cached) {
                totalSize += JSON.stringify(cached).length;
                
                const provider = cached.provider || 'unknown';
                stats.providers[provider] = (stats.providers[provider] || 0) + 1;
                
                if (!stats.oldestEntry || cached.timestamp < stats.oldestEntry) {
                    stats.oldestEntry = cached.timestamp;
                }
                if (!stats.newestEntry || cached.timestamp > stats.newestEntry) {
                    stats.newestEntry = cached.timestamp;
                }
            }
        });
        
        stats.totalSize = totalSize;
        stats.totalSizeKB = (totalSize / 1024).toFixed(2);
        
        return stats;
    } catch (error) {
        console.warn('⚠️ Failed to get cache stats:', error);
        return null;
    }
}

/**
 * Test AI provider connection (without generating emojis)
 */
export async function testAIProvider(storyModeConfig) {
    const testPrompt = 'Test connection: respond with a single emoji';
    
    try {
        const { provider, apiKey, customApiUrl, model } = storyModeConfig;
        
        let response = '';
        
        switch (provider) {
            case 'openai':
                response = await callOpenAI(apiKey, testPrompt, model, 10, 0.5);
                break;
            
            case 'gemini':
                response = await callGemini(apiKey, testPrompt, model, 10, 0.5);
                break;
            
            case 'mistral':
                response = await callMistral(apiKey, testPrompt, model, 10, 0.5);
                break;
            
            case 'custom':
                response = await callCustomAPI(customApiUrl, apiKey, testPrompt, model, 10, 0.5);
                break;
            
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
        
        return {
            success: true,
            provider,
            response: response.substring(0, 100) // First 100 chars
        };
        
    } catch (error) {
        return {
            success: false,
            provider: storyModeConfig.provider,
            error: error.message
        };
    }
}

/**
 * Get provider info and recommended settings
 */
export function getProviderInfo(provider) {
    const info = {
        openai: {
            name: 'OpenAI',
            models: {
                free: ['gpt-3.5-turbo'],
                pro: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo']
            },
            defaultModel: { free: 'gpt-3.5-turbo', pro: 'gpt-4o-mini' },
            apiKeyPrefix: 'sk-',
            docsUrl: 'https://platform.openai.com/docs'
        },
        gemini: {
            name: 'Google Gemini',
            models: {
                free: ['gemini-1.5-flash'],
                pro: ['gemini-1.5-flash', 'gemini-1.5-pro']
            },
            defaultModel: { free: 'gemini-1.5-flash', pro: 'gemini-1.5-flash' },
            apiKeyPrefix: 'AIza',
            docsUrl: 'https://ai.google.dev/docs'
        },
        mistral: {
            name: 'Mistral AI',
            models: {
                free: ['mistral-tiny'],
                pro: ['mistral-small', 'mistral-medium', 'mistral-large']
            },
            defaultModel: { free: 'mistral-tiny', pro: 'mistral-small' },
            apiKeyPrefix: '',
            docsUrl: 'https://docs.mistral.ai'
        },
        claude: {
            name: 'Anthropic Claude',
            models: {
                free: ['claude-3-haiku-20240307'],
                pro: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229']
            },
            defaultModel: { free: 'claude-3-haiku-20240307', pro: 'claude-3-haiku-20240307' },
            apiKeyPrefix: 'sk-ant-',
            docsUrl: 'https://docs.anthropic.com'
        },
        custom: {
            name: 'Custom API',
            models: { free: [], pro: [] },
            defaultModel: { free: '', pro: '' },
            apiKeyPrefix: '',
            docsUrl: ''
        }
    };
    
    return info[provider] || info.openai;
}

export default {
    generateStoryEmojis,
    clearStoryCache,
    getStoryCacheStats,
    testAIProvider,
    getDefaultModel,
    getProviderInfo
};

