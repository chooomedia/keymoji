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
import { isDevelopment } from '../utils/environment';

const emojis = emojisData.emojis;

/**
 * Timeout wrapper for fetch requests (Best Practice)
 * Prevents hanging requests and provides better UX
 * Enhanced CORS error detection and development-mode handling
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

        // Enhanced error detection
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - API took too long to respond');
        }

        // CORS error detection
        if (
            error.message?.includes('CORS') ||
            error.message?.includes('blocked by CORS') ||
            error.message?.includes('Access-Control-Allow-Origin')
        ) {
            throw new Error(
                'CORS_ERROR: Cross-Origin Request Blocked. Your custom API server needs to enable CORS for ' +
                    new URL(url).origin
            );
        }

        // Network error
        if (
            error.message?.includes('Failed to fetch') ||
            error.message?.includes('NetworkError') ||
            error.message?.includes('ERR_FAILED')
        ) {
            const isLocalhost =
                url.includes('127.0.0.1') || url.includes('localhost');
            if (isLocalhost) {
                throw new Error(
                    'NETWORK_ERROR: Cannot connect to ' +
                        url +
                        '. Is your local API server running?'
                );
            }
            throw new Error(
                'NETWORK_ERROR: Cannot connect to API. Check your internet connection and API URL.'
            );
        }

        throw error;
    }
}

/**
 * Get available emoji list as a formatted string for AI prompt
 * Only include valid emojis from our curated list
 */
