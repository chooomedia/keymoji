import emojisData from '../../../public/emojisArray.json';

interface EmojisData {
    emojis: string[];
}

export const KEYMOJI_LEVEL_MIN = 3;
export const KEYMOJI_LEVEL_MAX = 9;
export const KEYMOJI_LEVEL_DEFAULT = 9;

const emojis = (emojisData as EmojisData).emojis;

export interface KeymojiGenerationResult {
    emojis: string[];
    value: string;
    level: number;
}

export function clampKeymojiLevel(level: number): number {
    if (!Number.isFinite(level)) {
        return KEYMOJI_LEVEL_DEFAULT;
    }

    return Math.min(
        KEYMOJI_LEVEL_MAX,
        Math.max(KEYMOJI_LEVEL_MIN, Math.round(level))
    );
}

function cryptoRandomUint32(): number {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] ?? 0;
}

function cryptoRandomIndex(maxExclusive: number): number {
    if (maxExclusive <= 0) {
        return 0;
    }

    return cryptoRandomUint32() % maxExclusive;
}

export function generateKeymoji(level: number): KeymojiGenerationResult {
    const safeLevel = clampKeymojiLevel(level);

    if (!Array.isArray(emojis) || emojis.length === 0) {
        throw new Error('Emoji list is unavailable');
    }

    const pool = [...emojis];

    for (let index = pool.length - 1; index > 0; index -= 1) {
        const swapIndex = cryptoRandomIndex(index + 1);
        [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }

    const selectedEmojis = pool.slice(0, safeLevel);

    return {
        emojis: selectedEmojis,
        value: selectedEmojis.join(''),
        level: safeLevel
    };
}
