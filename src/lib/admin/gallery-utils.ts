/**
 * Extracts a YouTube video ID from any common URL format, or returns
 * the input unchanged if it's already just an ID.
 *
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - VIDEO_ID (raw, 11 characters)
 */
export function extractYouTubeId(input: string): string | null {
    const trimmed = input.trim();

    // Already a raw ID (YouTube IDs are 11 chars, URL-safe)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Builds YouTube's public thumbnail URL for a given video ID —
 * no API key needed, this endpoint is freely accessible.
 * Falls back gracefully: maxresdefault doesn't exist for all videos,
 * hqdefault always does.
 */
export function getYouTubeThumbnail(videoId: string, quality: "max" | "hq" = "hq"): string {
    const file = quality === "max" ? "maxresdefault" : "hqdefault";
    return `https://img.youtube.com/vi/${videoId}/${file}.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
}