function getAvailableEmojisForPrompt() {
    // Use the SAME emoji list as Random Mode (emojisData.emojis)
    // This ensures consistency between Random and Story Mode
    // Return ALL emojis joined with spaces for the AI prompt
    if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
        console.warn(
            '⚠️ [Story Mode] Emojis array is empty or invalid, using fallback'
        );
        return '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺ 😚 😙';
    }

    // Return ALL emojis (same as Random Mode uses in getRandomEmojis)
    // Join with spaces for the AI prompt
    return emojis.join(' ');
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

    if (provider === 'apertus') {
        // Apertus: OpenAI-compatible, straightforward prompt works best
        return basePrompt + '\n\nEmojis:';
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
export function getDefaultModel(provider, tier = 'free') {
    const models = {
        openai: tier === 'pro' ? 'gpt-4o-mini' : 'gpt-3.5-turbo',
        gemini: tier === 'pro' ? 'gemini-pro' : 'gemini-pro', // Most stable model
        mistral: tier === 'pro' ? 'mistral-small' : 'mistral-tiny',
        claude:
            tier === 'pro'
                ? 'claude-3-haiku-20240307'
                : 'claude-3-haiku-20240307',
        apertus: 'swiss-ai/apertus-70b-instruct', // Swiss LLM - strongest available model (70B)
        custom: '' // No default for custom
    };
    return models[provider] || 'swiss-ai/apertus-70b-instruct'; // Default to strongest Swiss LLM
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
                temperature: temperature ?? 0,
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
                temperature: temperature ?? 0,
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
 * Call Apertus (Swiss LLM) API via n8n Webhook
 * Uses n8n workflow endpoint configured via WEBHOOKS.APERTUS
 * Best Practices:
 * - Uses n8n workflow with token authentication
 * - Model: swiss-ai/apertus-70b-instruct (strongest available, 70B via HuggingFace)
 * - Token from environment variable (VITE_N8N_APERTUS_TOKEN)
 * - Webhook URL from environment variable (VITE_N8N_URL) or config default
 */
async function callApertus(apiKey, prompt, model, maxTokens, temperature) {
    const finalModel = model || 'swiss-ai/apertus-70b-instruct';

    // Import WEBHOOKS dynamically to avoid circular dependencies
    const { WEBHOOKS } = await import('../config/api.js');

    // Get n8n token from environment (fallback to empty string for dev)
    // In production, this should be set in .env files as VITE_N8N_APERTUS_TOKEN
    // SECURITY: Token is injected via webpack DefinePlugin from .env.local
    const rawToken =
        typeof import.meta !== 'undefined' &&
        import.meta.env?.VITE_N8N_APERTUS_TOKEN
            ? import.meta.env.VITE_N8N_APERTUS_TOKEN
            : (typeof process !== 'undefined' &&
                  process.env?.VITE_N8N_APERTUS_TOKEN) ||
              '';

    // Debug: Log raw token (before cleaning) - only in development
    if (
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1')
    ) {
        console.log('🔍 [Apertus] Raw token from env:', {
            exists: !!rawToken,
            type: typeof rawToken,
            length: rawToken?.length || 0,
            preview: rawToken
                ? `${String(rawToken).substring(0, 10)}...`
                : 'empty'
        });
    }

    // Clean token: remove quotes, whitespace, and JSON stringification artifacts
    let n8nToken = String(rawToken || '').trim();

    // Remove JSON stringification quotes (from webpack DefinePlugin)
    // This handles cases where the token is stringified as "token_value"
    n8nToken = n8nToken.replace(/^["']|["']$/g, '');

    // Remove URL-encoded quotes (%22)
    n8nToken = n8nToken.replace(/%22/g, '');

    // Remove any remaining quotes (shouldn't be necessary, but safety first)
    n8nToken = n8nToken.replace(/["']/g, '');

    // Final validation: check if token is placeholder or empty
    if (
        !n8nToken ||
        n8nToken.length === 0 ||
        n8nToken.includes('your_apertus_n8n_token_here') ||
        n8nToken === '""' ||
        n8nToken === "''" ||
        n8nToken.length < 10
    ) {
        console.error(
            '❌ [Apertus] VITE_N8N_APERTUS_TOKEN not set or is invalid. Webhook will reject request.'
        );
        console.error(
            '   💡 Run: npm run check:apertus-token to verify configuration'
        );
        console.error('   🔍 Raw token value:', rawToken);
        console.error('   🔍 Cleaned token:', n8nToken);
        console.error('   🔍 Token length:', n8nToken?.length || 0);

        // Throw error instead of silently continuing with empty token
        throw new Error(
            'VITE_N8N_APERTUS_TOKEN is not set or invalid. ' +
                'Please set it in .env.local and restart the dev server. ' +
                'Run: npm run check:apertus-token to verify.'
        );
    } else {
        // Debug: Log token status (without exposing the actual token)
        console.log('✅ [Apertus] Token loaded and validated:', {
            length: n8nToken.length,
            preview: `${n8nToken.substring(0, 4)}...${n8nToken.substring(
                n8nToken.length - 4
            )}`,
            isValid: true
        });
    }

    // Debug: Log URL before fetch
    const apertusUrl = WEBHOOKS.APERTUS;
    console.log('🔗 [Apertus] Calling webhook:', apertusUrl);
    console.log(
        '🔍 [Debug] URL type:',
        typeof apertusUrl,
        'Length:',
        apertusUrl?.length
    );

    // Validate URL
    if (
        !apertusUrl ||
        typeof apertusUrl !== 'string' ||
        !apertusUrl.startsWith('http')
    ) {
        console.error('❌ Invalid APERTUS URL:', apertusUrl);
        throw new Error('Invalid APERTUS URL configuration');
    }

    const response = await fetchWithTimeout(
        apertusUrl,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                model: finalModel,
                max_tokens: maxTokens || 512,
                temperature: temperature ?? 0,
                language: 'Deutsch', // Default language
                token: n8nToken // n8n webhook authentication token (required for security)
            })
        },
        120000 // 120 second timeout (n8n workflows can take longer)
    );

    // Get response text first (for better error handling)
    const responseText = await response.text();
    console.log(
        '📥 [Apertus] Raw response text:',
        responseText.substring(0, 500)
    );
    console.log(
        '📥 [Apertus] Response status:',
        response.status,
        response.statusText
    );
    console.log(
        '📥 [Apertus] Response headers:',
        Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
        // Try to parse error as JSON, fallback to text
        let errorData = {};
        try {
            if (responseText) {
                errorData = JSON.parse(responseText);
            }
        } catch (e) {
            // Not JSON, use text as error message
            console.warn(
                '⚠️ [Apertus] Error response is not JSON:',
                responseText
            );
            throw new Error(
                `Apertus n8n API error: ${response.status} ${
                    response.statusText
                }. Response: ${responseText.substring(0, 200)}`
            );
        }

        throw new Error(
            errorData.error?.message ||
                errorData.message ||
                `Apertus n8n API error: ${response.status} ${response.statusText}`
        );
    }

    // Check if response is empty
    if (!responseText || responseText.trim().length === 0) {
        console.error('❌ [Apertus] Empty response from n8n webhook');
        console.error('   💡 Check n8n workflow execution logs for errors');
        console.error(
            '   💡 Ensure "Respond to Webhook" node is connected and configured'
        );
        console.error(
            '   💡 Verify "Call Apertus" node succeeds (not error branch)'
        );
        throw new Error(
            'Empty response from Apertus n8n workflow. ' +
                'The workflow may have failed or the "Respond to Webhook" node is not returning data. ' +
                'Please check the n8n workflow execution logs.'
        );
    }

    // Parse JSON response
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        console.error('❌ [Apertus] Failed to parse JSON response:', e);
        console.error('❌ [Apertus] Response text:', responseText);
        throw new Error(
            `Invalid JSON response from Apertus n8n workflow. Response: ${responseText.substring(
                0,
                200
            )}`
        );
    }

    console.log(
        '📥 [Apertus] Parsed response data:',
        JSON.stringify(data, null, 2)
    );
    console.log(
        '📥 [Apertus] Response type:',
        Array.isArray(data) ? 'Array' : typeof data
    );

    // Handle n8n workflow response format
    // n8n can return either an object or an array (depending on workflow configuration)

    // Case 1: Response is an array (n8n sometimes wraps responses in arrays)
    if (Array.isArray(data)) {
        console.log('📦 [Apertus] Response is array, length:', data.length);

        // Try to find response in array elements
        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            // Check if item has response field (and it's not empty)
            if (item && typeof item === 'object') {
                // Check for OpenAI-compatible format first (choices[0].message.content)
                if (item.choices && item.choices[0]?.message?.content) {
                    const content = item.choices[0].message.content;
                    if (content && content.trim().length > 0) {
                        console.log(
                            `✅ [Apertus] Found OpenAI format in array[${i}]:`,
                            content.substring(0, 100)
                        );
                        return content;
                    }
                }

                // Check response field (must not be empty)
                if (item.response && item.response.trim().length > 0) {
                    console.log(
                        `✅ [Apertus] Found response in array[${i}]:`,
                        item.response.substring(0, 100)
                    );
                    return item.response;
                }

                // Check text field
                if (item.text && item.text.trim().length > 0) {
                    console.log(
                        `✅ [Apertus] Found text in array[${i}]:`,
                        item.text.substring(0, 100)
                    );
                    return item.text;
                }

                // Check content field
                if (item.content) {
                    let content =
                        typeof item.content === 'string'
                            ? item.content
                            : item.content.text || item.content[0]?.text || '';
                    if (content && content.trim().length > 0) {
                        console.log(
                            `✅ [Apertus] Found content in array[${i}]:`,
                            content.substring(0, 100)
                        );
                        return content;
                    }
                }
            } else if (typeof item === 'string' && item.trim().length > 0) {
                console.log(
                    `✅ [Apertus] Found string in array[${i}]:`,
                    item.substring(0, 100)
                );
                return item;
            }
        }

        // If array contains objects, try to extract from first element
        if (data.length > 0 && typeof data[0] === 'object') {
            const firstItem = data[0];

            // Try OpenAI format first
            if (firstItem.choices && firstItem.choices[0]?.message?.content) {
                const content = firstItem.choices[0].message.content;
                if (content && content.trim().length > 0) {
                    console.log(
                        '✅ [Apertus] Extracted OpenAI format from first array element'
                    );
                    return content;
                }
            }

            // Try other fields (response, text, content)
            const extracted =
                firstItem.response || firstItem.text || firstItem.content;
            if (extracted) {
                const content =
                    typeof extracted === 'string'
                        ? extracted
                        : extracted.text || '';
                if (content && content.trim().length > 0) {
                    console.log(
                        '✅ [Apertus] Extracted from first array element:',
                        content.substring(0, 100)
                    );
                    return content;
                }
            }

            // Check if success is true but response is empty (n8n workflow issue)
            if (
                firstItem.success === true &&
                (!firstItem.response || firstItem.response.trim().length === 0)
            ) {
                console.warn(
                    '⚠️ [Apertus] n8n workflow returned success=true but empty response. Full data:',
                    JSON.stringify(firstItem, null, 2)
                );
                throw new Error(
                    'Apertus API returned empty response. The workflow executed successfully but the AI model returned no content. ' +
                        'Please check the n8n workflow "Format Response" node - it should extract the content from choices[0].message.content or the API response field. ' +
                        `Current response structure: ${JSON.stringify(
                            firstItem,
                            null,
                            2
                        )}`
                );
            }
        }

        // If we get here, the response field exists but is empty
        // This means the API call succeeded but returned empty content
        console.warn(
            '⚠️ [Apertus] Response field exists but is empty. API call succeeded but no content returned.'
        );
        throw new Error(
            'Apertus API returned empty response. The workflow executed successfully but the AI model returned no content. ' +
                'Please check the n8n workflow "Format Response" node - it should extract the content from the API response.'
        );
    }

    // Case 2: Response is an object
    if (data && typeof data === 'object') {
        // Try OpenAI-compatible format first (most common)
        if (data.choices && data.choices[0]?.message?.content) {
            const content = data.choices[0].message.content;
            if (content && content.trim().length > 0) {
                console.log(
                    '✅ [Apertus] Found OpenAI format:',
                    content.substring(0, 100)
                );
                return content;
            }
        }

        // The workflow returns: { response: "...", usage: {...}, ... }
        if (data.response && data.response.trim().length > 0) {
            console.log(
                '✅ [Apertus] Found response field:',
                data.response.substring(0, 100)
            );
            return data.response;
        }

        // Try other common formats
        if (data.content) {
            const content =
                typeof data.content === 'string'
                    ? data.content
                    : data.content.text || data.content[0]?.text || '';
            if (content && content.trim().length > 0) {
                console.log(
                    '✅ [Apertus] Found content field:',
                    content.substring(0, 100)
                );
                return content;
            }
        }

        if (data.text && data.text.trim().length > 0) {
            console.log(
                '✅ [Apertus] Found text field:',
                data.text.substring(0, 100)
            );
            return data.text;
        }

        if (data.message && data.message.trim().length > 0) {
            console.log(
                '✅ [Apertus] Found message field:',
                data.message.substring(0, 100)
            );
            return data.message;
        }

        // If response field exists but is empty, provide helpful error
        if (data.response !== undefined && data.response.trim().length === 0) {
            console.warn(
                '⚠️ [Apertus] Response field exists but is empty. Full data:',
                JSON.stringify(data, null, 2)
            );
            throw new Error(
                'Apertus API returned empty response. The workflow executed successfully but the AI model returned no content. ' +
                    'Please check the n8n workflow "Format Response" node - it should extract the content from choices[0].message.content.'
            );
        }
    }

    // Case 3: Response is a string
    if (typeof data === 'string') {
        console.log('✅ [Apertus] Response is string:', data.substring(0, 100));
        return data;
    }

    // Enhanced error message with response structure
    const responseType = Array.isArray(data) ? 'Array' : typeof data;
    const responseInfo = Array.isArray(data)
        ? `Array with ${data.length} elements`
        : `Object with keys: ${Object.keys(data).join(', ')}`;

    console.error(
        '❌ [Apertus] Invalid response format. Response type:',
        responseType,
        responseInfo
    );
    throw new Error(
        `Invalid response format from Apertus n8n workflow. Received: ${responseInfo}`
    );
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
                    temperature: temperature ?? 0,
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
                temperature: temperature ?? 0,
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

    console.log('🌐 [Custom API] Request details:', {
        fullUrl,
        endpoint,
        format,
        model,
        hasApiKey: !!apiKey
    });

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
                temperature: temperature ?? 0,
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

    console.log('📤 [Custom API] Request body:', JSON.stringify(body, null, 2));

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

    console.log(
        '📥 [Custom API] Response status:',
        response.status,
        response.statusText
    );

    if (!response.ok) {
        const error = await response.text();
        console.error('❌ [Custom API] Error response:', error);
        throw new Error(error || 'Custom API error');
    }

    const data = await response.json();
    console.log('✅ [Custom API] Response data:', data);

    // Try common response formats
    const result =
        data.choices?.[0]?.message?.content || // OpenAI format
        data.content?.[0]?.text || // Claude format
        data.response ||
        data.text ||
        data.content ||
        data.emojis ||
        '';

    console.log('🎯 [Custom API] Extracted result:', result);
    return result;
}

/**
 * Simple hash function for creating deterministic, short cache keys
 * Uses djb2 algorithm (fast, good distribution, no external dependencies)
 */
function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to positive hex string (always 8 chars)
    return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Get cache key for story generation
 * CRITICAL: Uses hash to prevent extremely long keys that break localStorage
 * localStorage keys should be short and safe (no special chars, reasonable length)
 */
function getCacheKey(text, emojiCount, provider, model) {
    // Normalize text for consistent hashing
    const normalized = text.toLowerCase().trim();
    
    // Create a unique string from all parameters
    const keyString = `${provider}_${model}_${emojiCount}_${normalized}`;
    
    // Hash the key string to create a short, deterministic key
    // This prevents:
    // 1. Extremely long keys (localStorage has practical limits)
    // 2. Special character issues (Umlaute, spaces, slashes, etc.)
    // 3. Key collisions are extremely unlikely with hash
    const hash = hashString(keyString);
    
    // Create final key: story_cache_<provider>_<model>_<emojiCount>_<hash>
    // This keeps it readable for debugging while being safe
    const safeProvider = String(provider || 'unknown').replace(/[^a-z0-9]/gi, '_');
    const safeModel = String(model || 'default').replace(/[^a-z0-9]/gi, '_');
    
    return `story_${safeProvider}_${safeModel}_${emojiCount}_${hash}`;
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
        tier,
        forceRegenerate = false
    } = storyModeConfig;

    // Skip API key validation for Apertus (uses n8n token from environment)
    if (provider !== 'apertus' && !apiKey) {
        throw new Error('API key is required for story mode');
    }

    // Check cache first (skip if forceRegenerate is true)
    if (cacheResults !== false && !forceRegenerate) {
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
    } else if (forceRegenerate) {
        console.log('🔄 Force regenerate: Skipping cache lookup');
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

            case 'apertus':
                aiResponse = await callApertus(
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

        // DEVELOPMENT MODE: CORS Mock Mode for Custom API Testing
        if (
            isDevelopment() &&
            provider === 'custom' &&
            customApiUrl &&
            (customApiUrl.includes('127.0.0.1') ||
                customApiUrl.includes('localhost'))
        ) {
            // Check for URL parameter to enable mock mode
            const urlParams = new URLSearchParams(window.location.search);
            const mockMode = urlParams.get('mock-custom-api') === 'true';

            if (mockMode) {
                console.log(
                    '🧪 [DEV] Using MOCK response for Custom API (CORS bypass)'
                );
                response = '🧪'; // Return test emoji
                return {
                    success: true,
                    provider: 'custom',
                    model: usedModel,
                    response: '[MOCK] CORS bypass - Testing locally',
                    mocked: true
                };
            }
        }

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

            case 'apertus':
                usedModel = model || 'swiss-ai/apertus-70b-instruct';
                // For Apertus, token is loaded from environment in callApertus
                // Pass empty string as apiKey - callApertus will load token internally
                console.log(
                    '🧪 [Apertus Test] Calling callApertus with empty API key (token loaded from env)'
                );
                try {
                    response = await callApertus(
                        '', // Empty API key for Apertus (token handled internally via VITE_N8N_APERTUS_TOKEN)
                        testPrompt,
                        usedModel,
                        10,
                        0.5
                    );

                    // Additional check: Even if callApertus didn't throw, verify response is not empty
                    if (!response || response.trim().length === 0) {
                        throw new Error(
                            'Apertus API returned empty response. The workflow executed successfully but the AI model returned no content. ' +
                                'Please check the n8n workflow "Format Response" node - it should extract the content from choices[0].message.content.'
                        );
                    }
                } catch (error) {
                    // Re-throw with enhanced error message for empty responses
                    if (
                        error.message.includes('empty response') ||
                        error.message.includes('no content')
                    ) {
                        throw error; // Already has good error message
                    }
                    throw error; // Re-throw other errors as-is
                }
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

        // Final validation: Ensure response is not empty before returning success
        if (!response || (typeof response === 'string' && response.trim().length === 0)) {
            throw new Error(
                'AI provider returned empty response. The API call succeeded but no content was returned. ' +
                'Please check the API response format and ensure the content is properly extracted.'
            );
        }

        return {
            success: true,
            provider,
            model: usedModel,
            response: typeof response === 'string' ? response.substring(0, 100) : String(response).substring(0, 100) // First 100 chars
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
        apertus: {
            name: 'Apertus (Swiss LLM)',
            models: {
                free: [
                    'swiss-ai/apertus-70b-instruct',
                    'swiss-ai/apertus-8b-instruct'
                ],
                pro: [
                    'swiss-ai/apertus-70b-instruct',
                    'swiss-ai/apertus-8b-instruct'
                ]
            },
            defaultModel: {
                free: 'swiss-ai/apertus-70b-instruct',
                pro: 'swiss-ai/apertus-70b-instruct'
            },
            apiKeyPrefix: '',
            docsUrl: 'https://aimi.matt-interfaces.ch/api'
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

// Functions are already exported individually above (export async function, export function)
// Default export for backward compatibility
export default {
    generateStoryEmojis,
    clearStoryCache,
    getStoryCacheStats,
    testAIProvider,
    getDefaultModel,
    getProviderInfo
};
