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
 * Timeout wrapper for fetch requests (Best Practice)
 * Prevents hanging requests and provides better UX
 */
async function fetchWithTimeout(url, options, timeout = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - API took too long to respond');
        }
        throw error;
    }
}

/**
 * Get available emoji list as a formatted string for AI prompt
 * Only include valid emojis from our curated list
 */
function getAvailableEmojisForPrompt() {
    // Sample diverse emojis (every 10th) to keep prompt manageable
    // This gives AI a representative sample while staying under token limits
    const emojiSample = emojis
        .filter((_, index) => index % 10 === 0)
        .slice(0, 100);
    return emojiSample.join(' ');
}

/**
 * Build AI prompt for emoji generation
 * Best Practice: Clear, specific instructions optimized per provider
 */
function buildPrompt(text, emojiCount, provider) {
    const emojiList = getAvailableEmojisForPrompt();

    const basePrompt = `You are an emoji password generator. Convert the following text into EXACTLY ${emojiCount} emojis.

STRICT RULES:
1. Output EXACTLY ${emojiCount} emojis (no more, no less)
2. Use ONLY emojis from this list: ${emojiList}
3. Choose emojis that semantically match the text meaning
4. Separate emojis with single spaces
5. NO text, NO explanations, NO punctuation - ONLY EMOJIS
6. Each emoji should be unique (no duplicates)

Input text: "${text}"

Required output: ${emojiCount} emojis separated by spaces`;

    // Provider-specific optimizations (based on official docs & testing)
    if (provider === 'gemini') {
        // Gemini: Works better with explicit examples (Google AI Best Practice)
        return (
            basePrompt +
            `\n\nExample output format: ${emojis
                .slice(0, emojiCount)
                .join(' ')}\n\nYour turn - generate ${emojiCount} emojis:`
        );
    }

    if (provider === 'claude') {
        // Claude: Prefers concise, direct instructions (Anthropic Best Practice)
        return basePrompt + '\n\nGenerate the emojis now (emojis only):';
    }

    if (provider === 'mistral') {
        // Mistral: Clear structure (Mistral Best Practice)
        return basePrompt + '\n\nOutput (emojis only):';
    }

    // OpenAI: Straightforward prompt works best
    return basePrompt + '\n\nEmojis:';
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
            const randomEmoji =
                emojis[Math.floor(Math.random() * emojis.length)];
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
/**
 * Get default model for each provider based on tier
 * Uses most stable, widely available models as defaults
 */
function getDefaultModel(provider, tier = 'free') {
    const models = {
        openai: tier === 'pro' ? 'gpt-4o-mini' : 'gpt-3.5-turbo',
        gemini: tier === 'pro' ? 'gemini-pro' : 'gemini-pro', // Most stable model
        mistral: tier === 'pro' ? 'mistral-small' : 'mistral-tiny',
        claude:
            tier === 'pro'
                ? 'claude-3-haiku-20240307'
                : 'claude-3-haiku-20240307',
        custom: '' // No default for custom
    };
    return models[provider] || 'gpt-3.5-turbo';
}

/**
 * Call OpenAI API with fallback models
 * Official Docs: https://platform.openai.com/docs/api-reference/chat/create
 * Best Practices:
 * - Always set stream: false for non-streaming requests
 * - Use n: 1 to get single response
 * - Try fallback models if primary fails
 */
async function callOpenAI(apiKey, prompt, model, maxTokens, temperature) {
    const modelsToTry = model
        ? [model, 'gpt-3.5-turbo', 'gpt-4o-mini']
        : ['gpt-3.5-turbo', 'gpt-4o-mini'];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🔄 Trying OpenAI model: ${modelName}`);
            return await callOpenAIWithModel(
                apiKey,
                prompt,
                modelName,
                maxTokens,
                temperature
            );
        } catch (error) {
            console.warn(`⚠️ OpenAI model ${modelName} failed:`, error.message);
            lastError = error;
        }
    }

    throw new Error(lastError?.message || 'All OpenAI models failed');
}

/**
 * Internal: Call OpenAI with specific model
 */
async function callOpenAIWithModel(
    apiKey,
    prompt,
    model,
    maxTokens,
    temperature
) {
    const finalModel = model;

    const response = await fetchWithTimeout(
        'https://api.openai.com/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: finalModel,
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an emoji generator. Respond ONLY with emojis, no text.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: maxTokens || 150,
                temperature: temperature || 0.7,
                n: 1, // Single response (Best Practice)
                stream: false, // No streaming (Best Practice)
                presence_penalty: 0.0, // No penalty for repetition
                frequency_penalty: 0.3 // Slight penalty for frequency (diversity)
            })
        },
        30000 // 30 second timeout
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.error?.message || `OpenAI API error: ${response.status}`
        );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

/**
 * Call Claude API (Anthropic) with fallback models
 * Official Docs: https://docs.anthropic.com/claude/reference/messages_post
 * Best Practices:
 * - Always include anthropic-version header (required)
 * - Use system message for instructions (preferred)
 * - max_tokens is REQUIRED (not optional)
 * - Try fallback models for maximum compatibility
 */
async function callClaude(apiKey, prompt, model, maxTokens, temperature) {
    const modelsToTry = model
        ? [model, 'claude-3-haiku-20240307', 'claude-3-5-sonnet-20241022']
        : ['claude-3-haiku-20240307', 'claude-3-5-sonnet-20241022'];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🔄 Trying Claude model: ${modelName}`);
            return await callClaudeWithModel(
                apiKey,
                prompt,
                modelName,
                maxTokens,
                temperature
            );
        } catch (error) {
            console.warn(`⚠️ Claude model ${modelName} failed:`, error.message);
            lastError = error;
        }
    }

    throw new Error(lastError?.message || 'All Claude models failed');
}

