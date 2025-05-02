// Neue Datei: src/services/emojiService.js
// Enthält die API-Interaktionsfunktionen
import { WEBHOOKS } from '../config/api.js';

export async function generateRandomEmojis(count) {
    try {
        const response = await fetch(`${WEBHOOKS.RANDOM_EMOJI}?count=${count}`);
        if (!response.ok) throw new Error('Failed to fetch random emojis');
        const data = await response.json();
        return data.emojis;
    } catch (error) {
        console.error('Error generating random emojis:', error);
        throw error;
    }
}

export async function generateEmojiStory(storyInput, emojiCount) {
    try {
        const response = await fetch(WEBHOOKS.STORY_GENERATOR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ emojiCount, storyInput })
        });

        if (!response.ok) throw new Error('Failed to fetch emoji story');
        return await response.json();
    } catch (error) {
        console.error('Error generating emoji story:', error);
        throw error;
    }
}