/**
 * Internal: Call Claude with specific model
 */
async function callClaudeWithModel(
    apiKey,
    prompt,
    model,
    maxTokens,
    temperature
) {
    const finalModel = model;

    const response = await fetchWithTimeout(
        'https://api.anthropic.com/v1/messages',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01' // Required header (Best Practice)
            },
            body: JSON.stringify({
                model: finalModel,
                max_tokens: maxTokens || 150, // REQUIRED field
                temperature: temperature || 0.7,
                system: 'You are an emoji generator. Respond ONLY with emojis, no explanations.', // System message (Best Practice)
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        },
        30000 // 30 second timeout
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.error?.message ||
                error.message ||
                `Claude API error: ${response.status}`
        );
    }

    const data = await response.json();
    return data.content[0]?.text || '';
}

/**
 * Call Google Gemini API with automatic fallback
 * Official Docs: https://ai.google.dev/gemini-api/docs/text-generation
 * Best Practices:
 * - Try multiple model names (API keys have different model access)
 * - Use v1beta for latest models
 * - API key in URL parameter (not in headers)
 * - Use generationConfig for all parameters
 * - Set candidateCount: 1 for single response
 * - Safety settings set to BLOCK_NONE for emoji generation
 */
async function callGemini(apiKey, prompt, model, maxTokens, temperature) {
    // ROBUST FALLBACK: Try different auth methods, versions, AND models
    // Official Docs: https://ai.google.dev/gemini-api/docs/api-key
    const attempts = [
        // Try user's model with both auth methods
        ...(model
            ? [
                  { version: 'v1beta', model: model, authMethod: 'header' },
                  { version: 'v1beta', model: model, authMethod: 'url' }
              ]
            : []),
        // Try newest models (gemini-2.5-flash)
        { version: 'v1beta', model: 'gemini-2.5-flash', authMethod: 'header' },
        { version: 'v1beta', model: 'gemini-2.5-flash', authMethod: 'url' },
        // Try gemini-1.5-flash
        { version: 'v1beta', model: 'gemini-1.5-flash', authMethod: 'header' },
        { version: 'v1beta', model: 'gemini-1.5-flash', authMethod: 'url' },
        // Try stable gemini-pro
        { version: 'v1beta', model: 'gemini-pro', authMethod: 'header' },
        { version: 'v1beta', model: 'gemini-pro', authMethod: 'url' },
        { version: 'v1', model: 'gemini-pro', authMethod: 'header' },
        { version: 'v1', model: 'gemini-pro', authMethod: 'url' }
    ];

    let lastError = null;

    // Try each combination (Best Practice: Maximum compatibility)
    for (const attempt of attempts) {
        try {
            console.log(
                `🔄 Gemini ${attempt.version}/${attempt.model} (${attempt.authMethod})`
            );
            return await callGeminiWithVersion(
                apiKey,
                prompt,
                attempt.version,
                attempt.model,
                maxTokens,
                temperature,
                attempt.authMethod
            );
        } catch (error) {
            console.warn(
                `⚠️ ${attempt.version}/${attempt.model} (${
                    attempt.authMethod
                }): ${error.message?.substring(0, 80)}`
            );
            lastError = error;
            // Continue to next attempt
        }
    }

    // All attempts failed - provide actionable error
    throw new Error(
        'Gemini API nicht verfügbar. Bitte aktiviere die API unter: ' +
            'https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com'
    );
}

/**
 * Internal: Call Gemini with specific API version, model, and auth method
 */
async function callGeminiWithVersion(
    apiKey,
    prompt,
    apiVersion,
    modelName,
    maxTokens,
    temperature,
    authMethod = 'url'
) {
    // Build URL and headers based on auth method (Official Docs)
    const url =
        authMethod === 'url'
            ? `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${apiKey}`
            : `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent`;

    const headers =
        authMethod === 'header'
            ? {
                  'Content-Type': 'application/json',
                  'x-goog-api-key': apiKey // Official recommended method
              }
            : {
                  'Content-Type': 'application/json'
              };

    const response = await fetchWithTimeout(
        url,
        {
            method: 'POST',
            headers,
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: temperature || 0.7,
                    maxOutputTokens: maxTokens || 150,
                    candidateCount: 1, // Single response (Best Practice)
                    topP: 0.95,
                    topK: 40
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_NONE' // Emojis are safe
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_NONE'
                    }
                ]
            })
        },
        30000 // 30 second timeout
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.error?.message || `Gemini API error: ${response.status}`
        );
    }

    const data = await response.json();

    // Handle blocked responses
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        console.warn('⚠️ Gemini safety filter triggered, using fallback');
        return ''; // Will trigger fallback in validateGeneratedEmojis
    }

    return data.candidates[0]?.content?.parts[0]?.text || '';
}

/**
 * Call Mistral API with fallback models
 * Official Docs: https://docs.mistral.ai/api/
 * Best Practices:
 * - Use OpenAI-compatible format
 * - Set safe_prompt: false for creative content
 * - Try fallback models for maximum compatibility
 */
async function callMistral(apiKey, prompt, model, maxTokens, temperature) {
    const modelsToTry = model
        ? [model, 'mistral-tiny', 'mistral-small']
        : ['mistral-tiny', 'mistral-small'];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🔄 Trying Mistral model: ${modelName}`);
            return await callMistralWithModel(
                apiKey,
                prompt,
                modelName,
                maxTokens,
                temperature
            );
        } catch (error) {
            console.warn(
                `⚠️ Mistral model ${modelName} failed:`,
                error.message
            );
            lastError = error;
        }
    }

    throw new Error(lastError?.message || 'All Mistral models failed');
}

/**
 * Internal: Call Mistral with specific model
 */
async function callMistralWithModel(
    apiKey,
    prompt,
    model,
    maxTokens,
    temperature
) {
    const response = await fetchWithTimeout(
        'https://api.mistral.ai/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json'
            },
            body: JSON.stringify({
                model: model || 'mistral-tiny',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an emoji generator. Respond ONLY with emojis.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: maxTokens || 150,
                temperature: temperature || 0.7,
                top_p: 0.95, // Nucleus sampling (Best Practice)
                safe_prompt: false, // No content filtering for emojis (Best Practice)
                stream: false // No streaming (Best Practice)
            })
        },
        30000 // 30 second timeout
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.message ||
                error.error?.message ||
                `Mistral API error: ${response.status}`
        );
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
    const fullUrl = apiUrl.endsWith('/')
        ? apiUrl + endpoint.replace(/^\//, '')
        : apiUrl + endpoint;

    // Build request body based on format
    let body = {};

    switch (format) {
        case 'openai':
            body = {
                model: model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an emoji generator. Respond ONLY with emojis.'
                    },
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
                    {
                        role: 'user',
                        content: `You are an emoji generator. ${prompt}\n\nRespond ONLY with emojis.`
                    }
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

    const response = await fetchWithTimeout(
        fullUrl,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        },
        30000 // 30 second timeout
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Custom API error');
    }

    const data = await response.json();

    // Try common response formats
    return (
        data.choices?.[0]?.message?.content || // OpenAI format
        data.content?.[0]?.text || // Claude format
        data.response ||
        data.text ||
        data.content ||
        data.emojis ||
        ''
    );
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
        // VALIDATION: Only cache valid emoji arrays
        if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
            console.warn('⚠️ Skipping cache: Invalid emoji data', emojis);
            return;
        }

        const cacheKey = getCacheKey(text, emojiCount, provider, model);
        storageHelpers.set(`story_cache_${cacheKey}`, {
            emojis,
            timestamp: Date.now(),
            text,
            emojiCount,
            provider,
            model
        });
        console.log('💾 Story cached:', cacheKey, '→', emojis.length, 'emojis');
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
    console.log('🚀 generateStoryEmojis called:', {
        hasText: !!text,
        textLength: text?.length,
        emojiCount,
        hasConfig: !!storyModeConfig,
        provider: storyModeConfig?.provider,
        hasApiKey: !!storyModeConfig?.apiKey
    });

    if (!text || !text.trim()) {
        throw new Error('Text is required for story generation');
    }

    if (!storyModeConfig) {
        throw new Error('Story mode configuration is required');
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
        // VALIDATION: Ensure cached result is valid array with emojis
        if (cached && Array.isArray(cached) && cached.length > 0) {
            console.log(
                '✅ Using valid cached story:',
                cached.length,
                'emojis'
            );
            return {
                success: true,
                emojis: cached,
                cached: true,
                provider,
                model: model || getDefaultModel(provider, tier)
            };
        } else if (cached) {
            console.warn('⚠️ Invalid cached story, regenerating...', cached);
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
                aiResponse = await callOpenAI(
                    apiKey,
                    prompt,
                    finalModel,
                    maxTokens,
                    temperature
                );
                break;

            case 'gemini':
                aiResponse = await callGemini(
                    apiKey,
                    prompt,
                    finalModel,
                    maxTokens,
                    temperature
                );
                break;

            case 'mistral':
                aiResponse = await callMistral(
                    apiKey,
                    prompt,
                    finalModel,
                    maxTokens,
                    temperature
                );
                break;

            case 'claude':
                aiResponse = await callClaude(
                    apiKey,
                    prompt,
                    finalModel,
                    maxTokens,
                    temperature
                );
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
            cacheStoryResult(
                text,
                emojiCount,
                provider,
                finalModel,
                generatedEmojis
            );
        }

        return {
            success: true,
            emojis: generatedEmojis,
            cached: false,
            provider,
            model: finalModel
        };
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
        const storyCacheKeys = keys.filter(key =>
            key.startsWith('story_cache_')
        );

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
        const storyCacheKeys = keys.filter(key =>
            key.startsWith('story_cache_')
        );

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
                stats.providers[provider] =
                    (stats.providers[provider] || 0) + 1;

                if (
                    !stats.oldestEntry ||
                    cached.timestamp < stats.oldestEntry
                ) {
                    stats.oldestEntry = cached.timestamp;
                }
                if (
                    !stats.newestEntry ||
                    cached.timestamp > stats.newestEntry
                ) {
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
        const {
            provider,
            apiKey,
            customApiUrl,
            customEndpoint,
            customFormat,
            customModel,
            model
        } = storyModeConfig;

        let response = '';
        let usedModel = model || getDefaultModel(provider, 'free');

        switch (provider) {
            case 'openai':
                response = await callOpenAI(
                    apiKey,
                    testPrompt,
                    usedModel,
                    10,
                    0.5
                );
                break;

            case 'gemini':
                response = await callGemini(
                    apiKey,
                    testPrompt,
                    usedModel,
                    10,
                    0.5
                );
                break;

            case 'mistral':
                response = await callMistral(
                    apiKey,
                    testPrompt,
                    usedModel,
                    10,
                    0.5
                );
                break;

            case 'claude':
                usedModel = customModel || model || 'claude-3-haiku-20240307';
                response = await callClaude(
                    apiKey,
                    testPrompt,
                    usedModel,
                    10,
                    0.5
                );
                break;

            case 'custom':
                usedModel = customModel || model || 'custom';
                response = await callCustomAPI({
                    apiUrl: customApiUrl,
                    apiKey,
                    prompt: testPrompt,
                    model: usedModel,
                    maxTokens: 10,
                    temperature: 0.5,
                    endpoint: customEndpoint,
                    format: customFormat
                });
                break;

            default:
                throw new Error(`Unknown provider: ${provider}`);
        }

        return {
            success: true,
            provider,
            model: usedModel,
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
                free: ['gemini-pro', 'gemini-1.0-pro'],
                pro: [
                    'gemini-pro',
                    'gemini-1.5-pro',
                    'gemini-1.5-flash',
                    'gemini-1.0-pro'
                ]
            },
            defaultModel: { free: 'gemini-pro', pro: 'gemini-pro' },
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
                pro: [
                    'claude-3-haiku-20240307',
                    'claude-3-sonnet-20240229',
                    'claude-3-opus-20240229'
                ]
            },
            defaultModel: {
                free: 'claude-3-haiku-20240307',
                pro: 'claude-3-haiku-20240307'
            },
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
